import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Analytics } from "../screens/Analytics";
import { recordDrillBankAttempt } from "../../data/guidelineDrillProgress";
import { FM_DRILL_BANK } from "../../data/guidelineDrillBank";
import { recordMcqAnswer } from "../../data/mcqProgress";
import { IM_BANK } from "../../data/mcqBank";

/**
 * The Analytics "Your Progress" screen used to read only the IM framework drill
 * store, so FM guideline drills and question-bank work never showed up there —
 * the surface where a student would look to see their data "update".
 */
describe("Analytics reflects FM drills and question-bank progress", () => {
  beforeEach(() => localStorage.clear());

  it("surfaces the FM guideline-drill store", () => {
    recordDrillBankAttempt(FM_DRILL_BANK.storageKey, "screening", "screen-colorectal", 100);
    render(<Analytics />);
    expect(screen.getByText(/Guideline drills \(Family Medicine\)/)).toBeInTheDocument();
    expect(screen.getByText(/guidelines tried/)).toBeInTheDocument();
  });

  it("surfaces per-bank question-bank progress", () => {
    recordMcqAnswer(IM_BANK.questions[0].id, true, IM_BANK.storageKey);
    render(<Analytics />);
    expect(screen.getByText(/Question banks/)).toBeInTheDocument();
    expect(screen.getByText(/questions attempted/)).toBeInTheDocument();
    // The IM bank's eyebrow labels its row.
    expect(screen.getByText(new RegExp(IM_BANK.eyebrow))).toBeInTheDocument();
  });
});
