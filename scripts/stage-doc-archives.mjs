#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  archiveDirectoryName,
  DOC_VERSIONED_PACKAGES,
  isStagedArchiveDirectoryName,
  readVersionsManifest,
  syncAllPackageVersionsMeta,
} from "./lib/doc-versioning.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function cleanStagedArchives(docsRoot) {
  if (!existsSync(docsRoot)) {
    return;
  }

  for (const entry of readdirSync(docsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (isStagedArchiveDirectoryName(entry.name)) {
      rmSync(path.join(docsRoot, entry.name), {
        recursive: true,
        force: true,
      });
    }
  }
}

function stagePackageArchives(pkg) {
  const manifest = readVersionsManifest(pkg);
  const archives = manifest.archives ?? [];
  let stagedCount = 0;

  cleanStagedArchives(pkg.docsRoot);

  for (const archive of archives) {
    const sourceDir = path.join(pkg.archivesRoot, archiveDirectoryName(archive.version));
    const targetDir = path.join(pkg.docsRoot, archiveDirectoryName(archive.version));

    if (!existsSync(sourceDir)) {
      console.warn(`Missing archived docs for ${pkg.id}@${archive.label} at ${sourceDir}`);
      continue;
    }

    mkdirSync(path.dirname(targetDir), { recursive: true });
    cpSync(sourceDir, targetDir, { recursive: true });
    stagedCount += 1;
  }

  return stagedCount;
}

function formatGeneratedMeta() {
  const prettierBin = path.join(rootDir, "node_modules/prettier/bin/prettier.cjs");
  const metaFiles = DOC_VERSIONED_PACKAGES.map((pkg) =>
    path.relative(rootDir, pkg.versionsMetaPath),
  );
  const result = spawnSync(process.execPath, [prettierBin, "--write", ...metaFiles], {
    cwd: rootDir,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error("Prettier failed while formatting package versions meta files.");
  }
}

let totalStaged = 0;
const summaries = [];

for (const pkg of DOC_VERSIONED_PACKAGES) {
  const stagedCount = stagePackageArchives(pkg);
  totalStaged += stagedCount;
  summaries.push(`${pkg.id}=${stagedCount}`);
}

const results = syncAllPackageVersionsMeta();

if (process.env.DOCS_SYNC_SKIP_QUALITY !== "1") {
  formatGeneratedMeta();
}

const currentSummary = results
  .map((entry) => `${entry.id}@${entry.currentVersion}(${entry.archiveCount})`)
  .join(", ");

console.log(
  `Staged ${totalStaged} archived doc version(s) [${summaries.join(", ")}]; ${currentSummary}.`,
);
