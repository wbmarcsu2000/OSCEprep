/**
 * Display-only formatting helpers. These never touch scoring — they tidy
 * authored strings for presentation.
 */

/** Strip dangling, empty templated tails from a model/ideal answer, e.g.
 *  "…reproducible pain. Also reasonable: ." → "…reproducible pain." */
export function cleanIdealAnswer(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/\s*(Also reasonable|Other (?:reasonable|considerations)|Also consider)\s*:\s*\.?\s*$/i, "")
    .replace(/\s*(?:Must-not-miss[^:]*|Diagnoses to exclude)\s*:\s*\.?\s*$/i, "")
    .replace(/\s+\.\s*$/, ".")
    .replace(/\.\s*\.\s*$/, ".")
    .trim();
}
