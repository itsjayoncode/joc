#!/usr/bin/env node
/**
 * Syncs source-of-truth documentation into the VitePress site.
 *
 * - packages/<pkg>/docs/index.md -> package landing pages
 * - packages/<pkg>/docs/overview.md -> package /overview pages
 * - packages/browser-lifecycle/docs/*.md -> modules/ (except index/overview)
 * - apps/browser-session-playground/docs -> browser-lifecycle playground docs
 * - packages/object-diff/docs -> object-diff modules
 * - apps/object-diff-playground/docs -> object-diff playground docs
 * - packages/form-intelligence/docs -> form-intelligent modules
 * - apps/form-intelligence-playground/docs -> form-intelligent playground docs
 * - packages/storage/docs -> storage modules
 * - apps/storage-playground/docs -> storage playground docs
 */

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

import { syncAllPackageVersionsMeta } from "./lib/doc-versioning.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = path.join(rootDir, "apps/docs/docs");

const PLAYGROUND_ROUTES = {
  "connectivity-playground.md": { route: "/connectivity", label: "Connectivity Playground" },
  "configuration-playground.md": { route: "/configuration", label: "Configuration Playground" },
  "cross-tab-playground.md": { route: "/cross-tab", label: "Cross Tab Playground" },
  "developer-tools.md": { route: "/developer-tools", label: "Developer Tools" },
  "event-explorer.md": { route: "/events", label: "Event Explorer" },
  "focus-playground.md": { route: "/focus", label: "Focus Playground" },
  "idle-playground.md": { route: "/idle", label: "Idle Playground" },
  "lifecycle-playground.md": { route: "/lifecycle", label: "Lifecycle Playground" },
  "performance-playground.md": { route: "/performance", label: "Performance Playground" },
  "playground.md": { route: "/", label: "Sandbox" },
  "plugin-playground.md": { route: "/plugins", label: "Plugin Playground" },
  "state-explorer.md": { route: "/state", label: "State Explorer" },
  "visibility-playground.md": { route: "/visibility", label: "Visibility Playground" },
};

/** Site-relative SPA routes (bundled into docs under /playground/<pkg>/). */
const PLAYGROUND_SPA = {
  browserLifecycle: "/playground/browser-lifecycle",
  objectDiff: "/playground/object-diff",
  formIntelligent: "/playground/form-intelligence",
  storage: "/playground/storage",
};

/** Module → SPA route (not the markdown playground guide page). */
const MODULE_PLAYGROUND_ROUTES = {
  "visibility.md": "/visibility",
  "events.md": "/events",
  "session-core.md": "/lifecycle",
  "core-infrastructure.md": "/configuration",
};

const GITHUB_REPO = "https://github.com/itsjayoncode/joc";
const GITHUB_TREE_MASTER = `${GITHUB_REPO}/tree/master`;

function spaPlaygroundUrl(base, route = "/") {
  if (!route || route === "/") {
    return `${base}/`;
  }
  return `${base}${route.startsWith("/") ? route : `/${route}`}`;
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
  } else if (extra.playgroundRoute !== undefined) {
    lines.push(
      `playground: ${yamlScalar(
        spaPlaygroundUrl(PLAYGROUND_SPA.browserLifecycle, extra.playgroundRoute),
      )}`,
    );
  }

  lines.push("---", "", body.trim(), "");
  return `${lines.join("\n")}\n`;
}

function appendPlaygroundLink(body, spaPath, label) {
  if (
    body.includes("Open Playground") ||
    body.includes("Open Visibility playground") ||
    body.includes("/playground/")
  ) {
    return body;
  }

  return `${body.trim()}\n\n## Interactive Playground\n\nExplore this topic live in the [${label}](${spaPath}).\n`;
}

function rewritePackageDocLinks(body) {
  return body
    .replace(
      /\]\(\.\.\/examples\/([^)]+)\)/g,
      `](${GITHUB_TREE_MASTER}/packages/browser-lifecycle/examples/$1)`,
    )
    .replace(
      /\]\(\.\/engineering\/([^)]+)\)/g,
      `](${GITHUB_TREE_MASTER}/packages/browser-lifecycle/engineering/$1)`,
    )
    .replace(/\]\(\.\/docs\/([^)]+)\)/g, "](/packages/browser-lifecycle/modules/$1)");
}

