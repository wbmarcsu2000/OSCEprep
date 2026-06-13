import { describe, it, expect } from "vitest";
import { NEURO_SESSIONS } from "../sessions";

const STEP_KEYS = new Set(["localize", "differential", "investigations", "diagnosis", "management"]);

describe("neuro case library", () => {
  it("has the 9 sessions and 38 cases", () => {
    expect(NEURO_SESSIONS.length).toBe(9);
    const total = NEURO_SESSIONS.reduce((n, s) => n + s.cases.length, 0);
    expect(total).toBe(38);
  });

  it("every case is well-formed and neuro-appropriate (no EKG/CXR)", () => {
    const ids = new Set<string>();
    for (const s of NEURO_SESSIONS) {
      expect(s.id.length, `${s.title} id`).toBeGreaterThan(0);
      expect(s.cases.length, `${s.title} has cases`).toBeGreaterThan(0);
      for (const c of s.cases) {
        expect(ids.has(c.id), `duplicate case id ${c.id}`).toBe(false);
        ids.add(c.id);
        expect(c.vignette.length, `${c.id} vignette`).toBeGreaterThan(20);
        expect(c.exam.length, `${c.id} exam`).toBeGreaterThan(10);
        expect(c.diagnosis.length, `${c.id} diagnosis`).toBeGreaterThan(0);
        expect(["easy", "moderate", "hard"]).toContain(c.difficulty);
        expect(c.steps.length, `${c.id} has steps`).toBeGreaterThan(0);
        expect(c.pearls.length, `${c.id} has pearls`).toBeGreaterThan(0);
        const keys = c.steps.map((st) => st.key);
        // Always resolves to a diagnosis and a management plan.
        expect(keys, `${c.id} ends in diagnosis`).toContain("diagnosis");
        expect(keys, `${c.id} ends in management`).toContain("management");
        for (const st of c.steps) {
          expect(STEP_KEYS.has(st.key), `${c.id} bad step key ${st.key}`).toBe(true);
          expect(st.idealAnswer.length, `${c.id}/${st.key} model answer`).toBeGreaterThan(10);
          expect(st.keyPoints.length, `${c.id}/${st.key} keyPoints`).toBeGreaterThan(0);
        }
        // This mode never has EKG/CXR interpretation.
        const blob = JSON.stringify(c).toLowerCase();
        expect(blob.includes("ekg"), `${c.id} mentions EKG`).toBe(false);
        expect(blob.includes("cxr"), `${c.id} mentions CXR`).toBe(false);
      }
    }
  });
});
