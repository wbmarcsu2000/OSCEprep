import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { GuidelineDrills } from "../screens/GuidelineDrills";
import { OB_DRILL_BANK, FM_DRILL_BANK, drillsForDomain } from "../../data/guidelineDrillBank";
import { ladderItems, seededShuffle } from "../../data/drillLadder";

/** The tumors & hormones domain is authored "<head> — <clue>" on every item, so
 *  every ladder mode applies to it. Its first drill is the one served first. */
const DOMAIN = "endo-tumors";
const DRILL = drillsForDomain(OB_DRILL_BANK, DOMAIN)[0];
const SEED = `${DOMAIN}:${DRILL.id}`;

function openTumors() {
  render(<GuidelineDrills bank={OB_DRILL_BANK} />);
  fireEvent.click(screen.getByRole("button", { name: /Tumors & hormones/ }));
}

describe("drill learning ladder", () => {
  beforeEach(() => localStorage.clear());

  it("offers the ladder in order, hiding Cloze for drills without clues", () => {
    render(<GuidelineDrills bank={FM_DRILL_BANK} />);
    const group = screen.getByRole("group", { name: /drill mode/i });
    const labels = within(group).getAllByRole("button").map((b) => b.textContent);
    expect(labels).toEqual(["📖 Learn", "🧩 Sort", "🗂 By category", "✍️ Full recall", "🃏 Flashcard"]);
  });

  it("Learn shows the study table, logs the drill as seen, and can cover the answer column", () => {
    openTumors();
    const group = screen.getByRole("group", { name: /drill mode/i });
    expect(within(group).getAllByRole("button").map((b) => b.textContent)).toContain("✏️ Cloze");
    fireEvent.click(screen.getByRole("button", { name: /^📖 Learn$/ }));
    const table = screen.getByRole("table", { name: /answer key/i });
    const items = ladderItems(DRILL.keyPoints);
    expect(within(table).getAllByRole("row")).toHaveLength(items.length + 1);
    expect(within(table).getByText(items[0].head)).toBeInTheDocument();
    expect(within(table).getByText(items[0].clue)).toBeInTheDocument();
    // seen, not mastered
    expect(screen.getByText(/Seen 1\//)).toBeInTheDocument();
    expect(screen.getByText(/0 mastered/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /hide answers/i }));
    expect(within(table).queryByText(items[0].head)).not.toBeInTheDocument();
    // a single covered cell can be peeked
    fireEvent.click(within(table).getAllByRole("button", { name: /show this cell/i })[0]);
    expect(within(table).getByText(items[0].head)).toBeInTheDocument();
  });

  it("Cloze grades a typed head, lets a shown item be self-rated, and records the fraction", async () => {
    openTumors();
    fireEvent.click(screen.getByRole("button", { name: /^✏️ Cloze$/ }));
    const order = seededShuffle(ladderItems(DRILL.keyPoints), `cloze:${SEED}`);
    expect(screen.getByText(/Item 1 of/)).toBeInTheDocument();
    expect(screen.getByText(order[0].clue)).toBeInTheDocument();
    // type the exact head of the first item → credited
    fireEvent.change(screen.getByRole("textbox", { name: /your answer/i }), { target: { value: order[0].head.split("/")[0].trim() } });
    fireEvent.click(screen.getByRole("button", { name: /^Check$/ }));
    await waitFor(() => expect(screen.getByText(/✓ Correct/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /next item/i }));
    // show the second, rate it missed
    expect(screen.getByText(/Item 2 of/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /show answer/i }));
    expect(screen.getByText(order[1].head)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /missed/i }));
    fireEvent.click(screen.getByRole("button", { name: /next item/i }));
    // wrong answers on the rest
    for (let i = 2; i < order.length; i++) {
      fireEvent.change(screen.getByRole("textbox", { name: /your answer/i }), { target: { value: "zzzz" } });
      fireEvent.click(screen.getByRole("button", { name: /^Check$/ }));
      await waitFor(() => expect(screen.getByText(/✗ Missed/)).toBeInTheDocument());
      fireEvent.click(screen.getByRole("button", { name: i + 1 < order.length ? /next item/i : /see summary/i }));
    }
    expect(screen.getByText(/Cloze summary/)).toBeInTheDocument();
    expect(screen.getByText(`1/${order.length}`)).toBeInTheDocument();
    expect(screen.getByText(/Seen 1\//)).toBeInTheDocument();
  });

  it("Sort places chips into buckets, checks them exactly, and returns wrong ones to the pool", () => {
    openTumors();
    fireEvent.click(screen.getByRole("button", { name: /^🧩 Sort$/ }));
    const items = ladderItems(DRILL.keyPoints);
    const pool = screen.getByLabelText(/unsorted items/i);
    expect(within(pool).getAllByRole("button")).toHaveLength(items.length);
    expect(screen.getByRole("button", { name: /check answers/i })).toBeDisabled();
    // place every chip in its right bucket except the first, which goes to the wrong one
    const wrongGroup = DRILL.keyPoints.find((g) => g.group !== items[0].group)!.group;
    for (const it of items) {
      fireEvent.click(within(pool).getByRole("button", { name: it.head }));
      fireEvent.click(screen.getByRole("button", { name: `Place in ${it === items[0] ? wrongGroup : it.group}` }));
    }
    fireEvent.click(screen.getByRole("button", { name: /check answers/i }));
    expect(screen.getByText(`${items.length - 1}/${items.length}`)).toBeInTheDocument();
    // the wrong chip is back in the pool, flagged
    expect(within(screen.getByLabelText(/unsorted items/i)).getByRole("button", { name: `✗ ${items[0].head}` })).toBeInTheDocument();
    expect(screen.getByText(/Seen 1\//)).toBeInTheDocument();
    // fix it and re-check — completes without re-recording
    fireEvent.click(screen.getByRole("button", { name: `✗ ${items[0].head}` }));
    fireEvent.click(screen.getByRole("button", { name: `Place in ${items[0].group}` }));
    fireEvent.click(screen.getByRole("button", { name: /^Check a/ }));
    expect(screen.getByText(`${items.length}/${items.length}`)).toBeInTheDocument();
    expect(screen.getByText(/Seen 1\//)).toBeInTheDocument();
  });

  it("Full recall hints reveal counts, first letters and a clue, and each one lowers the recorded score", async () => {
    openTumors();
    fireEvent.click(screen.getByRole("button", { name: /full recall/i }));
    fireEvent.click(screen.getByRole("button", { name: /how many/i }));
    expect(screen.getByLabelText(/item counts/i)).toHaveTextContent(`${DRILL.keyPoints[0].group}: ${DRILL.keyPoints[0].items.length}`);
    fireEvent.click(screen.getByRole("button", { name: /first letters/i }));
    expect(screen.getByLabelText(/first letters/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /a clue/i }));
    expect(within(screen.getByLabelText(/^clues$/i)).getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText(/3 used/)).toBeInTheDocument();
    // name every head → 100% raw, minus 15 for three hints
    const all = ladderItems(DRILL.keyPoints).map((i) => i.head.split("/")[0].trim()).join(", ");
    fireEvent.change(screen.getByRole("textbox", { name: /your recall/i }), { target: { value: all } });
    fireEvent.click(screen.getByRole("button", { name: /grade my answer/i }));
    await waitFor(() => expect(screen.getByText(/3 hints used · recorded score reduced by 15%/)).toBeInTheDocument());
    expect(screen.getByText(/Seen 1× · best 85%/)).toBeInTheDocument();
  });
});
