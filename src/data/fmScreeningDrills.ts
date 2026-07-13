import type { FmGuidelineDrill } from "./fmGuidelineDrills";

/** Screening-guideline drills (USPSTF-anchored). Facts verified against current
 *  USPSTF recommendations; expand via the content pipeline (see plan Task 8). */
export const FM_SCREENING_DRILLS: FmGuidelineDrill[] = [
  {
    id: "screen-colorectal",
    domain: "screening",
    name: "Colorectal cancer screening",
    org: "USPSTF",
    prompt:
      "Recall the colorectal cancer screening guideline: start/stop ages, average-risk modalities and intervals, and high-risk modifications.",
    keyPoints: [
      { group: "Who / when", items: ["Start at age 45 (average risk)", "Routine 45–75", "76–85 individualized", "Stop after 85"] },
      { group: "Modalities & intervals", items: ["Colonoscopy every 10 years", "FIT annually", "FIT-DNA (Cologuard) every 1–3 years", "CT colonography every 5 years", "Flexible sigmoidoscopy every 5 years"] },
      { group: "Positive non-colonoscopy test", items: ["Any positive stool/imaging test → diagnostic colonoscopy"] },
      { group: "High risk", items: ["1st-degree relative with CRC/advanced adenoma → start at 40 or 10 years before the relative's diagnosis", "Colonoscopy every 5 years for that group", "IBD, FAP, or Lynch (HNPCC) → earlier and more frequent"] },
    ],
    pearls: "45 is the current average-risk start age (lowered from 50). Colonoscopy is both screening and diagnostic; a positive FIT/Cologuard always needs a colonoscopy.",
    reviewed: "2026-07-13",
  },
  {
    id: "screen-breast",
    domain: "screening",
    name: "Breast cancer screening",
    org: "USPSTF",
    prompt: "Recall the breast cancer screening guideline: modality, start age, interval, and stop age for average-risk women.",
    keyPoints: [
      { group: "Average risk", items: ["Biennial mammography", "Ages 40–74 (2024 USPSTF: start at 40)", "Every 2 years"] },
      { group: "Limits", items: ["≥75: insufficient evidence", "Not routine supplemental US/MRI for dense breasts (insufficient evidence)"] },
      { group: "High risk", items: ["Strong FHx / BRCA / prior chest RT → earlier + MRI; consider genetic counseling"] },
    ],
    pearls: "2024 USPSTF lowered the routine start to 40 (was 50), biennial through 74.",
    reviewed: "2026-07-13",
  },
  {
    id: "screen-lung",
    domain: "screening",
    name: "Lung cancer screening",
    org: "USPSTF",
    prompt: "Recall the lung cancer screening guideline: modality, age range, pack-year threshold, and stop rules.",
    keyPoints: [
      { group: "Modality & interval", items: ["Annual low-dose chest CT (LDCT)"] },
      { group: "Eligibility", items: ["Ages 50–80", "≥20 pack-year smoking history", "Currently smoking or quit within the past 15 years"] },
      { group: "Stop", items: ["Quit ≥15 years ago", "Develops a health problem that limits life expectancy or curative lung surgery"] },
    ],
    pearls: "2021 USPSTF broadened this: age 50 (was 55) and 20 pack-years (was 30).",
    reviewed: "2026-07-13",
  },
];
