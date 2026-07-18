# 014 Visibility Playground

## Why This Document Exists

This document records the implementation shape of the Visibility Playground introduced in Phase `3.4`.

## Implemented Surface

- Route: `/visibility`
- Page: `src/pages/VisibilityPage.tsx`
- Hook: `src/features/visibility/use-visibility-playground.ts`
- Integration boundary: `src/lib/form-intelligence.ts`

## Architecture

```text
VisibilityPage
  -> useVisibilityPlayground()
    -> createVisibilityPlaygroundSession() in lib/form-intelligence.ts
      -> @jayoncode/form-intelligence
    -> page:visible / page:hidden listeners
    -> snapshot reads for visibility fields
```

UI components never access `document` APIs directly. All Form Intelligence access stays behind `src/lib/form-intelligence.ts`.

## User-Facing Behavior

- Creates and starts a Form Intelligence session when the page mounts
- Displays normalized snapshot visibility state
- Records ordered `page:visible` and `page:hidden` events
- Shows manual QA instructions for tab switching
- Degrades to a placeholder state when the visibility capability is unavailable

## Tests

- `src/lib/form-intelligence.test.ts` covers integration helpers and event-log formatting
