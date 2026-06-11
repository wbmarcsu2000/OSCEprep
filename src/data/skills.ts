/**
 * "Special skills" reference, modeled on the OSCE review session's skills
 * section: arterial blood gas / acid-base, pulmonary function tests, and
 * ascitic & pleural fluid interpretation. Educational reference content —
 * formulas, stepwise approaches, and worked examples — shown on a dedicated
 * Skills page (the EKG 6-step and CXR RIP-ABCDE live in readingGuides.ts and
 * are shown alongside these).
 */

export interface SkillStep {
  step: string;
  detail: string;
}

export interface SkillSection {
  heading: string;
  items: string[];
}

export interface SkillTable {
  title: string;
  columns: [string, string];
  rows: [string, string][];
}

export interface SkillExample {
  prompt: string;
  lines: string[];
}

export interface SkillRef {
  label: string;
  source: string;
  url?: string;
}

export interface SkillCard {
  id: string;
  title: string;
  subtitle?: string;
  steps?: SkillStep[];
  sections?: SkillSection[];
  tables?: SkillTable[];
  example?: SkillExample;
  references?: SkillRef[];
}

export const SKILLS: SkillCard[] = [
  // ----------------------------------------------------------------- ABG / A-B
  {
    id: "abg",
    title: "Arterial Blood Gas & Acid-Base",
    subtitle: "Normal: pH 7.40 · PaCO₂ 40 · HCO₃⁻ 24",
    steps: [
      { step: "1 · Acidemia or alkalemia?", detail: "pH < 7.35 = acidemia; pH > 7.45 = alkalemia (use the pH, not the compensated values)." },
      {
        step: "2 · Respiratory or metabolic?",
        detail: "If PaCO₂ and pH move the SAME direction → metabolic. If OPPOSITE directions → respiratory. (↑CO₂ with ↓pH = respiratory acidosis; ↓HCO₃⁻ with ↓pH = metabolic acidosis.)",
      },
      {
        step: "3 · Anion gap (if metabolic acidosis)",
        detail: "AG = Na − Cl − HCO₃⁻. Elevated if > ~10–12. Correct for albumin: add 2.5 per 1 g/dL below 4.",
      },
      {
        step: "4 · Delta-delta (if high-anion-gap acidosis)",
        detail: "Δ-Δ = (AG − 10) + measured HCO₃⁻. > 30 → concurrent metabolic alkalosis; < 22 → concurrent non-anion-gap metabolic acidosis.",
      },
      {
        step: "5 · Respiratory compensation",
        detail: "Winter's formula: expected PaCO₂ = 1.5 × HCO₃⁻ + 8 (± 2). Shortcut: the last two digits of the pH ≈ expected PaCO₂. Actual CO₂ > expected → concurrent respiratory acidosis; < expected → concurrent respiratory alkalosis.",
      },
      {
        step: "6 · Put it together",
        detail: "Name the primary disturbance, whether compensation is appropriate, and any additional concurrent process the math reveals.",
      },
    ],
    tables: [
      {
        title: "Differential by disturbance",
        columns: ["Disturbance", "Causes"],
        rows: [
          ["High-anion-gap metabolic acidosis", "MUDPILES / KIL-U: Ketoacidosis (DKA, starvation, alcoholic), Ingestions (methanol, ethylene glycol, propylene glycol, salicylates, INH), Lactic acidosis, Uremia"],
          ["Non-anion-gap metabolic acidosis", "USED-CARS: diarrhea (bicarb loss), excessive normal saline, renal tubular acidosis"],
          ["Metabolic alkalosis", "Vomiting / NG suction (acid loss), diuretics, primary hyperaldosteronism"],
          ["Respiratory acidosis (hypoventilation)", "Opioids / central depression, obesity-hypoventilation, neuromuscular weakness, COPD"],
          ["Respiratory alkalosis (hyperventilation)", "Acute V/Q mismatch (PE, pneumonia), anxiety, pain, high altitude, pregnancy, early salicylate toxicity"],
        ],
      },
    ],
    example: {
      prompt: "pH 7.23 · PaCO₂ 23 · HCO₃⁻ 11 · Na 145 · Cl 100 · HCO₃⁻(BMP) 15",
      lines: [
        "Acidemia (pH 7.23) and HCO₃⁻ is low with pH → metabolic acidosis.",
        "Anion gap = 145 − 100 − 15 = 30 → high-anion-gap metabolic acidosis.",
        "Δ-Δ = (30 − 10) + 11 = 31 → > 30, so a concurrent metabolic alkalosis.",
        "Winter's = 1.5 × 11 + 8 = 24.5 ± 2; actual PaCO₂ 23 → appropriate respiratory compensation.",
        "Final: HAGMA + concurrent metabolic alkalosis, with appropriate respiratory compensation.",
      ],
    },
    references: [
      { label: "Acid-base interpretation", source: "First Aid Clinical Pattern Recognition (Step 2 CK)" },
      { label: "Acid-base & electrolyte teaching", source: "MDCalc — Anion Gap, Winter's Formula", url: "https://www.mdcalc.com/" },
    ],
  },

  // ------------------------------------------------------------------------ PFT
  {
    id: "pft",
    title: "Pulmonary Function Tests",
    subtitle: "Start with the FEV₁/FVC ratio",
    sections: [
      {
        heading: "Pattern from the ratio",
        items: [
          "Obstructive: FEV₁/FVC < 0.7 — asthma, COPD, bronchiectasis.",
          "Restrictive: FEV₁/FVC normal or high with ↓ FVC and ↓ TLC — ILD, neuromuscular weakness, chest-wall / obesity.",
          "Mixed patterns occur; confirm restriction with lung volumes (TLC), not spirometry alone.",
        ],
      },
      {
        heading: "Bronchodilator response & DLCO",
        items: [
          "Reversibility (≥ 12% and 200 mL rise in FEV₁ after bronchodilator) favors asthma over COPD.",
          "DLCO ↓ in emphysema, ILD, pulmonary vascular disease; preserved/↑ in asthma; ↓ disproportionate to spirometry suggests pulmonary vascular disease.",
        ],
      },
    ],
    tables: [
      {
        title: "Quick pattern guide",
        columns: ["Pattern", "Typical causes"],
        rows: [
          ["Obstructive, reversible", "Asthma"],
          ["Obstructive, ↓DLCO, irreversible", "COPD / emphysema"],
          ["Restrictive, ↓DLCO", "Interstitial lung disease"],
          ["Restrictive, normal DLCO", "Neuromuscular / chest-wall / obesity"],
        ],
      },
    ],
    references: [{ label: "Spirometry interpretation", source: "ATS/ERS Standardization of Spirometry" }],
  },

  // -------------------------------------------------------------- Ascitic Fluid
  {
    id: "ascitic",
    title: "Ascitic Fluid (SAAG)",
    subtitle: "SAAG = serum albumin − ascitic-fluid albumin",
    sections: [
      {
        heading: "Interpret the gradient",
        items: [
          "SAAG ≥ 1.1 g/dL → portal hypertension (something pushing water into the belly): cirrhosis, heart failure, Budd-Chiari.",
          "SAAG < 1.1 g/dL → non-portal (something leaking/building up): malignancy, TB peritonitis, pancreatic, nephrotic.",
          "A high SAAG with high ascitic protein (> 2.5) points to a cardiac/post-sinusoidal cause rather than cirrhosis.",
        ],
      },
      {
        heading: "Spontaneous bacterial peritonitis (SBP)",
        items: [
          "Diagnostic paracentesis on any cirrhotic with new ascites, fever, abdominal pain, or encephalopathy.",
          "Ascitic PMN ≥ 250 cells/mm³ → treat empirically (ceftriaxone).",
          "Send: cell count with differential, culture (bedside into blood-culture bottles), albumin, total protein.",
          "SBP is not necessarily a low-SAAG fluid — interpret cell count independently.",
        ],
      },
    ],
    example: {
      prompt: "Serum albumin 4.0 · ascitic-fluid albumin 2.0",
      lines: [
        "SAAG = 4.0 − 2.0 = 2.0 g/dL (≥ 1.1).",
        "→ Portal hypertension: cirrhosis, heart failure, or Budd-Chiari. Pair with the ascitic protein and clinical picture to narrow.",
      ],
    },
    references: [{ label: "Ascitic fluid analysis / SBP", source: "AASLD Ascites & SBP Guidance" }],
  },

  // -------------------------------------------------------------- Pleural Fluid
  {
    id: "pleural",
    title: "Pleural Fluid (Light's Criteria)",
    subtitle: "Exudate if ANY one criterion is met",
    sections: [
      {
        heading: "Light's criteria — exudate if any of:",
        items: [
          "Pleural / serum protein ratio > 0.5",
          "Pleural / serum LDH ratio > 0.6",
          "Pleural LDH > ⅔ the upper limit of normal serum LDH",
        ],
      },
      {
        heading: "What the pattern means",
        items: [
          "Transudate (something pushing fluid in): heart failure, cirrhosis, nephrotic syndrome.",
          "Exudate (something inflammatory/leaking): parapneumonic / empyema, malignancy, PE, TB, pancreatitis.",
          "For an exudate, send pH, glucose, cytology, and cultures; pH < 7.2 in a parapneumonic effusion suggests a complicated effusion needing drainage.",
        ],
      },
    ],
    tables: [
      {
        title: "Transudate vs exudate",
        columns: ["Transudate", "Exudate"],
        rows: [
          ["Heart failure", "Parapneumonic / empyema"],
          ["Cirrhosis (hepatic hydrothorax)", "Malignancy"],
          ["Nephrotic syndrome", "Pulmonary embolism · TB · pancreatitis"],
        ],
      },
    ],
    references: [{ label: "Pleural effusion investigation", source: "BTS Pleural Disease Guideline; Light's criteria" }],
  },
];
