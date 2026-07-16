// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";

describe("async validation UX", () => {
  it("exposes per-field isValidating during async checks", async () => {
    const form = createForm({
      initialValues: { username: "" },
      validateOn: "onBlur",
      validators: {
        username: [
          async (value) => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            return value === "taken" ? "Username already exists" : true;
          },
        ],
      },
    });

    form.setValue("username", "taken");
    const pending = form.validate({ paths: ["username"] });
    expect(form.state.fieldMeta.username?.isValidating).toBe(true);
    await pending;
    expect(form.state.fieldMeta.username?.isValidating).toBe(false);
    expect(form.errors("username")).toBe("Username already exists");
    form.destroy();
  });

  it("debounces onChange validation", async () => {
    const validator = vi.fn(async () => true);
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onChange",
      validators: { email: [validator] },
    });

    form.setValue("email", "a");
    form.setValue("email", "ab");
    form.setValue("email", "abc");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(validator.mock.calls.length).toBeLessThanOrEqual(2);
    form.destroy();
  });
});
