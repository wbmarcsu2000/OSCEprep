# Student Sign-In & Identity-Attributed Analytics — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a mandatory sign-in gate (name + Northwestern email + class password + required consent) that de-anonymizes the existing usage analytics — stamping each student's identity onto the events already sent to the Cloudflare Worker/D1 dashboard, with an expanded per-student `/stats` view.

**Architecture:** A pure identity module (`localStorage` key `osce.user.v1`) + a thin auth network client → a `LoginGate` rendered in place of the app (modeled on the existing `ConsentGate`). Telemetry stamps `student_email`/`student_name` onto events and treats a signed-in student as consented (overriding DNT). The Worker gains a `POST /auth` endpoint that checks the password against a Cloudflare secret, enforces consent server-side, and registers the student in a new `students` table; ingest gains two nullable columns; `/stats` gains a per-student section.

**Tech Stack:** Vite + React 19 + TypeScript (strict) + Tailwind v4 + Zustand; Vitest + @testing-library/react (jsdom); Cloudflare Worker + D1 (`analytics-worker`, plain ESM JS); `npm test` = `vitest run`, `npm run build` = `tsc -b && vite build`.

**Reference spec:** `docs/superpowers/specs/2026-06-30-student-signin-design.md`

**Conventions for every task:** all new files use the existing code's comment density and idiom. Storage/identity code never throws (try/catch → safe fallback), matching `telemetry.ts`. Run commands from the repo root `~/osce-simulator` unless noted.

---

## File Structure

**New (frontend):**
- `src/auth/identity.ts` — pure identity model + storage + email validation (no React, no network).
- `src/auth/authClient.ts` — the `/auth` network call + status→error mapping.
- `src/ui/components/LoginGate.tsx` — the sign-in screen.
- `src/auth/__tests__/identity.test.ts`, `src/auth/__tests__/authClient.test.ts`, `src/ui/__tests__/loginGate.test.tsx`.

**Modified (frontend):**
- `src/analytics/telemetry.ts` — stamp identity onto events; `effectiveConsent()` (signed-in ⇒ granted, overrides DNT); `analyticsEndpointConfigured()`; `initTelemetry` uses `effectiveConsent`.
- `src/analytics/__tests__/telemetry.test.ts` — add identity-stamping + override tests.
- `src/App.tsx` — replace the `ConsentGate` gate with the `LoginGate` gate.
- `src/ui/screens/Analytics.tsx` — "Account" card with Sign out.
- `src/ui/components/ConsentGate.tsx` — **deleted** (its consent role moves into `LoginGate`).

**New (backend):**
- `analytics-worker/auth.js` — pure auth helpers (email check + `evaluateAuth`).
- `analytics-worker/__tests__/auth.test.js` — unit tests for the above.
- `analytics-worker/migrations/002_student_identity.sql` — live-DB migration.

**Modified (backend):**
- `analytics-worker/worker.js` — `POST /auth` + consent enforcement + student registry; `student_email`/`student_name` on ingest; per-student `/stats` section.
- `analytics-worker/schema.sql` — fresh-DB columns + `students` table.
- `analytics-worker/wrangler.toml` — setup-comment updates (`CLASS_PASSWORD`, migration 002).

---

## Task 1: Identity module (pure)

**Files:**
- Create: `src/auth/identity.ts`
- Test: `src/auth/__tests__/identity.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/auth/__tests__/identity.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  isNorthwesternEmail,
  validateEmail,
  getCurrentStudent,
  setStudent,
  signOut,
  isSignedIn,
  STUDENT_KEY,
  IDENTITY_VERSION,
} from "../identity";

describe("isNorthwesternEmail", () => {
  it("accepts northwestern.edu and any subdomain, case-insensitively", () => {
    expect(isNorthwesternEmail("jane@northwestern.edu")).toBe(true);
    expect(isNorthwesternEmail("jane.doe@u.northwestern.edu")).toBe(true);
    expect(isNorthwesternEmail("JANE@U.NORTHWESTERN.EDU")).toBe(true);
  });
  it("rejects other domains and malformed input", () => {
    expect(isNorthwesternEmail("jane@gmail.com")).toBe(false);
    expect(isNorthwesternEmail("jane@notnorthwestern.edu")).toBe(false);
    expect(isNorthwesternEmail("jane@northwestern.edu.evil.com")).toBe(false);
    expect(isNorthwesternEmail("jane")).toBe(false);
    expect(isNorthwesternEmail("")).toBe(false);
  });
});

describe("validateEmail", () => {
  it("ok for a northwestern address, reason otherwise", () => {
    expect(validateEmail("jane@northwestern.edu").ok).toBe(true);
    expect(validateEmail("").ok).toBe(false);
    expect(validateEmail("jane@gmail.com")).toEqual({
      ok: false,
      reason: "Use your @northwestern.edu email.",
    });
  });
});

describe("identity storage", () => {
  beforeEach(() => localStorage.clear());
  it("round-trips a student", () => {
    expect(getCurrentStudent()).toBeNull();
    expect(isSignedIn()).toBe(false);
    setStudent({
      name: "Jane Doe",
      email: "jane@u.northwestern.edu",
      consentAt: "2026-06-30T00:00:00.000Z",
      version: IDENTITY_VERSION,
    });
    expect(isSignedIn()).toBe(true);
    expect(getCurrentStudent()).toMatchObject({
      name: "Jane Doe",
      email: "jane@u.northwestern.edu",
    });
  });
  it("signOut clears identity", () => {
    setStudent({ name: "Jane", email: "jane@northwestern.edu", consentAt: "", version: 1 });
    signOut();
    expect(getCurrentStudent()).toBeNull();
  });
  it("returns null on corrupt storage", () => {
    localStorage.setItem(STUDENT_KEY, "{not json");
    expect(getCurrentStudent()).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/auth/__tests__/identity.test.ts`
