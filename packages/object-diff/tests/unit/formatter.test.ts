import { describe, expect, it } from "vitest";

import { createSerializer, serialize } from "../../src/formatter/index.js";
import { InvalidOptionsError, diff } from "../../src/index.js";

describe("formatter engine", () => {
  const result = diff({ a: 1, b: 2 }, { a: 2, c: 3 });

  it("keeps existing json/markdown/table shapes stable", () => {
    expect(serialize(result, "json")).toContain('"type":"changed"');
    expect(serialize(result, "markdown")).toMatch(/^# Object Diff/);
    expect(serialize(result, "table")).toMatch(/^\| Path \| Type \| Previous \| Current \|/);
  });

  it("formats html with escaped content", () => {
    const risky = diff({ note: "a" }, { note: "<script>x</script>" });
    const html = serialize(risky, "html", { title: "Audit <x>" });

    expect(html).toContain("<table>");
    expect(html).toContain("Audit &lt;x&gt;");
    expect(html).toContain("&lt;script&gt;x&lt;/script&gt;");
    expect(html).not.toContain("<script>x</script>");
  });

  it("formats console with and without ANSI", () => {
    const colored = serialize(result, "console");
    const plain = serialize(result, "console", { color: false });

    expect(colored).toContain("\u001b[");
    expect(plain).not.toContain("\u001b[");
    expect(plain).toContain("changed a");
  });

  it("formats human prose summaries", () => {
    const text = serialize(result, "human", { title: "Form" });

    expect(text).toMatch(/^Form: \d+ changes \(/);
    expect(text).toContain("changed `a`");
    expect(text).toContain("removed `b`");
    expect(text).toContain("added `c`");
  });

  it("createSerializer supports plugins without global registration", () => {
    const serializeWith = createSerializer([
      {
        name: "csv",
        format: (diffResult) =>
          diffResult.changes.map((change) => `${change.type},${change.path}`).join("\n"),
      },
    ]);

    expect(serializeWith(result, "csv")).toContain("changed,a");
    expect(serializeWith(result, "human")).toContain("added `c`");
  });

  it("rejects colliding or unknown plugin formats", () => {
    expect(() => createSerializer([{ name: "json", format: () => "nope" }])).toThrow(
      InvalidOptionsError,
    );

    const serializeWith = createSerializer();
    expect(() => serializeWith(result, "nope")).toThrow(InvalidOptionsError);
  });
});
