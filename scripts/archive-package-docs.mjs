#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  archiveDirectoryName,
  BROWSER_LIFECYCLE_ARCHIVES_ROOT,
  BROWSER_LIFECYCLE_DOCS_ROOT,
  readBrowserLifecyclePackageVersion,
  readBrowserLifecycleVersionsManifest,
  readPendingBrowserLifecycleBumpType,
  shouldArchiveForBumpType,
  syncBrowserLifecycleVersionsMeta,
  writeBrowserLifecycleVersionsManifest,
} from "./lib/doc-versioning.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  return {
    force: argv.includes("--force"),
    bootstrap: argv.includes("--bootstrap"),
    beforeRelease: argv.includes("--before-release"),
    dryRun: argv.includes("--dry-run"),
  };
}

function ensureDocsPrepared() {
  const result = spawnSync("pnpm", ["docs:prepare"], {
    cwd: rootDir,
    stdio: "inherit",
    env: {
      ...process.env,
      DOCS_SYNC_SKIP_QUALITY: "1",
    },
  });

  if (result.status !== 0) {
    throw new Error("docs:prepare failed before archiving browser-lifecycle documentation.");
  }
}

function writeArchiveMetadata(archiveDir, version) {
  writeFileSync(
    path.join(archiveDir, ".doc-version.json"),
    `${JSON.stringify(
      {
        version,
        label: `v${version}`,
        archivedAt: new Date().toISOString().slice(0, 10),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

function prependArchiveBanner(indexFile, version) {
  if (!existsSync(indexFile)) {
    return;
  }

  const body = readFileSync(indexFile, "utf8");
  if (body.includes("joc-archived-docs")) {
    return;
  }

  const banner = `> [!NOTE]
> **Archived documentation (${`v${version}`})** — You are viewing a frozen snapshot for \`@jayoncode/browser-lifecycle@${version}\`. See the [latest docs](/packages/browser-lifecycle/) for the current release.

`;

  const updated = body.replace(/^(---[\s\S]*?---\n\n)/, `$1${banner}`);
  writeFileSync(indexFile, updated, "utf8");
}

function archiveCurrentDocs(version, { dryRun }) {
  const archiveDir = path.join(BROWSER_LIFECYCLE_ARCHIVES_ROOT, archiveDirectoryName(version));

  if (dryRun) {
    console.log(`[dry-run] Would archive browser-lifecycle docs to ${archiveDir}`);
    return archiveDir;
  }

  rmSync(archiveDir, { recursive: true, force: true });
  mkdirSync(path.dirname(archiveDir), { recursive: true });
  cpSync(BROWSER_LIFECYCLE_DOCS_ROOT, archiveDir, { recursive: true });
  writeArchiveMetadata(archiveDir, version);
  prependArchiveBanner(path.join(archiveDir, "index.md"), version);

  return archiveDir;
}

function upsertManifestArchive(version, { dryRun }) {
  const manifest = readBrowserLifecycleVersionsManifest();
  const archives = manifest.archives ?? [];
  const existing = archives.find((entry) => entry.version === version);

  if (existing) {
    return false;
  }

  const nextArchive = {
    version,
    label: `v${version}`,
    archivedAt: new Date().toISOString().slice(0, 10),
  };

  if (dryRun) {
    console.log(`[dry-run] Would add ${nextArchive.label} to doc version manifest.`);
    return true;
  }

  manifest.archives = [...archives, nextArchive].sort((left, right) =>
    right.version.localeCompare(left.version, undefined, { numeric: true }),
  );
  writeBrowserLifecycleVersionsManifest(manifest);
  return true;
}

function formatArchivedDocs(archiveDir) {
  const prettierBin = path.join(rootDir, "node_modules/prettier/bin/prettier.cjs");
  const result = spawnSync(process.execPath, [prettierBin, "--write", archiveDir], {
    cwd: rootDir,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error("Prettier failed while formatting archived documentation.");
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const currentVersion = readBrowserLifecyclePackageVersion();
  const manifest = readBrowserLifecycleVersionsManifest();
  const alreadyArchived = (manifest.archives ?? []).some(
    (entry) => entry.version === currentVersion,
  );

  if (options.beforeRelease) {
    const bumpType = readPendingBrowserLifecycleBumpType();
    if (!shouldArchiveForBumpType(currentVersion, bumpType, manifest.archivePolicy)) {
      console.log(
        `Skipping browser-lifecycle doc archive for ${currentVersion} (${bumpType ?? "no"} changeset bump).`,
      );
      syncBrowserLifecycleVersionsMeta();
      return;
    }
  }

  if (alreadyArchived && !options.force && !options.bootstrap) {
    console.log(`browser-lifecycle@${currentVersion} docs are already archived.`);
    syncBrowserLifecycleVersionsMeta();
    return;
  }

  if (!existsSync(BROWSER_LIFECYCLE_DOCS_ROOT)) {
    throw new Error(
      `Missing browser-lifecycle docs at ${BROWSER_LIFECYCLE_DOCS_ROOT}. Run pnpm docs:prepare first.`,
    );
  }

  if (!options.dryRun) {
    ensureDocsPrepared();
  }

  const archiveDir = archiveCurrentDocs(currentVersion, options);
  const manifestUpdated = upsertManifestArchive(currentVersion, options);

  if (!options.dryRun) {
    formatArchivedDocs(archiveDir);
    syncBrowserLifecycleVersionsMeta();
  }

  console.log(
    `Archived browser-lifecycle@${currentVersion} docs to ${archiveDir}${
      manifestUpdated ? " and updated version manifest." : "."
    }`,
  );
}

main();
