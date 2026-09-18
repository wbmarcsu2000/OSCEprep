// src/data/neuroGuidelineDrills.ts
/**
 * Neurology drill bank — domains + the aggregated drill list.
 *
 * Every Neurology drill uses the head-graded item convention
 * ("<recall head> — <clue>"; see obVignetteDrills.ts) so the whole learning
 * ladder (Learn → Cloze → Sort → By category → Full recall) applies. Caps and
 * the head-collision rule are asserted in __tests__/neuroGuidelineDrills.test.ts.
 */
import type { DrillDomainDef, GuidelineDrill } from "./guidelineDrillBank";
import { NEURO_STROKE_DRILLS } from "./neuroStrokeDrills";
import { NEURO_LOCALIZATION_DRILLS } from "./neuroLocalizationDrills";
import { NEURO_DEMENTIA_MOVEMENT_DRILLS } from "./neuroDementiaMovementDrills";
import { NEURO_WEAKNESS_DRILLS } from "./neuroWeaknessDrills";
import { NEURO_HEADACHE_VERTIGO_SEIZURE_DRILLS } from "./neuroHeadacheVertigoSeizureDrills";
import { NEURO_INFECTION_TOXIC_NUTRITION_DRILLS } from "./neuroInfectionToxicNutritionDrills";
import { NEURO_HEMORRHAGE_TRAUMA_TUMOR_DRILLS } from "./neuroHemorrhageTraumaTumorDrills";
import { NEURO_PHARM_DRILLS } from "./neuroPharmDrills";

export const NEURO_DOMAINS: DrillDomainDef[] = [
  {
    id: "stroke",
    label: "Stroke syndromes",
    emoji: "🩸",
    noun: "drill",
    intro: [
      "Vessel first: leg = ACA, face/arm = MCA, vision = PCA; crossed findings = brainstem.",
      "Language deficits localize to the dominant hemisphere — sort by fluency, comprehension, repetition.",
      "Non-contrast CT before anything; the tPA clock starts at last known normal.",
      "Name the mechanism (carotid plaque vs atrial fibrillation) because it decides prevention.",
    ],
  },
  {
    id: "localization",
    label: "Cord & nerve localization",
    emoji: "📍",
    noun: "drill",
    intro: [
      "Decide the level first: cortex, brainstem, cord, root, plexus, nerve, junction, muscle.",
      "Which modality crosses where: pain/temperature crosses in the cord, position/vibration and motor cross in the medulla.",
      "Reflex lost + movement weak + dermatome numb = one root; a fracture site names one nerve.",
      "UMN signs (hyperreflexia, Babinski) versus LMN signs (fasciculations, atrophy) split the whole list.",
    ],
  },
  {
    id: "dementia-movement",
    label: "Dementia & movement",
    emoji: "🧠",
    noun: "drill",
    intro: [
      "Ask what else is there besides memory loss: hallucinations, gait, incontinence, focal signs, myoclonus, tremor.",
      "Rule out the reversible causes before naming a degeneration: B12, TSH, VDRL, depression, drugs, NPH, subdural.",
      "Tremor at rest, with action, or at target — each names a different system.",
      "Age and speed sort the movement disorders: a young patient with parkinsonism is Wilson until proven otherwise.",
    ],
  },
  {
    id: "weakness",
    label: "Weakness: nerve, junction & muscle",
    emoji: "💪",
    noun: "drill",
    intro: [
      "Pattern is the diagnosis: ascending and areflexic, fatigable, improves with use, descending with pupils, proximal with high CK.",
      "Reflexes and sensation separate nerve (both abnormal), junction (both normal) and muscle (reflexes kept).",
      "Name the antibody, the associated tumor, and the one test that confirms.",
      "Steroids help MS and CIDP but not Guillain-Barré — treatments are not interchangeable.",
    ],
  },
  {
    id: "headache-vertigo-seizure",
    label: "Headache, vertigo & seizures",
    emoji: "⚡",
    noun: "drill",
    intro: [
      "Red flags first: worst-ever, over 50 with jaw claudication, papilledema, fever with stiff neck.",
      "Vertigo splits by duration and hearing: seconds with position, days after a virus, episodes with tinnitus.",
      "Classify the seizure by awareness and spread before picking the drug.",
      "Status epilepticus is a stepwise ladder — benzodiazepine, then a loading antiepileptic, then anesthesia.",
    ],
  },
  {
    id: "infection-toxic-nutrition",
    label: "Infections, toxins & nutrition",
    emoji: "🦠",
    noun: "drill",
    intro: [
      "The CSF pattern (glucose, cells, protein) names the class of organism before any culture returns.",
      "Host and exposure name the pathogen: neonate, HIV with a CD4 count, lake swimming, undercooked pork.",
      "Every vitamin deficiency has a cause clue (alcohol, gastrectomy, isoniazid) and a signature lesion.",
      "Toxins act on one synapse: name the transmitter blocked and the tone that results.",
    ],
  },
  {
    id: "hemorrhage-trauma-tumor",
    label: "Hemorrhage, trauma & tumors",
    emoji: "🧬",
    noun: "drill",
    intro: [
      "Vessel, shape on CT, and time course name the bleed: lens, crescent, or star.",
      "A blown pupil is uncal herniation until proven otherwise — treat pressure before imaging finishes.",
      "Age and location name the tumor: posterior fossa in a child, grey-white junction in an adult.",
      "A skin or eye finding plus a tumor pairing names the phakomatosis and its chromosome.",
    ],
  },
  {
    id: "pharm",
    label: "Neuro pharm",
    emoji: "💊",
    noun: "drill",
    intro: [
      "Shelf tests side effects and mechanisms, not doses — pair every drug with its signature adverse effect.",
      "Time since the antipsychotic started names the extrapyramidal syndrome and its antidote.",
      "Cholinergic versus anticholinergic: DUMBBELSS one way, dry-hot-red-mad the other.",
      "Match the anesthetic property (potency, onset, toxicity) to the physical constant that explains it.",
    ],
  },
];

export const NEURO_GUIDELINE_DRILLS: GuidelineDrill[] = [
  ...NEURO_STROKE_DRILLS,
  ...NEURO_LOCALIZATION_DRILLS,
  ...NEURO_DEMENTIA_MOVEMENT_DRILLS,
  ...NEURO_WEAKNESS_DRILLS,
  ...NEURO_HEADACHE_VERTIGO_SEIZURE_DRILLS,
  ...NEURO_INFECTION_TOXIC_NUTRITION_DRILLS,
  ...NEURO_HEMORRHAGE_TRAUMA_TUMOR_DRILLS,
  ...NEURO_PHARM_DRILLS,
];
