import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Shelf } from "../screens/Shelf";
import { SHELF_CONDITIONS, SHELF_DRUGS } from "../../data/shelf";

describe("Shelf study bank (data)", () => {
  it("every condition card is complete and think-first ready", () => {
    expect(SHELF_CONDITIONS.length).toBeGreaterThanOrEqual(20);
    const ids = SHELF_CONDITIONS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length); // unique ids
    for (const c of SHELF_CONDITIONS) {
      expect(c.name.length, `${c.id} name`).toBeGreaterThan(0);
      expect(c.system.length, `${c.id} system`).toBeGreaterThan(0);
      expect(c.presentation.length, `${c.id} presentation`).toBeGreaterThan(20);
      expect(c.keyId.length, `${c.id} key ID`).toBeGreaterThan(10);
      expect(c.riskFactors.length, `${c.id} risk factors`).toBeGreaterThan(0);
    }
  });

  it("the drug appendix lists drug, class, and side effects", () => {
    expect(SHELF_DRUGS.length).toBeGreaterThanOrEqual(15);
    for (const d of SHELF_DRUGS) {
      expect(d.drug.length).toBeGreaterThan(0);
      expect(d.klass.length).toBeGreaterThan(0);
      expect(d.effects.length).toBeGreaterThan(10);
    }
  });
});

describe("Shelf screen", () => {
  it("shows presentation up front and reveals fields on demand", () => {
    render(<Shelf />);
    expect(screen.getByRole("heading", { name: /shelf study/i })).toBeInTheDocument();
    // The diagnosis answers stay hidden until revealed (not in any presentation).
    const reveals = screen.getAllByRole("button", { name: /reveal/i });
    expect(reveals.length).toBeGreaterThan(0);
    expect(screen.queryByText(/coronary angiography/i)).not.toBeInTheDocument();
    // "Reveal all" on the first card surfaces its hidden diagnosis field.
    fireEvent.click(screen.getAllByRole("button", { name: /reveal all/i })[0]);
    expect(screen.getByText(/coronary angiography/i)).toBeInTheDocument();
  });

  it("switches to the drug side-effect appendix", () => {
    render(<Shelf />);
    fireEvent.click(screen.getByRole("button", { name: "Drug side effects" }));
    expect(screen.getByText(/Amiodarone/)).toBeInTheDocument();
    expect(screen.getByText(/high-yield drug side effects/i)).toBeInTheDocument();
  });
});
