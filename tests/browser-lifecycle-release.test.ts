import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageDir = path.join(rootDir, "packages/browser-lifecycle");

function readPackageManifest() {
  return JSON.parse(readFileSync(path.join(packageDir, "package.json"), "utf8")) as {
    version: string;
  };
}

describe("browser-lifecycle release version", () => {
  it("declares a valid semver version in package.json", () => {
    const manifest = readPackageManifest();

    expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(manifest.version).not.toBe("0.0.0");
  });

  it("documents the current release in CHANGELOG.md", () => {
    const manifest = readPackageManifest();
    const changelog = readFileSync(path.join(packageDir, "CHANGELOG.md"), "utf8");

    expect(changelog).toContain(manifest.version);
  });
});
