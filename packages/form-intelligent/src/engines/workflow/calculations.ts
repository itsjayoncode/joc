import { getIn } from "./utils.js";

import type { FieldPath } from "./types.js";

export interface CalculationDefinition<TValues extends Record<string, unknown>> {
  readonly path: FieldPath;
  readonly compute: (context: { values: TValues }) => unknown;
  readonly deps?: readonly FieldPath[];
  readonly markDirty?: boolean;
}

export function extractDepsFromValues<TValues extends Record<string, unknown>>(
  values: TValues,
): readonly FieldPath[] {
  return Object.keys(values);
}

export function runCalculations<TValues extends Record<string, unknown>>(input: {
  readonly calculations: readonly CalculationDefinition<TValues>[];
  readonly values: TValues;
  readonly changedPath?: FieldPath;
}): Partial<Record<FieldPath, unknown>> {
  const updates: Partial<Record<FieldPath, unknown>> = {};

  for (const calculation of input.calculations) {
    const deps = calculation.deps ?? extractDepsFromValues(input.values);
    if (input.changedPath !== undefined && !deps.includes(input.changedPath)) {
      continue;
    }

    const nextValue = calculation.compute({ values: input.values });
    const currentValue = getIn(input.values, calculation.path);
    if (currentValue !== nextValue) {
      updates[calculation.path] = nextValue;
    }
  }

  return updates;
}
