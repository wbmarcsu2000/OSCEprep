import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import { DrillTypeRail } from "../components/DrillTypeRail";
import { Drills } from "../screens/Drills";
import {
  DRILL_TAB_GROUPS,
  DRILL_TYPE_LABELS,
  drillCatalog,
  drillKey,
  type DrillType,
  type DrillProgressMap,
} from "../../data/drillProgress";
import { EXAM_DRILLS } from "../../data/examDrills";

const ALL_TYPES: DrillType[] = DRILL_TAB_GROUPS.flatMap((g) => g.types);

describe("DrillTypeRail", () => {
  it("exposes every drill type as a button so none is clipped off-screen", () => {
    render(<DrillTypeRail type="differential" progress={{}} onSelect={() => {}} />);
    const nav = screen.getByRole("navigation", { name: /drill type/i });
    expect(ALL_TYPES.length).toBe(18);
    for (const t of ALL_TYPES) {
      expect(
        within(nav).getByRole("button", { name: new RegExp(DRILL_TYPE_LABELS[t], "i") }),
        `${t} reachable`,
      ).toBeInTheDocument();
    }
  });

  it("marks the active type pressed and the rest not", () => {
    render(<DrillTypeRail type="differential" progress={{}} onSelect={() => {}} />);
    const nav = screen.getByRole("navigation", { name: /drill type/i });
    expect(within(nav).getByRole("button", { name: /differential/i })).toHaveAttribute("aria-pressed", "true");
    expect(within(nav).getByRole("button", { name: /^management/i })).toHaveAttribute("aria-pressed", "false");
  });

  it("reports the chosen type through onSelect", () => {
    const picks: DrillType[] = [];
    render(<DrillTypeRail type="differential" progress={{}} onSelect={(t) => picks.push(t)} />);
    const nav = screen.getByRole("navigation", { name: /drill type/i });
    fireEvent.click(within(nav).getByRole("button", { name: /^CXR/i }));
    expect(picks).toContain("cxr");
  });

  it("surfaces a per-type mastery count once a problem is attempted", () => {
    const firstId = drillCatalog("differential")[0].id;
    const progress: DrillProgressMap = {
      [drillKey("differential", firstId)]: {
        attempts: 1,
        bestPct: 90,
        lastPct: 90,
        lastSeenAt: 0,
        manual: "none",
      },
    };
    render(<DrillTypeRail type="differential" progress={progress} onSelect={() => {}} />);
    const nav = screen.getByRole("navigation", { name: /drill type/i });
    const diff = within(nav).getByRole("button", { name: /differential/i });
    // "<mastered>/<total>" count is part of the button's accessible name once seen.
    expect(diff.textContent).toMatch(/\d+\/\d+/);
  });
});

describe("Drills screen", () => {
  beforeEach(() => localStorage.clear());

  it("mounts with the side rail and the default differential workspace", () => {
    render(<Drills />);
    expect(screen.getByRole("navigation", { name: /drill type/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /framework drills/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your differential/i)).toBeInTheDocument();
  });

  it("opens the High-Yield deck and renders an integrated case", () => {
    render(<Drills />);
    fireEvent.click(screen.getByRole("button", { name: /high-yield/i }));
    expect(screen.getByText(/crushing substernal chest pressure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your answer/i)).toBeInTheDocument();
  });

  it("opens the Antibiotics bank and renders a scenario", () => {
    render(<Drills />);
    fireEvent.click(screen.getByRole("button", { name: /^antibiotics/i }));
    expect(screen.getByText(/productive cough/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your answer/i)).toBeInTheDocument();
  });

  it("filters the High-Yield deck to a single category", () => {
    render(<Drills />);
    fireEvent.click(screen.getByRole("button", { name: /high-yield/i }));
    // Default ("All") opens on the first integrated case.
    expect(screen.getByText(/crushing substernal chest pressure/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/high-yield category/i), {
      target: { value: "Empiric antibiotics" },
    });
    // Now the deck is scoped to antibiotics — the integrated STEMI case is gone.
    expect(screen.queryByText(/crushing substernal chest pressure/i)).not.toBeInTheDocument();
    expect(screen.getByText(/admitted for pneumonia/i)).toBeInTheDocument();
  });

  it("filters the High-Yield deck by mastery status", () => {
    // Seed the DKA case as mastered (best% >= mastery threshold).
    localStorage.setItem(
      "osce.drills.v1",
      JSON.stringify({
        "high-yield:hy-dka": { attempts: 1, bestPct: 92, lastPct: 92, lastSeenAt: 0, manual: "none" },
      }),
    );
    render(<Drills />);
    fireEvent.click(screen.getByRole("button", { name: /high-yield/i }));
    fireEvent.change(screen.getByLabelText(/high-yield status/i), { target: { value: "mastered" } });
    // Jumps to the only mastered item — the DKA case.
    expect(screen.getByText(/glucose 480/i)).toBeInTheDocument();
  });
});

describe("Focused exam drill", () => {
  beforeEach(() => {
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
  });

  it("renders a vignette prompt with a grouped answer key, grades it, and persists the attempt", async () => {
    render(<Drills />);
    fireEvent.click(screen.getByRole("button", { name: /focused exam/i }));

    // Whichever drill the screen opened on, the prompt is its vignette and the
    // answer key must not be visible until it is graded.
    const shown = EXAM_DRILLS.find((d) => screen.queryByText(d.vignette) !== null);
    expect(shown, "an exam drill vignette is rendered").toBeTruthy();
    const drill = shown!;
    expect(screen.queryByText(drill.keyPoints[0].items[0])).not.toBeInTheDocument();

    // Answer with two items verbatim, then grade.
    const box = screen.getByRole("textbox");
    const named = [drill.keyPoints[0].items[0], drill.keyPoints[0].items[1] ?? ""].filter(Boolean);
    fireEvent.change(box, { target: { value: named.join("\n") } });
    fireEvent.click(screen.getByRole("button", { name: /grade my answer/i }));

    // Grading is async (the grader may be LLM-backed), so wait for the key to appear.
    await waitFor(() => expect(localStorage.getItem("osce.drills.v1")).not.toBeNull());

    // The attempt is recorded against this drill's own progress key.
    const saved = JSON.parse(localStorage.getItem("osce.drills.v1")!) as DrillProgressMap;
    const entry = saved[drillKey("exam", drill.id)];
    expect(entry, `progress saved under ${drillKey("exam", drill.id)}`).toBeTruthy();
    expect(entry.attempts).toBeGreaterThan(0);
    // Two of ~12 items named should score above zero but well short of mastery.
    expect(entry.bestPct).toBeGreaterThan(0);
    expect(entry.bestPct).toBeLessThan(80);
  });

  it("lists every exam drill in the browser, grouped by category", () => {
    const cat = drillCatalog("exam");
    expect(cat.length).toBe(EXAM_DRILLS.length);
    expect(new Set(cat.map((c) => c.group)).size).toBeGreaterThanOrEqual(8);
  });
});
