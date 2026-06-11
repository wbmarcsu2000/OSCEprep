/**
 * Forward-only OSCE station state machine. Pure functions: every transition
 * takes (state, now) and returns a new state. Timers are wall-clock based
 * (phaseDeadline = epoch ms) so they survive refresh and tab throttling.
 */

import type { CaseModel, EngineState, Mode, Phase, ScoreBand } from "./types";
import { askHistoryQuestion, performManeuver, neutralNegative } from "./revealEngine";
import { buildScoreReport, type BreadthCredit, type LlmMatches } from "./scoringEngine";

export const ENCOUNTER_SECONDS = 20 * 60;
export const POST_ENCOUNTER_SECONDS = 20 * 60;
export const DEFAULT_CHART_SECONDS = 180;

const PHASE_ORDER: Phase[] = [
  "CHART_REVIEW",
  "PATIENT_ENCOUNTER",
  "POST_ENCOUNTER",
  "FEEDBACK",
];

export function phaseIndex(p: Phase): number {
  return PHASE_ORDER.indexOf(p);
}

export function createSession(
  caseModel: CaseModel,
  mode: Mode,
  now: number,
  chartSecondsDefault = DEFAULT_CHART_SECONDS,
): EngineState {
  const chartSeconds = caseModel.chart.timer ?? chartSecondsDefault;
  return {
    caseId: caseModel.id,
    currentState: "CHART_REVIEW",
    mode,
    phaseDeadline: mode === "STRICT_OSCE" ? now + chartSeconds * 1000 : null,
    chartReviewTimeRemaining: chartSeconds,
    encounterTimeRemaining: ENCOUNTER_SECONDS,
    postEncounterTimeRemaining: POST_ENCOUNTER_SECONDS,
    questionsAsked: [],
    conversation: [],
    historyTriggersUnlocked: [],
    historyRevealed: [],
    examManeuversPerformed: [],
    examFindingsUnlocked: [],
    examFindingTexts: [],
    diagnosticsViewed: [],
    scratchpad: "",
    postEncounterAnswers: {},
    labsRevealed: false,
    patientLocked: false,
    sectionScores: {},
    domainScores: {},
    overallScore: null,
    submitted: false,
    result: null,
  };
}

function secondsForPhase(phase: Phase, caseModel: CaseModel): number {
  switch (phase) {
    case "CHART_REVIEW":
      return caseModel.chart.timer ?? DEFAULT_CHART_SECONDS;
    case "PATIENT_ENCOUNTER":
      return ENCOUNTER_SECONDS;
    case "POST_ENCOUNTER":
      return POST_ENCOUNTER_SECONDS;
    case "FEEDBACK":
      return 0;
  }
}

/** Forward-only transition. Backward attempts return the state unchanged. */
export function transition(
  state: EngineState,
  to: Phase,
  caseModel: CaseModel,
  now: number,
): EngineState {
  if (phaseIndex(to) <= phaseIndex(state.currentState)) return state;
  if (to === "FEEDBACK" && !state.submitted) return state;
  const next: EngineState = {
    ...state,
    currentState: to,
    phaseDeadline:
      state.mode === "STRICT_OSCE" && to !== "FEEDBACK"
        ? now + secondsForPhase(to, caseModel) * 1000
        : null,
  };
  if (phaseIndex(to) >= phaseIndex("POST_ENCOUNTER")) {
    next.patientLocked = true; // irreversible — persists through refresh
  }
  return next;
}

export function beginEncounter(state: EngineState, caseModel: CaseModel, now: number): EngineState {
  return transition(state, "PATIENT_ENCOUNTER", caseModel, now);
}

export function endEncounter(state: EngineState, caseModel: CaseModel, now: number): EngineState {
  return transition(state, "POST_ENCOUNTER", caseModel, now);
}

/**
 * Recompute remaining time; auto-transition on expiry (post-encounter expiry
 * auto-submits). Call on an interval AND on visibility/refresh.
 */
export function tick(
  state: EngineState,
  caseModel: CaseModel,
  now: number,
  bands: ScoreBand[],
  llmMatches: LlmMatches = {},
  breadth: BreadthCredit = {},
): EngineState {
  if (state.phaseDeadline === null || state.currentState === "FEEDBACK") return state;
  const remaining = Math.max(0, Math.ceil((state.phaseDeadline - now) / 1000));
  let next = state;
  switch (state.currentState) {
    case "CHART_REVIEW":
      next = { ...state, chartReviewTimeRemaining: remaining };
      if (remaining === 0) next = transition(next, "PATIENT_ENCOUNTER", caseModel, now);
      break;
    case "PATIENT_ENCOUNTER":
      next = { ...state, encounterTimeRemaining: remaining };
      if (remaining === 0) next = transition(next, "POST_ENCOUNTER", caseModel, now);
      break;
    case "POST_ENCOUNTER":
      next = { ...state, postEncounterTimeRemaining: remaining };
      if (remaining === 0) next = submit(next, caseModel, bands, now, llmMatches, breadth);
      break;
  }
  return next;
}

