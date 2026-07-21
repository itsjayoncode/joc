#!/usr/bin/env node
/**
 * JOC maintainer CLI — Phase 7 developer tooling.
 *
 * Encodes existing templates + engineering standards; does not invent a product brand.
 *
 * Usage:
 *   pnpm joc new package <kebab-name> [--description "..."] [--public]
 *   pnpm joc new playground <kebab-name> [--package <kebab-name>] [--port <n>]
 *   pnpm joc docs [sync|prepare|dev]
 *   pnpm joc release check
 *   pnpm joc help
 */

import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const PACKAGE_TEMPLATE = path.join(rootDir, "templates/package-template");
const PLAYGROUND_TEMPLATE = path.join(rootDir, "templates/playground-template");

function printHelp() {
  console.log(`JOC maintainer CLI

Commands:
  new package <name>       Scaffold packages/<name> from templates/package-template
  new playground <name>    Scaffold apps/<name>-playground (optional; needs a package)
  docs [sync|prepare|dev]  Thin wrappers around existing docs scripts (default: sync)
  release check            Runs pnpm release:check
  help                     Show this message

Options (new package):
  --description <text>     package.json description
  --public                 Set private:false (default scaffold is private until release-ready)

Options (new playground):
  --package <name>         Package to wire (default: same kebab name as playground)
  --port <number>          Vite dev port (default: next free from 4280)

Standards (single source of truth — do not fork here):
  engineering/016-package-checklist.md
  engineering/008-package-architecture.md
  engineering/ecosystem/governance.md
  templates/README.md
`);
}

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function assertKebabName(name, label) {
  if (!name || typeof name !== "string") {
    fail(`${label} is required (kebab-case, e.g. my-widget)`);
  }
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
    fail(`${label} must be kebab-case (got "${name}")`);
  }
  if (name.startsWith("jayoncode-") || name.startsWith("@")) {
    fail(`${label} should be the bare folder slug (e.g. my-widget), not a scoped npm name`);
  }
}

function toTitleCase(kebab) {
  return kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseArgs(argv) {
  const positionals = [];
  const flags = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--public") {
      flags.public = true;
      continue;
    }
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        fail(`Missing value for --${key}`);
      }
      flags[key] = value;
      i += 1;
      continue;
    }
    positionals.push(token);
  }

  return { positionals, flags };
}

function replaceAll(content, replacements) {
  let next = content;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  return next;
}

function walkFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") {
        continue;
      }
      out.push(...walkFiles(full));
      continue;
    }
    out.push(full);
  }
  return out;
}

function applyTextReplacements(targetDir, replacements) {
  for (const filePath of walkFiles(targetDir)) {
    if (filePath.endsWith(".png") || filePath.endsWith(".ico")) {
      continue;
    }
    const original = readFileSync(filePath, "utf8");
    const updated = replaceAll(original, replacements);
    if (updated !== original) {
      writeFileSync(filePath, updated);
    }
  }
}

function renameTemplateFiles(targetDir, kebabName) {
  const candidates = [
    path.join(targetDir, "src/package-name.ts"),
    path.join(targetDir, "tests/unit/package-name.test.ts"),
  ];

  for (const from of candidates) {
    if (!existsSync(from)) {
      continue;
    }
    const to = from.replace(/package-name/g, kebabName);
    mkdirSync(path.dirname(to), { recursive: true });
    renameSync(from, to);
  }
}

