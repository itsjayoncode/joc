import { describe, expect, it } from "vitest";

import { decodeLabShareHash, encodeLabShareHash } from "./clipboard.js";

describe("lab share hash", () => {
  it("round-trips a payload", () => {
    const payload = { templateId: "product", format: "markdown" };
    const hash = `#${encodeLabShareHash(payload)}`;
    expect(decodeLabShareHash(hash)).toEqual(payload);
  });
});
