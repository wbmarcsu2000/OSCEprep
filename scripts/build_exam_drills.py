#!/usr/bin/env python3
"""Assemble src/data/examDrills.ts from the verified per-batch JSON.

Enforces the density cap before emitting, because an over-long answer key makes a
coverage drill unmasterable (coverage is named / total) and turns its reveal into
a wall of text. Also checks that every `group` is a real exam system, so the drill
vocabulary stays aligned with the encounter's maneuver catalog.

Ids are `exam-<category-slug>-<n>`, assigned in category order then batch order,
and they are the progress key — appending a drill to the END of a category is
safe, inserting one in the middle renumbers the rest.

Usage:  python3 scripts/build_exam_drills.py <verified-dir>
"""
import sys, json, glob, os, re

TS_PATH = "/Users/williamsaccount/osce-simulator/src/data/examDrills.ts"
MANEUVERS = "/Users/williamsaccount/osce-simulator/src/engine/maneuvers.ts"
CATEGORY_ORDER = [
    "Abdominal Pain", "Abnormal Liver Enzymes", "Altered Mental Status", "Anemia",
    "Chest Pain", "Diarrhea", "Dyspnea", "Fever", "Syncope",
]
MAX_GROUPS, MAX_ITEMS_PER_GROUP, MAX_ITEMS, MAX_ITEM_CHARS = 4, 4, 15, 80


def slug(s):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")


def exam_systems():
    src = open(MANEUVERS).read()
    block = src.split("EXAM_SYSTEMS = [")[1].split("]")[0]
    return set(re.findall(r'"([^"]+)"', block))


def main(argv):
    if not argv:
        print(__doc__)
        return 1
    systems = exam_systems()
    drills, errors = [], []
    for f in sorted(glob.glob(f"{argv[0]}/*.json")):
        data = json.load(open(f))
        for i, d in enumerate(data):
            where = f"{os.path.basename(f)}[{i}]"
            if d.get("category") not in CATEGORY_ORDER:
                errors.append(f"{where}: unknown category {d.get('category')!r}")
            kp = d.get("keyPoints") or []
            if not (1 <= len(kp) <= MAX_GROUPS):
                errors.append(f"{where}: {len(kp)} groups (max {MAX_GROUPS})")
            total = 0
            for g in kp:
                if g.get("group") not in systems:
                    errors.append(f"{where}: group {g.get('group')!r} is not an EXAM_SYSTEM")
                items = g.get("items") or []
                if not items:
                    errors.append(f"{where}: group {g.get('group')!r} has no items")
                if len(items) > MAX_ITEMS_PER_GROUP:
                    errors.append(f"{where}: group {g.get('group')!r} has {len(items)} items (max {MAX_ITEMS_PER_GROUP})")
                for s in items:
                    total += 1
                    if len(s) > MAX_ITEM_CHARS:
                        errors.append(f"{where}: item is {len(s)} chars (max {MAX_ITEM_CHARS}) — {s[:50]}")
            if total > MAX_ITEMS:
                errors.append(f"{where}: {total} items (max {MAX_ITEMS}) — an over-long key is unmasterable")
            if len(d.get("vignette", "")) < 40:
                errors.append(f"{where}: vignette too short")
            drills.append(d)

    if errors:
        print(f"{len(errors)} error(s); nothing written:")
        for e in errors:
            print(f"  x {e}")
        return 1

    drills.sort(key=lambda d: CATEGORY_ORDER.index(d["category"]))
    counters, out = {}, []
    for d in drills:
        s = slug(d["category"])
        counters[s] = counters.get(s, 0) + 1
        rec = {
            "id": f"exam-{s}-{counters[s]}",
            "category": d["category"],
            "vignette": d["vignette"].strip(),
            "keyPoints": [{"group": g["group"], "items": [i.strip() for i in g["items"]]} for g in d["keyPoints"]],
        }
        if d.get("pearls"):
            rec["pearls"] = d["pearls"].strip()
        out.append(rec)

    header = open(TS_PATH).read().split("export const EXAM_DRILLS")[0]
    body = json.dumps(out, indent=2, ensure_ascii=False)
    ts = (
        header
        + "export const EXAM_DRILLS: ExamDrill[] = "
        + body
        + ";\n\n"
        + "/** Categories that have at least one exam drill, in display order. */\n"
        + "export const EXAM_DRILL_CATEGORIES: string[] = [\n"
        + "  ...new Set(EXAM_DRILLS.map((d) => d.category)),\n"
        + "];\n"
    )
    open(TS_PATH, "w").write(ts)
    per = {}
    for d in out:
        per[d["category"]] = per.get(d["category"], 0) + 1
    items = sum(len(g["items"]) for d in out for g in d["keyPoints"])
    print(f"wrote {TS_PATH}")
    print(f"  {len(out)} drills, {items} answer items (mean {items/len(out):.1f}/drill)")
    for c in CATEGORY_ORDER:
        print(f"    {per.get(c, 0):2d}  {c}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
