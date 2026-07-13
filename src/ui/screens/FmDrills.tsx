import { useMemo, useState } from "react";
import { Segmented } from "../components/Segmented";
import { DrillBrowser, GroupedCoverageDrill, SeenChip } from "../components/drillPrimitives";
import { useFmDrillProgress } from "../useFmDrillProgress";
import { useAppStore } from "../store";
import {
  FM_DOMAIN_ORDER,
  FM_DOMAIN_LABELS,
  FM_DOMAIN_EMOJI,
  fmDrillsForDomain,
  fmDrillCatalog,
  type FmDrillDomain,
} from "../../data/fmGuidelineDrills";
import { fmDrillKey, fmSummarize } from "../../data/fmDrillProgress";
import { isMastered, isSeen } from "../../data/drillProgressCore";

/**
 * Family Medicine guideline drills. One drill = one guideline; the student does
 * cued grouped free-recall, graded by coverage against the guideline's key
 * facts (reusing GroupedCoverageDrill). Three domain tabs: Screening,
 * Immunizations, Chronic Disease. Progress is FM-specific (osce.fmdrills.v1).
 */
export function FmDrills() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const { progress, record, setManual } = useFmDrillProgress();

  const [domain, setDomain] = useState<FmDrillDomain>("screening");
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [graded, setGraded] = useState(false);
  const [browsing, setBrowsing] = useState(false);

  const pool = useMemo(() => fmDrillsForDomain(domain), [domain]);
  const current = pool.length > 0 ? pool[idx % pool.length] : null;
  const activeEntry = current ? progress[fmDrillKey(domain, current.id)] : undefined;
  const summary = useMemo(() => fmSummarize(domain, progress), [domain, progress]);

  const reset = () => {
    setAnswer("");
    setGraded(false);
  };

  const changeDomain = (d: FmDrillDomain) => {
    setDomain(d);
    setIdx(0);
    reset();
  };

  /** Next guideline: prefer unseen, then unmastered, else advance by one. */
  const nextProblem = () => {
    if (pool.length === 0) return;
    const cur = idx % pool.length;
    const order = [...pool.slice(cur + 1), ...pool.slice(0, cur + 1)];
    const unseen = order.find((d) => !isSeen(progress[fmDrillKey(domain, d.id)]));
    const target =
      unseen ?? order.find((d) => !isMastered(progress[fmDrillKey(domain, d.id)])) ?? order[0];
    setIdx(pool.findIndex((d) => d.id === target.id));
    reset();
  };

  const goToProblem = (id: string) => {
    const i = pool.findIndex((d) => d.id === id);
    if (i >= 0) setIdx(i);
    setBrowsing(false);
    reset();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <span className="icon-tile" style={{ background: "var(--grad-teal)" }} aria-hidden="true">🎯</span>
          <div className="space-y-0.5">
            <div className="panel-label">Learning tool</div>
            <h2 className="text-[24px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
              Guideline Drills
            </h2>
            <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
              Master one guideline at a time — recall its key facts, graded instantly. Screening,
              immunizations, and chronic-disease management for the Family Medicine shelf.
            </p>
          </div>
        </div>
        <button className="btn btn-ghost shrink-0" onClick={exitToSelect}>Case list →</button>
      </div>

      <div className="card px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-3">
        <Segmented
          label="Guideline domain"
          options={FM_DOMAIN_ORDER.map((d) => ({ value: d, label: `${FM_DOMAIN_EMOJI[d]} ${FM_DOMAIN_LABELS[d]}` }))}
          value={domain}
          onChange={changeDomain}
        />
        {current && <span className="chip chip-accent">{current.name} · {current.org}</span>}
        <button className="btn ml-auto" onClick={nextProblem} title="Prefers a guideline you haven't mastered yet">
          ➜ Next guideline
        </button>
      </div>

      <div className="card px-4 py-2.5 flex items-center gap-2 flex-wrap text-[13px]">
        <span className="panel-label">Progress</span>
        <span className="font-semibold" style={{ color: "var(--color-exam-muted)" }}>
          Seen {summary.seen}/{summary.total} · {summary.mastered} mastered
          {summary.needsWork ? ` · ${summary.needsWork} to review` : ""}
          {summary.seen ? ` · avg ${summary.avgBestPct}%` : ""}
        </span>
        <SeenChip entry={activeEntry} />
        <button className="btn btn-ghost ml-auto py-1 px-2.5 text-[12px]" onClick={() => setBrowsing((b) => !b)}>
          {browsing ? "Hide list" : `📋 Browse all (${summary.total})`}
        </button>
      </div>

      {browsing && (
        <DrillBrowser
          items={fmDrillCatalog(domain)}
          keyOf={(id) => fmDrillKey(domain, id)}
          progress={progress}
          currentId={current?.id ?? null}
          onPick={goToProblem}
        />
      )}

      {current ? (
        <GroupedCoverageDrill
          key={`${domain}:${current.id}`}
          prompt={current.prompt}
          keyPoints={current.keyPoints}
          pearls={current.pearls}
          badge={`${current.org}`}
          answer={answer}
          setAnswer={setAnswer}
          graded={graded}
          onGrade={() => setGraded(true)}
          onNew={nextProblem}
          onRetry={() => setGraded(false)}
          onRecord={(pct) => record(domain, current.id, pct)}
          progressEntry={activeEntry}
          onSetManual={(m) => setManual(domain, current.id, m)}
          newLabel="Next guideline →"
          drillType={`fm-${domain}`}
        />
      ) : (
        <div className="card p-4"><p className="muted text-center">No guidelines in this domain yet.</p></div>
      )}

      <p className="hint text-center">
        {llmEnabled
          ? "Graded semantically by AI — use the guideline card to self-check anything it misses."
          : "Graded by lenient keyword match — enable AI for smarter grading. Use the guideline card to self-check anything it misses."}
      </p>
    </div>
  );
}
