import { useMemo, useRef, useState } from "react";
import {
  loadAttempts,
  topByFrequency,
  averageBy,
  exportAllData,
  importAllData,
  clearAllData,
} from "../../analytics/store";
import { getCurrentStudent, signOut } from "../../auth/identity";
import { DOMAIN_LABELS } from "../../engine/types";
import { MANEUVER_BY_ID } from "../../engine/maneuvers";
import { manifest } from "../../data/loader";
import { recommendNext } from "../gamification";
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
import { loadFmProgress, fmDrillKey, fmSummarize } from "../../data/fmDrillProgress";
import {
  FM_DOMAIN_ORDER,
  FM_DOMAIN_LABELS,
  FM_DOMAIN_EMOJI,
  fmDrillCatalog,
} from "../../data/fmGuidelineDrills";
import { MCQ_BANKS } from "../../data/mcqBank";
import { loadMcqProgress, wasEverMissed, isMastered as mcqIsMastered } from "../../data/mcqProgress";
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

/** Who you're signed in as + a sign-out control. Exported for tests. Renders
 *  nothing when the visitor isn't signed in (e.g. local dev with no endpoint). */
export function AccountSection() {
  const student = getCurrentStudent();
  if (!student) return null;
  return (
    <div className="card p-4">
      <div className="panel-label mb-2">Account</div>
      <p className="hint mb-3">
        Signed in as <span className="font-bold">{student.name}</span> ({student.email}). Your usage
        is shared with the course instructor. Signing out returns you to the sign-in screen on this
        device; it does not remove data already collected.
      </p>
      <button
        className="btn"
        onClick={() => {
          signOut();
          location.reload();
        }}
      >
        Sign out
      </button>
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

/** Longitudinal progress across the Family Medicine guideline drills — the FM
 *  drill store (osce.fmdrills.v1), which the IM drill section above never reads. */
function FmDrillProgressSection() {
  const progress = useMemo(() => loadFmProgress(), []);
  const rows = FM_DOMAIN_ORDER.map((domain) => ({ domain, summary: fmSummarize(domain, progress) }));
  const grand = rows.reduce(
    (a, r) => ({
      seen: a.seen + r.summary.seen,
      total: a.total + r.summary.total,
      mastered: a.mastered + r.summary.mastered,
      needsWork: a.needsWork + r.summary.needsWork,
    }),
    { seen: 0, total: 0, mastered: 0, needsWork: 0 },
  );
  // Coverage average weighted by how many guidelines have been tried in each domain.
  const seenAvg = (() => {
    let sum = 0;
    let n = 0;
    for (const r of rows) {
      if (r.summary.seen) {
        sum += r.summary.avgBestPct * r.summary.seen;
        n += r.summary.seen;
      }
    }
    return n ? Math.round(sum / n) : 0;
  })();

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
        <div className="panel-label">Guideline drills (Family Medicine)</div>
        <span className="hint">
          {grand.seen}/{grand.total} guidelines tried · {grand.mastered} mastered
          {grand.needsWork ? ` · ${grand.needsWork} to review` : ""}
          {grand.seen ? ` · avg ${seenAvg}% coverage` : ""}
        </span>
      </div>
      <div className="space-y-3">
        {rows.map(({ domain, summary }) => (
          <div key={domain}>
            <div className="grid grid-cols-[128px_1fr_auto] items-center gap-2 text-[13px]">
              <span className="font-semibold">
                {FM_DOMAIN_EMOJI[domain]} {FM_DOMAIN_LABELS[domain]}
              </span>
              <div className="progress-track" style={{ height: "0.625rem" }}>
                <div className="progress-fill" style={{ width: `${summary.total ? (summary.seen / summary.total) * 100 : 0}%` }} />
              </div>
              <span className="font-mono text-[12px] tabular-nums" style={{ color: "var(--color-exam-muted)" }}>
                {summary.seen}/{summary.total} · {summary.mastered}✓{summary.seen ? ` · ${summary.avgBestPct}%` : ""}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1" aria-hidden>
              {fmDrillCatalog(domain).map((it) => {
                const p = progress[fmDrillKey(domain, it.id)];
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
      <p className="hint mt-3">Tracked locally on this device — one guideline mastered at a time.</p>
    </div>
  );
}

/** Per-bank question-bank progress (osce.mcq.v1 / osce.fmmcq.v1 / osce.obmcq.v1),
 *  none of which the drill sections above account for. */
function QbankProgressSection() {
  const rows = useMemo(
    () =>
      MCQ_BANKS.map((bank) => {
        const p = loadMcqProgress(bank.storageKey);
        let seen = 0;
        let mastered = 0;
        let missed = 0;
        for (const q of bank.questions) {
          const s = p[q.id];
          if (s && s.seen > 0) seen += 1;
          if (mcqIsMastered(s)) mastered += 1;
          if (wasEverMissed(s)) missed += 1;
        }
        return { bank, total: bank.questions.length, seen, mastered, missed };
      }),
    [],
  );
  const grand = rows.reduce(
    (a, r) => ({
      seen: a.seen + r.seen,
      total: a.total + r.total,
      mastered: a.mastered + r.mastered,
      missed: a.missed + r.missed,
    }),
    { seen: 0, total: 0, mastered: 0, missed: 0 },
  );

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
        <div className="panel-label">Question banks</div>
        <span className="hint">
          {grand.seen}/{grand.total} questions attempted · {grand.mastered} mastered
          {grand.missed ? ` · ${grand.missed} in the missed pool` : ""}
        </span>
      </div>
      <div className="space-y-3">
        {rows.map(({ bank, total, seen, mastered, missed }) => (
          <div key={bank.id} className="grid grid-cols-[150px_1fr_auto] items-center gap-2 text-[13px]">
            <span className="font-semibold">
              {bank.icon} {bank.eyebrow}
            </span>
            <div className="progress-track" style={{ height: "0.625rem" }}>
              <div className="progress-fill" style={{ width: `${total ? (seen / total) * 100 : 0}%`, background: bank.grad }} />
            </div>
            <span className="font-mono text-[12px] tabular-nums" style={{ color: "var(--color-exam-muted)" }}>
              {seen}/{total} · {mastered}✓{missed ? ` · ${missed}✗` : ""}
            </span>
          </div>
        ))}
      </div>
      <p className="hint mt-3">
        <span style={{ color: "var(--color-exam-ok)" }}>✓ mastered</span> = last answer correct ·{" "}
        <span style={{ color: "var(--color-exam-danger)" }}>✗ missed</span> = ever answered wrong (sticky review pool).
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
      <FmDrillProgressSection />
      <QbankProgressSection />

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

      <AccountSection />
      <DataManagement />
    </div>
  );
}
