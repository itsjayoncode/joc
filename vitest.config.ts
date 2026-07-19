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
        find: /^@jayoncode\/form-intelligence\/(.+)$/,
        replacement: path.join(rootDir, "packages/form-intelligence/src/$1/index.ts"),
      },
      {
        find: /^@jayoncode\/object-diff\/(.+)$/,
        replacement: path.join(rootDir, "packages/object-diff/src/$1/index.ts"),
      },
      {
        find: "@jayoncode/form-intelligence-valibot",
        replacement: path.join(rootDir, "packages/form-intelligence-valibot/src/index.ts"),
      },
      {
        find: "@jayoncode/form-intelligence-yup",
        replacement: path.join(rootDir, "packages/form-intelligence-yup/src/index.ts"),
      },
      {
        find: "@jayoncode/form-intelligence-ajv",
        replacement: path.join(rootDir, "packages/form-intelligence-ajv/src/index.ts"),
      },
      {
        find: "@jayoncode/form-intelligence-angular",
        replacement: path.join(rootDir, "packages/form-intelligence-angular/src/index.ts"),
      },
      {
        find: "@jayoncode/form-intelligence-vue",
        replacement: path.join(rootDir, "packages/form-intelligence-vue/src/index.ts"),
      },
      {
        find: "@jayoncode/form-intelligence-zod",
        replacement: path.join(rootDir, "packages/form-intelligence-zod/src/index.ts"),
      },
      {
        find: "@jayoncode/form-intelligence-react",
        replacement: path.join(rootDir, "packages/form-intelligence-react/src/index.ts"),
      },
      {
        find: "@jayoncode/form-intelligence",
        replacement: path.join(rootDir, "packages/form-intelligence/src/index.ts"),
      },
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
      exclude: [
        "**/*.d.ts",
        "**/dist/**",
        "**/build/**",
        "**/coverage/**",
        "**/node_modules/**",
        "**/tests/**",
        "**/examples/**",
        "**/scripts/**",
        "**/engineering/**",
      ],
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
            "apps/form-intelligence-playground/src/**/*.{test,spec}.ts",
            "apps/form-intelligence-playground/src/**/*.{test,spec}.tsx",
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
