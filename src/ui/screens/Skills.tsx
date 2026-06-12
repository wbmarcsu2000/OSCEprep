import { SKILLS, type SkillCard } from "../../data/skills";
import {
  EKG_SIX_STEPS,
  CXR_RIP_ABCDE,
  LITFL_TOP100_ECG,
  LITFL_TOP100_CXR,
  type ReadStepGuide,
} from "../../data/readingGuides";
import { useAppStore } from "../store";

/** Pop-gradient rotation for card identity tiles. */
const POP_GRADS = [
  "var(--grad-teal)",
  "var(--grad-sun)",
  "var(--grad-coral)",
  "var(--grad-sky)",
  "var(--grad-pink)",
];

/** Decorative tile emoji per skill card — UI chrome only, not educational content. */
const SKILL_ICONS: Record<string, string> = {
  abg: "🧪",
  pft: "🌬️",
  ascitic: "💧",
  pleural: "🫁",
};

/**
 * "Special skills" reference page: EKG 6-step, CXR RIP-ABCDE, ABG/acid-base,
 * PFTs, and ascitic/pleural fluid interpretation — the skills section of the
 * OSCE review session. Pure educational reference; no case state.
 */
export function Skills() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <span className="icon-tile" style={{ background: "var(--grad-sky)" }} aria-hidden>
            📖
          </span>
          <div className="space-y-0.5">
            <div className="panel-label">Reference</div>
            <h2
              className="text-[24px] font-extrabold tracking-tight"
              style={{ color: "var(--color-exam-header)" }}
            >
              Special Skills
            </h2>
            <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
              Systematic reads and lab interpretation — EKG, CXR, ABG/acid-base, PFTs, ascitic &amp;
              pleural fluid.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
          <button className="btn btn-ghost" onClick={exitToSelect}>
            Station list
          </button>
          <button className="btn btn-primary" onClick={() => setView("drills")}>
            Drill these skills →
          </button>
        </div>
      </div>

      <ReadingCard
        title="Systematic EKG read — 6 steps"
        icon="📈"
        index={0}
        steps={EKG_SIX_STEPS}
        practice={{ label: "Practice: LITFL Top 100 ECG", url: LITFL_TOP100_ECG }}
      />
      <ReadingCard
        title="Systematic CXR read — RIP ABCDE"
        icon="🩻"
        index={1}
        steps={CXR_RIP_ABCDE}
        practice={{ label: "Practice: LITFL Top 100 CXR", url: LITFL_TOP100_CXR }}
      />

      {SKILLS.map((s, i) => (
        <SkillCardView key={s.id} card={s} index={i + 2} />
      ))}

      <p className="hint text-center">
        Educational reference for OSCE practice — verify against primary sources; not for clinical
        decision-making.
      </p>
    </div>
  );
}

/** Small gradient identity tile; .icon-tile is unlayered CSS, so the compact
 *  size is enforced inline alongside the h-9/w-9/text-base utilities. */
function CardTile({ emoji, index }: { emoji: string; index: number }) {
  return (
    <span
      className="icon-tile h-9 w-9 text-base"
      style={{
        background: POP_GRADS[index % POP_GRADS.length],
        width: "2.25rem",
        height: "2.25rem",
        fontSize: "1rem",
        borderRadius: 12,
      }}
      aria-hidden
    >
      {emoji}
    </span>
  );
}

function ReadingCard({
  title,
  icon,
  index,
  steps,
  practice,
}: {
  title: string;
  icon: string;
  index: number;
  steps: ReadStepGuide[];
  practice?: { label: string; url: string };
}) {
  return (
    <div className="card p-4 space-y-3">
      <div>
        <div className="flex items-center gap-2.5">
          <CardTile emoji={icon} index={index} />
          <div className="text-[15px] font-bold tracking-tight">{title}</div>
        </div>
        {practice && (
          <a
            className="inline-block mt-1.5 text-[12.5px] font-semibold underline"
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

function SkillCardView({ card, index }: { card: SkillCard; index: number }) {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start gap-2.5">
        <CardTile emoji={SKILL_ICONS[card.id] ?? "📖"} index={index} />
        <div>
          <div className="text-[15px] font-bold tracking-tight">{card.title}</div>
          {card.subtitle && (
            <div className="text-[13px] font-mono mt-0.5" style={{ color: "var(--color-exam-muted)" }}>
              {card.subtitle}
            </div>
          )}
        </div>
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
                <span aria-hidden style={{ color: "var(--color-exam-ghost)" }}>•</span>
                {it}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {card.tables?.map((t) => (
        <div key={t.title}>
          <div className="panel-label mb-1.5">{t.title}</div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-exam-border)" }}>
            <table className="w-full text-[13px] leading-relaxed">
              <thead>
                <tr style={{ background: "var(--color-exam-soft)" }}>
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

      {card.examples && card.examples.length > 0 && (
        <div className="space-y-2">
          <div className="panel-label" style={{ color: "var(--color-exam-accent-deep)" }}>
            Worked examples <span className="hint ml-1 font-normal">{card.examples.length} to practice</span>
          </div>
          {card.examples.map((ex, ei) => (
            <details
              key={ei}
              className="rounded-xl border"
              style={{ borderColor: "var(--color-exam-accent-line)", background: "var(--color-exam-accent-soft)" }}
              open={ei === 0}
            >
              <summary
                className="px-3 py-2 text-[13px] font-mono font-semibold flex items-center gap-2 cursor-pointer"
                style={{ color: "var(--color-exam-accent-deep)" }}
              >
                <span aria-hidden className="caret text-[10px]">▶</span>
                {ex.prompt}
              </summary>
              <ul className="px-3 pb-3 text-[13px] leading-relaxed space-y-0.5" style={{ color: "var(--color-exam-accent-deep)" }}>
                {ex.lines.map((l, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden>→</span>
                    {l}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}

      {card.references && card.references.length > 0 && (
        <ul className="space-y-1 text-[12.5px] leading-relaxed">
          {card.references.map((r, i) => (
            <li key={i} style={{ color: "var(--color-exam-muted)" }}>
              <span aria-hidden style={{ color: "var(--color-exam-ghost)" }}>§ </span>
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
