// src/data/__tests__/guidelineDrillProgress.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  loadDrillBankProgress,
  recordDrillBankAttempt,
  setDrillBankManual,
  summarizeDrillDomain,
} from "../guidelineDrillProgress";
import { FM_DRILL_BANK } from "../guidelineDrillBank";
import { drillKey } from "../drillProgressCore";

const FM_KEY = FM_DRILL_BANK.storageKey; // osce.fmdrills.v1
const OB_KEY = "osce.obdrills.v1";

describe("guidelineDrillProgress", () => {
  beforeEach(() => localStorage.clear());

  it("records attempts under the given storage key, not the IM key", () => {
    recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 90);
    expect(localStorage.getItem(FM_KEY)).toContain("screen-colorectal");
    expect(localStorage.getItem("osce.drills.v1")).toBeNull();
  });

  it("banks are isolated: FM writes never touch the OB key and vice versa", () => {
    recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 90);
    recordDrillBankAttempt(OB_KEY, "gyn", "gyn-pid", 70);
    const fm = loadDrillBankProgress(FM_KEY);
    const ob = loadDrillBankProgress(OB_KEY);
    expect(Object.keys(fm)).toEqual([drillKey("screening", "screen-colorectal")]);
    expect(Object.keys(ob)).toEqual([drillKey("gyn", "gyn-pid")]);
  });

  it("keeps best pct and attempt count across attempts", () => {
    recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 60);
    const entry = recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 40);
    expect(entry.bestPct).toBe(60);
    expect(entry.lastPct).toBe(40);
    expect(entry.attempts).toBe(2);
  });

  it("manual override persists", () => {
    recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 90);
    setDrillBankManual(FM_KEY, "screening", "screen-colorectal", "review");
    const map = loadDrillBankProgress(FM_KEY);
    expect(map[drillKey("screening", "screen-colorectal")].manual).toBe("review");
  });

  it("summarizeDrillDomain aggregates seen/mastered/needsWork/avg", () => {
    recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 90);
    recordDrillBankAttempt(FM_KEY, "screening", "screen-breast", 50);
    setDrillBankManual(FM_KEY, "screening", "screen-breast", "review");
    const s = summarizeDrillDomain(FM_DRILL_BANK, "screening", loadDrillBankProgress(FM_KEY));
    expect(s.seen).toBe(2);
    expect(s.mastered).toBe(1); // ≥80 auto-mastery
    expect(s.needsWork).toBe(1);
    expect(s.avgBestPct).toBe(70);
    expect(s.total).toBeGreaterThanOrEqual(10);
  });

  it("returns {} for a missing or corrupt store", () => {
    expect(loadDrillBankProgress(FM_KEY)).toEqual({});
    localStorage.setItem(FM_KEY, "not json");
    expect(loadDrillBankProgress(FM_KEY)).toEqual({});
  });
});
