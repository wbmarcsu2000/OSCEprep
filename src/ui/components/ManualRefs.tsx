import { MGH_MANUAL, type ManualRef } from "../../data/curriculum";

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
        className="rounded-lg border p-3 text-[13px] leading-relaxed"
        style={{ borderColor: "var(--color-exam-border)", background: "#fafbfd" }}
      >
        <span aria-hidden className="mr-1.5">📖</span>
        <span className="font-semibold">{MGH_MANUAL}</span>
        <ul className="mt-1.5 space-y-0.5">
          {manual.map((m, i) => (
            <li key={i} className="flex gap-2" style={{ color: "var(--color-exam-muted)" }}>
              <span aria-hidden style={{ color: "var(--color-exam-faint)" }}>§</span>
              <span>
                {m.section} — <span className="font-medium">p.&nbsp;{m.page}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
