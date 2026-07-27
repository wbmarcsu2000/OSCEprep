# Focused Physical Exam Drills (Internal Medicine) — design

Give the student a presenting complaint and have them name the focused physical exam they would
perform. Graded by coverage, like every other IM drill.

## Why

The IM drill set trains differential, work-up, management, EKG/CXR reads, scores and lab
interpretation — the whole post-encounter half of a case. The physical exam is the one part of the
OSCE encounter with no drill behind it, even though the app already carries a 63-maneuver catalog
(`src/engine/maneuvers.ts`) that the encounter uses.

## Where it lives

A new `DrillType` `"exam"`, labelled **Focused exam**, placed in the existing "Frameworks" tab group
immediately after Differential — the order then reads the way a student thinks: differential → exam →
work-up → management.

It reuses the IM drill progress store (`osce.drills.v1`), so per-problem progress, mastery, the
browse-all picker, the Analytics "Drill progress" section, export/import/reset and `drilltype`
telemetry all pick it up with **no new wiring**. That is the payoff of `drillProgress.ts` being a
single registry, and `DRILL_TYPE_LABELS`/`DRILL_TYPE_EMOJI` being `Record<DrillType, …>` means the
compiler *demands* the new entries rather than letting one be forgotten.

Registration is six edits in `src/data/drillProgress.ts` (union, `DRILL_TYPE_ORDER`,
`DRILL_TYPE_LABELS`, `DRILL_TYPE_EMOJI`, `DRILL_TAB_GROUPS`, the `drillCatalog` switch) plus a
render branch and a next-problem case in `src/ui/screens/Drills.tsx`.

## Content model

New `src/data/examDrills.ts`:

```ts
export interface ExamDrill {
  /** exam-<category-slug>-<n>. Stable — it is the progress key. */
  id: string;
  /** One of the nine IM case categories, so the drill groups with its siblings. */
  category: string;
  /** The prompt: age/sex, complaint, duration, and triage vitals. */
  vignette: string;
  /** Answer key, grouped by exam system. */
  keyPoints: { group: string; items: string[] }[];
  /** Shown on reveal, never graded. */
  pearls?: string;
}
```

~30 drills, 3–4 per each of the nine IM categories (Abdominal Pain, Abnormal Liver Enzymes, Altered
Mental Status, Anemia, Chest Pain, Diarrhea, Dyspnea, Fever, Syncope).

`group` is drawn from the **existing `EXAM_SYSTEMS` vocabulary** in `src/engine/maneuvers.ts`
(General, Vitals, HEENT, Neck, Cardiac, Pulmonary, Abdominal, Extremities, Skin, Neuro), so the drill
speaks the same language as the OSCE encounter rather than inventing a parallel one.

### Density cap

Carried over from the FM/OB guideline drills, where it was learned the hard way: **≤4 groups, ≤4
items per group, ~12–15 items total, ≤80 characters per item.** Coverage % is named ÷ total, so a
25-item key is unmasterable and its reveal is a wall of text. Depth goes in `pearls`, which is shown
on reveal and never graded.

### Item phrasing

Maneuver **plus what you are hunting** — "Measure JVP — elevated in RV failure", not a bare "JVP".
Wording is grounded in `MANEUVERS[].label` so the existing keyword grader recognises what students
actually type.

### Triage vitals convention

The vignette includes triage vitals, because you do know them before walking into the room. The
consequence is that a vitals *answer item* must be something beyond what the vignette already shows —
orthostatics, pulsus paradoxus, blood pressure in both arms, a manual respiratory rate. Otherwise the
drill hands the student a free item.

## Grading and UI

Straight reuse of `GroupedCoverageDrill` from `src/ui/components/drillPrimitives.tsx`, which
`Drills.tsx` already imports and whose props are exactly this shape (`prompt`, `keyPoints`, `pearls`,
`badge`). The drill therefore inherits category cues, the 👁 Reveal-answer scaffold, mastery at ≥80%,
and the three interaction modes (full recall / by-category / flashcard) for free. **No new component.**

## Spoiler safety

Vignettes are **authored fresh, not derived from the 86 OSCE cases**. Deriving them was considered and
rejected: a case's `physicalExamMappings[].revealedBy` is exactly the set of maneuvers that reveal that
case's findings, so the answer key would telegraph the diagnosis to a student who later works the case.
Authored vignettes are also checked against the shipped case list so they do not accidentally
reproduce a case's presentation.

## Testing

- Data invariants: unique ids, `category` ∈ the nine IM categories, `group` ∈ `EXAM_SYSTEMS`, every
  density cap enforced, ≥1 item per group, no item over 80 chars.
- `drillCatalog("exam")` returns one entry per drill with a spoiler-safe label.
- A render-and-grade test through `GroupedCoverageDrill`, asserting the graded percentage and that
  the attempt persists to `osce.drills.v1`.

## Content pipeline

Generate → adversarial clinical verify (the OB-drills pattern), then a human review sheet at
`docs/im-exam-drills-review.md` so the content can be approved before it ships.

## Deliberately not doing

- **Selection from the maneuver catalog** instead of free recall. It would score precision as well as
  recall, which is what "focused" really means — but it is recognition rather than recall, needs a new
  component, and would be the only IM drill with a different interaction. Revisit if students ask.
- **Penalising over-testing** via authored "not indicated here" distractors. Same reasoning: real
  teaching value, but it needs a grader change and per-vignette distractor authoring.
