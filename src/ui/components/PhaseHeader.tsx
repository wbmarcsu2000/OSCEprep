import type { CaseModel, EngineState, Phase } from "../../engine/types";
import { Timer } from "./Timer";

const PHASES: { key: Phase; label: string }[] = [
  { key: "CHART_REVIEW", label: "Chart Review" },
  { key: "PATIENT_ENCOUNTER", label: "Encounter" },
  { key: "POST_ENCOUNTER", label: "Post-Encounter" },
  { key: "FEEDBACK", label: "Feedback" },
];

function secondsFor(engine: EngineState): number {
  switch (engine.currentState) {
    case "CHART_REVIEW":
      return engine.chartReviewTimeRemaining;
    case "PATIENT_ENCOUNTER":
      return engine.encounterTimeRemaining;
    case "POST_ENCOUNTER":
      return engine.postEncounterTimeRemaining;
    case "FEEDBACK":
      return 0;
  }
}

export function PhaseHeader({
  caseModel,
  engine,
}: {
  caseModel: CaseModel;
  engine: EngineState;
}) {
  const idx = PHASES.findIndex((p) => p.key === engine.currentState);
  return (
    <div
      className="border-b px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-6 bg-white shrink-0 flex-wrap"
      style={{ borderColor: "var(--color-exam-border)" }}
    >
      <ol className="flex items-center" aria-label="Station phases">
        {PHASES.map((p, i) => {
          const active = i === idx;
          const past = i < idx;
          return (
            <li key={p.key} className="flex items-center">
              {i > 0 && (
                <span
                  aria-hidden
                  className="mx-1.5 sm:mx-2.5 h-px w-3 sm:w-7"
                  style={{ background: past || active ? "var(--color-exam-accent)" : "var(--color-exam-border-strong)" }}
                />
              )}
              <span
                className="flex items-center gap-2"
                aria-current={active ? "step" : undefined}
              >
                <span
                  className="flex h-5.5 w-5.5 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    width: 22,
                    height: 22,
                    background: active
                      ? "var(--color-exam-accent)"
                      : past
                        ? "var(--color-exam-accent-soft)"
                        : "#fff",
                    color: active
                      ? "#fff"
                      : past
                        ? "var(--color-exam-accent-deep)"
                        : "var(--color-exam-faint)",
                    border: active ? "none" : `1px solid ${past ? "#d3def7" : "var(--color-exam-border-strong)"}`,
                  }}
                >
                  {past ? "✓" : i + 1}
                </span>
                <span
                  className={`text-[13px] font-semibold whitespace-nowrap ${active ? "inline" : "hidden md:inline"}`}
                  style={{
                    color: active
                      ? "var(--color-exam-ink)"
                      : past
                        ? "var(--color-exam-muted)"
                        : "var(--color-exam-faint)",
                  }}
                >
                  {p.label}
                  {p.key === "PATIENT_ENCOUNTER" && engine.patientLocked && past ? " 🔒" : ""}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-2 sm:gap-2.5">
        <span className="chip hidden md:inline-flex">{caseModel.category}</span>
        <span className="chip capitalize hidden sm:inline-flex">{caseModel.difficulty}</span>
        <span className={engine.mode === "STRICT_OSCE" ? "chip chip-danger" : "chip"}>
          {engine.mode === "STRICT_OSCE" ? "Strict OSCE" : "Practice"}
        </span>
        {engine.currentState !== "FEEDBACK" && (
          <Timer
            seconds={secondsFor(engine)}
            label={engine.currentState.replace(/_/g, " ").toLowerCase()}
            untimed={engine.phaseDeadline === null}
          />
        )}
      </div>
    </div>
  );
}
