/**
 * "High-Yield" comprehensive deck — the conditions most likely to appear on an
 * Internal Medicine OSCE, biased toward things that are *medically managed*
 * (vs surgical or benign). It is a mixed deck ("Both"): authored integrated
 * management cases PLUS curated, high-to-moderate-yield references into the
 * existing banks — EKG reads, CXR reads, clinical scores, and empiric
 * antibiotics. Image reads are graded on the systematic write-up (see
 * ImageReadDrill's 70/30 weighting), not just the punchline diagnosis.
 *
 * Referenced items (modality ekg/cxr/score/antibiotics) point at an existing
 * bank entry by id/number and are rendered by that bank's component; integrated
 * items carry their own vignette/answer/explanation. The deck is intentionally
 * broad — exhaustive across the high-to-moderate-yield space — so a student can
 * sweep the whole exam surface from one tab.
 *
 * Not for clinical use. Management content is standard guideline-based IM with
 * MGH Housestaff Manual 2024-2025 section citations; confirm before acting.
 */
import { SCORE_DRILLS } from "./scoreDrills";
import { ANTIBIOTIC_DRILLS } from "./antibioticDrills";

export type HighYieldModality = "integrated" | "ekg" | "cxr" | "score" | "antibiotics" | "skill";

export interface HighYieldDrillProblem {
  /** Unique within this bank — the progress key. */
  id: string;
  /** Clinical system (used to group integrated cases). */
  category: string;
  modality: HighYieldModality;
  /** Spoiler-safe label for the catalog/browser. */
  name: string;
  // --- Authored "integrated" content ---
  vignette?: string;
  answer?: string[];
  explanation?: string;
  manualPage?: string;
  // --- References to existing banks ---
  /** LITFL ECG study number (modality "ekg"). */
  ekgN?: number;
  /** LITFL CXR study number (modality "cxr"). */
  cxrN?: number;
  /** SCORE_DRILLS id (modality "score"). */
  scoreId?: string;
  /** ANTIBIOTIC_DRILLS id (modality "antibiotics"). */
  antibioticId?: string;
  /** SKILL_DRILLS skillDrillId, e.g. "abg-1" (modality "skill"). */
  skillRef?: string;
}

/** Browse-all grouping: references group by section, integrated by system. */
export function highYieldGroup(p: HighYieldDrillProblem): string {
  switch (p.modality) {
    case "ekg":
      return "EKG reads";
    case "cxr":
      return "CXR reads";
    case "score":
      return "Clinical scores";
    case "antibiotics":
      return "Empiric antibiotics";
    case "skill":
      return "Skills & labs";
    default:
      return p.category;
  }
}

