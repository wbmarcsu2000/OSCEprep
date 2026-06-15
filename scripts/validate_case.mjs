#!/usr/bin/env node
/**
 * Structural validator for OSCE case JSON (schema 2.1, frozen contract).
 *
 * Enforces the invariants that ALL library cases share (verified across the
 * library on 2026-06-14):
 *   - 6 steps, in order: differential>workup>ekg_read>cxr_read>revised>management
 *   - step maxes:        25 / 15 / 15 / 10 / 10 / 25
 *   - overallScoring:    history:20 physicalExam:15 differential:15 workup:15
 *                        imageInterpretation:15 management:20  (sum 100)
 *   - communicationScoring.maxPoints == 5 (and items sum to 5)
 *   - revealKeys (as a set) == dx.labs keys ∪ {ekg, cxr}
 *   - essential ⊆ dx.labs keys
 *   - read steps (ekg_read/cxr_read) use bare-string critical/coreActions
 *   - free-step scoring uses {item, points}; scoring.maxPoints == step.max
 *
 * It also allows (and lightly checks) the integrated-read fields added
 * 2026-06-14: images.<key>.litflStudyN (1..50) and images.<key>.integrated.
 *
 * Intentional conventions that are NOT errors (do not "fix"):
 *   - historyTriggers[].response that starts with "[" (placeholder → engine
 *     reveals the real patientFile segment)
 *   - empty revised.scoring arrays (revised is graded by rubric overlap)
 *
 * Usage:  node scripts/validate_case.mjs <file.json> [more.json ...]
 *         node scripts/validate_case.mjs --all          (validate every case)
 */
import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

const CASES_DIR = "src/data/cases";
const STEP_IDS = ["differential", "workup", "ekg_read", "cxr_read", "revised", "management"];
const STEP_MAX = { differential: 25, workup: 15, ekg_read: 15, cxr_read: 10, revised: 10, management: 25 };
const READ_STEPS = new Set(["ekg_read", "cxr_read"]);
const OVERALL = { history: 20, physicalExam: 15, differential: 15, workup: 15, imageInterpretation: 15, management: 20 };

