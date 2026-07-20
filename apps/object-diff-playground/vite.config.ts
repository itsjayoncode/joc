import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(rootDir, "../..");

function readPackageVersion(relativePackagePath: string): string {
  const manifest = JSON.parse(
    readFileSync(path.join(repoRoot, relativePackagePath, "package.json"), "utf8"),
  ) as { version?: string };

  return manifest.version ?? "0.0.0";
}

const playgroundVersion = readPackageVersion("apps/object-diff-playground");
const browserLifecycleVersion = readPackageVersion("packages/object-diff");

export default defineConfig({
  base: process.env.VITE_PLAYGROUND_BASE ?? "/",
  plugins: [react(), tsconfigPaths({ root: repoRoot })],
  // esbuild 0.28+ errors on Vite's default modules target (safari14) for destructuring.
  build: {
    sourcemap: false,
    target: "es2022",
  },
  esbuild: {
    supported: {
      destructuring: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
      supported: {
        destructuring: true,
      },
    },
  },
  define: {
    __OBJECT_DIFF_VERSION__: JSON.stringify(browserLifecycleVersion),
    __PLAYGROUND_VERSION__: JSON.stringify(playgroundVersion),
  },
  resolve: {
    alias: [
      {
        find: /^@jayoncode\/object-diff\/(.+)$/,
        replacement: path.join(repoRoot, "packages/object-diff/src/$1/index.ts"),
      },
      { find: /^@jayoncode\/(.+)$/, replacement: path.join(repoRoot, "packages/$1/src/index.ts") },
    ],
  },
  server: {
    host: "127.0.0.1",
    port: 4275,
  },
  preview: {
    host: "127.0.0.1",
    port: 4276,
  },
});
