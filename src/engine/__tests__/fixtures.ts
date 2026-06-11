import type { RawCase } from "../types";
import chestpain01Json from "../../data/cases/chestpain-01.json";
import dyspnea01Json from "../../data/cases/dyspnea-01.json";

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
