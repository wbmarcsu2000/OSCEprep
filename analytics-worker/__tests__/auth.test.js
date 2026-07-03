import { describe, it, expect } from "vitest";
import { isNorthwesternEmail, evaluateAuth } from "../auth.js";

describe("isNorthwesternEmail (worker)", () => {
  it("accepts the root domain and subdomains", () => {
    expect(isNorthwesternEmail("a@northwestern.edu")).toBe(true);
    expect(isNorthwesternEmail("a@u.northwestern.edu")).toBe(true);
    expect(isNorthwesternEmail("A@U.NORTHWESTERN.EDU")).toBe(true);
  });
  it("rejects other domains and look-alikes", () => {
    expect(isNorthwesternEmail("a@gmail.com")).toBe(false);
    expect(isNorthwesternEmail("a@notnorthwestern.edu")).toBe(false);
    expect(isNorthwesternEmail("a@northwestern.edu.attacker.com")).toBe(false);
    expect(isNorthwesternEmail("a")).toBe(false);
  });
});

describe("evaluateAuth", () => {
  const good = { name: "Jane", email: "jane@u.northwestern.edu", password: "secret", consent: true };

  it("requires consent FIRST — 403 even with the right password", () => {
    expect(evaluateAuth({ ...good, consent: false }, "secret")).toMatchObject({
      ok: false,
      status: 403,
      error: "consent_required",
    });
  });
  it("rejects a wrong password with 401", () => {
    expect(evaluateAuth({ ...good, password: "nope" }, "secret")).toMatchObject({
      ok: false,
      status: 401,
      error: "bad_password",
    });
  });
  it("rejects an empty configured password with 401 (never allows blank)", () => {
    expect(evaluateAuth({ ...good, password: "" }, "")).toMatchObject({ ok: false, status: 401 });
  });
  it("rejects a non-northwestern email with 400", () => {
    expect(evaluateAuth({ ...good, email: "jane@gmail.com" }, "secret")).toMatchObject({
      ok: false,
      status: 400,
      error: "bad_email",
    });
  });
  it("accepts a valid, consented attempt", () => {
    expect(evaluateAuth(good, "secret")).toEqual({ ok: true, status: 200 });
  });
});
