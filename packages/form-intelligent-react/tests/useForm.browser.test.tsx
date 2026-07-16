// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { when } from "@jayoncode/form-intelligent/rules";
import { useForm } from "@jayoncode/form-intelligent-react";

function RegisterForm({
  onSubmit,
}: {
  onSubmit: (values: { email: string; password: string }) => void | Promise<void>;
}) {
  const form = useForm({
    schema: {
      email: "email",
      password: "password",
    },
    onSubmit,
  });

  return (
    <form {...form.form()}>
      <input {...form.field("email")} aria-label="Email" />
      <input {...form.field("password")} type="password" aria-label="Password" />
      <button {...form.submit()}>Register</button>
    </form>
  );
}

describe("useForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("enhances native markup without manual handlers", async () => {
    const onSubmit = vi.fn();

    render(<RegisterForm onSubmit={onSubmit} />);

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");

    fireEvent.input(email, { target: { value: "user@example.com" } });
    fireEvent.input(password, { target: { value: "secret123" } });

    screen.getByRole("button", { name: "Register" }).click();

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          email: "user@example.com",
          password: "secret123",
        },
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("disables submit while in flight", async () => {
    let resolveSubmit: (() => void) | undefined;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(<RegisterForm onSubmit={onSubmit} />);

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    fireEvent.input(email, { target: { value: "user@example.com" } });
    fireEvent.input(password, { target: { value: "secret123" } });

    const button = screen.getByRole("button", { name: "Register" });
    button.click();

    await waitFor(() => {
      expect(button.disabled).toBe(true);
      expect(button.getAttribute("aria-busy")).toBe("true");
    });

    resolveSubmit?.();
    await waitFor(() => {
      expect(button.disabled).toBe(false);
    });
  });

  it("exposes form.state for errors and validity without manual subscribe", async () => {
    const onSubmit = vi.fn();

    function SignupForm() {
      const form = useForm({
        schema: { email: "email" },
        onSubmit,
      });

      return (
        <form {...form.form()} data-valid={String(form.state.isValid)}>
          <input {...form.field("email")} aria-label="Email" />
          <output aria-label="Error">{form.state.errors.email ?? ""}</output>
          <button {...form.submit()}>Submit</button>
        </form>
      );
    }

    render(<SignupForm />);

    screen.getByRole("button", { name: "Submit" }).click();

    await waitFor(() => {
      expect(screen.getByLabelText("Error").textContent).toContain("required");
    });

    expect(document.querySelector("form")?.getAttribute("data-valid")).toBe("false");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables submit when formUi.submitDisabled is true", async () => {
    function LoanForm() {
      const form = useForm({
        initialValues: { loanAmount: 600_000 },
        rules: [when("loanAmount").greaterThan(500_000).disableSubmit()],
      });

      return (
        <form {...form.form()}>
          <input {...form.field("loanAmount")} aria-label="Amount" />
          <button {...form.submitButton()}>Submit</button>
        </form>
      );
    }

    render(<LoanForm />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Submit" }).disabled).toBe(true);
    });
  });
});
