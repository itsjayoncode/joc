import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: [
      {
        find: /^@jayoncode\/(.+)$/,
        replacement: path.join(rootDir, "packages/$1/src/index.ts"),
      },
    ],
  },
  test: {
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html", "lcov", "json-summary"],
      include: ["packages/**/*.{ts,tsx}", "test-utils/**/*.{ts,tsx}"],
      exclude: ["**/*.d.ts", "**/dist/**", "**/build/**", "**/coverage/**", "**/node_modules/**"],
    },
    projects: [
      {
        extends: true,
        test: {
          include: [
            "packages/**/*.{test,spec}.ts",
            "packages/**/*.{test,spec}.tsx",
            "apps/browser-session-playground/src/**/*.{test,spec}.ts",
            "apps/browser-session-playground/src/**/*.{test,spec}.tsx",
            "apps/object-diff-playground/src/**/*.{test,spec}.ts",
            "apps/object-diff-playground/src/**/*.{test,spec}.tsx",
            "tests/**/*.{test,spec}.ts",
            "tests/**/*.{test,spec}.tsx",
          ],
          exclude: [
            "**/*.browser.test.ts",
            "**/*.browser.spec.ts",
            "**/*.browser.test.tsx",
            "**/*.browser.spec.tsx",
            "**/dist/**",
            "**/build/**",
            "**/coverage/**",
            "packages/**/lib/**",
            "**/node_modules/**",
          ],
          environment: "node",
          pool: "threads",
        },
      },
      {
        extends: true,
        test: {
          include: [
            "packages/**/*.browser.test.ts",
            "packages/**/*.browser.spec.ts",
            "packages/**/*.browser.test.tsx",
            "packages/**/*.browser.spec.tsx",
            "tests/**/*.browser.test.ts",
            "tests/**/*.browser.spec.ts",
            "tests/**/*.browser.test.tsx",
            "tests/**/*.browser.spec.tsx",
          ],
          exclude: [
            "**/dist/**",
            "**/build/**",
            "**/coverage/**",
            "packages/**/lib/**",
            "**/node_modules/**",
          ],
          environment: "jsdom",
          pool: "threads",
        },
      },
    ],
  },
});
