import { describe, it, expect } from "vitest";
import { EXAM_DRILLS, EXAM_DRILL_CATEGORIES } from "../examDrills";
import { EXAM_SYSTEMS } from "../../engine/maneuvers";
import { drillCatalog, drillKey, DRILL_TYPE_ORDER, DRILL_TYPE_LABELS, DRILL_TYPE_EMOJI } from "../drillProgress";
import { manifest } from "../loader";
import { gradableItem } from "../drillProgressCore";
import { looseCovered } from "../../engine/textMatch";

/**
 * The density cap is the load-bearing rule here. Coverage % is named / total, so
 * an over-long answer key makes a drill unmasterable and its reveal a wall of
 * text — the exact failure the FM/OB guideline drills hit before being condensed.
 */
const MAX_GROUPS = 4;
const MAX_ITEMS_PER_GROUP = 4;
const MAX_ITEMS = 15;
const MAX_ITEM_CHARS = 80;

const IM_CATEGORIES = new Set(manifest.cases.map((c) => c.category));

describe("focused exam drill data", () => {
  it("has drills spread across the IM categories", () => {
    expect(EXAM_DRILLS.length).toBeGreaterThanOrEqual(20);
    expect(EXAM_DRILL_CATEGORIES.length).toBeGreaterThanOrEqual(8);
    for (const c of EXAM_DRILL_CATEGORIES) {
      expect(IM_CATEGORIES.has(c), `"${c}" is a real IM case category`).toBe(true);
    }
  });

  it("gives every drill a unique, stable id matching its category", () => {
    const ids = EXAM_DRILLS.map((d) => d.id);
    expect(new Set(ids).size, "ids are unique").toBe(ids.length);
    for (const d of EXAM_DRILLS) {
      expect(d.id, `${d.id} is slugged from its category`).toMatch(/^exam-[a-z0-9-]+-\d+$/);
    }
  });

  it("respects the density cap on every drill", () => {
    for (const d of EXAM_DRILLS) {
      expect(d.keyPoints.length, `${d.id} group count`).toBeGreaterThan(0);
      expect(d.keyPoints.length, `${d.id} group count`).toBeLessThanOrEqual(MAX_GROUPS);
      let total = 0;
      for (const g of d.keyPoints) {
        expect(g.items.length, `${d.id} / ${g.group} item count`).toBeGreaterThan(0);
        expect(g.items.length, `${d.id} / ${g.group} item count`).toBeLessThanOrEqual(MAX_ITEMS_PER_GROUP);
        for (const item of g.items) {
          total += 1;
          expect(item.trim().length, `${d.id} item is non-empty`).toBeGreaterThan(0);
          expect(item.length, `${d.id} item "${item.slice(0, 40)}…" length`).toBeLessThanOrEqual(MAX_ITEM_CHARS);
        }
      }
      expect(total, `${d.id} total items — an over-long key is unmasterable`).toBeLessThanOrEqual(MAX_ITEMS);
      expect(total, `${d.id} total items`).toBeGreaterThanOrEqual(8);
    }
  });

  it("groups by the same exam-system vocabulary the encounter uses", () => {
    const systems = new Set<string>(EXAM_SYSTEMS);
    for (const d of EXAM_DRILLS) {
      for (const g of d.keyPoints) {
        expect(systems.has(g.group), `${d.id}: "${g.group}" is an EXAM_SYSTEM`).toBe(true);
      }
      const groups = d.keyPoints.map((g) => g.group);
      expect(new Set(groups).size, `${d.id} has no repeated group`).toBe(groups.length);
    }
  });

  it("prompts with a real vignette and never leaves the key empty", () => {
    for (const d of EXAM_DRILLS) {
      expect(d.vignette.length, `${d.id} vignette`).toBeGreaterThan(60);
      // The vignette is the prompt; it must not carry the answer key's wording.
      expect(d.vignette.toLowerCase()).not.toContain("keypoints");
    }
  });
});

describe("focused exam drills are registered as a drill type", () => {
  it("appears in the type order with a label and an emoji", () => {
    expect(DRILL_TYPE_ORDER).toContain("exam");
    expect(DRILL_TYPE_LABELS.exam).toBeTruthy();
    expect(DRILL_TYPE_EMOJI.exam).toBeTruthy();
    // Emoji must be distinct or the rail reads ambiguously.
    const emoji = DRILL_TYPE_ORDER.map((t) => DRILL_TYPE_EMOJI[t]);
    expect(new Set(emoji).size, "every drill type has a distinct emoji").toBe(emoji.length);
  });

  it("exposes one catalog entry per drill, labelled spoiler-safely", () => {
    const cat = drillCatalog("exam");
    expect(cat.length).toBe(EXAM_DRILLS.length);
    const byId = new Map(EXAM_DRILLS.map((d) => [d.id, d]));
    for (const item of cat) {
      const drill = byId.get(item.id);
      expect(drill, `${item.id} is a real drill`).toBeTruthy();
      expect(item.group).toBe(drill!.category);
      // The label is the vignette (the prompt), so it can leak nothing — but it
      // must not be an answer item either.
      const answers = drill!.keyPoints.flatMap((g) => g.items);
      expect(answers).not.toContain(item.label);
    }
  });

  it("namespaces progress keys so exam drills cannot collide with other types", () => {
    const keys = EXAM_DRILLS.map((d) => drillKey("exam", d.id));
    expect(new Set(keys).size).toBe(keys.length);
    for (const k of keys) expect(k.startsWith("exam")).toBe(true);
  });
});

describe("answer-key items are gradable as written", () => {
  it("grades the recall half, not the teaching clause", () => {
    // Items read "<thing to recall> — <why it matters>". The coverage matcher
    // needs most of an item's tokens, so grading the whole string silently
    // required the student to reproduce the explanation too: measured at 7%
    // matched vs 100% when only the recall half is the target.
    let total = 0;
    let matchedFull = 0;
    let matchedHalf = 0;
    for (const d of EXAM_DRILLS) {
      for (const g of d.keyPoints) {
        for (const item of g.items) {
          total += 1;
          const half = gradableItem(item);
          if (looseCovered(half, item)) matchedFull += 1;
          if (looseCovered(half, half)) matchedHalf += 1;
        }
      }
    }
    // A student who writes exactly the maneuver must be credited for every item.
    expect(matchedHalf).toBe(total);
    // Guard the regression: if this ever equals total, someone graded full items.
    expect(matchedFull).toBeLessThan(total);
  });

  it("splits only on a spaced dash, so hyphenated terms survive", () => {
    expect(gradableItem("Check BP in both arms — >20 mmHg suggests dissection")).toBe(
      "Check BP in both arms",
    );
    expect(gradableItem("Screen a 38-year-old for anaemia")).toBe("Screen a 38-year-old for anaemia");
    expect(gradableItem("Repeat at 24-28 weeks")).toBe("Repeat at 24-28 weeks");
    expect(gradableItem("No dash here")).toBe("No dash here");
    // Degenerate input falls back to the whole string rather than empty.
    expect(gradableItem("— only teaching")).toBe("— only teaching");
  });
});
