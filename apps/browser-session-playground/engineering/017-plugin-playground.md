# Engineering Note 017 — Plugin Playground

## Scope

Phase 3.10 adds `/plugins` to the Browser Session Playground and implements a real plugin runtime in `@jayoncode/browser-lifecycle`.

## Package changes

- Extended `BrowserLifecyclePlugin` with lifecycle hooks and metadata
- Added `PluginRuntime` under `packages/browser-lifecycle/src/plugins/`
- Session Core now executes hooks and emits `plugin:registered`, `plugin:removed`, and `plugin:error`
- Added `getPlugins()`, `getPluginHookLog()`, and `setPluginEnabled()` on `BrowserLifecycle`

## Playground changes

- `src/lib/playground-plugins.ts`
- `src/features/plugins/use-plugin-playground.ts`
- `src/pages/PluginsPage.tsx`

## Verification

- Plugin registration occurs only before `start()`
- Plugin lifecycle transitions are visible through `getPlugins()`
- Hook execution is visible through `getPluginHookLog()`
- Public plugin events flow through the normal event API
