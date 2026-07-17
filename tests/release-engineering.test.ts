import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredReleaseFiles = [
  ".changeset/config.json",
  ".changeset/README.md",
  ".github/workflows/release.yml",
  "engineering/007-release-engineering.md",
];

describe("release engineering foundation", () => {
  it("includes the core release-engineering artifacts", () => {
    for (const relativePath of requiredReleaseFiles) {
      expect(existsSync(path.join(rootDir, relativePath))).toBe(true);
    }
  });

  it("publishes live packages and ignores private form adapters/apps", () => {
    const config = JSON.parse(
      readFileSync(path.join(rootDir, ".changeset/config.json"), "utf8"),
    ) as {
      ignore: string[];
    };

    expect(config.ignore).not.toContain("@jayoncode/browser-lifecycle");
    expect(config.ignore).not.toContain("@jayoncode/browser-lifecycle-react");
    expect(config.ignore).not.toContain("@jayoncode/form-intelligent");
    expect(config.ignore).not.toContain("@jayoncode/object-diff");
    expect(config.ignore).toContain("@jayoncode/browser-session-playground");
    expect(config.ignore).toContain("@jayoncode/form-intelligent-react");
  });

  it("keeps browser-lifecycle adapters public for npm publication", () => {
    const adapter = JSON.parse(
      readFileSync(path.join(rootDir, "packages/browser-lifecycle-react/package.json"), "utf8"),
    ) as { private?: boolean; version: string };
    const browserLifecycle = JSON.parse(
      readFileSync(path.join(rootDir, "packages/browser-lifecycle/package.json"), "utf8"),
    ) as { private?: boolean };

    expect(adapter.private).not.toBe(true);
    expect(adapter.version).not.toBe("0.0.0");
    expect(browserLifecycle.private).not.toBe(true);
  });

  it("archives browser-lifecycle docs before changeset version bumps", () => {
    const rootPackage = JSON.parse(readFileSync(path.join(rootDir, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(rootPackage.scripts["release:version"]).toContain("archive-package-docs.mjs");
    expect(rootPackage.scripts["release:version"]).toContain("--before-release");
  });
});
