/**
 * Shelf study bank — condition-based study cards for the Internal Medicine
 * shelf/clerkship exam, built system by system. Each card carries the main
 * presentation, the key identification (the classic "most likely diagnosis"
 * clue), the diagnostic test (best initial / most accurate where they differ),
 * the first-line treatment (omitted when the shelf doesn't test management),
 * risk factors, and the key side effects of the drugs used — surfaced in a
 * think-first reveal UI. A cross-system drug side-effect appendix (SHELF_DRUGS)
 * collects the high-yield pharmacology the shelf tests directly.
 *
 * Educational reference only — confirm dosing and current guidelines.
 */

export interface ShelfDrugNote {
  /** Drug or class used to treat this condition. */
  drug: string;
  /** The key, testable side effects. */
  effects: string;
}

export interface ShelfCondition {
  id: string;
  /** Organ system (drives grouping + the filter). */
  system: string;
  name: string;
  /** Main presentation — shown up front. */
  presentation: string;
  /** Classic identification / "most likely diagnosis" clue. */
  keyId: string;
  /** Best initial / next-best-step test. */
  dxBestInitial?: string;
  /** Most accurate / confirmatory test (when it differs from the initial). */
  dxMostAccurate?: string;
  /** First-line treatment — omitted where the shelf doesn't test management. */
  treatment?: string;
  riskFactors: string[];
  /** Side effects of the drugs used to treat this condition. */
  drugSideEffects?: ShelfDrugNote[];
  /** Optional high-yield pearl. */
  pearl?: string;
}

export interface ShelfDrug {
  drug: string;
  klass: string;
  /** The key, testable side effects. */
  effects: string;
}

