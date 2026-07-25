// src/data/guidelineDrillProgress.ts
/**
 * Guideline-drill progress for any DrillBank, localStorage-backed under the
 * bank's own storage key (e.g. osce.fmdrills.v1, osce.obdrills.v1) — separate
 * from the IM drills. Pure logic comes from drillProgressCore; this module
 * only adds the storage wrapper + per-domain summary.
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
import { type DrillBank, drillsForDomain } from "./guidelineDrillBank";

export type DrillBankProgressMap = Record<string, DrillProgress>;

export function loadDrillBankProgress(storageKey: string): DrillBankProgressMap {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as DrillBankProgressMap) : {};
  } catch {
    return {};
  }
}

function save(storageKey: string, map: DrillBankProgressMap): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(map));
  } catch {
    // storage unavailable — progress just won't persist this session
  }
}

export function recordDrillBankAttempt(
  storageKey: string,
  domain: string,
  id: string,
  pct: number,
): DrillProgress {
  const map = loadDrillBankProgress(storageKey);
  const key = drillKey(domain, id);
  const entry = applyAttempt(map[key], pct, Date.now());
  map[key] = entry;
  save(storageKey, map);
  return entry;
}

export function setDrillBankManual(
  storageKey: string,
  domain: string,
  id: string,
  manual: DrillManual,
): void {
  const map = loadDrillBankProgress(storageKey);
  const key = drillKey(domain, id);
  map[key] = applyManual(map[key], manual, Date.now());
  save(storageKey, map);
}

export interface DrillDomainSummary {
  total: number;
  seen: number;
  mastered: number;
  needsWork: number;
  avgBestPct: number;
}

export function summarizeDrillDomain(
  bank: DrillBank,
  domain: string,
  map: DrillBankProgressMap,
): DrillDomainSummary {
  const items = drillsForDomain(bank, domain);
  let seen = 0, mastered = 0, needsWork = 0, bestSum = 0;
  for (const d of items) {
    const p = map[drillKey(domain, d.id)];
    if (isMastered(p)) mastered += 1;
    if (p?.manual === "review") needsWork += 1;
    if (isSeen(p)) {
      seen += 1;
      bestSum += p!.bestPct;
    }
  }
  return { total: items.length, seen, mastered, needsWork, avgBestPct: seen > 0 ? Math.round(bestSum / seen) : 0 };
}
