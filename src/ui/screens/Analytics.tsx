import { useMemo, useRef, useState } from "react";
import {
  loadAttempts,
  topByFrequency,
  averageBy,
  exportAllData,
  importAllData,
  clearAllData,
} from "../../analytics/store";
import { DOMAIN_LABELS } from "../../engine/types";
import { MANEUVER_BY_ID } from "../../engine/maneuvers";
import { manifest } from "../../data/loader";
import { badges, levelFor, recommendNext, streakDays, streakAtRisk, totalXp } from "../gamification";
import {
  loadDrillProgress,
  drillCatalog,
  drillKey,
  isMastered,
  isSeen,
  summarize,
  DRILL_TYPE_ORDER,
  DRILL_TYPE_LABELS,
} from "../../data/drillProgress";
import { useMountNow } from "../useMountNow";
import { useAppStore } from "../store";

/** Station titles by case id — caseIds are internal, titles are what users know. */
const TITLE_BY_ID = new Map(manifest.cases.map((c) => [c.id, c.title]));

function stationTitle(caseId: string): string {
  return TITLE_BY_ID.get(caseId) ?? caseId;
}

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="progress-track" style={{ height: "0.625rem" }}>
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function FreqTable({
  title,
  rows,
  labelFor,
  onRowClick,
}: {
  title: string;
  rows: { key: string; count: number }[];
  /** Optional user-facing label for a row key (e.g. case id → station title). */
  labelFor?: (key: string) => string;
  /** When set, each row label becomes a button invoking this with the row key. */
  onRowClick?: (key: string) => void;
}) {
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
            {rows.map((r) => {
              const label = labelFor ? labelFor(r.key) : r.key;
              return (
                <tr key={r.key} className="border-b" style={{ borderColor: "var(--color-exam-border)" }}>
                  <td className="py-1 pr-2">
                    {onRowClick ? (
                      <button
                        type="button"
                        className="text-left font-semibold cursor-pointer underline-offset-2 hover:underline"
                        style={{ color: "var(--color-exam-accent-deep)" }}
                        onClick={() => onRowClick(r.key)}
                        aria-label={`${label} — open review`}
                      >
                        {label}
                      </button>
                    ) : (
                      label
                    )}
                  </td>
                  <td className="py-1 font-mono text-right w-10">{r.count}×</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

/** Export / import / reset for the localStorage-backed progress data. */
function DataManagement() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const exportProgress = () => {
    const blob = new Blob([exportAllData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "osceprep-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = async (file: File) => {
    try {
      const n = importAllData(await file.text());
      setImportStatus({ kind: "ok", text: `Imported ${n} data set${n === 1 ? "" : "s"} — reloading…` });
      location.reload();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "not a valid ClerkTools export";
      setImportStatus({ kind: "error", text: `Import failed: ${msg}` });
    }
  };

  return (
    <div className="card p-4">
      <div className="panel-label mb-2">Data management</div>
      <p className="hint mb-3">
        All progress lives in this browser. Export a backup before switching devices or clearing storage.
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <button className="btn" onClick={exportProgress}>
          ⬇️ Export progress
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()}>
          ⬆️ Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void importFile(file);
          }}
        />
        {confirmingReset ? (
          <span className="inline-flex items-center gap-2 flex-wrap">
            <span className="text-[12.5px] font-bold" style={{ color: "var(--color-exam-danger)" }}>
              Really delete all attempts, reviews, and any in-progress session?
            </span>
            <button
              className="btn btn-danger"
              onClick={() => {
                clearAllData();
                location.reload();
              }}
            >
              Yes, delete everything
            </button>
            <button autoFocus className="btn" onClick={() => setConfirmingReset(false)}>
              Cancel
            </button>
          </span>
        ) : (
          <button className="btn btn-danger" onClick={() => setConfirmingReset(true)}>
            Reset all progress
          </button>
        )}
      </div>
      {importStatus && (
        <p
          role="status"
          className="mt-2 text-[12.5px] font-bold"
          style={{ color: importStatus.kind === "ok" ? "var(--color-exam-ok)" : "var(--color-exam-danger)" }}
        >
          {importStatus.text}
        </p>
      )}
    </div>
  );
}

/** Longitudinal progress + performance across the six Framework Drills. */
function DrillProgressSection() {
  const progress = useMemo(() => loadDrillProgress(), []);
  const rows = DRILL_TYPE_ORDER.map((t) => summarize(t, progress));
  const grand = rows.reduce(
    (a, s) => ({
      seen: a.seen + s.seen,
      total: a.total + s.total,
      mastered: a.mastered + s.mastered,
      attempts: a.attempts + s.attempts,
    }),
    { seen: 0, total: 0, mastered: 0, attempts: 0 },
  );
  // Attempt-weighted mean of best-coverage across drills that have been tried.
  const seenAvg = (() => {
    let sum = 0;
    let n = 0;
    for (const s of rows) {
      if (s.seen) {
        sum += s.avgBestPct * s.seen;
        n += s.seen;
      }
    }
    return n ? Math.round(sum / n) : 0;
  })();

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
        <div className="panel-label">Drill progress &amp; performance</div>
        <span className="hint">
          {grand.attempts} attempt{grand.attempts === 1 ? "" : "s"} · {grand.seen}/{grand.total} problems tried ·{" "}
          {grand.mastered} mastered{grand.seen ? ` · avg ${seenAvg}% coverage` : ""}
        </span>
      </div>
      <div className="space-y-3">
        {rows.map((s) => (
          <div key={s.type}>
            <div className="grid grid-cols-[96px_1fr_auto] items-center gap-2 text-[13px]">
              <span className="font-semibold">{DRILL_TYPE_LABELS[s.type]}</span>
              <div className="progress-track" style={{ height: "0.625rem" }}>
                <div className="progress-fill" style={{ width: `${s.total ? (s.seen / s.total) * 100 : 0}%` }} />
              </div>
              <span className="font-mono text-[12px] tabular-nums" style={{ color: "var(--color-exam-muted)" }}>
                {s.seen}/{s.total} · {s.mastered}✓{s.seen ? ` · ${s.avgBestPct}%` : ""}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1" aria-hidden>
              {drillCatalog(s.type).map((it) => {
                const p = progress[drillKey(s.type, it.id)];
                const mastered = isMastered(p);
                const seen = isSeen(p);
                const review = p?.manual === "review";
                const bg = mastered
                  ? "var(--color-exam-ok)"
                  : review
                    ? "var(--color-exam-warn)"
                    : seen
                      ? "var(--color-exam-accent)"
                      : "var(--color-exam-border-strong)";
                return (
                  <span
                    key={it.id}
                    title={`${it.group ? it.group + ": " : ""}${it.label}${seen ? ` — best ${p!.bestPct}%` : " — unseen"}`}
                    style={{ width: "0.6rem", height: "0.6rem", borderRadius: "2px", background: bg, opacity: seen || mastered || review ? 1 : 0.35 }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="hint mt-3">
        Tracked locally on this device. Squares: <span style={{ color: "var(--color-exam-ok)" }}>■</span> mastered ·{" "}
        <span style={{ color: "var(--color-exam-accent)" }}>■</span> seen ·{" "}
        <span style={{ color: "var(--color-exam-warn)" }}>■</span> needs work · <span style={{ opacity: 0.4 }}>■</span> unseen.
      </p>
    </div>
  );
}

export function Analytics() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const openReview = useAppStore((s) => s.openReview);
  const startCase = useAppStore((s) => s.startCase);
  const preferredMode = useAppStore((s) => s.preferredMode);
  const attempts = useMemo(() => loadAttempts(), []);
  const now = useMountNow();

  const level = levelFor(totalXp(attempts));
  const streak = streakDays(attempts, now);
  const atRisk = streakAtRisk(attempts, now);
  const allBadges = badges(attempts, manifest.cases, now);
  const earnedCount = allBadges.filter((b) => b.earned).length;
  const rec = useMemo(() => recommendNext(attempts, manifest.cases), [attempts]);

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
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-[24px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
            Your Progress
          </h2>
          <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
            {attempts.length} completed case{attempts.length === 1 ? "" : "s"} ·{" "}
            {new Set(attempts.map((a) => a.caseId)).size} unique cases
          </p>
        </div>
        <button className="btn btn-ghost shrink-0" onClick={exitToSelect} style={{ color: "var(--color-exam-accent)" }}>
          Station list →
        </button>
      </div>

      {/* Level / streak / XP hero */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card relative overflow-hidden p-4 text-white" style={{ background: "var(--grad-header)", border: "none" }}>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-white/70">Level {level.level}</div>
          <div className="text-[24px] font-extrabold leading-tight">{level.title}</div>
          <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.25)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.round(level.progress * 100)}%`, background: "#fff", transition: "width 700ms ease" }}
            />
          </div>
          <div className="mt-1.5 text-[12px] font-bold text-white/85 tabular-nums">
            {level.xp} XP{level.toNext > 0 ? ` · ${level.toNext - level.intoLevel} to ${level.level + 1}` : " · max level"}
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <span className={`text-4xl ${streak > 0 ? "flame" : "opacity-40"}`} aria-hidden>🔥</span>
          <div>
            <div className="text-[24px] font-extrabold leading-tight tabular-nums">{streak}</div>
            <div className="text-[12.5px] font-bold" style={{ color: "var(--color-exam-muted)" }}>
              day streak
            </div>
            <div className="hint">
              {atRisk ? "Practice today to keep it alive!" : streak > 0 ? "Going strong" : "Complete a case to start one"}
            </div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <span className="text-4xl" aria-hidden>🏆</span>
          <div>
            <div className="text-[24px] font-extrabold leading-tight tabular-nums">
              {earnedCount} / {allBadges.length}
            </div>
            <div className="text-[12.5px] font-bold" style={{ color: "var(--color-exam-muted)" }}>
              badges earned
            </div>
          </div>
        </div>
      </div>

      {/* What to practice next, straight from the attempt history */}
      {rec && (
        <div
          className="card flex items-center justify-between gap-3 flex-wrap px-4 py-3"
          style={{ background: "var(--color-exam-accent-soft)", borderColor: "var(--color-exam-accent-line)" }}
        >
          <p className="text-[13.5px] font-semibold min-w-0">
            <span aria-hidden>🎯</span> Recommended next:{" "}
            <span className="font-extrabold" style={{ color: "var(--color-exam-accent-deep)" }}>
              {stationTitle(rec.caseId)}
            </span>{" "}
            — {rec.reason}
          </p>
          <button className="btn btn-primary shrink-0" onClick={() => void startCase(rec.caseId, preferredMode)}>
            Start →
          </button>
        </div>
      )}

      {/* Badge wall */}
      <div className="card p-4">
        <div className="panel-label mb-3">Badges</div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
          {allBadges.map((b) => (
            <div key={b.id} className={`badge-tile ${b.earned ? "earned" : "locked"}`} title={b.desc}>
              <span className="text-2xl" aria-hidden>{b.emoji}</span>
              <span className="text-[11px] font-extrabold leading-tight">{b.name}</span>
              <span className="text-[9.5px] leading-tight" style={{ color: "var(--color-exam-muted)" }}>
                {b.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Score over time */}
      <div className="card p-4">
        <div className="panel-label mb-2">Overall score by attempt (chronological)</div>
        {attempts.length === 0 ? (
          <p className="text-[13px] italic" style={{ color: "var(--color-exam-muted)" }}>
            Complete a station to begin tracking.
          </p>
        ) : (
          <>
            <div className="flex items-end gap-1 h-32">
              {attempts.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex-1 max-w-8 h-full flex flex-col justify-end cursor-pointer group"
                  title={`${stationTitle(a.caseId)}: ${a.overall}/100 (${a.band})`}
                  aria-label={`Attempt ${i + 1}: ${stationTitle(a.caseId)} — ${a.overall}/100, open review`}
                  onClick={() => openReview(a.caseId)}
                  style={{ border: "none", padding: 0, background: "transparent" }}
                >
                  <span
                    className="block w-full rounded-t-md transition-opacity group-hover:opacity-80"
                    style={{
                      height: `${a.overall}%`,
                      minHeight: "3px",
                      background:
                        a.overall >= 70 ? "var(--grad-teal)" : a.overall >= 55 ? "var(--grad-sun)" : "var(--grad-coral)",
                    }}
                  />
                </button>
              ))}
            </div>
            {/* Same data as the bars, for screen readers reading the chart as text. */}
            <ul className="sr-only">
              {attempts.map((a, i) => (
                <li key={i}>
                  Attempt {i + 1}: {stationTitle(a.caseId)} — {a.overall}/100 ({a.band})
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <DrillProgressSection />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="panel-label mb-2">Average performance by domain</div>
          <div className="space-y-2">
            {domainAverages.map((d) => (
              <div key={d.domain} className="grid grid-cols-[150px_1fr_44px] items-center gap-2 text-[13px]">
                <span className="font-semibold">{d.domain}</span>
                <Bar value={d.pct} max={100} />
                <span className="font-mono text-right tabular-nums">{d.pct}%</span>
              </div>
            ))}
            {domainAverages.length === 0 && (
              <p className="text-[13px] italic" style={{ color: "var(--color-exam-muted)" }}>
                No data yet.
              </p>
            )}
          </div>
        </div>
        <div className="card p-4">
          <div className="panel-label mb-2">Mean score by chief-complaint category / difficulty</div>
          <table className="w-full text-[13px]">
            <tbody>
              {averageBy(attempts, (a) => a.category).map((r) => (
                <tr key={r.key} className="border-b" style={{ borderColor: "var(--color-exam-border)" }}>
                  <td className="py-1">{r.key}</td>
                  <td className="py-1 font-mono text-right">
                    {r.mean}/100 <span style={{ color: "var(--color-exam-muted)" }}>(n={r.n})</span>
                  </td>
                </tr>
              ))}
              {averageBy(attempts, (a) => `Difficulty: ${a.difficulty}`).map((r) => (
                <tr key={r.key} className="border-b" style={{ borderColor: "var(--color-exam-border)" }}>
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
          title="Cases with critical misses"
          rows={topByFrequency(attempts.filter((a) => a.criticalMissCount > 0).map((a) => a.caseId))}
          labelFor={stationTitle}
          onRowClick={openReview}
        />
      </div>

      <DataManagement />
    </div>
  );
}