function syncDirectory({ sourceDir, targetDir, transform }) {
  if (!existsSync(sourceDir)) {
    console.warn(`Skipping missing source directory: ${sourceDir}`);
    return 0;
  }

  rmSync(targetDir, { recursive: true, force: true });
  mkdirSync(targetDir, { recursive: true });

  const files = readdirSync(sourceDir).filter(
    (file) =>
      file.endsWith(".md") &&
      file !== "index.md" &&
      file !== "overview.md" &&
      file.toLowerCase() !== "readme.md",
  );
  for (const file of files) {
    const body = readFileSync(path.join(sourceDir, file), "utf8");
    const output = transform(file, body);
    writeFileSync(path.join(targetDir, file), output, "utf8");
  }

  return files.length;
}

function rewriteBrowserLifecyclePackageDocLinks(body) {
  return body.replace(/\]\(\.\/([^)]+)\.md\)/g, "](/packages/browser-lifecycle/modules/$1)");
}

function rewriteObjectDiffDocLinks(body) {
  return body.replace(/\]\(\.\/([^)]+)\.md\)/g, "](/packages/object-diff/modules/$1)");
}

function syncBrowserLifecycleIndex() {
  const sourceFile = path.join(rootDir, "packages/browser-lifecycle/docs/index.md");
  const targetFile = path.join(docsRoot, "packages/browser-lifecycle/index.md");

  if (!existsSync(sourceFile)) {
    return 0;
  }

  const body = rewriteBrowserLifecyclePackageDocLinks(readFileSync(sourceFile, "utf8"));
  writeFileSync(
    targetFile,
    withFrontmatter("index.md", body, {
      title: "@jayoncode/browser-lifecycle | Browser Lifecycle",
      description:
        "Observe browser state. Derive session intelligence. React with confidence. — typed page visibility, focus, connectivity, idle, cross-tab, and optional session intelligence.",
      layout: "doc",
      sidebar: false,
      aside: false,
      pageClass: "joc-package-landing-page",
    }),
    "utf8",
  );

  return 1;
}

function syncBrowserLifecycleOverview() {
  const sourceFile = path.join(rootDir, "packages/browser-lifecycle/docs/overview.md");
  const targetFile = path.join(docsRoot, "packages/browser-lifecycle/overview.md");

  if (!existsSync(sourceFile)) {
    return 0;
  }

  const body = rewriteBrowserLifecyclePackageDocLinks(readFileSync(sourceFile, "utf8"));
  writeFileSync(
    targetFile,
    withFrontmatter("overview.md", body, {
      title: "Browser Lifecycle overview",
      description:
        "Documentation overview for @jayoncode/browser-lifecycle — guides, modules, intelligence, and adapters.",
    }),
    "utf8",
  );

  return 1;
}

function syncPackageModules() {
  const sourceDir = path.join(rootDir, "packages/browser-lifecycle/docs");
  const targetDir = path.join(docsRoot, "packages/browser-lifecycle/modules");

  return syncDirectory({
    sourceDir,
    targetDir,
    transform: (file, body) => {
      const spaRoute = MODULE_PLAYGROUND_ROUTES[file];
      const rewritten = rewriteBrowserLifecyclePackageDocLinks(rewritePackageDocLinks(body));
      const enriched = spaRoute
        ? appendPlaygroundLink(
            rewritten,
            spaPlaygroundUrl(PLAYGROUND_SPA.browserLifecycle, spaRoute),
            toTitle(file),
          )
        : rewritten;

      return withFrontmatter(file, enriched, {
        title: toTitle(file),
        description: `Browser Lifecycle module documentation for ${toTitle(file)}.`,
        playgroundRoute: spaRoute,
      });
    },
  });
}

