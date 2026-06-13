/**
 * Systematic study-reading frameworks taught in the OSCE review session:
 * the 6-step EKG read and the CXR "RIP ABCDE" mnemonic. Surfaced on the
 * read steps (as you interpret) and in feedback. Educational scaffolding —
 * it teaches HOW to read, never what this specific study shows.
 */

export interface ReadStepGuide {
  step: string;
  detail: string;
}

export const EKG_SIX_STEPS: ReadStepGuide[] = [
  { step: "1 · Rate", detail: "Count QRS complexes in a 6-second strip ×10, or 300/150/100/75/60/50 by big boxes. Normal 60–100." },
  { step: "2 · Rhythm", detail: "Sinus = a P before every QRS and the P upright in lead II. Regular vs irregular." },
  {
    step: "3 · Intervals",
    detail: "PR < 0.20 s (1 big box); QRS < 0.12 s (3 small boxes); QTc M < 0.44 / F < 0.46 (≈ ½ the RR). Memory: 1, 2, 12. Wide QRS → bundle branch block (RSR′ in V1 = RBBB, in V6 = LBBB).",
  },
  { step: "4 · Axis", detail: "Normal: I and aVF both upright. Left-axis (I up, aVF down) / right-axis (I down, aVF up)." },
  {
    step: "5 · Hypertrophy",
    detail: "Atrial: P-wave morphology in II / V1. LVH: tall R in V5–6 or deep S in V1–2 (R V5/6 + S V1 > 35 mm). RVH: R > S in V1.",
  },
  { step: "6 · Ischemia", detail: "T-wave inversions, ST depression (ischemia), ST elevation / Q waves (infarct). State the territory and reciprocal changes." },
];

export const CXR_RIP_ABCDE: ReadStepGuide[] = [
  { step: "Name it", detail: "State the projection first — e.g. 'This is a PA chest radiograph.'" },
  { step: "R · Rotation", detail: "Spinous processes midway between the clavicular heads." },
  { step: "I · Inspiration", detail: "9–10 posterior ribs visible above the diaphragm = adequate inspiration." },
  { step: "P · Penetration", detail: "Spine just visible behind the heart — not too dark, not too white." },
  { step: "A · Airway", detail: "Trachea patent and midline vs deviated; carina, mainstem bronchi." },
  { step: "B · Bones", detail: "Ribs, clavicles, spine, shoulders — fractures, lytic lesions, degenerative change." },
  { step: "C · Cardiac", detail: "Cardiothoracic ratio < 0.5; sharp borders vs silhouette sign localizing a lobe." },
  { step: "D · Diaphragm", detail: "Contour (rounded vs flat), costophrenic angles sharp vs blunted, free air under the diaphragm." },
  { step: "E · Everything else", detail: "Lung consolidation/opacity, interstitial markings, effusions, pneumothorax, lines and tubes." },
];

/**
 * The standard way to PRESENT a chest film once you've run RIP-ABCDE: a
 * flowing statement, not a checklist — quality → systematic survey → one-line
 * impression that ties the findings back to the clinical question. This is the
 * prose form a student is expected to say out loud or write in the note.
 */
export interface WriteupTemplate {
  intro: string;
  /** Sentence skeleton, one line per part of the read. */
  lines: { label: string; say: string }[];
  /** A fully worked example so the shape is concrete. */
  example: { caption: string; text: string };
}

export const CXR_WRITEUP: WriteupTemplate = {
  intro:
    "Don't just list what you checked — narrate it as one smooth statement: quality first, then a head-to-toe survey, then a one-line impression that answers the clinical question.",
  lines: [
    { label: "Open", say: "\"This is a PA (or AP) chest radiograph of [patient]. I'd confirm the details and compare with any prior films.\"" },
    { label: "Quality — RIP", say: "\"It's adequate — not rotated, well inspired (8–10 posterior ribs), and adequately penetrated.\"" },
    { label: "A — Airway", say: "\"The trachea is midline and the carina is preserved.\"" },
    { label: "B — Breathing", say: "\"The lungs are clear and equally expanded — no focal consolidation, mass, effusion, or pneumothorax; the hila are normal.\"" },
    { label: "C — Cardiac", say: "\"The cardiomediastinal contour is normal, cardiothoracic ratio under 0.5, with crisp heart borders.\"" },
    { label: "D — Diaphragm", say: "\"Both hemidiaphragms are well defined with sharp costophrenic angles and no free air beneath.\"" },
    { label: "E — Everything else", say: "\"Bones and soft tissues are intact; no lines, tubes, or surgical clips.\"" },
    { label: "Impression", say: "\"In summary, this is a normal / abnormal film showing [finding]. Given [clinical context], this fits [diagnosis], and I'd [next step].\"" },
  ],
  example: {
    caption: "Worked example — a normal film",
    text:
      "\"This is an adequately exposed PA chest radiograph with no rotation, good inspiration, and adequate penetration. The trachea is midline, the lungs are clear and well expanded with no effusion or pneumothorax, the cardiothoracic ratio is normal, and both costophrenic angles are sharp with no free air. The bones and soft tissues are unremarkable. In summary, a normal chest radiograph.\"",
  },
};

/** Pick the guide that matches a read step's image type. */
export function readingGuideFor(imageKey: string | null): {
  title: string;
  steps: ReadStepGuide[];
} | null {
  if (!imageKey) return null;
  if (/ekg|ecg/i.test(imageKey)) return { title: "Systematic EKG read — 6 steps", steps: EKG_SIX_STEPS };
  if (/cxr|xray|x-ray|radiograph/i.test(imageKey)) return { title: "Systematic CXR read — RIP ABCDE", steps: CXR_RIP_ABCDE };
  return null;
}

/**
 * LITFL Top 100 collections — curated, real, browsable sets of numbered cases
 * (ECG: litfl.com/ecg-case-NNN/, CXR: litfl.com/cxr-case-NNN/). Used for the
 * "open a representative study" link on read steps and the skills references.
 */
export const LITFL_TOP100_ECG = "https://litfl.com/top-100/ecg/";
export const LITFL_TOP100_CXR = "https://litfl.com/top-100/cxr/";

export function litflCollectionFor(imageKey: string | null): { label: string; url: string } | null {
  if (!imageKey) return null;
  if (/ekg|ecg/i.test(imageKey)) return { label: "LITFL Top 100 ECG", url: LITFL_TOP100_ECG };
  if (/cxr|xray|x-ray|radiograph/i.test(imageKey)) return { label: "LITFL Top 100 CXR", url: LITFL_TOP100_CXR };
  return null;
}
