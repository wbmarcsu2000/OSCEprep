import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Qbank } from "../screens/Qbank";
import { SHELF_MCQS, MCQ_SYSTEM_ORDER } from "../../data/shelfMcq";

describe("Shelf MCQ bank (data)", () => {
  it("every question is well-formed single-best-answer", () => {
    expect(SHELF_MCQS.length).toBeGreaterThanOrEqual(5);
    const ids = SHELF_MCQS.map((q) => q.id);
    expect(new Set(ids).size, "unique ids").toBe(ids.length);
    const systems = new Set<string>(MCQ_SYSTEM_ORDER);
    for (const q of SHELF_MCQS) {
      expect(systems.has(q.system), `${q.id} system "${q.system}" is canonical`).toBe(true);
      expect(q.topic.length, `${q.id} topic`).toBeGreaterThan(0);
      expect(q.stem.length, `${q.id} stem`).toBeGreaterThan(20);
      expect(q.options.length, `${q.id} option count`).toBeGreaterThanOrEqual(4);
      expect(q.options.length, `${q.id} option count`).toBeLessThanOrEqual(5);
      expect(new Set(q.options).size, `${q.id} options unique`).toBe(q.options.length);
      for (const o of q.options) expect(o.trim().length, `${q.id} option text`).toBeGreaterThan(0);
      expect(q.answerIndex, `${q.id} answerIndex lower`).toBeGreaterThanOrEqual(0);
      expect(q.answerIndex, `${q.id} answerIndex upper`).toBeLessThan(q.options.length);
      expect(q.explanation.length, `${q.id} explanation`).toBeGreaterThan(20);
    }
  });
});

describe("Question Bank screen", () => {
  beforeEach(() => {
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
  });

  it("starts a quiz and reveals feedback only after answering", () => {
    render(<Qbank />);
    expect(screen.getByRole("heading", { name: /question bank/i })).toBeInTheDocument();

    // Start the quiz from the setup screen.
    fireEvent.click(screen.getByRole("button", { name: /start quiz/i }));
    expect(screen.getByText(/question 1 of/i)).toBeInTheDocument();

    // No feedback before answering; advancing is disabled.
    expect(screen.queryByText(/is right/i)).not.toBeInTheDocument();
    const advance = screen.getByRole("button", { name: /(next|finish) →/i });
    expect(advance).toBeDisabled();

    // Answer the first option — feedback and explanation appear, advance enables.
    const options = screen.getAllByRole("button", { name: /^Option [A-E]$/ });
    expect(options.length).toBeGreaterThanOrEqual(4);
    fireEvent.click(options[0]);
    expect(screen.getByText(/is right/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /(next|finish) →/i })).toBeEnabled();
  });
});
