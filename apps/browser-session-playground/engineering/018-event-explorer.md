# Engineering Note 018 — Event Explorer

## Scope

Phase 3.11 adds `/events` and a client-side explorer over the Browser Lifecycle `subscribe()` feed.

## Playground changes

- `src/lib/playground-events.ts` for formatting, filtering, and export helpers
- `src/features/events/use-event-explorer.ts` for session wiring
- `src/pages/EventsPage.tsx` for the debugging UI

## Design rules

- Browser Lifecycle remains the single source of truth
- No mocked or synthetic event generation
- Filtering, search, and export are playground-only concerns

## Verification

- `lifecycle.subscribe()` drives the live stream
- Event cap of 1,000 records with dropped-event accounting
- Selected event exposes metadata and full payload JSON
