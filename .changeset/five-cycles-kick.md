---
"@jayoncode/browser-lifecycle": minor
---

Add opt-in Intelligence and DX factories so apps can pause work, measure attention, and recover from reconnects without wiring extra DOM listeners.

- Intelligence: `createActivityApi`, `createPresenceApi`, `createTimelineApi`, `createMetricsApi`, `createReportsApi`, plus optional health/predict helpers
- DX: `createWaitApi`, `createConditionsApi`, `createResilienceApi` (including reconnect/wake helpers)
- Zero cost until imported — `createBrowserLifecycle()` stays lean by default