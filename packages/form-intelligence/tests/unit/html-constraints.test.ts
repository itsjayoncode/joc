// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { createForm } from "../../src/core/create-form.js";
import { extractConstraintsFromControls } from "../../src/dom/extract-html-constraints.js";
import { mergeValidatorsByKind } from "../../src/validation/merge-validators-by-kind.js";
import { getValidatorKind } from "../../src/validation/validator-kind.js";
import {
  custom,
  email,
  maxLength,
  minLength,
  regex,
  required,
  url,
} from "../../src/validation/validators/index.js";

describe("mergeValidatorsByKind", () => {
  it("applies Field > Schema > HTML per kind and keeps untyped", async () => {
    const unique = custom(() => true);
    const fieldMin = minLength(5);
    const merged = mergeValidatorsByKind({
      html: {
        username: [required, minLength(3), regex(/[A-Z]+/)],
      },
      schema: {
        username: [minLength(4)],
      },
      field: {
        username: [fieldMin, unique],
      },
    });

    expect(merged.username?.map((v) => getValidatorKind(v))).toEqual([
      "required",
      "minLength",
      "regex",
      undefined,
    ]);
    expect(merged.username?.[1]).toBe(fieldMin);
    expect(merged.username?.[3]).toBe(unique);
    expect(await merged.username![1]!("abcd", { path: "username", form: {} as never })).toMatch(
      /at least 5/,
    );
  });

  it("lets Field regex replace HTML pattern", () => {
    const fieldRegex = regex(/^[0-9]+$/);
    const merged = mergeValidatorsByKind({
      html: { code: [regex(/[A-Z]+/)] },
      field: { code: [fieldRegex] },
    });
    expect(merged.code).toEqual([fieldRegex]);
  });
});

describe("extractConstraintsFromControls", () => {
  it("maps Phase 1 attributes", () => {
    const input = document.createElement("input");
    input.name = "email";
    input.required = true;
    input.type = "email";
    input.minLength = 3;
    input.maxLength = 20;
    input.pattern = "[a-z]+";

    const validators = extractConstraintsFromControls([input]);
    expect(validators.map((v) => getValidatorKind(v))).toEqual([
      "required",
      "email",
      "minLength",
      "maxLength",
      "regex",
    ]);
  });

  it("skips invalid pattern without throwing", () => {
    const input = document.createElement("input");
    input.name = "x";
    input.setAttribute("pattern", "[");
    expect(() => extractConstraintsFromControls([input])).not.toThrow();
    expect(extractConstraintsFromControls([input])).toEqual([]);
  });

  it("maps type=url", () => {
    const input = document.createElement("input");
    input.type = "url";
    const validators = extractConstraintsFromControls([input]);
    expect(validators).toEqual([url]);
  });
});