const INTEGRATED: HighYieldDrillProblem[] = [
  {
    id: "hy-stemi",
    category: "Cardiology",
    modality: "integrated",
    name: "Chest pain — STEMI",
    vignette:
      "A 58-year-old man with diabetes and smoking presents with 45 minutes of crushing substernal chest pressure, diaphoresis, and nausea. BP 140/85, HR 95. ECG shows 2 mm ST elevation in II, III, aVF with reciprocal depression in I and aVL. What is your diagnosis and immediate management?",
    answer: [
      "inferior STEMI",
      "activate the cath lab for primary PCI (door-to-balloon <90 min)",
      "aspirin 325 mg chewed + a P2Y12 inhibitor (e.g., ticagrelor)",
      "anticoagulation (heparin) and a high-intensity statin",
      "get a right-sided ECG; use nitrates cautiously if RV infarct / hypotension",
    ],
    explanation:
      "Inferior STEMI (RCA territory). Reperfusion is the priority: primary PCI (door-to-balloon <90 min) or fibrinolysis if PCI is unavailable within 120 min. Give aspirin 325 mg chewed, a P2Y12 inhibitor, anticoagulation, and a high-intensity statin; add a beta-blocker once stable. Obtain a right-sided ECG - inferior MI with RV involvement is preload-dependent, so avoid nitrates/morphine if hypotensive and give fluids.",
    manualPage: "MGH p.16-18 - Chest Pain / ACS",
  },
  {
    id: "hy-nstemi",
    category: "Cardiology",
    modality: "integrated",
    name: "Chest pain — NSTEMI / unstable angina",
    vignette:
      "A 64-year-old man with hypertension and hyperlipidemia presents with exertional chest pressure now at rest for 20 minutes. ECG shows 1 mm ST depression and T-wave inversions in V4-V6. Troponin is elevated; he is hemodynamically stable. Management?",
    answer: [
      "dual antiplatelet therapy: aspirin + a P2Y12 inhibitor",
      "anticoagulation (heparin or enoxaparin)",
      "anti-ischemic therapy: beta-blocker, nitrates, high-intensity statin",
      "risk-stratify (GRACE/TIMI) and tier the angiography timing (see below)",
      "immediate (<2 h) if unstable/refractory ischemia/acute HF; early (<24 h) if high-risk (GRACE >140, dynamic ECG/troponin); else 24-72 h",
      "no fibrinolytics for NSTEMI",
    ],
    explanation:
      "NSTEMI/UA (no ST elevation, positive troponin): dual antiplatelet therapy (aspirin + P2Y12), anticoagulation, and anti-ischemic therapy (beta-blocker, nitrates, statin). Risk-stratify (GRACE/TIMI) and tier the timing of angiography: immediate (<2 h) for hemodynamic/electrical instability, refractory ischemia, mechanical complications, or acute heart failure; early invasive (<24 h) for high-risk NSTE-ACS (e.g., GRACE >140, dynamic ECG or troponin changes); and within 24-72 h for intermediate/lower-risk patients. Unlike STEMI, fibrinolytics are NOT used.",
    manualPage: "MGH p.17-18 - ACS",
  },
  {
    id: "hy-adhf",
    category: "Cardiology",
    modality: "integrated",
    name: "Acute decompensated heart failure",
    vignette:
      "A 72-year-old woman with HFrEF presents with acute dyspnea and orthopnea. BP 178/96, HR 105, RR 28, SpO2 86% on room air. Exam: bibasilar crackles, elevated JVP, S3. CXR shows pulmonary edema. Immediate management?",
    answer: [
      "IV loop diuretic (furosemide) for volume/preload reduction",
      "IV nitroglycerin for afterload reduction (she is hypertensive)",
      "non-invasive positive-pressure ventilation (BiPAP) for hypoxemia",
      "sit upright, supplemental O2, monitoring",
      "identify the trigger (ischemia, nonadherence, arrhythmia)",
    ],
    explanation:
      "Acute hypertensive pulmonary edema (SCAPE), the 'warm-and-wet' patient: IV loop diuretics, IV nitroglycerin (afterload reduction is key when hypertensive), and NIPPV (BiPAP) to improve oxygenation and reduce work of breathing/preload - which can avert intubation. Find the precipitant.",
    manualPage: "MGH p.25-27 - Heart Failure",
  },
  {
    id: "hy-afib-rvr",
    category: "Cardiology",
    modality: "integrated",
    name: "Atrial fibrillation with RVR",
    vignette:
      "A 70-year-old man with hypertension and diabetes presents with palpitations. ECG shows atrial fibrillation at 148 bpm. BP 128/78, no chest pain, no pulmonary edema or shock. Management?",
    answer: [
      "rate control with an IV nodal agent - beta-blocker (metoprolol) or diltiazem",
      "if hemodynamically unstable: synchronized cardioversion",
      "assess stroke risk with CHA2DS2-VASc and anticoagulate if indicated",
      "address precipitants (sepsis, ischemia, thyroid, electrolytes)",
      "if onset >48 h, avoid cardioversion without anticoagulation / TEE",
    ],
    explanation:
      "Stable AF with RVR: rate control with an IV beta-blocker (metoprolol) or non-dihydropyridine CCB (diltiazem); avoid CCBs in decompensated HFrEF (use beta-blocker, digoxin, or amiodarone). Unstable (hypotension, ischemia, pulmonary edema) -> immediate synchronized cardioversion. Compute CHA2DS2-VASc and anticoagulate. Cardioversion of AF >48 h needs 3 weeks of anticoagulation or a TEE first.",
    manualPage: "MGH p.13-14 - AF/AFL",
  },
  {
    id: "hy-copd-exac",
    category: "Pulmonary",
    modality: "integrated",
    name: "COPD exacerbation",
    vignette:
      "A 66-year-old man with COPD (40 pack-years) presents with 3 days of increased dyspnea, increased sputum volume, and purulence. RR 26, SpO2 86%, accessory muscle use; ABG pH 7.31, pCO2 58. Management?",
    answer: [
      "inhaled bronchodilators: albuterol + ipratropium (nebulized)",
      "systemic corticosteroids (e.g., prednisone 40 mg)",
      "antibiotics (increased purulence) - azithromycin, doxycycline, or amox-clav",
      "controlled/titrated O2 to SpO2 88-92%",
      "non-invasive ventilation (BiPAP) for hypercapnic respiratory acidosis",
    ],
    explanation:
      "COPD exacerbation with hypercapnic respiratory acidosis: short-acting bronchodilators (albuterol + ipratropium), systemic steroids (~5-day course), and antibiotics when increased sputum purulence/volume. Titrate O2 to 88-92% (over-oxygenation worsens CO2 retention). BiPAP is indicated for pH <7.35 / pCO2 >45 and reduces intubation and mortality.",
    manualPage: "MGH p.51 - COPD",
  },
  {
    id: "hy-asthma",
    category: "Pulmonary",
    modality: "integrated",
    name: "Severe asthma exacerbation",
    vignette:
      "A 28-year-old woman with asthma presents with severe dyspnea and wheezing. RR 30, SpO2 90%, speaking in short phrases, accessory muscle use, markedly reduced peak flow. Management?",
    answer: [
      "continuous/repeated nebulized SABA (albuterol) + ipratropium",
      "early systemic corticosteroids",
      "IV magnesium sulfate for a severe exacerbation",
      "titrate supplemental O2 to SpO2 93-95% (avoid hyperoxia)",
      "watch for fatigue / silent chest / rising pCO2 -> may need escalation/intubation",
    ],
    explanation:
      "Severe asthma exacerbation: high-dose inhaled SABA (continuous albuterol) + ipratropium, early systemic corticosteroids, and IV magnesium sulfate for severe/refractory cases. A normalizing or rising pCO2 in a tiring patient signals impending respiratory failure.",
    manualPage: "MGH p.50 - Asthma",
  },
  {
    id: "hy-pe",
    category: "Pulmonary",
    modality: "integrated",
    name: "Acute pulmonary embolism",
    vignette:
      "A 55-year-old woman 3 weeks after knee surgery presents with acute pleuritic chest pain and dyspnea. HR 110, BP 118/70, SpO2 91%. CT angiography confirms bilateral PE with RV dilation, but she is normotensive. Management?",
    answer: [
      "start therapeutic anticoagulation promptly (heparin/LMWH)",
      "risk-stratify: massive (hypotension) vs submassive/intermediate (RV strain +/- troponin) vs low-risk",
      "massive PE (hypotension/shock): systemic thrombolysis or embolectomy",
      "intermediate-high-risk (RV strain + elevated troponin): monitored bed + serial assessment",
      "if deteriorating, rescue with reduced-dose/full thrombolysis or catheter-directed therapy",
    ],
    explanation:
      "Acute PE: anticoagulate immediately unless contraindicated. Massive PE (sustained hypotension/shock) warrants systemic thrombolysis or embolectomy. Submassive/intermediate-high-risk PE (RV dysfunction with elevated troponin, as here) is anticoagulated and admitted to a monitored bed with serial assessment; if the patient deteriorates, rescue options include reduced-dose or full systemic thrombolysis, catheter-directed thrombolysis/embolectomy, or surgical embolectomy.",
    manualPage: "MGH p.54-55 - VTE",
  },
  {
    id: "hy-dka",
    category: "Endocrine",
    modality: "integrated",
    name: "Diabetic ketoacidosis",
    vignette:
      "A 24-year-old with type 1 diabetes presents with nausea, vomiting, and abdominal pain. Glucose 480, pH 7.18, bicarbonate 12, anion gap 24, ketones positive, K+ 5.2. Management priorities?",
    answer: [
      "aggressive IV isotonic fluids (normal saline) first",
      "IV insulin infusion (after confirming K+ >3.3)",
      "potassium repletion as K+ falls (add when K <5.0-5.3)",
      "add dextrose when glucose ~200 while continuing insulin until the anion gap closes",
      "identify and treat the trigger (infection, missed insulin)",
    ],
    explanation:
      "DKA: (1) IV fluids first (NS); (2) IV insulin infusion - but HOLD insulin if K+ <3.3 until repleted (insulin drives K intracellularly); (3) potassium repletion (start when K <5.0-5.3); (4) when glucose ~200 add dextrose and continue insulin until the anion gap closes (the gap, not glucose, is the endpoint), then bridge to subcutaneous insulin with overlap. Find the precipitant.",
    manualPage: "MGH p.184 - DKA/HHS",
  },
  {
    id: "hy-hhs",
    category: "Endocrine",
    modality: "integrated",
    name: "Hyperosmolar hyperglycemic state",
    vignette:
      "An 80-year-old woman with type 2 diabetes presents with profound dehydration and lethargy. Glucose 920, serum osmolality 350, minimal ketones, pH 7.34, bicarbonate 20. Management?",
    answer: [
      "aggressive IV isotonic fluid resuscitation (large total deficit)",
      "IV insulin infusion after volume and potassium are addressed",
      "careful potassium repletion",
      "correct glucose/osmolality slowly; monitor mental status",
      "identify the precipitant (infection, MI, nonadherence)",
    ],
    explanation:
      "HHS: marked hyperglycemia and hyperosmolality with minimal ketosis/acidosis and severe volume depletion (deficits often 8-10 L). Fluids are the priority; start insulin after initial fluids and once K+ is known/repleted. Correct gradually to avoid cerebral edema. Find the trigger.",
    manualPage: "MGH p.184 - DKA/HHS",
  },
  {
    id: "hy-adrenal-crisis",
    category: "Endocrine",
    modality: "integrated",
    name: "Acute adrenal crisis",
    vignette:
      "A 45-year-old woman on chronic prednisone (recently stopped) presents with hypotension refractory to fluids, fatigue, nausea, hyponatremia, and hyperkalemia. Management?",
    answer: [
      "IV hydrocortisone immediately (stress-dose steroid) - do not delay",
      "aggressive IV isotonic fluids",
      "treat hypoglycemia if present",
      "identify/treat the precipitant (infection, abrupt steroid withdrawal)",
      "draw cortisol/ACTH but do not wait for results to treat",
    ],
    explanation:
      "Adrenal (Addisonian) crisis: give IV hydrocortisone (e.g., 100 mg) immediately with aggressive isotonic fluids and dextrose for hypoglycemia. Precipitated here by abrupt steroid withdrawal. Treat empirically before confirmatory cortisol/ACTH results; find and treat the trigger.",
    manualPage: "MGH p.185 - Adrenal Insufficiency",
  },
  {
    id: "hy-thyroid-storm",
    category: "Endocrine",
    modality: "integrated",
    name: "Thyroid storm",
    vignette:
      "A 40-year-old woman with poorly controlled Graves disease presents after a respiratory infection with fever 39.8 C, HR 150 in atrial fibrillation, agitation, vomiting, and diarrhea. Burch-Wartofsky score is high. Management?",
    answer: [
      "beta-blocker (propranolol) - controls adrenergic symptoms and blocks T4->T3 conversion",
      "thionamide: PTU (preferred in storm) or methimazole to block hormone synthesis",
      "iodine (SSKI/Lugol's) - but only >=1 h AFTER the thionamide (Wolff-Chaikoff)",
      "hydrocortisone (blocks T4->T3 conversion; covers relative adrenal insufficiency)",
      "treat the trigger (infection); cool for fever with acetaminophen - avoid aspirin",
    ],
    explanation:
      "Thyroid storm (decompensated thyrotoxicosis: fever, tachyarrhythmia, agitation/AMS, GI symptoms; Burch-Wartofsky >=45): the classic stepwise regimen is (1) beta-blocker (propranolol also blocks peripheral T4->T3 conversion), (2) a thionamide (PTU preferred in storm because it also blocks conversion; methimazole otherwise), (3) iodine (SSKI/Lugol's) given at least 1 h AFTER the thionamide so it does not fuel synthesis, and (4) hydrocortisone (blocks conversion, covers relative adrenal insufficiency). Treat the precipitant (often infection) and use cooling/acetaminophen - avoid aspirin (displaces T4 from binding proteins).",
    manualPage: "MGH p.189 - Thyroid Disorders",
  },
  {
    id: "hy-myxedema-coma",
    category: "Endocrine",
    modality: "integrated",
    name: "Myxedema coma",
    vignette:
      "An elderly woman with hypothyroidism (recently off her levothyroxine) is brought in with hypothermia (33 C), bradycardia, hypoventilation, hyponatremia, and decreased consciousness. Management?",
    answer: [
      "IV levothyroxine (T4) loading dose (+/- IV liothyronine/T3)",
      "IV hydrocortisone first/concurrently - treat coexisting adrenal insufficiency before thyroid hormone",
      "supportive care: passive rewarming, ventilatory support, cautious fluids/electrolytes",
      "identify and treat the precipitant (infection, cold, sedatives, nonadherence)",
      "ICU-level monitoring",
    ],
    explanation:
      "Myxedema coma (decompensated hypothyroidism: hypothermia, bradycardia, hypoventilation/hypercapnia, hyponatremia, altered mentation): give IV thyroid hormone (levothyroxine load, +/- liothyronine) and IV stress-dose hydrocortisone - steroids should be started before or with thyroid hormone, because giving thyroid hormone alone can precipitate adrenal crisis if coexisting adrenal insufficiency is present. Provide supportive care (passive rewarming, ventilation, cautious fluids) and find the trigger (infection, cold exposure, sedatives, levothyroxine nonadherence).",
    manualPage: "MGH p.189 - Thyroid Disorders",
  },
  {
    id: "hy-hyperkalemia",
    category: "Renal / Electrolytes",
    modality: "integrated",
    name: "Severe hyperkalemia",
    vignette:
      "A 60-year-old man with CKD and a missed dialysis session presents with weakness. K+ 7.1. ECG shows peaked T waves and a widening QRS. Immediate management, in order?",
    answer: [
      "IV calcium gluconate (or chloride) first - membrane stabilization",
      "insulin + glucose (shifts K intracellularly)",
      "nebulized albuterol (shifts K)",
      "remove K: loop diuretic, GI binder (patiromer/SPS), and dialysis (definitive in ESRD)",
      "stop K-containing fluids/meds; continuous ECG monitoring",
    ],
    explanation:
      "Hyperkalemia with ECG changes is an emergency. Order: (1) IV calcium to stabilize the myocardium (does not lower K); (2) shift K with insulin+glucose and nebulized albuterol (consider bicarb if acidotic); (3) remove K with diuretics, GI cation binders, and - definitively in this dialysis-dependent patient - hemodialysis. Stop all potassium sources.",
    manualPage: "MGH p.109-110 - Electrolytes; Renal",
  },
  {
    id: "hy-hyponatremia",
    category: "Renal / Electrolytes",
    modality: "integrated",
    name: "Symptomatic hyponatremia",
    vignette:
      "A 68-year-old woman presents with confusion and a witnessed seizure. Serum sodium is 112 mmol/L. Management, and what is the key safety limit?",
    answer: [
      "3% hypertonic saline bolus for severe symptoms (seizure/coma)",
      "target only a small rapid rise (~4-6 mmol/L) to stop the seizure",
      "limit total correction to ~6-8 mmol/L per 24 h (osmotic demyelination risk)",
      "frequent sodium monitoring; treat the underlying cause",
      "if overcorrecting, re-lower with D5W +/- DDAVP",
    ],
    explanation:
      "Severe symptomatic hyponatremia (seizure) warrants 3% hypertonic saline (e.g., 100-150 mL boluses) to raise Na by ~4-6 mmol/L acutely to control symptoms. The critical safety rule: do NOT correct more than ~6-8 mmol/L in 24 h (slower if chronic/high-risk) to prevent osmotic demyelination syndrome. Monitor Na frequently and identify the cause (SIADH, hypovolemia, etc.).",
    manualPage: "MGH p.107-108 - Sodium Disorders",
  },
  {
    id: "hy-sepsis",
    category: "Critical care",
    modality: "integrated",
    name: "Sepsis / septic shock",
    vignette:
      "A 70-year-old woman from a nursing home presents with fever, confusion, BP 84/50, HR 118, RR 24, and lactate 4.2. Source is presumed urinary. Management within the first hour?",
    answer: [
      "obtain blood cultures (and source cultures) before antibiotics",
      "broad-spectrum antibiotics within 1 hour",
      "IV crystalloid resuscitation (~30 mL/kg) for hypotension / lactate >=4",
      "norepinephrine (first-line vasopressor) for MAP <65 despite fluids",
      "measure/trend lactate; pursue source control",
    ],
    explanation:
      "Surviving Sepsis 1-hour bundle: draw cultures, give broad-spectrum antibiotics within 1 hour, start 30 mL/kg crystalloid for hypotension or lactate >=4, add norepinephrine (first-line) to keep MAP >=65 if fluid-refractory, and remeasure lactate. Achieve source control.",
    manualPage: "MGH p.64-66 - Shock / Sepsis",
  },
  {
    id: "hy-ugib",
    category: "Gastroenterology",
    modality: "integrated",
    name: "Upper GI bleed",
    vignette:
      "A 60-year-old man with cirrhosis presents with hematemesis and melena. BP 92/58, HR 116, Hb 7.2. Management?",
    answer: [
      "resuscitate: 2 large-bore IVs, fluids, restrictive transfusion (target Hb ~7)",
      "IV proton pump inhibitor",
      "if variceal suspected (cirrhosis): octreotide + prophylactic ceftriaxone",
      "urgent upper endoscopy for diagnosis and hemostasis",
      "correct coagulopathy; protect the airway if torrential",
    ],
    explanation:
      "Variceal vs peptic UGIB in cirrhosis: resuscitate with large-bore access and a restrictive transfusion threshold (~7 g/dL), start an IV PPI, and - given cirrhosis - add octreotide and prophylactic antibiotics (ceftriaxone reduces mortality in variceal bleeds). Urgent EGD (within 12-24 h) for therapy.",
    manualPage: "MGH p.70 - Upper GI Bleeding",
  },
  {
    id: "hy-pancreatitis",
    category: "Gastroenterology",
    modality: "integrated",
    name: "Acute pancreatitis",
    vignette:
      "A 48-year-old man with heavy alcohol use presents with severe epigastric pain radiating to the back, vomiting, and lipase 5x the upper limit of normal. Management?",
    answer: [
      "aggressive goal-directed IV fluids (lactated Ringer's)",
      "analgesia and antiemetics",
      "early enteral nutrition as tolerated",
      "identify the cause (gallstones, alcohol, hypertriglyceridemia); RUQ ultrasound",
      "antibiotics only for infected necrosis, not routinely",
    ],
    explanation:
      "Acute pancreatitis (2 of 3: typical pain, lipase >3x ULN, imaging). Management is supportive - early goal-directed IV fluids (lactated Ringer's), pain control, and early enteral feeding as tolerated. Get a RUQ ultrasound for gallstones (urgent ERCP if cholangitis/obstruction). Do NOT give prophylactic antibiotics; reserve them for documented infected necrosis.",
    manualPage: "MGH p.85 - Pancreatitis",
  },
  {
    id: "hy-stroke",
    category: "Neurology",
    modality: "integrated",
    name: "Acute ischemic stroke",
    vignette:
      "A 70-year-old man develops sudden left-sided weakness and facial droop 90 minutes ago. BP 178/98, glucose normal, NIHSS 12. Non-contrast head CT shows no hemorrhage. Management?",
    answer: [
      "IV thrombolysis (alteplase/tenecteplase) if within window and no contraindication",
      "assess for large-vessel occlusion -> mechanical thrombectomy (up to 24 h in selected patients)",
      "if giving tPA, keep BP <185/110",
      "do not give aspirin until 24 h after tPA; otherwise start antiplatelet",
      "establish last-known-well; CT first to exclude hemorrhage",
    ],
    explanation:
      "Acute ischemic stroke: after excluding hemorrhage on CT, give IV thrombolysis within 4.5 h of last-known-well if eligible, and evaluate for large-vessel occlusion for thrombectomy (up to 24 h in selected patients by perfusion imaging). Lower BP to <185/110 before tPA; otherwise permissive hypertension. Antiplatelet after 24 h if thrombolysed.",
    manualPage: "MGH p.199-200 - Stroke / TIA",
  },
  {
    id: "hy-etoh-withdrawal",
    category: "Neurology",
    modality: "integrated",
    name: "Alcohol withdrawal",
    vignette:
      "A 52-year-old man admitted for pancreatitis develops tremor, diaphoresis, tachycardia, and visual hallucinations 36 hours after his last drink. Management?",
    answer: [
      "benzodiazepines, symptom-triggered by CIWA (lorazepam/diazepam)",
      "thiamine before glucose (prevent Wernicke)",
      "electrolyte repletion (Mg, K, phosphate) and supportive care",
      "monitor for delirium tremens; escalate (phenobarbital/ICU) if refractory",
      "treat the underlying illness",
    ],
    explanation:
      "Alcohol withdrawal: benzodiazepines are first-line, dosed by a symptom-triggered protocol (CIWA-Ar). Give thiamine BEFORE glucose to prevent Wernicke encephalopathy; replete magnesium/potassium/phosphate. Escalate for severe withdrawal/DTs (seizure and death risk); consider phenobarbital or ICU for refractory cases.",
    manualPage: "MGH p.212-214 - Alcohol Use Disorder & Withdrawal",
  },
  {
    id: "hy-anaphylaxis",
    category: "Allergy / Immunology",
    modality: "integrated",
    name: "Anaphylaxis",
    vignette:
      "A 30-year-old man develops urticaria, wheezing, lip swelling, and hypotension minutes after a bee sting. Management?",
    answer: [
      "intramuscular epinephrine immediately (anterolateral thigh) - first-line",
      "airway assessment and high-flow oxygen",
      "IV fluids for hypotension; lay supine with legs raised",
      "adjuncts: antihistamines and steroids (do NOT replace epinephrine)",
      "observe for a biphasic reaction; epinephrine auto-injector + allergy referral at discharge",
    ],
    explanation:
      "Anaphylaxis: IM epinephrine (0.3-0.5 mg, 1:1000, anterolateral thigh) is the immediate first-line treatment and the only one that reduces mortality - give it early and repeat q5-15 min as needed. Support airway/breathing, give IV fluids, position supine. Antihistamines and corticosteroids are adjuncts only. Observe for biphasic reactions.",
    manualPage: "MGH p.193 - Angioedema & Anaphylaxis",
  },
  {
    id: "hy-hypertensive-emergency",
    category: "Cardiology",
    modality: "integrated",
    name: "Hypertensive emergency",
    vignette:
      "A 55-year-old man presents with BP 220/130, headache, blurred vision, and new acute kidney injury with proteinuria. Management principle?",
    answer: [
      "titratable IV antihypertensive (labetalol or nicardipine) with close monitoring",
      "lower the MAP by ~10-20% (no more than ~25%) in the first hour",
      "avoid precipitous drops (organ hypoperfusion)",
      "identify the end-organ damage (encephalopathy, AKI, ACS, dissection, pulmonary edema)",
      "tailor the agent to the syndrome (e.g., esmolol + nicardipine for dissection)",
    ],
    explanation:
      "Hypertensive emergency = severe hypertension WITH acute end-organ damage. Use titratable IV agents (nicardipine, labetalol, clevidipine) and lower the MAP by ~10-20% (<=25%) in the first hour, then gradually over 24-48 h - overly rapid reduction risks cerebral/coronary/renal hypoperfusion. Exceptions: aortic dissection (rapid SBP <120, beta-blocker first) and acute ischemic stroke (different targets).",
    manualPage: "MGH p.38 - Hypertensive Urgency/Emergency",
  },
];

