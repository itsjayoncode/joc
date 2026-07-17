#!/usr/bin/env node
/**
 * Bundles fixture entry points with esbuild and enforces gzip size budgets.
 * Run after `pnpm exec tsc -b packages/form-intelligent`.
 *
 * Dynamic `import()` chunks (offline/analytics/object-diff/integrations) are
 * measured separately from the entry chunk when splitting is enabled — mirrors
 * Vite/webpack consumer graphs (Phase 18 / ADR-013).
 */
import { gzipSync } from "node:zlib";
import { readFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
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

/** @type {{ readonly fixtures: ReadonlyArray<{ readonly id: string; readonly file: string; readonly maxGzipKb: number; readonly forbid?: readonly string[] }> }} */
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

console.log("@jayoncode/form-intelligent bundle budgets (entry chunk, minified + gzip):\n");

let failed = false;

for (const fixture of budgets.fixtures) {
  const entry = join(scriptDir, "bundle-fixtures", fixture.file);
  const outdir = mkdtempSync(join(tmpdir(), `fi-budget-${fixture.id}-`));

  try {
    const result = await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      minify: true,
      write: false,
      splitting: true,
      outdir,
      format: "esm",
      platform: "browser",
      target: "es2022",
      alias,
      external: ["@jayoncode/browser-lifecycle", "@jayoncode/object-diff"],
      logLevel: "silent",
      metafile: true,
    });

    const entryBase = basename(fixture.file, ".mjs");
    const entryOutput =
      result.outputFiles.find((file) => file.path.endsWith(`${entryBase}.js`)) ??
      result.outputFiles.find((file) => !file.path.includes(join("chunk-"))) ??
      result.outputFiles[0];

    if (!entryOutput) {
      console.error(`  ${fixture.id}: no entry chunk`);
      failed = true;
      continue;
    }

    const text = Buffer.from(entryOutput.contents).toString("utf8");
    for (const needle of fixture.forbid ?? []) {
      if (text.includes(needle)) {
        console.error(`  ${fixture.id}: entry chunk unexpectedly contains "${needle}"`);
        failed = true;
      }
    }

    const minified = entryOutput.contents.length;
    const gzipped = gzipSync(entryOutput.contents).length;
    const maxBytes = fixture.maxGzipKb * 1024;
    const ok = gzipped <= maxBytes;
    const status = ok ? "ok" : "FAIL";
    const asyncChunks = result.outputFiles.length - 1;

    console.log(
      `  ${fixture.id.padEnd(16)} gzip ${formatKb(gzipped).padStart(10)}  min ${formatKb(minified).padStart(10)}  max ${fixture.maxGzipKb} KB  async×${asyncChunks}  [${status}]`,
    );

    if (!ok) {
      failed = true;
    }
  } finally {
    rmSync(outdir, { recursive: true, force: true });
  }
}

if (failed) {
  console.error(
    "\nBundle budget exceeded. Prefer tree-shake/lazy import; raising maxGzipKb requires ADR-013 note + 24_PERFORMANCE.md update.",
  );
  process.exit(1);
}

console.log("\nAll bundle budgets passed.");
