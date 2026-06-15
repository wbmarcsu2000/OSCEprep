/**
 * Management-practice drill bank — one problem per case, derived from each
 * case's authored management step (the graded actions, the model plan, the
 * unsafe actions, disposition/consults, and the MGH Housestaff Manual page).
 * Generated from the case library so the drill grades against the same content
 * the full station does. Powers the Drills "Management" mode: given the scenario
 * and the working diagnosis, write the management plan; graded by coverage of
 * the expected actions, with the model plan + manual reference as teaching.
 *
 * Regenerate with scripts/gen-management-drills (reads src/data/cases/*.json).
 */

export interface ManagementDrillProblem {
  caseId: string;
  category: string;
  diagnosis: string;
  /** One-line presenting scenario (the case's chart one-liner). */
  vignette: string;
  prompt: string;
  /** Expected management actions — graded by coverage. */
  actions: string[];
  /** Things NOT to do for this diagnosis (shown as "avoid"). */
  unsafe: string[];
  disposition: string;
  consults: string[];
  /** Worked model management plan. */
  idealAnswer: string;
  manual: { section: string; page: number };
}

export const MANAGEMENT_DRILLS: ManagementDrillProblem[] = [
  {
    "caseId": "abdo-01",
    "category": "Abdominal Pain",
    "diagnosis": "Acute appendicitis",
    "vignette": "22M presents with ~18 hours of abdominal pain that began around the umbilicus and migrated to the right lower quadrant, with nausea and anorexia.",
    "prompt": "What is your management plan?",
    "actions": [
      "NPO and IV fluids",
      "Surgery consult for appendectomy",
      "Broad-spectrum antibiotics",
      "Analgesia and antiemetics",
      "Serial abdominal exams"
    ],
    "unsafe": [
      "Discharging a surgical abdomen"
    ],
    "disposition": "Admit; OR",
    "consults": [
      "Surgery"
    ],
    "idealAnswer": "NPO, IV fluids, analgesia, antiemetics. Broad-spectrum antibiotics (e.g. ceftriaxone + metronidazole). Urgent surgical consultation for appendectomy. Serial abdominal exams.",
    "manual": {
      "section": "Abdominal Pain (Appendicitis)",
      "page": 72
    }
  },
  {
    "caseId": "abdo-02",
    "category": "Abdominal Pain",
    "diagnosis": "Acute cholecystitis",
    "vignette": "45F presents with 12 hours of constant right upper quadrant pain that began after a fatty meal, with nausea, vomiting, and fever.",
    "prompt": "What is your management plan?",
    "actions": [
      "NPO and IV fluids",
      "Antibiotics",
      "Early laparoscopic cholecystectomy",
      "Surgery consult",
      "Analgesia"
    ],
    "unsafe": [
      "No source-control plan"
    ],
    "disposition": "Admit",
    "consults": [
      "Surgery"
    ],
    "idealAnswer": "NPO, IV fluids, analgesia. Antibiotics – piperacillin-tazobactam OR ceftriaxone + metronidazole. Early (<7 day) laparoscopic cholecystectomy during the admission; percutaneous cholecystostomy if too high-risk for surgery and failing antibiotics. Surgery consult.",
    "manual": {
      "section": "Biliary Disease (Cholecystitis)",
      "page": 88
    }
  },
  {
    "caseId": "abdo-03",
    "category": "Abdominal Pain",
    "diagnosis": "Acute pancreatitis",
    "vignette": "50M presents with 8 hours of severe constant epigastric pain radiating to the back, with nausea and vomiting, on a background of heavy alcohol use.",
    "prompt": "What is your management plan?",
    "actions": [
      "IV fluid resuscitation (lactated Ringer's)",
      "Analgesia",
      "Early enteral nutrition as tolerated",
      "Treat underlying cause / ERCP if indicated",
      "Antiemetics",
      "Monitor severity (SIRS/organ failure)"
    ],
    "unsafe": [
      "Prophylactic antibiotics without infection"
    ],
    "disposition": "Admit; ICU if severe",
    "consults": [],
    "idealAnswer": "Aggressive but controlled IV fluid resuscitation – lactated Ringer's preferred (avoid LR if hypercalcemia), ~3–4 L in first 24 h titrated to keep BUN/HCT from rising; avoid over-resuscitation after 24–48 h. Analgesia and antiemetics. Early enteral feeding as tolerated. Treat the cause (e.g. ERCP for gallstone pancreatitis with cholangitis). No prophylactic antibiotics.",
    "manual": {
      "section": "Pancreatitis",
      "page": 85
    }
  },
  {
    "caseId": "abdo-04",
    "category": "Abdominal Pain",
    "diagnosis": "Small bowel obstruction",
    "vignette": "60F with prior abdominal surgery presents with a day of crampy abdominal pain, distension, bilious vomiting, and inability to pass stool or gas.",
    "prompt": "What is your management plan?",
    "actions": [
      "NPO and nasogastric decompression",
      "Surgery consult",
      "IV fluids and electrolyte correction",
      "Urgent surgery if strangulation/ischemia",
      "Analgesia and antiemetics",
      "Serial exams"
    ],
    "unsafe": [
      "Feeding without decompression"
    ],
    "disposition": "Admit",
    "consults": [
      "Surgery"
    ],
    "idealAnswer": "NPO, nasogastric tube decompression, IV fluid resuscitation, correct electrolytes. Analgesia and antiemetics. Surgery consult. Non-operative trial for partial/adhesive SBO; urgent surgery for strangulation/ischemia/closed-loop or failure to resolve. Serial exams and imaging.",
    "manual": {
      "section": "Abdominal Pain (Small Bowel Obstruction)",
      "page": 72
    }
  },
  {
    "caseId": "abdo-05",
    "category": "Abdominal Pain",
    "diagnosis": "Diverticulitis",
    "vignette": "58M presents with 3 days of constant left lower quadrant pain, low-grade fever, and a change in bowel habits.",
    "prompt": "What is your management plan?",
    "actions": [
      "Antibiotics",
      "Bowel rest / diet advancement",
      "CT and drainage/surgery if complicated",
      "Analgesia",
      "Interval colonoscopy after resolution"
    ],
    "unsafe": [
      "Missing complicated disease"
    ],
    "disposition": "Admit if complicated/unable to tolerate PO",
    "consults": [],
    "idealAnswer": "Uncomplicated diverticulitis: bowel rest/clear liquids, analgesia, and antibiotics covering GNRs + anaerobes (ciprofloxacin + metronidazole, or amoxicillin-clavulanate). Complicated disease (abscess, perforation, obstruction) → CT, IV antibiotics, drainage of abscess, surgical evaluation. Outpatient colonoscopy 6–8 weeks after resolution.",
    "manual": {
      "section": "Abdominal Pain (Diverticulitis)",
      "page": 72
    }
  },
  {
    "caseId": "abdo-06",
    "category": "Abdominal Pain",
    "diagnosis": "Acute mesenteric ischemia",
    "vignette": "72F with atrial fibrillation presents with sudden, severe, diffuse abdominal pain that seems out of proportion to a relatively benign abdominal exam.",
    "prompt": "What is your management plan?",
    "actions": [
      "Aggressive IV fluid resuscitation",
      "STAT surgery / vascular consult for revascularization",
      "Broad-spectrum antibiotics",
      "Systemic anticoagulation (heparin)",
      "NPO and NG decompression",
      "CT angiography"
    ],
    "unsafe": [
      "Discharging pain out of proportion"
    ],
    "disposition": "Emergent; OR",
    "consults": [
      "Surgery",
      "Vascular Surgery / IR"
    ],
    "idealAnswer": "Surgical/vascular emergency: pain out of proportion to exam. Aggressive IV fluid resuscitation, broad-spectrum antibiotics, NPO, NG decompression. Systemic anticoagulation (heparin). STAT surgery and vascular/IR consults for revascularization or resection. CT angiography. Avoid vasopressors that worsen splanchnic flow.",
    "manual": {
      "section": "Abdominal Pain (Mesenteric Ischemia)",
      "page": 72
    }
  },
  {
    "caseId": "abdo-07",
    "category": "Abdominal Pain",
    "diagnosis": "Ruptured abdominal aortic aneurysm",
    "vignette": "74M smoker with hypertension presents with sudden, severe, tearing abdominal and flank/back pain and a near-syncopal episode.",
    "prompt": "What is your management plan?",
    "actions": [
      "STAT vascular surgery consult for emergent open / EVAR repair",
      "Activate massive transfusion / balanced blood products",
      "Large-bore IV access and type-specific/uncrossmatched blood",
      "Permissive hypotension (target SBP ~70-90 / mentating) until repair",
      "NPO, continuous monitoring, OR activation"
    ],
    "unsafe": [
      "Aggressive crystalloid bolus raising BP and worsening hemorrhage"
    ],
    "disposition": "Emergent; OR",
    "consults": [
      "Vascular Surgery",
      "Anesthesia / OR"
    ],
    "idealAnswer": "Surgical emergency. Immediate STAT vascular surgery consult for emergent open or endovascular (EVAR) repair. Two large-bore IVs, type & crossmatch, activate massive transfusion protocol with balanced blood products. Practice PERMISSIVE HYPOTENSION (target SBP ~70-90 or mentating) and avoid aggressive crystalloid that raises BP and worsens bleeding. Reverse any coagulopathy/anticoagulation, provide analgesia, keep NPO, continuous monitoring, and move to the OR. Do NOT delay definitive repair for non-essential imaging in an unstable patient.",
    "manual": {
      "section": "Abdominal Pain (Ruptured Abdominal Aortic Aneurysm)",
      "page": 74
    }
  },
  {
    "caseId": "abdo-08",
    "category": "Abdominal Pain",
    "diagnosis": "Diabetic ketoacidosis presenting as abdominal pain",
    "vignette": "22F with type 1 diabetes presents with one day of diffuse abdominal pain, nausea/vomiting, and rapid breathing after a recent flu-like illness.",
    "prompt": "What is your management plan?",
    "actions": [
      "Isotonic IV fluid resuscitation (normal saline)",
      "Check and replete potassium before/with insulin (hold insulin if K < 3.3)",
      "IV regular insulin infusion after fluids/K addressed",
      "Add dextrose at glucose ~200 and continue insulin until gap closes",
      "Identify and treat the precipitant (missed insulin during illness)",
      "Frequent monitoring; transition to SC insulin with overlap once gap closed"
    ],
    "unsafe": [
      "Giving insulin before checking/repleting potassium",
      "Routine bicarbonate for mild-moderate acidosis"
    ],
    "disposition": "Admit (step-down/ICU if severe acidosis or altered mental status)",
    "consults": [
      "Endocrinology"
    ],
    "idealAnswer": "Resuscitate with isotonic IV fluids (normal saline) first. CHECK potassium before insulin: if K < 3.3 hold insulin and replete K; if K 3.3-5.2 give insulin with K added to fluids; if K > 5.2 start insulin and recheck. Start an IV regular insulin infusion once fluids/K are addressed; add dextrose-containing fluids when glucose reaches ~200 and continue insulin until the anion gap normalizes. Treat the precipitant (missed insulin during a viral illness). Monitor glucose hourly and the gap/electrolytes q2-4h. Avoid bicarbonate unless pH is very low. Transition to subcutaneous insulin with overlap once eating and the gap has closed.",
    "manual": {
      "section": "Diabetic Ketoacidosis & Hyperglycemic Emergencies",
      "page": 178
    }
  },
  {
    "caseId": "abdo-09",
    "category": "Abdominal Pain",
    "diagnosis": "Perforated peptic ulcer",
    "vignette": "58M presents with the abrupt onset 4 hours ago of severe, constant epigastric pain that rapidly spread across the whole abdomen, now lying rigidly still.",
    "prompt": "What is your management plan?",
    "actions": [
      "NPO, IV access, aggressive fluid resuscitation",
      "Urgent surgical consult for operative repair",
      "Broad-spectrum IV antibiotics covering gut flora",
      "Nasogastric decompression and IV PPI",
      "Analgesia, antiemetics, type & screen, monitoring"
    ],
    "unsafe": [
      "Discharging/observing a peritonitic patient with free air"
    ],
    "disposition": "Admit; OR",
    "consults": [
      "Surgery"
    ],
    "idealAnswer": "Resuscitate: NPO, two large-bore IVs, aggressive crystalloid resuscitation, monitor. Urgent surgical consultation for operative repair (Graham omental patch) and peritoneal washout. Broad-spectrum IV antibiotics covering enteric flora (e.g., piperacillin-tazobactam). Nasogastric tube decompression and IV proton-pump inhibitor. Analgesia, antiemetics, type & screen, foley to monitor output. On recovery: stop NSAIDs and test/treat H. pylori.",
    "manual": {
      "section": "Abdominal Pain (Perforated Viscus / Peptic Ulcer Disease)",
      "page": 74
    }
  },
  {
    "caseId": "ams-01",
    "category": "Altered Mental Status",
    "diagnosis": "Hepatic encephalopathy",
    "vignette": "60M with known cirrhosis is brought in by family for 2 days of progressive confusion and excessive sleepiness.",
    "prompt": "What is your management plan?",
    "actions": [
      "Identify and treat precipitant",
      "Lactulose",
      "Rifaximin",
      "Airway protection if obtunded",
      "Correct electrolytes (hypokalemia)"
    ],
    "unsafe": [
      "Sedatives/benzodiazepines",
      "Missing precipitant"
    ],
    "disposition": "Admit",
    "consults": [
      "Hepatology"
    ],
    "idealAnswer": "Identify and treat the precipitant (GI bleed, infection/SBP, constipation, dehydration, electrolytes, sedatives). Lactulose titrated to 2–3 soft stools/day (PO or via rectal enema if obtunded); add rifaximin. Protect the airway if obtunded. Correct hypokalemia/alkalosis. Avoid sedatives.",
    "manual": {
      "section": "End Stage Liver Disease (Hepatic Encephalopathy)",
      "page": 93
    }
  },
  {
    "caseId": "ams-02",
    "category": "Altered Mental Status",
    "diagnosis": "Urosepsis with delirium",
    "vignette": "80F from a nursing facility is brought in with one day of acute confusion, decreased oral intake, and fever.",
    "prompt": "What is your management plan?",
    "actions": [
      "Empiric broad-spectrum antibiotics",
      "IV crystalloid resuscitation",
      "Blood and urine cultures before antibiotics",
      "Norepinephrine first-line if MAP<65",
      "Source control",
      "Serial lactate"
    ],
    "unsafe": [
      "Delaying antibiotics",
      "Dopamine first-line"
    ],
    "disposition": "Admit; ICU if septic shock",
    "consults": [],
    "idealAnswer": "Urosepsis: obtain blood and urine cultures, then give empiric broad-spectrum IV antibiotics within 1 hour (e.g. ceftriaxone; cover resistant GNR if risk). 30 mL/kg balanced crystalloid for hypoperfusion. Norepinephrine first-line if MAP <65 after fluids. Source control (relieve obstruction, remove catheter). Serial lactate. Treat delirium non-pharmacologically.",
    "manual": {
      "section": "Sepsis",
      "page": 65
    }
  },
  {
    "caseId": "ams-03",
    "category": "Altered Mental Status",
    "diagnosis": "Hypoglycemia",
    "vignette": "68M with diabetes is brought in by family for sudden confusion, sweating, and tremor that began before dinner.",
    "prompt": "What is your management plan?",
    "actions": [
      "Immediate dextrose/glucagon or oral carbohydrate",
      "Identify and treat the cause",
      "Recheck glucose in 15 min and repeat",
      "Hold offending agent"
    ],
    "unsafe": [
      "Failing to recheck glucose"
    ],
    "disposition": "Observe; admit if recurrent/sulfonylurea",
    "consults": [],
    "idealAnswer": "Treat hypoglycemia immediately: if able to take PO, 15–20 g fast carbohydrate; if unable/severe, IV dextrose (D50) or IM glucagon. Recheck glucose in 15 minutes and repeat until >70–80. Identify and treat the cause (insulin/sulfonylurea, missed meal, renal failure, alcohol). Hold the offending agent; for sulfonylurea-induced, observe and consider octreotide.",
    "manual": {
      "section": "Inpatient Diabetes (Hypoglycemia)",
      "page": 183
    }
  },
  {
    "caseId": "ams-04",
    "category": "Altered Mental Status",
    "diagnosis": "Hyperosmolar hyperglycemic state",
    "vignette": "70F with type 2 diabetes presents with several days of progressive confusion, polyuria, and profound dehydration.",
    "prompt": "What is your management plan?",
    "actions": [
      "Aggressive IV fluid resuscitation",
      "Potassium repletion and monitoring",
      "IV insulin infusion after K is safe",
      "Add dextrose when glucose <300",
      "Identify and treat precipitant",
      "Frequent BMP/glucose monitoring"
    ],
    "unsafe": [
      "Insulin before repleting potassium"
    ],
    "disposition": "Admit; ICU often required",
    "consults": [],
    "idealAnswer": "HHS: prioritize ABCs and volume status, then potassium, then glucose. Aggressive IV fluids (LR 15–20 mL/kg/h initially; ~average 8–10 L deficit), then ½NS/LR based on corrected sodium; add D5 when glucose <300. Replete and monitor potassium (give K if <5.3, hold insulin if <3.3). IV insulin infusion after K is safe. Find and treat the precipitant. Frequent BMP/glucose.",
    "manual": {
      "section": "DKA / HHS",
      "page": 184
    }
  },
  {
    "caseId": "ams-05",
    "category": "Altered Mental Status",
    "diagnosis": "Severe hyponatremia",
    "vignette": "65F presents with 2 days of worsening confusion, headache, and nausea, a few weeks after starting a new blood-pressure medication.",
    "prompt": "What is your management plan?",
    "actions": [
      "3% hypertonic saline for severe symptoms",
      "Limit sodium correction rate (avoid ODS)",
      "Frequent sodium monitoring",
      "Treat underlying cause by volume status",
      "DDAVP clamp / relower if overcorrecting"
    ],
    "unsafe": [
      "Overcorrecting sodium too fast"
    ],
    "disposition": "Admit; ICU/step-down for 3% saline",
    "consults": [
      "Nephrology"
    ],
    "idealAnswer": "Severe symptomatic hyponatremia (seizure/AMS): 3% hypertonic saline 100 mL bolus over 10 min, repeat up to 3× until symptoms resolve or Na rises 4–6. Correct no faster than 6–8 mEq/L per 24 h to avoid osmotic demyelination; check Na q2–4h. Treat the underlying cause by volume status (SIADH vs hypovolemia). Use a DDAVP clamp if overcorrecting. Nephrology consult for 3% saline.",
    "manual": {
      "section": "Sodium Disorders (Hyponatremia)",
      "page": 107
    }
  },
  {
    "caseId": "ams-06",
    "category": "Altered Mental Status",
    "diagnosis": "Alcohol withdrawal / delirium tremens",
    "vignette": "55M, admitted 2 days ago after a fall, becomes acutely agitated, tremulous, diaphoretic, and confused with visual hallucinations.",
    "prompt": "What is your management plan?",
    "actions": [
      "Symptom-triggered benzodiazepines (CIWA-Ar)",
      "Thiamine before glucose",
      "Electrolyte repletion (K, Mg, phosphate)",
      "Escalate for severe DTs (ICU/phenobarbital)",
      "Folate / multivitamin",
      "Monitor for seizures"
    ],
    "unsafe": [
      "Glucose before thiamine"
    ],
    "disposition": "Admit; ICU if severe DTs",
    "consults": [],
    "idealAnswer": "Symptom-triggered benzodiazepines guided by CIWA-Ar (e.g. lorazepam/diazepam) for withdrawal/DTs; escalate for severe DTs and consider ICU/phenobarbital. Thiamine BEFORE glucose (prevent Wernicke), plus folate and multivitamin; repair electrolytes (K, Mg, phosphate). Supportive care, monitor for seizures. Address the underlying alcohol use disorder.",
    "manual": {
      "section": "Alcohol Use Disorder & Withdrawal",
      "page": 212
    }
  },
  {
    "caseId": "ams-07",
    "category": "Altered Mental Status",
    "diagnosis": "Wernicke encephalopathy",
    "vignette": "58M with heavy alcohol use and recent poor intake presents with several days of progressive confusion, double vision, and an unsteady, wide-based gait.",
    "prompt": "What is your management plan?",
    "actions": [
      "High-dose IV thiamine before any glucose",
      "Give thiamine empirically (do not wait for the level) and continue a multi-day high-dose course",
      "Electrolyte repletion (magnesium cofactor, potassium, phosphate)",
      "Folate/multivitamin and nutrition; watch for refeeding syndrome",
      "Monitor for and treat concurrent alcohol withdrawal",
      "Admit, serial neuro reassessment, neurology consult if not improving"
    ],
    "unsafe": [
      "Glucose/dextrose before thiamine"
    ],
    "disposition": "Admit",
    "consults": [
      "Neurology"
    ],
    "idealAnswer": "Immediate high-dose IV thiamine (e.g. 500 mg IV three times daily) given BEFORE any glucose, empirically and without waiting for the thiamine level, continued for several days then tapered. Replete magnesium (a required cofactor), potassium, and phosphate; give folate/multivitamin and nutritional support while watching for refeeding syndrome. Monitor for and treat concurrent alcohol withdrawal. Admit, serially reassess neuro status, and obtain neurology consult if not improving. Address the underlying alcohol use disorder and social needs.",
    "manual": {
      "section": "Alcohol Use Disorder & Withdrawal (Wernicke Encephalopathy / Thiamine Deficiency)",
      "page": 213
    }
  },
  {
    "caseId": "ams-08",
    "category": "Altered Mental Status",
    "diagnosis": "Serotonin syndrome",
    "vignette": "34M brought in by his partner with several hours of agitation, sweating, and jerking movements that began after a recent medication change.",
    "prompt": "What is your management plan?",
    "actions": [
      "Stop all serotonergic agents",
      "Benzodiazepines for agitation/clonus and autonomic control",
      "Aggressive external cooling and supportive care (IV fluids, monitor for rhabdomyolysis/AKI)",
      "Cyproheptadine for moderate-severe cases",
      "Intubate, sedate, and paralyze (non-depolarizing) for severe hyperthermia/rigidity"
    ],
    "unsafe": [
      "Antipyretics for centrally mediated hyperthermia",
      "Physical restraints alone (worsens hyperthermia and acidosis)"
    ],
    "disposition": "Admit; ICU if severe (hyperthermia, rigidity, autonomic instability)",
    "consults": [
      "Toxicology / Poison Control"
    ],
    "idealAnswer": "Serotonin syndrome: immediately discontinue all serotonergic agents (sertraline, tramadol, dextromethorphan). Benzodiazepines (e.g., lorazepam/diazepam) for agitation, clonus, and to blunt autonomic instability. Aggressive supportive care: IV crystalloid, external cooling, continuous monitoring, and treat/anticipate rhabdomyolysis and AKI. Cyproheptadine for moderate-to-severe cases not controlled by benzodiazepines. For severe hyperthermia (>41.1°C) or refractory rigidity: rapid sequence intubation with sedation and non-depolarizing paralysis, then active cooling. Avoid antipyretics (centrally mediated fever), avoid physical restraints alone. Consult Poison Control/toxicology; admit, ICU for severe disease.",
    "manual": {
      "section": "Toxicology (Serotonin Syndrome)",
      "page": 88
    }
  },
  {
    "caseId": "ams-09",
    "category": "Altered Mental Status",
    "diagnosis": "Thyroid storm",
    "vignette": "38F with a goiter presents with agitation, high fever, and a rapid irregular pulse after a recent flu-like illness.",
    "prompt": "What is your management plan?",
    "actions": [
      "Beta-blockade (propranolol or esmolol)",
      "Thionamide (PTU preferred, or methimazole)",
      "Iodine (SSKI/Lugol) at least 1 hour after thionamide",
      "Glucocorticoids (hydrocortisone/dexamethasone)",
      "Supportive care: cooling, IV fluids, treat precipitant",
      "Endocrinology consult and ICU admission"
    ],
    "unsafe": [
      "Giving iodine before the thionamide",
      "Using aspirin to control fever"
    ],
    "disposition": "Admit; ICU often required",
    "consults": [
      "Endocrinology"
    ],
    "idealAnswer": "Thyroid storm: ABCs and continuous monitoring in the ICU. Beta-blockade with propranolol (or esmolol infusion) for rate and adrenergic symptoms. Thionamide (PTU preferred in storm as it also blocks peripheral T4→T3 conversion; methimazole alternative) to block hormone synthesis. At least 1 hour LATER, give inorganic iodine (SSKI/Lugol) to block hormone release. Glucocorticoids (hydrocortisone or dexamethasone) to reduce T4→T3 conversion and treat possible adrenal insufficiency. Aggressive supportive care: active cooling and acetaminophen (avoid aspirin), IV fluids, identify and treat the precipitant (here the infection). Endocrinology consult. Consider cholestyramine and, if refractory, plasmapheresis.",
    "manual": {
      "section": "Thyroid Emergencies (Thyroid Storm)",
      "page": 201
    }
  },
  {
    "caseId": "anemia-01",
    "category": "Anemia",
    "diagnosis": "Iron deficiency anemia",
    "vignette": "38F presents with months of progressive fatigue, exertional breathlessness, and pallor, on a background of heavy menstrual periods.",
    "prompt": "What is your management plan?",
    "actions": [
      "Iron repletion (oral or IV iron)",
      "Identify and treat source of blood loss",
      "Confirm iron studies (ferritin)",
      "Transfuse only if symptomatic/unstable",
      "Recheck CBC/reticulocyte response"
    ],
    "unsafe": [
      "Failing to pursue bleeding source"
    ],
    "disposition": "Usually outpatient",
    "consults": [],
    "idealAnswer": "Replace iron – oral ferrous sulfate (every-other-day dosing improves absorption) or IV iron if intolerant/malabsorption/ongoing loss/need for rapid repletion. Critically: identify and treat the source of blood loss – GI evaluation (EGD/colonoscopy) in adults, menstrual history in women. Transfuse only if symptomatic/unstable. Recheck CBC/retic.",
    "manual": {
      "section": "Pancytopenia & Anemia (Iron Deficiency)",
      "page": 136
    }
  },
  {
    "caseId": "anemia-02",
    "category": "Anemia",
    "diagnosis": "Acute upper GI bleed",
    "vignette": "60M presents with lightheadedness, fatigue, and several days of black tarry stools; he takes daily NSAIDs and drinks alcohol regularly.",
    "prompt": "What is your management plan?",
    "actions": [
      "Resuscitate (2 large-bore IVs, crystalloid, T&S)",
      "Transfuse to restrictive threshold (Hgb>7)",
      "IV PPI (pantoprazole)",
      "GI consult for EGD",
      "Correct coagulopathy",
      "Octreotide + ceftriaxone if cirrhosis"
    ],
    "unsafe": [
      "Over-transfusion"
    ],
    "disposition": "Admit; ICU if unstable",
    "consults": [
      "Gastroenterology"
    ],
    "idealAnswer": "Resuscitate: 2 large-bore IVs, isotonic crystalloid, type & screen; transfuse pRBCs to a restrictive threshold (Hgb >7, or >8 if CAD). Correct coagulopathy (platelets >50k; PCC for INR >2; avoid FFP in cirrhosis). IV PPI (pantoprazole). If cirrhosis: octreotide + ceftriaxone prophylaxis. GI consult for EGD within 24 h. Hold/reverse anticoagulants.",
    "manual": {
      "section": "Upper GI Bleeding",
      "page": 70
    }
  },
  {
    "caseId": "anemia-03",
    "category": "Anemia",
    "diagnosis": "B12 deficiency",
    "vignette": "65F presents with months of fatigue, numbness and tingling in the feet, and unsteadiness on her feet.",
    "prompt": "What is your management plan?",
    "actions": [
      "B12 / cobalamin replacement",
      "Identify the cause (pernicious anemia/malabsorption)",
      "Check and treat folate (not alone)",
      "Monitor reticulocyte response and potassium",
      "Assess for neurologic involvement"
    ],
    "unsafe": [
      "Folate without B12"
    ],
    "disposition": "Outpatient",
    "consults": [],
    "idealAnswer": "Replace vitamin B12 (cobalamin) – IM for severe deficiency/neurologic involvement, then maintenance (IM or high-dose oral). Identify the cause (pernicious anemia, malabsorption, diet, metformin). Check/replete folate but do NOT give folate alone (can precipitate neurologic worsening). Monitor reticulocyte/CBC response and potassium.",
    "manual": {
      "section": "Pancytopenia & Anemia (B12 Deficiency)",
      "page": 137
    }
  },
  {
    "caseId": "anemia-04",
    "category": "Anemia",
    "diagnosis": "Anemia of chronic disease",
    "vignette": "68M with long-standing rheumatoid arthritis presents with several months of fatigue and mild breathlessness; routine labs showed anemia.",
    "prompt": "What is your management plan?",
    "actions": [
      "Treat the underlying chronic disease",
      "Confirm iron studies (distinguish from IDA)",
      "Transfuse only if symptomatic",
      "Iron only if concurrent deficiency"
    ],
    "unsafe": [
      "Reflexive transfusion without indication",
      "Missing underlying disease"
    ],
    "disposition": "Outpatient / per underlying disease",
    "consults": [],
    "idealAnswer": "Treat the underlying chronic inflammatory/infectious/malignant disease – that is the primary therapy. Confirm with iron studies (low iron, normal/high ferritin). Avoid unnecessary transfusion; transfuse only if symptomatic. Replace iron only if coexisting true iron deficiency. Consider ESAs only in specific settings (e.g. CKD) with hematology input.",
    "manual": {
      "section": "Pancytopenia & Anemia (Anemia of Chronic Disease)",
      "page": 136
    }
  },
  {
    "caseId": "anemia-05",
    "category": "Anemia",
    "diagnosis": "Autoimmune hemolytic anemia",
    "vignette": "45F presents with one week of rapidly worsening fatigue, jaundice, and dark urine.",
    "prompt": "What is your management plan?",
    "actions": [
      "Corticosteroids (warm AIHA)",
      "Identify and treat underlying trigger",
      "Transfuse least-incompatible units if life-threatening",
      "Folate supplementation",
      "Hematology consult"
    ],
    "unsafe": [
      "Withholding life-saving transfusion"
    ],
    "disposition": "Admit",
    "consults": [
      "Hematology"
    ],
    "idealAnswer": "Warm AIHA: corticosteroids (prednisone 1 mg/kg) first-line; folate supplementation; treat any underlying trigger (lymphoproliferative disorder, drug, infection). For severe/refractory: rituximab, IVIG, or splenectomy. Transfuse if life-threatening (least-incompatible units, do not withhold for fear of crossmatch). Hematology consult. Avoid cold exposure if cold agglutinin type.",
    "manual": {
      "section": "Pancytopenia & Anemia (Autoimmune Hemolytic Anemia)",
      "page": 137
    }
  },
  {
    "caseId": "anemia-06",
    "category": "Anemia",
    "diagnosis": "Thrombotic thrombocytopenic purpura (TTP)",
    "vignette": "38F brought in with a few days of bruising, fatigue, intermittent confusion, and a low-grade fever.",
    "prompt": "What is your management plan?",
    "actions": [
      "Urgent therapeutic plasma exchange (PLEX)",
      "High-dose corticosteroids",
      "Caplacizumab for confirmed/high-suspicion acquired TTP",
      "Rituximab for immune TTP",
      "Urgent hematology consult and ICU/monitored admission"
    ],
    "unsafe": [
      "Prophylactic platelet transfusion (may precipitate microvascular thrombosis)"
    ],
    "disposition": "Admit",
    "consults": [
      "Hematology"
    ],
    "idealAnswer": "Treat as TTP emergency: start URGENT therapeutic plasma exchange (PLEX) immediately (use plasma infusion if PLEX is delayed) — do not wait for the ADAMTS13 result. Add high-dose corticosteroids; caplacizumab and rituximab for acquired/immune TTP. Folate supplementation and supportive care. AVOID prophylactic platelet transfusions (may worsen thrombosis) unless life-threatening bleeding. Urgent hematology consult; admit to ICU/monitored bed.",
    "manual": {
      "section": "Thrombotic Microangiopathies (Thrombotic Thrombocytopenic Purpura)",
      "page": 141
    }
  },
  {
    "caseId": "anemia-07",
    "category": "Anemia",
    "diagnosis": "G6PD deficiency hemolysis",
    "vignette": "28M of Mediterranean descent presents with two days of fatigue, jaundice, and dark (cola-colored) urine that began shortly after starting a new antibiotic for a urinary tract infection.",
    "prompt": "What is your management plan?",
    "actions": [
      "Stop/avoid the offending oxidant drug and counsel on triggers",
      "Supportive care — hydration to protect kidneys, monitor Hgb/renal function",
      "Transfuse if anemia severe/symptomatic",
      "Folate supplementation",
      "Patient education with oxidant avoid-list; screen at-risk family"
    ],
    "unsafe": [
      "Continuing or re-prescribing the oxidant drug / giving another oxidant"
    ],
    "disposition": "Admit",
    "consults": [
      "Hematology"
    ],
    "idealAnswer": "G6PD oxidative hemolysis: immediately discontinue and avoid the offending oxidant drug (here a sulfa antibiotic) and remove other triggers (fava beans, naphthalene). Supportive care: IV hydration to maintain urine output and protect against hemoglobinuria-related renal injury; serial Hgb and renal monitoring. Transfuse packed red cells if anemia is severe or symptomatic. Folate supplementation. Patient education with a written list of oxidant drugs/foods to avoid, and consider screening at-risk family members. Hematology consult; confirm with a repeat G6PD enzyme assay 2–3 months after the acute episode (it can be falsely normal during reticulocytosis). Most episodes are self-limited as older RBCs are cleared.",
    "manual": {
      "section": "Pancytopenia & Anemia (Hemolytic Anemia — G6PD Deficiency)",
      "page": 138
    }
  },
  {
    "caseId": "anemia-08",
    "category": "Anemia",
    "diagnosis": "Sickle cell disease with vaso-occlusive crisis and hemolysis",
    "vignette": "24M with a history of sickle cell disease presents with two days of severe diffuse bone and back pain, fatigue, and dark urine.",
    "prompt": "What is your management plan?",
    "actions": [
      "Prompt multimodal analgesia with IV opioids titrated to pain",
      "IV hydration targeting euvolemia (avoid over-hydration)",
      "Supplemental oxygen and incentive spirometry to prevent acute chest syndrome",
      "Evaluate/empirically treat infection if febrile; VTE prophylaxis",
      "Folate, continue/restart hydroxyurea, hematology consult"
    ],
    "unsafe": [
      "Under-treating pain / delaying opioids over addiction concerns"
    ],
    "disposition": "Admit",
    "consults": [
      "Hematology"
    ],
    "idealAnswer": "Vaso-occlusive crisis: prompt multimodal analgesia with IV opioids titrated to pain (do not under-treat); IV fluids targeting euvolemia (avoid over-hydration which worsens acute chest syndrome); supplemental oxygen to keep SpO2 >=95% with incentive spirometry to prevent acute chest syndrome; assess for and empirically cover infection if febrile, plus VTE prophylaxis; folate and continue/restart hydroxyurea; hematology consult. Transfuse only for a clear indication (acute chest syndrome, stroke, symptomatic or aplastic anemia); exchange transfusion for severe acute chest syndrome. Avoid over-transfusion to baseline (hyperviscosity).",
    "manual": {
      "section": "Hematology (Sickle Cell Disease — Vaso-Occlusive Crisis)",
      "page": 141
    }
  },
  {
    "caseId": "chestpain-01",
    "category": "Chest Pain",
    "diagnosis": "NSTEMI",
    "vignette": "62F with HTN, hyperlipidemia, and T2DM presents with 2 hours of substernal chest pressure radiating to the left arm, with diaphoresis and nausea.",
    "prompt": "What is your management plan?",
    "actions": [
      "Aspirin",
      "Anticoagulation (heparin/LMWH)",
      "Cardiology consult / early invasive cath",
      "High-intensity statin",
      "Beta blocker within 24h",
      "ACEi/ARB",
      "Telemetry and serial troponin"
    ],
    "unsafe": [
      "Thrombolytics for NSTEMI"
    ],
    "disposition": "Admit to telemetry/cardiology",
    "consults": [
      "Cardiology"
    ],
    "idealAnswer": "Aspirin 325 mg load; start anticoagulation (UFH/LMWH) on diagnosis of ACS; high-intensity statin (atorvastatin 80 mg); beta blocker within 24 h (if no contraindication); ACEi/ARB within 24 h; nitrates for ongoing pain; hold P2Y12 load until discussed with cardiology; cardiology consult for early invasive risk stratification (GRACE) and catheterization; telemetry with serial troponins.",
    "manual": {
      "section": "Acute Coronary Syndrome",
      "page": 18
    }
  },
  {
    "caseId": "chestpain-02",
    "category": "Chest Pain",
    "diagnosis": "Pulmonary embolism",
    "vignette": "45M presents with sudden right-sided pleuritic chest pain and dyspnea that began this morning, two days after a long-haul flight.",
    "prompt": "What is your management plan?",
    "actions": [
      "Anticoagulation (DOAC preferred)",
      "Risk-stratify PE severity",
      "Thrombolysis (tPA) if high-risk/unstable",
      "PERT consult",
      "Supplemental oxygen / supportive care",
      "Admit and monitor"
    ],
    "unsafe": [
      "IVC filter instead of anticoagulation"
    ],
    "disposition": "Admit; ICU if intermediate-high or high risk",
    "consults": [
      "PERT (Pulmonary Embolism Response Team)"
    ],
    "idealAnswer": "Risk-stratify the PE (low / intermediate / high). Anticoagulate unless contraindicated – DOAC preferred over LMWH/VKA. For high-risk (hemodynamic instability) give systemic thrombolysis (tPA) and activate the PERT/SHOCK team. IVC filter only if anticoagulation is contraindicated. Supportive O2; cautious IVF.",
    "manual": {
      "section": "VTE Management",
      "page": 55
    }
  },
  {
    "caseId": "chestpain-03",
    "category": "Chest Pain",
    "diagnosis": "Aortic dissection",
    "vignette": "58M with poorly controlled hypertension presents with sudden, severe, tearing chest pain radiating to the back that began 1 hour ago.",
    "prompt": "What is your management plan?",
    "actions": [
      "IV beta blocker for rate control (HR<60)",
      "Cardiothoracic surgery consult (STAT)",
      "Blood pressure control (nitroprusside after BB)",
      "Type A surgical / type B medical",
      "Pain control",
      "Large-bore IV access and type & screen"
    ],
    "unsafe": [
      "Vasodilator before beta blockade",
      "Anticoagulation or thrombolytics"
    ],
    "disposition": "Emergent; ICU / OR",
    "consults": [
      "Cardiac Surgery"
    ],
    "idealAnswer": "Emergency. Control heart rate first (IV beta blocker, e.g. esmolol, target HR <60) THEN blood pressure (target SBP 100–120, add nitroprusside) to reduce aortic wall stress. Pain control. STAT cardiac surgery consult – Stanford type A (ascending) is a surgical emergency; type B (descending) is usually managed medically. Type & screen, two large-bore IVs.",
    "manual": {
      "section": "Aortic Disease (Acute Aortic Syndromes)",
      "page": 35
    }
  },
  {
    "caseId": "chestpain-04",
    "category": "Chest Pain",
    "diagnosis": "Acute pericarditis",
    "vignette": "30M presents with 2 days of sharp central chest pain that is worse lying flat and better leaning forward, one week after a viral upper respiratory illness.",
    "prompt": "What is your management plan?",
    "actions": [
      "NSAID (high-dose ibuprofen/ASA)",
      "Colchicine",
      "Echocardiogram for effusion/tamponade",
      "PPI gastroprotection",
      "Activity restriction",
      "Treat underlying cause"
    ],
    "unsafe": [
      "Corticosteroids first-line",
      "Anticoagulation with effusion"
    ],
    "disposition": "Usually outpatient; admit if high-risk features",
    "consults": [],
    "idealAnswer": "High-dose NSAID (ibuprofen/aspirin) PLUS colchicine as first-line therapy, with a PPI for gastric protection. Activity restriction. Treat the underlying cause; avoid anticoagulation. Echocardiography to exclude effusion/tamponade. Reserve corticosteroids for refractory or specific etiologies.",
    "manual": {
      "section": "Pericardial Disease",
      "page": 34
    }
  },
  {
    "caseId": "chestpain-05",
    "category": "Chest Pain",
    "diagnosis": "GERD",
    "vignette": "50F presents with several weeks of intermittent burning retrosternal discomfort, worse after large meals and when lying down, relieved by antacids.",
    "prompt": "What is your management plan?",
    "actions": [
      "PPI trial (omeprazole)",
      "Lifestyle modification",
      "EGD if alarm symptoms or refractory",
      "Reassess and uptitrate PPI",
      "Exclude cardiac cause first"
    ],
    "unsafe": [
      "Missing alarm features"
    ],
    "disposition": "Outpatient",
    "consults": [],
    "idealAnswer": "After cardiac causes are excluded: start a PPI (e.g. omeprazole 20 mg before breakfast), 8-week trial. Lifestyle modification – weight loss, avoid trigger foods/late meals, elevate head of bed, tobacco/alcohol reduction. EGD if alarm features (dysphagia, weight loss, GI bleed, anemia, age ≥60) or no response.",
    "manual": {
      "section": "GERD & Peptic Ulcer Disease",
      "page": 73
    }
  },
  {
    "caseId": "chestpain-06",
    "category": "Chest Pain",
    "diagnosis": "Costochondritis",
    "vignette": "26M presents with 3 days of sharp left-sided chest pain that began after an intense weightlifting session, worse with movement and deep breaths.",
    "prompt": "What is your management plan?",
    "actions": [
      "Reassurance after excluding dangerous causes",
      "NSAIDs/acetaminophen",
      "Confirm reproducible chest-wall tenderness",
      "Activity modification / local heat",
      "Return precautions"
    ],
    "unsafe": [
      "Unnecessary admission/anticoagulation",
      "Unnecessary cardiac imaging"
    ],
    "disposition": "Discharge home",
    "consults": [],
    "idealAnswer": "Reassurance after exclusion of cardiac/pulmonary causes. NSAIDs or acetaminophen for pain. Activity modification and local heat. No cardiac workup beyond what excludes dangerous causes. Return precautions.",
    "manual": {
      "section": "Chest Pain (musculoskeletal causes)",
      "page": 16
    }
  },
  {
    "caseId": "chestpain-07",
    "category": "Chest Pain",
    "diagnosis": "Cardiac tamponade",
    "vignette": "58F presents with several days of progressive dyspnea, vague chest pressure, and lightheadedness, now hypotensive and tachycardic.",
    "prompt": "What is your management plan?",
    "actions": [
      "Urgent echo-guided pericardiocentesis (definitive)",
      "IV volume expansion to support preload (temporizing)",
      "Urgent cardiology/cardiac surgery consult",
      "High-acuity monitoring; avoid positive-pressure ventilation if possible",
      "Pericardial fluid analysis and treat underlying cause (malignant effusion)"
    ],
    "unsafe": [
      "Diuretics or vasodilators/nitrates that drop preload",
      "Delaying drainage in an unstable patient for further imaging"
    ],
    "disposition": "Admit to ICU/CCU",
    "consults": [
      "Cardiology",
      "Cardiac Surgery"
    ],
    "idealAnswer": "This is decompensating tamponade: resuscitate and drain. Give IV fluids to support preload while arranging URGENT echo-guided pericardiocentesis (definitive). Call cardiology/cardiac surgery immediately. Manage in a high-acuity/monitored setting; avoid diuretics, nitrates, and (if possible) positive-pressure ventilation, all of which reduce preload. Send pericardial fluid for cytology/culture and treat the underlying cause (likely malignant effusion given breast-cancer history); consider a pericardial drain or surgical window for recurrent/malignant effusions.",
    "manual": {
      "section": "Pericardial Disease (Pericardial Effusion & Tamponade)",
      "page": 35
    }
  },
  {
    "caseId": "chestpain-08",
    "category": "Chest Pain",
    "diagnosis": "Esophageal rupture (Boerhaave syndrome)",
    "vignette": "54M with a heavy alcohol binge presents with sudden, severe lower chest and epigastric pain that began immediately after a bout of forceful retching and vomiting 3 hours ago.",
    "prompt": "What is your management plan?",
    "actions": [
      "Broad-spectrum IV antibiotics plus antifungal coverage",
      "STAT thoracic / general surgery consult for early operative repair",
      "Keep strictly NPO",
      "Aggressive IV fluid resuscitation (pressors if septic)",
      "Pleural / mediastinal drainage (chest tube)",
      "IV PPI and pain control"
    ],
    "unsafe": [
      "Oral intake or barium contrast",
      "Discharging / treating as benign GERD"
    ],
    "disposition": "Emergent; ICU / OR",
    "consults": [
      "Thoracic Surgery"
    ],
    "idealAnswer": "Treat as a surgical emergency. Keep the patient strictly NPO; resuscitate with IV fluids (and pressors if septic). Start broad-spectrum IV antibiotics with antifungal coverage for mediastinitis. STAT thoracic/general surgery consult for early operative repair — primary repair within 24 hours dramatically improves survival; endoscopic stenting/drainage if not an operative candidate. IV PPI, pain control, and chest-tube/mediastinal drainage of the contaminated pleural space. Admit to the ICU. Avoid oral intake and any barium contrast.",
    "manual": {
      "section": "Esophageal Emergencies (Esophageal Perforation / Boerhaave Syndrome)",
      "page": 88
    }
  },
  {
    "caseId": "chestpain-09",
    "category": "Chest Pain",
    "diagnosis": "Cocaine-associated chest pain with coronary vasospasm",
    "vignette": "34M with no cardiac history presents with 1 hour of severe substernal chest pressure that began at a party, with palpitations, anxiety, and diaphoresis.",
    "prompt": "What is your management plan?",
    "actions": [
      "Benzodiazepine first-line",
      "Aspirin",
      "Nitrates for ischemic pain",
      "Calcium channel blocker / phentolamine for refractory hypertension or vasospasm",
      "Telemetry with serial ECG and troponin",
      "Cocaine cessation counseling / addiction resources"
    ],
    "unsafe": [
      "Non-selective beta blocker (unopposed alpha stimulation)"
    ],
    "disposition": "Observe on telemetry with serial troponin/ECG",
    "consults": [
      "Cardiology"
    ],
    "idealAnswer": "Benzodiazepine (e.g., lorazepam/diazepam) first-line to reduce sympathetic drive, agitation, tachycardia, hypertension, and ischemia; aspirin; nitroglycerin for ongoing ischemic pain; calcium channel blocker or phentolamine for refractory hypertension/vasospasm; AVOID beta blockers due to unopposed alpha-mediated vasoconstriction; telemetry with serial ECG and troponin; cardiology consult if troponin positive or true ACS; counsel on cocaine cessation and offer addiction/substance-use resources.",
    "manual": {
      "section": "Acute Coronary Syndrome (Cocaine-Associated Chest Pain)",
      "page": 22
    }
  },
  {
    "caseId": "diarrhea-01",
    "category": "Diarrhea",
    "diagnosis": "C. difficile colitis",
    "vignette": "68F presents with several days of frequent watery diarrhea, crampy abdominal pain, and low-grade fever, two weeks after a course of antibiotics.",
    "prompt": "What is your management plan?",
    "actions": [
      "Oral vancomycin or fidaxomicin",
      "Stop offending antibiotic and antimotility agents",
      "Fulminant: PO/PR vanc + IV metronidazole + surgery consult",
      "Contact precautions and hand hygiene",
      "Supportive fluids and electrolytes"
    ],
    "unsafe": [
      "IV vancomycin for C. diff",
      "Antimotility agents"
    ],
    "disposition": "Per severity",
    "consults": [],
    "idealAnswer": "Stop the offending antibiotic and any antimotility agents. Treat with oral vancomycin 125 mg q6h ×10 d OR fidaxomicin 200 mg BID ×10 d (metronidazole only if these unavailable). Fulminant disease (hypotension, ileus, megacolon): high-dose PO/PR vancomycin + IV metronidazole and STAT surgical consult. Contact precautions; hand hygiene with soap and water. Do not test for cure.",
    "manual": {
      "section": "C. Difficile Infection",
      "page": 124
    }
  },
  {
    "caseId": "diarrhea-02",
    "category": "Diarrhea",
    "diagnosis": "Bacterial gastroenteritis",
    "vignette": "30M presents with 2 days of frequent diarrhea (now with some blood), crampy abdominal pain, fever, and nausea after a barbecue.",
    "prompt": "What is your management plan?",
    "actions": [
      "Volume and electrolyte repletion",
      "Avoid antibiotics if STEC suspected (HUS risk)",
      "Selective empiric antibiotics for severe/high-risk",
      "Antimotility only if no fever/blood",
      "Stool studies if severe/bloody/high-risk"
    ],
    "unsafe": [
      "Antibiotics in suspected STEC"
    ],
    "disposition": "Usually outpatient",
    "consults": [],
    "idealAnswer": "Most acute infectious diarrhea is self-limited: volume and electrolyte repletion (oral or IV). Empiric antibiotics (fluoroquinolone or azithromycin) only for severe disease, sepsis, high-risk hosts, age ≥70, or bloody diarrhea – and AVOID antibiotics if Shiga-toxin E. coli is suspected (HUS risk). Loperamide only if no fever/blood. Stool studies if severe/bloody/high-risk.",
    "manual": {
      "section": "Diarrhea (Bacterial Gastroenteritis)",
      "page": 77
    }
  },
  {
    "caseId": "diarrhea-03",
    "category": "Diarrhea",
    "diagnosis": "Ulcerative colitis flare",
    "vignette": "26F presents with several weeks of bloody diarrhea with mucus, urgency, and crampy lower abdominal pain, with recent weight loss.",
    "prompt": "What is your management plan?",
    "actions": [
      "IV corticosteroids",
      "Exclude infection / C. diff",
      "Rescue therapy (infliximab/cyclosporine) if refractory",
      "VTE prophylaxis",
      "Avoid antimotility/opioids/NSAIDs",
      "Surgery consult for toxic megacolon/refractory",
      "GI consult"
    ],
    "unsafe": [
      "Antimotility precipitating toxic megacolon"
    ],
    "disposition": "Admit",
    "consults": [
      "Gastroenterology",
      "Surgery"
    ],
    "idealAnswer": "Acute severe UC flare: admit; IV corticosteroids (methylprednisolone) first-line. Rule out infection (stool studies, C. diff) and toxic megacolon (abdominal imaging). VTE prophylaxis (high thrombotic risk). Avoid antimotility/opioids/NSAIDs. If steroid-refractory by day 3–5: rescue with infliximab or cyclosporine; surgery consult for refractory disease/perforation/toxic megacolon. GI consult.",
    "manual": {
      "section": "Inflammatory Bowel Disease (UC flare)",
      "page": 81
    }
  },
  {
    "caseId": "diarrhea-04",
    "category": "Diarrhea",
    "diagnosis": "Celiac disease",
    "vignette": "35F presents with months of loose, bulky, foul-smelling stools, bloating, fatigue, and unintentional weight loss.",
    "prompt": "What is your management plan?",
    "actions": [
      "Lifelong gluten-free diet (dietitian referral)",
      "Confirm diagnosis before diet (tTG-IgA + biopsy)",
      "Replete nutritional deficiencies",
      "Screen for associated disease and osteoporosis",
      "Monitor response"
    ],
    "unsafe": [
      "Gluten-free diet before confirmatory testing"
    ],
    "disposition": "Outpatient",
    "consults": [],
    "idealAnswer": "Lifelong strict gluten-free diet is the treatment – refer to a dietitian. Confirm with serology (tTG-IgA with total IgA) and duodenal biopsy before committing to the diet. Replete deficiencies (iron, B12, folate, vitamin D, calcium). Screen for associated conditions (thyroid, type 1 DM) and osteoporosis. Monitor serologies/symptoms for response.",
    "manual": {
      "section": "Diarrhea (Celiac Disease)",
      "page": 77
    }
  },
  {
    "caseId": "diarrhea-05",
    "category": "Diarrhea",
    "diagnosis": "Ischemic colitis",
    "vignette": "72M with cardiovascular disease presents with sudden crampy left-sided abdominal pain followed within hours by bloody diarrhea.",
    "prompt": "What is your management plan?",
    "actions": [
      "Supportive care (bowel rest, IV fluids)",
      "Broad-spectrum antibiotics",
      "Optimize perfusion / stop vasoconstrictors",
      "Surgery consult + CT if peritonitis/gangrene",
      "Serial exams and lactate"
    ],
    "unsafe": [
      "Missing gangrenous colitis"
    ],
    "disposition": "Admit",
    "consults": [],
    "idealAnswer": "Largely supportive: bowel rest, IV fluid resuscitation, and broad-spectrum antibiotics. Optimize perfusion – stop vasoconstrictors and minimize precipitants; correct hypotension. Serial abdominal exams and lactate. Surgical consult and CT for peritonitis, gangrene, perforation, or clinical deterioration. Most non-gangrenous cases resolve with supportive care.",
    "manual": {
      "section": "Diarrhea (Ischemic Colitis)",
      "page": 77
    }
  },
  {
    "caseId": "diarrhea-06",
    "category": "Diarrhea",
    "diagnosis": "Giardiasis",
    "vignette": "34M presents with about two weeks of greasy, foul-smelling diarrhea, bloating, excessive gas, cramps, and a few pounds of weight loss after a backcountry camping trip.",
    "prompt": "What is your management plan?",
    "actions": [
      "First-line anti-Giardia therapy (tinidazole/metronidazole; nitazoxanide alternative)",
      "Oral rehydration and electrolyte repletion",
      "Counsel alcohol avoidance with metronidazole/tinidazole (disulfiram-like reaction)",
      "Temporary dairy avoidance for transient lactose intolerance",
      "Exposure/public-health counseling — water treatment and hand hygiene"
    ],
    "unsafe": [
      "Empiric antibacterial therapy as if bacterial gastroenteritis"
    ],
    "disposition": "Outpatient",
    "consults": [],
    "idealAnswer": "Treat with anti-Giardia therapy: tinidazole 2 g single dose (or metronidazole 250 mg TID for 5–7 days; nitazoxanide is an alternative, especially in children). Provide oral rehydration and electrolyte repletion. Counsel strict alcohol avoidance during and for 3 days after metronidazole/tinidazole (disulfiram-like reaction). Advise temporary dairy avoidance for the transient post-Giardia lactose intolerance. Give exposure/public-health counseling: treat or boil backcountry water, good hand hygiene, and care around the toddler to prevent fecal-oral spread. Arrange follow-up; if symptoms persist, re-treat (consider an alternate agent for resistance) and reconsider celiac disease.",
    "manual": {
      "section": "Diarrhea (Parasitic / Giardiasis)",
      "page": 78
    }
  },
  {
    "caseId": "diarrhea-07",
    "category": "Diarrhea",
    "diagnosis": "Carcinoid syndrome",
    "vignette": "58F presents with several months of watery, non-bloody diarrhea and episodic facial flushing, with intermittent wheezing and palpitations.",
    "prompt": "What is your management plan?",
    "actions": [
      "Somatostatin analog (octreotide/lanreotide) first-line",
      "Octreotide cover to prevent/treat carcinoid crisis",
      "Locoregional/cytoreductive therapy for liver metastases (resection, embolization, PRRT)",
      "Oncology / endocrine surgery referral and staging",
      "Manage carcinoid heart disease (echo, consider valve surgery)",
      "Avoid known triggers (alcohol, large meals, amines)"
    ],
    "unsafe": [
      "Catecholamines / procedure without octreotide precipitating carcinoid crisis"
    ],
    "disposition": "Admit",
    "consults": [
      "Oncology",
      "Surgery"
    ],
    "idealAnswer": "Carcinoid syndrome: start a somatostatin analog (octreotide or long-acting lanreotide) to control flushing/diarrhea and slow tumor growth. Provide octreotide cover before any procedure, anesthesia, or with hypotension to prevent/treat carcinoid crisis (avoid catecholamines). Counsel to avoid triggers (alcohol, large meals). Address carcinoid heart disease (echo, cardiology, consider tricuspid valve surgery). For hepatic metastases, consider resection/cytoreduction, hepatic-artery embolization, or peptide receptor radionuclide therapy (PRRT). Supplement niacin to prevent pellagra. Refer to oncology and surgery; stage and follow with chromogranin A/5-HIAA.",
    "manual": {
      "section": "Diarrhea (Carcinoid Syndrome)",
      "page": 77
    }
  },
  {
    "caseId": "diarrhea-08",
    "category": "Diarrhea",
    "diagnosis": "Microscopic colitis",
    "vignette": "63F presents with several months of chronic, non-bloody watery diarrhea, including nocturnal stools, with mild weight loss and normal-appearing colonoscopy.",
    "prompt": "What is your management plan?",
    "actions": [
      "Budesonide first-line to induce remission",
      "Stop/swap culprit medications (NSAID, PPI, SSRI)",
      "Rehydration and electrolyte/potassium repletion",
      "Loperamide for mild symptoms",
      "Smoking cessation counseling",
      "GI follow-up with relapse/maintenance plan"
    ],
    "unsafe": [
      "Starting immunosuppression/antibiotics without histologic confirmation and exclusion of infection"
    ],
    "disposition": "Discharge with GI follow-up",
    "consults": [
      "Gastroenterology"
    ],
    "idealAnswer": "Microscopic colitis: oral budesonide (e.g., 9 mg daily, tapered) is first-line to induce remission. Discontinue or switch likely culprit drugs — NSAID, PPI, SSRI. Rehydrate and replete electrolytes (correct hypokalemia). Counsel on smoking cessation (smoking is a risk/relapse factor). Loperamide can help mild symptoms. Arrange GI follow-up with a plan for relapse (re-treat with budesonide; consider maintenance). Reassure that it is a benign, non-malignant condition while treating symptoms.",
    "manual": {
      "section": "Chronic Diarrhea (Microscopic Colitis)",
      "page": 79
    }
  },
  {
    "caseId": "dyspnea-01",
    "category": "Dyspnea",
    "diagnosis": "Acute decompensated heart failure (HFrEF)",
    "vignette": "68M with HTN, prior MI, and T2DM presents with one week of progressive dyspnea on exertion and bilateral leg swelling.",
    "prompt": "What is your management plan?",
    "actions": [
      "IV loop diuretic",
      "Strict I/O and daily weights",
      "Supplemental O2 / NIPPV",
      "Continue/optimize GDMT",
      "Identify and treat precipitant",
      "Sodium restriction"
    ],
    "unsafe": [
      "Newly starting beta blocker while decompensated",
      "CCB or NSAID in HFrEF"
    ],
    "disposition": "Admit (SDU if EF<25, NTproBNP≥2500, or arrhythmia)",
    "consults": [
      "Cardiology"
    ],
    "idealAnswer": "IV loop diuretic at 2–2.5× the home oral dose (furosemide/torsemide/bumetanide) with strict I/Os and daily weights; 2 g Na restriction; daily NT-proBNP/weights. Supplemental O2, NIPPV if pulmonary edema. Continue/optimize GDMT (do not newly start a beta blocker during decompensation). Identify and treat the precipitant. Avoid CCB/NSAIDs. DVT prophylaxis.",
    "manual": {
      "section": "Inpatient Heart Failure (ADHF)",
      "page": 26
    }
  },
  {
    "caseId": "dyspnea-02",
    "category": "Dyspnea",
    "diagnosis": "COPD exacerbation",
    "vignette": "64F with a long smoking history and known COPD presents with 3 days of worsening dyspnea, increased cough, and a change to purulent sputum.",
    "prompt": "What is your management plan?",
    "actions": [
      "Bronchodilators (albuterol + ipratropium)",
      "Systemic corticosteroids",
      "Antibiotics if increased sputum/purulence",
      "Controlled O2 to SpO2 88-92%",
      "NIV (BiPAP) if hypercapnic failure"
    ],
    "unsafe": [
      "Uncontrolled high-flow O2"
    ],
    "disposition": "Admit; ICU if respiratory failure",
    "consults": [],
    "idealAnswer": "COPD exacerbation: inhaled short-acting bronchodilators (albuterol + ipratropium), systemic corticosteroids (prednisone 40 mg × 5 days), antibiotics if increased dyspnea/sputum volume/purulence (e.g. azithromycin or doxycycline). Controlled O2 to SpO2 88–92%. NIV (BiPAP) for hypercapnic respiratory failure/acidosis. Treat triggers.",
    "manual": {
      "section": "COPD",
      "page": 51
    }
  },
  {
    "caseId": "dyspnea-03",
    "category": "Dyspnea",
    "diagnosis": "Community-acquired pneumonia",
    "vignette": "55M presents with 3 days of fever, productive cough, right-sided pleuritic chest pain, and increasing breathlessness.",
    "prompt": "What is your management plan?",
    "actions": [
      "Empiric antibiotics",
      "Broaden to vanc+cefepime if MRSA/PsA risk",
      "Cultures / MRSA swab to de-escalate",
      "Supplemental oxygen",
      "Duration ~5 days, IV to PO",
      "CURB-65/PSI severity triage"
    ],
    "unsafe": [
      "Daptomycin for pneumonia",
      "No atypical coverage"
    ],
    "disposition": "Admit (per CURB-65/PSI)",
    "consults": [],
    "idealAnswer": "Inpatient non-severe CAP: ceftriaxone PLUS azithromycin, OR levofloxacin monotherapy. If MRSA/Pseudomonas risk factors: vancomycin + cefepime (+ obtain cultures and MRSA nasal swab to de-escalate). Supplemental O2; consider steroids in severe CAP. Treat 5 days if clinically stable; convert IV→PO when improving.",
    "manual": {
      "section": "Community Acquired Pneumonia",
      "page": 116
    }
  },
  {
    "caseId": "dyspnea-04",
    "category": "Dyspnea",
    "diagnosis": "Pulmonary embolism",
    "vignette": "58F presents with sudden dyspnea and right-sided pleuritic chest pain, 5 days after a total hip replacement.",
    "prompt": "What is your management plan?",
    "actions": [
      "Anticoagulation (DOAC preferred)",
      "Risk-stratify PE severity",
      "Thrombolysis (tPA) if high-risk/unstable",
      "PERT consult",
      "Supportive care (O2, cautious IVF)",
      "Admit and monitor"
    ],
    "unsafe": [
      "IVC filter instead of anticoagulation"
    ],
    "disposition": "Admit; ICU if intermediate-high/high risk",
    "consults": [
      "PERT"
    ],
    "idealAnswer": "Risk-stratify the PE. Anticoagulate unless contraindicated – DOAC preferred. Systemic thrombolysis (tPA) and PERT/SHOCK activation for high-risk (hemodynamically unstable) PE. Supplemental O2 (HFNC preferred); cautious IVF; norepinephrine for shock. IVC filter only if anticoagulation contraindicated.",
    "manual": {
      "section": "VTE Management",
      "page": 55
    }
  },
  {
    "caseId": "dyspnea-05",
    "category": "Dyspnea",
    "diagnosis": "Asthma exacerbation",
    "vignette": "24F with a history of asthma presents with several hours of progressive wheeze, cough, and chest tightness after a viral cold.",
    "prompt": "What is your management plan?",
    "actions": [
      "Inhaled albuterol +/- ipratropium",
      "Systemic corticosteroids",
      "Oxygen to SpO2 >=92%",
      "IV magnesium if severe",
      "Escalate / ICU if impending failure",
      "Identify and avoid trigger"
    ],
    "unsafe": [
      "Discharging a still-severe exacerbation",
      "No systemic steroid"
    ],
    "disposition": "Admit; ICU if severe/impending failure",
    "consults": [],
    "idealAnswer": "Asthma exacerbation: inhaled albuterol ± ipratropium q20min ×3, systemic corticosteroids (prednisone 40–60 mg × 5–7 d), titrate O2 to ≥92%. For severe/impending failure: IV magnesium 2 g, continuous nebs, methylprednisolone 60–125 mg IV q6h, ICU transfer; mechanical ventilation with permissive hypercapnia if needed.",
    "manual": {
      "section": "PFTs & Asthma",
      "page": 50
    }
  },
  {
    "caseId": "dyspnea-06",
    "category": "Dyspnea",
    "diagnosis": "Malignant pleural effusion",
    "vignette": "67M, former heavy smoker, presents with several weeks of progressive exertional dyspnea, a dry cough, and unintentional weight loss.",
    "prompt": "What is your management plan?",
    "actions": [
      "Therapeutic thoracentesis for relief",
      "Pleural fluid analysis (cytology, Light's criteria)",
      "Indwelling pleural catheter or pleurodesis",
      "Treat underlying malignancy / oncology referral",
      "Interventional pulmonary consult"
    ],
    "unsafe": [
      "Misclassifying as transudate / diuresis only"
    ],
    "disposition": "Depends on symptom burden",
    "consults": [
      "Interventional Pulmonary",
      "Oncology"
    ],
    "idealAnswer": "Malignant pleural effusion: therapeutic (large-volume) thoracentesis for symptomatic relief, with pleural fluid analysis (cytology, Light's criteria – exudate). For recurrent symptomatic effusion, definitive management with indwelling pleural catheter or chemical pleurodesis. Treat the underlying malignancy; involve oncology and interventional pulmonary.",
    "manual": {
      "section": "Thoracentesis & Pleural Fluid",
      "page": 261
    }
  },
  {
    "caseId": "dyspnea-07",
    "category": "Dyspnea",
    "diagnosis": "Anaphylaxis",
    "vignette": "32F with sudden difficulty breathing, throat tightness, and a spreading hives rash minutes after eating at a restaurant.",
    "prompt": "What is your management plan?",
    "actions": [
      "IM epinephrine into the anterolateral thigh (first-line), repeat PRN",
      "Supine with legs elevated + high-flow oxygen",
      "Aggressive IV crystalloid bolus for hypotension",
      "Protect airway / prepare for early intubation",
      "H1/H2 antihistamines and corticosteroids as second-line adjuncts",
      "Epinephrine infusion / glucagon if refractory"
    ],
    "unsafe": [
      "Antihistamines/steroids instead of or before epinephrine",
      "Discharging without an epinephrine auto-injector / observation"
    ],
    "disposition": "Admit/observe; ICU if refractory shock or airway compromise",
    "consults": [
      "Allergy/Immunology"
    ],
    "idealAnswer": "Give IM epinephrine 0.3-0.5 mg of 1:1000 into the anterolateral thigh immediately and repeat every 5-15 min as needed — this is first-line and the only treatment that reverses the reaction. Place supine with legs elevated, give high-flow oxygen, and bolus IV crystalloid for hypotension. Protect the airway and prepare for early intubation given stridor and angioedema. Add H1/H2 antihistamines and corticosteroids as second-line adjuncts only. For refractory shock start an epinephrine infusion (consider glucagon if on a beta-blocker). Observe for a biphasic reaction (typically up to 4-6+ h), then discharge with an epinephrine auto-injector prescription, allergy/immunology referral, and trigger-avoidance counseling.",
    "manual": {
      "section": "Allergy & Anaphylaxis",
      "page": 62
    }
  },
  {
    "caseId": "dyspnea-08",
    "category": "Dyspnea",
    "diagnosis": "Methemoglobinemia",
    "vignette": "34M presents with dyspnea, headache, and dusky blue lips and fingertips a few hours after a dental procedure with topical numbing spray.",
    "prompt": "What is your management plan?",
    "actions": [
      "Methylene blue 1–2 mg/kg IV for symptomatic/severe methemoglobinemia",
      "Stop / remove the offending oxidizing agent (benzocaine)",
      "Confirm/consider G6PD status before methylene blue",
      "Supportive care (supplemental O2, monitoring)",
      "Toxicology / Poison Control consult and admit"
    ],
    "unsafe": [
      "Giving methylene blue to a G6PD-deficient patient"
    ],
    "disposition": "Admit and monitor methemoglobin levels",
    "consults": [
      "Toxicology / Poison Control"
    ],
    "idealAnswer": "Stop and remove the offending oxidizing agent (benzocaine). Give methylene blue 1–2 mg/kg IV over 5 minutes for symptomatic methemoglobinemia or level >20–30%; repeat once if needed. Provide supplemental oxygen and supportive care. Check G6PD status — avoid methylene blue if G6PD-deficient (risk of hemolysis); use ascorbic acid, exchange transfusion, or hyperbaric oxygen as alternatives. Consult toxicology/Poison Control, admit and monitor methemoglobin levels.",
    "manual": {
      "section": "Toxicology (Methemoglobinemia & Dyshemoglobinemias)",
      "page": 88
    }
  },
  {
    "caseId": "dyspnea-09",
    "category": "Dyspnea",
    "diagnosis": "Spontaneous pneumothorax",
    "vignette": "22M, tall and thin, presents with the abrupt onset of right-sided pleuritic chest pain and breathlessness while at rest.",
    "prompt": "What is your management plan?",
    "actions": [
      "Size/symptom-based intervention (observation vs aspiration/chest tube)",
      "High-flow supplemental oxygen",
      "Analgesia",
      "Admit/observe with serial imaging",
      "Smoking cessation counseling",
      "Thoracic surgery consult / pleurodesis discussion for recurrence"
    ],
    "unsafe": [
      "Discharging a large symptomatic pneumothorax without intervention or follow-up",
      "Failing to decompress a tension pneumothorax while awaiting imaging"
    ],
    "disposition": "Admit; immediate decompression and ICU if tension physiology develops",
    "consults": [
      "Thoracic surgery"
    ],
    "idealAnswer": "Primary spontaneous pneumothorax: give high-flow supplemental oxygen (hastens pleural air reabsorption); choose intervention by size/symptoms — observe a small, asymptomatic pneumothorax with repeat imaging, or perform needle aspiration or place a small-bore chest tube/pigtail catheter for a large or symptomatic one. Provide analgesia, admit/observe with serial CXR, and counsel on smoking cessation. Consult thoracic surgery and discuss pleurodesis/VATS for recurrence or a persistent air leak. If tension physiology develops, perform immediate needle decompression followed by chest tube.",
    "manual": {
      "section": "Pulmonary (Pneumothorax)",
      "page": 58
    }
  },
  {
    "caseId": "fever-01",
    "category": "Fever",
    "diagnosis": "Pyelonephritis",
    "vignette": "35F presents with 2 days of fever, chills, right flank pain, and urinary frequency and burning, with nausea and vomiting.",
    "prompt": "What is your management plan?",
    "actions": [
      "Urine and blood cultures",
      "Empiric IV antibiotics",
      "IV fluids",
      "Admit if septic/complicated",
      "De-escalate by culture; 7-14 day course",
      "Imaging if obstruction/abscess suspected"
    ],
    "unsafe": [
      "Nitrofurantoin/fosfomycin for pyelonephritis"
    ],
    "disposition": "Admit if complicated; else treat outpatient",
    "consults": [],
    "idealAnswer": "Obtain blood and urine cultures, then empiric IV antibiotics – ceftriaxone (cover resistant GNR/enterococcus if complicated or prior resistance). IV fluids. Admit if unable to tolerate PO, septic, pregnant, or complicated; otherwise a fluoroquinolone may treat select outpatients. De-escalate per culture/susceptibility; treat 7–14 days. Image (CT) if obstruction/abscess suspected or not improving.",
    "manual": {
      "section": "Empiric Antibiotics & Antibiogram (Pyelonephritis)",
      "page": 113
    }
  },
  {
    "caseId": "fever-02",
    "category": "Fever",
    "diagnosis": "Cellulitis",
    "vignette": "60M presents with 2 days of an expanding red, warm, painful area on the lower left leg, with fever.",
    "prompt": "What is your management plan?",
    "actions": [
      "Antibiotics appropriate to purulence",
      "Incision & drainage of abscess",
      "Mark borders and elevate limb",
      "Treat predisposing factor (tinea/edema)",
      "Appropriate duration (~5 days)"
    ],
    "unsafe": [
      "Missing an abscess needing drainage"
    ],
    "disposition": "Outpatient; admit if systemic toxicity",
    "consults": [],
    "idealAnswer": "Nonpurulent cellulitis: cover streptococci/MSSA – cephalexin or cefazolin (IV if systemic). Purulent cellulitis/abscess: incision & drainage PLUS MRSA coverage (TMP-SMX or doxycycline PO; vancomycin IV if severe). Elevate and mark the borders; treat the predisposing factor (tinea, edema). Antibiotics for ~5 days. Blood cultures only if systemic toxicity/immunocompromise.",
    "manual": {
      "section": "Skin & Soft Tissue Infections (Cellulitis)",
      "page": 120
    }
  },
  {
    "caseId": "fever-03",
    "category": "Fever",
    "diagnosis": "Infective endocarditis",
    "vignette": "45M presents with 3 weeks of intermittent fevers, night sweats, fatigue, and weight loss; a new heart murmur is noted.",
    "prompt": "What is your management plan?",
    "actions": [
      "Multiple blood cultures before antibiotics",
      "Empiric vancomycin + ceftriaxone",
      "Echocardiography (TTE then TEE)",
      "Early ID consult",
      "Assess surgical indications",
      "Evaluate for embolic foci"
    ],
    "unsafe": [
      "Antibiotics before cultures (stable patient)"
    ],
    "disposition": "Admit",
    "consults": [
      "Infectious Disease",
      "Cardiology / Cardiac Surgery"
    ],
    "idealAnswer": "Obtain ≥3 sets of blood cultures from separate sites before antibiotics. Empiric therapy for native-valve IE: vancomycin + ceftriaxone (prosthetic: add gentamicin + rifampin – ask ID). Echocardiography (TTE then TEE). Early Infectious Disease consult improves mortality. Evaluate for embolic/metastatic foci and indications for surgery (HF, abscess, persistent bacteremia, large vegetation).",
    "manual": {
      "section": "Empiric Antibiotics & Antibiogram (Endocarditis)",
      "page": 113
    }
  },
  {
    "caseId": "fever-04",
    "category": "Fever",
    "diagnosis": "Community-acquired pneumonia",
    "vignette": "74F is brought in with 3 days of fever, productive cough, and breathlessness, and new confusion noted by family today.",
    "prompt": "What is your management plan?",
    "actions": [
      "Empiric antibiotics",
      "Broaden to vanc+cefepime if MRSA/PsA risk",
      "Cultures / MRSA swab to de-escalate",
      "Supplemental oxygen",
      "CURB-65/PSI triage",
      "Duration ~5 days IV to PO"
    ],
    "unsafe": [
      "Daptomycin for pneumonia",
      "No atypical coverage"
    ],
    "disposition": "Admit (per CURB-65/PSI)",
    "consults": [],
    "idealAnswer": "Inpatient non-severe CAP: ceftriaxone PLUS azithromycin, OR levofloxacin monotherapy. MRSA/Pseudomonas risk: vancomycin + cefepime, with cultures + MRSA swab to de-escalate. Supplemental O2; CURB-65/PSI to triage; consider steroids in severe CAP. Treat ~5 days if stable; convert IV→PO when improving.",
    "manual": {
      "section": "Community Acquired Pneumonia",
      "page": 116
    }
  },
  {
    "caseId": "fever-05",
    "category": "Fever",
    "diagnosis": "Bacterial meningitis",
    "vignette": "22M college student presents with one day of high fever, severe headache, neck stiffness, photophobia, and new lethargy.",
    "prompt": "What is your management plan? (Timing is critical.)",
    "actions": [
      "Empiric vancomycin + ceftriaxone immediately",
      "Dexamethasone with/before first dose",
      "Blood cultures then LP without delaying antibiotics",
      "Add ampicillin if Listeria risk",
      "Add acyclovir if HSV possible",
      "Droplet precautions / ID consult"
    ],
    "unsafe": [
      "Delaying antibiotics for imaging/LP"
    ],
    "disposition": "Admit; ICU monitoring",
    "consults": [
      "Infectious Disease"
    ],
    "idealAnswer": "Bacterial meningitis is an emergency: do not delay antibiotics for the LP/CT. Give dexamethasone WITH/just before the first antibiotic dose, then empiric vancomycin + ceftriaxone; ADD ampicillin if >50/immunocompromised/alcohol (Listeria); ADD acyclovir if HSV encephalitis possible. Blood cultures, then LP (CT first only if focal deficit/papilledema/immunocompromised). Droplet precautions; ID consult.",
    "manual": {
      "section": "Meningitis & Encephalitis",
      "page": 123
    }
  },
  {
    "caseId": "fever-06",
    "category": "Fever",
    "diagnosis": "Malaria in a returning traveler",
    "vignette": "34M presents with 5 days of cyclical fevers, rigors, headache, and myalgias that began about a week after returning from West Africa.",
    "prompt": "What is your management plan?",
    "actions": [
      "Confirm species/parasitemia and assess severity first",
      "Artemisinin-based combination therapy for uncomplicated falciparum",
      "IV artesunate for severe malaria",
      "Admit and monitor parasitemia and for complications",
      "Infectious Disease consult and public health notification",
      "Supportive care/antipyretics and follow QTc on therapy"
    ],
    "unsafe": [
      "Chloroquine monotherapy for falciparum from a resistant region"
    ],
    "disposition": "Admit",
    "consults": [
      "Infectious Disease"
    ],
    "idealAnswer": "Confirm species and quantify parasitemia and assess severity first. Uncomplicated P. falciparum: oral artemisinin-based combination therapy (ACT — artemether-lumefantrine, or atovaquone-proguanil). Severe malaria (parasitemia ≥5%, impaired consciousness, shock, ARDS, AKI, acidosis, hypoglycemia, or significant bleeding): IV artesunate, admit to a monitored/ICU setting. Admit and follow serial parasitemia and complications; treat hypoglycemia; supportive care and antipyretics; monitor QTc on QT-prolonging agents. Infectious Disease consult and notify public health. Do NOT use chloroquine monotherapy for falciparum from a resistant region.",
    "manual": {
      "section": "Approach to Fever in the Returning Traveler (Malaria)",
      "page": 119
    }
  },
  {
    "caseId": "fever-07",
    "category": "Fever",
    "diagnosis": "Toxic shock syndrome",
    "vignette": "23F presents with about a day of high fever, a diffuse sunburn-like rash, vomiting/diarrhea, myalgias, and lightheadedness, now hypotensive.",
    "prompt": "What is your management plan?",
    "actions": [
      "Source control (remove tampon / debride or drain focus)",
      "Empiric antibiotics including a toxin-suppressing agent (clindamycin/linezolid) plus vancomycin",
      "Aggressive fluids and vasopressors for shock",
      "ICU admission with monitoring for multi-organ failure/DIC",
      "Blood cultures before antibiotics if no delay"
    ],
    "unsafe": [
      "Failing to obtain source control",
      "Beta-lactam alone without a toxin-suppressing agent"
    ],
    "disposition": "Admit to ICU",
    "consults": [
      "Infectious Disease",
      "Critical Care",
      "Gynecology"
    ],
    "idealAnswer": "Resuscitate: large-volume IV crystalloid and norepinephrine for fluid-refractory distributive shock; ICU admission. Achieve source control immediately — remove the retained tampon and debride/drain any infectious focus. Empiric antibiotics: vancomycin (cover MRSA/strep) PLUS clindamycin or linezolid to suppress toxin production (add a beta-lactam if streptococcal TSS). Consider IVIG in severe/refractory cases. Draw cultures before antibiotics if it does not delay care. Monitor and support for multi-organ failure and DIC. Counsel to avoid high-absorbency tampons.",
    "manual": {
      "section": "Sepsis & Toxin-Mediated Syndromes (Toxic Shock Syndrome)",
      "page": 118
    }
  },
  {
    "caseId": "fever-08",
    "category": "Fever",
    "diagnosis": "Septic arthritis",
    "vignette": "58M presents with 2 days of a rapidly swelling, hot, exquisitely painful right knee and fever, now unable to bear weight.",
    "prompt": "What is your management plan?",
    "actions": [
      "Urgent joint drainage (surgical washout or serial aspiration)",
      "Empiric IV antibiotics with MRSA coverage (vancomycin) after cultures",
      "Admit and consult orthopedics",
      "Add gram-negative coverage if at risk or per Gram stain",
      "Narrow by culture and complete ~3-4 week course",
      "Analgesia and treat sepsis/source"
    ],
    "unsafe": [
      "Relying on antibiotics alone without joint drainage"
    ],
    "disposition": "Admit",
    "consults": [
      "Orthopedic Surgery",
      "Rheumatology"
    ],
    "idealAnswer": "Admit. Urgent joint drainage (orthopedic surgical washout or serial therapeutic aspiration) — antibiotics alone are inadequate. Empiric IV antibiotics started AFTER blood and synovial cultures: vancomycin for staph/MRSA coverage; add gram-negative coverage (ceftriaxone, or cefepime/antipseudomonal if immunocompromised/at risk) guided by Gram stain. Consult orthopedics. Narrow therapy once cultures return; typical total course ~3-4 weeks. Analgesia, source control, and treat any associated sepsis. Do not anchor on a gout flare.",
    "manual": {
      "section": "Bone & Joint Infections (Septic Arthritis)",
      "page": 124
    }
  },
  {
    "caseId": "liver-01",
    "category": "Abnormal Liver Enzymes",
    "diagnosis": "Acute viral hepatitis",
    "vignette": "28M presents with a week of fatigue, nausea, right upper quadrant discomfort, dark urine, and now jaundice, following recent travel.",
    "prompt": "What is your management plan?",
    "actions": [
      "Supportive care and avoid hepatotoxins",
      "Confirm type with serologies",
      "Monitor INR and mental status for ALF",
      "Hepatology referral if coagulopathy/encephalopathy",
      "Counsel on transmission and vaccinate contacts"
    ],
    "unsafe": [
      "Continued hepatotoxins",
      "Missing acute liver failure"
    ],
    "disposition": "Usually outpatient; admit if severe/ALF",
    "consults": [],
    "idealAnswer": "Acute viral hepatitis (A/B) is usually supportive: hydration, antiemetics, rest, and avoid hepatotoxins (alcohol, acetaminophen dosing caution). Confirm the type with serologies (anti-HAV IgM; HBsAg/anti-HBc IgM). Monitor INR and mental status for acute liver failure – escalate to hepatology/transplant if coagulopathy or encephalopathy. Counsel on transmission; vaccinate contacts; report to public health.",
    "manual": {
      "section": "Viral Hepatitis",
      "page": 90
    }
  },
  {
    "caseId": "liver-02",
    "category": "Abnormal Liver Enzymes",
    "diagnosis": "Alcoholic hepatitis",
    "vignette": "50M with heavy alcohol use presents with 2 weeks of jaundice, right upper quadrant tenderness, anorexia, and low-grade fever.",
    "prompt": "What is your management plan?",
    "actions": [
      "Alcohol cessation and supportive nutrition",
      "Thiamine/vitamins and manage withdrawal",
      "Corticosteroids if severe (after excluding infection/bleed)",
      "Risk-stratify (discriminant function/MELD)",
      "Screen for and treat infection",
      "Hepatology consult"
    ],
    "unsafe": [
      "Steroids with untreated infection or GI bleed"
    ],
    "disposition": "Admit",
    "consults": [
      "Hepatology"
    ],
    "idealAnswer": "Alcohol cessation and supportive care: nutrition (high protein/calorie), thiamine and vitamins, treat the alcohol withdrawal, and manage volume/electrolytes. Calculate discriminant function/MELD; if severe (DF ≥32), corticosteroids (prednisolone) after excluding active infection/GI bleed, reassess with Lille score. Screen for and treat infection. Hepatology consult; avoid further hepatotoxins.",
    "manual": {
      "section": "Acute Liver Injury & Failure (Alcoholic Hepatitis)",
      "page": 89
    }
  },
  {
    "caseId": "liver-03",
    "category": "Abnormal Liver Enzymes",
    "diagnosis": "Acetaminophen-induced liver injury",
    "vignette": "25F presents with nausea, vomiting, and right upper quadrant pain; she has been taking large amounts of an over-the-counter pain reliever for several days.",
    "prompt": "What is your management plan?",
    "actions": [
      "N-acetylcysteine (give empirically)",
      "Monitor INR/pH/Cr/lactate and mental status (King's College)",
      "Activated charcoal if ingestion <4 hours",
      "Rumack-Matthew nomogram for timed level",
      "Hepatology/transplant referral for ALF"
    ],
    "unsafe": [
      "Delaying NAC"
    ],
    "disposition": "Admit; ICU if ALF",
    "consults": [
      "Hepatology",
      "Toxicology / Poison Control"
    ],
    "idealAnswer": "N-acetylcysteine is the antidote – give without delay for toxic ingestion/rising level or deranged transaminases (do not wait for nomogram if presentation is late or amount large). Activated charcoal if ingestion <4 h. Use the Rumack-Matthew nomogram for timed single ingestions. Monitor INR, pH, creatinine, lactate, and mental status; apply King's College criteria – contact hepatology/transplant for acute liver failure.",
    "manual": {
      "section": "Acute Liver Injury & Failure (Acetaminophen)",
      "page": 89
    }
  },
  {
    "caseId": "liver-04",
    "category": "Abnormal Liver Enzymes",
    "diagnosis": "Choledocholithiasis",
    "vignette": "55F presents with colicky right upper quadrant pain, jaundice, dark urine, and pale stools over a few days.",
    "prompt": "What is your management plan?",
    "actions": [
      "NPO and IV fluids",
      "Broad-spectrum antibiotics",
      "Urgent ERCP for decompression",
      "Percutaneous drainage if ERCP not feasible",
      "Interval cholecystectomy",
      "GI / surgery consult"
    ],
    "unsafe": [
      "Antibiotics alone without decompression"
    ],
    "disposition": "Admit",
    "consults": [
      "Gastroenterology",
      "Surgery"
    ],
    "idealAnswer": "Choledocholithiasis with cholangitis: NPO, IV fluids, and broad-spectrum antibiotics (piperacillin-tazobactam, or ceftriaxone + metronidazole). Biliary decompression by urgent ERCP with stone extraction – within 24–48 h if severe/septic or failing antibiotics; percutaneous drainage if ERCP not feasible. Interval cholecystectomy for gallstones. GI/surgery consult.",
    "manual": {
      "section": "Biliary Disease (Choledocholithiasis/Cholangitis)",
      "page": 88
    }
  },
  {
    "caseId": "liver-05",
    "category": "Abnormal Liver Enzymes",
    "diagnosis": "NAFLD / NASH",
    "vignette": "48M with obesity and type 2 diabetes is referred for mildly elevated liver enzymes found on routine screening; he feels well.",
    "prompt": "What is your management plan?",
    "actions": [
      "Lifestyle weight loss (diet and exercise)",
      "Manage metabolic comorbidities (DM/lipids/HTN)",
      "Alcohol avoidance",
      "Stage fibrosis (FIB-4) and refer if advanced"
    ],
    "unsafe": [
      "Withholding statin unnecessarily"
    ],
    "disposition": "Outpatient",
    "consults": [],
    "idealAnswer": "Lifestyle-based weight loss is first-line: 7–10% body-weight loss reduces steatohepatitis/fibrosis; diet and exercise. Aggressively manage metabolic comorbidities – diabetes, dyslipidemia, hypertension; statins are safe. Avoid alcohol. Stage fibrosis (FIB-4) and refer to hepatology if advanced. Consider GLP-1 agonist/metabolic therapy and vaccinate (HAV/HBV).",
    "manual": {
      "section": "MASLD / NAFLD",
      "page": 92
    }
  },
  {
    "caseId": "liver-06",
    "category": "Abnormal Liver Enzymes",
    "diagnosis": "Wilson disease",
    "vignette": "22M presents with several months of a worsening hand tremor, slurred speech, mood changes, and incidentally noted abnormal liver enzymes.",
    "prompt": "What is your management plan?",
    "actions": [
      "Copper chelation (D-penicillamine or trientine)",
      "Oral zinc and low-copper diet",
      "Hepatology referral, ATP7B genetic testing, screen first-degree relatives",
      "Monitor for neurologic worsening on chelation and avoid hepatotoxins",
      "Neurology co-management"
    ],
    "unsafe": [
      "Missing/failing to treat a fulminant Wilsonian crisis",
      "Leaving copper overload untreated / treating only the psychiatric symptoms"
    ],
    "disposition": "Outpatient if stable; admit and urgent transplant evaluation if fulminant failure or decompensation",
    "consults": [
      "Hepatology",
      "Neurology"
    ],
    "idealAnswer": "Wilson disease: start copper-removal therapy — a chelator (D-penicillamine, with pyridoxine; or trientine, often better tolerated) and/or oral zinc to block intestinal copper absorption; counsel a low-copper diet (avoid shellfish, liver, nuts, chocolate). Refer to hepatology; send ATP7B genetic testing and screen first-degree relatives (the sibling). Monitor closely for paradoxical neurologic worsening when starting a chelator, follow LFTs/copper studies, and avoid hepatotoxins. Co-manage with neurology. For a fulminant Wilsonian crisis or decompensated cirrhosis, urgent liver transplant evaluation (transplant is curative as it corrects the metabolic defect).",
    "manual": {
      "section": "Cirrhosis & Inherited Liver Disease (Wilson Disease)",
      "page": 95
    }
  },
  {
    "caseId": "liver-07",
    "category": "Abnormal Liver Enzymes",
    "diagnosis": "Budd-Chiari syndrome",
    "vignette": "32F on combined oral contraceptives presents with 3 weeks of progressive abdominal distension, right upper quadrant pain, and leg swelling.",
    "prompt": "What is your management plan?",
    "actions": [
      "Anticoagulation once bleeding excluded",
      "Identify and treat the underlying prothrombotic disorder / MPN",
      "Manage ascites (sodium restriction, diuretics, therapeutic paracentesis)",
      "Stepwise escalation (angioplasty/stent or TIPS; transplant for fulminant failure)",
      "Hepatology +/- interventional radiology consult",
      "Stop the estrogen-containing oral contraceptive"
    ],
    "unsafe": [
      "Anticoagulating with active variceal/GI bleed without addressing it"
    ],
    "disposition": "Admit",
    "consults": [
      "Hepatology",
      "Interventional Radiology",
      "Hematology"
    ],
    "idealAnswer": "Anticoagulation is the cornerstone: start heparin (transition to long-term anticoagulation) once active bleeding/varices are excluded. Identify and treat the underlying thrombophilia/myeloproliferative neoplasm with hematology. Manage ascites with sodium restriction, diuretics, and therapeutic paracentesis as needed. Escalate in a stepwise fashion: angioplasty/stenting of a focal stenosis or TIPS for refractory disease, and liver transplant for fulminant hepatic failure. Stop the estrogen-containing oral contraceptive. Hepatology and interventional radiology consults; admit.",
    "manual": {
      "section": "Acute Liver Injury & Failure (Budd-Chiari / Hepatic Venous Outflow Obstruction)",
      "page": 92
    }
  },
  {
    "caseId": "liver-08",
    "category": "Abnormal Liver Enzymes",
    "diagnosis": "Ischemic hepatitis (shock liver)",
    "vignette": "68M with heart failure, admitted after a witnessed cardiac arrest and prolonged hypotension, now with markedly elevated transaminases noted on labs 24 hours later.",
    "prompt": "What is your management plan?",
    "actions": [
      "Restore hepatic perfusion by treating the underlying cardiogenic shock/low-output state",
      "Supportive care with serial LFT/INR/lactate monitoring",
      "Avoid/adjust hepatotoxic and renally-cleared drugs; hold nephrotoxins",
      "Treat precipitants and decompensated heart failure with cardiology input",
      "Monitor for and manage AKI and hypoglycemia",
      "Hepatology consult"
    ],
    "unsafe": [
      "Fluids/pressors without addressing the cardiac low-output cause (worsening congestion)"
    ],
    "disposition": "Admit",
    "consults": [
      "Cardiology",
      "Hepatology"
    ],
    "idealAnswer": "The liver injury is a marker of hypoperfusion — the priority is to restore hepatic perfusion by treating the underlying cardiogenic shock/low-output heart failure (inotropic/afterload support as appropriate, optimize cardiac output, correct hypoxemia and anemia) with cardiology. Provide supportive care with serial LFTs, INR, and lactate, expecting a rapid downtrend. Avoid and dose-adjust hepatotoxic/renally-cleared drugs, hold nephrotoxins, and monitor for AKI and hypoglycemia. Hepatology consult; avoid empiric steroids and reserve NAC for cases where acetaminophen has not been excluded.",
    "manual": {
      "section": "Acute Liver Injury & Failure (Ischemic Hepatitis)",
      "page": 91
    }
  },
  {
    "caseId": "syncope-01",
    "category": "Syncope",
    "diagnosis": "Vasovagal syncope",
    "vignette": "28F presents after a brief loss of consciousness while standing in a hot, crowded room, preceded by nausea and lightheadedness.",
    "prompt": "What is your management plan?",
    "actions": [
      "Reassurance and patient education",
      "Trigger avoidance counseling",
      "Physical counter-pressure maneuvers",
      "Confirm low-risk features and normal ECG",
      "Hydration and salt intake"
    ],
    "unsafe": [
      "Missing a high-risk feature"
    ],
    "disposition": "Discharge if low-risk",
    "consults": [],
    "idealAnswer": "Reassurance and education – benign prognosis. Counsel on avoiding triggers (prolonged standing, heat, dehydration), recognizing prodrome, and physical counter-pressure maneuvers (leg crossing, hand grip). Ensure hydration and salt intake. No cardiac admission if low-risk history and normal ECG. Reserve medications for recurrent refractory cases.",
    "manual": {
      "section": "Syncope (Vasovagal)",
      "page": 37
    }
  },
  {
    "caseId": "syncope-02",
    "category": "Syncope",
    "diagnosis": "Orthostatic hypotension",
    "vignette": "75M presents after feeling lightheaded and briefly passing out when standing up from a chair; he has several blood-pressure medications and has been eating and drinking poorly.",
    "prompt": "What is your management plan?",
    "actions": [
      "Identify and treat cause / volume repletion",
      "Review and adjust offending medications",
      "Non-pharmacologic measures (compression, slow changes)",
      "Liberalize salt and fluids",
      "Midodrine/fludrocortisone if refractory"
    ],
    "unsafe": [
      "Missing hypovolemia / occult bleed"
    ],
    "disposition": "Per cause",
    "consults": [],
    "idealAnswer": "Review and remove/reduce offending medications (antihypertensives, diuretics, alpha-blockers). Volume repletion; liberalize salt and fluids. Non-pharmacologic measures – slow position changes, compression stockings, physical counter-pressure. Treat the underlying cause (dehydration, bleeding, autonomic failure). Add midodrine or fludrocortisone only if refractory.",
    "manual": {
      "section": "Syncope (Orthostatic Hypotension)",
      "page": 37
    }
  },
  {
    "caseId": "syncope-03",
    "category": "Syncope",
    "diagnosis": "Complete heart block",
    "vignette": "78M presents after a sudden loss of consciousness with NO warning, on a background of recurrent near-fainting and fatigue.",
    "prompt": "What is your management plan?",
    "actions": [
      "Continuous telemetry monitoring",
      "Pacing (transcutaneous/transvenous)",
      "Cardiology consult for permanent pacemaker",
      "Atropine as temporizing measure",
      "Hold AV-nodal blocking agents",
      "Treat reversible causes"
    ],
    "unsafe": [
      "Discharging complete heart block"
    ],
    "disposition": "Admit; monitored bed",
    "consults": [
      "Cardiology / EP"
    ],
    "idealAnswer": "Telemetry and continuous monitoring. For symptomatic/unstable bradycardia: atropine, then transcutaneous pacing, and a temporary transvenous pacer as a bridge. Hold AV-nodal blocking agents. Cardiology consult for permanent pacemaker (definitive therapy). Treat reversible causes (ischemia, electrolytes, drug toxicity).",
    "manual": {
      "section": "Syncope (Complete Heart Block)",
      "page": 37
    }
  },
  {
    "caseId": "syncope-04",
    "category": "Syncope",
    "diagnosis": "Aortic stenosis",
    "vignette": "72M presents after passing out while climbing stairs; he also reports months of exertional breathlessness and chest tightness.",
    "prompt": "What is your management plan?",
    "actions": [
      "Refer for aortic valve replacement (AVR/TAVI)",
      "Echocardiogram to confirm severity and EF",
      "Cardiology / structural consult",
      "Avoid aggressive preload reduction (nitrates/diuretics)",
      "Cautious BP / volume management"
    ],
    "unsafe": [
      "Vasodilators/diuretics causing hypotension in severe AS"
    ],
    "disposition": "Admit; expedite AVR work-up",
    "consults": [
      "Cardiology / Cardiac Surgery"
    ],
    "idealAnswer": "Symptomatic severe AS (syncope) is a surgical disease – refer for aortic valve replacement (SAVR vs TAVI by surgical risk). Echocardiography to confirm severity and EF. Cardiology/structural consult. Manage hypertension cautiously (start low, go slow) and keep within a narrow volume range – avoid aggressive preload reduction (nitrates/diuretics) and vasodilators. Avoid hypotension.",
    "manual": {
      "section": "Valvular Heart Disease (Aortic Stenosis)",
      "page": 32
    }
  },
  {
    "caseId": "syncope-05",
    "category": "Syncope",
    "diagnosis": "Pulmonary embolism",
    "vignette": "60F presents after a syncopal episode and now has persistent breathlessness and tachycardia; she has been largely immobile after a recent injury.",
    "prompt": "What is your management plan?",
    "actions": [
      "Anticoagulation (DOAC preferred)",
      "Risk-stratify PE severity",
      "Thrombolysis (tPA) if high-risk/unstable",
      "PERT consult",
      "Supportive care (O2, IVF, norepinephrine)",
      "Admit/monitor"
    ],
    "unsafe": [
      "Discharging a syncopal PE"
    ],
    "disposition": "Admit; ICU/step-down",
    "consults": [
      "PERT"
    ],
    "idealAnswer": "PE causing syncope implies at least intermediate-high risk. Anticoagulate unless contraindicated – DOAC preferred. Risk-stratify; activate PERT. Systemic thrombolysis (tPA) for high-risk/hemodynamically unstable PE. Supportive O2, cautious IVF, norepinephrine for shock. IVC filter only if anticoagulation contraindicated.",
    "manual": {
      "section": "VTE Management",
      "page": 55
    }
  },
  {
    "caseId": "syncope-06",
    "category": "Syncope",
    "diagnosis": "Syncope from occult GI bleed",
    "vignette": "70M presents after fainting at home; he has felt increasingly tired and lightheaded and takes daily NSAIDs for joint pain.",
    "prompt": "What is your management plan?",
    "actions": [
      "Resuscitate (2 large-bore IVs, crystalloid, T&S)",
      "Transfuse to restrictive threshold (Hgb>7)",
      "GI consult for endoscopy",
      "IV PPI",
      "Correct coagulopathy / hold anticoagulants",
      "Serial hemoglobin monitoring"
    ],
    "unsafe": [
      "Missing the occult bleed / discharging"
    ],
    "disposition": "Admit; ICU if unstable",
    "consults": [
      "Gastroenterology"
    ],
    "idealAnswer": "Syncope from occult GI bleed: resuscitate – 2 large-bore IVs, isotonic crystalloid, type & screen, transfuse pRBCs to a restrictive threshold (Hgb >7, or >8 if CAD). NPO. IV PPI. GI consult for endoscopy (EGD; colonoscopy if lower source) to localize and treat. Correct coagulopathy; hold/reverse anticoagulants. Serial Hgb (lags 24–72 h).",
    "manual": {
      "section": "Upper GI Bleeding (occult)",
      "page": 70
    }
  },
  {
    "caseId": "syncope-07",
    "category": "Syncope",
    "diagnosis": "Long QT syndrome with torsades de pointes",
    "vignette": "24F presents after a brief loss of consciousness triggered by a sudden loud alarm, with a family history of unexplained sudden death and recent palpitations.",
    "prompt": "What is your management plan?",
    "actions": [
      "IV magnesium sulfate for torsades",
      "Stop all QT-prolonging drugs",
      "Aggressively replete potassium and magnesium",
      "Continuous telemetry on a monitored bed",
      "Increase heart rate (isoproterenol / overdrive pacing) for pause-dependent torsades",
      "Cardiology/EP consult for beta-blocker and ICD evaluation"
    ],
    "unsafe": [
      "Giving a QT-prolonging antiarrhythmic (amiodarone/sotalol/procainamide)"
    ],
    "disposition": "Admit; monitored bed",
    "consults": [
      "Cardiology / EP"
    ],
    "idealAnswer": "Give IV magnesium sulfate (first-line for torsades, even if the magnesium level is normal). Immediately stop all QT-prolonging drugs and aggressively replete potassium and magnesium. Keep on continuous telemetry in a monitored bed. For recurrent pause-dependent torsades, increase the heart rate with isoproterenol or temporary overdrive pacing. If torsades becomes sustained/hemodynamically unstable, perform unsynchronized defibrillation. Cardiology/EP consult: beta-blocker and consideration of an ICD for congenital long QT syndrome, plus family screening. Avoid all QT-prolonging agents (e.g., amiodarone, sotalol).",
    "manual": {
      "section": "Tachyarrhythmias (Torsades de Pointes / Long QT)",
      "page": 41
    }
  },
  {
    "caseId": "syncope-08",
    "category": "Syncope",
    "diagnosis": "Hypertrophic obstructive cardiomyopathy",
    "vignette": "19M collegiate athlete presents after collapsing during a basketball game; he reports prior exertional lightheadedness, palpitations, and a family history of sudden death.",
    "prompt": "What is your management plan?",
    "actions": [
      "Restrict from competitive sports / strenuous exertion",
      "Non-vasodilating beta-blocker (or verapamil if intolerant)",
      "Cardiology/EP referral and ICD risk stratification (syncope + family history + NSVT)",
      "Maintain volume/preload; avoid dehydration",
      "First-degree relative screening and genetic counseling"
    ],
    "unsafe": [
      "Vasodilators/nitrates/aggressive diuresis worsening dynamic obstruction"
    ],
    "disposition": "Admit; restrict exertion and expedite risk stratification",
    "consults": [
      "Cardiology / Electrophysiology"
    ],
    "idealAnswer": "Restrict from competitive athletics and strenuous exertion. Start a non-vasodilating beta-blocker (e.g., metoprolol) — verapamil if beta-blocker intolerant — to reduce dynamic LVOT obstruction and symptoms. Refer to cardiology/electrophysiology for sudden-death risk stratification; given unexplained exertional syncope, a strong family history of sudden death, and NSVT, an ICD is indicated for secondary/primary prevention. Maintain adequate hydration and preload; avoid dehydration. Avoid preload/afterload reducers — nitrates, diuretics, and dihydropyridine calcium-channel blockers — which worsen obstruction. Screen first-degree relatives with ECG/echo and offer genetic counseling. Consider septal reduction (myectomy/alcohol ablation) for refractory symptoms.",
    "manual": {
      "section": "Cardiomyopathies (Hypertrophic Cardiomyopathy)",
      "page": 40
    }
  },
  {
    "caseId": "syncope-09",
    "category": "Syncope",
    "diagnosis": "Brugada syndrome",
    "vignette": "34M with a febrile flu-like illness presents after an abrupt nocturnal loss of consciousness, with a family history of unexplained sudden death.",
    "prompt": "What is your management plan?",
    "actions": [
      "Aggressive fever control with antipyretics",
      "Cardiology/EP consult for risk stratification and ICD (high-risk: syncope + Type 1 pattern)",
      "Continuous telemetry monitoring with admission",
      "Stop/avoid Brugada-aggravating drugs (sodium-channel blockers, certain antiarrhythmics, excess alcohol)",
      "Counsel on family screening / genetic evaluation",
      "Treat the precipitating febrile illness"
    ],
    "unsafe": [
      "Discharging an unmonitored patient with syncope and a Type 1 Brugada pattern",
      "Giving a sodium-channel-blocking antiarrhythmic as treatment"
    ],
    "disposition": "Admit; monitored bed",
    "consults": [
      "Cardiology / Electrophysiology"
    ],
    "idealAnswer": "Admit with continuous telemetry. Control fever aggressively with antipyretics (fever unmasks the Type 1 pattern and provokes arrhythmia). Cardiology/EP consult for risk stratification — given syncope plus a spontaneous/fever-induced Type 1 pattern, this is high-risk and an ICD is indicated. Stop and avoid drugs that aggravate Brugada (sodium-channel blockers, certain antiarrhythmics, tricyclics, excess alcohol). Counsel on family screening and genetic evaluation. Treat the underlying febrile illness. For electrical storm, isoproterenol/quinidine are the rescue agents.",
    "manual": {
      "section": "Syncope (Inherited Arrhythmia Syndromes — Brugada Syndrome)",
      "page": 38
    }
  },
  {
    "caseId": "abdo-10",
    "category": "Abdominal Pain",
    "diagnosis": "Adrenal (Addisonian) crisis",
    "vignette": "44F on chronic glucocorticoids for an autoimmune condition stops them during a flu-like illness and presents with abdominal pain, vomiting, profound weakness, and near-syncope; she is hypotensive with Na 126, K 6.2, glucose 54, and a low cortisol with high ACTH.",
    "prompt": "What is your management plan?",
    "actions": [
      "Immediate stress-dose IV hydrocortisone (do NOT wait for the cortisol/stimulation result)",
      "Isotonic saline with dextrose for hypotension, hyponatremia, and hypoglycemia",
      "Treat cardiotoxic hyperkalemia per EKG (IV calcium, then insulin + glucose/beta-agonist)",
      "Give hydrocortisone BEFORE any levothyroxine; identify and treat the precipitant",
      "Correct hyponatremia at a safe rate (avoid osmotic demyelination)",
      "Admit to a monitored bed/ICU with endocrinology",
      "Steroid sick-day education: never stop abruptly, stress-dose when ill, medical-alert ID + injectable hydrocortisone kit"
    ],
    "unsafe": [
      "Withholding hydrocortisone while awaiting the cortisol result",
      "Giving levothyroxine before steroids",
      "Over-rapid sodium correction",
      "Discharging a patient in crisis"
    ],
    "disposition": "Admit to a monitored bed/ICU",
    "consults": [
      "Endocrinology"
    ],
    "idealAnswer": "Treat empirically as adrenal (Addisonian) crisis. Give IV hydrocortisone 100 mg immediately WITHOUT waiting for the cortisol, then 50 mg q6h (or an infusion). Resuscitate with isotonic saline containing dextrose to correct the hypotension, hyponatremia, and hypoglycemia. Manage hyperkalemia by EKG (calcium gluconate for cardiotoxicity, then insulin + glucose); it usually resolves with hydrocortisone and volume. Find and treat the precipitant (abrupt steroid cessation plus illness), and never give levothyroxine before steroids. Correct sodium at a safe rate. Admit to a monitored bed/ICU with endocrinology, and before discharge give steroid sick-day rules, a medical-alert bracelet, and an emergency injectable hydrocortisone kit.",
    "manual": {
      "section": "Adrenal Insufficiency & Adrenal Crisis",
      "page": 184
    }
  },
  {
    "caseId": "ams-10",
    "category": "Altered Mental Status",
    "diagnosis": "Digoxin toxicity",
    "vignette": "78M on digoxin for atrial fibrillation, recently on a higher diuretic dose, presents with nausea, anorexia, blurred yellow-green vision, and new confusion; HR ~45, digoxin level 3.2, K 3.0, Cr up from baseline.",
    "prompt": "What is your management plan?",
    "actions": [
      "Hold digoxin AND the diuretic",
      "Continuous telemetry; ICU for a toxic/unstable rhythm",
      "Correct potassium (to ~4–4.5) and magnesium",
      "Digoxin-immune Fab (DigiFab) for life-threatening arrhythmia, hemodynamic instability, or hyperkalemia >5 in acute toxicity",
      "Treat symptomatic bradycardia (atropine; Fab; temporary pacing if needed)",
      "Safe discharge: medication reconciliation, renal dosing + digoxin-level monitoring, diuretic re-titration with electrolyte checks, family education, cardiology/PCP follow-up"
    ],
    "unsafe": [
      "Giving IV calcium for hyperkalemia in digoxin toxicity ('stone heart')",
      "Continuing or re-dosing digoxin or the diuretic"
    ],
    "disposition": "Admit to telemetry; ICU if unstable arrhythmia or hemodynamic instability",
    "consults": [
      "Cardiology",
      "Medical Toxicology / Poison Control"
    ],
    "idealAnswer": "Chronic digoxin toxicity, potentiated by diuretic-induced hypokalemia and renal impairment. Hold the digoxin and the diuretic and place on continuous telemetry. Correct potassium (to ~4–4.5) and magnesium, since hypokalemia/hypomagnesemia worsen toxicity. Give digoxin-immune Fab (DigiFab) for any life-threatening arrhythmia, hemodynamic instability, or — in acute toxicity — K >5. Treat symptomatic bradycardia with atropine/Fab and pacing as a bridge. Critically, AVOID IV calcium for hyperkalemia in dig toxicity ('stone heart'). Disposition is telemetry/ICU; before discharge, reconcile medications, plan renal dosing and digoxin-level monitoring, and re-titrate the diuretic with electrolyte checks.",
    "manual": {
      "section": "Toxicology — Digoxin Toxicity",
      "page": 46
    }
  },
  {
    "caseId": "anemia-09",
    "category": "Anemia",
    "diagnosis": "Myelodysplastic syndrome (MDS)",
    "vignette": "72M with months of fatigue, exertional dyspnea, and easy bruising; CBC shows pancytopenia with macrocytosis (MCV 104), <5% circulating blasts, and dysplastic neutrophils on the smear.",
    "prompt": "What is your management plan?",
    "actions": [
      "Urgent hematology/oncology referral for risk stratification (IPSS-R) and disease-directed therapy (hypomethylating agent; transplant candidacy)",
      "Transfusion support with an ischemia-adjusted threshold (RBCs for symptomatic/ischemic anemia; platelets for severe thrombocytopenia or bleeding)",
      "Treat any fever as a neutropenic emergency (cultures + empiric broad-spectrum antibiotics)",
      "Reconcile meds — stop marrow-suppressive agents (e.g. trimethoprim-sulfamethoxazole); reassess antiplatelets given thrombocytopenia",
      "Supportive care: iron-overload monitoring/chelation in chronically transfused patients, folate, growth factors where appropriate",
      "Admit with hematology co-management; bleeding precautions; prognosis/goals-of-care discussion"
    ],
    "unsafe": [
      "Discharging a severely pancytopenic patient with active bleeding or ischemia without transfusion or hematology involvement",
      "Continuing marrow-suppressive drugs or antiplatelets despite severe thrombocytopenia"
    ],
    "disposition": "Admit with hematology/oncology co-management",
    "consults": [
      "Hematology/Oncology"
    ],
    "idealAnswer": "Myelodysplastic syndrome. Get urgent heme/onc involvement for IPSS-R risk stratification and disease-directed therapy (hypomethylating agents such as azacitidine; allogeneic transplant in eligible higher-risk patients). Manage the cytopenias supportively: transfuse RBCs for symptomatic or ischemic anemia and platelets for severe thrombocytopenia or bleeding, and treat any fever as febrile neutropenia with prompt cultures and empiric antibiotics. Stop marrow-suppressive drugs and reassess antiplatelets. In chronically transfused patients monitor for iron overload and chelate. Admit with bleeding precautions and begin a frank prognosis and goals-of-care discussion.",
    "manual": {
      "section": "Pancytopenia & Anemia (Myelodysplastic Syndrome)",
      "page": 139
    }
  },
  {
    "caseId": "chestpain-10",
    "category": "Chest Pain",
    "diagnosis": "Takotsubo (stress) cardiomyopathy",
    "vignette": "68F develops crushing substernal chest pain and dyspnea minutes after sudden severe emotional stress; the EKG shows anterior ST-elevation with deep T-wave inversions and a long QT, troponin is only mildly elevated, and coronary angiography is normal with apical ballooning.",
    "prompt": "What is your management plan?",
    "actions": [
      "Treat as ACS until coronary anatomy is known — aspirin, telemetry, urgent coronary angiography",
      "Once confirmed, supportive heart-failure care — gentle diuresis, beta-blocker and ACE-inhibitor as tolerated",
      "Correct the QT — keep K >4.0 and replete Mg, stop QT-prolonging drugs, telemetry for torsades",
      "Avoid catecholamines/inotropes/pressors; beware dynamic LV outflow tract obstruction",
      "Consider anticoagulation if apical akinesis / LV thrombus risk",
      "Repeat echo to document recovery; address the psychosocial trigger with social work and close cardiology follow-up"
    ],
    "unsafe": [
      "Discharging an active anterior-injury EKG with a positive troponin",
      "Giving a catecholamine/inotrope or continuing QT-prolonging drugs without telemetry"
    ],
    "disposition": "Admit to telemetry/cardiology; cardiac catheterization",
    "consults": [
      "Cardiology",
      "Psychiatry / Social Work"
    ],
    "idealAnswer": "Takotsubo (stress) cardiomyopathy — but it is indistinguishable from anterior STEMI up front, so treat as ACS (aspirin, telemetry, urgent angiography); the clean coronaries with apical ballooning make the diagnosis. Then manage supportively as heart failure with gentle diuresis and a beta-blocker/ACE-inhibitor as tolerated. Correct the prolonged QT (K >4.0, replete Mg, stop QT-prolonging agents) and watch for torsades on telemetry. AVOID catecholamines/inotropes and pressors — they worsen it and can provoke dynamic LVOT obstruction; anticoagulate if there is apical akinesis with thrombus risk. Function usually recovers, so plan a repeat echo. Address the emotional trigger with social work and arrange close cardiology follow-up.",
    "manual": {
      "section": "Chest Pain (Stress / Takotsubo Cardiomyopathy)",
      "page": 24
    }
  },
  {
    "caseId": "diarrhea-09",
    "category": "Diarrhea",
    "diagnosis": "VIPoma (WDHA / Verner–Morrison syndrome)",
    "vignette": "55F with months of profuse watery (tea-colored) diarrhea — often several liters a day — that persists during a supervised fast, with profound weakness, K 2.4, a non-anion-gap acidosis, and a markedly elevated fasting VIP.",
    "prompt": "What is your management plan?",
    "actions": [
      "Aggressive IV fluid resuscitation for the secretory losses with strict ins/outs",
      "Careful potassium repletion with magnesium on continuous telemetry",
      "Somatostatin analog (octreotide → long-acting lanreotide) to suppress VIP and control the diarrhea",
      "Localize/stage and refer for surgical resection of the pancreatic NET (oncology / endocrine surgery; PRRT or hepatic-directed therapy if metastatic)",
      "Correct the non-anion-gap (bicarbonate-loss) acidosis and hypercalcemia as volume/potassium are restored",
      "Admit; counsel that antidiarrheals/antibiotics alone will not control a hormone-driven secretory diarrhea"
    ],
    "unsafe": [
      "Oral rehydration alone or discharging a severely hypokalemic, volume-depleted patient",
      "Repleting potassium without magnesium or without telemetry",
      "Empiric antibiotics/steroids as if infectious/IBD, missing the secretory tumor"
    ],
    "disposition": "Admit",
    "consults": [
      "Oncology",
      "Endocrine Surgery"
    ],
    "idealAnswer": "VIPoma (WDHA / Verner–Morrison syndrome). Resuscitate aggressively with IV fluids for the large secretory losses and replace potassium (with magnesium, on telemetry) — the hypokalemia is the immediate threat. Start a somatostatin analog (octreotide, then long-acting lanreotide) to suppress VIP and control the diarrhea. Correct the non-anion-gap acidosis (stool bicarbonate loss) and the hypercalcemia as volume and potassium are restored. Localize and stage the pancreatic neuroendocrine tumor and refer to endocrine surgery/oncology for resection, with PRRT or hepatic-directed therapy if metastatic. Counsel that ordinary antidiarrheals and antibiotics will not control a hormone-secreting tumor.",
    "manual": {
      "section": "Diarrhea (Secretory / VIPoma)",
      "page": 78
    }
  },
  {
    "caseId": "dyspnea-10",
    "category": "Dyspnea",
    "diagnosis": "New-onset atrial fibrillation with RVR (precipitating decompensated heart failure)",
    "vignette": "65F with HTN and obesity presents with 2 days of progressive dyspnea, orthopnea, and palpitations; she is in new atrial fibrillation at ~140 with pulmonary edema, and the workup reveals a suppressed TSH (thyrotoxicosis) as the precipitant.",
    "prompt": "What is your management plan?",
    "actions": [
      "Rate control (beta-blocker preferred) while co-treating the precipitant",
      "Treat the trigger — here antithyroid therapy + beta-blocker with endocrine consult",
      "Gentle IV loop diuresis with strict I/O and daily weights",
      "Anticoagulation decision by CHA2DS2-VASc",
      "Telemetry/admission with serial troponin",
      "Rhythm control/cardioversion only after adequate anticoagulation or a TEE; address contributors (alcohol, OSA, BP)"
    ],
    "unsafe": [
      "Rate-control monotherapy without treating the precipitant (thyrotoxicosis)",
      "Unsafe early cardioversion of unanticoagulated new AF",
      "Aggressive IV fluid bolus in a congested patient"
    ],
    "disposition": "Admit to telemetry (SDU/CCU if unstable or refractory RVR)",
    "consults": [
      "Cardiology",
      "Endocrinology"
    ],
    "idealAnswer": "New atrial fibrillation with RVR that has precipitated decompensated heart failure — and you must treat the precipitant, here occult thyrotoxicosis. Rate-control with a beta-blocker (preferred, and it also treats the thyrotoxic symptoms), cautiously so as not to worsen the decompensation, and add antithyroid therapy with endocrinology. Gently diurese the pulmonary edema with an IV loop diuretic and strict I/O. Make an anticoagulation decision by CHA2DS2-VASc; do not cardiovert unanticoagulated new AF without a TEE. Admit to telemetry with serial troponin, and address contributors (alcohol, OSA, blood pressure).",
    "manual": {
      "section": "Atrial Fibrillation / Tachyarrhythmias",
      "page": 31
    }
  },
  {
    "caseId": "fever-09",
    "category": "Fever",
    "diagnosis": "Reactivation pulmonary tuberculosis",
    "vignette": "45M with recent incarceration has several weeks of fevers, drenching night sweats, weight loss, and a productive cough; CXR shows right-upper-lobe cavitation and the sputum AFB smear is positive.",
    "prompt": "What is your management plan?",
    "actions": [
      "Airborne (negative-pressure) isolation with N95 until de-isolation criteria are met",
      "Empiric four-drug RIPE therapy (rifampin, isoniazid + pyridoxine, pyrazinamide, ethambutol)",
      "Mandatory public-health reporting + contact tracing + arrange directly observed therapy (DOT)",
      "Baseline and serial LFTs; visual acuity / color-vision monitoring (ethambutol)",
      "HIV testing and linkage to care",
      "Do not discharge to a congregate setting while infectious; arrange housing/case management and follow-up"
    ],
    "unsafe": [
      "Discharging an infectious smear-positive patient to a shelter/jail or stopping isolation prematurely",
      "Single-drug therapy or omitting public-health reporting",
      "Starting a TNF-alpha inhibitor / escalating immunosuppression"
    ],
    "disposition": "Admit to a negative-pressure airborne-isolation room; involve public health",
    "consults": [
      "Infectious Disease",
      "Pulmonology",
      "Public Health / TB control"
    ],
    "idealAnswer": "Active (reactivation) pulmonary TB. Place the patient in a negative-pressure airborne-isolation room with N95 precautions immediately and send three sputum AFB smears/cultures with NAAT. Start empiric four-drug RIPE therapy (rifampin, isoniazid with pyridoxine, pyrazinamide, ethambutol) and report to public health for contact tracing and directly observed therapy. Get baseline LFTs (and monitor on treatment) and check visual acuity/color vision for ethambutol. Test for HIV. Do not discharge an infectious patient to a congregate setting — arrange isolation-appropriate housing, case management, and follow-up, and watch for drug hepatotoxicity and IRIS.",
    "manual": {
      "section": "Tuberculosis (Active Pulmonary TB)",
      "page": 188
    }
  },
  {
    "caseId": "liver-09",
    "category": "Abnormal Liver Enzymes",
    "diagnosis": "Hereditary hemochromatosis",
    "vignette": "55M with fatigue, arthralgias of the 2nd/3rd knuckles, bronze skin, and new diabetes; transaminases are mildly elevated and ferritin with transferrin saturation (>45%) are markedly high.",
    "prompt": "What is your management plan?",
    "actions": [
      "Therapeutic phlebotomy to iron-deplete, then maintenance (first-line iron removal)",
      "Stop iron AND vitamin C supplements; limit/abstain from alcohol; avoid raw shellfish (Vibrio)",
      "Treat the diabetes and manage hypogonadism (testosterone replacement)",
      "Cardiology referral for conduction disease/cardiomyopathy with telemetry +/- pacing",
      "Hepatology referral; HCC surveillance (ultrasound + AFP) if cirrhotic",
      "HFE genetic counseling and screen first-degree relatives"
    ],
    "unsafe": [
      "Giving iron or continuing an iron/vitamin-C supplement",
      "Treating only the liver and ignoring the cardiac, endocrine, and family-screening dimensions",
      "Choosing chelation over phlebotomy first-line in an otherwise stable patient"
    ],
    "disposition": "Outpatient phlebotomy program with hepatology, cardiology, and endocrine follow-up; admit if high-grade AV block develops",
    "consults": [
      "Hepatology",
      "Cardiology",
      "Endocrinology"
    ],
    "idealAnswer": "Hereditary hemochromatosis. First-line iron removal is therapeutic phlebotomy (iron-deplete, then maintenance); reserve chelation for those who cannot tolerate phlebotomy. Stop iron and vitamin C supplements, counsel alcohol limitation, and advise avoiding raw shellfish (Vibrio risk). Treat the end-organ disease: diabetes, hypogonadism (testosterone), and the cardiac dimension — cardiology referral for iron cardiomyopathy/conduction disease, with telemetry and pacing if high-grade block. Refer to hepatology and start HCC surveillance (ultrasound + AFP) if cirrhotic. Confirm with HFE genotyping, offer genetic counseling, and screen first-degree relatives.",
    "manual": {
      "section": "Inherited Liver Disease (Hereditary Hemochromatosis)",
      "page": 96
    }
  },
  {
    "caseId": "syncope-10",
    "category": "Syncope",
    "diagnosis": "Pre-excited atrial fibrillation (Wolff-Parkinson-White)",
    "vignette": "22M with syncope during a sudden burst of fast irregular palpitations; the monitor shows a very fast, broad, irregular tachycardia with beat-to-beat QRS changes, and his baseline EKG has a short PR with a delta wave.",
    "prompt": "What is your management plan?",
    "actions": [
      "Unstable/hypotensive → immediate synchronized electrical cardioversion",
      "Stable pre-excited AF → procainamide or ibutilide (does NOT block the AV node)",
      "AVOID all AV-nodal blockers — adenosine, beta-blockers, calcium-channel blockers, digoxin — they accelerate accessory-pathway conduction and can precipitate VF",
      "Continuous telemetry with defibrillator pads, IV access, replete magnesium/potassium",
      "Urgent cardiology/electrophysiology referral for accessory-pathway ablation (definitive cure)",
      "Do not discharge on an AV-nodal blocker; restrict competitive sport until ablated; clear return precautions and EP follow-up"
    ],
    "unsafe": [
      "Giving adenosine, a beta-blocker, a calcium-channel blocker, or digoxin",
      "Discharging on verapamil or without EP referral and activity counseling"
    ],
    "disposition": "Admit; monitored bed; urgent EP for ablation",
    "consults": [
      "Cardiology / Electrophysiology"
    ],
    "idealAnswer": "Pre-excited atrial fibrillation in WPW — a wide, irregular, very fast tachycardia. If unstable, perform immediate synchronized cardioversion. If stable, use procainamide or ibutilide, which slow accessory-pathway conduction without blocking the AV node. The load-bearing point: AVOID every AV-nodal blocker — adenosine, beta-blockers, calcium-channel blockers (stop his verapamil), and digoxin — because blocking the node forces more conduction down the accessory pathway and can precipitate ventricular fibrillation. Keep the patient on telemetry with defibrillator pads and correct Mg/K. Refer urgently to electrophysiology for accessory-pathway ablation, which is curative. Do not discharge on an AV-nodal blocker; restrict competitive sport until ablated and give clear return precautions.",
    "manual": {
      "section": "Tachyarrhythmias (Pre-excited AF / WPW)",
      "page": 39
    }
  }
];

/** Distinct categories present in the bank, in first-seen order. */
export const MANAGEMENT_DRILL_CATEGORIES: string[] = Array.from(
  new Set(MANAGEMENT_DRILLS.map((p) => p.category)),
);
