import { useEffect, useMemo, useState } from "react";
import type { CaseModel, RawImage } from "../../engine/types";
import { litflCollectionFor } from "../../data/readingGuides";
import { useAppStore } from "../store";

/**
 * Renders a study image, or a labeled written stand-in for un-sourced assets.
 * Images are never fabricated.
 */
export function StudyImage({ image }: { image: RawImage }) {
  const [imgFailed, setImgFailed] = useState(false);

  // Real tracing/film embedded inline — the student reads it directly, no
  // click-out. The image is the QUESTION (it doesn't name the answer), so it is
  // always shown; the written answer is revealed separately on the step.
  if (image.asset && !imgFailed) {
    const viewUrl = viewableUrl(image);
    return (
      <figure className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          {[image.asset, image.asset2].filter(Boolean).map((src, i) => (
            <a
              key={i}
              href={src as string}
              target="_blank"
              rel="noopener noreferrer"
              className="block flex-1 rounded-lg border overflow-hidden bg-white group relative"
              style={{ borderColor: "var(--color-exam-border-strong)" }}
              title="Open full size in a new tab"
            >
              <img
                src={src as string}
                alt={`${image.label}${i > 0 ? " (additional view)" : ""}`}
                loading="lazy"
                onError={() => i === 0 && setImgFailed(true)}
                className="w-full max-h-[460px] object-contain"
              />
              <span
                className="absolute bottom-1.5 right-1.5 text-[10.5px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(42,34,83,0.8)", color: "#fff" }}
              >
                ⤢ full size
              </span>
            </a>
          ))}
        </div>
        <figcaption className="hint flex items-center justify-between gap-2 flex-wrap">
          <span>{image.attribution}</span>
          {viewUrl && (
            <a className="underline" style={{ color: "var(--color-exam-accent)" }} href={viewUrl} target="_blank" rel="noopener noreferrer">
              View on LITFL ↗
            </a>
          )}
        </figcaption>
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

/** Lab results, unlocked only after the workup answer is committed. */
export function LabResults({ caseModel }: { caseModel: CaseModel }) {
  const labsRevealed = useAppStore((s) => s.engine?.labsRevealed ?? false);
  const markViewed = useAppStore((s) => s.markDiagnosticViewed);
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
    <div className="card overflow-hidden">
      <div className="card-header" style={{ background: "var(--color-exam-soft)" }}>
        <span className="panel-label">Diagnostic Results</span>
        <span className="hint">{keys.length} ordered</span>
      </div>
      <div>
        {keys.map((k, i) => (
          <div
            key={k}
            className="px-4 py-3 sm:grid sm:grid-cols-[136px_1fr] sm:gap-4"
            style={{
              borderTop: i > 0 ? "1px solid var(--color-exam-border)" : "none",
            }}
          >
            <div
              className="text-[11.5px] font-bold uppercase tracking-wide mb-1 sm:mb-0 sm:pt-0.5"
              style={{ color: "var(--color-exam-accent-deep)" }}
            >
              {k}
            </div>
            <div className="text-[13.5px] leading-relaxed tabular-nums" style={{ color: "var(--color-exam-ink)" }}>
              {caseModel.labs[k]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
