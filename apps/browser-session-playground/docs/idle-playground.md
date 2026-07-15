# Idle Playground

Route: `/idle`

Demonstrates the Idle module via `createBrowserLifecycle({ idleTimeout })` through `src/lib/playground-idle.ts`.

- Idle timer with countdown and progress
- User activity history from `activity:detected` / `activity:reset`
- Live `session:active` / `session:idle` stream
- Configurable timeout presets (10s, 30s, 1m, 5m)
