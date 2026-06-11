/**
 * Deterministic text matching used by the reveal engine, the scoring engine,
 * and the LLM-off fallback. Pure string processing — no clinical knowledge is
 * generated here; we only test whether student text overlaps case-authored
 * phrases.
 */

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "of", "to", "in", "on", "for", "with",
  "your", "you", "do", "does", "did", "have", "has", "had", "is", "are",
  "was", "were", "be", "been", "any", "at", "as", "it", "its", "this",
  "that", "there", "their", "them", "they", "he", "she", "his", "her",
  "about", "me", "tell", "i", "we", "what", "when", "how", "much", "many",
  "ever", "if", "get", "got", "would", "like", "can", "could", "please",
]);

/**
 * Lay ↔ medical phrase canonicalization, applied during normalization on BOTH
 * sides (student text and case text), so "do you have high blood pressure"
 * meets "PMH: hypertension" on the same token. Vocabulary equivalence only —
 * no clinical facts are introduced.
 */
const CANONICAL_PHRASES: [RegExp, string][] = [
  [/\bhigh blood pressure\b/g, "hypertension"],
  [/\bblood pressure\b/g, "hypertension"],
  [/\bhigh cholesterol\b/g, "hyperlipidemia"],
  [/\bcholesterol\b/g, "hyperlipidemia"],
  [/\bheart attack(s)?\b/g, "mi"],
  [/\bblood thinner(s)?\b/g, "anticoagulant"],
  [/\bwater pill(s)?\b/g, "furosemide"],
  [/\bshort(ness)? of breath\b/g, "dyspnea"],
  [/\btrouble breathing\b/g, "dyspnea"],
  [/\bthr(ew|ow|owing) up\b/g, "vomiting"],
  [/\bpass(ed|ing)? out\b/g, "syncope"],
  [/\bblack(ed|ing)? out\b/g, "syncope"],
  // Abbreviation ↔ full-name canonicalization so a differential / work-up
  // written either way matches the framework buckets and menu.
  [/\bpulmonary embol(ism|us)\b/g, "pe"],
  [/\bacute coronary syndrome\b/g, "acs"],
  [/\bmyocardial infarction\b/g, "mi"],
  [/\bdeep vein thrombosis\b/g, "dvt"],
  [/\bheart failure\b/g, "chf"],
  [/\bgastroesophageal reflux( disease)?\b/g, "gerd"],
  [/\bupper gi\b/g, "ugib"],
  // Work-up abbreviations.
  [/\bchest x-?rays?\b/g, "cxr"],
  [/\bct\s*pulmonary angiogra(m|phy)\b/g, "cta"],
  [/\bct\s*angiogra(m|phy)\b/g, "cta"],
  [/\bctpa\b/g, "cta"],
  [/\bctpe\b/g, "cta"],
  [/\bd-?dimers?\b/g, "ddimer"],
  [/\bbasic metabolic panel\b/g, "bmp"],
  [/\bcomprehensive metabolic panel\b/g, "bmp"],
  [/\bcomplete blood count\b/g, "cbc"],
];

export function normalize(text: string): string {
  let t = text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9'/ -]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const [re, repl] of CANONICAL_PHRASES) t = t.replace(re, repl);
  return t;
}

/** Light suffix stemming so "smoking" matches "smoke", "fevers" matches "fever". */
export function stem(token: string): string {
  let t = token;
  if (t.length > 5 && t.endsWith("ing")) t = t.slice(0, -3);
  else if (t.length > 4 && t.endsWith("ed")) t = t.slice(0, -2);
  // -es only after sibilants (boxes, rashes); otherwise plain -s (wakes→wake)
  else if (t.length > 4 && /(?:ses|xes|zes|ches|shes)$/.test(t)) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) t = t.slice(0, -1);
  return t;
}

