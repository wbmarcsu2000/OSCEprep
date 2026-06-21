/**
 * Empiric-antibiotics drill bank — "what would you start?" reps for the common
 * inpatient infections, grounded in the MGH Housestaff Manual 2024-2025 ID
 * section (Empiric Antibiotics & Antibiogram p.112-114; CAP p.116; HAP/VAP
 * p.117; SSTI p.120; Meningitis p.123; C. difficile p.124) with IDSA guidance.
 * Same shape as the Scores/Skills drills: a vignette, the concepts a good answer
 * covers (the preferred regimen + the decision driver), and a worked solution.
 * Each prompt asks for the PREFERRED empiric regimen; acceptable alternatives
 * live in the explanation. Page citations are to the 2024-2025 manual.
 *
 * Not for clinical use — always confirm dosing/renal adjustment and the local
 * antibiogram before prescribing.
 */
export interface AntibioticDrillProblem {
  id: string;
  name: string;
  category: string;
  vignette: string;
  /** Graded concepts: for empiric drills the preferred regimen + decision driver;
   *  for spectrum drills the organisms covered + the notable gaps. */
  answer: string[];
  explanation: string;
  /** "empiric" (default): a clinical scenario → what to start. "spectrum": a drug
   *  → what it covers and misses (the bugs-and-drugs reps). */
  mode?: "empiric" | "spectrum";
}

