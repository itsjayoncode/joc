import {
  BrowserLifecycleError,
  ConfigurationError,
  InitializationError,
  PluginError,
  UnsupportedFeatureError,
} from "@jayoncode/browser-lifecycle";
import { describe, expect, it } from "vitest";

describe("error hierarchy", () => {
  it("creates the base error with code, details, and cause", () => {
    const cause = new Error("root cause");
    const error = new BrowserLifecycleError("base message", "configuration_error", {
      cause,
      details: {
        field: "idleTimeout",
      },
    });

    expect(error.name).toBe("BrowserLifecycleError");
    expect(error.message).toBe("base message");
    expect(error.code).toBe("configuration_error");
    expect(error.details).toEqual({
      field: "idleTimeout",
    });
    expect(error.cause).toBe(cause);
  });

  it("creates typed subclass errors", () => {
    expect(new ConfigurationError("bad config")).toMatchObject({
      code: "configuration_error",
      name: "ConfigurationError",
    });
    expect(new InitializationError("bad init")).toMatchObject({
      code: "initialization_error",
      name: "InitializationError",
    });
    expect(new PluginError("bad plugin")).toMatchObject({
      code: "plugin_error",
      name: "PluginError",
    });
    expect(new UnsupportedFeatureError("missing feature")).toMatchObject({
      code: "unsupported_feature_error",
      name: "UnsupportedFeatureError",
    });
  });
});