// Curated, high-to-moderate-yield EKG reads (graded on the systematic write-up).
const EKG_REFS: { ekgN: number; category: string }[] = [
  { ekgN: 1, category: "Ischemia" },
  { ekgN: 9, category: "Ischemia" },
  { ekgN: 26, category: "Ischemia" },
  { ekgN: 14, category: "Ischemia" },
  { ekgN: 5, category: "Ischemia (STEMI-equivalent)" },
  { ekgN: 19, category: "Ischemia (STEMI-equivalent)" },
  { ekgN: 8, category: "Ischemia (high-risk)" },
  { ekgN: 2, category: "Arrhythmia" },
  { ekgN: 18, category: "Arrhythmia" },
  { ekgN: 16, category: "Arrhythmia (SVT)" },
  { ekgN: 13, category: "Arrhythmia (VT)" },
  { ekgN: 37, category: "Arrhythmia (pre-excitation)" },
  { ekgN: 44, category: "Conduction block" },
  { ekgN: 29, category: "Conduction block" },
  { ekgN: 3, category: "Electrolytes" },
  { ekgN: 6, category: "Electrolytes" },
  { ekgN: 32, category: "Pericardial" },
  { ekgN: 4, category: "Toxicology" },
  { ekgN: 30, category: "Toxicology" },
];

