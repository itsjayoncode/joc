import { describe, expect, it } from "vitest";

import {
  composeFormatters,
  composeParsers,
  formatCustom,
  defaultFormatterRegistry,
  formatFieldValue,
  formatForDisplay,
  parseFromInput,
  resolveBuiltinFormatter,
  roundTripFormat,
  trimParser,
  formatUppercase,
  uppercaseParser,
} from "../../src/format/index.js";

describe("formatter engine", () => {
  describe("built-in round-trips", () => {
    it.each([
      {
        name: "phone",
        input: "(555) 123-4567",
        definition: resolveBuiltinFormatter("phone"),
        expectedFormatted: "(555) 123-4567",
        expectedParsed: "5551234567",
      },
      {
        name: "currency",
        input: "$1,234.50",
        definition: resolveBuiltinFormatter("currency"),
        expectedFormatted: "1234.50",
        expectedParsed: 1234.5,
      },
      {
        name: "creditCard",
        input: "4111 1111 1111 1111",
        definition: resolveBuiltinFormatter("creditCard"),
        expectedFormatted: "4111 1111 1111 1111",
        expectedParsed: "4111111111111111",
      },
      {
        name: "uppercase",
        input: "hello",
        definition: resolveBuiltinFormatter("uppercase"),
        expectedFormatted: "HELLO",
        expectedParsed: "HELLO",
      },
      {
        name: "lowercase",
        input: "HELLO",
        definition: resolveBuiltinFormatter("lowercase"),
        expectedFormatted: "hello",
        expectedParsed: "hello",
      },
      {
        name: "trim",
        input: "  spaced  ",
        definition: resolveBuiltinFormatter("trim"),
        expectedFormatted: "spaced",
        expectedParsed: "spaced",
      },
      {
        name: "slug",
        input: "Hello World!",
        definition: resolveBuiltinFormatter("slug"),
        expectedFormatted: "hello-world",
        expectedParsed: "hello-world",
      },
    ])(
      "$name format/parse round-trip",
      ({ input, definition, expectedFormatted, expectedParsed }) => {
        const { parsed, formatted } = roundTripFormat(input, definition);
        expect(parsed).toBe(expectedParsed);
        expect(formatted).toBe(expectedFormatted);
      },
    );
  });

  it("supports custom formatter definitions", () => {
    const definition = formatCustom(
      (value) => `fmt:${String(value)}`,
      (value) => String(value).replace(/^raw:/, ""),
    );

    expect(formatFieldValue("raw:abc", definition)).toBe("fmt:abc");
  });

  it("composes formatter chains", () => {
    const trim = resolveBuiltinFormatter("trim").format;
    const format = composeFormatters(trim, formatUppercase);
    const parse = composeParsers(trimParser, uppercaseParser);

    expect(format("  hello  ")).toBe("HELLO");
    expect(parse("  hello  ")).toBe("HELLO");
  });

  it("can format on display without parsing input", () => {
    const phoneDefinition = resolveBuiltinFormatter("phone");
    expect(
      formatForDisplay("5551234567", {
        format: phoneDefinition.format,
        parseOnInput: false,
      }),
    ).toBe("(555) 123-4567");
    expect(
      parseFromInput("(555) 123-4567", {
        parse: phoneDefinition.parse,
        formatOnDisplay: false,
      }),
    ).toBe("5551234567");
  });

  it("resolves built-ins from registry", () => {
    const definition = defaultFormatterRegistry.resolve("creditCard");
    expect(definition?.format("4111111111111111")).toBe("4111 1111 1111 1111");
    expect(definition?.parse?.("4111 1111 1111 1111")).toBe("4111111111111111");
  });

  it("formats per-field through createForm", async () => {
    const { createForm } = await import("../../src/index.js");
    const form = createForm({ initialValues: { code: "" } });

    form.field("code", {
      format: formatUppercase,
      parse: uppercaseParser,
    });

    form.setValue("code", "abc");
    expect(form.get("code")).toBe("ABC");
    form.destroy();
  });
});
