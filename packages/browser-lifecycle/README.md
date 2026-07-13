# @jayoncode/browser-lifecycle

Browser Lifecycle Manager is the browser lifecycle package for the JOC ecosystem.

Phase `2.2.0` has started with shared core infrastructure only. This package currently ships:

- configuration helpers
- infrastructure error types
- SSR-safe feature detection helpers
- stateless utility helpers
- public infrastructure types

It does **not** yet implement lifecycle observation, event delivery, session state management, cross-tab coordination, or plugins.

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

Current public exports:

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
- `PluginError`

Implementation follows the engineering documents and stops at Core Infrastructure for this milestone.
