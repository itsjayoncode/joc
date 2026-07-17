# Reports

Turn Metrics (and optional Timeline evidence) into an on-demand session summary.

**Previous:** [Metrics](./metrics.md) · **Next:** [Wait helpers](./wait.md)

## Import path

```ts
import {
  createBrowserLifecycle,
  createMetricsApi,
  createReportsApi,
  createTimelineApi,
} from "@jayoncode/browser-lifecycle";
```

## Usage

```ts
import {
  createBrowserLifecycle,
  createMetricsApi,
  createReportsApi,
  createTimelineApi,
} from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ idleTimeout: 30_000 });
const metrics = createMetricsApi(lifecycle);
const timeline = createTimelineApi(lifecycle, { maxEvents: 100 });
const reports = createReportsApi({ metrics, timeline });

const summary = reports.report();
// summary.focusDuration, hiddenDuration, idleDuration, attention, highlights, …

console.log(summary.highlights);
```

## Notes

- No subscriptions of its own — work happens only when you call `report()` / `sessionSummary()`.
- Timeline is optional; when provided, recent entry ids can appear as `evidenceEventIds`.

[Wait helpers →](./wait.md)
