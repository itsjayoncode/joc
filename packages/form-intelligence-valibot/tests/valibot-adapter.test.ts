import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { createForm, isSchemaAdapter } from "@jayoncode/form-intelligence";

import { runSchemaAdapterContract } from "../../form-intelligence/tests/contracts/schema-adapter.contract.js";
import { valibotAdapter } from "../src/index.js";

describe("valibotAdapter", () => {
  it("satisfies SchemaAdapter contract harness", async () => {
    const schema = v.object({
      email: v.pipe(v.string(), v.email("Invalid email")),
    });
    const adapter = valibotAdapter(schema);
    expect(isSchemaAdapter(adapter)).toBe(true);

    await runSchemaAdapterContract({
      name: "valibot",
      adapter,
      validValues: { email: "user@example.com" },
      invalidValues: { email: "bad" },
      expectedInvalidPath: "email",
    });
  });

  it("maps Valibot field errors to form paths", async () => {
    const schema = v.object({
      email: v.pipe(v.string(), v.email("Invalid email")),
      password: v.pipe(v.string(), v.minLength(8, "Too short")),
    });

    const form = createForm({
      initialValues: { email: "bad", password: "123" },
      schema: valibotAdapter(schema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("email")).toBe("Invalid email");
    expect(form.errors("password")).toBe("Too short");
    form.destroy();
  });

  it("maps nested and array paths to dot notation", async () => {
    const schema = v.object({
      address: v.object({
        city: v.pipe(v.string(), v.minLength(2, "City too short")),
      }),
      friends: v.array(
        v.object({
          name: v.pipe(v.string(), v.minLength(1, "Name required")),
        }),
      ),
    });

    const form = createForm({
      initialValues: { address: { city: "" }, friends: [{ name: "" }] },
      schema: valibotAdapter(schema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("address.city")).toBe("City too short");
    expect(form.errors("friends.0.name")).toBe("Name required");
    form.destroy();
  });

  it("supports async checks", async () => {
    const schema = v.objectAsync({
      username: v.pipeAsync(
        v.string(),
        v.checkAsync(async (value) => value !== "taken", "Username is taken"),
      ),
    });

    const form = createForm({
      initialValues: { username: "taken" },
      schema: valibotAdapter(schema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("username")).toBe("Username is taken");
    form.destroy();
  });

  it("returns no errors when schema passes", async () => {
    const schema = v.object({
      email: v.pipe(v.string(), v.email()),
    });

    const form = createForm({
      initialValues: { email: "user@example.com" },
      schema: valibotAdapter(schema),
    });

    expect(await form.validate()).toBe(true);
    expect(form.errors()).toEqual({});
    form.destroy();
  });
});
