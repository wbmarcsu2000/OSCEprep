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
      d="M12 3s6 7.2 6 11.5A6 6 0 0 1 6 14.5C6 10.2 12 3 12 3Z"
      fill="#fff"
    />
    <path
      d="M9 14.2a3 3 0 0 0 3 3"
      stroke="#ff6b9c"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** MCV size scale — three RBCs growing along the MCV axis, with retic lanes
 *  below. Pins 1..5 align with the guide zones. */
const Motif = () => (
  <svg viewBox="0 0 430 320" className="vg-motif" role="img" aria-label="Anemia MCV size scale">
    <defs>
      <radialGradient id="anemia-rbc" cx="0.5" cy="0.4" r="0.7">
        <stop offset="0" stopColor="#fff2f6" />
        <stop offset="1" stopColor="#ffd9e2" />
      </radialGradient>
      <linearGradient id="anemia-lane" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fbfaff" />
        <stop offset="1" stopColor="#f1ecfb" />
      </linearGradient>
      <filter id="anemia-sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2d1e5a" floodOpacity="0.12" />
      </filter>
    </defs>
    {/* MCV axis line */}
    <line x1={70} y1={150} x2={380} y2={150} stroke="#c9c2e6" strokeWidth={2.5} strokeLinecap="round" />
    <path d="M380 150 l-12 -6 v12 Z" fill="#c9c2e6" />
    <text x={372} y={132} fontWeight={800} fontSize={14} textAnchor="end" fill="#6b6485">MCV →</text>
    {/* RBC donuts (small → medium → large) */}
    <g filter="url(#anemia-sh)">
      <circle cx={110} cy={150} r={16} fill="url(#anemia-rbc)" stroke={RED} strokeWidth={3} />
      <circle cx={110} cy={150} r={7} fill="#fff2f6" />
    </g>
    <g filter="url(#anemia-sh)">
      <circle cx={215} cy={150} r={24} fill="url(#anemia-rbc)" stroke={RED} strokeWidth={3} />
      <circle cx={215} cy={150} r={11} fill="#fff2f6" />
    </g>
    <g filter="url(#anemia-sh)">
      <circle cx={325} cy={150} r={34} fill="url(#anemia-rbc)" stroke={RED} strokeWidth={3} />
      <circle cx={325} cy={150} r={16} fill="#fff2f6" />
    </g>
    {/* retic lanes */}
    <g>
      <rect x={42} y={222} width={158} height={52} rx={12} fill="url(#anemia-lane)" stroke="#e2ddf4" strokeWidth={1.5} />
      <text x={84} y={246} fontWeight={800} fontSize={12} fill="#6b6485">↑retic =</text>
      <text x={84} y={263} fontWeight={700} fontSize={11} fill="#6b6485">loss / hemolysis</text>
      <rect x={230} y={222} width={158} height={52} rx={12} fill="url(#anemia-lane)" stroke="#e2ddf4" strokeWidth={1.5} />
      <text x={272} y={246} fontWeight={800} fontSize={12} fill="#6b6485">↓retic =</text>
      <text x={272} y={263} fontWeight={700} fontSize={11} fill="#6b6485">underproduction</text>
    </g>
    {/* corner blood drop */}
    <g filter="url(#anemia-sh)">
      <path d="M392 32 C392 32 405 47 405 56 a13 13 0 0 1 -26 0 C379 47 392 32 392 32 Z" fill={RED} />
      <path d="M386 54 a6 6 0 0 0 6 6" fill="none" stroke="#ffd9e2" strokeWidth={1.5} strokeLinecap="round" />
    </g>
    {/* pins */}
    <g fontWeight={900} fontSize={14} textAnchor="middle">
      <g><circle cx={110} cy={150} r={15} fill={RED} filter="url(#anemia-sh)" /><text x={110} y={155} fill="#fff">1</text></g>
      <g><circle cx={215} cy={150} r={15} fill={RED} filter="url(#anemia-sh)" /><text x={215} y={155} fill="#fff">2</text></g>
      <g><circle cx={325} cy={150} r={15} fill={AMBER} filter="url(#anemia-sh)" /><text x={325} y={155} fill="#fff">3</text></g>
      <g><circle cx={61} cy={248} r={15} fill={RED_DEEP} filter="url(#anemia-sh)" /><text x={61} y={253} fill="#fff">4</text></g>
      <g><circle cx={249} cy={248} r={15} fill={AMBER} filter="url(#anemia-sh)" /><text x={249} y={253} fill="#fff">5</text></g>
    </g>
  </svg>
);

export const anemiaGuide: CategoryVisualGuide = {
  category: "Anemia",
  tagline: "loss vs hemolysis vs underproduction",
  accent: "#e11d6b",
  accentSoft: "#ffe9f1",
  Icon,
  Motif,
  zones: [
    {
      n: 1,
      name: "Microcytic (low MCV)",
      color: RED,
      dx: [
        { label: "Iron deficiency / occult GI bleed", severity: "must" },
        { label: "Thalassemia", severity: "common" },
        { label: "ACD", severity: "common" },
      ],
    },
    {
      n: 2,
      name: "Normocytic",
      color: RED,
      dx: [
        { label: "Acute blood loss", severity: "must" },
        { label: "ACD / CKD", severity: "common" },
        { label: "Early iron def", severity: "common" },
      ],
    },
    {
      n: 3,
      name: "Macrocytic",
      color: AMBER,
      dx: [
        { label: "B12 / folate deficiency", severity: "common" },
        { label: "Alcohol / hypothyroid", severity: "common" },
        { label: "MDS", severity: "common" },
      ],
    },
    {
      n: 4,
      name: "High retic — loss / hemolysis",
      color: RED_DEEP,
      dx: [
        { label: "GI bleed", severity: "must" },
        { label: "Hemolysis: AIHA / TTP", severity: "must" },
        { label: "G6PD / sickle", severity: "common" },
      ],
    },
    {
      n: 5,
      name: "Low retic — underproduction",
      color: AMBER,
      dx: [
        { label: "MDS", severity: "common" },
        { label: "Aplastic", severity: "must" },
        { label: "Marrow infiltration", severity: "common" },
      ],
    },
  ],
  workup: {
    nodes: ["CBC + smear + reticulocyte", "Iron studies", "B12 / folate", "LDH / haptoglobin / bilirubin"],
    branches: [
      { tag: "low MCV", to: "iron studies → GI eval" },
      { tag: "high retic + hemolysis labs", to: "DAT + smear (schistocytes?)" },
      { tag: "macrocytic, low retic", to: "B12/folate, marrow" },
      { tag: "melena / hematochezia", to: "endoscopy" },
    ],
  },
  management: [
    { n: 1, color: RED, title: "Stabilize", detail: "transfuse if unstable or Hgb <7; control active bleeding" },
    { n: 2, color: AMBER, title: "First tests", detail: "smear + reticulocyte count" },
    { n: 3, color: ACCENT, title: "Commit (classify)", detail: "classify by MCV + retic (loss / hemolysis / underproduction)" },
    { n: 4, color: ACCENT_DEEP, title: "Definitive Rx", detail: "treat cause — iron / B12, PLEX for TTP, stop the bleed, heme referral" },
    { n: 5, color: OK, title: "Disposition", detail: "admit if unstable / TTP / severe" },
  ],
};
