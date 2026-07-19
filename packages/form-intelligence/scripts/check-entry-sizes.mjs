#!/usr/bin/env node
/**
 * Reports dist entry sizes for @jayoncode/form-intelligence subpaths.
 * Run after `pnpm exec tsc -b packages/form-intelligent`.
 */
import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function reportSize(path) {
  const raw = readFileSync(path);
  const gzipped = gzipSync(raw).length;
  return { raw: raw.length, gzipped };
}

const entries = [
  "index.js",
  "validation/index.js",
  "format/index.js",
  "rules/index.js",
  "workflow/index.js",
  "draft/index.js",
  "wizard/index.js",
  "submission/index.js",
  "plugins/index.js",
  "analytics/index.js",
  "offline/index.js",
  "history/index.js",
  "ui/index.js",
  "captcha/index.js",
];

console.log("@jayoncode/form-intelligence dist entry sizes (raw / gzip):\n");

for (const entry of entries) {
  const path = join(root, entry);
  try {
    const { raw, gzipped } = reportSize(path);
    console.log(
      `  ${entry.padEnd(24)} ${formatKb(raw).padStart(10)}  /  ${formatKb(gzipped).padStart(10)}`,
    );
  } catch {
    console.log(`  ${entry.padEnd(24)} (missing — run tsc first)`);
  }
}

const allJs = readdirSync(root, { recursive: true })
  .filter((file) => String(file).endsWith(".js"))
  .map((file) => join(root, String(file)));

const totalRaw = allJs.reduce((sum, file) => sum + statSync(file).size, 0);
const totalGzip = allJs.reduce((sum, file) => sum + gzipSync(readFileSync(file)).length, 0);

console.log(
  `\n  Total dist JS:           ${formatKb(totalRaw)} raw  /  ${formatKb(totalGzip)} gzip (${allJs.length} files)`,
);
