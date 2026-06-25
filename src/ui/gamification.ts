/**
 * Study-aid helpers derived from the localStorage attempt history — a next-case
 * recommendation and per-category visual flair. Pure functions, no persistence.
 * (The XP/levels/streak/badge gamification layer was removed.)
 */

import type { AttemptRecord } from "../analytics/store";

// ---- "What next?" recommendation ----------------------------------------------

export interface CatalogCase {
  id: string;
  category: string;
}

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
