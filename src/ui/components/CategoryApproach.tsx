import { CURRICULUM_BY_CATEGORY, FRAMEWORKS, type PracticeCase } from "../../data/curriculum";
import { ManualRefs } from "./ManualRefs";

/**
 * End-of-station teaching, modeled on the clerkship OSCE review session:
 * reasoning frameworks, broad differential buckets, the standard key questions,
 * a general work-up menu (labs + imaging), worked practice cases, quick-and-
 * dirty management, and references. Educational only; separate from the case
 * JSON that drives scoring.
 */
export function CategoryApproach({ category }: { category: string }) {
  const c = CURRICULUM_BY_CATEGORY.get(category);
  if (!c) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="icon-tile h-9 w-9 text-base"
            style={{
              background: "var(--grad-primary)",
              width: "2.25rem",
              height: "2.25rem",
              fontSize: "1rem",
              borderRadius: 12,
            }}
            aria-hidden
          >
            🧭
          </span>
          <h3 className="text-[15px] font-bold tracking-tight">Approach to {category}</h3>
        </div>
        <span className="hint">Transferable strategy · not specific to this patient</span>
      </div>

      <div className="card p-4 space-y-1.5">
        <div className="panel-label">Framing strategy</div>
        <p className="text-[13.5px] leading-relaxed">{c.strategy}</p>
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
          <span className="font-semibold">Schema:</span> {c.framework}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="panel-label mb-2" style={{ color: "var(--color-exam-danger)" }}>
            Can't-miss — exclude these first
          </div>
          <ul className="space-y-1.5 text-[13px] leading-relaxed">
            {c.cantMiss.map((d, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden style={{ color: "var(--color-exam-danger)" }}>▲</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <div className="panel-label mb-2">Differential buckets</div>
          <div className="space-y-2">
            {c.differential.map((g) => (
              <div key={g.group} className="text-[13px] leading-relaxed">
                <span className="font-semibold">{g.group}: </span>
                <span style={{ color: "var(--color-exam-muted)" }}>{g.items.join(" · ")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="panel-label mb-2">Standard key questions to carry into every room</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {c.keyQuestions.map((qt) => (
            <div key={qt.theme}>
              <div className="text-[13px] font-semibold mb-1">{qt.theme}</div>
              <ul className="space-y-1 text-[13px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
                {qt.questions.map((q, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden style={{ color: "var(--color-exam-ghost)" }}>•</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="panel-label mb-2">Targeted exam</div>
          <ul className="space-y-1 text-[13px] leading-relaxed">
            {c.examFocus.map((e, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden style={{ color: "var(--color-exam-ghost)" }}>•</span>
                {e}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-4 space-y-3">
          <div>
            <div className="panel-label mb-1.5">Work-up menu — labs</div>
            <ul className="space-y-1 text-[13px] leading-relaxed">
              {c.workupMenu.labs.map((w, i) => (
                <li key={i}>
                  <span className="font-semibold">{w.test}</span>
                  <span style={{ color: "var(--color-exam-muted)" }}> — {w.indication}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="panel-label mb-1.5">Work-up menu — imaging &amp; other</div>
            <ul className="space-y-1 text-[13px] leading-relaxed">
              {c.workupMenu.imaging.map((w, i) => (
                <li key={i}>
                  <span className="font-semibold">{w.test}</span>
                  <span style={{ color: "var(--color-exam-muted)" }}> — {w.indication}</span>
                </li>
              ))}
            </ul>
          </div>
          {c.tools.length > 0 && (
            <p className="text-[12.5px]" style={{ color: "var(--color-exam-muted)" }}>
              <span className="font-semibold">Decision tools:</span> {c.tools.join(" · ")}
            </p>
          )}
        </div>
      </div>

      {/* Worked practice cases — the signature OSCE-review format. */}
      <div className="card p-4 space-y-3">
        <div className="panel-label">Worked practice cases</div>
        <div className="space-y-3">
          {c.practiceCases.map((pc, i) => (
            <PracticeCaseCard key={i} pc={pc} />
          ))}
        </div>
      </div>

      {c.quickManagement.length > 0 && (
        <div className="card p-4">
          <div className="panel-label mb-2">
            Quick &amp; dirty management
            <span className="hint ml-2">aligned to the MGH Housestaff Manual</span>
          </div>
          <div className="space-y-2.5">
            {c.quickManagement.map((m, i) => (
              <div key={i} className="text-[13px] leading-relaxed">
                <div className="font-semibold">
                  {m.scenario}
                  {m.manualPage && (
                    <span className="hint ml-2 font-normal">📖 MGH p.&nbsp;{m.manualPage}</span>
                  )}
                </div>
                <div style={{ color: "var(--color-exam-muted)" }}>{m.plan}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ManualRefs manual={c.manual} />

      <div className="card p-4">
        <div className="panel-label mb-2">References &amp; further reading</div>
        <ul className="space-y-1.5 text-[13px] leading-relaxed">
          {c.references.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden style={{ color: "var(--color-exam-ghost)" }}>§</span>
              <span>
                <span className="font-medium">{r.label}</span>
                {" — "}
                {r.url ? (
                  <a className="underline" style={{ color: "var(--color-exam-accent)" }} href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.source} ↗
                  </a>
                ) : (
                  <span style={{ color: "var(--color-exam-muted)" }}>{r.source}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
        <p className="hint mt-2">
          References name real societies, guidelines, and resources as study starting points — verify
          against primary sources; they are not citations for any single statement above.
        </p>
      </div>

      <details className="card overflow-hidden">
        <summary className="card-header hover:bg-[var(--color-exam-soft)] transition-colors" style={{ borderBottom: "none" }}>
          <span className="flex items-center gap-2.5">
            <span aria-hidden className="caret text-[10px]" style={{ color: "var(--color-exam-ghost)" }}>▶</span>
            <span className="text-[13.5px] font-semibold">General reasoning frameworks</span>
          </span>
          <span className="hint">how experts structure any case</span>
        </summary>
        <div className="px-4 pb-4 pt-1 space-y-3 border-t" style={{ borderColor: "var(--color-exam-border)" }}>
          {FRAMEWORKS.map((f) => (
            <div key={f.name} className="pt-2">
              <div className="text-[13px] font-semibold">{f.name}</div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>{f.what}</p>
              {f.mnemonic && (
                <p className="text-[12.5px] font-mono mt-0.5" style={{ color: "var(--color-exam-ink)" }}>{f.mnemonic}</p>
              )}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function PracticeCaseCard({ pc }: { pc: PracticeCase }) {
  return (
    <div
      className="rounded-xl border p-3.5 space-y-2"
      style={{ borderColor: "var(--color-exam-border)", background: "var(--color-exam-soft)" }}
    >
      <p className="text-[13.5px] font-semibold leading-relaxed">{pc.vignette}</p>
      <div className="text-[13px] leading-relaxed">
        <span className="panel-label mr-1.5">DDx</span>
        <span style={{ color: "var(--color-exam-muted)" }}>{pc.ddx.join(" · ")}</span>
      </div>
      <div className="text-[13px] leading-relaxed">
        <span className="panel-label mr-1.5">Work-up</span>
        <span style={{ color: "var(--color-exam-muted)" }}>{pc.workup.join(", ")}</span>
      </div>
      {pc.twist && (
        <div
          className="rounded-md px-2.5 py-2 text-[13px] leading-relaxed"
          style={{ background: "var(--color-exam-accent-soft)", color: "var(--color-exam-accent-deep)" }}
        >
          <span className="font-semibold">Results: </span>
          {pc.twist}
          {pc.updatedDdx && (
            <div className="mt-1.5">
              <span className="panel-label mr-1.5">Now</span>
              {pc.updatedDdx.join(" · ")}
            </div>
          )}
          {pc.nextStep && (
            <div className="mt-1.5">
              <span className="panel-label mr-1.5">Next</span>
              {pc.nextStep}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
