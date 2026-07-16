import type { FieldOptions, FieldPath } from "../types/index.js";

export function collectDependentFieldPaths<TValues extends Record<string, unknown>>(
  changedPath: FieldPath,
  fields: ReadonlyMap<FieldPath, FieldOptions<TValues>>,
): FieldPath[] {
  const targets: FieldPath[] = [];

  for (const [fieldPath, options] of fields) {
    if (options.dependsOn?.includes(changedPath)) {
      targets.push(fieldPath);
    }
  }

  return targets;
}
