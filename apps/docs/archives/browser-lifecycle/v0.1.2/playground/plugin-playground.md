---
title: Plugin Playground
description: Interactive playground documentation for Plugin Playground.
playground: /playground/browser-lifecycle/plugins
---

# Plugin Playground

The Plugin Playground demonstrates the real `@jayoncode/browser-lifecycle` plugin runtime.

## Integration

- Route: `/plugins`
- Integration layer: `src/lib/playground-plugins.ts`
- Hook: `src/features/plugins/use-plugin-playground.ts`

Plugins are registered through `createBrowserLifecycle()` and `lifecycle.use()` before `start()`. The page reads plugin diagnostics from `lifecycle.getPlugins()`, hook history from `lifecycle.getPluginHookLog()`, and public plugin events from `lifecycle.on("plugin:*")`.

## LoggerPlugin demo

`LoggerPlugin` is a built-in sample plugin that implements `onRegister`, `onStart`, `onStop`, and `onEvent`. It is not mocked — the Session Core plugin runtime executes every hook.

## Capabilities

- Installed plugin metadata and lifecycle state
- Enable / disable runtime hook execution
- Live plugin event stream (public events + hook log)
- Architecture and developer examples

## Interactive Playground

Explore this topic live in the [Plugin Playground](/playground/browser-lifecycle/plugins).
