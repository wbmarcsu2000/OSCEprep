import { describe, it, expect } from "vitest";
import { adaptCase } from "../schemaAdapter";
import { askHistoryQuestion } from "../revealEngine";
import { selfChecked, itemMatches } from "../textMatch";
import cp06raw from "../../data/cases/chestpain-06.json";

const cp = adaptCase(cp06raw as never);

describe("broad review-of-systems sweep", () => {
  it("a multi-symptom sweep matching no trigger does NOT re-dump the HPI", () => {
    const r = askHistoryQuestion(
      "do you have fevers, chills, cough, sob, headache, vision changes, weakness, vomiting, blood, abdominal pain, pain with urination, back pain?",
      cp,
      [],
    );
    expect(r.revealedContent).toHaveLength(0);
    expect(r.revealedContent.join(" ")).not.toMatch(/workout|bench|lifting/i);
  });

  it("a focused single question is unaffected by the sweep guard", () => {
    const r = askHistoryQuestion("when did the pain start?", cp, []);
    expect(Array.isArray(r.revealedContent)).toBe(true);
  });
});

describe("lenient practice self-check", () => {
  const coachingItem = "Names costochondritis with supporting features — reproducible tenderness, exercise trigger, low pretest probability";
  it("credits naming the diagnosis even when the rubric item is a coaching sentence", () => {
    expect(itemMatches("costochondritis (leading), rib fracture, mi", coachingItem)).toBe(false);
    expect(selfChecked("costochondritis (leading), rib fracture, mi", coachingItem)).toBe(true);
  });
  it("does not credit on generic filler words alone", () => {
    expect(selfChecked("the patient has a leading diagnosis", coachingItem)).toBe(false);
  });
  it("blank answer covers nothing", () => {
    expect(selfChecked("", coachingItem)).toBe(false);
  });
});
