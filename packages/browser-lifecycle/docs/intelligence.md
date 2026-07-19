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

## Health & Predict

Two smaller facades round out the Map above — both are pure snapshot reads with no subscriptions of their own:

```ts
import { createSessionHealthApi, createSessionPredictApi } from "@jayoncode/browser-lifecycle";

const health = createSessionHealthApi(lifecycle);
health.health();
// { active, healthy, recovering, degraded, online, focused, visible, idle }

const metrics = createMetricsApi(lifecycle);
const predict = createSessionPredictApi({ lifecycle, metrics });
predict.predict();
// { likelyIdle, likelySleep, attentionScore, engagement: "low" | "medium" | "high" }
```

`createSessionHealthApi` derives a single boolean-heavy view straight from `getSnapshot()`. `createSessionPredictApi` layers a lightweight heuristic (not ML) on top of [Metrics](./metrics.md) — it requires a `metrics` instance, so create that first.

Continue with [Activity →](./activity.md)
