/**
 * App store: thin orchestration over the pure engine. All clinical gating and
 * scoring decisions happen in src/engine; this store sequences async LLM
 * assistance (classification + phrasing) around those engine calls, persists
 * state for refresh-resume, and mirrors the current view into the URL hash so
 * browser Back/refresh/deep-links behave.
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
  setLlmFallbackListener,
  LLM_KEY_STORAGE,
  LLM_MODEL_STORAGE,
  type LlmProvider,
  type ProviderKind,
} from "../llm/LlmAdapter";
import {
  attachCoaching,
  loadAttempts,
  recordAttempt,
  loadReview,
  type CaseReview,
} from "../analytics/store";
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

export type View = "home" | "select" | "station" | "analytics" | "review" | "skills" | "drills";

/** Last-chosen station mode, persisted so a chosen mode sticks. Defaults to
 *  Practice (the guided reveal+teach tutor) until the user explicitly picks
 *  Strict OSCE; Strict is opt-in for timed-exam rehearsal. */
const MODE_STORAGE = "osce.mode";
function initialMode(): Mode {
  try {
    const stored = localStorage.getItem(MODE_STORAGE);
    if (stored === "STRICT_OSCE" || stored === "PRACTICE") return stored;
  } catch {
    // localStorage unavailable — fall through to the default
  }
  return "PRACTICE";
}

/** An interrupted station found in storage — surfaced as a banner, never
 *  silently re-entered (a stale strict-mode deadline would instantly
 *  auto-submit a half-empty attempt into the analytics). */
export interface PendingResume {
  engine: EngineState;
  caseModel: CaseModel;
}

