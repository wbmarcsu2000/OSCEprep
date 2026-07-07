import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Qbank } from "../screens/Qbank";
import { SHELF_MCQS, MCQ_SYSTEM_ORDER, type McqQuestion } from "../../data/shelfMcq";
import type { McqBank } from "../../data/mcqBank";

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

  it("reveals per-option rationales and the concept block only after answering", () => {
    const q: McqQuestion = {
      id: "teach-1",
      system: "Cardiology",
      topic: "Hypertension staging",
      stem: "Office BP is 150/95 on two visits. What is the best next step?",
      options: ["Start two agents", "Reassure and recheck yearly"],
      answerIndex: 0,
      explanation: "Stage 2 hypertension warrants two agents.",
      optionRationales: [
        "RATIONALE_CORRECT: stage 2 needs two first-line agents.",
        "RATIONALE_WRONG: yearly recheck is for elevated BP, not stage 2.",
      ],
      concept: "CONCEPT_TEXT: BP is staged and treatment escalates by stage.",
      conceptRule: ["RULE_BULLET: >=140/90 Stage 2 -> two agents"],
    };
    const bank: McqBank = {
      id: "teach",
      title: "Question Bank",
      eyebrow: "Test",
      blurb: "test bank",
      icon: "❓",
      grad: "var(--grad-teal)",
      questions: [q],
      systems: ["Cardiology"],
      storageKey: "osce.teach.test",
    };
    render(<Qbank bank={bank} />);
    fireEvent.click(screen.getByRole("button", { name: /start quiz/i }));

    // Nothing teaching-related before answering.
    expect(screen.queryByText(/RATIONALE_CORRECT/)).not.toBeInTheDocument();
    expect(screen.queryByText(/CONCEPT_TEXT/)).not.toBeInTheDocument();
    expect(screen.queryByText(/RULE_BULLET/)).not.toBeInTheDocument();

    // Answer correctly (click the correct option by its text).
    fireEvent.click(screen.getByText("Start two agents"));

    // Concept block + rule show; the redundant top explanation is hidden when a
    // concept exists (it just restated the question).
    expect(screen.getByText(/CONCEPT_TEXT/)).toBeInTheDocument();
    expect(screen.getByText(/RULE_BULLET/)).toBeInTheDocument();
    expect(screen.queryByText(/Stage 2 hypertension warrants two agents/)).not.toBeInTheDocument();

    // The correct option's rationale auto-opens; the distractor stays collapsed
    // until clicked (no info overload).
    expect(screen.getByText(/RATIONALE_CORRECT/)).toBeInTheDocument();
    expect(screen.queryByText(/RATIONALE_WRONG/)).not.toBeInTheDocument();

    // Clicking the distractor reveals its rationale on demand.
    fireEvent.click(screen.getByText("Reassure and recheck yearly"));
    expect(screen.getByText(/RATIONALE_WRONG/)).toBeInTheDocument();
  });

  it("reveals score components, discriminator, and mnemonic only after answering", () => {
    const q: McqQuestion = {
      id: "teach-2",
      system: "Pulmonology",
      topic: "Wells PE score",
      stem: "A patient with pleuritic chest pain and tachycardia. What determines empiric anticoagulation?",
      options: ["Wells score and D-dimer", "Chest x-ray alone"],
      answerIndex: 0,
      explanation: "Risk-stratify with Wells before imaging.",
      scoreComponents: [
        "SCORE_CLINICAL_DVT: clinical signs of DVT (+3)",
        "SCORE_ALT_DX: PE is #1 diagnosis (+3)",
      ],
      discriminator: "DISCRIMINATOR_TEXT: tachycardia plus pleuritic pain favors PE over MSK pain.",
      mnemonic: "MNEMONIC_TEXT: Wells — DVT signs, alt dx, HR, immobilization, prior VTE, hemoptysis, cancer.",
    };
    const bank: McqBank = {
      id: "teach2",
      title: "Question Bank",
      eyebrow: "Test",
      blurb: "test bank",
      icon: "❓",
      grad: "var(--grad-teal)",
      questions: [q],
      systems: ["Pulmonology"],
      storageKey: "osce.teach.test2",
    };
    render(<Qbank bank={bank} />);
    fireEvent.click(screen.getByRole("button", { name: /start quiz/i }));

    // Nothing enhancement-related before answering.
    expect(screen.queryByText(/SCORE_CLINICAL_DVT/)).not.toBeInTheDocument();
    expect(screen.queryByText(/DISCRIMINATOR_TEXT/)).not.toBeInTheDocument();
    expect(screen.queryByText(/MNEMONIC_TEXT/)).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /^Option [A-E]$/ })[0]);

    // After answering: the components list, the "Components" heading, and each teaching row.
    expect(screen.getByText(/Components/)).toBeInTheDocument();
    expect(screen.getByText(/SCORE_CLINICAL_DVT/)).toBeInTheDocument();
    expect(screen.getByText(/SCORE_ALT_DX/)).toBeInTheDocument();
    expect(screen.getByText(/Key discriminator/)).toBeInTheDocument();
    expect(screen.getByText(/DISCRIMINATOR_TEXT/)).toBeInTheDocument();
    expect(screen.getByText(/Mnemonic/)).toBeInTheDocument();
    expect(screen.getByText(/MNEMONIC_TEXT/)).toBeInTheDocument();
  });

  it("caps a session to the chosen number of questions (chunked test mode)", () => {
    // A bank of 8 questions; the session-length picker should bound the run.
    const questions: McqQuestion[] = Array.from({ length: 8 }, (_, i) => ({
      id: `chunk-${i}`,
      system: "Cardiology",
      topic: `Topic ${i}`,
      stem: `This is question number ${i} with a sufficiently long stem to be valid.`,
      options: ["Option one", "Option two", "Option three", "Option four"],
      answerIndex: 0,
      explanation: "Because this is the best answer for the purposes of the test.",
    }));
    const bank: McqBank = {
      id: "chunk",
      title: "Question Bank",
      eyebrow: "Test",
      blurb: "test bank",
      icon: "❓",
      grad: "var(--grad-teal)",
      questions,
      systems: ["Cardiology"],
      storageKey: "osce.chunk.test",
    };
    render(<Qbank bank={bank} />);

    // Default is 20, but only 8 are eligible → the button offers all 8.
    expect(screen.getByRole("button", { name: /start quiz · 8 questions/i })).toBeInTheDocument();

    // Choose a chunk of 3 via the custom input; the button and the quiz follow.
    fireEvent.change(screen.getByLabelText(/custom session length/i), { target: { value: "3" } });
    expect(screen.getByRole("button", { name: /start quiz · 3 questions/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /start quiz/i }));
    expect(screen.getByText(/question 1 of 3/i)).toBeInTheDocument();
  });
});
