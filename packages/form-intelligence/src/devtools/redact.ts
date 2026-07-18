/**
 * Production / export redaction helpers for DevTools snapshots.
 * Prefer metadata over raw values unless the user opts into capture.
 */

const REDACTED = "***";

export interface RedactOptions {
  /** Paths to leave unredacted (exact match). */
  readonly allowPaths?: readonly string[];
  /** Replacement token (default `***`). */
  readonly placeholder?: string;
}

export function redactValue(value: unknown, options: RedactOptions = {}): unknown {
  const placeholder = options.placeholder ?? REDACTED;
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.map(() => placeholder);
    }
    return Object.fromEntries(Object.keys(value as object).map((key) => [key, placeholder]));
  }
  return placeholder;
}

export function redactValuesRecord(
  values: Readonly<Record<string, unknown>>,
  options: RedactOptions = {},
): Record<string, unknown> {
  const allow = new Set(options.allowPaths ?? []);
  const placeholder = options.placeholder ?? REDACTED;
  const next: Record<string, unknown> = {};
  for (const [path, value] of Object.entries(values)) {
    next[path] = allow.has(path) ? value : redactLeaf(value, placeholder);
  }
  return next;
}

function redactLeaf(value: unknown, placeholder: string): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.map(() => placeholder);
    }
    return Object.fromEntries(Object.keys(value as object).map((key) => [key, placeholder]));
  }
  return placeholder;
}

/**
 * Returns a shallow state copy with `values` redacted for safe logging/export.
 */
export function redactFormStateSnapshot<
  TState extends { readonly values: Record<string, unknown> },
>(state: TState, options: RedactOptions = {}): TState {
  return {
    ...state,
    values: redactValuesRecord(state.values, options),
  };
}
