import { useState } from "react";

/**
 * The wall-clock time captured once when the component mounts, stable across
 * re-renders. Streak/badge math wants "now" as a fixed input per screen visit,
 * not a live clock — and a lazy initializer keeps render itself idempotent.
 */
export function useMountNow(): number {
  const [now] = useState(() => Date.now());
  return now;
}
