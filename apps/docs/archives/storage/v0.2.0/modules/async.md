---
title: Async
description: Storage documentation for Async.
---

# Async storage (IndexedDB)

**Status:** Stable (0.2)  
**Import:** `@jayoncode/storage/async`

**Previous:** [Transactions](/packages/storage/modules/transactions) · **Next:** [Cross-tab](/packages/storage/modules/cross-tab)

Promise-based Storage with the same envelopes, TTL, policies, and migrate rules as sync `createStorage` — for backends that cannot be sync (IndexedDB).

::: tip Sync stays sync
Root `@jayoncode/storage` is unchanged. Use `/async` only when you need IndexedDB (or another async adapter).
:::

## Quick start

```ts
import { createAsyncStorage, createIndexedDbAdapter } from "@jayoncode/storage/async";

const storage = createAsyncStorage({
  namespace: "app",
  adapter: createIndexedDbAdapter(), // DB: jayoncode-storage
});

await storage.set("theme", "dark");
await storage.get("theme"); // "dark" | null
```

For tests / ephemeral data:

```ts
import { createAsyncStorage, createMemoryAsyncAdapter } from "@jayoncode/storage/async";

const storage = createAsyncStorage({
  namespace: "test",
  adapter: createMemoryAsyncAdapter(),
});
```

## Options

Same idea as [Core](/packages/storage/modules/core): `namespace`, `adapter`, `ttl`, `policies`, `schemaVersion`, `serialize` / `deserialize`, `migrate` (may return a `Promise`).

## IndexedDB adapter

| Option      | Default             | Notes                                |
| ----------- | ------------------- | ------------------------------------ |
| `dbName`    | `jayoncode-storage` | **Not** Form Intelligence’s draft DB |
| `storeName` | `entries`           | String values (serialized envelopes) |

Missing `indexedDB` (SSR) → `AdapterError` on first operation.

## Not in 0.2 (async)

`/maintenance`, `/snapshots`, `/observable`, `/diagnostics`, `/transactions` remain **sync-only**. Port later if needed.

## Form Intelligence drafts

FI keeps `createIndexedDbDraftStorage` for form drafts. Storage IndexedDB is general persistence — do not point both at the same DB expecting shared semantics.

See also: [Cross-tab](/packages/storage/modules/cross-tab) · [FAQ](/packages/storage/modules/faq)
