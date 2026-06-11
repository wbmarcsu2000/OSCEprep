/**
 * App store: thin orchestration over the pure engine. All clinical gating and
 * scoring decisions happen in src/engine; this store sequences async LLM
 * assistance (classification + phrasing) around those engine calls and
 * persists state for refresh-resume.
 */

import { create } from "zustand";
import type { CaseModel, EngineState, Mode } from "../engine/types";
import {
  createSession,
  transition,
  tick as engineTick,
  askQuestion,
  doManeuver,
  saveAnswer,
  commitWorkup,
  viewDiagnostic,
  setScratchpad,
  submit,
  neutralNegative,
  SESSION_STORAGE_KEY,
  serializeSession,
  deserializeSession,
} from "../engine/stateMachine";
import type { LlmMatches } from "../engine/scoringEngine";
import { loadCase, manifest, scoreBands } from "../data/loader";
import { breadthCreditForCategory } from "../data/curriculum";
import {
  createProvider,
  LLM_KEY_STORAGE,
  LLM_MODEL_STORAGE,
  type LlmProvider,
  type ProviderKind,
} from "../llm/LlmAdapter";
import { recordAttempt, loadReview, type CaseReview } from "../analytics/store";
import { looseCovered } from "../engine/textMatch";

const WRAPPERS = {
  patientSystemWrapper: manifest.defaults.patientSystemWrapper,
  examinerSystemWrapper: manifest.defaults.examinerSystemWrapper,
};

// Mutable so the API key can be set at runtime without a reload.
let provider: LlmProvider;
let llmEnabled: boolean;
let providerKind: ProviderKind | null;
({ provider, llmEnabled, providerKind } = createProvider(WRAPPERS));

interface AppState {
  view: "home" | "select" | "station" | "analytics" | "review" | "skills" | "drills";
  /** When set, the Case Select screen opens the Enable-AI panel on mount. */
  pendingAiPanel: boolean;
  caseModel: CaseModel | null;
  engine: EngineState | null;
  llmEnabled: boolean;
  providerKind: ProviderKind | null;
  /** Verification of the configured key: a one-shot test call result. */
  aiStatus: "idle" | "verifying" | "ok" | "error";
  aiError: string | null;
  spThinking: boolean;
  /** AI coaching notes by stepId (when AI enabled), shown in feedback. */
  coaching: Record<string, string>;
  /** A completed case opened for review (read-only feedback). */
  review: CaseReview | null;
  startCase: (id: string, mode: Mode) => Promise<void>;
  startRandomCase: (mode: Mode, candidateIds: string[]) => Promise<void>;
  resumeSession: () => Promise<boolean>;
  exitToSelect: () => void;
  showHome: () => void;
  showStations: () => void;
  showAnalytics: () => void;
  showSkills: () => void;
  showDrills: () => void;
  showEnableAi: () => void;
  clearPendingAiPanel: () => void;
  openReview: (caseId: string) => void;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  verifyAi: () => Promise<void>;
  /** Which of `items` the answer covers — semantic (AI) when enabled, else a
   *  lenient deterministic match. Used by the Drills learning tool. */
  gradeCoverage: (answer: string, items: string[]) => Promise<string[]>;
  tick: () => void;
  beginEncounter: () => void;
  endEncounterEarly: () => void;
  ask: (text: string) => Promise<void>;
  performManeuver: (id: string) => void;
  updateScratchpad: (text: string) => void;
  saveStepAnswer: (stepId: string, text: string) => void;
  commitWorkupStep: () => void;
  markDiagnosticViewed: (key: string) => void;
  submitStation: () => Promise<void>;
  // Dev-only testing helpers (toolbar shown only in Vite DEV mode).
  devSkipPhase: () => void;
  devFillIdeal: () => void;
  devAutocompleteStation: () => Promise<void>;
}

function persist(engine: EngineState | null) {
  try {
    if (engine) localStorage.setItem(SESSION_STORAGE_KEY, serializeSession(engine));
    else localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // storage unavailable (private mode) — session simply won't resume
  }
}

function setEngine(
  set: (partial: Partial<AppState>) => void,
  engine: EngineState,
) {
  persist(engine);
  set({ engine });
}

/** The SP delivers the case-authored opening statement (verbatim case JSON)
 *  when the student enters the room. */
