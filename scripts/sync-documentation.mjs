#!/usr/bin/env node
/**
 * Syncs source-of-truth documentation into the VitePress site.
 *
 * - packages/browser-lifecycle/docs → apps/docs/docs/packages/browser-lifecycle/modules
 * - apps/browser-session-playground/docs → apps/docs/docs/packages/browser-lifecycle/playground
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
import { fileURLToPath } from "node:url";

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

function toTitle(fileName) {
  return fileName
    .replace(/\.md$/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function withFrontmatter(fileName, body, extra = {}) {
  const title = extra.title ?? toTitle(fileName);
  const lines = ["---", `title: ${title}`];

  if (extra.description) {
    lines.push(`description: ${extra.description}`);
  }

  if (extra.playgroundRoute) {
    lines.push(`playground: ${PLAYGROUND_BASE_URL}${extra.playgroundRoute}`);
  }

  lines.push("---", "", body.trim(), "");
  return `${lines.join("\n")}\n`;
}

function appendPlaygroundLink(body, link, label) {
  if (body.includes("Open Playground") || body.includes(PLAYGROUND_BASE_URL)) {
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

  const files = readdirSync(sourceDir).filter((file) => file.endsWith(".md"));
  for (const file of files) {
    const body = readFileSync(path.join(sourceDir, file), "utf8");
    const output = transform(file, body);
    writeFileSync(path.join(targetDir, file), output, "utf8");
  }

  return files.length;
}

function syncPackageModules() {
  const sourceDir = path.join(rootDir, "packages/browser-lifecycle/docs");
  const targetDir = path.join(docsRoot, "packages/browser-lifecycle/modules");

  return syncDirectory({
    sourceDir,
    targetDir,
    transform: (file, body) => {
      const playgroundDoc = MODULE_PLAYGROUND_LINKS[file];
      const rewritten = rewritePackageDocLinks(body);
      const enriched = playgroundDoc
        ? appendPlaygroundLink(rewritten, playgroundDoc.replace("/packages/browser-lifecycle/playground/", "/"), toTitle(file))
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

const moduleCount = syncPackageModules();
const playgroundCount = syncPlaygroundDocs();
const exampleCount = syncFrameworkExamplesIndex();
const browserLifecycleVersion = syncBrowserLifecycleMeta();
const docsVersion = syncDocsMeta();

console.log(
  `Synced documentation: ${moduleCount} module pages, ${playgroundCount} playground pages, ${exampleCount} framework examples, browser-lifecycle@${browserLifecycleVersion}, docs@${docsVersion}.`,
);
