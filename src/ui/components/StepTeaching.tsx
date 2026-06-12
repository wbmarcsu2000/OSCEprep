import { CURRICULUM_BY_CATEGORY } from "../../data/curriculum";
import { CHALK_TALKS_BY_CATEGORY } from "../../data/teachim";
import { mghPdfUrl } from "../../data/mghManual";

/**
 * The teaching interstitial shown between Practice-mode steps, after a step is
 * revealed. Draws on the same framework/management resources as the
 * end-of-station teaching (curriculum + TeachIM chalk talks + MGH manual), but
 * focused to what matters at THIS point in the reasoning flow.
 */
export function StepTeaching({ category, stepId }: { category: string; stepId: string }) {
  const c = CURRICULUM_BY_CATEGORY.get(category);
  if (!c) return null;
  const chalk = CHALK_TALKS_BY_CATEGORY[category] ?? [];

  // What to teach at each waypoint in the case flow.
  let heading: string;
  let body: React.ReactNode;

  if (stepId === "differential") {
    heading = "💡 Framework — how to structure this complaint";
    body = (
      <div className="space-y-2">
        <p>
          <span className="font-bold">Schema:</span> {c.framework}
        </p>
        <p style={{ color: "var(--color-exam-muted)" }}>{c.strategy}</p>
        {c.cantMiss.length > 0 && (
          <p className="text-[12.5px]">
            <span className="font-bold" style={{ color: "var(--color-exam-danger)" }}>Can't-miss to exclude: </span>
            {c.cantMiss.join(" · ")}
          </p>
        )}
      </div>
    );
  } else if (stepId === "workup") {
    heading = "💡 Building the work-up";
    const labs = c.workupMenu.labs.slice(0, 5);
    const imaging = c.workupMenu.imaging.slice(0, 4);
    body = (
      <div className="space-y-1.5 text-[12.5px]">
        <p style={{ color: "var(--color-exam-muted)" }}>
          Order by what changes management, not reflex. Standard menu for this complaint:
        </p>
        {labs.length > 0 && (
          <p><span className="font-bold">Labs:</span> {labs.map((l) => l.test).join(" · ")}</p>
        )}
        {imaging.length > 0 && (
          <p><span className="font-bold">Imaging/other:</span> {imaging.map((i) => i.test).join(" · ")}</p>
        )}
      </div>
    );
  } else if (stepId === "revised") {
    heading = "💡 Narrowing to the diagnosis";
    body = (
      <div className="space-y-2 text-[13px]">
        <p style={{ color: "var(--color-exam-muted)" }}>
          Match the results to your leading diagnosis: which findings confirm it, and which of the
          must-not-miss alternatives can you now safely drop?
        </p>
        {c.cantMiss.length > 0 && (
          <p>
            <span className="font-bold" style={{ color: "var(--color-exam-danger)" }}>
              Before you commit, be sure you've excluded:{" "}
            </span>
            {c.cantMiss.join(" · ")}
          </p>
        )}
      </div>
    );
  } else if (stepId === "management") {
    heading = "💡 Management";
    const pearls = c.quickManagement.slice(0, 4);
    const mref = c.manual[0];
    // Category chalk talks are management/treatment-oriented — surface one here.
    const ct = chalk[0];
    body = (
      <div className="space-y-2 text-[12.5px]">
        {pearls.length > 0 && (
          <ul className="space-y-1">
            {pearls.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden style={{ color: "var(--color-pop-teal)" }}>•</span>
                <span>
                  <span className="font-bold">{p.scenario}:</span> {p.plan}
                  {p.manualPage && (
                    <>
                      {" "}
                      <a className="underline underline-offset-2" style={{ color: "var(--color-exam-accent)" }} href={mghPdfUrl(p.manualPage)} target="_blank" rel="noopener noreferrer">
                        MGH p.&nbsp;{p.manualPage} ↗
                      </a>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
        {mref && (
          <a className="font-semibold underline underline-offset-2 block" style={{ color: "var(--color-exam-accent)" }} href={mghPdfUrl(mref.page)} target="_blank" rel="noopener noreferrer">
            📖 {mref.section} — MGH p.&nbsp;{mref.page} ↗
          </a>
        )}
        {ct && (
          <div className="pt-1 mt-1 border-t" style={{ borderColor: "var(--color-pop-teal)" }}>
            <p className="font-bold mb-0.5">{ct.title}</p>
            <ul className="space-y-1">
              {ct.points.slice(0, 4).map((pt, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden style={{ color: "var(--color-pop-teal)" }}>•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
            <a className="font-semibold underline underline-offset-2" style={{ color: "#076a5b" }} href={ct.url} target="_blank" rel="noopener noreferrer">
              {ct.source} ↗
            </a>
          </div>
        )}
      </div>
    );
  } else {
    // read steps already render a systematic reading guide + expert read.
    return null;
  }

  return (
    <div
      className="rounded-xl border p-3.5 fade-up"
      style={{ borderColor: "var(--color-pop-teal-soft)", background: "var(--color-pop-teal-soft)" }}
    >
      <div className="panel-label mb-1.5" style={{ color: "#076a5b" }}>{heading}</div>
      <div className="text-[13px] leading-relaxed" style={{ color: "var(--color-exam-ink)" }}>
        {body}
      </div>
    </div>
  );
}
