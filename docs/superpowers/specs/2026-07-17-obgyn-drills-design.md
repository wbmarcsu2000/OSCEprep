# OB/GYN Guideline Drills — Design

**Date:** 2026-07-17
**Status:** Approved design, pending implementation plan
**Owner:** ClerkTools (osce-simulator)

## 1. Goal

Give the OB/GYN clerkship its own **Drills** tool, modeled on the FM Guideline
Drills: the unit of a drill is **one guideline/topic** (e.g., "Postpartum
hemorrhage (ACOG)"), practiced as cued grouped free-recall and graded by
coverage against that topic's key facts. The OB/GYN tab then has *Questions*
(existing 556-Q bank) + *Drills*.

Along the way, the FM drills screen is generalized into a **bank-driven
`GuidelineDrills` screen** (the same descriptor pattern `Qbank.tsx` uses with
`McqBank`), so any future clerkship's drills are data-only.

## 2. Scope

### In scope (v1)

- **Refactor:** `FmDrills.tsx` → generic `GuidelineDrills.tsx` over a
  `DrillBank` descriptor; `fmDrillProgress.ts` → storage-key-parameterized
  `guidelineDrillProgress.ts`. **Zero FM behavior change** (same view id
  `fmdrills`, storage key `osce.fmdrills.v1`, telemetry strings `fm-<domain>`).
- **New OB bank:** view `obdrills`, route `#/ob-drills`, storage key
  `osce.obdrills.v1`, a **Drills** tool on the existing OB/GYN clerkship tab.
- **Four domain tabs**, 10 drills each (~40 total):
  - 🤰 **Prenatal & routine care**
  - 🚨 **Complications & emergencies**
  - 👶 **Labor & monitoring**
  - 🌸 **GYN**
- **Anchoring:** each drill credits its guideline body — ACOG (most), ASCCP,
  CDC, USPSTF, SMFM — with a `reviewed` date set after verification.
- All three existing modes for free (Full recall / By category / Flashcard),
  category cues, reveal scaffold, mastery/browse/progress — inherited from the
  shared primitives.
- **Cross-cutting wiring** (the commit-5763d01 lesson): `osce.obdrills.v1`
  joins `ALL_KEYS` (export/import/reset) and gets an Analytics "Your Progress"
  section. Drill storage keys become bank-sourced so a future bank can't be
  missed.

### Non-goals (v1)

- Per-fact "Quiz me" mode (still the deferred FM extension point; the shared
  schema keeps it open).
- Touching the IM Drills screen or any Qbank.
- Peds/newborn content (the OB Q-bank's Newborn domain is MCQ-only; drills stay
  on the mother's side of the shelf).
- Image-based drills (FHT strips as images). FHT content is drilled as
  criteria/definitions text, which is what the shelf tests.

## 3. Approach — generalize to a bank descriptor

Chosen over copying `FmDrills.tsx` → `ObDrills.tsx` (~300 duplicated lines,
3rd clerkship would triple it). The screen and progress modules are thin
wrappers (210 + 81 lines) around shared, already-generic primitives
(`drillPrimitives.tsx`, `drillModes.tsx`, `drillProgressCore.ts`), and the
codebase already has the approved precedent for this exact move: `Qbank.tsx`
generic over `McqBank`. FM's tests keep passing unchanged, which is the
regression guard for the refactor.

## 4. Architecture & file plan

### 4.1 Generic data model — `src/data/guidelineDrillBank.ts` (new)

```ts
export interface GuidelineDrill {
  id: string;            // unique within its bank, e.g. "comp-pph"
  domain: string;        // one of the bank's domain ids
  name: string;          // "Postpartum hemorrhage"
  org: string;           // "ACOG" — source credit chip
  prompt: string;        // cued recall prompt naming the dimensions
  keyPoints: { group: string; items: string[] }[];  // the graded answer key
  pearls?: string;       // reveal-only depth, never graded
  reviewed: string;      // ISO date facts last verified
}

export interface DrillDomainDef { id: string; label: string; emoji: string }

export interface DrillBank {
  id: string;                    // "fm" | "ob" — also the telemetry prefix
  title: string;                 // screen H2
  blurb: string;                 // screen subtitle copy
  icon: string;                  // icon-tile emoji
  domains: DrillDomainDef[];     // tab order
  drills: GuidelineDrill[];
  storageKey: string;            // osce.<x>drills.v1
}

export const FM_DRILL_BANK: DrillBank;   // wraps existing FM_GUIDELINE_DRILLS
export const OB_DRILL_BANK: DrillBank;
export const GUIDELINE_DRILL_BANKS: DrillBank[];      // [FM, OB]
export const DRILL_STORAGE_KEYS: string[];            // for ALL_KEYS
export function drillsForDomain(bank, domain): GuidelineDrill[];
export function drillCatalog(bank, domain): { id; label; group? }[];
```

`FmGuidelineDrill` (narrowed `domain` union) stays in `fmGuidelineDrills.ts`
so the three FM data files don't churn; it's structurally assignable to
`GuidelineDrill`. `FM_DRILL_BANK` reuses `FM_DOMAIN_ORDER/LABELS/EMOJI` and
FM's existing title/blurb/icon copy verbatim. Telemetry `drillType` is
`` `${bank.id}-${domain}` `` — FM emits exactly the strings it does today.

### 4.2 Generic progress — `src/data/guidelineDrillProgress.ts` (new)

`fmDrillProgress.ts` minus the FM pinning: every function takes the bank's
`storageKey` (the same generalization `mcqProgress.ts` got). Pure logic stays
in `drillProgressCore.ts` (untouched).

- `loadDrillBankProgress(key)`, `recordDrillBankAttempt(key, domain, id, pct)`,
  `setDrillBankManual(key, domain, id, manual)`,
  `summarizeDrillDomain(drills, domain, map)`.
- `fmDrillProgress.ts` is **deleted**; its few call sites (screen, hook,
  analytics) move to the generic module. `useFmDrillProgress` →
  `useDrillBankProgress(storageKey)` (same shape: `{progress, record,
  setManual}`).

### 4.3 Generic screen — `src/ui/screens/GuidelineDrills.tsx`

`FmDrills.tsx` renamed and parameterized: `<GuidelineDrills bank={...}/>`.
Domain/mode/index/answer state resets on bank change via a `key={bank.id}` at
the App.tsx call site. Default domain = `bank.domains[0].id`; default mode
stays `"category"`. All copy that mentioned FM moves into the bank descriptor.
`FmDrills.tsx` is deleted.

### 4.4 Wiring

- `store.ts`: add `"obdrills"` to the `View` union + `VIEW_HASH` (`#/ob-drills`).
- `App.tsx`: `{view === "fmdrills" && <GuidelineDrills bank={FM_DRILL_BANK}/>}`
  and same for `obdrills`/`OB_DRILL_BANK`.
- `clerkships.ts`: append a `Drills` tool to the `obgyn` clerkship
  (`view: "obdrills"`, icon 🎯, teal grad — mirroring the FM tool entry).
- `src/analytics/store.ts`: `ALL_KEYS` sources drill keys from
  `DRILL_STORAGE_KEYS` (replacing the hand-listed FM key; IM's
  `osce.drills.v1` stays hand-listed since it's not a bank).
- `src/ui/screens/Analytics.tsx`: `FmDrillProgressSection` → generalized
  section rendered once per `GUIDELINE_DRILL_BANKS` entry ("Guideline drills —
  Family Medicine", "Guideline drills — OB/GYN").

## 5. Content plan — the 40 drills

Density caps (hard, linted): **≤4 groups, ≤4 items/group, ~15 items/drill,
each item ≤80 chars**. Depth and nuance go to `pearls`. Every drill names its
org; all `reviewed: "2026-07-17"` after verification.

### 🤰 Prenatal & routine care (10) — ids `pre-*`

| Drill | Org |
|---|---|
| Prenatal visit schedule & labs by trimester | ACOG |
| Aneuploidy screening options (cfDNA, combined, quad, diagnostic) | ACOG |
| Gestational diabetes screening & diagnosis (50 g → 100 g, targets) | ACOG |
| Rh(D) alloimmunization prevention (RhoGAM timing/indications) | ACOG |
| Vaccines in pregnancy (Tdap, flu, RSV, COVID; live-vaccine rules) | ACIP/CDC |
| GBS screening & intrapartum prophylaxis (incl. PCN allergy) | ACOG |
| Pregnancy dating & antenatal fetal surveillance (who/when/what) | ACOG |
| Low-dose aspirin for preeclampsia prevention (risk criteria, timing) | USPSTF/ACOG |
| Infection screening in pregnancy (syphilis, HIV, HBV, ASB) | CDC/USPSTF |
| Nutrition & exposures (folic acid doses, weight gain, teratogens) | ACOG |

### 🚨 Complications & emergencies (10) — ids `comp-*`

| Drill | Org |
|---|---|
| Hypertensive disorders: classification & preeclampsia criteria | ACOG |
| Severe preeclampsia/eclampsia mgmt (mag dosing+toxicity, BP, delivery) | ACOG |
| Postpartum hemorrhage (definition, 4 T's, stepwise uterotonics) | ACOG |
| Antepartum bleeding: previa vs abruption (+ vasa previa, accreta) | ACOG |
| Preterm labor (steroid windows, tocolytics, mag neuroprotection) | ACOG/SMFM |
| PROM & PPROM management by gestational age | ACOG |
| Ectopic pregnancy (dx algorithm, MTX criteria/contraindications) | ACOG |
| Early pregnancy loss (types, dx thresholds, mgmt options) | ACOG |
| Shoulder dystocia (risk factors, maneuver sequence) | ACOG |
| Intra-amniotic infection & postpartum endometritis | ACOG |

### 👶 Labor & monitoring (10) — ids `labor-*`

| Drill | Org |
|---|---|
| Stages & phases of labor, normal progress definitions | ACOG |
| Labor protraction & arrest (definitions → when cesarean) | ACOG |
| FHR interpretation: baseline, variability, Categories I–III | ACOG |
| Decelerations (early/late/variable: definition, cause, response) | ACOG |
| Category II/III response: intrauterine resuscitation steps | ACOG |
| Induction of labor (indications, Bishop, methods, contraindications) | ACOG |
| Operative vaginal delivery (indications, prerequisites, risks) | ACOG |
| TOLAC/VBAC (candidates, contraindications, rupture signs) | ACOG |
| Cesarean indications & timing of scheduled delivery (39-wk rule) | ACOG |
| Intrapartum emergencies (cord prolapse, uterine rupture, AFE) | ACOG |

### 🌸 GYN (10) — ids `gyn-*`

| Drill | Org |
|---|---|
| Abnormal cervical screening management (colposcopy triggers, CIN) | ASCCP |
| Contraception selection & contraindications (MEC highlights) | CDC |
| Emergency contraception (options, windows, efficacy order) | ACOG |
| AUB workup (PALM-COEIN, who gets endometrial biopsy) | ACOG |
| Postmenopausal bleeding → endometrial cancer pathway | ACOG |
| PCOS (Rotterdam criteria, workup, management by goal) | ACOG |
| Menopause & hormone therapy (dx, indications, contraindications) | ACOG/NAMS |
| STI treatment (gonorrhea, chlamydia, syphilis regimens) | CDC |
| PID (diagnostic criteria, outpatient vs inpatient, regimens) | CDC |
| Vaginitis (BV / candida / trich: dx criteria & treatment) | CDC |

Note: cervical/breast **screening intervals** already live in the FM set
(`screen-cervical`, `screen-breast`); the GYN ASCCP drill deliberately covers
*management of abnormal results* instead. Overlap with other banks is
acceptable (established rule); dedup is within-bank only.

## 6. Content pipeline (ultracode workflows)

Same shape as FM v1 (generate → 2× adversarial verify → human gate):

1. **Blueprint** — the §5 table, frozen into the workflow args.
2. **Generate** — one agent per drill, contract = the `GuidelineDrill` schema
   + density caps + "items are crisp recallable facts ≤80 chars; nuance →
   pearls" + org anchoring.
3. **Verify ×2** — two independent adversarial passes per drill checking every
   number/threshold/drug/dose against the named guideline (pass 2 sees pass
   1's output; both may rewrite). Any fact neither pass can confirm is cut or
   moved to pearls with hedged wording.
4. **Lint** — script asserts caps (groups/items/char length), unique ids,
   valid domains, non-empty orgs/reviewed.
5. **Human review gate** — `docs/obgyn-drills-review.md`: every drill's full
   answer key + pearls in one sheet, **volatile recs badged** for future
   re-verification: RSV vaccine seasonality/window, COVID-in-pregnancy
   cadence, aspirin-ppx dose, ASCCP updates, GDM threshold conventions
   (Carpenter–Coustan vs NDDG), syphilis-screening cadence. User reviews
   before merge.

## 7. Testing

- **FM regression:** existing FM drills tests pass **unchanged** — the proof
  the refactor is behavior-neutral. (Known flaky-under-load files: re-run
  individually before assuming regression.)
- **OB data invariants** (`src/data/__tests__/obGuidelineDrills.test.ts`):
  40 drills, 10/domain; caps (≤4 groups, ≤4 items/group, ≤17 items, ≤80-char
  items); unique ids; valid domain ids; org + reviewed present.
- **Bank/progress isolation:** recording an OB attempt writes only
  `osce.obdrills.v1`; FM map unaffected (and vice versa).
- **Screen render test:** `GuidelineDrills` with `OB_DRILL_BANK` shows the 4
  domain tabs and the first drill; mode switcher present.
- **Guard-test updates:** `analytics/store.test.ts` asserts ALL_KEYS covers
  every `DRILL_STORAGE_KEYS` entry; `analytics.test.tsx` asserts an OB
  drills section renders.
- tsc + prod build.

## 8. Extension points

- A 3rd clerkship's drills = one data file set + one `DrillBank` — no screen,
  progress, analytics, or export changes (keys flow from the bank list).
- Per-fact "Quiz me" mode still drops into the shared schema
  (`keyPoints[].items` are the fact units) with no data change.
