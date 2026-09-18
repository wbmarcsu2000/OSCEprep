// src/data/neuroPharmDrills.ts
/**
 * Neurology drills — the "pharm" domain (Neuro pharm) of the Neurology drill
 * bank.
 *
 * Each drill is one way neuro pharmacology is asked on the shelf: the drug
 * and its signature adverse effect (antiepileptics, anesthetics), the
 * indication and its first-line agent (Parkinson/Alzheimer, cholinergic and
 * anticholinergic agents, symptomatic drugs), and the drug-induced emergency
 * with its antidote (EPS, hyperthermic syndromes). `org` is "Pharm"
 * (drug-first: mechanism + side effect), "Management" (indication-first) or
 * "Emergencies" so the Browse list splits the families.
 *
 * ITEM RULE — items are "<recall head> — <why / clue>". Only the head is graded
 * (gradableItem in drillProgressCore), so it is the shortest phrase a student
 * would actually write; "/" in a head lists alternative spellings any one of
 * which earns credit. Numbers, cut-offs and nuance live after the dash or in
 * pearls, which are shown on reveal and never graded. Heads within one drill
 * must not credit each other — asserted in the test.
 *
 * Standard board values; institutional protocols vary. Educational use only.
 * Authored 2026-09-15 from standard shelf sources (NBME-style neurology and
 * pharmacology review; First Aid-level facts).
 */
import type { GuidelineDrill } from "./guidelineDrillBank";

const PHARM = "Pharm";
const MANAGEMENT = "Management";
const EMERGENCIES = "Emergencies";
const REVIEWED = "2026-09-15";

