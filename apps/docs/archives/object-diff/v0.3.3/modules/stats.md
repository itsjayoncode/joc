---
title: Stats
description: Object Diff documentation for Stats.
---

# Statistics

Rich metrics derived from an existing `DiffResult` (and optionally a `Patch`) — for dashboards, telemetry, and change-size budgets.

**Previous:** [Query](/packages/object-diff/modules/query) · **Next:** [Plugins](/packages/object-diff/modules/plugins)

## Import path

```ts
import { statistics, pathDepth } from "@jayoncode/object-diff/stats";
```

**Not** on the root entry — [Engines](/packages/object-diff/modules/engines). `/stats` never re-runs `diff`; it only reads an existing `DiffResult`.

## Problem → approach

| Typical pain                                                | `statistics()`                                                           |
| ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| No signal on _how big_ or _how deep_ a diff is              | `totalChanges`, `maxDepth`, `changedRatio` in one call                   |
| Guessing patch payload size before sending it over the wire | `estimatedPatchSize` — exact when you pass your own `Patch`              |
| Finding which part of the object changed the most           | `hotPrefixes` — top-level (or top-included) paths ranked by change count |

## Quick example

```ts
import { diff, patch } from "@jayoncode/object-diff";
import { statistics } from "@jayoncode/object-diff/stats";

const result = diff(before, after, { detectMoves: true });
const stats = statistics(result);

stats.totalChanges; // meaningful (non-unchanged) change count
stats.changedRatio; // 0–1, share of meaningful changes among all records seen
stats.hotPrefixes; // [{ prefix: "user", count: 3 }, ...] — top 5 by default
```

## `statistics(result, patch?, options?)`

```ts
function statistics(result: DiffResult, patch?: Patch, options?: StatisticsOptions): DiffStatistics;

interface StatisticsOptions {
  readonly hotPrefixLimit?: number; // default 5
}
```

Passing the `Patch` you already generated (from `patch(result)`) makes `estimatedPatchSize` exact instead of estimated:

```ts
const ops = patch(result);
const exact = statistics(result, ops); // estimatedPatchSize === JSON.stringify(ops).length
const estimated = statistics(result); // estimatedPatchSize derived from add/remove/replace inferred from changes (no move/copy/test)
```

## `DiffStatistics` fields

| Field                | Type                   | Meaning                                                                                                                                |
| -------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `totalChanges`       | `number`               | Count of non-`unchanged` records in `result.changes`                                                                                   |
| `changedRatio`       | `number` (0–1)         | `totalChanges / (totalChanges + unchangedCount)`; `0` when there are no records at all                                                 |
| `objectChangeCount`  | `number`               | Meaningful changes whose path has no `[N]` array index segment                                                                         |
| `arrayChangeCount`   | `number`               | Meaningful changes whose path contains at least one `[N]` array index segment                                                          |
| `deepestPath`        | `string \| null`       | Display path with the greatest [`pathDepth`](#pathdepth-path) among meaningful changes, or `null` if there are none                    |
| `maxDepth`           | `number`               | Depth of `deepestPath` (`0` when there are no meaningful changes)                                                                      |
| `moveCount`          | `number`               | Number of `moved` records                                                                                                              |
| `estimatedPatchSize` | `number`               | Byte length of `JSON.stringify(...)` — of your `patch` argument if provided, otherwise an inferred `add`/`remove`/`replace`-only patch |
| `hotPrefixes`        | `readonly HotPrefix[]` | Top path prefixes by change count, `{ prefix, count }[]`, sorted by count desc then prefix asc                                         |

`changedRatio` is computed from records actually present in `result.changes`, not from `result.metadata.unchangedCount`. Since `diff()` drops `unchanged` records by default, `changedRatio` is `1` whenever there is at least one change. To get a meaningful ratio below `1`, diff with `{ includeUnchanged: true }` so unchanged records are included in `result.changes` for `statistics()` to count.

## `hotPrefixLimit` (default `5`)

`hotPrefixes` groups meaningful changes by their **first path segment** (e.g. `user.name` and `user.role` both count under prefix `user`; `items[0].id` counts under prefix `items`), then returns the top N by count:

```ts
statistics(result, undefined, { hotPrefixLimit: 10 });
statistics(result, undefined, { hotPrefixLimit: 0 }); // → []
```

Ties are broken alphabetically by prefix so output is deterministic across runs.

## `pathDepth(path)`

Exported standalone for reuse outside `statistics()`. Counts path segments in the display-path form (`.` and `[N]` both count as one segment each):

```ts
import { pathDepth } from "@jayoncode/object-diff/stats";

pathDepth(""); // 0
pathDepth("user"); // 1
pathDepth("user.name"); // 2
pathDepth("items[0].id"); // 3
```

## Pitfalls

- `statistics()` never calls `diff()` — it only reads the `DiffResult` you already have. Re-diff first if your snapshots changed.
- `estimatedPatchSize` without a `patch` argument ignores `move`/`copy`/`test` ops (the estimator only synthesizes `add`/`remove`/`replace`) — pass the real `Patch` for an exact, move-aware size.
- `hotPrefixes` groups by the _first_ segment only, not full ancestry — deeply nested changes under different second-level keys still collapse into the same top-level prefix.

## Related

- [Plugins](/packages/object-diff/modules/plugins) · [Query](/packages/object-diff/modules/query) · [Patching](/packages/object-diff/modules/patch)
- [DX / `createDiffView`](/packages/object-diff/modules/dx) exposes `.statistics()` on the fluent wrapper
