import type { CaseModel } from "../../engine/types";
import { ChartSummary } from "../components/ChartSummary";
import { Scratchpad } from "../components/Scratchpad";
import { useAppStore } from "../store";

export function ChartReview({ caseModel }: { caseModel: CaseModel }) {
  const beginEncounter = useAppStore((s) => s.beginEncounter);
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
      <div className="space-y-1">
        <h2 className="text-[19px] font-bold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
          Review the door chart
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
          You'll have 20 minutes with the patient: a focused history — the patient reveals only
          what you ask — and a focused exam using exact maneuvers. Afterwards the patient is
          unavailable and you'll complete the written exercises.
        </p>
      </div>

      <ChartSummary caseModel={caseModel} />
      <Scratchpad rows={6} />

      <div className="flex items-center justify-between pt-1">
        <span className="hint">The encounter begins automatically when the timer expires.</span>
        <button className="btn btn-primary px-6 py-2.5 text-sm" onClick={beginEncounter}>
          Enter the room →
        </button>
      </div>
    </div>
  );
}