// Curated, high-to-moderate-yield CXR reads (graded on the systematic write-up).
const CXR_REFS: { cxrN: number; category: string }[] = [
  { cxrN: 7, category: "Consolidation" },
  { cxrN: 4, category: "Consolidation (atypical)" },
  { cxrN: 41, category: "Consolidation + effusion" },
  { cxrN: 5, category: "Cavitary" },
  { cxrN: 40, category: "Cavitary (TB)" },
  { cxrN: 46, category: "Disseminated (miliary TB)" },
  { cxrN: 12, category: "Immunocompromised (PJP)" },
  { cxrN: 8, category: "Pneumothorax" },
  { cxrN: 9, category: "Obstructive (COPD)" },
  { cxrN: 11, category: "Diffuse (ARDS)" },
  { cxrN: 22, category: "Cardiac silhouette" },
  { cxrN: 29, category: "Hilar adenopathy" },
  { cxrN: 23, category: "Mediastinal mass" },
];

// Curated, high-to-moderate-yield clinical scores.
const SCORE_REFS: string[] = [
  "heart",
  "wells-pe",
  "perc",
  "chadsvasc",
  "hasbled",
  "curb65",
  "centor",
  "meld",
  "childpugh",
  "fena",
  "na-correction",
  "aa-gradient",
];

