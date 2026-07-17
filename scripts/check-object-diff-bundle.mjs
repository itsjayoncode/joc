#!/usr/bin/env node
/**
 * Measure tree-shaken entrypoint sizes for @jayoncode/object-diff.
 * Resolves esbuild via vite (workspace transitive) when available.
 *
 * Usage: node scripts/check-object-diff-bundle.mjs [--write]
 */
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "packages/object-diff/dist");
const reportPath = path.join(rootDir, "packages/object-diff/engineering/bundle-budget.json");

/** Locked budgets (bytes). Ratched via ADR when intentionally raised. */
const BUDGETS = {
  ".": { minified: 32_000, gzip: 10_000 },
  "./core": { minified: 22_000, gzip: 7_000 },
  "./patch": { minified: 28_000, gzip: 9_000 },
  "./merge": { minified: 20_000, gzip: 7_000 },
  "./formatter": { minified: 8_000, gzip: 3_000 },
  "./query": { minified: 4_000, gzip: 2_000 },
  "./stats": { minified: 4_000, gzip: 2_000 },
  "./plugins": { minified: 35_000, gzip: 11_000 },
  "./view": { minified: 12_000, gzip: 4_000 },
};

const ENTRIES = {
  ".": path.join(distDir, "index.js"),
  "./core": path.join(distDir, "core/api.js"),
  "./patch": path.join(distDir, "patch/index.js"),
  "./merge": path.join(distDir, "merge/index.js"),
  "./formatter": path.join(distDir, "formatter/index.js"),
  "./query": path.join(distDir, "query/index.js"),
  "./stats": path.join(distDir, "stats/index.js"),
  "./plugins": path.join(distDir, "plugins/index.js"),
  "./view": path.join(distDir, "view/index.js"),
};

function loadEsbuild() {
  const require = createRequire(path.join(rootDir, "package.json"));

  for (const host of ["vitest", "vite"]) {
    try {
      const hostPkg = require.resolve(`${host}/package.json`);
      return require(require.resolve("esbuild", { paths: [path.dirname(hostPkg)] }));
    } catch {
      // try next host
    }
  }

  try {
    return require(
      path.join(rootDir, "node_modules/.pnpm/esbuild@0.21.5/node_modules/esbuild/lib/main.js"),
    );
  } catch {
    return null;
  }
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB (${bytes} B)`;
}

async function measureEntry(esbuild, entryPath) {
  if (!existsSync(entryPath)) {
    throw new Error(`Missing entry ${entryPath}. Run pnpm build:packages first.`);
  }

  if (!esbuild) {
    const raw = readFileSync(entryPath);
    return {
      minified: raw.length,
      gzip: gzipSync(raw).length,
      note: "raw entry only (esbuild unavailable)",
    };
  }

  const result = await esbuild.build({
    entryPoints: [entryPath],
    bundle: true,
    write: false,
    format: "esm",
    platform: "neutral",
    target: "es2022",
    minify: true,
    legalComments: "none",
    logLevel: "silent",
  });

  const code = result.outputFiles[0]?.contents ?? Buffer.alloc(0);
  return {
    minified: code.length,
    gzip: gzipSync(code).length,
  };
}

async function main() {
  const write = process.argv.includes("--write");
  const esbuild = loadEsbuild();
  const measured = {};
  let failed = false;

  console.log(`object-diff bundle check (esbuild ${esbuild ? "yes" : "no"})`);

  for (const [name, entryPath] of Object.entries(ENTRIES)) {
    const size = await measureEntry(esbuild, entryPath);
    const budget = BUDGETS[name];
    measured[name] = { ...size, budget };

    const minOk = size.minified <= budget.minified;
    const gzipOk = size.gzip <= budget.gzip;
    const status = minOk && gzipOk ? "OK" : "FAIL";

    if (!minOk || !gzipOk) {
      failed = true;
    }

    console.log(
      `${status} ${name}: minified ${formatKb(size.minified)} / ≤ ${formatKb(budget.minified)}; gzip ${formatKb(size.gzip)} / ≤ ${formatKb(budget.gzip)}`,
    );
  }

  if (write) {
    mkdirSync(path.dirname(reportPath), { recursive: true });
    writeFileSync(
      reportPath,
      `${JSON.stringify({ measuredAt: new Date().toISOString(), measured }, null, 2)}\n`,
    );
    console.log(`Wrote ${path.relative(rootDir, reportPath)}`);
  }

  if (failed) {
    console.error("Bundle budget exceeded. Raise budgets only with an ADR.");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
