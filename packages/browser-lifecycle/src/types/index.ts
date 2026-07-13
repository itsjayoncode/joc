/**
 * Valid activity events for idle detection inputs.
 */
export type BrowserLifecycleActivityEventName =
  | "focus"
  | "keydown"
  | "mousedown"
  | "mousemove"
  | "pointerdown"
  | "pointermove"
  | "touchmove"
  | "touchstart"
  | "visibilitychange";

/**
 * Supported error codes for the public infrastructure surface.
 */
export type BrowserLifecycleErrorCode =
  | "configuration_error"
  | "initialization_error"
  | "lifecycle_error"
  | "module_registry_error"
  | "plugin_error"
  | "unsupported_feature_error";

/**
 * Common browser capability names exposed by the feature detection helpers.
 */
export type BrowserLifecycleCapabilityName =
  "abortController" | "broadcastChannel" | "pageLifecycle" | "requestIdleCallback" | "visibility";

/**
 * Minimal feature-detection environment used to keep capability checks SSR-safe and testable.
 */
export interface BrowserFeatureEnvironment {
  readonly AbortController?: unknown;
  readonly BroadcastChannel?: unknown;
  readonly document?:
    | (Record<string, unknown> & {
        readonly hidden?: boolean;
        readonly visibilityState?: string;
      })
    | undefined;
  readonly requestIdleCallback?: unknown;
  readonly window?: Record<string, unknown> | undefined;
}

/**
 * Public capability snapshot returned by infrastructure feature detection.
 */
export interface BrowserLifecycleCapabilities {
  readonly abortController: boolean;
  readonly broadcastChannel: boolean;
  readonly pageLifecycle: boolean;
  readonly requestIdleCallback: boolean;
  readonly visibility: boolean;
}

/**
 * Placeholder plugin contract for the core infrastructure phase.
 */
export interface BrowserLifecyclePlugin {
  readonly id: string;
  readonly name?: string;
  readonly version?: string;
}

/**
 * Optional cross-tab configuration overrides.
 */
export interface BrowserLifecycleCrossTabConfigInput {
  readonly channelName?: string;
  readonly heartbeatInterval?: number;
  readonly leaderTimeout?: number;
}

/**
 * Resolved cross-tab configuration used internally after validation.
 */
export interface BrowserLifecycleCrossTabConfig {
  readonly channelName: string;
  readonly enabled: boolean;
  readonly heartbeatInterval: number;
  readonly leaderTimeout: number;
}

/**
 * Public configuration accepted by the package during the core infrastructure phase.
 */
export interface BrowserLifecycleConfig {
  readonly activityDebounce?: number;
  readonly activityEvents?: "default" | readonly BrowserLifecycleActivityEventName[];
  readonly autoStart?: boolean;
  readonly crossTab?: boolean | BrowserLifecycleCrossTabConfigInput;
  readonly debug?: boolean;
  readonly emitInitialState?: boolean;
  readonly eventBufferSize?: number;
  readonly idleTimeout?: false | number;
  readonly plugins?: readonly BrowserLifecyclePlugin[];
}

/**
 * Immutable resolved configuration returned by the configuration system.
 */
export interface ResolvedBrowserLifecycleConfig {
  readonly activityDebounce: number;
  readonly activityEvents: readonly BrowserLifecycleActivityEventName[];
  readonly autoStart: boolean;
  readonly crossTab: BrowserLifecycleCrossTabConfig;
  readonly debug: boolean;
  readonly emitInitialState: boolean;
  readonly eventBufferSize: number;
  readonly idleTimeout: false | number;
  readonly plugins: readonly BrowserLifecyclePlugin[];
}

/**
 * Internal validation issue shape used for detailed configuration errors.
 */
export interface BrowserLifecycleValidationIssue {
  readonly message: string;
  readonly path: string;
}

/**
 * Placeholder public event metadata type for the infrastructure phase.
 */
export interface BrowserLifecycleEventPlaceholder {
  readonly category: string;
  readonly name: string;
}

/**
 * Placeholder internal module definition type for the infrastructure phase.
 */
export interface BrowserLifecycleModulePlaceholder {
  readonly name: string;
  readonly requiredCapabilities: readonly BrowserLifecycleCapabilityName[];
}

/**
 * Deep readonly utility used by immutable helpers.
 */
export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer TValue)[]
    ? readonly DeepReadonly<TValue>[]
    : T extends object
      ? { readonly [TKey in keyof T]: DeepReadonly<T[TKey]> }
      : T;

/**
 * Shared object shape used by pure infrastructure helpers.
 */
export type PlainObject = Record<string, unknown>;
