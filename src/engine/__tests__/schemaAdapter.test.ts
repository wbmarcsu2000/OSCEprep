import { describe, it, expect } from "vitest";
import { adaptCase, parsePatientFile, stripStageDirections } from "../schemaAdapter";
import {
  createSession,
  transition,
  askQuestion,
  doManeuver,
  saveAnswer,
  submit,
} from "../stateMachine";
import { MANEUVERS } from "../maneuvers";
import { chestpain01, dyspnea01, asOriginalSchema, SCORE_BANDS } from "./fixtures";

const T0 = 1_700_000_000_000;

describe("stripStageDirections — never leak author instructions to the student", () => {
  it("drops verb-led / instruction parentheticals but keeps clinical ones", () => {
    expect(stripStageDirections("(Reveal these only if asked about medical history.)")).toBe("");
    expect(
      stripStageDirections("Type 2 diabetes (last A1c ~10). (Reveal these only if asked about PMH.)"),
    ).toBe("Type 2 diabetes (last A1c ~10).");
    expect(stripStageDirections("Chest pain (do not volunteer the cocaine use unless asked).")).toBe(
      "Chest pain.",
    );
    // clinical parentheticals are preserved
    expect(stripStageDirections("Metformin (often skips it).")).toBe("Metformin (often skips it).");
    expect(stripStageDirections("Pain 8/10 (worse leaning back).")).toBe("Pain 8/10 (worse leaning back).");
  });

  it("a revealed patient-file segment never contains a stage direction", () => {
    const segs = parsePatientFile(
      "HPI: pain started 8h ago.\nPMH: diabetes (last A1c ~10). (Reveal only if asked about medical history.)",
    ).historySegments;
    expect(segs.some((s) => /reveal|only if asked|do not/i.test(s.text))).toBe(false);
  });
});

describe("schema adapter (§11.6)", () => {
  it("an upgraded case uses the richer fields", () => {
    const m = adaptCase(chestpain01);
    expect(m.flags.hasHistoryTriggers).toBe(true);
    expect(m.flags.hasExamMappings).toBe(true);
    expect(m.flags.hasOverallScoring).toBe(true);
    expect(m.flags.hasStandardizedPatient).toBe(true);
    expect(m.sp.derived).toBe(false);
    expect(Object.values(m.domainWeights).reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("an original-only case loads with conservative fallbacks", () => {
    const m = adaptCase(asOriginalSchema(chestpain01));
    expect(m.flags.hasHistoryTriggers).toBe(false);
    expect(m.flags.hasOverallScoring).toBe(false);
    expect(m.sp.derived).toBe(true);
    expect(m.sp.affect.length).toBeGreaterThan(0); // derived from PERSONA
    // Weights inferred from steps[].max, renormalized to 100.
    expect(Object.values(m.domainWeights).reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("an original-only case plays end-to-end via fallbacks", () => {
    const m = adaptCase(asOriginalSchema(chestpain01));
    let s = createSession(m, "STRICT_OSCE", T0);
    s = transition(s, "PATIENT_ENCOUNTER", m, T0);
    // Without triggers, grounded generic matching still answers from the file.
    const q = askQuestion(s, m, "Tell me about your chest pain — when did it start?");
    s = q.state;
    for (const c of q.revealedContent) {
      expect(chestpain01.patientFile.includes(c)).toBe(true);
    }
    // Exam works via the patientFile exam-line fallback.
    const ex = doManeuver(s, m, "auscultate_mitral_area");
    s = ex.state;
    expect(ex.findings.length).toBeGreaterThan(0);
    s = transition(s, "POST_ENCOUNTER", m, T0);
    s = saveAnswer(s, "revised", "NSTEMI");
    s = submit(s, m, SCORE_BANDS, T0);
    expect(s.currentState).toBe("FEEDBACK");
    expect(s.overallScore).toBeGreaterThanOrEqual(0);
    expect(s.overallScore).toBeLessThanOrEqual(100);
  });

  it("patientFile parsing separates history, exam, and hidden rules", () => {
    const parsed = parsePatientFile(chestpain01.patientFile);
    expect(parsed.persona.toLowerCase()).toContain("62-year-old");
    expect(parsed.historySegments.length).toBeGreaterThan(5);
    expect(parsed.examLines.length).toBeGreaterThan(3);
    const all = [
      ...parsed.historySegments.map((s) => s.text),
      ...parsed.examLines.map((l) => l.text),
    ].join(" ");
    expect(all).not.toMatch(/NEVER state or hint/i);
  });

  it("no clinical fact appears in any output that is not in the source JSON", () => {
    // Exhaustive sweep: every maneuver and a battery of questions, on both
    // schema variants, against the full source text + fixed safe phrases.
    const fixedSafe = new Set<string>([
      ...MANEUVERS.map((d) => d.defaultNormal),
      "Examination unremarkable.",
      "No, nothing like that.",
      "Not that I've noticed, no.",
      "No, I don't think so.",
    ]);
    for (const raw of [chestpain01, dyspnea01, asOriginalSchema(chestpain01)]) {
      const source = JSON.stringify(raw);
      const m = adaptCase(raw);
      let s = createSession(m, "STRICT_OSCE", T0);
      s = transition(s, "PATIENT_ENCOUNTER", m, T0);
      for (const def of MANEUVERS) {
        const r = doManeuver(s, m, def.id);
        s = r.state;
        for (const f of r.findings) {
          const ok =
            fixedSafe.has(f) ||
            source.includes(JSON.stringify(f).slice(1, -1)) ||
            f.split("; ").every((part) => raw.patientFile.includes(part)) ||
            f.split(", ").every((part) => raw.patientFile.includes(part));
          expect(ok, `exam output not grounded: "${f}"`).toBe(true);
        }
      }
      const questions = [
        "When did this start?",
        "Do you smoke?",
        "How much do you drink?",
        "What medications are you on?",
        "Any fevers or chills?",
        "Any family history of heart problems?",
        "What were you doing when it began?",
      ];
      for (const q of questions) {
        const r = askQuestion(s, m, q);
        s = r.state;
        for (const c of r.revealedContent) {
          const ok = fixedSafe.has(c) || raw.patientFile.includes(c) ||
            source.includes(JSON.stringify(c).slice(1, -1));
          expect(ok, `history output not grounded: "${c}"`).toBe(true);
        }
      }
    }
  });
});
