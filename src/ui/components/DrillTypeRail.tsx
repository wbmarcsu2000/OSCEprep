import { Fragment, useMemo } from "react";
import {
  DRILL_TAB_GROUPS,
  DRILL_TYPE_EMOJI,
  DRILL_TYPE_LABELS,
  summarize,
  type DrillType,
  type DrillProgressMap,
  type DrillTypeSummary,
} from "../../data/drillProgress";

/**
 * Vertical side rail for choosing the drill type. Replaces the horizontal pill
 * strip that overflowed (and clipped) once there were 15 drill types: here every
 * type is reachable without horizontal scrolling, sectioned into the workflow
 * frameworks and the lab-interpretation banks, with a per-type mastered/total
 * count so progress reads at a glance.
 *
 * Responsive: a horizontally-scrolling strip on small screens (swipe), a sticky
 * column on lg+ where there's room. a11y: a group of aria-pressed toggle buttons,
 * matching the app's Segmented contract (Tab reaches each; no half-implemented
 * radio semantics).
 */
export function DrillTypeRail({
  type,
  progress,
  onSelect,
}: {
  type: DrillType;
  progress: DrillProgressMap;
  onSelect: (t: DrillType) => void;
}) {
  // Recompute per-type summaries only when progress actually changes — the
  // parent re-renders on every drill-answer keystroke, which must not re-tally.
  const summaries = useMemo(() => {
    const m: Partial<Record<DrillType, DrillTypeSummary>> = {};
    for (const g of DRILL_TAB_GROUPS) for (const t of g.types) m[t] = summarize(t, progress);
    return m as Record<DrillType, DrillTypeSummary>;
  }, [progress]);

  return (
    <nav aria-label="Drill type" className="card p-2 lg:p-2.5 lg:sticky lg:top-4">
      {/* The <nav> landmark is the sole labeled container; the buttons below are a
          flat aria-pressed toggle group (the app's Segmented contract). */}
      <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-y-auto lg:max-h-[calc(100dvh-7rem)] scroll-quiet">
        {DRILL_TAB_GROUPS.map((g, gi) => (
          <Fragment key={g.label}>
            {/* Section boundary: a visible divider on the mobile strip (the text
                header is desktop-only), so swiping across groups stays legible. */}
            {gi > 0 && (
              <div
                aria-hidden
                className="lg:hidden shrink-0 self-stretch w-px mx-0.5"
                style={{ background: "var(--color-exam-border)" }}
              />
            )}
            {/* Visible header on lg; sr-only (not display:none) below it so the
                grouping is still announced to assistive tech on small screens. */}
            <div
              className="panel-label sr-only lg:not-sr-only lg:block px-1.5 pb-0.5"
              style={
                gi > 0
                  ? { marginTop: "0.5rem", paddingTop: "0.625rem", borderTop: "1px solid var(--color-exam-border)" }
                  : { paddingTop: "0.25rem" }
              }
            >
              {g.label}
            </div>
            {g.types.map((t) => {
              const active = t === type;
              const s = summaries[t];
              const done = s.total > 0 && s.mastered === s.total;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(t)}
                  className="shrink-0 lg:w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] font-bold text-left whitespace-nowrap transition-colors"
                  style={{
                    background: active ? "var(--color-exam-accent-soft)" : "transparent",
                    color: active ? "var(--color-exam-accent-deep)" : "var(--color-exam-muted)",
                    boxShadow: active ? "inset 0 0 0 1px var(--color-exam-accent-line)" : "none",
                  }}
                >
                  <span aria-hidden className="text-[15px] leading-none">
                    {DRILL_TYPE_EMOJI[t]}
                  </span>
                  <span className="lg:flex-1 truncate">{DRILL_TYPE_LABELS[t]}</span>
                  {s.seen > 0 && (
                    <span
                      className="hidden lg:inline font-mono tabular-nums text-[11px]"
                      style={{ color: done ? "var(--color-exam-ok)" : "var(--color-exam-faint)" }}
                      aria-label={done ? `all ${s.total} mastered` : `${s.mastered} of ${s.total} mastered`}
                    >
                      {done ? "✓ " : ""}
                      {s.mastered}/{s.total}
                    </span>
                  )}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
