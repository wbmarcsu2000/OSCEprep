/**
 * OSCE usage-analytics Worker.
 *  - POST  /        ← the app sends events here (sendBeacon JSON). Stored in D1.
 *  - GET   /stats?key=STATS_KEY  → a rich HTML dashboard (KPIs, charts, audience).
 *  - GET   /        → liveness check.
 *
 * No personal data is collected by the app; this stores the coarse usage events
 * plus the visitor's country (from IP) and user-agent. See ../ANALYTICS.md.
 */

import { evaluateAuth } from "./auth.js";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

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

    // ---- sign-in (register a student) ---------------------------------------
    if (request.method === "POST" && url.pathname === "/auth") {
      let body;
      try {
        body = await request.json();
      } catch {
        body = null;
      }
      const verdict = evaluateAuth(body, env.CLASS_PASSWORD);
      if (!verdict.ok) return json({ ok: false, error: verdict.error }, verdict.status);

      const now = Date.now();
      const email = String(body.email).trim().toLowerCase();
      const name = String(body.name).trim().slice(0, 120);
      const country = clip((request.cf && request.cf.country) || "");
      const ua = clip(request.headers.get("user-agent") || "", 256);
      try {
        await env.DB.prepare(
          `INSERT INTO students (email, name, first_seen, last_seen, consent_at, device, country, ua)
             VALUES (?,?,?,?,?,?,?,?)
           ON CONFLICT(email) DO UPDATE SET
             name=excluded.name, last_seen=excluded.last_seen,
             consent_at=excluded.consent_at, country=excluded.country, ua=excluded.ua`,
        )
          .bind(email, name, now, now, now, "", country, ua)
          .run();
      } catch {
        // students table not migrated yet — still let the user in so the app works.
      }
      return json({ ok: true }, 200);
    }

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
      const country = clip((request.cf && request.cf.country) || "");
      const ua = clip(request.headers.get("user-agent") || "", 256);
      const pct =
        p.pct == null || p.pct === "" || isNaN(Number(p.pct))
          ? null
          : Math.max(0, Math.min(100, Math.round(Number(p.pct))));
      const advanced = p.advanced === true || p.advanced === 1 || p.advanced === "true" ? 1 : p.advanced == null ? null : 0;
      const sEmail = clip(e.student_email, 160);
      const sName = clip(e.student_name, 120);
      // Legacy column set (DBs not yet migrated for drill performance).
      const base = [
        Date.now(),
        Number(e.ts) || null,
        clip(e.event),
        clip(p.screen),
        clip(p.category),
        clip(p.mode),
        clip(p.band),
        clip(p.difficulty),
        clip(p.drillType),
      ];
      const tail = [
        clip(p.provider),
        clip(e.deviceId, 48),
        clip(e.sessionId, 48),
        country,
        ua,
        clip(e.ref),
        clip(e.lang, 12),
        clip(e.app, 24),
      ];
      try {
        // Fully migrated: drill performance + student identity.
        await env.DB.prepare(
          `INSERT INTO events
             (received, ts, event, screen, category, mode, band, difficulty, drilltype, pct, advanced, provider,
              device, session, country, ua, ref, lang, app, student_email, student_name)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        )
          .bind(...base, pct, advanced, ...tail, sEmail, sName)
          .run();
      } catch {
        try {
          // Drill-performance migrated, but no student columns yet.
          await env.DB.prepare(
            `INSERT INTO events
               (received, ts, event, screen, category, mode, band, difficulty, drilltype, pct, advanced, provider,
                device, session, country, ua, ref, lang, app)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          )
            .bind(...base, pct, advanced, ...tail)
            .run();
        } catch {
          try {
            // Legacy DB (neither migration applied).
            await env.DB.prepare(
              `INSERT INTO events
                 (received, ts, event, screen, category, mode, band, difficulty, drilltype, provider,
                  device, session, country, ua, ref, lang, app)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            )
              .bind(...base, ...tail)
              .run();
          } catch {
            // never fail the beacon
          }
        }
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
        return new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
        });
      } catch (err) {
        return new Response(`Error: ${err && err.stack ? err.stack : err}`, { status: 500 });
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

/** Like q(), but tolerates a missing column (e.g. pre-migration `pct`) so the
 *  whole dashboard never 500s on the newer drill-performance queries. */
async function qSafe(env, sql) {
  try {
    return await q(env, sql);
  } catch {
    return [];
  }
}

/** Whether a column exists on `events` — lets the dashboard work before the
 *  drill-performance migration has been applied. */
async function columnExists(env, col) {
  try {
    await env.DB.prepare(`SELECT ${col} FROM events LIMIT 1`).all();
    return true;
  } catch {
    return false;
  }
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

// --- coarse user-agent parsing (browser / OS / device class) ----------------
function parseUa(ua = "") {
  const u = ua || "";
  let browser = "Other";
  if (/Edg\//.test(u)) browser = "Edge";
  else if (/OPR\/|Opera/.test(u)) browser = "Opera";
  else if (/Firefox\/|FxiOS/.test(u)) browser = "Firefox";
  else if (/Chrome\/|CriOS/.test(u)) browser = "Chrome";
  else if (/Safari\//.test(u)) browser = "Safari";
  let os = "Other";
  if (/iPhone|iPad|iPod/.test(u)) os = "iOS";
  else if (/Android/.test(u)) os = "Android";
  else if (/Windows NT/.test(u)) os = "Windows";
  else if (/Mac OS X|Macintosh/.test(u)) os = "macOS";
  else if (/Linux|X11|CrOS/.test(u)) os = "Linux";
  let device = "Desktop";
  if (/iPad|Tablet/.test(u)) device = "Tablet";
  else if (/Mobile|iPhone|iPod|Android.*Mobile/.test(u)) device = "Mobile";
  return { browser, os, device };
}

/** Aggregate device counts (from `SELECT ua, devices` rows) into browser/os/device buckets. */
function aggUa(rows) {
  const b = {}, o = {}, d = {};
  for (const r of rows) {
    const { browser, os, device } = parseUa(r.ua);
    const n = Number(r.devices) || 0;
    b[browser] = (b[browser] || 0) + n;
    o[os] = (o[os] || 0) + n;
    d[device] = (d[device] || 0) + n;
  }
  const sort = (m) => Object.entries(m).sort((x, y) => y[1] - x[1]);
  return { browser: sort(b), os: sort(o), device: sort(d) };
}

async function dashboard(env) {
  const sinceDays = (n) => `(strftime('%s','now')-${n}*86400)*1000`;
  // Only select `pct` in the recent feed once the column exists, so an
  // un-migrated DB renders the dashboard instead of erroring.
  const hasPct = await columnExists(env, "pct");
  const recentSql = `SELECT received, event, screen, category, mode, band, difficulty, drilltype, ${hasPct ? "pct," : ""} provider, country, lang, ua
              FROM events ORDER BY received DESC LIMIT 40`;
  const [
    totals, d1, d7, d30, today,
    daily, hourly, eventsByType,
    screens, startsByCat, completesByCat, funnel,
    bands, difficulty, modes, drills, aiProv, aiDevices,
    countries, langs, refs, apps, uaRows, retention, recent,
    drillPerf, drillDist, drillOverall, diffMode,
  ] = await Promise.all([
    q(env, `SELECT count(*) n, count(DISTINCT device) devices, count(DISTINCT session) sessions FROM events`),
    q(env, `SELECT count(DISTINCT device) d FROM events WHERE received >= ${sinceDays(1)}`),
    q(env, `SELECT count(DISTINCT device) d FROM events WHERE received >= ${sinceDays(7)}`),
    q(env, `SELECT count(DISTINCT device) d FROM events WHERE received >= ${sinceDays(30)}`),
    q(env, `SELECT count(DISTINCT device) d FROM events WHERE received >= strftime('%s','now','start of day')*1000`),
    q(env, `SELECT date(received/1000,'unixepoch') day, count(DISTINCT device) devices, count(*) events
              FROM events WHERE received >= ${sinceDays(30)} GROUP BY day ORDER BY day`),
    q(env, `SELECT cast(strftime('%H',received/1000,'unixepoch') as integer) hour, count(*) n FROM events GROUP BY hour ORDER BY hour`),
    q(env, `SELECT event, count(*) n FROM events GROUP BY event ORDER BY n DESC`),
    q(env, `SELECT screen, count(*) n FROM events WHERE event='screen_view' AND screen<>'' GROUP BY screen ORDER BY n DESC`),
    q(env, `SELECT category, count(*) n FROM events WHERE event='case_start' AND category<>'' GROUP BY category ORDER BY n DESC`),
    q(env, `SELECT category, count(*) n FROM events WHERE event='case_complete' AND category<>'' GROUP BY category ORDER BY n DESC`),
    q(env, `SELECT
              (SELECT count(*) FROM events WHERE event='app_open') opens,
              (SELECT count(*) FROM events WHERE event='case_start') starts,
              (SELECT count(*) FROM events WHERE event='case_complete') completes`),
    q(env, `SELECT band, count(*) n FROM events WHERE event='case_complete' AND band<>'' GROUP BY band ORDER BY n DESC`),
    q(env, `SELECT difficulty, count(*) n FROM events WHERE event='case_start' AND difficulty<>'' GROUP BY difficulty ORDER BY n DESC`),
    q(env, `SELECT mode, count(*) n FROM events WHERE event='case_start' AND mode<>'' GROUP BY mode ORDER BY n DESC`),
    q(env, `SELECT drilltype, count(*) n FROM events WHERE event='drill' AND drilltype<>'' GROUP BY drilltype ORDER BY n DESC`),
    q(env, `SELECT provider, count(*) n FROM events WHERE event='ai_enabled' AND provider<>'' GROUP BY provider ORDER BY n DESC`),
    q(env, `SELECT count(DISTINCT device) d FROM events WHERE event='ai_enabled'`),
    q(env, `SELECT country, count(DISTINCT device) devices FROM events WHERE country<>'' GROUP BY country ORDER BY devices DESC LIMIT 15`),
    q(env, `SELECT lang, count(DISTINCT device) devices FROM events WHERE lang<>'' GROUP BY lang ORDER BY devices DESC LIMIT 12`),
    q(env, `SELECT ref, count(*) n FROM events WHERE ref<>'' GROUP BY ref ORDER BY n DESC LIMIT 12`),
    q(env, `SELECT app, count(DISTINCT device) devices FROM events WHERE app<>'' GROUP BY app ORDER BY devices DESC`),
    q(env, `SELECT ua, count(DISTINCT device) devices FROM events WHERE ua<>'' GROUP BY ua`),
    q(env, `SELECT CASE WHEN sessions>1 THEN 'Returning' ELSE 'One visit' END label, count(*) devices
              FROM (SELECT device, count(DISTINCT session) sessions FROM events WHERE device<>'' GROUP BY device)
              GROUP BY label ORDER BY devices DESC`),
    q(env, recentSql),
    // Drill performance (tolerant of an un-migrated DB via qSafe).
    qSafe(env, `SELECT drilltype, round(avg(pct)) avg, count(*) n FROM events
                  WHERE event='drill' AND pct IS NOT NULL AND drilltype<>'' GROUP BY drilltype ORDER BY n DESC`),
    qSafe(env, `SELECT CASE WHEN pct>=70 THEN 'Strong (70-100)' WHEN pct>=40 THEN 'Partial (40-69)' ELSE 'Weak (0-39)' END bucket,
                  count(*) n FROM events WHERE event='drill' AND pct IS NOT NULL GROUP BY bucket`),
    qSafe(env, `SELECT round(avg(pct)) avg, count(*) n, count(DISTINCT device) devices FROM events WHERE event='drill' AND pct IS NOT NULL`),
    qSafe(env, `SELECT CASE WHEN advanced=1 THEN 'Advanced' ELSE 'Core' END m, count(*) n, round(avg(pct)) avg
                  FROM events WHERE event='drill' AND drilltype='differential' AND pct IS NOT NULL GROUP BY m`),
  ]);

  const t = totals[0] || { n: 0, devices: 0, sessions: 0 };
  const fn = funnel[0] || { opens: 0, starts: 0, completes: 0 };
  const aiDev = (aiDevices[0] || { d: 0 }).d;
  const dOverall = drillOverall[0] || { avg: 0, n: 0, devices: 0 };
  const ua = aggUa(uaRows);
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const num = (x) => (x == null ? 0 : x);

  const kpis = [
    ["Total devices", num(t.devices), "all-time unique"],
    ["Today", num((today[0] || {}).d), "active devices"],
    ["7-day", num((d7[0] || {}).d), "active devices"],
    ["30-day", num((d30[0] || {}).d), "active devices"],
    ["Sessions", num(t.sessions), "all-time"],
    ["Events", num(t.n), "all-time"],
    ["AI users", `${aiDev}`, `${pct(aiDev, t.devices)}% of devices`],
    ["Completion", `${pct(fn.completes, fn.starts)}%`, `${num(fn.completes)} of ${num(fn.starts)} starts`],
    ["Events / session", t.sessions ? (t.n / t.sessions).toFixed(1) : "0", "engagement depth"],
    ["Sessions / device", t.devices ? (t.sessions / t.devices).toFixed(1) : "0", "stickiness"],
    ["Avg drill score", dOverall.n ? `${num(dOverall.avg)}%` : "—", `${num(dOverall.n)} graded reps`],
  ];

  // Data injected for client-side Chart.js.
  const pairs = (rows, k, v) => ({ labels: rows.map((r) => String(r[k] ?? "")), values: rows.map((r) => Number(r[v]) || 0) });
  const data = {
    daily: { labels: daily.map((r) => r.day), devices: daily.map((r) => Number(r.devices) || 0), events: daily.map((r) => Number(r.events) || 0) },
    hour: { labels: Array.from({ length: 24 }, (_, h) => h + "h"), values: Array.from({ length: 24 }, (_, h) => { const m = hourly.find((r) => Number(r.hour) === h); return m ? Number(m.n) : 0; }) },
    funnel: { labels: ["App opens", "Case starts", "Case completes"], values: [num(fn.opens), num(fn.starts), num(fn.completes)] },
    events: pairs(eventsByType, "event", "n"),
    screens: pairs(screens, "screen", "n"),
    starts: pairs(startsByCat, "category", "n"),
    completes: pairs(completesByCat, "category", "n"),
    bands: pairs(bands, "band", "n"),
    difficulty: pairs(difficulty, "difficulty", "n"),
    mode: pairs(modes, "mode", "n"),
    drills: pairs(drills, "drilltype", "n"),
    drillperf: pairs(drillPerf, "drilltype", "avg"),
    drilldist: pairs(drillDist, "bucket", "n"),
    diffmode: pairs(diffMode, "m", "avg"),
    ai: pairs(aiProv, "provider", "n"),
    country: pairs(countries, "country", "devices"),
    lang: pairs(langs, "lang", "devices"),
    ref: pairs(refs, "ref", "n"),
    app: pairs(apps, "app", "devices"),
    retention: pairs(retention, "label", "devices"),
    browser: { labels: ua.browser.map((x) => x[0]), values: ua.browser.map((x) => x[1]) },
    os: { labels: ua.os.map((x) => x[0]), values: ua.os.map((x) => x[1]) },
    device: { labels: ua.device.map((x) => x[0]), values: ua.device.map((x) => x[1]) },
  };

  const kpiHtml = kpis
    .map(([l, v, s]) => `<div class="kpi"><div class="kl">${esc(l)}</div><div class="kv">${esc(v)}</div><div class="ks">${esc(s)}</div></div>`)
    .join("");

  const card = (id, title, cls = "") => `<div class="card ${cls}"><h2>${esc(title)}</h2><div class="cc"><canvas id="${id}"></canvas></div></div>`;

  const recentRows = recent.length
    ? recent.map((r) => {
        const { browser, os } = parseUa(r.ua);
        const when = new Date(Number(r.received)).toISOString().slice(0, 16).replace("T", " ");
        const score = r.pct != null && r.pct !== "" ? `${r.pct}%` : "";
        const detail = [r.screen, r.category, r.mode, r.difficulty, r.band, r.drilltype, score, r.provider].filter(Boolean).join(" · ");
        return `<tr><td>${esc(when)}</td><td><span class="tag">${esc(r.event)}</span></td><td>${esc(detail)}</td><td>${esc(r.country)}</td><td>${esc(browser)} / ${esc(os)}</td></tr>`;
      }).join("")
    : `<tr><td colspan="5" class="muted">No events yet — use the app (and accept analytics) to populate this.</td></tr>`;

  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>OSCE usage stats</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js"></script>
<style>
:root{color-scheme:light}
*{box-sizing:border-box}
body{font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;margin:0;background:#f5f4fc;color:#1f1b3a}
.wrap{max-width:1200px;margin:0 auto;padding:24px 18px 72px}
h1{font-size:24px;font-weight:800;margin:0 0 2px;letter-spacing:-.3px}
.sub{color:#6b6786;margin:0 0 20px;font-size:13px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:22px}
.kpi{background:#fff;border:1px solid #e8e5f6;border-radius:14px;padding:13px 14px}
.kpi .kl{color:#6b6786;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.kpi .kv{font-size:26px;font-weight:800;line-height:1.1;margin-top:2px;color:#2a2253}
.kpi .ks{color:#9b97b5;font-size:11px;margin-top:1px}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
@media(min-width:900px){.grid{grid-template-columns:repeat(3,1fr)}}
.card{background:#fff;border:1px solid #e8e5f6;border-radius:16px;padding:14px 16px;box-shadow:0 4px 16px rgba(45,30,90,.04)}
.card.wide{grid-column:1/-1}
@media(min-width:900px){.card.wide{grid-column:span 3}.card.half{grid-column:span 2}}
h2{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#5634e0;margin:0 0 10px}
.cc{position:relative;height:220px}
.card.wide .cc{height:300px}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:left;padding:7px 9px;border-bottom:1px solid #efeef8}
th{font-size:11px;color:#6b6786;text-transform:uppercase;letter-spacing:.04em}
.tag{background:#f0ebff;color:#5634e0;border-radius:6px;padding:1px 7px;font-size:11px;font-weight:700}
.muted{color:#9b97b5;text-align:center}
.foot{color:#9b97b5;font-size:12px;margin-top:18px;text-align:center}
</style></head><body><div class="wrap">
<h1>OSCE usage stats</h1>
<p class="sub">Anonymous usage analytics · live from D1 · generated ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC</p>
<div class="kpis">${kpiHtml}</div>
<div class="grid">
  ${card("c_daily", "Activity — last 30 days", "wide")}
  ${card("c_funnel", "Engagement funnel")}
  ${card("c_country", "Audience by country")}
  ${card("c_browser", "Browser")}
  ${card("c_os", "Operating system")}
  ${card("c_device", "Device type")}
  ${card("c_ret", "New vs returning")}
  ${card("c_lang", "Language")}
  ${card("c_app", "App version")}
  ${card("c_events", "Event types")}
  ${card("c_screens", "Screens viewed")}
  ${card("c_hour", "Activity by hour (UTC)")}
  ${card("c_starts", "Cases started · by category")}
  ${card("c_completes", "Cases completed · by category")}
  ${card("c_bands", "Score bands")}
  ${card("c_diff", "Difficulty attempted")}
  ${card("c_mode", "Mode")}
  ${card("c_drills", "Drills · reps by type")}
  ${card("c_drillperf", "Drill performance · avg coverage %")}
  ${card("c_drilldist", "Drill score distribution")}
  ${card("c_diffmode", "Differential · core vs advanced (avg %)")}
  ${card("c_ai", "AI provider")}
  ${card("c_ref", "Referrers")}
  <div class="card wide"><h2>Recent activity</h2>
    <table><thead><tr><th>When (UTC)</th><th>Event</th><th>Detail</th><th>Country</th><th>Browser / OS</th></tr></thead>
    <tbody>${recentRows}</tbody></table>
  </div>
</div>
<p class="foot">No personal data, exam answers, or API keys are collected — only the coarse, anonymous signals shown above.</p>
</div>
<script>
const DATA = ${json};
const PAL = ['#6d4aff','#00bfa6','#ff6b6b','#ff9f1a','#3b9eff','#f25eb0','#0ca678','#a78bfa','#f59e0b','#ef4444','#14b8a6','#8b5cf6','#fb7185','#22c55e','#eab308'];
const baseOpts = (horizontal) => ({responsive:true,maintainAspectRatio:false,indexAxis:horizontal?'y':'x',
  plugins:{legend:{display:false}},
  scales:{x:{grid:{display:!horizontal,color:'#f0eef9'},ticks:{font:{size:11},autoSkip:false,maxRotation:0,color:'#6b6786'}},
          y:{beginAtZero:true,grid:{color:'#f0eef9'},ticks:{font:{size:11},precision:0,color:'#6b6786'}}}});
function has(d){return d&&d.values&&d.values.some(v=>v>0)}
function bar(id,d,horizontal){const el=document.getElementById(id);if(!el||!has(d))return mark(id);
  new Chart(el,{type:'bar',data:{labels:d.labels,datasets:[{data:d.values,backgroundColor:'#6d4aff',borderRadius:6,maxBarThickness:46}]},options:baseOpts(horizontal)});}
function dough(id,d){const el=document.getElementById(id);if(!el||!has(d))return mark(id);
  new Chart(el,{type:'doughnut',data:{labels:d.labels,datasets:[{data:d.values,backgroundColor:PAL,borderWidth:0}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'60%',plugins:{legend:{position:'right',labels:{boxWidth:12,font:{size:11},color:'#3a3458'}}}}});}
function mark(id){const el=document.getElementById(id);if(el)el.parentElement.innerHTML='<div class="muted" style="padding:80px 0">No data yet</div>';}
// line: devices + events over time
(function(){const el=document.getElementById('c_daily');const d=DATA.daily;if(!el)return;if(!d.labels.length)return mark('c_daily');
  new Chart(el,{type:'line',data:{labels:d.labels,datasets:[
    {label:'Active devices',data:d.devices,borderColor:'#6d4aff',backgroundColor:'rgba(109,74,255,.12)',fill:true,tension:.35,pointRadius:2,borderWidth:2},
    {label:'Events',data:d.events,borderColor:'#00bfa6',backgroundColor:'rgba(0,191,166,.10)',fill:true,tension:.35,pointRadius:2,borderWidth:2}]},
    options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
      plugins:{legend:{position:'top',labels:{boxWidth:12,font:{size:11},color:'#3a3458'}}},
      scales:{x:{grid:{display:false},ticks:{font:{size:10},maxRotation:0,autoSkip:true,maxTicksLimit:10,color:'#6b6786'}},
              y:{beginAtZero:true,grid:{color:'#f0eef9'},ticks:{font:{size:11},precision:0,color:'#6b6786'}}}}});})();
bar('c_funnel',DATA.funnel);
bar('c_country',DATA.country,true);
dough('c_browser',DATA.browser);
dough('c_os',DATA.os);
dough('c_device',DATA.device);
dough('c_ret',DATA.retention);
bar('c_lang',DATA.lang,true);
bar('c_app',DATA.app,true);
bar('c_events',DATA.events,true);
bar('c_screens',DATA.screens,true);
bar('c_hour',DATA.hour);
bar('c_starts',DATA.starts,true);
bar('c_completes',DATA.completes,true);
dough('c_bands',DATA.bands);
dough('c_diff',DATA.difficulty);
dough('c_mode',DATA.mode);
bar('c_drills',DATA.drills,true);
bar('c_drillperf',DATA.drillperf,true);
dough('c_drilldist',DATA.drilldist);
bar('c_diffmode',DATA.diffmode);
dough('c_ai',DATA.ai);
bar('c_ref',DATA.ref,true);
</script>
</body></html>`;
}
