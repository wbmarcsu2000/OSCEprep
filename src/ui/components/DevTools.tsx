import { useState } from "react";
import { useAppStore } from "../store";

/**
 * Dev-only testing toolbar. Rendered only in Vite DEV mode (npm run dev) — it
 * is tree-shaken out of production builds. Lets you skip phases, auto-fill
 * ideal answers, and jump to feedback without playing the whole station.
 */
export function DevTools() {
  const view = useAppStore((s) => s.view);
  const engine = useAppStore((s) => s.engine);
  const caseModel = useAppStore((s) => s.caseModel);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const devSkipPhase = useAppStore((s) => s.devSkipPhase);
  const devFillIdeal = useAppStore((s) => s.devFillIdeal);
  const devAutocompleteStation = useAppStore((s) => s.devAutocompleteStation);
  const [open, setOpen] = useState(false);

  const inStation = view === "station" && engine && caseModel;

  return (
    <div className="fixed bottom-3 right-3 z-50 font-mono text-[12px]">
      {open ? (
        <div
          className="rounded-lg border shadow-lg p-2.5 w-64 space-y-2"
          style={{ background: "#1b2530", borderColor: "#33414f", color: "#e7edf3" }}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold tracking-wide" style={{ color: "#8fb4ff" }}>
              DEV TOOLS
            </span>
            <button onClick={() => setOpen(false)} style={{ color: "#8b97a3" }} aria-label="Close dev tools">
              ✕
            </button>
          </div>
          {inStation ? (
            <>
              <div className="text-[11px] leading-snug" style={{ color: "#9fb0bf" }}>
                <div>case: {caseModel.id}</div>
                <div>phase: {engine.currentState}</div>
                <div>mode: {engine.mode} · AI: {llmEnabled ? "on" : "off"}</div>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <DevBtn onClick={devSkipPhase} disabled={engine.currentState === "FEEDBACK"}>
                  ⤼ Skip to next phase
                </DevBtn>
                <DevBtn onClick={devFillIdeal} disabled={engine.currentState !== "POST_ENCOUNTER"}>
                  ✎ Fill ideal answers
                </DevBtn>
                <DevBtn onClick={() => void devAutocompleteStation()} disabled={engine.currentState === "FEEDBACK"}>
                  ⏭ Autocomplete → feedback
                </DevBtn>
              </div>
            </>
          ) : (
            <div className="text-[11px]" style={{ color: "#9fb0bf" }}>
              Start a station to use phase controls.
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border shadow-lg px-3 py-1.5 font-bold"
          style={{ background: "#1b2530", borderColor: "#33414f", color: "#8fb4ff" }}
          title="Dev tools (DEV build only)"
        >
          ⚙ dev
        </button>
      )}
    </div>
  );
}

function DevBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-left px-2 py-1.5 rounded border disabled:opacity-40"
      style={{ background: "#243240", borderColor: "#3a4a5a", color: "#dbe4ec" }}
    >
      {children}
    </button>
  );
}
