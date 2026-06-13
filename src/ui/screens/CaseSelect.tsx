import { useEffect, useMemo, useState } from "react";
import { manifest } from "../../data/loader";
import type { Mode } from "../../engine/types";
import { loadAttempts, loadReviews } from "../../analytics/store";
import { categoryFlair } from "../gamification";
import { EnableAiPanel } from "../components/EnableAiPanel";
import { Segmented } from "../components/Segmented";
import { useAppStore } from "../store";

const DIFFICULTY_PIPS: Record<string, { n: number; color: string }> = {
  easy: { n: 1, color: "var(--color-exam-ok)" },
  moderate: { n: 2, color: "var(--color-exam-warn)" },
  hard: { n: 3, color: "var(--color-exam-danger)" },
};

function DifficultyPips({ difficulty }: { difficulty: string }) {
  const pip = DIFFICULTY_PIPS[difficulty] ?? { n: 0, color: "var(--color-exam-faint)" };
  return (
    <span className="inline-flex items-center gap-1 capitalize text-[11.5px] font-bold" style={{ color: "var(--color-exam-muted)" }}>
      <span className="inline-flex gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full inline-block"
            style={{ background: i < pip.n ? pip.color : "var(--color-exam-border-strong)" }}
          />
        ))}
      </span>
      {difficulty}
    </span>
  );
}

function scoreColor(score: number): string {
  return score >= 70 ? "var(--color-exam-ok)" : score >= 55 ? "var(--color-exam-warn)" : "var(--color-exam-danger)";
}

const MODE_CAPTIONS: Record<Mode, string> = {
  STRICT_OSCE: "Timed · phases auto-advance · answer key locked until feedback",
  PRACTICE: "Untimed · same hidden info and scoring · answer key available while you work",
};