function withOpening(engine: EngineState, caseModel: CaseModel): EngineState {
  if (engine.currentState !== "PATIENT_ENCOUNTER" || engine.conversation.length > 0) {
    return engine;
  }
  return {
    ...engine,
    conversation: [{ role: "patient", text: caseModel.opening, kind: "speech" }],
  };
}

/** Collect LLM-assisted rubric matches for grading. Deterministic matching in
 *  the engine always runs regardless; this only ADDs semantic matches, each
 *  validated against case metadata inside the scoring engine. */
async function collectLlmMatches(
  caseModel: CaseModel,
  engine: EngineState,
): Promise<LlmMatches> {
  if (!llmEnabled) return {};
  const matches: LlmMatches = {};
  const jobs: Promise<void>[] = [];
  for (const step of caseModel.steps) {
    const answer = engine.postEncounterAnswers[step.id] ?? "";
    if (!answer || !step.scoring) continue;
    const items = [
      ...step.scoring.criticalActions,
      ...step.scoring.coreActions,
      ...step.scoring.bonusActions,
    ].map((i) => ({ id: i.item, concepts: [i.item] }));
    if (items.length === 0) continue;
    jobs.push(
      provider
        .classifyIntent(answer, items)
        .then((ids) => {
          matches[step.id] = ids;
        })
        .catch(() => {}),
    );
  }
  const comm = caseModel.communication;
  if (comm) {
    const turns = engine.conversation
      .filter((t) => t.role === "student")
      .map((t) => t.text)
      .join("\n");
    if (turns) {
      jobs.push(
        provider
          .classifyIntent(
            turns,
            comm.items.map((i) => ({ id: i.item, concepts: [i.item] })),
          )
          .then((ids) => {
            matches["communication"] = ids;
          })
          .catch(() => {}),
      );
    }
  }
  await Promise.all(jobs);
  return matches;
}

/** Generate short AI coaching notes per answered step (best-effort, async). */
async function collectCoaching(
  caseModel: CaseModel,
  engine: EngineState,
): Promise<Record<string, string>> {
  if (!llmEnabled) return {};
  const out: Record<string, string> = {};
  await Promise.all(
    caseModel.steps.map(async (step) => {
      const answer = engine.postEncounterAnswers[step.id] ?? "";
      if (!step.idealAnswer) return;
      const note = await provider.coachAnswer({
        step: step.label,
        prompt: step.prompt,
        studentAnswer: answer,
        idealAnswer: step.idealAnswer,
        rubric: step.rubric ?? "",
      });
      if (note) out[step.id] = note;
    }),
  );
  return out;
}

