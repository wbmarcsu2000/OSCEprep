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
} from "./drillPrimitives";

/** Shared shape for the alternate drill interaction modes. All run off the same
 *  grouped `keyPoints` and feed the same progress store as GroupedCoverageDrill. */
interface ModeProps {
  prompt: string;
  keyPoints: { group: string; items: string[] }[];
  pearls?: string;
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
      <p className="text-[15px] font-semibold leading-relaxed mt-1">{prompt}</p>
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
 *  summary. Records the OVERALL coverage % so mastery matches full recall. */
export function CategoryRecallDrill({
  prompt,
  keyPoints,
  pearls,
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
  const [answer, setAnswer] = useState("");
  const [grading, setGrading] = useState(false);
  const [catGraded, setCatGraded] = useState(false);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const group = groups[catIdx];
  const isLast = catIdx === groups.length - 1;

  const gradeCat = async () => {
    setGrading(true);
    try {
      const m = await grader(answer, [group]);
      setMatched((prev) => new Set([...prev, ...m]));
      setCatGraded(true);
    } finally {
      setGrading(false);
    }
  };

  const advance = () => {
    if (!isLast) {
      setCatIdx((i) => i + 1);
      setAnswer("");
      setCatGraded(false);
      return;
    }
    const r = buildCoverage(groups, matched);
    const pct = r.total > 0 ? Math.round((r.named / r.total) * 100) : 0;
    track("drill", { drillType, pct, mode: "category" });
    onRecord(pct);
    setDone(true);
  };

  const overall = buildCoverage(groups, matched);
  const catCoverage = buildCoverage([group], matched);

  if (done) {
    return (
      <div className="space-y-3">
        <div className="card p-4 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="panel-label">Summary · all categories</div>
            <ResultChip named={overall.named} total={overall.total} />
          </div>
          <ScoreBar named={overall.named} total={overall.total} label="Key points" />
        </div>
        <div className="card p-4 space-y-3 pop-in">
          <CoverageView title="Guideline key points" coverage={overall.coverage} />
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
          <div className="panel-label">Category {catIdx + 1} of {groups.length}</div>
          <div className="flex items-center gap-1" aria-label="Category progress">
            {groups.map((g, i) => (
              <span
                key={g.group}
                className="inline-block rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background:
                    i < catIdx || (i === catIdx && catGraded)
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
          <button className="btn btn-primary" onClick={gradeCat} disabled={!answer.trim() || grading}>
            {grading ? "Grading…" : "Grade this category"}
          </button>
        ) : (
          <div className="space-y-3">
            <ResultChip named={catCoverage.named} total={catCoverage.total} />
            <CoverageView title={group.group} coverage={catCoverage.coverage} />
            <button className="btn btn-primary" onClick={advance}>
              {isLast ? "See summary →" : "Next category →"}
            </button>
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
  badge,
  onRecord,
  onNew,
  drillType,
}: Pick<ModeProps, "prompt" | "keyPoints" | "pearls" | "badge" | "onRecord" | "onNew" | "drillType">) {
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
