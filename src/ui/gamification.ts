/**
 * Light gamification, derived entirely from the existing localStorage attempt
 * history — no new persistence, no server. Pure functions so the same numbers
 * render identically on Home, Feedback, and Analytics.
 */

import type { AttemptRecord } from "../analytics/store";

// ---- XP & levels ------------------------------------------------------------

/** XP for one completed station: the score itself, plus bonuses for excellence
 *  and safety. Repeat attempts earn full XP — repetition is the point. */
export function xpForAttempt(a: Pick<AttemptRecord, "overall" | "criticalMissCount">): number {
  let xp = Math.max(0, Math.round(a.overall));
  if (a.overall >= 85) xp += 20;
  if (a.criticalMissCount === 0) xp += 10;
  return xp;
}

export function totalXp(attempts: AttemptRecord[]): number {
  return attempts.reduce((sum, a) => sum + xpForAttempt(a), 0);
}

/** The training ladder. Thresholds are cumulative XP. */
export const LEVELS: { title: string; xp: number }[] = [
  { title: "Observer", xp: 0 },
  { title: "MS1", xp: 150 },
  { title: "MS2", xp: 400 },
  { title: "MS3", xp: 750 },
  { title: "Sub-Intern", xp: 1200 },
  { title: "Intern", xp: 1800 },
  { title: "Resident", xp: 2600 },
  { title: "Senior Resident", xp: 3600 },
  { title: "Chief Resident", xp: 4800 },
  { title: "Attending", xp: 6200 },
];

export interface LevelInfo {
  level: number; // 1-based
  title: string;
  xp: number;
  /** XP into the current level / XP needed to reach the next (0/0 at max). */
  intoLevel: number;
  toNext: number;
  /** 0..1 progress toward the next level (1 at max level). */
  progress: number;
}

export function levelFor(xp: number): LevelInfo {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) idx = i;
  }
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const intoLevel = xp - cur.xp;
  const toNext = next ? next.xp - cur.xp : 0;
  return {
    level: idx + 1,
    title: cur.title,
    xp,
    intoLevel,
    toNext,
    progress: next ? Math.min(1, intoLevel / toNext) : 1,
  };
}

// ---- Streak -----------------------------------------------------------------

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Consecutive calendar days (local time) with ≥1 completed station, counting
 *  back from today — or from yesterday, so today's not-yet-practiced morning
 *  doesn't read as a broken streak. */
/** Previous calendar day via setDate — DST-safe, unlike subtracting 24h of
 *  epoch time (which can skip or repeat a local day at transitions). */
function prevDay(ts: number): number {
  const d = new Date(ts);
  d.setDate(d.getDate() - 1);
  return d.getTime();
}

export function streakDays(attempts: AttemptRecord[], now: number): number {
  const days = new Set(attempts.map((a) => dayKey(a.completedAt)));
  if (days.size === 0) return 0;
  let cursor = now;
  if (!days.has(dayKey(cursor))) {
    cursor = prevDay(cursor); // allow the streak to be "alive" until midnight
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor = prevDay(cursor);
  }
  return streak;
}

/** True when the streak still needs a station today to stay alive. */
export function streakAtRisk(attempts: AttemptRecord[], now: number): boolean {
  return streakDays(attempts, now) > 0 && !attempts.some((a) => dayKey(a.completedAt) === dayKey(now));
}

// ---- Badges -----------------------------------------------------------------

export interface CatalogCase {
  id: string;
  category: string;
}

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  earned: boolean;
}

