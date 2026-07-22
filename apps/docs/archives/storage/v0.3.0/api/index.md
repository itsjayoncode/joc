**@jayoncode/storage API**

---

# @jayoncode/storage API

## Classes

### StorageError

#### Extends

- `Error`

#### Extended by

- [`AdapterError`](#adaptererror)
- [`ConfigurationError`](#configurationerror)
- [`MigrationError`](#migrationerror)
- [`QuotaExceededError`](#quotaexceedederror)
- [`SerializationError`](#serializationerror)

#### Constructors

##### Constructor

```ts
new StorageError(
   message: string,
   code: StorageErrorCode,
   options?: StorageErrorOptions): StorageError;
```

###### Parameters

| Parameter | Type                                          |
| --------- | --------------------------------------------- |
| `message` | `string`                                      |
| `code`    | [`StorageErrorCode`](#storageerrorcode)       |
| `options` | [`StorageErrorOptions`](#storageerroroptions) |

###### Returns

[`StorageError`](#storageerror)

###### Overrides

```ts
Error.constructor;
```

#### Properties

| Property                         | Modifier   | Type                                       |
| -------------------------------- | ---------- | ------------------------------------------ |
| <a id="code"></a> `code`         | `readonly` | [`StorageErrorCode`](#storageerrorcode)    |
| <a id="details-1"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` |

---

### ConfigurationError

#### Extends

- [`StorageError`](#storageerror)

#### Constructors

##### Constructor

```ts
new ConfigurationError(message: string, options?: StorageErrorOptions): ConfigurationError;
```

###### Parameters

| Parameter | Type                                          |
| --------- | --------------------------------------------- |
| `message` | `string`                                      |
| `options` | [`StorageErrorOptions`](#storageerroroptions) |

###### Returns

[`ConfigurationError`](#configurationerror)

###### Overrides

[`StorageError`](#storageerror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                          |
| -------------------------------- | ---------- | ------------------------------------------ | ------------------------------------------------------- |
| <a id="code-1"></a> `code`       | `readonly` | [`StorageErrorCode`](#storageerrorcode)    | [`StorageError`](#storageerror).[`code`](#code)         |
| <a id="details-2"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`StorageError`](#storageerror).[`details`](#details-1) |

---

### SerializationError

#### Extends

- [`StorageError`](#storageerror)

#### Constructors

##### Constructor

```ts
new SerializationError(message: string, options?: StorageErrorOptions): SerializationError;
```

###### Parameters

| Parameter | Type                                          |
| --------- | --------------------------------------------- |
| `message` | `string`                                      |
| `options` | [`StorageErrorOptions`](#storageerroroptions) |

###### Returns

[`SerializationError`](#serializationerror)

###### Overrides

[`StorageError`](#storageerror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                          |
| -------------------------------- | ---------- | ------------------------------------------ | ------------------------------------------------------- |
| <a id="code-2"></a> `code`       | `readonly` | [`StorageErrorCode`](#storageerrorcode)    | [`StorageError`](#storageerror).[`code`](#code)         |
| <a id="details-3"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`StorageError`](#storageerror).[`details`](#details-1) |

---

### QuotaExceededError

#### Extends

- [`StorageError`](#storageerror)

#### Constructors

##### Constructor

```ts
new QuotaExceededError(message: string, options?: StorageErrorOptions): QuotaExceededError;
```

###### Parameters

| Parameter | Type                                          |
| --------- | --------------------------------------------- |
| `message` | `string`                                      |
| `options` | [`StorageErrorOptions`](#storageerroroptions) |

###### Returns

[`QuotaExceededError`](#quotaexceedederror)

###### Overrides

[`StorageError`](#storageerror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                          |
| -------------------------------- | ---------- | ------------------------------------------ | ------------------------------------------------------- |
| <a id="code-3"></a> `code`       | `readonly` | [`StorageErrorCode`](#storageerrorcode)    | [`StorageError`](#storageerror).[`code`](#code)         |
| <a id="details-4"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`StorageError`](#storageerror).[`details`](#details-1) |

---

### MigrationError

#### Extends

- [`StorageError`](#storageerror)

#### Constructors

##### Constructor

```ts
new MigrationError(message: string, options?: StorageErrorOptions): MigrationError;
```

###### Parameters

| Parameter | Type                                          |
| --------- | --------------------------------------------- |
| `message` | `string`                                      |
| `options` | [`StorageErrorOptions`](#storageerroroptions) |

###### Returns

[`MigrationError`](#migrationerror)

###### Overrides

[`StorageError`](#storageerror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                          |
| -------------------------------- | ---------- | ------------------------------------------ | ------------------------------------------------------- |
| <a id="code-4"></a> `code`       | `readonly` | [`StorageErrorCode`](#storageerrorcode)    | [`StorageError`](#storageerror).[`code`](#code)         |
| <a id="details-5"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`StorageError`](#storageerror).[`details`](#details-1) |

---

### AdapterError

#### Extends

- [`StorageError`](#storageerror)

#### Constructors

##### Constructor

```ts
new AdapterError(message: string, options?: StorageErrorOptions): AdapterError;
```

###### Parameters

| Parameter | Type                                          |
| --------- | --------------------------------------------- |
| `message` | `string`                                      |
| `options` | [`StorageErrorOptions`](#storageerroroptions) |

###### Returns

[`AdapterError`](#adaptererror)

###### Overrides

[`StorageError`](#storageerror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                          |
| -------------------------------- | ---------- | ------------------------------------------ | ------------------------------------------------------- |
| <a id="code-5"></a> `code`       | `readonly` | [`StorageErrorCode`](#storageerrorcode)    | [`StorageError`](#storageerror).[`code`](#code)         |
| <a id="details-6"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`StorageError`](#storageerror).[`details`](#details-1) |

## Interfaces

### StorageErrorOptions

#### Properties

| Property                        | Modifier   | Type          |
| ------------------------------- | ---------- | ------------- |
| <a id="cause"></a> `cause?`     | `readonly` | `unknown`     |
| <a id="details"></a> `details?` | `readonly` | `PlainObject` |

---

### TtlDuration

Duration for TTL policies — convert to milliseconds at write time.

#### Properties

| Property                                  | Modifier   | Type     |
| ----------------------------------------- | ---------- | -------- |
| <a id="milliseconds"></a> `milliseconds?` | `readonly` | `number` |
| <a id="seconds"></a> `seconds?`           | `readonly` | `number` |
| <a id="minutes"></a> `minutes?`           | `readonly` | `number` |
| <a id="hours"></a> `hours?`               | `readonly` | `number` |
| <a id="days"></a> `days?`                 | `readonly` | `number` |

---

### StoragePolicy

Named write preset — v1 honors `ttl` only.

#### Properties

| Property                | Modifier   | Type                          |
| ----------------------- | ---------- | ----------------------------- |
| <a id="ttl"></a> `ttl?` | `readonly` | [`TtlDuration`](#ttlduration) |

---

### StorageAdapter

Sync string key/value backend (browser Storage-compatible).

#### Methods

##### getItem()

```ts
getItem(key: string): string | null;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`string` \| `null`

##### setItem()

```ts
setItem(key: string, value: string): void;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |
| `value`   | `string` |

###### Returns

`void`

##### removeItem()

```ts
removeItem(key: string): void;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`void`

##### keys()?

```ts
optional keys(): readonly string[];
```

Optional: list all keys (required for namespace `clear`).

###### Returns

readonly `string`[]

---

### StorageEnvelopeV1

#### Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `T`            | `unknown`    |

#### Properties

| Property                                   | Modifier   | Type     |
| ------------------------------------------ | ---------- | -------- |
| <a id="v"></a> `v`                         | `readonly` | `1`      |
| <a id="schemaversion"></a> `schemaVersion` | `readonly` | `string` |
| <a id="savedat"></a> `savedAt`             | `readonly` | `number` |
| <a id="expiresat"></a> `expiresAt?`        | `readonly` | `number` |
| <a id="value"></a> `value`                 | `readonly` | `T`      |

---

### CreateStorageOptions

#### Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `T`            | `unknown`    |

#### Properties

| Property                                      | Modifier   | Type                                                                                                                                          | Description                                                                                                                                     |
| --------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="namespace"></a> `namespace`            | `readonly` | `string`                                                                                                                                      | -                                                                                                                                               |
| <a id="adapter"></a> `adapter`                | `readonly` | [`StorageAdapter`](#storageadapter)                                                                                                           | -                                                                                                                                               |
| <a id="ttl-1"></a> `ttl?`                     | `readonly` | [`TtlDuration`](#ttlduration)                                                                                                                 | Default TTL when `set` omits per-write TTL and policy TTL.                                                                                      |
| <a id="policies"></a> `policies?`             | `readonly` | `Readonly`\<`Record`\<`string`, [`StoragePolicy`](#storagepolicy)\>\>                                                                         | Named write presets (copied into an instance-local map).                                                                                        |
| <a id="schemaversion-1"></a> `schemaVersion?` | `readonly` | `string`                                                                                                                                      | App schema id stored on envelopes (default `"1"`).                                                                                              |
| <a id="serialize"></a> `serialize?`           | `readonly` | (`value`: `unknown`) => `string`                                                                                                              | -                                                                                                                                               |
| <a id="deserialize"></a> `deserialize?`       | `readonly` | (`raw`: `string`) => `unknown`                                                                                                                | -                                                                                                                                               |
| <a id="migrate"></a> `migrate?`               | `readonly` | (`envelope`: [`StorageEnvelope`](#storageenvelope)\<`T`\>, `fromVersion`: `string`) => [`StorageEnvelope`](#storageenvelope)\<`T`\> \| `null` | Called when a loaded envelope's `schemaVersion` differs from the configured version. Return the migrated envelope, or `null` to drop the entry. |

---

### SetStorageOptions

#### Properties

| Property                      | Modifier   | Type                          | Description                                                                          |
| ----------------------------- | ---------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| <a id="ttl-2"></a> `ttl?`     | `readonly` | [`TtlDuration`](#ttlduration) | -                                                                                    |
| <a id="policy"></a> `policy?` | `readonly` | `string`                      | Named policy from `policies` / `definePolicy` (validated even when `ttl` overrides). |

---

### JayOnCodeStorage

#### Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `T`            | `unknown`    |

#### Properties

| Property                                     | Modifier   | Type     |
| -------------------------------------------- | ---------- | -------- |
| <a id="namespace-1"></a> `namespace`         | `readonly` | `string` |
| <a id="schemaversion-2"></a> `schemaVersion` | `readonly` | `string` |

#### Methods

##### get()

```ts
get(key: string): T | null;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`T` \| `null`

##### set()

```ts
set(
   key: string,
   value: T,
   options?: SetStorageOptions): void;
```

###### Parameters

| Parameter  | Type                                      |
| ---------- | ----------------------------------------- |
| `key`      | `string`                                  |
| `value`    | `T`                                       |
| `options?` | [`SetStorageOptions`](#setstorageoptions) |

###### Returns

`void`

##### remove()

```ts
remove(key: string): void;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`void`

##### has()

```ts
has(key: string): boolean;
```

Whether a non-expired envelope exists.
Does not migrate or persist — call `get` to upgrade schemaVersion.

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`boolean`

##### clear()

```ts
clear(): void;
```

Remove all keys in this namespace.
Requires `adapter.keys()`; throws `ConfigurationError` if missing.

###### Returns

`void`

##### peek()

```ts
peek(key: string): StorageEnvelope<T> | null;
```

Read the envelope without applying migration (still drops expired).

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

[`StorageEnvelope`](#storageenvelope)\<`T`\> \| `null`

##### definePolicy()

```ts
definePolicy(name: string, policy: StoragePolicy): void;
```

Register or replace a named write preset (ttl-only in v1).

###### Parameters

| Parameter | Type                              |
| --------- | --------------------------------- |
| `name`    | `string`                          |
| `policy`  | [`StoragePolicy`](#storagepolicy) |

###### Returns

`void`

## Type Aliases

### StorageErrorCode

```ts
type StorageErrorCode =
  | "configuration_error"
  | "serialization_error"
  | "quota_exceeded"
  | "migration_error"
  | "adapter_error";
```

---

### StorageEnvelope

```ts
type StorageEnvelope<T> = StorageEnvelopeV1<T>;
```

#### Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `T`            | `unknown`    |

## Variables

### packageId

```ts
const packageId: "storage" = "storage";
```

Stable package id for scaffolding / playground demos.

## Functions

### createMemoryAdapter()

```ts
function createMemoryAdapter(): StorageAdapter;
```

In-memory adapter backed by a `Map`. Use for tests, SSR, and ephemeral data.

Import from the package root (not a repo file path):

```ts
import { createMemoryAdapter } from "@jayoncode/storage";
```

#### Returns

[`StorageAdapter`](#storageadapter)

---

### createLocalStorageAdapter()

```ts
function createLocalStorageAdapter(): StorageAdapter;
```

Explicit `localStorage` adapter — values survive reload in the browser.

```ts
import { createLocalStorageAdapter } from "@jayoncode/storage";
```

#### Returns

[`StorageAdapter`](#storageadapter)

---

### createSessionStorageAdapter()

```ts
function createSessionStorageAdapter(): StorageAdapter;
```

Explicit `sessionStorage` adapter — values last for the tab session.

```ts
import { createSessionStorageAdapter } from "@jayoncode/storage";
```

#### Returns

[`StorageAdapter`](#storageadapter)

---

### createStorage()

```ts
function createStorage<T>(options: CreateStorageOptions<T>): JayOnCodeStorage<T>;
```

#### Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `T`            | `unknown`    |

#### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `options` | [`CreateStorageOptions`](#createstorageoptions)\<`T`\> |

#### Returns

[`JayOnCodeStorage`](#jayoncodestorage)\<`T`\>

---

### defaultSerialize()

```ts
function defaultSerialize(value: unknown): string;
```

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`string`

---

### defaultDeserialize()

```ts
function defaultDeserialize(raw: string): unknown;
```

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `raw`     | `string` |

#### Returns

`unknown`

---

### isQuotaExceededError()

```ts
function isQuotaExceededError(error: unknown): boolean;
```

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `error`   | `unknown` |

#### Returns

`boolean`