export function tokens(text: string): string[] {
  return normalize(text)
    .split(/[\s/-]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export function stemmedTokenSet(text: string): Set<string> {
  return new Set(tokens(text).map(stem));
}

// ---------------------------------------------------------------------------
// Question-intent / lay-medical synonym groups (vocabulary only — no facts)
// ---------------------------------------------------------------------------

const SYNONYM_GROUPS: string[][] = [
  ["alcohol", "drink", "drinking", "beer", "wine", "etoh", "liquor", "booze"],
  ["smoking", "smoke", "smoker", "tobacco", "cigarette", "cigarettes", "vape", "pack"],
  ["drugs", "cocaine", "heroin", "meth", "opioid", "ivdu", "substances", "inject"],
  ["medication", "medications", "medicine", "meds", "pill", "pills", "prescription", "refill", "refills", "adherence", "dose", "taking"],
  ["travel", "trip", "flight", "abroad", "vacation"],
  ["sexual", "sex", "partner", "partners", "sti", "std", "intercourse", "unprotected"],
  ["period", "menstrual", "lmp", "menses", "pregnant", "pregnancy"],
  ["onset", "start", "started", "begin", "began", "when"],
  // "past/prior/before" (question framing) is kept separate from
  // "episode/happened" (event content) so "past medical history" cannot
  // cross-match the prior-episodes trigger.
  ["prior", "previous", "before", "past", "old"],
  ["episode", "episodes", "happened", "recurrence"],
  ["family", "father", "mother", "parents", "relative", "relatives", "sibling"],
  ["surgery", "surgeries", "operation", "operations", "surgical"],
  ["work", "job", "occupation", "occupational", "exposure"],
  ["mood", "depressed", "depression", "anxiety", "anxious", "psychiatric", "suicidal", "stress"],
  ["home", "housing", "live", "lives", "living", "homeless"],
  ["diet", "eat", "eating", "food", "salt", "appetite"],
  ["weight", "weights", "pounds", "lbs", "kg"],
  ["pain", "hurt", "hurts", "ache", "aching", "sore", "discomfort"],
  // lay ↔ medical equivalences (complementing CANONICAL_PHRASES)
  ["hypertension", "htn", "hypertensive"],
  ["hyperlipidemia", "lipid", "lipids", "statin"],
  ["diabetes", "diabetic", "metformin"],
  // ACS family — naming any member matches the "ACS" bucket.
  ["acs", "nstemi", "stemi", "mi", "infarct", "infarction", "angina", "ischemia", "ischaemia"],
  ["chf", "heart-failure", "adhf", "hfref", "hfpef"],
  ["gerd", "reflux", "esophageal", "oesophageal"],
  // Work-up test synonyms / abbreviations.
  ["troponin", "trop", "trops", "troponins"],
  ["echocardiography", "echo", "echocardiogram", "tte", "ttes"],
  ["ekg", "ecg", "electrocardiogram", "electrocardiograph"],
  ["bmp", "cmp", "chem", "chem7", "electrolytes", "metabolic-panel"],
  ["bnp", "ntprobnp", "probnp", "natriuretic"],
  ["cbc", "hemogram", "fbc", "cbcd"],
  ["cta", "ctpa", "ctpe", "ctangiogram"],
  ["ddimer", "dimer"],
  ["ultrasound", "us", "sonogram", "pocus", "echo"],
  ["lipase", "amylase"],
  ["urinalysis", "ua", "urine"],
  ["dyspnea", "breathless", "breathlessness", "winded"],
  ["severe", "severity", "bad"],
  ["anticoagulant", "anticoagulation"],
  ["syncope", "faint", "fainted", "fainting", "collapse", "collapsed"],
  ["vomiting", "vomit", "emesis"],
  ["nausea", "nauseous", "nauseated"],
  ["furosemide", "lasix", "diuretic"],
];

const SYNONYMS = new Map<string, Set<string>>();
for (const group of SYNONYM_GROUPS) {
  const stems = group.map(stem);
  for (const s of stems) {
    const set = SYNONYMS.get(s) ?? new Set<string>();
    for (const other of stems) set.add(other);
    SYNONYMS.set(s, set);
  }
}

export function expandStems(stems: Iterable<string>): Set<string> {
  const out = new Set<string>();
  for (const s of stems) {
    out.add(s);
    const syn = SYNONYMS.get(s);
    if (syn) for (const t of syn) out.add(t);
  }
  return out;
}

/**
 * Typo-tolerant token comparison: exact, prefix-overlap (≥5 chars, so a stem
 * like "aggravat" matches the misspelling "aggravatiang"), or one edit for
 * ≥6-char tokens. Vocabulary robustness only — never bridges different words.
 */
export function fuzzyTokenMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 5 || b.length < 5) return false;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (long.startsWith(short) && long.length - short.length <= 4) return true;
  if (a.length >= 6 && Math.abs(a.length - b.length) <= 1) {
    let i = 0;
    let j = 0;
    let edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) {
        i++;
        j++;
        continue;
      }
      if (++edits > 1) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else {
        i++;
        j++;
      }
    }
    return edits + (a.length - i) + (b.length - j) <= 1;
  }
  return false;
}

