import { describe, it, expect } from "vitest";
import { adaptCase } from "../../engine/schemaAdapter";
import {
  createSession,
  transition,
  askQuestion,
  doManeuver,
  saveAnswer,
  submit,
} from "../../engine/stateMachine";
import {
  classifyIntentDeterministic,
  phrasePatientReplyDeterministic,
} from "../deterministicFallback";
import { guardParaphrase, guardOffTarget, DeterministicProvider } from "../LlmAdapter";
import { chestpain01, SCORE_BANDS } from "../../engine/__tests__/fixtures";

const cp01 = adaptCase(chestpain01);
const T0 = 1_700_000_000_000;

describe("deterministic fallback (LLM off, §11.7)", () => {
  it("classifies intent via keyword/synonym overlap", () => {
    const candidates = cp01.historyTriggers.map((t) => ({ id: t.id, concepts: t.concepts }));
    expect(classifyIntentDeterministic("Do you smoke cigarettes?", candidates)).toContain("tobacco_use");
    expect(classifyIntentDeterministic("How many beers a week?", candidates)).toContain("alcohol_use");
    expect(classifyIntentDeterministic("Nice weather today", candidates)).toEqual([]);
  });

  it("phrases replies as speech without adding content words", () => {
    // Section label stripped, third person flipped — content words unchanged.
    expect(phrasePatientReplyDeterministic("PMH: hypertension, type 2 diabetes")).toBe(
      "Hypertension, type 2 diabetes.",
    );
    const meds =
      "MEDICATIONS: aspirin 81mg (admits she sometimes forgets it). Good adherence otherwise.";
    const out = phrasePatientReplyDeterministic(meds);
    expect(out.toLowerCase()).toContain("aspirin 81mg");
    expect(out).toContain("(I sometimes forget it)");
    expect(out).not.toContain("MEDICATIONS:");
    expect(out).not.toContain("she");
  });

  it("a full encounter + scoring completes with the LLM disabled", async () => {
    const provider = new DeterministicProvider();
    let s = createSession(cp01, "STRICT_OSCE", T0);
    s = transition(s, "PATIENT_ENCOUNTER", cp01, T0);

    const q = "Do you smoke?";
    const ids = await provider.classifyIntent(
      q,
      cp01.historyTriggers.map((t) => ({ id: t.id, concepts: t.concepts })),
    );
    const res = askQuestion(s, cp01, q, ids);
    s = res.state;
    expect(res.matchedTriggerIds).toContain("tobacco_use");
    const reply = await provider.phrasePatientReply(res.revealedContent.join(" "));
    expect(chestpain01.patientFile).toContain(res.revealedContent[0]);
    expect(reply.length).toBeGreaterThan(0);

    s = doManeuver(s, cp01, "auscultate_mitral_area").state;
    s = transition(s, "POST_ENCOUNTER", cp01, T0);
    s = saveAnswer(s, "revised", "NSTEMI");
    s = submit(s, cp01, SCORE_BANDS, T0);
    expect(s.currentState).toBe("FEEDBACK");
    expect(s.overallScore).not.toBeNull();
  });
});

describe("paraphrase guard (hallucination structurally impossible)", () => {
  const persona = cp01.sp;
  const approved = "Substernal chest PRESSURE (\"like a weight\") that began ~2 hours ago";
  // Rejected paraphrases fall back to the deterministic lay phrasing of the
  // approved (grounded) content — never the LLM's text.
  const grounded = phrasePatientReplyDeterministic(approved);

  it("accepts a faithful lay paraphrase", () => {
    const paraphrase =
      "It feels like a weight on my chest, doctor. It started about 2 hours ago.";
    const out = guardParaphrase(approved, paraphrase, persona, "Tell me about your chest pressure");
    expect(out).toBe(paraphrase); // paraphrase accepted as-is
  });

  it("accepts lay synonyms of approved medical terms", () => {
    const approvedPmh = "PMH: hypertension, hyperlipidemia, type 2 diabetes";
    const out = guardParaphrase(
      approvedPmh,
      "I have high blood pressure, high cholesterol, and diabetes.",
      persona,
      "any medical problems?",
    );
    expect(out).toContain("high blood pressure"); // not forced back to chart text
  });

  it("rejects a paraphrase that invents a number", () => {
    const out = guardParaphrase(
      approved,
      "The pressure started 6 hours ago and my troponin was 3.2.",
      persona,
      "Tell me about it",
    );
    expect(out).toBe(grounded);
    expect(out).not.toContain("6 hours");
    expect(out).not.toContain("troponin");
  });

  it("rejects a paraphrase that adds clinical content", () => {
    const out = guardParaphrase(
      approved,
      "It feels like a weight, and I've also been having palpitations and hemoptysis.",
      persona,
      "Tell me about it",
    );
    expect(out).toBe(grounded);
    expect(out).not.toContain("palpitations");
  });

  it("rejects empty or runaway output", () => {
    expect(guardParaphrase(approved, "", persona, "q")).toBe(grounded);
    expect(guardParaphrase(approved, "blah ".repeat(500), persona, "q")).toBe(grounded);
  });
});

describe("off-target guard (questions with no case data)", () => {
  it("accepts a natural lifestyle answer", () => {
    const reply = "My diet's pretty average, honestly — nothing special.";
    expect(guardOffTarget(reply, "what is your diet")).toBe(reply);
  });

  it("accepts a natural symptom denial", () => {
    expect(guardOffTarget("No, nothing like that.", "any rashes?")).toBe("No, nothing like that.");
  });

  it("lets the patient echo the symptom the doctor named", () => {
    const reply = "No, no chest pain at all.";
    expect(guardOffTarget(reply, "have you had any chest pain?")).toBe(reply);
  });

  it("blocks a volunteered clinical symptom not asked about", () => {
    expect(
      guardOffTarget("Well, I've been having chest pain and palpitations.", "what is your diet?"),
    ).toBeNull();
  });

  it("blocks a fabricated vital/lab number", () => {
    expect(guardOffTarget("My blood pressure runs around 180.", "do you exercise?")).toBeNull();
  });

  it("allows small everyday numbers like frequency", () => {
    const reply = "I walk maybe 3 times a week.";
    expect(guardOffTarget(reply, "do you exercise?")).toBe(reply);
  });

  it("strips wrapping quotes and rejects empty/runaway", () => {
    expect(guardOffTarget('"Pretty normal, I guess."', "what is your diet")).toBe("Pretty normal, I guess.");
    expect(guardOffTarget("", "q")).toBeNull();
    expect(guardOffTarget("blah ".repeat(200), "q")).toBeNull();
  });
});
