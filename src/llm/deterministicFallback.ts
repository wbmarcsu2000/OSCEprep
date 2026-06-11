/**
 * Deterministic fallback for both LLM functions. The whole app runs on this
 * path when no API key is configured — the LLM is strictly an enhancement.
 */

import { matchesConcept, stemmedTokenSet } from "../engine/textMatch";
import { expandStems } from "../engine/schemaAdapter";

export interface CandidateConcept {
  id: string;
  concepts: string[];
}

/** Keyword/synonym overlap against case-authored concepts — the same rules
 *  the reveal engine applies (phrase match, all-token match, or a synonym of
 *  a single-token concept). */
export function classifyIntentDeterministic(
  studentText: string,
  candidates: CandidateConcept[],
): string[] {
  const questionToks = expandStems(stemmedTokenSet(studentText));
  const matched: string[] = [];
  for (const c of candidates) {
    let hit = c.concepts.some((concept) => matchesConcept(studentText, concept));
    if (!hit) {
      hit = c.concepts.some((concept) => {
        const conceptToks = stemmedTokenSet(concept);
        if (conceptToks.size !== 1) return false;
        const [tok] = [...conceptToks];
        return questionToks.has(tok);
      });
    }
    if (hit) matched.push(c.id);
  }
  return matched;
}

// ---------------------------------------------------------------------------
// Lay phrasing (deterministic). Mechanical text transforms ONLY — strips
// chart-style labels and SP stage directions, flips third person to first.
// No clinical token is ever added; content words pass through unchanged.
// ---------------------------------------------------------------------------

function fixVerbAgreement(text: string): string {
  const MAP: Record<string, string> = {
    admits: "admit", denies: "deny", forgets: "forget", reports: "report",
    mentions: "mention", takes: "take", drinks: "drink", smokes: "smoke",
    uses: "use", feels: "feel", gets: "get", says: "say", lives: "live",
    works: "work", wakes: "wake", sleeps: "sleep", eats: "eat",
    notices: "notice", thinks: "think", remembers: "remember", tries: "try",
    wants: "want", has: "have", is: "am", does: "do",
  };
  return text.replace(
    /\bI ((?:(?:sometimes|often|never|usually|also|still|just|only|rarely) )?)(\w+)\b/g,
    (full, adv: string, verb: string) => (MAP[verb] ? `I ${adv}${MAP[verb]}` : full),
  );
}

/**
 * Collapse a run of chart-style pertinent negatives ("NO pleuritic quality,
 * NO positional change, NO fever, …") into a single natural denial, so the
 * patient doesn't recite a chart. Standalone "no X" clauses are dropped in
 * favor of "nothing like that"; positive clauses are kept.
 */
function collapseNegatives(s: string): string {
  const clauses = s.split(/[;,]/).map((c) => c.trim()).filter(Boolean);
  const positives: string[] = [];
  let hadNegatives = false;
  for (const c of clauses) {
    if (/^(no|not|without|denies|negative)\b/i.test(c)) {
      hadNegatives = true; // drop the specific chart negative
    } else {
      positives.push(c);
    }
  }
  if (!hadNegatives) return s;
  const tail = "nothing else like that";
  return positives.length > 0 ? `${positives.join(", ")} — ${tail}` : "No, nothing like that";
}

function layifySegment(segment: string): string {
  let s = segment.trim();
  // Drop chart-style section labels ("PMH:", "MEDICATIONS:", "OLDCARTS:").
  s = s.replace(/^[A-Z][A-Za-z &/()'.-]{1,30}:\s*/, "");
  // Stage-direction openers inside parentheticals: "(admits she …)" → "(she …)".
  s = s.replace(/\((?:admits|denies|reports|mentions|reveals|adds)\s+/gi, "(");
  // De-shout authored emphasis first ("NO fever" → "no fever").
  s = s.replace(/\b([A-Z]{2,})\b/g, (m) => (/^[A-Z0-9]+$/.test(m) && m.length > 2 ? m.toLowerCase() : m));
  // Collapse runs of pertinent negatives into a natural denial.
  s = collapseNegatives(s);
  // Third → first person, including subjectless chart style ("Has had …").
  s = s.replace(/\b[Ss]he\b|\b[Hh]e\b/g, "I");
  s = s.replace(/\b[Hh]er\b|\b[Hh]is\b/g, "my");
  s = s.replace(
    /^(has|had|was|is|does|takes|drinks|smokes|feels|gets|wakes|notices|reports|denies|admits|woke|started|noticed)\b/i,
    (m) => `I ${m.toLowerCase()}`,
  );
  s = fixVerbAgreement(s);
  s = s.trim();
  if (s.length === 0) return s;
  s = s[0].toUpperCase() + s.slice(1);
  if (!/[.!?]$/.test(s)) s += ".";
  return s;
}

/** Deterministic patient phrasing: verbatim content words, presented as
 *  speech rather than chart text. */
export function phrasePatientReplyDeterministic(approvedContent: string): string {
  const seen = new Set<string>();
  const parts = approvedContent
    .split(/(?<=[.!?])\s+|\n+/)
    .map(layifySegment)
    .filter(Boolean)
    // Drop duplicate sentences so collapsed negatives don't repeat ("No,
    // nothing like that. No, nothing like that.").
    .filter((s) => {
      const key = s.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  return parts.join(" ") || approvedContent;
}
