import type { CaseModel } from "../../engine/types";

/** Door chart: ageSex, CC, vitals, one-liner. Never anything hidden. */
export function ChartSummary({
  caseModel,
  bare = false,
}: {
  caseModel: CaseModel;
  bare?: boolean;
}) {
  const { chart } = caseModel;
  const vitals: [string, string][] = [
    ["BP", chart.vitals.BP],
    ["HR", chart.vitals.HR],
    ["RR", chart.vitals.RR],
    ["Temp", chart.vitals.Temp],
    ["SpO₂", chart.vitals.SpO2],
  ];
  const body = (
    <div className="p-4 space-y-4 text-sm">
      <div className="flex gap-8">
        <div>
          <div className="panel-label mb-0.5">Patient</div>
          <div className="font-semibold text-base">{chart.ageSex}</div>
        </div>
        <div>
          <div className="panel-label mb-0.5">Chief Complaint</div>
          <div className="font-semibold text-base">{chart.cc}</div>
        </div>
      </div>
      <div>
        <div className="panel-label mb-1.5">Vital Signs</div>
        <div className="grid grid-cols-5 gap-1.5">
          {vitals.map(([k, v]) => (
            <div
              key={k}
              className="rounded-lg border px-2 py-1.5 text-center"
              style={{ borderColor: "var(--color-exam-border)", background: "var(--color-exam-soft)" }}
            >
              <div className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--color-exam-faint)" }}>
                {k}
              </div>
              <div className="font-mono text-[13px] font-semibold whitespace-nowrap">{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="panel-label mb-0.5">Triage Note</div>
        <p className="leading-relaxed" style={{ color: "var(--color-exam-ink)" }}>
          {chart.oneLiner}
        </p>
      </div>
    </div>
  );
  if (bare) return body;
  return (
    <div className="card overflow-hidden">
      <div className="card-header" style={{ background: "var(--color-exam-soft)" }}>
        <span className="panel-label">Door Chart</span>
      </div>
      {body}
    </div>
  );
}
