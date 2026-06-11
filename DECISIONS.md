# Design Note & Decisions Log — IM OSCE Simulator

## Design note (per brief §0)

**1. How the architecture makes hallucinated clinical findings structurally impossible.**
Every string the student ever sees with clinical content is selected — never generated — by the
deterministic engine from the case JSON. The reveal engine maps a matched history-trigger id to
verbatim `patientFile` lines (or the trigger's authored `response` when it is real content, not a
placeholder), and an exam maneuver id to a `physicalExamMappings[].finding` / `normalIfNotPresent`
string. The LLM's two functions are typed so they *cannot* inject content into that path:
`classifyIntent` returns only ids drawn from the candidate list the engine supplied (anything else
is discarded by validation), and `phrasePatientReply` returns a paraphrase that is displayed only
alongside engine-approved content and is post-filtered: clinically substantive tokens (numbers,
units, finding terms) not present in the approved source text cause the engine to fall back to the
verbatim source string. Scores are arithmetic over case metadata; the LLM at most nominates which
rubric item ids a student answer matches, and the engine only accepts ids that exist in the rubric.

**2. How it preserves OSCE realism.** Strict forward-only state machine with real station timing
(3/20/20), wall-clock-based timers that survive refresh, hidden information gated behind elicitation
(history) and exact maneuvers (exam), permanent patient lock at post-encounter, feedback only after
submission, and an SP that answers only what is asked — sensitive topics per `disclosureRules`.

**3. How the schema adapter supports both schemas.** `schemaAdapter.ts` normalizes any case into
one internal `CaseModel` with explicit capability flags (`hasHistoryTriggers`, `hasExamMappings`,
`hasOverallScoring`, `hasStandardizedPatient`, ...). Missing upgraded fields are synthesized
conservatively: domain weights inferred from `steps[].max` renormalized to 100; SP behavior derived
from `opening` + `patientFile`; reveal fallback matches student text against `patientFile` lines and
`revealKeys`. UI and engine consume only `CaseModel` — they never branch on raw JSON shape.

**4. How it scales to hundreds of cases.** Cases are lazy-loaded by id via a build-time glob
(`import.meta.glob`, dynamic import) — only the manifest (catalog) loads eagerly. The engine is
case-agnostic pure functions over `CaseModel`; the maneuver catalog is a static superset keyed by
id, so new cases referencing existing maneuver ids need zero code change. Analytics aggregates by
case id/category/difficulty, so the dashboard cost grows with attempts, not library size.

## Decisions log

1. **Trigger `response` placeholders.** In the real library, `historyTriggers[].response` is a
   bracketed instruction (e.g. "[Answer from patientFile…]"), not content. Decision: a response
   starting with "[" is treated as a placeholder → deterministic reveal extracts the matching
   verbatim line(s) from `patientFile` (keyword overlap between trigger concepts/category/id and the
   line). Real (non-bracketed) responses are used verbatim. Nothing is ever synthesized.
2. **Unmatched questions.** `patientFile` HIDDEN RULES authorize "a reasonable normal/negative
   answer" for off-file questions; the engine uses a fixed neutral set ("No, nothing like that." /
   "I'm not sure, sorry.") that carries zero clinical content, so nothing is originated.
3. **Domain mapping.** `overallScoring` has 6 domains totaling 100. Raw earned/max per source is
   scaled into the domain weight: history triggers → `history`; exam mappings → `physicalExam`;
   `differential` + `revised` steps → `differential` (clinical reasoning); `workup` step → `workup`;
   `ekg_read` + `cxr_read` → `imageInterpretation`; `management` step → `management`.
4. **Communication = capped bonus.** `communicationScoring` (5 pts) is scored deterministically from
   conversation heuristics (optionally LLM-matched) and added as a bonus domain; overall is capped
   at 100 so cases still "total 100 where possible".
5. **Penalties** subtract within their section, floored at 0 per section; unsafe management actions
   are penalties plus a flagged "unsafe action" list in feedback.
6. **Encounter / post-encounter timers** are 20:00 fixed per brief §4 (`chart` from
   `manifest.defaults.chartTimerSeconds`). `chart.timer` (per-case) overrides the manifest default
   when present, since it is case data.
7. **LLM provider.** Anthropic Messages API (browser fetch, `anthropic-dangerous-direct-browser-access`)
   behind a provider-agnostic `LlmProvider` interface; enabled only when `VITE_LLM_API_KEY` is set.
   Model default `claude-haiku-4-5-20251001` (fast classification/paraphrase), overridable via
   `VITE_LLM_MODEL`. Key never committed; documented in `.env.example`.
8. **Persistence.** Session state under `osce.session.v1` (refresh-resume), analytics under
   `osce.analytics.v1`. Entering POST_ENCOUNTER stores an irreversible `patientLocked` flag inside
   the persisted state, so refresh cannot reopen the encounter.