Expected: FAIL — `Failed to resolve import "../identity"`.

- [ ] **Step 3: Write the implementation**

Create `src/auth/identity.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/auth/__tests__/identity.test.ts`
Expected: PASS (all cases green).

- [ ] **Step 5: Commit**

```bash
git add src/auth/identity.ts src/auth/__tests__/identity.test.ts
git commit -m "feat(auth): pure student identity module + email validation"
```

---

## Task 2: Auth network client

**Files:**
- Create: `src/auth/authClient.ts`
- Test: `src/auth/__tests__/authClient.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/auth/__tests__/authClient.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from "vitest";
import { signIn } from "../authClient";

const INPUT = { name: "Jane", email: "jane@northwestern.edu", password: "pw", consent: true };

afterEach(() => vi.restoreAllMocks());

function fetchReturning(status: number) {
  return vi.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status } as Response);
}

describe("signIn status mapping", () => {
  it("maps a 2xx response to ok", async () => {
    vi.stubGlobal("fetch", fetchReturning(204));
    expect(await signIn(INPUT, "https://w.example")).toEqual({ ok: true });
  });
  it("maps 401 to bad_password", async () => {
    vi.stubGlobal("fetch", fetchReturning(401));
    expect(await signIn(INPUT, "https://w.example")).toEqual({ ok: false, error: "bad_password" });
  });
  it("maps 400 to bad_email", async () => {
    vi.stubGlobal("fetch", fetchReturning(400));
    expect(await signIn(INPUT, "https://w.example")).toEqual({ ok: false, error: "bad_email" });
  });
  it("maps 403 to consent_required", async () => {
    vi.stubGlobal("fetch", fetchReturning(403));
    expect(await signIn(INPUT, "https://w.example")).toEqual({ ok: false, error: "consent_required" });
  });
  it("maps a thrown fetch to network", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));
    expect(await signIn(INPUT, "https://w.example")).toEqual({ ok: false, error: "network" });
  });
  it("returns unconfigured when no endpoint is given", async () => {
    expect(await signIn(INPUT, "")).toEqual({ ok: false, error: "unconfigured" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/auth/__tests__/authClient.test.ts`
Expected: FAIL — `Failed to resolve import "../authClient"`.

- [ ] **Step 3: Write the implementation**

Create `src/auth/authClient.ts`:

```ts
/**
 * Sign-in call to the analytics Worker's POST /auth endpoint. Kept separate from
 * the pure identity module so the gate can be tested with this mocked, and so
 * the endpoint can be injected in tests. Sends a text/plain body (a CORS-safe
 * "simple" request → no preflight); the Worker parses JSON regardless of the
 * declared content-type.
 */

const ENDPOINT = ((import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined) ?? "")
  .trim()
  .replace(/\/+$/, "");

export type SignInResult =
  | { ok: true }
  | { ok: false; error: "bad_password" | "bad_email" | "consent_required" | "network" | "unconfigured" };

export interface SignInInput {
  name: string;
  email: string;
  password: string;
  consent: boolean;
}

/** True when an analytics Worker URL is configured at build time. */
export function authEndpointConfigured(): boolean {
  return ENDPOINT.length > 0;
}

export async function signIn(input: SignInInput, endpoint: string = ENDPOINT): Promise<SignInResult> {
  const base = endpoint.trim().replace(/\/+$/, "");
  if (!base) return { ok: false, error: "unconfigured" };
  let res: Response;
  try {
    res = await fetch(`${base}/auth`, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        consent: input.consent === true,
      }),
    });
  } catch {
    return { ok: false, error: "network" };
  }
  if (res.ok) return { ok: true };
  if (res.status === 401) return { ok: false, error: "bad_password" };
  if (res.status === 400) return { ok: false, error: "bad_email" };
  if (res.status === 403) return { ok: false, error: "consent_required" };
  return { ok: false, error: "network" };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/auth/__tests__/authClient.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/auth/authClient.ts src/auth/__tests__/authClient.test.ts
git commit -m "feat(auth): /auth network client with status→error mapping"
```

---

## Task 3: Telemetry — stamp identity + treat sign-in as consent (override DNT)

**Files:**
- Modify: `src/analytics/telemetry.ts`
- Test: `src/analytics/__tests__/telemetry.test.ts`

- [ ] **Step 1: Write the failing test (append to the existing file)**

Add to the top imports of `src/analytics/__tests__/telemetry.test.ts` (extend the existing import from `../telemetry`):

```ts
import { studentIdentityProps, effectiveConsent } from "../telemetry";
import { setStudent, signOut } from "../../auth/identity";
```

Append these `describe` blocks at the end of the file:

