import type { IdentityKey, Path } from "../types/index.js";

/**
 * Resolve an array item identity for `identityKey` matching.
 * Returns `undefined` when the item has no usable id (positional leftover).
 */
export function resolveIdentity(
  item: unknown,
  path: Path,
  identityKey: IdentityKey,
): string | number | undefined {
  if (typeof identityKey === "string") {
    if (item !== null && typeof item === "object" && identityKey in item) {
      const value = (item as Record<string, unknown>)[identityKey];
      if (typeof value === "string" || typeof value === "number") {
        return value;
      }
    }

    return undefined;
  }

  return identityKey(item, path);
}
