import { describe, it, expect } from "vitest";
import { SKILL_DRILLS, SKILL_DRILL_TYPES } from "../skillDrills";
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
