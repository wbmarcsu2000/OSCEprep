import { describe, it, expect } from "vitest";
import { ANTIBIOTIC_DRILLS } from "../antibioticDrills";
import { HIGH_YIELD_DRILLS } from "../highYieldDrills";
import { SCORE_DRILLS } from "../scoreDrills";
import { EKG_DRILLS, CXR_DRILLS } from "../imageDrills";
import { SKILL_DRILLS } from "../skillDrills";
import { skillDrillId, drillCatalog } from "../drillProgress";

describe("antibiotic drills", () => {
  it("each problem has a vignette, answer key, explanation, and category", () => {
    expect(ANTIBIOTIC_DRILLS.length).toBeGreaterThanOrEqual(12);
    for (const p of ANTIBIOTIC_DRILLS) {
      expect(p.vignette.length, `${p.id} vignette`).toBeGreaterThan(20);
      expect(p.name.length, `${p.id} name`).toBeGreaterThan(0);
      expect(p.category.length, `${p.id} category`).toBeGreaterThan(0);
      expect(p.answer.length, `${p.id} answer`).toBeGreaterThan(0);
      expect(p.explanation.length, `${p.id} explanation`).toBeGreaterThan(20);
    }
  });

  it("ids are unique (progress keys must not collide)", () => {
    const ids = ANTIBIOTIC_DRILLS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("high-yield deck", () => {
  it("ids are unique", () => {
    const ids = HIGH_YIELD_DRILLS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("integrated cases are self-contained (vignette + answer + explanation)", () => {
    const integrated = HIGH_YIELD_DRILLS.filter((p) => p.modality === "integrated");
    expect(integrated.length).toBeGreaterThanOrEqual(12);
    for (const p of integrated) {
      expect(p.vignette && p.vignette.length > 20, `${p.id} vignette`).toBe(true);
      expect((p.answer ?? []).length, `${p.id} answer`).toBeGreaterThan(0);
      expect(p.explanation && p.explanation.length > 20, `${p.id} explanation`).toBe(true);
    }
  });

  it("every reference resolves to a real bank entry", () => {
    for (const p of HIGH_YIELD_DRILLS) {
      if (p.modality === "ekg") {
        expect(EKG_DRILLS.some((d) => d.n === p.ekgN), `ekg ${p.ekgN}`).toBe(true);
      } else if (p.modality === "cxr") {
        expect(CXR_DRILLS.some((d) => d.n === p.cxrN), `cxr ${p.cxrN}`).toBe(true);
      } else if (p.modality === "score") {
        expect(SCORE_DRILLS.some((d) => d.id === p.scoreId), `score ${p.scoreId}`).toBe(true);
      } else if (p.modality === "antibiotics") {
        expect(ANTIBIOTIC_DRILLS.some((d) => d.id === p.antibioticId), `abx ${p.antibioticId}`).toBe(true);
      } else if (p.modality === "skill") {
        expect(SKILL_DRILLS.some((d) => skillDrillId(d) === p.skillRef), `skill ${p.skillRef}`).toBe(true);
      }
    }
  });

  it("spans all six modalities so the deck truly mixes formats", () => {
    const modalities = new Set(HIGH_YIELD_DRILLS.map((p) => p.modality));
    for (const m of ["integrated", "ekg", "cxr", "score", "antibiotics", "skill"]) {
      expect(modalities.has(m as never), `has ${m}`).toBe(true);
    }
  });
});

describe("conduction-block EKG reads (LBBB / RBBB)", () => {
  it("adds LBBB and RBBB image reads to the EKG bank, with tracings + findings", () => {
    const lbbb = EKG_DRILLS.find((d) => /left bundle/i.test(d.diagnosis));
    const rbbb = EKG_DRILLS.find((d) => /right bundle/i.test(d.diagnosis));
    for (const d of [lbbb, rbbb]) {
      expect(d, "LBBB/RBBB present").toBeTruthy();
      expect(d!.img).toMatch(/^https:\/\/litfl\.com\//);
      expect(d!.findings.length).toBeGreaterThan(2);
      expect(d!.read.length).toBeGreaterThan(20);
    }
  });

  it("surfaces LBBB and RBBB in the High-Yield EKG section", () => {
    const ekgNs = new Set(HIGH_YIELD_DRILLS.filter((p) => p.modality === "ekg").map((p) => p.ekgN));
    expect(ekgNs.has(101)).toBe(true);
    expect(ekgNs.has(102)).toBe(true);
  });
});

describe("differential drill complaints", () => {
  it("includes Joint Pain and Back Pain", () => {
    const ids = new Set(drillCatalog("differential").map((it) => it.id));
    expect(ids.has("Joint Pain")).toBe(true);
    expect(ids.has("Back Pain")).toBe(true);
  });
});
