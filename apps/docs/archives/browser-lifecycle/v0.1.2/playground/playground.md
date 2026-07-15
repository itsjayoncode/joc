---
title: Playground Dashboard
description: Interactive playground documentation for Playground Dashboard.
playground: http://127.0.0.1:4273/
---

# Playground Foundation

## Purpose

The Browser Session Playground is the long-lived engineering shell for Browser Lifecycle.

It is not a one-off demo. It is the workspace where future module pages will be developed, validated, and documented.

## Architecture

The foundation separates responsibilities across:

- `app/`: bootstrap and provider composition
- `layouts/`: shell structure
- `pages/`: route screens
- `components/`: reusable UI pieces
- `providers/` and `contexts/`: theme and shell state
- `routes/`: route organization
- `services/`: persistence helpers
- `lib/`: Browser Lifecycle integration boundary
- `constants/`, `types/`, `utils/`: static models and helpers

This keeps application UI concerns separate from Browser Lifecycle runtime concerns.

## Technology Choices

- React
- TypeScript
- Vite
- React Router
- Vitest
- CSS Modules

CSS Modules were chosen over Tailwind to keep the foundation lightweight, avoid extra styling dependencies, and preserve a clear component-to-style ownership model.

## Routing

Foundation routes:

- `/`
- `/visibility`
- `/focus`
- `/connectivity`
- `/idle`
- `/lifecycle`
- `/cross-tab`
- `/about`
- `/settings`
- `/not-found`

The visibility route is the first live Browser Lifecycle module page. It creates a session through `src/lib/browser-lifecycle.ts`, reads snapshot visibility state, and records ordered `page:visible` / `page:hidden` events without using `document` APIs in UI components.

The focus route demonstrates normalized attention state, blur history, and `window:focus` / `window:blur` events through the same integration boundary.

The connectivity route demonstrates advisory online/offline state, reconnect cycles, and `connection:*` events through the same integration boundary.

The cross-tab route demonstrates leader election, tab messages, and `tab:*` events through the same integration boundary.

The plugins route demonstrates real plugin registration, lifecycle hooks, plugin diagnostics, and `plugin:*` events through `getPlugins()` and `getPluginHookLog()`.

The events route subscribes to the full Browser Lifecycle public feed through `lifecycle.subscribe()` for live debugging, filtering, and export.

The state route inspects live snapshots through `getSnapshot()` and `subscribe()` with history, module cards, and diff tooling.

The configuration route validates and applies Browser Lifecycle configuration through `validateBrowserLifecycleConfig()` and session restart.

The navigation model still reserves future routes for:

- `configuration`

## Theme System

The app supports:

- `light`
- `dark`
- `system`

Theme preference is persisted and applied through `data-theme` on the document root.

## Layout

The shell includes:

- Header
- Sidebar
- Content area
- Status bar
- Footer
- Page container primitive

It is responsive by default and supports a compact sidebar mode for dense engineering workflows.

## Component Standards

Shared components in this phase stay:

- small
- typed
- composable
- accessible
- single-purpose

The shell uses reusable primitives such as `Card` and `PageContainer` so future module pages can inherit the same structure without duplicating layout logic.

## Development Workflow

Recommended commands:

```bash
npx pnpm@10.13.1 --filter @jayoncode/browser-session-playground dev
npx pnpm@10.13.1 --filter @jayoncode/browser-session-playground build
npx pnpm@10.13.1 --filter @jayoncode/browser-session-playground test
```

## Interactive Playground

Explore this topic live in the [Playground Dashboard](http://127.0.0.1:4273/).

