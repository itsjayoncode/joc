#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDist = path.join(rootDir, process.env.DOCS_DIST ?? "apps/docs/docs/.vitepress/dist");

const PLAYGROUNDS = [
  {
    name: "browser-lifecycle",
    appDir: "apps/browser-session-playground",
    buildScript: "browser-session-playground:build",
    base: process.env.VITE_BROWSER_PLAYGROUND_BASE ?? "/joc/playground/browser-lifecycle/",
  },
  {
    name: "object-diff",
    appDir: "apps/object-diff-playground",
    buildScript: "object-diff-playground:build",
    base: process.env.VITE_OBJECT_DIFF_PLAYGROUND_BASE ?? "/joc/playground/object-diff/",
  },
  {
    name: "form-intelligence",
    appDir: "apps/form-intelligence-playground",
    buildScript: "form-intelligence-playground:build",
    base:
      process.env.VITE_FORM_INTELLIGENCE_PLAYGROUND_BASE ?? "/joc/playground/form-intelligence/",
  },
  {
    name: "storage",
    appDir: "apps/storage-playground",
    buildScript: "storage-playground:build",
    base: process.env.VITE_STORAGE_PLAYGROUND_BASE ?? "/joc/playground/storage/",
  },
];

function normalizeBase(base) {
  const withLeadingSlash = base.startsWith("/") ? base : `/${base}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

function patchManifestStartUrl(distDir, base) {
  const manifestPath = path.join(distDir, "manifest.json");
  if (!existsSync(manifestPath)) {
    return;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifest.start_url = base;
  if (Array.isArray(manifest.icons)) {
    manifest.icons = manifest.icons.map((icon) => ({
      ...icon,
      src: icon.src?.startsWith("/") ? `${base}${icon.src.replace(/^\//, "")}` : icon.src,
    }));
  }

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function buildPlayground(buildScript, base) {
  const result = spawnSync("pnpm", [buildScript], {
    cwd: rootDir,
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_PLAYGROUND_BASE: normalizeBase(base),
    },
  });

  if (result.status !== 0) {
    throw new Error(`${buildScript} failed.`);
  }
}

function readAppRoutePaths(appDir) {
  const routesFile = path.join(rootDir, appDir, "src/routes/app-routes.tsx");
  const source = readFileSync(routesFile, "utf8");
  const match = source.match(/export const APP_ROUTE_PATHS = \[([\s\S]*?)\] as const/);

  if (!match) {
    throw new Error(`APP_ROUTE_PATHS not found in ${routesFile}.`);
  }

  return [...match[1].matchAll(/"([^"]+)"/g)].map(([, routePath]) => routePath);
}

function copySpaRouteFallbacks(distDir, routePaths) {
  const indexFile = path.join(distDir, "index.html");
  if (!existsSync(indexFile)) {
    throw new Error(`Missing playground build output at ${indexFile}.`);
  }

  cpSync(indexFile, path.join(distDir, "404.html"));

  for (const routePath of routePaths) {
    if (routePath === "/") {
      continue;
    }

    const segment = routePath.replace(/^\//, "");
    const routeDir = path.join(distDir, segment);
    mkdirSync(routeDir, { recursive: true });
    cpSync(indexFile, path.join(routeDir, "index.html"));
  }
}

function bundlePlayground({ name, appDir, buildScript, base }) {
  const playgroundDist = path.join(rootDir, appDir, "dist");
  const playgroundTarget = path.join(docsDist, "playground", name);
  const normalizedBase = normalizeBase(base);

  buildPlayground(buildScript, normalizedBase);
  const routePaths = readAppRoutePaths(appDir);
  copySpaRouteFallbacks(playgroundDist, routePaths);
  patchManifestStartUrl(playgroundDist, normalizedBase);

  if (!existsSync(docsDist)) {
    throw new Error(
      `Docs dist not found at ${docsDist}. Run docs:build before bundling playgrounds.`,
    );
  }

  rmSync(playgroundTarget, { recursive: true, force: true });
  mkdirSync(path.dirname(playgroundTarget), { recursive: true });
  cpSync(playgroundDist, playgroundTarget, { recursive: true });
  patchManifestStartUrl(playgroundTarget, normalizedBase);
  copySpaRouteFallbacks(playgroundTarget, routePaths);

  console.log(`Bundled ${appDir} into ${playgroundTarget} with base ${normalizedBase}.`);
}

function writeFormIntelligencePlaygroundRedirect(docsDistPath) {
  // Keep old /playground/form-intelligent/ bookmarks working after the rename.
  const redirectDir = path.join(docsDistPath, "playground", "form-intelligent");
  mkdirSync(redirectDir, { recursive: true });
  writeFileSync(
    path.join(redirectDir, "index.html"),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0;url=../form-intelligence/" />
    <link rel="canonical" href="../form-intelligence/" />
    <title>Moved to Form Intelligence playground</title>
    <script>
      location.replace("../form-intelligence/" + location.search + location.hash);
    </script>
  </head>
  <body>
    <p>This playground moved to <a href="../form-intelligence/">/playground/form-intelligence/</a>.</p>
  </body>
</html>
`,
    "utf8",
  );
  console.log(`Wrote legacy playground redirect at ${redirectDir}.`);
}

if (process.env.SKIP_PLAYGROUND_BUNDLE === "1") {
  console.log("Skipped playground bundle (SKIP_PLAYGROUND_BUNDLE=1).");
  process.exit(0);
}

for (const playground of PLAYGROUNDS) {
  bundlePlayground(playground);
}

writeFormIntelligencePlaygroundRedirect(docsDist);
