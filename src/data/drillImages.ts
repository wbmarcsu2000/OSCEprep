/**
 * Bundled teaching figures for guideline/surgery drills.
 *
 * Mirrors src/data/mcqImages.ts: files live in ../assets/drill-images and are
 * resolved through Vite so they are hashed, cache-busted and work offline. The
 * glob is `?url`, so only URL strings enter the bundle, never image bytes.
 *
 * Every image is open-licensed (public domain / CC0 / CC BY / CC BY-SA), sourced
 * from Wikimedia Commons, and was viewed before shipping — keyword search picks
 * the wrong modality constantly. Attribution ledger:
 * ../assets/drill-images/CREDITS.md
 */
const urls = import.meta.glob("../assets/drill-images/*.{jpg,jpeg,png,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byBasename: Record<string, string> = {};
for (const [path, url] of Object.entries(urls)) {
  const base = path.split("/").pop();
  if (base) byBasename[base] = url;
}

/** Resolve a bundled drill image basename to its built URL (undefined if missing). */
export function drillImageUrl(file: string): string | undefined {
  return byBasename[file];
}

/** Every bundled basename — used by the test that guards the CREDITS ledger. */
export function drillImageFiles(): string[] {
  return Object.keys(byBasename).sort();
}
