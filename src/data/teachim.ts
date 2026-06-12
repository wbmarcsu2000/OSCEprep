/**
 * TeachIM (teachim.org) teaching content woven through the app: per-category
 * chalk-talk frameworks, a per-case "related teaching" link keyed by case id,
 * and per-skill references. Crawled from the full TeachIM chalk-talk library
 * and paraphrased into succinct teaching points; every block cites its source
 * page. Free open-access IM teaching — educational reference only.
 */

export interface ChalkTalk {
  title: string;
  points: string[];
  source: string;
  url: string;
}

export interface TeachingLink {
  title: string;
  url: string;
}

export const TEACHIM_ATTRIBUTION =
  "TeachIM (teachim.org) — free open-access Internal Medicine teaching, CC-licensed.";

/** Chalk-talk frameworks shown in each category's end-of-station teaching. */
export const CHALK_TALKS_BY_CATEGORY: Record<string, ChalkTalk[]> = {
  "Chest Pain": [
    {
      title: "ACS: subtypes, risk stratification & early management",
      points: [
        "Subtypes: STEMI (emergent revasc), NSTEMI & unstable angina (risk-stratified timing; UA managed like NSTEMI initially)",
        "Risk scores: GRACE (90-day death) <109 low / 109-140 mod / >140 high; TIMI (14-day) 0-1 low / 3-5 mod / 6-7 high",
        "Initial: ASA 325 mg once then 81 mg daily; NTG 0.4 mg SL q5min x3; beta-blocker <24h; morphine 2nd-line; O2 only if SpO2 <90%",
        "Anticoag: heparin peri-PCI (reversible); enoxaparin alt for NSTEMI medical mgmt; P2Y12 inhibitor after stenting",
        "STEMI: door-to-balloon <90 min; transfer if PCI <120 min else fibrinolytics; pursue PCI even if >12h unless occluded w/o ischemia",
        "NSTEMI timing: very high-risk (shock, instability, refractory angina) PCI <2h; high-risk (GRACE>140) <24h; mod 25-72h; low ischemia-guided",
        "Discharge: high-intensity statin <24h; ACE-I/ARB (all STEMI, NSTEMI if EF<40%/HTN/DM); MRA if EF<40%/HF/DM",
      ],
      source: "TeachIM — Management of Acute Coronary Syndrome",
      url: "https://teachim.org/teaching_material/acs/",
    },
    {
      title: "VTE/PE: 4-question management framework",
      points: [
        "Decide IF anticoagulation is warranted",
        "Decide WHERE to treat: inpatient vs outpatient",
        "Decide WHICH anticoagulant agent",
        "Decide HOW LONG to treat",
        "Uncomplicated PE with PESI score <85 may be managed as an outpatient",
      ],
      source: "TeachIM — Venous Thromboembolism (VTE)",
      url: "https://teachim.org/teaching_material/venous-thromboembolism-vte/",
    },
    {
      title: "Outpatient chest pain: pretest probability & stress test selection",
      points: [
        "Stratify by pretest probability of obstructive CAD: low <5%, intermediate 5-70%, high >70%",
        "Low risk: pursue alternative diagnoses; intermediate: stress test to confirm/exclude CAD",
        "High risk: ECG + stress imaging to rule out left main/proximal LAD disease; empiric medical mgmt",
        "Use CAD Consortium Score as a check on system-1 thinking, not a replacement for judgment",
        "First-line: exercise treadmill (cheap, functional, reproduces symptom); avoid if baseline ECG too abnormal",
        "Can't exercise: pharmacologic stress echo or nuclear imaging",
        "Positive-not-marked: medical therapy; markedly positive or failed therapy: coronary CTA or left heart cath",
      ],
      source: "TeachIM — Stress Testing - Outpatient Evaluation for Coronary Artery Disease",
      url: "https://teachim.org/teaching_material/chest-pain-outpatient-evaluation-of-coronary-artery-disease/",
    },
  ],
  "Abdominal Pain": [
    {
      title: "Empiric Antibiotics for Intra-Abdominal Infections (by acquisition + risk)",
      points: [
        "Community-acquired IAI: cover enteric GNRs (Enterobacteriaceae) + enteric anaerobes (Bacteroides)",
        "Low risk (no age >70, comorbidity, or delayed source control): 3rd-gen cephalosporin + metronidazole, or FQ + metronidazole",
        "High risk (any of those factors): IV piperacillin-tazobactam",
        "Hospital-acquired IAI: also cover Pseudomonas + Enterococcus; add vanc for MRSA risk; dapto/linezolid if VRE hx",
        "Hospital-acquired = infection >48h after source control, recent hospitalization >48h, or broad-spectrum abx >5d in past 90d",
        "Always pair antibiotics with source control (drainage, cholecystectomy, etc.)",
      ],
      source: "TeachIM — Antibiotics Part 2: Sites of Infection",
      url: "https://teachim.org/teaching_material/abx-2-sites/",
    },
    {
      title: "4 Questions to Pick Antibiotic Spectrum (GI/anaerobic focus)",
      points: [
        "Ask 4 Qs: GP coverage (incl MRSA)? GN (incl Pseudomonas)? Atypicals? Anaerobes (incl B. fragilis)?",
        "Best gut-anaerobe + Pseudomonas coverage: pip-tazo (broadest penicillin)",
        "Amp-sulbactam covers gut anaerobes; first-line for Enterococcus faecalis",
        "Carbapenems (meropenem, imipenem) = broadest: GP + GN + anaerobes",
        "Moxifloxacin = most reliable FQ for GI infections (anaerobic breadth)",
        "Avoid clindamycin for IAI: high B. fragilis resistance",
        "Enterococcus: E. faecalis ~90% amp-sensitive; E. faecium ~10% amp-sensitive",
      ],
      source: "TeachIM — Antibiotics – Part 1: Spectrum",
      url: "https://teachim.org/teaching_material/antibiotics-part-1-spectrum/",
    },
  ],
  "Syncope": [
    {
      title: "Syncope: 3-bucket approach (reflex, orthostatic, cardiac)",
      points: [
        "Syncope = global cerebral hypoperfusion; 6-8 sec of low flow causes LOC",
        "Reflex/vasovagal: triggers (standing, micturition, cough), typical prodrome (lightheaded, diaphoresis, nausea)",
        "Orthostatic: drop SBP >=20 or DBP >=10, or SBP <90 with symptoms; from drugs, volume loss, autonomic failure",
        "Cardiac: structural (aortic stenosis, HCM), arrhythmia (AV block, VT), or PE/tamponade",
        "Cardiac clues: exertional/supine syncope, sudden palpitations, FHx sudden death, no/short prodrome (<10s)",
        "Workup all: history, exam, orthostatic vitals, EKG; tailor further testing by suspected type",
      ],
      source: "TeachIM — Syncope",
      url: "https://teachim.org/teaching_material/syncope/",
    },
    {
      title: "Syncope: high-risk features warranting admission/workup",
      points: [
        "History: exertional or supine syncope, new chest pain/dyspnea, FHx sudden death, structural/CAD",
        "Exam: SBP <90, HR <40 awake, signs of GI bleed, undiagnosed systolic murmur",
        "EKG: 2nd-deg type II or 3rd-deg AV block, sinus pause >3s awake, sustained/NSVT, BBB, Q waves",
        "EKG: QTc <340 or >460 ms, Brugada, pre-excitation, ICD/pacer malfunction",
        "Cardiac monitoring by frequency: Holter 24-72h, event/patch 2-6wk, implantable loop recorder for years",
        "Echo (TTE) for suspected structural disease; consider CT for PE; stress test if exertional",
        "PE incidence in hospitalized syncope <3%",
      ],
      source: "TeachIM — Syncope",
      url: "https://teachim.org/teaching_material/syncope/",
    },
    {
      title: "VTE/PE: anticoagulation decisions (relevant to PE-caused syncope)",
      points: [
        "Four decisions: IF anticoagulate, WHERE (in vs outpatient), WHICH agent, HOW LONG",
        "Uncomplicated PE with PESI score <85 may be managed as outpatient",
        "DOACs are first-line for stable VTE, including most cancer-related VTE",
        "Unprovoked VTE without high bleed risk should get indefinite anticoagulation",
        "Low-risk below-knee DVT may be re-evaluated with repeat duplex in 1-2 weeks",
      ],
      source: "TeachIM — Venous Thromboembolism (VTE)",
      url: "https://teachim.org/teaching_material/venous-thromboembolism-vte/",
    },
    {
      title: "Anemia work-up (relevant to occult GI bleed presyncope)",
      points: [
        "Start with reticulocyte index: retic >3 = blood loss/hemolysis; low = underproduction",
        "Classify by MCV: microcytic <80, normocytic 80-100, macrocytic >100",
        "Iron deficiency: ferritin <30 (diagnostic), TSAT <20% suggestive, <10% very suggestive, TIBC elevated",
        "Anemia of chronic disease: low iron, low-normal TIBC, normal-high ferritin, TSAT <20% in 80%",
        "Hemolysis labs: high LDH, low haptoglobin, bilirubin, smear; DAT for immune vs non-immune",
        "Occult GI bleed presents as iron-deficiency microcytic anemia; check CBC/iron studies",
      ],
      source: "TeachIM — Work-up of Anemia",
      url: "https://teachim.org/teaching_material/work-up-of-anemia-chalk-talk-teachim/",
    },
  ],
  "Altered Mental Status": [
    {
      title: "Hyponatremia: 3-Lab Diagnostic Approach",
      points: [
        "3 labs: serum osm (is it real?), urine osm (ADH on/off?), urine Na (kidneys seeing enough volume?)",
        "Serum osm <290 = true hypoosmolar; 290-300 = pseudohyponatremia/artifact; >290 = hyperosmolar (e.g. glucose)",
        "Urine osm <100 = ADH off (primary polydipsia, beer potomania, tea & toast); >100 = ADH on",
        "Urine Na <25 mEq/L = low effective volume (hypovolemia, HF, cirrhosis); diuretics raise urine Na despite hypovolemia",
        "Urine Na >=25 mEq/L: SIADH (euvolemic), cerebral salt wasting (SAH/CNS), hypothyroid/adrenal insufficiency",
        "Framework is diagnostic only; does not cover correction-rate cutoffs",
      ],
      source: "TeachIM — Evaluation of Hyponatremia: 3 Lab Approach to Diagnosis",
      url: "https://teachim.org/teaching_material/evaluation-of-hyponatremia-3-lab-approach-to-diagnosis/",
    },
    {
      title: "UTI / Urosepsis: Site & Severity Framework",
      points: [
        "Buckets: simple cystitis (bladder only), complicated UTI (fever/chills or pyelo/prostatitis), CAUTI",
        "E. coli causes 75-95% of simple cystitis; also Proteus, Klebsiella, S. saprophyticus",
        "Simple cystitis: nitrofurantoin 100mg BID x5d, Bactrim x3d (if resistance <20%), or fosfomycin 3g x1",
        "Complicated UTI low MDR risk: IV ceftriaxone 1g daily; high risk/critically ill: pip-tazo or meropenem +/- vanc",
        "MDR risk (past 3 mo): prior MDR, healthcare stay, recent FQ/Bactrim/3rd-gen ceph, high-MDR travel",
        "CAUTI: >100k CFU + symptoms with catheter in past 48h; SEEK PP pathogens (Staph, Enterococcus, E.coli, Klebsiella, Pseudomonas, Proteus)",
      ],
      source: "TeachIM — Antibiotics Part 2: Sites of Infection",
      url: "https://teachim.org/teaching_material/abx-2-sites/",
    },
    {
      title: "Alcohol-Related Liver Disease: Diagnosis & Severity",
      points: [
        "Spectrum: steatosis (reversible) -> alcoholic steatohepatitis -> cirrhosis (irreversible)",
        "Alcoholic hepatitis: heavy use (>=3/d women, >=4/d men) >=60d, jaundice <8 wk, total bili >3.0",
        "Labs: AST >50, AST typically >=1.5x ALT, both values <400 IU/L; screen w/ RUQ US, CMP, CBC, INR",
        "Maddrey DF >=32 = severe AH (14-50% 28-day mortality); treat w/ prednisolone (28-day benefit only)",
        "Lille at day 4-7: <0.45 = steroid benefit; >=0.45 = poor response",
        "Steroid contraindications: active infection, AKI (Cr >2.5), multiorgan failure, uncontrolled GI bleed",
        "Cessation first-line: naltrexone/acamprosate + thiamine, folate, B vitamins; page does not cover CIWA/withdrawal",
      ],
      source: "TeachIM — Alcohol-related Liver Disease",
      url: "https://teachim.org/teaching_material/alcohol-related-liver-disease/",
    },
  ],
  "Dyspnea": [
    {
      title: "Approach to Hypoxemia: 5 Causes by A-a Gradient + First-line Workup",
      points: [
        "Hypoxemia = decreased PaO2; distinct from dyspnea and tissue-level hypoxia",
        "Elevated A-a gradient: V/Q mismatch, shunt, diffusion impairment",
        "Normal A-a gradient: hypoventilation, low FiO2",
        "First-line toolbox: CXR, CBC, EKG, and ABG vs VBG",
        "Get ABG over VBG when you need PaO2 (e.g., to calculate A-a gradient)",
      ],
      source: "TeachIM — Inpatient Evaluation of Hypoxemia",
      url: "https://teachim.org/teaching_material/inpatient-evaluation-of-hypoxia/",
    },
    {
      title: "CAP: Severity Scoring and Site of Care",
      points: [
        "CURB-65: 1 pt each; 0-1 mild, 2 moderate, 3-5 severe",
        "PSI: Class I-II mild, III moderate, IV-V severe (uses demographics, comorbidities, exam, labs/imaging)",
        "ATS severe CAP: >1 major OR ≥3 minor criteria",
        "Major criteria: septic shock, mechanical ventilation",
        "Site of care: outpatient if PSI I-II or CURB-65 0-1; floor if PSI IV-V or CURB-65 2-5; ICU if ≥1 major or ≥3 minor",
      ],
      source: "TeachIM — Community Acquired Pneumonia",
      url: "https://teachim.org/teaching_material/cap/",
    },
    {
      title: "CAP: Empiric Antibiotics and Duration",
      points: [
        "MRSA/Pseudomonas risk: prior colonization/infection, or hospitalization with IV abx within 90 days",
        "Severe CAP: IV beta-lactam (amp-sulbactam or ceftriaxone) PLUS azithromycin or doxycycline; or respiratory fluoroquinolone monotherapy",
        "MRSA coverage: IV vancomycin or linezolid",
        "Pseudomonas coverage: pip-tazo, cefepime, ceftazidime, aztreonam, or meropenem",
        "Outpatient no comorbidities: amoxicillin 1 g TID or doxycycline; avoid macrolide monotherapy (resistance)",
        "Duration 5-7 days; treat no less than 5 days; extend for empyema, abscess, necrotizing, or Pseudomonas",
      ],
      source: "TeachIM — Community Acquired Pneumonia",
      url: "https://teachim.org/teaching_material/cap/",
    },
    {
      title: "VTE/PE: IF-WHERE-WHICH-HOW LONG Framework",
      points: [
        "IF: does the thrombus warrant anticoagulation",
        "WHERE: inpatient vs outpatient initiation",
        "Uncomplicated PE with PESI <85 may be managed as outpatient",
        "WHICH: DOACs are first-line for stable VTE, including most cancer-related VTE",
        "HOW LONG: unprovoked VTE without high bleed risk gets indefinite anticoagulation",
        "Low-risk below-knee DVT: repeat duplex in 1-2 weeks before starting anticoagulation",
      ],
      source: "TeachIM — Venous Thromboembolism (VTE)",
      url: "https://teachim.org/teaching_material/venous-thromboembolism-vte/",
    },
  ],
  "Fever": [
    {
      title: "CAP: severity scoring & site of care (CURB-65 / PSI)",
      points: [
        "CURB-65: 1 pt each for Confusion, Urea >7, RR ≥30, SBP <90 or DBP ≤60, age ≥65",
        "CURB-65 0-1 mild → outpatient; 2 moderate; 3-5 severe",
        "PSI class I-II mild (outpatient), III moderate, IV-V severe (inpatient)",
        "ICU if ≥1 ATS major criterion (septic shock, mech ventilation) or ≥3 minor criteria",
        "Severe CAP workup: blood + sputum cultures, Legionella & pneumococcal urine antigens",
      ],
      source: "TeachIM — Community Acquired Pneumonia",
      url: "https://teachim.org/teaching_material/cap/",
    },
    {
      title: "CAP: empiric antibiotics & duration",
      points: [
        "MDR coverage (MRSA/Pseudomonas) if prior colonization/infection or IV abx + hospitalization within 90d",
        "Standard inpatient: IV beta-lactam (amp-sulbactam or ceftriaxone) + azithromycin/doxy",
        "Alternative: respiratory FQ (levofloxacin/moxifloxacin) monotherapy",
        "MRSA → vancomycin (or linezolid); Pseudomonas → pip-tazo, cefepime, ceftazidime, aztreonam, or meropenem",
        "Outpatient (no comorbid): amoxicillin 1g TID or doxycycline; with comorbid add macrolide/doxy",
        "Duration 5-7 days; longer for empyema, abscess, necrotizing, or Pseudomonas",
        "Avoid macrolide monotherapy (S. pneumoniae resistance); don't use procalcitonin to start abx",
      ],
      source: "TeachIM — Community Acquired Pneumonia",
      url: "https://teachim.org/teaching_material/cap/",
    },
    {
      title: "Antibiotics by site: empiric coverage for fever sources",
      points: [
        "Pyelonephritis/complicated UTI (no MDR): IV ceftriaxone 1g daily; MDR/critically ill → pip-tazo or meropenem",
        "Simple cystitis: nitrofurantoin 100mg BID x5d, TMP-SMX BID x3d, or fosfomycin 3g single dose",
        "Nonpurulent cellulitis/erysipelas: strep + MSSA → cephalexin (outpt), cefazolin/ceftriaxone (inpt)",
        "Purulent SSTI/abscess: S. aureus (MRSA 59%) → IV vancomycin; oral clinda, TMP-SMX, or doxy",
        "NSTI: IV vancomycin + pip-tazo/meropenem ± clindamycin for antitoxin effect",
        "CAP inpatient (no risk): 3rd-gen cephalosporin + macrolide or respiratory FQ monotherapy",
      ],
      source: "TeachIM — Antibiotics Part 2: Sites of Infection",
      url: "https://teachim.org/teaching_material/abx-2-sites/",
    },
    {
      title: "Antibiotic spectrum: 4 questions for empiric choice",
      points: [
        "Ask 4 questions: gram-positive (incl MRSA/Enterococcus), gram-negative (incl Pseudomonas/ESBL), atypicals, anaerobes",
        "Cephalosporins: 1st good GP, 3rd expanded GNR (ceftazidime adds Pseudomonas), 4th Pseudomonas, 5th ceftaroline = MRSA",
        "Carbapenems: broadest (GP/GN/anaerobe + ESBL); no MRSA or atypical coverage",
        "FQs: cipro for GU/GI GN, levo respiratory + better GP, moxi best anaerobe but limited Pseudomonas",
        "HA-MRSA: vancomycin first-line; daptomycin inactivated in lung (avoid pneumonia); linezolid better for MRSA pneumonia",
        "GN escalation: levofloxacin → ceftazidime → cefepime → pip-tazo → meropenem",
      ],
      source: "TeachIM — Antibiotics – Part 1: Spectrum",
      url: "https://teachim.org/teaching_material/antibiotics-part-1-spectrum/",
    },
  ],
  "Anemia": [
    {
      title: "Work-up of Anemia: underproduction vs hemolysis/loss",
      points: [
        "Step 1: retic index splits underproduction (marrow) vs overproduction (blood loss, hemolysis, sequestration); may be falsely low if concurrent underproduction",
        "Underproduction by MCV: microcytic <80, normocytic 80-100, macrocytic >100",
        "Iron deficiency: low Fe, high TIBC, sat <20% (very suggestive <10%), ferritin <30 mg/L; ferritin most sensitive",
        "Anemia of chronic disease: low Fe, low-normal TIBC, sat <20% in 80%, ferritin normal-high; coexisting Fe deficiency in 20-85%",
        "Hemolysis labs: high LDH, low haptoglobin, high indirect bili, smear; DAT/Coombs splits immune vs non-immune",
        "Immune (AIHA): warm = IgG, spherocytes; cold = IgM (lymphoma, mycoplasma, mono, PNH, syphilis)",
        "Non-immune: fragmentation (TTP/HUS/DIC, schistocytes) vs membrane/Hb/metabolic defects (G6PD, sickle)",
      ],
      source: "TeachIM — Work-up of Anemia",
      url: "https://teachim.org/teaching_material/work-up-of-anemia-chalk-talk-teachim/",
    },
  ],
  "Diarrhea": [
    {
      title: "C. diff: Testing & Severity Classification",
      points: [
        "Test only if risk factors + new diarrhea (>=3 stools/24h); use rectal swab if ileus",
        "Do NOT test asymptomatic patients — colonization is common",
        "Initial test: GDH antigen + toxin A/B PCR; confirm discordant results with NAAT",
        "Non-severe: WBC <=15,000/uL AND Cr <=1.5 mg/dL",
        "Severe: WBC >15k OR Cr >1.5 mg/dL; signs: abd tenderness, low albumin",
        "Fulminant: severe + hypotension/shock OR ileus/megacolon",
        "Recurrence ~20%, usually within first weeks up to 8 weeks post-episode",
      ],
      source: "TeachIM — C. diff Infection",
      url: "https://teachim.org/teaching_material/cdiffcolitis/",
    },
    {
      title: "C. diff: Treatment by Severity",
      points: [
        "Non-severe/severe: fidaxomicin preferred (2021 IDSA); oral vancomycin acceptable alternative",
        "Oral metronidazole only for low-risk non-severe cases",
        "Fulminant: high-dose PO vanc + IV metronidazole; rectal vanc if ileus",
        "Fulminant: consider surgery if no improvement; FMT if non-surgical candidate",
        "First recurrence: fidaxomicin preferred; pulse-dosed oral vanc alternative",
        "Subsequent recurrences: refer for FMT; bezlotoxumab reduces recurrence risk",
      ],
      source: "TeachIM — C. diff Infection",
      url: "https://teachim.org/teaching_material/cdiffcolitis/",
    },
  ],
  "Abnormal Liver Enzymes": [
    {
      title: "Diagnosing & grading acute alcoholic hepatitis (AH)",
      points: [
        "Clinical dx: heavy intake (>=3/day women, >=4/day men) >=60 days + jaundice onset within prior 8 wks",
        "Labs: AST >50, AST usually >=1.5x ALT (both <400 IU/L), AST:ALT often >2:1; total bili >3.0 mg/dL",
        "Maddrey discriminant fn (MDF) >=32 = severe/higher risk (14-50% 28-day mortality), consider pharmacotherapy",
        "Severe AH (MDF >32, MELD >20): consider prednisolone if no infection, AKI w/ Cr >2.5, multiorgan failure, or GI bleed",
        "Lille score day 4-7: <0.45 = steroid benefit, complete 28-day course; >=0.45 = no benefit, stop steroids",
      ],
      source: "TeachIM — Alcohol-related Liver Disease",
      url: "https://teachim.org/teaching_material/alcohol-related-liver-disease/",
    },
    {
      title: "Acute liver failure: definition, causes & workup",
      points: [
        "Definition (all 3): acute injury (elevated AST/ALT + bili, <26 wks, no chronic liver dz) + INR >1.5 + hepatic encephalopathy",
        "Etiology buckets: drugs/toxins (~50% US; acetaminophen #1, Amanita) | viral (A,B,D,E,HSV,VZV) | ischemic/vascular | other",
        "Other bucket: autoimmune hepatitis, HELLP, acute fatty liver of pregnancy, Wilson's disease",
        "Workup: acetaminophen level, tox screen, viral serologies/PCR, RUQ US w/ Doppler, pregnancy test",
        "Autoimmune: ANA, anti-smooth muscle Ab, anti-LKM-1, AMA, Igs; Wilson's: ceruloplasmin, 24h urine Cu, eye exam",
        "Empirically start NAC in ALF (benefit even in non-acetaminophen cases); prognosticate w/ King's College Criteria or MELD",
        "Transfer early to transplant center if meeting King's College Criteria",
      ],
      source: "TeachIM — Acute Liver Failure",
      url: "https://teachim.org/teaching_material/alf/",
    },
  ],
};

