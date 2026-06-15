import { describe, it, expect } from "vitest";
import { LITFL_ECG_STUDIES, LITFL_CXR_STUDIES, applyLitflStudies } from "../litflStudies";
import { adaptCase } from "../../engine/schemaAdapter";
import { chestpain01 } from "../../engine/__tests__/fixtures";

describe("LITFL study bank", () => {
  it("has 50 ECG and 50 CXR studies with valid case URLs and findings", () => {
    expect(LITFL_ECG_STUDIES.length).toBe(50);
    expect(LITFL_CXR_STUDIES.length).toBe(50);
    for (const s of [...LITFL_ECG_STUDIES, ...LITFL_CXR_STUDIES]) {
      expect(s.diagnosis.length).toBeGreaterThan(0);
      expect(s.findings.length).toBeGreaterThan(0);
      expect(s.n).toBeGreaterThanOrEqual(1);
      expect(s.n).toBeLessThanOrEqual(50);
    }
  });

  it("assigns a specific LITFL study (link + gradeable answer) to read steps", () => {
    const model = applyLitflStudies(adaptCase(chestpain01), 0);
    const ekg = model.steps.find((s) => s.id === "ekg_read")!;
    const cxr = model.steps.find((s) => s.id === "cxr_read")!;
    // index 0 → ECG case 1, CXR case 1
    expect(model.images.ekg.source).toMatch(/litfl\.com\/ecg-case-001/);
    expect(model.images.cxr.source).toMatch(/litfl\.com\/cxr-case-001/);
    // the read step grades against the LITFL diagnosis
    expect(ekg.criticalFindings[0]).toBe(LITFL_ECG_STUDIES[0].diagnosis);
    expect(cxr.criticalFindings[0]).toBe(LITFL_CXR_STUDIES[0].diagnosis);
    expect(ekg.scoring?.criticalActions[0].item).toContain(LITFL_ECG_STUDIES[0].diagnosis);
    expect(ekg.scoring!.maxPoints).toBe(ekg.max);
  });

  it("integrated read: a case can pin a relevant LITFL study to its own read step", () => {
    const raw = JSON.parse(JSON.stringify(chestpain01));
    raw.images.ekg.litflStudyN = 7; // pin "Right heart strain / RVH"
    // index 0 would otherwise assign ECG study #1; the pin must win.
    const model = applyLitflStudies(adaptCase(raw), 0);
    const ekg = model.steps.find((s) => s.id === "ekg_read")!;
    const pinned = LITFL_ECG_STUDIES.find((s) => s.n === 7)!;
    expect(ekg.criticalFindings[0]).toBe(pinned.diagnosis);
    expect(model.images.ekg.source).toMatch(/ecg-case-007/);
    // framed as the patient's own study, not "reading practice"
    expect(ekg.prompt).toMatch(/patient's 12-lead ECG/i);
    // the unpinned CXR still falls back to the index-assigned standalone drill
    const cxr = model.steps.find((s) => s.id === "cxr_read")!;
    expect(cxr.criticalFindings[0]).toBe(LITFL_CXR_STUDIES[0].diagnosis);
    expect(cxr.prompt).toMatch(/reading practice/i);
  });

  it("integrated read: integrated:true with no pin keeps the authored read step", () => {
    const raw = JSON.parse(JSON.stringify(chestpain01));
    raw.images.ekg.integrated = true;
    const authoredPrompt = raw.steps.find((s: { id: string }) => s.id === "ekg_read").prompt;
    const model = applyLitflStudies(adaptCase(raw), 3);
    const ekg = model.steps.find((s) => s.id === "ekg_read")!;
    expect(ekg.prompt).toBe(authoredPrompt); // untouched by the LITFL override
  });

  it("integrated read: integrated:true WITH a pin keeps authored grading, swaps the image", () => {
    const raw = JSON.parse(JSON.stringify(chestpain01));
    raw.images.ekg.integrated = true;
    raw.images.ekg.litflStudyN = 7; // would otherwise grade as "Right heart strain / RVH"
    const authoredPrompt = raw.steps.find((s: { id: string }) => s.id === "ekg_read").prompt;
    const model = applyLitflStudies(adaptCase(raw), 0);
    const ekg = model.steps.find((s) => s.id === "ekg_read")!;
    // authored read content is PRESERVED (not overridden by the bank study)
    expect(ekg.prompt).toBe(authoredPrompt);
    expect(ekg.criticalFindings[0]).not.toBe(LITFL_ECG_STUDIES.find((s) => s.n === 7)!.diagnosis);
    // but the displayed tracing is sourced from the pinned study
    expect(model.images.ekg.source).toMatch(/ecg-case-007/);
  });
});
