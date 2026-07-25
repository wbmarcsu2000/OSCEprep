# OB/GYN Guideline Drills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the OB/GYN clerkship a Guideline Drills tool (40 verified drills, 4 domains) by generalizing the FM drills screen into a bank-driven `GuidelineDrills` component.

**Architecture:** A `DrillBank` descriptor (the proven `McqBank` pattern) carries a bank's domains, drills, copy, and storage key. `FmDrills.tsx`/`fmDrillProgress.ts` are replaced by generic `GuidelineDrills.tsx`/`guidelineDrillProgress.ts` with **zero FM behavior change** (same view id, storage key `osce.fmdrills.v1`, telemetry strings `fm-<domain>`). OB content is produced by a generate → 2× adversarial-verify workflow, then gated by a human review sheet.

**Tech Stack:** Vite + React 19 + TS strict + Vitest + Testing Library. Spec: `docs/superpowers/specs/2026-07-17-obgyn-drills-design.md`.

## Global Constraints

- Node via nvm: run `export PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH"` before any npm/npx/node command.
- Work in the worktree `/Users/williamsaccount/osce-simulator/.claude/worktrees/obgyn-drills` (branch `worktree-obgyn-drills`).
- `noUnusedParameters`/`noUnusedLocals` are ON — only destructure props you use.
- FM invariants that must not change: view id `fmdrills`, hash `#/fm-drills`, storage key `osce.fmdrills.v1`, telemetry drillType strings `fm-screening|fm-immunization|fm-chronic`, Analytics section title `Guideline drills (Family Medicine)`.
- OB constants: view `obdrills`, hash `#/ob-drills`, storage key `osce.obdrills.v1`, telemetry `ob-<domain>`, domains `prenatal|complications|labor|gyn`, all drills `reviewed: "2026-07-17"`.
- Content density caps (hard, tested): 2–4 groups/drill, 1–5 items/group, 8–16 items/drill total, every item ≤80 chars. Depth goes to `pearls`.
- Known flaky-under-full-suite test files (pass in isolation): differentials/shelf/workup-management/library — re-run individually before assuming a regression.
- Full suite: `npx vitest run`. Type check: `npx tsc -b`. Prod build: `npm run build`.

---

### Task 1: Generic bank module (`guidelineDrillBank.ts`) wrapping the FM bank

**Files:**
- Create: `src/data/guidelineDrillBank.ts`
- Test: `src/data/__tests__/guidelineDrillBank.test.ts`

**Interfaces:**
- Consumes: `FM_GUIDELINE_DRILLS`, `FM_DOMAIN_ORDER`, `FM_DOMAIN_LABELS`, `FM_DOMAIN_EMOJI` from `src/data/fmGuidelineDrills.ts` (untouched).
- Produces (used by Tasks 2–4, 6–7): `GuidelineDrill`, `DrillDomainDef`, `DrillBank` types; `FM_DRILL_BANK: DrillBank`; `GUIDELINE_DRILL_BANKS: DrillBank[]`; `DRILL_STORAGE_KEYS: string[]`; `drillsForDomain(bank: DrillBank, domain: string): GuidelineDrill[]`; `drillCatalog(bank: DrillBank, domain: string): { id: string; label: string; group?: string }[]`.

- [ ] **Step 1: Write the failing test**

```ts
// src/data/__tests__/guidelineDrillBank.test.ts
import { describe, it, expect } from "vitest";
import {
  FM_DRILL_BANK,
  GUIDELINE_DRILL_BANKS,
  DRILL_STORAGE_KEYS,
  drillsForDomain,
  drillCatalog,
} from "../guidelineDrillBank";
import { FM_GUIDELINE_DRILLS, FM_DOMAIN_ORDER } from "../fmGuidelineDrills";

describe("guidelineDrillBank", () => {
  it("FM bank preserves the FM invariants exactly", () => {
    expect(FM_DRILL_BANK.id).toBe("fm");
    expect(FM_DRILL_BANK.storageKey).toBe("osce.fmdrills.v1");
    expect(FM_DRILL_BANK.domains.map((d) => d.id)).toEqual([...FM_DOMAIN_ORDER]);
    expect(FM_DRILL_BANK.drills).toHaveLength(FM_GUIDELINE_DRILLS.length);
  });

  it("bank list + storage keys stay in lockstep", () => {
    expect(GUIDELINE_DRILL_BANKS.length).toBeGreaterThanOrEqual(1);
    expect(DRILL_STORAGE_KEYS).toEqual(GUIDELINE_DRILL_BANKS.map((b) => b.storageKey));
    expect(new Set(DRILL_STORAGE_KEYS).size).toBe(DRILL_STORAGE_KEYS.length);
  });

  it("drillsForDomain filters and drillCatalog is spoiler-safe", () => {
    const screening = drillsForDomain(FM_DRILL_BANK, "screening");
    expect(screening.length).toBeGreaterThan(0);
    expect(screening.every((d) => d.domain === "screening")).toBe(true);
    const cat = drillCatalog(FM_DRILL_BANK, "screening");
    expect(cat.length).toBe(screening.length);
    for (const c of cat) {
      expect(Object.keys(c).sort()).toEqual(["group", "id", "label"]);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/guidelineDrillBank.test.ts`
Expected: FAIL — cannot resolve `../guidelineDrillBank`.

- [ ] **Step 3: Write the module**

```ts
// src/data/guidelineDrillBank.ts
/**
 * Bank-driven guideline drills (the McqBank pattern): a DrillBank descriptor
 * carries one clerkship's domains, drills, copy, and storage key so the
 * GuidelineDrills screen, progress store, analytics, and export/reset are all
 * generic. Add a clerkship's drills by appending a bank here — no screen or
 * store changes needed.
 */
import {
  FM_GUIDELINE_DRILLS,
  FM_DOMAIN_ORDER,
  FM_DOMAIN_LABELS,
  FM_DOMAIN_EMOJI,
} from "./fmGuidelineDrills";

export interface GuidelineDrill {
  id: string;
  domain: string;
  /** Guideline name, e.g. "Postpartum hemorrhage". */
  name: string;
  /** Issuing body, e.g. "ACOG" — shown as the source credit. */
  org: string;
  /** Cued prompt naming the dimensions to recall. */
  prompt: string;
  /** Grouped key facts — the coverage answer key. */
  keyPoints: { group: string; items: string[] }[];
  /** High-yield notes shown on reveal. */
  pearls?: string;
  /** ISO date the facts were last verified against the guideline. */
  reviewed: string;
}

export interface DrillDomainDef {
  id: string;
  label: string;
  emoji: string;
}

export interface DrillBank {
  /** Short id — also the telemetry drillType prefix (`${id}-${domain}`). */
  id: string;
  title: string;
  blurb: string;
  icon: string;
  grad: string;
  /** Shown in the Analytics section title: "Guideline drills (<label>)". */
  clerkshipLabel: string;
  domains: DrillDomainDef[];
  drills: GuidelineDrill[];
  storageKey: string;
}

export const FM_DRILL_BANK: DrillBank = {
  id: "fm",
  title: "Guideline Drills",
  blurb:
    "Master one guideline at a time — recall its key facts, graded instantly. Screening, immunizations, and chronic-disease management for the Family Medicine shelf.",
  icon: "🎯",
  grad: "var(--grad-teal)",
  clerkshipLabel: "Family Medicine",
  domains: FM_DOMAIN_ORDER.map((d) => ({ id: d, label: FM_DOMAIN_LABELS[d], emoji: FM_DOMAIN_EMOJI[d] })),
  drills: FM_GUIDELINE_DRILLS,
  storageKey: "osce.fmdrills.v1",
};

export const GUIDELINE_DRILL_BANKS: DrillBank[] = [FM_DRILL_BANK];

/** Single source of truth for export/import/reset (analytics ALL_KEYS). */
export const DRILL_STORAGE_KEYS: string[] = GUIDELINE_DRILL_BANKS.map((b) => b.storageKey);

export function drillsForDomain(bank: DrillBank, domain: string): GuidelineDrill[] {
  return bank.drills.filter((d) => d.domain === domain);
}

/** Spoiler-safe browse entries for a domain (name only, never the answer key). */
export function drillCatalog(
  bank: DrillBank,
  domain: string,
): { id: string; label: string; group?: string }[] {
  return drillsForDomain(bank, domain).map((d) => ({ id: d.id, label: d.name, group: d.org }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/__tests__/guidelineDrillBank.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/guidelineDrillBank.ts src/data/__tests__/guidelineDrillBank.test.ts
git commit -m "feat(drills): generic DrillBank descriptor wrapping the FM guideline drills"
```

---

### Task 2: Generic progress module + hook

**Files:**
- Create: `src/data/guidelineDrillProgress.ts`
- Create: `src/ui/useDrillBankProgress.ts`
- Test: `src/data/__tests__/guidelineDrillProgress.test.ts`

