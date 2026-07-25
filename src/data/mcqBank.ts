/**
 * A question-bank descriptor. The Question Bank screen (`Qbank`) is generic
 * over one of these, so a single UI serves multiple banks (Internal Medicine,
 * Family Medicine, …). Each bank carries its own question set, system order,
 * and localStorage key, so progress never collides between banks.
 *
 * The questions are loaded ON DEMAND via `load()`. This module used to import
 * all three arrays statically, which put every question in the entry chunk —
 * 7.8 MB of the 8.8 MB main bundle, so a student opening an OSCE case still
 * downloaded 1,860 Family Medicine questions first. Each `load()` is a dynamic
 * import, so Vite emits one chunk per bank and a bank arrives only when its tab
 * is opened (then stays in the service-worker cache). Anything needed before
 * that — counts, the systems filter list — comes from `mcqBankMeta.ts`.
 */

import type { McqQuestion } from "./shelfMcq";
import { MCQ_BANK_META } from "./mcqBankMeta";

export type { McqQuestion };

export interface McqBank {
  id: string;
  /** Heading shown on the screen. */
  title: string;
  /** Small eyebrow label above the heading. */
  eyebrow: string;
  /** One-sentence description under the heading. */
  blurb: string;
  /** Emoji for the header icon tile. */
  icon: string;
  /** Background gradient token (from src/index.css) for the icon tile + progress bar. */
  grad: string;
  /** Question count, known without loading the bank. */
  total: number;
  /** Systems that have at least one question (drives the filter list). */
  systems: string[];
  /** localStorage key for this bank's per-question progress. */
  storageKey: string;
  /**
   * Load this bank's questions. Resolves from a module-level cache after the
   * first call, so switching away from a bank and back does not re-parse a
   * multi-megabyte array.
   */
  load: () => Promise<McqQuestion[]>;
}

export const IM_BANK: McqBank = {
  id: "im",
  title: "Question Bank",
  eyebrow: "Internal Medicine shelf",
  blurb:
    "Single-best-answer MCQs from the high-yield IM review. Commit to an answer, get instant feedback and the teaching point, and redo the ones you miss.",
  icon: "❓",
  grad: "var(--grad-pink)",
  total: MCQ_BANK_META.im.total,
  systems: MCQ_BANK_META.im.systems,
  storageKey: "osce.mcq.v1",
  load: () => import("./shelfMcq").then((m) => m.SHELF_MCQS),
};

export const FM_BANK: McqBank = {
  id: "fm",
  title: "Question Bank",
  eyebrow: "Family Medicine shelf",
  blurb:
    "Single-best-answer MCQs from a comprehensive high-yield Family Medicine review plus the USPSTF preventive-care guidelines. Quick vignettes, instant feedback, redo the ones you miss.",
  icon: "🩹",
  grad: "var(--grad-teal)",
  total: MCQ_BANK_META.fm.total,
  systems: MCQ_BANK_META.fm.systems,
  storageKey: "osce.fmmcq.v1",
  load: () => import("./familyMedMcq").then((m) => m.FM_MCQS),
};

export const OB_BANK: McqBank = {
  id: "ob",
  title: "Question Bank",
  eyebrow: "OB/GYN shelf",
  blurb:
    "Single-best-answer MCQs for the OB/GYN shelf — comprehensive high-yield obstetrics and gynecology, with instant feedback and explanations. Quick vignettes, redo the ones you miss.",
  icon: "🤰",
  grad: "var(--grad-coral)",
  total: MCQ_BANK_META.ob.total,
  systems: MCQ_BANK_META.ob.systems,
  storageKey: "osce.obmcq.v1",
  load: () => import("./obgynMcq").then((m) => m.OB_MCQS),
};

/** Every question bank, in display order. Single source of truth so any surface
 *  that must account for all banks (Analytics progress, export/import/reset)
 *  can't silently miss one when a new bank is added. */
export const MCQ_BANKS: McqBank[] = [IM_BANK, FM_BANK, OB_BANK];

/** localStorage keys for every bank's per-question progress. */
export const MCQ_STORAGE_KEYS: string[] = MCQ_BANKS.map((b) => b.storageKey);
