import { useEffect, useMemo, useState } from "react";
import type { CaseModel, RawImage } from "../../engine/types";
import { litflCollectionFor } from "../../data/readingGuides";
import { looseCovered } from "../../engine/textMatch";
import { useAppStore } from "../store";

/**
 * In-app lightbox so a tracing/film can be studied side-by-side with the
 * answer box (no tab switch). Escape or any click closes; focus moves to the
 * close button on open and back to the thumbnail on close.
 */
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="scrim cursor-zoom-out"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — enlarged view`}
      onClick={onClose}
      style={{ background: "rgba(20, 16, 44, 0.82)", padding: "1.5rem" }}
    >
      <figure className="flex flex-col items-center gap-2 max-w-full max-h-full">
        <img
          src={src}
          alt={alt}
          className="rounded-lg bg-white"
          style={{ maxWidth: "94vw", maxHeight: "88vh", objectFit: "contain" }}
        />
        <figcaption className="text-[12.5px] font-bold text-white/85">
          {alt} — click anywhere or press Esc to close
        </figcaption>
      </figure>
      <button
        autoFocus
        className="btn absolute top-4 right-4 border-none"
        style={{ background: "rgba(255,255,255,0.92)" }}
        onClick={onClose}
        aria-label="Close enlarged view"
      >
        ✕ Close
      </button>
    </div>
  );
}

/** The presenting context for the (representative, different-patient) teaching
 *  study — gives the read a clinical question to answer, the way a teaching
 *  library captions its cases. */
function VignetteNote({ text }: { text: string }) {
  return (
    <div
      className="rounded-lg border px-3 py-2 text-[12.5px] leading-snug flex items-baseline gap-1.5"
      style={{ background: "var(--color-exam-soft)", borderColor: "var(--color-exam-border)", color: "var(--color-exam-ink)" }}
    >
      <span aria-hidden>🩺</span>
      <span>
        <span className="font-bold">Clinical context:</span> {text}
      </span>
    </div>
  );
}

/**
 * Renders a study image, or a labeled written stand-in for un-sourced assets.
 * Images are never fabricated. Click enlarges in-app (lightbox) so the student
 * can read the study while writing their interpretation.
 */
export function StudyImage({ image }: { image: RawImage }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [zoomed, setZoomed] = useState<string | null>(null);

  // Real tracing/film embedded inline — the student reads it directly, no
  // click-out. The image is the QUESTION (it doesn't name the answer), so it is
  // always shown; the written answer is revealed separately on the step.
  if (image.asset && !imgFailed) {
    const viewUrl = viewableUrl(image);
    return (
      <figure className="space-y-2">
        {image.clinicalVignette && <VignetteNote text={image.clinicalVignette} />}
        <div className="flex flex-col sm:flex-row gap-2">
          {[image.asset, image.asset2].filter(Boolean).map((src, i) => {
            const alt = `${image.label}${i > 0 ? " (additional view)" : ""}`;
            return (
              <button
                key={i}
                type="button"
                className="block flex-1 rounded-lg border overflow-hidden bg-white group relative cursor-zoom-in p-0"
                style={{ borderColor: "var(--color-exam-border-strong)" }}
                title="Enlarge"
                onClick={() => setZoomed(src as string)}
              >
                <img
                  src={src as string}
                  alt={alt}
                  loading="lazy"
                  onError={() => i === 0 && setImgFailed(true)}
                  className="w-full max-h-[460px] object-contain"
                />
                <span
                  className="absolute bottom-1.5 right-1.5 text-[10.5px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                  style={{ background: "rgba(42,34,83,0.8)", color: "#fff" }}
                >
                  🔍 enlarge
                </span>
              </button>
            );
          })}
        </div>
        <p
          className="text-[12px] leading-snug rounded-lg border px-3 py-1.5 flex items-baseline gap-1.5"
          style={{
            background: "var(--color-exam-accent-soft)",
            borderColor: "var(--color-exam-accent-line)",
            color: "var(--color-exam-accent-deep)",
          }}
        >
          <span aria-hidden>📚</span>
          <span>
            <span className="font-bold">Reading practice:</span> this is a real teaching study from a
            published library — a <span className="font-bold">different patient</span>, not the one you
            just examined. Interpret it on its own; details like age or sex may not match this case.
          </span>
        </p>
        <figcaption className="hint flex items-center justify-between gap-2 flex-wrap">
          <span>{image.attribution}</span>
          {viewUrl && (
            <a className="underline" style={{ color: "var(--color-exam-accent)" }} href={viewUrl} target="_blank" rel="noopener noreferrer">
              View on LITFL ↗
            </a>
          )}
        </figcaption>
        {zoomed && <Lightbox src={zoomed} alt={image.label} onClose={() => setZoomed(null)} />}
      </figure>
    );
  }
  const viewUrl = viewableUrl(image);
  const caseNo = litflCaseNumber(image);
  const isLitfl = caseNo !== null;
  const studyName = /ekg|ecg|lead/i.test(image.label)
    ? `LITFL ECG Case ${caseNo}`
    : `LITFL CXR Case ${caseNo}`;
  const openLabel = isLitfl ? `Open ${studyName} ↗` : `Open a representative ${image.label} ↗`;
  return (
    <div className="space-y-2">
      {image.clinicalVignette && <VignetteNote text={image.clinicalVignette} />}
      <div
        className="rounded-lg border-2 border-dashed px-6 py-8 text-center space-y-2"
        style={{ borderColor: "var(--color-exam-border-strong)", background: "var(--color-exam-soft)" }}
        role="img"
        aria-label={`${image.label} description`}
      >
      <div className="panel-label">
        {image.label} — {isLitfl ? `${studyName} (written description)` : "written stand-in (names the findings)"}
      </div>
      <p className="text-sm font-mono leading-relaxed max-w-xl mx-auto">
        {image.imageDescription ?? "Study unavailable."}
      </p>
      <p className="hint max-w-xl mx-auto">
        📚 Reading practice — the linked study is from a teaching library (a different patient), not
        the one you just examined.
      </p>
      {viewUrl && (
        <a
          className="text-[13px] underline"
          style={{ color: "var(--color-exam-accent)" }}
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {openLabel}
        </a>
      )}
      <p className="hint">{image.attribution ?? image.recommendedSource ?? ""}</p>
      </div>
    </div>
  );
}

/** A real, viewable URL for a study with no bundled asset. Read steps carry a
 *  specific LITFL case URL in `source` (preferred); otherwise fall back to the
 *  LITFL Top 100 collection or a search on the recommended source. */
function viewableUrl(image: RawImage): string | null {
  if (image.source && /^https?:\/\/(www\.)?litfl\.com\/(ecg|cxr)-case-/i.test(image.source)) {
    return image.source;
  }
  const litfl = litflCollectionFor(image.label);
  if (litfl) return litfl.url;
  if (image.source && /^https?:\/\//.test(image.source)) return image.source;
  const terms = (image.searchTerms ?? []).join(" ").trim();
  if (!terms) return null;
  const rec = (image.recommendedSource ?? "").toLowerCase();
  if (rec.includes("radiopaedia")) {
    return `https://radiopaedia.org/search?q=${encodeURIComponent(terms)}&scope=cases`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(terms)}&tbm=isch`;
}

