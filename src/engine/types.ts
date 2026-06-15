/**
 * Engine types.
 *
 * Raw* types mirror the case JSON on disk (both original 2.0 fields and
 * upgraded 2.1 fields, upgraded fields optional). CaseModel is the single
 * normalized internal shape produced by the schema adapter — the engine and
 * UI consume only CaseModel and never branch on raw JSON shape.
 */

// ---------------------------------------------------------------------------
// Raw schema (as authored). Do not rename/remove fields.
// ---------------------------------------------------------------------------

export interface RawVitals {
  BP: string;
  HR: string;
  RR: string;
  Temp: string;
  SpO2: string;
}

export interface RawChart {
  ageSex: string;
  cc: string;
  oneLiner: string;
  vitals: RawVitals;
  timer?: number;
}

export interface RawScoringItem {
  item: string;
  points: number;
}

/** As authored, scoring entries appear as {item,points}, {label,points}, or
 *  bare strings (upgraded read steps). The adapter normalizes all of them. */
export type RawScoringEntry =
  | string
  | { item?: string; label?: string; points?: number };

export interface RawSectionScoring {
  maxPoints: number;
  criticalActions?: RawScoringEntry[];
  coreActions?: RawScoringEntry[];
  bonusActions?: RawScoringEntry[];
  penalties?: RawScoringEntry[];
}

/** Normalized scoring consumed by the engine. */
export interface SectionScoring {
  maxPoints: number;
  criticalActions: RawScoringItem[];
  coreActions: RawScoringItem[];
  bonusActions: RawScoringItem[];
  penalties: RawScoringItem[];
}

/** Citation into a clinical reference (e.g. the MGH Housestaff Manual). Purely
 *  informational — surfaced in feedback so students can read the source for the
 *  management plan. Not used in scoring. */
export interface MghReference {
  /** Source title, e.g. "MGH Housestaff Manual 2024–2025". */
  manual: string;
  /** Chapter/section the management is drawn from. */
  section: string;
  /** Page in the source the case management is aligned to. */
  page: number;
}

export interface RawStep {
  id: string;
  label: string;
  max: number;
  prompt: string;
  rubric?: string;
  idealAnswer?: string;
  scoring?: RawSectionScoring;
  /** Clinical-reference citation for this step's content (management). */
  mghReference?: MghReference;
  // read steps
  type?: string;
  image?: string;
  keyFindings?: string[];
  criticalFindings?: string[];
  commonMistakes?: string[];
  // workup
  requiredTests?: string[];
  optionalTests?: string[];
  contraindicatedTests?: string[];
  orderSensitiveActions?: string[];
  reveal?: boolean;
  // differential
  mustNotMiss?: string[];
  acceptableAlternatives?: string[];
  // management
  requiredActions?: string[];
  optionalActions?: string[];
  unsafeActions?: string[];
  consults?: string[];
  disposition?: string;
}

export interface RawImage {
  label: string;
  asset: string | null;
  /** Optional second view (e.g. lateral CXR, right-sided ECG leads). */
  asset2?: string | null;
  /** Authoritative expert interpretation (the pathology + systematic read),
   *  shown when the student reveals the answer on a read step. */
  expertRead?: string;
  /** One-line clinical context for the (representative, different-patient)
   *  teaching study — the presenting vignette such a study carries on the
   *  library it came from. Shown alongside the study so the read has context. */
  clinicalVignette?: string;
  source?: string;
  license?: string;
  findings?: string;
  verify?: string;
  attribution?: string;
  assetNeeded?: boolean;
  imageDescription?: string;
  searchTerms?: string[];
  recommendedSource?: string;
  /** Integrated read: pin a specific LITFL study (by its `n`) so the displayed
   *  tracing/film is RELEVANT to this case's clinical puzzle, instead of the
   *  index-assigned standalone drill. The read step is then framed as the
   *  patient's own study and should be referenced by the revised/management
   *  rubrics. */
  litflStudyN?: number;
  /** Integrated read with case-authored content: skip the LITFL override
   *  entirely and use this image + the read step's authored scoring/findings as
   *  written (for pathologies not in the LITFL bank). */
  integrated?: boolean;
}

export interface RawStandardizedPatient {
  demeanor?: string;
  emotionalState?: string;
  healthLiteracy?: string;
  verbosity?: string;
  cooperativeness?: string;
  communicationStyle?: string;
  affect?: string;
  sensitiveTopics?: string[];
  disclosureRules?: string[];
}

export interface RawHistoryTrigger {
  id: string;
  category: string;
  triggerConcepts: string[];
  response: string;
  importance: "critical" | "core" | "bonus";
  points: number;
  hiddenUntilAsked: boolean;
}