/** Set membership with typo tolerance. */
export function fuzzyHas(set: Set<string>, token: string): boolean {
  if (set.has(token)) return true;
  for (const t of set) {
    if (fuzzyTokenMatch(t, token)) return true;
  }
  return false;
}

/**
 * Lenient coverage test for drills/learning: an item counts as named if the
 * (synonym + typo-expanded) answer contains any of the item's distinctive
 * tokens. Handles keyword-style answers and abbreviations (trops→troponin,
 * echo→echocardiography, chest xray→cxr). More forgiving than itemMatches.
 */
export function looseCovered(answer: string, item: string): boolean {
  if (answer.trim().length === 0) return false;
  const ans = expandStems(stemmedTokenSet(answer));
  const itemToks = [...stemmedTokenSet(item)].filter((t) => t.length >= 3);
  if (itemToks.length === 0) {
    // very short item (e.g. "PE") — require the exact token, synonym-expanded
    for (const t of stemmedTokenSet(item)) if (fuzzyHas(ans, t)) return true;
    return false;
  }
  // Require every distinctive (non-qualifier) content token, synonym/stem
  // expanded. Leading qualifiers (high/appropriate/serial/acute…) are optional,
  // so "respiratory compensation" credits "appropriate respiratory compensation"
  // and "troponin" credits "serial troponin" — but "metabolic acidosis" does
  // NOT credit "metabolic alkalosis" ("alkalosis" is absent), where the old
  // single-shared-token rule over-credited.
  const content = itemToks.filter((t) => !HEAD_QUALIFIERS.has(t));
  const pool = content.length > 0 ? content : itemToks;
  return pool.every((t) => fuzzyHas(ans, t));
}

/** Lead qualifiers carry little distinctive meaning — the head noun does. */
const HEAD_QUALIFIERS = new Set(
  [
    "high", "low", "elevated", "decreased", "mild", "moderate", "severe",
    "acute", "chronic", "appropriate", "adequate", "concurrent", "primary",
    "secondary", "partial", "complete", "serial", "early", "late", "initial",
  ].map(stem),
);

/**
 * Does the student text match a case-authored concept phrase?
 * True when the whole phrase appears, or when every significant token of the
 * concept appears (stemmed) in the text.
 */
export function matchesConcept(studentText: string, concept: string): boolean {
  const normText = ` ${normalize(studentText)} `;
  const normConcept = normalize(concept);
  if (normConcept.length === 0) return false;
  if (normText.includes(` ${normConcept} `)) return true;
  const conceptToks = tokens(concept).map(stem);
  if (conceptToks.length === 0) return false;
  const textToks = stemmedTokenSet(studentText);
  return conceptToks.every((t) => fuzzyHas(textToks, t));
}

/**
 * Overlap ratio of a case-authored phrase's significant tokens found in the
 * student text. Splits on "/" alternatives and returns the best alternative.
 * With `expandSynonyms`, the student's tokens also count via their lay/medical
 * synonyms ("blood thinner" credits "anticoagulation").
 */
export function bestOverlap(
  studentText: string,
  phrase: string,
  expandSynonyms = false,
): number {
  const textToks = expandSynonyms
    ? expandStems(stemmedTokenSet(studentText))
    : stemmedTokenSet(studentText);
  const alternatives = phrase
    .split("/")
    .map((p) => p.replace(/\(.*?\)/g, " "))
    .filter((p) => tokens(p).length > 0);
  if (alternatives.length === 0) return 0;
  let best = 0;
  for (const alt of alternatives) {
    const toks = tokens(alt).map(stem);
    if (toks.length === 0) continue;
    const hit = toks.filter((t) => textToks.has(t)).length;
    best = Math.max(best, hit / toks.length);
  }
  return best;
}