9. **Maneuver catalog.** Static catalog of 58 maneuvers across 10 systems, a superset of all 47
   ids referenced by the library; unmapped maneuvers return the mapping's `normalIfNotPresent` or a
   system-level safe default normal ("Heart sounds normal..." etc.) — fixed strings reviewed to
   carry no case-specific content.
10. **Images.** All `asset` fields are null in this library → labeled placeholder rendering
    `imageDescription` + attribution, per brief; no image fabrication.
11. **Communication heuristics (LLM-off).** Open-ended opener (first question matches open
    patterns), empathy phrases, permission before sensitive topics, lay-language explanation, and
    a closing understanding check — matched per `communicationScoring.items` semantics by keyword
    rules. Conservative: credit only on clear evidence.
12. **Heterogeneous scoring entries.** Upgraded read-steps author scoring items as
    bare strings or `{label, points}` (vs `{item, points}` elsewhere). The adapter
    normalizes all three; unpriced items share the step's unallocated point budget
    (critical weighted 2×), so totals stay anchored to the case's `maxPoints`.
13. **Opening statement.** The SP delivers the case-authored `opening` (verbatim
    JSON) when the student enters the room — standard OSCE behavior. Open-ended
    follow-ups that match nothing re-anchor on the opening; specific unmatched
    questions get a fixed neutral negative (sanctioned by patientFile HIDDEN RULES).
14. **"Calls the study normal" penalties** are skipped whenever a critical finding
    was credited in that section, so a correct read that also uses the word
    "normal" (e.g. "normal axis") is never punished.
15. **Adaptive question matching (post-playtest).** Triggers now match via five
    layers: exact concepts → single-token synonyms → partial concepts (≥2/3
    tokens, so "medical history" hits "past medical history") → trigger-id
    abbreviations ("pmh") → content-aware matching against the trigger's own
    claimed segments (so "do you have high blood pressure" reaches the PMH
    hypertension fact). Content matching is disabled for sensitive triggers and
    a common-word ban list prevents incidental-vocabulary leaks. A small
    lay↔medical canonicalization (high blood pressure→hypertension, heart
    attack→MI, …) applies to BOTH sides during normalization — vocabulary
    equivalence only, never new facts.
