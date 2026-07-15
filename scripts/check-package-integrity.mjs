import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const packagesDir = path.join(rootDir, "packages");
const PUBLISHABLE_PACKAGES = new Set(["browser-lifecycle", "object-diff"]);
const INTERNAL_PRIVATE_PACKAGES = new Set(["shared"]);

const failures = [];
const packageEntries = await readdir(packagesDir, { withFileTypes: true });
const packageDirectories = packageEntries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const packageDirectory of packageDirectories) {
  const packageRoot = path.join(packagesDir, packageDirectory);
  const manifestPath = path.join(packageRoot, "package.json");
  const readmePath = path.join(packageRoot, "README.md");
  const srcDir = path.join(packageRoot, "src");

  let manifest;

  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    failures.push(`Package ${packageDirectory} has an unreadable package.json.`);
    continue;
  }

  try {
    await access(readmePath);
  } catch {
    failures.push(`Package ${packageDirectory} is missing README.md.`);
  }

  try {
    await access(srcDir);
  } catch {
    failures.push(`Package ${packageDirectory} is missing a src/ directory.`);
  }

  const semverPattern = /^\d+\.\d+\.\d+$/;

  if (PUBLISHABLE_PACKAGES.has(packageDirectory)) {
    if (!semverPattern.test(manifest.version) || manifest.version === "0.0.0") {
      failures.push(
        `Package ${packageDirectory} should declare a published semver version, received ${manifest.version}.`,
      );
    }
  } else if (manifest.version !== "0.0.0") {
    failures.push(
      `Package ${packageDirectory} should remain at placeholder version 0.0.0 until publish-ready, received ${manifest.version}.`,
    );
  }

  if (manifest.license !== "MIT") {
    failures.push(`Package ${packageDirectory} should declare the MIT license.`);
  }

  if (manifest.repository?.directory !== `packages/${packageDirectory}`) {
    failures.push(
      `Package ${packageDirectory} should declare repository.directory as packages/${packageDirectory}.`,
    );
  }

  if (PUBLISHABLE_PACKAGES.has(packageDirectory)) {
    if (manifest.private === true) {
      failures.push(`packages/${packageDirectory} must remain public for npm publication.`);
    }
  } else if (INTERNAL_PRIVATE_PACKAGES.has(packageDirectory)) {
    if (manifest.private !== true) {
      failures.push(`packages/${packageDirectory} must remain private.`);
    }
  } else if (manifest.private !== true) {
    failures.push(
      `Placeholder package packages/${packageDirectory} must remain private until it is ready for npm publication.`,
    );
  }
}

if (failures.length > 0) {
  console.error("Package integrity check failed:");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log(`Package integrity check passed for ${packageDirectories.length} packages.`);
