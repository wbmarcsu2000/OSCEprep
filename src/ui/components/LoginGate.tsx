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

  const inputCls = "w-full rounded-xl border px-3 py-2 text-[14px] outline-none focus:ring-2";
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
          <p role="alert" className="text-[12.5px] font-bold" style={{ color: "var(--color-exam-danger)" }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full py-2.5 text-[14px]" disabled={!canSubmit}>
          {busy ? "Signing in…" : "Continue"}
        </button>

        <p className="hint text-center">
          For medical education and OSCE practice only · fictional cases, no patient data.
        </p>
      </form>
    </div>
  );
}
