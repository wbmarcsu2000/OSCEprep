import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Management } from "../screens/Management";

describe("Management Atlas", () => {
  it("lists managed diagnoses grouped by complaint, expandable to the full plan", () => {
    render(<Management />);
    expect(screen.getByRole("heading", { name: /management atlas/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Joint Pain" })).toBeInTheDocument();
    // Checklist (brief) hides the model plan; Full plan reveals it. Match the
    // exact "Model plan" label (the intro paragraph mentions "a model plan").
    expect(screen.queryAllByText("Model plan").length).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: /^Full plan$/ }));
    expect(screen.getAllByText("Model plan").length).toBeGreaterThan(0);
  });

  it("can focus a single complaint", () => {
    render(<Management />);
    fireEvent.change(screen.getByLabelText(/^Complaint$/i), { target: { value: "Back Pain" } });
    expect(screen.getByRole("heading", { name: "Back Pain" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Joint Pain" })).not.toBeInTheDocument();
  });
});
