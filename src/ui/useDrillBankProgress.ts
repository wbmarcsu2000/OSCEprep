// src/ui/useDrillBankProgress.ts
import { useCallback, useState } from "react";
import {
  loadDrillBankProgress,
  recordDrillBankAttempt,
  setDrillBankManual,
  type DrillBankProgressMap,
} from "../data/guidelineDrillProgress";
import { drillKey, type DrillManual } from "../data/drillProgressCore";

/** React wrapper over a bank's drill-progress store — mirrors useDrillProgress. */
export function useDrillBankProgress(storageKey: string) {
  const [progress, setProgress] = useState<DrillBankProgressMap>(() => loadDrillBankProgress(storageKey));

  const record = useCallback(
    (domain: string, id: string, pct: number) => {
      const entry = recordDrillBankAttempt(storageKey, domain, id, pct);
      setProgress((p) => ({ ...p, [drillKey(domain, id)]: entry }));
    },
    [storageKey],
  );

  const setManual = useCallback(
    (domain: string, id: string, manual: DrillManual) => {
      setDrillBankManual(storageKey, domain, id, manual);
      setProgress(loadDrillBankProgress(storageKey));
    },
    [storageKey],
  );

  return { progress, record, setManual };
}
