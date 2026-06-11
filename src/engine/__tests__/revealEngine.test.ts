import { describe, it, expect } from "vitest";
import { adaptCase } from "../schemaAdapter";
import { askHistoryQuestion, performManeuver } from "../revealEngine";
import { chestpain01, dyspnea01 } from "./fixtures";

const cp01 = adaptCase(chestpain01);
const dy01 = adaptCase(dyspnea01);

describe("history reveal gating (§11.1)", () => {
  it("reveals nothing for an off-target question", () => {
    const r = askHistoryQuestion("Do you enjoy gardening on weekends?", cp01, []);
    expect(r.matchedTriggerIds).toEqual([]);
    expect(r.revealedContent).toEqual([]);
  });

  it("a question matching a trigger's concepts unlocks exactly that trigger", () => {
    const r = askHistoryQuestion("Do you smoke or use tobacco?", cp01, []);
    expect(r.matchedTriggerIds).toContain("tobacco_use");
    expect(r.matchedTriggerIds).not.toContain("alcohol_use");
    // Content revealed is verbatim case material about smoking…
    expect(r.revealedContent.join(" ").toLowerCase()).toMatch(/smok/);
    // …and never about other sensitive topics that were not asked.
    expect(r.revealedContent.join(" ").toLowerCase()).not.toMatch(/alcohol|drink/);
  });

  it("sensitive triggers stay locked until directly asked", () => {
    const vague = askHistoryQuestion("Tell me more about your life at home", cp01, []);
    expect(vague.matchedTriggerIds).not.toContain("alcohol_use");
    expect(vague.matchedTriggerIds).not.toContain("tobacco_use");
    expect(vague.revealedContent.join(" ").toLowerCase()).not.toMatch(/smok|alcohol/);

    const direct = askHistoryQuestion("How much alcohol do you drink?", cp01, []);
    expect(direct.matchedTriggerIds).toContain("alcohol_use");
  });

  it("every revealed string is verbatim case content (no origination)", () => {
    const questions = [
      "When did the pain start?",
      "What does the pain feel like?",
      "Do you smoke?",
      "What medications do you take?",
      "Any other symptoms with it?",
      "Has this happened before?",
    ];
    for (const q of questions) {
      const r = askHistoryQuestion(q, cp01, []);
      for (const content of r.revealedContent) {
        expect(
          chestpain01.patientFile.includes(content),
          `revealed "${content}" must be verbatim from patientFile`,
        ).toBe(true);
      }
    }
  });

  it("classified trigger ids from outside are validated against the case", () => {
    const r = askHistoryQuestion("hello", cp01, [], ["nonexistent_trigger", "tobacco_use"]);
    expect(r.matchedTriggerIds).toEqual(["tobacco_use"]);
  });

  it("newlyUnlocked excludes already-unlocked triggers", () => {
    const r = askHistoryQuestion("Do you smoke?", cp01, ["tobacco_use"]);
    expect(r.matchedTriggerIds).toContain("tobacco_use");
    expect(r.newlyUnlocked).not.toContain("tobacco_use");
  });
});

describe("exam reveal gating (§11.2)", () => {
  it("a mapped maneuver reveals exactly its mapped finding(s)", () => {
    const r = performManeuver("auscultate_mitral_area", cp01, []);
    expect(r.isNormal).toBe(false);
    const mapped = cp01.examMappings.filter((m) =>
      m.revealedBy.includes("auscultate_mitral_area"),
    );
    expect(r.findings).toEqual(mapped.map((m) => m.finding));
    expect(r.unlockedMappingIds).toEqual(mapped.map((m) => m.id));
  });

  it("un-performed maneuvers' findings never appear via other maneuvers", () => {
    // Findings exclusive to maneuvers we are NOT performing:
    const protectedFindings = cp01.examMappings.filter(
      (m) => !m.revealedBy.includes("assess_general_appearance"),
    );
    const r = performManeuver("assess_general_appearance", cp01, []);
    for (const f of protectedFindings) {
      for (const out of r.findings) {
        expect(out).not.toBe(f.finding);
      }
    }
  });

  it("an unmapped maneuver returns only supported normal/grounded content", () => {
    const r = performManeuver("assess_asterixis", cp01, []);
    expect(r.isNormal).toBe(true);
    expect(r.unlockedMappingIds).toEqual([]);
    for (const f of r.findings) {
      const grounded =
        chestpain01.patientFile.includes(f) || f === "No asterixis.";
      expect(grounded, `"${f}" must be grounded or the catalog default`).toBe(true);
    }
  });

  it("unmapped maneuver content never overlaps another mapping's finding", () => {
    // dyspnea-01 has a rich exam; auscultate_with_bell may be unmapped while
    // the cardiac line (S3 gallop) belongs to mapped auscultation maneuvers.
    const mappedIds = new Set(dy01.examMappings.flatMap((m) => m.revealedBy));
    const candidates = ["auscultate_with_bell", "palpate_pmi", "assess_capillary_refill"];
    for (const id of candidates.filter((c) => !mappedIds.has(c))) {
      const r = performManeuver(id, dy01, []);
      for (const m of dy01.examMappings) {
        for (const out of r.findings) {
          expect(out).not.toBe(m.finding);
        }
      }
    }
  });

  it("does not duplicate already-unlocked mapping ids", () => {
    const first = performManeuver("auscultate_mitral_area", cp01, []);
    const again = performManeuver(
      "auscultate_mitral_area",
      cp01,
      first.unlockedMappingIds,
    );
    expect(again.unlockedMappingIds).toEqual([]);
  });
});
