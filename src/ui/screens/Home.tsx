import { useMemo } from "react";
import { manifest } from "../../data/loader";
import { loadAttempts } from "../../analytics/store";
import { levelFor, totalXp, streakDays, streakAtRisk, recommendNext, categoryFlair } from "../gamification";
import { useMountNow } from "../useMountNow";
import { useAppStore } from "../store";

interface UseCase {
  icon: string;
  grad: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
}

function StatTile({
  icon,
  label,
  value,
  sub,
  bar,
  flame,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  bar?: number; // 0..1
  flame?: boolean;
}) {
  return (
    <div className="card p-3.5 flex flex-col gap-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <span className={flame ? "flame" : ""} aria-hidden>{icon}</span>
        <span className="panel-label">{label}</span>
      </div>
      <div className="text-[22px] font-extrabold leading-tight tabular-nums truncate">{value}</div>
      {bar !== undefined && (
        <div className="progress-track" style={{ height: "0.375rem" }}>
          <div className="progress-fill" style={{ width: `${Math.round(bar * 100)}%` }} />
        </div>
      )}
      {sub && <div className="hint truncate">{sub}</div>}
    </div>
  );
}

export function Home() {
  const setView = useAppStore((s) => s.setView);
  const showEnableAi = useAppStore((s) => s.showEnableAi);
  const browseCategory = useAppStore((s) => s.browseCategory);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const preferredMode = useAppStore((s) => s.preferredMode);
  const startCase = useAppStore((s) => s.startCase);
  const startRandomUnattempted = useAppStore((s) => s.startRandomUnattempted);

  const now = useMountNow();
  const stats = useMemo(() => {
    const attempts = loadAttempts();
    const done = new Set(attempts.map((a) => a.caseId)).size;
    const recent = attempts.slice(-10);
    const avg =
      recent.length > 0
        ? Math.round(recent.reduce((s, a) => s + a.overall, 0) / recent.length)
        : null;
    return {
      attempts: attempts.length,
      done,
      avg,
      streak: streakDays(attempts, now),
      atRisk: streakAtRisk(attempts, now),
      level: levelFor(totalXp(attempts)),
      rec: recommendNext(attempts, manifest.cases),
    };
  }, [now]);

  const rec = stats.rec;
  const recCase = rec ? manifest.cases.find((c) => c.id === rec.caseId) : undefined;
  const recFlair = rec ? categoryFlair(rec.category) : null;

  const quickStart = () => {
    void startRandomUnattempted(preferredMode);
  };

  const cases: UseCase[] = [
    {
      icon: "🩺",
      grad: "var(--grad-primary)",
      title: "Practice a station",
      body: "The full OSCE: 3-min chart review, a 20-min standardized-patient encounter where the patient answers only what you ask, exact exam maneuvers, then locked post-encounter questions and grounded feedback.",
      cta: `${manifest.cases.length} stations · ${stats.done} done`,
      onClick: () => setView("select"),
    },
    {
      icon: "🎯",
      grad: "var(--grad-teal)",
      title: "Framework drills",
      body: "Quick reps without a full case — write the broad differential, key questions, or work-up for a stem and get graded instantly against the framework.",
      cta: "Differential · Work-up · Skills",
      onClick: () => setView("drills"),
    },
    {
      icon: "📖",
      grad: "var(--grad-sky)",
      title: "Special skills",
      body: "Systematic reads and lab interpretation: EKG 6-step, CXR RIP-ABCDE, ABG/acid-base, SAAG, Light's criteria, and PFTs — with formulas and worked examples.",
      cta: "EKG · CXR · ABG · SAAG · PFT",
      onClick: () => setView("skills"),
    },
    {
      icon: "📊",
      grad: "var(--grad-sun)",
      title: "Track your progress",
      body: "Score over time, performance by domain and chief complaint, most-missed items, badges, and your level. Re-open any completed case to review.",
      cta: "Performance dashboard",
      onClick: () => setView("analytics"),
    },
  ];

  const stationSteps: [string, string, string, string][] = [
    ["1", "Chart review", "3 min", "Door chart and vitals only — plan your approach."],
    ["2", "Encounter", "20 min", "Interview + exact exam maneuvers; the patient reveals only what you elicit."],
    ["3", "Post-encounter", "20 min", "Patient locked. Differential, workup, EKG/CXR reads, management."],
    ["4", "Feedback", "—", "Scored by domain with your misses, then the full teaching."],
  ];
  const stepColors = ["var(--grad-primary)", "var(--grad-teal)", "var(--grad-sun)", "var(--grad-coral)"];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          icon="🔥"
          label="Day streak"
          value={String(stats.streak)}
          sub={stats.atRisk ? "Do a station today to keep it!" : stats.streak > 0 ? "Keep it rolling" : "Start one today"}
          flame={stats.streak > 0}
        />
        <StatTile
          icon="⭐"
          label={`Level ${stats.level.level}`}
          value={stats.level.title}
          bar={stats.level.progress}
          sub={stats.level.toNext > 0 ? `${stats.level.toNext - stats.level.intoLevel} XP to next level` : "Max level"}
        />
        <StatTile
          icon="✅"
          label="Stations"
          value={`${stats.done} / ${manifest.cases.length}`}
          bar={stats.done / Math.max(1, manifest.cases.length)}
          sub={`${stats.attempts} total attempts`}
        />
        <StatTile
          icon="📈"
          label="Avg score"
          value={stats.avg === null ? "—" : String(stats.avg)}
          sub={stats.avg === null ? "Complete a station" : "last 10 attempts"}
        />
      </div>

      {/* Hero CTA */}
      <div
        className="card relative overflow-hidden p-6 sm:p-8 text-white"
        style={{ background: "var(--grad-header)", border: "none" }}
      >
        <div
          aria-hidden
          className="absolute -right-10 -top-16 h-56 w-56 rounded-full"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />
        <div
          aria-hidden
          className="absolute right-24 -bottom-20 h-44 w-44 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div className="relative space-y-3 max-w-xl">
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight leading-tight">
            Ready to round{stats.streak > 1 ? ` — day ${stats.streak}` : ""}?
          </h1>
          <p className="text-[14.5px] leading-relaxed text-white/80">
            Run a full Internal Medicine OSCE station end-to-end — history, physical exam, reasoning,
            image reads, and management — graded on thoroughness and reasoning, not just the
            "right answer."
          </p>
          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <button
              className="btn px-6 py-2.5 text-sm border-none"
              style={{ background: "#fff", color: "var(--color-exam-accent-deep)" }}
              onClick={quickStart}
            >
              🎲{" "}
              {stats.attempts === 0
                ? "Start your first station"
                : `Random station · ${preferredMode === "STRICT_OSCE" ? "Strict OSCE" : "Practice"}`}{" "}
              →
            </button>
            <button
              className="btn px-5 py-2.5 text-sm text-white"
              style={{ background: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.35)" }}
              onClick={() => setView("select")}
            >
              Browse all {manifest.cases.length}
            </button>
            <button
              className="btn px-5 py-2.5 text-sm text-white"
              style={{ background: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.35)" }}
              onClick={showEnableAi}
            >
              {llmEnabled ? "🟢 AI on" : "Enable AI (Claude / GPT)"}
            </button>
          </div>
        </div>
      </div>

      {/* Coach's pick: the most useful next station, from the attempt history. */}
      {rec && recCase && recFlair && (
        <div className="card overflow-hidden">
          <div aria-hidden className="h-1.5 shrink-0" style={{ background: recFlair.grad }} />
          <div className="p-4 sm:p-5 flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="icon-tile" style={{ background: recFlair.grad }} aria-hidden>
              {recFlair.emoji}
            </span>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="panel-label">Coach's pick</div>
              <div className="text-[15px] font-extrabold tracking-tight leading-snug">
                {recCase.title}
              </div>
              <div className="text-[12.5px]" style={{ color: "var(--color-exam-muted)" }}>
                {rec.reason}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                className="btn btn-primary"
                onClick={() => void startCase(rec.caseId, preferredMode)}
              >
                Start station
              </button>
              <button className="btn" onClick={() => browseCategory(rec.category)}>
                See all {rec.category}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use-case cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cases.map((c) => (
          <button key={c.title} onClick={c.onClick} className="card card-pop p-5 text-left">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="icon-tile" style={{ background: c.grad }} aria-hidden>
                {c.icon}
              </span>
              <span className="text-[16.5px] font-extrabold tracking-tight">{c.title}</span>
            </div>
            <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
              {c.body}
            </p>
            <div
              className="mt-3 text-[12.5px] font-bold flex items-center gap-1"
              style={{ color: "var(--color-exam-accent)" }}
            >
              {c.cta} →
            </div>
          </button>
        ))}
      </div>

      {/* How a station works */}
      <div className="card p-5">
        <div className="panel-label mb-3">How a station works</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stationSteps.map(([n, t, time, body], i) => (
            <div
              key={t}
              className="rounded-2xl border p-3.5"
              style={{ borderColor: "var(--color-exam-border)", background: "var(--color-exam-soft)" }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-extrabold text-white shrink-0"
                  style={{ background: stepColors[i] }}
                  aria-hidden
                >
                  {n}
                </span>
                <span className="text-[13.5px] font-extrabold">{t}</span>
                <span className="ml-auto text-[11px] font-mono font-bold" style={{ color: "var(--color-exam-accent)" }}>
                  {time}
                </span>
              </div>
              <div className="text-[12.5px] leading-snug" style={{ color: "var(--color-exam-muted)" }}>
                {body}
              </div>
            </div>
          ))}
        </div>
        <p className="hint mt-3">
          Strict OSCE mode uses real timing and auto-advances; Practice mode is untimed with the same
          hidden information and scoring. Enable AI to make the patient conversational and grading
          smarter — your key stays in your browser.
        </p>
      </div>

      <p className="hint text-center">
        For medical education and OSCE practice only — not for clinical decision-making. Fictional
        cases, no real patient data.
      </p>
    </div>
  );
}
