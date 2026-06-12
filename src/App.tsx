import { useEffect, useMemo, useState } from "react";
import { useAppStore, applyHash, type View } from "./ui/store";
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
import { loadAttempts } from "./analytics/store";
import { levelFor, totalXp, streakDays } from "./ui/gamification";
import { useMountNow } from "./ui/useMountNow";

const NAV: { label: string; view: View }[] = [
  { label: "Stations", view: "select" },
  { label: "Drills", view: "drills" },
  { label: "Skills", view: "skills" },
  { label: "Performance", view: "analytics" },
];

/** Persistent section nav shown in the header outside a station. */
function HeaderNav({ view }: { view: View }) {
  const setView = useAppStore((s) => s.setView);
  return (
    <nav className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scroll-quiet" aria-label="Sections">
      {NAV.map((it) => {
        const active = view === it.view;
        return (
          <button
            key={it.label}
            onClick={() => setView(it.view)}
            aria-current={active ? "page" : undefined}
            className="text-[12.5px] font-bold rounded-full px-2.5 sm:px-3.5 py-1.5 whitespace-nowrap transition-colors"
            style={{
              background: active ? "rgba(255,255,255,0.22)" : "transparent",
              color: active ? "#fff" : "rgba(255,255,255,0.72)",
            }}
          >
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}

/** Streak + level at a glance, persistent in the header outside a station. */
function HeaderStats({ view }: { view: View }) {
  const setView = useAppStore((s) => s.setView);
  const now = useMountNow();
  // Re-read whenever the view changes — attempts only change inside a station.
  const { streak, level } = useMemo(() => {
    const attempts = loadAttempts();
    return {
      streak: streakDays(attempts, now),
      level: levelFor(totalXp(attempts)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);
  return (
    <button
      className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold transition-colors hover:bg-white/10"
      style={{ background: "rgba(255,255,255,0.1)" }}
      onClick={() => setView("analytics")}
      title={`Level ${level.level} · ${level.xp} XP — view performance`}
    >
      <span className={streak > 0 ? "flame" : "opacity-50"} aria-hidden>🔥</span>
      <span className="tabular-nums">{streak}</span>
      <span className="opacity-40">·</span>
      <span className="text-white/90">Lv {level.level} {level.title}</span>
    </button>
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
      aria-label="Unfinished station"
      className="px-4 sm:px-6 py-2.5 flex items-center gap-3 flex-wrap border-b fade-up"
      style={{ background: "var(--color-exam-accent-soft)", borderColor: "var(--color-exam-accent-line)" }}
    >
      <span aria-hidden>⏸️</span>
      <span className="text-[13px] font-bold min-w-0" style={{ color: "var(--color-exam-accent-deep)" }}>
        Unfinished station: {caseModel.chart.ageSex} — {caseModel.chart.cc}
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

  const inStation = view === "station" && caseModel && engine;
  const stationLive = !!inStation && engine.currentState !== "FEEDBACK";

  // Restore an interrupted session (as an offer) and honor a deep link.
  useEffect(() => {
    void resumeSession();
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

  return (
    <div className="h-full flex flex-col">
      <header
        className="px-5 py-2.5 flex items-center justify-between text-white shrink-0"
        style={{ background: "var(--grad-header)" }}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            className="flex items-center gap-3.5 min-w-0 text-left disabled:cursor-default"
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
            <div className="leading-tight min-w-0">
              <div className="font-extrabold text-[13.5px] tracking-wide">OSCEPREP</div>
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
        {!inStation && (
          <div className="flex items-center gap-2 sm:gap-3">
            <HeaderNav view={view} />
            <HeaderStats view={view} />
          </div>
        )}
        {inStation &&
          (engine.currentState === "FEEDBACK" ? (
            <button
              className="text-[12.5px] font-bold rounded-full px-3 py-1.5 transition-colors"
              style={{ background: "rgba(255,255,255,0.12)" }}
              onClick={exitToSelect}
            >
              Exit station
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
              Exit station
            </button>
          ))}
      </header>

      {!inStation && <ResumeBanner />}
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
