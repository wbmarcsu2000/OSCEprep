import { useEffect, useRef, useState } from "react";
import { detectProvider, modelsForProvider, resolveModel } from "../../llm/LlmAdapter";
import { useAppStore } from "../store";
import { analyticsConfigured } from "../../analytics/telemetry";

/**
 * The Enable-AI panel: API key entry, provider detection, model picker, and
 * verification status. Self-contained — reads everything it needs from the
 * store — so any screen can host it behind a toggle.
 */
export function EnableAiPanel() {
  const setApiKey = useAppStore((s) => s.setApiKey);
  const setModel = useAppStore((s) => s.setModel);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const providerKind = useAppStore((s) => s.providerKind);
  const aiStatus = useAppStore((s) => s.aiStatus);
  const aiError = useAppStore((s) => s.aiError);
  const [keyDraft, setKeyDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // The panel only mounts when opened — put the keyboard where the work is.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const draftProvider = detectProvider(keyDraft);
  // Which provider's models to show: the draft key's provider if typing, else
  // the configured one (default to Anthropic for the picker before any key).
  const activeProvider = draftProvider ?? providerKind;

  return (
    <div className="card p-4 space-y-2 fade-up" id="enable-ai-panel">
      <div className="panel-label">Enable the AI patient &amp; coaching</div>
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
        Paste an <span className="font-semibold">Anthropic</span> (Claude, <code>sk-ant-…</code>)
        or <span className="font-semibold">OpenAI</span> (<code>sk-…</code> / <code>sk-proj-…</code>)
        API key to turn on natural-language patient replies, smart grading, and coaching. The key is
        stored only in this browser, sent only to that provider, and verified on save. The app is
        fully usable without it on the deterministic engine.
      </p>
      {analyticsConfigured() && (
        <p
          className="text-[12px] leading-relaxed rounded-lg px-3 py-2"
          style={{ background: "var(--color-exam-accent-soft)", color: "var(--color-exam-accent-deep)" }}
        >
          Enabling AI also turns on <span className="font-semibold">anonymous usage tracking</span>,
          which is required while AI is on — coarse feature use plus device and country. Never your
          answers, identity, or API key.
        </p>
      )}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          className="input flex-1 font-mono text-[13px]"
          type="password"
          placeholder={llmEnabled ? "AI enabled — paste a new key to replace" : "sk-ant-… or sk-…"}
          value={keyDraft}
          onChange={(e) => setKeyDraft(e.target.value)}
          aria-label="API key"
        />
        <button
          className="btn btn-primary"
          disabled={keyDraft.trim() === "" || detectProvider(keyDraft) === null}
          onClick={() => {
            setApiKey(keyDraft);
            setKeyDraft("");
          }}
        >
          Save
        </button>
        {llmEnabled && (
          <button
            className="btn"
            onClick={() => {
              setApiKey("");
              setKeyDraft("");
            }}
          >
            Turn off
          </button>
        )}
      </div>

      {/* Live provider detection on the draft key. */}
      {keyDraft.trim() !== "" && (
        <p className="hint" aria-live="polite">
          {draftProvider === "anthropic"
            ? "Detected: Anthropic (Claude)"
            : draftProvider === "openai"
              ? "Detected: OpenAI (GPT)"
              : "Unrecognized key format — expected sk-ant-… (Anthropic) or sk-… (OpenAI)."}
        </p>
      )}

      {/* Model picker for the active provider. */}
      {activeProvider && (
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-2">
            <span className="panel-label">Model</span>
            <select
              className="input text-[13px] py-1.5"
              value={resolveModel(activeProvider)}
              onChange={(e) => setModel(e.target.value)}
              aria-label="AI model"
            >
              {modelsForProvider(activeProvider).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} — {m.note}
                </option>
              ))}
            </select>
          </div>
          <p className="hint">
            Sets the speed of the patient conversation. Grading &amp; coaching always use a more
            capable model for accuracy, regardless of this choice.
          </p>
        </div>
      )}

      {/* Verification status. */}
      {llmEnabled && (
        <p
          className="text-[13px]"
          aria-live="polite"
          style={{
            color:
              aiStatus === "ok"
                ? "var(--color-exam-ok)"
                : aiStatus === "error"
                  ? "var(--color-exam-danger)"
                  : "var(--color-exam-muted)",
          }}
        >
          {aiStatus === "verifying" && "Verifying key…"}
          {aiStatus === "ok" &&
            `✓ AI verified — ${providerKind === "anthropic" ? "Claude" : "OpenAI"}`}
          {aiStatus === "error" && `✕ Key rejected: ${aiError ?? "verification failed"}`}
          {aiStatus === "idle" && "Key configured."}
        </p>
      )}
    </div>
  );
}
