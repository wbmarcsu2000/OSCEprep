// src/data/neuroStrokeDrills.ts
/**
 * Neurology drills — the "stroke" domain (Stroke syndromes) of the Neurology
 * drill bank.
 *
 * Each drill is one way a stroke is asked on the shelf: the cortical deficit
 * that names the vessel, the crossed brainstem syndrome, the aphasia sorted by
 * fluency/comprehension/repetition, the lacunar syndrome and its small-vessel
 * pathology, the acute-management algorithm (CT → tPA → BP), and the
 * embolic-source workup that decides prevention. `org` is "Localization",
 * "Management" or "Prevention" so the Browse list splits the families.
 *
 * ITEM RULE — items are "<recall head> — <why / clue>". Only the head is graded
 * (gradableItem in drillProgressCore), so it is the shortest phrase a student
 * would actually write; "/" in a head lists alternative spellings any one of
 * which earns credit. Numbers, cut-offs and nuance live after the dash or in
 * pearls, which are shown on reveal and never graded. Heads within one drill
 * must not credit each other — asserted in the test.
 *
 * Standard board values; institutional protocols vary. Educational use only.
 * Authored 2026-09-15 from standard shelf sources (AHA/ASA 2019 acute ischemic
 * stroke guideline, NBME-style neurology review).
 */
import type { GuidelineDrill } from "./guidelineDrillBank";

const LOCALIZATION = "Localization";
const MANAGEMENT = "Management";
const PREVENTION = "Prevention";
const REVIEWED = "2026-09-15";

