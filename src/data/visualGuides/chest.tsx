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
      d="M12 21s-7.5-4.6-9.5-9.2C1 8.4 3 5.5 6 5.5c2 0 3 1.2 3.8 2.3C10.7 6.7 11.7 5.5 13.7 5.5c3 0 5 2.9 3.5 6.3C19.5 16.4 12 21 12 21Z"
      fill="#fff"
    />
    <path
      d="M3 12.2h3l1.4-2.6 2 5 1.6-3.2 1 1.8h8"
      stroke="#ff6b6b"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Anatomic "danger map" — pain mapped onto chest structures. Pins 1..5 align
 *  with the guide zones. */
const Motif = () => (
  <svg viewBox="0 0 430 320" className="vg-motif" role="img" aria-label="Chest anatomy danger map">
    <defs>
      <linearGradient id="cp-lung" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#eaf4ff" />
        <stop offset="1" stopColor="#d6e9ff" />
      </linearGradient>
      <linearGradient id="cp-heart" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ff8e8e" />
        <stop offset="1" stopColor="#ff6b6b" />
      </linearGradient>
      <filter id="cp-sh" x="-20%" y="-20%" width="140%" height="140%">
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
    <path d="M150 78 Q120 96 116 160 Q116 215 150 232 Q176 220 178 150 Q178 92 168 78 Z" fill="url(#cp-lung)" stroke="#bcd8f7" strokeWidth={1.5} filter="url(#cp-sh)" />
    <path d="M280 78 Q310 96 314 160 Q314 215 280 232 Q254 220 252 150 Q252 92 262 78 Z" fill="url(#cp-lung)" stroke="#bcd8f7" strokeWidth={1.5} filter="url(#cp-sh)" />
    {/* aorta arch */}
    <path d="M210 96 Q210 60 232 60 Q256 60 256 92" fill="none" stroke={RED_DEEP} strokeWidth={9} strokeLinecap="round" opacity={0.85} />
    {/* heart */}
    <path d="M214 150 c-16 -18 -42 -10 -42 12 c0 22 30 36 42 48 c12 -12 42 -26 42 -48 c0 -22 -26 -30 -42 -12 Z" fill="url(#cp-heart)" stroke={RED} strokeWidth={1.5} filter="url(#cp-sh)" />
    {/* esophagus */}
    <rect x={206} y={150} width={12} height={92} rx={6} fill="#f3d9a6" stroke="#e3bf76" strokeWidth={1.4} />
    {/* pins */}
    <g fontWeight={900} fontSize={14} textAnchor="middle">
      <g><circle cx={234} cy={64} r={15} fill={RED_DEEP} filter="url(#cp-sh)" /><text x={234} y={69} fill="#fff">1</text></g>
      <g><circle cx={214} cy={186} r={15} fill={RED} filter="url(#cp-sh)" /><text x={214} y={191} fill="#fff">2</text></g>
      <g><circle cx={300} cy={150} r={15} fill={RED} filter="url(#cp-sh)" /><text x={300} y={155} fill="#fff">3</text></g>
      <g><circle cx={212} cy={240} r={15} fill={RED} filter="url(#cp-sh)" /><text x={212} y={245} fill="#fff">4</text></g>
      <g><circle cx={96} cy={250} r={15} fill={AMBER} filter="url(#cp-sh)" /><text x={96} y={255} fill="#fff">5</text></g>
    </g>
  </svg>
);

export const chestGuide: CategoryVisualGuide = {
  category: "Chest Pain",
  tagline: "the lethal six",
  accent: "#ff6b6b",
  accentSoft: "#fff1f1",
  Icon,
  Motif,
  zones: [
    { n: 1, name: "Aorta", color: RED_DEEP, dx: [{ label: "Aortic dissection", severity: "must" }] },
    {
      n: 2,
      name: "Heart",
      color: RED,
      dx: [
        { label: "ACS / MI", severity: "must" },
        { label: "Pericarditis → tamponade", severity: "must" },
        { label: "Stable angina", severity: "common" },
      ],
    },
    {
      n: 3,
      name: "Lungs & pleura",
      color: RED,
      dx: [
        { label: "PE", severity: "must" },
        { label: "Pneumothorax", severity: "must" },
        { label: "Pneumonia", severity: "common" },
      ],
    },
    {
      n: 4,
      name: "Esophagus",
      color: RED,
      dx: [
        { label: "Boerhaave", severity: "must" },
        { label: "GERD / spasm", severity: "common" },
      ],
    },
    {
      n: 5,
      name: "Chest wall & skin",
      color: AMBER,
      dx: [
        { label: "Costochondritis", severity: "common" },
        { label: "Herpes zoster", severity: "common" },
      ],
    },
  ],
  workup: {
    nodes: ["EKG <10 min", "Troponin", "CXR"],
    branches: [
      { tag: "ST elevation", to: "cath lab" },
      { tag: "wide mediastinum", to: "CT angiogram → surgery" },
      { tag: "pleuritic / hypoxic", to: "Wells → CTPA" },
      { tag: "all normal, low-risk", to: "HEART score → stress" },
    ],
  },
  management: [
    { n: 1, color: RED, title: "Stabilize", detail: "ABCs, IV · O₂ · monitor, vitals + bilateral BP" },
    { n: 2, color: AMBER, title: "First tests", detail: "EKG within 10 min, troponin, CXR" },
    { n: 3, color: ACCENT, title: "Commit the diagnosis", detail: "reconcile EKG + troponin + imaging with the danger map" },
    { n: 4, color: ACCENT_DEEP, title: "Definitive Rx", detail: "STEMI → PCI · dissection → BP control + surgery · PE → anticoagulate" },
    { n: 5, color: OK, title: "Disposition", detail: "admit / cath vs observation vs safe discharge + return precautions" },
  ],
};
