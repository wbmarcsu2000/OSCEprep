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
  // ---- ABG (additional) ----
  {
    skill: "ABG",
    stem: "pH 7.49 · PaCO₂ 46 · HCO₃⁻ 34. Recurrent vomiting. Interpret.",
    answer: ["metabolic alkalosis", "appropriate respiratory compensation", "acid loss / vomiting", "check urine chloride"],
    explanation:
      "Alkalemia with a high HCO₃⁻ moving the same direction as pH → metabolic alkalosis. Compensatory hypoventilation: expected PaCO₂ = 0.7 × (34 − 24) + 40 = 47 (± 2); actual 46 → appropriate. Vomiting/NG suction is saline-responsive (urine Cl < 20) vs hyperaldosteronism, which is saline-resistant (urine Cl > 20).",
  },
  {
    skill: "ABG",
    stem: "pH 7.43 · PaCO₂ 22 · HCO₃⁻ 14 · Na 140 · Cl 102. Tinnitus and tachypnea after an overdose. Interpret.",
    answer: ["high anion gap metabolic acidosis", "anion gap 24", "respiratory alkalosis", "mixed disorder", "salicylate toxicity"],
    explanation:
      "AG = 140 − 102 − 14 = 24 → high-anion-gap metabolic acidosis. Winter's expected PaCO₂ = 1.5 × 14 + 8 = 29 (± 2); actual 22 is well below that → a concurrent PRIMARY respiratory alkalosis, not just compensation. A near-normal pH with both a low HCO₃⁻ and a low PaCO₂ = mixed HAGMA + respiratory alkalosis — the classic salicylate-toxicity picture.",
  },
  {
    skill: "ABG",
    stem: "pH 7.24 · PaCO₂ 80 · HCO₃⁻ 33. Known COPD, now drowsy with a pneumonia. Interpret.",
    answer: ["respiratory acidosis", "acute-on-chronic", "hypoventilation", "incomplete metabolic compensation"],
    explanation:
      "Acidemia with a high PaCO₂ moving opposite to pH → respiratory acidosis (hypoventilation). Chronic retention raises HCO₃⁻ ~3.5 per 10 mmHg, so a purely chronic PaCO₂ of 80 would predict HCO₃⁻ ≈ 24 + 3.5 × 4 = 38; the measured 33 is lower → an acute rise superimposed on chronic retention (acute-on-chronic).",
  },
  // ---- Ascitic (SAAG) (additional) ----
  {
    skill: "Ascitic (SAAG)",
    stem: "Serum albumin 4.2 · ascitic-fluid albumin 2.5 · ascitic total protein 4.0. Compute the SAAG and interpret.",
    answer: ["SAAG 1.7", "high SAAG", "portal hypertension", "high ascitic protein", "cardiac / heart failure"],
    explanation:
      "SAAG = 4.2 − 2.5 = 1.7 (≥ 1.1) → portal hypertension. Ascitic total protein 4.0 (> 2.5) makes this a high-protein, high-SAAG fluid, which points to a cardiac/post-sinusoidal cause (heart failure, constrictive pericarditis, Budd-Chiari) rather than cirrhosis (typically protein < 2.5).",
  },
  {
    skill: "Ascitic (SAAG)",
    stem: "Serum albumin 3.5 · ascitic-fluid albumin 3.1. Compute the SAAG, interpret, and name next tests.",
    answer: ["SAAG 0.4", "low SAAG", "non-portal", "malignancy / TB / pancreatic", "cytology"],
    explanation:
      "SAAG = 3.5 − 3.1 = 0.4 (< 1.1) → non-portal: peritoneal carcinomatosis, TB peritonitis, pancreatic ascites, or nephrotic syndrome. Send ascitic cytology, amylase (pancreatic), and adenosine deaminase / consider TB workup; the total protein is usually > 2.5 in these.",
  },
  {
    skill: "Ascitic (SAAG)",
    stem: "Cirrhotic with ascites and fever. Ascitic fluid WBC 1000/mm³ with 40% neutrophils. Compute the PMN count and decide management.",
    answer: ["PMN 400", "SBP", "spontaneous bacterial peritonitis", "ceftriaxone", "albumin"],
    explanation:
      "PMN = 1000 × 0.40 = 400/mm³ (≥ 250) → spontaneous bacterial peritonitis. Start empiric ceftriaxone and give IV albumin (1.5 g/kg day 1, 1 g/kg day 3) to lower hepatorenal-syndrome risk. Polymicrobial culture with high protein and low glucose would instead suggest secondary peritonitis.",
  },
  // ---- Pleural (Light's) (additional) ----
  {
    skill: "Pleural (Light's)",
    stem: "Pleural protein 4.0 (serum 6.0) · pleural LDH 300 (serum LDH 200, ULN 220) · bloody fluid. Classify and give a likely cause.",
    answer: ["exudate", "protein ratio 0.67", "LDH ratio 1.5", "malignancy"],
    explanation:
      "Protein ratio = 4.0/6.0 = 0.67 (> 0.5) ✓; LDH ratio = 300/200 = 1.5 (> 0.6) ✓; pleural LDH 300 > ⅔ × 220 = 147 ✓. Any one criterion → exudate (all three met). A bloody exudate suggests malignancy, PE, or trauma — send cytology.",
  },
  {
    skill: "Pleural (Light's)",
    stem: "Pleural protein 3.0 (serum 7.5) · pleural LDH 250 (serum LDH 180, ULN 220). Classify and state the teaching point.",
    answer: ["exudate", "protein ratio 0.40 below cutoff", "LDH criteria met", "any one criterion suffices"],
    explanation:
      "Protein ratio = 3.0/7.5 = 0.40 (< 0.5) ✗, but LDH ratio = 250/180 = 1.39 (> 0.6) ✓ and pleural LDH 250 > ⅔ × 220 = 147 ✓. Light's labels this an exudate because ANY single criterion qualifies — don't stop at a normal protein ratio.",
  },
  {
    skill: "Pleural (Light's)",
    stem: "Pleural protein 2.5 (serum 6.5) · pleural LDH 110 (serum LDH 200, ULN 220) · bilateral effusions in a diuresed CHF patient. Classify.",
    answer: ["transudate", "no Light's criterion met", "heart failure", "albumin gradient if borderline"],
    explanation:
      "Protein ratio = 2.5/6.5 = 0.38 (< 0.5) ✗; LDH ratio = 110/200 = 0.55 (< 0.6) ✗; pleural LDH 110 < ⅔ × 220 = 147 ✗. None met → transudate (heart failure). If diuresis pushes a transudate just over a cutoff, a serum-to-effusion albumin gradient > 1.2 g/dL correctly reclassifies it.",
  },
  // ---- PFT (additional) ----
  {
    skill: "PFT",
    stem: "FEV₁/FVC 0.80 with normal FVC and TLC, but DLCO 45% predicted. Pattern and likely category?",
    answer: ["normal spirometry", "isolated low DLCO", "pulmonary vascular disease", "pulmonary hypertension / chronic PE"],
    explanation:
      "Normal ratio with normal volumes → neither obstruction nor restriction. An isolated, disproportionately low DLCO with intact mechanics points to pulmonary vascular disease (pulmonary hypertension, chronic thromboembolic disease); also correct DLCO for hemoglobin, since anemia lowers it.",
  },
  {
    skill: "PFT",
    stem: "FEV₁/FVC 0.60 (obstructive range) with FVC reduced AND TLC reduced. Pattern?",
    answer: ["mixed obstructive-restrictive", "low ratio = obstruction", "low TLC confirms restriction", "lung volumes required"],
    explanation:
      "FEV₁/FVC 0.60 (< 0.70) → obstruction. A low FVC alone could just reflect air-trapping and cannot prove restriction; here the reduced TLC confirms a true restrictive component → mixed obstructive-restrictive (e.g., COPD plus ILD, or sarcoidosis).",
  },
  {
    skill: "PFT",
    stem: "FEV₁/FVC 0.58; FEV₁ 2.00 L → 2.12 L after bronchodilator; DLCO normal; daily copious purulent sputum and recurrent infections. Pattern, reversibility, likely diagnosis?",
    answer: ["obstructive", "not significantly reversible", "+120 mL / +6%", "bronchiectasis"],
    explanation:
      "Ratio 0.58 (< 0.70) → obstructive. FEV₁ rises 0.12 L = 120 mL and 120/2000 = 6% — failing both the ≥ 200 mL and ≥ 12% thresholds → not significantly reversible. Irreversible obstruction with preserved DLCO plus daily purulent sputum and recurrent infection → bronchiectasis (COPD more often lowers DLCO; asthma reverses).",
  },
];

export const SKILL_DRILL_TYPES = ["ABG", "Ascitic (SAAG)", "Pleural (Light's)", "PFT"] as const;
