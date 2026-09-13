// src/data/__tests__/obEndoTumorDrills.test.ts
import { describe, it, expect } from "vitest";
import { OB_ENDO_TUMOR_DRILLS } from "../obEndoTumorDrills";
import { OB_DOMAINS } from "../obGuidelineDrills";
import { OB_DRILL_BANK, drillsForDomain, drillCatalog } from "../guidelineDrillBank";
import { gradableItem } from "../drillProgressCore";
import { looseCovered } from "../../engine/textMatch";

/**
 * Tumor & hormone drills are graded on the HEAD of each item (before " — "),
 * so the head must be the short phrase a student actually writes, the whole
 * item must stay readable on reveal, and — new here — two heads in the same
 * drill must not credit each other, or naming one cause silently scores two.
 * All three fail silently at runtime, so they are asserted here.
 */
const DOMAIN = "endo-tumors";
const MAX_GROUPS = 4;
const MAX_ITEMS_PER_GROUP = 5;
const MAX_ITEMS = 16;
const MIN_ITEMS = 8;
const MAX_HEAD_CHARS = 60;
const MAX_ITEM_CHARS = 200;

/**
 * Heads that are allowed to credit each other, because the only wording that
 * separates them is wording the keyword grader ignores, and rewording would
 * deny credit to the phrase students actually write. Each is an over-credit
 * that only bites in Full-recall mode (Category mode grades one group at a
 * time):
 *  - the mole family shares "mole" as its only distinctive token
 *    ("complete"/"partial" are dropped as qualifiers);
 *  - "prolactin" (the workup test) is a prefix of "prolactinoma" (the cause),
 *    and the grader treats a ≤4-letter prefix extension as the same token;
 *  - "estrogen-progestin challenge" contains "progestin challenge".
 */
const KNOWN_COLLISIONS: [string, string][] = [
  ["Complete mole", "Partial mole"],
  ["Invasive mole", "Complete mole"],
  ["Invasive mole", "Partial mole"],
  ["Prolactinoma / craniopharyngioma", "Prolactin / TSH / bone age"],
  ["Prolactinoma / hyperprolactinemia", "Prolactin / TSH / FSH"],
  ["Estrogen-progestin challenge", "Progestin challenge"],
];
const collisionAllowed = (a: string, b: string) =>
  KNOWN_COLLISIONS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

