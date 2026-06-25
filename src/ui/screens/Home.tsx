import { useMemo } from "react";
import { manifest } from "../../data/loader";
import { SHELF_MCQS } from "../../data/shelfMcq";
import { loadAttempts } from "../../analytics/store";
import { levelFor, totalXp, streakDays } from "../gamification";
import { useMountNow } from "../useMountNow";
import { useAppStore, type View } from "../store";

/**
 * Landing page for ClerkTools. The header nav doubles as the toolkit, so the
 * home page lays the same tools out as a grid of cards — each with a one-line
 * description — so a student can scan what's here and pick one. AI setup stays
 * a single optional bar below; the rest is a disclaimer.
 */

interface Tool {
  view: View;
  name: string;
  icon: string;
  /** Background gradient token for the icon tile. */
  grad: string;
  /** One-sentence description of the tool. */
  blurb: string;
  /** Optional small status line (counts, progress). */
  meta?: string;
}

export function Home() {
  const setView = useAppStore((s) => s.setView);
  const showEnableAi = useAppStore((s) => s.showEnableAi);
  const llmEnabled = useAppStore((s) => s.llmEnabled);

  const now = useMountNow();
  const stats = useMemo(() => {
    const attempts = loadAttempts();
    return {
      done: new Set(attempts.map((a) => a.caseId)).size,
      streak: streakDays(attempts, now),
      level: levelFor(totalXp(attempts)),
    };
  }, [now]);

  const tools: Tool[] = [
    {
      view: "select",
      name: "OSCE Cases",
      icon: "🩺",
      grad: "var(--grad-primary)",
      blurb:
        "Work a full clinical case end to end — interview and examine the patient, then commit to a differential, work-up, EKG/CXR reads, and management, scored by domain with teaching.",
      meta: `${manifest.cases.length} cases · ${stats.done} done`,
    },
    {
      view: "drills",
      name: "Drills",
      icon: "🎯",
      grad: "var(--grad-teal)",
      blurb:
        "Short, repeatable reps on one piece at a time — differentials, work-ups, management, EKG/CXR, scores, and lab interpretation — with instant feedback.",
    },
    {
      view: "differentials",
      name: "Differentials",
      icon: "🌳",
      grad: "var(--grad-sky)",
      blurb: "The differential for every chief complaint, organized into buckets, with a Core ⟷ Advanced toggle.",
    },
    {
      view: "management",
      name: "Work-up & Mgmt",
      icon: "🧪",
      grad: "var(--grad-coral)",
      blurb:
        "Per complaint, the work-up to order and the first-line management of its key diagnoses — hidden behind a reveal so you commit before looking.",
    },
    {
      view: "shelf",
      name: "Shelf Study",
      icon: "📕",
      grad: "var(--grad-sun)",
      blurb:
        "Think-first cards for high-yield IM conditions — presentation, diagnosis, treatment, risk factors, and the key drug side effects.",
    },
    {
      view: "mcq",
      name: "Question Bank",
      icon: "❓",
      grad: "var(--grad-pink)",
      blurb:
        "Single-best-answer MCQs with instant feedback and explanations — cram by system and redo the ones you miss.",
      meta: `${SHELF_MCQS.length} questions`,
    },
    {
      view: "neuro",
      name: "Neuro",
      icon: "🧠",
      grad: "var(--grad-sky)",
      blurb: "Localize the lesion with focused neurology exam sessions and high-yield neuro cases.",
    },
    {
      view: "skills",
      name: "Skills",
      icon: "📖",
      grad: "var(--grad-teal)",
      blurb: "Systematic reads and lab interpretation — EKG, CXR, ABG/acid–base, PFTs, and ascitic & pleural fluid.",
    },
    {
      view: "analytics",
      name: "Performance",
      icon: "📊",
      grad: "var(--grad-header)",
      blurb: "Track your scores, streaks, mastery, and progress across every tool.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-7">
      {/* Header */}
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1
            className="text-[26px] sm:text-[32px] font-extrabold tracking-tight leading-tight"
            style={{ color: "var(--color-exam-header)" }}
          >
            ClerkTools
          </h1>
          <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
            Your Internal Medicine clerkship toolkit — pick a tool to start.
          </p>
        </div>
        {stats.streak > 0 && (
          <div className="chip chip-accent" style={{ textTransform: "none", letterSpacing: "normal" }}>
            🔥 {stats.streak}-day streak · Level {stats.level.level}
          </div>
        )}
      </header>

      {/* The toolkit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {tools.map((t) => (
          <button
            key={t.view}
            onClick={() => setView(t.view)}
            className="card p-5 flex flex-col gap-2.5 text-left transition-transform hover:-translate-y-0.5"
          >
            <span className="icon-tile" style={{ background: t.grad }} aria-hidden>
              {t.icon}
            </span>
            <h2 className="text-[17px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
              {t.name}
            </h2>
            <p className="text-[13px] leading-relaxed flex-1" style={{ color: "var(--color-exam-muted)" }}>
              {t.blurb}
            </p>
            {t.meta && (
              <span className="text-[12px] font-semibold" style={{ color: "var(--color-exam-faint)" }}>
                {t.meta}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Turn AI on — optional; every tool works fully without it. */}
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
            <span aria-hidden>⚙️</span> Turn on AI (Claude / GPT) — makes the patient conversational and grading
            smarter. Your key stays in your browser.
          </>
        )}
      </button>

      <p className="hint text-center">
        For medical education and clerkship practice only — not for clinical decision-making. Fictional cases, no real
        patient data.
      </p>
    </div>
  );
}
