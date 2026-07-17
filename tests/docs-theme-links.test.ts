import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const themeDir = path.join(rootDir, "apps/docs/docs/.vitepress/theme");

/** Allowed :href expressions that already apply the VitePress base. */
const SAFE_HREF_EXPR =
  /^(?:docsHref|withBase|playgroundHref|playgroundGuideLink)\(|^(?:link\.external\s*\?\s*link\.href\s*:\s*docsHref\()/;

function listVueFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...listVueFiles(fullPath));
      continue;
    }

    if (entry.endsWith(".vue")) {
      files.push(fullPath);
    }
  }

  return files;
}

function findBareAbsoluteHrefs(source: string): string[] {
  const findings: string[] = [];

  // <DocsLink> applies docsHref internally — ignore its href bindings.
  const normalized = source.replace(/<DocsLink\b[^>]*>/g, (tag) =>
    tag.replace(/:(?:href)="[^"]*"/g, ':href="docsHref(_)"'),
  );

  const staticHref = /\bhref="(\/[^"]*)"/g;
  let match: RegExpExecArray | null;

  while ((match = staticHref.exec(normalized)) !== null) {
    const href = match[1];
    if (href === undefined) {
      continue;
    }
    findings.push(`href="${href}"`);
  }

  const boundHref = /:href="([^"]+)"/g;

  while ((match = boundHref.exec(normalized)) !== null) {
    const captured = match[1];
    if (captured === undefined) {
      continue;
    }

    const expression = captured.trim();

    if (SAFE_HREF_EXPR.test(expression)) {
      continue;
    }

    if (
      expression.startsWith("'/") ||
      expression.startsWith('"/') ||
      expression.startsWith("`/") ||
      /\b(?:docsLink|Link|Href)\b/.test(expression)
    ) {
      findings.push(`:href="${expression}"`);
    }
  }

  return findings;
}

describe("docs theme base-aware links", () => {
  it("keeps a shared docsHref helper for GitHub Pages base paths", () => {
    const helper = readFileSync(path.join(themeDir, "docs-href.ts"), "utf8");
    expect(helper).toContain("withBase");
    expect(helper).toContain("export function docsHref");
  });

  it("rejects bare absolute hrefs in custom theme Vue components", () => {
    const vueFiles = listVueFiles(themeDir);
    expect(vueFiles.length).toBeGreaterThan(0);

    const violations: string[] = [];

    for (const filePath of vueFiles) {
      const relativePath = path.relative(rootDir, filePath);
      const source = readFileSync(filePath, "utf8");

      // DocsLink owns base resolution — allow its internal :href binding.
      if (relativePath.endsWith(`${path.sep}DocsLink.vue`)) {
        continue;
      }

      for (const finding of findBareAbsoluteHrefs(source)) {
        violations.push(`${relativePath}: ${finding}`);
      }
    }

    expect(violations).toEqual([]);
  });
});
