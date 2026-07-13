import { describe, it, expect } from "vitest";
import {
  applyAttempt,
  applyManual,
  isMastered,
  isSeen,
  drillKey,
  MASTERY_PCT,
} from "../drillProgressCore";

describe("drillProgressCore", () => {
  it("applyAttempt accumulates attempts and tracks best/last, clamped 0-100", () => {
    const a = applyAttempt(undefined, 60, 1000);
    expect(a).toEqual({ attempts: 1, bestPct: 60, lastPct: 60, lastSeenAt: 1000, manual: "none" });
    const b = applyAttempt(a, 90, 2000);
    expect(b).toMatchObject({ attempts: 2, bestPct: 90, lastPct: 90 });
    const c = applyAttempt(b, 40, 3000);
    expect(c).toMatchObject({ attempts: 3, bestPct: 90, lastPct: 40 });
    expect(applyAttempt(undefined, 150, 0).bestPct).toBe(100);
    expect(applyAttempt(undefined, -5, 0).bestPct).toBe(0);
  });

  it("isSeen / isMastered follow attempts, threshold, and manual override", () => {
    expect(isSeen(undefined)).toBe(false);
    const seen = applyAttempt(undefined, 50, 0);
    expect(isSeen(seen)).toBe(true);
    expect(isMastered(seen)).toBe(false);
    expect(isMastered(applyAttempt(undefined, MASTERY_PCT, 0))).toBe(true);
    const flagged = applyManual(applyAttempt(undefined, 100, 0), "review", 0);
    expect(isMastered(flagged)).toBe(false); // review overrides a high score
    const forced = applyManual(applyAttempt(undefined, 10, 0), "mastered", 0);
    expect(isMastered(forced)).toBe(true); // manual mastered overrides a low score
  });

  it("applyManual seeds an entry when none exists and preserves prior stats", () => {
    const m = applyManual(undefined, "mastered", 500);
    expect(m).toEqual({ attempts: 0, bestPct: 0, lastPct: 0, lastSeenAt: 500, manual: "mastered" });
    const kept = applyManual(applyAttempt(undefined, 70, 100), "review", 200);
    expect(kept).toMatchObject({ attempts: 1, bestPct: 70, manual: "review" });
  });

  it("drillKey joins with a colon", () => {
    expect(drillKey("screening", "screen-colorectal")).toBe("screening:screen-colorectal");
  });
});
