import { useState } from "react";
import type { CaseModel } from "../../engine/types";
import { SpConversation } from "../components/SpConversation";
import { ExamManeuverPanel } from "../components/ExamManeuverPanel";
import { ChartSummary } from "../components/ChartSummary";
import { Scratchpad } from "../components/Scratchpad";
import { RailTabs, panelId } from "../components/RailTabs";
import { useAppStore } from "../store";

type RailKey = "exam" | "chart" | "notes";

const RAIL_ID = "encounter-rail";

export function Encounter({ caseModel }: { caseModel: CaseModel }) {
  const endEncounterEarly = useAppStore((s) => s.endEncounterEarly);
  const examCount = useAppStore((s) => s.engine?.examManeuversPerformed.length ?? 0);
  const [tab, setTab] = useState<RailKey>("exam");
  const [confirmEnd, setConfirmEnd] = useState(false);

  const tabs: { key: RailKey; label: string }[] = [
    { key: "exam", label: examCount > 0 ? `Physical Exam · ${examCount}` : "Physical Exam" },
    { key: "chart", label: "Door Chart" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <div className="lg:h-full grid grid-cols-1 lg:grid-cols-[1.5fr_minmax(360px,1fr)] gap-4 p-3 sm:p-4 lg:min-h-0 max-w-[1400px] mx-auto w-full">
      <div className="h-[60dvh] min-h-[18rem] lg:h-auto lg:min-h-0">
        <SpConversation />
      </div>
      <div className="flex flex-col gap-3 h-[70dvh] min-h-[20rem] lg:h-auto lg:min-h-0">
        <div className="card flex flex-col min-h-0 flex-1 overflow-hidden">
          <RailTabs tabs={tabs} active={tab} onSelect={setTab} label="Encounter tools" idBase={RAIL_ID} />
          <div
            id={panelId(RAIL_ID)}
            role="tabpanel"
            aria-labelledby={`${RAIL_ID}-tab-${tab}`}
            className="flex-1 min-h-0 overflow-hidden"
          >
            {tab === "exam" && <ExamManeuverPanel />}
            {tab === "chart" && (
              <div className="overflow-y-auto h-full scroll-quiet">
                <ChartSummary caseModel={caseModel} bare />
              </div>
            )}
            {tab === "notes" && <Scratchpad rows={14} bare />}
          </div>
        </div>

        {confirmEnd ? (
          <div
            role="alertdialog"
            aria-label="End the encounter early?"
            className="card p-4 space-y-3"
            style={{ borderColor: "var(--color-exam-danger-line)", background: "var(--color-exam-danger-soft)" }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setConfirmEnd(false);
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--color-exam-danger)" }}>
              End the encounter? The patient will be permanently unavailable.
            </p>
            <div className="flex gap-2">
              <button className="btn btn-danger" onClick={endEncounterEarly}>
                End encounter
              </button>
              {/* Focus lands on the safe action so Enter/Space cancels by default. */}
              <button className="btn" autoFocus onClick={() => setConfirmEnd(false)}>
                Keep going
              </button>
            </div>
          </div>
        ) : (
          <button
            className="btn btn-ghost self-end text-[13px]"
            style={{ color: "var(--color-exam-danger)" }}
            onClick={() => setConfirmEnd(true)}
          >
            End encounter early →
          </button>
        )}
      </div>
    </div>
  );
}