**Interfaces:**
- Consumes: `applyAttempt`, `applyManual`, `isMastered`, `isSeen`, `drillKey`, types `DrillProgress`/`DrillManual` from `src/data/drillProgressCore.ts` (untouched); `DrillBank`, `FM_DRILL_BANK`, `drillsForDomain` from Task 1.
- Produces (used by Tasks 3–4, 7): `DrillBankProgressMap`; `loadDrillBankProgress(storageKey: string): DrillBankProgressMap`; `recordDrillBankAttempt(storageKey, domain, id, pct): DrillProgress`; `setDrillBankManual(storageKey, domain, id, manual): void`; `DrillDomainSummary { total; seen; mastered; needsWork; avgBestPct }`; `summarizeDrillDomain(bank: DrillBank, domain: string, map: DrillBankProgressMap): DrillDomainSummary`; hook `useDrillBankProgress(storageKey)` returning `{ progress, record, setManual }` (record/setManual take `(domain, id, …)` like the FM hook).

- [ ] **Step 1: Write the failing test** (ports every `fmDrillProgress.test.ts` assertion to the generic API, plus bank isolation)

```ts
// src/data/__tests__/guidelineDrillProgress.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  loadDrillBankProgress,
  recordDrillBankAttempt,
  setDrillBankManual,
  summarizeDrillDomain,
} from "../guidelineDrillProgress";
import { FM_DRILL_BANK } from "../guidelineDrillBank";
import { drillKey } from "../drillProgressCore";

const FM_KEY = FM_DRILL_BANK.storageKey; // osce.fmdrills.v1
const OB_KEY = "osce.obdrills.v1";

describe("guidelineDrillProgress", () => {
  beforeEach(() => localStorage.clear());

  it("records attempts under the given storage key, not the IM key", () => {
    recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 90);
    expect(localStorage.getItem(FM_KEY)).toContain("screen-colorectal");
    expect(localStorage.getItem("osce.drills.v1")).toBeNull();
  });

  it("banks are isolated: FM writes never touch the OB key and vice versa", () => {
    recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 90);
    recordDrillBankAttempt(OB_KEY, "gyn", "gyn-pid", 70);
    const fm = loadDrillBankProgress(FM_KEY);
    const ob = loadDrillBankProgress(OB_KEY);
    expect(Object.keys(fm)).toEqual([drillKey("screening", "screen-colorectal")]);
    expect(Object.keys(ob)).toEqual([drillKey("gyn", "gyn-pid")]);
  });

  it("keeps best pct and attempt count across attempts", () => {
    recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 60);
    const entry = recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 40);
    expect(entry.bestPct).toBe(60);
    expect(entry.lastPct).toBe(40);
    expect(entry.attempts).toBe(2);
  });

  it("manual override persists", () => {
    recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 90);
    setDrillBankManual(FM_KEY, "screening", "screen-colorectal", "review");
    const map = loadDrillBankProgress(FM_KEY);
    expect(map[drillKey("screening", "screen-colorectal")].manual).toBe("review");
  });

  it("summarizeDrillDomain aggregates seen/mastered/needsWork/avg", () => {
    recordDrillBankAttempt(FM_KEY, "screening", "screen-colorectal", 90);
    recordDrillBankAttempt(FM_KEY, "screening", "screen-breast", 50);
    setDrillBankManual(FM_KEY, "screening", "screen-breast", "review");
    const s = summarizeDrillDomain(FM_DRILL_BANK, "screening", loadDrillBankProgress(FM_KEY));
    expect(s.seen).toBe(2);
    expect(s.mastered).toBe(1); // ≥80 auto-mastery
    expect(s.needsWork).toBe(1);
    expect(s.avgBestPct).toBe(70);
    expect(s.total).toBeGreaterThanOrEqual(10);
  });

  it("returns {} for a missing or corrupt store", () => {
    expect(loadDrillBankProgress(FM_KEY)).toEqual({});
    localStorage.setItem(FM_KEY, "not json");
    expect(loadDrillBankProgress(FM_KEY)).toEqual({});
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/guidelineDrillProgress.test.ts`
Expected: FAIL — cannot resolve `../guidelineDrillProgress`.

- [ ] **Step 3: Write the progress module**

```ts
// src/data/guidelineDrillProgress.ts
/**
 * Guideline-drill progress for any DrillBank, localStorage-backed under the
 * bank's own storage key (e.g. osce.fmdrills.v1, osce.obdrills.v1) — separate
 * from the IM drills. Pure logic comes from drillProgressCore; this module
 * only adds the storage wrapper + per-domain summary.
 */
import {
  type DrillProgress,
  type DrillManual,
  applyAttempt,
  applyManual,
  isMastered,
  isSeen,
  drillKey,
} from "./drillProgressCore";
import { type DrillBank, drillsForDomain } from "./guidelineDrillBank";

export type DrillBankProgressMap = Record<string, DrillProgress>;

export function loadDrillBankProgress(storageKey: string): DrillBankProgressMap {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as DrillBankProgressMap) : {};
  } catch {
    return {};
  }
}

function save(storageKey: string, map: DrillBankProgressMap): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(map));
  } catch {
    // storage unavailable — progress just won't persist this session
  }
}

export function recordDrillBankAttempt(
  storageKey: string,
  domain: string,
  id: string,
  pct: number,
): DrillProgress {
  const map = loadDrillBankProgress(storageKey);
  const key = drillKey(domain, id);
  const entry = applyAttempt(map[key], pct, Date.now());
  map[key] = entry;
  save(storageKey, map);
  return entry;
}

export function setDrillBankManual(
  storageKey: string,
  domain: string,
  id: string,
  manual: DrillManual,
): void {
  const map = loadDrillBankProgress(storageKey);
  const key = drillKey(domain, id);
  map[key] = applyManual(map[key], manual, Date.now());
  save(storageKey, map);
}

export interface DrillDomainSummary {
  total: number;
  seen: number;
  mastered: number;
  needsWork: number;
  avgBestPct: number;
}

export function summarizeDrillDomain(
  bank: DrillBank,
  domain: string,
  map: DrillBankProgressMap,
): DrillDomainSummary {
  const items = drillsForDomain(bank, domain);
  let seen = 0, mastered = 0, needsWork = 0, bestSum = 0;
  for (const d of items) {
    const p = map[drillKey(domain, d.id)];
    if (isMastered(p)) mastered += 1;
    if (p?.manual === "review") needsWork += 1;
    if (isSeen(p)) {
      seen += 1;
      bestSum += p!.bestPct;
    }
  }
  return { total: items.length, seen, mastered, needsWork, avgBestPct: seen > 0 ? Math.round(bestSum / seen) : 0 };
}
```

- [ ] **Step 4: Write the hook**

```ts
// src/ui/useDrillBankProgress.ts
import { useCallback, useState } from "react";
import {
  loadDrillBankProgress,
  recordDrillBankAttempt,
  setDrillBankManual,
  type DrillBankProgressMap,
} from "../data/guidelineDrillProgress";
import { drillKey, type DrillManual } from "../data/drillProgressCore";

/** React wrapper over a bank's drill-progress store — mirrors useDrillProgress. */
export function useDrillBankProgress(storageKey: string) {
  const [progress, setProgress] = useState<DrillBankProgressMap>(() => loadDrillBankProgress(storageKey));

  const record = useCallback(
    (domain: string, id: string, pct: number) => {
      const entry = recordDrillBankAttempt(storageKey, domain, id, pct);
      setProgress((p) => ({ ...p, [drillKey(domain, id)]: entry }));
    },
    [storageKey],
  );

  const setManual = useCallback(
    (domain: string, id: string, manual: DrillManual) => {
      setDrillBankManual(storageKey, domain, id, manual);
      setProgress(loadDrillBankProgress(storageKey));
    },
    [storageKey],
  );

  return { progress, record, setManual };
}
```

Note: `drillKey` and `DrillManual` are exported from `src/data/drillProgressCore.ts` (verify `DrillManual` is exported there — it is, `fmDrillProgress.ts` re-imports it today).

- [ ] **Step 5: Run tests + typecheck**

Run: `npx vitest run src/data/__tests__/guidelineDrillProgress.test.ts && npx tsc -b`
Expected: PASS (6 tests), tsc clean.

- [ ] **Step 6: Commit**

```bash
git add src/data/guidelineDrillProgress.ts src/ui/useDrillBankProgress.ts src/data/__tests__/guidelineDrillProgress.test.ts
git commit -m "feat(drills): storage-key-parameterized guideline-drill progress + hook"
```

---

### Task 3: Generic `GuidelineDrills` screen replaces `FmDrills`

**Files:**
- Create: `src/ui/screens/GuidelineDrills.tsx`
- Modify: `src/App.tsx` (line 15 import; line ~300 render)
- Rename+modify: `src/ui/__tests__/fmDrills.test.tsx` → `src/ui/__tests__/guidelineDrills.test.tsx`
- Delete: `src/ui/screens/FmDrills.tsx`, `src/ui/useFmDrillProgress.ts`

**Interfaces:**
- Consumes: Task 1 bank module, Task 2 hook + `summarizeDrillDomain`; shared `drillPrimitives`/`drillModes`/`drillProgressCore` (all untouched).
- Produces: `GuidelineDrills({ bank }: { bank: DrillBank })` — rendered by `App.tsx` per view.

