# Student Sign-In & Identity-Attributed Analytics — Design

**Date:** 2026-06-30
**Status:** Approved (design); pending implementation plan
**App:** ClerkTools / OSCE Simulator (`~/osce-simulator`) — Vite + React 19 + TS + Tailwind v4 + Zustand, static GitHub Pages SPA, with a companion Cloudflare Worker + D1 (`analytics-worker`) for usage analytics.

## Goal

Let the instructor see **which specific students** in their own Northwestern class are using the tool and **how** they use it. Today all usage analytics are anonymous (a random `device` UUID). This feature de-anonymizes that data by having each student identify themselves once at a hard sign-in gate, then stamping their identity onto the usage events that already flow to the analytics dashboard.

This is **identity-attributed analytics**, not cloud accounts: no per-user data sync, no passwords to manage, no real auth backend. "Sign in" = *identify once → tag the events we already collect.*

## Non-Goals

- No cross-device sync of a student's progress/data (progress stays in `localStorage` as today).
- No cryptographically authenticated events (the trusted-class threat model doesn't warrant it — see Trust Boundary).
- No tokens/sessions/roster allow-listing/revocation (possible future extension, not built now).
- No email deliverability verification (domain/format check only, by explicit decision).

## Decisions (locked during brainstorming)

| Decision | Choice |
|---|---|
| Purpose | Identity-attributed usage analytics for a known class |
| Cohort | Instructor's own Northwestern class (trusted, finite) |
| Access control | One shared **class password** (keeps outsiders out) |
| Identity | Student self-registers **name + Northwestern email** |
| Email enforcement | **Domain/format check only** — `@northwestern.edu` and any `@*.northwestern.edu` subdomain. No send/verify. |
| Sign-up fields | Name + email only (no extra fields) |
| Password enforcement | **Worker-checked** against a Cloudflare secret (Approach 2) — password never in repo or bundle |
| Student registry | Worker keeps a `students` table (roster of everyone who registered) |
| Consent | **Mandatory, explicit** data-collection consent on the gate. No consent → no access. |
| Gate type | **Hard gate** — no anonymous/un-consented path into the tool. Replaces the standalone `ConsentGate`. |
| Dashboard | Expanded **per-student** views on `/stats` |

## Current Architecture (relevant facts)

- **Static SPA** on GitHub Pages (`vite.config.ts` `base: "./"`); no app server. All user data in `localStorage`.
- **Analytics Worker** at `analytics-worker/worker.js` (Cloudflare Worker + D1 `osce-analytics`):
  - `POST /` — ingest `sendBeacon` events (no auth today); validates event name + props allowlist; inserts into D1 `events`.
  - `GET /stats?key=STATS_KEY` — password-gated HTML dashboard.
  - Schema `analytics-worker/schema.sql`: `events(id, received, ts, event, screen, category, mode, band, difficulty, drilltype, pct, advanced, provider, device, session, country, ua, ref, lang, app)`.
  - Config `wrangler.toml` binds D1 `osce-analytics`.
- **Telemetry sender** `src/analytics/telemetry.ts`: `track()` → `sendEndpoint()` posts `{ event, props, deviceId, sessionId, ts, ref, lang, vw, vh, app }`; gated by `osce.analytics.consent` and DNT; endpoint from `VITE_ANALYTICS_ENDPOINT`.
- **Consent gate** `src/ui/components/ConsentGate.tsx` + `consentGateRequired()` (`src/analytics/telemetry.ts`) + `gatePassed` state in `src/App.tsx` — renders in place of the whole app until consent is granted. This is the template the sign-in gate follows and **the gate it replaces**.
- **Store** `src/ui/store.ts` — Zustand, hydrates fields from `localStorage` on init (e.g. `initialMode()` reading `osce.mode`). Natural home for a `student` field.
- **Env var** `VITE_ANALYTICS_ENDPOINT` (GitHub Actions variable, baked at build in `.github/workflows/deploy.yml`) — the Worker base URL. **Reused** for the auth endpoint; no new env var.

## Components & Responsibilities

### Frontend

1. **`src/auth/identity.ts` (new)** — single source of truth for the signed-in student.
   - Type `Student { name: string; email: string; consentAt: string; version: number }`.
   - `getCurrentStudent(): Student | null` — read/parse `osce.user.v1`.
   - `setStudent(s: Student)` — persist to `osce.user.v1`.
   - `signOut()` — clear `osce.user.v1`.
   - `isSignedIn(): boolean`.
   - `validateEmail(email): { ok: boolean; reason?: string }` — trims, lowercases, checks well-formedness and that the domain is `northwestern.edu` or ends with `.northwestern.edu`. Domain list is a single exported constant `NORTHWESTERN_DOMAINS` for easy tightening.
   - Pure, fully unit-testable; no React.

2. **`src/ui/components/LoginGate.tsx` (new)** — the sign-in screen (modeled on `ConsentGate.tsx`).
   - Fields: Name, Northwestern email, Class password.
   - **Consent block**: plain-language disclosure + a required checkbox: *"I understand and agree that my name, email, and how I use this tool are collected and visible to the course instructor."*
   - **Consent is a hard precondition of sign-in itself.** Submit is disabled until: name non-empty, email passes `validateEmail`, password non-empty, **and consent is checked**. A student who does not consent cannot sign in — the `/auth` request is never sent, no identity is created, and there is no fallback/anonymous path into the tool. Declining consent = no access, full stop.
   - On submit → `POST ${endpoint}/auth` with `{ password, name, email, consent: true }`.
     - 200 → `setStudent(...)`, set consent granted, call store `setStudent`, invoke `onSignedIn()` to pass the gate.
     - 401 → inline "Incorrect class password."
     - Network/Worker error → inline "Can't reach the sign-in server. Check your connection and try again."
   - Loading state while the request is in flight.
   - **Dev/local fallback:** if `VITE_ANALYTICS_ENDPOINT` is unset, skip the server call (local-only sign-in) so dev and tests are not blocked.

3. **`src/App.tsx` (modified)** — replace the `ConsentGate` gate with the `LoginGate` gate.
   - `gatePassed` becomes "is the student signed in." `if (!signedIn) return <LoginGate onSignedIn={...} />;`
   - When `VITE_ANALYTICS_ENDPOINT` is unset (analytics off, e.g. local dev), bypass the gate entirely so the app is usable without a server.
   - The standalone `ConsentGate` render path is removed (its consent role is absorbed by `LoginGate`).

4. **`src/ui/store.ts` (modified)** — add hydrated `student: Student | null` (initialized via `getCurrentStudent()`, same pattern as `initialMode()`), plus `setStudent(s)` and `signOut()` actions.

5. **`src/analytics/telemetry.ts` (modified)** — in `sendEndpoint()`, include `student_email` and `student_name` in the payload when a student is signed in (read via `getCurrentStudent()`); omit when not. Keep `deviceId`/`sessionId` unchanged (anonymous cross-device join key). Completing sign-in sets `osce.analytics.consent = "granted"` so the existing consent-gated pipeline sends without change.
   - **DNT reconciliation (required):** today `consentState()` returns `"denied"` whenever `doNotTrack()` is true, which would silently suppress a signed-in student's events. Because data collection is now a mandatory, explicit, informed opt-in (the gate's required checkbox), that affirmative consent must **override** the browser DNT signal in the send path — otherwise a DNT student could pass the gate yet emit nothing. New send gate: signed-in + explicit consent granted ⇒ send, regardless of DNT. Flagged because it's easy to miss and would otherwise produce a student who "signed in but shows no usage."

