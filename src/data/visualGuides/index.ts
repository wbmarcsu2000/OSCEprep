import type { CategoryVisualGuide } from "./types";
import { chestGuide } from "./chest";
import { abdomenGuide } from "./abdomen";
import { amsGuide } from "./ams";
import { dyspneaGuide } from "./dyspnea";
import { syncopeGuide } from "./syncope";
import { feverGuide } from "./fever";
import { anemiaGuide } from "./anemia";
import { diarrheaGuide } from "./diarrhea";
import { liverGuide } from "./liver";

/** All authored category visual guides. Add a module per category here. */
const ALL: CategoryVisualGuide[] = [
  chestGuide,
  abdomenGuide,
  amsGuide,
  dyspneaGuide,
  syncopeGuide,
  feverGuide,
  anemiaGuide,
  diarrheaGuide,
  liverGuide,
];

export const VISUAL_GUIDES: Record<string, CategoryVisualGuide> = Object.fromEntries(
  ALL.map((g) => [g.category, g]),
);

export function guideFor(category: string): CategoryVisualGuide | null {
  return VISUAL_GUIDES[category] ?? null;
}

export type { CategoryVisualGuide };
