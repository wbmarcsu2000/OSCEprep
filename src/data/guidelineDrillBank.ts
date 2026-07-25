// src/data/guidelineDrillBank.ts
/**
 * Bank-driven guideline drills (the McqBank pattern): a DrillBank descriptor
 * carries one clerkship's domains, drills, copy, and storage key so the
 * GuidelineDrills screen, progress store, analytics, and export/reset are all
 * generic. Add a clerkship's drills by appending a bank here — no screen or
 * store changes needed.
 */
import {
  FM_GUIDELINE_DRILLS,
  FM_DOMAIN_ORDER,
  FM_DOMAIN_LABELS,
  FM_DOMAIN_EMOJI,
} from "./fmGuidelineDrills";
import { OB_DOMAINS, OB_GUIDELINE_DRILLS } from "./obGuidelineDrills";

export interface GuidelineDrill {
  id: string;
  domain: string;
  /** Guideline name, e.g. "Postpartum hemorrhage". */
  name: string;
  /** Issuing body, e.g. "ACOG" — shown as the source credit. */
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

export interface DrillDomainDef {
  id: string;
  label: string;
  emoji: string;
}

export interface DrillBank {
  /** Short id — also the telemetry drillType prefix (`${id}-${domain}`). */
  id: string;
  title: string;
  blurb: string;
  icon: string;
  grad: string;
  /** Shown in the Analytics section title: "Guideline drills (<label>)". */
  clerkshipLabel: string;
  domains: DrillDomainDef[];
  drills: GuidelineDrill[];
  storageKey: string;
}

export const FM_DRILL_BANK: DrillBank = {
  id: "fm",
  title: "Guideline Drills",
  blurb:
    "Master one guideline at a time — recall its key facts, graded instantly. Screening, immunizations, and chronic-disease management for the Family Medicine shelf.",
  icon: "🎯",
  grad: "var(--grad-teal)",
  clerkshipLabel: "Family Medicine",
  domains: FM_DOMAIN_ORDER.map((d) => ({ id: d, label: FM_DOMAIN_LABELS[d], emoji: FM_DOMAIN_EMOJI[d] })),
  drills: FM_GUIDELINE_DRILLS,
  storageKey: "osce.fmdrills.v1",
};

export const OB_DRILL_BANK: DrillBank = {
  id: "ob",
  title: "Guideline Drills",
  blurb:
    "Master one guideline at a time — recall its key facts, graded instantly. Prenatal care, OB complications, labor & fetal monitoring, and gynecology for the OB/GYN shelf.",
  icon: "🎯",
  grad: "var(--grad-coral)",
  clerkshipLabel: "OB/GYN",
  domains: OB_DOMAINS,
  drills: OB_GUIDELINE_DRILLS,
  storageKey: "osce.obdrills.v1",
};

export const GUIDELINE_DRILL_BANKS: DrillBank[] = [FM_DRILL_BANK, OB_DRILL_BANK];

/** Single source of truth for export/import/reset (analytics ALL_KEYS). */
export const DRILL_STORAGE_KEYS: string[] = GUIDELINE_DRILL_BANKS.map((b) => b.storageKey);

export function drillsForDomain(bank: DrillBank, domain: string): GuidelineDrill[] {
  return bank.drills.filter((d) => d.domain === domain);
}

/** Spoiler-safe browse entries for a domain (name only, never the answer key). */
export function drillCatalog(
  bank: DrillBank,
  domain: string,
): { id: string; label: string; group?: string }[] {
  return drillsForDomain(bank, domain).map((d) => ({ id: d.id, label: d.name, group: d.org }));
}
