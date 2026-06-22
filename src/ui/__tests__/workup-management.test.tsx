import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorkupManagement } from "../screens/WorkupManagement";

describe("Work-up & Management atlas", () => {
  it("keeps work-up and management hidden until revealed", () => {
    render(<WorkupManagement />);
    expect(screen.getByRole("heading", { name: /work-up & management/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Chest Pain" })).toBeInTheDocument();
    // Both sections start behind a Reveal; nothing is "Hide"-able yet.
    expect(screen.getAllByRole("button", { name: /reveal work-up/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /reveal management/i }).length).toBeGreaterThan(0);
    expect(screen.queryAllByRole("button", { name: /hide/i }).length).toBe(0);
    fireEvent.click(screen.getAllByRole("button", { name: /reveal work-up/i })[0]);
    expect(screen.getAllByRole("button", { name: /hide/i }).length).toBe(1);
  });

  it("can focus a single complaint", () => {
    render(<WorkupManagement />);
    fireEvent.change(screen.getByLabelText(/^Complaint$/i), { target: { value: "Joint Pain" } });
    expect(screen.getByRole("heading", { name: "Joint Pain" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Chest Pain" })).not.toBeInTheDocument();
  });
});
