/**
 * A question-bank descriptor. The Question Bank screen (`Qbank`) is generic
 * over one of these, so a single UI serves multiple banks (Internal Medicine,
 * Family Medicine, …). Each bank carries its own question set, system order,
 * and localStorage key, so progress never collides between banks.
 */

import { SHELF_MCQS, MCQ_SYSTEMS, type McqQuestion } from "./shelfMcq";
import { FM_MCQS, FM_MCQ_SYSTEMS } from "./familyMedMcq";
import { OB_MCQS, OB_MCQ_SYSTEMS } from "./obgynMcq";

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
  questions: McqQuestion[];
  /** Systems that have at least one question (drives the filter list). */
  systems: string[];
  /** localStorage key for this bank's per-question progress. */
  storageKey: string;
}

export const IM_BANK: McqBank = {
  id: "im",
  title: "Question Bank",
  eyebrow: "Internal Medicine shelf",
  blurb:
    "Single-best-answer MCQs from the high-yield IM review. Commit to an answer, get instant feedback and the teaching point, and redo the ones you miss.",
  icon: "❓",
  grad: "var(--grad-pink)",
  questions: SHELF_MCQS,
  systems: MCQ_SYSTEMS,
  storageKey: "osce.mcq.v1",
};

export const FM_BANK: McqBank = {
  id: "fm",
  title: "Question Bank",
  eyebrow: "Family Medicine shelf",
  blurb:
    "Single-best-answer MCQs from a comprehensive high-yield Family Medicine review plus the USPSTF preventive-care guidelines. Quick vignettes, instant feedback, redo the ones you miss.",
  icon: "🩹",
  grad: "var(--grad-teal)",
  questions: FM_MCQS,
  systems: FM_MCQ_SYSTEMS,
  storageKey: "osce.fmmcq.v1",
};

export const OB_BANK: McqBank = {
  id: "ob",
  title: "Question Bank",
  eyebrow: "OB/GYN shelf",
  blurb:
    "Single-best-answer MCQs for the OB/GYN shelf — comprehensive high-yield obstetrics and gynecology, with instant feedback and explanations. Quick vignettes, redo the ones you miss.",
  icon: "🤰",
  grad: "var(--grad-coral)",
  questions: OB_MCQS,
  systems: OB_MCQ_SYSTEMS,
  storageKey: "osce.obmcq.v1",
};

/** Every question bank, in display order. Single source of truth so any surface
 *  that must account for all banks (Analytics progress, export/import/reset)
 *  can't silently miss one when a new bank is added. */
export const MCQ_BANKS: McqBank[] = [IM_BANK, FM_BANK, OB_BANK];

/** localStorage keys for every bank's per-question progress. */
export const MCQ_STORAGE_KEYS: string[] = MCQ_BANKS.map((b) => b.storageKey);
