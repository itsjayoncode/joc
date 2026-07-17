#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/**
 * Publishable packages with versioned documentation archives + version switcher.
 *
 * REQUIRED BY DEFAULT for every package that owns a `/packages/<id>/` docs section —
 * including new packages. Do not ship a docs section without registering here,
 * creating `apps/docs/doc-versions/<id>.json`, wiring VitePress versions meta /
 * the version switcher, and bootstrapping archives on first release
 * (`pnpm docs:archive -- --package <id> --bootstrap`).
 *
 * Keep in sync with scripts/doc-versioning-policy.ts for shared pure helpers.
 * Policy: engineering/014-versioning-policy.md
 */
export const DOC_VERSIONED_PACKAGES = [
  {
    id: "browser-lifecycle",
    npmName: "@jayoncode/browser-lifecycle",
    packageJson: path.join(rootDir, "packages/browser-lifecycle/package.json"),
    docsRoot: path.join(rootDir, "apps/docs/docs/packages/browser-lifecycle"),
    archivesRoot: path.join(rootDir, "apps/docs/archives/browser-lifecycle"),
    manifestPath: path.join(rootDir, "apps/docs/doc-versions/browser-lifecycle.json"),
    versionsMetaPath: path.join(
      rootDir,
      "apps/docs/docs/.vitepress/browser-lifecycle-versions.ts",
    ),
    exportName: "browserLifecycleDocVersions",
    typeName: "BrowserLifecycleDocArchive",
  },
  {
    id: "object-diff",
    npmName: "@jayoncode/object-diff",
    packageJson: path.join(rootDir, "packages/object-diff/package.json"),
    docsRoot: path.join(rootDir, "apps/docs/docs/packages/object-diff"),
    archivesRoot: path.join(rootDir, "apps/docs/archives/object-diff"),
    manifestPath: path.join(rootDir, "apps/docs/doc-versions/object-diff.json"),
    versionsMetaPath: path.join(rootDir, "apps/docs/docs/.vitepress/object-diff-versions.ts"),
    exportName: "objectDiffDocVersions",
    typeName: "ObjectDiffDocArchive",
  },
  {
    id: "form-intelligent",
    npmName: "@jayoncode/form-intelligent",
    packageJson: path.join(rootDir, "packages/form-intelligent/package.json"),
    docsRoot: path.join(rootDir, "apps/docs/docs/packages/form-intelligent"),
    archivesRoot: path.join(rootDir, "apps/docs/archives/form-intelligent"),
    manifestPath: path.join(rootDir, "apps/docs/doc-versions/form-intelligent.json"),
    versionsMetaPath: path.join(
      rootDir,
      "apps/docs/docs/.vitepress/form-intelligent-versions.ts",
    ),
    exportName: "formIntelligentDocVersions",
    typeName: "FormIntelligentDocArchive",
  },
];

/** @deprecated Prefer DOC_VERSIONED_PACKAGES / getDocPackage — kept for older imports. */
export const BROWSER_LIFECYCLE_DOCS_ROOT = DOC_VERSIONED_PACKAGES[0].docsRoot;
/** @deprecated */
export const BROWSER_LIFECYCLE_ARCHIVES_ROOT = DOC_VERSIONED_PACKAGES[0].archivesRoot;
/** @deprecated */
export const BROWSER_LIFECYCLE_VERSIONS_MANIFEST = DOC_VERSIONED_PACKAGES[0].manifestPath;
/** @deprecated */
export const BROWSER_LIFECYCLE_VERSIONS_META = DOC_VERSIONED_PACKAGES[0].versionsMetaPath;
/** @deprecated */
export const BROWSER_LIFECYCLE_PACKAGE_JSON = DOC_VERSIONED_PACKAGES[0].packageJson;

export function getDocPackage(id) {
  const pkg = DOC_VERSIONED_PACKAGES.find((entry) => entry.id === id);
  if (!pkg) {
    throw new Error(`Unknown doc-versioned package: ${id}`);
  }
  return pkg;
}

export function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function readPackageVersion(pkg) {
  return readJson(pkg.packageJson).version;
}