16. **Deterministic lay phrasing.** Verbatim reveals pass through a mechanical
    `layify` transform (strip "PMH:"-style labels, flip third→first person,
    de-shout caps, drop SP stage directions like "— only mentions this if
    asked…", which are also stripped at parse time so they are unrevealable).
    Content words are never added; the no-hallucination tests still hold.
17. **Clause-bounded negation.** Negation detection no longer crosses sentence
    boundaries, and a phrase counts as negated only if every occurrence is —
    so "…not a STEMI. Rate 90, sinus rhythm" still credits "rate & rhythm".
18. **UI v2.** De-cluttered redesign: card-based design system (one accent,
    soft borders/shadows, rounded), stepper-with-timer phase bar, chat bubbles
    for the encounter, tabbed right rails (Exam/Chart/Notes; History/Exam/
    Chart/Notes post-encounter), score ring on feedback.
19. **Conversational engine (post-playtest 2).** Off-target questions now get
    question-type-aware replies (when/how-long → "couldn't say exactly", open
    → "not sure", meta-comments like "stop answering like that" → deflection,
    yes/no → negative). Typo tolerance (prefix/1-edit) so "aggravatiang" matches.
    Poor-historian HPI triggers with no authored detail fall back to the
    patient's own HPI self-description rather than a denial. With AI enabled,
    off-target questions are answered in character (grounded only in the
    question+persona, guarded) instead of canned lines.
20. **Read-step images.** The library ships `asset: null` for every study, so
    the read step now links out to a real representative study (the case's own
    `source` URL, else a search on the recommended source — LITFL/Radiopaedia)
    and keeps the answer-naming written description behind an explicit reveal.
21. **Teaching curriculum (`src/data/curriculum.ts`).** A per-category teaching
    layer — reasoning schema, broad differential, standard key history
    questions, guideline-anchored tiered workup, validated decision tools, and
    real references — plus general reasoning frameworks (problem
    representation, illness scripts, must-not-miss-first, VINDICATE, anatomic,
    hypothesis-driven). Shown ONLY at the end (Feedback), never during the
    station. Educational layer, fully separate from the engine's clinical
    source of truth; references name real societies/resources as study
    starting points, not per-claim citations.
22. **Runtime AI.** API key can be set at runtime (localStorage `osce.llm.key`,
    never committed) from the Case Select screen, so AI is usable without
    editing files. Provider is rebuilt on key change. AI also produces
    per-section coaching notes in feedback (engine still owns the score).
23. **Random case + completed tracking + review.** Random-case picker prefers
    unattempted within the active filter; completed cases show a ✓ and a
    progress count; full ScoreReport is persisted per case (`osce.reviews.v1`)
    so any completed case's feedback+teaching can be reopened read-only.
24. **Teaching reformatted to the clerkship OSCE-review-session model.** After
    reviewing the actual review-session deck the OSCE is modeled on, the
    feedback teaching was restructured to mirror it: differential **buckets**,
    a general **work-up menu** (labs + imaging, each with its indication),
    **worked practice cases** in the signature format (vignette → DDx →
    work-up → results twist → updated DDx → next step), **quick-and-dirty
    management** pearls, and the **EKG 6-step** (Rate/Rhythm/Intervals/Axis/
    Hypertrophy/Ischemia) and **CXR RIP-ABCDE** reading frameworks. The reading
    guides also appear inline on the read steps. The 4 deck-covered complaints
    (Chest Pain, Abdominal Pain, Syncope, AMS) reuse the deck's actual cases /
    menus / management; the other 5 are authored in the same format. Framed by
    the deck's grading philosophy: thoroughness and reasoning over the single
    "right answer." `src/data/readingGuides.ts` + restructured
    `src/data/curriculum.ts`.
25. **Special Skills reference (`src/data/skills.ts`, Skills screen).** The
    deck's skills section, as a standalone reference reachable from Case Select:
    EKG 6-step and CXR RIP-ABCDE (from readingGuides), plus ABG/acid-base
    (stepwise approach, Winter's formula, anion gap, delta-delta, HAGMA/NAGMA
    differential table, and the deck's worked example), PFT
    (obstructive/restrictive/DLCO), ascitic fluid (SAAG + SBP), and pleural
    fluid (Light's criteria + transudate/exudate table).
26. **Broad differential & work-up in-case.** The case differential/workup
    steps were narrower than the end-of-station framework. Rather than
    hand-editing 50 JSONs, the app credits the category framework: the
    differential step earns bonus for naming items from the broad differential
    buckets, the workup step for the work-up menu (capped at ¼ section, never
    exceeding the section max). Feedback shows the full differential / broad
    work-up menu as the expected scope, ✓-marking what the student named. Engine
    stays pure — breadth lists are passed from the store
    (`breadthCreditForCategory`).
27. **Exit mid-case + dev tools.** "Exit station" is available in the header at
    every phase (confirm mid-station). A dev-only toolbar (rendered only under
    `import.meta.env.DEV`, tree-shaken from production) skips phases, fills ideal
    answers, and autocompletes to feedback for fast testing.
28. **Fast model default + picker.** The LLM defaults to `claude-haiku-4-5`
    (fast/cheap — right for intent classification + short phrasing); the Enable-AI
    panel has a model dropdown (Haiku / Sonnet / Opus), stored in
    `osce.llm.model`.
29. **Study links → LITFL Top 100.** Read-step "open a representative study"
    links and the ECG/CXR references/skills point to the LITFL Top 100 ECG
    (litfl.com/top-100/ecg/) and CXR (litfl.com/top-100/cxr/) collections — the
    browsable numbered-case sets (ecg-case-NNN / cxr-case-NNN). Specific
    number→pathology deep links are intentionally NOT hard-coded (unverifiable
    per case).
30. **LITFL study bank embedded in read steps (`src/data/litflStudies.ts`).**
    The first 50 LITFL Top 100 ECG and CXR cases (number, real URL, diagnosis,
    hallmark findings) are pulled into a bank; `applyLitflStudies` (run in
    `loadCase`) assigns a specific study to each station's ECG/CXR read step by
    catalog index. The read step links to the real case (litfl.com/ecg-case-NNN
    / cxr-case-NNN), conceals the answer, and grades the student's read against
    that study's diagnosis + findings. I did NOT fabricate number→pathology
    deep links beyond what the LITFL Top-100 index pages stated.
31. **Framework Drills (`src/ui/screens/Drills.tsx`).** Standalone reps, no full
    case: (a) differential + key questions for a chosen complaint, graded vs the
    buckets/themes; (b) work-up for a worked-case stem, graded vs the menu;
    (c) skills — ABG/acid-base, SAAG, pleural (Light's), PFT problems
    (`src/data/skillDrills.ts`) with instant grading and full worked
    explanations. Differential grading gained abbreviation canonicalization
    (NSTEMI↔ACS, "pulmonary embolism"↔PE, etc.); key questions use lenient
    shared-key-term matching since students answer in keywords.
32. **Drill grading: AI + lenient fallback + interactive results.** Drill
    grading was too harsh (deterministic keyword matching missed trops→troponin,
    echo→echocardiography, chest xray→Chest X-ray, cmp→BMP). Now grading goes
    through `store.gradeCoverage`: semantic LLM classification when a key is set,
    else a much more lenient deterministic matcher (`looseCovered` in textMatch,
    plus added work-up abbreviation synonyms/canonicalization). The work-up drill
    also gained an interactive "the results come back" follow-up — the student
    types their re-prioritized differential + next step and it's graded against
    the worked case's updated ddx, then the expert next step is shown.
33. **`revealKeys` / diagnostics.** The post-encounter workup step (`reveal: true`) unlocks the
    `dx.labs` results named in `revealKeys` after the student commits their workup answer — labs are
    shown verbatim from case JSON in a "Diagnostic Results" reader, with EKG/CXR shown in read steps.
