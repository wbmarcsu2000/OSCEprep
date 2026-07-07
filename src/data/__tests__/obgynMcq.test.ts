import { describe, it, expect } from "vitest";
import { OB_MCQS, OB_MCQ_SYSTEM_ORDER, OB_MCQ_SYSTEMS } from "../obgynMcq";

/**
 * OB/GYN MCQ bank invariants — mirrors the IM/FM bank data tests. Guards
 * well-formedness, id uniqueness, canonical systems, de-duplication WITHIN the
 * OB bank, and teaching-field well-formedness. Overlap with the IM/FM banks is
 * intentional and NOT checked here.
 */

function normStem(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

describe("OB/GYN MCQ bank (data)", () => {
  it("is non-empty", () => {
    expect(OB_MCQS.length).toBeGreaterThanOrEqual(1);
  });

  it("every question is a well-formed single-best-answer item", () => {
    const ids = OB_MCQS.map((q) => q.id);
    expect(new Set(ids).size, "unique ids").toBe(ids.length);
    const systems = new Set<string>(OB_MCQ_SYSTEM_ORDER);
    for (const q of OB_MCQS) {
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

  it("OB_MCQ_SYSTEMS lists exactly the systems that have questions, in order", () => {
    const present = OB_MCQ_SYSTEM_ORDER.filter((s) => OB_MCQS.some((q) => q.system === s));
    expect(OB_MCQ_SYSTEMS).toEqual(present);
  });

  it("teaching-mode fields are well-formed when present", () => {
    for (const q of OB_MCQS) {
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
        for (const b of q.conceptRule) expect(b.trim().length, `${q.id} conceptRule bullet`).toBeGreaterThan(0);
      }
      if (q.scoreComponents !== undefined) {
        expect(q.scoreComponents.length, `${q.id} scoreComponents non-empty`).toBeGreaterThan(0);
        for (const c of q.scoreComponents) expect(c.trim().length, `${q.id} scoreComponents item`).toBeGreaterThan(0);
      }
      for (const field of ["discriminator", "mnemonic"] as const) {
        const v = q[field];
        if (v !== undefined) expect(v.trim().length, `${q.id} ${field}`).toBeGreaterThan(0);
      }
    }
  });

  it("has no exact-duplicate stems within a system", () => {
    const bySys = new Map<string, string[]>();
    for (const q of OB_MCQS) {
      const arr = bySys.get(q.system) ?? [];
      arr.push(normStem(q.stem));
      bySys.set(q.system, arr);
    }
    for (const [sys, stems] of bySys) {
      expect(new Set(stems).size, `${sys}: duplicate stems`).toBe(stems.length);
    }
  });
});
