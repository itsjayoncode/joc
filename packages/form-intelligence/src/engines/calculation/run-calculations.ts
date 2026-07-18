import { getIn } from "../workflow/utils.js";

import type { FieldPath } from "../workflow/types.js";

export interface CalculationComputeContext<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly get: (path: FieldPath) => unknown;
}

export interface CalculationDefinition<TValues extends Record<string, unknown>> {
  readonly path: FieldPath;
  readonly compute: (context: CalculationComputeContext<TValues>) => unknown;
  readonly deps?: readonly FieldPath[];
  /** When true, writing the derived value marks the field dirty. Default false. */
  readonly markDirty?: boolean;
  /** Skip initial compute on register; still runs when deps change. */
  readonly lazy?: boolean;
  /** Skip compute when dependency fingerprint is unchanged. */
  readonly memoized?: boolean;
}

export interface CalculateOptions<TValues extends Record<string, unknown>> {
  readonly deps?: readonly FieldPath[];
  readonly markDirty?: boolean;
  readonly lazy?: boolean;
  readonly memoized?: boolean;
  readonly compute: (context: { values: TValues }) => unknown;
}

/** Max cascade passes per apply — prevents infinite calc feedback loops. */
export const MAX_CALCULATION_PASSES = 16;

export function extractDepsFromValues<TValues extends Record<string, unknown>>(
  values: TValues,
): readonly FieldPath[] {
  return Object.keys(values);
}

function depsFingerprint(values: Record<string, unknown>, deps: readonly FieldPath[]): string {
  return deps.map((dep) => `${dep}:${JSON.stringify(getIn(values, dep))}`).join("|");
}

export interface RunCalculationsInput<TValues extends Record<string, unknown>> {
  readonly calculations: readonly CalculationDefinition<TValues>[];
  readonly values: TValues;
  readonly changedPath?: FieldPath;
  /** Memo cache: calc path → last deps fingerprint. */
  readonly memo?: Map<FieldPath, string>;
  /** Skip calcs marked lazy when `initial` is true. */
  readonly initial?: boolean;
}

export function runCalculations<TValues extends Record<string, unknown>>(
  input: RunCalculationsInput<TValues>,
): Partial<Record<FieldPath, unknown>> {
  const updates: Partial<Record<FieldPath, unknown>> = {};
  const get = (path: FieldPath): unknown => getIn(input.values, path);

  for (const calculation of input.calculations) {
    if (input.initial && calculation.lazy) {
      continue;
    }

    const deps = calculation.deps ?? extractDepsFromValues(input.values);
    if (input.changedPath !== undefined && !deps.includes(input.changedPath)) {
      continue;
    }

    if (calculation.memoized && input.memo) {
      const fingerprint = depsFingerprint(input.values as Record<string, unknown>, deps);
      if (input.memo.get(calculation.path) === fingerprint) {
        continue;
      }
      input.memo.set(calculation.path, fingerprint);
    }

    const nextValue = calculation.compute({
      values: input.values,
      get,
    });
    const currentValue = getIn(input.values, calculation.path);
    if (currentValue !== nextValue) {
      updates[calculation.path] = nextValue;
    }
  }

  return updates;
}

/**
 * Detect cycles among calculation targets where a calc path is listed in
 * another calc's deps (A depends on B and B depends on A).
 */
export function detectCalculationCycles<TValues extends Record<string, unknown>>(
  calculations: readonly CalculationDefinition<TValues>[],
): readonly (readonly FieldPath[])[] {
  const calcPaths = new Set(calculations.map((c) => c.path));
  const edges: Array<{ from: FieldPath; to: FieldPath }> = [];

  for (const calc of calculations) {
    for (const dep of calc.deps ?? []) {
      if (calcPaths.has(dep)) {
        // dep → calc.path (calc reads dep)
        edges.push({ from: dep, to: calc.path });
      }
    }
  }

  // Reuse simple DFS
  const children = new Map<FieldPath, FieldPath[]>();
  for (const edge of edges) {
    const list = children.get(edge.from) ?? [];
    list.push(edge.to);
    children.set(edge.from, list);
  }

  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map<FieldPath, number>();
  const stack: FieldPath[] = [];
  const cycles: FieldPath[][] = [];
  const nodes = new Set<FieldPath>();
  for (const edge of edges) {
    nodes.add(edge.from);
    nodes.add(edge.to);
  }

  const visit = (node: FieldPath): void => {
    color.set(node, GRAY);
    stack.push(node);
    for (const next of children.get(node) ?? []) {
      const state = color.get(next) ?? WHITE;
      if (state === GRAY) {
        const start = stack.indexOf(next);
        cycles.push([...stack.slice(start), next]);
        continue;
      }
      if (state === WHITE) {
        visit(next);
      }
    }
    stack.pop();
    color.set(node, BLACK);
  };

  for (const node of nodes) {
    if ((color.get(node) ?? WHITE) === WHITE) {
      visit(node);
    }
  }

  return cycles;
}
