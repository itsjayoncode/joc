export {
  createBrowserLifecycle,
} from "./browser-lifecycle.js";
export {
  createBrowserLifecycleConfig,
  getDefaultBrowserLifecycleConfig,
  getPluginIds,
  mergeBrowserLifecycleConfig,
  validateBrowserLifecycleConfig,
} from "./core/config/index.js";
export {
  BrowserLifecycleError,
  ConfigurationError,
  InitializationError,
  LifecycleError,
  ModuleRegistryError,
  PluginError,
  UnsupportedFeatureError,
} from "./errors/index.js";
export {
  detectBrowserLifecycleCapabilities,
  supportsAbortController,
  supportsBroadcastChannel,
  supportsPageLifecycle,
  supportsRequestIdleCallback,
  supportsVisibility,
} from "./browser/features/index.js";
export { TypedEventEmitter } from "./events/index.js";
export {
  assert,
  deepFreeze,
  isBrowser,
  isFunction,
  isObject,
  mergeObjects,
  noop,
} from "./utils/index.js";
export type {
  BrowserFeatureEnvironment,
  BrowserLifecycleCapabilities,
  BrowserLifecycleConfig,
  BrowserLifecycleCrossTabConfig,
  BrowserLifecycleCrossTabConfigInput,
  BrowserLifecycleErrorCode,
  BrowserLifecyclePlugin,
  ResolvedBrowserLifecycleConfig,
} from "./types/index.js";
export type {
  BrowserLifecycle,
  BrowserLifecycleActivityState,
  BrowserLifecycleAttentionState,
  BrowserLifecycleConnectivityState,
  BrowserLifecycleEvent,
  BrowserLifecycleEventListener,
  BrowserLifecycleEventMap,
  BrowserLifecycleEventName,
  BrowserLifecycleEventSource,
  BrowserLifecyclePageState,
  BrowserLifecyclePhase,
  BrowserLifecycleSnapshot,
  BrowserLifecycleSubscriber,
  BrowserLifecycleTabState,
  BrowserLifecycleTimestamps,
} from "./core/session/index.js";
export type {
  EmitEventOptions,
  EventDefinition,
  EventDispatchContext,
  EventDispatchMetadata,
  EventInternalMetadata,
  EventListener,
  EventListenerErrorHandler,
  EventMap,
  EventName,
  EventPayload,
  EventRegistryStats,
  EventSubscription,
  TypedEventEmitterOptions,
} from "./events/index.js";
