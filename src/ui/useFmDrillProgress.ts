import { useCallback, useState } from "react";
import {
  loadFmProgress,
  recordFmAttempt,
  setFmManual,
  fmDrillKey,
  type FmDrillProgressMap,
} from "../data/fmDrillProgress";
import type { FmDrillDomain } from "../data/fmGuidelineDrills";
import type { DrillManual } from "../data/drillProgressCore";

/** React wrapper over the FM drill-progress store — mirrors useDrillProgress. */
export function useFmDrillProgress() {
  const [progress, setProgress] = useState<FmDrillProgressMap>(() => loadFmProgress());

  const record = useCallback((domain: FmDrillDomain, id: string, pct: number) => {
    const entry = recordFmAttempt(domain, id, pct);
    setProgress((p) => ({ ...p, [fmDrillKey(domain, id)]: entry }));
  }, []);

  const setManual = useCallback((domain: FmDrillDomain, id: string, manual: DrillManual) => {
    setFmManual(domain, id, manual);
    setProgress(loadFmProgress());
  }, []);

  return { progress, record, setManual };
}
