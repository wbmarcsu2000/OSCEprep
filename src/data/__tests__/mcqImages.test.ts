import { describe, it, expect } from "vitest";
import { MCQ_IMAGES, mcqImageUrl, mcqImagePromptAlt } from "../mcqImages";
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

describe("pre-answer alt text does not give away the diagnosis", () => {
  it("strips the diagnosis from every curated image's alt", () => {
    const entries = Object.entries(MCQ_IMAGES);
    expect(entries.length).toBeGreaterThan(0);
    for (const [id, img] of entries) {
      const prompt = mcqImagePromptAlt(img.alt);
      expect(prompt.length, `${id} prompt alt is substantive`).toBeGreaterThanOrEqual(18);
      // No parenthetical (that is where the diagnosis is usually parked) and no
      // "characteristic of ..."-style clause naming it.
      expect(prompt, `${id} has no parenthetical`).not.toMatch(/[()]/);
      expect(prompt, `${id} names no diagnosis`).not.toMatch(
        /\b(characteristic of|consistent with|diagnostic of|typical of|pathognomonic|suggestive of|seen in)\b/i,
      );
      // It must still describe something, not be a generic placeholder, for the
      // curated set (which all have rich morphology descriptions).
      expect(prompt).not.toBe("Clinical image for this question");
    }
  });

  it("falls back to a neutral description when stripping leaves too little", () => {
    expect(mcqImagePromptAlt("Rash (measles)")).toBe("Clinical image for this question");
  });

  it("keeps the full authored alt intact for post-answer teaching", () => {
    for (const img of Object.values(MCQ_IMAGES)) {
      expect(img.alt.length).toBeGreaterThan(mcqImagePromptAlt(img.alt).length - 1);
    }
  });
});
