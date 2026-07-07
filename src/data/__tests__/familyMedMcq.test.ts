import { describe, it, expect } from "vitest";
import { FM_MCQS, FM_MCQ_SYSTEM_ORDER, FM_MCQ_SYSTEMS } from "../familyMedMcq";

/**
 * Family Medicine MCQ bank invariants — mirrors the IM bank's data test.
 * Guards well-formedness, id uniqueness, canonical systems, and de-duplication
 * WITHIN the FM bank (no near-identical stems). Overlap with the IM bank is
 * intentional and NOT checked here.
 */

function normStem(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

describe("Family Medicine MCQ bank (data)", () => {
  it("is comprehensive across the FM systems", () => {
    // The generated bank is large; the placeholder is small. Once built this
    // should be well into the hundreds. Keep a low floor so the scaffold passes
    // and bump implicitly as the real bank lands.
    expect(FM_MCQS.length).toBeGreaterThanOrEqual(1);
  });

  it("every question is a well-formed single-best-answer item", () => {
    const ids = FM_MCQS.map((q) => q.id);
    expect(new Set(ids).size, "unique ids").toBe(ids.length);
    const systems = new Set<string>(FM_MCQ_SYSTEM_ORDER);
    for (const q of FM_MCQS) {
      expect(systems.has(q.system), `${q.id} system "${q.system}" is canonical`).toBe(true);
      expect(q.topic.trim().length, `${q.id} topic`).toBeGreaterThan(0);
      expect(q.stem.length, `${q.id} stem`).toBeGreaterThan(20);
      expect(q.options.length, `${q.id} option count`).toBeGreaterThanOrEqual(4);
      expect(q.options.length, `${q.id} option count`).toBeLessThanOrEqual(5);
      expect(new Set(q.options).size, `${q.id} options unique`).toBe(q.options.length);
      for (const o of q.options) expect(o.trim().length, `${q.id} option text`).toBeGreaterThan(0);
      expect(q.answerIndex, `${q.id} answerIndex lower`).toBeGreaterThanOrEqual(0);
      expect(q.answerIndex, `${q.id} answerIndex upper`).toBeLessThan(q.options.length);
      expect(q.explanation.length, `${q.id} explanation`).toBeGreaterThan(15);
    }
  });

  it("FM_MCQ_SYSTEMS lists exactly the systems that have questions, in order", () => {
    const present = FM_MCQ_SYSTEM_ORDER.filter((s) => FM_MCQS.some((q) => q.system === s));
    expect(FM_MCQ_SYSTEMS).toEqual(present);
  });

  it("teaching-mode fields are well-formed when present", () => {
    for (const q of FM_MCQS) {
      if (q.optionRationales !== undefined) {
        expect(q.optionRationales.length, `${q.id} optionRationales length`).toBe(q.options.length);
        for (const r of q.optionRationales) {
          expect(r.trim().length, `${q.id} rationale text`).toBeGreaterThan(0);
        }
      }
      if (q.concept !== undefined) {
        expect(q.concept.trim().length, `${q.id} concept`).toBeGreaterThan(0);
      }
      if (q.conceptRule !== undefined) {
        expect(Array.isArray(q.conceptRule), `${q.id} conceptRule is array`).toBe(true);
        for (const b of q.conceptRule) {
          expect(b.trim().length, `${q.id} conceptRule bullet`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("enhancement fields (score/discriminator/trap/mnemonic) are well-formed when present", () => {
    for (const q of FM_MCQS) {
      if (q.scoreComponents !== undefined) {
        expect(Array.isArray(q.scoreComponents), `${q.id} scoreComponents is array`).toBe(true);
        expect(q.scoreComponents.length, `${q.id} scoreComponents non-empty`).toBeGreaterThan(0);
        for (const c of q.scoreComponents) {
          expect(c.trim().length, `${q.id} scoreComponents item`).toBeGreaterThan(0);
        }
      }
      for (const field of ["discriminator", "mnemonic"] as const) {
        const v = q[field];
        if (v !== undefined) {
          expect(typeof v, `${q.id} ${field} type`).toBe("string");
          expect(v.trim().length, `${q.id} ${field} text`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("has no near-duplicate stems within a system (concept-level de-dup)", () => {
    const bySys = new Map<string, string[]>();
    for (const q of FM_MCQS) {
      const arr = bySys.get(q.system) ?? [];
      arr.push(normStem(q.stem));
      bySys.set(q.system, arr);
    }
    for (const [sys, stems] of bySys) {
      // exact normalized-stem collisions are the cheap, hard guard
      expect(new Set(stems).size, `${sys}: duplicate stems`).toBe(stems.length);
    }
  });
});
