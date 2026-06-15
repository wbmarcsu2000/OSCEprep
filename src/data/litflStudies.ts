/**
 * LITFL Top 100 study bank — the first 50 ECG and first 50 CXR cases, used as
 * standalone "read this study" tasks on the post-encounter read steps. Each
 * entry carries the real LITFL case URL (litfl.com/ecg-case-NNN/ /
 * cxr-case-NNN/), the primary diagnosis, and the hallmark findings a student
 * should name. The diagnosis/findings are the gradeable answer; the URL opens
 * the real (CC BY-NC-SA, © LITFL) study.
 *
 * Diagnoses are taken from the LITFL Top 100 case titles; the listed findings
 * are the standard textbook features of each named diagnosis (teaching content,
 * not a transcription of any single tracing).
 */

export interface LitflStudy {
  /** LITFL case number. */
  n: number;
  /** Primary diagnosis / answer. */
  diagnosis: string;
  /** Hallmark findings the student should describe. */
  findings: string[];
}

function ecgUrl(n: number): string {
  return `https://litfl.com/ecg-case-${String(n).padStart(3, "0")}/`;
}
function cxrUrl(n: number): string {
  return `https://litfl.com/cxr-case-${String(n).padStart(3, "0")}/`;
}

export const LITFL_ECG_STUDIES: LitflStudy[] = [
  { n: 1, diagnosis: "Inferior STEMI with right ventricular infarction (RCA)", findings: ["ST elevation in II, III, aVF", "ST elevation in V4R", "reciprocal ST depression in aVL"] },
  { n: 2, diagnosis: "Atrial fibrillation", findings: ["irregularly irregular rhythm", "absent P waves", "variable R-R intervals"] },
  { n: 3, diagnosis: "Hyperkalemia", findings: ["peaked T waves", "bradycardia", "QRS widening"] },
  { n: 4, diagnosis: "Tricyclic antidepressant toxicity", findings: ["broad QRS", "terminal R wave in aVR (camel hump)", "sinus tachycardia, right-axis deviation"] },
  { n: 5, diagnosis: "Wellens syndrome / hyperacute T waves (critical LAD)", findings: ["biphasic / deep T-wave changes in V2–V3", "preserved R waves", "minimal ST elevation"] },
  { n: 6, diagnosis: "Hypokalemia", findings: ["U waves", "flattened T waves", "long QU interval"] },
  { n: 7, diagnosis: "Right heart strain / RVH", findings: ["dominant R wave in V1", "right-axis deviation", "T-wave inversion V1–V3 with RBBB"] },
  { n: 8, diagnosis: "Left main / triple-vessel ischemia", findings: ["widespread ST depression", "ST elevation in aVR", "tachycardia"] },
  { n: 9, diagnosis: "Hyperacute anterolateral STEMI", findings: ["hyperacute T waves", "ST elevation anterolaterally", "ventricular ectopics"] },
  { n: 10, diagnosis: "Hypothermia", findings: ["Osborn (J) waves", "sinus bradycardia", "baseline artifact / shivering"] },
  { n: 11, diagnosis: "Large pericardial effusion", findings: ["low QRS voltage", "electrical alternans", "sinus tachycardia"] },
  { n: 12, diagnosis: "Subarachnoid hemorrhage (cerebral T waves)", findings: ["deep widespread T-wave inversion", "QT prolongation", "bradycardia"] },
  { n: 13, diagnosis: "Ventricular tachycardia", findings: ["broad-complex tachycardia", "northwest (extreme) axis", "AV dissociation"] },
  { n: 14, diagnosis: "Posterior STEMI", findings: ["ST depression V1–V3", "dominant R wave in V2", "upright T waves"] },
  { n: 15, diagnosis: "Posterior STEMI (posterior leads)", findings: ["ST elevation in V7–V9", "ST depression in anterior leads"] },
  { n: 16, diagnosis: "Supraventricular tachycardia (AVNRT)", findings: ["regular narrow-complex tachycardia", "pseudo R′ in V1", "no visible P waves"] },
  { n: 17, diagnosis: "Supraventricular tachycardia (AVNRT)", findings: ["regular narrow-complex tachycardia", "pseudo R′ waves", "rate ~150–180"] },
  { n: 18, diagnosis: "Atrial flutter with 2:1 block", findings: ["sawtooth flutter waves", "regular ventricular rate ~150", "revealed by vagal/adenosine"] },
  { n: 19, diagnosis: "De Winter T waves (LAD occlusion equivalent)", findings: ["upsloping ST depression at the J point V1–V6", "tall symmetric T waves", "no ST elevation"] },
  { n: 20, diagnosis: "Sick sinus syndrome (tachy-brady)", findings: ["alternating bradycardia and tachycardia", "sinus pauses"] },
  { n: 21, diagnosis: "COPD pattern", findings: ["low QRS voltage", "vertical/rightward axis", "P pulmonale"] },
  { n: 22, diagnosis: "Long QT (anticholinergic)", findings: ["prolonged QTc", "sinus tachycardia", "risk of torsades"] },
  { n: 23, diagnosis: "Long QT (drug-induced, e.g. sotalol)", findings: ["prolonged QTc", "T-wave abnormalities"] },
  { n: 24, diagnosis: "Limb-lead reversal / dextrocardia", findings: ["right-axis deviation", "dominant S waves", "reverse R-wave progression"] },
  { n: 25, diagnosis: "Dextrocardia", findings: ["negative complexes in lead I", "reverse R-wave progression", "right-axis deviation"] },
  { n: 26, diagnosis: "Anterolateral STEMI (tombstones)", findings: ["tombstone ST elevation anterolaterally", "reciprocal inferior ST depression"] },
  { n: 27, diagnosis: "Severe hyperkalemia (sine wave)", findings: ["sine-wave QRS", "peaked T waves", "marked QRS prolongation"] },
  { n: 28, diagnosis: "Brugada syndrome", findings: ["coved ST elevation V1–V2", "terminal T-wave inversion", "RSR′ pattern"] },
  { n: 29, diagnosis: "Mobitz I (Wenckebach) second-degree AV block", findings: ["progressive PR prolongation", "dropped QRS", "grouped beating"] },
  { n: 30, diagnosis: "Digoxin toxicity", findings: ["regularized AF / atrial tachycardia with block", "ventricular bigeminy", "scooped ST segments"] },
  { n: 31, diagnosis: "Hypokalemia with torsades risk", findings: ["U waves", "long QU interval", "polymorphic VT (torsades)"] },
  { n: 32, diagnosis: "Acute pericarditis", findings: ["diffuse concave ST elevation", "PR depression", "Spodick's sign (down-sloping TP)"] },
  { n: 33, diagnosis: "Multifocal atrial tachycardia", findings: ["≥3 distinct P-wave morphologies", "irregular rhythm", "rate >100"] },
  { n: 34, diagnosis: "Anteroseptal STEMI with RBBB (LAD)", findings: ["ST elevation anteroseptally", "RBBB", "reciprocal ST depression"] },
  { n: 35, diagnosis: "Pacemaker malfunction (failure to capture)", findings: ["pacing spikes not followed by capture", "bradycardia"] },
  { n: 36, diagnosis: "High lateral STEMI", findings: ["ST elevation in I and aVL", "reciprocal ST depression in II, III, aVF"] },
  { n: 37, diagnosis: "Wolff-Parkinson-White (type B)", findings: ["short PR interval", "delta waves", "broad QRS"] },
  { n: 38, diagnosis: "Antidromic AV reentrant tachycardia (WPW)", findings: ["broad-complex tachycardia", "pre-excitation", "regular rhythm"] },
  { n: 39, diagnosis: "Infero-postero-lateral STEMI", findings: ["ST elevation inferior + lateral", "posterior involvement", "reciprocal change"] },
  { n: 40, diagnosis: "Accelerated idioventricular rhythm", findings: ["regular wide-complex rhythm 50–110", "AV dissociation", "often a reperfusion rhythm"] },
  { n: 41, diagnosis: "Left ventricular hypertrophy / dilated cardiomyopathy", findings: ["high QRS voltages (LVH criteria)", "left atrial enlargement", "strain pattern"] },
  { n: 42, diagnosis: "Atrial flutter with AV block", findings: ["sawtooth flutter waves", "fixed/variable conduction"] },
  { n: 43, diagnosis: "Second-degree AV block (Mobitz I / II)", findings: ["dropped QRS complexes", "fixed-ratio conduction (e.g. 2:1)"] },
  { n: 44, diagnosis: "Complete (third-degree) heart block", findings: ["AV dissociation", "ventricular escape rhythm", "regular slow ventricular rate"] },
  { n: 45, diagnosis: "Ventricular paced rhythm", findings: ["pacing spikes before each QRS", "LBBB-like morphology", "apply Sgarbossa for ischemia"] },
  { n: 46, diagnosis: "Ventricular tachycardia (RBBB morphology)", findings: ["broad-complex tachycardia", "dominant R wave in V1", "AV dissociation"] },
  { n: 47, diagnosis: "Ventricular tachycardia (LBBB morphology)", findings: ["broad-complex tachycardia", "dominant S wave in V1", "Josephson's sign"] },
  { n: 48, diagnosis: "RVOT ventricular tachycardia", findings: ["LBBB morphology", "inferior axis", "broad-complex tachycardia"] },
  { n: 49, diagnosis: "Pacemaker-mediated tachycardia", findings: ["paced tachycardia at the upper rate limit", "terminates with magnet"] },
  { n: 50, diagnosis: "Severe hyperkalemia (sine wave)", findings: ["sine-wave appearance", "bradycardia", "bizarre wide QRS, peaked T"] },
];

