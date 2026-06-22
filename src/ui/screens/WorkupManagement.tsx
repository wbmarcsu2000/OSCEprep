import { useMemo, useState, type ReactNode } from "react";
import { CURRICULUM, type CategoryCurriculum } from "../../data/curriculum";
import { MANAGEMENT_DRILLS, type ManagementDrillProblem } from "../../data/managementDrills";
import { ManualRefs } from "../components/ManualRefs";
import { useAppStore } from "../store";

/**
 * Work-up & Management Atlas — a read-only reference that pairs, per complaint,
 * the work-up to order with the management of its key diagnoses. Each answer is
 * hidden behind a Reveal so the student commits to an approach before looking;
 * the study companion to Drills → Work-up and Drills → Management.
 */

/** Think-first wrapper: shows a "Reveal" affordance, then the content + Hide. */
function Reveal({ what, children }: { what: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-dashed px-3 py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2"
        style={{ borderColor: "var(--color-exam-border-strong)", color: "var(--color-exam-muted)" }}
        aria-label={`Reveal ${what}`}
      >
        👁 Reveal {what}
      </button>
    );
  }
  return (
    <div className="space-y-2 pop-in">
      {children}
      <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost py-0.5 px-2.5 text-[12px]">
        🙈 Hide
      </button>
    </div>
  );
}

function WorkupView({ menu }: { menu: CategoryCurriculum["workupMenu"] }) {
  return (
    <div className="space-y-2 text-[13px] leading-relaxed">
      <div>
        <div className="panel-label mb-1">Labs</div>
        <ul className="space-y-1">
          {menu.labs.map((l, i) => (
            <li key={i}>
              <span className="font-semibold">{l.test}</span>
              <span style={{ color: "var(--color-exam-muted)" }}> — {l.indication}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="panel-label mb-1">Imaging &amp; other</div>
        <ul className="space-y-1">
          {menu.imaging.map((m, i) => (
            <li key={i}>
              <span className="font-semibold">{m.test}</span>
              <span style={{ color: "var(--color-exam-muted)" }}> — {m.indication}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ManagementView({ p }: { p: ManagementDrillProblem }) {
  return (
    <div className="space-y-2">
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
      {p.manual.page > 0 && <ManualRefs manual={[p.manual]} compact />}
    </div>
  );
}

export function WorkupManagement() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
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

  const shown = cat === "All" ? CURRICULUM : CURRICULUM.filter((c) => c.category === cat);

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
              Work-up &amp; Management
            </h2>
            <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
              Per complaint, the work-up to order and the management of its key diagnoses — each hidden behind a Reveal
              so you can commit to an answer before looking.
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
        <label className="text-sm flex items-center gap-2">
          <span className="panel-label">Complaint</span>
          <select
            className="input text-[13px] py-1.5"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            aria-label="Complaint"
          >
            <option>All</option>
            {CURRICULUM.map((c) => (
              <option key={c.category}>{c.category}</option>
            ))}
          </select>
        </label>
        <span className="text-[13px] font-semibold ml-auto" style={{ color: "var(--color-exam-muted)" }}>
          {shown.length} complaint{shown.length === 1 ? "" : "s"}
        </span>
      </div>

      {shown.map((c) => {
        const mgmt = byCat.get(c.category) ?? [];
        return (
          <div key={c.category} className="card p-4 space-y-4 pop-in">
            <h3 className="text-[17px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
              {c.category}
            </h3>

            <div className="space-y-2">
              <div className="panel-label">🧪 Work-up</div>
              <p className="text-[13px]" style={{ color: "var(--color-exam-muted)" }}>
                What labs and imaging would you order for {c.category.toLowerCase()}?
              </p>
              <Reveal what="work-up">
                <WorkupView menu={c.workupMenu} />
              </Reveal>
            </div>

            <div className="space-y-2.5">
              <div className="panel-label">🩺 Management</div>
              {mgmt.map((p) => (
                <div
                  key={p.caseId}
                  className="rounded-xl border p-3 space-y-2"
                  style={{ borderColor: "var(--color-exam-border)" }}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="font-bold text-[14px]">{p.diagnosis}</div>
                    {p.disposition && <span className="chip">{p.disposition}</span>}
                  </div>
                  <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
                    {p.vignette}
                  </p>
                  <Reveal what="management">
                    <ManagementView p={p} />
                  </Reveal>
                </div>
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
