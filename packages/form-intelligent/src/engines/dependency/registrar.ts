import { type DependencyEngine } from "./dependency-engine.js";
import {
  DEFAULT_DEPENDENCY_ACTIONS,
  type DependencyAction,
  type DependencyEdgeConfig,
  type DependencyGraph,
  type DependencyMap,
} from "./types.js";

export interface DependencyRegistrar<
  _TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  (map: DependencyMap): DependencyRegistrar<_TValues>;
  link(parent: FieldPath): {
    to(child: FieldPath): {
      effect(...actions: DependencyAction[]): DependencyRegistrar<_TValues>;
    };
  };
  edge(config: DependencyEdgeConfig & { readonly to: FieldPath }): DependencyRegistrar<_TValues>;
  inspect(): DependencyGraph;
}

type FieldPath = string;

export function createDependencyRegistrar<TValues extends Record<string, unknown>>(
  engine: DependencyEngine,
  options?: {
    readonly actionsByChild?: Partial<Record<FieldPath, readonly DependencyAction[]>>;
  },
): DependencyRegistrar<TValues> {
  const registrar = ((map: DependencyMap) => {
    engine.registerMap(map, {
      ...(options?.actionsByChild ? { actionsByChild: options.actionsByChild } : {}),
    });
    return registrar;
  }) as DependencyRegistrar<TValues>;

  registrar.link = (parent: FieldPath) => ({
    to: (child: FieldPath) => ({
      effect: (...actions: DependencyAction[]) => {
        engine.addEdge(child, [parent], actions.length > 0 ? actions : DEFAULT_DEPENDENCY_ACTIONS);
        return registrar;
      },
    }),
  });

  registrar.edge = (config) => {
    engine.addEdgeConfig(config);
    return registrar;
  };

  registrar.inspect = () => engine.inspect();

  return registrar;
}
