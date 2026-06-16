export const meta = {
  name: 'fix-integrated-read-images',
  description: 'Re-pin or written-stand-in the integrated EKG/CXR image so it matches the case-authored model answer',
  phases: [
    { title: 'Reconcile', detail: 'one agent per case: pick the bank image that matches the answer (or stand-in)' },
  ],
}

// All 73 cases whose integrated read shows a pinned LITFL image that may not
// match the case-authored model answer. One agent per case file — no conflicts.
const CASES = ["abdo-02","abdo-03","abdo-04","abdo-05","abdo-06","abdo-07","abdo-08","abdo-09","abdo-10","ams-01","ams-02","ams-03","ams-04","ams-05","ams-06","ams-07","ams-08","ams-09","ams-10","anemia-01","anemia-02","anemia-03","anemia-04","anemia-05","anemia-07","anemia-08","chestpain-01","chestpain-03","chestpain-04","chestpain-05","chestpain-06","chestpain-07","chestpain-10","diarrhea-01","diarrhea-02","diarrhea-03","diarrhea-04","diarrhea-05","diarrhea-06","diarrhea-07","diarrhea-08","diarrhea-09","dyspnea-01","dyspnea-03","dyspnea-04","dyspnea-05","dyspnea-06","dyspnea-07","dyspnea-09","dyspnea-10","fever-01","fever-02","fever-04","fever-05","fever-06","fever-07","fever-08","fever-09","liver-01","liver-02","liver-03","liver-04","liver-05","liver-06","liver-08","liver-09","syncope-01","syncope-02","syncope-03","syncope-05","syncope-06","syncope-07","syncope-10"]

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'decision', 'reason'],
  properties: {
    id: { type: 'string' },
    decision: { type: 'string', enum: ['keep', 'repin', 'standin'] },
    oldN: { type: ['number', 'null'] },
    newN: { type: ['number', 'null'] },
    validated: { type: 'boolean' },
    reason: { type: 'string' },
  },
}

