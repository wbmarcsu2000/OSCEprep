import { useEffect, useMemo, useState } from "react";
import { CURRICULUM, type CategoryCurriculum, type PracticeCase } from "../../data/curriculum";
import { SKILL_DRILLS, SKILL_DRILL_TYPES, type SkillDrillProblem } from "../../data/skillDrills";
import { MANAGEMENT_DRILLS, type ManagementDrillProblem } from "../../data/managementDrills";
import { EKG_DRILLS, CXR_DRILLS, type ImageDrillProblem } from "../../data/imageDrills";
import { SCORE_DRILLS, type ScoreDrillProblem } from "../../data/scoreDrills";
import { ANTIBIOTIC_DRILLS, type AntibioticDrillProblem } from "../../data/antibioticDrills";
import { HIGH_YIELD_DRILLS, HIGH_YIELD_CATEGORIES, highYieldGroup, type HighYieldDrillProblem } from "../../data/highYieldDrills";
import { track } from "../../analytics/telemetry";
import { useAppStore } from "../store";
import { useDrillProgress } from "../useDrillProgress";
import {
  drillCatalog,
  drillKey,
  isMastered,
  isSeen,
  summarize,
  skillDrillId,
  labSkillForType,
  DRILL_TYPE_LABELS,
  DRILL_TYPE_EMOJI,
  type DrillType,
  type DrillProgress,
  type DrillManual,
} from "../../data/drillProgress";
import { ManualRefs } from "../components/ManualRefs";
import { Segmented } from "../components/Segmented";
import { DrillTypeRail } from "../components/DrillTypeRail";
import { VisualGuide } from "../components/VisualGuide";
import {
  useGrader,
  buildCoverage,
  CoverageView,
  ScoreBar,
  ResultChip,
  GradeButton,
  MasteryControls,
  SeenChip,
  AiCoachNote,
  DrillBrowser,
  fmtTime,
} from "../components/drillPrimitives";

/**
 * Standalone learning drills (no full case). Get reps on the frameworks:
 *  - Differential: given a chief complaint, write the broad differential;
 *    graded vs the category buckets.
 *  - Work-up: write the work-up, then enter how the results steer you.
 *  - Management: given the scenario + working diagnosis, write the management
 *    plan; graded against the case's expected actions (one drill per case).
 *  - Skills: ABG/acid-base, SAAG, pleural fluid, PFT problems with answers and
 *    full worked explanations.
 * Grading is semantic (AI) when a key is set, else a lenient keyword match —
 * both via the store's gradeCoverage so the same call works everywhere.
 * DrillType (incl. scores + the per-skill lab tabs) is shared with the progress
 * store in ../../data/drillProgress.
 */

