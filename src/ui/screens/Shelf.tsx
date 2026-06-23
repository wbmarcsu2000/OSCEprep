import { useMemo, useState, type ReactNode } from "react";
import { SHELF_CONDITIONS, SHELF_DRUGS, type ShelfCondition, type ShelfDrug } from "../../data/shelf";
import { Segmented } from "../components/Segmented";
import { useAppStore } from "../store";

/**
 * Shelf Study — condition-based, think-first study cards for the IM shelf,
 * built one organ system at a time. Each card shows the presentation up front
 * and reveals key identification, diagnosis (best initial / most accurate),
 * first-line treatment, risk factors, and the drugs' key side effects on
 * demand. A second view holds the cross-system drug side-effect appendix.
 */

const SYSTEMS = Array.from(new Set(SHELF_CONDITIONS.map((c) => c.system)));

/** A single revealable field row (click the row to toggle). */
function FieldRow({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border" style={{ borderColor: "var(--color-exam-border)" }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="panel-label">{label}</span>
        <span className="text-[12px] font-semibold" style={{ color: "var(--color-exam-muted)" }}>
          {open ? "🙈 hide" : "👁 reveal"}
        </span>
      </button>
      {open && <div className="px-3 pb-2.5 text-[13px] leading-relaxed pop-in">{children}</div>}
    </div>
  );
}

function ConditionCard({ c }: { c: ShelfCondition }) {
  const fields = useMemo(() => {
    const f: { key: string; label: string; content: ReactNode }[] = [
      { key: "keyId", label: "Key identification", content: c.keyId },
    ];
    if (c.dxBestInitial || c.dxMostAccurate) {
      f.push({
        key: "dx",
        label: "Diagnosis",
        content: (
          <div className="space-y-0.5">
            {c.dxBestInitial && (
              <div>
                <span className="font-semibold">Best initial:</span> {c.dxBestInitial}
              </div>
            )}
            {c.dxMostAccurate && (
              <div>
                <span className="font-semibold">Most accurate:</span> {c.dxMostAccurate}
              </div>
            )}
          </div>
        ),
      });
    }
    if (c.treatment) f.push({ key: "tx", label: "First-line treatment", content: c.treatment });
    f.push({ key: "rf", label: "Risk factors", content: c.riskFactors.join("  ·  ") });
    if (c.drugSideEffects?.length) {
      f.push({
        key: "se",
        label: "Key drug side effects",
        content: (
          <ul className="space-y-1">
            {c.drugSideEffects.map((d, i) => (
              <li key={i}>
                <span className="font-semibold">{d.drug}:</span> {d.effects}
              </li>
            ))}
          </ul>
        ),
      });
    }
    return f;
  }, [c]);

  const [open, setOpen] = useState<Set<string>>(new Set());
  const allOpen = open.size === fields.length;
  const toggle = (k: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  const toggleAll = () => setOpen(allOpen ? new Set() : new Set(fields.map((f) => f.key)));

  return (
    <div className="card p-4 space-y-2.5 pop-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <h3 className="text-[16px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
          {c.name}
        </h3>
        <button type="button" onClick={toggleAll} className="btn btn-ghost py-0.5 px-2.5 text-[12px]">
          {allOpen ? "🙈 Hide all" : "👁 Reveal all"}
        </button>
      </div>
      <div>
        <div className="panel-label mb-0.5">Presentation</div>
        <p className="text-[13px] leading-relaxed">{c.presentation}</p>
      </div>
      <div className="space-y-1.5">
        {fields.map((f) => (
          <FieldRow key={f.key} label={f.label} open={open.has(f.key)} onToggle={() => toggle(f.key)}>
            {f.content}
          </FieldRow>
        ))}
      </div>
      {c.pearl && (
        <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
          💡 {c.pearl}
        </p>
      )}
    </div>
  );
}

function DrugRow({ d }: { d: ShelfDrug }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-exam-border)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 text-left"
      >
        <span className="font-bold text-[13.5px]">
          {d.drug} <span className="font-normal" style={{ color: "var(--color-exam-muted)" }}>· {d.klass}</span>
        </span>
        <span className="text-[12px] font-semibold shrink-0" style={{ color: "var(--color-exam-muted)" }}>
          {open ? "🙈 hide" : "👁 reveal"}
        </span>
      </button>
      {open && <p className="mt-1.5 text-[13px] leading-relaxed pop-in">{d.effects}</p>}
    </div>
  );
}

export function Shelf() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const [mode, setMode] = useState<"conditions" | "drugs">("conditions");
  const [system, setSystem] = useState("All");

  const shown = system === "All" ? SHELF_CONDITIONS : SHELF_CONDITIONS.filter((c) => c.system === system);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <span className="icon-tile" style={{ background: "var(--grad-teal)" }} aria-hidden="true">
            📕
          </span>
          <div className="space-y-0.5">
            <div className="panel-label">Shelf exam</div>
            <h2 className="text-[24px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
              Shelf Study
            </h2>
            <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
              Think-first cards for IM shelf conditions — presentation up front; reveal the key ID, diagnosis,
              treatment, risk factors, and drug side effects. Built one system at a time.
            </p>
          </div>
        </div>
        <button className="btn btn-ghost shrink-0" onClick={exitToSelect}>
          Case list →
        </button>
      </div>

      <div
        className="card px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-3 lg:sticky lg:top-2 z-10"
        style={{ background: "var(--color-exam-panel)" }}
      >
        <Segmented
          label="View"
          options={[
            { value: "conditions", label: "Conditions" },
            { value: "drugs", label: "Drug side effects" },
          ]}
          value={mode}
          onChange={(v) => setMode(v)}
        />
        {mode === "conditions" && (
          <>
            <label className="text-sm flex items-center gap-2">
              <span className="panel-label">System</span>
              <select
                className="input text-[13px] py-1.5"
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                aria-label="System"
              >
                <option>All</option>
                {SYSTEMS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <span className="text-[13px] font-semibold ml-auto" style={{ color: "var(--color-exam-muted)" }}>
              {shown.length} condition{shown.length === 1 ? "" : "s"}
            </span>
          </>
        )}
      </div>

      {mode === "conditions" ? (
        shown.map((c) => <ConditionCard key={c.id} c={c} />)
      ) : (
        <div className="card p-4 space-y-2">
          <div className="panel-label">💊 High-yield drug side effects</div>
          <p className="hint">The pharmacology the shelf tests directly — reveal each. Grows as more systems are added.</p>
          <div className="space-y-1.5">
            {SHELF_DRUGS.map((d) => (
              <DrugRow key={d.drug} d={d} />
            ))}
          </div>
        </div>
      )}

      <p className="hint text-center">
        Educational reference only — confirm dosing and current guidelines. More systems coming.
      </p>
    </div>
  );
}