export const ANTIBIOTIC_DRILLS: AntibioticDrillProblem[] = [
  {
    id: "cap-outpatient-healthy",
    name: "CAP — healthy outpatient",
    category: "Respiratory",
    vignette:
      "A 34-year-old previously healthy woman presents with 3 days of productive cough, fever to 38.6 C, and pleuritic chest pain. She is well-appearing: HR 92, BP 122/74, RR 18, SpO2 97% on room air, and fully oriented; BUN is normal. CXR shows a right lower lobe infiltrate. CURB-65 is 0 and she will be treated as an outpatient. What empiric regimen would you start, and why?",
    answer: [
      "amoxicillin 1 g PO TID (first-line)",
      "doxycycline OR a macrolide (azithromycin) as alternatives",
      "no MRSA or Pseudomonas coverage needed",
      "outpatient treatment (CURB-65 0-1), ~5 days",
    ],
    explanation:
      "Healthy outpatient CAP with no comorbidities or MRSA/PsA risk factors: high-dose amoxicillin is first-line; doxycycline or a macrolide (azithromycin/clarithromycin) are alternatives, though US pneumococcal macrolide/doxycycline resistance is rising. No need to cover MRSA or Pseudomonas. CURB-65 (Confusion, BUN>19, RR>=30, SBP<90/DBP<=60, age>=65) of 0-1 supports outpatient care; treat ~5 days assuming clinical stability. (MGH p.113, 116 - CAP)",
  },
  {
    id: "cap-outpatient-comorbid",
    name: "CAP — outpatient with comorbidities",
    category: "Respiratory",
    vignette:
      "A 68-year-old man with COPD and type 2 diabetes presents with productive cough, fever, and increased dyspnea. Vitals: HR 98, BP 130/80, RR 20, SpO2 94% on room air; he is oriented and BUN is normal. CXR shows a left lower lobe infiltrate. He has no prior MRSA/Pseudomonas and no IV antibiotics in the past 90 days, and will be managed as an outpatient. Preferred empiric regimen?",
    answer: [
      "amoxicillin-clavulanate (or a cephalosporin) PLUS azithromycin/doxycycline",
      "OR respiratory fluoroquinolone monotherapy (levofloxacin 750 mg)",
      "adds atypical coverage on top of typical organisms",
      "comorbidities (COPD, DM) drive the broader outpatient regimen",
    ],
    explanation:
      "Outpatient CAP WITH comorbidities (chronic heart/lung/liver/renal disease, DM, alcohol use, malignancy, asplenia): a beta-lactam (amox-clav, or cefpodoxime/cefuroxime) PLUS a macrolide or doxycycline, OR respiratory fluoroquinolone (levofloxacin 750 mg) monotherapy. This adds atypical coverage (Mycoplasma, Chlamydia, Legionella) to S. pneumoniae/H. influenzae. No MRSA/PsA risk here. (MGH p.116 - CAP)",
  },
  {
    id: "cap-inpatient-nonsevere",
    name: "CAP — inpatient, non-severe",
    category: "Respiratory",
    vignette:
      "A 72-year-old woman with hypertension is admitted for pneumonia: HR 104, BP 118/70, RR 24, SpO2 90% on 2 L, A&Ox3, BUN 28. CXR shows a multilobar infiltrate but she needs neither pressors nor mechanical ventilation. No MRSA/Pseudomonas history and no IV antibiotics in 90 days. Empiric regimen for inpatient, non-severe CAP?",
    answer: [
      "ceftriaxone (a beta-lactam)",
      "PLUS azithromycin (atypical coverage)",
      "OR levofloxacin monotherapy",
      "no MRSA/Pseudomonas coverage indicated",
    ],
    explanation:
      "Standard inpatient (non-severe) CAP: a beta-lactam (ceftriaxone) PLUS a macrolide (azithromycin), or respiratory fluoroquinolone (levofloxacin) monotherapy. Ampicillin-sulbactam can replace ceftriaxone; doxycycline can replace azithromycin. She has no MRSA/PsA risk factors, so no vancomycin/cefepime. CURB-65 >=2 supports admission. (MGH p.116 - CAP)",
  },
  {
    id: "cap-severe-mrsa-psa",
    name: "CAP — severe/ICU with MRSA/Pseudomonas risk",
    category: "Respiratory",
    vignette:
      "A 60-year-old man with bronchiectasis and a prior Pseudomonas respiratory isolate presents with severe pneumonia requiring ICU admission and vasopressors. He received IV antibiotics 6 weeks ago. CXR shows necrotizing multilobar consolidation. What empiric regimen, and what test guides de-escalation?",
    answer: [
      "vancomycin (MRSA coverage)",
      "PLUS cefepime (antipseudomonal beta-lactam)",
      "PLUS azithromycin (atypical) - or levofloxacin",
      "send MRSA nasal swab + cultures to de-escalate; avoid daptomycin (inactivated in lung)",
    ],
    explanation:
      "Severe CAP with MRSA/Pseudomonas risk (prior PsA isolate, recent IV antibiotics, bronchiectasis, necrotizing CXR): vancomycin (MRSA) + an antipseudomonal beta-lactam (cefepime) + atypical coverage (azithromycin, favored in the ICU for its anti-inflammatory effect, or levofloxacin). Send sputum/blood cultures and a MRSA nasal swab (~98% NPV) to de-escalate. Do NOT use daptomycin for pulmonary MRSA - it is inactivated by surfactant. (MGH p.113, 116 - CAP)",
  },
  {
    id: "hap-vap",
    name: "HAP / VAP",
    category: "Respiratory",
    vignette:
      "A 65-year-old man intubated for 6 days in the ICU develops new fever, leukocytosis, purulent tracheal secretions, and a new infiltrate. Empiric therapy for ventilator-associated pneumonia?",
    answer: [
      "one antipseudomonal beta-lactam, e.g., cefepime (or pip-tazo/meropenem)",
      "PLUS one anti-MRSA agent, e.g., vancomycin (or linezolid)",
      "consider double antipseudomonal coverage if septic shock/ARDS/known MDR PsA",
      "send sputum + MRSA swab to de-escalate; treat ~7 days",
    ],
    explanation:
      "HAP/VAP (pneumonia >=48 h after admission/intubation) covers enteric GNRs, Pseudomonas, and MRSA/MSSA: one antipseudomonal beta-lactam (cefepime, ceftazidime, pip-tazo, or meropenem) PLUS one anti-MRSA agent (vancomycin or linezolid). Add a second antipseudomonal agent (aminoglycoside or fluoroquinolone) for septic shock, ARDS, or known MDR Pseudomonas. Daptomycin cannot be used for pulmonary MRSA. De-escalate with cultures/MRSA swab; duration ~7 days. (MGH p.113, 117 - HAP/VAP)",
  },
  {
    id: "cystitis-uncomplicated",
    name: "Uncomplicated cystitis",
    category: "Genitourinary",
    vignette:
      "A healthy 26-year-old non-pregnant woman has 2 days of dysuria, urinary frequency, and urgency without fever, flank pain, or vaginal symptoms. She is hemodynamically stable. What empiric therapy, and what should you NOT do?",
    answer: [
      "nitrofurantoin (first-line)",
      "OR TMP-SMX, OR fosfomycin",
      "reserve fluoroquinolones (collateral damage)",
      "do NOT treat asymptomatic bacteriuria - but she is symptomatic, so treat",
    ],
    explanation:
      "Uncomplicated cystitis (E. coli, Klebsiella, S. saprophyticus, Proteus): first-line nitrofurantoin, TMP-SMX, or fosfomycin. Fluoroquinolones work but are reserved due to collateral damage/resistance. Avoid treating asymptomatic bacteriuria in non-pregnant immunocompetent patients - but this patient is symptomatic, so treat. (MGH p.113 - UTI)",
  },
  {
    id: "pyelonephritis",
    name: "Pyelonephritis / complicated UTI",
    category: "Genitourinary",
    vignette:
      "A 45-year-old woman presents with fever to 39 C, rigors, flank pain, and costovertebral angle tenderness, with pyuria on urinalysis. She is being admitted. Empiric therapy for complicated UTI / pyelonephritis?",
    answer: [
      "ceftriaxone (or a fluoroquinolone)",
      "cefepime if Pseudomonas is a concern",
      "carbapenem if ESBL risk/history",
      "blood + urine cultures before antibiotics",
    ],
    explanation:
      "Complicated UTI/pyelonephritis (E. coli, Klebsiella, plus enterococci, Pseudomonas, Serratia): ceftriaxone or a fluoroquinolone (cipro/levo) empirically. Escalate to cefepime if Pseudomonas is a concern, or a carbapenem (meropenem) for ESBL risk/prior ESBL. Obtain urine and blood cultures first and narrow on susceptibilities. (MGH p.113 - UTI)",
  },
  {
    id: "cellulitis-nonpurulent",
    name: "Cellulitis — non-purulent",
    category: "Skin & soft tissue",
    vignette:
      "A 55-year-old man has a warm, erythematous, tender, non-purulent area of spreading skin over the lower leg with low-grade fever. There is no abscess or drainage and he is otherwise well. Empiric therapy?",
    answer: [
      "cefazolin (IV) or cephalexin (PO) - targets beta-hemolytic strep",
      "no routine MRSA coverage for non-purulent cellulitis",
      "add MRSA coverage only if purulent, systemically ill, or failing",
      "elevate the limb and mark the borders",
    ],
    explanation:
      "Non-purulent cellulitis/erysipelas is usually streptococcal (more than S. aureus): cefazolin IV or cephalexin PO. Empiric MRSA coverage is NOT routinely needed for non-purulent cellulitis - reserve it for purulent infection, penetrating trauma/IVDU, systemic toxicity, or beta-lactam failure. (MGH p.113, 120 - SSTI)",
  },
  {
    id: "abscess-purulent",
    name: "Purulent SSTI / abscess",
    category: "Skin & soft tissue",
    vignette:
      "A 30-year-old man who injects drugs presents with a fluctuant, purulent 4-cm abscess with surrounding erythema. He is afebrile and hemodynamically stable. Best management?",
    answer: [
      "incision & drainage (the primary treatment)",
      "add antibiotics covering MRSA (vancomycin IV; or PO TMP-SMX or doxycycline)",
      "send wound culture",
      "drainage is more important than antibiotics for a drained abscess",
    ],
    explanation:
      "Purulent SSTI/abscess is most often S. aureus including MRSA. Incision and drainage is the cornerstone; add MRSA-active antibiotics (IV vancomycin if systemically ill, or PO TMP-SMX or doxycycline for mild disease) when there is surrounding cellulitis, systemic signs, immunocompromise, or I&D failure. At MGH clindamycin is less favored due to rising resistance. (MGH p.113, 115 - SSTI/MRSA)",
  },
  {
    id: "necrotizing-fasciitis",
    name: "Necrotizing fasciitis",
    category: "Skin & soft tissue",
    vignette:
      "A 58-year-old man with diabetes has rapidly spreading limb erythema with pain out of proportion to exam, skin bullae, and crepitus; he is febrile and hypotensive. What is the single most important step, and what empiric antibiotics?",
    answer: [
      "URGENT surgical exploration/debridement (source control) - the priority",
      "vancomycin (MRSA)",
      "PLUS piperacillin-tazobactam or meropenem (broad GNR/anaerobe)",
      "PLUS clindamycin (suppresses exotoxin/toxin production)",
    ],
    explanation:
      "Necrotizing fasciitis (pain out of proportion, rapid spread, crepitus, bullae, systemic toxicity) is a surgical emergency - URGENT operative debridement is the priority and antibiotics are adjunctive. Empiric: vancomycin (MRSA) + broad GNR/anaerobe coverage (pip-tazo or meropenem) + clindamycin to inhibit streptococcal/staphylococcal exotoxin. (MGH p.113 - SSTI)",
  },
  {
    id: "meningitis-young",
    name: "Bacterial meningitis — young adult",
    category: "CNS",
    vignette:
      "A 24-year-old presents with fever, severe headache, neck stiffness, and photophobia for 12 hours; you suspect bacterial meningitis. What empiric therapy should you start (without delaying for LP), and what adjunct reduces neurologic sequelae?",
    answer: [
      "vancomycin",
      "PLUS ceftriaxone (high-dose, 2 g q12h)",
      "dexamethasone with or before the first antibiotic dose (reduces pneumococcal sequelae)",
      "do not delay antibiotics for LP/CT; add acyclovir if HSV is a consideration",
    ],
    explanation:
      "Empiric community bacterial meningitis in a young immunocompetent adult (S. pneumoniae, N. meningitidis): vancomycin + high-dose ceftriaxone (2 g q12h). Give dexamethasone with or just before the first antibiotic dose - it reduces neurologic sequelae (and mortality) in pneumococcal meningitis. Start antibiotics immediately; do not delay for LP or CT. Add acyclovir if HSV encephalitis is suspected. (MGH p.113, 123 - Meningitis)",
  },
  {
    id: "meningitis-listeria",
    name: "Bacterial meningitis — age >50 / immunocompromised",
    category: "CNS",
    vignette:
      "A 67-year-old man with alcohol use disorder presents with fever, confusion, and nuchal rigidity, and you are starting empiric therapy for bacterial meningitis. How does his age and risk profile change the regimen?",
    answer: [
      "vancomycin + ceftriaxone (high-dose)",
      "ADD ampicillin to cover Listeria monocytogenes",
      "empiric dexamethasone with the first dose - but stop it if Listeria is confirmed",
      "age >50, immunocompromise, or alcohol use are Listeria risk factors",
    ],
    explanation:
      "In patients >50 years, immunocompromised, or with alcohol use disorder, add ampicillin to vancomycin + ceftriaxone to cover Listeria monocytogenes (cephalosporins do not cover Listeria). Give empiric dexamethasone with the first dose while pneumococcus is still possible, but discontinue it if Listeria (or another non-pneumococcal pathogen) is confirmed - the steroid benefit is specific to pneumococcal meningitis. (MGH p.113, 123 - Meningitis)",
  },
  {
    id: "sbp",
    name: "Spontaneous bacterial peritonitis",
    category: "GI / Abdomen",
    vignette:
      "A 58-year-old man with cirrhosis and ascites presents with fever, diffuse abdominal pain, and worsening encephalopathy. Diagnostic paracentesis shows an ascitic fluid PMN count of 480/uL. Empiric therapy and key adjunct?",
    answer: [
      "ceftriaxone (or cefotaxime)",
      "diagnosis: ascitic PMN >=250/uL",
      "IV albumin (reduces hepatorenal syndrome and mortality)",
      "start SBP prophylaxis after this first episode",
    ],
    explanation:
      "Spontaneous bacterial peritonitis (enteric GNRs, streptococci, enterococci) is diagnosed by ascitic PMN >=250/uL: treat with a third-generation cephalosporin (ceftriaxone or cefotaxime). Give IV albumin (classically 1.5 g/kg day 1, 1 g/kg day 3), which reduces renal failure and mortality. Initiate secondary prophylaxis after the first SBP episode. (MGH p.113 - SBP; p.94 - ESLD/ascites)",
  },
  {
    id: "cholangitis",
    name: "Ascending cholangitis",
    category: "GI / Abdomen",
    vignette:
      "A 70-year-old woman presents with RUQ pain, fever with rigors, and jaundice (Charcot's triad); labs show a cholestatic pattern and imaging shows a dilated common bile duct with a stone. Empiric antibiotics and definitive management?",
    answer: [
      "ceftriaxone PLUS metronidazole (or pip-tazo if severe/nosocomial)",
      "biliary drainage via ERCP - source control",
      "covers enteric GNRs and anaerobes (CTX+MNZ does NOT cover enterococci)",
      "add ampicillin/vancomycin only if enterococci suspected; blood cultures first",
    ],
    explanation:
      "Ascending cholangitis (E. coli, Klebsiella, anaerobes; enterococci in some): ceftriaxone + metronidazole, or pip-tazo/carbapenem if severe or healthcare-associated. Note CTX+MNZ covers enteric GNRs and anaerobes but NOT enterococci (cephalosporins have no enterococcal activity) - add ampicillin or vancomycin only when enterococci are suspected (healthcare-associated, post-ERCP/instrumentation, prosthetic biliary hardware, immunocompromised). The definitive treatment is biliary decompression (ERCP, or percutaneous if ERCP fails) - antibiotics alone are insufficient without source control. (MGH p.113 - Cholecystitis/Cholangitis)",
  },
  {
    id: "cdiff-initial",
    name: "C. difficile — initial episode",
    category: "GI / Abdomen",
    vignette:
      "A 74-year-old woman who finished a course of ceftriaxone 2 weeks ago now has 6 episodes/day of watery diarrhea, mild abdominal cramping, WBC 13, and Cr 1.1. C. difficile testing is positive. First-line treatment and key supportive steps?",
    answer: [
      "oral vancomycin 125 mg PO q6h (or fidaxomicin) x10 days",
      "stop the offending / non-essential antibiotic",
      "discontinue antimotility agents",
      "metronidazole only if vanc/fidaxomicin unavailable; contact precautions + soap-and-water",
    ],
    explanation:
      "Initial CDI (IDSA 2021): oral vancomycin 125 mg q6h or fidaxomicin 200 mg BID for 10 days - both are now preferred over metronidazole, which is reserved for when they are unavailable. Stop the inciting antibiotic if possible, hold antimotility agents, and use contact precautions with soap-and-water hand-washing (alcohol gel does not kill spores). Do not test for cure. (MGH p.124 - C. difficile)",
  },
  {
    id: "cdiff-fulminant",
    name: "C. difficile — fulminant",
    category: "GI / Abdomen",
    vignette:
      "A 68-year-old man with C. difficile colitis becomes hypotensive with abdominal distension, ileus, WBC 32, lactate 4.0, and CT showing toxic megacolon. How does treatment change for fulminant disease?",
    answer: [
      "high-dose oral vancomycin 500 mg PO q6h",
      "PLUS IV metronidazole 500 mg q8h",
      "urgent surgical consultation",
      "vancomycin retention enema if ileus; IV vancomycin is ineffective",
    ],
    explanation:
      "Fulminant CDI (hypotension/shock, ileus, or toxic megacolon): high-dose oral vancomycin 500 mg q6h PLUS IV metronidazole 500 mg q8h. If ileus is present, add vancomycin per rectum (retention enema). Obtain urgent surgical consultation for possible colectomy. IV vancomycin is ineffective (no luminal delivery). (MGH p.124 - C. difficile)",
  },
  {
    id: "septic-shock-unknown",
    name: "Septic shock — unknown source",
    category: "Sepsis",
    vignette:
      "A 62-year-old woman presents with fever, hypotension (MAP 58 despite fluids), tachycardia, and a lactate of 4.5 without an obvious source. After drawing cultures, what empiric antibiotic approach, and within what timeframe?",
    answer: [
      "broad-spectrum: vancomycin PLUS an antipseudomonal beta-lactam (pip-tazo or cefepime +/- metronidazole)",
      "obtain blood cultures before antibiotics (if it doesn't delay therapy)",
      "give antibiotics within 1 hour of recognition",
      "escalate to a carbapenem if MDRO risk; add clindamycin if toxic shock suspected; pursue source control",
    ],
    explanation:
      "Empiric therapy for septic shock without a source covers GNRs (including Pseudomonas), S. aureus (incl. MRSA), streptococci, and anaerobes: vancomycin + an antipseudomonal beta-lactam (piperacillin-tazobactam, or cefepime +/- metronidazole). Draw cultures first if it does not delay therapy, and give antibiotics within 1 hour - time-to-antibiotics correlates with mortality. Broaden to a carbapenem with MDRO risk; add clindamycin for suspected toxic shock; pursue source control. (MGH p.113 - Septic shock; Pulm p.65 - Sepsis)",
  },
  {
    id: "febrile-neutropenia",
    name: "Febrile neutropenia",
    category: "Immunocompromised",
    vignette:
      "A 55-year-old man on chemotherapy presents with a single temperature of 38.5 C. ANC is 300. He is hemodynamically stable with no localizing symptoms and no central-line concerns. Empiric therapy and timing?",
    answer: [
      "cefepime monotherapy (antipseudomonal beta-lactam)",
      "give antibiotics within 1 hour of fever",
      "add vancomycin only for catheter/skin/pneumonia/mucositis, instability, or GPCs on culture",
      "add an antifungal (e.g., micafungin) if fevers persist >4-7 days",
    ],
    explanation:
      "Febrile neutropenia (single T >=38.3 C, or >=38.0 C / 100.4 F sustained, with ANC <500): empiric antipseudomonal monotherapy - cefepime (or pip-tazo/meropenem) - within 1 hour. Vancomycin is NOT added routinely; add it only for suspected catheter-related/SSTI/pneumonia/severe mucositis, hemodynamic instability, or Gram-positive cocci on cultures. Add empiric antifungal coverage (e.g., micafungin) for persistent fevers beyond 4-7 days. (MGH p.113 - Febrile neutropenia; Onc p.161)",
  },

  // --- Spectrum / "bugs & drugs" reps: a drug -> what it covers and misses ---
  {
    id: "spectrum-pcn-cefazolin",
    name: "Penicillin & cefazolin",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Penicillin and cefazolin (a 1st-generation cephalosporin): what do they cover, and what are the key gaps?",
    answer: [
      "streptococci (e.g., Group A strep) - penicillin",
      "MSSA - cefazolin and antistaphylococcal penicillins (nafcillin/oxacillin)",
      "for MSSA a beta-lactam is far better than vancomycin",
      "gaps: NO MRSA, NO Pseudomonas, minimal Gram-negative, NO anaerobes",
    ],
    explanation:
      "Penicillin covers streptococci (Group A strep, susceptible pneumococcus, syphilis); cefazolin (1st-gen cephalosporin) and antistaphylococcal penicillins (nafcillin, oxacillin) cover MSSA - and for MSSA a beta-lactam is far superior to vancomycin. Gaps: no MRSA, no Pseudomonas, little Gram-negative, no anaerobic coverage. (MGH p.112 - Bugs & Drugs)",
  },
  {
    id: "spectrum-ampicillin",
    name: "Ampicillin / amoxicillin",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Ampicillin / amoxicillin: how does the spectrum differ from penicillin, and what does it uniquely add?",
    answer: [
      "streptococci (like penicillin)",
      "adds Enterococcus (E. faecalis) and Listeria monocytogenes",
      "some Gram-negatives (E. coli, Proteus) - resistance now common",
      "gaps: NO MRSA, NO Pseudomonas; add a beta-lactamase inhibitor for staph/anaerobes",
    ],
    explanation:
      "Aminopenicillins extend penicillin to cover Enterococcus (notably E. faecalis - why ampicillin is added for Listeria meningitis and used in enterococcal endocarditis) and Listeria, plus some Gram-negatives (E. coli, Proteus), though resistance is now common. They do NOT cover MRSA or Pseudomonas; adding a beta-lactamase inhibitor (amp-sulbactam, amox-clav) restores staph and anaerobe coverage. (MGH p.112)",
  },
  {
    id: "spectrum-amp-sulbactam",
    name: "Amp-sulbactam / amox-clav",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Ampicillin-sulbactam (Unasyn) and amoxicillin-clavulanate (Augmentin): what does adding the beta-lactamase inhibitor buy you?",
    answer: [
      "streptococci and MSSA (beta-lactamase-producing staph)",
      "many Enterobacterales (E. coli, Klebsiella)",
      "ANAEROBES (the key addition) - good for bites, aspiration, intra-abdominal",
      "gaps: NO MRSA, NO Pseudomonas",
    ],
    explanation:
      "The beta-lactamase inhibitor (sulbactam/clavulanate) restores activity against beta-lactamase producers: MSSA, many Enterobacterales, and - importantly - anaerobes. That makes amp-sulbactam/amox-clav useful for human/animal bites, aspiration pneumonia/lung abscess, and intra-abdominal infection. They still miss MRSA and Pseudomonas. (MGH p.112)",
  },
  {
    id: "spectrum-ceftriaxone",
    name: "Ceftriaxone (3rd-gen)",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Ceftriaxone (a 3rd-generation cephalosporin): what does it cover, and what are the classic gaps to memorize?",
    answer: [
      "broad Gram-negatives (Enterobacterales: E. coli, Klebsiella)",
      "streptococci including S. pneumoniae; some MSSA",
      "excellent CNS penetration (meningitis), plus gonorrhea, CAP, pyelo, SBP",
      "gaps: NO Pseudomonas, NO enterococci, NO anaerobes, NO Listeria, NO MRSA",
    ],
    explanation:
      "Ceftriaxone/cefotaxime (3rd-gen cephalosporins) give broad Gram-negative (Enterobacterales) and streptococcal coverage with excellent CNS penetration - workhorses for CAP, pyelonephritis, meningitis, SBP, and gonorrhea. Classic gaps: NO Pseudomonas (use cefepime/ceftazidime), NO enterococci (cephalosporins never cover enterococci), NO anaerobes (add metronidazole), NO Listeria (add ampicillin), NO MRSA. (MGH p.112)",
  },
  {
    id: "spectrum-cefepime",
    name: "Cefepime (4th-gen)",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Cefepime (a 4th-generation cephalosporin): what does it add over ceftriaxone, and what does it still miss?",
    answer: [
      "broad Gram-negatives INCLUDING Pseudomonas aeruginosa",
      "Gram-positives (streptococci, MSSA)",
      "active against many AmpC producers",
      "gaps: NO MRSA, NO anaerobes, NO enterococci, NO Listeria",
    ],
    explanation:
      "Cefepime adds antipseudomonal coverage (and reliable AmpC activity) to a broad Gram-negative + Gram-positive spectrum - the antipseudomonal beta-lactam of choice for HAP/VAP, febrile neutropenia, and many septic-shock regimens. Like all cephalosporins it misses enterococci and Listeria, and it does not cover MRSA or anaerobes (pair with vancomycin and/or metronidazole when needed). (MGH p.112)",
  },
  {
    id: "spectrum-piptazo",
    name: "Piperacillin-tazobactam",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Piperacillin-tazobactam (Zosyn): describe its broad spectrum and its notable gaps.",
    answer: [
      "Gram-positives (streptococci, MSSA, some enterococci)",
      "broad Gram-negatives INCLUDING Pseudomonas",
      "ANAEROBES",
      "gaps: NO MRSA, NO atypicals; unreliable for ESBL/AmpC",
    ],
    explanation:
      "Pip-tazo is very broad: Gram-positives (incl. some enterococci), broad Gram-negatives including Pseudomonas, AND anaerobes - a common single agent for intra-abdominal infection and a frequent component of empiric sepsis regimens. It does NOT cover MRSA (add vancomycin) or atypicals, and should not be relied on for ESBL or AmpC producers (use a carbapenem). (MGH p.112)",
  },
  {
    id: "spectrum-carbapenems",
    name: "Carbapenems (meropenem)",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Carbapenems (meropenem, imipenem, ertapenem): what makes them the broadest beta-lactams, and what do they miss?",
    answer: [
      "broadest: Gram-positives, broad Gram-negatives, and anaerobes",
      "cover Pseudomonas (meropenem/imipenem) and ESBL producers",
      "ertapenem does NOT cover Pseudomonas or Acinetobacter",
      "gaps: NO MRSA, NO VRE, NO atypicals; reserve to limit resistance",
    ],
    explanation:
      "Carbapenems are the broadest beta-lactams - Gram-positives, broad Gram-negatives (including ESBL producers), and anaerobes. Meropenem/imipenem cover Pseudomonas; ertapenem does NOT cover Pseudomonas or Acinetobacter (but is convenient once-daily for ESBL when PsA isn't a concern). They miss MRSA, VRE, and atypicals. Reserve carbapenems (especially for ESBL/AmpC) to limit resistance. (MGH p.112, 115)",
  },
  {
    id: "spectrum-aztreonam",
    name: "Aztreonam (monobactam)",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Aztreonam (a monobactam): why is it useful in severe beta-lactam allergy, and what does it cover?",
    answer: [
      "aerobic Gram-negatives ONLY, including Pseudomonas",
      "safe in severe penicillin/cephalosporin allergy (except shares a side chain with ceftazidime)",
      "gaps: NO Gram-positive coverage, NO anaerobes",
      "pair with a Gram-positive agent (e.g., vancomycin) when used empirically",
    ],
    explanation:
      "Aztreonam covers aerobic Gram-negatives only - including Pseudomonas - and is safe in severe penicillin/cephalosporin allergy (minimal cross-reactivity, except it shares a side chain with ceftazidime). It has NO Gram-positive or anaerobic activity, so it must be combined with a Gram-positive agent (e.g., vancomycin) for empiric coverage. (MGH p.112)",
  },
  {
    id: "spectrum-vancomycin",
    name: "Vancomycin (IV vs PO)",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Intravenous vancomycin: what does it cover, and what are the key limitations (including the IV-vs-PO distinction)?",
    answer: [
      "Gram-positives only - MRSA, streptococci, MSSA (beta-lactam better for MSSA)",
      "variable/limited enterococcal activity (ampicillin preferred for susceptible strains); does NOT cover VRE",
      "NO Gram-negative or anaerobic coverage",
      "ORAL vancomycin is not absorbed - used only for C. difficile, never systemic infection",
    ],
    explanation:
      "IV vancomycin covers Gram-positives: MRSA (its main role) and streptococci. For MSSA a beta-lactam (nafcillin/cefazolin) outperforms vancomycin. Enterococcal coverage is only variable/limited - ampicillin is preferred for susceptible enterococci, and E. faecium is frequently the resistant (VRE) species - so do not rely on vancomycin for serious enterococcal infection, and it does not cover VRE. It has no Gram-negative or anaerobic activity. Key pearl: ORAL vancomycin is NOT absorbed systemically - it is used only for C. difficile colitis (luminal effect), never for systemic infection. (MGH p.112)",
  },
  {
    id: "spectrum-linezolid-dapto",
    name: "Linezolid & daptomycin",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Linezolid and daptomycin: when are these Gram-positive agents used, and what are the can't-miss caveats?",
    answer: [
      "both cover resistant Gram-positives - MRSA AND VRE",
      "daptomycin CANNOT be used for pneumonia (inactivated by lung surfactant)",
      "linezolid is highly oral-bioavailable; watch serotonin syndrome and cytopenias",
      "neither covers Gram-negatives",
    ],
    explanation:
      "Linezolid and daptomycin are Gram-positive agents covering MRSA and VRE. Daptomycin must NOT be used for pneumonia - it is inactivated by pulmonary surfactant. Linezolid has excellent oral bioavailability and lung penetration but carries serotonin-syndrome (MAOI) risk and marrow suppression with prolonged use. Neither covers Gram-negatives. (MGH p.112)",
  },
  {
    id: "spectrum-metronidazole",
    name: "Metronidazole",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Metronidazole: what is its spectrum, and where does it fit in combination regimens?",
    answer: [
      "anaerobes (esp. below-the-diaphragm, e.g., Bacteroides) and protozoa",
      "C. difficile (now second-line, behind PO vancomycin/fidaxomicin)",
      "high oral bioavailability (PO = IV) and good CNS penetration",
      "gap: NO aerobic coverage - always paired (e.g., ceftriaxone + metronidazole)",
    ],
    explanation:
      "Metronidazole covers anaerobes (especially below-the-diaphragm Gram-negative anaerobes like Bacteroides) and protozoa, with excellent oral bioavailability and CNS penetration. It is the classic anaerobic partner to a Gram-negative agent (e.g., CTX + metronidazole for intra-abdominal/biliary infection) and a second-line agent for C. difficile. No aerobic activity. (MGH p.112)",
  },
  {
    id: "spectrum-clindamycin",
    name: "Clindamycin",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Clindamycin: what does it cover, and what is its special role in toxin-mediated disease?",
    answer: [
      "Gram-positives (strep, MSSA, some CA-MRSA) and above-the-diaphragm anaerobes",
      "suppresses exotoxin production - added in necrotizing fasciitis and toxic shock",
      "high oral bioavailability",
      "caveats: leading cause of C. difficile; rising MRSA resistance at MGH",
    ],
    explanation:
      "Clindamycin covers Gram-positives (strep, MSSA, some CA-MRSA) and upper/respiratory anaerobes. Its special role is toxin suppression: it is added in necrotizing fasciitis and streptococcal/staphylococcal toxic shock to shut off exotoxin production. Highly oral-bioavailable, but a leading cause of C. difficile, and MRSA resistance is rising at MGH. (MGH p.112, 113)",
  },
  {
    id: "spectrum-macrolides",
    name: "Macrolides (azithromycin)",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Azithromycin (a macrolide): what is its main empiric role and spectrum?",
    answer: [
      "atypicals: Mycoplasma, Chlamydia, Legionella",
      "some respiratory Gram-positives (S. pneumoniae - resistance rising) and H. influenzae",
      "the atypical partner in CAP regimens; anti-inflammatory effect (favored in ICU CAP)",
      "caveats: QT prolongation; rising pneumococcal macrolide resistance",
    ],
    explanation:
      "Macrolides (azithromycin/clarithromycin) cover atypicals (Mycoplasma, Chlamydia, Legionella) and provide the atypical coverage in CAP (beta-lactam + azithromycin). In the ICU azithromycin is favored over a fluoroquinolone for its anti-inflammatory effect. Limits: rising US pneumococcal macrolide resistance and QT prolongation. (MGH p.112, 116)",
  },
  {
    id: "spectrum-doxycycline",
    name: "Doxycycline",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Doxycycline (a tetracycline): why is it such a versatile oral agent, and what does it cover?",
    answer: [
      "atypicals (Mycoplasma, Chlamydia, Legionella) - CAP coverage",
      "CA-MRSA and skin/soft-tissue infection",
      "tick-borne disease (Lyme, Rocky Mountain spotted fever, anaplasmosis)",
      "high oral bioavailability; bacteriostatic; avoid in pregnancy",
    ],
    explanation:
      "Doxycycline is a versatile oral agent covering atypicals (a macrolide alternative in CAP), CA-MRSA/SSTI, and tick-borne illness (Lyme, RMSF, ehrlichiosis/anaplasmosis - first-line even empirically). Highly bioavailable but bacteriostatic, and avoided in pregnancy/young children. (MGH p.112)",
  },
  {
    id: "spectrum-fluoroquinolones",
    name: "Fluoroquinolones (cipro vs levo)",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Fluoroquinolones - ciprofloxacin vs levofloxacin: how do their spectra differ?",
    answer: [
      "both: broad Gram-negatives including Pseudomonas; high oral bioavailability",
      "ciprofloxacin: best Gram-negative/antipseudomonal, weak Gram-positive/atypical",
      "levofloxacin ('respiratory FQ'): adds S. pneumoniae and atypicals (CAP monotherapy)",
      "caveats: QT prolongation, tendinopathy, C. difficile, collateral resistance - reserve",
    ],
    explanation:
      "Fluoroquinolones cover broad Gram-negatives including Pseudomonas with excellent oral bioavailability. Ciprofloxacin has the strongest antipseudomonal activity but weak Gram-positive/atypical coverage; levofloxacin (a 'respiratory fluoroquinolone') adds S. pneumoniae and atypical coverage, enabling CAP monotherapy. Class caveats: QT prolongation, tendon rupture, C. difficile, and collateral resistance - reserve when alternatives exist. (MGH p.112, 116)",
  },
  {
    id: "spectrum-tmp-smx",
    name: "TMP-SMX (Bactrim)",
    category: "Spectrum & coverage",
    mode: "spectrum",
    vignette:
      "Trimethoprim-sulfamethoxazole (Bactrim): what are its main uses and coverage?",
    answer: [
      "CA-MRSA and SSTI; many Gram-negatives (oral option for cystitis)",
      "Pneumocystis jirovecii (PJP) - treatment and prophylaxis",
      "Stenotrophomonas and Nocardia",
      "caveats: hyperkalemia, creatinine rise, sulfa allergy, marrow suppression",
    ],
    explanation:
      "TMP-SMX covers CA-MRSA/SSTI, many Gram-negatives (first-line oral for cystitis), and the special pathogens Pneumocystis jirovecii (PJP treatment and prophylaxis), Stenotrophomonas, and Nocardia. Watch for hyperkalemia, an often-artifactual creatinine bump, sulfa allergy, and cytopenias. (MGH p.112)",
  },
];
