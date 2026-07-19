# Patching

Generate RFC 6902 JSON Patch operations and apply them to targets.

**Previous:** [Diffing](/packages/object-diff/modules/diff) · **Next:** [Serialization](/packages/object-diff/modules/serialize)

::: tip Playground
[Open Patch explorer →](/playground/object-diff/patch) — generate ops from a diff and apply them interactively.
:::

## Import path

```ts
import { diff, patch, applyPatch } from "@jayoncode/object-diff";
// Patch-only entry: import { patch, applyPatch } from "@jayoncode/object-diff/patch";
```

Full map: [Engines](/packages/object-diff/modules/engines).

## Problem → approach

| Typical pain                                | Patch pipeline                                      |
| ------------------------------------------- | --------------------------------------------------- |
| Sending full object snapshots on every edit | `patch(diffResult)` → compact ops                   |
| Mutating shared state when applying updates | `applyPatch()` returns a new object by default      |
| Undo needs full before/after copies         | `applyPatchWithInverse` journals a faithful inverse |

Prefer importing from `@jayoncode/object-diff/patch` when you only need the patch domain (root still re-exports for compatibility).

## Generate patch

```ts
import { diff, patch } from "@jayoncode/object-diff";
// or: import { patch } from "@jayoncode/object-diff/patch";

const result = diff(before, after, { detectMoves: true });
const operations = patch(result);
const optimized = patch(result, { optimize: true });
```

Supported ops: **`add`**, **`remove`**, **`replace`**, **`move`**, **`copy`**, **`test`**.

With `detectMoves: true`, equal remove+add pairs become `{ op: "move", from, path }`.

## `format`: `json-patch` vs `merge`

```ts
patch(result); // format defaults to "json-patch"
patch(result, { format: "json-patch" }); // add / remove / replace / move
patch(result, { format: "merge" }); // remove / replace only
```

| `format`                 | Ops emitted                        | `moved` records           |
| ------------------------ | ---------------------------------- | ------------------------- |
| `"json-patch"` (default) | `add`, `remove`, `replace`, `move` | Kept as `move` ops        |
| `"merge"`                | `remove`, `replace` only           | **Dropped** — not emitted |

`merge` format is a flatter shape for consumers that only understand set/unset semantics (no `move`/`copy`/`test`). If your diff used `detectMoves: true`, switching to `format: "merge"` silently loses the move — the moved value's `remove` half is also dropped, so re-emitting only the `replace`/`add` side would duplicate data. Use `format: "json-patch"` (the default) whenever `detectMoves` is enabled and you need a lossless patch.

## Display path → JSON Pointer

`patch()` converts each `DiffRecord.path` (dot/bracket display form, e.g. `user.tags[0]`) into an RFC 6901 JSON Pointer (`/user/tags/0`) for every operation's `path` (and `from`, for `move`):

| Display path        | JSON Pointer  |
| ------------------- | ------------- |
| `user.name`         | `/user/name`  |
| `items[0]`          | `/items/0`    |
| `items[0].id`       | `/items/0/id` |
| `a~b` (literal `~`) | `/a~0b`       |
| `a/b` (literal `/`) | `/a~1b`       |

`~` and `/` inside a segment are escaped per RFC 6901 (`~` → `~0`, `/` → `~1`) before being joined into the pointer.

## Unsafe path segments are rejected

`patch()`, `applyPatch()`, and `validatePatch()` all reject the segments `__proto__`, `constructor`, and `prototype` — whether they appear in a `DiffRecord.path` being converted or in a raw JSON Pointer being applied/validated. Any of these raises `InvalidPatchError` before any mutation happens, closing off prototype-pollution vectors from untrusted diffs or patches:

```ts
applyPatch({}, [{ op: "add", path: "/__proto__/polluted", value: true }]);
// throws InvalidPatchError: Unsafe path segment "__proto__" is not allowed.
```

## Apply / validate / optimize

```ts
import {
  applyPatch,
  applyPatchWithInverse,
  validatePatch,
  optimizePatch,
} from "@jayoncode/object-diff";

validatePatch(operations); // throws InvalidPatchError
const next = applyPatch(before, operations);

const { value, inverse } = applyPatchWithInverse(before, operations);
applyPatch(value, inverse); // restore

optimizePatch(operations); // coalesce sequential replaces, etc.
```

`applyPatch` validates by default (`{ validate: false }` to skip). Use `{ mutable: true }` only when you intentionally mutate the target.

## Conditional apply (`test`)

```ts
applyPatch({ version: 3, name: "Ada" }, [
  { op: "test", path: "/version", value: 3 },
  { op: "replace", path: "/name", value: "Grace" },
]);
// throws PatchApplyError if version !== 3
```

## Copy and move

```ts
applyPatch({ a: 1 }, [{ op: "copy", from: "/a", path: "/b" }]);
// → { a: 1, b: 1 }

applyPatch({ a: 1 }, [{ op: "move", from: "/a", path: "/b" }]);
// → { b: 1 }
```

## Revert

```ts
import { revertPatch } from "@jayoncode/object-diff";

// Structural inverse — prefer applyPatchWithInverse when you need faithful undo of replaces/removes
const restored = revertPatch(after, operations);
```

### `revertPatch` is lossy — prefer `applyPatchWithInverse`

`revertPatch` inverts a patch **structurally**, without ever having seen the pre-apply values:

- `add` → inverted to `remove` (safe — nothing to restore, the key should not exist).
- `remove` → inverted to `add` with value **`undefined`** (the original removed value was never captured, so it cannot be restored).
- `replace` → inverted to `replace` with value **`undefined`** — **not** the pre-replace value, and not even the forward value; the key ends up set to `undefined`.
- `move` → inverted to swap `from`/`path` (safe, no data loss).
- `copy` → inverted to `remove` at the copy destination (safe).
- `test` → dropped (no-op).

In practice this means calling `revertPatch(after, operations)` on a patch containing `remove` or `replace` ops will **not** restore `before` — both end up with the affected key set to `undefined` instead of its original value. Only use `revertPatch` when your patch is limited to `add`/`move`/`copy`, or when leaving affected keys as `undefined` is acceptable.

For faithful undo, capture the inverse **while applying** instead:

```ts
import { applyPatch, applyPatchWithInverse } from "@jayoncode/object-diff";

const { value, inverse } = applyPatchWithInverse(before, operations);
const restored = applyPatch(value, inverse);
// restored deep-equals `before` — inverse journaled the real previous values
```

## Cheat sheet

```ts
patch(diffResult, { format?: "json-patch" | "merge", optimize?: boolean });
applyPatch(target, ops, { validate?, mutable? });
applyPatchWithInverse(target, ops);
validatePatch(ops);
optimizePatch(ops);
```

**Next:** [Serialization](/packages/object-diff/modules/serialize) — export diffs as JSON, Markdown, HTML, and more.
