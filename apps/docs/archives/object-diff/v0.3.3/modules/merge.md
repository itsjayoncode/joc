---
title: Merge
description: Object Diff documentation for Merge.
---

# Merge

Combine two (or three) object snapshots with explicit strategies and conflict objects.

**Previous:** [Engines](/packages/object-diff/modules/engines) · **Next:** [Query](/packages/object-diff/modules/query)

## Import path

```ts
import { merge } from "@jayoncode/object-diff/merge";
```

**Not** on the root entry — see [Engines](/packages/object-diff/modules/engines). Core never imports merge (tree-shake isolation).

## Quick example

```ts
const result = merge(
  { user: { name: "Ada", role: "admin" } },
  { user: { name: "Grace", role: "admin" } },
  { strategy: "latest-wins" }, // default
);

result.value; // { user: { name: "Grace", role: "admin" } }
result.conflicts; // [{ path: "user.name", left, right, reason: "both-changed" }]
result.applied; // DiffResult of left → value (disable with includeApplied: false)
```

| Strategy      | Behavior                            |
| ------------- | ----------------------------------- |
| `latest-wins` | Prefer `right` on conflict          |
| `manual`      | Keep `left`, list conflicts         |
| `custom`      | Call `resolve(conflict)` (required) |

Plain objects merge recursively. Without `identityKey`, arrays and other non-plain values are treated as atomic leaves on conflict.

## Identity-aware arrays

Pass the same `identityKey` contract as `diff` so list items merge by stable id instead of as one atomic value:

```ts
const result = merge(
  {
    items: [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ],
  },
  {
    items: [
      { id: 2, name: "b2" },
      { id: 3, name: "c" },
    ],
  },
  { identityKey: "id", strategy: "latest-wins" },
);

// right order first, then left-only ids:
// [{ id: 2, name: "b2" }, { id: 3, name: "c" }, { id: 1, name: "a" }]
// conflicts: [{ path: "items[0].name", reason: "both-changed", ... }]
```

| Rule                   | Behavior                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| Matched ids            | Deep-merge the two (or three) item snapshots                                                  |
| Right-only / left-only | Keep the side that has the item                                                               |
| Result order           | Items present on `right` keep **right’s order**; surviving left-only ids append in left order |
| Duplicate ids          | Throws `InvalidOptionsError` (same as `diff`)                                                 |
| Items without an id    | Fall back to index pairing among leftovers                                                    |

`applied` (when enabled) also passes `identityKey` into `diff` so the audit trail matches list identity.

## Conflict objects

Every conflict is listed in `conflicts[]` (never dropped silently):

| Field            | Meaning                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `path`           | Display path of the disagreement                                                                            |
| `left` / `right` | Values from each side (`undefined` = missing / deleted)                                                     |
| `base?`          | Common ancestor value in three-way merges                                                                   |
| `reason`         | `both-changed` \| `delete-edit` \| `both-added`                                                             |
| `identity?`      | Identity key value when the conflict is under an identity-matched array item (including nested field paths) |

```ts
merge(left, right, {
  strategy: "custom",
  resolve: (conflict) => {
    if (conflict.reason === "delete-edit") {
      return conflict.right; // or prompt the user
    }
    return conflict.left;
  },
});
```

## Three-way

```ts
const result = merge(localDraft, remoteDraft, {
  base: lastSynced,
  strategy: "latest-wins",
  identityKey: "id", // optional — identity-aware lists
});
```

| left vs base        | right vs base       | Result              |
| ------------------- | ------------------- | ------------------- |
| equal               | equal               | base                |
| changed             | equal               | left                |
| equal               | changed             | right               |
| changed same        | changed same        | that value          |
| changed differently | changed differently | conflict → strategy |

With `identityKey`, the same table applies **per list item**. A delete on one side vs an edit on the other raises `reason: "delete-edit"`.

## Custom resolve

```ts
merge(left, right, {
  strategy: "custom",
  resolve: (conflict) => conflict.left, // or pick UI value
});
```

## Pitfalls

- Do not `import { merge } from "@jayoncode/object-diff"` — use `/merge`.
- Without `identityKey`, arrays remain atomic leaves on conflict (not element-wise).
- `custom` strategy requires `resolve`; omitting it is a configuration error.
- Duplicate `identityKey` values in any array side throw.

## Related

- [Engines](/packages/object-diff/modules/engines) · [Query](/packages/object-diff/modules/query) · [Integrations](/packages/object-diff/modules/integrations) · [Diff](/packages/object-diff/modules/diff) (`identityKey`)
