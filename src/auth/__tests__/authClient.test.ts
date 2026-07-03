import { describe, it, expect, vi, afterEach } from "vitest";
import { signIn } from "../authClient";

const INPUT = { name: "Jane", email: "jane@northwestern.edu", password: "pw", consent: true };

afterEach(() => vi.restoreAllMocks());

function fetchReturning(status: number) {
  return vi.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status } as Response);
}

describe("signIn status mapping", () => {
  it("maps a 2xx response to ok", async () => {
    vi.stubGlobal("fetch", fetchReturning(204));
    expect(await signIn(INPUT, "https://w.example")).toEqual({ ok: true });
  });
  it("maps 401 to bad_password", async () => {
    vi.stubGlobal("fetch", fetchReturning(401));
    expect(await signIn(INPUT, "https://w.example")).toEqual({ ok: false, error: "bad_password" });
  });
  it("maps 400 to bad_email", async () => {
    vi.stubGlobal("fetch", fetchReturning(400));
    expect(await signIn(INPUT, "https://w.example")).toEqual({ ok: false, error: "bad_email" });
  });
  it("maps 403 to consent_required", async () => {
    vi.stubGlobal("fetch", fetchReturning(403));
    expect(await signIn(INPUT, "https://w.example")).toEqual({ ok: false, error: "consent_required" });
  });
  it("maps a thrown fetch to network", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));
    expect(await signIn(INPUT, "https://w.example")).toEqual({ ok: false, error: "network" });
  });
  it("returns unconfigured when no endpoint is given", async () => {
    expect(await signIn(INPUT, "")).toEqual({ ok: false, error: "unconfigured" });
  });
});
