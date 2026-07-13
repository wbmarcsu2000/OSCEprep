import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FmDrills } from "../screens/FmDrills";

describe("FmDrills screen", () => {
  beforeEach(() => localStorage.clear());

  it("shows a guideline prompt and grades a recall answer, recording progress", async () => {
    render(<FmDrills />);
    // A prompt is shown, but no answer key before grading.
    expect(screen.getByText(/^Prompt$/)).toBeInTheDocument();
    expect(screen.queryByText(/Guideline key points/)).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: /your recall/i }), {
      target: { value: "start at 45, colonoscopy every 10 years" },
    });
    fireEvent.click(screen.getByRole("button", { name: /grade my answer/i }));

    await waitFor(() => expect(screen.getByText(/Guideline key points/)).toBeInTheDocument());
    // Progress bar reflects at least one seen item.
    expect(screen.getByText(/Seen 1\//)).toBeInTheDocument();
  });

  it("switches domains via the segmented control", () => {
    render(<FmDrills />);
    fireEvent.click(screen.getByRole("button", { name: /Immunizations/ }));
    // The immunizations seed set includes a zoster/tetanus/influenza prompt.
    expect(screen.getByText(/Prompt/)).toBeInTheDocument();
  });
});
