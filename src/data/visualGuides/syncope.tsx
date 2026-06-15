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
      d="M12 20.5s-6.8-4.2-8.6-8.3C2 8.7 3.8 6.1 6.5 6.1c1.8 0 2.7 1.1 3.4 2.1C10.9 7.1 11.8 6.1 13.6 6.1c2.7 0 4.5 2.6 3.1 5.7-.6 1.4-1.7 2.7-2.8 3.8"
      fill="#fff"
    />
    <path
      d="M13 3.5l-2.6 6.2h3.4L11 16"
      stroke="#fbb"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Perfusion map — "is it the heart?" Brain on top, heart below, two vessel
 *  loops carrying flow that can drop. Pins 1..5 align with the guide zones. */
const Motif = () => (
  <svg viewBox="0 0 430 320" className="vg-motif" role="img" aria-label="Syncope perfusion map">
    <defs>
      <linearGradient id="syncope-brain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#faf7ff" />
        <stop offset="1" stopColor="#eee6ff" />
      </linearGradient>
      <linearGradient id="syncope-heart" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ff8e8e" />
        <stop offset="1" stopColor="#ff6b6b" />
      </linearGradient>
      <filter id="syncope-sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2d1e5a" floodOpacity="0.12" />
      </filter>
    </defs>
    {/* brain */}
    <circle cx={215} cy={80} r={48} fill="url(#syncope-brain)" stroke="#e3d8fb" strokeWidth={1.5} filter="url(#syncope-sh)" />
    <g stroke="#e3d8fb" strokeWidth={2} fill="none" strokeLinecap="round">
      <path d="M195 55 Q205 70 192 82 Q205 94 195 108" />
      <path d="M235 55 Q225 70 238 82 Q225 94 235 108" />
      <path d="M215 48 Q215 64 215 80 Q215 96 215 112" />
    </g>
    {/* perfusion vessel loops — flow to the brain */}
    <path d="M188 116 Q120 150 130 215 Q150 250 200 230" fill="none" stroke="#f25eb0" strokeWidth={7} strokeLinecap="round" />
    <path d="M242 116 Q310 150 300 215 Q250 250 230 230" fill="none" stroke="#f25eb0" strokeWidth={7} strokeLinecap="round" />
    {/* downward arrow — the drop */}
    <g stroke="#f25eb0" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M126 160 L126 192" />
      <path d="M116 182 L126 194 L136 182" />
    </g>
    {/* heart */}
    <path d="M215 198 c-18 -20 -46 -11 -46 13 c0 24 33 40 46 53 c13 -13 46 -29 46 -53 c0 -24 -28 -33 -46 -13 Z" fill="url(#syncope-heart)" stroke={RED} strokeWidth={1.5} filter="url(#syncope-sh)" />
    {/* pins */}
    <g fontWeight={900} fontSize={14} textAnchor="middle">
      <g><circle cx={108} cy={150} r={15} fill={AMBER} filter="url(#syncope-sh)" /><text x={108} y={155} fill="#fff">1</text></g>
      <g><circle cx={108} cy={205} r={15} fill={AMBER} filter="url(#syncope-sh)" /><text x={108} y={210} fill="#fff">2</text></g>
      <g><circle cx={322} cy={140} r={15} fill={RED_DEEP} filter="url(#syncope-sh)" /><text x={322} y={145} fill="#fff">3</text></g>
      <g><circle cx={322} cy={205} r={15} fill={RED_DEEP} filter="url(#syncope-sh)" /><text x={322} y={210} fill="#fff">4</text></g>
      <g><circle cx={215} cy={290} r={15} fill={AMBER} filter="url(#syncope-sh)" /><text x={215} y={295} fill="#fff">5</text></g>
    </g>
  </svg>
);

export const syncopeGuide: CategoryVisualGuide = {
  category: "Syncope",
  tagline: "is it the heart?",
  accent: "#f25eb0",
  accentSoft: "#ffe9f5",
  Icon,
  Motif,
  zones: [
    {
      n: 1,
      name: "Reflex / vasovagal",
      color: AMBER,
      dx: [
        { label: "Vasovagal", severity: "common" },
        { label: "Situational", severity: "common" },
        { label: "Carotid sinus", severity: "common" },
      ],
    },
    {
      n: 2,
      name: "Orthostatic",
      color: AMBER,
      dx: [
        { label: "Volume loss / bleed", severity: "must" },
        { label: "Medications", severity: "common" },
        { label: "Autonomic", severity: "common" },
      ],
    },
    {
      n: 3,
      name: "Cardiac — arrhythmia",
      color: RED_DEEP,
      dx: [
        { label: "Heart block", severity: "must" },
        { label: "VT / Long QT / Brugada", severity: "must" },
        { label: "Sick sinus", severity: "must" },
      ],
    },
    {
      n: 4,
      name: "Cardiac — structural",
      color: RED_DEEP,
      dx: [
        { label: "Aortic stenosis", severity: "must" },
        { label: "HOCM", severity: "must" },
        { label: "PE", severity: "must" },
        { label: "Tamponade / MI", severity: "must" },
      ],
    },
    {
      n: 5,
      name: "Mimic",
      color: AMBER,
      dx: [
        { label: "Seizure", severity: "common" },
        { label: "Hypoglycemia", severity: "common" },
        { label: "Psychogenic", severity: "common" },
      ],
    },
  ],
  workup: {
    nodes: ["Orthostatic vitals", "EKG", "Troponin", "± Echo / telemetry"],
    branches: [
      { tag: "orthostatic drop", to: "volume / med review" },
      { tag: "block / long-QT / Brugada", to: "admit + EP" },
      { tag: "murmur", to: "echo (AS / HOCM)" },
      { tag: "exertional / cardiac", to: "telemetry + echo" },
    ],
  },
  management: [
    { n: 1, color: RED, title: "Stabilize", detail: "ABCs, IV, continuous telemetry" },
    { n: 2, color: AMBER, title: "First tests", detail: "EKG + orthostatics + troponin" },
    { n: 3, color: ACCENT, title: "Commit (classify)", detail: "reflex/orthostatic vs CARDIAC — risk-stratify (Canadian Syncope)" },
    { n: 4, color: ACCENT_DEEP, title: "Definitive Rx", detail: "treat cause (pacemaker, rhythm control, valve, volume)" },
    { n: 5, color: OK, title: "Disposition", detail: "admit high-risk; discharge low-risk with follow-up" },
  ],
};
