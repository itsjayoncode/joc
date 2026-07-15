import { PluginError } from "../errors/index.js";

import type {
  BrowserLifecyclePluginContext,
  BrowserLifecyclePluginDiagnostic,
  BrowserLifecyclePluginHookLogEntry,
  BrowserLifecyclePluginHookName,
  BrowserLifecyclePluginLifecycleTransition,
  BrowserLifecyclePluginPhase,
  EmitPluginPublicEvent,
  PluginRuntimeEntry,
} from "./types.js";
import type { BrowserLifecycleEventName } from "../core/session/types.js";
import type { BrowserLifecyclePlugin } from "../types/index.js";
const PLUGIN_HOOK_NAMES: readonly BrowserLifecyclePluginHookName[] = [
  "onRegister",
  "onStart",
  "onStop",
  "onDestroy",
  "onEvent",
];

const MAX_HOOK_LOG_ENTRIES = 200;

function countPluginHooks(plugin: BrowserLifecyclePlugin): number {
  let count = 0;
  for (const hookName of PLUGIN_HOOK_NAMES) {
    if (typeof plugin[hookName] === "function") {
      count += 1;
    }
  }
  return count;
}

function sortPluginsByPriority(entries: readonly PluginRuntimeEntry[]): PluginRuntimeEntry[] {
  return [...entries].sort((left, right) => {
    const leftPriority = left.plugin.priority ?? 0;
    const rightPriority = right.plugin.priority ?? 0;
    if (leftPriority !== rightPriority) {
      return rightPriority - leftPriority;
    }
    return left.registrationOrder - right.registrationOrder;
  });
}

/**
 * Coordinates plugin registration, lifecycle hooks, and hook diagnostics.
 */
export class PluginRuntime {
  private readonly entries = new Map<string, PluginRuntimeEntry>();
  private readonly hookLog: BrowserLifecyclePluginHookLogEntry[] = [];
  private registrationSequence = 0;

  public constructor(
    private readonly context: BrowserLifecyclePluginContext,
    private readonly emitPublicEvent: EmitPluginPublicEvent,
    private readonly timeProvider: () => number,
  ) {}

  public register(plugin: BrowserLifecyclePlugin): void {
    if (this.entries.has(plugin.id)) {
      throw new PluginError(`A plugin with id "${plugin.id}" is already registered.`);
    }

    const registeredAt = this.timeProvider();
    const registrationOrder = this.registrationSequence;
    this.registrationSequence += 1;

    const entry: PluginRuntimeEntry = {
      enabled: plugin.enabled !== false,
      hookCount: countPluginHooks(plugin),
      lifecycle: "registered",
      plugin,
      registeredAt,
      registrationOrder,
      transitions: [
        {
          from: undefined,
          timestamp: registeredAt,
          to: "registered",
        },
      ],
    };

    this.entries.set(plugin.id, entry);
  }

  public has(pluginId: string): boolean {
    return this.entries.has(pluginId);
  }

  public getPluginIds(): readonly string[] {
    return [...this.entries.values()]
      .sort((left, right) => left.registrationOrder - right.registrationOrder)
      .map((entry) => entry.plugin.id);
  }

  public setEnabled(pluginId: string, enabled: boolean): void {
    const entry = this.entries.get(pluginId);
    if (!entry) {
      throw new PluginError(`Plugin "${pluginId}" is not registered.`);
    }
    entry.enabled = enabled;
  }

  public getDiagnostics(): readonly BrowserLifecyclePluginDiagnostic[] {
    return sortPluginsByPriority([...this.entries.values()]).map((entry) => ({
      ...(entry.plugin.author === undefined ? {} : { author: entry.plugin.author }),
      dependencies: entry.plugin.dependencies ?? [],
      ...(entry.plugin.description === undefined ? {} : { description: entry.plugin.description }),
      enabled: entry.enabled,
      hookCount: entry.hookCount,
      id: entry.plugin.id,
      lifecycle: entry.lifecycle,
      ...(entry.loadedAt === undefined ? {} : { loadedAt: entry.loadedAt }),
      ...(entry.plugin.name === undefined ? {} : { name: entry.plugin.name }),
      ...(entry.previousLifecycle === undefined
        ? {}
        : { previousLifecycle: entry.previousLifecycle }),
      priority: entry.plugin.priority ?? 0,
      registeredAt: entry.registeredAt,
      registrationOrder: entry.registrationOrder,
      transitionCount: entry.transitions.length,
      transitions: [...entry.transitions],
      ...(entry.plugin.version === undefined ? {} : { version: entry.plugin.version }),
    }));
  }

  public getHookLog(): readonly BrowserLifecyclePluginHookLogEntry[] {
    return [...this.hookLog];
  }

  public initializeAll(): void {
    for (const entry of sortPluginsByPriority([...this.entries.values()])) {
      this.transition(entry, "initialized");
      this.runHook(entry, "onRegister");
      entry.loadedAt = this.timeProvider();
      this.emitPluginRegistered(entry);
    }
  }

  public startAll(): void {
    for (const entry of sortPluginsByPriority([...this.entries.values()])) {
      this.transition(entry, "started");
      this.runHook(entry, "onStart");
      this.transition(entry, "running");
    }
  }

  public stopAll(reason: "dispose" | "manual-stop"): void {
    for (const entry of sortPluginsByPriority([...this.entries.values()]).reverse()) {
      if (entry.lifecycle === "destroyed" || entry.lifecycle === "stopped") {
        continue;
      }

      if (entry.lifecycle === "running" || entry.lifecycle === "started") {
        this.runHook(entry, "onStop");
      }

      this.transition(entry, "stopped");
      this.emitPluginRemoved(entry, reason);
    }
  }

