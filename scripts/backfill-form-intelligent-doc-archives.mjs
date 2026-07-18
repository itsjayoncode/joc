#!/usr/bin/env node
/**
 * One-shot / maintenance: rebuild Form Intelligence doc archives from historical
 * git tips so the docs version dropdown has prior releases (like browser-lifecycle).
 *
 * Usage: node scripts/backfill-form-intelligent-doc-archives.mjs
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  archiveDirectoryName,
  getDocPackage,
  syncPackageVersionsMeta,
  writeVersionsManifest,
  readVersionsManifest,
} from "./lib/doc-versioning.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Last commit that still carried each published version before the next bump. */
const ARCHIVES = [
  {
    version: "3.1.0",
    commit: "c7e9d57eb4c75bb71cfe9050505ad99cb3861364",
    archivedAt: "2026-07-17",
  },
  {
    version: "1.1.0",
    commit: "43f558c7ff3934e2c8571147360be68080f4b1a1",
    archivedAt: "2026-07-17",
  },
  {
    version: "1.0.0",
    commit: "0f961ffd926c8e6c482645fafa399214e6bbcce7",
    archivedAt: "2026-07-16",
  },
];

const SKIP_MODULE_FILES = new Set(["index.md", "overview.md"]);

function gitShow(commit, filePath) {
  const result = spawnSync("git", ["show", `${commit}:${filePath}`], {
    cwd: rootDir,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0) {
    return null;
  }
  return result.stdout;
}

function gitListTree(commit, dirPath) {
  const result = spawnSync("git", ["ls-tree", "--name-only", `${commit}:${dirPath}`], {
    cwd: rootDir,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    return [];
  }
  return result.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toTitle(fileName) {
  return fileName
    .replace(/\.md$/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function yamlScalar(value) {
  const str = String(value);
  if (
    str === "" ||
    /^[\s]/.test(str) ||
    /[\s]$/.test(str) ||
    /[:#|>&*!%@`[\]{},\n]/.test(str) ||
    /^(true|false|null|~|yes|no|on|off)$/i.test(str) ||
    /^-/.test(str)
  ) {
    return JSON.stringify(str);
  }
  return str;
}

function withFrontmatter(fileName, body, extra = {}) {
  const title = extra.title ?? toTitle(fileName);
  const lines = ["---", `title: ${yamlScalar(title)}`];

  if (extra.description) {
    lines.push(`description: ${yamlScalar(extra.description)}`);
  }
  if (extra.layout) {
    lines.push(`layout: ${yamlScalar(extra.layout)}`);
  }
  if (extra.sidebar === false) {
    lines.push("sidebar: false");
  }
  if (extra.aside === false) {
    lines.push("aside: false");
  }
  if (extra.pageClass) {
    lines.push(`pageClass: ${yamlScalar(extra.pageClass)}`);
  }
  if (extra.playgroundUrl) {
    lines.push(`playground: ${yamlScalar(extra.playgroundUrl)}`);
  }

  lines.push("---", "");
  return `${lines.join("\n")}${body.trim()}\n`;
}

function rewriteModuleLinks(body) {
  return body.replace(/\]\(\.\/([^)]+)\.md\)/g, "](/packages/form-intelligence/modules/$1)");
}

function prependArchiveBanner(indexBody, version) {
  if (indexBody.includes("Archived documentation")) {
    return indexBody;
  }

  const banner = `> [!NOTE]
> **Archived documentation (v${version})** — You are viewing a frozen snapshot for \`@jayoncode/form-intelligent@${version}\`. See the [latest docs](/packages/form-intelligence/) for the current release.

`;

  return indexBody.replace(/^(---[\s\S]*?---\n\n)/, `$1${banner}`);
}

function writeFile(filePath, contents) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, contents, "utf8");
}

function buildArchive(pkg, entry) {
  const archiveDir = path.join(pkg.archivesRoot, archiveDirectoryName(entry.version));
  rmSync(archiveDir, { recursive: true, force: true });
  mkdirSync(archiveDir, { recursive: true });

  const indexSource = gitShow(entry.commit, "packages/form-intelligence/docs/index.md");
  if (!indexSource) {
    throw new Error(`Missing index.md at ${entry.commit} for ${entry.version}`);
  }

  let indexBody = withFrontmatter("index.md", rewriteModuleLinks(indexSource), {
    title: "Form Intelligence",
    description: "Landing page for @jayoncode/form-intelligence — headless form workflow engine.",
    layout: "doc",
    sidebar: false,
    aside: false,
    pageClass: "joc-package-landing-page",
  });
  indexBody = prependArchiveBanner(indexBody, entry.version);
  writeFile(path.join(archiveDir, "index.md"), indexBody);

  const overviewSource = gitShow(entry.commit, "packages/form-intelligence/docs/overview.md");
  if (overviewSource) {
    writeFile(
      path.join(archiveDir, "overview.md"),
      withFrontmatter("overview.md", rewriteModuleLinks(overviewSource), {
        title: "Form Intelligence overview",
        description: "Documentation overview for @jayoncode/form-intelligent.",
      }),
    );
  }

  const moduleFiles = gitListTree(entry.commit, "packages/form-intelligence/docs").filter(
    (name) => name.endsWith(".md") && !SKIP_MODULE_FILES.has(name),
  );

  for (const file of moduleFiles) {
    const source = gitShow(entry.commit, `packages/form-intelligence/docs/${file}`);
    if (!source) {
      continue;
    }
    writeFile(
      path.join(archiveDir, "modules", file),
      withFrontmatter(file, rewriteModuleLinks(source), {
        title: toTitle(file),
        description: `Form Intelligence documentation for ${toTitle(file)}.`,
      }),
    );
  }

  const playgroundFiles = gitListTree(entry.commit, "apps/form-intelligence-playground/docs");
  for (const file of playgroundFiles.filter((name) => name.endsWith(".md"))) {
    const source = gitShow(entry.commit, `apps/form-intelligence-playground/docs/${file}`);
    if (!source) {
      continue;
    }
    writeFile(
      path.join(archiveDir, "playground", file),
      withFrontmatter(file, source, {
        title: toTitle(file),
        description: `Form Intelligence playground documentation for ${toTitle(file)}.`,
        playgroundUrl: "/playground/form-intelligence/",
      }),
    );
  }

  const changelog =
    gitShow(entry.commit, "packages/form-intelligence/CHANGELOG.md") ??
    `# Changelog\n\nRelease history for \`@jayoncode/form-intelligent@${entry.version}\`.\n`;
  writeFile(
    path.join(archiveDir, "changelog.md"),
    withFrontmatter("changelog.md", changelog, {
      title: "Changelog",
      description: "Release history for @jayoncode/form-intelligent.",
    }),
  );

  const liveApi = path.join(pkg.docsRoot, "api");
  if (existsSync(liveApi)) {
    cpSync(liveApi, path.join(archiveDir, "api"), { recursive: true });
  } else {
    writeFile(
      path.join(archiveDir, "api", "index.md"),
      withFrontmatter(
        "index.md",
        "# API Reference\n\nAPI docs for this archive were not snapshotted. See the [latest API](/packages/form-intelligence/api/).\n",
        {
          title: "API Reference",
          description: "Form Intelligence API reference placeholder for archived docs.",
        },
      ),
    );
  }

  writeFile(
    path.join(archiveDir, ".doc-version.json"),
    `${JSON.stringify(
      {
        version: entry.version,
        label: `v${entry.version}`,
        archivedAt: entry.archivedAt,
      },
      null,
      2,
    )}\n`,
  );

  return archiveDir;
}

function formatArchive(archiveDir) {
  const prettierBin = path.join(rootDir, "node_modules/prettier/bin/prettier.cjs");
  if (!existsSync(prettierBin)) {
    return;
  }
  spawnSync(process.execPath, [prettierBin, "--write", archiveDir], {
    cwd: rootDir,
    stdio: "inherit",
  });
}

const pkg = getDocPackage("form-intelligence");
const manifest = readVersionsManifest(pkg);

const built = [];
for (const entry of ARCHIVES) {
  const archiveDir = buildArchive(pkg, entry);
  formatArchive(archiveDir);
  built.push(entry);
  console.log(`Built ${pkg.id}@${entry.version} → ${archiveDir}`);
}

manifest.archives = built
  .map((entry) => ({
    version: entry.version,
    label: `v${entry.version}`,
    archivedAt: entry.archivedAt,
  }))
  .sort((left, right) => right.version.localeCompare(left.version, undefined, { numeric: true }));

writeVersionsManifest(pkg, manifest);
syncPackageVersionsMeta(pkg);

console.log(
  `Updated ${pkg.manifestPath} with ${manifest.archives.length} archive(s): ${manifest.archives
    .map((entry) => entry.label)
    .join(", ")}`,
);
