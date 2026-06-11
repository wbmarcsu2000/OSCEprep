import { describe, it, expect } from "vitest";
import { manifest } from "../loader";
import { CURRICULUM_BY_CATEGORY, CURRICULUM } from "../curriculum";

describe("teaching curriculum", () => {
  it("covers every category present in the case library", () => {
    const categories = new Set(manifest.cases.map((c) => c.category));
    for (const cat of categories) {
      expect(CURRICULUM_BY_CATEGORY.has(cat), `missing curriculum for ${cat}`).toBe(true);
    }
  });

  it("every entry is complete and well-formed", () => {
    for (const c of CURRICULUM) {
      expect(c.framework.length).toBeGreaterThan(0);
      expect(c.strategy.length).toBeGreaterThan(0);
      expect(c.cantMiss.length).toBeGreaterThan(0);
      expect(c.differential.length).toBeGreaterThan(0);
      expect(c.keyQuestions.length).toBeGreaterThan(0);
      expect(c.workupMenu.labs.length).toBeGreaterThan(0);
      expect(c.workupMenu.imaging.length).toBeGreaterThan(0);
      expect(c.practiceCases.length, `${c.category} needs worked cases`).toBeGreaterThan(0);
      expect(c.references.length).toBeGreaterThan(0);
      // Worked cases follow the vignette → DDx → work-up format.
      for (const pc of c.practiceCases) {
        expect(pc.vignette.length).toBeGreaterThan(0);
        expect(pc.ddx.length).toBeGreaterThan(1);
        expect(pc.workup.length).toBeGreaterThan(0);
      }
      // Any reference URL must be a real https link.
      for (const r of c.references) {
        if (r.url) expect(r.url).toMatch(/^https:\/\//);
      }
    }
  });

  it("reading guides resolve for EKG and CXR read steps", async () => {
    const { readingGuideFor } = await import("../readingGuides");
    expect(readingGuideFor("ekg")?.steps.length).toBeGreaterThan(0);
    expect(readingGuideFor("cxr")?.steps.length).toBeGreaterThan(0);
    expect(readingGuideFor(null)).toBeNull();
  });

  it("includes the ABG, PFT, and fluid skill references", async () => {
    const { SKILLS } = await import("../skills");
    const ids = new Set(SKILLS.map((s) => s.id));
    for (const id of ["abg", "pft", "ascitic", "pleural"]) {
      expect(ids.has(id), `missing skill ${id}`).toBe(true);
    }
    for (const s of SKILLS) {
      expect(s.title.length).toBeGreaterThan(0);
      const hasBody = !!(s.steps?.length || s.sections?.length || s.tables?.length);
      expect(hasBody, `${s.id} has content`).toBe(true);
    }
  });
});
