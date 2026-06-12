function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Timer({
  seconds,
  label,
  untimed,
}: {
  seconds: number;
  label: string;
  untimed?: boolean;
}) {
  // Staged urgency: calm → amber under 2 min → red pulse under 1 min.
  const warning = !untimed && seconds <= 120 && seconds > 60;
  const urgent = !untimed && seconds <= 60;
  const border = urgent
    ? "var(--color-exam-danger-line)"
    : warning
      ? "var(--color-exam-warn-line)"
      : "var(--color-exam-border)";
  const bg = urgent ? "var(--color-exam-danger-soft)" : warning ? "var(--color-exam-warn-soft)" : "#fff";
  const dot = untimed
    ? "var(--color-exam-faint)"
    : urgent
      ? "var(--color-exam-danger)"
      : warning
        ? "var(--color-exam-warn)"
        : "var(--color-exam-ok)";
  return (
    <div
      className="flex items-center gap-2.5 rounded-full border pl-4 pr-3 py-1.5"
      style={{ borderColor: border, background: bg }}
      role="timer"
      aria-label={`${label}: ${untimed ? "untimed" : formatClock(seconds)}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${urgent ? "pulse-urgent" : ""}`}
        style={{ background: dot }}
      />
      <span
        className="font-mono text-lg font-semibold tabular-nums leading-none"
        style={{
          color: urgent
            ? "var(--color-exam-danger)"
            : warning
              ? "var(--color-exam-warn)"
              : "var(--color-exam-ink)",
        }}
      >
        {untimed ? "—:—" : formatClock(seconds)}
      </span>
    </div>
  );
}
