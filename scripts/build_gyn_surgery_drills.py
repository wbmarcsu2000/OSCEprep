#!/usr/bin/env python3
"""Assemble src/data/obGynSurgeryDrills.ts from the verified per-batch JSON.

Refuses to emit on a violation, because both rules it enforces fail SILENTLY at
runtime rather than loudly:

  * The caps (<=4 groups, <=4 items/group, <=7 items) — coverage is named/total,
    so an over-long key is unmasterable and defeats the point of a short-answer
    drill.
  * The item rule — the grader credits an item when the ITEM's tokens appear in
    the student's answer, so a long or abbreviated item silently gives a correct
    student zero credit. Items must be the minimal distinctive phrase, spelled
    out, at most 4 significant words.

Usage:  python3 scripts/build_gyn_surgery_drills.py <verified-dir>
"""
import sys, json, glob, os, re, datetime

TS_PATH = "/Users/williamsaccount/osce-simulator/src/data/obGynSurgeryDrills.ts"
DOMAIN = "gyn-surgery"
DIMENSIONS = {"indications", "complications", "anatomy", "periop"}
DIMENSION_SUFFIX = {
    "indications": "indications",
    "complications": "complications",
    "anatomy": "anatomy",
    "periop": "periop",
}
MAX_GROUPS, MAX_ITEMS_PER_GROUP, MAX_ITEMS, MAX_ITEM_WORDS = 4, 4, 7, 4

# Words that carry no matching weight, so they do not count toward the word cap.
FILLER = {
    "a", "an", "the", "of", "in", "at", "to", "for", "and", "or", "with", "on",
    "by", "from", "into", "vs", "versus", "no", "not",
}
# Item text that is too generic to distinguish one answer from another.
TOO_GENERIC = {
    "bleeding", "infection", "pain", "injury", "complication", "risk", "surgery",
    "observation", "imaging", "antibiotics", "counselling", "counseling",
}


def significant(item):
    return [w for w in re.findall(r"[a-z0-9']+", item.lower()) if w not in FILLER]


def slug(s):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")


