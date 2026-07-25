import { describe, it, expect } from "vitest";
import { MCQ_BANK_META } from "../mcqBankMeta";
import { MCQ_BANKS, IM_BANK, FM_BANK, OB_BANK } from "../mcqBank";
import { SHELF_MCQS, MCQ_SYSTEMS } from "../shelfMcq";
import { FM_MCQS, FM_MCQ_SYSTEMS } from "../familyMedMcq";
import { OB_MCQS, OB_MCQ_SYSTEMS } from "../obgynMcq";

/**
 * mcqBankMeta.ts duplicates each bank's question count and system list so the
 * app can render counts and the filter dropdown without pulling 7.8 MB of
 * code-split question data into the entry chunk. That duplication is only safe
 * if it is checked, so this test loads the real banks and compares.
 *
 * If this fails after regenerating a bank, update MCQ_BANK_META to match.
 */
describe("MCQ bank metadata matches the real banks", () => {
  it.each([
    ["im", MCQ_BANK_META.im, SHELF_MCQS, MCQ_SYSTEMS],
    ["fm", MCQ_BANK_META.fm, FM_MCQS, FM_MCQ_SYSTEMS],
    ["ob", MCQ_BANK_META.ob, OB_MCQS, OB_MCQ_SYSTEMS],
  ])("%s: total and systems agree with the data", (_id, meta, questions, systems) => {
    expect(meta.total).toBe(questions.length);
    expect(meta.systems).toEqual(systems);
  });

  it("every bank descriptor exposes the metadata and a working loader", async () => {
    for (const bank of MCQ_BANKS) {
      expect(bank.total).toBeGreaterThan(0);
      expect(bank.systems.length).toBeGreaterThan(0);
      const loaded = await bank.load();
      expect(loaded.length, `${bank.id} load() count matches total`).toBe(bank.total);
      // Every system the filter offers must actually have questions behind it.
      for (const system of bank.systems) {
        expect(
          loaded.some((q) => q.system === system),
          `${bank.id} system "${system}" has questions`,
        ).toBe(true);
      }
    }
  });

  it("resolves the same array instance on repeat loads, so switching banks is free", async () => {
    const [a, b] = await Promise.all([IM_BANK.load(), IM_BANK.load()]);
    expect(a).toBe(b);
  });

  it("keeps each bank's progress key distinct", () => {
    const keys = [IM_BANK, FM_BANK, OB_BANK].map((b) => b.storageKey);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