function syncPlaygroundDocs() {
  const sourceDir = path.join(rootDir, "apps/browser-session-playground/docs");
  const targetDir = path.join(docsRoot, "packages/browser-lifecycle/playground");

  return syncDirectory({
    sourceDir,
    targetDir,
    transform: (file, body) => {
      const route = PLAYGROUND_ROUTES[file];
      const spaPath = route
        ? spaPlaygroundUrl(PLAYGROUND_SPA.browserLifecycle, route.route)
        : undefined;
      const enriched = spaPath ? appendPlaygroundLink(body, spaPath, route.label) : body;

      return withFrontmatter(file, enriched, {
        title: route?.label ?? toTitle(file),
        description: `Interactive playground documentation for ${route?.label ?? toTitle(file)}.`,
        playgroundRoute: route?.route,
      });
    },
  });
}

function syncFrameworkExamplesIndex() {
  const examplesDir = path.join(rootDir, "examples");
  const targetFile = path.join(docsRoot, "packages/browser-lifecycle/examples/index.md");

  const frameworks = readdirSync(examplesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const rows = frameworks
    .map((name) => {
      const readmePath = path.join(examplesDir, name, "README.md");
      const hasReadme = existsSync(readmePath);
      const label = name.charAt(0).toUpperCase() + name.slice(1);
      const repoLink = `${GITHUB_TREE_MASTER}/examples/${name}`;
      const status = hasReadme ? "Available" : "Planned";
      return `| [${label}](${repoLink}) | \`examples/${name}/\` | ${status} |`;
    })
    .join("\n");

  const body = `# Framework Examples

Official Browser Lifecycle framework examples live in the monorepo under \`examples/\`.

Each example demonstrates installation, initialization, configuration, event subscriptions, and cleanup using \`createBrowserLifecycle()\` from \`@jayoncode/browser-lifecycle\`.

For first-party adapter packages (Provider / composables / signals), see **[Framework adapters](/packages/browser-lifecycle/modules/adapters)**.

## Examples

| Framework | Location | Status |
| --- | --- | --- |
${rows}

## Related Documentation

- [Framework adapters](/packages/browser-lifecycle/modules/adapters)
- [Usage Guide](/packages/browser-lifecycle/guides/usage)
- [Best Practices](/packages/browser-lifecycle/best-practices/)
- [Common Patterns](/packages/browser-lifecycle/patterns/)
- [Playground](/playground/browser-lifecycle/)
`;

  mkdirSync(path.dirname(targetFile), { recursive: true });
  writeFileSync(
    targetFile,
    withFrontmatter("index.md", body, { title: "Framework Examples" }),
    "utf8",
  );
  return frameworks.length;
}

function syncObjectDiffModules() {
  const sourceDir = path.join(rootDir, "packages/object-diff/docs");
  const targetDir = path.join(docsRoot, "packages/object-diff/modules");

  return syncDirectory({
    sourceDir,
    targetDir,
    transform: (file, body) =>
      withFrontmatter(file, rewriteObjectDiffDocLinks(body), {
        title: toTitle(file),
        description: `Object Diff documentation for ${toTitle(file)}.`,
      }),
  });
}

function syncObjectDiffIndex() {
  const sourceFile = path.join(rootDir, "packages/object-diff/docs/index.md");
  const targetFile = path.join(docsRoot, "packages/object-diff/index.md");

  if (!existsSync(sourceFile)) {
    return 0;
  }

  const body = rewriteObjectDiffDocLinks(readFileSync(sourceFile, "utf8"));
  writeFileSync(
    targetFile,
    withFrontmatter("index.md", body, {
      title: "Object Diff",
      description: "Landing page for @jayoncode/object-diff — deep comparison and JSON Patch.",
      layout: "doc",
      sidebar: false,
      aside: false,
      pageClass: "joc-package-landing-page",
    }),
    "utf8",
  );

  return 1;
}

function syncObjectDiffOverview() {
  const sourceFile = path.join(rootDir, "packages/object-diff/docs/overview.md");
  const targetFile = path.join(docsRoot, "packages/object-diff/overview.md");

  if (!existsSync(sourceFile)) {
    return 0;
  }

  const body = rewriteObjectDiffDocLinks(readFileSync(sourceFile, "utf8"));
  writeFileSync(
    targetFile,
    withFrontmatter("overview.md", body, {
      title: "Object Diff overview",
      description: "Documentation overview for @jayoncode/object-diff.",
    }),
    "utf8",
  );

  return 1;
}

function syncObjectDiffPlaygroundDocs() {
  const sourceDir = path.join(rootDir, "apps/object-diff-playground/docs");
  const targetDir = path.join(docsRoot, "packages/object-diff/playground");

  return syncDirectory({
    sourceDir,
    targetDir,
    transform: (file, body) =>
      withFrontmatter(file, body, {
        title: toTitle(file),
        description: `Object Diff playground documentation for ${toTitle(file)}.`,
        playgroundUrl: spaPlaygroundUrl(PLAYGROUND_SPA.objectDiff),
      }),
  });
}

function syncObjectDiffMeta() {
  const pkg = JSON.parse(
    readFileSync(path.join(rootDir, "packages/object-diff/package.json"), "utf8"),
  );
  const targetFile = path.join(docsRoot, ".vitepress/object-diff-meta.ts");
  const body = `/** Generated by scripts/sync-documentation.mjs — do not edit manually. */

export const objectDiffMeta = {
  version: "${pkg.version}",
  versionLabel: "v${pkg.version}",
  npmName: "@jayoncode/object-diff",
} as const;
`;

  writeFileSync(targetFile, body, "utf8");
  return pkg.version;
}

function rewriteStorageDocLinks(body) {
  return body
    .replace(/\]\(\.\/overview\.md\)/g, "](/packages/storage/overview)")
    .replace(/\]\(\.\/index\.md\)/g, "](/packages/storage/)")
    .replace(/\]\(\.\/([^)]+)\.md\)/g, "](/packages/storage/modules/$1)");
}

