// src/data/__tests__/obGuidelineDrills.test.ts
import { describe, it, expect } from "vitest";
import { OB_GUIDELINE_DRILLS, OB_DOMAINS } from "../obGuidelineDrills";
import { OB_DRILL_BANK, GUIDELINE_DRILL_BANKS, DRILL_STORAGE_KEYS } from "../guidelineDrillBank";

describe("OB/GYN guideline drills (data)", () => {
  it("has 40 drills, 10 per domain", () => {
    expect(OB_GUIDELINE_DRILLS).toHaveLength(40);
    for (const dom of OB_DOMAINS) {
      expect(OB_GUIDELINE_DRILLS.filter((d) => d.domain === dom.id), dom.id).toHaveLength(10);
    }
  });

  it("every drill respects the density caps", () => {
    const ids = OB_GUIDELINE_DRILLS.map((d) => d.id);
    expect(new Set(ids).size, "unique ids").toBe(ids.length);
    const domains = new Set(OB_DOMAINS.map((d) => d.id));
    for (const d of OB_GUIDELINE_DRILLS) {
      expect(domains.has(d.domain), `${d.id} domain`).toBe(true);
      expect(d.org.length, `${d.id} org`).toBeGreaterThan(1);
      expect(d.prompt.length, `${d.id} prompt`).toBeGreaterThan(15);
      expect(d.reviewed).toBe("2026-07-17");
      expect(d.keyPoints.length, `${d.id} groups`).toBeGreaterThanOrEqual(2);
      expect(d.keyPoints.length, `${d.id} groups`).toBeLessThanOrEqual(4);
      const total = d.keyPoints.reduce((a, g) => a + g.items.length, 0);
      expect(total, `${d.id} total items`).toBeGreaterThanOrEqual(8);
      expect(total, `${d.id} total items`).toBeLessThanOrEqual(16);
      for (const g of d.keyPoints) {
        expect(g.items.length, `${d.id}/${g.group} items`).toBeLessThanOrEqual(5);
        for (const it of g.items) {
          expect(it.length, `${d.id} item too long: "${it}"`).toBeLessThanOrEqual(80);
          expect(it.trim().length, `${d.id} empty item`).toBeGreaterThan(2);
        }
      }
    }
  });

  it("OB bank is registered with its own storage key", () => {
    expect(OB_DRILL_BANK.id).toBe("ob");
    expect(OB_DRILL_BANK.storageKey).toBe("osce.obdrills.v1");
    expect(OB_DRILL_BANK.domains.map((d) => d.id)).toEqual(["prenatal", "complications", "labor", "gyn"]);
    expect(GUIDELINE_DRILL_BANKS.map((b) => b.id)).toEqual(["fm", "ob"]);
    expect(DRILL_STORAGE_KEYS).toContain("osce.obdrills.v1");
  });
});
