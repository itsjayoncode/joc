import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredDocsPages = [
  "apps/docs/docs/index.md",
  "apps/docs/docs/getting-started/introduction.md",
  "apps/docs/docs/guides/architecture.md",
  "apps/docs/docs/packages/browser-lifecycle/index.md",
  "apps/docs/docs/packages/browser-lifecycle/installation.md",
  "apps/docs/docs/packages/browser-lifecycle/guides/usage.md",
  "apps/docs/docs/packages/browser-lifecycle/guides/quick-start.md",
  "apps/docs/docs/packages/index.md",
  "apps/docs/docs/packages/browser-lifecycle/tutorials/beginner.md",
  "apps/docs/docs/packages/browser-lifecycle/best-practices/index.md",
  "apps/docs/docs/packages/browser-lifecycle/patterns/index.md",
  "apps/docs/docs/packages/browser-lifecycle/faq/index.md",
  "apps/docs/docs/packages/browser-lifecycle/troubleshooting/index.md",
  "apps/docs/docs/packages/browser-lifecycle/migration/index.md",
  "apps/docs/docs/roadmap/index.md",
  "scripts/sync-documentation.mjs",
  "packages/browser-lifecycle/typedoc.json",
  "apps/browser-session-playground/engineering/022-documentation-integration.md",
];

const requiredExamplePlaceholders = [
  "examples/vanilla/README.md",
  "examples/react/README.md",
  "examples/vue/README.md",
  "examples/angular/README.md",
  "examples/svelte/README.md",
  "examples/nextjs/README.md",
  "examples/electron/README.md",
  "examples/pwa/README.md",
];

const requiredPlaygroundDocs = [
  "apps/browser-session-playground/docs/visibility-playground.md",
  "apps/browser-session-playground/docs/focus-playground.md",
  "apps/browser-session-playground/docs/plugin-playground.md",
];

function readText(relativePath: string): string {
  return readFileSync(path.join(rootDir, relativePath), "utf8");
}

describe("developer experience platform", () => {
  it("includes the key documentation pages", () => {
    for (const relativePath of requiredDocsPages) {
      expect(existsSync(path.join(rootDir, relativePath))).toBe(true);
    }
  });

  it("includes framework example directories", () => {
    for (const relativePath of requiredExamplePlaceholders) {
      expect(existsSync(path.join(rootDir, relativePath))).toBe(true);
    }
  });

  it("includes playground documentation sources for module integration", () => {
    for (const relativePath of requiredPlaygroundDocs) {
      expect(existsSync(path.join(rootDir, relativePath))).toBe(true);
    }
  });

  it("points the docs site playground link at the browser session playground", () => {
    const config = readText("apps/docs/docs/.vitepress/config.ts");
    const seo = readText("apps/docs/docs/.vitepress/seo.ts");
    expect(config).toContain("docsPlaygroundUrl");
    expect(seo).toContain("VITE_DOCS_PLAYGROUND_URL");
    expect(readText("apps/docs/package.json")).toContain("http://127.0.0.1:4273");
    expect(config).not.toContain("http://127.0.0.1:4173");
  });

  it("configures GitHub Pages base path support for the docs site", () => {
    const config = readText("apps/docs/docs/.vitepress/config.ts");
    expect(config).toContain("VITE_DOCS_BASE");
    expect(config).toContain("sitemap");
    expect(config).toContain("application/ld+json");
    expect(existsSync(path.join(rootDir, ".github/workflows/deploy-docs.yml"))).toBe(true);
    expect(existsSync(path.join(rootDir, "apps/docs/docs/public/robots.txt"))).toBe(true);
  });

  it("documents browser lifecycle instead of a placeholder package page", () => {
    const overview = readText("apps/docs/docs/packages/browser-lifecycle/index.md");
    expect(overview).toContain("createBrowserLifecycle()");
    expect(overview).not.toContain("No public implementation exists yet");
  });

  it("wires documentation build scripts for api generation and sync", () => {
    const docsPackage = readText("apps/docs/package.json");
    expect(docsPackage).toContain('"docs:api"');
    expect(docsPackage).toContain('"docs:sync"');
    expect(docsPackage).toContain('"docs:stage-archives"');
    expect(docsPackage).toContain('"docs:prepare"');
  });

  it("supports versioned browser-lifecycle documentation archives", () => {
    const manifestPath = path.join(rootDir, "apps/docs/doc-versions/browser-lifecycle.json");
    const config = readText("apps/docs/docs/.vitepress/config.ts");
    const rootPackage = readText("package.json");
    const versioningLib = path.join(rootDir, "scripts/lib/doc-versioning.mjs");

    expect(existsSync(manifestPath)).toBe(true);
    expect(existsSync(versioningLib)).toBe(true);
    expect(config).toContain("browser-lifecycle-versions");
    expect(config).toContain("createBrowserLifecycleSidebarMap");
    expect(rootPackage).toContain('"docs:archive"');
    expect(rootPackage).toContain("archive-package-docs.mjs --before-release");
  });

  it("formats and lints generated documentation output during sync", () => {
    const syncScript = readText("scripts/sync-documentation.mjs");
    const apiScript = readText("scripts/generate-api-documentation.mjs");
    expect(syncScript).toContain("formatGeneratedFiles");
    expect(syncScript).toContain("lintGeneratedMetaFiles");
    expect(apiScript).toContain("formatGeneratedApiDocs");
  });
});

