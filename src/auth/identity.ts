/**
 * Signed-in student identity — the only personal data the app holds locally.
 * Pure + storage-only (no network, no React) so it's trivially testable and
 * safe to import anywhere (telemetry, the gate, the Analytics screen). Every
 * function swallows storage errors and falls back, matching telemetry.ts.
 */

export interface Student {
  name: string;
  email: string;
  /** ISO timestamp of the affirmative consent given at sign-in. */
  consentAt: string;
  /** Identity schema version, for future migrations. */
  version: number;
}

export const STUDENT_KEY = "osce.user.v1";
export const IDENTITY_VERSION = 1;

/** Root domain accepted as "a Northwestern email" — the bare domain plus any
 *  subdomain (students are commonly `netid@u.northwestern.edu`). Single source
 *  of truth so the net can be tightened or widened in one place. */
export const NORTHWESTERN_ROOT = "northwestern.edu";

/** True for `name@northwestern.edu` and `name@<sub>.northwestern.edu`. */
export function isNorthwesternEmail(email: string): boolean {
  const e = String(email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return false;
  const domain = e.slice(e.indexOf("@") + 1);
  return domain === NORTHWESTERN_ROOT || domain.endsWith("." + NORTHWESTERN_ROOT);
}

export function validateEmail(email: string): { ok: boolean; reason?: string } {
  const e = String(email ?? "").trim();
  if (!e) return { ok: false, reason: "Enter your Northwestern email." };
  if (!isNorthwesternEmail(e)) return { ok: false, reason: "Use your @northwestern.edu email." };
  return { ok: true };
}

export function getCurrentStudent(): Student | null {
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<Student>;
    if (typeof s.name === "string" && s.name && typeof s.email === "string" && s.email) {
      return {
        name: s.name,
        email: s.email,
        consentAt: typeof s.consentAt === "string" ? s.consentAt : "",
        version: typeof s.version === "number" ? s.version : IDENTITY_VERSION,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function setStudent(student: Student): void {
  try {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
  } catch {
    /* storage unavailable — identity simply won't persist */
  }
}

export function signOut(): void {
  try {
    localStorage.removeItem(STUDENT_KEY);
  } catch {
    /* ignore */
  }
}

export function isSignedIn(): boolean {
  return getCurrentStudent() !== null;
}
