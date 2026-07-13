import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const workspaceRoots = ["apps", "packages", "examples", "templates"];
const requiredRootFiles = [
  "package.json",
  "pnpm-workspace.yaml",
  "turbo.json",
  "tsconfig.base.json",
  "eslint.config.js",
  "prettier.config.js",
  "vitest.config.ts",
];

const failures = [];

for (const directory of workspaceRoots) {
  try {
    await access(path.join(rootDir, directory));
  } catch {
    failures.push(`Missing workspace root directory: ${directory}`);
  }
}

for (const file of requiredRootFiles) {
  try {
    await access(path.join(rootDir, file));
  } catch {
    failures.push(`Missing required root file: ${file}`);
  }
}

const rootManifest = JSON.parse(await readFile(path.join(rootDir, "package.json"), "utf8"));

if (rootManifest.private !== true) {
  failures.push("The root package.json must remain private for the monorepo.");
}

if (rootManifest.type !== "module") {
  failures.push(
    'The root package.json should declare "type": "module" for the shared tooling layer.',
  );
}

const packageEntries = await readdir(path.join(rootDir, "packages"), { withFileTypes: true });
const packageDirectories = packageEntries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

if (packageDirectories.length === 0) {
  failures.push("No package directories were found in packages/.");
}

const seenPackageNames = new Set();

for (const packageDirectory of packageDirectories) {
  const manifestPath = path.join(rootDir, "packages", packageDirectory, "package.json");

  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

    if (typeof manifest.name !== "string" || manifest.name.length === 0) {
      failures.push(`Package ${packageDirectory} is missing a valid name.`);
      continue;
    }

    if (seenPackageNames.has(manifest.name)) {
      failures.push(`Duplicate package name detected: ${manifest.name}`);
    }

    seenPackageNames.add(manifest.name);
  } catch {
    failures.push(`Package ${packageDirectory} is missing a readable package.json.`);
  }
}

if (failures.length > 0) {
  console.error("Workspace health check failed:");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log(`Workspace health check passed for ${packageDirectories.length} packages.`);