describe("documentation integration output", () => {
  it("generates prepared documentation from source docs", () => {
    const sourceModulesDir = path.join(rootDir, "packages/browser-lifecycle/docs");
    const sourcePlaygroundDir = path.join(rootDir, "apps/browser-session-playground/docs");
    const typedocConfig = path.join(rootDir, "packages/browser-lifecycle/typedoc.json");

    if (
      !existsSync(sourceModulesDir) ||
      !existsSync(sourcePlaygroundDir) ||
      !existsSync(typedocConfig)
    ) {
      return;
    }

    const result = spawnSync("pnpm", ["docs:prepare"], {
      cwd: rootDir,
      encoding: "utf8",
      env: {
        ...process.env,
        DOCS_SYNC_SKIP_QUALITY: "1",
      },
    });

    expect(result.status, result.stderr || result.stdout).toBe(0);

    const syncedExamples = path.join(
      rootDir,
      "apps/docs/docs/packages/browser-lifecycle/examples/index.md",
    );
    const syncedModulesDir = path.join(
      rootDir,
      "apps/docs/docs/packages/browser-lifecycle/modules",
    );
    const syncedPlaygroundDir = path.join(
      rootDir,
      "apps/docs/docs/packages/browser-lifecycle/playground",
    );
    const generatedApiIndex = path.join(
      rootDir,
      "apps/docs/docs/packages/browser-lifecycle/api/index.md",
    );
    const versionsMeta = path.join(
      rootDir,
      "apps/docs/docs/.vitepress/browser-lifecycle-versions.ts",
    );
    const stagedArchiveIndex = path.join(
      rootDir,
      "apps/docs/docs/packages/browser-lifecycle/v0.1.2/index.md",
    );

    expect(existsSync(generatedApiIndex)).toBe(true);
    expect(existsSync(syncedExamples)).toBe(true);
    expect(existsSync(syncedModulesDir)).toBe(true);
    expect(existsSync(syncedPlaygroundDir)).toBe(true);
    expect(existsSync(versionsMeta)).toBe(true);
    expect(existsSync(stagedArchiveIndex)).toBe(true);
    expect(readdirSync(syncedModulesDir).length).toBeGreaterThan(0);
    expect(readdirSync(syncedPlaygroundDir).length).toBeGreaterThan(0);
  }, 30_000);
});
