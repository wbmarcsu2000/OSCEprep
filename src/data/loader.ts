/**
 * Case library access. The manifest (catalog) loads eagerly; individual case
 * files are code-split and loaded on demand, so the app scales to hundreds of
 * cases without growing the initial bundle.
 */

import type { CaseModel, Manifest, RawCase } from "../engine/types";
import { adaptCase } from "../engine/schemaAdapter";
import { applyLitflStudies } from "./litflStudies";
import manifestJson from "./manifest.json";

export const manifest = manifestJson as unknown as Manifest;

const caseModules = import.meta.glob("./cases/*.json");

export async function loadRawCase(id: string): Promise<RawCase> {
  const entry = manifest.cases.find((c) => c.id === id);
  if (!entry) throw new Error(`Unknown case id: ${id}`);
  const key = `./cases/${entry.file}`;
  const loader = caseModules[key];
  if (!loader) throw new Error(`Case file not found: ${entry.file}`);
  const mod = (await loader()) as { default: RawCase };
  return mod.default;
}

export async function loadCase(id: string): Promise<CaseModel> {
  const model = adaptCase(await loadRawCase(id));
  // Assign a specific LITFL study (linked, with a gradeable answer) to each
  // read step, deterministically by the case's position in the catalog.
  const index = manifest.cases.findIndex((c) => c.id === id);
  return applyLitflStudies(model, index < 0 ? 0 : index);
}

export const scoreBands = manifest.defaults.scoreBands;
export const chartTimerSecondsDefault = manifest.defaults.chartTimerSeconds;
export const patientSystemWrapper = manifest.defaults.patientSystemWrapper;
export const examinerSystemWrapper = manifest.defaults.examinerSystemWrapper;
