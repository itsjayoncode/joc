import { describe, expect, it } from "vitest";

import {
  ConfigurationError,
  createBrowserLifecycleConfig,
  getDefaultBrowserLifecycleConfig,
  getPluginIds,
  mergeBrowserLifecycleConfig,
  validateBrowserLifecycleConfig,
} from "@jayoncode/browser-lifecycle";

describe("configuration system", () => {
  it("creates an immutable default configuration", () => {
    const config = getDefaultBrowserLifecycleConfig();

    expect(config).toEqual({
      activityDebounce: 250,
      activityEvents: ["pointerdown", "keydown", "touchstart", "visibilitychange", "focus"],
      autoStart: true,
      crossTab: {
        channelName: "jayoncode:browser-lifecycle",
        enabled: false,
        heartbeatInterval: 1_000,
        leaderTimeout: 3_000,
      },
      debug: false,
      emitInitialState: false,
      eventBufferSize: 0,
      idleTimeout: false,
      plugins: [],
    });
    expect(Object.isFrozen(config)).toBe(true);
    expect(Object.isFrozen(config.crossTab)).toBe(true);
    expect(Object.isFrozen(config.activityEvents)).toBe(true);
  });

  it("resolves overrides and merges cross-tab configuration", () => {
    const config = createBrowserLifecycleConfig({
      activityEvents: ["focus", "focus", "keydown"],
      autoStart: false,
      crossTab: {
        channelName: "custom-channel",
        heartbeatInterval: 5_000,
        leaderTimeout: 8_000,
      },
      debug: true,
      emitInitialState: true,
      eventBufferSize: 50,
      idleTimeout: 60_000,
      plugins: [{ id: "analytics" }],
    });

    expect(config).toEqual({
      activityDebounce: 250,
      activityEvents: ["focus", "keydown"],
      autoStart: false,
      crossTab: {
        channelName: "custom-channel",
        enabled: true,
        heartbeatInterval: 5_000,
        leaderTimeout: 8_000,
      },
      debug: true,
      emitInitialState: true,
      eventBufferSize: 50,
      idleTimeout: 60_000,
      plugins: [{ id: "analytics" }],
    });
    expect(getPluginIds(config)).toEqual(["analytics"]);
  });

  it("enables cross-tab defaults when configured with true", () => {
    const config = createBrowserLifecycleConfig({
      crossTab: true,
    });

    expect(config.crossTab.enabled).toBe(true);
    expect(config.crossTab.channelName).toBe("jayoncode:browser-lifecycle");
  });

  it("merges layered configurations", () => {
    const config = mergeBrowserLifecycleConfig(
      {
        crossTab: true,
        debug: false,
        idleTimeout: 10_000,
      },
      {
        crossTab: {
          channelName: "merged-channel",
          leaderTimeout: 5_000,
        },
        debug: true,
      },
    );

    expect(config.crossTab).toEqual({
      channelName: "merged-channel",
      enabled: true,
      heartbeatInterval: 1_000,
      leaderTimeout: 5_000,
    });
    expect(config.debug).toBe(true);
    expect(config.idleTimeout).toBe(10_000);
  });

  it("rejects invalid configuration shapes and values", () => {
    expect(() => {
      validateBrowserLifecycleConfig(null);
    }).toThrow(ConfigurationError);

    try {
      validateBrowserLifecycleConfig({
        activityDebounce: -1,
        activityEvents: ["focus", "invalid-event"],
        autoStart: "yes",
        crossTab: {
          channelName: "",
          heartbeatInterval: 5_000,
          leaderTimeout: 4_000,
          unexpected: true,
        },
        debug: "debug",
        emitInitialState: "true",
        eventBufferSize: -2,
        idleTimeout: 0,
        plugins: [{ id: "" }, { id: "dup" }, { id: "dup" }],
        unknownKey: true,
      });
      throw new Error("Expected configuration validation to fail.");
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigurationError);

      if (!(error instanceof ConfigurationError)) {
        throw error;
      }

      const configurationError = error;
      const issues = configurationError.details?.issues as readonly {
        readonly message: string;
        readonly path: string;
      }[];

      expect(issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: "unknownKey" }),
          expect.objectContaining({ path: "autoStart" }),
          expect.objectContaining({ path: "emitInitialState" }),
          expect.objectContaining({ path: "debug" }),
          expect.objectContaining({ path: "eventBufferSize" }),
          expect.objectContaining({ path: "activityDebounce" }),
          expect.objectContaining({ path: "idleTimeout" }),
          expect.objectContaining({ path: "activityEvents[1]" }),
          expect.objectContaining({ path: "crossTab.unexpected" }),
          expect.objectContaining({ path: "crossTab.channelName" }),
          expect.objectContaining({ path: "crossTab.leaderTimeout" }),
          expect.objectContaining({ path: "plugins[0].id" }),
          expect.objectContaining({ path: "plugins[2].id" }),
        ]),
      );
    }
  });

  it("rejects non-array plugins and invalid activity event lists", () => {
    expect(() => {
      validateBrowserLifecycleConfig({
        activityEvents: [],
        plugins: "plugin",
      });
    }).toThrow(ConfigurationError);
  });

  it("rejects invalid cross-tab shapes and non-object plugins", () => {
    try {
      validateBrowserLifecycleConfig({
        crossTab: "enabled",
        plugins: [true],
      });
      throw new Error("Expected validation to fail.");
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigurationError);

      if (!(error instanceof ConfigurationError)) {
        throw error;
      }

      const configurationError = error;
      const issues = configurationError.details?.issues as readonly {
        readonly path: string;
      }[];

      expect(issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: "crossTab" }),
          expect.objectContaining({ path: "plugins[0]" }),
        ]),
      );
    }
  });
});
