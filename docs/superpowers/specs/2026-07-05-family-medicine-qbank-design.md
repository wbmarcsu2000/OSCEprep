# Family Medicine Q-bank + FM clerkship section

**Date:** 2026-07-05
**Status:** BUILT — 1,607 questions across 14 systems; 281 tests + prod build pass.

## Outcome (as built)
- **1,607** single-best-answer questions, 14 FM systems (Cardiology 153 · Pulmonology 111 ·
  Renal & GU 60 · Gastroenterology 155 · Heme/Onc 103 · Repro & OB-GYN 129 · Dermatology 94 ·
  Neurology 199 · Psychiatry 158 · Ophthalmology 49 · MSK & Sports Med 188 ·
  Immunizations & Allergy 36 · Endocrinology 114 · Health Maintenance & Prevention 58).
- **No cap** (per user); de-duplicated to zero repeated concepts *within* FM (1,986 extracted →
  1,589 after semantic curation → 1,607 questions after generation; build drops same-topic+same-answer dups).
- IM bank NOT referenced (overlap with IM is fine, per user).
- Pipeline (checkpoint-proof, durable on-disk state, fresh idempotent workflow launches):
  extract (Opus) → semantic curate (Sonnet) → generate+self-verify+write per batch (Sonnet).
- Gap report (topics the sources under-cover) → `docs/family-med-qbank-gaps.md` (219 items).

## Goal

Add a new, comprehensive **Family Medicine** MCQ question bank to ClerkTools, exposed
through a new **Family Medicine clerkship** section (a new top-level tab). The bank must
be comprehensive for the FM shelf while **not repeating concepts** — neither within itself
nor as near-duplicates of the existing 613-question Internal Medicine bank.

## Sources (layered)

1. **MehlmanMedical HY Family Medicine** (319 pp, ~125k words) — primary backbone; drives
   coverage and question count. 15 TOC sections (Cardio, Pulm, Renal, Gastro, Heme/Onc,
   Repro/OBGYN, Derm, Neuro, Psych, Ophthal, MSK, Immuno, Endocrine, "Fast FM bullet points",
   "Risk factor bullet points").
2. **Annabel Ricci's HY Family Med** (48 pp) — concise reinforcement + screening / prenatal /
   vaccine tables.
3. **USPSTF A & B Recommendations** (7 pp) — authoritative prevention pillar + fact-check for
   any screening numbers.

## Decisions (from user)

- **Comprehensiveness:** driven by the Mehlman PDF ("whatever is needed"); concept-driven size,
  not a fixed target. Expected ~500–800 questions after dedup.
- **De-duplication:** enforce **zero repeated concepts *within* the Family Medicine bank**. Do
  **not** compare against or dedupe against the IM bank — overlap with IM questions is acceptable
  and the IM bank is not referenced during generation. (Bank is specific to the FM shelf.)
- **Question style:** quick and to the point, matching the IM bank — tight 1–3 sentence vignette,
  crisp single-best-answer lead-in, short options, 1–2 sentence explanation. No filler.
- **FM section scope (now):** the Questions tool only (one FM clerkship tab → Qbank).

## Architecture

### Data — `src/data/familyMedMcq.ts`
- Reuses the existing `McqQuestion` interface unchanged (id, system, topic, stem, options[4–5],
  answerIndex, explanation).
- IDs namespaced `fm-<system>-<n>` (never collide with IM ids).
- **14 systems** (`FM_MCQ_SYSTEM_ORDER`): Cardiology · Pulmonology · Renal & GU ·
  Gastroenterology · Heme/Onc · Repro & OB-GYN · Dermatology · Neurology · Psychiatry ·
  Ophthalmology · MSK & Sports Med · Immunizations & Allergy · Endocrinology ·
  Health Maintenance & Prevention.
- Options pre-shuffled (seeded, stable across rebuilds) with an even A–E key distribution.

### Screen refactor — one quiz UI, two banks
- Introduce an `McqBank` descriptor `{ id, title, questions, systemOrder, storageKey }`.
- `Qbank.tsx` takes a `bank` prop; the IM bank stays the default → no behavior change for IM.
- `mcqProgress.ts` parameterized by storage key: IM keeps `osce.mcq.v1`; FM gets
  `osce.fmmcq.v1` → separate progress, zero collision.

### Navigation
- `clerkships.ts`: append `{ id:"fm", short:"FM", full:"Family Medicine", tools:[Questions] }`.
- `store.ts`: add view `"fmmcq"` + `VIEW_HASH["fmmcq"] = "#/fm-questions"`.
- `App.tsx`: `{view === "fmmcq" && <Qbank bank={FM_BANK} />}`.

## Generation pipeline (multi-phase Workflow)

Anti-repetition is enforced at the **concept layer**, before any question exists.

- **A — Concept extraction.** One agent per source slice (25 slices) → deduplicated list of
  distinct testable concepts, each tagged `{conceptKey, system, fmAngle, sourceFacts,
  difficulty}`. MIXED slices (Fast FM / Risk factor bullets) tag each concept to one of the 14
  systems.
- **B — Curate + dedup (barrier).** Group concepts by system; one curation agent per system
  strictly merges near-identical concepts **within the FM set** (no two surviving concepts test
  the same idea) and reports `missingTopics` the FM shelf needs but the sources lack
  (completeness critic). The IM bank is **not** referenced.
- **C — Generate.** Batches of ~12–15 concepts → one FM/outpatient-angled MCQ each.
- **D — Adversarial verify.** Each question independently checked (key correct? distractors
  clearly wrong? unambiguous? faithful to source / current guidelines?); fix or drop failures.
- **E — Final dedup + build.** Stem-similarity dedup within FM and vs IM; assign ids;
  pre-shuffle; emit `familyMedMcq.ts`.

## Tests / verification
- `src/data/__tests__/familyMedMcq.test.ts` mirroring the IM bank invariants (valid shape,
  `answerIndex` in range, unique ids, systems ⊆ order, min-per-system).
- `npm test` and `npm run build` (tsc) must both pass before completion.
- Report final question count + the missing-topic findings from Phase B.
