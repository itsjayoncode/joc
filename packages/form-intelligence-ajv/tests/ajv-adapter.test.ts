import { describe, expect, it } from "vitest";

import { createForm, isSchemaAdapter } from "@jayoncode/form-intelligence";

import { runSchemaAdapterContract } from "../../form-intelligence/tests/contracts/schema-adapter.contract.js";
import { ajvAdapter, formatAjvErrorPath } from "../src/index.js";

const signupSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    },
    password: { type: "string", minLength: 8 },
  },
  required: ["email", "password"],
  additionalProperties: false,
} as const;

describe("ajvAdapter", () => {
  it("satisfies SchemaAdapter contract harness", async () => {
    const adapter = ajvAdapter(signupSchema);
    expect(isSchemaAdapter(adapter)).toBe(true);

    await runSchemaAdapterContract({
      name: "ajv",
      adapter,
      validValues: { email: "user@example.com", password: "secret123" },
      invalidValues: { email: "bad", password: "123" },
      expectedInvalidPath: "password",
    });
  });

  it("maps AJV field errors to form paths", async () => {
    const form = createForm({
      initialValues: { email: "bad", password: "123" },
      schema: ajvAdapter(signupSchema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("email")).toMatch(/pattern/i);
    expect(form.errors("password")).toMatch(/8/);
    form.destroy();
  });

  it("maps required missingProperty to field paths (not _form)", async () => {
    const form = createForm({
      initialValues: {},
      schema: ajvAdapter(signupSchema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("email")).toMatch(/required/i);
    expect(form.errors("password")).toMatch(/required/i);
    expect(form.errors("_form")).toBeUndefined();
    form.destroy();
  });

  it("supports async validate functions", async () => {
    const validate = (async (data: { username?: string }) => {
      await Promise.resolve();
      const valid = data.username !== "taken";

      if (!valid) {
        validate.errors = [
          {
            keyword: "uniqueUsername",
            instancePath: "/username",
            schemaPath: "#/properties/username",
            message: "Username is taken",
            params: {},
          },
        ];
      }

      return valid;
    }) as import("ajv").ValidateFunction;

    const form = createForm({
      initialValues: { username: "taken" },
      schema: ajvAdapter(validate),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("username")).toBe("Username is taken");
    form.destroy();
  });

  it("returns no errors when schema passes", async () => {
    const form = createForm({
      initialValues: { email: "user@example.com", password: "secret123" },
      schema: ajvAdapter(signupSchema),
    });

    expect(await form.validate()).toBe(true);
    expect(form.errors()).toEqual({});
    form.destroy();
  });

  it("maps nested instance paths to dot notation", async () => {
    const schema = {
      type: "object",
      properties: {
        address: {
          type: "object",
          properties: {
            city: { type: "string", minLength: 2 },
          },
          required: ["city"],
          additionalProperties: false,
        },
      },
      required: ["address"],
      additionalProperties: false,
    } as const;

    const form = createForm({
      initialValues: { address: { city: "" } },
      schema: ajvAdapter(schema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("address.city")).toMatch(/2/);
    form.destroy();
  });

  it("maps nested required missingProperty under a parent path", async () => {
    const schema = {
      type: "object",
      properties: {
        address: {
          type: "object",
          properties: {
            city: { type: "string" },
          },
          required: ["city"],
          additionalProperties: false,
        },
      },
      required: ["address"],
      additionalProperties: false,
    } as const;

    const form = createForm({
      initialValues: { address: {} },
      schema: ajvAdapter(schema),
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("address.city")).toMatch(/required/i);
    form.destroy();
  });
});

describe("formatAjvErrorPath", () => {
  it("joins missingProperty onto instancePath", () => {
    expect(
      formatAjvErrorPath({
        keyword: "required",
        instancePath: "",
        schemaPath: "#/required",
        params: { missingProperty: "email" },
        message: "must have required property 'email'",
      }),
    ).toBe("email");

    expect(
      formatAjvErrorPath({
        keyword: "required",
        instancePath: "/address",
        schemaPath: "#/properties/address/required",
        params: { missingProperty: "city" },
        message: "must have required property 'city'",
      }),
    ).toBe("address.city");

    expect(
      formatAjvErrorPath({
        keyword: "minLength",
        instancePath: "/password",
        schemaPath: "#/properties/password/minLength",
        params: { limit: 8 },
        message: "too short",
      }),
    ).toBe("password");
  });
});