describe("HTML constraint integration (MVP-VAL-002)", () => {
  it("imports constraints when target is present at create", async () => {
    const formEl = document.createElement("form");
    const input = document.createElement("input");
    input.name = "email";
    input.required = true;
    input.type = "email";
    formEl.appendChild(input);
    document.body.appendChild(formEl);

    const form = createForm({ target: formEl });
    expect(form.getPresentation("email").field.required).toBe(true);

    await form.validate({ paths: ["email"] });
    expect(form.errors("email")).toBeTruthy();

    form.setValue("email", "not-an-email");
    await form.validate({ paths: ["email"] });
    expect(form.errors("email")).toMatch(/email/i);

    form.setValue("email", "user@example.com");
    await form.validate({ paths: ["email"] });
    expect(form.errors("email")).toBeUndefined();

    form.destroy();
    formEl.remove();
  });

  it("extracts on late form.ref attach", async () => {
    const form = createForm({ initialValues: { username: "" } });
    expect(form.getPresentation("username").field.required).toBeUndefined();

    const formEl = document.createElement("form");
    const input = document.createElement("input");
    input.name = "username";
    input.required = true;
    input.minLength = 3;
    formEl.appendChild(input);
    document.body.appendChild(formEl);

    form.ref(formEl);
    expect(form.getPresentation("username").field.required).toBe(true);

    form.setValue("username", "ab");
    await form.validate({ paths: ["username"] });
    expect(form.errors("username")).toMatch(/at least/i);

    form.destroy();
    formEl.remove();
  });

  it("lets Field minLength override HTML minlength", async () => {
    const formEl = document.createElement("form");
    const input = document.createElement("input");
    input.name = "username";
    input.minLength = 3;
    formEl.appendChild(input);
    document.body.appendChild(formEl);

    const form = createForm({
      target: formEl,
      validators: { username: [minLength(5)] },
    });

    form.setValue("username", "abcd");
    await form.validate({ paths: ["username"] });
    expect(form.errors("username")).toMatch(/at least 5/);

    form.setValue("username", "abcde");
    await form.validate({ paths: ["username"] });
    expect(form.errors("username")).toBeUndefined();

    form.destroy();
    formEl.remove();
  });

  it("lets Schema override HTML and Field override Schema", async () => {
    const formEl = document.createElement("form");
    const input = document.createElement("input");
    input.name = "name";
    input.minLength = 2;
    formEl.appendChild(input);
    document.body.appendChild(formEl);

    const form = createForm({
      target: formEl,
      schema: { name: { minLength: 4 } },
      validators: { name: [minLength(6)] },
    });

    form.setValue("name", "abcde");
    await form.validate({ paths: ["name"] });
    expect(form.errors("name")).toMatch(/at least 6/);

    form.destroy();
    formEl.remove();
  });

  it("keeps custom validators alongside HTML required", async () => {
    const formEl = document.createElement("form");
    const input = document.createElement("input");
    input.name = "username";
    input.required = true;
    input.minLength = 3;
    formEl.appendChild(input);
    document.body.appendChild(formEl);

    const form = createForm({
      target: formEl,
      validators: {
        username: [
          custom((ctx) =>
            typeof ctx.value === "string" && ctx.value === "taken" ? "Username taken." : true,
          ),
        ],
      },
    });

    form.setValue("username", "taken");
    await form.validate({ paths: ["username"] });
    expect(form.errors("username")).toBe("Username taken.");

    form.destroy();
    formEl.remove();
  });

  it("does not throw on invalid pattern attribute", () => {
    const formEl = document.createElement("form");
    const input = document.createElement("input");
    input.name = "code";
    input.setAttribute("pattern", "[");
    formEl.appendChild(input);
    document.body.appendChild(formEl);

    expect(() => createForm({ target: formEl })).not.toThrow();

    formEl.remove();
  });

  it("headless create without DOM attach adds no HTML validators", async () => {
    const form = createForm({ initialValues: { email: "" } });
    await form.validate({ paths: ["email"] });
    expect(form.errors("email")).toBeUndefined();
    expect(form.getPresentation("email").field.required).toBeUndefined();
    form.destroy();
  });

  it("maps maxlength and email/url helpers", async () => {
    const formEl = document.createElement("form");
    const a = document.createElement("input");
    a.name = "short";
    a.maxLength = 2;
    const b = document.createElement("input");
    b.name = "site";
    b.type = "url";
    formEl.append(a, b);
    document.body.appendChild(formEl);

    const form = createForm({ target: formEl });
    form.setValue("short", "abc");
    await form.validate({ paths: ["short"] });
    expect(form.errors("short")).toMatch(/at most/i);

    form.setValue("site", "not-a-url");
    await form.validate({ paths: ["site"] });
    expect(form.errors("site")).toMatch(/url/i);

    // Identity checks for tagged builtins still hold for baseline.
    expect(email).toBe(email);
    expect(maxLength(1)).not.toBe(maxLength(1));

    form.destroy();
    formEl.remove();
  });
});
