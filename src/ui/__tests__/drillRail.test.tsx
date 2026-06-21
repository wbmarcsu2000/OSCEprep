import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
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

const ALL_TYPES: DrillType[] = DRILL_TAB_GROUPS.flatMap((g) => g.types);

describe("DrillTypeRail", () => {
  it("exposes every drill type as a button so none is clipped off-screen", () => {
    render(<DrillTypeRail type="differential" progress={{}} onSelect={() => {}} />);
    const nav = screen.getByRole("navigation", { name: /drill type/i });
    expect(ALL_TYPES.length).toBe(17);
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
});
