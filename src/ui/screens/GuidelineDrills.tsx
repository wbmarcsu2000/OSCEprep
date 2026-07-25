// src/ui/screens/GuidelineDrills.tsx
import { useMemo, useState } from "react";
import { Segmented } from "../components/Segmented";
import { DrillBrowser, GroupedCoverageDrill, SeenChip } from "../components/drillPrimitives";
import { CategoryRecallDrill, FlashcardDrill } from "../components/drillModes";
import { useDrillBankProgress } from "../useDrillBankProgress";
import { useAppStore } from "../store";
import { type DrillBank, drillsForDomain, drillCatalog } from "../../data/guidelineDrillBank";
import { summarizeDrillDomain } from "../../data/guidelineDrillProgress";
import { drillKey, isMastered, isSeen } from "../../data/drillProgressCore";

type DrillMode = "recall" | "category" | "flashcard";

const DRILL_MODES: { value: DrillMode; label: string }[] = [
  { value: "recall", label: "✍️ Full recall" },
  { value: "category", label: "🗂 By category" },
  { value: "flashcard", label: "🃏 Flashcard" },
];

/**
 * Bank-driven guideline drills. One drill = one guideline; the student does
 * cued grouped free-recall, graded by coverage against the guideline's key
 * facts (reusing GroupedCoverageDrill). Domain tabs, copy, drills, and the
 * progress storage key all come from the DrillBank descriptor (FM, OB/GYN, …).
 */
export function GuidelineDrills({ bank }: { bank: DrillBank }) {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const { progress, record, setManual } = useDrillBankProgress(bank.storageKey);

  const [domain, setDomain] = useState<string>(bank.domains[0].id);
  const [mode, setMode] = useState<DrillMode>("category");
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [graded, setGraded] = useState(false);
  const [browsing, setBrowsing] = useState(false);

  const pool = useMemo(() => drillsForDomain(bank, domain), [bank, domain]);
  const current = pool.length > 0 ? pool[idx % pool.length] : null;
  const activeEntry = current ? progress[drillKey(domain, current.id)] : undefined;
  const summary = useMemo(() => summarizeDrillDomain(bank, domain, progress), [bank, domain, progress]);

  const reset = () => {
    setAnswer("");
    setGraded(false);
  };

  const changeDomain = (d: string) => {
    setDomain(d);
    setIdx(0);
    reset();
  };

  const changeMode = (m: DrillMode) => {
    setMode(m);
    reset();
  };

  /** Next guideline: prefer unseen, then unmastered, else advance by one. */
  const nextProblem = () => {
    if (pool.length === 0) return;
    const cur = idx % pool.length;
    const order = [...pool.slice(cur + 1), ...pool.slice(0, cur + 1)];
    const unseen = order.find((d) => !isSeen(progress[drillKey(domain, d.id)]));
    const target =
      unseen ?? order.find((d) => !isMastered(progress[drillKey(domain, d.id)])) ?? order[0];
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
          <span className="icon-tile" style={{ background: bank.grad }} aria-hidden="true">{bank.icon}</span>
          <div className="space-y-0.5">
            <div className="panel-label">Learning tool</div>
            <h2 className="text-[24px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
              {bank.title}
            </h2>
            <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
              {bank.blurb}
            </p>
          </div>
        </div>
        <button className="btn btn-ghost shrink-0" onClick={exitToSelect}>Case list →</button>
      </div>

      <div className="card px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-3">
        <Segmented
          label="Guideline domain"
          options={bank.domains.map((d) => ({ value: d.id, label: `${d.emoji} ${d.label}` }))}
          value={domain}
          onChange={changeDomain}
        />
        {current && <span className="chip chip-accent">{current.name} · {current.org}</span>}
        <button className="btn ml-auto" onClick={nextProblem} title="Prefers a guideline you haven't mastered yet">
          ➜ Next guideline
        </button>
      </div>

      <div className="card px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="panel-label">Mode</span>
        <Segmented label="Drill mode" options={DRILL_MODES} value={mode} onChange={changeMode} />
        <span className="hint ml-auto">
          {mode === "recall"
            ? "Recall everything at once"
            : mode === "category"
              ? "One category at a time"
              : "Flip & self-rate — no typing"}
        </span>
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
          items={drillCatalog(bank, domain)}
          keyOf={(id) => drillKey(domain, id)}
          progress={progress}
          currentId={current?.id ?? null}
          onPick={goToProblem}
        />
      )}

      {current ? (
        mode === "flashcard" ? (
          <FlashcardDrill
            key={`flashcard:${domain}:${current.id}`}
            prompt={current.prompt}
            keyPoints={current.keyPoints}
            pearls={current.pearls}
            badge={current.org}
            onRecord={(pct) => record(domain, current.id, pct)}
            onNew={nextProblem}
            drillType={`${bank.id}-${domain}`}
          />
        ) : mode === "category" ? (
          <CategoryRecallDrill
            key={`category:${domain}:${current.id}`}
            prompt={current.prompt}
            keyPoints={current.keyPoints}
            pearls={current.pearls}
            badge={current.org}
            onRecord={(pct) => record(domain, current.id, pct)}
            onNew={nextProblem}
            progressEntry={activeEntry}
            onSetManual={(m) => setManual(domain, current.id, m)}
            newLabel="Next guideline →"
            drillType={`${bank.id}-${domain}`}
          />
        ) : (
          <GroupedCoverageDrill
            key={`recall:${domain}:${current.id}`}
            prompt={current.prompt}
            keyPoints={current.keyPoints}
            pearls={current.pearls}
            badge={current.org}
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
            drillType={`${bank.id}-${domain}`}
          />
        )
      ) : (
        <div className="card p-4"><p className="muted text-center">No guidelines in this domain yet.</p></div>
      )}

      <p className="hint text-center">
        {mode === "flashcard"
          ? "Flashcard mode — flip and rate yourself; no grading."
          : llmEnabled
            ? "Graded semantically by AI — use the guideline card to self-check anything it misses."
            : "Graded by lenient keyword match — enable AI for smarter grading. Use the guideline card to self-check anything it misses."}
      </p>
    </div>
  );
}
