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

// ---- Speech-to-text (dictation) ---------------------------------------------

/** Single-utterance dictation. `onInterim` streams the live transcript;
 *  `onFinal` fires once with the completed utterance. */
export function useDictation(opts: { onTranscript: (text: string) => void }) {
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
    // continuous: keep the mic open while the student talks instead of ending
    // after the first pause (which read as "opens for a sec then stops").
    rec.continuous = true;
    rec.maxAlternatives = 1;

    // Accumulate completed segments; append the live interim so the input box
    // streams the full transcript as they speak.
    let finalText = "";
    let stopped = false;
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
    // Chrome can end recognition on its own (silence/network). While the
    // student still wants to listen, transparently restart; a real stop
    // (toggle-off → cleanup) sets `stopped` first so we don't fight it.
    rec.onend = () => {
      if (!stopped) {
        try {
          rec.start();
        } catch {
          setListening(false);
        }
      }
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
      rec.onend = null;
      rec.onerror = null;
      rec.onresult = null;
      rec.stop();
    };
  }, [listening]);

  const start = useCallback(() => setListening(true), []);
  const stop = useCallback(() => setListening(false), []);
  const toggle = useCallback(() => setListening((v) => !v), []);

  return { supported: dictationSupported, listening, start, stop, toggle };
}

// ---- Text-to-speech ----------------------------------------------------------

/** Patient-reply read-aloud. `enabled` persists across sessions. */
export function useTts() {
  const [enabled, setEnabledState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(TTS_STORAGE) === "1";
    } catch {
      return false;
    }
  });

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v);
    try {
      localStorage.setItem(TTS_STORAGE, v ? "1" : "0");
    } catch {
      // ignore storage failure
    }
    if (!v && ttsSupported) window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback((text: string) => {
    if (!ttsSupported || !text.trim()) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.cancel(); // never overlap replies
    window.speechSynthesis.speak(u);
  }, []);

  const cancel = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
  }, []);

  // Stop any in-flight speech if the component unmounts (leaving the station).
  useEffect(() => () => cancel(), [cancel]);

  return { supported: ttsSupported, enabled, setEnabled, speak, cancel };
}
