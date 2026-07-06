/**
 * Lightweight per-question progress for the Shelf MCQ bank, persisted to
 * localStorage. Tracks how often each item has been seen and answered
 * correctly so the quiz can offer "previously incorrect" and "unseen" subsets
 * and show a mastery hint. Standalone (not tied to the drill-progress system)
 * to keep the quiz tool self-contained.
 */

/**
 * Default storage key (the Internal Medicine bank). A bank passes its own key
 * so separate banks (e.g. Family Medicine, `osce.fmmcq.v1`) track progress
 * independently and never collide.
 */
const DEFAULT_KEY = "osce.mcq.v1";

export interface McqStat {
  /** Times this question has been answered. */
  seen: number;
  /** Times answered correctly. */
  correct: number;
  /** Whether the most recent answer was correct. */
  lastCorrect: boolean;
}

export type McqProgress = Record<string, McqStat>;

export function loadMcqProgress(key: string = DEFAULT_KEY): McqProgress {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as McqProgress) : {};
  } catch {
    return {};
  }
}

function save(p: McqProgress, key: string): void {
  try {
    localStorage.setItem(key, JSON.stringify(p));
  } catch {
    // storage unavailable (private mode) — progress simply won't persist
  }
}

/** Record an answer for a question; returns the updated map. */
export function recordMcqAnswer(id: string, correct: boolean, key: string = DEFAULT_KEY): McqProgress {
  const p = loadMcqProgress(key);
  const prev = p[id] ?? { seen: 0, correct: 0, lastCorrect: false };
  p[id] = {
    seen: prev.seen + 1,
    correct: prev.correct + (correct ? 1 : 0),
    lastCorrect: correct,
  };
  save(p, key);
  return p;
}

export function resetMcqProgress(key: string = DEFAULT_KEY): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // no-op
  }
}

/** A question is "mastered" once it's been answered and the last answer was right. */
export function isMastered(stat: McqStat | undefined): boolean {
  return !!stat && stat.seen > 0 && stat.lastCorrect;
}
