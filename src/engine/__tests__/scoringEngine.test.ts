import { describe, it, expect } from "vitest";
import { adaptCase } from "../schemaAdapter";
import { gradeStep, buildScoreReport, scoreBandFor } from "../scoringEngine";
import { createSession, askQuestion, doManeuver, transition, saveAnswer, submit } from "../stateMachine";
import { chestpain01, SCORE_BANDS } from "./fixtures";
import type { EngineState } from "../types";

const cp01 = adaptCase(chestpain01);
const T0 = 1_700_000_000_000;

function playPerfectEncounter(): EngineState {
  let state = createSession(cp01, "STRICT_OSCE", T0);
  state = transition(state, "PATIENT_ENCOUNTER", cp01, T0);
  const questions = [
    "What brings you in today, tell me about it?",
    "When did it start and what does it feel like?",
    "How severe is the pain?",
    "Any other symptoms like nausea or sweating?",
    "What makes it better or worse?",
    "Do you have any medical conditions?",
    "What medications do you take?",
    "Has anything like this happened before?",
    "Do you smoke?",
    "How much alcohol do you drink?",
  ];
  for (const q of questions) state = askQuestion(state, cp01, q).state;
  for (const m of cp01.examMappings.flatMap((x) => x.revealedBy)) {
    state = doManeuver(state, cp01, m).state;
  }
  state = transition(state, "POST_ENCOUNTER", cp01, T0);
  state = saveAnswer(
    state,
    "differential",
    "Leading dx ACS/NSTEMI given exertional pressure with radiation. Must exclude aortic dissection and pulmonary embolism. Also pericarditis and GERD/esophageal disease. Musculoskeletal pain possible.",
  );
  state = saveAnswer(
    state,
    "workup",
    "EKG immediately, serial troponin, CXR, CBC, BMP, and a lipid panel.",
  );
  state = saveAnswer(
    state,
    "ekg_read",
    "Rate about 90, sinus rhythm. ST depressions and T-wave inversions in V4-V6, I and aVL concerning for ischemia. No ST elevation, so an NSTEMI pattern rather than STEMI. Systematic read: intervals normal.",
  );
  state = saveAnswer(
    state,
    "cxr_read",
    "Bilateral calcified pleural plaques along the diaphragm and lateral pleura, consistent with prior asbestos exposure. No acute infiltrate.",
  );
  state = saveAnswer(state, "revised", "NSTEMI");
  state = saveAnswer(state, "management", "Give aspirin now, admit, cardiology consult.");
  return state;
}

