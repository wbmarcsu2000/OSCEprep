import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Differentials } from "../screens/Differentials";

describe("Differential Atlas", () => {
  it("lists complaints and toggles core ⟷ advanced", () => {
    render(<Differentials />);
    expect(screen.getByRole("heading", { name: /differential atlas/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Chest Pain" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Joint Pain" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Back Pain" })).toBeInTheDocument();
    // An advanced-only cause is hidden in Core...
    expect(document.body.textContent).not.toContain("Gonococcal arthritis");
    fireEvent.click(screen.getByRole("button", { name: /^Advanced$/ }));
    // ...and revealed once Advanced is selected.
    expect(document.body.textContent).toContain("Gonococcal arthritis");
  });

  it("can focus a single complaint", () => {
    render(<Differentials />);
    fireEvent.change(screen.getByLabelText(/^Complaint$/i), { target: { value: "Back Pain" } });
    expect(screen.getByRole("heading", { name: "Back Pain" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Chest Pain" })).not.toBeInTheDocument();
  });
});
