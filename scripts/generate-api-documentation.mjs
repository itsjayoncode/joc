#!/usr/bin/env node
/**
 * Generates TypeDoc API reference markdown for the docs site and formats output.
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsPackageRoot = path.join(rootDir, "apps/docs");

const packages = [
  {
    name: "browser-lifecycle",
    typedocConfig: path.join(rootDir, "packages/browser-lifecycle/typedoc.json"),
    apiDir: path.join(rootDir, "apps/docs/docs/packages/browser-lifecycle/api"),
  },
  {
    name: "object-diff",
    typedocConfig: path.join(rootDir, "packages/object-diff/typedoc.json"),
    apiDir: path.join(rootDir, "apps/docs/docs/packages/object-diff/api"),
  },
  {
    name: "form-intelligent",
    typedocConfig: path.join(rootDir, "packages/form-intelligent/typedoc.json"),
    apiDir: path.join(rootDir, "apps/docs/docs/packages/form-intelligent/api"),
  },
];

function formatGeneratedApiDocs(apiDir) {
  const prettierBin = path.join(rootDir, "node_modules/prettier/bin/prettier.cjs");
  const result = spawnSync(process.execPath, [prettierBin, "--write", apiDir], {
    cwd: rootDir,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error("Prettier failed while formatting generated API documentation.");
  }
}

for (const pkg of packages) {
  const typedocResult = spawnSync("pnpm", ["exec", "typedoc", "--options", pkg.typedocConfig], {
    cwd: docsPackageRoot,
    stdio: "inherit",
  });

  if (typedocResult.status !== 0) {
    process.exit(typedocResult.status ?? 1);
  }

  if (process.env.DOCS_SYNC_SKIP_QUALITY !== "1") {
    formatGeneratedApiDocs(pkg.apiDir);
  }

  console.log(`Generated API documentation for ${pkg.name}.`);
}
