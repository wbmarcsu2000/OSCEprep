# OB/GYN Question Bank — Review

Reviewed 2026-07-25. Bank at the time of review: **556 questions across 18 domains** (`src/data/obgynMcq.ts`).

Method: the bank was extracted to JSON and profiled mechanically, then split into 7 per-domain slices for
independent clinical review, plus a blueprint-coverage pass over each half and a redundancy adjudication
over 91 mechanically-detected topic clusters. Findings marked **[verified]** were re-checked by hand against
the data; the rest are reviewer-reported and worth confirming before you act on them.

## Clean bill of health

These were checked mechanically across all 556 questions and are all clean:

| Check | Result |
|---|---|
| Duplicate ids | 0 |
| Exact-duplicate stems | 0 |
| Near-duplicate stems (>=0.82 similarity, cross-domain) | 0 |
| `optionRationales` aligned 1:1 with `options` | 556/556 |
| Empty stems or options | 0 |
| `answerIndex` out of range | 0 |
| Duplicate options within a question | 0 |
| Concepts that merely restate their stem | 0 |
| Option rationales under 35 chars | 0 |
| Answer-key position balance | 17-21% per slot (pre-shuffle working) |
| Non-integer ages / generation artifacts | 1 (`ob-newborn-neonatal-26`, "3.9-hour-old") |
| Unique topic strings | 550 for 556 questions |
| Stem length | median 258 chars, p90 355 - real vignettes |

## The one structural theme

**The bank walks the student to a diagnosis and then stops.** This is the single most consistent gap, and it
repeats across every oncology domain:

- **Breast (23 Q)** - every malignant-disease question keys to a *biopsy*. Sentinel lymph node biopsy: 0. Breast-conserving therapy vs mastectomy: 0. **[verified]**
- **Endometrial** - postmenopausal bleeding -> TVUS -> biopsy is fully covered; what to do with a positive biopsy is not.
- **Cervical cancer** - 1 question, keyed to "cervical biopsy". Staging and stage-based management: 0.
- **Ovarian (6 Q)** - all risk factors, tumour markers, and why screening fails. Management: 0.

Same pattern in obstetrics: the bank teaches which antihypertensives are *safe preconception* five separate
times, but never the acute severe-range (160/110) hypertensive-emergency decision. **[verified]**

## Verified absent topics

Zero questions where this is the tested point (keyword in `topic` or in the keyed answer). All **[verified]**:

- Low-dose aspirin for preeclampsia prophylaxis - who qualifies, 12-28 week window (appears only as a distractor, 4x)
- Operative vaginal delivery - forceps/vacuum indications, prerequisites, complications (distractors only, 7x)
- Placenta accreta spectrum - the prior-cesarean + previa risk dyad, planned cesarean hysterectomy
- Vasa previa - painless bleeding at ROM with fetal bradycardia
- Antepartum fetal surveillance beyond NST - biophysical profile, contraction stress test, umbilical artery Doppler
- Acute severe-range hypertension in pregnancy - the 160/110 threshold and IV labetalol/hydralazine
- Amniotic fluid embolism
- Peripartum cardiomyopathy (no cardiac disease of pregnancy anywhere in the 6 obstetric domains)
- Delayed postpartum preeclampsia / eclampsia after discharge
- Perineal laceration classification and OASIS management
- Post-term pregnancy and induction by 41-42 weeks
- Lithium (Ebstein anomaly) and methimazole teratogenicity
- Congenital syphilis in the neonate
- Lichen sclerosus and the vulvar dermatosis differential
- Coagulopathy / von Willebrand as a cause of heavy menstrual bleeding (the 'C' of PALM-COEIN)
- Kallmann syndrome / hypogonadotropic hypogonadism as a cause of primary amenorrhea
- Sentinel lymph node biopsy and breast-conserving therapy

### Thin (1-2 tested points) **[verified]**

VBAC/TOLAC (1) - HPV primary-screening interval (1) - placenta previa (1) - placental abruption (1) -
GDM pharmacologic management (~2) - preeclampsia severe features (2) - HELLP (2) - chorioamnionitis (2) -
IUGR (2) - twins (2) - neonatal resuscitation/APGAR (2) - IPV screening (2) - hepatitis B neonatal HBIG (1) -
neonatal HSV (1) - buprenorphine/methadone in pregnancy (1)

> Correction to the reviewers: they reported the PPH escalation ladder as absent. Tranexamic acid and balloon
> tamponade **are** keyed (3 tested points, in Pharmacology). The gap is narrower than reported - the
> *Postpartum domain itself* stops at bimanual massage + oxytocin. **[verified]**

## Clinical findings

80 findings from 7 independent domain reviewers: 2 critical, 16 high, 43 medium, 19 low.

By kind: false-rationale 18, outdated-guideline 17, false-concept 17, other 11, weak-teaching 8, wrong-key 3, two-defensible-answers 3, underspecified-stem 3

### `ob-benign-gynecology-5` - critical / wrong-key **[verified]**
**Problem.** The stem describes a 27-year-old with 14 months of infertility (i.e. she meets the definition of infertility and is actively trying to conceive) plus classic endometriosis findings, yet the keyed answer prescribes combined oral contraceptives — a contraceptive. This is internally contradictory (the keyed option itself says laparoscopy is reserved for 'infertility evaluation,' which this patient already needs) and clinically wrong: hormonal suppression is not offered to a patient seeking pregnancy. In suspected endometriosis with infertility, the appropriate step is infertility work-up/diagnostic laparoscopy with treatment of lesions (which improves fecundability), not OCPs.

**Evidence.** STEM: '...She has been trying to conceive for 14 months without success.' KEYED A: 'Empiric NSAIDs and OCPs, reserving laparoscopy for refractory symptoms or infertility evaluation'; rationale D: 'Laparoscopy is definitive but invasive and not required as the first step when the clinical picture is classic.'

**Fix.** Either re-key to option D (diagnostic laparoscopy, since infertility is already present and is an accepted indication) and rewrite rationale D accordingly, or remove the infertility sentence from the stem so that empiric NSAIDs/OCPs is a coherent answer. Do not leave a stem in which the keyed action is contraception for a woman trying to conceive.

### `ob-contraception-8` - critical / wrong-key **[verified]**
**Problem.** The question invents a contraindication that does not exist and keys DMPA over a Tier-1 LARC on the strength of it. Chlamydia treated 2 months ago is NOT a contraindication to IUD insertion: per CDC US MEC, current purulent cervicitis/chlamydial/gonococcal infection is Category 4 for initiation, but a treated infection or a past history of PID with no current infection is Category 1-2. There is no 3-month waiting period after treated cervicitis, and STI history is not a reason to withhold either IUD. With the fabricated premise removed, the LNG-IUD (Tier 1, no adherence required, and it treats bleeding) is at least as good an answer as DMPA — which is Tier 2, causes bone loss, weight gain, and a median ~10-month delay in return to fertility. This teaches students to withhold LARC from exactly the population (young, prior chlamydia, poor pill adherence) in whom it is most indicated.

**Evidence.** Option A rationale: "An IUD is relatively contraindicated within 3 months of a pelvic infection such as chlamydia, and IUDs are not typically associated with significant weight gain." Option B rationale: "The copper IUD is also relatively contraindicated soon after pelvic infection..." CONCEPT: "Depot medroxyprogesterone acetate, given every 3 months, is well suited for patients with poor medication adherence or who cannot use an IUD due to recent pelvic infection." DISCRIMINATOR: "Recent pelvic infection (contraindicating IUD placement) combined with poor adherence..."

**Fix.** Delete the false 3-month rule from options A and B, the concept, and the discriminator. Either (a) re-key to option A — LNG-IUD — and correct its counselling clause from "possible weight gain" to "irregular spotting for the first 3-6 months and lighter periods thereafter"; or (b) keep DMPA as the key but change the stem's reason for avoiding an IUD to a genuine one (current purulent cervicitis/untreated infection, distorted uterine cavity, or the patient declines a pelvic procedure). Also drop "a possible small increase in breast cancer risk" from the DMPA counselling list — that is not an established US MEC counselling point for a woman without breast cancer.

### `ob-cervical-dysplasia-screening-5` - high / outdated-guideline
**Problem.** Post-treatment surveillance after excision of CIN 2/3 is keyed to the superseded 2012 algorithm. ASCCP 2019 risk-based management recommends HPV-based testing (HPV alone or co-test) at 6 MONTHS after treatment, then annually until three consecutive negatives, then at least every 3 years for a minimum of 25 years — regardless of margin status.

**Evidence.** KEYED C: 'Pap smear and HPV co-testing at 1 and 2 years postoperatively'; rationale: 'standard post-excision surveillance for CIN 2/3 is co-testing at 1 and 2 years.'

**Fix.** Re-key/rewrite to 'HPV-based testing at 6 months, then annually until 3 consecutive negatives, then at least every 3 years for 25 years,' and update the concept to state that surveillance continues for at least 25 years even with negative margins.

### `ob-contraception-1` - high / weak-teaching
**Problem.** A 40-year-old BRCA1 carrier who has completed childbearing is exactly the patient for whom risk-reducing bilateral salpingo-oophorectomy at age 35-40 is the standard-of-care recommendation (NCCN/ACOG/SGO). The question and its teaching fields present bilateral salpingectomy as the ovarian-cancer-risk-reducing operation for this patient and never mention oophorectomy — the word does not appear anywhere in the batch. A student answering this correctly comes away believing salpingectomy alone is adequate risk reduction in BRCA1, which is false and would under-treat a real patient with a ~40% lifetime ovarian cancer risk.

**Evidence.** CONCEPT: "Bilateral salpingectomy is increasingly preferred over segmental tubal ligation for permanent sterilization because it has a lower failure/ectopic pregnancy rate and is associated with reduced ovarian cancer risk, since many high-grade serous ovarian cancers arise from fallopian tube epithelium." DISCRIMINATOR: "The BRCA1 mutation and desire to reduce future ovarian cancer risk specifically favors complete tube removal over simple tubal occlusion."

**Fix.** Add to the concept: "In a BRCA1/2 carrier, salpingectomy alone is NOT sufficient risk reduction — risk-reducing bilateral salpingo-oophorectomy is recommended at age 35-40 for BRCA1 (40-45 for BRCA2) once childbearing is complete; interval salpingectomy is an option only for carriers deferring oophorectomy." Better still, either remove the BRCA1 detail (so the question tests salpingectomy vs ligation in an average-risk woman) or add a second question keying RRSO for the BRCA1 carrier.

### `ob-early-pregnancy-complications-27` - high / outdated-guideline
**Problem.** The keyed action — Rh(D) immune globulin for light spotting at 8 weeks with a viable, closed-os intrauterine pregnancy — is no longer supported. ACOG's 2024 Clinical Practice Update states Rh(D) immune globulin is NOT recommended for spontaneous or induced abortion or pregnancy loss at <12 weeks (fetomaternal hemorrhage volumes are far below the sensitizing threshold and Rh testing itself is unnecessary); for threatened abortion with an ongoing pregnancy at <12 weeks the evidence is weaker still, and ACOG had already called it optional. The RULES line makes this absolute for any gestational age.

**Evidence.** STEM: 'presents at 8 weeks gestation with light vaginal spotting… viable intrauterine pregnancy with a closed cervical os'; keyed rationale: 'Correct: any bleeding episode in an Rh-negative, unsensitized patient warrants Rh(D) immunoglobulin'; RULES: 'Rh-negative + unsensitized + any bleeding episode -> give Rh(D) immunoglobulin'

**Fix.** Either move the vignette to ≥12 weeks (e.g., 16 weeks) so the keyed answer is unambiguous, or re-key. At minimum rewrite the RULES to 'Rh-negative + unsensitized + bleeding at ≥12 weeks -> give Rh(D) immune globulin; at <12 weeks after loss/abortion RhIg is not recommended (ACOG 2024) and is optional for threatened abortion.'

### `ob-early-pregnancy-complications-32` - high / outdated-guideline
**Problem.** The keyed option prescribes bed rest for threatened abortion. Bed rest has no demonstrated benefit for threatened abortion (Cochrane; ACOG), is explicitly not recommended, and carries real harm in pregnancy (VTE risk, deconditioning, lost income). Because it is bundled with 'expectant management,' the student is forced to select it and will encode bed rest as the treatment.

**Evidence.** option E (keyed): 'Bed rest and expectant management with reassurance'; rationale: 'Correct: with a closed os and viable pregnancy, conservative management with rest and reassurance is appropriate.'

**Fix.** Reword the option to 'Expectant management with reassurance and repeat ultrasound' and add to the concept that bed rest and pelvic rest do not reduce loss and should not be recommended — this is itself a tested point.

### `ob-early-pregnancy-complications-8` - high / false-concept
**Problem.** This question teaches that a viable IUP 'requires' a ≥53% rise in 48 hours, while ob-early-pregnancy-complications-6 and -12 in the same bank teach ≥35%. The 53% figure is the older Kadar mean; ACOG (Practice Bulletin 193, based on Barnhart/Seeber) uses ~35% over 48 h as the slowest rise compatible with a viable IUP. Using 53% as a requirement misclassifies normal early pregnancies as abnormal — the exact direction of error that leads to inappropriate methotrexate or aspiration of a wanted pregnancy.

**Evidence.** option B rationale: 'A normal IUP requires a rise of ≥53% every ~2 days in the first 10 weeks'; CONCEPT: 'Serum β-hCG normally rises by at least 53% every 48 hours during the first 10 weeks of a viable intrauterine pregnancy.'

**Fix.** Harmonize on the ACOG figure: 'the minimum rise consistent with a viable IUP is ~35% over 48 hours (mean rise is closer to 50-60%).' The key (ectopic/nonviable) is unaffected — 900→1050 is a 17% rise, below either threshold.

### `ob-gynecologic-infections-stis-6` - high / outdated-guideline
**Problem.** Podophyllum (podophyllin) resin was removed from the CDC recommended regimens for anogenital warts in the 2021 STI Treatment Guidelines because of toxicity and inferior standardization. Current patient-applied options are imiquimod 3.75%/5%, podofilox 0.5%, and sinecatechins 15%; provider-administered options are cryotherapy, surgical removal, and TCA/BCA 80-90%. The stem also specifies she wants a self-applied agent, which podophyllin resin never was (it is provider-applied only).

**Evidence.** STEM: 'She desires a topical treatment applied directly to the wart.' KEYED A: 'Podophyllum resin' — rationale: 'Podophyllum resin is a classic topical treatment for genital warts.' CONCEPT: '...such as podophyllin resin (provider-applied)...'

**Fix.** Re-key to imiquimod 5% cream (or podofilox 0.5% gel) as the patient-applied topical, move podophyllum resin into a distractor labelled as no longer recommended, and rewrite the concept to the CDC 2021 patient-applied/provider-administered lists.

### `ob-gynecologic-oncology-1` - high / two-defensible-answers **[verified]**
**Problem.** The patient is 25 years old, but risk-reducing salpingo-oophorectomy in a BRCA1 carrier is recommended at age 35-40 — not at 25. The question's own concept and rules say exactly this, so the keyed answer contradicts its own teaching. At 25 the correct 'next step' is enhanced breast surveillance (MRI ± mammography from 25-30) with counselling about future RRSO; doing BSO now imposes ~12 years of unnecessary surgical menopause (bone loss, cardiovascular and cognitive risk).

**Evidence.** STEM: 'A 25-year-old woman... is found to carry a BRCA1 mutation. She has completed childbearing. Which of the following is the most appropriate next step?' KEYED B: 'Bilateral salpingo-oophorectomy'. CONCEPT: 'risk-reducing bilateral salpingo-oophorectomy is recommended (BRCA1 around age 35-40)'; RULES: 'BRCA carrier -> enhanced breast screening (MRI + mammography) starting age 25-30'.

**Fix.** Change the stem age to 36-40 so the keyed RRSO is correct, or keep age 25 and re-key to a screening/surveillance option — but then rewrite option D, which currently says 'Annual mammography starting now with no surgical intervention' (also wrong, because mammography alone is inadequate and RRSO is only deferred, not excluded).

### `ob-labor-delivery-6` - high / false-concept
**Problem.** The concept states every Bishop component is scored 0-3. That is factually wrong and it contradicts the question's own option rationale: dilation, effacement and station are scored 0-3, but consistency and position are scored 0-2 (max total 13, not 15). A student who memorises this concept will mis-score cervices on the shelf and will be unable to reconcile it with option B, which correctly says soft + anterior = '2 each'.

**Evidence.** CONCEPT: "The Bishop score sums five components (dilation, effacement, station, consistency, position), each scored 0-3, to predict induction success." vs option B rationale: "a soft, anterior cervix scores the maximum points (2 each) for consistency and position"

