// src/data/obEndoTumorDrills.ts
/**
 * OB/GYN tumor & hormonal-presentation drills — the "endo-tumors" domain of the
 * OB/GYN drill bank.
 *
 * Each drill is one presentation (hirsutism, precocious puberty, amenorrhea…)
 * or one tumor family (germ cell, sex cord-stromal, GTD…). The student lists
 * the causes by SOURCE — ovary, adrenal, pituitary/hypothalamus, exogenous —
 * with the clue that separates each, then the workup that sorts them. `org` is
 * "Hormones" or "Tumors" so the Browse list splits the two families.
 *
 * ITEM RULE — items are "<recall head> — <why / clue>". Only the head is graded
 * (gradableItem in drillProgressCore), so it is the shortest phrase a student
 * would actually write; "/" in a head lists alternative spellings any one of
 * which earns credit. Numbers, cut-offs and nuance live after the dash or in
 * pearls, which are shown on reveal and never graded. Heads within one drill
 * must not credit each other — asserted in the test (with the one documented
 * exception of the mole family, where "mole" is the only distinctive token).
 *
 * Standard board values; institutional protocols vary. Educational use only.
 * Authored 2026-09-13 from standard shelf sources (ACOG, Endocrine Society,
 * Williams Gynecology / Blueprints-level facts).
 */
import type { GuidelineDrill } from "./guidelineDrillBank";

const HORMONES = "Hormones";
const TUMORS = "Tumors";
const REVIEWED = "2026-09-13";

