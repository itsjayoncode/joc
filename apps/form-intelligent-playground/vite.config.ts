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

const playgroundVersion = readPackageVersion("apps/form-intelligent-playground");
const formIntelligentVersion = readPackageVersion("packages/form-intelligent");
const formIntelligentReactVersion = readPackageVersion("packages/form-intelligent-react");

export default defineConfig({
  base: process.env.VITE_PLAYGROUND_BASE ?? "/",
  plugins: [react(), tsconfigPaths({ root: repoRoot })],
  build: {
    sourcemap: false,
    target: "es2022",
  },
  define: {
    "import.meta.env.VITE_FORM_INTELLIGENT_VERSION": JSON.stringify(formIntelligentVersion),
    "import.meta.env.VITE_FORM_INTELLIGENT_REACT_VERSION": JSON.stringify(
      formIntelligentReactVersion,
    ),
    "import.meta.env.VITE_PLAYGROUND_VERSION": JSON.stringify(playgroundVersion),
  },
  resolve: {
    alias: [
      {
        find: /^@jayoncode\/form-intelligent\/(.+)$/,
        replacement: path.join(repoRoot, "packages/form-intelligent/src/$1/index.ts"),
      },
      { find: /^@jayoncode\/(.+)$/, replacement: path.join(repoRoot, "packages/$1/src/index.ts") },
    ],
  },
  server: {
    host: "127.0.0.1",
    port: 4277,
  },
  preview: {
    host: "127.0.0.1",
    port: 4278,
  },
});
