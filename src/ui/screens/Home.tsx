import { useMemo } from "react";
import { manifest } from "../../data/loader";
import { loadAttempts } from "../../analytics/store";
import { levelFor, totalXp, streakDays, streakAtRisk } from "../gamification";
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
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const preferredMode = useAppStore((s) => s.preferredMode);
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
    };
  }, [now]);

  const quickStart = () => {
    void startRandomUnattempted(preferredMode);
  };

  const cases: UseCase[] = [
    {
      icon: "🩺",
      grad: "var(--grad-primary)",
      title: "Practice an OSCE case",
      body: "Work a full case end to end: read the chart, interview and examine the patient, then commit to a diagnosis and plan. Scored with feedback at the end.",
      cta: `${manifest.cases.length} cases · ${stats.done} done`,
      onClick: () => setView("select"),
    },
    {
      icon: "🎯",
      grad: "var(--grad-teal)",
      title: "Framework drills",
      body: "Short reps, no full case. Build a differential, list your key questions, or plan a work-up — and get instant feedback.",
      cta: "Differential · Work-up · Skills",
      onClick: () => setView("drills"),
    },
    {
      icon: "📖",
      grad: "var(--grad-sky)",
      title: "Special skills",
      body: "Step-by-step guides for reading EKGs and chest X-rays and interpreting labs (ABG, ascitic/pleural fluid, PFTs), with worked examples.",
      cta: "EKG · CXR · ABG · SAAG · PFT",
      onClick: () => setView("skills"),
    },
    {
      icon: "📊",
      grad: "var(--grad-sun)",
      title: "Track your progress",
      body: "See your scores over time, your strong and weak areas, badges, and level. Revisit any case you've finished.",
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
          sub={stats.atRisk ? "Do a case today to keep it!" : stats.streak > 0 ? "Keep it rolling" : "Start one today"}
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
          label="Cases"
          value={`${stats.done} / ${manifest.cases.length}`}
          bar={stats.done / Math.max(1, manifest.cases.length)}
          sub={`${stats.attempts} total attempts`}
        />
        <StatTile
          icon="📈"
          label="Avg score"
          value={stats.avg === null ? "—" : String(stats.avg)}
          sub={stats.avg === null ? "Complete a case" : "last 10 attempts"}
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
            Run a full Internal Medicine OSCE case end-to-end — history, physical exam, reasoning,
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
                ? "Start your first case"
                : `Random case · ${preferredMode === "STRICT_OSCE" ? "Strict OSCE" : "Practice"}`}{" "}
              →
            </button>
            <button
              className="btn px-5 py-2.5 text-sm"
              style={{ background: "rgba(255,255,255,0.22)", borderColor: "rgba(255,255,255,0.6)", color: "#fff" }}
              onClick={() => setView("select")}
            >
              Browse all {manifest.cases.length}
            </button>
            <button
              className="btn px-5 py-2.5 text-sm"
              style={{ background: "rgba(255,255,255,0.22)", borderColor: "rgba(255,255,255,0.6)", color: "#fff" }}
              onClick={showEnableAi}
            >
              {llmEnabled ? "🟢 AI on" : "Enable AI (Claude / GPT)"}
            </button>
          </div>
        </div>
      </div>

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

      {/* How an OSCE case works */}
      <div className="card p-5">
        <div className="panel-label mb-3">How an OSCE case works</div>
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