export const LITFL_CXR_STUDIES: LitflStudy[] = [
  { n: 1, diagnosis: "Bronchiectasis (cystic fibrosis)", findings: ["tram-track and ring shadows", "hyperinflation", "upper-zone predominance"] },
  { n: 2, diagnosis: "Kartagener syndrome (situs inversus + bronchiectasis)", findings: ["dextrocardia", "right-sided aortic knuckle / gastric bubble on the right", "bronchiectasis"] },
  { n: 3, diagnosis: "Cystic bronchiectasis", findings: ["cystic ring shadows", "crowded markings", "volume loss"] },
  { n: 4, diagnosis: "Atypical pneumonia", findings: ["patchy consolidation", "air bronchograms"] },
  { n: 5, diagnosis: "Cavitating pneumonia / lung abscess", findings: ["cavitation with air-fluid level", "surrounding consolidation"] },
  { n: 6, diagnosis: "Giant bullae (COPD)", findings: ["large avascular lucent areas", "hyperinflation", "flattened diaphragms"] },
  { n: 7, diagnosis: "Lobar pneumonia (white-out)", findings: ["dense lobar consolidation", "air bronchograms", "silhouette sign"] },
  { n: 8, diagnosis: "Pneumonia with secondary pneumothorax", findings: ["consolidation", "visceral pleural line / absent peripheral markings"] },
  { n: 9, diagnosis: "COPD / emphysema", findings: ["hyperinflation (≥10 posterior ribs)", "flattened diaphragms", "increased retrosternal air"] },
  { n: 10, diagnosis: "COPD / emphysema", findings: ["hyperinflation", "flattened hemidiaphragms", "narrow cardiac silhouette"] },
  { n: 11, diagnosis: "ARDS (near-drowning)", findings: ["diffuse bilateral alveolar opacities", "normal heart size"] },
  { n: 12, diagnosis: "Pneumocystis (PJP) pneumonia", findings: ["bilateral perihilar interstitial infiltrates", "sparing of apices/bases early"] },
  { n: 13, diagnosis: "Right upper lobe collapse / severe pneumonia", findings: ["raised horizontal fissure", "RUL opacification", "tracheal deviation"] },
  { n: 14, diagnosis: "Lobar collapse with mediastinal shift", findings: ["white-out of a hemithorax", "trachea/mediastinum shifted toward the opacity"] },
  { n: 15, diagnosis: "Foreign body (bullet) with femoral fracture", findings: ["radiopaque foreign body", "bony fracture/fragmentation"] },
  { n: 16, diagnosis: "Left lower lobe collapse (sail sign)", findings: ["retrocardiac triangular opacity (sail sign)", "loss of medial diaphragm", "double cardiac contour"] },
  { n: 17, diagnosis: "Collapse from endobronchial obstruction", findings: ["lobar collapse", "volume loss", "mediastinal shift toward the collapse"] },
  { n: 18, diagnosis: "Lobar collapse with mediastinal shift", findings: ["opacified lobe", "ipsilateral mediastinal shift", "raised hemidiaphragm"] },
  { n: 19, diagnosis: "Bilateral hilar lymphadenopathy (lymphoma)", findings: ["bilateral lobulated hilar enlargement", "mediastinal widening"] },
  { n: 20, diagnosis: "ARDS (burns / inhalation)", findings: ["diffuse bilateral opacification", "multifocal infiltrates"] },
  { n: 21, diagnosis: "Cavitating lung metastases / GPA", findings: ["multiple cavitating nodules", "variable sizes"] },
  { n: 22, diagnosis: "Pericardial effusion", findings: ["enlarged globular ('water-bottle') cardiac silhouette", "clear lung fields"] },
  { n: 23, diagnosis: "Mediastinal mass (lymphoma)", findings: ["widened mediastinum", "lobulated contour"] },
  { n: 24, diagnosis: "Atelectasis with pulmonary embolism", findings: ["linear atelectasis / volume loss", "often near-normal film", "± small effusion"] },
  { n: 25, diagnosis: "Radiation pneumonitis", findings: ["opacity conforming to the radiation port (straight margins)", "volume loss"] },
  { n: 26, diagnosis: "Pulmonary fibrosis with hiatus hernia", findings: ["basal reticular-nodular shadowing", "retrocardiac air-fluid level (hernia)"] },
  { n: 27, diagnosis: "Hypersensitivity pneumonitis / IPF", findings: ["reticulonodular interstitial pattern", "reduced lung volumes"] },
  { n: 28, diagnosis: "Diffuse pulmonary fibrosis", findings: ["bilateral reticulonodular shadowing", "low lung volumes", "honeycombing"] },
  { n: 29, diagnosis: "Sarcoidosis (bilateral hilar adenopathy)", findings: ["symmetric bilateral hilar lymphadenopathy", "± right paratracheal node"] },
  { n: 30, diagnosis: "Sarcoidosis (Löfgren syndrome)", findings: ["bilateral hilar lymphadenopathy", "clear lungs"] },
  { n: 31, diagnosis: "Sarcoidosis stage II", findings: ["bilateral hilar adenopathy", "reticulonodular parenchymal infiltrates"] },
  { n: 32, diagnosis: "Sarcoidosis stage IV (fibrosis)", findings: ["upper-zone fibrosis", "hilar retraction", "volume loss"] },
  { n: 33, diagnosis: "Advanced sarcoidosis with fibrosis", findings: ["coarse fibrosis", "architectural distortion"] },
  { n: 34, diagnosis: "Cavitating lung lesion", findings: ["thick-walled cavity", "surrounding changes"] },
  { n: 35, diagnosis: "Lung abscess (IV drug use)", findings: ["cavity with air-fluid level", "consolidation"] },
  { n: 36, diagnosis: "Cavitating lung lesion", findings: ["cavity", "wall irregularity", "CT correlation"] },
  { n: 37, diagnosis: "Aspiration lung abscess (RLL)", findings: ["right-lower-lobe cavity with air-fluid level", "dependent distribution"] },
  { n: 38, diagnosis: "Tuberculosis with cavity and effusion", findings: ["upper-lobe cavity", "consolidation", "pleural effusion"] },
  { n: 39, diagnosis: "Septic pulmonary emboli", findings: ["multiple peripheral nodules/cavities", "loculated changes"] },
  { n: 40, diagnosis: "Cavitary tuberculosis", findings: ["upper-lobe cavitation", "fibronodular change"] },
  { n: 41, diagnosis: "Bilateral pneumonia with pleural effusion", findings: ["bilateral consolidation", "blunted costophrenic angle"] },
  { n: 42, diagnosis: "Cavitary TB (treated, plombage)", findings: ["apical cavitation", "plombage material", "iatrogenic changes"] },
  { n: 43, diagnosis: "Apical TB with calcification", findings: ["apical fibrocalcific change", "volume loss"] },
  { n: 44, diagnosis: "Calcified mediastinal node (prior TB)", findings: ["calcified hilar/mediastinal node", "fibrotic change"] },
  { n: 45, diagnosis: "Bilateral TB (plombage)", findings: ["bilateral apical disease", "surgical plombage"] },
  { n: 46, diagnosis: "Miliary tuberculosis", findings: ["innumerable 1–3 mm nodules", "uniform distribution"] },
  { n: 47, diagnosis: "Primary TB (Ghon focus)", findings: ["peripheral focus + hilar node (Ghon/Ranke complex)"] },
  { n: 48, diagnosis: "Left upper lobe pneumonia (HIV/TB)", findings: ["LUL opacity", "loss of the left heart border", "air bronchograms"] },
  { n: 49, diagnosis: "Apical TB with phrenic crush", findings: ["apical calcification", "raised hemidiaphragm (phrenic crush)"] },
  { n: 50, diagnosis: "TB (thoracoplasty / kyphoscoliosis)", findings: ["chest-wall deformity from thoracoplasty", "kyphoscoliosis", "volume loss"] },
];