function syncStorageModules() {
  const sourceDir = path.join(rootDir, "packages/storage/docs");
  const targetDir = path.join(docsRoot, "packages/storage/modules");

  return syncDirectory({
    sourceDir,
    targetDir,
    transform: (file, body) =>
      withFrontmatter(file, rewriteStorageDocLinks(body), {
        title: toTitle(file),
        description: `Storage documentation for ${toTitle(file)}.`,
      }),
  });
}

function syncStorageIndex() {
  const sourceFile = path.join(rootDir, "packages/storage/docs/index.md");
  const targetFile = path.join(docsRoot, "packages/storage/index.md");

  if (!existsSync(sourceFile)) {
    return 0;
  }

  const body = rewriteStorageDocLinks(readFileSync(sourceFile, "utf8"));
  writeFileSync(
    targetFile,
    withFrontmatter("index.md", body, {
      title: "Storage",
      description:
        "Landing page for @jayoncode/storage — policy-driven client persistence with explicit adapters.",
      layout: "doc",
      sidebar: false,
      aside: false,
      pageClass: "joc-package-landing-page",
    }),
    "utf8",
  );

  return 1;
}

function syncStorageOverview() {
  const sourceFile = path.join(rootDir, "packages/storage/docs/overview.md");
  const targetFile = path.join(docsRoot, "packages/storage/overview.md");

  if (!existsSync(sourceFile)) {
    return 0;
  }

  const body = rewriteStorageDocLinks(readFileSync(sourceFile, "utf8"));
  writeFileSync(
    targetFile,
    withFrontmatter("overview.md", body, {
      title: "Storage overview",
      description: "Documentation overview for @jayoncode/storage.",
    }),
    "utf8",
  );

  return 1;
}

function syncStoragePlaygroundDocs() {
  const sourceDir = path.join(rootDir, "apps/storage-playground/docs");
  const targetDir = path.join(docsRoot, "packages/storage/playground");

  return syncDirectory({
    sourceDir,
    targetDir,
    transform: (file, body) =>
      withFrontmatter(file, body, {
        title: toTitle(file),
        description: `Storage playground documentation for ${toTitle(file)}.`,
        playgroundUrl: spaPlaygroundUrl(PLAYGROUND_SPA.storage),
      }),
  });
}

function syncStorageMeta() {
  const pkg = JSON.parse(readFileSync(path.join(rootDir, "packages/storage/package.json"), "utf8"));
  const targetFile = path.join(docsRoot, ".vitepress/storage-meta.ts");
  const body = `/** Generated by scripts/sync-documentation.mjs — do not edit manually. */

export const storageMeta = {
  version: "${pkg.version}",
  versionLabel: "v${pkg.version}",
  npmName: "@jayoncode/storage",
} as const;
`;

  writeFileSync(targetFile, body, "utf8");
  return pkg.version;
}

