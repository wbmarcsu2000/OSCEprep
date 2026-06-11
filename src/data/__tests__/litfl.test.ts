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
});
