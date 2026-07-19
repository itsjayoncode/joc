import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createForm, isSchemaAdapter } from "@jayoncode/form-intelligence";

import { runSchemaAdapterContract } from "../../form-intelligence/tests/contracts/schema-adapter.contract.js";
import { zodAdapter } from "../src/index.js";

describe("zodAdapter", () => {
  it("satisfies SchemaAdapter contract harness", async () => {
    const schema = z.object({
      email: z.string().email("Invalid email"),
    });
    const adapter = zodAdapter(schema);
    expect(isSchemaAdapter(adapter)).toBe(true);

    await runSchemaAdapterContract({
      name: "zod",
      adapter,
      validValues: { email: "user@example.com" },
      invalidValues: { email: "bad" },
      expectedInvalidPath: "email",
    });
  });

  it("maps Zod field errors to form paths", async () => {
    const schema = z.object({
      email: z.string().email("Invalid email"),
      password: z.string().min(8, "Too short"),
    });

    const form = createForm({
      initialValues: { email: "bad", password: "123" },
      schema: zodAdapter(schema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("email")).toBe("Invalid email");
    expect(form.errors("password")).toBe("Too short");
    form.destroy();
  });

  it("maps nested and array paths to dot notation", async () => {
    const schema = z.object({
      address: z.object({
        city: z.string().min(2, "City too short"),
      }),
      friends: z.array(
        z.object({
          name: z.string().min(1, "Name required"),
        }),
      ),
    });

    const form = createForm({
      initialValues: { address: { city: "" }, friends: [{ name: "" }] },
      schema: zodAdapter(schema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("address.city")).toBe("City too short");
    expect(form.errors("friends.0.name")).toBe("Name required");
    form.destroy();
  });

  it("supports async refinements", async () => {
    const schema = z.object({
      username: z.string().refine(async (value) => value !== "taken", {
        message: "Username is taken",
      }),
    });

    const form = createForm({
      initialValues: { username: "taken" },
      schema: zodAdapter(schema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("username")).toBe("Username is taken");
    form.destroy();
  });

  it("returns no errors when schema passes", async () => {
    const schema = z.object({
      email: z.string().email(),
    });

    const form = createForm({
      initialValues: { email: "user@example.com" },
      schema: zodAdapter(schema),
    });

    expect(await form.validate()).toBe(true);
    expect(form.errors()).toEqual({});
    form.destroy();
  });
});
