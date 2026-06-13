import { useMemo } from "react";
import { manifest } from "../../data/loader";
import { loadAttempts } from "../../analytics/store";
import { levelFor, totalXp, streakDays } from "../gamification";
import { useMountNow } from "../useMountNow";
import { useAppStore } from "../store";

/**
 * Landing page. Deliberately spare: the two things you can do here are run a
 * full OSCE CASE or get reps on the framework DRILLS. Those are the only two
 * primary calls to action; everything else (skills reference, progress, AI
 * setup) is a small secondary link so the choice stays obvious.
 */
export function Home() {
  const setView = useAppStore((s) => s.setView);
  const showEnableAi = useAppStore((s) => s.showEnableAi);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const preferredMode = useAppStore((s) => s.preferredMode);
  const startRandomUnattempted = useAppStore((s) => s.startRandomUnattempted);

  const now = useMountNow();
  const stats = useMemo(() => {
    const attempts = loadAttempts();
    return {
      done: new Set(attempts.map((a) => a.caseId)).size,
      streak: streakDays(attempts, now),
      level: levelFor(totalXp(attempts)),
    };
  }, [now]);

  const quickStart = () => void startRandomUnattempted(preferredMode);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-7">
      {/* Header */}
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1
            className="text-[26px] sm:text-[32px] font-extrabold tracking-tight leading-tight"
            style={{ color: "var(--color-exam-header)" }}
          >
            Internal Medicine OSCE
          </h1>
          <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
            Two ways to practice — pick one to start.
          </p>
        </div>
        {stats.streak > 0 && (
          <div className="chip chip-accent" style={{ textTransform: "none", letterSpacing: "normal" }}>
            🔥 {stats.streak}-day streak · Level {stats.level.level}
          </div>
        )}
      </header>

      {/* The two primary use cases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
        {/* Case simulations */}
        <div className="card p-6 flex flex-col gap-3">
          <span className="icon-tile" style={{ background: "var(--grad-primary)" }} aria-hidden>
            🩺
          </span>
          <h2 className="text-[19px] font-extrabold tracking-tight">Case simulations</h2>
          <p className="text-[14px] leading-relaxed flex-1" style={{ color: "var(--color-exam-muted)" }}>
            Work a full OSCE case end to end — interview and examine the patient, then commit to a
            differential, work-up, EKG/CXR reads, and a management plan. Scored by domain with
            teaching at the end.
          </p>
          <div className="flex flex-col gap-2 pt-1">
            <button className="btn btn-primary w-full justify-center py-2.5" onClick={quickStart}>
              🎲 Start a case →
            </button>
            <button
              className="text-[13px] font-semibold underline underline-offset-2 self-start"
              style={{ color: "var(--color-exam-accent)" }}
              onClick={() => setView("select")}
            >
              Browse all {manifest.cases.length} cases · {stats.done} done
            </button>
          </div>
        </div>

        {/* Framework drills */}
        <div className="card p-6 flex flex-col gap-3">
          <span className="icon-tile" style={{ background: "var(--grad-teal)" }} aria-hidden>
            🎯
          </span>
          <h2 className="text-[19px] font-extrabold tracking-tight">Framework drills</h2>
          <p className="text-[14px] leading-relaxed flex-1" style={{ color: "var(--color-exam-muted)" }}>
            Short, repeatable reps — no full case. Build a differential, plan a work-up, manage a
            diagnosis, or interpret a study, with instant feedback against the framework.
          </p>
          <div className="flex flex-col gap-2 pt-1">
            <button
              className="btn btn-primary w-full justify-center py-2.5"
              style={{ background: "var(--grad-teal)" }}
              onClick={() => setView("drills")}
            >
              🎯 Start drilling →
            </button>
            <span className="text-[13px] font-semibold self-start" style={{ color: "var(--color-exam-muted)" }}>
              Differential · Work-up · Management · Skills
            </span>
          </div>
        </div>
      </div>

      {/* Turn AI on — its own bar directly below the two paths. Optional: both
          cases work fully without it; AI just makes the patient conversational
          and the grading smarter. */}
      <button
        onClick={showEnableAi}
        className="w-full rounded-2xl border px-5 py-3.5 flex items-center justify-center gap-2.5 text-[13.5px] font-semibold leading-snug text-center transition-colors"
        style={{
          borderColor: llmEnabled ? "var(--color-exam-ok-line)" : "var(--color-exam-accent-line)",
          background: llmEnabled ? "var(--color-exam-ok-soft)" : "var(--color-exam-accent-soft)",
          color: llmEnabled ? "var(--color-exam-ok)" : "var(--color-exam-accent-deep)",
        }}
      >
        {llmEnabled ? (
          <>
            <span aria-hidden>🟢</span> AI is on — the patient talks naturally and grading is smarter.{" "}
            <span className="underline underline-offset-2">Manage</span>
          </>
        ) : (
          <>
            <span aria-hidden>⚙️</span> Turn on AI (Claude / GPT) — makes the patient conversational and
            grading smarter. Your key stays in your browser.
          </>
        )}
      </button>

      {/* Secondary, low-emphasis links */}
      <div className="flex items-center justify-center gap-x-6 gap-y-2 flex-wrap text-[13px] font-semibold">
        <button
          className="flex items-center gap-1.5"
          style={{ color: "var(--color-exam-muted)" }}
          onClick={() => setView("neuro")}
        >
          🧠 Neuro cases
        </button>
        <button
          className="flex items-center gap-1.5"
          style={{ color: "var(--color-exam-muted)" }}
          onClick={() => setView("skills")}
        >
          📖 Skills reference
        </button>
        <button
          className="flex items-center gap-1.5"
          style={{ color: "var(--color-exam-muted)" }}
          onClick={() => setView("analytics")}
        >
          📊 Your progress
        </button>
      </div>

      <p className="hint text-center">
        For medical education and OSCE practice only — not for clinical decision-making. Fictional
        cases, no real patient data.
      </p>
    </div>
  );
}
