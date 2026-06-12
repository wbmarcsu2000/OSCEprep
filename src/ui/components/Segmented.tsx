export interface SegmentedOption<K extends string> {
  value: K;
  label: string;
}

/**
 * The shared pill segmented switcher (station mode, drill type). One ARIA
 * contract everywhere: a group of aria-pressed toggle buttons — Tab reaches
 * each option, no radio keyboard semantics to half-implement.
 */
export function Segmented<K extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: SegmentedOption<K>[];
  value: K;
  onChange: (value: K) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex rounded-full border p-0.5"
      style={{ borderColor: "var(--color-exam-border-strong)", background: "var(--color-exam-soft)" }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            className="px-4 py-1.5 text-[13px] font-bold rounded-full transition-all"
            style={{
              background: active ? "#fff" : "transparent",
              color: active ? "var(--color-exam-accent-deep)" : "var(--color-exam-muted)",
              boxShadow: active ? "var(--shadow-card)" : "none",
            }}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
