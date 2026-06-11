/**
 * Schema adapter: normalizes a raw case (original 2.0 or upgraded 2.1 JSON)
 * into the single internal CaseModel. All "absent field" fallbacks live here
 * so the engine and UI never branch on raw JSON shape.
 */

import type {
  CaseModel,
  HistoryTriggerModel,
  ExamMappingModel,
  ExamLine,
  FileSegment,
  RawCase,
  RawScoringEntry,
  RawSectionScoring,
  RawStep,
  SectionScoring,
  StepModel,
  DomainKey,
  SpProfile,
} from "./types";
import { expandStems, stem, stemmedTokenSet, tokens } from "./textMatch";

// ---------------------------------------------------------------------------
// patientFile parsing
// ---------------------------------------------------------------------------

/** Exam-section line headers are mixed case ("General:", "Chest wall:"). */
const HEADER_RE = /^([A-Z][A-Za-z &/()'.-]{1,30}?):\s*/;
const EXAM_HEADER_RE = /^PHYSICAL EXAM/;
const HIDDEN_HEADER_RE = /^HIDDEN RULES/;
/** Sections whose single-line enumerations are split on commas so one fact
 *  (e.g. smoking) can be revealed without leaking siblings (e.g. alcohol). */
const ENUMERATED_SECTIONS = new Set(["SOCIAL", "FAMILY", "ALLERGIES"]);
const SENSITIVE_CATEGORIES = new Set([
  "substance_use",
  "sexual_history",
  "psychiatric",
  "ob_gyn",
  "trauma",
  "ipv",
  "housing",
]);

/** Inline SP stage directions are author instructions, never patient speech.
 *  Strip them at parse time so no reveal can ever carry them. */
export function stripStageDirections(text: string): string {
  return text
    .replace(/\s*[—–-]\s*only (mentions?|reveals?|discloses?|if)[^.;]*[.;]?\s*$/i, "")
    .replace(/\s*\((?:only )?(?:if|unless|when) (?:asked|prompted)[^)]*\)/gi, "")
    .replace(/\s*\(only [^)]*\)/gi, "")
    .trim();
}

function splitTopLevelCommas(text: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of text) {
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      parts.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  parts.push(cur);
  return parts.map((p) => p.trim()).filter(Boolean);
}

/** Splits a line that may contain several inline "HEADER: content" chunks
 *  (e.g. "ALLERGIES: none. FAMILY: father MI at 58."). */
