// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";

describe("createForm ref attachment", () => {
  it("attaches the DOM enhancer when ref receives a form element", async () => {
    document.body.innerHTML = `
      <form id="register">
        <input name="email" />
        <button type="submit">Register</button>
      </form>
    `;

    const onSubmit = vi.fn();
    const form = createForm({
      schema: { email: "email" },
      onSubmit,
    });

    const element = document.querySelector("#register") as HTMLFormElement;
    form.ref(element);

    expect(element.getAttribute("data-form-intelligent")).toBe(form.id);

    const email = element.querySelector('input[name="email"]') as HTMLInputElement;
    email.value = "user@example.com";
    email.dispatchEvent(new Event("input", { bubbles: true }));
    element.requestSubmit();

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { email: "user@example.com" },
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    form.ref(null);
    expect(element.getAttribute("data-form-intelligent")).toBeNull();
    form.destroy();
  });
});
