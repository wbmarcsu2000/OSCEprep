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
  const urgent = !untimed && seconds <= 60;
  return (
    <div
      className="flex items-center gap-2.5 rounded-full border pl-4 pr-3 py-1.5"
      style={{
        borderColor: urgent ? "#f0c4c4" : "var(--color-exam-border)",
        background: urgent ? "var(--color-exam-danger-soft)" : "#fff",
      }}
      role="timer"
      aria-label={`${label}: ${untimed ? "untimed" : formatClock(seconds)}`}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{
          background: untimed
            ? "var(--color-exam-faint)"
            : urgent
              ? "var(--color-exam-danger)"
              : "var(--color-exam-ok)",
          animation: urgent ? "pulse 1s infinite" : undefined,
        }}
      />
      <span
        className="font-mono text-lg font-semibold tabular-nums leading-none"
        style={{ color: urgent ? "var(--color-exam-danger)" : "var(--color-exam-ink)" }}
      >
        {untimed ? "—:—" : formatClock(seconds)}
      </span>
    </div>
  );
}
