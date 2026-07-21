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

const playgroundVersion = readPackageVersion("apps/storage-playground");
const packageVersion = readPackageVersion("packages/storage");

export default defineConfig({
  base: process.env.VITE_PLAYGROUND_BASE ?? "/",
  plugins: [react(), tsconfigPaths({ root: repoRoot })],
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
    __STORAGE_VERSION__: JSON.stringify(packageVersion),
    __PLAYGROUND_VERSION__: JSON.stringify(playgroundVersion),
  },
  resolve: {
    alias: [
      {
        find: /^@jayoncode\/storage\/(.+)$/,
        replacement: path.join(repoRoot, "packages/storage/src/$1/index.ts"),
      },
      { find: /^@jayoncode\/(.+)$/, replacement: path.join(repoRoot, "packages/$1/src/index.ts") },
    ],
  },
  server: {
    host: "127.0.0.1",
    port: 4280,
  },
  preview: {
    host: "127.0.0.1",
    port: 4281,
  },
});
