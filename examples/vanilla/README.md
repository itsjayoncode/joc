# Vanilla TypeScript Example

Official reference for integrating `@jayoncode/browser-lifecycle` without a framework.

## Install

```bash
pnpm add @jayoncode/browser-lifecycle
```

## Run

```bash
pnpm install
pnpm start
```

## Architecture

- `src/main.ts` creates one Browser Lifecycle session
- `src/session.ts` owns lifecycle setup and cleanup
- UI updates subscribe through `lifecycle.subscribe()`

## Features demonstrated

- Session initialization and cleanup
- Visibility, focus, connectivity, idle, lifecycle, and cross-tab events
- Typed event subscriptions

## Notes

Construction documents may refer to `createBrowserSession()`. The canonical API is `createBrowserLifecycle()`.
