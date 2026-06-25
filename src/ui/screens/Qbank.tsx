import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SHELF_MCQS, MCQ_SYSTEMS, type McqQuestion } from "../../data/shelfMcq";
import {
  loadMcqProgress,
  recordMcqAnswer,
  resetMcqProgress,
  type McqProgress,
} from "../../data/mcqProgress";
import { Segmented } from "../components/Segmented";
import { useAppStore } from "../store";

/**
 * Question Bank — single-best-answer MCQs drilled one at a time for shelf-exam
 * cramming. Pick a system and a subset (all / unseen / previously missed),
 * commit to an answer, get immediate color-coded feedback plus the teaching
 * explanation, and review a score breakdown at the end. Per-question progress
 * persists so you can keep redoing the ones you miss.
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

/** Copy a question with its options shuffled and the answer index remapped. */
function shuffleOptions(q: McqQuestion): RunQuestion {
  const correct = q.options[q.answerIndex];
  const options = shuffle(q.options);
  return { ...q, options, answerIndex: options.indexOf(correct) };
}

function inSubset(q: McqQuestion, subset: Subset, progress: McqProgress): boolean {
  const stat = progress[q.id];
  if (subset === "unseen") return !stat || stat.seen === 0;
  if (subset === "incorrect") return !!stat && stat.seen > 0 && !stat.lastCorrect;
  return true;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export function Qbank() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);

  const [phase, setPhase] = useState<Phase>("setup");
  const [system, setSystem] = useState<string>("All");
  const [subset, setSubset] = useState<Subset>("all");
  const [shuffleQs, setShuffleQs] = useState(true);

  // Snapshot progress on mount and after each answer so subset counts/mastery update.
  const [progress, setProgress] = useState<McqProgress>(() => loadMcqProgress());

  // Active run state.
  const [queue, setQueue] = useState<RunQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const pool = useMemo(
    () => (system === "All" ? SHELF_MCQS : SHELF_MCQS.filter((q) => q.system === system)),
    [system],
  );
  const eligible = useMemo(
    () => pool.filter((q) => inSubset(q, subset, progress)),
    [pool, subset, progress],
  );

  const startRun = useCallback(
    (questions: McqQuestion[]) => {
      const prepared = questions.map(shuffleOptions);
      const run = shuffleQs ? shuffle(prepared) : prepared;
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
        setProgress(recordMcqAnswer(q.id, correct));
        const next = prev.slice();
        next[idx] = choice;
        return next;
      });
    },
    [idx, queue],
  );

  const current = queue[idx];
  const chosen = answers[idx] ?? null;
  const answered = chosen != null;

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
    const total = SHELF_MCQS.length;
    const mastered = SHELF_MCQS.filter((q) => progress[q.id]?.lastCorrect).length;
    const unseenCount = pool.filter((q) => inSubset(q, "unseen", progress)).length;
    const incorrectCount = pool.filter((q) => inSubset(q, "incorrect", progress)).length;
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 space-y-4">
        <Header exit={exitToSelect} />

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
                {MCQ_SYSTEMS.map((s) => (
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
              onClick={() => startRun(eligible)}
            >
              {eligible.length === 0
                ? "No questions in this subset"
                : `Start quiz · ${eligible.length} question${eligible.length === 1 ? "" : "s"} →`}
            </button>
            {subset === "incorrect" && incorrectCount === 0 && (
              <span className="hint">Nothing missed here yet — answer some questions first.</span>
            )}
          </div>
        </div>

        <div className="card p-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Stat label="Questions in bank" value={String(total)} />
          <Stat label="Systems" value={String(MCQ_SYSTEMS.length)} />
          <Stat label="Mastered" value={`${mastered} / ${total}`} />
          {mastered > 0 && (
            <button
              className="btn btn-ghost ml-auto text-[12.5px] py-1"
              onClick={() => {
                resetMcqProgress();
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
        <Header exit={exitToSelect} />
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
      <Header exit={exitToSelect} compact />

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
            background: "var(--grad-primary)",
          }}
        />
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip chip-accent">{current.system}</span>
          <span className="chip">{current.topic}</span>
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
              disabled={answered}
              onClick={() => answer(i)}
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
          <div className="panel-label">
            {chosen === current.answerIndex ? "✓ Correct" : "✗ Incorrect"} — {LETTERS[current.answerIndex]} is right
          </div>
          <p className="text-[13.5px] leading-relaxed">{current.explanation}</p>
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

function OptionButton({
  letter,
  text,
  state,
  disabled,
  onClick,
}: {
  letter: string;
  text: string;
  state: "idle" | "correct" | "wrong" | "muted";
  disabled: boolean;
  onClick: () => void;
}) {
  const styles: Record<typeof state, React.CSSProperties> = {
    idle: { borderColor: "var(--color-exam-border)" },
    correct: { borderColor: "var(--color-exam-ok-line)", background: "var(--color-exam-ok-soft)" },
    wrong: { borderColor: "var(--color-exam-danger-line)", background: "var(--color-exam-danger-soft)" },
    muted: { borderColor: "var(--color-exam-border)", opacity: 0.55 },
  };
  const badge =
    state === "correct" ? "✓" : state === "wrong" ? "✗" : letter;
  const badgeColor =
    state === "correct"
      ? "var(--color-exam-ok)"
      : state === "wrong"
        ? "var(--color-exam-danger)"
        : "var(--color-exam-muted)";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={`Option ${letter}`}
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
      <span>{text}</span>
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

function Header({ exit, compact }: { exit: () => void; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  if (compact) {
    return (
      <div ref={ref} className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
          Question Bank
        </h2>
        <button className="btn btn-ghost shrink-0" onClick={exit}>
          Case list →
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex items-start gap-3">
        <span className="icon-tile" style={{ background: "var(--grad-primary)" }} aria-hidden="true">
          ❓
        </span>
        <div className="space-y-0.5">
          <div className="panel-label">Shelf exam</div>
          <h2 className="text-[24px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
            Question Bank
          </h2>
          <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
            Single-best-answer MCQs from the high-yield IM review. Commit to an answer, get instant feedback and the
            teaching point, and redo the ones you miss.
          </p>
        </div>
      </div>
      <button className="btn btn-ghost shrink-0" onClick={exit}>
        Case list →
      </button>
    </div>
  );
}
