import { useMemo } from "react";
import { manifest } from "../../data/loader";
import { SHELF_MCQS } from "../../data/shelfMcq";
import { loadAttempts } from "../../analytics/store";
import { useAppStore } from "../store";
import { CLERKSHIPS } from "../clerkships";

/**
 * Landing page for ClerkTools. Tools are grouped by clerkship — the same
 * structure as the header tabs — so the page scales as clerkships are added.
 * Internal Medicine carries the full toolkit; Neurology is its own clerkship.
 * AI setup stays a single optional bar below; the rest is a disclaimer.
 */

export function Home() {
  const setView = useAppStore((s) => s.setView);
  const showEnableAi = useAppStore((s) => s.showEnableAi);
  const llmEnabled = useAppStore((s) => s.llmEnabled);

  const done = useMemo(() => new Set(loadAttempts().map((a) => a.caseId)).size, []);

  // Small status line for a couple of tools.
  const metaFor = (view: string): string | undefined => {
    if (view === "select") return `${manifest.cases.length} cases · ${done} done`;
    if (view === "mcq") return `${SHELF_MCQS.length} questions`;
    return undefined;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1
          className="text-[26px] sm:text-[32px] font-extrabold tracking-tight leading-tight"
          style={{ color: "var(--color-exam-header)" }}
        >
          ClerkTools
        </h1>
        <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
          Your clerkship toolkit — pick a clerkship, then a tool.
        </p>
      </header>

      {/* One section per clerkship */}
      {CLERKSHIPS.map((clerk) => (
        <section key={clerk.id} className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
              {clerk.full}
            </h2>
            <span className="h-px flex-1" style={{ background: "var(--color-exam-border)" }} />
            <span className="panel-label">
              {clerk.tools.length} tool{clerk.tools.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {clerk.tools.map((t) => {
              const meta = metaFor(t.view);
              return (
                <button
                  key={t.view}
                  onClick={() => setView(t.view)}
                  className="card p-5 flex flex-col gap-2.5 text-left transition-transform hover:-translate-y-0.5"
                >
                  <span className="icon-tile" style={{ background: t.grad }} aria-hidden>
                    {t.icon}
                  </span>
                  <h3
                    className="text-[17px] font-extrabold tracking-tight"
                    style={{ color: "var(--color-exam-header)" }}
                  >
                    {t.label}
                  </h3>
                  <p className="text-[13px] leading-relaxed flex-1" style={{ color: "var(--color-exam-muted)" }}>
                    {t.blurb}
                  </p>
                  {meta && (
                    <span className="text-[12px] font-semibold" style={{ color: "var(--color-exam-faint)" }}>
                      {meta}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {/* Turn AI on — optional; every tool works fully without it. */}
      <button
        onClick={showEnableAi}
        className="w-full rounded-2xl border px-5 py-3.5 flex items-center justify-center gap-2.5 text-[13.5px] font-semibold leading-snug text-center transition-colors"
        style={{
          borderColor: llmEnabled ? "var(--color-exam-ok-line)" : "var(--color-exam-accent-line)",
          background: llmEnabled ? "var(--color-exam-ok-soft)" : "var(--color-exam-accent-soft)",
          color: llmEnabled ? "var(--color-exam-ok)" : "var(--color-exam-accent-deep)",
        }}
      >
        {llmEnabled ? (
          <>
            <span aria-hidden>🟢</span> AI is on — the patient talks naturally and grading is smarter.{" "}
            <span className="underline underline-offset-2">Manage</span>
          </>
        ) : (
          <>
            <span aria-hidden>⚙️</span> Turn on AI (Claude / GPT) — makes the patient conversational and grading
            smarter. Your key stays in your browser.
          </>
        )}
      </button>

      <p className="hint text-center">
        For medical education and clerkship practice only — not for clinical decision-making. Fictional cases, no real
        patient data.
      </p>
    </div>
  );
}
