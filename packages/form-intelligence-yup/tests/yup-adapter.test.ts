import { describe, expect, it } from "vitest";
import * as yup from "yup";

import { createForm, isSchemaAdapter } from "@jayoncode/form-intelligence";

import { runSchemaAdapterContract } from "../../form-intelligence/tests/contracts/schema-adapter.contract.js";
import { formatYupPath, yupAdapter } from "../src/index.js";

describe("yupAdapter", () => {
  it("satisfies SchemaAdapter contract harness", async () => {
    const schema = yup.object({
      email: yup.string().email("Invalid email").required(),
    });
    const adapter = yupAdapter(schema);
    expect(isSchemaAdapter(adapter)).toBe(true);

    await runSchemaAdapterContract({
      name: "yup",
      adapter,
      validValues: { email: "user@example.com" },
      invalidValues: { email: "bad" },
      expectedInvalidPath: "email",
    });
  });

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

  it("maps nested and array paths to dot notation", async () => {
    const schema = yup.object({
      address: yup.object({
        city: yup.string().min(2, "City too short").required(),
      }),
      friends: yup.array().of(
        yup.object({
          name: yup.string().required("Name required"),
        }),
      ),
    });

    const form = createForm({
      initialValues: { address: { city: "" }, friends: [{ name: "" }] },
      schema: yupAdapter(schema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("address.city")).toMatch(/City too short|required/i);
    expect(form.errors("friends.0.name")).toBe("Name required");
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

describe("formatYupPath", () => {
  it("normalizes bracket indexes to dot paths", () => {
    expect(formatYupPath(undefined)).toBe("_form");
    expect(formatYupPath("address.city")).toBe("address.city");
    expect(formatYupPath("friends[0].name")).toBe("friends.0.name");
    expect(formatYupPath("items[12].meta[3].id")).toBe("items.12.meta.3.id");
  });
});
