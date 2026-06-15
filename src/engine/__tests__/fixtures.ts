import type { RawCase } from "../types";
// Frozen copies (original schema-2.1 content) so engine unit tests stay stable
// while the live case library is revised. Do NOT repoint these at live cases.
import chestpain01Json from "./__fixtures__/chestpain-01.fixture.json";
import dyspnea01Json from "./__fixtures__/dyspnea-01.fixture.json";

export const chestpain01 = chestpain01Json as unknown as RawCase;
export const dyspnea01 = dyspnea01Json as unknown as RawCase;

/** Original-schema-only fixture: the same case with every upgraded (2.1)
 *  field stripped, exercising all adapter fallbacks. */
export function asOriginalSchema(raw: RawCase): RawCase {
  const clone = JSON.parse(JSON.stringify(raw)) as RawCase;
  delete clone.standardizedPatient;
  delete clone.historyTriggers;
  delete clone.physicalExamMappings;
  delete clone.overallScoring;
  delete clone.caseSummary;
  delete clone.communicationScoring;
  delete clone.libraryUpgrade;
  return clone;
}

export const SCORE_BANDS = [
  { min: 85, label: "Honors-level reasoning" },
  { min: 70, label: "Solid pass" },
  { min: 55, label: "Borderline — review the can't-miss buckets" },
  { min: 0, label: "Needs significant review" },
];
