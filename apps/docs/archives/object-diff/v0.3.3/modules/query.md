---
title: Query
description: Object Diff documentation for Query.
---

# Query

Query helpers over an existing `DiffResult` (does not re-run `diff`).

**Previous:** [Merge](/packages/object-diff/modules/merge) · **Next:** [Statistics](/packages/object-diff/modules/stats)

## Import path

```ts
import { find, filter, exclude, paths, summary, ofType, query } from "@jayoncode/object-diff/query";
```

**Not** on the root entry — [Engines](/packages/object-diff/modules/engines). Root `added` / `removed` / `updated` / `unchanged` still take `(a, b)` and re-diff.

## Free functions

```ts
const result = diff(before, after);

find(result, (r) => r.path.startsWith("user."));
filter(result, (r) => r.type === "changed"); // → DiffResult
exclude(result, ["password", "meta.*"]); // globs + prefix for non-globs
exclude(result, (r) => r.type === "added");
paths(result); // string[]
summary(result); // { total, added, removed, changed, unchanged, moved }
ofType(result, "moved");
```

## Fluent query

```ts
query(result).exclude(["password"]).updated().paths();
query(result).added().summary();
```

Pure — never mutates the input `DiffResult`.

## Pitfalls

- Query operates on an **existing** DiffResult; it does not call `diff` again.
- For richer metrics use `/stats` → `statistics(result)`, not `summary` alone.

## Related

- Richer metrics: `@jayoncode/object-diff/stats` → `statistics(result)`
- Fluent + explain/serialize/patch/stats: [DX / createDiffView](/packages/object-diff/modules/dx)
- [Engines](/packages/object-diff/modules/engines)
