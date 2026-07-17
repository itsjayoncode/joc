import { describe, expect, it } from "vitest";

import { sandboxConfigToPackageConfig } from "./build-session.js";
import { generateSandboxCode } from "./generate-code.js";
import { DEFAULT_SANDBOX_CONFIG } from "./types.js";

describe("sandbox config mapping", () => {
  it("maps idle and crossTab into package config", () => {
    const pkg = sandboxConfigToPackageConfig(DEFAULT_SANDBOX_CONFIG);
    expect(pkg.idleTimeout).toBe(DEFAULT_SANDBOX_CONFIG.idle.timeoutMs);
    expect(pkg.crossTab).toEqual(
      expect.objectContaining({
        channelName: DEFAULT_SANDBOX_CONFIG.crossTab.channelName,
      }),
    );
    expect(pkg.plugins?.some((plugin) => plugin.id === "sandbox-logger")).toBe(true);
  });

  it("disables idle and crossTab when modules are off", () => {
    const pkg = sandboxConfigToPackageConfig({
      ...DEFAULT_SANDBOX_CONFIG,
      modules: { ...DEFAULT_SANDBOX_CONFIG.modules, idle: false, crossTab: false },
      loggerPlugin: false,
    });
    expect(pkg.idleTimeout).toBe(false);
    expect(pkg.crossTab).toBe(false);
    expect(pkg.plugins ?? []).toHaveLength(0);
  });

  it("generates createBrowserLifecycle code", () => {
    const code = generateSandboxCode(DEFAULT_SANDBOX_CONFIG);
    expect(code).toContain("createBrowserLifecycle");
    expect(code).toContain("idleTimeout:");
    expect(code).toContain("crossTab:");
  });
});
