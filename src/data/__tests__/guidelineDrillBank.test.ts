// src/data/__tests__/guidelineDrillBank.test.ts
import { describe, it, expect } from "vitest";
import {
  FM_DRILL_BANK,
  GUIDELINE_DRILL_BANKS,
  DRILL_STORAGE_KEYS,
  drillsForDomain,
  drillCatalog,
} from "../guidelineDrillBank";
import { FM_GUIDELINE_DRILLS, FM_DOMAIN_ORDER } from "../fmGuidelineDrills";

describe("guidelineDrillBank", () => {
  it("FM bank preserves the FM invariants exactly", () => {
    expect(FM_DRILL_BANK.id).toBe("fm");
    expect(FM_DRILL_BANK.storageKey).toBe("osce.fmdrills.v1");
    expect(FM_DRILL_BANK.domains.map((d) => d.id)).toEqual([...FM_DOMAIN_ORDER]);
    expect(FM_DRILL_BANK.drills).toHaveLength(FM_GUIDELINE_DRILLS.length);
  });

  it("bank list + storage keys stay in lockstep", () => {
    expect(GUIDELINE_DRILL_BANKS.length).toBeGreaterThanOrEqual(1);
    expect(DRILL_STORAGE_KEYS).toEqual(GUIDELINE_DRILL_BANKS.map((b) => b.storageKey));
    expect(new Set(DRILL_STORAGE_KEYS).size).toBe(DRILL_STORAGE_KEYS.length);
  });

  it("drillsForDomain filters and drillCatalog is spoiler-safe", () => {
    const screening = drillsForDomain(FM_DRILL_BANK, "screening");
    expect(screening.length).toBeGreaterThan(0);
    expect(screening.every((d) => d.domain === "screening")).toBe(true);
    const cat = drillCatalog(FM_DRILL_BANK, "screening");
    expect(cat.length).toBe(screening.length);
    for (const c of cat) {
      expect(Object.keys(c).sort()).toEqual(["group", "id", "label"]);
    }
  });
});
