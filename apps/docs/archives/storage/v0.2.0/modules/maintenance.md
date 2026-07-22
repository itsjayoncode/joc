---
title: Maintenance
description: Storage documentation for Maintenance.
---

# Maintenance

**Import:** `@jayoncode/storage/maintenance`

Explicit namespace sweep for expired (and optionally invalid) envelopes. Lazy TTL on read remains the default; cleanup is opt-in when you need quota back without touching every key.

**Previous:** [Errors](/packages/storage/modules/errors) · **Next:** [Snapshots](/packages/storage/modules/snapshots)

```ts
import { createStorage, createMemoryAdapter } from "@jayoncode/storage";
import { cleanup } from "@jayoncode/storage/maintenance";

const storage = createStorage({
  namespace: "cache",
  adapter: createMemoryAdapter(),
  ttl: { minutes: 15 },
});

const report = cleanup(storage);
// report.removedExpired, report.removedInvalid, report.skipped, report.errors

cleanup(storage, { removeInvalid: true });
```

## Options

| Option          | Default | Meaning                                |
| --------------- | ------- | -------------------------------------- |
| `removeInvalid` | `false` | Delete corrupt / non-envelope payloads |

## Notes

- Requires `adapter.keys()` (same as `clear`)
- Does not run migrations
- Sync only — no background timers
- Not on the default export (ADR 0006)

See also: [Core](/packages/storage/modules/core) · [Errors](/packages/storage/modules/errors) · [Lab Cleanup](/playground/storage/)
