export { runDependencyRules } from "../engines/workflow/index.js";
export { collectDependentFieldPaths } from "../fields/dependencies.js";

import type { FieldOptions, FieldPath } from "../types/index.js";

export function buildFieldDependencyGraph<TValues extends Record<string, unknown>>(
  fields: ReadonlyMap<FieldPath, FieldOptions<TValues>>,
): ReadonlyMap<FieldPath, readonly FieldPath[]> {
  const graph = new Map<FieldPath, FieldPath[]>();

  for (const [fieldPath, options] of fields) {
    for (const dependency of options.dependsOn ?? []) {
      const dependents = graph.get(dependency) ?? [];
      dependents.push(fieldPath);
      graph.set(dependency, dependents);
    }
  }

  return graph;
}
