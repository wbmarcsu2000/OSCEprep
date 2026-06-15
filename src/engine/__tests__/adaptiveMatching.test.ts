import { describe, it, expect } from "vitest";
import { adaptCase } from "../schemaAdapter";
import { askHistoryQuestion, neutralNegative } from "../revealEngine";
import { chestpain01 } from "./fixtures";
import ams03Json from "./__fixtures__/ams-03.fixture.json";
import ams01Json from "./__fixtures__/ams-01.fixture.json";
import type { RawCase } from "../types";

const ams03 = adaptCase(ams03Json as unknown as RawCase);
const ams01 = adaptCase(ams01Json as unknown as RawCase);

// Regression tests for the transcript where the SP failed to adapt:
// "pmh" / "past medical diagnoses?" / "medical history?" → neutral negative,
// "do you have high blood pressure" → wrong "pressure/heaviness" fragment.
const cp01 = adaptCase(chestpain01);

describe("question phrasing variants reach the right trigger", () => {
  it('bare abbreviation "pmh" matches the pmh trigger', () => {
    const r = askHistoryQuestion("pmh", cp01, []);
    expect(r.matchedTriggerIds).toContain("pmh");
    expect(r.revealedContent.join(" ").toLowerCase()).toContain("hypertension");
  });

  it('"medical history?" and "past medical diagnoses?" match pmh', () => {
    for (const q of ["medical history?", "past medical diagnoses?", "any medical conditions?"]) {
      const r = askHistoryQuestion(q, cp01, []);
      expect(r.matchedTriggerIds, q).toContain("pmh");
    }
  });

  it('"do you have high blood pressure" reveals the PMH fact, not chest pressure', () => {
    const r = askHistoryQuestion("do you have high blood pressure", cp01, []);
    expect(r.matchedTriggerIds).toContain("pmh");
    const revealed = r.revealedContent.join(" ").toLowerCase();
    expect(revealed).toContain("hypertension");
    expect(revealed).not.toContain("heaviness");
  });

  it("lay vocabulary reaches medical facts (cholesterol, statin/metformin)", () => {
    const chol = askHistoryQuestion("do you have high cholesterol?", cp01, []);
    expect(chol.matchedTriggerIds).toContain("pmh");
    const why = askHistoryQuestion("why are you taking a statin and metformin?", cp01, []);
    expect(why.revealedContent.join(" ").toLowerCase()).toContain("atorvastatin");
  });

  it("content matching never sidesteps sensitive disclosure rules", () => {
    // "current" appears in the smoking segment ("current smoker") — an
    // unrelated question using that word must not unlock tobacco_use.
    const r = askHistoryQuestion("what is your current living situation?", cp01, []);
    expect(r.matchedTriggerIds).not.toContain("tobacco_use");
    expect(r.revealedContent.join(" ").toLowerCase()).not.toContain("smoker");
  });

  it("off-target questions still reveal nothing", () => {
    const r = askHistoryQuestion("do you enjoy gardening on weekends?", cp01, []);
    expect(r.matchedTriggerIds).toEqual([]);
    expect(r.revealedContent).toEqual([]);
  });

  it("tolerates typos in question vocabulary", () => {
    const r = askHistoryQuestion("aggravatiang or alleviation factors?", cp01, []);
    expect(r.matchedTriggerIds).toContain("aggravating_alleviating");
  });
});

describe("poor-historian fallback (ams-03)", () => {
  it("a timeline question answers with the patient's HPI self-description, not a denial", () => {
    for (const q of ["when did this start", "onset", "how long has this been going on"]) {
      const r = askHistoryQuestion(q, ams03, []);
      expect(r.matchedTriggerIds, q).toContain("onset");
      const revealed = r.revealedContent.join(" ").toLowerCase();
      expect(revealed, q).toContain("shaky");
      expect(revealed, q).toContain("timeline");
    }
  });

  it("collateral unlocks when the student asks about family or medications", () => {
    const r = askHistoryQuestion("what do his family say happened? any medications?", ams03, []);
    const revealed = r.revealedContent.join(" ").toLowerCase();
    expect(revealed).toContain("insulin");
    expect(revealed).toContain("skipped lunch");
  });

  it("a focused question gets a focused answer, not a chart dump", () => {
    // "what meds are you on" → the med list, NOT the collateral narrative or PMH.
    const meds = askHistoryQuestion("what meds are you on", ams01, []).revealedContent
      .join(" ").toLowerCase();
    expect(meds).toContain("lactulose");
    expect(meds).not.toContain("confusion"); // collateral narrative excluded
    expect(meds).not.toContain("foggy"); // HPI excluded
    // "past medical history" → the PMH, NOT the HPI/social/collateral.
    const pmh = askHistoryQuestion("past medical history", ams01, []).revealedContent
      .join(" ").toLowerCase();
    expect(pmh).toContain("cirrhosis");
    expect(pmh).not.toContain("foggy");
    expect(pmh).not.toContain("alcohol");
  });
});

describe("question-type-aware neutral negatives", () => {
  it("never gives a yes/no denial to a when/how-long question", () => {
    expect(neutralNegative("when did this start")).not.toMatch(/^no|^not/i);
    expect(neutralNegative("how long has this been going on")).not.toMatch(/^no|^not/i);
  });

  it("deflects meta-comments instead of denying them", () => {
    expect(neutralNegative("stop answering like that")).toMatch(/what would you like to know/i);
    expect(neutralNegative("you suck")).toMatch(/what would you like to know/i);
  });

  it("keeps yes/no negatives for yes/no questions", () => {
    expect(neutralNegative("do you have any rashes?")).toMatch(/^no|^not/i);
  });
});
