import { describe, expect, it } from "vitest";

import { ROUTABLE_NAVIGATION_ITEMS } from "./navigation.js";

describe("playground navigation", () => {
  it("defines the required form-intelligent routes", () => {
    expect(ROUTABLE_NAVIGATION_ITEMS.map((item) => item.path)).toEqual([
      "/",
      "/dashboard",
      "/validation",
      "/submission",
      "/workflow",
      "/state",
      "/devtools",
      "/formatters",
      "/plugins",
      "/performance",
      "/adapters",
      "/rules",
      "/dependencies",
      "/calculations",
      "/integrations",
      "/examples",
      "/settings",
      "/about",
    ]);
  });
});