/** The LITFL case number embedded in a read-step source URL, if present. */
function litflCaseNumber(image: RawImage): string | null {
  const m = (image.source ?? "").match(/litfl\.com\/(?:ecg|cxr)-case-(\d+)/i);
  return m ? String(parseInt(m[1], 10)) : null;
}

/** Lab results, unlocked only after the workup answer is committed. Each row
 *  is marked against the committed orders so the student sees at a glance
 *  which of the released studies they actually asked for. */
export function LabResults({ caseModel }: { caseModel: CaseModel }) {
  const labsRevealed = useAppStore((s) => s.engine?.labsRevealed ?? false);
  const markViewed = useAppStore((s) => s.markDiagnosticViewed);
  const workupStep = useMemo(
    () => caseModel.steps.find((s) => s.revealsDiagnostics),
    [caseModel],
  );
  const workupAnswer = useAppStore((s) =>
    workupStep ? (s.engine?.postEncounterAnswers[workupStep.id] ?? "") : "",
  );
  const keys = useMemo(
    () => caseModel.revealKeys.filter((k) => caseModel.labs[k] !== undefined),
    [caseModel],
  );

  // Every revealed result renders on screen at once, so all keys count as
  // viewed the moment labs unlock (hover was a mouse-only proxy).
  useEffect(() => {
    if (!labsRevealed) return;
    for (const k of keys) markViewed(k);
  }, [labsRevealed, keys, markViewed]);

  if (keys.length === 0) return null;
  if (!labsRevealed) {
    return (
      <div className="card px-4 py-3.5 flex items-center gap-3">
        <span aria-hidden>🔒</span>
        <div>
          <span className="panel-label">Diagnostic results</span>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--color-exam-muted)" }}>
            Commit your diagnostic workup to receive results.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="card overflow-hidden pop-in">
      <div className="card-header" style={{ background: "var(--color-exam-soft)" }}>
        <span className="panel-label">Diagnostic Results</span>
        <span className="hint">{keys.length} resulted</span>
      </div>
      <p
        className="px-4 py-2 text-[12px] leading-snug border-b"
        style={{ color: "var(--color-exam-muted)", borderColor: "var(--color-exam-border)" }}
      >
        The team obtained the case's standard panel. ✓ = a study you named in your committed orders.
      </p>
      <div>
        {keys.map((k, i) => {
          const ordered = workupAnswer.trim() !== "" && looseCovered(workupAnswer, k);
          return (
            <div
              key={k}
              className="px-4 py-3 sm:grid sm:grid-cols-[150px_1fr] sm:gap-4"
              style={{
                borderTop: i > 0 ? "1px solid var(--color-exam-border)" : "none",
              }}
            >
              <div className="mb-1 sm:mb-0 sm:pt-0.5">
                <div
                  className="text-[11.5px] font-bold uppercase tracking-wide"
                  style={{ color: "var(--color-exam-accent-deep)" }}
                >
                  {k}
                </div>
                <div
                  className="text-[10.5px] font-bold mt-0.5"
                  style={{ color: ordered ? "var(--color-exam-ok)" : "var(--color-exam-warn)" }}
                >
                  {ordered ? "✓ you ordered this" : "○ not in your orders"}
                </div>
              </div>
              <div className="text-[13.5px] leading-relaxed tabular-nums" style={{ color: "var(--color-exam-ink)" }}>
                {caseModel.labs[k] || "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
