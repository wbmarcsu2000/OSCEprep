import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useState } from "react";
import { GroupedCoverageDrill } from "../drillPrimitives";

function Harness({ onRecord = () => {} }: { onRecord?: (pct: number) => void }) {
  const [answer, setAnswer] = useState("");
  const [graded, setGraded] = useState(false);
  return (
    <GroupedCoverageDrill
      prompt="Recall the test guideline."
      keyPoints={[{ group: "Who", items: ["start age 45", "stop at 75"] }]}
      pearls="PEARL_TEXT"
      answer={answer}
      setAnswer={setAnswer}
      graded={graded}
      onGrade={() => setGraded(true)}
      onNew={() => {}}
      onRetry={() => setGraded(false)}
      onRecord={onRecord}
      onSetManual={() => {}}
      newLabel="Next →"
      drillType="fm-screening"
    />
  );
}

describe("GroupedCoverageDrill", () => {
  it("hides the model answer until graded, then reveals grouped key points + pearls", async () => {
    render(<Harness />);
    expect(screen.getByText(/Recall the test guideline/)).toBeInTheDocument();
    expect(screen.queryByText(/start age 45/)).not.toBeInTheDocument();
    expect(screen.queryByText(/PEARL_TEXT/)).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "start 45" } });
    fireEvent.click(screen.getByRole("button", { name: /grade my answer/i }));

    await waitFor(() => expect(screen.getByText(/start age 45/)).toBeInTheDocument());
    expect(screen.getByText(/stop at 75/)).toBeInTheDocument();
    expect(screen.getByText(/PEARL_TEXT/)).toBeInTheDocument();
  });

  it("'Show categories' reveals the group names as a cue without showing the answer items", () => {
    render(<Harness />);
    expect(screen.queryByText("Who")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /show categories/i }));
    // the group name appears as a cue...
    expect(screen.getByText("Who")).toBeInTheDocument();
    // ...but the actual facts stay hidden
    expect(screen.queryByText(/start age 45/)).not.toBeInTheDocument();
  });

  it("'Reveal answer' shows the full key + pearls without grading and logs the drill as seen (onRecord 0)", () => {
    const onRecord = vi.fn();
    render(<Harness onRecord={onRecord} />);
    // no answer typed, no grading
    fireEvent.click(screen.getByRole("button", { name: /reveal answer/i }));

    expect(screen.getByText(/start age 45/)).toBeInTheDocument();
    expect(screen.getByText(/stop at 75/)).toBeInTheDocument();
    expect(screen.getByText(/PEARL_TEXT/)).toBeInTheDocument();
    expect(screen.getByText(/Revealed/)).toBeInTheDocument();
    // logged as seen, not mastered
    expect(onRecord).toHaveBeenCalledWith(0);
    // no coverage score is shown (it was not graded)
    expect(screen.queryByRole("button", { name: /grade my answer/i })).not.toBeInTheDocument();
  });
});
