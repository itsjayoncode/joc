# Core concepts

Terminology and data flow for `@jayoncode/object-diff`.

**Previous:** [Overview](/packages/object-diff/) · **Next:** [Tutorial](/packages/object-diff/modules/getting-started)

## Problem → approach

| Manual comparison                                                                  | With Object Diff                                    |
| ---------------------------------------------------------------------------------- | --------------------------------------------------- |
| `JSON.stringify(a) !== JSON.stringify(b)` — no paths, false positives on key order | `diff(a, b)` — typed change records with paths      |
| Hand-rolled patch objects for every API                                            | `patch(result)` — RFC 6902 operations from any diff |
| Full re-send of large state on every edit                                          | `applyPatch(target, ops)` — minimal updates         |
| Custom formatters for audit UIs                                                    | `serialize(result, "markdown" \| "json" \| …)`      |

## Snapshots and change records

```ts
const before = { user: { name: "John" }, count: 1 };
const after = { user: { name: "Jane" }, count: 1 };

const result = diff(before, after);
// result.changes[] — path, type (add|update|remove), value, oldValue
```

## API map

| API                         | Returns                   | Use when                         |
| --------------------------- | ------------------------- | -------------------------------- |
| `diff(a, b)`                | Change records + metadata | Audit, debug, UI diff viewers    |
| `hasChanges(a, b)`          | `boolean`                 | Dirty flags, skip expensive work |
| `compare(a, b)`             | Equality + path detail    | Tests                            |
| `patch(diffResult)`         | JSON Patch ops            | Network sync, undo stacks        |
| `applyPatch(target, ops)`   | New object                | Apply remote or local updates    |
| `serialize(result, format)` | String                    | Logs, exports, docs              |

## Change record fields

| Field      | Meaning                               |
| ---------- | ------------------------------------- |
| `path`     | Dot/bracket path (e.g. `user.name`)   |
| `type`     | `update`, `add`, or `remove`          |
| `value`    | Value after change                    |
| `oldValue` | Value before change (updates/removes) |

## Next steps

| Goal               | Guide                                                     |
| ------------------ | --------------------------------------------------------- |
| First integration  | [Tutorial](/packages/object-diff/modules/getting-started) |
| Diff options       | [Diffing](/packages/object-diff/modules/diff)             |
| Patch apply/revert | [Patching](/packages/object-diff/modules/patch)           |

[Diff explorer →](/playground/object-diff/diff)
