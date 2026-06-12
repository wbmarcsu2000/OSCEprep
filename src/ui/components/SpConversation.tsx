import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store";

const STARTER_QUESTIONS = [
  "What brings you in today?",
  "When did this start?",
  "Any other symptoms?",
];

export function SpConversation() {
  const conversation = useAppStore((s) => s.engine?.conversation ?? []);
  const spThinking = useAppStore((s) => s.spThinking);
  const locked = useAppStore((s) => s.engine?.patientLocked ?? false);
  const ask = useAppStore((s) => s.ask);
  const aiDegraded = useAppStore((s) => s.aiDegraded);
  const aiDegradedDetail = useAppStore((s) => s.aiDegradedDetail);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && typeof el.scrollTo === "function") {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [conversation.length, spThinking]);

  const send = () => {
    const text = draft.trim();
    if (!text || spThinking || locked) return;
    setDraft("");
    void ask(text);
    inputRef.current?.focus();
  };

  // The patient always opens with a statement, so "conversation empty" never
  // happens in a real encounter — the real cold-start state is "no student
  // turn yet". That's when the starter chips help.
  const interviewStarted = conversation.some((t) => t.role === "student");

  return (
    <div className="card flex flex-col h-full min-h-0 overflow-hidden">
      <div className="card-header">
        <span className="panel-label">Patient Interview</span>
        <span className="hint">The patient answers only what you ask</span>
      </div>
      {llmEnabled && aiDegraded && (
        <div
          className="px-4 py-1.5 text-[12px] font-semibold"
          style={{
            background: "var(--color-exam-warn-soft)",
            color: "var(--color-exam-warn)",
            borderBottom: "1px solid var(--color-exam-warn-line)",
          }}
          aria-live="polite"
        >
          <span aria-hidden>⚠️ </span>
          AI unreachable — scripted patient replies in use (grading still works)
          {aiDegradedDetail && (
            <span className="font-normal opacity-80"> · {aiDegradedDetail}</span>
          )}
        </div>
      )}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Patient conversation"
        className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2.5 min-h-0 scroll-quiet"
      >
        {conversation.length === 0 && (
          <div className="m-auto flex flex-col items-center gap-3 text-center max-w-xs py-4">
            <span className="icon-tile" style={{ background: "var(--grad-primary)" }} aria-hidden>
              👋
            </span>
            <p className="text-sm font-bold" style={{ color: "var(--color-exam-ink)" }}>
              Knock knock — introduce yourself
            </p>
            <p className="text-[13px] -mt-2" style={{ color: "var(--color-exam-muted)" }}>
              The patient reveals only what you ask about.
            </p>
          </div>
        )}
        {conversation.map((turn, i) =>
          turn.kind === "exam" ? (
            <div key={i} className="bubble bubble-exam fade-up px-3.5 py-2.5">
              <div className="panel-label mb-1" style={{ color: "var(--color-exam-accent-deep)", fontSize: "0.625rem" }}>
                Exam finding
              </div>
              {turn.text}
            </div>
          ) : (
            <div
              key={i}
              className={`bubble fade-up ${turn.role === "student" ? "bubble-student" : "bubble-patient"}`}
            >
              {turn.text}
            </div>
          ),
        )}
        {spThinking && (
          <div className="bubble bubble-patient" aria-hidden>
            <span className="inline-flex gap-1 items-center" style={{ color: "var(--color-exam-ghost)" }}>
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: "120ms" }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: "240ms" }}>·</span>
            </span>
          </div>
        )}
      </div>
      {!interviewStarted && !locked && (
        <div
          role="group"
          className="px-3 pt-2.5 pb-0.5 flex items-center gap-2 flex-wrap fade-up"
          aria-label="Suggested opening questions"
        >
          <span className="hint shrink-0">Not sure where to start?</span>
          {STARTER_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              className="chip chip-btn chip-accent"
              style={{ textTransform: "none", letterSpacing: "normal" }}
              onClick={() => {
                setDraft(q);
                inputRef.current?.focus();
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}
      <div
        className="border-t px-3 py-3 flex gap-2 bg-white"
        style={{ borderColor: "var(--color-exam-border)" }}
      >
        <input
          ref={inputRef}
          className="input flex-1"
          placeholder={locked ? "Patient access locked" : "Ask the patient anything…"}
          value={draft}
          disabled={locked}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          aria-label="Question for the patient"
        />
        <button
          className="btn btn-primary px-5"
          onClick={send}
          disabled={locked || spThinking || !draft.trim()}
        >
          Ask
        </button>
      </div>
    </div>
  );
}
