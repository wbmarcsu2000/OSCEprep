/**
 * Focused physical exam drills.
 *
 * The student is given a presenting complaint and names the focused exam they
 * would perform; the answer key is grouped by exam system and graded by
 * coverage, exactly like the other IM coverage drills.
 *
 * The physical exam was the one part of the OSCE encounter with no drill behind
 * it, even though the app already carries a maneuver catalog for the encounter.
 * `keyPoints[].group` therefore uses the SAME system vocabulary as
 * `EXAM_SYSTEMS` in src/engine/maneuvers.ts (guarded by a test), and item
 * wording follows the maneuver labels there so the keyword grader recognises
 * what students actually type.
 *
 * DENSITY CAP — the answer key is the flat list of keyPoints[].items and
 * coverage is named ÷ total, so an over-long key is unmasterable and its reveal
 * is a wall of text. Keep each drill to <=4 groups, <=4 items per group, ~12-15
 * items, and <=80 characters per item. Depth belongs in `pearls`, which is shown
 * on reveal and never graded. Enforced by src/data/__tests__/examDrills.test.ts.
 *
 * Vignettes carry triage vitals (you know them before walking in), so any Vitals
 * item must go BEYOND what the vignette states — orthostatics, pulsus paradoxus,
 * BP in both arms — rather than handing over a free item.
 *
 * Design: docs/superpowers/specs/2026-07-26-im-exam-drills-design.md
 * Educational use only.
 */

export interface ExamDrillKeyGroup {
  /** An exam system from EXAM_SYSTEMS (src/engine/maneuvers.ts). */
  group: string;
  /** Maneuver + what it is hunting for. <=80 chars each. */
  items: string[];
}

export interface ExamDrill {
  /** exam-<category-slug>-<n>. Stable — this is the progress key. */
  id: string;
  /** One of the nine IM case categories. */
  category: string;
  /** The prompt: age/sex, complaint, duration, context, triage vitals. */
  vignette: string;
  keyPoints: ExamDrillKeyGroup[];
  /** Shown on reveal, never graded. */
  pearls?: string;
}

