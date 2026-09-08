import { useState } from "react";
import { track } from "../../analytics/telemetry";
import type { DrillProgress, DrillManual } from "../../data/drillProgressCore";
import {
  useGrader,
  buildCoverage,
  CoverageView,
  ScoreBar,
  ResultChip,
  MasteryControls,
  DrillFigure,
} from "./drillPrimitives";

/** Shared shape for the alternate drill interaction modes. All run off the same
 *  grouped `keyPoints` and feed the same progress store as GroupedCoverageDrill. */
interface ModeProps {
  prompt: string;
  keyPoints: { group: string; items: string[] }[];
  pearls?: string;
  /** Teaching figure — shown only with the reveal, never beside the prompt. */
  image?: { file: string; alt: string; credit: string };
  badge?: string;
  onRecord: (pct: number) => void;
  onNew: () => void;
  progressEntry?: DrillProgress;
  onSetManual: (m: DrillManual) => void;
  newLabel: string;
  drillType: string;
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

/** By-category mode: recall one group at a time, grade each, then a combined
 *  summary. Records the OVERALL coverage % so mastery matches full recall.
 *  Per-category answers and grades are kept, so the student can step back to
 *  a finished category, and either reveal can be backed out of. */
export function CategoryRecallDrill({
  prompt,
  keyPoints,
  pearls,
  image,
  badge,
  onRecord,
  onNew,
  progressEntry,
  onSetManual,
  newLabel,
  drillType,
}: ModeProps) {
  const grader = useGrader();
  const groups = keyPoints.map((g) => ({ group: g.group, items: g.items }));
  const [catIdx, setCatIdx] = useState(0);
  /** One draft per category, so going back never loses what was typed. */
  const [answers, setAnswers] = useState<string[]>(() => groups.map(() => ""));
  const [grading, setGrading] = useState(false);
  /** Categories already graded (or revealed) — shown in their result state. */
  const [gradedCats, setGradedCats] = useState<Set<number>>(new Set());
  /** Categories shown without grading — nothing credited. */
  const [revealedCats, setRevealedCats] = useState<Set<number>>(new Set());
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);
  /** The overall % is recorded once per drill, even if the summary is revisited. */
  const [recorded, setRecorded] = useState(false);
  /** Whole answer flow shown at once; logged as seen, never graded. */
  const [flowRevealed, setFlowRevealed] = useState(false);

  const group = groups[catIdx];
  const isLast = catIdx === groups.length - 1;
  const answer = answers[catIdx];
  const catGraded = gradedCats.has(catIdx);
  const catRevealed = revealedCats.has(catIdx);

  const setAnswer = (v: string) =>
    setAnswers((prev) => prev.map((a, i) => (i === catIdx ? v : a)));
  const withIdx = (set: Set<number>, add: boolean) => {
    const next = new Set(set);
    if (add) next.add(catIdx);
    else next.delete(catIdx);
    return next;
  };

  const gradeCat = async () => {
    setGrading(true);
    try {
      const m = await grader(answer, [group]);
      setMatched((prev) => new Set([...prev, ...m]));
      setGradedCats((prev) => withIdx(prev, true));
    } finally {
      setGrading(false);
    }
  };

  /** Show this category's key points without grading; none are credited. */
  const revealCat = () => {
    track("drill", { drillType, pct: 0, revealed: true, mode: "category" });
    setRevealedCats((prev) => withIdx(prev, true));
    setGradedCats((prev) => withIdx(prev, true));
  };

  /** Back out of a category reveal — the box is editable again, draft intact. */
  const unrevealCat = () => {
    setRevealedCats((prev) => withIdx(prev, false));
    setGradedCats((prev) => withIdx(prev, false));
  };

  /** Show the entire answer flow in order. Logged as an attempt so the drill
   *  counts as "seen"; bestPct is unchanged, so revealing never grants mastery. */
  const revealFlow = () => {
    track("drill", { drillType, pct: 0, revealed: true, mode: "flow" });
    onRecord(0);
    setFlowRevealed(true);
  };

  const advance = () => {
    if (!isLast) {
      setCatIdx((i) => i + 1);
      return;
    }
    if (!recorded) {
      const r = buildCoverage(groups, matched);
      const pct = r.total > 0 ? Math.round((r.named / r.total) * 100) : 0;
      track("drill", { drillType, pct, mode: "category" });
      onRecord(pct);
      setRecorded(true);
    }
    setDone(true);
  };

  const overall = buildCoverage(groups, matched);
  const catCoverage = buildCoverage([group], matched);

