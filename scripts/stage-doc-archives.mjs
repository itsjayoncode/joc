#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  archiveDirectoryName,
  BROWSER_LIFECYCLE_ARCHIVES_ROOT,
  BROWSER_LIFECYCLE_DOCS_ROOT,
  readBrowserLifecycleVersionsManifest,
  syncBrowserLifecycleVersionsMeta,
} from "./lib/doc-versioning.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function cleanStagedArchives() {
  if (!existsSync(BROWSER_LIFECYCLE_DOCS_ROOT)) {
    return;
  }

  for (const entry of readdirSync(BROWSER_LIFECYCLE_DOCS_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (/^v\d/.test(entry.name)) {
      rmSync(path.join(BROWSER_LIFECYCLE_DOCS_ROOT, entry.name), {
        recursive: true,
        force: true,
      });
    }
  }
}

function stageArchives() {
  const manifest = readBrowserLifecycleVersionsManifest();
  const archives = manifest.archives ?? [];
  let stagedCount = 0;

  cleanStagedArchives();

  for (const archive of archives) {
    const sourceDir = path.join(
      BROWSER_LIFECYCLE_ARCHIVES_ROOT,
      archiveDirectoryName(archive.version),
    );
    const targetDir = path.join(BROWSER_LIFECYCLE_DOCS_ROOT, archiveDirectoryName(archive.version));

    if (!existsSync(sourceDir)) {
      console.warn(`Missing archived docs for ${archive.label} at ${sourceDir}`);
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
  const result = spawnSync(
    process.execPath,
    [prettierBin, "--write", "apps/docs/docs/.vitepress/browser-lifecycle-versions.ts"],
    {
      cwd: rootDir,
      stdio: "inherit",
    },
  );

  if (result.status !== 0) {
    throw new Error("Prettier failed while formatting browser-lifecycle-versions.ts.");
  }
}

const stagedCount = stageArchives();
const { currentVersion, archiveCount } = syncBrowserLifecycleVersionsMeta();

if (process.env.DOCS_SYNC_SKIP_QUALITY !== "1") {
  formatGeneratedMeta();
}

console.log(
  `Staged ${stagedCount} archived browser-lifecycle doc version(s); current=${currentVersion}, manifest=${archiveCount}.`,
);
