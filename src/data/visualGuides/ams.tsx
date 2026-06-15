import type { CategoryVisualGuide } from "./types";

const RED = "#e5484d";
const AMBER = "#d97706";
const ACCENT = "#5634e0";
const ACCENT_DEEP = "#4326c0";
const OK = "#0ca678";

const Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={22} height={22} aria-hidden>
    <path
      d="M9 3.2c-1.7 0-3 1.2-3.2 2.8C4.4 6.4 3.5 7.6 3.5 9c0 .9.4 1.7 1 2.3-.6.6-1 1.4-1 2.4 0 1.5 1.1 2.8 2.6 3 .3 1.4 1.5 2.4 3 2.4.9 0 1.6-.4 2.1-.9V4.1c-.5-.5-1.3-.9-2.2-.9Z"
      fill="#fff"
    />
    <path
      d="M15 3.2c1.7 0 3 1.2 3.2 2.8 1.4.4 2.3 1.6 2.3 3 0 .9-.4 1.7-1 2.3.6.6 1 1.4 1 2.4 0 1.5-1.1 2.8-2.6 3-.3 1.4-1.5 2.4-3 2.4-.9 0-1.6-.4-2.1-.9V4.1c.5-.5 1.3-.9 2.2-.9Z"
      fill="#fff"
    />
    <path d="M12 4.1v15" stroke="#7c3aed" strokeWidth={1.5} strokeLinecap="round" />
  </svg>
);

/** Brain "reversible-cause map" — M-I-S-T quadrants on the cortex. Pins 1..4
 *  align with the guide zones. */
const Motif = () => (
  <svg viewBox="0 0 430 320" className="vg-motif" role="img" aria-label="Altered mental status brain map">
    <defs>
      <linearGradient id="ams-brain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fbf9ff" />
        <stop offset="1" stopColor="#f3eeff" />
      </linearGradient>
      <filter id="ams-sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2d1e5a" floodOpacity="0.12" />
      </filter>
    </defs>
    {/* brain dome */}
    <circle cx={215} cy={150} r={96} fill="#faf7ff" stroke="#e3d8fb" strokeWidth={2} filter="url(#ams-sh)" />
    {/* quadrant tints (M-I-S-T) */}
    <clipPath id="ams-clip">
      <circle cx={215} cy={150} r={94} />
    </clipPath>
    <g clipPath="url(#ams-clip)">
      <rect x={119} y={54} width={96} height={96} fill="#e6faf2" />
      <rect x={215} y={54} width={96} height={96} fill="#ffecec" />
      <rect x={119} y={150} width={96} height={96} fill="#f1ebff" />
      <rect x={215} y={150} width={96} height={96} fill="#fff4e0" />
    </g>
    {/* faint quadrant cross */}
    <g stroke="#e3d8fb" strokeWidth={1.5}>
      <line x1={215} y1={56} x2={215} y2={244} />
      <line x1={121} y1={150} x2={309} y2={150} />
    </g>
    {/* gyri suggestion */}
    <g stroke="#e9ddfb" strokeWidth={1.5} fill="none" strokeLinecap="round">
      <path d="M150 108 Q172 96 196 108 Q172 122 150 112" />
      <path d="M234 108 Q258 96 282 108 Q258 122 234 112" />
      <path d="M150 196 Q172 184 196 196 Q172 210 150 200" />
      <path d="M234 196 Q258 184 282 196 Q258 210 234 200" />
      <path d="M138 150 Q160 138 184 150" />
      <path d="M246 150 Q270 138 292 150" />
    </g>
    {/* brainstem */}
    <rect x={205} y={240} width={20} height={42} rx={10} fill="#f1ebff" stroke="#e3d8fb" strokeWidth={1.5} />
    {/* pins */}
    <g fontWeight={900} fontSize={14} textAnchor="middle">
      <g><circle cx={170} cy={108} r={15} fill={RED} filter="url(#ams-sh)" /><text x={170} y={113} fill="#fff">1</text></g>
      <g><circle cx={262} cy={108} r={15} fill={RED} filter="url(#ams-sh)" /><text x={262} y={113} fill="#fff">2</text></g>
      <g><circle cx={170} cy={196} r={15} fill={RED} filter="url(#ams-sh)" /><text x={170} y={201} fill="#fff">3</text></g>
      <g><circle cx={262} cy={196} r={15} fill={AMBER} filter="url(#ams-sh)" /><text x={262} y={201} fill="#fff">4</text></g>
    </g>
  </svg>
);

export const amsGuide: CategoryVisualGuide = {
  category: "Altered Mental Status",
  tagline: "reversible first · MIST",
  accent: "#7c3aed",
  accentSoft: "#f1ebff",
  Icon,
  Motif,
  zones: [
    {
      n: 1,
      name: "Metabolic",
      color: RED,
      dx: [
        { label: "Hypoglycemia", severity: "must" },
        { label: "Electrolytes / Na", severity: "must" },
        { label: "Hypoxia", severity: "must" },
        { label: "Uremia / hepatic enceph", severity: "common" },
      ],
    },
    {
      n: 2,
      name: "Infection",
      color: RED,
      dx: [
        { label: "Meningitis / encephalitis", severity: "must" },
        { label: "Sepsis / UTI", severity: "must" },
      ],
    },
    {
      n: 3,
      name: "Structural",
      color: RED,
      dx: [
        { label: "Stroke", severity: "must" },
        { label: "Intracranial bleed / TBI", severity: "must" },
        { label: "Seizure / postictal", severity: "common" },
      ],
    },
    {
      n: 4,
      name: "Toxic",
      color: AMBER,
      dx: [
        { label: "Drugs / overdose", severity: "must" },
        { label: "Alcohol withdrawal", severity: "must" },
        { label: "Serotonin / NMS", severity: "must" },
        { label: "CO", severity: "common" },
      ],
    },
  ],
  workup: {
    nodes: ["Fingerstick glucose", "BMP + Ca/Mg/NH3", "UA + Utox", "VBG"],
    branches: [
      { tag: "glucose low", to: "D50 / glucagon" },
      { tag: "focal deficit or trauma", to: "CT head" },
      { tag: "fever + neck stiffness", to: "LP → empiric abx/acyclovir" },
      { tag: "tox screen +", to: "specific antidote" },
    ],
  },
  management: [
    { n: 1, color: RED, title: "Stabilize", detail: "ABCs; give glucose, thiamine, naloxone if indicated" },
    { n: 2, color: AMBER, title: "First tests", detail: "fingerstick, BMP, Utox" },
    { n: 3, color: ACCENT, title: "Commit (classify)", detail: "search M-I-S-T for the reversible cause" },
    { n: 4, color: ACCENT_DEEP, title: "Definitive Rx", detail: "treat the cause (correct glucose/Na, antibiotics, reverse toxin)" },
    { n: 5, color: OK, title: "Disposition", detail: "admit + delirium precautions" },
  ],
};
