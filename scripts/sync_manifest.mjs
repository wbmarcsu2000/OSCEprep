#!/usr/bin/env node
/**
 * Sync src/data/manifest.json to the case files on disk.
 *  - Updates each existing entry's category/difficulty/title/diagnosis from its
 *    case file (so "raise everything" difficulty changes propagate).
 *  - Appends entries for any case file not yet in the manifest (sorted by id),
 *    preserving the rest of the order.
 *  - Preserves the `defaults` block and each entry's existing `cantMiss` flag
 *    (new entries default cantMiss:false).
 * Usage: node scripts/sync_manifest.mjs   (writes manifest.json in place)
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/data/cases";
const MANIFEST = "src/data/manifest.json";

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const byId = new Map(manifest.cases.map((c) => [c.id, c]));

const files = readdirSync(DIR).filter((f) => f.endsWith(".json")).sort();
let updated = 0;
let added = 0;
for (const file of files) {
  const c = JSON.parse(readFileSync(join(DIR, file), "utf8"));
  const fields = {
    id: c.id,
    file,
    category: c.category,
    difficulty: c.difficulty,
    title: c.title,
    diagnosis: c.diagnosis,
  };
  const existing = byId.get(c.id);
  if (existing) {
    const before = JSON.stringify(existing);
    Object.assign(existing, fields);
    if (existing.cantMiss === undefined) existing.cantMiss = false;
    if (JSON.stringify(existing) !== before) updated++;
  } else {
    const entry = { ...fields, cantMiss: false };
    manifest.cases.push(entry);
    byId.set(c.id, entry);
    added++;
  }
}

// Stable sort: group by category prefix then numeric suffix, keeping it tidy.
manifest.cases.sort((a, b) => {
  const pa = a.id.replace(/-\d+$/, "");
  const pb = b.id.replace(/-\d+$/, "");
  if (pa !== pb) return pa < pb ? -1 : 1;
  const na = parseInt(a.id.match(/-(\d+)$/)?.[1] ?? "0", 10);
  const nb = parseInt(b.id.match(/-(\d+)$/)?.[1] ?? "0", 10);
  return na - nb;
});

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`manifest synced: ${manifest.cases.length} cases (${updated} updated, ${added} added)`);
