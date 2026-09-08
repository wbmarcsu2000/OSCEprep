// src/data/obVignetteDrills.ts
/**
 * OB/GYN case-vignette drills — the "vignettes" domain of the OB/GYN drill bank.
 *
 * Each drill is one exam-style stem worked the way a shelf/OSCE grader expects:
 * Differential (flag the can't-miss) → Orders (labs → imaging → tissue) →
 * Management (stable vs unstable, closing on a prevention pearl). The student
 * writes all three before looking; the gap is their study list.
 *
 * ITEM RULE — items are "<recall head> — <why / detail>". Only the head is
 * graded (see gradableItem in drillProgressCore), so it is the shortest phrase
 * a student would actually write; "/" in a head lists alternative spellings any
 * one of which earns credit. Doses, cut-offs and branches live after the dash
 * or in pearls, which are shown on reveal and never graded.
 *
 * Standard board values; institutional protocols vary. Educational use only.
 * Source: student OBGYN vignette review sheet, adapted 2026-09-08.
 */
import type { GuidelineDrill } from "./guidelineDrillBank";

const TASK =
  "Write your Differential (name the can't-miss and the one order that excludes it), then your Orders in sequence (labs → imaging → tissue), then Management branched stable vs unstable, closing with one prevention or counseling pearl.";