export const OB_ENDO_TUMOR_DRILLS: GuidelineDrill[] = [
  // ───────────────────────── HORMONAL PRESENTATIONS ─────────────────────────
  {
    id: "endo-hirsutism",
    domain: "endo-tumors",
    name: "Hirsutism & virilization",
    org: HORMONES,
    prompt: `22F with 18 months of coarse hair on the chin, chest and lower abdomen, irregular cycles since menarche, BMI 31 and acanthosis nigricans. No clitoromegaly, voice unchanged.\n\nList the causes of hirsutism by source (ovarian, adrenal, other) with the clue that separates each, the red flags that make it a tumor until proven otherwise, and the first-line workup.`,
    keyPoints: [
      {
        group: "Ovarian",
        items: [
          "PCOS — most common (~80%); gradual onset since puberty, oligomenorrhea, obesity/acanthosis; Rotterdam 2 of 3",
          "Sertoli-Leydig — rapid virilization, testosterone >150–200 ng/dL, unilateral solid adnexal mass; 20s–30s",
          "Hyperthecosis — postmenopausal or severe insulin resistance; gradual virilization; testosterone high with normal DHEA-S",
          "Luteoma of pregnancy — maternal virilization during pregnancy from a solid ovarian mass; regresses postpartum",
        ],
      },
      {
        group: "Adrenal",
        items: [
          "Nonclassic CAH / CAH — late-onset 21-hydroxylase deficiency; early-morning follicular 17-OHP >200 ng/dL; Ashkenazi, Hispanic",
          "Cushing syndrome / Cushing's — striae, proximal weakness, moon face, easy bruising; screen if any cushingoid feature",
          "Adrenal tumor / adrenal carcinoma — DHEA-S >700 µg/dL, rapid onset, often with cortisol excess; CT adrenals",
        ],
      },
      {
        group: "Other",
        items: [
          "Idiopathic hirsutism / idiopathic — regular ovulatory cycles and normal androgens; increased skin 5α-reductase activity",
          "Drugs / medications — danazol, anabolic steroids, testosterone gel, valproate; minoxidil and cyclosporine cause hypertrichosis",
          "Hyperprolactinemia — raises adrenal androgens and causes anovulation; check prolactin with the androgens",
        ],
      },
      {
        group: "Workup",
        items: [
          "Total testosterone — the screen; >150–200 ng/dL or rapid virilization = tumor until imaged",
          "DHEA-S — adrenal marker; >700 µg/dL → CT adrenals",
          "17-OHP / 17-hydroxyprogesterone — early-morning follicular phase; >200 ng/dL → ACTH stimulation test for nonclassic CAH",
          "Transvaginal ultrasound / TVUS — ovarian mass, or polycystic morphology (≥20 follicles or volume ≥10 mL)",
          "TSH / prolactin — thyroid and prolactin causes of anovulation ride along with the androgen panel",
        ],
      },
    ],
    pearls:
      "Hirsutism = terminal hair in a male pattern (modified Ferriman-Gallwey ≥8; lower thresholds in East Asian women). Virilization — clitoromegaly, deepening voice, male-pattern balding, increased muscle bulk, breast atrophy — is never PCOS: image the ovaries and adrenals. Treatment when no tumor: combined OCP first-line (suppresses ovarian androgens, raises SHBG), add spironolactone 50–100 mg BID if inadequate after 6 months — always with contraception because antiandrogens feminize a male fetus; eflornithine cream for facial hair, laser/electrolysis for removal. Hair takes ≥6 months to respond. Sertoli-Leydig: unilateral salpingo-oophorectomy, usually stage I; testosterone normalizes and hirsutism regresses slowly.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-precocious-puberty",
    domain: "endo-tumors",
    name: "Precocious puberty",
    org: HORMONES,
    prompt: `6-year-old girl with breast budding for 4 months and now pubic hair; height at the 97th percentile, well above mid-parental target. Bone age reads 9 years. No café-au-lait spots, neurologically normal.\n\nDefine precocious puberty, split the causes into central (GnRH-dependent), peripheral (GnRH-independent) and benign variants with the clue for each, then give the workup that separates them and the treatment.`,
    keyPoints: [
      {
        group: "Central (GnRH-dependent)",
        items: [
          "Idiopathic central / idiopathic — 80–90% of girls; diagnosis of exclusion after normal brain MRI",
          "Hypothalamic hamartoma — the classic CNS lesion; very early onset, gelastic (laughing) seizures",
          "CNS tumor / glioma — optic glioma in NF1, astrocytoma, germinoma; most boys with central precocity have a lesion",
          "Hydrocephalus / cranial radiation — prior CNS insult: radiation, trauma, meningitis, hydrocephalus",
        ],
      },
      {
        group: "Peripheral (GnRH-independent)",
        items: [
          "McCune-Albright — café-au-lait with jagged 'coast of Maine' borders, polyostotic fibrous dysplasia, recurrent ovarian cysts; GNAS mutation",
          "Granulosa cell tumor / granulosa — estrogen-secreting ovarian mass; inhibin; also thecoma",
          "Ovarian cyst / functional cyst — transient estrogen bursts, waxing-waning breast changes",
          "CAH — 21-hydroxylase deficiency; virilization (pubic hair, clitoromegaly) in girls, isosexual in boys; 17-OHP",
          "Exogenous estrogen / severe hypothyroidism — creams/pills/lavender-tea tree oils; hypothyroidism precocity WITHOUT growth (Van Wyk-Grumbach)",
        ],
      },
      {
        group: "Benign variants",
        items: [
          "Premature thelarche — isolated breast development, usually <3 y; normal growth velocity and bone age; observe",
          "Premature adrenarche — isolated pubic/axillary hair and odor from early DHEA-S rise; bone age only mildly advanced; later PCOS risk",
        ],
      },
      {
        group: "Workup & treatment",
        items: [
          "Bone age — advanced (>2 SD) in true precocity; normal in the benign variants",
          "LH / basal LH — pubertal (>0.3 IU/L) = central; prepubertal/suppressed = peripheral",
          "GnRH stimulation test — LH rises (>5) with central; flat with peripheral",
          "MRI brain — every boy, every girl <6, and any neurologic sign",
          "GnRH agonist / leuprolide — treatment of central precocity; halts progression and preserves adult height",
        ],
      },
    ],
    pearls:
      "Definition: secondary sex characteristics before 8 in girls, 9 in boys. Sex steroid excess drives a growth spurt AND early epiphyseal fusion — tall child, short adult. Central: idiopathic in most girls, pathologic in most boys, so image every boy. Peripheral: LH suppressed and no GnRH response, so treat the source — remove the tumor, hydrocortisone for CAH, letrozole or tamoxifen for McCune-Albright, stop the exogenous estrogen. Leuprolide depot monthly or every 3 months, stopped around age 11 so puberty resumes at a normal time. Trap: severe primary hypothyroidism causes precocity with growth FAILURE and delayed bone age (TSH cross-reacts on the FSH receptor) — thyroxine reverses it. Also check estradiol/testosterone and 17-OHP in the peripheral workup, plus a pelvic ultrasound for an ovarian mass or cyst.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-primary-amenorrhea",
    domain: "endo-tumors",
    name: "Primary amenorrhea & delayed puberty",
    org: HORMONES,
    prompt: `16F has never menstruated. Tanner 4 breasts, Tanner 1 pubic hair, height 172 cm. Exam: blind-ending vaginal pouch, bilateral inguinal masses; no uterus on ultrasound. Testosterone is in the male range.\n\nSort the causes of primary amenorrhea by FSH (ovary failed vs brain quiet) and by breasts/uterus present or absent, name the diagnosis here, then list the workup in order.`,
    keyPoints: [
      {
        group: "High FSH — ovary failed",
        items: [
          "Turner syndrome / Turner — 45,X streak ovaries; short stature, webbed neck, shield chest, coarctation; most common cause of gonadal failure",
          "Swyer / XY gonadal dysgenesis — 46,XY with streak gonads: female phenotype, uterus PRESENT, no breasts; remove gonads (gonadoblastoma)",
          "POI / premature ovarian insufficiency — chemo/radiation, fragile X premutation (FMR1), autoimmune, galactosemia",
        ],
      },
      {
        group: "Low FSH — brain quiet",
        items: [
          "Kallmann — no GnRH neurons + anosmia; normal stature; MRI shows absent olfactory bulbs",
          "Constitutional delay — family history, delayed bone age matches height age, will progress; diagnosis of exclusion",
          "Functional hypothalamic amenorrhea — anorexia, athlete triad, stress; low weight/energy availability",
          "Prolactinoma / craniopharyngioma — galactorrhea, headache, visual field cut; craniopharyngioma is the teen sellar mass",
        ],
      },
      {
        group: "Outflow — breasts present",
        items: [
          "Androgen insensitivity / AIS — 46,XY, testes in labia/inguinal canal, NO pubic hair, blind pouch, no uterus; male-range testosterone",
          "MRKH / Müllerian agenesis — 46,XX, normal pubic hair, ovaries and androgens normal, no uterus/upper vagina; renal anomalies 30%",
          "Imperforate hymen — cyclic pelvic pain, bulging bluish membrane at the introitus, hematocolpos",
          "Transverse vaginal septum — cyclic pain with NO bulge at the introitus; MRI defines it",
        ],
      },
      {
        group: "Workup",
        items: [
          "β-hCG — first, always",
          "FSH / LH — high = gonadal failure → karyotype; low = hypothalamic/pituitary → prolactin, MRI",
          "Karyotype — every high-FSH case, and every absent uterus (46,XY AIS vs 46,XX MRKH)",
          "Pelvic ultrasound — uterus present or absent decides the branch",
          "Prolactin / TSH / bone age — prolactinoma, hypothyroidism, constitutional delay",
        ],
      },
    ],
    pearls:
      "Definition: no menses by 15 with normal secondary sex characteristics, by 13 with none, or 3 years after thelarche. AIS vs MRKH — the two 'breasts yes, uterus no' answers: AIS has no pubic hair, a 46,XY karyotype and male-range testosterone; MRKH has normal pubic hair, 46,XX and female testosterone. Timing of gonadectomy: Swyer immediately (gonadoblastoma 15–35%), AIS after puberty is complete (let the testes drive breast development; tumor risk rises after 25). Turner: estrogen replacement for puberty and bone, screen heart (bicuspid valve, coarctation, aortic root), kidneys, thyroid, hearing, celiac; pregnancy only with donor eggs and cardiac clearance. Imperforate hymen: cruciate incision — never needle aspiration (introduces infection).",
    reviewed: REVIEWED,
  },
  {
    id: "endo-secondary-amenorrhea",
    domain: "endo-tumors",
    name: "Secondary amenorrhea",
    org: HORMONES,
    prompt: `24F, no menses for 7 months after 10 years of regular cycles. Marathon training, BMI 18, negative home pregnancy test. No galactorrhea, no hirsutism, no headache.\n\nList the causes of secondary amenorrhea by compartment (hypothalamus/pituitary, ovary, uterus) with the clue for each, then the stepwise workup and what each result means.`,
    keyPoints: [
      {
        group: "Hypothalamus & pituitary",
        items: [
          "Functional hypothalamic amenorrhea — weight loss, exercise, stress; low-normal FSH, low estradiol; athlete triad (bone loss)",
          "Prolactinoma / hyperprolactinemia — galactorrhea, headache, bitemporal hemianopsia; drugs (antipsychotics) mimic it",
          "Sheehan syndrome / Sheehan — postpartum hemorrhage → pituitary infarction: fails to lactate, then amenorrhea, panhypopituitarism",
          "Hypothyroidism / thyroid — TSH in every workup; also raises prolactin",
          "Cushing syndrome / Cushing's — cortisol suppresses GnRH; cushingoid features, hypertension, striae",
        ],
      },
      {
        group: "Ovary",
        items: [
          "PCOS — most common; hirsutism, obesity, high LH:FSH; bleeds after a progestin challenge (estrogen present)",
          "POI / premature ovarian insufficiency — <40 with FSH >25–40 on two occasions; hot flashes; fragile X, autoimmune, chemo/radiation",
          "Menopause — >45, physiologic; high FSH, vasomotor symptoms, vaginal dryness",
        ],
      },
      {
        group: "Uterus & outflow",
        items: [
          "Asherman syndrome / Asherman — intrauterine adhesions after D&C, infection or surgery; no bleed even after estrogen + progestin; hysteroscopy",
          "Cervical stenosis — after LEEP/cone; cyclic cramping, hematometra",
        ],
      },
      {
        group: "Workup",
        items: [
          "β-hCG — first, always, even when she says she cannot be pregnant",
          "Prolactin / TSH / FSH — the standard first panel; add testosterone/DHEA-S if hirsute",
          "Progestin challenge — bleed = estrogen present + outflow intact (anovulation, e.g. PCOS); no bleed = low estrogen or outflow block",
          "Estrogen-progestin challenge — still no bleed = outflow tract (Asherman, stenosis); bleed = estrogen was low (hypothalamic or ovarian)",
          "MRI pituitary — prolactin persistently high, or low FSH with no explanation",
        ],
      },
    ],
    pearls:
      "Definition: no menses for 3 months if previously regular, 6 months if previously irregular. Sheehan = the postpartum hemorrhage patient who cannot breastfeed. Functional hypothalamic amenorrhea is a diagnosis of exclusion; treat energy availability (nutrition, less training) — OCPs restore bleeding but do not restore bone density. POI: estrogen replacement until ~50 for bone and heart, test FMR1 premutation and adrenal/thyroid autoimmunity, 5–10% still conceive spontaneously. PCOS: needs a progestin (cyclic or OCP) to protect the endometrium. Asherman: hysteroscopic lysis, then estrogen to regrow the lining.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-hyperprolactinemia",
    domain: "endo-tumors",
    name: "Hyperprolactinemia & galactorrhea",
    org: HORMONES,
    prompt: `29F with 6 months of oligomenorrhea and bilateral milky nipple discharge. Not pregnant, not breastfeeding. Prolactin 95 ng/mL, TSH normal. Started risperidone a year ago; no headache or visual symptoms.\n\nList the causes of hyperprolactinemia by mechanism (physiologic, drugs, pituitary and systemic) with the clue for each, then the workup order and management.`,
    keyPoints: [
      {
        group: "Physiologic",
        items: [
          "Pregnancy / lactation — hCG before anything else; prolactin stays up while nursing",
          "Nipple stimulation / chest wall — breast exam, piercings, herpes zoster, burns, surgery on the chest",
          "Stress / exercise / sleep — modest rises; repeat a rested, non-fasting-stressed sample",
        ],
      },
      {
        group: "Drugs",
        items: [
          "Antipsychotics / risperidone — D2 blockade; risperidone, paliperidone, haloperidol highest; aripiprazole is prolactin-sparing",
          "Metoclopramide / domperidone — antiemetic D2 blockers",
          "SSRIs / methyldopa / verapamil / estrogen — modest elevations; also TCAs and opioids",
        ],
      },
      {
        group: "Pituitary & systemic",
        items: [
          "Prolactinoma — micro <10 mm vs macro ≥10 mm; prolactin usually tracks tumor size (>200 with a macro)",
          "Stalk compression / nonfunctioning adenoma — loss of dopamine inhibition; a LARGE mass with prolactin only modestly up (<100–150)",
          "Acromegaly / growth hormone adenoma — co-secretion in ~25%; enlarged hands, jaw, sweating",
          "Hypothyroidism — TRH drives prolactin; check TSH first",
          "Chronic kidney disease / cirrhosis — reduced prolactin clearance",
        ],
      },
      {
        group: "Workup & management",
        items: [
          "hCG / TSH / creatinine — exclude pregnancy, hypothyroidism and renal failure before imaging",
          "MRI pituitary — any unexplained elevation; add visual fields if a macroadenoma",
          "Cabergoline / dopamine agonist — first-line even for macroadenomas; shrinks the tumor; bromocriptine has the longest pregnancy record",
          "Transsphenoidal surgery — dopamine-agonist failure or intolerance, or vision threatened despite therapy",
          "Switch the drug / aripiprazole — drug-induced: switch to a prolactin-sparing agent with psychiatry, confirm prolactin normalizes",
        ],
      },
    ],
    pearls:
      "Prolactin level roughly matches prolactinoma size — a big sellar mass with prolactin under 100 is stalk effect from a non-prolactin tumor, treated surgically, not with cabergoline. Hook effect: a huge macroadenoma can read falsely LOW on the assay — ask the lab to dilute. Macroprolactin (big prolactin) is an inert aggregate — asymptomatic patient with a high number, no treatment. An asymptomatic microadenoma can be observed; treat for hypogonadism/bone loss, galactorrhea that bothers her, or fertility. In pregnancy stop the dopamine agonist at conception for a microadenoma; macroadenomas need visual-field checks each trimester. Cabergoline at Parkinson-level doses (not endocrine doses) is linked to valvulopathy.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-ambiguous-genitalia",
    domain: "endo-tumors",
    name: "Ambiguous genitalia & DSD",
    org: HORMONES,
    prompt: `Newborn with a phallus-like structure, fused labioscrotal folds and no palpable gonads. On day 6: vomiting, lethargy, Na 128, K 6.4, glucose 44.\n\nName the diagnosis here, then the other disorders of sex development a shelf expects — for each the karyotype and the clue — and the workup in order.`,
    keyPoints: [
      {
        group: "46,XX virilized",
        items: [
          "CAH / congenital adrenal hyperplasia — 21-hydroxylase deficiency, most common cause; salt-wasting crisis day 7–14 (low Na, high K, hypoglycemia); 17-OHP",
          "11-beta-hydroxylase — virilization WITH hypertension and hypokalemia (11-deoxycorticosterone excess)",
          "Maternal androgen exposure — luteoma of pregnancy, danazol, progestins, untreated maternal CAH",
        ],
      },
      {
        group: "46,XY undervirilized",
        items: [
          "Androgen insensitivity / AIS — female phenotype, testes in canal/labia, no uterus; presents as inguinal hernia in a girl, or amenorrhea at puberty",
          "5α-reductase deficiency — ambiguous/female at birth, virilizes at puberty; testosterone normal, DHT low (high T:DHT ratio)",
          "Swyer / pure gonadal dysgenesis — 46,XY with normal female genitalia and a uterus, streak gonads; presents as delayed puberty; gonadoblastoma",
          "17-alpha-hydroxylase / 17-OHase deficiency — hypertension + hypokalemia + NO puberty in either sex (no sex steroids, no cortisol)",
        ],
      },
      {
        group: "Chromosomal & mixed",
        items: [
          "Mixed gonadal dysgenesis — 45,X/46,XY mosaic; asymmetric gonads (testis one side, streak the other); Turner features",
          "Ovotesticular DSD — ovarian and testicular tissue in the same patient; usually 46,XX",
          "Turner / Klinefelter — NOT ambiguous at birth: Turner presents with short stature/no puberty, Klinefelter with tall stature, small testes, infertility",
        ],
      },
      {
        group: "Workup",
        items: [
          "Karyotype / FISH SRY — first, but never assign sex on the karyotype alone; a multidisciplinary decision with the family",
          "17-OHP / electrolytes / glucose — CAH is the life-threatening one; treat salt wasting (saline, hydrocortisone, fludrocortisone) immediately",
          "Testosterone / DHT — high T:DHT ratio (>10–20, esp. after hCG stimulation) = 5α-reductase deficiency; normal/high T with female phenotype = AIS",
          "Pelvic ultrasound — is there a uterus? where are the gonads?",
          "Palpable gonad — a palpable gonad is a testis (ovaries do not descend); a virilized infant with NO palpable gonads is CAH until proven otherwise",
        ],
      },
    ],
    pearls:
      "The two urgent questions: is this CAH (will die of salt wasting in week 2) and is a Y chromosome present (gonadoblastoma risk in dysgenetic gonads). Newborn screen measures 17-OHP but results lag — draw electrolytes and 17-OHP on day 1 for any ambiguous newborn. 21-hydroxylase deficiency: cortisol AND aldosterone low, androgens high → virilized girl, salt wasting in both sexes. 11β: androgens AND mineralocorticoid (DOC) high → virilized + hypertensive. 17α: no androgens, no cortisol, DOC high → undervirilized/hypertensive with no puberty. 5α-reductase: testes and Wolffian structures normal (testosterone-dependent), external genitalia not (DHT-dependent) — Müllerian structures absent in every 46,XY DSD because AMH from the testes is intact, except Swyer where the gonads are streaks and a uterus forms.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-prepubertal-bleeding",
    domain: "endo-tumors",
    name: "Prepubertal vaginal bleeding",
    org: HORMONES,
    prompt: `5-year-old girl with 3 days of blood spotting in her underwear. No breast development, no pubic hair, normal growth. Mother reports foul discharge for two weeks.\n\nList the causes of vaginal bleeding in a prepubertal child — non-hormonal, hormonal and tumor — with the clue for each, then the workup.`,
    keyPoints: [
      {
        group: "Non-hormonal (no breast development)",
        items: [
          "Foreign body — toilet paper is the classic; foul bloody discharge; vaginoscopy or irrigation",
          "Vulvovaginitis — poor hygiene, nonspecific; group A strep and Shigella cause bloody discharge",
          "Urethral prolapse — doughnut-shaped friable mass at the urethra, Black girls 4–8; topical estrogen",
          "Trauma / sexual abuse — straddle injury is anterior/vulvar; hymenal or posterior fourchette tears → mandated report, forensic exam",
          "Lichen sclerosus — white figure-of-8 plaque, purpura, pruritus; mistaken for abuse; clobetasol",
        ],
      },
      {
        group: "Hormonal (estrogen present)",
        items: [
          "Precocious puberty — breast development and growth spurt precede the bleed; bone age, LH, estradiol",
          "Neonatal withdrawal bleeding — first week of life, from maternal estrogen withdrawal; benign",
          "Exogenous estrogen — creams, pills, lavender/tea-tree oils; breast budding without growth spurt",
          "McCune-Albright — bleeding may be the FIRST sign (autonomous ovarian cyst), before breast development; café-au-lait",
        ],
      },
      {
        group: "Tumor",
        items: [
          "Sarcoma botryoides / embryonal rhabdomyosarcoma — grape-like polypoid mass protruding from the vagina, <5 years",
          "Granulosa cell tumor / juvenile granulosa — estrogen-secreting ovarian mass → precocity + bleeding; inhibin",
          "Clear cell adenocarcinoma / DES — historical DES exposure in utero; adolescent/young adult",
        ],
      },
      {
        group: "Workup",
        items: [
          "Examination / knee-chest position — inspect hymen and introitus; frog-leg then knee-chest; never a speculum awake",
          "Vaginoscopy / EUA — foreign body, tumor, or bleeding without a visible source",
          "Pelvic ultrasound — ovarian mass or cyst, uterine size (estrogen effect)",
          "Bone age / estradiol / LH — if any breast development: sort central vs peripheral precocity",
        ],
      },
    ],
    pearls:
      "Tanner staging decides the branch: bleeding with NO breast development is almost always local (foreign body, vulvovaginitis, trauma, prolapse), bleeding WITH breast development is estrogen (precocity, tumor, exogenous). Any hymenal laceration, posterior fourchette tear or STI in a prepubertal child = abuse until proven otherwise — report and involve child protection; straddle injuries are anterior and do not tear the hymen. Sarcoma botryoides: chemotherapy (VAC) with conservative surgery, good survival. Prepubertal vaginal mucosa is thin and unestrogenized, so it bleeds and infects easily — hygiene, sitz baths, no bubble bath.",
    reviewed: REVIEWED,
  },
  // ─────────────────────────────── TUMORS ───────────────────────────────
  {
    id: "endo-sex-cord-stromal",
    domain: "endo-tumors",
    name: "Hormone-secreting ovarian tumors",
    org: TUMORS,
    prompt: `62F, 9 years past menopause, with new vaginal bleeding, breast tenderness and a 7 cm solid left adnexal mass. Endometrial biopsy shows complex hyperplasia.\n\nName the hormone-secreting (sex cord-stromal and other functional) ovarian tumors — what each secretes, the clue and the marker — then the workup and management steps this case needs.`,
    keyPoints: [
      {
        group: "Estrogen-secreting",
        items: [
          "Granulosa cell tumor / granulosa — most common; Call-Exner bodies, coffee-bean nuclei; inhibin B; postmenopausal bleeding or precocious puberty; recurs late",
          "Thecoma — postmenopausal, benign, lipid-laden stromal cells; estrogen → bleeding/hyperplasia; often with fibroma (fibrothecoma)",
        ],
      },
      {
        group: "Androgen-secreting",
        items: [
          "Sertoli-Leydig — 20s–30s, rapid virilization, testosterone >200 ng/dL with normal DHEA-S; unilateral, mostly stage I; DICER1",
          "Hilus cell — Leydig-type cells at the hilum; small tumor, postmenopausal virilization; Reinke crystals",
          "Gonadoblastoma — dysgenetic gonads carrying a Y (Swyer, mixed gonadal dysgenesis); may transform to dysgerminoma; remove both gonads",
          "Hyperthecosis — NOT a tumor: bilateral stromal luteinization; gradual postmenopausal virilization, severe insulin resistance",
        ],
      },
      {
        group: "Other functional",
        items: [
          "Struma ovarii — monodermal teratoma of thyroid tissue; hyperthyroidism with no goiter",
          "Fibroma / Meigs — benign, no hormones; Meigs = ascites + right pleural effusion that resolve after removal; Gorlin syndrome",
          "Krukenberg — metastatic signet-ring cells from stomach/colon, bilateral solid; stroma can luteinize → virilization, especially in pregnancy",
          "hCG-secreting / choriocarcinoma — germ cell or gestational; hCG drives hyperthyroidism and precocious puberty",
        ],
      },
      {
        group: "Workup & management",
        items: [
          "Inhibin / estradiol — granulosa marker; inhibin B (and AMH) for recurrence surveillance",
          "Testosterone / DHEA-S — testosterone >200 with normal DHEA-S = ovarian source → image the ovaries",
          "Endometrial biopsy / EMB — mandatory with any estrogen-secreting tumor: hyperplasia in 25–50%, cancer in 5–10%",
          "Unilateral salpingo-oophorectomy / USO — young, stage I, fertility desired",
          "Hysterectomy + BSO / TAH-BSO — postmenopausal or done childbearing; granulosa can recur 10–20 years later, so follow inhibin for decades",
        ],
      },
    ],
    pearls:
      "Sex cord-stromal tumors are ~5% of ovarian cancers, mostly stage I with good prognosis, and the ones that SECRETE — so they present with a hormone story, not bloating. Adult granulosa (95%; FOXL2 mutation) presents at 50–55, juvenile granulosa before 30 with precocious puberty. Inhibin is also raised by mucinous tumors. Meigs syndrome: the effusion is benign and disappears with the fibroma — a fibroma with ascites and effusion is NOT stage III cancer. Hyperthecosis: BSO or a GnRH agonist. Virilization in pregnancy: think luteoma (regresses) or Krukenberg (does not).",
    reviewed: REVIEWED,
  },
  {
    id: "endo-germ-cell",
    domain: "endo-tumors",
    name: "Germ cell ovarian tumors",
    org: TUMORS,
    prompt: `19F with 3 weeks of pelvic pain and a 12 cm solid right adnexal mass. Urine hCG negative. LDH 1,900 U/L, AFP normal, serum hCG mildly positive.\n\nName the germ cell tumors — the marker and one clue for each — the benign forms and their twists, then management, remembering that fertility matters here.`,
    keyPoints: [
      {
        group: "Malignant germ cell",
        items: [
          "Dysgerminoma — most common malignant GCT; LDH (± hCG from syncytiotrophoblast cells); bilateral 10–15%; radiosensitive; ovarian seminoma",
          "Yolk sac / endodermal sinus — AFP; Schiller-Duval bodies; rapidly growing, girls and young women; aggressive but chemo-curable",
          "Immature teratoma — immature neural tissue, graded by neuroepithelium; AFP may be mildly up; 10–20 years",
          "Choriocarcinoma — hCG; non-gestational (ovarian) choriocarcinoma is worse than gestational; hemorrhagic, early lung mets",
          "Embryonal carcinoma / mixed — hCG + AFP; precocious puberty or irregular bleeding in girls; often part of a mixed tumor",
        ],
      },
      {
        group: "Benign",
        items: [
          "Mature teratoma / dermoid — most common ovarian neoplasm in reproductive age; hair, teeth, sebum, Rokitansky nodule; torsion; bilateral 10–15%",
          "Struma ovarii — teratoma of thyroid tissue; hyperthyroidism in ~5%",
          "Carcinoid — teratoma-associated; flushing/diarrhea without liver metastases",
        ],
      },
      {
        group: "Markers",
        items: [
          "LDH — dysgerminoma",
          "AFP — yolk sac (also immature teratoma, embryonal)",
          "hCG — choriocarcinoma, embryonal, some dysgerminomas",
        ],
      },
      {
        group: "Management",
        items: [
          "Unilateral salpingo-oophorectomy / USO — fertility-sparing even with advanced disease; leave the uterus and the other ovary",
          "Surgical staging — washings, omentectomy, peritoneal biopsies, palpate/biopsy nodes; inspect the other ovary",
          "BEP / bleomycin etoposide cisplatin — everything except stage IA dysgerminoma and IA grade 1 immature teratoma; cure >90%",
          "Karyotype — dysgerminoma/gonadoblastoma in a phenotypic female: exclude a Y (Swyer) → bilateral gonadectomy",
          "Tumor markers / serial markers — AFP, hCG, LDH for response and recurrence; most relapses within 2 years",
        ],
      },
    ],
    pearls:
      "Clues to a germ cell tumor: under 30, rapid growth, pain (capsule stretch/torsion), unilateral, solid on ultrasound — the opposite of epithelial cancer. Draw AFP, hCG, LDH (and CA-125, inhibin) before surgery in any young woman with a solid adnexal mass. Dermoid: ovarian cystectomy (not oophorectomy); rupture causes chemical peritonitis; malignant transformation (squamous) in older women; association with anti-NMDA receptor encephalitis (psychosis, seizures in a young woman — find and remove the teratoma). Bleomycin → pulmonary fibrosis (baseline PFTs), cisplatin → nephro/ototoxicity, etoposide → secondary leukemia. Dysgerminoma is the ovarian counterpart of seminoma: exquisitely radiosensitive, but chemotherapy is preferred to preserve fertility.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-epithelial-ovarian",
    domain: "endo-tumors",
    name: "Epithelial ovarian cancer",
    org: TUMORS,
    prompt: `64F with 4 months of bloating, early satiety and increasing abdominal girth. Fixed 10 cm complex left adnexal mass, ascites, nodular cul-de-sac; CA-125 1,240. Her sister had breast cancer at 42.\n\nList the epithelial subtypes with a clue each, the risk and protective factors, the workup and referral rule, and management.`,
    keyPoints: [
      {
        group: "Subtypes",
        items: [
          "Serous / high-grade serous — most common (~70%); psammoma bodies; arises in the fallopian tube fimbria (STIC); p53; BRCA-linked; often bilateral",
          "Mucinous — huge multiloculated unilateral mass; CEA/CA19-9, KRAS; pseudomyxoma peritonei is usually an appendiceal primary",
          "Endometrioid / clear cell — arise from endometriosis; endometrioid pairs with synchronous endometrial cancer; clear cell → hypercalcemia, VTE",
          "Brenner — transitional (urothelial-like) epithelium, Walthard nests, coffee-bean nuclei; almost always benign",
          "Krukenberg / metastatic — signet-ring cells from stomach or colon; bilateral, solid; check the GI tract and breast",
        ],
      },
      {
        group: "Risk & protection",
        items: [
          "BRCA1 / BRCA2 — ~40% and ~15–20% lifetime risk; risk-reducing salpingo-oophorectomy at 35–40 (BRCA1) or 40–45 (BRCA2)",
          "Lynch syndrome / Lynch — 10–12% ovarian, plus endometrial (40–60%) and colon; MLH1/MSH2",
          "Nulliparity / infertility / endometriosis — more lifetime ovulations; endometriosis → endometrioid and clear cell",
          "OCPs / breastfeeding / tubal ligation — protective; ≥5 years of OCPs roughly halves risk; opportunistic salpingectomy",
        ],
      },
      {
        group: "Workup",
        items: [
          "Transvaginal ultrasound / TVUS — solid components, thick septations, papillary projections, ascites, Doppler flow = malignant features",
          "CA-125 — triage in POSTmenopausal women (>35); nonspecific premenopausal (endometriosis, fibroids, PID, menses, pregnancy)",
          "CT abdomen and pelvis / CT — omental caking, ascites, nodes, pleural effusion; there is NO screening test for average-risk women",
          "Gyn-oncology referral / gyn onc — postmenopausal + mass + CA-125 >35; ascites; fixed or nodular mass; family history",
        ],
      },
      {
        group: "Management",
        items: [
          "Staging laparotomy / cytoreduction — TAH-BSO, omentectomy, washings, peritoneal biopsies, nodes; optimal debulking = <1 cm residual",
          "Carboplatin + paclitaxel — adjuvant for everything beyond stage IA/IB grade 1; neoadjuvant then interval debulking if unresectable",
          "PARP inhibitor / olaparib — maintenance for BRCA/HRD-positive disease; bevacizumab is the other maintenance option",
        ],
      },
    ],
    pearls:
      "Symptoms are vague but persistent: bloating, early satiety, pelvic/abdominal pain, urinary urgency more than 12 days a month in a woman over 50 — 75% present at stage III. Screening with CA-125 and ultrasound does not reduce mortality (USPSTF D), so the only prevention is risk-reducing surgery in mutation carriers and opportunistic salpingectomy. Sister with breast cancer at 42 + ovarian cancer = test for BRCA. Type II high-grade serous behaves like a tubal cancer; type I (low-grade serous, mucinous, endometrioid, clear cell) is slower and less chemosensitive. Fertility-sparing USO is acceptable for stage IA in a young woman. CA-125 rises with anything that irritates the peritoneum — interpret it against the ultrasound, never alone.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-adnexal-mass",
    domain: "endo-tumors",
    name: "Adnexal mass by age",
    org: TUMORS,
    prompt: `Three patients each have a 6 cm adnexal mass: a 7-year-old with lower abdominal pain, a 27-year-old with a positive pregnancy test, and a 68-year-old with CA-125 of 90.\n\nList the leading causes of an adnexal mass in each age group with the clue for each, the tests that sort them, and the rules for observe vs operate.`,
    keyPoints: [
      {
        group: "Premenarchal",
        items: [
          "Germ cell tumor / malignant germ cell — most childhood ovarian neoplasms are germ cell; a solid mass in a child is malignant until proven otherwise → AFP, hCG, LDH",
          "Neonatal ovarian cyst / follicular cyst — from maternal hormones in the newborn, or peri-menarche; usually regress",
        ],
      },
      {
        group: "Reproductive age",
        items: [
          "Functional cyst / corpus luteum — simple, <5–8 cm, resolves in 6–8 weeks; a hemorrhagic corpus luteum mimics ectopic",
          "Ectopic — positive hCG, no intrauterine pregnancy, adnexal mass ± free fluid; the can't-miss",
          "Endometrioma — 'chocolate cyst': homogeneous ground-glass echoes, dysmenorrhea, dyspareunia, infertility",
          "Dermoid / mature teratoma — most common neoplasm; fat, calcification, hair on ultrasound; torsion",
          "Tubo-ovarian abscess / TOA — fever, cervical motion tenderness, PID history; complex multiloculated mass",
        ],
      },
      {
        group: "Postmenopausal",
        items: [
          "Epithelial ovarian cancer / ovarian cancer — solid parts, septations, ascites, CA-125 >35; gyn-onc",
          "Fibroma / thecoma / cystadenoma — benign solid or simple; a simple cyst <10 cm can be watched even after menopause",
          "Metastasis / Krukenberg — breast or GI primary; bilateral solid",
          "Hydrosalpinx / paratubal cyst / diverticular abscess — non-ovarian mimics: tubular, or extra-ovarian on imaging",
        ],
      },
      {
        group: "Sorting tests & rules",
        items: [
          "β-hCG — first in anyone who could be pregnant",
          "Transvaginal ultrasound / TVUS — simple vs complex: septations, solid parts, papillary projections, Doppler flow = malignant features",
          "CA-125 — postmenopausal only for triage; premenopausal it is too nonspecific to change management",
          "Observe / expectant / repeat ultrasound — simple cyst <10 cm and asymptomatic at any age; re-image in 6–12 weeks; OCPs do NOT shrink an existing cyst",
          "Operate / surgery / laparoscopy — symptomatic, >10 cm, solid/complex, growing, torsion; postmenopausal with raised CA-125 → gyn-onc",
        ],
      },
    ],
    pearls:
      "Age is the first sort: premenarchal masses are germ cell until proven otherwise, reproductive-age masses are mostly functional or benign, postmenopausal complex masses are cancer until proven otherwise. Torsion: sudden severe pain with nausea in a woman with a mass >5 cm (dermoid classic); Doppler flow can be PRESENT — diagnose clinically and detorse, keeping the ovary even if it looks dusky. In pregnancy the corpus luteum cyst resolves by ~16 weeks; a persistent >6 cm or complex mass is removed in the second trimester. Draw AFP/hCG/LDH in any young patient with a solid mass before surgery. Endometrioma: cystectomy lowers ovarian reserve — weigh against fertility plans.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-endometrial",
    domain: "endo-tumors",
    name: "Endometrial hyperplasia & cancer",
    org: TUMORS,
    prompt: `58F, menopause at 53, one episode of vaginal bleeding. BMI 38, type 2 diabetes, nulliparous, took tamoxifen for 5 years. Endometrial stripe 14 mm.\n\nList the risk factors (they share one mechanism), the two cancer types, the workup for postmenopausal bleeding, and management from hyperplasia through cancer.`,
    keyPoints: [
      {
        group: "Risk factors — unopposed estrogen",
        items: [
          "Obesity — peripheral aromatization of androgens; the biggest modifiable risk; diabetes and hypertension travel with it",
          "PCOS / chronic anovulation — no progesterone ever opposes the estrogen; hyperplasia even in the 30s",
          "Nulliparity / early menarche / late menopause — more lifetime estrogen exposure",
          "Tamoxifen / estrogen-only HRT — estrogen agonist on the endometrium; never estrogen alone with a uterus",
          "Lynch syndrome / granulosa cell tumor — Lynch 40–60% lifetime risk (screen from 30–35); estrogen-secreting tumor",
        ],
      },
      {
        group: "Types",
        items: [
          "Endometrioid — type I: estrogen-driven, arises from hyperplasia, PTEN; ~80%, obese patients, good prognosis",
          "Serous / clear cell — type II: p53, arises in an atrophic endometrium in older thinner women; aggressive, spreads like ovarian cancer",
          "Endometrial hyperplasia — without atypia (1–3% progress) vs atypical/EIN (~30–40% harbor concurrent cancer)",
          "Endometrial polyp / atrophy — the benign bleeders; atrophy is the most common cause of postmenopausal bleeding overall",
        ],
      },
      {
        group: "Workup",
        items: [
          "Transvaginal ultrasound / TVUS — stripe ≤4 mm in postmenopausal bleeding = cancer risk <1%, can stop there",
          "Endometrial biopsy / EMB — office pipelle; first test for stripe >4 mm, recurrent bleeding, or ANY bleeding on tamoxifen",
          "Hysteroscopy / D&C — insufficient sample, persistent bleeding after a negative biopsy, or a focal lesion/polyp",
        ],
      },
      {
        group: "Management",
        items: [
          "Progestin / LNG-IUD — hyperplasia without atypia; levonorgestrel IUD is most effective; re-biopsy at 3–6 months",
          "Hysterectomy — atypical hyperplasia/EIN or cancer: total hysterectomy + BSO with surgical staging (sentinel nodes)",
          "Fertility-sparing / megestrol — atypical hyperplasia or grade 1 stage IA cancer wanting children: high-dose progestin or LNG-IUD, biopsy every 3 months",
          "Radiation / chemotherapy — adjuvant by stage, grade and histology; carboplatin-paclitaxel for advanced or serous disease",
        ],
      },
    ],
    pearls:
      "Postmenopausal bleeding is endometrial cancer in ~10% until biopsy says otherwise — and it is the reason endometrial cancer is usually caught at stage I (90% 5-year survival). Tamoxifen thickens the ultrasound stripe unreliably, so any bleeding on tamoxifen goes straight to biopsy. Lynch: annual endometrial biopsy from 30–35 and risk-reducing hysterectomy + BSO once childbearing is done. Staging is surgical (FIGO); type II serous gets omentectomy like ovarian cancer. Protective: combined OCPs, progestin IUD, parity, physical activity. Before 45, biopsy for AUB with unopposed-estrogen risk, failed medical therapy, or persistent bleeding.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-gtd",
    domain: "endo-tumors",
    name: "Gestational trophoblastic disease",
    org: TUMORS,
    prompt: `23F at 11 weeks by dates with heavy bleeding, hyperemesis, a uterus of 16-week size, BP 150/95, no fetal heart tones; hCG 310,000; ultrasound shows a 'snowstorm' with bilateral 7 cm ovarian cysts.\n\nName the diagnosis, contrast the two moles, list the hormonal findings the hCG explains, name the malignant forms, and give management including surveillance.`,
    keyPoints: [
      {
        group: "Moles",
        items: [
          "Complete mole — 46,XX all paternal (empty egg + sperm), no fetal parts, diffuse 'snowstorm'; 15–20% become GTN",
          "Partial mole — 69,XXY triploid (two sperm), fetal parts present, focal changes; <5% GTN; often diagnosed as a missed abortion",
        ],
      },
      {
        group: "hCG-driven findings",
        items: [
          "Theca lutein cysts — bilateral, from hCG stimulation; resolve after evacuation — do not remove",
          "Hyperthyroidism — hCG shares the α-subunit with TSH; β-blocker before anesthesia if thyrotoxic",
          "Hyperemesis — exaggerated hCG effect",
          "Early preeclampsia — hypertension/proteinuria before 20 weeks = mole until proven otherwise",
          "Size > dates / uterus larger than dates — uterus bigger than expected with hCG >100,000 and no fetal heart",
        ],
      },
      {
        group: "Malignant GTN",
        items: [
          "Invasive mole — molar villi invade myometrium; the most common GTN after a mole; rarely metastasizes",
          "Choriocarcinoma — after ANY pregnancy (50% mole, 25% term, 25% abortion/ectopic); no villi; hemorrhagic lung mets; hCG very high",
          "Placental site trophoblastic tumor / PSTT — low hCG, high hPL; chemo-resistant → hysterectomy",
        ],
      },
      {
        group: "Management",
        items: [
          "Suction D&C / suction curettage — evacuation with oxytocin running; hysterectomy if done childbearing (still needs hCG follow-up)",
          "Weekly hCG — until undetectable ×3, then monthly for 6 months (complete mole); plateau over 3 or rise over 2 weeks = GTN",
          "Contraception — reliable (OCP is fine) throughout surveillance so a new pregnancy cannot confound the hCG",
          "Methotrexate / actinomycin D — single-agent for low-risk GTN (WHO score <7); EMA-CO for high-risk; cure >90%",
          "RhoGAM / chest X-ray / TSH — Rh-negative gets anti-D; baseline chest film for lung mets; check thyroid function",
        ],
      },
    ],
    pearls:
      "Complete mole = the classic vignette (bleeding, hyperemesis, size > dates, hCG >100,000, snowstorm, theca lutein cysts, early preeclampsia, hyperthyroidism); partial mole usually looks like a missed abortion and is diagnosed on pathology. Never induce with misoprostol/oxytocin alone or do a sharp curettage first — suction evacuation; risk of embolization and of leaving tissue that becomes GTN. After a partial mole one confirmatory undetectable hCG a month after normalization is enough. Choriocarcinoma in any woman with a positive hCG and lung/brain/liver mets after a pregnancy — biopsy is dangerous (bleeds), treat on hCG. Repeat mole risk 1–2%; fertility and pregnancy outcomes after chemotherapy are normal, wait 12 months after treatment.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-uterine-masses",
    domain: "endo-tumors",
    name: "Uterine masses: fibroids, adenomyosis, sarcoma",
    org: TUMORS,
    prompt: `38F with heavy menses, iron deficiency, pelvic pressure and urinary frequency. Uterus 16-week size, irregular, mobile, nontender. hCG negative.\n\nName the estrogen-dependent uterine masses and how to tell them apart, the fibroid types by symptom, the red flag for sarcoma, the workup, and management by goal.`,
    keyPoints: [
      {
        group: "Diagnoses",
        items: [
          "Leiomyoma / fibroids — most common pelvic tumor; irregular, enlarged, mobile, nontender uterus; estrogen/progesterone-dependent, shrink after menopause",
          "Adenomyosis — endometrium within myometrium; boggy, TENDER, symmetrically enlarged uterus; dysmenorrhea + menorrhagia in a parous woman in her 40s",
          "Leiomyosarcoma — rapid growth, especially after menopause; pain, bleeding; cannot be excluded by imaging; arises de novo, not from a fibroid",
          "Endometrial polyp — intermenstrual or postmenopausal spotting; seen on saline sonohysterogram",
        ],
      },
      {
        group: "Fibroid locations",
        items: [
          "Submucosal — heavy bleeding, infertility, miscarriage; hysteroscopic resection",
          "Intramural — most common; bulk symptoms plus bleeding",
          "Subserosal / pedunculated — pressure, urinary frequency, constipation; can torse; least bleeding",
          "Degeneration / red degeneration — acute pain and low-grade fever when the fibroid outgrows its blood supply, classic in pregnancy; NSAIDs",
        ],
      },
      {
        group: "Workup",
        items: [
          "Transvaginal ultrasound / TVUS — first line after hCG; number, size, location",
          "Saline sonohysterogram / hysteroscopy — cavity: submucosal fibroid vs polyp",
          "MRI pelvis — adenomyosis (junctional zone >12 mm), fibroid mapping before myomectomy or embolization",
        ],
      },
      {
        group: "Management",
        items: [
          "LNG-IUD / OCP / tranexamic acid — bleeding control; iron for the anemia; endometrial biopsy first if ≥45 or risk factors",
          "GnRH agonist / leuprolide — shrinks fibroids 35–60% before surgery; ≤6 months unless add-back (bone loss); regrow after stopping",
          "Myomectomy — wants future fertility; hysteroscopic (submucosal), laparoscopic or abdominal",
          "Uterine artery embolization / UAE — done with childbearing, wants to keep the uterus; post-embolization pain/fever",
          "Hysterectomy — definitive; the only cure for adenomyosis; needed for suspected sarcoma (no morcellation)",
        ],
      },
    ],
    pearls:
      "Fibroids vs adenomyosis on exam: fibroids make the uterus irregular and non-tender; adenomyosis makes it symmetrically boggy and tender. Asymptomatic fibroids need no treatment — they involute after menopause. Oral GnRH antagonist combinations (elagolix or relugolix with add-back) treat heavy bleeding medically. In pregnancy fibroids grow in the first trimester, cause pain (red degeneration), malpresentation, abruption and postpartum hemorrhage — do not remove them at cesarean. A postmenopausal 'fibroid' that grows is sarcoma until proven otherwise; power morcellation can spread an unsuspected sarcoma (FDA warning). Adenomyosis: LNG-IUD helps, hysterectomy cures.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-breast-mass",
    domain: "endo-tumors",
    name: "Breast mass & nipple discharge",
    org: TUMORS,
    prompt: `34F with a firm, 2 cm, mobile, rubbery, painless lump in the upper outer quadrant found in the shower. Separately, a 47F with spontaneous bloody discharge from a single duct of one breast.\n\nList the benign and malignant causes of a breast mass with the clue for each, the nipple-discharge differential, and the age-based workup.`,
    keyPoints: [
      {
        group: "Benign masses",
        items: [
          "Fibroadenoma — 15–35; firm, rubbery, mobile, painless; grows with estrogen (pregnancy, OCPs); observe or excise if large/growing",
          "Fibrocystic change / simple cyst — cyclic tender lumpy breasts, 30s–40s; aspiration yields clear/green fluid and the mass vanishes",
          "Fat necrosis — after trauma or surgery; firm irregular mass that mimics cancer, with calcifications; biopsy to prove it",
          "Phyllodes — rapidly enlarging, large, fibroadenoma-like; leaf-like projections; wide local excision (can be malignant)",
        ],
      },
      {
        group: "Malignant",
        items: [
          "Invasive ductal carcinoma / IDC — most common (~75%); hard, fixed, irregular; skin dimpling, nipple retraction",
          "Invasive lobular carcinoma / ILC — bilateral/multicentric, subtle thickening rather than a discrete lump; E-cadherin loss",
          "DCIS — clustered microcalcifications on mammogram, usually no palpable mass; precursor of invasive cancer",
          "Inflammatory breast cancer — peau d'orange, warm red swollen breast; dermal lymphatic invasion; stage III; 'mastitis' that fails antibiotics",
          "Paget disease of the nipple / Paget — eczematous scaling unilateral nipple; underlying DCIS or invasive cancer; punch biopsy",
        ],
      },
      {
        group: "Nipple discharge",
        items: [
          "Intraductal papilloma / papilloma — unilateral, single-duct, spontaneous bloody or serous; most common cause of bloody discharge; duct excision",
          "Galactorrhea / prolactin — bilateral, milky, multiduct → prolactin, TSH, hCG, medication list",
          "Duct ectasia — green/brown sticky multiduct discharge, perimenopausal, subareolar; benign",
        ],
      },
      {
        group: "Workup",
        items: [
          "Ultrasound / US — first for <30, pregnant or lactating: cyst vs solid",
          "Mammogram / diagnostic mammogram — first for ≥30, with targeted ultrasound",
          "Core needle biopsy — any solid or suspicious mass (BI-RADS 4–5); FNA is for a simple cyst",
          "Triple test — exam + imaging + biopsy; if any one is suspicious, excise even when the others are benign",
        ],
      },
    ],
    pearls:
      "A normal mammogram never excludes cancer in a palpable mass — a palpable lump gets ultrasound and biopsy regardless. Cyst aspiration: bloody fluid or a residual mass → biopsy; clear fluid and complete resolution → done. Mastitis in a lactating woman: continue breastfeeding, dicloxacillin/cephalexin; ultrasound for abscess; if it fails to resolve, biopsy for inflammatory cancer. Screening: USPSTF 2024 biennial mammography 40–74; BRCA carriers annual MRI + mammogram from 25–30. Bloody single-duct discharge in a woman over 40 needs mammogram, ultrasound and duct excision — papilloma is most common but DCIS/papillary carcinoma must be excluded. Pregnancy: ultrasound first, biopsy is safe, mammogram with shielding is safe.",
    reviewed: REVIEWED,
  },
  {
    id: "endo-lower-tract-cancer",
    domain: "endo-tumors",
    name: "Cervical, vulvar & vaginal cancer",
    org: TUMORS,
    prompt: `44F with postcoital bleeding and a friable 3 cm exophytic cervical lesion; never screened. Separately, a 72F with a pruritic white vulvar plaque that has become a 1.5 cm ulcer.\n\nFor cervical, vulvar and vaginal cancer give the cause and precursor, the presentation, how each is staged, and management by stage.`,
    keyPoints: [
      {
        group: "Cervical",
        items: [
          "HPV 16 / 18 — ~70% of cervical cancer; E6 degrades p53, E7 inactivates Rb; risk: smoking, HIV, many partners, early coitarche, no screening",
          "Squamous cell carcinoma / cervical SCC — ~75%, from CIN3; postcoital bleeding, watery discharge, friable mass; adenocarcinoma ~25% (endocervical, HPV 18)",
          "Clinical staging — staged CLINICALLY (exam, cystoscopy/proctoscopy; imaging allowed since 2018): IB cervix only, IIB parametrium, IIIB pelvic wall/hydronephrosis, IVA bladder/rectum",
          "Cone / simple hysterectomy — IA1 (≤3 mm invasion): cone biopsy if fertility desired, otherwise simple hysterectomy",
          "Radical hysterectomy / chemoradiation — IA2–IB2 (<4 cm): radical hysterectomy + pelvic nodes (or radiation); IB3 and IIB+: cisplatin chemoradiation + brachytherapy",
        ],
      },
      {
        group: "Vulvar",
        items: [
          "Vulvar SCC / vulvar cancer — >90%; two routes: HPV/VIN in younger smokers, lichen sclerosus/differentiated VIN in older women; pruritus + plaque or ulcer",
          "Lichen sclerosus — white parchment 'figure-of-8' around vulva and anus, pruritus, postmenopausal; 4–5% → SCC; clobetasol, then surveillance",
          "Extramammary Paget / vulvar Paget — red velvety eczematous plaque with pruritus; exclude an underlying adenocarcinoma; wide excision, recurs",
          "Vulvar melanoma — second most common vulvar cancer; pigmented raised lesion; poor prognosis; excise with margins",
          "Surgical staging / inguinofemoral nodes — vulvar cancer is staged surgically: radical local excision + sentinel or inguinofemoral node dissection once depth >1 mm",
        ],
      },
      {
        group: "Vaginal",
        items: [
          "Vaginal SCC — rare; upper posterior wall; HPV/VAIN; a lesion touching the cervix is cervical cancer, touching the vulva is vulvar cancer",
          "Clear cell adenocarcinoma / DES — in-utero DES exposure; vaginal adenosis; adolescents and young women",
          "Sarcoma botryoides / embryonal rhabdomyosarcoma — grape-like mass protruding from the vagina in a girl under 5",
        ],
      },
    ],
    pearls:
      "Any visible cervical lesion is biopsied directly — a Pap is a screening test, not a diagnostic one. Cervical cancer is the only gynecologic cancer staged clinically because much of the world treats without surgery. Fertility-sparing options: cone for IA1, radical trachelectomy for small IB1. Cervical cancer in pregnancy: colposcopy and biopsy are safe; early-stage disease can be deferred until after delivery. Vulvar lesions: biopsy anything persistent — never treat a vulvar 'dermatitis' empirically for months; lichen sclerosus needs lifelong clobetasol and follow-up. Vulvar cancer with ≤1 mm invasion (IA) needs no groin nodes. HPV vaccination prevents cervical, vulvar, vaginal, anal and oropharyngeal cancer; screening still continues after vaccination.",
    reviewed: REVIEWED,
  },
];
