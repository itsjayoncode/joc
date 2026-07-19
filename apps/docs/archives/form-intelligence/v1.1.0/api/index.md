**@jayoncode/form-intelligence API**

---

# @jayoncode/form-intelligence API

## Classes

### FormModuleHost\<TValues\>

Defined in: core/form-module-host.ts:30

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

Defined in: core/form-module-host.ts:35

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

Defined in: core/form-module-host.ts:42

###### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `module`  | [`FormModule`](#formmodule)\<`TValues`\> |

###### Returns

`void`

##### registerPlugin()

```ts
registerPlugin(plugin: FormPlugin<TValues>, order: number): void;
```

Defined in: core/form-module-host.ts:52

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

Defined in: core/form-module-host.ts:56

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

Defined in: core/form-module-host.ts:60

###### Returns

`void`

##### destroy()

```ts
destroy(): void;
```

Defined in: core/form-module-host.ts:71

###### Returns

`void`

---

### FormModuleRegistry\<TValues\>

Defined in: core/module-registry.ts:10

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

Defined in: core/module-registry.ts:14

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

Defined in: core/module-registry.ts:26

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

Defined in: core/module-registry.ts:30

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

Defined in: core/module-registry.ts:34

###### Returns

`number`

##### list()

```ts
list(): readonly FormModule<TValues>[];
```

Defined in: core/module-registry.ts:38

###### Returns

readonly [`FormModule`](#formmodule)\<`TValues`\>[]

##### initializeAll()

```ts
initializeAll(context: FormModuleContext<TValues>): void;
```

Defined in: core/module-registry.ts:42

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

Defined in: core/module-registry.ts:48

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

Defined in: core/module-registry.ts:54

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

Defined in: core/module-registry.ts:60

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

---

### DependencyEngine

Defined in: engines/dependency/dependency-engine.ts:49

Structural dependency graph façade (Phase 6 / ADR-007).

#### Constructors

##### Constructor

```ts
new DependencyEngine(options: DependencyEngineOptions): DependencyEngine;
```

Defined in: engines/dependency/dependency-engine.ts:53

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

Defined in: engines/dependency/dependency-engine.ts:57

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
   actions: readonly DependencyAction[],
   options?: {
  clearValue?: unknown;
  inferred?: boolean;
}): void;
```

Defined in: engines/dependency/dependency-engine.ts:85

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

Defined in: engines/dependency/dependency-engine.ts:104

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

Defined in: engines/dependency/dependency-engine.ts:114

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

Defined in: engines/dependency/dependency-engine.ts:145

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

Defined in: engines/dependency/dependency-engine.ts:149

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

Defined in: engines/dependency/dependency-engine.ts:153

###### Returns

readonly readonly `string`[][]

##### topologicalOrder()

```ts
topologicalOrder(seeds?: readonly string[]): readonly string[];
```

Defined in: engines/dependency/dependency-engine.ts:157

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

Defined in: engines/dependency/dependency-engine.ts:161

###### Returns

[`DependencyGraph`](#dependencygraph)

##### onParentChange()

```ts
onParentChange(path: string): CascadeResult;
```

Defined in: engines/dependency/dependency-engine.ts:169

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

Defined in: errors/index.ts:17

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
   options: FormErrorOptions): FormIntelligentError;
```

Defined in: errors/index.ts:21

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

| Property                       | Modifier   | Type                                       | Defined in         |
| ------------------------------ | ---------- | ------------------------------------------ | ------------------ |
| <a id="code"></a> `code`       | `readonly` | `FormErrorCode`                            | errors/index.ts:18 |
| <a id="details"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | errors/index.ts:19 |

---

### ValidationError

Defined in: errors/index.ts:29

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new ValidationError(message: string, options: FormErrorOptions): ValidationError;
```

Defined in: errors/index.ts:30

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ------------------ |
| <a id="code-1"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | errors/index.ts:18 |
| <a id="details-1"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | errors/index.ts:19 |

---

### SubmitError

Defined in: errors/index.ts:36

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new SubmitError(message: string, options: FormErrorOptions): SubmitError;
```

Defined in: errors/index.ts:37

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ------------------ |
| <a id="code-2"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | errors/index.ts:18 |
| <a id="details-2"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | errors/index.ts:19 |

---

### WorkflowError

Defined in: errors/index.ts:43

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new WorkflowError(message: string, options: FormErrorOptions): WorkflowError;
```

Defined in: errors/index.ts:44

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ------------------ |
| <a id="code-3"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | errors/index.ts:18 |
| <a id="details-3"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | errors/index.ts:19 |

---

### ConfigurationError

Defined in: errors/index.ts:50

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new ConfigurationError(message: string, options: FormErrorOptions): ConfigurationError;
```

Defined in: errors/index.ts:51

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ------------------ |
| <a id="code-4"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | errors/index.ts:18 |
| <a id="details-4"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | errors/index.ts:19 |

---

### DraftStorageError

Defined in: errors/index.ts:58

Recoverable draft persistence failures (quota, corrupt payload).

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new DraftStorageError(message: string, options: FormErrorOptions): DraftStorageError;
```

Defined in: errors/index.ts:59

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ------------------ |
| <a id="code-5"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | errors/index.ts:18 |
| <a id="details-5"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | errors/index.ts:19 |

---

### OfflineQueueError

Defined in: errors/index.ts:66

Offline queue failures (quota, overflow reject).

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new OfflineQueueError(message: string, options: FormErrorOptions): OfflineQueueError;
```

Defined in: errors/index.ts:67

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ------------------ |
| <a id="code-6"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | errors/index.ts:18 |
| <a id="details-6"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | errors/index.ts:19 |

---

### PluginError

Defined in: errors/index.ts:74

Isolated plugin/middleware failures (setup or hook throw).

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new PluginError(message: string, options: FormErrorOptions): PluginError;
```

Defined in: errors/index.ts:75

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ------------------ |
| <a id="code-7"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | errors/index.ts:18 |
| <a id="details-7"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | errors/index.ts:19 |

---

### MiddlewarePipeline\<TValues\>

Defined in: plugins/middleware.ts:103

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

Defined in: plugins/middleware.ts:107

###### Parameters

| Parameter    | Type                                               |
| ------------ | -------------------------------------------------- |
| `middleware` | [`MiddlewareInput`](#middlewareinput)\<`TValues`\> |

###### Returns

```ts
(): void;
```

###### Returns

`void`

##### run()

```ts
run(input: {
  form: FormInstance<TValues>;
  phase: MiddlewarePhase;
  signal: AbortSignal;
  meta?: Readonly<Record<string, unknown>>;
}): Promise<MiddlewareRunResult>;
```

Defined in: plugins/middleware.ts:125

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

Defined in: plugins/middleware.ts:204

###### Returns

`void`

## Interfaces

### FormController\<TValues\>

Defined in: adapters/controllers.ts:20

Thin façade over `FormInstance` for adapters and design systems.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                   | Modifier   | Type                                   | Defined in                 |
| -------------------------- | ---------- | -------------------------------------- | -------------------------- |
| <a id="state"></a> `state` | `readonly` | [`FormState`](#formstate)\<`TValues`\> | adapters/controllers.ts:21 |

#### Methods

##### subscribe()

```ts
subscribe(listener: () => void): () => void;
```

Defined in: adapters/controllers.ts:22

###### Parameters

| Parameter  | Type         |
| ---------- | ------------ |
| `listener` | () => `void` |

###### Returns

```ts
(): void;
```

###### Returns

`void`

##### getSnapshot()

```ts
getSnapshot(): FormState<TValues>;
```

Defined in: adapters/controllers.ts:23

###### Returns

[`FormState`](#formstate)\<`TValues`\>

##### submit()

```ts
submit(options?: SubmitOptions): Promise<boolean>;
```

Defined in: adapters/controllers.ts:24

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

Defined in: adapters/controllers.ts:25

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

Defined in: adapters/controllers.ts:26

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

[`FieldController`](#fieldcontroller)\<`TValues`\>

##### firstInvalidPath()

```ts
firstInvalidPath(): undefined | string;
```

Defined in: adapters/controllers.ts:28

First path with a non-empty error message.

###### Returns

`undefined` \| `string`

##### focusFirstInvalid()

```ts
focusFirstInvalid(): undefined | string;
```

Defined in: adapters/controllers.ts:33

Focuses the first invalid control when a DOM document is available.
Returns the path (or `undefined` if none). Safe no-op under SSR.

###### Returns

`undefined` \| `string`

##### destroy()

```ts
destroy(): void;
```

Defined in: adapters/controllers.ts:34

###### Returns

`void`

---

### FrameworkAdapter\<TValues\>

Defined in: adapters/framework-adapter.ts:7

Contract for framework UI adapters (React, Vue, Angular, Svelte, …).
Implementations ship in separate packages — never required by core.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                 | Modifier   | Type     | Defined in                       |
| ------------------------ | ---------- | -------- | -------------------------------- |
| <a id="name"></a> `name` | `readonly` | `string` | adapters/framework-adapter.ts:10 |

#### Methods

##### connect()

```ts
connect(form: FormInstance<TValues>): void | () => void;
```

Defined in: adapters/framework-adapter.ts:15

Bind framework lifecycle / reactivity to a form instance.
Return a cleanup that disconnects subscriptions and effects.

###### Parameters

| Parameter | Type                                         |
| --------- | -------------------------------------------- |
| `form`    | [`FormInstance`](#forminstance)\<`TValues`\> |

###### Returns

`void` \| () => `void`

---

### PersistenceAdapter\<TValues\>

Defined in: adapters/persistence-adapter.ts:5

Persist form values for drafts and autosave.
Implementations may be sync (localStorage) or async (IndexedDB, remote).

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     | Defined in                        |
| --------------------------- | ---------- | -------- | --------------------------------- |
| <a id="name-1"></a> `name?` | `readonly` | `string` | adapters/persistence-adapter.ts:8 |

#### Methods

##### load()

```ts
load(key: string): null | TValues | Promise<null | TValues>;
```

Defined in: adapters/persistence-adapter.ts:9

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`null` \| `TValues` \| `Promise`\<`null` \| `TValues`\>

##### save()

```ts
save(key: string, values: TValues): void | Promise<void>;
```

Defined in: adapters/persistence-adapter.ts:10

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

Defined in: adapters/persistence-adapter.ts:11

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`void` \| `Promise`\<`void`\>

---

### SyncPersistenceAdapter\<TValues\>

Defined in: adapters/persistence-adapter.ts:18

Sync persistence surface used by draft workflow today.
Compatible with [PersistenceAdapter](#persistenceadapter) when methods are synchronous.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     | Defined in                         |
| --------------------------- | ---------- | -------- | ---------------------------------- |
| <a id="name-2"></a> `name?` | `readonly` | `string` | adapters/persistence-adapter.ts:21 |

#### Methods

##### load()

```ts
load(key: string): null | TValues;
```

Defined in: adapters/persistence-adapter.ts:22

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`null` \| `TValues`

##### save()

```ts
save(key: string, values: TValues): void;
```

Defined in: adapters/persistence-adapter.ts:23

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

Defined in: adapters/persistence-adapter.ts:24

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`void`

---

### SchemaAdapter\<TValues\>

Defined in: adapters/schema-adapter.ts:6

Bridge any validation library into Form Intelligence.
Schema adapters are optional — core never depends on Zod/Yup/etc.
Error keys are field paths (dot notation).

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     | Defined in                   |
| --------------------------- | ---------- | -------- | ---------------------------- |
| <a id="name-3"></a> `name?` | `readonly` | `string` | adapters/schema-adapter.ts:7 |

#### Methods

##### validate()

```ts
validate(values: TValues):
  | Readonly<Record<string, string>>
