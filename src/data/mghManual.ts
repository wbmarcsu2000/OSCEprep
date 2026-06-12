/**
 * Deep links into the MGH Housestaff Manual 2024–2025 PDF, served by the
 * companion manual app. Its PDF page indexing matches the `page` numbers used
 * by case mghReference entries and the curriculum's ManualRef/manualPage
 * fields (verified against the manual's topic map), so `#page=N` lands on the
 * cited section directly.
 */
export const MGH_MANUAL_APP_URL = "https://mgh-manual.vercel.app";

export function mghPdfUrl(page: number): string {
  return `${MGH_MANUAL_APP_URL}/manual.pdf#page=${page}`;
}
