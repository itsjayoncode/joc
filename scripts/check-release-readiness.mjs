import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const requiredFiles = [
  ".changeset/config.json",
  ".changeset/README.md",
  ".github/workflows/release.yml",
  "engineering/007-release-engineering.md",
];

const failures = [];

for (const relativePath of requiredFiles) {
  try {
    await access(path.join(rootDir, relativePath));
  } catch {
    failures.push(`Missing required release engineering file: ${relativePath}`);
  }
}

const changesetConfigPath = path.join(rootDir, ".changeset/config.json");
const releaseWorkflowPath = path.join(rootDir, ".github/workflows/release.yml");

try {
  const changesetConfig = JSON.parse(await readFile(changesetConfigPath, "utf8"));

  if (changesetConfig.access !== "public") {
    failures.push("Changesets access should be set to public for future npm publication.");
  }

  if (changesetConfig.baseBranch !== "main") {
    failures.push('Changesets baseBranch should be "main".');
  }

  if (
    !Array.isArray(changesetConfig.ignore) ||
    !changesetConfig.ignore.includes("@jayoncode/shared")
  ) {
    failures.push("Changesets ignore list should exclude the internal shared package.");
  }
} catch {
  failures.push("Changesets configuration is unreadable.");
}

try {
  const workflowContent = await readFile(releaseWorkflowPath, "utf8");

  if (!workflowContent.includes("changesets/action")) {
    failures.push("Release workflow should use changesets/action for version PR preparation.");
  }

  if (!workflowContent.includes("draft")) {
    failures.push("Release workflow should prepare draft GitHub releases.");
  }
} catch {
  failures.push("Release workflow is unreadable.");
}

if (failures.length > 0) {
  console.error("Release readiness check failed:");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("Release readiness check passed.");
