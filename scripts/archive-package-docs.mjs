#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  archiveDirectoryName,
  DOC_VERSIONED_PACKAGES,
  getDocPackage,
  isStagedArchiveDirectoryName,
  readPackageVersion,
  readPendingBumpType,
  readVersionsManifest,
  readManifestArchiveConfig,
  shouldArchiveForBumpType,
  syncAllPackageVersionsMeta,
  syncPackageVersionsMeta,
  writeVersionsManifest,
} from "./lib/doc-versioning.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const packageFlagIndex = argv.indexOf("--package");
  const packageId =
    packageFlagIndex >= 0 && argv[packageFlagIndex + 1] ? argv[packageFlagIndex + 1] : null;

  return {
    force: argv.includes("--force"),
    bootstrap: argv.includes("--bootstrap"),
    beforeRelease: argv.includes("--before-release"),
    dryRun: argv.includes("--dry-run"),
    packageId,
  };
}

function resolvePackages(packageId) {
  if (!packageId) {
    return DOC_VERSIONED_PACKAGES;
  }

  return [getDocPackage(packageId)];
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
    throw new Error("docs:prepare failed before archiving package documentation.");
  }
}

function cleanStagedArchiveDirs(docsRoot) {
  if (!existsSync(docsRoot)) {
    return;
  }

  for (const entry of readdirSync(docsRoot, { withFileTypes: true })) {
    if (entry.isDirectory() && isStagedArchiveDirectoryName(entry.name)) {
      rmSync(path.join(docsRoot, entry.name), { recursive: true, force: true });
    }
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

function prependArchiveBanner(indexFile, pkg, version) {
  if (!existsSync(indexFile)) {
    return;
  }

  const body = readFileSync(indexFile, "utf8");
  if (body.includes("Archived documentation")) {
    return;
  }

  const banner = `> [!NOTE]
> **Archived documentation (${`v${version}`})** — You are viewing a frozen snapshot for \`${pkg.npmName}@${version}\`. See the [latest docs](/packages/${pkg.id}/) for the current release.

`;

  const updated = body.replace(/^(---[\s\S]*?---\n\n)/, `$1${banner}`);
  writeFileSync(indexFile, updated, "utf8");
}

function archiveCurrentDocs(pkg, version, { dryRun }) {
  const archiveDir = path.join(pkg.archivesRoot, archiveDirectoryName(version));

  if (dryRun) {
    console.log(`[dry-run] Would archive ${pkg.id} docs to ${archiveDir}`);
    return archiveDir;
  }

  // Never copy staged v* trees into the archive (avoids nested v0.1.3/v0.1.2).
  cleanStagedArchiveDirs(pkg.docsRoot);

  rmSync(archiveDir, { recursive: true, force: true });
  mkdirSync(path.dirname(archiveDir), { recursive: true });
  cpSync(pkg.docsRoot, archiveDir, { recursive: true });
  writeArchiveMetadata(archiveDir, version);
  prependArchiveBanner(path.join(archiveDir, "index.md"), pkg, version);

  return archiveDir;
}

function upsertManifestArchive(pkg, version, { dryRun }) {
  const manifest = readVersionsManifest(pkg);
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
    console.log(`[dry-run] Would add ${nextArchive.label} to ${pkg.id} doc version manifest.`);
    return true;
  }

  manifest.archives = [...archives, nextArchive].sort((left, right) =>
    right.version.localeCompare(left.version, undefined, { numeric: true }),
  );
  writeVersionsManifest(pkg, manifest);
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

function archivePackage(pkg, options) {
  const currentVersion = readPackageVersion(pkg);
  const manifest = readVersionsManifest(pkg);
  const alreadyArchived = (manifest.archives ?? []).some(
    (entry) => entry.version === currentVersion,
  );

  if (options.beforeRelease) {
    const bumpType = readPendingBumpType(pkg.npmName);
    if (!shouldArchiveForBumpType(currentVersion, bumpType, readManifestArchiveConfig(manifest))) {
      console.log(
        `Skipping ${pkg.id} doc archive for ${currentVersion} (${bumpType ?? "no"} changeset bump).`,
      );
      syncPackageVersionsMeta(pkg);
      return;
    }
  }

  if (alreadyArchived && !options.force && !options.bootstrap) {
    console.log(`${pkg.id}@${currentVersion} docs are already archived.`);
    syncPackageVersionsMeta(pkg);
    return;
  }

  if (!existsSync(pkg.docsRoot)) {
    throw new Error(`Missing ${pkg.id} docs at ${pkg.docsRoot}. Run pnpm docs:prepare first.`);
  }

  const archiveDir = archiveCurrentDocs(pkg, currentVersion, options);
  const manifestUpdated = upsertManifestArchive(pkg, currentVersion, options);

  if (!options.dryRun) {
    formatArchivedDocs(archiveDir);
    syncPackageVersionsMeta(pkg);
  }

  console.log(
    `Archived ${pkg.id}@${currentVersion} docs to ${archiveDir}${
      manifestUpdated ? " and updated version manifest." : "."
    }`,
  );
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packages = resolvePackages(options.packageId);

  if (!options.dryRun && !options.beforeRelease) {
    // Prepare once when explicitly archiving; release hook already runs after docs are ready enough.
    ensureDocsPrepared();
  } else if (!options.dryRun && options.beforeRelease) {
    ensureDocsPrepared();
  }

  for (const pkg of packages) {
    archivePackage(pkg, options);
  }

  if (!options.dryRun) {
    syncAllPackageVersionsMeta();
  }
}

main();
