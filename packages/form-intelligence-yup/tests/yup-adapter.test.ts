import { describe, expect, it } from "vitest";
import * as yup from "yup";

import { createForm } from "@jayoncode/form-intelligence";

import { yupAdapter } from "../src/index.js";

describe("yupAdapter", () => {
  it("maps Yup field errors to form paths", async () => {
    const schema = yup.object({
      email: yup.string().email("Invalid email").required(),
      password: yup.string().min(8, "Too short").required(),
    });

    const form = createForm({
      initialValues: { email: "bad", password: "123" },
      schema: yupAdapter(schema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("email")).toBe("Invalid email");
    expect(form.errors("password")).toBe("Too short");
    form.destroy();
  });

  it("supports async tests", async () => {
    const schema = yup.object({
      username: yup
        .string()
        .required()
        .test("unique", "Username is taken", async (value) => value !== "taken"),
    });

    const form = createForm({
      initialValues: { username: "taken" },
      schema: yupAdapter(schema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("username")).toBe("Username is taken");
    form.destroy();
  });

  it("returns no errors when schema passes", async () => {
    const schema = yup.object({
      email: yup.string().email().required(),
    });

    const form = createForm({
      initialValues: { email: "user@example.com" },
      schema: yupAdapter(schema),
    });

    expect(await form.validate()).toBe(true);
    expect(form.errors()).toEqual({});
    form.destroy();
  });
});