def main(argv):
    if not argv:
        print(__doc__)
        return 1
    drills, errors = [], []
    for f in sorted(glob.glob(f"{argv[0]}/*.json")):
        try:
            data = json.load(open(f))
        except Exception as e:
            errors.append(f"{os.path.basename(f)}: unreadable JSON — {e}")
            continue
        if isinstance(data, dict):
            data = data.get("drills", data.get("items", []))
        for i, d in enumerate(data):
            where = f"{os.path.basename(f)}[{i}] {str(d.get('name'))[:40]!r}"
            if d.get("dimension") not in DIMENSIONS:
                errors.append(f"{where}: dimension {d.get('dimension')!r} is not one of {sorted(DIMENSIONS)}")
            for field in ("operation", "name", "org", "prompt"):
                if not str(d.get(field, "")).strip():
                    errors.append(f"{where}: missing {field}")
            kp = d.get("keyPoints") or []
            if not (1 <= len(kp) <= MAX_GROUPS):
                errors.append(f"{where}: {len(kp)} groups (max {MAX_GROUPS})")
            total, seen = 0, set()
            for g in kp:
                items = g.get("items") or []
                if not items:
                    errors.append(f"{where}: group {g.get('group')!r} has no items")
                if len(items) > MAX_ITEMS_PER_GROUP:
                    errors.append(f"{where}: group {g.get('group')!r} has {len(items)} items (max {MAX_ITEMS_PER_GROUP})")
                for s in items:
                    total += 1
                    words = significant(s)
                    if len(words) > MAX_ITEM_WORDS:
                        errors.append(
                            f"{where}: item has {len(words)} significant words (max {MAX_ITEM_WORDS}) — "
                            f"a long item silently denies credit: {s!r}"
                        )
                    if not words:
                        errors.append(f"{where}: empty item")
                    if len(words) == 1 and words[0] in TOO_GENERIC:
                        errors.append(f"{where}: item {s!r} is too generic to distinguish an answer")
                    # An all-caps token of 2-4 letters is almost certainly an abbreviation.
                    for tok in re.findall(r"\b[A-Z]{2,4}\b", s):
                        errors.append(
                            f"{where}: item {s!r} contains the abbreviation {tok!r} — spell it out, or a "
                            f"student who writes it in full gets no credit"
                        )
                    key = " ".join(sorted(words))
                    if key in seen:
                        errors.append(f"{where}: two items reduce to the same words — {s!r}")
                    seen.add(key)
            if total > MAX_ITEMS:
                errors.append(f"{where}: {total} items (max {MAX_ITEMS}) — the point is a short answer")
            drills.append(d)

    if errors:
        print(f"{len(errors)} error(s); nothing written:")
        for e in errors:
            print(f"  x {e}")
        return 1

    # Stable ids: operation slug + dimension. Adding a drill never renumbers another.
    out, seen_ids = [], set()
    today = datetime.date.today().isoformat()
    for d in sorted(drills, key=lambda d: (d["operation"].lower(), d["dimension"])):
        qid = f"gyns-{slug(d['operation'])}-{DIMENSION_SUFFIX[d['dimension']]}"
        if qid in seen_ids:
            print(f"  x duplicate id {qid} — two drills for the same operation+dimension")
            return 1
        seen_ids.add(qid)
        rec = {
            "id": qid,
            "domain": DOMAIN,
            "name": d["name"].strip(),
            "org": d["org"].strip(),
            "prompt": d["prompt"].strip(),
            "keyPoints": [
                {"group": g["group"].strip(), "items": [i.strip() for i in g["items"]]}
                for g in d["keyPoints"]
            ],
            "reviewed": today,
        }
        if d.get("pearls"):
            rec["pearls"] = d["pearls"].strip()
        out.append(rec)

    header = '''// src/data/obGynSurgeryDrills.ts
/**
 * Benign gynaecologic surgery drills — the short-answer domain of the OB/GYN
 * drill bank.
 *
 * Deliberately a different shape from the guideline drills alongside them: 5-7
 * items of 2-4 words rather than 12-15 full sentences, so a whole drill is
 * answerable in about a dozen words. Each operation is split across up to four
 * dimensions (indications & route / complications / anatomy & steps / peri-op)
 * instead of one long drill.
 *
 * ITEM RULE — the coverage matcher credits an item when the ITEM's tokens appear
 * in the student's answer, so item wording decides whether a correct answer
 * scores. Items are the minimal distinctive phrase, spelled out, never
 * abbreviated: "Bile duct injury" is credited when a student writes it in full,
 * "CBD injury" is not. Enforced by scripts/build_gyn_surgery_drills.py.
 *
 * GENERATED FILE — re-run the build rather than hand-editing.
 * Design: docs/superpowers/specs/2026-07-27-benign-gyn-surgery-drills-design.md
 * Educational use only; confirm current practice before acting clinically.
 */
import type { GuidelineDrill } from "./guidelineDrillBank";

export const OB_GYN_SURGERY_DRILLS: GuidelineDrill[] = '''
    ts = header + json.dumps(out, indent=2, ensure_ascii=False) + ";\n"
    open(TS_PATH, "w").write(ts)

    items = sum(len(g["items"]) for d in out for g in d["keyPoints"])
    ops = {}
    for d in out:
        ops[d["id"].rsplit("-", 1)[0]] = ops.get(d["id"].rsplit("-", 1)[0], 0) + 1
    print(f"wrote {TS_PATH}")
    print(f"  {len(out)} drills, {items} items (mean {items/len(out):.1f}/drill)")
    print(f"  {len(ops)} operations:")
    for k, v in sorted(ops.items()):
        print(f"    {v}  {k}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
