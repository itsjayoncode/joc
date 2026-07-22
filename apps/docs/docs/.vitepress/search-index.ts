/**
 * Node-side helpers for VitePress local search indexing.
 */

import { isArchivedDocsPath } from "./theme/search-scope.js";

export { isArchivedDocsPath };

/** Heading split — mirrors VitePress default local-search splitter. */
const headingRegex = /<h(\d*).*?>(.*?<a.*? href="#.*?".*?>.*?<\/a>)<\/h\1>/gi;
const headingContentRegex = /(.*?)<a.*? href="#(.*?)".*?>.*?<\/a>/i;

function clearHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

function getSearchableText(content: string): string {
  return clearHtmlTags(content);
}

export interface PageSplitSection {
  anchor: string;
  titles: string[];
  text: string;
}

/**
 * Split HTML into sections and prefix every title trail with a scope label
 * (e.g. "Storage") so breadcrumbs in the modal show the package.
 */
export function* splitPageIntoScopedSections(
  html: string,
  scopeLabel: string | null,
): Generator<PageSplitSection> {
  const result = html.split(headingRegex);
  result.shift();
  let parentTitles: string[] = [];

  for (let i = 0; i < result.length; i += 3) {
    const level = Number.parseInt(result[i] ?? "1", 10) - 1;
    const heading = result[i + 1] ?? "";
    const headingResult = headingContentRegex.exec(heading);
    const title = clearHtmlTags(headingResult?.[1] ?? "").trim();
    const anchor = headingResult?.[2] ?? "";
    const content = result[i + 2] ?? "";
    if (!title || !content) {
      continue;
    }

    let titles = parentTitles.slice(0, level);
    titles[level] = title;
    titles = titles.filter(Boolean);

    if (scopeLabel && titles[0] !== scopeLabel) {
      titles = [scopeLabel, ...titles];
    }

    yield { anchor, titles, text: getSearchableText(content) };

    if (level === 0) {
      parentTitles = [title];
    } else {
      parentTitles[level] = title;
    }
  }
}

export function resolveIndexScopeLabel(relativePath: string): string | null {
  const path = relativePath.replace(/\\/g, "/");

  if (
    path.includes("packages/browser-lifecycle/") ||
    path.includes("playground/browser-lifecycle")
  ) {
    return "Browser Lifecycle";
  }
  if (
    path.includes("packages/form-intelligence/") ||
    path.includes("playground/form-intelligence")
  ) {
    return "Form Intelligence";
  }
  if (path.includes("packages/object-diff/") || path.includes("playground/object-diff")) {
    return "Object Diff";
  }
  if (path.includes("packages/storage/") || path.includes("playground/storage")) {
    return "Storage";
  }
  if (path.startsWith("getting-started/") || path.includes("/getting-started/")) {
    return "Getting Started";
  }
  if (path.startsWith("guides/") || path.includes("/guides/")) {
    return "Guides";
  }
  if (path.startsWith("playground/") || path.includes("/playground/")) {
    return "Playground";
  }
  if (path.startsWith("roadmap/") || path.includes("/roadmap/")) {
    return "Roadmap";
  }
  if (path.startsWith("packages/") || path === "packages/index.md") {
    return "Packages";
  }
  return null;
}
