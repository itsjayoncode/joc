import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const requiredPaths = [
  "templates/package-template/README.md",
  "templates/package-template/package.json",
  "templates/package-template/src/index.ts",
  "templates/package-template/src/package-name.ts",
  "templates/package-template/tests/README.md",
  "templates/package-template/docs/README.md",
  "templates/package-template/examples/README.md",
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

const failures = [];

for (const relativePath of requiredPaths) {
  try {
    await access(path.join(rootDir, relativePath));
  } catch {
    failures.push(`Missing required package blueprint artifact: ${relativePath}`);
  }
}

if (failures.length > 0) {
  console.error("Package blueprint check failed:");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("Package blueprint check passed.");
