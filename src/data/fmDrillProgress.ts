/**
 * FM guideline-drill progress, localStorage-backed under its own key
 * (osce.fmdrills.v1) — separate from the IM drills. Pure logic comes from
 * drillProgressCore; this module only adds the FM catalog + storage wrapper.
 */
import {
  type DrillProgress,
  type DrillManual,
  applyAttempt,
  applyManual,
  isMastered,
  isSeen,
  drillKey,
} from "./drillProgressCore";
import { type FmDrillDomain, fmDrillsForDomain } from "./fmGuidelineDrills";

export const FM_DRILL_PROGRESS_KEY = "osce.fmdrills.v1";

export type FmDrillProgressMap = Record<string, DrillProgress>;

export function fmDrillKey(domain: FmDrillDomain, id: string): string {
  return drillKey(domain, id);
}

export function loadFmProgress(): FmDrillProgressMap {
  try {
    const raw = localStorage.getItem(FM_DRILL_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as FmDrillProgressMap) : {};
  } catch {
    return {};
  }
}

function save(map: FmDrillProgressMap): void {
  try {
    localStorage.setItem(FM_DRILL_PROGRESS_KEY, JSON.stringify(map));
  } catch {
    // storage unavailable — progress just won't persist this session
  }
}

export function recordFmAttempt(domain: FmDrillDomain, id: string, pct: number): DrillProgress {
  const map = loadFmProgress();
  const key = fmDrillKey(domain, id);
  const entry = applyAttempt(map[key], pct, Date.now());
  map[key] = entry;
  save(map);
  return entry;
}

export function setFmManual(domain: FmDrillDomain, id: string, manual: DrillManual): void {
  const map = loadFmProgress();
  const key = fmDrillKey(domain, id);
  map[key] = applyManual(map[key], manual, Date.now());
  save(map);
}

export interface FmDomainSummary {
  total: number;
  seen: number;
  mastered: number;
  needsWork: number;
  avgBestPct: number;
}

export function fmSummarize(domain: FmDrillDomain, map: FmDrillProgressMap): FmDomainSummary {
  const items = fmDrillsForDomain(domain);
  let seen = 0, mastered = 0, needsWork = 0, bestSum = 0;
  for (const d of items) {
    const p = map[fmDrillKey(domain, d.id)];
    if (isMastered(p)) mastered += 1;
    if (p?.manual === "review") needsWork += 1;
    if (isSeen(p)) {
      seen += 1;
      bestSum += p!.bestPct;
    }
  }
  return { total: items.length, seen, mastered, needsWork, avgBestPct: seen > 0 ? Math.round(bestSum / seen) : 0 };
}