function ensureTsconfigReference(packageName) {
  const tsconfigPath = path.join(rootDir, "tsconfig.json");
  const raw = readFileSync(tsconfigPath, "utf8");
  const refPath = `./packages/${packageName}`;
  if (raw.includes(`"path": "${refPath}"`)) {
    return false;
  }

  if (!/"references"\s*:\s*\[/.test(raw)) {
    fail("tsconfig.json is missing a references array");
  }

  const updated = raw.replace(/("references"\s*:\s*\[\n)/, `$1    { "path": "${refPath}" },\n`);
  if (updated === raw) {
    fail("Could not insert project reference into tsconfig.json");
  }
  writeFileSync(tsconfigPath, updated);
  return true;
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function collectUsedPorts() {
  const ports = new Set();
  const appsDir = path.join(rootDir, "apps");
  for (const entry of readdirSync(appsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.endsWith("-playground")) {
      continue;
    }
    const manifestPath = path.join(appsDir, entry.name, "package.json");
    if (!existsSync(manifestPath)) {
      continue;
    }
    const text = readFileSync(manifestPath, "utf8");
    for (const match of text.matchAll(/--port\s+(\d+)/g)) {
      ports.add(Number(match[1]));
    }
  }
  return ports;
}

function nextDevPort(preferred) {
  if (preferred) {
    const port = Number(preferred);
    if (!Number.isInteger(port) || port < 1024) {
      fail(`--port must be an integer >= 1024`);
    }
    return port;
  }
  const used = collectUsedPorts();
  let port = 4280;
  while (used.has(port) || used.has(port + 1)) {
    port += 2;
  }
  return port;
}

function patchRootPlaygroundScripts(playgroundAppName, filterName) {
  const packageJsonPath = path.join(rootDir, "package.json");
  const manifest = readJson(packageJsonPath);
  const scripts = manifest.scripts ?? {};
  const prefix = playgroundAppName.replace(/-playground$/, "");
  const additions = {
    [`${prefix}-playground:dev`]: `pnpm --filter ${filterName} dev`,
    [`${prefix}-playground:build`]: `pnpm --filter ${filterName} build`,
    [`${prefix}-playground:preview`]: `pnpm --filter ${filterName} preview`,
    [`${prefix}-playground:test`]: `pnpm --filter ${filterName} test`,
  };

  let changed = false;
  for (const [key, value] of Object.entries(additions)) {
    if (scripts[key] !== value) {
      scripts[key] = value;
      changed = true;
    }
  }

  if (!changed) {
    return false;
  }

  // Keep typecheck:apps aware of the new playground when possible.
  const typecheckApps = scripts["typecheck:apps"] ?? "";
  const typecheckSnippet = `tsc -p apps/${playgroundAppName}/tsconfig.json --noEmit`;
  if (typecheckApps && !typecheckApps.includes(`apps/${playgroundAppName}/tsconfig.json`)) {
    scripts["typecheck:apps"] = `${typecheckApps} && ${typecheckSnippet}`;
  }

  const buildScript = scripts.build ?? "";
  const buildSnippet = `pnpm ${prefix}-playground:build`;
  if (buildScript && !buildScript.includes(`${prefix}-playground:build`)) {
    scripts.build = `${buildScript} && ${buildSnippet}`;
  }

  manifest.scripts = scripts;
  writeJson(packageJsonPath, manifest);
  return true;
}

function createPackage(name, flags) {
  assertKebabName(name, "package name");
  const targetDir = path.join(rootDir, "packages", name);
  if (existsSync(targetDir)) {
    fail(`packages/${name} already exists`);
  }
  if (!existsSync(PACKAGE_TEMPLATE)) {
    fail(`Missing template at templates/package-template`);
  }

  cpSync(PACKAGE_TEMPLATE, targetDir, { recursive: true });

  const scopedName = `@jayoncode/${name}`;
  const title = toTitleCase(name);
  const description =
    flags.description ?? `${title} — Describe the package responsibility clearly and narrowly.`;

  const replacements = [
    ["@jayoncode/package-name", scopedName],
    ["packages/package-name", `packages/${name}`],
    ["package-name.ts", `${name}.ts`],
    ["./package-name.js", `./${name}.js`],
    ["../../src/package-name.js", `../../src/${name}.js`],
    ['"package-name"', `"${name}"`],
    ["package-name", name],
    ["Package Name", title],
  ];

  applyTextReplacements(targetDir, replacements);
  renameTemplateFiles(targetDir, name);

  const manifestPath = path.join(targetDir, "package.json");
  const manifest = readJson(manifestPath);
  manifest.name = scopedName;
  manifest.description = description;
  manifest.repository = {
    type: "git",
    url: "https://github.com/itsjayoncode/joc.git",
    directory: `packages/${name}`,
  };
  manifest.homepage = `https://github.com/itsjayoncode/joc/tree/master/packages/${name}`;
  manifest.keywords = ["joc", name, "jayoncode"];
  manifest.private = !flags.public;
  writeJson(manifestPath, manifest);

  const addedRef = ensureTsconfigReference(name);

  console.log(`Created packages/${name}`);
  console.log(`  npm: ${scopedName}`);
  console.log(`  private: ${manifest.private !== false}`);
  if (addedRef) {
    console.log(`  tsconfig.json: added project reference`);
  }
  console.log(`
Next:
  1. Fill the Phase 8 package brief (problem / audience / why JOC) before investing deeply
  2. Implement in src/${name}.ts — keep the public surface in src/index.ts
  3. pnpm install && pnpm --filter ${scopedName} exec tsc -b --force  (or pnpm build:packages)
  4. pnpm package:blueprint && pnpm package:integrity
  5. Optional: pnpm joc new playground ${name}
  6. When publish-ready: set private:false, add Changeset, register docs versioning

Standards: engineering/016-package-checklist.md`);
}

function createPlayground(name, flags) {
  assertKebabName(name, "playground name");
  const packageName = flags.package ?? name;
  assertKebabName(packageName, "--package");

  const packageDir = path.join(rootDir, "packages", packageName);
  if (!existsSync(packageDir)) {
    fail(
      `packages/${packageName} does not exist — create the package first (pnpm joc new package ${packageName})`,
    );
  }
  if (!existsSync(PLAYGROUND_TEMPLATE)) {
    fail(`Missing template at templates/playground-template`);
  }

  const appName = `${name}-playground`;
  const targetDir = path.join(rootDir, "apps", appName);
  if (existsSync(targetDir)) {
    fail(`apps/${appName} already exists`);
  }

  const port = nextDevPort(flags.port);
  const previewPort = port + 1;
  const scopedPlayground = `@jayoncode/${appName}`;
  const scopedPackage = `@jayoncode/${packageName}`;
  const title = toTitleCase(name);
  const packageTitle = toTitleCase(packageName);

  cpSync(PLAYGROUND_TEMPLATE, targetDir, { recursive: true });

  const replacements = [
    ["__PLAYGROUND_SCOPED__", scopedPlayground],
    ["__PLAYGROUND_APP__", appName],
    ["__PLAYGROUND_SLUG__", name],
    ["__PLAYGROUND_TITLE__", `${title} Playground`],
    ["__PACKAGE_SCOPED__", scopedPackage],
    ["__PACKAGE_SLUG__", packageName],
    ["__PACKAGE_TITLE__", packageTitle],
    ["__DEV_PORT__", String(port)],
    ["__PREVIEW_PORT__", String(previewPort)],
  ];

  applyTextReplacements(targetDir, replacements);

  patchRootPlaygroundScripts(appName, scopedPlayground);

  console.log(`Created apps/${appName}`);
  console.log(`  filter: ${scopedPlayground}`);
  console.log(`  wires: ${scopedPackage}`);
  console.log(`  ports: dev ${port} / preview ${previewPort}`);
  console.log(`
Next:
  1. pnpm install
  2. pnpm ${name}-playground:dev
  3. Expand the lab UI — keep package cores independent (no forced multi-package apps)

Standards: engineering/012-documentation-standards.md`);
}

function runPnpm(args) {
  const result = spawnSync("pnpm", args, { cwd: rootDir, stdio: "inherit" });
  if (result.error) {
    fail(result.error.message);
  }
  process.exit(result.status ?? 1);
}

function main() {
  const { positionals, flags } = parseArgs(process.argv.slice(2));
  const [command, subcommand, name] = positionals;

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "new") {
    if (subcommand === "package") {
      createPackage(name, flags);
      return;
    }
    if (subcommand === "playground") {
      createPlayground(name, flags);
      return;
    }
    fail(`Unknown new target "${subcommand ?? ""}". Use: new package | new playground`);
  }

  if (command === "docs") {
    const action = subcommand ?? "sync";
    if (action === "sync") {
      runPnpm(["docs:sync"]);
    }
    if (action === "prepare") {
      runPnpm(["docs:prepare"]);
    }
    if (action === "dev") {
      runPnpm(["docs:dev"]);
    }
    fail(`Unknown docs action "${action}". Use: sync | prepare | dev`);
  }

  if (command === "release") {
    if (subcommand === "check") {
      runPnpm(["release:check"]);
    }
    fail(`Unknown release action "${subcommand ?? ""}". Use: release check`);
  }

  fail(`Unknown command "${command}". Run: pnpm joc help`);
}

main();
