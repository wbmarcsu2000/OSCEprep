#!/usr/bin/env python3
"""Validate generated OB/GYN MCQ batch JSON before it reaches the bank.

The build silently drops malformed items (bad system, wrong option count,
misaligned rationales), so a batch can "succeed" while quietly losing half its
questions. This checks the same invariants loudly, plus the quality rules the
2026-07 review established, and exits non-zero on any hard failure.

Usage:  python3 scripts/validate_ob_batch.py <dir-or-file> [...]
"""
import sys, json, glob, os, re, collections

SYSTEMS = {
    "Prenatal Care & Normal Pregnancy", "Early Pregnancy Complications",
    "Medical Complications of Pregnancy", "Labor & Delivery", "Postpartum",
    "Newborn & Neonatal", "Menstrual Disorders",
    "Reproductive Endocrinology & Infertility", "Contraception", "Menopause",
    "Benign Gynecology", "Gynecologic Oncology", "Breast Disorders",
    "Gynecologic Infections & STIs", "Cervical Dysplasia & Screening",
    "Sexual Health & Assault", "Pharmacology", "Ethics & Social Sciences",
}
BANNED_OPTION = re.compile(r"\ball of the above\b|\bnone of the above\b|\bboth a and b\b", re.I)


def norm(s):
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", s.lower())).strip()


def check(item, where, hard, soft):
    def bad(msg):
        hard.append(f"{where}: {msg}")

    def warn(msg):
        soft.append(f"{where}: {msg}")

    system = item.get("system")
    if system not in SYSTEMS:
        bad(f"system {system!r} is not one of the 18 domains — the build would DROP this question")
    opts = item.get("options")
    if not isinstance(opts, list) or len(opts) != 5:
        bad(f"expected 5 options, got {len(opts) if isinstance(opts, list) else type(opts).__name__}")
        return
    if len(set(opts)) != len(opts):
        bad("duplicate option text")
    for o in opts:
        if not isinstance(o, str) or not o.strip():
            bad("empty option")
        elif BANNED_OPTION.search(o):
            bad(f"banned option form: {o!r}")
    ai = item.get("answerIndex")
    if not isinstance(ai, int) or not (0 <= ai < len(opts)):
        bad(f"answerIndex {ai!r} out of range")
    rats = item.get("optionRationales")
    if rats is None:
        warn("no optionRationales (allowed, but every existing question has them)")
    elif not isinstance(rats, list) or len(rats) != len(opts):
        bad(f"optionRationales has {len(rats) if isinstance(rats, list) else '?'} entries for {len(opts)} options "
            f"— the build would SILENTLY DISCARD all rationales for this question")
    else:
        for i, r in enumerate(rats):
            if not isinstance(r, str) or len(r.strip()) < 35:
                warn(f"rationale {i} is thin ({len(r.strip()) if isinstance(r, str) else 0} chars)")
    stem = item.get("stem", "")
    if len(stem) < 20:
        bad("stem too short — the build would drop this question")
    elif len(stem) < 120 and system != "Pharmacology":
        # Pharmacology is deliberately a terse drug-fact set, not vignettes.
        warn(f"stem is {len(stem)} chars; the bank median is 258 — is this a vignette?")
    if len(item.get("explanation", "")) < 15:
        bad("explanation too short — the build would drop this question")
    if len(item.get("topic", "")) < 2:
        bad("topic too short — the build would drop this question")
    concept = item.get("concept")
    if not concept:
        warn("no concept (every existing question has one)")
    else:
        import difflib
        if difflib.SequenceMatcher(None, norm(stem), norm(concept)).ratio() > 0.42:
            warn("concept closely restates the stem instead of generalising")
    # the answer should not be sitting in the stem
    key = item.get("options", [""])[ai] if isinstance(ai, int) and 0 <= ai < len(opts) else ""
    kt = [w for w in norm(key).split() if len(w) > 7]
    if kt and sum(1 for w in kt if w in norm(stem)) == len(kt):
        warn("every distinctive word of the keyed answer already appears in the stem — possible giveaway")


def main(argv):
    paths = []
    for a in argv:
        paths.extend(sorted(glob.glob(f"{a}/*.json"))) if os.path.isdir(a) else paths.append(a)
    if not paths:
        print("no files"); return 1
    hard, soft, total = [], [], 0
    seen_stem, dup = {}, []
    same_key = collections.defaultdict(list)
    for p in paths:
        try:
            data = json.load(open(p))
        except Exception as e:
            hard.append(f"{p}: unreadable JSON — {e}"); continue
        if isinstance(data, dict):
            data = data.get("questions", data.get("items", []))
        if not isinstance(data, list):
            hard.append(f"{p}: not a JSON array"); continue
        for i, item in enumerate(data):
            total += 1
            where = f"{os.path.basename(p)}[{i}] {str(item.get('topic'))[:40]!r}"
            check(item, where, hard, soft)
            ns = norm(item.get("stem", ""))
            if ns in seen_stem:
                dup.append(f"{where} duplicates {seen_stem[ns]}")
            else:
                seen_stem[ns] = where
            ai = item.get("answerIndex")
            o = item.get("options")
            if isinstance(o, list) and isinstance(ai, int) and 0 <= ai < len(o):
                same_key[norm(o[ai])].append(where)

    print(f"checked {total} questions across {len(paths)} file(s)")
    for d in dup:
        hard.append(d)
    # Same keyed answer is the duplicate signal string matching misses (see the
    # 2026-07 review: real duplicates had stem similarity as low as 0.16).
    for k, v in same_key.items():
        if len(v) > 1:
            soft.append(f"same keyed answer {k[:60]!r} in: {', '.join(v)}")
    if soft:
        print(f"\n{len(soft)} warning(s):")
        for s in soft:
            print(f"  ! {s}")
    if hard:
        print(f"\n{len(hard)} ERROR(s):")
        for h in hard:
            print(f"  x {h}")
        return 1
    print("\nall hard checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
