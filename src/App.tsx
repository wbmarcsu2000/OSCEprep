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
import { PhaseHeader } from "./ui/components/PhaseHeader";
import { DevTools } from "./ui/components/DevTools";
import { useState } from "react";

export default function App() {
  const view = useAppStore((s) => s.view);
  const caseModel = useAppStore((s) => s.caseModel);
  const engine = useAppStore((s) => s.engine);
  const tick = useAppStore((s) => s.tick);
  const resumeSession = useAppStore((s) => s.resumeSession);
  const exitToSelect = useAppStore((s) => s.exitToSelect);
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
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-[13px] font-extrabold shrink-0"
            style={{ background: "var(--color-exam-accent)" }}
            aria-hidden
          >
            ✚
          </span>
          <div className="leading-tight min-w-0">
            <div className="font-bold text-[13.5px] tracking-wide">OSCE SIMULATOR</div>
            <div className="text-[11px] opacity-60">Internal Medicine Clerkship</div>
          </div>
          {inStation && (
            <span
              className="ml-3 pl-4 text-[13px] opacity-85 truncate"
              style={{ borderLeft: "1px solid rgba(255,255,255,0.18)" }}
            >
              {caseModel.chart.ageSex} — {caseModel.chart.cc}
            </span>
          )}
        </div>
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
