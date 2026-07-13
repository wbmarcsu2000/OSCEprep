# Family Medicine Drills — Design

**Date:** 2026-07-13
**Status:** Approved design, pending implementation plan
**Owner:** ClerkTools (osce-simulator)

## 1. Goal

Give the Family Medicine clerkship its own **Drills** tool. Unlike the IM drills
(which train the clinical *workflow* — differential, work-up, management), FM
drills train **mastery of specific guidelines**: the discrete, testable facts a
student must have cold for the FM shelf and wards — screening ages/intervals,
the immunization schedule, and chronic-disease targets and step therapy.

The **unit of a drill is one guideline/topic** (e.g., "Colorectal cancer
screening (USPSTF)", "COPD (GOLD)"). The student is drilled on that guideline
individually and can master it individually.

## 2. Scope

### In scope (v1)

- A new **FM Drills** screen reachable from the FM clerkship tab (FM then has
  *Questions* + *Drills*).
- **Three domain tabs**, each a set of guideline drills:
  - **Screening** (USPSTF-anchored)
  - **Immunizations** (ACIP adult schedule)
  - **Chronic Disease** (GOLD, GINA, ADA, ACC/AHA, etc.)
- **~40 guideline drills** total (counts tunable; see §6).
- **Interaction:** cued **grouped free-recall**, coverage-graded — one prompt per
  guideline that cues the dimensions to recall; the student writes what they
  know; graded by coverage against the guideline's grouped key facts (identical
  grading to the existing Differential drill); the reveal is a clean guideline
  card. Reuses AI-semantic grading when enabled, lenient keyword match otherwise.
- **Progress + mastery** per guideline (seen / best % / mastered / needs-work),
  with a browsable "all guidelines" list, stored separately from IM drills.

### Non-goals (v1)

- **Per-fact "Quiz me" mode** — deferred to a follow-up. The design leaves a clean
  extension point (§7) so it drops in without a schema change.
- Patient-vignette application drills (explicitly rejected in favor of the
  guideline-as-unit model).
- Generalizing the IM Drills engine into one config-driven engine (Approach A).
  We deliberately keep the FM screen separate and small (Approach B).
- Peds well-child schedule beyond a few adult-relevant highlights.

## 3. Approach (B — focused FM screen, reuse the proven primitives)

Chosen over (A) generalizing the 2,176-line IM `Drills.tsx` into one engine
(large refactor, real risk to a working feature) and (C) folding FM content into
IM banks (poor structural fit). Approach B reuses everything battle-tested
(grading, mastery, progress, look-and-feel) without touching the IM feature.

The FM screen is small because it has only one interaction (grouped coverage
recall) across three tabs — no EKG/CXR/labs/scores machinery.

## 4. Architecture & file plan

### 4.1 Extract shared primitives (pure move, no behavior change)

Move the already-generic pieces out of `src/ui/screens/Drills.tsx` into a shared
module `src/ui/components/drillPrimitives.tsx` (matching the existing
`src/ui/components/DrillTypeRail.tsx` convention):

- `useGrader`, `buildCoverage`, `Coverage` type
- `CoverageView`, `ScoreBar`, `ResultChip`, `GradeButton`, `MasteryControls`,
  `SeenChip`, `AiCoachNote`, `DrillBrowser`, `fmtTime`

`Drills.tsx` imports them back — **IM behavior is unchanged** (guarded by the
existing IM Drills tests as a regression check).

Add one new shared component:

- **`GroupedCoverageDrill`** — a grouped-answer-key recall drill generalized from
  the existing `DifferentialDrill` pattern (which already grades against grouped
  buckets via `buildCoverage`/`CoverageView`). Props: `prompt`,
  `keyPoints: {group, items}[]`, `pearls?`, plus the standard graded/onGrade/
  onRecord/progress props. FM uses it; IM can adopt it later.

### 4.2 Progress core split

Pull the storage-agnostic core out of `src/data/drillProgress.ts` into
`src/data/drillProgressCore.ts`:

