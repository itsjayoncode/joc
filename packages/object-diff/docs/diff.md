# Diffing

Get structured change records from two object snapshots.

**Previous:** [Tutorial](/packages/object-diff/modules/getting-started) · **Next:** [Patching](/packages/object-diff/modules/patch)

::: tip Playground
[Open Diff explorer →](/playground/object-diff/diff) — edit before/after JSON and inspect change records live.
:::

## Problem → approach

| Without structured diff                             | With `diff()`                                               |
| --------------------------------------------------- | ----------------------------------------------------------- |
| String compare or shallow `===` misses nested edits | Deep walk with path-addressable change records              |
| Building a change list by hand for every form/store | `result.changes` with `type`, `path`, `before`, `after`     |
| Full diff cost when you only need a dirty flag      | `hasChanges()` short-circuits without materializing changes |

## Basics

```ts
import { diff } from "@jayoncode/object-diff";

const result = diff({ user: { name: "John" }, count: 1 }, { user: { name: "Jane" }, count: 2 });

console.log(result.changes);
console.log(result.metadata.changeCount);
```

## Dirty check only

Skip building the full change list when you only need a boolean:

```ts
import { hasChanges } from "@jayoncode/object-diff";

if (!hasChanges(savedState, currentState)) {
  return; // nothing to persist
}
```

## Filtered helpers

Extract subsets of changes:

```ts
import { added, removed, updated, unchanged } from "@jayoncode/object-diff";

const result = diff(before, after);
const newKeys = added(result);
const deleted = removed(result);
const modified = updated(result);
```

## Compare and options

```ts
import { compare } from "@jayoncode/object-diff";

const equal = compare(objA, objB); // deep equality check
```

Useful `diff()` options include `maxDepth`, `includeUnchanged`, and custom comparators — see [API Reference](/packages/object-diff/api/).

## Cheat sheet

```ts
const result = diff(before, after);
result.changes; // readonly change records
result.metadata; // counts, timing hints
hasChanges(before, after); // fast path
```

**Next:** [Patching](/packages/object-diff/modules/patch) — turn changes into JSON Patch operations.
