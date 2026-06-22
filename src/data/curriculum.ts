/**
 * Per-category teaching curriculum, modeled on the clerkship OSCE review
 * session format: a broad differential organized into "buckets", the standard
 * focused-history questions, a targeted exam, a general work-up MENU (labs +
 * imaging with indications), worked practice cases (vignette → DDx → work-up →
 * results twist → updated DDx + next step), quick-and-dirty management, and
 * references.
 *
 * The OSCE grades thoroughness, not the single "right answer" — the ability to
 * generate a problem list, a broad differential, and a management plan. This
 * is an EDUCATIONAL reference layer, separate from the engine's clinical source
 * of truth (the case JSON). It never feeds reveals or scoring; it is shown only
 * at the end of a station. References name real societies/resources as study
 * starting points, not citations for any single statement.
 */

import { CHALK_TALKS_BY_CATEGORY, type ChalkTalk } from "./teachim";

export type { ChalkTalk };

export interface CurriculumRef {
  label: string;
  source: string;
  url?: string;
}

export interface DiffGroup {
  group: string;
  items: string[];
}

export interface QuestionTheme {
  theme: string;
  questions: string[];
}

export interface WorkupMenuItem {
  test: string;
  indication: string;
}

export interface WorkupMenu {
  labs: WorkupMenuItem[];
  imaging: WorkupMenuItem[];
}

/** A worked practice case in the OSCE-review format. */
export interface PracticeCase {
  vignette: string;
  ddx: string[];
  workup: string[];
  /** The results-twist prompt ("X comes back… now what?"). */
  twist?: string;
  updatedDdx?: string[];
  nextStep?: string;
}

export interface ManagementPearl {
  scenario: string;
  plan: string;
  /** Page in the MGH Housestaff Manual 2024–2025 this plan follows. */
  manualPage?: number;
}

/** A citation into the MGH Housestaff Manual 2024–2025 (PDF page). */
export interface ManualRef {
  section: string;
  page: number;
}

export const MGH_MANUAL = "MGH Housestaff Manual 2024–2025";

/** A named clinical-reasoning schema (how an expert organizes the problem). */
export interface ReasoningFramework {
  name: string;
  what: string;
  mnemonic?: string;
}

export const FRAMEWORKS: ReasoningFramework[] = [
  {
    name: "Differential buckets",
    what: "For a presenting complaint, generate broad categories first — by organ system or by mechanism — then populate each bucket. For abdominal pain, walk every organ that could refer there; for a metabolic complaint, walk the systems. Buckets prevent premature anchoring and make the list look complete to the examiner.",
  },
  {
    name: "Problem representation",
    what: "Compress the case into one sentence with semantic qualifiers (age/sex, tempo, key features) — 'an older man with acute, exertional, pressure-like chest pain and cardiac risk factors'. The one-liner activates the right illness scripts.",
  },
  {
    name: "Must-not-miss first (dual-process)",
    what: "Generate a fast leading diagnosis, then deliberately run the checklist of immediately dangerous causes and ask 'what would I lose by missing this?' before narrowing.",
  },
  {
    name: "The surgical sieve (VINDICATE)",
    what: "When the buckets run dry, generate categories systematically instead of free-associating.",
    mnemonic: "Vascular · Infective · Neoplastic · Degenerative · Iatrogenic/drugs · Congenital · Autoimmune · Traumatic · Endocrine/metabolic",
  },
  {
    name: "Show your thinking",
    what: "The OSCE grades clinical reasoning, not the right answer. Write/say EVERYTHING you're considering — the broad differential, the work-up you'd order and why, and how results change your plan. A thorough, well-justified wrong leading diagnosis outscores a bare correct guess.",
  },
];

export interface CategoryCurriculum {
  category: string;
  /** Which reasoning schema(s) best structure this complaint. */
  framework: string;
  /** One-line strategy: how to frame this complaint on entry. */
  strategy: string;
  cantMiss: string[];
  /** Core differential shown by default — the concise, must-know buckets. */
  differential: DiffGroup[];
  /** Expanded "advanced" differential (a superset of `differential`) for the
   *  opt-in Advanced mode of the Differential drill. Same buckets, broadened
   *  with high-yield + can't-miss causes drawn from the MGH Housestaff Manual. */
  differentialAdvanced: DiffGroup[];
  keyQuestions: QuestionTheme[];
  examFocus: string[];
  workupMenu: WorkupMenu;
  tools: string[];
  practiceCases: PracticeCase[];
  quickManagement: ManagementPearl[];
  references: CurriculumRef[];
  /** Relevant MGH Housestaff Manual sections + pages for this complaint, so the
   *  drills and stations cite the same source. Injected at module load. */
  manual: ManualRef[];
  /** Teaching frameworks distilled from TeachIM chalk talks. Injected at
   *  module load (keyed by category). */
  chalkTalks: ChalkTalk[];
}

const MDCALC = "https://www.mdcalc.com/";
const LITFL_ECG = "https://litfl.com/top-100/ecg/";
const LITFL_CXR = "https://litfl.com/top-100/cxr/";
const RADIOPAEDIA = "https://radiopaedia.org/";

const OLDCARTS: QuestionTheme = {
  theme: "Characterize the symptom (OLDCARTS)",
  questions: [
    "Onset — what were you doing when it started? Sudden or gradual?",
    "Location and radiation",
    "Duration and time course — constant, waxing/waning, worsening?",
    "Character — in the patient's own words",
    "Aggravating / alleviating factors",
    "Timing and prior similar episodes",
    "Severity (0–10) and functional impact",
  ],
};

type RawCurriculum = Omit<CategoryCurriculum, "manual" | "chalkTalks">;

