import { describe, it, expect, beforeEach } from "vitest";
import {
  FM_DRILL_PROGRESS_KEY,
  loadFmProgress,
  recordFmAttempt,
  setFmManual,
  fmDrillKey,
  fmSummarize,
} from "../fmDrillProgress";

describe("fmDrillProgress", () => {
  beforeEach(() => localStorage.clear());

  it("records attempts under its own storage key, not the IM key", () => {
    recordFmAttempt("screening", "screen-colorectal", 90);
    const map = loadFmProgress();
    expect(map[fmDrillKey("screening", "screen-colorectal")].bestPct).toBe(90);
    expect(localStorage.getItem(FM_DRILL_PROGRESS_KEY)).toBeTruthy();
    expect(localStorage.getItem("osce.drills.v1")).toBeNull(); // never touches IM
  });

  it("summarize counts seen/mastered for a domain", () => {
    recordFmAttempt("screening", "screen-colorectal", 90); // mastered (>=80)
    recordFmAttempt("screening", "screen-lung", 40); // seen, not mastered
    const s = fmSummarize("screening", loadFmProgress());
    expect(s.total).toBeGreaterThanOrEqual(3);
    expect(s.seen).toBe(2);
    expect(s.mastered).toBe(1);
    expect(s.avgBestPct).toBe(65);
  });

  it("manual review flag demotes a mastered score in the summary", () => {
    recordFmAttempt("chronic", "chronic-copd", 100);
    setFmManual("chronic", "chronic-copd", "review");
    const s = fmSummarize("chronic", loadFmProgress());
    expect(s.mastered).toBe(0);
    expect(s.needsWork).toBe(1);
  });
});
