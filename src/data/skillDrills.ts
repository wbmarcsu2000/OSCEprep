/**
 * Skill-drill problem bank for the non-image interpretation skills (ABG /
 * acid-base, SAAG, pleural fluid, PFTs). Each problem has a stem with data, the
 * key answer concepts to credit, and a worked explanation. Used by the Drills
 * "Skills" mode for instant, repeatable practice.
 */

export interface SkillDrillProblem {
  skill: "ABG" | "Ascitic (SAAG)" | "Pleural (Light's)" | "PFT";
  stem: string;
  /** Concepts the student should state; graded by coverage. */
  answer: string[];
  explanation: string;
}

export const SKILL_DRILLS: SkillDrillProblem[] = [
  // ---- ABG / acid-base ----
  {
    skill: "ABG",
    stem: "pH 7.23 · PaCO₂ 23 · HCO₃⁻ 11 · Na 145 · Cl 100 · HCO₃⁻(BMP) 15. Interpret fully.",
    answer: ["metabolic acidosis", "high anion gap", "anion gap 30", "metabolic alkalosis", "appropriate respiratory compensation"],
    explanation:
      "Acidemia + low HCO₃⁻ with pH = metabolic acidosis. AG = 145 − 100 − 15 = 30 → HAGMA. Δ-Δ = (30−10)+11 = 31 (>30) → concurrent metabolic alkalosis. Winter's = 1.5×11+8 = 24.5±2; actual 23 → appropriate respiratory compensation.",
  },
  {
    skill: "ABG",
    stem: "pH 7.50 · PaCO₂ 28 · HCO₃⁻ 22. A young woman, anxious, tachypneic. Interpret.",
    answer: ["respiratory alkalosis", "hyperventilation", "acute"],
    explanation:
      "Alkalemia with low PaCO₂ moving opposite to pH → primary respiratory alkalosis from hyperventilation (anxiety, pain, PE, sepsis). HCO₃⁻ near-normal → acute.",
  },
  {
    skill: "ABG",
    stem: "pH 7.31 · PaCO₂ 60 · HCO₃⁻ 30. Known COPD. Interpret.",
    answer: ["respiratory acidosis", "hypoventilation", "metabolic compensation", "chronic"],
    explanation:
      "Acidemia with high PaCO₂ → respiratory acidosis (hypoventilation). Elevated HCO₃⁻ → chronic with renal metabolic compensation (COPD/CO₂ retention).",
  },
  {
    skill: "ABG",
    stem: "pH 7.30 · PaCO₂ 32 · HCO₃⁻ 15 · Na 140 · Cl 115. Severe diarrhea. Interpret.",
    answer: ["metabolic acidosis", "normal anion gap", "NAGMA", "bicarbonate loss"],
    explanation:
      "Metabolic acidosis; AG = 140 − 115 − 15 = 10 → normal-anion-gap metabolic acidosis. With diarrhea this is GI bicarbonate loss (USED-CARS). Winter's predicts PaCO₂ ≈ 30.5 — appropriate compensation.",
  },
  // ---- Ascitic SAAG ----
  {
    skill: "Ascitic (SAAG)",
    stem: "Serum albumin 4.0 · ascitic-fluid albumin 2.0. Compute the SAAG and interpret.",
    answer: ["SAAG 2.0", "high SAAG", "portal hypertension", "cirrhosis"],
    explanation:
      "SAAG = 4.0 − 2.0 = 2.0 (≥ 1.1) → portal hypertension: cirrhosis, heart failure, or Budd-Chiari. Pair with ascitic protein to separate cardiac from cirrhotic.",
  },
  {
    skill: "Ascitic (SAAG)",
    stem: "Serum albumin 3.2 · ascitic-fluid albumin 2.6. Compute the SAAG and interpret.",
    answer: ["SAAG 0.6", "low SAAG", "non-portal", "malignancy", "TB"],
    explanation:
      "SAAG = 3.2 − 2.6 = 0.6 (< 1.1) → non-portal cause: peritoneal malignancy, TB peritonitis, pancreatic, or nephrotic.",
  },
  {
    skill: "Ascitic (SAAG)",
    stem: "Cirrhotic with new ascites and fever; ascitic PMN 480/mm³. What is the diagnosis and management?",
    answer: ["SBP", "spontaneous bacterial peritonitis", "ceftriaxone", "albumin"],
    explanation:
      "Ascitic PMN ≥ 250/mm³ → spontaneous bacterial peritonitis. Treat empirically with ceftriaxone; give albumin (1.5 g/kg day 1, 1 g/kg day 3) to reduce hepatorenal syndrome.",
  },
  // ---- Pleural fluid (Light's) ----
  {
    skill: "Pleural (Light's)",
    stem: "Pleural/serum protein 0.7 · pleural/serum LDH 0.8. Classify and give a likely cause.",
    answer: ["exudate", "parapneumonic", "malignancy"],
    explanation:
      "Both ratios exceed Light's thresholds (protein > 0.5, LDH > 0.6) → exudate: parapneumonic/empyema, malignancy, PE, or TB. Send pH, glucose, cytology, cultures.",
  },
  {
    skill: "Pleural (Light's)",
    stem: "Pleural/serum protein 0.3 · pleural/serum LDH 0.4. Classify and give a likely cause.",
    answer: ["transudate", "heart failure", "cirrhosis"],
    explanation:
      "Neither Light's criterion is met → transudate: heart failure, cirrhosis (hepatic hydrothorax), or nephrotic syndrome. Treat the underlying cause.",
  },
  // ---- PFT ----
  {
    skill: "PFT",
    stem: "FEV₁/FVC 0.55, FEV₁ rises 15% after bronchodilator, DLCO normal. Pattern and likely diagnosis?",
    answer: ["obstructive", "reversible", "asthma"],
    explanation:
      "FEV₁/FVC < 0.7 → obstructive. Significant bronchodilator reversibility with preserved DLCO → asthma (vs COPD, which has ↓DLCO and is poorly reversible).",
  },
  {
    skill: "PFT",
    stem: "FEV₁/FVC 0.85, FVC and TLC reduced, DLCO reduced. Pattern and likely category?",
    answer: ["restrictive", "interstitial lung disease", "ILD", "low DLCO"],
    explanation:
      "Normal/high ratio with ↓FVC and ↓TLC → restrictive. The reduced DLCO points to parenchymal disease (interstitial lung disease) rather than neuromuscular/chest-wall causes (which spare DLCO).",
  },
];

export const SKILL_DRILL_TYPES = ["ABG", "Ascitic (SAAG)", "Pleural (Light's)", "PFT"] as const;
