# Core

Root `createStorage` API — options, instance methods, adapters, envelopes, and policies.

**Previous:** [Core concepts](/packages/storage/modules/concepts) · **Next:** [Errors](/packages/storage/modules/errors)

::: tip Who is this for?
**Beginners:** skim [Imports](#imports) and [createStorage options](#createstorage-options), then jump to [Recipes](/packages/storage/modules/recipes).  
**Advanced:** use the option tables + [Adapters](#adapters) / [Migrate](#migrate) sections as the source of truth next to TypeDoc.
:::

::: tip TypeDoc
Symbol-level reference: [API (TypeDoc)](/packages/storage/api/). This page is the workflow guide.
:::

## Imports

```ts
import {
  createStorage,
  createMemoryAdapter,
  createLocalStorageAdapter,
  createSessionStorageAdapter,
  ConfigurationError,
  SerializationError,
  QuotaExceededError,
  MigrationError,
  AdapterError,
  StorageError,
  isQuotaExceededError,
  packageId,
} from "@jayoncode/storage";

import type {
  CreateStorageOptions,
  JayOnCodeStorage,
  SetStorageOptions,
  StorageAdapter,
  StorageEnvelope,
  StorageEnvelopeV1,
  StoragePolicy,
  TtlDuration,
  StorageErrorCode,
  StorageErrorOptions,
} from "@jayoncode/storage";
```

## `createStorage(options)`

Returns a sync `JayOnCodeStorage<T>` bound to one namespace + adapter.

### `CreateStorageOptions`

| Option          | Type                                   | Default  | Notes                                  |
| --------------- | -------------------------------------- | -------- | -------------------------------------- |
| `namespace`     | `string`                               | required | Non-empty; must not contain `:`        |
| `adapter`       | `StorageAdapter`                       | required | Explicit — no auto-select              |
| `ttl`           | `TtlDuration`                          | —        | Instance default TTL                   |
| `policies`      | `Record<string, StoragePolicy>`        | —        | Named write presets (ttl-only)         |
| `schemaVersion` | `string`                               | `"1"`    | Blank → `"1"`                          |
| `serialize`     | `(value) => string`                    | JSON     | Serializes the **envelope**            |
| `deserialize`   | `(raw) => unknown`                     | JSON     | Must yield an envelope                 |
| `migrate`       | `(envelope, from) => envelope \| null` | —        | Required on version mismatch for `get` |

### Instance API

| Member                       | Signature                    | Notes                        |
| ---------------------------- | ---------------------------- | ---------------------------- |
| `namespace`                  | `string`                     | Trimmed                      |
| `schemaVersion`              | `string`                     | Configured version           |
| `get(key)`                   | `T \| null`                  | Migrates + may persist       |
| `set(key, value, options?)`  | `void`                       | Overwrites                   |
| `remove(key)`                | `void`                       | No parse                     |
| `has(key)`                   | `boolean`                    | `peek !== null` — no migrate |
| `clear()`                    | `void`                       | Needs `adapter.keys()`       |
| `peek(key)`                  | `StorageEnvelope<T> \| null` | No migrate; lazy expiry      |
| `definePolicy(name, policy)` | `void`                       | Register/replace preset      |

### `SetStorageOptions`

| Option   | Notes                                           |
| -------- | ----------------------------------------------- |
| `ttl`    | Highest priority when present                   |
| `policy` | Named preset; validated even if `ttl` overrides |

**TTL resolution:** `options.ttl` → policy `ttl` → instance `ttl` → none.

### Physical keys

```text
`${namespace}:${key}`
```

Keys and namespaces MUST NOT contain `:`.

## Envelope

```ts
{
  v: 1,
  schemaVersion: string,
  savedAt: number,
  expiresAt?: number,
  value: T,
}
```

`expiresAt` must be a finite number when present.

## Adapters

| Factory                         | Backend          |
| ------------------------------- | ---------------- |
| `createMemoryAdapter()`         | In-memory `Map`  |
| `createLocalStorageAdapter()`   | `localStorage`   |
| `createSessionStorageAdapter()` | `sessionStorage` |

Custom adapters implement `StorageAdapter`. Implement `keys()` to use `clear()` / cleanup / snapshot / diagnostics report.

::: info Playground
[Adapters page](/playground/storage/adapters) — switch memory / local / session in the Lab.
:::

## Policies

```ts
const storage = createStorage({
  namespace: "app",
  adapter: createMemoryAdapter(),
  policies: {
    preferences: { ttl: { days: 365 } },
    cache: { ttl: { minutes: 15 } },
  },
});

storage.set("theme", "dark", { policy: "preferences" });
storage.definePolicy("session", { ttl: { hours: 8 } });
```

Unknown `policy` names throw `ConfigurationError`. `has` / `get` / `peek` ignore policies.

## Migrations

```ts
createStorage({
  namespace: "app",
  adapter: createMemoryAdapter(),
  schemaVersion: "2",
  migrate: (envelope, fromVersion) => {
    if (fromVersion === "1") {
      return { ...envelope, schemaVersion: "2", value: upgrade(envelope.value) };
    }
    return null; // drop
  },
});
```

`get` runs migrate; `has` / `peek` do not.

## Capabilities (Stable)

| Subpath                           | Guide                                                  |
| --------------------------------- | ------------------------------------------------------ |
| `@jayoncode/storage/maintenance`  | [Maintenance](/packages/storage/modules/maintenance)   |
| `@jayoncode/storage/snapshots`    | [Snapshots](/packages/storage/modules/snapshots)       |
| `@jayoncode/storage/observable`   | [Observable](/packages/storage/modules/observable)     |
| `@jayoncode/storage/diagnostics`  | [Diagnostics](/packages/storage/modules/diagnostics)   |
| `@jayoncode/storage/transactions` | [Transactions](/packages/storage/modules/transactions) |

## Next

[Errors](/packages/storage/modules/errors) · [Recipes](/packages/storage/modules/recipes) · [API (TypeDoc)](/packages/storage/api/)