export function litflStudyUrl(kind: "ecg" | "cxr", n: number): string {
  return kind === "ecg" ? ecgUrl(n) : cxrUrl(n);
}

// ---------------------------------------------------------------------------
// Assigning studies to a case's read steps
// ---------------------------------------------------------------------------

import type { CaseModel, SectionScoring, StepModel } from "../engine/types";
import { LITFL_MEDIA } from "./litflMedia";

/** Build a read-step rubric: recognize the diagnosis (critical) + name the
 *  hallmark findings and read systematically (core) + a normal-call penalty. */
function buildReadScoring(study: LitflStudy, max: number): SectionScoring {
  const critPts = Math.max(4, Math.round(max * 0.4));
  const coreItems = [...study.findings, "systematic read (rate/rhythm/intervals or RIP-ABCDE)"];
  const coreBudget = Math.max(coreItems.length, max - critPts);
  const per = Math.max(1, Math.floor(coreBudget / coreItems.length));
  return {
    maxPoints: max,
    criticalActions: [{ item: `Recognizes ${study.diagnosis}`, points: critPts }],
    coreActions: coreItems.map((item) => ({ item, points: per })),
    bonusActions: [],
    penalties: [{ item: "calls the study normal / misses the abnormality", points: -3 }],
  };
}

function applyStudyToStep(
  step: StepModel,
  study: LitflStudy,
  kind: "ecg" | "cxr",
  integrated = false,
): StepModel {
  const modality = kind === "ecg" ? "12-lead ECG" : "chest X-ray";
  return {
    ...step,
    prompt: integrated
      ? `Here is the patient's ${modality}. Interpret it systematically, then state how it fits the clinical picture.`
      : `Reading practice — interpret the ${modality} shown below. Read it systematically, then commit to a diagnosis (the underlying pathology, not just the pattern).`,
    criticalFindings: [study.diagnosis],
    keyFindings: study.findings,
    // Lead with the pathology (diagnosis), then the supporting features.
    idealAnswer: `Diagnosis: ${study.diagnosis}. Supporting features: ${study.findings.join("; ")}.`,
    commonMistakes: ["calling the study normal / missing the abnormality"],
    scoring: buildReadScoring(study, step.max),
  };
}

