/**
 * Shared drill UI + grading primitives, moved verbatim out of the IM Drills
 * screen so a later Family-Medicine drills screen can reuse them. Generic over
 * drill type — nothing here knows about IM vs FM. Grading routes through the
 * store's gradeCoverage (AI when a key is set, else a lenient keyword match).
 */
import { useEffect, useState } from "react";
import { useAppStore } from "../store";
import {
  isMastered,
  isSeen,
  type DrillProgress,
  type DrillManual,
  type DrillProgressMap,
} from "../../data/drillProgressCore";

export interface Coverage {
  group: string;
  items: { item: string; covered: boolean }[];
}

/** Build coverage display from a set of matched item strings. */
export function buildCoverage(
  groups: { group: string; items: string[] }[],
  matched: Set<string>,
): { coverage: Coverage[]; named: number; total: number } {
  let named = 0;
  let total = 0;
  const coverage = groups.map((g) => ({
    group: g.group,
    items: g.items.map((item) => {
      const covered = matched.has(item);
      total += 1;
      if (covered) named += 1;
      return { item, covered };
    }),
  }));
  return { coverage, named, total };
}

/** Hook: grade an answer against item groups via the store (AI or lenient),
 *  returning the set of matched items + a grading flag. */
export function useGrader() {
  const grade = useAppStore((s) => s.gradeCoverage);
  return async (answer: string, groups: { items: string[] }[]): Promise<Set<string>> => {
    const items = groups.flatMap((g) => g.items);
    const matched = await grade(answer, items);
    return new Set(matched);
  };
}

/** mm:ss for the stopwatch. */
export function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Status of the currently-served problem (mastered / seen / needs-work / new). */
export function SeenChip({ entry }: { entry?: DrillProgress }) {
  if (!entry || entry.attempts === 0) return <span className="chip">✦ New</span>;
  if (isMastered(entry)) return <span className="chip chip-ok">✓ Mastered</span>;
  if (entry.manual === "review") return <span className="chip chip-warn">⚑ Needs work</span>;
  return <span className="chip">Seen · best {entry.bestPct}%</span>;
}

/** Mark-mastered / needs-work controls + a one-line history, shown after grading. */
export function MasteryControls({ entry, onSetManual }: { entry?: DrillProgress; onSetManual: (m: DrillManual) => void }) {
  const manual = entry?.manual ?? "none";
  const auto = (entry?.bestPct ?? 0) >= 80 && manual !== "review";
  return (
    <div className="flex items-center gap-2 flex-wrap border-t pt-3" style={{ borderColor: "var(--color-exam-border)" }}>
      <span className="hint">
        {entry
          ? `Seen ${entry.attempts}× · best ${entry.bestPct}%${auto ? " · mastered" : ""}`
          : "First attempt — now saved to your progress"}
      </span>
      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          className={`btn ${manual === "mastered" ? "btn-primary" : "btn-ghost"} py-1 px-2.5 text-[12px]`}
          aria-pressed={manual === "mastered"}
          onClick={() => onSetManual(manual === "mastered" ? "none" : "mastered")}
        >
          {manual === "mastered" ? "✓ Mastered" : "Mark mastered"}
        </button>
        <button
          type="button"
          className="btn btn-ghost py-1 px-2.5 text-[12px]"
          aria-pressed={manual === "review"}
          style={manual === "review" ? { color: "var(--color-exam-warn)" } : undefined}
          onClick={() => onSetManual(manual === "review" ? "none" : "review")}
        >
          {manual === "review" ? "⚑ Needs work" : "Needs work"}
        </button>
      </div>
    </div>
  );
}

/** Browsable list of every problem in the current drill type, with status, so a
 *  problem is never lost: jump straight to any one. Spoiler-safe — the answer is
 *  only shown for problems already attempted. */
