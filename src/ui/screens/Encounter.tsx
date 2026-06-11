import { useState } from "react";
import type { CaseModel } from "../../engine/types";
import { SpConversation } from "../components/SpConversation";
import { ExamManeuverPanel } from "../components/ExamManeuverPanel";
import { ChartSummary } from "../components/ChartSummary";
import { Scratchpad } from "../components/Scratchpad";
import { useAppStore } from "../store";

type RailTab = "exam" | "chart" | "notes";

export function Encounter({ caseModel }: { caseModel: CaseModel }) {
  const endEncounterEarly = useAppStore((s) => s.endEncounterEarly);
  const examCount = useAppStore((s) => s.engine?.examManeuversPerformed.length ?? 0);
  const [tab, setTab] = useState<RailTab>("exam");
  const [confirmEnd, setConfirmEnd] = useState(false);

  const tabs: { key: RailTab; label: string }[] = [
    { key: "exam", label: examCount > 0 ? `Physical Exam · ${examCount}` : "Physical Exam" },
    { key: "chart", label: "Door Chart" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <div className="h-full grid grid-cols-[1.5fr_minmax(360px,1fr)] gap-4 p-4 min-h-0 max-w-[1400px] mx-auto w-full">
      <SpConversation />
      <div className="flex flex-col gap-3 min-h-0">
        <div className="card flex flex-col min-h-0 flex-1 overflow-hidden">
          <div
            role="tablist"
            aria-label="Encounter tools"
            className="flex border-b px-2 pt-2 gap-1"
            style={{ borderColor: "var(--color-exam-border)" }}
          >
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  className="px-3.5 py-2 text-[13px] font-semibold rounded-t-lg transition-colors"
                  style={{
                    color: active ? "var(--color-exam-accent-deep)" : "var(--color-exam-muted)",
                    background: active ? "var(--color-exam-accent-soft)" : "transparent",
                    boxShadow: active ? "inset 0 -2px 0 var(--color-exam-accent)" : "none",
                  }}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
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
            className="card p-4 space-y-3"
            style={{ borderColor: "#ecc8c8", background: "var(--color-exam-danger-soft)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--color-exam-danger)" }}>
              End the encounter? The patient will be permanently unavailable.
            </p>
            <div className="flex gap-2">
              <button className="btn btn-danger" onClick={endEncounterEarly}>
                End encounter
              </button>
              <button className="btn" onClick={() => setConfirmEnd(false)}>
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
