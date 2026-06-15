import type { CategoryVisualGuide } from "./types";

const RED = "#e5484d";
const AMBER = "#d97706";
const ACCENT = "#5634e0";
const ACCENT_DEEP = "#4326c0";
const OK = "#0ca678";

const Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={22} height={22} aria-hidden>
    <path
      d="M5 4c0 3 3 3 3 6s-3 3-3 6 3 3 3 4"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 4c0 3 3 3 3 6s-3 3-3 6 3 3 3 4"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 4c0 3 3 3 3 6s-3 3-3 6 3 3 3 4"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Coiled-gut "mechanism map" — diarrhea sorted along the bowel. Pins 1..5 align
 *  with the guide zones. */
const Motif = () => (
  <svg viewBox="0 0 430 320" className="vg-motif" role="img" aria-label="Coiled intestine diarrhea map">
    <defs>
      <linearGradient id="diarrhea-gut" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a7e9d3" />
        <stop offset="1" stopColor="#7fd9bf" />
      </linearGradient>
      <linearGradient id="diarrhea-stom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cdeee2" />
        <stop offset="1" stopColor="#a7e0cd" />
      </linearGradient>
      <filter id="diarrhea-sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0b3a2c" floodOpacity="0.12" />
      </filter>
    </defs>
    {/* mint backdrop */}
    <rect x={20} y={20} width={390} height={280} rx={28} fill="#e3faf2" stroke="#c4f0e1" strokeWidth={2} />
    {/* stomach blob feeding in (top-left) */}
    <path
      d="M64 70 Q52 50 78 46 Q108 42 118 64 Q126 84 108 96 Q120 110 100 118 Q78 124 70 104 Q56 92 64 70 Z"
      fill="url(#diarrhea-stom)"
      stroke="#8fd6bf"
      strokeWidth={1.5}
      filter="url(#diarrhea-sh)"
    />
    {/* coiled intestine — one continuous snaking path */}
    <path
      d="M108 100 Q190 60 270 92 Q360 124 300 168 Q230 200 130 168 Q60 144 110 196 Q170 232 280 204 Q360 184 320 244 Q250 290 200 262"
      fill="none"
      stroke="url(#diarrhea-gut)"
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#diarrhea-sh)"
    />
    {/* pins */}
    <g fontWeight={900} fontSize={14} textAnchor="middle">
      <g><circle cx={120} cy={90} r={15} fill={RED} filter="url(#diarrhea-sh)" /><text x={120} y={95} fill="#fff">1</text></g>
      <g><circle cx={300} cy={130} r={15} fill={RED} filter="url(#diarrhea-sh)" /><text x={300} y={135} fill="#fff">2</text></g>
      <g><circle cx={130} cy={190} r={15} fill={AMBER} filter="url(#diarrhea-sh)" /><text x={130} y={195} fill="#fff">3</text></g>
      <g><circle cx={310} cy={210} r={15} fill={AMBER} filter="url(#diarrhea-sh)" /><text x={310} y={215} fill="#fff">4</text></g>
      <g><circle cx={200} cy={260} r={15} fill={AMBER} filter="url(#diarrhea-sh)" /><text x={200} y={265} fill="#fff">5</text></g>
    </g>
  </svg>
);

export const diarrheaGuide: CategoryVisualGuide = {
  category: "Diarrhea",
  tagline: "inflammatory · secretory · osmotic",
  accent: "#0ca678",
  accentSoft: "#e3faf2",
  Icon,
  Motif,
  zones: [
    {
      n: 1,
      name: "Inflammatory / invasive",
      color: RED,
      dx: [
        { label: "C. difficile", severity: "must" },
        { label: "IBD flare", severity: "must" },
        { label: "Invasive bacterial", severity: "common" },
        { label: "Ischemic colitis", severity: "must" },
      ],
    },
    {
      n: 2,
      name: "Secretory",
      color: RED,
      dx: [
        { label: "Toxin / cholera", severity: "common" },
        { label: "VIPoma / carcinoid NET", severity: "must" },
        { label: "Bile-acid", severity: "common" },
      ],
    },
    {
      n: 3,
      name: "Osmotic / malabsorptive",
      color: AMBER,
      dx: [
        { label: "Celiac", severity: "common" },
        { label: "Lactose", severity: "common" },
        { label: "Pancreatic insufficiency", severity: "common" },
      ],
    },
    {
      n: 4,
      name: "Acute infectious",
      color: AMBER,
      dx: [
        { label: "Viral", severity: "common" },
        { label: "Food poisoning", severity: "common" },
        { label: "Traveler's", severity: "common" },
      ],
    },
    {
      n: 5,
      name: "Motility / functional",
      color: AMBER,
      dx: [
        { label: "IBS", severity: "common" },
        { label: "Hyperthyroid", severity: "common" },
        { label: "Medications", severity: "common" },
      ],
    },
  ],
  workup: {
    nodes: ["CBC + CMP", "Stool studies (C. diff, culture, O&P)", "Stool osmotic gap / elastase", "± colonoscopy"],
    branches: [
      { tag: "bloody + fever", to: "infectious vs IBD → scope" },
      { tag: "recent antibiotics", to: "C. diff PCR" },
      { tag: "persists with fasting", to: "secretory (VIP / gastrin)" },
      { tag: "high osmotic gap", to: "malabsorption work-up" },
    ],
  },
  management: [
    { n: 1, color: RED, title: "Stabilize", detail: "rehydrate (IV if depleted), correct potassium" },
    { n: 2, color: AMBER, title: "First tests", detail: "stool studies + electrolytes" },
    { n: 3, color: ACCENT, title: "Commit (classify)", detail: "inflammatory vs secretory vs osmotic" },
    { n: 4, color: ACCENT_DEEP, title: "Definitive Rx", detail: "treat cause (vancomycin/fidaxomicin for C. diff, etc.); avoid antimotility if inflammatory" },
    { n: 5, color: OK, title: "Disposition", detail: "admit if dehydrated / toxic" },
  ],
};
