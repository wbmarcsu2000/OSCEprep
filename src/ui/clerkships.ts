import type { View } from "./store";

/**
 * Clerkship structure for ClerkTools. The app is organized by clerkship (the
 * top-level tabs); each clerkship owns a set of tools (the sub-nav and the home
 * cards). Internal Medicine holds the full toolkit; Neurology is its own
 * clerkship. New clerkships are added by appending to CLERKSHIPS — the header
 * tabs, sub-nav, and home page all derive from this list.
 */

export interface ClerkshipTool {
  view: View;
  /** Label in the sub-nav and on the home card. */
  label: string;
  icon: string;
  /** Background gradient token for the home-card icon tile. */
  grad: string;
  /** One-sentence description shown on the home card. */
  blurb: string;
}

export interface Clerkship {
  id: string;
  /** Short label for the header tab. */
  short: string;
  /** Full name for headings and the home section. */
  full: string;
  tools: ClerkshipTool[];
}

export const CLERKSHIPS: Clerkship[] = [
  {
    id: "im",
    short: "IM",
    full: "Internal Medicine",
    tools: [
      {
        view: "select",
        label: "OSCE Cases",
        icon: "🩺",
        grad: "var(--grad-primary)",
        blurb:
          "Work a full clinical case end to end — interview and examine the patient, then commit to a differential, work-up, EKG/CXR reads, and management, scored by domain with teaching.",
      },
      {
        view: "drills",
        label: "Drills",
        icon: "🎯",
        grad: "var(--grad-teal)",
        blurb:
          "Short, repeatable reps on one piece at a time — differentials, work-ups, management, EKG/CXR, scores, and lab interpretation — with instant feedback.",
      },
      {
        view: "differentials",
        label: "Differentials",
        icon: "🌳",
        grad: "var(--grad-sky)",
        blurb: "The differential for every chief complaint, organized into buckets, with a Core ⟷ Advanced toggle.",
      },
      {
        view: "management",
        label: "Work-up & Mgmt",
        icon: "🧪",
        grad: "var(--grad-coral)",
        blurb:
          "Per complaint, the work-up to order and the first-line management of its key diagnoses — hidden behind a reveal so you commit before looking.",
      },
      {
        view: "shelf",
        label: "Shelf",
        icon: "📕",
        grad: "var(--grad-sun)",
        blurb:
          "Think-first cards for high-yield IM conditions — presentation, diagnosis, treatment, risk factors, and the key drug side effects.",
      },
      {
        view: "mcq",
        label: "Questions",
        icon: "❓",
        grad: "var(--grad-pink)",
        blurb:
          "Single-best-answer MCQs with instant feedback and explanations — cram by system and redo the ones you miss.",
      },
      {
        view: "skills",
        label: "Skills",
        icon: "📖",
        grad: "var(--grad-teal)",
        blurb: "Systematic reads and lab interpretation — EKG, CXR, ABG/acid–base, PFTs, and ascitic & pleural fluid.",
      },
      {
        view: "analytics",
        label: "Performance",
        icon: "📊",
        grad: "var(--grad-header)",
        blurb: "Track your scores, streaks, mastery, and progress across every tool.",
      },
    ],
  },
  {
    id: "neuro",
    short: "Neuro",
    full: "Neurology",
    tools: [
      {
        view: "neuro",
        label: "Cases",
        icon: "🧠",
        grad: "var(--grad-sky)",
        blurb: "Localize the lesion with focused neurology exam sessions and high-yield neuro cases.",
      },
    ],
  },
];

export const DEFAULT_CLERKSHIP = CLERKSHIPS[0];

/** The clerkship that owns a view (undefined for global views like home/review). */
export function clerkshipForView(view: View): Clerkship | undefined {
  return CLERKSHIPS.find((c) => c.tools.some((t) => t.view === view));
}