export function badges(
  attempts: AttemptRecord[],
  catalog: CatalogCase[],
  now: number,
): Badge[] {
  const uniqueCases = new Set(attempts.map((a) => a.caseId));
  const catTotals = new Map<string, number>();
  for (const c of catalog) catTotals.set(c.category, (catTotals.get(c.category) ?? 0) + 1);
  const catDone = new Map<string, Set<string>>();
  for (const a of attempts) {
    const s = catDone.get(a.category) ?? new Set<string>();
    s.add(a.caseId);
    catDone.set(a.category, s);
  }
  const masteredCategory = [...catTotals.entries()].find(
    ([cat, total]) => (catDone.get(cat)?.size ?? 0) >= total,
  )?.[0];
  const everyCategoryTouched =
    catTotals.size > 0 && [...catTotals.keys()].every((cat) => (catDone.get(cat)?.size ?? 0) > 0);

  // Score improved ≥15 points on a repeat of the same case.
  const bestBefore = new Map<string, number>();
  let comeback = false;
  for (const a of attempts) {
    const prev = bestBefore.get(a.caseId);
    if (prev !== undefined && a.overall >= prev + 15) comeback = true;
    bestBefore.set(a.caseId, Math.max(prev ?? -Infinity, a.overall));
  }

  const safeCount = attempts.filter((a) => a.criticalMissCount === 0).length;
  const streak = streakDays(attempts, now);

  return [
    { id: "first", emoji: "🩺", name: "First Rounds", desc: "Complete your first case", earned: attempts.length >= 1 },
    { id: "five", emoji: "💪", name: "Warming Up", desc: "Complete 5 cases", earned: attempts.length >= 5 },
    { id: "ten", emoji: "⚡", name: "Double Digits", desc: "Complete 10 cases", earned: attempts.length >= 10 },
    { id: "twentyfive", emoji: "🏅", name: "Quarter Century", desc: "Complete 25 cases", earned: attempts.length >= 25 },
    { id: "library", emoji: "🏆", name: "Full Library", desc: `Complete all ${catalog.length} cases`, earned: catalog.length > 0 && uniqueCases.size >= catalog.length },
    { id: "honors", emoji: "🎓", name: "Honors", desc: "Score 85+ on a case", earned: attempts.some((a) => a.overall >= 85) },
    { id: "nearperfect", emoji: "💎", name: "Near Perfect", desc: "Score 95+ on a case", earned: attempts.some((a) => a.overall >= 95) },
    { id: "safehands", emoji: "🤲", name: "Safe Hands", desc: "5 cases with zero critical misses", earned: safeCount >= 5 },
    { id: "streak3", emoji: "🔥", name: "On Fire", desc: "Practice 3 days in a row", earned: streak >= 3 },
    { id: "streak7", emoji: "🚀", name: "Unstoppable", desc: "Practice 7 days in a row", earned: streak >= 7 },
    { id: "specialist", emoji: "🫀", name: masteredCategory ? `Specialist: ${masteredCategory}` : "Specialist", desc: "Finish every case in one category", earned: !!masteredCategory },
    { id: "explorer", emoji: "🧭", name: "Explorer", desc: "Try a case in every category", earned: everyCategoryTouched },
    { id: "comeback", emoji: "📈", name: "Comeback", desc: "Beat your own score by 15+ on a retry", earned: comeback },
  ];
}

/** Badges newly earned by the latest attempt (for the feedback celebration). */
export function newlyEarnedBadges(
  attempts: AttemptRecord[],
  catalog: CatalogCase[],
  now: number,
): Badge[] {
  if (attempts.length === 0) return [];
  const before = new Set(
    badges(attempts.slice(0, -1), catalog, now)
      .filter((b) => b.earned)
      .map((b) => b.id),
  );
  return badges(attempts, catalog, now).filter((b) => b.earned && !before.has(b.id));
}

// ---- "What next?" recommendation ----------------------------------------------

export interface Recommendation {
  caseId: string;
  category: string;
  /** Why this station — shown verbatim to the student. */
  reason: string;
  kind: "weakness" | "retry" | "fresh";
}

/** Pick the most useful next station from the attempt history:
 *  1. weakest category (lowest mean score) that still has an unattempted or
 *     sub-70 station → drill the weakness;
 *  2. else the lowest-scoring completed station → beat your own score;
 *  3. else any unattempted station → keep exploring.
 *  Deterministic (no randomness) so Home doesn't reshuffle on re-render. */
