import { describe, it, expect, beforeEach } from "vitest";
import {
  sanitizeEventProps,
  isEventAllowed,
  analyticsConfigured,
  shouldAskConsent,
  consentState,
  setConsent,
  track,
  studentIdentityProps,
  effectiveConsent,
} from "../telemetry";
import { setStudent, signOut } from "../../auth/identity";

describe("telemetry privacy backstop", () => {
  it("keeps only allowlisted prop keys", () => {
    const out = sanitizeEventProps({
      screen: "drills",
      category: "Chest Pain",
      // these must be dropped — they could carry PII / answers / secrets
      answer: "the patient said their SSN is ...",
      apiKey: "sk-ant-secret",
      email: "a@b.com",
      freeText: "anything",
    });
    expect(out).toEqual({ screen: "drills", category: "Chest Pain" });
    expect(Object.keys(out)).not.toContain("answer");
    expect(Object.keys(out)).not.toContain("apiKey");
  });

  it("caps string length and drops non-primitive values", () => {
    const out = sanitizeEventProps({
      category: "x".repeat(500),
      mode: { nested: true } as unknown as string,
      band: ["a"] as unknown as string,
      difficulty: 3 as unknown as string,
    });
    expect((out.category as string).length).toBe(64);
    expect(out.mode).toBeUndefined(); // object dropped
    expect(out.band).toBeUndefined(); // array dropped
    expect(out.difficulty).toBe(3); // finite number kept
  });

  it("only allows the known event names", () => {
    expect(isEventAllowed("case_complete")).toBe(true);
    expect(isEventAllowed("drill")).toBe(true);
    expect(isEventAllowed("keystroke")).toBe(false);
    expect(isEventAllowed("answer_text")).toBe(false);
  });
});

describe("telemetry consent gating", () => {
  beforeEach(() => {
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
  });

  it("is unconfigured (and silent) with no endpoint/provider env set", () => {
    expect(analyticsConfigured()).toBe(false);
    // No banner when nothing is configured, regardless of consent.
    expect(shouldAskConsent()).toBe(false);
    // track is a safe no-op — never throws.
    expect(() => track("case_complete", { band: "Pass" })).not.toThrow();
    expect(() => track("not_an_event", {})).not.toThrow();
  });

  it("persists a consent choice", () => {
    setConsent(true);
    expect(consentState()).toBe("granted");
    setConsent(false);
    expect(consentState()).toBe("denied");
  });
});

describe("telemetry identity stamping", () => {
  beforeEach(() => localStorage.clear());

  it("omits identity props when not signed in", () => {
    expect(studentIdentityProps()).toEqual({});
  });

  it("includes student email + name when signed in", () => {
    setStudent({ name: "Jane Doe", email: "jane@u.northwestern.edu", consentAt: "", version: 1 });
    expect(studentIdentityProps()).toEqual({
      student_email: "jane@u.northwestern.edu",
      student_name: "Jane Doe",
    });
  });

  it("treats a signed-in student as consented (overrides DNT/unset)", () => {
    expect(effectiveConsent()).toBe("unset");
    setStudent({ name: "Jane", email: "jane@northwestern.edu", consentAt: "", version: 1 });
    expect(effectiveConsent()).toBe("granted");
    signOut();
    expect(effectiveConsent()).toBe("unset");
  });
});
