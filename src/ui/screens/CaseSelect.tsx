import { useEffect, useMemo, useState } from "react";
import { manifest } from "../../data/loader";
import type { Mode } from "../../engine/types";
import { completedCaseIds } from "../../analytics/store";
import { detectProvider, modelsForProvider, resolveModel } from "../../llm/LlmAdapter";
import { useAppStore } from "../store";

const DIFFICULTY_DOT: Record<string, string> = {
  easy: "var(--color-exam-ok)",
  moderate: "var(--color-exam-warn)",
  hard: "var(--color-exam-danger)",
};

export function CaseSelect() {
  const startCase = useAppStore((s) => s.startCase);
  const startRandomCase = useAppStore((s) => s.startRandomCase);
  const openReview = useAppStore((s) => s.openReview);
  const setApiKey = useAppStore((s) => s.setApiKey);
  const setModel = useAppStore((s) => s.setModel);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const providerKind = useAppStore((s) => s.providerKind);
  const aiStatus = useAppStore((s) => s.aiStatus);
  const aiError = useAppStore((s) => s.aiError);
  const pendingAiPanel = useAppStore((s) => s.pendingAiPanel);
  const clearPendingAiPanel = useAppStore((s) => s.clearPendingAiPanel);

  const [mode, setMode] = useState<Mode>("STRICT_OSCE");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [starting, setStarting] = useState<string | null>(null);
  // Open the AI panel immediately if arriving from the home "Enable AI" button.
  const [showKey, setShowKey] = useState(() => useAppStore.getState().pendingAiPanel);
  const [keyDraft, setKeyDraft] = useState("");

  // CaseSelect remounts whenever the user returns from a station, so reading
  // completed ids once on mount reflects the latest attempts.
  const completed = useMemo(() => completedCaseIds(), []);

  const categories = useMemo(
    () => [...new Set(manifest.cases.map((c) => c.category))].sort(),
    [],
  );
  const difficulties = useMemo(
    () => [...new Set(manifest.cases.map((c) => c.difficulty))].sort(),
    [],
  );
  const filtered = manifest.cases.filter(
    (c) =>
      (category === "all" || c.category === category) &&
      (difficulty === "all" || c.difficulty === difficulty),
  );

  const begin = (id: string) => {
    setStarting(id);
    void startCase(id, mode).finally(() => setStarting(null));
  };
  const random = () => {
    // Prefer unattempted within the current filter; else any in filter.
    const pool = filtered.map((c) => c.id);
    const unattempted = pool.filter((id) => !completed.has(id));
    const candidates = unattempted.length > 0 ? unattempted : pool;
    setStarting("__random__");
    void startRandomCase(mode, candidates).finally(() => setStarting(null));
  };

  // Clear the one-shot flag after consuming it at mount (above).
  useEffect(() => {
    if (pendingAiPanel) clearPendingAiPanel();
  }, [pendingAiPanel, clearPendingAiPanel]);

  const doneCount = manifest.cases.filter((c) => completed.has(c.id)).length;
  const draftProvider = detectProvider(keyDraft);
  // Which provider's models to show: the draft key's provider if typing, else
  // the configured one (default to Anthropic for the picker before any key).
  const activeProvider = draftProvider ?? providerKind;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-6">
        <div className="space-y-1">
          <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
            Station Library
          </h1>
          <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
            {manifest.cases.length} standardized-patient stations · {doneCount} completed · 3 min
            chart review · 20 min encounter · 20 min post-encounter
          </p>
          <p className="hint">
            For medical education and OSCE practice only — not for clinical decision-making.
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <button className="btn" onClick={() => setShowKey((v) => !v)}>
            {llmEnabled ? "🟢 AI on" : "○ Enable AI"}
          </button>
          <span className="hint">
            Progress: {doneCount} / {manifest.cases.length}
          </span>
        </div>
      </div>

      {showKey && (
        <div className="card p-4 space-y-2">
          <div className="panel-label">Enable the AI patient &amp; coaching</div>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
            Paste an <span className="font-semibold">Anthropic</span> (Claude, <code>sk-ant-…</code>)
            or <span className="font-semibold">OpenAI</span> (<code>sk-…</code> / <code>sk-proj-…</code>)
            API key to turn on natural-language patient replies, smart grading, and coaching. The key is
            stored only in this browser, sent only to that provider, and verified on save. The app is
            fully usable without it on the deterministic engine.
          </p>
          <div className="flex gap-2">
            <input
              className="input flex-1 font-mono text-[13px]"
              type="password"
              placeholder={llmEnabled ? "AI enabled — paste a new key to replace" : "sk-ant-… or sk-…"}
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              aria-label="API key"
            />
            <button
              className="btn btn-primary"
              disabled={keyDraft.trim() !== "" && detectProvider(keyDraft) === null}
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
            <p className="hint">
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
      )}

      <div className="card px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div
          role="radiogroup"
          aria-label="Station mode"
          className="flex rounded-lg border p-0.5"
          style={{ borderColor: "var(--color-exam-border-strong)", background: "#f1f4f7" }}
        >
          {(
            [
              ["STRICT_OSCE", "Strict OSCE"],
              ["PRACTICE", "Practice"],
            ] as [Mode, string][]
          ).map(([m, label]) => (
            <button
              key={m}
              role="radio"
              aria-checked={mode === m}
              className="px-4 py-1.5 text-[13px] font-semibold rounded-md transition-all"
              style={{
                background: mode === m ? "#fff" : "transparent",
                color: mode === m ? "var(--color-exam-ink)" : "var(--color-exam-muted)",
                boxShadow: mode === m ? "var(--shadow-card)" : "none",
              }}
              onClick={() => setMode(m)}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={random} disabled={starting !== null || filtered.length === 0}>
          🎲 {starting === "__random__" ? "Loading…" : "Random case"}
        </button>
        <span className="hint -ml-3">prefers ones you haven't done</span>
        <div className="flex items-center gap-2 ml-auto">
          <select
            className="input text-[13px] py-1.5"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="input text-[13px] py-1.5 capitalize"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label="Filter by difficulty"
          >
            <option value="all">All difficulties</option>
            {difficulties.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto scroll-quiet">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr style={{ background: "#fafbfd" }}>
              {["Station", "Category", "Difficulty", "", ""].map((h, i) => (
                <th
                  key={i}
                  className="text-left px-4 py-2.5 border-b panel-label"
                  style={{ borderColor: "var(--color-exam-border)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const done = completed.has(c.id);
              return (
                <tr
                  key={c.id}
                  className="border-b last:border-b-0 transition-colors hover:bg-[#f7f9fc]"
                  style={{ borderColor: "var(--color-exam-border)" }}
                >
                  <td className="px-4 py-3 font-medium">
                    <span className="flex items-center gap-2">
                      {done && (
                        <span
                          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold shrink-0"
                          style={{ background: "var(--color-exam-ok-soft)", color: "var(--color-exam-ok)" }}
                          title="Completed"
                        >
                          ✓
                        </span>
                      )}
                      {c.title}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--color-exam-muted)" }}>
                    {c.category}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 capitalize" style={{ color: "var(--color-exam-muted)" }}>
                      <span
                        className="h-2 w-2 rounded-full inline-block"
                        style={{ background: DIFFICULTY_DOT[c.difficulty] ?? "var(--color-exam-faint)" }}
                      />
                      {c.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.cantMiss && <span className="chip chip-danger">can't-miss</span>}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {done && (
                      <button
                        className="btn btn-ghost mr-1.5"
                        onClick={() => openReview(c.id)}
                        style={{ color: "var(--color-exam-accent)" }}
                      >
                        Review
                      </button>
                    )}
                    <button className="btn btn-primary" disabled={starting !== null} onClick={() => begin(c.id)}>
                      {starting === c.id ? "Loading…" : done ? "Retry" : "Begin"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      <p className="hint text-center">
        Patient interface: {llmEnabled ? "natural-language (AI-assisted, engine-gated)" : "deterministic engine"}
      </p>
    </div>
  );
}