export function recommendNext(
  attempts: AttemptRecord[],
  catalog: CatalogCase[],
): Recommendation | null {
  if (attempts.length === 0 || catalog.length === 0) return null;

  const best = new Map<string, number>();
  for (const a of attempts) best.set(a.caseId, Math.max(best.get(a.caseId) ?? -Infinity, a.overall));

  // Mean score per category, ascending.
  const byCat = new Map<string, number[]>();
  for (const a of attempts) byCat.set(a.category, [...(byCat.get(a.category) ?? []), a.overall]);
  const rankedCats = [...byCat.entries()]
    .map(([cat, scores]) => ({ cat, mean: scores.reduce((x, y) => x + y, 0) / scores.length }))
    .sort((a, b) => a.mean - b.mean);

  for (const { cat, mean } of rankedCats) {
    if (mean >= 80) break; // nothing here is a weakness worth targeting
    const candidate =
      catalog.find((c) => c.category === cat && !best.has(c.id)) ??
      catalog.find((c) => c.category === cat && (best.get(c.id) ?? 100) < 70);
    if (candidate) {
      return {
        caseId: candidate.id,
        category: cat,
        reason: `Your ${cat} average is ${Math.round(mean)} — sharpen it here`,
        kind: "weakness",
      };
    }
  }

  const weakest = [...best.entries()].sort((a, b) => a[1] - b[1])[0];
  if (weakest && weakest[1] < 85) {
    const c = catalog.find((x) => x.id === weakest[0]);
    if (c) {
      return {
        caseId: c.id,
        category: c.category,
        reason: `You scored ${weakest[1]} here — beat it on a retry`,
        kind: "retry",
      };
    }
  }

  const fresh = catalog.find((c) => !best.has(c.id));
  return fresh
    ? { caseId: fresh.id, category: fresh.category, reason: "A category you haven't tried yet", kind: "fresh" }
    : null;
}

// ---- Category flair -----------------------------------------------------------

/** `deep` is the accessible text/active tone (≥4.5:1 on white & on `soft`). */
const CATEGORY_FLAIR: { emoji: string; color: string; deep: string; soft: string; grad: string }[] = [
  { emoji: "🫀", color: "#e5484d", deep: "#c0262c", soft: "#feeeee", grad: "var(--grad-coral)" },
  { emoji: "🫁", color: "#3b9eff", deep: "#1864ab", soft: "#e3f1ff", grad: "var(--grad-sky)" },
  { emoji: "🔥", color: "#d97706", deep: "#9a4d00", soft: "#fff4e0", grad: "var(--grad-sun)" },
  { emoji: "🧠", color: "#6d4aff", deep: "#5634e0", soft: "#f0ebff", grad: "var(--grad-primary)" },
  { emoji: "🩸", color: "#f25eb0", deep: "#c2255c", soft: "#fde9f4", grad: "var(--grad-pink)" },
  { emoji: "🌀", color: "#00bfa6", deep: "#076a5b", soft: "#dff9f4", grad: "var(--grad-teal)" },
];

const CATEGORY_EMOJI: Record<string, string> = {
  "Chest Pain": "🫀",
  "Dyspnea": "🫁",
  "Abdominal Pain": "🍽️",
  "Altered Mental Status": "🧠",
  "Syncope": "💫",
  "Anemia": "🩸",
  "Diarrhea": "💧",
  "Fever": "🌡️",
  "Abnormal Liver Enzymes": "🟡",
};

/** Deterministic per-category accent (stable across renames-free sessions). */
export function categoryFlair(category: string): { emoji: string; color: string; deep: string; soft: string; grad: string } {
  let h = 0;
  for (let i = 0; i < category.length; i++) h = (h * 31 + category.charCodeAt(i)) >>> 0;
  const base = CATEGORY_FLAIR[h % CATEGORY_FLAIR.length];
  return { ...base, emoji: CATEGORY_EMOJI[category] ?? base.emoji };
}