function splitInlineHeaders(line: string): { header: string | null; text: string }[] {
  // Header = ALL-CAPS run, optionally followed by a parenthetical note
  // ("COLLATERAL (provide ONLY if …):"). The note is folded into the header
  // so its keywords stay available for matching.
  const re = /\b([A-Z][A-Z &/'.-]{2,}(?:\s*\([^)]*\))?):\s*/g;
  const out: { header: string | null; text: string }[] = [];
  let last: { header: string | null; start: number } | null = null;
  let m: RegExpExecArray | null;
  let firstIdx: number | null = null;
  while ((m = re.exec(line)) !== null) {
    if (firstIdx === null) firstIdx = m.index;
    if (last) out.push({ header: last.header, text: line.slice(last.start, m.index).trim() });
    last = { header: m[1], start: re.lastIndex };
  }
  if (firstIdx === null) return [{ header: null, text: line.trim() }];
  if (firstIdx > 0) out.unshift({ header: null, text: line.slice(0, firstIdx).trim() });
  if (last) out.push({ header: last.header, text: line.slice(last.start).trim() });
  // Keep empty-text header chunks ("HPI:" on its own line) — they advance the
  // current section even though they carry no content themselves.
  return out.filter((c) => c.text.length > 0 || c.header !== null);
}

export function parsePatientFile(file: string): {
  persona: string;
  historySegments: FileSegment[];
  examLines: ExamLine[];
} {
  const lines = file.split("\n").map((l) => l.trim()).filter(Boolean);
  let zone: "history" | "exam" | "hidden" = "history";
  let persona = "";
  let currentSection = "HPI";
  const historySegments: FileSegment[] = [];
  const examLines: ExamLine[] = [];

  for (const rawLine of lines) {
    const line = rawLine.replace(/^[-•]\s*/, "");
    if (EXAM_HEADER_RE.test(line)) {
      zone = "exam";
      continue;
    }
    if (HIDDEN_HEADER_RE.test(line)) {
      zone = "hidden";
      continue;
    }
    if (zone === "hidden") continue;

    if (zone === "history") {
      const chunks = splitInlineHeaders(line);
      for (const chunk of chunks) {
        const section = chunk.header ?? currentSection;
        if (chunk.header) currentSection = chunk.header;
        if (section === "PERSONA") {
          persona = persona ? `${persona} ${chunk.text}`.trim() : chunk.text;
          continue;
        }
        if (chunk.text.length === 0) continue;
        const sectionName = section.split(/[\s(]/)[0];
        const semiParts = chunk.text.split(";").map((s) => s.trim()).filter(Boolean);
        for (const part of semiParts) {
          const finalParts = ENUMERATED_SECTIONS.has(sectionName)
            ? splitTopLevelCommas(part)
            : [part];
          for (const p of finalParts) {
            const clean = stripStageDirections(p);
            if (clean.length === 0) continue;
            historySegments.push({ text: clean, section, sensitive: false, claimed: false });
          }
        }
      }
    } else {
      const m = HEADER_RE.exec(line);
      const header = m ? m[1] : "OTHER";
      const text = m ? line.slice(m[0].length) : line;
      examLines.push({
        header,
        text,
        segments: text
          .split(";")
          .flatMap((s) => splitTopLevelCommas(s))
          .map((s) => s.trim())
          .filter(Boolean),
      });
    }
  }
  return { persona, historySegments, examLines };
}

// Synonym expansion lives in textMatch.ts; re-exported for existing imports.
export { expandStems } from "./textMatch";

// ---------------------------------------------------------------------------
// Trigger normalization
// ---------------------------------------------------------------------------

const PLACEHOLDER_RE = /^\s*\[/;

/** Generic question-framing words that would otherwise claim unrelated
 *  segments (e.g. category "hpi" claiming all HPI lines, or "past" from
 *  "past medical history" claiming the prior-episodes content). */
const GENERIC_CATEGORY_TOKENS = new Set([
  "hpi", "ros", "history", "use", "past", "when", "what", "like", "asked",
]);

function triggerKeywordStems(t: { id: string; category: string; triggerConcepts: string[] }): Set<string> {
  const words: string[] = [];
  for (const c of t.triggerConcepts) words.push(...tokens(c));
  words.push(...t.id.split("_"), ...t.category.split("_"));
  return expandStems(
    words
      .map(stem)
      .filter((w) => w.length > 2 && !GENERIC_CATEGORY_TOKENS.has(w)),
  );
}

function assignSegments(
  trigger: { id: string; category: string; triggerConcepts: string[] },
  segments: FileSegment[],
): FileSegment[] {
  const keywords = triggerKeywordStems(trigger);
  const matched: FileSegment[] = [];
  for (const seg of segments) {
    const segToks = stemmedTokenSet(`${seg.section} ${seg.text}`);
    let hits = 0;
    for (const k of keywords) if (segToks.has(k)) hits++;
    if (hits > 0) matched.push(seg);
  }
  return matched;
}

export function adaptTriggers(
  raw: RawCase,
  historySegments: FileSegment[],
  sensitiveTopics: string[],
): HistoryTriggerModel[] {
  const out: HistoryTriggerModel[] = [];
  for (const t of raw.historyTriggers ?? []) {
    const sensitive =
      SENSITIVE_CATEGORIES.has(t.category) || sensitiveTopics.includes(t.id);
    const placeholder = PLACEHOLDER_RE.test(t.response);
    const segs = placeholder ? assignSegments(t, historySegments) : [];
    for (const s of segs) {
      s.claimed = true;
      if (sensitive) s.sensitive = true;
    }
    out.push({
      id: t.id,
      category: t.category,
      concepts: t.triggerConcepts,
      authoredResponse: placeholder ? null : t.response,
      fileSegments: segs.map((s) => s.text),
      importance: t.importance,
      points: t.points,
      sensitive,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Steps, scoring weights, SP profile
// ---------------------------------------------------------------------------

/**
 * Normalizes heterogeneous scoring entries ({item,points} | {label,points} |
 * bare string) into {item, points}. Entries without explicit points share the
 * step's unallocated budget — critical items weighted double — so totals stay
 * anchored to the case's maxPoints.
 */
export function normalizeScoring(raw: RawSectionScoring): SectionScoring {
  type Bucket = "criticalActions" | "coreActions" | "bonusActions" | "penalties";
  const buckets: Bucket[] = ["criticalActions", "coreActions", "bonusActions", "penalties"];
  const text = (e: RawScoringEntry): string =>
    typeof e === "string" ? e : e.item ?? e.label ?? "";
  const explicit = (e: RawScoringEntry): number | null =>
    typeof e === "string" ? null : typeof e.points === "number" ? e.points : null;

  let explicitSum = 0;
  const unpriced: { bucket: Bucket; weight: number }[] = [];
  for (const bucket of buckets) {
    for (const e of raw[bucket] ?? []) {
      const pts = explicit(e);
      if (pts !== null) {
        if (bucket !== "penalties") explicitSum += Math.max(0, pts);
      } else if (bucket !== "penalties") {
        unpriced.push({ bucket, weight: bucket === "criticalActions" ? 2 : 1 });
      }
    }
  }
  const budget = Math.max(0, raw.maxPoints - explicitSum);
  const totalWeight = unpriced.reduce((a, b) => a + b.weight, 0);
  const pointsFor = (bucket: Bucket): number => {
    if (bucket === "penalties") return -3;
    if (totalWeight === 0) return 1;
    const w = bucket === "criticalActions" ? 2 : 1;
    return Math.max(1, Math.round((budget * w) / totalWeight));
  };

  const out: SectionScoring = {
    maxPoints: raw.maxPoints,
    criticalActions: [],
    coreActions: [],
    bonusActions: [],
    penalties: [],
  };
  for (const bucket of buckets) {
    for (const e of raw[bucket] ?? []) {
      const item = text(e);
      if (!item) continue;
      out[bucket].push({ item, points: explicit(e) ?? pointsFor(bucket) });
    }
  }
  return out;
}

function adaptStep(s: RawStep): StepModel {
  return {
    id: s.id,
    label: s.label,
    max: s.max,
    prompt: s.prompt,
    rubric: s.rubric ?? null,
    idealAnswer: s.idealAnswer ?? null,
    scoring: s.scoring ? normalizeScoring(s.scoring) : null,
    type: s.type === "read" ? "read" : "free",
    imageKey: s.image ?? null,
    keyFindings: s.keyFindings ?? [],
    criticalFindings: s.criticalFindings ?? [],
    commonMistakes: s.commonMistakes ?? [],
    requiredTests: s.requiredTests ?? [],
    optionalTests: s.optionalTests ?? [],
    contraindicatedTests: s.contraindicatedTests ?? [],
    orderSensitiveActions: s.orderSensitiveActions ?? [],
    revealsDiagnostics: s.reveal === true,
    mustNotMiss: s.mustNotMiss ?? [],
    acceptableAlternatives: s.acceptableAlternatives ?? [],
    requiredActions: s.requiredActions ?? [],
    optionalActions: s.optionalActions ?? [],
    unsafeActions: s.unsafeActions ?? [],
    consults: s.consults ?? [],
    disposition: s.disposition || null,
  };
}

export const STEP_DOMAIN: Record<string, DomainKey> = {
  differential: "differential",
  revised: "differential",
  workup: "workup",
  ekg_read: "imageInterpretation",
  cxr_read: "imageInterpretation",
  management: "management",
};

export function stepDomain(stepId: string, stepType: "free" | "read"): DomainKey {
  if (STEP_DOMAIN[stepId]) return STEP_DOMAIN[stepId];
  if (stepType === "read") return "imageInterpretation";
  return "differential";
}

function inferDomainWeights(steps: StepModel[]): Record<DomainKey, number> {
  const weights: Record<DomainKey, number> = {
    history: 0,
    physicalExam: 0,
    differential: 0,
    workup: 0,
    imageInterpretation: 0,
    management: 0,
  };
  let total = 0;
  for (const s of steps) {
    weights[stepDomain(s.id, s.type)] += s.max;
    total += s.max;
  }
  if (total > 0 && total !== 100) {
    // Renormalize to 100 (brief §2).
    for (const k of Object.keys(weights) as DomainKey[]) {
      weights[k] = Math.round((weights[k] / total) * 100);
    }
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    weights.management += 100 - sum; // absorb rounding drift
  }
  return weights;
}

function deriveSp(raw: RawCase, persona: string): SpProfile {
  const sp = raw.standardizedPatient;
  return {
    demeanor: sp?.demeanor ?? "neutral",
    emotionalState: sp?.emotionalState ?? "concerned",
    healthLiteracy: sp?.healthLiteracy ?? "average",
    verbosity: sp?.verbosity ?? "brief",
    cooperativeness: sp?.cooperativeness ?? "high",
    communicationStyle:
      sp?.communicationStyle ??
      "answers questions asked without volunteering diagnostic clues",
    affect: sp?.affect ?? persona,
    sensitiveTopics: sp?.sensitiveTopics ?? [],
    disclosureRules: sp?.disclosureRules ?? [
      "Do not reveal sensitive history unless directly asked",
      "Do not mention or hint at the diagnosis",
      "Do not volunteer hidden exam or diagnostic findings",
      "Use lay language; avoid medical jargon and textbook phrasing",
    ],
    derived: !sp,
  };
}

// ---------------------------------------------------------------------------
// Main adapter
// ---------------------------------------------------------------------------

export function adaptCase(raw: RawCase): CaseModel {
  const { persona, historySegments, examLines } = parsePatientFile(raw.patientFile);
  const sp = deriveSp(raw, persona);
  const triggers = adaptTriggers(raw, historySegments, sp.sensitiveTopics);
  const steps = raw.steps.map(adaptStep);

  const mappings: ExamMappingModel[] = (raw.physicalExamMappings ?? []).map((m) => ({
    id: m.id,
    finding: m.finding,
    revealedBy: m.revealedBy,
    importance: m.importance,
    points: m.points,
    normalIfNotPresent: m.normalIfNotPresent ?? null,
  }));

  const domainWeights = raw.overallScoring
    ? { ...raw.overallScoring }
    : inferDomainWeights(steps);

  return {
    id: raw.id,
    category: raw.category,
    difficulty: raw.difficulty,
    title: raw.title,
    diagnosis: raw.diagnosis,
    chart: raw.chart,
    opening: raw.opening,
    patientFile: raw.patientFile,
    historySegments,
    examLines,
    labs: raw.dx?.labs ?? {},
    revealKeys: raw.revealKeys ?? [],
    essential: raw.essential ?? [],
    steps,
    images: raw.images ?? {},
    sp,
    historyTriggers: triggers,
    examMappings: mappings,
    domainWeights,
    communication: raw.communicationScoring ?? null,
    caseSummary: raw.caseSummary ?? {},
    flags: {
      hasHistoryTriggers: (raw.historyTriggers ?? []).length > 0,
      hasExamMappings: (raw.physicalExamMappings ?? []).length > 0,
      hasOverallScoring: !!raw.overallScoring,
      hasStandardizedPatient: !!raw.standardizedPatient,
      hasCommunicationScoring: !!raw.communicationScoring,
      schemaVersion:
        (raw.libraryUpgrade?.["schemaVersion"] as string | undefined) ?? null,
    },
  };
}

