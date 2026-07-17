import { describe, it, expect, beforeEach } from "vitest";
import { exportAllData, importAllData, clearAllData } from "../store";
import { DRILL_PROGRESS_KEY } from "../../data/drillProgress";
import { DRILL_STORAGE_KEYS } from "../../data/guidelineDrillBank";
import { MCQ_BANKS, MCQ_STORAGE_KEYS } from "../../data/mcqBank";

/**
 * Guards the export / import / reset key coverage. FM guideline drills and the
 * question banks were silently absent from ALL_KEYS, so backups dropped them and
 * "Reset all progress" left them behind — the "my data isn't updating" bug.
 */

// Every progress store that a full backup / reset must account for.
const PROGRESS_KEYS = [DRILL_PROGRESS_KEY, ...DRILL_STORAGE_KEYS, ...MCQ_STORAGE_KEYS];

function seedEveryProgressKey() {
  const drillEntry = { "screening:x": { attempts: 1, bestPct: 90, lastPct: 90, lastSeenAt: 1, manual: "none" } };
  localStorage.setItem(DRILL_PROGRESS_KEY, JSON.stringify(drillEntry));
  for (const key of DRILL_STORAGE_KEYS) localStorage.setItem(key, JSON.stringify(drillEntry));
  for (const key of MCQ_STORAGE_KEYS) {
    localStorage.setItem(key, JSON.stringify({ q1: { seen: 1, correct: 1, lastCorrect: true, everWrong: false } }));
  }
}

describe("analytics data management covers every progress store", () => {
  beforeEach(() => localStorage.clear());

  it("has one distinct storage key per question bank", () => {
    expect(MCQ_STORAGE_KEYS.length).toBe(MCQ_BANKS.length);
    expect(new Set(MCQ_STORAGE_KEYS).size).toBe(MCQ_STORAGE_KEYS.length);
  });

  it("exports FM drills and every question bank (previously dropped)", () => {
    seedEveryProgressKey();
    const doc = JSON.parse(exportAllData());
    for (const key of PROGRESS_KEYS) {
      expect(doc[key], `${key} should be in the export`).toBeDefined();
    }
  });

  it("reset clears FM drills and every question bank (previously left behind)", () => {
    seedEveryProgressKey();
    clearAllData();
    for (const key of PROGRESS_KEYS) {
      expect(localStorage.getItem(key), `${key} should be cleared by reset`).toBeNull();
    }
  });

  it("import restores FM drills and every question bank", () => {
    seedEveryProgressKey();
    const backup = exportAllData();
    localStorage.clear();
    const n = importAllData(backup);
    for (const key of PROGRESS_KEYS) {
      expect(localStorage.getItem(key), `${key} should be restored by import`).not.toBeNull();
    }
    expect(n).toBeGreaterThanOrEqual(PROGRESS_KEYS.length);
  });
});
