# Core concepts

Terminology and data flow for `@jayoncode/object-diff`.

**Previous:** [Overview](/packages/object-diff/overview) · **Next:** [Tutorial](/packages/object-diff/modules/getting-started)

## Glossary

| Term           | Meaning                                                                             |
| -------------- | ----------------------------------------------------------------------------------- |
| **Change**     | One typed record from `diff()` (`path`, `type`, values)                             |
| **DiffResult** | `{ changes, metadata }` returned by `diff`                                          |
| **Patch**      | RFC 6902 operations derived from a DiffResult (`patch()`)                           |
| **Merge**      | Combine two/three snapshots with strategy + conflicts (`/merge`)                    |
| **Query**      | Filter/summarize an existing DiffResult without re-diffing (`/query`)               |
| **View**       | Fluent toolbox over a DiffResult — `explain` / filter / serialize / patch (`/view`) |

## Problem → approach

| Manual comparison                                                                  | With Object Diff                                      |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `JSON.stringify(a) !== JSON.stringify(b)` — no paths, false positives on key order | `diff(a, b)` — typed change records with paths        |
| Hand-rolled patch objects for every API                                            | `patch(result)` — RFC 6902 operations from any diff   |
| Full re-send of large state on every edit                                          | `applyPatch(target, ops)` — minimal updates           |
| Custom formatters for audit UIs                                                    | `createDiffView(result).explain()` / `serialize(...)` |

## Snapshots and change records

```ts
import { diff } from "@jayoncode/object-diff";

const before = { user: { name: "John" }, count: 1 };
const after = { user: { name: "Jane" }, count: 1 };

const result = diff(before, after);
// result.changes[] — { path, type, previous?, current?, from? }
// result.metadata — counts including movedCount
```

## Change record fields

| Field      | Meaning                                                            |
| ---------- | ------------------------------------------------------------------ |
| `path`     | Display path (e.g. `user.name`, `items[0]`)                        |
| `type`     | `added` \| `removed` \| `changed` \| `unchanged` \| `moved`        |
| `previous` | Value before the change — key is omitted entirely when `undefined` |
| `current`  | Value after the change — key is omitted entirely when `undefined`  |
| `from`     | Source path when `type` is `moved`                                 |

## Equality & supported types

`diff()`/`compare()` go well beyond `JSON.stringify` equality: `Object.is` semantics for primitives (`NaN` equals `NaN`), `Date` by `getTime()`, `RegExp` by `source`+`flags`, `Map`/`Set` by deep-equal contents, typed arrays by bytes, and functions by `===`. Plain objects and arrays are compared recursively, key by key. Full rules and edge cases: [Equality & supported types](/packages/object-diff/modules/diff#equality-supported-types) in the Diffing guide.

## API map

| API                         | Returns                   | Use when                         |
| --------------------------- | ------------------------- | -------------------------------- |
| `diff(a, b)`                | Change records + metadata | Audit, debug, UI diff viewers    |
| `hasChanges(a, b)`          | `boolean`                 | Dirty flags, skip expensive work |
| `compare(a, b)`             | Deep equality             | Tests, custom equality           |
| `patch(diffResult)`         | JSON Patch ops            | Network sync, undo stacks        |
| `applyPatch(target, ops)`   | New object                | Apply remote or local updates    |
| `serialize(result, format)` | String                    | Logs, exports, docs              |

Optional engines live on subpaths (`/merge`, `/query`, `/stats`, `/view`, …) — see [Engines](/packages/object-diff/modules/engines).

## Next steps

| Goal                  | Guide                                                     |
| --------------------- | --------------------------------------------------------- |
| First integration     | [Tutorial](/packages/object-diff/modules/getting-started) |
| Diff options          | [Diffing](/packages/object-diff/modules/diff)             |
| Patch apply / RFC ops | [Patching](/packages/object-diff/modules/patch)           |

[Diff explorer →](/playground/object-diff/diff)
