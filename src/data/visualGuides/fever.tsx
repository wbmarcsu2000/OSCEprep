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
      d="M11 4.5a2.5 2.5 0 0 1 5 0v9.1a4 4 0 1 1-5 0V4.5Z"
      fill="#fff"
    />
    <circle cx={13.5} cy={17.5} r={2.4} fill="#ff6b6b" />
    <rect x={12.6} y={7} width={1.8} height={8.5} rx={0.9} fill="#ff6b6b" />
    <path d="M16.5 6.5h3M16.5 9.5h3M16.5 12.5h3" stroke="#ff6b6b" strokeWidth={1.5} strokeLinecap="round" />
  </svg>
);

/** Head-to-toe "find the source" map — pins 1..5 walk the body looking for the
 *  fever's origin and align with the guide zones. */
const Motif = () => (
  <svg viewBox="0 0 430 320" className="vg-motif" role="img" aria-label="Fever head-to-toe source map">
    <defs>
      <linearGradient id="fever-merc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ff8e8e" />
        <stop offset="1" stopColor="#e5484d" />
      </linearGradient>
      <filter id="fever-sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2d1e5a" floodOpacity="0.12" />
      </filter>
    </defs>
    {/* thermometer (left) */}
    <rect x={61} y={36} width={18} height={210} rx={9} fill="#fbfaff" stroke="#e2ddf4" strokeWidth={2} filter="url(#fever-sh)" />
    <rect x={64} y={120} width={12} height={120} rx={6} fill="url(#fever-merc)" />
    <circle cx={70} cy={252} r={20} fill="url(#fever-merc)" stroke={RED} strokeWidth={1.5} filter="url(#fever-sh)" />
    <g stroke="#e2ddf4" strokeWidth={2} strokeLinecap="round">
      <path d="M82 70h8" />
      <path d="M82 100h8" />
      <path d="M82 130h8" />
      <path d="M82 160h8" />
      <path d="M82 190h8" />
    </g>
    {/* body silhouette (center) */}
    <circle cx={215} cy={55} r={24} fill="#fff6f5" stroke="#f3c9c6" strokeWidth={1.5} filter="url(#fever-sh)" />
    <rect x={175} y={84} width={80} height={126} rx={26} fill="#fff6f5" stroke="#f3c9c6" strokeWidth={1.5} filter="url(#fever-sh)" />
    <path d="M192 208 Q190 250 188 286" fill="none" stroke="#f3c9c6" strokeWidth={14} strokeLinecap="round" />
    <path d="M238 208 Q240 250 242 286" fill="none" stroke="#f3c9c6" strokeWidth={14} strokeLinecap="round" />
    {/* outstretched limb (skin / line) */}
    <path d="M251 110 Q286 130 306 150" fill="none" stroke="#f3c9c6" strokeWidth={12} strokeLinecap="round" />
    {/* pins */}
    <g fontWeight={900} fontSize={14} textAnchor="middle">
      <g><circle cx={215} cy={55} r={15} fill={RED_DEEP} filter="url(#fever-sh)" /><text x={215} y={60} fill="#fff">1</text></g>
      <g><circle cx={215} cy={120} r={15} fill={RED} filter="url(#fever-sh)" /><text x={215} y={125} fill="#fff">2</text></g>
      <g><circle cx={215} cy={170} r={15} fill={RED} filter="url(#fever-sh)" /><text x={215} y={175} fill="#fff">3</text></g>
      <g><circle cx={215} cy={205} r={15} fill={AMBER} filter="url(#fever-sh)" /><text x={215} y={210} fill="#fff">4</text></g>
      <g><circle cx={258} cy={150} r={15} fill={RED} filter="url(#fever-sh)" /><text x={258} y={155} fill="#fff">5</text></g>
    </g>
  </svg>
);

export const feverGuide: CategoryVisualGuide = {
  category: "Fever",
  tagline: "find the source, head to toe",
  accent: "#ef5350",
  accentSoft: "#ffeceb",
  Icon,
  Motif,
  zones: [
    {
      n: 1,
      name: "CNS",
      color: RED_DEEP,
      dx: [{ label: "Meningitis / encephalitis", severity: "must" }],
    },
    {
      n: 2,
      name: "Cardiopulmonary",
      color: RED,
      dx: [
        { label: "Pneumonia", severity: "must" },
        { label: "Endocarditis", severity: "must" },
      ],
    },
    {
      n: 3,
      name: "Abdomen",
      color: RED,
      dx: [
        { label: "Intra-abdominal abscess", severity: "must" },
        { label: "Cholangitis", severity: "must" },
        { label: "Pyelonephritis", severity: "common" },
      ],
    },
    {
      n: 4,
      name: "GU / pelvis",
      color: AMBER,
      dx: [
        { label: "UTI / pyelonephritis", severity: "common" },
        { label: "PID", severity: "common" },
      ],
    },
    {
      n: 5,
      name: "Skin / MSK / lines",
      color: RED,
      dx: [
        { label: "Cellulitis", severity: "common" },
        { label: "Septic arthritis / nec fasc", severity: "must" },
        { label: "Line infection", severity: "common" },
      ],
    },
  ],
  workup: {
    nodes: ["CBC + 2 blood cultures", "UA + culture", "CXR", "Lactate"],
    branches: [
      { tag: "neck stiffness", to: "LP → meningitis abx" },
      { tag: "murmur / IVDU", to: "echo (endocarditis)" },
      { tag: "flank / dysuria", to: "treat pyelo / UTI" },
      { tag: "hot swollen joint", to: "arthrocentesis" },
    ],
  },
  management: [
    { n: 1, color: RED, title: "Stabilize", detail: "sepsis — IV fluids + broad-spectrum antibiotics within 1 h" },
    { n: 2, color: AMBER, title: "First tests", detail: "cultures BEFORE antibiotics, lactate" },
    { n: 3, color: ACCENT, title: "Commit (classify)", detail: "localize the source head-to-toe" },
    { n: 4, color: ACCENT_DEEP, title: "Definitive Rx", detail: "source control + narrow the antibiotics to culture" },
    { n: 5, color: OK, title: "Disposition", detail: "floor vs ICU by sepsis severity" },
  ],
};
