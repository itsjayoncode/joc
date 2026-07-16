#!/usr/bin/env node
/**
 * Syncs source-of-truth documentation into the VitePress site.
 *
 * - packages/browser-lifecycle/docs → apps/docs/docs/packages/browser-lifecycle/modules
 * - apps/browser-session-playground/docs → apps/docs/docs/packages/browser-lifecycle/playground
 * - packages/object-diff/docs → apps/docs/docs/packages/object-diff/modules
 * - apps/object-diff-playground/docs → apps/docs/docs/packages/object-diff/playground
 * - packages/form-intelligent/docs → apps/docs/docs/packages/form-intelligent/modules
 * - apps/form-intelligent-playground/docs → apps/docs/docs/packages/form-intelligent/playground
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
  "playground.md": { route: "/", label: "Playground Dashboard" },
  "plugin-playground.md": { route: "/plugins", label: "Plugin Playground" },
  "state-explorer.md": { route: "/state", label: "State Explorer" },
  "visibility-playground.md": { route: "/visibility", label: "Visibility Playground" },
};

const MODULE_PLAYGROUND_LINKS = {
  "visibility.md": "/packages/browser-lifecycle/playground/visibility-playground",
  "events.md": "/packages/browser-lifecycle/playground/event-explorer",
  "session-core.md": "/packages/browser-lifecycle/playground/lifecycle-playground",
  "core-infrastructure.md": "/packages/browser-lifecycle/playground/configuration-playground",
};

const PLAYGROUND_BASE_URL = "http://127.0.0.1:4273";
const OBJECT_DIFF_PLAYGROUND_BASE_URL = "http://127.0.0.1:4275";
const FORM_INTELLIGENT_PLAYGROUND_BASE_URL = "http://127.0.0.1:4277";

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

  if (extra.playgroundUrl) {
    lines.push(`playground: ${yamlScalar(extra.playgroundUrl)}`);
  } else if (extra.playgroundRoute) {
    lines.push(`playground: ${yamlScalar(`${PLAYGROUND_BASE_URL}${extra.playgroundRoute}`)}`);
  }

  lines.push("---", "", body.trim(), "");
  return `${lines.join("\n")}\n`;
}

function appendPlaygroundLink(body, link, label) {
  if (
    body.includes("Open Playground") ||
    body.includes(PLAYGROUND_BASE_URL) ||
    body.includes("/playground/")
  ) {
    return body;
  }

  return `${body.trim()}\n\n## Interactive Playground\n\nExplore this topic live in the [${label}](${PLAYGROUND_BASE_URL}${link}).\n`;
}

function rewritePackageDocLinks(body) {
  return body
    .replace(
      /\]\(\.\.\/examples\/([^)]+)\)/g,
      "](https://github.com/itsjayoncode/joc/tree/main/packages/browser-lifecycle/examples/$1)",
    )
    .replace(
      /\]\(\.\/engineering\/([^)]+)\)/g,
      "](https://github.com/JayOnCode/joc/tree/main/packages/browser-lifecycle/engineering/$1)",
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
    (file) => file.endsWith(".md") && file !== "index.md",
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
      title: "@jayoncode/browser-lifecycle | TypeScript Browser Session API",
      description:
        "Install and use @jayoncode/browser-lifecycle for typed page visibility, focus, connectivity, idle detection, cross-tab sync, plugins, and SSR-safe browser session lifecycle management.",
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
      const playgroundDoc = MODULE_PLAYGROUND_LINKS[file];
      const rewritten = rewriteBrowserLifecyclePackageDocLinks(rewritePackageDocLinks(body));
      const enriched = playgroundDoc
        ? appendPlaygroundLink(
            rewritten,
            playgroundDoc.replace("/packages/browser-lifecycle/playground/", "/"),
            toTitle(file),
          )
        : rewritten;

      return withFrontmatter(file, enriched, {
        title: toTitle(file),
        description: `Browser Lifecycle module documentation for ${toTitle(file)}.`,
        playgroundRoute: playgroundDoc
          ? playgroundDoc
              .replace("/packages/browser-lifecycle/playground/", "/")
              .replace(/-playground$/, "")
              .replace(/-explorer$/, "")
          : undefined,
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
      const enriched = route ? appendPlaygroundLink(body, route.route, route.label) : body;

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
      const repoLink = `https://github.com/JayOnCode/joc/tree/main/examples/${name}`;
      const status = hasReadme ? "Available" : "Planned";
      return `| [${label}](${repoLink}) | \`examples/${name}/\` | ${status} |`;
    })
    .join("\n");

  const body = `# Framework Examples

Official Browser Lifecycle framework examples live in the monorepo under \`examples/\`.

Each example demonstrates installation, initialization, configuration, event subscriptions, and cleanup using \`createBrowserLifecycle()\` from \`@jayoncode/browser-lifecycle\`.

## Examples

| Framework | Location | Status |
| --- | --- | --- |
${rows}

## Related Documentation

- [Usage Guide](/packages/browser-lifecycle/guides/usage)
- [Best Practices](/packages/browser-lifecycle/best-practices/)
- [Common Patterns](/packages/browser-lifecycle/patterns/)
- [Playground](${PLAYGROUND_BASE_URL})
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
      description: "Object Diff package overview.",
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
        playgroundUrl: OBJECT_DIFF_PLAYGROUND_BASE_URL,
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

function rewriteFormIntelligentDocLinks(body) {
  return body.replace(/\]\(\.\/([^)]+)\.md\)/g, "](/packages/form-intelligent/modules/$1)");
}

function syncFormIntelligentModules() {
  const sourceDir = path.join(rootDir, "packages/form-intelligent/docs");
  const targetDir = path.join(docsRoot, "packages/form-intelligent/modules");

  return syncDirectory({
    sourceDir,
    targetDir,
    transform: (file, body) =>
      withFrontmatter(file, rewriteFormIntelligentDocLinks(body), {
        title: toTitle(file),
        description: `Form Intelligent documentation for ${toTitle(file)}.`,
      }),
  });
}

function syncFormIntelligentIndex() {
  const sourceFile = path.join(rootDir, "packages/form-intelligent/docs/index.md");
  const targetFile = path.join(docsRoot, "packages/form-intelligent/index.md");

  if (!existsSync(sourceFile)) {
    return 0;
  }

  const body = rewriteFormIntelligentDocLinks(readFileSync(sourceFile, "utf8"));
  writeFileSync(
    targetFile,
    withFrontmatter("index.md", body, {
      title: "Form Intelligent",
      description: "Form Intelligent package overview.",
    }),
    "utf8",
  );

  return 1;
}

function syncFormIntelligentPlaygroundDocs() {
  const sourceDir = path.join(rootDir, "apps/form-intelligent-playground/docs");
  const targetDir = path.join(docsRoot, "packages/form-intelligent/playground");

  return syncDirectory({
    sourceDir,
    targetDir,
    transform: (file, body) =>
      withFrontmatter(file, body, {
        title: toTitle(file),
        description: `Form Intelligent playground documentation for ${toTitle(file)}.`,
        playgroundUrl: FORM_INTELLIGENT_PLAYGROUND_BASE_URL,
      }),
  });
}

function syncFormIntelligentMeta() {
  const pkg = JSON.parse(
    readFileSync(path.join(rootDir, "packages/form-intelligent/package.json"), "utf8"),
  );
  const targetFile = path.join(docsRoot, ".vitepress/form-intelligent-meta.ts");
  const body = `/** Generated by scripts/sync-documentation.mjs — do not edit manually. */

