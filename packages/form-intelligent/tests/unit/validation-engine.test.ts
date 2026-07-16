import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";
import { requiredWhen } from "../../src/validation/cross-field.js";
import { mergeValidationErrors, toNormalizedErrors } from "../../src/validation/errors.js";
import {
  asyncValidator,
  currency,
  date,
  max,
  maxLength,
  min,
  number,
  password,
  phone,
  required,
  runFieldValidators,
  runValidationPipeline,
} from "../../src/validation/index.js";
import { shouldDebounceValidation, shouldValidateForTrigger } from "../../src/validation/modes.js";

describe("built-in validators", () => {
  it("validates number min/max", async () => {
    const validator = number({ min: 1, max: 10 });
    expect(await runFieldValidators([validator], 5, makeContext())).toBeUndefined();
    expect(await runFieldValidators([validator], 0, makeContext())).toBe("Must be at least 1.");
  });

  it("validates maxLength and phone", async () => {
    expect(await runFieldValidators([maxLength(3)], "abcd", makeContext())).toContain("at most");
    expect(await runFieldValidators([phone()], "+14155552671", makeContext())).toBeUndefined();
    expect(await runFieldValidators([phone()], "123", makeContext())).toContain("phone");
  });

  it("validates date, currency, and password strength", async () => {
    expect(await runFieldValidators([date()], "2026-07-16", makeContext())).toBeUndefined();
    expect(await runFieldValidators([date()], "not-a-date", makeContext())).toContain("valid date");
    expect(
      await runFieldValidators([currency({ precision: 2 })], "12.34", makeContext()),
    ).toBeUndefined();
    expect(
      await runFieldValidators([currency({ precision: 2 })], "12.345", makeContext()),
    ).toContain("decimal");
    expect(
      await runFieldValidators(
        [password({ minLength: 8, requireNumber: true })],
        "abcdefgh",
        makeContext(),
      ),
    ).toContain("number");
  });

  it("validates min and max helpers", async () => {
    expect(await runFieldValidators([min(3)], "ab", makeContext())).toContain("at least");
    expect(await runFieldValidators([max(3)], "abcd", makeContext())).toContain("at most");
  });
});

describe("validation pipeline order", () => {
  it("runs sync validators before async validators", async () => {
    const order: string[] = [];
    const sync = () => {
      order.push("sync");
      return true;
    };
    const asyncCheck = asyncValidator(async () => {
      order.push("async");
      return true;
    });

    await runFieldValidators([sync, asyncCheck], "value", makeContext());
    expect(order).toEqual(["sync", "async"]);
  });

  it("short-circuits on first field validator failure", async () => {
    const second = vi.fn(async () => true);
    const message = await runFieldValidators([required, second], "", makeContext());
    expect(message).toBe("This field is required.");
    expect(second).not.toHaveBeenCalled();
  });

  it("runs cross-field and form validators after field validators", async () => {
    const errors = await runValidationPipeline({
      values: { password: "secret", confirm: "nope" },
      paths: ["password", "confirm"],
      fieldValidators: new Map(),
      configValidators: {},
      crossFieldRules: [
        {
          paths: ["password", "confirm"],
          validate: ({ values }) =>
            values.password === values.confirm ? true : { confirm: "Passwords must match." },
        },
      ],
      formValidators: [() => "Form is not ready."],
    });

    expect(errors.confirm).toBe("Passwords must match.");
    expect(errors._form).toBe("Form is not ready.");
  });
});

describe("cross-field helpers", () => {
  it("supports requiredWhen", async () => {
    const form = createForm({
      initialValues: { hasPhone: false, phone: "" },
      validators: {
        phone: [requiredWhen("hasPhone", (value) => value === true)],
      },
    });

    await form.validate({ paths: ["phone"], mode: "onSubmit" });
    expect(form.errors("phone")).toBeUndefined();

    form.setValue("hasPhone", true);
    await form.validate({ paths: ["phone"], mode: "onSubmit" });
    expect(form.errors("phone")).toBe("This field is required.");
    form.destroy();
  });
});

describe("async validation race handling", () => {
  it("cancels stale async validation results", async () => {
    let resolveSlow: ((value: true) => void) | undefined;
    const slow = asyncValidator(
      () =>
        new Promise<true>((resolve) => {
          resolveSlow = resolve;
        }),
    );

    const form = createForm({
      initialValues: { username: "" },
      validateOn: "onChange",
      validators: { username: [slow] },
    });

    form.setValue("username", "first");
    form.setValue("username", "second");
    resolveSlow?.(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(form.errors("username")).toBeUndefined();
    form.destroy();
  });
});

describe("validation modes", () => {
  it("resolves trigger compatibility", () => {
    expect(shouldValidateForTrigger({ mode: "onBlur", trigger: "onBlur" })).toBe(true);
    expect(
      shouldValidateForTrigger({ mode: "onTouched", trigger: "onChange", touched: true }),
    ).toBe(true);
    expect(shouldDebounceValidation("onChange")).toBe(true);
    expect(shouldDebounceValidation("onSubmit")).toBe(false);
  });
});

describe("error normalization", () => {
  it("merges and normalizes field errors", () => {
    const merged = mergeValidationErrors(
      { email: "Old error", name: "Keep" },
      { email: "New error" },
      ["email"],
    );
    expect(merged).toEqual({ email: "New error", name: "Keep" });
    expect(toNormalizedErrors(merged)).toEqual(
      expect.arrayContaining([
        { path: "email", message: "New error" },
        { path: "name", message: "Keep" },
      ]),
    );
  });
});

function makeContext() {
  return {
    values: {},
    path: "field",
    form: {
      get: () => undefined,
      values: () => ({}),
    },
  };
}
