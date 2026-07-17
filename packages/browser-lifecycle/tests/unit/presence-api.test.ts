import { describe, expect, it } from "vitest";

import {
  createBrowserLifecycle,
  createPresenceApi,
  projectPresenceView,
} from "@jayoncode/browser-lifecycle";

import type { BrowserLifecycleSnapshot } from "../../src/core/session/types.js";

function baseSnapshot(
  overrides: Partial<BrowserLifecycleSnapshot> = {},
): BrowserLifecycleSnapshot {
  return {
    activity: "unknown",
    attention: "unknown",
    capabilities: {
      abortController: true,
      broadcastChannel: false,
      connectivity: true,
      focus: true,
      idle: true,
      pageLifecycle: false,
      requestIdleCallback: false,
      visibility: true,
    },
    connectivity: "unknown",
    lifecycle: "unknown",
    phase: "running",
    tab: "single",
    timestamps: { createdAt: 1, updatedAt: 1 },
    visibility: "unknown",
    ...overrides,
  };
}

describe("projectPresenceView", () => {
  it("is present when visible, focused, and online", () => {
    expect(
      projectPresenceView(
        baseSnapshot({
          attention: "focused",
          connectivity: "online",
          visibility: "visible",
        }),
      ),
    ).toEqual({ reasons: [], status: "present" });
  });

  it("is unknown when any required input is unknown", () => {
    expect(
      projectPresenceView(
        baseSnapshot({
          attention: "focused",
          connectivity: "online",
          visibility: "unknown",
        }),
      ),
    ).toEqual({ reasons: ["visibility-unknown"], status: "unknown" });
  });

  it("is away with machine-readable reasons", () => {
    expect(
      projectPresenceView(
        baseSnapshot({
          attention: "unfocused",
          connectivity: "offline",
          visibility: "hidden",
        }),
      ),
    ).toEqual({
      reasons: ["hidden", "blurred", "offline"],
      status: "away",
    });
  });

  it("can require active activity when opted in", () => {
    expect(
      projectPresenceView(
        baseSnapshot({
          activity: "idle",
          attention: "focused",
          connectivity: "online",
          visibility: "visible",
        }),
        { requireActive: true },
      ),
    ).toEqual({ reasons: ["idle"], status: "away" });

    expect(
      projectPresenceView(
        baseSnapshot({
          activity: "unknown",
          attention: "focused",
          connectivity: "online",
          visibility: "visible",
        }),
        { requireActive: true },
      ),
    ).toEqual({ reasons: ["activity-unknown"], status: "unknown" });
  });
});

describe("createPresenceApi", () => {
  it("projects from live snapshot without subscriptions", () => {
    let snapshot = baseSnapshot({
      attention: "focused",
      connectivity: "online",
      visibility: "visible",
    });
    const lifecycle = { getSnapshot: () => snapshot };
    const presence = createPresenceApi(lifecycle);

    expect(presence.isPresent()).toBe(true);
    expect(presence.label()).toBe("ACTIVE");

    snapshot = baseSnapshot({
      attention: "focused",
      connectivity: "online",
      visibility: "hidden",
    });
    expect(presence.isAway()).toBe(true);
    expect(presence.label()).toBe("AWAY");
    expect(presence.state().reasons).toEqual(["hidden"]);

    presence.dispose();
  });

  it("works with a real session (SSR-unknown defaults)", () => {
    const session = createBrowserLifecycle({ autoStart: false });
    const presence = createPresenceApi(session);

    expect(presence.isUnknown()).toBe(true);
    presence.dispose();
    session.dispose();
  });
});