```ts
describe("telemetry identity stamping", () => {
  beforeEach(() => localStorage.clear());

  it("omits identity props when not signed in", () => {
    expect(studentIdentityProps()).toEqual({});
  });

  it("includes student email + name when signed in", () => {
    setStudent({ name: "Jane Doe", email: "jane@u.northwestern.edu", consentAt: "", version: 1 });
    expect(studentIdentityProps()).toEqual({
      student_email: "jane@u.northwestern.edu",
      student_name: "Jane Doe",
    });
  });

  it("treats a signed-in student as consented (overrides DNT/unset)", () => {
    expect(effectiveConsent()).toBe("unset");
    setStudent({ name: "Jane", email: "jane@northwestern.edu", consentAt: "", version: 1 });
    expect(effectiveConsent()).toBe("granted");
    signOut();
    expect(effectiveConsent()).toBe("unset");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/analytics/__tests__/telemetry.test.ts`
Expected: FAIL — `studentIdentityProps`/`effectiveConsent` are not exported.

- [ ] **Step 3: Implement in `src/analytics/telemetry.ts`**

3a. Add the import near the top (after the file's doc comment / existing constants, e.g. just below the `APP_VERSION` line at ~28):

```ts
import { getCurrentStudent } from "../auth/identity";
```

3b. Add these exports in the "Consent" section, right after `consentState()` (after line ~75):

```ts
/** Coarse identity attached to every event once a student has signed in. Empty
 *  when anonymous. The two fields are the only PII this app ever transmits. */
export function studentIdentityProps(): Record<string, string> {
  const s = getCurrentStudent();
  return s ? { student_email: s.email, student_name: s.name } : {};
}

/** Consent that actually governs sending. Signing in is an explicit, mandatory,
 *  informed opt-in (the gate's required checkbox), so a signed-in student counts
 *  as "granted" even if the browser sends Do-Not-Track — otherwise a DNT student
 *  could pass the gate yet emit nothing. Anonymous visitors fall back to the
 *  stored/DNT-derived consent state. */
export function effectiveConsent(): "granted" | "denied" | "unset" {
  if (getCurrentStudent()) return "granted";
  return consentState();
}

/** True when events POST to a configured Worker endpoint (drives the sign-in
 *  gate; the gate needs the Worker's /auth route). */
export function analyticsEndpointConfigured(): boolean {
  return PROVIDER === "endpoint";
}
```

3c. In `sendEndpoint()` (~182), add the identity fields to the JSON body. Change the object passed to `JSON.stringify` so it spreads identity at the top level:

```ts
    const body = JSON.stringify({
      event,
      props,
      ...studentIdentityProps(),
      deviceId: deviceId(),
      sessionId: SESSION_ID,
      ts: Date.now(),
      ref: referrerHost(),
      lang: navigator.language?.slice(0, 5) ?? "",
      vw: window.innerWidth,
      vh: window.innerHeight,
      app: APP_VERSION,
    });
```

3d. In `track()` (~244), change the consent gate to use `effectiveConsent()`:

```ts
    if (effectiveConsent() !== "granted") return;
```

(Replaces the existing `if (consentState() !== "granted") return;`.)

3e. In `initTelemetry()` (~259), change the gate so signed-in students emit `app_open` on mount regardless of DNT:

```ts
export function initTelemetry(): void {
  if (effectiveConsent() === "granted") track("app_open", {});
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/analytics/__tests__/telemetry.test.ts`
Expected: PASS (new blocks green; existing privacy/consent tests still green).

- [ ] **Step 5: Commit**

```bash
git add src/analytics/telemetry.ts src/analytics/__tests__/telemetry.test.ts
git commit -m "feat(analytics): stamp student identity on events; sign-in overrides DNT"
```

---

## Task 4: LoginGate component

**Files:**
- Create: `src/ui/components/LoginGate.tsx`
- Test: `src/ui/__tests__/loginGate.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/ui/__tests__/loginGate.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginGate } from "../components/LoginGate";
import { signIn } from "../../auth/authClient";
import { getCurrentStudent } from "../../auth/identity";

vi.mock("../../auth/authClient", () => ({ signIn: vi.fn() }));
const mockSignIn = vi.mocked(signIn);

function fill(name: string, email: string, password: string) {
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/northwestern email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/class password/i), { target: { value: password } });
}

describe("LoginGate", () => {
  beforeEach(() => {
    localStorage.clear();
    mockSignIn.mockReset();
  });

  it("disables Continue until name + valid email + password + consent are all present", () => {
    render(<LoginGate onSignedIn={() => {}} />);
    const btn = screen.getByRole("button", { name: /continue/i });
    expect(btn).toBeDisabled();

    fill("Jane Doe", "jane@gmail.com", "pw"); // wrong domain
    expect(btn).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/northwestern email/i), {
      target: { value: "jane@u.northwestern.edu" },
    });
    expect(btn).toBeDisabled(); // consent still unchecked

    fireEvent.click(screen.getByLabelText(/I understand and agree/i));
    expect(btn).toBeEnabled();
  });

  it("does NOT call /auth when consent is unchecked", () => {
    render(<LoginGate onSignedIn={() => {}} />);
    fill("Jane Doe", "jane@u.northwestern.edu", "pw");
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("on success stores identity and calls onSignedIn", async () => {
    mockSignIn.mockResolvedValue({ ok: true });
    const onSignedIn = vi.fn();
    render(<LoginGate onSignedIn={onSignedIn} />);
    fill("Jane Doe", "jane@u.northwestern.edu", "pw");
    fireEvent.click(screen.getByLabelText(/I understand and agree/i));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() => expect(onSignedIn).toHaveBeenCalled());
    expect(getCurrentStudent()).toMatchObject({
      name: "Jane Doe",
      email: "jane@u.northwestern.edu",
    });
  });

  it("shows an inline error on a bad password and does not sign in", async () => {
    mockSignIn.mockResolvedValue({ ok: false, error: "bad_password" });
    const onSignedIn = vi.fn();
    render(<LoginGate onSignedIn={onSignedIn} />);
    fill("Jane Doe", "jane@u.northwestern.edu", "wrong");
    fireEvent.click(screen.getByLabelText(/I understand and agree/i));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(await screen.findByText(/incorrect class password/i)).toBeInTheDocument();
    expect(onSignedIn).not.toHaveBeenCalled();
    expect(getCurrentStudent()).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/ui/__tests__/loginGate.test.tsx`
Expected: FAIL — `Failed to resolve import "../components/LoginGate"`.

- [ ] **Step 3: Write the implementation**

Create `src/ui/components/LoginGate.tsx`:

```tsx
import { useState, type FormEvent } from "react";
import { setConsent } from "../../analytics/telemetry";
import { validateEmail, setStudent, IDENTITY_VERSION } from "../../auth/identity";
import { signIn } from "../../auth/authClient";

/**
 * Mandatory sign-in gate. Rendered IN PLACE OF the app (not a dismissible
 * overlay), so nothing behind it is reachable until a student signs in. They
 * provide name + Northwestern email + the shared class password AND must
 * affirmatively consent to data collection — there is no anonymous or decline
 * path. Consent is a hard precondition: with the box unchecked, Continue is
 * disabled and /auth is never called.
 */
export function LoginGate({ onSignedIn }: { onSignedIn: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsentChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailOk = validateEmail(email).ok;
  const canSubmit =
    name.trim().length > 0 && emailOk && password.trim().length > 0 && consent && !busy;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    const res = await signIn({ name, email, password, consent });
    if (res.ok) {
      setStudent({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        consentAt: new Date().toISOString(),
        version: IDENTITY_VERSION,
      });
      setConsent(true);
      onSignedIn();
      return;
    }
    setBusy(false);
    setError(
      res.error === "bad_password"
        ? "Incorrect class password."
        : res.error === "bad_email"
        ? "Use your @northwestern.edu email."
        : res.error === "consent_required"
        ? "You must agree to data collection to continue."
        : "Can't reach the sign-in server. Check your connection and try again.",
    );
  };

  const inputCls =
    "w-full rounded-xl border px-3 py-2 text-[14px] outline-none focus:ring-2";
  const inputStyle = {
    borderColor: "var(--color-exam-border)",
    background: "#fff",
    color: "var(--color-exam-ink)",
  } as const;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to continue"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "var(--grad-header)" }}
    >
      <form onSubmit={submit} className="card max-w-lg w-full p-6 space-y-4 pop-in">
        <div className="flex items-center gap-3">
          <span className="icon-tile" style={{ background: "var(--grad-teal)" }} aria-hidden>
            🔑
          </span>
          <div>
            <div className="panel-label">Northwestern · class access</div>
            <h2
              className="text-[22px] font-extrabold tracking-tight"
              style={{ color: "var(--color-exam-header)" }}
            >
              Sign in to continue
            </h2>
          </div>
        </div>

        <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--color-exam-ink)" }}>
          This tool is for your class. Sign in with your name and Northwestern email and enter the
          class password your instructor shared.
        </p>

        <div className="space-y-3">
          <label className="block">
            <span className="panel-label mb-1 block">Full name</span>
            <input
              className={inputCls}
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              autoFocus
            />
          </label>
          <label className="block">
            <span className="panel-label mb-1 block">Northwestern email</span>
            <input
              className={inputCls}
              style={inputStyle}
              type="email"
              inputMode="email"
              placeholder="netid@u.northwestern.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {email.length > 0 && !emailOk && (
              <span className="hint mt-1 block" style={{ color: "var(--color-exam-danger)" }}>
                Use your @northwestern.edu email.
              </span>
            )}
          </label>
          <label className="block">
            <span className="panel-label mb-1 block">Class password</span>
            <input
              className={inputCls}
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          </label>
        </div>

        <label
          className="flex items-start gap-2.5 rounded-xl p-3 cursor-pointer"
          style={{ background: "var(--color-exam-accent-soft)" }}
        >
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0"
            checked={consent}
            onChange={(e) => setConsentChecked(e.target.checked)}
          />
          <span className="text-[12.5px] leading-relaxed" style={{ color: "var(--color-exam-ink)" }}>
            I understand and agree that my name, email, and how I use this tool are collected and
            visible to the course instructor. Agreeing is required to use the tool.
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="text-[12.5px] font-bold"
            style={{ color: "var(--color-exam-danger)" }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full py-2.5 text-[14px]"
          disabled={!canSubmit}
        >
          {busy ? "Signing in…" : "Continue"}
        </button>

        <p className="hint text-center">
          For medical education and OSCE practice only · fictional cases, no patient data.
        </p>
      </form>
    </div>
  );
}
```

> Note: the test matches the consent checkbox by its label text via `getByLabelText(/I understand and agree/i)` — the `<label>` wraps both the checkbox and the text, so this resolves to the checkbox. Keep the phrase "I understand and agree" in the label.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/ui/__tests__/loginGate.test.tsx`
Expected: PASS (4 cases green).

- [ ] **Step 5: Commit**

```bash
git add src/ui/components/LoginGate.tsx src/ui/__tests__/loginGate.test.tsx
git commit -m "feat(ui): LoginGate sign-in screen (name + email + password + required consent)"
```

---

## Task 5: Wire LoginGate into App; remove ConsentGate

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/ui/components/ConsentGate.tsx`

- [ ] **Step 1: Swap the imports in `src/App.tsx`**

Change the analytics/gate imports (lines ~19–20) from:

```ts
import { initTelemetry, consentGateRequired } from "./analytics/telemetry";
import { ConsentGate } from "./ui/components/ConsentGate";
```

to:

```ts
import { initTelemetry, analyticsEndpointConfigured } from "./analytics/telemetry";
import { LoginGate } from "./ui/components/LoginGate";
import { isSignedIn } from "./auth/identity";
```

- [ ] **Step 2: Swap the gate state initializer (line ~140)**

Change:

```ts
  // Hard gate: accepting analytics is required to use the app (no-op when
  // analytics isn't configured or the browser sends Do-Not-Track).
  const [gatePassed, setGatePassed] = useState(() => !consentGateRequired());
```

to:

```ts
  // Hard gate: signing in is required to use the app whenever an analytics
  // Worker is configured. With no endpoint (local dev / tests) the gate is
  // bypassed so the app is usable without a server.
  const [signedIn, setSignedIn] = useState(() => !analyticsEndpointConfigured() || isSignedIn());
```

- [ ] **Step 3: Swap the gate render (lines ~192–195)**

Change:

```ts
  // Must accept analytics before anything else is reachable.
  if (!gatePassed) {
    return <ConsentGate onAccept={() => setGatePassed(true)} />;
  }
```

to:

```ts
  // Must sign in before anything else is reachable.
  if (!signedIn) {
    return <LoginGate onSignedIn={() => setSignedIn(true)} />;
  }
```

- [ ] **Step 4: Delete the now-unused ConsentGate**

```bash
git rm src/ui/components/ConsentGate.tsx
```

- [ ] **Step 5: Verify the full suite + typecheck still pass**

Run: `npx vitest run`
Expected: PASS — all existing tests plus the new ones (no test renders `<App>`, and the gate is inert without an endpoint, so nothing breaks).

Run: `npx tsc -b`
Expected: no errors (confirms no dangling `ConsentGate`/`consentGateRequired` references).

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx
git commit -m "feat(app): gate the app behind LoginGate; remove ConsentGate"
```

---

## Task 6: Account / Sign-out control in Analytics

**Files:**
- Modify: `src/ui/screens/Analytics.tsx`
- Test: `src/ui/__tests__/account.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/ui/__tests__/account.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccountSection } from "../screens/Analytics";
import { setStudent } from "../../auth/identity";