function rewriteFormIntelligentDocLinks(body) {
  return body.replace(/\]\(\.\/([^)]+)\.md\)/g, "](/packages/form-intelligence/modules/$1)");
}

function syncFormIntelligentModules() {
  const sourceDir = path.join(rootDir, "packages/form-intelligence/docs");
  const targetDir = path.join(docsRoot, "packages/form-intelligence/modules");

  return syncDirectory({
    sourceDir,
    targetDir,
    transform: (file, body) =>
      withFrontmatter(file, rewriteFormIntelligentDocLinks(body), {
        title: toTitle(file),
        description: `Form Intelligence documentation for ${toTitle(file)}.`,
      }),
  });
}

function syncFormIntelligentIndex() {
  const sourceFile = path.join(rootDir, "packages/form-intelligence/docs/index.md");
  const targetFile = path.join(docsRoot, "packages/form-intelligence/index.md");

  if (!existsSync(sourceFile)) {
    return 0;
  }

  const body = rewriteFormIntelligentDocLinks(readFileSync(sourceFile, "utf8"));
  writeFileSync(
    targetFile,
    withFrontmatter("index.md", body, {
      title: "Form Intelligence",
      description: "Landing page for @jayoncode/form-intelligence — headless form workflow engine.",
      layout: "doc",
      sidebar: false,
      aside: false,
      pageClass: "joc-package-landing-page",
    }),
    "utf8",
  );

  return 1;
}

function syncFormIntelligentOverview() {
  const sourceFile = path.join(rootDir, "packages/form-intelligence/docs/overview.md");
  const targetFile = path.join(docsRoot, "packages/form-intelligence/overview.md");

  if (!existsSync(sourceFile)) {
    return 0;
  }

  const body = rewriteFormIntelligentDocLinks(readFileSync(sourceFile, "utf8"));
  writeFileSync(
    targetFile,
    withFrontmatter("overview.md", body, {
      title: "Form Intelligence overview",
      description: "Documentation overview for @jayoncode/form-intelligence.",
    }),
    "utf8",
  );

  return 1;
}

function syncFormIntelligentPlaygroundDocs() {
  const sourceDir = path.join(rootDir, "apps/form-intelligence-playground/docs");
  const targetDir = path.join(docsRoot, "packages/form-intelligence/playground");

  return syncDirectory({
    sourceDir,
    targetDir,
    transform: (file, body) =>
      withFrontmatter(file, body, {
        title: toTitle(file),
        description: `Form Intelligence playground documentation for ${toTitle(file)}.`,
        playgroundUrl: spaPlaygroundUrl(PLAYGROUND_SPA.formIntelligent),
      }),
  });
}

function syncFormIntelligentMeta() {
  const pkg = JSON.parse(
    readFileSync(path.join(rootDir, "packages/form-intelligence/package.json"), "utf8"),
  );
  const targetFile = path.join(docsRoot, ".vitepress/form-intelligence-meta.ts");
  const body = `/** Generated by scripts/sync-documentation.mjs — do not edit manually. */

export const formIntelligenceMeta = {
  version: "${pkg.version}",
  versionLabel: "v${pkg.version}",
  npmName: "@jayoncode/form-intelligence",
} as const;
`;

  writeFileSync(targetFile, body, "utf8");
  return pkg.version;
}

function syncBrowserLifecycleMeta() {
  const pkg = JSON.parse(
    readFileSync(path.join(rootDir, "packages/browser-lifecycle/package.json"), "utf8"),
  );
  const targetFile = path.join(docsRoot, ".vitepress/browser-lifecycle-meta.ts");
  const body = `/** Generated by scripts/sync-documentation.mjs — do not edit manually. */

export const browserLifecycleMeta = {
  version: "${pkg.version}",
  versionLabel: "v${pkg.version}",
  npmName: "@jayoncode/browser-lifecycle",
} as const;
`;

  writeFileSync(targetFile, body, "utf8");
  return pkg.version;
}

