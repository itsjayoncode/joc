---
title: Quota
description: Storage documentation for Quota.
---

# Quota

**Status:** Stable (0.3)  
**Import:** `@jayoncode/storage/quota`

**Previous:** [Cross-tab](/packages/storage/modules/cross-tab) · **Next:** [Transforms](/packages/storage/modules/transforms)

Soft-limit helpers for **sync** `createStorage` instances. These use the same approximate byte math as diagnostics (`approxBytes`) — **not** remaining browser quota.

```ts
import { createStorage, createMemoryAdapter } from "@jayoncode/storage";
import { enableQuotaGuard, estimateNamespaceBytes } from "@jayoncode/storage/quota";

const storage = createStorage({
  namespace: "app",
  adapter: createMemoryAdapter(),
});

estimateNamespaceBytes(storage); // sum of raw string lengths

const {
  storage: guarded,
  estimate,
  stop,
} = enableQuotaGuard(storage, {
  maxApproxBytes: 50_000,
  warnAtRatio: 0.8, // default
  mode: "throw", // default — QuotaExceededError when a set would exceed
  onWarn: ({ approxBytes, maxApproxBytes, ratio }) => {
    console.warn("approaching soft quota", { approxBytes, maxApproxBytes, ratio });
  },
});

guarded.set("prefs", largeValue);
stop(); // disable guard; underlying storage still works
```

## Options

| Option           | Default    | Meaning                                                               |
| ---------------- | ---------- | --------------------------------------------------------------------- |
| `maxApproxBytes` | (required) | Soft ceiling (approx payload bytes)                                   |
| `warnAtRatio`    | `0.8`      | Call `onWarn` when projected usage ≥ this fraction of max             |
| `onWarn`         | —          | Fired once per upward crossing; resets when under again               |
| `mode`           | `"throw"`  | `"throw"` blocks over-max `set`; `"warn"` never throws from the guard |

## Behavior

- Requires `adapter.keys()` (built-in adapters provide it)
- Projects size before commit (replace existing key length with new envelope length)
- Browser / Lab **hard** quota (`QuotaExceededError` from adapters) is unchanged
- Does not claim exact remaining browser space

## Lab

Use **Soft max bytes** for productized soft limits. **Simulate quota on set** still exercises hard adapter failures.

See also: [Errors](/packages/storage/modules/errors) · [Diagnostics](/packages/storage/modules/diagnostics) · [Security](/packages/storage/modules/security)