interface AppState {
  view: View;
  /** When set, the Case Select screen opens the Enable-AI panel on mount. */
  pendingAiPanel: boolean;
  /** When set, the Case Select screen pre-applies this category filter. */
  pendingCategoryFilter: string | null;
  caseModel: CaseModel | null;
  engine: EngineState | null;
  pendingResume: PendingResume | null;
  /** Sticky station mode (Strict vs Practice), persisted across sessions. */
  preferredMode: Mode;
  llmEnabled: boolean;
  providerKind: ProviderKind | null;
  /** Verification of the configured key: a one-shot test call result. */
  aiStatus: "idle" | "verifying" | "ok" | "error";
  aiError: string | null;
  /** Set when an AI call failed mid-session and the engine fallback answered
   *  instead (e.g. "patient replies") — surfaced so "AI on" never lies.
   *  Cleared automatically when a later AI call succeeds. */
  aiDegraded: string | null;
  /** Short failure detail from the last degraded call (e.g. "401 …"). */
  aiDegradedDetail: string | null;
  spThinking: boolean;
  /** Submission in flight (AI rubric matching can take seconds). */
  grading: boolean;
  /** The post-encounter clock ran out — grading was started automatically. */
  timeExpired: boolean;
  /** AI coaching notes by stepId (when AI enabled), shown in feedback. */
  coaching: Record<string, string>;
  coachingPending: boolean;
  /** A completed case opened for review (read-only feedback). */
  review: CaseReview | null;
  setView: (view: View) => void;
  startCase: (id: string, mode: Mode) => Promise<void>;
  startRandomCase: (mode: Mode, candidateIds: string[]) => Promise<void>;
  /** Random pick preferring never-attempted cases; pool defaults to the whole library. */
  startRandomUnattempted: (mode: Mode, pool?: string[]) => Promise<void>;
  resumeSession: () => Promise<boolean>;
  acceptResume: () => void;
  discardResume: () => void;
  exitToSelect: () => void;
  showEnableAi: () => void;
  clearPendingAiPanel: () => void;
  browseCategory: (category: string) => void;
  clearPendingCategoryFilter: () => void;
  openReview: (caseId: string) => void;
  setPreferredMode: (mode: Mode) => void;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  verifyAi: () => Promise<void>;
  /** Which of `items` the answer covers — semantic (AI) when enabled, else a
   *  lenient deterministic match. Used by the Drills learning tool. */
  gradeCoverage: (answer: string, items: string[]) => Promise<string[]>;
  /** A short AI coaching note on a free-text drill answer (work-up, etc.) —
   *  what was good and the single most important thing to add. null when AI is
   *  off, the answer/ideal are empty, or the call fails. */
  coachDrill: (input: { prompt: string; studentAnswer: string; idealAnswer: string; rubric: string }) => Promise<string | null>;
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

// ---- URL hash routing ---------------------------------------------------------

const VIEW_HASH: Record<View, string> = {
  home: "#/",
  select: "#/stations",
  drills: "#/drills",
  skills: "#/skills",
  analytics: "#/performance",
  review: "#/review",
  station: "#/station",
};

function hashFor(view: View, review: CaseReview | null): string {
  if (view === "review" && review) return `#/review/${encodeURIComponent(review.caseId)}`;
  return VIEW_HASH[view];
}

/** Mirror the store view into the URL (no-op when already there). */
function syncHash(): void {
  try {
    const { view, review } = useAppStore.getState();
    const target = hashFor(view, review);
    const current = window.location.hash || "#/";
    if (current !== target) window.history.pushState(null, "", target);
  } catch {
    // non-browser environment (tests) — routing is cosmetic there
  }
}

/** Apply a URL hash to the store (initial load + popstate). */
export function applyHash(hash: string): void {
  const h = hash || "#/";
  const s = useAppStore.getState();
  if (h.startsWith("#/review/")) {
    s.openReview(decodeURIComponent(h.slice("#/review/".length)));
    return;
  }
  const entry = (Object.entries(VIEW_HASH) as [View, string][]).find(([, v]) => v === h);
  const view: View = entry?.[0] ?? "home";
  if (view === "station") {
    // Stations aren't deep-linkable; show a live one, else land on the library.
    if (s.engine && s.caseModel) s.setView("station");
    else s.setView("select");
    return;
  }
  if (view === "review") {
    s.setView("select"); // bare #/review without a case id
    return;
  }
  s.setView(view);
}

// ---- Persistence helpers --------------------------------------------------------

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

/** Seconds left in the engine's current phase (its own bookkeeping fields). */
function phaseRemaining(engine: EngineState): number {
  switch (engine.currentState) {
    case "CHART_REVIEW":
      return engine.chartReviewTimeRemaining;
    case "PATIENT_ENCOUNTER":
      return engine.encounterTimeRemaining;
    case "POST_ENCOUNTER":
      return engine.postEncounterTimeRemaining;
    case "FEEDBACK":
      return 0;
  }
}

/** Run thunks with bounded concurrency. Submitting a station used to fire a
 *  dozen API calls at once — instant 429s on a fresh (Tier-1) API key, which
 *  surfaced as "AI degraded" even though the key was fine. */
async function mapLimit(jobs: (() => Promise<void>)[], limit: number): Promise<void> {
  const queue = [...jobs];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    for (let job = queue.shift(); job; job = queue.shift()) {
      await job();
    }
  });
  await Promise.all(workers);
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
  const jobs: (() => Promise<void>)[] = [];
  for (const step of caseModel.steps) {
    const answer = engine.postEncounterAnswers[step.id] ?? "";
    if (!answer || !step.scoring) continue;
    const items = [
      ...step.scoring.criticalActions,
      ...step.scoring.coreActions,
      ...step.scoring.bonusActions,
    ].map((i) => ({ id: i.item, concepts: [i.item] }));
    if (items.length === 0) continue;
    jobs.push(() =>
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
      jobs.push(() =>
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
  await mapLimit(jobs, 3);
  return matches;
}

/** Generate short AI coaching notes per answered step (best-effort, async). */
async function collectCoaching(
  caseModel: CaseModel,
  engine: EngineState,
): Promise<Record<string, string>> {
  if (!llmEnabled) return {};
  const out: Record<string, string> = {};
  await mapLimit(
    caseModel.steps.map((step) => async () => {
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
    2,
  );
  return out;
}

export const useAppStore = create<AppState>((set, get) => ({
  view: "home",
  pendingAiPanel: false,
  pendingCategoryFilter: null,
  caseModel: null,
  engine: null,
  pendingResume: null,
  preferredMode: initialMode(),
  llmEnabled,
  providerKind,
  aiStatus: "idle",
  aiError: null,
  aiDegraded: null,
  aiDegradedDetail: null,
  spThinking: false,
  grading: false,
  timeExpired: false,
  coaching: {},
  coachingPending: false,
  review: null,

  setView(view) {
    set({ view });
    syncHash();
  },

  async startCase(id, mode) {
    const caseModel = await loadCase(id);
    const engine = createSession(caseModel, mode, Date.now());
    persist(engine);
    get().setPreferredMode(mode);
    set({
      caseModel,
      engine,
      view: "station",
      coaching: {},
      coachingPending: false,
      review: null,
      pendingResume: null,
      aiDegraded: null,
      aiDegradedDetail: null,
      timeExpired: false,
      grading: false,
    });
    syncHash();
  },

  async startRandomCase(mode, candidateIds) {
    if (candidateIds.length === 0) return;
    // Deterministic-but-varied pick without Math.random (blocked): hash the
    // current clock into the candidate list.
    const idx = Date.now() % candidateIds.length;
    await get().startCase(candidateIds[idx], mode);
  },

  async startRandomUnattempted(mode, pool) {
    const candidates = pool ?? manifest.cases.map((c) => c.id);
    const done = new Set(loadAttempts().map((a) => a.caseId));
    const unattempted = candidates.filter((id) => !done.has(id));
    await get().startRandomCase(mode, unattempted.length > 0 ? unattempted : candidates);
  },

  openReview(caseId) {
    const review = loadReview(caseId);
    if (review) set({ view: "review", review });
    else set({ view: "select" });
    syncHash();
  },

  setPreferredMode(mode) {
    try {
      localStorage.setItem(MODE_STORAGE, mode);
    } catch {
      // ignore storage failure
    }
    set({ preferredMode: mode });
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
    set({ llmEnabled, providerKind, aiStatus: "idle", aiError: null, aiDegraded: null, aiDegradedDetail: null });
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
    set({ llmEnabled, providerKind, aiStatus: "idle", aiError: null, aiDegraded: null, aiDegradedDetail: null });
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
      set({ aiStatus: "ok", aiError: null, aiDegraded: null, aiDegradedDetail: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // Trim the often-verbose SDK error to something readable.
      set({ aiStatus: "error", aiError: msg.slice(0, 160) });
    }
  },

  async gradeCoverage(answer, items) {
    if (!answer.trim() || items.length === 0) return [];
    const deterministic = items.filter((i) => looseCovered(answer, i));
    if (llmEnabled) {
      try {
        const ids = await provider.classifyIntent(
          answer,
          items.map((i) => ({ id: i, concepts: [i] })),
        );
        // Union the LLM's semantic matches with the deterministic keyword
        // matches: the LLM catches paraphrases the matcher misses, while the
        // matcher guarantees a clearly-named concept (e.g. "respiratory
        // compensation") is credited even when the LLM under-reports.
        return [...new Set([...ids, ...deterministic])];
      } catch {
        // fall through to deterministic
      }
    }
    return deterministic;
  },

  async coachDrill(input) {
    if (!llmEnabled || !input.studentAnswer.trim() || !input.idealAnswer.trim()) return null;
    try {
      return await provider.coachAnswer({ step: "Work-up", ...input });
    } catch {
      return null;
    }
  },

  async resumeSession() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return false;
      const engine = deserializeSession(raw);
      if (!engine) return false;
      const caseModel = await loadCase(engine.caseId);
      // Never jump straight into the station: a stale strict-mode deadline
      // would auto-submit a half-empty attempt on the first tick. Offer it.
      set({ pendingResume: { engine, caseModel } });
      return true;
    } catch {
      return false;
    }
  },

  acceptResume() {
    const { pendingResume } = get();
    if (!pendingResume) return;
    let { engine } = pendingResume;
    // Re-base the wall-clock deadline so the timer paused while the tab was
    // closed instead of silently expiring phases (min 5s grace).
    if (engine.phaseDeadline !== null && engine.currentState !== "FEEDBACK") {
      engine = {
        ...engine,
        phaseDeadline: Date.now() + Math.max(5, phaseRemaining(engine)) * 1000,
      };
    }
    const caseModel = pendingResume.caseModel;
    persist(engine);
    set({
      pendingResume: null,
      caseModel,
      engine: withOpening(engine, caseModel),
      view: "station",
      coaching: {},
      coachingPending: false,
      review: null,
      timeExpired: false,
      grading: false,
    });
    syncHash();
  },

  discardResume() {
    persist(null);
    set({ pendingResume: null });
  },

  exitToSelect() {
    persist(null);
    set({
      view: "select",
      caseModel: null,
      engine: null,
      review: null,
      grading: false,
      timeExpired: false,
    });
    syncHash();
  },

  showEnableAi() {
    set({ view: "select", pendingAiPanel: true });
    syncHash();
  },

  clearPendingAiPanel() {
    set({ pendingAiPanel: false });
  },

  browseCategory(category) {
    set({ view: "select", pendingCategoryFilter: category });
    syncHash();
  },

  clearPendingCategoryFilter() {
    set({ pendingCategoryFilter: null });
  },

  tick() {
    const { engine, caseModel, grading } = get();
    if (!engine || !caseModel) return;
    // Post-encounter expiry goes through the SAME submission pipeline as the
    // button (LLM rubric matching + coaching) — never the engine's bare
    // deterministic auto-submit, which would silently grade differently.
    if (
      engine.currentState === "POST_ENCOUNTER" &&
      engine.phaseDeadline !== null &&
      Date.now() >= engine.phaseDeadline &&
      !engine.submitted
    ) {
      if (!grading) {
        set({ timeExpired: true });
        void get().submitStation();
      }
      return;
    }
    const next = engineTick(
      engine,
      caseModel,
      Date.now(),
      scoreBands,
      {},
      breadthCreditForCategory(caseModel.category),
    );
    if (next === engine) return;
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

      // Recent spoken dialogue (before this question) gives the LLM continuity
      // so replies flow like a conversation — refer back, don't repeat. It's
      // context only: the engine still decides what's revealed and the guard
      // still blocks any new clinical fact.
      const history = engine.conversation
        .filter((t) => t.kind === "speech")
        .map((t) => ({ role: t.role === "student" ? ("doctor" as const) : ("patient" as const), text: t.text }));

      let replyText: string;
      if (result.revealedContent.length === 0) {
        // Open-ended prompts with no specific match re-anchor on the authored
        // opening statement (verbatim case content); everything else gets a
        // natural off-target reply or a fixed neutral negative.
        const openEnded =
          /\b(what brings|tell me|describe|go on|how are you|what'?s going on|more about|start from the beginning)\b/i.test(
            trimmed,
          );
        if (openEnded) {
          // History-aware: the patient naturally says "like I said…" if they've
          // already opened, so no hardcoded prefix is needed. The diagnosis is
          // passed so the guard can block the patient ever naming it.
          replyText = await provider.phrasePatientReply(caseModel.opening, caseModel.sp, trimmed, history, caseModel.diagnosis);
        } else {
          // With AI on, answer the off-target question in character (a natural
          // reasonable-negative grounded only in the question/persona/dialogue —
          // see answerOffTarget). Falls back to a fixed neutral line otherwise.
          const ai = llmEnabled ? await provider.answerOffTarget(caseModel.sp, trimmed, history, caseModel.diagnosis) : null;
          replyText = ai ?? neutralNegative(trimmed);
        }
      } else {
        // Newline-separated so each fact phrases as its own sentence.
        const approved = result.revealedContent.join("\n");
        replyText = await provider.phrasePatientReply(approved, caseModel.sp, trimmed, history, caseModel.diagnosis);
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
    const { engine, caseModel, grading } = get();
    if (!engine || !caseModel || engine.submitted || grading) return;
    set({ grading: true });
    try {
      const llmMatches = await collectLlmMatches(caseModel, engine);
      // Re-read after the await: guards a double submit (e.g. tick racing the
      // button) and grades any text typed while matching was in flight.
      const current = get().engine;
      if (!current || current.submitted) return;
      const next = submit(
        current,
        caseModel,
        scoreBands,
        Date.now(),
        llmMatches,
        breadthCreditForCategory(caseModel.category),
      );
      if (next.submitted && !current.submitted) {
        recordAttempt(caseModel, next);
      }
      setEngine(set, next);
      // AI coaching notes load in the background, fill in once ready, and are
      // persisted onto the saved review so they survive leaving this screen.
      if (llmEnabled) {
        set({ coachingPending: true });
        collectCoaching(caseModel, next)
          .then((coaching) => {
            attachCoaching(caseModel.id, coaching);
            if (get().caseModel?.id === caseModel.id) {
              set({ coaching, coachingPending: false });
            }
          })
          .catch(() => {
            if (get().caseModel?.id === caseModel.id) set({ coachingPending: false });
          });
      }
    } finally {
      set({ grading: false });
    }
  },
}));

// Surface provider fallbacks ("AI on" must never lie about a degraded session);
// a later successful call (op === null) clears the warning automatically.
setLlmFallbackListener((op, detail) => {
  const s = useAppStore.getState();
  if (op === null) {
    if (s.aiDegraded !== null) useAppStore.setState({ aiDegraded: null, aiDegradedDetail: null });
    return;
  }
  const friendly =
    detail && /429|rate.?limit/i.test(detail)
      ? "rate-limited by the provider — recovers on its own in under a minute"
      : detail ?? null;
  if (s.llmEnabled && (s.aiDegraded !== op || s.aiDegradedDetail !== friendly)) {
    useAppStore.setState({ aiDegraded: op, aiDegradedDetail: friendly });
  }
});
