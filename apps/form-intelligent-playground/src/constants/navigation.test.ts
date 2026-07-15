import { describe, expect, it } from "vitest";

import { ROUTABLE_NAVIGATION_ITEMS } from "./navigation.js";

describe("playground navigation", () => {
  it("defines the required form-intelligent routes", () => {
    expect(ROUTABLE_NAVIGATION_ITEMS.map((item) => item.path)).toEqual([
      "/",
      "/validation",
      "/submission",
      "/workflow",
      "/state",
      "/formatters",
      "/plugins",
      "/adapters",
      "/examples",
      "/settings",
      "/about",
    ]);
  });
});
