import { useMemo, useState } from "react";
import { MANEUVERS, EXAM_SYSTEMS } from "../../engine/maneuvers";
import { useAppStore } from "../store";

/** Exact-maneuver physical exam: searchable, grouped by system. The signature
 *  interaction — no broad organ-system buttons. */
export function ExamManeuverPanel() {
  const performed = useAppStore((s) => s.engine?.examManeuversPerformed ?? []);
  const locked = useAppStore((s) => s.engine?.patientLocked ?? false);
  const performManeuver = useAppStore((s) => s.performManeuver);
  const [query, setQuery] = useState("");
  const [openSystem, setOpenSystem] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return MANEUVERS.filter(
      (m) => m.label.toLowerCase().includes(q) || m.system.toLowerCase().includes(q),
    );
  }, [query]);

  const renderManeuver = (m: (typeof MANEUVERS)[number]) => {
    const done = performed.includes(m.id);
    return (
      <button
        key={m.id}
        className="w-full text-left px-3.5 py-2 text-[13.5px] flex items-center justify-between gap-2 transition-colors hover:bg-[#f4f7fb] disabled:opacity-50 group"
        disabled={locked}
        onClick={() => performManeuver(m.id)}
      >
        <span style={{ color: done ? "var(--color-exam-muted)" : "var(--color-exam-ink)" }}>
          {m.label}
        </span>
        {done ? (
          <span className="text-[12px] font-bold shrink-0" style={{ color: "var(--color-exam-ok)" }}>
            ✓
          </span>
        ) : (
          <span
            className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            style={{ color: "var(--color-exam-accent)" }}
          >
            perform →
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="px-3 pt-3 pb-2">
        <input
          className="input w-full text-[13px]"
          placeholder="Search 58 maneuvers — Murphy, JVP, egophony…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search exam maneuvers"
        />
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 scroll-quiet pb-2">
        {filtered ? (
          filtered.length > 0 ? (
            filtered.map(renderManeuver)
          ) : (
            <p className="p-4 text-sm italic" style={{ color: "var(--color-exam-faint)" }}>
              No maneuver matches “{query}”.
            </p>
          )
        ) : (
          EXAM_SYSTEMS.map((system) => {
            const group = MANEUVERS.filter((m) => m.system === system);
            const open = openSystem === system;
            const doneCount = group.filter((m) => performed.includes(m.id)).length;
            return (
              <div key={system}>
                <button
                  className="w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors hover:bg-[#f4f7fb]"
                  onClick={() => setOpenSystem(open ? null : system)}
                  aria-expanded={open}
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="text-[10px] transition-transform"
                      style={{
                        color: "var(--color-exam-faint)",
                        transform: open ? "rotate(90deg)" : "none",
                        display: "inline-block",
                      }}
                    >
                      ▶
                    </span>
                    <span className="text-[13px] font-semibold">{system}</span>
                  </span>
                  <span
                    className="text-[11.5px] font-mono tabular-nums"
                    style={{ color: doneCount > 0 ? "var(--color-exam-ok)" : "var(--color-exam-faint)" }}
                  >
                    {doneCount}/{group.length}
                  </span>
                </button>
                {open && (
                  <div
                    className="ml-3 border-l"
                    style={{ borderColor: "var(--color-exam-border)" }}
                  >
                    {group.map(renderManeuver)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
