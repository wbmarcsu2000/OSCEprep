/**
 * Dependency-free confetti burst for the feedback celebration. Pieces are
 * positioned with an index-seeded pseudo-random so renders are deterministic;
 * pure CSS animation, removed from the layout once it finishes (overflow
 * hidden, pointer-events none). Hidden under prefers-reduced-motion.
 */

const COLORS = [
  "var(--color-exam-accent)",
  "var(--color-pop-teal)",
  "var(--color-pop-sun)",
  "var(--color-pop-coral)",
  "var(--color-pop-sky)",
  "var(--color-pop-pink)",
];

function seeded(i: number, salt: number): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function Confetti({ count = 60 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${seeded(i, 1) * 100}%`,
            background: COLORS[i % COLORS.length],
            animationDelay: `${seeded(i, 2) * 0.9}s`,
            animationDuration: `${2 + seeded(i, 3) * 1.6}s`,
            transform: `rotate(${seeded(i, 4) * 360}deg)`,
            width: 6 + seeded(i, 5) * 5,
            height: 10 + seeded(i, 6) * 8,
          }}
        />
      ))}
    </div>
  );
}
