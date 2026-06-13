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

## Turning it on

Set ONE of these as a **build-time** env var (e.g. a GitHub Actions repo secret
wired into the build step), then redeploy:

```bash
# Option A — your own endpoint (full data ownership)
VITE_ANALYTICS_ENDPOINT="https://osce-analytics.<you>.workers.dev"

# Option B — Plausible (hosted dashboard, cookieless)
VITE_PLAUSIBLE_DOMAIN="osceprep.example.com"
# VITE_PLAUSIBLE_API defaults to https://plausible.io/api/event (set for self-host)
```

(Optionally `VITE_APP_VERSION` to tag events with a release.)

### Option A — custom endpoint (turnkey Cloudflare Worker)

A Worker gives you country for free (`request.cf.country`) and a queryable store
via Workers Analytics Engine. `wrangler.toml`:

```toml
name = "osce-analytics"
main = "worker.js"
[[analytics_engine_datasets]]
binding = "OSCE"
dataset = "osce_events"
```

`worker.js`:

```js
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (request.method !== "POST") return new Response("ok", { headers: CORS });
    let e;
    try { e = await request.json(); } catch { return new Response(null, { status: 204, headers: CORS }); }
    const p = e.props || {};
    const cf = request.cf || {};
    env.OSCE.writeDataPoint({
      indexes: [String(e.event || "other")],
      blobs: [
        e.event || "", p.screen || "", p.category || "", p.mode || "", p.band || "",
        p.drillType || "", p.provider || "", e.deviceId || "", e.sessionId || "",
        e.ref || "", e.lang || "", cf.country || "",
        (request.headers.get("user-agent") || "").slice(0, 256), e.app || "",
      ],
      doubles: [Number(e.vw) || 0, Number(e.vh) || 0],
    });
    return new Response(null, { status: 204, headers: CORS });
  },
};
```

Deploy with `wrangler deploy`, then query from the Cloudflare dashboard or the
[Analytics Engine SQL API](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/),
e.g.:

```sql
-- daily active devices
SELECT toDate(timestamp) AS day, count(DISTINCT blob8) AS devices
FROM osce_events WHERE blob1 = 'app_open' GROUP BY day ORDER BY day;

-- case completions by category and score band
SELECT blob3 AS category, blob5 AS band, count() AS n
FROM osce_events WHERE blob1 = 'case_complete' GROUP BY category, band ORDER BY n DESC;

-- audience by country
SELECT blob12 AS country, count(DISTINCT blob8) AS devices
FROM osce_events GROUP BY country ORDER BY devices DESC;
```

(Blob order matches the `blobs` array above: `blob1`=event … `blob8`=deviceId …
`blob12`=country.) Or store to KV/D1 instead and build any dashboard you like —
the event payload is the same JSON regardless of where you put it.

### Option B — Plausible

Create a site in Plausible, set `VITE_PLAUSIBLE_DOMAIN` to that site's domain,
redeploy. Events show up as custom events alongside Plausible's built-in
audience report (countries, devices, browsers, sources). Note: Plausible is
cookieless and computes unique visitors with a daily-rotating salt, so the
persistent device-id signal is realized via the custom-endpoint option, not
Plausible.

## Viewing stats

- **Custom endpoint:** query your store (SQL examples above), or point Grafana /
  a sheet / a small admin page at it.
- **Plausible:** the hosted dashboard.

There's no in-app admin dashboard because the app is a static site with no
backend; the analytics live wherever you send the events.
