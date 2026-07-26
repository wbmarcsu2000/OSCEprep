#!/usr/bin/env python3
# ARCHIVED COPY, kept in the repo because RETIRED_IDS below is load-bearing: a
# rebuild without it silently reintroduces the 20 questions retired as redundant
# in the 2026-07-25 review. The per-batch source JSON this reads still lives in
# the generation workspace referenced by OBWORK; if that workspace is gone, this
# file is the record of what the build did and why, and src/data/obgynMcq.ts is
# the source of truth.
"""Assemble the OB/GYN MCQ bank from the generation workflow's per-batch JSON.

Teaching fields (optionRationales/concept/conceptRule/scoreComponents/
discriminator/mnemonic) are produced INLINE by the generator, so the seeded
option-shuffle permutes options AND optionRationales together to keep them
aligned. Steps: load ob_gen_out/*.json -> HTML-unescape -> validate -> dedup
WITHIN the OB bank -> assign ids -> stem-seeded deterministic shuffle -> emit
src/data/obgynMcq.ts.
"""
import glob, json, html, re, hashlib, random, os

OBWORK = "/Users/williamsaccount/.claude/jobs/8fb33999/tmp/ob_work"
# (generation dir, verified dir) pairs; the verified file for a batch is preferred when present.
DIR_PAIRS = [
    (f"{OBWORK}/ob_gen_out", f"{OBWORK}/ob_verified_out"),          # main 14 domains
    (f"{OBWORK}/ob_pharm_out", f"{OBWORK}/ob_pharm_verified_out"),  # Pharmacology domain
    (f"{OBWORK}/ob_gap_out", f"{OBWORK}/ob_gap_verified_out"),      # blueprint gap-fill (+ 3 domains)
]
TS_PATH = "/Users/williamsaccount/osce-simulator/src/data/obgynMcq.ts"

SYSTEM_ORDER = [
    "Prenatal Care & Normal Pregnancy",
    "Early Pregnancy Complications",
    "Medical Complications of Pregnancy",
    "Labor & Delivery",
    "Postpartum",
    "Newborn & Neonatal",
    "Menstrual Disorders",
    "Reproductive Endocrinology & Infertility",
    "Contraception",
    "Menopause",
    "Benign Gynecology",
    "Gynecologic Oncology",
    "Breast Disorders",
    "Gynecologic Infections & STIs",
    "Cervical Dysplasia & Screening",
    "Sexual Health & Assault",
    "Pharmacology",
    "Ethics & Social Sciences",
]
SYS_SET = set(SYSTEM_ORDER)

# Questions retired as redundant in the 2026-07-25 bank review: each tests the
# same point, with the same keyed action, as a question that survives. Listed by
# id rather than deleted from the source batches so the removal is reversible and
# auditable. See docs/obgyn-qbank-review.md for the kept/dropped pairing.
RETIRED_IDS = {
    "ob-pharmacology-9",                            # = ob-contraception-3 (COC: age>35 + smoking)
    "ob-pharmacology-6",                            # = ob-postpartum-30 (carboprost in asthma)
    "ob-labor-delivery-22",                         # = ob-medical-complications-of-pregnancy-25 (Mg toxicity -> Ca gluconate)
    "ob-prenatal-care-normal-pregnancy-6",          # = ob-early-pregnancy-complications-6 (discriminatory zone)
    "ob-early-pregnancy-complications-7",           # = ob-early-pregnancy-complications-6 (discriminatory zone)
    "ob-menstrual-disorders-28",                    # = ob-menopause-15 (premature ovarian insufficiency)
    "ob-menstrual-disorders-5",                     # = ob-menopause-1 (autoimmune oophoritis)
    "ob-pharmacology-45",                           # = ob-prenatal-care-normal-pregnancy-47 (RhoGAM at 28 wk)
    "ob-early-pregnancy-complications-21",          # = ob-early-pregnancy-complications-20 (missed abortion)
    "ob-labor-delivery-3",                          # = ob-labor-delivery-4 (active-phase arrest -> cesarean)
    "ob-labor-delivery-24",                         # = ob-newborn-neonatal-21 (meconium aspiration)
    "ob-labor-delivery-26",                         # = ob-newborn-neonatal-11 (Erb palsy, C5-C6)
    "ob-pharmacology-40",                           # = ob-labor-delivery-29 (oxytocin tachysystole)
    "ob-postpartum-12",                             # = ob-postpartum-11 (mastitis -> dicloxacillin)
    "ob-postpartum-23",                             # = ob-postpartum-22 (septic pelvic thrombophlebitis)
    "ob-reproductive-endocrinology-infertility-3",  # = ob-pharmacology-7 (clomiphene mechanism)
    "ob-pharmacology-16",                           # = ob-contraception-9 (copper IUD as EC)
    "ob-pharmacology-15",                           # = ob-contraception-7 (DMPA bone density)
    "ob-pharmacology-43",                           # = ob-contraception-19 (POP while breastfeeding)
    "ob-gynecologic-oncology-6",                    # = ob-menstrual-disorders-20 (cyclic progestin)
}


