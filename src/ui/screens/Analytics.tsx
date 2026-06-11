import { useMemo } from "react";
import { loadAttempts, topByFrequency, averageBy } from "../../analytics/store";
import { DOMAIN_LABELS } from "../../engine/types";
import { MANEUVER_BY_ID } from "../../engine/maneuvers";
import { useAppStore } from "../store";

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-3 border w-full" style={{ borderColor: "var(--color-exam-border)", background: "#f1f3f5" }}>
      <div className="h-full" style={{ width: `${pct}%`, background: "var(--color-exam-accent)" }} />
    </div>
  );
}

function FreqTable({ title, rows }: { title: string; rows: { key: string; count: number }[] }) {
  return (
    <div className="card p-3">
      <div className="panel-label mb-2">{title}</div>
      {rows.length === 0 ? (
        <p className="text-[13px] italic" style={{ color: "var(--color-exam-muted)" }}>
          No data yet.
        </p>
      ) : (
        <table className="w-full text-[13px]">
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b" style={{ borderColor: "#eef0f3" }}>
                <td className="py-1 pr-2">{r.key}</td>
                <td className="py-1 font-mono text-right w-10">{r.count}×</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function Analytics() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const attempts = useMemo(() => loadAttempts(), []);

  const domainAverages = useMemo(() => {
    const sums = new Map<string, { earned: number; max: number; n: number }>();
    for (const a of attempts) {
      for (const [d, v] of Object.entries(a.domainScores)) {
        const cur = sums.get(d) ?? { earned: 0, max: 0, n: 0 };
        cur.earned += v;
        cur.max += a.domainMax[d] ?? 0;
        cur.n += 1;
        sums.set(d, cur);
      }
    }
    return [...sums.entries()].map(([d, { earned, max }]) => ({
      domain: DOMAIN_LABELS[d as keyof typeof DOMAIN_LABELS] ?? d,
      pct: max > 0 ? Math.round((earned / max) * 100) : 0,
    }));
  }, [attempts]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <div className="card p-4 flex items-center justify-between">
        <div>
          <div className="panel-label">Longitudinal Performance</div>
          <h2 className="text-lg font-bold">
            {attempts.length} completed station{attempts.length === 1 ? "" : "s"}
          </h2>
        </div>
        <button className="btn btn-primary" onClick={exitToSelect}>
          Return to station list
        </button>
      </div>

      {/* Score over time */}
      <div className="card p-3">
        <div className="panel-label mb-2">Overall score by attempt (chronological)</div>
        {attempts.length === 0 ? (
          <p className="text-[13px] italic" style={{ color: "var(--color-exam-muted)" }}>
            Complete a station to begin tracking.
          </p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {attempts.map((a, i) => (
              <div
                key={i}
                className="flex-1 max-w-8 relative group"
                title={`${a.caseId}: ${a.overall}/100 (${a.band})`}
                style={{
                  height: `${a.overall}%`,
                  background:
                    a.overall >= 70 ? "var(--color-exam-ok)" : a.overall >= 55 ? "var(--color-exam-warn)" : "var(--color-exam-danger)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="card p-3">
          <div className="panel-label mb-2">Average performance by domain</div>
          <div className="space-y-1.5">
            {domainAverages.map((d) => (
              <div key={d.domain} className="grid grid-cols-[150px_1fr_44px] items-center gap-2 text-[13px]">
                <span>{d.domain}</span>
                <Bar value={d.pct} max={100} />
                <span className="font-mono text-right">{d.pct}%</span>
              </div>
            ))}
            {domainAverages.length === 0 && (
              <p className="text-[13px] italic" style={{ color: "var(--color-exam-muted)" }}>
                No data yet.
              </p>
            )}
          </div>
        </div>
        <div className="card p-3">
          <div className="panel-label mb-2">Mean score by chief-complaint category / difficulty</div>
          <table className="w-full text-[13px]">
            <tbody>
              {averageBy(attempts, (a) => a.category).map((r) => (
                <tr key={r.key} className="border-b" style={{ borderColor: "#eef0f3" }}>
                  <td className="py-1">{r.key}</td>
                  <td className="py-1 font-mono text-right">
                    {r.mean}/100 <span style={{ color: "var(--color-exam-muted)" }}>(n={r.n})</span>
                  </td>
                </tr>
              ))}
              {averageBy(attempts, (a) => `Difficulty: ${a.difficulty}`).map((r) => (
                <tr key={r.key} className="border-b" style={{ borderColor: "#eef0f3" }}>
                  <td className="py-1 capitalize">{r.key}</td>
                  <td className="py-1 font-mono text-right">
                    {r.mean}/100 <span style={{ color: "var(--color-exam-muted)" }}>(n={r.n})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <FreqTable
          title="Most-missed diagnoses (low-scoring cases)"
          rows={topByFrequency(attempts.filter((a) => a.overall < 70).map((a) => a.diagnosis))}
        />
        <FreqTable
          title="Most-missed history topics"
          rows={topByFrequency(attempts.flatMap((a) => a.missedTriggerIds.map((t) => t.replace(/_/g, " "))))}
        />
        <FreqTable
          title="Most-missed exam maneuvers"
          rows={topByFrequency(
            attempts.flatMap((a) => a.missedManeuverIds.map((m) => MANEUVER_BY_ID.get(m)?.label ?? m)),
          )}
        />
        <FreqTable title="Most common penalties" rows={topByFrequency(attempts.flatMap((a) => a.penalties))} />
        <FreqTable title="Unsafe actions triggered" rows={topByFrequency(attempts.flatMap((a) => a.unsafeActions))} />
        <FreqTable
          title="Stations with critical misses"
          rows={topByFrequency(attempts.filter((a) => a.criticalMissCount > 0).map((a) => a.caseId))}
        />
      </div>
    </div>
  );
}
