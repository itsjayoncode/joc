// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";
import { when } from "../../src/rules/index.js";

describe("accessibility: error announcements", () => {
  it("announces field errors with role=alert and aria-invalid", async () => {
    document.body.innerHTML = `
      <form id="a11y">
        <label>
          Email
          <input name="email" type="email" />
        </label>
        <button type="submit">Send</button>
      </form>
    `;

    const formElement = document.querySelector("#a11y") as HTMLFormElement;
    const form = createForm({
      target: formElement,
      schema: { email: "email" },
      onSubmit: vi.fn(),
    });

    formElement.requestSubmit();

    await vi.waitFor(() => {
      const email = formElement.querySelector('input[name="email"]') as HTMLInputElement;
      expect(email.getAttribute("aria-invalid")).toBe("true");

      const describedBy = email.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();

      const alert = document.getElementById(describedBy!);
      expect(alert?.getAttribute("role")).toBe("alert");
      expect(alert?.getAttribute("data-form-intelligent-error")).toBe("email");
      expect(alert?.textContent?.length).toBeGreaterThan(0);
      expect(alert?.hidden).toBe(false);
    });

    const email = formElement.querySelector('input[name="email"]') as HTMLInputElement;
    email.value = "user@example.com";
    email.dispatchEvent(new Event("input", { bubbles: true }));
    await form.validate();

    await vi.waitFor(() => {
      expect(email.getAttribute("aria-invalid")).toBeNull();
      const describedBy = email.getAttribute("aria-describedby");
      if (describedBy) {
        const alert = document.getElementById(describedBy);
        expect(alert?.hidden).toBe(true);
      }
    });

    form.destroy();
  });

  it("marks required fields with aria-required when rules require them", async () => {
    document.body.innerHTML = `
      <form id="a11y-required">
        <input name="loanAmount" type="number" />
        <input name="managerApproval" />
        <button type="submit">Continue</button>
      </form>
    `;

    const formElement = document.querySelector("#a11y-required") as HTMLFormElement;
    const form = createForm({
      target: formElement,
      initialValues: { loanAmount: 0, managerApproval: "" },
      rules: [
        when("loanAmount")
          .greaterThan(500_000)
          .then((ctx) => {
            ctx.require("managerApproval");
          }),
      ],
    });

    form.setValue("loanAmount", 600_000);

    await vi.waitFor(() => {
      expect(form.state.fieldUi.managerApproval?.required).toBe(true);
      const approval = formElement.querySelector(
        'input[name="managerApproval"]',
      ) as HTMLInputElement;
      expect(approval.getAttribute("aria-required")).toBe("true");
      expect(approval.hasAttribute("required")).toBe(true);
    });

    form.destroy();
  });
});
