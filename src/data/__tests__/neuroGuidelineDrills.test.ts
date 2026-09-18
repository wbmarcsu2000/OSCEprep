// src/data/__tests__/neuroGuidelineDrills.test.ts
import { describe, it, expect } from "vitest";
import { NEURO_DOMAINS, NEURO_GUIDELINE_DRILLS } from "../neuroGuidelineDrills";
import { NEURO_DRILL_BANK, GUIDELINE_DRILL_BANKS, DRILL_STORAGE_KEYS, drillsForDomain, drillCatalog } from "../guidelineDrillBank";
import { gradableItem } from "../drillProgressCore";
import { clozeAvailable } from "../drillLadder";
import { looseCovered } from "../../engine/textMatch";

/**
 * Every Neurology drill is head-graded ("<head> — <clue>"), so the whole
 * learning ladder applies. Three things fail silently at runtime and are
 * asserted here: an over-long or unmatchable head denies credit, an over-long
 * key is unmasterable, and two heads that credit each other double-score.
 */
const MAX_GROUPS = 4;
const MAX_ITEMS_PER_GROUP = 5;
const MAX_ITEMS = 16;
const MIN_ITEMS = 8;
const MAX_HEAD_CHARS = 60;
const MAX_ITEM_CHARS = 200;
const MIN_DRILLS_PER_DOMAIN = 4;

/**
 * Head pairs allowed to credit each other: the only wording separating them is
 * wording the keyword grader drops (a qualifier, a ≤4-letter prefix), and
 * rewording would deny credit to what students actually write. Add a pair only
 * with a reason. Format: [drill id, head A, head B].
 */
const KNOWN_COLLISIONS: [string, string, string][] = [];

/**
 * Content generation runs one agent per domain, each checking only its own
 * file while the others are still being written: `NEURO_DRILL_DOMAIN=stroke
 * vitest run <this file>` narrows every assertion to that domain. Unset in
 * CI and in the normal suite, so the full bank is always what ships.
 */
const ONLY = process.env.NEURO_DRILL_DOMAIN;
const DOMAINS = ONLY ? NEURO_DOMAINS.filter((d) => d.id === ONLY) : NEURO_DOMAINS;
const DRILLS = ONLY ? NEURO_GUIDELINE_DRILLS.filter((d) => d.domain === ONLY) : NEURO_GUIDELINE_DRILLS;
const allowed = (id: string, a: string, b: string) =>
  KNOWN_COLLISIONS.some(([d, x, y]) => d === id && ((x === a && y === b) || (x === b && y === a)));

