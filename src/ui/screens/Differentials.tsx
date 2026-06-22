import { useState } from "react";
import { CURRICULUM, type CategoryCurriculum } from "../../data/curriculum";
import { Segmented } from "../components/Segmented";
import { ManualRefs } from "../components/ManualRefs";
import { useAppStore } from "../store";

/**
 * Differential Atlas — a read-only reference that lists the differential for
 * every complaint, with a Core ⟷ Advanced toggle (Advanced is the broadened
 * superset used by the Differential drill's Advanced mode). No grading; this is
 * the study/cheat-sheet companion to Drills → Differential.
 */

function countCauses(groups: { items: string[] }[]): number {
  return groups.reduce((n, g) => n + g.items.length, 0);
}

function CategoryCard({ category, advanced }: { category: CategoryCurriculum; advanced: boolean }) {
  const diff = advanced ? category.differentialAdvanced ?? category.differential : category.differential;
  const n = countCauses(diff);
  return (
    <div className="card p-4 space-y-3 pop-in">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-[17px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
          {category.category}
        </h3>
        <span className={`chip ${advanced ? "chip-accent" : ""}`}>
          {advanced ? "Advanced" : "Core"} · {n} causes
        </span>
      </div>
      <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
        {category.framework}
      </p>
      {category.cantMiss.length > 0 && (
        <p className="text-[12.5px] leading-relaxed">
          <span className="font-bold" style={{ color: "var(--color-exam-danger)" }}>
            Can't miss:{" "}
          </span>
          <span style={{ color: "var(--color-exam-muted)" }}>{category.cantMiss.join("  ·  ")}</span>
        </p>
      )}
      <div className="space-y-2">
        {diff.map((g) => (
          <div key={g.group} className="text-[13px] leading-relaxed">
            <span className="panel-label">{g.group}</span>
            <p className="mt-0.5">{g.items.join("  ·  ")}</p>
          </div>
        ))}
      </div>
      {category.manual.length > 0 && <ManualRefs manual={category.manual} compact />}
    </div>
  );
}

export function Differentials() {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const [advanced, setAdvanced] = useState(false);
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? CURRICULUM : CURRICULUM.filter((c) => c.category === cat);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <span className="icon-tile" style={{ background: "var(--grad-teal)" }} aria-hidden="true">
            📚
          </span>
          <div className="space-y-0.5">
            <div className="panel-label">Reference</div>
            <h2 className="text-[24px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
              Differential Atlas
            </h2>
            <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
              The differential for every complaint, organized by buckets, with a Core ⟷ Advanced toggle. A quick study
              reference — drill them in Drills → Differential.
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
          label="Differential depth"
          options={[
            { value: "core", label: "Core" },
            { value: "advanced", label: "Advanced" },
          ]}
          value={advanced ? "advanced" : "core"}
          onChange={(v) => setAdvanced(v === "advanced")}
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
            {CURRICULUM.map((c) => (
              <option key={c.category}>{c.category}</option>
            ))}
          </select>
        </label>
        <span className="text-[13px] font-semibold ml-auto" style={{ color: "var(--color-exam-muted)" }}>
          {shown.length} complaint{shown.length === 1 ? "" : "s"}
        </span>
      </div>

      {shown.map((c) => (
        <CategoryCard key={c.category} category={c} advanced={advanced} />
      ))}

      <p className="hint text-center">
        Advanced is a strict superset of Core — the broadened list adds high-yield, can't-miss, and uncommon causes.
      </p>
    </div>
  );
}
