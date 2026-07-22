---
title: Diff
description: Object Diff documentation for Diff.
---

# Diffing

Get structured change records from two object snapshots.

**Previous:** [Tutorial](/packages/object-diff/modules/getting-started) · **Next:** [Patching](/packages/object-diff/modules/patch)

::: tip Playground
[Open Diff explorer →](/playground/object-diff/diff) — edit before/after JSON and inspect change records live.
:::

## Import path

```ts
import { diff, hasChanges, compare } from "@jayoncode/object-diff";
// Slim (no patch/serialize): import { diff, hasChanges } from "@jayoncode/object-diff/core";
```

Subpath map: [Engines](/packages/object-diff/modules/engines).

## Problem → approach

| Without structured diff                             | With `diff()`                                               |
| --------------------------------------------------- | ----------------------------------------------------------- |
| String compare or shallow `===` misses nested edits | Deep walk with path-addressable change records              |
| Building a change list by hand for every form/store | `result.changes` with `type`, `path`, `previous`, `current` |
| Full diff cost when you only need a dirty flag      | `hasChanges()` short-circuits without materializing changes |

## Basics

```ts
import { diff } from "@jayoncode/object-diff";

const result = diff({ user: { name: "John" }, count: 1 }, { user: { name: "Jane" }, count: 2 });

console.log(result.changes);
console.log(result.metadata.changeCount);
```

## Dirty check only

```ts
import { hasChanges } from "@jayoncode/object-diff";

if (!hasChanges(savedState, currentState)) {
  return; // nothing to persist
}
```

Prefer importing from `@jayoncode/object-diff/core` when you only need compare/diff/hasChanges (smaller tree-shaken graph).

## Equality & supported types

`diff()` and `compare()` share the same deep-equality core. Two values are considered equal when:

| Kind                              | Equality rule                                                                                                                                                    |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitives                        | [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) semantics — `NaN` equals `NaN`, `+0`/`-0` are distinct |
| `Date`                            | `a.getTime() === b.getTime()` (two `Invalid Date`s are equal)                                                                                                    |
| `RegExp`                          | `a.source === b.source && a.flags === b.flags`                                                                                                                   |
| `Map`                             | Same size, every key's value deep-equal (keys matched by `===`/`Object.is`)                                                                                      |
| `Set`                             | Same size, every member has a deep-equal counterpart (order-independent)                                                                                         |
| Typed arrays (`Uint8Array`, etc.) | Same `byteLength` and identical bytes                                                                                                                            |
| Functions                         | Reference equality (`===`) only — never compared by source or behavior                                                                                           |
| Plain objects / arrays            | Deep, recursive structural comparison                                                                                                                            |

Mismatched kinds (e.g. a `Date` vs a plain object) are always unequal. Exotic types (`WeakMap`, `WeakSet`, class instances, etc.) fall through to plain-object handling — own enumerable keys only.

## `treatUndefinedAsMissing`

Default: **`false`**. For **nested** properties, a key holding an explicit `undefined` is already treated the same as an absent key regardless of this option — both produce `added`/`removed` records:

```ts
diff({ a: 1, b: 2 }, { a: 1, b: undefined }); // → removed "b" (same with or without this option)
diff({ a: 1, b: 2 }, { a: 1 }); // → removed "b" (key omitted entirely — identical result)
```

`treatUndefinedAsMissing` only changes behavior when the values passed **directly** to `diff()`/`hasChanges()` themselves are `undefined` (the root comparison, before any key is walked):

```ts
diff(undefined, { a: 1 });
// default: → changed "" (root), current: { a: 1 } — undefined is compared as a value

diff(undefined, { a: 1 }, { treatUndefinedAsMissing: true });
// → added "" (root) — undefined at the root is treated as "nothing there yet"
```

Set it to `true` if you diff optional/not-yet-loaded root values (e.g. `diff(previousOrUndefined, current)`) and want that case reported as `added`/`removed` rather than `changed`.

## Options

```ts
diff(before, after, {
  maxDepth: 20,
  includeUnchanged: false,
  ignore: ["password", "meta.*"],
  include: ["user.**"],
  identityKey: "id", // match array items by identity instead of index
  detectMoves: true, // pair equal removed+added into type: "moved"
  treatUndefinedAsMissing: false,
  circular: "error", // or "skip"
  customComparator: (a, b, path) => undefined, // true/false/undefined
});
```

