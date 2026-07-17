# Merge

Combine two (or three) object snapshots with explicit strategies and conflict objects.

**Previous:** [Engines](/packages/object-diff/modules/engines) · **Next:** [Query](/packages/object-diff/modules/query)

```ts
import { merge } from "@jayoncode/object-diff/merge";
```

Core never imports merge (tree-shake isolation).

## Two-way

```ts
const result = merge(
  { user: { name: "Ada", role: "admin" } },
  { user: { name: "Grace", role: "admin" } },
  { strategy: "latest-wins" }, // default
);

result.value; // { user: { name: "Grace", role: "admin" } }
result.conflicts; // [{ path: "user.name", left, right }]
result.applied; // DiffResult of left → value (disable with includeApplied: false)
```

| Strategy | Behavior |
| -------- | -------- |
| `latest-wins` | Prefer `right` on conflict |
| `manual` | Keep `left`, list conflicts |
| `custom` | Call `resolve(conflict)` (required) |

Plain objects merge recursively. Arrays and other non-plain values are treated as atomic leaves on conflict.

## Three-way

```ts
const result = merge(localDraft, remoteDraft, {
  base: lastSynced,
  strategy: "latest-wins",
});
```

| left vs base | right vs base | Result |
| ------------ | ------------- | ------ |
| equal | equal | base |
| changed | equal | left |
| equal | changed | right |
| changed same | changed same | that value |
| changed differently | changed differently | conflict → strategy |

## Custom resolve

```ts
merge(left, right, {
  strategy: "custom",
  resolve: (conflict) => conflict.left, // or pick UI value
});
```

Conflicts are never dropped silently — they always appear in `conflicts[]`.
