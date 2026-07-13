import { useEffect, useState } from "react";
import { useAppStore, applyHash, type View } from "./ui/store";
import { CaseSelect } from "./ui/screens/CaseSelect";
import { ChartReview } from "./ui/screens/ChartReview";
import { Encounter } from "./ui/screens/Encounter";
import { PostEncounter } from "./ui/screens/PostEncounter";
import { Feedback, ReviewScreen } from "./ui/screens/Feedback";
import { Analytics } from "./ui/screens/Analytics";
import { Skills } from "./ui/screens/Skills";
import { Drills } from "./ui/screens/Drills";
import { Differentials } from "./ui/screens/Differentials";
import { WorkupManagement } from "./ui/screens/WorkupManagement";
import { Shelf } from "./ui/screens/Shelf";
import { Qbank } from "./ui/screens/Qbank";
import { FmDrills } from "./ui/screens/FmDrills";
import { IM_BANK, FM_BANK, OB_BANK } from "./data/mcqBank";
import { Neuro } from "./ui/screens/Neuro";
import { Home } from "./ui/screens/Home";
import { PhaseHeader } from "./ui/components/PhaseHeader";
import { DevTools } from "./ui/components/DevTools";
import { initTelemetry, analyticsEndpointConfigured } from "./analytics/telemetry";
import { LoginGate } from "./ui/components/LoginGate";
import { isSignedIn } from "./auth/identity";
import { CLERKSHIPS, clerkshipForView, type Clerkship } from "./ui/clerkships";

/** Top-level clerkship tabs (IM, Neuro, …) in the header outside a station. */
function ClerkshipTabs({ view }: { view: View }) {
  const setView = useAppStore((s) => s.setView);
  const active = clerkshipForView(view);
  return (
    <nav
      className="flex flex-1 min-w-0 items-center gap-1 overflow-x-auto scroll-quiet"
      aria-label="Clerkships"
      style={{
        // Fade the right edge so scrolled-off clerkships read as "more this way".
        maskImage: "linear-gradient(to right, #000 calc(100% - 20px), transparent)",
        WebkitMaskImage: "linear-gradient(to right, #000 calc(100% - 20px), transparent)",
      }}
    >
      {CLERKSHIPS.map((c) => {
        const isActive = active?.id === c.id;
        return (
          <button
            key={c.id}
            onClick={() => setView(c.tools[0].view)}
            aria-current={isActive ? "page" : undefined}
            className="text-[13px] font-extrabold rounded-full px-4 py-1.5 whitespace-nowrap shrink-0 transition-colors"
            style={{
              background: isActive ? "rgba(255,255,255,0.22)" : "transparent",
              color: isActive ? "#fff" : "rgba(255,255,255,0.72)",
            }}
          >
            {c.short}
          </button>
        );
      })}
    </nav>
  );
}

