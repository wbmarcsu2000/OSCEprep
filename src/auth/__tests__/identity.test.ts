import { describe, it, expect, beforeEach } from "vitest";
import {
  isNorthwesternEmail,
  validateEmail,
  getCurrentStudent,
  setStudent,
  signOut,
  isSignedIn,
  STUDENT_KEY,
  IDENTITY_VERSION,
} from "../identity";

describe("isNorthwesternEmail", () => {
  it("accepts northwestern.edu and any subdomain, case-insensitively", () => {
    expect(isNorthwesternEmail("jane@northwestern.edu")).toBe(true);
    expect(isNorthwesternEmail("jane.doe@u.northwestern.edu")).toBe(true);
    expect(isNorthwesternEmail("JANE@U.NORTHWESTERN.EDU")).toBe(true);
  });
  it("rejects other domains and malformed input", () => {
    expect(isNorthwesternEmail("jane@gmail.com")).toBe(false);
    expect(isNorthwesternEmail("jane@notnorthwestern.edu")).toBe(false);
    expect(isNorthwesternEmail("jane@northwestern.edu.evil.com")).toBe(false);
    expect(isNorthwesternEmail("jane")).toBe(false);
    expect(isNorthwesternEmail("")).toBe(false);
  });
});

describe("validateEmail", () => {
  it("ok for a northwestern address, reason otherwise", () => {
    expect(validateEmail("jane@northwestern.edu").ok).toBe(true);
    expect(validateEmail("").ok).toBe(false);
    expect(validateEmail("jane@gmail.com")).toEqual({
      ok: false,
      reason: "Use your @northwestern.edu email.",
    });
  });
});

describe("identity storage", () => {
  beforeEach(() => localStorage.clear());
  it("round-trips a student", () => {
    expect(getCurrentStudent()).toBeNull();
    expect(isSignedIn()).toBe(false);
    setStudent({
      name: "Jane Doe",
      email: "jane@u.northwestern.edu",
      consentAt: "2026-06-30T00:00:00.000Z",
      version: IDENTITY_VERSION,
    });
    expect(isSignedIn()).toBe(true);
    expect(getCurrentStudent()).toMatchObject({
      name: "Jane Doe",
      email: "jane@u.northwestern.edu",
    });
  });
  it("signOut clears identity", () => {
    setStudent({ name: "Jane", email: "jane@northwestern.edu", consentAt: "", version: 1 });
    signOut();
    expect(getCurrentStudent()).toBeNull();
  });
  it("returns null on corrupt storage", () => {
    localStorage.setItem(STUDENT_KEY, "{not json");
    expect(getCurrentStudent()).toBeNull();
  });
});
