import { describe, expect, it } from "vitest";

import { creditCard, philippinePhone, resolveFormatPreset } from "../../src/format/index.js";

describe("format presets", () => {
  it("formats philippine phone numbers", () => {
    expect(philippinePhone("09171234567")).toBe("0917 123 4567");
  });

  it("formats credit card numbers", () => {
    expect(creditCard("4111111111111111")).toBe("4111 1111 1111 1111");
  });

  it("resolves preset names", () => {
    const preset = resolveFormatPreset("philippine-phone");
    expect(preset.format("09171234567")).toBe("0917 123 4567");
  });
});
