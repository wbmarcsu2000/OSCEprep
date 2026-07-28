import { describe, it, expect } from "vitest";
import { OB_GYN_SURGERY_DRILLS } from "../obGynSurgeryDrills";
import { OB_DRILL_BANK, drillsForDomain, drillCatalog } from "../guidelineDrillBank";
import { OB_DOMAINS } from "../obGuidelineDrills";
import { looseCovered } from "../../engine/textMatch";

/**
 * These drills exist to be answerable in about a dozen words, and the coverage
 * matcher credits an item when the ITEM's tokens appear in the answer. Both
 * properties fail silently at runtime — an over-long key is unmasterable, and a
 * long or abbreviated item gives a correct student zero credit — so they are
 * asserted here as well as in the build script.
 */
const DOMAIN = "gyn-surgery";
const MAX_GROUPS = 4;
const MAX_ITEMS_PER_GROUP = 4;
const MAX_ITEMS = 7;
const MAX_ITEM_WORDS = 4;
const FILLER = new Set([
  "a", "an", "the", "of", "in", "at", "to", "for", "and", "or", "with", "on",
  "by", "from", "into", "vs", "versus", "no", "not",
]);

const significant = (s: string) =>
  (s.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter((w) => !FILLER.has(w));

describe("benign gyn surgery drills", () => {
  it("covers the common operations across the four dimensions", () => {
    expect(OB_GYN_SURGERY_DRILLS.length).toBeGreaterThanOrEqual(30);
    const ops = new Set(OB_GYN_SURGERY_DRILLS.map((d) => d.id.replace(/-(indications|complications|anatomy|periop)$/, "")));
    expect(ops.size, "distinct operations").toBeGreaterThanOrEqual(10);
    for (const d of OB_GYN_SURGERY_DRILLS) {
      expect(d.domain).toBe(DOMAIN);
      expect(d.id).toMatch(/^gyns-[a-z0-9-]+-(indications|complications|anatomy|periop)$/);
      expect(d.name.length).toBeGreaterThan(5);
      expect(d.org.length).toBeGreaterThan(1);
      expect(d.prompt.length).toBeGreaterThan(20);
    }
    const ids = OB_GYN_SURGERY_DRILLS.map((d) => d.id);
    expect(new Set(ids).size, "ids unique").toBe(ids.length);
  });

  it("keeps every drill short enough to answer in a dozen words", () => {
    for (const d of OB_GYN_SURGERY_DRILLS) {
      expect(d.keyPoints.length, `${d.id} groups`).toBeGreaterThan(0);
      expect(d.keyPoints.length, `${d.id} groups`).toBeLessThanOrEqual(MAX_GROUPS);
      let total = 0;
      for (const g of d.keyPoints) {
        expect(g.items.length, `${d.id}/${g.group} items`).toBeGreaterThan(0);
        expect(g.items.length, `${d.id}/${g.group} items`).toBeLessThanOrEqual(MAX_ITEMS_PER_GROUP);
        total += g.items.length;
      }
      expect(total, `${d.id} total items — the point is a short answer`).toBeLessThanOrEqual(MAX_ITEMS);
      expect(total, `${d.id} total items`).toBeGreaterThanOrEqual(4);
    }
  });

  it("writes every item as a short, spelled-out, distinctive phrase", () => {
    for (const d of OB_GYN_SURGERY_DRILLS) {
      const seen = new Set<string>();
      for (const g of d.keyPoints) {
        for (const item of g.items) {
          const words = significant(item);
          expect(words.length, `${d.id}: "${item}" word count`).toBeGreaterThan(0);
          expect(
            words.length,
            `${d.id}: "${item}" is too long — a long item silently denies credit`,
          ).toBeLessThanOrEqual(MAX_ITEM_WORDS);
          // Abbreviations punish a student who writes the term out in full.
          expect(item, `${d.id}: "${item}" must not abbreviate`).not.toMatch(/\b[A-Z]{2,4}\b/);
          const key = [...words].sort().join(" ");
          expect(seen.has(key), `${d.id}: two items reduce to the same words — "${item}"`).toBe(false);
          seen.add(key);
        }
      }
    }
  });

  it("credits a student who types the item, tersely or inside a sentence", () => {
    for (const d of OB_GYN_SURGERY_DRILLS) {
      for (const g of d.keyPoints) {
        for (const item of g.items) {
          expect(looseCovered(item, item), `${d.id}: "${item}" not credited when typed exactly`).toBe(true);
          expect(
            looseCovered(`I would check for ${item.toLowerCase()} and then reassess`, item),
            `${d.id}: "${item}" not credited inside a fuller sentence`,
          ).toBe(true);
        }
      }
    }
  });

  it("never lets one item's wording credit a different item in the same drill", () => {
    for (const d of OB_GYN_SURGERY_DRILLS) {
      const all = d.keyPoints.flatMap((g) => g.items);
      for (const item of all) {
        for (const other of all) {
          if (other === item) continue;
          expect(
            looseCovered(item, other),
            `${d.id}: typing "${item}" also credits "${other}" — they are not distinguishable`,
          ).toBe(false);
        }
      }
    }
  });
});

describe("the domain is wired into the OB/GYN drill bank", () => {
  it("is registered as a domain with a label and emoji", () => {
    const domain = OB_DOMAINS.find((d) => d.id === DOMAIN);
    expect(domain, "gyn-surgery domain registered").toBeTruthy();
    expect(domain!.label).toBeTruthy();
    expect(domain!.emoji).toBeTruthy();
    expect(new Set(OB_DOMAINS.map((d) => d.id)).size).toBe(OB_DOMAINS.length);
  });

  it("is reachable through the bank and keeps the OB progress store", () => {
    expect(OB_DRILL_BANK.domains.some((d) => d.id === DOMAIN)).toBe(true);
    const inDomain = drillsForDomain(OB_DRILL_BANK, DOMAIN);
    expect(inDomain.length).toBe(OB_GYN_SURGERY_DRILLS.length);
    expect(OB_DRILL_BANK.storageKey).toBe("osce.obdrills.v1");
  });

  it("browses spoiler-safely — the catalog never shows an answer", () => {
    const cat = drillCatalog(OB_DRILL_BANK, DOMAIN);
    expect(cat.length).toBe(OB_GYN_SURGERY_DRILLS.length);
    const answers = new Set(OB_GYN_SURGERY_DRILLS.flatMap((d) => d.keyPoints.flatMap((g) => g.items)));
    for (const entry of cat) expect(answers.has(entry.label)).toBe(false);
  });
});
