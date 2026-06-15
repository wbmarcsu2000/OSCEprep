import type { CategoryVisualGuide } from "./types";

const RED = "#e5484d";
const RED_DEEP = "#c0262c";
const AMBER = "#d97706";
const ACCENT = "#5634e0";
const ACCENT_DEEP = "#4326c0";
const OK = "#0ca678";

const Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={22} height={22} aria-hidden>
    <rect x={3.5} y={3.5} width={17} height={17} rx={6} fill="#fff" />
    <circle cx={12} cy={12.2} r={1.6} fill="#f59e0b" />
    <path
      d="M5.5 12h13M12 5.5v13"
      stroke="#f59e0b"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.55}
    />
  </svg>
);

/** Anatomic "danger map" — pain mapped onto the belly quadrants. Pins 1..5
 *  align with the guide zones. */
const Motif = () => (
  <svg viewBox="0 0 430 320" className="vg-motif" role="img" aria-label="Abdomen quadrant danger map">
    <defs>
      <linearGradient id="abdomen-belly" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fffaf0" />
        <stop offset="1" stopColor="#fff3df" />
      </linearGradient>
      <filter id="abdomen-sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2d1e5a" floodOpacity="0.12" />
      </filter>
    </defs>
    {/* belly */}
    <rect x={70} y={40} width={290} height={240} rx={46} fill="url(#abdomen-belly)" stroke="#f0e2c4" strokeWidth={2} filter="url(#abdomen-sh)" />
    {/* colon arch hint */}
    <path d="M112 92 Q112 70 150 70 L280 70 Q318 70 318 92 L318 200 Q318 240 280 240 L150 240 Q112 240 112 200 Z" fill="none" stroke="#f0d9a8" strokeWidth={9} strokeLinecap="round" opacity={0.7} />
    {/* quadrant lines */}
    <g stroke="#efe6d2" strokeWidth={2}>
      <path d="M215 60 L215 260" />
      <path d="M90 160 L340 160" />
    </g>
    {/* navel */}
    <circle cx={215} cy={168} r={7} fill="none" stroke="#e3cf9e" strokeWidth={2} />
    {/* pins */}
    <g fontWeight={900} fontSize={14} textAnchor="middle">
      <g><circle cx={150} cy={108} r={15} fill={RED} filter="url(#abdomen-sh)" /><text x={150} y={113} fill="#fff">1</text></g>
      <g><circle cx={215} cy={96} r={15} fill={RED_DEEP} filter="url(#abdomen-sh)" /><text x={215} y={101} fill="#fff">2</text></g>
      <g><circle cx={150} cy={235} r={15} fill={RED} filter="url(#abdomen-sh)" /><text x={150} y={240} fill="#fff">3</text></g>
      <g><circle cx={285} cy={235} r={15} fill={AMBER} filter="url(#abdomen-sh)" /><text x={285} y={240} fill="#fff">4</text></g>
      <g><circle cx={215} cy={210} r={15} fill={RED} filter="url(#abdomen-sh)" /><text x={215} y={215} fill="#fff">5</text></g>
    </g>
  </svg>
);

export const abdomenGuide: CategoryVisualGuide = {
  category: "Abdominal Pain",
  tagline: "the surgical abdomen · POV-GI",
  accent: "#f59e0b",
  accentSoft: "#fff6e6",
  Icon,
  Motif,
  zones: [
    {
      n: 1,
      name: "RUQ",
      color: RED,
      dx: [
        { label: "Cholangitis", severity: "must" },
        { label: "Cholecystitis", severity: "must" },
        { label: "Hepatitis", severity: "common" },
      ],
    },
    {
      n: 2,
      name: "Epigastric / central",
      color: RED_DEEP,
      dx: [
        { label: "Pancreatitis", severity: "must" },
        { label: "Perforated ulcer", severity: "must" },
        { label: "MI referred", severity: "must" },
        { label: "AAA", severity: "must" },
      ],
    },
    {
      n: 3,
      name: "RLQ",
      color: RED,
      dx: [
        { label: "Appendicitis", severity: "must" },
        { label: "Ectopic / ovarian torsion", severity: "must" },
      ],
    },
    {
      n: 4,
      name: "LLQ",
      color: AMBER,
      dx: [
        { label: "Diverticulitis", severity: "common" },
        { label: "Ischemic colitis", severity: "must" },
      ],
    },
    {
      n: 5,
      name: "Diffuse / vascular",
      color: RED,
      dx: [
        { label: "Mesenteric ischemia", severity: "must" },
        { label: "SBO / obstruction", severity: "must" },
        { label: "DKA", severity: "must" },
      ],
    },
  ],
  workup: {
    nodes: ["CBC + CMP + lipase", "β-hCG", "Upright CXR", "CT / US abdomen"],
    branches: [
      { tag: "free air under diaphragm", to: "surgery (perforation)" },
      { tag: "lipase ×3 ULN", to: "pancreatitis care" },
      { tag: "RLQ + fever, +β-hCG", to: "US (ectopic) / CT (appendix)" },
      { tag: "pain ≫ exam, lactate↑", to: "CT angiogram (mesenteric)" },
    ],
  },
  management: [
    { n: 1, color: RED, title: "Stabilize", detail: "NPO, 2 large-bore IV fluids, analgesia + antiemetics" },
    { n: 2, color: AMBER, title: "First tests", detail: "CBC/CMP/lipase, upright CXR, β-hCG" },
    { n: 3, color: ACCENT, title: "Commit (classify)", detail: "localize by quadrant + labs" },
    { n: 4, color: ACCENT_DEEP, title: "Definitive Rx", detail: "surgery consult for the surgical abdomen; antibiotics for perforation/infection; ERCP for cholangitis" },
    { n: 5, color: OK, title: "Disposition", detail: "admit / OR vs observation" },
  ],
};
