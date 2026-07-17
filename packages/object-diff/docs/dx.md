# Developer Experience

Fluent helpers, docs, and playground polish for shipped engines.

**Previous:** [Performance](/packages/object-diff/modules/performance) · **Back to:** [Overview](/packages/object-diff/overview)

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

| Import                             | Use                                               |
| ---------------------------------- | ------------------------------------------------- |
| `@jayoncode/object-diff`           | Core compare/diff/patch/serialize (compat)        |
| `@jayoncode/object-diff/core`      | Slim `diff` / `compare` / `hasChanges`            |
| `@jayoncode/object-diff/patch`     | Patch generate / apply / validate / optimize      |
| `@jayoncode/object-diff/formatter` | `serialize` + `createSerializer`                  |
| `@jayoncode/object-diff/merge`     | Merge engine                                      |
| `@jayoncode/object-diff/query`     | `find` / `filter` / `exclude` / `summary` / `query()` |
| `@jayoncode/object-diff/stats`     | `statistics`                                      |
| `@jayoncode/object-diff/plugins`   | `createEngine`                                    |
| `@jayoncode/object-diff/view`      | `createDiffView`                                  |

Full map: [Engines](/packages/object-diff/modules/engines).

## Errors

Typed `ObjectDiffError` subclasses with `code`. Prefer messages that include path when available. See `ERROR_HANDLING.md`.

## Playground

Interactive explorers cover diff, patch, serialize, performance, and examples (including fluent/view snippets).
