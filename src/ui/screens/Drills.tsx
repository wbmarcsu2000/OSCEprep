import { useEffect, useMemo, useState } from "react";
import { CURRICULUM, type CategoryCurriculum, type PracticeCase } from "../../data/curriculum";
import { SKILL_DRILLS, SKILL_DRILL_TYPES, type SkillDrillProblem } from "../../data/skillDrills";
import { MANAGEMENT_DRILLS, type ManagementDrillProblem } from "../../data/managementDrills";
import { track } from "../../analytics/telemetry";
import { useAppStore } from "../store";
import { ManualRefs } from "../components/ManualRefs";
import { Segmented } from "../components/Segmented";
import { VisualGuide } from "../components/VisualGuide";

/**
 * Standalone learning drills (no full case). Get reps on the frameworks:
 *  - Differential & history: given a chief complaint, write the broad
 *    differential + key questions; graded vs the buckets/themes.
 *  - Work-up: write the work-up, then enter how the results steer you.
 *  - Management: given the scenario + working diagnosis, write the management
 *    plan; graded against the case's expected actions (one drill per case).
 *  - Skills: ABG/acid-base, SAAG, pleural fluid, PFT problems with answers and
 *    full worked explanations.
 * Grading is semantic (AI) when a key is set, else a lenient keyword match —
 * both via the store's gradeCoverage so the same call works everywhere.
 */
type DrillType = "differential" | "workup" | "management" | "skills";

interface Coverage {
  group: string;
  items: { item: string; covered: boolean }[];
}

