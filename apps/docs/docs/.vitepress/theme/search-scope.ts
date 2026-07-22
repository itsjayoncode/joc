/**
 * Resolve docs path → search scope (package / area) for badges & grouping.
 * Shared by search result UI decoration (client).
 */

export type SearchScopeId =
  | "browser-lifecycle"
  | "form-intelligence"
  | "object-diff"
  | "storage"
  | "getting-started"
  | "guides"
  | "playground"
  | "roadmap"
  | "packages"
  | "other";

export interface SearchScope {
  id: SearchScopeId;
  /** Short label shown on result badges */
  label: string;
  /** Accent token for CSS (`joc-search-badge--${accent}`) */
  accent: string;
  /** Sort priority when grouping (lower = first) */
  order: number;
}

const PACKAGE_SCOPES: SearchScope[] = [
  {
    id: "browser-lifecycle",
    label: "Browser Lifecycle",
    accent: "cyan",
    order: 10,
  },
  {
    id: "form-intelligence",
    label: "Form Intelligence",
    accent: "amber",
    order: 20,
  },
  {
    id: "object-diff",
    label: "Object Diff",
    accent: "blue",
    order: 30,
  },
  {
    id: "storage",
    label: "Storage",
    accent: "emerald",
    order: 40,
  },
];

const SCOPE_GETTING_STARTED: SearchScope = {
  id: "getting-started",
  label: "Getting Started",
  accent: "slate",
  order: 1,
};
const SCOPE_PACKAGES: SearchScope = {
  id: "packages",
  label: "Packages",
  accent: "slate",
  order: 5,
};
const SCOPE_GUIDES: SearchScope = {
  id: "guides",
  label: "Guides",
  accent: "violet",
  order: 50,
};
const SCOPE_PLAYGROUND: SearchScope = {
  id: "playground",
  label: "Playground",
  accent: "pink",
  order: 60,
};
const SCOPE_ROADMAP: SearchScope = {
  id: "roadmap",
  label: "Roadmap",
  accent: "slate",
  order: 70,
};
const SCOPE_OTHER: SearchScope = {
  id: "other",
  label: "Docs",
  accent: "slate",
  order: 99,
};

/** Versioned package docs: packages/<id>/v1.2.3/... */
const ARCHIVED_PKG_PATH = /(?:^|\/)packages\/[^/]+\/v\d+\.\d+\.\d+(?:\/|$)/;
const ARCHIVES_ROOT = /(?:^|\/)archives(?:\/|$)/;

export function isArchivedDocsPath(path: string): boolean {
  const normalized = normalizeDocsPath(path);
  return ARCHIVED_PKG_PATH.test(normalized) || ARCHIVES_ROOT.test(normalized);
}

export function normalizeDocsPath(pathOrUrl: string): string {
  let path = pathOrUrl.trim();
  try {
    if (/^https?:\/\//i.test(path) || path.startsWith("//")) {
      path = new URL(path, "https://example.invalid").pathname;
    }
  } catch {
    // keep as-is
  }
  // Strip site base if present (e.g. /joc/packages/...)
  path = path.replace(/^\/+/, "/");
  return path.split(/[?#]/)[0] ?? path;
}

export function resolveSearchScope(pathOrUrl: string): SearchScope {
  const path = normalizeDocsPath(pathOrUrl);

  for (const pkg of PACKAGE_SCOPES) {
    if (
      path.includes(`/packages/${pkg.id}/`) ||
      path.endsWith(`/packages/${pkg.id}`) ||
      path.includes(`/playground/${pkg.id}/`) ||
      path.endsWith(`/playground/${pkg.id}`)
    ) {
      return pkg;
    }
  }

  if (path.includes("/getting-started/") || path.endsWith("/getting-started")) {
    return SCOPE_GETTING_STARTED;
  }
  if (path.includes("/guides/") || path.endsWith("/guides")) {
    return SCOPE_GUIDES;
  }
  if (path.includes("/playground/") || path.endsWith("/playground")) {
    return SCOPE_PLAYGROUND;
  }
  if (path.includes("/roadmap/") || path.endsWith("/roadmap")) {
    return SCOPE_ROADMAP;
  }
  if (path.includes("/packages/") || path.endsWith("/packages")) {
    return SCOPE_PACKAGES;
  }

  return SCOPE_OTHER;
}
