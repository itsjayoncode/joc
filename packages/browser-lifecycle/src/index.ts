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