export const NEURO_STROKE_DRILLS: GuidelineDrill[] = [
  // ───────────────────────────── LOCALIZATION ─────────────────────────────
  {
    id: "stroke-cortical-by-vessel",
    domain: "stroke",
    name: "Cortical stroke by vessel",
    org: LOCALIZATION,
    prompt: `Three patients arrive within an hour: a 68M whose right leg gave way and who is now incontinent; a 71F with right face and arm weakness who speaks in halting single words; a 74M who cannot see anything to his left and does not recognize his wife.\n\nName the occluded vessel or cortical region for each anterior- and posterior-circulation pattern, and the named cortical syndromes a shelf expects, with the deficit that identifies each.`,
    keyPoints: [
      {
        group: "Anterior circulation",
        items: [
          "ACA / anterior cerebral artery — contralateral LEG weakness and numbness > arm; urinary incontinence, abulia, grasp reflex; medial frontal/paracentral lobule",
          "Left MCA / dominant MCA — contralateral face + arm > leg; Broca or Wernicke aphasia; gaze deviates toward the lesion; homonymous hemianopia",
          "Right MCA / nondominant MCA — left face + arm > leg weakness, left homonymous hemianopia, eyes deviate right; NO aphasia — neglect, anosognosia and aprosodia instead",
          "Ophthalmic artery / amaurosis fugax — transient monocular 'curtain' vision loss = ipsilateral internal carotid plaque; carotid duplex next",
        ],
      },
      {
        group: "Posterior circulation",
        items: [
          "PCA / posterior cerebral artery — contralateral homonymous hemianopia with macular sparing; prosopagnosia; alexia without agraphia (dominant, splenium)",
          "Basilar artery — locked-in: quadriplegia, anarthria, awake with only vertical eye movements/blinking; 'top of the basilar' = cortical blindness, coma",
          "Vertebral artery / PICA — lateral medullary (Wallenberg): dysphagia, hoarseness, ipsilateral Horner, crossed pain/temperature loss, vertigo",
          "Watershed / border zone — hypotension or cardiac arrest: 'man in a barrel' bilateral proximal arm/shoulder weakness with distal sparing (ACA-MCA zone); transcortical aphasia",
        ],
      },
      {
        group: "Named cortical syndromes",
        items: [
          "Gerstmann / angular gyrus — dominant parietal tetrad: agraphia, acalculia, finger agnosia, left-right confusion",
          "Hemispatial neglect / nondominant parietal — ignores the left side, cannot draw a clock face or copy a figure, denies the deficit (anosognosia)",
          "Prosopagnosia / fusiform gyrus — cannot recognize familiar faces but knows them by voice; right or bilateral occipitotemporal (PCA territory) infarct",
          "Anton / cortical blindness — bilateral occipital (PCA) infarcts: blind with intact pupils, denies blindness and confabulates what she 'sees'",
          "Frontal lobe / prefrontal — disinhibition, apathy/abulia, poor planning and judgment, perseveration, primitive reflexes; personality change",
        ],
      },
    ],
    pearls:
      "Vessel by body part: leg = ACA, face/arm = MCA, vision = PCA; aphasia or neglect says cortex, so a pure motor hemiparesis without cortical signs is a lacune instead. Gaze deviation: a frontal eye field stroke looks TOWARD the lesion and away from the hemiparesis; a pontine lesion or a seizure focus looks AWAY from the lesion, toward the weak or jerking side. Macular sparing in a PCA stroke is dual supply from the MCA to the occipital pole; a lesion at the optic tract or radiation does not spare the macula. Anton syndrome needs BILATERAL occipital lesions; prosopagnosia is a right or bilateral fusiform lesion. Amaurosis fugax is a TIA of the eye and gets the same workup — carotid duplex in the hypertensive 60-year-old, ECG/Holter for AF in the normotensive 80-year-old. Watershed infarcts follow a hypotensive event (cardiac arrest, surgery); the classic exam is proximal weakness with distal sparing.",
    reviewed: REVIEWED,
  },
  {
    id: "stroke-brainstem-syndromes",
    domain: "stroke",
    name: "Brainstem stroke syndromes",
    org: LOCALIZATION,
    prompt: `61M with sudden vertigo, hoarseness and difficulty swallowing. Exam: right ptosis and miosis, loss of pain sensation on the right face and the LEFT arm and leg, right limb ataxia; strength is normal.\n\nName the brainstem syndromes by level (medulla, pons, midbrain) with the artery and the crossed findings for each, then the localizing clues that place a lesion in the brainstem.`,
    keyPoints: [
      {
        group: "Medulla",
        items: [
          "Wallenberg / lateral medullary — PICA (or vertebral artery): dysphagia, hoarseness, ipsilateral Horner + face pain loss, contralateral body pain/temperature loss, vertigo, ataxia",
          "Medial medullary / anterior spinal artery — ipsilateral tongue deviation (CN XII) + contralateral hemiparesis and loss of position/vibration; pain/temperature spared",
        ],
      },
      {
        group: "Pons",
        items: [
          "Lateral pontine / AICA — ipsilateral LMN facial paralysis (Bell-like) + deafness/tinnitus (labyrinthine artery), Horner, contralateral pain/temperature loss; FACIAL spelled backwards contains AICA",
          "Locked-in / basilar artery — ventral pons: quadriplegia + anarthria with preserved consciousness and vertical gaze/blinking; sensation intact",
          "Central pontine myelinolysis / osmotic demyelination — hyponatremia corrected >8–10 mEq/L per day: locked-in-like quadriparesis, dysarthria, dysphagia days later",
          "Millard-Gubler — ventral pontine: ipsilateral CN VI and VII palsies with contralateral hemiparesis; face and eye on one side, body on the other",
        ],
      },
      {
        group: "Midbrain",
        items: [
          "Weber / medial midbrain — PCA branches: ipsilateral CN III palsy (down-and-out eye, ptosis, dilated pupil) + contralateral spastic hemiparesis",
          "Parinaud / dorsal midbrain — pinealoma or hydrocephalus: upward gaze palsy, light-near dissociation, convergence-retraction nystagmus, lid retraction",
          "Benedikt / red nucleus — ipsilateral CN III palsy + contralateral ataxia and tremor (red nucleus, superior cerebellar peduncle fibers)",
        ],
      },
      {
        group: "Localizing clues",
        items: [
          "Horner syndrome — miosis, ptosis, anhidrosis from descending sympathetics: lateral medulla or lateral pons after a stroke (also carotid dissection, Pancoast)",
          "Hypoglossal / tongue deviation — tongue points TOWARD the lesion (LMN, CN XII nucleus) and AWAY from the hemiparesis = medial medulla; a cortical UMN lesion points it away from the lesion",
          "Facial nerve palsy / CN VII — whole hemiface including forehead (LMN) = pons/AICA; forehead spared = cortical or capsular (UMN)",
          "Dysphagia / nucleus ambiguus — hoarseness, dysphagia, absent gag = lateral medulla (CN IX/X); 'PICAchew' = PICA stroke causes dysphagia",
        ],
      },
    ],
    pearls:
      "The brainstem signature is CROSSED findings: a cranial nerve deficit on one side of the face with weakness or sensory loss on the opposite side of the body — cortex and capsule give same-side face and body. Medial vs lateral: medial syndromes take the corticospinal tract, medial lemniscus and a motor cranial nerve (XII, VI, III), so they cause contralateral hemiparesis; lateral syndromes take the spinothalamic tract, spinal trigeminal nucleus, sympathetics and vestibular/cerebellar connections, so they cause crossed pain loss, Horner, vertigo and ataxia without weakness. Which cranial nerve names the level: III/IV = midbrain, V–VIII = pons, IX–XII = medulla. Central pontine myelinolysis is iatrogenic — the vignette is an alcoholic or malnourished patient with Na 110 'corrected' overnight; limit correction to 8 mEq/L per day. Parinaud in a child is a pineal tumor with obstructive hydrocephalus; a germinoma may secrete β-hCG (precocious puberty in a boy).",
    reviewed: REVIEWED,
  },
  {
    id: "stroke-aphasia-types",
    domain: "stroke",
    name: "Aphasia types",
    org: LOCALIZATION,
    prompt: `72F, right-handed, has spoken fluently but nonsensically since this morning — a stream of well-formed words that mean nothing — and cannot follow a one-step command. Asked to repeat 'no ifs, ands, or buts' she produces a different string of words. No weakness.\n\nSort the aphasias by fluency, comprehension and repetition, name the lesion for each, then the anatomy and the speech disorders that mimic aphasia.`,
    keyPoints: [
      {
        group: "Non-fluent",
        items: [
          "Broca / expressive — effortful telegraphic speech, comprehension intact, repetition impaired; frustrated; often right face/arm weakness (superior MCA division)",
          "Global — non-fluent, cannot comprehend, cannot repeat; large left MCA infarct (Broca + Wernicke + arcuate) with hemiplegia and hemianopia",
          "Transcortical motor — Broca-like non-fluent speech BUT repetition intact; watershed anterior/superior to Broca (ACA-MCA border zone)",
          "Mixed transcortical / isolation of speech area — global-like (non-fluent, no comprehension) BUT repeats, even echolalia; perisylvian region isolated by watershed infarcts",
        ],
      },
      {
        group: "Fluent",
        items: [
          "Wernicke / receptive — fluent word salad with neologisms, no comprehension, repetition impaired; unaware of the deficit; right superior quadrantanopia",
          "Conduction / arcuate fasciculus — fluent, comprehends, ONLY repetition impaired with phonemic paraphasias; supramarginal gyrus/insula",
          "Transcortical sensory — Wernicke-like fluent speech and poor comprehension BUT repetition intact; posterior watershed (MCA-PCA border zone)",
          "Anomic — fluent, comprehends, repeats; word-finding pauses and circumlocution only; angular gyrus, mildest form; also early Alzheimer",
        ],
      },
      {
        group: "Anatomy & mimics",
        items: [
          "Superior temporal gyrus — Wernicke area, posterior part, dominant temporal lobe; inferior division of the left MCA",
          "Inferior frontal gyrus — Broca area (pars opercularis/triangularis), dominant frontal lobe; superior division of the left MCA",
          "Left MCA / dominant hemisphere — nearly every aphasia; language is left-sided in ~95% of right-handers and ~70% of left-handers",
          "Dysarthria — slurred MOTOR speech with normal language: comprehension, grammar and writing intact; cerebellar, bulbar or lacunar (clumsy-hand)",
          "Aprosodia / right hemisphere — nondominant: flat monotone speech or cannot read emotional tone; word content is intact",
        ],
      },
    ],
    pearls:
      "Three questions sort every aphasia: fluent? comprehends? repeats? Repetition impaired = the perisylvian trio (Broca, Wernicke, conduction, and global if all fail); repetition INTACT = a transcortical aphasia, which localizes to the watershed zones around the perisylvian language area. Broca patients know they cannot speak and are frustrated; Wernicke patients do not know and may be misdiagnosed as psychotic — a sudden 'psychosis' in an elderly patient with a right visual field cut is a stroke. Conduction aphasia is the pure repetition failure. A patient who cannot speak but writes normally and follows commands has dysarthria or anarthria, not aphasia. Aphasia can be the only sign of a left MCA stroke and is a disabling deficit that qualifies for tPA even with a low NIHSS.",
    reviewed: REVIEWED,
  },
  {
    id: "stroke-deep-lacunar",
    domain: "stroke",
    name: "Lacunar & deep strokes",
    org: LOCALIZATION,
    prompt: `66M with 20 years of poorly controlled hypertension wakes with equal weakness of the left face, arm and leg. Sensation, language, visual fields and attention are normal. Non-contrast CT is unremarkable; MRI shows a 9 mm infarct in the right posterior limb of the internal capsule.\n\nName the classic lacunar syndromes with their structure, the deep-nucleus strokes a shelf asks, and the small-vessel pathology (and its mimics) behind them.`,
    keyPoints: [
      {
        group: "Lacunar syndromes",
        items: [
          "Pure motor hemiparesis / posterior limb internal capsule — face, arm and leg equally weak with NO sensory, visual or cortical signs; the most common lacune; also basis pontis",
          "Pure sensory stroke / VPL thalamus — hemibody numbness and paresthesias without weakness; ventral posterolateral thalamus",
          "Ataxic hemiparesis — weakness plus ipsilateral cerebellar-type ataxia out of proportion to it, leg > arm; posterior limb of the capsule or basis pontis",
          "Dysarthria-clumsy hand — slurred speech, facial weakness and a clumsy dominant hand; basis pontis or genu of the internal capsule",
        ],
      },
      {
        group: "Deep nuclei",
        items: [
          "Hemiballismus / subthalamic nucleus — wild flinging of the contralateral arm/leg; left arm flailing = right subthalamic nucleus",
          "Thalamic pain / Dejerine-Roussy — severe contralateral burning limb pain with allodynia months after a thalamic stroke; TCAs, gabapentin",
          "Putamen / basal ganglia — most common site of hypertensive intracerebral hemorrhage (lenticulostriate rupture): contralateral hemiparesis, eyes deviate toward the lesion",
        ],
      },
      {
        group: "Small-vessel pathology & mimics",
        items: [
          "Lipohyalinosis — chronic hypertension: hyaline thickening/microatheroma of penetrating arterioles → tiny cavities (lacunes <15 mm); the USMLE mechanism",
          "Charcot-Bouchard microaneurysm — <1 mm aneurysms on lenticulostriates from hypertension; rupture = intraparenchymal bleed (putamen, thalamus, pons, cerebellum)",
          "Lenticulostriate — deep penetrating branches of the MCA to the internal capsule and basal ganglia; end arteries with no collaterals",
          "Cerebral amyloid angiopathy — LOBAR (cortical) hemorrhage in a normotensive elderly patient, recurrent, Alzheimer; β-amyloid in vessel walls, NOT lipohyalinosis",
          "CADASIL — NOTCH3 mutation, chromosome 19, autosomal dominant: young adult with migraine with aura, recurrent lacunar strokes and early vascular dementia without hypertension",
        ],
      },
    ],
    pearls:
      "Lacunar = small (<15 mm) infarct in a deep penetrator: no aphasia, no neglect, no field cut, no cortical sensory loss — those say cortex and a large vessel. The shelf cares less about which lacunar syndrome than about the mechanism: hypertension → lipohyalinosis of lenticulostriate, thalamoperforating and pontine penetrating arteries. The same vessels bleed via Charcot-Bouchard microaneurysms, so hypertension explains both the lacune and the deep intracerebral hemorrhage; a lobar bleed in an old normotensive patient is amyloid angiopathy instead. Lacunes are often invisible on early CT — MRI diffusion shows them. Antiplatelet + BP control + statin for secondary prevention; tPA still applies within the window. Thalamic pain syndrome is the 'severe limb pain months after a stroke' answer.",
    reviewed: REVIEWED,
  },
  // ────────────────────────────── MANAGEMENT ──────────────────────────────
  {
    id: "stroke-acute-management",
    domain: "stroke",
    name: "Acute stroke management",
    org: MANAGEMENT,
    prompt: `70F brought in at 08:40 with left arm and face weakness and dysarthria; her husband says she was normal at breakfast at 07:30. BP 196/108, glucose 112, INR 1.0, no anticoagulants. She had a knee replacement 4 months ago.\n\nList the first steps and imaging, the reperfusion and blood-pressure rules for ischemic stroke, the reversal and pressure targets for hemorrhagic stroke, and the traps.`,
    keyPoints: [
      {
        group: "First steps & imaging",
        items: [
          "Non-contrast head CT / noncontrast CT / NCCT — first: blood is hyperdense; early ischemia is usually invisible; door-to-imaging ≤20 min; contrast CT is for tumor/abscess",
          "CT angiography / CTA — head and neck: large-vessel occlusion (ICA, M1, basilar) for thrombectomy; dissection; add CT perfusion in the 6–24 h window",
          "Last known normal / LKN — the clock starts when last seen well, not when found; fingerstick glucose, NIHSS and the contraindication checklist run in parallel",
        ],
      },
      {
        group: "Ischemic",
        items: [
          "Alteplase / tPA — IV within 4.5 h of last known normal (0.9 mg/kg, max 90 mg, 10% bolus); tenecteplase is the accepted alternative",
          "Mechanical thrombectomy — large-vessel occlusion up to 6 h, up to 24 h with favorable perfusion imaging (DAWN/DEFUSE-3); give tPA first if eligible",
          "Aspirin — 160–325 mg within 24–48 h when no tPA (24 h after tPA); add clopidogrel for 21 days for minor stroke/high-risk TIA; never heparin drips routinely",
          "Permissive hypertension — treat only if >220/120 (no lysis) or to get under 185/110 for tPA, then keep <180/105 for 24 h; the penumbra needs pressure",
          "Heparin / anticoagulation — the NBME answer for posterior stroke from vertebral artery dissection (chiropractor); for AF start a DOAC days later, not acutely",
        ],
      },
      {
        group: "Hemorrhagic",
        items: [
          "Labetalol / nicardipine — first step in ICH: rapid IV titration to systolic ~140 (not below 130); the same drugs lower a tPA candidate to under 185/110",
          "FFP / PCC / vitamin K — reverse warfarin (4-factor PCC preferred, FFP if unavailable, plus IV vitamin K); idarucizumab for dabigatran, andexanet for Xa inhibitors",
          "Nimodipine — subarachnoid hemorrhage only: oral for 21 days to prevent delayed vasospasm (days 3–14); not for intraparenchymal bleeds",
          "Surgical evacuation / cerebellar hematoma — cerebellar bleed >3 cm or brainstem compression/hydrocephalus; EVD for intraventricular blood; neurosurgery consult",
        ],
      },
      {
        group: "Traps",
        items: [
          "Wake-up stroke — last known normal is bedtime, so usually outside the window; MRI DWI-FLAIR mismatch can still select for lysis",
          "Endocarditis / septic emboli — fever + stroke in an IV drug user: NO tPA or anticoagulation (mycotic aneurysm bleeds); IV antibiotics, echo",
          "Hyponatremia corrected too fast / osmotic demyelination — >8–10 mEq/L per day with hypertonic saline → central pontine myelinolysis, locked-in days later",
        ],
      },
    ],
    pearls:
      "Order: ABCs and glucose → non-contrast CT → no blood + within 4.5 h of last known normal + no contraindication → alteplase, then CTA for a large-vessel occlusion → thrombectomy. Absolute contraindications: any prior intracranial hemorrhage, ischemic stroke or serious head trauma within 3 months, active bleeding, platelets <100k, INR >1.7, DOAC within 48 h, BP that will not fall below 185/110, glucose <50; major surgery within 14 days is relative — a knee replacement 4 months ago is not a contraindication. Hypoglycemia, seizure with Todd paralysis, migraine and conversion are the mimics. After tPA: no antiplatelets or anticoagulants for 24 h, BP <180/105, repeat CT for any decline (angioedema and bleeding are the complications). Hemorrhagic stroke: no platelets for antiplatelet users (harmful), keep the head up, treat fever and glucose, no prophylactic anticonvulsants. Hypernatremia corrected too fast causes cerebral edema — the mirror-image trap of CPM. Malignant MCA infarct in a patient under 60 → decompressive hemicraniectomy within 48 h.",
    reviewed: REVIEWED,
  },
  // ────────────────────────────── PREVENTION ──────────────────────────────
  {
    id: "stroke-etiology-workup",
    domain: "stroke",
    name: "Stroke etiology & prevention",
    org: PREVENTION,
    prompt: `Two TIAs the same afternoon: a 58M with BP 152/94 who lost vision in his right eye for 5 minutes, and an 82F with BP 112/70 in sinus rhythm on ECG who had 20 minutes of expressive aphasia.\n\nList the embolic-source workup and who gets which test first, the carotid management thresholds, the vertebrobasilar causes of dizziness, and the risk factors with the secondary prevention each demands.`,
    keyPoints: [
      {
        group: "Embolic source workup",
        items: [
          "Carotid duplex ultrasound — 50s–60s with hypertension, or a carotid bruit: TIA/stroke/retinal artery occlusion from a carotid plaque",
          "ECG — >75 with normal BP: atrial fibrillation with a left atrial mural thrombus; 8% of people over 80 have AF",
          "Holter monitor / event monitor — normal ECG in the elderly normotensive patient: AF is paroxysmal, so 24–48 h Holter, then 30-day monitor or loop recorder",
          "Echocardiogram / TTE — cardioembolic source: LA or LV thrombus after MI, valve vegetation, myxoma; bubble study for PFO in cryptogenic stroke under 60",
        ],
      },
      {
        group: "Carotid management",
        items: [
          "Carotid endarterectomy / CEA — symptomatic 70–99% (50–69% case by case), ideally within 2 weeks of the event; asymptomatic 70–99% in select low-risk patients; not for 100% occlusion",
          "Statin and antiplatelet / medical management — below the surgical threshold: high-intensity statin plus aspirin, clopidogrel, or aspirin-dipyridamole",
          "Maintain current regimen — asymptomatic low-grade stenosis (10–30%) with a bruit already on aspirin + statin: no procedure, no extra drug",
        ],
      },
      {
        group: "Vertebrobasilar",
        items: [
          "Subclavian steal — dizziness or syncope with arm exercise; BP differs between the arms; retrograde vertebral flow past a proximal subclavian stenosis; CTA/MRA",
          "Check BP in the other arm — dizziness with a pressure recorded in one arm only: measure the other arm first (subclavian steal, aortic dissection)",
          "Vertebral artery stenosis — the same unexplained dizziness with EQUAL arm pressures; atherosclerosis; CT or MR angiography diagnoses",
          "Vertebral artery dissection — neck manipulation (chiropractor) or trauma; neck pain then a posterior-circulation stroke; heparin is the NBME answer",
        ],
      },
      {
        group: "Risk factors & prevention",
        items: [
          "Hypertension — the most common stroke risk factor in the population; BP control beats smoking cessation; pounds the carotids into plaque",
          "Atrial fibrillation — the most likely cause when BOTH AF and hypertension are present; LA mural thrombus; anticoagulate by CHA2DS2-VASc",
          "Carotid plaque / atherosclerosis — hypertensive endothelial injury + LDL: artery-to-artery emboli to brain or eye (amaurosis fugax); high-intensity statin; a bruit is a sign, not a symptom",
          "Anticoagulation / DOAC — AF secondary prevention: apixaban etc. over warfarin, started ~2–14 days after the stroke by infarct size; antiplatelets do not suffice for AF",
        ],
      },
    ],
    pearls:
      "The vignette tells you the mechanism through age and blood pressure: 50s–60s + hypertension = carotid plaque → duplex; >75 + normal BP = atrial fibrillation → ECG, and if sinus rhythm, Holter because AF is paroxysmal. Symptomatic means stroke, TIA or retinal artery occlusion in the territory of that carotid — a bruit alone is asymptomatic. The USMLE makes the percentage obvious (90% → endarterectomy; 50% → medical) and will not quibble at 69 vs 70. Endarterectomy is for the SYMPTOMATIC side; the contralateral asymptomatic 40% plaque gets medical therapy. Every stroke leaves on a statin and BP control regardless of mechanism; AF patients leave on a DOAC, not aspirin, and CHA2DS2-VASc is already ≥2 once a stroke has occurred. Blood pressure different between the arms: ¾ of the time aortic dissection, ¼ subclavian steal — the arm-exercise trigger and the dizziness point to steal. Young stroke without risk factors: dissection, PFO, antiphospholipid antibodies, cocaine, OCPs + smoking.",
    reviewed: REVIEWED,
  },
];
