import { describe, it, expect } from "vitest";
import { SKILL_DRILLS, SKILL_DRILL_TYPES } from "../skillDrills";
import { itemMatches } from "../../engine/textMatch";

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