/** Per-case "related TeachIM teaching" link, keyed by case id. Shown on feedback. */
export const TEACHIM_BY_CASE: Record<string, TeachingLink> = {
  "ams-01": { title: "Management of Decompensated Cirrhosis", url: "https://teachim.org/teaching_material/management-of-decompensated-cirrhosis/" },
  "ams-05": { title: "Evaluation of Hyponatremia – 3 Lab Approach to Diagnosis", url: "https://teachim.org/teaching_material/evaluation-of-hyponatremia-3-lab-approach-to-diagnosis/" },
  "anemia-01": { title: "Work-up of Anemia", url: "https://teachim.org/teaching_material/work-up-of-anemia-chalk-talk-teachim/" },
  "anemia-02": { title: "Work-up of Anemia", url: "https://teachim.org/teaching_material/work-up-of-anemia-chalk-talk-teachim/" },
  "anemia-03": { title: "Work-up of Anemia", url: "https://teachim.org/teaching_material/work-up-of-anemia-chalk-talk-teachim/" },
  "anemia-04": { title: "Work-up of Anemia", url: "https://teachim.org/teaching_material/work-up-of-anemia-chalk-talk-teachim/" },
  "anemia-05": { title: "Work-up of Anemia", url: "https://teachim.org/teaching_material/work-up-of-anemia-chalk-talk-teachim/" },
  "chestpain-01": { title: "Management of Acute Coronary Syndrome", url: "https://teachim.org/teaching_material/acs/" },
  "chestpain-02": { title: "Venous Thromboembolism (VTE)", url: "https://teachim.org/teaching_material/venous-thromboembolism-vte/" },
  "diarrhea-01": { title: "C. diff Infection", url: "https://teachim.org/teaching_material/cdiffcolitis/" },
  "dyspnea-01": { title: "Chronic Heart Failure Management", url: "https://teachim.org/teaching_material/chronic-hf/" },
  "dyspnea-02": { title: "COPD – Outpatient Management", url: "https://teachim.org/teaching_material/copd-outpatient/" },
  "dyspnea-03": { title: "Community Acquired Pneumonia", url: "https://teachim.org/teaching_material/cap/" },
  "dyspnea-04": { title: "Venous Thromboembolism (VTE)", url: "https://teachim.org/teaching_material/venous-thromboembolism-vte/" },
  "dyspnea-06": { title: "Pleural Effusions", url: "https://teachim.org/teaching_material/pleural-effusions/" },
  "fever-01": { title: "Antibiotics Part 2: Sites of Infection", url: "https://teachim.org/teaching_material/abx-2-sites/" },
  "fever-02": { title: "Antibiotics Part 2: Sites of Infection", url: "https://teachim.org/teaching_material/abx-2-sites/" },
  "fever-04": { title: "Community Acquired Pneumonia", url: "https://teachim.org/teaching_material/cap/" },
  "liver-01": { title: "Acute Liver Failure", url: "https://teachim.org/teaching_material/alf/" },
  "liver-02": { title: "Alcohol-related Liver Disease", url: "https://teachim.org/teaching_material/alcohol-related-liver-disease/" },
  "liver-03": { title: "Acute Liver Failure", url: "https://teachim.org/teaching_material/alf/" },
  "syncope-01": { title: "Syncope", url: "https://teachim.org/teaching_material/syncope/" },
  "syncope-02": { title: "Syncope", url: "https://teachim.org/teaching_material/syncope/" },
  "syncope-03": { title: "Syncope", url: "https://teachim.org/teaching_material/syncope/" },
  "syncope-04": { title: "Syncope", url: "https://teachim.org/teaching_material/syncope/" },
  "syncope-05": { title: "Venous Thromboembolism (VTE)", url: "https://teachim.org/teaching_material/venous-thromboembolism-vte/" },
  "syncope-06": { title: "Syncope", url: "https://teachim.org/teaching_material/syncope/" },
};

/** Per-skill TeachIM reference, keyed by skill-card id. */
export const TEACHIM_BY_SKILL: Record<string, TeachingLink> = {
  "abg": { title: "Acid Base Disorders", url: "https://teachim.org/teaching_material/acid-base-disorders/" },
  "pleural": { title: "Pleural Effusions", url: "https://teachim.org/teaching_material/pleural-effusions/" },
  "ascitic": { title: "Management of Decompensated Cirrhosis", url: "https://teachim.org/teaching_material/management-of-decompensated-cirrhosis/" },
};