  if (flowRevealed) {
    return (
      <div className="space-y-3">
        <PromptCard prompt={prompt} badge={badge} />
        <div className="card p-4 space-y-3 pop-in">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="panel-label">Answer flow</div>
            <span className="chip chip-warn">👁 Revealed · logged as seen</span>
          </div>
          <DrillFigure image={image} />
          <ol className="space-y-3">
            {keyPoints.map((g, i) => (
              <li key={g.group} className="flex gap-3">
                <span
                  className="shrink-0 w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center"
                  style={{ background: "var(--color-exam-accent)", color: "#fff" }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold mb-0.5">{g.group}</div>
                  <ul className="list-disc pl-5 space-y-0.5 text-[13px] leading-relaxed">
                    {g.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
          <PearlsBlock pearls={pearls} />
          <MasteryControls entry={progressEntry} onSetManual={onSetManual} />
          <div className="flex items-center gap-2 flex-wrap">
            <button className="btn" onClick={() => setFlowRevealed(false)} title="Return to where you were">
              ← Back
            </button>
            <button className="btn btn-primary" onClick={onNew}>{newLabel}</button>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-3">
        <div className="card p-4 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="panel-label">Summary · all categories</div>
            <ResultChip named={overall.named} total={overall.total} />
          </div>
          <DrillFigure image={image} />
          <ScoreBar named={overall.named} total={overall.total} label="Key points" />
        </div>
        <div className="card p-4 space-y-3 pop-in">
          <CoverageView title="Guideline key points" coverage={overall.coverage} />
          <PearlsBlock pearls={pearls} />
          <MasteryControls entry={progressEntry} onSetManual={onSetManual} />
          <div className="flex items-center gap-2 flex-wrap">
            <button className="btn" onClick={() => setDone(false)} title="Step back through the categories">
              ← Back
            </button>
            <button className="btn btn-primary" onClick={onNew}>{newLabel}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PromptCard prompt={prompt} badge={badge} />
      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="panel-label">Category {catIdx + 1} of {groups.length}</div>
          <div className="flex items-center gap-1" aria-label="Category progress">
            {groups.map((g, i) => (
              <span
                key={g.group}
                className="inline-block rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: gradedCats.has(i)
                    ? "var(--color-exam-accent)"
                    : "var(--color-exam-border-strong)",
                }}
              />
            ))}
          </div>
        </div>
        <div className="text-[15px] font-semibold">{group.group}</div>
        <textarea
          className="input w-full resize-y leading-relaxed"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={`Recall the "${group.group}" facts…`}
          aria-label="Your recall"
          disabled={catGraded}
        />
        {!catGraded ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {catIdx > 0 && (
                <button className="btn" onClick={() => setCatIdx((i) => i - 1)}>
                  ← Previous category
                </button>
              )}
              <button className="btn btn-primary" onClick={gradeCat} disabled={!answer.trim() || grading}>
                {grading ? "Grading…" : "Grade this category"}
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap border-t pt-2" style={{ borderColor: "var(--color-exam-border)" }}>
              <span className="panel-label">Reveal</span>
              <button type="button" className="btn btn-ghost py-1 px-2.5 text-[12px]" onClick={revealCat}>
                👁 This category
              </button>
              <button type="button" className="btn btn-ghost py-1 px-2.5 text-[12px]" onClick={revealFlow}>
                👁 Entire answer flow
              </button>
              <span className="hint">Revealed points are not credited</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {catRevealed ? (
              <span className="chip chip-warn">👁 Revealed · not credited</span>
            ) : (
              <ResultChip named={catCoverage.named} total={catCoverage.total} />
            )}
            <CoverageView title={group.group} coverage={catCoverage.coverage} />
            <div className="flex items-center gap-2 flex-wrap">
              {catRevealed ? (
                <button className="btn" onClick={unrevealCat} title="Hide the answer and try this category">
                  ← Back
                </button>
              ) : (
                catIdx > 0 && (
                  <button className="btn" onClick={() => setCatIdx((i) => i - 1)}>
                    ← Previous category
                  </button>
                )
              )}
              <button className="btn btn-primary" onClick={advance}>
                {isLast ? "See summary →" : "Next category →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Flashcard mode: no typing. Read the prompt, flip to the answer, self-rate.
 *  "Got it" records 100 (mastered), "Missed" records 0 (seen); then advances. */
export function FlashcardDrill({
  prompt,
  keyPoints,
  pearls,
  image,
  badge,
  onRecord,
  onNew,
  drillType,
}: Pick<ModeProps, "prompt" | "keyPoints" | "pearls" | "badge" | "onRecord" | "onNew" | "drillType" | "image">) {
  const [flipped, setFlipped] = useState(false);

  const rate = (got: boolean) => {
    track("drill", { drillType, pct: got ? 100 : 0, mode: "flashcard" });
    onRecord(got ? 100 : 0);
    onNew();
  };

  return (
    <div className="space-y-3">
      <PromptCard prompt={prompt} badge={badge} />
      {!flipped ? (
        <button
          type="button"
          onClick={() => setFlipped(true)}
          className="card p-6 w-full text-center pop-in"
          style={{ borderStyle: "dashed" }}
        >
          <div className="text-[13px] font-semibold" style={{ color: "var(--color-exam-muted)" }}>
            Recall the guideline in your head, then…
          </div>
          <div className="text-[16px] font-extrabold mt-1">👆 Tap to flip</div>
        </button>
      ) : (
        <div className="card p-4 space-y-3 pop-in">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="panel-label">Answer</div>
            <span className="chip">🃏 How did you do?</span>
          </div>
          <DrillFigure image={image} />
          <div className="space-y-2.5">
            {keyPoints.map((g) => (
              <div key={g.group}>
                <div className="panel-label mb-0.5">{g.group}</div>
                <ul className="list-disc pl-5 space-y-0.5 text-[13px] leading-relaxed">
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <PearlsBlock pearls={pearls} />
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={() => rate(true)}>✓ Got it</button>
            <button className="btn btn-ghost" onClick={() => rate(false)}>✗ Missed</button>
          </div>
        </div>
      )}
    </div>
  );
}
