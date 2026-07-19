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

All thrown errors extend `ObjectDiffError` (itself an `Error`), carrying a machine-readable `code` and optional `details`:

```ts
import { ObjectDiffError } from "@jayoncode/object-diff";

try {
  diff(circularA, circularB); // circular: "error" (default)
} catch (error) {
  if (error instanceof ObjectDiffError) {
    error.code; // e.g. "circular_reference"
    error.details; // e.g. { path: "user.self" }
    error.cause; // original cause, when the error wraps another (e.g. PluginError)
  }
}
```

| Class                    | `code`               | Thrown by                                                                                                                     |
| ------------------------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `CircularReferenceError` | `circular_reference` | `diff`/`compare` when a repeated reference is found and `circular: "error"` (default)                                         |
| `MaxDepthExceededError`  | `max_depth_exceeded` | `diff`/`compare` when traversal depth exceeds `maxDepth`                                                                      |
| `InvalidPatchError`      | `invalid_patch`      | `patch`, `applyPatch`, `validatePatch` on malformed ops or unsafe path segments (`__proto__`, `constructor`, `prototype`)     |
| `PatchApplyError`        | `patch_apply_error`  | `applyPatch` when a `test` op fails, or a path cannot be resolved on the target                                               |
| `InvalidOptionsError`    | `invalid_options`    | Duplicate `identityKey` ids, unknown `serialize` format or `merge` strategy names, duplicate/colliding formatter plugin names |
| `UnsupportedTypeError`   | `unsupported_type`   | Reserved for value kinds the core cannot classify (currently unused by shipped code paths)                                    |
| `NotImplementedError`    | `not_implemented`    | Reserved for stubbed/future functionality                                                                                     |
| `PluginError`            | `plugin_error`       | `/plugins` `createEngine` — duplicate/invalid plugin shape, or a hook callback throwing (original error is `cause`)           |

All error classes are exported from the root entry, `/core`, and their owning subpath (e.g. `PluginError` from `/plugins`).

## Playground

Interactive explorers cover diff, patch, serialize, performance, and examples (including fluent/view snippets).
