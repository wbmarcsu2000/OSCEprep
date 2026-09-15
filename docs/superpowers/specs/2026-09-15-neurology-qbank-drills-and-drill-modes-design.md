# Neurology Q-bank, Neurology drills, and the drill learning ladder — Design

**Date:** 2026-09-15
**Status:** Approved in chat (modes: Learn, Cloze, Sort, hints; generation via workflow on current models)

## Goal

Give the Neurology clerkship the same two study tools the FM and OB/GYN
clerkships have — a shelf **Question bank** and a **Drills** bank — built
from the MehlmanMedical HY Neuro PDF plus standard shelf gap-fill. And fix the
complaint that drills "require too much writing from nothing": add a learning
ladder of lower-friction modes on top of the existing grouped answer keys, so a
student can *learn* a drill before being *tested* on it.

## 1. Neurology Q-bank

Mirrors the OB/GYN bank (`docs/superpowers/specs/2026-07-07-obgyn-qbank-design.md`),
all append-only:

- Neuro clerkship (`src/ui/clerkships.ts`, id `neuro`) gains a **Questions**
  tool → view `neuromcq`, route `#/neuro-questions`; registered in
  `src/ui/store.ts` (View union + VIEW_HASH), rendered in `src/App.tsx`.
- `NEURO_BANK` in `src/data/mcqBank.ts` (storage `osce.neuromcq.v1`, code-split
  `load()` of `src/data/neuroMcq.ts`), metadata in `mcqBankMeta.ts` (`neuro`),
  appended to `MCQ_BANKS` so Analytics + export/reset pick it up automatically.
- Data: `src/data/neuroMcq.ts` (`NEURO_MCQS`, `NEURO_MCQ_SYSTEM_ORDER`,
  `NEURO_MCQ_SYSTEMS`), ids `neuro-<slug>-<n>` with the committed id ledger
  `src/data/neuroMcqIds.json` (stable ids across rebuilds, like OB).
- Question format identical to OB: quick single-best-answer vignette with
  `optionRationales` (1:1 with options), `concept`, `conceptRule`,
  `scoreComponents`, `discriminator`, `mnemonic`; **no `examTrap`**.
- Dedup within the Neuro bank only (overlap with the IM/FM Neurology systems
  is expected and not referenced).

### Domains (`NEURO_MCQ_SYSTEM_ORDER`, 15)

Stroke & Cerebrovascular · Intracranial Hemorrhage, Trauma & ICP · Spinal Cord
& Radiculopathy · Peripheral Nerve & Plexus · Neuromuscular Junction & Muscle ·
Neuropathy & Demyelinating Disease · Movement Disorders · Dementia, Delirium &
Encephalopathy · Seizures & Epilepsy · Headache & Facial Pain · Vertigo, Hearing
& Cranial Nerves · CNS Infections · Brain Tumors & Neurocutaneous Syndromes ·
Pediatric & Genetic Neurology · Neuropharmacology & Anesthesia.

### Pipeline (improved from OB)

Work dir `~/.claude/jobs/neuro_work/` (outside the repo). Source text
`src/hy_neuro.txt` (pypdf, 73 pages).

1. **Blueprint** — a workflow agent drafts `neuro_blueprint.json` (domain →
   subtopics) from the PDF *and* the NBME neurology shelf outline; reviewed by
   hand before generation.
2. **Generate** — one agent per batch (~5 subtopics) reads the source, writes
   quick vignettes with all teaching fields inline, self-checks, writes
   `neuro_gen_out/gen-NNN.json`. Idempotent; `args.pending` re-runs a subset.
3. **Verify** — one *adversarial* agent per batch at high effort, prompted to
   refute each keyed answer and every teaching field, fixing only what is
   wrong; writes `neuro_verified_out/gen-NNN.json`.
4. **Coverage critic** — after the build, one agent compares the bank's
   tested points to the blueprint + shelf outline and lists gaps; gaps feed a
   gap-fill generate → verify round (`neuro_gap_out` / `neuro_gap_verified_out`).
5. **Build** — `build_neuro_mcq.py` (copy of `build_ob_mcq.py` with Neuro
   paths, `DIR_PAIRS`, ledger): HTML-unescape, validate, dedup within bank,
   stable ids, stem-seeded option shuffle carrying rationales, emit TS.

Model policy ("updates to AI lately"): agents **inherit the session model**
(the current Claude 5 tier) rather than pinning the older Sonnet used for the
OB run; verification runs at `effort: 'high'`.

## 2. Neurology drill bank