const NEGATORS = ["no", "not", "without", "denies", "unlikely", "rule", "r/o", "ruled", "isn't", "wasn't", "non", "negative", "excludes", "excluded"];

/**
 * True when every occurrence of the phrase's tokens in `text` is preceded
 * (within `window` tokens, inside the same clause) by a negation — so
 * "this is NOT a STEMI" doesn't match "calling a STEMI", while
 * "…not a STEMI. Rate 90, sinus rhythm" still credits "rate & rhythm"
 * (negation never crosses a sentence boundary).
 */
export function isNegatedIn(text: string, phrase: string, window = 4): boolean {
  const phraseToks = tokens(phrase).map(stem);
  let sawToken = false;
  for (const clause of text.split(/[.;!?\n]+/)) {
    const raw = normalize(clause).split(/[\s/-]+/).filter(Boolean);
    const stems = raw.map(stem);
    for (const pt of phraseToks) {
      let idx = stems.indexOf(pt);
      while (idx >= 0) {
        sawToken = true;
        let negated = false;
        for (let i = Math.max(0, idx - window); i < idx; i++) {
          if (NEGATORS.includes(raw[i]) || NEGATORS.includes(stems[i])) {
            negated = true;
            break;
          }
        }
        if (!negated) return false; // at least one positive assertion
        idx = stems.indexOf(pt, idx + 1);
      }
    }
  }
  return sawToken; // tokens found, and every one of them was negated
}

/**
 * Conservative credit test for a rubric item against a free-text answer.
 * An item is credited when one of its "/"-alternatives has ≥ minRatio of its
 * significant tokens present (default: all tokens for short phrases, 0.6 for
 * longer ones) and the match is not negated.
 */
export function itemMatches(answer: string, item: string): boolean {
  const alternatives = item
    .split("/")
    .map((p) => p.replace(/\(.*?\)/g, " ").replace(/^recognizes?:?\s*/i, ""))
    .filter((p) => tokens(p).length > 0);
  for (const alt of alternatives) {
    const toks = tokens(alt).map(stem);
    if (toks.length === 0) continue;
    // 1-2 token items need every token; mid-length items tolerate one filler
    // word ("EKG, ideally immediately" ≈ "EKG immediately"); long items 0.6.
    const minRatio = toks.length <= 2 ? 1 : toks.length <= 4 ? 0.65 : 0.6;
    if (bestOverlap(answer, alt, true) >= minRatio && !isNegatedIn(answer, alt)) {
      return true;
    }
  }
  return false;
}

/**
 * Positive-assertion test for penalty items. Penalty phrases describe a
 * mistake (e.g. "calling a STEMI for ST depression"), so naive overlap would
 * penalize correct answers that share tokens ("ST depression"). We therefore
 * match only on the penalty's DISTINCTIVE tokens — those that do not appear in
 * any credited item or the ideal answer — asserted without negation.
 */
const PENALTY_ACTION_VERBS = new Set(
  ["call", "give", "order", "activate", "miss", "fail", "treat", "use",
   "start", "send", "discharge", "delay", "perform", "choose"].map(stem),
);

export function penaltyMatches(
  answer: string,
  item: string,
  contextPhrases: string[] = [],
): boolean {
  const contextToks = new Set<string>();
  for (const p of contextPhrases) for (const t of tokens(p).map(stem)) contextToks.add(t);
  for (const v of PENALTY_ACTION_VERBS) contextToks.add(v);
  const answerToks = stemmedTokenSet(answer);
  for (const alt of item.split("/")) {
    const altToks = tokens(alt).map(stem);
    if (altToks.length === 0) continue;
    const distinctive = altToks.filter((t) => !contextToks.has(t));
    if (distinctive.length === 0) {
      // No distinctive token — require the whole phrase, unnegated.
      if (bestOverlap(answer, alt) === 1 && !isNegatedIn(answer, alt)) return true;
      continue;
    }
    for (const t of distinctive) {
      if (answerToks.has(t) && !isNegatedIn(answer, t)) return true;
    }
  }
  return false;
}
