// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";
import { when } from "../../src/rules/index.js";

function mountLoginForm(): HTMLFormElement {
  document.body.innerHTML = `
    <form id="login">
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button type="submit">Sign in</button>
    </form>
  `;

  return document.querySelector("#login") as HTMLFormElement;
}

describe("createForm DOM enhancement", () => {
  it("discovers fields, validates on submit, and calls onSubmit", async () => {
    const formElement = mountLoginForm();
    const onSubmit = vi.fn();

    const form = createForm({
      target: formElement,
      schema: {
        email: "email",
        password: "password",
      },
      onSubmit,
    });

    const email = formElement.querySelector('input[name="email"]') as HTMLInputElement;
    const password = formElement.querySelector('input[name="password"]') as HTMLInputElement;

    email.value = "user@example.com";
    email.dispatchEvent(new Event("input", { bubbles: true }));
    password.value = "secret123";
    password.dispatchEvent(new Event("input", { bubbles: true }));

    formElement.requestSubmit();

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          email: "user@example.com",
          password: "secret123",
        },
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    form.destroy();
  });

  it("shows validation errors after invalid submit", async () => {
    const formElement = mountLoginForm();
    const form = createForm({
      target: "#login",
      schema: {
        email: "email",
        password: "password",
      },
      onSubmit: vi.fn(),
    });

    formElement.requestSubmit();

    await vi.waitFor(() => {
      expect(form.errors("email")).toBe("This field is required.");
    });

    const email = formElement.querySelector('input[name="email"]') as HTMLInputElement;
    expect(email.getAttribute("aria-invalid")).toBe("true");

    const error = formElement.querySelector('[data-form-intelligent-error="email"]');
    expect(error?.textContent).toBe("This field is required.");

    form.destroy();
  });

  it("reads initial values from the DOM", () => {
    document.body.innerHTML = `
      <form id="profile">
        <input name="name" value="Jay" />
      </form>
    `;

    const form = createForm({
      target: "#profile",
      schema: { name: "text" },
    });

    expect(form.get("name")).toBe("Jay");
    form.destroy();
  });

  it("hides and shows fields when rules change", async () => {
    document.body.innerHTML = `
      <form id="business">
        <select name="customerType">
          <option value="Personal">Personal</option>
          <option value="Business">Business</option>
        </select>
        <div data-form-intelligent-field="companyName">
          <input name="companyName" />
        </div>
      </form>
    `;

    const form = createForm({
      target: "#business",
      schema: {
        customerType: "text",
        companyName: "text",
      },
      rules: [when("customerType").equals("Business").show("companyName")],
    });

    const companyRow = document.querySelector(
      '[data-form-intelligent-field="companyName"]',
    ) as HTMLElement;
    await vi.waitFor(() => {
      expect(companyRow.hidden).toBe(true);
    });

    const select = document.querySelector('select[name="customerType"]') as HTMLSelectElement;
    select.value = "Business";
    select.dispatchEvent(new Event("change", { bubbles: true }));

    await vi.waitFor(() => {
      expect(companyRow.hidden).toBe(false);
    });

    form.destroy();
  });
});
