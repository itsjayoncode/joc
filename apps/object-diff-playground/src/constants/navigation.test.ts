import { describe, expect, it } from "vitest";

import { ROUTABLE_NAVIGATION_ITEMS } from "./navigation.js";

describe("playground navigation", () => {
  it("defines the required object-diff routes", () => {
    expect(ROUTABLE_NAVIGATION_ITEMS.map((item) => item.path)).toEqual([
      "/",
      "/diff",
      "/patch",
      "/json",
      "/performance",
      "/examples",
      "/settings",
      "/about",
    ]);
  });
});