**Fix.** Rewrite the concept: "Dilation, effacement and station each score 0-3; consistency and position each score 0-2 (maximum total 13). Dilation 0/1-2/3-4/≥5 cm = 0/1/2/3; effacement 0-30/40-50/60-70/≥80% = 0/1/2/3; station -3/-2/-1 to 0/+1 to +2 = 0/1/2/3; consistency firm/medium/soft = 0/1/2; position posterior/mid/anterior = 0/1/2." Keep option A as the key.

### `ob-medical-complications-of-pregnancy-16` - high / outdated-guideline
**Problem.** The option-D rationale states current US practice as blanket discouragement of breastfeeding regardless of viral load. Since the January 2023 DHHS perinatal HIV guidelines (endorsed by ACOG), people with HIV on ART with sustained viral suppression should be counseled that breastfeeding is a reasonable option with <1% transmission risk, using shared decision-making. Teaching 'discouraged regardless of viral load' is out of date and inconsistent with the question's own premise of durable suppression.

**Evidence.** option D rationale: 'In resource-rich settings such as the US, breastfeeding is generally still discouraged for HIV-positive mothers regardless of viral load due to residual transmission risk.'

**Fix.** Keep D as the wrong answer but fix the reason: breastfeeding is now a supported option with sustained viral suppression, yet it is not 'fully safe without any additional precautions' — it requires continued ART with documented suppression, maternal/infant viral monitoring, infant antiretroviral prophylaxis decisions, and avoidance of mixed feeding. Add that framing to the concept.

### `ob-menstrual-disorders-3` - high / false-rationale
**Problem.** The keyed option gates endometrial sampling on a thickened stripe in a 48-year-old PREmenopausal woman. The 4-mm/"thickened stripe" threshold is validated only for postmenopausal bleeding; in premenopausal women endometrial thickness does not reliably exclude hyperplasia or carcinoma. ACOG guidance is that AUB at age >=45 (or younger with risk factors) requires endometrial tissue sampling regardless of ultrasound thickness. As written, the question teaches that a thin stripe in a 48-year-old lets you skip the biopsy — a wrong and potentially cancer-missing action.

**Evidence.** Keyed option E: "Transvaginal ultrasound with endometrial biopsy if endometrium is thickened". RULES: "AUB age >=45, or younger with risk factors (obesity, PCOS, nulliparity, chronic anovulation) -> endometrial evaluation (TVUS +/- biopsy)"

**Fix.** Reword the keyed option to "Endometrial biopsy (with transvaginal ultrasound to look for structural causes)" and change the RULES line to "AUB age >=45 -> endometrial biopsy regardless of endometrial thickness; TVUS is complementary (structural causes), not a substitute for sampling. The >4 mm stripe threshold applies only to POSTmenopausal bleeding." The option rationale should state explicitly that a thin stripe does not exclude malignancy before menopause.

### `ob-newborn-neonatal-26` - high / two-defensible-answers **[verified]**
**Problem.** The stem describes a *symptomatic* infant (jittery, irritable) with a glucose of 24 mg/dL — below the 25 mg/dL cut point in the AAP algorithm for the first 4 hours of life, and below the 40 mg/dL threshold at which the AAP/Pediatric Endocrine Society direct IV dextrose for symptomatic hypoglycemia. Option E (IV dextrose bolus + infusion) is therefore at least as defensible as the keyed feeding-and-recheck, and many neonatologists would call it the better answer. The keyed rationale tries to escape this by redefining symptoms, but jitteriness and irritability ARE the neuroglycopenic symptoms the guideline means. (The stem also states a nonsense age, "3.9-hour-old.")

**Evidence.** STEM: "A 3.9-hour-old infant... is noted to be jittery and irritable. Point-of-care glucose is 24 mg/dL" / keyed C rationale: "because the infant can feed and has only mild symptoms, enteral feeding with a glucose recheck is the appropriate first-line management" / option E rationale: "IV dextrose is reserved for infants who cannot tolerate feeds, have severe symptomatic hypoglycemia (seizures, lethargy)"

**Fix.** Make the infant asymptomatic and the glucose above 25 to key feeding — e.g., "a 2-hour-old asymptomatic infant... routine pre-feed screening glucose is 32 mg/dL" — or leave the stem symptomatic at 24 mg/dL and re-key to E (IV dextrose bolus followed by infusion). Also fix the age to a whole number (e.g., "4-hour-old").

### `ob-newborn-neonatal-31` - high / wrong-key
**Problem.** The keyed answer treats a Bhutani "high-intermediate risk zone" TSB as a phototherapy threshold. The hour-specific risk-zone nomogram is a *predictive* tool (75th-95th percentile predicts later significant hyperbilirubinemia) — it is not a treatment threshold. At 48 hours the high-intermediate zone is roughly 11.5-15 mg/dL, far below the AAP 2022 phototherapy threshold (~18 mg/dL for a >=38-week infant with no neurotoxicity risk factors). Correct management for a well term 48-hour-old with no hemolysis in that zone is a repeat TSB / close follow-up in 24-48 hours, not phototherapy — so as written no option is defensible and the item teaches over-treatment (unnecessary phototherapy, mother-infant separation, interrupted breastfeeding). The concept also still uses the pre-2022 risk-zone framework.

**Evidence.** STEM: "a total serum bilirubin that plots in the high-intermediate risk zone on the hour-specific bilirubin nomogram, with no evidence of hemolysis" / keyed E rationale: "bilirubin in the high-intermediate risk zone without hemolysis warrants phototherapy" / CONCEPT: "Management of neonatal hyperbilirubinemia is guided by hour-specific bilirubin nomograms... phototherapy is initiated at defined bilirubin thresholds"

**Fix.** Either (a) give an explicit value above the AAP 2022 threshold (e.g., "TSB 18.5 mg/dL at 48 hours, 39 weeks, no neurotoxicity risk factors") and keep phototherapy keyed, or (b) keep the risk-zone stem and add/key an option "Repeat total serum bilirubin with follow-up within 24-48 hours." Rewrite the concept around the AAP 2022 gestational-age-specific phototherapy threshold curves stratified by neurotoxicity risk factors, and state explicitly that risk zones predict risk but do not set treatment thresholds.

### `ob-pharmacology-53` - high / false-concept
**Problem.** The stem specifically picks a woman with a MECHANICAL HEART VALVE, and the concept then states that heparins are the anticoagulant of choice "throughout pregnancy." That is the one population where this is wrong and dangerous: LMWH/UFH monotherapy in mechanical valves carries a substantially higher rate of valve thrombosis and maternal death, and ACC/AHA and ESC guidance is that warfarin (dose-adjusted, INR-targeted) is preferred in the 2nd and 3rd trimesters, with first-trimester options being continued warfarin (esp. if dose ≤5 mg/day) or anti-Xa-monitored LMWH after shared decision-making. Option B's rationale reinforces the error by asserting that comparative efficacy against valve thrombosis "is not the reason for the switch" — for a mechanical valve, relative efficacy is precisely the dominant consideration.

**Evidence.** STEM: "A pregnant woman with a mechanical heart valve requires anticoagulation. Why is warfarin generally avoided..." / CONCEPT: "heparins (unfractionated and low molecular weight) are large, negatively charged molecules that do not cross the placenta and are the anticoagulants of choice throughout pregnancy." / Option B rationale: "Efficacy for maternal valve thrombosis is not the reason for the switch"

**Fix.** Keep the keyed option D (warfarin embryopathy / placental transfer is still the correct answer to the question asked), but change the stem population to a non-valve indication (e.g. "a pregnant woman with a prior unprovoked DVT") OR amend the concept and add a conceptRule: "Exception — mechanical heart valve: LMWH monotherapy raises valve-thrombosis risk, so warfarin is commonly resumed for the 2nd/3rd trimesters (stopped ~36 weeks) with anti-Xa-monitored LMWH or dose-limited warfarin in the 1st trimester." Also rewrite option B's rationale so it does not imply heparin is at least as effective as warfarin for valve thrombosis.

### `ob-postpartum-7` - high / false-concept
**Problem.** The stem's patient is explicitly formula-feeding, but the concept's management advice is 'frequent milk removal/feeding' — the opposite of correct care. Frequent expression in a woman who is not breastfeeding sustains prolactin-driven milk production and prolongs engorgement. This is actionable advice a student would carry to a real patient.

**Evidence.** STEM: "A postpartum woman who exclusively bottle-feeds her newborn presents on day 2 postpartum with bilateral firm, swollen, tender breasts..." CONCEPT: "management is frequent milk removal/feeding, NSAIDs, and warm or cold compresses"

**Fix.** Split the management by intent: "If she intends to breastfeed, treat with frequent milk removal/feeding plus NSAIDs. If she is not breastfeeding (as here), treat with a firm supportive bra, cold compresses and NSAIDs, and explicitly AVOID nipple stimulation, pumping or expression, which perpetuates lactation; engorgement resolves in 24-48 h as production involutes." Drop 'warm compresses' from the non-lactating pathway — warmth is used before a feed to aid letdown, cold is what relieves engorgement.

### `ob-prenatal-care-normal-pregnancy-10` - high / false-rationale
**Problem.** The rationale for the KEYED CORRECT option states that low-risk cfDNA results also require invasive diagnostic confirmation. This is false and clinically harmful teaching: a low-risk (negative) cfDNA result requires no diagnostic procedure, and CVS/amniocentesis carry a real procedure-related loss risk. Only high-risk/positive results require confirmation. The concept paragraph states this correctly ("Any abnormal result must be confirmed"), so the rationale directly contradicts the concept.

**Evidence.** D. Confirmatory diagnostic testing with chorionic villus sampling or amniocentesis <== KEYED CORRECT — rationale: "Correct: cfDNA screening results, whether high- or low-risk, require confirmation with a diagnostic invasive test before acting on the diagnosis."

**Fix.** Change the rationale to: "Correct: cfDNA is a screening test with a substantial false-positive rate, so a HIGH-RISK result must be confirmed by CVS or amniocentesis before any diagnosis or irreversible decision. A low-risk result needs no invasive confirmation."

### `ob-prenatal-care-normal-pregnancy-57` - high / false-concept
**Problem.** The concept gives blanket anticoagulation advice that is wrong — and potentially fatal — for the exact patient in the stem (mechanical MITRAL valve). ACC/AHA 2020 valvular guidelines give a Class 1 recommendation to use warfarin in the 2nd and 3rd trimesters in patients with a mechanical prosthesis, and in the 1st trimester either continued warfarin (if dose ≤5 mg/day) or dose-adjusted LMWH with anti-Xa monitoring. LMWH monotherapy without anti-Xa-guided dosing in a mechanical mitral valve carries a well-documented risk of valve thrombosis and maternal death. The companion question ob-prenatal-care-normal-pregnancy-56 keys the same wholesale-switch framing ("Warfarin should be transitioned to a pregnancy-compatible anticoagulant") in another mechanical mitral valve patient.

**Evidence.** CONCEPT: "Anticoagulation in pregnancy should be managed with heparin or low-molecular-weight heparin, which do not cross the placenta."

**Fix.** Keep the keyed answer (nasal hypoplasia + stippled epiphyses is correct). Rewrite the concept's management sentence to: "Anticoagulation is switched to heparin/LMWH in most pregnancies, but a mechanical heart valve is a major exception — warfarin is recommended in the 2nd/3rd trimesters, and 1st-trimester options are continued warfarin (dose ≤5 mg/day) or dose-adjusted LMWH with anti-Xa monitoring, in co-management with cardiology." Either add the same caveat to Q56's concept, or change both stems to a non-valvular warfarin indication (e.g. prior VTE) so the simple switch answer is actually correct.

### `batch-03 coverage gap (Labor & Delivery + Postpartum)` - medium / other
**Problem.** Several high-frequency shelf topics in this domain have no question at all, while duplicated items consume the slots. Most conspicuous: amniotic fluid embolism (sudden intrapartum hypoxia + cardiovascular collapse + DIC) appears nowhere in 72 questions; perineal laceration classification/OASIS repair and its sequelae appear only as a throwaway distractor phrase; operative vaginal delivery is used as a distractor 6+ times but never as the subject of a question (indications, station/dilation prerequisites, vacuum vs forceps morbidity — cephalohematoma/subgaleal vs facial nerve/third-fourth-degree tear).

**Evidence.** Perineal laceration appears only as "26-year-old with BMI 24 after vaginal delivery complicated by a first-degree perineal laceration" (ob-postpartum-20 option E); operative vaginal delivery appears only as excluded distractors, e.g. "Forceps delivery requires a fully dilated cervix (10 cm) and an engaged fetal head" (ob-labor-delivery-3 option D)

**Fix.** Add at minimum: (1) amniotic fluid embolism — abrupt hypoxia/hypotension/DIC at delivery, keyed to supportive resuscitation + massive transfusion, distinguished from pulmonary embolism, eclampsia and abruption; (2) perineal laceration degrees with 3a/3b/3c-4th classification and layered sphincter repair + laxative/antibiotic aftercare; (3) an operative-vaginal-delivery item testing prerequisites (complete dilation, engaged head ≥+2, known position, adequate anesthesia) and vacuum vs forceps neonatal/maternal complications; (4) placenta accreta spectrum delivery planning (36 0/7-37 6/7 cesarean-hysterectomy, no placental removal); (5) a PPH item testing quantitative blood loss thresholds and the 3-hour TXA window.

### `batch-05-gyn-repro (coverage gap)` - medium / other
**Problem.** Four commonly tested, clinically consequential items in these four domains are absent from all 101 questions. (1) Acute heavy AUB: no question anywhere on management of hemodynamically significant menstrual bleeding — no IV conjugated estrogen, no high-dose OCP/progestin taper, and tranexamic acid appears zero times in the batch despite being a first-line non-hormonal HMB therapy. (2) Bleeding-disorder screening in adolescents with heavy menstrual bleeding: 'von Willebrand' appears once, only as a distractor to be dismissed ('the vignette specifies no signs of a bleeding disorder'), so students learn to rule VWD out and never learn that ACOG recommends screening adolescents with HMB because ~20% have an underlying coagulopathy. (3) Post-EC follow-up rules: 16 mentions of ulipristal but nothing on the 5-day delay required before starting/resuming a progestin-containing method after UPA (progestin blunts UPA efficacy), and no quick-start counselling at all. (4) IUD troubleshooting: nothing on pregnancy with an IUD in situ, non-visible strings, expulsion, or the perforation/expulsion risk figures used in real counselling.

**Evidence.** grep over the batch file: tranexamic = 0 hits, "quick start" = 0, "strings" = 0, "oophorectomy" = 0; "von Willebrand" = 1 hit, in ob-menstrual-disorders-4 option D rationale: "While bleeding disorders should be considered in adolescents with heavy menstrual bleeding, the vignette specifies no signs of a bleeding disorder, making anovulation the more likely answer here."

**Fix.** Add four questions: (a) adolescent with HMB since menarche, epistaxis/post-dental bleeding -> screen with CBC, PT/PTT, VWF antigen/activity, ristocetin cofactor, factor VIII; (b) acute severe AUB with Hb 6.8 and tachycardia -> IV conjugated estrogen (or high-dose OCP taper) plus resuscitation, with tranexamic acid as the non-hormonal option and its contraindication with combined OCPs noted; (c) woman given ulipristal today asking when to start her pill/implant -> wait 5 days, use barrier until then; (d) positive pregnancy test with an IUD in place -> locate the IUD, exclude ectopic, remove if intrauterine pregnancy is continuing.

### `ob-benign-gynecology-20` - medium / false-concept
**Problem.** The concept and discriminator attribute a 'globular'/'smooth' uterus to subserosal leiomyomas. That is the classic descriptor for adenomyosis, and the bank itself uses it that way elsewhere (ob-benign-gynecology-2). Subserosal fibroids produce an irregular, lumpy, asymmetrically contoured uterus — as this very stem states. Teaching 'globular = subserosal fibroid' corrupts a high-yield exam discriminator.

**Evidence.** CONCEPT: 'subserosal fibroids cause bulk/pressure symptoms with a globular uterus and typically no bleeding.' DISCRIMINATOR: '...an enlarged smooth/globular contour without cavity distortion (subserosal)...' vs the same stem: 'Pelvic exam reveals an enlarged, irregularly contoured uterus.'

**Fix.** Replace 'globular' with 'irregular/nodular contour' in the concept and discriminator of this question, reserving 'diffusely enlarged, globular, boggy' for adenomyosis.

### `ob-breast-disorders-2` - medium / outdated-guideline
**Problem.** The rationale states as established fact that risk-reducing salpingo-oophorectomy lowers breast cancer risk via decreased estrogen exposure. The early ~50% breast-risk-reduction estimates were confounded by immortal-time and selection bias; prospective cohort analyses have not shown a significant breast cancer risk reduction from RRSO in BRCA1 carriers, and current counselling does not present RRSO as a breast-cancer risk-reduction strategy. Same claim is repeated in the RULES of ob-breast-disorders-13.