- [ ] **Step 1: Migrate the test file** — `git mv src/ui/__tests__/fmDrills.test.tsx src/ui/__tests__/guidelineDrills.test.tsx`, then change ONLY the import and render lines; every assertion stays byte-identical (that's the FM regression proof):

```tsx
// top of src/ui/__tests__/guidelineDrills.test.tsx — replace:
//   import { FmDrills } from "../screens/FmDrills";
// with:
import { GuidelineDrills } from "../screens/GuidelineDrills";
import { FM_DRILL_BANK } from "../../data/guidelineDrillBank";
// and replace every `render(<FmDrills />)` with:
render(<GuidelineDrills bank={FM_DRILL_BANK} />);
// describe title may stay "FmDrills screen" or become "GuidelineDrills screen (FM bank)" — cosmetic only.
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/ui/__tests__/guidelineDrills.test.tsx`
Expected: FAIL — cannot resolve `../screens/GuidelineDrills`.

- [ ] **Step 3: Create the screen** — this is `FmDrills.tsx` parameterized; the full file:

```tsx
// src/ui/screens/GuidelineDrills.tsx
import { useMemo, useState } from "react";
import { Segmented } from "../components/Segmented";
import { DrillBrowser, GroupedCoverageDrill, SeenChip } from "../components/drillPrimitives";
import { CategoryRecallDrill, FlashcardDrill } from "../components/drillModes";
import { useDrillBankProgress } from "../useDrillBankProgress";
import { useAppStore } from "../store";
import { type DrillBank, drillsForDomain, drillCatalog } from "../../data/guidelineDrillBank";
import { summarizeDrillDomain } from "../../data/guidelineDrillProgress";
import { drillKey, isMastered, isSeen } from "../../data/drillProgressCore";

type DrillMode = "recall" | "category" | "flashcard";

const DRILL_MODES: { value: DrillMode; label: string }[] = [
  { value: "recall", label: "✍️ Full recall" },
  { value: "category", label: "🗂 By category" },
  { value: "flashcard", label: "🃏 Flashcard" },
];

/**
 * Bank-driven guideline drills. One drill = one guideline; the student does
 * cued grouped free-recall, graded by coverage against the guideline's key
 * facts (reusing GroupedCoverageDrill). Domain tabs, copy, drills, and the
 * progress storage key all come from the DrillBank descriptor (FM, OB/GYN, …).
 */
export function GuidelineDrills({ bank }: { bank: DrillBank }) {
  const exitToSelect = useAppStore((s) => s.exitToSelect);
  const llmEnabled = useAppStore((s) => s.llmEnabled);
  const { progress, record, setManual } = useDrillBankProgress(bank.storageKey);

  const [domain, setDomain] = useState<string>(bank.domains[0].id);
  const [mode, setMode] = useState<DrillMode>("category");
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [graded, setGraded] = useState(false);
  const [browsing, setBrowsing] = useState(false);

  const pool = useMemo(() => drillsForDomain(bank, domain), [bank, domain]);
  const current = pool.length > 0 ? pool[idx % pool.length] : null;
  const activeEntry = current ? progress[drillKey(domain, current.id)] : undefined;
  const summary = useMemo(() => summarizeDrillDomain(bank, domain, progress), [bank, domain, progress]);

  const reset = () => {
    setAnswer("");
    setGraded(false);
  };

  const changeDomain = (d: string) => {
    setDomain(d);
    setIdx(0);
    reset();
  };

  const changeMode = (m: DrillMode) => {
    setMode(m);
    reset();
  };

  /** Next guideline: prefer unseen, then unmastered, else advance by one. */
  const nextProblem = () => {
    if (pool.length === 0) return;
    const cur = idx % pool.length;
    const order = [...pool.slice(cur + 1), ...pool.slice(0, cur + 1)];
    const unseen = order.find((d) => !isSeen(progress[drillKey(domain, d.id)]));
    const target =
      unseen ?? order.find((d) => !isMastered(progress[drillKey(domain, d.id)])) ?? order[0];
    setIdx(pool.findIndex((d) => d.id === target.id));
    reset();
  };

  const goToProblem = (id: string) => {
    const i = pool.findIndex((d) => d.id === id);
    if (i >= 0) setIdx(i);
    setBrowsing(false);
    reset();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <span className="icon-tile" style={{ background: bank.grad }} aria-hidden="true">{bank.icon}</span>
          <div className="space-y-0.5">
            <div className="panel-label">Learning tool</div>
            <h2 className="text-[24px] font-extrabold tracking-tight" style={{ color: "var(--color-exam-header)" }}>
              {bank.title}
            </h2>
            <p className="text-sm" style={{ color: "var(--color-exam-muted)" }}>
              {bank.blurb}
            </p>
          </div>
        </div>
        <button className="btn btn-ghost shrink-0" onClick={exitToSelect}>Case list →</button>
      </div>

      <div className="card px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-3">
        <Segmented
          label="Guideline domain"
          options={bank.domains.map((d) => ({ value: d.id, label: `${d.emoji} ${d.label}` }))}
          value={domain}
          onChange={changeDomain}
        />
        {current && <span className="chip chip-accent">{current.name} · {current.org}</span>}
        <button className="btn ml-auto" onClick={nextProblem} title="Prefers a guideline you haven't mastered yet">
          ➜ Next guideline
        </button>
      </div>

      <div className="card px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="panel-label">Mode</span>
        <Segmented label="Drill mode" options={DRILL_MODES} value={mode} onChange={changeMode} />
        <span className="hint ml-auto">
          {mode === "recall"
            ? "Recall everything at once"
            : mode === "category"
              ? "One category at a time"
              : "Flip & self-rate — no typing"}
        </span>
      </div>

      <div className="card px-4 py-2.5 flex items-center gap-2 flex-wrap text-[13px]">
        <span className="panel-label">Progress</span>
        <span className="font-semibold" style={{ color: "var(--color-exam-muted)" }}>
          Seen {summary.seen}/{summary.total} · {summary.mastered} mastered
          {summary.needsWork ? ` · ${summary.needsWork} to review` : ""}
          {summary.seen ? ` · avg ${summary.avgBestPct}%` : ""}
        </span>
        <SeenChip entry={activeEntry} />
        <button className="btn btn-ghost ml-auto py-1 px-2.5 text-[12px]" onClick={() => setBrowsing((b) => !b)}>
          {browsing ? "Hide list" : `📋 Browse all (${summary.total})`}
        </button>
      </div>

      {browsing && (
        <DrillBrowser
          items={drillCatalog(bank, domain)}
          keyOf={(id) => drillKey(domain, id)}
          progress={progress}
          currentId={current?.id ?? null}
          onPick={goToProblem}
        />
      )}

      {current ? (
        mode === "flashcard" ? (
          <FlashcardDrill
            key={`flashcard:${domain}:${current.id}`}
            prompt={current.prompt}
            keyPoints={current.keyPoints}
            pearls={current.pearls}
            badge={current.org}
            onRecord={(pct) => record(domain, current.id, pct)}
            onNew={nextProblem}
            drillType={`${bank.id}-${domain}`}
          />
        ) : mode === "category" ? (
          <CategoryRecallDrill
            key={`category:${domain}:${current.id}`}
            prompt={current.prompt}
            keyPoints={current.keyPoints}
            pearls={current.pearls}
            badge={current.org}
            onRecord={(pct) => record(domain, current.id, pct)}
            onNew={nextProblem}
            progressEntry={activeEntry}
            onSetManual={(m) => setManual(domain, current.id, m)}
            newLabel="Next guideline →"
            drillType={`${bank.id}-${domain}`}
          />
        ) : (
          <GroupedCoverageDrill
            key={`recall:${domain}:${current.id}`}
            prompt={current.prompt}
            keyPoints={current.keyPoints}
            pearls={current.pearls}
            badge={current.org}
            answer={answer}
            setAnswer={setAnswer}
            graded={graded}
            onGrade={() => setGraded(true)}
            onNew={nextProblem}
            onRetry={() => setGraded(false)}
            onRecord={(pct) => record(domain, current.id, pct)}
            progressEntry={activeEntry}
            onSetManual={(m) => setManual(domain, current.id, m)}
            newLabel="Next guideline →"
            drillType={`${bank.id}-${domain}`}
          />
        )
      ) : (
        <div className="card p-4"><p className="muted text-center">No guidelines in this domain yet.</p></div>
      )}

      <p className="hint text-center">
        {mode === "flashcard"
          ? "Flashcard mode — flip and rate yourself; no grading."
          : llmEnabled
            ? "Graded semantically by AI — use the guideline card to self-check anything it misses."
            : "Graded by lenient keyword match — enable AI for smarter grading. Use the guideline card to self-check anything it misses."}
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Rewire App.tsx and delete the FM-only files**

In `src/App.tsx`, replace `import { FmDrills } from "./ui/screens/FmDrills";` with:

```tsx
import { GuidelineDrills } from "./ui/screens/GuidelineDrills";
import { FM_DRILL_BANK } from "./data/guidelineDrillBank";
```

Replace `{view === "fmdrills" && <FmDrills />}` with:

```tsx
{view === "fmdrills" && <GuidelineDrills key="fm" bank={FM_DRILL_BANK} />}
```

Then: `git rm src/ui/screens/FmDrills.tsx src/ui/useFmDrillProgress.ts` (the hook's only consumer was FmDrills — confirm with `grep -rn "useFmDrillProgress" src/` → no hits after).

- [ ] **Step 5: Run tests + typecheck**

Run: `npx vitest run src/ui/__tests__/guidelineDrills.test.tsx && npx tsc -b`
Expected: PASS with the original FM assertions unchanged; tsc clean.

- [ ] **Step 6: Commit**

```bash
git add -A src/App.tsx src/ui
git commit -m "refactor(drills): FmDrills -> bank-driven GuidelineDrills screen (FM behavior unchanged)"
```

---

### Task 4: Cross-cutting surfaces (ALL_KEYS + Analytics) go bank-sourced; delete `fmDrillProgress.ts`

**Files:**
- Modify: `src/analytics/store.ts` (import line 9; `ALL_KEYS` ~line 148)
- Modify: `src/ui/screens/Analytics.tsx` (imports ~25–30; `FmDrillProgressSection` ~line 302; render site ~line 549)
- Modify: `src/analytics/__tests__/store.test.ts` (imports; `PROGRESS_KEYS`; FM-key seeding)
- Delete: `src/data/fmDrillProgress.ts`, `src/data/__tests__/fmDrillProgress.test.ts` (assertions already ported in Task 2)

**Interfaces:**
- Consumes: `GUIDELINE_DRILL_BANKS`, `DRILL_STORAGE_KEYS`, `drillCatalog`, `DrillBank` (Task 1); `loadDrillBankProgress`, `summarizeDrillDomain` (Task 2); `drillKey`, `isMastered`, `isSeen` from `drillProgressCore`.
- Produces: Analytics renders one "Guideline drills (<clerkshipLabel>)" section per bank; export/import/reset covers every bank key automatically.

- [ ] **Step 1: Update the guard test first** — in `src/analytics/__tests__/store.test.ts`:

```ts
// replace: import { FM_DRILL_PROGRESS_KEY } from "../../data/fmDrillProgress";
import { DRILL_STORAGE_KEYS, FM_DRILL_BANK } from "../../data/guidelineDrillBank";

// replace: const PROGRESS_KEYS = [DRILL_PROGRESS_KEY, FM_DRILL_PROGRESS_KEY, ...MCQ_STORAGE_KEYS];
const PROGRESS_KEYS = [DRILL_PROGRESS_KEY, ...DRILL_STORAGE_KEYS, ...MCQ_STORAGE_KEYS];

// replace every remaining `FM_DRILL_PROGRESS_KEY` (the seeding at ~line 19) with:
FM_DRILL_BANK.storageKey
```

Run: `npx vitest run src/analytics/__tests__/store.test.ts`
Expected: FAIL to compile until store.ts is updated (or PASS if only imports changed — either way proceed; the meaningful red/green is Step 3).

- [ ] **Step 2: Update `src/analytics/store.ts`**

```ts
// replace: import { FM_DRILL_PROGRESS_KEY } from "../data/fmDrillProgress";
import { DRILL_STORAGE_KEYS } from "../data/guidelineDrillBank";

// in ALL_KEYS, replace the line `FM_DRILL_PROGRESS_KEY,` with:
...DRILL_STORAGE_KEYS,
```

- [ ] **Step 3: Generalize the Analytics section** — in `src/ui/screens/Analytics.tsx`:

Replace the FM-specific imports (`loadFmProgress, fmDrillKey, fmSummarize` from `fmDrillProgress`; `FM_DOMAIN_ORDER, FM_DOMAIN_LABELS, FM_DOMAIN_EMOJI, fmDrillCatalog` from `fmGuidelineDrills`) with:

```tsx
import { loadDrillBankProgress, summarizeDrillDomain } from "../../data/guidelineDrillProgress";
import { GUIDELINE_DRILL_BANKS, drillCatalog, type DrillBank } from "../../data/guidelineDrillBank";
import { drillKey } from "../../data/drillProgressCore";
```

(keep the existing `isMastered`/`isSeen` imports as they are). Rename `FmDrillProgressSection()` to `GuidelineDrillBankSection({ bank }: { bank: DrillBank })` and inside it:

- `loadFmProgress()` → `loadDrillBankProgress(bank.storageKey)` (useMemo dep `[bank.storageKey]`)
- `FM_DOMAIN_ORDER.map((domain) => …fmSummarize(domain, progress))` → `bank.domains.map((dom) => ({ dom, summary: summarizeDrillDomain(bank, dom.id, progress) }))`
- Section title: `Guideline drills (Family Medicine)` → `` `Guideline drills (${bank.clerkshipLabel})` `` (FM output string is identical)
- Row label `{FM_DOMAIN_EMOJI[domain]} {FM_DOMAIN_LABELS[domain]}` → `{dom.emoji} {dom.label}`; row `key={domain}` → `key={dom.id}`
- Chips: `fmDrillCatalog(domain)` → `drillCatalog(bank, dom.id)`; `progress[fmDrillKey(domain, it.id)]` → `progress[drillKey(dom.id, it.id)]`

At the render site (~line 549), replace `<FmDrillProgressSection />` with:

```tsx
{GUIDELINE_DRILL_BANKS.map((b) => (
  <GuidelineDrillBankSection key={b.id} bank={b} />
))}
```

- [ ] **Step 4: Delete the FM-only module + its test**

```bash
git rm src/data/fmDrillProgress.ts src/data/__tests__/fmDrillProgress.test.ts
grep -rn "fmDrillProgress\|useFmDrillProgress\|FM_DRILL_PROGRESS_KEY" src/  # expect: no hits
```

- [ ] **Step 5: Run the affected suites + typecheck**

Run: `npx vitest run src/analytics/__tests__/store.test.ts src/ui/__tests__/analytics.test.tsx src/ui/__tests__/guidelineDrills.test.tsx src/data/__tests__/guidelineDrillProgress.test.ts && npx tsc -b`
Expected: all PASS (analytics.test.tsx still finds "Guideline drills (Family Medicine)"), tsc clean.

- [ ] **Step 6: Commit**

```bash
git add -A src/analytics src/ui/screens/Analytics.tsx src/data
git commit -m "refactor(analytics): drill export/reset + progress sections sourced from the bank list"
```

---

### Task 5: Generate + doubly verify the 40 OB drills (ultracode workflow)

**Files:**
- Create (job tmp, not repo): `$CLAUDE_JOB_DIR/tmp/ob_drills_work/verified_drills.json`
- No repo changes in this task.

**Interfaces:**
- Produces: `verified_drills.json` — array of 40 `GuidelineDrill` objects (exact Task 1 shape, `reviewed: "2026-07-17"`), plus per-drill `volatile: string[]` and `changes: string[]` sidecar fields (stripped before the TS build, kept for the review sheet).

- [ ] **Step 1: Launch the Workflow** with the script below (inline via the Workflow tool). The 40-topic blueprint is embedded; each drill flows gen → verify-1 → verify-2 independently (pipeline, no barrier). Verify agents may WebSearch for volatile items.

```js
export const meta = {
  name: 'ob-drill-content',
  description: 'Generate + doubly adversarially verify 40 OB/GYN guideline drills',
  phases: [
    { title: 'Generate', detail: 'one agent per drill' },
    { title: 'Verify 1', detail: 'adversarial numeric check' },
    { title: 'Verify 2', detail: 'independent second check' },
  ],
}

const B = [
  // domain: prenatal
  { id: 'pre-visits', domain: 'prenatal', org: 'ACOG', name: 'Prenatal visit schedule & labs by trimester', focus: 'visit cadence; initial-visit labs; 24-28wk testing (GDM, CBC, RhoGAM if Rh-); 36wk GBS; when anatomy scan' },
  { id: 'pre-aneuploidy', domain: 'prenatal', org: 'ACOG', name: 'Aneuploidy screening options', focus: 'cfDNA from 10wk; first-trimester combined (NT+PAPP-A+hCG); quad screen timing+components; diagnostic CVS 10-13wk vs amnio >=15wk; screening vs diagnostic' },
  { id: 'pre-gdm', domain: 'prenatal', org: 'ACOG', name: 'Gestational diabetes screening & diagnosis', focus: 'universal 24-28wk 50g 1h screen + threshold; 100g 3h Carpenter-Coustan values, 2 abnormal = dx; glucose targets; postpartum 75g OGTT' },
  { id: 'pre-rhogam', domain: 'prenatal', org: 'ACOG', name: 'Rh(D) alloimmunization prevention', focus: 'who (Rh-neg unsensitized); 28wk + within 72h of delivery of Rh+ infant; sensitizing events; Kleihauer-Betke for dosing' },
  { id: 'pre-vaccines', domain: 'prenatal', org: 'ACIP/CDC', name: 'Vaccines in pregnancy', focus: 'Tdap 27-36wk every pregnancy; flu any trimester; RSV (Abrysvo) 32-36wk seasonal; COVID; contraindicated live vaccines MMR/varicella/LAIV; postpartum catch-up' },
  { id: 'pre-gbs', domain: 'prenatal', org: 'ACOG', name: 'GBS screening & intrapartum prophylaxis', focus: 'screen 36 0/7-37 6/7; ppx indications incl GBS bacteriuria + prior affected infant; penicillin G first-line; allergy pathways cefazolin/clindamycin/vancomycin' },
  { id: 'pre-dating', domain: 'prenatal', org: 'ACOG', name: 'Pregnancy dating & antenatal surveillance', focus: 'LMP vs first-trimester US re-dating discrepancy rules; when NST/BPP start and for whom; BPP components+scoring; kick counts' },
  { id: 'pre-aspirin', domain: 'prenatal', org: 'USPSTF/ACOG', name: 'Aspirin for preeclampsia prevention', focus: '81mg daily; start 12-28wk ideally before 16wk; high-risk criteria (prior preE, CKD, DM, chronic HTN, multifetal, autoimmune); moderate-risk criteria and when >=2 count' },
  { id: 'pre-infxn', domain: 'prenatal', org: 'CDC/USPSTF', name: 'Infection screening in pregnancy', focus: 'syphilis first visit + 28wk + delivery; HIV opt-out; HBsAg; asymptomatic bacteriuria screen+treat; chlamydia <25 or risk; what NOT routine (BV)' },
  { id: 'pre-nutrition', domain: 'prenatal', org: 'ACOG', name: 'Nutrition, supplements & exposures', focus: 'folic acid 400mcg routine vs 4mg prior NTD; weight-gain ranges by BMI; high-mercury fish/listeria foods; no alcohol; caffeine <200mg' },
  // domain: complications
  { id: 'comp-htn-class', domain: 'complications', org: 'ACOG', name: 'Hypertensive disorders: classification', focus: 'chronic vs gestational (>=20wk) vs preE vs superimposed; preE criteria 140/90 x2 + proteinuria 300mg / PCR 0.3 or severe features; severe features list 160/110, plt<100k, Cr>1.1, transaminases 2x, pulm edema, symptoms; HELLP' },
  { id: 'comp-severe-pre', domain: 'complications', org: 'ACOG', name: 'Severe preeclampsia & eclampsia management', focus: 'mag load 4-6g then 1-2g/h; toxicity signs by level + Ca gluconate; IV labetalol/hydralazine/PO nifedipine; delivery timing preE 37wk vs severe 34wk; eclampsia ABCs+mag+deliver' },
  { id: 'comp-pph', domain: 'complications', org: 'ACOG', name: 'Postpartum hemorrhage', focus: 'definition >=1000mL or hypovolemia signs; 4 Ts; stepwise: massage -> oxytocin -> methylergonovine (not if HTN) -> carboprost (not if asthma) -> misoprostol -> TXA -> balloon -> surgery/hysterectomy' },
  { id: 'comp-bleeding', domain: 'complications', org: 'ACOG', name: 'Antepartum hemorrhage: previa vs abruption', focus: 'previa painless bleeding, NO digital exam, cesarean 36-37wk; abruption painful+rigid uterus, RFs HTN/cocaine/trauma/smoking; vasa previa fetal bleeding on ROM; accreta RFs prior CS+previa' },
  { id: 'comp-ptl', domain: 'complications', org: 'ACOG/SMFM', name: 'Preterm labor', focus: 'betamethasone 24-34wk (late preterm 34-36 select); tocolysis <34wk: indomethacin <32wk, nifedipine; mag neuroprotection <32wk; tocolysis contraindications; fFN/cervical length triage' },
  { id: 'comp-prom', domain: 'complications', org: 'ACOG', name: 'PROM & PPROM', focus: 'dx pooling/ferning/nitrazine; NO digital exams; term PROM -> induce; PPROM >=34wk deliver vs 24-33 6/7 expectant + steroids + latency abx (amp/amox + azithro) + mag if <32; deliver if infection/abruption/nonreassuring' },
  { id: 'comp-ectopic', domain: 'complications', org: 'ACOG', name: 'Ectopic pregnancy', focus: 'RFs; dx hCG discriminatory zone ~3500 + TVUS; abnormal hCG trend; MTX criteria (<3.5cm, no cardiac activity, hCG <5000, stable, reliable f/u, no contraindications); surgery indications; f/u to zero' },
  { id: 'comp-loss', domain: 'complications', org: 'ACOG', name: 'Early pregnancy loss', focus: 'types by os + US findings (threatened/inevitable/incomplete/complete/missed); dx thresholds (CRL >=7mm no cardiac activity; MSD >=25mm empty); expectant vs miso±mife vs D&C; when each preferred' },
  { id: 'comp-dystocia', domain: 'complications', org: 'ACOG', name: 'Shoulder dystocia', focus: 'RFs macrosomia/GDM/prior dystocia/operative delivery; turtle sign; maneuver sequence McRoberts -> suprapubic pressure -> posterior arm -> rotational -> Gaskin -> Zavanelli; complications brachial plexus/clavicle/hypoxia; what NOT to do (fundal pressure)' },
  { id: 'comp-infection', domain: 'complications', org: 'ACOG', name: 'Intra-amniotic infection & endometritis', focus: 'Triple I: maternal fever + one of fetal tachy/maternal WBC/purulent fluid; RFs prolonged ROM; intrapartum amp+gent, deliver (not immediate CS); endometritis postpartum fever+uterine tenderness -> clinda+gent; RF cesarean' },
  // domain: labor
  { id: 'labor-stages', domain: 'labor', org: 'ACOG', name: 'Stages & phases of labor', focus: 'stage 1 latent vs active (active from 6cm); stage 2/3 definitions; normal durations nullip vs multip; prolonged stage 3 = 30min; latent-phase mgmt' },
  { id: 'labor-arrest', domain: 'labor', org: 'ACOG', name: 'Labor protraction & arrest', focus: 'active-phase arrest: >=6cm + ROM + no change 4h adequate ctx or 6h inadequate; second-stage arrest nullip 3h/multip 2h (+1h epidural); protraction vs arrest; failed IOL definition; responses' },
  { id: 'labor-fhr', domain: 'labor', org: 'ACOG', name: 'FHR interpretation & categories', focus: 'baseline 110-160; variability absent/minimal/moderate/marked; accels 15bpm x 15s (10x10 <32wk); Category I criteria; Category III (absent variability + recurrent lates/variables/brady, or sinusoidal); II = everything else' },
  { id: 'labor-decels', domain: 'labor', org: 'ACOG', name: 'Decelerations', focus: 'early = mirror ctx, head compression, benign; late = gradual after ctx peak, uteroplacental insufficiency; variable = abrupt, cord compression; recurrent = with >=50% ctx; prolonged 2-10min; response to each' },
  { id: 'labor-resusc', domain: 'labor', org: 'ACOG', name: 'Intrauterine resuscitation', focus: 'lateral position, O2, IV fluid bolus, stop oxytocin, terbutaline for tachysystole, amnioinfusion for recurrent variables, scalp stimulation for accel; tachysystole definition >5 ctx/10min' },
  { id: 'labor-induction', domain: 'labor', org: 'ACOG', name: 'Induction of labor', focus: 'indications 41-42wk, preE, DM, IUGR, oligo; Bishop >=8 favorable / <=6 ripen; ripening misoprostol (NOT with prior CS), dinoprostone, Foley balloon; oxytocin; contraindications previa/classical scar/transverse lie' },
  { id: 'labor-operative', domain: 'labor', org: 'ACOG', name: 'Operative vaginal delivery', focus: 'indications prolonged 2nd stage/nonreassuring FHR/maternal exhaustion or cardiac; prerequisites full dilation, ruptured membranes, engaged head, known position, empty bladder, no CPD; vacuum risks cephalohematoma/subgaleal; forceps risks facial nerve/lacerations' },
  { id: 'labor-tolac', domain: 'labor', org: 'ACOG', name: 'TOLAC / VBAC', focus: 'candidates 1-2 prior low-transverse CS; success predictors prior vaginal delivery; contraindications classical/T incision, prior rupture, previa; rupture risk ~0.5-1%; rupture signs FHR abnormality most common, loss of station, pain, bleeding' },
  { id: 'labor-cesarean', domain: 'labor', org: 'ACOG', name: 'Cesarean indications & delivery timing', focus: 'common indications arrest/nonreassuring/malpresentation/previa; elective not before 39wk; previa 36-37wk; accreta 34-36wk; prior classical 36-37wk; ERAS/skin prep pearls to pearls' },
  { id: 'labor-emergencies', domain: 'labor', org: 'ACOG', name: 'Intrapartum emergencies', focus: 'cord prolapse: elevate presenting part, knee-chest, emergent CS; uterine rupture: FHR change + pain + loss of station -> laparotomy; AFE: sudden hypoxia + hypotension + DIC, supportive; uterine inversion: replace, no placenta removal until' },
  // domain: gyn
  { id: 'gyn-asccp', domain: 'gyn', org: 'ASCCP', name: 'Abnormal cervical screening management', focus: 'ASC-US reflex HPV / repeat; when colposcopy (HPV+ ASC-US, LSIL 25+, any HSIL/ASC-H/AGC); AGC needs colpo + ECC + EMB if >=35 or risk; CIN2/3 excision; ages 21-24 conservative; principles not full tables' },
  { id: 'gyn-contraception', domain: 'gyn', org: 'CDC', name: 'Contraception selection & contraindications', focus: 'estrogen contraindications: migraine with aura, >=35 + >=15 cig/day, VTE hx, uncontrolled HTN, breast ca, <21d postpartum; effectiveness tiers LARC best; DMPA bone/weight; IUD ok nulliparous; progestin-only if estrogen contraindicated' },
  { id: 'gyn-ec', domain: 'gyn', org: 'ACOG', name: 'Emergency contraception', focus: 'copper IUD most effective, up to 5d; ulipristal up to 120h, better with obesity, delays ovulation; LNG 1.5mg best <=72h; efficacy order; restart hormonal contraception 5d after ulipristal' },
  { id: 'gyn-aub', domain: 'gyn', org: 'ACOG', name: 'Abnormal uterine bleeding workup', focus: 'PALM-COEIN; always hCG first; labs TSH/CBC ± coags (adolescent heavy = vWD); TVUS; EMB if >=45, or <45 + unopposed estrogen/failed tx/Lynch; acute severe: IV estrogen or OCP taper or TXA' },
  { id: 'gyn-pmb', domain: 'gyn', org: 'ACOG', name: 'Postmenopausal bleeding', focus: 'endometrial ca until proven otherwise; TVUS stripe <=4mm low risk vs EMB; persistent bleeding -> biopsy regardless; hyperplasia without atypia progestin vs atypia hysterectomy; RFs unopposed estrogen, tamoxifen, obesity, Lynch' },
  { id: 'gyn-pcos', domain: 'gyn', org: 'ACOG', name: 'PCOS', focus: 'Rotterdam 2 of 3 oligo-ovulation/hyperandrogenism/PCO morphology; exclude TSH, prolactin, 17-OHP, testosterone/DHEAS if severe; mgmt by goal: OCPs cycle control, letrozole first-line fertility, metformin metabolic; endometrial protection; risks' },
  { id: 'gyn-menopause', domain: 'gyn', org: 'ACOG/NAMS', name: 'Menopause & hormone therapy', focus: 'dx 12mo amenorrhea ~51y, FSH not required; HRT for vasomotor if <60 or <10y from menopause; E+P if uterus (unopposed E = endometrial ca); contraindications breast ca/CAD/VTE/stroke/undiagnosed bleeding; nonhormonal SSRI-SNRI/gabapentin; GSM -> local estrogen' },
  { id: 'gyn-sti', domain: 'gyn', org: 'CDC', name: 'Gonorrhea, chlamydia & syphilis treatment', focus: 'GC ceftriaxone 500mg IM (1g if >=150kg); chlamydia doxycycline 100 BID x7 (azithro 1g if pregnant); syphilis benzathine PCN G 2.4M single dose early vs weekly x3 late; pregnancy: desensitize if PCN-allergic; test of cure pregnancy; partners; retest 3mo' },
  { id: 'gyn-pid', domain: 'gyn', org: 'CDC', name: 'Pelvic inflammatory disease', focus: 'minimum criteria CMT or uterine or adnexal tenderness in at-risk; low threshold; outpatient ceftriaxone IM + doxy x14 + metronidazole; hospitalize if TOA/pregnant/severe/failed PO; sequelae infertility/ectopic/chronic pain; IUD stays' },
  { id: 'gyn-vaginitis', domain: 'gyn', org: 'CDC', name: 'Vaginitis', focus: 'BV Amsel criteria, clue cells, pH>4.5, metronidazole, no partner tx; candida normal pH, pseudohyphae, fluconazole; trich motile flagellates, pH>4.5, strawberry cervix, metronidazole + partner tx; wet mount first-line' },
]

const KEYPOINTS = {
  type: 'object', additionalProperties: false,
  required: ['id', 'domain', 'name', 'org', 'prompt', 'keyPoints', 'pearls', 'reviewed'],
  properties: {
    id: { type: 'string' }, domain: { type: 'string' }, name: { type: 'string' },
    org: { type: 'string' }, prompt: { type: 'string' },
    keyPoints: {
      type: 'array', minItems: 2, maxItems: 4,
      items: {
        type: 'object', additionalProperties: false, required: ['group', 'items'],
        properties: {
          group: { type: 'string' },
          items: { type: 'array', minItems: 1, maxItems: 5, items: { type: 'string', maxLength: 80 } },
        },
      },
    },
    pearls: { type: 'string' }, reviewed: { type: 'string' },
  },
}
const GEN_SCHEMA = { type: 'object', additionalProperties: false, required: ['drill'], properties: { drill: KEYPOINTS } }
const VERIFY_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['drill', 'changes', 'volatile'],
  properties: {
    drill: KEYPOINTS,
    changes: { type: 'array', items: { type: 'string' } },
    volatile: { type: 'array', items: { type: 'string' } },
  },
}

