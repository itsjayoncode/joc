import { access, readdir, readFile } from "node:fs/promises";
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
  "templates/package-template/packages/browser-lifecycle/examples/README.md",
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

const productionPackageRequirements = [
  "README.md",
  "CHANGELOG.md",
  "package.json",
  "src/index.ts",
  "docs",
  "tests",
  "examples",
];

const failures = [];

for (const relativePath of requiredPaths) {
  try {
    await access(path.join(rootDir, relativePath));
  } catch {
    failures.push(`Missing required package blueprint artifact: ${relativePath}`);
  }
}

const packagesDir = path.join(rootDir, "packages");
const packageEntries = await readdir(packagesDir, { withFileTypes: true });

for (const entry of packageEntries) {
  if (!entry.isDirectory() || entry.name === "shared") {
    continue;
  }

  const packageRoot = path.join(packagesDir, entry.name);
  const srcDir = path.join(packageRoot, "src");
  let sourceEntries = [];

  try {
    sourceEntries = await readdir(srcDir, { recursive: true });
  } catch {
    continue;
  }

  const hasImplementation = sourceEntries.some(
    (fileName) =>
      typeof fileName === "string" && fileName.endsWith(".ts") && fileName !== "index.ts",
  );

  if (!hasImplementation) {
    continue;
  }

  for (const relativePath of productionPackageRequirements) {
    try {
      await access(path.join(packageRoot, relativePath));
    } catch {
      failures.push(
        `Production package packages/${entry.name} is missing required blueprint file: ${relativePath}`,
      );
    }
  }

  const engineeringNotePath = path.join(packageRoot, "engineering", "008-folder-architecture.md");
  const hasEngineeringNote = await access(engineeringNotePath)
    .then(() => true)
    .catch(() => false);

  if (!hasEngineeringNote) {
    failures.push(
      `Production package packages/${entry.name} should document its folder layout in engineering/008-folder-architecture.md`,
    );
  }

  const manifest = JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8"));

  if (!manifest.name?.startsWith("@jayoncode/")) {
    failures.push(`Production package packages/${entry.name} should use the @jayoncode npm scope.`);
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