export const SHELF_CONDITIONS: ShelfCondition[] = [
  // ---------------------------------------------------------------- Cardiology
  {
    id: "card-stable-angina",
    system: "Cardiology",
    name: "Stable angina (chronic CAD)",
    presentation:
      "Predictable substernal chest pressure brought on by exertion or emotion and relieved by rest or nitroglycerin within minutes; reproducible threshold.",
    keyId: "Exertional chest pressure relieved by rest/nitrates at a reproducible threshold; <20 min.",
    dxBestInitial: "Resting ECG (often normal) + exercise stress test (ECG, or with imaging).",
    dxMostAccurate: "Coronary angiography.",
    treatment:
      "Antianginal: sublingual nitroglycerin PRN + a beta-blocker (first-line). Add a CCB or long-acting nitrate; ranolazine if refractory. Plus aspirin + high-intensity statin and risk-factor control; revascularize if refractory/high-risk.",
    riskFactors: ["Age", "Male / postmenopausal", "Smoking", "Diabetes", "Hypertension", "Hyperlipidemia", "Family history of premature CAD"],
    drugSideEffects: [
      { drug: "Nitrates", effects: "Headache, hypotension, reflex tachycardia, tolerance; NEVER with PDE5 inhibitors" },
      { drug: "Beta-blockers", effects: "Bradycardia, fatigue, bronchospasm, mask hypoglycemia" },
    ],
  },
  {
    id: "card-nste-acs",
    system: "Cardiology",
    name: "Unstable angina / NSTEMI (NSTE-ACS)",
    presentation:
      "New, worsening, or rest angina; prolonged chest pain with diaphoresis or dyspnea, not fully relieved by rest.",
    keyId: "Anginal pain at rest/crescendo with ST depression or T-wave inversion; troponin elevated (NSTEMI) or normal (UA).",
    dxBestInitial: "ECG + serial troponins.",
    dxMostAccurate: "Coronary angiography.",
    treatment:
      "Aspirin + a P2Y12 inhibitor, anticoagulation (heparin), beta-blocker, nitrates, high-intensity statin; early invasive angiography (within 24-72 h, sooner if high-risk). NO fibrinolytics.",
    riskFactors: ["Established CAD risk factors", "Prior MI/PCI", "Cocaine use"],
    drugSideEffects: [
      { drug: "Aspirin / P2Y12 (clopidogrel, ticagrelor)", effects: "Bleeding; ticagrelor → dyspnea" },
      { drug: "Heparin", effects: "Bleeding, heparin-induced thrombocytopenia (HIT)" },
    ],
  },
  {
    id: "card-stemi",
    system: "Cardiology",
    name: "STEMI",
    presentation:
      "Severe, prolonged substernal chest pain with diaphoresis, nausea, and a sense of doom; not relieved by rest.",
    keyId: "ST-segment elevation in contiguous leads (or new LBBB) with elevated troponin.",
    dxBestInitial: "ECG (ST elevation) — do not wait for troponin.",
    dxMostAccurate: "Coronary angiography.",
    treatment:
      "Immediate reperfusion: primary PCI (door-to-balloon <90 min) or fibrinolysis if PCI not available within 120 min. Plus aspirin + P2Y12, anticoagulation, high-intensity statin; beta-blocker once stable.",
    riskFactors: ["Established CAD risk factors"],
    drugSideEffects: [{ drug: "Fibrinolytics (tPA)", effects: "Bleeding, including intracranial hemorrhage" }],
    pearl: "Inferior STEMI (II/III/aVF): get right-sided leads; if RV infarct, avoid nitrates (preload-dependent).",
  },
  {
    id: "card-hfref",
    system: "Cardiology",
    name: "Heart failure, reduced EF (HFrEF)",
    presentation:
      "Exertional dyspnea, orthopnea, paroxysmal nocturnal dyspnea, fatigue, and edema; S3 gallop, elevated JVP, bibasilar crackles.",
    keyId: "Congestive symptoms with reduced EF (<40%) and an S3.",
    dxBestInitial: "BNP / NT-proBNP + echocardiogram.",
    dxMostAccurate: "Echocardiography (quantifies EF).",
    treatment:
      "Guideline-directed therapy: ARNI (or ACEi/ARB), evidence-based beta-blocker (carvedilol, metoprolol succinate, bisoprolol), MRA (spironolactone), and an SGLT2 inhibitor; loop diuretic for congestion; ICD/CRT per criteria.",
    riskFactors: ["CAD / prior MI", "Hypertension", "Diabetes", "Valvular disease", "Alcohol", "Anthracyclines / chemo", "Viral myocarditis"],
    drugSideEffects: [
      { drug: "ACEi / ARNI", effects: "Cough (ACEi), hyperkalemia, angioedema, AKI, hypotension" },
      { drug: "Spironolactone (MRA)", effects: "Hyperkalemia, gynecomastia" },
      { drug: "SGLT2 inhibitor", effects: "Genital mycotic infections, euglycemic DKA, volume depletion" },
    ],
  },
  {
    id: "card-hfpef",
    system: "Cardiology",
    name: "Heart failure, preserved EF (HFpEF)",
    presentation:
      "Same congestive symptoms (dyspnea, edema) but a preserved EF (>=50%); typically an older, hypertensive, obese patient.",
    keyId: "HF symptoms + preserved EF + diastolic dysfunction; elevated BNP.",
    dxBestInitial: "BNP + echocardiogram (preserved EF, diastolic dysfunction).",
    treatment:
      "Control blood pressure, diurese for congestion, and start an SGLT2 inhibitor (benefit shown); treat AFib and comorbidities. Unlike HFrEF, ACEi/beta-blockers have not shown mortality benefit.",
    riskFactors: ["Hypertension (key)", "Obesity", "Diabetes", "Older age", "Atrial fibrillation", "CKD"],
    drugSideEffects: [{ drug: "Loop diuretics", effects: "Hypokalemia, hypovolemia, ototoxicity, hyperuricemia/gout" }],
  },
  {
    id: "card-afib",
    system: "Cardiology",
    name: "Atrial fibrillation",
    presentation:
      "Palpitations, fatigue, or dyspnea with an irregularly irregular pulse; may be asymptomatic and found incidentally.",
    keyId: "Irregularly irregular rhythm with no discrete P waves on ECG.",
    dxBestInitial: "ECG.",
    treatment:
      "Rate control (beta-blocker or non-dihydropyridine CCB) +/- rhythm control; anticoagulate by CHA2DS2-VASc; synchronized cardioversion if unstable (or after 3 wk anticoagulation/TEE if onset >48 h).",
    riskFactors: ["Hypertension", "Older age", "Valvular / structural disease", "Hyperthyroidism", "Alcohol (holiday heart)", "Obstructive sleep apnea", "Heart failure"],
    drugSideEffects: [
      { drug: "Warfarin", effects: "Bleeding, skin necrosis, teratogenic; many interactions (monitor INR)" },
      { drug: "DOACs", effects: "Bleeding (no routine monitoring)" },
      { drug: "Amiodarone", effects: "Thyroid, pulmonary fibrosis, hepatotoxicity, blue-gray skin, QT prolongation" },
    ],
  },
  {
    id: "card-aflutter",
    system: "Cardiology",
    name: "Atrial flutter",
    presentation: "Palpitations with a regular tachycardia, classically a ventricular rate near 150.",
    keyId: "Sawtooth flutter waves; rate often 150 with 2:1 conduction.",
    dxBestInitial: "ECG.",
    treatment:
      "Rate control and anticoagulation as for AFib; definitive treatment is catheter ablation (cavotricuspid isthmus); cardiovert if unstable.",
    riskFactors: ["Same as atrial fibrillation", "COPD", "Prior cardiac surgery"],
  },
  {
    id: "card-avnrt",
    system: "Cardiology",
    name: "Paroxysmal SVT (AVNRT)",
    presentation:
      "Sudden-onset palpitations with a regular, narrow-complex tachycardia (~150-220) and lightheadedness; often a young, otherwise healthy patient.",
    keyId: "Regular narrow-complex tachycardia with abrupt onset/offset.",
    dxBestInitial: "ECG.",
    treatment:
      "Vagal maneuvers, then IV adenosine; synchronized cardioversion if unstable. Long-term: AV-nodal blockers or catheter ablation.",
    riskFactors: ["Usually structurally normal heart", "Caffeine", "Stress", "Stimulants"],
    drugSideEffects: [{ drug: "Adenosine", effects: "Transient asystole, flushing, chest pressure, bronchospasm" }],
  },
  {
    id: "card-vt",
    system: "Cardiology",
    name: "Ventricular tachycardia",
    presentation: "Palpitations, syncope, or cardiac arrest with a wide-complex tachycardia.",
    keyId: "Wide-complex regular tachycardia with AV dissociation; usually structural heart disease / prior MI.",
    dxBestInitial: "ECG.",
    treatment:
      "Unstable → synchronized cardioversion (defibrillate if pulseless); stable → IV antiarrhythmic (amiodarone or procainamide); correct ischemia/electrolytes; ICD for secondary prevention.",
    riskFactors: ["Prior MI / scar", "Cardiomyopathy", "Long QT", "Electrolyte abnormalities (low K/Mg)"],
  },
  {
    id: "card-aortic-stenosis",
    system: "Cardiology",
    name: "Aortic stenosis",
    presentation:
      "Exertional dyspnea, angina, and syncope; a harsh crescendo-decrescendo systolic murmur at the right upper sternal border radiating to the carotids, with a soft S2 and pulsus parvus et tardus.",
    keyId: "Systolic ejection murmur radiating to the carotids + parvus et tardus; calcific (elderly) or bicuspid (younger).",
    dxBestInitial: "Echocardiography.",
    treatment:
      "Aortic valve replacement (surgical or TAVR) once symptomatic; no medical therapy alters the course. Avoid afterload reduction/nitrates (preload-dependent).",
    riskFactors: ["Older age (calcific)", "Bicuspid aortic valve", "Rheumatic disease"],
    pearl: "Symptomatic AS → valve replacement; survival drops sharply once angina/syncope/HF appears.",
  },
  {
    id: "card-aortic-regurg",
    system: "Cardiology",
    name: "Aortic regurgitation",
    presentation:
      "Exertional dyspnea with a wide pulse pressure and bounding (water-hammer) pulses; an early decrescendo diastolic murmur at the left sternal border; head bobbing.",
    keyId: "Decrescendo diastolic murmur + wide pulse pressure / bounding pulses.",
    dxBestInitial: "Echocardiography.",
    treatment:
      "Aortic valve replacement when symptomatic or with LV dysfunction/dilation; vasodilators (ACEi, nifedipine) if symptomatic and not a surgical candidate.",
    riskFactors: ["Bicuspid valve", "Rheumatic disease", "Endocarditis", "Aortic root dilation (Marfan)", "Syphilis (tertiary)"],
  },
  {
    id: "card-mitral-stenosis",
    system: "Cardiology",
    name: "Mitral stenosis",
    presentation:
      "Dyspnea, hemoptysis, or new atrial fibrillation; an opening snap followed by a mid-diastolic rumble at the apex; classically a young woman or an immigrant with rheumatic history.",
    keyId: "Diastolic rumble with an opening snap + rheumatic history; left atrial enlargement → AFib.",
    dxBestInitial: "Echocardiography.",
    treatment:
      "Diuretics and rate control; anticoagulate if AFib; percutaneous balloon valvuloplasty or valve replacement for severe disease.",
    riskFactors: ["Rheumatic fever (key)"],
  },
  {
    id: "card-mitral-regurg",
    system: "Cardiology",
    name: "Mitral regurgitation",
    presentation: "Fatigue and dyspnea with a holosystolic murmur at the apex radiating to the axilla.",
    keyId: "Holosystolic apical murmur radiating to the axilla.",
    dxBestInitial: "Echocardiography.",
    treatment:
      "Surgical repair (preferred) or replacement for severe/symptomatic disease; afterload reduction and HF therapy as a bridge.",
    riskFactors: ["Mitral valve prolapse", "Ischemia (papillary muscle rupture)", "Endocarditis", "Rheumatic disease", "Dilated cardiomyopathy"],
  },
  {
    id: "card-mvp",
    system: "Cardiology",
    name: "Mitral valve prolapse",
    presentation:
      "Often asymptomatic; a mid-systolic click +/- late systolic murmur; sometimes atypical chest pain or palpitations in a young woman.",
    keyId: "Mid-systolic click; the click moves EARLIER with standing/Valsalva (decreased preload).",
    dxBestInitial: "Echocardiography.",
    treatment: "Usually none; beta-blocker for palpitations; surgery only if severe MR develops.",
    riskFactors: ["Connective tissue disease (Marfan, Ehlers-Danlos)"],
    pearl: "↓Preload maneuvers (standing/Valsalva) move the click earlier and lengthen the murmur — same maneuver makes HCM louder.",
  },
  {
    id: "card-hcm",
    system: "Cardiology",
    name: "Hypertrophic cardiomyopathy (HCM)",
    presentation:
      "A young athlete with exertional dyspnea, palpitations, or syncope, and a harsh systolic murmur; risk of sudden cardiac death.",
    keyId: "Systolic murmur that gets LOUDER with decreased preload (Valsalva, standing); young athlete with syncope or family history of sudden death.",
    dxBestInitial: "Echocardiography (asymmetric septal hypertrophy, systolic anterior motion of the mitral valve).",
    treatment:
      "Beta-blocker (or non-dihydropyridine CCB); avoid dehydration, diuretics, vasodilators, and digoxin (worsen outflow obstruction); ICD if high-risk; septal myectomy or alcohol septal ablation for refractory obstruction.",
    riskFactors: ["Autosomal dominant sarcomere mutation (family history)"],
    pearl: "Most common cause of sudden cardiac death in young athletes.",
  },
  {
    id: "card-dcm",
    system: "Cardiology",
    name: "Dilated cardiomyopathy",
    presentation: "Heart failure symptoms with a dilated, poorly contracting ventricle and an S3.",
    keyId: "Dilated LV with low EF and no ischemic cause — look for a toxin/viral/genetic etiology.",
    dxBestInitial: "Echocardiography.",
    treatment: "Guideline-directed HFrEF therapy; treat the underlying cause; ICD/CRT per criteria.",
    riskFactors: ["Alcohol", "Viral myocarditis", "Peripartum", "Doxorubicin / trastuzumab", "Thiamine deficiency (wet beriberi)", "Cocaine", "Genetic"],
  },
  {
    id: "card-rcm",
    system: "Cardiology",
    name: "Restrictive cardiomyopathy",
    presentation:
      "Predominantly right-heart failure (edema, ascites, elevated JVP) with a preserved EF and prominent diastolic dysfunction.",
    keyId: "Stiff ventricles with normal EF; amyloid = thick walls but LOW ECG voltage.",
    dxBestInitial: "Echocardiography (then cardiac MRI / biopsy by cause).",
    treatment: "Treat the underlying disease; cautious diuresis for congestion.",
    riskFactors: ["Amyloidosis", "Sarcoidosis", "Hemochromatosis", "Radiation", "Endomyocardial fibrosis"],
  },
  {
    id: "card-endocarditis",
    system: "Cardiology",
    name: "Infective endocarditis",
    presentation:
      "Fever with a new or changing regurgitant murmur; constitutional symptoms and embolic/immune phenomena — Janeway lesions, Osler nodes, Roth spots, splinter hemorrhages.",
    keyId: "Fever + new regurgitant murmur + a risk factor (IV drug use, prosthetic valve); apply Duke criteria.",
    dxBestInitial: "Three sets of blood cultures + transthoracic echo (escalate to TEE).",
    dxMostAccurate: "Transesophageal echo + positive cultures (Duke criteria).",
    treatment:
      "Empiric vancomycin (add a gram-negative agent per setting) after cultures, then tailor to organism; surgery for heart failure, abscess, large/embolizing vegetation, or refractory infection.",
    riskFactors: ["IV drug use (tricuspid / S. aureus)", "Prosthetic valve", "Structural/valvular disease", "Indwelling lines", "Poor dentition"],
    drugSideEffects: [{ drug: "Vancomycin", effects: "Nephrotoxicity, ototoxicity, infusion-related 'red man' reaction" }],
    pearl: "S. gallolyticus (bovis) endocarditis → colonoscopy (associated colon cancer); S. aureus = acute; viridans = subacute.",
  },
  {
    id: "card-pericarditis",
    system: "Cardiology",
    name: "Acute pericarditis",
    presentation:
      "Sharp, pleuritic chest pain that improves leaning forward and worsens supine; a pericardial friction rub; often after a viral illness.",
    keyId: "Pleuritic chest pain relieved by sitting forward + diffuse ST elevation with PR depression + friction rub.",
    dxBestInitial: "ECG (diffuse ST elevation, PR depression) + echo for effusion.",
    treatment: "NSAIDs + colchicine; treat the underlying cause; avoid anticoagulation.",
    riskFactors: ["Viral infection", "Post-MI (Dressler)", "Uremia", "Autoimmune (SLE)", "Tuberculosis", "Malignancy"],
    drugSideEffects: [{ drug: "Colchicine", effects: "Diarrhea/GI upset; myelosuppression and neuromyopathy at toxic levels" }],
  },
  {
    id: "card-tamponade",
    system: "Cardiology",
    name: "Cardiac tamponade",
    presentation:
      "Dyspnea and hypotension with Beck's triad (hypotension, elevated JVP, muffled heart sounds) and pulsus paradoxus.",
    keyId: "Pulsus paradoxus + Beck's triad; ECG shows low voltage and electrical alternans.",
    dxBestInitial: "Echocardiography (diastolic right atrial/ventricular collapse).",
    treatment: "Urgent pericardiocentesis; IV fluids as a temporizing measure; avoid diuretics and vasodilators.",
    riskFactors: ["Pericarditis / effusion", "Malignancy", "Uremia", "Trauma", "Aortic dissection", "Post-cardiac procedure"],
  },
  {
    id: "card-constrictive-pericarditis",
    system: "Cardiology",
    name: "Constrictive pericarditis",
    presentation:
      "Right-heart failure (edema, ascites, elevated JVP) with Kussmaul sign and a pericardial knock; history of prior pericarditis, cardiac surgery, radiation, or TB.",
    keyId: "Right HF + Kussmaul sign + pericardial knock + calcified pericardium.",
    dxBestInitial: "Echocardiography (then CT/MRI for pericardial thickening/calcification).",
    treatment: "Pericardiectomy is definitive; diuretics for symptom relief.",
    riskFactors: ["Prior pericarditis", "Cardiac surgery", "Radiation", "Tuberculosis"],
  },
  {
    id: "card-htn",
    system: "Cardiology",
    name: "Essential hypertension",
    presentation: "Usually asymptomatic and found on screening; chronic elevation causes silent end-organ damage.",
    keyId: "Persistently elevated BP (>=130/80, stage 1) on repeated, properly measured readings.",
    dxBestInitial: "Repeated office BP measurement (or ambulatory monitoring); screen for secondary causes if young/resistant.",
    treatment:
      "Lifestyle plus a thiazide, ACEi/ARB, or dihydropyridine CCB (first-line). ACEi/ARB preferred with diabetes or CKD; often chlorthalidone, amlodipine, or lisinopril.",
    riskFactors: ["Older age", "Obesity", "High dietary sodium", "Family history", "Black race", "Excess alcohol", "Sedentary lifestyle"],
    drugSideEffects: [
      { drug: "Thiazides", effects: "Hypokalemia, hyponatremia, hyperuricemia/gout, hyperglycemia, hypercalcemia" },
      { drug: "ACEi", effects: "Cough, hyperkalemia, angioedema, AKI (avoid in bilateral RAS), teratogenic" },
      { drug: "Amlodipine (DHP CCB)", effects: "Peripheral edema, flushing, headache" },
    ],
  },
  {
    id: "card-htn-emergency",
    system: "Cardiology",
    name: "Hypertensive emergency",
    presentation:
      "Severe hypertension (>180/120) WITH acute end-organ damage — encephalopathy, ACS, pulmonary edema, AKI, dissection, or papilledema.",
    keyId: "BP >180/120 plus acute end-organ damage (vs urgency = no end-organ damage).",
    dxBestInitial: "BP measurement + targeted end-organ workup (ECG, troponin, creatinine, urinalysis, fundoscopy, imaging).",
    treatment:
      "IV titratable agent (nicardipine, labetalol, clevidipine); lower MAP by no more than ~25% in the first hour (rapid SBP <120 for aortic dissection).",
    riskFactors: ["Medication nonadherence", "Chronic hypertension", "Cocaine / sympathomimetics", "Renal disease"],
  },
  {
    id: "card-aortic-dissection",
    system: "Cardiology",
    name: "Aortic dissection",
    presentation:
      "Sudden, severe tearing chest or back pain radiating to the back; an inter-arm blood-pressure differential, a new aortic-regurgitation murmur, or a pulse deficit.",
    keyId: "Tearing chest pain radiating to the back + inter-arm BP differential; widened mediastinum on CXR.",
    dxBestInitial: "CT angiography (stable patient); TEE if unstable.",
    treatment:
      "Rapidly control HR then BP: IV beta-blocker first (esmolol), then a vasodilator (nicardipine/nitroprusside), target HR <60 and SBP <120. Stanford A (ascending) → emergent surgery; Stanford B (descending) → medical management.",
    riskFactors: ["Hypertension (key)", "Connective tissue disease (Marfan)", "Bicuspid aortic valve", "Cocaine", "Pregnancy", "Trauma"],
    pearl: "Give the beta-blocker BEFORE the vasodilator to avoid reflex tachycardia and increased shear.",
  },
  {
    id: "card-aaa",
    system: "Cardiology",
    name: "Abdominal aortic aneurysm",
    presentation:
      "Usually asymptomatic (incidental pulsatile mass); rupture presents as sudden abdominal/back pain, hypotension, and a pulsatile abdominal mass.",
    keyId: "Pulsatile abdominal mass in an elderly male smoker; rupture = hypotension + back/abdominal pain.",
    dxBestInitial: "Abdominal ultrasound (screening and diagnosis).",
    treatment:
      "Repair (open or endovascular) when >=5.5 cm, symptomatic, or rapidly enlarging; emergent surgery if ruptured. Otherwise: smoking cessation, BP control, and surveillance.",
    riskFactors: ["Smoking (strongest)", "Age >65", "Male sex", "Hypertension", "Atherosclerosis", "Family history"],
    pearl: "Screen men 65-75 who have ever smoked with a one-time ultrasound.",
  },
  {
    id: "card-pad",
    system: "Cardiology",
    name: "Peripheral arterial disease",
    presentation:
      "Intermittent claudication (calf pain with walking, relieved by rest), diminished pulses, hair loss, and cool skin; critical limb ischemia brings rest pain, ulcers, or gangrene.",
    keyId: "Exertional calf pain relieved by rest with an ankle-brachial index <0.9.",
    dxBestInitial: "Ankle-brachial index (ABI).",
    treatment:
      "Aggressive risk-factor modification (smoking cessation), supervised exercise, antiplatelet (aspirin or clopidogrel), statin, and cilostazol for symptoms; revascularization for critical or lifestyle-limiting disease.",
    riskFactors: ["Smoking (key)", "Diabetes", "Hyperlipidemia", "Hypertension", "Older age"],
    drugSideEffects: [{ drug: "Cilostazol", effects: "Headache, palpitations; CONTRAINDICATED in heart failure (PDE3 inhibitor)" }],
  },
  {
    id: "card-wpw",
    system: "Cardiology",
    name: "Wolff-Parkinson-White",
    presentation: "Palpitations or recurrent SVT, occasionally syncope; pre-excitation on ECG.",
    keyId: "Short PR + delta wave + widened QRS (pre-excitation).",
    dxBestInitial: "ECG.",
    treatment:
      "Orthodromic SVT → vagal maneuvers/adenosine; pre-excited (wide, irregular) AFib → procainamide or ibutilide and AVOID AV-nodal blockers (adenosine, beta-blockers, CCBs, digoxin); definitive treatment is catheter ablation.",
    riskFactors: ["Congenital accessory pathway", "Ebstein anomaly"],
    pearl: "AV-nodal blockers in pre-excited AFib can accelerate conduction down the accessory pathway and precipitate VF.",
  },
  {
    id: "card-long-qt",
    system: "Cardiology",
    name: "Long QT / Torsades de pointes",
    presentation:
      "Palpitations, syncope, or sudden death; torsades is a polymorphic VT that twists around the baseline.",
    keyId: "Prolonged QTc; torsades = polymorphic VT.",
    dxBestInitial: "ECG (QTc).",
    treatment:
      "IV magnesium for torsades; stop offending drugs and correct K/Mg; defibrillate if unstable; congenital long QT → beta-blockers +/- ICD.",
    riskFactors: ["Congenital (Romano-Ward, Jervell-Lange-Nielsen)", "QT-prolonging drugs (antiarrhythmics, macrolides, antipsychotics, methadone, ondansetron)", "Hypokalemia / hypomagnesemia / hypocalcemia", "Bradycardia"],
  },
  {
    id: "card-complete-block",
    system: "Cardiology",
    name: "Complete (third-degree) AV block",
    presentation: "Fatigue, lightheadedness, or syncope with bradycardia and cannon A waves.",
    keyId: "AV dissociation — P waves and QRS complexes march independently with bradycardia.",
    dxBestInitial: "ECG.",
    treatment:
      "Pacing (transcutaneous → transvenous → permanent pacemaker); atropine is usually ineffective; treat reversible causes (drugs, ischemia, Lyme carditis).",
    riskFactors: ["Age-related conduction degeneration", "Inferior MI", "AV-nodal blocking drugs", "Lyme disease", "Cardiac surgery"],
  },
];

