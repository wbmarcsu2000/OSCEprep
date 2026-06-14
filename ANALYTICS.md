# Usage analytics & monitoring

The app can report **anonymous, privacy-respecting** usage analytics so you can
see how it's used and a coarse picture of who's using it. It is **off by
default** and inert until you configure an endpoint or provider — nothing is
sent and no consent banner appears until you opt in at build time.

## What it does and doesn't collect

**Collected (only when configured + the visitor consents):**

| Event | When | Props |
|---|---|---|
| `app_open` | app loads (consented) | — |
| `screen_view` | a section is opened | `screen` (home/select/drills/skills/analytics/station/review) |
| `case_start` | a case encounter begins | `category`, `mode` (PRACTICE/STRICT_OSCE), `difficulty` |
| `case_complete` | a case is submitted/scored | `category`, `mode`, `band` (score band), `difficulty` |
| `drill` | a drill is graded | `drillType` (differential/workup/management/skills) |
| `ai_enabled` | the user turns AI on | `provider` (anthropic/openai) |

Each event also carries: an anonymous **persistent device id** (random UUID in
`localStorage`, lets you measure returning users/retention), an ephemeral
**session id**, a timestamp, the **referrer host**, language, viewport size, and
app version. Your receiving endpoint additionally derives **country** (from IP)
and **device/browser/OS** (from the user-agent) — that's the "who they are"
(audience) picture, without any personal identity.

**Never collected:** names, emails, logins, exam answers or free text, exact
per-question scores tied to a person, API keys, or any case content beyond the
category. Enforced two ways: only the event names above are sent, and only an
allowlist of prop keys (`screen, category, mode, band, difficulty, drillType,
provider`) with length-capped primitive values — see
`src/analytics/telemetry.ts` (`sanitizeEventProps`) and its tests.

**Consent:** a one-time banner asks to Allow/Decline; the choice persists.
`Do-Not-Track` is honored as a decline and suppresses the banner.

## Turning it on — your Cloudflare Worker + D1 (with a built-in dashboard)

The Worker lives in [`analytics-worker/`](analytics-worker/): it ingests events
into a **D1** database and serves a **password-gated stats dashboard** you open in
a browser. One-time setup:

```bash
npm i -g wrangler && wrangler login
cd analytics-worker
wrangler d1 create osce-analytics          # paste the printed database_id into wrangler.toml
wrangler d1 execute osce-analytics --remote --file=./schema.sql
wrangler secret put STATS_KEY              # choose a password — it gates the dashboard
wrangler deploy                            # note the URL: https://osce-analytics.<you>.workers.dev
```

Then point the app at it:

1. GitHub → repo → **Settings → Secrets and variables → Actions → Variables** → add a
   variable named **`ANALYTICS_ENDPOINT`** set to your Worker URL.
2. Re-run the Pages deploy (push any commit, or run the "Deploy to GitHub Pages"
   workflow). The build bakes `VITE_ANALYTICS_ENDPOINT` in (see
   `.github/workflows/deploy.yml`), the consent banner appears, and events flow.

**View your stats** at:

```
https://osce-analytics.<you>.workers.dev/stats?key=YOUR_STATS_KEY
```

A live dashboard: daily activity, screens viewed, case starts/completions by
category and score band, drills, AI-enables, audience by country, and returning
vs one-time devices. The Worker adds **country** (from the visitor IP via
`request.cf.country`) and the user-agent; the app sends only the anonymous event
+ device id (no PII, answers, or keys). Full code: `analytics-worker/worker.js`
and `analytics-worker/schema.sql`.

(Optionally set a `VITE_APP_VERSION` build var to tag events with a release.)

### Alternative — Plausible (hosted, nothing to run)

Create a site in Plausible, set `VITE_PLAUSIBLE_DOMAIN` to that site's domain,
redeploy. Events show up as custom events alongside Plausible's built-in
audience report (countries, devices, browsers, sources). Note: Plausible is
cookieless and computes unique visitors with a daily-rotating salt, so the
persistent device-id signal is realized via the custom-endpoint option, not
Plausible.

## Viewing stats

- **Cloudflare Worker:** open `https://osce-analytics.<you>.workers.dev/stats?key=YOUR_STATS_KEY`
  for the built-in dashboard. For ad-hoc questions, query D1 directly:
  `wrangler d1 execute osce-analytics --remote --command "SELECT event, count(*) FROM events GROUP BY event"`.
- **Plausible:** the hosted dashboard.

The dashboard is served by your Worker, not the app — the app is a static site
with no backend, so the analytics live wherever you send the events.