**Evidence.** Rationale A: 'lowering both ovarian cancer risk (~80-90%) and breast cancer risk (via decreased estrogen exposure) in BRCA carriers.' ob-breast-disorders-13 RULES: '...risk-reducing bilateral salpingo-oophorectomy (typically by age 35-40) to reduce ovarian cancer risk and breast cancer risk via reduced estrogen exposure.'

**Fix.** Restrict the claim to ovarian/tubal cancer (80-90% risk reduction plus an all-cause mortality benefit) and state that a breast-cancer risk-reduction effect of RRSO is not established, particularly for BRCA1; risk-reducing mastectomy is the intervention for breast risk.

### `ob-cervical-dysplasia-screening-10` - medium / false-rationale
**Problem.** The rationale and discriminator assert that HPV status is irrelevant to HSIL management. Under ASCCP 2019 risk-based management, HPV result changes the preferred pathway: HPV16-positive HSIL carries an immediate CIN3+ risk >60%, so expedited (see-and-treat) excision is PREFERRED, whereas HPV-negative HSIL carries roughly a 25% immediate risk, where colposcopy is preferred and expedited treatment is not. Expedited treatment is also not recommended under age 25 or in pregnancy.

**Evidence.** Rationale C: 'HPV status does not change management of HSIL; action is required regardless of HPV result.' DISCRIMINATOR: 'Unlike ASC-US/LSIL, HSIL management does not depend on HPV status — it always triggers colposcopy or immediate excision.'

**Fix.** Reword to: HSIL always requires colposcopy or excision (never repeat cytology), but HPV genotype modulates which is preferred — expedited excision preferred for HPV16-positive HSIL, colposcopy preferred if HPV-negative, and colposcopy (not expedited treatment) for patients <25 or pregnant.

### `ob-cervical-dysplasia-screening-11` - medium / two-defensible-answers
**Problem.** For LSIL cytology with a lesion extending into the canal and an unsatisfactory colposcopy, the guideline-directed step is endocervical sampling (ECC/endocervical brush), not a diagnostic cone. Going straight to cold-knife conization for LSIL is overtreatment in a 32-year-old (cervical insufficiency/preterm birth risk), and even when excision is indicated ASCCP considers LEEP and CKC equivalent options, with CKC preferred specifically when adenocarcinoma in situ or microinvasion is suspected — neither of which is present here.

**Evidence.** STEM: 'A 32-year-old woman undergoes colposcopy for LSIL, but the entire squamocolumnar junction cannot be visualized due to the lesion extending into the endocervical canal.' KEYED A: 'Cold-knife cone biopsy'; rationale B: 'LEEP can distort or thermally damage the specimen margins.'

**Fix.** Change the stem to a setting where diagnostic excision is genuinely indicated (e.g. HSIL cytology or AGC/suspected adenocarcinoma in situ with an unsatisfactory colposcopy), or add 'endocervical curettage/endocervical sampling' as the keyed option for LSIL with endocervical extension.

### `ob-early-pregnancy-complications-6` - medium / false-concept
**Problem.** The discriminator calls a β-hCG of 2200 'below the discriminatory zone' while the concept defines that zone as 1500-3500 mIU/mL — 2200 sits inside the stated range, so the stated reasoning is self-contradictory. Compounding this, the paired question -7 lists rules in which above-zone and below-zone hCG lead to the identical action ('repeat β-hCG + TVUS in 2 days' vs 'repeat β-hCG in 2 days'), so the discriminatory-zone concept the pair is built on teaches no actionable distinction.

**Evidence.** CONCEPT: 'Below the β-hCG discriminatory zone (roughly 1500-3500 mIU/mL, assay-dependent)…'; DISCRIMINATOR: 'The β-hCG level (2200) is below the discriminatory zone, so a visualized empty uterus cannot yet distinguish early normal pregnancy from ectopic/nonviable pregnancy.'

**Fix.** Commit to a single threshold (ACOG favors ~3500 to avoid interrupting viable pregnancies) and say '2200 is below the 3500 threshold.' In -7, make the rules genuinely different: below threshold -> serial hCG/TVUS; above threshold with empty uterus -> pregnancy of unknown location, serial hCG plus consideration of uterine aspiration or presumptive ectopic treatment once a nonviable pattern is documented. Also replace -7's discriminator, which invokes hemodynamic stability — a variable that does not differ across any of its five options.

### `ob-early-pregnancy-complications-9` - medium / false-concept
**Problem.** The concept lists IUD use as a major risk factor for ectopic pregnancy. This is a well-known misstatement: an IUD markedly reduces the absolute risk of ectopic pregnancy compared with no contraception. What is true is that if pregnancy does occur with an IUD in situ, a higher proportion of those pregnancies are ectopic. As written it will make students counsel patients against LARC for the wrong reason.

**Evidence.** CONCEPT: 'Prior pelvic inflammatory disease, tubal surgery, prior ectopic pregnancy, and IUD use are major risk factors for ectopic pregnancy.'

**Fix.** Replace 'IUD use' with 'prior tubal ligation' or 'assisted reproduction/prior tubal surgery', and add the correction explicitly: 'An IUD lowers absolute ectopic risk; however, a pregnancy conceived with an IUD in place is more likely to be ectopic, so any positive test in an IUD user needs prompt localization.'

### `ob-ethics-social-sciences-17` - medium / false-concept
**Problem.** The teaching text makes a categorical legal claim that is simply untrue. Minor consent to contraception is NOT uniform: roughly half the states explicitly allow all minors to consent, about 20 allow it only in specified circumstances (married, already a parent, health risk, mature minor, certain ages), and a few have no explicit policy. What is uniform is that federally funded Title X clinics must provide confidential contraceptive services to minors. The keyed action is still the best answer, but the absolute wording will teach students a false fact and mis-answer any item that tests state variation — including this bank's own ob-ethics-social-sciences-21, which correctly emphasises state-by-state variation.

**Evidence.** CONCEPT: "Every US state allows minors to consent to contraceptive services without parental knowledge or approval." / keyed D rationale: "minor consent laws uniformly permit adolescents to independently consent to contraceptive care"

**Fix.** Replace with: "Most states explicitly allow minors to consent to contraceptive services, and all Title X-funded clinics must provide confidential contraceptive care to minors; a minority of states permit minor consent only in specified circumstances, so clinicians should know their state law." Soften the keyed rationale to "parental consent is not required for contraceptive services in this setting."