function syncPackageChangelogs() {
  const packages = [
    {
      sourceDir: "packages/browser-lifecycle",
      targetFile: "packages/browser-lifecycle/changelog.md",
      npmName: "@jayoncode/browser-lifecycle",
    },
    {
      sourceDir: "packages/object-diff",
      targetFile: "packages/object-diff/changelog.md",
      npmName: "@jayoncode/object-diff",
    },
    {
      sourceDir: "packages/form-intelligence",
      targetFile: "packages/form-intelligence/changelog.md",
      npmName: "@jayoncode/form-intelligence",
    },
    {
      sourceDir: "packages/storage",
      targetFile: "packages/storage/changelog.md",
      npmName: "@jayoncode/storage",
    },
  ];

  let count = 0;

  for (const pkg of packages) {
    const sourceFile = path.join(rootDir, pkg.sourceDir, "CHANGELOG.md");
    if (!existsSync(sourceFile)) {
      continue;
    }

    const body = readFileSync(sourceFile, "utf8");
    writeFileSync(
      path.join(docsRoot, pkg.targetFile),
      withFrontmatter("changelog.md", body, {
        title: "Changelog",
        description: `Release history for ${pkg.npmName}.`,
      }),
      "utf8",
    );
    count += 1;
  }

  return count;
}

function syncDocsMeta() {
  const pkg = JSON.parse(readFileSync(path.join(rootDir, "apps/docs/package.json"), "utf8"));
  const targetFile = path.join(docsRoot, ".vitepress/docs-meta.ts");
  const body = `/** Generated by scripts/sync-documentation.mjs — do not edit manually. */

export const docsMeta = {
  version: "${pkg.version}",
  versionLabel: "v${pkg.version}",
  siteName: "@jayoncode/docs",
} as const;
`;

  writeFileSync(targetFile, body, "utf8");
  return pkg.version;
}