describe("Neurology drills (data)", () => {
  it("has at least four drills in every domain, unique ids, a stem + task prompt, pearls", () => {
    expect(DRILLS.length).toBeGreaterThanOrEqual(DOMAINS.length * MIN_DRILLS_PER_DOMAIN);
    const ids = NEURO_GUIDELINE_DRILLS.map((d) => d.id);
    expect(new Set(ids).size, "ids unique").toBe(ids.length);
    const domainIds = new Set(NEURO_DOMAINS.map((d) => d.id));
    for (const dom of DOMAINS) {
      expect(drillsForDomain(NEURO_DRILL_BANK, dom.id).length, `${dom.id} drills`).toBeGreaterThanOrEqual(MIN_DRILLS_PER_DOMAIN);
      expect(dom.noun).toBe("drill");
      expect(dom.intro?.length, `${dom.id} intro`).toBeGreaterThanOrEqual(3);
      expect(dom.label).not.toMatch(/GYN/);
    }
    for (const d of DRILLS) {
      expect(domainIds.has(d.domain), `${d.id} domain`).toBe(true);
      expect(d.id, `${d.id} id prefixed by its domain`).toMatch(new RegExp(`^${d.domain}-[a-z0-9-]+$`));
      expect(d.name.length).toBeGreaterThan(5);
      expect(d.org.length).toBeGreaterThan(1);
      expect(d.prompt, `${d.id} prompt has stem + task`).toMatch(/\S\n\n\S/);
      expect(d.prompt.length).toBeGreaterThan(60);
      expect(d.pearls?.length ?? 0, `${d.id} pearls`).toBeGreaterThan(80);
      expect(d.reviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("every drill respects the density caps and is fully head-graded", () => {
    for (const d of DRILLS) {
      expect(d.keyPoints.length, `${d.id} groups`).toBeGreaterThanOrEqual(2);
      expect(d.keyPoints.length, `${d.id} groups`).toBeLessThanOrEqual(MAX_GROUPS);
      expect(clozeAvailable(d.keyPoints), `${d.id}: every item needs a " — clue"`).toBe(true);
      let total = 0;
      for (const g of d.keyPoints) {
        expect(g.items.length, `${d.id}/${g.group} items`).toBeGreaterThan(0);
        expect(g.items.length, `${d.id}/${g.group} items`).toBeLessThanOrEqual(MAX_ITEMS_PER_GROUP);
        total += g.items.length;
        for (const item of g.items) {
          expect(item.length, `${d.id} item too long: "${item}"`).toBeLessThanOrEqual(MAX_ITEM_CHARS);
          const head = gradableItem(item);
          expect(head.length, `${d.id} head too long: "${head}"`).toBeLessThanOrEqual(MAX_HEAD_CHARS);
          expect(head, `${d.id} head must not contain an arrow or parenthesis: "${head}"`).not.toMatch(/[→()]/);
        }
      }
      expect(total, `${d.id} total items`).toBeGreaterThanOrEqual(MIN_ITEMS);
      expect(total, `${d.id} total items`).toBeLessThanOrEqual(MAX_ITEMS);
    }
  });

  it("credits a student who types the head, tersely, in a sentence, or by any '/' alternative", () => {
    for (const d of DRILLS) {
      const heads = new Set<string>();
      for (const g of d.keyPoints) {
        for (const item of g.items) {
          const head = gradableItem(item);
          expect(heads.has(head), `${d.id}: duplicate head "${head}"`).toBe(false);
          heads.add(head);
          expect(looseCovered(head, head), `${d.id}: "${head}" not credited when typed exactly`).toBe(true);
          expect(
            looseCovered(`I would consider ${head.toLowerCase()} and then reassess`, head),
            `${d.id}: "${head}" not credited inside a fuller sentence`,
          ).toBe(true);
          for (const alt of head.split("/").map((s) => s.trim()).filter(Boolean)) {
            expect(looseCovered(alt, head), `${d.id}: alternative "${alt}" of "${head}" not credited`).toBe(true);
          }
        }
      }
    }
  });

  it("no head in a drill credits another head of the same drill", () => {
    for (const d of DRILLS) {
      const heads = d.keyPoints.flatMap((g) => g.items.map(gradableItem));
      for (const typed of heads) {
        for (const other of heads) {
          if (typed === other || allowed(d.id, typed, other)) continue;
          expect(
            looseCovered(typed, other),
            `${d.id}: typing "${typed}" also credits "${other}" — reword one head`,
          ).toBe(false);
        }
      }
    }
  });
});

describe("the Neurology drill bank is registered", () => {
  it("is the third bank with its own storage key, and its catalog is spoiler-safe", () => {
    expect(GUIDELINE_DRILL_BANKS.map((b) => b.id)).toEqual(["fm", "ob", "neuro"]);
    expect(NEURO_DRILL_BANK.storageKey).toBe("osce.neurodrills.v1");
    expect(DRILL_STORAGE_KEYS).toContain("osce.neurodrills.v1");
    expect(NEURO_DRILL_BANK.domains.map((d) => d.id)).toEqual([
      "stroke", "localization", "dementia-movement", "weakness",
      "headache-vertigo-seizure", "infection-toxic-nutrition", "hemorrhage-trauma-tumor", "pharm",
    ]);
    const answers = new Set(NEURO_GUIDELINE_DRILLS.flatMap((d) => d.keyPoints.flatMap((g) => g.items)));
    for (const dom of NEURO_DOMAINS) {
      for (const entry of drillCatalog(NEURO_DRILL_BANK, dom.id)) expect(answers.has(entry.label)).toBe(false);
    }
  });
});
