#!/usr/bin/env python3
"""Keep question ids stable when a question's STEM is edited.

Ids in src/data/obgynMcqIds.json are keyed by a hash of the normalised stem, so
editing a stem would otherwise mint a fresh id — and students' saved progress
(localStorage osce.obmcq.v1) is keyed by id, so that silently orphans everything
recorded against that question.

This remaps: for each question in the source batches whose stem hash is NOT in
the ledger, look for a ledger entry with the same (system, topic) whose stem hash
no longer appears anywhere in the source. A 1:1 match means "same question, edited
stem", so the new hash inherits the old id. Anything ambiguous is left alone and
reported, so a genuinely new question still gets a new id.

Run AFTER editing source batches and BEFORE build_ob_mcq.py.
Usage:  python3 scripts/ob_remap_ids.py [--apply]
"""
import json, glob, os, re, sys, hashlib, collections

OBWORK = "/Users/williamsaccount/.claude/jobs/8fb33999/tmp/ob_work"
LEDGER = "/Users/williamsaccount/osce-simulator/src/data/obgynMcqIds.json"
DIR_PAIRS = [
    ("ob_gen_out", "ob_verified_out"),
    ("ob_pharm_out", "ob_pharm_verified_out"),
    ("ob_gap_out", "ob_gap_verified_out"),
    ("ob_gap2_out", "ob_gap2_verified_out"),
]


def norm_stem(s):
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", s.lower())).strip()


def stem_hash(s):
    return hashlib.sha256(norm_stem(s).encode("utf-8")).hexdigest()[:16]


def load_source():
    """Mirror the build's file preference: verified batch wins over raw."""
    out = []
    for gen, ver in DIR_PAIRS:
        for gf in sorted(glob.glob(f"{OBWORK}/{gen}/*.json")):
            vf = f"{OBWORK}/{ver}/{os.path.basename(gf)}"
            path = vf if os.path.exists(vf) else gf
            try:
                data = json.load(open(path))
            except Exception as e:
                print(f"  ! unreadable {path}: {e}")
                continue
            if isinstance(data, dict):
                data = data.get("questions", data.get("items", []))
            for item in data or []:
                if isinstance(item, dict) and item.get("stem"):
                    out.append(item)
    return out


def main(apply):
    doc = json.load(open(LEDGER))
    ledger = dict(doc["ids"])
    src = load_source()
    src_hashes = {stem_hash(q["stem"]) for q in src}

    # ledger entries whose stem no longer exists in source = candidates for "edited"
    orphan_by_key = collections.defaultdict(list)
    id_to_hash = {v: k for k, v in ledger.items()}
    # we need (system, topic) for orphaned ledger ids; recover it from the built bank
    built = {}
    ts = "/Users/williamsaccount/osce-simulator/src/data/obgynMcq.ts"
    # The emitted TS uses quoted keys ("id": ...), so allow either form.
    rec = re.compile(
        r'"?id"?:\s*"([^"]+)",\s*\n\s*"?system"?:\s*"([^"]+)",\s*\n\s*"?topic"?:\s*"((?:[^"\\]|\\.)*)"'
    )
    for m in rec.finditer(open(ts).read()):
        built[m.group(1)] = (m.group(2), m.group(3).replace('\\"', '"'))
    if not built:
        print("  ! could not parse id/system/topic out of the built TS — remap cannot match")
    for h, qid in ledger.items():
        if h in src_hashes:
            continue
        key = built.get(qid)
        if key:
            orphan_by_key[key].append((h, qid))

    # source questions with no ledger id = candidates for "new or edited"
    unmatched = [q for q in src if stem_hash(q["stem"]) not in ledger]
    by_key = collections.defaultdict(list)
    for q in unmatched:
        by_key[(q["system"], q["topic"])].append(q)

    remaps, ambiguous, genuinely_new = [], [], []
    for key, qlist in by_key.items():
        cands = orphan_by_key.get(key, [])
        if len(qlist) == 1 and len(cands) == 1:
            remaps.append((stem_hash(qlist[0]["stem"]), cands[0][1], key))
        elif cands:
            ambiguous.append((key, len(qlist), len(cands)))
        else:
            genuinely_new.append(key)

    print(f"source questions: {len(src)}   ledger entries: {len(ledger)}")
    print(f"stem-edited, remappable 1:1 : {len(remaps)}")
    for h, qid, key in remaps:
        print(f"    {qid}  <- edited stem   [{key[1][:60]}]")
    print(f"ambiguous (left alone)      : {len(ambiguous)}")
    for key, a, b in ambiguous:
        print(f"    {key[0]} / {key[1][:50]}  ({a} unmatched vs {b} orphaned)")
    print(f"genuinely new (will mint id): {len(genuinely_new)}")
    for key in genuinely_new[:20]:
        print(f"    {key[0]} / {key[1][:60]}")

    if not apply:
        print("\ndry run — pass --apply to write the ledger")
        return 0
    for h, qid, _ in remaps:
        ledger[h] = qid
    doc["ids"] = dict(sorted(ledger.items(), key=lambda kv: kv[1]))
    json.dump(doc, open(LEDGER, "w"), indent=1)
    print(f"\nwrote {LEDGER}: {len(remaps)} id(s) remapped to their edited stems")
    return 0


if __name__ == "__main__":
    sys.exit(main("--apply" in sys.argv))
