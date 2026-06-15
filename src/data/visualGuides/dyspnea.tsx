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
      d="M12 4v6M12 4c-.8 0-1.5.7-1.5 1.5V10"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 8C7 8 5.5 10 5.5 13c0 3 .3 5.5 1.2 6.5.8.9 2.3.6 2.6-.7.4-1.6.7-4 .7-6.8 0-2.4-.5-4-1.5-4ZM14.5 8c2.5 0 4 2 4 5 0 3-.3 5.5-1.2 6.5-.8.9-2.3.6-2.6-.7-.4-1.6-.7-4-.7-6.8 0-2.4.5-4 1.5-4Z"
      fill="#fff"
    />
  </svg>
);

/** Anatomic "danger map" — dyspnea mapped onto the airway, lungs, pleura,
 *  vessels and heart. Pins 1..5 align with the guide zones. */
const Motif = () => (
  <svg viewBox="0 0 430 320" className="vg-motif" role="img" aria-label="Dyspnea anatomy danger map">
    <defs>
      <linearGradient id="dyspnea-lung" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#eaf4ff" />
        <stop offset="1" stopColor="#cfe6ff" />
      </linearGradient>
      <linearGradient id="dyspnea-heart" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ff8e8e" />
        <stop offset="1" stopColor="#ff6b6b" />
      </linearGradient>
      <filter id="dyspnea-sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2d1e5a" floodOpacity="0.12" />
      </filter>
    </defs>
    {/* ribcage shield */}
    <path d="M70 40 Q215 8 360 40 Q372 150 330 250 Q215 320 100 250 Q58 150 70 40 Z" fill="#fbfaff" stroke="#e2ddf4" strokeWidth={2} />
    <g stroke="#ece8f8" strokeWidth={2} fill="none">
      <path d="M92 95 Q215 70 338 95" />
      <path d="M90 130 Q215 108 340 130" />
      <path d="M94 165 Q215 145 336 165" />
      <path d="M104 200 Q215 182 326 200" />
    </g>
    {/* lungs */}
    <path d="M150 78 Q120 96 116 160 Q116 215 150 232 Q176 220 178 150 Q178 92 168 78 Z" fill="url(#dyspnea-lung)" stroke="#bcd8f7" strokeWidth={1.5} filter="url(#dyspnea-sh)" />
    <path d="M280 78 Q310 96 314 160 Q314 215 280 232 Q254 220 252 150 Q252 92 262 78 Z" fill="url(#dyspnea-lung)" stroke="#bcd8f7" strokeWidth={1.5} filter="url(#dyspnea-sh)" />
    {/* airway: trachea + Y bronchi */}
    <g stroke="#9cc7f5" strokeWidth={6} strokeLinecap="round" fill="none">
      <rect x={207} y={55} width={16} height={66} rx={8} fill="#eaf4ff" />
      <path d="M215 118 Q176 140 152 168" />
      <path d="M215 118 Q254 140 278 152" />
    </g>
    {/* heart */}
    <path d="M215 214 c-16 -18 -42 -10 -42 12 c0 22 30 36 42 48 c12 -12 42 -26 42 -48 c0 -22 -26 -30 -42 -12 Z" fill="url(#dyspnea-heart)" stroke={RED} strokeWidth={1.5} filter="url(#dyspnea-sh)" />
    {/* pins */}
    <g fontWeight={900} fontSize={14} textAnchor="middle">
      <g><circle cx={215} cy={66} r={15} fill={AMBER} filter="url(#dyspnea-sh)" /><text x={215} y={71} fill="#fff">1</text></g>
      <g><circle cx={150} cy={170} r={15} fill={RED} filter="url(#dyspnea-sh)" /><text x={150} y={175} fill="#fff">2</text></g>
      <g><circle cx={300} cy={150} r={15} fill={RED} filter="url(#dyspnea-sh)" /><text x={300} y={155} fill="#fff">3</text></g>
      <g><circle cx={258} cy={112} r={15} fill={RED_DEEP} filter="url(#dyspnea-sh)" /><text x={258} y={117} fill="#fff">4</text></g>
      <g><circle cx={215} cy={238} r={15} fill={RED} filter="url(#dyspnea-sh)" /><text x={215} y={243} fill="#fff">5</text></g>
    </g>
  </svg>
);

export const dyspneaGuide: CategoryVisualGuide = {
  category: "Dyspnea",
  tagline: "cardiac vs pulmonary · BREATHE",
  accent: "#3b9eff",
  accentSoft: "#e8f3ff",
  Icon,
  Motif,
  zones: [
    {
      n: 1,
      name: "Airway",
      color: AMBER,
      dx: [
        { label: "Asthma", severity: "common" },
        { label: "COPD exacerbation", severity: "common" },
      ],
    },
    {
      n: 2,
      name: "Alveoli",
      color: RED,
      dx: [
        { label: "Pneumonia", severity: "must" },
        { label: "Pulmonary edema", severity: "common" },
      ],
    },
    {
      n: 3,
      name: "Pleura",
      color: RED,
      dx: [
        { label: "Pneumothorax", severity: "must" },
        { label: "Pleural effusion", severity: "common" },
      ],
    },
    {
      n: 4,
      name: "Vessels",
      color: RED_DEEP,
      dx: [{ label: "Pulmonary embolism", severity: "must" }],
    },
    {
      n: 5,
      name: "Heart / blood",
      color: RED,
      dx: [
        { label: "Heart failure", severity: "must" },
        { label: "Tamponade", severity: "must" },
        { label: "Anaphylaxis", severity: "must" },
        { label: "Severe anemia", severity: "common" },
      ],
    },
  ],
  workup: {
    nodes: ["CXR", "EKG", "ABG / VBG", "BNP, troponin, D-dimer"],
    branches: [
      { tag: "B-lines / edema", to: "diurese (HF)" },
      { tag: "wheeze", to: "bronchodilators ± steroids" },
      { tag: "consolidation", to: "antibiotics (PNA)" },
      { tag: "clear film + hypoxic", to: "Wells → CTPA (PE)" },
    ],
  },
  management: [
    { n: 1, color: RED, title: "Stabilize", detail: "O₂ to target, airway; epinephrine if anaphylaxis" },
    { n: 2, color: AMBER, title: "First tests", detail: "CXR + EKG + ABG" },
    { n: 3, color: ACCENT, title: "Commit (classify)", detail: "cardiac vs pulmonary by exam + CXR + BNP" },
    { n: 4, color: ACCENT_DEEP, title: "Definitive Rx", detail: "treat the cause (diurese / bronchodilate / anticoagulate / decompress)" },
    { n: 5, color: OK, title: "Disposition", detail: "admit vs ICU vs discharge" },
  ],
};
