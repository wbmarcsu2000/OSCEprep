/**
 * Storage-agnostic drill-progress logic, shared by the IM drill store
 * (drillProgress.ts) and the bank-driven guideline-drill store
 * (guidelineDrillProgress.ts, used by the FM and OB/GYN banks). Pure — no
 * React, no localStorage, no PHI (only coverage %, attempt count, timestamps).
 */

/** Student override layered on top of the score-based mastery signal. */
export type DrillManual = "none" | "mastered" | "review";

export interface DrillProgress {
  attempts: number;
  /** Best coverage %, 0-100. */
  bestPct: number;
  /** Most recent coverage %, 0-100. */
  lastPct: number;
  lastSeenAt: number;
  manual: DrillManual;
}

/** Per-problem progress keyed by `type:id` (see {@link drillKey}). */
export type DrillProgressMap = Record<string, DrillProgress>;

/** Coverage at/above which a problem auto-counts as mastered. */
export const MASTERY_PCT = 80;

export function drillKey(a: string, b: string): string {
  return `${a}:${b}`;
}

/** Fold one graded attempt into a (possibly missing) prior entry. */
export function applyAttempt(prev: DrillProgress | undefined, pct: number, now: number): DrillProgress {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  return {
    attempts: (prev?.attempts ?? 0) + 1,
    bestPct: Math.max(prev?.bestPct ?? 0, clamped),
    lastPct: clamped,
    lastSeenAt: now,
    manual: prev?.manual ?? "none",
  };
}

/** Set the manual override, seeding an empty entry if none exists. */
export function applyManual(prev: DrillProgress | undefined, manual: DrillManual, now: number): DrillProgress {
  return prev
    ? { ...prev, manual }
    : { attempts: 0, bestPct: 0, lastPct: 0, lastSeenAt: now, manual };
}

/** Mastery = explicit "mastered", else (not flagged "review" and best ≥ threshold). */
export function isMastered(p: DrillProgress | undefined): boolean {
  if (!p) return false;
  if (p.manual === "mastered") return true;
  if (p.manual === "review") return false;
  return p.bestPct >= MASTERY_PCT;
}

export function isSeen(p: DrillProgress | undefined): boolean {
  return !!p && p.attempts > 0;
}