| Promise<Readonly<Record<string, string>>>;
```

Defined in: adapters/schema-adapter.ts:8

###### Parameters

| Parameter | Type      |
| --------- | --------- |
| `values`  | `TValues` |

###### Returns

\| `Readonly`\<`Record`\<`string`, `string`\>\>
\| `Promise`\<`Readonly`\<`Record`\<`string`, `string`\>\>\>

---

### SubmitTransportAdapter\<TValues, TResult\>

Defined in: adapters/submit-transport-adapter.ts:7

Transport layer for form submission (fetch, GraphQL, custom API clients).
Keep UI frameworks out of this interface — values + meta only.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |
| `TResult`                                           | `unknown`                       |

#### Properties

| Property                    | Modifier   | Type     | Defined in                              |
| --------------------------- | ---------- | -------- | --------------------------------------- |
| <a id="name-4"></a> `name?` | `readonly` | `string` | adapters/submit-transport-adapter.ts:11 |

#### Methods

##### submit()

```ts
submit(values: TValues, meta?: SubmitMeta): TResult | Promise<TResult>;
```

Defined in: adapters/submit-transport-adapter.ts:12

###### Parameters

| Parameter | Type                        |
| --------- | --------------------------- |
| `values`  | `TValues`                   |
| `meta?`   | [`SubmitMeta`](#submitmeta) |

###### Returns

`TResult` \| `Promise`\<`TResult`\>

---

### FormModuleContext\<TValues\>

Defined in: core/module-types.ts:5

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                     | Modifier   | Type                                         | Defined in             |
| ---------------------------- | ---------- | -------------------------------------------- | ---------------------- |
| <a id="form"></a> `form`     | `readonly` | [`FormInstance`](#forminstance)\<`TValues`\> | core/module-types.ts:6 |
| <a id="config"></a> `config` | `readonly` | `ResolvedFormConfig`\<`TValues`\>            | core/module-types.ts:7 |
| <a id="events"></a> `events` | `readonly` | `FormEventBus`                               | core/module-types.ts:8 |

#### Methods

##### registerCleanup()

```ts
registerCleanup(cleanup: () => void): void;
```

Defined in: core/module-types.ts:9

###### Parameters

| Parameter | Type         |
| --------- | ------------ |
| `cleanup` | () => `void` |

###### Returns

`void`

---

### FormModule\<TValues\>

Defined in: core/module-types.ts:12

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     | Defined in              |
| --------------------------- | ---------- | -------- | ----------------------- |
| <a id="id"></a> `id`        | `readonly` | `string` | core/module-types.ts:13 |
| <a id="order"></a> `order?` | `readonly` | `number` | core/module-types.ts:14 |

#### Methods

##### initialize()?

```ts
optional initialize(context: FormModuleContext<TValues>): void;
```

Defined in: core/module-types.ts:15

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

Defined in: core/module-types.ts:16

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

Defined in: core/module-types.ts:17

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

Defined in: core/module-types.ts:18

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

---

### FieldAriaIds

Defined in: engines/accessibility/types.ts:1

#### Properties

| Property                                    | Modifier   | Type     | Defined in                       |
| ------------------------------------------- | ---------- | -------- | -------------------------------- |
| <a id="errorid"></a> `errorId?`             | `readonly` | `string` | engines/accessibility/types.ts:2 |
| <a id="descriptionid"></a> `descriptionId?` | `readonly` | `string` | engines/accessibility/types.ts:3 |

---

### FieldAria

Defined in: engines/accessibility/types.ts:9

CamelCase ARIA snapshot for adapters and FieldController.

#### Properties

| Property                                       | Modifier   | Type                    | Defined in                        |
| ---------------------------------------------- | ---------- | ----------------------- | --------------------------------- |
| <a id="ariainvalid"></a> `ariaInvalid`         | `readonly` | `boolean`               | engines/accessibility/types.ts:10 |
| <a id="ariarequired"></a> `ariaRequired`       | `readonly` | `boolean`               | engines/accessibility/types.ts:11 |
| <a id="ariadescribedby"></a> `ariaDescribedBy` | `readonly` | `undefined` \| `string` | engines/accessibility/types.ts:12 |

---

### FieldAriaAttributes

Defined in: engines/accessibility/types.ts:18

Spread-friendly DOM attributes (`{...field.aria.attributes}`).

#### Properties

| Property                                         | Modifier   | Type                     | Defined in                        |
| ------------------------------------------------ | ---------- | ------------------------ | --------------------------------- |
| <a id="aria-invalid"></a> `aria-invalid`         | `readonly` | `boolean`                | engines/accessibility/types.ts:19 |
| <a id="aria-required"></a> `aria-required`       | `readonly` | `undefined` \| `boolean` | engines/accessibility/types.ts:20 |
| <a id="aria-describedby"></a> `aria-describedby` | `readonly` | `undefined` \| `string`  | engines/accessibility/types.ts:21 |

---

### ComputeFieldAriaInput

Defined in: engines/accessibility/types.ts:24

#### Properties

| Property                          | Modifier   | Type                            | Description                                         | Defined in                        |
| --------------------------------- | ---------- | ------------------------------- | --------------------------------------------------- | --------------------------------- |
| <a id="error"></a> `error?`       | `readonly` | `string`                        | -                                                   | engines/accessibility/types.ts:25 |
| <a id="required"></a> `required?` | `readonly` | `boolean`                       | True when presentation/UI marks the field required. | engines/accessibility/types.ts:27 |
| <a id="ids"></a> `ids?`           | `readonly` | [`FieldAriaIds`](#fieldariaids) | -                                                   | engines/accessibility/types.ts:28 |

---

### FieldAriaResult

Defined in: engines/accessibility/types.ts:31

#### Properties

| Property                             | Modifier   | Type                                          | Defined in                        |
| ------------------------------------ | ---------- | --------------------------------------------- | --------------------------------- |
| <a id="aria"></a> `aria`             | `readonly` | [`FieldAria`](#fieldaria)                     | engines/accessibility/types.ts:32 |
| <a id="attributes"></a> `attributes` | `readonly` | [`FieldAriaAttributes`](#fieldariaattributes) | engines/accessibility/types.ts:33 |

---

### CalculationBuilder\<TValues\>

Defined in: engines/calculation/calculation-builder.ts:4

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Methods

##### from()

```ts
from(...deps: string[]): CalculationBuilder<TValues>;
```

Defined in: engines/calculation/calculation-builder.ts:7

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

Defined in: engines/calculation/calculation-builder.ts:8

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

Defined in: engines/calculation/calculation-builder.ts:9

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

Defined in: engines/calculation/calculation-builder.ts:10

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

Defined in: engines/calculation/calculation-builder.ts:11

###### Parameters

| Parameter | Type                                                           |
| --------- | -------------------------------------------------------------- |
| `fn`      | (`ctx`: `CalculationComputeContext`\<`TValues`\>) => `unknown` |

###### Returns

`void`

---

### CalculationDefinition\<TValues\>

Defined in: engines/calculation/run-calculations.ts:10

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                              | Modifier   | Type                                                               | Description                                                                | Defined in                                 |
| ------------------------------------- | ---------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------ |
| <a id="path"></a> `path`              | `readonly` | `string`                                                           | -                                                                          | engines/calculation/run-calculations.ts:11 |
| <a id="compute-2"></a> `compute`      | `readonly` | (`context`: `CalculationComputeContext`\<`TValues`\>) => `unknown` | -                                                                          | engines/calculation/run-calculations.ts:12 |
| <a id="deps"></a> `deps?`             | `readonly` | readonly `string`[]                                                | -                                                                          | engines/calculation/run-calculations.ts:13 |
| <a id="markdirty-2"></a> `markDirty?` | `readonly` | `boolean`                                                          | When true, writing the derived value marks the field dirty. Default false. | engines/calculation/run-calculations.ts:15 |
| <a id="lazy-2"></a> `lazy?`           | `readonly` | `boolean`                                                          | Skip initial compute on register; still runs when deps change.             | engines/calculation/run-calculations.ts:17 |
| <a id="memoized-2"></a> `memoized?`   | `readonly` | `boolean`                                                          | Skip compute when dependency fingerprint is unchanged.                     | engines/calculation/run-calculations.ts:19 |

---

### CalculateOptions\<TValues\>

Defined in: engines/calculation/run-calculations.ts:22

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                              | Modifier   | Type                                                 | Defined in                                 |
| ------------------------------------- | ---------- | ---------------------------------------------------- | ------------------------------------------ |
| <a id="deps-1"></a> `deps?`           | `readonly` | readonly `string`[]                                  | engines/calculation/run-calculations.ts:23 |
| <a id="markdirty-3"></a> `markDirty?` | `readonly` | `boolean`                                            | engines/calculation/run-calculations.ts:24 |
| <a id="lazy-3"></a> `lazy?`           | `readonly` | `boolean`                                            | engines/calculation/run-calculations.ts:25 |
| <a id="memoized-3"></a> `memoized?`   | `readonly` | `boolean`                                            | engines/calculation/run-calculations.ts:26 |
| <a id="compute-3"></a> `compute`      | `readonly` | (`context`: \{ `values`: `TValues`; \}) => `unknown` | engines/calculation/run-calculations.ts:27 |

---

### DependencyRegistrar()\<_TValues\>

Defined in: engines/dependency/registrar.ts:10

#### Type Parameters

| Type Parameter                                       | Default type                    |
| ---------------------------------------------------- | ------------------------------- |
| `_TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

```ts
DependencyRegistrar(map: DependencyMap): DependencyRegistrar<_TValues>;
```

Defined in: engines/dependency/registrar.ts:13

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

Defined in: engines/dependency/registrar.ts:14

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

