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
      "apps/form-intelligence-playground/src/**/*.{test,spec}.ts",
      "apps/form-intelligence-playground/src/**/*.{test,spec}.tsx",
      "packages/form-intelligence/**/*.browser.test.ts",
      "packages/form-intelligence/**/*.browser.test.tsx",
      "packages/form-intelligence-*/**/*.{test,spec}.ts",
      "packages/form-intelligence-*/**/*.{test,spec}.tsx",
      "packages/form-intelligence-*/**/*.browser.test.ts",
      "packages/form-intelligence-*/**/*.browser.test.tsx",
      "packages/form-intelligence/tests/contracts/**/*.ts",
      "packages/**/*.contract.ts",
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
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/require-await": "off",
    },
  },
  {
    files: ["packages/form-intelligence/**/*.ts", "packages/form-intelligence-*/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true, allowBoolean: true },
      ],
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unnecessary-type-conversion": "off",
      "@typescript-eslint/no-base-to-string": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/only-throw-error": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
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
      "apps/form-intelligence-playground/vite.config.ts",
      "apps/form-intelligence-playground/vitest.config.ts",
    ],
    rules: {
      "import/no-default-export": "off",
    },
  },
);
