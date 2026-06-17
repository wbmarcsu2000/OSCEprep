/**
 * Privacy-respecting product analytics for app-usage monitoring.
 *
 * Design guarantees:
 *  - OFF unless an endpoint/provider is configured at BUILD time (env) AND the
 *    visitor has CONSENTED. With nothing configured, every call is a no-op and
 *    no banner is shown — shipping this changes nothing until you opt in.
 *  - Respects Do-Not-Track (treated as a decline).
 *  - Sends ONLY an allowlist of coarse usage events with an allowlist of prop
 *    keys, values type-checked and length-capped. It is structurally impossible
 *    to leak free text, exam answers, exact identity, or API keys through here.
 *  - "Who they are" is coarse + anonymous: a persistent random device id (so you
 *    can see returning users / retention) plus whatever the receiving endpoint
 *    derives from the request (country via IP, device/browser via user-agent).
 *    No name, email, or login.
 *
 * Configure via build-time env (see ANALYTICS.md):
 *   VITE_ANALYTICS_ENDPOINT  — POST events here (custom endpoint / Cloudflare Worker)
 *   VITE_PLAUSIBLE_DOMAIN    — use Plausible's events API instead
 */

type Provider = "endpoint" | "plausible" | "none";

const ENDPOINT = ((import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined) ?? "").trim();
const PLAUSIBLE_DOMAIN = ((import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined) ?? "").trim();
const PLAUSIBLE_API =
  ((import.meta.env.VITE_PLAUSIBLE_API as string | undefined) ?? "https://plausible.io/api/event").trim();
const APP_VERSION = ((import.meta.env.VITE_APP_VERSION as string | undefined) ?? "dev").trim();

const PROVIDER: Provider = ENDPOINT ? "endpoint" : PLAUSIBLE_DOMAIN ? "plausible" : "none";

const CONSENT_KEY = "osce.analytics.consent"; // "granted" | "denied"
const DEVICE_KEY = "osce.analytics.did"; // random, anonymous, persistent

/** Events we will ever emit. Anything not here is dropped. */
const ALLOWED_EVENTS = new Set([
  "app_open",
  "screen_view",
  "case_start",
  "case_complete",
  "drill",
  "ai_enabled",
]);

/** Prop keys we will ever send. Anything not here is dropped — this is the
 *  hard guarantee that no free text / answer / key can leak. */
const ALLOWED_PROPS = new Set(["screen", "category", "mode", "band", "difficulty", "drillType", "provider", "advanced"]);

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

function doNotTrack(): boolean {
  if (typeof navigator === "undefined") return false;
  const w = typeof window !== "undefined" ? (window as unknown as { doNotTrack?: string }) : undefined;
  const v =
    navigator.doNotTrack ??
    w?.doNotTrack ??
    (navigator as unknown as { msDoNotTrack?: string }).msDoNotTrack;
  return v === "1" || v === "yes";
}

export function analyticsConfigured(): boolean {
  return PROVIDER !== "none";
}

export function consentState(): "granted" | "denied" | "unset" {
  if (doNotTrack()) return "denied";
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "unset";
  }
}

/** Show the consent banner only when analytics is configured, DNT is off, and
 *  the visitor hasn't chosen yet. */
export function shouldAskConsent(): boolean {
  return analyticsConfigured() && consentState() === "unset";
}

export function setConsent(granted: boolean): void {
  try {
    localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {
    /* storage unavailable */
  }
  if (granted) track("app_open", {});
}

/** Usage tracking is REQUIRED while the AI is enabled — enabling AI is the user
 *  accepting it (made explicit in the Enable-AI panel). Grants consent without
 *  the app_open side effect, suppressing the opt-in banner. A Do-Not-Track
 *  browser still wins at read time (consentState stays "denied"), and it remains
 *  a no-op when no analytics endpoint is configured. */
export function requireConsentForAi(): void {
  try {
    localStorage.setItem(CONSENT_KEY, "granted");
  } catch {
    /* storage unavailable */
  }
}

// ---------------------------------------------------------------------------
// Identity (anonymous) + session
// ---------------------------------------------------------------------------

function randomId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `d-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  }
}

function deviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return "no-storage";
  }
}

const SESSION_ID = randomId(); // ephemeral, per page load

// ---------------------------------------------------------------------------
// Sanitization (the privacy backstop)
// ---------------------------------------------------------------------------

/** Keep only allowlisted keys with primitive, length-capped values. Exported
 *  for tests — this is the guarantee that no unexpected data ever leaves. */
export function sanitizeEventProps(props: Record<string, unknown>): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(props)) {
    if (!ALLOWED_PROPS.has(k)) continue;
    if (typeof v === "string") out[k] = v.slice(0, 64);
    else if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    else if (typeof v === "boolean") out[k] = v;
  }
  return out;
}

export function isEventAllowed(event: string): boolean {
  return ALLOWED_EVENTS.has(event);
}

// ---------------------------------------------------------------------------
// Send
// ---------------------------------------------------------------------------

function referrerHost(): string {
  try {
    return document.referrer ? new URL(document.referrer).host : "direct";
  } catch {
    return "direct";
  }
}

function sendEndpoint(event: string, props: Record<string, string | number | boolean>): void {
  try {
    const body = JSON.stringify({
      event,
      props,
      deviceId: deviceId(),
      sessionId: SESSION_ID,
      ts: Date.now(),
      ref: referrerHost(),
      lang: navigator.language?.slice(0, 5) ?? "",
      vw: window.innerWidth,
      vh: window.innerHeight,
      app: APP_VERSION,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
    } else {
      void fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
        mode: "no-cors",
      }).catch(() => {});
    }
  } catch {
    /* analytics must never break the app */
  }
}

/** Route URL with any query string dropped — keeps the per-view path for
 *  Plausible's page report without coupling the payload to future URL params. */
function safeUrl(): string {
  try {
    return location.origin + location.pathname + location.hash.split("?")[0];
  } catch {
    return location.href;
  }
}

function sendPlausible(event: string, props: Record<string, string | number | boolean>): void {
  try {
    const body = JSON.stringify({ name: event, url: safeUrl(), domain: PLAUSIBLE_DOMAIN, props });
    void fetch(PLAUSIBLE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

/**
 * Record one usage event. No-op unless configured AND consented; silently drops
 * unknown event names and non-allowlisted props. Never throws.
 */
export function track(event: string, props: Record<string, unknown> = {}): void {
  try {
    if (PROVIDER === "none") return;
    if (!ALLOWED_EVENTS.has(event)) return;
    if (consentState() !== "granted") return;
    const clean = sanitizeEventProps(props);
    if (PROVIDER === "endpoint") sendEndpoint(event, clean);
    else if (PROVIDER === "plausible") sendPlausible(event, clean);
  } catch {
    /* never break the app for analytics */
  }
}

/** Called once on app mount: emits app_open for already-consented returning
 *  visitors (new visitors emit it when they accept the banner). */
export function initTelemetry(): void {
  if (consentState() === "granted") track("app_open", {});
}