export const EXAM_DRILLS: ExamDrill[] = [
  {
    "id": "exam-abdominal-pain-1",
    "category": "Abdominal Pain",
    "vignette": "A 19-year-old man presents with 20 hours of pain that began around the umbilicus and has now settled in the right lower quadrant. He has no appetite, vomited once, and has not passed stool today. He plays college soccer and has no medical history. Triage vitals: T 38.1 C, HR 104, BP 118/72, RR 18, SpO2 99% on room air. What focused physical exam do you perform?",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Repeat temperature — fever is often absent early, rising with perforation",
          "Obtain orthostatic vitals — a day of anorexia and vomiting depletes volume",
          "Repeat vitals after analgesia — persistent tachycardia means progression"
        ]
      },
      {
        "group": "General",
        "items": [
          "Assess general appearance — lying still with knees drawn up",
          "Ask him to cough — localized RLQ pain indicates peritoneal irritation",
          "Watch him walk — a slow, bent-over gait suggests peritonitis"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Palpate RLQ at McBurney point — the point of maximal tenderness",
          "Rovsing sign — pressure in the LLQ refers pain to the RLQ",
          "Assess rebound and guarding — involuntary rigidity means perforation",
          "Examine both testes — torsion refers pain to the RLQ in young men"
        ]
      },
      {
        "group": "HEENT",
        "items": [
          "Assess mucous membranes — dry after a day of anorexia and vomiting",
          "Inspect oropharynx — pharyngitis suggests mesenteric adenitis instead"
        ]
      }
    ],
    "pearls": "The position of the appendiceal tip explains which named sign fires: a retrocecal tip gives a psoas sign (pain on passive right hip extension), a pelvic tip gives an obturator sign (pain on passive internal rotation of the flexed right hip), and an anterior tip gives classic McBurney point tenderness with Rovsing sign. Migration of pain from periumbilical (visceral afferents, T10) to the RLQ (parietal peritoneum) is the single most useful history feature. Never skip the genital exam in a young man with lower abdominal pain — testicular torsion presents with abdominal pain in up to a fifth of cases and is lost after six hours. Beware the deceptive interval: pain can briefly ease as a perforated appendix decompresses, then return as diffuse rigidity and a silent abdomen. In any woman of childbearing age, a pregnancy test and pelvic exam precede imaging — ectopic pregnancy and tubo-ovarian abscess are the killers on that differential. Elderly, diabetic, and immunosuppressed patients perforate early with unimpressive findings, so weigh tachycardia and the general appearance more heavily than the abdominal signs."
  },
  {
    "id": "exam-abdominal-pain-2",
    "category": "Abdominal Pain",
    "vignette": "A 43-year-old woman has 8 hours of steady right upper quadrant pain radiating to the right shoulder blade, which began after a fatty meal and has not remitted. She has had three similar but shorter episodes in the past year. She is obese and takes no medications. Triage vitals: T 38.0 C, HR 96, BP 132/80, RR 16, SpO2 98% on room air. What focused physical exam do you perform?",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Repeat temperature — a rising fever suggests empyema or cholangitis",
          "Obtain orthostatic vitals — vomiting and poor intake deplete volume",
          "Repeat vital signs — rising HR with falling BP warns of biliary sepsis"
        ]
      },
      {
        "group": "HEENT",
        "items": [
          "Inspect sclera for icterus — jaundice means a CBD stone or Mirizzi",
          "Assess mucous membranes — dry with vomiting and reduced intake"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Murphy sign — inspiratory arrest on deep RUQ palpation",
          "Palpate RUQ for a tender palpable gallbladder or phlegmon",
          "Assess rebound and guarding — peritonism means gallbladder perforation",
          "Palpate liver edge — tender hepatomegaly in hepatitis or congestion"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Auscultate the right posterior base — RLL pneumonia mimics RUQ pain",
          "Percuss posterior lung fields — dullness of effusion or consolidation",
          "Palpate the right lower chest wall — rib tenderness or early zoster"
        ]
      }
    ],
    "pearls": "Technique matters for Murphy sign: place your fingers under the right costal margin at the mid-clavicular line, ask the patient to take a deep breath, and watch for the breath to stop as the inflamed gallbladder descends onto your hand. It must be negative on the left to count. Sensitivity falls to roughly 50% in patients over 60, who may present only with anorexia and confusion. Boas sign is hyperesthesia below the right scapula. Fever plus jaundice plus RUQ pain is Charcot triad (cholangitis, not simple cholecystitis); add hypotension and confusion for Reynolds pentad and an emergent ERCP. Do not forget the two mimics you can only exclude at the bedside: right lower lobe pneumonia and inferior wall ischemia, which refer pain to the RUQ and epigastrium. Acalculous cholecystitis occurs in the critically ill, on TPN, or after major surgery, where the only sign may be unexplained sepsis. A sonographic Murphy sign — maximal tenderness under the probe over the gallbladder — outperforms the bedside sign."
  },
  {
    "id": "exam-abdominal-pain-3",
    "category": "Abdominal Pain",
    "vignette": "An 80-year-old man arrives 45 minutes after sudden tearing pain in the left flank and lower back, and he felt faint when he stood up. He is a 60 pack-year smoker under surveillance for a 5.4 cm infrarenal abdominal aortic aneurysm. Triage vitals: T 36.6 C, HR 118, BP 92/58, RR 24, SpO2 96% on room air. What focused physical exam do you perform?",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Measure BP in both arms — a difference suggests aortic dissection",
          "Repeat vital signs every 5 minutes — hypotension can be transient",
          "Count the respiratory rate yourself — tachypnea from shock and acidosis"
        ]
      },
      {
        "group": "General",
        "items": [
          "Assess general appearance — restless, gray, diaphoretic, in extremis",
          "Assess mental status — agitation signals cerebral hypoperfusion"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Palpate above the umbilicus for a pulsatile, expansile mass",
          "Palpate for periumbilical and flank tenderness over the aneurysm",
          "Auscultate for an abdominal bruit — absence never excludes AAA",
          "Inspect the flanks for Grey Turner bruising — retroperitoneal blood"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Palpate femoral and pedal pulses — asymmetry or sudden loss",
          "Assess capillary refill — delayed in hemorrhagic shock",
          "Compare leg color and warmth — mottling from distal embolization"
        ]
      }
    ],
    "pearls": "The classic triad of pain, hypotension, and a pulsatile mass is present in fewer than half of ruptured AAAs; up to 30% are first misdiagnosed as renal colic, and CVA tenderness or hematuria does not exclude rupture. Palpation is what you do have: expansile (fingers pushed apart) rather than merely transmitted pulsation is the discriminating feature, but sensitivity collapses in obese patients and for aneurysms under 5 cm. Do not obtain orthostatics on a hypotensive patient — you already have your answer, and standing him up can arrest him. A contained retroperitoneal rupture can look deceptively stable for an hour, so permissive hypotension (systolic around 90) plus immediate vascular surgery beats fluid resuscitation to normal pressure. In an unstable patient with a known aneurysm, bedside ultrasound and the operating room, not CT, are the destination."
  },
  {
    "id": "exam-abdominal-pain-4",
    "category": "Abdominal Pain",
    "vignette": "A 66-year-old man reports 2 days of colicky central abdominal pain with bilious vomiting, no flatus for 24 hours, and progressive distension. He had an open appendectomy at 20 and a right hemicolectomy for colon cancer 4 years ago. Triage vitals: T 37.4 C, HR 108, BP 128/76, RR 20, SpO2 97% on room air. What focused physical exam do you perform?",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Obtain orthostatic vitals — third-spacing and vomiting deplete volume",
          "Repeat temperature — fever with tachycardia suggests strangulation",
          "Count the respiratory rate yourself — splinting from tense distension"
        ]
      },
      {
        "group": "General",
        "items": [
          "Assess general appearance — restless with colic, still with peritonitis",
          "Assess mental status — new confusion in an older man signals sepsis",
          "Note cachexia or temporal wasting — recurrent malignant obstruction"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Inspect abdomen — distension, surgical scars, visible peristalsis",
          "Auscultate bowel sounds — high-pitched tinkling, silent if ischemic",
          "Palpate both groins and the umbilicus for an incarcerated hernia",
          "Assess rebound and guarding — focal peritonism means strangulation"
        ]
      },
      {
        "group": "HEENT",
        "items": [
          "Assess mucous membranes — dry tongue after large-volume vomiting",
          "Inspect conjunctiva for pallor — anemia hints at an obstructing tumor"
        ]
      }
    ],
    "pearls": "Adhesions from prior surgery cause about 60% of small bowel obstruction, so the scars on the abdomen are part of the history — but the commonest missed cause is an incarcerated groin hernia, which is why you palpate both femoral and inguinal orifices in every obstructed patient, including obese women in whom a femoral hernia hides. A rectal exam completes the assessment: an empty collapsed vault supports mechanical obstruction, while a mass, blood, or impacted stool changes the diagnosis. Percussion adds tympany over gas-filled loops, and a succussion splash more than 3 hours after eating indicates retained gastric contents. The findings that push toward the operating room are fever, tachycardia, localized tenderness, and peritonism (strangulation or closed-loop obstruction), or pain grossly out of proportion to a soft abdomen (mesenteric ischemia). A silent abdomen after hours of loud borborygmi is a late and ominous change."
  },
  {
    "id": "exam-abnormal-liver-enzymes-1",
    "category": "Abnormal Liver Enzymes",
    "vignette": "A 61-year-old man is referred with AST 96, ALT 44, platelets 88 K, albumin 2.8 g/dL, and INR 1.4. He describes 6 months of increasing abdominal girth and ankle swelling and drinks a bottle of wine most nights. Triage vitals: T 36.8 C, HR 88, BP 106/64, RR 16, SpO2 97% on room air. What focused physical exam do you perform?",
    "keyPoints": [
      {
        "group": "Skin",
        "items": [
          "Assess for jaundice in natural light — look under the tongue too",
          "Inspect the chest and face for spider nevi — more than 5 is abnormal",
          "Assess for purpura / ecchymoses — coagulopathy and low platelets",
          "Inspect for gynecomastia and loss of body hair — hyperestrogenism"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Assess shifting dullness — needs about 1.5 L before it is detectable",
          "Palpate liver edge — hard nodular edge, often shrunken in cirrhosis",
          "Palpate for splenomegaly — evidence of portal hypertension",
          "Inspect for caput medusae and dilated periumbilical veins"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Inspect palms — palmar erythema and Dupuytren contracture",
          "Inspect nails — leukonychia, Terry nails, and clubbing",
          "Assess peripheral edema — pitting to the thighs with low albumin"
        ]
      },
      {
        "group": "HEENT",
        "items": [
          "Inspect conjunctiva for pallor — bleeding or marrow suppression",
          "Inspect for parotid enlargement — a stigma of chronic alcohol use"
        ]
      }
    ],
    "pearls": "An AST:ALT ratio above 2 with both under 300 is the classic alcohol-related pattern, and the low platelets, low albumin, and prolonged INR here say the problem is chronic and synthetic, not an acute hepatitis. Individual stigmata are weakly sensitive but highly specific when several cluster; the most useful single findings for portal hypertension are splenomegaly, ascites, and dilated abdominal wall veins (flow away from the umbilicus, unlike inferior vena cava obstruction where flow is upward from the groin). Shifting dullness needs roughly 1500 mL, so early ascites is an ultrasound diagnosis; a fluid wave adds little except in tense ascites. A hard irregular liver edge with a bruit raises hepatocellular carcinoma. Any new or worsening ascites deserves a diagnostic paracentesis for cell count, culture, and albumin gradient, and always look for asterixis before you conclude the patient is simply tired."
  },
  {
    "id": "exam-abnormal-liver-enzymes-2",
    "category": "Abnormal Liver Enzymes",
    "vignette": "A 64-year-old woman with known Child-Pugh B cirrhosis is brought in by her daughter after 2 days of daytime sleepiness and muddled speech. She ran out of lactulose a week ago. Labs today: bilirubin 4.2 mg/dL, ALT 68, INR 1.8, ammonia elevated. Triage vitals: T 37.0 C, HR 92, BP 104/62, RR 18, SpO2 96% on room air. What focused physical exam do you perform?",
    "keyPoints": [
      {
        "group": "Neuro",
        "items": [
          "Assess for asterixis — arms out, wrists dorsiflexed, hold 30 seconds",
          "Assess pronator drift — focal weakness points to a bleed, not HE",
          "Assess deep tendon reflexes — brisk early, absent in deep coma",
          "Assess gait if safe — ataxia from encephalopathy, Wernicke, or sedatives"
        ]
      },
      {
        "group": "General",
        "items": [
          "Assess mental status / orientation — grade with West Haven criteria",
          "Assess general appearance — day-night reversal, slow, inattentive",
          "Smell the breath for fetor hepaticus — sweet musty odor"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Palpate all quadrants — tenderness suggests SBP as the precipitant",
          "Assess shifting dullness — ascites needing a diagnostic tap",
          "Rectal exam for melena — an occult GI bleed precipitates HE"
        ]
      },
      {
        "group": "Skin",
        "items": [
          "Assess for jaundice — deepening jaundice signals decompensation",
          "Assess for petechiae and ecchymoses — coagulopathy, low platelets"
        ]
      }
    ],
    "pearls": "Asterixis is a negative myoclonus — a brief loss of postural tone — and it is not specific to liver disease: uremia, CO2 retention, and phenytoin, gabapentin, or lithium toxicity all produce it. It disappears in deep coma, so its absence in a stuporous patient means nothing. Hepatic encephalopathy is a diagnosis of exclusion and, more importantly, always has a precipitant: search for infection (SBP, urine, chest), GI bleeding, constipation, dehydration from diuretics, hypokalemia, sedatives or opioids, and TIPS. A serum ammonia level correlates poorly with grade and should not drive management. Cirrhotic patients fall and are coagulopathic, so any focal deficit, lateralizing sign, or history of a fall means CT head to exclude a subdural hematoma. Check a fingerstick glucose in every drowsy cirrhotic — failing gluconeogenesis causes hypoglycemia. Grade 1 disease is subtle — reversed sleep pattern and impaired attention — and is best unmasked by the number connection test or serial sevens rather than gross orientation questions."
  },
  {
    "id": "exam-abnormal-liver-enzymes-3",
    "category": "Abnormal Liver Enzymes",
    "vignette": "A 39-year-old woman is sent in from urgent care with ALT 620, AST 480, alkaline phosphatase 310, and lipase 1900. Sixteen hours ago she developed sudden severe epigastric pain boring through to her back, with repeated vomiting; an ultrasound last year showed gallstones. Triage vitals: T 37.8 C, HR 116, BP 100/62, RR 24, SpO2 94% on room air. What focused physical exam do you perform?",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Repeat vital signs hourly — persistent tachycardia predicts severe disease",
          "Count the respiratory rate yourself — tachypnea heralds effusion or ARDS",
          "Repeat temperature — fever after the first week suggests infected necrosis"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Palpate the epigastrium — severe tenderness with a deceptively soft belly",
          "Assess guarding / rigidity — a rigid abdomen suggests perforated ulcer",
          "Inspect flanks and umbilicus — Grey Turner and Cullen signs of bleeding",
          "Murphy sign — coexisting cholecystitis with the gallstone cause"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Percuss the left base — dullness of a sympathetic pleural effusion",
          "Auscultate posterior lung fields — basal crackles of atelectasis or ARDS"
        ]
      },
      {
        "group": "HEENT",
        "items": [
          "Inspect sclera for icterus — a retained CBD stone or cholangitis",
          "Assess mucous membranes — dry from vomiting and third-space losses",
          "Chvostek sign — facial twitch of hypocalcemia from fat saponification"
        ]
      }
    ],
    "pearls": "An ALT above 150 IU/L in acute pancreatitis has roughly a 95% positive predictive value for a gallstone etiology — the transaminase spike here is the stone passing through the ampulla, not hepatitis, and it typically falls fast over 48 hours. Persistently rising alkaline phosphatase and bilirubin with fever means a retained duct stone and cholangitis, which needs ERCP within 24 hours; uncomplicated gallstone pancreatitis instead needs cholecystectomy on the same admission. Cullen and Grey Turner signs appear in under 3% of cases, take 24 to 48 hours to develop, and predict severe disease — but their absence proves nothing. Fat saponification causes hypocalcemia, so pair Chvostek with the Trousseau sign (carpal spasm after 3 minutes of cuff inflation). Alcohol-related disease adds parotid enlargement, Dupuytren contracture, and spider nevi; eruptive xanthomas and lipemic serum point to hypertriglyceridemia as the cause."
  },
  {
    "id": "exam-altered-mental-status-1",
    "category": "Altered Mental Status",
    "vignette": "66M found on his bedroom floor by a neighbor, last seen well 18 hours ago. Lives alone; the pill bottles on his nightstand are glipizide, warfarin, and zopiclone. He opens his eyes to voice but cannot say where he is. T 36.4, HR 96, BP 128/74, RR 14, SpO2 95% on room air.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Recheck the temperature rectally — occult hypothermia after a long down time",
          "Count the respiratory rate yourself — shallow breathing suggests sedatives"
        ]
      },
      {
        "group": "Neck",
        "items": [
          "Assess neck stiffness / meningismus — being afebrile does not exclude it",
          "Palpate the cervical spine midline — tenderness after an unwitnessed fall"
        ]
      },
      {
        "group": "Neuro",
        "items": [
          "Assess mental status — test attention formally, not just orientation",
          "Assess pupil size and reactivity — pinpoint in opioids, fixed in herniation",
          "Assess pronator drift and motor strength — a focal deficit means scan now",
          "Assess for asterixis — hepatic, uremic, or CO2 encephalopathy"
        ]
      },
      {
        "group": "Skin",
        "items": [
          "Palpate the scalp for a boggy hematoma — a head strike on warfarin",
          "Inspect for track marks — antecubital fossae, groin, and between the toes",
          "Assess for purpura / ecchymoses — occult trauma in an anticoagulated faller",
          "Palpate dependent muscle for tense swelling or bullae — rhabdomyolysis"
        ]
      }
    ],
    "pearls": "Before you lay a hand on him: a fingerstick glucose. It is a bedside test rather than an exam maneuver, so it is not in the key above, but with glipizide on the nightstand it is the first and most reversible move — and sulfonylurea hypoglycemia recurs for hours after the first ampoule of dextrose. Everything else in the undifferentiated found-down patient is four moves in ninety seconds: pupils, focal deficits, neck stiffness, asterixis. Any one flips the differential and the disposition. In an unwitnessed down time, palpate the flanks, buttocks, and shoulders — tense, tender muscle over a dependent area is compartment syndrome from rhabdomyolysis, and the creatine kinase will not be back for an hour. Anticholinergic toxidrome hides in skin you are already inspecting: dry axillae, flushed skin, and a distended bladder on suprapubic palpation. Do not accept 'baseline dementia' from a caregiver until you have documented attention formally (days of the week backward); acute inattention on top of dementia is delirium, and delirium always has a cause."
  },
  {
    "id": "exam-altered-mental-status-2",
    "category": "Altered Mental Status",
    "vignette": "76F with atrial fibrillation on apixaban, brought in 90 minutes after her daughter heard her speaking fluent gibberish over breakfast. She was independent and lucid last night. T 36.8, HR 88 irregular, BP 168/92, RR 16, SpO2 97% on room air.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Measure BP in both arms — a large difference suggests aortic dissection",
          "Recheck the temperature — fever redirects you to sepsis or meningitis",
          "Repeat vitals for rising BP with bradycardia — Cushing response, raised ICP"
        ]
      },
      {
        "group": "Neck",
        "items": [
          "Auscultate carotids — a bruit suggests a carotid embolic source",
          "Assess neck stiffness / meningismus — subarachnoid blood mimics stroke"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Auscultate the apex while palpating the radial pulse — AF pulse deficit",
          "Auscultate aortic area — a new murmur raises embolic endocarditis",
          "Auscultate with the bell at the apex — mitral stenosis is an embolic source"
        ]
      },
      {
        "group": "Neuro",
        "items": [
          "Assess language: naming, repetition, comprehension — aphasia is not confusion",
          "Assess mental status — inattention that waxes and wanes favors delirium",
          "Assess cranial nerves — forced gaze deviation, facial droop, visual fields",
          "Assess pronator drift and motor strength — unilateral weakness is focal"
        ]
      }
    ],
    "pearls": "Delirium and stroke both produce 'she is not making sense,' and the exam separates them. Delirium is global and waxing: inattention, disorganized thinking, altered arousal, no lateralizing sign. Stroke is abrupt, sustained, and focal. The trap is receptive (Wernicke) aphasia from a left MCA inferior division stroke — fluent but meaningless speech, no weakness, no facial droop — repeatedly booked as 'acute confusion' and missed inside the thrombolysis window. Test comprehension with a one-step command that has no gesture cue ('close your eyes'), not 'squeeze my hand,' which patients follow by mimicry. Right parietal strokes give inattention plus neglect and also look like delirium; test extinction with double simultaneous stimulation. A normal exam does not exclude stroke — posterior circulation events present as isolated vertigo, dysarthria, or confusion. And on apixaban, assume intracranial hemorrhage is equally likely until the CT is back; check the fingerstick glucose too, since hypoglycemia reproduces any focal deficit."
  },
  {
    "id": "exam-altered-mental-status-3",
    "category": "Altered Mental Status",
    "vignette": "27M brought in by paramedics after being found slumped in a stairwell; a friend at the scene said he 'used something' an hour earlier. T 36.2, HR 58, BP 104/62, RR 6 and shallow, SpO2 88% on room air.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Count respirations for a full minute — the triage number misses apneic pauses",
          "Repeat vital signs 30-60 min after naloxone — fentanyl outlasts the antidote"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Listen at the mouth for snoring or gurgling — the tongue is obstructing",
          "Auscultate anterior lung fields — crackles of opioid pulmonary edema",
          "Auscultate posterior lung fields — aspiration after a depressed gag"
        ]
      },
      {
        "group": "Neuro",
        "items": [
          "Assess pupil size — pinpoint, with sedation and hypoventilation, is the triad",
          "Assess level of arousal — response to voice, then to a sternal rub",
          "Assess deep tendon reflexes and clonus — hyperreflexia is serotonin toxicity",
          "Assess motor response for asymmetry — a focal deficit means image the head"
        ]
      },
      {
        "group": "Skin",
        "items": [
          "Inspect for track marks — antecubital fossae, groin, neck, between the toes",
          "Inspect the whole skin for a fentanyl patch — check the back and buttocks",
          "Inspect injection sites for abscess or cellulitis — a source for endocarditis",
          "Palpate dependent limbs for tense swelling or bullae — rhabdomyolysis"
        ]
      }
    ],
    "pearls": "Miosis, respiratory depression, and depressed consciousness are the opioid triad, and only the middle one kills — treat the respiratory rate, not the pupil. Pupils can be normal or dilated with meperidine or tramadol and in mixed overdose with a stimulant or anticholinergic, so a non-miotic pupil does not exclude opioid. Separate the mimics at the bedside: hyperreflexia with lower-limb-predominant inducible clonus and diaphoresis is serotonin toxicity; lead-pipe rigidity with hyperthermia is neuroleptic malignant syndrome; dry, flushed, hyperthermic, mydriatic, and agitated is anticholinergic. After the airway is safe, the two things people forget are a full skin survey for a transdermal patch (peel it off — he keeps absorbing through it) and palpating dependent muscle compartments after a long down time. Naloxone is titrated to respirations, not to consciousness; waking a dependent patient fully buys you vomiting, agitation, and a patient who leaves before the fentanyl outlasts the dose."
  },
  {
    "id": "exam-altered-mental-status-4",
    "category": "Altered Mental Status",
    "vignette": "54F with alcohol-related cirrhosis, brought by her partner for two days of drowsiness and muddled speech. She ran out of her lactulose last week and has been sleeping in the day and awake at night. T 37.1, HR 92, BP 104/66, RR 18, SpO2 96% on room air.",
    "keyPoints": [
      {
        "group": "Neuro",
        "items": [
          "Assess for asterixis — arms out, wrists dorsiflexed, hold for 30 seconds",
          "Assess mental status — grade the encephalopathy and test attention",
          "Assess extraocular movements and gait — nystagmus or ataxia is Wernicke",
          "Assess pronator drift and motor strength — focal signs are not encephalopathy"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Assess shifting dullness — new ascites is the infection you have to exclude",
          "Palpate all quadrants — diffuse tenderness suggests bacterial peritonitis",
          "Perform a digital rectal exam — melena, or a rectum loaded off lactulose",
          "Palpate for splenomegaly — corroborates portal hypertension"
        ]
      },
      {
        "group": "HEENT",
        "items": [
          "Inspect sclera for icterus — the earliest visible site of jaundice",
          "Inspect conjunctiva — pallor suggests a variceal bleed as the precipitant",
          "Assess mucous membranes — fetor hepaticus, and dryness from over-diuresis"
        ]
      },
      {
        "group": "Skin",
        "items": [
          "Inspect the legs for cellulitis — an easily missed infective precipitant",
          "Assess for purpura / ecchymoses — coagulopathy plus a fall means subdural",
          "Inspect skin for spider nevi and caput medusae — chronic liver disease"
        ]
      }
    ],
    "pearls": "Hepatic encephalopathy is a diagnosis of exclusion in a cirrhotic, so the exam is really a hunt for the precipitant: infection (ascites, chest, urine, skin), GI bleeding, constipation, dehydration from over-diuresis, and sedatives. The rectal exam earns its place here — melena you find at the bedside explains everything, and a stool-loaded rectum in a patient off lactulose is the answer more often than students expect. Ammonia levels correlate poorly and should not drive management. Asterixis is not specific to liver failure; it appears in uremia, hypercapnia, and severe heart failure, and it disappears in deep coma, so its absence in an obtunded patient is meaningless. In an alcohol-related cirrhotic, give thiamine before glucose and look hard for Wernicke — ophthalmoplegia, ataxia, and confusion, of which the full triad appears in only about a third. Any focal deficit, seizure, or story of a fall demands imaging: cirrhotics bleed intracranially, and the subdural is easy to write off as 'her usual encephalopathy.'"
  },
  {
    "id": "exam-anemia-1",
    "category": "Anemia",
    "vignette": "34F with four months of breathlessness climbing stairs and very heavy periods since her IUD was changed. Her partner notes she chews a cup of ice every evening. T 36.8, HR 104, BP 110/68, RR 16, SpO2 99% on room air.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Obtain orthostatic vitals — a symptomatic drop suggests brisk ongoing loss",
          "Repeat vital signs after walking her down the corridor — exertional tachycardia"
        ]
      },
      {
        "group": "HEENT",
        "items": [
          "Inspect conjunctiva — a pale lower-lid rim suggests Hb below 9 g/dL",
          "Inspect the tongue and lip corners — atrophic glossitis, angular cheilitis",
          "Assess mucous membranes — pallor of the buccal mucosa and gum margins",
          "Inspect sclera for icterus — pallor plus icterus redirects you to hemolysis"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Inspect nails for koilonychia — flattening and ridging before true spooning",
          "Inspect palms — pale palmar creases appear only at severe anemia",
          "Assess capillary refill and peripheral warmth — anemia alone is not shock"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Auscultate aortic area — a soft flow murmur from a hyperdynamic circulation",
          "Palpate PMI — hyperdynamic but not displaced in a high-output state",
          "Auscultate with the bell — an S3 warns of high-output cardiac failure"
        ]
      }
    ],
    "pearls": "No single sign rules anemia in or out; conjunctival rim pallor is the most useful bedside finding, and pallor of the palmar creases, nail bed, and tongue together perform better than any one alone. All of them only become visible around Hb 7-9 g/dL, so a normal-looking patient can be profoundly anemic. Koilonychia is late and now rare, but the softer nail changes — flattening, longitudinal ridging, brittleness — are common. Pica, and especially pagophagia (ice craving), is close to specific for iron deficiency and resolves within days of starting iron, before the hemoglobin moves. A flow murmur in anemia is soft, systolic, and unaccompanied by a thrill or radiation; anything diastolic, or louder than 3/6, is structural and deserves an echo. Do not stop at 'heavy periods' — quantify them (clots, flooding, doubling up on protection), and in anyone over 40 or with any GI symptom look for a second source, because menorrhagia and a colon cancer happily coexist."
  },
  {
    "id": "exam-anemia-2",
    "category": "Anemia",
    "vignette": "59F with chronic lymphocytic leukemia followed on observation, now with two weeks of worsening fatigue and breathlessness climbing a single flight of stairs. Her daughter says she looks washed out. T 37.2, HR 108, BP 118/70, RR 18, SpO2 98% on room air.",
    "keyPoints": [
      {
        "group": "HEENT",
        "items": [
          "Inspect conjunctiva — a pale lower-lid rim indicates significant anemia",
          "Inspect sclera for icterus — unconjugated bilirubin from red cell breakdown",
          "Inspect oropharynx for petechiae — coexisting immune thrombocytopenia"
        ]
      },
      {
        "group": "Neck",
        "items": [
          "Palpate lymph nodes — rubbery, non-tender, symmetric chains in CLL",
          "Palpate for a dominant hard fixed node — Richter transformation"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Percuss Traube space — dullness precedes a palpable splenic edge",
          "Palpate for splenomegaly — start in the RLQ, then roll her right lateral",
          "Palpate liver edge — hepatomegaly with lymphoproliferative disease",
          "Palpate all quadrants — LUQ pain suggests splenic infarct or capsular stretch"
        ]
      },
      {
        "group": "Skin",
        "items": [
          "Assess for jaundice — mild and lemon-tinged in hemolysis, not deep",
          "Assess for purpura / ecchymoses — Evans syndrome pairs AIHA with ITP",
          "Inspect fingers, nose, and ears for acrocyanosis — cold agglutinins"
        ]
      }
    ],
    "pearls": "Pallor plus jaundice plus splenomegaly is the hemolysis triad, and it is far more informative than any one of the three: the patient looks simultaneously pale and slightly yellow. The jaundice is unconjugated and mild — a lemon tint, best seen in the sclera under natural light — because the liver keeps up until hemolysis is brisk. Autoimmune hemolytic anemia complicates CLL in about 5-10% of patients and can appear at any stage, including untreated disease. Warm AIHA gives splenomegaly; cold agglutinin disease instead gives acrocyanosis and livedo that worsen in a cold room, so warm your hands and the room before deciding she has Raynaud phenomenon. A spleen is only palpable at roughly double normal size, so percuss Traube space and the Castell point before concluding the spleen is normal. And in any CLL patient who changes rapidly, hunt for a single dominant, hard, rapidly growing node with B symptoms — Richter transformation to a high-grade lymphoma, which is biopsied, not observed."
  },
  {
    "id": "exam-anemia-3",
    "category": "Anemia",
    "vignette": "72M referred after routine bloods before a hernia repair showed Hb 7.6 g/dL with a ferritin of 8 ng/mL. He feels well apart from three months of tiredness, denies black or bloody stools, and says his belt is two notches tighter. T 36.6, HR 96, BP 132/78, RR 16, SpO2 97% on room air.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Obtain orthostatic vitals — a symptomatic drop suggests brisker ongoing loss",
          "Repeat vital signs after ambulating him — unmask exertional tachycardia"
        ]
      },
      {
        "group": "HEENT",
        "items": [
          "Inspect conjunctiva — a pale lower-lid rim tracks with the hemoglobin",
          "Inspect the lips and tongue for telangiectasia — hereditary telangiectasia",
          "Inspect sclera for icterus — its presence argues against pure iron deficiency"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Perform a digital rectal exam — melena on the glove or a low rectal mass",
          "Palpate all quadrants for a mass — right-sided colon cancers grow silently",
          "Palpate liver edge — a hard, nodular liver suggests metastatic disease",
          "Inspect abdomen — distension, old surgical scars, an umbilical nodule"
        ]
      },
      {
        "group": "Neck",
        "items": [
          "Palpate the left supraclavicular node (Virchow) — GI malignancy",
          "Palpate the cervical chains — lymphoma as an alternative cause",
          "Assess JVP — if elevated at this hemoglobin, transfuse slowly"
        ]
      }
    ],
    "pearls": "Iron deficiency anemia in a man of any age, or in a postmenopausal woman, is occult GI blood loss until endoscopy proves otherwise — the absence of melena means nothing, because 10 mL of blood a day will do this while it takes 100-200 mL to blacken the stool. Right-sided colon cancers are the classic culprit: the stool is still liquid there, so blood mixes in invisibly and the tumour grows large before it obstructs. Fecal occult blood testing is a screening test, not a diagnostic one; a negative result in unexplained iron deficiency does not cancel the colonoscopy. Do the rectal exam yourself and look at the glove — you are hunting a low rectal mass as much as blood. Weight loss with iron deficiency raises malignancy sharply, but also consider celiac disease, found in a few percent of unexplained iron deficiency. In an elderly patient with chronic severe anemia the circulation has adapted and the plasma volume is expanded, so transfuse one unit at a time and reassess: brisk transfusion is how you turn a compensated Hb of 7.6 into pulmonary edema."
  },
  {
    "id": "exam-chest-pain-1",
    "category": "Chest Pain",
    "vignette": "55M with type 2 diabetes, hypertension, and a 30 pack-year smoking history has 40 minutes of substernal chest pressure radiating to the left jaw, with nausea and diaphoresis. It began while shovelling snow and has not eased with rest. Triage vitals: T 36.8C, HR 96, BP 148/88, RR 18, SpO2 96% on room air.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Check BP in both arms — a >20 mmHg difference suggests dissection",
          "Repeat BP and HR serially — a falling BP signals cardiogenic shock",
          "Count a manual respiratory rate — tachypnea flags pulmonary edema"
        ]
      },
      {
        "group": "Neck",
        "items": [
          "Assess JVP — elevated with clear lungs suggests right ventricular infarct",
          "Auscultate carotids — a bruit marks diffuse atherosclerotic disease"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Palpate PMI — a sustained or displaced apex suggests LV dysfunction",
          "Auscultate the apex for a new mitral regurgitation murmur",
          "Auscultate with the bell for S3 or S4 — S3 marks acute LV failure",
          "Auscultate the aortic area — a diastolic murmur suggests dissection"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Auscultate posterior lung fields for crackles — sets the Killip class",
          "Palpate the chest wall — reproducible tenderness lowers, not excludes, ACS",
          "Auscultate anterior lung fields — wheeze may be cardiac asthma"
        ]
      }
    ],
    "pearls": "The exam does not diagnose ACS — the ECG and troponin do. You examine to find the complications that change management in the next ten minutes and to catch the mimics. Killip class from the lung exam still predicts mortality: class I (clear) ~5%, class III (frank pulmonary edema) ~30-40%. Diaphoresis and an S3 are among the few findings with a meaningful positive likelihood ratio; reproducible chest wall tenderness has an LR around 0.3 — helpful but never a discharge criterion, since roughly 5-7% of confirmed MIs have some reproducible tenderness. Before anyone reaches for nitroglycerin, look at the JVP: elevated JVP with clear lungs and hypotension is the RV-infarct triad, and nitrates can drop that patient's pressure precipitously — so recheck the BP and HR after any nitrate is given. A new holosystolic murmur days after an MI means papillary muscle rupture or VSD until proven otherwise."
  },
  {
    "id": "exam-chest-pain-2",
    "category": "Chest Pain",
    "vignette": "68F with long-standing hypertension and CKD describes sudden ripping pain between her shoulder blades that was maximal at the moment it started 90 minutes ago and has not let up. She ran out of her amlodipine two weeks ago. Triage vitals: T 36.9C, HR 104, BP 196/104 (right arm), RR 22, SpO2 97% on room air.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Measure BP in both arms — a >20 mmHg differential suggests dissection",
          "Repeat vitals serially — a falling BP signals rupture or tamponade",
          "Measure pulsus paradoxus — >10 mmHg suggests hemopericardium"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Auscultate the aortic area for a diastolic decrescendo murmur — acute AI",
          "Listen for muffled heart sounds — hemopericardium with tamponade",
          "Palpate PMI — a normal-sized apex with a new AI murmur means acute AI"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Palpate radial, femoral, and pedal pulses — a deficit is highly specific",
          "Compare pulse volume side to side — asymmetry means branch occlusion",
          "Assess capillary refill and limb temperature — limb malperfusion"
        ]
      },
      {
        "group": "Neuro",
        "items": [
          "Assess motor strength in all four limbs — paraplegia from spinal ischemia",
          "Assess cranial nerves and pronator drift — carotid dissection and stroke",
          "Assess sensation in the legs — a level suggests anterior cord syndrome"
        ]
      }
    ],
    "pearls": "No single finding rules dissection in or out. A pulse deficit is highly specific (LR ~5) but present in only about 30% of cases; an interarm BP difference >20 mmHg is present in roughly 40%. Their absence changes very little when the story is sudden, maximal-at-onset, tearing pain — the history carries far more weight here than any manoeuvre. Always treat to the HIGHER arm pressure, since the lower arm may be fed through a compressed subclavian, and compare an arm with a leg if you suspect distal extension. Complications map to the branch involved: coronary ostium (inferior MI pattern), aortic valve (acute AI, hypotension with a normal-sized heart), pericardium (tamponade), spinal arteries (paraplegia), carotid (stroke), renal or mesenteric (pain out of proportion, anuria). Rate control comes before vasodilation — nitroprusside alone raises dP/dt and can extend the flap, and the BP must be rechecked continuously during titration."
  },
  {
    "id": "exam-chest-pain-3",
    "category": "Chest Pain",
    "vignette": "44F with systemic lupus erythematosus has had 5 days of sharp left-sided chest pain, worse lying flat and relieved by sitting forward. Today she feels breathless and lightheaded when she stands. Triage vitals: T 37.6C, HR 118, BP 96/74, RR 24, SpO2 95% on room air.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Measure pulsus paradoxus with a manual cuff — >10 mmHg suggests tamponade",
          "Count a manual respiratory rate — tachypnea tracks with effusion size"
        ]
      },
      {
        "group": "Neck",
        "items": [
          "Assess JVP — elevated with a blunted y descent suggests tamponade",
          "Look for Kussmaul sign — its presence favours constriction over tamponade"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Auscultate the left sternal border for a rub, patient leaning forward",
          "Listen for muffled heart sounds — Beck triad with JVD and hypotension",
          "Palpate PMI — an impalpable apex suggests a large pericardial effusion",
          "Auscultate through a breath-hold — a pericardial rub persists, pleural stops"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Auscultate lung fields — clear lungs with a high JVP favours tamponade",
          "Percuss the left base — dullness is the Ewart sign of a large effusion",
          "Assess tactile fremitus at the left base — reduced with pleural effusion",
          "Palpate the chest wall — costochondritis mimics pleuritic pain"
        ]
      }
    ],
    "pearls": "Pericarditis is diagnosed on two of four: pleuritic positional pain, a friction rub, widespread ST elevation with PR depression, and a new effusion. The rub is highly specific but evanescent — listen more than once, with the diaphragm at the left lower sternal border, patient leaning forward at end-expiration. Its classic triphasic quality (atrial systole, ventricular systole, early diastolic filling) is heard in under half of cases. Effusion size does not equal tamponade: a rapidly accumulating 200 mL can tamponade while a chronic litre may not. Pulsus paradoxus >10 mmHg has an LR around 3.3 for tamponade and above 5.9 when >12 mmHg; measure it by dropping the cuff slowly and noting the gap between the first intermittent Korotkoff sounds and the point they become continuous. Beware false negatives with coexisting severe AI, ASD, or elevated LVEDP. Tamponade is preload dependent, so watch the BP response to a fluid bolus while you arrange echo. In lupus, serositis is common — but so is PE, which is why the calves and the oxygen requirement still matter."
  },
  {
    "id": "exam-diarrhea-1",
    "category": "Diarrhea",
    "vignette": "A 26-year-old man has 4 days of profuse watery diarrhea and vomiting that began 2 days after returning from a month in Southeast Asia. He is now passing 10 to 12 stools a day, has not urinated since morning, and feels lightheaded when he stands. Triage vitals: T 37.2 C, HR 112, BP 104/64, RR 18, SpO2 99% on room air. What focused physical exam do you perform?",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Obtain orthostatic vitals — >20 mmHg drop or >30 bpm rise is depletion",
          "Repeat vital signs after a fluid bolus — response confirms hypovolemia",
          "Count the respiratory rate yourself — Kussmaul breathing with acidosis",
          "Repeat temperature — high fever suggests invasive or febrile illness"
        ]
      },
      {
        "group": "HEENT",
        "items": [
          "Assess mucous membranes — dry tacky tongue with no saliva pooling",
          "Inspect the eyes — sunken globes and absent tears in severe loss"
        ]
      },
      {
        "group": "Skin",
        "items": [
          "Assess skin turgor — tenting over the sternum or forearm",
          "Check the axilla for absent sweat — a useful dehydration sign",
          "Inspect skin — cool mottled peripheries mean poor perfusion"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Auscultate bowel sounds — hyperactive in secretory diarrhea",
          "Palpate all quadrants — focal tenderness suggests colitis, not viral",
          "Palpate for splenomegaly — malaria or enteric fever in a traveler"
        ]
      }
    ],
    "pearls": "No single bedside sign is sensitive for dehydration; the combination of dry axilla, dry mucous membranes, sunken eyes, and postural change performs best, and a documented weight drop from a recent clinic weight beats all of them. Skin turgor is unreliable in the elderly (loses elasticity anyway) and in obese or edematous patients. Postural symptoms are more informative than the numbers — a patient who cannot stand without near-syncope is volume depleted regardless of the reading. In a returning traveler, fever with diarrhea means malaria until a thick and thin smear says otherwise, and rose spots on the trunk with relative bradycardia suggest enteric fever. Rice-water stool with painless massive volume loss is cholera. Ask about blood and tenesmus: inflammatory diarrhea shifts the differential toward Shigella, Campylobacter, amebiasis, and inflammatory bowel disease."
  },
  {
    "id": "exam-diarrhea-2",
    "category": "Diarrhea",
    "vignette": "A 58-year-old man is on day 9 of IV antibiotics for pneumonia. He had 15 watery stools a day for the past 3 days, but they abruptly stopped this morning and his abdomen has become distended and painful. Triage vitals: T 38.7 C, HR 124, BP 96/58, RR 26, SpO2 95% on room air. What focused physical exam do you perform?",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Repeat vital signs hourly — a rising heart rate tracks deterioration",
          "Count the respiratory rate yourself — acidosis and diaphragmatic splinting",
          "Repeat temperature — hypothermia is as ominous as fever in sepsis"
        ]
      },
      {
        "group": "General",
        "items": [
          "Assess general appearance — toxic, unwell, unwilling to move",
          "Assess mental status / orientation — encephalopathy marks severe sepsis"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Inspect abdomen — tense distension; mark and measure girth at the umbilicus",
          "Auscultate bowel sounds — a silent abdomen means colonic paralysis",
          "Percuss abdomen — loss of hepatic dullness suggests free air",
          "Assess rebound and guarding — peritonism means perforation, call surgery"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Assess capillary refill and peripheral warmth — septic shock",
          "Palpate peripheral pulses — bounding in warm vasodilated sepsis",
          "Assess peripheral edema — hypoalbuminemia marks severe colitis"
        ]
      }
    ],
    "pearls": "Diarrhea that abruptly stops in a patient with colitis is not improvement — it is the colon failing to contract, and it is the classic prelude to toxic megacolon. The diagnosis requires radiographic transverse colon dilatation over 6 cm plus systemic toxicity (fever, tachycardia, leukocytosis, anemia, or hypotension). Serial exam is the monitoring tool: mark and measure abdominal girth, chart bowel sounds, and repeat abdominal films daily. Opiates, anticholinergics, and loperamide precipitate it and must be stopped; corticosteroids blunt peritoneal signs so a soft abdomen is falsely reassuring in a patient on steroids. Fulminant C. difficile can present with ileus and minimal diarrhea, meaning stool testing may be impossible — a low threshold for CT and empiric oral vancomycin plus IV metronidazole is correct. Involve surgery early; colectomy for perforation performed late carries very high mortality."
  },
  {
    "id": "exam-diarrhea-3",
    "category": "Diarrhea",
    "vignette": "A 21-year-old man reports 3 months of bloody diarrhea 6 times a day with urgency and night-time stools, plus 15 pounds of weight loss. Over the last week his left eye has become red and painful and both knees ache and are swollen. Triage vitals: T 37.6 C, HR 96, BP 112/70, RR 16, SpO2 99% on room air. What focused physical exam do you perform?",
    "keyPoints": [
      {
        "group": "HEENT",
        "items": [
          "Inspect the eye for episcleritis or uveitis — redness, photophobia",
          "Inspect oropharynx for aphthous ulcers — common in Crohn disease",
          "Inspect conjunctiva for pallor — iron loss from chronic bleeding"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Palpate all quadrants — tenderness along the colon in active colitis",
          "Palpate RLQ for a tender mass — terminal ileal Crohn disease",
          "Inspect and percuss for distension — screens for toxic megacolon",
          "Inspect the perianal area for fistulae, skin tags, and abscess"
        ]
      },
      {
        "group": "Skin",
        "items": [
          "Inspect the shins for erythema nodosum — tender red nodules",
          "Inspect for pyoderma gangrenosum — ulcer with a violaceous edge",
          "Assess for jaundice — primary sclerosing cholangitis with colitis"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Inspect and palpate joints for swelling and warmth — enteropathic arthritis",
          "Assess lumbar and sacroiliac movement — axial spondyloarthritis",
          "Inspect nails for clubbing — seen in Crohn disease"
        ]
      }
    ],
    "pearls": "Split the extraintestinal manifestations into those that track disease activity and those that do not. Parallel activity: peripheral (type 1, pauciarticular, large-joint) arthritis, erythema nodosum, episcleritis, aphthous stomatitis — treat the bowel and they settle. Independent of activity: axial arthritis and sacroiliitis, uveitis, pyoderma gangrenosum, and primary sclerosing cholangitis, which is strongly associated with ulcerative colitis and needs its own surveillance for cholangiocarcinoma and colorectal cancer. Distinguish episcleritis (uncomfortable, no visual change, blanches with phenylephrine) from uveitis (painful, photophobic, blurred vision) — uveitis is a same-day ophthalmology referral to prevent visual loss. Perianal disease (fistula, tag, abscess) is close to pathognomonic for Crohn rather than UC. In any severe flare, apply the Truelove and Witts criteria (stool frequency, blood, fever, tachycardia, anemia, ESR) and screen for toxic megacolon with tachycardia, fever, and abdominal distension."
  },
  {
    "id": "exam-dyspnea-1",
    "category": "Dyspnea",
    "vignette": "47F is postoperative day 10 from a right total knee replacement and becomes suddenly breathless with right-sided pleuritic pain while walking to the bathroom. She stopped her prophylactic enoxaparin on day 7 because of bruising. Triage vitals: T 37.4C, HR 118, BP 108/70, RR 26, SpO2 89% on room air.",
    "keyPoints": [
      {
        "group": "Neck",
        "items": [
          "Assess JVP — elevation signals acute right ventricular strain",
          "Palpate the trachea — deviation would point to pneumothorax instead"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Palpate for a left parasternal heave — RV pressure overload",
          "Auscultate the pulmonic area for a loud P2 — acute pulmonary hypertension",
          "Listen for a tricuspid regurgitation murmur louder on inspiration",
          "Auscultate with the bell for a right-sided S3 — a failing right ventricle"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Auscultate both lung fields — clear lungs with hypoxia is classic for PE",
          "Percuss both hemithoraces — hyperresonance would suggest pneumothorax",
          "Listen for a pleural rub over the painful area — pulmonary infarction",
          "Palpate the chest wall — reproducible tenderness suggests another cause"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Compare calf circumference — >3 cm asymmetry supports DVT",
          "Palpate the calf for tenderness, warmth, and unilateral pitting edema",
          "Assess capillary refill and peripheral pulses — hypoperfusion in massive PE"
        ]
      }
    ],
    "pearls": "The classic teaching that PE gives a normal chest exam is the point of examining: unexplained hypoxia and tachypnea with clear lungs, a normal percussion note, and no wheeze is the pattern. Tachypnea and tachycardia are the two most common signs; a manual respiratory rate counted over a full minute is worth more than the monitor's number. Hunt for right heart strain, because it is what separates submassive from low-risk PE and drives the decision about thrombolysis: raised JVP, parasternal heave, loud P2, TR murmur, right-sided S3. Sustained hypotension (SBP <90 for 15 minutes) or the need for pressors defines massive PE. Only about half of patients with PE have clinical signs of DVT, so a normal leg exam is not reassurance. Pleuritic pain and haemoptysis suggest a peripheral infarct — often a smaller clot, but the pain brings them in earlier."
  },
  {
    "id": "exam-dyspnea-2",
    "category": "Dyspnea",
    "vignette": "63M with severe COPD (FEV1 35% predicted, on home oxygen) develops abrupt right-sided pleuritic chest pain and worsening breathlessness during a coughing fit at home. Triage vitals: T 36.7C, HR 122, BP 104/68, RR 30, SpO2 86% on his usual 2 L nasal cannula.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Repeat BP and HR after every intervention — a falling BP means tension",
          "Count a manual respiratory rate — a falling rate signals fatigue",
          "Measure pulsus paradoxus — exaggerated in tension and severe air trapping"
        ]
      },
      {
        "group": "Neck",
        "items": [
          "Palpate the trachea — deviation away from the affected side means tension",
          "Assess JVP — distended neck veins with hypotension suggest tension"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Auscultate both lung fields — unilateral absent breath sounds on the right",
          "Percuss both hemithoraces — hyperresonance over the pneumothorax",
          "Assess tactile fremitus — reduced or absent over a pneumothorax",
          "Palpate the chest wall and neck for subcutaneous crepitus"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Palpate PMI — displaced away from the side of a tension pneumothorax",
          "Auscultate the heart — distant sounds with mediastinal shift",
          "Listen for a Hamman crunch — crunching systolic sound of mediastinal air"
        ]
      }
    ],
    "pearls": "A secondary spontaneous pneumothorax in end-stage COPD is far more dangerous than a primary one in a tall young smoker — there is no reserve, so a small volume produces severe symptoms and the mortality is an order of magnitude higher. The physical signs are also harder: hyperresonance and quiet breath sounds are the baseline in emphysema, so compare sides rather than judging in absolute terms, and treat asymmetry as the finding. Tension pneumothorax is a clinical diagnosis — hypotension, distended neck veins, tracheal deviation, and a silent hemithorax mean needle decompression before any imaging. Tracheal deviation is late and often absent; do not wait for it. Watch the response to oxygen too: hypoxia that will not correct points to shunt physiology rather than simple V/Q mismatch, but titrate to a target of 88-92% in a known retainer. Also on the differential here: PE (COPD triples the risk), pneumonia, and simple exacerbation. Bullous emphysema can mimic a pneumothorax on film, which is why a chest tube in the wrong place is a real hazard in exactly this patient."
  },
  {
    "id": "exam-dyspnea-3",
    "category": "Dyspnea",
    "vignette": "79F with a prior anterior MI and an ejection fraction of 30% reports three weeks of worsening breathlessness. She now sleeps on four pillows, has woken twice gasping at night, and her ankles are swollen. Triage vitals: T 36.6C, HR 92 and irregular, BP 152/86, RR 22, SpO2 92% on room air.",
    "keyPoints": [
      {
        "group": "Neck",
        "items": [
          "Assess JVP at 45 degrees — >3 cm above the sternal angle is elevated",
          "Test hepatojugular reflux — a sustained rise supports right heart failure"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Auscultate with the bell at the apex for an S3 — most specific sign of HF",
          "Palpate PMI — a displaced, sustained apex indicates LV dilatation",
          "Auscultate the apex for a mitral regurgitation murmur — functional MR",
          "Compare apical and radial rates — a pulse deficit indicates AF"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Auscultate posterior fields for bibasilar crackles that do not clear",
          "Percuss the bases for dullness — pleural effusions, often right-sided",
          "Auscultate anterior fields for wheeze — cardiac asthma mimics COPD"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Assess pitting edema and how high it reaches — sacral if she is bedbound",
          "Assess capillary refill and limb temperature — cool limbs in low output",
          "Palpate the radial pulse for pulsus alternans — severe LV dysfunction"
        ]
      }
    ],
    "pearls": "Think in two axes: congestion (wet vs dry) and perfusion (warm vs cold). Wet-and-cold is the group that does badly with diuresis alone. JVP and an S3 are the two findings that matter most — an S3 carries an LR near 11 for elevated filling pressures and independently predicts hospitalisation and death; crackles are far less reliable, absent in up to 80% of chronic HF patients whose lymphatics have adapted, and present in plenty of people with pneumonia or fibrosis. Reduced fremitus and stony dullness at a base mean an effusion rather than interstitial oedema. Orthopnea is sensitive, PND more specific. Edema is neither sensitive nor specific in an elderly patient — venous insufficiency, calcium channel blockers, and low albumin all produce it. Pulsus alternans, when present, is nearly pathognomonic of severe LV dysfunction. New AF is both a common trigger of decompensation and a common result of it."
  },
  {
    "id": "exam-dyspnea-4",
    "category": "Dyspnea",
    "vignette": "76M with both COPD (40 pack-years, two exacerbations last year) and HFrEF presents with four days of worsening breathlessness, increased sputum volume, and a productive cough. He is not sure whether he has been taking his furosemide. Triage vitals: T 37.8C, HR 108, BP 132/78, RR 26, SpO2 88% on room air.",
    "keyPoints": [
      {
        "group": "Neck",
        "items": [
          "Assess JVP — elevation favours heart failure over a COPD exacerbation",
          "Test hepatojugular reflux — supports overload when the JVP is equivocal"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Inspect work of breathing — accessory muscles, pursed lips, tripod posture",
          "Percuss posterior fields — hyperresonance in COPD, dullness if consolidated",
          "Assess egophony and tactile fremitus — focal increase means consolidation",
          "Auscultate posterior fields — focal crackles favour pneumonia over wheeze"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Auscultate with the bell for an S3 — points to decompensated heart failure",
          "Palpate PMI — displaced in HF, often impalpable with hyperinflation",
          "Palpate for a parasternal heave — cor pulmonale from chronic hypoxia"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Assess pitting edema — bilateral edema fits HF but also cor pulmonale",
          "Inspect nails for clubbing and tar staining — COPD alone does not club",
          "Assess capillary refill and warmth — warm and well perfused vs low output"
        ]
      }
    ],
    "pearls": "These three coexist more often than they compete, and the exam's job is to say which are active tonight. Pattern for HF: raised JVP, positive hepatojugular reflux, S3, symmetrical bibasilar crackles, dependent edema, orthopnea. For COPD exacerbation: increased dyspnea plus sputum volume plus sputum purulence (the Anthonisen criteria), accessory muscle use, prolonged expiration, diffuse wheeze, hyperresonance, and a barrel chest — plus asterixis if CO2 is retained, which is worth checking and is a hypercapnia sign, not a liver sign, in this setting. For pneumonia: fever, focal crackles, bronchial breath sounds, egophony, increased fremitus, and focal dullness — the localising findings are what separate it. Clubbing is never explained by COPD; it should send you looking for bronchiectasis, fibrosis, or lung cancer. Wheeze does not settle the question — cardiac asthma wheezes too."
  },
  {
    "id": "exam-fever-1",
    "category": "Fever",
    "vignette": "74F with three weeks of low-grade fevers, malaise, and shoulder-girdle stiffness worst in the morning, now with a new right-sided headache and scalp soreness when she brushes her hair. Chewing toast makes her jaw ache. T 37.9, HR 88, BP 148/82, RR 16, SpO2 98% on room air.",
    "keyPoints": [
      {
        "group": "HEENT",
        "items": [
          "Palpate the temporal arteries — tender, thickened, beaded, or pulseless",
          "Test visual acuity in each eye separately — painless loss is the emergency",
          "Perform fundoscopy — a pale, swollen optic disc is arteritic AION",
          "Inspect the scalp and tongue — ischemic ulceration or necrosis is late GCA"
        ]
      },
      {
        "group": "Neuro",
        "items": [
          "Assess pupils with a swinging flashlight — a relative afferent defect",
          "Assess visual fields to confrontation — an altitudinal defect suggests AION",
          "Assess cranial nerves — diplopia from ischemic ocular motor palsy",
          "Assess proximal motor strength — polymyalgia limits by pain, not weakness"
        ]
      },
      {
        "group": "Neck",
        "items": [
          "Auscultate carotids and subclavians — bruits of large-vessel arteritis",
          "Palpate lymph nodes — significant nodes point away from GCA to lymphoma"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Compare BP and pulses in both arms — asymmetry means subclavian arteritis",
          "Assess shoulder and hip girdle movement — painful restriction of polymyalgia"
        ]
      }
    ],
    "pearls": "New headache plus a low-grade fever in anyone over 50 is giant cell arteritis until disproven, and the reason to hurry is the eye: once vision is lost it does not come back, and the second eye follows within days to weeks if untreated. Do not wait for the ESR or the biopsy — start high-dose glucocorticoids on clinical suspicion (IV methylprednisolone if there is any visual symptom), and biopsy within about two weeks, since the arteritis is still visible for that long on steroids. The findings that move the needle most are jaw claudication (LR about 4) and a beaded or enlarged temporal artery (LR about 4.5); temporal tenderness is weaker, and a completely normal artery exam only halves the odds, so it never rules out. Ask about amaurosis fugax — a transient curtain is the warning shot before permanent arteritic AION. Take a 3-4 cm biopsy segment because skip lesions are common. Roughly a third have large-vessel disease, which is why you compare arm pressures and listen over the subclavians; PMR coexists in up to half."
  },
  {
    "id": "exam-fever-2",
    "category": "Fever",
    "vignette": "62F with 3 weeks of low-grade fever, drenching night sweats, and fatigue, five months after a bioprosthetic aortic valve replacement. Two courses of oral antibiotics from her clinic did nothing. T 38.1, HR 98, BP 118/64, RR 18, SpO2 97% on room air.",
    "keyPoints": [
      {
        "group": "Cardiac",
        "items": [
          "Auscultate aortic area — a new or changed prosthetic valve murmur",
          "Auscultate mitral area / apex — a new regurgitant murmur means destruction",
          "Palpate PMI — hyperdynamic and displaced in acute aortic regurgitation"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Inspect nails for splinter hemorrhages — linear, distal, non-blanching",
          "Inspect palms and soles for Janeway lesions — painless flat red macules",
          "Palpate the finger pulps for Osler nodes — tender, raised, pea-sized",
          "Palpate peripheral pulses — an absent pulse means an embolic occlusion"
        ]
      },
      {
        "group": "HEENT",
        "items": [
          "Inspect conjunctiva — evert the lower lid to find petechiae",
          "Inspect oropharynx and dentition — palatal petechiae, a dental source"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Palpate for splenomegaly — present in about a third of subacute cases",
          "Palpate all quadrants — LUQ tenderness suggests a splenic infarct",
          "Assess CVA tenderness — renal infarction from a septic embolus"
        ]
      }
    ],
    "pearls": "Any fever with a prosthetic valve is endocarditis until blood cultures say otherwise, and prosthetic valve endocarditis within a year of surgery is usually staphylococcal and often perivalvular. Peripheral stigmata are classic and uncommon — splinters, Osler nodes, Janeway lesions, and Roth spots each appear in well under a fifth of modern cases, so absence proves nothing while presence is nearly diagnostic. Osler nodes are Ouchy and on the pulps; Janeway lesions are painless and on the palms and soles. The single most important cardiac finding is a NEW regurgitant murmur, not any murmur — a soft systolic flow murmur is expected with fever and anemia. Then look one step further for the two complications that change management today: heart failure from valve destruction (raised JVP, an S3, bibasal crackles) and embolism, which reaches the brain in 20-40% — so a focal neurological deficit belongs in the same examination. Take three sets of blood cultures from separate sites before antibiotics; the yield collapses after even one oral dose, which is exactly why her outpatient courses matter."
  },
  {
    "id": "exam-fever-3",
    "category": "Fever",
    "vignette": "78M on hospital day 6 after hip fracture repair; the nurse calls you because his temperature is 38.9 and his blood pressure has drifted down. He has a right internal jugular central line, an indwelling urinary catheter, and type 2 diabetes. T 38.9, HR 118, BP 88/52, RR 26, SpO2 93% on 2 L.",
    "keyPoints": [
      {
        "group": "Skin",
        "items": [
          "Inspect the central line exit site — erythema, tenderness, or purulence",
          "Take the dressing down and inspect the wound — erythema, fluctuance, pus",
          "Roll him and inspect the sacrum and heels — pressure ulcers get missed",
          "Inspect and palpate the perineum — crepitus or pain out of proportion"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Assess suprapubic tenderness — catheter-associated urinary tract infection",
          "Assess CVA tenderness — an obstructed, infected kidney needs drainage",
          "Palpate all quadrants — ileus, C. difficile colitis, or a collection"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Auscultate posterior lung fields — aspiration and postoperative pneumonia",
          "Percuss the bases and assess egophony — consolidation or empyema"
        ]
      },
      {
        "group": "Extremities",
        "items": [
          "Inspect between the toes and the soles — a painless diabetic foot ulcer",
          "Assess calf tenderness / asymmetry — postoperative DVT also causes fever",
          "Assess capillary refill and peripheral warmth — mottled and cool is shock"
        ]
      }
    ],
    "pearls": "The septic source hunt in an inpatient is a physical checklist, not a scan: lines, lungs, urine, wound, skin, and the parts of the body you have to move the patient to see. The three most commonly missed sources are the sacrum, the perineum, and whatever is under the dressing — so roll the patient, lift the gown, and take the dressing down. Every indwelling device is a suspect: line, catheter, drain, prosthesis. Pain grossly out of proportion to the skin findings, crepitus, bullae, or a rapidly advancing margin is necrotizing fasciitis and is a surgical call, not an imaging call. Beware the diabetic with a bland-looking foot — deep infection is painless when there is neuropathy, and if a sterile probe reaches bone the patient has osteomyelitis. In the frail elderly, hypothermia and a new delirium substitute for fever, so an afebrile confused postoperative patient still gets the same hunt; document his mental status now, because it is the observation that will detect deterioration overnight."
  },
  {
    "id": "exam-fever-4",
    "category": "Fever",
    "vignette": "55F on day 10 after induction chemotherapy for AML, with a single recorded temperature of 38.5. Her neutrophil count this morning was 0.2 x10^9/L and she has a tunneled chest catheter. T 38.5, HR 104, BP 112/68, RR 18, SpO2 97% on room air.",
    "keyPoints": [
      {
        "group": "HEENT",
        "items": [
          "Inspect oropharynx — mucositis, thrush, and necrotic gingival ulceration",
          "Inspect the nose and hard palate — a black eschar is invasive mould",
          "Palpate over the frontal and maxillary sinuses — invasive fungal sinusitis"
        ]
      },
      {
        "group": "Skin",
        "items": [
          "Inspect the tunneled catheter exit site and tunnel tract — tenderness or pus",
          "Inspect the perianal skin — fissure or abscess; do NOT do a rectal exam",
          "Inspect skin for ecthyma gangrenosum — necrotic center with a red halo",
          "Assess for petechiae — thrombocytopenia and disseminated infection"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Auscultate posterior lung fields — sparse crackles may be the only sign",
          "Assess egophony and tactile fremitus — neutropenia blunts consolidation"
        ]
      },
      {
        "group": "Abdominal",
        "items": [
          "Palpate RLQ — tenderness suggests neutropenic enterocolitis (typhlitis)",
          "Palpate all quadrants gently — peritonism is masked without neutrophils",
          "Auscultate bowel sounds — an ileus accompanies typhlitis"
        ]
      }
    ],
    "pearls": "Neutropenic fever is a single temperature of 38.3 once, or 38.0 sustained for an hour, with an ANC below 0.5 — one reading is enough, and broad-spectrum antipseudomonal antibiotics belong within 60 minutes, before the workup is complete. The whole exam rests on one idea: without neutrophils there is no pus, no consolidation, and no peritonitis, so physical signs are muted and you must hunt the subtle ones. Examine the perianal area visually, because a fissure or perirectal abscess is a common occult source — but do not perform a digital rectal exam or place a rectal thermometer, which seeds bacteremia through friable mucosa. Document every device, every mucosal break, and every skin lesion, and mark any lesion you find so you can tell tomorrow whether it is spreading. Isolated RLQ pain with diarrhea in this window is typhlitis, managed medically; taking it to theatre as appendicitis is the classic error. A black eschar on the palate or turbinates, or unilateral facial pain with orbital signs, is angioinvasive mucormycosis and needs ENT the same day."
  },
  {
    "id": "exam-syncope-1",
    "category": "Syncope",
    "vignette": "80F with a systolic murmur documented for years collapsed while waiting in line at the pharmacy, coming round within a minute with no confusion. Over the past two months she has had increasing breathlessness on exertion and one episode of chest tightness. Triage vitals: T 36.5C, HR 78, BP 118/92, RR 16, SpO2 96% on room air.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Obtain orthostatic vitals — a negative test redirects you to a cardiac cause",
          "Repeat the BP manually — automated cuffs misread a narrow pulse pressure",
          "Count a manual respiratory rate — tachypnea suggests early LV failure"
        ]
      },
      {
        "group": "Neck",
        "items": [
          "Palpate the carotid upstroke — parvus et tardus indicates severe AS",
          "Auscultate the carotids — the AS murmur radiates here and mimics a bruit",
          "Palpate the carotids and suprasternal notch for a thrill — severe AS"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Auscultate the aortic area — harsh crescendo-decrescendo systolic murmur",
          "Time the murmur peak — a late peak indicates more severe stenosis",
          "Assess S2 — a soft or absent A2 supports severe aortic stenosis",
          "Palpate PMI — a sustained, non-displaced apex reflects pressure overload"
        ]
      },
      {
        "group": "Pulmonary",
        "items": [
          "Auscultate posterior lung fields — crackles mean the ventricle is failing",
          "Percuss the bases for dullness — an effusion suggests decompensation"
        ]
      }
    ],
    "pearls": "Syncope with exertional dyspnea and angina is a red flag: it means a fixed cardiac output that cannot rise to meet peripheral vasodilation. Severe AS, HCM, pulmonary hypertension, and anomalous coronaries all present this way, and they are the group you do not discharge. Angina, syncope, exertional dyspnea — the classic AS triad — mark median survivals historically quoted at 5, 3, and 2 years untreated. The findings that best predict severe stenosis are a delayed carotid upstroke (LR ~3.3), a late-peaking murmur, and a soft or absent A2 (LR ~3.8); loudness of the murmur itself is a poor guide, and the murmur can become quieter as stroke volume falls. In an 80-year-old the murmur may radiate to the apex and sound musical (Gallavardin phenomenon), which is easily mistaken for MR. Avoid preload reduction — nitrates and aggressive diuresis can drop these patients precipitously."
  },
  {
    "id": "exam-syncope-2",
    "category": "Syncope",
    "vignette": "66F on furosemide and lisinopril, started on amitriptyline two weeks ago for diabetic neuropathy, fainted while standing at the kitchen counter at 6 am and was found by her husband within a minute. She has had two days of loose stools and poor oral intake. Triage vitals, seated: T 36.7C, HR 96, BP 112/70, RR 16, SpO2 98% on room air.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Measure BP and HR supine at 5 minutes, then at 1 and 3 minutes standing",
          "Note the HR response — a blunted rise suggests autonomic failure or drugs",
          "Watch for symptom reproduction on standing — positive even with a small drop",
          "Recheck orthostatics after volume repletion — depletion should correct"
        ]
      },
      {
        "group": "HEENT",
        "items": [
          "Assess mucous membranes for dryness — supports volume depletion",
          "Inspect conjunctiva for pallor — anemia from occult GI blood loss",
          "Inspect the oropharynx and tongue for a lateral bite — seizure"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Auscultate the aortic area for a systolic murmur — exclude aortic stenosis",
          "Check pulse rate and rhythm — irregularity suggests an arrhythmic cause"
        ]
      },
      {
        "group": "Neuro",
        "items": [
          "Assess gait and stability — a parkinsonian gait suggests autonomic failure",
          "Assess pronator drift and focal deficits — head strike or stroke",
          "Assess reflexes and sensation in the feet — peripheral neuropathy"
        ]
      }
    ],
    "pearls": "Do the orthostatics properly or do not claim them: supine for at least 5 minutes, then standing (not sitting) with readings at 1 and 3 minutes. Positive means a fall in SBP >20 mmHg, a fall in DBP >10 mmHg, or reproduction of symptoms — and symptom reproduction matters as much as the numbers, so a 15 mmHg drop that makes her grey and lightheaded counts. The HR response is the discriminator: a rise of 20 or more beats says the reflex arc works and the problem is volume or drugs; a flat HR points to autonomic failure or beta-blockade. Amitriptyline is a triple hit — anticholinergic, alpha-1 blocking, and sedating — and in an older woman on a diuretic and an ACE inhibitor it is very often the whole answer. Also review alpha-blockers, nitrates, and dose timing. Two days of loose stools with pallor earns a rectal exam for melena — occult GI bleeding is the volume loss you must not miss. If orthostatics are dramatic and unexplained by drugs, think autonomic failure (Parkinson disease, MSA, diabetic autonomic neuropathy) or adrenal insufficiency. Delayed orthostatic hypotension beyond 3 minutes is real and needs a longer stand or tilt testing."
  },
  {
    "id": "exam-syncope-3",
    "category": "Syncope",
    "vignette": "54M with a prior anterior MI and an EF of 32% suddenly lost consciousness while sitting watching television — no warning, no nausea, no sweating, and he was fully oriented within seconds of coming round. His wife saw a few seconds of limb jerking after he slumped. Triage vitals: T 36.8C, HR 88, BP 126/76, RR 16, SpO2 98% on room air.",
    "keyPoints": [
      {
        "group": "Vitals",
        "items": [
          "Obtain orthostatic vitals — a negative test argues against a reflex cause",
          "Count the pulse for a full minute — pauses, bradycardia, or irregularity"
        ]
      },
      {
        "group": "Neck",
        "items": [
          "Assess JVP for cannon a waves — AV dissociation during VT",
          "Auscultate the carotids for bruits before any carotid sinus massage",
          "Palpate the carotid upstroke — parvus et tardus if severe AS is present"
        ]
      },
      {
        "group": "Cardiac",
        "items": [
          "Palpate PMI — a displaced, dyskinetic apex marks a post-MI scar",
          "Auscultate with the bell for an S3 — a low EF raises arrhythmic risk",
          "Auscultate the aortic area — exclude aortic stenosis as a structural cause",
          "Auscultate the apex for a mitral regurgitation murmur — ischemic MR"
        ]
      },
      {
        "group": "Neuro",
        "items": [
          "Assess pronator drift and motor strength — focal deficits are not syncope",
          "Assess cranial nerves — brainstem signs point to a neurologic cause",
          "Assess gait and coordination — ataxia suggests another diagnosis"
        ]
      }
    ],
    "pearls": "Sort every syncope into three buckets. Neurally mediated (vasovagal, situational, carotid sinus): a prodrome of warmth, nausea, tunnel vision, provoked by standing, pain, or emotion — benign, and the exam is normal. Orthostatic: symptoms on standing, drugs or volume loss, positive orthostatics. Cardiac: structural (AS, HCM, myxoma, PE, tamponade) or arrhythmic. This man is the cardiac bucket by history alone — no prodrome, occurred seated, structural heart disease with an EF of 32%. That combination gives roughly a 20-30% one-year mortality and it warrants admission and monitoring, not reassurance. Brief myoclonic jerking after collapse (convulsive syncope) occurs in up to 90% of syncope with prolonged cerebral hypoperfusion and does NOT mean seizure — what argues for seizure is a lateral tongue bite (look for it), an aura, prolonged postictal confusion, and incontinence. Also inspect the scalp and face: injury from an unprotected fall tells you there was no prodrome. Cannon a waves, if you catch them, are a bedside sign of AV dissociation and therefore VT. Never massage a carotid with a bruit."
  }
];

/** Categories that have at least one exam drill, in display order. */
export const EXAM_DRILL_CATEGORIES: string[] = [
  ...new Set(EXAM_DRILLS.map((d) => d.category)),
];
