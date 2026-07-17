import { describe, expect, it, vi } from "vitest";

import {
  computeFieldAria,
  createForm,
  createFormController,
  isSchemaAdapter,
  when,
} from "../../src/index.js";

import type { SchemaAdapter } from "../../src/index.js";

describe("field.aria", () => {
  it("flips ariaInvalid when an error is present", () => {
    const form = createForm({
      initialValues: { email: "" },
      validators: {
        email: [(value) => (value ? true : "Required")],
      },
    });

    const field = form.field("email");
    expect(field.aria.aria.ariaInvalid).toBe(false);
    expect(field.aria.attributes["aria-invalid"]).toBe(false);

    form.setError("email", "Required");
    expect(field.aria.aria.ariaInvalid).toBe(true);
    expect(field.aria.attributes["aria-invalid"]).toBe(true);
    form.destroy();
  });

  it("sets ariaRequired from workflow require rules", async () => {
    const form = createForm({
      initialValues: { customerType: "Personal", taxNumber: "" },
      rules: [when("customerType").equals("Business").require("taxNumber")],
    });

    form.setValue("customerType", "Business");
    await vi.waitFor(() => {
      const field = form.field("taxNumber");
      expect(field.ui.required).toBe(true);
      expect(field.aria.aria.ariaRequired).toBe(true);
      expect(field.aria.attributes["aria-required"]).toBe(true);
    });
    form.destroy();
  });

  it("builds aria-describedby from registered ids (description then error)", () => {
    const form = createForm({ initialValues: { email: "" } });
    const field = form.field("email");

    field.setAriaIds({ descriptionId: "email-help", errorId: "email-error" });
    expect(field.aria.attributes["aria-describedby"]).toBe("email-help");

    form.setError("email", "Invalid");
    expect(field.aria.attributes["aria-describedby"]).toBe("email-help email-error");
    form.destroy();
  });

  it("exposes pure computeFieldAria helper", () => {
    const result = computeFieldAria({
      error: "Nope",
      required: false,
      ids: { errorId: "e1" },
    });
    expect(result.aria).toEqual({
      ariaInvalid: true,
      ariaRequired: false,
      ariaDescribedBy: "e1",
    });
  });
});

describe("FormController", () => {
  it("delegates field/submit/focus helpers", async () => {
    const form = createForm({
      initialValues: { email: "" },
      validators: {
        email: [(value) => (value ? true : "Required")],
      },
      onSubmit: vi.fn(),
    });

    const controller = createFormController(form);
    expect(controller.field("email").path).toBe("email");

    await form.validate();
    expect(controller.firstInvalidPath()).toBe("email");
    expect(controller.focusFirstInvalid()).toBe("email");

    controller.destroy();
  });
});

describe("SchemaAdapter contract", () => {
  it("accepts adapters that return a path→message map", async () => {
    const adapter: SchemaAdapter<{ email: string }> = {
      name: "fixture",
      validate(values) {
        if (!values.email.includes("@")) {
          return { email: "Invalid email" };
        }
        return {};
      },
    };

    expect(isSchemaAdapter(adapter)).toBe(true);

    const form = createForm({
      initialValues: { email: "bad" },
      schema: adapter,
    });

    expect(await form.validate()).toBe(false);
    expect(form.errors("email")).toBe("Invalid email");
    form.destroy();
  });

  it("supports async schema adapters", async () => {
    const adapter: SchemaAdapter<{ code: string }> = {
      async validate(values) {
        await Promise.resolve();
        return values.code === "ok" ? {} : { code: "Nope" };
      },
    };

    const form = createForm({
      initialValues: { code: "no" },
      schema: adapter,
    });

    expect(await form.validate()).toBe(false);
    expect(form.errors("code")).toBe("Nope");
    form.destroy();
  });
});

describe("SSR import smoke", () => {
  it("imports adapters and accessibility entrypoints", async () => {
    const mod = await import("../../src/adapters/index.js");
    const a11y = await import("../../src/engines/accessibility/index.js");
    expect(typeof mod.createFormController).toBe("function");
    expect(typeof mod.isSchemaAdapter).toBe("function");
    expect(typeof a11y.computeFieldAria).toBe("function");
  });
});