const RAW_CURRICULUM: RawCurriculum[] = [
  // ---------------------------------------------------------------- Chest Pain
  {
    category: "Chest Pain",
    framework: "Anatomic (chest wall → pleura → lung → vessels → heart → esophagus) over must-not-miss-first. Resident must-not-miss grouping: 4 cardiac (ACS, tamponade, aortic dissection, pericarditis), 2 GI (esophageal rupture, impaction), 2 respiratory (pneumothorax, PE).",
    strategy:
      "In every chest-pain patient, actively exclude the immediately life-threatening causes before settling on a benign one.",
    cantMiss: [
      "ACS (STEMI / NSTEMI / unstable angina)",
      "Aortic dissection",
      "Pulmonary embolism",
      "Tension pneumothorax",
      "Esophageal rupture (Boerhaave)",
      "Pericarditis with tamponade",
    ],
    differential: [
      { group: "Cardiac", items: ["ACS", "Stable / vasospastic angina", "Pericarditis / myocarditis", "Aortic stenosis", "Heart failure"] },
      { group: "Vascular", items: ["Aortic dissection"] },
      { group: "Pulmonary", items: ["PE", "Pneumothorax", "Pneumonia / pleurisy"] },
      { group: "GI", items: ["GERD / esophageal spasm", "Peptic ulcer / perforation", "Biliary disease", "Pancreatitis"] },
      { group: "MSK / Skin", items: ["Costochondritis", "Muscle strain", "Rib injury", "Herpes zoster"] },
      { group: "Other", items: ["Anxiety / panic", "Anemia (demand ischemia)"] },
    ],
    differentialAdvanced: [
      { group: "Cardiac", items: ["ACS", "Stable / vasospastic angina", "Pericarditis / myocarditis", "Aortic stenosis", "Heart failure", "Takotsubo (stress) cardiomyopathy", "HOCM (dynamic LVOT obstruction)", "Cocaine-induced vasospasm / MI"] },
      { group: "Vascular", items: ["Aortic dissection", "Acute aortic syndrome (IMH / penetrating ulcer)"] },
      { group: "Pulmonary", items: ["PE", "Pneumothorax", "Pneumonia / pleurisy", "Pleural effusion / empyema", "Pulmonary hypertension / cor pulmonale", "Malignancy (lung / mediastinal)"] },
      { group: "GI", items: ["GERD / esophageal spasm", "Peptic ulcer / perforation", "Biliary disease", "Pancreatitis", "Boerhaave (esophageal rupture)", "Esophagitis (pill / infectious / eosinophilic)"] },
      { group: "MSK / Skin", items: ["Costochondritis", "Muscle strain", "Rib injury", "Herpes zoster", "Sternal / vertebral compression fracture"] },
      { group: "Other", items: ["Anxiety / panic", "Anemia (demand ischemia)", "Acute chest syndrome (sickle cell)"] },
    ],
    keyQuestions: [
      OLDCARTS,
      {
        theme: "Quality clues that separate the can't-miss causes",
        questions: [
          "Pressure/heaviness, exertional, radiating to arm/jaw, diaphoresis, nausea → ACS",
          "Sudden tearing pain to the back, maximal at onset → dissection",
          "Pleuritic + dyspnea ± calf pain, recent travel/immobility → PE",
          "Sharp, positional, relieved leaning forward → pericarditis",
          "Reproducible with palpation → MSK (does not exclude ACS)",
        ],
      },
      {
        theme: "Risk factors & red flags",
        questions: [
          "Cardiac risk: HTN, hyperlipidemia, diabetes, smoking, family history of early CAD",
          "VTE risk: surgery/immobility, malignancy, prior clot, estrogen/OCPs",
          "Connective-tissue disease, uncontrolled HTN (dissection)",
          "Syncope, focal neuro deficit, pulse/BP asymmetry",
        ],
      },
    ],
    examFocus: [
      "Vitals incl. bilateral BP; SpO₂; respiratory distress",
      "Cardiac — murmur, rub, S3/S4, JVP",
      "Lungs — asymmetry, crackles, absent breath sounds",
      "Legs — unilateral calf swelling/tenderness (DVT)",
      "Chest wall — reproducible tenderness; skin (zoster)",
    ],
    workupMenu: {
      labs: [
        { test: "Troponin (serial)", indication: "ACS, demand ischemia — trend to peak" },
        { test: "CBC", indication: "anemia, infection" },
        { test: "BMP", indication: "electrolytes, renal function (esp. before cath)" },
        { test: "BNP", indication: "heart failure" },
        { test: "D-dimer", indication: "PE only when pre-test probability is low (PERC/Wells first)" },
        { test: "Lipase", indication: "epigastric radiation — pancreatitis" },
      ],
      imaging: [
        { test: "EKG (within 10 min)", indication: "every chest-pain patient" },
        { test: "Chest X-ray", indication: "pneumothorax, widened mediastinum, effusion, pneumonia" },
        { test: "CT angiography", indication: "dissection or PE" },
        { test: "Echocardiography", indication: "wall-motion, valve disease, effusion/tamponade" },
        { test: "Stress test", indication: "risk stratification once ACS excluded" },
      ],
    },
    tools: ["HEART score", "TIMI / GRACE (ACS)", "Wells + PERC (PE)", "Age-adjusted D-dimer"],
    practiceCases: [
      {
        vignette: "68 F, crushing substernal chest pain and dyspnea minutes after a sudden severe emotional shock.",
        ddx: ["Takotsubo (stress) cardiomyopathy", "Anterior STEMI / ACS", "Aortic dissection", "Pulmonary embolism", "Myocarditis", "Pericarditis"],
        workup: ["EKG", "Troponin (serial)", "CBC", "BMP + Mg", "CXR", "Coronary angiography", "Echocardiogram"],
        twist: "Coronaries are clean on cath but the LV apex balloons and troponin is only mildly up — diagnosis?",
        updatedDdx: ["Takotsubo (stress) cardiomyopathy"],
        nextStep:
          "Treated as ACS until the cath was clean. Now supportive HF care (gentle diuresis, β-blocker/ACEi as tolerated); correct QT (K >4.0, Mg) with telemetry for torsades; avoid catecholamines/inotropes; anticoagulate if apical thrombus; repeat echo to confirm recovery; bereavement/social-work support.",
      },
      {
        vignette: "54 M, squeezing chest pain ×2 months, worse with exertion / better with rest, new episode today.",
        ddx: ["Stable angina", "Unstable angina / ACS", "Vasospastic angina", "Heart failure", "COPD/asthma", "Anemia"],
        workup: ["EKG", "Troponin", "CBC", "CXR", "± BNP"],
        twist: "Troponin 50, EKG normal — leading diagnosis and next steps?",
        updatedDdx: ["NSTEMI (trend troponin to peak)"],
        nextStep:
          "If troponin rising → admit, DAPT, sublingual nitro (unless hypotensive), heparin, β-blocker if HDS, cardiology for non-emergent cath; high-intensity statin + ACE/ARB. If stable → non-invasive testing (stress/echo); HEART score to risk-stratify.",
      },
      {
        vignette: "70 F, chest discomfort, syncope, dyspnea, SpO₂ in the 80s.",
        ddx: ["Arrhythmia (AFib)", "ACS", "Saddle PE", "Pneumothorax / tamponade", "Pneumonia", "Aortic stenosis", "Heart failure", "Anemia"],
        workup: ["CBC", "BMP", "Troponin", "EKG", "CXR", "± CTPE or D-dimer", "± BNP"],
        twist: "Troponin negative, EKG and CXR unremarkable, persistently hypoxic — now what?",
        updatedDdx: ["PE", "Pulmonary HTN", "Aortic stenosis", "ADHF", "Occult arrhythmia"],
        nextStep:
          "POCUS, assess PE risk / Wells; D-dimer if low pre-test probability, otherwise proceed to CTPE. Supplemental O₂. Likely admission for echo ± Holter.",
      },
      {
        vignette: "50 M, severe acute chest pain radiating to the back.",
        ddx: ["Aortic dissection", "Esophageal rupture", "ACS", "Pancreatitis", "Ruptured peptic ulcer", "Pneumothorax", "Pericarditis"],
        workup: ["CBC", "BMP", "Troponin", "EKG", "CXR", "Lipase"],
        twist: "EKG/troponin/lipase/CBC/BMP normal; CXR with mediastinal widening — leading diagnosis?",
        updatedDdx: ["Aortic dissection"],
        nextStep:
          "Two large-bore IVs; CTA if HDS, TEE if unstable. Type A → surgical emergency. Type B → IV labetalol/esmolol, ICU for close monitoring.",
      },
    ],
    quickManagement: [
      {
        scenario: "Troponin 400, new STEMI in V5–V6/aVL",
        plan: "Activate cath lab, aim <90 min to wire crossing (fibrinolysis if PCI >120 min away); aspirin 325 mg load, anticoagulation (heparin), high-intensity statin (atorvastatin 80), nitrates for pain, O₂ if hypoxic. Hold the P2Y12 load until discussed with cardiology. D/C on β-blocker, ACEi, statin + P2Y12 ×1 yr if stented.",
      },
      {
        scenario: "Pleuritic pain, CTPE with segmental occlusion",
        plan: "Heparin/LMWH (or outpatient DOAC if low-risk); tPA if massive PE (unstable) vs thrombectomy.",
      },
      {
        scenario: "Volume-overloaded, ↑BNP, ACS work-up negative",
        plan: "Diurese (Lasix 40 IV BID if naïve, else 1–2× home oral dose IV), daily weights, strict I/Os, echo. GDMT: ARNI/ARB, β-blocker, SGLT2, MRA (HFpEF: SGLT2 ± MRA/ARNI).",
      },
    ],
    references: [
      { label: "Evaluation & diagnosis of chest pain", source: "2021 AHA/ACC Chest Pain Guideline (Gulati et al., Circulation 2021;144:e368)" },
      { label: "Acute PE diagnosis & management", source: "ESC 2019 Acute Pulmonary Embolism Guideline" },
      { label: "HEART / Wells / PERC calculators", source: "MDCalc", url: MDCALC },
      { label: "Ischemia ECG patterns", source: "LITFL Top 100 ECG", url: LITFL_ECG },
    ],
  },

  // ------------------------------------------------------------- Abdominal Pain
  {
    category: "Abdominal Pain",
    framework: "Buckets by location + organ system, screening for the surgical / vascular abdomen. Must-not-miss mnemonic 'POV-GI': Perforation (appendicitis, PUD), Obstruction (SBO, large-bowel), Vascular (mesenteric ischemia, AAA, MI), GU (ectopic pregnancy, ovarian torsion), Infection/inflammation (pancreatitis, cholecystitis, diverticulitis).",
    strategy:
      "Let location plus onset narrow the field, but for any abdominal pain walk every organ system that could refer there, and always screen for the emergencies that need the OR or IR.",
    cantMiss: [
      "Ruptured AAA",
      "Mesenteric ischemia",
      "Perforated viscus",
      "Bowel obstruction with strangulation",
      "Ruptured ectopic pregnancy",
      "ACS presenting as epigastric pain",
    ],
    differential: [
      { group: "RUQ", items: ["Cholecystitis / biliary colic", "Cholangitis", "Hepatitis", "Hepatic abscess"] },
      { group: "Epigastric", items: ["Pancreatitis", "PUD ± perforation", "Gastritis", "Referred MI"] },
      { group: "RLQ", items: ["Appendicitis", "Ectopic / ovarian torsion", "PID", "Crohn's"] },
      { group: "LLQ", items: ["Diverticulitis", "Sigmoid volvulus", "Colitis"] },
      { group: "Diffuse / vascular", items: ["SBO", "Mesenteric ischemia", "Ruptured AAA", "Peritonitis / SBP"] },
      { group: "Medical mimics", items: ["DKA", "Adrenal crisis", "Lower-lobe pneumonia", "Pyelonephritis / stone"] },
    ],
    differentialAdvanced: [
      { group: "RUQ", items: ["Cholecystitis / biliary colic", "Cholangitis", "Hepatitis", "Hepatic abscess", "Budd-Chiari / portal vein thrombosis", "Fitz-Hugh-Curtis (perihepatitis)"] },
      { group: "Epigastric", items: ["Pancreatitis", "PUD ± perforation", "Gastritis", "Referred MI", "GERD / esophagitis", "Gastroparesis / functional dyspepsia", "Boerhaave (esophageal rupture)", "Gastric outlet obstruction"] },
      { group: "RLQ", items: ["Appendicitis", "Ectopic / ovarian torsion", "PID", "Crohn's", "Mesenteric / ileocolic lymphadenitis", "Cecal volvulus"] },
      { group: "LLQ", items: ["Diverticulitis", "Sigmoid volvulus", "Colitis", "Ischemic colitis", "Constipation / fecal impaction"] },
      { group: "LUQ", items: ["Splenic infarct / rupture"] },
      { group: "Suprapubic / GU", items: ["Cystitis / urinary retention", "Prostatitis", "Epididymo-orchitis / testicular torsion"] },
      { group: "Diffuse / vascular", items: ["SBO", "Mesenteric ischemia", "Ruptured AAA", "Peritonitis / SBP", "Incarcerated / strangulated hernia", "Gastroenteritis", "Bowel perforation (free air)", "Aortic dissection", "Toxic megacolon"] },
      { group: "Medical mimics", items: ["DKA", "Adrenal crisis", "Lower-lobe pneumonia", "Pyelonephritis / stone", "Hypercalcemia", "Acute intermittent porphyria", "HSP / IgA vasculitis", "Sickle cell vaso-occlusive crisis"] },
    ],
    keyQuestions: [
      OLDCARTS,
      {
        theme: "Localizing & danger features",
        questions: [
          "Pain out of proportion to exam → mesenteric ischemia",
          "Tearing pain to back + syncope → AAA",
          "Periumbilical → RLQ migration → appendicitis",
          "Colicky pain, vomiting, distension, no flatus → obstruction",
          "Fever + RUQ pain + jaundice (Charcot) → cholangitis",
        ],
      },
      {
        theme: "Associated & background",
        questions: [
          "Nausea/vomiting, bowel-habit change, GI bleeding, anorexia",
          "Relation to meals; alcohol (pancreatitis); fatty foods (biliary)",
          "Prior surgery (adhesions), AF/vascular disease (ischemia), LMP (ectopic)",
        ],
      },
    ],
    examFocus: [
      "Vitals — fever, tachycardia, hypotension (peritonitis/sepsis)",
      "Inspection, auscultation, percussion, palpation by quadrant",
      "Peritoneal signs — guarding, rigidity, rebound; CVA tenderness",
      "Special tests: Murphy (cholecystitis); psoas / Rovsing / obturator (appendicitis); fluid wave",
      "Pulsatile mass; hernia orifices; rectal/pelvic exam as indicated",
    ],
    workupMenu: {
      labs: [
        { test: "CBC", indication: "leukocytosis (infection/inflammation), hemoglobin" },
        { test: "BMP", indication: "dehydration, electrolytes, renal function" },
        { test: "LFTs", indication: "hepatitis, biliary disease, gallstone pancreatitis" },
        { test: "Lipase", indication: "epigastric pain — pancreatitis" },
        { test: "Pregnancy test (β-hCG)", indication: "anyone with pregnancy potential" },
        { test: "UA", indication: "hematuria, dysuria, flank pain; GC/chlamydia NAAT if PID" },
      ],
      imaging: [
        { test: "RUQ ultrasound", indication: "RUQ / epigastric pain — first-line biliary" },
        { test: "Abdominal X-ray / KUB", indication: "free air, initial SBO evaluation" },
        { test: "CT abdomen/pelvis", indication: "diverticulitis (PO+IV), appendicitis (IV), non-contrast for stone" },
        { test: "CT angiogram", indication: "concern for mesenteric ischemia" },
        { test: "Transvaginal ultrasound", indication: "ectopic / ovarian / tubo-ovarian pathology" },
      ],
    },
    tools: ["Alvarado score (appendicitis)", "Glasgow-Imrie / Ranson (pancreatitis)", "Tokyo criteria (cholecystitis)"],
    practiceCases: [
      {
        vignette: "44 F on chronic steroids stops them during a flu-like illness; diffuse abdominal pain, vomiting, weakness, BP 84/52.",
        ddx: ["Adrenal (Addisonian) crisis", "Septic shock / intra-abdominal sepsis", "Surgical abdomen", "Gastroenteritis with dehydration", "DKA"],
        workup: ["BMP (Na/K/glucose)", "Random cortisol + ACTH", "CBC", "Lactate", "VBG", "Lipase", "UA + cultures", "EKG"],
        twist: "Na 126, K 6.2, glucose 54 with relative eosinophilia and a low cortisol — diagnosis and first drug?",
        updatedDdx: ["Adrenal (Addisonian) crisis"],
        nextStep:
          "IV hydrocortisone 100 mg immediately (before the cortisol result); isotonic saline with dextrose; treat hyperkalemia by EKG; never give levothyroxine before steroids; admit to a monitored bed; steroid sick-day education before discharge.",
      },
      {
        vignette: "65 M, severe epigastric pain, anorexia, nausea, history of alcohol use.",
        ddx: ["Pancreatitis", "PUD ± perforation", "Gastritis", "Biliary disease", "Referred MI"],
        workup: ["CBC", "BMP", "LFTs", "Lipase", "EKG", "Troponin", "RUQ US"],
        twist: "Leukocytosis; BMP/EKG/trop unremarkable; ↑alk phos; lipase ~450 (nl 24–151) — differential and next step?",
        updatedDdx: ["Acute pancreatitis — gallstone vs alcohol-associated"],
        nextStep:
          "RUQ US, NPO, analgesia, antiemetics, IVF. If US equivocal → MRCP or CTAP with contrast, check triglycerides. If gallstones → surgery for cholecystectomy.",
      },
      {
        vignette: "31 F, RLQ pain, nausea, vomiting, BP 100/72.",
        ddx: ["Appendicitis", "Ruptured ectopic", "Ovarian torsion", "PID", "Ureterolithiasis", "Pyelonephritis", "Inguinal hernia"],
        workup: ["CBC", "BMP", "β-hCG", "UA", "CT A/P (IV) vs transvaginal US (if +hCG or gyn suspicion)", "± pelvic exam + GC/chlamydia NAAT"],
        twist: "CT shows fat stranding and appendiceal inflammation.",
        updatedDdx: ["Acute appendicitis"],
        nextStep: "Consult surgery for appendectomy; NPO, IVF, analgesia, antibiotics.",
      },
      {
        vignette: "83 F, 3 days periumbilical pain, nausea, vomiting, prior abdominal surgery.",
        ddx: ["Small bowel obstruction", "Incarcerated hernia", "Strangulated / ischemic bowel", "Mesenteric ischemia", "Gastroenteritis", "Early appendicitis", "SBP"],
        workup: ["CBC", "BMP", "Lactate", "KUB / abdominal X-ray", "CT A/P", "CT angiogram if high ischemia suspicion"],
      },
    ],
    quickManagement: [
      {
        scenario: "Diverticulitis",
        plan: "Outpatient: liquid diet, oral analgesia, often no antibiotics, return in 1 week. Inpatient (elderly/sick/can't tolerate PO/complicated): NPO, IV analgesia, IVF, IV antibiotics covering GNRs + anaerobes (ceftriaxone + metronidazole or piperacillin-tazobactam).",
      },
      {
        scenario: "Suspected variceal bleed",
        plan: "Two large-bore IVs, IVF, type & screen, transfuse for Hgb <7, NPO for possible procedure; IV PPI (pantoprazole 40 BID), octreotide, ceftriaxone; GI consult → EGD.",
      },
    ],
    references: [
      { label: "Acute pancreatitis", source: "ACG 2013 Acute Pancreatitis Guideline; Revised Atlanta classification" },
      { label: "Acute cholecystitis / cholangitis", source: "Tokyo Guidelines (TG18)" },
      { label: "Diverticulitis", source: "ACG 2021 Diverticulitis Guideline" },
      { label: "Abdominal CT/US findings", source: "Radiopaedia", url: RADIOPAEDIA },
    ],
  },

  // ------------------------------------------------------------------- Syncope
  {
    category: "Syncope",
    framework: "Mechanistic branch point: reflex vs orthostatic vs cardiac vs non-syncope mimic. Resident must-not-miss: cardiac (arrhythmia incl. heart block, HOCM, MI), pulmonary (PE), and seizure.",
    strategy:
      "Transient global hypoperfusion — separate benign reflex syncope from cardiac syncope (the lethal subset) and from mimics. Don't forget orthostatics and an EKG on everyone.",
    cantMiss: [
      "Ventricular arrhythmia / structural heart disease",
      "High-grade AV block",
      "Aortic stenosis / HOCM",
      "Massive PE",
      "Aortic dissection",
      "Occult hemorrhage (GI bleed, ruptured AAA, ectopic)",
    ],
    differential: [
      { group: "Reflex (neurally mediated)", items: ["Vasovagal", "Situational", "Carotid sinus"] },
      { group: "Orthostatic", items: ["Volume depletion", "Drug-induced", "Autonomic failure (Parkinson's, DM)"] },
      { group: "Cardiac — arrhythmic", items: ["AV block / bradycardia", "VT/VF", "SVT / AFib", "Channelopathy (long QT, Brugada)"] },
      { group: "Cardiac — structural/obstructive", items: ["Aortic stenosis", "HOCM", "PE", "Tamponade", "Dissection"] },
      { group: "Mimics", items: ["Seizure", "Hypoglycemia", "Stroke/TIA (rare)", "Psychogenic"] },
    ],
    differentialAdvanced: [
      { group: "Reflex (neurally mediated)", items: ["Vasovagal", "Situational", "Carotid sinus"] },
      { group: "Orthostatic", items: ["Volume depletion", "Drug-induced", "Autonomic failure (Parkinson's, DM)", "Acute hemorrhage (GI bleed, ruptured AAA, ectopic)", "Adrenal insufficiency", "POTS"] },
      { group: "Cardiac — arrhythmic", items: ["AV block / bradycardia", "VT/VF", "SVT / AFib", "Channelopathy (long QT, Brugada)", "Sick sinus syndrome / sinus pause", "WPW / pre-excited AFib", "ARVC"] },
      { group: "Cardiac — structural/obstructive", items: ["Aortic stenosis", "HOCM", "PE", "Tamponade", "Dissection", "Pulmonary hypertension / RV failure", "Acute MI / ischemia", "Atrial myxoma / ball-valve thrombus"] },
      { group: "Mimics", items: ["Seizure", "Hypoglycemia", "Stroke/TIA (rare)", "Psychogenic", "Hypoxia / hypercarbia", "Intoxication (alcohol, sedatives, CO)"] },
    ],
    keyQuestions: [
      {
        theme: "The event — before, during, after",
        questions: [
          "Prodrome: nausea/warmth/tunnel vision (reflex) vs none (cardiac)",
          "Trigger: prolonged standing, micturition, cough (reflex) vs exertion (cardiac/AS)",
          "Position; exertional or supine syncope is a red flag",
          "Witnessed movements, tongue biting, post-ictal confusion → seizure",
          "Rapid recovery (syncope) vs prolonged confusion (seizure)",
        ],
      },
      {
        theme: "Red flags & volume/bleeding",
        questions: [
          "Palpitations preceding, no prodrome, injury from the fall",
          "Family history of sudden death / inherited arrhythmia; known structural disease",
          "Melena, hematemesis, abdominal/back pain (occult bleed)",
          "Poor intake, diuretics, antihypertensives, QT-prolonging drugs",
        ],
      },
    ],
    examFocus: [
      "Orthostatic vitals (supine → standing BP/HR)",
      "Cardiac murmurs — crescendo-decrescendo of AS, HOCM; irregular rhythm",
      "HEENT — tongue bites; carotid bruit",
      "Neuro — focal deficits; extremities — skin turgor, warmth, cap refill, edema",
      "Rectal exam for melena if bleeding suspected",
    ],
    workupMenu: {
      labs: [
        { test: "BMP + glucose", indication: "electrolytes, hypoglycemia" },
        { test: "CBC", indication: "anemia / occult bleed" },
        { test: "± Troponin", indication: "if ACS suspected" },
        { test: "± D-dimer", indication: "if PE suspected (low pre-test probability)" },
        { test: "Pregnancy test", indication: "ectopic in anyone who can be pregnant" },
      ],
      imaging: [
        { test: "EKG (± Holter on discharge)", indication: "every syncope patient" },
        { test: "Echocardiography", indication: "LVOT obstruction, valvular disease" },
        { test: "Carotid ultrasound", indication: "bruit / suspected cerebrovascular" },
        { test: "CT/MR brain", indication: "concern for stroke/TIA or seizure; EEG if seizure" },
        { test: "Stress test / CTPE", indication: "exertional syncope / PE concern" },
      ],
    },
    tools: ["Canadian Syncope Risk Score", "San Francisco Syncope Rule"],
    practiceCases: [
      {
        vignette: "22 M, syncope during a burst of fast irregular palpitations while exercising; baseline EKG has a short PR and a delta wave.",
        ddx: ["Pre-excited atrial fibrillation (WPW)", "Polymorphic VT / VT", "Other SVT", "HCM / structural", "Long QT syndrome"],
        workup: ["12-lead EKG + rhythm strip", "Continuous telemetry", "BMP + Mg", "Troponin", "TSH", "Echocardiogram", "EP referral"],
        twist: "The monitor shows a very fast, broad, IRREGULAR tachycardia with beat-to-beat QRS changes — which drugs are dangerous?",
        updatedDdx: ["Pre-excited atrial fibrillation in WPW"],
        nextStep:
          "Cardiovert if unstable; if stable use procainamide or ibutilide. AVOID all AV-nodal blockers (adenosine, β-blockers, CCBs, digoxin) — they can precipitate VF. Telemetry with pads; urgent EP referral for accessory-pathway ablation; no AV-nodal blocker at discharge; sport restriction until ablated.",
      },
      {
        vignette: "70 M, syncope while walking up stairs, returned to baseline immediately; murmur + irregular rhythm on exam.",
        ddx: ["Aortic stenosis", "ACS", "Carotid insufficiency", "Arrhythmia / AFib"],
        workup: ["BMP", "Troponin", "EKG", "Echo"],
        twist: "BMP/trop/EKG normal, echo negative; team plans discharge — differential and work-up?",
        updatedDdx: ["Arrhythmia", "Orthostasis", "Unstable angina"],
        nextStep: "Orthostatic vitals, Holter monitor on discharge; consider stress testing if work-up remains negative.",
      },
      {
        vignette: "85 M (HTN, DM, Parkinson's), syncope on standing from bed.",
        ddx: ["Medication-induced orthostasis", "Autonomic instability (Parkinson's/DM)", "Hypovolemia", "Cardiac"],
        workup: ["BMP", "EKG", "Extensive medication reconciliation", "Orthostatic vitals", "± echo"],
      },
      {
        vignette: "65 F (HLD), 1 min of syncope with severe chest pain and left-sided weakness, both fully resolved.",
        ddx: ["TIA", "ACS", "Valvular disease", "PE", "Aortic dissection involving carotid"],
        workup: ["Troponin", "EKG", "CT brain", "CTA head/neck", "± MR brain", "Echo"],
        twist: "Trop negative, EKG normal, CT brain negative, CTA with 80% right carotid stenosis.",
        updatedDdx: ["TIA (symptomatic carotid stenosis)"],
        nextStep:
          "Admit for MRI brain; echo to exclude cardioembolic source; lipids + A1c; DAPT + high-intensity statin; carotid endarterectomy for symptomatic stenosis >70%.",
      },
    ],
    quickManagement: [
      {
        scenario: "New AFib on EKG, hemodynamically stable",
        plan: "Rate control (metoprolol — avoid in ADHF; diltiazem/verapamil — avoid in HFrEF). Treat underlying cause (sepsis, thyroid, alcohol withdrawal). Rhythm control if new/symptomatic (electrical or chemical; if >48 h/unknown duration → TEE-guided or anticoagulate 3 wk then cardiovert, then ≥4 wk anticoagulation). Anticoagulate if CHA₂DS₂-VASc ≥2 (men) / ≥3 (women), DOAC > warfarin.",
      },
      {
        scenario: "New AFib, BP 83/50, HR 165",
        plan: "Urgent synchronized cardioversion + rate control + anticoagulation.",
      },
    ],
    references: [
      { label: "Syncope evaluation & management", source: "2017 ACC/AHA/HRS Syncope Guideline (Shen et al., Circulation 2017)" },
      { label: "ESC perspective", source: "ESC 2018 Syncope Guideline" },
      { label: "AV block & arrhythmia ECGs", source: "LITFL Top 100 ECG", url: LITFL_ECG },
      { label: "Risk scores", source: "MDCalc", url: MDCALC },
    ],
  },

  // ------------------------------------------------------- Altered Mental Status
  {
    category: "Altered Mental Status",
    framework: "Structured cause search — metabolic / infectious / structural / toxins — prioritizing reversible causes. Must-not-miss mnemonic 'MIST': Metabolic (hypoglycemia, electrolytes, hypoxia), Infection (meningitis, sepsis), Structural (stroke, bleed, TBI), Toxins (drugs, alcohol withdrawal).",
    strategy:
      "AMS is a syndrome, not a diagnosis. Check a glucose and exclude hypoxia immediately, then run the buckets: metabolic, infectious, structural, toxic. Collateral history is everything.",
    cantMiss: [
      "Hypoglycemia",
      "Hypoxia / hypercapnia",
      "Meningitis / encephalitis",
      "Intracranial hemorrhage / stroke",
      "Sepsis",
      "Toxic ingestion / opioid (give-able antidotes: glucose, naloxone, thiamine)",
    ],
    differential: [
      { group: "Metabolic", items: ["Hypo/hyperglycemia", "Hypo/hypernatremia", "Uremia", "Hepatic encephalopathy", "Thyroid (storm/myxedema)", "B12/thiamine"] },
      { group: "Infectious", items: ["Sepsis (UTI/pneumonia in elderly)", "Meningitis / encephalitis"] },
      { group: "Structural", items: ["Stroke / ICH", "Subdural", "Seizure / postictal", "NPH", "Raised ICP"] },
      { group: "Toxic", items: ["Alcohol intox/withdrawal", "Opioids / sedatives", "Stimulants", "CO", "Serotonin syndrome"] },
      { group: "Oxygenation/perfusion", items: ["Hypoxia", "Hypercapnia", "Shock"] },
    ],
    differentialAdvanced: [
      { group: "Metabolic", items: ["Hypo/hyperglycemia", "Hypo/hypernatremia", "Uremia", "Hepatic encephalopathy", "Thyroid (storm/myxedema)", "B12/thiamine", "DKA / HHS", "Hypercalcemia", "Hypomagnesemia / hypophosphatemia", "Adrenal insufficiency / Addisonian crisis", "Acute liver failure (cerebral edema)"] },
      { group: "Infectious", items: ["Sepsis (UTI/pneumonia in elderly)", "Meningitis / encephalitis", "Brain abscess", "Neurosyphilis / HIV (incl. PML)"] },
      { group: "Structural", items: ["Stroke / ICH", "Subdural", "Seizure / postictal", "NPH", "Raised ICP", "SAH", "Brain tumor / metastasis", "Non-convulsive status epilepticus", "Acute obstructive hydrocephalus", "Autoimmune encephalitis (anti-NMDA, paraneoplastic)"] },
      { group: "Toxic", items: ["Alcohol intox/withdrawal", "Opioids / sedatives", "Stimulants", "CO", "Serotonin syndrome", "Salicylate toxicity", "TCA / anticholinergic toxidrome", "Lithium toxicity", "Benzodiazepine / barbiturate withdrawal", "Toxic alcohols (methanol, ethylene glycol)"] },
      { group: "Oxygenation/perfusion", items: ["Hypoxia", "Hypercapnia", "Shock", "Hypertensive encephalopathy / PRES"] },
      { group: "Psychiatric / iatrogenic", items: ["Delirium / sundowning (multifactorial)", "Polypharmacy / medication effect (Beers-list drugs)", "Primary psychiatric (psychosis, catatonia, depression)"] },
      { group: "Thermal", items: ["Heat stroke / hyperthermia", "Hypothermia"] },
    ],
    keyQuestions: [
      {
        theme: "Collateral history (after OLDCARTS)",
        questions: [
          "Time course and baseline mental status (family/EMS/chart)",
          "Medications — insulin, sulfonylureas, opioids, sedatives, anticoagulants",
          "Last known well; focal deficit, seizure, fall/head strike",
          "Alcohol/substance use; recent illness, fever, missed dialysis",
        ],
      },
      {
        theme: "Symptom screen for the source",
        questions: [
          "Fever, headache, neck stiffness, photophobia (CNS infection)",
          "Dysuria/cough/diarrhea (occult sepsis source)",
          "Diabetic? skipped meals, med changes, renal function (hypoglycemia risk)",
        ],
      },
    ],
    examFocus: [
      "Point-of-care glucose FIRST; vitals incl. SpO₂, temperature, RR",
      "HEENT — pupils, lymphadenopathy; neck stiffness",
      "Cardiac (irregular rhythm), lungs (fremitus), abdomen (distension/tenderness)",
      "Neuro — orientation, nystagmus, focal deficits, gait",
      "Special — asterixis; skin (track marks, jaundice, petechiae); breath odor",
    ],
    workupMenu: {
      labs: [
        { test: "Fingerstick glucose", indication: "first test in any AMS" },
        { test: "BMP, hepatic panel, ABG/VBG", indication: "metabolic causes; ammonia if cirrhotic" },
        { test: "CBC w/ diff", indication: "infection" },
        { test: "B12 / folate / thiamine, TSH/T4", indication: "metabolic / endocrine" },
        { test: "UA ± blood cultures", indication: "occult infection source" },
        { test: "UDS, ethanol level, salicylate/acetaminophen", indication: "toxic ingestion" },
      ],
      imaging: [
        { test: "EKG", indication: "arrhythmia, ischemia, electrolyte effect" },
        { test: "CXR", indication: "pneumonia as sepsis source" },
        { test: "CT/MRI brain", indication: "focal deficit, trauma, anticoagulation, unexplained AMS" },
        { test: "Lumbar puncture", indication: "meningitis (after imaging if focal/↑ICP)" },
        { test: "EEG", indication: "concern for seizure / non-convulsive status" },
      ],
    },
    tools: ["GCS", "CAM (delirium)", "CIWA-Ar (alcohol withdrawal)"],
    practiceCases: [
      {
        vignette: "78 M on digoxin for AF with a recently uptitrated diuretic; nausea, confusion, yellow-green vision, HR 45.",
        ddx: ["Digoxin toxicity", "Uremic / electrolyte encephalopathy", "Infection-related delirium", "ACS", "Stroke"],
        workup: ["Digoxin level", "BMP (K/Mg/Cr)", "EKG", "CBC", "Troponin", "TSH", "± head CT if focal deficit"],
        twist: "Digoxin 3.2 with K 3.0 and a regularized junctional rhythm with scooped ST — which electrolyte to fix and which drug to AVOID?",
        updatedDdx: ["Chronic digoxin toxicity (diuretic-induced hypokalemia)"],
        nextStep:
          "Hold digoxin and the diuretic; correct K (to ~4–4.5) and Mg; telemetry; digoxin-immune Fab for life-threatening arrhythmia/instability or acute K >5. AVOID IV calcium for hyperkalemia in dig toxicity ('stone heart'). Med reconciliation and digoxin-level monitoring before discharge.",
      },
      {
        vignette: "58 M, shortness of breath and somnolence.",
        ddx: ["Causes of hypercarbia/hypoxia/hypotension: COPD", "Pneumonia", "ACS", "Sedative overdose", "Hypoglycemia"],
        workup: ["CBC", "BMP", "ABG", "Troponin", "EKG", "CXR"],
        twist: "BMP with Cr 1.3, ABG with metabolic acidosis, new fever.",
        updatedDdx: ["Sepsis — pneumonia, UTI, or GI source"],
        nextStep: "Blood cultures ×2, lactate, stat CXR, sputum culture, UA if localizing.",
      },
      {
        vignette: "28 F, tachycardic to 150s, hypertensive 160/100, somnolent, tremors.",
        ddx: ["Alcohol withdrawal", "Opioid withdrawal", "Stimulant intoxication", "Thyroid storm", "Hypo/hyperglycemia"],
        workup: ["CBC", "BMP", "UDS", "Serum alcohol", "TSH reflex fT4", "Troponin", "EKG"],
        twist: "WBC 11, BMP wnl, UDS/ethanol negative, TSH 0.01, fT4 elevated, sinus tach.",
        updatedDdx: ["Thyroid storm"],
        nextStep: "Propranolol, PTU, iodine (after PTU), steroids; ICU admission for monitoring.",
      },
      {
        vignette: "54 F, abdominal distension, A&Ox0, asterixis.",
        ddx: ["Hepatic encephalopathy", "Uremia", "SBP", "Electrolyte abnormality", "Cholangitis"],
        workup: ["CBC", "BMP", "LFTs", "Serum ammonia", "UA", "UDS", "ethanol", "POCUS/RUQ US"],
        twist: "BMP wnl, LFTs elevated, POCUS with ascites.",
        updatedDdx: ["SBP complicated by hepatic encephalopathy"],
        nextStep:
          "Paracentesis (cell count w/ diff, culture, albumin); start ceftriaxone + lactulose; consider albumin; CT for secondary peritonitis if indicated.",
      },
    ],
    quickManagement: [
      { scenario: "1 mm pupils, somnolent, RR 7, SpO₂ 92%", plan: "Naloxone (opioid reversal); support airway." },
      { scenario: "New tremor, anxiety, tachycardia, hallucinations", plan: "CIWA-Ar protocol; benzodiazepines (diazepam/lorazepam); thiamine." },
      { scenario: "Cr bump, FENa >1%, suprapubic tenderness", plan: "Bladder scan → Foley for retention." },
      {
        scenario: "pH <7.1, K >6.5",
        plan: "HyperK: EKG, telemetry, IV calcium gluconate (membrane stabilization), insulin + glucose (shift), albuterol/bicarb, then loop diuretic / patiromer to remove. Give bicarb for pH <7.1. Nephrology for HD if symptomatic uremia / refractory.",
      },
    ],
    references: [
      { label: "Delirium framework", source: "AGS / NICE Delirium Guidance" },
      { label: "Bacterial meningitis", source: "IDSA Bacterial Meningitis Guideline" },
      { label: "Hyperglycemic crises (DKA/HHS)", source: "ADA Standards of Care" },
      { label: "Hyponatremia", source: "European Hyponatraemia Guideline 2014" },
    ],
  },

  // -------------------------------------------------------------------- Dyspnea
  {
    category: "Dyspnea",
    framework: "Localize by system (cardiac vs pulmonary vs other) + onset tempo, with must-not-miss-first. Must-not-miss mnemonic 'BREATHE': Bacteria (pneumonia), Reactive airways, Embolism (PE), ACS, Tension pneumothorax / tamponade, Heart failure, Electrical (arrhythmia).",
    strategy:
      "Localize to a system, then exclude the acutely lethal causes; acuity of onset is the highest-yield discriminator.",
    cantMiss: [
      "Pulmonary embolism",
      "Tension pneumothorax",
      "Acute pulmonary edema / cardiogenic shock",
      "Anaphylaxis / airway obstruction",
      "Impending respiratory failure (severe asthma/COPD)",
    ],
    differential: [
      { group: "Cardiac", items: ["Acute decompensated HF", "ACS", "Tamponade", "Valvular disease"] },
      { group: "Pulmonary — airway", items: ["Asthma", "COPD exacerbation"] },
      { group: "Pulmonary — parenchyma/pleura", items: ["Pneumonia", "Pleural effusion", "Pneumothorax", "ILD"] },
      { group: "Vascular", items: ["Pulmonary embolism"] },
      { group: "Other", items: ["Anemia", "Metabolic acidosis", "Anxiety", "Neuromuscular weakness"] },
    ],
    differentialAdvanced: [
      { group: "Cardiac", items: ["Acute decompensated HF", "ACS", "Tamponade", "Valvular disease", "Arrhythmia (tachy/brady) with low output", "Cardiomyopathy / myocarditis"] },
      { group: "Pulmonary — airway", items: ["Asthma", "COPD exacerbation", "Upper-airway obstruction (foreign body, mucus plugging)", "Bronchiectasis (incl. ABPA)", "Vocal cord dysfunction"] },
      { group: "Pulmonary — parenchyma/pleura", items: ["Pneumonia", "Pleural effusion", "Pneumothorax", "ILD", "ARDS", "Aspiration pneumonitis", "Diffuse alveolar hemorrhage (DAH)", "Atelectasis", "Lung cancer / lymphangitic spread"] },
      { group: "Vascular", items: ["Pulmonary embolism", "Pulmonary hypertension / RV failure"] },
      { group: "Other", items: ["Anemia", "Metabolic acidosis", "Anxiety", "Neuromuscular weakness", "Sepsis", "DKA", "Salicylate toxicity", "CO poisoning / methemoglobinemia", "Anaphylaxis / angioedema", "Thyrotoxicosis", "Deconditioning / obesity-hypoventilation syndrome"] },
    ],
    keyQuestions: [
      {
        theme: "Onset & pattern",
        questions: [
          "Sudden (minutes) → PE, pneumothorax, flash pulmonary edema",
          "Subacute (days) → pneumonia, effusion, decompensated HF, COPD/asthma",
          "Exertional tolerance — how far can you walk now vs a month ago?",
        ],
      },
      {
        theme: "Cardiac vs pulmonary discriminators",
        questions: [
          "Orthopnea, PND, leg swelling, weight gain → heart failure",
          "Wheeze, cough, sputum, triggers, known airway disease → asthma/COPD",
          "Fever, productive cough, pleuritic pain → pneumonia",
          "Pleuritic pain + calf swelling + VTE risk → PE",
        ],
      },
    ],
    examFocus: [
      "Vitals + SpO₂ + work of breathing; ability to speak in full sentences",
      "JVP, S3 gallop, displaced PMI (HF)",
      "Lungs — crackles, wheeze, focal consolidation, absent breath sounds, fremitus",
      "Bilateral pitting edema; unilateral calf swelling",
      "Hepatojugular reflux",
    ],
    workupMenu: {
      labs: [
        { test: "BNP/NT-proBNP", indication: "heart failure" },
        { test: "Troponin", indication: "ACS / strain" },
        { test: "CBC, BMP", indication: "anemia, electrolytes, renal function" },
        { test: "ABG/VBG", indication: "respiratory failure, A–a gradient" },
        { test: "D-dimer", indication: "PE when pre-test probability is low" },
      ],
      imaging: [
        { test: "Chest X-ray", indication: "first-line: edema, consolidation, effusion, pneumothorax" },
        { test: "EKG", indication: "ischemia, strain, arrhythmia" },
        { test: "CT-PA", indication: "PE" },
        { test: "Echocardiography", indication: "new HF, valve disease, effusion" },
        { test: "POCUS lung", indication: "B-lines (edema), effusion, sliding (pneumothorax)" },
      ],
    },
    tools: ["Wells + PERC (PE)", "CURB-65 (pneumonia)", "BNP interpretation"],
    practiceCases: [
      {
        vignette: "65 F, acute dyspnea, orthopnea, and palpitations; irregularly irregular tachycardia ~140 with pulmonary edema.",
        ddx: ["New AF with RVR + decompensated HF", "Thyrotoxicosis (trigger)", "Pulmonary embolism", "ACS / demand ischemia", "Occult infection"],
        workup: ["EKG", "Troponin", "BNP", "CBC", "BMP", "TSH / free T4", "CXR", "± D-dimer / CTPA", "Echocardiogram"],
        twist: "TSH is suppressed with a high free T4 and CTPA is negative — what precipitated the AF, and how does it change rate control?",
        updatedDdx: ["New AF with RVR precipitating decompensated HFpEF, triggered by thyrotoxicosis"],
        nextStep:
          "Rate-control with a β-blocker (also treats the thyrotoxicosis) cautiously; add antithyroid therapy with endocrine; gentle IV loop diuresis; CHA2DS2-VASc for anticoagulation; no cardioversion of unanticoagulated new AF without TEE; telemetry admission.",
      },
      {
        vignette: "68 M, 1 week of progressive dyspnea on exertion, orthopnea, leg swelling, ran out of his 'water pill'.",
        ddx: ["Acute decompensated heart failure", "COPD exacerbation", "Pneumonia", "PE", "Anemia"],
        workup: ["BNP", "Troponin", "CBC", "BMP", "EKG", "CXR"],
        twist: "↑BNP, CXR with cephalization + Kerley B lines, troponin negative.",
        updatedDdx: ["ADHF (medication non-adherence / dietary indiscretion)"],
        nextStep: "Diurese (IV furosemide), daily weights, strict I/Os, echo; restart GDMT; reconcile diuretic adherence.",
      },
      {
        vignette: "55 M smoker, increasing cough and breathlessness, wheezing.",
        ddx: ["COPD exacerbation", "Pneumonia", "ACS", "PE", "Heart failure"],
        workup: ["CXR", "ABG/VBG", "CBC", "BMP", "EKG", "± BNP"],
      },
    ],
    quickManagement: [
      { scenario: "COPD exacerbation", plan: "Short-acting bronchodilators (albuterol/ipratropium), systemic steroids, antibiotics if ↑sputum purulence/volume; NIPPV for hypercapnic respiratory failure; controlled O₂ to SpO₂ 88–92%." },
      { scenario: "Pulmonary edema (ADHF)", plan: "Sit upright, supplemental O₂/NIPPV, IV loop diuretic, nitrates if hypertensive; treat the trigger; GDMT once stabilized." },
    ],
    references: [
      { label: "Heart failure management", source: "2022 AHA/ACC/HFSA Heart Failure Guideline" },
      { label: "COPD diagnosis & exacerbations", source: "GOLD Report (current year)", url: "https://goldcopd.org/" },
      { label: "Community-acquired pneumonia", source: "2019 ATS/IDSA CAP Guideline" },
      { label: "Chest radiograph interpretation", source: "LITFL CXR Top 100", url: LITFL_CXR },
    ],
  },

  // ---------------------------------------------------------------------- Fever
  {
    category: "Fever",
    framework: "Head-to-toe source search with a host-risk overlay, running the sepsis screen in parallel. Resident must-not-miss: endocarditis, abdominal abscess, meningitis, VTE, pneumonia, hyperthyroidism, malignancy.",
    strategy:
      "Find the source while screening for sepsis. Use a head-to-toe review of systems, recognize high-risk hosts (immunocompromised, prosthetic material, recent procedures), and start the sepsis clock early.",
    cantMiss: [
      "Sepsis / septic shock",
      "Bacterial meningitis",
      "Infective endocarditis",
      "Necrotizing soft-tissue infection",
      "Neutropenic fever",
    ],
    differential: [
      { group: "Respiratory", items: ["Pneumonia", "Influenza / COVID", "Empyema"] },
      { group: "Genitourinary", items: ["Pyelonephritis", "Complicated UTI", "Prostatitis"] },
      { group: "Skin / soft tissue", items: ["Cellulitis", "Abscess", "Necrotizing fasciitis"] },
      { group: "CNS", items: ["Meningitis", "Encephalitis"] },
      { group: "Cardiovascular", items: ["Endocarditis", "Line/device infection"] },
      { group: "Intra-abdominal", items: ["Cholangitis", "Diverticulitis", "Abscess"] },
      { group: "Non-infectious", items: ["VTE", "Drug fever", "Inflammatory / malignancy"] },
    ],
    differentialAdvanced: [
      { group: "Respiratory", items: ["Pneumonia", "Influenza / COVID", "Empyema", "Tuberculosis (pulmonary)", "PJP / opportunistic infection", "Aspiration pneumonia / lung abscess"] },
      { group: "Genitourinary", items: ["Pyelonephritis", "Complicated UTI", "Prostatitis", "Perinephric / renal abscess", "Epididymo-orchitis"] },
      { group: "Skin / soft tissue", items: ["Cellulitis", "Abscess", "Necrotizing fasciitis"] },
      { group: "CNS", items: ["Meningitis", "Encephalitis", "Brain abscess", "Septic cavernous sinus thrombosis"] },
      { group: "Cardiovascular", items: ["Endocarditis", "Line/device infection", "Septic thrombophlebitis / Lemierre", "Myocarditis / pericarditis"] },
      { group: "Intra-abdominal", items: ["Cholangitis", "Diverticulitis", "Abscess", "Cholecystitis", "Appendicitis", "C diff colitis", "SBP"] },
      { group: "Bone / joint", items: ["Septic arthritis", "Osteomyelitis (incl. vertebral / discitis)"] },
      { group: "Travel / zoonotic / tick-borne", items: ["Malaria", "Tick-borne (Lyme / anaplasmosis / babesiosis / RMSF)", "Enteric (typhoid) / dengue", "Acute HIV / seroconversion", "EBV / CMV mononucleosis"] },
      { group: "Non-infectious", items: ["VTE", "Drug fever", "Inflammatory / malignancy", "Febrile neutropenia", "Crystal arthropathy (gout / pseudogout)", "Vasculitis / GCA", "DRESS", "Transfusion reaction (AHTR / FNHTR)", "Thyroid storm", "Adrenal crisis", "Adult-onset Still / autoinflammatory"] },
    ],
    keyQuestions: [
      {
        theme: "Localize the source (review of systems)",
        questions: [
          "Cough/sputum/pleuritic pain (lung); dysuria/flank pain (GU)",
          "Headache/neck stiffness/photophobia (CNS); rash/wound/redness (skin)",
          "Abdominal pain/diarrhea (GI); new murmur / IVDU (endocarditis)",
        ],
      },
      {
        theme: "Host & exposure risk",
        questions: [
          "Immunosuppression, chemotherapy/neutropenia, asplenia, diabetes",
          "Indwelling devices, prosthetics, recent surgery/procedure/catheter",
          "Travel, sick contacts, animal/insect exposure, TB risk; injection drug use",
        ],
      },
    ],
    examFocus: [
      "Full vitals incl. temperature, MAP, mentation (sepsis screen)",
      "Skin/soft tissue — erythema, fluctuance, crepitus, pain out of proportion",
      "Lungs, abdomen, CVA tenderness, neck stiffness",
      "New murmur, peripheral stigmata of endocarditis, lines/wounds",
    ],
    workupMenu: {
      labs: [
        { test: "Lactate", indication: "sepsis / hypoperfusion" },
        { test: "Blood cultures ×2 (before antibiotics)", indication: "bacteremia / endocarditis" },
        { test: "CBC w/ diff", indication: "leukocytosis, neutropenia" },
        { test: "BMP, LFTs", indication: "organ dysfunction, biliary source" },
        { test: "Urinalysis + culture", indication: "GU source" },
      ],
      imaging: [
        { test: "Chest X-ray", indication: "pneumonia / effusion" },
        { test: "Echocardiography", indication: "endocarditis (Duke criteria)" },
        { test: "CT", indication: "deep collection / abscess" },
        { test: "Lumbar puncture", indication: "suspected meningitis" },
      ],
    },
    tools: ["qSOFA / SOFA", "Surviving Sepsis bundle", "Modified Duke criteria"],
    practiceCases: [
      {
        vignette: "45 M (recently incarcerated), weeks of fever, drenching night sweats, weight loss, and a productive cough.",
        ddx: ["Reactivation pulmonary TB", "Bacterial / fungal pneumonia", "Lung malignancy / lymphoma", "Lung abscess"],
        workup: ["CXR", "Sputum AFB smear ×3 + culture + NAAT", "HIV test", "CBC", "BMP", "LFTs", "± CT chest", "Airborne isolation"],
        twist: "CXR shows right-upper-lobe cavitation and the AFB smear is positive — first two actions?",
        updatedDdx: ["Active (reactivation) pulmonary tuberculosis"],
        nextStep:
          "Negative-pressure airborne isolation with N95 immediately; start empiric four-drug RIPE therapy; report to public health for contact tracing and DOT; baseline LFTs and ethambutol eye checks; HIV testing; do not discharge to a congregate setting while infectious.",
      },
      {
        vignette: "72 F, fever, dysuria, flank pain, confusion, BP 92/54.",
        ddx: ["Pyelonephritis / urosepsis", "Pneumonia", "Intra-abdominal source", "Meningitis"],
        workup: ["Lactate", "Blood cultures ×2", "CBC", "BMP", "UA + culture", "CXR"],
        twist: "Lactate 3.2, UA with pyuria + nitrites, WBC 18k.",
        updatedDdx: ["Urosepsis"],
        nextStep: "Sepsis bundle: cultures before antibiotics → empiric broad-spectrum antibiotics within 1 h, 30 mL/kg crystalloid, reassess perfusion/lactate; source control as needed.",
      },
      {
        vignette: "35 M with IV drug use, fever, new murmur, splinter hemorrhages.",
        ddx: ["Infective endocarditis", "Septic emboli", "Cellulitis/abscess", "Pneumonia"],
        workup: ["Blood cultures ×3", "Echocardiography (TTE → TEE)", "CBC", "BMP", "CXR", "EKG"],
      },
    ],
    quickManagement: [
      { scenario: "Septic shock", plan: "Cultures before antibiotics, then broad-spectrum antibiotics within 1 h; 30 mL/kg balanced crystalloid; norepinephrine for MAP <65 after fluids; source control; trend lactate." },
      { scenario: "Neutropenic fever", plan: "Emergency — empiric anti-pseudomonal β-lactam (cefepime / piperacillin-tazobactam / meropenem) within 1 h; add vancomycin for line/skin/hemodynamic instability." },
    ],
    references: [
      { label: "Sepsis management", source: "Surviving Sepsis Campaign 2021" },
      { label: "Community-acquired pneumonia", source: "2019 ATS/IDSA CAP Guideline" },
      { label: "Infective endocarditis", source: "AHA 2015 / ESC 2023 IE Guidelines; Modified Duke criteria" },
      { label: "Febrile neutropenia", source: "IDSA Febrile Neutropenia Guideline" },
    ],
  },

  // -------------------------------------------------------------------- Anemia
  {
    category: "Anemia",
    framework: "Two-axis: acute-vs-chronic / bleeding-vs-not, crossed with the MCV + reticulocyte (kinetic) classification. For GI bleeding: upper-tract must-not-miss = varices and gastric cancer (bright-red hematemesis vs coffee-ground emesis; melena), lower-tract = colorectal cancer and mesenteric/colonic ischemia; if unstable — two large-bore IVs, fluids + type & screen, transfuse for Hgb <7 (platelets <50), NPO, then urgent endoscopy.",
    strategy:
      "Two questions organize everything: is the patient bleeding (hemodynamic stability + source), and what does the MCV say — micro-, normo-, or macrocytic.",
    cantMiss: [
      "Acute hemorrhage with shock (GI bleed, ruptured ectopic/AAA)",
      "Hemolytic crisis (TTP/HUS)",
      "Pancytopenia / marrow failure / leukemia",
    ],
    differential: [
      { group: "Microcytic", items: ["Iron deficiency (often occult GI loss)", "Thalassemia", "Anemia of chronic disease (late)"] },
      { group: "Normocytic", items: ["Acute blood loss", "Anemia of chronic disease", "Renal (low EPO)", "Mixed deficiency"] },
      { group: "Macrocytic", items: ["B12/folate deficiency", "Alcohol / liver disease", "Hypothyroid", "MDS", "Drugs"] },
      { group: "Hemolytic", items: ["Autoimmune", "Microangiopathic (TTP/HUS)", "Hereditary (sickle, G6PD, spherocytosis)"] },
    ],
    differentialAdvanced: [
      { group: "Microcytic", items: ["Iron deficiency (often occult GI loss)", "Thalassemia", "Anemia of chronic disease (late)", "Sideroblastic (lead, alcohol, INH)"] },
      { group: "Normocytic", items: ["Acute blood loss", "Anemia of chronic disease", "Renal (low EPO)", "Mixed deficiency", "Endocrine (hypopituitary, hypoadrenal, hypogonadism)", "Pure red cell aplasia (parvovirus B19, thymoma)", "Hypersplenism / sequestration", "Dilutional (pregnancy, volume overload)"] },
      { group: "Macrocytic", items: ["B12/folate deficiency", "Alcohol / liver disease", "Hypothyroid", "MDS", "Drugs", "Pernicious anemia (anti-IF / autoimmune gastritis)", "Reticulocytosis (brisk hemolysis / blood loss)", "Copper deficiency (zinc excess / bariatric)"] },
      { group: "Hemolytic", items: ["Autoimmune", "Microangiopathic (TTP/HUS)", "Hereditary (sickle, G6PD, spherocytosis)", "PNH (paroxysmal nocturnal hemoglobinuria)", "DIC", "Infection (malaria, babesia, Clostridium)", "Drug-induced / oxidant", "Spur-cell (advanced liver disease)", "Mechanical (prosthetic valve, ECMO/MCS)", "Transfusion reaction (acute / delayed hemolytic)"] },
      { group: "Marrow infiltration / failure", items: ["Acute leukemia", "Myelophthisic (marrow metastasis, myelofibrosis)", "Multiple myeloma / plasma cell disorder", "Aplastic anemia", "Marrow-suppressive infection (HIV, parvovirus, TB, EBV/CMV)"] },
    ],
    keyQuestions: [
      {
        theme: "Bleeding source",
        questions: [
          "Melena, hematochezia, hematemesis; NSAID/anticoagulant use",
          "Menorrhagia; hematuria; recent trauma/surgery",
          "Dyspepsia, weight loss, change in bowel habit (malignancy)",
        ],
      },
      {
        theme: "Mechanism clues",
        questions: [
          "Diet (vegetarian/vegan → B12; restricted → iron/folate); alcohol",
          "Jaundice, dark urine, known hemolytic disorder",
          "Numbness/paresthesias, gait/balance (B12 myelopathy)",
          "Chronic disease: CKD, inflammatory conditions, malignancy",
        ],
      },
    ],
    examFocus: [
      "Vitals incl. orthostatics; signs of shock",
      "Conjunctival/palmar pallor, jaundice",
      "Glossitis, koilonychia (iron); neuro incl. proprioception (B12)",
      "Splenomegaly, lymphadenopathy; rectal exam for melena",
    ],
    workupMenu: {
      labs: [
        { test: "CBC with indices + MCV", indication: "classify size; check WBC/platelets" },
        { test: "Reticulocyte count", indication: "production (hypo) vs destruction/loss (hyper)" },
        { test: "Peripheral smear", indication: "schistocytes, spherocytes, blasts, hypersegmentation" },
        { test: "Iron studies (ferritin, TIBC, sat)", indication: "microcytic anemia" },
        { test: "B12, folate, TSH, LFTs", indication: "macrocytic anemia" },
        { test: "LDH, haptoglobin, bilirubin, DAT", indication: "suspected hemolysis" },
      ],
      imaging: [
        { test: "EGD / colonoscopy", indication: "iron deficiency — GI source evaluation" },
        { test: "± CT / capsule study", indication: "obscure GI bleeding" },
      ],
    },
    tools: ["MCV classification", "Reticulocyte index", "Glasgow-Blatchford (upper GI bleed)"],
    practiceCases: [
      {
        vignette: "72 M, months of fatigue, easy bruising, and recurrent infections; CBC shows pancytopenia with macrocytosis.",
        ddx: ["Myelodysplastic syndrome", "Aplastic anemia", "B12 / folate deficiency", "Acute leukemia", "Marrow infiltration"],
        workup: ["CBC + differential + smear", "Reticulocyte count", "B12 / folate", "Iron studies", "LDH / haptoglobin", "Peripheral blast %", "Hematology referral (bone marrow biopsy)"],
        twist: "Macrocytosis with dysplastic neutrophils, <5% blasts, and normal B12/folate — diagnosis and disposition?",
        updatedDdx: ["Myelodysplastic syndrome"],
        nextStep:
          "Urgent heme/onc for IPSS-R risk stratification and disease-directed therapy (hypomethylating agent; transplant in eligible higher-risk). Transfuse RBCs for symptomatic/ischemic anemia and platelets for severe thrombocytopenia/bleeding; treat any fever as febrile neutropenia; stop marrow-suppressive drugs; goals-of-care discussion.",
      },
      {
        vignette: "62 M, fatigue and black stools, BP 96/60, HR 110.",
        ddx: ["Acute upper GI bleed (PUD, varices)", "Lower GI bleed", "Malignancy", "Iron-deficiency from chronic loss"],
        workup: ["CBC", "BMP (BUN:Cr)", "Type & screen", "Coags", "Iron studies", "Lactate"],
        twist: "Hgb 7.1, MCV 72, BUN:Cr elevated, hemodynamically borderline.",
        updatedDdx: ["Acute upper GI bleed on a background of iron deficiency"],
        nextStep: "Two large-bore IVs, resuscitate, transfuse to Hgb ≥7, IV PPI, type & screen; GI consult → EGD; hold anticoagulants.",
      },
      {
        vignette: "34 F, vegan, fatigue and paresthesias, unsteady gait.",
        ddx: ["B12 deficiency", "Folate deficiency", "Hypothyroidism", "MDS"],
        workup: ["CBC + MCV", "Reticulocytes", "Smear", "B12 ± methylmalonic acid", "Folate", "TSH"],
      },
    ],
    quickManagement: [
      { scenario: "Iron-deficiency anemia", plan: "Oral (or IV) iron repletion; identify and treat the source — GI evaluation in men and post-menopausal women." },
      { scenario: "Symptomatic / acute blood-loss anemia", plan: "Resuscitate, restrictive transfusion threshold (Hgb 7; higher in active ACS), reverse anticoagulation, source control." },
    ],
    references: [
      { label: "Iron deficiency / GI evaluation", source: "ACG/AGA Iron-Deficiency Anemia Guidance" },
      { label: "Upper GI bleeding", source: "ACG 2021 Upper GI Bleeding Guideline" },
      { label: "Transfusion thresholds", source: "AABB Red Cell Transfusion Guidelines" },
      { label: "Smear morphology", source: "ASH Image Bank", url: "https://imagebank.hematology.org/" },
    ],
  },

  // ------------------------------------------------------------------- Diarrhea
  {
    category: "Diarrhea",
    framework: "Acute-vs-chronic split, then inflammatory/invasive vs secretory/osmotic features. Resident must-not-miss: C. difficile, invasive infectious diarrhea, IBD (Crohn's vs UC), and bowel ischemia.",
    strategy:
      "Separate acute (<2 weeks, usually infectious/self-limited) from chronic, and screen for the inflammatory/invasive features and dehydration that change management.",
    cantMiss: [
      "Severe dehydration / hypovolemic shock",
      "Toxic megacolon",
      "C. difficile colitis",
      "Ischemic colitis",
      "GI bleed",
    ],
    differential: [
      { group: "Acute infectious", items: ["Viral", "Bacterial (Salmonella, Shigella, Campylobacter, EHEC)", "C. difficile", "Parasitic"] },
      { group: "Inflammatory", items: ["UC / Crohn's flare", "Ischemic colitis", "Microscopic colitis"] },
      { group: "Malabsorptive / chronic", items: ["Celiac disease", "Pancreatic insufficiency", "Bile-acid", "IBS"] },
      { group: "Other", items: ["Medication / laxative", "Hyperthyroid", "Overflow from constipation"] },
    ],
    differentialAdvanced: [
      { group: "Acute infectious", items: ["Viral", "Bacterial (Salmonella, Shigella, Campylobacter, EHEC)", "C. difficile", "Parasitic", "Traveler's diarrhea (ETEC)", "Vibrio / Yersinia", "Entamoeba histolytica (amebic dysentery)", "Cryptosporidium / Cyclospora", "Giardia", "CMV colitis (AIDS / immunocompromised)"] },
      { group: "Inflammatory", items: ["UC / Crohn's flare", "Ischemic colitis", "Microscopic colitis", "Diverticular / segmental colitis", "Checkpoint inhibitor colitis", "Radiation enteritis / proctitis", "Eosinophilic gastroenteritis"] },
      { group: "Malabsorptive / chronic", items: ["Celiac disease", "Pancreatic insufficiency", "Bile-acid", "IBS", "SIBO", "Lactose / disaccharidase deficiency", "Whipple disease", "Short-gut / post-resection"] },
      { group: "Other", items: ["Medication / laxative", "Hyperthyroid", "Overflow from constipation", "Colorectal cancer / villous adenoma", "Diabetic autonomic neuropathy", "Sorbitol / mannitol (sugar-alcohol osmotic)", "Alcohol / chronic EtOH"] },
      { group: "Secretory / endocrine", items: ["VIPoma", "Carcinoid syndrome", "Gastrinoma (Zollinger-Ellison)", "Medullary thyroid carcinoma", "Addison's (adrenal insufficiency)", "Systemic mastocytosis"] },
    ],
    keyQuestions: [
      {
        theme: "Characterize the stool & course",
        questions: [
          "Duration; frequency and volume; large watery vs small frequent",
          "Blood or mucus (inflammatory/invasive); nocturnal diarrhea (organic)",
          "Weight loss; relation to fasting (secretory vs osmotic)",
        ],
      },
      {
        theme: "Exposures & red flags",
        questions: [
          "Recent antibiotics or hospitalization (C. diff); sick contacts, travel, food/water",
          "Fever, severe abdominal pain, dehydration symptoms",
          "Immunosuppression; new medications; family history of IBD/celiac",
        ],
      },
    ],
    examFocus: [
      "Volume status — mucous membranes, skin turgor, orthostatics, cap refill",
      "Abdominal exam — tenderness, distension, peritoneal signs",
      "Rectal exam — blood, tenderness",
      "Extra-intestinal IBD signs (oral ulcers, joints, skin, eyes)",
    ],
    workupMenu: {
      labs: [
        { test: "CBC, BMP", indication: "electrolytes, renal function, dehydration" },
        { test: "C. difficile toxin/PCR", indication: "antibiotic / hospital exposure" },
        { test: "Stool culture / multiplex PCR", indication: "bloody/severe/dysentery" },
        { test: "Fecal calprotectin / leukocytes", indication: "inflammatory vs functional" },
        { test: "tTG-IgA", indication: "chronic — celiac disease" },
        { test: "Lactate", indication: "ischemia/sepsis concern" },
      ],
      imaging: [
        { test: "Abdominal X-ray", indication: "toxic megacolon, obstruction" },
        { test: "CT abdomen/pelvis", indication: "colitis / ischemia / complications" },
        { test: "Colonoscopy", indication: "chronic / inflammatory / IBD evaluation" },
      ],
    },
    tools: ["Bristol Stool Scale", "Fecal calprotectin"],
    practiceCases: [
      {
        vignette: "55 F, months of high-volume watery diarrhea (several L/day) that persists with fasting, with profound weakness.",
        ddx: ["VIPoma / secretory NET", "Surreptitious laxative abuse", "Carcinoid syndrome", "Zollinger-Ellison", "Microscopic colitis"],
        workup: ["BMP (K, HCO3)", "Stool electrolytes + osmotic gap", "Supervised fast", "Fasting VIP + chromogranin A", "Gastrin", "Laxative screen", "CT / MRI pancreas"],
        twist: "Stool osmotic gap is low, the diarrhea persists through a fast, K is 2.4, and fasting VIP is high — diagnosis?",
        updatedDdx: ["VIPoma (WDHA / Verner-Morrison syndrome)"],
        nextStep:
          "Aggressive IV fluids and potassium (with Mg, on telemetry); somatostatin analog (octreotide then lanreotide) to suppress VIP; correct the non-anion-gap acidosis and hypercalcemia; localize/stage the pancreatic NET and refer to endocrine surgery/oncology; antidiarrheals alone will not control a secretory tumor.",
      },
      {
        vignette: "68 M, bloody diarrhea and crampy abdominal pain 2 days after a hospitalization on antibiotics.",
        ddx: ["C. difficile colitis", "Ischemic colitis", "Infectious colitis (EHEC, Shigella)", "IBD flare"],
        workup: ["CBC", "BMP", "Lactate", "C. difficile PCR/toxin", "Stool studies", "± CT A/P"],
        twist: "WBC 18k, C. diff PCR positive, abdomen distended.",
        updatedDdx: ["C. difficile colitis (assess for fulminant disease)"],
        nextStep: "Oral vancomycin (or fidaxomicin); add IV metronidazole + consider surgery if fulminant/toxic megacolon; isolate; stop the inciting antibiotic; avoid antimotility agents.",
      },
      {
        vignette: "29 F, chronic non-bloody diarrhea, weight loss, bloating, iron-deficiency anemia.",
        ddx: ["Celiac disease", "IBS", "Microscopic colitis", "Pancreatic insufficiency", "Hyperthyroid"],
        workup: ["tTG-IgA + total IgA", "CBC + iron studies", "TSH", "Fecal calprotectin", "Colonoscopy with biopsies if indicated"],
      },
    ],
    quickManagement: [
      { scenario: "Acute watery diarrhea, mild, non-bloody", plan: "Oral rehydration, supportive care, no testing or antibiotics; return precautions." },
      { scenario: "C. difficile colitis", plan: "Oral vancomycin or fidaxomicin; stop offending antibiotic; isolate; surgery for fulminant/toxic megacolon." },
    ],
    references: [
      { label: "Acute infectious diarrhea", source: "ACG 2016 Acute Diarrheal Infections Guideline; IDSA 2017" },
      { label: "C. difficile infection", source: "IDSA/SHEA C. difficile Guideline (2021 update)" },
      { label: "IBD management", source: "ACG Ulcerative Colitis / Crohn's Guidelines" },
      { label: "Celiac disease", source: "ACG 2023 Celiac Disease Guideline" },
    ],
  },

  // ------------------------------------------------------- Abnormal Liver Enzymes
  {
    category: "Abnormal Liver Enzymes",
    framework: "Pattern recognition: hepatocellular vs cholestatic vs mixed (R-factor), then cause within the pattern.",
    strategy:
      "First classify the pattern — hepatocellular (ALT/AST ↑↑) vs cholestatic (ALP/bilirubin ↑↑) vs mixed — then build a pattern-specific differential and assess for liver failure (INR, encephalopathy).",
    cantMiss: [
      "Acute liver failure (coagulopathy + encephalopathy)",
      "Acetaminophen toxicity",
      "Ascending cholangitis",
      "Acute biliary obstruction",
      "Ischemic hepatitis / Budd-Chiari",
    ],
    differential: [
      { group: "Hepatocellular", items: ["Viral hepatitis (A/B/C/E)", "Drug-induced (acetaminophen)", "Alcoholic hepatitis", "NAFLD/NASH", "Autoimmune", "Ischemic"] },
      { group: "Cholestatic", items: ["Choledocholithiasis", "Malignant obstruction", "PBC / PSC", "Drug-induced cholestasis"] },
      { group: "Infiltrative (isolated ALP)", items: ["Malignancy", "Granulomatous disease"] },
      { group: "Non-hepatic ALP", items: ["Bone disease", "Pregnancy"] },
    ],
    differentialAdvanced: [
      { group: "Hepatocellular", items: ["Viral hepatitis (A/B/C/E)", "Drug-induced (acetaminophen)", "Alcoholic hepatitis", "NAFLD/NASH", "Autoimmune", "Ischemic", "Hemochromatosis (iron overload)", "Wilson disease", "Alpha-1 antitrypsin deficiency", "EBV / CMV / HSV hepatitis", "DILI (non-APAP: INH, statins, amiodarone, MTX)"] },
      { group: "Cholestatic", items: ["Choledocholithiasis", "Malignant obstruction", "PBC / PSC", "Drug-induced cholestasis", "Sepsis-associated cholestasis", "TPN-associated cholestasis", "Postoperative (benign) jaundice", "Mirizzi syndrome"] },
      { group: "Infiltrative (isolated ALP)", items: ["Malignancy", "Granulomatous disease", "Hepatic amyloidosis"] },
      { group: "Non-hepatic ALP", items: ["Bone disease", "Pregnancy", "Hyperthyroidism"] },
      { group: "Vascular / congestive", items: ["Congestive hepatopathy (right heart failure / tricuspid disease)", "Budd-Chiari (hepatic vein thrombosis)", "Sinusoidal obstruction syndrome / VOD (post-HSCT)"] },
      { group: "Pregnancy-related", items: ["HELLP syndrome", "Acute fatty liver of pregnancy", "Intrahepatic cholestasis of pregnancy"] },
      { group: "Non-hepatic AST/ALT source", items: ["Muscle injury / rhabdomyolysis", "Hemolysis", "Strenuous exercise / macro-AST"] },
    ],
    keyQuestions: [
      {
        theme: "Exposures & risk",
        questions: [
          "All medications/supplements/herbals; acetaminophen dose & timing (staggered?)",
          "Alcohol quantity and pattern",
          "Viral risk: IV drug use, transfusions, tattoos, sexual exposures, travel, shellfish",
          "Metabolic risk: obesity, diabetes, dyslipidemia (NAFLD)",
        ],
      },
      {
        theme: "Symptoms & severity",
        questions: [
          "Jaundice, dark urine, pale stools, pruritus (cholestasis)",
          "RUQ pain, fever (biliary infection)",
          "Confusion, bleeding/bruising, distension (decompensation / failure)",
        ],
      },
    ],
    examFocus: [
      "Scleral icterus, jaundice",
      "Stigmata of chronic liver disease — spider nevi, palmar erythema, gynecomastia, caput",
      "Hepatomegaly/tenderness, splenomegaly, ascites (shifting dullness/fluid wave)",
      "Asterixis, encephalopathy",
    ],
    workupMenu: {
      labs: [
        { test: "Repeat LFTs with fractionated bilirubin + GGT", indication: "compute R-factor; confirm hepatic ALP" },
        { test: "INR, albumin", indication: "synthetic function — ALF if coagulopathy + encephalopathy" },
        { test: "Acetaminophen level", indication: "plot on Rumack-Matthew; treat with NAC" },
        { test: "Viral hepatitis panel", indication: "hepatocellular pattern" },
        { test: "Autoimmune markers (ANA, ASMA, IgG)", indication: "autoimmune hepatitis" },
        { test: "Lipase, serum/urine tox", indication: "co-pathology / ingestion" },
      ],
      imaging: [
        { test: "RUQ ultrasound", indication: "ducts, parenchyma, vascular flow" },
        { test: "MRCP", indication: "biliary obstruction" },
        { test: "ERCP", indication: "therapeutic — stone extraction / decompression" },
      ],
    },
    tools: ["R-factor", "Maddrey DF (alcoholic hepatitis)", "MELD-Na"],
    practiceCases: [
      {
        vignette: "55 M, fatigue, knuckle arthralgias, bronze skin, and new diabetes; transaminases mildly elevated.",
        ddx: ["Hereditary hemochromatosis", "NAFLD / NASH", "Alcoholic / viral hepatitis", "Wilson disease"],
        workup: ["Ferritin + transferrin saturation", "LFTs", "Glucose / HbA1c", "HFE genotype", "EKG (conduction)", "Echocardiogram", "Liver MRI (iron) / biopsy"],
        twist: "Ferritin is very high with transferrin saturation >45% — first-line treatment and who else to test?",
        updatedDdx: ["Hereditary hemochromatosis"],
        nextStep:
          "Therapeutic phlebotomy first-line (iron-deplete, then maintenance); stop iron + vitamin C, limit alcohol, avoid raw shellfish; treat the diabetes and hypogonadism; cardiology for iron cardiomyopathy/conduction disease; HCC surveillance if cirrhotic; HFE genotyping and screen first-degree relatives.",
      },
      {
        vignette: "28 M, RUQ pain, fever, anorexia, nausea.",
        ddx: ["Cholecystitis", "Cholangitis", "Hepatitis", "Hepatic abscess", "Pneumonia", "Pyelonephritis", "Nephrolithiasis"],
        workup: ["CBC", "BMP", "LFTs", "Lipase", "UA", "RUQ US", "EKG", "Troponin"],
        twist: "AST/ALT in the 1000s; WBC 13k; lipase/UA/EKG/troponin unremarkable; imaging pending.",
        updatedDdx: ["Viral hepatitis", "Drug-induced (acetaminophen)", "Acute obstruction", "Ischemic", "less likely autoimmune / Wilson's / acute MI"],
        nextStep: "Viral hepatitis panel, RUQ US, acetaminophen level + serum/urine tox; check INR/albumin and mental status for acute liver failure.",
      },
      {
        vignette: "55 F, painless jaundice, dark urine, pale stools, pruritus.",
        ddx: ["Malignant biliary obstruction", "Choledocholithiasis", "PBC/PSC", "Drug-induced cholestasis"],
        workup: ["LFTs (cholestatic pattern)", "RUQ US", "MRCP", "± ERCP", "Tumor markers if mass"],
      },
    ],
    quickManagement: [
      { scenario: "Acetaminophen toxicity", plan: "N-acetylcysteine guided by the Rumack-Matthew nomogram / staggered-ingestion criteria; consult toxicology / transplant if ALF." },
      { scenario: "Ascending cholangitis", plan: "IV fluids + broad-spectrum antibiotics, then biliary decompression (ERCP) — Charcot triad / Reynolds pentad; urgent if septic." },
    ],
    references: [
      { label: "Abnormal liver chemistries — approach", source: "ACG 2017 Guideline on Liver Chemistries" },
      { label: "Acetaminophen overdose", source: "Rumack-Matthew nomogram; AASLD ALF guidance" },
      { label: "Alcohol-associated liver disease", source: "AASLD 2019 ALD Guideline" },
      { label: "Calculators (MELD, Maddrey)", source: "MDCalc", url: MDCALC },
    ],
  },

  // ----------------------------------------------------------------- Joint Pain
  {
    category: "Joint Pain",
    framework:
      "Two axes organize joint pain: (1) inflammatory vs non-inflammatory (morning stiffness >30-60 min, swelling/warmth, systemic features → inflammatory) and (2) the joint count/pattern — monoarticular vs oligo- vs polyarticular, symmetric vs asymmetric. The can't-miss is acute monoarthritis = septic arthritis until the tap proves otherwise.",
    strategy:
      "First decide inflammatory vs not and how many joints; an acute hot single joint is septic arthritis until arthrocentesis says otherwise.",
    cantMiss: [
      "Septic (bacterial) arthritis",
      "Disseminated gonococcal infection",
      "Crystal arthritis with concurrent joint infection",
      "Systemic disease flare with organ involvement (lupus, vasculitis)",
    ],
    differential: [
      { group: "Monoarticular — acute", items: ["Septic arthritis", "Gout", "Pseudogout (CPPD)", "Hemarthrosis / trauma"] },
      { group: "Polyarticular — inflammatory", items: ["Rheumatoid arthritis", "Viral arthritis (parvovirus, hepatitis)", "Psoriatic / reactive arthritis", "SLE / connective tissue disease"] },
      { group: "Non-inflammatory", items: ["Osteoarthritis", "Fibromyalgia", "Mechanical / overuse"] },
    ],
    differentialAdvanced: [
      { group: "Monoarticular — acute", items: ["Septic arthritis", "Gout", "Pseudogout (CPPD)", "Hemarthrosis / trauma", "Gonococcal arthritis", "Lyme arthritis", "Avascular necrosis", "Reactive arthritis (early)"] },
      { group: "Polyarticular — inflammatory", items: ["Rheumatoid arthritis", "Viral arthritis (parvovirus, hepatitis)", "Psoriatic / reactive arthritis", "SLE / connective tissue disease", "Spondyloarthritis (ankylosing)", "Polyarticular gout / CPPD", "Adult-onset Still's disease", "Vasculitis", "Sarcoid arthropathy", "Post-streptococcal / rheumatic fever"] },
      { group: "Non-inflammatory", items: ["Osteoarthritis", "Fibromyalgia", "Mechanical / overuse", "Hypothyroid arthropathy", "Hemochromatosis", "Neuropathic (Charcot) joint"] },
      { group: "Periarticular / referred", items: ["Bursitis / tendinitis", "Overlying cellulitis", "Referred pain (hip → knee)"] },
    ],
    keyQuestions: [
      {
        theme: "Inflammatory vs mechanical",
        questions: [
          "Morning stiffness duration (>30-60 min suggests inflammatory)",
          "Swelling, warmth, redness; gel phenomenon after rest",
          "Better with activity (inflammatory) or worse with use (mechanical)",
        ],
      },
      {
        theme: "Pattern & triggers",
        questions: [
          "Number and distribution of joints; symmetric or asymmetric",
          "Fever, rash, recent GI/GU infection, tick exposure, sexual history",
          "Prior gout, psoriasis, IBD, uveitis; family history",
        ],
      },
    ],
    examFocus: [
      "Vitals incl. temperature (septic joint)",
      "Effusion, warmth, erythema, and range of motion of the affected joint(s)",
      "Skin (psoriasis, tophi, rash), nails, enthesitis/dactylitis",
      "Survey other joints and the spine; signs of systemic disease",
    ],
    workupMenu: {
      labs: [
        { test: "Arthrocentesis — synovial fluid cell count, crystals, Gram stain & culture", indication: "any acute monoarthritis — the key test" },
        { test: "CBC, ESR, CRP", indication: "inflammation / infection" },
        { test: "Serum urate", indication: "gout (often normal during an acute flare)" },
        { test: "Blood cultures", indication: "suspected septic arthritis" },
        { test: "RF, anti-CCP, ANA", indication: "suspected RA / connective tissue disease" },
      ],
      imaging: [
        { test: "Plain radiographs of the joint", indication: "erosions, chondrocalcinosis, fracture, OA" },
        { test: "MRI", indication: "osteomyelitis, avascular necrosis, occult fracture" },
      ],
    },
    tools: [
      "Synovial WBC: >50k → septic, 2-50k inflammatory, <2k non-inflammatory",
      "Crystals: negatively birefringent needles = gout; positively birefringent rhomboids = CPPD",
      "ACR/EULAR criteria (RA, gout)",
    ],
    practiceCases: [
      {
        vignette: "58 M with diabetes, 2 days of a hot, swollen, exquisitely painful right knee and fever 38.7 C; can barely move the joint.",
        ddx: ["Septic arthritis", "Gout", "Pseudogout", "Reactive arthritis"],
        workup: ["Arthrocentesis (cell count, crystals, Gram stain, culture)", "Blood cultures", "CBC, ESR, CRP", "Serum urate", "Knee radiograph"],
        twist: "Synovial fluid WBC 80,000 with neutrophil predominance and Gram-positive cocci on Gram stain.",
        updatedDdx: ["Bacterial (likely staphylococcal) septic arthritis"],
        nextStep:
          "Urgent orthopedics for joint washout/drainage; empiric IV vancomycin (add ceftriaxone or cefepime per risk); blood and joint cultures before antibiotics. Antibiotics alone are insufficient — drainage is definitive.",
      },
      {
        vignette: "52 M with hypertension on a thiazide, sudden overnight pain, redness, and swelling of the first MTP joint.",
        ddx: ["Gout", "Septic arthritis", "Pseudogout", "Cellulitis"],
        workup: ["Arthrocentesis with crystal analysis", "Serum urate", "Joint radiograph", "CBC, CRP"],
      },
      {
        vignette: "44 F with 8 weeks of symmetric pain and swelling of the MCPs/PIPs and wrists, with >1 h of morning stiffness.",
        ddx: ["Rheumatoid arthritis", "Viral (parvovirus) arthritis", "SLE", "Psoriatic arthritis"],
        workup: ["RF, anti-CCP", "ESR, CRP", "ANA", "Parvovirus serology", "Hand radiographs"],
      },
    ],
    quickManagement: [
      { scenario: "Acute hot monoarthritis", plan: "Arthrocentesis BEFORE antibiotics; if septic → urgent joint drainage/washout + empiric IV vancomycin (± gram-negative coverage). Never settle on gout/CPPD without excluding infection." },
      { scenario: "Acute gout flare", plan: "NSAID, colchicine, or corticosteroid (intra-articular or oral). Do not start or stop urate-lowering therapy during the flare — but continue it if already established." },
    ],
    references: [
      { label: "Septic arthritis (approach to monoarthritis)", source: "ACR / IDSA septic arthritis guidance" },
      { label: "Gout management", source: "ACR 2020 Gout Guideline" },
      { label: "Rheumatoid arthritis classification", source: "ACR/EULAR 2010 RA Criteria" },
      { label: "Synovial fluid interpretation", source: "MGH Housestaff Manual — Arthritis" },
    ],
  },

  // ------------------------------------------------------------------ Back Pain
  {
    category: "Back Pain",
    framework:
      "Triage back pain by red flags first (neuro-emergencies and systemic causes), then sort the rest into mechanical/degenerative vs inflammatory vs referred/visceral. Cauda equina, epidural abscess/cord compression, and aortic catastrophe drive immediate imaging.",
    strategy:
      "Screen for red flags (neuro deficit, fever/immunocompromise, cancer history, trauma, vascular risk); with none, most acute back pain is mechanical and self-limited — and needs no imaging.",
    cantMiss: [
      "Cauda equina syndrome",
      "Spinal epidural abscess / vertebral osteomyelitis",
      "Epidural metastasis / cord compression",
      "Aortic aneurysm or dissection (referred)",
      "Unstable vertebral fracture",
    ],
    differential: [
      { group: "Mechanical / degenerative", items: ["Lumbar strain", "Degenerative disc disease / spondylosis", "Herniated disc with radiculopathy", "Spinal stenosis", "Vertebral compression fracture"] },
      { group: "Inflammatory", items: ["Ankylosing spondylitis / axial spondyloarthritis", "Sacroiliitis"] },
      { group: "Infection / malignancy (red flag)", items: ["Vertebral osteomyelitis / discitis", "Spinal epidural abscess", "Metastatic / primary spinal tumor", "Multiple myeloma"] },
      { group: "Referred / visceral", items: ["Aortic aneurysm / dissection", "Pyelonephritis / nephrolithiasis", "Pancreatitis", "Pelvic / retroperitoneal process"] },
    ],
    differentialAdvanced: [
      { group: "Mechanical / degenerative", items: ["Lumbar strain", "Degenerative disc disease / spondylosis", "Herniated disc with radiculopathy", "Spinal stenosis", "Vertebral compression fracture", "Spondylolisthesis", "Facet arthropathy", "Sacroiliac joint dysfunction"] },
      { group: "Inflammatory", items: ["Ankylosing spondylitis / axial spondyloarthritis", "Sacroiliitis", "Reactive / psoriatic / IBD-associated spondyloarthritis", "DISH"] },
      { group: "Infection / malignancy (red flag)", items: ["Vertebral osteomyelitis / discitis", "Spinal epidural abscess", "Metastatic / primary spinal tumor", "Multiple myeloma", "Tuberculous spondylitis (Pott disease)", "Lymphoma / leukemia"] },
      { group: "Referred / visceral", items: ["Aortic aneurysm / dissection", "Pyelonephritis / nephrolithiasis", "Pancreatitis", "Pelvic / retroperitoneal process", "Endometriosis", "Posterior peptic ulcer", "Herpes zoster (pre-eruptive)"] },
      { group: "Neurologic emergency", items: ["Cauda equina syndrome", "Conus medullaris syndrome", "Epidural cord compression"] },
    ],
    keyQuestions: [
      {
        theme: "Red flags",
        questions: [
          "Saddle anesthesia, urinary retention/incontinence, bowel changes, bilateral leg weakness (cauda equina)",
          "Fever, IV drug use, immunocompromise, recent bacteremia/procedure (infection)",
          "History of cancer, unexplained weight loss, night/rest pain, age >50 (malignancy)",
          "Significant trauma, osteoporosis, chronic steroids (fracture); vascular risk + tearing pain (aorta)",
        ],
      },
      {
        theme: "Pain character",
        questions: [
          "Mechanical (worse with activity, better with rest) vs inflammatory (worse at rest, morning stiffness >30 min, improves with exercise, onset <40 y)",
          "Radiation below the knee in a dermatomal pattern (radiculopathy)",
          "Neurogenic claudication relieved by flexion/sitting (spinal stenosis)",
        ],
      },
    ],
    examFocus: [
      "Vitals incl. temperature; focal spinal or CVA tenderness",
      "Straight-leg raise; lower-limb motor, sensory, and reflex exam",
      "Saddle sensation, anal tone, post-void residual if cauda equina suspected",
      "Pulses and abdominal exam (AAA / visceral referral)",
    ],
    workupMenu: {
      labs: [
        { test: "ESR, CRP, CBC", indication: "suspected infection or malignancy (red flags)" },
        { test: "Blood cultures", indication: "suspected vertebral osteomyelitis / epidural abscess" },
        { test: "Urinalysis", indication: "renal/visceral cause (pyelonephritis, stone)" },
        { test: "SPEP/UPEP, serum calcium", indication: "suspected myeloma in an older patient" },
      ],
      imaging: [
        { test: "Urgent MRI of the spine (with contrast if infection/tumor)", indication: "red flags — cauda equina, epidural abscess, cord compression" },
        { test: "Plain radiographs", indication: "fracture, alignment, chronic degenerative change" },
        { test: "CT angiography of the aorta", indication: "suspected AAA / dissection" },
      ],
    },
    tools: [
      "Red-flag screen: neuro deficit, infection, cancer, fracture, vascular",
      "Inflammatory back pain criteria (ASAS)",
      "Straight-leg raise + focused neuro exam",
    ],
    practiceCases: [
      {
        vignette: "55 M with severe low back pain radiating down both legs, new urinary retention, and numbness around the perineum for 1 day.",
        ddx: ["Cauda equina syndrome", "Large central disc herniation", "Epidural abscess", "Epidural metastasis"],
        workup: ["Post-void residual / bladder scan", "Digital rectal exam (tone)", "Urgent MRI lumbosacral spine", "Neurosurgery consult"],
        twist: "MRI shows a large central disc herniation compressing the cauda equina; post-void residual 400 mL.",
        updatedDdx: ["Cauda equina syndrome from a central disc herniation"],
        nextStep:
          "Emergent neurosurgical decompression — outcomes depend on time to decompression; do not delay for further workup. IV dexamethasone if a compressive tumor is the cause.",
      },
      {
        vignette: "62 M who injects drugs, 2 weeks of worsening focal thoracic back pain, fever, and now mild leg weakness.",
        ddx: ["Spinal epidural abscess", "Vertebral osteomyelitis / discitis", "Metastatic cord compression", "Mechanical back pain"],
        workup: ["ESR, CRP, CBC", "Blood cultures", "Urgent MRI spine with contrast", "Neurosurgery and ID consults"],
        twist: "MRI shows an epidural collection with early cord compression; blood cultures grow S. aureus.",
        updatedDdx: ["Spinal epidural abscess with early cord compression"],
        nextStep:
          "Emergent neurosurgical evaluation for decompression/drainage; empiric IV vancomycin plus a gram-negative agent (e.g., cefepime); blood cultures before antibiotics; serial neuro exams.",
      },
    ],
    quickManagement: [
      { scenario: "Acute low back pain without red flags", plan: "No imaging; stay active, NSAIDs/acetaminophen, reassurance — most resolve in 4-6 weeks. Image only with red flags or failure to improve." },
      { scenario: "Cauda equina or epidural compression", plan: "Emergent MRI + neurosurgery; decompress urgently. For epidural abscess add empiric vancomycin + gram-negative coverage and draw blood cultures." },
    ],
    references: [
      { label: "Low back pain — evaluation & imaging", source: "ACP Low Back Pain Guideline (Ann Intern Med 2017)" },
      { label: "Cauda equina / red flags", source: "Standard neurosurgical guidance" },
      { label: "Spinal epidural abscess / vertebral osteomyelitis", source: "IDSA native vertebral osteomyelitis guidance" },
      { label: "Axial spondyloarthritis", source: "ASAS classification criteria" },
    ],
  },
];