const EXEMPLAR = `{"id":"screen-lung","domain":"screening","name":"Lung cancer screening","org":"USPSTF","prompt":"Recall the lung cancer screening guideline: modality, age range, pack-year threshold, and stop rules.","keyPoints":[{"group":"Modality & interval","items":["Annual low-dose chest CT (LDCT)"]},{"group":"Eligibility","items":["Ages 50–80","≥20 pack-year smoking history","Currently smoking or quit within the past 15 years"]},{"group":"Stop","items":["Quit ≥15 years ago","Develops a health problem that limits life expectancy or curative lung surgery"]}],"pearls":"2021 USPSTF broadened this: age 50 (was 55) and 20 pack-years (was 30).","reviewed":"2026-07-13"}`

const genPrompt = (t) => `You are authoring ONE recall drill for a medical student's OB/GYN clerkship app.
Topic: "${t.name}" — anchored to ${t.org}. Cover: ${t.focus}
Fixed fields: id="${t.id}", domain="${t.domain}", org="${t.org}", reviewed="2026-07-17".
Write:
- "prompt": one cued sentence naming the dimensions to recall (like "Recall X: A, B, and C.").
- "keyPoints": 2-4 groups, 1-5 items each, 8-16 items TOTAL. Each item is ONE crisp recallable fact,
  <=80 characters, with the actual numbers/drugs/doses/thresholds (never vague like "give appropriate abx").
  Items are the graded answer key: a student who recites them has the guideline cold for the shelf.
- "pearls": 1-3 sentences of depth/nuance that did NOT fit as items (mnemonics, recent changes, classic traps).
Style exemplar (from the sibling FM set — match its density and tone):
${EXEMPLAR}
Return via StructuredOutput only.`

