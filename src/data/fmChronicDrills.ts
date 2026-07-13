import type { FmGuidelineDrill } from "./fmGuidelineDrills";

/** Chronic-disease guideline drills (GOLD/GINA/ADA/ACC-AHA…). Verify targets and
 *  thresholds against current guidelines before shipping; expand in Task 8. */
export const FM_CHRONIC_DRILLS: FmGuidelineDrill[] = [
  {
    id: "chronic-copd",
    domain: "chronic",
    name: "COPD (GOLD)",
    org: "GOLD",
    prompt: "Recall GOLD COPD management: diagnosis, ABE assessment, initial pharmacotherapy, and exacerbation treatment.",
    keyPoints: [
      { group: "Diagnosis", items: ["Post-bronchodilator FEV1/FVC < 0.70"] },
      { group: "Assess (ABE)", items: ["Symptoms via mMRC or CAT + exacerbation history", "Group A (low symptoms, ≤1 exacerbation)", "Group B (more symptoms, ≤1 exacerbation)", "Group E (≥2 exacerbations or ≥1 hospitalization)"] },
      { group: "Initial pharmacotherapy", items: ["A → a bronchodilator", "B → LABA + LAMA", "E → LABA + LAMA; add ICS if blood eosinophils ≥ 300"] },
      { group: "Exacerbation", items: ["Short-acting bronchodilators", "Oral corticosteroids for 5 days", "Antibiotics if increased sputum purulence/volume or ventilated", "Target O2 sat 88–92%"] },
      { group: "Mortality benefit", items: ["Smoking cessation", "Long-term O2 if PaO2 ≤ 55 mmHg or SaO2 ≤ 88%"] },
    ],
    pearls: "Only smoking cessation and long-term O2 (in chronic hypoxemia) improve COPD mortality. ICS is added in Group E when eosinophils are high.",
    reviewed: "2026-07-13",
  },
  {
    id: "chronic-htn",
    domain: "chronic",
    name: "Hypertension (ACC/AHA)",
    org: "ACC/AHA",
    prompt: "Recall the ACC/AHA hypertension guideline: stage thresholds, treatment target, and first-line agents.",
    keyPoints: [
      { group: "Definitions", items: ["Elevated 120–129 / <80", "Stage 1 130–139 or 80–89", "Stage 2 ≥140 or ≥90"] },
      { group: "Treatment target", items: ["<130/80 for most adults"] },
      { group: "First-line agents", items: ["Thiazide diuretic", "ACE inhibitor or ARB", "Calcium channel blocker", "Black adults without CKD: start with CCB or thiazide", "CKD/diabetes with albuminuria: include ACEi/ARB"] },
      { group: "Start 2 drugs if", items: ["BP ≥ 20/10 above goal (stage 2)"] },
    ],
    pearls: "ACC/AHA 2017 lowered the diagnosis threshold to 130/80 and the target to <130/80.",
    reviewed: "2026-07-13",
  },
  {
    id: "chronic-t2dm",
    domain: "chronic",
    name: "Type 2 diabetes (ADA)",
    org: "ADA",
    prompt: "Recall the ADA type 2 diabetes guideline: A1c goal, first-line therapy, and agent choice with ASCVD/HF/CKD.",
    keyPoints: [
      { group: "A1c goal", items: ["< 7% for most adults", "Individualize (looser if frail / limited life expectancy)"] },
      { group: "First-line", items: ["Lifestyle + metformin", "Choose additional agents by comorbidity, not just A1c"] },
      { group: "Comorbidity-driven choice", items: ["ASCVD → GLP-1 RA or SGLT2 inhibitor with proven CV benefit", "Heart failure → SGLT2 inhibitor", "CKD → SGLT2 inhibitor (GLP-1 RA if not tolerated)"] },
    ],
    pearls: "With ASCVD/HF/CKD, pick a GLP-1 RA or SGLT2i for organ protection even if A1c is near goal.",
    reviewed: "2026-07-13",
  },
];
