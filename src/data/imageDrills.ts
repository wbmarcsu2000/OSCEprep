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

export interface ImageDrillProblem {
  kind: "ekg" | "cxr";
  /** LITFL case number. */
  n: number;
  diagnosis: string;
  findings: string[];
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
  const out: ImageDrillProblem[] = [];
  for (const s of studies) {
    const m = media[s.n];
    if (!m || !m.img) continue; // only drills that can actually SHOW a study
    out.push({
      kind,
      n: s.n,
      diagnosis: s.diagnosis,
      findings: s.findings,
      img: m.img,
      img2: m.img2 ?? null,
      read: m.read ?? "",
      url: litflStudyUrl(litflKind, s.n),
    });
  }
  return out;
}

export const EKG_DRILLS: ImageDrillProblem[] = build("ekg", LITFL_ECG_STUDIES, LITFL_MEDIA.ecg);
export const CXR_DRILLS: ImageDrillProblem[] = build("cxr", LITFL_CXR_STUDIES, LITFL_MEDIA.cxr);