describe("AccountSection", () => {
  beforeEach(() => localStorage.clear());

  it("renders nothing when not signed in", () => {
    const { container } = render(<AccountSection />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the signed-in student's name and email", () => {
    setStudent({ name: "Jane Doe", email: "jane@u.northwestern.edu", consentAt: "", version: 1 });
    render(<AccountSection />);
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(/jane@u\.northwestern\.edu/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/ui/__tests__/account.test.tsx`
Expected: FAIL — `AccountSection` is not exported from `../screens/Analytics`.

- [ ] **Step 3: Implement in `src/ui/screens/Analytics.tsx`**

3a. Add the identity import near the top of the file (with the other imports):

```ts
import { getCurrentStudent, signOut } from "../../auth/identity";
```

3b. Add the exported component just above `function DataManagement()` (~line 95):

```tsx
/** Who you're signed in as + a sign-out control. Exported for tests. Renders
 *  nothing when the visitor isn't signed in (e.g. local dev with no endpoint). */
export function AccountSection() {
  const student = getCurrentStudent();
  if (!student) return null;
  return (
    <div className="card p-4">
      <div className="panel-label mb-2">Account</div>
      <p className="hint mb-3">
        Signed in as <span className="font-bold">{student.name}</span> ({student.email}). Your usage
        is shared with the course instructor. Signing out returns you to the sign-in screen on this
        device; it does not remove data already collected.
      </p>
      <button
        className="btn"
        onClick={() => {
          signOut();
          location.reload();
        }}
      >
        Sign out
      </button>
    </div>
  );
}
```

3c. Render it in the `Analytics()` screen, immediately before `<DataManagement />` (~line 439):

```tsx
      <AccountSection />
      <DataManagement />
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/ui/__tests__/account.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ui/screens/Analytics.tsx src/ui/__tests__/account.test.tsx
git commit -m "feat(ui): Account card with sign-out on the Analytics screen"
```

---

## Task 7: Worker auth helpers (pure) + tests

**Files:**
- Create: `analytics-worker/auth.js`
- Test: `analytics-worker/__tests__/auth.test.js`

- [ ] **Step 1: Write the failing test**

Create `analytics-worker/__tests__/auth.test.js`:

```js
import { describe, it, expect } from "vitest";
import { isNorthwesternEmail, evaluateAuth } from "../auth.js";

describe("isNorthwesternEmail (worker)", () => {
  it("accepts the root domain and subdomains", () => {
    expect(isNorthwesternEmail("a@northwestern.edu")).toBe(true);
    expect(isNorthwesternEmail("a@u.northwestern.edu")).toBe(true);
    expect(isNorthwesternEmail("A@U.NORTHWESTERN.EDU")).toBe(true);
  });
  it("rejects other domains and look-alikes", () => {
    expect(isNorthwesternEmail("a@gmail.com")).toBe(false);
    expect(isNorthwesternEmail("a@notnorthwestern.edu")).toBe(false);
    expect(isNorthwesternEmail("a@northwestern.edu.attacker.com")).toBe(false);
    expect(isNorthwesternEmail("a")).toBe(false);
  });
});

describe("evaluateAuth", () => {
  const good = { name: "Jane", email: "jane@u.northwestern.edu", password: "secret", consent: true };

  it("requires consent FIRST — 403 even with the right password", () => {
    expect(evaluateAuth({ ...good, consent: false }, "secret")).toMatchObject({
      ok: false,
      status: 403,
      error: "consent_required",
    });
  });
  it("rejects a wrong password with 401", () => {
    expect(evaluateAuth({ ...good, password: "nope" }, "secret")).toMatchObject({
      ok: false,
      status: 401,
      error: "bad_password",
    });
  });
  it("rejects an empty configured password with 401 (never allows blank)", () => {
    expect(evaluateAuth({ ...good, password: "" }, "")).toMatchObject({ ok: false, status: 401 });
  });
  it("rejects a non-northwestern email with 400", () => {
    expect(evaluateAuth({ ...good, email: "jane@gmail.com" }, "secret")).toMatchObject({
      ok: false,
      status: 400,
      error: "bad_email",
    });
  });
  it("accepts a valid, consented attempt", () => {
    expect(evaluateAuth(good, "secret")).toEqual({ ok: true, status: 200 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run analytics-worker/__tests__/auth.test.js`
Expected: FAIL — `Failed to resolve import "../auth.js"`.

> If vitest reports "No test files found", the worker dir is outside the default include. Fix by creating `analytics-worker/vitest.config.js` with `export default { test: { include: ["**/*.test.js"] } }` is NOT needed — the repo's root `vite.config.ts` globs the whole repo. Re-run with the explicit path above; it will pick the file up once `auth.js` exists.

- [ ] **Step 3: Write the implementation**

Create `analytics-worker/auth.js`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run analytics-worker/__tests__/auth.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add analytics-worker/auth.js analytics-worker/__tests__/auth.test.js
git commit -m "feat(worker): pure auth helpers — northwestern email check + evaluateAuth"
```

---

## Task 8: Worker — POST /auth, consent enforcement, student registry, identity on ingest

**Files:**
- Modify: `analytics-worker/worker.js`

This task is verified by the unit tests in Task 7 (the pure decision logic) and the manual D1/curl checks in Task 12. No new automated test here (the D1 writes need the Cloudflare runtime).

- [ ] **Step 1: Import the helpers + widen CORS + add a JSON responder**

At the top of `analytics-worker/worker.js`, after the doc comment, add the import:

```js
import { evaluateAuth } from "./auth.js";
```

Replace the `CORS` block (lines ~11–15) with one that also allows the `/auth` response to be read cross-origin (methods unchanged — `/auth` is a POST):

```js
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
```

- [ ] **Step 2: Add the `/auth` route at the start of the POST handling**

Inside `async fetch(request, env)`, immediately after the `OPTIONS` early-return (line ~32) and BEFORE the existing `if (request.method === "POST")` ingest block, add:

```js
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
```

(The existing `clip` helper is defined at module scope, so it's in scope here.)

- [ ] **Step 3: Read student identity from the event + add a fully-migrated insert tier**

In the ingest block, after `const p = e.props || {};` and the `country`/`ua`/`pct`/`advanced` lines (~line 52), add:

```js
      const sEmail = clip(e.student_email, 160);
      const sName = clip(e.student_name, 120);
```

Then replace the existing two-tier insert (`try { …pct,advanced… } catch { …legacy… }`, lines ~75–98) with this three-tier version:

```js
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
```

- [ ] **Step 4: Sanity-check the bind arity**

`base` has 9 values; `tail` has 8 values.
- Tier 1: 9 + `pct` + `advanced` + 8 + `sEmail` + `sName` = 21 placeholders ✓
- Tier 2: 9 + `pct` + `advanced` + 8 = 19 placeholders ✓
- Tier 3: 9 + 8 = 17 placeholders ✓

Count the `?` in each VALUES list and confirm they match (21 / 19 / 17).

- [ ] **Step 5: Commit**

```bash
git add analytics-worker/worker.js
git commit -m "feat(worker): POST /auth (consent-gated registration) + identity on event ingest"
```

---

## Task 9: Worker schema + live-DB migration

**Files:**
- Modify: `analytics-worker/schema.sql`
- Create: `analytics-worker/migrations/002_student_identity.sql`

- [ ] **Step 1: Add columns + table to the fresh-DB schema**

In `analytics-worker/schema.sql`, add two columns to the `events` table (insert after the `app TEXT` line, before the closing `);`):

```sql
  app        TEXT,
  student_email TEXT,                 -- named sign-in (NULL for anonymous/pre-sign-in events)
  student_name  TEXT
);
```

Then, after the existing `CREATE INDEX` lines, append the registry table + index:

```sql
-- Registered students (one row per Northwestern email that has signed in).
CREATE TABLE IF NOT EXISTS students (
  email      TEXT PRIMARY KEY,
  name       TEXT,
  first_seen INTEGER,
  last_seen  INTEGER,
  consent_at INTEGER,                 -- when they affirmatively consented
  device     TEXT,
  country    TEXT,
  ua         TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_student ON events(student_email, received);
```

- [ ] **Step 2: Create the migration for the EXISTING live DB**

Create `analytics-worker/migrations/002_student_identity.sql`:

```sql
-- Migration: add student-identity columns + the students registry to an
-- EXISTING osce-analytics DB. (Fresh installs get these from schema.sql.)
-- Run once against the remote D1:
--   wrangler d1 execute osce-analytics --remote --file=./migrations/002_student_identity.sql
ALTER TABLE events ADD COLUMN student_email TEXT;
ALTER TABLE events ADD COLUMN student_name TEXT;

CREATE TABLE IF NOT EXISTS students (
  email      TEXT PRIMARY KEY,
  name       TEXT,
  first_seen INTEGER,
  last_seen  INTEGER,
  consent_at INTEGER,
  device     TEXT,
  country    TEXT,
  ua         TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_student ON events(student_email, received);
```

- [ ] **Step 3: Commit**

```bash
git add analytics-worker/schema.sql analytics-worker/migrations/002_student_identity.sql
git commit -m "feat(worker): schema + migration 002 for student identity + students table"
```

---

## Task 10: Worker — per-student section on the `/stats` dashboard

**Files:**
- Modify: `analytics-worker/worker.js` (the `dashboard()` function)

Renders a "Students (named)" section: a roster table (per student: first/last seen, sessions, events, completes, drills, avg drill score) and a feature-usage matrix (students × event types). All student queries are guarded so an un-migrated DB simply omits the section.

- [ ] **Step 1: Add the guarded student queries**

In `dashboard(env)`, after the existing `const hasPct = await columnExists(env, "pct");` line (~192), add:

```js
  const hasStudent = await columnExists(env, "student_email");
  const roster = hasStudent
    ? await qSafe(
        env,
        `SELECT s.email, s.name, s.first_seen, s.last_seen,
            (SELECT count(*) FROM events e WHERE e.student_email = s.email) events,
            (SELECT count(DISTINCT e.session) FROM events e WHERE e.student_email = s.email) sessions,
            (SELECT count(*) FROM events e WHERE e.student_email = s.email AND e.event='case_complete') completes,
            (SELECT count(*) FROM events e WHERE e.student_email = s.email AND e.event='drill') drills,
            (SELECT round(avg(e.pct)) FROM events e
               WHERE e.student_email = s.email AND e.event='drill' AND e.pct IS NOT NULL) avg_drill
          FROM students s ORDER BY (last_seen IS NULL), last_seen DESC`,
      )
    : [];
  const usageMatrix = hasStudent
    ? await qSafe(
        env,
        `SELECT student_email, event, count(*) n FROM events
           WHERE student_email IS NOT NULL AND student_email<>''
           GROUP BY student_email, event`,
      )
    : [];
```

- [ ] **Step 2: Build the section HTML (pure string assembly)**

Still inside `dashboard()`, after the `recentRows` definition (~line 308) and before `const json = JSON.stringify(...)`, add:

```js
  const EVENT_COLS = ["app_open", "screen_view", "case_start", "case_complete", "drill", "ai_enabled"];
  const usageByEmail = {};
  for (const r of usageMatrix) {
    (usageByEmail[r.student_email] = usageByEmail[r.student_email] || {})[r.event] = Number(r.n) || 0;
  }
  const fmtDate = (ms) => (ms ? new Date(Number(ms)).toISOString().slice(0, 10) : "—");

  const rosterRows = roster.length
    ? roster
        .map((r) => {
          const cells = EVENT_COLS.map((ev) => `<td>${esc((usageByEmail[r.email] || {})[ev] || 0)}</td>`).join("");
          return `<tr>
            <td><b>${esc(r.name || "—")}</b><div class="muted2">${esc(r.email)}</div></td>
            <td>${esc(fmtDate(r.first_seen))}</td>
            <td>${esc(fmtDate(r.last_seen))}</td>
            <td>${esc(r.sessions || 0)}</td>
            <td>${esc(r.events || 0)}</td>
            <td>${esc(r.completes || 0)}</td>
            <td>${esc(r.drills || 0)}</td>
            <td>${r.avg_drill == null ? "—" : esc(r.avg_drill) + "%"}</td>
            ${cells}
          </tr>`;
        })
        .join("")
    : `<tr><td colspan="${8 + EVENT_COLS.length}" class="muted">No students have signed in yet.</td></tr>`;

  const studentSection = hasStudent
    ? `<div class="card wide"><h2>Students (named) · ${esc(roster.length)} registered</h2>
        <div style="overflow-x:auto">
        <table><thead><tr>
          <th>Student</th><th>First seen</th><th>Last seen</th><th>Sessions</th><th>Events</th>
          <th>Completes</th><th>Drills</th><th>Avg drill</th>
          ${EVENT_COLS.map((c) => `<th>${esc(c.replace("_", " "))}</th>`).join("")}
        </tr></thead><tbody>${rosterRows}</tbody></table></div>
        <p class="muted2" style="margin-top:8px">Per-student feature usage. Events without a name (anonymous or pre-sign-in) are not shown here but still count in the aggregate charts above.</p>
      </div>`
    : "";
```

- [ ] **Step 3: Add a small CSS rule for the sub-label**

In the dashboard `<style>` block, add one rule next to `.muted` (~line 339):

```css
.muted2{color:#9b97b5;font-size:11px}
```

- [ ] **Step 4: Place the section into the grid**

In the returned HTML, insert `${studentSection}` immediately before the "Recent activity" card (the `<div class="card wide"><h2>Recent activity</h2>` block, ~line 369):

```js
  ${studentSection}
  <div class="card wide"><h2>Recent activity</h2>
```

- [ ] **Step 5: Manual verification (deferred to Task 12's deploy)**

After deploy + migration, load `/stats?key=…` and confirm the "Students (named)" section renders with one row per registered student. (No automated test — the dashboard needs the Cloudflare/D1 runtime.)

- [ ] **Step 6: Commit**

```bash
git add analytics-worker/worker.js
git commit -m "feat(worker): per-student roster + feature-usage matrix on /stats"
```

---

## Task 11: Update operator docs (wrangler setup comments)

**Files:**
- Modify: `analytics-worker/wrangler.toml`

- [ ] **Step 1: Extend the setup comment**

In `analytics-worker/wrangler.toml`, update the numbered setup comment to add the class-password secret and the 002 migration. Replace the existing steps 3–4 region with:

```toml
#   3. wrangler d1 execute osce-analytics --remote --file=./schema.sql
#      (existing DB? also run the migrations:)
#      wrangler d1 execute osce-analytics --remote --file=./migrations/001_drill_performance.sql
#      wrangler d1 execute osce-analytics --remote --file=./migrations/002_student_identity.sql
#   4. wrangler secret put STATS_KEY        # password for the /stats dashboard
#      wrangler secret put CLASS_PASSWORD   # the class sign-in password you share with students
```

- [ ] **Step 2: Commit**

```bash
git add analytics-worker/wrangler.toml
git commit -m "docs(worker): document CLASS_PASSWORD secret + migration 002 in setup steps"
```

---

## Task 12: Full verification + final commit

**Files:** none (verification only)

- [ ] **Step 1: Run the entire test suite**

Run: `npm test`
Expected: PASS — all prior tests plus the new `identity`, `authClient`, `telemetry` (extended), `loginGate`, `account`, and worker `auth` tests. Note the new total count (was 249).

- [ ] **Step 2: Typecheck + production build**

Run: `npm run build`
Expected: `tsc -b` clean (no unused `ConsentGate`/`consentGateRequired`/`gatePassed` references) and `vite build` succeeds.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors. (Fix any unused-import or `no-explicit-any` issues introduced.)

- [ ] **Step 4: Manual smoke (local, gate bypassed)**

Run: `npm run dev`, open the app. With no `VITE_ANALYTICS_ENDPOINT`, the gate is bypassed and the app loads normally — confirm no regression. (To exercise the gate locally, run `VITE_ANALYTICS_ENDPOINT=https://your-worker.workers.dev npm run dev` and confirm the LoginGate appears and Continue is disabled until name + valid northwestern email + password + consent are present.)

- [ ] **Step 5: Operator runbook (user-run — wrangler can't be run by the agent)**

Document/confirm these are run by the user before the next Pages deploy:

```bash
cd analytics-worker
wrangler d1 execute osce-analytics --remote --file=./migrations/002_student_identity.sql
wrangler secret put CLASS_PASSWORD     # type the class password when prompted
wrangler deploy
# then verify:
curl -s -X POST https://<worker>.workers.dev/auth -d '{"name":"T","email":"t@u.northwestern.edu","password":"<wrong>","consent":true}'   # → 401
curl -s -X POST https://<worker>.workers.dev/auth -d '{"name":"T","email":"t@u.northwestern.edu","password":"<right>","consent":false}'  # → 403
curl -s -X POST https://<worker>.workers.dev/auth -d '{"name":"T","email":"t@u.northwestern.edu","password":"<right>","consent":true}'   # → {"ok":true}
wrangler d1 execute osce-analytics --remote --command "SELECT email,name FROM students"   # confirm the row
# open https://<worker>.workers.dev/stats?key=<STATS_KEY> → "Students (named)" section
```

`VITE_ANALYTICS_ENDPOINT` is already set as a GitHub Actions variable, so the deployed app will gate on sign-in once these steps are done.

- [ ] **Step 6: Final state**

Confirm the branch `feat/student-signin` holds all task commits and `git status` is clean. The feature is complete; the user runs the wrangler steps and sets the class password.

---

## Self-Review Notes (author check)

- **Spec coverage:** sign-in gate (Tasks 4–5) ✓; name+email+password+required consent (Task 4) ✓; consent hard precondition client + server (Tasks 4, 7, 8) ✓; domain check incl. subdomains (Tasks 1, 7) ✓; Worker-checked password as secret (Tasks 7, 8, 11) ✓; students registry + consent_at (Tasks 8, 9) ✓; identity on events + backward-compatible columns (Tasks 8, 9) ✓; DNT override (Task 3) ✓; per-student dashboard (Task 10) ✓; sign-out (Task 6) ✓; dev/test bypass when no endpoint (Tasks 2, 3, 5) ✓; tests + build (Task 12) ✓; runbook (Tasks 11, 12) ✓.
- **Type/name consistency:** `Student`, `getCurrentStudent`, `setStudent`, `signOut`, `isSignedIn`, `validateEmail`, `IDENTITY_VERSION`, `STUDENT_KEY` consistent across Tasks 1/3/4/6. `SignInResult` errors (`bad_password`/`bad_email`/`consent_required`/`network`/`unconfigured`) consistent between Task 2 client and Task 8 worker statuses (401/400/403). `evaluateAuth`/`isNorthwesternEmail` consistent Tasks 7–8.
- **No placeholders:** every code step is complete and runnable; no TBD/TODO.
