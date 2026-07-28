// src/data/obGynSurgeryDrills.ts
/**
 * Benign gynaecologic surgery drills — the short-answer domain of the OB/GYN
 * drill bank.
 *
 * Deliberately a different shape from the guideline drills alongside them: 5-7
 * items of 2-4 words rather than 12-15 full sentences, so a whole drill is
 * answerable in about a dozen words. Each operation is split across up to four
 * dimensions (indications & route / complications / anatomy & steps / peri-op)
 * instead of one long drill.
 *
 * ITEM RULE — the coverage matcher credits an item when the ITEM's tokens appear
 * in the student's answer, so item wording decides whether a correct answer
 * scores. Items are the minimal distinctive phrase, spelled out, never
 * abbreviated: "Bile duct injury" is credited when a student writes it in full,
 * "CBD injury" is not. Enforced by scripts/build_gyn_surgery_drills.py.
 *
 * GENERATED FILE — re-run the build rather than hand-editing.
 * Design: docs/superpowers/specs/2026-07-27-benign-gyn-surgery-drills-design.md
 * Educational use only; confirm current practice before acting clinically.
 */
import type { GuidelineDrill } from "./guidelineDrillBank";

export const OB_GYN_SURGERY_DRILLS: GuidelineDrill[] = [
  {
    "id": "gyns-bartholin-gland-marsupialization-complications",
    "domain": "gyn-surgery",
    "name": "Bartholin gland marsupialization — complications",
    "org": "ACOG",
    "prompt": "Name the 7 complications after Bartholin drainage: 2 early failures, 2 wound problems, 2 late problems, and the 1 diagnosis you must not miss.",
    "keyPoints": [
      {
        "group": "Early failure",
        "items": [
          "Cyst recurrence",
          "Word catheter dislodgement"
        ]
      },
      {
        "group": "Wound",
        "items": [
          "Vulvar hematoma",
          "Cellulitis"
        ]
      },
      {
        "group": "Late",
        "items": [
          "Dyspareunia",
          "Vulvar scarring"
        ]
      },
      {
        "group": "Never miss",
        "items": [
          "Bartholin carcinoma"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Recurrence is the commonest complication, roughly 5 to 15% after marsupialization and higher after incision and drainage alone. The usual mechanism of early failure is a Word catheter that falls out in the first days before a tract has formed — from underfilling the balloon, an incision made too large, or placing it on labial skin. The gland lies deep to the bulbospongiosus muscle beside the vestibular bulb, a venous plexus, which is why full gland excision can bleed briskly and produce a vulvar hematoma; that operation belongs in theatre, not the office. Dyspareunia and vulvar scarring follow excision far more often than marsupialization, one more reason to keep excision for repeated failures. And the career-defining miss: a woman over 40 with a 'recurrent Bartholin cyst' that is actually adenocarcinoma or squamous carcinoma of the gland. Any mass that is solid, fixed, irregular, or simply keeps coming back in an older woman gets tissue, not another drainage."
  },
  {
    "id": "gyns-bartholin-gland-marsupialization-indications",
    "domain": "gyn-surgery",
    "name": "Bartholin gland marsupialization — procedure choice and biopsy",
    "org": "ACOG",
    "prompt": "For Bartholin gland disease, name 7 things: 2 drainage procedures that create a tract, 2 indications to treat, 2 triggers for biopsy, and the 1 definitive operation.",
    "keyPoints": [
      {
        "group": "Drainage that creates a tract",
        "items": [
          "Word catheter",
          "Marsupialization"
        ]
      },
      {
        "group": "Indication",
        "items": [
          "Recurrent abscess",
          "Symptomatic cyst"
        ]
      },
      {
        "group": "Biopsy trigger",
        "items": [
          "Age over 40",
          "Solid or irregular mass"
        ]
      },
      {
        "group": "Definitive",
        "items": [
          "Gland excision"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Simple incision and drainage alone is the wrong plan — it recurs, because nothing keeps the tract open. The Word catheter is the office first line: a stab incision of about 5 mm just inside the hymenal ring, balloon inflated with 2 to 3 mL of saline, tip tucked into the vagina, left 4 to 6 weeks to epithelialise a permanent drainage tract. Marsupialization is for recurrence or a large cyst — a vertical incision inside the hymenal ring, then the cyst wall everted and sutured to the vaginal mucosa with interrupted absorbable sutures. Never place the incision on external labial skin; that creates a chronically draining external fistula. Asymptomatic cysts in women under 40 need nothing. Antibiotics only for surrounding cellulitis, systemic signs, pregnancy, or immunosuppression, with gonorrhoea and chlamydia testing when risk factors exist. In any woman over 40, or at any age with a solid, fixed, or irregular mass, biopsy the wall or excise the gland: Bartholin carcinoma is rare but is exactly what a lazy drainage misses. Excision is the last resort because the vestibular bulb venous plexus bleeds."
  },
  {
    "id": "gyns-cervical-excision-anatomy",
    "domain": "gyn-surgery",
    "name": "Cervical excision — anatomy of the cone",
    "org": "ASCCP",
    "prompt": "Name the 4 landmarks that define an adequate cervical excision and the 3 structures at risk if you cut too deep or too lateral — 7 items.",
    "keyPoints": [
      {
        "group": "Landmarks",
        "items": [
          "Transformation zone",
          "Squamocolumnar junction",
          "Endocervical canal",
          "Internal os"
        ]
      },
      {
        "group": "At risk",
        "items": [
          "Uterine artery cervical branch",
          "Bladder base",
          "Ureter injury"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Dysplasia arises in the transformation zone, between the original and the current squamocolumnar junction, so the specimen must contain that whole zone plus enough canal for glandular disease. The junction migrates into the canal with age and parity, which is why an older woman more often needs a deeper, narrower cone and a young woman a shallow, wide one. The descending cervicovaginal branch of the uterine artery runs at 3 and 9 o'clock laterally — that is where post-cone bleeding comes from and where lateral hemostatic sutures or infiltration with a vasoconstrictor go. The ureter passes about 1.5-2 cm lateral to the cervix at the level of the internal os, so a deep lateral cut is the rare route to ureteric injury. The bladder base lies immediately anterior above the internal os. Cutting up to or past the internal os is what produces incompetence, so the apex of the cone should stop short of it."
  },
  {
    "id": "gyns-cervical-excision-complications",
    "domain": "gyn-surgery",
    "name": "Cervical excision — complications",
    "org": "ASCCP",
    "prompt": "Name 7 complications of cervical excision — 2 early, 2 late gynecologic, 3 obstetric.",
    "keyPoints": [
      {
        "group": "Early, first two weeks",
        "items": [
          "Delayed bleeding",
          "Vaginal wall burn"
        ]
      },
      {
        "group": "Late gynecologic",
        "items": [
          "Cervical stenosis",
          "Inadequate future colposcopy"
        ]
      },
      {
        "group": "Obstetric",
        "items": [
          "Preterm birth",
          "Cervical insufficiency",
          "Preterm rupture of membranes"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Delayed hemorrhage typically appears around day 7-14 as the eschar separates, and is managed with a speculum, silver nitrate or Monsel solution, and a suture at 3 or 9 o'clock if it is arterial. Thermal injury to the vaginal sidewall is the avoidable one: use an insulated speculum with a lateral wall retractor and a smoke evacuator. Frank infection is uncommon and prophylactic antibiotics are not routine. Obstetric risk scales with the depth and volume of cervix removed, not with the diagnosis. A single shallow loop excision carries a modest increase; depth beyond roughly 10-15 mm, a repeat excision, or a cold knife cone carries a clearly higher rate of preterm birth, preterm prelabor rupture of membranes and second-trimester loss. That is the counseling conversation for a 24-year-old with high-grade disease: take what is needed, take it once, and take it no deeper than necessary. In a later pregnancy, transvaginal cervical length surveillance is the reasonable response; prophylactic cerclage on the basis of prior excision alone is not indicated. Stenosis runs a few percent, higher after cone, after a top-hat endocervical excision, and in postmenopausal women, and it causes hematometra and a colposcopy that can no longer see the new squamocolumnar junction — which matters because these patients need surveillance for 25 years."
  },
  {
    "id": "gyns-cervical-excision-indications",
    "domain": "gyn-surgery",
    "name": "Cervical excision — loop excision versus cold knife cone",
    "org": "ASCCP",
    "prompt": "Name 3 features that favor loop excision and 4 that call for cold knife conization — 7 items.",
    "keyPoints": [
      {
        "group": "Loop electrosurgical excision",
        "items": [
          "Ectocervical lesion",
          "Visible transformation zone",
          "High grade squamous lesion"
        ]
      },
      {
        "group": "Cold knife conization",
        "items": [
          "Adenocarcinoma in situ",
          "Suspected microinvasion",
          "Endocervical canal extension",
          "Unsatisfactory colposcopy"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "The whole argument is margin interpretability. Loop excision is quick, office-based under local anesthesia, and adequate for a squamous lesion whose whole transformation zone you can see — but it leaves thermal artifact at the edge. When the pathologist must measure depth of invasion to the tenth of a millimeter, or must call a margin clean in glandular disease, that artifact is unacceptable, so a scalpel is used under anesthesia. Adenocarcinoma in situ is the archetype: it is often multifocal with skip lesions high in the canal, so excision must be a single intact cylindrical specimen, oriented for the pathologist; current guidance accepts a loop specimen only when it comes out as one intact cylinder with interpretable margins, and margin status drives whether hysterectomy follows or surveillance with endocervical sampling is acceptable in a patient wanting fertility. Cytology-histology discrepancy, recurrence after prior excision, and a positive endocervical margin needing re-excision also push toward cold knife. Excision is both diagnostic and therapeutic; ablation is only acceptable for a squamous lesion with a fully visible transformation zone, no glandular disease, and no prior treatment."
  },
  {
    "id": "gyns-diagnostic-and-operative-laparoscopy-anatomy",
    "domain": "gyn-surgery",
    "name": "Diagnostic and operative laparoscopy — vessels at entry",
    "org": "AAGL",
    "prompt": "Name the 3 vessels at risk beneath the umbilicus and the 3 vessels at risk at a lateral port (6 total).",
    "keyPoints": [
      {
        "group": "Beneath the umbilicus",
        "items": [
          "Aortic bifurcation",
          "Left common iliac vein",
          "Right common iliac artery"
        ]
      },
      {
        "group": "At a lateral port",
        "items": [
          "Inferior epigastric artery",
          "Superficial epigastric vessels",
          "Superficial circumflex iliac vessels"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "The aorta divides at about L4, which in a thin supine patient sits directly under the umbilicus with only a few centimetres of tissue in between — hence a 45 degree angle of insertion in a normal-weight patient and closer to 90 degrees in an obese one, where the umbilicus has migrated caudally. The left common iliac vein crosses the midline just below the bifurcation and is the great vessel most often injured. The inferior epigastric artery arises from the external iliac, runs lateral to the obliterated umbilical ligament and is NOT seen on transillumination (that only shows the superficial epigastric and superficial circumflex iliac vessels) — site lateral ports under direct laparoscopic view, lateral to the vessel, about 8 cm from the midline in an average adult. A lateral trocar driven too deeply, especially in a thin patient, can reach the external iliac vessels themselves. Use Palmer's point in the left upper quadrant when periumbilical adhesions are likely."
  },
  {
    "id": "gyns-diagnostic-and-operative-laparoscopy-complications",
    "domain": "gyn-surgery",
    "name": "Diagnostic and operative laparoscopy — entry and port-site complications",
    "org": "AAGL",
    "prompt": "Name the 4 injuries that happen at entry and the 2 problems that show up later (6 total).",
    "keyPoints": [
      {
        "group": "At entry",
        "items": [
          "Bowel injury",
          "Great vessel injury",
          "Bladder injury",
          "Gas embolism"
        ]
      },
      {
        "group": "Later",
        "items": [
          "Trocar site hernia",
          "Delayed thermal injury"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Open (Hasson) and Veress entry have similar rates of visceral and vascular injury; open entry mainly reduces failed entry and preperitoneal insufflation, while previous laparotomy is the strongest predictor of adhesions and argues for left upper quadrant entry. Up to half of bowel injuries are missed at the time — the patient returns on day 3-5 with pain out of proportion, single-port tenderness, fever and sometimes a low white count, and a normal-looking abdomen must not reassure you. An electrosurgical injury declares itself later still, because coagulative necrosis takes days to perforate. Drain the bladder before entry, and close the fascia of any port 10 mm or larger to prevent a Richter hernia (small bowel knuckle, obstruction with the patient still passing flatus). Gas embolism gives sudden hypotension, a fall in end-tidal carbon dioxide and a mill-wheel murmur: stop insufflation, desufflate, give 100 percent oxygen and place the patient head-down in the left lateral position."
  },
  {
    "id": "gyns-diagnostic-and-operative-laparoscopy-periop",
    "domain": "gyn-surgery",
    "name": "Diagnostic and operative laparoscopy — pneumoperitoneum and positioning",
    "org": "AAGL",
    "prompt": "Name the 3 physiological effects of carbon dioxide pneumoperitoneum and the 2 harms of steep head-down positioning (5 total).",
    "keyPoints": [
      {
        "group": "Pneumoperitoneum",
        "items": [
          "Hypercapnia and acidosis",
          "Reduced venous return",
          "Raised airway pressure"
        ]
      },
      {
        "group": "Steep head down",
        "items": [
          "Brachial plexus injury",
          "Raised intracranial pressure"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Carbon dioxide is used because it is soluble and non-combustible, but it is absorbed across the peritoneum and the anaesthetist must increase minute ventilation to clear it — a patient with poor pulmonary reserve may not tolerate this. Keep the intra-abdominal pressure at or below 15 mmHg (12 is usually enough); higher pressures splint the diaphragm and compress the inferior vena cava, dropping preload and, paradoxically, masking venous bleeding until you desufflate. Rapid insufflation can trigger a vagal bradycardia or asystole: stop, desufflate, give atropine. Steep Trendelenburg is what makes gynaecologic laparoscopy possible and also what causes face, conjunctival and airway swelling and raised intracranial and intraocular pressure — check for a cuff leak before extubating a long case. Avoid shoulder braces (they cause the brachial plexus stretch); use a non-slip pad and tuck the arms with padded elbows. Shoulder-tip pain from retained gas irritating the diaphragm settles in 24-48 hours."
  },
  {
    "id": "gyns-dilation-and-curettage-complications",
    "domain": "gyn-surgery",
    "name": "Dilation and curettage — complications",
    "org": "ACOG",
    "prompt": "Name 7 complications of dilation and curettage — 3 immediate, 1 infectious, 3 belonging to the classic late syndrome.",
    "keyPoints": [
      {
        "group": "Immediate",
        "items": [
          "Uterine perforation",
          "Cervical laceration",
          "Bowel injury"
        ]
      },
      {
        "group": "Infectious",
        "items": [
          "Endometritis"
        ]
      },
      {
        "group": "Asherman syndrome",
        "items": [
          "Intrauterine adhesions",
          "Secondary amenorrhea",
          "Recurrent pregnancy loss"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Hemorrhage is the other early event, and it comes from three places: atony in a recently pregnant uterus, retained tissue, or a lateral perforation into the uterine vessels — which is why a type and screen belongs on the chart. Asherman syndrome is intrauterine synechiae after the basalis layer is scraped away. Risk is highest with postpartum or postabortal curettage — a soft, recently pregnant uterus — with repeated sharp curettage, and with infection at the time. The presentation is hypomenorrhea or amenorrhea with cyclic pelvic pain from trapped menstrual blood, plus infertility or recurrent loss. Saline infusion sonohysterography or hysterosalpingography screens; hysteroscopy makes the diagnosis and is the treatment, by sharp adhesiolysis under direct vision, often with an intrauterine balloon or device and estrogen to re-epithelialize, and a second-look hysteroscopy. Prevention beats treatment: use suction rather than sharp curettage, stop when the uterus feels gritty rather than curetting repeatedly, and treat infection. The pregnant uterus also perforates far more easily, and cervical priming with misoprostol or osmotic dilators reduces both laceration and perforation."
  },
  {
    "id": "gyns-dilation-and-curettage-indications",
    "domain": "gyn-surgery",
    "name": "Dilation and curettage — indications",
    "org": "ACOG",
    "prompt": "Name 6 indications for dilation and curettage — 3 pregnancy-related, 3 not.",
    "keyPoints": [
      {
        "group": "Pregnancy related",
        "items": [
          "Incomplete miscarriage",
          "Retained products postpartum",
          "Molar pregnancy"
        ]
      },
      {
        "group": "Non-pregnant",
        "items": [
          "Postmenopausal bleeding",
          "Nondiagnostic office biopsy",
          "Cervical stenosis"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Office endometrial biopsy is first-line for evaluating abnormal or postmenopausal bleeding; dilation and curettage is the fallback when the office attempt fails, is insufficient, when the cervix will not admit a pipelle, or when bleeding persists despite a benign result. Blind curettage samples only part of the cavity and misses focal disease, so pair it with hysteroscopy whenever a polyp or focal lesion is suspected. For early pregnancy loss, suction aspiration is preferred over sharp curettage — faster, less blood loss, less pain, less endometrial trauma — and expectant or misoprostol management is equally valid in a stable patient. Retained products after a delivery present as secondary postpartum hemorrhage and are best evacuated under ultrasound guidance, or hysteroscopically, because the puerperal uterus perforates easily and scars easily. Molar pregnancy must be evacuated by suction, with oxytocin after cervical dilation, anti-D if the patient is Rh-negative, and serial human chorionic gonadotropin follow-up. Give doxycycline prophylaxis for induced abortion and uterine instrumentation with pregnancy; routine antibiotics are not indicated for a purely diagnostic curettage."
  },
  {
    "id": "gyns-dilation-and-curettage-periop",
    "domain": "gyn-surgery",
    "name": "Dilation and curettage — perforation, and when to look laparoscopically",
    "org": "ACOG",
    "prompt": "The sound passes to the hilt. Name the 2 steps for a blunt midline perforation and the 4 findings that mandate laparoscopy — 6 items.",
    "keyPoints": [
      {
        "group": "Blunt, midline, stable",
        "items": [
          "Stop the procedure",
          "Observe if stable"
        ]
      },
      {
        "group": "Laparoscopy mandatory",
        "items": [
          "Suction cannula perforation",
          "Fat in the specimen",
          "Lateral perforation bleeding",
          "Hemodynamic instability"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "The decision turns on what went through the hole and where. A blunt sound or dilator through the midline fundus in a stable patient needs only observation with serial vital signs and abdominal exams; a uterotonic helps the uterus contract, and the procedure can be finished later or immediately under ultrasound or hysteroscopic guidance. Anything with a cutting edge — a sharp curette, grasping forceps, a suction cannula, or an activated energy device — that entered the peritoneal cavity may have drawn in or burned bowel or omentum, so inspect. Fat or bowel mucosa in the curettings or the suction canister is omentum or bowel until proven otherwise and means immediate exploration. A lateral perforation threatens the uterine vessels and a broad ligament hematoma. Falling blood pressure, expanding abdominal girth, or persistent bleeding through the cervix means look now, and be prepared to convert to laparotomy. Thermal bowel injury can present 3-7 days later with fever and peritonitis, so discharge instructions matter as much as the intraoperative call."
  },
  {
    "id": "gyns-endometrial-ablation-complications",
    "domain": "gyn-surgery",
    "name": "Endometrial ablation — what goes wrong",
    "org": "AAGL",
    "prompt": "Name 6 complications of endometrial ablation: 2 during the procedure, 2 causes of later pain, and 2 forms of treatment failure.",
    "keyPoints": [
      {
        "group": "During the procedure",
        "items": [
          "Uterine perforation",
          "Thermal bowel injury"
        ]
      },
      {
        "group": "Later pain",
        "items": [
          "Post-ablation syndrome",
          "Haematometra"
        ]
      },
      {
        "group": "Treatment failure",
        "items": [
          "Persistent heavy bleeding",
          "Later hysterectomy"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Perforation is most dangerous when it happens with the energy source active — a thermal bowel burn can declare itself days later with peritonitis, so perforation during an active ablation warrants laparoscopic inspection. Post-ablation tubal sterilisation syndrome is cyclic pain from menstrual blood trapped behind scar in a pocket of surviving cornual endometrium, classically in a woman with prior tubal ligation; the same mechanism traps blood centrally as a haematometra. Resectoscopic ablation adds the risk of fluid overload from hypotonic distension media. About one in five to one in four women comes to hysterectomy within five years, and failure is more likely in women under 40 and in those with dysmenorrhoea, high parity, prior tubal ligation or submucosal fibroids."
  },
  {
    "id": "gyns-endometrial-ablation-indications",
    "domain": "gyn-surgery",
    "name": "Endometrial ablation — who qualifies",
    "org": "ACOG",
    "prompt": "Name 7 items: 2 things required before ablation, 2 features of the right candidate, and 3 contraindications.",
    "keyPoints": [
      {
        "group": "Required first",
        "items": [
          "Endometrial sampling",
          "Completed childbearing"
        ]
      },
      {
        "group": "Right candidate",
        "items": [
          "Heavy menstrual bleeding",
          "Normal uterine cavity"
        ]
      },
      {
        "group": "Contraindications",
        "items": [
          "Endometrial hyperplasia",
          "Endometrial cancer",
          "Active pelvic infection"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Ablation is for the premenopausal woman with heavy menstrual bleeding from a benign, structurally normal cavity who has finished having children and in whom medical therapy has failed or is unwanted. Sampling beforehand is non-negotiable: destroying the endometrium over an unrecognised hyperplasia or carcinoma both treats nothing and hides it. Expect roughly 85-90% satisfaction but amenorrhoea in only about a quarter to a half; the levonorgestrel intrauterine system gives comparable bleeding control without surgery and should be offered first. Also unsuitable: any desire for future pregnancy, postmenopausal women, a septate or markedly distorted cavity, a large submucosal fibroid, and a prior classical caesarean or transmural myomectomy scar, where the thin myometrium risks thermal injury to adjacent organs."
  },
  {
    "id": "gyns-endometrial-ablation-periop",
    "domain": "gyn-surgery",
    "name": "Endometrial ablation — life after ablation",
    "org": "ACOG",
    "prompt": "Name 6 things to cover after endometrial ablation: 2 about future pregnancy, 2 about the scarred cavity, and 2 about new bleeding.",
    "keyPoints": [
      {
        "group": "Future pregnancy",
        "items": [
          "Reliable contraception",
          "Abnormal placentation"
        ]
      },
      {
        "group": "The scarred cavity",
        "items": [
          "Intrauterine adhesions",
          "Difficult endometrial sampling"
        ]
      },
      {
        "group": "If bleeding returns",
        "items": [
          "Endometrial stripe unreliable",
          "Hysteroscopy and biopsy"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Ablation is not sterilisation. Pregnancy in an ablated uterus carries high rates of abnormal placentation, miscarriage, prematurity and malpresentation, so contraception must be secured — often bilateral salpingectomy at the same sitting, since an intrauterine device sits poorly in an ablated cavity. Synechiae and a contracted cavity make office sampling and hysteroscopic access difficult, and residual endometrium can be sequestered behind scar, so endometrial thickness on transvaginal ultrasound becomes uninterpretable. Any new or postmenopausal bleeding after ablation therefore needs hysteroscopically directed sampling rather than reassurance from a thin stripe."
  },
  {
    "id": "gyns-hysterectomy-anatomy",
    "domain": "gyn-surgery",
    "name": "Hysterectomy — ureter, bladder and cuff support",
    "org": "ACOG",
    "prompt": "Name 6 anatomic points at hysterectomy: the 3 places the ureter is at risk, the plane where the bladder is injured, and the 2 ligaments used to suspend the vaginal cuff.",
    "keyPoints": [
      {
        "group": "Where the ureter is at risk",
        "items": [
          "Pelvic brim",
          "Under uterine artery",
          "Lateral vaginal fornix"
        ]
      },
      {
        "group": "Where the bladder is injured",
        "items": [
          "Vesicouterine fold"
        ]
      },
      {
        "group": "Suspend the cuff to these",
        "items": [
          "Uterosacral ligament",
          "Cardinal ligament"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Three danger points, in the order you meet them: at the pelvic brim the ureter crosses the common iliac bifurcation just medial to the infundibulopelvic ligament (at risk when the ovarian vessels are clamped); at the cardinal ligament it passes about 1.5-2 cm lateral to the cervix beneath the uterine artery — water under the bridge; and at the lateral vaginal fornix it lies just above the colpotomy as the cuff is clamped and closed. The bladder is dissected off the cervix by opening the vesicouterine fold and developing the bladder flap, and scarring here from prior caesarean is the usual reason for cystotomy. Suspending the cuff to the uterosacral-cardinal complex at the time of hysterectomy is what prevents later vaginal vault prolapse."
  },
  {
    "id": "gyns-hysterectomy-complications",
    "domain": "gyn-surgery",
    "name": "Hysterectomy — injuries and cuff problems",
    "org": "AAGL",
    "prompt": "Name 6 complications of benign hysterectomy: the 3 organ injuries you fear during the case and 3 problems that appear afterwards.",
    "keyPoints": [
      {
        "group": "Organ injury during the case",
        "items": [
          "Ureter injury",
          "Bladder injury",
          "Bowel injury"
        ]
      },
      {
        "group": "Problems after the operation",
        "items": [
          "Cuff dehiscence",
          "Cuff cellulitis",
          "Pelvic abscess"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Ureteric injury complicates well under 1% of benign hysterectomies and is usually unrecognised at the time — a low threshold for cystoscopy after a difficult dissection is what catches it. Bladder injury is commonest during dissection off the lower uterine segment, especially after prior caesarean, and is the more frequent of the two urinary injuries. Cuff dehiscence is most frequent after total laparoscopic hysterectomy (energy at the colpotomy plus the closure technique); it presents with watery discharge, bleeding, pain or a vaginal bulge, and bowel evisceration through the cuff is a surgical emergency. Cuff cellulitis is the commonest infection despite prophylaxis and usually responds to antibiotics; a collection needs drainage."
  },
  {
    "id": "gyns-hysterectomy-indications",
    "domain": "gyn-surgery",
    "name": "Hysterectomy — benign indications and route",
    "org": "ACOG",
    "prompt": "Name 6 things about benign hysterectomy: 4 common benign indications, the preferred surgical route, and the procedure now added at the same operation.",
    "keyPoints": [
      {
        "group": "Common benign indications",
        "items": [
          "Fibroids",
          "Abnormal uterine bleeding",
          "Adenomyosis",
          "Uterine prolapse"
        ]
      },
      {
        "group": "Preferred route",
        "items": [
          "Vaginal route"
        ]
      },
      {
        "group": "Added at the same operation",
        "items": [
          "Opportunistic salpingectomy"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Hysterectomy for benign disease is elective and definitive, so medical therapy and uterus-sparing options should have been tried or declined first. Vaginal hysterectomy has the lowest complication rate, shortest stay and fastest return to activity, and is first choice whenever the uterus is mobile and not too large; prior caesarean and nulliparity are not by themselves contraindications. Push off the vaginal route for a very large uterus, no uterine descent, an adnexal mass that needs removing, or extensive adhesions — laparoscopic is the usual fallback, and open abdominal is now reserved for the very large or fixed uterus or suspected malignancy. Removing both tubes at benign hysterectomy lowers later ovarian cancer risk and does not affect ovarian reserve or hasten menopause; the ovaries themselves are conserved in premenopausal women operated on for benign disease."
  },
  {
    "id": "gyns-hysterectomy-periop",
    "domain": "gyn-surgery",
    "name": "Hysterectomy — perioperative essentials",
    "org": "ACOG",
    "prompt": "Name 6 perioperative essentials for benign hysterectomy: 2 prophylactic measures, 2 preoperative checks, and 2 features of recovery.",
    "keyPoints": [
      {
        "group": "Prophylaxis",
        "items": [
          "Cefazolin before incision",
          "Sequential compression devices"
        ]
      },
      {
        "group": "Check before operating",
        "items": [
          "Endometrial sampling",
          "Cervical cancer screening"
        ]
      },
      {
        "group": "Recovery",
        "items": [
          "Same-day discharge",
          "Pelvic rest"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "A single dose of cefazolin within 60 minutes of incision covers both vaginal and abdominal routes; redose for long cases or major blood loss. Mechanical prophylaxis suits most benign minimally invasive cases, with added heparin for higher-risk patients or open surgery. Any woman with abnormal uterine bleeding needs endometrial sampling before hysterectomy — routinely from age 45, and earlier with obesity, anovulation, tamoxifen or persistent bleeding — so you are not operating on an undiagnosed cancer through the wrong route; cervical screening should also be current. Enhanced recovery pathways make same-day discharge routine after minimally invasive hysterectomy. Nothing per vagina for about six weeks while the cuff heals, which is the counselling point that prevents dehiscence."
  },
  {
    "id": "gyns-hysteroscopy-anatomy",
    "domain": "gyn-surgery",
    "name": "Hysteroscopy — where the uterus gives way",
    "org": "AAGL",
    "prompt": "For each of the 4 sites where a scope or dilator breaks through, name what is injured — 6 items.",
    "keyPoints": [
      {
        "group": "Fundus or posterior wall",
        "items": [
          "Small bowel injury"
        ]
      },
      {
        "group": "Lateral, near internal os",
        "items": [
          "Uterine artery",
          "Broad ligament hematoma"
        ]
      },
      {
        "group": "Anterior wall, retroverted uterus",
        "items": [
          "Bladder injury"
        ]
      },
      {
        "group": "Cervical canal on entry",
        "items": [
          "False passage",
          "Cervical laceration"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Sound the uterus and respect its version and flexion first, because the direction of the mistake tells you which wall goes: an anteverted, anteflexed uterus sounded straight back is driven through the posterior wall into the cul-de-sac, where bowel and rectum sit, while a retroverted uterus dilated as though it were anteverted is driven through the anterior wall into the vesicouterine fold and bladder. The fundus and cornua are the thinnest myometrium and the usual site, with small bowel and omentum lying directly above. A lateral perforation is the one that bleeds, because the ascending uterine vessels run in the broad ligament alongside the isthmus, and a broad ligament hematoma can be large and occult. Perforation with the scope or a blunt sound alone, in a stable patient, with no energy applied, may be observed. Perforation with energy running, or any instrument advanced blindly through the defect, means the abdomen must be inspected for thermal bowel injury, which can declare itself days later."
  },
  {
    "id": "gyns-hysteroscopy-complications",
    "domain": "gyn-surgery",
    "name": "Hysteroscopy — complications",
    "org": "AAGL",
    "prompt": "Name 7 complications of operative hysteroscopy — 3 mechanical, 2 fluid-related, 2 other.",
    "keyPoints": [
      {
        "group": "Mechanical",
        "items": [
          "Uterine perforation",
          "Cervical laceration",
          "False passage"
        ]
      },
      {
        "group": "Fluid related",
        "items": [
          "Fluid overload",
          "Dilutional hyponatremia"
        ]
      },
      {
        "group": "Other",
        "items": [
          "Air embolism",
          "Intrauterine adhesions"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Overall complication rate is about 1-3%, and roughly half of all events happen during entry and cervical dilation rather than during the operating. Misoprostol or an osmotic dilator the night before, and ultrasound guidance in a sharply flexed or stenotic cervix, prevent most of them. Venous air (gas) embolism is rare but the lethal one: it comes from room air entrained down the sheath, so purge tubing of air, avoid repeated in-and-out passes, avoid steep Trendelenburg, and treat a sudden fall in end-tidal carbon dioxide with left lateral decubitus positioning and 100% oxygen. Adhesions follow extensive resection of opposing walls, particularly multiple myomas or a septum, and second-look hysteroscopy is reasonable then. Late failure after ablation can produce post-ablation tubal sterilization syndrome or trapped hematometra."
  },
  {
    "id": "gyns-hysteroscopy-indications",
    "domain": "gyn-surgery",
    "name": "Hysteroscopy — what it is for",
    "org": "AAGL",
    "prompt": "Name 7 uses of hysteroscopy — 3 diagnostic and 4 operative.",
    "keyPoints": [
      {
        "group": "Diagnostic",
        "items": [
          "Abnormal uterine bleeding",
          "Endometrial polyp",
          "Lost intrauterine device"
        ]
      },
      {
        "group": "Operative",
        "items": [
          "Submucosal fibroid resection",
          "Uterine septum",
          "Intrauterine adhesions",
          "Retained products"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Hysteroscopy is the reference standard for the uterine cavity: it sees focal lesions that blind sampling misses, so a negative office endometrial biopsy in a woman with persistent bleeding is not the end of the workup. Saline infusion sonohysterography is the reasonable screening step before it. Diagnostic hysteroscopy is now largely an office, vaginoscopic, no-speculum, no-tenaculum procedure. Before any endometrial ablation you must have endometrial sampling excluding hyperplasia or carcinoma, and ablation is not for a woman who may still want pregnancy. Submucosal fibroids are staged by the FIGO type 0/1/2 system — the deeper the intramural component, the more likely a two-stage resection and the higher the fluid deficit."
  },
  {
    "id": "gyns-hysteroscopy-periop",
    "domain": "gyn-surgery",
    "name": "Hysteroscopy — distension media and fluid deficit",
    "org": "AAGL",
    "prompt": "Name the 2 classes of distension medium with examples, the deficit limit that stops the case for each, and the one metabolic hazard — 6 items.",
    "keyPoints": [
      {
        "group": "Hypotonic, electrolyte-free",
        "items": [
          "Glycine",
          "Sorbitol",
          "1000 mL deficit limit"
        ]
      },
      {
        "group": "Isotonic, electrolyte-containing",
        "items": [
          "Normal saline",
          "2500 mL deficit limit"
        ]
      },
      {
        "group": "Metabolic hazard",
        "items": [
          "Dilutional hyponatremia"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Media choice follows the energy source: monopolar resection needs electrolyte-free fluid (glycine 1.5%, sorbitol, mannitol), bipolar and mechanical morcellation run in normal saline — which is why bipolar is now the default. Deficit, not inflow, is what you track, and it must be called out loud at intervals by the circulating nurse with an automated fluid-management pump. Lower the thresholds to roughly 750 mL hypotonic and 1500 mL isotonic in the elderly or in cardiac or renal disease. Absorption is mostly through opened myometrial venous sinuses, so risk rises with deep myoma resection, long cases and high intrauterine pressure — keep intrauterine pressure below mean arterial pressure, generally under about 80 mmHg. Electrolyte-free media cause hypo-osmolar hyponatremia and cerebral edema; young menstruating women are the classic victims of hyponatremic encephalopathy. Stop, send a sodium, give furosemide only with volume overload, and use hypertonic 3% saline for seizures or coma. Saline overload gives pulmonary edema without the sodium drop. Glycine additionally metabolizes to ammonia and can cause transient visual disturbance."
  },
  {
    "id": "gyns-midurethral-sling-anatomy",
    "domain": "gyn-surgery",
    "name": "Midurethral sling — needle path anatomy",
    "org": "AUGS",
    "prompt": "Name the 7 anatomic points for sling needle passage: 3 for the retropubic route, 3 for the transobturator route, and where the sling itself must sit.",
    "keyPoints": [
      {
        "group": "Retropubic passage",
        "items": [
          "Space of Retzius",
          "Bladder dome",
          "External iliac vessels"
        ]
      },
      {
        "group": "Transobturator passage",
        "items": [
          "Obturator membrane",
          "Obturator nerve",
          "Adductor compartment"
        ]
      },
      {
        "group": "Sling position",
        "items": [
          "Tension free midurethra"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "The retropubic needle travels through the space of Retzius hugging the back of the pubic bone. Perforation of the bladder, typically anterolaterally near the dome and seen cystoscopically between 10 and 2 o'clock, occurs in up to 5% and is why cystoscopy is non-negotiable; drain the bladder first and never let the needle tip drift off bone, because the external iliac vessels and bowel lie a short distance lateral and cephalad — rare, but the injury that kills. The transobturator needle pierces the obturator membrane into the adductor compartment, deliberately avoiding the retropubic space and bladder; the obturator nerve and vessels sit superolaterally in the obturator canal, so the needle is aimed inferolaterally toward the genitofemoral crease at the level of the clitoris. Sling position decides outcome: too proximal at the bladder neck obstructs, too distal fails, and any tension at all causes retention. Leave a spacer between sling and urethra and confirm the mesh lies flat."
  },
  {
    "id": "gyns-midurethral-sling-complications",
    "domain": "gyn-surgery",
    "name": "Midurethral sling — complications",
    "org": "AUGS",
    "prompt": "Name the 7 complications of a midurethral sling: 2 voiding problems, 2 mesh problems, 2 specific to the retropubic route, and 1 specific to the transobturator route.",
    "keyPoints": [
      {
        "group": "Voiding",
        "items": [
          "Urinary retention",
          "New urgency"
        ]
      },
      {
        "group": "Mesh",
        "items": [
          "Vaginal mesh exposure",
          "Urethral mesh erosion"
        ]
      },
      {
        "group": "Retropubic route",
        "items": [
          "Bladder perforation",
          "Retropubic hematoma"
        ]
      },
      {
        "group": "Transobturator route",
        "items": [
          "Groin pain"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Retention is usually transient and managed with a catheter, but obstruction persisting past 2 to 4 weeks needs sling loosening or midline release — done early it is a simple manoeuvre, done late it means excising scarred mesh. New urgency after a sling should prompt a postvoid residual before it is blamed on overactive bladder, since obstruction is the reversible cause. Vaginal mesh exposure runs about 2%, presenting with discharge, spotting, or a partner who feels it; small exposures respond to topical oestrogen and observation, larger ones need excision. Mesh eroded into the urethra or bladder presents with recurrent infection, haematuria, or a stone encrusted on the mesh, and always requires excision. Cystoscopy is mandatory with retropubic passage — the missed bladder perforation is the classic error, and a needle left through the bladder becomes a fistula. Bleeding into the retropubic space can be brisk and occasionally needs packing or exploration. Groin and inner thigh pain is the transobturator signature."
  },
  {
    "id": "gyns-midurethral-sling-indications",
    "domain": "gyn-surgery",
    "name": "Midurethral sling — indications and approaches",
    "org": "AUGS",
    "prompt": "For the midurethral sling, name 7 things: 3 indications, the 3 needle approaches, and the 1 incontinence type it does not treat.",
    "keyPoints": [
      {
        "group": "Indication",
        "items": [
          "Stress urinary incontinence",
          "Urethral hypermobility",
          "Failed pelvic floor therapy"
        ]
      },
      {
        "group": "Approach",
        "items": [
          "Retropubic sling",
          "Transobturator sling",
          "Single incision sling"
        ]
      },
      {
        "group": "Not treated by sling",
        "items": [
          "Urgency urinary incontinence"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "The midurethral sling is the standard surgical treatment for stress incontinence after failed conservative therapy, and AUGS and SUFU continue to affirm it as safe and effective — the mesh controversy was about transvaginal prolapse kits, not slings. It works by giving the midurethra a backboard to compress against when abdominal pressure rises, not by obstructing outflow. Retropubic and transobturator routes cure roughly 80% with similar success: retropubic does better with intrinsic sphincter deficiency or a fixed, non-mobile urethra, while transobturator has less bladder perforation and less retention but more groin pain. Single-incision slings now show non-inferiority in randomised trials with less pain, though long-term data are thinner. Pure urgency incontinence is treated behaviourally and medically; in mixed incontinence, operate only when the stress component dominates and warn the patient that urgency may persist or worsen. For the woman who declines mesh entirely, offer urethral bulking or an autologous fascial pubovaginal sling."
  },
  {
    "id": "gyns-myomectomy-anatomy",
    "domain": "gyn-surgery",
    "name": "Myomectomy — structures at risk",
    "org": "AAGL",
    "prompt": "Name 5 anatomic points at myomectomy: 2 vascular pedicles to respect, the structure at risk with a broad ligament fibroid, the layer you try not to breach, and where the incision should go.",
    "keyPoints": [
      {
        "group": "Vascular pedicles",
        "items": [
          "Uterine artery",
          "Utero-ovarian pedicle"
        ]
      },
      {
        "group": "At risk with broad ligament fibroids",
        "items": [
          "Ureter"
        ]
      },
      {
        "group": "Layer to avoid breaching",
        "items": [
          "Endometrial cavity"
        ]
      },
      {
        "group": "Where to incise",
        "items": [
          "Anterior uterine incision"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "The uterus is supplied from below by the uterine artery ascending the lateral wall and from above by the utero-ovarian pedicle at the cornu — a fibroid low and lateral sits between them. Broad ligament and cervical fibroids displace the ureter laterally and downwards, so open the broad ligament and identify the ureter before enucleating. Entering the endometrial cavity is what converts the counselling to rupture risk and elective caesarean, so plan the deepest plane before you cut. Anterior midline incisions adhere far less than posterior ones; keep the number of serosal incisions to a minimum, tunnel to reach other fibroids, close the myometrium in layers to abolish dead space, and consider an adhesion barrier."
  },
  {
    "id": "gyns-myomectomy-complications",
    "domain": "gyn-surgery",
    "name": "Myomectomy — risks to counsel",
    "org": "AAGL",
    "prompt": "Name the 5 complications you must counsel on before myomectomy: 2 that can happen in theatre, 2 that appear later, and 1 in a future pregnancy.",
    "keyPoints": [
      {
        "group": "In theatre",
        "items": [
          "Blood transfusion",
          "Conversion to hysterectomy"
        ]
      },
      {
        "group": "Later",
        "items": [
          "Fibroid recurrence",
          "Pelvic adhesions"
        ]
      },
      {
        "group": "In a future pregnancy",
        "items": [
          "Uterine rupture"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Blood loss is the dominant intraoperative risk — a multiple myomectomy can bleed more than a hysterectomy, so consent for transfusion and for hysterectomy is mandatory even though conversion is rare. Adhesions, especially from posterior uterine incisions, are the mechanism by which surgery done for fertility can reduce it. Rupture in a later pregnancy is uncommon (well under 1%) but is the reason most units advise elective caesarean at 37-39 weeks and no labour when the cavity was entered or a deep intramural defect was repaired. Morcellation of an unsuspected leiomyosarcoma is the other consented risk: use a contained system, and avoid morcellation in postmenopausal women or a rapidly growing mass."
  },
  {
    "id": "gyns-myomectomy-indications",
    "domain": "gyn-surgery",
    "name": "Myomectomy — when instead of hysterectomy",
    "org": "ACOG",
    "prompt": "Name 6 things: 2 reasons to choose myomectomy over hysterectomy, 2 symptoms that justify operating, and 2 fibroid features that make it fertility-relevant.",
    "keyPoints": [
      {
        "group": "Why choose myomectomy",
        "items": [
          "Desires future fertility",
          "Uterine preservation"
        ]
      },
      {
        "group": "Symptoms that justify surgery",
        "items": [
          "Heavy menstrual bleeding",
          "Pressure symptoms"
        ]
      },
      {
        "group": "Fibroid features that matter for fertility",
        "items": [
          "Submucosal fibroid",
          "Cavity distortion"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Myomectomy is the uterus-sparing option: choose it for the woman who wants to conceive, or who simply wants to keep her uterus, once medical therapy has failed. Bulk symptoms mean pressure — urinary frequency, a palpable mass, pelvic heaviness. Only fibroids that distort the cavity clearly impair fertility and implantation, so submucosal (FIGO type 0-2) fibroids are the ones to resect, hysteroscopically where possible; intramural and subserosal fibroids are removed laparoscopically or open for symptoms rather than for fertility alone. It is not definitive treatment: imaging shows recurrent fibroids in a large minority of women by five years and roughly one in ten to one in four eventually needs a second operation. Uterine artery embolisation is an alternative for bulk and bleeding but is not first choice when future pregnancy is planned."
  },
  {
    "id": "gyns-myomectomy-periop",
    "domain": "gyn-surgery",
    "name": "Myomectomy — blood loss and consent",
    "org": "ACOG",
    "prompt": "Name 5 perioperative measures at myomectomy: 2 preparations before the case, 2 ways to cut blood loss during it, and 1 way to cut adhesions.",
    "keyPoints": [
      {
        "group": "Prepare beforehand",
        "items": [
          "Consent for hysterectomy",
          "Type and screen"
        ]
      },
      {
        "group": "Reduce blood loss",
        "items": [
          "Vasopressin",
          "Tranexamic acid"
        ]
      },
      {
        "group": "Reduce adhesions",
        "items": [
          "Adhesion barrier"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Correct anaemia first — oral or intravenous iron, with tranexamic acid or hormonal suppression to control bleeding while the haemoglobin recovers. Preoperative imaging that maps the number, size and FIGO type of every fibroid decides the route (hysteroscopic, laparoscopic or open) and should be reviewed with the patient. Dilute vasopressin injected into the myometrium is the single most effective intraoperative measure; a tourniquet at the level of the internal os, misoprostol and tranexamic acid all add to it. Consent must always include hysterectomy and transfusion. In hysteroscopic myomectomy the specific hazards are fluid overload from the distension medium and perforation, so run a strict fluid deficit."
  },
  {
    "id": "gyns-ovarian-cystectomy-versus-oophorectomy-anatomy",
    "domain": "gyn-surgery",
    "name": "Ovarian cystectomy versus oophorectomy — the infundibulopelvic ligament",
    "org": "ACOG",
    "prompt": "Name the 3 contents of the infundibulopelvic ligament and the 3 structures to identify before you divide it (6 total).",
    "keyPoints": [
      {
        "group": "Contents",
        "items": [
          "Ovarian artery",
          "Ovarian vein",
          "Ovarian lymphatics"
        ]
      },
      {
        "group": "Identify first",
        "items": [
          "Ureter",
          "Pelvic brim",
          "External iliac artery"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "The infundibulopelvic (suspensory) ligament is the single commonest place the ureter is injured at adnexal surgery: the ureter crosses the bifurcation of the common iliac artery at the pelvic brim and then runs down the sidewall on the medial leaf of the broad ligament, only 1-2 cm deep and medial to the pedicle. Open the peritoneum lateral and parallel to the ligament — the psoas muscle and external iliac artery mark the lateral wall, the ureter the medial leaf — develop the pararectal space, and see peristalsis before you clamp. Remember the ovary has a dual supply: the ovarian artery from the aorta in the infundibulopelvic ligament, and the ovarian branch of the uterine artery in the utero-ovarian ligament — so conserving an ovary means keeping one of the two intact, and cystectomy near the hilum threatens it. The right ovarian vein drains to the inferior vena cava, the left to the left renal vein."
  },
  {
    "id": "gyns-ovarian-cystectomy-versus-oophorectomy-complications",
    "domain": "gyn-surgery",
    "name": "Ovarian cystectomy versus oophorectomy — complications",
    "org": "ACOG",
    "prompt": "Name the 7 complications of ovarian surgery — 3 at operation and 4 later.",
    "keyPoints": [
      {
        "group": "At operation",
        "items": [
          "Ureter injury",
          "Ovarian pedicle bleeding",
          "Intraoperative cyst rupture"
        ]
      },
      {
        "group": "Later",
        "items": [
          "Reduced ovarian reserve",
          "Cyst recurrence",
          "Adhesion formation",
          "Premature menopause"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "The ovarian pedicle is the classic retracting bleeder: the infundibulopelvic stump snaps up under the sidewall peritoneum, and blind clamping there is exactly how the ureter is injured — open the retroperitoneum and get proximal control instead. Spill of a benign dermoid causes chemical peritonitis (irrigate copiously); spill of an unsuspected malignancy turns a stage IA cancer into IC1, which is the argument for a retrieval bag and for never morcellating an unknown mass. Reduced reserve follows the stripped normal cortex and the electrosurgery used on the cyst bed — haemostasis by suture rather than diffuse cautery spares follicles. Premature menopause is the consequence of bilateral oophorectomy, and the surgical menopause is more abrupt than the natural one; offer oestrogen to a young patient with no contraindication."
  },
  {
    "id": "gyns-ovarian-cystectomy-versus-oophorectomy-indications",
    "domain": "gyn-surgery",
    "name": "Ovarian cystectomy versus oophorectomy — choosing to conserve",
    "org": "ACOG",
    "prompt": "Name the 3 features that favour ovarian cystectomy and the 3 that favour oophorectomy (6 total).",
    "keyPoints": [
      {
        "group": "Favours cystectomy",
        "items": [
          "Premenopausal patient",
          "Fertility desired",
          "Benign imaging features"
        ]
      },
      {
        "group": "Favours oophorectomy",
        "items": [
          "Postmenopausal patient",
          "Suspicious for malignancy",
          "Recurrent endometrioma"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Torsion is detorse-and-conserve: a dusky or even black-looking ovary recovers, and oophorectomy for torsion is a mistake in anyone who might want fertility — consider oophoropexy if recurrent. Bilateral oophorectomy before about age 45 without a genetic indication raises all-cause and cardiovascular mortality, so 'take it while you're in there' is not acceptable. Endometrioma: cystectomy (stripping the capsule) beats drainage/ablation for recurrence and pain, but costs antral follicle count — counsel a patient with limited reserve or a prior contralateral cystectomy. Simple cysts up to about 10 cm at any age are almost always benign and can usually just be followed. Whenever the ovary is removed for benign disease, remove the tube with it; whenever it is conserved, still offer opportunistic salpingectomy if childbearing is complete."
  },
  {
    "id": "gyns-ovarian-cystectomy-versus-oophorectomy-periop",
    "domain": "gyn-surgery",
    "name": "Ovarian cystectomy versus oophorectomy — working up an adnexal mass",
    "org": "ACOG",
    "prompt": "Name the 5 things to do before operating on an adnexal mass — 3 tests and 2 planning steps.",
    "keyPoints": [
      {
        "group": "Assess",
        "items": [
          "Transvaginal ultrasound",
          "Pregnancy test",
          "Cancer antigen 125"
        ]
      },
      {
        "group": "Plan",
        "items": [
          "Oncology referral",
          "Consent for oophorectomy"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Transvaginal ultrasound is the test that decides the operation: solid components, thick septations, papillary projections, high colour flow and ascites are the malignant features, while a simple anechoic cyst, a ground-glass endometrioma and the hyperechoic Rokitansky nodule of a dermoid are reassuring. Cancer antigen 125 (CA 125) is poorly specific before the menopause — endometriosis, fibroids, pelvic inflammatory disease, even menstruation raise it — so it earns its keep mainly in postmenopausal patients. Refer to gynaecologic oncology when markers, imaging or ascites suggest malignancy, because staging at the index operation improves survival. Consent must always include the possibility of oophorectomy and, in a premenopausal patient, an explicit discussion of ovarian reserve and of removing the tube."
  },
  {
    "id": "gyns-prolapse-repair-anatomy",
    "domain": "gyn-surgery",
    "name": "Prolapse repair — structures at risk",
    "org": "ACOG",
    "prompt": "Name the structure at risk in each prolapse operation — 7 total: 1 for uterosacral suspension, 2 for sacrospinous fixation, 2 at the sacral promontory, and 2 for colporrhaphy.",
    "keyPoints": [
      {
        "group": "Uterosacral ligament suspension",
        "items": [
          "Ureter kinking"
        ]
      },
      {
        "group": "Sacrospinous ligament fixation",
        "items": [
          "Pudendal nerve",
          "Sciatic nerve"
        ]
      },
      {
        "group": "Sacral promontory",
        "items": [
          "Middle sacral artery",
          "Left common iliac vein"
        ]
      },
      {
        "group": "Colporrhaphy",
        "items": [
          "Bladder anteriorly",
          "Rectum posteriorly"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Uterosacral ligament suspension carries the highest ureteral obstruction rate of any prolapse operation, around 3 to 5%, because near the ischial spine the ureter runs only a couple of centimetres lateral to the ligament — hence mandatory cystoscopy. For sacrospinous fixation, the pudendal nerve and vessels wrap behind the ischial spine and the sciatic nerve lies superolateral to the ligament, so sutures go about two fingerbreadths medial to the spine and never lateral to it; the inferior gluteal vessels are the third structure there. Buttock pain afterwards is common, usually from the levator or a coccygeal branch, and typically settles within 6 weeks — pain that is immediate, severe, and radiating down the leg means the suture is in the wrong place and should be removed. At the sacral promontory for sacrocolpopexy, dissect over S1 and no lower: the middle sacral artery and its vein run in the midline just deep to the peritoneum, and the left common iliac vein crosses close to the promontory, where bleeding is hard to control. Retract the sigmoid to the patient's left and stay right of it. In colporrhaphy the relationship is simply front and back — bladder above the anterior repair, rectum behind the posterior one."
  },
  {
    "id": "gyns-prolapse-repair-complications",
    "domain": "gyn-surgery",
    "name": "Prolapse repair — complications",
    "org": "ACOG",
    "prompt": "Name the 7 complications of prolapse repair: the 1 function unmasked by the operation, 3 organ injuries, and 3 late problems.",
    "keyPoints": [
      {
        "group": "Unmasked by repair",
        "items": [
          "New stress incontinence"
        ]
      },
      {
        "group": "Organ injury",
        "items": [
          "Ureter injury",
          "Bladder injury",
          "Rectal injury"
        ]
      },
      {
        "group": "Late",
        "items": [
          "Prolapse recurrence",
          "Dyspareunia",
          "Mesh exposure"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "New stress incontinence after a successful prolapse repair is unmasking of an occult problem, not surgical error — say so before the operation, not after. Anatomic recurrence reaches about 30% at 5 to 7 years, though far fewer women need reoperation; counsel on symptom relief rather than a perfect anatomic result. Match the injury to the operation: bladder injury belongs to the anterior repair, rectal injury to the posterior repair, and ureteral injury or kinking to the apical suspension. Dyspareunia is largely iatrogenic: levator plication during posterior colporrhaphy narrows the introitus and should be abandoned in favour of midline fascial or site-specific rectovaginal repair. Mesh exposure here means sacrocolpopexy mesh, roughly 2 to 4% at the vaginal apex, presenting with discharge, spotting, or partner discomfort; transvaginal prolapse mesh kits are no longer marketed in the US, so a patient with vaginal mesh from a prolapse kit had it placed before 2019."
  },
  {
    "id": "gyns-prolapse-repair-indications",
    "domain": "gyn-surgery",
    "name": "Prolapse repair — choosing the operation",
    "org": "ACOG",
    "prompt": "For symptomatic pelvic organ prolapse, name the 6 operations: 2 compartment repairs, 3 apical suspensions, and the 1 obliterative procedure.",
    "keyPoints": [
      {
        "group": "Compartment repair",
        "items": [
          "Anterior colporrhaphy",
          "Posterior colporrhaphy"
        ]
      },
      {
        "group": "Apical suspension",
        "items": [
          "Sacrocolpopexy",
          "Sacrospinous ligament fixation",
          "Uterosacral ligament suspension"
        ]
      },
      {
        "group": "Obliterative",
        "items": [
          "Colpocleisis"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Native-tissue vaginal repair is first line for benign prolapse, and the vaginal route is preferred whenever feasible. Apical support is the keystone: an anterior repair done without an apical suspension recurs at a high rate, because most 'cystoceles' are really apical descent. Abdominal or laparoscopic sacrocolpopexy with polypropylene mesh is the most durable apical repair and remains fully permitted — it was transvaginal mesh kits for prolapse that the FDA ordered off the US market in April 2019, not abdominal mesh and not slings. Uterosacral and sacrospinous suspensions had equivalent 2-year outcomes in the OPTIMAL trial, so the choice is driven by access and surgeon comfort. Colpocleisis is obliterative: over 90% satisfaction, short anaesthetic, ideal for the frail patient, but it precludes vaginal intercourse forever and makes later endometrial evaluation difficult — counsel and document explicitly. Hysteropexy, vaginal or laparoscopic, is reasonable for the woman who wants to keep her uterus and has no abnormal bleeding. A pessary is always an alternative and should be offered to everyone before any of these."
  },
  {
    "id": "gyns-prolapse-repair-periop",
    "domain": "gyn-surgery",
    "name": "Prolapse repair — preoperative and intraoperative checks",
    "org": "ACOG",
    "prompt": "Name the 7 checks around a prolapse repair: 2 urinary assessments, 2 uterine or cervical assessments, 2 intraoperative checks, and the 1 thing you must counsel about.",
    "keyPoints": [
      {
        "group": "Urinary assessment",
        "items": [
          "Prolapse reduction stress test",
          "Postvoid residual"
        ]
      },
      {
        "group": "Uterus and cervix",
        "items": [
          "Endometrial sampling",
          "Cervical cancer screening"
        ]
      },
      {
        "group": "Intraoperative",
        "items": [
          "Cystoscopy",
          "Rectal examination"
        ]
      },
      {
        "group": "Counselling",
        "items": [
          "Concomitant sling"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Between a fifth and a third of continent women with advanced prolapse have occult stress incontinence that only appears once the repair straightens the kinked urethra. Find it before surgery: reduce the prolapse with a pessary, swabs, or the posterior speculum blade and do a cough stress test. If positive, discuss adding a midurethral sling — CARE and OPUS showed fewer postoperative stress symptoms but more adverse events, so this is shared decision-making, not an automatic add-on. An elevated postvoid residual from an obstructing prolapse usually normalises after repair. Endometrial sampling is indicated before hysterectomy or hysteropexy for abnormal bleeding or other risk factors, and it matters especially before colpocleisis, since the uterus becomes inaccessible afterwards — the same argument applies to having cervical screening up to date. On the table, do two things: cystoscopy after any apical suspension to confirm bilateral ureteral efflux, because an obstructed ureter found on the table is fixed by pulling one suture whereas one found on postoperative day 3 means a second operation; and, after a posterior repair, a digital rectal examination to confirm no suture has passed into the rectum and that the introitus still admits two fingers."
  },
  {
    "id": "gyns-tubal-ligation-and-opportunistic-salpingectomy-anatomy",
    "domain": "gyn-surgery",
    "name": "Tubal ligation and opportunistic salpingectomy — tubal anatomy",
    "org": "ACOG",
    "prompt": "Name the 4 segments of the fallopian tube from the uterus outwards and the 2 arteries that supply it (6 total).",
    "keyPoints": [
      {
        "group": "Segments",
        "items": [
          "Interstitial part",
          "Isthmus",
          "Ampulla",
          "Fimbria"
        ]
      },
      {
        "group": "Blood supply",
        "items": [
          "Uterine artery",
          "Ovarian artery"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "The tubal branches of the uterine and ovarian arteries anastomose within the mesosalpinx, which is why salpingectomy must be taken flush with the tube — cautery swept low through the mesosalpinx burns the ovarian supply. A Pomeroy ligates and excises a knuckle of isthmus 2-3 cm from the cornu, deliberately away from the interstitial part where a fistula would let sperm through. Salpingectomy is only protective if the fimbria comes out, so a partial salpingectomy that leaves the fimbriated end behind misses the point. Most ectopics implant in the ampulla, the longest and widest segment; interstitial ectopics are rare but rupture late and bleed catastrophically. Identify the fimbriated end before you divide anything, so that you do not ligate the round ligament by mistake."
  },
  {
    "id": "gyns-tubal-ligation-and-opportunistic-salpingectomy-complications",
    "domain": "gyn-surgery",
    "name": "Tubal ligation and opportunistic salpingectomy — failure and regret",
    "org": "ACOG",
    "prompt": "Name the 4 things to warn about before permanent contraception and the 2 risks specific to removing the whole tube (6 total).",
    "keyPoints": [
      {
        "group": "Warn about",
        "items": [
          "Method failure",
          "Ectopic pregnancy",
          "Later regret",
          "Irreversible procedure"
        ]
      },
      {
        "group": "Specific to salpingectomy",
        "items": [
          "Mesosalpinx bleeding",
          "Longer operating time"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Quote the numbers: in the CREST cohort about 18 per 1000 women (roughly 1 in 55) conceived within 10 years of tubal occlusion, and about a third of the pregnancies that do occur are ectopic — so any pain or bleeding with a positive test after sterilisation is ectopic until proved otherwise. Failure is highest with the spring clip and in women sterilised young. Regret is likewise driven by young age (under 30), a new partner and a decision made around the time of delivery or termination; document that the patient was told reversal is not routinely available and that in vitro fertilisation would be the fallback. Salpingectomy adds only a few minutes but the mesosalpinx bleeds if you stray from the tube — stay hugging the tube to protect the ovarian anastomosis."
  },
  {
    "id": "gyns-tubal-ligation-and-opportunistic-salpingectomy-indications",
    "domain": "gyn-surgery",
    "name": "Tubal ligation and opportunistic salpingectomy — when and what to offer",
    "org": "ACOG",
    "prompt": "Name the 2 benign operations at which opportunistic salpingectomy is now standard and the 3 alternatives to discuss before sterilisation (5 total).",
    "keyPoints": [
      {
        "group": "Remove the whole tube for",
        "items": [
          "Benign hysterectomy",
          "Permanent contraception"
        ]
      },
      {
        "group": "Alternatives to discuss",
        "items": [
          "Vasectomy",
          "Intrauterine device",
          "Contraceptive implant"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "Most high-grade serous 'ovarian' cancer begins in the distal tube, so complete salpingectomy has replaced clips, rings and Pomeroy as the preferred method when the abdomen is already open — also offered at caesarean delivery and after vaginal delivery. It does not compromise ovarian blood supply or bring the menopause forward, and it has a lower failure rate than occlusion. Vasectomy is safer, cheaper and done under local anaesthetic — but it is not immediately effective and needs a post-vasectomy semen analysis, whereas tubal surgery works at once. A levonorgestrel intrauterine device or the etonogestrel implant matches sterilisation for effectiveness and is reversible. Hysteroscopic sterilisation (Essure) was withdrawn from sale in the United States at the end of 2018 and is no longer an option."
  },
  {
    "id": "gyns-tubal-ligation-and-opportunistic-salpingectomy-periop",
    "domain": "gyn-surgery",
    "name": "Tubal ligation and opportunistic salpingectomy — consent and timing",
    "org": "ACOG",
    "prompt": "Name the 5 consent and timing points before laparoscopic sterilisation — 3 about consent, 2 about timing.",
    "keyPoints": [
      {
        "group": "Consent",
        "items": [
          "Medicaid waiting period",
          "Alternatives documented",
          "Partner consent not required"
        ]
      },
      {
        "group": "Timing",
        "items": [
          "Contraception until surgery",
          "Effective immediately"
        ]
      }
    ],
    "reviewed": "2026-07-27",
    "pearls": "For patients whose care is funded by Medicaid, the federal sterilisation consent form must be signed at least 30 days (and no more than 180 days) before the operation, with a shortened 72-hour window for emergency abdominal surgery and for premature delivery — a missing or expired form is the commonest reason a planned sterilisation is cancelled on the day. No spouse or partner signature is required or appropriate. A luteal-phase pregnancy is the trap: keep the patient on effective contraception right up to the operation and do a pregnancy test on the day. Unlike vasectomy, tubal surgery protects from the moment it is done, so no backup method is needed afterwards. Document that long-acting reversible methods and vasectomy were offered and declined."
  }
];
