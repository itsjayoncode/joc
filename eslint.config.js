import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const typedFiles = ["**/*.{ts,tsx,mts,cts}"];
const withFiles = (configs, files) => configs.map((config) => ({ ...config, files }));

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.vitepress/cache/**",
      "**/.vitepress/.temp/**",
      "**/*.d.ts",
      "**/lib/**",
      "**/node_modules/**",
      ".turbo/**",
      "examples/**",
      "packages/*/examples/**",
      "eslint.config.js",
      "prettier.config.js",
      "vitest.config.ts",
    ],
  },
  {
    ...js.configs.recommended,
    files: ["**/*.{js,cjs,mjs}"],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
  ...withFiles(tseslint.configs.recommendedTypeChecked, typedFiles),
  ...withFiles(tseslint.configs.strictTypeChecked, typedFiles),
  {
    files: typedFiles,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "import/no-default-export": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "type"],
          pathGroups: [
            {
              pattern: "@jayoncode/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      "no-console": "error",
      "prefer-const": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: [
      "packages/**/*.{test,spec}.ts",
      "packages/**/*.{test,spec}.tsx",
      "apps/playground/src/**/*.{test,spec}.ts",
      "apps/playground/src/**/*.{test,spec}.tsx",
      "apps/browser-session-playground/src/**/*.{test,spec}.ts",
      "apps/browser-session-playground/src/**/*.{test,spec}.tsx",
      "apps/object-diff-playground/src/**/*.{test,spec}.ts",
      "apps/object-diff-playground/src/**/*.{test,spec}.tsx",
      "tests/**/*.{ts,tsx}",
      "test-utils/**/*.{ts,tsx}",
      "scripts/doc-versioning-policy.ts",
    ],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: "./tsconfig.tests.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "no-console": "off",
      "import/no-default-export": "off",
    },
  },
  {
    files: ["apps/docs/docs/.vitepress/**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: "./apps/docs/tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "import/no-default-export": "off",
    },
  },
  {
    files: [
      "apps/playground/vite.config.ts",
      "apps/browser-session-playground/vite.config.ts",
      "apps/browser-session-playground/vitest.config.ts",
      "apps/object-diff-playground/vite.config.ts",
      "apps/object-diff-playground/vitest.config.ts",
      "apps/form-intelligent-playground/vite.config.ts",
      "apps/form-intelligent-playground/vitest.config.ts",
    ],
    rules: {
      "import/no-default-export": "off",
    },
  },
);
