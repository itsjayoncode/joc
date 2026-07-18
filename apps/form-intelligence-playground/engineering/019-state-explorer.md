# Engineering Note 019 — State Explorer

## Scope

Phase 3.12 adds `/state` for runtime snapshot inspection.

## Playground changes

- `src/lib/playground-state.ts`
- `src/features/state/use-state-explorer.ts`
- `src/pages/StatePage.tsx`

## Design rules

- Snapshots come from `lifecycle.getSnapshot()` and `lifecycle.subscribe()`
- History, diffing, and JSON formatting are playground-only concerns
- No simulated or duplicated session state
