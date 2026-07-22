# Storage

**Namespace it. Expire it. Upgrade it — without localStorage glue.**

[`@jayoncode/storage`](https://www.npmjs.com/package/@jayoncode/storage) — policy-driven client persistence for modern web apps.

[![npm version](https://img.shields.io/npm/v/@jayoncode/storage.svg)](https://www.npmjs.com/package/@jayoncode/storage)
[![license](https://img.shields.io/npm/l/@jayoncode/storage.svg)](https://github.com/itsjayoncode/joc/blob/master/packages/storage/package.json)
[![docs](https://img.shields.io/badge/docs-itsjayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/packages/storage/)
[![Become a Sponsor](https://img.shields.io/badge/Become%20a%20Sponsor-%23ea4aaa?style=flat&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/jayoncoding)

A small policy layer for browser persistence — namespaces, envelopes, TTL, migrations — on adapters **you** choose: memory, localStorage, sessionStorage, and IndexedDB.

> **Explicit adapters. Optional policy.**  
> Soft quota and transforms hooks are opt-in — no silent encryption.

## Persist → Policy → Adapt

```text
createStorage({ namespace, adapter })
    ↓
TTL · schema version · migrations (optional)
    ↓
peek · quota · transforms · maintenance (optional)
```

| Pillar      | What you get                                                           |
| ----------- | ---------------------------------------------------------------------- |
| **Persist** | Typed `set` / `get` with namespaced keys                               |
| **Policy**  | TTL, schema version, migrations, soft quota                            |
| **Adapt**   | Memory · localStorage · sessionStorage · IndexedDB — never auto-picked |

### Five capabilities

| Card                  | What it is                                          |
| --------------------- | --------------------------------------------------- |
| **createStorage()**   | Namespace + adapter + optional TTL / schema version |
| **Explicit adapters** | Memory · localStorage · sessionStorage · IndexedDB  |
| **Peek & TTL**        | See when a value was saved and when it expires      |
| **Migrations**        | Schema upgrades without ad-hoc key rewrites         |
| **Extra tools**       | Soft quota, transforms hooks, maintenance — opt-in  |

## Install

```bash
npm install @jayoncode/storage
```

```bash
pnpm add @jayoncode/storage
```

```bash
yarn add @jayoncode/storage
```

## The problem it solves

Most apps slowly accumulate helpers like this:

```ts
const raw = localStorage.getItem("app:theme");
const parsed = raw ? JSON.parse(raw) : null;
// + manual expiry · version bumps · migration · quota try/catch · per-project key rules
```

`@jayoncode/storage` replaces that sprawl with a namespaced, envelope-backed store you configure once.

## Quick start — prefs that survive reload

```ts
import { createStorage, createLocalStorageAdapter } from "@jayoncode/storage";

const storage = createStorage({
  namespace: "app",
  adapter: createLocalStorageAdapter(), // or createMemoryAdapter() / createSessionStorageAdapter()
  ttl: { hours: 1 },
  schemaVersion: "1",
});

storage.set("theme", "dark");
storage.get("theme"); // "dark" | null
```

Adapters are **explicit** — the library never chooses a backend for you.

## More problem → solution snippets

### Named TTL policies

```ts
import { createStorage, createLocalStorageAdapter } from "@jayoncode/storage";

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

### Async IndexedDB

```ts
import { createAsyncStorage, createIndexedDbAdapter } from "@jayoncode/storage/async";

const storage = createAsyncStorage({
  namespace: "app",
  adapter: createIndexedDbAdapter(), // default DB: jayoncode-storage
});

await storage.set("theme", "dark");
```

### Cross-tab notify (no auto-merge)

```ts
import { enableCrossTabSync } from "@jayoncode/storage/cross-tab";

const { storage: synced, stop } = enableCrossTabSync(storage, {
  onRemote: () => refreshUi(),
});
```

### Soft quota (approx bytes)

```ts
import { enableQuotaGuard } from "@jayoncode/storage/quota";

const { storage: guarded } = enableQuotaGuard(storage, {
  maxApproxBytes: 50_000,
});
```

### Opt-in compress / encrypt hooks

```ts
import {
  createStorage,
  createMemoryAdapter,
  defaultSerialize,
  defaultDeserialize,
} from "@jayoncode/storage";
import { withPayloadTransforms } from "@jayoncode/storage/transforms";

const { serialize, deserialize } = withPayloadTransforms(
  { serialize: defaultSerialize, deserialize: defaultDeserialize },
  {
    // App-owned sync string → string hooks (Storage does not ship crypto algorithms)
    compress: (plain) => plain,
    decompress: (wire) => wire,
    encrypt: (plain) => plain,
    decrypt: (wire) => wire,
  },
);

const storage = createStorage({
  namespace: "app",
  adapter: createMemoryAdapter(),
  serialize,
  deserialize,
});
```

## Capabilities (pay only when you import)

| Import                            | What it solves                                              |
| --------------------------------- | ----------------------------------------------------------- |
| `@jayoncode/storage`              | Sync `createStorage`, adapters, errors, default ser/de      |
| `@jayoncode/storage/async`        | Promise API + IndexedDB adapter                             |
| `@jayoncode/storage/cross-tab`    | Notify other tabs (`BroadcastChannel` + optional `storage`) |
| `@jayoncode/storage/quota`        | Soft max / warn on approx namespace bytes                   |
| `@jayoncode/storage/transforms`   | Compose compress/encrypt around serialize                   |
| `@jayoncode/storage/maintenance`  | Explicit expired-key cleanup                                |
| `@jayoncode/storage/snapshots`    | Export / restore a namespace                                |
| `@jayoncode/storage/observable`   | In-process `on` / `watch`                                   |
| `@jayoncode/storage/diagnostics`  | DEV report / activity                                       |
| `@jayoncode/storage/transactions` | Same-tab journal + rollback                                 |

## Non-goals

- Does **not** own Form Intelligence drafts (keep IDB DBs separate: `jayoncode-storage` vs `jayoncode-form-intelligent-drafts`)
- Does **not** auto-select storage backends
- Cross-tab does **not** auto-merge remote values (notify-only)
- Soft quota uses **approx** payload bytes — not exact browser remaining space
- Does **not** ship silent encryption/compression or crypto algorithms — opt-in `/transforms` hooks only; keys stay app-owned

## Documentation

- [Official docs](https://itsjayoncode.github.io/joc/packages/storage/)
- [Tutorial](https://itsjayoncode.github.io/joc/packages/storage/modules/getting-started)
- [Quota](https://itsjayoncode.github.io/joc/packages/storage/modules/quota) · [Transforms](https://itsjayoncode.github.io/joc/packages/storage/modules/transforms)
- [Interactive playground](https://itsjayoncode.github.io/joc/playground/storage/)

## Repository

**https://github.com/itsjayoncode/joc** · Package path: `packages/storage`

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
