import { describe, expect, it } from "vitest";

import { createForm, isSchemaAdapter } from "../../src/index.js";

describe("schema adapter integration", () => {
  it("detects schema adapters", () => {
    const adapter = {
      validate: async () => ({}),
    };

    expect(isSchemaAdapter(adapter)).toBe(true);
    expect(isSchemaAdapter({ email: "email" })).toBe(false);
  });

  it("validates through a schema adapter", async () => {
    const form = createForm({
      initialValues: { email: "" },
      schema: {
        async validate(values) {
          return values.email ? {} : { email: "Email is required" };
        },
      },
    });

    expect(await form.validate()).toBe(false);
    expect(form.errors("email")).toBe("Email is required");

    form.setValue("email", "user@example.com");
    expect(await form.validate()).toBe(true);
    form.destroy();
  });
});
