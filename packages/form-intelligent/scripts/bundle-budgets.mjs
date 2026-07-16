#!/usr/bin/env node
/**
 * Bundles fixture entry points with esbuild and enforces gzip size budgets.
 * Run after `pnpm exec tsc -b packages/form-intelligent`.
 */
import { gzipSync } from "node:zlib";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const esbuild = require("esbuild");

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(scriptDir, "..");
const distRoot = join(packageRoot, "dist");
const budgetsPath = join(scriptDir, "bundle-budgets.json");

if (!existsSync(join(distRoot, "index.js"))) {
  console.error("Missing dist/ — run: pnpm exec tsc -b packages/form-intelligent");
  process.exit(1);
}

/** @type {{ readonly fixtures: ReadonlyArray<{ readonly id: string; readonly file: string; readonly maxGzipKb: number }> }} */
const budgets = JSON.parse(readFileSync(budgetsPath, "utf8"));

const alias = {
  "@jayoncode/form-intelligent": join(distRoot, "index.js"),
  "@jayoncode/form-intelligent/validation": join(distRoot, "validation/index.js"),
  "@jayoncode/form-intelligent/format": join(distRoot, "format/index.js"),
  "@jayoncode/form-intelligent/rules": join(distRoot, "rules/index.js"),
  "@jayoncode/form-intelligent/workflow": join(distRoot, "workflow/index.js"),
  "@jayoncode/form-intelligent/draft": join(distRoot, "draft/index.js"),
  "@jayoncode/form-intelligent/wizard": join(distRoot, "wizard/index.js"),
  "@jayoncode/form-intelligent/submission": join(distRoot, "submission/index.js"),
  "@jayoncode/form-intelligent/plugins": join(distRoot, "plugins/index.js"),
  "@jayoncode/form-intelligent/analytics": join(distRoot, "analytics/index.js"),
  "@jayoncode/form-intelligent/offline": join(distRoot, "offline/index.js"),
  "@jayoncode/form-intelligent/history": join(distRoot, "history/index.js"),
  "@jayoncode/form-intelligent/devtools": join(distRoot, "devtools/index.js"),
};

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

console.log("@jayoncode/form-intelligent bundle budgets (minified + gzip):\n");

let failed = false;

for (const fixture of budgets.fixtures) {
  const entry = join(scriptDir, "bundle-fixtures", fixture.file);
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    write: false,
    format: "esm",
    platform: "browser",
    target: "es2022",
    alias,
    external: ["@jayoncode/browser-lifecycle", "@jayoncode/object-diff"],
    logLevel: "silent",
  });

  const output = result.outputFiles[0]?.contents;
  if (!output) {
    console.error(`  ${fixture.id}: no bundle output`);
    failed = true;
    continue;
  }

  const minified = output.length;
  const gzipped = gzipSync(output).length;
  const maxBytes = fixture.maxGzipKb * 1024;
  const ok = gzipped <= maxBytes;
  const status = ok ? "ok" : "FAIL";

  console.log(
    `  ${fixture.id.padEnd(16)} gzip ${formatKb(gzipped).padStart(10)}  min ${formatKb(minified).padStart(10)}  max ${fixture.maxGzipKb} KB  [${status}]`,
  );

  if (!ok) {
    failed = true;
  }
}

if (failed) {
  console.error(
    "\nBundle budget exceeded. Update bundle-budgets.json only after intentional size changes.",
  );
  process.exit(1);
}

console.log("\nAll bundle budgets passed.");