  public destroyAll(): void {
    for (const entry of sortPluginsByPriority([...this.entries.values()]).reverse()) {
      if (entry.lifecycle === "destroyed") {
        continue;
      }

      if (entry.lifecycle !== "stopped") {
        this.runHook(entry, "onStop");
        this.transition(entry, "stopped");
        this.emitPluginRemoved(entry, "dispose");
      }

      this.runHook(entry, "onDestroy");
      this.transition(entry, "destroyed");
    }
  }

  public dispatchEvent(event: BrowserLifecycleEventName, payload: unknown): void {
    for (const entry of sortPluginsByPriority([...this.entries.values()])) {
      if (
        !entry.enabled ||
        entry.lifecycle !== "running" ||
        typeof entry.plugin.onEvent !== "function"
      ) {
        continue;
      }

      this.runHook(entry, "onEvent", event, () => {
        entry.plugin.onEvent?.(event, payload);
      });
    }
  }

  private transition(entry: PluginRuntimeEntry, nextPhase: BrowserLifecyclePluginPhase): void {
    const timestamp = this.timeProvider();
    const previousTransition = entry.transitions.at(-1);
    const durationMs =
      previousTransition === undefined
        ? undefined
        : Math.max(0, timestamp - previousTransition.timestamp);

    const transition: BrowserLifecyclePluginLifecycleTransition = {
      from: entry.lifecycle,
      timestamp,
      to: nextPhase,
      ...(durationMs === undefined ? {} : { durationMs }),
    };

    entry.previousLifecycle = entry.lifecycle;
    entry.lifecycle = nextPhase;
    entry.transitions.push(transition);
  }

  private runHook(
    entry: PluginRuntimeEntry,
    hook: Exclude<BrowserLifecyclePluginHookName, "onEvent">,
  ): void;
  private runHook(
    entry: PluginRuntimeEntry,
    hook: "onEvent",
    eventType: BrowserLifecycleEventName,
    execute: () => void,
  ): void;
  private runHook(
    entry: PluginRuntimeEntry,
    hook: BrowserLifecyclePluginHookName,
    eventType?: BrowserLifecycleEventName,
    execute?: () => void,
  ): void {
    if (hook === "onEvent") {
      if (typeof entry.plugin.onEvent !== "function") {
        return;
      }
    } else if (typeof entry.plugin[hook] !== "function") {
      return;
    }

    const startedAt = this.timeProvider();
    try {
      if (hook === "onEvent") {
        execute?.();
      } else if (hook === "onRegister") {
        entry.plugin.onRegister?.(this.context);
      } else if (hook === "onStart") {
        entry.plugin.onStart?.(this.context);
      } else if (hook === "onStop") {
        entry.plugin.onStop?.(this.context);
      } else {
        entry.plugin.onDestroy?.(this.context);
      }
    } catch (error) {
      this.emitPluginError(entry, hook, error);
      return;
    }

    const durationMs = Math.max(0, this.timeProvider() - startedAt);
    this.recordHook(entry.plugin.id, hook, durationMs, eventType);
  }

  private recordHook(
    pluginId: string,
    hook: BrowserLifecyclePluginHookName,
    durationMs: number,
    eventType?: BrowserLifecycleEventName,
  ): void {
    const entry: BrowserLifecyclePluginHookLogEntry = {
      durationMs,
      hook,
      id: `${pluginId}-${hook}-${String(this.timeProvider())}-${String(this.hookLog.length)}`,
      pluginId,
      source: "plugin-runtime",
      timestamp: this.timeProvider(),
      ...(eventType === undefined ? {} : { eventType }),
    };

    this.hookLog.unshift(entry);
    if (this.hookLog.length > MAX_HOOK_LOG_ENTRIES) {
      this.hookLog.length = MAX_HOOK_LOG_ENTRIES;
    }
  }

  private emitPluginRegistered(entry: PluginRuntimeEntry): void {
    const timestamp = this.timeProvider();
    const snapshot = this.context.getSnapshot();

    this.emitPublicEvent("plugin:registered", {
      current: "registered",
      metadata: {
        pluginId: entry.plugin.id,
      },
      previous: undefined,
      snapshot,
      source: "plugin",
      timestamp,
      type: "plugin:registered",
    });
  }

  private emitPluginRemoved(entry: PluginRuntimeEntry, reason: "dispose" | "manual-stop"): void {
    const timestamp = this.timeProvider();
    const snapshot = this.context.getSnapshot();

    this.emitPublicEvent("plugin:removed", {
      current: "removed",
      metadata: {
        pluginId: entry.plugin.id,
        reason,
      },
      previous: "registered",
      snapshot,
      source: "plugin",
      timestamp,
      type: "plugin:removed",
    });
  }

  private emitPluginError(
    entry: PluginRuntimeEntry,
    hook: BrowserLifecyclePluginHookName,
    _error: unknown,
  ): void {
    const timestamp = this.timeProvider();
    const snapshot = this.context.getSnapshot();

    this.emitPublicEvent("plugin:error", {
      current: "error",
      metadata: {
        hook,
        pluginId: entry.plugin.id,
      },
      previous: entry.lifecycle === "running" ? "ready" : "registered",
      snapshot,
      source: "plugin",
      timestamp,
      type: "plugin:error",
    });
  }
}
