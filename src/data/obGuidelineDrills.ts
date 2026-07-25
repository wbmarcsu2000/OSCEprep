// src/data/obGuidelineDrills.ts
import type { DrillDomainDef, GuidelineDrill } from "./guidelineDrillBank";
import { OB_PRENATAL_DRILLS } from "./obPrenatalDrills";
import { OB_COMPLICATION_DRILLS } from "./obComplicationDrills";
import { OB_LABOR_DRILLS } from "./obLaborDrills";
import { OB_GYN_DRILLS } from "./obGynDrills";

export const OB_DOMAINS: DrillDomainDef[] = [
  { id: "prenatal", label: "Prenatal & Routine", emoji: "🤰" },
  { id: "complications", label: "Complications", emoji: "🚨" },
  { id: "labor", label: "Labor & Monitoring", emoji: "👶" },
  { id: "gyn", label: "GYN", emoji: "🌸" },
];

export const OB_GUIDELINE_DRILLS: GuidelineDrill[] = [
  ...OB_PRENATAL_DRILLS,
  ...OB_COMPLICATION_DRILLS,
  ...OB_LABOR_DRILLS,
  ...OB_GYN_DRILLS,
];
