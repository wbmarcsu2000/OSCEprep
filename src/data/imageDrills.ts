/**
 * Stand-alone EKG / CXR reading drills, built from the LITFL Top-100 study banks
 * + their real (CC BY-NC-SA, © LITFL) images. Pure interpretation practice: see
 * a real tracing/film, write your systematic read + diagnosis, graded against
 * the study's hallmark findings with the authoritative LITFL read as teaching.
 *
 * This is the "read a study" practice that used to be embedded (decoupled) in
 * the case post-encounter — now a dedicated drill, so the cases' own EKG/CXR can
 * be made clinically relevant to their diagnosis.
 */
import { LITFL_ECG_STUDIES, LITFL_CXR_STUDIES, litflStudyUrl } from "./litflStudies";
import { LITFL_MEDIA } from "./litflMedia";
import { ECG_VIGNETTES, CXR_VIGNETTES } from "./imageVignettes";

export interface ImageDrillProblem {
  kind: "ekg" | "cxr";
  /** LITFL case number. */
  n: number;
  diagnosis: string;
  findings: string[];
  /** Presenting clinical context, read BEFORE the image (no diagnosis named). */
  vignette: string;
  /** Real inline image (hotlinked from LITFL). */
  img: string;
  img2: string | null;
  /** Authoritative LITFL expert read, shown as teaching after grading. */
  read: string;
  /** Link to the full LITFL case. */
  url: string;
}

function build(
  kind: "ekg" | "cxr",
  studies: { n: number; diagnosis: string; findings: string[] }[],
  media: Record<number, { img: string | null; img2: string | null; read: string }>,
): ImageDrillProblem[] {
  const litflKind: "ecg" | "cxr" = kind === "ekg" ? "ecg" : "cxr";
  const vignettes = kind === "ekg" ? ECG_VIGNETTES : CXR_VIGNETTES;
  const out: ImageDrillProblem[] = [];
  for (const s of studies) {
    const m = media[s.n];
    if (!m || !m.img) continue; // only drills that can actually SHOW a study
    out.push({
      kind,
      n: s.n,
      diagnosis: s.diagnosis,
      findings: s.findings,
      vignette: vignettes[s.n] ?? "",
      img: m.img,
      img2: m.img2 ?? null,
      read: m.read ?? "",
      url: litflStudyUrl(litflKind, s.n),
    });
  }
  return out;
}

/**
 * Conduction-block reads (LBBB / RBBB) added beyond the scraped LITFL Top-100
 * bank: there is no standalone bundle-branch-block case in LITFL_ECG_STUDIES
 * (it caps at the curated 50), so these are assembled directly as drill problems
 * from the LITFL ECG library pages (real tracings, © LITFL CC BY-NC-SA 4.0).
 * Numbered 101+ to stay clear of the 1-50 case numbering.
 */
const EXTRA_ECG_DRILLS: ImageDrillProblem[] = [
  {
    kind: "ekg",
    n: 101,
    diagnosis: "Left bundle branch block (LBBB)",
    findings: [
      "QRS duration >=120 ms",
      "dominant S wave (broad rS / QS) in V1",
      "broad, notched / 'M-shaped' monophasic R wave in lateral leads I, aVL, V5-6 (no septal Q waves)",
      "appropriate discordance: ST-segment / T-wave deviation opposite the dominant QRS",
    ],
    vignette:
      "68F with exertional dyspnea and a known cardiomyopathy; routine clinic 12-lead. HR 78, BP 132/80, no chest pain. Read the ECG systematically.",
    img: "https://litfl.com/wp-content/uploads/2021/01/Left-Bundle-Branch-Block-LBBB-ECG-Strip-LITFL.png",
    img2: null,
    read: "Broad QRS (>=120 ms) with a dominant S wave in V1 and a broad, notched monophasic R wave in the lateral leads (I, aVL, V5-6) with loss of the normal septal Q waves: left bundle branch block. Expect appropriate discordance — ST/T deviation directed opposite the main QRS vector. A new LBBB with ischaemic symptoms should prompt the Sgarbossa / modified-Sgarbossa criteria, since LBBB otherwise obscures STEMI diagnosis. (LITFL ECG Library, CC BY-NC-SA 4.0)",
    url: "https://litfl.com/left-bundle-branch-block-lbbb-ecg-library/",
  },
  {
    kind: "ekg",
    n: 102,
    diagnosis: "Right bundle branch block (RBBB)",
    findings: [
      "QRS duration >=120 ms",
      "RSR' ('M-shaped' / rabbit-ear) complex in the right precordial leads V1-3",
      "wide, slurred S wave in lateral leads I, aVL, V5-6",
      "appropriate discordance: ST depression / T-wave inversion in V1-3",
    ],
    vignette:
      "59M for a pre-operative 12-lead, asymptomatic. HR 72, BP 128/76, no chest pain or dyspnea. Read the ECG systematically.",
    img: "https://litfl.com/wp-content/uploads/2018/08/Right-Bundle-Branch-Block-RBBB-ECG-Strip-LITFL.png",
    img2: null,
    read: "Broad QRS (>=120 ms) with an RSR' ('M-shaped', rabbit-ear) complex in the right precordial leads (V1-3) and a wide, slurred S wave in the lateral leads (I, aVL, V5-6): right bundle branch block. Appropriate discordance gives ST depression and T-wave inversion in V1-3. Unlike LBBB, RBBB does NOT obscure STEMI — concordant ST elevation remains diagnostic. (LITFL ECG Library, CC BY-NC-SA 4.0)",
    url: "https://litfl.com/right-bundle-branch-block-rbbb-ecg-library/",
  },
];

export const EKG_DRILLS: ImageDrillProblem[] = [
  ...build("ekg", LITFL_ECG_STUDIES, LITFL_MEDIA.ecg),
  ...EXTRA_ECG_DRILLS,
];
export const CXR_DRILLS: ImageDrillProblem[] = build("cxr", LITFL_CXR_STUDIES, LITFL_MEDIA.cxr);
