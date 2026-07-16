import { describe, expect, it } from "vitest";

import {
  parseConfigDocument,
  parseImportedState,
  serializeConfig,
  toConfigDocument,
} from "./devtools-utilities.js";

describe("devtools utilities", () => {
  it("parses config documents with values", () => {
    const document = parseConfigDocument(
      JSON.stringify({
        formId: "demo",
        values: { name: "Ada", email: "ada@example.com" },
      }),
    );

    expect(document.formId).toBe("demo");
    expect(document.values).toEqual({ name: "Ada", email: "ada@example.com" });
  });

  it("rejects invalid config payloads", () => {
    expect(() => parseConfigDocument("[]")).toThrow(/object/i);
    expect(() => parseConfigDocument("{}")).toThrow(/values/i);
  });

  it("imports values from exported state and bare values objects", () => {
    expect(
      parseImportedState(
        JSON.stringify({
          version: 1,
          formId: "x",
          state: { values: { title: "Hello" } },
        }),
      ),
    ).toEqual({ title: "Hello" });

    expect(parseImportedState(JSON.stringify({ values: { a: 1 } }))).toEqual({ a: 1 });
    expect(parseImportedState(JSON.stringify({ a: 1, b: 2 }))).toEqual({ a: 1, b: 2 });
  });

  it("round-trips config serialization helpers", () => {
    const form = {
      id: "form-1",
      getValues: () => ({ name: "Ada" }),
    };

    const document = toConfigDocument(form as never);
    expect(JSON.parse(serializeConfig(document))).toMatchObject({
      formId: "form-1",
      values: { name: "Ada" },
    });
  });
});