6. **Sign-out control** — in `src/ui/screens/Analytics.tsx` (the existing `DataManagement` area): "Signed in as `<name>` (`<email>`) · Sign out." Sign-out clears local identity (returns the student to the gate) but does **not** erase server-side history (documented in the UI copy).

### Backend (`analytics-worker/`)

7. **`worker.js` (modified)**
   - **`POST /auth`** — body `{ password, name, email, consent }`.
     - **Require `consent === true`** (defense in depth — even if the client is bypassed, no consent means no registration). Missing/false → `403 { ok: false, error: "consent_required" }`. The student is **not** added to `students` and gets no identity.
     - Validate `password === env.CLASS_PASSWORD` (Cloudflare secret). Mismatch → `401 { ok: false, error: "bad_password" }`.
     - Re-validate email domain server-side (defense in depth). Bad → `400 { ok: false, error: "bad_email" }`.
     - Upsert into `students` (email PK; update `name`, `last_seen`, `consent_at`, `device`, `country`, `ua`).
     - Success → `200 { ok: true }`.
     - CORS headers consistent with the existing handlers.
   - **`POST /` (ingest)** — add `student_email`, `student_name` to the accepted/stored columns (allowlisted, clipped like other strings). Backward compatible: payloads without them store `NULL`.
   - **`GET /stats`** — expanded dashboard (below).
   - Password-check and email-validation logic factored into small **pure functions** so they're unit-testable.

