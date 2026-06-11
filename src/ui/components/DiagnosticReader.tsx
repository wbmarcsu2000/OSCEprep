import { useState } from "react";
import type { CaseModel, RawImage } from "../../engine/types";
import { litflCollectionFor } from "../../data/readingGuides";
import { useAppStore } from "../store";

/**
 * Renders a study image, or a labeled placeholder for un-sourced assets.
 * With `conceal` (used during graded read steps), the authored description —
 * which often names the diagnosis — stays hidden behind an explicit reveal,
 * framed as a stand-in for the missing image. Images are never fabricated.
 */
export function StudyImage({ image, conceal = false }: { image: RawImage; conceal?: boolean }) {
  const [revealed, setRevealed] = useState(false);
  if (image.asset) {
    return (
      <figure className="space-y-1.5">
        <img
          src={image.asset}
          alt={image.label}
          className="w-full rounded-lg border"
          style={{ borderColor: "var(--color-exam-border)" }}
        />
        {image.attribution && <figcaption className="hint">{image.attribution}</figcaption>}
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
  if (conceal && !revealed) {
    return (
      <div
        className="rounded-lg border-2 border-dashed px-6 py-7 text-center space-y-3"
        style={{ borderColor: "var(--color-exam-border-strong)", background: "#fafbfd" }}
      >
        <div className="panel-label">
          {image.label} — {isLitfl ? studyName : "read this study"}
        </div>
        <p className="text-[13px] max-w-md mx-auto leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
          {isLitfl
            ? "Open the linked study, read it systematically, and write your interpretation below. The LITFL page shows the answer further down — read first, then scroll to self-check. (A written description is also available here but names the findings directly.)"
            : "Open a representative study to read, then write your formal interpretation below. A written description is also available but names the findings directly."}
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {viewUrl && (
            <a className="btn btn-primary" href={viewUrl} target="_blank" rel="noopener noreferrer">
              {openLabel}
            </a>
          )}
          <button className="btn" onClick={() => setRevealed(true)}>
            Reveal written description
          </button>
        </div>
        <p className="hint">{image.attribution ?? image.recommendedSource ?? ""}</p>
      </div>
    );
  }
  return (
    <div
      className="rounded-lg border-2 border-dashed px-6 py-8 text-center space-y-2"
      style={{ borderColor: "var(--color-exam-border-strong)", background: "#fafbfd" }}
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
  const keys = caseModel.revealKeys.filter((k) => caseModel.labs[k] !== undefined);
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
      <div className="card-header" style={{ background: "#fafbfd" }}>
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
            onMouseEnter={() => markViewed(k)}
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
