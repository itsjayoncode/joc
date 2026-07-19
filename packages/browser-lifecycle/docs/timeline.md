# Timeline

Record a bounded history of public lifecycle events (Session Timeline / Event Timeline).

**Previous:** [Presence](./presence.md) · **Next:** [Metrics](./metrics.md)

## Import path

```ts
import { createBrowserLifecycle, createTimelineApi } from "@jayoncode/browser-lifecycle";
```

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

- `maxEvents` is **required** (hard cap; drop oldest, O(1)).
- Does not require Metrics.
- Set `includeSnapshot: false` to store only type + timestamp.

## Overflow

```ts
const timeline = createTimelineApi(lifecycle, {
  maxEvents: 200,
  onOverflow: (dropped) => console.debug("dropped", dropped.type),
});
```

`onOverflow` fires once per entry evicted when the buffer is full — useful for detecting an undersized `maxEvents` in development.

## `format()` options

```ts
timeline.format({ locale: "en-GB", timeZone: "UTC" });
```

| Option     | Type     | Default                   |
| ---------- | -------- | ------------------------- |
| `locale`   | `string` | Runtime default locale    |
| `timeZone` | `string` | Runtime default time zone |

Both are passed straight through to `Date.prototype.toLocaleTimeString()` for each entry.

[Metrics →](./metrics.md)
