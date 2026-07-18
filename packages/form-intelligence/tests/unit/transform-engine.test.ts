// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import {
  formatForDisplay,
  parseFromInput,
  resolveBuiltinFormatter,
  roundTripFormat,
} from "../../src/format/index.js";
import { createForm, email, required } from "../../src/index.js";
import {
  TRANSFORM_INBOUND_ORDER,
  createTransformPipeline,
  runTransformInbound,
} from "../../src/transform/index.js";

describe("transform stage order", () => {
  it("documents fixed inbound order", () => {
    expect(TRANSFORM_INBOUND_ORDER).toEqual(["trim", "normalize", "sanitize", "custom", "parse"]);
  });

  it("runs trim → sanitize → parse in order", () => {
    const pipeline = createTransformPipeline({
      trim: true,
      sanitize: true,
      parse: (value) => Number(value),
    });
    expect(pipeline.inbound("  <b>42</b>  ", { path: "n", values: {} })).toBe(42);
  });

  it("neutralizes incomplete HTML tags when stripHtml is on", () => {
    const pipeline = createTransformPipeline({ sanitize: { stripHtml: true } });
    expect(pipeline.inbound("<script alert(1)", { path: "x", values: {} })).toBe("script alert(1)");
    expect(pipeline.inbound("hello<img src=x onerror=alert(1)>", { path: "x", values: {} })).toBe(
      "hello",
    );
  });

  it("normalizes unicode NFC", () => {
    const composed = "é";
    const decomposed = "e\u0301";
    const result = runTransformInbound(
      decomposed,
      { normalize: "nfc" },
      { path: "name", values: {} },
    );
    expect(result).toBe(composed.normalize("NFC"));
  });
});

describe("parseOnInput / formatOnDisplay matrix", () => {
  const phone = resolveBuiltinFormatter("phone");

  it.each([
    {
      name: "parse+format (default)",
      options: { format: phone.format, parse: phone.parse },
      input: "(555) 123-4567",
      expectParse: "5551234567",
      expectFormat: "(555) 123-4567",
    },
    {
      name: "format only",
      options: {
        format: phone.format,
        parse: phone.parse,
        parseOnInput: false as const,
      },
      input: "5551234567",
      expectParse: "5551234567",
      expectFormat: "(555) 123-4567",
    },
    {
      name: "parse only",
      options: {
        format: phone.format,
        parse: phone.parse,
        formatOnDisplay: false as const,
      },
      input: "(555) 123-4567",
      expectParse: "5551234567",
      expectFormat: "5551234567",
    },
  ])("$name", ({ options, input, expectParse, expectFormat }) => {
    expect(parseFromInput(input, options)).toBe(expectParse);
    expect(formatForDisplay(expectParse, options)).toBe(expectFormat);
  });
});

describe("preset parity with custom", () => {
  it("phone/currency/slug round-trips", () => {
    expect(roundTripFormat("(555) 123-4567", resolveBuiltinFormatter("phone")).parsed).toBe(
      "5551234567",
    );
    expect(roundTripFormat("$1,234.50", resolveBuiltinFormatter("currency")).parsed).toBe(1234.5);
    expect(roundTripFormat("Hello World!", resolveBuiltinFormatter("slug")).parsed).toBe(
      "hello-world",
    );
  });
});

describe("transform then validate ordering", () => {
  it("validates the post-transform canonical value", async () => {
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onChange",
      validators: { email: [required, email] },
    });

    form.field("email", {
      transform: { trim: true },
    });

    form.setValue("email", "  user@example.com  ");
    expect(form.get("email")).toBe("user@example.com");
    await form.validate({ paths: ["email"] });
    expect(form.errors("email")).toBeUndefined();
    form.destroy();
  });

  it("form.transform(path).pipe registers stages", () => {
    const form = createForm({ initialValues: { code: "" } });
    form
      .transform("code")
      .pipe((value) => String(value).trim())
      .pipe((value) => String(value).toUpperCase());

    form.setValue("code", "  ab  ");
    expect(form.get("code")).toBe("AB");
    form.destroy();
  });

  it("field transform array runs before format parse", () => {
    const form = createForm({ initialValues: { amount: "" } });
    form.field("amount", {
      transform: [(value) => String(value).replace(/\$/g, "")],
      parse: (value) => Number(value),
      formatOnDisplay: false,
    });

    form.setValue("amount", "$12.5");
    expect(form.get("amount")).toBe(12.5);
    form.destroy();
  });
});
