import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store";

export function SpConversation() {
  const conversation = useAppStore((s) => s.engine?.conversation ?? []);
  const spThinking = useAppStore((s) => s.spThinking);
  const locked = useAppStore((s) => s.engine?.patientLocked ?? false);
  const ask = useAppStore((s) => s.ask);
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

  return (
    <div className="card flex flex-col h-full min-h-0 overflow-hidden">
      <div className="card-header">
        <span className="panel-label">Patient Interview</span>
        <span className="hint">The patient answers only what you ask</span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2.5 min-h-0 scroll-quiet"
      >
        {conversation.length === 0 && (
          <p className="text-sm italic m-auto text-center max-w-xs" style={{ color: "var(--color-exam-faint)" }}>
            Greet the patient or ask your first question to begin the interview.
          </p>
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
          <div className="bubble bubble-patient" aria-live="polite">
            <span className="inline-flex gap-1 items-center" style={{ color: "var(--color-exam-faint)" }}>
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: "120ms" }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: "240ms" }}>·</span>
            </span>
          </div>
        )}
      </div>
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
