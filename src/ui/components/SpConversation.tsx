import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store";
import { useDictation, useTts } from "../useSpeech";

const STARTER_QUESTIONS = [
  "What brings you in today?",
  "When did this start?",
  "Any other symptoms?",
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Types text out on mount (a chat-like reveal) for a NEW patient reply; older
 *  replies and reduced-motion users get the full text immediately. The text is
 *  already final and guarded — this is purely a display effect. */
function TypedText({ text, animate }: { text: string; animate: boolean }) {
  const shouldAnimate = animate && !prefersReducedMotion();
  const [shown, setShown] = useState(() => (shouldAnimate ? "" : text));
  useEffect(() => {
    if (!shouldAnimate) return; // full text already shown via initial state
    const per = Math.max(2, Math.ceil(text.length / 40)); // finish in ~0.8s regardless of length
    let i = 0;
    const id = window.setInterval(() => {
      i += per;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 20);
    return () => window.clearInterval(id);
  }, [text, shouldAnimate]);
  return <>{shown}</>;
}

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

  const tts = useTts();
  const [convo, setConvo] = useState(false);
  // Turns present at mount render instantly; only replies that arrive during
  // this session get the typing reveal. useState initializer captures the
  // mount-time length once (reading it during render is safe; a ref isn't).
  const [initialLen] = useState(conversation.length);

  // Refs let the dictation callbacks read the latest state without re-subscribing.
  const convoRef = useRef(false);
  const lockedRef = useRef(locked);
  const thinkingRef = useRef(spThinking);
  const lastTranscriptRef = useRef("");
  const silenceTimer = useRef<number | undefined>(undefined);
  const ctlRef = useRef<{ start: () => void; stop: () => void }>({ start: () => {}, stop: () => {} });
  useEffect(() => {
    convoRef.current = convo;
    lockedRef.current = locked;
    thinkingRef.current = spThinking;
  });

  const sendText = (text: string) => {
    const t = text.trim();
    if (!t || spThinking || locked) return;
    setDraft("");
    void ask(t);
    inputRef.current?.focus();
  };

  // Dictation streams the live transcript into the box. In manual mode the
  // student edits and sends with Ask. In conversation mode the recognizer ends
  // at end-of-speech and we send the utterance (handleSpeechEnd); the mic then
  // re-opens for the next turn via the reopen effect below — a hands-free
  // back-and-forth without flashing the mic on every pause.
  // Send the buffered utterance once. Called when the student pauses (silence
  // timer) or when the recognizer ends on its own. No-op if nothing was said.
  function flushUtterance() {
    if (silenceTimer.current) {
      window.clearTimeout(silenceTimer.current);
      silenceTimer.current = undefined;
    }
    if (!convoRef.current || lockedRef.current || thinkingRef.current) return;
    const text = lastTranscriptRef.current.trim();
    if (!text) return;
    lastTranscriptRef.current = "";
    setDraft("");
    void ask(text);
  }
  function handleTranscript(t: string) {
    setDraft(t);
    lastTranscriptRef.current = t;
    if (!convoRef.current) return;
    // Conversation mode: the mic stays open (continuous); a ~1.3s pause ends the
    // turn and sends. The recognizer is NOT auto-restarted, so it never cycles.
    if (silenceTimer.current) window.clearTimeout(silenceTimer.current);
    silenceTimer.current = window.setTimeout(() => {
      ctlRef.current.stop();
      flushUtterance();
    }, 1300);
  }
  function handleSpeechEnd() {
    // Chrome closed the mic on its own — send whatever was captured, else idle
    // ("Tap to answer"). Never auto-reopen here (that was the flicker loop).
    flushUtterance();
  }
  const dictation = useDictation({
    onTranscript: handleTranscript,
    continuous: true, // stay open while waiting/speaking — false closes instantly
    autoRestart: !convo, // manual mode restarts; conversation must not (flicker)
    onSpeechEnd: handleSpeechEnd,
  });
  const micStart = dictation.start;
  useEffect(() => {
    ctlRef.current = { start: dictation.start, stop: dictation.stop };
  });

  const send = () => {
    if (dictation.listening) dictation.stop(); // sending ends dictation
    sendText(draft);
  };
  const micDown = () => {
    tts.cancel(); // don't talk over the student
    dictation.toggle();
  };

  const toggleConvo = () => {
    const next = !convo;
    setConvo(next);
    if (next) {
      if (tts.supported) tts.setEnabled(true); // replies must be spoken in convo mode
      lastTranscriptRef.current = "";
      dictation.start();
    } else {
      if (silenceTimer.current) window.clearTimeout(silenceTimer.current);
      dictation.stop();
      tts.cancel();
    }
  };

  // Clear any pending silence timer when leaving the encounter.
  useEffect(() => () => {
    if (silenceTimer.current) window.clearTimeout(silenceTimer.current);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && typeof el.scrollTo === "function") {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [conversation.length, spThinking]);

  // Read each NEW patient reply aloud (when read-aloud or conversation mode is
  // on); in conversation mode, re-open the mic once the reply finishes.
  const spokenRef = useRef(conversation.length);
  useEffect(() => {
    if (conversation.length > spokenRef.current) {
      const last = conversation[conversation.length - 1];
      const isPatientSpeech = last && last.role === "patient" && last.kind === "speech";
      if (isPatientSpeech && (tts.enabled || convoRef.current)) {
        // Conversation mode: open the mic ONCE when the reply finishes — one
        // open per turn, never a reopen loop (that was the flicker).
        tts.speak(last.text, () => {
          if (convoRef.current && !lockedRef.current) micStart();
        });
      }
    }
    spokenRef.current = conversation.length;
  }, [conversation, tts, micStart]);

  // Patient locked (encounter ended) — leave conversation mode.
  useEffect(() => {
    if (locked && convoRef.current) {
      setConvo(false);
      dictation.stop();
      tts.cancel();
    }
  }, [locked, dictation, tts]);

  // The patient always opens with a statement, so "conversation empty" never
  // happens in a real encounter — the real cold-start state is "no student
  // turn yet". That's when the starter chips help.
  const interviewStarted = conversation.some((t) => t.role === "student");

  // Live status while in conversation mode.
  const convoStatus = spThinking
    ? "💭 Patient is thinking…"
    : tts.speaking
      ? "🔊 Patient is speaking…"
      : dictation.listening
        ? "🎙️ Listening — ask your question, then pause"
        : "🎤 Your turn — tap the mic to answer";

  return (
    <div className="card flex flex-col h-full min-h-0 overflow-hidden">
      <div className="card-header">
        <span className="panel-label">Patient Interview</span>
        <div className="flex items-center gap-2">
          {!convo && tts.supported && (
            <button
              type="button"
              aria-pressed={tts.enabled}
              className="text-[12px] font-bold rounded-full px-2.5 py-1 transition-colors"
              style={{
                background: tts.enabled ? "var(--color-exam-accent-soft)" : "transparent",
                color: tts.enabled ? "var(--color-exam-accent-deep)" : "var(--color-exam-muted)",
              }}
              title={tts.enabled ? "Read patient replies aloud: on" : "Read patient replies aloud: off"}
              onClick={() => tts.setEnabled(!tts.enabled)}
            >
              {tts.enabled ? "🔊" : "🔇"} Read aloud
            </button>
          )}
          {dictation.supported && (
            <button
              type="button"
              aria-pressed={convo}
              className="text-[12px] font-bold rounded-full px-2.5 py-1 transition-colors"
              style={{
                background: convo ? "var(--grad-primary)" : "transparent",
                color: convo ? "#fff" : "var(--color-exam-accent-deep)",
                border: convo ? "none" : "1px solid var(--color-exam-accent-line)",
              }}
              disabled={locked}
              title="Hands-free spoken back-and-forth with the patient"
              onClick={toggleConvo}
            >
              {convo ? "■ End conversation" : "🗣️ Conversation mode"}
            </button>
          )}
        </div>
      </div>
      {convo && (
        <div
          className="px-4 py-1.5 text-[12.5px] font-bold flex items-center justify-between gap-2"
          style={{ background: "var(--color-exam-accent-soft)", color: "var(--color-exam-accent-deep)", borderBottom: "1px solid var(--color-exam-accent-line)" }}
          aria-live="polite"
        >
          <span>{convoStatus}</span>
          <span className="hint">speak naturally · pause to send</span>
        </div>
      )}
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
              {turn.role === "patient" ? (
                <TypedText text={turn.text} animate={turn.kind === "speech" && i >= initialLen} />
              ) : (
                turn.text
              )}
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
        className="border-t px-3 py-3 flex gap-2 bg-white items-center"
        style={{ borderColor: "var(--color-exam-border)" }}
      >
        {dictation.supported && !convo && (
          <button
            type="button"
            className={`btn shrink-0 px-3 ${dictation.listening ? "pulse-urgent" : ""}`}
            style={
              dictation.listening
                ? { background: "var(--color-exam-danger-soft)", borderColor: "var(--color-exam-danger)", color: "var(--color-exam-danger)" }
                : undefined
            }
            disabled={locked || spThinking}
            aria-pressed={dictation.listening}
            aria-label={dictation.listening ? "Stop dictation" : "Speak your question"}
            title={dictation.listening ? "Listening… click to stop" : "Speak your question"}
            onClick={micDown}
          >
            {dictation.listening ? "● Listening" : "🎙️"}
          </button>
        )}
        {dictation.supported && convo && (
          <button
            type="button"
            className={`btn shrink-0 px-3 ${dictation.listening ? "pulse-urgent" : ""}`}
            style={
              dictation.listening
                ? { background: "var(--color-exam-danger-soft)", borderColor: "var(--color-exam-danger)", color: "var(--color-exam-danger)" }
                : { background: "var(--color-exam-accent-soft)", borderColor: "var(--color-exam-accent-line)", color: "var(--color-exam-accent-deep)" }
            }
            disabled={locked || spThinking || tts.speaking}
            aria-pressed={dictation.listening}
            title={dictation.listening ? "Listening… tap to stop" : "Tap to answer"}
            onClick={() => {
              if (dictation.listening) {
                dictation.stop();
                flushUtterance();
              } else {
                tts.cancel();
                micStart();
              }
            }}
          >
            {dictation.listening ? "● Listening" : "🎤 Tap to answer"}
          </button>
        )}
        <input
          ref={inputRef}
          className="input flex-1"
          placeholder={
            locked
              ? "Patient access locked"
              : convo
                ? "Conversation mode — just speak (or type here)"
                : dictation.listening
                  ? "Listening — speak your question…"
                  : "Ask the patient anything…"
          }
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