export const useAppStore = create<AppState>((set, get) => ({
  view: "home",
  pendingAiPanel: false,
  caseModel: null,
  engine: null,
  llmEnabled,
  providerKind,
  aiStatus: "idle",
  aiError: null,
  spThinking: false,
  coaching: {},
  review: null,

  async startCase(id, mode) {
    const caseModel = await loadCase(id);
    const engine = createSession(caseModel, mode, Date.now());
    persist(engine);
    set({ caseModel, engine, view: "station", coaching: {}, review: null });
  },

  async startRandomCase(mode, candidateIds) {
    if (candidateIds.length === 0) return;
    // Deterministic-but-varied pick without Math.random (blocked): hash the
    // current clock into the candidate list.
    const idx = Date.now() % candidateIds.length;
    await get().startCase(candidateIds[idx], mode);
  },

  openReview(caseId) {
    const review = loadReview(caseId);
    if (review) set({ view: "review", review });
  },

  setApiKey(key) {
    try {
      const k = key.trim();
      if (k) localStorage.setItem(LLM_KEY_STORAGE, k);
      else localStorage.removeItem(LLM_KEY_STORAGE);
    } catch {
      // ignore storage failure
    }
    ({ provider, llmEnabled, providerKind } = createProvider(WRAPPERS));
    set({ llmEnabled, providerKind, aiStatus: "idle", aiError: null });
    if (llmEnabled) void get().verifyAi();
  },

  setModel(model) {
    try {
      if (model) localStorage.setItem(LLM_MODEL_STORAGE, model);
      else localStorage.removeItem(LLM_MODEL_STORAGE);
    } catch {
      // ignore storage failure
    }
    ({ provider, llmEnabled, providerKind } = createProvider(WRAPPERS));
    set({ llmEnabled, providerKind, aiStatus: "idle", aiError: null });
    if (llmEnabled) void get().verifyAi();
  },

  async verifyAi() {
    if (!llmEnabled) {
      set({ aiStatus: "idle", aiError: null });
      return;
    }
    set({ aiStatus: "verifying", aiError: null });
    try {
      await provider.verify();
      set({ aiStatus: "ok", aiError: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // Trim the often-verbose SDK error to something readable.
      set({ aiStatus: "error", aiError: msg.slice(0, 160) });
    }
  },

  async gradeCoverage(answer, items) {
    if (!answer.trim() || items.length === 0) return [];
    if (llmEnabled) {
      try {
        const ids = await provider.classifyIntent(
          answer,
          items.map((i) => ({ id: i, concepts: [i] })),
        );
        if (ids.length > 0) return ids;
        // empty result with AI on can be a miss OR a flake — fall through to
        // the deterministic match so the student isn't under-credited.
      } catch {
        // fall through to deterministic
      }
    }
    return items.filter((i) => looseCovered(answer, i));
  },

  async resumeSession() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return false;
      const engine = deserializeSession(raw);
      if (!engine) return false;
      const caseModel = await loadCase(engine.caseId);
      set({ caseModel, engine, view: "station" });
      return true;
    } catch {
      return false;
    }
  },

  exitToSelect() {
    persist(null);
    set({ view: "select", caseModel: null, engine: null, review: null });
  },

  showHome() {
    set({ view: "home" });
  },

  showStations() {
    set({ view: "select" });
  },

  showAnalytics() {
    set({ view: "analytics" });
  },

  showSkills() {
    set({ view: "skills" });
  },

  showDrills() {
    set({ view: "drills" });
  },

  showEnableAi() {
    set({ view: "select", pendingAiPanel: true });
  },

  clearPendingAiPanel() {
    set({ pendingAiPanel: false });
  },

  tick() {
    const { engine, caseModel } = get();
    if (!engine || !caseModel) return;
    const wasPost = engine.currentState === "POST_ENCOUNTER";
    const next = engineTick(
      engine,
      caseModel,
      Date.now(),
      scoreBands,
      {},
      breadthCreditForCategory(caseModel.category),
    );
    if (next === engine) return;
    if (wasPost && next.submitted && !engine.submitted) {
      recordAttempt(caseModel, next);
    }
    setEngine(set, withOpening(next, caseModel));
  },

  beginEncounter() {
    const { engine, caseModel } = get();
    if (!engine || !caseModel) return;
    setEngine(
      set,
      withOpening(transition(engine, "PATIENT_ENCOUNTER", caseModel, Date.now()), caseModel),
    );
  },

  endEncounterEarly() {
    const { engine, caseModel } = get();
    if (!engine || !caseModel) return;
    setEngine(set, transition(engine, "POST_ENCOUNTER", caseModel, Date.now()));
  },

  async ask(text) {
    const { engine, caseModel } = get();
    if (!engine || !caseModel || engine.patientLocked) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    let withStudent: EngineState = {
      ...engine,
      conversation: [
        ...engine.conversation,
        { role: "student", text: trimmed, kind: "speech" },
      ],
    };
    setEngine(set, withStudent);
    set({ spThinking: true });

    try {
      let classified: string[] | undefined;
      if (llmEnabled && caseModel.historyTriggers.length > 0) {
        try {
          classified = await provider.classifyIntent(
            trimmed,
            caseModel.historyTriggers.map((t) => ({ id: t.id, concepts: t.concepts })),
          );
        } catch {
          classified = undefined; // deterministic matching still applies
        }
      }
      const result = askQuestion(withStudent, caseModel, trimmed, classified);
      withStudent = result.state;

      let replyText: string;
      if (result.revealedContent.length === 0) {
        // Open-ended prompts with no specific match re-anchor on the authored
        // opening statement (verbatim case content); everything else gets a
        // fixed neutral negative.
        const openEnded =
          /\b(what brings|tell me|describe|go on|how are you|what'?s going on|more about|start from the beginning)\b/i.test(
            trimmed,
          );
        if (openEnded) {
          const repeated = withStudent.conversation.some(
            (t) => t.role === "patient" && t.text.includes(caseModel.opening),
          );
          const phrased = await provider.phrasePatientReply(caseModel.opening, caseModel.sp, trimmed);
          replyText = repeated ? `Like I said — ${phrased}` : phrased;
        } else {
          // With AI on, answer the off-target question in character (a natural
          // reasonable-negative grounded only in the question/persona — see
          // answerOffTarget). Falls back to a fixed neutral line otherwise.
          const ai = llmEnabled ? await provider.answerOffTarget(caseModel.sp, trimmed) : null;
          replyText = ai ?? neutralNegative(trimmed);
        }
      } else {
        // Newline-separated so each fact phrases as its own sentence.
        const approved = result.revealedContent.join("\n");
        replyText = await provider.phrasePatientReply(approved, caseModel.sp, trimmed);
      }
      const next: EngineState = {
        ...withStudent,
        conversation: [
          ...withStudent.conversation,
          { role: "patient", text: replyText, kind: "speech" },
        ],
      };
      setEngine(set, next);
    } finally {
      set({ spThinking: false });
    }
  },

  performManeuver(id) {
    const { engine, caseModel } = get();
    if (!engine || !caseModel || engine.patientLocked) return;
    const result = doManeuver(engine, caseModel, id);
    const next: EngineState = {
      ...result.state,
      conversation: [
        ...result.state.conversation,
        ...result.findings.map((f) => ({
          role: "patient" as const,
          text: f,
          kind: "exam" as const,
        })),
      ],
    };
    setEngine(set, next);
  },

  updateScratchpad(text) {
    const { engine } = get();
    if (!engine) return;
    setEngine(set, setScratchpad(engine, text));
  },

  saveStepAnswer(stepId, text) {
    const { engine } = get();
    if (!engine) return;
    setEngine(set, saveAnswer(engine, stepId, text));
  },

  commitWorkupStep() {
    const { engine } = get();
    if (!engine) return;
    setEngine(set, commitWorkup(engine));
  },

  markDiagnosticViewed(key) {
    const { engine } = get();
    if (!engine) return;
    setEngine(set, viewDiagnostic(engine, key));
  },

  // ---- Dev testing helpers --------------------------------------------------

  devSkipPhase() {
    const { engine, caseModel } = get();
    if (!engine || !caseModel) return;
    const now = Date.now();
    if (engine.currentState === "CHART_REVIEW") {
      setEngine(set, withOpening(transition(engine, "PATIENT_ENCOUNTER", caseModel, now), caseModel));
    } else if (engine.currentState === "PATIENT_ENCOUNTER") {
      setEngine(set, transition(engine, "POST_ENCOUNTER", caseModel, now));
    } else if (engine.currentState === "POST_ENCOUNTER") {
      void get().submitStation();
    }
  },

  devFillIdeal() {
    const { engine, caseModel } = get();
    if (!engine || !caseModel) return;
    let next = engine;
    for (const step of caseModel.steps) {
      const ideal = step.idealAnswer ?? "(dev) see assessment";
      next = saveAnswer(next, step.id, ideal);
    }
    next = commitWorkup(next);
    setEngine(set, next);
  },

  async devAutocompleteStation() {
    const { caseModel } = get();
    if (!caseModel) return;
    // March to post-encounter, fill ideal answers, submit.
    get().devSkipPhase(); // chart → encounter
    get().devSkipPhase(); // encounter → post
    get().devFillIdeal();
    await get().submitStation();
  },

  async submitStation() {
    const { engine, caseModel } = get();
    if (!engine || !caseModel || engine.submitted) return;
    const llmMatches = await collectLlmMatches(caseModel, engine);
    const next = submit(
      engine,
      caseModel,
      scoreBands,
      Date.now(),
      llmMatches,
      breadthCreditForCategory(caseModel.category),
    );
    if (next.submitted && !engine.submitted) {
      recordAttempt(caseModel, next);
    }
    setEngine(set, next);
    // AI coaching notes load in the background and fill in once ready.
    if (llmEnabled) {
      collectCoaching(caseModel, next)
        .then((coaching) => set({ coaching }))
        .catch(() => {});
    }
  },
}));
