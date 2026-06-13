import { useState } from "react";
import { shouldAskConsent, setConsent } from "../../analytics/telemetry";

/**
 * One-time, low-friction consent for privacy-friendly usage analytics. Only
 * appears when analytics is actually configured (an endpoint/provider is set)
 * and the visitor hasn't chosen yet; Do-Not-Track is honored upstream. Choosing
 * either option persists the choice and hides the banner for good.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(() => shouldAskConsent());
  if (!open) return null;

  const choose = (granted: boolean) => {
    setConsent(granted);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Usage analytics consent"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 pointer-events-none"
    >
      <div
        className="card pointer-events-auto mx-auto max-w-3xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-lg"
        style={{ borderColor: "var(--color-exam-accent-line)" }}
      >
        <p className="text-[13px] leading-relaxed flex-1" style={{ color: "var(--color-exam-muted)" }}>
          <span className="font-bold" style={{ color: "var(--color-exam-ink)" }}>
            Help improve this app?
          </span>{" "}
          We collect anonymous usage stats (which features you use, plus coarse device and country) to
          understand how it's used. No personal info, no exam answers, no API keys. You can decline.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button className="btn btn-ghost px-4 py-2 text-[13px]" onClick={() => choose(false)}>
            Decline
          </button>
          <button className="btn btn-primary px-4 py-2 text-[13px]" onClick={() => choose(true)}>
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
