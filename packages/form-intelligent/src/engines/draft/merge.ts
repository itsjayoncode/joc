const UNSAFE_DRAFT_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Strip prototype-pollution keys from a draft payload (shallow + nested plain objects).
 */
export function sanitizeDraftRecord(input: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = Object.create(null) as Record<string, unknown>;

  for (const [key, value] of Object.entries(input)) {
    if (UNSAFE_DRAFT_KEYS.has(key)) {
      continue;
    }

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const proto = Object.getPrototypeOf(value);
      if (proto === Object.prototype || proto === null) {
        output[key] = sanitizeDraftRecord(value as Record<string, unknown>);
        continue;
      }
    }

    output[key] = value;
  }

  return { ...output };
}

export type DraftMergeMode = "overlay" | "replace";

/**
 * Merge stored draft into defaults. Overlay keeps default keys; replace uses draft only
 * (still sanitized). Always pollution-safe.
 */
export function mergeDraftValues<TValues extends Record<string, unknown>>(
  defaults: TValues,
  draft: Record<string, unknown>,
  mode: DraftMergeMode = "overlay",
): TValues {
  const safe = sanitizeDraftRecord(draft);
  if (mode === "replace") {
    return { ...safe } as TValues;
  }
  return { ...defaults, ...safe };
}