// Curated skill / lab-interpretation reps, so the deck also drills the
// data-interpretation skills (ABG/acid-base, PFTs, fluid analysis, key labs).
const SKILL_REFS: { skillRef: string; label: string }[] = [
  { skillRef: "abg-1", label: "ABG / acid-base" },
  { skillRef: "abg-2", label: "ABG / acid-base" },
  { skillRef: "pft-1", label: "PFT interpretation" },
  { skillRef: "saag-1", label: "Ascites (SAAG)" },
  { skillRef: "pleural-1", label: "Pleural fluid (Light's)" },
  { skillRef: "tft-1", label: "Thyroid function tests" },
  { skillRef: "lft-1", label: "Liver chemistries" },
  { skillRef: "csf-1", label: "CSF interpretation" },
  { skillRef: "iron-1", label: "Iron studies" },
  { skillRef: "ua-1", label: "Urinalysis" },
];

// Curated, high-to-moderate-yield empiric-antibiotic scenarios.
const ANTIBIOTIC_REFS: string[] = [
  "cap-inpatient-nonsevere",
  "cap-severe-mrsa-psa",
  "hap-vap",
  "pyelonephritis",
  "cellulitis-nonpurulent",
  "necrotizing-fasciitis",
  "meningitis-listeria",
  "sbp",
  "cdiff-initial",
  "septic-shock-unknown",
];

