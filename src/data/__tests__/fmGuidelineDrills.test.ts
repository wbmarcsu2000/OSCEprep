import { describe, it, expect } from "vitest";
import {
  FM_GUIDELINE_DRILLS,
  FM_DOMAIN_ORDER,
  FM_DOMAIN_LABELS,
  fmDrillCatalog,
  type FmDrillDomain,
} from "../fmGuidelineDrills";

describe("FM guideline drills (data)", () => {
  it("every drill is well-formed", () => {
    expect(FM_GUIDELINE_DRILLS.length).toBeGreaterThanOrEqual(35);
    const ids = FM_GUIDELINE_DRILLS.map((d) => d.id);
    expect(new Set(ids).size, "unique ids").toBe(ids.length);
    const domains = new Set<FmDrillDomain>(FM_DOMAIN_ORDER);
    for (const d of FM_GUIDELINE_DRILLS) {
      expect(domains.has(d.domain), `${d.id} domain`).toBe(true);
      expect(d.name.length, `${d.id} name`).toBeGreaterThan(2);
      expect(d.org.length, `${d.id} org`).toBeGreaterThan(1);
      expect(d.prompt.length, `${d.id} prompt`).toBeGreaterThan(15);
      expect(d.keyPoints.length, `${d.id} has groups`).toBeGreaterThanOrEqual(1);
      for (const g of d.keyPoints) {
        expect(g.group.length, `${d.id} group name`).toBeGreaterThan(1);
        expect(g.items.length, `${d.id} group ${g.group} items`).toBeGreaterThanOrEqual(1);
        for (const it of g.items) expect(it.trim().length, `${d.id} item text`).toBeGreaterThan(2);
      }
      expect(d.reviewed, `${d.id} reviewed date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("each domain has at least one drill and a label", () => {
    for (const dom of FM_DOMAIN_ORDER) {
      expect(FM_GUIDELINE_DRILLS.some((d) => d.domain === dom), `${dom} populated`).toBe(true);
      expect(FM_DOMAIN_LABELS[dom].length).toBeGreaterThan(0);
    }
  });

  it("fmDrillCatalog returns spoiler-safe entries for a domain", () => {
    const cat = fmDrillCatalog("screening");
    expect(cat.length).toBeGreaterThanOrEqual(1);
    for (const c of cat) {
      expect(c.id.length).toBeGreaterThan(0);
      expect(c.label.length).toBeGreaterThan(0);
    }
  });
});
