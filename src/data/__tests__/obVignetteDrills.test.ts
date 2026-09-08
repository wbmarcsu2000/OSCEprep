// src/data/__tests__/obVignetteDrills.test.ts
import { describe, it, expect } from "vitest";
import { OB_VIGNETTE_DRILLS } from "../obVignetteDrills";
import { OB_DOMAINS } from "../obGuidelineDrills";
import { OB_DRILL_BANK, drillsForDomain, drillCatalog } from "../guidelineDrillBank";
import { gradableItem } from "../drillProgressCore";
import { looseCovered } from "../../engine/textMatch";

/**
 * Vignette drills are graded on the HEAD of each item (before " — "), so the
 * head must be the short phrase a student actually writes, and the whole item
 * must stay readable on reveal. Both fail silently at runtime — a long head
 * denies credit to a correct answer, an over-long key is unmasterable — so they
 * are asserted here.
 */
const DOMAIN = "vignettes";
const MAX_GROUPS = 4;
const MAX_ITEMS_PER_GROUP = 5;
const MAX_ITEMS = 16;
const MIN_ITEMS = 8;
const MAX_HEAD_CHARS = 60;
const MAX_ITEM_CHARS = 200;

describe("OB/GYN case-vignette drills (data)", () => {
  it("covers the ten vignettes with unique ids and a stem + task prompt", () => {
    expect(OB_VIGNETTE_DRILLS).toHaveLength(10);
    const ids = OB_VIGNETTE_DRILLS.map((d) => d.id);
    expect(new Set(ids).size, "ids unique").toBe(ids.length);
    for (const d of OB_VIGNETTE_DRILLS) {
      expect(d.domain).toBe(DOMAIN);
      expect(d.id).toMatch(/^vig-(ob|gyn)\d-[a-z0-9-]+$/);
      expect(["OB", "GYN"]).toContain(d.org);
      expect(d.name.length).toBeGreaterThan(5);
      // stem, blank line, then the task — the prompt card renders blank lines
      expect(d.prompt, `${d.id} prompt has stem + task`).toMatch(/\S\n\n\S/);
      expect(d.prompt.length).toBeGreaterThan(80);
      expect(d.pearls?.length ?? 0, `${d.id} pearls`).toBeGreaterThan(80);
      expect(d.reviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("every drill respects the density caps", () => {
    for (const d of OB_VIGNETTE_DRILLS) {
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
          expect(head.length, `${d.id} head too long: "${head}"`).toBeLessThanOrEqual(MAX_HEAD_CHARS);
          expect(head, `${d.id} head must not contain an arrow: "${head}"`).not.toMatch(/→/);
        }
      }
      expect(total, `${d.id} total items`).toBeGreaterThanOrEqual(MIN_ITEMS);
      expect(total, `${d.id} total items`).toBeLessThanOrEqual(MAX_ITEMS);
    }
  });

  it("credits a student who types the head, tersely or inside a sentence", () => {
    for (const d of OB_VIGNETTE_DRILLS) {
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
          const alts = head.split("/").map((s) => s.trim()).filter((s) => s && s !== "D&C");
          for (const alt of alts) {
            expect(looseCovered(alt, head), `${d.id}: alternative "${alt}" of "${head}" not credited`).toBe(true);
          }
        }
      }
    }
  });
});

describe("the vignette domain is wired into the OB/GYN drill bank", () => {
  it("is registered last with a label, emoji, noun and attack-method intro", () => {
    const domain = OB_DOMAINS.find((d) => d.id === DOMAIN);
    expect(domain, "vignettes domain registered").toBeTruthy();
    expect(domain!.label).toBeTruthy();
    expect(domain!.emoji).toBeTruthy();
    expect(domain!.noun).toBe("vignette");
    expect(domain!.intro?.length).toBe(4);
    expect(OB_DOMAINS[OB_DOMAINS.length - 1].id).toBe(DOMAIN);
    // The screen test matches the GYN tab with /GYN/ — a second label containing "GYN" would break it.
    expect(domain!.label).not.toMatch(/GYN/);
  });

  it("is reachable through the bank and keeps the OB progress store", () => {
    expect(OB_DRILL_BANK.domains.some((d) => d.id === DOMAIN)).toBe(true);
    const inDomain = drillsForDomain(OB_DRILL_BANK, DOMAIN);
    expect(inDomain.length).toBe(OB_VIGNETTE_DRILLS.length);
    expect(OB_DRILL_BANK.storageKey).toBe("osce.obdrills.v1");
    const all = OB_DRILL_BANK.drills.map((d) => d.id);
    expect(new Set(all).size, "ids unique across the whole OB bank").toBe(all.length);
  });

  it("browses spoiler-safely — the catalog never shows an answer", () => {
    const cat = drillCatalog(OB_DRILL_BANK, DOMAIN);
    expect(cat.length).toBe(OB_VIGNETTE_DRILLS.length);
    const answers = new Set(OB_VIGNETTE_DRILLS.flatMap((d) => d.keyPoints.flatMap((g) => g.items)));
    for (const entry of cat) expect(answers.has(entry.label)).toBe(false);
  });
});
