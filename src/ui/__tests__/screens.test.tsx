import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { adaptCase } from "../../engine/schemaAdapter";
import { createSession, transition } from "../../engine/stateMachine";
import { chestpain01 } from "../../engine/__tests__/fixtures";
import { useAppStore } from "../store";
import { ChartReview } from "../screens/ChartReview";
import { PostEncounter } from "../screens/PostEncounter";
import { Encounter } from "../screens/Encounter";

const cp01 = adaptCase(chestpain01);
const T0 = 1_700_000_000_000;

describe("screens hide what must be hidden", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("Chart Review shows only door-chart data — never diagnosis, hidden history, or rubric", () => {
    const engine = createSession(cp01, "STRICT_OSCE", T0);
    useAppStore.setState({ caseModel: cp01, engine, view: "station" });
    render(<ChartReview caseModel={cp01} />);
    expect(screen.getByText(cp01.chart.ageSex)).toBeInTheDocument();
    expect(screen.getByText(cp01.chart.cc)).toBeInTheDocument();
    const html = document.body.innerHTML;
    expect(html).not.toContain(cp01.diagnosis);
    expect(html).not.toContain("crescendo"); // hidden patientFile detail
    for (const step of cp01.steps) {
      if (step.idealAnswer) expect(html).not.toContain(step.idealAnswer);
      if (step.rubric) expect(html).not.toContain(step.rubric);
    }
  });

  it("Encounter never volunteers diagnosis or rubric content", () => {
    let engine = createSession(cp01, "STRICT_OSCE", T0);
    engine = transition(engine, "PATIENT_ENCOUNTER", cp01, T0);
    useAppStore.setState({ caseModel: cp01, engine, view: "station" });
    render(<Encounter caseModel={cp01} />);
    const html = document.body.innerHTML;
    expect(html).not.toContain(cp01.diagnosis);
    expect(html).not.toContain("Troponin"); // diagnostics not available in encounter
  });

  it("Post-Encounter shows the lock and keeps idealAnswer hidden until feedback", () => {
    let engine = createSession(cp01, "STRICT_OSCE", T0);
    engine = transition(engine, "PATIENT_ENCOUNTER", cp01, T0);
    engine = transition(engine, "POST_ENCOUNTER", cp01, T0);
    useAppStore.setState({ caseModel: cp01, engine, view: "station" });
    render(<PostEncounter caseModel={cp01} />);
    expect(screen.getByText(/Patient access locked/i)).toBeInTheDocument();
    const html = document.body.innerHTML;
    for (const step of cp01.steps) {
      if (step.idealAnswer && step.idealAnswer.length > 12) {
        expect(html).not.toContain(step.idealAnswer);
      }
    }
    expect(html).not.toContain(cp01.diagnosis);
  });

  it("Post-Encounter labs stay locked until the workup answer is committed", () => {
    let engine = createSession(cp01, "STRICT_OSCE", T0);
    engine = transition(engine, "PATIENT_ENCOUNTER", cp01, T0);
    engine = transition(engine, "POST_ENCOUNTER", cp01, T0);
    useAppStore.setState({ caseModel: cp01, engine, view: "station" });
    render(<PostEncounter caseModel={cp01} />);
    expect(screen.getByText(/Commit your diagnostic workup/i)).toBeInTheDocument();
    expect(document.body.innerHTML).not.toContain("1.6 ng/mL");
  });
});
