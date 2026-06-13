/**
 * Neurology mode — a separate test format from the Internal Medicine OSCE
 * stations. Neuro reasoning is about localization and pattern recognition, not
 * EKG/CXR reads, so this has its own lightweight schema: a clinical vignette and
 * exam, then a guided answer→reveal→teach walk-through of the steps that matter
 * in neurology (localize → differential → investigations → diagnosis →
 * management). Cases are grouped into the teaching SESSIONS they belong to.
 */

/** The canonical neuro reasoning steps. A case includes the relevant subset, in
 *  order; every case ends with diagnosis + management. */
export type NeuroStepKey =
  | "localize"
  | "differential"
  | "investigations"
  | "diagnosis"
  | "management";

export interface NeuroStep {
  key: NeuroStepKey;
  /** Display label, e.g. "Localize the lesion". */
  label: string;
  /** The question posed to the student. */
  prompt: string;
  /** The worked model answer (prose). */
  idealAnswer: string;
  /** Distinctive points used for the (display-only) self-check coverage. */
  keyPoints: string[];
}

export interface NeuroCase {
  id: string;
  /** Short title, e.g. "Right C5/C6 cord hemisection". */
  title: string;
  /** The established diagnosis (the answer). */
  diagnosis: string;
  difficulty: "easy" | "moderate" | "hard";
  /** Presenting clinical scenario (one short paragraph). */
  vignette: string;
  /** Key neurologic exam findings. */
  exam: string;
  /** The relevant reasoning steps, in order. */
  steps: NeuroStep[];
  /** 2–4 teaching pearls shown at the end. */
  pearls: string[];
}

export interface NeuroSession {
  id: string;
  /** Session title, e.g. "Localization in Neurologic Disease". */
  title: string;
  /** One-line description of the session's teaching theme. */
  blurb: string;
  cases: NeuroCase[];
}

/** Labels + emoji for the step keys (UI chrome). */
export const NEURO_STEP_META: Record<NeuroStepKey, { label: string; icon: string }> = {
  localize: { label: "Localize", icon: "📍" },
  differential: { label: "Differential", icon: "🧠" },
  investigations: { label: "Investigations", icon: "🔬" },
  diagnosis: { label: "Diagnosis", icon: "🎯" },
  management: { label: "Management", icon: "💊" },
};
