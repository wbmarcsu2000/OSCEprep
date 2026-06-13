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
export function useDictation(opts: { onInterim?: (t: string) => void; onFinal: (t: string) => void }) {
  // `listening` is the desired state; the recognition object's whole lifecycle
  // lives in the effect below (created on start, aborted on stop/unmount), so
  // no ref is read or written outside an effect.
  const [listening, setListening] = useState(false);
  const optsRef = useRef(opts);
  // Keep the latest callbacks in a ref (updated post-commit, never during
  // render) so the recognition handlers below always call the current ones.
  useEffect(() => {
    optsRef.current = opts;
  });

  useEffect(() => {
    if (!listening || !SRClass) return;
    const rec = new SRClass();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const t = r[0]?.transcript ?? "";
        if (r.isFinal) final += t;
        else interim += t;
      }
      if (interim) optsRef.current.onInterim?.(interim);
      if (final.trim()) optsRef.current.onFinal(final.trim());
    };
    // A finished utterance (onend) or error returns us to the idle state, which
    // re-runs this effect's cleanup to release the recognizer.
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    return () => {
      rec.onend = null;
      rec.onerror = null;
      rec.onresult = null;
      rec.abort();
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
