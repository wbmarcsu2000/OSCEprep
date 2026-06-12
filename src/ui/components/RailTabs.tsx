import { useRef } from "react";

export interface RailTab<K extends string> {
  key: K;
  label: string;
}

/**
 * The shared rail-panel tab strip (Encounter & Post-Encounter side panels).
 * Pill-style per the Vivid language, with real tab semantics: roving tabindex,
 * Arrow/Home/End keyboard selection, and aria-controls wiring to the panel
 * (render the active panel with `id={panelId(idBase)}` role="tabpanel").
 */
export function RailTabs<K extends string>({
  tabs,
  active,
  onSelect,
  label,
  idBase,
}: {
  tabs: RailTab<K>[];
  active: K;
  onSelect: (key: K) => void;
  label: string;
  idBase: string;
}) {
  const refs = useRef(new Map<K, HTMLButtonElement>());

  const move = (delta: number) => {
    const idx = tabs.findIndex((t) => t.key === active);
    const next = tabs[(idx + delta + tabs.length) % tabs.length];
    onSelect(next.key);
    refs.current.get(next.key)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex gap-1 px-2 py-2 border-b overflow-x-auto scroll-quiet"
      style={{ borderColor: "var(--color-exam-border)" }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          move(1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          move(-1);
        } else if (e.key === "Home") {
          e.preventDefault();
          onSelect(tabs[0].key);
          refs.current.get(tabs[0].key)?.focus();
        } else if (e.key === "End") {
          e.preventDefault();
          const last = tabs[tabs.length - 1];
          onSelect(last.key);
          refs.current.get(last.key)?.focus();
        }
      }}
    >
      {tabs.map((t) => {
        const selected = t.key === active;
        return (
          <button
            key={t.key}
            ref={(el) => {
              if (el) refs.current.set(t.key, el);
              else refs.current.delete(t.key);
            }}
            role="tab"
            id={`${idBase}-tab-${t.key}`}
            aria-selected={selected}
            aria-controls={panelId(idBase)}
            tabIndex={selected ? 0 : -1}
            className="tab-pill"
            onClick={() => onSelect(t.key)}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- tiny pure id helper that must stay in lockstep with the tab ids above
export function panelId(idBase: string): string {
  return `${idBase}-panel`;
}
