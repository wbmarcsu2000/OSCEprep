import { useEffect, useState } from "react";
import type { ScoreReport } from "../../engine/types";
import { DOMAIN_LABELS } from "../../engine/types";

/** Count-up over ~900ms with an ease-out curve; respects reduced motion. */
function useCountUp(target: number, animate: boolean): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 900);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, animate]);
  return animate ? value : target;
}

export function Scorecard({ report, animate = false }: { report: ScoreReport; animate?: boolean }) {
  const reduced =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shown = useCountUp(report.overall, animate && !reduced);
  const domains = Object.keys(report.domainMax);
  const ringColor =
    report.overall >= 70
      ? "var(--color-exam-ok)"
      : report.overall >= 55
        ? "var(--color-exam-warn)"
        : "var(--color-exam-danger)";
  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[210px_1fr]">
        <div
          className="flex flex-col items-center justify-center gap-1.5 py-7 sm:border-r border-b sm:border-b-0"
          style={{ borderColor: "var(--color-exam-border)", background: "var(--color-exam-soft)" }}
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
                strokeDasharray={`${(shown / 100) * 264} 264`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono tabular-nums leading-none">{shown}</span>
              <span className="hint">/ 100</span>
            </div>
          </div>
          <span className="text-[13px] font-extrabold text-center px-3" style={{ color: ringColor }}>
            {report.band}
          </span>
        </div>
        <div className="p-5 space-y-2.5">
          {domains.map((d, i) => {
            const max = report.domainMax[d];
            const earned = report.domainScores[d] ?? 0;
            const pct = max > 0 ? Math.min(100, (earned / max) * 100) : 0;
            return (
              <div key={d} className="grid grid-cols-[150px_1fr_80px] items-center gap-3 text-[13.5px]">
                <span className="font-semibold">
                  {DOMAIN_LABELS[d as keyof typeof DOMAIN_LABELS] ?? d}
                </span>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--color-exam-track)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background:
                        pct >= 70
                          ? "var(--grad-teal)"
                          : pct >= 40
                            ? "var(--grad-sun)"
                            : "var(--grad-coral)",
                      transition: "width 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                      transitionDelay: `${i * 70}ms`,
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
