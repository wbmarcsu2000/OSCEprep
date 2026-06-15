import type { FC } from "react";

/** Per-category visual study guides shown inside the differential / workup /
 *  management drills. Hand-authored SVG/CSS (no generated images); each
 *  category gets its OWN signature motif so the picture itself cues recall. */

export type Severity = "must" | "common";

export interface GuideDx {
  label: string;
  severity: Severity;
}

/** A numbered hotspot on the motif, mapped to its diagnoses in the legend. */
export interface GuideZone {
  n: number;
  name: string;
  /** Pin/badge color (hex) — red-ish for danger-dominant zones, amber for benign. */
  color: string;
  dx: GuideDx[];
}

export interface GuideBranch {
  /** The result/finding that steers you. */
  tag: string;
  /** The next step it points to. */
  to: string;
}

export interface GuideWorkup {
  /** First-line tests, ANDed together. */
  nodes: string[];
  /** Result → next-step branches. */
  branches: GuideBranch[];
}

export interface GuideRung {
  n: number;
  color: string;
  title: string;
  detail: string;
}

export interface CategoryVisualGuide {
  /** Must match CategoryCurriculum.category exactly. */
  category: string;
  /** Short memorable hook shown after the title, e.g. "the lethal six". */
  tagline: string;
  /** Category signature accent (hex) + a soft tint for fills. */
  accent: string;
  accentSoft: string;
  /** Small header glyph. */
  Icon: FC;
  /** The bespoke anatomy/spatial illustration with numbered pins (1..n) that
   *  line up with `zones`. */
  Motif: FC;
  zones: GuideZone[];
  workup: GuideWorkup;
  management: GuideRung[];
}
