import { useMemo, useState } from "react";
import {
  MANAGEMENT_DRILLS,
  MANAGEMENT_DRILL_CATEGORIES,
  type ManagementDrillProblem,
} from "../../data/managementDrills";
import { Segmented } from "../components/Segmented";
import { ManualRefs } from "../components/ManualRefs";
import { useAppStore } from "../store";

/**
 * Management Atlas — a read-only reference that lists the management for the
 * managed diagnoses behind each complaint: the key actions, what to avoid,
 * disposition, consults, and a model plan. A Brief ⟷ Full toggle expands from
 * the action checklist to the full plan. The study companion to Drills →
 * Management (no grading), mirroring the Differential Atlas.
 */

function ManagementBlock({ p, full }: { p: ManagementDrillProblem; full: boolean }) {
  return (
    <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: "var(--color-exam-border)" }}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="font-bold text-[14px]">{p.diagnosis}</div>
        {p.disposition && <span className="chip">{p.disposition}</span>}
      </div>
      <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
        {p.vignette}
      </p>
      <div>
        <div className="panel-label mb-1">Management</div>
        <ul className="space-y-1 text-[13px] leading-relaxed">
          {p.actions.map((a, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden style={{ color: "var(--color-exam-ok)" }}>
                ✓
              </span>
              {a}
            </li>
          ))}
        </ul>
      </div>
      {p.unsafe.length > 0 && (
        <div>
          <div className="panel-label mb-1" style={{ color: "var(--color-exam-danger)" }}>
            Avoid
          </div>
          <ul className="space-y-1 text-[13px] leading-relaxed">
            {p.unsafe.map((u, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden style={{ color: "var(--color-exam-danger)" }}>
                  ✕
                </span>
                {u}
              </li>
            ))}
          </ul>
        </div>
      )}
      {full && (
        <>
          <div>
            <div className="panel-label mb-1">Model plan</div>
            <p
              className="rounded-lg border p-2.5 text-[13px] leading-relaxed"
              style={{ borderColor: "var(--color-exam-ok-line)", background: "var(--color-exam-ok-soft)" }}
            >
              {p.idealAnswer}
            </p>
          </div>
          {p.consults.length > 0 && (
            <p className="text-[12.5px]" style={{ color: "var(--color-exam-muted)" }}>
              <span className="font-semibold">Consults:</span> {p.consults.join(", ")}
            </p>
          )}
        </>
      )}
      {p.manual.page > 0 && <ManualRefs manual={[p.manual]} compact />}
    </div>
  );
}

export function Management() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const [full, setFull] = useState(false);
  const [cat, setCat] = useState("All");

  const byCat = useMemo(() => {
    const m = new Map<string, ManagementDrillProblem[]>();
    for (const p of MANAGEMENT_DRILLS) {
      const list = m.get(p.category);
      if (list) list.push(p);
      else m.set(p.category, [p]);
    }
    return m;
  }, []);

  const cats = cat === "All" ? MANAGEMENT_DRILL_CATEGORIES : [cat];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <span className="icon-tile" style={{ background: "var(--grad-teal)" }} aria-hidden="true">
            🩺
          </span>
          <div className="space-y-0.5">
            <div className="panel-label">Reference</div>
            <h2 className="text-[24px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
              Management Atlas
            </h2>
            <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
              Management for the key managed diagnoses behind each complaint — actions, what to avoid, disposition, and
              a model plan, with a Brief ⟷ Full toggle. A study reference — drill them in Drills → Management.
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
          label="Detail level"
          options={[
            { value: "brief", label: "Checklist" },
            { value: "full", label: "Full plan" },
          ]}
          value={full ? "full" : "brief"}
          onChange={(v) => setFull(v === "full")}
        />
        <label className="text-sm flex items-center gap-2">
          <span className="panel-label">Complaint</span>
          <select
            className="input text-[13px] py-1.5"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            aria-label="Complaint"
          >
            <option>All</option>
            {MANAGEMENT_DRILL_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <span className="text-[13px] font-semibold ml-auto" style={{ color: "var(--color-exam-muted)" }}>
          {cats.reduce((n, c) => n + (byCat.get(c)?.length ?? 0), 0)} scenarios
        </span>
      </div>

      {cats.map((c) => {
        const items = byCat.get(c) ?? [];
        return (
          <div key={c} className="card p-4 space-y-3 pop-in">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="text-[17px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
                {c}
              </h3>
              <span className="chip">
                {items.length} scenario{items.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="space-y-2.5">
              {items.map((p) => (
                <ManagementBlock key={p.caseId} p={p} full={full} />
              ))}
            </div>
          </div>
        );
      })}

      <p className="hint text-center">
        For medical education only — confirm dosing and local protocols before acting.
      </p>
    </div>
  );
}