export const formIntelligentMeta = {
  version: "${pkg.version}",
  versionLabel: "v${pkg.version}",
  npmName: "@jayoncode/form-intelligent",
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
      sourceDir: "packages/form-intelligent",
      targetFile: "packages/form-intelligent/changelog.md",
      npmName: "@jayoncode/form-intelligent",
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
    path.join(docsRoot, "packages/browser-lifecycle/changelog.md"),
    path.join(docsRoot, "packages/browser-lifecycle/examples"),
    path.join(docsRoot, "packages/object-diff/modules"),
    path.join(docsRoot, "packages/object-diff/playground"),
    path.join(docsRoot, "packages/object-diff/index.md"),
    path.join(docsRoot, "packages/object-diff/changelog.md"),
    path.join(docsRoot, "packages/form-intelligent/modules"),
    path.join(docsRoot, "packages/form-intelligent/playground"),
    path.join(docsRoot, "packages/form-intelligent/index.md"),
    path.join(docsRoot, "packages/form-intelligent/changelog.md"),
    path.join(docsRoot, ".vitepress/browser-lifecycle-meta.ts"),
    path.join(docsRoot, ".vitepress/docs-meta.ts"),
    path.join(docsRoot, ".vitepress/browser-lifecycle-versions.ts"),
    path.join(docsRoot, ".vitepress/object-diff-versions.ts"),
    path.join(docsRoot, ".vitepress/form-intelligent-versions.ts"),
    path.join(docsRoot, ".vitepress/object-diff-meta.ts"),
    path.join(docsRoot, ".vitepress/form-intelligent-meta.ts"),
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
    path.join(docsRoot, ".vitepress/form-intelligent-versions.ts"),
    path.join(docsRoot, ".vitepress/object-diff-meta.ts"),
    path.join(docsRoot, ".vitepress/form-intelligent-meta.ts"),
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
const moduleCount = syncPackageModules();
const playgroundCount = syncPlaygroundDocs();
const exampleCount = syncFrameworkExamplesIndex();
const objectDiffModuleCount = syncObjectDiffModules();
const objectDiffIndexCount = syncObjectDiffIndex();
const objectDiffPlaygroundCount = syncObjectDiffPlaygroundDocs();
const formIntelligentModuleCount = syncFormIntelligentModules();
const formIntelligentIndexCount = syncFormIntelligentIndex();
const formIntelligentPlaygroundCount = syncFormIntelligentPlaygroundDocs();
const browserLifecycleVersion = syncBrowserLifecycleMeta();
const objectDiffVersion = syncObjectDiffMeta();
const formIntelligentVersion = syncFormIntelligentMeta();
const changelogCount = syncPackageChangelogs();
const docsVersion = syncDocsMeta();
syncAllPackageVersionsMeta();

if (process.env.DOCS_SYNC_SKIP_QUALITY !== "1") {
  formatGeneratedFiles();
  lintGeneratedMetaFiles();
}

console.log(
  `Synced documentation: ${moduleCount} browser-lifecycle module pages, ${browserLifecycleIndexCount} browser-lifecycle index, ${playgroundCount} browser-lifecycle playground pages, ${exampleCount} framework examples, ${objectDiffModuleCount} object-diff module pages, ${objectDiffIndexCount} object-diff index, ${objectDiffPlaygroundCount} object-diff playground pages, ${formIntelligentModuleCount} form-intelligent module pages, ${formIntelligentIndexCount} form-intelligent index, ${formIntelligentPlaygroundCount} form-intelligent playground pages, ${changelogCount} package changelogs, browser-lifecycle@${browserLifecycleVersion}, object-diff@${objectDiffVersion}, form-intelligent@${formIntelligentVersion}, docs@${docsVersion}.`,
);
