import { useEffect } from "react";
import { useAppStore } from "./ui/store";
import { CaseSelect } from "./ui/screens/CaseSelect";
import { ChartReview } from "./ui/screens/ChartReview";
import { Encounter } from "./ui/screens/Encounter";
import { PostEncounter } from "./ui/screens/PostEncounter";
import { Feedback, ReviewScreen } from "./ui/screens/Feedback";
import { Analytics } from "./ui/screens/Analytics";
import { Skills } from "./ui/screens/Skills";
import { Drills } from "./ui/screens/Drills";
import { Home } from "./ui/screens/Home";
import { PhaseHeader } from "./ui/components/PhaseHeader";
import { DevTools } from "./ui/components/DevTools";
import { useState } from "react";

type View = ReturnType<typeof useAppStore.getState>["view"];

/** Persistent section nav shown in the header outside a station. */
function HeaderNav({ view }: { view: View }) {
  const showStations = useAppStore((s) => s.showStations);
  const showDrills = useAppStore((s) => s.showDrills);
  const showSkills = useAppStore((s) => s.showSkills);
  const showAnalytics = useAppStore((s) => s.showAnalytics);
  const items: { label: string; active: boolean; onClick: () => void }[] = [
    { label: "Stations", active: view === "select", onClick: showStations },
    { label: "Drills", active: view === "drills", onClick: showDrills },
    { label: "Skills", active: view === "skills", onClick: showSkills },
    { label: "Performance", active: view === "analytics", onClick: showAnalytics },
  ];
  return (
    <nav className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scroll-quiet" aria-label="Sections">
      {items.map((it) => (
        <button
          key={it.label}
          onClick={it.onClick}
          aria-current={it.active ? "page" : undefined}
          className="text-[12.5px] font-semibold rounded-md px-2.5 sm:px-3 py-1.5 whitespace-nowrap transition-colors"
          style={{
            background: it.active ? "rgba(255,255,255,0.16)" : "transparent",
            color: it.active ? "#fff" : "rgba(255,255,255,0.7)",
          }}
        >
          {it.label}
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const view = useAppStore((s) => s.view);
  const caseModel = useAppStore((s) => s.caseModel);
  const engine = useAppStore((s) => s.engine);
  const tick = useAppStore((s) => s.tick);
  const resumeSession = useAppStore((s) => s.resumeSession);
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const showHome = useAppStore((s) => s.showHome);
  const [confirmExit, setConfirmExit] = useState(false);

  useEffect(() => {
    void resumeSession();
  }, [resumeSession]);

  // Wall-clock-based tick: the engine recomputes from Date.now() deltas, so a
  // throttled or backgrounded tab catches up correctly on the next tick.
  useEffect(() => {
    const id = setInterval(tick, 500);
    const onVisible = () => tick();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [tick]);

  const inStation = view === "station" && caseModel && engine;

  return (
    <div className="h-full flex flex-col">
      <header
        className="px-5 py-2.5 flex items-center justify-between text-white shrink-0"
        style={{ background: "var(--color-exam-header)" }}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            className="flex items-center gap-3.5 min-w-0 text-left disabled:cursor-default"
            onClick={showHome}
            disabled={!!inStation}
            title={inStation ? undefined : "Home"}
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md text-[13px] font-extrabold shrink-0"
              style={{ background: "var(--color-exam-accent)" }}
              aria-hidden
            >
              ✚
            </span>
            <div className="leading-tight min-w-0">
              <div className="font-bold text-[13.5px] tracking-wide">OSCEPREP</div>
              <div className="text-[11px] opacity-60">Internal Medicine Clerkship</div>
            </div>
          </button>
          {inStation && (
            <span
              className="ml-3 pl-4 text-[13px] opacity-85 truncate hidden sm:inline"
              style={{ borderLeft: "1px solid rgba(255,255,255,0.18)" }}
            >
              {caseModel.chart.ageSex} — {caseModel.chart.cc}
            </span>
          )}
        </div>
        {/* Persistent section nav (outside a station). */}
        {!inStation && <HeaderNav view={view} />}
        {inStation &&
          (engine.currentState === "FEEDBACK" ? (
            <button
              className="text-[12.5px] font-semibold rounded-md px-3 py-1.5 transition-colors"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onClick={exitToSelect}
            >
              Exit station
            </button>
          ) : confirmExit ? (
            <span className="flex items-center gap-2 text-[12.5px]">
              <span className="opacity-80">Exit and lose progress?</span>
              <button
                className="font-semibold rounded-md px-2.5 py-1.5"
                style={{ background: "var(--color-exam-danger)" }}
                onClick={() => {
                  setConfirmExit(false);
                  exitToSelect();
                }}
              >
                Exit
              </button>
              <button
                className="font-semibold rounded-md px-2.5 py-1.5"
                style={{ background: "rgba(255,255,255,0.12)" }}
                onClick={() => setConfirmExit(false)}
              >
                Stay
              </button>
            </span>
          ) : (
            <button
              className="text-[12.5px] font-semibold rounded-md px-3 py-1.5 transition-colors"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onClick={() => setConfirmExit(true)}
            >
              Exit station
            </button>
          ))}
      </header>

      {inStation && <PhaseHeader caseModel={caseModel} engine={engine} />}

      <main className="flex-1 min-h-0 overflow-y-auto scroll-quiet">
        {view === "home" && <Home />}
        {view === "select" && <CaseSelect />}
        {view === "analytics" && <Analytics />}
        {view === "skills" && <Skills />}
        {view === "drills" && <Drills />}
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
