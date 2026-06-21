/**
 * Voice for the patient interview, built on the browser's Web Speech API — no
 * dependencies, no network, no API cost. Speech-to-text (dictation) lets the
 * student speak their questions; text-to-speech reads the patient's replies
 * aloud. Both feature-detect and degrade gracefully where unsupported
 * (e.g. Firefox lacks SpeechRecognition; jsdom lacks both).
 */
import { useCallback, useEffect, useRef, useState } from "react";

// ---- Minimal Web Speech typings (not in the standard DOM lib) ---------------

interface SpeechResultAlt {
  transcript: string;
}
interface SpeechResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechResultAlt;
}
interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: ArrayLike<SpeechResult>;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: unknown) => void) | null;
}
type SRCtor = new () => SpeechRecognitionLike;

const SRClass: SRCtor | undefined = (() => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
})();

export const dictationSupported = !!SRClass;
export const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;

const TTS_STORAGE = "osce.tts";

/** Pick the most natural-sounding English voice the device offers. The default
 *  voice is often the old robotic one; modern browsers ship far better neural
 *  voices (Google/Apple/Microsoft) — prefer those by name, newest-gen first. */
function pickNaturalVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const en = voices.filter((v) => /^en(-|_|$)/i.test(v.lang));
  if (en.length === 0) return null;
  // Highest-quality named voices across platforms, in rough preference order.
  const prefer = [
    /Google US English/i,
    /Microsoft .*(Online|Natural)/i,
    /\((Premium|Enhanced)\)/i, // Apple premium/enhanced packs
    /\b(Ava|Zoe|Samantha|Allison|Serena|Evan|Nathan|Joelle)\b/i,
    /\b(Aria|Jenny|Guy|Emma|Michelle)\b/i, // Microsoft neural
    /Google/i,
  ];
  for (const re of prefer) {
    const m = en.find((v) => re.test(v.name));
    if (m) return m;
  }
  // Fall back to an online (non-local, usually better) en-US voice, then default.
  const us = en.filter((v) => /en[-_]US/i.test(v.lang));
  return en.find((v) => !v.localService) ?? us.find((v) => v.default) ?? us[0] ?? en[0];
}

// ---- Speech-to-text (dictation) ---------------------------------------------

/** Dictation. `onTranscript` streams the live transcript. With `continuous`
 *  (the default, used by the manual mic button) the recognizer is kept open
 *  across Chrome's silence-driven restarts so the student can compose a longer
 *  question. With `continuous: false` (conversation mode) it listens for ONE
 *  utterance and fires `onSpeechEnd` when the speaker stops — a clean
 *  one-turn-at-a-time cycle that doesn't flash the mic on and off. */
export function useDictation(opts: {
  onTranscript: (text: string) => void;
  /** Keep the mic open across pauses (default true). false ends after one utterance. */
  continuous?: boolean;
  /** Transparently restart when Chrome ends recognition on its own (default true).
   *  Conversation mode sets this false: it keeps the mic open via `continuous`
   *  but must NOT auto-restart, or the recognizer cycles on/off (the flicker). */
  autoRestart?: boolean;
  /** Fired when recognition ends on its own and we are NOT auto-restarting. */
  onSpeechEnd?: () => void;
}) {
  // `listening` is the desired state; the recognition object's whole lifecycle
  // lives in the effect below (created on start, stopped on toggle-off/unmount),
  // so no ref is read or written outside an effect.
  const [listening, setListening] = useState(false);
  const optsRef = useRef(opts);
  // Keep the latest callback in a ref (updated post-commit, never during
  // render) so the recognition handlers below always call the current one.
  useEffect(() => {
    optsRef.current = opts;
  });

  useEffect(() => {
    if (!listening || !SRClass) return;
    const rec = new SRClass();
    rec.lang = "en-US";
    rec.interimResults = true;
    // continuous (manual dictation): keep the mic open while the student talks
    // instead of ending after the first pause. Conversation mode passes false
    // so the recognizer ends naturally at end-of-speech (one utterance/turn).
    rec.continuous = optsRef.current.continuous ?? true;
    rec.maxAlternatives = 1;

    // Accumulate completed segments; append the live interim so the input box
    // streams the full transcript as they speak.
    let finalText = "";
    let stopped = false;
    let restartTimer: number | undefined;
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const t = r[0]?.transcript ?? "";
        if (r.isFinal) finalText += (finalText && !finalText.endsWith(" ") ? " " : "") + t.trim();
        else interim += t;
      }
      optsRef.current.onTranscript((finalText + " " + interim).trim());
    };
    // Chrome ends recognition on its own (silence/network) every few seconds —
    // especially mid-conversation. While the student still wants to listen,
    // transparently restart so the mic stays open instead of flipping off. A
    // real stop (toggle-off / new turn → cleanup) sets `stopped` first so we
    // don't fight it. Restart is DEFERRED and retried: calling start()
    // synchronously inside onend throws InvalidStateError on some builds, and a
    // single throw must not silently kill the mic for the rest of the turn.
    const restart = (attempt: number) => {
      if (stopped) return;
      try {
        rec.start();
      } catch {
        if (attempt < 2) {
          restartTimer = window.setTimeout(() => restart(attempt + 1), 300);
        } else {
          setListening(false);
        }
      }
    };
    rec.onend = () => {
      if (stopped) return;
      // Conversation mode (autoRestart === false): the mic stayed open via
      // `continuous`; when Chrome ends it on its own we report end-of-speech and
      // go idle. We do NOT auto-restart — that cycle was the flicker. The caller
      // re-opens the mic once per turn.
      if (optsRef.current.autoRestart === false) {
        setListening(false);
        optsRef.current.onSpeechEnd?.();
        return;
      }
      restartTimer = window.setTimeout(() => restart(0), 150);
    };
    rec.onerror = (ev) => {
      // Permission/device errors are terminal; transient ones (no-speech,
      // aborted, network) let onend's restart handle continuity.
      const code = (ev as { error?: string })?.error;
      if (code === "not-allowed" || code === "service-not-allowed" || code === "audio-capture") {
        stopped = true;
        setListening(false);
      }
    };
    try {
      rec.start();
    } catch {
      // Defer so the failure state isn't set synchronously inside the effect.
      queueMicrotask(() => setListening(false));
    }
    return () => {
      stopped = true;
      if (restartTimer) window.clearTimeout(restartTimer);
      rec.onend = null;
      rec.onerror = null;
      rec.onresult = null;
      // abort() tears down immediately (stop() finishes the current utterance
      // first), so a fresh recognizer for the next turn can't overlap this one.
      rec.abort();
    };
  }, [listening]);

  const start = useCallback(() => setListening(true), []);
  const stop = useCallback(() => setListening(false), []);
  const toggle = useCallback(() => setListening((v) => !v), []);

  return { supported: dictationSupported, listening, start, stop, toggle };
}

