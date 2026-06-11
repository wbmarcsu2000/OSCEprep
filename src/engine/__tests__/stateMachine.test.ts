import { describe, it, expect } from "vitest";
import { adaptCase } from "../schemaAdapter";
import {
  createSession,
  transition,
  tick,
  askQuestion,
  doManeuver,
  saveAnswer,
  submit,
  serializeSession,
  deserializeSession,
  ENCOUNTER_SECONDS,
  POST_ENCOUNTER_SECONDS,
} from "../stateMachine";
import { chestpain01, SCORE_BANDS } from "./fixtures";

const cp01 = adaptCase(chestpain01);
const T0 = 1_700_000_000_000;

describe("state machine (§11.4)", () => {
  it("starts in CHART_REVIEW with the case chart timer", () => {
    const s = createSession(cp01, "STRICT_OSCE", T0);
    expect(s.currentState).toBe("CHART_REVIEW");
    expect(s.chartReviewTimeRemaining).toBe(cp01.chart.timer ?? 180);
  });

  it("transitions are forward-only", () => {
    let s = createSession(cp01, "STRICT_OSCE", T0);
    s = transition(s, "PATIENT_ENCOUNTER", cp01, T0);
    expect(s.currentState).toBe("PATIENT_ENCOUNTER");
    const back = transition(s, "CHART_REVIEW", cp01, T0);
    expect(back.currentState).toBe("PATIENT_ENCOUNTER");
    s = transition(s, "POST_ENCOUNTER", cp01, T0);
    const back2 = transition(s, "PATIENT_ENCOUNTER", cp01, T0);
    expect(back2.currentState).toBe("POST_ENCOUNTER");
  });

  it("FEEDBACK is unreachable until submitted", () => {
    let s = createSession(cp01, "STRICT_OSCE", T0);
    s = transition(s, "PATIENT_ENCOUNTER", cp01, T0);
    s = transition(s, "POST_ENCOUNTER", cp01, T0);
    const blocked = transition(s, "FEEDBACK", cp01, T0);
    expect(blocked.currentState).toBe("POST_ENCOUNTER");
    const submitted = submit(s, cp01, SCORE_BANDS, T0);
    expect(submitted.currentState).toBe("FEEDBACK");
  });

  it("entering POST_ENCOUNTER permanently locks patient access", () => {
    let s = createSession(cp01, "STRICT_OSCE", T0);
    s = transition(s, "PATIENT_ENCOUNTER", cp01, T0);
    s = transition(s, "POST_ENCOUNTER", cp01, T0);
    expect(s.patientLocked).toBe(true);
    const q = askQuestion(s, cp01, "Do you smoke?");
    expect(q.state).toBe(s);
    expect(q.revealedContent).toEqual([]);
    const m = doManeuver(s, cp01, "auscultate_mitral_area");
    expect(m.state).toBe(s);
    expect(m.findings).toEqual([]);
  });

  it("patient lock survives a simulated refresh, even if tampered", () => {
    let s = createSession(cp01, "STRICT_OSCE", T0);
    s = transition(s, "PATIENT_ENCOUNTER", cp01, T0);
    s = transition(s, "POST_ENCOUNTER", cp01, T0);
    const json = serializeSession(s);
    const tampered = json.replace('"patientLocked":true', '"patientLocked":false');
    const restored = deserializeSession(tampered)!;
    expect(restored.patientLocked).toBe(true);
    const q = askQuestion(restored, cp01, "Do you smoke?");
    expect(q.revealedContent).toEqual([]);
  });
});

describe("timers (§11.5)", () => {
  it("chart review expiry auto-transitions to the encounter", () => {
    let s = createSession(cp01, "STRICT_OSCE", T0);
    const chartMs = (cp01.chart.timer ?? 180) * 1000;
    s = tick(s, cp01, T0 + chartMs + 1, SCORE_BANDS);
    expect(s.currentState).toBe("PATIENT_ENCOUNTER");
    expect(s.encounterTimeRemaining).toBe(ENCOUNTER_SECONDS);
  });

  it("timers track wall-clock deltas (throttle-proof)", () => {
    let s = createSession(cp01, "STRICT_OSCE", T0);
    // Simulate the tab being frozen for 100s — a single late tick must
    // reflect the full elapsed time.
    s = tick(s, cp01, T0 + 100_000, SCORE_BANDS);
    expect(s.chartReviewTimeRemaining).toBe((cp01.chart.timer ?? 180) - 100);
  });

  it("manual early end works; encounter cannot be extended", () => {
    let s = createSession(cp01, "STRICT_OSCE", T0);
    s = transition(s, "PATIENT_ENCOUNTER", cp01, T0);
    s = transition(s, "POST_ENCOUNTER", cp01, T0 + 5000); // early end
    expect(s.currentState).toBe("POST_ENCOUNTER");
    expect(s.postEncounterTimeRemaining).toBe(POST_ENCOUNTER_SECONDS);
  });

  it("post-encounter expiry auto-submits and shows feedback", () => {
    let s = createSession(cp01, "STRICT_OSCE", T0);
    s = transition(s, "PATIENT_ENCOUNTER", cp01, T0);
    s = transition(s, "POST_ENCOUNTER", cp01, T0);
    s = saveAnswer(s, "revised", "NSTEMI");
    s = tick(s, cp01, T0 + POST_ENCOUNTER_SECONDS * 1000 + 1, SCORE_BANDS);
    expect(s.submitted).toBe(true);
    expect(s.currentState).toBe("FEEDBACK");
    expect(s.result).not.toBeNull();
  });

  it("practice mode has no deadlines and never auto-advances", () => {
    let s = createSession(cp01, "PRACTICE", T0);
    expect(s.phaseDeadline).toBeNull();
    s = tick(s, cp01, T0 + 10_000_000, SCORE_BANDS);
    expect(s.currentState).toBe("CHART_REVIEW");
  });
});
