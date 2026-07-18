import { detectDependencyCycles, formatCyclePath } from "./cycle-detect.js";
import { DependencyGraphView } from "./graph.js";
import {
  DEFAULT_DEPENDENCY_ACTIONS,
  INFERRED_DEPENDENCY_ACTIONS,
  type CascadeResult,
  type DependencyAction,
  type DependencyEdge,
  type DependencyEdgeConfig,
  type DependencyGraph,
  type DependencyMap,
} from "./types.js";
import { ConfigurationError } from "../../errors/index.js";

import type { FieldOptions, FieldPath } from "../../types/index.js";

function edgeKey(from: FieldPath, to: FieldPath): string {
  return `${from}\0${to}`;
}

function normalizeParents(from: FieldPath | readonly FieldPath[]): FieldPath[] {
  return typeof from === "string" ? [from] : [...from];
}

export function normalizeDependencyMap(
  map: DependencyMap,
): Readonly<Record<FieldPath, readonly FieldPath[]>> {
  const normalized: Record<FieldPath, readonly FieldPath[]> = {};
  for (const [child, parents] of Object.entries(map)) {
    normalized[child] = normalizeParents(parents);
  }
  return normalized;
}

/**
 * Standalone helper — returns a normalized dependency map for config merge.
 */
export function dependencies(map: DependencyMap): DependencyMap {
  return normalizeDependencyMap(map);
}

export interface DependencyEngineOptions {
  readonly onInferredCycle?: (cycles: readonly (readonly FieldPath[])[]) => void;
}

/**
 * Structural dependency graph façade (Phase 6 / ADR-007).
 */
export class DependencyEngine {
  private readonly edgesByKey = new Map<string, DependencyEdge>();
  private readonly onInferredCycle: DependencyEngineOptions["onInferredCycle"];

  public constructor(options: DependencyEngineOptions = {}) {
    this.onInferredCycle = options.onInferredCycle;
  }

  public registerMap(
    map: DependencyMap,
    options?: {
      readonly actions?: readonly DependencyAction[];
      readonly actionsByChild?: Partial<Record<FieldPath, readonly DependencyAction[]>>;
      readonly inferred?: boolean;
    },
  ): void {
    const normalized = normalizeDependencyMap(map);
    const inferred = options?.inferred === true;
    const defaultActions =
      options?.actions ?? (inferred ? INFERRED_DEPENDENCY_ACTIONS : DEFAULT_DEPENDENCY_ACTIONS);

    for (const [child, parents] of Object.entries(normalized)) {
      const actions = options?.actionsByChild?.[child] ?? defaultActions;
      for (const parent of parents) {
        this.upsertEdge({
          from: parent,
          to: child,
          actions,
          inferred,
        });
      }
    }

    this.enforceCyclePolicy(inferred ? "warn" : "throw");
  }

  public addEdge(
    child: FieldPath,
    parents: readonly FieldPath[],
    actions: readonly DependencyAction[] = DEFAULT_DEPENDENCY_ACTIONS,
    options?: { readonly clearValue?: unknown; readonly inferred?: boolean },
  ): void {
    const inferred = options?.inferred === true;
    for (const parent of parents) {
      this.upsertEdge({
        from: parent,
        to: child,
        actions,
        inferred,
        ...(options?.clearValue === undefined ? {} : { clearValue: options.clearValue }),
      });
    }
    this.enforceCyclePolicy(inferred ? "warn" : "throw");
  }

  public addEdgeConfig(config: DependencyEdgeConfig & { readonly to: FieldPath }): void {
    this.addEdge(
      config.to,
      normalizeParents(config.from),
      config.actions ?? DEFAULT_DEPENDENCY_ACTIONS,
      config.clearValue === undefined ? {} : { clearValue: config.clearValue },
    );
  }

  /** Sync inferred edges from `FieldOptions.dependsOn` (revalidate-only). */
  public syncInferredFromFields<TValues extends Record<string, unknown>>(
    fields: ReadonlyMap<FieldPath, FieldOptions<TValues>>,
  ): void {
    for (const [key, edge] of [...this.edgesByKey.entries()]) {
      if (edge.inferred) {
        this.edgesByKey.delete(key);
      }
    }

    for (const [child, options] of fields) {
      const parents = options.dependsOn;
      if (!parents || parents.length === 0) {
        continue;
      }
      for (const parent of parents) {
        const key = edgeKey(parent, child);
        if (this.edgesByKey.has(key) && !this.edgesByKey.get(key)?.inferred) {
          continue;
        }
        this.upsertEdge({
          from: parent,
          to: child,
          actions: INFERRED_DEPENDENCY_ACTIONS,
          inferred: true,
        });
      }
    }

    this.enforceCyclePolicy("warn");
  }

