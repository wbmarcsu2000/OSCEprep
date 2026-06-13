import { useState } from "react";
import type { CaseModel, StepModel } from "../../engine/types";
import { ChartSummary } from "../components/ChartSummary";
import { Scratchpad } from "../components/Scratchpad";
import { StudyImage, LabResults } from "../components/DiagnosticReader";
import { StepTeaching } from "../components/StepTeaching";
import { RailTabs, panelId } from "../components/RailTabs";
import { readingGuideFor } from "../../data/readingGuides";
import { selfChecked } from "../../engine/textMatch";
import { cleanIdealAnswer } from "../format";
import type { ProviderKind } from "../../llm/LlmAdapter";
import { useAppStore } from "../store";

type RailKey = "history" | "exam" | "chart" | "notes";

const RAIL_ID = "post-rail";

export function PostEncounter({ caseModel }: { caseModel: CaseModel }) {
  const engine = useAppStore((s) => s.engine)!;
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const providerKind = useAppStore((s) => s.providerKind);
  const aiStatus = useAppStore((s) => s.aiStatus);
  const aiDegraded = useAppStore((s) => s.aiDegraded);
  const grading = useAppStore((s) => s.grading);
  const timeExpired = useAppStore((s) => s.timeExpired);
  const saveStepAnswer = useAppStore((s) => s.saveStepAnswer);
  const commitWorkupStep = useAppStore((s) => s.commitWorkupStep);
  const submitStation = useAppStore((s) => s.submitStation);
  const [stepIdx, setStepIdx] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [tab, setTab] = useState<RailKey>("history");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const steps = caseModel.steps;
  const step = steps[stepIdx];
  const answer = engine.postEncounterAnswers[step.id] ?? "";
  const image = step.imageKey ? caseModel.images[step.imageKey] : null;
  const isLast = stepIdx === steps.length - 1;
  const isPractice = engine.mode === "PRACTICE";
  const timed = engine.phaseDeadline !== null;
  const answeredCount = steps.filter((s) => (engine.postEncounterAnswers[s.id] ?? "").trim()).length;
  const allAnswered = answeredCount === steps.length;

  const goto = (i: number) => {
    if (i < 0 || i >= steps.length || i > maxVisited + 1) return;
    setStepIdx(i);
    setMaxVisited((m) => Math.max(m, i));
  };

  const tabs: { key: RailKey; label: string }[] = [
    { key: "history", label: `History · ${engine.historyRevealed.length}` },
    { key: "exam", label: `Exam · ${engine.examFindingTexts.length}` },
    { key: "chart", label: "Chart" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <div className="lg:h-full grid grid-cols-1 lg:grid-cols-[minmax(300px,360px)_1.7fr] gap-4 p-3 sm:p-4 lg:min-h-0 max-w-[1440px] mx-auto w-full">
      {/* Left: preserved encounter record */}
      <div className="flex flex-col gap-3 h-[44dvh] min-h-[16rem] lg:h-auto lg:min-h-0">
        <div
          className="rounded-full border px-4 py-2 text-[12.5px] font-bold flex items-center gap-2"
          style={{ borderColor: "var(--color-exam-border)", background: "var(--color-exam-soft)", color: "var(--color-exam-ink)" }}
        >
          🔒 Patient locked — written work-up
        </div>
        <div className="card flex flex-col min-h-0 flex-1 overflow-hidden">
          <RailTabs tabs={tabs} active={tab} onSelect={setTab} label="Encounter record" idBase={RAIL_ID} />
          <div
            id={panelId(RAIL_ID)}
            role="tabpanel"
            aria-labelledby={`${RAIL_ID}-tab-${tab}`}
            className="flex-1 min-h-0 overflow-y-auto scroll-quiet"
          >
            {tab === "history" && (
              <ul className="p-4 space-y-2 text-[13px] leading-relaxed">
                {engine.historyRevealed.length === 0 && (
                  <li className="italic" style={{ color: "var(--color-exam-faint)" }}>No history was elicited.</li>
                )}
                {engine.historyRevealed.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden style={{ color: "var(--color-exam-accent)" }}>•</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
            {tab === "exam" && (
              <ul className="p-4 space-y-2 text-[13px] leading-relaxed">
                {engine.examFindingTexts.length === 0 && (
                  <li className="italic" style={{ color: "var(--color-exam-faint)" }}>No examination was performed.</li>
                )}
                {engine.examFindingTexts.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden style={{ color: "var(--color-exam-accent)" }}>•</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {tab === "chart" && <ChartSummary caseModel={caseModel} bare />}
            {tab === "notes" && <Scratchpad rows={12} bare />}
          </div>
        </div>
      </div>

      {/* Right: sequential steps */}
      {/* Block flow (not flex) so tall cards keep their natural height and the
          column scrolls — a flex column was collapsing the results card to 0. */}
      <div className="space-y-3 min-h-0 overflow-y-auto scroll-quiet pr-0.5">
        {/* Progress + AI status */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <nav aria-label="Post-encounter steps" className="flex gap-1.5 flex-wrap">
            {steps.map((s, i) => {
              const answered = (engine.postEncounterAnswers[s.id] ?? "").trim().length > 0;
              const active = i === stepIdx;
              return (
                <button
                  key={s.id}
                  className="px-3 py-1.5 text-[12.5px] font-semibold rounded-full border transition-all disabled:opacity-40"
                  style={{
                    borderColor: active ? "var(--color-exam-accent)" : "var(--color-exam-border-strong)",
                    background: active ? "var(--color-exam-accent)" : answered ? "var(--color-exam-accent-soft)" : "#fff",
                    color: active ? "#fff" : answered ? "var(--color-exam-accent-deep)" : "var(--color-exam-muted)",
                  }}
                  disabled={i > maxVisited + 1 || grading}
                  onClick={() => goto(i)}
                >
                  {answered && !active ? "✓ " : ""}
                  {i + 1} · {s.label}
                </button>
              );
            })}
          </nav>
          <AiChip llmEnabled={llmEnabled} providerKind={providerKind} aiStatus={aiStatus} aiDegraded={aiDegraded} />
        </div>
        {timed && (
          <p className="hint -mt-1">
            <span aria-hidden>⏱ </span>Submits automatically when the timer ends.
          </p>
        )}

        {/* Diagnostic results lead the review — once orders are committed this
            is the clearest at-a-glance view of what should have been worked up
            (✓ = a study the student named). Sits above the step card so it's
            front and center on entry. */}
        <LabResults caseModel={caseModel} />

        <div className="card p-5 space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[16px] font-bold">
              {step.label}
              <span className="ml-2 font-normal text-[12.5px]" style={{ color: "var(--color-exam-faint)" }}>
                step {stepIdx + 1} of {steps.length} · {step.max} pts
              </span>
            </h3>
            <span className="hint">autosaved</span>
          </div>
          <p className="text-[14.5px] font-medium leading-relaxed">{step.prompt}</p>

          {image && <StudyImage image={image} />}
          {step.imageKey && <ReadingGuide imageKey={step.imageKey} />}

          {(() => {
            // Once orders are committed and results released, the order sheet
            // is sealed — editing it after seeing results would be cheating.
            const ordersLocked = step.revealsDiagnostics && engine.labsRevealed;
            return (
              <>
                <textarea
                  className="input w-full resize-y leading-relaxed text-[14px]"
                  rows={image ? 5 : 7}
                  value={answer}
                  disabled={grading}
                  readOnly={ordersLocked}
                  style={ordersLocked ? { background: "var(--color-exam-soft)", cursor: "not-allowed" } : undefined}
                  onChange={(e) => saveStepAnswer(step.id, e.target.value)}
                  aria-label={`Answer for ${step.label}`}
                  placeholder={step.type === "read" ? "Describe what you see, then name the diagnosis…" : "Type your answer…"}
                />
                {ordersLocked && (
                  <p className="text-[12.5px] font-bold flex items-center gap-1.5" style={{ color: "var(--color-exam-muted)" }}>
                    <span aria-hidden>🔒</span> Orders committed — results released below. Check which
                    studies you named (and missed) on the results card.
                  </p>
                )}
              </>
            );
          })()}

          {step.revealsDiagnostics && !engine.labsRevealed && (
            <button
              className="btn btn-primary"
              disabled={!answer.trim() || grading}
              onClick={commitWorkupStep}
              title="Locks in your orders and releases results"
            >
              📋 Commit orders &amp; reveal results
            </button>
          )}

          {/* Action row. In Practice the step is a guided answer → reveal →
              learn loop: you reveal the model answer + teaching before moving
              on. In Strict the answers stay locked until final feedback. */}
          {(() => {
            const isWorkupStep = step.revealsDiagnostics;
            const stepRevealed = isWorkupStep ? engine.labsRevealed : !!revealed[step.id];
            const canAdvance = !isPractice || stepRevealed;
            return (
              <div className="flex justify-between items-center gap-3 pt-1 flex-wrap">
                <div className="flex gap-2 items-center">
                  <button className="btn btn-ghost" disabled={stepIdx === 0 || grading} onClick={() => goto(stepIdx - 1)}>
                    ← Previous
                  </button>
                  {isPractice ? (
                    isWorkupStep ? null : !stepRevealed ? (
                      <button
                        className="btn btn-primary"
                        disabled={grading}
                        onClick={() => setRevealed((r) => ({ ...r, [step.id]: true }))}
                        title="See the model answer and the teaching for this step"
                      >
                        ✨ Reveal answer &amp; teaching
                      </button>
                    ) : (
                      <button
                        className="btn btn-ghost text-[12.5px]"
                        disabled={grading}
                        onClick={() => setRevealed((r) => ({ ...r, [step.id]: false }))}
                      >
                        Hide
                      </button>
                    )
                  ) : (
                    <span className="chip" title="Strict OSCE: model answers are shown in feedback after you submit">
                      🔒 answers unlock in feedback
                    </span>
                  )}
                </div>
                {!isLast ? (
                  <span className="flex items-center gap-2">
                    {isPractice && !canAdvance && (
                      <span className="hint">reveal to continue</span>
                    )}
                    <button
                      className="btn btn-primary"
                      disabled={grading || !canAdvance}
                      onClick={() => goto(stepIdx + 1)}
                    >
                      Next step →
                    </button>
                  </span>
                ) : confirmSubmit ? (
              <span
                className="flex gap-2 items-center flex-wrap justify-end"
                role="alertdialog"
                aria-label="Confirm submission"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setConfirmSubmit(false);
                }}
              >
                <span className="text-[13px] font-semibold">
                  Submit for grading?{" "}
                  <span style={{ color: allAnswered ? "var(--color-exam-ok)" : "var(--color-exam-warn)" }}>
                    {answeredCount} of {steps.length}
                  </span>{" "}
                  steps answered
                </span>
                <button className="btn btn-primary" disabled={grading} onClick={() => void submitStation()}>
                  {grading ? "Grading…" : "Submit case"}
                </button>
                <button autoFocus className="btn" disabled={grading} onClick={() => setConfirmSubmit(false)}>Not yet</button>
              </span>
                ) : (
                  <button className="btn btn-primary" disabled={grading} onClick={() => setConfirmSubmit(true)}>Finish &amp; submit →</button>
                )}
              </div>
            );
          })()}

          {/* Reveal panel (Practice): model answer comparison + the teaching for
              this waypoint. The workup step reveals via committing orders. */}
          {isPractice && (revealed[step.id] || (step.revealsDiagnostics && engine.labsRevealed)) && (
            <div className="space-y-3">
              <AnswerKey step={step} answer={answer} expertRead={image?.expertRead} />
              <StepTeaching category={caseModel.category} stepId={step.id} />
            </div>
          )}
        </div>

        <p className="hint text-center">
          {answeredCount}/{steps.length} answered ·{" "}
          {isPractice
            ? "answer each step, then reveal the model answer + teaching before moving on"
            : "answers stay locked until feedback"}{" "}
          — your score and {llmEnabled ? "AI coaching" : "feedback"} come when you submit.
        </p>
      </div>

      {grading && (
        <div className="scrim" role="alert">
          <div className="card pop-in p-6 mx-4 max-w-sm w-full flex flex-col items-center gap-3 text-center">
            <span className="spinner" aria-hidden />
            <p className="text-[14.5px] font-bold" style={{ color: "var(--color-exam-header)" }}>
              {timeExpired
                ? "Time's up — submitting your case…"
                : "Grading your case — checking answers against the rubric…"}
            </p>
            {llmEnabled && <p className="hint">AI rubric matching can take a few seconds</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/** Small status chip clarifying whether/where AI is used in this station —
 *  and whether it is actually healthy ("AI on" must never lie). */
function AiChip({
  llmEnabled,
  providerKind,
  aiStatus,
  aiDegraded,
}: {
  llmEnabled: boolean;
  providerKind: ProviderKind | null;
  aiStatus: "idle" | "verifying" | "ok" | "error";
  aiDegraded: string | null;
}) {
  const base = "text-[11.5px] font-semibold px-2.5 py-1 rounded-full";
  if (aiStatus === "error") {
    return (
      <span
        className={base}
        style={{ background: "var(--color-exam-warn-soft)", color: "var(--color-exam-warn)" }}
        title="The configured AI key failed verification — the deterministic engine is answering and grading. Fix the key on the case list."
      >
        ⚠️ AI key error
      </span>
    );
  }
  if (aiDegraded) {
    const detail = useAppStore.getState().aiDegradedDetail;
    return (
      <span
        className={base}
        style={{ background: "var(--color-exam-warn-soft)", color: "var(--color-exam-warn)" }}
        title={`An AI call failed mid-session (${aiDegraded}${detail ? `: ${detail}` : ""}) — the deterministic engine answered instead. It recovers automatically when calls succeed again.`}
      >
        ⚠️ AI degraded{detail ? ` · ${detail}` : " — deterministic fallback in use"}
      </span>
    );
  }
  const label = llmEnabled
    ? `AI on · ${providerKind === "anthropic" ? "Claude" : providerKind === "openai" ? "OpenAI" : "ready"}`
    : "AI off · deterministic";
  return (
    <span
      className={`${base} whitespace-nowrap`}
      style={{
        background: llmEnabled ? "var(--color-exam-ok-soft)" : "var(--color-exam-soft)",
        color: llmEnabled ? "var(--color-exam-ok)" : "var(--color-exam-muted)",
      }}
      title={llmEnabled ? "Patient replies, grading, and coaching use AI; grading runs on a stronger model." : "Grading uses the deterministic engine. Enable AI on the case list for natural replies + coaching."}
    >
      {llmEnabled ? "🟢 " : "○ "}{label}
    </span>
  );
}

/** Collapsible systematic reading framework for EKG/CXR steps. */
function ReadingGuide({ imageKey }: { imageKey: string }) {
  const guide = readingGuideFor(imageKey);
  if (!guide) return null;
  return (
    <details className="rounded-lg border" style={{ borderColor: "var(--color-exam-border)" }}>
      <summary
        className="px-3 py-2 text-[12.5px] font-semibold flex items-center gap-2 cursor-pointer"
        style={{ color: "var(--color-exam-accent-deep)", background: "var(--color-exam-accent-soft)", borderRadius: "7px" }}
      >
        <span aria-hidden className="caret text-[10px]">▶</span>
        💡 Reveal the systematic method — {guide.title}
      </summary>
      <ol className="px-4 py-3 space-y-1.5 text-[12.5px] leading-relaxed list-decimal list-inside">
        {guide.steps.map((s, i) => (
          <li key={i}>
            <span className="font-semibold">{s.step}</span>
            <span style={{ color: "var(--color-exam-muted)" }}> — {s.detail}</span>
          </li>
        ))}
      </ol>
    </details>
  );
}

/** Per-step answer key: the model answer, an expert read (for studies), and an
 *  instant deterministic self-check of which key items you named. No AI call.
 *  Practice mode only — strict OSCE keeps answers sealed until feedback. */
/** The reveal as a teaching moment: your words and the model side by side,
 *  then a succinct "you covered / add next time" checklist. Long expert reads
 *  stay behind a disclosure so the comparison leads. */
function AnswerKey({ step, answer, expertRead }: { step: StepModel; answer: string; expertRead?: string }) {
  const items = [
    ...(step.scoring?.criticalActions ?? []).map((a) => ({ item: a.item, critical: true })),
    ...(step.scoring?.coreActions ?? []).map((a) => ({ item: a.item, critical: false })),
  ];
  const has = answer.trim().length > 0;
  const hit = items.filter((it) => has && selfChecked(answer, it.item));
  const missed = items.filter((it) => !(has && selfChecked(answer, it.item)));
  return (
    <div className="space-y-3 pt-1 fade-up">
      {/* Side-by-side compare: what you wrote vs the model. Each cell sizes to
          its own content (items-start, no stretch, no h-full / flex-1) so a box
          can never overflow its grid track into the row below — that was the
          source of the green/yellow box overlap. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-start">
        <div>
          <div className="panel-label mb-1.5">You wrote</div>
          <p
            className="rounded-xl border p-3 text-[13.5px] leading-relaxed whitespace-pre-wrap"
            style={{ borderColor: "var(--color-exam-border)", background: "var(--color-exam-soft)" }}
          >
            {has ? answer : <span className="italic" style={{ color: "var(--color-exam-faint)" }}>— left blank —</span>}
          </p>
        </div>
        <div>
          <div className="panel-label mb-1.5" style={{ color: "var(--color-exam-ok)" }}>Model answer</div>
          <p
            className="rounded-xl border p-3 text-[13.5px] leading-relaxed"
            style={{ borderColor: "var(--color-exam-ok-line)", background: "var(--color-exam-ok-soft)" }}
          >
            {step.idealAnswer ? cleanIdealAnswer(step.idealAnswer) : <span className="italic">See key points below.</span>}
          </p>
        </div>
      </div>

      {/* Succinct checklist, split into the two things that matter. */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="rounded-xl border p-3" style={{ borderColor: "var(--color-exam-ok-line)" }}>
            <div className="panel-label mb-1.5" style={{ color: "var(--color-exam-ok)" }}>
              ✓ You covered ({hit.length}/{items.length})
            </div>
            {hit.length === 0 ? (
              <p className="text-[12.5px] italic" style={{ color: "var(--color-exam-faint)" }}>
                Nothing from the checklist yet.
              </p>
            ) : (
              <ul className="space-y-1 text-[13px] leading-relaxed">
                {hit.map((it, i) => (
                  <li key={i} className="flex items-baseline gap-2">
                    <span aria-hidden className="shrink-0" style={{ color: "var(--color-exam-ok)" }}>✓</span>
                    <span className="font-semibold">
                      {it.critical && <span className="chip chip-danger mr-1.5">critical</span>}
                      {it.item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl border p-3" style={{ borderColor: "var(--color-exam-warn-line)", background: "var(--color-exam-warn-soft)" }}>
            <div className="panel-label mb-1.5" style={{ color: "var(--color-exam-warn)" }}>
              ○ Add next time ({missed.length})
            </div>
            {missed.length === 0 ? (
              <p className="text-[12.5px] font-bold" style={{ color: "var(--color-exam-ok)" }}>
                🎉 Nothing — you covered the full checklist.
              </p>
            ) : (
              <ul className="space-y-1 text-[13px] leading-relaxed">
                {missed.map((it, i) => (
                  <li key={i} className="flex items-baseline gap-2">
                    <span aria-hidden className="shrink-0" style={{ color: "var(--color-exam-warn)" }}>○</span>
                    <span style={{ color: "var(--color-exam-ink)" }}>
                      {it.critical && <span className="chip chip-danger mr-1.5">critical</span>}
                      {it.item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {items.length > 0 && (
        <p className="hint">
          Self-check is a keyword match — phrased differently? Trust your read; grading on submit is
          smarter.
        </p>
      )}

      {/* The full expert read is depth, not the headline — keep it on demand. */}
      {expertRead && (
        <details className="rounded-xl border" style={{ borderColor: "var(--color-exam-border)" }}>
          <summary
            className="px-3 py-2 text-[12.5px] font-semibold flex items-center gap-2 cursor-pointer"
            style={{ color: "var(--color-exam-accent-deep)", background: "var(--color-exam-accent-soft)", borderRadius: "10px" }}
          >
            <span aria-hidden className="caret text-[10px]">▶</span>
            🔬 Reveal the expert interpretation
          </summary>
          <div className="p-3 text-[13px] leading-relaxed space-y-1">
            {expertRead.split(/\s*•\s*/).filter(Boolean).map((line, i) => (
              <div key={i} className={i === 0 ? "" : "flex gap-2"}>
                {i > 0 && <span aria-hidden style={{ color: "var(--color-exam-ghost)" }}>•</span>}
                <span>{line}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
