# 014 Visibility Playground

## Why This Document Exists

This document records the implementation shape of the Visibility Playground introduced in Phase `3.4`.

## Implemented Surface

- Route: `/visibility`
- Page: `src/pages/VisibilityPage.tsx`
- Hook: `src/features/visibility/use-visibility-playground.ts`
- Integration boundary: `src/lib/object-diff.ts`

## Architecture

```text
VisibilityPage
  -> useVisibilityPlayground()
    -> createVisibilityPlaygroundSession() in lib/object-diff.ts
      -> @jayoncode/object-diff
    -> page:visible / page:hidden listeners
    -> snapshot reads for visibility fields
```

UI components never access `document` APIs directly. All Object Diff access stays behind `src/lib/object-diff.ts`.

## User-Facing Behavior

- Creates and starts a Object Diff session when the page mounts
- Displays normalized snapshot visibility state
- Records ordered `page:visible` and `page:hidden` events
- Shows manual QA instructions for tab switching
- Degrades to a placeholder state when the visibility capability is unavailable

## Tests

- `src/lib/object-diff.test.ts` covers integration helpers and event-log formatting
