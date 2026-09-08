import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GuidelineDrills } from "../screens/GuidelineDrills";
import { FM_DRILL_BANK, OB_DRILL_BANK } from "../../data/guidelineDrillBank";

describe("FmDrills screen", () => {
  beforeEach(() => localStorage.clear());

  it("full-recall mode grades a recall answer and records progress", async () => {
    render(<GuidelineDrills bank={FM_DRILL_BANK} />);
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
    render(<GuidelineDrills bank={FM_DRILL_BANK} />);
    expect(screen.getByText(/Category 1 of/)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: /your recall/i }), {
      target: { value: "start at 45" },
    });
    fireEvent.click(screen.getByRole("button", { name: /grade this category/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /next category/i })).toBeInTheDocument(),
    );
  });

  it("category mode can reveal one category without credit, then continue", () => {
    render(<GuidelineDrills bank={FM_DRILL_BANK} />);
    expect(screen.getByText(/Category 1 of/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^👁 This category$/ }));
    expect(screen.getByText(/Revealed · not credited/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next category/i })).toBeInTheDocument();
    // revealing a category is not an attempt — nothing recorded yet
    expect(screen.getByText(/Seen 0\//)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /next category/i }));
    expect(screen.getByText(/Category 2 of/)).toBeInTheDocument();
  });

  it("category mode can reveal the entire answer flow, logged as seen", () => {
    render(<GuidelineDrills bank={FM_DRILL_BANK} />);
    fireEvent.click(screen.getByRole("button", { name: /entire answer flow/i }));
    expect(screen.getByText(/^Answer flow$/)).toBeInTheDocument();
    expect(screen.getByText(/Revealed · logged as seen/)).toBeInTheDocument();
    // every category of the drill is shown in order
    for (const g of FM_DRILL_BANK.drills[0].keyPoints) {
      expect(screen.getByText(g.group)).toBeInTheDocument();
    }
    expect(screen.getByText(/Seen 1\//)).toBeInTheDocument();
    // back to where you were — category 1, untouched
    fireEvent.click(screen.getByRole("button", { name: /^← Back$/ }));
    expect(screen.getByText(/Category 1 of/)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /your recall/i })).toHaveValue("");
  });

  it("a category reveal can be backed out of, keeping the draft", () => {
    render(<GuidelineDrills bank={FM_DRILL_BANK} />);
    fireEvent.change(screen.getByRole("textbox", { name: /your recall/i }), { target: { value: "draft" } });
    fireEvent.click(screen.getByRole("button", { name: /^👁 This category$/ }));
    expect(screen.getByText(/Revealed · not credited/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^← Back$/ }));
    expect(screen.queryByText(/Revealed · not credited/)).not.toBeInTheDocument();
    const box = screen.getByRole("textbox", { name: /your recall/i });
    expect(box).not.toBeDisabled();
    expect(box).toHaveValue("draft");
    expect(screen.getByRole("button", { name: /grade this category/i })).toBeInTheDocument();
  });

  it("can step back to a graded category and forward again", async () => {
    render(<GuidelineDrills bank={FM_DRILL_BANK} />);
    fireEvent.change(screen.getByRole("textbox", { name: /your recall/i }), { target: { value: "start at 45" } });
    fireEvent.click(screen.getByRole("button", { name: /grade this category/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /next category/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /next category/i }));
    expect(screen.getByText(/Category 2 of/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /previous category/i }));
    // category 1 comes back in its graded state with the original answer
    expect(screen.getByText(/Category 1 of/)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /your recall/i })).toHaveValue("start at 45");
    expect(screen.getByRole("button", { name: /next category/i })).toBeInTheDocument();
  });

  it("Previous and Skip move through the drills in order, wrapping", () => {
    render(<GuidelineDrills bank={FM_DRILL_BANK} />);
    const pool = FM_DRILL_BANK.drills.filter((d) => d.domain === FM_DRILL_BANK.domains[0].id);
    const chip = (name: string) => screen.getByText(new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} · `));
    expect(chip(pool[0].name)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Skip →$/ }));
    expect(chip(pool[1].name)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^← Previous$/ }));
    expect(chip(pool[0].name)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^← Previous$/ }));
    expect(chip(pool[pool.length - 1].name)).toBeInTheDocument();
  });

  it("flashcard mode flips to the answer and self-rating advances", () => {
    render(<GuidelineDrills bank={FM_DRILL_BANK} />);
    fireEvent.click(screen.getByRole("button", { name: /flashcard/i }));
    expect(screen.getByText(/Tap to flip/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /tap to flip/i }));
    expect(screen.getByRole("button", { name: /got it/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /got it/i }));
    // advanced to the next guideline — a fresh flip card
    expect(screen.getByText(/Tap to flip/)).toBeInTheDocument();
  });

  it("switches domains via the segmented control", () => {
    render(<GuidelineDrills bank={FM_DRILL_BANK} />);
    fireEvent.click(screen.getByRole("button", { name: /Immunizations/ }));
    expect(screen.getByText(/Prompt/)).toBeInTheDocument();
  });
});

describe("GuidelineDrills screen (OB bank)", () => {
  beforeEach(() => localStorage.clear());

  it("category mode grades the recall head of a '<head> — <detail>' item", async () => {
    render(<GuidelineDrills bank={OB_DRILL_BANK} />);
    fireEvent.click(screen.getByRole("button", { name: /Case vignettes/ }));
    fireEvent.change(screen.getByRole("textbox", { name: /your recall/i }), { target: { value: "ectopic" } });
    fireEvent.click(screen.getByRole("button", { name: /grade this category/i }));
    // the full item is displayed, but only its head had to be typed
    await waitFor(() => expect(screen.getByText(/^✓ Ectopic — /)).toBeInTheDocument());
  });

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