const verifyPrompt = (drill, t, pass) => `Adversarial fact-check, pass ${pass} of 2. You are a skeptical OB/GYN attending.
This recall drill claims to state ${t.org} guidance on "${t.name}". Drill JSON:
${JSON.stringify(drill)}
Check EVERY number, drug, dose, threshold, age, and time window against current ${t.org} guidance
(and standard OB/GYN shelf references). Use WebSearch if unsure — especially for anything that changes
year to year (vaccine windows, screening ages). Then return the CORRECTED full drill:
- Fix any wrong fact. Cut (or move to pearls, hedged) anything you cannot confirm.
- Enforce: 2-4 groups, 1-5 items/group, 8-16 items total, every item <=80 chars (shorten wordy items;
  push lost nuance into pearls). Keep id/domain/org/reviewed unchanged.
- "changes": one line per correction you made (empty array if none).
- "volatile": facts here that are seasonal/frequently-updated (e.g. RSV window, COVID cadence, ASCCP
  details, GDM threshold convention) that a future maintainer must re-verify. Empty array if none.
Return via StructuredOutput only.`

const results = await pipeline(
  B,
  (t) => agent(genPrompt(t), { label: `gen:${t.id}`, phase: 'Generate', schema: GEN_SCHEMA }),
  (g, t) => agent(verifyPrompt(g.drill, t, 1), { label: `v1:${t.id}`, phase: 'Verify 1', schema: VERIFY_SCHEMA, effort: 'high' }),
  (v1, t) => agent(verifyPrompt(v1.drill, t, 2), { label: `v2:${t.id}`, phase: 'Verify 2', schema: VERIFY_SCHEMA, effort: 'high' })
    .then((v2) => ({ drill: v2.drill, changes: [...v1.changes, ...v2.changes], volatile: [...new Set([...v1.volatile, ...v2.volatile])] })),
)
const ok = results.filter(Boolean)
log(`${ok.length}/${B.length} drills verified`)
return { drills: ok }
```

- [ ] **Step 2: Save the result** — write the workflow's returned `drills` array to `$CLAUDE_JOB_DIR/tmp/ob_drills_work/verified_drills.json`. If any of the 40 came back null (skipped/error), re-run ONLY those via a fresh workflow launch with the blueprint filtered to the missing ids (fresh launch, not resume — resume of a stopped run can fail).

- [ ] **Step 3: Sanity-check the JSON**

```bash
node -e '
const d = require(process.env.CLAUDE_JOB_DIR + "/tmp/ob_drills_work/verified_drills.json");
const errs = [];
if (d.length !== 40) errs.push(`count ${d.length}`);
for (const { drill } of d) {
  const n = drill.keyPoints.reduce((a, g) => a + g.items.length, 0);
  if (n < 8 || n > 16) errs.push(`${drill.id}: ${n} items`);
  for (const g of drill.keyPoints) for (const it of g.items) if (it.length > 80) errs.push(`${drill.id}: >80c "${it}"`);
  if (drill.reviewed !== "2026-07-17") errs.push(`${drill.id}: reviewed`);
}
console.log(errs.length ? errs.join("\n") : "OK 40 drills");
process.exit(errs.length ? 1 : 0)'
```

Expected: `OK 40 drills`. If a drill violates caps, fix it by hand (shorten items, move overflow to pearls) — do not relaunch for formatting.

---

### Task 6: OB data files + `OB_DRILL_BANK` + data-invariant tests

**Files:**
- Create: `src/data/obPrenatalDrills.ts`, `src/data/obComplicationDrills.ts`, `src/data/obLaborDrills.ts`, `src/data/obGynDrills.ts`, `src/data/obGuidelineDrills.ts`
- Modify: `src/data/guidelineDrillBank.ts` (add OB bank to the list)
- Test: `src/data/__tests__/obGuidelineDrills.test.ts`

**Interfaces:**
- Consumes: `verified_drills.json` (Task 5); `GuidelineDrill`, `DrillDomainDef`, `DrillBank` (Task 1).
- Produces: `OB_GUIDELINE_DRILLS: GuidelineDrill[]` (40), `OB_DOMAINS: DrillDomainDef[]`, `OB_DRILL_BANK: DrillBank`; `GUIDELINE_DRILL_BANKS` becomes `[FM_DRILL_BANK, OB_DRILL_BANK]` (which automatically extends `DRILL_STORAGE_KEYS`, ALL_KEYS, and the Analytics sections).

- [ ] **Step 1: Write the failing data test**

```ts
// src/data/__tests__/obGuidelineDrills.test.ts
import { describe, it, expect } from "vitest";
import { OB_GUIDELINE_DRILLS, OB_DOMAINS } from "../obGuidelineDrills";
import { OB_DRILL_BANK, GUIDELINE_DRILL_BANKS, DRILL_STORAGE_KEYS } from "../guidelineDrillBank";

