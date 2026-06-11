import type { CreditedItem, ScoreReport, SectionResult } from "../../engine/types";
import { Scorecard } from "../components/Scorecard";
import { CategoryApproach } from "../components/CategoryApproach";
import { MANEUVER_BY_ID } from "../../engine/maneuvers";
import { itemMatches } from "../../engine/textMatch";
import { CURRICULUM_BY_CATEGORY } from "../../data/curriculum";
import { useAppStore } from "../store";

interface BreadthCoverage {
  title: string;
  groups: { group: string; items: { item: string; covered: boolean }[] }[];
}

/** For the differential / workup sections, the broad category framework with
 *  each item marked covered (named in the student's answer) or not. */
function breadthCoverage(
  category: string,
  section: SectionResult,
): BreadthCoverage | null {
  const c = CURRICULUM_BY_CATEGORY.get(category);
  if (!c) return null;
  const answer = section.studentAnswer;
  const mark = (item: string) => ({ item, covered: !!answer && itemMatches(answer, item) });
  if (section.sectionId === "differential" || section.sectionId === "revised") {
    return {
      title: "Full differential to consider",
      groups: c.differential.map((g) => ({ group: g.group, items: g.items.map(mark) })),
    };
  }
  if (section.sectionId === "workup") {
    return {
      title: "Broad work-up menu",
      groups: [
        { group: "Labs", items: c.workupMenu.labs.map((l) => mark(l.test)) },
        { group: "Imaging & other", items: c.workupMenu.imaging.map((i) => mark(i.test)) },
      ],
    };
  }
  return null;
}

function ItemRow({ item, sign }: { item: CreditedItem; sign: "+" | "−" | "·" }) {
  const color =
    sign === "+" ? "var(--color-exam-ok)" : sign === "−" ? "var(--color-exam-danger)" : "var(--color-exam-faint)";
  return (
    <li className="flex items-baseline gap-2.5 text-[13px] leading-relaxed">
      <span className="font-mono font-bold w-11 text-right shrink-0 tabular-nums" style={{ color }}>
        {sign === "·" ? `0/${item.points}` : `${sign}${Math.abs(item.points)}`}
      </span>
      <span>
        {item.kind === "critical" && <span className="chip chip-danger mr-1.5">critical</span>}
        {item.item}
        <span className="ml-1.5 text-[11.5px]" style={{ color: "var(--color-exam-faint)" }}>
          {item.evidence}
        </span>
      </span>
    </li>
  );
}

