/**
 * Deterministic scoring engine. The final number is ALWAYS computed here from
 * case metadata. An optional `llmMatches` map (stepId → item texts the LLM
 * judged semantically present) may ADD credited matches, but every credited
 * item must exist verbatim in the case's scoring metadata — unknown items are
 * discarded — and points come from the case JSON, never the LLM.
 */

import type {
  CaseModel,
  CreditedItem,
  EngineState,
  RawScoringItem,
  ScoreReport,
  ScoreBand,
  SectionResult,
  StepModel,
  DomainKey,
} from "./types";
import { DOMAIN_KEYS } from "./types";
import { bestOverlap, isNegatedIn, itemMatches, penaltyMatches, tokens } from "./textMatch";
import { stepDomain } from "./schemaAdapter";
import { MANEUVER_BY_ID } from "./maneuvers";

export type LlmMatches = Record<string, string[]>;

const OMISSION_RE = /^\s*(no|not|fails? to|omits?|missing|never|doesn'?t)\b/i;

function isOmissionPenalty(item: string): boolean {
  return OMISSION_RE.test(item);
}

/** "no EKG/troponin ordered" → penalty applies when NONE of the named things
 *  appear in the answer. */
function omissionPenaltyApplies(answer: string, item: string): boolean {
  const stripped = item
    .replace(OMISSION_RE, "")
    .replace(/\b(ordered|orders?|given|done|performed|obtained|checked)\b/gi, " ");
  const alternatives = stripped.split(/[/,]| or /i).filter((a) => tokens(a).length > 0);
  if (alternatives.length === 0) return false;
  return alternatives.every((alt) => bestOverlap(answer, alt) < 0.6);
}

function llmMatched(llm: string[] | undefined, item: string): boolean {
  return !!llm && llm.includes(item);
}

export interface GradeOptions {
  llmItems?: string[];
  /** Broad category-framework items (differential buckets / work-up menu) that
   *  earn bonus credit when named — rewards a wide differential and broad
   *  work-up. Capped within the section like any bonus. */
  breadthItems?: string[];
}

/** Grade one step's free-text answer against its case-authored scoring. */
export function gradeStep(
  step: StepModel,
  answer: string,
  opts: GradeOptions = {},
  caseDiagnosis = "",
): SectionResult {
  const scoring = step.scoring;
  const credited: CreditedItem[] = [];
  const missed: CreditedItem[] = [];
  const penaltiesApplied: CreditedItem[] = [];
  const max = scoring?.maxPoints ?? step.max;
  let earned = 0;

  const critical = scoring?.criticalActions ?? [];
  const core = scoring?.coreActions ?? [];
  const bonus = scoring?.bonusActions ?? [];
  const penalties = scoring?.penalties ?? [];

  const creditOne = (
    entry: RawScoringItem,
    kind: "critical" | "core" | "bonus",
  ): boolean => {
    const viaLlm = llmMatched(opts.llmItems, entry.item);
    const viaText = answer.length > 0 && itemMatches(answer, entry.item);
    if (viaLlm || viaText) {
      credited.push({
        item: entry.item,
        points: entry.points,
        kind,
        evidence: viaText ? "matched in your answer" : "semantic match (LLM-assisted)",
      });
      return true;
    }
    missed.push({ item: entry.item, points: entry.points, kind, evidence: "not found in your answer" });
    return false;
  };

  for (const entry of critical) if (creditOne(entry, "critical")) earned += entry.points;
  for (const entry of core) if (creditOne(entry, "core")) earned += entry.points;

  // Points not covered by critical/core items (e.g. the "revised dx" step has
  // an empty scoring block) are graded by overlap with the ideal answer.
  const itemizedMax =
    critical.reduce((a, b) => a + b.points, 0) + core.reduce((a, b) => a + b.points, 0);
  const remainder = Math.max(0, max - itemizedMax);
  if (remainder > 0 && step.idealAnswer && answer.length > 0) {
    const ratio = bestOverlap(answer, step.idealAnswer);
    const pts = Math.round(ratio * remainder);
    if (pts > 0) {
      earned += pts;
      credited.push({
        item: "Agreement with the ideal answer",
        points: pts,
        kind: "core",
        evidence: `${Math.round(ratio * 100)}% of the ideal answer's content present`,
      });
    }
  }

  // Bonus is additive but the section never exceeds its max (bonus capped).
  for (const entry of bonus) {
    const viaLlm = llmMatched(opts.llmItems, entry.item);
    if ((answer.length > 0 && itemMatches(answer, entry.item)) || viaLlm) {
      const headroom = Math.max(0, max - earned);
      const pts = Math.min(entry.points, headroom);
      earned += pts;
      credited.push({ item: entry.item, points: pts, kind: "bonus", evidence: "bonus credited" });
    }
  }

  // Breadth credit: reward naming items from the broad category framework
  // (differential buckets / work-up menu) that the case's own scoring didn't
  // already cover. Additive, capped at the section max like any bonus.
  if (opts.breadthItems && opts.breadthItems.length > 0 && answer.length > 0) {
    const alreadyCredited = (item: string): boolean =>
      credited.some((c) => bestOverlap(c.item, item) >= 0.7 || bestOverlap(item, c.item) >= 0.7);
    let breadthAwarded = 0;
    const breadthCap = Math.max(2, Math.round(max * 0.25)); // breadth tops out at ¼ section
    for (const item of opts.breadthItems) {
      if (earned >= max || breadthAwarded >= breadthCap) break;
      if (alreadyCredited(item)) continue;
      if (itemMatches(answer, item) && !isNegatedIn(answer, item)) {
        const pts = Math.min(1, max - earned, breadthCap - breadthAwarded);
        if (pts <= 0) break;
        earned += pts;
        breadthAwarded += pts;
        credited.push({
          item,
          points: pts,
          kind: "bonus",
          evidence: "broad differential / work-up — framework item",
        });
      }
    }
  }

  earned = Math.min(earned, max);

  // Penalties: distinct context so correct answers sharing tokens with the
  // penalty phrasing are not punished.
  const context = [
    ...critical.map((c) => c.item),
    ...core.map((c) => c.item),
    ...bonus.map((c) => c.item),
    step.idealAnswer ?? "",
    step.prompt,
    caseDiagnosis,
  ];
  const creditedCritical = credited.some((c) => c.kind === "critical");
  for (const entry of penalties) {
    // "calls the study normal / misses the abnormality" cannot apply when the
    // student was credited for the critical finding.
    if (/\b(normal|misses)\b/i.test(entry.item) && creditedCritical) continue;
    const applies = isOmissionPenalty(entry.item)
      ? omissionPenaltyApplies(answer, entry.item)
      : answer.length > 0 && penaltyMatches(answer, entry.item, context);
    if (applies) {
      earned += entry.points; // points are negative in the JSON
      penaltiesApplied.push({
        item: entry.item,
        points: entry.points,
        kind: "penalty",
        evidence: isOmissionPenalty(entry.item)
          ? "required element absent from your answer"
          : "asserted in your answer",
      });
    }
  }

  earned = Math.max(0, Math.min(earned, max));
  return {
    sectionId: step.id,
    label: step.label,
    studentAnswer: answer,
    idealAnswer: step.idealAnswer,
    maxPoints: max,
    earned,
    credited,
    missed,
    penaltiesApplied,
    mghReference: step.mghReference ?? null,
  };
}

// ---------------------------------------------------------------------------
// Communication (deterministic heuristics; LLM may add matches)
// ---------------------------------------------------------------------------

type CommDetector = (studentTurns: string[]) => boolean;

const COMM_DETECTORS: { keys: string[]; detect: CommDetector }[] = [
  {
    keys: ["open-ended", "open ended", "opening"],
    detect: (turns) =>
      turns.length > 0 &&
      /\b(what|how|tell me|describe|walk me through)\b/i.test(turns[0]) &&
      !/^(do|does|did|is|are|have|has|any)\b/i.test(turns[0].trim()),
  },
  {
    keys: ["empathy", "empathic", "concern"],
    detect: (turns) =>
      turns.some((t) =>
        /\b(i'?m sorry|that sounds|that must be|i understand|understandably|we'?ll take good care|thank you for (sharing|telling))\b/i.test(t),
      ),
  },
  {
    keys: ["permission", "sensitive"],
    detect: (turns) =>
      turns.some((t) =>
        /\b(may i ask|is it (ok|okay|alright)|do you mind|if (it'?s|you'?re) (ok|okay|alright|comfortable)|i need to ask.*(personal|sensitive)|these are routine questions)\b/i.test(t),
      ),
  },
  {
    keys: ["next steps", "explains", "patient-friendly", "plan"],
    detect: (turns) =>
      turns.some((t) =>
        /\b(next,? (we|i)|we('?ll| will| are going to)|i('?m| am) going to (order|get|check)|the plan is|here'?s what happens next)\b/i.test(t),
      ),
  },
  {
    keys: ["understanding", "checks", "questions"],
    detect: (turns) =>
      turns.some((t) =>
        /\b(does that make sense|any questions|what questions|do you understand|is that clear|how does that sound)\b/i.test(t),
      ),
  },
];

export function gradeCommunication(
  caseModel: CaseModel,
  studentTurns: string[],
  llmItems?: string[],
): SectionResult | null {
  const comm = caseModel.communication;
  if (!comm) return null;
  const credited: CreditedItem[] = [];
  const missed: CreditedItem[] = [];
  let earned = 0;
  for (const entry of comm.items) {
    const detector = COMM_DETECTORS.find((d) =>
      d.keys.some((k) => entry.item.toLowerCase().includes(k)),
    );
    const viaHeuristic = detector ? detector.detect(studentTurns) : false;
    const viaLlm = llmMatched(llmItems, entry.item);
    if (viaHeuristic || viaLlm) {
      earned += entry.points;
      credited.push({
        item: entry.item,
        points: entry.points,
        kind: "core",
        evidence: viaHeuristic ? "observed in your encounter" : "semantic match (LLM-assisted)",
      });
    } else {
      missed.push({ item: entry.item, points: entry.points, kind: "core", evidence: "not observed" });
    }
  }
  earned = Math.min(earned, comm.maxPoints);
  return {
    sectionId: "communication",
    label: "Communication",
    studentAnswer: "",
    idealAnswer: null,
    maxPoints: comm.maxPoints,
    earned,
    credited,
    missed,
    penaltiesApplied: [],
  };
}

// ---------------------------------------------------------------------------
// Full report
// ---------------------------------------------------------------------------

export function scoreBandFor(bands: ScoreBand[], overall: number): string {
  const sorted = [...bands].sort((a, b) => b.min - a.min);
  for (const band of sorted) if (overall >= band.min) return band.label;
  return sorted.length > 0 ? sorted[sorted.length - 1].label : "";
}

/** Broad category-framework items to credit per step (differential buckets /
 *  work-up menu), supplied by the app layer so the engine stays case-agnostic. */
export type BreadthCredit = Record<string, string[]>;

export function buildScoreReport(
  caseModel: CaseModel,
  state: EngineState,
  bands: ScoreBand[],
  llmMatches: LlmMatches = {},
  breadth: BreadthCredit = {},
): ScoreReport {
  const sections: SectionResult[] = [];

  // --- History section
  const trigMax = caseModel.historyTriggers.reduce((a, t) => a + t.points, 0);
  let trigEarned = 0;
  const histCredited: CreditedItem[] = [];
  const histMissed: CreditedItem[] = [];
  for (const t of caseModel.historyTriggers) {
    const got = state.historyTriggersUnlocked.includes(t.id);
    const entry: CreditedItem = {
      item: t.id.replace(/_/g, " "),
      points: t.points,
      kind: t.importance === "critical" ? "critical" : t.importance === "bonus" ? "bonus" : "core",
      evidence: got ? "elicited during the encounter" : "never asked",
    };
    if (got) {
      trigEarned += t.points;
      histCredited.push(entry);
    } else {
      histMissed.push(entry);
    }
  }
  sections.push({
    sectionId: "history",
    label: "History Taking",
    studentAnswer: "",
    idealAnswer: null,
    maxPoints: trigMax,
    earned: trigEarned,
    credited: histCredited,
    missed: histMissed,
    penaltiesApplied: [],
  });

  // --- Physical exam section
  const examMax = caseModel.examMappings.reduce((a, m) => a + m.points, 0);
  let examEarned = 0;
  const examCredited: CreditedItem[] = [];
  const examMissed: CreditedItem[] = [];
  for (const m of caseModel.examMappings) {
    const got = state.examFindingsUnlocked.includes(m.id);
    const entry: CreditedItem = {
      item: m.finding,
      points: m.points,
      kind: m.importance === "critical" ? "critical" : m.importance === "bonus" ? "bonus" : "core",
      evidence: got
        ? "elicited by your exam"
        : `requires: ${m.revealedBy.map((r) => MANEUVER_BY_ID.get(r)?.label ?? r).join(" or ")}`,
    };
    if (got) {
      examEarned += m.points;
      examCredited.push(entry);
    } else {
      examMissed.push(entry);
    }
  }
  sections.push({
    sectionId: "physicalExam",
    label: "Physical Examination",
    studentAnswer: "",
    idealAnswer: null,
    maxPoints: examMax,
    earned: examEarned,
    credited: examCredited,
    missed: examMissed,
    penaltiesApplied: [],
  });

  // --- Post-encounter steps
  for (const step of caseModel.steps) {
    const answer = state.postEncounterAnswers[step.id] ?? "";
    sections.push(
      gradeStep(
        step,
        answer,
        { llmItems: llmMatches[step.id], breadthItems: breadth[step.id] },
        caseModel.diagnosis,
      ),
    );
  }

  // --- Communication (bonus domain)
  const studentTurns = state.conversation
    .filter((t) => t.role === "student")
    .map((t) => t.text);
  const communication = gradeCommunication(
    caseModel,
    studentTurns,
    llmMatches["communication"],
  );

  // --- Domain aggregation: raw earned/max scaled into case domain weights.
  const domainRaw: Record<DomainKey, { earned: number; max: number }> = {
    history: { earned: trigEarned, max: trigMax },
    physicalExam: { earned: examEarned, max: examMax },
    differential: { earned: 0, max: 0 },
    workup: { earned: 0, max: 0 },
    imageInterpretation: { earned: 0, max: 0 },
    management: { earned: 0, max: 0 },
  };
  for (const step of caseModel.steps) {
    const sec = sections.find((s) => s.sectionId === step.id)!;
    const d = stepDomain(step.id, step.type);
    domainRaw[d].earned += sec.earned;
    domainRaw[d].max += sec.maxPoints;
  }

  const domainScores: Record<string, number> = {};
  const domainMax: Record<string, number> = {};
  let overall = 0;
  for (const key of DOMAIN_KEYS) {
    const weight = caseModel.domainWeights[key];
    const raw = domainRaw[key];
    const scaled = raw.max > 0 ? (raw.earned / raw.max) * weight : 0;
    domainScores[key] = Math.round(scaled * 10) / 10;
    domainMax[key] = weight;
    overall += scaled;
  }
  if (communication) {
    domainScores["communication"] = communication.earned;
    domainMax["communication"] = communication.maxPoints;
    overall += communication.earned; // bonus domain
  }
  overall = Math.max(0, Math.min(100, Math.round(overall)));

  // --- Aggregated misses
  const diffStep = caseModel.steps.find((s) => s.id === "differential");
  const diffAnswer = state.postEncounterAnswers["differential"] ?? "";
  const revisedAnswer = state.postEncounterAnswers["revised"] ?? "";
  const missedDifferentials = (diffStep?.mustNotMiss ?? []).filter(
    (d) =>
      !itemMatches(diffAnswer, d) &&
      !itemMatches(revisedAnswer, d) &&
      !llmMatched(llmMatches["differential"], d),
  );

  const workupStep = caseModel.steps.find((s) => s.id === "workup");
  const workupAnswer = state.postEncounterAnswers["workup"] ?? "";
  const missedWorkup = (workupStep?.requiredTests ?? []).filter(
    (t) => !itemMatches(workupAnswer, t) && !llmMatched(llmMatches["workup"], t),
  );

  const missedInterpretation: string[] = [];
  for (const step of caseModel.steps) {
    if (step.type !== "read") continue;
    const ans = state.postEncounterAnswers[step.id] ?? "";
    for (const f of [...step.criticalFindings, ...step.keyFindings]) {
      if (!itemMatches(ans, f) && !llmMatched(llmMatches[step.id], f)) {
        missedInterpretation.push(`${step.label}: ${f}`);
      }
    }
  }

  const mgmtStep = caseModel.steps.find((s) => s.id === "management");
  const mgmtAnswer = state.postEncounterAnswers["management"] ?? "";
  const missedManagement = (mgmtStep?.requiredActions ?? []).filter(
    (a) => !itemMatches(mgmtAnswer, a) && !llmMatched(llmMatches["management"], a),
  );

  const unsafeActions: string[] = [];
  if (mgmtStep) {
    const context = [
      ...(mgmtStep.scoring?.criticalActions ?? []).map((i) => i.item),
      ...(mgmtStep.scoring?.coreActions ?? []).map((i) => i.item),
      mgmtStep.idealAnswer ?? "",
      caseModel.diagnosis,
    ];
    for (const u of mgmtStep.unsafeActions) {
      if (mgmtAnswer.length > 0 && penaltyMatches(mgmtAnswer, u, context)) {
        unsafeActions.push(u);
      }
    }
  }
  for (const sec of sections) {
    for (const p of sec.penaltiesApplied) {
      if (!unsafeActions.includes(p.item) && !isOmissionPenalty(p.item)) {
        unsafeActions.push(p.item);
      }
    }
  }

  // Missed maneuvers (by mapping, deduplicated by maneuver id)
  const missedManeuvers: ScoreReport["missedManeuvers"] = [];
  for (const m of caseModel.examMappings) {
    if (state.examFindingsUnlocked.includes(m.id)) continue;
    for (const maneuverId of m.revealedBy) {
      if (!missedManeuvers.some((x) => x.maneuverId === maneuverId)) {
        missedManeuvers.push({ maneuverId, importance: m.importance, finding: m.finding });
      }
    }
  }

  const mappedManeuvers = new Set(caseModel.examMappings.flatMap((m) => m.revealedBy));
  const unnecessaryManeuvers = state.examManeuversPerformed.filter(
    (id) => !mappedManeuvers.has(id),
  );

  const missedHistory = caseModel.historyTriggers
    .filter((t) => !state.historyTriggersUnlocked.includes(t.id))
    .map((t) => ({ id: t.id, concepts: t.concepts, importance: t.importance }));

  const criticalMisses: string[] = [];
  for (const t of caseModel.historyTriggers) {
    if (t.importance === "critical" && !state.historyTriggersUnlocked.includes(t.id)) {
      criticalMisses.push(`History: never asked about ${t.id.replace(/_/g, " ")}`);
    }
  }
  for (const m of caseModel.examMappings) {
    if (m.importance === "critical" && !state.examFindingsUnlocked.includes(m.id)) {
      criticalMisses.push(`Exam: missed ${m.finding}`);
    }
  }
  for (const sec of sections) {
    for (const miss of sec.missed) {
      if (miss.kind === "critical") {
        criticalMisses.push(`${sec.label}: ${miss.item}`);
      }
    }
  }

  const cs = caseModel.caseSummary;
  const pearls = [
    ...(cs.managementPearls ?? []),
    ...(cs.imageInterpretationPearls ?? []),
  ];
  const pitfalls = cs.commonPitfalls ?? [];

  return {
    overall,
    band: scoreBandFor(bands, overall),
    domainScores,
    domainMax,
    sections,
    communication,
    missedHistory,
    missedManeuvers,
    unnecessaryManeuvers,
    missedDifferentials,
    missedWorkup,
    missedInterpretation,
    missedManagement,
    criticalMisses,
    unsafeActions,
    pearls,
    pitfalls,
  };
}
