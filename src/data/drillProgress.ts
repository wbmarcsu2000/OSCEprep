/**
 * Per-problem drill progress, localStorage-backed (osce.drills.v1). Records what
 * a student has attempted in each Framework Drill (differential / work-up /
 * management / EKG / CXR / skills) and how they did, so a problem is no longer
 * lost the moment it rotates away. Pure module — no React, no PHI (only a
 * coverage %, an attempt count, and timestamps against stable problem ids).
 */
import { CURRICULUM } from "./curriculum";
import { SKILL_DRILLS, SKILL_DRILL_TYPES, type SkillDrillProblem } from "./skillDrills";
import { MANAGEMENT_DRILLS } from "./managementDrills";
import { EKG_DRILLS, CXR_DRILLS } from "./imageDrills";
import { SCORE_DRILLS } from "./scoreDrills";
import { ANTIBIOTIC_DRILLS } from "./antibioticDrills";
import { HIGH_YIELD_DRILLS, highYieldGroup } from "./highYieldDrills";
import {
  type DrillProgress,
  type DrillManual,
  MASTERY_PCT,
  isMastered,
  isSeen,
  drillKey as coreDrillKey,
  applyAttempt,
  applyManual,
} from "./drillProgressCore";

export { type DrillProgress, type DrillManual, MASTERY_PCT, isMastered, isSeen };
export type DrillProgressMap = Record<string, DrillProgress>;
export const drillKey = (type: DrillType, id: string): string => coreDrillKey(type, id);

export const DRILL_PROGRESS_KEY = "osce.drills.v1";

export type DrillType =
  | "high-yield"
  | "differential"
  | "workup"
  | "management"
  | "antibiotics"
  | "ekg"
  | "cxr"
  | "scores"
  | "skills"
  | "lab-csf"
  | "lab-iron"
  | "lab-lfts"
  | "lab-hypona"
  | "lab-synovial"
  | "lab-tfts"
  | "lab-ua"
  | "lab-coags";

/** Lab-interpretation banks that each get their own drill tab (vs the combined
 *  "Skills" tab for ABG/SAAG/Pleural/PFT). Maps the tab's drill type to its skill
 *  in SKILL_DRILLS. */
export const LAB_TABS: { type: DrillType; skill: SkillDrillProblem["skill"]; emoji: string }[] = [
  { type: "lab-csf", skill: "CSF", emoji: "💧" },
  { type: "lab-iron", skill: "Iron studies", emoji: "🩸" },
  { type: "lab-lfts", skill: "LFTs", emoji: "🟠" },
  { type: "lab-hypona", skill: "Hyponatremia", emoji: "🧂" },
  { type: "lab-synovial", skill: "Synovial fluid", emoji: "🦴" },
  { type: "lab-tfts", skill: "TFTs", emoji: "🦋" },
  { type: "lab-ua", skill: "Urinalysis", emoji: "🧫" },
  { type: "lab-coags", skill: "Coags", emoji: "🩹" },
];
export const labSkillForType = (t: DrillType): SkillDrillProblem["skill"] | undefined =>
  LAB_TABS.find((l) => l.type === t)?.skill;

export const DRILL_TYPE_ORDER: DrillType[] = [
  "high-yield",
  "differential",
  "workup",
  "management",
  "antibiotics",
  "ekg",
  "cxr",
  "scores",
  "skills",
  "lab-csf",
  "lab-iron",
  "lab-lfts",
  "lab-hypona",
  "lab-synovial",
  "lab-tfts",
  "lab-ua",
  "lab-coags",
];

export const DRILL_TYPE_LABELS: Record<DrillType, string> = {
  "high-yield": "High-Yield",
  differential: "Differential",
  workup: "Work-up",
  management: "Management",
  antibiotics: "Antibiotics",
  ekg: "EKG",
  cxr: "CXR",
  scores: "Scores",
  skills: "Skills",
  "lab-csf": "CSF",
  "lab-iron": "Iron studies",
  "lab-lfts": "LFTs",
  "lab-hypona": "Hyponatremia",
  "lab-synovial": "Synovial fluid",
  "lab-tfts": "TFTs",
  "lab-ua": "Urinalysis",
  "lab-coags": "Coags",
};

/** Emoji marker per drill type — the single source for the drill-type rail (lab
 *  emojis intentionally mirror LAB_TABS so the two never drift). */
export const DRILL_TYPE_EMOJI: Record<DrillType, string> = {
  "high-yield": "⭐",
  differential: "🧠",
  workup: "🧪",
  management: "🩺",
  antibiotics: "💊",
  ekg: "🫀",
  cxr: "🩻",
  scores: "🔢",
  skills: "📐",
  "lab-csf": "💧",
  "lab-iron": "🩸",
  "lab-lfts": "🟠",
  "lab-hypona": "🧂",
  "lab-synovial": "🦴",
  "lab-tfts": "🦋",
  "lab-ua": "🧫",
  "lab-coags": "🩹",
};

/** Sectioned drill types for the side rail: the workflow frameworks vs the
 *  per-bank lab-interpretation tabs. Order matches DRILL_TYPE_ORDER. */
export const DRILL_TAB_GROUPS: { label: string; types: DrillType[] }[] = [
  { label: "Exam prep", types: ["high-yield"] },
  { label: "Frameworks", types: ["differential", "workup", "management", "antibiotics", "ekg", "cxr", "scores", "skills"] },
  { label: "Lab interpretation", types: LAB_TABS.map((l) => l.type) },
];

export function loadDrillProgress(): DrillProgressMap {
  try {
    const raw = localStorage.getItem(DRILL_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as DrillProgressMap) : {};
  } catch {
    return {};
  }
}

