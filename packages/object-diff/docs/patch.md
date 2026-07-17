# Patching

Generate RFC 6902 JSON Patch operations and apply them to targets.

**Previous:** [Diffing](/packages/object-diff/modules/diff) · **Next:** [Serialization](/packages/object-diff/modules/serialize)

::: tip Playground
[Open Patch explorer →](/playground/object-diff/patch) — generate ops from a diff and apply them interactively.
:::

## Problem → approach

| Typical pain | Patch pipeline |
| ------------ | -------------- |
| Sending full object snapshots on every edit | `patch(diffResult)` → compact ops |
| Mutating shared state when applying updates | `applyPatch()` returns a new object by default |
| Undo needs full before/after copies | `applyPatchWithInverse` journals a faithful inverse |

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
applyPatch(
  { version: 3, name: "Ada" },
  [
    { op: "test", path: "/version", value: 3 },
    { op: "replace", path: "/name", value: "Grace" },
  ],
);
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

## Cheat sheet

```ts
patch(diffResult, { optimize?: boolean });
applyPatch(target, ops, { validate?, mutable? });
applyPatchWithInverse(target, ops);
validatePatch(ops);
optimizePatch(ops);
```

**Next:** [Serialization](/packages/object-diff/modules/serialize) — export diffs as JSON, Markdown, HTML, and more.