/**
 * Cross-system drug side-effect appendix — the high-yield pharmacology the shelf
 * tests directly. Grows as each system batch is added.
 */
export const SHELF_DRUGS: ShelfDrug[] = [
  { drug: "Amiodarone", klass: "Antiarrhythmic (class III)", effects: "Pulmonary fibrosis, hypo/hyperthyroidism, hepatotoxicity, blue-gray skin, corneal deposits, QT prolongation" },
  { drug: "Digoxin", klass: "Cardiac glycoside", effects: "Narrow therapeutic index: nausea/vomiting, yellow-green visual halos, arrhythmias; toxicity worsened by hypokalemia" },
  { drug: "ACE inhibitors", klass: "RAAS inhibitor", effects: "Dry cough, hyperkalemia, angioedema, AKI (avoid in bilateral renal artery stenosis), teratogenic" },
  { drug: "ARBs", klass: "RAAS inhibitor", effects: "Hyperkalemia, AKI, teratogenic — but NO cough (no bradykinin effect)" },
  { drug: "Sacubitril-valsartan (ARNI)", klass: "Neprilysin inhibitor + ARB", effects: "Hypotension, hyperkalemia, angioedema; do not combine with an ACEi (36 h washout)" },
  { drug: "Beta-blockers", klass: "Beta-antagonist", effects: "Bradycardia, fatigue, bronchospasm, mask hypoglycemia, erectile dysfunction" },
  { drug: "Non-DHP CCB (verapamil, diltiazem)", klass: "Calcium channel blocker", effects: "Bradycardia, AV block, constipation (verapamil); avoid with beta-blockers" },
  { drug: "DHP CCB (amlodipine, nifedipine)", klass: "Calcium channel blocker", effects: "Peripheral edema, flushing, headache, reflex tachycardia" },
  { drug: "Thiazide diuretics", klass: "Diuretic", effects: "HypoK, hypoNa, hyperUricemia/gout, hyperGlycemia, hyperCalcemia, hyperLipidemia ('hyper-GLUC')" },
  { drug: "Loop diuretics (furosemide)", klass: "Diuretic", effects: "Hypokalemia, hypovolemia, ototoxicity, hypocalcemia, hyperuricemia, metabolic alkalosis, sulfa allergy" },
  { drug: "Spironolactone", klass: "Aldosterone antagonist", effects: "Hyperkalemia, gynecomastia, antiandrogen effects" },
  { drug: "Statins", klass: "HMG-CoA reductase inhibitor", effects: "Myalgia/myopathy/rhabdomyolysis, transaminitis; risk increased with fibrates" },
  { drug: "Nitrates", klass: "Vasodilator", effects: "Headache, hypotension, reflex tachycardia, tolerance; contraindicated with PDE5 inhibitors" },
  { drug: "Hydralazine", klass: "Arterial vasodilator", effects: "Reflex tachycardia, drug-induced lupus" },
  { drug: "Nitroprusside", klass: "Vasodilator", effects: "Cyanide toxicity with prolonged/high-dose use" },
  { drug: "Warfarin", klass: "Vitamin K antagonist", effects: "Bleeding, skin necrosis, teratogenic; many drug/diet interactions (monitor INR)" },
  { drug: "Heparin (unfractionated)", klass: "Anticoagulant", effects: "Bleeding, heparin-induced thrombocytopenia (HIT), osteoporosis" },
  { drug: "Clopidogrel / ticagrelor", klass: "P2Y12 inhibitor", effects: "Bleeding; ticagrelor also causes dyspnea" },
  { drug: "Adenosine", klass: "Antiarrhythmic", effects: "Transient asystole, flushing, chest pressure, bronchospasm" },
  { drug: "SGLT2 inhibitors", klass: "Antihyperglycemic / HF agent", effects: "Genital mycotic infections, euglycemic DKA, volume depletion" },
];