// ---- Text-to-speech ----------------------------------------------------------

/** Patient-reply read-aloud. `enabled` persists across sessions; `speaking`
 *  reflects whether an utterance is in flight; `speak` takes an optional
 *  onEnd callback (used by conversation mode to re-open the mic afterward). */
export function useTts() {
  const [enabled, setEnabledState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(TTS_STORAGE) === "1";
    } catch {
      return false;
    }
  });
  const [speaking, setSpeaking] = useState(false);
  // The chosen natural voice (loaded async — getVoices() is often empty on first
  // call until the browser fires `voiceschanged`).
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    if (!ttsSupported) return;
    const load = () => {
      voiceRef.current = pickNaturalVoice(window.speechSynthesis.getVoices());
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v);
    try {
      localStorage.setItem(TTS_STORAGE, v ? "1" : "0");
    } catch {
      // ignore storage failure
    }
    if (!v && ttsSupported) window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!ttsSupported || !text.trim()) {
      onEnd?.();
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) u.voice = voiceRef.current;
    u.lang = voiceRef.current?.lang ?? "en-US";
    u.rate = 1;
    u.pitch = 1;
    u.onend = () => {
      setSpeaking(false);
      onEnd?.();
    };
    u.onerror = () => {
      setSpeaking(false);
      onEnd?.();
    };
    window.speechSynthesis.cancel(); // never overlap replies
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, []);

  const cancel = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  // Stop any in-flight speech if the component unmounts (leaving the station).
  useEffect(() => () => cancel(), [cancel]);

  return { supported: ttsSupported, enabled, setEnabled, speaking, speak, cancel };
}

/** Split text into sentence-sized chunks. Chrome silently cuts a single
 *  utterance off after ~15s; queueing several short utterances sidesteps that
 *  and lets cancel() stop the whole read instantly. */
function splitForSpeech(text: string): string[] {
  const parts = text.match(/[^.!?\n]+[.!?]*\s*/g);
  const chunks = (parts ?? [text]).map((s) => s.trim()).filter(Boolean);
  return chunks.length ? chunks : [text.trim()];
}

/** On-demand read-aloud for study content (the Neurology walkthrough). Unlike
 *  `useTts`, this owns no persisted toggle — each call reads one labelled item.
 *  `speakingId` tracks WHICH item is in flight so a row of speaker buttons can
 *  show play/stop independently; starting a new item cancels the previous one,
 *  so only one thing is ever read at a time. */
export function useReadAloud() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    if (!ttsSupported) return;
    const load = () => {
      voiceRef.current = pickNaturalVoice(window.speechSynthesis.getVoices());
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const stop = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  const toggle = useCallback(
    (id: string, text: string) => {
      if (!ttsSupported || !text.trim()) return;
      // Cancelling clears any queued chunks (including a different item's read).
      window.speechSynthesis.cancel();
      if (speakingId === id) {
        setSpeakingId(null);
        return;
      }
      const chunks = splitForSpeech(text);
      chunks.forEach((chunk, i) => {
        const u = new SpeechSynthesisUtterance(chunk);
        if (voiceRef.current) u.voice = voiceRef.current;
        u.lang = voiceRef.current?.lang ?? "en-US";
        u.rate = 1;
        u.pitch = 1;
        const clear = () => setSpeakingId((c) => (c === id ? null : c));
        if (i === chunks.length - 1) u.onend = clear;
        u.onerror = clear;
        window.speechSynthesis.speak(u);
      });
      setSpeakingId(id);
    },
    [speakingId],
  );

  // Stop reading if the component unmounts (leaving the tab / case).
  useEffect(() => () => stop(), [stop]);

  return { supported: ttsSupported, speakingId, toggle, stop };
}