  public getDependents(path: FieldPath): readonly FieldPath[] {
    return this.inspect().dependentsOf(path);
  }

  public getParents(path: FieldPath): readonly FieldPath[] {
    return this.inspect().parentsOf(path);
  }

  public detectCycles(): readonly (readonly FieldPath[])[] {
    return detectDependencyCycles([...this.edgesByKey.values()]);
  }

  public topologicalOrder(seeds?: readonly FieldPath[]): readonly FieldPath[] {
    return this.inspect().topoOrder(seeds);
  }

  public inspect(): DependencyGraph {
    return new DependencyGraphView([...this.edgesByKey.values()]);
  }

  /**
   * Propagate a parent change: clear / revalidate / recompute / reloadOptions
   * for dependents in topological order.
   */
  public onParentChange(path: FieldPath): CascadeResult {
    const graph = this.inspect();
    const reachable = new Set(graph.topoOrder([path]));
    const orderedChildren = graph.topoOrder([path]).filter((node) => node !== path);

    const clears: { path: FieldPath; clearValue: unknown }[] = [];
    const revalidate: FieldPath[] = [];
    const recompute: FieldPath[] = [];
    const reloadOptions: FieldPath[] = [];

    for (const child of orderedChildren) {
      const merged = this.mergeActionsForChild(child, path, reachable);
      if (!merged || merged.preserve) {
        continue;
      }

      if (merged.actions.includes("clear")) {
        clears.push({ path: child, clearValue: merged.clearValue });
      }
      if (merged.actions.includes("revalidate")) {
        revalidate.push(child);
      }
      if (merged.actions.includes("recompute")) {
        recompute.push(child);
      }
      if (merged.actions.includes("reloadOptions")) {
        reloadOptions.push(child);
      }
    }

    return { clears, revalidate, recompute, reloadOptions };
  }

  private mergeActionsForChild(
    child: FieldPath,
    changedPath: FieldPath,
    reachable: ReadonlySet<FieldPath>,
  ): { actions: DependencyAction[]; clearValue: unknown; preserve: boolean } | undefined {
    const actions: DependencyAction[] = [];
    let clearValue: unknown = "";
    let preserve = false;
    let matched = false;

    for (const edge of this.edgesByKey.values()) {
      if (edge.to !== child) {
        continue;
      }
      // Edge participates if its parent is the changed path or another
      // node in the cascade (diamond: country → city and province → city).
      if (edge.from !== changedPath && !reachable.has(edge.from)) {
        continue;
      }
      matched = true;
      if (edge.actions.includes("preserve")) {
        preserve = true;
      }
      for (const action of edge.actions) {
        if (!actions.includes(action)) {
          actions.push(action);
        }
      }
      if (edge.clearValue !== undefined) {
        clearValue = edge.clearValue;
      }
    }

    if (!matched) {
      return undefined;
    }

    return { actions, clearValue, preserve };
  }

  private upsertEdge(edge: DependencyEdge): void {
    const key = edgeKey(edge.from, edge.to);
    const existing = this.edgesByKey.get(key);
    if (existing && !existing.inferred && edge.inferred) {
      return;
    }
    this.edgesByKey.set(key, edge);
  }

  private enforceCyclePolicy(mode: "throw" | "warn"): void {
    const cycles = this.detectCycles();
    if (cycles.length === 0) {
      return;
    }

    if (mode === "warn") {
      this.onInferredCycle?.(cycles);
      // Intentional: warn mode surfaces inferred cycles without throwing.
      // eslint-disable-next-line no-console -- public warn policy for inferred cycles
      console.warn(
        `[form-intelligent] Dependency cycle detected (inferred dependsOn): ${cycles
          .map(formatCyclePath)
          .join("; ")}`,
      );
      return;
    }

    throw new ConfigurationError(
      `Dependency cycle detected: ${cycles.map(formatCyclePath).join("; ")}`,
      {
        details: { cycles: cycles.map((cycle) => [...cycle]) },
      },
    );
  }
}