describe("OB/GYN guideline drills (data)", () => {
  it("has 40 drills, 10 per domain", () => {
    expect(OB_GUIDELINE_DRILLS).toHaveLength(40);
    for (const dom of OB_DOMAINS) {
      expect(OB_GUIDELINE_DRILLS.filter((d) => d.domain === dom.id), dom.id).toHaveLength(10);
    }
  });

  it("every drill respects the density caps", () => {
    const ids = OB_GUIDELINE_DRILLS.map((d) => d.id);
    expect(new Set(ids).size, "unique ids").toBe(ids.length);
    const domains = new Set(OB_DOMAINS.map((d) => d.id));
    for (const d of OB_GUIDELINE_DRILLS) {
      expect(domains.has(d.domain), `${d.id} domain`).toBe(true);
      expect(d.org.length, `${d.id} org`).toBeGreaterThan(1);
      expect(d.prompt.length, `${d.id} prompt`).toBeGreaterThan(15);
      expect(d.reviewed).toBe("2026-07-17");
      expect(d.keyPoints.length, `${d.id} groups`).toBeGreaterThanOrEqual(2);
      expect(d.keyPoints.length, `${d.id} groups`).toBeLessThanOrEqual(4);
      const total = d.keyPoints.reduce((a, g) => a + g.items.length, 0);
      expect(total, `${d.id} total items`).toBeGreaterThanOrEqual(8);
      expect(total, `${d.id} total items`).toBeLessThanOrEqual(16);
      for (const g of d.keyPoints) {
        expect(g.items.length, `${d.id}/${g.group} items`).toBeLessThanOrEqual(5);
        for (const it of g.items) {
          expect(it.length, `${d.id} item too long: "${it}"`).toBeLessThanOrEqual(80);
          expect(it.trim().length, `${d.id} empty item`).toBeGreaterThan(2);
        }
      }
    }
  });

  it("OB bank is registered with its own storage key", () => {
    expect(OB_DRILL_BANK.id).toBe("ob");
    expect(OB_DRILL_BANK.storageKey).toBe("osce.obdrills.v1");
    expect(OB_DRILL_BANK.domains.map((d) => d.id)).toEqual(["prenatal", "complications", "labor", "gyn"]);
    expect(GUIDELINE_DRILL_BANKS.map((b) => b.id)).toEqual(["fm", "ob"]);
    expect(DRILL_STORAGE_KEYS).toContain("osce.obdrills.v1");
  });
});
```

Run: `npx vitest run src/data/__tests__/obGuidelineDrills.test.ts` — Expected: FAIL (module missing).

- [ ] **Step 2: Convert JSON → the four domain TS files** with this one-shot script (writes real literals, not runtime JSON loads):

```bash
node "$CLAUDE_JOB_DIR/tmp/ob_drills_work/emit_ts.mjs"
```

```js
// $CLAUDE_JOB_DIR/tmp/ob_drills_work/emit_ts.mjs
import { readFileSync, writeFileSync } from "node:fs";
const WORK = process.env.CLAUDE_JOB_DIR + "/tmp/ob_drills_work";
const REPO = "/Users/williamsaccount/osce-simulator/.claude/worktrees/obgyn-drills";
const raw = JSON.parse(readFileSync(`${WORK}/verified_drills.json`, "utf8"));
const FILES = {
  prenatal: ["obPrenatalDrills.ts", "OB_PRENATAL_DRILLS", "Prenatal & routine care"],
  complications: ["obComplicationDrills.ts", "OB_COMPLICATION_DRILLS", "OB complications & emergencies"],
  labor: ["obLaborDrills.ts", "OB_LABOR_DRILLS", "Labor, delivery & fetal monitoring"],
  gyn: ["obGynDrills.ts", "OB_GYN_DRILLS", "Gynecology"],
};
const esc = (s) => JSON.stringify(s);
for (const [domain, [file, constName, label]] of Object.entries(FILES)) {
  const drills = raw.filter((r) => r.drill.domain === domain).map((r) => r.drill);
  const body = drills.map((d) => `  {
    id: ${esc(d.id)},
    domain: ${esc(d.domain)},
    name: ${esc(d.name)},
    org: ${esc(d.org)},
    prompt: ${esc(d.prompt)},
    keyPoints: [
${d.keyPoints.map((g) => `      { group: ${esc(g.group)}, items: [${g.items.map(esc).join(", ")}] },`).join("\n")}
    ],
    pearls: ${esc(d.pearls)},
    reviewed: ${esc(d.reviewed)},
  },`).join("\n");
  writeFileSync(`${REPO}/src/data/${file}`,
`import type { GuidelineDrill } from "./guidelineDrillBank";

/** ${label} drills — generated 2026-07-17 (gen -> 2x adversarial verify),
 *  human-gated via docs/obgyn-drills-review.md. */
export const ${constName}: GuidelineDrill[] = [
${body}
];
`);
  console.log(`${file}: ${drills.length} drills`);
}
```

Expected output: 4 lines, `10 drills` each.

- [ ] **Step 3: Write the aggregator**

```ts
// src/data/obGuidelineDrills.ts
import type { DrillDomainDef, GuidelineDrill } from "./guidelineDrillBank";
import { OB_PRENATAL_DRILLS } from "./obPrenatalDrills";
import { OB_COMPLICATION_DRILLS } from "./obComplicationDrills";
import { OB_LABOR_DRILLS } from "./obLaborDrills";
import { OB_GYN_DRILLS } from "./obGynDrills";