/** Build coverage display from a set of matched item strings. */
function buildCoverage(
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
function useGrader() {
  const grade = useAppStore((s) => s.gradeCoverage);
  return async (answer: string, groups: { items: string[] }[]): Promise<Set<string>> => {
    const items = groups.flatMap((g) => g.items);
    const matched = await grade(answer, items);
    return new Set(matched);
  };
}

export function Drills() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const [type, setType] = useState<DrillType>("differential");
  const [categoryName, setCategoryName] = useState(CURRICULUM[0].category);
  const [skillFilter, setSkillFilter] = useState<string>("All");
  const [stemIdx, setStemIdx] = useState(0);
  const [ddx, setDdx] = useState("");
  const [questions, setQuestions] = useState("");
  const [workup, setWorkup] = useState("");
  const [managementAnswer, setManagementAnswer] = useState("");
  const [skillAnswer, setSkillAnswer] = useState("");
  const [graded, setGraded] = useState(false);

  const category = useMemo(
    () => CURRICULUM.find((c) => c.category === categoryName)!,
    [categoryName],
  );
  // Work-up drills use a worked-case vignette as the "given info" stem.
  const stem: PracticeCase | null =
    type === "workup" && category.practiceCases.length > 0
      ? category.practiceCases[stemIdx % category.practiceCases.length]
      : null;

  // Skills drill: filtered problem pool, rotated by stemIdx.
  const skillPool = useMemo(
    () => (skillFilter === "All" ? SKILL_DRILLS : SKILL_DRILLS.filter((p) => p.skill === skillFilter)),
    [skillFilter],
  );
  const skillProblem: SkillDrillProblem | null =
    type === "skills" && skillPool.length > 0 ? skillPool[stemIdx % skillPool.length] : null;

  // Management drills: one per case, filtered to the selected complaint and
  // rotated by stemIdx.
  const managementPool = useMemo(
    () => MANAGEMENT_DRILLS.filter((p) => p.category === categoryName),
    [categoryName],
  );
  const managementProblem: ManagementDrillProblem | null =
    type === "management" && managementPool.length > 0
      ? managementPool[stemIdx % managementPool.length]
      : null;

  const reset = () => {
    setDdx("");
    setQuestions("");
    setWorkup("");
    setManagementAnswer("");
    setSkillAnswer("");
    setGraded(false);
  };

  const newRep = (nextType: DrillType, nextCat?: string) => {
    setType(nextType);
    if (nextCat) setCategoryName(nextCat);
    // rotate the work-up stem each rep
    setStemIdx((i) => i + 1);
    reset();
  };

  /** Cycle to the next curriculum category so "New rep" serves a fresh prompt
   *  instead of re-serving the one just graded. */
  const nextCategory = () => {
    const idx = CURRICULUM.findIndex((c) => c.category === categoryName);
    return CURRICULUM[(idx + 1) % CURRICULUM.length].category;
  };

  /** Re-attempt the same prompt: keep the typed answer, just re-open grading. */
  const retry = () => setGraded(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <span className="icon-tile" style={{ background: "var(--grad-teal)" }} aria-hidden="true">
            🎯
          </span>
          <div className="space-y-0.5">
            <div className="panel-label">Learning tool</div>
            <h2
              className="text-[24px] font-extrabold tracking-tight"
              style={{ color: "var(--color-exam-header)" }}
            >
              Framework Drills
            </h2>
            <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
              Quick reps on the differential, key questions, work-up, and management — no full
              station. Graded instantly against the category framework.
            </p>
          </div>
        </div>
        <button className="btn btn-ghost shrink-0" onClick={exitToSelect}>
          Case list →
        </button>
      </div>

      <div className="card px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Segmented
          label="Drill type"
          options={[
            { value: "differential", label: "🧠 Differential" },
            { value: "workup", label: "🧪 Work-up" },
            { value: "management", label: "🩺 Management" },
            { value: "skills", label: "📐 Skills" },
          ]}
          value={type}
          onChange={(t: DrillType) => {
            setType(t);
            reset();
          }}
        />
        {type === "skills" ? (
          <label className="text-sm flex items-center gap-2">
            <span className="panel-label">Skill</span>
            <select
              className="input text-[13px] py-1.5"
              value={skillFilter}
              onChange={(e) => {
                setSkillFilter(e.target.value);
                reset();
              }}
              aria-label="Skill"
            >
              <option>All</option>
              {SKILL_DRILL_TYPES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        ) : (
          <label className="text-sm flex items-center gap-2">
            <span className="panel-label">Complaint</span>
            <select
              className="input text-[13px] py-1.5"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                reset();
              }}
              aria-label="Chief complaint"
            >
              {CURRICULUM.map((c) => (
                <option key={c.category}>{c.category}</option>
              ))}
            </select>
          </label>
        )}
        <button
          className="btn ml-auto"
          onClick={() => {
            // Skills + management rotate within the current filter; differential
            // and work-up jump to a random complaint for variety.
            if (type === "skills" || type === "management") newRep(type);
            else newRep(type, CURRICULUM[(Date.now() >>> 0) % CURRICULUM.length].category);
          }}
        >
          🎲 {type === "skills" ? "Next problem" : type === "management" ? "Next case" : "Random rep"}
        </button>
      </div>

      {type === "differential" && (
        <DifferentialDrill
          key={categoryName}
          category={category}
          ddx={ddx}
          setDdx={setDdx}
          questions={questions}
          setQuestions={setQuestions}
          graded={graded}
          onGrade={() => setGraded(true)}
          onNew={() => newRep("differential", nextCategory())}
          onRetry={retry}
        />
      )}
      {type === "workup" && (
        <WorkupDrill
          key={`${categoryName}:${stemIdx}`}
          category={category}
          stem={stem}
          workup={workup}
          setWorkup={setWorkup}
          graded={graded}
          onGrade={() => setGraded(true)}
          onNew={() => newRep("workup", nextCategory())}
          onRetry={retry}
        />
      )}
      {type === "management" && (
        <ManagementDrill
          key={`${categoryName}:${stemIdx}`}
          problem={managementProblem}
          answer={managementAnswer}
          setAnswer={setManagementAnswer}
          graded={graded}
          onGrade={() => setGraded(true)}
          onNew={() => newRep("management")}
          onRetry={retry}
        />
      )}
      {type === "skills" && (
        <SkillDrill
          key={`${skillFilter}:${stemIdx}`}
          problem={skillProblem}
          answer={skillAnswer}
          setAnswer={setSkillAnswer}
          graded={graded}
          onGrade={() => setGraded(true)}
          onNew={() => newRep("skills")}
          onRetry={retry}
        />
      )}

      <p className="hint text-center">
        {llmEnabled
          ? "Graded semantically by AI — use the framework/explanation to self-check anything it misses."
          : "Graded by lenient keyword match — enable AI for semantic grading. A thorough answer phrased differently may not register every item; use the framework/explanation to self-check."}
      </p>
    </div>
  );
}

