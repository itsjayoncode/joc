import type { DependencyEdge } from "./types.js";
import type { FieldPath } from "../../types/index.js";

/**
 * DFS 3-color cycle detection. Returns list of cycle path arrays (each ends
 * by repeating the start node), or empty when acyclic.
 */
export function detectDependencyCycles(
  edges: readonly DependencyEdge[],
): readonly (readonly FieldPath[])[] {
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

export function formatCyclePath(cycle: readonly FieldPath[]): string {
  return cycle.join(" → ");
}