export const OB_DOMAINS: DrillDomainDef[] = [
  { id: "prenatal", label: "Prenatal & Routine", emoji: "🤰" },
  { id: "complications", label: "Complications", emoji: "🚨" },
  { id: "labor", label: "Labor & Monitoring", emoji: "👶" },
  { id: "gyn", label: "GYN", emoji: "🌸" },
];

export const OB_GUIDELINE_DRILLS: GuidelineDrill[] = [
  ...OB_PRENATAL_DRILLS,
  ...OB_COMPLICATION_DRILLS,
  ...OB_LABOR_DRILLS,
  ...OB_GYN_DRILLS,
];
```

- [ ] **Step 4: Register the OB bank** — in `src/data/guidelineDrillBank.ts`, add below `FM_DRILL_BANK` (import `OB_DOMAINS`/`OB_GUIDELINE_DRILLS` from `./obGuidelineDrills` at top):

```ts
export const OB_DRILL_BANK: DrillBank = {
  id: "ob",
  title: "Guideline Drills",
  blurb:
    "Master one guideline at a time — recall its key facts, graded instantly. Prenatal care, OB complications, labor & fetal monitoring, and gynecology for the OB/GYN shelf.",
  icon: "🎯",
  grad: "var(--grad-coral)",
  clerkshipLabel: "OB/GYN",
  domains: OB_DOMAINS,
  drills: OB_GUIDELINE_DRILLS,
  storageKey: "osce.obdrills.v1",
};
```

and change `export const GUIDELINE_DRILL_BANKS: DrillBank[] = [FM_DRILL_BANK];` to `[FM_DRILL_BANK, OB_DRILL_BANK]`.

(Import cycle check: `obGuidelineDrills.ts` imports only *types* from `guidelineDrillBank.ts` — type-only, erased at runtime, no cycle. Keep it `import type`.)

- [ ] **Step 5: Run tests + typecheck**

Run: `npx vitest run src/data/__tests__/obGuidelineDrills.test.ts src/data/__tests__/guidelineDrillBank.test.ts && npx tsc -b`
Expected: PASS + clean. (guidelineDrillBank.test.ts's lockstep test now covers both banks.)

- [ ] **Step 6: Commit**

```bash
git add src/data
git commit -m "feat(ob-drills): 40 verified OB/GYN guideline drills across 4 domains + OB bank"
```

---

### Task 7: OB wiring — view, route, clerkship tool, guard tests

**Files:**
- Modify: `src/ui/store.ts` (View union line 63; VIEW_HASH ~line 171)
- Modify: `src/ui/clerkships.ts` (obgyn tools array ~line 146)
- Modify: `src/App.tsx` (render + OB bank import)
- Modify: `src/ui/__tests__/guidelineDrills.test.tsx` (add OB render test)
- Modify: `src/ui/__tests__/analytics.test.tsx` (OB section guard)

**Interfaces:**
- Consumes: `OB_DRILL_BANK` (Task 6), `GuidelineDrills` (Task 3).
- Produces: view `obdrills` reachable at `#/ob-drills` from the OB/GYN clerkship tab.

