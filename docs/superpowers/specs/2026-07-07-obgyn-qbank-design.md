# OB/GYN Shelf Q-bank — Design

**Date:** 2026-07-07
**Status:** Approved

## Goal

Add a comprehensive OB/GYN shelf question bank to ClerkTools, in the same
format as the Family Medicine bank, built from two high-yield sources:

- `Annabel Ricci's HY OBGYN.pdf` — structured HY shelf notes (Obstetrics → Gynecology)
- `HY-Obgyn.pdf` — MehlmanMedical HY OBGYN, dense NBME-style factoid vignettes

## App integration (mirrors FM, all append-only)

- New **OB/GYN clerkship tab** in `src/ui/clerkships.ts` with one tool
  **"Questions"** → new view `obmcq`, route `#/ob-questions`.
- Register `obmcq` in `src/ui/store.ts` (View union + VIEW_HASH); render in
  `src/App.tsx` (`{view === "obmcq" && <Qbank bank={OB_BANK} />}`).
- New `OB_BANK` descriptor in `src/data/mcqBank.ts` (storage key
  `osce.obmcq.v1` — independent progress).
- Generated data: `src/data/obgynMcq.ts` (`OB_MCQS`, `OB_MCQ_SYSTEM_ORDER`).
- The generic `Qbank` screen already provides: collapse-on-click per-option
  rationales, hidden redundant explanation when a concept exists, session-length
  chunking, default-Unseen subset, sticky Missed pool, no in-screen header.

## Question format (identical to FM)

Quick single-best-answer vignettes with the shared `McqQuestion` teaching
fields: `optionRationales` (1:1 with options), `concept`, `conceptRule`
(threshold→action for guideline/score topics), `scoreComponents` (Bishop score,
APGAR, etc.), `discriminator`, `mnemonic`. **No `examTrap`** (removed globally).
Topic is a spoiler → shown only in post-answer feedback.

## Coverage — sources + gap-fill

14-domain blueprint (`OB_MCQ_SYSTEM_ORDER`):

Obstetrics: Prenatal Care & Normal Pregnancy · Early Pregnancy Complications ·
Medical Complications of Pregnancy · Labor & Delivery · Postpartum.
Gynecology: Menstrual Disorders · Reproductive Endocrinology & Infertility ·
Contraception · Menopause · Benign Gynecology · Gynecologic Oncology ·
Breast Disorders · Gynecologic Infections & STIs · Cervical Dysplasia & Screening.

Each domain has an authored subtopic outline covering the standard OB/GYN shelf
blueprint (gap-fill beyond the two PDFs is allowed and expected). Dedup is
**WITHIN the OB bank only** — overlap with the IM/FM banks is fine and NOT
referenced.

## Pipeline

1. Extract both PDFs to text (`pypdf`) → `ob_src/{ricci,mehlman}.txt`.
2. Author `ob_blueprint.json` (domain → subtopics).
3. `ob_gen_workflow.js` — batch subtopics per domain (~6/batch); one combined
   Sonnet agent per batch reads the two source files for grounding, generates
   quick vignettes WITH teaching fields inline, self-verifies, dedups within its
   batch, writes `ob_gen_out/gen-NNN.json`. Idempotent (skip existing batches).
4. `build_ob_mcq.py` — read batch JSONs, HTML-unescape, validate, dedup within
   bank (exact stem + near-dup Jaccard≥0.82 + same-topic+same-answer), assign
   `ob-<slug>-<n>` ids, stem-seeded deterministic option shuffle, emit
   `obgynMcq.ts`.
5. Wire app + `src/data/__tests__/obgynMcq.test.ts` (invariants + teaching-field
   well-formedness). Verify tsc + full vitest + prod build.
6. Commit, push/merge to main (deploy), update memory.

No cap — comprehensive.
