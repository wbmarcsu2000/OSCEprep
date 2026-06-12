import { describe, it, expect } from "vitest";
import { manifest } from "../loader";
import { adaptCase } from "../../engine/schemaAdapter";
import { createSession, submit, saveAnswer, commitWorkup, transition } from "../../engine/stateMachine";
import { scoreBands } from "../loader";
import { breadthCreditForCategory } from "../curriculum";

// Eagerly import every case JSON so we exercise the adapter + a full scoring
// pass on all 68 cases (catches schema drift the Python validator can't).
const modules = import.meta.glob("../cases/*.json", { eager: true }) as Record<string, { default: unknown }>;

describe("every case loads, adapts, and scores", () => {
  it("manifest entries all have a backing file", () => {
    for (const c of manifest.cases) {
      expect(modules[`../cases/${c.file}`], `missing file for ${c.id}`).toBeTruthy();
    }
    expect(manifest.cases.length).toBe(68);
  });

  for (const [path, mod] of Object.entries(modules)) {
    it(`adapts + scores ${path}`, () => {
      const model = adaptCase(mod.default as never);
      expect(model.steps.length).toBe(6);
      expect(model.id).toBeTruthy();
      // Drive a full station to submission with ideal answers; must not throw.
      let e = createSession(model, "PRACTICE", 1_700_000_000_000);
      e = transition(e, "PATIENT_ENCOUNTER", model, 1_700_000_000_000);
      e = transition(e, "POST_ENCOUNTER", model, 1_700_000_000_000);
      for (const s of model.steps) e = saveAnswer(e, s.id, s.idealAnswer ?? "x");
      e = commitWorkup(e);
      const done = submit(e, model, scoreBands, 1_700_000_000_000, {}, breadthCreditForCategory(model.category));
      expect(done.result).toBeTruthy();
      expect(done.result!.overall).toBeGreaterThanOrEqual(0);
      expect(done.result!.overall).toBeLessThanOrEqual(100);
    });
  }
});
