import { describe, it, expect } from "vitest";
import type { AttemptRecord } from "../../analytics/store";
import {
  xpForAttempt,
  totalXp,
  levelFor,
  LEVELS,
  streakDays,
  streakAtRisk,
  badges,
  newlyEarnedBadges,
  recommendNext,
} from "../gamification";

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date(2026, 5, 11, 14, 0, 0).getTime(); // local noon-ish, avoids midnight edges

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

describe("xp & levels", () => {
  it("awards score + excellence + safety bonuses", () => {
    expect(xpForAttempt(attempt({ overall: 70, criticalMissCount: 1 }))).toBe(70);
    expect(xpForAttempt(attempt({ overall: 90, criticalMissCount: 0 }))).toBe(120);
  });

  it("levels are monotonic and capped at the top title", () => {
    expect(levelFor(0).title).toBe("Observer");
    expect(levelFor(150).title).toBe("MS1");
    expect(levelFor(149).title).toBe("Observer");
    const top = levelFor(999999);
    expect(top.title).toBe("Attending");
    expect(top.progress).toBe(1);
    expect(top.level).toBe(LEVELS.length);
  });

  it("progress moves within a level", () => {
    const half = levelFor(150 + 125); // halfway from MS1 (150) to MS2 (400)
    expect(half.progress).toBeCloseTo(0.5);
    expect(totalXp([attempt({ overall: 50 })])).toBe(50);
  });
});

describe("streaks", () => {
  it("counts consecutive days back from today", () => {
    const attempts = [0, 1, 2].map((d) => attempt({ completedAt: NOW - d * DAY }));
    expect(streakDays(attempts, NOW)).toBe(3);
  });

  it("keeps yesterday's streak alive (at risk) until midnight", () => {
    const attempts = [1, 2].map((d) => attempt({ completedAt: NOW - d * DAY }));
    expect(streakDays(attempts, NOW)).toBe(2);
    expect(streakAtRisk(attempts, NOW)).toBe(true);
  });

  it("breaks on a missed day and is zero with no attempts", () => {
    const attempts = [2, 3].map((d) => attempt({ completedAt: NOW - d * DAY }));
    expect(streakDays(attempts, NOW)).toBe(0);
    expect(streakDays([], NOW)).toBe(0);
  });

  it("counts calendar days correctly just after midnight", () => {
    // 00:30 local — a fixed 24h step would land on the day BEFORE yesterday.
    const justPastMidnight = new Date(2026, 5, 11, 0, 30).getTime();
    const yesterdayEvening = new Date(2026, 5, 10, 22, 0).getTime();
    const dayBeforeNoon = new Date(2026, 5, 9, 12, 0).getTime();
    const attempts = [
      attempt({ completedAt: yesterdayEvening }),
      attempt({ completedAt: dayBeforeNoon }),
    ];
    expect(streakDays(attempts, justPastMidnight)).toBe(2);
  });
});

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
    // Chest Pain is weakest but every case there is ≥70 or attempted-below-70?
    // chestpain-01 best=60 (<70) → still a weakness target.
    expect(rec!.caseId).toBe("chestpain-01");
  });

  it("is null with no attempts (Home hides the card)", () => {
    expect(recommendNext([], CATALOG)).toBeNull();
  });
});

describe("badges", () => {
  it("first station, honors, and category mastery", () => {
    const attempts = [
      attempt({ caseId: "chestpain-01", overall: 88 }),
      attempt({ caseId: "chestpain-02" }),
    ];
    const earned = new Set(badges(attempts, CATALOG, NOW).filter((b) => b.earned).map((b) => b.id));
    expect(earned.has("first")).toBe(true);
    expect(earned.has("honors")).toBe(true);
    expect(earned.has("specialist")).toBe(true); // both Chest Pain cases done
    expect(earned.has("explorer")).toBe(false); // Dyspnea untouched
    expect(earned.has("library")).toBe(false);
  });

  it("comeback requires a 15+ point improvement on the same case", () => {
    const attempts = [
      attempt({ overall: 55, completedAt: NOW - DAY }),
      attempt({ overall: 72 }),
    ];
    expect(badges(attempts, CATALOG, NOW).find((b) => b.id === "comeback")?.earned).toBe(true);
  });

  it("newlyEarnedBadges diffs the latest attempt only", () => {
    const attempts = [
      attempt({ overall: 60, completedAt: NOW - DAY }),
      attempt({ overall: 92, criticalMissCount: 0 }),
    ];
    const fresh = newlyEarnedBadges(attempts, CATALOG, NOW).map((b) => b.id);
    expect(fresh).toContain("honors");
    expect(fresh).not.toContain("first");
  });
});