/** Sub-nav of the active clerkship's tools — a slim bar beneath the header. */
function ToolSubnav({ clerkship, view }: { clerkship: Clerkship; view: View }) {
  const setView = useAppStore((s) => s.setView);
  return (
    <div
      className="shrink-0 border-b"
      style={{ background: "var(--color-exam-panel)", borderColor: "var(--color-exam-border)" }}
    >
      <nav className="px-4 sm:px-5 flex items-center gap-1 overflow-x-auto scroll-quiet" aria-label={`${clerkship.full} tools`}>
        {clerkship.tools.map((t) => {
          const isActive = view === t.view;
          return (
            <button
              key={t.view}
              onClick={() => setView(t.view)}
              aria-current={isActive ? "page" : undefined}
              className="text-[13px] font-bold px-3 py-2.5 -mb-px whitespace-nowrap shrink-0 border-b-2 transition-colors"
              style={{
                borderColor: isActive ? "var(--color-exam-accent)" : "transparent",
                color: isActive ? "var(--color-exam-accent-deep)" : "var(--color-exam-muted)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/** Offer — never force — picking an interrupted station back up. */
function ResumeBanner() {
  const pendingResume = useAppStore((s) => s.pendingResume);
  const acceptResume = useAppStore((s) => s.acceptResume);
  const discardResume = useAppStore((s) => s.discardResume);
  if (!pendingResume) return null;
  const { engine, caseModel } = pendingResume;
  const phaseLabel: Record<string, string> = {
    CHART_REVIEW: "Chart review",
    PATIENT_ENCOUNTER: "Patient encounter",
    POST_ENCOUNTER: "Post-encounter",
    FEEDBACK: "Feedback",
  };
  const timed = engine.phaseDeadline !== null && engine.currentState !== "FEEDBACK";
  return (
    <div
      role="region"
      aria-label="Unfinished OSCE case"
      className="px-4 sm:px-6 py-2.5 flex items-center gap-3 flex-wrap border-b fade-up"
      style={{ background: "var(--color-exam-accent-soft)", borderColor: "var(--color-exam-accent-line)" }}
    >
      <span aria-hidden>⏸️</span>
      <span className="text-[13px] font-bold min-w-0" style={{ color: "var(--color-exam-accent-deep)" }}>
        Unfinished OSCE case: {caseModel.chart.ageSex} — {caseModel.chart.cc}
        <span className="font-semibold opacity-75">
          {" "}· {phaseLabel[engine.currentState]}{timed ? " · timer paused while you were away" : ""}
        </span>
      </span>
      <span className="flex gap-2 ml-auto shrink-0">
        <button className="btn btn-primary py-1" onClick={acceptResume}>
          Resume
        </button>
        <button className="btn py-1" onClick={discardResume}>
          Discard
        </button>
      </span>
    </div>
  );
}

export default function App() {
  const view = useAppStore((s) => s.view);
  const caseModel = useAppStore((s) => s.caseModel);
  const engine = useAppStore((s) => s.engine);
  const tick = useAppStore((s) => s.tick);
  const resumeSession = useAppStore((s) => s.resumeSession);
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const setView = useAppStore((s) => s.setView);
  const [confirmExit, setConfirmExit] = useState(false);
  // Hard gate: signing in is required to use the app whenever an analytics
  // Worker is configured. With no endpoint (local dev / tests) the gate is
  // bypassed so the app is usable without a server.
  const [signedIn, setSignedIn] = useState(() => !analyticsEndpointConfigured() || isSignedIn());

  const inStation = view === "station" && caseModel && engine;
  const stationLive = !!inStation && engine.currentState !== "FEEDBACK";
  // The clerkship that owns the current view (undefined on home/review) drives
  // the active header tab and whether the tool sub-nav shows.
  const activeClerkship = clerkshipForView(view);

  // Restore an interrupted session (as an offer) and honor a deep link.
  useEffect(() => {
    void resumeSession();
    initTelemetry();
    try {
      if (window.location.hash && window.location.hash !== "#/") applyHash(window.location.hash);
    } catch {
      // non-browser env
    }
  }, [resumeSession]);

  // Browser Back/Forward: map the hash back into the store. Backing out of a
  // live station opens the existing confirm-exit flow instead of silently
  // dropping progress.
  useEffect(() => {
    const onPop = () => {
      const s = useAppStore.getState();
      const live =
        s.view === "station" && s.engine && s.caseModel && s.engine.currentState !== "FEEDBACK";
      if (live) {
        window.history.pushState(null, "", "#/station");
        setConfirmExit(true);
        return;
      }
      applyHash(window.location.hash);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Wall-clock-based tick: the engine recomputes from Date.now() deltas, so a
  // throttled or backgrounded tab catches up correctly on the next tick. Only
  // runs while a station is actually live.
  useEffect(() => {
    if (!stationLive) return;
    const id = setInterval(tick, 500);
    const onVisible = () => tick();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [tick, stationLive]);

  // Must sign in before anything else is reachable.
  if (!signedIn) {
    return <LoginGate onSignedIn={() => setSignedIn(true)} />;
  }

  return (
    <div className="h-full flex flex-col">
      <header
        className="px-5 py-2.5 flex items-center gap-3 sm:gap-4 text-white shrink-0"
        style={{ background: "var(--grad-header)" }}
      >
        {/* Brand — fixed; never compressed by the nav. */}
        <button
          className="flex items-center gap-3 text-left disabled:cursor-default shrink-0"
          onClick={() => setView("home")}
          disabled={!!inStation}
          title={inStation ? undefined : "Home"}
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[13px] font-extrabold shrink-0"
            style={{ background: "var(--grad-primary)", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
            aria-hidden
          >
            ✚
          </span>
          <div className="font-extrabold text-[15px] tracking-wide">ClerkTools</div>
        </button>
        {inStation && (
          <span
            className="pl-4 text-[13px] opacity-85 truncate hidden sm:inline min-w-0"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.18)" }}
          >
            {caseModel.chart.ageSex} — {caseModel.chart.cc}
          </span>
        )}
        {/* Section nav (outside a station) — fills the middle and scrolls if needed. */}
        {!inStation && <ClerkshipTabs view={view} />}
        {inStation && (
          <div className="ml-auto shrink-0 flex items-center">
            {engine.currentState === "FEEDBACK" ? (
              <button
                className="text-[12.5px] font-bold rounded-full px-3 py-1.5 transition-colors"
                style={{ background: "rgba(255,255,255,0.12)" }}
                onClick={exitToSelect}
              >
                Exit case
              </button>
            ) : confirmExit ? (
              <span
                className="flex items-center gap-2 text-[12.5px]"
                role="alertdialog"
                aria-label="Confirm exit"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setConfirmExit(false);
                }}
              >
                <span className="opacity-80">Exit and lose progress?</span>
                <button
                  className="font-bold rounded-full px-2.5 py-1.5"
                  style={{ background: "var(--color-exam-danger-deep)" }}
                  onClick={() => {
                    setConfirmExit(false);
                    exitToSelect();
                  }}
                >
                  Exit
                </button>
                <button
                  autoFocus
                  className="font-bold rounded-full px-2.5 py-1.5"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                  onClick={() => setConfirmExit(false)}
                >
                  Stay
                </button>
              </span>
            ) : (
              <button
                className="text-[12.5px] font-bold rounded-full px-3 py-1.5 transition-colors"
                style={{ background: "rgba(255,255,255,0.12)" }}
                onClick={() => setConfirmExit(true)}
              >
                Exit case
              </button>
            )}
          </div>
        )}
      </header>

      {!inStation && activeClerkship && <ToolSubnav clerkship={activeClerkship} view={view} />}
      {!inStation && <ResumeBanner />}
      {inStation && <PhaseHeader caseModel={caseModel} engine={engine} />}

      <main className="flex-1 min-h-0 overflow-y-auto scroll-quiet">
        {view === "home" && <Home />}
        {view === "select" && <CaseSelect />}
        {view === "analytics" && <Analytics />}
        {view === "skills" && <Skills />}
        {view === "drills" && <Drills />}
        {view === "differentials" && <Differentials />}
        {view === "management" && <WorkupManagement />}
        {view === "shelf" && <Shelf />}
        {view === "mcq" && <Qbank bank={IM_BANK} />}
        {view === "fmmcq" && <Qbank bank={FM_BANK} />}
        {view === "fmdrills" && <FmDrills />}
        {view === "obmcq" && <Qbank bank={OB_BANK} />}
        {view === "neuro" && <Neuro />}
        {view === "review" && <ReviewScreen />}
        {inStation && engine.currentState === "CHART_REVIEW" && <ChartReview caseModel={caseModel} />}
        {inStation && engine.currentState === "PATIENT_ENCOUNTER" && <Encounter caseModel={caseModel} />}
        {inStation && engine.currentState === "POST_ENCOUNTER" && <PostEncounter caseModel={caseModel} />}
        {inStation && engine.currentState === "FEEDBACK" && <Feedback />}
      </main>

      <footer
        className="px-5 py-1.5 text-[11px] border-t shrink-0 flex justify-between"
        style={{
          borderColor: "var(--color-exam-border)",
          color: "var(--color-exam-faint)",
          background: "#fff",
        }}
      >
        <span>For medical education and OSCE practice only. Not for clinical decision-making.</span>
        <span>Fictional cases · no real patient data</span>
      </footer>

      {import.meta.env.DEV && <DevTools />}
    </div>
  );
}
