// src/ui/components/drillLadder.tsx
/**
 * The drill learning ladder — lower-friction modes that sit BEFORE the
 * free-recall tests, all running off the same grouped answer key:
 *
 *   Learn  — read the key as a study table, hide a column to self-quiz
 *   Cloze  — one item at a time: clue shown, type the head (or show + rate)
 *   Sort   — every head as a chip; put each into its category bucket
 *   Hints  — a hint bar for Full recall (count / first letters / a clue)
 *
 * They exist because "write everything you remember" from a blank box is the
 * hardest possible first exposure to a drill. Learn and Cloze teach the
 * head↔clue association directly; Sort teaches the structure. Only Cloze and
 * Sort record a real score; Learn logs the drill as seen.
 */
import { useEffect, useRef, useState } from "react";
import { track } from "../../analytics/telemetry";
import type { DrillProgress, DrillManual } from "../../data/drillProgressCore";
import {
  ladderItems,
  seededShuffle,
  firstLetters,
  HINT_PENALTY_PCT,
  type KeyGroup,
  type LadderItem,
} from "../../data/drillLadder";
import { useGrader, MasteryControls, DrillFigure, ResultChip, ScoreBar } from "./drillPrimitives";

interface LadderProps {
  prompt: string;
  keyPoints: KeyGroup[];
  pearls?: string;
  image?: { file: string; alt: string; credit: string };
  badge?: string;
  /** Stable per-drill seed so shuffles survive re-renders. */
  seed: string;
  onRecord: (pct: number) => void;
  onNew: () => void;
  newLabel: string;
  drillType: string;
  progressEntry?: DrillProgress;
  onSetManual: (m: DrillManual) => void;
}

function PromptCard({ prompt, badge }: { prompt: string; badge?: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="panel-label">Prompt</div>
        {badge && <span className="chip chip-accent">{badge}</span>}
      </div>
      <p className="text-[15px] font-semibold leading-relaxed mt-1 whitespace-pre-line">{prompt}</p>
    </div>
  );
}

function PearlsBlock({ pearls }: { pearls?: string }) {
  if (!pearls) return null;
  return (
    <div>
      <div className="panel-label mb-1">Pearls</div>
      <p
        className="rounded-lg border p-3 text-[13px] leading-relaxed whitespace-pre-line"
        style={{ borderColor: "var(--color-exam-ok-line)", background: "var(--color-exam-ok-soft)" }}
      >
        {pearls}
      </p>
    </div>
  );
}

/** A table cell that can be covered; tap to peek at one cell. */
function Cell({ text, hidden }: { text: string; hidden: boolean }) {
  const [peek, setPeek] = useState(false);
  useEffect(() => setPeek(false), [hidden]);
  if (!hidden || peek) return <span>{text}</span>;
  return (
    <button
      type="button"
      className="rounded-md border border-dashed px-2 py-0.5 text-[12px] font-semibold w-full text-left"
      style={{ borderColor: "var(--color-exam-border-strong)", color: "var(--color-exam-muted)" }}
      onClick={() => setPeek(true)}
      aria-label="Show this cell"
    >
      ····
    </button>
  );
}

/**
 * Learn mode: the answer key as a study table. Logged as seen once (never
 * grants mastery). Covering the heads turns it into "name it from the clue";
 * covering the clues turns it into "what separates this one".
 */
