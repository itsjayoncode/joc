# Query

Query helpers over an existing `DiffResult` (does not re-run `diff`).

**Previous:** [Merge](/packages/object-diff/modules/merge) · **Next:** [DX](/packages/object-diff/modules/dx)

```ts
import { find, filter, exclude, paths, summary, ofType, query } from "@jayoncode/object-diff/query";
```

Root `added` / `removed` / `updated` / `unchanged` still take `(a, b)` — they are unchanged.

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

## Related

- Richer metrics: `@jayoncode/object-diff/stats` → `statistics(result)`
- Fluent + serialize/patch/stats: [DX / createDiffView](/packages/object-diff/modules/dx)