describe("OB/GYN tumor & hormone drills (data)", () => {
  it("covers the hormonal presentations and tumor families with unique ids and a stem + task prompt", () => {
    expect(OB_ENDO_TUMOR_DRILLS.length).toBeGreaterThanOrEqual(14);
    const ids = OB_ENDO_TUMOR_DRILLS.map((d) => d.id);
    expect(new Set(ids).size, "ids unique").toBe(ids.length);
    const orgs = new Set(OB_ENDO_TUMOR_DRILLS.map((d) => d.org));
    expect([...orgs].sort()).toEqual(["Hormones", "Tumors"]);
    for (const d of OB_ENDO_TUMOR_DRILLS) {
      expect(d.domain, `${d.id} domain`).toBe(DOMAIN);
      expect(d.id).toMatch(/^endo-[a-z0-9-]+$/);
      expect(d.name.length).toBeGreaterThan(5);
      // stem, blank line, then the task — the prompt card renders blank lines
      expect(d.prompt, `${d.id} prompt has stem + task`).toMatch(/\S\n\n\S/);
      expect(d.prompt.length).toBeGreaterThan(80);
      expect(d.pearls?.length ?? 0, `${d.id} pearls`).toBeGreaterThan(80);
      expect(d.reviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    // the user asked for these two by name
    const names = OB_ENDO_TUMOR_DRILLS.map((d) => d.name.toLowerCase());
    expect(names.some((n) => n.includes("hirsutism"))).toBe(true);
    expect(names.some((n) => n.includes("precocious puberty"))).toBe(true);
  });

  it("every drill respects the density caps", () => {
    for (const d of OB_ENDO_TUMOR_DRILLS) {
      expect(d.keyPoints.length, `${d.id} groups`).toBeGreaterThanOrEqual(2);
      expect(d.keyPoints.length, `${d.id} groups`).toBeLessThanOrEqual(MAX_GROUPS);
      let total = 0;
      for (const g of d.keyPoints) {
        expect(g.items.length, `${d.id}/${g.group} items`).toBeGreaterThan(0);
        expect(g.items.length, `${d.id}/${g.group} items`).toBeLessThanOrEqual(MAX_ITEMS_PER_GROUP);
        total += g.items.length;
        for (const item of g.items) {
          expect(item.length, `${d.id} item too long: "${item}"`).toBeLessThanOrEqual(MAX_ITEM_CHARS);
          const head = gradableItem(item);
          expect(head, `${d.id} item needs a " — " detail: "${item}"`).not.toBe(item);
          expect(head.length, `${d.id} head too long: "${head}"`).toBeLessThanOrEqual(MAX_HEAD_CHARS);
          expect(head, `${d.id} head must not contain an arrow: "${head}"`).not.toMatch(/→/);
        }
      }
      expect(total, `${d.id} total items`).toBeGreaterThanOrEqual(MIN_ITEMS);
      expect(total, `${d.id} total items`).toBeLessThanOrEqual(MAX_ITEMS);
    }
  });

  it("credits a student who types the head, tersely or inside a sentence", () => {
    for (const d of OB_ENDO_TUMOR_DRILLS) {
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
          // Every "/" alternative must earn credit on its own. "D&C" is the one
          // exception: it has no gradable token (single letters are dropped by
          // the tokenizer), so it is listed for display beside "curettage" and
          // relies on AI grading — the keyword grader can never credit it.
          const alts = head.split("/").map((s) => s.trim()).filter((s) => s && !/^suction D&C$/i.test(s) && s !== "D&C");
          for (const alt of alts) {
            expect(looseCovered(alt, head), `${d.id}: alternative "${alt}" of "${head}" not credited`).toBe(true);
          }
        }
      }
    }
  });

  it("no head in a drill credits another head of the same drill", () => {
    for (const d of OB_ENDO_TUMOR_DRILLS) {
      const heads = d.keyPoints.flatMap((g) => g.items.map(gradableItem));
      for (const typed of heads) {
        for (const other of heads) {
          if (typed === other || collisionAllowed(typed, other)) continue;
          expect(
            looseCovered(typed, other),
            `${d.id}: typing "${typed}" also credits "${other}" — reword one head`,
          ).toBe(false);
        }
      }
    }
  });
});

describe("the tumor & hormone domain is wired into the OB/GYN drill bank", () => {
  it("is registered before the vignettes with a label, emoji, noun and attack-method intro", () => {
    const idx = OB_DOMAINS.findIndex((d) => d.id === DOMAIN);
    expect(idx, "endo-tumors domain registered").toBeGreaterThan(0);
    const domain = OB_DOMAINS[idx];
    expect(domain.label).toBeTruthy();
    expect(domain.emoji).toBeTruthy();
    expect(domain.noun).toBe("topic");
    expect(domain.intro?.length).toBe(4);
    expect(OB_DOMAINS[idx + 1]?.id, "vignettes stay last").toBe("vignettes");
    // The screen test matches the GYN tab with /GYN/ — a second label containing "GYN" would break it.
    expect(domain.label).not.toMatch(/GYN/);
  });

  it("is reachable through the bank and keeps the OB progress store", () => {
    expect(OB_DRILL_BANK.domains.some((d) => d.id === DOMAIN)).toBe(true);
    const inDomain = drillsForDomain(OB_DRILL_BANK, DOMAIN);
    expect(inDomain.length).toBe(OB_ENDO_TUMOR_DRILLS.length);
    expect(OB_DRILL_BANK.storageKey).toBe("osce.obdrills.v1");
    const all = OB_DRILL_BANK.drills.map((d) => d.id);
    expect(new Set(all).size, "ids unique across the whole OB bank").toBe(all.length);
  });

  it("browses spoiler-safely, grouped into Hormones and Tumors", () => {
    const cat = drillCatalog(OB_DRILL_BANK, DOMAIN);
    expect(cat.length).toBe(OB_ENDO_TUMOR_DRILLS.length);
    expect(new Set(cat.map((c) => c.group))).toEqual(new Set(["Hormones", "Tumors"]));
    const answers = new Set(OB_ENDO_TUMOR_DRILLS.flatMap((d) => d.keyPoints.flatMap((g) => g.items)));
    for (const entry of cat) expect(answers.has(entry.label)).toBe(false);
  });
});