export function CaseSelect() {
  const startCase = useAppStore((s) => s.startCase);
  const startRandomCase = useAppStore((s) => s.startRandomCase);
  const openReview = useAppStore((s) => s.openReview);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const aiStatus = useAppStore((s) => s.aiStatus);
  const preferredMode = useAppStore((s) => s.preferredMode);
  const setPreferredMode = useAppStore((s) => s.setPreferredMode);
  const pendingAiPanel = useAppStore((s) => s.pendingAiPanel);
  const clearPendingAiPanel = useAppStore((s) => s.clearPendingAiPanel);
  const pendingCategoryFilter = useAppStore((s) => s.pendingCategoryFilter);
  const clearPendingCategoryFilter = useAppStore((s) => s.clearPendingCategoryFilter);

  // Pre-apply a category filter if arriving from a "See all {category}" link.
  const [category, setCategory] = useState(
    () => useAppStore.getState().pendingCategoryFilter ?? "all",
  );
  const [difficulty, setDifficulty] = useState("all");
  const [query, setQuery] = useState("");
  const [starting, setStarting] = useState<string | null>(null);
  // Open the AI panel immediately if arriving from the home "Enable AI" button.
  const [showKey, setShowKey] = useState(() => useAppStore.getState().pendingAiPanel);

  // CaseSelect remounts whenever the user returns from a station, so reading
  // attempts once on mount reflects the latest scores. Chronological per case,
  // so cards can show both the best score and the first→latest trend.
  const scoresByCase = useMemo(() => {
    const scores = new Map<string, number[]>();
    for (const a of loadAttempts()) {
      const list = scores.get(a.caseId);
      if (list) list.push(a.overall);
      else scores.set(a.caseId, [a.overall]);
    }
    return scores;
  }, []);
  const completed = useMemo(() => new Set(scoresByCase.keys()), [scoresByCase]);
  // A review payload exists only for cases completed in this browser — gate
  // the button on the actual record, not just the attempt log.
  const reviewable = useMemo(() => new Set(Object.keys(loadReviews())), []);

  const categories = useMemo(
    () => [...new Set(manifest.cases.map((c) => c.category))].sort(),
    [],
  );
  const difficulties = ["easy", "moderate", "hard"].filter((d) =>
    manifest.cases.some((c) => c.difficulty === d),
  );
  const q = query.trim().toLowerCase();
  const filtered = manifest.cases.filter(
    (c) =>
      (category === "all" || c.category === category) &&
      (difficulty === "all" || c.difficulty === difficulty) &&
      (q === "" || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)),
  );

  const begin = (id: string) => {
    setStarting(id);
    void startCase(id, preferredMode).finally(() => setStarting(null));
  };
  const random = () => {
    // Prefer unattempted within the current filter; else any in filter.
    const pool = filtered.map((c) => c.id);
    const unattempted = pool.filter((id) => !completed.has(id));
    const candidates = unattempted.length > 0 ? unattempted : pool;
    setStarting("__random__");
    void startRandomCase(preferredMode, candidates).finally(() => setStarting(null));
  };

  // Clear the one-shot flags after consuming them at mount (above).
  useEffect(() => {
    if (pendingAiPanel) clearPendingAiPanel();
  }, [pendingAiPanel, clearPendingAiPanel]);
  useEffect(() => {
    if (pendingCategoryFilter) clearPendingCategoryFilter();
  }, [pendingCategoryFilter, clearPendingCategoryFilter]);

  const doneCount = manifest.cases.filter((c) => completed.has(c.id)).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-6">
        <div className="space-y-1.5 min-w-0">
          <h1 className="text-[24px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
            OSCE Case Library
          </h1>
          <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
            {manifest.cases.length} standardized-patient OSCE cases · 3 min chart review · 20 min
            encounter · 20 min post-encounter
          </p>
          <div className="flex items-center gap-2.5 pt-0.5">
            <div className="progress-track w-44">
              <div
                className="progress-fill"
                style={{ width: `${Math.round((doneCount / Math.max(1, manifest.cases.length)) * 100)}%` }}
              />
            </div>
            <span className="text-[12px] font-bold tabular-nums" style={{ color: "var(--color-exam-accent-deep)" }}>
              {doneCount} / {manifest.cases.length} completed
            </span>
          </div>
        </div>
        <button
          className="btn shrink-0"
          aria-expanded={showKey}
          aria-controls="enable-ai-panel"
          style={
            aiStatus === "error"
              ? { color: "var(--color-exam-warn)", borderColor: "var(--color-exam-warn-line)" }
              : undefined
          }
          onClick={() => setShowKey((v) => !v)}
        >
          {aiStatus === "error" ? "⚠️ AI key error" : llmEnabled ? "🟢 AI on" : "○ Enable AI"}
        </button>
      </div>

      {showKey && <EnableAiPanel />}

      {/* Controls: mode, random, search, difficulty */}
      <div className="card px-4 py-3 flex flex-wrap items-start gap-x-5 gap-y-3">
        <div className="flex flex-col gap-1">
          <div className="self-start">
            <Segmented
              label="Case mode"
              options={[
                { value: "PRACTICE", label: "🌱 Practice" },
                { value: "STRICT_OSCE", label: "⏱️ Strict OSCE" },
              ]}
              value={preferredMode}
              onChange={setPreferredMode}
            />
          </div>
          <p className="hint pl-1">{MODE_CAPTIONS[preferredMode]}</p>
        </div>
        <button className="btn btn-primary" onClick={random} disabled={starting !== null || filtered.length === 0}>
          🎲 {starting === "__random__" ? "Loading…" : "Random case"}
        </button>
        <span className="hint -ml-3 hidden sm:inline self-center">prefers ones you haven't done</span>
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <input
            className="input text-[13px] py-1.5 w-44"
            placeholder="🔍 Search cases…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search cases"
          />
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

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
        <button
          aria-pressed={category === "all"}
          className="chip chip-btn"
          style={
            category === "all"
              ? { background: "var(--color-exam-ink)", color: "#fff", borderColor: "var(--color-exam-ink)" }
              : undefined
          }
          onClick={() => setCategory("all")}
        >
          All
        </button>
        {categories.map((c) => {
          const flair = categoryFlair(c);
          const active = category === c;
          return (
            <button
              key={c}
              aria-pressed={active}
              className="chip chip-btn"
              style={
                active
                  ? { background: flair.deep, color: "#fff", borderColor: flair.deep }
                  : { color: flair.deep, borderColor: flair.soft, background: flair.soft }
              }
              onClick={() => setCategory(active ? "all" : c)}
            >
              {flair.emoji} {c}
            </button>
          );
        })}
      </div>

      {/* Station cards */}
      {filtered.length === 0 ? (
        <p className="text-sm italic text-center py-10" style={{ color: "var(--color-exam-faint)" }}>
          No cases match — try clearing the search or filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((c) => {
            const flair = categoryFlair(c.category);
            const scores = scoresByCase.get(c.id);
            const done = scores !== undefined && scores.length > 0;
            const best = done ? Math.max(...scores) : undefined;
            return (
              <div key={c.id} className="card card-pop overflow-hidden flex flex-col">
                <div aria-hidden className="h-1.5 shrink-0" style={{ background: flair.grad }} />
                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="chip"
                      style={{ color: flair.deep, borderColor: flair.soft, background: flair.soft }}
                    >
                      {flair.emoji} {c.category}
                    </span>
                    {best !== undefined && (
                      <span
                        className="text-[12px] font-extrabold font-mono tabular-nums px-2 py-0.5 rounded-full shrink-0"
                        style={{ color: scoreColor(best), background: "var(--color-exam-soft)" }}
                        title={`Best score: ${best}/100`}
                      >
                        ★ {best}
                      </span>
                    )}
                  </div>
                  <div className="text-[14.5px] font-extrabold leading-snug">{c.title}</div>
                  <div className="flex items-center gap-3 mt-auto pt-1">
                    <DifficultyPips difficulty={c.difficulty} />
                    {c.cantMiss && <span className="chip chip-danger">can't-miss</span>}
                  </div>
                  {scores && scores.length >= 2 && (
                    <div
                      className="text-[11px] font-medium tabular-nums"
                      style={{ color: "var(--color-exam-muted)" }}
                    >
                      {scores.length} attempts · {scores[0]} → {scores[scores.length - 1]}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1.5">
                    <button
                      className="btn btn-primary flex-1"
                      disabled={starting !== null}
                      onClick={() => begin(c.id)}
                    >
                      {starting === c.id ? "Loading…" : done ? "Retry" : "Begin"}
                    </button>
                    {reviewable.has(c.id) && (
                      <button
                        className="btn btn-ghost"
                        onClick={() => openReview(c.id)}
                        style={{ color: "var(--color-exam-accent)" }}
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="hint text-center">
        Patient interface: {llmEnabled ? "natural-language (AI-assisted, engine-gated)" : "deterministic engine"} ·
        For medical education and OSCE practice only — not for clinical decision-making.
      </p>
    </div>
  );
}
