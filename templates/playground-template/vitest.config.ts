import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(rootDir, "../..");

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@jayoncode\/__PACKAGE_SLUG__\/(.+)$/,
        replacement: path.join(repoRoot, "packages/__PACKAGE_SLUG__/src/$1/index.ts"),
      },
      { find: /^@jayoncode\/(.+)$/, replacement: path.join(repoRoot, "packages/$1/src/index.ts") },
    ],
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.ts", "src/**/*.{test,spec}.tsx"],
    passWithNoTests: true,
  },
});
