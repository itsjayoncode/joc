# Patching

Generate RFC 6902 JSON Patch operations and apply them to targets.

**Previous:** [Diffing](/packages/object-diff/modules/diff) · **Next:** [Serialization](/packages/object-diff/modules/serialize)

::: tip Playground
[Open Patch explorer →](/playground/object-diff/patch) — generate ops from a diff and apply them interactively.
:::

## Problem → approach

| Typical pain                                              | Patch pipeline                                                                   |
| --------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Sending full object snapshots over the wire on every edit | `patch(diffResult)` → compact `add` / `remove` / `replace` ops                   |
| Mutating shared state when applying updates               | `applyPatch()` returns a new object; clone the target when you need the original |
| Undo/redo requires storing full before/after copies       | `revertPatch(operations)` generates inverse ops for a stack                      |

## Generate patch

```ts
import { diff, patch } from "@jayoncode/object-diff";

const result = diff(before, after);
const operations = patch(result);
// [{ op: "replace", path: "/name", value: "Jane" }, ...]
```

## Apply patch

```ts
import { applyPatch } from "@jayoncode/object-diff";

const updated = applyPatch(structuredClone(before), operations);
```

Always clone the target if you need to preserve the original.

## Revert changes

```ts
import { revertPatch } from "@jayoncode/object-diff";

const undoOps = revertPatch(operations);
const restored = applyPatch(structuredClone(after), undoOps);
```

## Common patterns

| Scenario           | Approach                                       |
| ------------------ | ---------------------------------------------- |
| Optimistic UI      | Apply patch locally; revert on server error    |
| Collaborative edit | Send patch ops over the wire, not full objects |
| Undo stack         | Store patches; `revertPatch` for undo          |

## Cheat sheet

```ts
patch(diffResult); // → operations
applyPatch(target, operations); // → patched object
revertPatch(operations); // → inverse ops
```

**Next:** [Serialization](/packages/object-diff/modules/serialize) — export diffs as JSON or Markdown.
