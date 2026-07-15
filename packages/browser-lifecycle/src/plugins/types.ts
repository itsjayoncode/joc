import type { BrowserLifecycleEventMap, BrowserLifecycleEventName } from "../core/session/types.js";
import type {
  BrowserLifecyclePlugin,
  BrowserLifecyclePluginRuntimeContext,
} from "../types/index.js";

/**
 * Lifecycle phases tracked for each registered plugin.
 */
export type BrowserLifecyclePluginPhase =
  "registered" | "initialized" | "started" | "running" | "stopped" | "destroyed";

/**
 * Supported plugin hook names executed by the Session Core plugin runtime.
 */
export type BrowserLifecyclePluginHookName =
  "onDestroy" | "onEvent" | "onRegister" | "onStart" | "onStop";

/**
 * Read-only context passed to plugin lifecycle hooks.
 */
export type BrowserLifecyclePluginContext = BrowserLifecyclePluginRuntimeContext;

/**
 * Recorded plugin lifecycle transition for diagnostics.
 */
export interface BrowserLifecyclePluginLifecycleTransition {
  readonly durationMs?: number;
  readonly from: BrowserLifecyclePluginPhase | undefined;
  readonly timestamp: number;
  readonly to: BrowserLifecyclePluginPhase;
}

/**
 * Diagnostic snapshot for one registered plugin.
 */
export interface BrowserLifecyclePluginDiagnostic {
  readonly author?: string;
  readonly dependencies: readonly string[];
  readonly description?: string;
  readonly enabled: boolean;
  readonly hookCount: number;
  readonly id: string;
  readonly lifecycle: BrowserLifecyclePluginPhase;
  readonly loadedAt?: number;
  readonly name?: string;
  readonly previousLifecycle?: BrowserLifecyclePluginPhase;
  readonly priority: number;
  readonly registeredAt: number;
  readonly registrationOrder: number;
  readonly transitionCount: number;
  readonly transitions: readonly BrowserLifecyclePluginLifecycleTransition[];
  readonly version?: string;
}

/**
 * Recorded plugin hook execution for debugging and playground tooling.
 */
export interface BrowserLifecyclePluginHookLogEntry {
  readonly durationMs: number;
  readonly eventType?: BrowserLifecycleEventName;
  readonly hook: BrowserLifecyclePluginHookName;
  readonly id: string;
  readonly pluginId: string;
  readonly source: "plugin-runtime";
  readonly timestamp: number;
}

export type BrowserLifecyclePluginHookListener = (
  entry: BrowserLifecyclePluginHookLogEntry,
) => void;

export interface PluginRuntimeEntry {
  readonly plugin: BrowserLifecyclePlugin;
  enabled: boolean;
  hookCount: number;
  lifecycle: BrowserLifecyclePluginPhase;
  loadedAt?: number;
  previousLifecycle?: BrowserLifecyclePluginPhase;
  registeredAt: number;
  registrationOrder: number;
  transitions: BrowserLifecyclePluginLifecycleTransition[];
}

export type EmitPluginPublicEvent = <TEventName extends keyof BrowserLifecycleEventMap>(
  event: TEventName,
  payload: BrowserLifecycleEventMap[TEventName],
) => void;
