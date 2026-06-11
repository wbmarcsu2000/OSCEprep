import { useAppStore } from "../store";

export function Scratchpad({ rows = 8, bare = false }: { rows?: number; bare?: boolean }) {
  const scratchpad = useAppStore((s) => s.engine?.scratchpad ?? "");
  const update = useAppStore((s) => s.updateScratchpad);
  const area = (
    <textarea
      className="input w-full font-mono text-[13px] resize-y leading-relaxed"
      rows={rows}
      value={scratchpad}
      onChange={(e) => update(e.target.value)}
      placeholder="Notes carry through the whole station…"
      aria-label="Scratchpad"
    />
  );
  if (bare) {
    return (
      <div className="p-3 flex flex-col gap-1.5 h-full">
        <div className="flex items-center justify-between px-0.5">
          <span className="hint">Carried through every phase</span>
          <span className="hint">autosaved</span>
        </div>
        {area}
      </div>
    );
  }
  return (
    <div className="card p-3.5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="panel-label">Scratchpad</span>
        <span className="hint">autosaved</span>
      </div>
      {area}
    </div>
  );
}