/** Student asks the standardized patient a free-text question. */
export function askQuestion(
  state: EngineState,
  caseModel: CaseModel,
  raw: string,
  classifiedTriggerIds?: string[],
): { state: EngineState; revealedContent: string[]; matchedTriggerIds: string[] } {
  if (state.currentState !== "PATIENT_ENCOUNTER" || state.patientLocked) {
    return { state, revealedContent: [], matchedTriggerIds: [] };
  }
  const result = askHistoryQuestion(
    raw,
    caseModel,
    state.historyTriggersUnlocked,
    classifiedTriggerIds,
  );
  const newContent = result.revealedContent.filter(
    (c) => !state.historyRevealed.includes(c),
  );
  const next: EngineState = {
    ...state,
    questionsAsked: [
      ...state.questionsAsked,
      { raw, matchedTriggerIds: result.matchedTriggerIds },
    ],
    historyTriggersUnlocked: [
      ...state.historyTriggersUnlocked,
      ...result.newlyUnlocked,
    ],
    historyRevealed: [...state.historyRevealed, ...newContent],
  };
  return {
    state: next,
    revealedContent: result.revealedContent,
    matchedTriggerIds: result.matchedTriggerIds,
  };
}

/** Student performs an exact exam maneuver. */
export function doManeuver(
  state: EngineState,
  caseModel: CaseModel,
  maneuverId: string,
): { state: EngineState; findings: string[]; isNormal: boolean } {
  if (state.currentState !== "PATIENT_ENCOUNTER" || state.patientLocked) {
    return { state, findings: [], isNormal: true };
  }
  const result = performManeuver(maneuverId, caseModel, state.examFindingsUnlocked);
  const next: EngineState = {
    ...state,
    examManeuversPerformed: state.examManeuversPerformed.includes(maneuverId)
      ? state.examManeuversPerformed
      : [...state.examManeuversPerformed, maneuverId],
    examFindingsUnlocked: [...state.examFindingsUnlocked, ...result.unlockedMappingIds],
    examFindingTexts: [
      ...state.examFindingTexts,
      ...result.findings.filter((f) => !state.examFindingTexts.includes(f)),
    ],
  };
  return { state: next, findings: result.findings, isNormal: result.isNormal };
}

export function saveAnswer(state: EngineState, stepId: string, text: string): EngineState {
  if (state.currentState !== "POST_ENCOUNTER" || state.submitted) return state;
  return {
    ...state,
    postEncounterAnswers: { ...state.postEncounterAnswers, [stepId]: text },
  };
}

export function commitWorkup(state: EngineState): EngineState {
  if (state.currentState !== "POST_ENCOUNTER") return state;
  return { ...state, labsRevealed: true };
}

export function viewDiagnostic(state: EngineState, key: string): EngineState {
  if (state.diagnosticsViewed.includes(key)) return state;
  return { ...state, diagnosticsViewed: [...state.diagnosticsViewed, key] };
}

export function setScratchpad(state: EngineState, text: string): EngineState {
  return { ...state, scratchpad: text };
}

/** Compute scores and move to FEEDBACK. Idempotent. */
export function submit(
  state: EngineState,
  caseModel: CaseModel,
  bands: ScoreBand[],
  now: number,
  llmMatches: LlmMatches = {},
  breadth: BreadthCredit = {},
): EngineState {
  if (state.submitted) return state;
  if (state.currentState !== "POST_ENCOUNTER") return state;
  const report = buildScoreReport(caseModel, state, bands, llmMatches, breadth);
  const sectionScores: Record<string, number> = {};
  for (const sec of report.sections) sectionScores[sec.sectionId] = sec.earned;
  const submitted: EngineState = {
    ...state,
    submitted: true,
    sectionScores,
    domainScores: report.domainScores,
    overallScore: report.overall,
    result: report,
    patientLocked: true,
  };
  return transition(submitted, "FEEDBACK", caseModel, now);
}

// ---------------------------------------------------------------------------
// Persistence (refresh-resume within a session)
// ---------------------------------------------------------------------------

export const SESSION_STORAGE_KEY = "osce.session.v1";

export function serializeSession(state: EngineState): string {
  return JSON.stringify(state);
}

export function deserializeSession(json: string): EngineState | null {
  try {
    const parsed = JSON.parse(json) as EngineState;
    if (!parsed || typeof parsed !== "object" || !parsed.caseId || !parsed.currentState) {
      return null;
    }
    // patientLocked is irreversible: a tampered/odd payload can never reopen
    // the encounter once POST_ENCOUNTER was reached.
    if (phaseIndex(parsed.currentState) >= phaseIndex("POST_ENCOUNTER")) {
      parsed.patientLocked = true;
    }
    return parsed;
  } catch {
    return null;
  }
}

export { neutralNegative };
