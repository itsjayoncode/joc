import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const packagesDir = path.join(rootDir, "packages");

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

  if (manifest.version !== "0.0.0") {
    failures.push(
      `Package ${packageDirectory} should stay at version 0.0.0 during pre-release setup.`,
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

  if (packageDirectory === "shared") {
    if (manifest.private !== true) {
      failures.push("packages/shared must remain private.");
    }
  } else if (manifest.private === true) {
    failures.push(`Package ${packageDirectory} should not be marked private.`);
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
