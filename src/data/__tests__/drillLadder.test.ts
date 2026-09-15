// src/data/__tests__/drillLadder.test.ts
import { describe, it, expect } from "vitest";
import {
  splitItem,
  ladderItems,
  clozeAvailable,
  seededShuffle,
  applyHintPenalty,
  firstLetters,
  HINT_PENALTY_PCT,
} from "../drillLadder";

const KEY = [
  { group: "Ovarian", items: ["PCOS — most common; gradual onset", "Sertoli-Leydig — rapid virilization"] },
  { group: "Adrenal", items: ["Cushing syndrome / Cushing's — striae, moon face"] },
];

describe("splitItem", () => {
  it("splits '<head> — <clue>' on the spaced dash only", () => {
    expect(splitItem("PCOS — most common; gradual onset")).toEqual({ head: "PCOS", clue: "most common; gradual onset" });
    expect(splitItem("Start at age 45 (average risk)")).toEqual({ head: "Start at age 45 (average risk)", clue: "" });
    // hyphenated words and ranges are not clue separators
    expect(splitItem("Ages 40–74 biennial")).toEqual({ head: "Ages 40–74 biennial", clue: "" });
  });
});

describe("ladderItems", () => {
  it("flattens the key in order, keeping the group and the full item", () => {
    const items = ladderItems(KEY);
    expect(items.map((i) => i.head)).toEqual(["PCOS", "Sertoli-Leydig", "Cushing syndrome / Cushing's"]);
    expect(items[2]).toMatchObject({ group: "Adrenal", item: KEY[1].items[0], clue: "striae, moon face" });
  });
});

describe("clozeAvailable", () => {
  it("is true only when every item carries a clue", () => {
    expect(clozeAvailable(KEY)).toBe(true);
    expect(clozeAvailable([{ group: "A", items: ["PCOS — clue", "Start at 45"] }])).toBe(false);
    expect(clozeAvailable([])).toBe(false);
  });
});

describe("seededShuffle", () => {
  it("is deterministic for a seed, a permutation, and differs across seeds", () => {
    const src = [1, 2, 3, 4, 5, 6, 7, 8];
    const a = seededShuffle(src, "drill-a");
    expect(seededShuffle(src, "drill-a")).toEqual(a);
    expect([...a].sort((x, y) => x - y)).toEqual(src);
    expect(src, "input untouched").toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    const seeds = ["a", "b", "c", "d", "e"].map((s) => seededShuffle(src, s).join(","));
    expect(new Set(seeds).size).toBeGreaterThan(1);
  });
});

describe("applyHintPenalty", () => {
  it("subtracts a fixed amount per hint, never below zero, rounding to an integer", () => {
    expect(HINT_PENALTY_PCT).toBe(5);
    expect(applyHintPenalty(80, 0)).toBe(80);
    expect(applyHintPenalty(80, 2)).toBe(70);
    expect(applyHintPenalty(7, 3)).toBe(0);
    expect(applyHintPenalty(83.4, 1)).toBe(78);
  });
});

describe("firstLetters", () => {
  it("shows the first letter of each head's first alternative, with a length cue", () => {
    expect(firstLetters(["PCOS", "Sertoli-Leydig", "Cushing syndrome / Cushing's"])).toEqual(["P…", "S…", "C…"]);
  });
});
