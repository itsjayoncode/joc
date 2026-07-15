# @jayoncode/browser-lifecycle

Browser Lifecycle Manager is the browser lifecycle package for the JOC ecosystem.

Phase `2.2.5` now includes the Connectivity Module on top of the Focus and Visibility modules. This package currently ships:

- `createBrowserLifecycle()`
- Session Core lifecycle orchestration
- readonly lifecycle snapshots and capability reads
- public named event subscriptions and full event feed subscriptions
- Page Visibility observation through the Visibility Module
- `page:visible` and `page:hidden` event integration
- Window focus observation through the Focus Module
- `window:focus` and `window:blur` event integration
- Advisory connectivity observation through the Connectivity Module
- `connection:online`, `connection:offline`, and `connection:reconnect` event integration
- Idle activity observation through the Idle Module
- `session:active`, `session:idle`, `activity:detected`, and `activity:reset` event integration
- Page lifecycle observation through the Lifecycle Module
- Cross-tab coordination through the Cross Tab Module
- `tab:primary`, `tab:secondary`, and `tab:message` event integration
- internal module registration infrastructure
- plugin metadata registration guards
- configuration helpers
- infrastructure error types
- typed event infrastructure
- SSR-safe feature detection helpers
- stateless utility helpers
- public infrastructure types

It implements plugin lifecycle hooks through `PluginRuntime` and exposes plugin diagnostics through `getPlugins()` and `getPluginHookLog()`.

Phase 2.1 establishes the design source of truth in [`engineering/`](./engineering):

- `000-product-vision.md`
- `001-problem-research.md`
- `002-browser-platform-research.md`
- `003-system-architecture.md`
- `004-public-api-design.md`
- `005-event-specification.md`
- `006-configuration-design.md`
- `007-runtime-compatibility.md`
- `008-folder-architecture.md`
- `009-development-roadmap.md`
- `010-non-goals.md`
- `011-design-decisions.md`

Core infrastructure documentation:

- [docs/core-infrastructure.md](./docs/core-infrastructure.md)
- [examples/core-infrastructure/README.md](./examples/core-infrastructure/README.md)
- [docs/events.md](./docs/events.md)
- [examples/events/README.md](./examples/events/README.md)
- [docs/session-core.md](./docs/session-core.md)
- [examples/session-core/README.md](./examples/session-core/README.md)
- [docs/visibility.md](./docs/visibility.md)
- [examples/visibility/README.md](./examples/visibility/README.md)
- [engineering/011-event-infrastructure.md](./engineering/011-event-infrastructure.md)
- [engineering/012-session-core.md](./engineering/012-session-core.md)
- [engineering/013-visibility-module.md](./engineering/013-visibility-module.md)

Current public exports:

- `createBrowserLifecycle()`
- `createBrowserLifecycleConfig()`
- `getDefaultBrowserLifecycleConfig()`
- `mergeBrowserLifecycleConfig()`
- `validateBrowserLifecycleConfig()`
- `getPluginIds()`
- `getPlugins()`
- `getPluginHookLog()`
- `setPluginEnabled(pluginId, enabled)`
- `getRuntimeDiagnostics()`
- `detectBrowserLifecycleCapabilities()`
- `supportsVisibility()`
- `supportsFocus()`
- `supportsConnectivity()`
- `supportsBroadcastChannel()`
- `supportsPageLifecycle()`
- `supportsRequestIdleCallback()`
- `supportsAbortController()`
- `TypedEventEmitter`
- `assert()`
- `noop()`
- `isBrowser()`
- `isFunction()`
- `isObject()`
- `deepFreeze()`
- `mergeObjects()`
- `BrowserLifecycleError`
- `ConfigurationError`
- `UnsupportedFeatureError`
- `InitializationError`
- `LifecycleError`
- `ModuleRegistryError`
- `PluginError`
- `BrowserLifecycle`
- `BrowserLifecycleSnapshot`
- `BrowserLifecyclePhase`
- `BrowserLifecycleEventName`
- `BrowserLifecycleEventMap`
- `PageVisibleEventMetadata`
- `PageHiddenEventMetadata`
- `EventDefinition`
- `EventDispatchContext`
- `EventDispatchMetadata`
- `EventInternalMetadata`
- `EventListener`
- `EventListenerErrorHandler`
- `EventMap`
- `EventName`
- `EventPayload`
- `EventRegistryStats`
- `EventSubscription`
- `TypedEventEmitterOptions`

Implementation follows the frozen engineering documents and currently stops after the Visibility Module.