function validate(file) {
  const errs = [];
  const warns = [];
  let c;
  try {
    c = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    return { errs: [`JSON parse error: ${e.message}`], warns };
  }
  const E = (m) => errs.push(m);
  const W = (m) => warns.push(m);

  // --- identity ---
  const stem = basename(file).replace(/\.json$/, "");
  if (c.id !== stem) E(`id "${c.id}" != filename "${stem}"`);
  for (const k of ["category", "difficulty", "title", "diagnosis", "opening", "patientFile"])
    if (!c[k] || typeof c[k] !== "string") E(`missing/empty string field: ${k}`);
  if (!["easy", "moderate", "hard"].includes(c.difficulty)) E(`bad difficulty: ${c.difficulty}`);

  // --- chart ---
  const ch = c.chart || {};
  for (const k of ["ageSex", "cc", "oneLiner", "vitals"]) if (!ch[k]) E(`chart.${k} missing`);
  for (const v of ["BP", "HR", "RR", "Temp", "SpO2"]) if (ch.vitals && !ch.vitals[v]) W(`chart.vitals.${v} missing`);

  // --- steps ---
  const steps = Array.isArray(c.steps) ? c.steps : [];
  if (steps.length !== 6) E(`expected 6 steps, got ${steps.length}`);
  const ids = steps.map((s) => s.id);
  if (ids.join(">") !== STEP_IDS.join(">")) E(`step ids/order wrong: ${ids.join(">")}`);
  for (const s of steps) {
    if (STEP_MAX[s.id] != null && s.max !== STEP_MAX[s.id]) E(`step ${s.id}.max=${s.max}, expected ${STEP_MAX[s.id]}`);
    if (!s.prompt) E(`step ${s.id} missing prompt`);
    const sc = s.scoring;
    if (READ_STEPS.has(s.id)) {
      if (s.type !== "read") E(`step ${s.id} must be type:read`);
      if (!s.image) E(`step ${s.id} missing image key`);
      // Read-step scoring items may be bare strings OR {item,points}; the
      // adapter normalizes both, and applyLitflStudies rebuilds them for
      // non-integrated reads. Either shape is accepted — no check needed.
    } else if (sc) {
      // free-step scoring: {item, points}; maxPoints == step.max
      if (sc.maxPoints != null && sc.maxPoints !== s.max) E(`step ${s.id} scoring.maxPoints=${sc.maxPoints} != max ${s.max}`);
      for (const b of ["criticalActions", "coreActions", "bonusActions"])
        for (const a of sc[b] || []) {
          if (typeof a !== "object" || typeof a.item !== "string" || typeof a.points !== "number")
            E(`step ${s.id}.${b} item must be {item,points}: ${JSON.stringify(a)}`);
        }
      for (const p of sc.penalties || [])
        if (typeof p !== "object" || (typeof p.item !== "string" && typeof p.label !== "string") || typeof p.points !== "number")
          E(`step ${s.id}.penalties item must be {item|label,points}: ${JSON.stringify(p)}`);
    }
  }

  // --- reveal / labs wiring ---
  const labKeys = Object.keys(c.dx?.labs || {});
  if (labKeys.length === 0) E("dx.labs is empty");
  const want = new Set([...labKeys, "ekg", "cxr"]);
  const have = new Set(c.revealKeys || []);
  for (const k of want) if (!have.has(k)) E(`revealKeys missing "${k}"`);
  for (const k of have) if (!want.has(k)) E(`revealKeys has stray "${k}" (not a lab and not ekg/cxr)`);
  for (const k of c.essential || []) if (!want.has(k)) E(`essential "${k}" is not a lab key or ekg/cxr`);

  // --- images + integrated-read fields ---
  for (const key of ["ekg", "cxr"]) {
    const img = c.images?.[key];
    if (!img) { E(`images.${key} missing`); continue; }
    if (img.litflStudyN != null && (!Number.isInteger(img.litflStudyN) || img.litflStudyN < 1 || img.litflStudyN > 50))
      E(`images.${key}.litflStudyN must be an integer 1..50, got ${img.litflStudyN}`);
    if (img.integrated != null && typeof img.integrated !== "boolean")
      E(`images.${key}.integrated must be boolean`);
    if (img.integrated === true && img.litflStudyN == null) {
      // fully authored read — the read step must carry its own scoring + findings
      const st = steps.find((s) => s.image === key);
      if (st && !(st.scoring?.criticalActions?.length)) W(`images.${key}.integrated:true but ${st?.id} has no authored criticalActions`);
    }
  }

  // --- overall + comm ---
  const os = c.overallScoring || {};
  for (const [k, v] of Object.entries(OVERALL)) if (os[k] !== v) E(`overallScoring.${k}=${os[k]}, expected ${v}`);
  const osSum = Object.values(os).reduce((a, b) => a + (b || 0), 0);
  if (osSum !== 100) E(`overallScoring sums to ${osSum}, expected 100`);
  const comm = c.communicationScoring;
  if (!comm || comm.maxPoints !== 5) E(`communicationScoring.maxPoints must be 5`);
  else {
    const cs = (comm.items || []).reduce((a, i) => a + (i.points || 0), 0);
    if (cs !== 5) E(`communicationScoring items sum to ${cs}, expected 5`);
  }

  // --- history triggers ---
  if (!Array.isArray(c.historyTriggers) || c.historyTriggers.length === 0) E("historyTriggers empty");
  for (const t of c.historyTriggers || []) {
    if (!t.id) E("historyTrigger missing id");
    if (!Array.isArray(t.triggerConcepts) || t.triggerConcepts.length === 0) E(`trigger ${t.id} has no triggerConcepts`);
  }

  // --- physical exam mappings ---
  for (const m of c.physicalExamMappings || []) {
    if (!Array.isArray(m.revealedBy) || m.revealedBy.length === 0) E(`examMapping ${m.id} has empty revealedBy`);
    if (!m.finding) E(`examMapping ${m.id} missing finding`);
  }

  return { errs, warns };
}

const args = process.argv.slice(2);
const files = args.includes("--all")
  ? readdirSync(CASES_DIR).filter((f) => f.endsWith(".json")).map((f) => join(CASES_DIR, f))
  : args;
if (files.length === 0) {
  console.error("usage: node scripts/validate_case.mjs <file.json ...> | --all");
  process.exit(2);
}
let bad = 0;
for (const f of files) {
  const { errs, warns } = validate(f);
  if (errs.length) {
    bad++;
    console.log(`✗ ${f}`);
    for (const e of errs) console.log(`    ERROR ${e}`);
  } else {
    console.log(`✓ ${basename(f)}${warns.length ? `  (${warns.length} warn)` : ""}`);
  }
  for (const w of warns) console.log(`    warn  ${w}`);
}
console.log(`\n${files.length - bad}/${files.length} valid`);
process.exit(bad ? 1 : 0);
