import { existsSync } from "node:fs";
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
});
