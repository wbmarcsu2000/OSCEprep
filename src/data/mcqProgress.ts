/**
 * Lightweight per-question progress for the Shelf MCQ bank, persisted to
 * localStorage. Tracks how often each item has been seen and answered
 * correctly so the quiz can offer "previously incorrect" and "unseen" subsets
 * and show a mastery hint. Standalone (not tied to the drill-progress system)
 * to keep the quiz tool self-contained.
 */

const STORAGE_KEY = "osce.mcq.v1";

export interface McqStat {
  /** Times this question has been answered. */
  seen: number;
  /** Times answered correctly. */
  correct: number;
  /** Whether the most recent answer was correct. */
  lastCorrect: boolean;
}

export type McqProgress = Record<string, McqStat>;

export function loadMcqProgress(): McqProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as McqProgress) : {};
  } catch {
    return {};
  }
}

function save(p: McqProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // storage unavailable (private mode) — progress simply won't persist
  }
}

/** Record an answer for a question; returns the updated map. */
export function recordMcqAnswer(id: string, correct: boolean): McqProgress {
  const p = loadMcqProgress();
  const prev = p[id] ?? { seen: 0, correct: 0, lastCorrect: false };
  p[id] = {
    seen: prev.seen + 1,
    correct: prev.correct + (correct ? 1 : 0),
    lastCorrect: correct,
  };
  save(p);
  return p;
}

export function resetMcqProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}

/** A question is "mastered" once it's been answered and the last answer was right. */
export function isMastered(stat: McqStat | undefined): boolean {
  return !!stat && stat.seen > 0 && stat.lastCorrect;
}
