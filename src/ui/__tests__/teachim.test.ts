import { describe, it, expect } from "vitest";
import { manifest } from "../../data/loader";
import {
  CHALK_TALKS_BY_CATEGORY,
  TEACHIM_BY_CASE,
  TEACHIM_BY_SKILL,
} from "../../data/teachim";

const isTeachimUrl = (u: string) => /^https:\/\/teachim\.org\/teaching_material\/[\w-]+\/$/.test(u);

describe("TeachIM data integrity", () => {
  it("every chalk-talk block is well-formed and cites a real teachim.org page", () => {
    const cats = Object.keys(CHALK_TALKS_BY_CATEGORY);
    expect(cats.length).toBeGreaterThanOrEqual(9);
    for (const [, blocks] of Object.entries(CHALK_TALKS_BY_CATEGORY)) {
      expect(blocks.length).toBeGreaterThan(0);
      for (const b of blocks) {
        expect(b.title.length).toBeGreaterThan(0);
        expect(b.points.length).toBeGreaterThanOrEqual(3);
        expect(b.source.startsWith("TeachIM")).toBe(true);
        expect(isTeachimUrl(b.url)).toBe(true);
      }
    }
  });

  it("chalk-talk categories all exist in the case manifest", () => {
    const known = new Set(manifest.cases.map((c) => c.category));
    for (const cat of Object.keys(CHALK_TALKS_BY_CATEGORY)) {
      expect(known.has(cat)).toBe(true);
    }
  });

  it("every per-case teaching link points to a real case id and a teachim page", () => {
    const ids = new Set(manifest.cases.map((c) => c.id));
    const entries = Object.entries(TEACHIM_BY_CASE);
    expect(entries.length).toBeGreaterThanOrEqual(20);
    for (const [caseId, link] of entries) {
      expect(ids.has(caseId)).toBe(true);
      expect(link.title.length).toBeGreaterThan(0);
      expect(isTeachimUrl(link.url)).toBe(true);
    }
  });

  it("skill refs are keyed to known skill ids and cite teachim pages", () => {
    const skillIds = new Set(["ekg", "cxr", "abg", "pft", "ascitic", "pleural"]);
    for (const [skill, link] of Object.entries(TEACHIM_BY_SKILL)) {
      expect(skillIds.has(skill)).toBe(true);
      expect(isTeachimUrl(link.url)).toBe(true);
    }
  });
});
