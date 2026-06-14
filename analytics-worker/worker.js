/**
 * OSCE usage-analytics Worker.
 *  - POST  /        ← the app sends events here (sendBeacon JSON). Stored in D1.
 *  - GET   /stats?key=STATS_KEY  → an HTML dashboard of the usage stats.
 *  - GET   /        → liveness check.
 *
 * No personal data is collected by the app; this stores the coarse usage events
 * plus the visitor's country (from IP) and user-agent. See ../ANALYTICS.md.
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const ALLOWED_EVENTS = new Set([
  "app_open",
  "screen_view",
  "case_start",
  "case_complete",
  "drill",
  "ai_enabled",
]);

const clip = (v, n = 64) => (typeof v === "string" ? v.slice(0, n) : v == null ? "" : String(v).slice(0, n));

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

    // ---- ingest --------------------------------------------------------------
    if (request.method === "POST") {
      let e;
      try {
        e = await request.json();
      } catch {
        return new Response(null, { status: 204, headers: CORS });
      }
      if (!e || !ALLOWED_EVENTS.has(e.event)) {
        return new Response(null, { status: 204, headers: CORS });
      }
      const p = e.props || {};
      try {
        await env.DB.prepare(
          `INSERT INTO events
             (received, ts, event, screen, category, mode, band, difficulty, drilltype, provider,
              device, session, country, ua, ref, lang, app)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        )
          .bind(
            Date.now(),
            Number(e.ts) || null,
            clip(e.event),
            clip(p.screen),
            clip(p.category),
            clip(p.mode),
            clip(p.band),
            clip(p.difficulty),
            clip(p.drillType),
            clip(p.provider),
            clip(e.deviceId, 48),
            clip(e.sessionId, 48),
            clip((request.cf && request.cf.country) || ""),
            clip(request.headers.get("user-agent") || "", 256),
            clip(e.ref),
            clip(e.lang, 12),
            clip(e.app, 24),
          )
          .run();
      } catch {
        // never fail the beacon
      }
      return new Response(null, { status: 204, headers: CORS });
    }

    // ---- dashboard -----------------------------------------------------------
    if (url.pathname === "/stats") {
      if (!env.STATS_KEY || url.searchParams.get("key") !== env.STATS_KEY) {
        return new Response("Unauthorized — append ?key=YOUR_STATS_KEY", { status: 401 });
      }
      try {
        const html = await dashboard(env);
        return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
      } catch (err) {
        return new Response(`Error: ${err}`, { status: 500 });
      }
    }

    return new Response("OSCE analytics endpoint — POST events here; GET /stats?key=… for the dashboard.", {
      headers: CORS,
    });
  },
};

async function q(env, sql) {
  const res = await env.DB.prepare(sql).all();
  return res.results || [];
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

function table(title, rows, cols) {
  const head = cols.map((c) => `<th>${esc(c.label)}</th>`).join("");
  const body = rows.length
    ? rows.map((r) => `<tr>${cols.map((c) => `<td>${esc(r[c.key])}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${cols.length}" class="muted">No data yet</td></tr>`;
  return `<section><h2>${esc(title)}</h2><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></section>`;
}

async function dashboard(env) {
  const [totals, last7, daily, screens, startsByCat, completionsByCat, bands, drills, ai, countries, retention] =
    await Promise.all([
      q(env, `SELECT count(*) n, count(DISTINCT device) devices FROM events`),
      q(env, `SELECT count(*) n, count(DISTINCT device) devices FROM events WHERE received >= (strftime('%s','now')-7*86400)*1000`),
      q(
        env,
        `SELECT date(received/1000,'unixepoch') day, count(DISTINCT device) devices, count(*) events
           FROM events GROUP BY day ORDER BY day DESC LIMIT 14`,
      ),
      q(env, `SELECT screen, count(*) n FROM events WHERE event='screen_view' AND screen<>'' GROUP BY screen ORDER BY n DESC`),
      q(env, `SELECT category, count(*) n FROM events WHERE event='case_start' AND category<>'' GROUP BY category ORDER BY n DESC`),
      q(env, `SELECT category, count(*) n FROM events WHERE event='case_complete' AND category<>'' GROUP BY category ORDER BY n DESC`),
      q(env, `SELECT band, count(*) n FROM events WHERE event='case_complete' AND band<>'' GROUP BY band ORDER BY n DESC`),
      q(env, `SELECT drilltype, count(*) n FROM events WHERE event='drill' AND drilltype<>'' GROUP BY drilltype ORDER BY n DESC`),
      q(env, `SELECT provider, count(*) n FROM events WHERE event='ai_enabled' GROUP BY provider ORDER BY n DESC`),
      q(env, `SELECT country, count(DISTINCT device) devices FROM events WHERE country<>'' GROUP BY country ORDER BY devices DESC LIMIT 20`),
      q(
        env,
        `SELECT CASE WHEN sessions>1 THEN 'returning' ELSE 'one visit' END label, count(*) devices
           FROM (SELECT device, count(DISTINCT session) sessions FROM events WHERE device<>'' GROUP BY device)
           GROUP BY label ORDER BY devices DESC`,
      ),
    ]);

  const t = totals[0] || { n: 0, devices: 0 };
  const w = last7[0] || { n: 0, devices: 0 };

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>OSCE usage stats</title><style>
:root{color-scheme:light}
body{font:14px/1.5 system-ui,sans-serif;margin:0;background:#f6f7fb;color:#1c1830}
.wrap{max-width:900px;margin:0 auto;padding:24px 16px 64px}
h1{font-size:22px;margin:0 0 4px}.sub{color:#6b6880;margin:0 0 20px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:24px}
.card{background:#fff;border:1px solid #e6e4f0;border-radius:14px;padding:14px}
.card .v{font-size:26px;font-weight:800}.card .l{color:#6b6880;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
section{background:#fff;border:1px solid #e6e4f0;border-radius:14px;padding:14px 16px;margin-bottom:16px}
h2{font-size:14px;text-transform:uppercase;letter-spacing:.04em;color:#4b4862;margin:0 0 8px}
table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #efeef6}
th{font-size:12px;color:#6b6880}td:last-child,th:last-child{text-align:right;font-variant-numeric:tabular-nums}
.muted{color:#9b98ad;text-align:center}
</style></head><body><div class="wrap">
<h1>OSCE usage stats</h1>
<p class="sub">Anonymous usage analytics · refreshed live from D1</p>
<div class="cards">
  <div class="card"><div class="l">Total events</div><div class="v">${t.n}</div></div>
  <div class="card"><div class="l">All-time devices</div><div class="v">${t.devices}</div></div>
  <div class="card"><div class="l">Events · 7d</div><div class="v">${w.n}</div></div>
  <div class="card"><div class="l">Devices · 7d</div><div class="v">${w.devices}</div></div>
</div>
${table("Daily activity (last 14 days)", daily, [{ key: "day", label: "Day" }, { key: "devices", label: "Devices" }, { key: "events", label: "Events" }])}
${table("Screens viewed", screens, [{ key: "screen", label: "Screen" }, { key: "n", label: "Views" }])}
${table("Cases started", startsByCat, [{ key: "category", label: "Category" }, { key: "n", label: "Starts" }])}
${table("Cases completed", completionsByCat, [{ key: "category", label: "Category" }, { key: "n", label: "Completions" }])}
${table("Score bands", bands, [{ key: "band", label: "Band" }, { key: "n", label: "Count" }])}
${table("Drills", drills, [{ key: "drilltype", label: "Drill" }, { key: "n", label: "Reps" }])}
${table("AI enabled", ai, [{ key: "provider", label: "Provider" }, { key: "n", label: "Times" }])}
${table("Audience by country", countries, [{ key: "country", label: "Country" }, { key: "devices", label: "Devices" }])}
${table("Returning vs one-time devices", retention, [{ key: "label", label: "Type" }, { key: "devices", label: "Devices" }])}
</div></body></html>`;
}
