**@jayoncode/form-intelligence API**

---

# @jayoncode/form-intelligence API

## Classes

### FormModuleHost

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Constructors

##### Constructor

```ts
new FormModuleHost<TValues>(
   form: FormInstance<TValues>,
   config: ResolvedFormConfig<TValues>,
   events: FormEventBus,
pluginRegistry: PluginRegistry<TValues>): FormModuleHost<TValues>;
```

###### Parameters

| Parameter        | Type                                         |
| ---------------- | -------------------------------------------- |
| `form`           | [`FormInstance`](#forminstance)\<`TValues`\> |
| `config`         | `ResolvedFormConfig`\<`TValues`\>            |
| `events`         | `FormEventBus`                               |
| `pluginRegistry` | `PluginRegistry`\<`TValues`\>                |

###### Returns

[`FormModuleHost`](#formmodulehost)\<`TValues`\>

#### Methods

##### register()

```ts
register(module: FormModule<TValues>): void;
```

###### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `module`  | [`FormModule`](#formmodule)\<`TValues`\> |

###### Returns

`void`

##### registerPlugin()

```ts
registerPlugin(plugin: FormPlugin<TValues>, order?: number): void;
```

###### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `plugin`  | [`FormPlugin`](#formplugin)\<`TValues`\> |
| `order`   | `number`                                 |

###### Returns

`void`

##### has()

```ts
has(id: string): boolean;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `id`      | `string` |

###### Returns

`boolean`

##### start()

```ts
start(): void;
```

###### Returns

`void`

##### destroy()

```ts
destroy(): void;
```

###### Returns

`void`

---

### FormModuleRegistry

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Constructors

##### Constructor

```ts
new FormModuleRegistry<TValues>(): FormModuleRegistry<TValues>;
```

###### Returns

[`FormModuleRegistry`](#formmoduleregistry)\<`TValues`\>

#### Methods

##### register()

```ts
register(module: FormModule<TValues>): void;
```

###### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `module`  | [`FormModule`](#formmodule)\<`TValues`\> |

###### Returns

`void`

##### unregister()

```ts
unregister(id: string): boolean;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `id`      | `string` |

###### Returns

`boolean`

##### has()

```ts
has(id: string): boolean;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `id`      | `string` |

###### Returns

`boolean`

##### size()

```ts
size(): number;
```

###### Returns

`number`

##### list()

```ts
list(): readonly FormModule<TValues>[];
```

###### Returns

readonly [`FormModule`](#formmodule)\<`TValues`\>[]

##### initializeAll()

```ts
initializeAll(context: FormModuleContext<TValues>): void;
```

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

##### startAll()

```ts
startAll(context: FormModuleContext<TValues>): void;
```

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

##### stopAll()

```ts
stopAll(context: FormModuleContext<TValues>): void;
```

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

##### destroyAll()

```ts
destroyAll(context: FormModuleContext<TValues>): void;
```

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

---

### DependencyEngine

Structural dependency graph façade (Phase 6 / ADR-007).

#### Constructors

##### Constructor

```ts
new DependencyEngine(options?: DependencyEngineOptions): DependencyEngine;
```

###### Parameters

| Parameter | Type                      |
| --------- | ------------------------- |
| `options` | `DependencyEngineOptions` |

###### Returns

[`DependencyEngine`](#dependencyengine)

#### Methods

##### registerMap()

```ts
registerMap(map: DependencyMap, options?: {
  actions?: readonly DependencyAction[];
  actionsByChild?: Partial<Record<string, readonly DependencyAction[]>>;
  inferred?: boolean;
}): void;
```

###### Parameters

| Parameter                 | Type                                                                                                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `map`                     | [`DependencyMap`](#dependencymap)                                                                                                                                                                       |
| `options?`                | \{ `actions?`: readonly [`DependencyAction`](#dependencyaction)[]; `actionsByChild?`: `Partial`\<`Record`\<`string`, readonly [`DependencyAction`](#dependencyaction)[]\>\>; `inferred?`: `boolean`; \} |
| `options.actions?`        | readonly [`DependencyAction`](#dependencyaction)[]                                                                                                                                                      |
| `options.actionsByChild?` | `Partial`\<`Record`\<`string`, readonly [`DependencyAction`](#dependencyaction)[]\>\>                                                                                                                   |
| `options.inferred?`       | `boolean`                                                                                                                                                                                               |

###### Returns

`void`

##### addEdge()

```ts
addEdge(
   child: string,
   parents: readonly string[],
   actions?: readonly DependencyAction[],
   options?: {
  clearValue?: unknown;
  inferred?: boolean;
}): void;
```

###### Parameters

| Parameter             | Type                                                    | Default value                |
| --------------------- | ------------------------------------------------------- | ---------------------------- |
| `child`               | `string`                                                | `undefined`                  |
| `parents`             | readonly `string`[]                                     | `undefined`                  |
| `actions`             | readonly [`DependencyAction`](#dependencyaction)[]      | `DEFAULT_DEPENDENCY_ACTIONS` |
| `options?`            | \{ `clearValue?`: `unknown`; `inferred?`: `boolean`; \} | `undefined`                  |
| `options.clearValue?` | `unknown`                                               | `undefined`                  |
| `options.inferred?`   | `boolean`                                               | `undefined`                  |

###### Returns

`void`

##### addEdgeConfig()

```ts
addEdgeConfig(config: DependencyEdgeConfig & {
  to: string;
}): void;
```

###### Parameters

| Parameter | Type                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `config`  | [`DependencyEdgeConfig`](#dependencyedgeconfig) & \{ `to`: `string`; \} |

###### Returns

`void`

##### syncInferredFromFields()

```ts
syncInferredFromFields<TValues>(fields: ReadonlyMap<string, FieldOptions<TValues>>): void;
```

Sync inferred edges from `FieldOptions.dependsOn` (revalidate-only).

###### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

###### Parameters

| Parameter | Type                                                                      |
| --------- | ------------------------------------------------------------------------- |
| `fields`  | `ReadonlyMap`\<`string`, [`FieldOptions`](#fieldoptions-1)\<`TValues`\>\> |

###### Returns

`void`

##### getDependents()

```ts
getDependents(path: string): readonly string[];
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

readonly `string`[]

##### getParents()

```ts
getParents(path: string): readonly string[];
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

readonly `string`[]

##### detectCycles()

```ts
detectCycles(): readonly readonly string[][];
```

###### Returns

readonly readonly `string`[][]

##### topologicalOrder()

```ts
topologicalOrder(seeds?: readonly string[]): readonly string[];
```

###### Parameters

| Parameter | Type                |
| --------- | ------------------- |
| `seeds?`  | readonly `string`[] |

###### Returns

readonly `string`[]

##### inspect()

```ts
inspect(): DependencyGraph;
```

###### Returns

[`DependencyGraph`](#dependencygraph)

##### onParentChange()

```ts
onParentChange(path: string): CascadeResult;
```

Propagate a parent change: clear / revalidate / recompute / reloadOptions
for dependents in topological order.

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

[`CascadeResult`](#cascaderesult)

---

### FormIntelligentError

#### Extends

- `Error`

#### Extended by

- [`ConfigurationError`](#configurationerror)
- [`DraftStorageError`](#draftstorageerror)
- [`OfflineQueueError`](#offlinequeueerror)
- [`PluginError`](#pluginerror)
- [`SubmitError`](#submiterror)
- [`ValidationError`](#validationerror)
- [`WorkflowError`](#workflowerror)

#### Constructors

##### Constructor

```ts
new FormIntelligentError(
   message: string,
   code: FormErrorCode,
   options?: FormErrorOptions): FormIntelligentError;
```

###### Parameters

| Parameter | Type               |
| --------- | ------------------ |
| `message` | `string`           |
| `code`    | `FormErrorCode`    |
| `options` | `FormErrorOptions` |

###### Returns

[`FormIntelligentError`](#formintelligenterror)

###### Overrides

```ts
Error.constructor;
```

#### Properties

| Property                       | Modifier   | Type                                       |
| ------------------------------ | ---------- | ------------------------------------------ |
| <a id="code"></a> `code`       | `readonly` | `FormErrorCode`                            |
| <a id="details"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` |

---

### ValidationError

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new ValidationError(message: string, options?: FormErrorOptions): ValidationError;
```

###### Parameters

| Parameter | Type               |
| --------- | ------------------ |
| `message` | `string`           |
| `options` | `FormErrorOptions` |

###### Returns

[`ValidationError`](#validationerror)

###### Overrides

[`FormIntelligentError`](#formintelligenterror).[`constructor`](#constructor-3)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                                        |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- |
| <a id="code-1"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       |
| <a id="details-1"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) |

---

### SubmitError

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new SubmitError(message: string, options?: FormErrorOptions): SubmitError;
```

###### Parameters

| Parameter | Type               |
| --------- | ------------------ |
| `message` | `string`           |
| `options` | `FormErrorOptions` |

###### Returns

[`SubmitError`](#submiterror)

###### Overrides

[`FormIntelligentError`](#formintelligenterror).[`constructor`](#constructor-3)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                                        |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- |
| <a id="code-2"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       |
| <a id="details-2"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) |

---

### WorkflowError

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new WorkflowError(message: string, options?: FormErrorOptions): WorkflowError;
```

###### Parameters

| Parameter | Type               |
| --------- | ------------------ |
| `message` | `string`           |
| `options` | `FormErrorOptions` |

###### Returns

[`WorkflowError`](#workflowerror)

###### Overrides

[`FormIntelligentError`](#formintelligenterror).[`constructor`](#constructor-3)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                                        |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- |
| <a id="code-3"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       |
| <a id="details-3"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) |

---

### ConfigurationError

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new ConfigurationError(message: string, options?: FormErrorOptions): ConfigurationError;
```

###### Parameters

| Parameter | Type               |
| --------- | ------------------ |
| `message` | `string`           |
| `options` | `FormErrorOptions` |

###### Returns

[`ConfigurationError`](#configurationerror)

###### Overrides

[`FormIntelligentError`](#formintelligenterror).[`constructor`](#constructor-3)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                                        |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- |
| <a id="code-4"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       |
| <a id="details-4"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) |

---

### DraftStorageError

Recoverable draft persistence failures (quota, corrupt payload).

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new DraftStorageError(message: string, options?: FormErrorOptions): DraftStorageError;
```

###### Parameters

| Parameter | Type               |
| --------- | ------------------ |
| `message` | `string`           |
| `options` | `FormErrorOptions` |

###### Returns

[`DraftStorageError`](#draftstorageerror)

###### Overrides

[`FormIntelligentError`](#formintelligenterror).[`constructor`](#constructor-3)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                                        |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- |
| <a id="code-5"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       |
| <a id="details-5"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) |

---

### OfflineQueueError

Offline queue failures (quota, overflow reject).

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new OfflineQueueError(message: string, options?: FormErrorOptions): OfflineQueueError;
```

###### Parameters

| Parameter | Type               |
| --------- | ------------------ |
| `message` | `string`           |
| `options` | `FormErrorOptions` |

###### Returns

[`OfflineQueueError`](#offlinequeueerror)

###### Overrides

[`FormIntelligentError`](#formintelligenterror).[`constructor`](#constructor-3)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                                        |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- |
| <a id="code-6"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       |
| <a id="details-6"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) |

---

### PluginError

Isolated plugin/middleware failures (setup or hook throw).

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new PluginError(message: string, options?: FormErrorOptions): PluginError;
```

###### Parameters

| Parameter | Type               |
| --------- | ------------------ |
| `message` | `string`           |
| `options` | `FormErrorOptions` |

###### Returns

[`PluginError`](#pluginerror)

###### Overrides

[`FormIntelligentError`](#formintelligenterror).[`constructor`](#constructor-3)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                                        |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- |
| <a id="code-7"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       |
| <a id="details-7"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) |

---

### MiddlewarePipeline

Onion middleware registry. Lower `order` runs earlier (outer). Same order → registration order.

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Constructors

##### Constructor

```ts
new MiddlewarePipeline<TValues>(): MiddlewarePipeline<TValues>;
```

###### Returns

[`MiddlewarePipeline`](#middlewarepipeline)\<`TValues`\>

#### Methods

##### use()

```ts
use(middleware: MiddlewareInput<TValues>): () => void;
```

###### Parameters

| Parameter    | Type                                               |
| ------------ | -------------------------------------------------- |
| `middleware` | [`MiddlewareInput`](#middlewareinput)\<`TValues`\> |

###### Returns

() => `void`

##### run()

```ts
run(input: {
  form: FormInstance<TValues>;
  phase: MiddlewarePhase;
  signal: AbortSignal;
  meta?: Readonly<Record<string, unknown>>;
}): Promise<MiddlewareRunResult>;
```

###### Parameters

| Parameter      | Type                                                                                                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`        | \{ `form`: [`FormInstance`](#forminstance)\<`TValues`\>; `phase`: [`MiddlewarePhase`](#middlewarephase); `signal`: `AbortSignal`; `meta?`: `Readonly`\<`Record`\<`string`, `unknown`\>\>; \} |
| `input.form`   | [`FormInstance`](#forminstance)\<`TValues`\>                                                                                                                                                 |
| `input.phase`  | [`MiddlewarePhase`](#middlewarephase)                                                                                                                                                        |
| `input.signal` | `AbortSignal`                                                                                                                                                                                |
| `input.meta?`  | `Readonly`\<`Record`\<`string`, `unknown`\>\>                                                                                                                                                |

###### Returns

`Promise`\<[`MiddlewareRunResult`](#middlewarerunresult)\>

##### clear()

```ts
clear(): void;
```

###### Returns

`void`

## Interfaces

### FormController

Thin façade over `FormInstance` for adapters and design systems.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                   | Modifier   | Type                                   |
| -------------------------- | ---------- | -------------------------------------- |
| <a id="state"></a> `state` | `readonly` | [`FormState`](#formstate)\<`TValues`\> |

#### Methods

##### subscribe()

```ts
subscribe(listener: () => void): () => void;
```

###### Parameters

| Parameter  | Type         |
| ---------- | ------------ |
| `listener` | () => `void` |

###### Returns

() => `void`

##### getSnapshot()

```ts
getSnapshot(): FormState<TValues>;
```

###### Returns

[`FormState`](#formstate)\<`TValues`\>

##### submit()

```ts
submit(options?: SubmitOptions): Promise<boolean>;
```

###### Parameters

| Parameter  | Type                              |
| ---------- | --------------------------------- |
| `options?` | [`SubmitOptions`](#submitoptions) |

###### Returns

`Promise`\<`boolean`\>

##### reset()

```ts
reset(options?: ResetOptions<TValues>): void;
```

###### Parameters

| Parameter  | Type                                         |
| ---------- | -------------------------------------------- |
| `options?` | [`ResetOptions`](#resetoptions)\<`TValues`\> |

###### Returns

`void`

##### field()

```ts
field(path: string): FieldController<TValues>;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

[`FieldController`](#fieldcontroller)\<`TValues`\>

##### firstInvalidPath()

```ts
firstInvalidPath(): string | undefined;
```

First path with a non-empty error message.

###### Returns

`string` \| `undefined`

##### focusFirstInvalid()

```ts
focusFirstInvalid(): string | undefined;
```

Focuses the first invalid control when a DOM document is available.
Returns the path (or `undefined` if none). Safe no-op under SSR.

###### Returns

`string` \| `undefined`

##### destroy()

```ts
destroy(): void;
```

###### Returns

`void`

---

### FrameworkAdapter

Contract for framework UI adapters (React, Vue, Angular, Svelte, …).
Implementations ship in separate packages — never required by core.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                 | Modifier   | Type     |
| ------------------------ | ---------- | -------- |
| <a id="name"></a> `name` | `readonly` | `string` |

#### Methods

##### connect()

```ts
connect(form: FormInstance<TValues>): void | (() => void);
```

Bind framework lifecycle / reactivity to a form instance.
Return a cleanup that disconnects subscriptions and effects.

###### Parameters

| Parameter | Type                                         |
| --------- | -------------------------------------------- |
| `form`    | [`FormInstance`](#forminstance)\<`TValues`\> |

###### Returns

`void` \| (() => `void`)

---

### PersistenceAdapter

Persist form values for drafts and autosave.
Implementations may be sync (localStorage) or async (IndexedDB, remote).

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     |
| --------------------------- | ---------- | -------- |
| <a id="name-1"></a> `name?` | `readonly` | `string` |

#### Methods

##### load()

```ts
load(key: string): TValues | Promise<TValues | null> | null;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`TValues` \| `Promise`\<`TValues` \| `null`\> \| `null`

##### save()

```ts
save(key: string, values: TValues): void | Promise<void>;
```

###### Parameters

| Parameter | Type      |
| --------- | --------- |
| `key`     | `string`  |
| `values`  | `TValues` |

###### Returns

`void` \| `Promise`\<`void`\>

##### clear()

```ts
clear(key: string): void | Promise<void>;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`void` \| `Promise`\<`void`\>

---

### SyncPersistenceAdapter

Sync persistence surface used by draft workflow today.
Compatible with [PersistenceAdapter](#persistenceadapter) when methods are synchronous.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     |
| --------------------------- | ---------- | -------- |
| <a id="name-2"></a> `name?` | `readonly` | `string` |

#### Methods

##### load()

```ts
load(key: string): TValues | null;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`TValues` \| `null`

##### save()

```ts
save(key: string, values: TValues): void;
```

###### Parameters

| Parameter | Type      |
| --------- | --------- |
| `key`     | `string`  |
| `values`  | `TValues` |

###### Returns

`void`

##### clear()

```ts
clear(key: string): void;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`void`

---

### SchemaAdapter

Bridge any validation library into Form Intelligence.
Schema adapters are optional — core never depends on Zod/Yup/etc.
Error keys are field paths (dot notation).

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     |
| --------------------------- | ---------- | -------- |
| <a id="name-3"></a> `name?` | `readonly` | `string` |

#### Methods

##### validate()

```ts
validate(values: TValues):
  | Readonly<Record<string, string>>
| Promise<Readonly<Record<string, string>>>;
```

###### Parameters

| Parameter | Type      |
| --------- | --------- |
| `values`  | `TValues` |

###### Returns

\| `Readonly`\<`Record`\<`string`, `string`\>\>
\| `Promise`\<`Readonly`\<`Record`\<`string`, `string`\>\>\>

---

### SubmitTransportAdapter

Transport layer for form submission (fetch, GraphQL, custom API clients).
Keep UI frameworks out of this interface — values + meta only.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |
| `TResult`                                           | `unknown`                       |

#### Properties

| Property                    | Modifier   | Type     |
| --------------------------- | ---------- | -------- |
| <a id="name-4"></a> `name?` | `readonly` | `string` |

#### Methods

##### submit()

```ts
submit(values: TValues, meta?: SubmitMeta): TResult | Promise<TResult>;
```

###### Parameters

| Parameter | Type                        |
| --------- | --------------------------- |
| `values`  | `TValues`                   |
| `meta?`   | [`SubmitMeta`](#submitmeta) |

###### Returns

`TResult` \| `Promise`\<`TResult`\>

---

### FormModuleContext

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                     | Modifier   | Type                                         |
| ---------------------------- | ---------- | -------------------------------------------- |
| <a id="form"></a> `form`     | `readonly` | [`FormInstance`](#forminstance)\<`TValues`\> |
| <a id="config"></a> `config` | `readonly` | `ResolvedFormConfig`\<`TValues`\>            |
| <a id="events"></a> `events` | `readonly` | `FormEventBus`                               |

#### Methods

##### registerCleanup()

```ts
registerCleanup(cleanup: () => void): void;
```

###### Parameters

| Parameter | Type         |
| --------- | ------------ |
| `cleanup` | () => `void` |

###### Returns

`void`

---

### FormModule

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     |
| --------------------------- | ---------- | -------- |
| <a id="id"></a> `id`        | `readonly` | `string` |
| <a id="order"></a> `order?` | `readonly` | `number` |

#### Methods

##### initialize()?

```ts
optional initialize(context: FormModuleContext<TValues>): void;
```

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

##### start()?

```ts
optional start(context: FormModuleContext<TValues>): void;
```

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

##### stop()?

```ts
optional stop(context: FormModuleContext<TValues>): void;
```

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

##### destroy()?

```ts
optional destroy(context: FormModuleContext<TValues>): void;
```

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

---

### FieldAriaIds

#### Properties

| Property                                    | Modifier   | Type     |
| ------------------------------------------- | ---------- | -------- |
| <a id="errorid"></a> `errorId?`             | `readonly` | `string` |
| <a id="descriptionid"></a> `descriptionId?` | `readonly` | `string` |

---

### FieldAria

CamelCase ARIA snapshot for adapters and FieldController.

#### Properties

| Property                                       | Modifier   | Type                    |
| ---------------------------------------------- | ---------- | ----------------------- |
| <a id="ariainvalid"></a> `ariaInvalid`         | `readonly` | `boolean`               |
| <a id="ariarequired"></a> `ariaRequired`       | `readonly` | `boolean`               |
| <a id="ariadescribedby"></a> `ariaDescribedBy` | `readonly` | `string` \| `undefined` |

---

### FieldAriaAttributes

Spread-friendly DOM attributes (`{...field.aria.attributes}`).

#### Properties

| Property                                         | Modifier   | Type                     |
| ------------------------------------------------ | ---------- | ------------------------ |
| <a id="aria-invalid"></a> `aria-invalid`         | `readonly` | `boolean`                |
| <a id="aria-required"></a> `aria-required`       | `readonly` | `boolean` \| `undefined` |
| <a id="aria-describedby"></a> `aria-describedby` | `readonly` | `string` \| `undefined`  |

---

### ComputeFieldAriaInput

#### Properties

| Property                          | Modifier   | Type                            | Description                                         |
| --------------------------------- | ---------- | ------------------------------- | --------------------------------------------------- |
| <a id="error"></a> `error?`       | `readonly` | `string`                        | -                                                   |
| <a id="required"></a> `required?` | `readonly` | `boolean`                       | True when presentation/UI marks the field required. |
| <a id="ids"></a> `ids?`           | `readonly` | [`FieldAriaIds`](#fieldariaids) | -                                                   |

---

### FieldAriaResult

#### Properties

| Property                             | Modifier   | Type                                          |
| ------------------------------------ | ---------- | --------------------------------------------- |
| <a id="aria"></a> `aria`             | `readonly` | [`FieldAria`](#fieldaria)                     |
| <a id="attributes"></a> `attributes` | `readonly` | [`FieldAriaAttributes`](#fieldariaattributes) |

---

### CalculationBuilder

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Methods

##### from()

```ts
from(...deps: string[]): CalculationBuilder<TValues>;
```

###### Parameters

| Parameter | Type       |
| --------- | ---------- |
| ...`deps` | `string`[] |

###### Returns

[`CalculationBuilder`](#calculationbuilder)\<`TValues`\>

##### lazy()

```ts
lazy(enabled?: boolean): CalculationBuilder<TValues>;
```

###### Parameters

| Parameter  | Type      |
| ---------- | --------- |
| `enabled?` | `boolean` |

###### Returns

[`CalculationBuilder`](#calculationbuilder)\<`TValues`\>

##### memoized()

```ts
memoized(enabled?: boolean): CalculationBuilder<TValues>;
```

###### Parameters

| Parameter  | Type      |
| ---------- | --------- |
| `enabled?` | `boolean` |

###### Returns

[`CalculationBuilder`](#calculationbuilder)\<`TValues`\>

##### markDirty()

```ts
markDirty(enabled?: boolean): CalculationBuilder<TValues>;
```

###### Parameters

| Parameter  | Type      |
| ---------- | --------- |
| `enabled?` | `boolean` |

###### Returns

[`CalculationBuilder`](#calculationbuilder)\<`TValues`\>

##### compute()

```ts
compute(fn: (ctx: CalculationComputeContext<TValues>) => unknown): void;
```

###### Parameters

| Parameter | Type                                                           |
| --------- | -------------------------------------------------------------- |
| `fn`      | (`ctx`: `CalculationComputeContext`\<`TValues`\>) => `unknown` |

###### Returns

`void`

---

### CalculationDefinition

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                              | Modifier   | Type                                                               | Description                                                                |
| ------------------------------------- | ---------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| <a id="path"></a> `path`              | `readonly` | `string`                                                           | -                                                                          |
| <a id="compute-1"></a> `compute`      | `readonly` | (`context`: `CalculationComputeContext`\<`TValues`\>) => `unknown` | -                                                                          |
| <a id="deps"></a> `deps?`             | `readonly` | readonly `string`[]                                                | -                                                                          |
| <a id="markdirty-1"></a> `markDirty?` | `readonly` | `boolean`                                                          | When true, writing the derived value marks the field dirty. Default false. |
| <a id="lazy-1"></a> `lazy?`           | `readonly` | `boolean`                                                          | Skip initial compute on register; still runs when deps change.             |
| <a id="memoized-1"></a> `memoized?`   | `readonly` | `boolean`                                                          | Skip compute when dependency fingerprint is unchanged.                     |

---

### CalculateOptions

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                              | Modifier   | Type                                                 |
| ------------------------------------- | ---------- | ---------------------------------------------------- |
| <a id="deps-1"></a> `deps?`           | `readonly` | readonly `string`[]                                  |
| <a id="markdirty-2"></a> `markDirty?` | `readonly` | `boolean`                                            |
| <a id="lazy-2"></a> `lazy?`           | `readonly` | `boolean`                                            |
| <a id="memoized-2"></a> `memoized?`   | `readonly` | `boolean`                                            |
| <a id="compute-2"></a> `compute`      | `readonly` | (`context`: \{ `values`: `TValues`; \}) => `unknown` |

---

### DependencyRegistrar()

#### Type Parameters

| Type Parameter                                       | Default type                    |
| ---------------------------------------------------- | ------------------------------- |
| `_TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

```ts
DependencyRegistrar(map: DependencyMap): DependencyRegistrar<_TValues>;
```

#### Parameters

| Parameter | Type                              |
| --------- | --------------------------------- |
| `map`     | [`DependencyMap`](#dependencymap) |

#### Returns

[`DependencyRegistrar`](#dependencyregistrar)\<`_TValues`\>

#### Methods

##### link()

```ts
link(parent: string): {
  to: {
     effect: DependencyRegistrar<_TValues>;
  };
};
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `parent`  | `string` |

###### Returns

```ts
{
  to: {
    effect: DependencyRegistrar<_TValues>;
  }
}
```

| Name   | Type                                                                                                |
| ------ | --------------------------------------------------------------------------------------------------- |
| `to()` | (`child`: `string`) => \{ `effect`: [`DependencyRegistrar`](#dependencyregistrar)\<`_TValues`\>; \} |

##### edge()

```ts
edge(config: DependencyEdgeConfig & {
  to: string;
}): DependencyRegistrar<_TValues>;
```

###### Parameters

| Parameter | Type                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `config`  | [`DependencyEdgeConfig`](#dependencyedgeconfig) & \{ `to`: `string`; \} |

###### Returns

[`DependencyRegistrar`](#dependencyregistrar)\<`_TValues`\>

##### inspect()

```ts
inspect(): DependencyGraph;
```

###### Returns

[`DependencyGraph`](#dependencygraph)

---

### DependencyEdgeConfig

#### Properties

| Property                              | Modifier   | Type                                               |
| ------------------------------------- | ---------- | -------------------------------------------------- |
| <a id="from-1"></a> `from`            | `readonly` | `string` \| readonly `string`[]                    |
| <a id="actions"></a> `actions?`       | `readonly` | readonly [`DependencyAction`](#dependencyaction)[] |
| <a id="clearvalue"></a> `clearValue?` | `readonly` | `unknown`                                          |

---

### DependencyEdge

#### Properties

| Property                                | Modifier   | Type                                               | Description                                                                 |
| --------------------------------------- | ---------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| <a id="from-2"></a> `from`              | `readonly` | `string`                                           | -                                                                           |
| <a id="to"></a> `to`                    | `readonly` | `string`                                           | -                                                                           |
| <a id="actions-1"></a> `actions`        | `readonly` | readonly [`DependencyAction`](#dependencyaction)[] | -                                                                           |
| <a id="clearvalue-1"></a> `clearValue?` | `readonly` | `unknown`                                          | -                                                                           |
| <a id="inferred"></a> `inferred?`       | `readonly` | `boolean`                                          | Inferred from `FieldOptions.dependsOn` — cycles warn; explicit edges throw. |

---

### DependencyNode

#### Properties

| Property                         | Modifier   | Type                |
| -------------------------------- | ---------- | ------------------- |
| <a id="path-1"></a> `path`       | `readonly` | `string`            |
| <a id="parents"></a> `parents`   | `readonly` | readonly `string`[] |
| <a id="children"></a> `children` | `readonly` | readonly `string`[] |

---

### DependencyGraph

#### Properties

| Property                   | Modifier   | Type                                                           |
| -------------------------- | ---------- | -------------------------------------------------------------- |
| <a id="nodes"></a> `nodes` | `readonly` | `ReadonlyMap`\<`string`, [`DependencyNode`](#dependencynode)\> |
| <a id="edges"></a> `edges` | `readonly` | readonly [`DependencyEdge`](#dependencyedge)[]                 |

#### Methods

##### dependentsOf()

```ts
dependentsOf(path: string): readonly string[];
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

readonly `string`[]

##### parentsOf()

```ts
parentsOf(path: string): readonly string[];
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

readonly `string`[]

##### topoOrder()

```ts
topoOrder(seeds?: readonly string[]): readonly string[];
```

###### Parameters

| Parameter | Type                |
| --------- | ------------------- |
| `seeds?`  | readonly `string`[] |

###### Returns

readonly `string`[]

---

### CascadeResult

#### Properties

| Property                                   | Modifier   | Type                                                        |
| ------------------------------------------ | ---------- | ----------------------------------------------------------- |
| <a id="clears"></a> `clears`               | `readonly` | readonly \{ `path`: `string`; `clearValue`: `unknown`; \}[] |
| <a id="revalidate"></a> `revalidate`       | `readonly` | readonly `string`[]                                         |
| <a id="recompute"></a> `recompute`         | `readonly` | readonly `string`[]                                         |
| <a id="reloadoptions"></a> `reloadOptions` | `readonly` | readonly `string`[]                                         |

---

### PresentationState

#### Properties

| Property                       | Modifier   | Type                                                    |
| ------------------------------ | ---------- | ------------------------------------------------------- |
| <a id="field-1"></a> `field`   | `readonly` | [`FieldUiState`](#fielduistate)                         |
| <a id="options"></a> `options` | `readonly` | readonly [`FieldOption`](#fieldoption)[] \| `undefined` |
| <a id="form-1"></a> `form`     | `readonly` | [`FormUiState`](#formuistate)                           |

---

### PresentationSnapshot

#### Properties

| Property                                 | Modifier   | Type                                                                                          |
| ---------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| <a id="fieldui"></a> `fieldUi`           | `readonly` | [`FieldUiMap`](#fielduimap)                                                                   |
| <a id="formui"></a> `formUi`             | `readonly` | [`FormUiState`](#formuistate)                                                                 |
| <a id="fieldoptions"></a> `fieldOptions` | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), readonly [`FieldOption`](#fieldoption)[]\>\> |

---

### TransformContext

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                      | Modifier   | Type          |
| ----------------------------- | ---------- | ------------- |
| <a id="path-2"></a> `path`    | `readonly` | `string`      |
| <a id="values"></a> `values`  | `readonly` | `TValues`     |
| <a id="signal"></a> `signal?` | `readonly` | `AbortSignal` |

---

### SanitizeOptions

#### Properties

| Property                                            | Modifier   | Type      | Description                                                                    |
| --------------------------------------------------- | ---------- | --------- | ------------------------------------------------------------------------------ |
| <a id="striphtml"></a> `stripHtml?`                 | `readonly` | `boolean` | Strip simple HTML tags. Default true when `sanitize: true`.                    |
| <a id="stripcontrolchars"></a> `stripControlChars?` | `readonly` | `boolean` | Strip C0 control chars except tab/newline. Default true when `sanitize: true`. |

---

### TransformPipelineOptions

#### Properties

| Property                            | Modifier   | Type                                                                        |
| ----------------------------------- | ---------- | --------------------------------------------------------------------------- |
| <a id="trim"></a> `trim?`           | `readonly` | `boolean` \| `"start"` \| `"end"` \| `"both"`                               |
| <a id="normalize"></a> `normalize?` | `readonly` | `boolean` \| `"nfc"` \| `"nfd"`                                             |
| <a id="sanitize"></a> `sanitize?`   | `readonly` | `boolean` \| [`SanitizeOptions`](#sanitizeoptions)                          |
| <a id="parse"></a> `parse?`         | `readonly` | [`Parser`](#parser)                                                         |
| <a id="stages"></a> `stages?`       | `readonly` | readonly [`TransformFn`](#transformfn)\<`Record`\<`string`, `unknown`\>\>[] |

---

### TransformPipelineHandle

#### Methods

##### pipe()

```ts
pipe(...stages: TransformFn<Record<string, unknown>>[]): TransformPipelineHandle;
```

###### Parameters

| Parameter   | Type                                                               |
| ----------- | ------------------------------------------------------------------ |
| ...`stages` | [`TransformFn`](#transformfn)\<`Record`\<`string`, `unknown`\>\>[] |

###### Returns

[`TransformPipelineHandle`](#transformpipelinehandle)

##### clear()

```ts
clear(): void;
```

###### Returns

`void`

---

### FieldUiState

#### Properties

| Property                                  | Type                                                   | Description                                                                                                   |
| ----------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| <a id="visible"></a> `visible`            | `boolean`                                              | -                                                                                                             |
| <a id="disabled"></a> `disabled`          | `boolean`                                              | -                                                                                                             |
| <a id="required-1"></a> `required`        | `boolean` \| `undefined`                               | -                                                                                                             |
| <a id="readonly"></a> `readOnly?`         | `boolean`                                              | Additive — when true, controls should be non-editable but still focusable.                                    |
| <a id="busy"></a> `busy?`                 | `boolean`                                              | Additive — e.g. async option load / validating.                                                               |
| <a id="haserror"></a> `hasError?`         | `boolean`                                              | Derived UI projection (validation state): raw error present. Distinct from `showError` (whether to display).  |
| <a id="errormessage"></a> `errorMessage?` | `string`                                               | Derived UI projection: error string when present.                                                             |
| <a id="showerror"></a> `showError?`       | `boolean`                                              | Derived UI projection (UI state): whether the error should be displayed under the active errorDisplay policy. |
| <a id="status"></a> `status?`             | `"validating"` \| `"error"` \| `"success"` \| `"idle"` | Derived UI projection: exactly one of validating                                                              | error | success | idle. |

---

### FormUiState

#### Properties

| Property                                     | Modifier   | Type      |
| -------------------------------------------- | ---------- | --------- |
| <a id="submitdisabled"></a> `submitDisabled` | `readonly` | `boolean` |

---

### FieldOption

#### Properties

| Property                   | Modifier   | Type     |
| -------------------------- | ---------- | -------- |
| <a id="label"></a> `label` | `readonly` | `string` |
| <a id="value"></a> `value` | `readonly` | `string` |

---

### RuleContext

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                       | Modifier   | Type      |
| ------------------------------ | ---------- | --------- |
| <a id="values-1"></a> `values` | `readonly` | `TValues` |

#### Methods

##### show()

```ts
show(...paths: readonly string[]): void;
```

###### Parameters

| Parameter  | Type                |
| ---------- | ------------------- |
| ...`paths` | readonly `string`[] |

###### Returns

`void`

##### hide()

```ts
hide(...paths: readonly string[]): void;
```

###### Parameters

| Parameter  | Type                |
| ---------- | ------------------- |
| ...`paths` | readonly `string`[] |

###### Returns

`void`

##### require()

```ts
require(...paths: readonly string[]): void;
```

###### Parameters

| Parameter  | Type                |
| ---------- | ------------------- |
| ...`paths` | readonly `string`[] |

###### Returns

`void`

##### optional()

```ts
optional(...paths: readonly string[]): void;
```

###### Parameters

| Parameter  | Type                |
| ---------- | ------------------- |
| ...`paths` | readonly `string`[] |

###### Returns

`void`

##### enable()

```ts
enable(...paths: readonly string[]): void;
```

###### Parameters

| Parameter  | Type                |
| ---------- | ------------------- |
| ...`paths` | readonly `string`[] |

###### Returns

`void`

##### disable()

```ts
disable(...paths: readonly string[]): void;
```

###### Parameters

| Parameter  | Type                |
| ---------- | ------------------- |
| ...`paths` | readonly `string`[] |

###### Returns

`void`

##### disableSubmit()

```ts
disableSubmit(): void;
```

###### Returns

`void`

##### enableSubmit()

```ts
enableSubmit(): void;
```

###### Returns

`void`

##### setValue()

```ts
setValue(path: string, value: unknown): void;
```

###### Parameters

| Parameter | Type      |
| --------- | --------- |
| `path`    | `string`  |
| `value`   | `unknown` |

###### Returns

`void`

---

### FormRuleDefinition

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                      | Modifier   | Type                                                                                                                                              |
| --------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="watch"></a> `watch`                    | `readonly` | `string`                                                                                                                                          |
| <a id="equals"></a> `equals?`                 | `readonly` | `unknown`                                                                                                                                         |
| <a id="notequals"></a> `notEquals?`           | `readonly` | `unknown`                                                                                                                                         |
| <a id="greaterthan"></a> `greaterThan?`       | `readonly` | `number`                                                                                                                                          |
| <a id="lessthan"></a> `lessThan?`             | `readonly` | `number`                                                                                                                                          |
| <a id="show-1"></a> `show?`                   | `readonly` | readonly `string`[]                                                                                                                               |
| <a id="hide-1"></a> `hide?`                   | `readonly` | readonly `string`[]                                                                                                                               |
| <a id="require-1"></a> `require?`             | `readonly` | readonly `string`[]                                                                                                                               |
| <a id="optional-1"></a> `optional?`           | `readonly` | readonly `string`[]                                                                                                                               |
| <a id="enable-1"></a> `enable?`               | `readonly` | readonly `string`[]                                                                                                                               |
| <a id="disable-1"></a> `disable?`             | `readonly` | readonly `string`[]                                                                                                                               |
| <a id="disablesubmit-1"></a> `disableSubmit?` | `readonly` | `boolean`                                                                                                                                         |
| <a id="changes"></a> `changes?`               | `readonly` | (`value`: `unknown`, `values`: `TValues`) => \| readonly [`FieldOption`](#fieldoption)[] \| `Promise`\<readonly [`FieldOption`](#fieldoption)[]\> |
| <a id="populate"></a> `populate?`             | `readonly` | `string`                                                                                                                                          |
| <a id="then"></a> `then?`                     | `readonly` | (`context`: [`RuleContext`](#rulecontext)\<`TValues`\>) => `void`                                                                                 |

---

### WizardStep

#### Properties

| Property                            | Modifier   | Type                                                                                        | Description                                                          |
| ----------------------------------- | ---------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| <a id="id-1"></a> `id?`             | `readonly` | `string`                                                                                    | -                                                                    |
| <a id="fields"></a> `fields?`       | `readonly` | readonly `string`[]                                                                         | -                                                                    |
| <a id="validate-1"></a> `validate?` | `readonly` | `boolean`                                                                                   | -                                                                    |
| <a id="when"></a> `when?`           | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `boolean`                                    | Skip this step when predicate returns false (conditional steps MVP). |
| <a id="next"></a> `next?`           | `readonly` | \| `string` \| ((`values`: `Record`\<`string`, `unknown`\>) => `string` \| `undefined`)     | Explicit next step id, or resolver from values.                      |
| <a id="canleave"></a> `canLeave?`   | `readonly` | (`ctx`: [`WizardGuardContext`](#wizardguardcontext)) => `boolean` \| `Promise`\<`boolean`\> | -                                                                    |
| <a id="canenter"></a> `canEnter?`   | `readonly` | (`ctx`: [`WizardGuardContext`](#wizardguardcontext)) => `boolean` \| `Promise`\<`boolean`\> | -                                                                    |

---

### WizardGuardContext

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                             | Modifier   | Type                    |
| ------------------------------------ | ---------- | ----------------------- |
| <a id="values-2"></a> `values`       | `readonly` | `TValues`               |
| <a id="fromstepid"></a> `fromStepId` | `readonly` | `string` \| `undefined` |
| <a id="tostepid"></a> `toStepId`     | `readonly` | `string`                |
| <a id="signal-1"></a> `signal`       | `readonly` | `AbortSignal`           |

---

### WizardConfig

#### Properties

| Property                                              | Modifier   | Type                                                    | Description                                                                                                                                             |
| ----------------------------------------------------- | ---------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="steps"></a> `steps`                            | `readonly` | readonly [`WizardStep`](#wizardstep)[]                  | -                                                                                                                                                       |
| <a id="initialstep"></a> `initialStep?`               | `readonly` | `number`                                                | -                                                                                                                                                       |
| <a id="gotovalidation"></a> `goToValidation?`         | `readonly` | [`WizardNavigateValidation`](#wizardnavigatevalidation) | Default validation for `goTo`. - `all` — validate entire form (SHIPPED default) - `step` — validate current step fields only - `none` — skip validation |
| <a id="persiststepindraft"></a> `persistStepInDraft?` | `readonly` | `boolean`                                               | When true, draft save/restore includes `currentStep`.                                                                                                   |

---

### WizardStepGraphNode

#### Properties

| Property                       | Modifier   | Type                |
| ------------------------------ | ---------- | ------------------- |
| <a id="id-2"></a> `id`         | `readonly` | `string`            |
| <a id="index"></a> `index`     | `readonly` | `number`            |
| <a id="nextids"></a> `nextIds` | `readonly` | readonly `string`[] |

---

### WizardStepGraph

#### Properties

| Property                     | Modifier   | Type                                                     |
| ---------------------------- | ---------- | -------------------------------------------------------- |
| <a id="nodes-1"></a> `nodes` | `readonly` | readonly [`WizardStepGraphNode`](#wizardstepgraphnode)[] |

---

### PluginErrorReport

#### Properties

| Property                      | Modifier   | Type      |
| ----------------------------- | ---------- | --------- |
| <a id="plugin"></a> `plugin?` | `readonly` | `string`  |
| <a id="hook"></a> `hook?`     | `readonly` | `string`  |
| <a id="phase"></a> `phase?`   | `readonly` | `string`  |
| <a id="error-1"></a> `error`  | `readonly` | `unknown` |

---

### MiddlewareContext

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                       | Modifier   | Type                                          |
| ------------------------------ | ---------- | --------------------------------------------- |
| <a id="form-2"></a> `form`     | `readonly` | [`FormInstance`](#forminstance)\<`TValues`\>  |
| <a id="phase-1"></a> `phase`   | `readonly` | [`MiddlewarePhase`](#middlewarephase)         |
| <a id="signal-2"></a> `signal` | `readonly` | `AbortSignal`                                 |
| <a id="meta"></a> `meta`       | `readonly` | `Readonly`\<`Record`\<`string`, `unknown`\>\> |

#### Methods

##### halt()

```ts
halt(reason?: string): void;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `reason?` | `string` |

###### Returns

`void`

---

### MiddlewareRegistration

#### Properties

| Property                      | Modifier   | Type                                             |
| ----------------------------- | ---------- | ------------------------------------------------ |
| <a id="name-5"></a> `name`    | `readonly` | `string`                                         |
| <a id="order-1"></a> `order?` | `readonly` | `number`                                         |
| <a id="phases"></a> `phases?` | `readonly` | readonly [`MiddlewarePhase`](#middlewarephase)[] |

---

### MiddlewareRunResult

#### Properties

| Property                      | Modifier   | Type      |
| ----------------------------- | ---------- | --------- |
| <a id="halted"></a> `halted`  | `readonly` | `boolean` |
| <a id="reason"></a> `reason?` | `readonly` | `string`  |

---

### AsyncRetryPolicy

#### Properties

| Property                                | Modifier   | Type                                                   | Description                                    |
| --------------------------------------- | ---------- | ------------------------------------------------------ | ---------------------------------------------- |
| <a id="maxattempts"></a> `maxAttempts`  | `readonly` | `number`                                               | Total attempts including the first; minimum 1. |
| <a id="delayms"></a> `delayMs?`         | `readonly` | `number` \| ((`attempt`: `number`) => `number`)        | Attempt is 1-based after a failure.            |
| <a id="shouldretry"></a> `shouldRetry?` | `readonly` | (`error`: `unknown`, `attempt`: `number`) => `boolean` | -                                              |

---

### AsyncCachePolicy

#### Properties

| Property                              | Modifier   | Type                      | Description                                                                                                                                                                                   |
| ------------------------------------- | ---------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="ttl"></a> `ttl`                | `readonly` | [`TtlInput`](#ttlinput)   | -                                                                                                                                                                                             |
| <a id="storage"></a> `storage?`       | `readonly` | `"memory"` \| `"session"` | Default `"memory"`. `"session"` is accepted for API compatibility but is **memory-only** — async validation outcomes are never written to `sessionStorage` (cleartext sensitive-data policy). |
| <a id="maxentries"></a> `maxEntries?` | `readonly` | `number`                  | Default 256.                                                                                                                                                                                  |

---

### AsyncValidatorOptions

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                            | Modifier   | Type                                                                                                                                                                                                                       |
| --------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="validate-2"></a> `validate`                  | `readonly` | (`value`: `unknown`, `context`: [`ValidationContext`](#validationcontext)\<`TValues`\> & \{ `signal`: `AbortSignal`; \}) => \| [`ValidatorResult`](#validatorresult) \| `Promise`\<[`ValidatorResult`](#validatorresult)\> |
| <a id="debounce"></a> `debounce?`                   | `readonly` | `number`                                                                                                                                                                                                                   |
| <a id="retry"></a> `retry?`                         | `readonly` | `number` \| [`AsyncRetryPolicy`](#asyncretrypolicy)                                                                                                                                                                        |
| <a id="timeout"></a> `timeout?`                     | `readonly` | `number`                                                                                                                                                                                                                   |
| <a id="cache"></a> `cache?`                         | `readonly` | `false` \| [`TtlInput`](#ttlinput) \| [`AsyncCachePolicy`](#asynccachepolicy)                                                                                                                                              |
| <a id="abortprevious"></a> `abortPrevious?`         | `readonly` | `boolean`                                                                                                                                                                                                                  |
| <a id="preventduplicates"></a> `preventDuplicates?` | `readonly` | `boolean`                                                                                                                                                                                                                  |
| <a id="cachekey"></a> `cacheKey?`                   | `readonly` | (`value`: `unknown`, `context`: [`ValidationContext`](#validationcontext)\<`TValues`\>) => `string`                                                                                                                        |
| <a id="sharedcache"></a> `sharedCache?`             | `readonly` | `string` \| `boolean`                                                                                                                                                                                                      |
| <a id="offline"></a> `offline?`                     | `readonly` | `"skip"` \| `"fail"` \| `"queue"`                                                                                                                                                                                          |

---

### AsyncJob

#### Properties

| Property                             | Modifier   | Type                                                                                    |
| ------------------------------------ | ---------- | --------------------------------------------------------------------------------------- |
| <a id="id-3"></a> `id`               | `readonly` | `string`                                                                                |
| <a id="path-3"></a> `path`           | `readonly` | `string`                                                                                |
| <a id="generation"></a> `generation` | `readonly` | `number`                                                                                |
| <a id="cachekey-1"></a> `cacheKey`   | `readonly` | `string`                                                                                |
| <a id="signal-3"></a> `signal`       | `readonly` | `AbortSignal`                                                                           |
| <a id="startedat"></a> `startedAt`   | `readonly` | `number`                                                                                |
| <a id="status-1"></a> `status`       | `readonly` | `"scheduled"` \| `"running"` \| `"settled"` \| `"aborted"` \| `"timeout"` \| `"queued"` |

---

### FieldMetaState

#### Properties

| Property                                 | Modifier   | Type      |
| ---------------------------------------- | ---------- | --------- |
| <a id="isvalidating"></a> `isValidating` | `readonly` | `boolean` |
| <a id="label-1"></a> `label?`            | `readonly` | `string`  |
| <a id="description"></a> `description?`  | `readonly` | `string`  |
| <a id="hidden"></a> `hidden?`            | `readonly` | `boolean` |

---

### ValidationFormAccessor

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Methods

##### get()

```ts
get(path: string): unknown;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

`unknown`

##### values()

```ts
values(): TValues;
```

###### Returns

`TValues`

---

### ValidationContext

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                        | Modifier   | Type                                                             | Description                                                           |
| ------------------------------- | ---------- | ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| <a id="values-4"></a> `values`  | `readonly` | `TValues`                                                        | -                                                                     |
| <a id="path-4"></a> `path`      | `readonly` | `string`                                                         | -                                                                     |
| <a id="form-3"></a> `form`      | `readonly` | [`ValidationFormAccessor`](#validationformaccessor)\<`TValues`\> | -                                                                     |
| <a id="signal-4"></a> `signal?` | `readonly` | `AbortSignal`                                                    | Present when validation is tied to an in-flight async job (Phase 4A). |

---

### CustomFieldValidatorContext

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                     | Modifier   | Type                                                             |
| ---------------------------- | ---------- | ---------------------------------------------------------------- |
| <a id="value-1"></a> `value` | `readonly` | `unknown`                                                        |
| <a id="path-5"></a> `path`   | `readonly` | `string`                                                         |
| <a id="form-4"></a> `form`   | `readonly` | [`ValidationFormAccessor`](#validationformaccessor)\<`TValues`\> |

---

### FieldSchemaConfig

#### Properties

| Property                              | Modifier   | Type                                                                                                             |
| ------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| <a id="type"></a> `type?`             | `readonly` | [`BuiltInFieldType`](#builtinfieldtype)                                                                          |
| <a id="required-2"></a> `required?`   | `readonly` | `boolean`                                                                                                        |
| <a id="email"></a> `email?`           | `readonly` | `boolean`                                                                                                        |
| <a id="password"></a> `password?`     | `readonly` | `boolean`                                                                                                        |
| <a id="url"></a> `url?`               | `readonly` | `boolean`                                                                                                        |
| <a id="minlength"></a> `minLength?`   | `readonly` | `number`                                                                                                         |
| <a id="validate-3"></a> `validate?`   | `readonly` | `FieldValidateRules`                                                                                             |
| <a id="validators"></a> `validators?` | `readonly` | readonly [`CustomFieldValidator`](#customfieldvalidator)\<`Record`\<`string`, `unknown`\>\>[]                    |
| <a id="format"></a> `format?`         | `readonly` | \| [`Formatter`](#formatter) \| `"phone"` \| `"currency"` \| `"slug"` \| `"philippine-phone"` \| `"credit-card"` |

---

### FieldOptions

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                        | Modifier   | Type                                                                                                                | Description                                                                                                                                                 |
| ----------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="defaultvalue"></a> `defaultValue?`       | `readonly` | `unknown`                                                                                                           | -                                                                                                                                                           |
| <a id="validators-1"></a> `validators?`         | `readonly` | readonly [`Validator`](#validator)\<`TValues`\>[]                                                                   | -                                                                                                                                                           |
| <a id="validateon"></a> `validateOn?`           | `readonly` | [`ValidationMode`](#validationmode)                                                                                 | -                                                                                                                                                           |
| <a id="dependson"></a> `dependsOn?`             | `readonly` | readonly `string`[]                                                                                                 | -                                                                                                                                                           |
| <a id="format-1"></a> `format?`                 | `readonly` | [`Formatter`](#formatter)                                                                                           | -                                                                                                                                                           |
| <a id="parse-1"></a> `parse?`                   | `readonly` | [`Parser`](#parser)                                                                                                 | -                                                                                                                                                           |
| <a id="formatondisplay"></a> `formatOnDisplay?` | `readonly` | `boolean`                                                                                                           | -                                                                                                                                                           |
| <a id="parseoninput"></a> `parseOnInput?`       | `readonly` | `boolean`                                                                                                           | -                                                                                                                                                           |
| <a id="transform"></a> `transform?`             | `readonly` | \| [`TransformPipelineOptions`](#transformpipelineoptions) \| readonly [`TransformFn`](#transformfn)\<`TValues`\>[] | Canonical inbound transforms (trim/normalize/sanitize/parse/stages). Distinct from display `format`/`parse` — see `/transform` and TRANSFORM_INBOUND_ORDER. |
| <a id="label-2"></a> `label?`                   | `readonly` | `string`                                                                                                            | -                                                                                                                                                           |
| <a id="description-1"></a> `description?`       | `readonly` | `string`                                                                                                            | -                                                                                                                                                           |
| <a id="hidden-1"></a> `hidden?`                 | `readonly` | `boolean`                                                                                                           | -                                                                                                                                                           |
| <a id="metadata"></a> `metadata?`               | `readonly` | `Readonly`\<`Record`\<`string`, `unknown`\>\>                                                                       | -                                                                                                                                                           |

---

### FieldHandle

#### Type Parameters

| Type Parameter                                       |
| ---------------------------------------------------- |
| `_TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                       | Modifier   | Type                                                              | Description                                                                                                                   |
| ------------------------------ | ---------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| <a id="path-6"></a> `path`     | `readonly` | `string`                                                          | -                                                                                                                             |
| <a id="value-2"></a> `value`   | `readonly` | `unknown`                                                         | -                                                                                                                             |
| <a id="error-2"></a> `error`   | `readonly` | `string` \| `undefined`                                           | -                                                                                                                             |
| <a id="touched"></a> `touched` | `readonly` | `boolean`                                                         | -                                                                                                                             |
| <a id="dirty"></a> `dirty`     | `readonly` | `boolean`                                                         | -                                                                                                                             |
| <a id="visited"></a> `visited` | `readonly` | `boolean`                                                         | -                                                                                                                             |
| <a id="ui"></a> `ui`           | `readonly` | `FieldUiView`                                                     | Full presentation maps (same sources as `state.fieldUi` / `formUi` / `fieldOptions`).                                         |
| <a id="meta-1"></a> `meta`     | `readonly` | [`FieldState`](#fieldstate) & [`FieldMetaState`](#fieldmetastate) | Field state + meta (controller surface).                                                                                      |
| <a id="aria-1"></a> `aria`     | `readonly` | [`FieldAriaResult`](#fieldariaresult)                             | Accessibility snapshot + spread attributes. Register element ids via `setAriaIds` so `aria-describedby` can link errors/help. |

#### Methods

##### setValue()

```ts
setValue(value: unknown): void;
```

###### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

###### Returns

`void`

##### setTouched()

```ts
setTouched(touched?: boolean): void;
```

###### Parameters

| Parameter  | Type      |
| ---------- | --------- |
| `touched?` | `boolean` |

###### Returns

`void`

##### setVisited()

```ts
setVisited(visited?: boolean): void;
```

###### Parameters

| Parameter  | Type      |
| ---------- | --------- |
| `visited?` | `boolean` |

###### Returns

`void`

##### setAriaIds()

```ts
setAriaIds(ids: FieldAriaIds): void;
```

Register error/description element ids for `aria-describedby`.

###### Parameters

| Parameter | Type                            |
| --------- | ------------------------------- |
| `ids`     | [`FieldAriaIds`](#fieldariaids) |

###### Returns

`void`

##### onBlur()

```ts
onBlur(): void;
```

###### Returns

`void`

##### onFocus()

```ts
onFocus(): void;
```

###### Returns

`void`

##### validate()

```ts
validate(): Promise<boolean>;
```

###### Returns

`Promise`\<`boolean`\>

##### bind()

```ts
bind(): FieldBinding;
```

###### Returns

[`FieldBinding`](#fieldbinding)

---

### FieldBinding

#### Properties

| Property                         | Modifier   | Type                           |
| -------------------------------- | ---------- | ------------------------------ |
| <a id="name-6"></a> `name`       | `readonly` | `string`                       |
| <a id="value-3"></a> `value`     | `readonly` | `unknown`                      |
| <a id="onchange"></a> `onChange` | `readonly` | (`value`: `unknown`) => `void` |
| <a id="onblur-1"></a> `onBlur`   | `readonly` | () => `void`                   |
| <a id="onfocus-1"></a> `onFocus` | `readonly` | () => `void`                   |

---

### AutosaveConfig

#### Properties

| Property                              | Modifier   | Type                                                                         |
| ------------------------------------- | ---------- | ---------------------------------------------------------------------------- |
| <a id="enabled"></a> `enabled?`       | `readonly` | `boolean`                                                                    |
| <a id="debouncems"></a> `debounceMs?` | `readonly` | `number`                                                                     |
| <a id="onsave"></a> `onSave`          | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `void` \| `Promise`\<`void`\> |

---

### DraftConfig

#### Properties

| Property                                          | Modifier   | Type                                                                                         | Description                                                             |
| ------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| <a id="enabled-1"></a> `enabled?`                 | `readonly` | `boolean`                                                                                    | -                                                                       |
| <a id="storagekey"></a> `storageKey?`             | `readonly` | `string`                                                                                     | -                                                                       |
| <a id="storage-1"></a> `storage?`                 | `readonly` | `DraftStorageKind`                                                                           | -                                                                       |
| <a id="adapter"></a> `adapter?`                   | `readonly` | `DraftStorageAdapter`                                                                        | -                                                                       |
| <a id="onrestore"></a> `onRestore?`               | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `void`                                        | -                                                                       |
| <a id="promptonrestore"></a> `promptOnRestore?`   | `readonly` | `boolean`                                                                                    | -                                                                       |
| <a id="onrestoreprompt"></a> `onRestorePrompt?`   | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => [`RestorePromptResult`](#restorepromptresult) | -                                                                       |
| <a id="onrestoredecline"></a> `onRestoreDecline?` | `readonly` | [`DraftRestoreDeclinePolicy`](#draftrestoredeclinepolicy)                                    | What to do when `onRestorePrompt` returns `false`. **Default** `"keep"` |
| <a id="versioning"></a> `versioning?`             | `readonly` | `boolean`                                                                                    | Persist versioned envelopes (`DraftEnvelopeV1`) instead of raw values.  |
| <a id="schemaversion"></a> `schemaVersion?`       | `readonly` | `string`                                                                                     | App schema id compared / migrated when envelopes are enabled.           |
| <a id="migratedraft"></a> `migrateDraft?`         | `readonly` | (`envelope`: `DraftEnvelopeV1`) => `DraftEnvelopeV1`                                         | Migrate an envelope before restore; throw to reject restore.            |

---

### RestoreDraftOptions

#### Properties

| Property                      | Modifier   | Type                       | Description                                                                      |
| ----------------------------- | ---------- | -------------------------- | -------------------------------------------------------------------------------- |
| <a id="force"></a> `force?`   | `readonly` | `boolean`                  | Default false — if the form is dirty, no-op unless force (D-RESTORE-RACE).       |
| <a id="prompt"></a> `prompt?` | `readonly` | `boolean`                  | Default false — if true, call `DraftConfig.onRestorePrompt` when set.            |
| <a id="merge"></a> `merge?`   | `readonly` | `"overlay"` \| `"replace"` | Default `overlay` — `{ ...defaults, ...draft }`. `replace` uses draft keys only. |

---

### AnalyticsConfig

#### Properties

| Property                                  | Modifier   | Type                                                                      | Description                                                                                                                   |
| ----------------------------------------- | ---------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| <a id="enabled-2"></a> `enabled?`         | `readonly` | `boolean`                                                                 | -                                                                                                                             |
| <a id="includepaths"></a> `includePaths?` | `readonly` | readonly `string`[]                                                       | When set, only these paths appear in path-keyed metrics (deny-by-default for others). Values are never captured — paths only. |
| <a id="excludepaths"></a> `excludePaths?` | `readonly` | readonly `string`[]                                                       | Paths omitted from path-keyed metrics.                                                                                        |
| <a id="onsnapshot"></a> `onSnapshot?`     | `readonly` | (`snapshot`: [`FormAnalyticsSnapshot`](#formanalyticssnapshot)) => `void` | Invoked whenever a snapshot is produced via `getAnalytics()`.                                                                 |

---

### FormAnalyticsSnapshot

#### Properties

| Property                                             | Modifier   | Type                                                          |
| ---------------------------------------------------- | ---------- | ------------------------------------------------------------- |
| <a id="startedat-1"></a> `startedAt`                 | `readonly` | `number`                                                      |
| <a id="completedat"></a> `completedAt`               | `readonly` | `number` \| `null`                                            |
| <a id="errorcount"></a> `errorCount`                 | `readonly` | `number`                                                      |
| <a id="errorsbyfield"></a> `errorsByField`           | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `number`\>\> |
| <a id="abandonedat"></a> `abandonedAt`               | `readonly` | `number` \| `null`                                            |
| <a id="currentstep"></a> `currentStep`               | `readonly` | `number`                                                      |
| <a id="fieldviews"></a> `fieldViews`                 | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `number`\>\> |
| <a id="dropofffield"></a> `dropOffField`             | `readonly` | `string` \| `null`                                            |
| <a id="timetocompletems"></a> `timeToCompleteMs`     | `readonly` | `number` \| `null`                                            |
| <a id="timetofirsterrorms"></a> `timeToFirstErrorMs` | `readonly` | `number` \| `null`                                            |

---

### OfflineQueueConfig

#### Properties

| Property                                      | Modifier   | Type                                                                                                                                                                       | Description                                                                                                                                                                   |
| --------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="enabled-3"></a> `enabled?`             | `readonly` | `boolean`                                                                                                                                                                  | -                                                                                                                                                                             |
| <a id="storagekey-1"></a> `storageKey?`       | `readonly` | `string`                                                                                                                                                                   | -                                                                                                                                                                             |
| <a id="maxitems"></a> `maxItems?`             | `readonly` | `number`                                                                                                                                                                   | Soft cap on queued items.                                                                                                                                                     |
| <a id="overflow"></a> `overflow?`             | `readonly` | `OfflineOverflowPolicy`                                                                                                                                                    | Behavior when `maxItems` is exceeded. Default: `drop-oldest`.                                                                                                                 |
| <a id="idempotencykey"></a> `idempotencyKey?` | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `string`                                                                                                                    | Deduplicate pending items with the same key (skip enqueue).                                                                                                                   |
| <a id="onconflict"></a> `onConflict?`         | `readonly` | (`local`: `QueuedSubmission`\<`Record`\<`string`, `unknown`\>\>, `error`: `unknown`) => \| `void` \| `OfflineConflictAction` \| `Promise`\<void \| OfflineConflictAction\> | Called when a queued item fails during flush. - `keep` (default) — leave at head, stop flush - `drop` — discard and continue - `retry` — keep at head and continue attempting |
| <a id="onoverflow"></a> `onOverflow?`         | `readonly` | (`dropped`: `QueuedSubmission`\<`Record`\<`string`, `unknown`\>\>, `policy`: `OfflineOverflowPolicy`) => `void`                                                            | -                                                                                                                                                                             |

---

### KeyboardShortcutConfig

#### Properties

| Property                     | Modifier   | Type                                                |
| ---------------------------- | ---------- | --------------------------------------------------- |
| <a id="combo"></a> `combo`   | `readonly` | `string`                                            |
| <a id="action"></a> `action` | `readonly` | `"submit"` \| `"saveDraft"` \| `"undo"` \| `"redo"` |

---

### WorkflowConfig

#### Properties

| Property                                  | Modifier   | Type                                                           |
| ----------------------------------------- | ---------- | -------------------------------------------------------------- |
| <a id="autosave"></a> `autosave?`         | `readonly` | [`AutosaveConfig`](#autosaveconfig)                            |
| <a id="draft"></a> `draft?`               | `readonly` | [`DraftConfig`](#draftconfig)                                  |
| <a id="wizard"></a> `wizard?`             | `readonly` | [`WizardConfig`](#wizardconfig)                                |
| <a id="analytics"></a> `analytics?`       | `readonly` | [`AnalyticsConfig`](#analyticsconfig)                          |
| <a id="offlinequeue"></a> `offlineQueue?` | `readonly` | [`OfflineQueueConfig`](#offlinequeueconfig)                    |
| <a id="keyboard"></a> `keyboard?`         | `readonly` | readonly [`KeyboardShortcutConfig`](#keyboardshortcutconfig)[] |

---

### SubmissionQueueState

#### Properties

| Property                         | Modifier   | Type      |
| -------------------------------- | ---------- | --------- |
| <a id="pending"></a> `pending`   | `readonly` | `number`  |
| <a id="flushing"></a> `flushing` | `readonly` | `boolean` |

---

### SetValueOptions

#### Properties

| Property                                    | Modifier   | Type      |
| ------------------------------------------- | ---------- | --------- |
| <a id="recordhistory"></a> `recordHistory?` | `readonly` | `boolean` |
| <a id="markdirty-3"></a> `markDirty?`       | `readonly` | `boolean` |

---

### SubmitOptions

#### Properties

| Property                                                | Modifier   | Type                      |
| ------------------------------------------------------- | ---------- | ------------------------- |
| <a id="preventdoublesubmit"></a> `preventDoubleSubmit?` | `readonly` | `boolean`                 |
| <a id="includediff"></a> `includeDiff?`                 | `readonly` | `boolean`                 |
| <a id="retry-1"></a> `retry?`                           | `readonly` | `number` \| `RetryPolicy` |

---

### FormChangeRecord

#### Properties

| Property                          | Modifier   | Type             | Description                                   |
| --------------------------------- | ---------- | ---------------- | --------------------------------------------- |
| <a id="path-7"></a> `path`        | `readonly` | `string`         | -                                             |
| <a id="type-1"></a> `type`        | `readonly` | `FormChangeType` | -                                             |
| <a id="previous"></a> `previous?` | `readonly` | `unknown`        | -                                             |
| <a id="current"></a> `current?`   | `readonly` | `unknown`        | -                                             |
| <a id="from-3"></a> `from?`       | `readonly` | `string`         | Present when `type` is `moved` (source path). |

---

### FormDiffMetadata

#### Properties

| Property                                     | Modifier   | Type     |
| -------------------------------------------- | ---------- | -------- |
| <a id="durationms"></a> `durationMs`         | `readonly` | `number` |
| <a id="changecount"></a> `changeCount`       | `readonly` | `number` |
| <a id="addedcount"></a> `addedCount`         | `readonly` | `number` |
| <a id="removedcount"></a> `removedCount`     | `readonly` | `number` |
| <a id="changedcount"></a> `changedCount`     | `readonly` | `number` |
| <a id="unchangedcount"></a> `unchangedCount` | `readonly` | `number` |
| <a id="movedcount"></a> `movedCount`         | `readonly` | `number` |

---

### FormDiffResult

#### Properties

| Property                             | Modifier   | Type                                               |
| ------------------------------------ | ---------- | -------------------------------------------------- |
| <a id="changes-1"></a> `changes`     | `readonly` | readonly [`FormChangeRecord`](#formchangerecord)[] |
| <a id="haschanges"></a> `hasChanges` | `readonly` | `boolean`                                          |
| <a id="metadata-1"></a> `metadata`   | `readonly` | [`FormDiffMetadata`](#formdiffmetadata)            |

---

### FormDiffOptions

#### Properties

| Property                                                        | Modifier   | Type      |
| --------------------------------------------------------------- | ---------- | --------- |
| <a id="maxdepth"></a> `maxDepth?`                               | `readonly` | `number`  |
| <a id="includeunchanged"></a> `includeUnchanged?`               | `readonly` | `boolean` |
| <a id="treatundefinedasmissing"></a> `treatUndefinedAsMissing?` | `readonly` | `boolean` |

---

### SubmitSecurityCaptcha

CAPTCHA token under the submission security namespace (ADR-CAP-001).

#### Properties

| Property                            | Modifier   | Type     |
| ----------------------------------- | ---------- | -------- |
| <a id="provider"></a> `provider`    | `readonly` | `string` |
| <a id="token"></a> `token`          | `readonly` | `string` |
| <a id="expiresat"></a> `expiresAt?` | `readonly` | `number` |

---

### SubmitSecurityMeta

Security namespace on submit meta.
Stable path: `meta.security.captcha` (future: CSRF, OTP, …).

#### Properties

| Property                        | Modifier   | Type                                              |
| ------------------------------- | ---------- | ------------------------------------------------- |
| <a id="captcha"></a> `captcha?` | `readonly` | [`SubmitSecurityCaptcha`](#submitsecuritycaptcha) |

---

### SubmitMeta

#### Properties

| Property                                    | Modifier   | Type                                        | Description                                            |
| ------------------------------------------- | ---------- | ------------------------------------------- | ------------------------------------------------------ |
| <a id="changedfields"></a> `changedFields?` | `readonly` | readonly `string`[]                         | -                                                      |
| <a id="diff"></a> `diff?`                   | `readonly` | [`FormDiffResult`](#formdiffresult)         | -                                                      |
| <a id="signal-5"></a> `signal?`             | `readonly` | `AbortSignal`                               | -                                                      |
| <a id="security"></a> `security?`           | `readonly` | [`SubmitSecurityMeta`](#submitsecuritymeta) | Populated by the Security Stage (e.g. CAPTCHA plugin). |

---

### ValidateOptions

#### Properties

| Property                    | Modifier   | Type                                |
| --------------------------- | ---------- | ----------------------------------- |
| <a id="paths"></a> `paths?` | `readonly` | readonly `string`[]                 |
| <a id="mode"></a> `mode?`   | `readonly` | [`ValidationMode`](#validationmode) |

---

### ResetOptions

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                            | Modifier   | Type                   |
| ----------------------------------- | ---------- | ---------------------- |
| <a id="values-5"></a> `values?`     | `readonly` | `Partial`\<`TValues`\> |
| <a id="keepdirty"></a> `keepDirty?` | `readonly` | `boolean`              |

---

### FormConfig

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                                  | Modifier   | Type                                                                                                                                                            | Description                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="initialvalues"></a> `initialValues?`               | `readonly` | `TValues`                                                                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="target"></a> `target?`                             | `readonly` | `string` \| `HTMLElement`                                                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="form-5"></a> `form?`                               | `readonly` | `string` \| `HTMLElement`                                                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="schema"></a> `schema?`                             | `readonly` | \| [`SchemaAdapter`](#schemaadapter)\<`Record`\<`string`, `unknown`\>\> \| `Partial`\<`Record`\<`string`, [`FieldSchemaDefinition`](#fieldschemadefinition)\>\> | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="onsubmit"></a> `onSubmit?`                         | `readonly` | (`values`: `TValues`, `meta?`: [`SubmitMeta`](#submitmeta)) => `void` \| `Promise`\<`void`\>                                                                    | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="onsubmiterror"></a> `onSubmitError?`               | `readonly` | (`error`: `unknown`) => `void`                                                                                                                                  | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="onpluginerror"></a> `onPluginError?`               | `readonly` | [`PluginErrorHandler`](#pluginerrorhandler)                                                                                                                     | Receives isolated plugin/hook failures (setup, hooks, destroy). Does not rethrow — form continues per Phase 15 isolation policy.                                                                                                                                                                                                            |
| <a id="validateon-1"></a> `validateOn?`                   | `readonly` | [`ValidationMode`](#validationmode)                                                                                                                             | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="validators-2"></a> `validators?`                   | `readonly` | `Partial`\<`Record`\<`string`, \| [`Validator`](#validator)\<`TValues`\> \| readonly [`Validator`](#validator)\<`TValues`\>[]\>\>                               | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="crossfieldvalidators"></a> `crossFieldValidators?` | `readonly` | readonly `CrossFieldRule`\<`TValues`\>[]                                                                                                                        | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="formvalidators"></a> `formValidators?`             | `readonly` | readonly `CrossFieldValidator`\<`TValues`\>[]                                                                                                                   | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="workflow"></a> `workflow?`                         | `readonly` | [`WorkflowConfig`](#workflowconfig)                                                                                                                             | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="autosave-1"></a> `autoSave?`                       | `readonly` | [`AutosaveConfig`](#autosaveconfig) & \{ `every?`: `string`; \}                                                                                                 | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="wizard-1"></a> `wizard?`                           | `readonly` | `boolean` \| [`WizardConfig`](#wizardconfig)                                                                                                                    | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="rules"></a> `rules?`                               | `readonly` | readonly [`FormRuleInput`](#formruleinput)\<`TValues`\>[]                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           |
| <a id="plugins"></a> `plugins?`                           | `readonly` | readonly [`FormPlugin`](#formplugin)\<`TValues`\>[]                                                                                                             | Plugins registered at create time (same as calling `form.use(plugin)` for each entry, in order). Prefer this for declarative setup; use `form.use()` later for conditional or late registration.                                                                                                                                            |
| <a id="subscribe-1"></a> `subscribe?`                     | `readonly` | \| [`FormSubscribeListener`](#formsubscribelistener)\<`TValues`\> \| readonly [`FormSubscribeListener`](#formsubscribelistener)\<`TValues`\>[]                  | State listeners registered at create time (same store as `form.subscribe()`). Pass one listener or an array. Each receives the form instance, is invoked once after create (so UI can sync immediately), then on every state notify. Lives until `form.destroy()`. Prefer framework adapters for React/Vue; use this for vanilla / host UI. |
| <a id="dependencies-3"></a> `dependencies?`               | `readonly` | `Readonly`\<`Record`\<`string`, `string` \| readonly `string`[]\>\>                                                                                             | Explicit dependency map: child → parent(s). Cycles throw `ConfigurationError` at registration (ADR-007).                                                                                                                                                                                                                                    |
| <a id="dependencyactions"></a> `dependencyActions?`       | `readonly` | `Partial`\<`Record`\<`string`, readonly [`DependencyAction`](#dependencyaction)[]\>\>                                                                           | Per-child action overrides for `dependencies` (default `["clear","revalidate"]`).                                                                                                                                                                                                                                                           |

---

### FieldState

#### Properties

| Property                         | Modifier   | Type      |
| -------------------------------- | ---------- | --------- |
| <a id="touched-1"></a> `touched` | `readonly` | `boolean` |
| <a id="dirty-1"></a> `dirty`     | `readonly` | `boolean` |
| <a id="visited-1"></a> `visited` | `readonly` | `boolean` |
| <a id="changed"></a> `changed`   | `readonly` | `boolean` |

---

### FormState

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                       | Modifier   | Type                                                                                          | Description                            |
| ---------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- | -------------------------------------- |
| <a id="values-6"></a> `values`                 | `readonly` | `TValues`                                                                                     | -                                      |
| <a id="errors"></a> `errors`                   | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `string`\>\>                                 | -                                      |
| <a id="touched-2"></a> `touched`               | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      |
| <a id="dirty-2"></a> `dirty`                   | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      |
| <a id="visited-2"></a> `visited`               | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      |
| <a id="changed-1"></a> `changed`               | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      |
| <a id="issubmitting"></a> `isSubmitting`       | `readonly` | `boolean`                                                                                     | -                                      |
| <a id="isvalidating-1"></a> `isValidating`     | `readonly` | `boolean`                                                                                     | -                                      |
| <a id="isvalid"></a> `isValid`                 | `readonly` | `boolean`                                                                                     | -                                      |
| <a id="isdirty"></a> `isDirty`                 | `readonly` | `boolean`                                                                                     | -                                      |
| <a id="ischanged"></a> `isChanged`             | `readonly` | `boolean`                                                                                     | -                                      |
| <a id="submitcount"></a> `submitCount`         | `readonly` | `number`                                                                                      | -                                      |
| <a id="submitphase-1"></a> `submitPhase`       | `readonly` | [`SubmitPhase`](#submitphase)                                                                 | Last / current submit lifecycle phase. |
| <a id="workflow-1"></a> `workflow`             | `readonly` | [`WorkflowState`](#workflowstate)                                                             | -                                      |
| <a id="fieldui-1"></a> `fieldUi`               | `readonly` | [`FieldUiMap`](#fielduimap)                                                                   | -                                      |
| <a id="formui-1"></a> `formUi`                 | `readonly` | [`FormUiState`](#formuistate)                                                                 | -                                      |
| <a id="fieldmeta"></a> `fieldMeta`             | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), [`FieldMetaState`](#fieldmetastate)\>\>      | -                                      |
| <a id="fieldoptions-2"></a> `fieldOptions`     | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), readonly [`FieldOption`](#fieldoption)[]\>\> | -                                      |
| <a id="submissionqueue"></a> `submissionQueue` | `readonly` | [`SubmissionQueueState`](#submissionqueuestate)                                               | -                                      |

---

### WorkflowState

#### Properties

| Property                                     | Modifier   | Type               |
| -------------------------------------------- | ---------- | ------------------ |
| <a id="currentstep-1"></a> `currentStep`     | `readonly` | `number`           |
| <a id="totalsteps"></a> `totalSteps`         | `readonly` | `number`           |
| <a id="cangonext"></a> `canGoNext`           | `readonly` | `boolean`          |
| <a id="cangoprev"></a> `canGoPrev`           | `readonly` | `boolean`          |
| <a id="progress"></a> `progress`             | `readonly` | `number`           |
| <a id="isautosaving"></a> `isAutosaving`     | `readonly` | `boolean`          |
| <a id="lastautosaveat"></a> `lastAutosaveAt` | `readonly` | `number` \| `null` |

---

### FormCheckpoint

Durable form checkpoint — distinct from `getSnapshot()` (external-store identity).

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                             | Modifier   | Type                                                                |
| ------------------------------------ | ---------- | ------------------------------------------------------------------- |
| <a id="version"></a> `version`       | `readonly` | `1`                                                                 |
| <a id="kind"></a> `kind`             | `readonly` | `"checkpoint"`                                                      |
| <a id="capturedat"></a> `capturedAt` | `readonly` | `number`                                                            |
| <a id="values-7"></a> `values`       | `readonly` | `TValues`                                                           |
| <a id="errors-1"></a> `errors?`      | `readonly` | `Readonly`\<`Record`\<`string`, `string`\>\>                        |
| <a id="touched-3"></a> `touched?`    | `readonly` | `Readonly`\<`Record`\<`string`, `boolean`\>\>                       |
| <a id="dirty-3"></a> `dirty?`        | `readonly` | `Readonly`\<`Record`\<`string`, `boolean`\>\>                       |
| <a id="visited-3"></a> `visited?`    | `readonly` | `Readonly`\<`Record`\<`string`, `boolean`\>\>                       |
| <a id="fieldui-2"></a> `fieldUi?`    | `readonly` | `Readonly`\<`Record`\<`string`, [`FieldUiState`](#fielduistate)\>\> |
| <a id="workflow-2"></a> `workflow?`  | `readonly` | \{ `currentStep`: `number`; \}                                      |
| `workflow.currentStep`               | `readonly` | `number`                                                            |

---

### CreateCheckpointOptions

#### Properties

| Property                        | Modifier   | Type                                                                                                                |
| ------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| <a id="include"></a> `include?` | `readonly` | readonly ( \| `"values"` \| `"workflow"` \| `"touched"` \| `"errors"` \| `"dirty"` \| `"visited"` \| `"fieldUi"`)[] |

---

### RestoreCheckpointOptions

#### Properties

| Property                                      | Modifier   | Type      |
| --------------------------------------------- | ---------- | --------- |
| <a id="recordhistory-1"></a> `recordHistory?` | `readonly` | `boolean` |
| <a id="restoremeta"></a> `restoreMeta?`       | `readonly` | `boolean` |

---

### FormInstance

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                           | Modifier   | Type                                                                                                                                                                              | Description                                                                                                                  |
| ---------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| <a id="id-4"></a> `id`             | `readonly` | `string`                                                                                                                                                                          | -                                                                                                                            |
| <a id="ref"></a> `ref`             | `readonly` | [`FormRef`](#formref)                                                                                                                                                             | -                                                                                                                            |
| <a id="ui-1"></a> `ui`             | `readonly` | `FormUiProjection`\<`TValues`\>                                                                                                                                                   | Derived UI projection (`@jayoncode/form-intelligence/ui`). Uses registered policies from `ui()` plugin, or package defaults. |
| <a id="state-1"></a> `state`       | `readonly` | [`FormState`](#formstate)\<`TValues`\>                                                                                                                                            | Current form snapshot — same as `getFormState()`.                                                                            |
| <a id="workflow-3"></a> `workflow` | `public`   | \{ `next`: `Promise`\<`boolean`\>; `prev`: `void`; `goTo`: `Promise`\<`boolean`\>; `getStepGraph`: [`WizardStepGraph`](#wizardstepgraph); `visibleSteps`: readonly `string`[]; \} | -                                                                                                                            |
| `workflow.next`                    | `public`   | `Promise`\<`boolean`\>                                                                                                                                                            | -                                                                                                                            |
| `workflow.prev`                    | `public`   | `void`                                                                                                                                                                            | -                                                                                                                            |
| `workflow.goTo`                    | `public`   | `Promise`\<`boolean`\>                                                                                                                                                            | -                                                                                                                            |
| `workflow.getStepGraph`            | `public`   | [`WizardStepGraph`](#wizardstepgraph)                                                                                                                                             | -                                                                                                                            |
| `workflow.visibleSteps`            | `public`   | readonly `string`[]                                                                                                                                                               | -                                                                                                                            |

#### Methods

##### field()

```ts
field(path: string, options?: FieldOptions<TValues>): FieldHandle<TValues>;
```

###### Parameters

| Parameter  | Type                                           |
| ---------- | ---------------------------------------------- |
| `path`     | `string`                                       |
| `options?` | [`FieldOptions`](#fieldoptions-1)\<`TValues`\> |

###### Returns

[`FieldHandle`](#fieldhandle)\<`TValues`\>

##### firstInvalidPath()

```ts
firstInvalidPath(): string | undefined;
```

First path with a non-empty error (stable key order).

###### Returns

`string` \| `undefined`

##### focusFirstInvalid()

```ts
focusFirstInvalid(): string | undefined;
```

Focus first invalid control when `document` exists; SSR-safe no-op.
Returns the focused path or `undefined`.

###### Returns

`string` \| `undefined`

##### registeredFieldPaths()

```ts
registeredFieldPaths(): readonly string[];
```

Paths registered via `field()` in registration order.

###### Returns

readonly `string`[]

##### pushField()

```ts
pushField(arrayPath: string, item?: unknown): string;
```

###### Parameters

| Parameter   | Type      |
| ----------- | --------- |
| `arrayPath` | `string`  |
| `item?`     | `unknown` |

###### Returns

`string`

##### removeField()

```ts
removeField(arrayPath: string, index: number): void;
```

###### Parameters

| Parameter   | Type     |
| ----------- | -------- |
| `arrayPath` | `string` |
| `index`     | `number` |

###### Returns

`void`

##### insertField()

```ts
insertField(
   arrayPath: string,
   index: number,
   item?: unknown): string;
```

###### Parameters

| Parameter   | Type      |
| ----------- | --------- |
| `arrayPath` | `string`  |
| `index`     | `number`  |
| `item?`     | `unknown` |

###### Returns

`string`

##### submit()

```ts
submit(options?: SubmitOptions): Promise<boolean>;
```

###### Parameters

| Parameter  | Type                              |
| ---------- | --------------------------------- |
| `options?` | [`SubmitOptions`](#submitoptions) |

###### Returns

`Promise`\<`boolean`\>

##### cancelSubmit()

```ts
cancelSubmit(): void;
```

###### Returns

`void`

##### useMiddleware()

```ts
useMiddleware(middleware: MiddlewareInput<TValues>): () => void;
```

Register onion middleware for submit/validate phases.
Same stack as plugin hooks — see `MIDDLEWARE_HOOK_MAP`.

###### Parameters

| Parameter    | Type                                               |
| ------------ | -------------------------------------------------- |
| `middleware` | [`MiddlewareInput`](#middlewareinput)\<`TValues`\> |

###### Returns

() => `void`

##### reset()

```ts
reset(options?: ResetOptions<TValues>): void;
```

###### Parameters

| Parameter  | Type                                         |
| ---------- | -------------------------------------------- |
| `options?` | [`ResetOptions`](#resetoptions)\<`TValues`\> |

###### Returns

`void`

##### validate()

```ts
validate(options?: ValidateOptions): Promise<boolean>;
```

###### Parameters

| Parameter  | Type                                  |
| ---------- | ------------------------------------- |
| `options?` | [`ValidateOptions`](#validateoptions) |

###### Returns

`Promise`\<`boolean`\>

##### values()

###### Call Signature

```ts
values(): TValues;
```

###### Returns

`TValues`

###### Call Signature

```ts
values(path: string): unknown;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

`unknown`

##### get()

```ts
get(path: string): unknown;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

`unknown`

##### errors()

```ts
errors(path?: string): string | Readonly<Record<string, string>> | undefined;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path?`   | `string` |

###### Returns

`string` \| `Readonly`\<`Record`\<`string`, `string`\>\> \| `undefined`

##### setValue()

```ts
setValue(
   path: string,
   value: unknown,
   options?: SetValueOptions): void;
```

###### Parameters

| Parameter  | Type                                  |
| ---------- | ------------------------------------- |
| `path`     | `string`                              |
| `value`    | `unknown`                             |
| `options?` | [`SetValueOptions`](#setvalueoptions) |

###### Returns

`void`

##### setError()

```ts
setError(path: string, message: string): void;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |
| `message` | `string` |

###### Returns

`void`

##### clearErrors()

```ts
clearErrors(path?: string): void;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path?`   | `string` |

###### Returns

`void`

##### getFieldState()

```ts
getFieldState(path: string): FieldState;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

[`FieldState`](#fieldstate)

##### getFieldMeta()

```ts
getFieldMeta(path: string): FieldMetaState;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

[`FieldMetaState`](#fieldmetastate)

##### getFormState()

```ts
getFormState(): FormState<TValues>;
```

###### Returns

[`FormState`](#formstate)\<`TValues`\>

##### getSnapshot()

```ts
getSnapshot(): FormState<TValues>;
```

For `useSyncExternalStore(form.subscribe, form.getSnapshot)`. Not a durable checkpoint.

###### Returns

[`FormState`](#formstate)\<`TValues`\>

##### getPresentation()

###### Call Signature

```ts
getPresentation(path: string): PresentationState;
```

Per-path presentation (field UI + options + form UI).

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

[`PresentationState`](#presentationstate)

###### Call Signature

```ts
getPresentation(): PresentationSnapshot;
```

Full presentation maps (same sources as `state.fieldUi` / `formUi` / `fieldOptions`).

###### Returns

[`PresentationSnapshot`](#presentationsnapshot)

##### createCheckpoint()

```ts
createCheckpoint(options?: CreateCheckpointOptions): FormCheckpoint<TValues>;
```

Durable checkpoint for undo/restore flows — see `restoreCheckpoint`.

###### Parameters

| Parameter  | Type                                                  |
| ---------- | ----------------------------------------------------- |
| `options?` | [`CreateCheckpointOptions`](#createcheckpointoptions) |

###### Returns

[`FormCheckpoint`](#formcheckpoint)\<`TValues`\>

##### restoreCheckpoint()

```ts
restoreCheckpoint(checkpoint: FormCheckpoint<TValues>, options?: RestoreCheckpointOptions): void;
```

###### Parameters

| Parameter    | Type                                                    |
| ------------ | ------------------------------------------------------- |
| `checkpoint` | [`FormCheckpoint`](#formcheckpoint)\<`TValues`\>        |
| `options?`   | [`RestoreCheckpointOptions`](#restorecheckpointoptions) |

###### Returns

`void`

##### getValues()

```ts
getValues(): TValues;
```

###### Returns

`TValues`

##### getErrors()

```ts
getErrors(): Readonly<Record<FieldPath, string>>;
```

###### Returns

`Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `string`\>\>

##### isValid()

```ts
isValid(): boolean;
```

###### Returns

`boolean`

##### isSubmitting()

```ts
isSubmitting(): boolean;
```

###### Returns

`boolean`

##### submissionGuard()

```ts
submissionGuard(options?: Pick<SubmitOptions, "preventDoubleSubmit">): SubmissionGuardResult;
```

Hard submission eligibility (enforced by `submit()`).
Distinct from `form.ui.canSubmit` (UX projection + `disableSubmitWhen`).

###### Parameters

| Parameter  | Type                                                                 |
| ---------- | -------------------------------------------------------------------- |
| `options?` | `Pick`\<[`SubmitOptions`](#submitoptions), `"preventDoubleSubmit"`\> |

###### Returns

`SubmissionGuardResult`

##### isDirty()

```ts
isDirty(): boolean;
```

###### Returns

`boolean`

##### changedFields()

```ts
changedFields(): readonly string[];
```

###### Returns

readonly `string`[]

##### changedSinceSubmitFields()

```ts
changedSinceSubmitFields(): readonly string[];
```

###### Returns

readonly `string`[]

##### diffFromDefaults()

```ts
diffFromDefaults(options?: FormDiffOptions): Promise<FormDiffResult>;
```

###### Parameters

| Parameter  | Type                                  |
| ---------- | ------------------------------------- |
| `options?` | [`FormDiffOptions`](#formdiffoptions) |

###### Returns

`Promise`\<[`FormDiffResult`](#formdiffresult)\>

##### diffFrom()

```ts
diffFrom(baseline: Record<string, unknown>, options?: FormDiffOptions): Promise<FormDiffResult>;
```

###### Parameters

| Parameter  | Type                                  |
| ---------- | ------------------------------------- |
| `baseline` | `Record`\<`string`, `unknown`\>       |
| `options?` | [`FormDiffOptions`](#formdiffoptions) |

###### Returns

`Promise`\<[`FormDiffResult`](#formdiffresult)\>

##### when()

```ts
when(field: string): WhenRuleBuilder<TValues>;
```

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `field`   | `string` |

###### Returns

`WhenRuleBuilder`\<`TValues`\>

##### dependencies()

###### Call Signature

```ts
dependencies(map: Readonly<Record<string, string | readonly string[]>>): void;
```

Register explicit dependency map (fail-fast on cycles).

###### Parameters

| Parameter | Type                                                                |
| --------- | ------------------------------------------------------------------- |
| `map`     | `Readonly`\<`Record`\<`string`, `string` \| readonly `string`[]\>\> |

###### Returns

`void`

###### Call Signature

```ts
dependencies(): DependencyRegistrar<TValues>;
```

Fluent dependency registrar + `inspect()`.

###### Returns

[`DependencyRegistrar`](#dependencyregistrar)\<`TValues`\>

##### calculate()

###### Call Signature

```ts
calculate(path: string): CalculationBuilder<TValues>;
```

Fluent derived field: `form.calculate("total").from("price","qty").compute(...)`.

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

[`CalculationBuilder`](#calculationbuilder)\<`TValues`\>

###### Call Signature

```ts
calculate(path: string, options:
  | CalculateOptions<TValues>
  | ((context: {
  values: TValues;
}) => unknown)): void;
```

###### Parameters

| Parameter | Type                                                                                                              |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `path`    | `string`                                                                                                          |
| `options` | \| [`CalculateOptions`](#calculateoptions)\<`TValues`\> \| ((`context`: \{ `values`: `TValues`; \}) => `unknown`) |

###### Returns

`void`

##### transform()

###### Call Signature

```ts
transform(path: string): TransformPipelineHandle;
```

Register inbound transform stages for a path.

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

[`TransformPipelineHandle`](#transformpipelinehandle)

###### Call Signature

```ts
transform(path: string, stages: readonly TransformFn<TValues>[]): void;
```

###### Parameters

| Parameter | Type                                                  |
| --------- | ----------------------------------------------------- |
| `path`    | `string`                                              |
| `stages`  | readonly [`TransformFn`](#transformfn)\<`TValues`\>[] |

###### Returns

`void`

##### saveDraft()

```ts
saveDraft(): void;
```

###### Returns

`void`

##### restoreDraft()

```ts
restoreDraft(options?: RestoreDraftOptions): Promise<boolean>;
```

Restore persisted draft into the live form (after mount).
Returns `true` when values were applied; `false` when skipped
(disabled / empty / declined / dirty without `force` / corrupt).

###### Parameters

| Parameter  | Type                                          |
| ---------- | --------------------------------------------- |
| `options?` | [`RestoreDraftOptions`](#restoredraftoptions) |

###### Returns

`Promise`\<`boolean`\>

##### undo()

```ts
undo(): boolean;
```

###### Returns

`boolean`

##### redo()

```ts
redo(): boolean;
```

###### Returns

`boolean`

##### getAnalytics()

```ts
getAnalytics(): FormAnalyticsSnapshot;
```

###### Returns

[`FormAnalyticsSnapshot`](#formanalyticssnapshot)

##### flushOfflineQueue()

```ts
flushOfflineQueue(): Promise<{
  flushed: number;
  failed: number;
}>;
```

###### Returns

`Promise`\<\{
`flushed`: `number`;
`failed`: `number`;
\}\>

##### use()

###### Call Signature

```ts
use(plugin: FormPlugin<TValues>): void;
```

###### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `plugin`  | [`FormPlugin`](#formplugin)\<`TValues`\> |

###### Returns

`void`

###### Call Signature

```ts
use<TSelected>(selector: FormSelector<TValues, TSelected>): TSelected;
```

###### Type Parameters

| Type Parameter |
| -------------- |
| `TSelected`    |

###### Parameters

| Parameter  | Type                                                      |
| ---------- | --------------------------------------------------------- |
| `selector` | [`FormSelector`](#formselector)\<`TValues`, `TSelected`\> |

###### Returns

`TSelected`

##### listPlugins()

```ts
listPlugins(): readonly {
  name: string;
  order: number;
  version?: string;
}[];
```

Registered plugins (name / order / version) for DevTools introspection.

###### Returns

readonly \{
`name`: `string`;
`order`: `number`;
`version?`: `string`;
\}[]

##### subscribe()

```ts
subscribe(listener: () => void): () => void;
```

Advanced: reactive UI updates. Framework adapters call this internally.
For declarative create-time listeners, prefer `createForm({ subscribe })`.

###### Parameters

| Parameter  | Type         |
| ---------- | ------------ |
| `listener` | () => `void` |

###### Returns

() => `void`

##### on()

```ts
on(event: FormEvent, listener: () => void): () => void;
```

###### Parameters

| Parameter  | Type                      |
| ---------- | ------------------------- |
| `event`    | [`FormEvent`](#formevent) |
| `listener` | () => `void`              |

###### Returns

() => `void`

##### destroy()

```ts
destroy(): void;
```

###### Returns

`void`

##### registerPlugin()

```ts
registerPlugin(plugin: FormPlugin<TValues>): void;
```

###### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `plugin`  | [`FormPlugin`](#formplugin)\<`TValues`\> |

###### Returns

`void`

---

### FormPluginSetupResult

#### Properties

| Property                            | Modifier   | Type         |
| ----------------------------------- | ---------- | ------------ |
| <a id="ondestroy"></a> `onDestroy?` | `readonly` | () => `void` |

---

### FormPlugin

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                          | Modifier   | Type     | Description                                                                                                       |
| --------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| <a id="name-7"></a> `name`        | `readonly` | `string` | -                                                                                                                 |
| <a id="version-1"></a> `version?` | `readonly` | `string` | Plugin package/semver label (metadata only).                                                                      |
| <a id="engines"></a> `engines?`   | `readonly` | `string` | Semver range against `@jayoncode/form-intelligence` (`>=3.1.0`, `^3.1.0`, or exact). Checked at `register`/`use`. |
| <a id="order-2"></a> `order?`     | `readonly` | `number` | -                                                                                                                 |

#### Methods

##### setup()

```ts
setup(form: FormInstance<TValues>, api: FormPluginApi<TValues>): void | FormPluginSetupResult | (() => void);
```

###### Parameters

| Parameter | Type                                         |
| --------- | -------------------------------------------- |
| `form`    | [`FormInstance`](#forminstance)\<`TValues`\> |
| `api`     | `FormPluginApi`\<`TValues`\>                 |

###### Returns

`void` \| [`FormPluginSetupResult`](#formpluginsetupresult) \| (() => `void`)

## Type Aliases

### FieldController

```ts
type FieldController<TValues> = FieldHandle<TValues>;
```

Preferred UI binding surface over reaching into form internals (Phase 16).
Alias of the enhanced `FieldHandle` (includes `aria` / `setAriaIds`).

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

---

### DependencyAction

```ts
type DependencyAction = "clear" | "reloadOptions" | "revalidate" | "recompute" | "preserve";
```

---

### DependencyMap

```ts
type DependencyMap = Readonly<Record<FieldPath, FieldPath | readonly FieldPath[]>>;
```

Map sugar: child path → parent path(s).

---

### TransformFn

```ts
type TransformFn<TValues> = (value: unknown, ctx: TransformContext<TValues>) => unknown;
```

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                                 |
| --------- | ---------------------------------------------------- |
| `value`   | `unknown`                                            |
| `ctx`     | [`TransformContext`](#transformcontext)\<`TValues`\> |

#### Returns

`unknown`

---

### FieldUiMap

```ts
type FieldUiMap = Readonly<Record<string, FieldUiState>>;
```

---

### WizardNavigateValidation

```ts
type WizardNavigateValidation = "step" | "all" | "none";
```

Validation scope for `workflow.goTo`. Default `"all"` preserves SHIPPED behavior.

---

### FormatPreset

```ts
type FormatPreset = "philippine-phone" | "credit-card" | "phone" | "currency" | "slug";
```

---

### Formatter

```ts
type Formatter = (value: unknown) => unknown;
```

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`unknown`

---

### Parser

```ts
type Parser = (value: unknown) => unknown;
```

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`unknown`

---

### PluginPipelineStage

```ts
type PluginPipelineStage = (typeof PLUGIN_PIPELINE_STAGES)[number];
```

---

### PluginErrorHandler

```ts
type PluginErrorHandler = (report: PluginErrorReport) => void;
```

#### Parameters

| Parameter | Type                                      |
| --------- | ----------------------------------------- |
| `report`  | [`PluginErrorReport`](#pluginerrorreport) |

#### Returns

`void`

---

### MiddlewarePhase

```ts
type MiddlewarePhase =
  | "beforeValidate"
  | "afterValidate"
  | "beforeSubmit"
  | "afterSubmit"
  | "submitError"
  | "beforeSetValue"
  | "afterSetValue";
```

Phases that onion middleware and plugin hooks can observe.

---

### MiddlewareNext

```ts
type MiddlewareNext = () => Promise<void>;
```

#### Returns

`Promise`\<`void`\>

---

### FormMiddleware

```ts
type FormMiddleware<TValues> = (
  ctx: MiddlewareContext<TValues>,
  next: MiddlewareNext,
) => void | Promise<void>;
```

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `ctx`     | [`MiddlewareContext`](#middlewarecontext)\<`TValues`\> |
| `next`    | [`MiddlewareNext`](#middlewarenext)                    |

#### Returns

`void` \| `Promise`\<`void`\>

---

### MiddlewareInput

```ts
type MiddlewareInput<TValues> =
  | (FormMiddleware<TValues> & Partial<MiddlewareRegistration>)
  | (MiddlewareRegistration & {
      run: FormMiddleware<TValues>;
    });
```

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

---

### TtlInput

```ts
type TtlInput = number | `${number}ms` | `${number}s` | `${number}m` | `${number}h`;
```

---

### FieldPath

```ts
type FieldPath = string;
```

---

### FormRuleInput

```ts
type FormRuleInput<TValues> =
  FormRuleDefinition<TValues> | WhenRuleBuilder<TValues> | WhenRuleBuilder;
```

Plain rule object or a `when()` builder (`createForm` calls `.build()` for builders).

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

---

### ValidationMode

```ts
type ValidationMode = "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
```

---

### FormEvent

```ts
type FormEvent =
  | "change"
  | "blur"
  | "focus"
  | "reset"
  | "submit"
  | "validate"
  | "validated"
  | "autosave"
  | "draft";
```

---

### ValidatorResult

```ts
type ValidatorResult = true | false | string | undefined;
```

---

### BuiltInFieldType

```ts
type BuiltInFieldType = "text" | "email" | "password" | "url";
```

---

### CustomFieldValidator

```ts
type CustomFieldValidator<TValues> = (
  context: CustomFieldValidatorContext<TValues>,
) => ValidatorResult | Promise<ValidatorResult>;
```

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                                                       |
| --------- | -------------------------------------------------------------------------- |
| `context` | [`CustomFieldValidatorContext`](#customfieldvalidatorcontext)\<`TValues`\> |

#### Returns

\| [`ValidatorResult`](#validatorresult)
\| `Promise`\<[`ValidatorResult`](#validatorresult)\>

---

### FormRef

```ts
type FormRef = (element: HTMLFormElement | null) => void;
```

#### Parameters

| Parameter | Type                        |
| --------- | --------------------------- |
| `element` | `HTMLFormElement` \| `null` |

#### Returns

`void`

---

### FieldSchemaDefinition

```ts
type FieldSchemaDefinition = BuiltInFieldType | FieldSchemaConfig;
```

---

### Validator

```ts
type Validator<TValues> = (
  value: unknown,
  context: ValidationContext<TValues>,
) => ValidatorResult | Promise<ValidatorResult>;
```

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `value`   | `unknown`                                              |
| `context` | [`ValidationContext`](#validationcontext)\<`TValues`\> |

#### Returns

\| [`ValidatorResult`](#validatorresult)
\| `Promise`\<[`ValidatorResult`](#validatorresult)\>

---

### DraftRestoreDeclinePolicy

```ts
type DraftRestoreDeclinePolicy = "keep" | "clear" | "remember";
```

Policy when `onRestorePrompt` returns `false` (user declined).

- `keep` — leave the draft; the next prompt can ask again (default)
- `clear` — delete the draft so it will not prompt again
- `remember` — keep the draft; suppress prompts for the same draft content until it changes

---

### RestorePromptResult

```ts
type RestorePromptResult = boolean | "defer";
```

Result of `onRestorePrompt`.

- `true` — restore
- `false` — decline and apply `onRestoreDecline`
- `"defer"` — skip this attempt without applying decline policy (e.g. wait until after mount)

---

### SubmitPhase

```ts
type SubmitPhase = "idle" | "validating" | "submitting" | "success" | "error";
```

Submit lifecycle phase (Phase 10). `isSubmitting` remains the boolean loading flag.

---

### FormSubscribeListener

```ts
type FormSubscribeListener<TValues> = (form: FormInstance<TValues>) => void;
```

State listener for `createForm({ subscribe })`. Receives the form instance.
Lives until `form.destroy()` — use `form.subscribe()` when you need unsubscribe.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                         |
| --------- | -------------------------------------------- |
| `form`    | [`FormInstance`](#forminstance)\<`TValues`\> |

#### Returns

`void`

---

### FormSelector

```ts
type FormSelector<TValues, TSelected> = (state: FormState<TValues>) => TSelected;
```

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |
| `TSelected`                                         |

#### Parameters

| Parameter | Type                                   |
| --------- | -------------------------------------- |
| `state`   | [`FormState`](#formstate)\<`TValues`\> |

#### Returns

`TSelected`

---

### AsyncValidator

```ts
type AsyncValidator<TValues> = Validator<TValues> & {
  __async: true;
};
```

#### Type Declaration

| Name      | Type   |
| --------- | ------ |
| `__async` | `true` |

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

---

### AsyncValidatorWithOptions

```ts
type AsyncValidatorWithOptions<TValues> = AsyncValidator<TValues> & {
  __asyncOptions: AsyncValidatorOptions<TValues>;
};
```

#### Type Declaration

| Name             | Type                                                           |
| ---------------- | -------------------------------------------------------------- |
| `__asyncOptions` | [`AsyncValidatorOptions`](#asyncvalidatoroptions)\<`TValues`\> |

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

## Variables

### DEFAULT\_FIELD\_UI

```ts
const DEFAULT_FIELD_UI: FieldUiState;
```

Defaults when a path is missing from `fieldUi` (API freeze §5).

---

### PRESENTATION\_OWNERSHIP

```ts
const PRESENTATION_OWNERSHIP: {
  producers: readonly ["workflow.rules", "dependency.populate", "schema.requiredBaseline"];
  consumers: readonly ["dom.enhancer", "framework.adapters", "a11y"];
  nonWriters: readonly ["validation", "transform", "format"];
};
```

Ownership note (Phase 9 / ADR-018): Workflow rules and schema/static
`required` baseline produce UI intents; Presentation exposes them.
Validation must not write `visible`/`hidden`/`required` on validate ticks.
DOM enhancer and adapters consume `getPresentation` / `field.ui` only.

#### Type Declaration

| Name                                          | Type                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| <a id="property-producers"></a> `producers`   | readonly \[`"workflow.rules"`, `"dependency.populate"`, `"schema.requiredBaseline"`\] |
| <a id="property-consumers"></a> `consumers`   | readonly \[`"dom.enhancer"`, `"framework.adapters"`, `"a11y"`\]                       |
| <a id="property-nonwriters"></a> `nonWriters` | readonly \[`"validation"`, `"transform"`, `"format"`\]                                |

---

### TRANSFORM\_INBOUND\_ORDER

```ts
const TRANSFORM_INBOUND_ORDER: readonly ["trim", "normalize", "sanitize", "custom", "parse"];
```

Fixed inbound stage order (Alg 8 / 13_TRANSFORM_ENGINE).
Format/display is outbound-only and is not part of this list.

---

### PLUGIN\_PIPELINE\_STAGES

```ts
const PLUGIN_PIPELINE_STAGES: readonly [
  "beforeValidate",
  "validate",
  "afterValidate",
  "beforeSubmit",
  "submit",
  "afterSubmit",
  "submitError",
];
```

Documented interceptor stages (Phase 15).
Onion `useMiddleware` + plugin hooks share this map (D-MW-VS-PLUGIN).

---

### MIDDLEWARE\_HOOK\_MAP

```ts
const MIDDLEWARE_HOOK_MAP: {
  beforeValidate: "beforeValidate";
  afterValidate: "afterValidate";
  beforeSubmit: "beforeSubmit";
  afterSubmit: "afterSubmit";
};
```

Maps plugin hook names → middleware phases (Phase 10 / D-MW-VS-PLUGIN).
Plugin `api.on(hook)` and `form.useMiddleware` share one interceptor stack per phase.
Documented pipeline stages: see `PLUGIN_PIPELINE_STAGES`.

#### Type Declaration

| Name                                                  | Type               | Default value      |
| ----------------------------------------------------- | ------------------ | ------------------ |
| <a id="property-beforevalidate"></a> `beforeValidate` | `"beforeValidate"` | `"beforeValidate"` |
| <a id="property-aftervalidate"></a> `afterValidate`   | `"afterValidate"`  | `"afterValidate"`  |
| <a id="property-beforesubmit"></a> `beforeSubmit`     | `"beforeSubmit"`   | `"beforeSubmit"`   |
| <a id="property-aftersubmit"></a> `afterSubmit`       | `"afterSubmit"`    | `"afterSubmit"`    |

---

### MIDDLEWARE\_ONLY\_PHASES

```ts
const MIDDLEWARE_ONLY_PHASES: readonly ["submitError", "beforeSetValue", "afterSetValue"];
```

Phases that exist only on the middleware onion (no plugin hook synonym yet).

---

### ASYNC\_VALIDATOR\_OPTION\_DEFAULTS

```ts
const ASYNC_VALIDATOR_OPTION_DEFAULTS: {
  debounce: 300;
  retry: 0;
  timeout: undefined;
  cache: false;
  abortPrevious: true;
  preventDuplicates: true;
  sharedCache: false;
  offline: "skip";
};
```

Defaults when the options-object overload is used (API_SIGNATURE_FREEZE §1).

#### Type Declaration

| Name                                                        | Type        | Default value |
| ----------------------------------------------------------- | ----------- | ------------- |
| <a id="property-debounce"></a> `debounce`                   | `300`       | `300`         |
| <a id="property-retry"></a> `retry`                         | `0`         | `0`           |
| <a id="property-timeout"></a> `timeout`                     | `undefined` | `undefined`   |
| <a id="property-cache"></a> `cache`                         | `false`     | `false`       |
| <a id="property-abortprevious"></a> `abortPrevious`         | `true`      | `true`        |
| <a id="property-preventduplicates"></a> `preventDuplicates` | `true`      | `true`        |
| <a id="property-sharedcache"></a> `sharedCache`             | `false`     | `false`       |
| <a id="property-offline"></a> `offline`                     | `"skip"`    | `"skip"`      |

---

### email

```ts
const email: Validator;
```

---

### required

```ts
const required: Validator;
```

---

### url

```ts
const url: Validator;
```

---

### FORM\_INTELLIGENT\_VERSION

```ts
const FORM_INTELLIGENT_VERSION: "3.1.0" = "3.1.0";
```

Package version used for plugin `engines` compatibility checks.

## Functions

### createFormController()

```ts
function createFormController<TValues>(form: FormInstance<TValues>): FormController<TValues>;
```

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                         |
| --------- | -------------------------------------------- |
| `form`    | [`FormInstance`](#forminstance)\<`TValues`\> |

#### Returns

[`FormController`](#formcontroller)\<`TValues`\>

---

### isFrameworkAdapter()

```ts
function isFrameworkAdapter(value: unknown): value is FrameworkAdapter<Record<string, unknown>>;
```

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`value is FrameworkAdapter<Record<string, unknown>>`

---

### isPersistenceAdapter()

```ts
function isPersistenceAdapter(value: unknown): value is PersistenceAdapter<Record<string, unknown>>;
```

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`value is PersistenceAdapter<Record<string, unknown>>`

---

### isSchemaAdapter()

```ts
function isSchemaAdapter(value: unknown): value is SchemaAdapter<Record<string, unknown>>;
```

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`value is SchemaAdapter<Record<string, unknown>>`

---

### isSubmitTransportAdapter()

```ts
function isSubmitTransportAdapter(
  value: unknown,
): value is SubmitTransportAdapter<Record<string, unknown>, unknown>;
```

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`value is SubmitTransportAdapter<Record<string, unknown>, unknown>`

---

### createForm()

```ts
function createForm<TValues>(config: FormConfig<TValues>): FormInstance<TValues>;
```

Create a form workflow instance. Pass `target` / `form.ref` for DOM-backed forms
(HTML constraints imported on attach), or `initialValues` for headless usage.

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `config`  | [`FormConfig`](#formconfig)\<`TValues`\> |

#### Returns

[`FormInstance`](#forminstance)\<`TValues`\>

---

### pluginAsModule()

```ts
function pluginAsModule<TValues>(
  plugin: FormPlugin<TValues>,
  order?: number,
  api?: FormPluginApi<TValues>,
): FormModule<TValues>;
```

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `plugin`  | [`FormPlugin`](#formplugin)\<`TValues`\> |
| `order`   | `number`                                 |
| `api?`    | `FormPluginApi`\<`TValues`\>             |

#### Returns

[`FormModule`](#formmodule)\<`TValues`\>

---

### computeFieldAria()

```ts
function computeFieldAria(input: ComputeFieldAriaInput): FieldAriaResult;
```

Pure ARIA computation from field state — no DOM queries (Phase 16 / Spec 27).

#### Parameters

| Parameter | Type                                              |
| --------- | ------------------------------------------------- |
| `input`   | [`ComputeFieldAriaInput`](#computefieldariainput) |

#### Returns

[`FieldAriaResult`](#fieldariaresult)

---

### calculate()

```ts
function calculate<TValues>(path: string): CalculationBuilder<TValues>;
```

Root helper — returns an unbound builder. Prefer `form.calculate(path)`.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

#### Returns

[`CalculationBuilder`](#calculationbuilder)\<`TValues`\>

---

### dependencies()

```ts
function dependencies(map: DependencyMap): DependencyMap;
```

Standalone helper — returns a normalized dependency map for config merge.

#### Parameters

| Parameter | Type                              |
| --------- | --------------------------------- |
| `map`     | [`DependencyMap`](#dependencymap) |

#### Returns

[`DependencyMap`](#dependencymap)

---

### resolveFieldUi()

```ts
function resolveFieldUi(
  path: string,
  fieldUi: FieldUiMap,
  extras?: {
    busy?: boolean;
  },
): FieldUiState;
```

Resolve presentation flags for a path with freeze defaults.

#### Parameters

| Parameter      | Type                        |
| -------------- | --------------------------- |
| `path`         | `string`                    |
| `fieldUi`      | [`FieldUiMap`](#fielduimap) |
| `extras?`      | \{ `busy?`: `boolean`; \}   |
| `extras.busy?` | `boolean`                   |

#### Returns

[`FieldUiState`](#fielduistate)

---

### createTransformPipeline()

```ts
function createTransformPipeline(
  options?: TransformPipelineOptions,
  outbound?: Formatter,
): TransformPipeline;
```

Compile a reusable inbound transform pipeline.
Stage order is fixed: trim → normalize → sanitize → custom → parse.

#### Parameters

| Parameter   | Type                                                    |
| ----------- | ------------------------------------------------------- |
| `options`   | [`TransformPipelineOptions`](#transformpipelineoptions) |
| `outbound?` | [`Formatter`](#formatter)                               |

#### Returns

`TransformPipeline`

---

### runTransformInbound()

```ts
function runTransformInbound<TValues>(
  raw: unknown,
  options: TransformPipelineOptions | readonly TransformFn<TValues>[] | undefined,
  ctx: TransformContext<TValues>,
): unknown;
```

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                                                                                                               |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `raw`     | `unknown`                                                                                                                          |
| `options` | \| [`TransformPipelineOptions`](#transformpipelineoptions) \| readonly [`TransformFn`](#transformfn)\<`TValues`\>[] \| `undefined` |
| `ctx`     | [`TransformContext`](#transformcontext)\<`TValues`\>                                                                               |

#### Returns

`unknown`

---

### when()

```ts
function when<TValues>(field: string): WhenRuleBuilder<TValues>;
```

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `field`   | `string` |

#### Returns

`WhenRuleBuilder`\<`TValues`\>

---

### satisfiesEnginesRange()

```ts
function satisfiesEnginesRange(range: string, version?: string): boolean;
```

Minimal semver range check for plugin `engines` metadata.
Supports: `>=x.y.z`, `^x.y.z`, exact `x.y.z`.

#### Parameters

| Parameter | Type     | Default value              |
| --------- | -------- | -------------------------- |
| `range`   | `string` | `undefined`                |
| `version` | `string` | `FORM_INTELLIGENT_VERSION` |

#### Returns

`boolean`

---

### composeMiddleware()

```ts
function composeMiddleware<TContext>(
  middlewares: readonly PluginMiddleware<TContext>[],
): (context: TContext) => Promise<void>;
```

#### Type Parameters

| Type Parameter |
| -------------- |
| `TContext`     |

#### Parameters

| Parameter     | Type                                        |
| ------------- | ------------------------------------------- |
| `middlewares` | readonly `PluginMiddleware`\<`TContext`\>[] |

#### Returns

(`context`: `TContext`) => `Promise`\<`void`\>

---

### runMiddlewareChain()

```ts
function runMiddlewareChain<TContext>(
  middlewares: readonly PluginMiddleware<TContext>[],
  context: TContext,
): Promise<void>;
```

#### Type Parameters

| Type Parameter |
| -------------- |
| `TContext`     |

#### Parameters

| Parameter     | Type                                        |
| ------------- | ------------------------------------------- |
| `middlewares` | readonly `PluginMiddleware`\<`TContext`\>[] |
| `context`     | `TContext`                                  |

#### Returns

`Promise`\<`void`\>

---

### clearSharedValidationCaches()

```ts
function clearSharedValidationCaches(): void;
```

Test helper — clears shared namespaces.

#### Returns

`void`

---

### parseTtl()

```ts
function parseTtl(input: TtlInput): number;
```

Parse TTL input to milliseconds.
Plain numbers are treated as milliseconds.

#### Parameters

| Parameter | Type                    |
| --------- | ----------------------- |
| `input`   | [`TtlInput`](#ttlinput) |

#### Returns

`number`

---

### matchesField()

```ts
function matchesField<TValues>(targetPath: string, message?: string): Validator<TValues>;
```

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter    | Type     | Default value          |
| ------------ | -------- | ---------------------- |
| `targetPath` | `string` | `undefined`            |
| `message`    | `string` | `"Values must match."` |

#### Returns

[`Validator`](#validator)\<`TValues`\>

---

### requiredWhen()

```ts
function requiredWhen<TValues>(
  sourcePath: string,
  predicate: (value: unknown, context: ValidationContext<TValues>) => boolean,
  message?: string,
): Validator<TValues>;
```

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter    | Type                                                                                                 | Default value               |
| ------------ | ---------------------------------------------------------------------------------------------------- | --------------------------- |
| `sourcePath` | `string`                                                                                             | `undefined`                 |
| `predicate`  | (`value`: `unknown`, `context`: [`ValidationContext`](#validationcontext)\<`TValues`\>) => `boolean` | `undefined`                 |
| `message`    | `string`                                                                                             | `"This field is required."` |

#### Returns

[`Validator`](#validator)\<`TValues`\>

---

### runValidationPipeline()

```ts
function runValidationPipeline<TValues>(
  input: ValidationPipelineInput<TValues>,
): Promise<Record<string, string>>;
```

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                   |
| --------- | -------------------------------------- |
| `input`   | `ValidationPipelineInput`\<`TValues`\> |

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

---

### currency()

```ts
function currency(options?: CurrencyValidatorOptions): Validator;
```

#### Parameters

| Parameter | Type                       |
| --------- | -------------------------- |
| `options` | `CurrencyValidatorOptions` |

#### Returns

[`Validator`](#validator)

---

### custom()

```ts
function custom<TValues>(fn: CustomFieldValidator<TValues>): Validator<TValues>;
```

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                                         |
| --------- | ------------------------------------------------------------ |
| `fn`      | [`CustomFieldValidator`](#customfieldvalidator)\<`TValues`\> |

#### Returns

[`Validator`](#validator)\<`TValues`\>

---

### asyncValidator()

#### Call Signature

```ts
function asyncValidator<TValues>(validate: Validator<TValues>): AsyncValidator<TValues>;
```

##### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

##### Parameters

| Parameter  | Type                                   |
| ---------- | -------------------------------------- |
| `validate` | [`Validator`](#validator)\<`TValues`\> |

##### Returns

[`AsyncValidator`](#asyncvalidator)\<`TValues`\>

#### Call Signature

```ts
function asyncValidator<TValues>(
  options: AsyncValidatorOptions<TValues>,
): AsyncValidatorWithOptions<TValues>;
```

##### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

##### Parameters

| Parameter | Type                                                           |
| --------- | -------------------------------------------------------------- |
| `options` | [`AsyncValidatorOptions`](#asyncvalidatoroptions)\<`TValues`\> |

##### Returns

[`AsyncValidatorWithOptions`](#asyncvalidatorwithoptions)\<`TValues`\>

---

### isAsyncValidator()

```ts
function isAsyncValidator<TValues>(
  validator: Validator<TValues>,
): validator is AsyncValidator<TValues>;
```

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter   | Type                                   |
| ----------- | -------------------------------------- |
| `validator` | [`Validator`](#validator)\<`TValues`\> |

#### Returns

`validator is AsyncValidator<TValues>`

---

### getAsyncValidatorOptions()

```ts
function getAsyncValidatorOptions<TValues>(
  validator: Validator<TValues>,
): AsyncValidatorOptions<TValues> | undefined;
```

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter   | Type                                   |
| ----------- | -------------------------------------- |
| `validator` | [`Validator`](#validator)\<`TValues`\> |

#### Returns

\| [`AsyncValidatorOptions`](#asyncvalidatoroptions)\<`TValues`\>
\| `undefined`

---

### date()

```ts
function date(options?: DateValidatorOptions): Validator;
```

#### Parameters

| Parameter | Type                   |
| --------- | ---------------------- |
| `options` | `DateValidatorOptions` |

#### Returns

[`Validator`](#validator)

---

### maxLength()

```ts
function maxLength(max: number): Validator;
```

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `max`     | `number` |

#### Returns

[`Validator`](#validator)

---

### minLength()

```ts
function minLength(min: number): Validator;
```

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `min`     | `number` |

#### Returns

[`Validator`](#validator)

---

### number()

```ts
function number(options?: NumberValidatorOptions): Validator;
```

#### Parameters

| Parameter | Type                     |
| --------- | ------------------------ |
| `options` | `NumberValidatorOptions` |

#### Returns

[`Validator`](#validator)

---

### min()

```ts
function min(minimum: number): Validator;
```

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `minimum` | `number` |

#### Returns

[`Validator`](#validator)

---

### max()

```ts
function max(maximum: number): Validator;
```

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `maximum` | `number` |

#### Returns

[`Validator`](#validator)

---

### password()

```ts
function password(options?: PasswordValidatorOptions): Validator;
```

#### Parameters

| Parameter | Type                       |
| --------- | -------------------------- |
| `options` | `PasswordValidatorOptions` |

#### Returns

[`Validator`](#validator)

---

### phone()

```ts
function phone(message?: string): Validator;
```

#### Parameters

| Parameter | Type     | Default value                   |
| --------- | -------- | ------------------------------- |
| `message` | `string` | `"Enter a valid phone number."` |

#### Returns

[`Validator`](#validator)

---

### regex()

```ts
function regex(pattern: RegExp, message?: string): Validator;
```

#### Parameters

| Parameter | Type     | Default value       |
| --------- | -------- | ------------------- |
| `pattern` | `RegExp` | `undefined`         |
| `message` | `string` | `"Invalid format."` |

#### Returns

[`Validator`](#validator)
