import { MGH_MANUAL, type ManualRef } from "../../data/curriculum";
import { mghPdfUrl } from "../../data/mghManual";

/**
 * Renders the MGH Housestaff Manual sections + pages a complaint draws on, so
 * the framework drills and the post-station teaching cite the same source as
 * each case's management feedback. Informational only.
 */
export function ManualRefs({ manual, compact }: { manual: ManualRef[]; compact?: boolean }) {
  if (!manual || manual.length === 0) return null;
  return (
    <div className={compact ? "" : "card p-4"}>
      <div className="panel-label mb-1.5">Manual reference</div>
      <div
        className="rounded-xl border p-3 text-[13px] leading-relaxed"
        style={{ borderColor: "var(--color-exam-border)", background: "var(--color-exam-soft)" }}
      >
        <span aria-hidden className="mr-1.5">📖</span>
        <span className="font-semibold">{MGH_MANUAL}</span>
        <ul className="mt-1.5 space-y-0.5">
          {manual.map((m, i) => (
            <li key={i} className="flex gap-2" style={{ color: "var(--color-exam-muted)" }}>
              <span aria-hidden style={{ color: "var(--color-exam-ghost)" }}>§</span>
              <span>
                {m.section} —{" "}
                <a
                  className="font-medium underline underline-offset-2"
                  style={{ color: "var(--color-exam-accent)" }}
                  href={mghPdfUrl(m.page)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open the manual PDF at page ${m.page}`}
                >
                  p.&nbsp;{m.page} ↗
                </a>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