export const HIGH_YIELD_DRILLS: HighYieldDrillProblem[] = [
  ...INTEGRATED,
  ...EKG_REFS.map((r) => ({
    id: `hy-ekg-${r.ekgN}`,
    category: r.category,
    modality: "ekg" as const,
    name: `EKG read - ${r.category}`,
    ekgN: r.ekgN,
  })),
  ...CXR_REFS.map((r) => ({
    id: `hy-cxr-${r.cxrN}`,
    category: r.category,
    modality: "cxr" as const,
    name: `CXR read - ${r.category}`,
    cxrN: r.cxrN,
  })),
  ...SCORE_REFS.map((id) => ({
    id: `hy-score-${id}`,
    category: "Clinical scores",
    modality: "score" as const,
    name: SCORE_DRILLS.find((s) => s.id === id)?.name ?? id,
    scoreId: id,
  })),
  ...ANTIBIOTIC_REFS.map((id) => ({
    id: `hy-abx-${id}`,
    category: "Empiric antibiotics",
    modality: "antibiotics" as const,
    name: ANTIBIOTIC_DRILLS.find((a) => a.id === id)?.name ?? id,
    antibioticId: id,
  })),
  ...SKILL_REFS.map((r) => ({
    id: `hy-skill-${r.skillRef}`,
    category: "Skills & labs",
    modality: "skill" as const,
    name: r.label,
    skillRef: r.skillRef,
  })),
];