export function Drills() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const [type, setType] = useState<DrillType>("differential");
  const [categoryName, setCategoryName] = useState(CURRICULUM[0].category);
  const [skillFilter, setSkillFilter] = useState<string>("All");
  const [highYieldFilter, setHighYieldFilter] = useState<string>("All");
  const [highYieldStatus, setHighYieldStatus] = useState<"all" | "unseen" | "working" | "mastered">("all");
  const [stemIdx, setStemIdx] = useState(0);
  const [ddx, setDdx] = useState("");
  // Differential drill depth: false = core (default), true = full "advanced" list.
  // Lives here so the choice persists across category changes / new reps.
  const [ddxAdvanced, setDdxAdvanced] = useState(false);
  const [workup, setWorkup] = useState("");
  const [managementAnswer, setManagementAnswer] = useState("");
  const [skillAnswer, setSkillAnswer] = useState("");
  const [imageAnswer, setImageAnswer] = useState("");
  const [scoreAnswer, setScoreAnswer] = useState("");
  const [antibioticAnswer, setAntibioticAnswer] = useState("");
  const [highYieldAnswer, setHighYieldAnswer] = useState("");
  const [graded, setGraded] = useState(false);
  const { progress, record, setManual } = useDrillProgress();
  const [browsing, setBrowsing] = useState(false);

  const category = useMemo(
    () => CURRICULUM.find((c) => c.category === categoryName)!,
    [categoryName],
  );
  // Work-up drills use a worked-case vignette as the "given info" stem.
  const stem: PracticeCase | null =
    type === "workup" && category.practiceCases.length > 0
      ? category.practiceCases[stemIdx % category.practiceCases.length]
      : null;

  // Skills + lab tabs share the SkillDrill component over a filtered pool. The
  // combined Skills tab uses the skill-filter dropdown (ABG/SAAG/Pleural/PFT);
  // each lab tab (CSF, iron, …) pins to its own skill.
  const labSkill = labSkillForType(type);
  const skillPool = useMemo(() => {
    if (labSkill) return SKILL_DRILLS.filter((p) => p.skill === labSkill);
    const dropdown = new Set<string>(SKILL_DRILL_TYPES);
    return skillFilter === "All"
      ? SKILL_DRILLS.filter((p) => dropdown.has(p.skill))
      : SKILL_DRILLS.filter((p) => p.skill === skillFilter);
  }, [labSkill, skillFilter]);
  const skillProblem: SkillDrillProblem | null =
    (type === "skills" || labSkill) && skillPool.length > 0 ? skillPool[stemIdx % skillPool.length] : null;

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

  // EKG / CXR reading drills: a LITFL study bank, rotated by stemIdx.
  const imagePool = type === "ekg" ? EKG_DRILLS : type === "cxr" ? CXR_DRILLS : [];
  const imageProblem: ImageDrillProblem | null =
    (type === "ekg" || type === "cxr") && imagePool.length > 0
      ? imagePool[stemIdx % imagePool.length]
      : null;

  // Scores drill: a flat bank rotated by stemIdx.
  const scoreProblem: ScoreDrillProblem | null =
    type === "scores" && SCORE_DRILLS.length > 0 ? SCORE_DRILLS[stemIdx % SCORE_DRILLS.length] : null;

  // Antibiotics drill: a flat MGH-grounded bank rotated by stemIdx.
  const antibioticProblem: AntibioticDrillProblem | null =
    type === "antibiotics" && ANTIBIOTIC_DRILLS.length > 0
      ? ANTIBIOTIC_DRILLS[stemIdx % ANTIBIOTIC_DRILLS.length]
      : null;

  // High-Yield deck: a flat mixed bank rotated by stemIdx; references into the
  // other banks are resolved to the underlying problem at render time.
  // Optional category filter so a student can separate out one section.
  const highYieldPool = useMemo(
    () =>
      highYieldFilter === "All"
        ? HIGH_YIELD_DRILLS
        : HIGH_YIELD_DRILLS.filter((p) => highYieldGroup(p) === highYieldFilter),
    [highYieldFilter],
  );
  const highYieldProblem: HighYieldDrillProblem | null =
    type === "high-yield" && highYieldPool.length > 0
      ? highYieldPool[stemIdx % highYieldPool.length]
      : null;
  // Mastery status of a High-Yield item, for the unseen/working/mastered filter.
  const hyStatusOf = (p: HighYieldDrillProblem): "unseen" | "working" | "mastered" => {
    const e = progress[drillKey("high-yield", p.id)];
    if (!isSeen(e)) return "unseen";
    return isMastered(e) ? "mastered" : "working";
  };
  const hyMatchesStatus = (p: HighYieldDrillProblem) =>
    highYieldStatus === "all" || hyStatusOf(p) === highYieldStatus;

  // Stable id of the problem currently on screen (per drill type), for progress.
  const activeId: string | null = (() => {
    if (labSkill) return skillProblem ? skillDrillId(skillProblem) : null;
    switch (type) {
      case "differential":
        return categoryName;
      case "workup":
        return stem ? `${categoryName}#${category.practiceCases.indexOf(stem)}` : null;
      case "management":
        return managementProblem?.caseId ?? null;
      case "skills":
        return skillProblem ? skillDrillId(skillProblem) : null;
      case "scores":
        return scoreProblem?.id ?? null;
      case "antibiotics":
        return antibioticProblem?.id ?? null;
      case "high-yield":
        return highYieldProblem?.id ?? null;
      case "ekg":
      case "cxr":
        return imageProblem ? String(imageProblem.n) : null;
      default:
        return null;
    }
  })();
  const activeProgress = activeId ? progress[drillKey(type, activeId)] : undefined;
  const summary = useMemo(() => summarize(type, progress), [type, progress]);
  const recordCurrent = (pct: number) => {
    if (activeId) record(type, activeId, pct);
  };
  const setManualCurrent = (m: DrillManual) => {
    if (activeId) setManual(type, activeId, m);
  };

  const reset = () => {
    setDdx("");
    setWorkup("");
    setManagementAnswer("");
    setSkillAnswer("");
    setImageAnswer("");
    setScoreAnswer("");
    setAntibioticAnswer("");
    setHighYieldAnswer("");
    setGraded(false);
  };

  const newRep = (nextType: DrillType, nextCat?: string) => {
    setType(nextType);
    if (nextCat) setCategoryName(nextCat);
    // rotate the work-up stem each rep
    setStemIdx((i) => i + 1);
    reset();
  };

  /** Re-attempt the same prompt: keep the typed answer, just re-open grading. */
  const retry = () => setGraded(false);

  /** Jump the drill to a specific problem (from the browser or smart-next). */
  const goToProblem = (t: DrillType, id: string) => {
    setType(t);
    const lab = labSkillForType(t);
    if (t === "differential") {
      setCategoryName(id);
    } else if (lab) {
      const pool = SKILL_DRILLS.filter((p) => p.skill === lab);
      setStemIdx(Math.max(0, pool.findIndex((p) => skillDrillId(p) === id)));
    } else if (t === "scores") {
      setStemIdx(Math.max(0, SCORE_DRILLS.findIndex((p) => p.id === id)));
    } else if (t === "antibiotics") {
      setStemIdx(Math.max(0, ANTIBIOTIC_DRILLS.findIndex((p) => p.id === id)));
    } else if (t === "high-yield") {
      const prob = HIGH_YIELD_DRILLS.find((p) => p.id === id);
      if (prob) {
        const grp = highYieldGroup(prob);
        setHighYieldFilter(grp);
        const pool = HIGH_YIELD_DRILLS.filter((p) => highYieldGroup(p) === grp);
        setStemIdx(Math.max(0, pool.findIndex((p) => p.id === id)));
      }
    } else if (t === "workup") {
      const h = id.lastIndexOf("#");
      setCategoryName(id.slice(0, h));
      setStemIdx(parseInt(id.slice(h + 1), 10) || 0);
    } else if (t === "management") {
      const prob = MANAGEMENT_DRILLS.find((p) => p.caseId === id);
      if (prob) {
        setCategoryName(prob.category);
        const pool = MANAGEMENT_DRILLS.filter((p) => p.category === prob.category);
        setStemIdx(Math.max(0, pool.findIndex((p) => p.caseId === id)));
      }
    } else if (t === "skills") {
      const prob = SKILL_DRILLS.find((p) => skillDrillId(p) === id);
      if (prob) {
        setSkillFilter(prob.skill);
        const pool = SKILL_DRILLS.filter((p) => p.skill === prob.skill);
        setStemIdx(Math.max(0, pool.findIndex((p) => skillDrillId(p) === id)));
      }
    } else {
      const pool = t === "ekg" ? EKG_DRILLS : CXR_DRILLS;
      setStemIdx(Math.max(0, pool.findIndex((p) => String(p.n) === id)));
    }
    setBrowsing(false);
    reset();
  };

  /** Next problem to serve: prefer unseen, then unmastered, else just advance. */
  const pickNext = (t: DrillType): string | null => {
    const items = drillCatalog(t);
    if (items.length === 0) return null;
    const cur = items.findIndex((it) => it.id === activeId);
    const order = [...items.slice(cur + 1), ...items.slice(0, cur + 1)];
    const unseen = order.find((it) => !isSeen(progress[drillKey(t, it.id)]));
    if (unseen) return unseen.id;
    const unmastered = order.find((it) => !isMastered(progress[drillKey(t, it.id)]));
    return (unmastered ?? order[0] ?? items[0]).id;
  };

  /** Advance within the current High-Yield category. Honors the status filter
   *  (unseen/working/mastered); falls back to the smart default so Next never
   *  dead-ends. */
  const nextHighYield = () => {
    const pool = highYieldPool;
    if (pool.length === 0) return;
    const cur = ((stemIdx % pool.length) + pool.length) % pool.length;
    const ordered = [...pool.slice(cur + 1), ...pool.slice(0, cur + 1)];
    const target =
      (highYieldStatus !== "all" ? ordered.find(hyMatchesStatus) : undefined) ??
      ordered.find((p) => !isSeen(progress[drillKey("high-yield", p.id)])) ??
      ordered.find((p) => !isMastered(progress[drillKey("high-yield", p.id)])) ??
      ordered[0];
    setStemIdx(Math.max(0, pool.findIndex((p) => p.id === target.id)));
    reset();
  };

  const nextProblem = () => {
    if (type === "high-yield") {
      nextHighYield();
      return;
    }
    const id = pickNext(type);
    if (id) goToProblem(type, id);
    else newRep(type);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 space-y-4">
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
              Quick reps across the workflow — differential, work-up, management, scores, EKG/CXR, and
              lab interpretation (CSF, iron, LFTs, and more). Graded instantly, no full station.
            </p>
          </div>
        </div>
        <button className="btn btn-ghost shrink-0" onClick={exitToSelect}>
          Case list →
        </button>
      </div>

      <div className="grid lg:grid-cols-[232px_minmax(0,1fr)] gap-5 items-start">
        <DrillTypeRail
          type={type}
          progress={progress}
          onSelect={(t) => {
            setType(t);
            reset();
          }}
        />

        <div className="space-y-4 min-w-0">
          <div className="card px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-[18px] leading-none">
                {DRILL_TYPE_EMOJI[type]}
              </span>
              <span className="font-extrabold text-[15px]" style={{ color: "var(--color-exam-header)" }}>
                {DRILL_TYPE_LABELS[type]}
              </span>
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
            ) : labSkill ? (
              <span className="text-[13px] font-semibold" style={{ color: "var(--color-exam-muted)" }}>
                {labSkill} · {skillProblem ? (stemIdx % skillPool.length) + 1 : 0} / {skillPool.length}
              </span>
            ) : type === "ekg" || type === "cxr" ? (
              <span className="text-[13px] font-semibold" style={{ color: "var(--color-exam-muted)" }}>
                Study {imageProblem ? (stemIdx % imagePool.length) + 1 : 0} / {imagePool.length} · LITFL Top 100
              </span>
            ) : type === "scores" ? (
              <span className="text-[13px] font-semibold" style={{ color: "var(--color-exam-muted)" }}>
                {scoreProblem ? `${scoreProblem.name} · ${(stemIdx % SCORE_DRILLS.length) + 1} / ${SCORE_DRILLS.length}` : "No scores yet"}
              </span>
            ) : type === "antibiotics" ? (
              <span className="text-[13px] font-semibold" style={{ color: "var(--color-exam-muted)" }}>
                {antibioticProblem ? `${antibioticProblem.name} · ${(stemIdx % ANTIBIOTIC_DRILLS.length) + 1} / ${ANTIBIOTIC_DRILLS.length}` : "No drills yet"}
              </span>
            ) : type === "high-yield" ? (
              <>
                <label className="text-sm flex items-center gap-2">
                  <span className="panel-label">Category</span>
                  <select
                    className="input text-[13px] py-1.5"
                    value={highYieldFilter}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setHighYieldFilter(cat);
                      const pool =
                        cat === "All" ? HIGH_YIELD_DRILLS : HIGH_YIELD_DRILLS.filter((p) => highYieldGroup(p) === cat);
                      const i = highYieldStatus === "all" ? 0 : pool.findIndex((p) => hyStatusOf(p) === highYieldStatus);
                      setStemIdx(i >= 0 ? i : 0);
                      reset();
                    }}
                    aria-label="High-yield category"
                  >
                    <option>All</option>
                    {HIGH_YIELD_CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm flex items-center gap-2">
                  <span className="panel-label">Status</span>
                  <select
                    className="input text-[13px] py-1.5"
                    value={highYieldStatus}
                    onChange={(e) => {
                      const st = e.target.value as typeof highYieldStatus;
                      setHighYieldStatus(st);
                      const i = st === "all" ? 0 : highYieldPool.findIndex((p) => hyStatusOf(p) === st);
                      setStemIdx(i >= 0 ? i : 0);
                      reset();
                    }}
                    aria-label="High-yield status"
                  >
                    <option value="all">All</option>
                    <option value="unseen">Unseen</option>
                    <option value="working">Still working</option>
                    <option value="mastered">Mastered</option>
                  </select>
                </label>
                <span className="text-[13px] font-semibold" style={{ color: "var(--color-exam-muted)" }}>
                  {highYieldProblem
                    ? `${(stemIdx % highYieldPool.length) + 1} / ${highYieldPool.length}` +
                      (highYieldStatus !== "all"
                        ? ` · ${highYieldPool.filter(hyMatchesStatus).length} ${
                            highYieldStatus === "working" ? "still working" : highYieldStatus
                          }`
                        : "")
                    : "No drills yet"}
                </span>
              </>
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
            <button className="btn ml-auto" onClick={nextProblem} title="Prefers a problem you haven't mastered yet">
              ➜ {type === "skills" || labSkill ? "Next problem" : type === "management" ? "Next case" : type === "ekg" || type === "cxr" ? "Next study" : type === "scores" ? "Next score" : type === "antibiotics" ? "Next drill" : type === "high-yield" ? "Next" : "Next rep"}
            </button>
          </div>

          {/* Progress for this drill type + browse-all (revisit any problem) */}
          <div className="card px-4 py-2.5 flex items-center gap-2 flex-wrap text-[13px]">
            <span className="panel-label">Progress</span>
            <span className="font-semibold" style={{ color: "var(--color-exam-muted)" }}>
              Seen {summary.seen}/{summary.total} · {summary.mastered} mastered
              {summary.needsWork ? ` · ${summary.needsWork} to review` : ""}
              {summary.seen ? ` · avg ${summary.avgBestPct}%` : ""}
            </span>
            <SeenChip entry={activeProgress} />
            <button className="btn btn-ghost ml-auto py-1 px-2.5 text-[12px]" onClick={() => setBrowsing((b) => !b)}>
              {browsing ? "Hide list" : `📋 Browse all (${summary.total})`}
            </button>
          </div>
          {browsing && (
            <DrillBrowser
              items={drillCatalog(type)}
              keyOf={(id) => drillKey(type, id)}
              progress={progress}
              currentId={activeId}
              onPick={(id) => goToProblem(type, id)}
            />
          )}

          {type === "differential" && (
            <DifferentialDrill
              key={categoryName}
              category={category}
              ddx={ddx}
              setDdx={setDdx}
              advanced={ddxAdvanced}
              onToggleAdvanced={(v) => {
                setDdxAdvanced(v);
                // Re-open grading so the answer is re-scored against the new list.
                setGraded(false);
              }}
              graded={graded}
              onGrade={() => setGraded(true)}
              onNew={nextProblem}
              onRetry={retry}
              onRecord={recordCurrent}
              progressEntry={activeProgress}
              onSetManual={setManualCurrent}
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
              onNew={nextProblem}
              onRetry={retry}
              onRecord={recordCurrent}
              progressEntry={activeProgress}
              onSetManual={setManualCurrent}
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
              onNew={nextProblem}
              onRetry={retry}
              onRecord={recordCurrent}
              progressEntry={activeProgress}
              onSetManual={setManualCurrent}
            />
          )}
          {(type === "skills" || labSkill) && (
            <SkillDrill
              key={`${type}:${skillFilter}:${stemIdx}`}
              problem={skillProblem}
              answer={skillAnswer}
              setAnswer={setSkillAnswer}
              graded={graded}
              onGrade={() => setGraded(true)}
              onNew={nextProblem}
              onRetry={retry}
              onRecord={recordCurrent}
              progressEntry={activeProgress}
              onSetManual={setManualCurrent}
            />
          )}
          {(type === "ekg" || type === "cxr") && (
            <ImageReadDrill
              key={`${type}:${stemIdx}`}
              kind={type}
              problem={imageProblem}
              answer={imageAnswer}
              setAnswer={setImageAnswer}
              graded={graded}
              onGrade={() => setGraded(true)}
              onNew={nextProblem}
              onRetry={retry}
              onRecord={recordCurrent}
              progressEntry={activeProgress}
              onSetManual={setManualCurrent}
            />
          )}
          {type === "scores" && (
            <ScoreDrill
              key={`sc:${stemIdx}`}
              problem={scoreProblem}
              answer={scoreAnswer}
              setAnswer={setScoreAnswer}
              graded={graded}
              onGrade={() => setGraded(true)}
              onNew={nextProblem}
              onRetry={retry}
              onRecord={recordCurrent}
              progressEntry={activeProgress}
              onSetManual={setManualCurrent}
            />
          )}
          {type === "antibiotics" && (
            <AntibioticDrill
              key={`abx:${stemIdx}`}
              problem={antibioticProblem}
              answer={antibioticAnswer}
              setAnswer={setAntibioticAnswer}
              graded={graded}
              onGrade={() => setGraded(true)}
              onNew={nextProblem}
              onRetry={retry}
              onRecord={recordCurrent}
              progressEntry={activeProgress}
              onSetManual={setManualCurrent}
            />
          )}
          {type === "high-yield" && (
            <HighYieldDrill
              key={`hy:${highYieldProblem?.id ?? stemIdx}`}
              problem={highYieldProblem}
              answer={highYieldAnswer}
              setAnswer={setHighYieldAnswer}
              graded={graded}
              onGrade={() => setGraded(true)}
              onNew={nextProblem}
              onRetry={retry}
              onRecord={recordCurrent}
              progressEntry={activeProgress}
              onSetManual={setManualCurrent}
            />
          )}

          <p className="hint text-center">
            {llmEnabled
              ? "Graded semantically by AI — use the framework/explanation to self-check anything it misses."
              : "Graded by lenient keyword match — enable AI for semantic grading. A thorough answer phrased differently may not register every item; use the framework/explanation to self-check."}
          </p>
        </div>
      </div>
    </div>
  );
}

