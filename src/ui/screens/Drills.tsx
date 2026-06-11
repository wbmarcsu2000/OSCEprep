import { useMemo, useState } from "react";
import { CURRICULUM, type CategoryCurriculum, type PracticeCase } from "../../data/curriculum";
import { SKILL_DRILLS, SKILL_DRILL_TYPES, type SkillDrillProblem } from "../../data/skillDrills";
import { useAppStore } from "../store";

/**
 * Standalone learning drills (no full case). Get reps on the frameworks:
 *  - Differential & history: given a chief complaint, write the broad
 *    differential + key questions; graded vs the buckets/themes.
 *  - Work-up: write the work-up, then enter how the results steer you.
 *  - Skills: ABG/acid-base, SAAG, pleural fluid, PFT problems with answers and
 *    full worked explanations.
 * Grading is semantic (AI) when a key is set, else a lenient keyword match —
 * both via the store's gradeCoverage so the same call works everywhere.
 */
type DrillType = "differential" | "workup" | "skills";

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
  const [type, setType] = useState<DrillType>("differential");
  const [categoryName, setCategoryName] = useState(CURRICULUM[0].category);
  const [skillFilter, setSkillFilter] = useState<string>("All");
  const [stemIdx, setStemIdx] = useState(0);
  const [ddx, setDdx] = useState("");
  const [questions, setQuestions] = useState("");
  const [workup, setWorkup] = useState("");
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

  const reset = () => {
    setDdx("");
    setQuestions("");
    setWorkup("");
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-0.5">
          <div className="panel-label">Learning tool</div>
          <h2 className="text-[20px] font-bold tracking-tight">Framework Drills</h2>
          <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
            Quick reps on the differential, key questions, and work-up — no full station. Graded
            instantly against the category framework.
          </p>
        </div>
        <button className="btn btn-primary shrink-0" onClick={exitToSelect}>
          Station list →
        </button>
      </div>

      <div className="card px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-3">
        <div
          role="radiogroup"
          aria-label="Drill type"
          className="flex rounded-lg border p-0.5"
          style={{ borderColor: "var(--color-exam-border-strong)", background: "#f1f4f7" }}
        >
          {(
            [
              ["differential", "Differential & questions"],
              ["workup", "Work-up"],
              ["skills", "Skills"],
            ] as [DrillType, string][]
          ).map(([t, label]) => (
            <button
              key={t}
              role="radio"
              aria-checked={type === t}
              className="px-3.5 py-1.5 text-[13px] font-semibold rounded-md transition-all"
              style={{
                background: type === t ? "#fff" : "transparent",
                color: type === t ? "var(--color-exam-ink)" : "var(--color-exam-muted)",
                boxShadow: type === t ? "var(--shadow-card)" : "none",
              }}
              onClick={() => {
                setType(t);
                reset();
              }}
            >
              {label}
            </button>
          ))}
        </div>
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
            if (type === "skills") newRep("skills");
            else newRep(type, CURRICULUM[(Date.now() >>> 0) % CURRICULUM.length].category);
          }}
        >
          🎲 {type === "skills" ? "Next problem" : "Random rep"}
        </button>
      </div>

      {type === "differential" && (
        <DifferentialDrill
          category={category}
          ddx={ddx}
          setDdx={setDdx}
          questions={questions}
          setQuestions={setQuestions}
          graded={graded}
          onGrade={() => setGraded(true)}
          onNew={() => newRep("differential")}
        />
      )}
      {type === "workup" && (
        <WorkupDrill
          category={category}
          stem={stem}
          workup={workup}
          setWorkup={setWorkup}
          graded={graded}
          onGrade={() => setGraded(true)}
          onNew={() => newRep("workup")}
        />
      )}
      {type === "skills" && (
        <SkillDrill
          problem={skillProblem}
          answer={skillAnswer}
          setAnswer={setSkillAnswer}
          graded={graded}
          onGrade={() => setGraded(true)}
          onNew={() => newRep("skills")}
        />
      )}

      <p className="hint text-center">
        Grading is keyword/synonym matching against the framework — a thorough answer phrased
        differently may not register every item; use the framework/explanation to self-check.
      </p>
    </div>
  );
}

function ScoreBar({ named, total, label }: { named: number; total: number; label: string }) {
  const pct = total > 0 ? Math.round((named / total) * 100) : 0;
  const color = pct >= 70 ? "var(--color-exam-ok)" : pct >= 40 ? "var(--color-exam-warn)" : "var(--color-exam-danger)";
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] font-semibold w-40">{label}</span>
      <div className="h-2.5 rounded-full overflow-hidden flex-1" style={{ background: "#eef1f5" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono text-[13px] tabular-nums w-20 text-right" style={{ color }}>
        {named}/{total} · {pct}%
      </span>
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
  newLabel,
}: {
  graded: boolean;
  grading: boolean;
  disabled: boolean;
  onGrade: () => void;
  onNew: () => void;
  newLabel: string;
}) {
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  if (graded) {
    return (
      <button className="btn" onClick={onNew}>
        {newLabel}
      </button>
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
}: {
  category: CategoryCurriculum;
  ddx: string;
  setDdx: (v: string) => void;
  questions: string;
  setQuestions: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [ddxMatched, setDdxMatched] = useState<Set<string>>(new Set());
  const [qMatched, setQMatched] = useState<Set<string>>(new Set());

  const ddxGroups = category.differential.map((g) => ({ group: g.group, items: g.items }));
  const qGroups = category.keyQuestions.map((q) => ({ group: q.theme, items: q.questions }));

  const doGrade = async () => {
    setGrading(true);
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
          newLabel="New rep →"
        />
      </div>

      {graded && (
        <div className="card p-4 space-y-4">
          <div className="space-y-2">
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
}: {
  problem: SkillDrillProblem | null;
  answer: string;
  setAnswer: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  if (!problem) return null;
  const groups = [{ group: problem.skill, items: problem.answer }];

  const doGrade = async () => {
    setGrading(true);
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
          newLabel="Next problem →"
        />
      </div>

      {graded && (
        <div className="card p-4 space-y-4">
          <ScoreBar named={result.named} total={result.total} label="Key concepts" />
          <CoverageView title="Expected concepts" coverage={result.coverage} />
          <div>
            <div className="panel-label mb-1">Worked explanation</div>
            <p
              className="rounded-lg border p-3 text-[13px] leading-relaxed"
              style={{ borderColor: "#cfe9db", background: "var(--color-exam-ok-soft)" }}
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
}: {
  category: CategoryCurriculum;
  stem: PracticeCase | null;
  workup: string;
  setWorkup: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
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
          newLabel="New rep →"
        />
      </div>

      {graded && (
        <>
          <div className="card p-4 space-y-4">
            <ScoreBar named={result.named} total={result.total} label="Work-up coverage" />
            <CoverageView title="Broad work-up menu" coverage={result.coverage} />
          </div>

          {/* Interactive: how the results steer you. */}
          {stem?.twist && (
            <div className="card p-4 space-y-3">
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
                      style={{ background: "var(--color-exam-accent-soft)", color: "#18305f" }}
                    >
                      <span className="font-semibold">Expert next step: </span>
                      {stem.nextStep}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
