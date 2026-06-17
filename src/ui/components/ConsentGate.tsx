import { setConsent } from "../../analytics/telemetry";

/**
 * Mandatory analytics-consent gate. The app cannot be used until the visitor
 * accepts — there is no decline. It is rendered IN PLACE OF the app (not as a
 * dismissible overlay), so nothing behind it is reachable until consent is
 * given. Only shown when analytics is configured and the visitor hasn't yet
 * accepted; Do-Not-Track visitors are never tracked and never see this (gated
 * upstream by consentGateRequired()).
 */
export function ConsentGate({ onAccept }: { onAccept: () => void }) {
  const accept = () => {
    setConsent(true);
    onAccept();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Accept usage analytics to continue"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "var(--grad-header)" }}
    >
      <div className="card max-w-lg w-full p-6 space-y-4 pop-in">
        <div className="flex items-center gap-3">
          <span className="icon-tile" style={{ background: "var(--grad-teal)" }} aria-hidden>
            📊
          </span>
          <div>
            <div className="panel-label">Before you start</div>
            <h2 className="text-[22px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
              Usage analytics
            </h2>
          </div>
        </div>

        <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-exam-ink)" }}>
          This app records <span className="font-semibold">anonymous usage analytics</span> — which features you
          use, plus coarse device type and country — to understand how it's used and keep improving it.
        </p>

        <ul className="text-[13px] leading-relaxed space-y-1" style={{ color: "var(--color-exam-muted)" }}>
          <li>✓ No names, accounts, or personal information</li>
          <li>✓ No exam answers and no API keys are ever collected</li>
          <li>✓ Honors your browser's “Do Not Track” setting</li>
        </ul>

        <p className="text-[13px] font-semibold" style={{ color: "var(--color-exam-ink)" }}>
          Accepting is required to use the app.
        </p>

        <button className="btn btn-primary w-full py-2.5 text-[14px]" onClick={accept} autoFocus>
          Accept &amp; continue
        </button>

        <p className="hint text-center">
          For medical education and OSCE practice only · fictional cases, no patient data.
        </p>
      </div>
    </div>
  );
}
