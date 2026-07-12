import { describe, it, expect } from "vitest";
import { MCQ_IMAGES, mcqImageUrl } from "../mcqImages";
import { FM_MCQS } from "../familyMedMcq";
import { SHELF_MCQS } from "../shelfMcq";
import { OB_MCQS } from "../obgynMcq";

/**
 * Guards the curated MCQ image pilot: every mapped question id must exist in a
 * bank, every image file must resolve through the Vite glob, and alt + credit
 * must be present (accessibility + open-license attribution). Keeps the image
 * map from drifting out of sync with the question banks.
 */
describe("MCQ_IMAGES", () => {
  const ids = new Set([...FM_MCQS, ...SHELF_MCQS, ...OB_MCQS].map((q) => q.id));
  const entries = Object.entries(MCQ_IMAGES);

  it("has a non-trivial pilot set", () => {
    expect(entries.length).toBeGreaterThanOrEqual(20);
  });

  it("every mapped id exists in a question bank", () => {
    const orphans = entries.filter(([id]) => !ids.has(id)).map(([id]) => id);
    expect(orphans).toEqual([]);
  });

  it("every image resolves to a bundled asset URL", () => {
    const unresolved = entries
      .filter(([, img]) => !mcqImageUrl(img.file))
      .map(([, img]) => img.file);
    expect(unresolved).toEqual([]);
  });

  it("every image has alt text and an attribution credit", () => {
    for (const [id, img] of entries) {
      expect(img.alt.trim().length, `alt for ${id}`).toBeGreaterThan(10);
      expect(img.credit, `credit for ${id}`).toContain("Wikimedia Commons");
    }
  });

  it("maps at most one image per question id (object keys are unique)", () => {
    expect(entries.length).toBe(new Set(entries.map(([id]) => id)).size);
  });
});
