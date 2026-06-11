/**
 * Static exam-maneuver catalog. A superset of every maneuver id referenced by
 * the case library's physicalExamMappings[].revealedBy (47 ids) plus standard
 * extras. New cases that reference these ids need zero code changes.
 *
 * lineKeys: lowercase keywords that locate this maneuver's system line in the
 * patientFile PHYSICAL EXAM section (grounded fallback when no mapping fires).
 * segmentKeys: when set, only ";"-segments of that line containing one of
 * these keywords are revealed (special tests share a "Special:" line).
 * defaultNormal: safe, case-agnostic normal used only when neither a mapping
 * nor a patientFile exam line covers the maneuver. Never a positive finding.
 */

export interface ManeuverDef {
  id: string;
  label: string;
  system: string;
  lineKeys: string[];
  segmentKeys?: string[];
  defaultNormal: string;
}

export const EXAM_SYSTEMS = [
  "General",
  "Vitals",
  "HEENT",
  "Neck",
  "Cardiac",
  "Pulmonary",
  "Abdominal",
  "Extremities",
  "Skin",
  "Neuro",
] as const;

export const MANEUVERS: ManeuverDef[] = [
  // General
  { id: "assess_general_appearance", label: "Assess general appearance", system: "General", lineKeys: ["general"], defaultNormal: "Patient is alert and in no acute distress." },
  { id: "assess_mental_status", label: "Assess mental status / orientation", system: "General", lineKeys: ["neuro", "mental"], segmentKeys: ["alert", "orient", "a&o", "confus", "mental", "attention", "drowsy", "somnolent", "letharg"], defaultNormal: "Alert and oriented; mental status grossly normal." },

  // Vitals
  { id: "obtain_orthostatic_vitals", label: "Obtain orthostatic vitals", system: "Vitals", lineKeys: ["special", "vitals", "orthostatic"], segmentKeys: ["orthostatic"], defaultNormal: "No orthostatic change in blood pressure or heart rate." },
  { id: "repeat_vitals", label: "Repeat vital signs", system: "Vitals", lineKeys: ["vitals"], defaultNormal: "Vital signs unchanged from triage." },

  // HEENT
  { id: "inspect_conjunctiva", label: "Inspect conjunctiva", system: "HEENT", lineKeys: ["heent", "conjunctiva", "eyes"], segmentKeys: ["conjunctiva", "pallor", "pale"], defaultNormal: "Conjunctivae pink, no pallor." },
  { id: "inspect_sclera", label: "Inspect sclera for icterus", system: "HEENT", lineKeys: ["heent", "sclera", "eyes"], segmentKeys: ["sclera", "icterus", "jaundice"], defaultNormal: "Sclerae anicteric." },
  { id: "inspect_oropharynx", label: "Inspect oropharynx", system: "HEENT", lineKeys: ["heent", "oropharynx", "throat"], segmentKeys: ["oropharynx", "throat", "pharyn", "mucous", "tonsil"], defaultNormal: "Oropharynx clear, mucous membranes moist." },
  { id: "assess_mucous_membranes", label: "Assess mucous membranes", system: "HEENT", lineKeys: ["heent", "mucous"], segmentKeys: ["mucous", "dry", "moist"], defaultNormal: "Mucous membranes moist." },

  // Neck
  { id: "assess_jvp", label: "Assess JVP", system: "Neck", lineKeys: ["neck", "jvp"], segmentKeys: ["jvp", "jugular"], defaultNormal: "JVP not elevated." },
  { id: "auscultate_carotids", label: "Auscultate carotids", system: "Neck", lineKeys: ["neck", "carotid"], segmentKeys: ["carotid", "bruit"], defaultNormal: "No carotid bruits." },
  { id: "assess_neck_stiffness", label: "Assess neck stiffness / meningismus", system: "Neck", lineKeys: ["neck", "neuro", "special"], segmentKeys: ["stiff", "meningismus", "nuchal", "kernig", "brudzinski"], defaultNormal: "Neck supple, no meningismus." },
  { id: "assess_thyroid", label: "Palpate thyroid", system: "Neck", lineKeys: ["neck", "thyroid"], segmentKeys: ["thyroid", "goiter"], defaultNormal: "Thyroid not enlarged, no nodules." },
  { id: "palpate_lymph_nodes", label: "Palpate lymph nodes", system: "Neck", lineKeys: ["neck", "lymph", "heent"], segmentKeys: ["lymph", "adenopathy", "node"], defaultNormal: "No cervical lymphadenopathy." },

  // Cardiac
  { id: "auscultate_aortic_area", label: "Auscultate aortic area", system: "Cardiac", lineKeys: ["cardiac", "heart", "cv"], defaultNormal: "Regular rate and rhythm, normal S1/S2, no murmur." },
  { id: "auscultate_mitral_area", label: "Auscultate mitral area / apex", system: "Cardiac", lineKeys: ["cardiac", "heart", "cv"], defaultNormal: "Regular rate and rhythm, normal S1/S2, no murmur." },
  { id: "auscultate_with_bell", label: "Auscultate with the bell (low-pitched sounds)", system: "Cardiac", lineKeys: ["cardiac", "heart", "cv"], defaultNormal: "No gallop or low-pitched murmur appreciated." },
  { id: "assess_murmur_radiation", label: "Assess murmur radiation (carotids/axilla)", system: "Cardiac", lineKeys: ["cardiac", "heart", "cv"], segmentKeys: ["murmur", "radiat", "carotid", "axilla"], defaultNormal: "No murmur radiation appreciated." },
  { id: "palpate_pmi", label: "Palpate PMI", system: "Cardiac", lineKeys: ["cardiac", "heart", "cv"], segmentKeys: ["pmi", "displaced", "heave", "thrill"], defaultNormal: "PMI nondisplaced, no heaves or thrills." },

  // Pulmonary
  { id: "auscultate_anterior_lungs", label: "Auscultate anterior lung fields", system: "Pulmonary", lineKeys: ["lungs", "pulm", "chest"], defaultNormal: "Lungs clear to auscultation anteriorly." },
  { id: "auscultate_posterior_lungs", label: "Auscultate posterior lung fields", system: "Pulmonary", lineKeys: ["lungs", "pulm", "chest"], defaultNormal: "Lungs clear to auscultation posteriorly." },
  { id: "percuss_posterior_lungs", label: "Percuss posterior lung fields", system: "Pulmonary", lineKeys: ["lungs", "pulm", "percussion"], segmentKeys: ["percussion", "dull", "resonant", "hyperresonant"], defaultNormal: "Resonant to percussion bilaterally." },
  { id: "assess_egophony", label: "Assess egophony", system: "Pulmonary", lineKeys: ["lungs", "pulm", "special"], segmentKeys: ["egophony", "e-to-a", "fremitus"], defaultNormal: "No egophony." },
  { id: "assess_tactile_fremitus", label: "Assess tactile fremitus", system: "Pulmonary", lineKeys: ["lungs", "pulm", "special"], segmentKeys: ["fremitus"], defaultNormal: "Tactile fremitus symmetric." },
  { id: "palpate_chest_wall", label: "Palpate chest wall for tenderness", system: "Pulmonary", lineKeys: ["chest wall", "chest"], segmentKeys: ["tender", "reproduc", "palpation"], defaultNormal: "No chest wall tenderness to palpation." },

  // Abdominal
  { id: "inspect_abdomen", label: "Inspect abdomen", system: "Abdominal", lineKeys: ["abdomen", "abd"], segmentKeys: ["distend", "distension", "caput", "scar", "inspect", "soft", "flat"], defaultNormal: "Abdomen flat, no distension or visible abnormality." },
  { id: "auscultate_bowel_sounds", label: "Auscultate bowel sounds", system: "Abdominal", lineKeys: ["abdomen", "abd", "bowel"], segmentKeys: ["bowel", "sounds", "hyperactive", "hypoactive", "absent"], defaultNormal: "Normal active bowel sounds." },
  { id: "palpate_all_quadrants", label: "Palpate all quadrants", system: "Abdominal", lineKeys: ["abdomen", "abd"], defaultNormal: "Abdomen soft, nontender throughout." },
  { id: "palpate_ruq", label: "Palpate RUQ", system: "Abdominal", lineKeys: ["abdomen", "abd"], segmentKeys: ["ruq", "right upper", "liver", "hepat", "tender", "soft", "nontender"], defaultNormal: "RUQ soft, nontender." },
  { id: "palpate_rlq", label: "Palpate RLQ", system: "Abdominal", lineKeys: ["abdomen", "abd"], segmentKeys: ["rlq", "right lower", "mcburney", "tender", "soft", "nontender"], defaultNormal: "RLQ soft, nontender." },
  { id: "palpate_llq", label: "Palpate LLQ", system: "Abdominal", lineKeys: ["abdomen", "abd"], segmentKeys: ["llq", "left lower", "tender", "soft", "nontender"], defaultNormal: "LLQ soft, nontender." },
  { id: "palpate_luq", label: "Palpate LUQ", system: "Abdominal", lineKeys: ["abdomen", "abd"], segmentKeys: ["luq", "left upper", "spleen", "splen", "tender", "soft", "nontender"], defaultNormal: "LUQ soft, nontender." },
  { id: "assess_rebound_tenderness", label: "Assess rebound tenderness", system: "Abdominal", lineKeys: ["abdomen", "abd", "special"], segmentKeys: ["rebound", "peritoneal"], defaultNormal: "No rebound tenderness." },
  { id: "assess_guarding", label: "Assess guarding / rigidity", system: "Abdominal", lineKeys: ["abdomen", "abd", "special"], segmentKeys: ["guarding", "rigid"], defaultNormal: "No guarding or rigidity." },
  { id: "perform_murphy_sign", label: "Murphy sign", system: "Abdominal", lineKeys: ["abdomen", "abd", "special"], segmentKeys: ["murphy"], defaultNormal: "Murphy sign negative." },
  { id: "perform_psoas_sign", label: "Psoas sign", system: "Abdominal", lineKeys: ["abdomen", "abd", "special"], segmentKeys: ["psoas"], defaultNormal: "Psoas sign negative." },
  { id: "perform_rovsing_sign", label: "Rovsing sign", system: "Abdominal", lineKeys: ["abdomen", "abd", "special"], segmentKeys: ["rovsing"], defaultNormal: "Rovsing sign negative." },
  { id: "assess_shifting_dullness", label: "Assess shifting dullness", system: "Abdominal", lineKeys: ["abdomen", "abd", "special"], segmentKeys: ["shifting", "dullness", "ascites"], defaultNormal: "No shifting dullness." },
  { id: "assess_fluid_wave", label: "Assess fluid wave", system: "Abdominal", lineKeys: ["abdomen", "abd", "special"], segmentKeys: ["fluid wave", "fluid"], defaultNormal: "No fluid wave." },
  { id: "assess_splenomegaly", label: "Palpate for splenomegaly", system: "Abdominal", lineKeys: ["abdomen", "abd", "special"], segmentKeys: ["spleen", "splen"], defaultNormal: "Spleen not palpable." },
  { id: "assess_hepatomegaly", label: "Palpate liver edge", system: "Abdominal", lineKeys: ["abdomen", "abd", "special"], segmentKeys: ["liver", "hepatomegaly", "hepatic", "span"], defaultNormal: "Liver edge not palpable below the costal margin." },
  { id: "assess_suprapubic_tenderness", label: "Assess suprapubic tenderness", system: "Abdominal", lineKeys: ["abdomen", "abd", "special"], segmentKeys: ["suprapubic"], defaultNormal: "No suprapubic tenderness." },
  { id: "assess_cva_tenderness", label: "Assess CVA tenderness", system: "Abdominal", lineKeys: ["special", "back", "abdomen", "abd"], segmentKeys: ["cva", "costovertebral", "flank"], defaultNormal: "No costovertebral angle tenderness." },

  // Extremities
  { id: "assess_edema", label: "Assess peripheral edema", system: "Extremities", lineKeys: ["extremities", "ext"], segmentKeys: ["edema", "pitting", "swelling"], defaultNormal: "No peripheral edema." },
  { id: "assess_calf_tenderness", label: "Assess calf tenderness / asymmetry", system: "Extremities", lineKeys: ["extremities", "ext", "special"], segmentKeys: ["calf", "homans", "dvt", "asymmetr"], defaultNormal: "Calves soft and nontender, symmetric." },
  { id: "assess_peripheral_pulses", label: "Palpate peripheral pulses", system: "Extremities", lineKeys: ["extremities", "ext"], segmentKeys: ["pulse"], defaultNormal: "Peripheral pulses 2+ and symmetric." },
  { id: "inspect_nails", label: "Inspect nails", system: "Extremities", lineKeys: ["extremities", "ext", "nails", "skin"], segmentKeys: ["nail", "clubbing", "splinter", "koilonychia"], defaultNormal: "Nails without clubbing or lesions." },
  { id: "inspect_palms_and_soles", label: "Inspect palms and soles", system: "Extremities", lineKeys: ["skin", "extremities", "ext"], segmentKeys: ["palm", "sole", "janeway", "osler"], defaultNormal: "Palms and soles without lesions." },
  { id: "assess_capillary_refill", label: "Assess capillary refill", system: "Extremities", lineKeys: ["extremities", "ext"], segmentKeys: ["capillary", "refill", "perfus"], defaultNormal: "Capillary refill under 2 seconds." },

  // Skin
  { id: "inspect_skin", label: "Inspect skin", system: "Skin", lineKeys: ["skin"], defaultNormal: "Skin warm and dry, no rash." },
  { id: "assess_for_jaundice", label: "Assess for jaundice", system: "Skin", lineKeys: ["skin", "heent", "sclera"], segmentKeys: ["jaundice", "icterus", "icteric"], defaultNormal: "No jaundice." },
  { id: "assess_for_petechiae", label: "Assess for petechiae", system: "Skin", lineKeys: ["skin"], segmentKeys: ["petechiae", "petechial"], defaultNormal: "No petechiae." },
  { id: "assess_for_purpura", label: "Assess for purpura / ecchymoses", system: "Skin", lineKeys: ["skin"], segmentKeys: ["purpura", "ecchymos", "bruis"], defaultNormal: "No purpura or ecchymoses." },
  { id: "assess_for_track_marks", label: "Inspect for track marks", system: "Skin", lineKeys: ["skin", "extremities"], segmentKeys: ["track", "injection"], defaultNormal: "No track marks or injection stigmata." },
  { id: "assess_skin_turgor", label: "Assess skin turgor", system: "Skin", lineKeys: ["skin"], segmentKeys: ["turgor", "tenting"], defaultNormal: "Skin turgor normal." },

  // Neuro
  { id: "assess_pronator_drift", label: "Assess pronator drift", system: "Neuro", lineKeys: ["neuro", "special"], segmentKeys: ["pronator", "drift"], defaultNormal: "No pronator drift." },
  { id: "assess_motor_strength", label: "Assess motor strength", system: "Neuro", lineKeys: ["neuro"], segmentKeys: ["strength", "motor", "weak", "paresis", "5/5", "4/5"], defaultNormal: "Strength 5/5 in all extremities." },
  { id: "assess_sensation", label: "Assess sensation", system: "Neuro", lineKeys: ["neuro"], segmentKeys: ["sensation", "sensory", "numb", "proprioception"], defaultNormal: "Sensation intact to light touch." },
  { id: "assess_reflexes", label: "Assess deep tendon reflexes", system: "Neuro", lineKeys: ["neuro"], segmentKeys: ["reflex", "dtr", "babinski", "clonus"], defaultNormal: "Deep tendon reflexes 2+ and symmetric." },
  { id: "assess_coordination", label: "Assess coordination (finger-to-nose)", system: "Neuro", lineKeys: ["neuro"], segmentKeys: ["coordination", "finger", "dysmetria", "cerebellar"], defaultNormal: "Coordination intact, no dysmetria." },
  { id: "assess_gait", label: "Assess gait", system: "Neuro", lineKeys: ["neuro", "special"], segmentKeys: ["gait", "ataxi", "walk"], defaultNormal: "Gait steady and narrow-based." },
  { id: "assess_asterixis", label: "Assess for asterixis", system: "Neuro", lineKeys: ["neuro", "special"], segmentKeys: ["asterixis", "flap"], defaultNormal: "No asterixis." },
  { id: "assess_cranial_nerves", label: "Assess cranial nerves", system: "Neuro", lineKeys: ["neuro"], segmentKeys: ["cranial", "cn", "facial", "pupil"], defaultNormal: "Cranial nerves II–XII grossly intact." },
];

export const MANEUVER_BY_ID: ReadonlyMap<string, ManeuverDef> = new Map(
  MANEUVERS.map((m) => [m.id, m]),
);
