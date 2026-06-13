import { useMemo } from "react";
import type { CreditedItem, Mode, ScoreReport, SectionResult } from "../../engine/types";
import { Scorecard } from "../components/Scorecard";
import { Confetti } from "../components/Confetti";
import { CategoryApproach } from "../components/CategoryApproach";
import { MANEUVER_BY_ID } from "../../engine/maneuvers";
import { itemMatches } from "../../engine/textMatch";
import { cleanIdealAnswer } from "../format";
import { CURRICULUM_BY_CATEGORY } from "../../data/curriculum";
import { manifest } from "../../data/loader";
import { mghPdfUrl } from "../../data/mghManual";
import { TEACHIM_BY_CASE } from "../../data/teachim";
import { loadAttempts } from "../../analytics/store";
import { newlyEarnedBadges, streakDays, xpForAttempt, type Badge } from "../gamification";
import { useMountNow } from "../useMountNow";
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
  coachingPending,
  breadth,
}: {
  section: SectionResult;
  coaching?: string;
  /** AI coach notes still being written — show a placeholder where one is absent. */
  coachingPending?: boolean;
  breadth?: BreadthCoverage | null;
}) {
  const pct = section.maxPoints > 0 ? section.earned / section.maxPoints : 0;
  return (
    <details className="card overflow-hidden">
      <summary className="card-header hover:bg-[var(--color-exam-soft)] transition-colors" style={{ borderBottom: "none" }}>
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="caret text-[10px]" style={{ color: "var(--color-exam-ghost)" }}>▶</span>
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
              style={{ borderColor: "var(--color-exam-border)", background: "var(--color-exam-soft)" }}
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
              style={{ borderColor: "var(--color-exam-ok-line)", background: "var(--color-exam-ok-soft)" }}
            >
              {cleanIdealAnswer(section.idealAnswer)}
            </p>
          </div>
        )}
        {section.mghReference && (
          <div>
            <div className="panel-label mb-1.5">Reference</div>
            <div
              className="rounded-lg border p-3 text-[13px] leading-relaxed flex items-start gap-2"
              style={{ borderColor: "var(--color-exam-border)", background: "var(--color-exam-soft)" }}
            >
              <span aria-hidden>📖</span>
              <span>
                Management aligned to the{" "}
                <span className="font-semibold">{section.mghReference.manual}</span> —{" "}
                {section.mghReference.section},{" "}
                <a
                  className="font-semibold underline underline-offset-2"
                  style={{ color: "var(--color-exam-accent)" }}
                  href={mghPdfUrl(section.mghReference.page)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open the manual PDF at page ${section.mghReference.page}`}
                >
                  p.&nbsp;{section.mghReference.page} ↗
                </a>
                .
              </span>
            </div>
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
        {coaching ? (
          <div>
            <div className="panel-label mb-1.5" style={{ color: "var(--color-exam-accent-deep)" }}>
              Coach's note <span className="chip chip-accent ml-1">AI</span>
            </div>
            <p
              className="rounded-lg border p-3 text-[13px] leading-relaxed"
              style={{ borderColor: "var(--color-exam-accent-line)", background: "var(--color-exam-accent-soft)" }}
            >
              {coaching}
            </p>
          </div>
        ) : coachingPending ? (
          <p className="text-[12.5px] italic" style={{ color: "var(--color-exam-muted)" }}>
            Coach's note — writing…
          </p>
        ) : null}
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
            <span aria-hidden style={{ color: tone === "danger" ? "var(--color-exam-danger)" : "var(--color-exam-ghost)" }}>
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
  caseId: string;
  title: string;
  diagnosis: string;
  category: string;
  mode: Mode;
  report: ScoreReport;
  reasoningPathway?: string;
  coaching: Record<string, string>;
  isReview: boolean;
}

interface HeroTone {
  grad: string;
  /** Foreground for EVERY text node in the hero. White only on the deep-violet
   *  gradient; the light teal/sun/sky gradients take dark ink (WCAG body text). */
  fg: string;
  /** Pill background behind XP/streak/badge chips, tuned per gradient. */
  chipBg: string;
  emoji: string;
  headline: string;
  confetti: boolean;
}

/** Band-toned celebration: every score gets energy, only good scores get confetti. */
function heroToneFor(overall: number): HeroTone {
  if (overall >= 85)
    return { grad: "var(--grad-header)", fg: "#fff", chipBg: "rgba(255,255,255,0.2)", emoji: "🏆", headline: "Outstanding case!", confetti: true };
  if (overall >= 70)
    return { grad: "var(--grad-teal)", fg: "#073f37", chipBg: "rgba(255,255,255,0.45)", emoji: "🎉", headline: "Nice work!", confetti: true };
  if (overall >= 55)
    return { grad: "var(--grad-sun)", fg: "#4a2d00", chipBg: "rgba(255,255,255,0.45)", emoji: "💪", headline: "Solid effort — keep building", confetti: false };
  return { grad: "var(--grad-sky)", fg: "#0b2e55", chipBg: "rgba(255,255,255,0.45)", emoji: "🌱", headline: "Growth round — the misses below are the lesson", confetti: false };
}

function CelebrationHero({ data }: { data: FeedbackData }) {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const setView = useAppStore((s) => s.setView);
  const startCase = useAppStore((s) => s.startCase);
  const startRandomCase = useAppStore((s) => s.startRandomCase);
  const { report } = data;
  const tone = heroToneFor(report.overall);
  // Secondary buttons: translucent white pills with white text on the deep
  // gradient, frosted-white pills with dark ink on the light gradients.
  const secondaryBtn = {
    background: tone.fg === "#fff" ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.55)",
    color: tone.fg,
  };

  // The just-recorded attempt is the last one; derive XP/streak/badges from it.
  const now = useMountNow();
  const { xp, streak, fresh } = useMemo((): { xp: number; streak: number; fresh: Badge[] } => {
    const attempts = loadAttempts();
    return {
      xp: xpForAttempt({ overall: report.overall, criticalMissCount: report.criticalMisses.length }),
      streak: streakDays(attempts, now),
      fresh: newlyEarnedBadges(attempts, manifest.cases, now),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const randomNext = () => {
    const done = new Set(loadAttempts().map((a) => a.caseId));
    const unattempted = manifest.cases.filter((c) => !done.has(c.id)).map((c) => c.id);
    const pool = unattempted.length > 0 ? unattempted : manifest.cases.map((c) => c.id);
    void startRandomCase(data.mode, pool);
  };

  return (
    <div
      className="card relative overflow-hidden p-6 pop-in"
      style={{ background: tone.grad, border: "none", color: tone.fg }}
    >
      {tone.confetti && <Confetti />}
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="space-y-1 min-w-0">
          <div className="text-[12px] font-extrabold uppercase tracking-widest">
            OSCE case complete
          </div>
          <h2 className="text-[22px] font-extrabold tracking-tight leading-tight">
            {tone.emoji} {tone.headline}
          </h2>
          <p className="text-[13.5px]">
            {data.title} — final diagnosis: <span className="font-bold">{data.diagnosis}</span>
          </p>
          <div className="flex items-center gap-2 pt-1.5 flex-wrap">
            <span className="rounded-full px-3 py-1 text-[12.5px] font-extrabold" style={{ background: tone.chipBg }}>
              +{xp} XP
            </span>
            {streak > 0 && (
              <span className="rounded-full px-3 py-1 text-[12.5px] font-extrabold" style={{ background: tone.chipBg }}>
                <span className="flame inline-block" aria-hidden>🔥</span> day {streak}
              </span>
            )}
            {fresh.map((b) => (
              <span
                key={b.id}
                className="rounded-full px-3 py-1 text-[12.5px] font-extrabold pop-in"
                style={{ background: tone.chipBg }}
                title={b.desc}
              >
                {b.emoji} {b.name} unlocked!
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <button
            className="btn border-none"
            style={secondaryBtn}
            onClick={() => void startCase(data.caseId, data.mode)}
          >
            ↻ Retry
          </button>
          <button
            className="btn border-none"
            style={secondaryBtn}
            onClick={() => setView("analytics")}
          >
            📊 Performance
          </button>
          <button
            className="btn border-none"
            style={{ background: "#fff", color: "var(--color-exam-ink)" }}
            onClick={randomNext}
          >
            🎲 Next case →
          </button>
          <button
            className="btn border-none"
            style={secondaryBtn}
            onClick={exitToSelect}
          >
            Station list
          </button>
        </div>
      </div>
    </div>
  );
}

/** Score-band color for a single overall score (ok / warn / danger). */
function scoreBandColor(score: number): string {
  return score >= 70 ? "var(--color-exam-ok)" : score >= 55 ? "var(--color-exam-warn)" : "var(--color-exam-danger)";
}

export function FeedbackView({ data }: { data: FeedbackData }) {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const setView = useAppStore((s) => s.setView);
  const startCase = useAppStore((s) => s.startCase);
  const preferredMode = useAppStore((s) => s.preferredMode);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const coachingPending = useAppStore((s) => s.coachingPending);
  const { report } = data;

  // Review header context: every recorded score for this station, oldest first.
  const attemptScores = useMemo(
    () =>
      data.isReview
        ? loadAttempts()
            .filter((a) => a.caseId === data.caseId)
            .map((a) => a.overall)
        : [],
    [data.isReview, data.caseId],
  );

  const coachWriting = llmEnabled && coachingPending;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      {data.isReview ? (
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="space-y-0.5">
            <div className="panel-label">Case review</div>
            <h2 className="text-[20px] font-extrabold tracking-tight">{data.title}</h2>
            <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
              Final diagnosis:{" "}
              <span className="font-semibold" style={{ color: "var(--color-exam-ink)" }}>
                {data.diagnosis}
              </span>
            </p>
            {attemptScores.length > 0 && (
              <p className="text-[13px] font-bold tabular-nums pt-0.5" style={{ color: "var(--color-exam-muted)" }}>
                Attempt {attemptScores.length} ·{" "}
                {attemptScores.map((score, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <span aria-hidden style={{ color: "var(--color-exam-ghost)" }}>
                        {" → "}
                      </span>
                    )}
                    <span style={i === attemptScores.length - 1 ? { color: scoreBandColor(score) } : undefined}>
                      {score}
                    </span>
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap">
            <button className="btn" onClick={() => setView("analytics")}>
              📊 Performance
            </button>
            <button className="btn" onClick={exitToSelect}>
              Case list →
            </button>
            <button className="btn btn-primary" onClick={() => void startCase(data.caseId, preferredMode)}>
              ↻ Retry case
            </button>
          </div>
        </div>
      ) : (
        <CelebrationHero data={data} />
      )}

      <Scorecard report={report} animate={!data.isReview} />

      {coachWriting && (
        <div
          className="card flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold"
          aria-live="polite"
          style={{
            background: "var(--color-exam-accent-soft)",
            borderColor: "var(--color-exam-accent-line)",
            color: "var(--color-exam-accent-deep)",
          }}
        >
          <span aria-hidden>🤖</span>
          AI coach is writing section notes…
        </div>
      )}

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
            coachingPending={coachWriting}
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

      {/* Per-case TeachIM deep-dive for this specific diagnosis. */}
      {TEACHIM_BY_CASE[data.caseId] && (
        <a
          className="card card-pop p-4 flex items-center gap-3 no-underline"
          href={TEACHIM_BY_CASE[data.caseId].url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon-tile h-9 w-9 text-base" style={{ background: "var(--grad-teal)" }} aria-hidden>📖</span>
          <span className="min-w-0">
            <span className="panel-label" style={{ color: "#076a5b" }}>Go deeper — TeachIM chalk talk</span>
            <span className="block text-[14px] font-bold" style={{ color: "var(--color-exam-ink)" }}>
              {TEACHIM_BY_CASE[data.caseId].title} ↗
            </span>
            <span className="hint">Free open-access teaching on this diagnosis (teachim.org)</span>
          </span>
        </a>
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
        caseId: caseModel.id,
        title: caseModel.title,
        diagnosis: caseModel.diagnosis,
        category: caseModel.category,
        mode: engine.mode,
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
        caseId: review.caseId,
        title: review.title,
        diagnosis: review.diagnosis,
        category: review.category,
        mode: "PRACTICE",
        report: review.report,
        coaching: review.coaching ?? {},
        isReview: true,
      }}
    />
  );
}
