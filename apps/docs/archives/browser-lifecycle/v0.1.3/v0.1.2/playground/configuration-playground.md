---
title: Configuration Playground
description: Interactive playground documentation for Configuration Playground.
playground: http://127.0.0.1:4273/configuration
---

# Configuration Playground

The Configuration Playground demonstrates the Browser Lifecycle configuration system through `@jayoncode/browser-lifecycle`.

## Integration

- Route: `/configuration`
- Integration layer: `src/lib/playground-configuration.ts`
- Hook: `src/features/configuration/use-configuration-playground.ts`

Configuration is validated with `validateBrowserLifecycleConfig()` and applied by restarting a real Browser Lifecycle session through `createBrowserLifecycle()`.

## Capabilities

- Live resolved configuration table
- Automatic validation with issue reporting
- Built-in presets (default, performance, debug, minimal, development, production, testing, accessibility)
- Custom preset persistence in local storage
- Import, export, and configuration diff views
- Session restart workflow for applying changes

## Interactive Playground

Explore this topic live in the [Configuration Playground](http://127.0.0.1:4273/configuration).
