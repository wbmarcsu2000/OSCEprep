import type { FmGuidelineDrill } from "./fmGuidelineDrills";

/** Adult immunization drills (ACIP schedule). Verify against the current ACIP
 *  adult schedule before shipping; expand via the content pipeline (Task 8). */
export const FM_IMMUNIZATION_DRILLS: FmGuidelineDrill[] = [
  {
    id: "imm-zoster",
    domain: "immunization",
    name: "Zoster (shingles) vaccine",
    org: "ACIP",
    prompt: "Recall the ACIP recommendation for zoster vaccination: product, ages, schedule, and immunocompromised note.",
    keyPoints: [
      { group: "Product", items: ["Recombinant zoster vaccine (RZV, Shingrix)", "Live zoster vaccine no longer used in the US"] },
      { group: "Who / schedule", items: ["All adults ≥50: 2 doses, 2–6 months apart", "Immunocompromised adults ≥19: 2 doses", "Give regardless of prior shingles or prior live-vaccine receipt"] },
    ],
    pearls: "RZV is preferred and is recommended even for people who previously got the old live vaccine.",
    reviewed: "2026-07-13",
  },
  {
    id: "imm-tdap",
    domain: "immunization",
    name: "Tetanus / Td / Tdap",
    org: "ACIP",
    prompt: "Recall the ACIP tetanus schedule: primary series concept, booster interval, the one-time Tdap, and pregnancy.",
    keyPoints: [
      { group: "Booster", items: ["Td or Tdap booster every 10 years", "One-time Tdap for any adult who never received it (then Td/Tdap q10y)"] },
      { group: "Pregnancy", items: ["Tdap every pregnancy, preferably 27–36 weeks"] },
      { group: "Wounds", items: ["Dirty/severe wound + last dose >5 years ago → booster now"] },
    ],
    pearls: "Either Td or Tdap satisfies the 10-year booster; give Tdap in every pregnancy.",
    reviewed: "2026-07-13",
  },
  {
    id: "imm-influenza",
    domain: "immunization",
    name: "Influenza vaccine",
    org: "ACIP",
    prompt: "Recall the ACIP influenza recommendation: who, how often, and the age-specific product note.",
    keyPoints: [
      { group: "Who / interval", items: ["Everyone ≥6 months, annually", "Ideally by end of October"] },
      { group: "Age-specific", items: ["Adults ≥65: a preferred higher-dose or adjuvanted product", "Egg allergy: any age-appropriate flu vaccine, no special precautions"] },
    ],
    pearls: "Universal annual vaccination ≥6 months; ≥65 get a preferentially recommended high-dose/adjuvanted product.",
    reviewed: "2026-07-13",
  },
];
