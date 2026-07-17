---
title: Core Infrastructure
description: Browser Lifecycle module documentation for Core Infrastructure.
playground: /playground/browser-lifecycle/configuration
---

# Core Infrastructure

This document covers the public exports introduced in Phase `2.2.0`.

## Configuration

### `createBrowserLifecycleConfig(input?)`

Validates and resolves configuration into an immutable object.

### `getDefaultBrowserLifecycleConfig()`

Returns a fresh immutable copy of the package defaults.

### `mergeBrowserLifecycleConfig(base?, override?)`

Merges two configuration objects, validates the result, and returns the resolved immutable config.

### `validateBrowserLifecycleConfig(input)`

Validates unknown input and throws `ConfigurationError` when the shape is invalid.

### `getPluginIds(config)`

Returns the configured plugin ids from a resolved configuration.

## Feature Detection

### `detectBrowserLifecycleCapabilities(environment?)`

Returns the capability snapshot used by the package's infrastructure layer.

### `supportsVisibility(environment?)`

Returns whether the environment supports the Page Visibility API.

### `supportsBroadcastChannel(environment?)`

Returns whether the environment supports `BroadcastChannel`.

### `supportsPageLifecycle(environment?)`

Returns whether the environment exposes `pagehide` and `pageshow` hooks.

### `supportsRequestIdleCallback(environment?)`

Returns whether the environment supports `requestIdleCallback`.

### `supportsAbortController(environment?)`

Returns whether the environment supports `AbortController`.

## Utilities

### `assert(condition, message)`

Throws when a condition is falsy.

### `noop()`

No-op helper for optional callbacks and defaults.

### `isBrowser()`

Returns whether the current runtime looks like a browser environment.

### `isFunction(value)`

Returns whether a value is callable.

### `isObject(value)`

Returns whether a value is a non-null object.

### `deepFreeze(value)`

Recursively freezes an object tree and returns a readonly view.

### `mergeObjects(base, override)`

Recursively merges plain objects while replacing arrays and scalar values.

## Errors

### `BrowserLifecycleError`

Base error for the public infrastructure surface.

### `ConfigurationError`

Thrown for invalid configuration input.

### `UnsupportedFeatureError`

Thrown when a required feature is unavailable.

### `InitializationError`

Thrown when initialization cannot proceed.

### `PluginError`

Placeholder plugin error for the pre-plugin milestone.

## Exported Types

The root package currently exports:

- `BrowserFeatureEnvironment`
- `BrowserLifecycleCapabilities`
- `BrowserLifecycleConfig`
- `BrowserLifecycleCrossTabConfig`
- `BrowserLifecycleCrossTabConfigInput`
- `BrowserLifecycleErrorCode`
- `BrowserLifecyclePlugin`
- `ResolvedBrowserLifecycleConfig`

## Interactive Playground

Explore this topic live in the [Core Infrastructure](/playground/browser-lifecycle/configuration-playground).
