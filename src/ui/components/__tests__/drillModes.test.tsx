import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CategoryRecallDrill, FlashcardDrill } from "../drillModes";

const KEY_POINTS = [
  { group: "G1", items: ["alpha", "beta"] },
  { group: "G2", items: ["gamma"] },
];

describe("CategoryRecallDrill", () => {
  it("steps through categories one at a time and records overall coverage at the end", async () => {
    const onRecord = vi.fn();
    render(
      <CategoryRecallDrill
        prompt="Recall the test guideline."
        keyPoints={KEY_POINTS}
        pearls="PEARL_TEXT"
        onRecord={onRecord}
        onNew={() => {}}
        onSetManual={() => {}}
        newLabel="Next →"
        drillType="fm-screening"
      />,
    );

    // starts on category 1 of 2
    expect(screen.getByText(/Category 1 of 2/)).toBeInTheDocument();
    expect(screen.getByText("G1")).toBeInTheDocument();
    // category 2's group isn't on screen yet
    expect(screen.queryByText("G2")).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: /your recall/i }), { target: { value: "alpha beta" } });
    fireEvent.click(screen.getByRole("button", { name: /grade this category/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /next category/i })).toBeInTheDocument());

    // advance to category 2 (last)
    fireEvent.click(screen.getByRole("button", { name: /next category/i }));
    expect(screen.getByText(/Category 2 of 2/)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: /your recall/i }), { target: { value: "gamma" } });
    fireEvent.click(screen.getByRole("button", { name: /grade this category/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /see summary/i })).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /see summary/i }));
    expect(screen.getByText(/Summary/)).toBeInTheDocument();
    expect(screen.getByText(/PEARL_TEXT/)).toBeInTheDocument();
    // recorded once, with a numeric overall %
    expect(onRecord).toHaveBeenCalledTimes(1);
    expect(typeof onRecord.mock.calls[0][0]).toBe("number");
  });
});

describe("FlashcardDrill", () => {
  it("hides the answer until flipped, then 'Got it' records 100 and advances", () => {
    const onRecord = vi.fn();
    const onNew = vi.fn();
    render(
      <FlashcardDrill
        prompt="Recall the test guideline."
        keyPoints={KEY_POINTS}
        pearls="PEARL_TEXT"
        onRecord={onRecord}
        onNew={onNew}
        drillType="fm-screening"
      />,
    );

    expect(screen.queryByText("alpha")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /tap to flip/i }));
    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.getByText(/PEARL_TEXT/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /got it/i }));
    expect(onRecord).toHaveBeenCalledWith(100);
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it("'Missed' records 0 and advances", () => {
    const onRecord = vi.fn();
    const onNew = vi.fn();
    render(
      <FlashcardDrill
        prompt="Recall the test guideline."
        keyPoints={KEY_POINTS}
        onRecord={onRecord}
        onNew={onNew}
        drillType="fm-screening"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /tap to flip/i }));
    fireEvent.click(screen.getByRole("button", { name: /missed/i }));
    expect(onRecord).toHaveBeenCalledWith(0);
    expect(onNew).toHaveBeenCalledTimes(1);
  });
});
