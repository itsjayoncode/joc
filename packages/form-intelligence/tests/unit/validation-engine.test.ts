import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";
import { matchesField, requiredWhen } from "../../src/validation/cross-field.js";
import {
  fromNormalizedErrors,
  mergeValidationErrors,
  normalizeCrossFieldResult,
  toNormalizedErrors,
} from "../../src/validation/errors.js";
import {
  asyncValidator,
  currency,
  custom,
  date,
  email,
  max,
  maxLength,
  min,
  minLength,
  number,
  password,
  phone,
  regex,
  required,
  runFieldValidators,
  runValidationPipeline,
  url,
} from "../../src/validation/index.js";
import {
  resolveFieldValidationMode,
  shouldDebounceValidation,
  shouldValidateForTrigger,
} from "../../src/validation/modes.js";

describe("built-in validators matrix", () => {
  it("validates required, email, url, minLength, regex", async () => {
    expect(await runFieldValidators([required], "", makeContext())).toBe("This field is required.");
    expect(await runFieldValidators([required], "x", makeContext())).toBeUndefined();

    expect(await runFieldValidators([email], "bad", makeContext())).toContain("email");
    expect(await runFieldValidators([email], "a@b.co", makeContext())).toBeUndefined();
    expect(await runFieldValidators([email], "", makeContext())).toBeUndefined();

    expect(await runFieldValidators([url], "not-a-url", makeContext())).toContain("URL");
    expect(await runFieldValidators([url], "https://example.com", makeContext())).toBeUndefined();

    expect(await runFieldValidators([minLength(3)], "ab", makeContext())).toContain("at least");
    expect(await runFieldValidators([minLength(3)], "abc", makeContext())).toBeUndefined();

    expect(await runFieldValidators([regex(/^[A-Z]+$/, "Upper only.")], "ab", makeContext())).toBe(
      "Upper only.",
    );
    expect(
      await runFieldValidators([regex(/^[A-Z]+$/, "Upper only.")], "AB", makeContext()),
    ).toBeUndefined();
  });

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

  it("supports matchesField", async () => {
    const context = {
      values: { password: "secret", confirm: "secret" },
      path: "confirm",
      form: {
        get: (path: string) => (path === "password" ? "secret" : "secret"),
        values: () => ({ password: "secret", confirm: "secret" }),
      },
    };
    expect(await runFieldValidators([matchesField("password")], "secret", context)).toBeUndefined();
    expect(await runFieldValidators([matchesField("password")], "nope", context)).toBe(
      "Values must match.",
    );
  });

  it("does not throw on unexpected invalid input types", async () => {
    expect(await runFieldValidators([email], 42, makeContext())).toContain("email");
    expect(await runFieldValidators([url], { href: "x" }, makeContext())).toContain("URL");
    expect(await runFieldValidators([number()], "NaN-ish", makeContext())).toBeTruthy();
  });

  it("converts throwing custom validators into field errors", async () => {
    const exploding = custom(() => {
      throw new Error("boom");
    });
    expect(await runFieldValidators([exploding], "x", makeContext())).toBe("boom");
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
    const resolvers: Array<(value: true | string) => void> = [];
    const slow = asyncValidator(
      () =>
        new Promise<true | string>((resolve) => {
          resolvers.push(resolve);
        }),
    );

    const form = createForm({
      initialValues: { username: "" },
      validateOn: "onBlur",
      validators: { username: [slow] },
    });

    form.setValue("username", "first");
    const first = form.validate({ paths: ["username"] });
    form.setValue("username", "second");
    const second = form.validate({ paths: ["username"] });

    await vi.waitFor(() => {
      expect(resolvers.length).toBe(2);
    });
    resolvers[0]?.("stale from first");
    resolvers[1]?.("second wins");
    await Promise.all([first, second]);

    expect(form.errors("username")).toBe("second wins");
    form.destroy();
  });
});

