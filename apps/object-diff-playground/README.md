# Object Diff Playground

The Object Diff Playground is the official Object Diff engineering shell inside the JOC monorepo.

It is designed to become the shared environment for:

- development
- manual QA
- integration testing
- interactive documentation
- product showcase scenarios

## Visibility Playground (Phase 3.4)

Route: `/visibility`

- live Object Diff session wiring through `src/lib/object-diff.ts`
- snapshot visibility inspection
- ordered `page:visible` / `page:hidden` event log
- graceful degradation when Page Visibility is unavailable

## Focus Playground (Phase 3.5)

Route: `/focus`

- live Object Diff session wiring through `src/lib/object-diff.ts`
- snapshot attention inspection
- live `window:focus` / `window:blur` stream and blur-only history
- browser API mapping and focus vs visibility guidance
- copy-ready developer examples
- graceful degradation when window focus is unavailable

## Connectivity Playground (Phase 3.6)

Route: `/connectivity`

- live Object Diff session wiring through `src/lib/object-diff.ts`
- snapshot connectivity inspection
- reconnect timeline with `connection:online`, `connection:offline`, and `connection:reconnect`
- offline-only history with search, clear, pause, resume, and copy
- browser API mapping and `navigator.onLine` limitations
- Network Information API display when supported
- copy-ready developer examples
- graceful degradation when advisory connectivity is unavailable

## Idle Playground (Phase 3.7)

Route: `/idle`

- idle timer configuration and activity heuristics
- `session:active`, `session:idle`, `activity:detected`, and `activity:reset` events

## Lifecycle Playground (Phase 3.8)

Route: `/lifecycle`

- page lifecycle transitions (`page:suspend`, `page:resume`, `session:restored`)
- freeze and resume counters with browser compatibility matrix

## Cross Tab Playground (Phase 3.9)

Route: `/cross-tab`

- leader election, tab messages, and `tab:*` events
- BroadcastChannel requirement with graceful fallback

## Plugin Playground (Phase 3.10)

Route: `/plugins`

- real plugin runtime through `@jayoncode/object-diff`
- installed plugin diagnostics via `getPlugins()`
- hook execution history via `getPluginHookLog()`
- live `plugin:*` events and LoggerPlugin demo

## Event Explorer (Phase 3.11)

Route: `/events`

- full public event stream through `lifecycle.subscribe()`
- search, category filters, payload inspection, and export

## State Explorer (Phase 3.12)

Route: `/state`

- live snapshot inspection through `getSnapshot()` and `subscribe()`
- module state cards, snapshot history, and diff viewer

## Configuration Playground (Phase 3.13)

Route: `/configuration`

- validated configuration editing through `validateBrowserLifecycleConfig()`
- presets, import/export, and session restart apply workflow

## Performance Playground (Phase 3.14)

Route: `/performance`

- runtime diagnostics via `getRuntimeDiagnostics()`
- live dispatch timing from `subscribe()`

## Developer Tools (Phase 3.15)

Route: `/developer-tools`

- debug mode, browser API inspector, module inspector, and runtime trace logs

## Commands

```bash
npx pnpm@10.13.1 --filter @jayoncode/object-diff-playground dev
npx pnpm@10.13.1 --filter @jayoncode/object-diff-playground build
npx pnpm@10.13.1 --filter @jayoncode/object-diff-playground preview
npx pnpm@10.13.1 --filter @jayoncode/object-diff-playground test
```

## Release v1.0.0

- [RELEASE_NOTES.md](./RELEASE_NOTES.md)
- [CHANGELOG.md](./CHANGELOG.md)
- [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)
- [docs/deployment.md](./docs/deployment.md)
- [engineering/023-playground-release.md](./engineering/023-playground-release.md)

## Documentation

- [docs/playground.md](./docs/playground.md)
- [engineering/000-playground-foundation.md](./engineering/000-playground-foundation.md)
- [engineering/014-visibility-playground.md](./engineering/014-visibility-playground.md)
- [docs/focus-playground.md](./docs/focus-playground.md)
- [engineering/015-focus-playground.md](./engineering/015-focus-playground.md)
- [docs/connectivity-playground.md](./docs/connectivity-playground.md)
- [engineering/016-connectivity-playground.md](./engineering/016-connectivity-playground.md)
- [docs/plugin-playground.md](./docs/plugin-playground.md)
- [engineering/017-plugin-playground.md](./engineering/017-plugin-playground.md)
- [docs/event-explorer.md](./docs/event-explorer.md)
- [engineering/018-event-explorer.md](./engineering/018-event-explorer.md)
- [docs/state-explorer.md](./docs/state-explorer.md)
- [engineering/019-state-explorer.md](./engineering/019-state-explorer.md)
- [docs/configuration-playground.md](./docs/configuration-playground.md)
- [engineering/020-configuration-playground.md](./engineering/020-configuration-playground.md)