8. **`schema.sql` (modified)** — fresh-DB schema gains:
   - New table `students(email TEXT PRIMARY KEY, name TEXT, first_seen INTEGER, last_seen INTEGER, consent_at INTEGER, device TEXT, country TEXT, ua TEXT)` — `consent_at` records when the student affirmatively consented (a row only exists if they did).
   - `events` gains `student_email TEXT` and `student_name TEXT` (nullable). Index `(student_email, received)`.

9. **`migrations/002_student_identity.sql` (new)** — for the **live** DB: `ALTER TABLE events ADD COLUMN student_email TEXT; ALTER TABLE events ADD COLUMN student_name TEXT;` + `CREATE TABLE IF NOT EXISTS students (...)` + the new index. (User runs `wrangler d1 execute` / `wrangler deploy` — I cannot run wrangler.)

10. **Secret** — `CLASS_PASSWORD` set via `wrangler secret put CLASS_PASSWORD` (user runs). Documented in `analytics-worker/README.md`.

### Expanded per-student dashboard (`GET /stats`)

The payoff. Existing aggregate charts stay; new sections added:

- **Roster table** — every registered student: name, email, first seen, last active, days active, total sessions, total events.
- **Per-student drill-down** (select a student):
  - Cases attempted + scores/bands over time.
  - Drills practiced + coverage/mastery % by drill type.
  - MCQs seen/correct, by system.
  - Practice vs. Strict mode usage.
  - Activity timeline (sessions/events over days).
  - Most- and least-touched features.
- All per-student queries `GROUP BY student_email` against the enriched `events` table, joined to `students` for display names. Anonymous (pre-feature, NULL `student_email`) events are bucketed as "Anonymous / pre-sign-in."

## Data Flow

1. Student opens the URL → `App` sees no signed-in student → renders `LoginGate`.
2. Student enters name + Northwestern email + class password. **If they do not check the consent box, Submit stays disabled — they cannot proceed.** With consent checked + fields valid, they submit.
3. `LoginGate` → `POST ${endpoint}/auth` with `consent: true`. Worker requires `consent === true` (else 403, no registration), then validates password (secret) + email domain, upserts `students` (with `consent_at`), returns 200.
4. `LoginGate` persists `osce.user.v1`, sets consent granted, updates store, passes the gate. App renders.
5. As the student uses the app, `telemetry.track()` → `sendEndpoint()` posts events **with** `student_email`/`student_name` → Worker stores them in `events`.
6. Instructor opens `/stats?key=STATS_KEY` → sees the roster and per-student usage.
7. On a new device, the student signs in again (same email → same identity; `students` row updated, events re-associated by email).

## Error Handling

