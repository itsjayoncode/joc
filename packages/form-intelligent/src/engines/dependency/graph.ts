import type { DependencyEdge, DependencyGraph, DependencyNode } from "./types.js";
import type { FieldPath } from "../../types/index.js";

export class DependencyGraphView implements DependencyGraph {
  public readonly nodes: ReadonlyMap<FieldPath, DependencyNode>;
  public readonly edges: readonly DependencyEdge[];
  private readonly dependents: ReadonlyMap<FieldPath, readonly FieldPath[]>;
  private readonly parents: ReadonlyMap<FieldPath, readonly FieldPath[]>;

  public constructor(edges: readonly DependencyEdge[]) {
    this.edges = edges;

    const dependents = new Map<FieldPath, FieldPath[]>();
    const parents = new Map<FieldPath, FieldPath[]>();
    const nodePaths = new Set<FieldPath>();

    for (const edge of edges) {
      nodePaths.add(edge.from);
      nodePaths.add(edge.to);

      const kids = dependents.get(edge.from) ?? [];
      if (!kids.includes(edge.to)) {
        kids.push(edge.to);
      }
      dependents.set(edge.from, kids);

      const pars = parents.get(edge.to) ?? [];
      if (!pars.includes(edge.from)) {
        pars.push(edge.from);
      }
      parents.set(edge.to, pars);
    }

    const nodes = new Map<FieldPath, DependencyNode>();
    for (const path of nodePaths) {
      nodes.set(path, {
        path,
        parents: parents.get(path) ?? [],
        children: dependents.get(path) ?? [],
      });
    }

    this.nodes = nodes;
    this.dependents = dependents;
    this.parents = parents;
  }

  public dependentsOf(path: FieldPath): readonly FieldPath[] {
    return this.dependents.get(path) ?? [];
  }

  public parentsOf(path: FieldPath): readonly FieldPath[] {
    return this.parents.get(path) ?? [];
  }

  /**
   * Topological order of nodes reachable from `seeds` (or all nodes).
   * Children appear after parents. Stable by first-seen edge order.
   */
  public topoOrder(seeds?: readonly FieldPath[]): readonly FieldPath[] {
    const start = seeds && seeds.length > 0 ? [...seeds] : [...this.nodes.keys()];

    const indegree = new Map<FieldPath, number>();
    const reachable = new Set<FieldPath>();
    const queue: FieldPath[] = [];

    const visitReachable = (path: FieldPath): void => {
      if (reachable.has(path)) {
        return;
      }
      reachable.add(path);
      for (const child of this.dependentsOf(path)) {
        visitReachable(child);
      }
    };

    for (const seed of start) {
      visitReachable(seed);
    }

    for (const path of reachable) {
      let degree = 0;
      for (const parent of this.parentsOf(path)) {
        if (reachable.has(parent)) {
          degree += 1;
        }
      }
      indegree.set(path, degree);
      if (degree === 0) {
        queue.push(path);
      }
    }

    const ordered: FieldPath[] = [];
    while (queue.length > 0) {
      const path = queue.shift();
      if (path === undefined) {
        break;
      }
      ordered.push(path);
      for (const child of this.dependentsOf(path)) {
        if (!reachable.has(child)) {
          continue;
        }
        const next = (indegree.get(child) ?? 0) - 1;
        indegree.set(child, next);
        if (next === 0) {
          queue.push(child);
        }
      }
    }

    return ordered;
  }
}
