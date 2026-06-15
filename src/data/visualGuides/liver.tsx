import type { CategoryVisualGuide } from "./types";

const RED = "#e5484d";
const RED_DEEP = "#c0262c";
const AMBER = "#d97706";
const ACCENT = "#5634e0";
const ACCENT_DEEP = "#4326c0";
const OK = "#0ca678";

const Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={22} height={22} aria-hidden>
    <path
      d="M3 8.5c0-1.4 1.2-2.5 2.7-2.5 4.5 0 9.5-1 13.6-1 1.1 0 1.7.9 1.4 1.9-.7 2.6-2.4 5.2-5 6.6-1.9 1-2.2 2.4-3.6 3.6-1.5 1.3-3.8 1.6-5.4.4C4.2 16 3 13.4 3 10.6V8.5Z"
      fill="#fff"
    />
    <path
      d="M16 7.2c1 .2 1.6 1 1.4 2.1"
      stroke="#ca8a04"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Liver pattern map — hepatocellular vs cholestatic split with the R-factor.
 *  Pins 1..5 align with the guide zones. */
const Motif = () => (
  <svg viewBox="0 0 430 320" className="vg-motif" role="img" aria-label="Liver enzyme pattern map">
    <defs>
      <linearGradient id="liver-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6dca0" />
        <stop offset="1" stopColor="#e7b85c" />
      </linearGradient>
      <linearGradient id="liver-gb" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a7d6a0" />
        <stop offset="1" stopColor="#7fb877" />
      </linearGradient>
      <filter id="liver-sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2d1e5a" floodOpacity="0.12" />
      </filter>
    </defs>
    {/* abdominal field */}
    <path d="M70 40 Q215 8 360 40 Q372 150 330 250 Q215 320 100 250 Q58 150 70 40 Z" fill="#fbfaff" stroke="#e2ddf4" strokeWidth={2} />
    {/* liver wedge/blob */}
    <path d="M90 110 Q120 78 200 80 Q290 82 340 108 Q352 140 332 180 Q300 222 220 228 Q150 232 112 198 Q84 168 90 110 Z" fill="url(#liver-body)" stroke="#c79a3a" strokeWidth={1.5} filter="url(#liver-sh)" />
    {/* soft internal divider: left = hepatocellular, right = cholestatic */}
    <path d="M225 88 Q236 150 222 224" fill="none" stroke="#c79a3a" strokeWidth={1.5} strokeLinecap="round" opacity={0.55} />
    {/* gallbladder */}
    <ellipse cx={250} cy={200} rx={20} ry={28} fill="url(#liver-gb)" stroke="#5f9457" strokeWidth={1.5} filter="url(#liver-sh)" transform="rotate(18 250 200)" />
    {/* bile duct line */}
    <path d="M252 224 Q262 252 248 276" fill="none" stroke="#7fb877" strokeWidth={5} strokeLinecap="round" />
    {/* pins */}
    <g fontWeight={900} fontSize={14} textAnchor="middle">
      <g><circle cx={150} cy={130} r={15} fill={RED} filter="url(#liver-sh)" /><text x={150} y={135} fill="#fff">1</text></g>
      <g><circle cx={300} cy={140} r={15} fill={RED} filter="url(#liver-sh)" /><text x={300} y={145} fill="#fff">2</text></g>
      <g><circle cx={225} cy={120} r={15} fill={AMBER} filter="url(#liver-sh)" /><text x={225} y={125} fill="#fff">3</text></g>
      <g><circle cx={160} cy={210} r={15} fill={RED_DEEP} filter="url(#liver-sh)" /><text x={160} y={215} fill="#fff">4</text></g>
      <g><circle cx={300} cy={215} r={15} fill={AMBER} filter="url(#liver-sh)" /><text x={300} y={220} fill="#fff">5</text></g>
    </g>
  </svg>
);

export const liverGuide: CategoryVisualGuide = {
  category: "Abnormal Liver Enzymes",
  tagline: "hepatocellular vs cholestatic · R-factor",
  accent: "#ca8a04",
  accentSoft: "#fff6da",
  Icon,
  Motif,
  zones: [
    {
      n: 1,
      name: "Hepatocellular (AST/ALT ≫)",
      color: RED,
      dx: [
        { label: "Viral hepatitis", severity: "common" },
        { label: "Acetaminophen / toxic", severity: "must" },
        { label: "Alcoholic", severity: "common" },
        { label: "Ischemic “shock liver”", severity: "must" },
        { label: "Autoimmune / Wilson", severity: "common" },
      ],
    },
    {
      n: 2,
      name: "Cholestatic (ALP/bili ≫)",
      color: RED,
      dx: [
        { label: "Choledocholithiasis / cholangitis", severity: "must" },
        { label: "PBC / PSC", severity: "common" },
        { label: "Drug", severity: "common" },
        { label: "Malignancy", severity: "must" },
      ],
    },
    {
      n: 3,
      name: "Mixed",
      color: AMBER,
      dx: [
        { label: "Drug-induced", severity: "common" },
        { label: "Infiltrative", severity: "common" },
      ],
    },
    {
      n: 4,
      name: "Acute liver failure",
      color: RED_DEEP,
      dx: [{ label: "Encephalopathy + coagulopathy", severity: "must" }],
    },
    {
      n: 5,
      name: "Vascular / other",
      color: AMBER,
      dx: [
        { label: "Budd-Chiari", severity: "must" },
        { label: "Congestion", severity: "common" },
        { label: "NAFLD", severity: "common" },
      ],
    },
  ],
  workup: {
    nodes: ["LFTs (R-factor)", "INR + albumin", "RUQ ultrasound", "Hepatitis panel + acetaminophen level"],
    branches: [
      { tag: "ALT ≫ ALP", to: "hepatocellular (viral / toxic / ischemic)" },
      { tag: "ALP ≫ ALT + dilated ducts", to: "obstruction → MRCP / ERCP" },
      { tag: "INR↑ + encephalopathy", to: "acute liver failure → NAC, transplant center" },
      { tag: "AST:ALT 2:1", to: "alcoholic" },
    ],
  },
  management: [
    { n: 1, color: RED, title: "Stabilize", detail: "screen for acute liver failure (INR, mental status); empiric NAC if any acetaminophen risk" },
    { n: 2, color: AMBER, title: "First tests", detail: "LFT pattern (R-factor) + RUQ US" },
    { n: 3, color: ACCENT, title: "Commit (classify)", detail: "hepatocellular vs cholestatic vs ALF" },
    { n: 4, color: ACCENT_DEEP, title: "Definitive Rx", detail: "treat cause — NAC, ERCP for cholangitis, stop hepatotoxins, alcohol cessation" },
    { n: 5, color: OK, title: "Disposition", detail: "transplant center if ALF; admit if jaundiced/coagulopathic" },
  ],
};
