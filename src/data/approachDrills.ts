/**
 * Tier-1 "Approach" drill content keyed by chief-complaint category (One-liner
 * and Mechanisms). Can't-miss and Targeted-exam reuse curriculum
 * cantMiss[]/examFocus[] and need nothing here. Authored + clinically verified.
 */
export interface OneLinerDrill {
  category: string;
  vignette: string;
  idealAnswer: string;
  qualifiers: string[];
}

export interface MechanismDrill {
  category: string;
  topic: string;
  prompt: string;
  mechanisms: string[];
  explanation: string;
}

export const ONE_LINERS: OneLinerDrill[] = [
  {
    "category": "Chest Pain",
    "vignette": "A 64-year-old man with hypertension, type 2 diabetes, and a 30-pack-year smoking history develops crushing substernal chest pressure that began 40 minutes ago while shoveling snow. The pain radiates to his left jaw and is accompanied by diaphoresis and nausea, and it has not eased with rest.",
    "idealAnswer": "An older man with multiple cardiac risk factors presenting with acute-onset exertional substernal pressure-like chest pain radiating to the jaw with associated diaphoresis and nausea, unrelieved by rest.",
    "qualifiers": [
      "Older man (age/sex)",
      "Multiple cardiac risk factors (HTN, diabetes, smoking)",
      "Acute onset (~40 min)",
      "Exertional trigger (onset while shoveling snow)",
      "Substernal pressure-like quality",
      "Radiation to the jaw",
      "Associated diaphoresis and nausea, unrelieved by rest"
    ]
  },
  {
    "category": "Abdominal Pain",
    "vignette": "A 58-year-old woman with gallstones and prior alcohol use presents with 12 hours of severe constant epigastric pain boring through to her back, worse after a fatty meal. She has been vomiting repeatedly and finds the pain eases slightly when she leans forward.",
    "idealAnswer": "A middle-aged woman with gallstones and prior alcohol use presenting with acute severe constant epigastric pain radiating to the back with associated vomiting, relieved by leaning forward.",
    "qualifiers": [
      "Middle-aged woman (age/sex)",
      "Risk factors (gallstones, prior alcohol use)",
      "Acute onset (~12 hours)",
      "Severe constant epigastric location/quality",
      "Radiation to the back (boring through)",
      "Associated repeated vomiting",
      "Positional relief (eases leaning forward)"
    ]
  },
  {
    "category": "Syncope",
    "vignette": "A 72-year-old man with known aortic stenosis and coronary disease has a sudden transient loss of consciousness while climbing a flight of stairs, preceded by chest tightness and brief palpitations. He recovered fully within a minute with no confusion afterward and reports two similar near-faints in the past month.",
    "idealAnswer": "An older man with aortic stenosis and coronary disease presenting with sudden exertional transient loss of consciousness preceded by chest tightness and palpitations with rapid full recovery and recurrent prior episodes, concerning for a cardiac mechanism.",
    "qualifiers": [
      "Older man (age/sex)",
      "Cardiac risk factors/history (aortic stenosis, CAD)",
      "Sudden onset with little or no prodrome",
      "Exertional trigger (during exertion on stairs)",
      "Cardiac warning features (preceding chest tightness/palpitations)",
      "Rapid full recovery without postictal confusion",
      "Recurrent episodes"
    ]
  },
  {
    "category": "Altered Mental Status",
    "vignette": "A 79-year-old woman with dementia and a recent urinary tract infection is brought in by her daughter for two days of fluctuating confusion, inattention, and disorganized thinking that is worse at night. She was recently started on oxybutynin and diphenhydramine for sleep, and she is now drowsy and disoriented to place.",
    "idealAnswer": "An elderly woman with baseline dementia presenting with an acute, fluctuating disturbance of attention and consciousness developing over two days in the setting of a recent infection and newly added anticholinergic medications.",
    "qualifiers": [
      "Elderly woman (age/sex)",
      "Baseline cognitive impairment/dementia (vulnerability factor)",
      "Acute onset (two days)",
      "Fluctuating course, worse at night",
      "Inattention and disorganized thinking (hallmark features)",
      "Identifiable precipitants (recent UTI, anticholinergic meds)",
      "Altered level of consciousness (drowsy, disoriented)"
    ]
  },
  {
    "category": "Dyspnea",
    "vignette": "A 68-year-old woman with prior heart failure and poorly controlled hypertension presents with three days of progressive breathlessness, now occurring at rest. She reports waking at night gasping for air, sleeping on three pillows, and increasing leg swelling, and she admits to stopping her diuretic a week ago.",
    "idealAnswer": "An older woman with a history of heart failure and hypertension presenting with subacute progressive exertional-to-rest dyspnea with orthopnea, paroxysmal nocturnal dyspnea, and worsening lower-extremity edema in the setting of diuretic nonadherence.",
    "qualifiers": [
      "Older woman (age/sex)",
      "Relevant cardiac history/risk (heart failure, hypertension)",
      "Subacute progressive onset (three days, now at rest)",
      "Orthopnea (three-pillow)",
      "Paroxysmal nocturnal dyspnea (waking gasping)",
      "Associated lower-extremity edema",
      "Precipitant (stopped diuretic / nonadherence)"
    ]
  },
  {
    "category": "Fever",
    "vignette": "A 34-year-old man returns from a two-week trip to sub-Saharan Africa and presents with five days of cyclical high fevers with shaking chills, drenching sweats, headache, and myalgias. He took no malaria prophylaxis, and on exam he is jaundiced with mild splenomegaly.",
    "idealAnswer": "A young returned traveler from sub-Saharan Africa with no malaria prophylaxis presenting with several days of cyclical high fevers, rigors, and sweats, with jaundice and splenomegaly on exam.",
    "qualifiers": [
      "Young man (age/sex)",
      "Key exposure/risk (recent travel to sub-Saharan Africa, no prophylaxis)",
      "Subacute onset (five days)",
      "Fever pattern (cyclical/high with rigors and drenching sweats)",
      "Associated constitutional symptoms (headache, myalgias)",
      "Pertinent exam findings (jaundice, splenomegaly)"
    ]
  },
  {
    "category": "Anemia",
    "vignette": "A 67-year-old woman with longstanding NSAID use for osteoarthritis reports two months of progressive fatigue, exertional dyspnea, and lightheadedness. She has noticed intermittent dark, tarry stools, and on exam she appears pale with conjunctival pallor.",
    "idealAnswer": "An older woman with chronic NSAID use presenting with subacute progressive symptomatic anemia (fatigue, exertional dyspnea, lightheadedness) and evidence of gastrointestinal blood loss (melena) with pallor on exam.",
    "qualifiers": [
      "Older woman (age/sex)",
      "Risk factor for blood loss (chronic NSAID use)",
      "Subacute/chronic onset (two months, progressive)",
      "Symptoms of anemia (fatigue, exertional dyspnea, lightheadedness)",
      "Evidence of source/blood loss (melena/dark tarry stools)",
      "Objective finding (pallor / conjunctival pallor)"
    ]
  },
  {
    "category": "Diarrhea",
    "vignette": "A 26-year-old man presents with three days of frequent watery, non-bloody diarrhea, crampy abdominal pain, low-grade fever, and nausea that began two days after a backyard barbecue where several others also became ill. He reports lightheadedness on standing and reduced urine output.",
    "idealAnswer": "A young man with an acute self-limited illness of watery non-bloody diarrhea, crampy abdominal pain, and low-grade fever following a likely common-source food exposure, now with signs of volume depletion.",
    "qualifiers": [
      "Young man (age/sex)",
      "Acute onset (three days)",
      "Stool character (watery, non-bloody, frequent)",
      "Associated symptoms (cramps, low-grade fever, nausea)",
      "Relevant exposure (shared meal / common-source outbreak)",
      "Volume-status concern (orthostatic lightheadedness, reduced urine output)"
    ]
  },
  {
    "category": "Abnormal Liver Enzymes",
    "vignette": "A 45-year-old woman with obesity, type 2 diabetes, and hyperlipidemia is found on routine bloodwork to have mildly elevated aminotransferases with an AST-to-ALT ratio below one. She drinks minimal alcohol, takes no hepatotoxic medications, and has a slightly enlarged, mildly tender liver on exam.",
    "idealAnswer": "A middle-aged woman with metabolic risk factors (obesity, diabetes, dyslipidemia) and minimal alcohol use presenting with an incidental chronic hepatocellular pattern of mildly elevated transaminases (ALT-predominant) with hepatomegaly.",
    "qualifiers": [
      "Middle-aged woman (age/sex)",
      "Metabolic risk factors (obesity, type 2 diabetes, hyperlipidemia)",
      "Chronic/incidental discovery (routine bloodwork)",
      "Hepatocellular pattern (transaminase elevation, AST:ALT < 1 / ALT-predominant)",
      "Mild degree of elevation",
      "Pertinent negatives (minimal alcohol, no hepatotoxic drugs)",
      "Exam finding (hepatomegaly / mildly tender liver)"
    ]
  }
];

