import { describe, it, expect, beforeEach } from "vitest";
import {
  recordMcqAnswer,
  loadMcqProgress,
  isMastered,
  wasEverMissed,
  type McqProgress,
} from "../mcqProgress";

/**
 * Per-question progress — focus on the sticky "Missed" pool. A question that is
 * ever answered incorrectly must stay in Missed even after a later correct
 * answer (so redoing incorrects can't quietly empty the long-term review list).
 */

const KEY = "osce.test.mcqprogress";

describe("mcqProgress — sticky Missed pool", () => {
  beforeEach(() => {
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
  });

  it("marks a question missed once it is answered wrong", () => {
    const p = recordMcqAnswer("q1", false, KEY);
    expect(wasEverMissed(p.q1)).toBe(true);
    expect(isMastered(p.q1)).toBe(false);
  });

  it("keeps a question in Missed after it is later answered correctly (sticky)", () => {
    recordMcqAnswer("q1", false, KEY);
    const p = recordMcqAnswer("q1", true, KEY); // redo, now correct

    // The answer updates seen/correct/lastCorrect/mastery...
    expect(p.q1.seen).toBe(2);
    expect(p.q1.correct).toBe(1);
    expect(p.q1.lastCorrect).toBe(true);
    expect(isMastered(p.q1)).toBe(true);
    // ...but does NOT remove it from the long-term Missed pool.
    expect(wasEverMissed(p.q1)).toBe(true);
  });

  it("never puts an always-correct question into Missed", () => {
    const p = recordMcqAnswer("q2", true, KEY);
    expect(wasEverMissed(p.q2)).toBe(false);
    expect(isMastered(p.q2)).toBe(true);
  });

  it("treats an unseen question as not missed", () => {
    expect(wasEverMissed(undefined)).toBe(false);
  });

  it("derives everWrong for pre-migration stats that lack the flag", () => {
    // Simulate old saved data: a stat with no `everWrong`, last answer wrong.
    const legacy: McqProgress = { q3: { seen: 1, correct: 0, lastCorrect: false } };
    localStorage.setItem(KEY, JSON.stringify(legacy));
    const loaded = loadMcqProgress(KEY);
    expect(wasEverMissed(loaded.q3)).toBe(true);

    // A later correct answer persists the sticky flag going forward.
    const p = recordMcqAnswer("q3", true, KEY);
    expect(p.q3.everWrong).toBe(true);
    expect(wasEverMissed(p.q3)).toBe(true);
  });
});
