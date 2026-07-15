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

function copySpaFallback(distDir) {
  const indexFile = path.join(distDir, "index.html");
  if (!existsSync(indexFile)) {
    throw new Error(`Missing playground build output at ${indexFile}.`);
  }

  cpSync(indexFile, path.join(distDir, "404.html"));
}

function bundlePlayground({ name, appDir, buildScript, base }) {
  const playgroundDist = path.join(rootDir, appDir, "dist");
  const playgroundTarget = path.join(docsDist, "playground", name);
  const normalizedBase = normalizeBase(base);

  buildPlayground(buildScript, normalizedBase);
  copySpaFallback(playgroundDist);
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
  copySpaFallback(playgroundTarget);

  console.log(`Bundled ${appDir} into ${playgroundTarget} with base ${normalizedBase}.`);
}

if (process.env.SKIP_PLAYGROUND_BUNDLE === "1") {
  console.log("Skipped playground bundle (SKIP_PLAYGROUND_BUNDLE=1).");
  process.exit(0);
}

for (const playground of PLAYGROUNDS) {
  bundlePlayground(playground);
}