- Neuro clerkship gains a **Drills** tool → view `neurodrills`, route
  `#/neuro-drills`, rendered as `<GuidelineDrills key="neuro" bank={NEURO_DRILL_BANK} />`.
- `NEURO_DRILL_BANK` in `src/data/guidelineDrillBank.ts` (storage
  `osce.neurodrills.v1`), appended to `GUIDELINE_DRILL_BANKS` (Analytics and
  export/reset auto-wire). Data files `src/data/neuro*Drills.ts`, aggregated by
  `src/data/neuroGuidelineDrills.ts` (`NEURO_DOMAINS`, `NEURO_GUIDELINE_DRILLS`).
- **Every item uses the head-graded form** `"<recall head> — <clue>"` (the
  OB vignette / tumors-&-hormones convention), so all learning-ladder modes
  work on this bank. Same caps: 2–4 groups, ≤5 items/group, 8–16 items, head
  ≤60 chars, item ≤200 chars; every head and every `/` alternative must be
  credited by `looseCovered`; **no head may credit another head in the same
  drill** (the collision test from `obEndoTumorDrills.test.ts`), with any
  unavoidable prefix/qualifier pairs documented.
- Each domain has a `noun` and a 3–4 step `intro` ("How to attack any stem").

### Domains (8, ~5–6 drills each, ~45 total)

Stroke syndromes · Cord & nerve localization · Dementia & movement ·
Weakness: nerve, junction & muscle · Headache, vertigo & seizures ·
Infections, toxins & nutrition · Hemorrhage, trauma & tumors · Neuro pharm.

Drills are generated by workflow agents from the PDF (one agent per drill
batch) that **run the data test themselves** (`vitest run` on their file) and
fix until green, then a verifier agent fact-checks each drill.

## 3. Drill learning ladder (all banks, `GuidelineDrills.tsx`)

Modes run off the same `keyPoints`; none introduces a new content format.
Mode order in the segmented control is the ladder:

| Mode | What the student does | Progress effect |
|---|---|---|
| **Learn** | Reads the answer key as a study table: one row per item — category, head, clue — with tap-to-hide on the head or clue column so it becomes self-quizzing. | `onRecord(0)` once (logged as seen); never grants mastery. |
| **Cloze** | One item at a time: category + clue shown, head blank. Type the head (graded by the same head matcher via `gradeCoverage` on `[head]`) or tap **Show** and self-rate Got it / Missed. Items shuffled; summary at the end. | Records the % of items credited (typed-correct or "Got it"). Counts toward mastery like a graded recall, since every item was individually recalled. |
| **Sort** | Every head in the drill as a shuffled chip; tap a chip, then tap the category bucket it belongs to (or tap a bucket first, then chips). Check answers → per-chip ✓/✗, wrong ones snap back. | Records % placed correctly. |
| **By category** | Existing. | Unchanged. |
| **Full recall** | Existing, plus **hints**: a hint bar with *Count* ("4 items, 1 named"), *First letters* (first letter of each unnamed head), and *Clue* (the clue of one unnamed item). Each hint used subtracts 5 points from the recorded % (floor 0). | Unchanged apart from the hint penalty. |
| **Flashcard** | Existing. | Unchanged. |

Availability: Cloze requires every item to have a clue (`gradableItem(item) !== item`
for all items); Learn and Sort work on any drill. Modes that don't apply are
hidden from the control for that drill, and the mode falls back to By category.
Default mode stays By category.

Implementation: new `src/ui/components/drillLadder.tsx` (`LearnTable`,
`ClozeDrill`, `SortDrill`, `HintBar`) + a pure helper module
`src/data/drillLadder.ts` (item splitting, shuffle with a seed, hint penalty,
availability) with unit tests. `GuidelineDrills.tsx` gains the modes; telemetry
uses the existing `mode` prop (`learn`, `cloze`, `sort`, `hint`).

## 4. Tests & verification

- `src/data/__tests__/neuroMcq.test.ts` (invariants, teaching fields, ids
  unique, systems ⊆ order), `mcqBankMeta.test.ts` extended to the neuro bank.
- `src/data/__tests__/neuroGuidelineDrills.test.ts` (caps, head credit, head
  collisions, domain wiring, bank order).
- `src/data/__tests__/drillLadder.test.ts` (pure helpers) and
  `src/ui/__tests__/drillLadder.test.tsx` (each mode: render, interact, records).
- Existing suites unchanged; `tsc`, full `vitest`, prod build; screenshot the
  Neuro tabs and each new mode in the real app before committing.

## Out of scope

Editing the existing Neuro "Cases" tool; changing the grader; spaced
repetition scheduling at the item level (a natural follow-on to Cloze).