- [ ] **Step 1: Add the failing tests.** In `guidelineDrills.test.tsx` append:

```tsx
import { OB_DRILL_BANK } from "../../data/guidelineDrillBank";

describe("GuidelineDrills screen (OB bank)", () => {
  beforeEach(() => localStorage.clear());

  it("renders the OB domains and first drill without touching FM state", () => {
    render(<GuidelineDrills bank={OB_DRILL_BANK} />);
    expect(screen.getByRole("button", { name: /Prenatal & Routine/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Complications/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Labor & Monitoring/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /GYN/ })).toBeInTheDocument();
    // default mode is category — a prompt card is on screen
    expect(screen.getByText(/Category 1 of/)).toBeInTheDocument();
    expect(localStorage.getItem("osce.fmdrills.v1")).toBeNull();
  });
});
```

In `analytics.test.tsx`, mirror the existing FM seeding/assertion pattern: seed `osce.obdrills.v1` the same way the FM key is seeded, render, and assert `screen.getByText(/Guideline drills \(OB\/GYN\)/)` is present.

Run: `npx vitest run src/ui/__tests__/guidelineDrills.test.tsx src/ui/__tests__/analytics.test.tsx`
Expected: the new OB screen test PASSES already (the screen is generic); the analytics OB-section test PASSES already (sections map over banks). If either fails, that's a real wiring bug — fix before proceeding. These are guards, not TDD reds.

- [ ] **Step 2: Register the view.** In `src/ui/store.ts` line 63 add `| "obdrills"` to the `View` union; in `VIEW_HASH` add after `fmdrills`:

```ts
  obdrills: "#/ob-drills",
```

- [ ] **Step 3: Add the clerkship tool.** In `src/ui/clerkships.ts`, in the `obgyn` entry's `tools` array after the Questions tool:

```ts
      {
        view: "obdrills",
        label: "Drills",
        icon: "🎯",
        grad: "var(--grad-coral)",
        blurb:
          "Master one guideline at a time — prenatal care, obstetric emergencies, labor & fetal monitoring, and gynecology (ACOG, ASCCP, CDC) — by recalling the key facts, graded instantly.",
      },
```

- [ ] **Step 4: Render it.** In `src/App.tsx`: extend the bank import to `import { FM_DRILL_BANK, OB_DRILL_BANK } from "./data/guidelineDrillBank";` and add next to the fmdrills line:

```tsx
{view === "obdrills" && <GuidelineDrills key="ob" bank={OB_DRILL_BANK} />}
```

- [ ] **Step 5: Run the wiring-adjacent suites + typecheck**

Run: `npx vitest run src/ui/__tests__/guidelineDrills.test.tsx src/ui/__tests__/analytics.test.tsx src/analytics/__tests__/store.test.ts src/ui/__tests__/store.test.ts && npx tsc -b`
Expected: all PASS (store.test.ts confirms no View regressions), tsc clean.

- [ ] **Step 6: Commit**

```bash
git add src/ui src/App.tsx
git commit -m "feat(ob-drills): obdrills view + #/ob-drills route + OB/GYN clerkship Drills tool"
```

---

### Task 8: Human review sheet

**Files:**
- Create: `docs/obgyn-drills-review.md` (generated)

**Interfaces:**
- Consumes: `verified_drills.json` (Task 5 — has `changes`/`volatile` sidecars the TS files dropped).
- Produces: the review document the user gates the merge on.

- [ ] **Step 1: Generate the sheet**

```js
// $CLAUDE_JOB_DIR/tmp/ob_drills_work/emit_review.mjs
import { readFileSync, writeFileSync } from "node:fs";
const WORK = process.env.CLAUDE_JOB_DIR + "/tmp/ob_drills_work";
const REPO = "/Users/williamsaccount/osce-simulator/.claude/worktrees/obgyn-drills";
const raw = JSON.parse(readFileSync(`${WORK}/verified_drills.json`, "utf8"));
const ORDER = ["prenatal", "complications", "labor", "gyn"];
const TITLES = { prenatal: "🤰 Prenatal & Routine", complications: "🚨 Complications", labor: "👶 Labor & Monitoring", gyn: "🌸 GYN" };
let md = `# OB/GYN Guideline Drills — Review Sheet\n\nGenerated 2026-07-17 from the gen → 2× adversarial-verify pipeline. Every graded fact\nis listed below — review before merge. ⚠️ marks **volatile** facts to re-verify when\nguidelines update (they are also the ones most worth double-checking now).\n\n`;
for (const dom of ORDER) {
  md += `\n## ${TITLES[dom]}\n`;
  for (const { drill, volatile } of raw.filter((r) => r.drill.domain === dom)) {
    md += `\n### ${drill.name} (${drill.org}) — \`${drill.id}\`\n\n`;
    for (const g of drill.keyPoints) {
      md += `**${g.group}**\n`;
      for (const it of g.items) md += `- ${it}\n`;
    }
    if (drill.pearls) md += `\n*Pearls:* ${drill.pearls}\n`;
    if (volatile.length) md += `\n⚠️ **Volatile — re-verify on guideline updates:**\n${volatile.map((v) => `- ⚠️ ${v}`).join("\n")}\n`;
  }
}
writeFileSync(`${REPO}/docs/obgyn-drills-review.md`, md);
console.log("review sheet written");
```

Run: `node "$CLAUDE_JOB_DIR/tmp/ob_drills_work/emit_review.mjs"` — Expected: `review sheet written`; spot-check the file renders sanely (40 `###` headings: `grep -c '^### ' docs/obgyn-drills-review.md` → 40).

- [ ] **Step 2: Commit**

```bash
git add docs/obgyn-drills-review.md
git commit -m "docs(ob-drills): human review sheet with volatile-fact badges"
```

---

### Task 9: Full verification + ship

**Files:** none new.

- [ ] **Step 1: Full test suite**

Run: `npx vitest run`
Expected: all pass. If differentials/shelf/workup-management/library files fail or time out, re-run each individually (`npx vitest run <file>`) — they are known flaky under full-suite load and must pass in isolation.

- [ ] **Step 2: Typecheck + prod build**

Run: `npx tsc -b && npm run build`
Expected: both clean.

- [ ] **Step 3: Smoke the running app** (use the `verify`/`run` skill flow): `npm run dev`, open `#/ob-drills` — OB tab shows Questions + Drills; drill loads in category mode; grade one answer; check Analytics `#/performance` shows "Guideline drills (OB/GYN)"; check export includes `osce.obdrills.v1`.

- [ ] **Step 4: Push + draft PR**

```bash
git push -u origin worktree-obgyn-drills
gh pr create --draft --title "OB/GYN Guideline Drills (40 drills, bank-driven refactor)" --body "..."
```

PR body: summary of refactor invariants + content pipeline + a pointer to `docs/obgyn-drills-review.md` as the human gate. End body with the Claude Code attribution line.

- [ ] **Step 5: Tell the user** the PR is up and that `docs/obgyn-drills-review.md` is the review gate before merging.
