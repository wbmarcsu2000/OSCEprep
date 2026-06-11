import type { ScoreReport } from "../../engine/types";
import { DOMAIN_LABELS } from "../../engine/types";

export function Scorecard({ report }: { report: ScoreReport }) {
  const domains = Object.keys(report.domainMax);
  const ringColor =
    report.overall >= 70
      ? "var(--color-exam-ok)"
      : report.overall >= 55
        ? "var(--color-exam-warn)"
        : "var(--color-exam-danger)";
  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
        <div
          className="flex flex-col items-center justify-center gap-1.5 py-7 sm:border-r border-b sm:border-b-0"
          style={{ borderColor: "var(--color-exam-border)", background: "#fafbfd" }}
        >
          <div className="relative h-28 w-28" role="img" aria-label={`Overall score ${report.overall} out of 100`}>
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-exam-border)" strokeWidth="9" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={ringColor}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={`${(report.overall / 100) * 264} 264`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono tabular-nums leading-none">{report.overall}</span>
              <span className="hint">/ 100</span>
            </div>
          </div>
          <span className="text-[13px] font-semibold text-center px-3" style={{ color: ringColor }}>
            {report.band}
          </span>
        </div>
        <div className="p-5 space-y-2.5">
          {domains.map((d) => {
            const max = report.domainMax[d];
            const earned = report.domainScores[d] ?? 0;
            const pct = max > 0 ? Math.min(100, (earned / max) * 100) : 0;
            return (
              <div key={d} className="grid grid-cols-[150px_1fr_80px] items-center gap-3 text-[13.5px]">
                <span className="font-medium">
                  {DOMAIN_LABELS[d as keyof typeof DOMAIN_LABELS] ?? d}
                </span>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#eef1f5" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background:
                        pct >= 70
                          ? "var(--color-exam-ok)"
                          : pct >= 40
                            ? "var(--color-exam-warn)"
                            : "var(--color-exam-danger)",
                    }}
                  />
                </div>
                <span className="font-mono text-right tabular-nums text-[12.5px]" style={{ color: "var(--color-exam-muted)" }}>
                  {earned.toFixed(1)} / {max}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