/**
 * MGH Housestaff Manual 2024–2025 alignment, keyed by category. `manual` lists
 * the relevant sections + PDF pages; `pearlPages` is parallel to that category's
 * `quickManagement` array — each entry is the page that pearl's plan follows.
 * Pages were taken from the manual PDF and match the per-case management
 * citations, so a drill and its matching station teach from the same source.
 */
const MANUAL_BY_CATEGORY: Record<string, { manual: ManualRef[]; pearlPages: number[] }> = {
  "Chest Pain": {
    manual: [
      { section: "Chest Pain (approach)", page: 16 },
      { section: "Acute Coronary Syndrome", page: 18 },
      { section: "Aortic Disease", page: 35 },
      { section: "Pericardial Disease", page: 34 },
      { section: "VTE Management", page: 55 },
    ],
    pearlPages: [18, 55, 26],
  },
  "Abdominal Pain": {
    manual: [
      { section: "Abdominal Pain", page: 72 },
      { section: "Pancreatitis", page: 85 },
      { section: "Biliary Disease", page: 88 },
      { section: "Upper GI Bleeding", page: 70 },
    ],
    pearlPages: [72, 70],
  },
  Syncope: {
    manual: [
      { section: "Syncope", page: 37 },
      { section: "Valvular Heart Disease", page: 32 },
      { section: "Atrial Fibrillation / Flutter", page: 13 },
      { section: "ACLS: Cardioversion / Pacing", page: 8 },
    ],
    pearlPages: [13, 8],
  },
  "Altered Mental Status": {
    manual: [
      { section: "Altered Mental Status", page: 196 },
      { section: "Sepsis", page: 65 },
      { section: "DKA / HHS", page: 184 },
      { section: "Sodium Disorders", page: 107 },
      { section: "Alcohol Use Disorder & Withdrawal", page: 212 },
      { section: "Opioid Use Disorder", page: 215 },
    ],
    pearlPages: [215, 212, 65, 110],
  },
  Dyspnea: {
    manual: [
      { section: "Inpatient Heart Failure (ADHF)", page: 26 },
      { section: "COPD", page: 51 },
      { section: "Community Acquired Pneumonia", page: 116 },
      { section: "PFTs & Asthma", page: 50 },
      { section: "VTE Management", page: 55 },
    ],
    pearlPages: [51, 26],
  },
  Fever: {
    manual: [
      { section: "Empiric Antibiotics & Antibiogram", page: 112 },
      { section: "Sepsis", page: 65 },
      { section: "Community Acquired Pneumonia", page: 116 },
      { section: "Skin & Soft Tissue Infections", page: 120 },
      { section: "Meningitis & Encephalitis", page: 123 },
      { section: "Febrile Neutropenia", page: 161 },
    ],
    pearlPages: [65, 161],
  },
  Anemia: {
    manual: [
      { section: "Pancytopenia & Anemia", page: 136 },
      { section: "Upper GI Bleeding", page: 70 },
      { section: "Transfusion Medicine", page: 144 },
    ],
    pearlPages: [136, 144],
  },
  Diarrhea: {
    manual: [
      { section: "Diarrhea", page: 77 },
      { section: "C. Difficile Infection", page: 124 },
      { section: "Inflammatory Bowel Disease", page: 81 },
    ],
    pearlPages: [77, 124],
  },
  "Abnormal Liver Enzymes": {
    manual: [
      { section: "Liver Chemistry Tests", page: 87 },
      { section: "Acute Liver Injury & Failure", page: 89 },
      { section: "Viral Hepatitis", page: 90 },
      { section: "Biliary Disease", page: 88 },
      { section: "MASLD / NAFLD", page: 92 },
    ],
    pearlPages: [89, 88],
  },
  "Joint Pain": {
    manual: [
      { section: "Approach to Rheumatic Disease", page: 172 },
      { section: "Arthritis", page: 173 },
      { section: "Septic Arthritis (Empiric Antibiotics)", page: 113 },
      { section: "Rheumatologic Medications", page: 180 },
    ],
    pearlPages: [113, 173],
  },
  "Back Pain": {
    manual: [
      { section: "MSK Pain", page: 229 },
      { section: "CNS Emergencies", page: 201 },
      { section: "Osteomyelitis (Empiric Antibiotics)", page: 113 },
      { section: "Aortic Disease", page: 35 },
    ],
    pearlPages: [229, 201],
  },
};

