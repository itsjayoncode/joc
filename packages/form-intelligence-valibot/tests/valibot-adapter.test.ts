import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { createForm } from "@jayoncode/form-intelligence";

import { valibotAdapter } from "../src/index.js";

describe("valibotAdapter", () => {
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
