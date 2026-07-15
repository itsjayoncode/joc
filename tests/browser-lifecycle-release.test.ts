import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageDir = path.join(rootDir, "packages/browser-lifecycle");

describe("browser-lifecycle release version", () => {
  it("ships version 0.1.2", () => {
    const manifest = JSON.parse(readFileSync(path.join(packageDir, "package.json"), "utf8")) as {
      version: string;
    };

    expect(manifest.version).toBe("0.1.2");
  });

  it("documents the release in CHANGELOG.md", () => {
    const changelog = readFileSync(path.join(packageDir, "CHANGELOG.md"), "utf8");

    expect(changelog).toContain("## [0.1.2]");
    expect(changelog).toContain("## [0.1.1]");
    expect(changelog).toContain("## [0.1.0]");
  });
});
