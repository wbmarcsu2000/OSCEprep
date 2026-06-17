import { useCallback, useState } from "react";
import {
  loadDrillProgress,
  recordDrillAttempt,
  setDrillManual,
  drillKey,
  type DrillProgressMap,
  type DrillType,
  type DrillManual,
} from "../data/drillProgress";

/** React wrapper over the localStorage drill-progress store. Keeps an in-memory
 *  copy so the Drills screen re-renders its counters/status the instant a grade
 *  lands or a mastered / needs-work toggle is flipped. */
export function useDrillProgress() {
  const [progress, setProgress] = useState<DrillProgressMap>(() => loadDrillProgress());

  const record = useCallback((type: DrillType, id: string, pct: number) => {
    const entry = recordDrillAttempt(type, id, pct);
    setProgress((p) => ({ ...p, [drillKey(type, id)]: entry }));
  }, []);

  const setManual = useCallback((type: DrillType, id: string, manual: DrillManual) => {
    setDrillManual(type, id, manual);
    setProgress(loadDrillProgress());
  }, []);

  return { progress, record, setManual };
}
