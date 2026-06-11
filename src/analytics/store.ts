/**
 * Longitudinal analytics, localStorage-backed. No PHI — only case metadata,
 * scores, and miss patterns from an anonymous local profile.
 */

import type { CaseModel, EngineState, ScoreReport } from "../engine/types";

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

/** Case ids with at least one recorded attempt. */
export function completedCaseIds(): Set<string> {
  return new Set(loadAttempts().map((a) => a.caseId));
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
  mode: string;
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
