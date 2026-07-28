# Benign gynaecologic surgery drills — design

Short-answer drills on the common benign gyn operations, added to the OB/GYN clerkship drill bank.

## Why, and the constraint that shapes it

The existing guideline drills ask for 12–15 full-sentence facts per drill. That is a lot of typing, and
the request here was explicitly for something the student does not have to write much for. So these
drills are deliberately a different shape: **5–7 items of 2–4 words each**, roughly a fifth of the
typing, still objectively graded and still feeding mastery.

## Where it goes

A new domain `gyn-surgery` ("Benign gyn surgery", 🔪) appended to `OB_DOMAINS` in
`src/data/obGuidelineDrills.ts`, with data in a new `src/data/obGynSurgeryDrills.ts` spread into
`OB_GUIDELINE_DRILLS`. Append-only, so it inherits the `#/ob-drills` route, the `osce.obdrills.v1`
progress store, mastery, the browse-all picker, the Analytics section and `drilltype` telemetry with
no new wiring.

## Content shape

Twelve operations: hysterectomy, myomectomy, ovarian cystectomy vs oophorectomy, diagnostic and
operative laparoscopy, hysteroscopy, dilation & curettage, endometrial ablation, tubal ligation and
opportunistic salpingectomy, LEEP vs cold-knife cone, prolapse repair, midurethral sling, Bartholin
gland marsupialization.

Each operation becomes **up to four small drills**, one per dimension, rather than one large drill:

| Dimension | Asks |
|---|---|
| Indications & route | when to operate, and vaginal vs laparoscopic vs abdominal |
| Complications | the named injuries and how they present |
| Anatomy & steps | landmarks, what is ligated, what must be identified |
| Peri-op | required workup before the OR, and post-op care |

This is how "all four dimensions" reconciles with "not much writing": the dimensions are covered
across four short drills instead of one long one. Target ~40 drills.

A drill omits a dimension where it has nothing worth asking; four is a ceiling, not a quota.

## The authoring rule that makes short answers work

The coverage matcher credits an item when the **item's** tokens appear in the student's answer. Item
wording therefore decides whether a correct answer is credited, and the failure direction is silent
under-crediting. Measured:

| Item as authored | Student types | Credited |
|---|---|---|
| `Critical view of safety` | "critical view" | no |
| `Critical view` | "critical view of safety" | yes |
| `CBD injury` | "common bile duct injury" | no |
| `Bile duct injury` | "common bile duct injury" | yes |

So: **each item is the minimal distinctive phrase, spelled out, never an abbreviation.** At most 4
significant tokens. Longer or abbreviated items silently punish correct answers — the same defect
found in the focused-exam drills, so this is designed against rather than discovered later.

Enforced by `scripts/build_gyn_surgery_drills.py`, which refuses to emit on a violation, and by a test
asserting a plausible verbose phrasing still matches every item.

## Caps

≤4 groups, ≤4 items per group, **≤7 items total** (versus ~15 for guideline drills), ≤4 significant
tokens per item. Depth goes in `pearls`, which is shown on reveal and never graded. `org` carries the
real source where one exists (ACOG, AAGL); otherwise the operation family.

## Testing

- Data invariants: domain registered, unique ids, caps enforced, ≥1 item per group.
- A matching test: for every item, a verbose phrasing of it is still credited.
- Bank integration: the new domain appears in `OB_DRILL_BANK`, `drillsForDomain` returns them, and
  progress keys stay namespaced under the OB store.

## Explicitly deferred

**Photos.** Agreed to come later, as a separate piece of work. It needs an optional `image` field on
`GuidelineDrill`, rendering in `GroupedCoverageDrill` gated to appear only after grading or reveal
(an anatomy diagram next to the prompt would give the answer away), a `src/assets/drill-images/`
folder with its own CREDITS ledger, open licences only, and every image viewed before shipping —
roughly half of keyword-matched picks were wrong last time. Expect a minority of drills to end up
with a usable image; Gray's plates cover pelvic anatomy well, laparoscopic views are thin.
