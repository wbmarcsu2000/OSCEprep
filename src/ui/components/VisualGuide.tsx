import { useState, type CSSProperties } from "react";
import { guideFor } from "../../data/visualGuides";
import type { CategoryVisualGuide, GuideDx } from "../../data/visualGuides/types";

type View = "differential" | "workup" | "management";

/** Collapsible, category-specific visual study guide shown inside a drill.
 *  Hand-authored SVG/CSS; one signature motif per category. */
export function VisualGuide({
  category,
  view,
  open: openInit = false,
}: {
  category: string;
  view: View;
  open?: boolean;
}) {
  const guide = guideFor(category);
  const [open, setOpen] = useState(openInit);
  if (!guide) return null;

  const accentVars = {
    "--vg-accent": guide.accent,
    "--vg-accent-soft": guide.accentSoft,
  } as CSSProperties;

  return (
    <div className="vg-card" style={accentVars}>
      <button className="vg-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="vg-toggle-icon">
          <guide.Icon />
        </span>
        <span className="vg-toggle-title">
          Visual guide
          <span className="vg-toggle-sub">
            {" "}
            · {guide.category} · {guide.tagline}
          </span>
        </span>
        <span className={`vg-chevron${open ? " open" : ""}`} aria-hidden>
          ▸
        </span>
      </button>
      {open && (
        <div className="vg-body pop-in">
          {view === "differential" && <DifferentialView guide={guide} />}
          {view === "workup" && <WorkupView guide={guide} />}
          {view === "management" && <ManagementView guide={guide} />}
        </div>
      )}
    </div>
  );
}

function Chip({ dx }: { dx: GuideDx }) {
  return (
    <span className={`vg-chip ${dx.severity}`}>
      {dx.severity === "must" ? "⚠ " : ""}
      {dx.label}
    </span>
  );
}

function DifferentialView({ guide }: { guide: CategoryVisualGuide }) {
  return (
    <div className="vg-ddx">
      <div className="vg-motif-wrap">
        <guide.Motif />
      </div>
      <div className="vg-legend">
        {guide.zones.map((z) => (
          <div className="vg-zone" key={z.n}>
            <div className="vg-znum" style={{ background: z.color }}>
              {z.n}
            </div>
            <div className="vg-zbody">
              <div className="vg-zname">{z.name}</div>
              <div className="vg-zchips">
                {z.dx.map((d, i) => (
                  <Chip key={i} dx={d} />
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="vg-key">
          <span>
            <span style={{ color: "#c0262c" }}>⚠ red</span> = must-not-miss
          </span>
          <span>
            <span style={{ color: "#9a5a06" }}>amber</span> = common / benign
          </span>
        </div>
      </div>
    </div>
  );
}

function WorkupView({ guide }: { guide: CategoryVisualGuide }) {
  const { nodes, branches } = guide.workup;
  return (
    <div className="vg-flow">
      <div className="vg-flow-nodes">
        {nodes.map((n, i) => (
          <span className="vg-node-wrap" key={i}>
            <span className="vg-fnode">{n}</span>
            {i < nodes.length - 1 && <span className="vg-plus">+</span>}
          </span>
        ))}
        <span className="vg-arrow">→</span>
      </div>
      <div className="vg-branches">
        {branches.map((b, i) => (
          <div className="vg-branch" key={i}>
            <span className="vg-btag">{b.tag}</span>
            <span className="vg-barrow">→</span>
            <span className="vg-bgo">{b.to}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagementView({ guide }: { guide: CategoryVisualGuide }) {
  return (
    <div className="vg-ladder">
      {guide.management.map((r) => (
        <div className="vg-rung" key={r.n}>
          <div className="vg-rnum" style={{ background: r.color }}>
            {r.n}
          </div>
          <div className="vg-rtext">
            <b>{r.title}</b> — {r.detail}
          </div>
        </div>
      ))}
    </div>
  );
}
