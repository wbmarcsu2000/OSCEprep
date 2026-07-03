/**
 * Pure auth helpers for the OSCE Worker — no D1, no Cloudflare globals — so they
 * unit-test cleanly under vitest. The Worker's fetch handler imports these and
 * does the D1 writes around them.
 */

export const NORTHWESTERN_ROOT = "northwestern.edu";

/** True for `name@northwestern.edu` and `name@<sub>.northwestern.edu`. */
export function isNorthwesternEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return false;
  const domain = e.slice(e.indexOf("@") + 1);
  return domain === NORTHWESTERN_ROOT || domain.endsWith("." + NORTHWESTERN_ROOT);
}

/**
 * Decide a sign-in attempt. Returns { ok, status, error }.
 * Consent is a HARD precondition: without consent===true there is no
 * registration, regardless of the password (checked before anything else).
 */
export function evaluateAuth(body, expectedPassword) {
  const b = body || {};
  if (b.consent !== true) return { ok: false, status: 403, error: "consent_required" };
  if (!expectedPassword || b.password !== expectedPassword) {
    return { ok: false, status: 401, error: "bad_password" };
  }
  if (typeof b.name !== "string" || !b.name.trim()) {
    return { ok: false, status: 400, error: "bad_name" };
  }
  if (!isNorthwesternEmail(b.email)) return { ok: false, status: 400, error: "bad_email" };
  return { ok: true, status: 200 };
}