describe("validation modes", () => {
  it("resolves trigger compatibility for all modes", () => {
    expect(shouldValidateForTrigger({ mode: "onBlur", trigger: "onBlur" })).toBe(true);
    expect(shouldValidateForTrigger({ mode: "onChange", trigger: "onBlur" })).toBe(false);
    expect(shouldValidateForTrigger({ mode: "onSubmit", trigger: "onChange" })).toBe(false);
    expect(shouldValidateForTrigger({ mode: "onSubmit", trigger: "onBlur" })).toBe(false);
    expect(shouldValidateForTrigger({ mode: "all", trigger: "onChange" })).toBe(true);
    expect(shouldValidateForTrigger({ mode: "all", trigger: "onBlur" })).toBe(true);
    expect(
      shouldValidateForTrigger({ mode: "onTouched", trigger: "onChange", touched: true }),
    ).toBe(true);
    expect(
      shouldValidateForTrigger({ mode: "onTouched", trigger: "onChange", visited: true }),
    ).toBe(true);
    expect(
      shouldValidateForTrigger({ mode: "onTouched", trigger: "onChange", touched: false }),
    ).toBe(false);
    expect(
      shouldValidateForTrigger({ mode: "onTouched", trigger: "onSubmit", touched: true }),
    ).toBe(false);
    expect(shouldDebounceValidation("onChange")).toBe(true);
    expect(shouldDebounceValidation("all")).toBe(true);
    expect(shouldDebounceValidation("onSubmit")).toBe(false);
    expect(resolveFieldValidationMode("onSubmit", "onBlur")).toBe("onBlur");
    expect(resolveFieldValidationMode("onSubmit")).toBe("onSubmit");
  });

  it("does not validate on blur when validateOn is onChange", async () => {
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onChange",
      validators: { email: [required, email] },
    });

    form.field("email").onBlur();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(form.errors("email")).toBeUndefined();

    form.setValue("email", "x");
    form.setValue("email", "");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(form.errors("email")).toBe("This field is required.");

    form.setValue("email", "bad");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(form.errors("email")).toContain("email");

    form.destroy();
  });

  it("validates on blur when validateOn is onBlur even without value change", async () => {
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onBlur",
      validators: { email: [required] },
    });

    form.setValue("email", "x");
    form.setValue("email", "");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(form.errors("email")).toBeUndefined();

    form.field("email").onBlur();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(form.errors("email")).toBe("This field is required.");

    form.destroy();
  });

  it("does not validate on change or blur when validateOn is onSubmit", async () => {
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onSubmit",
      validators: { email: [required] },
    });

    form.setValue("email", "x");
    form.setValue("email", "");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(form.errors("email")).toBeUndefined();

    form.field("email").onBlur();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(form.errors("email")).toBeUndefined();

    expect(await form.submit()).toBe(false);
    expect(form.errors("email")).toBe("This field is required.");

    form.destroy();
  });

  it("validates on change after touch when validateOn is onTouched", async () => {
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onTouched",
      validators: { email: [required] },
    });

    form.setValue("email", "x");
    form.setValue("email", "");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(form.errors("email")).toBeUndefined();

    form.field("email").onBlur();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(form.errors("email")).toBe("This field is required.");

    form.setValue("email", "ok");
    form.setValue("email", "");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(form.errors("email")).toBe("This field is required.");

    form.destroy();
  });

  it("validates on change when validateOn is all", async () => {
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "all",
      validators: { email: [required] },
    });

    form.setValue("email", "x");
    form.setValue("email", "");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(form.errors("email")).toBe("This field is required.");

    form.destroy();
  });

  it("honors per-field validateOn override on value change", async () => {
    const form = createForm({
      initialValues: { email: "", name: "" },
      validateOn: "onSubmit",
      validators: {
        email: [required],
        name: [required],
      },
    });

    form.field("email", { validateOn: "onChange" });
    form.setValue("email", "x");
    form.setValue("email", "");
    form.setValue("name", "x");
    form.setValue("name", "");
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(form.errors("email")).toBe("This field is required.");
    expect(form.errors("name")).toBeUndefined();

    form.destroy();
  });

  it("honors validate mode overrides on form.validate", async () => {
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onSubmit",
      validators: { email: [required, email] },
    });

    expect(await form.validate({ mode: "onBlur" })).toBe(false);
    expect(form.errors("email")).toBe("This field is required.");
    form.destroy();
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
    expect(fromNormalizedErrors(toNormalizedErrors(merged))).toEqual(merged);
  });

  it("normalizes cross-field false/string/object results", () => {
    expect(normalizeCrossFieldResult("confirm", false)).toEqual({
      confirm: "Invalid value.",
    });
    expect(normalizeCrossFieldResult("confirm", "Nope")).toEqual({ confirm: "Nope" });
    expect(normalizeCrossFieldResult("confirm", { confirm: "Mismatch", extra: "" })).toEqual({
      confirm: "Mismatch",
    });
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