export const NEURO_PHARM_DRILLS: GuidelineDrill[] = [
  // ───────────────────────── DRUG → MECHANISM & SIDE EFFECT ─────────────────────────
  {
    id: "pharm-antiepileptics",
    domain: "pharm",
    name: "Antiepileptic drugs & side effects",
    org: PHARM,
    prompt: `24F with juvenile myoclonic epilepsy, seizure-free on valproate, tells you she is 8 weeks pregnant. Separately, a 60M started on carbamazepine for trigeminal neuralgia returns with Na 122 and pancytopenia.\n\nName the antiepileptic and hypnotic agents a shelf tests — the mechanism and the signature adverse effect of each — then the pregnancy problems they cause and the rules that limit them.`,
    keyPoints: [
      {
        group: "Sodium channel blockers",
        items: [
          "Valproate / valproic acid — blocks Na channels and raises GABA; tremor, hepatotoxicity (check LFTs), pancreatitis, thrombocytopenia, weight gain; the highest neural tube defect risk; JME, bipolar",
          "Carbamazepine — Na channel; trigeminal neuralgia prophylaxis; aplastic anemia/agranulocytosis, SIADH (hyponatremia), SJS in HLA-B*1502 carriers; CYP inducer",
          "Phenytoin / fosphenytoin — Na channel; second-line in status; gingival hyperplasia, hirsutism, nystagmus/ataxia, fetal hydantoin syndrome; zero-order kinetics",
          "Lamotrigine — Na channel; Stevens-Johnson (titrate slowly, worse with valproate); the preferred agent in pregnancy and for bipolar depression",
        ],
      },
      {
        group: "GABA-A agents",
        items: [
          "Benzodiazepines / lorazepam — raise the FREQUENCY of Cl channel opening; first-line status, alcohol withdrawal, stimulant intoxication; respiratory depression; flumazenil reverses",
          "Barbiturates / phenobarbital — raise the DURATION of Cl channel opening: more efficacious and more dangerous; third-line status; CYP inducer; neonatal seizures",
          "Zolpidem / zaleplon — non-benzodiazepine hypnotics selective for α1 GABA-A receptors; LESS dependence and amnesia than benzos; sleepwalking (boxed warning), falls in the elderly; flumazenil reverses",
          "Vigabatrin — irreversible GABA transaminase inhibitor; infantile spasms (tuberous sclerosis); permanent peripheral visual field loss",
        ],
      },
      {
        group: "Calcium channel & other",
        items: [
          "Ethosuximide — blocks thalamic T-type Ca channels; absence seizures; the one antiepileptic whose mechanism is asked; GI upset, SJS",
          "Gabapentin — α2δ Ca channel; neuropathic pain (diabetic, post-herpetic), restless legs, adjunct for focal seizures; sedation, edema",
          "Levetiracetam — SV2A vesicle protein; broad spectrum, no interactions, safe in pregnancy and liver disease; irritability and mood change",
          "Magnesium — eclampsia treatment and prophylaxis, fetal neuroprotection <32 weeks, torsades, digoxin-induced arrhythmias; lost patellar reflex = toxicity",
        ],
      },
      {
        group: "Pregnancy",
        items: [
          "Neural tube defects — valproate (highest, 1–2%), carbamazepine, phenytoin: all interfere with folate; spina bifida, meningomyelocele",
          "Fetal hydantoin syndrome — phenytoin: nail and distal digit hypoplasia, cleft lip/palate, dysmorphic facies, growth deficiency",
          "Folate / folic acid — 4 mg daily from before conception for any woman on an antiepileptic; switch valproate to lamotrigine or levetiracetam preconception",
        ],
      },
    ],
    pearls:
      "The shelf asks side effects, not doses. Tremor + abnormal LFTs on a mood stabilizer = valproate (lithium causes tremor but not hepatotoxicity). Hyponatremia + low counts = carbamazepine. Rash on a new antiepileptic = stop it (lamotrigine SJS rises when valproate slows its clearance). Never stop an antiepileptic in a pregnant woman — uncontrolled seizures harm the fetus more; use monotherapy at the lowest dose, lamotrigine or levetiracetam preferred, high-dose folate, and give vitamin K at term with enzyme inducers. Ethosuximide is the only antiepileptic whose mechanism is routinely asked; valproate is the alternative for absence with tonic-clonic seizures. Benzos vs barbiturates: frequency vs duration of chloride channel opening — barbiturates have no ceiling, so they kill. Status ladder: lorazepam → fosphenytoin (or levetiracetam/valproate) → phenobarbital/anesthesia.",
    reviewed: REVIEWED,
  },
  {
    id: "pharm-anesthetics-nmj-blockers",
    domain: "pharm",
    name: "Anesthetics & neuromuscular blockers",
    org: PHARM,
    prompt: `30M with a femur fracture is induced with propofol and succinylcholine and maintained on sevoflurane. Fifteen minutes in, his end-tidal CO2 climbs, his jaw is rigid and his temperature is 39.8 °C.\n\nName the inhaled, intravenous, local and neuromuscular-blocking agents a shelf tests — the property, use or toxicity that identifies each — and the physical constants that explain potency and speed of onset.`,
    keyPoints: [
      {
        group: "Inhaled agents & constants",
        items: [
          "MAC / minimum alveolar concentration — dose preventing movement to a noxious stimulus in 50% of patients; LOW MAC = HIGH potency; falls with age",
          "Blood:gas coefficient / blood solubility — LOW blood solubility = fast induction and fast recovery (nitrous, sevoflurane); high = slow (halothane)",
          "Lipid solubility / oil:gas coefficient — HIGH lipid solubility = high potency = low MAC (halothane); waking up = redistribution of drug into adipose",
          "Halothane — the potent, slow-onset classic; halothane hepatitis, malignant hyperthermia, sensitizes the myocardium to catecholamines",
          "Nitrous oxide — fastest on and off (lowest blood:gas), weakest (MAC >100%, never a sole agent); expands air-filled spaces; inactivates B12",
        ],
      },
      {
        group: "Intravenous",
        items: [
          "Propofol — GABA-A potentiation; induction and maintenance (milky emulsion); hypotension, respiratory depression, painful injection, infusion syndrome",
          "Ketamine — NMDA antagonist; dissociative, preserves airway reflexes, RAISES BP and HR (trauma, hypotension, asthma); emergence hallucinations",
          "Midazolam — benzodiazepine adjunct for anxiolysis and anterograde amnesia before procedures; respiratory depression with opioids; flumazenil",
          "Thiopental — barbiturate induction agent, replaced by propofol; ultra-short because it redistributes into fat and muscle; lowers ICP",
        ],
      },
      {
        group: "Local anesthetics",
        items: [
          "Lidocaine — amide, blocks Na channels from inside the neuron; epinephrine prolongs it (classically avoided in fingers, nose, penis, toes); class IB antiarrhythmic; toxicity: perioral numbness, seizure",
          "Bupivacaine — longest duration (epidurals, labor); the most cardiotoxic — refractory arrhythmia, lipid emulsion rescue",
          "Procaine / esters — short duration; esters (one 'i' in the name) hydrolyzed by plasma cholinesterase, PABA allergy; benzocaine → methemoglobinemia",
        ],
      },
      {
        group: "Neuromuscular blockers",
        items: [
          "Succinylcholine — depolarizing nicotinic agonist: fasciculations then paralysis; broken down by plasma cholinesterase; hyperkalemia (burns, denervation), malignant hyperthermia",
          "Rocuronium / vecuronium / tubocurarine — non-depolarizing nicotinic antagonists, no fasciculations; reversed by neostigmine + glycopyrrolate or sugammadex; tubocurarine releases histamine",
          "Dantrolene — blocks the ryanodine receptor so Ca stays in the sarcoplasmic reticulum; malignant hyperthermia (and NMS); stop the trigger, cool, treat hyperkalemia",
        ],
      },
    ],
    pearls:
      "Two constants, two questions: blood:gas answers 'how fast', lipid solubility (oil:gas) answers 'how potent' — they are independent, so halothane is potent AND slow while nitrous is weak AND fast. Emergence from a single IV bolus is redistribution, not metabolism. Malignant hyperthermia: autosomal dominant RYR1 mutation; rising end-tidal CO2 is the earliest sign, then masseter rigidity, tachycardia, fever, rhabdomyolysis and hyperkalemia — dantrolene, and a family history of anesthetic death means avoid succinylcholine and volatile agents. Succinylcholine is contraindicated after 24–72 h in burns, crush, denervation or prolonged immobility (upregulated extrajunctional receptors dump potassium); prolonged paralysis after it = pseudocholinesterase deficiency, just ventilate. Local anesthetics fail in an abscess because the acidic tissue keeps the drug charged. Cocaine is the one local anesthetic that vasoconstricts.",
    reviewed: REVIEWED,
  },
  // ───────────────────────── INDICATION → DRUG ─────────────────────────
  {
    id: "pharm-parkinson-alzheimer-drugs",
    domain: "pharm",
    name: "Parkinson & Alzheimer drugs",
    org: MANAGEMENT,
    prompt: `71M with Parkinson disease on carbidopa-levodopa for 4 years; the dose was increased last month and he now sees children in the garden who are not there. Separately, a 68F with newly diagnosed Alzheimer disease asks what medications exist.\n\nName the Parkinson, Alzheimer and restless-legs drugs a shelf tests — mechanism plus the classic adverse effect or management rule for each.`,
    keyPoints: [
      {
        group: "Dopamine supply",
        items: [
          "Carbidopa-levodopa / levodopa — carbidopa blocks peripheral DOPA decarboxylase so more levodopa crosses the BBB; psychosis after a dose increase = DECREASE the dose, never discontinue",
          "Ropinirole / pramipexole — non-ergot D2 agonists; younger patients and restless legs (after iron repletion); impulse-control disorders, sleep attacks, hallucinations",
          "Bromocriptine / cabergoline — ergot D2 agonists; prolactinoma (cabergoline first-line, bromocriptine when pregnancy is planned); valvular and retroperitoneal fibrosis at Parkinson doses",
          "Amantadine — increases presynaptic dopamine release (and NMDA block); levodopa-induced dyskinesia; livedo reticularis, ankle edema",
        ],
      },
      {
        group: "Enzyme inhibitors",
        items: [
          "Selegiline / rasagiline — MAO-B inhibitors spare dopamine; serotonin syndrome with SSRIs, St John's wort or meperidine; early monotherapy",
          "Entacapone / tolcapone — COMT inhibitors extend levodopa half-life for wearing-off; tolcapone is hepatotoxic; orange urine",
          "Benztropine / trihexyphenidyl — antimuscarinics for tremor-predominant young patients; avoid in the elderly (delirium, retention, glaucoma)",
        ],
      },
      {
        group: "Alzheimer",
        items: [
          "Donepezil — central cholinesterase inhibitor, first-line for mild–moderate disease; bradycardia, syncope, GI upset, vivid dreams",
          "Rivastigmine / galantamine — same class and use; rivastigmine patch also for Parkinson disease dementia and Lewy body dementia",
          "Memantine — NMDA glutamate receptor antagonist (blocks Ca influx); moderate–severe disease, often added to donepezil; well tolerated",
        ],
      },
      {
        group: "Related uses",
        items: [
          "Iron / ferritin — restless legs: check serum iron and ferritin FIRST and replace if ferritin is low; iron deficiency is the most common cause",
          "Gabapentin — α2δ ligands (gabapentin enacarbil, pregabalin) are now first-line for restless legs once iron is replete, ahead of D2 agonists (no augmentation); the NBME may still list only a D2 agonist",
          "Quetiapine / pimavanserin — Parkinson psychosis that persists after lowering levodopa; haloperidol and risperidone worsen parkinsonism",
          "Deep brain stimulation / DBS — subthalamic nucleus or globus pallidus interna for motor fluctuations and dyskinesia refractory to medication; not for dementia or atypical parkinsonism",
        ],
      },
    ],
    pearls:
      "The NBME psychosis vignette: hallucinations after a recent carbidopa-levodopa start or dose increase — answer 'decrease the dose'; 'discontinue' is wrong (withdrawal can precipitate an NMS-like state). Carbidopa is a peripheral decarboxylase inhibitor; entacapone/tolcapone are COMT inhibitors — the exam tries to swap them. Levodopa is the most effective drug but after 5–10 years brings wearing-off and peak-dose dyskinesias, so agonists or MAO-B inhibitors go first in younger patients. Never combine selegiline with an SSRI or meperidine. Cholinesterase inhibitors slow decline modestly and do not change the course; stop them if syncope or bradycardia appears. Avoid anticholinergics, benzodiazepines and first-generation antihistamines in any demented patient. An NBME item links restless legs to later Parkinson disease (shared dopamine biology; the epidemiology is mixed) — and dopamine antagonists, metoclopramide and SSRIs worsen RLS, so review the drug list first.",
    reviewed: REVIEWED,
  },
  {
    id: "pharm-cholinergic-anticholinergic",
    domain: "pharm",
    name: "Cholinergic & anticholinergic agents",
    org: MANAGEMENT,
    prompt: `23M who spent the day spraying an orchard arrives drooling, vomiting, wheezing and bradycardic with pinpoint pupils. Separately, a 17F who ate 'moonflower' seeds at a party is hot, flushed and delirious with dilated pupils and a distended bladder.\n\nName the cholinergic toxidrome and its opposite with the antidote each patient needs, then the muscarinic agonists, cholinesterase inhibitors and antimuscarinics a shelf tests, each by its use.`,
    keyPoints: [
      {
        group: "Toxidromes & antidotes",
        items: [
          "DUMBBELSS / cholinergic toxidrome — Diarrhea, Urination, Miosis, Bradycardia, Bronchospasm, Excitation of muscle (the nicotinic one), Lacrimation, Salivation, Sweating",
          "Anticholinergic toxidrome / hot dry red mad — mydriasis, tachycardia, dry mouth, urinary retention, NO sweating, delirium; TCAs, antihistamines, antipsychotics, Jimson weed",
          "Atropine — first for organophosphates: muscarinic antagonist, titrate to drying of secretions; also symptomatic bradycardia; does not fix the nicotinic weakness",
          "Pralidoxime / 2-PAM — regenerates acetylcholinesterase by removing the phosphate; give early before 'aging', after atropine; reverses the muscle weakness",
          "Physostigmine — antidote for anticholinergic delirium (Jimson weed, atropine, diphenhydramine); crosses the BBB; NOT for TCA overdose (asystole)",
        ],
      },
      {
        group: "Muscarinic agonists",
        items: [
          "Bethanechol — direct M3 agonist on the detrusor; urinary retention, neurogenic (hypocontractile) bladder, postoperative ileus",
          "Pilocarpine / carbachol — constrict the pupil and open the trabecular meshwork; acute angle-closure glaucoma; pilocarpine also for Sjögren dry mouth",
          "Methacholine — bronchoprovocation challenge to diagnose asthma when spirometry is normal (never during an attack)",
        ],
      },
      {
        group: "Cholinesterase inhibitors",
        items: [
          "Pyridostigmine — myasthenia gravis symptomatic treatment; overdose = cholinergic crisis (weakness plus DUMBBELSS)",
          "Edrophonium / Tensilon — short-acting; the historic MG test (marked improvement in MG, little in Lambert-Eaton); now antibodies and EMG",
          "Neostigmine — reverses non-depolarizing neuromuscular blockade at the end of surgery (with glycopyrrolate); does not cross the BBB; Ogilvie syndrome",
        ],
      },
      {
        group: "Antimuscarinics by use & prevention",
        items: [
          "Benztropine / trihexyphenidyl — acute dystonia and drug-induced parkinsonism; diphenhydramine does the same job (the exam lists only one)",
          "Scopolamine — motion-sickness patch; M3 muscarinic antagonism is how it works (not H1 or H2); dry mouth, mydriasis, confusion in the elderly",
          "Oxybutynin / tolterodine — urge incontinence / overactive bladder; avoid in the elderly and narrow-angle glaucoma; mirabegron is the alternative",
          "Ipratropium / tiotropium — inhaled antimuscarinic for COPD, first-line alongside a β2 agonist; negligible systemic absorption",
          "Wear gloves / skin decontamination — organophosphates enter through skin: gloves prevent it ('mask' is the wrong answer); strip and wash the patient",
        ],
      },
    ],
    pearls:
      "On the exam 'cholinergic' means muscarinic 19 times out of 20; the nicotinic piece is muscle excitation then weakness and fasciculations. Organophosphate order: decontaminate, atropine (large repeated doses until secretions dry — pupils are not the endpoint), then pralidoxime; delayed intermediate syndrome and neuropathy can follow. Anticholinergic vs sympathomimetic toxidrome: both are hot, tachycardic and mydriatic — anticholinergic skin is DRY, sympathomimetic skin is sweaty. Anticholinergic drugs in the elderly (diphenhydramine, TCAs, oxybutynin, benztropine) cause delirium and urinary retention: old man with rising creatinine on amitriptyline = obstructive azotemia, stop the drug. Neostigmine and pyridostigmine are quaternary and stay peripheral; physostigmine is tertiary and reaches the brain — which is why only it treats central anticholinergic delirium.",
    reviewed: REVIEWED,
  },
  {
    id: "pharm-symptomatic-neuro-drugs",
    domain: "pharm",
    name: "Symptomatic neuro drugs by indication",
    org: MANAGEMENT,
    prompt: `58F with diabetic neuropathy asks for something for burning feet; a 45M with alcohol use disorder admitted for pancreatitis becomes tremulous and tachycardic on hospital day 2; a 60F with a subarachnoid hemorrhage is on day 4 in the ICU.\n\nName the first-line drug for each neurologic indication a shelf tests — neuropathic pain, spasticity, sleepiness, withdrawal, vasospasm, migraine — including the many uses of propranolol and when a benzodiazepine replaces it.`,
    keyPoints: [
      {
        group: "Neuropathic pain",
        items: [
          "Amitriptyline / TCA — exam first-line for painful diabetic neuropathy (duloxetine, gabapentinoids equal per guidelines); anticholinergic; overdose CCC: coma, convulsions, cardiotoxicity → bicarb",
          "Nortriptyline — the TCA for the ELDERLY (fewer anticholinergic and α1 effects); the 82-year-old failing gabapentin + carbamazepine switches to it",
          "Gabapentin / pregabalin — α2δ Ca channel; post-herpetic neuralgia (acyclovir treats the virus, gabapentin the pain), diabetic neuropathy, restless legs; sedation, edema",
          "Carbamazepine — trigeminal neuralgia prophylaxis (attacks last seconds, nothing to abort); Na channel; SIADH, aplastic anemia",
        ],
      },
      {
        group: "Spasticity, sleep & withdrawal",
        items: [
          "Baclofen — GABA-B agonist for spasticity (MS, cord injury); intrathecal pump; abrupt withdrawal → seizures, hyperthermia; tizanidine (α2) and dantrolene are alternatives",
          "Modafinil — narcolepsy daytime sleepiness first-line; sodium oxybate for cataplexy; scheduled naps",
          "Chlordiazepoxide / lorazepam — alcohol withdrawal and delirium tremens (long-acting benzo; lorazepam if liver disease); thiamine before glucose",
          "Flumazenil — benzodiazepine receptor antagonist for overdose; precipitates seizures in chronic users, so reserve for benzo-naive iatrogenic oversedation",
        ],
      },
      {
        group: "Propranolol uses",
        items: [
          "Essential tremor — propranolol first-line (primidone if asthma or bradycardia); action tremor that improves with alcohol; autosomal dominant family history",
          "Migraine prophylaxis — propranolol (or topiramate, amitriptyline) at ≥4 headache days a month; abortive is NSAID then sumatriptan",
          "Akathisia — propranolol first for antipsychotic-induced restlessness; benzodiazepine second",
          "Performance anxiety / stage fright — propranolol before the event (generalized social anxiety disorder gets an SSRI + CBT); a benzodiazepine instead if the patient has asthma (NBME)",
        ],
      },
      {
        group: "Vascular & other",
        items: [
          "Nimodipine — dihydropyridine CCB started within 96 h of SAH to prevent vasospasm and delayed ischemia (days 4–14); oral for 21 days",
          "Sumatriptan / triptans — 5-HT1B/1D agonists abort migraine and cluster (SC); contraindicated in CAD, Prinzmetal angina, uncontrolled HTN, hemiplegic migraine",
          "Lactulose / rifaximin — hepatic encephalopathy: lactulose traps ammonia as NH4+ in the gut; rifaximin (or neomycin) kills ammonia-producing bacteria",
        ],
      },
    ],
    pearls:
      "Propranolol is the exam's favorite non-neuro drug in neuro: essential tremor, migraine prophylaxis, akathisia, performance anxiety, thyroid storm, lithium tremor — and it is contraindicated in asthma, where a benzodiazepine (anxiety) or primidone (tremor) takes its place. TCAs are first-line for neuropathic pain on paper but nortriptyline is the one to give an elderly patient; gabapentin and duloxetine are the real-world alternatives. Cluster headache: 100% oxygen aborts, verapamil prevents — do not confuse with trigeminal neuralgia (brief, triggered by touch, carbamazepine). Nimodipine improves neurologic outcome after SAH without visibly reducing angiographic spasm. Alcohol withdrawal: symptom-triggered long-acting benzodiazepine; delirium tremens peaks at 48–96 h and kills untreated. Baclofen withdrawal from a failed intrathecal pump mimics sepsis or NMS.",
    reviewed: REVIEWED,
  },
  // ───────────────────────── DRUG-INDUCED EMERGENCIES ─────────────────────────
  {
    id: "pharm-eps-drug-emergencies",
    domain: "pharm",
    name: "EPS & drug-induced neuro emergencies",
    org: EMERGENCIES,
    prompt: `19M given haloperidol in the ED for agitation; 6 hours later his neck is twisted to one side and his eyes are stuck upward. Separately, a 34F on fluoxetine who started selegiline 2 days ago has fever, inducible clonus and diarrhea.\n\nName the antipsychotic movement syndromes by time of onset, the three hyperthermic drug emergencies and how to tell them apart, the treatments, and the non-antipsychotic culprits.`,
    keyPoints: [
      {
        group: "EPS by timing",
        items: [
          "Acute dystonia — hours to days: torticollis, oculogyric crisis, laryngospasm; rigidity WITHOUT fever; benztropine or diphenhydramine IM",
          "Akathisia — days to weeks: inner restlessness, pacing, cannot sit still; mistaken for worsening agitation; propranolol, lower the dose",
          "Parkinsonism / drug-induced parkinsonism — weeks: bradykinesia, rigidity, resting tremor; benztropine (amantadine in the elderly), lower dose or switch to an atypical",
          "Tardive dyskinesia — months to years: choreoathetoid lip smacking, tongue and limb movements, often irreversible; switch to clozapine/quetiapine, valbenazine; anticholinergics worsen it",
        ],
      },
      {
        group: "Hyperthermic emergencies",
        items: [
          "Neuroleptic malignant syndrome / NMS — antipsychotic (or stopping levodopa): fever, LEAD-PIPE rigidity, altered mentation, autonomic lability, CK up; stop the drug, dantrolene or bromocriptine",
          "Malignant hyperthermia — succinylcholine or halothane in a ryanodine receptor mutation: rising end-tidal CO2, masseter rigidity, fever minutes into anesthesia; autosomal dominant",
          "Serotonin syndrome — SSRI + MAOI/selegiline/linezolid/tramadol/St John's wort: hyperreflexia, CLONUS, diarrhea, mydriasis, fever within 24 h; stop, benzodiazepines, cyproheptadine",
        ],
      },
      {
        group: "Treatments",
        items: [
          "Benztropine / diphenhydramine — acute dystonia and drug-induced parkinsonism; antimuscarinic; the exam lists only one of them",
          "Propranolol — akathisia first-line",
          "Dantrolene — ryanodine receptor blocker for malignant hyperthermia and severe NMS; muscle relaxant, no CNS effect",
          "Cyproheptadine — 5-HT2A antagonist for serotonin syndrome that does not settle with benzodiazepines and cooling",
        ],
      },
      {
        group: "Non-antipsychotic culprits",
        items: [
          "Metoclopramide — D2 antagonist antiemetic/prokinetic: every EPS, tardive dyskinesia with chronic use, hyperprolactinemia; limit to 12 weeks",
          "Prochlorperazine / promethazine — phenothiazine antiemetics: acute dystonia and akathisia in the ED migraine or nausea patient; give diphenhydramine with them",
          "Bupropion — lowers the seizure threshold; contraindicated in eating disorders and seizure history; no sexual side effects",
          "Lithium — fine tremor (propranolol); coarse tremor, ataxia, confusion = toxicity from NSAIDs, thiazides, ACE inhibitors, dehydration; dialysis if severe",
        ],
      },
    ],
    pearls:
      "Time since the antipsychotic started is the diagnosis: hours = dystonia, days = akathisia, weeks = parkinsonism, months to years = tardive dyskinesia. Rigidity without fever is dystonia; rigidity WITH fever is NMS. The three hyperthermic syndromes by exam: lead-pipe rigidity and bradyreflexia = NMS (days after a dopamine blocker); hyperreflexia, clonus, mydriasis and diarrhea = serotonin syndrome (hours after a serotonergic combination); rising end-tidal CO2 and masseter spasm in the OR = malignant hyperthermia. Dantrolene works for MH and NMS but not serotonin syndrome, which gets cyproheptadine. Tardive dyskinesia: raising the dose masks it briefly and anticholinergics make it worse — switch to clozapine or quetiapine, or add a VMAT2 inhibitor (valbenazine, deutetrabenazine). Metoclopramide is the most common non-psychiatric cause of tardive dyskinesia; prochlorperazine and promethazine given for migraine cause the ED akathisia that looks like anxiety.",
    reviewed: REVIEWED,
  },
];
