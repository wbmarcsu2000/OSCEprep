# FM Q-bank teaching-mode explanations

**Date:** 2026-07-06
**Status:** approved, in build

## Goal

Make the Family Medicine Q-bank questions stronger teaching resources by adding, to each
question: (1) a one-sentence rationale for **every** answer option (why the correct one is right;
why each distractor is wrong or when it *would* be correct), and (2) a succinct **concept**
teaching block that generalizes the underlying point — with a compact "threshold → action" rule
for guideline/score topics (HTN staging, CIWA, CURB-65, Wells, Centor, Child-Pugh, etc.).

Scope: **Family Medicine bank only** (1,860 questions). IM bank unchanged (renders as today).

## Data model

Extend the shared `McqQuestion` interface (`src/data/shelfMcq.ts`) with three **optional** fields —
optional so the IM bank and any un-augmented FM question render exactly as before:

```ts
optionRationales?: string[]; // aligned 1:1 to options[]; one sentence per option
concept?: string;            // 2-4 sentence generalizable teaching point
conceptRule?: string[];      // compact "threshold -> action" bullets; only for guideline/score topics
```

- `optionRationales[i]` explains `options[i]`: for the correct option, why it's right; for a
  distractor, why it's wrong OR the scenario in which it would be the best answer.
- `conceptRule` is present only where a scannable rule adds value; omitted otherwise.

## Runtime

`shuffleOptions` currently shuffles `options` and remaps `answerIndex`. Change it to compute one
permutation and apply it to **both** `options` and `optionRationales` (when present), then remap
`answerIndex`. Rationales can never desync from their option.

## UI (post-answer only — never spoils the stem)

`src/ui/screens/Qbank.tsx`:
- Each option renders its one-line rationale beneath the option text once `answered` (correct →
  green, chosen-wrong → red, others muted). `OptionButton` gains optional `rationale` + `revealed`.
- The feedback card renders a **"Concept"** block when `concept` is present: the blurb plus
  `conceptRule` bullets. When `concept` is absent (IM / un-augmented), it falls back to the existing
  `explanation` line — no behavior change for IM.

## Generation (augment in place — do NOT regenerate)

Preserve the verified/deduped 1,860 questions; only add fields.

1. Extract the current questions from `familyMedMcq.ts` (id, stem, options, answerIndex,
   explanation, topic, system).
2. Batch → one Sonnet agent per batch. For each question the agent returns, keyed by `id`:
   `optionRationales` (aligned to the given options order), `concept`, and `conceptRule` (only for
   guideline/score topics). Grounded in the question's own stem/options/answer; self-checks that
   `optionRationales.length === options.length` and that the correct option's rationale is
   affirmative. Writes to `fm_aug_out/aug-NNN.json`. Durable + idempotent (re-run only missing
   batches), same pattern as the build pipeline.
3. Merge script loads `familyMedMcq.ts` questions + all `aug-*.json` by `id`, attaches the three
   fields (options order preserved so rationale alignment holds), and rewrites `familyMedMcq.ts`.
   Questions missing an augmentation keep their current shape (graceful).

## Tests / verification

- Extend `src/data/__tests__/familyMedMcq.test.ts`: when `optionRationales` present,
  `length === options.length` and every entry non-empty; when `concept` present, non-empty; coverage
  count (≈ all FM questions augmented).
- UI test: after answering, per-option rationales and the concept block appear; before answering,
  they do not.
- `npm test`, `tsc`, and `npm run build` all pass.
