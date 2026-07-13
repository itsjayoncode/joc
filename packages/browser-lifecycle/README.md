# @jayoncode/browser-lifecycle

Browser Lifecycle Manager is the browser lifecycle package for the JOC ecosystem.

Phase `2.2.2` now includes Session Core on top of the earlier infrastructure layers. This package currently ships:

- `createBrowserLifecycle()`
- Session Core lifecycle orchestration
- readonly lifecycle snapshots and capability reads
- public named event subscriptions and full event feed subscriptions
- internal module registration infrastructure
- plugin metadata registration guards
- configuration helpers
- infrastructure error types
- typed event infrastructure
- SSR-safe feature detection helpers
- stateless utility helpers
- public infrastructure types

It does **not** yet implement browser observation modules, browser-driven lifecycle state detection, cross-tab coordination, or full plugin execution hooks.

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
- [engineering/011-event-infrastructure.md](./engineering/011-event-infrastructure.md)
- [engineering/012-session-core.md](./engineering/012-session-core.md)

Current public exports:

- `createBrowserLifecycle()`
- `createBrowserLifecycleConfig()`
- `getDefaultBrowserLifecycleConfig()`
- `mergeBrowserLifecycleConfig()`
- `validateBrowserLifecycleConfig()`
- `getPluginIds()`
- `detectBrowserLifecycleCapabilities()`
- `supportsVisibility()`
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

Implementation follows the frozen engineering documents and currently stops after Session Core.
