# Timeline

Record a bounded history of public lifecycle events (Session Timeline / Event Timeline).

**Previous:** [Presence](./presence.md) · **Next:** [Metrics](./metrics.md)

## Usage

```ts
import { createBrowserLifecycle, createTimelineApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();
const timeline = createTimelineApi(lifecycle, { maxEvents: 200 });

timeline.events(); // structured entries
timeline.record(); // alias of events()
timeline.format(); // ["10:05:42 page:hidden", ...]

timeline.clear();
timeline.dispose();
```

## Rules

- `maxEvents` is **required** (hard cap; drop oldest).
- Does not require Metrics.
- Set `includeSnapshot: false` to store only type + timestamp.

[Metrics →](./metrics.md)