export function readVersionsManifest(pkg) {
  return readJson(pkg.manifestPath);
}

export function writeVersionsManifest(pkg, manifest) {
  writeFileSync(pkg.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

export function archiveDirectoryName(version) {
  // Keep in sync with scripts/doc-versioning-policy.ts
  return `v${version}`;
}

export function archiveBasePath(packageId, version) {
  // Keep in sync with scripts/doc-versioning-policy.ts
  return `/packages/${packageId}/${archiveDirectoryName(version)}`;
}

export function isStagedArchiveDirectoryName(name) {
  return /^v\d/.test(name);
}

export function shouldArchiveForBumpType(currentVersion, bumpType, archivePolicy = "minor") {
  // Keep in sync with scripts/doc-versioning-policy.ts
  if (!bumpType || bumpType === "none") {
    return false;
  }

  if (bumpType === "major") {
    return true;
  }

  const major = Number.parseInt(currentVersion.split(".")[0] ?? "0", 10);

  if (archivePolicy === "major") {
    return bumpType === "major";
  }

  if (major === 0) {
    return bumpType === "minor" || bumpType === "major";
  }

  return bumpType === "major";
}

export function readPendingBumpType(npmName) {
  const changesetDir = path.join(rootDir, ".changeset");
  if (!existsSync(changesetDir)) {
    return null;
  }

  const escaped = npmName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`["']${escaped}["']\\s*:\\s*(patch|minor|major)`);
  const files = readdirSync(changesetDir).filter(
    (file) => file.endsWith(".md") && file !== "README.md",
  );

  let bumpType = null;

  for (const file of files) {
    const content = readFileSync(path.join(changesetDir, file), "utf8");
    const match = content.match(pattern);

    if (!match) {
      continue;
    }

    const nextBump = match[1];
    if (!bumpType) {
      bumpType = nextBump;
      continue;
    }

    const rank = { patch: 0, minor: 1, major: 2 };
    if (rank[nextBump] > rank[bumpType]) {
      bumpType = nextBump;
    }
  }

  return bumpType;
}

export function syncPackageVersionsMeta(pkg) {
  const manifest = readVersionsManifest(pkg);
  const currentVersion = readPackageVersion(pkg);
  const archives = [...(manifest.archives ?? [])].sort((left, right) =>
    right.version.localeCompare(left.version, undefined, { numeric: true }),
  );

  const body = `/** Generated by scripts/lib/doc-versioning.mjs — do not edit manually. */

export const ${pkg.exportName} = {
  packageName: "${manifest.package}",
  basePath: "${manifest.basePath}",
  archivePolicy: "${manifest.archivePolicy ?? "minor"}",
  currentVersion: "${currentVersion}",
  currentVersionLabel: "v${currentVersion}",
  archives: ${JSON.stringify(archives, null, 2)},
} as const;

export type ${pkg.typeName} = (typeof ${pkg.exportName}.archives)[number];
`;

  writeFileSync(pkg.versionsMetaPath, body, "utf8");
  return { id: pkg.id, currentVersion, archiveCount: archives.length };
}

export function syncAllPackageVersionsMeta() {
  return DOC_VERSIONED_PACKAGES.map((pkg) => syncPackageVersionsMeta(pkg));
}

/** @deprecated Use readPackageVersion(getDocPackage("browser-lifecycle")) */
export function readBrowserLifecyclePackageVersion() {
  return readPackageVersion(getDocPackage("browser-lifecycle"));
}

/** @deprecated */
export function readBrowserLifecycleVersionsManifest() {
  return readVersionsManifest(getDocPackage("browser-lifecycle"));
}

/** @deprecated */
export function writeBrowserLifecycleVersionsManifest(manifest) {
  return writeVersionsManifest(getDocPackage("browser-lifecycle"), manifest);
}

/** @deprecated */
export function readPendingBrowserLifecycleBumpType() {
  return readPendingBumpType("@jayoncode/browser-lifecycle");
}

/** @deprecated */
export function syncBrowserLifecycleVersionsMeta() {
  return syncPackageVersionsMeta(getDocPackage("browser-lifecycle"));
}
