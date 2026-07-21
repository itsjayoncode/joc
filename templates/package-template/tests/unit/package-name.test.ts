import { describe, expect, it } from "vitest";

import { packageId } from "../../src/package-name.js";

describe("package-name scaffold", () => {
  it("exposes a stable package id", () => {
    expect(packageId).toBe("package-name");
  });
});