| Name   | Type                                                                                                | Defined in                         |
| ------ | --------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `to()` | (`child`: `string`) => \{ `effect`: [`DependencyRegistrar`](#dependencyregistrar)\<`_TValues`\>; \} | engines/dependency/registrar.ts:15 |

##### edge()

```ts
edge(config: DependencyEdgeConfig & {
  to: string;
}): DependencyRegistrar<_TValues>;
```

Defined in: engines/dependency/registrar.ts:19

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

Defined in: engines/dependency/registrar.ts:20

###### Returns

[`DependencyGraph`](#dependencygraph)

---

### DependencyEdgeConfig

Defined in: engines/dependency/types.ts:5

#### Properties

| Property                              | Modifier   | Type                                               | Defined in                    |
| ------------------------------------- | ---------- | -------------------------------------------------- | ----------------------------- |
| <a id="from-2"></a> `from`            | `readonly` | `string` \| readonly `string`[]                    | engines/dependency/types.ts:6 |
| <a id="actions"></a> `actions?`       | `readonly` | readonly [`DependencyAction`](#dependencyaction)[] | engines/dependency/types.ts:7 |
| <a id="clearvalue"></a> `clearValue?` | `readonly` | `unknown`                                          | engines/dependency/types.ts:8 |

---

### DependencyEdge

Defined in: engines/dependency/types.ts:14

#### Properties

| Property                                | Modifier   | Type                                               | Description                                                                 | Defined in                     |
| --------------------------------------- | ---------- | -------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------ |
| <a id="from-3"></a> `from`              | `readonly` | `string`                                           | -                                                                           | engines/dependency/types.ts:15 |
| <a id="to"></a> `to`                    | `readonly` | `string`                                           | -                                                                           | engines/dependency/types.ts:16 |
| <a id="actions-1"></a> `actions`        | `readonly` | readonly [`DependencyAction`](#dependencyaction)[] | -                                                                           | engines/dependency/types.ts:17 |
| <a id="clearvalue-1"></a> `clearValue?` | `readonly` | `unknown`                                          | -                                                                           | engines/dependency/types.ts:18 |
| <a id="inferred"></a> `inferred?`       | `readonly` | `boolean`                                          | Inferred from `FieldOptions.dependsOn` — cycles warn; explicit edges throw. | engines/dependency/types.ts:20 |

---

### DependencyNode

Defined in: engines/dependency/types.ts:23

#### Properties

| Property                         | Modifier   | Type                | Defined in                     |
| -------------------------------- | ---------- | ------------------- | ------------------------------ |
| <a id="path-1"></a> `path`       | `readonly` | `string`            | engines/dependency/types.ts:24 |
| <a id="parents"></a> `parents`   | `readonly` | readonly `string`[] | engines/dependency/types.ts:25 |
| <a id="children"></a> `children` | `readonly` | readonly `string`[] | engines/dependency/types.ts:26 |

---

### DependencyGraph

Defined in: engines/dependency/types.ts:29

#### Properties

| Property                   | Modifier   | Type                                                           | Defined in                     |
| -------------------------- | ---------- | -------------------------------------------------------------- | ------------------------------ |
| <a id="nodes"></a> `nodes` | `readonly` | `ReadonlyMap`\<`string`, [`DependencyNode`](#dependencynode)\> | engines/dependency/types.ts:30 |
| <a id="edges"></a> `edges` | `readonly` | readonly [`DependencyEdge`](#dependencyedge)[]                 | engines/dependency/types.ts:31 |

#### Methods

##### dependentsOf()

```ts
dependentsOf(path: string): readonly string[];
```

Defined in: engines/dependency/types.ts:32

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

Defined in: engines/dependency/types.ts:33

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

Defined in: engines/dependency/types.ts:34

###### Parameters

| Parameter | Type                |
| --------- | ------------------- |
| `seeds?`  | readonly `string`[] |

###### Returns

readonly `string`[]

---

### CascadeResult

Defined in: engines/dependency/types.ts:37

#### Properties

| Property                                   | Modifier   | Type                                                        | Defined in                     |
| ------------------------------------------ | ---------- | ----------------------------------------------------------- | ------------------------------ |
| <a id="clears"></a> `clears`               | `readonly` | readonly \{ `path`: `string`; `clearValue`: `unknown`; \}[] | engines/dependency/types.ts:38 |
| <a id="revalidate"></a> `revalidate`       | `readonly` | readonly `string`[]                                         | engines/dependency/types.ts:39 |
| <a id="recompute"></a> `recompute`         | `readonly` | readonly `string`[]                                         | engines/dependency/types.ts:40 |
| <a id="reloadoptions"></a> `reloadOptions` | `readonly` | readonly `string`[]                                         | engines/dependency/types.ts:41 |

---

### PresentationState

Defined in: engines/presentation/resolve.ts:20

#### Properties

| Property                       | Modifier   | Type                                                    | Defined in                         |
| ------------------------------ | ---------- | ------------------------------------------------------- | ---------------------------------- |
| <a id="field-2"></a> `field`   | `readonly` | [`FieldUiState`](#fielduistate)                         | engines/presentation/resolve.ts:21 |
| <a id="options"></a> `options` | `readonly` | `undefined` \| readonly [`FieldOption`](#fieldoption)[] | engines/presentation/resolve.ts:22 |
| <a id="form-1"></a> `form`     | `readonly` | [`FormUiState`](#formuistate)                           | engines/presentation/resolve.ts:23 |

---

### PresentationSnapshot

Defined in: engines/presentation/resolve.ts:26

#### Properties

| Property                                 | Modifier   | Type                                                                                          | Defined in                         |
| ---------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- | ---------------------------------- |
| <a id="fieldui"></a> `fieldUi`           | `readonly` | [`FieldUiMap`](#fielduimap)                                                                   | engines/presentation/resolve.ts:27 |
| <a id="formui"></a> `formUi`             | `readonly` | [`FormUiState`](#formuistate)                                                                 | engines/presentation/resolve.ts:28 |
| <a id="fieldoptions"></a> `fieldOptions` | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), readonly [`FieldOption`](#fieldoption)[]\>\> | engines/presentation/resolve.ts:29 |

---

### TransformContext\<TValues\>

Defined in: engines/transform/types.ts:28

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                      | Modifier   | Type          | Defined in                    |
| ----------------------------- | ---------- | ------------- | ----------------------------- |
| <a id="path-2"></a> `path`    | `readonly` | `string`      | engines/transform/types.ts:31 |
| <a id="values"></a> `values`  | `readonly` | `TValues`     | engines/transform/types.ts:32 |
| <a id="signal"></a> `signal?` | `readonly` | `AbortSignal` | engines/transform/types.ts:33 |

---

### SanitizeOptions

Defined in: engines/transform/types.ts:41

#### Properties

| Property                                            | Modifier   | Type      | Description                                                                    | Defined in                    |
| --------------------------------------------------- | ---------- | --------- | ------------------------------------------------------------------------------ | ----------------------------- |
| <a id="striphtml"></a> `stripHtml?`                 | `readonly` | `boolean` | Strip simple HTML tags. Default true when `sanitize: true`.                    | engines/transform/types.ts:43 |
| <a id="stripcontrolchars"></a> `stripControlChars?` | `readonly` | `boolean` | Strip C0 control chars except tab/newline. Default true when `sanitize: true`. | engines/transform/types.ts:45 |

---

### TransformPipelineOptions

Defined in: engines/transform/types.ts:48

#### Properties

| Property                            | Modifier   | Type                                                                        | Defined in                    |
| ----------------------------------- | ---------- | --------------------------------------------------------------------------- | ----------------------------- |
| <a id="trim"></a> `trim?`           | `readonly` | `boolean` \| `"start"` \| `"end"` \| `"both"`                               | engines/transform/types.ts:49 |
| <a id="normalize"></a> `normalize?` | `readonly` | `boolean` \| `"nfc"` \| `"nfd"`                                             | engines/transform/types.ts:50 |
| <a id="sanitize"></a> `sanitize?`   | `readonly` | `boolean` \| [`SanitizeOptions`](#sanitizeoptions)                          | engines/transform/types.ts:51 |
| <a id="parse"></a> `parse?`         | `readonly` | [`Parser`](#parser)                                                         | engines/transform/types.ts:52 |
| <a id="stages"></a> `stages?`       | `readonly` | readonly [`TransformFn`](#transformfn)\<`Record`\<`string`, `unknown`\>\>[] | engines/transform/types.ts:53 |

---

### TransformPipelineHandle

Defined in: engines/transform/types.ts:56

#### Methods

##### pipe()

```ts
pipe(...stages: TransformFn<Record<string, unknown>>[]): TransformPipelineHandle;
```

Defined in: engines/transform/types.ts:57

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

Defined in: engines/transform/types.ts:58

###### Returns

`void`

---

### FieldUiState

Defined in: engines/workflow/types.ts:3

#### Properties

| Property                                  | Type                                                   | Description                                                                                                   | Defined in                   |
| ----------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| <a id="visible"></a> `visible`            | `boolean`                                              | -                                                                                                             | engines/workflow/types.ts:4  |
| <a id="disabled"></a> `disabled`          | `boolean`                                              | -                                                                                                             | engines/workflow/types.ts:5  |
| <a id="required-1"></a> `required`        | `undefined` \| `boolean`                               | -                                                                                                             | engines/workflow/types.ts:6  |
| <a id="readonly"></a> `readOnly?`         | `boolean`                                              | Additive — when true, controls should be non-editable but still focusable.                                    | engines/workflow/types.ts:8  |
| <a id="busy"></a> `busy?`                 | `boolean`                                              | Additive — e.g. async option load / validating.                                                               | engines/workflow/types.ts:10 |
| <a id="haserror"></a> `hasError?`         | `boolean`                                              | Derived UI projection (validation state): raw error present. Distinct from `showError` (whether to display).  | engines/workflow/types.ts:15 |
| <a id="errormessage"></a> `errorMessage?` | `string`                                               | Derived UI projection: error string when present.                                                             | engines/workflow/types.ts:17 |
| <a id="showerror"></a> `showError?`       | `boolean`                                              | Derived UI projection (UI state): whether the error should be displayed under the active errorDisplay policy. | engines/workflow/types.ts:22 |
| <a id="status"></a> `status?`             | `"validating"` \| `"error"` \| `"success"` \| `"idle"` | Derived UI projection: exactly one of validating                                                              | error                        | success | idle. | engines/workflow/types.ts:26 |

---

### FormUiState

Defined in: engines/workflow/types.ts:29

#### Properties

| Property                                     | Modifier   | Type      | Defined in                   |
| -------------------------------------------- | ---------- | --------- | ---------------------------- |
| <a id="submitdisabled"></a> `submitDisabled` | `readonly` | `boolean` | engines/workflow/types.ts:30 |

---

### FieldOption

Defined in: engines/workflow/types.ts:33

#### Properties

| Property                   | Modifier   | Type     | Defined in                   |
| -------------------------- | ---------- | -------- | ---------------------------- |
| <a id="label"></a> `label` | `readonly` | `string` | engines/workflow/types.ts:34 |
| <a id="value"></a> `value` | `readonly` | `string` | engines/workflow/types.ts:35 |

---

### RuleContext\<TValues\>

Defined in: engines/workflow/types.ts:38

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                       | Modifier   | Type      | Defined in                   |
| ------------------------------ | ---------- | --------- | ---------------------------- |
| <a id="values-1"></a> `values` | `readonly` | `TValues` | engines/workflow/types.ts:39 |

#### Methods

##### show()

```ts
show(...paths: readonly string[]): void;
```

Defined in: engines/workflow/types.ts:40

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

Defined in: engines/workflow/types.ts:41

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

Defined in: engines/workflow/types.ts:42

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

Defined in: engines/workflow/types.ts:43

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

Defined in: engines/workflow/types.ts:44

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

Defined in: engines/workflow/types.ts:45

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

Defined in: engines/workflow/types.ts:46

###### Returns

`void`

##### enableSubmit()

```ts
enableSubmit(): void;
```

Defined in: engines/workflow/types.ts:47

###### Returns

`void`

##### setValue()

```ts
setValue(path: string, value: unknown): void;
```

Defined in: engines/workflow/types.ts:48

###### Parameters

| Parameter | Type      |
| --------- | --------- |
| `path`    | `string`  |
| `value`   | `unknown` |

###### Returns

`void`

---

### FormRuleDefinition\<TValues\>

Defined in: engines/workflow/types.ts:51

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                      | Modifier   | Type                                                                                                                                              | Defined in                   |
| --------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| <a id="watch"></a> `watch`                    | `readonly` | `string`                                                                                                                                          | engines/workflow/types.ts:54 |
| <a id="equals"></a> `equals?`                 | `readonly` | `unknown`                                                                                                                                         | engines/workflow/types.ts:55 |
| <a id="notequals"></a> `notEquals?`           | `readonly` | `unknown`                                                                                                                                         | engines/workflow/types.ts:56 |
| <a id="greaterthan"></a> `greaterThan?`       | `readonly` | `number`                                                                                                                                          | engines/workflow/types.ts:57 |
| <a id="lessthan"></a> `lessThan?`             | `readonly` | `number`                                                                                                                                          | engines/workflow/types.ts:58 |
| <a id="show-2"></a> `show?`                   | `readonly` | readonly `string`[]                                                                                                                               | engines/workflow/types.ts:59 |
| <a id="hide-2"></a> `hide?`                   | `readonly` | readonly `string`[]                                                                                                                               | engines/workflow/types.ts:60 |
| <a id="require-2"></a> `require?`             | `readonly` | readonly `string`[]                                                                                                                               | engines/workflow/types.ts:61 |
| <a id="optional-2"></a> `optional?`           | `readonly` | readonly `string`[]                                                                                                                               | engines/workflow/types.ts:62 |
| <a id="enable-2"></a> `enable?`               | `readonly` | readonly `string`[]                                                                                                                               | engines/workflow/types.ts:63 |
| <a id="disable-2"></a> `disable?`             | `readonly` | readonly `string`[]                                                                                                                               | engines/workflow/types.ts:64 |
| <a id="disablesubmit-2"></a> `disableSubmit?` | `readonly` | `boolean`                                                                                                                                         | engines/workflow/types.ts:65 |
| <a id="changes"></a> `changes?`               | `readonly` | (`value`: `unknown`, `values`: `TValues`) => \| readonly [`FieldOption`](#fieldoption)[] \| `Promise`\<readonly [`FieldOption`](#fieldoption)[]\> | engines/workflow/types.ts:66 |
| <a id="populate"></a> `populate?`             | `readonly` | `string`                                                                                                                                          | engines/workflow/types.ts:70 |
| <a id="then"></a> `then?`                     | `readonly` | (`context`: [`RuleContext`](#rulecontext)\<`TValues`\>) => `void`                                                                                 | engines/workflow/types.ts:71 |

---

### WizardStep

Defined in: engines/workflow/types.ts:76

#### Properties

| Property                            | Modifier   | Type                                                                                        | Description                                                          | Defined in                   |
| ----------------------------------- | ---------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------- |
| <a id="id-1"></a> `id?`             | `readonly` | `string`                                                                                    | -                                                                    | engines/workflow/types.ts:77 |
| <a id="fields"></a> `fields?`       | `readonly` | readonly `string`[]                                                                         | -                                                                    | engines/workflow/types.ts:78 |
| <a id="validate-2"></a> `validate?` | `readonly` | `boolean`                                                                                   | -                                                                    | engines/workflow/types.ts:79 |
| <a id="when"></a> `when?`           | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `boolean`                                    | Skip this step when predicate returns false (conditional steps MVP). | engines/workflow/types.ts:81 |
| <a id="next"></a> `next?`           | `readonly` | \| `string` \| (`values`: `Record`\<`string`, `unknown`\>) => `undefined` \| `string`       | Explicit next step id, or resolver from values.                      | engines/workflow/types.ts:83 |
| <a id="canleave"></a> `canLeave?`   | `readonly` | (`ctx`: [`WizardGuardContext`](#wizardguardcontext)) => `boolean` \| `Promise`\<`boolean`\> | -                                                                    | engines/workflow/types.ts:84 |
| <a id="canenter"></a> `canEnter?`   | `readonly` | (`ctx`: [`WizardGuardContext`](#wizardguardcontext)) => `boolean` \| `Promise`\<`boolean`\> | -                                                                    | engines/workflow/types.ts:85 |

---

### WizardGuardContext\<TValues\>

Defined in: engines/workflow/types.ts:88

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                             | Modifier   | Type                    | Defined in                   |
| ------------------------------------ | ---------- | ----------------------- | ---------------------------- |
| <a id="values-2"></a> `values`       | `readonly` | `TValues`               | engines/workflow/types.ts:91 |
| <a id="fromstepid"></a> `fromStepId` | `readonly` | `undefined` \| `string` | engines/workflow/types.ts:92 |
| <a id="tostepid"></a> `toStepId`     | `readonly` | `string`                | engines/workflow/types.ts:93 |
| <a id="signal-1"></a> `signal`       | `readonly` | `AbortSignal`           | engines/workflow/types.ts:94 |

---

### WizardConfig

Defined in: engines/workflow/types.ts:102

#### Properties

| Property                                              | Modifier   | Type                                                    | Description                                                                                                                                             | Defined in                    |
| ----------------------------------------------------- | ---------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| <a id="steps"></a> `steps`                            | `readonly` | readonly [`WizardStep`](#wizardstep)[]                  | -                                                                                                                                                       | engines/workflow/types.ts:103 |
| <a id="initialstep"></a> `initialStep?`               | `readonly` | `number`                                                | -                                                                                                                                                       | engines/workflow/types.ts:104 |
| <a id="gotovalidation"></a> `goToValidation?`         | `readonly` | [`WizardNavigateValidation`](#wizardnavigatevalidation) | Default validation for `goTo`. - `all` — validate entire form (SHIPPED default) - `step` — validate current step fields only - `none` — skip validation | engines/workflow/types.ts:111 |
| <a id="persiststepindraft"></a> `persistStepInDraft?` | `readonly` | `boolean`                                               | When true, draft save/restore includes `currentStep`.                                                                                                   | engines/workflow/types.ts:113 |

---

### WizardStepGraphNode

Defined in: engines/workflow/types.ts:116

#### Properties

| Property                       | Modifier   | Type                | Defined in                    |
| ------------------------------ | ---------- | ------------------- | ----------------------------- |
| <a id="id-2"></a> `id`         | `readonly` | `string`            | engines/workflow/types.ts:117 |
| <a id="index"></a> `index`     | `readonly` | `number`            | engines/workflow/types.ts:118 |
| <a id="nextids"></a> `nextIds` | `readonly` | readonly `string`[] | engines/workflow/types.ts:119 |

---

### WizardStepGraph

Defined in: engines/workflow/types.ts:122

#### Properties

| Property                     | Modifier   | Type                                                     | Defined in                    |
| ---------------------------- | ---------- | -------------------------------------------------------- | ----------------------------- |
| <a id="nodes-1"></a> `nodes` | `readonly` | readonly [`WizardStepGraphNode`](#wizardstepgraphnode)[] | engines/workflow/types.ts:123 |

---

### PluginErrorReport

Defined in: plugins/compat.ts:19

#### Properties

| Property                      | Modifier   | Type      | Defined in           |
| ----------------------------- | ---------- | --------- | -------------------- |
| <a id="plugin"></a> `plugin?` | `readonly` | `string`  | plugins/compat.ts:20 |
| <a id="hook"></a> `hook?`     | `readonly` | `string`  | plugins/compat.ts:21 |
| <a id="phase"></a> `phase?`   | `readonly` | `string`  | plugins/compat.ts:22 |
| <a id="error-1"></a> `error`  | `readonly` | `unknown` | plugins/compat.ts:23 |

---

### MiddlewareContext\<TValues\>

Defined in: plugins/middleware.ts:15

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                       | Modifier   | Type                                          | Defined in               |
| ------------------------------ | ---------- | --------------------------------------------- | ------------------------ |
| <a id="form-2"></a> `form`     | `readonly` | [`FormInstance`](#forminstance)\<`TValues`\>  | plugins/middleware.ts:18 |
| <a id="phase-1"></a> `phase`   | `readonly` | [`MiddlewarePhase`](#middlewarephase)         | plugins/middleware.ts:19 |
| <a id="signal-2"></a> `signal` | `readonly` | `AbortSignal`                                 | plugins/middleware.ts:20 |
| <a id="meta"></a> `meta`       | `readonly` | `Readonly`\<`Record`\<`string`, `unknown`\>\> | plugins/middleware.ts:21 |

#### Methods

##### halt()

```ts
halt(reason?: string): void;
```

Defined in: plugins/middleware.ts:22

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `reason?` | `string` |

###### Returns

`void`

---

### MiddlewareRegistration

Defined in: plugins/middleware.ts:30

#### Properties

| Property                      | Modifier   | Type                                             | Defined in               |
| ----------------------------- | ---------- | ------------------------------------------------ | ------------------------ |
| <a id="name-5"></a> `name`    | `readonly` | `string`                                         | plugins/middleware.ts:31 |
| <a id="order-1"></a> `order?` | `readonly` | `number`                                         | plugins/middleware.ts:32 |
| <a id="phases"></a> `phases?` | `readonly` | readonly [`MiddlewarePhase`](#middlewarephase)[] | plugins/middleware.ts:33 |

---

### MiddlewareRunResult

Defined in: plugins/middleware.ts:95

#### Properties

| Property                      | Modifier   | Type      | Defined in               |
| ----------------------------- | ---------- | --------- | ------------------------ |
| <a id="halted"></a> `halted`  | `readonly` | `boolean` | plugins/middleware.ts:96 |
| <a id="reason"></a> `reason?` | `readonly` | `string`  | plugins/middleware.ts:97 |

---

### AsyncRetryPolicy

Defined in: types/async-validation.ts:9

#### Properties

| Property                                | Modifier   | Type                                                   | Description                                    | Defined in                   |
| --------------------------------------- | ---------- | ------------------------------------------------------ | ---------------------------------------------- | ---------------------------- |
| <a id="maxattempts"></a> `maxAttempts`  | `readonly` | `number`                                               | Total attempts including the first; minimum 1. | types/async-validation.ts:11 |
| <a id="delayms"></a> `delayMs?`         | `readonly` | `number` \| (`attempt`: `number`) => `number`          | Attempt is 1-based after a failure.            | types/async-validation.ts:13 |
| <a id="shouldretry"></a> `shouldRetry?` | `readonly` | (`error`: `unknown`, `attempt`: `number`) => `boolean` | -                                              | types/async-validation.ts:14 |

---

### AsyncCachePolicy

Defined in: types/async-validation.ts:17

#### Properties

| Property                              | Modifier   | Type                      | Description                                                                                                                                                                                   | Defined in                   |
| ------------------------------------- | ---------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| <a id="ttl"></a> `ttl`                | `readonly` | [`TtlInput`](#ttlinput)   | -                                                                                                                                                                                             | types/async-validation.ts:18 |
| <a id="storage"></a> `storage?`       | `readonly` | `"memory"` \| `"session"` | Default `"memory"`. `"session"` is accepted for API compatibility but is **memory-only** — async validation outcomes are never written to `sessionStorage` (cleartext sensitive-data policy). | types/async-validation.ts:24 |
| <a id="maxentries"></a> `maxEntries?` | `readonly` | `number`                  | Default 256.                                                                                                                                                                                  | types/async-validation.ts:26 |

---

### AsyncValidatorOptions\<TValues\>

Defined in: types/async-validation.ts:29

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                            | Modifier   | Type                                                                                                                                                                                                                       | Defined in                   |
| --------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| <a id="validate-3"></a> `validate`                  | `readonly` | (`value`: `unknown`, `context`: [`ValidationContext`](#validationcontext)\<`TValues`\> & \{ `signal`: `AbortSignal`; \}) => \| [`ValidatorResult`](#validatorresult) \| `Promise`\<[`ValidatorResult`](#validatorresult)\> | types/async-validation.ts:32 |
| <a id="debounce"></a> `debounce?`                   | `readonly` | `number`                                                                                                                                                                                                                   | types/async-validation.ts:37 |
| <a id="retry"></a> `retry?`                         | `readonly` | `number` \| [`AsyncRetryPolicy`](#asyncretrypolicy)                                                                                                                                                                        | types/async-validation.ts:38 |
| <a id="timeout"></a> `timeout?`                     | `readonly` | `number`                                                                                                                                                                                                                   | types/async-validation.ts:39 |
| <a id="cache"></a> `cache?`                         | `readonly` | `false` \| [`TtlInput`](#ttlinput) \| [`AsyncCachePolicy`](#asynccachepolicy)                                                                                                                                              | types/async-validation.ts:40 |
| <a id="abortprevious"></a> `abortPrevious?`         | `readonly` | `boolean`                                                                                                                                                                                                                  | types/async-validation.ts:41 |
| <a id="preventduplicates"></a> `preventDuplicates?` | `readonly` | `boolean`                                                                                                                                                                                                                  | types/async-validation.ts:42 |
| <a id="cachekey"></a> `cacheKey?`                   | `readonly` | (`value`: `unknown`, `context`: [`ValidationContext`](#validationcontext)\<`TValues`\>) => `string`                                                                                                                        | types/async-validation.ts:43 |
| <a id="sharedcache"></a> `sharedCache?`             | `readonly` | `string` \| `boolean`                                                                                                                                                                                                      | types/async-validation.ts:44 |
| <a id="offline"></a> `offline?`                     | `readonly` | `"skip"` \| `"fail"` \| `"queue"`                                                                                                                                                                                          | types/async-validation.ts:45 |

---

### AsyncJob

Defined in: types/async-validation.ts:48

#### Properties

| Property                             | Modifier   | Type                                                                                    | Defined in                   |
| ------------------------------------ | ---------- | --------------------------------------------------------------------------------------- | ---------------------------- |
| <a id="id-3"></a> `id`               | `readonly` | `string`                                                                                | types/async-validation.ts:49 |
| <a id="path-3"></a> `path`           | `readonly` | `string`                                                                                | types/async-validation.ts:50 |
| <a id="generation"></a> `generation` | `readonly` | `number`                                                                                | types/async-validation.ts:51 |
| <a id="cachekey-1"></a> `cacheKey`   | `readonly` | `string`                                                                                | types/async-validation.ts:52 |
| <a id="signal-3"></a> `signal`       | `readonly` | `AbortSignal`                                                                           | types/async-validation.ts:53 |
| <a id="startedat"></a> `startedAt`   | `readonly` | `number`                                                                                | types/async-validation.ts:54 |
| <a id="status-1"></a> `status`       | `readonly` | `"scheduled"` \| `"running"` \| `"settled"` \| `"aborted"` \| `"timeout"` \| `"queued"` | types/async-validation.ts:55 |

---

### FieldMetaState

Defined in: types/index.ts:3

#### Properties

| Property                                 | Modifier   | Type      | Defined in       |
| ---------------------------------------- | ---------- | --------- | ---------------- |
| <a id="isvalidating"></a> `isValidating` | `readonly` | `boolean` | types/index.ts:4 |
| <a id="label-1"></a> `label?`            | `readonly` | `string`  | types/index.ts:5 |
| <a id="description"></a> `description?`  | `readonly` | `string`  | types/index.ts:6 |
| <a id="hidden"></a> `hidden?`            | `readonly` | `boolean` | types/index.ts:7 |

---

### ValidationFormAccessor\<TValues\>

Defined in: types/index.ts:69

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Methods

##### get()

```ts
get(path: string): unknown;
```

Defined in: types/index.ts:70

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

Defined in: types/index.ts:71

###### Returns

`TValues`

---

### ValidationContext\<TValues\>

Defined in: types/index.ts:74

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                        | Modifier   | Type                                                             | Description                                                           | Defined in        |
| ------------------------------- | ---------- | ---------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------- |
| <a id="values-5"></a> `values`  | `readonly` | `TValues`                                                        | -                                                                     | types/index.ts:75 |
| <a id="path-4"></a> `path`      | `readonly` | `string`                                                         | -                                                                     | types/index.ts:76 |
| <a id="form-3"></a> `form`      | `readonly` | [`ValidationFormAccessor`](#validationformaccessor)\<`TValues`\> | -                                                                     | types/index.ts:77 |
| <a id="signal-4"></a> `signal?` | `readonly` | `AbortSignal`                                                    | Present when validation is tied to an in-flight async job (Phase 4A). | types/index.ts:79 |

---

### CustomFieldValidatorContext\<TValues\>

Defined in: types/index.ts:110

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                     | Modifier   | Type                                                             | Defined in         |
| ---------------------------- | ---------- | ---------------------------------------------------------------- | ------------------ |
| <a id="value-1"></a> `value` | `readonly` | `unknown`                                                        | types/index.ts:111 |
| <a id="path-5"></a> `path`   | `readonly` | `string`                                                         | types/index.ts:112 |
| <a id="form-4"></a> `form`   | `readonly` | [`ValidationFormAccessor`](#validationformaccessor)\<`TValues`\> | types/index.ts:113 |

---

### FieldSchemaConfig

Defined in: types/index.ts:120

#### Properties

| Property                              | Modifier   | Type                                                                                                             | Defined in         |
| ------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- | ------------------ |
| <a id="type"></a> `type?`             | `readonly` | [`BuiltInFieldType`](#builtinfieldtype)                                                                          | types/index.ts:121 |
| <a id="required-2"></a> `required?`   | `readonly` | `boolean`                                                                                                        | types/index.ts:122 |
| <a id="email"></a> `email?`           | `readonly` | `boolean`                                                                                                        | types/index.ts:123 |
| <a id="password"></a> `password?`     | `readonly` | `boolean`                                                                                                        | types/index.ts:124 |
| <a id="url"></a> `url?`               | `readonly` | `boolean`                                                                                                        | types/index.ts:125 |
| <a id="minlength"></a> `minLength?`   | `readonly` | `number`                                                                                                         | types/index.ts:126 |
| <a id="validate-4"></a> `validate?`   | `readonly` | `FieldValidateRules`                                                                                             | types/index.ts:127 |
| <a id="validators"></a> `validators?` | `readonly` | readonly [`CustomFieldValidator`](#customfieldvalidator)\<`Record`\<`string`, `unknown`\>\>[]                    | types/index.ts:128 |
| <a id="format"></a> `format?`         | `readonly` | \| [`Formatter`](#formatter) \| `"phone"` \| `"currency"` \| `"slug"` \| `"philippine-phone"` \| `"credit-card"` | types/index.ts:129 |

---

### FieldOptions\<TValues\>

Defined in: types/index.ts:141

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                        | Modifier   | Type                                                                                                                | Description                                                                                                                                                 | Defined in         |
| ----------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| <a id="defaultvalue"></a> `defaultValue?`       | `readonly` | `unknown`                                                                                                           | -                                                                                                                                                           | types/index.ts:142 |
| <a id="validators-1"></a> `validators?`         | `readonly` | readonly [`Validator`](#validator)\<`TValues`\>[]                                                                   | -                                                                                                                                                           | types/index.ts:143 |
| <a id="validateon"></a> `validateOn?`           | `readonly` | [`ValidationMode`](#validationmode)                                                                                 | -                                                                                                                                                           | types/index.ts:144 |
| <a id="dependson"></a> `dependsOn?`             | `readonly` | readonly `string`[]                                                                                                 | -                                                                                                                                                           | types/index.ts:145 |
| <a id="format-1"></a> `format?`                 | `readonly` | [`Formatter`](#formatter)                                                                                           | -                                                                                                                                                           | types/index.ts:146 |
| <a id="parse-1"></a> `parse?`                   | `readonly` | [`Parser`](#parser)                                                                                                 | -                                                                                                                                                           | types/index.ts:147 |
| <a id="formatondisplay"></a> `formatOnDisplay?` | `readonly` | `boolean`                                                                                                           | -                                                                                                                                                           | types/index.ts:148 |
| <a id="parseoninput"></a> `parseOnInput?`       | `readonly` | `boolean`                                                                                                           | -                                                                                                                                                           | types/index.ts:149 |
| <a id="transform"></a> `transform?`             | `readonly` | \| [`TransformPipelineOptions`](#transformpipelineoptions) \| readonly [`TransformFn`](#transformfn)\<`TValues`\>[] | Canonical inbound transforms (trim/normalize/sanitize/parse/stages). Distinct from display `format`/`parse` — see `/transform` and TRANSFORM_INBOUND_ORDER. | types/index.ts:154 |
| <a id="label-2"></a> `label?`                   | `readonly` | `string`                                                                                                            | -                                                                                                                                                           | types/index.ts:157 |
| <a id="description-1"></a> `description?`       | `readonly` | `string`                                                                                                            | -                                                                                                                                                           | types/index.ts:158 |
| <a id="hidden-1"></a> `hidden?`                 | `readonly` | `boolean`                                                                                                           | -                                                                                                                                                           | types/index.ts:159 |
| <a id="metadata"></a> `metadata?`               | `readonly` | `Readonly`\<`Record`\<`string`, `unknown`\>\>                                                                       | -                                                                                                                                                           | types/index.ts:160 |

---

### FieldHandle\<_TValues\>

Defined in: types/index.ts:163

#### Type Parameters

| Type Parameter                                       |
| ---------------------------------------------------- |
| `_TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                       | Modifier   | Type                                                              | Description                                                                                                                   | Defined in         |
| ------------------------------ | ---------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| <a id="path-6"></a> `path`     | `readonly` | `string`                                                          | -                                                                                                                             | types/index.ts:164 |
| <a id="value-2"></a> `value`   | `readonly` | `unknown`                                                         | -                                                                                                                             | types/index.ts:165 |
| <a id="error-2"></a> `error`   | `readonly` | `undefined` \| `string`                                           | -                                                                                                                             | types/index.ts:166 |
| <a id="touched"></a> `touched` | `readonly` | `boolean`                                                         | -                                                                                                                             | types/index.ts:167 |
| <a id="dirty"></a> `dirty`     | `readonly` | `boolean`                                                         | -                                                                                                                             | types/index.ts:168 |
| <a id="visited"></a> `visited` | `readonly` | `boolean`                                                         | -                                                                                                                             | types/index.ts:169 |
| <a id="ui"></a> `ui`           | `readonly` | `FieldUiView`                                                     | Full presentation maps (same sources as `state.fieldUi` / `formUi` / `fieldOptions`).                                         | types/index.ts:171 |
| <a id="meta-1"></a> `meta`     | `readonly` | [`FieldState`](#fieldstate) & [`FieldMetaState`](#fieldmetastate) | Field state + meta (controller surface).                                                                                      | types/index.ts:173 |
| <a id="aria-1"></a> `aria`     | `readonly` | [`FieldAriaResult`](#fieldariaresult)                             | Accessibility snapshot + spread attributes. Register element ids via `setAriaIds` so `aria-describedby` can link errors/help. | types/index.ts:178 |

#### Methods

##### setValue()

```ts
setValue(value: unknown): void;
```

Defined in: types/index.ts:179

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

Defined in: types/index.ts:180

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

Defined in: types/index.ts:181

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

Defined in: types/index.ts:183

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

Defined in: types/index.ts:184

###### Returns

`void`

##### onFocus()

```ts
onFocus(): void;
```

Defined in: types/index.ts:185

###### Returns

`void`

##### validate()

```ts
validate(): Promise<boolean>;
```

Defined in: types/index.ts:186

###### Returns

`Promise`\<`boolean`\>

##### bind()

```ts
bind(): FieldBinding;
```

Defined in: types/index.ts:187

###### Returns

[`FieldBinding`](#fieldbinding)

---

### FieldBinding

Defined in: types/index.ts:190

#### Properties

| Property                         | Modifier   | Type                           | Defined in         |
| -------------------------------- | ---------- | ------------------------------ | ------------------ |
| <a id="name-6"></a> `name`       | `readonly` | `string`                       | types/index.ts:191 |
| <a id="value-3"></a> `value`     | `readonly` | `unknown`                      | types/index.ts:192 |
| <a id="onchange"></a> `onChange` | `readonly` | (`value`: `unknown`) => `void` | types/index.ts:193 |
| <a id="onblur-2"></a> `onBlur`   | `readonly` | () => `void`                   | types/index.ts:194 |
| <a id="onfocus-2"></a> `onFocus` | `readonly` | () => `void`                   | types/index.ts:195 |

---

### AutosaveConfig

Defined in: types/index.ts:202

#### Properties

| Property                              | Modifier   | Type                                                                         | Defined in         |
| ------------------------------------- | ---------- | ---------------------------------------------------------------------------- | ------------------ |
| <a id="enabled"></a> `enabled?`       | `readonly` | `boolean`                                                                    | types/index.ts:203 |
| <a id="debouncems"></a> `debounceMs?` | `readonly` | `number`                                                                     | types/index.ts:204 |
| <a id="onsave"></a> `onSave`          | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `void` \| `Promise`\<`void`\> | types/index.ts:205 |

---

### DraftConfig

Defined in: types/index.ts:208

#### Properties

| Property                                        | Modifier   | Type                                                     | Description                                                            | Defined in         |
| ----------------------------------------------- | ---------- | -------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------ |
| <a id="enabled-1"></a> `enabled?`               | `readonly` | `boolean`                                                | -                                                                      | types/index.ts:209 |
| <a id="storagekey"></a> `storageKey?`           | `readonly` | `string`                                                 | -                                                                      | types/index.ts:210 |
| <a id="storage-1"></a> `storage?`               | `readonly` | `DraftStorageKind`                                       | -                                                                      | types/index.ts:211 |
| <a id="adapter"></a> `adapter?`                 | `readonly` | `DraftStorageAdapter`                                    | -                                                                      | types/index.ts:212 |
| <a id="onrestore"></a> `onRestore?`             | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `void`    | -                                                                      | types/index.ts:213 |
| <a id="promptonrestore"></a> `promptOnRestore?` | `readonly` | `boolean`                                                | -                                                                      | types/index.ts:214 |
| <a id="onrestoreprompt"></a> `onRestorePrompt?` | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `boolean` | -                                                                      | types/index.ts:215 |
| <a id="versioning"></a> `versioning?`           | `readonly` | `boolean`                                                | Persist versioned envelopes (`DraftEnvelopeV1`) instead of raw values. | types/index.ts:217 |
| <a id="schemaversion"></a> `schemaVersion?`     | `readonly` | `string`                                                 | App schema id compared / migrated when envelopes are enabled.          | types/index.ts:219 |
| <a id="migratedraft"></a> `migrateDraft?`       | `readonly` | (`envelope`: `DraftEnvelopeV1`) => `DraftEnvelopeV1`     | Migrate an envelope before restore; throw to reject restore.           | types/index.ts:221 |

---

### RestoreDraftOptions

Defined in: types/index.ts:226

#### Properties

| Property                      | Modifier   | Type                       | Description                                                                      | Defined in         |
| ----------------------------- | ---------- | -------------------------- | -------------------------------------------------------------------------------- | ------------------ |
| <a id="force"></a> `force?`   | `readonly` | `boolean`                  | Default false — if the form is dirty, no-op unless force (D-RESTORE-RACE).       | types/index.ts:228 |
| <a id="prompt"></a> `prompt?` | `readonly` | `boolean`                  | Default false — if true, call `DraftConfig.onRestorePrompt` when set.            | types/index.ts:230 |
| <a id="merge"></a> `merge?`   | `readonly` | `"overlay"` \| `"replace"` | Default `overlay` — `{ ...defaults, ...draft }`. `replace` uses draft keys only. | types/index.ts:232 |

---

### AnalyticsConfig

Defined in: types/index.ts:235

#### Properties

| Property                                  | Modifier   | Type                                                                      | Description                                                                                                                   | Defined in         |
| ----------------------------------------- | ---------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| <a id="enabled-2"></a> `enabled?`         | `readonly` | `boolean`                                                                 | -                                                                                                                             | types/index.ts:236 |
| <a id="includepaths"></a> `includePaths?` | `readonly` | readonly `string`[]                                                       | When set, only these paths appear in path-keyed metrics (deny-by-default for others). Values are never captured — paths only. | types/index.ts:241 |
| <a id="excludepaths"></a> `excludePaths?` | `readonly` | readonly `string`[]                                                       | Paths omitted from path-keyed metrics.                                                                                        | types/index.ts:243 |
| <a id="onsnapshot"></a> `onSnapshot?`     | `readonly` | (`snapshot`: [`FormAnalyticsSnapshot`](#formanalyticssnapshot)) => `void` | Invoked whenever a snapshot is produced via `getAnalytics()`.                                                                 | types/index.ts:245 |

---

### FormAnalyticsSnapshot

Defined in: types/index.ts:248

#### Properties

| Property                                             | Modifier   | Type                                                          | Defined in         |
| ---------------------------------------------------- | ---------- | ------------------------------------------------------------- | ------------------ |
| <a id="startedat-1"></a> `startedAt`                 | `readonly` | `number`                                                      | types/index.ts:249 |
| <a id="completedat"></a> `completedAt`               | `readonly` | `null` \| `number`                                            | types/index.ts:250 |
| <a id="errorcount"></a> `errorCount`                 | `readonly` | `number`                                                      | types/index.ts:251 |
| <a id="errorsbyfield"></a> `errorsByField`           | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `number`\>\> | types/index.ts:252 |
| <a id="abandonedat"></a> `abandonedAt`               | `readonly` | `null` \| `number`                                            | types/index.ts:253 |
| <a id="currentstep"></a> `currentStep`               | `readonly` | `number`                                                      | types/index.ts:254 |
| <a id="fieldviews"></a> `fieldViews`                 | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `number`\>\> | types/index.ts:255 |
| <a id="dropofffield"></a> `dropOffField`             | `readonly` | `null` \| `string`                                            | types/index.ts:256 |
| <a id="timetocompletems"></a> `timeToCompleteMs`     | `readonly` | `null` \| `number`                                            | types/index.ts:257 |
| <a id="timetofirsterrorms"></a> `timeToFirstErrorMs` | `readonly` | `null` \| `number`                                            | types/index.ts:258 |

---

### OfflineQueueConfig

Defined in: types/index.ts:261

#### Properties

| Property                                      | Modifier   | Type                                                                                                                                                                       | Description                                                                                                                                                                   | Defined in         |
| --------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| <a id="enabled-3"></a> `enabled?`             | `readonly` | `boolean`                                                                                                                                                                  | -                                                                                                                                                                             | types/index.ts:262 |
| <a id="storagekey-1"></a> `storageKey?`       | `readonly` | `string`                                                                                                                                                                   | -                                                                                                                                                                             | types/index.ts:263 |
| <a id="maxitems"></a> `maxItems?`             | `readonly` | `number`                                                                                                                                                                   | Soft cap on queued items.                                                                                                                                                     | types/index.ts:265 |
| <a id="overflow"></a> `overflow?`             | `readonly` | `OfflineOverflowPolicy`                                                                                                                                                    | Behavior when `maxItems` is exceeded. Default: `drop-oldest`.                                                                                                                 | types/index.ts:270 |
| <a id="idempotencykey"></a> `idempotencyKey?` | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `string`                                                                                                                    | Deduplicate pending items with the same key (skip enqueue).                                                                                                                   | types/index.ts:272 |
| <a id="onconflict"></a> `onConflict?`         | `readonly` | (`local`: `QueuedSubmission`\<`Record`\<`string`, `unknown`\>\>, `error`: `unknown`) => \| `void` \| `OfflineConflictAction` \| `Promise`\<void \| OfflineConflictAction\> | Called when a queued item fails during flush. - `keep` (default) — leave at head, stop flush - `drop` — discard and continue - `retry` — keep at head and continue attempting | types/index.ts:279 |
| <a id="onoverflow"></a> `onOverflow?`         | `readonly` | (`dropped`: `QueuedSubmission`\<`Record`\<`string`, `unknown`\>\>, `policy`: `OfflineOverflowPolicy`) => `void`                                                            | -                                                                                                                                                                             | types/index.ts:286 |

---

### KeyboardShortcutConfig

Defined in: types/index.ts:292

#### Properties

| Property                     | Modifier   | Type                                                | Defined in         |
| ---------------------------- | ---------- | --------------------------------------------------- | ------------------ |
| <a id="combo"></a> `combo`   | `readonly` | `string`                                            | types/index.ts:293 |
| <a id="action"></a> `action` | `readonly` | `"submit"` \| `"saveDraft"` \| `"undo"` \| `"redo"` | types/index.ts:294 |

---

### WorkflowConfig

Defined in: types/index.ts:297

#### Properties

| Property                                  | Modifier   | Type                                                           | Defined in         |
| ----------------------------------------- | ---------- | -------------------------------------------------------------- | ------------------ |
| <a id="autosave"></a> `autosave?`         | `readonly` | [`AutosaveConfig`](#autosaveconfig)                            | types/index.ts:298 |
| <a id="draft"></a> `draft?`               | `readonly` | [`DraftConfig`](#draftconfig)                                  | types/index.ts:299 |
| <a id="wizard"></a> `wizard?`             | `readonly` | [`WizardConfig`](#wizardconfig)                                | types/index.ts:300 |
| <a id="analytics"></a> `analytics?`       | `readonly` | [`AnalyticsConfig`](#analyticsconfig)                          | types/index.ts:301 |
| <a id="offlinequeue"></a> `offlineQueue?` | `readonly` | [`OfflineQueueConfig`](#offlinequeueconfig)                    | types/index.ts:302 |
| <a id="keyboard"></a> `keyboard?`         | `readonly` | readonly [`KeyboardShortcutConfig`](#keyboardshortcutconfig)[] | types/index.ts:303 |

---

### SubmissionQueueState

Defined in: types/index.ts:306

#### Properties

| Property                         | Modifier   | Type      | Defined in         |
| -------------------------------- | ---------- | --------- | ------------------ |
| <a id="pending"></a> `pending`   | `readonly` | `number`  | types/index.ts:307 |
| <a id="flushing"></a> `flushing` | `readonly` | `boolean` | types/index.ts:308 |

---

### SetValueOptions

Defined in: types/index.ts:311

#### Properties

| Property                                    | Modifier   | Type      | Defined in         |
| ------------------------------------------- | ---------- | --------- | ------------------ |
| <a id="recordhistory"></a> `recordHistory?` | `readonly` | `boolean` | types/index.ts:312 |
| <a id="markdirty-4"></a> `markDirty?`       | `readonly` | `boolean` | types/index.ts:313 |

---

### SubmitOptions

Defined in: types/index.ts:316

#### Properties

| Property                                                | Modifier   | Type                      | Defined in         |
| ------------------------------------------------------- | ---------- | ------------------------- | ------------------ |
| <a id="preventdoublesubmit"></a> `preventDoubleSubmit?` | `readonly` | `boolean`                 | types/index.ts:317 |
| <a id="includediff"></a> `includeDiff?`                 | `readonly` | `boolean`                 | types/index.ts:318 |
| <a id="retry-2"></a> `retry?`                           | `readonly` | `number` \| `RetryPolicy` | types/index.ts:319 |

---

### FormChangeRecord

Defined in: types/index.ts:327

#### Properties

| Property                          | Modifier   | Type             | Description                                   | Defined in         |
| --------------------------------- | ---------- | ---------------- | --------------------------------------------- | ------------------ |
| <a id="path-7"></a> `path`        | `readonly` | `string`         | -                                             | types/index.ts:328 |
| <a id="type-1"></a> `type`        | `readonly` | `FormChangeType` | -                                             | types/index.ts:329 |
| <a id="previous"></a> `previous?` | `readonly` | `unknown`        | -                                             | types/index.ts:330 |
| <a id="current"></a> `current?`   | `readonly` | `unknown`        | -                                             | types/index.ts:331 |
| <a id="from-4"></a> `from?`       | `readonly` | `string`         | Present when `type` is `moved` (source path). | types/index.ts:333 |

---

### FormDiffMetadata

Defined in: types/index.ts:336

#### Properties

| Property                                     | Modifier   | Type     | Defined in         |
| -------------------------------------------- | ---------- | -------- | ------------------ |
| <a id="durationms"></a> `durationMs`         | `readonly` | `number` | types/index.ts:337 |
| <a id="changecount"></a> `changeCount`       | `readonly` | `number` | types/index.ts:338 |
| <a id="addedcount"></a> `addedCount`         | `readonly` | `number` | types/index.ts:339 |
| <a id="removedcount"></a> `removedCount`     | `readonly` | `number` | types/index.ts:340 |
| <a id="changedcount"></a> `changedCount`     | `readonly` | `number` | types/index.ts:341 |
| <a id="unchangedcount"></a> `unchangedCount` | `readonly` | `number` | types/index.ts:342 |
| <a id="movedcount"></a> `movedCount`         | `readonly` | `number` | types/index.ts:343 |

---

### FormDiffResult

Defined in: types/index.ts:346

#### Properties

| Property                             | Modifier   | Type                                               | Defined in         |
| ------------------------------------ | ---------- | -------------------------------------------------- | ------------------ |
| <a id="changes-1"></a> `changes`     | `readonly` | readonly [`FormChangeRecord`](#formchangerecord)[] | types/index.ts:347 |
| <a id="haschanges"></a> `hasChanges` | `readonly` | `boolean`                                          | types/index.ts:348 |
| <a id="metadata-1"></a> `metadata`   | `readonly` | [`FormDiffMetadata`](#formdiffmetadata)            | types/index.ts:349 |

---

### FormDiffOptions

Defined in: types/index.ts:352

#### Properties

| Property                                                        | Modifier   | Type      | Defined in         |
| --------------------------------------------------------------- | ---------- | --------- | ------------------ |
| <a id="maxdepth"></a> `maxDepth?`                               | `readonly` | `number`  | types/index.ts:353 |
| <a id="includeunchanged"></a> `includeUnchanged?`               | `readonly` | `boolean` | types/index.ts:354 |
| <a id="treatundefinedasmissing"></a> `treatUndefinedAsMissing?` | `readonly` | `boolean` | types/index.ts:355 |

---

### SubmitSecurityCaptcha

Defined in: types/index.ts:359

CAPTCHA token under the submission security namespace (ADR-CAP-001).

#### Properties

| Property                            | Modifier   | Type     | Defined in         |
| ----------------------------------- | ---------- | -------- | ------------------ |
| <a id="provider"></a> `provider`    | `readonly` | `string` | types/index.ts:360 |
| <a id="token"></a> `token`          | `readonly` | `string` | types/index.ts:361 |
| <a id="expiresat"></a> `expiresAt?` | `readonly` | `number` | types/index.ts:362 |

---

### SubmitSecurityMeta

Defined in: types/index.ts:369

Security namespace on submit meta.
Stable path: `meta.security.captcha` (future: CSRF, OTP, …).

#### Properties

| Property                        | Modifier   | Type                                              | Defined in         |
| ------------------------------- | ---------- | ------------------------------------------------- | ------------------ |
| <a id="captcha"></a> `captcha?` | `readonly` | [`SubmitSecurityCaptcha`](#submitsecuritycaptcha) | types/index.ts:370 |

---

### SubmitMeta

Defined in: types/index.ts:373

#### Properties

| Property                                    | Modifier   | Type                                        | Description                                            | Defined in         |
| ------------------------------------------- | ---------- | ------------------------------------------- | ------------------------------------------------------ | ------------------ |
| <a id="changedfields"></a> `changedFields?` | `readonly` | readonly `string`[]                         | -                                                      | types/index.ts:374 |
| <a id="diff"></a> `diff?`                   | `readonly` | [`FormDiffResult`](#formdiffresult)         | -                                                      | types/index.ts:375 |
| <a id="signal-5"></a> `signal?`             | `readonly` | `AbortSignal`                               | -                                                      | types/index.ts:376 |
| <a id="security"></a> `security?`           | `readonly` | [`SubmitSecurityMeta`](#submitsecuritymeta) | Populated by the Security Stage (e.g. CAPTCHA plugin). | types/index.ts:378 |

---

### ValidateOptions

Defined in: types/index.ts:381

#### Properties

| Property                    | Modifier   | Type                                | Defined in         |
| --------------------------- | ---------- | ----------------------------------- | ------------------ |
| <a id="paths"></a> `paths?` | `readonly` | readonly `string`[]                 | types/index.ts:382 |
| <a id="mode"></a> `mode?`   | `readonly` | [`ValidationMode`](#validationmode) | types/index.ts:383 |

---

### ResetOptions\<TValues\>

Defined in: types/index.ts:386

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                            | Modifier   | Type                   | Defined in         |
| ----------------------------------- | ---------- | ---------------------- | ------------------ |
| <a id="values-6"></a> `values?`     | `readonly` | `Partial`\<`TValues`\> | types/index.ts:387 |
| <a id="keepdirty"></a> `keepDirty?` | `readonly` | `boolean`              | types/index.ts:388 |

---

### FormConfig\<TValues\>

Defined in: types/index.ts:399

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                                  | Modifier   | Type                                                                                                                                                            | Description                                                                                                                                                                                                                                                                                                                                 | Defined in         |
| --------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| <a id="initialvalues"></a> `initialValues?`               | `readonly` | `TValues`                                                                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:400 |
| <a id="target"></a> `target?`                             | `readonly` | `string` \| `HTMLElement`                                                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:401 |
| <a id="form-5"></a> `form?`                               | `readonly` | `string` \| `HTMLElement`                                                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:402 |
| <a id="schema"></a> `schema?`                             | `readonly` | \| [`SchemaAdapter`](#schemaadapter)\<`Record`\<`string`, `unknown`\>\> \| `Partial`\<`Record`\<`string`, [`FieldSchemaDefinition`](#fieldschemadefinition)\>\> | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:403 |
| <a id="onsubmit"></a> `onSubmit?`                         | `readonly` | (`values`: `TValues`, `meta?`: [`SubmitMeta`](#submitmeta)) => `void` \| `Promise`\<`void`\>                                                                    | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:404 |
| <a id="onsubmiterror"></a> `onSubmitError?`               | `readonly` | (`error`: `unknown`) => `void`                                                                                                                                  | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:405 |
| <a id="onpluginerror"></a> `onPluginError?`               | `readonly` | [`PluginErrorHandler`](#pluginerrorhandler)                                                                                                                     | Receives isolated plugin/hook failures (setup, hooks, destroy). Does not rethrow — form continues per Phase 15 isolation policy.                                                                                                                                                                                                            | types/index.ts:410 |
| <a id="validateon-1"></a> `validateOn?`                   | `readonly` | [`ValidationMode`](#validationmode)                                                                                                                             | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:411 |
| <a id="validators-2"></a> `validators?`                   | `readonly` | `Partial`\<`Record`\<`string`, \| [`Validator`](#validator)\<`TValues`\> \| readonly [`Validator`](#validator)\<`TValues`\>[]\>\>                               | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:412 |
| <a id="crossfieldvalidators"></a> `crossFieldValidators?` | `readonly` | readonly `CrossFieldRule`\<`TValues`\>[]                                                                                                                        | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:415 |
| <a id="formvalidators"></a> `formValidators?`             | `readonly` | readonly `CrossFieldValidator`\<`TValues`\>[]                                                                                                                   | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:416 |
| <a id="workflow"></a> `workflow?`                         | `readonly` | [`WorkflowConfig`](#workflowconfig)                                                                                                                             | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:417 |
| <a id="autosave-1"></a> `autoSave?`                       | `readonly` | [`AutosaveConfig`](#autosaveconfig) & \{ `every?`: `string`; \}                                                                                                 | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:418 |
| <a id="wizard-1"></a> `wizard?`                           | `readonly` | `boolean` \| [`WizardConfig`](#wizardconfig)                                                                                                                    | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:419 |
| <a id="rules"></a> `rules?`                               | `readonly` | readonly [`FormRuleInput`](#formruleinput)\<`TValues`\>[]                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           | types/index.ts:420 |
| <a id="plugins"></a> `plugins?`                           | `readonly` | readonly [`FormPlugin`](#formplugin)\<`TValues`\>[]                                                                                                             | Plugins registered at create time (same as calling `form.use(plugin)` for each entry, in order). Prefer this for declarative setup; use `form.use()` later for conditional or late registration.                                                                                                                                            | types/index.ts:425 |
| <a id="subscribe-2"></a> `subscribe?`                     | `readonly` | \| [`FormSubscribeListener`](#formsubscribelistener)\<`TValues`\> \| readonly [`FormSubscribeListener`](#formsubscribelistener)\<`TValues`\>[]                  | State listeners registered at create time (same store as `form.subscribe()`). Pass one listener or an array. Each receives the form instance, is invoked once after create (so UI can sync immediately), then on every state notify. Lives until `form.destroy()`. Prefer framework adapters for React/Vue; use this for vanilla / host UI. | types/index.ts:432 |
| <a id="dependencies-3"></a> `dependencies?`               | `readonly` | `Readonly`\<`Record`\<`string`, `string` \| readonly `string`[]\>\>                                                                                             | Explicit dependency map: child → parent(s). Cycles throw `ConfigurationError` at registration (ADR-007).                                                                                                                                                                                                                                    | types/index.ts:437 |
| <a id="dependencyactions"></a> `dependencyActions?`       | `readonly` | `Partial`\<`Record`\<`string`, readonly [`DependencyAction`](#dependencyaction)[]\>\>                                                                           | Per-child action overrides for `dependencies` (default `["clear","revalidate"]`).                                                                                                                                                                                                                                                           | types/index.ts:439 |

---

### FieldState

Defined in: types/index.ts:444

#### Properties

| Property                         | Modifier   | Type      | Defined in         |
| -------------------------------- | ---------- | --------- | ------------------ |
| <a id="touched-1"></a> `touched` | `readonly` | `boolean` | types/index.ts:445 |
| <a id="dirty-1"></a> `dirty`     | `readonly` | `boolean` | types/index.ts:446 |
| <a id="visited-1"></a> `visited` | `readonly` | `boolean` | types/index.ts:447 |
| <a id="changed"></a> `changed`   | `readonly` | `boolean` | types/index.ts:448 |

---

### FormState\<TValues\>

Defined in: types/index.ts:451

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                       | Modifier   | Type                                                                                          | Description                            | Defined in         |
| ---------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------ |
| <a id="values-7"></a> `values`                 | `readonly` | `TValues`                                                                                     | -                                      | types/index.ts:452 |
| <a id="errors"></a> `errors`                   | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `string`\>\>                                 | -                                      | types/index.ts:453 |
| <a id="touched-2"></a> `touched`               | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      | types/index.ts:454 |
| <a id="dirty-2"></a> `dirty`                   | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      | types/index.ts:455 |
| <a id="visited-2"></a> `visited`               | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      | types/index.ts:456 |
| <a id="changed-1"></a> `changed`               | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      | types/index.ts:457 |
| <a id="issubmitting"></a> `isSubmitting`       | `readonly` | `boolean`                                                                                     | -                                      | types/index.ts:458 |
| <a id="isvalidating-1"></a> `isValidating`     | `readonly` | `boolean`                                                                                     | -                                      | types/index.ts:459 |
| <a id="isvalid"></a> `isValid`                 | `readonly` | `boolean`                                                                                     | -                                      | types/index.ts:460 |
| <a id="isdirty"></a> `isDirty`                 | `readonly` | `boolean`                                                                                     | -                                      | types/index.ts:461 |
| <a id="ischanged"></a> `isChanged`             | `readonly` | `boolean`                                                                                     | -                                      | types/index.ts:462 |
| <a id="submitcount"></a> `submitCount`         | `readonly` | `number`                                                                                      | -                                      | types/index.ts:463 |
| <a id="submitphase-1"></a> `submitPhase`       | `readonly` | [`SubmitPhase`](#submitphase)                                                                 | Last / current submit lifecycle phase. | types/index.ts:465 |
| <a id="workflow-1"></a> `workflow`             | `readonly` | [`WorkflowState`](#workflowstate)                                                             | -                                      | types/index.ts:466 |
| <a id="fieldui-1"></a> `fieldUi`               | `readonly` | [`FieldUiMap`](#fielduimap)                                                                   | -                                      | types/index.ts:467 |
| <a id="formui-1"></a> `formUi`                 | `readonly` | [`FormUiState`](#formuistate)                                                                 | -                                      | types/index.ts:468 |
| <a id="fieldmeta"></a> `fieldMeta`             | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), [`FieldMetaState`](#fieldmetastate)\>\>      | -                                      | types/index.ts:469 |
| <a id="fieldoptions-2"></a> `fieldOptions`     | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), readonly [`FieldOption`](#fieldoption)[]\>\> | -                                      | types/index.ts:470 |
| <a id="submissionqueue"></a> `submissionQueue` | `readonly` | [`SubmissionQueueState`](#submissionqueuestate)                                               | -                                      | types/index.ts:471 |

---

### WorkflowState

Defined in: types/index.ts:474

#### Properties

| Property                                     | Modifier   | Type               | Defined in         |
| -------------------------------------------- | ---------- | ------------------ | ------------------ |
| <a id="currentstep-1"></a> `currentStep`     | `readonly` | `number`           | types/index.ts:475 |
| <a id="totalsteps"></a> `totalSteps`         | `readonly` | `number`           | types/index.ts:476 |
| <a id="cangonext"></a> `canGoNext`           | `readonly` | `boolean`          | types/index.ts:477 |
| <a id="cangoprev"></a> `canGoPrev`           | `readonly` | `boolean`          | types/index.ts:478 |
| <a id="progress"></a> `progress`             | `readonly` | `number`           | types/index.ts:479 |
| <a id="isautosaving"></a> `isAutosaving`     | `readonly` | `boolean`          | types/index.ts:480 |
| <a id="lastautosaveat"></a> `lastAutosaveAt` | `readonly` | `null` \| `number` | types/index.ts:481 |

---

### FormCheckpoint\<TValues\>

Defined in: types/index.ts:489

Durable form checkpoint — distinct from `getSnapshot()` (external-store identity).

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                             | Modifier   | Type                                                                | Defined in         |
| ------------------------------------ | ---------- | ------------------------------------------------------------------- | ------------------ |
| <a id="version"></a> `version`       | `readonly` | `1`                                                                 | types/index.ts:490 |
| <a id="kind"></a> `kind`             | `readonly` | `"checkpoint"`                                                      | types/index.ts:491 |
| <a id="capturedat"></a> `capturedAt` | `readonly` | `number`                                                            | types/index.ts:492 |
| <a id="values-8"></a> `values`       | `readonly` | `TValues`                                                           | types/index.ts:493 |
| <a id="errors-1"></a> `errors?`      | `readonly` | `Readonly`\<`Record`\<`string`, `string`\>\>                        | types/index.ts:494 |
| <a id="touched-3"></a> `touched?`    | `readonly` | `Readonly`\<`Record`\<`string`, `boolean`\>\>                       | types/index.ts:495 |
| <a id="dirty-3"></a> `dirty?`        | `readonly` | `Readonly`\<`Record`\<`string`, `boolean`\>\>                       | types/index.ts:496 |
| <a id="visited-3"></a> `visited?`    | `readonly` | `Readonly`\<`Record`\<`string`, `boolean`\>\>                       | types/index.ts:497 |
| <a id="fieldui-2"></a> `fieldUi?`    | `readonly` | `Readonly`\<`Record`\<`string`, [`FieldUiState`](#fielduistate)\>\> | types/index.ts:498 |
| <a id="workflow-2"></a> `workflow?`  | `readonly` | \{ `currentStep`: `number`; \}                                      | types/index.ts:499 |
| `workflow.currentStep`               | `readonly` | `number`                                                            | types/index.ts:499 |

---

### CreateCheckpointOptions

Defined in: types/index.ts:502

#### Properties

| Property                        | Modifier   | Type                                                                                                                | Defined in         |
| ------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- | ------------------ |
| <a id="include"></a> `include?` | `readonly` | readonly ( \| `"values"` \| `"workflow"` \| `"touched"` \| `"errors"` \| `"dirty"` \| `"visited"` \| `"fieldUi"`)[] | types/index.ts:503 |

---

### RestoreCheckpointOptions

Defined in: types/index.ts:508

#### Properties

| Property                                      | Modifier   | Type      | Defined in         |
| --------------------------------------------- | ---------- | --------- | ------------------ |
| <a id="recordhistory-1"></a> `recordHistory?` | `readonly` | `boolean` | types/index.ts:509 |
| <a id="restoremeta"></a> `restoreMeta?`       | `readonly` | `boolean` | types/index.ts:510 |

---

### FormInstance\<TValues\>

Defined in: types/index.ts:513

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                           | Modifier   | Type                                                                                                                                                                              | Description                                                                                                                  | Defined in         |
| ---------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| <a id="id-4"></a> `id`             | `readonly` | `string`                                                                                                                                                                          | -                                                                                                                            | types/index.ts:514 |
| <a id="ref"></a> `ref`             | `readonly` | [`FormRef`](#formref)                                                                                                                                                             | -                                                                                                                            | types/index.ts:515 |
| <a id="ui-1"></a> `ui`             | `readonly` | `FormUiProjection`\<`TValues`\>                                                                                                                                                   | Derived UI projection (`@jayoncode/form-intelligence/ui`). Uses registered policies from `ui()` plugin, or package defaults. | types/index.ts:528 |
| <a id="state-1"></a> `state`       | `readonly` | [`FormState`](#formstate)\<`TValues`\>                                                                                                                                            | Current form snapshot — same as `getFormState()`.                                                                            | types/index.ts:555 |
| <a id="workflow-3"></a> `workflow` | `public`   | \{ `next`: `Promise`\<`boolean`\>; `prev`: `void`; `goTo`: `Promise`\<`boolean`\>; `getStepGraph`: [`WizardStepGraph`](#wizardstepgraph); `visibleSteps`: readonly `string`[]; \} | -                                                                                                                            | types/index.ts:626 |
| `workflow.next`                    | `public`   | `Promise`\<`boolean`\>                                                                                                                                                            | -                                                                                                                            | types/index.ts:627 |
| `workflow.prev`                    | `public`   | `void`                                                                                                                                                                            | -                                                                                                                            | types/index.ts:628 |
| `workflow.goTo`                    | `public`   | `Promise`\<`boolean`\>                                                                                                                                                            | -                                                                                                                            | types/index.ts:629 |
| `workflow.getStepGraph`            | `public`   | [`WizardStepGraph`](#wizardstepgraph)                                                                                                                                             | -                                                                                                                            | types/index.ts:633 |
| `workflow.visibleSteps`            | `public`   | readonly `string`[]                                                                                                                                                               | -                                                                                                                            | types/index.ts:634 |

#### Methods

##### field()

```ts
field(path: string, options?: FieldOptions<TValues>): FieldHandle<TValues>;
```

Defined in: types/index.ts:516

###### Parameters

| Parameter  | Type                                           |
| ---------- | ---------------------------------------------- |
| `path`     | `string`                                       |
| `options?` | [`FieldOptions`](#fieldoptions-1)\<`TValues`\> |

###### Returns

[`FieldHandle`](#fieldhandle)\<`TValues`\>

##### firstInvalidPath()

```ts
firstInvalidPath(): undefined | string;
```

Defined in: types/index.ts:518

First path with a non-empty error (stable key order).

###### Returns

`undefined` \| `string`

##### focusFirstInvalid()

```ts
focusFirstInvalid(): undefined | string;
```

Defined in: types/index.ts:523

Focus first invalid control when `document` exists; SSR-safe no-op.
Returns the focused path or `undefined`.

###### Returns

`undefined` \| `string`

##### registeredFieldPaths()

```ts
registeredFieldPaths(): readonly string[];
```

Defined in: types/index.ts:530

Paths registered via `field()` in registration order.

###### Returns

readonly `string`[]

##### pushField()

```ts
pushField(arrayPath: string, item?: unknown): string;
```

Defined in: types/index.ts:531

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

Defined in: types/index.ts:532

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

Defined in: types/index.ts:533

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

Defined in: types/index.ts:534

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

Defined in: types/index.ts:535

###### Returns

`void`

##### useMiddleware()

```ts
useMiddleware(middleware: MiddlewareInput<TValues>): () => void;
```

Defined in: types/index.ts:540

Register onion middleware for submit/validate phases.
Same stack as plugin hooks — see `MIDDLEWARE_HOOK_MAP`.

###### Parameters

| Parameter    | Type                                               |
| ------------ | -------------------------------------------------- |
| `middleware` | [`MiddlewareInput`](#middlewareinput)\<`TValues`\> |

###### Returns

```ts
(): void;
```

###### Returns

`void`

##### reset()

```ts
reset(options?: ResetOptions<TValues>): void;
```

Defined in: types/index.ts:543

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

Defined in: types/index.ts:544

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

Defined in: types/index.ts:545

###### Returns

`TValues`

###### Call Signature

```ts
values(path: string): unknown;
```

Defined in: types/index.ts:546

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

Defined in: types/index.ts:547

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path`    | `string` |

###### Returns

`unknown`

##### errors()

```ts
errors(path?: string): undefined | string | Readonly<Record<string, string>>;
```

Defined in: types/index.ts:548

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `path?`   | `string` |

###### Returns

`undefined` \| `string` \| `Readonly`\<`Record`\<`string`, `string`\>\>

##### setValue()

```ts
setValue(
   path: string,
   value: unknown,
   options?: SetValueOptions): void;
```

Defined in: types/index.ts:549

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

Defined in: types/index.ts:550

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

Defined in: types/index.ts:551

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

Defined in: types/index.ts:552

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

Defined in: types/index.ts:553

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

Defined in: types/index.ts:556

###### Returns

[`FormState`](#formstate)\<`TValues`\>

##### getSnapshot()

```ts
getSnapshot(): FormState<TValues>;
```

Defined in: types/index.ts:558

For `useSyncExternalStore(form.subscribe, form.getSnapshot)`. Not a durable checkpoint.

###### Returns

[`FormState`](#formstate)\<`TValues`\>

##### getPresentation()

###### Call Signature

```ts
getPresentation(path: string): PresentationState;
```

Defined in: types/index.ts:560

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

Defined in: types/index.ts:562

Full presentation maps (same sources as `state.fieldUi` / `formUi` / `fieldOptions`).

###### Returns

[`PresentationSnapshot`](#presentationsnapshot)

##### createCheckpoint()

```ts
createCheckpoint(options?: CreateCheckpointOptions): FormCheckpoint<TValues>;
```

Defined in: types/index.ts:564

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

Defined in: types/index.ts:565

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

Defined in: types/index.ts:566

###### Returns

`TValues`

##### getErrors()

```ts
getErrors(): Readonly<Record<FieldPath, string>>;
```

Defined in: types/index.ts:567

###### Returns

`Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `string`\>\>

##### isValid()

```ts
isValid(): boolean;
```

Defined in: types/index.ts:568

###### Returns

`boolean`

##### isSubmitting()

```ts
isSubmitting(): boolean;
```

Defined in: types/index.ts:569

###### Returns

`boolean`

##### submissionGuard()

```ts
submissionGuard(options?: Pick<SubmitOptions, "preventDoubleSubmit">): SubmissionGuardResult;
```

Defined in: types/index.ts:574

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

Defined in: types/index.ts:577

###### Returns

`boolean`

##### changedFields()

```ts
changedFields(): readonly string[];
```

Defined in: types/index.ts:578

###### Returns

readonly `string`[]

##### changedSinceSubmitFields()

```ts
changedSinceSubmitFields(): readonly string[];
```

Defined in: types/index.ts:579

###### Returns

readonly `string`[]

##### diffFromDefaults()

```ts
diffFromDefaults(options?: FormDiffOptions): Promise<FormDiffResult>;
```

Defined in: types/index.ts:580

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

Defined in: types/index.ts:581

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

Defined in: types/index.ts:582

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

Defined in: types/index.ts:584

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

Defined in: types/index.ts:586

Fluent dependency registrar + `inspect()`.

###### Returns

[`DependencyRegistrar`](#dependencyregistrar)\<`TValues`\>

##### calculate()

###### Call Signature

```ts
calculate(path: string): CalculationBuilder<TValues>;
```

Defined in: types/index.ts:588

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
  | (context: {
  values: TValues;
}) => unknown): void;
```

Defined in: types/index.ts:589

###### Parameters

| Parameter | Type                                                                                                            |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| `path`    | `string`                                                                                                        |
| `options` | \| [`CalculateOptions`](#calculateoptions)\<`TValues`\> \| (`context`: \{ `values`: `TValues`; \}) => `unknown` |

###### Returns

`void`

##### transform()

###### Call Signature

```ts
transform(path: string): TransformPipelineHandle;
```

Defined in: types/index.ts:594

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

Defined in: types/index.ts:595

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

Defined in: types/index.ts:599

###### Returns

`void`

##### restoreDraft()

```ts
restoreDraft(options?: RestoreDraftOptions): Promise<boolean>;
```

Defined in: types/index.ts:605

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

Defined in: types/index.ts:606

###### Returns

`boolean`

##### redo()

```ts
redo(): boolean;
```

Defined in: types/index.ts:607

###### Returns

`boolean`

##### getAnalytics()

```ts
getAnalytics(): FormAnalyticsSnapshot;
```

Defined in: types/index.ts:608

###### Returns

[`FormAnalyticsSnapshot`](#formanalyticssnapshot)

##### flushOfflineQueue()

```ts
flushOfflineQueue(): Promise<{
  flushed: number;
  failed: number;
}>;
```

Defined in: types/index.ts:609

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

Defined in: types/index.ts:610

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

Defined in: types/index.ts:611

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

Defined in: types/index.ts:613

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

Defined in: types/index.ts:622

Advanced: reactive UI updates. Framework adapters call this internally.
For declarative create-time listeners, prefer `createForm({ subscribe })`.

###### Parameters

| Parameter  | Type         |
| ---------- | ------------ |
| `listener` | () => `void` |

###### Returns

```ts
(): void;
```

###### Returns

`void`

##### on()

```ts
on(event: FormEvent, listener: () => void): () => void;
```

Defined in: types/index.ts:623

###### Parameters

| Parameter  | Type                      |
| ---------- | ------------------------- |
| `event`    | [`FormEvent`](#formevent) |
| `listener` | () => `void`              |

###### Returns

```ts
(): void;
```

###### Returns

`void`

##### destroy()

```ts
destroy(): void;
```

Defined in: types/index.ts:624

###### Returns

`void`

##### registerPlugin()

```ts
registerPlugin(plugin: FormPlugin<TValues>): void;
```

Defined in: types/index.ts:625

###### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `plugin`  | [`FormPlugin`](#formplugin)\<`TValues`\> |

###### Returns

`void`

---

### FormPluginSetupResult

Defined in: types/index.ts:638

#### Properties

| Property                            | Modifier   | Type         | Defined in         |
| ----------------------------------- | ---------- | ------------ | ------------------ |
| <a id="ondestroy"></a> `onDestroy?` | `readonly` | () => `void` | types/index.ts:639 |

---

### FormPlugin\<TValues\>

Defined in: types/index.ts:642

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                          | Modifier   | Type     | Description                                                                                                       | Defined in         |
| --------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------- | ------------------ |
| <a id="name-7"></a> `name`        | `readonly` | `string` | -                                                                                                                 | types/index.ts:643 |
| <a id="version-1"></a> `version?` | `readonly` | `string` | Plugin package/semver label (metadata only).                                                                      | types/index.ts:645 |
| <a id="engines"></a> `engines?`   | `readonly` | `string` | Semver range against `@jayoncode/form-intelligence` (`>=3.1.0`, `^3.1.0`, or exact). Checked at `register`/`use`. | types/index.ts:650 |
| <a id="order-2"></a> `order?`     | `readonly` | `number` | -                                                                                                                 | types/index.ts:651 |

#### Methods

##### setup()

```ts
setup(form: FormInstance<TValues>, api: FormPluginApi<TValues>): void | FormPluginSetupResult | () => void;
```

Defined in: types/index.ts:652

###### Parameters

| Parameter | Type                                         |
| --------- | -------------------------------------------- |
| `form`    | [`FormInstance`](#forminstance)\<`TValues`\> |
| `api`     | `FormPluginApi`\<`TValues`\>                 |

###### Returns

`void` \| [`FormPluginSetupResult`](#formpluginsetupresult) \| () => `void`

## Type Aliases

### FieldController\<TValues\>

```ts
type FieldController<TValues> = FieldHandle<TValues>;
```

Defined in: adapters/controllers.ts:14

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

Defined in: engines/dependency/types.ts:3

---

### DependencyMap

```ts
type DependencyMap = Readonly<Record<FieldPath, FieldPath | readonly FieldPath[]>>;
```

Defined in: engines/dependency/types.ts:12

Map sugar: child path → parent path(s).

---

### TransformFn()\<TValues\>

```ts
type TransformFn<TValues> = (value: unknown, ctx: TransformContext<TValues>) => unknown;
```

Defined in: engines/transform/types.ts:36

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

Defined in: engines/workflow/types.ts:74

---

### WizardNavigateValidation

```ts
type WizardNavigateValidation = "step" | "all" | "none";
```

Defined in: engines/workflow/types.ts:98

Validation scope for `workflow.goTo`. Default `"all"` preserves SHIPPED behavior.

---

### FormatPreset

```ts
type FormatPreset = "philippine-phone" | "credit-card" | "phone" | "currency" | "slug";
```

Defined in: format/presets.ts:12

---

### Formatter()

```ts
type Formatter = (value: unknown) => unknown;
```

Defined in: format/types.ts:1

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`unknown`

---

### Parser()

```ts
type Parser = (value: unknown) => unknown;
```

Defined in: format/types.ts:2

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

Defined in: plugins/compat.ts:17

---

### PluginErrorHandler()

```ts
type PluginErrorHandler = (report: PluginErrorReport) => void;
```

Defined in: plugins/compat.ts:26

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

Defined in: plugins/middleware.ts:4

Phases that onion middleware and plugin hooks can observe.

---

### MiddlewareNext()

```ts
type MiddlewareNext = () => Promise<void>;
```

Defined in: plugins/middleware.ts:13

#### Returns

`Promise`\<`void`\>

---

### FormMiddleware()\<TValues\>

```ts
type FormMiddleware<TValues> = (
  ctx: MiddlewareContext<TValues>,
  next: MiddlewareNext,
) => void | Promise<void>;
```

Defined in: plugins/middleware.ts:25

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

### MiddlewareInput\<TValues\>

```ts
type MiddlewareInput<TValues> =
  | (FormMiddleware<TValues> & Partial<MiddlewareRegistration>)
  | (MiddlewareRegistration & {
      run: FormMiddleware<TValues>;
    });
```

Defined in: plugins/middleware.ts:36

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

---

### TtlInput

```ts
type TtlInput = number | `${number}ms` | `${number}s` | `${number}m` | `${number}h`;
```

Defined in: types/async-validation.ts:7

---

### FieldPath

```ts
type FieldPath = string;
```

Defined in: types/index.ts:1

---

### FormRuleInput\<TValues\>

```ts
type FormRuleInput<TValues> =
  FormRuleDefinition<TValues> | WhenRuleBuilder<TValues> | WhenRuleBuilder;
```

Defined in: types/index.ts:48

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

Defined in: types/index.ts:54

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

Defined in: types/index.ts:56

---

### ValidatorResult

```ts
type ValidatorResult = true | false | string | undefined;
```

Defined in: types/index.ts:67

---

### BuiltInFieldType

```ts
type BuiltInFieldType = "text" | "email" | "password" | "url";
```

Defined in: types/index.ts:99

---

### CustomFieldValidator()\<TValues\>

```ts
type CustomFieldValidator<TValues> = (
  context: CustomFieldValidatorContext<TValues>,
) => ValidatorResult | Promise<ValidatorResult>;
```

Defined in: types/index.ts:116

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

### FormRef()

```ts
type FormRef = (element: HTMLFormElement | null) => void;
```

Defined in: types/index.ts:132

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

Defined in: types/index.ts:134

---

### Validator()\<TValues\>

```ts
type Validator<TValues> = (
  value: unknown,
  context: ValidationContext<TValues>,
) => ValidatorResult | Promise<ValidatorResult>;
```

Defined in: types/index.ts:136

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

### SubmitPhase

```ts
type SubmitPhase = "idle" | "validating" | "submitting" | "success" | "error";
```

Defined in: types/index.ts:323

Submit lifecycle phase (Phase 10). `isSubmitting` remains the boolean loading flag.

---

### FormSubscribeListener()\<TValues\>

```ts
type FormSubscribeListener<TValues> = (form: FormInstance<TValues>) => void;
```

Defined in: types/index.ts:395

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

### FormSelector()\<TValues, TSelected\>

```ts
type FormSelector<TValues, TSelected> = (state: FormState<TValues>) => TSelected;
```

Defined in: types/index.ts:484

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

### AsyncValidator\<TValues\>

```ts
type AsyncValidator<TValues> = Validator<TValues> & {
  __async: true;
};
```

Defined in: validation/validators/custom.ts:18

#### Type declaration

| Name      | Type   | Defined in                         |
| --------- | ------ | ---------------------------------- |
| `__async` | `true` | validation/validators/custom.ts:19 |

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

---

### AsyncValidatorWithOptions\<TValues\>

```ts
type AsyncValidatorWithOptions<TValues> = AsyncValidator<TValues> & {
  __asyncOptions: AsyncValidatorOptions<TValues>;
};
```

Defined in: validation/validators/custom.ts:21

#### Type declaration

| Name             | Type                                                           | Defined in                         |
| ---------------- | -------------------------------------------------------------- | ---------------------------------- |
| `__asyncOptions` | [`AsyncValidatorOptions`](#asyncvalidatoroptions)\<`TValues`\> | validation/validators/custom.ts:24 |

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

## Variables

### DEFAULT\_FIELD\_UI

```ts
const DEFAULT_FIELD_UI: FieldUiState;
```

Defined in: engines/presentation/resolve.ts:10

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

Defined in: engines/presentation/resolve.ts:70

Ownership note (Phase 9 / ADR-018): Workflow rules and schema/static
`required` baseline produce UI intents; Presentation exposes them.
Validation must not write `visible`/`hidden`/`required` on validate ticks.
DOM enhancer and adapters consume `getPresentation` / `field.ui` only.

#### Type declaration

| Name                                 | Type                                                                                  | Defined in                         |
| ------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------- |
| <a id="producers"></a> `producers`   | readonly \[`"workflow.rules"`, `"dependency.populate"`, `"schema.requiredBaseline"`\] | engines/presentation/resolve.ts:71 |
| <a id="consumers"></a> `consumers`   | readonly \[`"dom.enhancer"`, `"framework.adapters"`, `"a11y"`\]                       | engines/presentation/resolve.ts:72 |
| <a id="nonwriters"></a> `nonWriters` | readonly \[`"validation"`, `"transform"`, `"format"`\]                                | engines/presentation/resolve.ts:73 |

---

### TRANSFORM\_INBOUND\_ORDER

```ts
const TRANSFORM_INBOUND_ORDER: readonly ["trim", "normalize", "sanitize", "custom", "parse"];
```

Defined in: engines/transform/types.ts:18

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

Defined in: plugins/compat.ts:7

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

Defined in: plugins/middleware.ts:45

Maps plugin hook names → middleware phases (Phase 10 / D-MW-VS-PLUGIN).
Plugin `api.on(hook)` and `form.useMiddleware` share one interceptor stack per phase.
Documented pipeline stages: see `PLUGIN_PIPELINE_STAGES`.

#### Type declaration

| Name                                         | Type               | Default value      | Defined in               |
| -------------------------------------------- | ------------------ | ------------------ | ------------------------ |
| <a id="beforevalidate"></a> `beforeValidate` | `"beforeValidate"` | `"beforeValidate"` | plugins/middleware.ts:46 |
| <a id="aftervalidate"></a> `afterValidate`   | `"afterValidate"`  | `"afterValidate"`  | plugins/middleware.ts:47 |
| <a id="beforesubmit"></a> `beforeSubmit`     | `"beforeSubmit"`   | `"beforeSubmit"`   | plugins/middleware.ts:48 |
| <a id="aftersubmit"></a> `afterSubmit`       | `"afterSubmit"`    | `"afterSubmit"`    | plugins/middleware.ts:49 |

---

### MIDDLEWARE\_ONLY\_PHASES

```ts
const MIDDLEWARE_ONLY_PHASES: readonly ["submitError", "beforeSetValue", "afterSetValue"];
```

Defined in: plugins/middleware.ts:53

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

Defined in: types/async-validation.ts:59

Defaults when the options-object overload is used (API_SIGNATURE_FREEZE §1).

#### Type declaration

| Name                                                 | Type        | Default value | Defined in                   |
| ---------------------------------------------------- | ----------- | ------------- | ---------------------------- |
| <a id="debounce-1"></a> `debounce`                   | `300`       | `300`         | types/async-validation.ts:60 |
| <a id="retry-1"></a> `retry`                         | `0`         | `0`           | types/async-validation.ts:61 |
| <a id="timeout-1"></a> `timeout`                     | `undefined` | `undefined`   | types/async-validation.ts:62 |
| <a id="cache-1"></a> `cache`                         | `false`     | `false`       | types/async-validation.ts:63 |
| <a id="abortprevious-1"></a> `abortPrevious`         | `true`      | `true`        | types/async-validation.ts:64 |
| <a id="preventduplicates-1"></a> `preventDuplicates` | `true`      | `true`        | types/async-validation.ts:65 |
| <a id="sharedcache-1"></a> `sharedCache`             | `false`     | `false`       | types/async-validation.ts:66 |
| <a id="offline-1"></a> `offline`                     | `"skip"`    | `"skip"`      | types/async-validation.ts:67 |

---

### email

```ts
const email: Validator;
```

Defined in: validation/validators/email.ts:36

---

### required

```ts
const required: Validator;
```

Defined in: validation/validators/required.ts:3

---

### url

```ts
const url: Validator;
```

Defined in: validation/validators/url.ts:3

---

### FORM\_INTELLIGENT\_VERSION

```ts
const FORM_INTELLIGENT_VERSION: "3.1.0" = "3.1.0";
```

Defined in: version.ts:2

Package version used for plugin `engines` compatibility checks.

## Functions

### createFormController()

```ts
function createFormController<TValues>(form: FormInstance<TValues>): FormController<TValues>;
```

Defined in: adapters/controllers.ts:37

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

Defined in: adapters/framework-adapter.ts:18

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

Defined in: adapters/persistence-adapter.ts:27

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

Defined in: adapters/schema-adapter.ts:13

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

Defined in: adapters/submit-transport-adapter.ts:15

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

Defined in: core/create-form.ts:2019

Create a form workflow instance. Pass `target` + `schema` to enhance native HTML,
or `initialValues` for headless usage.

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
  order: number,
  api?: FormPluginApi<TValues>,
): FormModule<TValues>;
```

Defined in: core/form-module-host.ts:11

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

Defined in: engines/accessibility/compute-aria.ts:6

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

Defined in: engines/calculation/calculation-builder.ts:81

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

Defined in: engines/dependency/dependency-engine.ts:38

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

Defined in: engines/presentation/resolve.ts:35

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
  options: TransformPipelineOptions,
  outbound?: Formatter,
): TransformPipeline;
```

Defined in: engines/transform/transform-pipeline.ts:19

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
  options: undefined | TransformPipelineOptions | readonly TransformFn<TValues>[],
  ctx: TransformContext<TValues>,
): unknown;
```

Defined in: engines/transform/transform-pipeline.ts:40

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type                                                                                                                               |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `raw`     | `unknown`                                                                                                                          |
| `options` | \| `undefined` \| [`TransformPipelineOptions`](#transformpipelineoptions) \| readonly [`TransformFn`](#transformfn)\<`TValues`\>[] |
| `ctx`     | [`TransformContext`](#transformcontext)\<`TValues`\>                                                                               |

#### Returns

`unknown`

---

### when()

```ts
function when<TValues>(field: string): WhenRuleBuilder<TValues>;
```

Defined in: engines/workflow/when.ts:138

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
function satisfiesEnginesRange(range: string, version: string): boolean;
```

Defined in: plugins/compat.ts:32

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

Defined in: plugins/middleware.ts:60

#### Type Parameters

| Type Parameter |
| -------------- |
| `TContext`     |

#### Parameters

| Parameter     | Type                                        |
| ------------- | ------------------------------------------- |
| `middlewares` | readonly `PluginMiddleware`\<`TContext`\>[] |

#### Returns

```ts
(context: TContext): Promise<void>;
```

##### Parameters

| Parameter | Type       |
| --------- | ---------- |
| `context` | `TContext` |

##### Returns

`Promise`\<`void`\>

---

### runMiddlewareChain()

```ts
function runMiddlewareChain<TContext>(
  middlewares: readonly PluginMiddleware<TContext>[],
  context: TContext,
): Promise<void>;
```

Defined in: plugins/middleware.ts:80

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

Defined in: validation/async/memory-cache.ts:104

Test helper — clears shared namespaces.

#### Returns

`void`

---

### parseTtl()

```ts
function parseTtl(input: TtlInput): number;
```

Defined in: validation/async/parse-ttl.ts:9

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
function matchesField<TValues>(targetPath: string, message: string): Validator<TValues>;
```

Defined in: validation/cross-field.ts:17

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
  message: string,
): Validator<TValues>;
```

Defined in: validation/cross-field.ts:27

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

Defined in: validation/pipeline.ts:22

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
function currency(options: CurrencyValidatorOptions): Validator;
```

Defined in: validation/validators/currency.ts:9

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

Defined in: validation/validators/custom.ts:12

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

Defined in: validation/validators/custom.ts:27

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

Defined in: validation/validators/custom.ts:30

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

Defined in: validation/validators/custom.ts:58

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
): undefined | AsyncValidatorOptions<TValues>;
```

Defined in: validation/validators/custom.ts:64

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter   | Type                                   |
| ----------- | -------------------------------------- |
| `validator` | [`Validator`](#validator)\<`TValues`\> |

#### Returns

\| `undefined`
\| [`AsyncValidatorOptions`](#asyncvalidatoroptions)\<`TValues`\>

---

### date()

```ts
function date(options: DateValidatorOptions): Validator;
```

Defined in: validation/validators/date.ts:29

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

Defined in: validation/validators/max-length.ts:4

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

Defined in: validation/validators/min-length.ts:4

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `min`     | `number` |

#### Returns

[`Validator`](#validator)

---

### number()

```ts
function number(options: NumberValidatorOptions): Validator;
```

Defined in: validation/validators/number.ts:22

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

Defined in: validation/validators/number.ts:50

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

Defined in: validation/validators/number.ts:69

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `maximum` | `number` |

#### Returns

[`Validator`](#validator)

---

### password()

```ts
function password(options: PasswordValidatorOptions): Validator;
```

Defined in: validation/validators/password.ts:11

#### Parameters

| Parameter | Type                       |
| --------- | -------------------------- |
| `options` | `PasswordValidatorOptions` |

#### Returns

[`Validator`](#validator)

---

### phone()

```ts
function phone(message: string): Validator;
```

Defined in: validation/validators/phone.ts:5

#### Parameters

| Parameter | Type     | Default value                   |
| --------- | -------- | ------------------------------- |
| `message` | `string` | `"Enter a valid phone number."` |

#### Returns

[`Validator`](#validator)

---

### regex()

```ts
function regex(pattern: RegExp, message: string): Validator;
```

Defined in: validation/validators/regex.ts:4

#### Parameters

| Parameter | Type     | Default value       |
| --------- | -------- | ------------------- |
| `pattern` | `RegExp` | `undefined`         |
| `message` | `string` | `"Invalid format."` |

#### Returns

[`Validator`](#validator)
