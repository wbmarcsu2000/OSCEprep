import { describe, it, expect } from "vitest";
import { SKILL_DRILLS, SKILL_DRILL_TYPES } from "../skillDrills";
import { CURRICULUM } from "../curriculum";
import { itemMatches, looseCovered } from "../../engine/textMatch";

describe("skill drills", () => {
  it("covers ABG, SAAG, pleural, and PFT with answers + explanations", () => {
    const skills = new Set(SKILL_DRILLS.map((p) => p.skill));
    for (const s of SKILL_DRILL_TYPES) expect(skills.has(s), `missing ${s}`).toBe(true);
    for (const p of SKILL_DRILLS) {
      expect(p.stem.length).toBeGreaterThan(0);
      expect(p.answer.length).toBeGreaterThan(0);
      expect(p.explanation.length).toBeGreaterThan(20);
    }
  });
});

describe("differential abbreviation matching", () => {
  it("credits abbreviations and full names against framework buckets", () => {
    expect(itemMatches("NSTEMI, aortic dissection", "ACS")).toBe(true);
    expect(itemMatches("pulmonary embolism, GERD", "PE")).toBe(true);
    expect(itemMatches("acute coronary syndrome", "ACS")).toBe(true);
    // unrelated diagnoses still don't cross-match
    expect(itemMatches("pneumonia", "Pneumothorax")).toBe(false);
  });
});

describe("curriculum cites the MGH manual", () => {
  it("every category has manual sections with valid pages", () => {
    for (const c of CURRICULUM) {
      expect(c.manual.length, `${c.category} has manual refs`).toBeGreaterThan(0);
      for (const r of c.manual) {
        expect(r.section.length).toBeGreaterThan(0);
        expect(r.page).toBeGreaterThan(0);
        expect(r.page).toBeLessThanOrEqual(273); // manual has 273 pages
      }
    }
  });
  it("every quick-management pearl cites a manual page", () => {
    for (const c of CURRICULUM) {
      for (const m of c.quickManagement) {
        expect(m.manualPage, `${c.category}: "${m.scenario}" cites a page`).toBeGreaterThan(0);
      }
    }
  });
});

describe("drill coverage matcher (looseCovered)", () => {
  // Regression: an ABG answer naming "respiratory compensation" must credit the
  // "appropriate respiratory compensation" concept (only the qualifier differs),
  // while NOT crediting a concept whose head noun is absent.
  const abg = "metabolic acidosis with respiratory compensation, anion gap of 24";
  it("credits a concept when its head noun is named, qualifier optional", () => {
    expect(looseCovered(abg, "appropriate respiratory compensation")).toBe(true);
    expect(looseCovered(abg, "metabolic acidosis")).toBe(true);
  });
  it("does not credit a concept whose distinctive head noun is absent", () => {
    // "metabolic" alone must not credit "metabolic alkalosis" (alkalosis absent)
    expect(looseCovered(abg, "metabolic alkalosis")).toBe(false);
  });
  it("still credits partial/abbreviated answers", () => {
    expect(looseCovered("ordered a troponin", "serial troponin")).toBe(true);
    expect(looseCovered("get a chest xray", "CXR")).toBe(true);
  });
});