const GUIDE = `
You are fixing ONE OSCE case so the displayed EKG/CXR image MATCHES the case's
already-correct model answer. The model answer is clinically correct for the
patient — DO NOT change it. Only the IMAGE (a pinned LITFL study) may be wrong.

The displayed image is whatever study is named by images.<key>.litflStudyN
(key = "ekg" or "cxr"). Its actual content is in the bank catalogs:
  /tmp/ecg_catalog.txt   (50 ECG studies: "#n | diagnosis | what the IMAGE shows")
  /tmp/cxr_catalog.txt   (50 CXR studies)
READ the relevant catalog file first.

PROCEDURE
1. Read src/data/cases/<ID>.json. Find the read step (id "ekg_read" or "cxr_read")
   whose images[step.image].integrated === true AND has a numeric litflStudyN.
2. From that step's idealAnswer + criticalFindings + keyFindings, extract the
   patient's EXPECTED tracing: RHYTHM, RATE (brady / normal / tachy), and the KEY
   diagnostic FEATURE(S) (e.g. "long QT", "peaked T waves", "AF narrow complex",
   "anterior ST elevation", "S1Q3T3", "complete heart block", "digoxin effect").
3. Find the bank study whose ACTUAL IMAGE (per catalog) matches those — same
   rhythm + same key feature + compatible rate direction. Then decide:
   - KEEP: the current litflStudyN already matches → change nothing.
   - REPIN: a different bank study matches better → set litflStudyN to that n.
   - STANDIN: NO bank image matches the answer's specific pattern → DELETE the
     litflStudyN line entirely (keep "integrated": true) so it falls back to the
     written stand-in, AND make sure images.<key>.imageDescription is a concise,
     accurate one-sentence description of the answer's expected tracing.
4. When unsure whether an image truly matches, PREFER STANDIN over a wrong image.
   A wrong photo is the bug we are fixing; an accurate written description is fine.
5. NEVER edit idealAnswer, criticalFindings, keyFindings, rubric, scoring, prompt,
   or anything outside images.<key>.litflStudyN (+ imageDescription for stand-in).
6. Validate: run  node scripts/validate_case.mjs src/data/cases/<ID>.json
   Confirm it prints valid / 0 ERRORs.

ECG MATCHING MAP (n → what its IMAGE shows; use the catalog for detail):
- Long QT + SINUS TACHYCARDIA → #22 (quetiapine).  Long QT + SINUS BRADYCARDIA → #23 (sotalol, 42 bpm).
  Long QT + normal rate / torsades substrate with U waves → #31 (hypokalemia+TdP) or keep #22/#23 as representative.
  Hypothermia (brady, Osborn J waves, long QT) → #10.  SAH cerebral giant TWI + long QT → #12.
- Hypokalemia (U waves, flat T, long QU) → #6.
- Hyperkalemia: bank has ONLY SEVERE images — #3 (brady 36, WIDE QRS, atypical LBBB), #27/#50 (sine wave).
  If the answer describes EARLY/peaked-T hyperK with NARROW QRS / sinus rhythm → NO MATCH → STANDIN.
- Atrial fibrillation: #2 is PRE-EXCITED / WPW AF (broad-complex, irregular, up to 300 bpm). Use #2 ONLY when the
  answer describes pre-excited/WPW/broad-complex very-fast AF. For ordinary NARROW-complex AF at any controlled or
  moderate rate → NO MATCH → STANDIN.  AF combined with another feature (low voltage, S1Q3T3, lateral ischemia,
  digoxin effect, old infarct Q waves) that no single image shows → STANDIN.
- SVT/AVNRT (narrow ~150) → #16/#17.  Atrial flutter 2:1 sawtooth → #42.  MAT (irregular narrow, ≥3 P morphologies) → #33.
- Anterior ischemia: Wellens / evolving anterolateral (STE V2-5, deep anterior T changes) → #5; hyperacute anterolateral → #9;
  anterolateral STEMI tombstones → #26; anteroseptal STEMI+RBBB → #34; high-lateral STEMI (I/aVL) → #36; De Winter → #19;
  left-main/triple-vessel diffuse STD + aVR STE → #8.
- Inferior STEMI (STE II/III/aVF ± RV) → #1; inferolateral+posterior → #14; infero-postero-lateral tombstones → #39.
- Pericarditis (diffuse concave STE + PR depression) → #32.  Pericardial effusion/tamponade (sinus tach, LOW voltage,
  electrical alternans) → #11.
- Digoxin effect/toxicity (atrial tachy with AV block, scooped/sagging ST) → #30.  TCA toxicity (broad tachy, terminal R in aVR) → #4.
- RV strain / cor pulmonale / PE (sinus tach, anterior TWI V1-3/4, S1Q3T3) → #7 (NO AF).  COPD (P pulmonale, RAD) → #21.  LVH/DCM → #41.
- Heart block: Mobitz I Wenckebach → #29; 2nd-degree → #43; complete (AV dissociation, escape ~36) → #44; sick sinus tachy-brady → #20.
- WPW resting (short PR, delta wave, sinus) → #37.  Brugada (coved STE V1-2) → #28.  VT → #13/#46/#47/#48.  Paced → #45/#49.

CXR MATCHING (use /tmp/cxr_catalog.txt): cavitary TB RIGHT upper lobe (+effusion) → #38; LEFT upper cavity TB → #40;
miliary TB → #46; apical TB fibrosis/calcification → #43/#47/#49; lung abscess cavity → #5/#35/#37; lobar pneumonia
whiteout → #7/#8; RUL pneumonia → #4; PJP → #12; PE (atelectasis/CTPA) → #24; hilar adenopathy → #19/#29; effusion → #22/#41.

Return JSON: {id, decision: keep|repin|standin, oldN, newN (or null), validated, reason (<=160 chars)}.
`

phase('Reconcile')
const results = await parallel(
  CASES.map((id) => () =>
    agent(GUIDE.replace(/<ID>/g, id) + `\n\nFIX THIS CASE: ${id}`, {
      label: `fix:${id}`,
      phase: 'Reconcile',
      schema: SCHEMA,
    }),
  ),
)

const ok = results.filter(Boolean)
const byDecision = { keep: [], repin: [], standin: [] }
for (const r of ok) (byDecision[r.decision] ??= []).push(r)
const unvalidated = ok.filter((r) => r.validated === false).map((r) => r.id)
const missing = CASES.filter((id) => !ok.some((r) => r.id === id))

log(`done: ${ok.length}/${CASES.length} — keep ${byDecision.keep.length}, repin ${byDecision.repin.length}, standin ${byDecision.standin.length}`)
if (unvalidated.length) log(`UNVALIDATED: ${unvalidated.join(', ')}`)
if (missing.length) log(`MISSING (agent died): ${missing.join(', ')}`)

return {
  total: CASES.length,
  processed: ok.length,
  keep: byDecision.keep.length,
  repin: byDecision.repin.map((r) => `${r.id}:${r.oldN}->${r.newN}`),
  standin: byDecision.standin.map((r) => `${r.id}:${r.oldN}`),
  unvalidated,
  missing,
  details: ok.map((r) => `${r.id} [${r.decision}] ${r.reason}`),
}
