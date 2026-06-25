import { describe, it, expect } from "vitest";
import type { AttemptRecord } from "../../analytics/store";
import { recommendNext } from "../gamification";

const NOW = new Date(2026, 5, 11, 14, 0, 0).getTime();

function attempt(over: Partial<AttemptRecord> = {}): AttemptRecord {
  return {
    caseId: "chestpain-01",
    category: "Chest Pain",
    difficulty: "moderate",
    diagnosis: "x",
    mode: "STRICT_OSCE",
    completedAt: NOW,
    overall: 70,
    band: "Pass",
    domainScores: {},
    domainMax: {},
    missedTriggerIds: [],
    missedManeuverIds: [],
    penalties: [],
    unsafeActions: [],
    criticalMissCount: 1,
    ...over,
  };
}

const CATALOG = [
  { id: "chestpain-01", category: "Chest Pain" },
  { id: "chestpain-02", category: "Chest Pain" },
  { id: "dyspnea-01", category: "Dyspnea" },
];

describe("recommendNext", () => {
  it("targets the weakest category with an unattempted case", () => {
    const attempts = [
      attempt({ caseId: "chestpain-01", category: "Chest Pain", overall: 50 }),
      attempt({ caseId: "dyspnea-01", category: "Dyspnea", overall: 90 }),
    ];
    const rec = recommendNext(attempts, CATALOG);
    expect(rec).not.toBeNull();
    expect(rec!.kind).toBe("weakness");
    expect(rec!.caseId).toBe("chestpain-02"); // unattempted in the weak category
    expect(rec!.reason).toContain("Chest Pain");
  });

  it("falls back to a retry of the lowest score when categories are exhausted", () => {
    const attempts = [
      attempt({ caseId: "chestpain-01", category: "Chest Pain", overall: 60 }),
      attempt({ caseId: "chestpain-02", category: "Chest Pain", overall: 72 }),
      attempt({ caseId: "dyspnea-01", category: "Dyspnea", overall: 74 }),
    ];
    const rec = recommendNext(attempts, CATALOG);
    expect(rec).not.toBeNull();
    // chestpain-01 best=60 (<70) → still a weakness target.
    expect(rec!.caseId).toBe("chestpain-01");
  });

  it("is null with no attempts (Home hides the card)", () => {
    expect(recommendNext([], CATALOG)).toBeNull();
  });
});
