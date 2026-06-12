import { describe, it, expect } from "vitest";
import { manifest, loadRawCase, scoreBands } from "../../data/loader";
import { adaptCase } from "../schemaAdapter";
import {
  createSession,
  transition,
  askQuestion,
  doManeuver,
  saveAnswer,
  submit,
} from "../stateMachine";
import { MANEUVERS } from "../maneuvers";

const T0 = 1_700_000_000_000;

describe("full case library", () => {
  it("manifest lists the full case library with required catalog fields", () => {
    expect(manifest.cases.length).toBe(68);
    for (const c of manifest.cases) {
      expect(c.id).toBeTruthy();
      expect(c.file).toBeTruthy();
      expect(c.category).toBeTruthy();
      expect(c.title).toBeTruthy();
    }
  });

  it("every case adapts cleanly with 100-point domain weights", async () => {
    for (const entry of manifest.cases) {
      const raw = await loadRawCase(entry.id);
      const m = adaptCase(raw);
      const total = Object.values(m.domainWeights).reduce((a, b) => a + b, 0);
      expect(total, `${entry.id} weights must total 100`).toBe(100);
      expect(m.steps.length, `${entry.id} has steps`).toBeGreaterThan(0);
      expect(m.historySegments.length, `${entry.id} parsed history`).toBeGreaterThan(3);
      expect(m.examLines.length, `${entry.id} parsed exam`).toBeGreaterThan(2);
      // Every maneuver referenced by the case exists in the catalog.
      const known = new Set(MANEUVERS.map((d) => d.id));
      for (const mapping of m.examMappings) {
        for (const id of mapping.revealedBy) {
          expect(known.has(id), `${entry.id}: unknown maneuver ${id}`).toBe(true);
        }
      }
    }
  });

  it("every case's management cites the MGH manual and has scored actions", async () => {
    for (const entry of manifest.cases) {
      const m = adaptCase(await loadRawCase(entry.id));
      const mgmt = m.steps.find((s) => s.id === "management");
      expect(mgmt, `${entry.id} has a management step`).toBeTruthy();
      const ref = mgmt!.mghReference;
      expect(ref, `${entry.id} management cites a reference`).toBeTruthy();
      expect(ref!.manual).toContain("MGH Housestaff Manual");
      expect(ref!.page, `${entry.id} reference page`).toBeGreaterThan(0);
      expect(ref!.section.length, `${entry.id} reference section`).toBeGreaterThan(0);
      // Management is itemized (not graded purely by ideal-answer overlap).
      const sc = mgmt!.scoring!;
      expect(sc.criticalActions.length, `${entry.id} has critical actions`).toBeGreaterThan(0);
      const itemized =
        [...sc.criticalActions, ...sc.coreActions].reduce((a, b) => a + b.points, 0);
      expect(itemized, `${entry.id} management is substantially itemized`).toBeGreaterThanOrEqual(15);
    }
  });

  it("a representative case from each category completes end-to-end", async () => {
    const byCategory = new Map<string, string>();
    for (const c of manifest.cases) {
      if (!byCategory.has(c.category)) byCategory.set(c.category, c.id);
    }
    expect(byCategory.size).toBeGreaterThanOrEqual(8);
    for (const id of byCategory.values()) {
      const m = adaptCase(await loadRawCase(id));
      let s = createSession(m, "STRICT_OSCE", T0);
      s = transition(s, "PATIENT_ENCOUNTER", m, T0);
      s = askQuestion(s, m, "Tell me what brought you in today?").state;
      s = askQuestion(s, m, "Do you smoke or drink alcohol?").state;
      s = askQuestion(s, m, "What medications do you take?").state;
      for (const def of MANEUVERS.slice(0, 12)) s = doManeuver(s, m, def.id).state;
      s = transition(s, "POST_ENCOUNTER", m, T0);
      expect(s.patientLocked).toBe(true);
      for (const step of m.steps) s = saveAnswer(s, step.id, "see assessment");
      s = submit(s, m, scoreBands, T0);
      expect(s.currentState, `${id} reaches feedback`).toBe("FEEDBACK");
      expect(s.overallScore).toBeGreaterThanOrEqual(0);
      expect(s.overallScore).toBeLessThanOrEqual(100);
      expect(s.result!.sections.length).toBeGreaterThan(2);
    }
  });

  it("no case output ever contains another case's diagnosis leak via reveals", async () => {
    // Spot-check: the SP must never voice the diagnosis string itself.
    for (const entry of manifest.cases.slice(0, 10)) {
      const m = adaptCase(await loadRawCase(entry.id));
      let s = createSession(m, "STRICT_OSCE", T0);
      s = transition(s, "PATIENT_ENCOUNTER", m, T0);
      const probes = [
        "What do you think is wrong with you?",
        "What is your diagnosis?",
        `Do you have ${m.diagnosis}?`,
      ];
      for (const p of probes) {
        const r = askQuestion(s, m, p);
        s = r.state;
        for (const c of r.revealedContent) {
          expect(c.toLowerCase()).not.toContain(m.diagnosis.toLowerCase());
        }
      }
    }
  });
});