export const OB_VIGNETTE_DRILLS: GuidelineDrill[] = [
  {
    id: "vig-ob1-first-trimester-bleeding",
    domain: "vignettes",
    name: "OB 1 · First-trimester bleeding",
    org: "OB",
    prompt: `26F G2P1, LMP 7 weeks ago, presents with vaginal spotting and RLQ cramping for 2 days. BP 110/70, HR 92. Mild RLQ tenderness, closed cervical os, minimal blood in the vault. Urine hCG positive.\n\n${TASK}`,
    keyPoints: [
      {
        group: "Differential",
        items: [
          "Ectopic — unilateral pain + bleeding + risk factors; the can't-miss",
          "Threatened abortion / threatened AB — closed os with a viable IUP on ultrasound",
          "Missed abortion / missed AB / early pregnancy loss — closed os, no viable IUP",
          "Molar pregnancy / hydatidiform mole — hCG far too high, snowstorm US, hyperemesis, size > dates",
        ],
      },
      {
        group: "Orders",
        items: [
          "β-hCG — quantitative; hCG first sorts the whole differential",
          "Transvaginal ultrasound / TVUS — IUP vs adnexal mass vs free fluid",
          "CBC — bleeding baseline",
          "Type & screen — Rh status decides RhoGAM",
          "Progesterone — optional; <5 nonviable, >20 reassuring",
        ],
      },
      {
        group: "Management",
        items: [
          "Expectant — viable IUP with cardiac activity: pelvic rest, repeat ultrasound",
          "Discriminatory zone — no IUP with hCG ≥ ~3,500 = ectopic until proven otherwise",
          "Methotrexate — stable, hCG <5,000, no FHR, mass <3.5 cm: 50 mg/m² IM; LFTs/Cr/CBC first",
          "Surgery / laparoscopy — unstable or ruptured; laparotomy if hemodynamically unstable",
          "RhoGAM / anti-D immune globulin — if Rh-negative, with any first-trimester bleed",
        ],
      },
    ],
    pearls:
      "Indeterminate (no IUP, hCG below the zone) = pregnancy of unknown location → repeat hCG in 48 h; a viable IUP rises ≥ ~50%, a slower rise or plateau is ectopic or early loss, but the trend alone never localizes. After single-dose methotrexate, hCG often rises through day 4 — success is a ≥15% fall from day 4 to day 7, then weekly hCG to zero. Ectopic risk factors worth naming: prior ectopic or tubal surgery, PID, IVF (heterotopic ~1:100), pregnancy with an IUD in place. Trap: never give methotrexate off a single hCG value — a desired viable IUP can hide below the discriminatory zone.",
    reviewed: "2026-09-08",
  },
  {
    id: "vig-ob2-hypertension-34-weeks",
    domain: "vignettes",
    name: "OB 2 · Hypertension at 34 weeks",
    org: "OB",
    prompt: `31F G1P0 at 34w2d with headache and "spots in vision" for 1 day. BP 162/108, repeat 158/104. 2+ protein on dipstick, RUQ tenderness, 3+ patellar reflexes, 2+ pedal edema.\n\n${TASK}`,
    keyPoints: [
      {
        group: "Differential",
        items: [
          "Severe preeclampsia / preeclampsia with severe features — BP ≥160/110, visual symptoms, RUQ pain; most likely",
          "HELLP — RUQ pain is the tell; platelets, AST/ALT, LDH",
          "Superimposed preeclampsia — needs chronic HTN documented before 20 wk",
          "Gestational hypertension — no proteinuria and no severe features; excluded here",
          "Eclampsia — if a seizure occurs",
        ],
      },
      {
        group: "Orders",
        items: [
          "CBC / platelets — platelets <100k is a severe feature",
          "CMP / LFTs / creatinine — AST/ALT ≥2× normal or Cr >1.1 = severe features",
          "LDH / peripheral smear — hemolysis screen for HELLP; uric acid optional",
          "Protein/creatinine ratio — ≥0.3, or 24-h urine ≥300 mg",
          "NST / BPP / growth ultrasound — fetal status; plus type & screen",
        ],
      },
      {
        group: "Management",
        items: [
          "Admit — to labor & delivery",
          "Magnesium — sulfate 4–6 g IV load then 1–2 g/h; watch reflexes, RR, urine output; calcium gluconate 1 g IV for toxicity",
          "Labetalol / hydralazine / nifedipine — sustained ≥160/110 >15 min: labetalol 20 mg IV doubling q10 min to 300 mg; hydralazine 5–10 mg IV q20 min; nifedipine IR 10 mg PO",
          "Betamethasone — 12 mg IM q24h ×2 if <37 wk",
          "Deliver — ≥34 wk with severe features: deliver after stabilization; HELLP: deliver at any gestational age once stable",
        ],
      },
    ],
    pearls:
      "Continue magnesium 24 h postpartum; magnesium treats seizures, not blood pressure, so the antihypertensive is a separate order. Proteinuria is not required — severe features alone make the diagnosis, and HELLP can present with normal BP and no proteinuria (think of it in any third-trimester RUQ or epigastric pain). Classic trap: reflexes go with magnesium toxicity (lost patellar reflex ≈ 10 mEq/L), not with preeclampsia severity — hyperreflexia here is a warning sign, not a magnesium problem.",
    reviewed: "2026-09-08",
  },
  {
    id: "vig-ob3-third-trimester-bleeding",
    domain: "vignettes",
    name: "OB 3 · Third-trimester bleeding",
    org: "OB",
    prompt: `29F G3P2 at 36 weeks with sudden painless bright red vaginal bleeding after intercourse. BP 118/76, HR 98. Uterus soft and nontender. FHR 145, category I.\n\n${TASK}`,
    keyPoints: [
      {
        group: "Differential",
        items: [
          "Placenta previa / previa — painless, soft uterus, postcoital; most likely",
          "Placental abruption / abruption — painful, tender or rigid uterus; HTN, cocaine, trauma; category II/III tracing",
          "Vasa previa — fetal bradycardia out of proportion to maternal blood loss",
          "Uterine rupture — prior cesarean, loss of fetal station, sudden pain",
          "Cervical lesion / bloody show — vaginal or cervical source, labor",
        ],
      },
      {
        group: "Orders",
        items: [
          "No digital exam — until previa is excluded",
          "Ultrasound / TVUS — transabdominal then transvaginal; TVUS is safe in previa",
          "CBC / coags / fibrinogen — DIC screen, especially abruption",
          "Type & crossmatch / Kleihauer-Betke — crossmatch blood; KB if Rh-negative to dose RhoGAM",
          "Continuous fetal monitoring / EFM — plus two large-bore IVs",
        ],
      },
      {
        group: "Management",
        items: [
          "Cesarean — stable previa with reassuring tracing: admit, observe, pelvic rest, betamethasone if <37 wk; deliver at 36 0/7–37 6/7 wk; never labor a previa",
          "Emergent delivery — heavy or persistent bleeding, or non-reassuring FHR: cesarean now",
          "Abruption: deliver — stable and term: vaginal if tolerating; unstable or fetal distress: cesarean",
          "DIC — fibrinogen <200: cryoprecipitate, FFP, platelets",
          "RhoGAM / anti-D immune globulin — if Rh-negative, dosed by Kleihauer-Betke",
        ],
      },
    ],
    pearls:
      "Shelf shortcut is pain: painless = previa, painful = abruption, and vasa previa is the only one where the blood is the baby's (Apt test/KB positive, sinusoidal tracing). Abruption is a clinical diagnosis — ultrasound misses about half and the bleed may be fully concealed, so a rigid tender uterus with no visible blood is still abruption. A previa on the 20-week scan usually migrates; re-image at ~32 wk before booking the cesarean. Previa + prior cesarean = think accreta and plan for cesarean hysterectomy.",
    reviewed: "2026-09-08",
  },
  {
    id: "vig-ob4-postpartum-fever",
    domain: "vignettes",
    name: "OB 4 · Postpartum fever",
    org: "OB",
    prompt: `24F on postoperative day 2 after prolonged labor (18 h ruptured membranes, 6 cervical exams) and cesarean. T 39.0 °C, HR 110. Fundus exquisitely tender, foul-smelling lochia. Breasts soft, incision clean, lungs clear, no calf tenderness.\n\n${TASK}`,
    keyPoints: [
      {
        group: "Differential",
        items: [
          "Endometritis — fundal tenderness + foul lochia + cesarean, prolonged ROM, multiple exams; most likely",
          "Wound infection — cellulitis, typically POD 4–7",
          "UTI / pyelonephritis — catheter exposure",
          "Septic pelvic thrombophlebitis — fever persisting despite 48–72 h of antibiotics",
          "Atelectasis / pneumonia / mastitis / DVT — atelectasis POD 1; mastitis POD 7+ with focal erythema; PE/DVT; retained products",
        ],
      },
      {
        group: "Orders",
        items: [
          "CBC — with differential",
          "Blood cultures — two sets before antibiotics",
          "UA / urine culture — catheter exposure",
          "Pelvic ultrasound — retained products or abscess",
          "CT — with contrast if no response by 72 h: abscess vs septic pelvic thrombophlebitis",
        ],
      },
      {
        group: "Management",
        items: [
          "Clindamycin / gentamicin / clinda + gent — clindamycin 900 mg IV q8h + gentamicin 5 mg/kg IV q24h",
          "Ampicillin — add if GBS-positive or no response (covers enterococcus)",
          "Afebrile — treat IV until afebrile 24–48 h, then stop; no oral step-down",
          "D&C / curettage / drainage / heparin / retained products — retained products → D&C; abscess → drain; septic pelvic thrombophlebitis → heparin + antibiotics",
          "Cefazolin — the prevention pearl: 2 g IV before skin incision at cesarean",
        ],
      },
    ],
    pearls:
      "Timing is the differential: POD 1 lungs (atelectasis), POD 2–3 urine and uterus (UTI, endometritis), POD 4–7 wound, POD 7+ breast (mastitis — keep breastfeeding, dicloxacillin). Cesarean is the single biggest endometritis risk factor, which is why pre-incision cefazolin is the counseling pearl. Ampicillin alone fails because anaerobes (Bacteroides) dominate — 'clinda + gent after cesarean'. Fever that persists on the right antibiotics with no abscess on imaging is septic pelvic thrombophlebitis until proven otherwise: add heparin and the fever breaks within days.",
    reviewed: "2026-09-08",
  },
  {
    id: "vig-ob5-new-ob-visit",
    domain: "vignettes",
    name: "OB 5 · New OB visit with chronic hypertension",
    org: "OB",
    prompt:
      "28F G2P1001 at 9w1d for her first prenatal visit. Prior term SVD, uncomplicated. BMI 31, chronic hypertension on lisinopril. No bleeding or cramping. BP 138/86.\n\nName the immediate issues to fix today (this is where the points are), the first-visit orders for every patient plus her chronic-HTN add-ons, and the screening plan for the rest of the pregnancy with its gestational-age windows.",
    keyPoints: [
      {
        group: "Immediate issues",
        items: [
          "Dating ultrasound — confirm dating; CRL <14 wk is most accurate (±5–7 d)",
          "Stop lisinopril / ACE inhibitor — fetopathy: renal dysgenesis, oligohydramnios, skull hypoplasia; switch to labetalol, nifedipine XL, or methyldopa",
          "Aspirin — 81 mg daily from 12–16 wk: chronic HTN + BMI >30 = high preeclampsia risk",
          "Folic acid / folate — 400 µg daily (4 mg if prior neural tube defect)",
          "Baseline creatinine — plus urine protein/Cr ratio, LFTs, EKG if long-standing HTN",
        ],
      },
      {
        group: "First-visit orders",
        items: [
          "CBC / blood type & Rh / antibody screen — anemia, Rh status, alloimmunization",
          "Rubella / varicella / HBsAg / HIV / syphilis / hepatitis C — immunity + infection screen; HCV now universal every pregnancy",
          "Urine culture / UA — treat asymptomatic bacteriuria",
          "GC/chlamydia / Pap — NAAT if ≤25 or risk factors; Pap if due; TB screen if risk",
          "Carrier screening — CF, SMA, hemoglobinopathies (electrophoresis if MCV <80), fragile X if family history",
        ],
      },
      {
        group: "Screening plan",
        items: [
          "cfDNA / NIPT — ≥10 wk, ~99% sensitivity for T21; offer aneuploidy screening to all regardless of age",
          "Anatomy scan — 18–22 wk (MSAFP/quad 15–22 wk if not done)",
          "1-h GCT — 24–28 wk, 50 g; ≥130–140 → 3-h 100 g OGTT; also repeat CBC, HIV/syphilis if risk",
          "RhoGAM / Tdap — anti-D 300 µg at 28 wk if Rh-negative with negative antibody screen; Tdap 27–36 wk every pregnancy",
          "GBS culture — 36 0/7–37 6/7 wk rectovaginal; skip and just treat if GBS bacteriuria or prior GBS-affected infant",
        ],
      },
    ],
    pearls:
      "Visit cadence: q4 wk to 28 wk → q2 wk to 36 wk → weekly. Carpenter-Coustan 3-h OGTT cut-offs 95 / 180 / 155 / 140 — two abnormal values = GDM. Aneuploidy menu: cfDNA ≥10 wk (best for T21), first-trimester combined 11–14 wk (NT + PAPP-A + free β-hCG), quad 15–22 wk; diagnostic CVS 10–13 wk or amniocentesis ≥15 wk (loss ≤1/500) if screen-positive or the patient prefers. Vaccines: influenza any trimester, RSVpreF 32–36 wk in season if the infant won't get nirsevimab; MMR and varicella are live — give postpartum. Red flags to counsel at every visit: BP ≥140/90 with symptoms, decreased fetal movement, leaking fluid, bleeding, severe headache or visual change, RUQ pain.",
    reviewed: "2026-09-08",
  },
  {
    id: "vig-ob6-abnormal-msafp",
    domain: "vignettes",
    name: "OB 6 · Abnormal MSAFP (the twist)",
    org: "OB",
    prompt:
      "30F G1P0 at 16w3d by LMP with no first-trimester ultrasound. Quad screen returns: MSAFP 2.8 MoM, estriol, hCG and inhibin A normal. She is anxious and asks whether the baby has spina bifida.\n\nName the differential for an elevated MSAFP, the next step and what follows if it is nondiagnostic, and the quad-screen analyte patterns you must recognize.",
    keyPoints: [
      {
        group: "Differential (elevated MSAFP)",
        items: [
          "Wrong dates — the most common cause; recheck with ultrasound first",
          "Multiple gestation — twins double the AFP",
          "Open neural tube defect / spina bifida / anencephaly — AFP leaks from exposed neural tissue",
          "Ventral wall defect / gastroschisis / omphalocele — abdominal contents exposed",
          "Placental abnormality / fetomaternal hemorrhage — fetal blood crossing into the mother",
        ],
      },
      {
        group: "Next step",
        items: [
          "Ultrasound — the next step: confirm dating, count fetuses, targeted anatomy; before any invasive test",
          "Amniocentesis — if ultrasound is nondiagnostic: amniotic AFP + acetylcholinesterase",
          "Genetic counseling / maternal-fetal medicine — counsel before and after testing",
        ],
      },
      {
        group: "Quad patterns",
        items: [
          "Down syndrome / trisomy 21 — low AFP, low estriol, high hCG, high inhibin A",
          "Edwards syndrome / trisomy 18 — all four low",
        ],
      },
    ],
    pearls:
      "Do not jump to amniocentesis — an elevated MSAFP with wrong dates or twins is corrected by the ultrasound alone. Even after a normal anatomy scan, unexplained high MSAFP marks a placenta that leaks: counsel about higher risk of growth restriction, preeclampsia, abruption and stillbirth, and add serial growth scans. Memory hook for the analytes: trisomy 21 is 'low-low-high-high' in the order AFP, estriol, hCG, inhibin; trisomy 18 is everything low. Folic acid 4 mg for the next pregnancy if an NTD is found.",
    reviewed: "2026-09-08",
  },
  {
    id: "vig-gyn1-acute-pelvic-pain",
    domain: "vignettes",
    name: "GYN 1 · Acute pelvic pain, fever, discharge",
    org: "GYN",
    prompt: `21F, sexually active with a new partner, no contraception, 3 days of lower abdominal pain, fever 38.4 °C, purulent vaginal discharge. Exam: cervical motion tenderness, bilateral adnexal tenderness. Urine hCG negative.\n\n${TASK}`,
    keyPoints: [
      {
        group: "Differential",
        items: [
          "PID — CMT + adnexal tenderness + fever + discharge with negative hCG; most likely",
          "Tubo-ovarian abscess / TOA — fluctuant mass, high fever, toxic appearance; the can't-miss complication",
          "Appendicitis — RLQ, anorexia, pain migration",
          "Ovarian torsion / torsion — sudden colicky pain, N/V, adnexal mass",
          "Ruptured cyst — hemorrhagic, mid-cycle, afebrile; ectopic already excluded by the hCG",
        ],
      },
      {
        group: "Orders",
        items: [
          "hCG — done; the negative result removes ectopic",
          "Gonorrhea / chlamydia / NAAT — plus wet mount for trichomonas and BV",
          "HIV / syphilis screening — with every STI presentation",
          "Ultrasound / TVUS — pelvic, with Doppler: TOA, torsion",
          "CBC / UA / ESR / CRP — inflammatory markers, exclude UTI",
        ],
      },
      {
        group: "Management",
        items: [
          "Ceftriaxone / doxycycline / metronidazole — outpatient: ceftriaxone 500 mg IM ×1 (1 g if ≥150 kg) + doxycycline 100 mg BID ×14 d + metronidazole 500 mg BID ×14 d",
          "Admit / cefoxitin / cefotetan — IV cefoxitin 2 g q6h or cefotetan 2 g q12h + doxycycline; for TOA, pregnancy, failed orals, can't exclude a surgical emergency, severe illness",
          "Drain the abscess — TOA: add metronidazole or clindamycin; IR drainage if >7–8 cm or no response in 48–72 h",
          "Treat partner — expedited partner therapy; no sex until both complete treatment",
          "Retest — in 3 months for reinfection",
        ],
      },
    ],
    pearls:
      "Treat on clinical criteria — CMT or adnexal tenderness in a sexually active woman with pelvic pain is enough; do not wait for NAAT results. Complications to counsel: infertility (risk climbs with each episode), ectopic pregnancy, chronic pelvic pain, Fitz-Hugh-Curtis perihepatitis (RUQ pain with PID). Ectopic can only be 'excluded' by a negative hCG — a positive hCG with these findings reopens it. Remember an IUD does not need to be removed for mild–moderate PID if she improves within 48–72 h.",
    reviewed: "2026-09-08",
  },
  {
    id: "vig-gyn2-abnormal-uterine-bleeding",
    domain: "vignettes",
    name: "GYN 2 · Abnormal uterine bleeding, reproductive age",
    org: "GYN",
    prompt: `34F, BMI 36, irregular cycles since menarche (every 45–90 days), now 3 weeks of heavy bleeding with clots. Hirsutism, acanthosis nigricans. Hgb 9.8. Urine hCG negative.\n\n${TASK} Organize the differential with PALM-COEIN.`,
    keyPoints: [
      {
        group: "Differential (PALM-COEIN)",
        items: [
          "Ovulatory dysfunction / PCOS — oligomenorrhea + hyperandrogenism + obesity; most likely",
          "Endometrial hyperplasia / endometrial cancer — chronic unopposed estrogen; must exclude despite age <45",
          "Fibroids / leiomyoma / adenomyosis — bulky or tender uterus",
          "Polyp — intermenstrual bleeding",
          "Coagulopathy / von Willebrand — heavy bleeding since menarche; also thyroid disease, hyperprolactinemia, iatrogenic",
        ],
      },
      {
        group: "Orders",
        items: [
          "hCG / CBC / ferritin — iron deficiency from chronic loss",
          "TSH / prolactin / vWF panel — vWF if heavy since menarche",
          "TVUS / pelvic ultrasound — endometrial stripe, fibroids, polyps",
          "Testosterone / 17-OHP / DHEA-S — free & total testosterone; 17-OHP excludes nonclassic CAH; markedly high DHEA-S → adrenal tumor; add A1c and lipids",
          "Endometrial biopsy / EMB — age ≥45, or <45 with unopposed estrogen (obesity, PCOS), failed medical therapy, or Lynch syndrome",
        ],
      },
      {
        group: "Management",
        items: [
          "OCP / progestin / tranexamic acid — acute and stable: high-dose OCP 35 µg EE TID ×7 d then taper, or medroxyprogesterone 20 mg TID ×7 d, or tranexamic acid 1.3 g TID ×5 d",
          "IV estrogen — unstable: conjugated estrogen 25 mg IV q4–6h; D&C or intrauterine balloon tamponade if refractory",
          "LNG-IUD / cyclic progestin — long-term endometrial protection; combined OCP for cycle control + antiandrogen effect",
          "Metformin / weight loss / letrozole — metformin for insulin resistance; 5–10% weight loss restores ovulation; letrozole first-line for ovulation induction",
          "Hysterectomy — atypical hyperplasia (high-dose progestin if fertility desired); hyperplasia without atypia → LNG-IUD + re-biopsy in 3–6 mo",
        ],
      },
    ],
    pearls:
      "The obese anovulatory patient bleeds because her endometrium is never shed by progesterone — every branch of management is 'add progestin.' PCOS (Rotterdam: 2 of oligo-ovulation, hyperandrogenism, polycystic ovaries) still needs the 17-OHP and DHEA-S to exclude the mimics. Biopsy her even at 34: years of unopposed estrogen trump the age-45 rule. Tranexamic acid is contraindicated with a history of thrombosis, and estrogen-containing regimens need the usual OCP contraindication screen (migraine with aura, smoker ≥35, VTE).",
    reviewed: "2026-09-08",
  },
  {
    id: "vig-gyn3-postmenopausal-bleeding",
    domain: "vignettes",
    name: "GYN 3 · Postmenopausal bleeding",
    org: "GYN",
    prompt: `62F, menopause at 51, two episodes of light vaginal bleeding this month. BMI 33, type 2 diabetes, nulliparous, on no hormone therapy. Exam: atrophic vagina, normal cervix, normal-size uterus.\n\n${TASK}`,
    keyPoints: [
      {
        group: "Differential",
        items: [
          "Endometrial carcinoma / endometrial cancer — obesity, nulliparity, diabetes, unopposed estrogen; the must-exclude (~10% of PMB)",
          "Endometrial hyperplasia — the precursor on the same estrogen pathway",
          "Atrophy / atrophic vaginitis — most common cause overall, but a diagnosis of exclusion",
          "Polyp — endometrial polyp",
          "Cervical cancer / exogenous hormones / granulosa cell tumor — check Pap history; HRT; estrogen-secreting tumor; non-gyn source (urethra, rectum)",
        ],
      },
      {
        group: "Orders",
        items: [
          "Transvaginal ultrasound / TVUS / endometrial stripe — ≤4 mm is reassuring (NPV >99%)",
          "Endometrial biopsy / EMB / Pipelle — if stripe >4 mm or bleeding recurs",
          "Hysteroscopy with D&C — nondiagnostic biopsy or persistent bleeding",
          "Pap / CBC — Pap if not current; CBC for anemia",
        ],
      },
      {
        group: "Management",
        items: [
          "Vaginal estrogen — atrophy: estradiol cream 0.5 g twice weekly, or 10 µg tablet",
          "Polypectomy — hysteroscopic, for a polyp",
          "LNG-IUD / progestin — hyperplasia without atypia, with surveillance biopsy; atypical hyperplasia → hysterectomy",
          "Hysterectomy / TAH-BSO — endometrioid carcinoma: total hysterectomy + BSO + sentinel node staging, ± adjuvant RT/chemo by stage; CA-125 and CT if high-grade or serous",
        ],
      },
    ],
    pearls:
      "Any postmenopausal bleeding is cancer until proven otherwise — even a single episode of spotting gets a workup, and a 'normal' exam changes nothing. Either TVUS or biopsy is an acceptable first test; a stripe ≤4 mm ends it only if the bleeding does not recur, and a thick or unmeasurable stripe goes straight to tissue. Tamoxifen users bleed from a thickened endometrium and skip the ultrasound step — biopsy directly. Type II (serous, clear cell) cancers arise in atrophic endometrium without the estrogen story, so a thin patient still needs tissue.",
    reviewed: "2026-09-08",
  },
  {
    id: "vig-gyn4-adnexal-mass-torsion",
    domain: "vignettes",
    name: "GYN 4 · Adnexal mass with acute pain",
    org: "GYN",
    prompt: `19F, sudden severe RLQ pain 3 h ago while jogging, with nausea and vomiting. Afebrile, HR 108. RLQ tenderness with palpable adnexal fullness. hCG negative. TVUS: 6 cm right ovarian cyst, absent venous flow on Doppler, "whirlpool sign."\n\n${TASK}`,
    keyPoints: [
      {
        group: "Differential",
        items: [
          "Ovarian torsion / torsion — sudden colicky pain, N/V, mass >5 cm, exertional trigger; most likely and the can't-miss",
          "Ruptured cyst / corpus luteum cyst — hemorrhagic, mid-luteal phase, free fluid",
          "Appendicitis — fever, migration, anorexia",
          "PID / TOA — fever, CMT, discharge; ectopic excluded by the hCG",
          "Nephrolithiasis / kidney stone — flank pain, hematuria",
        ],
      },
      {
        group: "Orders",
        items: [
          "hCG / CBC / UA — hCG first (done); CBC, UA for the mimics",
          "Ultrasound / TVUS — pelvic, with Doppler: whirlpool sign, absent venous flow (done)",
          "NPO / IV fluids / type & screen — pre-op prep, plus antiemetics",
          "Tumor markers — germ-cell panel (AFP, LDH, β-hCG) if complex or solid components; CA-125 is not useful acutely at 19",
        ],
      },
      {
        group: "Management",
        items: [
          "Laparoscopy / detorsion — emergent, regardless of intraoperative appearance; a dusky ovary usually recovers",
          "Ovarian conservation / conserve the ovary / cystectomy — cystectomy if benign-appearing; oophorectomy only if frankly necrotic or malignancy suspected",
          "Oophoropexy — consider if recurrent, or if the ovary is otherwise normal",
          "Expectant — simple cyst <5 cm without torsion: repeat ultrasound in 6–12 wk; OCPs prevent new cysts but don't shrink existing ones",
          "NSAIDs — ruptured hemorrhagic cyst, stable: NSAIDs + observation; unstable → laparoscopy",
        ],
      },
    ],
    pearls:
      "Doppler flow is present in up to ~60% of torsions (dual ovarian blood supply) — a normal Doppler never excludes torsion; the diagnosis is clinical and the treatment is the OR. The mature cystic teratoma (dermoid) is the most common mass to torse in young women. Do not remove the ovary for color: a blue-black ovary recovers function after detorsion in most cases, and a 19-year-old's fertility is the priority. Germ-cell markers, not CA-125, belong in a teenager with a complex mass.",
    reviewed: "2026-09-08",
  },
];
