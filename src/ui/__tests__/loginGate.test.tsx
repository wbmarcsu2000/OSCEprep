import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginGate } from "../components/LoginGate";
import { signIn } from "../../auth/authClient";
import { getCurrentStudent } from "../../auth/identity";

vi.mock("../../auth/authClient", () => ({ signIn: vi.fn() }));
const mockSignIn = vi.mocked(signIn);

function fill(name: string, email: string, password: string) {
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/northwestern email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/class password/i), { target: { value: password } });
}

describe("LoginGate", () => {
  beforeEach(() => {
    localStorage.clear();
    mockSignIn.mockReset();
  });

  it("disables Continue until name + valid email + password + consent are all present", () => {
    render(<LoginGate onSignedIn={() => {}} />);
    const btn = screen.getByRole("button", { name: /continue/i });
    expect(btn).toBeDisabled();

    fill("Jane Doe", "jane@gmail.com", "pw"); // wrong domain
    expect(btn).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/northwestern email/i), {
      target: { value: "jane@u.northwestern.edu" },
    });
    expect(btn).toBeDisabled(); // consent still unchecked

    fireEvent.click(screen.getByLabelText(/I understand and agree/i));
    expect(btn).toBeEnabled();
  });

  it("does NOT call /auth when consent is unchecked", () => {
    render(<LoginGate onSignedIn={() => {}} />);
    fill("Jane Doe", "jane@u.northwestern.edu", "pw");
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("on success stores identity and calls onSignedIn", async () => {
    mockSignIn.mockResolvedValue({ ok: true });
    const onSignedIn = vi.fn();
    render(<LoginGate onSignedIn={onSignedIn} />);
    fill("Jane Doe", "jane@u.northwestern.edu", "pw");
    fireEvent.click(screen.getByLabelText(/I understand and agree/i));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() => expect(onSignedIn).toHaveBeenCalled());
    expect(getCurrentStudent()).toMatchObject({
      name: "Jane Doe",
      email: "jane@u.northwestern.edu",
    });
  });

  it("shows an inline error on a bad password and does not sign in", async () => {
    mockSignIn.mockResolvedValue({ ok: false, error: "bad_password" });
    const onSignedIn = vi.fn();
    render(<LoginGate onSignedIn={onSignedIn} />);
    fill("Jane Doe", "jane@u.northwestern.edu", "wrong");
    fireEvent.click(screen.getByLabelText(/I understand and agree/i));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(await screen.findByText(/incorrect class password/i)).toBeInTheDocument();
    expect(onSignedIn).not.toHaveBeenCalled();
    expect(getCurrentStudent()).toBeNull();
  });
});
