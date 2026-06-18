/**
 * Tier-3 "Scores & calculators" drill bank — clinical decision scores and quick
 * bedside calculations. Same shape as the Skills drills: a vignette with the
 * data to compute the score, the concepts a good answer covers (value, risk
 * band, next step), and a worked solution. Authored + clinically verified.
 */
export interface ScoreDrillProblem {
  id: string;
  name: string;
  category: string;
  vignette: string;
  answer: string[];
  explanation: string;
}

export const SCORE_DRILLS: ScoreDrillProblem[] = [
  {
    "id": "wells-pe",
    "name": "Wells score for PE",
    "category": "Chest Pain",
    "vignette": "A 58-year-old woman presents with pleuritic chest pain and acute dyspnea that started this morning. She had a right total knee replacement 3 weeks ago and has been largely housebound since. On exam HR is 112, and her right calf is swollen and tender along the deep venous distribution. There is no hemoptysis and no history of prior DVT or PE; she has no known active cancer. After reviewing the presentation, you judge PE to be the most likely diagnosis. Compute the Wells score for PE, give the risk category (both tiers), and state the next step.",
    "answer": [
      "Wells PE score = 9",
      "high probability (three-tier, >6)",
      "PE likely (two-tier, >4)",
      "proceed directly to CT pulmonary angiography (D-dimer NOT appropriate)"
    ],
    "explanation": "Wells PE: clinical signs/symptoms of DVT (leg swelling + deep-vein tenderness) 3 + PE is the most likely diagnosis 3 + HR >100 (112) 1.5 + surgery within the previous 4 weeks (knee replacement 3 weeks ago; this criterion also covers immobilization >=3 days) 1.5 = 9. She has no hemoptysis (0), no malignancy (0), and no prior DVT/PE (0), so the total is 9. That is >6 -> high pretest probability (three-tier) and >4 -> 'PE likely' (two-tier). With a likely/high-probability score, skip the D-dimer and proceed directly to CT pulmonary angiography."
  },
  {
    "id": "perc",
    "name": "PERC rule",
    "category": "Chest Pain",
    "vignette": "A 38-year-old man presents to the ED with sharp chest pain and mild dyspnea after a stressful week. He is otherwise healthy and takes no medications. Vitals: HR 88, BP 124/76, RR 16, SpO2 98% on room air, temperature 37.0 C. He has no leg swelling, no hemoptysis, no surgery or trauma in the last month, and no prior DVT or PE. He does not use exogenous estrogen. Your gestalt pretest probability for PE is low (<15%). Apply the PERC rule and state whether PE can be excluded and what to do next.",
    "answer": [
      "PERC negative (0 of 8 criteria positive)",
      "all 8 criteria satisfied",
      "PE effectively excluded in this low-risk patient",
      "no D-dimer and no imaging needed"
    ],
    "explanation": "PERC has 8 criteria, all of which must be negative to be 'PERC-negative': age <50 (38 ✓), HR <100 (88 ✓), SpO2 >=95% (98% ✓), no unilateral leg swelling ✓, no hemoptysis ✓, no surgery/trauma requiring hospitalization within the prior 4 weeks ✓, no prior DVT/PE ✓, no exogenous estrogen use ✓. All 8 are met, so PERC is negative. PERC applies only when clinical gestalt is already low-risk (<15%); in that setting a negative PERC drives the post-test probability below ~2%, so PE is effectively excluded and no D-dimer or imaging is warranted."
  },
  {
    "id": "heart",
    "name": "HEART score",
    "category": "Chest Pain",
    "vignette": "A 56-year-old man with hypertension, type 2 diabetes, and a 30-pack-year smoking history presents with 2 hours of central chest pressure radiating to the left arm with diaphoresis. The story is moderately suspicious but not classic. ECG shows nonspecific repolarization changes without significant ST depression. Initial high-sensitivity troponin is within the normal reference range. Compute the HEART score, give the risk band, and state the disposition.",
    "answer": [
      "HEART score = 5",
      "moderate risk (4-6)",
      "admit / observe with serial troponins and noninvasive testing",
      "not safe for immediate discharge"
    ],
    "explanation": "HEART components: History moderately suspicious = 1; ECG nonspecific repolarization changes (no significant ST deviation) = 1; Age 56 (range 45-64) = 1; Risk factors >=3 (HTN, diabetes, smoking) = 2; initial Troponin within normal limits = 0. Total = 1 + 1 + 1 + 2 + 0 = 5. A score of 4-6 is moderate risk (~12-17% 6-week MACE), so the patient should be admitted/observed with serial troponins and noninvasive ischemia testing rather than discharged. Only 0-3 (low risk, ~1-2% MACE) supports early discharge; 7-10 is high risk warranting early invasive evaluation."
  },
  {
    "id": "wells-dvt",
    "name": "Wells score for DVT",
    "category": "Dyspnea",
    "vignette": "A 64-year-old woman presents with a 3-day history of a swollen, painful left leg. She completed surgery and is on ongoing chemotherapy for colon cancer diagnosed 2 months ago. Exam shows the entire left leg is swollen, with calf circumference 4 cm greater than the right, localized tenderness along the deep venous system, and pitting edema confined to the left leg. There is no alternative diagnosis as likely as DVT, and she has no documented prior DVT. Compute the Wells score for DVT, give the risk category, and state the next step.",
    "answer": [
      "Wells DVT score = 5",
      "DVT likely (two-tier, >=2)",
      "high probability (three-tier, >=3)",
      "proceed to compression ultrasound of the leg",
      "D-dimer alone cannot exclude DVT in a likely/high-probability patient"
    ],
    "explanation": "Wells DVT: active cancer (treatment within 6 months / ongoing) 1 + entire leg swollen 1 + calf swelling >3 cm vs the other leg (4 cm) 1 + localized tenderness along the deep venous system 1 + pitting edema confined to the symptomatic leg 1 = 5. She has no paralysis/immobilization, no recent bedrest >3 days or major surgery within 12 weeks, no collateral superficial veins, no previously documented DVT, and no equally-likely alternative diagnosis (which would subtract 2). Total = 5: on the two-tier rule >=2 -> 'DVT likely', and on the three-tier rule >=3 -> high probability. With a likely/high-probability score, obtain compression ultrasound; a D-dimer alone cannot safely rule out DVT here."
  },
  {
    "id": "chadsvasc",
    "name": "CHA₂DS₂-VASc score (AF stroke risk)",
    "category": "Syncope",
    "vignette": "A 78-year-old woman presents after a near-syncopal episode and is found to be in new atrial fibrillation at 96 bpm on the monitor. Her history includes hypertension on amlodipine, type 2 diabetes on metformin, and an ischemic stroke 3 years ago with mild residual right-sided weakness. She has no prior MI, peripheral arterial disease, or aortic plaque. Echo shows normal LV systolic function. She is not currently on any anticoagulation. Compute her stroke-risk score and state what antithrombotic therapy is recommended.",
    "answer": [
      "CHA₂DS₂-VASc = 7",
      "HTN +1, age ≥75 +2, diabetes +1, prior stroke +2, female +1",
      "high annual stroke risk",
      "oral anticoagulation recommended",
      "DOAC preferred over warfarin (nonvalvular AF)"
    ],
    "explanation": "CHA₂DS₂-VASc = CHF/LV dysfunction (0, normal LV) + Hypertension (+1) + Age ≥75 (+2) + Diabetes (+1) + prior Stroke/TIA/thromboembolism (+2) + Vascular disease (0) + Age 65–74 (0, not double-counted) + Sex female (+1) = 7. In women a score ≥3 (here 7) indicates high stroke risk for which long-term oral anticoagulation is recommended; a DOAC (apixaban, rivaroxaban, dabigatran, or edoxaban) is preferred over warfarin in nonvalvular AF."
  },
  {
    "id": "hasbled",
    "name": "HAS-BLED score (AF bleeding risk)",
    "category": "Syncope",
    "vignette": "A 72-year-old man with newly diagnosed atrial fibrillation is being considered for anticoagulation after a syncopal presentation. His clinic blood pressure is 168/94 mmHg despite three agents. He had a prior hemorrhagic stroke 2 years ago and a GI bleed from a duodenal ulcer last year. Creatinine is 1.3 mg/dL (eGFR 62); liver function tests are normal. He takes daily aspirin for prior 'heart protection' and drinks 3–4 beers most evenings. He is not yet on warfarin, so INR control history is not available. Compute his bleeding-risk score and state how it should guide management.",
    "answer": [
      "HAS-BLED = 5",
      "HTN (SBP>160) +1, stroke +1, bleeding +1, age>65 +1, antiplatelet +1, alcohol ≥8/wk +1",
      "high bleeding risk",
      "NOT a contraindication to anticoagulation",
      "correct modifiable factors (BP, stop aspirin, reduce alcohol) + close review"
    ],
    "explanation": "HAS-BLED = Hypertension (+1, SBP 168 >160) + Abnormal renal (0; threshold is Cr ≥200 µmol/L ≈ 2.26 mg/dL, his 1.3 is below) + abnormal liver (0, normal LFTs) + Stroke (+1) + Bleeding history (+1, prior GI bleed) + Labile INR (0, not on warfarin) + Elderly >65 (+1) + Drugs/antiplatelet (+1, daily aspirin) + Alcohol ≥8 units/wk (+1, ~21–28/wk) = 5. A score ≥3 flags high bleeding risk but is NOT itself a reason to withhold indicated anticoagulation; instead correct modifiable factors (treat BP to <160, stop the unnecessary aspirin, reduce alcohol) and arrange close follow-up with periodic re-assessment of bleeding risk."
  },
  {
    "id": "curb65",
    "name": "CURB-65 (pneumonia severity)",
    "category": "Fever",
    "vignette": "A 71-year-old man presents with 3 days of productive cough, fever, and dyspnea; CXR shows a right-lower-lobe consolidation. He is oriented to person but not place or date (new for him per his wife). Vitals: BP 104/72, HR 102, RR 24, SpO2 92% on room air, temp 38.6 C. Labs: BUN 32 mg/dL, Cr 1.3, WBC 14.5. Score his pneumonia severity and give the recommended site of care.",
    "answer": [
      "CURB-65 = 3",
      "Confusion present (+1)",
      "BUN >19 mg/dL / urea >7 mmol/L (+1)",
      "age >=65 (+1)",
      "RR <30 and BP not low (0 points each)",
      "severe / high-risk band",
      "admit; consider ICU-level care"
    ],
    "explanation": "CURB-65 gives 1 point each for Confusion, Urea (BUN >19 mg/dL or urea >7 mmol/L), RR >=30, SBP <90 or DBP <=60, and Age >=65 (range 0-5). Here: new Confusion (+1), BUN 32 >19 (+1), and age 71 >=65 (+1) = 3; RR 24 (<30) and BP 104/72 (not <90/60) each score 0. A score of >=3 is the severe/high-risk band (~22% 30-day mortality) -> hospitalize with consideration for ICU-level care, vs 0-1 (~1.5%, outpatient) and 2 (~9%, inpatient/observation)."
  },
  {
    "id": "centor",
    "name": "Centor / McIsaac (strep pharyngitis)",
    "category": "Fever",
    "vignette": "A 22-year-old woman presents with 2 days of sore throat. On exam she has tonsillar exudates and tender, enlarged anterior cervical lymph nodes, no cough, and a measured temperature of 38.3 C. She has no known sick contacts. Using the McIsaac-modified Centor score, give her score, her risk category, and the recommended next step.",
    "answer": [
      "Centor/McIsaac = 4",
      "tonsillar exudate or swelling (+1)",
      "tender anterior cervical nodes (+1)",
      "temp >38 C (+1)",
      "absence of cough (+1)",
      "age 15-44 (+0)",
      "high probability of GAS (~50%)",
      "rapid antigen test (RADT) +/- culture; treat if positive"
    ],
    "explanation": "McIsaac-modified Centor gives 1 point each for tonsillar exudate/swelling, tender/swollen anterior cervical nodes, temperature >38 C, and absence of cough, plus an age modifier (+1 for 3-14 yr, 0 for 15-44, -1 for >=45); range -1 to 5. Here all four clinical criteria are met (+4) and age 22 adds 0 -> total 4. A score of >=4 is the high-probability band (~51-53% GAS, ~57% in validated adult cohorts); the next step is a rapid antigen detection test (RADT) and treat with penicillin/amoxicillin if positive (per IDSA, a negative RADT in an adult need not be backed up by throat culture). Scores 0-1 need no testing/antibiotics; 2-3 -> test and treat only if positive."
  },
  {
    "id": "meld",
    "name": "MELD-Na (chronic liver disease)",
    "category": "Abnormal Liver Enzymes",
    "vignette": "A 58-year-old man with alcohol-related cirrhosis is being evaluated for transplant listing. Labs: total bilirubin 4.2 mg/dL, INR 1.9, serum creatinine 1.6 mg/dL (not on dialysis), serum sodium 128 mEq/L. He has no other acute illness. Name the score that drives his transplant priority, list the four lab components that feed it, and state what it predicts and how it is used.",
    "answer": [
      "MELD-Na",
      "components: bilirubin, INR, creatinine, sodium",
      "predicts 90-day mortality",
      "drives UNOS/OPTN transplant allocation priority",
      "all four components deranged (bili 4.2, INR 1.9, Cr 1.6, Na 128) plus hyponatremia raise the score",
      "high MELD-Na, high listing priority"
    ],
    "explanation": "MELD-Na is the MELD score (built from total bilirubin, INR, and creatinine, each raising the score as it rises, range 6-40) with a serum-sodium correction added for sodium 125-137; it predicts 90-day mortality and sets liver-transplant-list priority (UNOS/OPTN). All three core components are deranged here (bilirubin 4.2, INR 1.9, creatinine 1.6) and the Na of 128 is below normal, so the sodium correction pushes the result above plain MELD because hyponatremia independently raises predicted mortality. Bottom line: a deranged-component patient with Na 128 yields a high MELD-Na and high listing priority (credit comes from naming the four components and the interpretation, not hand-computing the log term)."
  },
  {
    "id": "childpugh",
    "name": "Child-Pugh score (cirrhosis)",
    "category": "Abnormal Liver Enzymes",
    "vignette": "A 62-year-old woman with cirrhosis is assessed before elective surgery. Total bilirubin 3.5 mg/dL, serum albumin 2.6 g/dL, INR 2.1. On exam she has moderate ascites and grade 1-2 hepatic encephalopathy. Compute her Child-Pugh score, give the class, and state the prognostic/operative implication.",
    "answer": [
      "Child-Pugh score 13",
      "Class C",
      "bilirubin 3.5 (>3) = 3 pts",
      "albumin 2.6 (<2.8) = 3 pts",
      "INR 2.1 (1.7-2.3) = 2 pts",
      "moderate ascites = 3 pts; encephalopathy grade 1-2 = 2 pts",
      "decompensated, poor prognosis / prohibitive operative mortality, defer elective surgery"
    ],
    "explanation": "Child-Pugh sums 5 components (1-3 points each): bilirubin 3.5 mg/dL (>3 = 3 pts), albumin 2.6 g/dL (<2.8 = 3 pts), INR 2.1 (1.7-2.3 = 2 pts), moderate ascites (3 pts), and grade 1-2 encephalopathy (2 pts) = 3+3+2+3+2 = 13. A score of 10-15 = Class C (A = 5-6, B = 7-9), indicating decompensated cirrhosis with poor prognosis (~35-45% 1-year survival) and prohibitively high perioperative mortality, so defer elective surgery and pursue transplant evaluation."
  },
  {
    "id": "ranson",
    "name": "Ranson criteria (non-gallstone pancreatitis severity)",
    "category": "Abdominal Pain",
    "vignette": "A 49-year-old man is admitted with acute alcoholic pancreatitis. On admission: age 49, WBC 18,000/uL, glucose 220 mg/dL, AST 280 U/L, LDH 400 U/L. Over the next 48 hours: hematocrit falls from 44% to 32%, BUN rises by 6 mg/dL, serum calcium 7.6 mg/dL, PaO2 58 mmHg, base deficit 5 mEq/L, and estimated fluid sequestration 5 L. Compute the Ranson score and state the severity/disposition.",
    "answer": [
      "Ranson score 9",
      "admission criteria met: WBC >16k, glucose >200, AST >250, LDH >350 (age >55 not met) = 4",
      "48-hour criteria met: Hct drop >10%, BUN rise >5, calcium <8, PaO2 <60, base deficit >4 (fluid sequestration >6L not met) = 5",
      "score >=3 = severe pancreatitis",
      "score >=7 predicts ~100% mortality",
      "ICU-level care / aggressive fluid resuscitation"
    ],
    "explanation": "Ranson uses 5 admission criteria and 6 more at 48 h (1 point each). Admission: age 49 (>55 not met, 0), WBC 18k (>16,000 yes), glucose 220 (>200 yes), AST 280 (>250 yes), LDH 400 (>350 yes) = 4. At 48 h: Hct fall 12% (>10% yes), BUN rise 6 (>5 yes), calcium 7.6 (<8 yes), PaO2 58 (<60 yes), base deficit 5 (>4 yes), fluid sequestration 5 L (>6 L not met, 0) = 5; total = 9. A score >=3 defines severe pancreatitis, and mortality rises with the count (0-2 ~2%, 3-4 ~15%, 5-6 ~40%, >=7 ~100%), so a 9 predicts near-100% mortality. Bottom line: ICU admission, aggressive fluid resuscitation, and monitoring for necrosis/organ failure."
  },
  {
    "id": "alvarado",
    "name": "Alvarado score (appendicitis)",
    "category": "Abdominal Pain",
    "vignette": "A 24-year-old woman has 1 day of periumbilical pain that has migrated to the right lower quadrant, with anorexia and two episodes of nausea/vomiting. Exam: RLQ tenderness with rebound, temperature 38.1C. Labs: WBC 13,500/uL with 78% neutrophils. Compute her Alvarado score and state the risk band and recommended next step.",
    "answer": [
      "Alvarado score 9",
      "migration 1 + anorexia 1 + nausea/vomiting 1 + RLQ tenderness 2 + rebound 1 + temp >=37.3 1 + leukocytosis >10k 2 + left shift >=75% 1",
      "high probability of appendicitis (score 7-10)",
      "surgical consultation / appendectomy",
      "imaging reserved for equivocal scores (5-6)"
    ],
    "explanation": "Alvarado (MANTRELS, max 10): Migration of pain (1), Anorexia (1), Nausea/vomiting (1), Tenderness RLQ (2), Rebound (1), Elevated temp >=37.3C (1), Leukocytosis >10,000 (2), Shift/neutrophilia >=75% (1) = 1+1+1+2+1+1+2+1 = 9. Bands: 1-4 low probability, 5-6 equivocal (observe/image), 7-10 high probability. A 9 indicates high probability of appendicitis, so the bottom line is surgical consultation for likely appendectomy; cross-sectional imaging is reserved for equivocal scores or atypical presentations."
  },
  {
    "id": "fena",
    "name": "FeNa (fractional excretion of sodium)",
    "category": "Altered Mental Status",
    "vignette": "An 80-year-old man with confusion and oliguria. Cr has risen from 1.0 to 3.2 mg/dL over 3 days; he takes furosemide 40 mg daily for heart failure. Urine Na 18 mEq/L, urine Cr 45 mg/dL, serum Na 138 mEq/L. Because he is on a loop diuretic you also send urea indices: urine urea 220 mg/dL, BUN 60 mg/dL. Compute the fractional excretion(s) and classify the AKI.",
    "answer": [
      "FeNa = 0.93% (<1%)",
      "FeUrea = 26% (<35%)",
      "prerenal azotemia",
      "loop diuretic invalidates FeNa, so use FeUrea",
      "next step: assess volume/perfusion and trial a fluid challenge"
    ],
    "explanation": "FeNa = (UNa x PCr)/(PNa x UCr) x 100 = (18 x 3.2)/(138 x 45) x 100 = 57.6/6210 x 100 = 0.93%, and <1% suggests prerenal (vs ATN/intrinsic typically >2%). But loop diuretics force natriuresis and can falsely raise FeNa, so on a diuretic compute FeUrea = (Uurea x PCr)/(BUN x UCr) x 100 = (220 x 3.2)/(60 x 45) x 100 = 704/2700 x 100 = 26%, and <35% confirms prerenal physiology. Bottom line: prerenal AKI from poor renal perfusion; assess volume/cardiac output and trial a fluid challenge or optimize forward flow rather than reflexively treating as ATN."
  },
  {
    "id": "corrected-ca",
    "name": "Corrected calcium for albumin",
    "category": "Altered Mental Status",
    "vignette": "A 64-year-old woman with malignancy and lethargy. The lab reports a total calcium of 7.6 mg/dL, flagged low, prompting a call about 'hypocalcemia.' Her serum albumin is 2.0 g/dL. Compute the albumin-corrected calcium and state whether she is truly hypocalcemic.",
    "answer": [
      "corrected Ca = 9.2 mg/dL",
      "normal (not truly hypocalcemic)",
      "pseudohypocalcemia from hypoalbuminemia",
      "next step: no calcium repletion; check ionized calcium if uncertain"
    ],
    "explanation": "Corrected Ca = measured Ca + 0.8 x (4.0 - albumin) = 7.6 + 0.8 x (4.0 - 2.0) = 7.6 + 1.6 = 9.2 mg/dL, which is within the normal range (8.5-10.5). Each 1 g/dL fall in albumin lowers total calcium ~0.8 mg/dL while the physiologically active ionized calcium is unchanged. Bottom line: this is pseudohypocalcemia from hypoalbuminemia, not true hypocalcemia, so do not give calcium; measure an ionized calcium directly if the clinical picture is unclear."
  },
  {
    "id": "na-correction",
    "name": "Sodium correction for hyperglycemia + free water deficit",
    "category": "Altered Mental Status",
    "vignette": "A 70-kg man presents obtunded in hyperosmolar hyperglycemic state. Measured serum Na is 126 mEq/L and serum glucose is 1100 mg/dL. Compute the glucose-corrected sodium, state the true sodium disturbance, and estimate his free water deficit.",
    "answer": [
      "corrected Na = 150 mEq/L (2.4 mEq/L per 100 mg/dL glucose >100)",
      "true hypernatremia masked by hyperglycemia (not hyponatremia)",
      "free water deficit = 3 L",
      "next step: volume resuscitate, then replace free water slowly while lowering glucose, recheck Na frequently"
    ],
    "explanation": "Corrected Na = measured Na + 2.4 x [(glucose - 100)/100] = 126 + 2.4 x (1000/100) = 126 + 24 = 150 mEq/L (the 2.4 Hillier factor is more accurate than the older 1.6 Katz factor at glucose >400, which would give 142). So the measured 'hyponatremia' is dilutional from osmotic water shift, and the patient is actually hypernatremic and severely water-depleted. Free water deficit = 0.6 x weight x (corrected Na/140 - 1) = 0.6 x 70 x (150/140 - 1) = 42 x 0.0714 = 3.0 L. Bottom line: resuscitate volume first, then replace the free water deficit slowly while glucose is lowered, rechecking Na frequently and letting the corrected (not measured) value guide therapy."
  },
  {
    "id": "aa-gradient",
    "name": "A-a gradient",
    "category": "Dyspnea",
    "vignette": "A 70-year-old man with acute pleuritic dyspnea breathing room air. ABG: PaO2 58 mmHg, PaCO2 30 mmHg, pH 7.49 (assume sea level, FiO2 0.21). Compute the alveolar-arterial oxygen gradient and state whether it is normal for his age.",
    "answer": [
      "PAO2 = 112 mmHg",
      "A-a gradient = 54 mmHg",
      "elevated (expected ULN = age/4 + 4 = 21)",
      "widened A-a with hypoxemia indicates V/Q mismatch or shunt (e.g. PE)",
      "next step: pursue PE/parenchymal cause (CT pulmonary angiography)"
    ],
    "explanation": "Alveolar gas equation: PAO2 = FiO2 x (760 - 47) - PaCO2/0.8 = 0.21 x 713 - 30/0.8 = 149.7 - 37.5 = 112 mmHg. A-a gradient = PAO2 - PaO2 = 112 - 58 = 54 mmHg. The expected upper limit on room air is approximately age/4 + 4 = 70/4 + 4 = 21.5, so 54 is markedly widened. Bottom line: hypoxemia with a widened A-a gradient indicates V/Q mismatch or shunt rather than hypoventilation or low FiO2 (which leave the gradient normal); in this acute pleuritic presentation pursue pulmonary embolism with CT pulmonary angiography."
  }
];