function DifferentialDrill({
  category,
  ddx,
  setDdx,
  advanced,
  onToggleAdvanced,
  graded,
  onGrade,
  onNew,
  onRetry,
  onRecord,
  progressEntry,
  onSetManual,
}: {
  category: CategoryCurriculum;
  ddx: string;
  setDdx: (v: string) => void;
  advanced: boolean;
  onToggleAdvanced: (v: boolean) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
  onRecord: (pct: number) => void;
  progressEntry?: DrillProgress;
  onSetManual: (m: DrillManual) => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [ddxMatched, setDdxMatched] = useState<Set<string>>(new Set());
  // After grading, the model answer shows by default (side-by-side with the
  // live input); this covers it again for active-recall self-review.
  const [answersHidden, setAnswersHidden] = useState(false);

  // Stopwatch: counts up while answering, freezes once graded, resets on remount
  // (a new category / rep remounts via the `key` prop in the parent). Can be
  // paused/resumed manually with the button beside it.
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (graded || !running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [graded, running]);

  // Core list by default; the opt-in Advanced toggle grades against the full
  // (broadened) differential. Advanced falls back to core if none is defined.
  const activeDifferential = advanced ? category.differentialAdvanced ?? category.differential : category.differential;
  const ddxGroups = activeDifferential.map((g) => ({ group: g.group, items: g.items }));
  const itemCount = activeDifferential.reduce((n, g) => n + g.items.length, 0);

  const doGrade = async () => {
    setGrading(true);
    try {
      const matched = await grader(ddx, ddxGroups);
      setDdxMatched(matched);
      const r = buildCoverage(ddxGroups, matched);
      const pct = r.total > 0 ? Math.round((r.named / r.total) * 100) : 0;
      track("drill", { drillType: "differential", advanced, pct });
      onRecord(pct);
      setAnswersHidden(false); // reveal the model answer on each fresh grade
      onGrade();
    } finally {
      setGrading(false);
    }
  };

  const ddxResult = buildCoverage(ddxGroups, ddxMatched);

  return (
    <div className="space-y-3">
      {/* Prompt — depth toggle + stopwatch (full width) */}
      <div className="card p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <div className="panel-label">Prompt</div>
            <span
              className="chip font-mono tabular-nums"
              style={{ background: "var(--color-exam-soft)", opacity: running || graded ? 1 : 0.6 }}
              title="Time on this rep"
            >
              ⏱ {fmtTime(seconds)}
            </span>
            {!graded && (
              <button
                type="button"
                className="btn btn-ghost py-0.5 px-2 text-[13px] leading-none"
                onClick={() => setRunning((r) => !r)}
                aria-pressed={!running}
                aria-label={running ? "Pause stopwatch" : "Resume stopwatch"}
                title={running ? "Pause the stopwatch" : "Resume the stopwatch"}
              >
                {running ? "⏸" : "▶"}
              </button>
            )}
          </div>
          <Segmented
            label="Differential depth"
            options={[
              { value: "core", label: "Core" },
              { value: "advanced", label: "Advanced" },
            ]}
            value={advanced ? "advanced" : "core"}
            onChange={(v) => onToggleAdvanced(v === "advanced")}
          />
        </div>
        <p className="text-[15px] font-semibold mt-1">
          A patient presents with{" "}
          <span style={{ color: "var(--color-exam-accent-deep)" }}>{category.category.toLowerCase()}</span>.
        </p>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--color-exam-muted)" }}>
          Write your broad differential, organized by buckets.
        </p>
        <p className="hint mt-1">
          {advanced
            ? `Advanced — the full list (${itemCount} causes), incl. can't-miss & uncommon. Switch to Core to keep it focused.`
            : `Core — the must-know causes (${itemCount}). Switch to Advanced for the full broadened list.`}
        </p>
      </div>

      {/* Your input and the model answer sit side-by-side once graded — the live
          textarea IS your answer (no re-paste), so there's nothing to scroll past. */}
      <div className={graded ? "grid gap-3 lg:grid-cols-2 items-start" : "space-y-3"}>
        <div className="card p-4 space-y-3">
          <div className="panel-label">Your differential</div>
          <textarea
            className="input w-full resize-y leading-relaxed"
            rows={graded ? 7 : 5}
            value={ddx}
            onChange={(e) => setDdx(e.target.value)}
            placeholder="List as many plausible causes as you can, ideally grouped…"
            aria-label="Your differential"
          />
          <GradeButton
            graded={graded}
            grading={grading}
            disabled={!ddx.trim()}
            onGrade={doGrade}
            onNew={onNew}
            onRetry={onRetry}
            newLabel="New rep →"
          />
        </div>

        {graded && (
          <div className="card p-4 space-y-3 pop-in">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="panel-label">Coverage</div>
              <div className="flex items-center gap-2">
                <ResultChip named={ddxResult.named} total={ddxResult.total} />
                <button
                  type="button"
                  className="btn btn-ghost py-1 px-2.5 text-[12px]"
                  onClick={() => setAnswersHidden((h) => !h)}
                  aria-pressed={answersHidden}
                  title={answersHidden ? "Reveal the model answer" : "Cover the model answer to self-test"}
                >
                  {answersHidden ? "👁 Show answers" : "🙈 Cover answers"}
                </button>
              </div>
            </div>
            <ScoreBar named={ddxResult.named} total={ddxResult.total} label="Differential coverage" />

            {answersHidden ? (
              <button
                type="button"
                onClick={() => setAnswersHidden(false)}
                className="rounded-lg border border-dashed p-4 text-[13px] font-semibold flex items-center justify-center gap-2 w-full"
                style={{ borderColor: "var(--color-exam-border-strong)", color: "var(--color-exam-muted)", minHeight: "6rem" }}
                aria-label="Show the model differential"
              >
                🙈 Answers hidden — tap to reveal
              </button>
            ) : (
              <>
                <CoverageView
                  title={advanced ? "Model differential — advanced" : "Model differential — core"}
                  coverage={ddxResult.coverage}
                />
                <div>
                  <div className="panel-label mb-1">Schema</div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
                    {category.framework} {category.strategy}
                  </p>
                </div>
                <ManualRefs manual={category.manual} compact />
              </>
            )}

            <MasteryControls entry={progressEntry} onSetManual={onSetManual} />
          </div>
        )}
      </div>
    </div>
  );
}