describe("scoring math (§11.3)", () => {
  it("section totals reconcile and overall is within 0..100", () => {
    const state = playPerfectEncounter();
    const report = buildScoreReport(cp01, state, SCORE_BANDS);
    for (const sec of report.sections) {
      expect(sec.earned).toBeGreaterThanOrEqual(0);
      expect(sec.earned).toBeLessThanOrEqual(sec.maxPoints);
    }
    // Domain max equals the case's overallScoring weights.
    for (const [k, v] of Object.entries(cp01.domainWeights)) {
      expect(report.domainMax[k]).toBe(v);
    }
    expect(Object.values(cp01.domainWeights).reduce((a, b) => a + b, 0)).toBe(100);
    expect(report.overall).toBeGreaterThan(80); // near-perfect play scores high
    expect(report.overall).toBeLessThanOrEqual(100);
  });

  it("an empty performance scores 0 with full misses", () => {
    let state = createSession(cp01, "STRICT_OSCE", T0);
    state = transition(state, "PATIENT_ENCOUNTER", cp01, T0);
    state = transition(state, "POST_ENCOUNTER", cp01, T0);
    const report = buildScoreReport(cp01, state, SCORE_BANDS);
    expect(report.overall).toBe(0);
    expect(report.band).toBe("Needs significant review");
    expect(report.missedDifferentials.length).toBeGreaterThan(0);
    expect(report.missedWorkup.length).toBeGreaterThan(0);
    expect(report.criticalMisses.length).toBeGreaterThan(0);
  });

  it("penalties subtract and unsafe actions are flagged", () => {
    const step = cp01.steps.find((s) => s.id === "management")!;
    const good = gradeStep(step, "Aspirin and admit to telemetry.", {}, cp01.diagnosis);
    const bad = gradeStep(
      step,
      "Aspirin and give thrombolytics immediately.",
      {},
      cp01.diagnosis,
    );
    expect(bad.penaltiesApplied.length).toBe(1);
    expect(bad.earned).toBe(good.earned + bad.penaltiesApplied[0].points);
  });

  it("a correct answer sharing tokens with a penalty phrase is NOT penalized", () => {
    const step = cp01.steps.find((s) => s.id === "ekg_read")!;
    // Penalty is "calling a STEMI / activating thrombolytics for ST depression";
    // a correct read mentions ST depression and says NOT a STEMI.
    const res = gradeStep(
      step,
      "ST depression V4-V6 with T wave inversions; this is not a STEMI.",
      {},
      cp01.diagnosis,
    );
    expect(res.penaltiesApplied).toEqual([]);
  });

  it("omission penalty fires when required tests are absent", () => {
    const step = cp01.steps.find((s) => s.id === "workup")!;
    const res = gradeStep(step, "CT abdomen and urinalysis.", {}, cp01.diagnosis);
    expect(res.penaltiesApplied.map((p) => p.item)).toContain("no EKG/troponin ordered");
    const ok = gradeStep(step, "EKG and serial troponin.", {}, cp01.diagnosis);
    expect(ok.penaltiesApplied).toEqual([]);
  });

  it("bonus is capped so a section never exceeds its max", () => {
    const step = cp01.steps.find((s) => s.id === "differential")!;
    const res = gradeStep(
      step,
      "NSTEMI leading given exertional crescendo pattern. Excluding aortic dissection, pulmonary embolism, pericarditis, GERD esophageal spasm, musculoskeletal strain.",
      {},
      cp01.diagnosis,
    );
    expect(res.earned).toBeLessThanOrEqual(res.maxPoints);
  });

  it("LLM matches only ADD case-defined items; unknown items are ignored", () => {
    const step = cp01.steps.find((s) => s.id === "management")!;
    // Neutral answer so no item matches deterministically — only the LLM's
    // matches should be credited, and only those that name a defined item.
    const res = gradeStep(
      step,
      "placeholder answer",
      { llmItems: ["Aspirin", "Totally Invented Item Worth 50"] },
      cp01.diagnosis,
    );
    expect(res.credited.map((c) => c.item)).toContain("Aspirin");
    expect(res.credited.some((c) => c.item.includes("Invented"))).toBe(false);
    expect(res.earned).toBe(4);
  });

  it("communication is scored from case items and added as capped bonus", () => {
    const state = playPerfectEncounter();
    const withComm: EngineState = {
      ...state,
      conversation: [
        { role: "student", text: "What brings you in today?", kind: "speech" },
        { role: "student", text: "I'm sorry, that sounds really uncomfortable.", kind: "speech" },
        { role: "student", text: "Is it okay if I ask some personal questions?", kind: "speech" },
        { role: "student", text: "Next, we will get an EKG and some blood tests.", kind: "speech" },
        { role: "student", text: "Does that make sense? Any questions for me?", kind: "speech" },
      ],
    };
    const report = buildScoreReport(cp01, withComm, SCORE_BANDS);
    expect(report.communication).not.toBeNull();
    expect(report.communication!.earned).toBe(5);
    expect(report.overall).toBeLessThanOrEqual(100);
  });

  it("breadth credit rewards a wide differential, capped at the section max", () => {
    const step = cp01.steps.find((s) => s.id === "differential")!;
    const broad = ["Pneumothorax", "Anxiety / panic", "Herpes zoster", "Peptic ulcer"];
    const narrow = gradeStep(step, "NSTEMI.", {}, cp01.diagnosis);
    const wide = gradeStep(
      step,
      "NSTEMI; also pneumothorax, anxiety, herpes zoster, peptic ulcer.",
      { breadthItems: broad },
      cp01.diagnosis,
    );
    expect(wide.earned).toBeGreaterThan(narrow.earned); // breadth is rewarded
    expect(wide.earned).toBeLessThanOrEqual(wide.maxPoints); // still capped
    expect(wide.credited.some((c) => c.evidence.includes("framework"))).toBe(true);
  });

  it("score bands resolve correctly", () => {
    expect(scoreBandFor(SCORE_BANDS, 90)).toBe("Honors-level reasoning");
    expect(scoreBandFor(SCORE_BANDS, 70)).toBe("Solid pass");
    expect(scoreBandFor(SCORE_BANDS, 54)).toBe("Needs significant review");
  });

  it("submit computes and stores the report exactly once", () => {
    let state = playPerfectEncounter();
    state = submit(state, cp01, SCORE_BANDS, T0 + 1000);
    expect(state.submitted).toBe(true);
    expect(state.currentState).toBe("FEEDBACK");
    expect(state.overallScore).toBe(state.result!.overall);
    const again = submit(state, cp01, SCORE_BANDS, T0 + 2000);
    expect(again).toBe(state);
  });
});