/**
 * Replace a case's read steps with assigned LITFL studies — a standalone
 * "read this study" task with a real linked image and a gradeable answer.
 * Deterministic by manifest index so each station gets a distinct study from
 * the first 50 of each collection.
 */
export function applyLitflStudies(model: CaseModel, index: number): CaseModel {
  const ecgN = (index % LITFL_ECG_STUDIES.length);
  const cxrN = (index % LITFL_CXR_STUDIES.length);
  const ecg = LITFL_ECG_STUDIES[ecgN];
  const cxr = LITFL_CXR_STUDIES[cxrN];
  const images = { ...model.images };
  const steps = model.steps.map((step) => {
    if (step.type !== "read" || !step.imageKey) return step;
    const isEcg = /ekg|ecg/i.test(step.imageKey);
    const kind: "ecg" | "cxr" = isEcg ? "ecg" : "cxr";
    const existing = images[step.imageKey] ?? ({} as typeof images[string]);
    const collection = isEcg ? LITFL_ECG_STUDIES : LITFL_CXR_STUDIES;
    const pinned =
      typeof existing.litflStudyN === "number"
        ? collection.find((s) => s.n === existing.litflStudyN)
        : undefined;
    // INTEGRATED read: the study is the patient's OWN. Keep the case-authored
    // read step (its prompt, findings, and scoring) verbatim — it encodes
    // case-specific grading a bare bank study can't capture (e.g. "AF WITH
    // lateral ischemia → NSTEMI"). A pinned study, if named, only supplies a
    // representative tracing/film to DISPLAY; grading stays on the authored
    // content (plus the standing "representative / different patient" notice).
    if (existing.integrated === true) {
      if (pinned) {
        const media = isEcg ? LITFL_MEDIA.ecg[pinned.n] : LITFL_MEDIA.cxr[pinned.n];
        images[step.imageKey] = {
          ...existing,
          asset: media?.img ?? existing.asset ?? null,
          asset2: media?.img2 ?? existing.asset2 ?? null,
          source: litflStudyUrl(kind, pinned.n),
          attribution: `LITFL ${kind === "ecg" ? "ECG" : "CXR"} Library (litfl.com) — © Life in the Fast Lane, CC BY-NC-SA 4.0`,
          recommendedSource: kind === "ecg" ? "LITFL Top 100 ECG" : "LITFL Top 100 CXR",
          assetNeeded: media?.img ? false : existing.assetNeeded ?? true,
        };
      }
      return step;
    }
    // NON-INTEGRATED: a standalone "reading practice" drill graded on a bank
    // study — the pinned study if named (relevant but still a drill), else the
    // deterministic index-assigned study.
    const study = pinned ?? (isEcg ? ecg : cxr);
    const media = isEcg ? LITFL_MEDIA.ecg[study.n] : LITFL_MEDIA.cxr[study.n];
    images[step.imageKey] = {
      ...existing,
      label: kind === "ecg" ? "12-lead EKG" : "Chest X-ray",
      // Embed the real tracing/film inline (hotlinked from LITFL); fall back to
      // the written description if it ever fails to load.
      asset: media?.img ?? null,
      asset2: media?.img2 ?? null,
      // Authoritative LITFL interpretation (pathology + systematic read).
      expertRead: media?.read || `${study.diagnosis}. ${study.findings.join("; ")}.`,
      source: litflStudyUrl(kind, study.n),
      attribution: `LITFL ${kind === "ecg" ? "ECG" : "CXR"} Library (litfl.com) — © Life in the Fast Lane, CC BY-NC-SA 4.0`,
      imageDescription: `${study.diagnosis}. ${study.findings.join("; ")}.`,
      recommendedSource: kind === "ecg" ? "LITFL Top 100 ECG" : "LITFL Top 100 CXR",
      searchTerms: [study.diagnosis],
      assetNeeded: false,
    };
    return applyStudyToStep(step, study, kind, pinned != null);
  });
  return { ...model, steps, images };
}