/** Tier-3 clinical-score drill: read a vignette, compute the score + risk band +
 *  next step (type & check), graded by coverage with a worked solution. */
function ScoreDrill({
  problem,
  answer,
  setAnswer,
  graded,
  onGrade,
  onNew,
  onRetry,
  onRecord,
  progressEntry,
  onSetManual,
}: {
  problem: ScoreDrillProblem | null;
  answer: string;
  setAnswer: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
  onRecord: (pct: number) => void;
  progressEntry?: DrillProgress;
  onSetManual: (m: DrillManual) => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  if (!problem) {
    return (
      <div className="card p-4">
        <p className="muted text-center">No score drills available yet.</p>
      </div>
    );
  }
  const groups = [{ group: problem.name, items: problem.answer }];

  const doGrade = async () => {
    setGrading(true);
    try {
      const m = await grader(answer, groups);
      setMatched(m);
      const r = buildCoverage(groups, m);
      const pct = r.total > 0 ? Math.round((r.named / r.total) * 100) : 0;
      track("drill", { drillType: "scores", pct });
      onRecord(pct);
      onGrade();
    } finally {
      setGrading(false);
    }
  };

  const result = buildCoverage(groups, matched);
  return (
    <div className="space-y-3">
      <div className="card p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="panel-label">{problem.name}</div>
          <span className="chip chip-accent">{problem.category}</span>
        </div>
        <p className="text-[15px] font-semibold leading-relaxed mt-1">{problem.vignette}</p>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--color-exam-muted)" }}>
          Compute the score, give the risk category, and state the next step.
        </p>
      </div>

      <div className="card p-4 space-y-3">
        <textarea
          className="input w-full resize-y leading-relaxed"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your score, risk band, and recommended next step…"
          aria-label="Your answer"
        />
        <GradeButton
          graded={graded}
          grading={grading}
          disabled={!answer.trim()}
          onGrade={doGrade}
          onNew={onNew}
          onRetry={onRetry}
          newLabel="Next score →"
        />
      </div>

      {graded && (
        <div className="card p-4 space-y-4 pop-in">
          <div className="flex items-center justify-between gap-3">
            <div className="panel-label">Coverage</div>
            <ResultChip named={result.named} total={result.total} />
          </div>
          <ScoreBar named={result.named} total={result.total} label="Key points" />
          <CoverageView title="Expected answer" coverage={result.coverage} />
          <div>
            <div className="panel-label mb-1">Worked solution</div>
            <p
              className="rounded-lg border p-3 text-[13px] leading-relaxed"
              style={{ borderColor: "var(--color-exam-ok-line)", background: "var(--color-exam-ok-soft)" }}
            >
              {problem.explanation}
            </p>
          </div>
          <MasteryControls entry={progressEntry} onSetManual={onSetManual} />
        </div>
      )}
    </div>
  );
}