export interface RawExamMapping {
  id: string;
  finding: string;
  revealedBy: string[];
  importance: "critical" | "core" | "bonus";
  points: number;
  normalIfNotPresent?: string;
}

export interface RawOverallScoring {
  history: number;
  physicalExam: number;
  differential: number;
  workup: number;
  imageInterpretation: number;
  management: number;
}

export interface RawCommunicationScoring {
  maxPoints: number;
  items: RawScoringItem[];
}

export interface RawCaseSummary {
  finalDiagnosis?: string;
  diagnosticFramework?: string;
  reasoningPathway?: string;
  keyHistoryClues?: string[];
  keyPhysicalExamFindings?: string[];
  keyDiagnosticFindings?: string[];
  keyImageInterpretationFindings?: string[];
  criticalHistoryItems?: string[];
  criticalExamItems?: string[];
  criticalWorkupItems?: string[];
  criticalInterpretationItems?: string[];
  criticalImageInterpretationFindings?: string[];
  criticalManagementItems?: string[];
  commonPitfalls?: string[];
  managementPearls?: string[];
  imageInterpretationPearls?: string[];
}

export interface RawCase {
  id: string;
  category: string;
  difficulty: string;
  title: string;
  diagnosis: string;
  chart: RawChart;
  opening: string;
  patientFile: string;
  dx: { labs?: Record<string, string> } & Record<string, unknown>;
  revealKeys?: string[];
  essential?: string[];
  steps: RawStep[];
  images?: Record<string, RawImage>;
  // upgraded (2.1) — optional
  standardizedPatient?: RawStandardizedPatient;
  historyTriggers?: RawHistoryTrigger[];
  physicalExamMappings?: RawExamMapping[];
  overallScoring?: RawOverallScoring;
  caseSummary?: RawCaseSummary;
  communicationScoring?: RawCommunicationScoring;
  libraryUpgrade?: Record<string, unknown>;
}

export interface ScoreBand {
  min: number;
  label: string;
}

export interface ManifestCaseEntry {
  id: string;
  file: string;
  category: string;
  difficulty: string;
  title: string;
  diagnosis: string;
  cantMiss: boolean;
}

export interface Manifest {
  schemaVersion: string;
  defaults: {
    chartTimerSeconds: number;
    totalPoints: number;
    scoreBands: ScoreBand[];
    patientSystemWrapper: string;
    examinerSystemWrapper: string;
  };
  cases: ManifestCaseEntry[];
}

// ---------------------------------------------------------------------------
// Normalized internal model
// ---------------------------------------------------------------------------

export type Importance = "critical" | "core" | "bonus";

export interface HistoryTriggerModel {
  id: string;
  category: string;
  concepts: string[];
  /** Authored response when real; null when the JSON carried a placeholder. */
  authoredResponse: string | null;
  /** Verbatim patientFile segments this trigger reveals (placeholder case). */
  fileSegments: string[];
  importance: Importance;
  points: number;
  sensitive: boolean;
}

export interface ExamMappingModel {
  id: string;
  finding: string;
  revealedBy: string[];
  importance: Importance;
  points: number;
  normalIfNotPresent: string | null;
}

export interface StepModel {
  id: string;
  label: string;
  max: number;
  prompt: string;
  rubric: string | null;
  idealAnswer: string | null;
  scoring: SectionScoring | null;
  type: "free" | "read";
  imageKey: string | null;
  keyFindings: string[];
  criticalFindings: string[];
  commonMistakes: string[];
  requiredTests: string[];
  optionalTests: string[];
  contraindicatedTests: string[];
  orderSensitiveActions: string[];
  revealsDiagnostics: boolean;
  mustNotMiss: string[];
  acceptableAlternatives: string[];
  requiredActions: string[];
  optionalActions: string[];
  unsafeActions: string[];
  consults: string[];
  disposition: string | null;
  mghReference: MghReference | null;
}

export type DomainKey =
  | "history"
  | "physicalExam"
  | "differential"
  | "workup"
  | "imageInterpretation"
  | "management";

export const DOMAIN_KEYS: DomainKey[] = [
  "history",
  "physicalExam",
  "differential",
  "workup",
  "imageInterpretation",
  "management",
];

export const DOMAIN_LABELS: Record<DomainKey | "communication", string> = {
  history: "History",
  physicalExam: "Physical Exam",
  differential: "Clinical Reasoning",
  workup: "Diagnostic Workup",
  imageInterpretation: "Data Interpretation",
  management: "Management",
  communication: "Communication",
};

/** One verbatim patientFile history fact (line / sub-line segment). */
export interface FileSegment {
  text: string;
  section: string;
  /** Sensitive facts are revealed only via their own trigger, never via
   *  generic question matching. */
  sensitive: boolean;
  /** Claimed by at least one history trigger — generic question matching
   *  must not reveal it (only its trigger may). */
  claimed: boolean;
}

