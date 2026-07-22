import { compare as coreCompare } from "../compare/compare.js";
import { diff as coreDiff, hasChanges as coreHasChanges } from "../compare/difference/diff.js";
import { InvalidOptionsError, PluginError } from "../errors/index.js";
import {
  merge as coreMerge,
  type MergeConflict,
  type MergeConflictReason,
  type MergeOptions,
  type MergeResult,
  type MergeStrategy,
} from "../merge/index.js";
import { applyPatch as coreApplyPatch, patch as corePatch } from "../patch/index.js";
import { createSerializer } from "../serialize/index.js";

import type {
  ApplyPatchOptions,
  CompareOptions,
  CustomComparator,
  DiffOptions,
  DiffResult,
  FormatterPlugin,
  Patch,
  PatchOptions,
  Path,
  SerializeOptions,
} from "../types/index.js";

/** Matcher plugin hook — same contract as `CustomComparator`. */
export type CustomMatcher = CustomComparator;

export interface MergeStrategyPlugin {
  readonly name: string;
  resolve(conflict: MergeConflict): unknown;
}

export interface DiffHookContext {
  readonly a: unknown;
  readonly b: unknown;
  readonly options: DiffOptions | undefined;
}

export interface ApplyPatchHookContext {
  readonly target: unknown;
  readonly patch: Patch;
  readonly options: ApplyPatchOptions | undefined;
}

export interface ObjectDiffPluginHooks {
  readonly beforeDiff?: (context: DiffHookContext) => void;
  readonly afterDiff?: (result: DiffResult, context: DiffHookContext) => DiffResult | undefined;
  readonly beforeApplyPatch?: (context: ApplyPatchHookContext) => void;
  readonly afterApplyPatch?: (value: unknown, context: ApplyPatchHookContext) => void;
}

export interface ObjectDiffPlugin {
  readonly name: string;
  readonly matchers?: readonly CustomMatcher[];
  readonly formatters?: readonly FormatterPlugin[];
  readonly mergeStrategies?: readonly MergeStrategyPlugin[];
  readonly hooks?: ObjectDiffPluginHooks;
}

export interface CreateEngineOptions {
  readonly plugins?: readonly ObjectDiffPlugin[];
}

export interface EngineMergeOptions extends Omit<MergeOptions, "strategy" | "resolve"> {
  /** Built-in strategy, plugin strategy name, or `custom` with `resolve`. */
  readonly strategy?: MergeStrategy | (string & {});
  readonly resolve?: (conflict: MergeConflict) => unknown;
}

export interface EngineApi {
  /** Registered plugin names (order preserved). */
  readonly plugins: readonly string[];
  compare(a: unknown, b: unknown, options?: CompareOptions): boolean;
  diff(a: unknown, b: unknown, options?: DiffOptions): DiffResult;
  hasChanges(a: unknown, b: unknown, options?: DiffOptions): boolean;
  patch(diffResult: DiffResult, options?: PatchOptions): Patch;
  applyPatch<T>(target: T, operations: Patch, options?: ApplyPatchOptions): T;
  serialize(diffResult: DiffResult, format: string, options?: SerializeOptions): string;
  merge(left: unknown, right: unknown, options?: EngineMergeOptions): MergeResult;
}

const BUILTIN_MERGE_STRATEGIES = new Set<string>(["latest-wins", "manual", "custom"]);

function runPluginHook<T>(pluginName: string, hookName: string, fn: () => T): T {
  try {
    return fn();
  } catch (cause) {
    throw new PluginError(`Plugin "${pluginName}" hook "${hookName}" failed.`, {
      cause,
      details: { plugin: pluginName, hook: hookName },
    });
  }
}

function composeMatchers(
  matchers: readonly CustomMatcher[],
  user?: CustomComparator,
): CustomComparator | undefined {
  if (matchers.length === 0) {
    return user;
  }

  return (a: unknown, b: unknown, path: Path): boolean | undefined => {
    for (const matcher of matchers) {
      const outcome = matcher(a, b, path);

      if (outcome !== undefined) {
        return outcome;
      }
    }

    return user?.(a, b, path);
  };
}