function ScoreBar({ named, total, label }: { named: number; total: number; label: string }) {
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
function ResultChip({ named, total }: { named: number; total: number }) {
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
function AiCoachNote({
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

function CoverageView({ title, coverage }: { title: string; coverage: Coverage[] }) {
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

function GradeButton({
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

function DifferentialDrill({
  category,
  ddx,
  setDdx,
  questions,
  setQuestions,
  graded,
  onGrade,
  onNew,
  onRetry,
}: {
  category: CategoryCurriculum;
  ddx: string;
  setDdx: (v: string) => void;
  questions: string;
  setQuestions: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [ddxMatched, setDdxMatched] = useState<Set<string>>(new Set());
  const [qMatched, setQMatched] = useState<Set<string>>(new Set());

  const ddxGroups = category.differential.map((g) => ({ group: g.group, items: g.items }));
  const qGroups = category.keyQuestions.map((q) => ({ group: q.theme, items: q.questions }));

  const doGrade = async () => {
    setGrading(true);
    track("drill", { drillType: "differential" });
    try {
      const [d, q] = await Promise.all([grader(ddx, ddxGroups), grader(questions, qGroups)]);
      setDdxMatched(d);
      setQMatched(q);
      onGrade();
    } finally {
      setGrading(false);
    }
  };

  const ddxResult = buildCoverage(ddxGroups, ddxMatched);
  const qResult = buildCoverage(qGroups, qMatched);

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <div className="panel-label mb-1">Prompt</div>
        <p className="text-[15px] font-semibold">
          A patient presents with{" "}
          <span style={{ color: "var(--color-exam-accent-deep)" }}>{category.category.toLowerCase()}</span>.
        </p>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--color-exam-muted)" }}>
          Write your broad differential (by buckets) and the key questions you'd ask.
        </p>
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <div className="panel-label mb-1.5">Your differential</div>
          <textarea
            className="input w-full resize-y leading-relaxed"
            rows={4}
            value={ddx}
            onChange={(e) => setDdx(e.target.value)}
            placeholder="List as many plausible causes as you can, ideally grouped…"
            aria-label="Your differential"
          />
        </div>
        <div>
          <div className="panel-label mb-1.5">Key questions you'd ask</div>
          <textarea
            className="input w-full resize-y leading-relaxed"
            rows={4}
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Onset, character, risk factors, red flags…"
            aria-label="Key questions"
          />
        </div>
        <GradeButton
          graded={graded}
          grading={grading}
          disabled={!ddx.trim() && !questions.trim()}
          onGrade={doGrade}
          onNew={onNew}
          onRetry={onRetry}
          newLabel="New rep →"
        />
      </div>

      {graded && (
        <div className="card p-4 space-y-4 pop-in">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="panel-label">Coverage</div>
              <ResultChip
                named={ddxResult.named + qResult.named}
                total={ddxResult.total + qResult.total}
              />
            </div>
            <ScoreBar named={ddxResult.named} total={ddxResult.total} label="Differential coverage" />
            <ScoreBar named={qResult.named} total={qResult.total} label="Key-question coverage" />
          </div>
          <CoverageView title="Broad differential" coverage={ddxResult.coverage} />
          <CoverageView title="Key questions" coverage={qResult.coverage} />
          <div>
            <div className="panel-label mb-1">Schema</div>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
              {category.framework} {category.strategy}
            </p>
          </div>
          <VisualGuide category={category.category} view="differential" open />
          <ManualRefs manual={category.manual} compact />
        </div>
      )}
    </div>
  );
}

function SkillDrill({
  problem,
  answer,
  setAnswer,
  graded,
  onGrade,
  onNew,
  onRetry,
}: {
  problem: SkillDrillProblem | null;
  answer: string;
  setAnswer: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  if (!problem) return null;
  const groups = [{ group: problem.skill, items: problem.answer }];

  const doGrade = async () => {
    setGrading(true);
    track("drill", { drillType: "skills" });
    try {
      setMatched(await grader(answer, groups));
      onGrade();
    } finally {
      setGrading(false);
    }
  };

  const result = buildCoverage(groups, matched);
  return (
    <div className="space-y-3">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="panel-label">{problem.skill}</div>
          <span className="chip chip-accent">interpretation drill</span>
        </div>
        <p className="text-[15px] font-semibold leading-relaxed mt-1 font-mono">{problem.stem}</p>
      </div>

      <div className="card p-4 space-y-3">
        <textarea
          className="input w-full resize-y leading-relaxed"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your interpretation — name the disturbance/pattern, do the math, and give a cause…"
          aria-label="Your interpretation"
        />
        <GradeButton
          graded={graded}
          grading={grading}
          disabled={!answer.trim()}
          onGrade={doGrade}
          onNew={onNew}
          onRetry={onRetry}
          newLabel="Next problem →"
        />
      </div>

      {graded && (
        <div className="card p-4 space-y-4 pop-in">
          <div className="flex items-center justify-between gap-3">
            <div className="panel-label">Coverage</div>
            <ResultChip named={result.named} total={result.total} />
          </div>
          <ScoreBar named={result.named} total={result.total} label="Key concepts" />
          <CoverageView title="Expected concepts" coverage={result.coverage} />
          <div>
            <div className="panel-label mb-1">Worked explanation</div>
            <p
              className="rounded-lg border p-3 text-[13px] leading-relaxed"
              style={{ borderColor: "var(--color-exam-ok-line)", background: "var(--color-exam-ok-soft)" }}
            >
              {problem.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkupDrill({
  category,
  stem,
  workup,
  setWorkup,
  graded,
  onGrade,
  onNew,
  onRetry,
}: {
  category: CategoryCurriculum;
  stem: PracticeCase | null;
  workup: string;
  setWorkup: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  // Interactive "results steer you" follow-up.
  const [steer, setSteer] = useState("");
  const [steerGraded, setSteerGraded] = useState(false);
  const [steerGrading, setSteerGrading] = useState(false);
  const [steerMatched, setSteerMatched] = useState<Set<string>>(new Set());

  const groups = [
    { group: "Labs", items: category.workupMenu.labs.map((l) => l.test) },
    { group: "Imaging & other", items: category.workupMenu.imaging.map((i) => i.test) },
  ];

  const doGrade = async () => {
    setGrading(true);
    track("drill", { drillType: "workup" });
    try {
      setMatched(await grader(workup, groups));
      onGrade();
    } finally {
      setGrading(false);
    }
  };

  const steerGroups = stem?.updatedDdx ? [{ group: "Re-prioritized differential", items: stem.updatedDdx }] : [];
  const doGradeSteer = async () => {
    if (steerGroups.length === 0) {
      setSteerGraded(true);
      return;
    }
    setSteerGrading(true);
    try {
      setSteerMatched(await grader(steer, steerGroups));
      setSteerGraded(true);
    } finally {
      setSteerGrading(false);
    }
  };

  const result = buildCoverage(groups, matched);
  const steerResult = buildCoverage(steerGroups, steerMatched);

  // Inputs for the qualitative AI grade of the work-up plan.
  const menuTests = [...category.workupMenu.labs, ...category.workupMenu.imaging];
  const workupIdeal = stem?.workup?.length ? stem.workup.join("; ") : menuTests.map((t) => t.test).join("; ");
  const workupRubric = menuTests.map((t) => `${t.test} — ${t.indication}`).join("; ");
  const workupPrompt = `${stem ? stem.vignette : `A patient presents with ${category.category.toLowerCase()}.`} What initial work-up (labs + imaging) would you order, and why?`;

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <div className="panel-label mb-1">Given info</div>
        <p className="text-[15px] font-semibold leading-relaxed">
          {stem ? stem.vignette : `A patient presents with ${category.category.toLowerCase()}.`}
        </p>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--color-exam-muted)" }}>
          What work-up would you order? List labs and imaging.
        </p>
      </div>

      <div className="card p-4 space-y-3">
        <textarea
          className="input w-full resize-y leading-relaxed"
          rows={5}
          value={workup}
          onChange={(e) => setWorkup(e.target.value)}
          placeholder="Labs and imaging you'd order…"
          aria-label="Your work-up"
        />
        <GradeButton
          graded={graded}
          grading={grading}
          disabled={!workup.trim()}
          onGrade={doGrade}
          onNew={onNew}
          onRetry={onRetry}
          newLabel="New rep →"
        />
      </div>

      {graded && (
        <>
          <div className="card p-4 space-y-4 pop-in">
            <div className="flex items-center justify-between gap-3">
              <div className="panel-label">Coverage</div>
              <ResultChip named={result.named} total={result.total} />
            </div>
            <ScoreBar named={result.named} total={result.total} label="Work-up coverage" />
            <CoverageView title="Broad work-up menu" coverage={result.coverage} />
            <AiCoachNote
              prompt={workupPrompt}
              studentAnswer={workup}
              idealAnswer={workupIdeal}
              rubric={workupRubric}
            />
          </div>

          {/* Interactive: how the results steer you. */}
          {stem?.twist && (
            <div className="card p-4 space-y-3 pop-in">
              <div>
                <div className="panel-label mb-1" style={{ color: "var(--color-exam-accent-deep)" }}>
                  The results come back
                </div>
                <p className="text-[14px] font-medium leading-relaxed">{stem.twist}</p>
              </div>
              <textarea
                className="input w-full resize-y leading-relaxed"
                rows={3}
                value={steer}
                onChange={(e) => setSteer(e.target.value)}
                placeholder="What's your re-prioritized differential and next step?"
                aria-label="How the results steer you"
              />
              {!steerGraded ? (
                <div className="flex items-center gap-3">
                  <button className="btn btn-primary" onClick={doGradeSteer} disabled={!steer.trim() || steerGrading}>
                    {steerGrading ? "Grading…" : "Grade my read"}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {steerGroups.length > 0 && (
                    <>
                      <ScoreBar named={steerResult.named} total={steerResult.total} label="Re-prioritized ddx" />
                      <CoverageView title="Re-prioritized differential" coverage={steerResult.coverage} />
                    </>
                  )}
                  {stem.nextStep && (
                    <div
                      className="rounded-lg px-3 py-2.5 text-[13px] leading-relaxed"
                      style={{ background: "var(--color-exam-accent-soft)", color: "var(--color-exam-accent-deep)" }}
                    >
                      <span className="font-semibold">Expert next step: </span>
                      {stem.nextStep}
                    </div>
                  )}
                  {stem.nextStep && (
                    <AiCoachNote
                      prompt={`The results came back: ${stem.twist} What is your re-prioritized differential and next step?`}
                      studentAnswer={steer}
                      idealAnswer={stem.nextStep}
                      rubric={`Re-prioritized differential: ${(stem.updatedDdx ?? []).join(", ")}. Expert next step: ${stem.nextStep}`}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Management teaching — same source the matching station cites. */}
          {category.quickManagement.length > 0 && (
            <div className="card p-4 pop-in">
              <div className="panel-label mb-2">
                Quick &amp; dirty management
                <span className="hint ml-2">aligned to the MGH Housestaff Manual</span>
              </div>
              <div className="space-y-2.5">
                {category.quickManagement.map((m, i) => (
                  <div key={i} className="text-[13px] leading-relaxed">
                    <div className="font-semibold">
                      {m.scenario}
                      {m.manualPage && (
                        <span className="hint ml-2 font-normal">📖 MGH p.&nbsp;{m.manualPage}</span>
                      )}
                    </div>
                    <div style={{ color: "var(--color-exam-muted)" }}>{m.plan}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <VisualGuide category={category.category} view="workup" open />
          <ManualRefs manual={category.manual} compact />
        </>
      )}
    </div>
  );
}

function ManagementDrill({
  problem,
  answer,
  setAnswer,
  graded,
  onGrade,
  onNew,
  onRetry,
}: {
  problem: ManagementDrillProblem | null;
  answer: string;
  setAnswer: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  if (!problem) return null;
  const groups = [{ group: "Management", items: problem.actions }];

  const doGrade = async () => {
    setGrading(true);
    track("drill", { drillType: "management" });
    try {
      setMatched(await grader(answer, groups));
      onGrade();
    } finally {
      setGrading(false);
    }
  };

  const result = buildCoverage(groups, matched);
  const rubric =
    `Expected actions: ${problem.actions.join("; ")}.` +
    (problem.unsafe.length ? ` Avoid: ${problem.unsafe.join("; ")}.` : "");

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="panel-label">{problem.category}</div>
          <span className="chip chip-accent">management drill</span>
        </div>
        <p className="text-[15px] font-semibold leading-relaxed mt-1">{problem.vignette}</p>
        <p className="text-[13px] mt-1.5">
          <span className="font-semibold" style={{ color: "var(--color-exam-accent-deep)" }}>
            Working diagnosis:
          </span>{" "}
          {problem.diagnosis}
        </p>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--color-exam-muted)" }}>
          {problem.prompt} Cover the initial steps, key treatments, consults, and disposition.
        </p>
      </div>

      <div className="card p-4 space-y-3">
        <textarea
          className="input w-full resize-y leading-relaxed"
          rows={5}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your management plan — immediate stabilization, treatments, consults, disposition…"
          aria-label="Your management plan"
        />
        <GradeButton
          graded={graded}
          grading={grading}
          disabled={!answer.trim()}
          onGrade={doGrade}
          onNew={onNew}
          onRetry={onRetry}
          newLabel="Next case →"
        />
      </div>

      {graded && (
        <div className="card p-4 space-y-4 pop-in">
          <div className="flex items-center justify-between gap-3">
            <div className="panel-label">Coverage</div>
            <ResultChip named={result.named} total={result.total} />
          </div>
          <ScoreBar named={result.named} total={result.total} label="Management actions" />
          <CoverageView title="Expected management" coverage={result.coverage} />

          {problem.unsafe.length > 0 && (
            <div>
              <div className="panel-label mb-1" style={{ color: "var(--color-exam-danger)" }}>
                Avoid
              </div>
              <ul className="space-y-1 text-[13px] leading-relaxed">
                {problem.unsafe.map((u, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden style={{ color: "var(--color-exam-danger)" }}>✕</span>
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div className="panel-label mb-1">Model plan</div>
            <p
              className="rounded-lg border p-3 text-[13px] leading-relaxed"
              style={{ borderColor: "var(--color-exam-ok-line)", background: "var(--color-exam-ok-soft)" }}
            >
              {problem.idealAnswer}
            </p>
            {(problem.disposition || problem.consults.length > 0) && (
              <p className="text-[12.5px] mt-1.5" style={{ color: "var(--color-exam-muted)" }}>
                {problem.disposition && (
                  <>
                    <span className="font-semibold">Disposition:</span> {problem.disposition}
                  </>
                )}
                {problem.disposition && problem.consults.length > 0 ? "  ·  " : ""}
                {problem.consults.length > 0 && (
                  <>
                    <span className="font-semibold">Consults:</span> {problem.consults.join(", ")}
                  </>
                )}
              </p>
            )}
          </div>

          <AiCoachNote
            prompt={`${problem.vignette} Working diagnosis: ${problem.diagnosis}. ${problem.prompt}`}
            studentAnswer={answer}
            idealAnswer={problem.idealAnswer}
            rubric={rubric}
          />

          <VisualGuide category={problem.category} view="management" open />
          {problem.manual.page > 0 && <ManualRefs manual={[problem.manual]} compact />}
        </div>
      )}
    </div>
  );
}
