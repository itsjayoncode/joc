# 015 Focus Playground

## Why This Document Exists

This document records the implementation shape of the Focus Playground introduced in Phase `3.5`.

## Implemented Surface

- Route: `/focus`
- Page: `src/pages/FocusPage.tsx`
- Hook: `src/features/focus/use-focus-playground.ts`
- Integration boundary: `src/lib/browser-lifecycle.ts`

## Architecture

```text
FocusPage
  -> useFocusPlayground()
    -> createFocusPlaygroundSession() in lib/browser-lifecycle.ts
      -> @jayoncode/browser-lifecycle
    -> window:focus / window:blur listeners
    -> snapshot reads for attention fields
```

UI components never access `window` or `document` APIs directly. Browser API information is read only inside `src/lib/browser-lifecycle.ts`.

## User-Facing Behavior

- Creates and starts a Browser Lifecycle session when the page mounts
- Displays normalized snapshot attention state
- Streams `window:focus` and `window:blur` events
- Maintains blur-only history with search, clear, pause, resume, and copy actions
- Documents browser API mapping and focus vs visibility differences
- Provides copy-ready developer examples using `createBrowserLifecycle()`
- Degrades to a placeholder state when the focus capability is unavailable

## Package Dependency

Phase `3.5` required the Focus module in `@jayoncode/browser-lifecycle`:

- `packages/browser-lifecycle/src/modules/focus/`
- public events: `window:focus`, `window:blur`
- snapshot field: `attention`

## Tests

- `src/lib/browser-lifecycle.test.ts` covers focus integration helpers and event-log formatting