function SectionDetail({
  section,
  coaching,
  breadth,
}: {
  section: SectionResult;
  coaching?: string;
  breadth?: BreadthCoverage | null;
}) {
  const pct = section.maxPoints > 0 ? section.earned / section.maxPoints : 0;
  return (
    <details className="card overflow-hidden">
      <summary className="card-header hover:bg-[#fafbfd] transition-colors" style={{ borderBottom: "none" }}>
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="text-[10px]" style={{ color: "var(--color-exam-faint)" }}>▶</span>
          <span className="text-[13.5px] font-semibold">{section.label}</span>
        </span>
        <span
          className="font-mono text-[13px] font-bold tabular-nums px-2 py-0.5 rounded-md"
          style={{
            color: pct >= 0.7 ? "var(--color-exam-ok)" : pct >= 0.4 ? "var(--color-exam-warn)" : "var(--color-exam-danger)",
            background: pct >= 0.7 ? "var(--color-exam-ok-soft)" : pct >= 0.4 ? "var(--color-exam-warn-soft)" : "var(--color-exam-danger-soft)",
          }}
        >
          {section.earned} / {section.maxPoints}
        </span>
      </summary>
      <div className="px-4 pb-4 pt-1 space-y-4 text-sm border-t" style={{ borderColor: "var(--color-exam-border)" }}>
        {section.studentAnswer && (
          <div className="pt-3">
            <div className="panel-label mb-1.5">Your answer</div>
            <p
              className="rounded-lg border p-3 text-[13px] whitespace-pre-wrap leading-relaxed"
              style={{ borderColor: "var(--color-exam-border)", background: "#fafbfd" }}
            >
              {section.studentAnswer}
            </p>
          </div>
        )}
        {section.idealAnswer && (
          <div>
            <div className="panel-label mb-1.5">Ideal answer</div>
            <p
              className="rounded-lg border p-3 text-[13px] leading-relaxed"
              style={{ borderColor: "#cfe9db", background: "var(--color-exam-ok-soft)" }}
            >
              {section.idealAnswer}
            </p>
          </div>
        )}
        {breadth && (
          <div>
            <div className="panel-label mb-2">
              {breadth.title}
              <span className="hint ml-2">✓ = you named it</span>
            </div>
            <div className="space-y-1.5">
              {breadth.groups.map((g) => (
                <div key={g.group} className="text-[13px] leading-relaxed">
                  <span className="font-semibold">{g.group}: </span>
                  {g.items.map((it, i) => (
                    <span key={i}>
                      <span
                        style={{
                          color: it.covered ? "var(--color-exam-ok)" : "var(--color-exam-muted)",
                          fontWeight: it.covered ? 600 : 400,
                        }}
                      >
                        {it.covered ? "✓ " : ""}
                        {it.item}
                      </span>
                      {i < g.items.length - 1 ? "  ·  " : ""}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        {coaching && (
          <div>
            <div className="panel-label mb-1.5" style={{ color: "var(--color-exam-accent-deep)" }}>
              Coach's note <span className="chip chip-accent ml-1">AI</span>
            </div>
            <p
              className="rounded-lg border p-3 text-[13px] leading-relaxed"
              style={{ borderColor: "#d3def7", background: "var(--color-exam-accent-soft)" }}
            >
              {coaching}
            </p>
          </div>
        )}
        {section.credited.length > 0 && (
          <div>
            <div className="panel-label mb-1.5">Credited</div>
            <ul className="space-y-1">
              {section.credited.map((c, i) => (
                <ItemRow key={i} item={c} sign="+" />
              ))}
            </ul>
          </div>
        )}
        {section.missed.length > 0 && (
          <div>
            <div className="panel-label mb-1.5">Missed scoring items</div>
            <ul className="space-y-1">
              {section.missed.map((c, i) => (
                <ItemRow key={i} item={c} sign="·" />
              ))}
            </ul>
          </div>
        )}
        {section.penaltiesApplied.length > 0 && (
          <div>
            <div className="panel-label mb-1.5">Penalties</div>
            <ul className="space-y-1">
              {section.penaltiesApplied.map((c, i) => (
                <ItemRow key={i} item={c} sign="−" />
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}

function MissList({ title, items, tone }: { title: string; items: string[]; tone?: "danger" }) {
  if (items.length === 0) return null;
  return (
    <div className="card p-4">
      <div
        className="panel-label mb-2"
        style={tone === "danger" ? { color: "var(--color-exam-danger)" } : undefined}
      >
        {title}
      </div>
      <ul className="space-y-1.5 text-[13px] leading-relaxed">
        {items.map((m, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden style={{ color: tone === "danger" ? "var(--color-exam-danger)" : "var(--color-exam-faint)" }}>
              •
            </span>
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface FeedbackData {
  title: string;
  diagnosis: string;
  category: string;
  report: ScoreReport;
  reasoningPathway?: string;
  coaching: Record<string, string>;
  isReview: boolean;
}

export function FeedbackView({ data }: { data: FeedbackData }) {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const showAnalytics = useAppStore((s) => s.showAnalytics);
  const { report } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-0.5">
          <div className="panel-label">{data.isReview ? "Case review" : "Station complete"}</div>
          <h2 className="text-[20px] font-bold tracking-tight">{data.title}</h2>
          <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
            Final diagnosis:{" "}
            <span className="font-semibold" style={{ color: "var(--color-exam-ink)" }}>
              {data.diagnosis}
            </span>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="btn" onClick={showAnalytics}>
            📊 Performance
          </button>
          <button className="btn btn-primary" onClick={exitToSelect}>
            Station list →
          </button>
        </div>
      </div>

      <Scorecard report={report} />

      {(report.criticalMisses.length > 0 || report.unsafeActions.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MissList title="Critical misses" items={report.criticalMisses} tone="danger" />
          <MissList title="Unsafe actions" items={report.unsafeActions} tone="danger" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <MissList
          title="History you never elicited"
          items={report.missedHistory.map(
            (m) => `${m.id.replace(/_/g, " ")} (${m.importance}) — e.g. "${m.concepts[0]}"`,
          )}
        />
        <MissList
          title="Exam maneuvers you skipped"
          items={report.missedManeuvers.map(
            (m) => `${MANEUVER_BY_ID.get(m.maneuverId)?.label ?? m.maneuverId} (${m.importance})`,
          )}
        />
        <MissList title="Missed differentials (must-not-miss)" items={report.missedDifferentials} tone="danger" />
        <MissList title="Missed workup elements" items={report.missedWorkup} />
        <MissList title="Missed interpretation findings" items={report.missedInterpretation} />
        <MissList title="Missed management actions" items={report.missedManagement} />
        <MissList
          title="Unnecessary maneuvers"
          items={report.unnecessaryManeuvers.map((id) => MANEUVER_BY_ID.get(id)?.label ?? id)}
        />
      </div>

      <div className="space-y-2 pt-1">
        <div className="panel-label px-1">Section-by-section grading</div>
        {report.sections.map((s) => (
          <SectionDetail
            key={s.sectionId}
            section={s}
            coaching={data.coaching[s.sectionId]}
            breadth={breadthCoverage(data.category, s)}
          />
        ))}
        {report.communication && <SectionDetail section={report.communication} />}
      </div>

      {(report.pearls.length > 0 || report.pitfalls.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MissList title="Teaching pearls" items={report.pearls} />
          <MissList title="Common pitfalls" items={report.pitfalls} />
        </div>
      )}

      {data.reasoningPathway && (
        <div className="card p-4">
          <div className="panel-label mb-1.5">Reasoning pathway for this case</div>
          <p className="text-[13px] leading-relaxed">{data.reasoningPathway}</p>
        </div>
      )}

      {/* End-of-station teaching: the transferable approach to this complaint. */}
      <div className="pt-3 mt-2 border-t" style={{ borderColor: "var(--color-exam-border)" }}>
        <CategoryApproach category={data.category} />
      </div>
    </div>
  );
}

export function Feedback() {
  const engine = useAppStore((s) => s.engine);
  const caseModel = useAppStore((s) => s.caseModel);
  const coaching = useAppStore((s) => s.coaching);
  if (!engine?.result || !caseModel) return null;
  return (
    <FeedbackView
      data={{
        title: caseModel.title,
        diagnosis: caseModel.diagnosis,
        category: caseModel.category,
        report: engine.result,
        reasoningPathway: caseModel.caseSummary.reasoningPathway,
        coaching,
        isReview: false,
      }}
    />
  );
}

export function ReviewScreen() {
  const review = useAppStore((s) => s.review);
  if (!review) return null;
  return (
    <FeedbackView
      data={{
        title: review.title,
        diagnosis: review.diagnosis,
        category: review.category,
        report: review.report,
        coaching: {},
        isReview: true,
      }}
    />
  );
}
