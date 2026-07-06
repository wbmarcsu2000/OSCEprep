/**
 * A question-bank descriptor. The Question Bank screen (`Qbank`) is generic
 * over one of these, so a single UI serves multiple banks (Internal Medicine,
 * Family Medicine, …). Each bank carries its own question set, system order,
 * and localStorage key, so progress never collides between banks.
 */

import { SHELF_MCQS, MCQ_SYSTEMS, type McqQuestion } from "./shelfMcq";
import { FM_MCQS, FM_MCQ_SYSTEMS } from "./familyMedMcq";

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
