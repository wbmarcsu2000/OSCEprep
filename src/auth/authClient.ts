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
