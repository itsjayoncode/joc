import { getValidatorKind, VALIDATOR_KIND_ORDER } from "./validator-kind.js";

import type { FieldPath, Validator } from "../types/index.js";

export type ValidatorSourceMap<TValues extends Record<string, unknown>> = Partial<
  Record<FieldPath, Validator<TValues> | readonly Validator<TValues>[]>
>;

function toList<TValues extends Record<string, unknown>>(
  entry: Validator<TValues> | readonly Validator<TValues>[] | undefined,
): Validator<TValues>[] {
  if (!entry) {
    return [];
  }
  return Array.isArray(entry) ? [...entry] : [entry];
}

/** Last occurrence of each kind within a source wins for that source's candidate. */
function candidatesByKind<TValues extends Record<string, unknown>>(
  validators: readonly Validator<TValues>[],
): {
  readonly byKind: Map<string, Validator<TValues>>;
  readonly untyped: Validator<TValues>[];
} {
  const byKind = new Map<string, Validator<TValues>>();
  const untyped: Validator<TValues>[] = [];

  for (const validator of validators) {
    const kind = getValidatorKind(validator);
    if (kind) {
      byKind.set(kind, validator);
    } else {
      untyped.push(validator);
    }
  }

  return { byKind, untyped };
}

/**
 * Merge validators from HTML / Schema / Field with Field > Schema > HTML per kind.
 * Untyped validators append Field → Schema → HTML (relative order preserved).
 */
export function mergeValidatorsByKind<TValues extends Record<string, unknown>>(sources: {
  readonly html?: ValidatorSourceMap<TValues>;
  readonly schema?: ValidatorSourceMap<TValues>;
  readonly field?: ValidatorSourceMap<TValues>;
}): Partial<Record<FieldPath, readonly Validator<TValues>[]>> {
  const paths = new Set<FieldPath>([
    ...Object.keys(sources.html ?? {}),
    ...Object.keys(sources.schema ?? {}),
    ...Object.keys(sources.field ?? {}),
  ]);

  const merged: Partial<Record<FieldPath, readonly Validator<TValues>[]>> = {};

  for (const path of paths) {
    const field = candidatesByKind(toList(sources.field?.[path]));
    const schema = candidatesByKind(toList(sources.schema?.[path]));
    const html = candidatesByKind(toList(sources.html?.[path]));

    const typed: Validator<TValues>[] = [];
    for (const kind of VALIDATOR_KIND_ORDER) {
      const winner =
        field.byKind.get(kind) ?? schema.byKind.get(kind) ?? html.byKind.get(kind) ?? undefined;
      if (winner) {
        typed.push(winner);
      }
    }

    const untyped = [...field.untyped, ...schema.untyped, ...html.untyped];
    const list = [...typed, ...untyped];
    if (list.length > 0) {
      merged[path] = list;
    }
  }

  return merged;
}
