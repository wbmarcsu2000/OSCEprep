import { describe, it, expect } from "vitest";
import { loadRawCase } from "../../data/loader";
import { adaptCase } from "../schemaAdapter";
import { gradeStep } from "../scoringEngine";
import { itemMatches, penaltyMatches, isNegatedIn } from "../textMatch";
import type { CaseModel, StepModel } from "../types";

/**
 * Regression tests for grader defects found in the 2026-07 review. Each case
 * here was reproduced against the real engine and shipped case library before
 * the fix, so these are the exact wrong marks students were getting.
 */

/** Mirrors the avoidance set penaltyMatches uses internally (not exported). */
const AVOIDANCE_FOR_TEST = new Set(["avoid", "hold", "never", "withhold"]);

const cache = new Map<string, CaseModel>();
async function step(caseId: string, stepId: string): Promise<StepModel> {
  if (!cache.has(caseId)) cache.set(caseId, adaptCase(await loadRawCase(caseId)));
  const model = cache.get(caseId)!;
  const found = model.steps.find((s) => s.id === stepId);
  if (!found) throw new Error(`${caseId} has no step "${stepId}"`);
  return found;
}

describe("omission penalties honor the engine's own synonym table", () => {
  it("does not fire 'no EKG' when the student ordered an ECG", async () => {
    const workup = await step("chestpain-04", "workup");
    const answer = "ECG immediately, troponin now and in 3 hours, CBC, BMP, CXR, d-dimer.";
    const result = gradeStep(workup, answer, {}, "");
    expect(result.penaltiesApplied.map((p) => p.item)).toEqual([]);
  });

  it("scores the ECG and EKG spellings of one answer identically", async () => {
    const workup = await step("chestpain-04", "workup");
    const withEcg = gradeStep(workup, "ECG, troponin, CXR, CBC, BMP.", {}, "");
    const withEkg = gradeStep(workup, "EKG, troponin, CXR, CBC, BMP.", {}, "");
    expect(withEcg.earned).toBe(withEkg.earned);
  });

  it("still fires the omission penalty when nothing of the kind was ordered", async () => {
    const workup = await step("chestpain-04", "workup");
    const result = gradeStep(workup, "Reassure and discharge, no testing needed.", {}, "");
    expect(result.penaltiesApplied.length).toBeGreaterThan(0);
  });
});

describe("penalty matching treats avoidance as avoidance, not assertion", () => {
  it.each([
    ["Avoid nitroglycerin given the RV infarct", "Giving nitroglycerin"],
    ["I would hold the beta blocker here", "Giving beta blockers"],
    ["I would never give IV calcium in this setting", "Giving IV calcium"],
    ["Withhold anticoagulation until imaging is back", "Starting anticoagulation"],
    ["Nitroglycerin is contraindicated here", "Giving nitroglycerin"],
  ])("does not penalize %j against the penalty %j", (answer, penalty) => {
    expect(penaltyMatches(answer, penalty, [])).toBe(false);
  });

  it.each([
    ["I'd give nitroglycerin for the pain", "Giving nitroglycerin"],
    ["Start anticoagulation now", "Starting anticoagulation"],
  ])("still penalizes %j, which does assert the action", (answer, penalty) => {
    expect(penaltyMatches(answer, penalty, [])).toBe(true);
  });
});

describe("avoidance governs its whole object phrase", () => {
  it("does not penalize a long avoidance clause on its far end", async () => {
    // Real answer from the review; the penalty is about IV calcium in digoxin
    // toxicity OR large fluid boluses, and this answer refuses both while
    // correctly treating the digoxin toxicity.
    const management = await step("abdo-02", "management");
    const answer =
      "Admit. Treat digoxin toxicity with digoxin-specific Fab. AVOID IV calcium for the " +
      "hyperkalemia because of the digoxin toxicity, and avoid large fluid boluses given her congestion.";
    const result = gradeStep(management, answer, {}, "Acute cholecystitis");
    expect(result.penaltiesApplied.map((p) => p.item)).toEqual([]);
  });

  it("is not defeated by non-idempotent stemming of a plural", () => {
    // stem("boluses") is "bolus" but stem("bolus") is "bolu". penaltyMatches
    // passes already-stemmed tokens, so re-stemming inside isNegatedIn lost the
    // token entirely and the negation check silently no-opped.
    expect(isNegatedIn("avoid large fluid boluses", "bolus", 4, AVOIDANCE_FOR_TEST)).toBe(true);
    expect(isNegatedIn("give large fluid boluses", "bolus", 4, AVOIDANCE_FOR_TEST)).toBe(false);
    // The ordinary (non-avoidance) path must keep working on plurals too.
    expect(isNegatedIn("no fluid boluses", "bolus")).toBe(true);
  });

  it("still penalizes the action when a later clause asserts it", () => {
    expect(penaltyMatches("Avoid beta blockers. Give nitroglycerin now.", "Giving nitroglycerin", []))
      .toBe(true);
  });
});

describe("a pertinent negative does not negate the rest of the sentence", () => {
  it.each([
    ["No fever, chest pain radiating to the jaw", "chest pain"],
    ["No fevers, no chills, exertional chest pressure", "chest pressure"],
    ["Denies fever, denies cough, has pleuritic chest pain", "pleuritic chest pain"],
  ])("credits %j for the item %j", (answer, item) => {
    expect(itemMatches(answer, item)).toBe(true);
  });

  it.each([
    ["No chest pain", "chest pain"],
    ["Denies chest pain.", "chest pain"],
    ["Patient denies any chest pain at all", "chest pain"],
  ])("still withholds credit for %j, which negates the item", (answer, item) => {
    expect(itemMatches(answer, item)).toBe(false);
  });
});

describe("'rule out X' includes X in the differential", () => {
  it.each([
    ["Need to rule out PE and ACS", "PE"],
    ["Need to rule out PE and ACS", "ACS"],
    ["r/o pulmonary embolism", "Pulmonary embolism"],
    ["Must rule out aortic dissection first", "aortic dissection"],
  ])("credits %j for the item %j", (answer, item) => {
    expect(itemMatches(answer, item)).toBe(true);
  });

  it.each([
    ["The CTA excluded PE", "PE"],
  ])("still withholds credit for %j, which excludes the item", (answer, item) => {
    expect(itemMatches(answer, item)).toBe(false);
  });
});

describe("a slash inside a long ideal answer is not a list of alternatives", () => {
  it("does not award the revised step for one incidental token", async () => {
    const revised = await step("abdo-03", "revised");
    const result = gradeStep(revised, "ALP", {}, "Acute pancreatitis");
    expect(result.earned).toBeLessThan(result.maxPoints / 2);
  });

  it("does not award the revised step for a differential the case rejects", async () => {
    const revised = await step("abdo-01", "revised");
    const result = gradeStep(revised, "tubo-ovarian abscess.", {}, "Acute appendicitis");
    expect(result.earned).toBeLessThan(result.maxPoints / 2);
  });

  it("still rewards an answer that actually covers the ideal answer", async () => {
    const revised = await step("abdo-03", "revised");
    const result = gradeStep(revised, revised.idealAnswer ?? "", {}, "Acute pancreatitis");
    expect(result.earned).toBeGreaterThanOrEqual(result.maxPoints * 0.8);
  });

  it("scores gibberish at zero", async () => {
    const revised = await step("abdo-03", "revised");
    expect(gradeStep(revised, "asdfqwer", {}, "Acute pancreatitis").earned).toBe(0);
  });
});
