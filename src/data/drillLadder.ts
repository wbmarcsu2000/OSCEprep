// src/data/drillLadder.ts
/**
 * Pure helpers behind the drill learning ladder (Learn → Cloze → Sort →
 * By category → Full recall). Every mode runs off the same grouped answer key
 * an existing drill already has; nothing here knows about React or storage.
 *
 * Items are authored "<recall head> — <clue>": the head is what a student is
 * graded on (see gradableItem), the clue is the teaching half. Cloze shows the
 * clue and asks for the head, so it only makes sense when every item has one.
 */
import { gradableItem } from "./drillProgressCore";

export interface KeyGroup {
  group: string;
  items: string[];
}

export interface LadderItem {
  group: string;
  /** The full authored item — what the reveal displays. */
  item: string;
  /** The graded half. */
  head: string;
  /** The clue after the spaced dash; empty when the item has none. */
  clue: string;
}

/** Split an item into its graded head and its clue. Uses the same spaced-dash
 *  rule as gradableItem, so hyphenated words and ranges stay intact. */
export function splitItem(item: string): { head: string; clue: string } {
  const head = gradableItem(item);
  if (head === item) return { head, clue: "" };
  const clue = item.slice(item.indexOf(head) + head.length).replace(/^\s+[—–-]\s+/, "").trim();
  return { head, clue };
}

/** The key flattened in authored order. */
export function ladderItems(keyPoints: KeyGroup[]): LadderItem[] {
  return keyPoints.flatMap((g) =>
    g.items.map((item) => {
      const { head, clue } = splitItem(item);
      return { group: g.group, item, head, clue };
    }),
  );
}

/** Cloze needs a clue on every item; a drill of bare facts has nothing to show. */
export function clozeAvailable(keyPoints: KeyGroup[]): boolean {
  const items = ladderItems(keyPoints);
  return items.length > 0 && items.every((i) => i.clue.length > 0);
}

/** FNV-1a string hash → 32-bit seed. */
function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — small, deterministic, good enough to shuffle a dozen chips. */
function mulberry32(a: number): () => number {
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic Fisher-Yates so a drill's Cloze/Sort order is stable across
 *  re-renders and reproducible in tests. Does not mutate the input. */
export function seededShuffle<T>(arr: readonly T[], seed: string): T[] {
  const a = arr.slice();
  const rand = mulberry32(hashSeed(seed));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Points taken off a Full-recall score per hint used. Small on purpose: a
 *  hint should make the blank page less scary, not make the drill unpassable. */
export const HINT_PENALTY_PCT = 5;

export function applyHintPenalty(pct: number, hintsUsed: number): number {
  return Math.max(0, Math.round(pct - HINT_PENALTY_PCT * hintsUsed));
}

/** "P…" style cues for unnamed heads — first letter of the first alternative. */
export function firstLetters(heads: string[]): string[] {
  return heads.map((h) => {
    const first = h.split("/")[0].trim();
    return first ? `${first[0]}…` : "…";
  });
}
