# `@jayoncode/storage`

Policy-driven client persistence — typed envelopes, TTL, migrations, and explicit adapters.

> **Status:** Public **0.1.0** — API surfaces **Stable**.  
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

## Non-goals (v1)

- Does not own Form Intelligence drafts
- Does not auto-select storage backends
- No IndexedDB / encryption / cross-tab sync yet

Brief: [`engineering/ecosystem/briefs/storage.md`](../../engineering/ecosystem/briefs/storage.md)

## Docs

- [`docs/overview.md`](./docs/overview.md) — package overview + documentation path
- [`docs/concepts.md`](./docs/concepts.md) · [`docs/getting-started.md`](./docs/getting-started.md) — foundation
- [`docs/core.md`](./docs/core.md) — createStorage guide
- [`docs/errors.md`](./docs/errors.md) — typed failures
- [`docs/recipes.md`](./docs/recipes.md) · [`docs/best-practices.md`](./docs/best-practices.md) · [`docs/faq.md`](./docs/faq.md) · [`docs/browser-support.md`](./docs/browser-support.md) · [`docs/security.md`](./docs/security.md) · [`docs/composition.md`](./docs/composition.md)
- [`docs/maintenance.md`](./docs/maintenance.md) · [`docs/snapshots.md`](./docs/snapshots.md) · [`docs/observable.md`](./docs/observable.md) · [`docs/diagnostics.md`](./docs/diagnostics.md) · [`docs/transactions.md`](./docs/transactions.md) — Stable subpaths
- Storage playground: `pnpm storage-playground:dev`
- Docs site: https://itsjayoncode.github.io/joc/packages/storage/
- Brief: [`engineering/ecosystem/briefs/storage.md`](../../engineering/ecosystem/briefs/storage.md)

## Scripts

```bash
pnpm --filter @jayoncode/storage test
pnpm --filter @jayoncode/storage bench
```