function save(map: DrillProgressMap): void {
  try {
    localStorage.setItem(DRILL_PROGRESS_KEY, JSON.stringify(map));
  } catch {
    // storage unavailable — progress just won't persist this session
  }
}

/** Record one graded attempt; returns the updated entry. */
export function recordDrillAttempt(type: DrillType, id: string, pct: number): DrillProgress {
  const map = loadDrillProgress();
  const key = drillKey(type, id);
  const entry = applyAttempt(map[key], pct, Date.now());
  map[key] = entry;
  save(map);
  return entry;
}

export function setDrillManual(type: DrillType, id: string, manual: DrillManual): void {
  const map = loadDrillProgress();
  const key = drillKey(type, id);
  map[key] = applyManual(map[key], manual, Date.now());
  save(map);
}

// ---- Catalog: the full ordered set of problems per drill type ----------------

export interface DrillCatalogItem {
  type: DrillType;
  id: string;
  /** Spoiler-safe label (the prompt / identity, never the answer). */
  label: string;
  /** Optional grouping (chief complaint / skill). */
  group?: string;
  /** The answer/diagnosis — the UI shows this only for already-attempted problems. */
  answer?: string;
}

const SKILL_SLUG: Record<SkillDrillProblem["skill"], string> = {
  ABG: "abg",
  "Ascitic (SAAG)": "saag",
  "Pleural (Light's)": "pleural",
  PFT: "pft",
  CSF: "csf",
  "Iron studies": "iron",
  LFTs: "lft",
  Hyponatremia: "hypona",
  "Synovial fluid": "synovial",
  TFTs: "tft",
  Urinalysis: "ua",
  Coags: "coags",
};

// Stable per-skill ordinal id, computed once from the (static) bank order.
const SKILL_IDS = new Map<SkillDrillProblem, string>();
{
  const counts: Record<string, number> = {};
  for (const p of SKILL_DRILLS) {
    const slug = SKILL_SLUG[p.skill] ?? "skill";
    counts[slug] = (counts[slug] ?? 0) + 1;
    SKILL_IDS.set(p, `${slug}-${counts[slug]}`);
  }
}

export function skillDrillId(p: SkillDrillProblem): string {
  return SKILL_IDS.get(p) ?? `skill-${p.stem.slice(0, 12)}`;
}

function truncate(s: string, n = 64): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

export function drillCatalog(type: DrillType): DrillCatalogItem[] {
  // Lab-interpretation tabs: one problem per study in that skill's bank.
  const labSkill = labSkillForType(type);
  if (labSkill) {
    return SKILL_DRILLS.filter((p) => p.skill === labSkill).map((p) => ({
      type,
      id: skillDrillId(p),
      label: truncate(p.stem, 56),
      group: labSkill,
    }));
  }
  switch (type) {
    case "differential":
      return CURRICULUM.map((c) => ({ type, id: c.category, label: c.category, group: c.category }));
    case "scores":
      return SCORE_DRILLS.map((p) => ({ type, id: p.id, label: p.name, group: p.category }));
    case "antibiotics":
      return ANTIBIOTIC_DRILLS.map((p) => ({ type, id: p.id, label: p.name, group: p.category }));
    case "high-yield":
      return HIGH_YIELD_DRILLS.map((p) => ({ type, id: p.id, label: p.name, group: highYieldGroup(p) }));
    case "workup":
      return CURRICULUM.flatMap((c) =>
        c.practiceCases.map((pc, i) => ({
          type,
          id: `${c.category}#${i}`,
          label: truncate(pc.vignette),
          group: c.category,
        })),
      );
    case "management":
      return MANAGEMENT_DRILLS.map((p) => ({
        type,
        id: p.caseId,
        label: truncate(p.vignette),
        group: p.category,
        answer: p.diagnosis,
      }));
    case "skills": {
      // Combined Skills tab: only the dropdown skills (the labs are own tabs).
      const dropdown = new Set<string>(SKILL_DRILL_TYPES);
      return SKILL_DRILLS.filter((p) => dropdown.has(p.skill)).map((p) => ({
        type,
        id: skillDrillId(p),
        label: truncate(p.stem, 56),
        group: p.skill,
      }));
    }
    case "ekg":
      return EKG_DRILLS.map((p) => ({ type, id: String(p.n), label: `EKG #${p.n}`, answer: p.diagnosis }));
    case "cxr":
      return CXR_DRILLS.map((p) => ({ type, id: String(p.n), label: `CXR #${p.n}`, answer: p.diagnosis }));
    default:
      return []; // lab-* types handled above
  }
}

export interface DrillTypeSummary {
  type: DrillType;
  total: number;
  seen: number;
  mastered: number;
  needsWork: number;
  /** Mean best-coverage % across attempted problems (performance), 0-100. */
  avgBestPct: number;
  /** Total graded attempts across this type. */
  attempts: number;
}

export function summarize(type: DrillType, progress: DrillProgressMap): DrillTypeSummary {
  const items = drillCatalog(type);
  let seen = 0;
  let mastered = 0;
  let needsWork = 0;
  let bestSum = 0;
  let attempts = 0;
  for (const it of items) {
    const p = progress[drillKey(type, it.id)];
    if (isMastered(p)) mastered += 1;
    if (p?.manual === "review") needsWork += 1;
    if (isSeen(p)) {
      seen += 1;
      bestSum += p!.bestPct;
      attempts += p!.attempts;
    }
  }
  return {
    type,
    total: items.length,
    seen,
    mastered,
    needsWork,
    avgBestPct: seen > 0 ? Math.round(bestSum / seen) : 0,
    attempts,
  };
}
