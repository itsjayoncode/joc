# Intelligence & DX

Optional facades on top of the core session — the **Understand** and **React** layers of Browser Lifecycle.

They **derive** from `getSnapshot()` and public events. They do **not** attach extra browser observers.

**Previous:** [Core infrastructure](./core-infrastructure.md) · **Next:** [Activity](./activity.md)

## Observe → Understand → React

| Pillar         | In this package                                  |
| -------------- | ------------------------------------------------ |
| **Observe**    | Core session + modules (always the foundation)   |
| **Understand** | Session Intelligence, Timeline, Session Insights |
| **React**      | Wait, Conditions, Resilience                     |

Core observation stays lightweight. Session intelligence and developer experience are completely opt-in — you only pay for what you use.

## Why opt-in factories?

```ts
createActivityApi(lifecycle); // cost starts here
```

Nothing allocates on `createBrowserLifecycle()` until you call a factory (ADR: zero cost when disabled).

## Import path

All factories export from `@jayoncode/browser-lifecycle` (single entry). Always `dispose()` the core session; factories do not replace teardown.

Use the **shipped** factory APIs — there is no `lifecycle.timeline()` or `lifecycle.report()` facade.

## Map

| Layer                    | Factory                   | Purpose                               |
| ------------------------ | ------------------------- | ------------------------------------- |
| **Session Intelligence** | `createActivityApi`       | Active / idle view (current state)    |
| **Session Intelligence** | `createPresenceApi`       | Page-local available / away / unknown |
| **Timeline**             | `createTimelineApi`       | Bounded chronological event history   |
| **Session Insights**     | `createMetricsApi`        | Durations, counts, attention          |
| **Session Insights**     | `createReportsApi`        | On-demand session summary             |
| **Developer Experience** | `createWaitApi`           | `await untilVisible()` etc.           |
| **Developer Experience** | `createConditionsApi`     | `when.visible(() => …)`               |
| **Developer Experience** | `createResilienceApi`     | Reconnect / wake / restore            |
| Experimental             | `createSessionHealthApi`  | Single health snapshot                |
| Experimental             | `createSessionPredictApi` | Lightweight engagement heuristics     |

**Session Insights** means in-process metrics and reports for understanding **this** browser session — not a product analytics or telemetry SDK.

**Presence** means whether **this browser session** is available, away, or unknown — not multi-user / Slack-like presence.

## Rule

Core **observes** browser APIs. Intelligence and DX **interpret** only.

## Health & Predict (experimental)

These helpers are shipped and documented, but they are **not** homepage flagships. Treat them as experimental until real-world usage proves them.

Both are pure snapshot reads with no subscriptions of their own:

```ts
import {
  createMetricsApi,
  createSessionHealthApi,
  createSessionPredictApi,
} from "@jayoncode/browser-lifecycle";

const health = createSessionHealthApi(lifecycle);
health.health();
// { active, healthy, recovering, degraded, online, focused, visible, idle }

const metrics = createMetricsApi(lifecycle);
const predict = createSessionPredictApi({ lifecycle, metrics });
predict.predict();
// { likelyIdle, likelySleep, attentionScore, engagement: "low" | "medium" | "high" }
```

`createSessionHealthApi` derives a boolean-heavy view from `getSnapshot()`. `createSessionPredictApi` layers a lightweight heuristic (not ML) on [Metrics](./metrics.md) — create `metrics` first.

Continue with [Activity →](./activity.md)
