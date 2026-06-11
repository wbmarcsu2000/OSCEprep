# OSCEprep — Internal Medicine OSCE Simulator

A web app that simulates an Internal Medicine clerkship OSCE station: timed chart
review → standardized-patient encounter with elicited-only history and an
exact-maneuver physical exam → locked post-encounter written exercises →
rubric-grounded feedback, end-of-station teaching, longitudinal analytics, and
framework/skill drills.

> **For medical education and OSCE practice only. Not for clinical decision-making.**
> All cases are fictional. No PHI, no real patient data, no backend.

## For students (using the hosted app)

Open the link your instructor shared (GitHub Pages: `https://wbmarcsu2000.github.io/OSCEprep/`).
Nothing to install. Pick a station and hit **Begin**, or try **🎯 Drills**,
**📖 Skills**, and **📊 Performance**. Completed cases get a ✓ and a **Review** link.

**Optional — turn on the AI patient & smart grading.** Click **Enable AI** on the
home screen and paste your own API key:

- **Anthropic (Claude):** `sk-ant-…` — get one at https://console.anthropic.com
- **OpenAI (GPT):** `sk-…` / `sk-proj-…` — get one at https://platform.openai.com

The key is **stored only in your own browser**, sent only to that provider, and
verified on save (you'll see "✓ AI verified"). You pay for your own usage; the
default models (Claude Haiku / GPT-4o mini) are fast and cheap. Without a key the
app still works fully on the built-in deterministic engine. Don't paste a key on a
shared/public computer.

## Develop / run locally

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # engine + UI test suite (Vitest)
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

A build-time key is also supported (`cp .env.example .env.local`, set
`VITE_LLM_API_KEY`), but for a class deployment the in-app per-student key is
preferred — see below.

## Deploying

The app is a **static SPA** (no backend, no server secrets), so any static host
works. The repo ships a **GitHub Pages** workflow (`.github/workflows/deploy.yml`)
that builds, tests, and deploys on every push to `main`.

To turn it on once:

1. Push to `git@github.com:wbmarcsu2000/OSCEprep.git` (branch `main`).
2. GitHub → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The next push publishes to `https://wbmarcsu2000.github.io/OSCEprep/`.

Vite `base` is `./` (relative), so the same build also works on Netlify/Vercel
(drop in the repo, build command `npm run build`, output `dist`) or any path.

**Key model for a class:** each student brings their own API key (above) — there
is no shared server key to manage, and the app is fully usable with no key. If you
later want one key to serve everyone (so students don't need their own), that
requires a small server proxy holding the key; ask and it can be added.

## Architecture (the one invariant)

**The case JSON is the single source of clinical truth. The deterministic
engine — never the LLM — decides what is revealed and how many points are
earned.**

- `src/engine/` — pure TypeScript, no React, fully unit-tested:
  - `schemaAdapter.ts` normalizes original (2.0) and upgraded (2.1) case JSON
    into one internal `CaseModel`; all absent-field fallbacks live here.
  - `revealEngine.ts` gates hidden history (trigger concepts + verbatim
    patientFile segments) and exam findings (exact maneuvers → mapped
    findings; grounded normals otherwise). Content that belongs to an
    un-asked trigger or un-performed maneuver is structurally unreachable.
  - `scoringEngine.ts` computes every point from case metadata: sections,
    six weighted domains (totaling 100), communication bonus (capped),
    penalties (assertion + omission), unsafe actions, and aggregated misses.
  - `stateMachine.ts` — forward-only `CHART_REVIEW → PATIENT_ENCOUNTER →
    POST_ENCOUNTER → FEEDBACK`; wall-clock timers (throttle/refresh-proof);
    entering post-encounter permanently locks the patient (tamper-resistant
    across refresh).
- `src/llm/` — strictly an enhancement layer with two functions:
  `classifyIntent` (returns only case-defined ids) and `phrasePatientReply`
  (paraphrase post-filtered by a content guard: any number or substantive
  token not present in the approved source falls back to the verbatim case
  text). Deterministic fallback keeps the entire app working LLM-off.
- `src/data/` — the 50-case library (`manifest.json`, `litfl_sources.json`,
  `cases/*.json`), loaded lazily per case. Image `asset` fields are null in
  this library, so studies render as labeled placeholders from the authored
  `imageDescription` with attribution; images are never fabricated.
- `src/analytics/` — localStorage longitudinal analytics (scores over time,
  domain trends, by category/difficulty, most-missed items).

## Station flow

| Phase | Time (Strict OSCE) | Notes |
|---|---|---|
| Chart review | 3:00 (per case `chart.timer`) | Door chart + scratchpad only |
| Patient encounter | 20:00 | Free-text interview + ~58 searchable exact maneuvers; manual early end |
| Post-encounter | 20:00 | Patient locked; sequential steps; answers autosave; expiry auto-submits |
| Feedback | — | Only after submission; grounded entirely in case JSON + your recorded actions |

Practice Mode disables timers but preserves all gating, hidden information,
and scoring.

## Tests

`npm test` covers reveal gating, exam gating, scoring math (penalties, bonus
caps, omission penalties, negation handling), the forward-only state machine
and patient lock (including simulated refresh + tampering), timers, schema
adapter fallbacks on an original-schema fixture, a no-hallucination sweep
(every reveal asserted verbatim-grounded in the source JSON), the LLM-off full
loop, the paraphrase content guard, the full 50-case library (loads, adapts,
plays end-to-end per category), and UI hiding rules.

See `DECISIONS.md` for the design note and decisions log.
