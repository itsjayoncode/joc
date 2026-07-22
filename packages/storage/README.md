# `@jayoncode/storage`

Policy-driven client persistence — typed envelopes, TTL, migrations, and explicit adapters.

> **Status:** Public **0.3.0** — sync core Stable; `/async` · `/cross-tab` · `/quota` · `/transforms` Stable.  
> Install: `pnpm add @jayoncode/storage`  
> Docs: https://itsjayoncode.github.io/joc/packages/storage/

## Install (workspace)

```bash
pnpm add @jayoncode/storage
```

## Quick start

```ts
import { createStorage, createMemoryAdapter, createLocalStorageAdapter } from "@jayoncode/storage";

const storage = createStorage({
  namespace: "app",
  adapter: createLocalStorageAdapter(), // or createMemoryAdapter() / createSessionStorageAdapter()
  ttl: { hours: 1 },
  schemaVersion: "1",
});

storage.set("cart", { items: 2 });
const cart = storage.get("cart");
```

### Policies

```ts
const storage = createStorage({
  namespace: "app",
  adapter: createLocalStorageAdapter(),
  policies: {
    preferences: { ttl: { days: 365 } },
    cache: { ttl: { minutes: 15 } },
  },
});

storage.set("theme", "dark", { policy: "preferences" });
```

TTL resolution: per-write `ttl` → named `policy` → instance `ttl`.

Adapters are **explicit** — the library never chooses a backend for you.

### Async IndexedDB (0.2+)

```ts
import { createAsyncStorage, createIndexedDbAdapter } from "@jayoncode/storage/async";

const storage = createAsyncStorage({
  namespace: "app",
  adapter: createIndexedDbAdapter(),
});
await storage.set("theme", "dark");
```

### Cross-tab notify (0.2+)

```ts
import { enableCrossTabSync } from "@jayoncode/storage/cross-tab";

const { storage: synced, stop } = enableCrossTabSync(storage, {
  onRemote: () => refreshUi(),
});
```

### Soft quota (0.3+)

```ts
import { enableQuotaGuard } from "@jayoncode/storage/quota";

const { storage: guarded } = enableQuotaGuard(storage, {
  maxApproxBytes: 50_000,
});
```

### Payload transforms (0.3+)

```ts
import { defaultSerialize, defaultDeserialize } from "@jayoncode/storage";
import { withPayloadTransforms } from "@jayoncode/storage/transforms";

const { serialize, deserialize } = withPayloadTransforms(
  { serialize: defaultSerialize, deserialize: defaultDeserialize },
  {/* app-owned sync compress/encrypt hooks */},
);
```

## Non-goals

- Does not own Form Intelligence drafts (keep IDB DBs separate)
- Does not auto-select storage backends
- Cross-tab does not auto-merge remote values
- Soft quota is approx bytes — not exact browser remaining space
- No silent encryption/compression defaults (opt-in `/transforms`)

Brief: [`engineering/ecosystem/briefs/storage.md`](../../engineering/ecosystem/briefs/storage.md) · v2: [`storage-v2.md`](../../engineering/ecosystem/briefs/storage-v2.md)

## Docs

- [`docs/overview.md`](./docs/overview.md) — package overview + documentation path
- [`docs/quota.md`](./docs/quota.md) · [`docs/transforms.md`](./docs/transforms.md) — 0.3 surfaces
- Storage playground: `pnpm storage-playground:dev`
- Docs site: https://itsjayoncode.github.io/joc/packages/storage/

## Scripts

```bash
pnpm --filter @jayoncode/storage test
```
