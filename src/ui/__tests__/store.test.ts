import { describe, it, expect, beforeEach, vi } from "vitest";
import { adaptCase } from "../../engine/schemaAdapter";
import {
  createSession,
  transition,
  serializeSession,
  SESSION_STORAGE_KEY,
} from "../../engine/stateMachine";
import { chestpain01 } from "../../engine/__tests__/fixtures";
import { loadAttempts } from "../../analytics/store";
import { useAppStore, applyHash } from "../store";

const cp01 = adaptCase(chestpain01);

/** A POST_ENCOUNTER engine whose strict-mode clock is already in the past. */
function expiredPostEngine() {
  let engine = createSession(cp01, "STRICT_OSCE", Date.now() - 60 * 60 * 1000);
  engine = transition(engine, "PATIENT_ENCOUNTER", cp01, Date.now() - 50 * 60 * 1000);
  engine = transition(engine, "POST_ENCOUNTER", cp01, Date.now() - 25 * 60 * 1000);
  return engine;
}

function resetStore() {
  useAppStore.setState({
    view: "home",
    caseModel: null,
    engine: null,
    pendingResume: null,
    review: null,
    grading: false,
    timeExpired: false,
    coaching: {},
    coachingPending: false,
  });
}

describe("store orchestration", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
    window.history.replaceState(null, "", "#/");
  });

  it("post-encounter timeout submits through the full pipeline exactly once", async () => {
    useAppStore.setState({ caseModel: cp01, engine: expiredPostEngine(), view: "station" });

    useAppStore.getState().tick();
    expect(useAppStore.getState().timeExpired).toBe(true);
    await vi.waitFor(() => {
      expect(useAppStore.getState().engine?.submitted).toBe(true);
    });
    expect(loadAttempts()).toHaveLength(1);

    // Subsequent ticks / manual submits must not double-record.
    useAppStore.getState().tick();
    await useAppStore.getState().submitStation();
    expect(loadAttempts()).toHaveLength(1);
  });

  it("concurrent submitStation calls record a single attempt", async () => {
    let engine = createSession(cp01, "PRACTICE", Date.now());
    engine = transition(engine, "PATIENT_ENCOUNTER", cp01, Date.now());
    engine = transition(engine, "POST_ENCOUNTER", cp01, Date.now());
    useAppStore.setState({ caseModel: cp01, engine, view: "station" });

    await Promise.all([
      useAppStore.getState().submitStation(),
      useAppStore.getState().submitStation(),
    ]);
    expect(useAppStore.getState().engine?.submitted).toBe(true);
    expect(loadAttempts()).toHaveLength(1);
  });

  it("resume is an offer: stale strict sessions never auto-submit or change view", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, serializeSession(expiredPostEngine()));

    const found = await useAppStore.getState().resumeSession();
    expect(found).toBe(true);
    const s = useAppStore.getState();
    expect(s.view).toBe("home"); // still wherever the user was
    expect(s.pendingResume).not.toBeNull();
    expect(loadAttempts()).toHaveLength(0); // nothing recorded silently
  });

  it("acceptResume re-bases the expired deadline so the timer paused while away", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, serializeSession(expiredPostEngine()));
    await useAppStore.getState().resumeSession();

    useAppStore.getState().acceptResume();
    const s = useAppStore.getState();
    expect(s.view).toBe("station");
    expect(s.engine?.phaseDeadline).toBeGreaterThan(Date.now());

    // The first tick must not insta-submit the resumed station.
    useAppStore.getState().tick();
    expect(useAppStore.getState().engine?.submitted).toBe(false);
    expect(loadAttempts()).toHaveLength(0);
  });

  it("discardResume clears the saved session without recording anything", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, serializeSession(expiredPostEngine()));
    await useAppStore.getState().resumeSession();

    useAppStore.getState().discardResume();
    expect(useAppStore.getState().pendingResume).toBeNull();
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    expect(loadAttempts()).toHaveLength(0);
  });

  it("resumeSession survives garbage payloads", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, "{not json");
    expect(await useAppStore.getState().resumeSession()).toBe(false);
    expect(useAppStore.getState().pendingResume).toBeNull();
  });

  it("setView mirrors into the hash and applyHash maps back", () => {
    useAppStore.getState().setView("drills");
    expect(window.location.hash).toBe("#/drills");

    applyHash("#/performance");
    expect(useAppStore.getState().view).toBe("analytics");

    applyHash("#/station"); // no live station → fall back to the library
    expect(useAppStore.getState().view).toBe("select");
  });

  it("preferredMode persists across store reads", () => {
    useAppStore.getState().setPreferredMode("STRICT_OSCE");
    expect(localStorage.getItem("osce.mode")).toBe("STRICT_OSCE");
    expect(useAppStore.getState().preferredMode).toBe("STRICT_OSCE");
  });
});