| Condition | Behavior |
|---|---|
| Wrong class password | Inline error; stay on gate |
| Email not a Northwestern domain / malformed | Inline error; submit disabled |
| Consent unchecked (client) | Submit disabled with helper text; `/auth` never called |
| Consent absent/false (server) | `403 consent_required`; no `students` row, no identity issued |
| Worker unreachable (first sign-in) | "Can't reach the sign-in server, retry." First sign-in needs connectivity. |
| Offline after first sign-in | Identity cached locally → app works offline; events queue/send per existing behavior |
| `VITE_ANALYTICS_ENDPOINT` unset (dev/test) | Gate bypassed (local-only), app usable without server |
| Returning signed-in student | Gate skipped; straight into app |

## Trust Boundary (explicit)

Events remain fire-and-forget `sendBeacon` and are **not** cryptographically signed, so a technical user could forge events with an arbitrary identity. The class password is checked server-side (so it isn't exposed in the repo/bundle), but it gates *registration*, not every event. This is **soft access control appropriate for a trusted class**, not tamper-proof auth. Documented here and in the Worker README so expectations are clear. Future hardening (signed tokens validated on ingest, roster allow-listing) is possible but out of scope.

## Privacy & Data Handling

- Affirmative, explicit consent is **required** to use the tool (instructor requirement). The consent checkbox is the consent of record; its timestamp + a consent `version` are stored locally (`osce.user.v1`) and the registration is recorded in `students`.
- Because consent is an explicit informed opt-in that is mandatory for access, it governs for this tool; a student who does not consent simply cannot use it (by design).
- The dashboard now holds PII (names + emails) in the instructor's D1. `/stats` stays password-gated by the existing `STATS_KEY`. The disclosure states data is visible to the instructor and not sold/shared.
- Sign-out clears local identity only; server-side history persists (stated in the UI).

## Testing

**Vitest (frontend):**
- `validateEmail`: accepts `@northwestern.edu` and `@u.northwestern.edu` (and other subdomains); rejects other domains, malformed input, empty.
- `identity` module: set/get/signout round-trip; hydration from `localStorage`; corrupt-storage falls through safely.
- `telemetry`: payload includes `student_email`/`student_name` when signed in; omits them when not.
- `store`: `student` hydrates from `localStorage`; `setStudent`/`signOut` update state.
- `LoginGate` logic: submit enabled **only** when name + valid email + password + consent are all present; without consent the `/auth` request is never issued; error states for 401 / 403 / network.

**Worker:** password-check, email-validation, and **consent-enforcement** pure functions unit-tested (consent absent/false ⇒ no registration). Manual verification steps documented (`curl` `/auth` with right/wrong password and with/without `consent`; confirm a `students` row is created **only** with consent and enriched `events` via `wrangler d1 execute`; load `/stats` and confirm per-student section).

**Regression:** all 249 existing tests stay green.

## Files Touched (summary)

**Frontend (new):** `src/auth/identity.ts`, `src/ui/components/LoginGate.tsx`
**Frontend (modified):** `src/App.tsx`, `src/ui/store.ts`, `src/analytics/telemetry.ts`, Analytics/Settings screen (sign-out control), `.env.example`/deploy docs
**Backend (modified):** `analytics-worker/worker.js`, `analytics-worker/schema.sql`, `analytics-worker/README.md`
**Backend (new):** `analytics-worker/migrations/002_student_identity.sql`

**New `localStorage` key:** `osce.user.v1` (excluded from data export, like `osce.llm.key`).
**New Cloudflare secret:** `CLASS_PASSWORD` (user sets via `wrangler secret put`).

## Operator Runbook (user-run steps; I cannot run wrangler)

1. `cd analytics-worker && wrangler d1 execute osce-analytics --file=migrations/002_student_identity.sql` (apply to the live DB).
2. `wrangler secret put CLASS_PASSWORD` (set the class password).
3. `wrangler deploy` (ship the updated Worker).
4. Confirm `VITE_ANALYTICS_ENDPOINT` is set as a GitHub Actions variable (already is).
5. Share the URL + class password with the class.

## Open Questions

None blocking. Email-domain net and "name + email only" sign-up fields are confirmed defaults; both are single config points if you want to change them later.
