/**
 * LITFL Top-100 study MEDIA, scraped from the public case pages
 * (litfl.com/ecg-case-NNN, /cxr-case-NNN) — © Life in the Fast Lane,
 * CC BY-NC-SA 4.0. For each case: the real tracing/film image URL(s) and the
 * page's own authoritative interpretation (the pathology + systematic read).
 * Used to embed the study inline and to reveal the correct answer in-app.
 *
 * Generated, do not hand-edit — re-run the scraper to refresh.
 */

export interface LitflMedia {
  /** Primary tracing/film image URL (hotlinked from litfl.com). */
  img: string | null;
  /** Secondary view (e.g. lateral CXR), if present. */
  img2: string | null;
  /** LITFL's own interpretation: the diagnosis/pathology + systematic findings. */
  read: string;
}

export const LITFL_MEDIA: { ecg: Record<number, LitflMedia>; cxr: Record<number, LitflMedia> } = {
  "ecg": {
    "1": {
      "img": "https://litfl.com/wp-content/uploads/2018/09/TOP-100-ECQ-QUIZ-LITFL-001.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/09/TOP-100-ECQ-QUIZ-LITFL-001b.jpg",
      "read": "General: • Sinus rhythm, rate 84bpm • Normal axis • 1st degree AV block (PR 220ms) Signs of inferior STEMI : • STE in inferior leads II, III, aVF • Reciprocal STD in lateral leads I, aVL, V6 Signs of associated right ventricular infarction : • STE in III > II • STE in V1-2 This patient also had STE in V4R, confirming the diagnosis of RV infarction:"
    },
    "2": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/WPW-ecg-004.jpeg",
      "img2": null,
      "read": "Main Abnormalities: • Irregularly irregular broad complex tachycardia • Extremely rapid ventricular rates — up to 300 bpm in places (RR intervals as short as 200ms or 1 large square) • Beat-to-beat variability in the QRS morphology, with subtle variation in QRS width Explanation of ECG Findings: • Irregularly irregular rhythm is consistent with atrial fibrillation • There is a left bundle branch block morphology to the QRS complexes • However, the ventricular rate is far too rapid for this to be simply AF with LBBB • The rates of 250-300 bpm and the variability in QRS complex morphology indicate the existence of an accessory pathway between the atria and ventricles Diagnosis: • These findings indicate atrial fibrillation in the context of Wolff-Parkinson-White syndrome Post reversion ECG"
    },
    "3": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECQ-QUIZ-LITFL-003.jpg",
      "img2": null,
      "read": "Main Abnormal Findings • Severe bradycardia of 36 bpm • Rhythm is difficult to ascertain — appears irregular (?slow AF) although there are some small-voltage P waves seen in V1-2 • Broad QRS complexes with an atypical LBBB morphology • Subtle symmetrical peaking (\"tenting\") of the T waves in V2-5 Diagnosis The combination of bradycardia, flattening and loss of P waves, QRS broadening and T wave abnormalities is highly suspicious for severe hyperkalaemia. This patient had a potassium of 8.0 in the context of anuric renal failure."
    },
    "4": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECQ-QUIZ-LITFL-004-2.jpg",
      "img2": null,
      "read": "Main Abnormalities • Broad complex tachycardia, rate ~ 130 bpm • The rhythm is likely sinus tachycardia with a 1st degree AV block — note the \"camel hump\" appearance to the T waves indicating a hidden P wave • Interventricular conduction delay (QRS duration > 100ms, not typical LBBB / RBBB morphology) • Right axis deviation • Secondary R' wave in aVR > 3 mm ? In the context of seizures and hypotension, the combination of… • QRS broadening > 100 ms • R' wave in aVR > 3 mm … is highly suggestive of poisoning with a sodium-channel blocking agent — e.g. tricyclic antidepressant. The sinus tachycardia may be due to the anticholinergic effects of the TCA."
    },
    "5": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-005-1.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-005-2b.jpg",
      "read": "This ECG demonstrates an evolving anterolateral STEMI : • ST elevation in V2-5 and aVL • Reciprocal ST depression in III and aVF • Pathological Q waves in V2-3 • Hyperacute T waves in V2-4 and I ECG 5b – Resolution of chest pain (t+20 mins) There is transient improvement in the ST changes, with development of biphasic T waves in V2-3. This pattern of T wave changes in V2-3 is known as Wellens syndrome and indicates reperfusion of a previously occluded LAD artery. The implication of this ECG pattern is that there is an underlying critical LAD stenosis that requires emergent reperfusion, ideally via percutaneous coronary intervention. ECG 5c – Recurrence of chest pain (t+25 mins) The previously biphasic T waves are now upright again — this phenomenon is referred to as pseudonormalisation and is a mark"
    },
    "6": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-006-2.jpg",
      "img2": null,
      "read": "Main Abnormalities • The ECG shows widespread ST segment abnormalities • There is a biphasic appearance to the ST segments and T waves, with initial negative deflection (= ST segment depression / T wave inversion) followed by a terminal positive deflection (= U wave) • All these waves merge into each other and it is difficult to tell where one wave ends and the other begins • There is gross prolongation of the QU interval (= time from onset of QRS complex to end of T/U wave) Diagnosis The combination of… • Widespread ST depression / T wave inversion • Prominent U waves • Long QU interval ( 500 ms) …. is highly suggestive of severe hypokalaemia . This patient had a serum K of 1.7 mmol/L in the context of decompensated Conn syndrome (primary aldosteronism) ."
    },
    "7": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-007-2.jpg",
      "img2": null,
      "read": "Main Abnormalities • Sinus tachycardia ~ 100 bpm • Anterior T wave abnormalities: inverted in V1-4 • Inferior T wave abnormalities: inverted in III, aVF • Subtle ST elevation in III and aVF, without reciprocal changes Significance of ECG Findings This pattern of T wave inversions in the right precordial leads V1-4 plus the inferior leads (especially the rightward-facing lead III) is referred to as the right ventricular strain pattern . It is a marker of right ventricular hypertrophy or dilatation. Diagnosis In a patient presenting with acute shortness of breath, the combination of… • Sinus tachycardia • RV strain pattern in V1-4 (+/- lead III) … is highly suggestive of acute cor pulmonale due to massive pulmonary embolism . However, these ECG changes are not specific to PE and may be seen in other conditions…"
    },
    "8": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-008-2.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/08/Quiz-8b.jpg",
      "read": "Main Abnormalities • Widespread ST depression affecting multiple precordial (V2-6) and limb leads (esp. I, II, avF). • To some extent this is masked by an indistinct J point, upsloping (rather than horizontal) ST depression, and some baseline wander of the ECG • There is marked ST elevation in aVR, measuring ~3mm • ST depression in aVF relative to the T-P baseline. • The blue arrow denotes the approximate position of the J point. • ST elevation in aVR Diagnosis In the context of ischaemic chest pain and cardiogenic shock, the combination of… • Widespread ST depression • Marked ST elevation in aVR > 1 mm • ST elevation in aVR > V1 … is extremely concerning for severe left main coronary artery (LMCA) insufficiency . However, this pattern is not entirely specific for LMCA insufficiency. It may be seen whenever…"
    },
    "9": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-009-2.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-009-2b.jpg",
      "read": "This ECG is an example of hyperacute anterolateral STEMI : • There are markedly peaked, asymmetrical T waves ( = hyperacute T waves ) in V2-5 • The associated loss of R wave height (analogous to early Q wave formation) causes the enlarging precordial T waves to tower over the diminishing R waves • There is also some subtle ST elevation in aVL, indicating LAD occlusion proximal to the D1 • There are frequent ventricular ectopic beats , which are concerning in this context as they suggest underlying myocardial irritability and a risk of deterioration to malignant ventricular dysrhythmias such as VF or VT"
    },
    "10": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-010.jpg",
      "img2": null,
      "read": "This ECG demonstrates classic features of hypothermia : • Bradycardia • Osborn waves (J waves) = notching at the J point seen in V2-6 • Long QT interval (~ 600 ms) • Shivering artifact The rhythm is probably sinus bradycardia — mapping out the RR intervals reveals a regular rhythm despite the obliteration of the baseline by the shiver artifact."
    },
    "11": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-011.jpg",
      "img2": null,
      "read": "Main Abnormalities • Sinus tachycardia • Low QRS voltages — Multiple limb lead QRS complexes 5 mm in amplitude. • Electrical alternans — There is a beat-to-beat variation in the QRS complex height. Taller complexes alternate with shorter ones The triad of tachycardia, low QRS voltages and electrical alternans is extremely suspicious for massive pericardial effusion . Given the clinical history, I would be concerned about the presence of a malignant pericardial effusion causing tamponade. The diagnosis can be rapidly confirmed on bedside echo (watch these videos from The Ultrasound Podcast to learn how: Part 1 , Part 2 ). There may also be clinical evidence of pulsus paradoxus ."
    },
    "12": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-012-2.jpg",
      "img2": null,
      "read": "Main Abnormalities • Giant T-wave inversions in multiple leads, most prominent in V2-6 • Marked QT prolongation > 600 ms Diagnosis This ECG pattern is characteristic of raised intracranial pressure and is classically seen in the context of massive intracranial haemorrhage , particularly: • Aneurysmal subarachnoid haemorrhage • Haemorrhagic stroke Similar ECG patterns have also been reported in patients with raised ICP due to: • Large-territory ischaemic stroke causing cerebral oedema (e.g. MCA occlusion) • Traumatic brain injury The differential diagnosis for widespread T-wave inversions and QT prolongation includes myocardial ischaemia (e.g. Wellens syndrome ) and electrolyte abnormalities (e.g. hypokalemia ). However, neither condition would cause the gigantic \" cerebral T waves \" seen here."
    },
    "13": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-013.jpg",
      "img2": null,
      "read": "Diagnosis This ECG shows a regular broad complex tachycardia with an RSR' pattern in V1. The differential diagnosis could include: • Ventricular tachycardia . • SVT with aberrant conduction — either due to RBBB or WPW . On closer inspection, the ECG demonstrates some classic features of ventricular tachycardia : • Northwest axis — QRS is positive in aVR, negative in I and aVF • The taller left rabbit ear sign — There is an atypical RBBB pattern in V1, where the left \"rabbit ear\" is taller than the right • Negative QRS complex (R/S ratio 1) in V6 These findings indicate VT rather than SVT with aberrancy. • Taller left rabbit ear = VT • Taller right rabbit ear = RBBB"
    },
    "14": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-014.jpg",
      "img2": null,
      "read": "Evidence of inferolateral STEMI : • ST elevation in the inferior leads (II, III, aVF) • ST elevation in the lateral leads (I, V5, V6) Evidence of concurrent posterior STEMI : • Horizontal ST depression in V1-4 (maximal in V2-3) • Dominant R wave in V2 (R/S ratio > 1) • Upright T wave in V2 This pattern of infero-postero-lateral STEMI is most likely caused by occlusion of a dominant left circumflex artery."
    },
    "15": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-015.jpg",
      "img2": null,
      "read": "This is the same patient from ECG 014 Posterior leads confirm the presence of posterior wall infarction by demonstrating typical STEMI morphology: • ST elevation in V7-9 • Q waves in V7-9 • Inversion of the terminal portion of the T wave (\" U wave inversion \") in V7-9"
    },
    "16": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-016.jpg",
      "img2": null,
      "read": "Main Abnormalities • Narrow complex tachycardia at ~ 150 bpm • Right axis deviation = just rightward of +90 degrees • Pseudo-R' waves in V1-2 = retrograde P waves superimposed on the terminal QRS causing peaking of the J-point • No clear sinus P waves or flutter waves seen Pseudo R' waves"
    },
    "17": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-017.jpg",
      "img2": null,
      "read": "Top rhythm strip • Regular narrow complex tachycardia • Pseudo-R' waves ( retrograde P waves ) are seen deforming the J point Middle rhythm strip • 12mg adenosine given • A salvo of broad and bizarre-looking complexes interrupts the rhythm (this is a common phenomenon during chemical cardioversion with adenosine) Bottom rhythm strip • The patient has reverted to sinus rhythm • The pseudo-R' waves have now disappeared • There are no obvious delta waves of WPW, but this should be confirmed on a 12-lead ECG"
    },
    "18": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-018.jpg",
      "img2": null,
      "read": ""
    },
    "19": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-019.jpg",
      "img2": null,
      "read": "Main Abnormalities • ST depression in V2-5, which slopes upwards and joins the ascending limb of the T wave • Prominent, \" rocket-shaped \" T waves in the precordial leads V2-5 • Subtle ST elevation in aVR Diagnosis • This combination of ST depression with rocket-shaped T waves in the precordial leads V1-6 is referred to as the De Winter ECG pattern or \"De Winter T waves\" • It is now recognised as an anterior STEMI equivalent (~2% of LAD occlusions), and should be treated identically to anterior STEMI, with urgent PCI or thrombolysis"
    },
    "20": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-020.jpg",
      "img2": null,
      "read": "Main Abnormalities • Runs of tachycardia are interspersed with long sinus pauses (up to 6 seconds) • The sinus rate is extremely slow, varying from 40 bpm down to around 10 bpm in places • Sinus beats are followed by paroxysms of junctional tachycardia at around 140 bpm Diagnosis • This is a good example of sick sinus syndrome leading to the tachycardia-bradycardia syndrome • The flurries of junctional tachycardia are a compensatory phenomenon attempting to maintain cardiac output in the face of critically low sinus node rates • The syncope likely occurred due to a long sinus pause with temporary loss of cardiac output. This patient needs a pacemaker!"
    },
    "21": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-021.jpg",
      "img2": null,
      "read": "This ECG demonstrates many of the features of chronic pulmonary disease : • Rightward QRS axis (+90 degrees) • Peaked P waves in the inferior leads > 2.5 mm ( P pulmonale ) • Rightward P-wave axis (inverted in aVL) • \"Clockwise rotation\" of the heart with a delayed R/S transition point (transitional lead = V5) • Absent R waves in the right precordial leads (SV1-SV2-SV3 pattern) • Low voltages in the left-sided leads (I, aVL, V5-6) Tachycardia may be due to dyspnoea, hypoxia or beta-agonist treatment. This ECG pattern is a common finding in patients with COPD. The inferior axis (+90 degrees) is due to hyperinflation of the lungs causing vertical orientation of the heart."
    },
    "22": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-022.jpg",
      "img2": null,
      "read": "Main Abnormalities This ECG displays the characteristic electrocardiographic features of quetiapine toxicity : • Sinus tachycardia due to anticholinergic effects • Prolonged QT interval (QT interval > half the RR interval; QTc = 560ms) A similar pattern would be seen with other atypical antipsychotic agents such as olanzapine or clozapine. Significance of QT prolongation • QT prolongation is a common source of concern in patients with antipsychotic toxicity, because of the theoretical risk of Torsades de Pointes • A QTc interval > 500 ms is commonly cited as a marker of increased risk of TdP • However, tachycardia (which is almost ubiquitous in significant poisoning with quetiapine, olanzapine or clozapine) is actually protective against TdP • For this reason, TdP rarely occurs with quetiapine toxicity"
    },
    "23": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-023.jpg",
      "img2": null,
      "read": "Main Abnormalities This ECG demonstrates the key features of sotalol toxicity: • Sinus bradycardia (42 bpm) • Very long QT interval (~600 ms) Sotalol is a beta blocker with additional class III effects (potassium channel blockade), so it causes both bradycardia and QT prolongation in overdose. Risk of Torsades • In comparison to ECG Quiz 022 , this patient is at significant risk of TdP • The combination of bradycardia and significant QT prolongation means that this patient plots well above the \"at risk\" line on the QT nomogram • Prophylaxis of TdP in this case would include correction of QT-dependent electrolytes (K, Mg, Ca) to the high-normal range and positive chronotropy (e.g. with isoprenaline) to move the patient below the at-risk line"
    },
    "24": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-024.jpg",
      "img2": null,
      "read": "Main Abnormalities This ECG demonstrates the typical features of dextrocardia : • Marked right axis deviation (+180 degrees) • Lead aVR: Positive QRS complex (upright P and T waves) • Lead I: inversion of all complexes, aka 'global negativity' (inverted P-QRS-T) • Absent R-wave progression in the chest leads (dominant S waves throughout) Differential Diagnosis Accidental reversal of the left and right arm electrodes may produce a similar picture to dextrocardia in the limb leads, but with normal appearances in the precordial leads."
    },
    "25": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-025.jpg",
      "img2": null,
      "read": "Main Abnormalities This ECG is a classic example of limb lead misplacement with a left arm / right arm lead reversal : • Positive P-QRS-T in lead aVR • Inverted complexes in leads I and aVL • Normal complexes in the precordial leads rules out dextrocardia (compare this to ECG Quiz 024 ) The most obvious abnormality on this ECG is the positive QRS complex in aVR. This is unusual and should always prompt a search for additional evidence of limb lead misplacement."
    },
    "26": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-026-2.jpg",
      "img2": null,
      "read": "This is a very worrying ECG demonstrating massive anterolateral STEMI with \" tombstone \" morphology: • Gross ST elevation in V1-6, I and aVL • Early Q wave formation in aVL • Reciprocal ST depression in inferior leads II, III and aVF This ECG pattern is seen in proximal LAD occlusion and indicates a large territory infarction with a poor LV ejection fraction. These patients are at high likelihood of ventricular fibrillation (VF), cardiogenic shock and death, and require aggressive management both pre-hospital and in the emergency department setting."
    },
    "27": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-027-2.jpg",
      "img2": null,
      "read": "Main Abnormalities • Bizarre appearing complexes • Marked T wave peaking in V2-6. • Gross QRS prolongation (~200 ms) • Some leads (I, aVR) are starting to take on a sine wave appearance Diagnosis The combination of… • Bizarre complexes • QRS prolongation • Peaked T waves • Sine wave appearance … are all strongly suggestive of severe hyperkalemia . This patient had a serum K of 9.2 mmol/L! In this elderly patient with multiple medical problems, causes could include renal failure (e.g. due to diuretics, NSAIDs, intercurrent illness) or treatment with ACE-inhibitors, spironalactone or K-supplements."
    },
    "28": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-028-2.jpg",
      "img2": null,
      "read": "ECG Findings The patient is in sinus rhythm with no evidence of dysrhythmia or AV block. The QT interval is normal and there is no evidence of WPW syndrome , HOCM or ARVD . There is a characteristic pattern of abnormalities in V1-2: • RSR' pattern / partial RBBB • ST elevation with a \" coved \" morphology • Inversion of the terminal portion of the T wave In a patient presenting with syncope, this ECG is diagnostic of the Brugada syndrome ."
    },
    "29": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-029-2.jpg",
      "img2": null,
      "read": "Main Findings • Irregular narrow-complex rhythm ( overall rate = 72 bpm ) • Normal sinus P waves are seen (upright in lead II), indicating a sinus origin of the rhythm • QRS complexes cluster in groups, separated by non-conducted P waves • The PR interval progressively prolongs within each group • The PR prolongation can be appreciated by comparing the first and last PR interval of each group Diagnosis This is the typical appearance of 2nd degree AV block with Mobitz I conduction ( Wenckebach phenomenon )."
    },
    "30": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-030.jpg",
      "img2": null,
      "read": "Main Abnormalities • Atrial tachycardia , with regular P waves visible at ~ 160 bpm (many of the P waves are hidden within T waves and VEBs) • Evidence of high-grade AV block — there is a 4:1 conduction ratio between P waves and QRS complexes, with a QRS rate of ~ 40 bpm • Frequent ventricular ectopic beats occurring in a pattern of ventricular bigeminy • Alternating LBBB and RBBB morphology , with the conducted QRS complexes demonstrating RBBB morphology (RSR' in V1) and the VEBs demonstrating LBBB morphology (dominant S wave in V1) Diagnosis The combination of… • Atrial tachycardia • Frequent ventricular ectopic beats • High-grade AV block … is almost pathognomonic of severe digoxin toxicity ."
    },
    "31": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-031-3.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/08/U-wave-1b.jpg",
      "read": "Main Abnormalities • The first half of the ECG shows sinus rhythm with prominent U waves and a long QU interval (520ms). • An atrial ectopic beat kicks off a run of Torsades de Pointes by landing on the T/U wave during the vulnerable phase of repolarisation and causing \"R on T\" (or \"R on U\") phenomenon. Diagnosis The combination of… • Atrial ectopy • Prominent U waves • Long QU interval • Torsades de Pointes … is strongly suggestive of severe hypokalaemia . This patient had a K of 1.9 mmol/L. Hypokalaemia occurs in eating disorders via multiple mechanisms including: • H+ is lost in vomiting — renal distal tubular reabsorption of H+ occurs in exchange for K+ (primary mechanism) • Loss of K+ in bodily secretions — vomiting, purging with laxatives or diuretics • Reduced oral intake • Metabolic alkalosis from…"
    },
    "32": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-032.jpg",
      "img2": null,
      "read": "Main Abnormalities This ECG demonstrates many of the classic features of acute pericarditis : • Widespread concave ST elevation with PR depression — most notable in I, II, III, aVF, V5-6 • PR elevation in the inverted leads aVR and V1 • Downward sloping of the TP segment = \"Spodick's sign\" • No reciprocal changes of STEMI • ST segment / T wave ratio > 0.25 (favours pericarditis over BER ) ST elevation and PR depression Spodick sign"
    },
    "33": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-033.jpg",
      "img2": null,
      "read": "Main Abnormalities • Irregularly irregular narrow-complex tachycardia at ~ 110 bpm • At least 3 different P wave morphologies seen in the lead II rhythm strip, indicating multiple foci of activity within the atria • No flutter or fibrillatory waves — rules out AF or flutter with variable block • Evidence of right ventricular hypertrophy — RAD , dominant R wave in V1 , deep S wave in V6 Diagnosis The combination of… • Irregular narrow-complex tachycardia (> 100 bpm)"
    },
    "34": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-034.jpg",
      "img2": null,
      "read": "Main Abnormalities The ECG changes are partially masked by the presence of a right bundle branch block , but there is clear evidence of anteroseptal STEMI : • Gross ST elevation in V1-3 (~ 5mm in V2) • Convex ST elevation in I and aVL • Reciprocal ST depression and T wave inversion in the inferior leads (II, III, aVF)"
    },
    "35": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-035-2.jpg",
      "img2": null,
      "read": "On first glance this ECG could easily be mistaken for an example of Mobitz II AV block — there are intermittent non-conducted P waves with a constant PR interval. However, regular pacing spikes can be seen following the P waves in leads V3-6. This is an example of pacemaker malfunction , with intermittent failure to capture : • Regular P waves are seen at ~65 bpm • Each P wave is following by a pacing spike (best seen in V3-6, subtle pacing spikes also present in I, aVR, V1). This indicates that atrial sensing is intact. NB. Pacing spikes will typically not be seen in all 12 leads • Some of the pacing spikes are followed by typical ventricular-paced complexes. The LBBB morphology indicates that the pacing lead is in the right ventricle — the heart depolarises from right to left in the same way as LBBB. Also…"
    },
    "36": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-036-2.jpg",
      "img2": null,
      "read": "Main Abnormalities This ECG is a good example of high lateral STEMI : • ST elevation is confined primarily to the high lateral leads I and aVL • There is reciprocal ST depression in the inferior leads II, III and aVF • The deep Q waves and poor R wave progression in V1-4 suggest prior anteroseptal infarction or dilated cardiomyopathy High lateral STEMI is classically associated with occlusion of the first diagonal branch (D1) of the LAD , but may also occur with occlusion of the obtuse marginal branch (OM) of the circumflex artery, or the ramus intermedius."
    },
    "37": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-037-2.jpg",
      "img2": null,
      "read": "Main Abnormalities This ECG is diagnostic of the Wolff-Parkinson-White (WPW) syndrome : • Sinus rhythm with a very short PR interval ( 120ms) • Broad QRS complexes • Delta waves = slurred upstroke to the QRS Other Features: • Dominant S wave in V1 — this \" type B \" pattern indicates a right-sided accessory pathway • Tall R waves and inverted T waves mimic the appearance of LVH — this is an electrical phenomenon due to WPW and not a sign of ventricular hypertrophy • ST segments and T waves show typical \"discordant\" changes — they point in in the opposite direction to the QRS complex, similar to LBBB"
    },
    "38": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-038-2.jpg",
      "img2": null,
      "read": "Main Abnormalities • Very rapid, regular broad-complex tachycardia (~ 200 bpm). • LBBB morphology (dominant S wave in V1). • No clear atrial activity — no flutter waves or fibrillatory waves. • No obvious diagnostic features for VT Differential Diagnosis In a patient presenting with a regular broad-complex tachycardia and no evidence of atrial activity, the main diagnostic considerations are: • Ventricular tachycardia . • SVT with aberrant conduction due to bundle branch block . • SVT with aberrant conduction due to WPW . Although diagnostic criteria exist to aid in differentiation of these rhythms, none of them have 100% sensitivity or specificity — leading many authors to recommend treating as VT if uncertain. However, clinical context is everything… This patient has two strong indicators of SVT with…"
    },
    "39": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-039-2.jpg",
      "img2": null,
      "read": "This ECG shows extensive infero-postero-lateral STEMI with \"tombstone\" morphology: • Gross ST elevation in II, III, aVF consistent with inferior infarction . • Reciprocal ST depression seen in I, aVL. • ST elevation in V5-6 indicating lateral wall involvement . • ST depression in V2 is suggestive of associated posterior wall infarction — the morphology is the exact inverse of the ST elevation in the inferior leads. There are some additional features suggest of right ventricular infarction : • STE in lead III > lead II. • Deep ST depression in V2 with an isoelectric ST segment in V1. This is a huge infarct with a likely poor prognosis. Hypotension may be due to nitrate therapy causing exaggerated preload reduction in the context of RV infarction, or may simply reflect the large infarct size with development…"
    },
    "40": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-040.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-040b.jpg",
      "read": "Main Abnormalities There are two competing rhythms at similar rates (= isorhythmic AV dissociation): • Accelerated idioventricular rhythm (AIVR) — broad-complex ventricular rhythm at around 60 bpm. • Sinus bradycardia with sinus arrhythmia — the sinus rate varies from 70 bpm down to 50 bpm. The QRS morphology varies depending on which focus is capturing the ventricles at any given moment. Other Findings Specific ECG findings that confirm the presence of simultaneous sinus and ventricular rhythms are: • Capture beats — sinus beats that intermittently wrest control of the rhythm producing narrow complexes. • Fusion beats (seen in the second ECG) — these are intermediate width complexes that occur when sinus and ventricular beats coincide. NB. Fusion and capture beats are often discussed in the context of VT.…"
    },
    "41": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-041.jpg",
      "img2": null,
      "read": "This is an ECG example of dilated cardiomyopathy demonstrating signs of enlargement of all four cardiac chambers: • There is marked LVH with very deep S waves in V2-4. • Right axis deviation suggests associated RV enlargement (= biventricular enlargement ). • Evidence of left atrial enlargement (deep, wide terminal portion of the P wave in V1). • Peaked P waves in lead II suggestive of right atrial enlargement (~ 2.5mm in height). This patient had four-chamber dilatation on echocardiography with severe congestive cardiac failure (awaiting cardiac transplantation)."
    },
    "42": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-042-2.jpg",
      "img2": null,
      "read": "Main Abnormalities This is a typical example of atrial flutter with 2:1 AV block • Narrow complex tachycardia at 150 bpm. • Sawtooth flutter waves are seen in the inferior leads II, III, aVF. • Upright flutter waves in V1 appear either as pseudo-P waves or as notches in the T wave. • There is a clear 2:1 relationship between the flutter waves (300 bpm) and QRS complexes (150 bpm). Inverted flutter waves in lead II. Upright flutter waves in V1."
    },
    "43": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-043.jpg",
      "img2": null,
      "read": "Main Abnormalities Sinus rhythm with evidence of 2nd degree AV block • The QRS complexes cluster in groups separated by non-conducted P waves. • There is a 3:2 relationship between the P waves and QRS complexes. • With fixed ratio blocks like this, it can sometimes be difficult to distinguish between Mobitz I and Mobitz II conduction, as there are not always enough successive PR intervals to judge whether progressive PR prolongation is occurring. • The PR interval seems relatively constant between the first and second beats of each group, suggesting Mobitz II conduction. • However, the clustering of QRS complexes into repeating groups with P:QRS ratios of 3:2, 4:3, 5:4, etc. is a characteristic feature of Mobitz I . • There is an atypical RBBB — typical RSR' pattern in V1 with slurred S wave in lead I, but…"
    },
    "44": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-044.jpg",
      "img2": null,
      "read": "There is sinus rhythm with complete heart block : • Normal P waves (upright in II, inverted in aVR) are present at a rate of ~ 85 bpm. • There is no relationship between the P waves and QRS complexes — the PR intervals vary randomly. • A ventricular escape rhythm is present at ~ 36 bpm. The broad QRS complexes, RBBB morphology and left axis deviation (resembling trifascicular block ) indicate a ventricular escape rhythm arising in the left posterior fascicle. Note how the QRS axis and morphology have changed significantly from ECG Quiz 043 . This patient had complete heart block due to cardiac sarcoidosis."
    },
    "45": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-045.jpg",
      "img2": null,
      "read": "This ECG shows a ventricular paced rhythm with positive Sgarbossa criteria : • There is concordant ST depression in V2-5. This violates the expected pattern of discordance for a V-paced rhythm and is a marker of superimposed myocardial infarction . • The morphology in V2-5 is reminiscent of posterior STEMI , with horizontal ST depression and prominent upright T waves. • Multiple non-conducted P waves are seen, indicating the presence of underlying high-grade AV block (probably the indication for pacemaker insertion). However, the fusion complex (beat #5 on rhythm strip) suggests that P waves are occasionally transmitted, arguing against complete heart block . This patient did indeed have an isolated posterior infarction , due to complete occlusion of a posterolateral branch of the RCA. She was successfully…"
    },
    "46": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-046.jpg",
      "img2": null,
      "read": "This ECG contains multiple diagnostic features for ventricular tachycardia :; dominant R wave in V1/V2 and therefore a RBBB morphology (compare this with ECG 047 ) • Regular broad complex tachycardia at ~150 bpm. • Very broad QRS complexes (~200 ms). • Northwest axis (-120 degrees) with positive QRS in aVR. • Time from onset of the QRS complex to nadir of the S-wave > 100ms in any of the precordial leads (Brugada 1991) • Notching/slurring of the downslope of the S wave in V1/V2 (Josephson's sign 1988) Northwest Axis Dominant R Wave in V1 or V2 – RBBB Morphology Note the presence of morphology criteria favouring VT over RBBB such as Tall monophasic R wave in V1; Dominant S wave in V6 Lead V1 and V2 morphology Lead V6 morphology This pattern in V1 and V6 is very different from the expected morphology in RBBB.…"
    },
    "47": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-047.jpg",
      "img2": null,
      "read": "This is another example of ventricular tachycardia , this time with a dominant S wave in V1/V2 and therefore a LBBB morphology (compare this with ECG 046 ). Regular broad complex tachycardia at ~ 160 bpm. Features of VT in V1 : • Initial R wave > 30 ms wide, RS interval > 70 ms (Brugada sign) • Notching/slurring of the downslope of the S wave in V1/V2 (Josephson sign). Features of VT in V6 : • Dominant S wave in V6; qR wave; absence of typical LBBB morphology • Abnormal axis with positive aVR, although does not quite meet criteria for northwest axis . NB. Note that a positive Brugada sign only requires an RS interval of 60 ms when LBBB morphology is present, compared to 100 ms when RBBB morphology is present."
    },
    "48": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-048-2.jpg",
      "img2": null,
      "read": "On first glance this would appear to be SVT with LBBB as there is: • Regular broad-complex tachycardia. • No atrial activity seen. • Typical LBBB morphology in aVR, V1 and V6. • No obvious diagnostic features for VT — compare this with ECG 047 . However, there is one feature here that is unusual for LBBB, can you spot it? There is an rightward / inferior axis (around +90 degree)., which is atypical for Left Bundle branch block. LBBB normally has a leftward axis . This combination of… • Broad complex tachycardia with typical LBBB morphology. • Inferior axis (+90 degrees). … is suggestive of a specific type of VT known as right ventricular outflow-tract tachycardia (RVOT). RVOT is a relatively common form of right ventricular VT, occurring in two main groups: • Patients with structurally normal hearts (= 70%…"
    },
    "49": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-049-2.jpg",
      "img2": null,
      "read": "Main Abnormalities • Broad complex tachycardia at ~ 120 bpm. • Pacing spikes precede each QRS complex. • LBBB morphology (dominant S wave in V1-2) indicates a pacing electrode in the right ventricle. • Negative concordance is seen in V1-6 (all precordial leads show negative complexes). This is an often-cited feature of VT, but also occurs with paced rhythms. It simply indicates that ventricular depolarisation is spreading from anterior to posterior (away from V1-6), e.g. due to a pacemaker electrode stimulating the anterior wall of the RV. These features are consistent with a pacemaker malfunction resulting in a rapid ventricular-paced rhythm. Differential Diagnosis The differential diagnosis of this rhythm includes: • Pacemaker-mediated tachycardia • Sensor-induced tachycardia • Atrial tachycardia (e.g.…"
    },
    "50": {
      "img": "https://litfl.com/wp-content/uploads/2018/08/TOP-100-ECG-QUIZ-LITFL-050-2.jpg",
      "img2": null,
      "read": "This is a classic sine wave ECG of critical hyperkalaemia • Bradycardia (~ 55 bpm). • Bizarre-looking QRS complexes. • Gross QRS prolongation (> 300 ms). • Massively peaked T waves. This patient had a K+ of 9.9 mmol/L !"
    }
  },
  "cxr": {
    "1": {
      "img": "https://litfl.com/wp-content/uploads/2018/09/CXR-CASE-001-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/09/CXR-CASE-001-CT-LITFL.jpg",
      "read": "CXR AP There is upper lobe predominant bronchial wall thickening with ring shadows and patches of consolidation. There are features of mild airflow obstruction with flattened hemidiaphragms. The features suggest cystic bronchiectasis and given the symmetrical upper lobe predominance and clinical features, cystic fibrosis (CF) is most likely."
    },
    "2": {
      "img": "https://litfl.com/wp-content/uploads/2018/09/Top-100-CXR-LITFL-002.jpg",
      "img2": null,
      "read": "There is dextrocardia . * The stomach gas bubble is also on the right side, suggesting situs inversus * There are coarse, thickened bronchial markings and small ring shadows, most notable in the upper lobes, consistent with bronchiectasis CLINICAL IMPLICATIONS Kartagener syndrome describes Primary Ciliary Dyskinesia (PCD), bronchiectasis and situs invertus. * Other features include chronic sinusitis, infertility * Diagnosis of PCD is with nasal brushings and biopsy to assess ciliary beat frequency with video microscopy; a poor man's test is with the saccharin test – time for saccharin to be tasted in the mouth after deposition of droplet of saccharin on the inferior turbinate of the nose."
    },
    "3": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-003-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-003-CT-LITFL.jpg",
      "read": "This CXR demonstrates bronchiectasis . There are coarse, thickened airway markings with ring shadows bilaterally, but worse in the left upper lobe (obscuring the heart border) and left lower lobe, obstructing the hemidiaphragm. * There is also scoliosis of the spine * The CT demonstrates bronchiectais with markedly dilated airways and thickened airway walls with patches of sputum plugging. CLINICAL CORRELATION Concurrent airways disease is common in bronchiectasis and should be treated similarly to acute asthma"
    },
    "4": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-004-LITFL.jpg",
      "img2": null,
      "read": "There is consolidation throughout the right side, sparing the periphery. There is also an air bronchogram behind the heart. This is most likely a pneumonia . * Note the ETT and left subclavian line * CLINICAL CORRELATION The sparing of the lung periphery is unusual but does not necessarily mean this is caused by an atypical organism. ' Atypical' pneumonia accounts for about 20% of all pneumonia so they are not very atypical!"
    },
    "5": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-005-LITFL.jpg",
      "img2": null,
      "read": "There is upper lobe predominant bronchial wall thickening and ring shadows suggestive of bronchiectais and possibly cystic fibrosis. * In the left mid zone there is a cavity with a fluid level and surrounding consolidation suggesting a lung abscess* CLINICAL IMPLICATIONS The haemoptysis could be from the bronchiectais or the lung abscess. * In the immunocompetent, the microbiology of lung abscess is commonly mixed anaerobes *"
    },
    "6": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-006-LITFL.jpg",
      "img2": null,
      "read": "There are reduced lung markings throughout the right side with tethers of lung to the chest wall suggesting giant bullae , not pneumothorax There is a fracture to the right 9th rib, and possibly 8th CLINICAL CORRELATION Giant bullae are on the extreme spectrum of emphysema."
    },
    "7": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-007-LITFL.jpg",
      "img2": null,
      "read": "There is complete white out of the left lung with air bronchograms in the mid zone, caused by pneumonia and a smaller patch of consolidation in the right mid zone. *see CXR case 008 to compare CLINICAL CORRELATION There is no collapse in this case. The trachea and right heart border remain in the normal position."
    },
    "8": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-008-LITFL.jpg",
      "img2": null,
      "read": "There is complete white out of the left lung caused by pneumonia (air bronchograms mid zone). * There is partial volume loss with collapse because the right heart border and trachea have shifted to the left. * There is a large bore chest drain in situ on the left. * ETT (probably a bit too proximal) and NG tube also present * CLINICAL CORRELATION Severe pneumonia can rarely cause secondary pneumothorax."
    },
    "9": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-009-LITFL.jpg",
      "img2": null,
      "read": "Non-infective exacerbation COPD The lung fields are overinflated with flattened hemidiagragms consistent with airways disease and COPD. No focal consolidation to suggest pneumonia. CLINICAL CORRELATION The flattened hemidiaphragms are a sign of overinflation from gas trapping from the emphysema. Attempts to increase tidal volume are usually offset by a reduction in expiratory time – leading to dynamic hyperinflation."
    },
    "10": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-010-LITFL.jpg",
      "img2": null,
      "read": "The lung fields are hyperinflated with flattened hemidiagragms consistent with overinflation from airways disease (probable COPD). * There is a safety pin that appears to be in the stomach, or external artifact * CLINICAL CORRELATION This lady is having arrhythmias and tachycardia from excessive beta-2 agonist use (short and long acting). * A history of safety pin ingestion should also be taken… *"
    },
    "11": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-011-LITFL.jpg",
      "img2": null,
      "read": "Acute Respiratory Distress Syndrome (ARDS) There is bilateral airspace opacification throughout both lungs, sparing the apices. * ETT, IJ line and NGT in situ *"
    },
    "12": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-012-LITFL.jpg",
      "img2": null,
      "read": "There are bilateral perihilar infiltrates and consolidation. This is most likely Pneumocystis Jiroveci Pneumonia (PJP) CLINICAL CORRELATION"
    },
    "13": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-013-LITFL.jpg",
      "img2": null,
      "read": "There is complete collapse of the right upper lobe * Note the resultant elevation of the right horizontal fissure * Patchy Left Upper Lobe (LUL) opacification suggestive of consolidation * ETT and NG tube also present * CLINICAL CORRELATION * This is a case of severe pneumonia * Right upper lobe collapse has distinctive features, and is often easily identifiable on CXR. Features include : increased density in the right upper lung field, elevation of both the right hilum and right horizontal fissure, and loss of the right cardiomediastinal contour."
    },
    "14": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-014-LITFL.jpg",
      "img2": null,
      "read": "There is complete white out on the left side. Features are consistent with complete collapse of the left lung. The trachea is deviated to the left and the right heart border is not visible suggesting mediastinal shift to the left. * There is an ETT and NG tube in situ * CLINICAL CORRELATION * Features are consistent with complete collapse of the left lung * This can be caused by a sputum plug in the left main bronchus or endobronchial tumour."
    },
    "15": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-015-Femur-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-015-LITFL.jpg",
      "read": "CXR: There is a 5.56 bullet projected over the lower left lung field lateral to the heart. * There is no evidence of any injury to the chest or lungs * AP Femur: *There is destruction to the right distal femur from a high velocity projectile. Multiple fragmentation of bone and perhaps metal. CT Chest: There is a bullet lodged in the left inferior pulmonary artery. CLINICAL IMPLICATIONS The bullet is thought to have migrated up the femoral vein, through the IVC and right heart and into its resting place in the left inferior pulmonary artery."
    },
    "16": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-016-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/01/CASE-016-REPEAT-XR.jpg",
      "read": "Presenting CXR: There is complete collapse of the left lower lobe (LLL) creating the sail sign behind the heart and volume loss in the left hemithorax. There are age-related bony changes of the thoracic vertebral column and ribs * The lung fields are overinflated, consistent with gas trapping from airways disease * Presenting CXR: The left lower lobe is now re-inflated CLINICAL CORRELATION Left lower lobe collapse has distinctive features, but may sometimes be missed on CXR. * Features of left lower lobe collapse include: edge of collapsed lung creating a 'double cardiac contour,' loss of normal left hemidiaphragm outline * A lateral CXR is useful in looking for left lower lobe collapse – a triangular outline representing the collapsed lung may be visible posteriorly. In this case the patient was hydrated…"
    },
    "17": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-017-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-017-Bronchoscopy.jpg",
      "read": "CXR: There is volume loss in the right hemithorax with collapse of the right upper lobe. * There is patchy consolidation in the right lower and middle lobes * Bronchoscopy: Bronchoscopy reveals a large obstructing polypoid mass in the right main bronchus. CLINICAL CORRELATION The tumour was snared and removed using cautery – its origin was from the right upper lobe. * The patchy consolidation in the lower and middle lobes is from post-obstructive pneumonia. *"
    },
    "18": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-018-LITFL.jpg",
      "img2": null,
      "read": "There is complete collapse of the right lung with tracheal deviation and mediastinal shift CLINICAL CORRELATION This is most likely caused by an obstructing endobronchial lesion such as a tumour or sputum plugging"
    },
    "19": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-019-LITFL.jpg",
      "img2": null,
      "read": "There is bilateral hilar lymphadenopathy * The lung fields are otherwise clear* CLINICAL CORRELATION Bilateral hilar lymphadenopathy should always be further investigated, as lymphoma (primarily Hodgkin's) is an important cause. Differentials include: sarcoidosis, silicosis and tuberculosis."
    },
    "20": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-020-LITFL.jpg",
      "img2": null,
      "read": "There is bilateral multifocal airspace opacification, mainly in the perihilar and lower zones. * There are four large bore chest tubes in situ * * There is an ETT, NGT and right subclavian vascular line * * The multiple metallic artifacts are burns dressings * CLINICAL CORRELATION"
    },
    "21": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-021-LITFL.jpg",
      "img2": null,
      "read": "There are widespread, patchy rounded infiltrates of varying size throughout both lung fields. The infiltrates appear more confluent and dense in the lower lobes, perhaps representing some consolidation. Some of the lesions in the upper zones appear to be cavitating. CLINICAL CORRELATION Possible differentials for this appearance include: • cavitating pulmonary metastases (e.g. squamous cell, adenocarcinoma from GI tract or breast, sarcoma) • septic pulmonary emboli • Granulomatosis with Polyangiitis"
    },
    "22": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-022-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-022-CT.jpg",
      "read": "CXR and CT chest INTERPRETATION CXR Interpretation: There is a small right pleural effusion. There is loss of the left hemidiaphragm and left heart border with diffuse increased opacification in the left lower zone. CT Interpretation: CT chest demonstrates a moderate pericardial effusion with associated peripheral atelectasis. CLINICAL CORRELATION At first glance the appreances on the plain PA CXR could be mis-interpretted as a pleural effusion. * This gentleman is breathless due to a pericardial effusion and worsening heart failure. *"
    },
    "23": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-023-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-023-Lateral.jpg",
      "read": "CXR PA and Lateral INTERPRETATION CXR AP Interpretation: PA chest x-ray demonstrates large superior soft tissue density. *The hilar vessels are visualized through the mass The rest of the lungs are unremarkable * There is a large gastric bubble * Lateral CXR Interpretation: Lateral chest x-ray demonstrates anterior superior mediastinal mass CLINICAL CORRELATION The presence of night sweats and weight loss raise the likelihood of lymphoma. Examination for any palpable lymph nodes and CT neck / chest / abdomen / pelvis is warranted."
    },
    "24": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-024-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-024-CT-chest.jpg",
      "read": "CXR Interpretation: There is bilateral basal atelectasis with otherwise clear lung fields * AP, rotated film * CT Interpretation: CTPA demonstrates bilateral, proximal acute pulmonary emboli CLINICAL CORRELATION Atelectasis is a relatively uncommon but recognized feature of PE on plain CXR and small pleural effusions can be present in up to 40% of cases with PE"
    },
    "25": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-025-LITFL.jpg",
      "img2": null,
      "read": "There is consolidation with a sharply delineated lateral margin on the right side and some patchy changes on the left"
    },
    "26": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-026-LITFL.jpg",
      "img2": null,
      "read": "There are diffuse increased interstitial markings throughout both lungs without zonal distribution. The reticular-nodular pattern is consistent with pulmonary fibrosis * There is an air-fluid level overlapping the heart shadow, with absence of usual gastric air sinus. This is in keeping with a large hiatus hernia * CLINICAL CORRELATION This patient is at risk of aspiration, and given the context of unlikely infection, this is the most likely reason for the acute presentation. * She has a background of pulmonary fibrosis which in this case is not caused by aspiration, but is a well recognized complication of pulmonary fibrosis. *"
    },
    "27": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-027-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-027-Hand.jpg",
      "read": "IMAGE INTERPRETATION CXR Interpretation: There is diffuse reticulonodular infiltrate across all lung fields, but most marked in the bases. * There is loss of volume in both lung fields * The appearances are consistent with pulmonary fibrosis Clinical Image: This is clubbing CLINICAL CORRELATION In this case, this patient has developed signs of cor pulmonale secondary to the chronic lung disease. Bi-basal inspiratory crackles can be commonly miss-labelled as pulmonary oedema, particularly when there is right heart failure. The presence of clubbing (present in ~50% cases of idiopathic pulmonary fibrosis) should be a strong driver towards considering a primary pulmonary pathology."
    },
    "28": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-028-CXR-LITFL.jpg",
      "img2": null,
      "read": "There is diffuse reticular-nodular shadowing throughout both lung fields . *The heart size is normal and the pleural spaces are clear * The are surgical clips in the right mid zone, likely from a right lower lobe biopsy. * CLINICAL CORRELATION This is a case of a diffuse alveolitis causing pulmonary fibrosis . Crackles in the chest are not always from pulmonary oedema!"
    },
    "29": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-029-CXR-LITFL.jpg",
      "img2": null,
      "read": "There is bilateral hilar adenopathy and bands of atelectasis in both lung bases. *Lung parenchyma looks normal. CLINICAL CORRELATION This is sarcoidosis (stage 1 on radiological classification) * Important differentials to consider would be lymphoma and TB * Lymph node biopsy (these days guided by endobronchial ultrasound) demonstrating non-caseating granuloma is needed to secure the diagnosis"
    },
    "30": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-030-CXR-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-030-Lower-limbs.jpg",
      "read": "IMAGE INTERPRETATION CXR Interpretation: There is bilateral hilar adenopathy. * There are a few subtle reticulonodular shadows within the lung parenchyma. Clinical Image: This is erythema nodosum CLINICAL CORRELATION This is sarcoidosis, specifically Löfgren syndrome . * The lung parenchyma changes are subtle and would require CT to confirm ."
    },
    "31": {
      "img": "https://litfl.com/wp-content/uploads/2018/01/CXR-CASE-031-CXR-LITFL.jpg",
      "img2": null,
      "read": "There is bilateral hilar adenopathy with a predominantly nodular infiltrate in the lung fields, sparing the bases. CLINICAL CORRELATION This is sarcoidosis (Stage II on radiological classification)."
    },
    "32": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-032-CXR-LITFL.jpg",
      "img2": null,
      "read": "There are multifocal bilateral reticulonodular air-space opacities, predominantly perihilar and mid zone distribution. CLINICAL CORRELATION This gentleman has long standing pulmonary fibrosis caused by sarcoidosis. There is marked pulmary parenchymal infiltrate and established fibrosis ( sarcoidosis stage IV on radiological classification)."
    },
    "33": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-033-CXR-LITFL.jpg",
      "img2": null,
      "read": "There are bilateral predominantly mid zone multifocal parenchymal infiltrates, worse on the left. There is marked coarse fibrosis in the mid zones, worse on the left and affecting the horizontal fissure with some volume loss of the right upper lobe. CLINICAL CORRELATION This man has longstanding pulmonary and pleural fibrosis from sarcoidosis. Old CXRs and CTs may help establish if any of the infiltrate is new, suggesting infection"
    },
    "34": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-034-CXR-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-034-Lateral-CXR-LITFL.jpg",
      "read": "CXR Interpretation: This AP film has an irregular thin walled large cavity in the medial right mid zone. The hilar vessels are visible suggesting it is situated either posteriorly or anteriorly . There are coarse reticular markings in the right middle lobe and lingular lobes suggestive of bronchiectasis. Lateral CXR Interpretation: The lateral confirms the presence of a cavity in the right apical segment of the lower lobe. There is no fluid level. The is some scattered surrounding airspace shadowing (consolidation)"
    },
    "35": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-035-CXR-LITFL.jpg",
      "img2": null,
      "read": "There is a left upper lobe thick walled cavity with an air fluid level and surrounding consolidation. * There may be left hilar adenopathy. The rest of the lung field and pleura look normal"
    },
    "36": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-036-CXR-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-036-CT-LITFL.jpg",
      "read": "IMAGE INTERPRETATION CXR Interpretation: There is diffuse air space shadowing in the right mid zone with an area of central lucency and air fluid level. * A left nipple ring is noted The rest of lung parenchyma and pleura are normal CT Interpretation: CT demonstrates a thick walled cavity in the apical segment of the right lower lobe. * There is an air fluid level with some surrounding consolidation CLINICAL CORRELATION The most likely diagnosis is aspiration from reduced conscious level causing a lung abscess and systemic sepsis."
    },
    "37": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-037-CXR-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-037-Lateral-CXR-LITFL.jpg",
      "read": "AP CXR Interpretation: There is a cavitating lesion in the right mid zone laterally with an air fluid level and surrounding consolidation. Allowing for slight rotation and a left nipple ring, the film is otherwise normal. Lateral CXR Interpretation: Lateral X-Ray confirms the presence of a cavitating lesion with air fluid level and surrounding consolidation. The lesion is situated in the apical segment of the right lower lobe CLINICAL CORRELATION This is most likely a lung abscess . * Risk factors including immune suppression should be assessed."
    },
    "38": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-038-CXR-LITFL.jpg",
      "img2": null,
      "read": "There is diffuse air space shadowing with volume loss in the right upper lobe with an area of lucency suggesting a cavity. There is volume loss, air space shadowing in the left lower lobe and possibly a small pleural effusion. * There is external artifact overlying the left lung apex and clavicle. CLINICAL CORRELATION There is consolidation, a lung cavity and pleural effusion. These features are most likely caused by infection and TB should be strongly considered. * This lady had come from Eastern Europe and had multi drug resistant TB."
    },
    "39": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-039-CXR-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-039-CT-LITFL.jpg",
      "read": "IMAGE INTERPRETATION CXR Interpretation: There is a left pleural effusion, left basal increased airspace opacification with central lucency and an air fluid level. *There are multiple different size 1cm, rounded lesions throughout both lung fields, some with minor cavitation. Lateral CXR Interpretation: Lateral X-ray demonstrates a cavity with an air fluid level and associated pleural effusion with loculated fluid superior to the cavity. CT Chest Interpretation: CT confirms the presence of a large thick walled fluid containing cavity in the left lower lobe with associated pleural thickening. *There are small patches of consolidation in the lingula and on the right side. CLINICAL CORRELATION This lady has septic emboli causing lung abscess and pleural infection. * The source of the infection is presumed to be…"
    },
    "40": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-040-CXR-LITFL.jpg",
      "img2": null,
      "read": "There is an air fluid level in a large cavity in the left upper zone with associated increased airspace shadowing and left hilar adenopathy. There is increased lucency above the air fluid level with scanty lung markings suggesting this is either a large cavity or involving the pleural space. The rest of the lung parenchyma and pleural spaces are normal. CLINICAL CORRELATION Malignancy and TB would be the most important diagnoses to consider. * A CT scan and culture of sputum (including Acid Fast Bacilli) would be the next best steps."
    },
    "41": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-041-CXR-LITFL.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-041-Lateral-CXR-LITFL.jpg",
      "read": "CXR Interpretation: There are multiple large areas of airspace opacification projecting over both lung fields. * Areas of opacification project primarily over the lower and mid-zones, and completely obscure the heart border . * The right base is more dense, suggesting possible pleural effusion, with fluid laterally and in the horizontal fissure. Lateral CXR Interpretation: T12 has diffusely and homogeneously increased density – an ' ivory vertebra' (this is actually visible on the PA – but we are easily distracted…). This refers to a diffuse homogeneous increase in opacity of a vertebral body that otherwise retains its size and contours. Multiple rounded patches of airspace opacification throughout the left lung field and fluid within the horizontal fissure. CLINICAL CORRELATION Methicillin-resistant…"
    },
    "42": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-042-CXR-LITFL.jpg",
      "img2": null,
      "read": "There are multiple rounded ring shadows in the right upper lung, with overlying chest wall deformity. * A central line has been inserted, its tip projects over the superior vena cava . * A chest drain projects over the left mid-zone. There is no associated pleural effusion. * Median sternotomy wires are visible CLINICAL CORRELATION This lady has had plombage for TB in the early 1950s. Large bore drains are generally not indicated for 1st line secondary pneumothorax treatment!"
    },
    "43": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-043-CXR-LITFL.jpg",
      "img2": null,
      "read": "There is bilateral apical pleural calcification, more pronounced on the right. There is additional right upper lobe fibrosis and traction causing the right hilum to be elevated, mediastinal shift and volume loss on the right side. CLINICAL CORRELATION This lady has old Right upper lobe (RUL) and pleural TB. She will likely have chronic airways limitation due from the architectural distortion."
    },
    "44": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-044-CXR-LITFL.jpg",
      "img2": null,
      "read": "There is a calcified suprahilar lymph node on the right (station 4R). Remaining mediastinum, lung parenchyma and pleural are normal. CLINICAL CORRELATION This is old tuberculosis (TB) . Any history of active disease (cough, fevers, weight loss) should be sought – although this is likely decades old"
    },
    "45": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-045-CXR-LITFL-2.jpg",
      "img2": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-045-CT-LITFL.jpg",
      "read": "IMAGE INTERPRETATION CXR Interpretation: There are bilateral multiple ring shadows in both apicies and scattered calcification, more prominent in the left apex. The trachea is deviated to the right and may be narrowed. There is associated 2nd, 3rd, and 4th rib destruction bilaterally. The remaining lower lobes parenchyma appear normal. CT Chest Interpretation: Bilateral upper zone plombage is associated with complete destruction of the upper lobes, and surgical rib removal / damage to the upper thoracic ribs. CLINICAL CORRELATION The combination of effectively a bilateral lobectomy and thoracic cage deformation has led to chronic ventilatory insufficiency"
    },
    "46": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-046-CXR-LITFL.jpg",
      "img2": null,
      "read": ""
    },
    "47": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-047-CXR-LITFL.jpg",
      "img2": null,
      "read": "There are calcified nodules in the left mid zone and left upper zone behind the clavicle. * The aorta is unfolded . * Lung volumes look a little small, with no evidence of interstitial lung disease this may be related to her extrathoracic adiposity."
    },
    "48": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-048-CXR-LITFL.jpg",
      "img2": null,
      "read": "There is increased opacification throughout the left hemithorax with loss of the left heart outline although the left hemidiaphragm remains visible. Air bronchograms are visible suggesting consolidation. CLINICAL CORRELATION This is left upper lobe (including left lingula) pneumonia. * The sputum was positive for acid fast bacilli – confirming acute tuberculosis. Subsequent HIV test was positive."
    },
    "49": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-049-CXR-LITFL.jpg",
      "img2": null,
      "read": "There is bilateral apical pleural calcification and upper lobe fibrosis, worse on the right. Both hilar are elevated and there is volume loss on the right side, with deviation of the mediastinum and trachea to the right. CLINICAL CORRELATION This is old TB . * The volume loss is from the fibrosis and also a right-sided phrenic nerve crush – both contributing to the ventilatory failure"
    },
    "50": {
      "img": "https://litfl.com/wp-content/uploads/2018/02/CXR-CASE-050-CXR-LITFL.jpg",
      "img2": null,
      "read": "The patient has had a thoracoplasty with consequential loss of volume in the right hemithorax. There is left upper lobe fibrosis. There is patchy opacification throughout both lung fields likely representing fibrosis however acute infiltrate, particularly in the left lower zone is possible. * There is marked kyphoscoliosis . CLINICAL CORRELATION This man has chronic ventilatory failure secondary to his iatrogenic chest wall deformity"
    }
  }
};
