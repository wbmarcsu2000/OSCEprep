import { useState } from "react";
import { NEURO_SESSIONS } from "../../data/neuro/sessions";
import { NEURO_STEP_META, type NeuroCase, type NeuroSession, type NeuroStep } from "../../data/neuro/types";
import { looseCovered } from "../../engine/textMatch";
import { useAppStore } from "../store";

const SESSION_GRADS = [
  "var(--grad-primary)",
  "var(--grad-teal)",
  "var(--grad-sky)",
  "var(--grad-sun)",
  "var(--grad-coral)",
  "var(--grad-pink)",
];

const DIFF_TONE: Record<string, string> = {
  easy: "var(--color-exam-ok)",
  moderate: "var(--color-exam-warn)",
  hard: "var(--color-exam-danger)",
};

/**
 * Neurology mode — a separate test format from the IM stations. Browse the
 * teaching sessions, pick a case, and work it as a guided answer→reveal→teach
 * walk-through (localize → differential → investigations → diagnosis →
 * management). No EKG/CXR. Self-check is a keyword match, like the drills.
 */
export function Neuro() {
  const setView = useAppStore((s) => s.setView);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);

  const session = NEURO_SESSIONS.find((s) => s.id === sessionId) ?? null;
  const activeCase = session?.cases.find((c) => c.id === caseId) ?? null;

  if (session && activeCase) {
    return <CaseWalkthrough session={session} c={activeCase} onBack={() => setCaseId(null)} />;
  }
  if (session) {
    return <SessionView session={session} onOpen={setCaseId} onBack={() => setSessionId(null)} />;
  }
  return <SessionList onOpen={setSessionId} onExit={() => setView("home")} />;
}

function PageHeader({
  title,
  blurb,
  action,
}: {
  title: string;
  blurb: string;
  action: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex items-start gap-3">
        <span className="icon-tile" style={{ background: "var(--grad-sky)" }} aria-hidden>
          🧠
        </span>
        <div className="space-y-0.5">
          <div className="panel-label">Neurology</div>
          <h2 className="text-[24px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
            {title}
          </h2>
          <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
            {blurb}
          </p>
        </div>
      </div>
      <button className="btn btn-ghost shrink-0" onClick={action.onClick}>
        {action.label}
      </button>
    </div>
  );
}

