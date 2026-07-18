export type {
  CascadeResult,
  DependencyAction,
  DependencyEdge,
  DependencyEdgeConfig,
  DependencyGraph,
  DependencyMap,
  DependencyNode,
} from "./types.js";
export { DEFAULT_DEPENDENCY_ACTIONS, INFERRED_DEPENDENCY_ACTIONS } from "./types.js";
export { detectDependencyCycles, formatCyclePath } from "./cycle-detect.js";
export { DependencyGraphView } from "./graph.js";
export { DependencyEngine, dependencies, normalizeDependencyMap } from "./dependency-engine.js";
export type { DependencyEngineOptions } from "./dependency-engine.js";
export { createDependencyRegistrar } from "./registrar.js";
export type { DependencyRegistrar } from "./registrar.js";

import { DependencyGraphView } from "./graph.js";
import { INFERRED_DEPENDENCY_ACTIONS } from "./types.js";

import type { DependencyEdge } from "./types.js";
import type { FieldOptions, FieldPath } from "../../types/index.js";

/** SHIPPED helper — parent → dependents[] from `FieldOptions.dependsOn`. */
export function buildFieldDependencyGraph<TValues extends Record<string, unknown>>(
  fields: ReadonlyMap<FieldPath, FieldOptions<TValues>>,
): ReadonlyMap<FieldPath, readonly FieldPath[]> {
  const edges: DependencyEdge[] = [];
  for (const [child, options] of fields) {
    for (const parent of options.dependsOn ?? []) {
      edges.push({
        from: parent,
        to: child,
        actions: INFERRED_DEPENDENCY_ACTIONS,
        inferred: true,
      });
    }
  }
  const view = new DependencyGraphView(edges);
  const map = new Map<FieldPath, readonly FieldPath[]>();
  for (const [path, node] of view.nodes) {
    if (node.children.length > 0) {
      map.set(path, node.children);
    }
  }
  // Also include parents that only appear as from-nodes
  for (const edge of edges) {
    if (!map.has(edge.from)) {
      map.set(edge.from, view.dependentsOf(edge.from));
    }
  }
  return map;
}

/** SHIPPED helper — direct dependents of one parent via `dependsOn`. */
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
