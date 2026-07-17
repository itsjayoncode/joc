# Metrics

Live O(1) reducers over public events — session duration, focus/hidden/idle/sleep time, counts, and attention score.

**Previous:** [Timeline](./timeline.md) · **Next:** [Reports](./reports.md)

::: tip Timeline not required
Metrics never scans Timeline history (ADR A6).
:::

## Import path

```ts
import { createBrowserLifecycle, createMetricsApi } from "@jayoncode/browser-lifecycle";
```

## Usage

```ts
import { createBrowserLifecycle, createMetricsApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ idleTimeout: 30_000 });
const metrics = createMetricsApi(lifecycle);

metrics.sessionDuration();
metrics.focusedDuration();
metrics.hiddenDuration();
metrics.idleDuration();
metrics.sleepDuration();

metrics.attention().score; // 0–100
metrics.stats(); // focus/visibility/idle/reconnect/sleep counts
metrics.snapshot(); // full MetricsSnapshot

metrics.reset();
metrics.dispose();
```

## Attention score

```text
score = round(100 * focusedMs / (focusedMs + blurredMs + hiddenMs))
```

When the denominator is 0, score is `0`.

## What it tracks

Durations: session, visible, hidden, focused, blurred, active, idle, online, offline, sleep.

Counts: hidden, visibility changes, focus/blur, idle, reconnect, sleep, primary-tab switches.

[Reports →](./reports.md)
