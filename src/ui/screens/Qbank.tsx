import { useCallback, useEffect, useMemo, useState } from "react";
import { type McqQuestion } from "../../data/shelfMcq";
import { IM_BANK, type McqBank } from "../../data/mcqBank";
import {
  loadMcqProgress,
  recordMcqAnswer,
  resetMcqProgress,
  type McqProgress,
} from "../../data/mcqProgress";
import { Segmented } from "../components/Segmented";

/**
 * Question Bank — single-best-answer MCQs drilled one at a time for shelf-exam
 * cramming. Pick a system and a subset (all / unseen / previously missed),
 * commit to an answer, get immediate color-coded feedback plus the teaching
 * explanation, and review a score breakdown at the end. Per-question progress
 * persists so you can keep redoing the ones you miss.
 *
 * Generic over an `McqBank` (defaults to the Internal Medicine bank), so the
 * same screen serves multiple banks (IM, Family Medicine, …) — each with its
 * own question set, system list, and progress storage key.
 */

type Subset = "all" | "unseen" | "incorrect";
type Phase = "setup" | "quiz" | "results";

/** A question prepared for a run: options shuffled, answer index remapped. */
interface RunQuestion extends McqQuestion {
  /** Index in `options` (post-shuffle) of the correct choice. */
  answerIndex: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Copy a question with its options shuffled and the answer index remapped.
 * When per-option rationales are present, they ride along with their option
 * (one permutation applied to both) so a rationale can never desync.
 */
function shuffleOptions(q: McqQuestion): RunQuestion {
  const order = shuffle(q.options.map((_, i) => i));
  const options = order.map((i) => q.options[i]);
  const optionRationales = q.optionRationales
    ? order.map((i) => q.optionRationales![i])
    : undefined;
  return { ...q, options, optionRationales, answerIndex: order.indexOf(q.answerIndex) };
}

function inSubset(q: McqQuestion, subset: Subset, progress: McqProgress): boolean {
  const stat = progress[q.id];
  if (subset === "unseen") return !stat || stat.seen === 0;
  if (subset === "incorrect") return !!stat && stat.seen > 0 && !stat.lastCorrect;
  return true;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export function Qbank({ bank = IM_BANK }: { bank?: McqBank } = {}) {
  const questions = bank.questions;
  const storageKey = bank.storageKey;

  const [phase, setPhase] = useState<Phase>("setup");
  const [system, setSystem] = useState<string>("All");
  const [subset, setSubset] = useState<Subset>("unseen");
  const [shuffleQs, setShuffleQs] = useState(true);
  // Session length: cap how many eligible questions a single run draws, so a
  // 1,800-question bank can be tackled in chunks. "all" = the whole subset.
  const [sessionLen, setSessionLen] = useState<number | "all">(20);

  // Snapshot progress on mount and after each answer so subset counts/mastery update.
  const [progress, setProgress] = useState<McqProgress>(() => loadMcqProgress(storageKey));

  // Active run state.
  const [queue, setQueue] = useState<RunQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  // Which option rationales are expanded on the current question (indices into options).
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  // Reset to a clean setup screen whenever the bank changes.
  useEffect(() => {
    setPhase("setup");
    setSystem("All");
    setSubset("unseen");
    setProgress(loadMcqProgress(storageKey));
  }, [storageKey]);

  const pool = useMemo(
    () => (system === "All" ? questions : questions.filter((q) => q.system === system)),
    [system, questions],
  );
  const eligible = useMemo(
    () => pool.filter((q) => inSubset(q, subset, progress)),
    [pool, subset, progress],
  );

  const startRun = useCallback(
    (questions: McqQuestion[], limit?: number) => {
      const prepared = questions.map(shuffleOptions);
      const ordered = shuffleQs ? shuffle(prepared) : prepared;
      // Slice AFTER shuffling so a capped session is a random draw from the pool
      // (with shuffle off it's the next sequential chunk in bank order).
      const run = typeof limit === "number" ? ordered.slice(0, limit) : ordered;
      setQueue(run);
      setAnswers(new Array(run.length).fill(null));
      setIdx(0);
      setPhase("quiz");
    },
    [shuffleQs],
  );

  const answer = useCallback(
    (choice: number) => {
      setAnswers((prev) => {
        if (prev[idx] != null) return prev; // already answered — lock it
        const q = queue[idx];
        const correct = choice === q.answerIndex;
        setProgress(recordMcqAnswer(q.id, correct, storageKey));
        const next = prev.slice();
        next[idx] = choice;
        return next;
      });
    },
    [idx, queue, storageKey],
  );

  const current = queue[idx];
  const chosen = answers[idx] ?? null;
  const answered = chosen != null;

  // Per-option rationales collapse by default once answered — showing all of
  // them at once is info overload. Auto-open just the key comparison: the
  // correct option, plus the user's own pick when they got it wrong. Any other
  // option can be clicked to reveal its rationale on demand.
  useEffect(() => {
    if (!current || chosen == null) {
      setExpanded(new Set());
      return;
    }
    const open = new Set<number>([current.answerIndex]);
    if (chosen !== current.answerIndex) open.add(chosen);
    setExpanded(open);
  }, [idx, chosen, current]);

  const toggleExpand = useCallback((i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    if (idx + 1 >= queue.length) setPhase("results");
    else setIdx((i) => i + 1);
  }, [idx, queue.length]);
  const goPrev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);

  // Keyboard: 1-5 answer, Enter / ArrowRight next, ArrowLeft previous.
  useEffect(() => {
    if (phase !== "quiz") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      const n = Number(e.key);
      if (n >= 1 && n <= (current?.options.length ?? 0)) {
        if (!answered) answer(n - 1);
        e.preventDefault();
      } else if (e.key === "Enter" || e.key === "ArrowRight") {
        if (answered) goNext();
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        goPrev();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, answered, answer, goNext, goPrev, current]);

  const score = useMemo(() => {
    let correct = 0;
    let done = 0;
    queue.forEach((q, i) => {
      const a = answers[i];
      if (a != null) {
        done++;
        if (a === q.answerIndex) correct++;
      }
    });
    return { correct, done };
  }, [queue, answers]);

  // ---------------------------------------------------------------- Setup
  if (phase === "setup") {
    const total = questions.length;
    const mastered = questions.filter((q) => progress[q.id]?.lastCorrect).length;
    const unseenCount = pool.filter((q) => inSubset(q, "unseen", progress)).length;
    const incorrectCount = pool.filter((q) => inSubset(q, "incorrect", progress)).length;
    // How many this run will actually draw (capped by what's eligible).
    const runCount = sessionLen === "all" ? eligible.length : Math.min(sessionLen, eligible.length);
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 space-y-4">
        <div className="card p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 block">
              <span className="panel-label">System</span>
              <select
                className="input w-full text-[14px]"
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                aria-label="System"
              >
                <option>All</option>
                {bank.systems.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <div className="space-y-1.5">
              <span className="panel-label">Subset</span>
              <Segmented
                label="Subset"
                options={[
                  { value: "all", label: `All (${pool.length})` },
                  { value: "unseen", label: `Unseen (${unseenCount})` },
                  { value: "incorrect", label: `Missed (${incorrectCount})` },
                ]}
                value={subset}
                onChange={(v) => setSubset(v)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="panel-label">Questions this session</span>
            <div className="flex flex-wrap items-center gap-3">
              <Segmented
                label="Questions this session"
                options={[
                  { value: "10", label: "10" },
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" },
                  { value: "all", label: "All" },
                ]}
                value={sessionLen === "all" ? "all" : String(sessionLen)}
                onChange={(v) => setSessionLen(v === "all" ? "all" : Number(v))}
              />
              <label className="flex items-center gap-1.5 text-[13px] font-semibold">
                <span style={{ color: "var(--color-exam-muted)" }}>Custom</span>
                <input
                  type="number"
                  min={1}
                  value={sessionLen === "all" ? "" : sessionLen}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    setSessionLen(Number.isFinite(n) && n > 0 ? n : "all");
                  }}
                  className="input w-20 text-[14px]"
                  aria-label="Custom session length"
                  placeholder="all"
                />
              </label>
            </div>
            {eligible.length > 0 && (
              <p className="hint">
                Draws {runCount} of the {eligible.length} in this subset
                {runCount < eligible.length
                  ? " — repeat an Unseen session to walk the bank in fresh chunks."
                  : "."}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-[13.5px] font-semibold cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={shuffleQs}
              onChange={(e) => setShuffleQs(e.target.checked)}
              className="h-4 w-4"
            />
            Shuffle question order
          </label>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              className="btn btn-primary"
              disabled={eligible.length === 0}
              onClick={() => startRun(eligible, sessionLen === "all" ? undefined : sessionLen)}
            >
              {eligible.length === 0
                ? "No questions in this subset"
                : `Start quiz · ${runCount} question${runCount === 1 ? "" : "s"} →`}
            </button>
            {subset === "incorrect" && incorrectCount === 0 && (
              <span className="hint">Nothing missed here yet — answer some questions first.</span>
            )}
          </div>
        </div>

        <div className="card p-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Stat label="Questions in bank" value={String(total)} />
          <Stat label="Systems" value={String(bank.systems.length)} />
          <Stat label="Mastered" value={`${mastered} / ${total}`} />
          {mastered > 0 && (
            <button
              className="btn btn-ghost ml-auto text-[12.5px] py-1"
              onClick={() => {
                resetMcqProgress(storageKey);
                setProgress({});
              }}
            >
              Reset progress
            </button>
          )}
        </div>

        <p className="hint text-center">
          Tip: while answering, press 1-5 to pick, then Enter or → for the next question.
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------- Results
  if (phase === "results") {
    const pct = queue.length ? Math.round((score.correct / queue.length) * 100) : 0;
    const wrong = queue.filter((q, i) => answers[i] !== q.answerIndex);
    const bySystem = new Map<string, { correct: number; total: number }>();
    queue.forEach((q, i) => {
      const e = bySystem.get(q.system) ?? { correct: 0, total: 0 };
      e.total++;
      if (answers[i] === q.answerIndex) e.correct++;
      bySystem.set(q.system, e);
    });
    const band =
      pct >= 80 ? "var(--color-exam-ok)" : pct >= 60 ? "var(--color-exam-warn)" : "var(--color-exam-danger)";
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 space-y-4">
        <div className="card p-6 text-center space-y-2 pop-in">
          <div className="panel-label">Quiz complete</div>
          <div className="text-[40px] font-extrabold tabular-nums" style={{ color: band }}>
            {pct}%
          </div>
          <p className="text-[15px] font-semibold">
            {score.correct} / {queue.length} correct
          </p>
        </div>

        {bySystem.size > 1 && (
          <div className="card p-4 space-y-2">
            <div className="panel-label">By system</div>
            {[...bySystem.entries()].map(([sys, e]) => (
              <div key={sys} className="flex items-center justify-between text-[13.5px]">
                <span>{sys}</span>
                <span className="tabular-nums font-semibold">
                  {e.correct} / {e.total}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {wrong.length > 0 && (
            <button className="btn btn-primary" onClick={() => startRun(wrong)}>
              Redo {wrong.length} missed →
            </button>
          )}
          <button className="btn" onClick={() => startRun(queue)}>
            Retake all
          </button>
          <button className="btn btn-ghost ml-auto" onClick={() => setPhase("setup")}>
            ← Change selection
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- Quiz
  if (!current) return null;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      {/* No screen header here — the "Questions" nav tab labels the screen, and
          the Exit/progress bar below carries the quiz context. */}

      {/* Progress + score bar */}
      <div className="flex items-center justify-between gap-3 text-[13px] font-semibold">
        <button className="btn btn-ghost py-1 px-2.5 text-[12.5px]" onClick={() => setPhase("setup")}>
          ← Exit quiz
        </button>
        <span style={{ color: "var(--color-exam-muted)" }}>
          Question {idx + 1} of {queue.length}
        </span>
        <span className="chip chip-ok tabular-nums">
          {score.correct} / {score.done} correct
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-exam-soft)" }}>
        <div
          className="h-full transition-all"
          style={{
            width: `${((idx + (answered ? 1 : 0)) / queue.length) * 100}%`,
            background: bank.grad,
          }}
        />
      </div>

      <div className="card p-5 space-y-4">
        {/* Only the system is shown up front — the topic names the diagnosis and
            would give away the answer, so it's revealed in the feedback below. */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip chip-accent">{current.system}</span>
        </div>
        <p className="text-[15.5px] font-semibold leading-relaxed">{current.stem}</p>

        <div className="space-y-2">
          {current.options.map((opt, i) => (
            <OptionButton
              key={i}
              letter={LETTERS[i]}
              text={opt}
              state={
                !answered
                  ? "idle"
                  : i === current.answerIndex
                    ? "correct"
                    : i === chosen
                      ? "wrong"
                      : "muted"
              }
              rationale={current.optionRationales?.[i]}
              answered={answered}
              expanded={expanded.has(i)}
              onClick={() => (answered ? toggleExpand(i) : answer(i))}
            />
          ))}
        </div>
      </div>

      {answered && (
        <div
          className="card p-4 space-y-2 pop-in"
          style={{
            borderColor:
              chosen === current.answerIndex ? "var(--color-exam-ok-line)" : "var(--color-exam-danger-line)",
            background:
              chosen === current.answerIndex ? "var(--color-exam-ok-soft)" : "var(--color-exam-danger-soft)",
          }}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="panel-label">
              {chosen === current.answerIndex ? "✓ Correct" : "✗ Incorrect"} — {LETTERS[current.answerIndex]} is right
            </div>
            <span className="chip">{current.topic}</span>
          </div>
          {/* The top explanation often just restates the stem/answer; when a
              richer Concept block exists (FM teaching bank) we drop it and let
              the concept carry the point. Banks without a concept (IM) keep it. */}
          {current.explanation && !current.concept && (
            <p className="text-[13.5px] leading-relaxed">{current.explanation}</p>
          )}
          {(current.concept ||
            (current.scoreComponents && current.scoreComponents.length > 0) ||
            (current.conceptRule && current.conceptRule.length > 0)) && (
            <div
              className="rounded-xl border px-3.5 py-3 space-y-1.5"
              style={{ borderColor: "var(--color-exam-accent-line)", background: "var(--color-exam-bg)" }}
            >
              <div className="panel-label" style={{ color: "var(--color-exam-accent)" }}>
                💡 Concept
              </div>
              {current.concept && <p className="text-[13px] leading-relaxed">{current.concept}</p>}
              {current.scoreComponents && current.scoreComponents.length > 0 && (
                <div className="mt-1">
                  <span className="text-[11.5px] font-bold uppercase tracking-wide" style={{ color: "var(--color-exam-muted)" }}>
                    Components
                  </span>
                  <ul className="mt-0.5 space-y-0.5">
                    {current.scoreComponents.map((c, i) => (
                      <li key={i} className="flex gap-2 text-[12.5px] leading-snug">
                        <span aria-hidden style={{ color: "var(--color-exam-accent)" }}>·</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {current.conceptRule && current.conceptRule.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {current.conceptRule.map((r, i) => (
                    <li key={i} className="flex gap-2 text-[12.5px] leading-snug">
                      <span aria-hidden style={{ color: "var(--color-exam-accent)" }}>
                        •
                      </span>
                      <span className="tabular-nums">{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {current.discriminator && <TeachRow icon="🔑" label="Key discriminator" text={current.discriminator} />}
          {current.mnemonic && <TeachRow icon="🧠" label="Mnemonic" text={current.mnemonic} />}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button className="btn btn-ghost" onClick={goPrev} disabled={idx === 0}>
          ← Previous
        </button>
        <button className="btn btn-primary" onClick={goNext} disabled={!answered}>
          {idx + 1 >= queue.length ? "Finish →" : "Next →"}
        </button>
      </div>
    </div>
  );
}

/** Compact icon + label + one-line teaching row (discriminator / trap / mnemonic). */
function TeachRow({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <div className="flex gap-2 text-[12.5px] leading-snug">
      <span aria-hidden>{icon}</span>
      <span>
        <span className="font-bold">{label}:</span>{" "}
        <span style={{ color: "var(--color-exam-ink)" }}>{text}</span>
      </span>
    </div>
  );
}

function OptionButton({
  letter,
  text,
  state,
  rationale,
  answered,
  expanded,
  onClick,
}: {
  letter: string;
  text: string;
  state: "idle" | "correct" | "wrong" | "muted";
  /** One-line teaching rationale, revealed beneath the option on click once answered. */
  rationale?: string;
  answered: boolean;
  /** Whether this option's rationale is currently shown. */
  expanded: boolean;
  onClick: () => void;
}) {
  const styles: Record<typeof state, React.CSSProperties> = {
    idle: { borderColor: "var(--color-exam-border)" },
    correct: { borderColor: "var(--color-exam-ok-line)", background: "var(--color-exam-ok-soft)" },
    wrong: { borderColor: "var(--color-exam-danger-line)", background: "var(--color-exam-danger-soft)" },
    muted: { borderColor: "var(--color-exam-border)", opacity: 0.7 },
  };
  const badge =
    state === "correct" ? "✓" : state === "wrong" ? "✗" : letter;
  const badgeColor =
    state === "correct"
      ? "var(--color-exam-ok)"
      : state === "wrong"
        ? "var(--color-exam-danger)"
        : "var(--color-exam-muted)";
  // Once answered, tapping an option reveals its rationale (no re-answering).
  const hasRationale = answered && !!rationale;
  // After answering, options with no rationale have nothing to do — disable them.
  const disabled = answered && !rationale;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={`Option ${letter}`}
      aria-expanded={hasRationale ? expanded : undefined}
      className="w-full flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[14px] leading-relaxed transition-colors disabled:cursor-default enabled:hover:border-[var(--color-exam-accent-line)]"
      style={styles[state]}
    >
      <span
        className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-[12.5px] font-extrabold mt-px"
        style={{ border: `1.5px solid ${badgeColor}`, color: badgeColor }}
        aria-hidden
      >
        {badge}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span>{text}</span>
          {hasRationale && (
            <span
              className="shrink-0 text-[11px] font-bold mt-0.5 whitespace-nowrap"
              style={{ color: "var(--color-exam-muted)" }}
              aria-hidden
            >
              {expanded ? "Hide ▴" : "Why? ▾"}
            </span>
          )}
        </span>
        {hasRationale && expanded && (
          <span
            className="block mt-1 text-[12.5px] leading-snug font-normal"
            style={{ color: "var(--color-exam-muted)" }}
          >
            {rationale}
          </span>
        )}
      </span>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="panel-label">{label}</div>
      <div className="text-[18px] font-extrabold tabular-nums" style={{ color: "var(--color-exam-header)" }}>
        {value}
      </div>
    </div>
  );
}