function formatGeneratedFiles() {
  const prettierBin = path.join(rootDir, "node_modules/prettier/bin/prettier.cjs");
  const generatedPaths = [
    path.join(docsRoot, "packages/browser-lifecycle/modules"),
    path.join(docsRoot, "packages/browser-lifecycle/playground"),
    path.join(docsRoot, "packages/browser-lifecycle/index.md"),
    path.join(docsRoot, "packages/browser-lifecycle/overview.md"),
    path.join(docsRoot, "packages/browser-lifecycle/changelog.md"),
    path.join(docsRoot, "packages/browser-lifecycle/examples"),
    path.join(docsRoot, "packages/object-diff/modules"),
    path.join(docsRoot, "packages/object-diff/playground"),
    path.join(docsRoot, "packages/object-diff/index.md"),
    path.join(docsRoot, "packages/object-diff/overview.md"),
    path.join(docsRoot, "packages/object-diff/changelog.md"),
    path.join(docsRoot, "packages/form-intelligence/modules"),
    path.join(docsRoot, "packages/form-intelligence/playground"),
    path.join(docsRoot, "packages/form-intelligence/index.md"),
    path.join(docsRoot, "packages/form-intelligence/overview.md"),
    path.join(docsRoot, "packages/form-intelligence/changelog.md"),
    path.join(docsRoot, "packages/storage/modules"),
    path.join(docsRoot, "packages/storage/playground"),
    path.join(docsRoot, "packages/storage/index.md"),
    path.join(docsRoot, "packages/storage/overview.md"),
    path.join(docsRoot, "packages/storage/changelog.md"),
    path.join(docsRoot, ".vitepress/browser-lifecycle-meta.ts"),
    path.join(docsRoot, ".vitepress/docs-meta.ts"),
    path.join(docsRoot, ".vitepress/browser-lifecycle-versions.ts"),
    path.join(docsRoot, ".vitepress/object-diff-versions.ts"),
    path.join(docsRoot, ".vitepress/form-intelligence-versions.ts"),
    path.join(docsRoot, ".vitepress/storage-versions.ts"),
    path.join(docsRoot, ".vitepress/object-diff-meta.ts"),
    path.join(docsRoot, ".vitepress/form-intelligence-meta.ts"),
    path.join(docsRoot, ".vitepress/storage-meta.ts"),
  ];

  const result = spawnSync(process.execPath, [prettierBin, "--write", ...generatedPaths], {
    cwd: rootDir,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error("Prettier failed while formatting generated documentation files.");
  }
}

function lintGeneratedMetaFiles() {
  const eslintBin = path.join(rootDir, "node_modules/eslint/bin/eslint.js");
  const generatedMetaFiles = [
    path.join(docsRoot, ".vitepress/browser-lifecycle-meta.ts"),
    path.join(docsRoot, ".vitepress/docs-meta.ts"),
    path.join(docsRoot, ".vitepress/browser-lifecycle-versions.ts"),
    path.join(docsRoot, ".vitepress/object-diff-versions.ts"),
    path.join(docsRoot, ".vitepress/form-intelligence-versions.ts"),
    path.join(docsRoot, ".vitepress/storage-versions.ts"),
    path.join(docsRoot, ".vitepress/object-diff-meta.ts"),
    path.join(docsRoot, ".vitepress/form-intelligence-meta.ts"),
    path.join(docsRoot, ".vitepress/storage-meta.ts"),
  ];

  const result = spawnSync(process.execPath, [eslintBin, ...generatedMetaFiles], {
    cwd: rootDir,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error("ESLint failed while checking generated documentation metadata files.");
  }
}

const browserLifecycleIndexCount = syncBrowserLifecycleIndex();
const browserLifecycleOverviewCount = syncBrowserLifecycleOverview();
const moduleCount = syncPackageModules();
const playgroundCount = syncPlaygroundDocs();
const exampleCount = syncFrameworkExamplesIndex();
const objectDiffModuleCount = syncObjectDiffModules();
const objectDiffIndexCount = syncObjectDiffIndex();
const objectDiffOverviewCount = syncObjectDiffOverview();
const objectDiffPlaygroundCount = syncObjectDiffPlaygroundDocs();
const formIntelligentModuleCount = syncFormIntelligentModules();
const formIntelligentIndexCount = syncFormIntelligentIndex();
const formIntelligentOverviewCount = syncFormIntelligentOverview();
const formIntelligentPlaygroundCount = syncFormIntelligentPlaygroundDocs();
const storageModuleCount = syncStorageModules();
const storageIndexCount = syncStorageIndex();
const storageOverviewCount = syncStorageOverview();
const storagePlaygroundCount = syncStoragePlaygroundDocs();
const browserLifecycleVersion = syncBrowserLifecycleMeta();
const objectDiffVersion = syncObjectDiffMeta();
const formIntelligentVersion = syncFormIntelligentMeta();
const storageVersion = syncStorageMeta();
const changelogCount = syncPackageChangelogs();
const docsVersion = syncDocsMeta();
syncAllPackageVersionsMeta();

if (process.env.DOCS_SYNC_SKIP_QUALITY !== "1") {
  formatGeneratedFiles();
  lintGeneratedMetaFiles();
}

console.log(
  `Synced documentation: ${moduleCount} browser-lifecycle module pages, ${browserLifecycleIndexCount} browser-lifecycle landing, ${browserLifecycleOverviewCount} browser-lifecycle overview, ${playgroundCount} browser-lifecycle playground pages, ${exampleCount} framework examples, ${objectDiffModuleCount} object-diff module pages, ${objectDiffIndexCount} object-diff landing, ${objectDiffOverviewCount} object-diff overview, ${objectDiffPlaygroundCount} object-diff playground pages, ${formIntelligentModuleCount} form-intelligent module pages, ${formIntelligentIndexCount} form-intelligent landing, ${formIntelligentOverviewCount} form-intelligent overview, ${formIntelligentPlaygroundCount} form-intelligent playground pages, ${storageModuleCount} storage module pages, ${storageIndexCount} storage landing, ${storageOverviewCount} storage overview, ${storagePlaygroundCount} storage playground pages, ${changelogCount} package changelogs, browser-lifecycle@${browserLifecycleVersion}, object-diff@${objectDiffVersion}, form-intelligent@${formIntelligentVersion}, storage@${storageVersion}, docs@${docsVersion}.`,
);
