import { describe, it, expect } from "vitest";
import { cleanIdealAnswer } from "../format";

describe("cleanIdealAnswer", () => {
  it("strips a trailing empty 'Also reasonable: .'", () => {
    const s = "Leading diagnosis: Costochondritis. Must-not-miss diagnoses to exclude: deprioritizes ACS. Also reasonable: .";
    expect(cleanIdealAnswer(s)).toBe("Leading diagnosis: Costochondritis. Must-not-miss diagnoses to exclude: deprioritizes ACS.");
  });
  it("leaves a complete answer untouched", () => {
    const s = "Leading diagnosis: NSTEMI. Also reasonable: aortic dissection, PE.";
    expect(cleanIdealAnswer(s)).toBe(s);
  });
  it("handles null/empty", () => {
    expect(cleanIdealAnswer(null)).toBe("");
    expect(cleanIdealAnswer("")).toBe("");
  });
});
