// src/data/obGuidelineDrills.ts
import type { DrillDomainDef, GuidelineDrill } from "./guidelineDrillBank";
import { OB_PRENATAL_DRILLS } from "./obPrenatalDrills";
import { OB_COMPLICATION_DRILLS } from "./obComplicationDrills";
import { OB_LABOR_DRILLS } from "./obLaborDrills";
import { OB_GYN_DRILLS } from "./obGynDrills";
import { OB_GYN_SURGERY_DRILLS } from "./obGynSurgeryDrills";
import { OB_ENDO_TUMOR_DRILLS } from "./obEndoTumorDrills";
import { OB_VIGNETTE_DRILLS } from "./obVignetteDrills";

export const OB_DOMAINS: DrillDomainDef[] = [
  { id: "prenatal", label: "Prenatal & Routine", emoji: "🤰" },
  { id: "complications", label: "Complications", emoji: "🚨" },
  { id: "labor", label: "Labor & Monitoring", emoji: "👶" },
  { id: "gyn", label: "GYN", emoji: "🌸" },
  { id: "gyn-surgery", label: "Benign gyn surgery", emoji: "🔪" },
  {
    id: "endo-tumors",
    label: "Tumors & hormones",
    emoji: "🧬",
    noun: "topic",
    intro: [
      "Sort every cause by where the hormone comes from — ovary, adrenal, pituitary/hypothalamus, exogenous — before naming diagnoses.",
      "Tempo tells tumor: rapid or severe change (virilization, precocity, postmenopausal bleeding, a solid mass in a child) means image for a mass.",
      "Match the marker to the tumor: hCG, AFP, LDH, inhibin, testosterone, DHEA-S, CA-125.",
      "Unopposed estrogen is the thread that links PCOS, obesity, granulosa cell tumors and tamoxifen to endometrial hyperplasia and cancer.",
    ],
  },
  {
    id: "vignettes",
    label: "Case vignettes",
    emoji: "🩺",
    noun: "vignette",
    intro: [
      "hCG first in any reproductive-age woman — it sorts the entire differential.",
      "Name the can't-miss diagnosis explicitly, and the single order that excludes it.",
      "Orders in sequence: labs → imaging → tissue.",
      "Management branches stable vs unstable, and closes with one prevention or counseling pearl.",
    ],
  },
];

export const OB_GUIDELINE_DRILLS: GuidelineDrill[] = [
  ...OB_PRENATAL_DRILLS,
  ...OB_COMPLICATION_DRILLS,
  ...OB_LABOR_DRILLS,
  ...OB_GYN_DRILLS,
  ...OB_GYN_SURGERY_DRILLS,
  ...OB_ENDO_TUMOR_DRILLS,
  ...OB_VIGNETTE_DRILLS,
];
