import { describe, expect, it } from "vitest";

import { getIdleStatusLabel, isIdlePlaygroundSupported } from "./playground-idle.js";
import { getLifecycleStatusLabel } from "./playground-lifecycle.js";
import { getTabRoleLabel } from "./playground-cross-tab.js";

describe("playground module helpers", () => {
  it("labels idle states", () => {
    expect(getIdleStatusLabel("active")).toBe("Active");
    expect(
      isIdlePlaygroundSupported(
        {
          capabilities: {
            abortController: true,
            broadcastChannel: false,
            connectivity: false,
            focus: false,
            idle: true,
            pageLifecycle: false,
            requestIdleCallback: false,
            visibility: false,
          },
        },
        10_000,
      ),
    ).toBe(true);
  });

  it("labels lifecycle and tab roles", () => {
    expect(getLifecycleStatusLabel("frozen")).toBe("Frozen");
    expect(getTabRoleLabel("primary")).toBe("Primary");
  });
});
