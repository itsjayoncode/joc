---
title: Dx
description: Object Diff documentation for Dx.
---

# Developer Experience

Fluent DiffView toolbox — explain, filter, serialize, patch, and stats over a `DiffResult` without mutating `diff()` output.

**Previous:** [Serialization](/packages/object-diff/modules/serialize) · **Next:** [Engines](/packages/object-diff/modules/engines) · **Back to:** [Overview](/packages/object-diff/overview)

## Import path

```ts
import { diff } from "@jayoncode/object-diff";
import { createDiffView } from "@jayoncode/object-diff/view";
```

`createDiffView` is **`/view` only** (not on root). Canonical map: [Engines](/packages/object-diff/modules/engines).

## Why DiffView?

| Need                                            | Use                      |
| ----------------------------------------------- | ------------------------ |
| Plain data for storage / wire                   | `diff()` → `DiffResult`  |
| Review, filter, explain, patch from that result | `createDiffView(result)` |

`DiffResult` stays serializable data. DiffView is the **developer toolbox** on top — same architecture lock as the package ADR (no methods attached to `diff()` return values).

## Fluent API

```ts
import { diff } from "@jayoncode/object-diff";
import { createDiffView } from "@jayoncode/object-diff/view";

const view = createDiffView(diff(before, after, { detectMoves: true }))
  .exclude(["password"])
  .updated();

view.serialize("markdown");
view.patch();
view.statistics();
view.explain(); // structured DiffExplanation[]
view.explain({ format: "human" }); // review text
```

- Free functions remain canonical (`diff`, `serialize`, `patch`, …)
- `createDiffView` is opt-in on `/view` (tree-shake friendly)
- Chaining returns new views — the source `DiffResult` is never mutated

## `explain()`

Turn change records into review-friendly explanations (especially moves / identity):

```ts
const result = diff(before, after, { identityKey: "id", detectMoves: true });
const view = createDiffView(result);

view.explain({ identityKey: "id" });
// [
//   {
//     path: "[2]",
//     type: "moved",
//     reason: "Matched using identityKey 'id'",
//     confidence: "high",
//     summary: "item moved",
//     from: "[0]",
//   },
//   {
//     path: "name",
//     type: "changed",
//     reason: "Primitive value changed",
//     confidence: "high",
//     summary: "`name` updated",
//     previous: "John",
//     current: "Johnny",
//   },
// ]

view.explain({ format: "human", identityKey: "id" });
// ✓ item moved
//   index 0 → 2
//   matched using id
//
// ✓ name updated
//   John → Johnny
```

| Option        | Default        | Meaning                                                                      |
| ------------- | -------------- | ---------------------------------------------------------------------------- |
| `format`      | `"structured"` | `"structured"` → `DiffExplanation[]`; `"human"` → string                     |
| `identityKey` | —              | Property name hint when the diff used identity matching (improves move copy) |

`DiffResult` does not store the options used to produce it — pass `identityKey` again when you want identity-aware wording.

Prefer `explain({ format: "human" })` for reviews; keep `serialize("human")` for compact changelog-style bullets.

## Subpath map

Canonical table: [Engines](/packages/object-diff/modules/engines).

| Import                         | Use                           |
| ------------------------------ | ----------------------------- |
| `@jayoncode/object-diff/view`  | `createDiffView` + `explain`  |
| `@jayoncode/object-diff/stats` | `statistics`                  |
| `@jayoncode/object-diff/query` | `find` / `filter` / `query()` |

## Pitfalls

- Do not expect `createDiffView` on the root entry.
- Free functions remain canonical; the view does not mutate DiffResults.
- `explain({ identityKey })` is a **hint for wording**, not a re-diff — run `diff(..., { identityKey })` first.

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

Interactive Lab tabs cover **Moves**, **Patch** (apply/revert), **Merge** conflicts, **Explain** (`view.explain()`), and Perf (`hasChanges` vs full `diff`). Open the [Array Reorder](/playground/object-diff/) experiment to jump straight into moves + explain.

[Open Object Diff Lab →](/playground/object-diff/)
