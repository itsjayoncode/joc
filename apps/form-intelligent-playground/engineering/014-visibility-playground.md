# 014 Visibility Playground

## Why This Document Exists

This document records the implementation shape of the Visibility Playground introduced in Phase `3.4`.

## Implemented Surface

- Route: `/visibility`
- Page: `src/pages/VisibilityPage.tsx`
- Hook: `src/features/visibility/use-visibility-playground.ts`
- Integration boundary: `src/lib/form-intelligent.ts`

## Architecture

```text
VisibilityPage
  -> useVisibilityPlayground()
    -> createVisibilityPlaygroundSession() in lib/form-intelligent.ts
      -> @jayoncode/form-intelligent
    -> page:visible / page:hidden listeners
    -> snapshot reads for visibility fields
```

UI components never access `document` APIs directly. All Form Intelligent access stays behind `src/lib/form-intelligent.ts`.

## User-Facing Behavior

- Creates and starts a Form Intelligent session when the page mounts
- Displays normalized snapshot visibility state
- Records ordered `page:visible` and `page:hidden` events
- Shows manual QA instructions for tab switching
- Degrades to a placeholder state when the visibility capability is unavailable

## Tests

- `src/lib/form-intelligent.test.ts` covers integration helpers and event-log formatting
