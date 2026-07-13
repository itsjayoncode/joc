import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredDocsPages = [
  "apps/docs/docs/index.md",
  "apps/docs/docs/getting-started/introduction.md",
  "apps/docs/docs/guides/architecture.md",
  "apps/docs/docs/packages/browser-lifecycle/index.md",
  "apps/docs/docs/roadmap/index.md",
];

const requiredExamplePlaceholders = [
  "examples/browser-lifecycle/README.md",
  "examples/request/README.md",
  "examples/theme/README.md",
  "examples/scroll/README.md",
  "examples/forms/README.md",
];

describe("developer experience platform", () => {
  it("includes the key documentation pages", () => {
    for (const relativePath of requiredDocsPages) {
      expect(existsSync(path.join(rootDir, relativePath))).toBe(true);
    }
  });

  it("includes placeholder example directories for future packages", () => {
    for (const relativePath of requiredExamplePlaceholders) {
      expect(existsSync(path.join(rootDir, relativePath))).toBe(true);
    }
  });
});
