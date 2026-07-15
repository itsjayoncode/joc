#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const playgroundDir = path.join(rootDir, "apps/browser-session-playground");
const playgroundDist = path.join(playgroundDir, "dist");
const docsDist = path.join(rootDir, process.env.DOCS_DIST ?? "apps/docs/docs/.vitepress/dist");
const playgroundBase = process.env.VITE_PLAYGROUND_BASE ?? "/joc/playground/browser-lifecycle/";
const playgroundTarget = path.join(docsDist, "playground/browser-lifecycle");

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

function buildPlayground() {
  const result = spawnSync("pnpm", ["browser-session-playground:build"], {
    cwd: rootDir,
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_PLAYGROUND_BASE: normalizeBase(playgroundBase),
    },
  });

  if (result.status !== 0) {
    throw new Error("browser-session-playground build failed.");
  }
}

function copySpaFallback(distDir) {
  const indexFile = path.join(distDir, "index.html");
  if (!existsSync(indexFile)) {
    throw new Error(`Missing playground build output at ${indexFile}.`);
  }

  cpSync(indexFile, path.join(distDir, "404.html"));
}

function bundleIntoDocsDist() {
  if (!existsSync(docsDist)) {
    throw new Error(
      `Docs dist not found at ${docsDist}. Run docs:build before bundling the playground.`,
    );
  }

  rmSync(playgroundTarget, { recursive: true, force: true });
  mkdirSync(path.dirname(playgroundTarget), { recursive: true });
  cpSync(playgroundDist, playgroundTarget, { recursive: true });
}

const normalizedBase = normalizeBase(playgroundBase);

if (process.env.SKIP_PLAYGROUND_BUNDLE === "1") {
  console.log("Skipped playground bundle (SKIP_PLAYGROUND_BUNDLE=1).");
  process.exit(0);
}

buildPlayground();
copySpaFallback(playgroundDist);
patchManifestStartUrl(playgroundDist, normalizedBase);
bundleIntoDocsDist();
patchManifestStartUrl(playgroundTarget, normalizedBase);
copySpaFallback(playgroundTarget);

console.log(
  `Bundled browser-session-playground into ${playgroundTarget} with base ${normalizedBase}.`,
);
