/**
 * Per-problem drill progress, localStorage-backed (osce.drills.v1). Records what
 * a student has attempted in each Framework Drill (differential / work-up /
 * management / EKG / CXR / skills) and how they did, so a problem is no longer
 * lost the moment it rotates away. Pure module — no React, no PHI (only a
 * coverage %, an attempt count, and timestamps against stable problem ids).
 */
import { CURRICULUM } from "./curriculum";
import { SKILL_DRILLS, type SkillDrillProblem } from "./skillDrills";
import { MANAGEMENT_DRILLS } from "./managementDrills";
import { EKG_DRILLS, CXR_DRILLS } from "./imageDrills";
import { SCORE_DRILLS } from "./scoreDrills";

export const DRILL_PROGRESS_KEY = "osce.drills.v1";

export type DrillType =
  | "differential"
  | "cantmiss"
  | "exam"
  | "oneliner"
  | "mechanisms"
  | "workup"
  | "management"
  | "ekg"
  | "cxr"
  | "scores"
  | "skills";

/** Student override layered on top of the score-based mastery signal. */
export type DrillManual = "none" | "mastered" | "review";

export interface DrillProgress {
  attempts: number;
  /** Best coverage %, 0-100. */
  bestPct: number;
  /** Most recent coverage %, 0-100. */
  lastPct: number;
  lastSeenAt: number;
  manual: DrillManual;
}

export type DrillProgressMap = Record<string, DrillProgress>;

/** Coverage at/above which a problem auto-counts as mastered. */
export const MASTERY_PCT = 80;

export const DRILL_TYPE_ORDER: DrillType[] = [
  "differential",
  "cantmiss",
  "exam",
  "oneliner",
  "mechanisms",
  "workup",
  "management",
  "ekg",
  "cxr",
  "scores",
  "skills",
];

export const DRILL_TYPE_LABELS: Record<DrillType, string> = {
  differential: "Differential",
  cantmiss: "Can't-miss",
  exam: "Exam",
  oneliner: "One-liner",
  mechanisms: "Mechanisms",
  workup: "Work-up",
  management: "Management",
  ekg: "EKG",
  cxr: "CXR",
  scores: "Scores",
  skills: "Skills",
};

export function drillKey(type: DrillType, id: string): string {
  return `${type}:${id}`;
}

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
  const prev = map[key];
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  const entry: DrillProgress = {
    attempts: (prev?.attempts ?? 0) + 1,
    bestPct: Math.max(prev?.bestPct ?? 0, clamped),
    lastPct: clamped,
    lastSeenAt: Date.now(),
    manual: prev?.manual ?? "none",
  };
  map[key] = entry;
  save(map);
  return entry;
}

export function setDrillManual(type: DrillType, id: string, manual: DrillManual): void {
  const map = loadDrillProgress();
  const key = drillKey(type, id);
  const prev = map[key];
  map[key] = prev
    ? { ...prev, manual }
    : { attempts: 0, bestPct: 0, lastPct: 0, lastSeenAt: Date.now(), manual };
  save(map);
}

/** Mastery = explicit student "mastered", else (not flagged "review" and best ≥ threshold). */
export function isMastered(p: DrillProgress | undefined): boolean {
  if (!p) return false;
  if (p.manual === "mastered") return true;
  if (p.manual === "review") return false;
  return p.bestPct >= MASTERY_PCT;
}

export function isSeen(p: DrillProgress | undefined): boolean {
  return !!p && p.attempts > 0;
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
  switch (type) {
    case "differential":
    case "cantmiss":
    case "exam":
    case "oneliner":
    case "mechanisms":
      // All complaint-based: one problem per chief-complaint category.
      return CURRICULUM.map((c) => ({ type, id: c.category, label: c.category, group: c.category }));
    case "scores":
      return SCORE_DRILLS.map((p) => ({ type, id: p.id, label: p.name, group: p.category }));
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
    case "skills":
      return SKILL_DRILLS.map((p) => ({
        type,
        id: skillDrillId(p),
        label: truncate(p.stem, 56),
        group: p.skill,
      }));
    case "ekg":
      return EKG_DRILLS.map((p) => ({ type, id: String(p.n), label: `EKG #${p.n}`, answer: p.diagnosis }));
    case "cxr":
      return CXR_DRILLS.map((p) => ({ type, id: String(p.n), label: `CXR #${p.n}`, answer: p.diagnosis }));
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
