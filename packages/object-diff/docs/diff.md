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

| Option               | Effect                                                                     |
| -------------------- | -------------------------------------------------------------------------- |
| `ignore` / `include` | Path globs (`*`, `**`)                                                     |
| `identityKey`        | Stable array item matching by property or function                         |
| `detectMoves`        | Emit `moved` records (`from` + `path`) when values match across remove+add |
| `includeUnchanged`   | Keep `unchanged` records in `changes`                                      |

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