function collectPlugins(plugins: readonly ObjectDiffPlugin[]): {
  names: string[];
  matchers: CustomMatcher[];
  formatters: FormatterPlugin[];
  mergeStrategies: Map<string, MergeStrategyPlugin>;
  ordered: ObjectDiffPlugin[];
} {
  const names: string[] = [];
  const seen = new Set<string>();
  const matchers: CustomMatcher[] = [];
  const formatters: FormatterPlugin[] = [];
  const mergeStrategies = new Map<string, MergeStrategyPlugin>();
  const ordered: ObjectDiffPlugin[] = [];

  for (const plugin of plugins) {
    if (!plugin.name || typeof plugin.name !== "string") {
      throw new PluginError("ObjectDiffPlugin requires a non-empty name.", {
        details: { plugin: plugin.name },
      });
    }

    if (seen.has(plugin.name)) {
      throw new PluginError(`Duplicate plugin name "${plugin.name}".`, {
        details: { plugin: plugin.name },
      });
    }

    seen.add(plugin.name);
    names.push(plugin.name);
    ordered.push(plugin);

    if (plugin.matchers) {
      for (const matcher of plugin.matchers) {
        if (typeof matcher !== "function") {
          throw new PluginError(`Plugin "${plugin.name}" has an invalid matcher.`, {
            details: { plugin: plugin.name },
          });
        }

        matchers.push(matcher);
      }
    }

    if (plugin.formatters) {
      for (const formatter of plugin.formatters) {
        formatters.push(formatter);
      }
    }

    if (plugin.mergeStrategies) {
      for (const strategy of plugin.mergeStrategies) {
        if (!strategy.name || typeof strategy.resolve !== "function") {
          throw new PluginError(`Plugin "${plugin.name}" has an invalid merge strategy.`, {
            details: { plugin: plugin.name, strategy: strategy.name },
          });
        }

        if (BUILTIN_MERGE_STRATEGIES.has(strategy.name) || mergeStrategies.has(strategy.name)) {
          throw new PluginError(
            `Merge strategy name "${strategy.name}" is reserved or duplicated.`,
            { details: { plugin: plugin.name, strategy: strategy.name } },
          );
        }

        mergeStrategies.set(strategy.name, strategy);
      }
    }
  }

  return { names, matchers, formatters, mergeStrategies, ordered };
}

/**
 * Create an engine with explicit plugins. Importing this module registers nothing.
 */
export function createEngine(options: CreateEngineOptions = {}): EngineApi {
  const plugins = options.plugins ?? [];
  const collected = collectPlugins(plugins);
  const serializeWith = createSerializer(collected.formatters);

  const withMatchers = <T extends CompareOptions | DiffOptions | undefined>(callOptions: T): T => {
    const composed = composeMatchers(collected.matchers, callOptions?.customComparator);

    if (!composed) {
      return callOptions;
    }

    return {
      ...(callOptions ?? {}),
      customComparator: composed,
    } as T;
  };

  return {
    plugins: collected.names,

    compare(a, b, callOptions) {
      return coreCompare(a, b, withMatchers(callOptions));
    },

    diff(a, b, callOptions) {
      const resolvedOptions = withMatchers(callOptions);
      const context: DiffHookContext = { a, b, options: resolvedOptions };

      for (const plugin of collected.ordered) {
        if (plugin.hooks?.beforeDiff) {
          runPluginHook(plugin.name, "beforeDiff", () => {
            plugin.hooks?.beforeDiff?.(context);
          });
        }
      }

      let result = coreDiff(a, b, resolvedOptions);

      for (const plugin of collected.ordered) {
        if (plugin.hooks?.afterDiff) {
          const next = runPluginHook(plugin.name, "afterDiff", () =>
            plugin.hooks?.afterDiff?.(result, context),
          );

          if (next) {
            result = next;
          }
        }
      }

      return result;
    },

    hasChanges(a, b, callOptions) {
      return coreHasChanges(a, b, withMatchers(callOptions));
    },

    patch(diffResult, callOptions) {
      return corePatch(diffResult, callOptions);
    },

    applyPatch(target, operations, callOptions) {
      const context: ApplyPatchHookContext = {
        target,
        patch: operations,
        options: callOptions,
      };

      for (const plugin of collected.ordered) {
        if (plugin.hooks?.beforeApplyPatch) {
          runPluginHook(plugin.name, "beforeApplyPatch", () => {
            plugin.hooks?.beforeApplyPatch?.(context);
          });
        }
      }

      const value = coreApplyPatch(target, operations, callOptions);

      for (const plugin of collected.ordered) {
        if (plugin.hooks?.afterApplyPatch) {
          runPluginHook(plugin.name, "afterApplyPatch", () => {
            plugin.hooks?.afterApplyPatch?.(value, context);
          });
        }
      }

      return value;
    },

    serialize(diffResult, format, callOptions) {
      return serializeWith(diffResult, format, callOptions);
    },

    merge(left, right, callOptions = {}) {
      const { strategy, resolve, ...rest } = callOptions;

      if (
        strategy !== undefined &&
        typeof strategy === "string" &&
        collected.mergeStrategies.has(strategy)
      ) {
        const pluginStrategy = collected.mergeStrategies.get(strategy);

        if (!pluginStrategy) {
          throw new InvalidOptionsError(`Unknown merge strategy "${strategy}".`, {
            details: { strategy },
          });
        }

        return coreMerge(left, right, {
          ...rest,
          strategy: "custom",
          resolve: (conflict) => pluginStrategy.resolve(conflict),
        });
      }

      if (
        strategy !== undefined &&
        typeof strategy === "string" &&
        !BUILTIN_MERGE_STRATEGIES.has(strategy)
      ) {
        throw new InvalidOptionsError(`Unknown merge strategy "${strategy}".`, {
          details: { strategy },
        });
      }

      return coreMerge(left, right, {
        ...rest,
        ...(strategy !== undefined ? { strategy: strategy as MergeStrategy } : {}),
        ...(resolve ? { resolve } : {}),
      });
    },
  };
}

export type { MergeConflict, MergeConflictReason, MergeResult };
export type { FormatterPlugin };
export { PluginError };
