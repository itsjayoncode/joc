import { describe, expect, it } from "vitest";

import { compileSchema } from "../../src/schema/compiler.js";
import { required } from "../../src/validation/validators.js";

describe("compileSchema", () => {
  it("maps shorthand field types to validators", async () => {
    const compiled = compileSchema({
      email: "email",
      password: "password",
      note: "text",
    });

    expect(compiled.initialValues).toEqual({
      email: "",
      password: "",
      note: "",
    });

    const emailValidator = compiled.validators.email?.[0];
    expect(emailValidator).toBe(required);

    const passwordValidators = compiled.validators.password ?? [];
    expect(passwordValidators.length).toBe(2);
  });

  it("supports flattened field rules at the top level", async () => {
    const compiled = compileSchema({
      firstName: {
        type: "text",
        required: true,
      },
      password: {
        type: "password",
        minLength: 8,
      },
    });

    const firstNameValidator = compiled.validators.firstName?.[0];
    expect(firstNameValidator).toBe(required);

    const passwordValidators = compiled.validators.password ?? [];
    expect(passwordValidators).toHaveLength(1);
  });

  it("supports rich field config and custom validators", async () => {
    const compiled = compileSchema({
      confirmPassword: {
        validators: [
          ({ value, form }) => value === form.get("password") || "Passwords do not match.",
        ],
      },
    });

    const validator = compiled.validators.confirmPassword?.[0];
    expect(validator).toBeDefined();

    const message = await validator?.("secret", {
      values: { password: "other", confirmPassword: "secret" },
      path: "confirmPassword",
      form: {
        get: (path) => (path === "password" ? "other" : "secret"),
        values: () => ({ password: "other", confirmPassword: "secret" }),
      },
    });

    expect(message).toBe("Passwords do not match.");
  });
});
