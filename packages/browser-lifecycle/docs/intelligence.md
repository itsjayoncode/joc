# Intelligence & DX

Optional facades built on top of the core session. They **derive** from `getSnapshot()` and public events — they do not attach extra browser observers.

**Previous:** [Core infrastructure](./core-infrastructure.md) · **Next:** [Activity](./activity.md)

## Why opt-in factories?

```ts
createActivityApi(lifecycle); // cost starts here
```

Nothing allocates on `createBrowserLifecycle()` until you call a factory. That keeps the default session lean (ADR: zero cost when disabled).

## Import path

All intelligence factories export from `@jayoncode/browser-lifecycle` (single entry). Always `dispose()` the core session; factories do not replace teardown.

## Map

| Layer        | Factory                   | Purpose                           |
| ------------ | ------------------------- | --------------------------------- |
| Intelligence | `createActivityApi`       | Active / idle view                |
| Intelligence | `createPresenceApi`       | Page-local present / away         |
| Intelligence | `createTimelineApi`       | Bounded event history             |
| Intelligence | `createMetricsApi`        | Durations, counts, attention      |
| Intelligence | `createReportsApi`        | On-demand session summary         |
| Intelligence | `createSessionHealthApi`  | Single health snapshot            |
| Intelligence | `createSessionPredictApi` | Lightweight engagement heuristics |
| DX           | `createWaitApi`           | `await untilVisible()` etc.       |
| DX           | `createConditionsApi`     | `when.visible(() => …)`           |
| DX           | `createResilienceApi`     | Reconnect / wake / restore        |

## Rule

Core **observes** browser APIs. Intelligence and DX **interpret** only.

Continue with [Activity →](./activity.md)