- `DrillProgress`, `DrillManual`, `MASTERY_PCT`
- `isMastered`, `isSeen`
- a generic `record(map, key, pct)` and `setManual(map, key, manual)` operating
  on a passed-in map (the IM module keeps its own `load/save` wrapper; see below)

IM `drillProgress.ts` re-uses the core (its public API is unchanged). New
`src/data/fmDrillProgress.ts`:

- storage key `osce.fmdrills.v1` (separate from IM's `osce.drills.v1`)
- FM drill-type union `FmDrillDomain = "screening" | "immunization" | "chronic"`
- `fmDrillCatalog(domain)` / `fmSummarize(domain, map)` over the FM banks
- `recordFmAttempt` / `setFmManual` / `loadFmProgress` using the core logic

Keeping FM progress in its own key keeps FM and IM analytics cleanly separated
and avoids editing IM's exhaustive `DrillType` label/emoji records.

### 4.3 New content banks

- `src/data/fmScreeningDrills.ts`
- `src/data/fmImmunizationDrills.ts`
- `src/data/fmChronicDrills.ts`

(One file per domain keeps each focused and reviewable. A combined
`FM_GUIDELINE_DRILLS` selector can concatenate them if convenient.)

### 4.4 New screen

`src/ui/screens/FmDrills.tsx` — header + a 3-option `Segmented` domain toggle
(Screening / Immunizations / Chronic) + a progress summary bar + "Browse all"
(`DrillBrowser`) + the `GroupedCoverageDrill` body + a "Next" button that prefers
an unmastered guideline. Same visual language as IM Drills, lighter.

### 4.5 Wiring

- `src/ui/store.ts`: add `"fmdrills"` to the `View` union and
  `fmdrills: "#/fm-drills"` to `VIEW_HASH` (the exhaustive Record forces this).
- `src/App.tsx`: `{view === "fmdrills" && <FmDrills />}`.
- `src/ui/clerkships.ts`: add a **Drills** tool (icon 🎯, `var(--grad-teal)`) to
  the `fm` clerkship's `tools`, blurb describing guideline mastery drills.

## 5. Data model

```ts
export interface FmGuidelineDrill {
  id: string;                 // stable slug, e.g. "screen-colorectal"
  domain: "screening" | "immunization" | "chronic";
  name: string;               // "Colorectal cancer screening"
  org: string;                // "USPSTF" | "ACIP" | "GOLD" | "ACC/AHA" | "ADA" | "GINA" | …
  prompt: string;             // cue naming the dimensions to recall
  keyPoints: { group: string; items: string[] }[];  // grouped facts = answer key
  pearls?: string;            // high-yield notes + citation, shown on reveal
  reviewed: string;           // ISO date the facts were verified ("current as of")
}
```

Grading: the flat list of `keyPoints[].items` is the coverage answer key; the
groups drive the grouped reveal (via existing `buildCoverage`/`CoverageView`).

### Example drills

**Colorectal cancer screening — USPSTF** (`domain: "screening"`)

- `prompt`: "Recall the colorectal screening guideline: start/stop ages,
  average-risk options + intervals, and high-risk changes."
- `keyPoints`:
  - **Who / when:** start 45 · routine 45–75 · 76–85 individualized · stop >85
  - **Modalities & intervals:** colonoscopy q10y · FIT annually · FIT-DNA q1–3y ·
    CT colonography q5y · flex sig q5y
  - **Positive non-colonoscopy test:** → diagnostic colonoscopy
  - **High-risk:** 1st-degree FHx → start 40 (or 10y before relative's dx),
    colonoscopy q5y · IBD / FAP / HNPCC → earlier & more frequent

**COPD — GOLD** (`domain: "chronic"`)

- `prompt`: "Recall GOLD COPD: diagnosis, ABE assessment, initial pharmacotherapy,
  exacerbation treatment."
- `keyPoints`:
  - **Diagnosis:** post-bronchodilator FEV₁/FVC < 0.70
  - **Assess (ABE):** symptoms (mMRC/CAT) + exacerbation history → A / B / E
  - **Initial Rx:** A → a bronchodilator · B → LABA+LAMA · E → LABA+LAMA (add ICS
    if blood eosinophils ≥ 300)
  - **Exacerbation:** SABA · oral steroids ×5 days · antibiotics if increased
    sputum purulence/volume · O₂ target 88–92%
  - **Mortality benefit:** smoking cessation; long-term O₂ if PaO₂ ≤ 55 / SaO₂ ≤ 88%

## 6. Content coverage (v1, ~40 drills)

- **Screening (~15):** colorectal, breast, cervical (+HPV), lung, prostate (PSA
  shared-decision), AAA, osteoporosis, lipid/statin primary prevention,
  diabetes/prediabetes, hypertension, depression/anxiety, HIV/HCV/HBV,
  chlamydia–gonorrhea, tobacco/alcohol/obesity, aspirin primary prevention.
- **Immunizations (~10):** influenza, Td/Tdap, zoster (RZV), pneumococcal (PCV20
  / PCV15+PPSV23), HPV, COVID-19, RSV, hepatitis B, MMR/varicella catch-up,
  meningococcal/hep A (risk-based).
- **Chronic disease (~15):** HTN (ACC/AHA), T2DM (ADA), lipids/statins (ACC/AHA),
  COPD (GOLD), asthma (GINA/NAEPP), depression (PHQ-9), hypothyroidism, CKD,
  obesity, osteoporosis treatment, tobacco cessation, gout, heart-failure basics,
  anxiety (GAD-7), atrial fibrillation / anticoagulation.

## 7. Content generation & accuracy pipeline

Accuracy is the priority (guidelines *are* the content). Built as workflow
passes, mirroring the qbank pipeline:

1. **Generate** one guideline at a time, each grounded in its **named current
   guideline** (USPSTF A/B recommendations, ACIP 2024–25 adult schedule, ADA
   Standards of Care, GOLD, GINA/NAEPP, ACC/AHA). Output: grouped key facts +
   cued prompt + org + pearls.
2. **Adversarial numeric verify** — a *separate* pass per guideline that checks
   **every number** (ages, intervals, thresholds, targets, doses, eosinophil
   cutoffs, score cutoffs) against the guideline and fixes errors in place.
3. **Second independent numeric check** (perspective-diverse) on the quantitative
   facts; any fact the two passes disagree on is flagged for human review.
4. **Volatile-recommendation flagging** — a small set changes often (RSV,
   pneumococcal sequencing, aspirin primary prevention, PSA); these get extra
   scrutiny, a `reviewed` date, and an explicit "current as of" note.
5. **Human review gate** — the pipeline emits a **review sheet** (a per-guideline
   card with its facts + any flags, like the FM image review artifact). Nothing
   ships until the owner eyeballs it.

## 8. Extensibility — per-fact "Quiz me" mode (future)

The grouped `keyPoints` already decompose into individual facts, so a future mode
can turn each fact into a targeted sub-question ("average-risk colorectal start
age?") drilled flashcard-style. No schema change is required to *store* this; a
follow-up may add an optional generated `quiz?: {q; a}[]` per drill. v1 builds
none of it — it only avoids foreclosing it.

## 9. Testing

- **Data-integrity tests** (per bank): unique ids; valid `domain`/`org`;
  non-empty `name`/`prompt`; ≥1 `keyPoints` group, each with ≥1 item; a minimum
  per-domain count so the banks can't silently shrink.
- **`FmDrills` screen test:** renders → type an answer → keyword-grade → progress
  recorded → "Browse all" lists guidelines → mastery toggle works.
- **Regression guard:** the existing IM Drills tests must still pass after the
  primitives/progress-core extraction (proves the pure move changed nothing).

## 10. Risks & mitigations

- **Guideline drift / accuracy** → the multi-pass numeric verify + volatile
  flagging + human review gate (§7); `reviewed` date on every drill.
- **Refactor blast radius** (extraction) → keep it a pure move; rely on the IM
  Drills test suite; do the extraction as its own step before adding FM.
- **Coverage grading phrasing sensitivity** → AI-semantic grading when enabled;
  cued prompts that name the dimensions reduce ambiguity; the reveal always shows
  the full guideline card so the student self-checks anything the grader misses
  (same caveat already surfaced in the IM drills UI).
