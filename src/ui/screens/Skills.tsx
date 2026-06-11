import { SKILLS, type SkillCard } from "../../data/skills";
import {
  EKG_SIX_STEPS,
  CXR_RIP_ABCDE,
  LITFL_TOP100_ECG,
  LITFL_TOP100_CXR,
  type ReadStepGuide,
} from "../../data/readingGuides";
import { useAppStore } from "../store";

/**
 * "Special skills" reference page: EKG 6-step, CXR RIP-ABCDE, ABG/acid-base,
 * PFTs, and ascitic/pleural fluid interpretation — the skills section of the
 * OSCE review session. Pure educational reference; no case state.
 */
export function Skills() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);

  return (
    <div className="max-w-4xl mx-auto px-6 py-7 space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-0.5">
          <div className="panel-label">Reference</div>
          <h2 className="text-[20px] font-bold tracking-tight">Special Skills</h2>
          <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
            Systematic reads and lab interpretation — EKG, CXR, ABG/acid-base, PFTs, ascitic &amp;
            pleural fluid.
          </p>
        </div>
        <button className="btn btn-primary shrink-0" onClick={exitToSelect}>
          Station list →
        </button>
      </div>

      <ReadingCard
        title="Systematic EKG read — 6 steps"
        steps={EKG_SIX_STEPS}
        practice={{ label: "Practice: LITFL Top 100 ECG", url: LITFL_TOP100_ECG }}
      />
      <ReadingCard
        title="Systematic CXR read — RIP ABCDE"
        steps={CXR_RIP_ABCDE}
        practice={{ label: "Practice: LITFL Top 100 CXR", url: LITFL_TOP100_CXR }}
      />

      {SKILLS.map((s) => (
        <SkillCardView key={s.id} card={s} />
      ))}

      <p className="hint text-center">
        Educational reference for OSCE practice — verify against primary sources; not for clinical
        decision-making.
      </p>
    </div>
  );
}

function ReadingCard({
  title,
  steps,
  practice,
}: {
  title: string;
  steps: ReadStepGuide[];
  practice?: { label: string; url: string };
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="panel-label">{title}</div>
        {practice && (
          <a
            className="text-[12.5px] font-semibold underline"
            style={{ color: "var(--color-exam-accent)" }}
            href={practice.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {practice.label} ↗
          </a>
        )}
      </div>
      <ol className="space-y-1.5 text-[13px] leading-relaxed">
        {steps.map((s, i) => (
          <li key={i}>
            <span className="font-semibold">{s.step}</span>
            <span style={{ color: "var(--color-exam-muted)" }}> — {s.detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SkillCardView({ card }: { card: SkillCard }) {
  return (
    <div className="card p-4 space-y-3">
      <div>
        <div className="text-[15px] font-bold tracking-tight">{card.title}</div>
        {card.subtitle && (
          <div className="text-[13px] font-mono mt-0.5" style={{ color: "var(--color-exam-muted)" }}>
            {card.subtitle}
          </div>
        )}
      </div>

      {card.steps && (
        <ol className="space-y-1.5 text-[13px] leading-relaxed">
          {card.steps.map((s, i) => (
            <li key={i}>
              <span className="font-semibold">{s.step}</span>
              <span style={{ color: "var(--color-exam-muted)" }}> — {s.detail}</span>
            </li>
          ))}
        </ol>
      )}

      {card.sections?.map((sec) => (
        <div key={sec.heading}>
          <div className="panel-label mb-1.5">{sec.heading}</div>
          <ul className="space-y-1 text-[13px] leading-relaxed">
            {sec.items.map((it, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden style={{ color: "var(--color-exam-accent)" }}>•</span>
                {it}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {card.tables?.map((t) => (
        <div key={t.title}>
          <div className="panel-label mb-1.5">{t.title}</div>
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-exam-border)" }}>
            <table className="w-full text-[13px] leading-relaxed">
              <thead>
                <tr style={{ background: "#fafbfd" }}>
                  <th className="text-left px-3 py-1.5 font-semibold w-1/3 align-top">{t.columns[0]}</th>
                  <th className="text-left px-3 py-1.5 font-semibold align-top">{t.columns[1]}</th>
                </tr>
              </thead>
              <tbody>
                {t.rows.map((r, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "var(--color-exam-border)" }}>
                    <td className="px-3 py-1.5 font-medium align-top">{r[0]}</td>
                    <td className="px-3 py-1.5 align-top" style={{ color: "var(--color-exam-muted)" }}>{r[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {card.example && (
        <div
          className="rounded-lg border p-3 space-y-1"
          style={{ borderColor: "#d3def7", background: "var(--color-exam-accent-soft)" }}
        >
          <div className="panel-label" style={{ color: "var(--color-exam-accent-deep)" }}>
            Worked example
          </div>
          <div className="text-[13px] font-mono" style={{ color: "#18305f" }}>{card.example.prompt}</div>
          <ul className="text-[13px] leading-relaxed space-y-0.5" style={{ color: "#18305f" }}>
            {card.example.lines.map((l, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden>→</span>
                {l}
              </li>
            ))}
          </ul>
        </div>
      )}

      {card.references && card.references.length > 0 && (
        <ul className="space-y-1 text-[12.5px] leading-relaxed">
          {card.references.map((r, i) => (
            <li key={i} style={{ color: "var(--color-exam-muted)" }}>
              <span aria-hidden style={{ color: "var(--color-exam-faint)" }}>§ </span>
              <span className="font-medium" style={{ color: "var(--color-exam-ink)" }}>{r.label}</span> —{" "}
              {r.url ? (
                <a className="underline" style={{ color: "var(--color-exam-accent)" }} href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.source} ↗
                </a>
              ) : (
                r.source
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
