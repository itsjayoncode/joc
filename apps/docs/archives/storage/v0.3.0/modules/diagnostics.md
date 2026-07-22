---
title: Diagnostics
description: Storage documentation for Diagnostics.
---

# Diagnostics

**Status:** Stable  
**Import:** `@jayoncode/storage/diagnostics`

**Previous:** [Observable](/packages/storage/modules/observable) · **Next:** [Transactions](/packages/storage/modules/transactions)

Developer report, counters, and activity ring buffer for one `createStorage` instance. Not on the default export — keep it off the production hot path (DEV panels / Lab).

```ts
import { createStorage, createMemoryAdapter } from "@jayoncode/storage";
import { createDiagnostics } from "@jayoncode/storage/diagnostics";

const storage = createStorage({
  namespace: "app",
  adapter: createMemoryAdapter(),
});

const diagnostics = createDiagnostics(storage);

storage.set("theme", "dark");
storage.get("theme");

diagnostics.stats();
// { sets, gets, peeks, removes, clears, expired, migrated }

diagnostics.activity();
// newest-first ring buffer: set / remove / clear / expired / migrated

const report = diagnostics.report();
// namespace, entryCount, expiredCount, invalidCount, approxBytes, stats, activity
```

## Options

| Option          | Default | Meaning                                  |
| --------------- | ------- | ---------------------------------------- |
| `activityLimit` | `100`   | Max activity entries (first attach only) |

## Notes

- Idempotent — one session per storage instance
- `approxBytes` is the sum of raw string lengths, **not** remaining browser quota
- `report()` requires `adapter.keys()` (same as `clear` / `cleanup`)
- Uses `observe()` internally; plain successful reads do not appear in activity (only counted in `gets` / `peeks`)
- `disconnect()` stops activity listeners; counters and wraps remain

See also: [Core](/packages/storage/modules/core) · [Observable](/packages/storage/modules/observable) · [Maintenance](/packages/storage/modules/maintenance)
