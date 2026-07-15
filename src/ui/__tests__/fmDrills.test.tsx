import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FmDrills } from "../screens/FmDrills";

describe("FmDrills screen", () => {
  beforeEach(() => localStorage.clear());

  it("full-recall mode grades a recall answer and records progress", async () => {
    render(<FmDrills />);
    // default is category mode; switch to full recall for this flow
    fireEvent.click(screen.getByRole("button", { name: /full recall/i }));

    expect(screen.getByText(/^Prompt$/)).toBeInTheDocument();
    expect(screen.queryByText(/Guideline key points/)).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: /your recall/i }), {
      target: { value: "start at 45, colonoscopy every 10 years" },
    });
    fireEvent.click(screen.getByRole("button", { name: /grade my answer/i }));

    await waitFor(() => expect(screen.getByText(/Guideline key points/)).toBeInTheDocument());
    expect(screen.getByText(/Seen 1\//)).toBeInTheDocument();
  });

  it("defaults to category mode: grades one category at a time", async () => {
    render(<FmDrills />);
    expect(screen.getByText(/Category 1 of/)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: /your recall/i }), {
      target: { value: "start at 45" },
    });
    fireEvent.click(screen.getByRole("button", { name: /grade this category/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /next category/i })).toBeInTheDocument(),
    );
  });

  it("flashcard mode flips to the answer and self-rating advances", () => {
    render(<FmDrills />);
    fireEvent.click(screen.getByRole("button", { name: /flashcard/i }));
    expect(screen.getByText(/Tap to flip/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /tap to flip/i }));
    expect(screen.getByRole("button", { name: /got it/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /got it/i }));
    // advanced to the next guideline — a fresh flip card
    expect(screen.getByText(/Tap to flip/)).toBeInTheDocument();
  });

  it("switches domains via the segmented control", () => {
    render(<FmDrills />);
    fireEvent.click(screen.getByRole("button", { name: /Immunizations/ }));
    expect(screen.getByText(/Prompt/)).toBeInTheDocument();
  });
});
