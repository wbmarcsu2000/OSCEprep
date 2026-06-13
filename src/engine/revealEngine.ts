/**
 * Reveal engine: the ONLY component that decides what hidden information is
 * disclosed. Every string it returns is either (a) verbatim case JSON /
 * patientFile content, (b) a case-authored trigger response, or (c) a fixed
 * neutral phrase carrying zero clinical content. Nothing is generated.
 */

import type { CaseModel, ExamMappingModel, HistoryTriggerModel } from "./types";
import { bestOverlap, fuzzyHas, matchesConcept, stem, stemmedTokenSet } from "./textMatch";
import { expandStems } from "./schemaAdapter";
import { MANEUVER_BY_ID } from "./maneuvers";

/** Fixed neutral replies for questions the case file does not cover. The
 *  patientFile HIDDEN RULES authorize "a reasonable normal/negative answer";
 *  these carry no clinical content. The variant is picked by question TYPE so
 *  "when did this start?" never gets a yes/no answer, and meta-comments
 *  ("stop answering like that") get a deflection instead of a denial.
 *  Selection within a set is deterministic (text length). */
const YES_NO_NEGATIVES = [
  "No, nothing like that.",
  "Not that I can think of, no.",
  "No, I don't think so.",
];

export function neutralNegative(question: string): string {
  const q = question.trim().toLowerCase();
  const whTime = /\b(when|how long|since|what time|how (many|often))\b/.test(q);
  const whOpen = /^(what|where|which|who|why|how)\b/.test(q) || /\b(describe|explain)\b/.test(q);
  const yesNoStart = /^(do|does|did|are|is|was|were|have|has|had|any|can|could|would|ever)\b/.test(q);
  const looksLikeQuestion = q.endsWith("?") || whTime || whOpen || yesNoStart;
  const metaComment = /\b(you|your|stop|answer|answering|wrong|suck|ridiculous|come on|seriously)\b/.test(q);
  if (!looksLikeQuestion && metaComment) {
    return "Sorry, doctor — what would you like to know?";
  }
  if (whTime) return "Honestly, I couldn't say exactly.";
  if (whOpen) return "I'm not sure, to be honest.";
  return YES_NO_NEGATIVES[q.length % YES_NO_NEGATIVES.length];
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

export interface HistoryRevealResult {
  matchedTriggerIds: string[];
  /** Grounded content to voice (verbatim case text). Empty → neutral negative. */
  revealedContent: string[];
  /** Newly unlocked (not previously unlocked) trigger ids. */
  newlyUnlocked: string[];
}

/** Abbreviation-style trigger ids students actually type ("pmh", "ros"). */
const GENERIC_ID_TOKENS = new Set(["use", "history", "hpi", "ros", "symptom", "symptoms"]);

/** True when the question explicitly seeks collateral history (family/EMS/chart
 *  account, "what happened", or the medication list) rather than asking the
 *  patient a focused question. */
function asksForCollateral(question: string): boolean {
  return /\b(family|families|collateral|ems|witness|witnesses|chart|records?|nursing|caregiver|daughter|son|wife|husband|spouse|partner|friend|what happened|med(ication)?s? list|list of (his|her|your|their)? ?med)/i.test(
    question.toLowerCase(),
  );
}

export function triggerMatchesQuestion(
  question: string,
  trigger: HistoryTriggerModel,
): boolean {
  // 1. Exact / all-token concept match.
  for (const concept of trigger.concepts) {
    if (matchesConcept(question, concept)) return true;
  }
  const questionToks = expandStems(stemmedTokenSet(question));
  for (const concept of trigger.concepts) {
    const conceptToks = [...stemmedTokenSet(concept)];
    // 2. Single-token concepts match via lay/medical synonyms ("beer"→alcohol)
    //    with typo tolerance ("aggravatiang" → aggravating).
    if (conceptToks.length === 1 && fuzzyHas(questionToks, conceptToks[0])) return true;
    // 3. Longer concepts tolerate a missing filler word:
    //    "medical history?" ≈ "past medical history".
    if (conceptToks.length >= 3) {
      const hit = conceptToks.filter((t) => fuzzyHas(questionToks, t)).length;
      if (hit / conceptToks.length >= 0.66) return true;
    }
  }
  // 4. Id-token match: "pmh", "medications", "prior episodes" typed directly.
  const idToks = trigger.id
    .split("_")
    .map(stem)
    .filter((t) => t.length > 2 && !GENERIC_ID_TOKENS.has(t));
  if (idToks.length > 0 && idToks.every((t) => questionToks.has(t))) return true;
  // 5. Content-aware match (non-sensitive triggers only): the question names
  //    a specific fact this trigger guards ("do you have high blood pressure"
  //    → the PMH hypertension line). Sensitive topics keep strict
  //    concept/id-based matching so disclosure rules can't be sidestepped via
  //    incidental vocabulary.
  if (!trigger.sensitive) {
    for (const seg of trigger.fileSegments) {
      for (const tok of stemmedTokenSet(seg)) {
        if (tok.length >= 5 && !COMMON_CONTENT_TOKENS.has(tok) && questionToks.has(tok)) {
          return true;
        }
      }
    }
  }
  return false;
}

/** Everyday words that appear all over patientFiles and would over-trigger
 *  content matching ("what's your current job?" must not match a segment
 *  containing "current smoker"). */
const COMMON_CONTENT_TOKENS = new Set(
  ["current", "recent", "recently", "sometimes", "otherwise", "little",
   "slightly", "several", "things", "going", "really", "daily", "weekly",
   "partial", "partially", "since", "after", "while", "during", "without",
   "worse", "better", "good", "first", "last", "month", "today", "tonight",
   "still", "constant", "mild", "moderate",
   // Question-framing / duration filler words that appear inside many file
   // segments ("long history of …") and must not drive a content match —
   // otherwise "past medical history" hits any segment containing "history".
   "history", "long", "heavy", "feeling", "admits", "denies", "reports",
   "started", "noticed", "about", "around", "much", "given", "known"].map((w) => w),
);

/**
 * Generic grounded reveal: non-sensitive patientFile history segments whose
 * tokens overlap the question (so "any fever?" surfaces the authored
 * "NO fever" fact even without a dedicated trigger). Capped to avoid dumping.
 */
function genericSegmentMatches(question: string, caseModel: CaseModel): string[] {
  const qToks = expandStems(stemmedTokenSet(question));
  const scored: { text: string; hits: number }[] = [];
  for (const seg of caseModel.historySegments) {
    if (seg.sensitive || seg.claimed) continue;
    const segToks = stemmedTokenSet(seg.text);
    let hits = 0;
    for (const t of qToks) {
      if (t.length >= 4 && segToks.has(t)) hits++;
    }
    if (hits > 0) scored.push({ text: seg.text, hits });
  }
  scored.sort((a, b) => b.hits - a.hits);
  return scored.slice(0, 3).map((s) => s.text);
}

/** A broad review-of-systems sweep — many symptoms asked at once, e.g.
 *  "fevers, chills, cough, SOB, headache, vision changes, weakness?". Detected
 *  structurally by a multi-item list so it stays content-agnostic. */
function isBroadSymptomSweep(question: string): boolean {
  const items = question
    .split(/[,/]|\bor\b|\band\b/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
  return items.length >= 4;
}

export function askHistoryQuestion(
  question: string,
  caseModel: CaseModel,
  alreadyUnlocked: string[],
  /** Optional LLM-classified trigger ids — validated against the case here. */
  classifiedTriggerIds?: string[],
): HistoryRevealResult {
  const validIds = new Set(caseModel.historyTriggers.map((t) => t.id));
  const classified = (classifiedTriggerIds ?? []).filter((id) => validIds.has(id));

  const matched: HistoryTriggerModel[] = [];
  for (const trigger of caseModel.historyTriggers) {
    if (classified.includes(trigger.id) || triggerMatchesQuestion(question, trigger)) {
      matched.push(trigger);
    }
  }

  const revealedContent: string[] = [];
  const seen = new Set<string>();
  const push = (content: string) => {
    if (!seen.has(content)) {
      seen.add(content);
      revealedContent.push(content);
    }
  };
  for (const trigger of matched) {
    if (trigger.authoredResponse) {
      push(trigger.authoredResponse);
    } else {
      for (const seg of trigger.fileSegments) push(seg);
    }
  }

  // Collateral: a COLLATERAL/family/EMS section is information the student must
  // explicitly request (per the file's own "provide ONLY if asked …" rule). A
  // question naming family/EMS/chart/witness/"what happened"/med-list surfaces
  // the whole collateral narrative; a focused question ("what meds") does NOT
  // (that is routed to its own structured line by section affinity).
  const collateralSegs = caseModel.historySegments.filter((s) =>
    /^(collateral|family|ems|witness|nursing|chart)/i.test(s.section),
  );
  if (collateralSegs.length > 0 && asksForCollateral(question)) {
    for (const s of collateralSegs) push(s.text);
  }

  // A legitimate HPI/ROS question whose trigger has no authored detail (e.g. a
  // confused poor historian whose timeline lives in collateral) answers with
  // the patient's own HPI self-description instead of a bare negative —
  // "I feel shaky, sweaty, foggy. Can't give a clear timeline."
  if (matched.length > 0 && revealedContent.length === 0) {
    const hpiSelf = caseModel.historySegments
      .filter((s) => !s.sensitive && s.section.toUpperCase().startsWith("HPI"))
      .slice(0, 3);
    for (const s of hpiSelf) push(s.text);
  }

  // Grounded generic reveal ONLY when no trigger already answered — otherwise a
  // focused question ("what meds are you on") would get its real answer PLUS a
  // pile of loosely-overlapping HPI segments (a chart dump). When a trigger
  // matched, its content is the answer; nothing more is appended.
  //
  // A broad review-of-systems SWEEP ("fevers, chills, cough, SOB, headache,
  // …?") that matched no trigger must NOT fall through to the generic reveal:
  // its words ("pain", "blood") overlap the HPI and would re-dump it. The
  // patient should give a blanket pertinent-negative instead, so leave the
  // content empty and let the caller produce a denial.
  if (
    revealedContent.length === 0 &&
    caseModel.historySegments.length > 0 &&
    !isBroadSymptomSweep(question)
  ) {
    for (const text of genericSegmentMatches(question, caseModel)) {
      if (!revealedContent.includes(text)) revealedContent.push(text);
    }
  }

  // Keep replies focused: a patient answers a question with the one or two most
  // relevant facts, not every loosely-related line. Rank by overlap with the
  // question and cap the rest — EXCEPT when the student explicitly asked for the
  // full collateral account, where multiple facts are the expected answer.
  const focused = asksForCollateral(question)
    ? [...new Set(revealedContent)]
    : focusReveal(question, revealedContent);

  const matchedIds = matched.map((t) => t.id);
  return {
    matchedTriggerIds: matchedIds,
    revealedContent: focused,
    newlyUnlocked: matchedIds.filter((id) => !alreadyUnlocked.includes(id)),
  };
}

/** Rank revealed segments by token overlap with the question and keep the top
 *  few, so a single question yields a focused answer instead of a chart dump.
 *  Order within the kept set follows the original reveal order. */
function focusReveal(question: string, content: string[], cap = 2): string[] {
  if (content.length <= cap) return content;
  const qToks = expandStems(stemmedTokenSet(question));
  const scored = content.map((text, i) => {
    const segToks = stemmedTokenSet(text);
    let hits = 0;
    for (const t of qToks) if (t.length >= 4 && segToks.has(t)) hits++;
    return { text, i, hits };
  });
  const kept = scored
    .slice()
    .sort((a, b) => b.hits - a.hits || a.i - b.i)
    .slice(0, cap)
    .sort((a, b) => a.i - b.i)
    .map((s) => s.text);
  return kept;
}

// ---------------------------------------------------------------------------
// Physical exam
// ---------------------------------------------------------------------------

export interface ExamRevealResult {
  maneuverId: string;
  /** Findings revealed by this maneuver (verbatim case text). */
  findings: string[];
  /** Mapping ids newly unlocked (carry points). */
  unlockedMappingIds: string[];
  /** True when the reply is a normal/default rather than a mapped finding. */
  isNormal: boolean;
}

function mappingsFor(maneuverId: string, caseModel: CaseModel): ExamMappingModel[] {
  return caseModel.examMappings.filter((m) => m.revealedBy.includes(maneuverId));
}

/**
 * True when `text` substantially overlaps a mapping finding NOT revealed by
 * this maneuver — revealing it would leak an un-performed maneuver's finding.
 */
function leaksOtherMapping(
  text: string,
  maneuverId: string,
  caseModel: CaseModel,
): boolean {
  for (const m of caseModel.examMappings) {
    if (m.revealedBy.includes(maneuverId)) continue;
    if (bestOverlap(m.finding, text) >= 0.6 || bestOverlap(text, m.finding) >= 0.6) {
      return true;
    }
  }
  return false;
}

/** Grounded fallback: the patientFile exam line/segments for this maneuver,
 *  with any content belonging to other maneuvers' mappings suppressed. */
function examLineFallback(maneuverId: string, caseModel: CaseModel): string | null {
  const def = MANEUVER_BY_ID.get(maneuverId);
  if (!def) return null;
  for (const key of def.lineKeys) {
    const keyNorm = key.toLowerCase();
    const line = caseModel.examLines.find((l) =>
      l.header.toLowerCase().includes(keyNorm),
    );
    if (!line) continue;
    if (def.segmentKeys && def.segmentKeys.length > 0) {
      const segs = line.segments.filter((s) => {
        const low = s.toLowerCase();
        return def.segmentKeys!.some((k) => low.includes(k) || stemmedTokenSet(s).has(stem(k)));
      });
      const safe = segs.filter((s) => !leaksOtherMapping(s, maneuverId, caseModel));
      if (safe.length > 0) return safe.join("; ");
      if (segs.length > 0) return null; // matched but suppressed → safe default
      continue; // try next lineKey (e.g. "Special:" line)
    }
    if (leaksOtherMapping(line.text, maneuverId, caseModel)) {
      const safe = line.segments.filter((s) => !leaksOtherMapping(s, maneuverId, caseModel));
      return safe.length > 0 ? safe.join(", ") : null;
    }
    return line.text;
  }
  return null;
}

export function performManeuver(
  maneuverId: string,
  caseModel: CaseModel,
  alreadyUnlockedMappings: string[],
): ExamRevealResult {
  const mapped = mappingsFor(maneuverId, caseModel);
  if (mapped.length > 0) {
    return {
      maneuverId,
      findings: mapped.map((m) => m.finding),
      unlockedMappingIds: mapped
        .map((m) => m.id)
        .filter((id) => !alreadyUnlockedMappings.includes(id)),
      isNormal: false,
    };
  }

  // No mapping → grounded patientFile exam line, else the catalog's safe
  // default normal, else a mapping-supplied normalIfNotPresent. Never a
  // synthesized positive finding.
  const fileLine = examLineFallback(maneuverId, caseModel);
  if (fileLine) {
    return { maneuverId, findings: [fileLine], unlockedMappingIds: [], isNormal: true };
  }
  const def = MANEUVER_BY_ID.get(maneuverId);
  return {
    maneuverId,
    findings: [def?.defaultNormal ?? "Examination unremarkable."],
    unlockedMappingIds: [],
    isNormal: true,
  };
}
