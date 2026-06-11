import { manifest } from "../../data/loader";
import { completedCaseIds } from "../../analytics/store";
import { useAppStore } from "../store";

interface UseCase {
  icon: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  primary?: boolean;
}

export function Home() {
  const showStations = useAppStore((s) => s.showStations);
  const showDrills = useAppStore((s) => s.showDrills);
  const showSkills = useAppStore((s) => s.showSkills);
  const showAnalytics = useAppStore((s) => s.showAnalytics);
  const showEnableAi = useAppStore((s) => s.showEnableAi);
  const llmEnabled = useAppStore((s) => s.llmEnabled);

  const done = completedCaseIds().size;

  const cases: UseCase[] = [
    {
      icon: "🩺",
      title: "Practice a station",
      body: "A full simulated OSCE: 3-min chart review, a 20-min standardized-patient encounter where the patient answers only what you ask, an exact-maneuver physical exam, then locked post-encounter questions and grounded feedback.",
      cta: `${manifest.cases.length} stations · ${done} done`,
      onClick: showStations,
      primary: true,
    },
    {
      icon: "🎯",
      title: "Framework drills",
      body: "Quick reps without a full case. Get a chief complaint and write the broad differential + key questions, or a stem and write the work-up — graded instantly against the framework, with the results-steer-you follow-up.",
      cta: "Differential · Work-up · Skills",
      onClick: showDrills,
    },
    {
      icon: "📖",
      title: "Special skills",
      body: "Systematic reads and lab interpretation: the EKG 6-step and CXR RIP-ABCDE, plus ABG/acid-base, ascitic fluid (SAAG), pleural fluid (Light's), and PFTs — with formulas and worked examples.",
      cta: "EKG · CXR · ABG · SAAG · PFT",
      onClick: showSkills,
    },
    {
      icon: "📊",
      title: "Track your progress",
      body: "Longitudinal analytics across attempts: score over time, performance by domain and by chief complaint, and your most-missed diagnoses, history items, and exam maneuvers. Re-open any completed case to review.",
      cta: "Performance dashboard",
      onClick: showAnalytics,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-xl font-extrabold text-white"
          style={{ background: "var(--color-exam-accent)" }}
          aria-hidden
        >
          ✚
        </div>
        <h1 className="text-[30px] font-bold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
          OSCEprep
        </h1>
        <p className="text-[15px] max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
          A practice tool for the Internal Medicine clerkship OSCE. Run a full station end-to-end —
          history, physical exam, clinical reasoning, image interpretation, and management — then get
          feedback and teaching modeled on the real review-session format. It grades thoroughness and
          reasoning, not just the "right answer."
        </p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <button className="btn btn-primary px-6 py-2.5 text-sm" onClick={showStations}>
            Start a station →
          </button>
          <button className="btn px-5 py-2.5 text-sm" onClick={showEnableAi}>
            {llmEnabled ? "🟢 AI on" : "Enable AI (Claude / GPT)"}
          </button>
        </div>
        <p className="hint pt-1">
          For medical education and OSCE practice only — not for clinical decision-making. Fictional
          cases, no real patient data.
        </p>
      </div>

      {/* Use-case cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cases.map((c) => (
          <button
            key={c.title}
            onClick={c.onClick}
            className="card p-5 text-left transition-shadow hover:shadow-[var(--shadow-raised)]"
            style={c.primary ? { borderColor: "#d3def7" } : undefined}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xl" aria-hidden>{c.icon}</span>
              <span className="text-[16px] font-bold tracking-tight">{c.title}</span>
            </div>
            <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
              {c.body}
            </p>
            <div
              className="mt-3 text-[12.5px] font-semibold flex items-center gap-1"
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
          {[
            ["1 · Chart review", "3 min", "Door chart and vitals only — plan your approach."],
            ["2 · Encounter", "20 min", "Interview the patient and perform exact exam maneuvers; they reveal only what you elicit."],
            ["3 · Post-encounter", "20 min", "Patient locked. Differential, workup, EKG/CXR reads, revised dx, management."],
            ["4 · Feedback", "—", "Scored by domain with the misses, then the full teaching for that complaint."],
          ].map(([t, time, body]) => (
            <div key={t} className="rounded-lg border p-3" style={{ borderColor: "var(--color-exam-border)", background: "#fafbfd" }}>
              <div className="text-[13px] font-bold">{t}</div>
              <div className="text-[11px] font-mono mb-1" style={{ color: "var(--color-exam-accent)" }}>{time}</div>
              <div className="text-[12.5px] leading-snug" style={{ color: "var(--color-exam-muted)" }}>{body}</div>
            </div>
          ))}
        </div>
        <p className="hint mt-3">
          Strict OSCE mode uses real timing and auto-advances; Practice mode is untimed with the same
          hidden information and scoring. Enable AI to make the patient conversational and grading
          smarter — your key stays in your browser.
        </p>
      </div>
    </div>
  );
}