/** Generic coverage-graded free-text drill (vignette → answer key → explanation),
 *  shared by the antibiotics bank and the High-Yield integrated cases. */
function CoverageDrill({
  drillType,
  title,
  badge,
  vignette,
  ask,
  items,
  coverageLabel,
  expectedTitle,
  explanation,
  explanationLabel,
  placeholder,
  newLabel,
  answer,
  setAnswer,
  graded,
  onGrade,
  onNew,
  onRetry,
  onRecord,
  progressEntry,
  onSetManual,
}: {
  drillType: DrillType;
  title: string;
  badge: string;
  vignette: string;
  ask?: string;
  items: string[];
  coverageLabel: string;
  expectedTitle: string;
  explanation: string;
  explanationLabel: string;
  placeholder: string;
  newLabel: string;
  answer: string;
  setAnswer: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
  onRecord: (pct: number) => void;
  progressEntry?: DrillProgress;
  onSetManual: (m: DrillManual) => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const groups = [{ group: title, items }];

  const doGrade = async () => {
    setGrading(true);
    try {
      const m = await grader(answer, groups);
      setMatched(m);
      const r = buildCoverage(groups, m);
      const pct = r.total > 0 ? Math.round((r.named / r.total) * 100) : 0;
      track("drill", { drillType, pct });
      onRecord(pct);
      onGrade();
    } finally {
      setGrading(false);
    }
  };

  const result = buildCoverage(groups, matched);
  return (
    <div className="space-y-3">
      <div className="card p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="panel-label">{title}</div>
          <span className="chip chip-accent">{badge}</span>
        </div>
        <p className="text-[15px] font-semibold leading-relaxed mt-1">{vignette}</p>
        {ask && (
          <p className="text-[13px] mt-0.5" style={{ color: "var(--color-exam-muted)" }}>
            {ask}
          </p>
        )}
      </div>

      <div className="card p-4 space-y-3">
        <textarea
          className="input w-full resize-y leading-relaxed"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={placeholder}
          aria-label="Your answer"
        />
        <GradeButton
          graded={graded}
          grading={grading}
          disabled={!answer.trim()}
          onGrade={doGrade}
          onNew={onNew}
          onRetry={onRetry}
          newLabel={newLabel}
        />
      </div>

      {graded && (
        <div className="card p-4 space-y-4 pop-in">
          <div className="flex items-center justify-between gap-3">
            <div className="panel-label">Coverage</div>
            <ResultChip named={result.named} total={result.total} />
          </div>
          <ScoreBar named={result.named} total={result.total} label={coverageLabel} />
          <CoverageView title={expectedTitle} coverage={result.coverage} />
          <div>
            <div className="panel-label mb-1">{explanationLabel}</div>
            <p
              className="rounded-lg border p-3 text-[13px] leading-relaxed whitespace-pre-line"
              style={{ borderColor: "var(--color-exam-ok-line)", background: "var(--color-exam-ok-soft)" }}
            >
              {explanation}
            </p>
          </div>
          <MasteryControls entry={progressEntry} onSetManual={onSetManual} />
        </div>
      )}
    </div>
  );
}

/** Empiric-antibiotics drill — coverage-graded "what would you start?". Reused
 *  inside the High-Yield deck via the drillType/newLabel overrides. */
function AntibioticDrill({
  problem,
  drillType = "antibiotics",
  newLabel = "Next drill →",
  ...rest
}: {
  problem: AntibioticDrillProblem | null;
  drillType?: DrillType;
  newLabel?: string;
  answer: string;
  setAnswer: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
  onRecord: (pct: number) => void;
  progressEntry?: DrillProgress;
  onSetManual: (m: DrillManual) => void;
}) {
  if (!problem) {
    return (
      <div className="card p-4">
        <p className="muted text-center">No antibiotic drills available yet.</p>
      </div>
    );
  }
  const spectrum = problem.mode === "spectrum";
  return (
    <CoverageDrill
      drillType={drillType}
      title={problem.name}
      badge={spectrum ? "spectrum & coverage" : problem.category}
      vignette={problem.vignette}
      ask={spectrum ? "Name what it covers and the key gaps." : "Name the preferred empiric regimen and the key reasoning."}
      items={problem.answer}
      coverageLabel={spectrum ? "Coverage points" : "Regimen coverage"}
      expectedTitle={spectrum ? "Covers / misses" : "Preferred regimen + key points"}
      explanation={problem.explanation}
      explanationLabel={spectrum ? "Teaching" : "Worked solution"}
      placeholder={spectrum ? "What it covers, and the notable gaps…" : "The antibiotic(s) you'd start, and why…"}
      newLabel={newLabel}
      {...rest}
    />
  );
}

/** High-Yield deck dispatcher: integrated cases render a coverage drill;
 *  referenced items (ekg/cxr/score/antibiotics) render their native bank's
 *  component. Progress is keyed under the High-Yield item id because the
 *  parent drill type is "high-yield". */
function HighYieldDrill({
  problem,
  ...shared
}: {
  problem: HighYieldDrillProblem | null;
  answer: string;
  setAnswer: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
  onRecord: (pct: number) => void;
  progressEntry?: DrillProgress;
  onSetManual: (m: DrillManual) => void;
}) {
  if (!problem) {
    return (
      <div className="card p-4">
        <p className="muted text-center">No high-yield drills available yet.</p>
      </div>
    );
  }
  if (problem.modality === "ekg" || problem.modality === "cxr") {
    const n = problem.modality === "ekg" ? problem.ekgN : problem.cxrN;
    const pool = problem.modality === "ekg" ? EKG_DRILLS : CXR_DRILLS;
    const img = pool.find((p) => p.n === n) ?? null;
    return <ImageReadDrill kind={problem.modality} problem={img} {...shared} />;
  }
  if (problem.modality === "score") {
    const sc = SCORE_DRILLS.find((p) => p.id === problem.scoreId) ?? null;
    return <ScoreDrill problem={sc} {...shared} />;
  }
  if (problem.modality === "antibiotics") {
    const abx = ANTIBIOTIC_DRILLS.find((p) => p.id === problem.antibioticId) ?? null;
    return <AntibioticDrill problem={abx} drillType="high-yield" newLabel="Next →" {...shared} />;
  }
  if (problem.modality === "skill") {
    const sk = SKILL_DRILLS.find((p) => skillDrillId(p) === problem.skillRef) ?? null;
    return <SkillDrill problem={sk} {...shared} />;
  }
  // integrated authored case
  return (
    <CoverageDrill
      drillType="high-yield"
      title={problem.name}
      badge={problem.category}
      vignette={problem.vignette ?? ""}
      items={problem.answer ?? []}
      coverageLabel="Key actions"
      expectedTitle="High-yield answer"
      explanation={`${problem.explanation ?? ""}${problem.manualPage ? `\n\n(${problem.manualPage})` : ""}`}
      explanationLabel="Teaching"
      placeholder="Your diagnosis and immediate management…"
      newLabel="Next →"
      {...shared}
    />
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
  onRecord,
  progressEntry,
  onSetManual,
}: {
  problem: SkillDrillProblem | null;
  answer: string;
  setAnswer: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
  onRecord: (pct: number) => void;
  progressEntry?: DrillProgress;
  onSetManual: (m: DrillManual) => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  if (!problem) return null;
  const groups = [{ group: problem.skill, items: problem.answer }];

  const doGrade = async () => {
    setGrading(true);
    try {
      const m = await grader(answer, groups);
      setMatched(m);
      const r = buildCoverage(groups, m);
      const pct = r.total > 0 ? Math.round((r.named / r.total) * 100) : 0;
      track("drill", { drillType: "skills", pct });
      onRecord(pct);
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
          <MasteryControls entry={progressEntry} onSetManual={onSetManual} />
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
  onRecord,
  progressEntry,
  onSetManual,
}: {
  category: CategoryCurriculum;
  stem: PracticeCase | null;
  workup: string;
  setWorkup: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
  onRecord: (pct: number) => void;
  progressEntry?: DrillProgress;
  onSetManual: (m: DrillManual) => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  // Interactive "results steer you" follow-up.
  const [steer, setSteer] = useState("");
  const [steerGraded, setSteerGraded] = useState(false);
  const [steerGrading, setSteerGrading] = useState(false);
  const [steerMatched, setSteerMatched] = useState<Set<string>>(new Set());

  // The work-up answer key is THIS presentation's targeted work-up when the stem
  // has one (e.g. cortisol/ACTH for an adrenal crisis) — not just the broad
  // category menu, which can omit scenario-critical tests. Fall back to the
  // broad menu for the generic "a patient presents with X" prompt.
  const targetedWorkup = stem?.workup ?? [];
  const groups = targetedWorkup.length
    ? [{ group: "Targeted work-up for this patient", items: targetedWorkup }]
    : [
        { group: "Labs", items: category.workupMenu.labs.map((l) => l.test) },
        { group: "Imaging & other", items: category.workupMenu.imaging.map((i) => i.test) },
      ];

  const doGrade = async () => {
    setGrading(true);
    try {
      const m = await grader(workup, groups);
      setMatched(m);
      const r = buildCoverage(groups, m);
      const pct = r.total > 0 ? Math.round((r.named / r.total) * 100) : 0;
      track("drill", { drillType: "workup", pct });
      onRecord(pct);
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
            <CoverageView
              title={targetedWorkup.length ? "Work-up for this presentation" : "Broad work-up menu"}
              coverage={result.coverage}
            />
            {targetedWorkup.length > 0 && (
              <div className="text-[12px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
                <span className="font-semibold">
                  Broad {category.category.toLowerCase()} menu —{" "}
                </span>
                {[...category.workupMenu.labs, ...category.workupMenu.imaging]
                  .map((t) => t.test)
                  .join(" · ")}
              </div>
            )}
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
          <MasteryControls entry={progressEntry} onSetManual={onSetManual} />
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
  onRecord,
  progressEntry,
  onSetManual,
}: {
  problem: ManagementDrillProblem | null;
  answer: string;
  setAnswer: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
  onRecord: (pct: number) => void;
  progressEntry?: DrillProgress;
  onSetManual: (m: DrillManual) => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  if (!problem) return null;
  const groups = [{ group: "Management", items: problem.actions }];

  const doGrade = async () => {
    setGrading(true);
    try {
      const m = await grader(answer, groups);
      setMatched(m);
      const r = buildCoverage(groups, m);
      const pct = r.total > 0 ? Math.round((r.named / r.total) * 100) : 0;
      track("drill", { drillType: "management", pct });
      onRecord(pct);
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
          <MasteryControls entry={progressEntry} onSetManual={onSetManual} />
        </div>
      )}
    </div>
  );
}

/** In-app enlarge for a study image (no tab switch). */
function ImgLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="scrim cursor-zoom-out"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} enlarged`}
      onClick={onClose}
      style={{ background: "rgba(20,16,44,.82)", padding: "1.5rem" }}
    >
      <img src={src} alt={alt} className="rounded-lg bg-white" style={{ maxWidth: "94vw", maxHeight: "90vh", objectFit: "contain" }} />
      <button
        autoFocus
        className="btn absolute top-4 right-4 border-none"
        style={{ background: "rgba(255,255,255,.92)" }}
        onClick={onClose}
        aria-label="Close enlarged view"
      >
        ✕ Close
      </button>
    </div>
  );
}

/** EKG / CXR reading drill: read a real LITFL study, graded against its
 *  hallmark findings + diagnosis, with the authoritative LITFL read as teaching. */
function ImageReadDrill({
  kind,
  problem,
  answer,
  setAnswer,
  graded,
  onGrade,
  onNew,
  onRetry,
  onRecord,
  progressEntry,
  onSetManual,
}: {
  kind: "ekg" | "cxr";
  problem: ImageDrillProblem | null;
  answer: string;
  setAnswer: (v: string) => void;
  graded: boolean;
  onGrade: () => void;
  onNew: () => void;
  onRetry: () => void;
  onRecord: (pct: number) => void;
  progressEntry?: DrillProgress;
  onSetManual: (m: DrillManual) => void;
}) {
  const grader = useGrader();
  const [grading, setGrading] = useState(false);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState<string | null>(null);

  if (!problem) {
    return (
      <div className="card p-4">
        <p className="muted text-center">No {kind === "ekg" ? "EKG" : "CXR"} studies available.</p>
      </div>
    );
  }

  const modality = kind === "ekg" ? "12-lead EKG" : "chest X-ray";
  // Grade the WRITE-UP first: the systematic read (the hallmark findings a good
  // structured interpretation surfaces) is weighted 70% and the punchline
  // diagnosis 30% — the method matters more than just naming the answer. The
  // read group is listed first so it leads the model-answer display.
  const readGroup = { group: "Systematic read", items: problem.findings };
  const dxGroup = { group: "Diagnosis", items: [problem.diagnosis] };
  const groups = [readGroup, dxGroup];
  const READ_WEIGHT = 0.7;
  const weightedPct = (m: Set<string>): number => {
    const read = buildCoverage([readGroup], m);
    const dx = buildCoverage([dxGroup], m);
    const readFrac = read.total ? read.named / read.total : 0;
    const dxFrac = dx.total ? dx.named / dx.total : 0;
    return Math.round((READ_WEIGHT * readFrac + (1 - READ_WEIGHT) * dxFrac) * 100);
  };
  const doGrade = async () => {
    setGrading(true);
    try {
      const m = await grader(answer, groups);
      setMatched(m);
      track("drill", { drillType: kind, pct: weightedPct(m) });
      onRecord(weightedPct(m));
      onGrade();
    } finally {
      setGrading(false);
    }
  };
  const result = buildCoverage(groups, matched);
  const readResult = buildCoverage([readGroup], matched);
  const dxResult = buildCoverage([dxGroup], matched);
  const imgs = [problem.img, problem.img2].filter((s): s is string => !!s);

  return (
    <div className="space-y-3">
      <div className="card p-4 space-y-2.5">
        <div className="panel-label">Interpret this {modality}</div>
        {problem.vignette && (
          <div
            className="rounded-lg border px-3 py-2 text-[13px] leading-snug"
            style={{ background: "var(--color-exam-soft)", borderColor: "var(--color-exam-border)", color: "var(--color-exam-ink)" }}
          >
            <span className="font-bold">Clinical context: </span>
            {problem.vignette}
          </div>
        )}
        <p className="text-[13px]" style={{ color: "var(--color-exam-muted)" }}>
          Read it systematically, then commit to a diagnosis.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          {imgs.map((src, i) => (
            <button
              key={i}
              type="button"
              className="block flex-1 rounded-lg border overflow-hidden bg-white cursor-zoom-in p-0 relative group"
              style={{ borderColor: "var(--color-exam-border-strong)" }}
              onClick={() => setZoom(src)}
              title="Enlarge"
            >
              <img src={src} alt={`${modality}${i > 0 ? " (additional view)" : ""}`} loading="lazy" className="w-full max-h-[460px] object-contain" />
              <span
                className="absolute bottom-1.5 right-1.5 text-[10.5px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(42,34,83,.8)", color: "#fff" }}
              >
                🔍 enlarge
              </span>
            </button>
          ))}
        </div>
        <p className="hint flex items-center justify-between gap-2 flex-wrap">
          <span>LITFL {kind === "ekg" ? "ECG" : "CXR"} Library · © Life in the Fast Lane, CC BY-NC-SA 4.0</span>
          <a className="underline" style={{ color: "var(--color-exam-accent)" }} href={problem.url} target="_blank" rel="noopener noreferrer">
            View on LITFL ↗
          </a>
        </p>
      </div>

      <div className="card p-4 space-y-3">
        <div className="panel-label">Your read</div>
        <textarea
          className="input w-full resize-y leading-relaxed"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={kind === "ekg" ? "Rate, rhythm, axis, intervals, ST/T… then your diagnosis" : "Systematic read (RIP-ABCDE)… then your diagnosis"}
          aria-label="Your read"
        />
        <GradeButton
          graded={graded}
          grading={grading}
          disabled={!answer.trim()}
          onGrade={doGrade}
          onNew={onNew}
          onRetry={onRetry}
          newLabel="Next study →"
        />
      </div>

      {graded && (
        <div className="card p-4 space-y-4 pop-in">
          <div className="flex items-center justify-between gap-3">
            <div className="panel-label">Coverage</div>
            <ResultChip named={result.named} total={result.total} />
          </div>
          <ScoreBar named={readResult.named} total={readResult.total} label="Systematic read · 70%" />
          <ScoreBar named={dxResult.named} total={dxResult.total} label="Diagnosis · 30%" />
          <CoverageView title="Model answer — read it systematically first" coverage={result.coverage} />
          {problem.read && (
            <div>
              <div className="panel-label mb-1">Expert read — {problem.diagnosis}</div>
              <p className="text-[13px] leading-relaxed whitespace-pre-line" style={{ color: "var(--color-exam-muted)" }}>
                {problem.read}
              </p>
            </div>
          )}
          <AiCoachNote
            prompt={`Interpret this ${modality}. Read systematically and commit to a diagnosis.`}
            studentAnswer={answer}
            idealAnswer={`Diagnosis: ${problem.diagnosis}. Key findings: ${problem.findings.join("; ")}.`}
            rubric={problem.read || `${problem.diagnosis}: ${problem.findings.join("; ")}`}
          />
          <MasteryControls entry={progressEntry} onSetManual={onSetManual} />
        </div>
      )}

      {zoom && <ImgLightbox src={zoom} alt={modality} onClose={() => setZoom(null)} />}
    </div>
  );
}