### `ob-ethics-social-sciences-18` - medium / false-concept
**Problem.** Two problems. (1) The concept asserts nationwide minor self-consent for prenatal care; only about two-thirds of states explicitly authorize minors to consent to prenatal care, and some limit it by age or to certain services. (Minor self-consent for STI services genuinely is available in all 50 states + DC — that part is right; the prenatal-care claim is not, and the same overstatement is repeated in ob-ethics-social-sciences-21's concept.) (2) This item is functionally the same question as ob-ethics-social-sciences-16 — same 16-year-old presenting alone for STI testing, same fear of parental discovery, same teaching point and same keyed conclusion — so one of the two is redundant within the bank (a semantic duplicate that string-similarity dedupe would not catch).

**Evidence.** CONCEPT: "minors nationwide can consent to their own diagnosis and treatment for sexually transmitted infections and to pregnancy-related (prenatal) care" (echoed in -21: "minor consent to contraception, STI treatment, and prenatal care is protected nationwide") / duplicate pair — -16 STEM: "A 16-year-old girl presents to clinic alone requesting testing and treatment for a suspected sexually transmitted infection. She explicitly asks that her parents not be informed" vs -18 STEM: "A 16-year-old girl comes to the clinic without a parent and reports she is sexually active and wants to be tested for sexually transmitted infections. She is worried her parents will find out."

**Fix.** Change both concepts to: "All states allow minors to consent to STI diagnosis and treatment; most — but not all — also allow minors to consent to prenatal care, and rules vary by state." Then either delete -18 or repurpose it to a distinct point, e.g. whether an explanation of benefits/insurance statement can breach adolescent confidentiality, or minor consent for HIV testing and PrEP.

### `ob-ethics-social-sciences-8` - medium / false-rationale
**Problem.** The distractor rationale states there is no mechanism to involve public health in partner treatment for chlamydia. That is false: chlamydia is a nationally notifiable condition, cases ARE reported to the health department, and health departments run confidential Partner Services (contact tracing/notification) programs. The wrong element of the distractor is "mandatory treatment," not the existence of reporting or partner services. As written the rationale also directly contradicts this bank's ob-ethics-social-sciences-9, which correctly keys "involve public health partner notification services."

**Evidence.** Option D rationale: "There is no requirement or mechanism to report partner names to authorities for chlamydia treatment."

**Fix.** Rewrite to: "Chlamydia is a reportable condition and health departments do offer confidential partner services, but partners cannot be compelled to accept treatment; EPT is the faster, patient-initiated route when the partner is unlikely to present for care." Optionally add to the concept that EPT is permissible in most but not all states.

### `ob-gynecologic-oncology-21` - medium / false-concept
**Problem.** The concept states yolk sac tumor is the most common ovarian malignancy in children. Dysgerminoma is the most common malignant ovarian germ cell tumor overall and in the pediatric/adolescent population; yolk sac tumor is second. The keyed answer for this stem (markedly elevated AFP) is correct, but the epidemiologic claim in the teaching paragraph is false.

**Evidence.** CONCEPT: 'Yolk sac tumor is the second most common malignant ovarian germ cell tumor and the most common ovarian malignancy in children.'

**Fix.** Change to: 'Yolk sac tumor is the second most common malignant ovarian germ cell tumor (dysgerminoma is the most common, in children as well as adults) and is the germ cell tumor that secretes AFP.'

### `ob-labor-delivery-1` - medium / weak-teaching
**Problem.** The item teaches that ABSENT variability is benign when a sedating drug was recently given. Opioids and magnesium classically cause MINIMAL variability; truly absent variability (undetectable amplitude) is never attributed to medication without evaluation — it is at minimum Category II, mandates assessment for acidemia, and with any recurrent decelerations is Category III. As written, the question conditions students to reassure themselves out of a genuinely abnormal tracing.

**Evidence.** STEM: "absent variability, no accelerations, and no decelerations. The mother received morphine for pain 15 minutes ago"; keyed rationale: "maternal opioids readily cross the placenta and are a well-recognized benign cause of transient absent/minimal fetal variability"

**Fix.** Change the stem to "minimal variability" and the rationale to "opioids, magnesium and benzodiazepines classically produce minimal (not absent) variability." Add to the concept: "Absent variability is never assumed to be drug effect — it is at minimum Category II and requires evaluation for fetal acidemia even when a sedative was just given." Key stays option A.

### `ob-labor-delivery-14` - medium / other
**Problem.** Three of the 42 Labor & Delivery items are the same question: nullipara, 6 cm, ruptured membranes, >200 MVU, no cervical change for 4-5 h, keyed to cesarean, with near-identical distractors (amnioinfusion, forceps, continued observation). That is 7% of the domain spent on one recall fact while core blueprint topics are absent (see the coverage finding).

**Evidence.** ob-labor-delivery-3: "has been at 6 cm cervical dilation with ruptured membranes for the past 5 hours... >200 Montevideo units... no further cervical change"; ob-labor-delivery-4: "cervix has been 6 cm dilated with membranes ruptured for the past 4 hours despite adequate contractions (>200 Montevideo units)"; ob-labor-delivery-14: "active labor at 6 cm dilation with adequate contractions... >200 Montevideo units... has not changed over the past 4 hours"

**Fix.** Keep one (ob-labor-delivery-4 has the best RULES block). Repurpose the other two to untested discriminations: (a) 6 cm, ROM, MVU 150 for 5 h with oxytocin at max — the 6-hour/inadequate-contraction arm of the same ACOG rule; (b) second-stage arrest in a nullipara with an epidural at +2 station — operative vaginal delivery vs cesarean.

### `ob-labor-delivery-21` - medium / outdated-guideline
**Problem.** Maternal supplemental oxygen is presented as a standard component of intrauterine resuscitation in the keyed option itself and in the teaching text of four items in this batch. Randomized and meta-analytic data (Raghuraman et al.) show maternal O2 for Category II tracings does not improve umbilical artery pH or neonatal outcomes, and routine use is no longer recommended. The key is still right, but the bundle taught is out of date.

**Evidence.** Keyed option A: "Intrauterine resuscitation measures (repositioning, IV fluids, stop oxytocin, oxygen)"; CONCEPT: "managed first with intrauterine resuscitation (repositioning, IV fluids, stopping uterotonics, correcting hypotension, oxygen)" — same wording recurs in ob-labor-delivery-11, -15 and -29

**Fix.** Keep option A as the key but drop 'oxygen' from the option text and add to the concept: "The evidence-based components are lateral repositioning, IV crystalloid bolus, discontinuing oxytocin, correcting hypotension (ephedrine/phenylephrine), and considering tocolysis or amnioinfusion. Routine maternal supplemental oxygen has not been shown to improve neonatal outcomes and is no longer recommended as a standard step." Apply the same edit to -11, -15 and -29.

### `ob-labor-delivery-37` - medium / false-concept
**Problem.** The keyed option and the concept both define the McRoberts maneuver as hip flexion PLUS suprapubic pressure. McRoberts is maternal hip hyperflexion/abduction alone; suprapubic (Rubin I) pressure is a separate adjunct added next. The question contradicts its own HELPERR mnemonic, which lists 'Legs/McRoberts' and 'suPrapubic pressure' as distinct steps. Shelf questions do test these as separate maneuvers.

**Evidence.** Option A: "Suprapubic pressure with maternal hip flexion (McRoberts maneuver)"; rationale: "The McRoberts maneuver is the correct first-line intervention: hip flexion combined with suprapubic pressure widens the effective pelvic outlet"; CONCEPT: "The McRoberts maneuver (hip hyperflexion plus suprapubic pressure) is the first-line intervention"

**Fix.** Reword option A to "Maternal hip hyperflexion onto the abdomen (McRoberts maneuver)" and the concept to "McRoberts (hip hyperflexion/abduction) is the first maneuver; if unsuccessful, add suprapubic pressure, then internal rotational maneuvers (Rubin II, Woods screw), delivery of the posterior arm, and Gaskin all-fours. Fundal pressure is contraindicated."

### `ob-labor-delivery-7` - medium / false-concept
**Problem.** 41 weeks is labelled 'post-term' in both the stem and a rationale. Per the ACOG/Reddy gestational-age nomenclature (in use since 2013 and directly testable), 39 0/7-40 6/7 is full term, 41 0/7-41 6/7 is LATE term, and post-term begins at 42 0/7. Teaching 41 weeks as post-term corrupts a definition students are asked to reproduce.

**Evidence.** STEM: "at 41 weeks is being evaluated for labor induction due to post-term pregnancy"; option D rationale: "post-term pregnancy at 41 weeks is itself an indication for delivery"

**Fix.** Change both to "late-term pregnancy." Rationale D should read: "At 41 0/7 weeks (late term) induction is recommended, and delivery is indicated no later than 42 0/7 weeks, so continued weekly expectant management is inappropriate." Key (prostaglandin ripening) is unchanged.

### `ob-medical-complications-of-pregnancy-17` - medium / outdated-guideline
**Problem.** The RULES (repeated verbatim in -16) put the threshold for omitting intrapartum IV zidovudine at <50 copies/mL and mandate IV ZDV for everyone between 50 and 1000. Current DHHS perinatal guidance is that IV ZDV is not required for patients on ART with HIV RNA ≤1000 copies/mL near delivery; it is recommended for RNA >1000 or unknown. The bank's version has students giving IV ZDV to suppressed patients who do not need it, and the option-B rationale states both thresholds in one breath.

**Evidence.** RULES: 'Viral load <1000 copies/mL -> vaginal delivery is appropriate + intrapartum IV zidovudine | Viral load <50 copies/mL with good adherence -> intrapartum IV zidovudine not required'; option B rationale: 'appropriate only when viral load is <1000 (or intrapartum zidovudine can be omitted only if <50 with good adherence)'

**Fix.** Rewrite as: 'HIV RNA >1000 or unknown near delivery -> scheduled cesarean at 38 0/7 weeks + intrapartum IV zidovudine | HIV RNA ≤1000 on ART -> vaginal delivery appropriate, intrapartum IV zidovudine not required.' Apply to both -16 and -17. The keyed answers stay correct.

### `ob-medical-complications-of-pregnancy-18` - medium / false-rationale
**Problem.** Achondroplasia is asserted as a cause of hydrops fetalis via a small thorax and chronic hypoxia, both in a distractor rationale and in the concept's list of nonimmune hydrops etiologies. Achondroplasia is not a recognized cause of nonimmune hydrops and does not cause lethal thoracic restriction; the lethal skeletal dysplasias that can be associated with hydrops are thanatophoric dysplasia and osteogenesis imperfecta type II. Students will memorize a false association from a distractor.

**Evidence.** option E rationale: 'Achondroplasia causes hydrops via a small thorax and chronic hypoxia, but there is no skeletal finding described here'; CONCEPT: 'nonimmune (parvovirus B19, alpha thalassemia major, achondroplasia/skeletal dysplasias, cardiac anomalies)'

**Fix.** Change the distractor to a genuine nonimmune cause (e.g., 'fetal supraventricular tachycardia' or 'thanatophoric dysplasia'), and rewrite the rationale so the reason it is wrong is the absent skeletal/cardiac findings — not a fabricated mechanism. Remove 'achondroplasia' from the concept's etiology list.

### `ob-medical-complications-of-pregnancy-21` - medium / outdated-guideline
**Problem.** The stem's premise is that the drug chosen will 'improve fetal outcomes.' Since PITCHES (Lancet 2019) and the SMFM 2021 consult series, ursodeoxycholic acid is recommended for maternal pruritus but has NOT been shown to reduce stillbirth, meconium passage, preterm birth, or NICU admission. What mitigates fetal risk in ICP is timed delivery and surveillance, not UDCA. As written the question teaches that UDCA protects the fetus.

**Evidence.** STEM: 'Which of the following is the most appropriate treatment to relieve her symptoms and improve fetal outcomes?'; option A rationale: 'ursodeoxycholic acid is the standard first-line treatment for ICP, reducing bile acid levels and symptoms.'

**Fix.** Trim the stem to 'most appropriate treatment for her pruritus,' and add one line to the concept: 'UDCA improves maternal itch and bile acid levels but has not been shown to reduce stillbirth or other adverse perinatal outcomes — fetal risk is addressed by bile-acid-stratified timed delivery, not by UDCA.'

### `ob-medical-complications-of-pregnancy-6` - medium / other
**Problem.** Coverage gap in the hypertension cluster: across these 78 questions, chronic hypertension appears only as a classification item (this one), and there is no question testing when to start or continue antihypertensives in pregnancy. The CHAP trial and the resulting ACOG 2022 practice advisory changed practice — treat chronic hypertension in pregnancy to a target of <140/90 rather than withholding therapy until 160/110 — and this is now a high-yield shelf point. There is also no item on acute treatment of severe-range hypertension (IV labetalol, IV hydralazine, or oral immediate-release nifedipine within 30-60 minutes); -38 keys 'antihypertensives' generically without naming an agent. Two other core NBME medical-complications topics are absent from this batch: hepatitis B perinatal prophylaxis (HBIG plus vaccine to the neonate, maternal antiviral therapy for high viral load) and gestational thrombocytopenia versus ITP.

**Evidence.** ob-medical-complications-of-pregnancy-6 CONCEPT ends at classification: 'Chronic hypertension increases the risk of superimposed preeclampsia.' No item in the batch names labetalol/hydralazine/nifedipine dosing or a BP treatment threshold.

**Fix.** Add (1) a CHAP-era item: chronic hypertension at 12 weeks with BP 146/92 -> start/continue labetalol or nifedipine, target <140/90, avoid ACE inhibitors/ARBs; (2) an acute severe-range item: BP 172/116 -> IV labetalol or hydralazine or oral immediate-release nifedipine within 30-60 minutes, plus magnesium; (3) a hepatitis B vertical-transmission item; (4) a gestational thrombocytopenia vs ITP item. Verify (3) and (4) are not already covered in the prenatal or ID batches before adding.

### `ob-menopause-10` - medium / false-rationale
**Problem.** The concept's closing sentence is factually wrong: swimming is essentially the lowest-fall-risk exercise there is. The reason swimming does not build bone is that it is non-weight-bearing (no mechanical loading), not that it carries a high fall risk — and the distractor's own rationale gets this right, so the concept contradicts the option rationale. Separately, option A's rationale implies the patient smokes, which the stem never states.

**Evidence.** CONCEPT: "In elderly patients with existing osteoporosis, weight-bearing activities that minimize fall risk, such as walking, are preferred over higher-fall-risk activities like swimming." (vs option D rationale: "Swimming... is non-weight-bearing and provides minimal benefit to bone density.")

**Fix.** Delete the fall-risk clause and replace with: "Bone responds to mechanical loading, so weight-bearing and resistance exercise (walking, stair climbing, resistance training) build/preserve BMD, whereas non-weight-bearing exercise such as swimming or cycling does not — even though both benefit cardiovascular fitness. In patients with established osteoporosis, add balance/strength training for fall prevention." Also reword option A's rationale to "she is not described as a smoker, and smoking cessation, while important, is not the loading stimulus bone requires."

### `ob-menstrual-disorders-15` - medium / other
**Problem.** Semantic (not string) duplication that a near-duplicate-stem check would miss, and it is extensive. ob-menstrual-disorders-15 and ob-menstrual-disorders-26 are the same question — newly diagnosed MRKH, 'which additional study', keyed renal ultrasound — with the same concept and the same four distractor themes (karyotype, echo, bone age, hormones). ob-menstrual-disorders-5 and ob-menopause-1 are likewise the same question (28-year-old with Hashimoto, elevated FSH, keyed autoimmune oophoritis). POI diagnosis is separately asked three times (ob-menstrual-disorders-28, ob-menopause-15, ob-menopause-16), and MRKH-vs-AIS discrimination four times (ob-menstrual-disorders-13, -14, -26, -35). That is roughly 10 of 101 slots spent re-testing two facts.

**Evidence.** ob-menstrual-disorders-15 keyed "Renal ultrasound" / rationale "Mullerian and renal (mesonephric-derived urinary tract) development are closely linked embryologically..." vs ob-menstrual-disorders-26 keyed "Renal ultrasound" / rationale "Müllerian agenesis is strongly associated with renal anomalies (e.g., unilateral agenesis, ectopic kidney), so renal ultrasound is the appropriate next screening study."

**Fix.** Retire ob-menstrual-disorders-15 (keep -26, which supplies the karyotype) and retire ob-menstrual-disorders-5 (keep ob-menopause-1, which adds the repeat-FSH and normal-TSH detail). Collapse the three POI-diagnosis items to one diagnosis question plus the existing POI-management question (ob-menstrual-disorders-24). Reallocate the freed slots to the uncovered topics listed in the coverage finding.

### `ob-newborn-neonatal (domain coverage)` - medium / other
**Problem.** Two blueprint-level gaps in the 38-question Newborn & Neonatal set. (1) Universal newborn screening is covered for the metabolic panel and the hearing screen but NOT for pulse-oximetry screening for critical congenital heart disease — the third mandated universal newborn screen, and a high-yield item (timing >=24 hours, right hand and either foot, thresholds, failed screen -> echocardiogram). (2) There is no question anywhere in the batch on the newborn presentation or evaluation of congenital infection — congenital syphilis (incidence rising sharply, and evaluation of the at-risk newborn is heavily tested), congenital CMV, toxoplasmosis, or neonatal HSV. Neonatal HSV in particular is a management question with real mortality stakes.

**Evidence.** Present: ob-newborn-neonatal-29 ("routine newborn metabolic screen"), ob-newborn-neonatal-37 ("fails the initial hearing screen performed by otoacoustic emissions"), ob-newborn-neonatal-6 ("universal newborn screening" for congenital hypothyroidism). Absent: any stem containing pulse oximetry/CCHD screening, congenital syphilis, congenital CMV, or neonatal HSV.

**Fix.** Add at least three items: (a) a CCHD pulse-oximetry screen item (screen at >=24 hours of age, right hand + foot, positive if any reading <90%, or 90-94% or >3% difference on three measurements 1 hour apart -> echocardiogram); (b) a congenital syphilis newborn-evaluation item (nontreponemal titer comparison to the mother, long-bone films, CSF, and when to give 10 days of aqueous penicillin G versus a single benzathine dose); (c) a neonatal HSV item (vesicles/seizures/sepsis-like illness at 1-3 weeks -> IV acyclovir 60 mg/kg/day plus surface and CSF PCR, and the higher risk with primary rather than recurrent maternal infection).

### `ob-newborn-neonatal-12` - medium / other
**Problem.** ob-newborn-neonatal-12 and ob-newborn-neonatal-25 are the same question twice: identical clinical setup (routine newborn erythromycin eye ointment), identical lead-in wording, identical key (gonococcal ophthalmia neonatorum), and overlapping distractors (congenital cataracts appears in both). Two of 38 Newborn items are spent on one recall fact, at the cost of an unrepresented topic.

**Evidence.** -12 STEM: "the newborn receives erythromycin ointment applied to both eyes. This intervention is primarily intended to prevent which of the following?" (keyed "Neonatal conjunctivitis caused by Neisseria gonorrhoeae") vs -25 STEM: "A term newborn receives erythromycin ophthalmic ointment shortly after birth as standard prophylaxis. This intervention is primarily intended to prevent which of the following?" (keyed "Gonococcal ophthalmia neonatorum")

**Fix.** Keep one. Repurpose the other to a management question that is not currently covered, e.g. "mother had untreated gonococcal cervicitis at delivery — what does the asymptomatic newborn need?" (answer: single dose of ceftriaxone prophylaxis, not ointment alone), which also reinforces that ointment does not treat established or systemic infection.

### `ob-newborn-neonatal-27` - medium / false-rationale
**Problem.** The keyed option states a mechanism that is false for an infant of a diabetic mother, and it contradicts its own rationale. Polycythemia in IDM is driven by fetal hyperinsulinemia raising metabolic rate and oxygen consumption, producing relative tissue hypoxia and erythropoietin release; diabetic pregnancies characteristically have LARGE placentas, and "placental insufficiency" is the mechanism of polycythemia in IUGR/preeclampsia, not IDM. A student who correctly rejects "placental insufficiency" in a well-grown macrosomic IDM is penalized for knowing more than the item.

**Evidence.** Keyed option D: "Chronic fetal hypoxia from placental insufficiency stimulates erythropoietin production, leading to increased red cell mass" — while its own rationale says "fetal hyperinsulinemia raises fetal metabolic demand and oxygen consumption, producing relative hypoxia that stimulates erythropoietin"

**Fix.** Reword the keyed option to match the rationale: "Fetal hyperinsulinemia increases metabolic rate and oxygen consumption, producing relative tissue hypoxia that stimulates erythropoietin and increases red cell mass." Reserve "placental insufficiency" for a distractor and have its rationale note that it explains polycythemia in IUGR, not in a macrosomic IDM.

### `ob-pharmacology-15` - medium / outdated-guideline
**Problem.** The concept presents the FDA 2-year boxed warning as the practice rule without the counterbalancing professional-society position. ACOG (Committee Opinion 602 and subsequent guidance) and WHO explicitly state that BMD concerns should NOT restrict initiation or limit duration of DMPA use in adolescents or adults, and that routine DEXA is not indicated, because the loss is largely recovered and no fracture excess is established. As written, the card teaches students to discontinue an effective contraceptive at 2 years, which is the opposite of current guidance.

**Evidence.** CONCEPT: "the FDA carries a boxed warning advising against use beyond 2 years without reassessing risks/benefits, though bone density typically recovers after discontinuation."

**Fix.** Append: "ACOG/WHO: the boxed warning should not limit duration of use or trigger routine DEXA — the BMD loss is largely reversible and no fracture excess is proven; the risks of unintended pregnancy outweigh the theoretical bone risk, so DMPA may be continued beyond 2 years when it is the patient's preferred method."

### `ob-pharmacology-19` - medium / other
**Problem.** Coverage gap across the whole 58-item Pharmacology batch: two of the highest-frequency, guideline-current obstetric drug topics on the NBME shelf are entirely absent — (1) low-dose aspirin 81 mg for preeclampsia prophylaxis (who qualifies by USPSTF/ACOG high- and moderate-risk factors, start 12–28 weeks and ideally before 16 weeks, continue to delivery) and (2) intrapartum GBS chemoprophylaxis (penicillin G first line; the 2019 ACOG penicillin-allergy algorithm — cefazolin for low-risk allergy, clindamycin only if susceptibility-tested, otherwise vancomycin). Neither the aspirin indication nor any GBS agent appears in any of the 58 stems, options, or concepts.

**Evidence.** Nearest coverage is prophylaxis/tocolysis pharmacology only, e.g. ob-pharmacology-19 CONCEPT: "GnRH agonists are used preoperatively to shrink fibroids..."; no stem in the batch contains "aspirin", "penicillin G", or "group B Streptococcus".

**Fix.** Add at least two items: one keying low-dose aspirin 81 mg started at 12–16 weeks for a patient with a qualifying risk profile (e.g. prior preeclampsia, chronic HTN, twins, or ≥2 moderate risk factors), and one keying IV penicillin G with a distractor set that tests the current penicillin-allergy branch (cefazolin vs clindamycin-if-susceptible vs vancomycin).

### `ob-pharmacology-25` - medium / false-rationale
**Problem.** The stem describes isolated loss of deep tendon reflexes with normal respiration, and the rationale plus conceptRule teach that this alone mandates IV calcium gluconate. Standard management of isolated areflexia is to stop (or reduce) the infusion, check a serum magnesium level, and monitor — calcium gluconate is reserved for respiratory depression, hemodynamic compromise, or cardiac toxicity. Reflexively pushing calcium in a preeclamptic patient also transiently reverses seizure prophylaxis, which is not benign. The keyed option is still the best of the five offered (all others are clearly wrong), so this is a rationale/teaching defect rather than a wrong key.

**Evidence.** RULES: "Loss of patellar (deep tendon) reflexes -> stop infusion, check level, give IV calcium gluconate" and keyed rationale: "loss of DTRs signals rising magnesium levels, so the infusion is stopped and calcium gluconate ... is given."

**Fix.** Rewrite the keyed rationale and conceptRule to: "Loss of DTRs = earliest sign of toxicity → stop the infusion and send a magnesium level; give IV calcium gluconate 1 g if there is respiratory depression, hypoventilation, or cardiac instability (or if the level is markedly elevated)." Alternatively, escalate the stem (e.g. respiratory rate 9/min) so that calcium gluconate is unambiguously indicated as written.

### `ob-pharmacology-35` - medium / weak-teaching
**Problem.** This is the bank's only misoprostol-indications item and it teaches the drug as uniformly "versatile" for cervical ripening and labor induction without the single most important safety limit: misoprostol must not be used for cervical ripening/induction in a woman with a prior cesarean or other uterine scar (or with a live fetus in TOLAC) because of markedly increased uterine rupture risk. A student who learns only this card will offer misoprostol to a TOLAC patient.

**Evidence.** CONCEPT: "Misoprostol is a versatile PGE1 analog: it ripens the cervix and induces labor, is combined with mifepristone for medical abortion, and treats postpartum hemorrhage. Unlike carboprost, it is safe to use in patients with asthma."

**Fix.** Add to the concept and a conceptRule: "Prior cesarean / any uterine scar → prostaglandin cervical ripening (misoprostol, dinoprostone) is contraindicated for induction because of uterine rupture risk; use mechanical ripening ± oxytocin instead." Also note tachysystole as the dose-limiting effect.

### `ob-pharmacology-36` - medium / other
**Problem.** Further coverage gaps in this batch on drug classes the shelf tests heavily and where guidance has recently moved: (a) antihypertensive selection in pregnancy — labetalol / hydralazine / oral immediate-release nifedipine for acute severe-range BP, labetalol or nifedipine XL (methyldopa second-line) for chronic therapy, and the post-CHAP treatment threshold of ≥140/90; (b) progestogen and cerclage-era management of preterm birth prevention — vaginal progesterone for a short cervix, with 17-OHP caproate withdrawn from the US market in 2023; (c) gestational diabetes pharmacotherapy — insulin first-line, metformin/glyburide as alternatives with counselling on placental transfer; (d) nausea/vomiting of pregnancy — doxylamine-pyridoxine first line. None of these appear as a question; antihypertensives are mentioned only in passing.

**Evidence.** ob-pharmacology-36 STEM: "Nifedipine is used both as a tocolytic in preterm labor and for acute treatment of severe hypertension in pregnancy. What is its mechanism of action?" — the only reference to antihypertensive therapy in 58 items; no item mentions labetalol, hydralazine, progesterone for preterm birth prevention, insulin/metformin in GDM, or doxylamine-pyridoxine.

**Fix.** Add items keying: labetalol or hydralazine (or oral IR nifedipine) for BP ≥160/110 with the 30–60 minute re-dose logic; a CHAP-era item keying "start antihypertensive therapy at ≥140/90 in chronic hypertension in pregnancy"; vaginal progesterone for incidental short cervix with an explicit note that 17-OHP caproate is no longer marketed in the US; insulin as first-line GDM pharmacotherapy; doxylamine-pyridoxine for NVP.

### `ob-postpartum-23` - medium / other
**Problem.** Two further duplicate clusters in the 30-question Postpartum domain: septic pelvic thrombophlebitis is asked twice with the same key ('add empiric heparin'), and Sheehan syndrome is asked three times (two of them the same recognition question). Six of 30 slots are near-repeats.

**Evidence.** ob-postpartum-22: "continues to spike fevers on day 5 of therapy... reveal no other source" -> "Add empiric heparin anticoagulation"; ob-postpartum-23: "remains febrile on postpartum day 5... imaging shows no abscess" -> "Add empiric therapeutic heparin". ob-postpartum-25: "inability to breastfeed due to absent milk production, fatigue, and amenorrhea" -> Sheehan; ob-postpartum-26: "failure to lactate, fatigue, cold intolerance, and absent menses" -> Sheehan

**Fix.** Keep ob-postpartum-23 and ob-postpartum-26 (each has the better discriminator). Repurpose ob-postpartum-22 to ovarian vein thrombosis imaging vs SPT-of-exclusion, or to postpartum wound infection/necrotizing fasciitis; repurpose ob-postpartum-25 to the acute management priority in Sheehan (stress-dose hydrocortisone BEFORE levothyroxine, to avoid precipitating adrenal crisis) — a genuinely different and higher-yield teaching point.

### `ob-postpartum-28` - medium / false-concept
**Problem.** The atony algorithm inserts tranexamic acid as the step BETWEEN oxytocin and the second-line uterotonics. That is not how PPH is managed: after massage + oxytocin fails, the next pharmacologic step is a second-line uterotonic (methylergonovine, carboprost or misoprostol, chosen by contraindication), with TXA given as an early adjunct within 3 hours of birth — in parallel, not instead of. The bank contradicts itself on this.

**Evidence.** ob-postpartum-28 CONCEPT: "bimanual massage plus oxytocin first, then tranexamic acid, then methylergonovine or carboprost (per contraindications), then mechanical tamponade"; ob-postpartum-30 RULES: "Atony refractory to massage + oxytocin -> tranexamic acid | No hypertension -> methylergonovine may be used" — yet ob-postpartum-30 option B rationale says methylergonovine "would be a reasonable next agent here"

**Fix.** Reorder both to: "massage + oxytocin -> second-line uterotonic (methylergonovine unless hypertensive; carboprost unless asthmatic; misoprostol if both contraindicated) -> intrauterine balloon tamponade / uterine vacuum device -> B-Lynch, uterine artery ligation, hysterectomy. Give TXA 1 g IV as an adjunct within 3 hours of birth, concurrently with the above, not as a substitute for a second uterotonic."

### `ob-prenatal-care-normal-pregnancy-15` - medium / outdated-guideline
**Problem.** Third-trimester syphilis rescreening is presented as risk-based only. ACOG's 2024 Clinical Practice Update on syphilis screening in pregnancy (responding to the congenital syphilis surge) recommends screening ALL pregnant patients three times — at the first prenatal visit, again early in the third trimester, and at birth — not only those with risk factors. Q16's first-visit concept panel also lists syphilis with no mention of repeat screening. As written, the bank teaches a student to skip third-trimester syphilis testing in an average-risk patient.

**Evidence.** RULES: "High-risk patients -> repeat STI screening in third trimester" (and Q16 CONCEPT lists only "infection screening (HIV, hepatitis B/C, syphilis, chlamydia/gonorrhea if indicated)" at the first visit)

**Fix.** Add a rule line: "Syphilis -> screen ALL pregnant patients at first visit, again early in the third trimester, and at birth (universal, not risk-based)." Keep the risk-based rule for chlamydia/gonorrhea, which is still correct.

### `ob-prenatal-care-normal-pregnancy-17` - medium / outdated-guideline **[verified]**
**Problem.** States the GBS screening window as 36-38 weeks in both the option rationale and the RULES block. No current guideline uses 36-38 weeks — ACOG Committee Opinion 797 / CDC specify 36 0/7 to 37 6/7 weeks (the old window was 35-37). This also directly contradicts question ob-prenatal-care-normal-pregnancy-22 in the same batch, which correctly keys "At 36 to 37 weeks gestation" and whose concept correctly says 36 0/7 to 37 6/7. A student answering both will get conflicting numbers from the same bank.

**Evidence.** rationale B: "Incorrect: GBS culture is performed at 36-38 weeks gestation, not at the first prenatal visit." and RULES: "36-38 weeks -> GBS vaginal/rectal culture"

**Fix.** Change both instances of "36-38 weeks" to "36 0/7 to 37 6/7 weeks" to match Q22.

### `ob-prenatal-care-normal-pregnancy-2` - medium / weak-teaching
**Problem.** Q2, Q3 and Q12 are functionally the same item tested three times: the same patient (early-30s woman, chronic hypertension, on lisinopril, preconception counseling), the same key (switch to a pregnancy-safe agent before conception), and an overlapping distractor set including the identical implausible "switch to warfarin for blood pressure control" option in all three. Q5 (atenolol) and Q49 (which agent is safe) make five of 57 items in this domain on the same teaching point. Q16 and Q17 likewise share a stem (first prenatal visit, 8 weeks) and the same key (blood type/Rh + indirect Coombs), with Q27 keying indirect Coombs a third time; Q13/Q42 duplicate the elevated-AFP item and Q39/Q41 duplicate preconception obesity. This is not string-level duplication (so the dedup pass missed it) but it consumes roughly a quarter of the domain's item budget on four teaching points.

**Evidence.** Q2 STEM "A 33-year-old woman with chronic hypertension controlled on lisinopril presents for preconception counseling" / Q3 STEM "A 32-year-old woman with chronic hypertension controlled on lisinopril presents for preconception counseling" / Q12 STEM "A 34-year-old woman with chronic hypertension controlled on lisinopril presents for preconception counseling" — all three list "Switch to warfarin for blood pressure control" as a distractor.

**Fix.** Collapse Q2/Q3/Q12 into one item and repurpose the two freed slots. High-yield prenatal content currently absent from this batch: timing/indications for low-dose aspirin preeclampsia prophylaxis in a chronic-hypertension or prior-preeclampsia patient (12-16 weeks), universal hepatitis C screening each pregnancy, third-trimester syphilis rescreening, first-line pharmacotherapy for nausea/vomiting of pregnancy (doxylamine-pyridoxine), and interpretation of a low-fetal-fraction or no-call cfDNA result. Similarly merge Q16/Q17 and Q13/Q42.

### `ob-prenatal-care-normal-pregnancy-32` - medium / false-rationale
**Problem.** Inhibin A is characteristically NORMAL (unchanged) in trisomy 18, not decreased. The classic quad-screen pattern is T18 = low AFP, low estriol, low hCG, normal inhibin A. The bank asserts "all four decreased" in three separate places (option A rationale, concept, RULES) and builds the DISCRIMINATOR on it, so a student who later meets a stem with low AFP/low estriol/low hCG/NORMAL inhibin A will be primed to reject trisomy 18.

**Evidence.** rationale A: "Trisomy 18 classically shows all four analytes decreased (low AFP, low estriol, low hCG, low inhibin A)"; RULES: "Low AFP + low estriol + low hCG + low inhibin A -> trisomy 18"; DISCRIMINATOR: "...(elevated in trisomy 21 vs decreased in trisomy 18)"

**Fix.** Correct all three to: T18 = ↓AFP, ↓estriol, ↓hCG, inhibin A normal. Reword the discriminator to "hCG and inhibin A are both elevated in trisomy 21, whereas in trisomy 18 hCG is low and inhibin A is normal."

### `ob-prenatal-care-normal-pregnancy-42` - medium / underspecified-stem
**Problem.** MSAFP is reported and interpreted in multiples of the median (MoM), never as a multiple of an upper limit of normal. "2.5 times the upper limit of normal" is not a real reportable result and, taken literally, would be a far more extreme elevation than the 2.0-2.5 MoM cutoff the question is actually about. The parallel question ob-prenatal-care-normal-pregnancy-13 states this correctly ("2.6 times the median for gestational age"), which shows the intended value.

**Evidence.** STEM: "a quad screen that shows an alpha-fetoprotein level 2.5 times the upper limit of normal, with normal beta-hCG, estriol, and inhibin A"

**Fix.** Change to "an alpha-fetoprotein level of 2.5 multiples of the median (MoM) for gestational age." Also consider merging this item with Q13, which is the same scenario (16 weeks, isolated elevated AFP) with the same key (ultrasound to confirm dating).

### `ob-prenatal-care-normal-pregnancy-49` - medium / outdated-guideline
**Problem.** Labels methyldopa a "preferred" agent for pregnancy. Current ACOG guidance (Practice Bulletin 203 and the 2022 CHAP-era update) makes labetalol and extended-release nifedipine the first-line agents; methyldopa is a weaker antihypertensive relegated to alternative/second-line status. Keying methyldopa is fine given the distractors (all four others are genuinely contraindicated or non-first-line), but the rationale and concept should not present it as preferred — elsewhere in this same batch (Q2, Q5, Q12) labetalol/nifedipine are correctly called the preferred agents.

**Evidence.** rationale E: "Correct: methyldopa has an extensive history of safe use in pregnancy and is a preferred preconception/pregnancy agent."

**Fix.** Reword to: "Correct: methyldopa has a long record of safe use in pregnancy and can be continued, though labetalol and extended-release nifedipine are the current first-line agents." Adjust the concept to rank labetalol/nifedipine first-line and methyldopa as an alternative.

### `ob-repro-18` - medium / false-rationale
**Problem.** The key (lifestyle modification) is defensible, but the rationale given for the combined-OCP distractor teaches sequencing that contradicts guidelines. The 2023 International Evidence-Based Guideline for PCOS recommends lifestyle intervention for all patients with excess weight AND names the COC as first-line pharmacologic therapy for irregular cycles and hyperandrogenism — pharmacotherapy is started concurrently, never deferred until weight loss has been achieved. Telling a student OCPs come "after" weight loss risks a real patient going untreated (and unprotected endometrially) while waiting on weight loss that mostly does not happen.

**Evidence.** Option C rationale: "OCPs are appropriate for menstrual regulation and endometrial protection but are used after or alongside weight loss, not before it, in patients not seeking pregnancy."

**Fix.** Change the option C rationale to: "A combined OCP is in fact the first-line PHARMACOLOGIC therapy for her irregular cycles and acne and should be offered at the same visit; the question asks for the single first-line intervention, and lifestyle modification is recommended for every patient with PCOS and elevated BMI — the two are started together, not in sequence." Optionally tighten the stem to "most appropriate initial non-pharmacologic intervention" to remove the ambiguity entirely.

### `ob-repro-19` - medium / false-concept
**Problem.** The concept states the causal chain backwards and incoherently. Insulin resistance in PCOS is not "driven by abnormal GnRH pulsatility"; the accepted model is the reverse direction — intrinsic insulin resistance/hyperinsulinaemia amplifies LH-driven theca-cell androgen production and lowers SHBG (raising free testosterone), while increased GnRH/LH pulse frequency is a separate, parallel abnormality. As written it teaches a fictitious mechanism in the one question dedicated to PCOS metabolic pathophysiology.

**Evidence.** CONCEPT: "PCOS is fundamentally a state of insulin resistance driven by abnormal GnRH pulsatility and excess LH-driven androgen production."

**Fix.** Rewrite as: "PCOS combines increased GnRH/LH pulse frequency (driving theca-cell androgen production) with insulin resistance that is largely independent of, and additive to, the neuroendocrine defect — hyperinsulinaemia potentiates ovarian androgen output and lowers SHBG, raising free testosterone. Because insulin resistance is intrinsic and not corrected by treating the cycles, all patients need OGTT/A1c and lipid screening at diagnosis regardless of fertility plans."

### `ob-sexual-health-assault-2` - medium / other
**Problem.** The stem plants a clue that argues against the keyed answer, and the single option a well-prepared student would want is absent. "Does not desire ongoing contraception" is the standard signal to pick an oral agent — and for BMI >30 that agent is ulipristal acetate, which the keyed rationale itself names as superior to levonorgestrel but which is not offered. A student who reasons "obese, 60 hours, no interest in ongoing contraception, therefore ulipristal" finds nothing to choose and is forced into a 10-year intrauterine device inserted acutely after an assault. Copper IUD is still the most effective option present, so the key is survivable, but the item is engineered against its own best reasoning.

**Evidence.** STEM: "She wants the most effective option available and does not desire ongoing contraception" / keyed A rationale vs option C rationale: "Levonorgestrel efficacy declines significantly in patients with elevated BMI and is less effective than ulipristal acetate or the copper IUD in this setting"

**Fix.** Either (a) delete "and does not desire ongoing contraception" and replace it with "and would also like long-term contraception," keeping the copper IUD keyed; or (b) add ulipristal acetate 30 mg as an option, drop the Yuzpe distractor, and key ulipristal — with a rationale noting the copper IUD is the single most effective method but requires accepting an intrauterine device. If (b), keep the teaching point that levonorgestrel is the weakest choice at BMI >30 and note that the 52 mg levonorgestrel IUD is also now an evidence-supported EC option.

### `ob-sexual-health-assault-6` - medium / outdated-guideline
**Problem.** The keyed follow-up schedule is the pre-2016 one. With current-generation HIV antigen/antibody assays, CDC nPEP guidance (2016, carried into the 2021 STI treatment guidelines) recommends follow-up HIV testing at baseline, 4-6 weeks, and 3 months after exposure; routine 6-month testing was dropped. Keying a 6-month test teaches an obsolete interval and also implies the 3-month test is not conclusive.

**Evidence.** Keyed option C: "Repeat HIV testing at 6 weeks, 3 months, and 6 months, along with a follow-up pregnancy test in 2-3 weeks" / CONCEPT: "repeat HIV testing at 6 weeks, 3 months, and 6 months"

**Fix.** Change the keyed option and concept to: "Baseline HIV Ag/Ab testing at presentation, repeated at 4-6 weeks and 3 months, plus syphilis serology at 4-6 weeks and 3 months and a pregnancy test in 2-3 weeks." Add a line noting 6-month testing is no longer routine with 4th-generation assays.

### `ob-contraception-17` - low / false-rationale
**Problem.** The stated window for combined pills is wrong. A combined OCP dose is considered late (not missed) up to 24 hours, and standard counselling/ACOG-CDC guidance uses a 24-hour window with backup only after >=48 hours have elapsed; "~12 hours" is not a recognised figure. Separately, the ~3-hour rule applies to norethindrone/norgestrel POPs but not to the drospirenone-only pill (24-hour window), which is now widely prescribed — worth a clause so students do not over-generalise.

**Evidence.** Option C rationale: "It is combined pills that have the more forgiving ~12-hour window; progestin-only pills have a stricter ~3-hour window, the reverse of this statement."

**Fix.** Change "~12-hour window" to "~24-hour window (a combined pill is 'late' up to 24 h; backup is needed once a dose is >=48 h overdue)". Add to the concept: "The ~3-hour rule applies to norethindrone/norgestrel POPs; the drospirenone-only pill has a 24-hour window."

### `ob-contraception-19` - low / false-rationale
**Problem.** The claim that estrogen-containing pills reduce breastmilk PROTEIN content is a dated assertion not supported by current evidence — the reproducible effect of combined hormonal contraception on lactation is a reduction in milk VOLUME (and even that is inconsistent once lactation is established). The same claim is repeated in the concept, so the error is taught twice.

**Evidence.** Option A rationale: "Estrogen-containing pills decrease breastmilk protein content and milk supply and are contraindicated before 6 weeks postpartum." CONCEPT: "Estrogen-containing contraceptives reduce breastmilk supply and protein content..."

**Fix.** Drop "protein content" from both places: "Estrogen-containing methods may reduce milk volume and, more importantly, are US MEC Category 4 at <21 days and Category 3 at 21-42 days postpartum because of VTE risk; progestin-only methods have no adverse effect on lactation and can be started immediately postpartum."

### `ob-early-pregnancy-complications-2` - low / false-rationale
**Problem.** The stem equates malignant GTN with choriocarcinoma, then the keyed rationale answers with the persistent-GTD figure. Roughly 15-20% of complete moles progress to persistent GTD (largely invasive mole); only about 2-3% develop choriocarcinoma. The direction of the answer is unaffected, but the numbers are attached to the wrong entity.

**Evidence.** STEM: 'her risk of subsequent malignant gestational trophoblastic neoplasia (choriocarcinoma)'; keyed rationale: 'conferring a meaningfully higher risk (roughly 15-20%) of progressing to persistent or malignant GTN compared to partial moles (a few percent).'

**Fix.** Drop '(choriocarcinoma)' from the stem, or split the figures in the rationale: '~15-20% of complete moles develop persistent GTD, of which choriocarcinoma accounts for ~2-3%; partial moles progress in ~1-5%.'

### `ob-gynecologic-infections-stis-14` - low / weak-teaching
**Problem.** Keying RPR/VDRL as the 'most appropriate initial diagnostic test' for a chancre present only two weeks after exposure is a partial truth: nontreponemal tests are non-reactive in roughly 20-30% of primary syphilis cases, and direct detection of the lesion (darkfield microscopy or lesion PCR) is the definitive test. The teaching also omits that most labs now use the reverse-sequence algorithm (treponemal immunoassay first).

**Evidence.** KEYED C rationale: 'RPR/VDRL is the correct initial screening test for suspected syphilis presenting as a chancre.' CONCEPT: 'Diagnosis begins with a nontreponemal screening test (RPR/VDRL) and is confirmed with a treponemal test (FTA-ABS).'

**Fix.** Add to the concept that a negative RPR/VDRL does not exclude primary syphilis (repeat in 2-4 weeks or treat empirically) and that darkfield microscopy or PCR of the lesion is confirmatory; mention reverse-sequence (treponemal-first) testing as the common laboratory algorithm.

### `ob-gynecologic-oncology-16` - low / underspecified-stem
**Problem.** The stem itself supplies a markedly elevated serum testosterone, which is the marker actually used to follow a virilizing Sertoli-Leydig cell tumor after resection, but testosterone is not among the options. Inhibin is a validated marker for granulosa cell tumors and is only variably produced by Sertoli-Leydig tumors, so the keyed 'Inhibin B' is the best of the five rather than the genuinely best marker.

**Evidence.** STEM: 'Serum testosterone is markedly elevated. Which tumor marker is most useful for monitoring this tumor after resection?' KEYED E rationale: 'Inhibin is produced by sex cord-stromal tumors (both granulosa and Sertoli-Leydig cell tumors) and is used to monitor for recurrence.'

**Fix.** Either add 'serum testosterone' as the keyed option, or reword the lead-in to 'which of the following serum markers is characteristic of sex cord-stromal tumors' so inhibin is unambiguously correct; note in the concept that testosterone is followed in virilizing Sertoli-Leydig tumors and inhibin/AMH in granulosa cell tumors.

### `ob-gynecologic-oncology-6` - low / underspecified-stem
**Problem.** The topic, concept and distractor rationales frame this as endometrial hyperplasia management, but the biopsy result given is 'proliferative endometrium,' which is a normal (non-hyperplastic) finding. The stem also describes a 47-year-old with oligomenorrhea as wishing to 'preserve fertility,' which sits oddly with the keyed rationale. The keyed cyclic progestin is still the best answer, but the histology and the teaching do not match.

**Evidence.** STEM: '...endometrial biopsy... shows proliferative endometrium without atypia. She wishes to preserve fertility.' CONCEPT: 'Chronic anovulation... can progressively drive endometrial proliferation toward hyperplasia.' Rationale E: 'not first-line for simple proliferative changes from anovulation.'

**Fix.** Either change the biopsy result to 'endometrial hyperplasia without atypia' (matching the topic and concept, where cyclic progestin or a levonorgestrel IUD is first-line with 3-6 month repeat biopsy), or relabel the topic/concept as anovulatory AUB management. Consider adding the levonorgestrel IUD as the preferred option if the histology is changed to hyperplasia.

### `ob-labor-delivery-26` - low / false-rationale
**Problem.** The rationale for the C6-C7 distractor is factually wrong and teaches nothing. Klumpke palsy is C8-T1; C6-C7 is not 'Klumpke-adjacent' — C7 belongs to the upper/middle plexus, and C5-C7 involvement is 'extended Erb' palsy (adds wrist-drop/finger extension weakness). The rationale also amounts to 'the tested answer is the other one', which is circular. Separately, the stem says 'pronated at the wrist'; pronation occurs at the forearm.

**Evidence.** Option B rationale: "C6-C7 is closer to Klumpke-adjacent levels but the classic Erb-Duchenne pairing tested is specifically C5-C6."

**Fix.** Replace with: "C6-C7 is not the classic Erb distribution; C5-C6 (± C7) is. Isolated C7 involvement would add loss of wrist and finger extension (wrist-drop), which is not described. Klumpke palsy is C8-T1." Change the stem to "adducted, internally rotated, with the forearm pronated and wrist flexed."

### `ob-medical-complications-of-pregnancy-10` - low / false-rationale
**Problem.** The stated reason insulin is preferred in GDM is wrong. Insulin is first-line because it does not cross the placenta, whereas metformin and glyburide both do and long-term offspring data are limited; ease of peripartum titration is not the rationale in any guideline. The sentence is also an orphan — it has nothing to do with interpreting the 3-hour OGTT this question asks about.

**Evidence.** CONCEPT: 'Insulin is preferred for management because doses can be more easily titrated around labor compared with oral agents.'

**Fix.** Replace with: 'Insulin is the preferred pharmacotherapy when nutritional therapy fails, because it does not cross the placenta; metformin and glyburide both cross and are second-line.' Also reconcile the threshold operator — this question's rules say 'fasting >95' while -12 says 'fasting ≥95'; Carpenter-Coustan is met when a value meets or exceeds threshold.

### `ob-menopause-6` - low / weak-teaching
**Problem.** A rationale defends the key by appealing to the exam rather than to the clinical fact, which tells the student the answer is a test artefact and leaves the real nuance unlearned. The keyed answer is correct (prior unprovoked VTE is a contraindication to systemic HT), but the reason transdermal is not the answer should be stated substantively.

**Evidence.** Option D rationale: "Although transdermal estrogen carries somewhat lower VTE risk than oral estrogen, a personal history of VTE is still considered a contraindication to systemic hormone therapy of any route at the shelf-exam level."

**Fix.** Replace with: "Transdermal estradiol bypasses first-pass hepatic synthesis of clotting factors and carries a lower VTE risk than oral estrogen, but a prior unprovoked VTE remains a contraindication to systemic HT; transdermal therapy is considered only in selected, highly symptomatic patients on continued anticoagulation and in consultation with a menopause specialist — it is not the appropriate answer for initial management here."

### `ob-pharmacology-1` - low / outdated-guideline
**Problem.** The window is taught as a flat "24-34 weeks" and option B (20-23 weeks) is dismissed as "before the standard window of proven benefit." Current ACOG guidance is 24 0/7–33 6/7 weeks, AND explicitly states that a single course may be considered at 22 0/7–23 6/7 weeks when delivery is anticipated within 7 days and the family opts for neonatal resuscitation. The card also omits the periviable nuance and the rescue-course rule (≥14 days since first course, <34 weeks).

**Evidence.** Option B rationale: "Still generally before the standard window of proven benefit." / CONCEPT: "The classic window of benefit is 24-34 weeks gestation..."

**Fix.** State the window as 24 0/7–33 6/7 weeks; amend option B's rationale to "a course may be CONSIDERED at 22 0/7–23 6/7 weeks if delivery is expected within 7 days and resuscitation is planned, but 24–33 6/7 weeks is the window of established benefit." Add a conceptRule for the rescue course and for the selective late-preterm (34 0/7–36 6/7) indication.

### `ob-pharmacology-43` - low / outdated-guideline
**Problem.** The keyed answer (progestin-only pill preferred in breastfeeding) is still the best option, but the stated reason is dated. Current CDC US MEC and WHO reviews conclude the evidence that combined hormonal contraception meaningfully reduces milk volume is weak; the operative reason CHC is restricted early postpartum is VTE risk, graded by time since delivery (<21 days = category 4; 21–29 days = 3 breastfeeding; ≥30 days = 2). Teaching "estrogen suppresses milk" as the whole story leaves students unable to answer the far more commonly tested postpartum-timing question.

**Evidence.** Keyed rationale: "Correct: avoiding estrogen preserves milk supply, making the minipill the preferred oral option while breastfeeding." / CONCEPT: "The progestin-only pill avoids estrogen's suppressive effect on lactation..."

**Fix.** Keep the key but add to the concept/conceptRule: "Progestin-only methods can be started immediately postpartum; combined hormonal contraception is US MEC 4 at <21 days postpartum (VTE risk), 3 at 21–29 days if breastfeeding, and 2 thereafter — the lactation-volume effect is considered small/uncertain, and the VTE timing rule is the dominant consideration."

### `ob-pharmacology-50` - low / weak-teaching
**Problem.** The concept opens by calling ACE inhibitors/ARBs "safe in the first trimester," which — even with the qualifier — is a misleading lead for a study card. First-trimester exposure data are conflicting (signals for cardiovascular and CNS malformations, largely but not entirely attributable to confounding by chronic hypertension), and both labeling and ACOG advise discontinuation as soon as pregnancy is recognised, with preconception switching preferred in reproductive-age women.

**Evidence.** CONCEPT: "ACE inhibitors and ARBs are safe in the first trimester regarding this specific fetopathy but must be stopped once pregnancy is confirmed..."

**Fix.** Rewrite as: "The classic fetopathy is a 2nd/3rd-trimester effect, but first-trimester safety is not established (conflicting malformation signals), so ACE inhibitors/ARBs should be switched preconception in reproductive-age women and stopped as soon as pregnancy is recognised; substitute labetalol or nifedipine XL."

### `ob-pharmacology-55` - low / false-concept
**Problem.** The concept mislabels terbutaline's receptor pharmacology. Terbutaline IS a beta-2 selective agonist; its cardiac effects come from incomplete selectivity at the high doses used for tocolysis plus beta-2-mediated peripheral vasodilation causing reflex tachycardia. Calling it "non-selective for beta-2 over beta-1" is factually wrong and conflicts with ob-pharmacology-54, which correctly frames it as a beta-2 agonist with dose-related cardiac toxicity.

**Evidence.** CONCEPT: "Its non-selectivity for beta-2 over beta-1 receptors accounts for its cardiac side effects."

**Fix.** Replace with: "Terbutaline is beta-2 selective, but selectivity is incomplete at tocolytic doses; combined with beta-2-mediated vasodilation and reflex sympathetic activation, this produces maternal tachycardia, palpitations, hyperglycemia, hypokalemia, and (rarely) pulmonary edema or myocardial ischemia."

### `ob-pharmacology-9` - low / false-rationale
**Problem.** In a question whose entire point is correct US MEC categorisation, the conceptRule miscategorises the comparator: for combined hormonal contraception, age is US MEC category 1 from menarche to <40 years and category 2 only at ≥40. A 36-year-old nonsmoker with no other risk factors is MEC 1, not MEC 2.

**Evidence.** RULES: "Age >=35 AND current smoker -> COC absolutely contraindicated (MEC 4) | Age >=35, nonsmoker, no other risk factors -> COC generally acceptable (MEC 2)"

**Fix.** Change the second rule to: "Age 35–39, nonsmoker, no other risk factors -> MEC 1; age ≥40 -> MEC 2." Optionally add the smoking gradient explicitly: age ≥35 with <15 cigarettes/day = MEC 3, ≥15 cigarettes/day = MEC 4 (which is why the keyed patient at 15/day is category 4).

### `ob-postpartum-16` - low / outdated-guideline
**Problem.** Atelectasis is keyed as the cause of POD-1 fever. This remains the NBME answer, but the causal claim is not supported by evidence — studies show no association between atelectasis and postoperative fever, which on day 1 is almost always the cytokine (IL-6) response to surgical tissue injury. The rationale hedges with 'classic teaching' but the concept asserts it flatly, so the student learns a false mechanism.

**Evidence.** CONCEPT: "postoperative day 1 favors atelectasis (breath sounds)"; keyed rationale: "Atelectasis is the classic teaching cause of fever within the first 1-2 postoperative days"

**Fix.** Keep atelectasis as the key (it is the exam answer) but add one line to the concept: "Note that atelectasis is a mnemonic association rather than a proven cause — POD-1 fever is usually the inflammatory cytokine response to surgery, and the management (incentive spirometry, ambulation) is the same. It is a diagnosis of exclusion once UTI, endometritis and wound infection are ruled out."

### `ob-prenatal-care-normal-pregnancy-15` - low / false-rationale
**Problem.** The rationale gives the wrong reason for rejecting HPV testing and states two inaccuracies: it implies cervical cancer screening does not apply to pregnant patients (it does — pregnancy is not a reason to defer age-appropriate screening; only endocervical curettage/excision are deferred), and it puts the screening age at "over 30" when primary HPV testing begins at 25 (ACS) / co-testing at 30 (USPSTF). The actual reason HPV testing is wrong for this patient is that she is 19 and below the screening start age of 21/25 entirely.

**Evidence.** rationale C: "HPV DNA testing is part of cervical cancer screening protocols in nonpregnant women over 30, not a standard prenatal infection screen."

**Fix.** Reword to: "HPV DNA testing is a cervical cancer screening tool, not an STI screen, and at age 19 she is below the age at which any cervical cancer screening begins (21 with cytology, or 25 with primary HPV testing). Pregnancy itself does not defer age-appropriate cervical screening."

### `ob-prenatal-care-normal-pregnancy-20` - low / false-concept
**Problem.** The discriminator says early-onset hypertension/proteinuria "excludes preeclampsia." It does not — the hypertension and proteinuria of a molar pregnancy IS a preeclampsia-like syndrome (the classic exception to the after-20-weeks rule, and the reason ACOG notes that preeclampsia before 20 weeks should trigger a search for gestational trophoblastic disease). Teaching "excludes" is a false absolute that will misfire on any stem describing early-onset preeclampsia with a mole or with antiphospholipid syndrome.

**Evidence.** DISCRIMINATOR: "Onset of hypertension/proteinuria before 20 weeks gestation with a large-for-dates uterus excludes preeclampsia and points to molar pregnancy."

**Fix.** Reword to: "Preeclampsia essentially never arises before 20 weeks in an otherwise normal singleton pregnancy — so hypertension and proteinuria before 20 weeks with a large-for-dates uterus should prompt a search for a hydatidiform mole, which is the classic cause of a preeclampsia-like syndrome this early."

### `ob-prenatal-care-normal-pregnancy-24` - low / false-rationale
**Problem.** Internal contradiction about which diagnosis is the one of exclusion, plus a vague threshold. Gestational thrombocytopenia is the diagnosis of exclusion and is conventionally defined as a platelet count ≥100,000/uL (typically 100-150k) appearing in the second half of pregnancy; ITP is distinguished by more severe thrombocytopenia, onset in the first trimester or pre-pregnancy, and a history of bleeding. The distractor rationale assigns "diagnosis of exclusion" to ITP while the concept assigns it to gestational thrombocytopenia, and "remains above roughly 100,000-150,000" is an unusable range (a count of 128,000 is above 100,000 but not above 150,000, so the stated definition does not cleanly capture the stem's own patient).

**Evidence.** rationale D: "...it is a diagnosis of exclusion, less likely than the benign gestational pattern described here." vs CONCEPT: "...when the count remains above roughly 100,000-150,000/uL in an asymptomatic patient... this is a diagnosis of exclusion"

**Fix.** In the concept, state: "platelet count usually ≥100,000/uL (most 100-150,000/uL), arising in the second half of pregnancy." In rationale D, drop "diagnosis of exclusion" and instead say ITP typically produces lower counts, predates pregnancy or appears in the first trimester, and may cause bleeding or neonatal thrombocytopenia.

### `ob-prenatal-care-normal-pregnancy-38` - low / weak-teaching
**Problem.** This is a chronic-hypertension preconception-counseling question whose concept lists what to counsel about — and omits the single most outcome-relevant plan item for this patient: low-dose aspirin, for which chronic hypertension is a stand-alone high-risk indication. Worse, the only mention of aspirin is the distractor rationale, which frames it purely as "not preconception," and gives the window as 12-28 weeks without the "ideally before 16 weeks" qualifier that ACOG/USPSTF emphasize. A student can come away thinking aspirin is not part of planning for this patient at all.

**Evidence.** rationale B: "Incorrect: low-dose aspirin for preeclampsia prophylaxis is initiated during pregnancy (typically 12-28 weeks), not at the preconception visit."

**Fix.** Reword rationale B to: "Incorrect as the baseline evaluation — but aspirin is not irrelevant: chronic hypertension is a high-risk indication for 81 mg daily aspirin, started between 12 and 28 weeks and ideally before 16 weeks. It is planned at this visit and begun once pregnant." Add the aspirin plan to the concept's counseling list alongside superimposed preeclampsia risk.

## Coverage analysis

### Obstetric half

Honest read: the obstetric half (245 questions) is solidly built on the "classic" shelf spine and I found no evidence of lazy coverage — physiology of pregnancy, teratogen counseling, aneuploidy screening, hCG/ectopic/molar workup, the spontaneous-abortion table, preeclampsia/HELLP, GDM screening arithmetic, FHR interpretation (11 questions, well differentiated), Rh alloimmunization surveillance, neonatal jaundice, and neonatal conjunctivitis are all genuinely tested, usually more than once, and usually at the level of a management decision rather than a fact.

The holes are not random; they cluster in six places and every cluster is high-yield:
(1) THIRD-TRIMESTER BLEEDING is the weakest area in the whole obstetric half. Previa gets one question (expectant management then scheduled cesarean), abruption one (emergent cesarean), and vasa previa and placenta accreta spectrum get zero. I confirmed "vasa" appears nowhere in the OB inventory and "accreta" nowhere in any inventory. The shelf reliably asks a painless-bleeding differential.
(2) OBSTETRIC HEMORRHAGE stops at first-line. Uterine atony -> bimanual massage + oxytocin is tested (twice, counting Pharmacology's "PPH uterotonic first-line choice -> Oxytocin"), but nothing is keyed to what you do when uterotonics fail. Tranexamic acid exists only as a mechanism/contraindication pharmacology item, never as a management step, and balloon tamponade / uterine artery embolization / B-Lynch / hysterectomy appear nowhere.
(3) SECOND STAGE AND PERINEAL TRAUMA are absent. "Forceps" and "vacuum" return zero hits; all three arrest-of-labor questions are first-stage arrest keyed to cesarean; laceration appears once and only as "where is the bleeding coming from," never as degree classification or OASIS management.
(4) GUIDELINE THRESHOLD POINTS are under-tested even where the disease is well covered. Six preeclampsia questions but no low-dose aspirin prophylaxis, no gestational-age delivery thresholds (37 wk vs 34 wk), and no severe-range BP threshold with agent choice. Eight GDM questions but nothing keyed to insulin as first-line pharmacotherapy or the 4-12 week postpartum 75-g OGTT.
(5) ANTEPARTUM FETAL TESTING as a testing modality is missing — "biophysical profile" and "contraction stress test" return zero, and the two FGR questions never reach umbilical artery Doppler. The bank teaches you to read a strip but not to read a surveillance test.
(6) PERINATAL INFECTION is asymmetric. CMV, toxoplasmosis, parvovirus (3 questions) and HIV (2, correctly split by viral load) are strong; congenital syphilis in the neonate and hepatitis B perinatal prophylaxis are absent, and neonatal HSV disease is absent even though maternal HSV delivery mode is correctly covered in Gyn Infections.

Two methodological caveats on my own findings. First, I checked the Gyn and Pharmacology inventories before calling anything a gap, and that killed four candidate gaps I would otherwise have reported: maternal syphilis with penicillin allergy (covered: "Penicillin desensitization followed by benzathine penicillin G"), maternal HSV suppression and delivery mode (covered: "Allow vaginal delivery"), NSAID/indomethacin fetal effects and tetracycline teratogenicity (covered in Pharmacology), and magnesium for fetal neuroprotection <32 weeks (covered). The gaps I report survived that check. Second, I worked only from topic + keyed answer, so a tested point buried in a distractor or a concept paragraph would not show up — my list is of untested ANSWERS, which is the right unit for blueprint coverage.

Smaller real holes I did not have room to list separately, roughly in descending yield: appendicitis in pregnancy (imaging choice, appendectomy in any trimester); iron-deficiency anemia treatment and sickle cell disease in pregnancy; ITP versus the gestational thrombocytopenia already keyed in Prenatal; asthma and epilepsy management (as opposed to teratogenicity) in pregnancy; twin delivery timing and mode by chorionicity; cesarean wound infection/dehiscence as a postpartum fever answer (the fever question keys atelectasis); postpartum anti-D within 72 hours and Kleihauer-Betke dosing after trauma; breastfeeding versus breast-milk jaundice and ABO incompatibility as a cause of jaundice <24 h; critical congenital heart disease pulse-oximetry screening; neuraxial analgesia complications and contraindications; contraindications to induction; CVS-versus-amniocentesis timing and the 18-20 week anatomy survey; listeria/food-safety counseling.

On sizing: the redundancy I flag is substantial enough (roughly 20-25 questions of duplicated tested points, mostly in Early Pregnancy and Prenatal) that essentially every gap above could be filled by rewriting existing questions rather than growing the bank. That is the single highest-leverage change available here.

| Importance | +Q | Topic | Domain |
|---|---|---|---|
| very-high | 2 | Vasa previa — painless bleeding at ROM with fetal bradycardia/sinusoidal tracing, and antenatally diagnosed vasa previa managed by scheduled cesarean  | Medical Complications of Pregnancy |
| very-high | 2 | Placenta accreta spectrum — prior cesarean plus placenta previa as the risk dyad, and planned cesarean hysterectomy without attempted placental remova | Medical Complications of Pregnancy |
| very-high | 2 | Low-dose aspirin 81 mg started at 12-16 weeks for preeclampsia prevention in high-risk women | Medical Complications of Pregnancy |
| very-high | 3 | Postpartum hemorrhage escalation after uterotonics fail — tranexamic acid, intrauterine balloon tamponade, uterine artery embolization, B-Lynch, hyste | Postpartum |
| very-high | 2 | Prolonged second stage and operative vaginal delivery — indications, station and full-dilation prerequisites, and vacuum versus forceps complications | Labor & Delivery |
| very-high | 2 | Delivery-timing thresholds in hypertensive disease of pregnancy — 37 weeks for gestational hypertension/preeclampsia without severe features, 34 weeks | Medical Complications of Pregnancy |
| very-high | 2 | Acute severe-range hypertension in pregnancy — the 160/110 treatment threshold and first-line agents (IV labetalol, IV hydralazine, oral immediate-rel | Medical Complications of Pregnancy |
| very-high | 3 | Antepartum fetal surveillance as a testing modality — biophysical profile components and score interpretation, modified BPP, and umbilical artery Dopp | Prenatal Care & Normal Pregnancy |
| very-high | 2 | Gestational diabetes treatment — nutrition therapy first, insulin as first-line pharmacotherapy when glycemic targets are missed, and the 4-12 week po | Medical Complications of Pregnancy |
| very-high | 2 | Congenital syphilis in the neonate — recognition and evaluation of the infant of an inadequately treated mother, and third-trimester RPR rescreening | Newborn & Neonatal |
| high | 2 | Hepatitis B in pregnancy — HBsAg screening at the first visit, and HBIG plus hepatitis B vaccine to the infant within 12 hours of birth | Newborn & Neonatal |
| high | 1 | Neonatal herpes simplex disease — vesicles/seizures/sepsis-like presentation in the first weeks and empiric high-dose IV acyclovir | Newborn & Neonatal |
| high | 3 | Early pregnancy loss — sonographic criteria for definitive nonviability, and misoprostol (or mifepristone-misoprostol) as medical management, plus the | Early Pregnancy Complications |
| high | 2 | Perineal laceration classification and management of obstetric anal sphincter injury | Labor & Delivery |
| high | 1 | Delayed postpartum preeclampsia and eclampsia presenting after discharge, up to 6 weeks | Postpartum |
| high | 1 | Amniotic fluid embolism — sudden intrapartum or immediately postpartum cardiorespiratory collapse with DIC | Labor & Delivery |
| high | 1 | Peripartum cardiomyopathy — new heart failure in late pregnancy or the first months postpartum | Postpartum |
| high | 2 | Teratogens still unrepresented — lithium (Ebstein anomaly), methimazole (aplasia cutis and methimazole embryopathy), and phenytoin | Prenatal Care & Normal Pregnancy |
| high | 1 | Opioid use disorder in pregnancy — buprenorphine or methadone maintenance rather than medically supervised withdrawal | Prenatal Care & Normal Pregnancy |
| moderate | 1 | Post-term and late-term pregnancy — induction by 41-42 weeks and the dysmaturity/macrosomia risk profile | Labor & Delivery |

**Over-weighted relative to shelf yield:**

- **Spontaneous abortion nomenclature and classification (threatened / inevitable / incomplete / missed / complete / septic)** (9 Q) - Nine of the 33 Early Pregnancy questions turn on naming a category: 'Threatened abortion', 'Threatened vs inevitable abortion', 'Inevitable vs incomplete abortion', 'Incomplete abortion management', 'Missed abortion', 'Missed abortion management', 'Complete ab
- **Discriminatory zone workup and abnormal beta-hCG rise pattern** (6 Q) - Six questions reduce to two keyed actions. 'beta-hCG discriminatory zone' (Prenatal), 'Discriminatory zone workup' and 'Ectopic pregnancy - discriminatory zone' (Early) are all keyed to 'repeat beta-hCG in 48 hours and repeat transvaginal ultrasound'; 'beta-hC
- **Preconception switch off teratogenic antihypertensives to labetalol/methyldopa/nifedipine** (5 Q) - 'ACE inhibitor switch preconception', 'ACE inhibitor teratogenicity', 'Beta-blocker choice in chronic hypertension', 'Chronic hypertension medication switch', and 'Safe antihypertensive agents preconception' are five questions in one domain whose correct answe
- **Anti-D (Rh) immune globulin administration and timing** (5 Q) - 'RhoGAM timing at 28 weeks' and 'RhoGAM after sensitizing event' (Prenatal), 'Rh immunoglobulin in bleeding' (Early), and 'Rh isoimmunization prevention' and 'Rh screening and RhoGAM timing' (Medical Complications) all key the same 28-week/sensitizing-event ru
- **First prenatal visit laboratory panel** (3 Q) - 'First prenatal visit lab panel', 'First prenatal visit labs', and 'Indirect Coombs test at prenatal intake' are three questions whose correct answers are 'Blood type, Rh status, and indirect Coombs', 'Blood type and Rh status with indirect Coombs test', and '
- **Folic acid dosing for neural tube defect prevention** (3 Q) - 'Folate supplementation for NTD prevention' and 'High-dose folic acid, prior NTD' are both keyed to '4 mg daily starting at least one month before conception' — a verbatim duplicate tested point — with 'Standard preconception folic acid dose' keyed to 400 mcg 
- **First-stage arrest of labor managed by cesarean** (3 Q) - 'Active phase arrest', 'Active phase arrest of labor', and 'Cesarean for arrest of labor' are all keyed to cesarean delivery. Combined with 'Absolute indication for cesarean' and 'Cesarean for placental abruption', five of 42 Labor & Delivery questions resolve
- **Umbilical cord prolapse** (3 Q) - 'Cord prolapse risk factors', 'Malpresentation and cord prolapse risk', and 'Umbilical cord prolapse management' give three questions to a rare event, and the first two both test the same association (malpresentation with an unengaged presenting part). Two wou
- **Sheehan syndrome** (3 Q) - 'Sheehan syndrome presentation', 'Sheehan syndrome hormone pattern', and 'Sheehan vs Asherman syndrome' devote three of only 30 Postpartum questions to a condition that is now rare in high-resource settings, and Asherman gets two more on top. That is five ques
- **Magnesium sulfate toxicity treated with IV calcium gluconate** (3 Q) - 'Magnesium sulfate toxicity' (Medical Complications, keyed 'Stop magnesium and give IV calcium gluconate'), 'Magnesium sulfate toxicity monitoring' (Labor & Delivery, keyed 'Administer calcium gluconate'), and 'Magnesium toxicity monitoring' (Pharmacology, key

### Gynaecologic + cross-cutting half

Coverage of these 12 domains is genuinely strong on the diagnostic and screening axes and weak on one axis in a consistent, structural way: **management of malignancy**. Cervical Dysplasia (17 questions) is the best-built domain in the half — the full ASCCP-style algorithm is there, including the harder cases (AGC with endometrial sampling, HIV protocol, post-hysterectomy vs supracervical, cold-knife over LEEP). Contraception (24) covers every method's mechanism, dosing, and MEC eligibility. Repro Endo's infertility workup is complete across ovulatory/tubal/uterine/male factors, and letrozole is correctly keyed as first-line ovulation induction rather than clomiphene, which is a good sign the bank was built against current guidance and not a decade-old review. Gyn Infections is current on doxycycline-over-azithromycin for chlamydia. Ethics covers the consent/capacity/reporting legal doctrines thoroughly.

The systematic hole: across Gyn Onc (21) and Breast (23) — 44 questions on cancer — there is **not one question whose correct answer is a cancer treatment**. Every malignant item keys to a diagnosis label, a biopsy modality, a tumor marker, a risk factor, or a screening recommendation. A student who finishes this bank can diagnose endometrial, cervical, ovarian, and breast cancer and cannot manage any of them. That accounts for the four very-high gaps at the top of my list and is worth roughly 9 questions. Vulvar/vaginal disease is thin for the same reason: the two vulvar carcinoma questions gesture at "chronic inflammation and epithelial changes" without ever testing lichen sclerosus, which is both more common than vulvar cancer and the higher-yield item.

The second pattern worth acting on is **cross-domain duplication of the tested point**. Because the bank was assembled by domain, the same concept was written independently in two places, and the established checks (no duplicate ids, no near-duplicate stems) would not catch it since the stems differ. "Autoimmune oophoritis" is the keyed answer in both Menstrual and Menopause. "Renal ultrasound" is the key to two different Menstrual questions. Emergency contraception is written 7 times across three domains with the copper IUD as the answer 5 times, and the three COC absolute contraindications are each written twice — once in Contraception, once in Pharmacology. Reclaiming those slots alone covers most of my very-high gap list without growing the bank. (One duplicate on the OB side that fell out of my cross-check: "Lactational mastitis" and "Lactational mastitis management" have the identical correct answer, "Continue breastfeeding and start oral dicloxacillin" — flagging it for whoever owns Postpartum.)

Two things I checked before claiming and will not report as gaps: gestational trophoblastic disease is thoroughly covered on the OB side (8 questions including persistent GTN and metastatic choriocarcinoma), and recurrent pregnancy loss with antiphospholipid workup is covered there too. Domain weighting is otherwise defensible — Pharmacology at 58 is large but the OB pharm core (magnesium x4, oxytocin x3, tocolytics, teratogens x5, RhoGAM) is legitimately the densest high-yield block on this shelf.

One content item outside my remit that a clinical reviewer should verify: "HPV vaccine covered types" is keyed to "HPV 16 and 18," which is correct for the types causing ~70% of cervical cancer but incorrect as a statement of what the currently used 9-valent vaccine covers (6, 11, 16, 18, 31, 33, 45, 52, 58). Worth confirming the stem asks the former.

| Importance | +Q | Topic | Domain |
|---|---|---|---|
| very-high | 2 | Management of endometrial carcinoma after a positive biopsy (TH+BSO with surgical staging; when adjuvant therapy is added; fertility-sparing progestin | Gynecologic Oncology |
| very-high | 2 | Cervical cancer management by stage, and that FIGO 2018 staging incorporates imaging/nodal status rather than being purely clinical | Gynecologic Oncology |
| very-high | 3 | Locoregional management of breast cancer: sentinel lymph node biopsy as the nodal staging procedure, and breast-conserving therapy (lumpectomy + radia | Breast Disorders |
| very-high | 2 | Lichen sclerosus (and the vulvar dermatosis differential: lichen planus, lichen simplex chronicus) | Benign Gynecology |
| very-high | 2 | Coagulopathy as a cause of heavy menstrual bleeding — the 'C' of PALM-COEIN (von Willebrand disease and platelet function disorders) | Menstrual Disorders |
| very-high | 2 | IUD complications and troubleshooting: pregnancy with an IUD in situ, missing strings, expulsion, and uterine perforation | Contraception |
| high | 1 | Acute heavy uterine bleeding with hemodynamic compromise — emergency medical and mechanical management | Menstrual Disorders |
| high | 2 | Abnormal cervical cytology and CIN in pregnancy | Cervical Dysplasia & Screening |
| high | 3 | Urogynecology beyond the basics: surgical management of stress incontinence, stepwise therapy for overactive bladder, vesicovaginal fistula, and apica | Benign Gynecology |
| high | 1 | Hypogonadotropic hypogonadism as a cause of delayed puberty / primary amenorrhea — Kallmann syndrome | Menstrual Disorders |
| high | 1 | Endocrine physiology of the postmenopausal ovary and hypothalamic-pituitary axis | Menopause |
| high | 1 | Postmenopausal bleeding when the endometrium is thin — atrophy as the most common cause, and the persistent-bleeding trap | Menopause |
| high | 2 | Chlamydia and gonorrhea screening recommendations, and retesting for reinfection | Gynecologic Infections & STIs |
| high | 2 | Genital ulcer differential and syphilis beyond the primary chancre | Gynecologic Infections & STIs |
| high | 2 | Management and natural history of epithelial ovarian cancer | Gynecologic Oncology |
| high | 3 | Communication and professionalism items: professional interpreter use, disclosure of medical error, responding to patient emotion, and conscientious o | Ethics & Social Sciences |
| high | 2 | Screening-test and study-design epidemiology as applied to gynecologic screening | Ethics & Social Sciences |
| moderate | 1 | Medical management of hirsutism and androgen excess in PCOS | Reproductive Endocrinology & Infertility |
| moderate | 1 | Prepubertal vaginal bleeding and vaginal discharge differential | Benign Gynecology |

**Over-weighted relative to shelf yield:**

- **Emergency contraception (spread across Contraception, Pharmacology, and Sexual Health)** (7 Q) - Contraception has 'Copper IUD emergency contraception' [Copper IUD placement], 'Emergency contraception efficacy/timing' [Copper IUD], 'Ulipristal vs levonorgestrel choice'; Pharmacology repeats all three as 'Emergency contraception mechanisms' [Copper IUD], '
- **Combined oral contraceptive contraindications** (7 Q) - Contraception has 'COC contraindication' [age over 35 plus smoking], 'Migraine with aura contraindication' [COC pill], 'Hypertension and combined contraceptives', 'VTE history contraceptive choice' [LNG IUD]; Pharmacology independently repeats 'COC contraindic
- **Congenital Mullerian/outflow tract anomalies within Menstrual Disorders** (10 Q) - Of 35 Menstrual questions, 10 are congenital tract anomalies: imperforate hymen three times ('Imperforate hymen', 'Imperforate hymen management', 'Neonatal imperforate hymen'), Mullerian agenesis five times ('Mullerian agenesis (MRKH)', 'MRKH vs androgen insen
- **Premature ovarian insufficiency / premature menopause (split across Menstrual and Menopause)** (7 Q) - Menstrual has 'Autoimmune primary ovarian insufficiency' [Autoimmune oophoritis], 'Primary ovarian insufficiency diagnosis' [Primary ovarian insufficiency], 'POI hormone therapy for bone/CV protection'. Menopause independently has 'Autoimmune cause of prematur
- **Osteoporosis within the Menopause domain** (5 Q) - 'Early osteoporosis screening risk factors', 'Osteoporosis screening age', 'Osteoporosis treatment threshold', 'Osteoporosis fracture prevention exercise', and 'Long-term risk of untreated premature menopause' [Osteoporosis] make up 5 of 19 Menopause questions
- **Adolescent consent and confidentiality within Ethics** (8 Q) - 'Confidentiality with parent present', 'Emancipated minor doctrine', 'Mature minor doctrine', 'Limits of adolescent confidentiality', 'Minor confidentiality for STI care', 'Minor consent for STI/pregnancy care', 'Minor consent for contraception', and 'State va
- **Genitourinary syndrome of menopause / vulvovaginal atrophy (split across Menopause and Sexual Health)** (4 Q) - Menopause has 'GSM first-line non-hormonal management' [Vaginal lubricants and moisturizers] and 'Vaginal atrophy topical estrogen' [Low-dose vaginal estrogen]; Sexual Health has 'GSM diagnosis and treatment' [Low-dose vaginal estrogen] and 'GSM in breast canc
- **Tamoxifen tissue-specific SERM effects in Pharmacology** (3 Q) - 'Tamoxifen tissue-specific SERM effects' [Agonist in the endometrium, promoting endometrial proliferation], 'Tamoxifen adverse effect' [Tamoxifen acts as an estrogen receptor agonist in the endometrium while...], and 'Tamoxifen bone effect vs breast' [Agonist 
- **Vulvodynia and provoked vestibulodynia within Sexual Health** (3 Q) - 'Provoked vestibulodynia diagnosis' [Provoked vestibulodynia], 'Vestibulodynia vs atrophy' [Provoked vestibulodynia], and 'Vulvodynia first-line management' [Pelvic floor physical therapy with topical lidocaine] give three questions to a condition that appears
- **Gynecomastia within Breast Disorders** (3 Q) - 'Gynecomastia in adolescent' [Reassurance and observation], 'Drug causes of gynecomastia' [Spironolactone], and 'Pathologic gynecomastia workup' [Diagnostic mammogram and tissue biopsy] are 3 of 23 Breast questions. Gynecomastia is primarily a pediatrics/inter

## Redundancy

Adjudicated all 91 clusters. Verdicts: 19 REDUNDANT (21 questions recommended for removal or rewrite), 20 FALSE-POSITIVE, 52 ACCEPTABLE.

I spot-checked the full text (options, rationales, concept, conceptRule, discriminator) for every REDUNDANT call I could reach rather than judging on stems alone, and that changed two verdicts. Cluster 5 (the three "first prenatal visit labs" questions you flagged) is NOT redundant: ob-prenatal-16's distractors are immunohematology choices (anti-Kell titer, neonatal direct Coombs, Kleihauer-Betke) so it tests alloimmunization test selection, while ob-prenatal-17's distractors are all gestational-timing choices (GBS culture, quad screen, 1-hour GTT, anatomy scan) so it actually tests the prenatal testing timeline. Likewise ob-menopause-16 survived on inspection because its distractors (LH, karyotype, anti-TPO, ultrasound) make it a test-sequencing item, not a repeat of ob-menopause-15.

The methotrexate cluster you flagged is genuinely good pedagogy: criteria, mechanism, monitoring, and three separate contraindications, each a different reasoning step. Nothing to cut there.

Hard duplicates verified line-by-line (same key, same concept, overlapping option sets): ob-postpartum-11/12 (lactational mastitis), ob-labor-delivery-3/4 (active phase arrest), ob-postpartum-22/23 (septic pelvic thrombophlebitis), ob-menstrual-disorders-5 vs ob-menopause-1 (autoimmune POI, same 28-year-old with Hashimoto), ob-prenatal-47 vs ob-pharmacology-45 (28-week RhoGAM, with ob-medical-complications-37 as a third copy), ob-early-pregnancy-complications-20/21 (missed abortion).

The dominant pattern is Pharmacology items restating a clinical-domain item verbatim (clomiphene mechanism, DMPA bone density, progestin-only pill in breastfeeding, tachysystole, copper IUD efficacy, RhoGAM timing) and Labor & Delivery items duplicating Newborn items (Erb palsy, meconium aspiration, betamethasone for RDS). In nearly every case I recommend re-pointing rather than deleting, with a specific replacement target: letrozole as first-line ovulation induction, terbutaline for refractory tachysystole, DMPA delayed return of fertility, anti-D after sensitizing events with Kleihauer-Betke dosing, intrapartum management of meconium-stained fluid, and management of hyperplasia with atypia.

Three defects surfaced that belong to other passes, flagged in the relevant cluster reasons. Priority one: ob-newborn-neonatal-26 keys "Oral or enteral feeding with recheck of glucose in 30-60 minutes" for a symptomatic (jittery, irritable) neonate at 24 mg/dL, where IV dextrose is indicated - as keyed this teaches an unsafe action; the same stem also reads "A 3.9-hour-old infant". Second: ob-prenatal-17's conceptRule says GBS culture at "36-38 weeks", contradicting ob-prenatal-22's keyed "36 to 37 weeks". Third: two topic/stem mismatches - ob-early-pregnancy-complications-21 is labelled "Missed abortion management" but asks for a diagnosis, and ob-pharmacology-16 is labelled "Emergency contraception mechanisms" but tests efficacy ranking. Also ob-gynecologic-oncology-6 labels "proliferative endometrium without atypia" as endometrial hyperplasia, which is a mislabel students will absorb.

Source file: /private/tmp/claude-501/-Users-williamsaccount/34a583e4-ec36-49cf-9f6e-932a467c96e6/scratchpad/obreview/clusters.txt (note: the path in my task brief had a transposed session-id segment; the real directory is ...-932a467c96e6..., not ...-932a267c96e6...). Question text verified from batch-01-prenatal.txt, batch-03-labor-postpartum.txt, batch-05-gyn-repro.txt, and batch-07-pharmacology.txt in the same directory.

**Important methodological note.** String-similarity dedup cannot find these. The four duplicates I verified
by hand had stem similarities of 0.74, 0.53, 0.50 and **0.16** - all far below the 0.82 threshold that
reported zero duplicates. A detector that *does* work: **group by identical keyed-answer text, then compare
clinically salient tokens (numbers + words >6 chars) within each group.** On this bank that produces 10 flags
and recovers 4/4 of the hand-verified duplicates. Worth adding to `build_ob_mcq.py`. **[verified]**

### Questions recommended for removal

- **drop `ob-pharmacology-9`, `ob-pharmacology-6`** - Cluster is mostly the word "contraindication" (carboprost/asthma, methylergonovine/HTN, TXA/VTE, LNG-IUD/breast CA, COC/migraine, COC/VTE are all distinct and should stay). But two pairs collapse: (a) ob-contraception-3 ("38-year-old woman who smokes one pack daily" -> "Age over 35 years combined with active smoking") and ob-pharmacology-9 ("For which patient are combined hormonal contraceptives a
- **drop `ob-labor-delivery-22`** - Indication (ob-pharmacology-23) and mechanism (ob-pharmacology-24) are worthwhile separate questions. But there are three toxicity items with the same keyed action: ob-medical-complications-of-pregnancy-25 ("absent deep tendon reflexes and a respiratory rate of 8/min" -> stop mag + calcium gluconate) and ob-labor-delivery-22 ("absent deep tendon reflexes and a respiratory rate of 10/min" -> calciu
- **drop `ob-prenatal-care-normal-pregnancy-6`, `ob-early-pregnancy-complications-7`** - ob-prenatal-care-normal-pregnancy-6 and ob-early-pregnancy-complications-6 are the same question with the same numbers - both "Serum beta-hCG is 2200 mIU/mL, and transvaginal ultrasound shows no intrauterine or adnexal gestational sac and no free fluid" -> repeat hCG and TVUS in 48 hours. ob-early-pregnancy-complications-7 raises the hCG to 4200 (above the discriminatory zone) but keys the identic
- **drop `ob-menstrual-disorders-28`** - Cervical insufficiency is a false-positive member (shared word "insufficiency"). The real problem is ob-menstrual-disorders-28 vs ob-menopause-15: near-verbatim vignettes (32-year-old, months of amenorrhea, hot flashes, vaginal dryness, negative pregnancy test) collapsing on one association. I read both: -28 hands the student "FSH elevated on two occasions" and asks for the name (POI), with distra
- **drop `ob-menstrual-disorders-5`** - ob-menstrual-disorders-5 and ob-menopause-1 are the same question. Verified in full: same 28-year-old with known Hashimoto thyroiditis, same 6 months of hot flashes and amenorrhea, same elevated FSH, same keyed answer (autoimmune oophoritis), overlapping distractor (prolactinoma), and near-identical concept and discriminator text. Keep ob-menopause-1 (adds normal TSH and FSH elevated on two occasi
- **drop `ob-pharmacology-45`** - Verified in full: ob-prenatal-care-normal-pregnancy-47 and ob-pharmacology-45 are the same question - same setup (28 weeks, Rh-negative, negative antibody screen), and their distractor sets are near-identical (withhold until delivery, only if amniocentesis, check paternal Rh status, only if Coombs turns positive) with essentially the same conceptRule. ob-medical-complications-of-pregnancy-37 from 
- **drop `ob-early-pregnancy-complications-21`** - ob-early-pregnancy-complications-20 and -21 are the same question: both an 11-week pregnancy with no bleeding, closed cervical os, crown-rump length consistent with 9 weeks, absent cardiac activity, and both keyed "Missed abortion". Note the defect that reveals the intent - early-21's topic string is "Missed abortion management" but its stem asks "Which of the following is the most likely diagnosi
- **drop `ob-labor-delivery-3`** - Verified in full: ob-labor-delivery-3 and -4 are the same question. Same 27-year-old G1P0 at 39 weeks, same 6 cm with ruptured membranes, same >200 Montevideo units, same keyed cesarean, and the same four distractor themes (oxytocin, amnioinfusion, operative vaginal delivery, continued observation). Keep ob-labor-delivery-4 - it carries the conceptRule that separates arrest from a protracted activ
- **drop `ob-labor-delivery-24`** - One meconium aspiration vignette used twice with near-verbatim radiology ("patchy infiltrates with areas of hyperinflation and flattened diaphragms"). ob-newborn-neonatal-21 requires the same recognition as ob-labor-delivery-24 and then adds the mechanism (ball-valve obstruction plus chemical pneumonitis), so ld-24 contributes nothing beyond naming what the stem already describes. Keep newborn-neo
- **drop `ob-labor-delivery-26`** - Same Erb palsy vignette twice, down to the maneuvers (McRoberts plus suprapubic pressure) and the "waiter's tip" posture. ob-labor-delivery-26 asks only the nerve roots (C5-C6); ob-newborn-neonatal-11 asks roots plus expected course (spontaneous resolution over weeks to months) and therefore fully subsumes it. Keep newborn-neonatal-11.
- **drop `ob-pharmacology-40`** - Same tested point and same first action. ob-labor-delivery-29 (7 contractions in 10 minutes with recurrent late decelerations and minimal variability -> stop oxytocin and reposition) and ob-pharmacology-40 (>5 contractions in 10 minutes with recurrent late decelerations -> discontinue or decrease oxytocin) differ only in that the pharmacology stem restricts the answer to a "pharmacologic step", wh
- **drop `ob-postpartum-12`** - Verified in full: ob-postpartum-11 and ob-postpartum-12 are the same question. Both are a woman 3 weeks postpartum with fever, malaise, a tender wedge-shaped erythematous area and no fluctuant mass; both key "Continue breastfeeding and start oral dicloxacillin"; both carry the same concept (S. aureus cellulitis, continue drainage) and the same discriminator (absence of fluctuance separates mastiti
- **drop `ob-postpartum-23`** - Verified in full: ob-postpartum-22 and -23 are the same question - persistent postpartum day-5 fever on adequate antibiotics with no other source, keyed "add empiric heparin", with the same concept (diagnosis of exclusion), the same discriminator, and overlapping distractors (switch antibiotic class, do not operate). Keep ob-postpartum-22; -23 also carries a filler distractor ("psychiatry consulta
- **drop `ob-newborn-neonatal-35`** - The detected pairing (RDS prevention versus CIN 1 management) is itself a false positive, but ob-newborn-neonatal-35 ("which of the following interventions most directly reduces the risk of respiratory distress syndrome" -> maternal betamethasone) is the same tested point as ob-labor-delivery-5 in cluster 44 ("the primary purpose of administering betamethasone" -> accelerate fetal lung maturity an
- **drop `ob-reproductive-endocrinology-infertility-3`** - Identical question, identical answer. ob-reproductive-endocrinology-infertility-3 ("What is its mechanism of action?" -> SERM blocking hypothalamic estrogen receptors, increasing GnRH and FSH pulsatility) and ob-pharmacology-7 ("induces ovulation primarily through which mechanism?" -> blocking hypothalamic estrogen receptors to increase GnRH and gonadotropin release) are one sentence restated. Kee
- **drop `ob-pharmacology-16`** - Three items key to "copper IUD is the most effective emergency contraception": ob-contraception-5 (4 days after intercourse), ob-pharmacology-16 (60 hours, BMI 35), and ob-sexual-health-assault-2 from cluster 58 (60 hours, BMI 34). ob-pharmacology-16 is the one to cut - it is near-verbatim with sexual-health-assault-2 and its topic string is "Emergency contraception mechanisms" while its stem test
- **drop `ob-pharmacology-15`** - Same point, same answer: ob-contraception-7 ("which counseling point regarding long-term use is most accurate" -> reversible decrease in bone mineral density) and ob-pharmacology-15 ("most associated with which reversible adverse effect" -> decreased bone mineral density that recovers after discontinuation). Keep ob-contraception-7 (counseling framing). Re-point the Pharmacology slot to a DMPA fac
- **drop `ob-pharmacology-43`** - Same point, same answer: ob-contraception-19 (3 weeks postpartum, exclusively breastfeeding -> progestin-only pill) and ob-pharmacology-43 (POP preferred in which situation -> breastfeeding, because it does not suppress milk production). Keep ob-contraception-19. If the Pharmacology domain wants a POP item, test its distinguishing pharmacology instead - the strict 3-hour dosing window and cervical
- **drop `ob-gynecologic-oncology-6`** - ob-gynecologic-oncology-6 duplicates ob-menstrual-disorders-20 from cluster 63 - same 47-year-old with cycles every 2-3 months, same biopsy result (proliferative endometrium without atypia), same keyed cyclic progestin. It also carries a content error: its topic is "Endometrial hyperplasia management" but proliferative endometrium is not hyperplasia, so as written it teaches a mislabel. Prefer rew