def slug(s):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")


def unescape(x):
    if isinstance(x, str):
        return html.unescape(x).strip()
    if isinstance(x, list):
        return [unescape(v) for v in x]
    return x


def norm_stem(s):
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", s.lower())).strip()


def tokens(s):
    return set(norm_stem(s).split())


def jaccard(a, b):
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def seeded_perm(n, stem):
    seed = int(hashlib.sha256(stem.encode("utf-8")).hexdigest(), 16) % (2 ** 32)
    idx = list(range(n))
    random.Random(seed).shuffle(idx)
    return idx


def clean_list(v):
    if isinstance(v, list):
        out = [unescape(x) for x in v if isinstance(x, str) and x.strip()]
        return out or None
    return None


def main():
    # Prefer the verified version of each batch; fall back to raw generation.
    files, used_verified = [], 0
    for gen_dir, ver_dir in DIR_PAIRS:
        for gf in sorted(glob.glob(f"{gen_dir}/*.json")):
            vf = f"{ver_dir}/{os.path.basename(gf)}"
            if os.path.exists(vf):
                files.append(vf); used_verified += 1
            else:
                files.append(gf)
    raw, bad_files = [], []
    for fp in files:
        try:
            data = json.load(open(fp))
            if isinstance(data, dict) and "questions" in data:
                data = data["questions"]
            if not isinstance(data, list):
                bad_files.append((fp, "not a list")); continue
            raw.extend(data)
        except Exception as e:
            bad_files.append((fp, str(e)))

    valid, dropped_invalid = [], 0
    for q in raw:
        try:
            system = unescape(q.get("system", ""))
            topic = unescape(q.get("topic", ""))
            stem = unescape(q.get("stem", ""))
            options = [o for o in unescape(q.get("options", [])) if o]
            ai = q.get("answerIndex")
            explanation = unescape(q.get("explanation", ""))
            if system not in SYS_SET: dropped_invalid += 1; continue
            if not (4 <= len(options) <= 5): dropped_invalid += 1; continue
            if len(set(options)) != len(options): dropped_invalid += 1; continue  # dup options
            if not isinstance(ai, int) or not (0 <= ai < len(options)): dropped_invalid += 1; continue
            if len(stem) < 20 or len(explanation) < 15 or len(topic) < 2: dropped_invalid += 1; continue
            correct_text = options[ai]

            # teaching fields (inline)
            orat = q.get("optionRationales")
            if isinstance(orat, list) and len(orat) == len(options) and all(
                isinstance(x, str) and x.strip() for x in orat
            ):
                orat = [unescape(x) for x in orat]
            else:
                orat = None  # drop misaligned rationales; keep the question

            item = {
                "system": system, "topic": topic, "stem": stem,
                "options": options, "answerIndex": ai, "correct_text": correct_text,
                "explanation": explanation, "optionRationales": orat,
                "concept": unescape(q["concept"]) if q.get("concept") and str(q["concept"]).strip() else None,
                "conceptRule": clean_list(q.get("conceptRule")),
                "scoreComponents": clean_list(q.get("scoreComponents")),
                "discriminator": unescape(q["discriminator"]) if q.get("discriminator") and str(q["discriminator"]).strip() else None,
                "mnemonic": unescape(q["mnemonic"]) if q.get("mnemonic") and str(q["mnemonic"]).strip() else None,
            }
            valid.append(item)
        except Exception:
            dropped_invalid += 1

    # dedup within OB bank (per system): exact stem, near-dup Jaccard>=0.82,
    # same-topic + same-answer.
    kept, dropped_dup = [], 0
    by_sys_tokens = {s: [] for s in SYSTEM_ORDER}
    seen_norm, seen_topic_ans = set(), set()
    for q in valid:
        ns = q["system"] + "||" + norm_stem(q["stem"])
        if ns in seen_norm: dropped_dup += 1; continue
        ta = q["system"] + "||" + norm_stem(q["topic"]) + "||" + norm_stem(q["correct_text"])
        if ta in seen_topic_ans: dropped_dup += 1; continue
        tk = tokens(q["stem"]); dup = False
        for prev in by_sys_tokens[q["system"]]:
            if jaccard(tk, prev) >= 0.82: dup = True; break
        if dup: dropped_dup += 1; continue
        seen_norm.add(ns); seen_topic_ans.add(ta); by_sys_tokens[q["system"]].append(tk)
        kept.append(q)

    kept.sort(key=lambda q: (SYSTEM_ORDER.index(q["system"]), q["topic"].lower()))
    out, counters, retired = [], {}, 0
    key_dist = {c: 0 for c in "ABCDE"}
    tf = {"optionRationales": 0, "concept": 0, "conceptRule": 0, "scoreComponents": 0, "discriminator": 0, "mnemonic": 0}
    for q in kept:
        s = slug(q["system"]); counters[s] = counters.get(s, 0) + 1
        # Retirement happens AFTER the counter increments, on purpose: ids are
        # sequential per domain, so dropping a question earlier in the pipeline
        # would renumber every later question in that domain — and the app keys
        # per-question progress (osce.obmcq.v1) by id, so students' seen/mastered
        # /missed pools would silently reattach to the wrong questions. Skipping
        # here leaves every surviving id byte-identical to the previous build.
        if f"ob-{s}-{counters[s]}" in RETIRED_IDS:
            retired += 1
            continue
        perm = seeded_perm(len(q["options"]), q["stem"])
        opts = [q["options"][i] for i in perm]
        ai = perm.index(q["answerIndex"])
        key_dist["ABCDE"[ai]] += 1
        rec = {
            "id": f"ob-{s}-{counters[s]}",
            "system": q["system"], "topic": q["topic"], "stem": q["stem"],
            "options": opts, "answerIndex": ai, "explanation": q["explanation"],
        }
        if q["optionRationales"]:
            rec["optionRationales"] = [q["optionRationales"][i] for i in perm]; tf["optionRationales"] += 1
        if q["concept"]: rec["concept"] = q["concept"]; tf["concept"] += 1
        if q["conceptRule"]: rec["conceptRule"] = q["conceptRule"]; tf["conceptRule"] += 1
        if q["scoreComponents"]: rec["scoreComponents"] = q["scoreComponents"]; tf["scoreComponents"] += 1
        if q["discriminator"]: rec["discriminator"] = q["discriminator"]; tf["discriminator"] += 1
        if q["mnemonic"]: rec["mnemonic"] = q["mnemonic"]; tf["mnemonic"] += 1
        out.append(rec)

    per_sys = {}
    for q in out:
        per_sys[q["system"]] = per_sys.get(q["system"], 0) + 1

    header = '''/**
 * OB/GYN shelf MCQ bank — single-best-answer questions built from two
 * high-yield OB/GYN shelf reviews (Annabel Ricci HY OB/GYN + MehlmanMedical HY
 * OBGYN), then adversarially fact-checked. Concepts are de-duplicated WITHIN
 * this bank; overlap with the Internal Medicine and Family Medicine banks is
 * expected and intentional. Grouped by OB/GYN domain for cramming.
 *
 * Style matches the IM/FM banks: quick, to-the-point single-best-answer
 * vignettes with teaching-mode explanations (per-option rationales + concept
 * blocks). Options are pre-shuffled (stem-seeded, deterministic) so the key
 * distributes across A-E and stays stable across rebuilds; the screen reshuffles
 * at runtime and carries each option's rationale with it.
 *
 * GENERATED FILE (JSON -> TS build). Do not hand-edit; re-run the build.
 * See docs/superpowers/specs/2026-07-07-obgyn-qbank-design.md.
 *
 * Educational use only — confirm dosing and current guidelines.
 */

import type { McqQuestion } from "./shelfMcq";

export type { McqQuestion };

/** Canonical OB/GYN system display order (drives the filter + grouping). */
export const OB_MCQ_SYSTEM_ORDER = [
'''
    for s in SYSTEM_ORDER:
        header += f'  {json.dumps(s)},\n'
    header += '''] as const;

export const OB_MCQS: McqQuestion[] = '''
    body = json.dumps(out, indent=2, ensure_ascii=False)
    footer = ''';

/** Systems that actually have at least one question (drives the filter list). */
export const OB_MCQ_SYSTEMS: string[] = OB_MCQ_SYSTEM_ORDER.filter((s) =>
  OB_MCQS.some((q) => q.system === s),
);
'''
    open(TS_PATH, "w").write(header + body + footer)

    print(f"batch files read: {len(files)}  (verified: {used_verified}, bad: {len(bad_files)})")
    for fp, err in bad_files:
        print(f"  BAD {os.path.basename(fp)}: {err}")
    print(f"raw questions: {len(raw)}")
    print(f"dropped invalid: {dropped_invalid}")
    print(f"retired as redundant: {retired}")
    print(f"dropped within-OB duplicates: {dropped_dup}")
    print(f"FINAL questions: {len(out)}")
    print(f"teaching fields: {tf}")
    print(f"key distribution: {key_dist}")
    print("per-system:")
    for s in SYSTEM_ORDER:
        print(f"  {s:42s} {per_sys.get(s,0)}")
    missing = [s for s in SYSTEM_ORDER if per_sys.get(s, 0) == 0]
    if missing:
        print("WARNING systems with 0 questions:", missing)
    print(f"wrote {TS_PATH}")


if __name__ == "__main__":
    main()