export function DrillBrowser({
  items,
  keyOf,
  progress,
  currentId,
  onPick,
}: {
  items: { id: string; label: string; group?: string; answer?: string }[];
  keyOf: (id: string) => string;
  progress: DrillProgressMap;
  currentId: string | null;
  onPick: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "unseen" | "review" | "mastered">("all");
  const filtered = items.filter((it) => {
    const p = progress[keyOf(it.id)];
    if (filter === "unseen") return !isSeen(p);
    if (filter === "review") return p?.manual === "review";
    if (filter === "mastered") return isMastered(p);
    return true;
  });
  const FILTERS: { k: typeof filter; label: string }[] = [
    { k: "all", label: "All" },
    { k: "unseen", label: "Unseen" },
    { k: "review", label: "Needs work" },
    { k: "mastered", label: "Mastered" },
  ];
  return (
    <div className="card p-3 space-y-2 pop-in">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="panel-label">All problems</span>
        <div className="ml-auto flex items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.k}
              type="button"
              className={`btn ${filter === f.k ? "btn-primary" : "btn-ghost"} py-0.5 px-2 text-[11.5px]`}
              onClick={() => setFilter(f.k)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-80 overflow-auto px-0.5 space-y-1">
        {filtered.length === 0 ? (
          <p className="hint py-2 text-center">Nothing here yet.</p>
        ) : (
          filtered.map((it) => {
            const p = progress[keyOf(it.id)];
            const seen = isSeen(p);
            const mastered = isMastered(p);
            const review = p?.manual === "review";
            const icon = mastered ? "✓" : review ? "⚑" : seen ? "•" : "○";
            const tone = mastered
              ? "var(--color-exam-ok)"
              : review
                ? "var(--color-exam-warn)"
                : seen
                  ? "var(--color-exam-accent)"
                  : "var(--color-exam-muted)";
            const isCurrent = it.id === currentId;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onPick(it.id)}
                className="w-full text-left rounded-lg border px-2.5 py-1.5 flex items-center gap-2 text-[12.5px]"
                style={{
                  borderColor: isCurrent ? "var(--color-exam-accent)" : "var(--color-exam-border)",
                  background: isCurrent ? "var(--color-exam-accent-soft)" : "transparent",
                }}
              >
                <span style={{ color: tone, width: "1rem" }} aria-hidden>
                  {icon}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  {it.group && <span className="font-semibold">{it.group}: </span>}
                  {it.label}
                  {seen && it.answer && (
                    <span style={{ color: "var(--color-exam-muted)" }}> — {it.answer}</span>
                  )}
                </span>
                {seen && (
                  <span className="font-mono tabular-nums" style={{ color: "var(--color-exam-muted)" }}>
                    {p!.bestPct}%
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export function ScoreBar({ named, total, label }: { named: number; total: number; label: string }) {
  const pct = total > 0 ? Math.round((named / total) * 100) : 0;
  const band = pct >= 70 ? "var(--grad-teal)" : pct >= 40 ? "var(--grad-sun)" : "var(--grad-coral)";
  const tone =
    pct >= 70 ? "var(--color-exam-ok)" : pct >= 40 ? "var(--color-exam-warn)" : "var(--color-exam-danger)";
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] font-semibold w-40">{label}</span>
      <div className="progress-track flex-1">
        <div className="progress-fill" style={{ width: `${pct}%`, background: band }} />
      </div>
      <span className="font-mono text-[13px] tabular-nums w-20 text-right" style={{ color: tone }}>
        {named}/{total} · {pct}%
      </span>
    </div>
  );
}

/** Celebration / encouragement chip shown beside the graded score. */
export function ResultChip({ named, total }: { named: number; total: number }) {
  const pct = total > 0 ? (named / total) * 100 : 0;
  return pct >= 70 ? (
    <span className="chip chip-ok">🎉 strong coverage</span>
  ) : (
    <span className="chip chip-warn">keep going</span>
  );
}

/** A qualitative AI grade of a free-text drill answer (e.g. the work-up plan),
 *  fetched once when it mounts. Renders nothing when AI is off or returns null;
 *  shows a "writing…" placeholder while the call is in flight. */
export function AiCoachNote({
  prompt,
  studentAnswer,
  idealAnswer,
  rubric,
}: {
  prompt: string;
  studentAnswer: string;
  idealAnswer: string;
  rubric: string;
}) {
  const coachDrill = useAppStore((s) => s.coachDrill);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const [note, setNote] = useState<string | null>(null);
  const [pending, setPending] = useState(llmEnabled);

  useEffect(() => {
    if (!llmEnabled) return;
    let live = true;
    void coachDrill({ prompt, studentAnswer, idealAnswer, rubric })
      .then((n) => {
        if (live) setNote(n);
      })
      .finally(() => {
        if (live) setPending(false);
      });
    return () => {
      live = false;
    };
    // Fetch once for this graded answer; inputs are stable for a given rep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!llmEnabled) return null;
  if (!pending && !note) return null;
  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: "var(--color-exam-accent-line)", background: "var(--color-exam-accent-soft)" }}
    >
      <div className="panel-label mb-1" style={{ color: "var(--color-exam-accent-deep)" }}>
        Coach's note <span className="chip chip-accent ml-1">AI</span>
      </div>
      {pending ? (
        <p className="text-[12.5px] italic" style={{ color: "var(--color-exam-muted)" }}>
          🤖 Grading your plan…
        </p>
      ) : (
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-exam-accent-deep)" }}>
          {note}
        </p>
      )}
    </div>
  );
}

export function CoverageView({ title, coverage }: { title: string; coverage: Coverage[] }) {
  return (
    <div>
      <div className="panel-label mb-1.5">
        {title} <span className="hint ml-1">✓ = you named it</span>
      </div>
      <div className="space-y-1.5">
        {coverage.map((g) => (
          <div key={g.group} className="text-[13px] leading-relaxed">
            <span className="font-semibold">{g.group}: </span>
            {g.items.map((it, i) => (
              <span key={i}>
                <span
                  style={{
                    color: it.covered ? "var(--color-exam-ok)" : "var(--color-exam-muted)",
                    fontWeight: it.covered ? 600 : 400,
                  }}
                >
                  {it.covered ? "✓ " : ""}
                  {it.item}
                </span>
                {i < g.items.length - 1 ? "  ·  " : ""}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GradeButton({
  graded,
  grading,
  disabled,
  onGrade,
  onNew,
  onRetry,
  newLabel,
}: {
  graded: boolean;
  grading: boolean;
  disabled: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
  newLabel: string;
}) {
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  if (graded) {
    return (
      <div className="flex items-center gap-2">
        <button className="btn" onClick={onNew}>
          {newLabel}
        </button>
        <button className="btn btn-ghost" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <button className="btn btn-primary" onClick={onGrade} disabled={disabled || grading}>
        {grading ? "Grading…" : "Grade my answer"}
      </button>
      <span className="hint">{llmEnabled ? "AI grading" : "keyword grading (enable AI for smarter grading)"}</span>
    </div>
  );
}
