/**
 * Longitudinal analytics, localStorage-backed. No PHI — only case metadata,
 * scores, and miss patterns from an anonymous local profile.
 */

import type { CaseModel, EngineState, Mode, ScoreReport } from "../engine/types";
import { SESSION_STORAGE_KEY } from "../engine/stateMachine";
import { DRILL_PROGRESS_KEY } from "../data/drillProgress";
import { DRILL_STORAGE_KEYS } from "../data/guidelineDrillBank";
import { MCQ_STORAGE_KEYS } from "../data/mcqBank";

export const ANALYTICS_STORAGE_KEY = "osce.analytics.v1";
/** Full per-case review payloads (last attempt wins), keyed by case id. */
export const REVIEW_STORAGE_KEY = "osce.reviews.v1";

export interface CaseReview {
  caseId: string;
  title: string;
  category: string;
  difficulty: string;
  diagnosis: string;
  completedAt: number;
  report: ScoreReport;
  postEncounterAnswers: Record<string, string>;
  historyRevealed: string[];
  examFindingTexts: string[];
  /** AI coach notes by sectionId — attached asynchronously after grading. */
  coaching?: Record<string, string>;
}

export function loadReviews(): Record<string, CaseReview> {
  try {
    const raw = localStorage.getItem(REVIEW_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, CaseReview>) : {};
  } catch {
    return {};
  }
}

export function loadReview(caseId: string): CaseReview | null {
  return loadReviews()[caseId] ?? null;
}

/** Merge late-arriving AI coaching into the persisted review so it survives
 *  leaving the feedback screen and shows up on later re-reads. */
export function attachCoaching(caseId: string, coaching: Record<string, string>): void {
  if (Object.keys(coaching).length === 0) return;
  try {
    const all = loadReviews();
    const review = all[caseId];
    if (!review) return;
    all[caseId] = { ...review, coaching };
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // storage unavailable — coaching just won't persist
  }
}

function saveReview(caseModel: CaseModel, engine: EngineState): void {
  if (!engine.result) return;
  try {
    const all = loadReviews();
    all[caseModel.id] = {
      caseId: caseModel.id,
      title: caseModel.title,
      category: caseModel.category,
      difficulty: caseModel.difficulty,
      diagnosis: caseModel.diagnosis,
      completedAt: Date.now(),
      report: engine.result,
      postEncounterAnswers: engine.postEncounterAnswers,
      historyRevealed: engine.historyRevealed,
      examFindingTexts: engine.examFindingTexts,
    };
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // storage unavailable — review simply won't persist
  }
}

export interface AttemptRecord {
  caseId: string;
  category: string;
  difficulty: string;
  diagnosis: string;
  mode: Mode;
  completedAt: number;
  overall: number;
  band: string;
  domainScores: Record<string, number>;
  domainMax: Record<string, number>;
  missedTriggerIds: string[];
  missedManeuverIds: string[];
  penalties: string[];
  unsafeActions: string[];
  criticalMissCount: number;
}

export function loadAttempts(): AttemptRecord[] {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AttemptRecord[]) : [];
  } catch {
    return [];
  }
}

export function recordAttempt(caseModel: CaseModel, engine: EngineState): void {
  const report = engine.result;
  if (!report) return;
  const record: AttemptRecord = {
    caseId: caseModel.id,
    category: caseModel.category,
    difficulty: caseModel.difficulty,
    diagnosis: caseModel.diagnosis,
    mode: engine.mode,
    completedAt: Date.now(),
    overall: report.overall,
    band: report.band,
    domainScores: report.domainScores,
    domainMax: report.domainMax,
    missedTriggerIds: report.missedHistory.map((m) => m.id),
    missedManeuverIds: report.missedManeuvers.map((m) => m.maneuverId),
    penalties: report.sections.flatMap((s) => s.penaltiesApplied.map((p) => p.item)),
    unsafeActions: report.unsafeActions,
    criticalMissCount: report.criticalMisses.length,
  };
  try {
    const all = loadAttempts();
    all.push(record);
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // storage unavailable — analytics silently skipped
  }
  saveReview(caseModel, engine);
}

// ---- Data management ---------------------------------------------------------

// Every localStorage key that holds user progress. Export/import/reset all walk
// this list, so a new progress store is backed up and cleared the moment its key
// is added here — the drill and question-bank stores were silently missing, so
// backups dropped them and "Reset all progress" left them behind.
const ALL_KEYS = [
  ANALYTICS_STORAGE_KEY,
  REVIEW_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  DRILL_PROGRESS_KEY,
  ...DRILL_STORAGE_KEYS,
  ...MCQ_STORAGE_KEYS,
];

/** All progress as a single portable JSON document. */
export function exportAllData(): string {
  const out: Record<string, unknown> = { exportedAt: Date.now(), version: 1 };
  for (const key of ALL_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) out[key] = JSON.parse(raw);
    } catch {
      // skip unreadable keys
    }
  }
  return JSON.stringify(out, null, 2);
}

/** Restore an exported document. Returns the number of keys imported. */
export function importAllData(json: string): number {
  let imported = 0;
  const parsed: unknown = JSON.parse(json); // caller handles throw
  if (!parsed || typeof parsed !== "object") throw new Error("Not a ClerkTools export");
  const doc = parsed as Record<string, unknown>;
  for (const key of ALL_KEYS) {
    const value = doc[key];
    if (value === undefined) continue;
    if (key === ANALYTICS_STORAGE_KEY && !Array.isArray(value)) continue;
    localStorage.setItem(key, JSON.stringify(value));
    imported += 1;
  }
  return imported;
}

/** Erase attempts, reviews, and any in-progress session (not the AI key). */
export function clearAllData(): void {
  for (const key of ALL_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

export interface FrequencyRow {
  key: string;
  count: number;
}

export function topByFrequency(items: string[], limit = 8): FrequencyRow[] {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function averageBy(
  attempts: AttemptRecord[],
  keyFn: (a: AttemptRecord) => string,
): { key: string; mean: number; n: number }[] {
  const groups = new Map<string, number[]>();
  for (const a of attempts) {
    const k = keyFn(a);
    const arr = groups.get(k) ?? [];
    arr.push(a.overall);
    groups.set(k, arr);
  }
  return [...groups.entries()]
    .map(([key, scores]) => ({
      key,
      mean: Math.round(scores.reduce((x, y) => x + y, 0) / scores.length),
      n: scores.length,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}
