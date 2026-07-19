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

  it("keeps nested adapter errors when values only expose one parent path", async () => {
    const form = createForm({
      initialValues: { address: {} },
      schema: {
        async validate(values) {
          const address = values.address as Record<string, unknown> | undefined;
          if (!address || address.city === undefined || address.city === "") {
            return { "address.city": "City is required" };
          }
          return {};
        },
      },
    });

    expect(await form.validate()).toBe(false);
    expect(form.errors("address.city")).toBe("City is required");
    form.destroy();
  });
});
