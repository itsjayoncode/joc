---
title: Snapshots
description: Storage documentation for Snapshots.
---

# Snapshots

**Status:** Stable  
**Import:** `@jayoncode/storage/snapshots`

**Previous:** [Maintenance](/packages/storage/modules/maintenance) · **Next:** [Observable](/packages/storage/modules/observable)

Export and restore one namespace of envelopes.

```ts
import { createStorage, createMemoryAdapter } from "@jayoncode/storage";
import { snapshot, restore } from "@jayoncode/storage/snapshots";

const storage = createStorage({
  namespace: "app",
  adapter: createMemoryAdapter(),
});

storage.set("theme", "dark");
const snap = snapshot(storage);

restore(storage, snap, { mode: "overwrite" });
// merge (default) keeps keys not present in the snapshot
```

## Behavior

| Topic           | Rule                                          |
| --------------- | --------------------------------------------- |
| Expired entries | Skipped on snapshot/restore unless opted in   |
| Migrate         | Not run on restore — `get` may migrate later  |
| Namespace       | Snapshot namespace must match storage         |
| Format          | `format: 1` document version (≠ envelope `v`) |

## Options

**snapshot:** `includeExpired?: boolean`  
**restore:** `mode?: "merge" | "overwrite"`, `restoreExpired?: boolean`

See also: [Maintenance](/packages/storage/modules/maintenance) · [Core](/packages/storage/modules/core)
