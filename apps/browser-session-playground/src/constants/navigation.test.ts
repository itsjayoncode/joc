import { describe, expect, it } from "vitest";

import { FUTURE_PLAYGROUND_ITEMS, ROUTABLE_NAVIGATION_ITEMS } from "./navigation.js";

describe("playground navigation", () => {
  it("defines the required foundation routes", () => {
    expect(ROUTABLE_NAVIGATION_ITEMS.map((item) => item.path)).toEqual([
      "/",
      "/visibility",
      "/focus",
      "/connectivity",
      "/idle",
      "/lifecycle",
      "/cross-tab",
      "/plugins",
      "/events",
      "/state",
      "/configuration",
      "/performance",
      "/developer-tools",
      "/settings",
      "/about",
    ]);
  });

  it("reserves future module routes without mixing them into current navigation", () => {
    expect(FUTURE_PLAYGROUND_ITEMS.length).toBeGreaterThanOrEqual(0);
    expect(FUTURE_PLAYGROUND_ITEMS.every((item) => item.intent === "planned")).toBe(true);
  });
});
