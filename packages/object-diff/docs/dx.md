# Developer Experience

Fluent helpers, docs, and playground polish for shipped engines.

**Previous:** [Performance](/packages/object-diff/modules/performance) · **Back to:** [Overview](/packages/object-diff/overview)

## Import path

```ts
import { diff } from "@jayoncode/object-diff";
import { createDiffView } from "@jayoncode/object-diff/view";
```

`createDiffView` is **`/view` only** (not on root). Canonical map: [Engines](/packages/object-diff/modules/engines).

## Fluent API (ADR 0006)

```ts
import { diff } from "@jayoncode/object-diff";
import { createDiffView } from "@jayoncode/object-diff/view";

const view = createDiffView(diff(before, after)).exclude(["password"]).updated();

view.serialize("markdown");
view.patch();
view.statistics();
```

- Free functions remain canonical
- `createDiffView` is opt-in on `/view` (not on root — tree-shaking)
- Does not attach methods onto `diff()` return values

## Subpath map

Prefer linking here rather than duplicating forever — canonical table: [Engines](/packages/object-diff/modules/engines).

| Import                         | Use                           |
| ------------------------------ | ----------------------------- |
| `@jayoncode/object-diff/view`  | `createDiffView`              |
| `@jayoncode/object-diff/stats` | `statistics`                  |
| `@jayoncode/object-diff/query` | `find` / `filter` / `query()` |

## Pitfalls

- Do not expect `createDiffView` on the root entry.
- Free functions remain canonical; the view does not mutate DiffResults.

## Errors

Typed `ObjectDiffError` subclasses with `code`. Prefer messages that include path when available. See `ERROR_HANDLING.md`.

## Playground

Interactive explorers cover diff, patch, serialize, performance, and examples (including fluent/view snippets).