/** One verbatim patientFile PHYSICAL EXAM line. */
export interface ExamLine {
  header: string;
  text: string;
  segments: string[];
}

export interface SpProfile {
  demeanor: string;
  emotionalState: string;
  healthLiteracy: string;
  verbosity: string;
  cooperativeness: string;
  communicationStyle: string;
  affect: string;
  sensitiveTopics: string[];
  disclosureRules: string[];
  derived: boolean;
}

export interface CaseModel {
  id: string;
  category: string;
  difficulty: string;
  title: string;
  diagnosis: string;
  chart: RawChart;
  opening: string;
  /** Engine-internal. Never shown to the student. */
  patientFile: string;
  /** History-section segments of patientFile (excludes exam + hidden rules). */
  historySegments: FileSegment[];
  /** Exam-section lines of patientFile (fallback when no mappings). */
  examLines: ExamLine[];
  labs: Record<string, string>;
  revealKeys: string[];
  essential: string[];
  steps: StepModel[];
  images: Record<string, RawImage>;
  sp: SpProfile;
  historyTriggers: HistoryTriggerModel[];
  examMappings: ExamMappingModel[];
  /** Always present; inferred from steps[].max when absent in JSON. */
  domainWeights: Record<DomainKey, number>;
  communication: RawCommunicationScoring | null;
  caseSummary: RawCaseSummary;
  flags: {
    hasHistoryTriggers: boolean;
    hasExamMappings: boolean;
    hasOverallScoring: boolean;
    hasStandardizedPatient: boolean;
    hasCommunicationScoring: boolean;
    schemaVersion: string | null;
  };
}

// ---------------------------------------------------------------------------
// Engine state (per brief §3) + supporting event types
// ---------------------------------------------------------------------------

export type Phase =
  | "CHART_REVIEW"
  | "PATIENT_ENCOUNTER"
  | "POST_ENCOUNTER"
  | "FEEDBACK";

export type Mode = "STRICT_OSCE" | "PRACTICE";

export interface ConversationTurn {
  role: "student" | "patient";
  text: string;
  /** Exam findings are tagged so the UI can render them distinctly. */
  kind: "speech" | "exam";
}

export interface EngineState {
  caseId: string;
  currentState: Phase;
  mode: Mode;
  /** Epoch-ms deadline for the current phase; null = untimed (practice). */
  phaseDeadline: number | null;
  chartReviewTimeRemaining: number;
  encounterTimeRemaining: number;
  postEncounterTimeRemaining: number;
  questionsAsked: { raw: string; matchedTriggerIds: string[] }[];
  conversation: ConversationTurn[];
  historyTriggersUnlocked: string[];
  /** Verbatim history content revealed so far (for post-encounter recap). */
  historyRevealed: string[];
  examManeuversPerformed: string[];
  examFindingsUnlocked: string[];
  examFindingTexts: string[];
  diagnosticsViewed: string[];
  scratchpad: string;
  postEncounterAnswers: Record<string, string>;
  /** True once the workup step answer is committed (unlocks dx.labs). */
  labsRevealed: boolean;
  /** Irreversible once POST_ENCOUNTER is entered. */
  patientLocked: boolean;
  sectionScores: Record<string, number>;
  domainScores: Record<string, number>;
  overallScore: number | null;
  submitted: boolean;
  result: ScoreReport | null;
}

// ---------------------------------------------------------------------------
// Scoring output
// ---------------------------------------------------------------------------

export interface CreditedItem {
  item: string;
  points: number;
  kind: "critical" | "core" | "bonus" | "penalty";
  /** Why the engine credited it (matching transparency, brief §7). */
  evidence: string;
}

export interface SectionResult {
  sectionId: string;
  label: string;
  studentAnswer: string;
  idealAnswer: string | null;
  maxPoints: number;
  earned: number;
  credited: CreditedItem[];
  missed: CreditedItem[];
  penaltiesApplied: CreditedItem[];
  /** Clinical-reference citation for the section (management steps). */
  mghReference?: MghReference | null;
}

export interface ScoreReport {
  overall: number;
  band: string;
  domainScores: Record<string, number>;
  domainMax: Record<string, number>;
  sections: SectionResult[];
  communication: SectionResult | null;
  missedHistory: { id: string; concepts: string[]; importance: Importance }[];
  missedManeuvers: { maneuverId: string; importance: Importance; finding: string }[];
  unnecessaryManeuvers: string[];
  missedDifferentials: string[];
  missedWorkup: string[];
  missedInterpretation: string[];
  missedManagement: string[];
  criticalMisses: string[];
  unsafeActions: string[];
  pearls: string[];
  pitfalls: string[];
}