export const MECHANISM_DRILLS: MechanismDrill[] = [
  {
    "category": "Chest Pain",
    "topic": "Why does massive (high-risk) pulmonary embolism cause BOTH hypoxemia AND hypotension/obstructive shock?",
    "prompt": "Name 3-4 distinct mechanisms by which a massive PE produces hypoxemia, and how the same clot causes obstructive shock and hemodynamic collapse.",
    "mechanisms": [
      "V/Q mismatch / dead space — perfusion lost to occluded segments while ventilation continues; overperfusion of non-embolized lung",
      "Increased RV afterload from acute pulmonary arterial obstruction + hypoxic vasoconstriction (raised PVR)",
      "Acute RV dilation/failure with interventricular septal bowing into the LV → impaired LV filling and ↓cardiac output (obstructive shock)",
      "Low cardiac output → low mixed-venous SvO2 lowering PaO2; right-to-left shunt via patent foramen ovale",
      "RV ischemia from coronary hypoperfusion of the pressure-overloaded RV → worsening RV failure spiral"
    ],
    "explanation": "Hypoxemia in PE is multifactorial: clot creates dead-space (ventilated but not perfused) while blood is diverted to non-occluded lung causing V/Q mismatch and physiologic shunt; a low cardiac output produces a low mixed-venous SvO2 that further depresses PaO2; and acute RV strain can open a PFO causing true right-to-left shunt. Hemodynamically, sudden obstruction of the pulmonary bed plus hypoxic vasoconstriction raises pulmonary vascular resistance and RV afterload; the thin-walled RV acutely dilates and fails, and septal bowing into the LV reduces LV preload and stroke volume — obstructive shock. The hypotension and pressure-overload then starve the RV coronary supply, causing RV ischemia and a downward spiral. Bottom line: one clot drives two problems — gas-exchange failure (V/Q mismatch + low SvO2 + shunt) and obstructive shock (RV afterload → RV failure → impaired LV filling) — which is why massive PE is a time-critical, thrombolysis-eligible emergency."
  },
  {
    "category": "Abdominal Pain",
    "topic": "Why does severe acute pancreatitis cause hypocalcemia, hypovolemic/distributive shock, and hypoxemia (ARDS)?",
    "prompt": "Name 3-5 mechanisms linking severe acute pancreatitis to its systemic complications: hypocalcemia, third-spacing/shock, and hypoxemic respiratory failure.",
    "mechanisms": [
      "Saponification — lipase liberates free fatty acids that chelate calcium into insoluble soaps in peripancreatic fat → hypocalcemia",
      "Massive third-spacing/fluid sequestration into the inflamed retroperitoneum and gut → intravascular volume depletion and hypovolemic shock",
      "SIRS/cytokine-driven systemic arteriolar vasodilation → ↓SVR (distributive component of shock)",
      "Circulating enzymes/mediators injure the alveolar-capillary membrane → ARDS / non-cardiogenic pulmonary edema (hypoxemia)",
      "Hypoalbuminemia and hypomagnesemia further lower serum (protein-bound and ionized) calcium"
    ],
    "explanation": "In severe pancreatitis, premature intra-acinar enzyme activation spills lipase, proteases, and cytokines systemically. Lipase-generated free fatty acids bind calcium to form insoluble soaps (saponification) in necrotic peripancreatic fat — the dominant cause of hypocalcemia — compounded by hypoalbuminemia and hypomagnesemia. The intense retroperitoneal inflammation plus a SIRS response drives two distinct shock physiologies: increased capillary permeability sequesters liters of fluid into the retroperitoneum and gut (hypovolemic shock from loss of intravascular volume), while cytokine-mediated systemic arteriolar vasodilation drops SVR (a distributive component). The same circulating enzymes/mediators injure the pulmonary alveolar-capillary membrane, producing ARDS-pattern non-cardiogenic pulmonary edema and hypoxemia. Bottom line: aggressive isotonic fluid resuscitation is the cornerstone of early management, and Ranson/BISAP track exactly these systemic insults (Ca, fluid sequestration, PaO2)."
  },
  {
    "category": "Syncope",
    "topic": "Why does severe aortic stenosis cause exertional syncope?",
    "prompt": "Name 3-4 mechanisms by which severe aortic stenosis produces syncope, especially on exertion.",
    "mechanisms": [
      "Fixed valvular obstruction → fixed stroke volume that cannot rise to meet exertional peripheral vasodilation → fall in cerebral perfusion pressure",
      "Abnormal LV baroreceptor/mechanoreceptor reflex on exertion triggers inappropriate peripheral vasodilation ± bradycardia",
      "Exertional arrhythmia — LVH/subendocardial ischemia predispose to VT/VF; calcific extension into conduction system → AV block",
      "Subendocardial ischemia of the hypertrophied, pressure-overloaded LV reduces contractility/output",
      "Loss of atrial kick (atrial fibrillation) worsening the fixed-output state"
    ],
    "explanation": "In critical AS the stenotic valve creates a fixed obstruction so cardiac output cannot augment with demand. On exertion, skeletal-muscle vasodilation drops systemic vascular resistance but the fixed valve prevents a compensatory rise in stroke volume, so mean arterial and cerebral perfusion pressure fall and the patient syncopizes. An abnormal LV mechanoreceptor reflex during exercise can also trigger inappropriate reflex vasodilation/bradycardia. Independently, the hypertrophied LV with subendocardial ischemia is arrhythmogenic (VT/VF), and calcium can extend into the conduction system causing AV block — both producing abrupt syncope. Bottom line: exertional syncope in AS is an ominous symptom signaling severe disease with markedly shortened survival, mandating prompt evaluation for aortic valve replacement."
  },
  {
    "category": "Altered Mental Status",
    "topic": "Why does hepatic encephalopathy cause altered mental status (the role of ammonia and its precipitants)?",
    "prompt": "Name 3-5 mechanisms underlying hepatic encephalopathy — how the failing liver and portosystemic shunting alter brain function, and the common precipitants.",
    "mechanisms": [
      "Failure of hepatic urea-cycle clearance + portosystemic shunting → gut-derived ammonia bypasses the liver and reaches the brain",
      "Astrocyte uptake of ammonia → glutamine accumulation → osmotic astrocyte swelling and low-grade cerebral edema",
      "Neuroinflammation + increased GABAergic/'endogenous benzodiazepine' tone impair neurotransmission (CNS depression)",
      "Precipitants raise ammonia load or impair clearance — GI bleed (protein load), infection/SBP, constipation, hypokalemia/alkalosis, dehydration/diuretics, sedatives, TIPS",
      "Hypokalemia/metabolic alkalosis shift ammonia to the diffusible NH3 form, worsening CNS entry"
    ],
    "explanation": "Hepatic encephalopathy reflects accumulation of gut-derived neurotoxins — chiefly ammonia — that the cirrhotic liver cannot clear and that portosystemic shunts allow to bypass hepatic metabolism. In the brain, astrocytes detoxify ammonia by converting glutamate to glutamine; the osmotically active glutamine causes astrocyte swelling and low-grade cerebral edema, while neuroinflammation and increased GABAergic tone depress neurotransmission. Hypokalemia and metabolic alkalosis (often from diuretics/vomiting) shift ammonia into its diffusible NH3 form, worsening encephalopathy. Classic precipitants — GI bleeding (a large nitrogen load), infection including SBP, constipation, dehydration, sedatives, and electrolyte derangements — should be sought and corrected. Bottom line: treatment targets ammonia (lactulose to trap/excrete it, rifaximin to reduce gut producers) plus reversing the precipitant; the diagnosis is clinical, with ammonia levels only supportive."
  },
  {
    "category": "Dyspnea",
    "topic": "Why does acute decompensated heart failure (cardiogenic pulmonary edema) cause dyspnea and hypoxemia?",
    "prompt": "Name 3-5 mechanisms by which acute decompensated heart failure produces dyspnea, orthopnea, and hypoxemia.",
    "mechanisms": [
      "Elevated LV end-diastolic/left atrial pressure → raised pulmonary capillary hydrostatic pressure → transudation into interstitium and alveoli (pulmonary edema)",
      "Alveolar/interstitial flooding impairs gas diffusion and creates V/Q mismatch and intrapulmonary shunt → hypoxemia",
      "Stiff, low-compliance wet lungs + J-receptor (juxtacapillary) stimulation → ↑work of breathing and tachypnea/air hunger",
      "Orthopnea/PND — recumbency redistributes venous blood centrally, acutely raising preload and pulmonary pressures",
      "Low cardiac output → fatigue, reflex sympathetic activation raising afterload and worsening congestion"
    ],
    "explanation": "In ADHF, a failing or volume-overloaded left ventricle cannot eject adequately, so LVEDP and left atrial pressure rise and back up into the pulmonary veins and capillaries. When pulmonary capillary hydrostatic pressure exceeds plasma oncotic pressure (Starling forces), fluid transudates into the interstitium and then the alveoli. This flooding widens the diffusion barrier and produces V/Q mismatch and shunt (perfused but unventilated flooded alveoli) → hypoxemia; the wet lungs are stiff, raising the work of breathing, and juxtacapillary J-receptors trigger rapid shallow breathing and air hunger. Orthopnea and PND arise because lying flat redistributes venous blood centrally, acutely raising preload and pulmonary pressures. Bottom line: management targets preload/afterload and congestion — IV loop diuretics, vasodilators (e.g., nitroglycerin) for hypertensive flash edema, and noninvasive positive-pressure ventilation, which reduces preload/afterload and recruits alveoli."
  },
  {
    "category": "Fever",
    "topic": "Why does sepsis cause distributive shock (vasodilation and tissue hypoperfusion despite high output)?",
    "prompt": "Name 3-5 mechanisms by which sepsis produces hypotension, tissue hypoperfusion, and lactic acidosis.",
    "mechanisms": [
      "Cytokine release (TNF-α, IL-1, IL-6) induces inducible nitric oxide synthase → NO-mediated systemic vasodilation → ↓SVR (distributive shock)",
      "Endothelial/glycocalyx injury → increased capillary permeability → capillary leak and intravascular hypovolemia",
      "Microcirculatory dysfunction and microthrombi (DIC) impair O2 delivery/extraction → tissue hypoxia and lactic acidosis despite high cardiac output",
      "Sepsis-induced myocardial depression (cytokine-mediated) reduces contractility",
      "Late vasopressin deficiency and relative adrenal insufficiency reduce vascular tone/stress response"
    ],
    "explanation": "In sepsis, pathogen-associated molecular patterns activate innate immunity and release TNF-α, IL-1, and IL-6, which upregulate inducible nitric oxide synthase; the resulting NO causes profound arteriolar vasodilation and a drop in systemic vascular resistance (warm, vasodilatory shock). Cytokines also degrade the endothelial glycocalyx and increase capillary permeability, so fluid leaks out — producing relative and absolute hypovolemia. At the microcirculatory level, maldistribution of flow, endothelial dysfunction, and microthrombi (DIC) impair oxygen delivery and cellular utilization, so even a high cardiac output fails to perfuse tissues, generating lactic acidosis. A late vasopressin deficiency and cytokine-mediated myocardial depression further erode hemodynamics. Bottom line: treatment is timely antibiotics plus source control, IV crystalloid resuscitation, and norepinephrine (first-line vasopressor to restore SVR), with lactate clearance as a resuscitation target."
  },
  {
    "category": "Anemia",
    "topic": "Why does anemia of chronic disease (anemia of inflammation) cause an iron-restricted, hypoproliferative anemia despite adequate iron stores?",
    "prompt": "Name 3-4 mechanisms by which chronic inflammation produces anemia of chronic disease, and how iron studies distinguish it from iron-deficiency anemia.",
    "mechanisms": [
      "IL-6 → hepcidin upregulation → ferroportin degradation → iron trapped in enterocytes/macrophages (functional iron restriction: low serum iron, high ferritin, low transferrin saturation)",
      "Cytokine (TNF-α, IFN-γ, IL-1) suppression of erythropoietin production and blunted marrow EPO response",
      "Direct cytokine inhibition of erythroid progenitor proliferation",
      "Shortened RBC survival from cytokine/macrophage-mediated clearance",
      "Iron-study signature: low iron + LOW TIBC/transferrin + normal-to-HIGH ferritin (vs IDA: low iron, HIGH TIBC, LOW ferritin)"
    ],
    "explanation": "Anemia of chronic disease is an iron-restricted, hypoproliferative anemia driven by inflammation. IL-6 stimulates hepatic hepcidin, which degrades the iron-export channel ferroportin; iron becomes trapped inside enterocytes and macrophages, lowering serum iron and limiting delivery to erythroblasts (functional iron deficiency) — yet storage iron (ferritin) is normal or high. Simultaneously, TNF-α, IFN-γ, and IL-1 blunt erythropoietin production, inhibit erythroid progenitors, and shorten red-cell lifespan. The iron-study signature distinguishes it from true iron deficiency: ACD shows low serum iron with a LOW TIBC/transferrin and normal-or-elevated ferritin, whereas iron-deficiency anemia shows low iron with a HIGH TIBC and LOW ferritin; the soluble transferrin receptor / sTfR-ferritin index helps when both coexist. Bottom line: treat the underlying inflammatory disease — iron supplementation alone is largely ineffective because hepcidin blocks iron utilization."
  },
  {
    "category": "Diarrhea",
    "topic": "Why does cholera (secretory/enterotoxigenic diarrhea) cause profuse watery diarrhea, hypovolemic shock, and a non-anion-gap metabolic acidosis?",
    "prompt": "Name 3-5 mechanisms by which a secretory enterotoxin (e.g., cholera toxin) causes massive watery diarrhea and its metabolic consequences.",
    "mechanisms": [
      "Toxin ADP-ribosylates Gsα → permanently activates adenylate cyclase → sustained ↑intracellular cAMP in enterocytes",
      "↑cAMP opens CFTR → active Cl⁻ (with Na⁺ and water) secretion into the lumen → secretory diarrhea that persists even when fasting (no osmotic gap)",
      "↑cAMP inhibits neutral villous NaCl absorption, compounding net fluid loss",
      "Loss of isotonic, bicarbonate-rich stool → hypovolemic shock and non-anion-gap (hyperchloremic) metabolic acidosis",
      "Stool potassium loss → hypokalemia; severe hypoperfusion adds a lactic (high-gap) acidosis"
    ],
    "explanation": "Secretory toxins like cholera toxin ADP-ribosylate the Gs alpha subunit, locking adenylate cyclase 'on' and driving sustained high intracellular cAMP in enterocytes. cAMP opens the CFTR chloride channel so crypt cells pump chloride (with sodium and water following) into the lumen, while inhibiting villous neutral NaCl absorption — the net result is liters of isotonic, secretory diarrhea that continues even during fasting (no osmotic gap). The torrential loss of isotonic, bicarbonate- and potassium-rich fluid produces hypovolemic shock, hypokalemia, and a normal-anion-gap (hyperchloremic) metabolic acidosis from GI bicarbonate loss; profound hypoperfusion adds a lactic (high-gap) acidosis. Bottom line: management is aggressive rehydration — oral rehydration solution exploits intact glucose-coupled sodium absorption (SGLT1), with IV isotonic fluids for shock — plus potassium replacement."
  },
  {
    "category": "Abnormal Liver Enzymes",
    "topic": "Why does acetaminophen overdose cause a massive hepatocellular transaminase rise (AST/ALT in the thousands) and centrilobular (zone 3) necrosis?",
    "prompt": "Name 3-5 mechanisms in the pathway by which acetaminophen overdose injures hepatocytes, and explain the role of glutathione and N-acetylcysteine.",
    "mechanisms": [
      "At therapeutic doses most drug is conjugated (glucuronidation/sulfation); in overdose these pathways saturate, shunting more drug through CYP2E1",
      "CYP2E1 oxidizes acetaminophen to the toxic reactive metabolite NAPQI",
      "NAPQI is normally detoxified by conjugation with hepatic glutathione, which becomes depleted in overdose",
      "Free NAPQI binds covalently to hepatocyte/mitochondrial proteins → oxidative stress and mitochondrial failure → centrilobular (zone 3, CYP2E1-rich) necrosis → AST/ALT often >1000",
      "N-acetylcysteine replenishes/substitutes for glutathione (supplies cysteine), detoxifying NAPQI — most effective within ~8 hours"
    ],
    "explanation": "At therapeutic doses, most acetaminophen is conjugated by glucuronidation and sulfation, with a small fraction oxidized by CYP2E1 to the reactive electrophile NAPQI, which hepatic glutathione immediately neutralizes. In overdose, the conjugation pathways saturate, so more drug is funneled through CYP2E1 and NAPQI production surges, rapidly depleting glutathione. Once glutathione is exhausted, free NAPQI binds covalently to cellular and mitochondrial proteins, triggering oxidative stress and mitochondrial failure; injury concentrates in centrilobular zone 3 hepatocytes, which are richest in CYP2E1, producing a hepatocellular pattern with transaminases in the thousands (ALT/AST often >1000, far exceeding any ALP rise). N-acetylcysteine works by restoring/substituting for glutathione (supplying cysteine), allowing NAPQI detoxification; it is most effective within ~8 hours of ingestion but still benefits late or established hepatotoxicity. Bottom line: risk-stratify with the timed acetaminophen level on the Rumack-Matthew nomogram and give NAC promptly."
  }
];

export const oneLinerFor = (category: string): OneLinerDrill | undefined =>
  ONE_LINERS.find((o) => o.category === category);
export const mechanismFor = (category: string): MechanismDrill | undefined =>
  MECHANISM_DRILLS.find((m) => m.category === category);