| Option                    | Default     | Effect                                                                                                                                              |
| ------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxDepth`                | `Infinity`  | Throws `MaxDepthExceededError` once traversal depth exceeds this value                                                                              |
| `includeUnchanged`        | `false`     | Keep `unchanged` records in `changes` (otherwise only counted in `metadata.unchangedCount`)                                                         |
| `detectMoves`             | `false`     | Emit `moved` for array reorders (LCS + equality / identity) and coalesce equal object-key remove+add pairs into `moved` (`from` + `path`)           |
| `circular`                | `"error"`   | `"error"` throws `CircularReferenceError` on a repeated object/Map/Set reference; `"skip"` stops descending into it                                 |
| `customComparator`        | `undefined` | `(a, b, path) => boolean \| undefined` — `true`/`false` overrides equality at that path, `undefined` falls back to default logic                    |
| `treatUndefinedAsMissing` | `false`     | Treat an explicit `undefined` value like an absent key (see above)                                                                                  |
| `identityKey`             | `undefined` | Match array items by a stable id (property name or `(item, path) => id`) instead of index; duplicate ids on either side throw `InvalidOptionsError` |
| `ignore`                  | `undefined` | Path globs (`*` = one segment, `**` = any remainder) to skip                                                                                        |
| `include`                 | `undefined` | Only emit changes for matching paths (ancestors are still visited so descendants stay reachable)                                                    |

### `ignore` / `include` — prefix vs. glob vs. emit rules

`ignore`/`include` affect two things: which paths get **visited** during traversal, and which resulting changes get **emitted**. Both share glob syntax, but plain strings (no `*`) get extra "prefix" behavior:

- **Exact string** (no `*`): `ignore: ["secrets"]` skips `secrets` itself **and** every descendant (`secrets.token`, `secrets[0]`) — acts as a subtree prefix, not just an exact path.
- **`.**` suffix**: `ignore: ["secrets.**"]` skips **descendants only** (`secrets.token`, `secrets[0]`). If the `secrets` value itself changes, a change is still emitted at `secrets` (without listing ignored child paths).
- **`*`** matches exactly one segment: `include: ["user.*"]` matches `user.name`, not `user.address.city`.
- **`**`** matches zero or more segments: `include: ["user.**"]` matches `user`, `user.name`, and `user.address.city`.
- **`include` still visits ancestors**: `include: ["user.name"]` visits `user` (and the root) so the walk can reach `user.name`, but only `user.name` is emitted as a change.
- **`ignore` wins over `include`** when both match the same path.

```ts
diff(before, after, { ignore: ["password", "meta.*"] }); // drop "password" subtree + one level under "meta"
diff(before, after, { ignore: ["secrets.**"] }); // ignore nested noise; still report if `secrets` itself changed
diff(before, after, { include: ["user.**"] }); // only emit changes under "user"
```

## `CompareOptions` is a subset of `DiffOptions`

`compare(a, b, options)` takes `CompareOptions` — only `maxDepth`, `circular`, and `customComparator`. There is **no** `ignore`, `include`, `identityKey`, or `treatUndefinedAsMissing` on `compare()`: it answers a single boolean "are these equal?", so per-path filtering and array-identity matching (which only matter when producing change records) don't apply. For filtered or identity-aware equality checks, use `diff()`/`hasChanges()`, which accept the full `DiffOptions`.

## `DiffRecord.previous` / `current` are omitted when `undefined`

A `DiffRecord` only carries the `previous` and/or `current` keys when that value isn't `undefined` — they're conditionally spread onto the record, never present as `key: undefined`:

```ts
diff({ a: 1 }, {}).changes[0];
// → { path: "a", type: "removed", previous: 1 } — no `current` key at all

diff({}, { a: 1 }).changes[0];
// → { path: "a", type: "added", current: 1 } — no `previous` key
```

Use `"previous" in change` / `"current" in change` if you need to distinguish "key absent" from "value is `undefined`".

## Filtered helpers (a, b)

These helpers still take **two values** (they run a diff internally):

```ts
import { added, removed, updated, unchanged } from "@jayoncode/object-diff";

added(before, after);
removed(before, after);
updated(before, after); // type === "changed"
unchanged(before, after); // forces includeUnchanged
```

For querying an existing `DiffResult`, use [`@jayoncode/object-diff/query`](/packages/object-diff/modules/query).

## Compare

```ts
import { compare } from "@jayoncode/object-diff";

const equal = compare(objA, objB);
```

## Cheat sheet

```ts
const result = diff(before, after, { detectMoves: true });
result.changes; // readonly DiffRecord[]
result.metadata; // changeCount, movedCount, …
hasChanges(before, after); // fast path
```

**Next:** [Patching](/packages/object-diff/modules/patch) — turn changes into JSON Patch operations.
