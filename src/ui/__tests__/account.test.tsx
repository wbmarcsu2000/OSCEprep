import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccountSection } from "../screens/Analytics";
import { setStudent } from "../../auth/identity";

describe("AccountSection", () => {
  beforeEach(() => localStorage.clear());

  it("renders nothing when not signed in", () => {
    const { container } = render(<AccountSection />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the signed-in student's name and email", () => {
    setStudent({ name: "Jane Doe", email: "jane@u.northwestern.edu", consentAt: "", version: 1 });
    render(<AccountSection />);
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(/jane@u\.northwestern\.edu/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });
});
