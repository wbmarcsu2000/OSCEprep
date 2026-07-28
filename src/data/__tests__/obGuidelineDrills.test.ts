// src/data/__tests__/obGuidelineDrills.test.ts
import { describe, it, expect } from "vitest";
import { OB_GUIDELINE_DRILLS, OB_DOMAINS } from "../obGuidelineDrills";
import { OB_DRILL_BANK, GUIDELINE_DRILL_BANKS, DRILL_STORAGE_KEYS } from "../guidelineDrillBank";

/**
 * The caps below describe the GUIDELINE drill shape: 10 per domain, 8-16
 * full-sentence facts, one shared review date. The "gyn-surgery" domain is
 * deliberately a different shape — 4-7 items of 2-4 words, so a student can
 * answer it in about a dozen words — and is asserted separately in
 * obGynSurgeryDrills.test.ts. Excluding it here keeps this test meaningful for
 * the drills it was written for, rather than loosening the caps for everything.
 */
const GUIDELINE_DOMAINS = ["prenatal", "complications", "labor", "gyn"];
const GUIDELINE_DRILLS = OB_GUIDELINE_DRILLS.filter((d) => GUIDELINE_DOMAINS.includes(d.domain));

describe("OB/GYN guideline drills (data)", () => {
  it("has 40 guideline drills, 10 per guideline domain", () => {
    expect(GUIDELINE_DRILLS).toHaveLength(40);
    for (const dom of GUIDELINE_DOMAINS) {
      expect(GUIDELINE_DRILLS.filter((d) => d.domain === dom), dom).toHaveLength(10);
    }
  });

  it("every drill respects the density caps", () => {
    const ids = OB_GUIDELINE_DRILLS.map((d) => d.id);
    expect(new Set(ids).size, "unique ids across every OB domain").toBe(ids.length);
    const domains = new Set(OB_DOMAINS.map((d) => d.id));
    for (const d of OB_GUIDELINE_DRILLS) expect(domains.has(d.domain), `${d.id} domain`).toBe(true);
    for (const d of GUIDELINE_DRILLS) {
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
    expect(OB_DRILL_BANK.domains.map((d) => d.id)).toEqual([...GUIDELINE_DOMAINS, "gyn-surgery"]);
    expect(GUIDELINE_DRILL_BANKS.map((b) => b.id)).toEqual(["fm", "ob"]);
    expect(DRILL_STORAGE_KEYS).toContain("osce.obdrills.v1");
  });
});
