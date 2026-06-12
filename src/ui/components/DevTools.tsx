import { useState } from "react";
import { useAppStore, type View } from "../store";
import type { Mode } from "../../engine/types";
import { manifest } from "../../data/loader";
import { SESSION_STORAGE_KEY } from "../../engine/stateMachine";
import { ANALYTICS_STORAGE_KEY, REVIEW_STORAGE_KEY } from "../../analytics/store";

const JUMP_VIEWS: View[] = ["home", "select", "drills", "skills", "analytics"];

/** Remove the given localStorage keys, then hard-reload so every module
 *  re-derives its state from clean storage. */
function clearAndReload(keys: string[]) {
  try {
    for (const key of keys) localStorage.removeItem(key);
  } catch {
    // storage unavailable — reload anyway
  }
  window.location.reload();
}

/**
 * Dev-only testing toolbar. Rendered only in Vite DEV mode (npm run dev) — it
 * is tree-shaken out of production builds. Lets you skip phases, auto-fill
 * ideal answers, and jump to feedback without playing the whole station.
 * Outside a station it offers a case jumper, view jumper, and storage clearers.
 */
export function DevTools() {
  const view = useAppStore((s) => s.view);
  const engine = useAppStore((s) => s.engine);
  const caseModel = useAppStore((s) => s.caseModel);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const devSkipPhase = useAppStore((s) => s.devSkipPhase);
  const devFillIdeal = useAppStore((s) => s.devFillIdeal);
  const devAutocompleteStation = useAppStore((s) => s.devAutocompleteStation);
  const setView = useAppStore((s) => s.setView);
  const [open, setOpen] = useState(false);
  const [jumpId, setJumpId] = useState("");
  const [jumpMode, setJumpMode] = useState<Mode>(() => useAppStore.getState().preferredMode);

  const inStation = view === "station" && engine && caseModel;
  const jumpValid = manifest.cases.some((c) => c.id === jumpId.trim());

  return (
    <div className="fixed bottom-3 right-3 z-50 font-mono text-[12px]">
      {open ? (
        <div
          className="rounded-lg border shadow-lg p-2.5 w-64 space-y-2"
          style={{ background: "#241b4d", borderColor: "#3c2f73", color: "#ece8fb" }}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold tracking-wide" style={{ color: "#b4a3ff" }}>
              DEV TOOLS
            </span>
            <button onClick={() => setOpen(false)} style={{ color: "#8d84b8" }} aria-label="Close dev tools">
              ✕
            </button>
          </div>
          {inStation ? (
            <>
              <div className="text-[11px] leading-snug" style={{ color: "#a99fd1" }}>
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
            <>
              <form
                className="space-y-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (jumpValid) void useAppStore.getState().startCase(jumpId.trim(), jumpMode);
                }}
              >
                <SectionLabel>Case jumper</SectionLabel>
                <input
                  list="devtools-case-ids"
                  value={jumpId}
                  onChange={(e) => setJumpId(e.target.value)}
                  placeholder="case id…"
                  aria-label="Case id to jump to"
                  className="w-full px-2 py-1.5 rounded border"
                  style={{ background: "#1c1540", borderColor: "#45378a", color: "#ece8fb" }}
                />
                <datalist id="devtools-case-ids">
                  {manifest.cases.map((c) => (
                    <option key={c.id} value={c.id} />
                  ))}
                </datalist>
                <div className="flex items-center gap-1.5">
                  <ModeBtn active={jumpMode === "STRICT_OSCE"} onClick={() => setJumpMode("STRICT_OSCE")}>
                    STRICT
                  </ModeBtn>
                  <ModeBtn active={jumpMode === "PRACTICE"} onClick={() => setJumpMode("PRACTICE")}>
                    PRACTICE
                  </ModeBtn>
                  <button
                    type="submit"
                    disabled={!jumpValid}
                    className="ml-auto px-2.5 py-1 rounded border font-bold disabled:opacity-40"
                    style={{ background: "#45378a", borderColor: "#5a4aa8", color: "#ece8fb" }}
                  >
                    Go
                  </button>
                </div>
              </form>
              <div className="space-y-1.5">
                <SectionLabel>Views</SectionLabel>
                <div className="flex flex-wrap gap-1">
                  {JUMP_VIEWS.map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className="px-1.5 py-0.5 rounded border text-[10px]"
                      style={{
                        background: view === v ? "#45378a" : "#2e2360",
                        borderColor: "#45378a",
                        color: "#d9d2f4",
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <SectionLabel>Storage</SectionLabel>
                <div className="grid grid-cols-1 gap-1.5">
                  <DevBtn onClick={() => clearAndReload([SESSION_STORAGE_KEY])}>
                    🧹 Clear session
                  </DevBtn>
                  <DevBtn onClick={() => clearAndReload([ANALYTICS_STORAGE_KEY, REVIEW_STORAGE_KEY])}>
                    🗑 Clear progress (analytics+reviews)
                  </DevBtn>
                </div>
              </div>
              <div className="text-[11px]" style={{ color: "#a99fd1" }}>
                Start a station to use phase controls.
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border shadow-lg px-3 py-1.5 font-bold"
          style={{ background: "#241b4d", borderColor: "#3c2f73", color: "#b4a3ff" }}
          title="Dev tools (DEV build only)"
        >
          ⚙ dev
        </button>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold tracking-wide uppercase" style={{ color: "#8d84b8" }}>
      {children}
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="px-1.5 py-1 rounded border text-[10px] font-bold"
      style={{
        background: active ? "#45378a" : "#2e2360",
        borderColor: active ? "#5a4aa8" : "#3c2f73",
        color: active ? "#ece8fb" : "#a99fd1",
      }}
    >
      {children}
    </button>
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
      style={{ background: "#2e2360", borderColor: "#45378a", color: "#d9d2f4" }}
    >
      {children}
    </button>
  );
}
