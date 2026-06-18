/**
 * Skill-drill problem bank for the non-image interpretation skills (ABG /
 * acid-base, SAAG, pleural fluid, PFTs). Each problem has a stem with data, the
 * key answer concepts to credit, and a worked explanation. Used by the Drills
 * "Skills" mode for instant, repeatable practice.
 */

export interface SkillDrillProblem {
  skill:
    | "ABG"
    | "Ascitic (SAAG)"
    | "Pleural (Light's)"
    | "PFT"
    | "CSF"
    | "Iron studies"
    | "LFTs"
    | "Hyponatremia"
    | "Synovial fluid"
    | "TFTs"
    | "Urinalysis"
    | "Coags";
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
  {
    "skill": "CSF",
    "stem": "Adult with fever, headache, neck stiffness. LP: opening pressure 32 cm H₂O · WBC 4,200/µL (92% neutrophils) · glucose 28 mg/dL (serum glucose 110) · protein 220 mg/dL · Gram stain pending. Interpret the CSF pattern and give the likely category.",
    "answer": [
      "bacterial meningitis",
      "markedly elevated WBC with neutrophil predominance",
      "CSF:serum glucose ratio 0.25 (low)",
      "high protein (220)",
      "elevated opening pressure (32)",
      "start empiric antibiotics ± dexamethasone now"
    ],
    "explanation": "A high opening pressure (32; normal 6–20 cm H₂O) with a markedly elevated, neutrophil-predominant WBC (4,200/µL, 92% PMNs) points to bacterial meningitis. CSF:serum glucose ratio = 28/110 = 0.25 (normal ≥ 0.6; <0.4 is clearly abnormal) and protein is high at 220 (normal 15–45 mg/dL) — the classic low-glucose, high-protein, neutrophilic bacterial profile. Start empiric antibiotics plus dexamethasone immediately; do not wait on the Gram stain."
  },
  {
    "skill": "CSF",
    "stem": "Previously healthy 22-year-old, 3 days of headache, photophobia, low-grade fever, normal mental status. LP: opening pressure 18 cm H₂O · WBC 180/µL (88% lymphocytes) · glucose 62 mg/dL (serum glucose 95) · protein 55 mg/dL. Interpret.",
    "answer": [
      "viral / aseptic meningitis",
      "lymphocytic pleocytosis",
      "normal CSF glucose",
      "CSF:serum glucose ratio 0.65 (normal)",
      "mildly elevated protein (55)",
      "normal opening pressure (18)"
    ],
    "explanation": "A modest lymphocyte-predominant pleocytosis (typically <500/µL) with a NORMAL glucose is the hallmark of viral/aseptic meningitis (e.g., enterovirus, HSV). CSF:serum glucose ratio = 62/95 = 0.65 (normal ≥ 0.6) and protein only mildly elevated at 55 (normal 15–45) — distinguishing it from bacterial (low glucose, neutrophils) and TB/fungal (low glucose, very high protein, lymphocytes). Generally supportive care; cover HSV with acyclovir if encephalitis features are present."
  },
  {
    "skill": "CSF",
    "stem": "HIV-positive patient (CD4 40), 2 weeks of indolent headache and malaise. LP: opening pressure 38 cm H₂O · WBC 45/µL (90% lymphocytes) · glucose 26 mg/dL (serum glucose 100) · protein 110 mg/dL. Interpret and name the test that confirms the leading diagnosis.",
    "answer": [
      "fungal / TB pattern",
      "cryptococcal meningitis",
      "lymphocytic pleocytosis",
      "low glucose, CSF:serum glucose ratio 0.26",
      "high protein (110)",
      "markedly elevated opening pressure (38)",
      "cryptococcal antigen (CrAg) / India ink"
    ],
    "explanation": "An indolent course in advanced HIV with a high opening pressure, LOW glucose (ratio 26/100 = 0.26), high protein, and a low-grade LYMPHOCYTIC pleocytosis is the fungal/TB profile — here cryptococcal meningitis. Confirm with CSF cryptococcal antigen (CrAg, most sensitive) or India ink; TB meningitis gives a similar low-glucose lymphocytic picture (send AFB smear/MTB PCR). The very high opening pressure requires serial therapeutic LPs in addition to antifungals."
  },
  {
    "skill": "CSF",
    "stem": "38-year-old, 10 days after a diarrheal illness, now with ascending symmetric weakness and areflexia. LP: WBC 3/µL · glucose 65 mg/dL (serum 100) · protein 140 mg/dL · normal opening pressure. Interpret the CSF pattern and name the syndrome.",
    "answer": [
      "albuminocytologic dissociation",
      "high protein (140) with normal cell count",
      "Guillain-Barré syndrome / AIDP",
      "normal glucose",
      "normal opening pressure"
    ],
    "explanation": "Elevated protein (140; normal 15–45 mg/dL) with an essentially normal cell count (WBC 3/µL, ≤5 is normal) is albuminocytologic dissociation, the classic CSF finding in Guillain-Barré syndrome (AIDP). Glucose is normal and there is no pleocytosis, which separates it from infectious causes; note the protein may be normal in the first week and rise thereafter. Manage with monitoring of respiratory and autonomic status plus IVIG or plasma exchange."
  },
  {
    "skill": "Iron studies",
    "stem": "A 34-year-old woman with menorrhagia. Hb 9.6 g/dL · MCV 74 fL · ferritin 8 ng/mL · serum iron low · TIBC 480 µg/dL · transferrin saturation 9%. Interpret the iron studies and give the diagnosis.",
    "answer": [
      "microcytic anemia (MCV <80)",
      "ferritin low (8; <30 specific, <15 confirms depleted stores)",
      "TIBC high (480; >400-450)",
      "transferrin saturation low (9%; deficient <16%)",
      "iron-deficiency anemia",
      "find source of blood loss (menorrhagia)"
    ],
    "explanation": "Microcytic anemia (MCV 74, <80) with ferritin 8 ng/mL is diagnostic of iron deficiency: ferritin <30 ng/mL is highly specific for depleted stores and <15 essentially confirms it. Iron deficiency upregulates hepatic transferrin so TIBC is HIGH (480; normal ~250-450) while transferrin saturation (serum iron/TIBC) falls to 9% (deficient <16%). Bottom line: iron-deficiency anemia — replace iron and identify the bleeding source (menorrhagia here; screen GI in older/male patients)."
  },
  {
    "skill": "Iron studies",
    "stem": "A 70-year-old man with rheumatoid arthritis and CKD. Hb 10.2 g/dL · MCV 88 fL · ferritin 240 ng/mL · serum iron low (~38 µg/dL) · TIBC 210 µg/dL · transferrin saturation 18%. Interpret the iron studies and give the diagnosis.",
    "answer": [
      "normocytic anemia (MCV 88)",
      "serum iron low",
      "ferritin normal-to-high (240)",
      "TIBC low (210) — key discriminator vs IDA",
      "anemia of chronic disease / inflammation",
      "hepcidin-mediated iron sequestration"
    ],
    "explanation": "Normocytic anemia with LOW serum iron but a normal-to-high ferritin (240, an acute-phase reactant) and a LOW TIBC (210) is the signature of anemia of chronic disease/inflammation: hepcidin sequesters iron in stores and suppresses transferrin — the mirror image of iron deficiency. TIBC is the key discriminator: HIGH in IDA, LOW in ACD (transferrin saturation overlaps and is unhelpful alone). Bottom line: anemia of chronic disease driven by his RA/CKD inflammation, not iron deficiency."
  },
  {
    "skill": "Iron studies",
    "stem": "A 62-year-old woman with active Crohn's disease. Hb 9.0 g/dL · MCV 80 fL · ferritin 65 ng/mL · serum iron low · TIBC 300 µg/dL · transferrin saturation 8%. Why can't ferritin alone settle this, and what is the interpretation?",
    "answer": [
      "ferritin is an acute-phase reactant — falsely raised by inflammation",
      "ferritin <100 (not <30) suggests coexisting iron deficiency when inflamed",
      "transferrin saturation low (8%; deficient <16%)",
      "transferrin saturation is the discriminator here",
      "combined iron-deficiency anemia + anemia of chronic disease",
      "treat: give iron AND treat the Crohn's"
    ],
    "explanation": "Inflammation raises ferritin, so a 'normal' ferritin of 65 does NOT exclude iron deficiency in an inflamed patient — the diagnostic cutoff rises to <100 ng/mL (vs <30 in a non-inflamed patient) to suggest coexisting iron deficiency. The very low transferrin saturation (8%, deficient <16%) plus microcytosis (MCV 80) indicates true iron deficiency superimposed on inflammation. Bottom line: combined iron-deficiency anemia AND anemia of chronic disease — replace iron and treat the underlying Crohn's."
  },
  {
    "skill": "Iron studies",
    "stem": "A 45-year-old man with fatigue, arthralgias, and elevated transaminases. Hb 14.5 g/dL · MCV 90 fL · ferritin 1300 ng/mL · serum iron high (~163 µg/dL) · TIBC 240 µg/dL · transferrin saturation 68%. Interpret the iron studies and name the screening concern.",
    "answer": [
      "transferrin saturation high (68%; >45% abnormal)",
      "ferritin markedly high (1300; >1000)",
      "TIBC low/normal (240)",
      "iron overload — not anemia of inflammation",
      "screen for hereditary hemochromatosis with HFE genotyping (C282Y/H63D)",
      "ferritin >1000 + transaminitis suggests hepatic iron loading/fibrosis"
    ],
    "explanation": "A HIGH transferrin saturation (68%; fasting TSAT >45% is abnormal) with a markedly elevated ferritin (1300) and low/normal TIBC indicates iron OVERLOAD, not anemia of inflammation — TSAT is the most sensitive early screen for hemochromatosis (>45% identifies ~98-100% of C282Y homozygotes). Fasting TSAT >45% warrants HFE genotyping (C282Y/H63D), and ferritin >1000 with transaminitis raises concern for hepatic iron loading and fibrosis. Bottom line: iron overload — screen for hereditary hemochromatosis."
  },
  {
    "skill": "LFTs",
    "stem": "55-year-old with jaundice. ALT 95 (ULN 40) · AST 80 (ULN 40) · ALP 600 (ULN 120) · total bilirubin 6.0 (direct 4.4) · GGT elevated. Compute the R factor and classify the injury pattern.",
    "answer": [
      "R factor = 0.48",
      "R < 2",
      "cholestatic pattern",
      "direct (conjugated) hyperbilirubinemia",
      "biliary obstruction / cholestasis (e.g., stone, stricture, PBC, drug)"
    ],
    "explanation": "R = (ALT/ULN) / (ALP/ULN) = (95/40) / (600/120) = 2.375 / 5.0 = 0.48. R < 2 defines a cholestatic pattern (R > 5 hepatocellular; 2-5 mixed). The disproportionate ALP with a high GGT confirms a hepatobiliary (not bony) source, and the predominantly direct hyperbilirubinemia (4.4 of 6.0) points to biliary obstruction or intrahepatic cholestasis (choledocholithiasis, stricture/malignancy, PBC, or drug-induced) — image the biliary tree with RUQ ultrasound."
  },
  {
    "skill": "LFTs",
    "stem": "30-year-old after a large acetaminophen ingestion, now confused. AST 6800 · ALT 6200 · ALP 130 (ULN 120) · total bilirubin 3.0 · INR 2.4. Classify the pattern and name the leading mechanisms.",
    "answer": [
      "R factor ~143 (markedly >5)",
      "hepatocellular pattern",
      "transaminases >1000 (massive)",
      "acetaminophen / ischemic hepatitis / acute viral",
      "acute liver failure (rising INR + encephalopathy)"
    ],
    "explanation": "R = (6200/40) / (130/120) = 155 / 1.08 ≈ 143 — far above 5, so a hepatocellular pattern (ALP barely moves). Transaminases in the thousands (often >5000) narrow the cause to the three big hepatocyte-necrosis insults: acetaminophen toxicity, ischemic/shock hepatitis, or acute viral hepatitis. The INR 2.4 plus encephalopathy in a non-cirrhotic = acute liver failure — start N-acetylcysteine and contact a transplant center; use the King's College criteria for prognosis."
  },
  {
    "skill": "LFTs",
    "stem": "48-year-old man with months of heavy alcohol use. AST 220 · ALT 85 · ALP 140 (ULN 120) · total bilirubin 4.5 · GGT high · MCV 104. Interpret the transaminase pattern and give the likely diagnosis.",
    "answer": [
      "AST:ALT = 2.6",
      "ratio >2",
      "alcoholic hepatitis / alcohol-related liver disease",
      "transaminases usually <300-500",
      "supporting clues: high GGT, macrocytosis (MCV 104)"
    ],
    "explanation": "AST:ALT = 220/85 = 2.6 (>2:1), the classic ratio of alcoholic liver disease (pyridoxine/B6 deficiency limits ALT synthesis). Aminotransferases in alcoholic hepatitis are characteristically modest — usually <300-500 and rarely >500 — so values in the thousands should redirect you to APAP/ischemic/viral. The elevated GGT and macrocytosis (MCV 104) corroborate alcohol; calculate a Maddrey discriminant function/MELD to gauge severity and steroid candidacy."
  },
  {
    "skill": "LFTs",
    "stem": "22-year-old well student noted to have total bilirubin 3.2 with direct (conjugated) bilirubin 0.3. AST/ALT/ALP all normal; CBC, reticulocytes, LDH, and haptoglobin normal. Interpret.",
    "answer": [
      "indirect (unconjugated) hyperbilirubinemia",
      "direct fraction <15-20% of total (~9%)",
      "no hemolysis (normal retic/LDH/haptoglobin)",
      "Gilbert syndrome",
      "benign / no treatment"
    ],
    "explanation": "Direct fraction = 0.3/3.2 ≈ 9% (<15-20%) → unconjugated (indirect) hyperbilirubinemia. With normal enzymes and no hemolysis (normal reticulocytes, LDH, and haptoglobin), the cause is impaired conjugation — Gilbert syndrome (reduced UGT1A1 activity, worsened by fasting/illness/stress). It is benign and needs no treatment; contrast with direct-predominant hyperbilirubinemia, which signals hepatocellular or cholestatic disease."
  },
  {
    "skill": "Hyponatremia",
    "stem": "A 78-year-old woman on chronic hydrochlorothiazide presents with malaise. Na 118 · serum osmolality 248 mOsm/kg · glucose 95 · BUN 8. On exam she has dry mucous membranes, flat neck veins, and orthostatic hypotension. Urine Na 9 mEq/L · urine osm 540 mOsm/kg. Classify the hyponatremia and give the mechanism.",
    "answer": [
      "hypotonic (true) hyponatremia",
      "serum osm < 275 (here 248)",
      "hypovolemic",
      "urine Na < 20 (renal Na avidity / extrarenal loss)",
      "concentrated urine osm (volume-driven ADH)",
      "volume depletion -> ADH release",
      "treat with isotonic (0.9%) saline"
    ],
    "explanation": "Serum osm 248 (< 275) confirms true hypotonic hyponatremia, not pseudo- or hypertonic. The exam is hypovolemic (dry membranes, flat necks, orthostatic). Urine Na 9 (< 20) means the kidney is appropriately sodium-avid and urine osm 540 means ADH is on - both driven by volume depletion, not SIADH. Bottom line: hypovolemic hypotonic hyponatremia; correct the volume deficit with isotonic (0.9%) saline."
  },
  {
    "skill": "Hyponatremia",
    "stem": "A 64-year-old man with small-cell lung cancer is admitted with confusion. Na 119 · serum osm 250 mOsm/kg · glucose 100 · BUN 6 · uric acid 2.1 mg/dL. He is clinically euvolemic (moist membranes, no edema, normal JVP, normal BP). Urine Na 62 mEq/L · urine osm 480 mOsm/kg · TSH and AM cortisol normal. Give the diagnosis and the supporting criteria.",
    "answer": [
      "SIADH",
      "euvolemic hypotonic hyponatremia (serum osm < 275)",
      "urine osm > 100 (inappropriately concentrated; here 480)",
      "urine Na > 30-40 (here 62)",
      "low uric acid < 4 (here 2.1)",
      "normal thyroid and adrenal function (exclusion)",
      "treat with fluid restriction"
    ],
    "explanation": "Serum osm 250 (< 275) = true hypotonic hyponatremia with a euvolemic exam. SIADH criteria are met: urine osm 480 (> 100, inappropriately concentrated for a dilute serum), urine Na 62 (> 30-40), euvolemia, and exclusion of hypothyroidism and adrenal insufficiency; the low uric acid (2.1, < 4) further supports it. With underlying small-cell lung cancer this is classic paraneoplastic SIADH - treat with fluid restriction (and the tumor)."
  },
  {
    "skill": "Hyponatremia",
    "stem": "A 55-year-old man with poorly controlled diabetes presents with polyuria. Na 128 mEq/L · glucose 700 mg/dL. Is this true hyponatremia? Compute the corrected sodium and interpret.",
    "answer": [
      "translocational hyponatremia, not true hypotonic",
      "correction +1.6 (or 2.4 if glucose > 400) per 100 mg/dL glucose above 100",
      "corrected Na = 138 (1.6 factor) or 142 (2.4 factor)",
      "corrected Na is normal",
      "hyperglycemia is osmotically active -> water shifts into vascular space, lowering measured Na",
      "treat the hyperglycemia, not the sodium"
    ],
    "explanation": "Glucose is osmotically active, so corrected Na = measured Na + 1.6 x [(glucose - 100)/100] = 128 + 1.6 x 6 = 137.6 (~138); the 2.4 factor recommended for glucose > 400 gives 128 + 2.4 x 6 = 142.4 (~142) - either way normal. This is translocational hyponatremia: serum is hypertonic and water has shifted into the vascular space, so it is not a true free-water excess. Bottom line: the corrected Na is normal, so treat the hyperglycemia and do NOT give hypertonic saline."
  },
  {
    "skill": "Hyponatremia",
    "stem": "A 71-year-old man with cirrhosis and tense ascites had Na 112 mEq/L found on routine labs four days ago; he was asymptomatic. The covering team gave 3% saline plus 0.9% saline and his Na is now 124 mEq/L (a 12 mEq/L rise in 24 hours). What is the concern, the safe correction limit, and the next step?",
    "answer": [
      "overcorrection (rate too fast)",
      "osmotic demyelination syndrome (ODS / central pontine myelinolysis)",
      "general limit <= 8-10 mEq/L per 24 h",
      "high-risk limit <= 6 mEq/L per 24 h (cirrhosis, alcoholism, malnutrition, hypokalemia, Na < 105)",
      "12 mEq/L rise exceeds the cap",
      "re-lower Na with free water (D5W) +/- desmopressin (DDAVP)"
    ],
    "explanation": "Chronic hyponatremia should be corrected no faster than about 8-10 mEq/L per 24 h, and <= 6 mEq/L per 24 h in high-risk patients (cirrhosis, alcoholism, malnutrition, hypokalemia, Na < 105); this patient rose 12 mEq/L, exceeding the cap. Overly rapid correction risks osmotic demyelination syndrome (central pontine myelinolysis), to which this malnourished cirrhotic is especially vulnerable. Bottom line: stop the saline and re-lower the sodium with free water (D5W) and/or desmopressin to bring the 24-h net rise back under the limit."
  },
  {
    "skill": "Synovial fluid",
    "stem": "A 58-year-old man presents with an acutely hot, swollen, exquisitely tender first MTP joint. Arthrocentesis: WBC 18,000/mm³, 80% PMNs; Gram stain negative; polarized microscopy shows needle-shaped crystals that appear yellow when aligned parallel to the slow axis of the red compensator. Interpret the fluid and give the diagnosis.",
    "answer": [
      "inflammatory fluid",
      "WBC 18,000 = inflammatory range (2,000–50,000)",
      "needles, yellow when parallel = negatively birefringent",
      "monosodium urate (MSU) crystals",
      "gout",
      "not septic (WBC <50,000, Gram stain negative)"
    ],
    "explanation": "WBC 18,000/mm³ with PMN predominance falls in the inflammatory range (roughly 2,000–50,000), below the typical septic threshold of >50,000. Needle-shaped crystals that are yellow when parallel to the slow axis of the compensator are negatively birefringent = monosodium urate → gout. A negative Gram stain plus WBC <50,000 argues against septic arthritis, but crystals and infection can coexist, so cultures should still be sent."
  },
  {
    "skill": "Synovial fluid",
    "stem": "A 72-year-old woman with osteoarthritis has an acutely swollen, warm knee. Synovial fluid: WBC 30,000/mm³, 70% PMNs; Gram stain negative; polarized microscopy shows rhomboid crystals that appear blue when aligned parallel to the slow axis of the red compensator. Interpret the fluid and give the diagnosis.",
    "answer": [
      "inflammatory fluid",
      "WBC 30,000 = inflammatory range (2,000–50,000)",
      "rhomboids, blue when parallel = positively birefringent",
      "calcium pyrophosphate dihydrate (CPPD)",
      "pseudogout",
      "not septic (WBC <50,000)"
    ],
    "explanation": "WBC 30,000/mm³ with PMN predominance is in the inflammatory range (2,000–50,000), below the septic threshold (>50,000). Rhomboid crystals that are blue when parallel to the slow axis of the compensator are positively birefringent = calcium pyrophosphate dihydrate → pseudogout. Send cultures regardless since infection can coexist, but the picture is crystal-induced rather than septic."
  },
  {
    "skill": "Synovial fluid",
    "stem": "A 65-year-old man with diabetes has 3 days of a hot, swollen, immobile knee and fever to 38.9°C. Arthrocentesis yields cloudy fluid: WBC 80,000/mm³, 92% PMNs; no crystals seen; Gram stain shows gram-positive cocci in clusters. Interpret the fluid and state the diagnosis and immediate action.",
    "answer": [
      "septic arthritis",
      "WBC 80,000 = septic range (>50,000, often >100,000)",
      "PMN-predominant (>90%)",
      "gram-positive cocci in clusters = Staphylococcus aureus",
      "urgent joint drainage/washout",
      "empiric IV vancomycin (MRSA coverage)"
    ],
    "explanation": "WBC 80,000/mm³ with 92% PMNs exceeds the septic threshold of >50,000 (frequently >100,000, PMN-predominant) → bacterial septic arthritis. Gram-positive cocci in clusters indicate Staphylococcus aureus, the most common organism. This is a joint emergency: start empiric IV vancomycin for MRSA coverage and arrange urgent surgical or arthroscopic drainage/washout while cultures finalize."
  },
  {
    "skill": "Synovial fluid",
    "stem": "A 40-year-old man with knee osteoarthritis has a mildly swollen, achy knee after a long hike, with no warmth or fever. Synovial fluid is clear and viscous: WBC 800/mm³, 15% PMNs; no crystals; Gram stain and culture negative. Interpret the fluid and classify the effusion.",
    "answer": [
      "non-inflammatory fluid",
      "WBC 800 = non-inflammatory (<2,000)",
      "PMN <25%",
      "osteoarthritis / mechanical-degenerative",
      "not septic",
      "no crystals"
    ],
    "explanation": "WBC 800/mm³ (<2,000) with PMNs <25% in clear, viscous fluid defines a non-inflammatory effusion. With negative crystals, Gram stain, and culture, this is mechanical/degenerative joint disease such as osteoarthritis. No antibiotics or crystal-directed anti-inflammatory therapy are indicated; manage the underlying OA."
  },
  {
    "skill": "TFTs",
    "stem": "55-year-old woman, fatigue and weight gain. TSH 18 mIU/L (ref 0.4-4.0) and free T4 0.5 ng/dL (ref 0.8-1.8). Interpret the pattern, name the likely cause, the confirmatory test, and initial management.",
    "answer": [
      "overt primary hypothyroidism",
      "TSH high (18, above 4.0)",
      "free T4 low (0.5, below 0.8)",
      "Hashimoto's / chronic autoimmune thyroiditis",
      "confirm with anti-TPO antibodies",
      "levothyroxine, recheck TSH in ~6 weeks"
    ],
    "explanation": "High TSH (18 vs upper limit 4.0) with a LOW free T4 (0.5 vs lower limit 0.8) = overt primary hypothyroidism: the gland fails, so the pituitary drives TSH up. The most common US cause is Hashimoto's (chronic autoimmune) thyroiditis, confirmed by positive anti-TPO antibodies. Treat with weight-based levothyroxine (~1.6 mcg/kg/day) and recheck TSH in ~6 weeks to titrate."
  },
  {
    "skill": "TFTs",
    "stem": "32-year-old woman with palpitations, tremor, 10-lb weight loss, and a diffuse goiter with an audible bruit. TSH < 0.01 mIU/L (ref 0.4-4.0), free T4 3.6 ng/dL (ref 0.8-1.8), free T3 also elevated. Interpret the pattern, name the likely diagnosis, and the confirmatory test.",
    "answer": [
      "overt primary hyperthyroidism / thyrotoxicosis",
      "TSH suppressed (<0.01, below 0.4)",
      "free T4 high (3.6, above 1.8)",
      "Graves disease",
      "confirm with TRAb/TSI antibodies (or RAIU showing diffuse increased uptake)"
    ],
    "explanation": "A suppressed TSH (<0.01 vs lower limit 0.4) with a HIGH free T4 (3.6 vs upper limit 1.8) and high T3 = overt primary hyperthyroidism/thyrotoxicosis. A young woman with a diffuse goiter, bruit, and orbitopathy is Graves disease; confirm with TRAb/TSI antibodies or a radioactive-iodine-uptake scan showing diffuse increased uptake (vs the low uptake of thyroiditis). Early Graves can be T3-predominant, so low TSH with high T3 but normal free T4 (T3-toxicosis) does not exclude it."
  },
  {
    "skill": "TFTs",
    "stem": "68-year-old man, asymptomatic, screened before starting a medication. TSH 8.5 mIU/L (ref 0.4-4.0) and free T4 1.2 ng/dL (ref 0.8-1.8). Interpret the pattern and state the TSH threshold that guides treatment.",
    "answer": [
      "subclinical hypothyroidism",
      "TSH mildly elevated (8.5, above 4.0 but below 10)",
      "free T4 normal (1.2, within 0.8-1.8)",
      "repeat TSH in 6-8 weeks to confirm persistence",
      "treat if TSH >= 10 (or symptoms, positive TPO antibodies, or pregnancy)"
    ],
    "explanation": "An elevated TSH (8.5) with a NORMAL free T4 (1.2, within range) = subclinical hypothyroidism. First repeat the TSH in 6-8 weeks, since transient elevations are common. Treatment is generally reserved for TSH >= 10 mIU/L, or for lower values (4-10) accompanied by symptoms, positive anti-TPO antibodies, or pregnancy."
  },
  {
    "skill": "TFTs",
    "stem": "40-year-old woman with amenorrhea, headaches, and visual-field loss after a postpartum hemorrhage. TSH 0.9 mIU/L (ref 0.4-4.0) and free T4 0.4 ng/dL (ref 0.8-1.8). Interpret the pattern and state the next steps before giving thyroid hormone.",
    "answer": [
      "central (secondary) hypothyroidism",
      "free T4 low (0.4, below 0.8) with inappropriately normal/low TSH (0.9)",
      "suspect hypopituitarism / Sheehan syndrome",
      "pituitary MRI and assess other axes",
      "check/replace cortisol BEFORE levothyroxine (avoid adrenal crisis)",
      "monitor therapy by free T4, not TSH"
    ],
    "explanation": "A LOW free T4 (0.4 vs lower limit 0.8) with an inappropriately normal/low TSH (0.9) = central (secondary) hypothyroidism: the failing pituitary should have raised TSH but did not, so TSH cannot be used to interpret or monitor. The postpartum-hemorrhage history suggests Sheehan/pituitary failure, so obtain a pituitary MRI and screen the other axes. Critically, check and replace cortisol FIRST, because starting levothyroxine in undiagnosed adrenal insufficiency can precipitate adrenal crisis; then monitor with free T4, not TSH."
  },
  {
    "skill": "Urinalysis",
    "stem": "A 28-year-old with hemoptysis and 2 weeks of dark, tea-colored urine. UA: protein 2+, blood 3+; microscopy shows dysmorphic RBCs and red-cell casts. Creatinine 2.8 (was 0.9). Interpret the sediment and localize the lesion.",
    "answer": [
      "RBC casts",
      "dysmorphic RBCs",
      "glomerular bleeding",
      "glomerulonephritis",
      "nephritic syndrome",
      "pulmonary-renal syndrome workup (ANCA, anti-GBM)"
    ],
    "explanation": "Red-cell casts plus dysmorphic RBCs are pathognomonic for GLOMERULAR bleeding (casts form only in the tubule, so the hematuria originates in the glomerulus, not the lower tract). With proteinuria and a creatinine rising from 0.9 to 2.8 this is an active nephritic sediment = glomerulonephritis, here a rapidly progressive course. Hemoptysis plus a nephritic picture = pulmonary-renal syndrome: send ANCA, anti-GBM, ANA/complements and arrange an urgent renal biopsy."
  },
  {
    "skill": "Urinalysis",
    "stem": "A 70-year-old 4 days post cardiac surgery (intraoperative hypotension, contrast, gentamicin) is now oliguric. Creatinine 1.0 rising to 3.6. UA: SG 1.010, no protein, no blood; microscopy shows muddy-brown granular casts and renal tubular epithelial cells. Labs: urine Na 60, urine Cr 35, serum Na 140, serum Cr 3.6. Compute the FENa and give the diagnosis.",
    "answer": [
      "muddy-brown granular casts",
      "FENa",
      "FENa = 4.4%",
      "FENa > 2%",
      "acute tubular necrosis",
      "ATN",
      "intrinsic AKI"
    ],
    "explanation": "Muddy-brown (pigmented) granular casts and renal tubular epithelial cells are the classic sediment of acute tubular necrosis. FENa = (UNa x SCr)/(SNa x UCr) x 100 = (60 x 3.6)/(140 x 35) x 100 = 216/4900 x 100 = 4.4%, which is >2% and, together with the isosthenuric SG ~1.010, confirms intrinsic AKI/ATN (injured tubules cannot reabsorb sodium) rather than a prerenal state (where FENa would be <1%). Ischemia plus nephrotoxins (contrast, aminoglycoside) is the typical setup; management is supportive."
  },
  {
    "skill": "Urinalysis",
    "stem": "An 82-year-old nursing-home woman with confusion and dysuria. UA dipstick: leukocyte esterase positive, nitrite positive, blood trace, protein negative; microscopy 50 WBC/hpf, many bacteria, few squamous epithelial cells. Interpret and name the most likely organism class.",
    "answer": [
      "positive leukocyte esterase",
      "positive nitrite",
      "pyuria",
      "bacteriuria",
      "urinary tract infection",
      "nitrate-reducing Enterobacteriaceae / gram-negative rods (E. coli)"
    ],
    "explanation": "Positive leukocyte esterase signals pyuria (50 WBC/hpf) and positive nitrite reflects bacteria reducing dietary nitrate to nitrite; with bacteriuria and few squames (a clean, uncontaminated specimen) this is a urinary tract infection. Nitrite positivity specifically implicates nitrate-reducing Enterobacteriaceae, gram-negative rods such as E. coli. Note that Enterococcus, Staphylococcus saprophyticus, and Pseudomonas are typically nitrite-negative, so a negative nitrite does NOT exclude UTI. Send a urine culture and treat, given the new delirium."
  },
  {
    "skill": "Urinalysis",
    "stem": "A 55-year-old started a beta-lactam and an NSAID 10 days ago, now with fever, a maculopapular rash, and creatinine rising from 0.9 to 2.4. UA: protein 1+, leukocyte esterase positive; microscopy shows WBCs and white-cell casts, urine culture negative; eosinophils seen on Hansel stain. Interpret the sediment and give the diagnosis.",
    "answer": [
      "WBC casts",
      "sterile pyuria (negative culture)",
      "eosinophiluria",
      "acute interstitial nephritis",
      "AIN",
      "drug-induced (beta-lactam/NSAID)",
      "stop offending drug"
    ],
    "explanation": "White-cell casts localize the inflammation to the kidney; with a NEGATIVE culture this is sterile pyuria (not a UTI), and the WBC casts plus eosinophiluria in the setting of fever, rash, and recent drug exposure point to acute interstitial nephritis (the classic fever-rash-eosinophilia triad). Common culprits are beta-lactams, NSAIDs, PPIs, and sulfonamides. Management is to stop the offending drug and consider corticosteroids if the creatinine does not improve. (WBC casts can also occur in pyelonephritis, which the negative culture and drug history argue against.)"
  },
  {
    "skill": "Coags",
    "stem": "PT 12 s (normal) · INR 1.0 · aPTT 68 s (normal 25–35). Patient is asymptomatic, found incidentally pre-op. A 1:1 mix with normal plasma gives aPTT 64 s (fails to correct). Interpret the pattern and name the most likely cause.",
    "answer": [
      "isolated prolonged aPTT",
      "normal PT/INR",
      "intrinsic pathway defect",
      "mixing study fails to correct (64 s)",
      "inhibitor present",
      "lupus anticoagulant",
      "asymptomatic/non-bleeding"
    ],
    "explanation": "An isolated aPTT prolongation (68 s) with a normal PT/INR localizes to the intrinsic pathway (factors VIII, IX, XI, XII, or an inhibitor). A 1:1 mix supplies ~50% of every factor, so a true factor deficiency would correct into the normal range (~≤35 s); failure to correct (64 s) means an inhibitor, not a deficiency, is present. In an asymptomatic, non-bleeding patient the classic culprit is a lupus anticoagulant (an in-vitro phospholipid antibody that is paradoxically thrombotic in vivo) rather than an acquired factor inhibitor (which bleeds) — confirm with a dilute Russell viper venom time (dRVVT) and anticardiolipin/anti-β2-glycoprotein-I antibodies."
  },
  {
    "skill": "Coags",
    "stem": "PT 28 s · INR 2.6 · aPTT 62 s (both prolonged) · platelets 38,000 · fibrinogen 90 mg/dL (normal 200–400) · D-dimer markedly elevated. Patient is septic and oozing from line sites. Interpret.",
    "answer": [
      "both PT and PTT prolonged",
      "thrombocytopenia (platelets 38k)",
      "low fibrinogen (90, below 200–400)",
      "markedly elevated D-dimer",
      "consumptive coagulopathy",
      "DIC"
    ],
    "explanation": "Prolongation of BOTH the PT (28 s) and aPTT (62 s) points to the common pathway, a global factor deficiency, or consumption. The combination of falling platelets (38k), consumed fibrinogen (90 mg/dL, below the 200–400 normal), and a markedly elevated D-dimer from fibrin breakdown in a septic patient is diagnostic of disseminated intravascular coagulation (DIC), a consumptive coagulopathy. Liver failure and vitamin K deficiency also prolong both times, but neither consumes fibrinogen nor drives D-dimer the way DIC does; treat the underlying trigger (sepsis) and, if bleeding, replace with FFP, cryoprecipitate (for fibrinogen), and platelets."
  },
  {
    "skill": "Coags",
    "stem": "PT 26 s · INR 2.8 · aPTT 33 s (normal 25–35). Patient started warfarin 3 days ago for new atrial fibrillation. Interpret the pattern and explain why only one value is abnormal.",
    "answer": [
      "isolated prolonged PT",
      "elevated INR 2.8",
      "normal aPTT",
      "extrinsic pathway / factor VII",
      "shortest half-life (~4–6 h)",
      "expected early warfarin effect"
    ],
    "explanation": "An isolated PT/INR prolongation (INR 2.8) with a normal aPTT reflects the extrinsic pathway, whose only unique factor is VII. Factor VII has the shortest half-life (~4–6 h) of the vitamin-K-dependent factors (II, VII, IX, X), so early warfarin depletes it first and raises the PT before the aPTT moves. This is the expected day-3 warfarin pattern; bridge with a parenteral anticoagulant (e.g., heparin) until the INR is therapeutic (2.0–3.0 for AF) for ≥24 h, because protein C (half-life ~8 h) also falls early and creates transient hypercoagulability."
  },
  {
    "skill": "Coags",
    "stem": "PT 13 s (normal) · INR 1.0 · aPTT 70 s (normal 25–35). A boy with hemarthrosis and a family history of bleeding in maternal uncles. A 1:1 mix with normal plasma corrects the aPTT to 32 s. Interpret and name the most likely diagnosis.",
    "answer": [
      "isolated prolonged aPTT",
      "normal PT/INR",
      "intrinsic pathway defect",
      "mixing study corrects (32 s)",
      "factor deficiency (not inhibitor)",
      "X-linked inheritance",
      "hemophilia A (FVIII) or B (FIX)"
    ],
    "explanation": "An isolated aPTT prolongation (70 s) with a normal PT again localizes to the intrinsic pathway. The 1:1 mix CORRECTS into the normal range (32 s, within 25–35), indicating a factor deficiency rather than an inhibitor. With hemarthrosis and an X-linked recessive pedigree (affected maternal uncles), this is hemophilia — factor VIII deficiency (hemophilia A) or factor IX deficiency (hemophilia B); confirm and distinguish with specific factor VIII and factor IX activity assays."
  },
];

/** Skills shown in the combined "Skills" drill dropdown. The other interpretation
 *  banks (CSF, iron, LFTs, …) are surfaced as their own tabs — see LAB_TABS in
 *  drillProgress.ts — so they're not listed here. */
export const SKILL_DRILL_TYPES = ["ABG", "Ascitic (SAAG)", "Pleural (Light's)", "PFT"] as const;
