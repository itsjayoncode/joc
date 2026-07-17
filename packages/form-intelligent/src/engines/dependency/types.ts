import type { FieldPath } from "../../types/index.js";

export type DependencyAction = "clear" | "reloadOptions" | "revalidate" | "recompute" | "preserve";

export interface DependencyEdgeConfig {
  readonly from: FieldPath | readonly FieldPath[];
  readonly actions?: readonly DependencyAction[];
  readonly clearValue?: unknown;
}

/** Map sugar: child path → parent path(s). */
export type DependencyMap = Readonly<Record<FieldPath, FieldPath | readonly FieldPath[]>>;

export interface DependencyEdge {
  readonly from: FieldPath;
  readonly to: FieldPath;
  readonly actions: readonly DependencyAction[];
  readonly clearValue?: unknown;
  /** Inferred from `FieldOptions.dependsOn` — cycles warn; explicit edges throw. */
  readonly inferred?: boolean;
}

export interface DependencyNode {
  readonly path: FieldPath;
  readonly parents: readonly FieldPath[];
  readonly children: readonly FieldPath[];
}

export interface DependencyGraph {
  readonly nodes: ReadonlyMap<FieldPath, DependencyNode>;
  readonly edges: readonly DependencyEdge[];
  dependentsOf(path: FieldPath): readonly FieldPath[];
  parentsOf(path: FieldPath): readonly FieldPath[];
  topoOrder(seeds?: readonly FieldPath[]): readonly FieldPath[];
}

export interface CascadeResult {
  readonly clears: readonly { readonly path: FieldPath; readonly clearValue: unknown }[];
  readonly revalidate: readonly FieldPath[];
  readonly recompute: readonly FieldPath[];
  readonly reloadOptions: readonly FieldPath[];
}

export const DEFAULT_DEPENDENCY_ACTIONS: readonly DependencyAction[] = ["clear", "revalidate"];

/** Inferred `dependsOn` edges: revalidate only (preserve SHIPPED clear behavior). */
export const INFERRED_DEPENDENCY_ACTIONS: readonly DependencyAction[] = ["revalidate"];