export const CURRICULUM: CategoryCurriculum[] = RAW_CURRICULUM.map((c) => {
  const ref = MANUAL_BY_CATEGORY[c.category];
  return {
    ...c,
    manual: ref?.manual ?? [],
    chalkTalks: CHALK_TALKS_BY_CATEGORY[c.category] ?? [],
    quickManagement: c.quickManagement.map((m, i) => ({
      ...m,
      manualPage: m.manualPage ?? ref?.pearlPages[i],
    })),
  };
});

export const CURRICULUM_BY_CATEGORY: ReadonlyMap<string, CategoryCurriculum> = new Map(
  CURRICULUM.map((c) => [c.category, c]),
);

/**
 * Broad framework items to credit per post-encounter step, keyed by stepId:
 * the differential step accepts the full category differential buckets; the
 * workup step accepts the full work-up menu (labs + imaging). Lets a wide
 * differential and broad work-up earn credit, matching the end-of-station
 * framework. Returns {} for categories without a curriculum entry.
 */
export function breadthCreditForCategory(category: string): Record<string, string[]> {
  const c = CURRICULUM_BY_CATEGORY.get(category);
  if (!c) return {};
  const differential = c.differential.flatMap((g) => g.items);
  const workup = [
    ...c.workupMenu.labs.map((l) => l.test),
    ...c.workupMenu.imaging.map((i) => i.test),
  ];
  return { differential, workup, revised: differential };
}
