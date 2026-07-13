import { FM_SCREENING_DRILLS } from "./fmScreeningDrills";
import { FM_IMMUNIZATION_DRILLS } from "./fmImmunizationDrills";
import { FM_CHRONIC_DRILLS } from "./fmChronicDrills";

export type FmDrillDomain = "screening" | "immunization" | "chronic";

export interface FmGuidelineDrill {
  id: string;
  domain: FmDrillDomain;
  /** Guideline name, e.g. "Colorectal cancer screening". */
  name: string;
  /** Issuing body, e.g. "USPSTF" — shown as the source credit. */
  org: string;
  /** Cued prompt naming the dimensions to recall. */
  prompt: string;
  /** Grouped key facts — the coverage answer key. */
  keyPoints: { group: string; items: string[] }[];
  /** High-yield notes shown on reveal. */
  pearls?: string;
  /** ISO date the facts were last verified against the guideline. */
  reviewed: string;
}

export const FM_GUIDELINE_DRILLS: FmGuidelineDrill[] = [
  ...FM_SCREENING_DRILLS,
  ...FM_IMMUNIZATION_DRILLS,
  ...FM_CHRONIC_DRILLS,
];

export const FM_DOMAIN_ORDER: FmDrillDomain[] = ["screening", "immunization", "chronic"];

export const FM_DOMAIN_LABELS: Record<FmDrillDomain, string> = {
  screening: "Screening",
  immunization: "Immunizations",
  chronic: "Chronic Disease",
};

export const FM_DOMAIN_EMOJI: Record<FmDrillDomain, string> = {
  screening: "🔎",
  immunization: "💉",
  chronic: "🩺",
};

export function fmDrillsForDomain(domain: FmDrillDomain): FmGuidelineDrill[] {
  return FM_GUIDELINE_DRILLS.filter((d) => d.domain === domain);
}

/** Spoiler-safe browse entries for a domain (name only, never the answer key). */
export function fmDrillCatalog(domain: FmDrillDomain): { id: string; label: string; group?: string }[] {
  return fmDrillsForDomain(domain).map((d) => ({ id: d.id, label: d.name, group: d.org }));
}
