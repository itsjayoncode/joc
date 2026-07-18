import type { FieldPath } from "./types.js";

export function parsePath(path: FieldPath): string[] {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
}

export function getIn(values: Record<string, unknown>, path: FieldPath): unknown {
  const segments = parsePath(path);
  let current: unknown = values;

  for (const segment of segments) {
    if (current === null || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}
