import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useState } from "react";
import { GroupedCoverageDrill } from "../drillPrimitives";

function Harness() {
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
      onRecord={() => {}}
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
});