function SessionList({ onOpen, onExit }: { onOpen: (id: string) => void; onExit: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <PageHeader
        title="Neurology cases"
        blurb="Localization and clinical reasoning — a different test from the IM stations, with no EKG or chest X-ray. Pick a session."
        action={{ label: "Home →", onClick: onExit }}
      />
      {NEURO_SESSIONS.length === 0 ? (
        <div className="card p-6 text-center text-sm" style={{ color: "var(--color-exam-muted)" }}>
          Neurology cases are being prepared.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NEURO_SESSIONS.map((s, i) => (
            <button key={s.id} onClick={() => onOpen(s.id)} className="card card-pop p-5 text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="icon-tile h-9 w-9 text-base" style={{ background: SESSION_GRADS[i % SESSION_GRADS.length] }} aria-hidden>
                  {i + 1}
                </span>
                <span className="text-[15.5px] font-extrabold tracking-tight leading-tight">{s.title}</span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
                {s.blurb}
              </p>
              <div className="mt-2.5 text-[12.5px] font-bold" style={{ color: "var(--color-exam-accent)" }}>
                {s.cases.length} case{s.cases.length === 1 ? "" : "s"} →
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SessionView({
  session,
  onOpen,
  onBack,
}: {
  session: NeuroSession;
  onOpen: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <PageHeader title={session.title} blurb={session.blurb} action={{ label: "← All sessions", onClick: onBack }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {session.cases.map((c) => (
          <button key={c.id} onClick={() => onOpen(c.id)} className="card card-pop p-4 text-left flex items-center justify-between gap-3">
            <span className="text-[14px] font-bold leading-snug">{c.title}</span>
            <span
              className="chip shrink-0"
              style={{ color: DIFF_TONE[c.difficulty] ?? "var(--color-exam-muted)", borderColor: "currentColor" }}
            >
              {c.difficulty}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CaseWalkthrough({ session, c, onBack }: { session: NeuroSession; c: NeuroCase; onBack: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="panel-label">{session.title}</div>
          <h2 className="text-[20px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
            {c.title}
          </h2>
        </div>
        <button className="btn btn-ghost shrink-0" onClick={onBack}>
          ← Back
        </button>
      </div>

      {/* Presentation */}
      <div className="card p-5 space-y-3">
        <div>
          <div className="panel-label mb-1">Presentation</div>
          <p className="text-[14.5px] leading-relaxed">{c.vignette}</p>
        </div>
        <div>
          <div className="panel-label mb-1">Exam</div>
          <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-exam-ink)" }}>
            {c.exam}
          </p>
        </div>
      </div>

      <p className="hint">
        Answer each step, then reveal the model answer. Self-check is a keyword match — phrased
        differently? Trust your read.
      </p>

      {c.steps.map((step, i) => (
        <StepCard key={`${c.id}-${step.key}-${i}`} step={step} />
      ))}

      {/* Pearls */}
      <div
        className="card p-5"
        style={{ borderColor: "var(--color-exam-accent-line)", background: "var(--color-exam-accent-soft)" }}
      >
        <div className="panel-label mb-2" style={{ color: "var(--color-exam-accent-deep)" }}>
          💡 Teaching pearls
        </div>
        <ul className="space-y-1.5 text-[13.5px] leading-relaxed" style={{ color: "var(--color-exam-accent-deep)" }}>
          {c.pearls.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden>•</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StepCard({ step }: { step: NeuroStep }) {
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const meta = NEURO_STEP_META[step.key];
  const has = answer.trim().length > 0;
  const covered = step.keyPoints.map((kp) => ({ kp, hit: has && looseCovered(answer, kp) }));
  const hits = covered.filter((c) => c.hit).length;

  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-2.5">
        <span
          className="icon-tile h-8 w-8 text-base"
          style={{ background: "var(--grad-sky)", width: "2rem", height: "2rem", fontSize: "0.95rem", borderRadius: 10 }}
          aria-hidden
        >
          {meta.icon}
        </span>
        <div className="text-[15px] font-bold tracking-tight">{step.label}</div>
      </div>
      <p className="text-[14px] font-medium leading-relaxed">{step.prompt}</p>
      <textarea
        className="input w-full resize-y leading-relaxed"
        rows={3}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Your answer…"
        aria-label={step.label}
      />
      {!revealed ? (
        <button className="btn btn-primary px-5" onClick={() => setRevealed(true)} style={{ background: "var(--grad-sky)" }}>
          Reveal model answer →
        </button>
      ) : (
        <div className="space-y-3 fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-start">
            <div>
              <div className="panel-label mb-1.5">You wrote</div>
              <p
                className="rounded-xl border p-3 text-[13.5px] leading-relaxed whitespace-pre-wrap"
                style={{ borderColor: "var(--color-exam-border)", background: "var(--color-exam-soft)" }}
              >
                {has ? answer : <span className="italic" style={{ color: "var(--color-exam-faint)" }}>— left blank —</span>}
              </p>
            </div>
            <div>
              <div className="panel-label mb-1.5" style={{ color: "var(--color-exam-ok)" }}>
                Model answer
              </div>
              <p
                className="rounded-xl border p-3 text-[13.5px] leading-relaxed"
                style={{ borderColor: "var(--color-exam-ok-line)", background: "var(--color-exam-ok-soft)" }}
              >
                {step.idealAnswer}
              </p>
            </div>
          </div>
          {step.keyPoints.length > 0 && (
            <div className="rounded-xl border p-3" style={{ borderColor: "var(--color-exam-border)" }}>
              <div className="panel-label mb-1.5">
                Key points ({hits}/{step.keyPoints.length})
              </div>
              <ul className="space-y-1 text-[13px] leading-relaxed">
                {covered.map((c, i) => (
                  <li key={i} className="flex items-baseline gap-2">
                    <span
                      aria-hidden
                      className="shrink-0"
                      style={{ color: c.hit ? "var(--color-exam-ok)" : "var(--color-exam-warn)" }}
                    >
                      {c.hit ? "✓" : "○"}
                    </span>
                    <span style={{ color: c.hit ? "var(--color-exam-ink)" : "var(--color-exam-muted)", fontWeight: c.hit ? 600 : 400 }}>
                      {c.kp}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
