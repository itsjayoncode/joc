#!/usr/bin/env node
/**
 * Generates TypeDoc API reference markdown for the docs site and formats output.
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsPackageRoot = path.join(rootDir, "apps/docs");
const apiDir = path.join(rootDir, "apps/docs/docs/packages/browser-lifecycle/api");
const typedocConfig = path.join(rootDir, "packages/browser-lifecycle/typedoc.json");

function formatGeneratedApiDocs() {
  const prettierBin = path.join(rootDir, "node_modules/prettier/bin/prettier.cjs");
  const result = spawnSync(process.execPath, [prettierBin, "--write", apiDir], {
    cwd: rootDir,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error("Prettier failed while formatting generated API documentation.");
  }
}

const typedocResult = spawnSync("pnpm", ["exec", "typedoc", "--options", typedocConfig], {
  cwd: docsPackageRoot,
  stdio: "inherit",
});

if (typedocResult.status !== 0) {
  process.exit(typedocResult.status ?? 1);
}

if (process.env.DOCS_SYNC_SKIP_QUALITY !== "1") {
  formatGeneratedApiDocs();
}

console.log("Generated API documentation.");
