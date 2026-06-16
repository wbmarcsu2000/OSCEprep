// Audit every integrated:true EKG/CXR read: does the pinned LITFL image's
// actual content (LITFL_MEDIA[kind][n].read) match the case-authored model
// answer the student is graded against? Mismatches are the "photo doesn't
// match the case" bug.
import { readFileSync, readdirSync } from "node:fs";
import { LITFL_ECG_STUDIES, LITFL_CXR_STUDIES } from "../src/data/litflStudies";
import { LITFL_MEDIA } from "../src/data/litflMedia";

const dir = "src/data/cases";
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();

type Row = {
  id: string;
  key: string;
  kind: "ecg" | "cxr";
  n: number | null;
  hasMedia: boolean;
  pinnedDx: string;
  imageRead: string; // ground truth of what the displayed image shows
  authored: string; // case-authored model answer (idealAnswer)
  authoredCrit: string[];
};

const rows: Row[] = [];
let integratedNoStudy = 0;
let nonIntegrated = 0;

for (const f of files) {
  const c = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
  const id = c.id as string;
  for (const step of c.steps ?? []) {
    if (step.type !== "read" || !step.image) continue;
    const img = c.images?.[step.image];
    if (!img) continue;
    const isEcg = /ekg|ecg/i.test(step.image);
    const kind: "ecg" | "cxr" = isEcg ? "ecg" : "cxr";
    if (img.integrated !== true) {
      nonIntegrated++;
      continue;
    }
    const n = typeof img.litflStudyN === "number" ? img.litflStudyN : null;
    if (n == null) {
      integratedNoStudy++;
      continue;
    }
    const coll = isEcg ? LITFL_ECG_STUDIES : LITFL_CXR_STUDIES;
    const study = coll.find((s) => s.n === n);
    const media = (isEcg ? LITFL_MEDIA.ecg : LITFL_MEDIA.cxr)[n];
    rows.push({
      id,
      key: step.image,
      kind,
      n,
      hasMedia: !!media?.img,
      pinnedDx: study?.diagnosis ?? "(unknown study)",
      imageRead: media?.read ?? "(no media read)",
      authored: step.idealAnswer ?? "(none)",
      authoredCrit: step.criticalFindings ?? [],
    });
  }
}

console.log(`integrated reads with a pinned study: ${rows.length}`);
console.log(`  of which have a real image (media.img): ${rows.filter((r) => r.hasMedia).length}`);
console.log(`integrated reads with NO pinned study (written stand-in): ${integratedNoStudy}`);
console.log(`non-integrated reads (answer derived from study, can't mismatch): ${nonIntegrated}`);

// Structured input for the reconciliation workflow.
const { writeFileSync } = await import("node:fs");
const byCase: Record<string, Row[]> = {};
for (const r of rows.filter((x) => x.hasMedia)) (byCase[r.id] ??= []).push(r);
writeFileSync("/tmp/integrated_audit.json", JSON.stringify(byCase, null, 2));
console.log(`\nwrote /tmp/integrated_audit.json — ${Object.keys(byCase).length} cases, ${rows.filter((x) => x.hasMedia).length} reads`);

// Bank catalogs: every study with its REAL expert read, so an agent can re-pin
// to a study whose image genuinely matches a case's required pattern.
function catalog(kind: "ecg" | "cxr", coll: typeof LITFL_ECG_STUDIES): string {
  const media = kind === "ecg" ? LITFL_MEDIA.ecg : LITFL_MEDIA.cxr;
  return coll
    .filter((s) => media[s.n]?.img)
    .map((s) => `#${s.n} | ${s.diagnosis} | ${(media[s.n]?.read ?? s.findings.join("; ")).replace(/\s+/g, " ").slice(0, 220)}`)
    .join("\n");
}
writeFileSync("/tmp/ecg_catalog.txt", catalog("ecg", LITFL_ECG_STUDIES));
writeFileSync("/tmp/cxr_catalog.txt", catalog("cxr", LITFL_CXR_STUDIES));
console.log("wrote /tmp/ecg_catalog.txt and /tmp/cxr_catalog.txt");

console.log("\n=== INTEGRATED READS WITH A REAL PINNED IMAGE ===\n");
for (const r of rows.filter((x) => x.hasMedia)) {
  console.log(`### ${r.id} · ${r.key} (${r.kind}) · study #${r.n} = ${r.pinnedDx}`);
  console.log(`  IMAGE SHOWS  : ${r.imageRead.replace(/\s+/g, " ").slice(0, 240)}`);
  console.log(`  MODEL ANSWER : ${r.authored.replace(/\s+/g, " ").slice(0, 240)}`);
  console.log("");
}
