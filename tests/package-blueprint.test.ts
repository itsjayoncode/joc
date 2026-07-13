import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredBlueprintFiles = [
  "templates/package-template/README.md",
  "templates/package-template/package.json",
  "engineering/008-package-architecture.md",
  "engineering/009-api-design-guidelines.md",
  "engineering/010-browser-support-policy.md",
  "engineering/011-testing-standards.md",
  "engineering/012-documentation-standards.md",
  "engineering/013-coding-conventions.md",
  "engineering/014-versioning-policy.md",
  "engineering/015-public-api-policy.md",
  "engineering/016-package-checklist.md",
];

describe("package engineering blueprint", () => {
  it("includes the package template and standards documents", () => {
    for (const relativePath of requiredBlueprintFiles) {
      expect(existsSync(path.join(rootDir, relativePath))).toBe(true);
    }
  });
});
