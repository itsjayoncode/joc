import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const playgroundDir = path.join(rootDir, "apps/browser-session-playground");

const requiredReleaseArtifacts = [
  "CHANGELOG.md",
  "RELEASE_NOTES.md",
  "KNOWN_ISSUES.md",
  "QA_CHECKLIST.md",
  "RELEASE_CHECKLIST.md",
  "REGRESSION_REPORT.md",
  "docs/deployment.md",
  "docs/performance-report.md",
  "docs/accessibility.md",
  "docs/browser-compatibility.md",
  "engineering/023-playground-release.md",
  "public/manifest.json",
  "netlify.toml",
  "vercel.json",
  ".env.example",
];

describe("playground release validation", () => {
  it("includes release documentation artifacts", () => {
    for (const relativePath of requiredReleaseArtifacts) {
      expect(existsSync(path.join(playgroundDir, relativePath))).toBe(true);
    }
  });

  it("ships version 1.0.1", () => {
    const manifest = JSON.parse(readFileSync(path.join(playgroundDir, "package.json"), "utf8")) as {
      version: string;
    };

    expect(manifest.version).toBe("1.0.1");
  });

  it("includes SPA fallback for static hosting", () => {
    const redirects = readFileSync(path.join(playgroundDir, "public/_redirects"), "utf8");
    expect(redirects).toContain("/index.html");
  });

  it("includes deploy workflow", () => {
    expect(existsSync(path.join(rootDir, ".github/workflows/deploy-playground.yml"))).toBe(true);
  });
});
