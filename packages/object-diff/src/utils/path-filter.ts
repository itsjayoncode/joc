import { joinPath } from "./index.js";

import type { Path } from "../types/index.js";

/**
 * Match a display path against a simple glob pattern.
 * Supports `*` (one segment) and `**` (any remainder).
 */
export function pathMatches(path: string, pattern: string): boolean {
  if (pattern === "**") {
    return true;
  }

  if (pattern === "*") {
    return path.length > 0 && !path.includes(".") && !path.includes("[");
  }

  if (!pattern.includes("*")) {
    return path === pattern;
  }

  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "<<<GLOBSTAR>>>")
    .replace(/\*/g, "[^.\\[]+")
    .replace(/<<<GLOBSTAR>>>/g, ".*");

  return new RegExp(`^${escaped}$`).test(path);
}

function isAncestorDisplayPath(ancestor: string, full: string): boolean {
  if (ancestor === "") {
    return true;
  }

  return full === ancestor || full.startsWith(`${ancestor}.`) || full.startsWith(`${ancestor}[`);
}

/**
 * Decide whether a path should be visited during traversal.
 */
export function shouldVisitPath(
  path: Path,
  ignore: readonly string[] | undefined,
  include: readonly string[] | undefined,
): boolean {
  const display = joinPath(path);

  if (ignore && ignore.length > 0) {
    for (const pattern of ignore) {
      if (pathMatches(display, pattern)) {
        return false;
      }

      // Prefix ignore: pattern "secrets" skips "secrets.token"
      if (
        !pattern.includes("*") &&
        isAncestorDisplayPath(pattern, display) &&
        display !== pattern
      ) {
        return false;
      }

      if (pattern.endsWith(".**")) {
        const prefix = pattern.slice(0, -3);
        // Descendants only — still visit/emit the prefix key itself when it changes.
        if (prefix && display !== prefix && isAncestorDisplayPath(prefix, display)) {
          return false;
        }
      }
    }
  }

  if (!include || include.length === 0) {
    return true;
  }

  return include.some((pattern) => {
    if (pathMatches(display, pattern)) {
      return true;
    }

    if (!pattern.includes("*")) {
      // Visit ancestors of an included path and the path itself / descendants
      return isAncestorDisplayPath(display, pattern) || isAncestorDisplayPath(pattern, display);
    }

    // For globs, visit if any segment prefix could still match — conservative: visit all when glob include
    // Narrow: visit if display is empty or pathMatches any progressive prefix attempt
    return display === "" || pathMatches(display, pattern) || pattern.startsWith(display);
  });
}

/**
 * Keep a emitted change path after collection filters.
 */
export function isChangePathAllowed(
  displayPath: string,
  ignore: readonly string[] | undefined,
  include: readonly string[] | undefined,
): boolean {
  if (ignore && ignore.length > 0) {
    for (const pattern of ignore) {
      if (pathMatches(displayPath, pattern)) {
        return false;
      }

      if (
        !pattern.includes("*") &&
        isAncestorDisplayPath(pattern, displayPath) &&
        displayPath !== pattern
      ) {
        return false;
      }

      if (pattern.endsWith(".**")) {
        const prefix = pattern.slice(0, -3);
        // Descendants only — prefix key itself may still emit.
        if (prefix && displayPath !== prefix && isAncestorDisplayPath(prefix, displayPath)) {
          return false;
        }
      }
    }
  }

  if (!include || include.length === 0) {
    return true;
  }

  return include.some((pattern) => pathMatches(displayPath, pattern));
}