export function LearnTable({
  prompt, keyPoints, pearls, image, badge, onRecord, onNew, newLabel, drillType,
}: Pick<LadderProps, "prompt" | "keyPoints" | "pearls" | "image" | "badge" | "onRecord" | "onNew" | "newLabel" | "drillType">) {
  const [cover, setCover] = useState<"none" | "heads" | "clues">("none");
  const logged = useRef(false);
  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    track("drill", { drillType, pct: 0, mode: "learn" });
    onRecord(0);
    // Logged once per mount on purpose — a re-render must not count again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const items = ladderItems(keyPoints);
  const anyClue = items.some((i) => i.clue);
  return (
    <div className="space-y-3">
      <PromptCard prompt={prompt} badge={badge} />
      <div className="card p-4 space-y-3 pop-in">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="panel-label">Study table</div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="hint">Cover a column to quiz yourself</span>
            <button type="button" className="btn btn-ghost py-1 px-2.5 text-[12px]" aria-pressed={cover === "heads"} onClick={() => setCover((c) => (c === "heads" ? "none" : "heads"))}>
              🙈 Hide answers
            </button>
            {anyClue && (
              <button type="button" className="btn btn-ghost py-1 px-2.5 text-[12px]" aria-pressed={cover === "clues"} onClick={() => setCover((c) => (c === "clues" ? "none" : "clues"))}>
                🙈 Hide clues
              </button>
            )}
          </div>
        </div>
        <DrillFigure image={image} />
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] leading-relaxed" aria-label="Answer key">
            <thead>
              <tr className="text-left" style={{ color: "var(--color-exam-muted)" }}>
                <th className="py-1 pr-3 font-semibold w-[22%]">Category</th>
                <th className="py-1 pr-3 font-semibold w-[28%]">Answer</th>
                {anyClue && <th className="py-1 font-semibold">Clue</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => {
                const firstOfGroup = i === 0 || items[i - 1].group !== it.group;
                return (
                  <tr key={it.item} className="border-t align-top" style={{ borderColor: "var(--color-exam-border)" }}>
                    <td className="py-1.5 pr-3 font-semibold">{firstOfGroup ? it.group : ""}</td>
                    <td className="py-1.5 pr-3 font-semibold"><Cell text={it.head} hidden={cover === "heads"} /></td>
                    {anyClue && <td className="py-1.5"><Cell text={it.clue} hidden={cover === "clues"} /></td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PearlsBlock pearls={pearls} />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip chip-warn">📖 Learn · logged as seen, not graded</span>
          <button className="btn btn-primary ml-auto" onClick={onNew}>{newLabel}</button>
        </div>
      </div>
    </div>
  );
}

type ClozeOutcome = "correct" | "missed";

/**
 * Cloze mode: category + clue shown, head blank. Type it (graded by the same
 * head matcher as every other mode) or Show it and self-rate. Records the
 * fraction of items credited — each item was individually recalled, so this
 * counts toward mastery like a graded recall.
 */
export function ClozeDrill({
  prompt, keyPoints, pearls, image, badge, seed, onRecord, onNew, newLabel, drillType, progressEntry, onSetManual,
}: LadderProps) {
  const grader = useGrader();
  const [order] = useState<LadderItem[]>(() => seededShuffle(ladderItems(keyPoints), `cloze:${seed}`));
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checking, setChecking] = useState(false);
  /** Outcome per item index once decided. */
  const [outcomes, setOutcomes] = useState<Record<number, ClozeOutcome>>({});
  /** The current item was revealed and awaits a self-rating. */
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);
  const recorded = useRef(false);

  const item = order[idx];
  const outcome = outcomes[idx];
  const total = order.length;
  const correct = Object.values(outcomes).filter((o) => o === "correct").length;

  const decide = (o: ClozeOutcome) => setOutcomes((prev) => ({ ...prev, [idx]: o }));

  const check = async () => {
    if (!answer.trim()) return;
    setChecking(true);
    try {
      const m = await grader(answer, [{ items: [item.item] }]);
      decide(m.has(item.item) ? "correct" : "missed");
    } finally {
      setChecking(false);
    }
  };

  const next = () => {
    if (idx + 1 < total) {
      setIdx(idx + 1);
      setAnswer("");
      setShown(false);
      return;
    }
    if (!recorded.current) {
      recorded.current = true;
      const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
      track("drill", { drillType, pct, mode: "cloze" });
      onRecord(pct);
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="space-y-3">
        <PromptCard prompt={prompt} badge={badge} />
        <div className="card p-4 space-y-3 pop-in">
          <div className="flex items-center justify-between gap-3">
            <div className="panel-label">Cloze summary</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] tabular-nums">{correct}/{total}</span>
              <ResultChip named={correct} total={total} />
            </div>
          </div>
          <ScoreBar named={correct} total={total} label="Items" />
          <DrillFigure image={image} />
          <ul className="space-y-1 text-[13px] leading-relaxed">
            {order.map((it, i) => (
              <li key={it.item} className="flex gap-2">
                <span aria-hidden="true">{outcomes[i] === "correct" ? "✓" : "✗"}</span>
                <span style={{ color: outcomes[i] === "correct" ? "var(--color-exam-ok)" : "var(--color-exam-danger)" }}>
                  <span className="font-semibold">{it.head}</span>
                  {it.clue && <span> — {it.clue}</span>}
                  <span className="hint"> · {it.group}</span>
                </span>
              </li>
            ))}
          </ul>
          <PearlsBlock pearls={pearls} />
          <MasteryControls entry={progressEntry} onSetManual={onSetManual} />
          <button className="btn btn-primary" onClick={onNew}>{newLabel}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PromptCard prompt={prompt} badge={badge} />
      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="panel-label">Item {idx + 1} of {total}</div>
          <span className="chip">{item.group}</span>
        </div>
        <p className="text-[14px] leading-relaxed">
          <span className="font-semibold">Clue: </span>
          {item.clue || "(no clue for this item — name it from the category)"}
        </p>
        {!outcome && !shown ? (
          <>
            <input
              className="input w-full"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") void check(); }}
              placeholder="Name it…"
              aria-label="Your answer"
              autoComplete="off"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <button className="btn btn-primary" onClick={check} disabled={!answer.trim() || checking}>
                {checking ? "Checking…" : "Check"}
              </button>
              <button type="button" className="btn btn-ghost py-1 px-2.5 text-[12px]" onClick={() => setShown(true)}>
                👁 Show answer
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2 pop-in">
            <p className="text-[14px] leading-relaxed">
              {outcome ? (
                <span className={outcome === "correct" ? "chip chip-ok" : "chip chip-danger"}>
                  {outcome === "correct" ? "✓ Correct" : "✗ Missed"}
                </span>
              ) : (
                <span className="chip chip-warn">👁 Shown</span>
              )}
              <span className="font-semibold ml-2">{item.head}</span>
            </p>
            {outcome ? (
              <button className="btn btn-primary" onClick={next}>{idx + 1 < total ? "Next item →" : "See summary →"}</button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hint">Did you know it?</span>
                <button className="btn" onClick={() => decide("correct")}>✓ Got it</button>
                <button className="btn btn-ghost" onClick={() => decide("missed")}>✗ Missed</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Sort mode: every head as a shuffled chip; tap a chip then a bucket (or a
 * bucket then chips). Check marks each placement; wrong chips return to the
 * pool so the student can fix them, but only the FIRST check is recorded.
 */
export function SortDrill({
  prompt, keyPoints, pearls, image, badge, seed, onRecord, onNew, newLabel, drillType, progressEntry, onSetManual,
}: LadderProps) {
  const [chips] = useState<LadderItem[]>(() => seededShuffle(ladderItems(keyPoints), `sort:${seed}`));
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [activeBucket, setActiveBucket] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const recorded = useRef(false);

  const groups = keyPoints.map((g) => g.group);
  const pool = chips.filter((c) => !placed[c.item]);
  const allPlaced = pool.length === 0;
  const correctCount = chips.filter((c) => placed[c.item] === c.group).length;

  const place = (item: string, group: string) => {
    setPlaced((p) => ({ ...p, [item]: group }));
    setSelected(null);
    setChecked(false);
  };
  const unplace = (item: string) => {
    setPlaced((p) => { const n = { ...p }; delete n[item]; return n; });
    setChecked(false);
  };
  const tapChip = (c: LadderItem) => {
    if (activeBucket) { place(c.item, activeBucket); return; }
    setSelected((s) => (s === c.item ? null : c.item));
  };
  const tapBucket = (group: string) => {
    if (selected) { place(selected, group); return; }
    setActiveBucket((b) => (b === group ? null : group));
  };

  const check = () => {
    const bad = new Set(chips.filter((c) => placed[c.item] !== c.group).map((c) => c.item));
    setWrong(bad);
    setChecked(true);
    if (!recorded.current) {
      recorded.current = true;
      const pct = chips.length > 0 ? Math.round((correctCount / chips.length) * 100) : 0;
      track("drill", { drillType, pct, mode: "sort" });
      onRecord(pct);
    }
    // wrong chips go back to the pool to be re-sorted
    setPlaced((p) => {
      const n = { ...p };
      for (const it of bad) delete n[it];
      return n;
    });
  };

  const chipButton = (c: LadderItem, inBucket: boolean) => {
    const isWrong = checked && wrong.has(c.item);
    const isRight = checked && inBucket && !wrong.has(c.item);
    return (
      <button
        key={c.item}
        type="button"
        className={`chip chip-btn ${isRight ? "chip-ok" : isWrong ? "chip-danger" : selected === c.item ? "chip-accent" : ""}`}
        aria-pressed={selected === c.item}
        onClick={() => (inBucket ? unplace(c.item) : tapChip(c))}
        title={inBucket ? "Tap to send back to the pool" : activeBucket ? `Place in ${activeBucket}` : "Tap, then tap a category"}
      >
        {isRight ? "✓ " : isWrong ? "✗ " : ""}{c.head}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <PromptCard prompt={prompt} badge={badge} />
      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="panel-label">Sort into categories</div>
          <span className="hint">
            {activeBucket ? `Placing into "${activeBucket}" — tap chips` : selected ? "Now tap a category" : "Tap a chip, then a category"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] rounded-lg border border-dashed p-2" style={{ borderColor: "var(--color-exam-border-strong)" }} aria-label="Unsorted items">
          {pool.length ? pool.map((c) => chipButton(c, false)) : <span className="hint">All placed — check your answers</span>}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {groups.map((g) => (
            <div
              key={g}
              className="rounded-lg border p-2 space-y-1.5"
              style={{ borderColor: activeBucket === g ? "var(--color-exam-accent)" : "var(--color-exam-border)" }}
            >
              <button
                type="button"
                className="btn w-full justify-between"
                aria-pressed={activeBucket === g}
                aria-label={`Place in ${g}`}
                onClick={() => tapBucket(g)}
              >
                <span className="font-semibold">{g}</span>
                <span className="hint">{chips.filter((c) => placed[c.item] === g).length}</span>
              </button>
              <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
                {chips.filter((c) => placed[c.item] === g).map((c) => chipButton(c, true))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="btn btn-primary" onClick={check} disabled={!allPlaced}>
            {checked ? "Check again" : "Check answers"}
          </button>
          {checked && (
            <>
              <span className="font-mono text-[12px] tabular-nums">{chips.length - wrong.size}/{chips.length}</span>
              <ResultChip named={chips.length - wrong.size} total={chips.length} />
            </>
          )}
          {checked && wrong.size > 0 && <span className="hint">Wrong ones are back in the pool — fix and re-check (first check is what's recorded)</span>}
        </div>
        {checked && wrong.size === 0 && (
          <div className="space-y-3 pop-in">
            <DrillFigure image={image} />
            <PearlsBlock pearls={pearls} />
            <MasteryControls entry={progressEntry} onSetManual={onSetManual} />
            <button className="btn btn-primary" onClick={onNew}>{newLabel}</button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Hint bar for Full recall. Each hint costs HINT_PENALTY_PCT off the recorded
 * score — enough to keep hints honest, small enough that using them never
 * makes the drill unpassable. Hints never name a head outright.
 */
export function HintBar({
  keyPoints, seed, hintsUsed, onHint,
}: {
  keyPoints: KeyGroup[];
  seed: string;
  hintsUsed: number;
  onHint: () => void;
}) {
  const [count, setCount] = useState(false);
  const [letters, setLetters] = useState(false);
  const [cluesShown, setCluesShown] = useState(0);
  const items = ladderItems(keyPoints);
  const clueOrder = seededShuffle(items.filter((i) => i.clue), `hint:${seed}`);
  const use = (fn: () => void) => { fn(); onHint(); };
  return (
    <div className="rounded-lg border p-2.5 space-y-2 text-[12px]" style={{ borderColor: "var(--color-exam-border)" }}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="panel-label">Hints</span>
        <button type="button" className="btn btn-ghost py-1 px-2.5 text-[12px]" disabled={count} onClick={() => use(() => setCount(true))}>
          🔢 How many
        </button>
        <button type="button" className="btn btn-ghost py-1 px-2.5 text-[12px]" disabled={letters} onClick={() => use(() => setLetters(true))}>
          🔤 First letters
        </button>
        <button
          type="button"
          className="btn btn-ghost py-1 px-2.5 text-[12px]"
          disabled={cluesShown >= clueOrder.length}
          onClick={() => use(() => setCluesShown((n) => n + 1))}
        >
          💡 A clue
        </button>
        <span className="hint ml-auto">
          −{HINT_PENALTY_PCT}% each{hintsUsed ? ` · ${hintsUsed} used` : ""}
        </span>
      </div>
      {count && (
        <div className="flex flex-wrap gap-1.5" aria-label="Item counts">
          {keyPoints.map((g) => (
            <span key={g.group} className="chip">{g.group}: {g.items.length}</span>
          ))}
        </div>
      )}
      {letters && (
        <div className="space-y-0.5" aria-label="First letters">
          {keyPoints.map((g) => (
            <div key={g.group}>
              <span className="font-semibold">{g.group}: </span>
              {firstLetters(g.items.map((it) => ladderItems([{ group: g.group, items: [it] }])[0].head)).join("  ")}
            </div>
          ))}
        </div>
      )}
      {cluesShown > 0 && (
        <ul className="list-disc pl-5 space-y-0.5" aria-label="Clues">
          {clueOrder.slice(0, cluesShown).map((it) => (
            <li key={it.item}><span className="font-semibold">{it.group}:</span> {it.clue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
