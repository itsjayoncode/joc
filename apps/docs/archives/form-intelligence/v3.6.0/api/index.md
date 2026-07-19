**@jayoncode/form-intelligence API**

---

# @jayoncode/form-intelligence API

## Classes

### FormModuleHost\<TValues\>

Defined in: [core/form-module-host.ts:30](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/form-module-host.ts#L30)

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

Defined in: [core/form-module-host.ts:35](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/form-module-host.ts#L35)

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

Defined in: [core/form-module-host.ts:42](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/form-module-host.ts#L42)

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

Defined in: [core/form-module-host.ts:52](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/form-module-host.ts#L52)

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

Defined in: [core/form-module-host.ts:56](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/form-module-host.ts#L56)

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

Defined in: [core/form-module-host.ts:60](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/form-module-host.ts#L60)

###### Returns

`void`

##### destroy()

```ts
destroy(): void;
```

Defined in: [core/form-module-host.ts:71](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/form-module-host.ts#L71)

###### Returns

`void`

---

### FormModuleRegistry\<TValues\>

Defined in: [core/module-registry.ts:10](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-registry.ts#L10)

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

Defined in: [core/module-registry.ts:14](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-registry.ts#L14)

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

Defined in: [core/module-registry.ts:26](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-registry.ts#L26)

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

Defined in: [core/module-registry.ts:30](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-registry.ts#L30)

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

Defined in: [core/module-registry.ts:34](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-registry.ts#L34)

###### Returns

`number`

##### list()

```ts
list(): readonly FormModule<TValues>[];
```

Defined in: [core/module-registry.ts:38](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-registry.ts#L38)

###### Returns

readonly [`FormModule`](#formmodule)\<`TValues`\>[]

##### initializeAll()

```ts
initializeAll(context: FormModuleContext<TValues>): void;
```

Defined in: [core/module-registry.ts:42](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-registry.ts#L42)

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

Defined in: [core/module-registry.ts:48](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-registry.ts#L48)

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

Defined in: [core/module-registry.ts:54](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-registry.ts#L54)

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

Defined in: [core/module-registry.ts:60](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-registry.ts#L60)

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

---

### DependencyEngine

Defined in: [engines/dependency/dependency-engine.ts:49](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L49)

Structural dependency graph façade (Phase 6 / ADR-007).

#### Constructors

##### Constructor

```ts
new DependencyEngine(options: DependencyEngineOptions): DependencyEngine;
```

Defined in: [engines/dependency/dependency-engine.ts:53](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L53)

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

Defined in: [engines/dependency/dependency-engine.ts:57](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L57)

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

Defined in: [engines/dependency/dependency-engine.ts:85](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L85)

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

Defined in: [engines/dependency/dependency-engine.ts:104](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L104)

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

Defined in: [engines/dependency/dependency-engine.ts:114](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L114)

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

Defined in: [engines/dependency/dependency-engine.ts:145](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L145)

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

Defined in: [engines/dependency/dependency-engine.ts:149](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L149)

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

Defined in: [engines/dependency/dependency-engine.ts:153](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L153)

###### Returns

readonly readonly `string`[][]

##### topologicalOrder()

```ts
topologicalOrder(seeds?: readonly string[]): readonly string[];
```

Defined in: [engines/dependency/dependency-engine.ts:157](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L157)

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

Defined in: [engines/dependency/dependency-engine.ts:161](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L161)

###### Returns

[`DependencyGraph`](#dependencygraph)

##### onParentChange()

```ts
onParentChange(path: string): CascadeResult;
```

Defined in: [engines/dependency/dependency-engine.ts:169](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L169)

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

Defined in: [errors/index.ts:17](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L17)

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

Defined in: [errors/index.ts:21](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L21)

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

| Property                       | Modifier   | Type                                       | Defined in                                                                                                                                                 |
| ------------------------------ | ---------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="code"></a> `code`       | `readonly` | `FormErrorCode`                            | [errors/index.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L18) |
| <a id="details"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [errors/index.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L19) |

---

### ValidationError

Defined in: [errors/index.ts:29](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L29)

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new ValidationError(message: string, options: FormErrorOptions): ValidationError;
```

Defined in: [errors/index.ts:30](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L30)

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in                                                                                                                                                 |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="code-1"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | [errors/index.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L18) |
| <a id="details-1"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | [errors/index.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L19) |

---

### SubmitError

Defined in: [errors/index.ts:36](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L36)

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new SubmitError(message: string, options: FormErrorOptions): SubmitError;
```

Defined in: [errors/index.ts:37](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L37)

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in                                                                                                                                                 |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="code-2"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | [errors/index.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L18) |
| <a id="details-2"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | [errors/index.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L19) |

---

### WorkflowError

Defined in: [errors/index.ts:43](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L43)

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new WorkflowError(message: string, options: FormErrorOptions): WorkflowError;
```

Defined in: [errors/index.ts:44](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L44)

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in                                                                                                                                                 |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="code-3"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | [errors/index.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L18) |
| <a id="details-3"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | [errors/index.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L19) |

---

### ConfigurationError

Defined in: [errors/index.ts:50](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L50)

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new ConfigurationError(message: string, options: FormErrorOptions): ConfigurationError;
```

Defined in: [errors/index.ts:51](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L51)

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in                                                                                                                                                 |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="code-4"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | [errors/index.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L18) |
| <a id="details-4"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | [errors/index.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L19) |

---

### DraftStorageError

Defined in: [errors/index.ts:58](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L58)

Recoverable draft persistence failures (quota, corrupt payload).

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new DraftStorageError(message: string, options: FormErrorOptions): DraftStorageError;
```

Defined in: [errors/index.ts:59](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L59)

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in                                                                                                                                                 |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="code-5"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | [errors/index.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L18) |
| <a id="details-5"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | [errors/index.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L19) |

---

### OfflineQueueError

Defined in: [errors/index.ts:66](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L66)

Offline queue failures (quota, overflow reject).

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new OfflineQueueError(message: string, options: FormErrorOptions): OfflineQueueError;
```

Defined in: [errors/index.ts:67](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L67)

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in                                                                                                                                                 |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="code-6"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | [errors/index.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L18) |
| <a id="details-6"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | [errors/index.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L19) |

---

### PluginError

Defined in: [errors/index.ts:74](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L74)

Isolated plugin/middleware failures (setup or hook throw).

#### Extends

- [`FormIntelligentError`](#formintelligenterror)

#### Constructors

##### Constructor

```ts
new PluginError(message: string, options: FormErrorOptions): PluginError;
```

Defined in: [errors/index.ts:75](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L75)

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

| Property                         | Modifier   | Type                                       | Inherited from                                                        | Defined in                                                                                                                                                 |
| -------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="code-7"></a> `code`       | `readonly` | `FormErrorCode`                            | [`FormIntelligentError`](#formintelligenterror).[`code`](#code)       | [errors/index.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L18) |
| <a id="details-7"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`FormIntelligentError`](#formintelligenterror).[`details`](#details) | [errors/index.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/errors/index.ts#L19) |

---

### MiddlewarePipeline\<TValues\>

Defined in: [plugins/middleware.ts:103](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L103)

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

Defined in: [plugins/middleware.ts:107](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L107)

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

Defined in: [plugins/middleware.ts:125](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L125)

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

Defined in: [plugins/middleware.ts:204](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L204)

###### Returns

`void`

## Interfaces

### FormController\<TValues\>

Defined in: [adapters/controllers.ts:20](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L20)

Thin façade over `FormInstance` for adapters and design systems.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                   | Modifier   | Type                                   | Defined in                                                                                                                                                                 |
| -------------------------- | ---------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="state"></a> `state` | `readonly` | [`FormState`](#formstate)\<`TValues`\> | [adapters/controllers.ts:21](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L21) |

#### Methods

##### subscribe()

```ts
subscribe(listener: () => void): () => void;
```

Defined in: [adapters/controllers.ts:22](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L22)

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

Defined in: [adapters/controllers.ts:23](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L23)

###### Returns

[`FormState`](#formstate)\<`TValues`\>

##### submit()

```ts
submit(options?: SubmitOptions): Promise<boolean>;
```

Defined in: [adapters/controllers.ts:24](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L24)

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

Defined in: [adapters/controllers.ts:25](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L25)

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

Defined in: [adapters/controllers.ts:26](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L26)

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

Defined in: [adapters/controllers.ts:28](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L28)

First path with a non-empty error message.

###### Returns

`undefined` \| `string`

##### focusFirstInvalid()

```ts
focusFirstInvalid(): undefined | string;
```

Defined in: [adapters/controllers.ts:33](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L33)

Focuses the first invalid control when a DOM document is available.
Returns the path (or `undefined` if none). Safe no-op under SSR.

###### Returns

`undefined` \| `string`

##### destroy()

```ts
destroy(): void;
```

Defined in: [adapters/controllers.ts:34](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L34)

###### Returns

`void`

---

### FrameworkAdapter\<TValues\>

Defined in: [adapters/framework-adapter.ts:7](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/framework-adapter.ts#L7)

Contract for framework UI adapters (React, Vue, Angular, Svelte, …).
Implementations ship in separate packages — never required by core.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                 | Modifier   | Type     | Defined in                                                                                                                                                                             |
| ------------------------ | ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="name"></a> `name` | `readonly` | `string` | [adapters/framework-adapter.ts:10](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/framework-adapter.ts#L10) |

#### Methods

##### connect()

```ts
connect(form: FormInstance<TValues>): void | () => void;
```

Defined in: [adapters/framework-adapter.ts:15](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/framework-adapter.ts#L15)

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

Defined in: [adapters/persistence-adapter.ts:5](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/persistence-adapter.ts#L5)

Persist form values for drafts and autosave.
Implementations may be sync (localStorage) or async (IndexedDB, remote).

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     | Defined in                                                                                                                                                                               |
| --------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="name-1"></a> `name?` | `readonly` | `string` | [adapters/persistence-adapter.ts:8](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/persistence-adapter.ts#L8) |

#### Methods

##### load()

```ts
load(key: string): null | TValues | Promise<null | TValues>;
```

Defined in: [adapters/persistence-adapter.ts:9](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/persistence-adapter.ts#L9)

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

Defined in: [adapters/persistence-adapter.ts:10](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/persistence-adapter.ts#L10)

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

Defined in: [adapters/persistence-adapter.ts:11](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/persistence-adapter.ts#L11)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`void` \| `Promise`\<`void`\>

---

### SyncPersistenceAdapter\<TValues\>

Defined in: [adapters/persistence-adapter.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/persistence-adapter.ts#L18)

Sync persistence surface used by draft workflow today.
Compatible with [PersistenceAdapter](#persistenceadapter) when methods are synchronous.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     | Defined in                                                                                                                                                                                 |
| --------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="name-2"></a> `name?` | `readonly` | `string` | [adapters/persistence-adapter.ts:21](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/persistence-adapter.ts#L21) |

#### Methods

##### load()

```ts
load(key: string): null | TValues;
```

Defined in: [adapters/persistence-adapter.ts:22](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/persistence-adapter.ts#L22)

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

Defined in: [adapters/persistence-adapter.ts:23](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/persistence-adapter.ts#L23)

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

Defined in: [adapters/persistence-adapter.ts:24](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/persistence-adapter.ts#L24)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

###### Returns

`void`

---

### SchemaAdapter\<TValues\>

Defined in: [adapters/schema-adapter.ts:6](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/schema-adapter.ts#L6)

Bridge any validation library into Form Intelligence.
Schema adapters are optional — core never depends on Zod/Yup/etc.
Error keys are field paths (dot notation).

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     | Defined in                                                                                                                                                                     |
| --------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="name-3"></a> `name?` | `readonly` | `string` | [adapters/schema-adapter.ts:7](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/schema-adapter.ts#L7) |

#### Methods

##### validate()

```ts
validate(values: TValues):
  | Readonly<Record<string, string>>
| Promise<Readonly<Record<string, string>>>;
```

Defined in: [adapters/schema-adapter.ts:8](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/schema-adapter.ts#L8)

###### Parameters

| Parameter | Type      |
| --------- | --------- |
| `values`  | `TValues` |

###### Returns

\| `Readonly`\<`Record`\<`string`, `string`\>\>
\| `Promise`\<`Readonly`\<`Record`\<`string`, `string`\>\>\>

---

### SubmitTransportAdapter\<TValues, TResult\>

Defined in: [adapters/submit-transport-adapter.ts:7](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/submit-transport-adapter.ts#L7)

Transport layer for form submission (fetch, GraphQL, custom API clients).
Keep UI frameworks out of this interface — values + meta only.

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |
| `TResult`                                           | `unknown`                       |

#### Properties

| Property                    | Modifier   | Type     | Defined in                                                                                                                                                                                           |
| --------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="name-4"></a> `name?` | `readonly` | `string` | [adapters/submit-transport-adapter.ts:11](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/submit-transport-adapter.ts#L11) |

#### Methods

##### submit()

```ts
submit(values: TValues, meta?: SubmitMeta): TResult | Promise<TResult>;
```

Defined in: [adapters/submit-transport-adapter.ts:12](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/submit-transport-adapter.ts#L12)

###### Parameters

| Parameter | Type                        |
| --------- | --------------------------- |
| `values`  | `TValues`                   |
| `meta?`   | [`SubmitMeta`](#submitmeta) |

###### Returns

`TResult` \| `Promise`\<`TResult`\>

---

### FormModuleContext\<TValues\>

Defined in: [core/module-types.ts:5](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L5)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                     | Modifier   | Type                                         | Defined in                                                                                                                                                         |
| ---------------------------- | ---------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="form"></a> `form`     | `readonly` | [`FormInstance`](#forminstance)\<`TValues`\> | [core/module-types.ts:6](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L6) |
| <a id="config"></a> `config` | `readonly` | `ResolvedFormConfig`\<`TValues`\>            | [core/module-types.ts:7](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L7) |
| <a id="events"></a> `events` | `readonly` | `FormEventBus`                               | [core/module-types.ts:8](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L8) |

#### Methods

##### registerCleanup()

```ts
registerCleanup(cleanup: () => void): void;
```

Defined in: [core/module-types.ts:9](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L9)

###### Parameters

| Parameter | Type         |
| --------- | ------------ |
| `cleanup` | () => `void` |

###### Returns

`void`

---

### FormModule\<TValues\>

Defined in: [core/module-types.ts:12](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L12)

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                    | Modifier   | Type     | Defined in                                                                                                                                                           |
| --------------------------- | ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="id"></a> `id`        | `readonly` | `string` | [core/module-types.ts:13](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L13) |
| <a id="order"></a> `order?` | `readonly` | `number` | [core/module-types.ts:14](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L14) |

#### Methods

##### initialize()?

```ts
optional initialize(context: FormModuleContext<TValues>): void;
```

Defined in: [core/module-types.ts:15](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L15)

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

Defined in: [core/module-types.ts:16](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L16)

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

Defined in: [core/module-types.ts:17](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L17)

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

Defined in: [core/module-types.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/module-types.ts#L18)

###### Parameters

| Parameter | Type                                                   |
| --------- | ------------------------------------------------------ |
| `context` | [`FormModuleContext`](#formmodulecontext)\<`TValues`\> |

###### Returns

`void`

---

### FieldAriaIds

Defined in: [engines/accessibility/types.ts:1](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L1)

#### Properties

| Property                                    | Modifier   | Type     | Defined in                                                                                                                                                                             |
| ------------------------------------------- | ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="errorid"></a> `errorId?`             | `readonly` | `string` | [engines/accessibility/types.ts:2](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L2) |
| <a id="descriptionid"></a> `descriptionId?` | `readonly` | `string` | [engines/accessibility/types.ts:3](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L3) |

---

### FieldAria

Defined in: [engines/accessibility/types.ts:9](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L9)

CamelCase ARIA snapshot for adapters and FieldController.

#### Properties

| Property                                       | Modifier   | Type                    | Defined in                                                                                                                                                                               |
| ---------------------------------------------- | ---------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="ariainvalid"></a> `ariaInvalid`         | `readonly` | `boolean`               | [engines/accessibility/types.ts:10](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L10) |
| <a id="ariarequired"></a> `ariaRequired`       | `readonly` | `boolean`               | [engines/accessibility/types.ts:11](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L11) |
| <a id="ariadescribedby"></a> `ariaDescribedBy` | `readonly` | `undefined` \| `string` | [engines/accessibility/types.ts:12](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L12) |

---

### FieldAriaAttributes

Defined in: [engines/accessibility/types.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L18)

Spread-friendly DOM attributes (`{...field.aria.attributes}`).

#### Properties

| Property                                         | Modifier   | Type                     | Defined in                                                                                                                                                                               |
| ------------------------------------------------ | ---------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="aria-invalid"></a> `aria-invalid`         | `readonly` | `boolean`                | [engines/accessibility/types.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L19) |
| <a id="aria-required"></a> `aria-required`       | `readonly` | `undefined` \| `boolean` | [engines/accessibility/types.ts:20](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L20) |
| <a id="aria-describedby"></a> `aria-describedby` | `readonly` | `undefined` \| `string`  | [engines/accessibility/types.ts:21](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L21) |

---

### ComputeFieldAriaInput

Defined in: [engines/accessibility/types.ts:24](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L24)

#### Properties

| Property                          | Modifier   | Type                            | Description                                         | Defined in                                                                                                                                                                               |
| --------------------------------- | ---------- | ------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="error"></a> `error?`       | `readonly` | `string`                        | -                                                   | [engines/accessibility/types.ts:25](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L25) |
| <a id="required"></a> `required?` | `readonly` | `boolean`                       | True when presentation/UI marks the field required. | [engines/accessibility/types.ts:27](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L27) |
| <a id="ids"></a> `ids?`           | `readonly` | [`FieldAriaIds`](#fieldariaids) | -                                                   | [engines/accessibility/types.ts:28](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L28) |

---

### FieldAriaResult

Defined in: [engines/accessibility/types.ts:31](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L31)

#### Properties

| Property                             | Modifier   | Type                                          | Defined in                                                                                                                                                                               |
| ------------------------------------ | ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="aria"></a> `aria`             | `readonly` | [`FieldAria`](#fieldaria)                     | [engines/accessibility/types.ts:32](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L32) |
| <a id="attributes"></a> `attributes` | `readonly` | [`FieldAriaAttributes`](#fieldariaattributes) | [engines/accessibility/types.ts:33](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/types.ts#L33) |

---

### CalculationBuilder\<TValues\>

Defined in: [engines/calculation/calculation-builder.ts:4](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/calculation-builder.ts#L4)

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Methods

##### from()

```ts
from(...deps: string[]): CalculationBuilder<TValues>;
```

Defined in: [engines/calculation/calculation-builder.ts:7](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/calculation-builder.ts#L7)

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

Defined in: [engines/calculation/calculation-builder.ts:8](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/calculation-builder.ts#L8)

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

Defined in: [engines/calculation/calculation-builder.ts:9](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/calculation-builder.ts#L9)

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

Defined in: [engines/calculation/calculation-builder.ts:10](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/calculation-builder.ts#L10)

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

Defined in: [engines/calculation/calculation-builder.ts:11](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/calculation-builder.ts#L11)

###### Parameters

| Parameter | Type                                                           |
| --------- | -------------------------------------------------------------- |
| `fn`      | (`ctx`: `CalculationComputeContext`\<`TValues`\>) => `unknown` |

###### Returns

`void`

---

### CalculationDefinition\<TValues\>

Defined in: [engines/calculation/run-calculations.ts:10](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L10)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                              | Modifier   | Type                                                               | Description                                                                | Defined in                                                                                                                                                                                                 |
| ------------------------------------- | ---------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="path"></a> `path`              | `readonly` | `string`                                                           | -                                                                          | [engines/calculation/run-calculations.ts:11](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L11) |
| <a id="compute-2"></a> `compute`      | `readonly` | (`context`: `CalculationComputeContext`\<`TValues`\>) => `unknown` | -                                                                          | [engines/calculation/run-calculations.ts:12](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L12) |
| <a id="deps"></a> `deps?`             | `readonly` | readonly `string`[]                                                | -                                                                          | [engines/calculation/run-calculations.ts:13](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L13) |
| <a id="markdirty-2"></a> `markDirty?` | `readonly` | `boolean`                                                          | When true, writing the derived value marks the field dirty. Default false. | [engines/calculation/run-calculations.ts:15](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L15) |
| <a id="lazy-2"></a> `lazy?`           | `readonly` | `boolean`                                                          | Skip initial compute on register; still runs when deps change.             | [engines/calculation/run-calculations.ts:17](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L17) |
| <a id="memoized-2"></a> `memoized?`   | `readonly` | `boolean`                                                          | Skip compute when dependency fingerprint is unchanged.                     | [engines/calculation/run-calculations.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L19) |

---

### CalculateOptions\<TValues\>

Defined in: [engines/calculation/run-calculations.ts:22](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L22)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                              | Modifier   | Type                                                 | Defined in                                                                                                                                                                                                 |
| ------------------------------------- | ---------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="deps-1"></a> `deps?`           | `readonly` | readonly `string`[]                                  | [engines/calculation/run-calculations.ts:23](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L23) |
| <a id="markdirty-3"></a> `markDirty?` | `readonly` | `boolean`                                            | [engines/calculation/run-calculations.ts:24](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L24) |
| <a id="lazy-3"></a> `lazy?`           | `readonly` | `boolean`                                            | [engines/calculation/run-calculations.ts:25](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L25) |
| <a id="memoized-3"></a> `memoized?`   | `readonly` | `boolean`                                            | [engines/calculation/run-calculations.ts:26](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L26) |
| <a id="compute-3"></a> `compute`      | `readonly` | (`context`: \{ `values`: `TValues`; \}) => `unknown` | [engines/calculation/run-calculations.ts:27](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/run-calculations.ts#L27) |

---

### DependencyRegistrar()\<_TValues\>

Defined in: [engines/dependency/registrar.ts:10](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/registrar.ts#L10)

#### Type Parameters

| Type Parameter                                       | Default type                    |
| ---------------------------------------------------- | ------------------------------- |
| `_TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

```ts
DependencyRegistrar(map: DependencyMap): DependencyRegistrar<_TValues>;
```

Defined in: [engines/dependency/registrar.ts:13](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/registrar.ts#L13)

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

Defined in: [engines/dependency/registrar.ts:14](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/registrar.ts#L14)

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

| Name   | Type                                                                                                | Defined in                                                                                                                                                                                 |
| ------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `to()` | (`child`: `string`) => \{ `effect`: [`DependencyRegistrar`](#dependencyregistrar)\<`_TValues`\>; \} | [engines/dependency/registrar.ts:15](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/registrar.ts#L15) |

##### edge()

```ts
edge(config: DependencyEdgeConfig & {
  to: string;
}): DependencyRegistrar<_TValues>;
```

Defined in: [engines/dependency/registrar.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/registrar.ts#L19)

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

Defined in: [engines/dependency/registrar.ts:20](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/registrar.ts#L20)

###### Returns

[`DependencyGraph`](#dependencygraph)

---

### DependencyEdgeConfig

Defined in: [engines/dependency/types.ts:5](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L5)

#### Properties

| Property                              | Modifier   | Type                                               | Defined in                                                                                                                                                                       |
| ------------------------------------- | ---------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="from-2"></a> `from`            | `readonly` | `string` \| readonly `string`[]                    | [engines/dependency/types.ts:6](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L6) |
| <a id="actions"></a> `actions?`       | `readonly` | readonly [`DependencyAction`](#dependencyaction)[] | [engines/dependency/types.ts:7](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L7) |
| <a id="clearvalue"></a> `clearValue?` | `readonly` | `unknown`                                          | [engines/dependency/types.ts:8](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L8) |

---

### DependencyEdge

Defined in: [engines/dependency/types.ts:14](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L14)

#### Properties

| Property                                | Modifier   | Type                                               | Description                                                                 | Defined in                                                                                                                                                                         |
| --------------------------------------- | ---------- | -------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="from-3"></a> `from`              | `readonly` | `string`                                           | -                                                                           | [engines/dependency/types.ts:15](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L15) |
| <a id="to"></a> `to`                    | `readonly` | `string`                                           | -                                                                           | [engines/dependency/types.ts:16](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L16) |
| <a id="actions-1"></a> `actions`        | `readonly` | readonly [`DependencyAction`](#dependencyaction)[] | -                                                                           | [engines/dependency/types.ts:17](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L17) |
| <a id="clearvalue-1"></a> `clearValue?` | `readonly` | `unknown`                                          | -                                                                           | [engines/dependency/types.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L18) |
| <a id="inferred"></a> `inferred?`       | `readonly` | `boolean`                                          | Inferred from `FieldOptions.dependsOn` — cycles warn; explicit edges throw. | [engines/dependency/types.ts:20](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L20) |

---

### DependencyNode

Defined in: [engines/dependency/types.ts:23](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L23)

#### Properties

| Property                         | Modifier   | Type                | Defined in                                                                                                                                                                         |
| -------------------------------- | ---------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="path-1"></a> `path`       | `readonly` | `string`            | [engines/dependency/types.ts:24](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L24) |
| <a id="parents"></a> `parents`   | `readonly` | readonly `string`[] | [engines/dependency/types.ts:25](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L25) |
| <a id="children"></a> `children` | `readonly` | readonly `string`[] | [engines/dependency/types.ts:26](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L26) |

---

### DependencyGraph

Defined in: [engines/dependency/types.ts:29](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L29)

#### Properties

| Property                   | Modifier   | Type                                                           | Defined in                                                                                                                                                                         |
| -------------------------- | ---------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="nodes"></a> `nodes` | `readonly` | `ReadonlyMap`\<`string`, [`DependencyNode`](#dependencynode)\> | [engines/dependency/types.ts:30](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L30) |
| <a id="edges"></a> `edges` | `readonly` | readonly [`DependencyEdge`](#dependencyedge)[]                 | [engines/dependency/types.ts:31](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L31) |

#### Methods

##### dependentsOf()

```ts
dependentsOf(path: string): readonly string[];
```

Defined in: [engines/dependency/types.ts:32](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L32)

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

Defined in: [engines/dependency/types.ts:33](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L33)

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

Defined in: [engines/dependency/types.ts:34](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L34)

###### Parameters

| Parameter | Type                |
| --------- | ------------------- |
| `seeds?`  | readonly `string`[] |

###### Returns

readonly `string`[]

---

### CascadeResult

Defined in: [engines/dependency/types.ts:37](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L37)

#### Properties

| Property                                   | Modifier   | Type                                                        | Defined in                                                                                                                                                                         |
| ------------------------------------------ | ---------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="clears"></a> `clears`               | `readonly` | readonly \{ `path`: `string`; `clearValue`: `unknown`; \}[] | [engines/dependency/types.ts:38](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L38) |
| <a id="revalidate"></a> `revalidate`       | `readonly` | readonly `string`[]                                         | [engines/dependency/types.ts:39](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L39) |
| <a id="recompute"></a> `recompute`         | `readonly` | readonly `string`[]                                         | [engines/dependency/types.ts:40](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L40) |
| <a id="reloadoptions"></a> `reloadOptions` | `readonly` | readonly `string`[]                                         | [engines/dependency/types.ts:41](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L41) |

---

### PresentationState

Defined in: [engines/presentation/resolve.ts:20](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L20)

#### Properties

| Property                       | Modifier   | Type                                                    | Defined in                                                                                                                                                                                 |
| ------------------------------ | ---------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="field-2"></a> `field`   | `readonly` | [`FieldUiState`](#fielduistate)                         | [engines/presentation/resolve.ts:21](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L21) |
| <a id="options"></a> `options` | `readonly` | `undefined` \| readonly [`FieldOption`](#fieldoption)[] | [engines/presentation/resolve.ts:22](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L22) |
| <a id="form-1"></a> `form`     | `readonly` | [`FormUiState`](#formuistate)                           | [engines/presentation/resolve.ts:23](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L23) |

---

### PresentationSnapshot

Defined in: [engines/presentation/resolve.ts:26](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L26)

#### Properties

| Property                                 | Modifier   | Type                                                                                          | Defined in                                                                                                                                                                                 |
| ---------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="fieldui"></a> `fieldUi`           | `readonly` | [`FieldUiMap`](#fielduimap)                                                                   | [engines/presentation/resolve.ts:27](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L27) |
| <a id="formui"></a> `formUi`             | `readonly` | [`FormUiState`](#formuistate)                                                                 | [engines/presentation/resolve.ts:28](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L28) |
| <a id="fieldoptions"></a> `fieldOptions` | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), readonly [`FieldOption`](#fieldoption)[]\>\> | [engines/presentation/resolve.ts:29](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L29) |

---

### TransformContext\<TValues\>

Defined in: [engines/transform/types.ts:28](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L28)

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                      | Modifier   | Type          | Defined in                                                                                                                                                                       |
| ----------------------------- | ---------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="path-2"></a> `path`    | `readonly` | `string`      | [engines/transform/types.ts:31](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L31) |
| <a id="values"></a> `values`  | `readonly` | `TValues`     | [engines/transform/types.ts:32](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L32) |
| <a id="signal"></a> `signal?` | `readonly` | `AbortSignal` | [engines/transform/types.ts:33](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L33) |

---

### SanitizeOptions

Defined in: [engines/transform/types.ts:41](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L41)

#### Properties

| Property                                            | Modifier   | Type      | Description                                                                    | Defined in                                                                                                                                                                       |
| --------------------------------------------------- | ---------- | --------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="striphtml"></a> `stripHtml?`                 | `readonly` | `boolean` | Strip simple HTML tags. Default true when `sanitize: true`.                    | [engines/transform/types.ts:43](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L43) |
| <a id="stripcontrolchars"></a> `stripControlChars?` | `readonly` | `boolean` | Strip C0 control chars except tab/newline. Default true when `sanitize: true`. | [engines/transform/types.ts:45](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L45) |

---

### TransformPipelineOptions

Defined in: [engines/transform/types.ts:48](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L48)

#### Properties

| Property                            | Modifier   | Type                                                                        | Defined in                                                                                                                                                                       |
| ----------------------------------- | ---------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="trim"></a> `trim?`           | `readonly` | `boolean` \| `"start"` \| `"end"` \| `"both"`                               | [engines/transform/types.ts:49](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L49) |
| <a id="normalize"></a> `normalize?` | `readonly` | `boolean` \| `"nfc"` \| `"nfd"`                                             | [engines/transform/types.ts:50](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L50) |
| <a id="sanitize"></a> `sanitize?`   | `readonly` | `boolean` \| [`SanitizeOptions`](#sanitizeoptions)                          | [engines/transform/types.ts:51](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L51) |
| <a id="parse"></a> `parse?`         | `readonly` | [`Parser`](#parser)                                                         | [engines/transform/types.ts:52](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L52) |
| <a id="stages"></a> `stages?`       | `readonly` | readonly [`TransformFn`](#transformfn)\<`Record`\<`string`, `unknown`\>\>[] | [engines/transform/types.ts:53](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L53) |

---

### TransformPipelineHandle

Defined in: [engines/transform/types.ts:56](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L56)

#### Methods

##### pipe()

```ts
pipe(...stages: TransformFn<Record<string, unknown>>[]): TransformPipelineHandle;
```

Defined in: [engines/transform/types.ts:57](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L57)

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

Defined in: [engines/transform/types.ts:58](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L58)

###### Returns

`void`

---

### FieldUiState

Defined in: [engines/workflow/types.ts:3](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L3)

#### Properties

| Property                                  | Type                                                   | Description                                                                                                   | Defined in                                                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="visible"></a> `visible`            | `boolean`                                              | -                                                                                                             | [engines/workflow/types.ts:4](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L4)   |
| <a id="disabled"></a> `disabled`          | `boolean`                                              | -                                                                                                             | [engines/workflow/types.ts:5](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L5)   |
| <a id="required-1"></a> `required`        | `undefined` \| `boolean`                               | -                                                                                                             | [engines/workflow/types.ts:6](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L6)   |
| <a id="readonly"></a> `readOnly?`         | `boolean`                                              | Additive — when true, controls should be non-editable but still focusable.                                    | [engines/workflow/types.ts:8](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L8)   |
| <a id="busy"></a> `busy?`                 | `boolean`                                              | Additive — e.g. async option load / validating.                                                               | [engines/workflow/types.ts:10](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L10) |
| <a id="haserror"></a> `hasError?`         | `boolean`                                              | Derived UI projection (validation state): raw error present. Distinct from `showError` (whether to display).  | [engines/workflow/types.ts:15](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L15) |
| <a id="errormessage"></a> `errorMessage?` | `string`                                               | Derived UI projection: error string when present.                                                             | [engines/workflow/types.ts:17](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L17) |
| <a id="showerror"></a> `showError?`       | `boolean`                                              | Derived UI projection (UI state): whether the error should be displayed under the active errorDisplay policy. | [engines/workflow/types.ts:22](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L22) |
| <a id="status"></a> `status?`             | `"validating"` \| `"error"` \| `"success"` \| `"idle"` | Derived UI projection: exactly one of validating                                                              | error                                                                                                                                                                          | success | idle. | [engines/workflow/types.ts:26](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L26) |

---

### FormUiState

Defined in: [engines/workflow/types.ts:29](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L29)

#### Properties

| Property                                     | Modifier   | Type      | Defined in                                                                                                                                                                     |
| -------------------------------------------- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="submitdisabled"></a> `submitDisabled` | `readonly` | `boolean` | [engines/workflow/types.ts:30](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L30) |

---

### FieldOption

Defined in: [engines/workflow/types.ts:33](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L33)

#### Properties

| Property                   | Modifier   | Type     | Defined in                                                                                                                                                                     |
| -------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="label"></a> `label` | `readonly` | `string` | [engines/workflow/types.ts:34](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L34) |
| <a id="value"></a> `value` | `readonly` | `string` | [engines/workflow/types.ts:35](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L35) |

---

### RuleContext\<TValues\>

Defined in: [engines/workflow/types.ts:38](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L38)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                       | Modifier   | Type      | Defined in                                                                                                                                                                     |
| ------------------------------ | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="values-1"></a> `values` | `readonly` | `TValues` | [engines/workflow/types.ts:39](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L39) |

#### Methods

##### show()

```ts
show(...paths: readonly string[]): void;
```

Defined in: [engines/workflow/types.ts:40](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L40)

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

Defined in: [engines/workflow/types.ts:41](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L41)

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

Defined in: [engines/workflow/types.ts:42](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L42)

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

Defined in: [engines/workflow/types.ts:43](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L43)

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

Defined in: [engines/workflow/types.ts:44](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L44)

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

Defined in: [engines/workflow/types.ts:45](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L45)

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

Defined in: [engines/workflow/types.ts:46](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L46)

###### Returns

`void`

##### enableSubmit()

```ts
enableSubmit(): void;
```

Defined in: [engines/workflow/types.ts:47](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L47)

###### Returns

`void`

##### setValue()

```ts
setValue(path: string, value: unknown): void;
```

Defined in: [engines/workflow/types.ts:48](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L48)

###### Parameters

| Parameter | Type      |
| --------- | --------- |
| `path`    | `string`  |
| `value`   | `unknown` |

###### Returns

`void`

---

### FormRuleDefinition\<TValues\>

Defined in: [engines/workflow/types.ts:51](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L51)

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                      | Modifier   | Type                                                                                                                                              | Defined in                                                                                                                                                                     |
| --------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="watch"></a> `watch`                    | `readonly` | `string`                                                                                                                                          | [engines/workflow/types.ts:54](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L54) |
| <a id="equals"></a> `equals?`                 | `readonly` | `unknown`                                                                                                                                         | [engines/workflow/types.ts:55](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L55) |
| <a id="notequals"></a> `notEquals?`           | `readonly` | `unknown`                                                                                                                                         | [engines/workflow/types.ts:56](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L56) |
| <a id="greaterthan"></a> `greaterThan?`       | `readonly` | `number`                                                                                                                                          | [engines/workflow/types.ts:57](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L57) |
| <a id="lessthan"></a> `lessThan?`             | `readonly` | `number`                                                                                                                                          | [engines/workflow/types.ts:58](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L58) |
| <a id="show-2"></a> `show?`                   | `readonly` | readonly `string`[]                                                                                                                               | [engines/workflow/types.ts:59](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L59) |
| <a id="hide-2"></a> `hide?`                   | `readonly` | readonly `string`[]                                                                                                                               | [engines/workflow/types.ts:60](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L60) |
| <a id="require-2"></a> `require?`             | `readonly` | readonly `string`[]                                                                                                                               | [engines/workflow/types.ts:61](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L61) |
| <a id="optional-2"></a> `optional?`           | `readonly` | readonly `string`[]                                                                                                                               | [engines/workflow/types.ts:62](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L62) |
| <a id="enable-2"></a> `enable?`               | `readonly` | readonly `string`[]                                                                                                                               | [engines/workflow/types.ts:63](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L63) |
| <a id="disable-2"></a> `disable?`             | `readonly` | readonly `string`[]                                                                                                                               | [engines/workflow/types.ts:64](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L64) |
| <a id="disablesubmit-2"></a> `disableSubmit?` | `readonly` | `boolean`                                                                                                                                         | [engines/workflow/types.ts:65](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L65) |
| <a id="changes"></a> `changes?`               | `readonly` | (`value`: `unknown`, `values`: `TValues`) => \| readonly [`FieldOption`](#fieldoption)[] \| `Promise`\<readonly [`FieldOption`](#fieldoption)[]\> | [engines/workflow/types.ts:66](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L66) |
| <a id="populate"></a> `populate?`             | `readonly` | `string`                                                                                                                                          | [engines/workflow/types.ts:70](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L70) |
| <a id="then"></a> `then?`                     | `readonly` | (`context`: [`RuleContext`](#rulecontext)\<`TValues`\>) => `void`                                                                                 | [engines/workflow/types.ts:71](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L71) |

---

### WizardStep

Defined in: [engines/workflow/types.ts:76](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L76)

#### Properties

| Property                            | Modifier   | Type                                                                                        | Description                                                          | Defined in                                                                                                                                                                     |
| ----------------------------------- | ---------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="id-1"></a> `id?`             | `readonly` | `string`                                                                                    | -                                                                    | [engines/workflow/types.ts:77](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L77) |
| <a id="fields"></a> `fields?`       | `readonly` | readonly `string`[]                                                                         | -                                                                    | [engines/workflow/types.ts:78](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L78) |
| <a id="validate-2"></a> `validate?` | `readonly` | `boolean`                                                                                   | -                                                                    | [engines/workflow/types.ts:79](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L79) |
| <a id="when"></a> `when?`           | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `boolean`                                    | Skip this step when predicate returns false (conditional steps MVP). | [engines/workflow/types.ts:81](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L81) |
| <a id="next"></a> `next?`           | `readonly` | \| `string` \| (`values`: `Record`\<`string`, `unknown`\>) => `undefined` \| `string`       | Explicit next step id, or resolver from values.                      | [engines/workflow/types.ts:83](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L83) |
| <a id="canleave"></a> `canLeave?`   | `readonly` | (`ctx`: [`WizardGuardContext`](#wizardguardcontext)) => `boolean` \| `Promise`\<`boolean`\> | -                                                                    | [engines/workflow/types.ts:84](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L84) |
| <a id="canenter"></a> `canEnter?`   | `readonly` | (`ctx`: [`WizardGuardContext`](#wizardguardcontext)) => `boolean` \| `Promise`\<`boolean`\> | -                                                                    | [engines/workflow/types.ts:85](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L85) |

---

### WizardGuardContext\<TValues\>

Defined in: [engines/workflow/types.ts:88](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L88)

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                             | Modifier   | Type                    | Defined in                                                                                                                                                                     |
| ------------------------------------ | ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="values-2"></a> `values`       | `readonly` | `TValues`               | [engines/workflow/types.ts:91](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L91) |
| <a id="fromstepid"></a> `fromStepId` | `readonly` | `undefined` \| `string` | [engines/workflow/types.ts:92](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L92) |
| <a id="tostepid"></a> `toStepId`     | `readonly` | `string`                | [engines/workflow/types.ts:93](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L93) |
| <a id="signal-1"></a> `signal`       | `readonly` | `AbortSignal`           | [engines/workflow/types.ts:94](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L94) |

---

### WizardConfig

Defined in: [engines/workflow/types.ts:102](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L102)

#### Properties

| Property                                              | Modifier   | Type                                                    | Description                                                                                                                                             | Defined in                                                                                                                                                                       |
| ----------------------------------------------------- | ---------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="steps"></a> `steps`                            | `readonly` | readonly [`WizardStep`](#wizardstep)[]                  | -                                                                                                                                                       | [engines/workflow/types.ts:103](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L103) |
| <a id="initialstep"></a> `initialStep?`               | `readonly` | `number`                                                | -                                                                                                                                                       | [engines/workflow/types.ts:104](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L104) |
| <a id="gotovalidation"></a> `goToValidation?`         | `readonly` | [`WizardNavigateValidation`](#wizardnavigatevalidation) | Default validation for `goTo`. - `all` — validate entire form (SHIPPED default) - `step` — validate current step fields only - `none` — skip validation | [engines/workflow/types.ts:111](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L111) |
| <a id="persiststepindraft"></a> `persistStepInDraft?` | `readonly` | `boolean`                                               | When true, draft save/restore includes `currentStep`.                                                                                                   | [engines/workflow/types.ts:113](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L113) |

---

### WizardStepGraphNode

Defined in: [engines/workflow/types.ts:116](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L116)

#### Properties

| Property                       | Modifier   | Type                | Defined in                                                                                                                                                                       |
| ------------------------------ | ---------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="id-2"></a> `id`         | `readonly` | `string`            | [engines/workflow/types.ts:117](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L117) |
| <a id="index"></a> `index`     | `readonly` | `number`            | [engines/workflow/types.ts:118](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L118) |
| <a id="nextids"></a> `nextIds` | `readonly` | readonly `string`[] | [engines/workflow/types.ts:119](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L119) |

---

### WizardStepGraph

Defined in: [engines/workflow/types.ts:122](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L122)

#### Properties

| Property                     | Modifier   | Type                                                     | Defined in                                                                                                                                                                       |
| ---------------------------- | ---------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="nodes-1"></a> `nodes` | `readonly` | readonly [`WizardStepGraphNode`](#wizardstepgraphnode)[] | [engines/workflow/types.ts:123](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L123) |

---

### PluginErrorReport

Defined in: [plugins/compat.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/compat.ts#L19)

#### Properties

| Property                      | Modifier   | Type      | Defined in                                                                                                                                                     |
| ----------------------------- | ---------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="plugin"></a> `plugin?` | `readonly` | `string`  | [plugins/compat.ts:20](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/compat.ts#L20) |
| <a id="hook"></a> `hook?`     | `readonly` | `string`  | [plugins/compat.ts:21](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/compat.ts#L21) |
| <a id="phase"></a> `phase?`   | `readonly` | `string`  | [plugins/compat.ts:22](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/compat.ts#L22) |
| <a id="error-1"></a> `error`  | `readonly` | `unknown` | [plugins/compat.ts:23](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/compat.ts#L23) |

---

### MiddlewareContext\<TValues\>

Defined in: [plugins/middleware.ts:15](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L15)

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                       | Modifier   | Type                                          | Defined in                                                                                                                                                             |
| ------------------------------ | ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="form-2"></a> `form`     | `readonly` | [`FormInstance`](#forminstance)\<`TValues`\>  | [plugins/middleware.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L18) |
| <a id="phase-1"></a> `phase`   | `readonly` | [`MiddlewarePhase`](#middlewarephase)         | [plugins/middleware.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L19) |
| <a id="signal-2"></a> `signal` | `readonly` | `AbortSignal`                                 | [plugins/middleware.ts:20](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L20) |
| <a id="meta"></a> `meta`       | `readonly` | `Readonly`\<`Record`\<`string`, `unknown`\>\> | [plugins/middleware.ts:21](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L21) |

#### Methods

##### halt()

```ts
halt(reason?: string): void;
```

Defined in: [plugins/middleware.ts:22](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L22)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `reason?` | `string` |

###### Returns

`void`

---

### MiddlewareRegistration

Defined in: [plugins/middleware.ts:30](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L30)

#### Properties

| Property                      | Modifier   | Type                                             | Defined in                                                                                                                                                             |
| ----------------------------- | ---------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="name-5"></a> `name`    | `readonly` | `string`                                         | [plugins/middleware.ts:31](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L31) |
| <a id="order-1"></a> `order?` | `readonly` | `number`                                         | [plugins/middleware.ts:32](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L32) |
| <a id="phases"></a> `phases?` | `readonly` | readonly [`MiddlewarePhase`](#middlewarephase)[] | [plugins/middleware.ts:33](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L33) |

---

### MiddlewareRunResult

Defined in: [plugins/middleware.ts:95](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L95)

#### Properties

| Property                      | Modifier   | Type      | Defined in                                                                                                                                                             |
| ----------------------------- | ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="halted"></a> `halted`  | `readonly` | `boolean` | [plugins/middleware.ts:96](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L96) |
| <a id="reason"></a> `reason?` | `readonly` | `string`  | [plugins/middleware.ts:97](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L97) |

---

### AsyncRetryPolicy

Defined in: [types/async-validation.ts:9](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L9)

#### Properties

| Property                                | Modifier   | Type                                                   | Description                                    | Defined in                                                                                                                                                                     |
| --------------------------------------- | ---------- | ------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="maxattempts"></a> `maxAttempts`  | `readonly` | `number`                                               | Total attempts including the first; minimum 1. | [types/async-validation.ts:11](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L11) |
| <a id="delayms"></a> `delayMs?`         | `readonly` | `number` \| (`attempt`: `number`) => `number`          | Attempt is 1-based after a failure.            | [types/async-validation.ts:13](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L13) |
| <a id="shouldretry"></a> `shouldRetry?` | `readonly` | (`error`: `unknown`, `attempt`: `number`) => `boolean` | -                                              | [types/async-validation.ts:14](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L14) |

---

### AsyncCachePolicy

Defined in: [types/async-validation.ts:17](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L17)

#### Properties

| Property                              | Modifier   | Type                      | Description                                                                                                                                                                                   | Defined in                                                                                                                                                                     |
| ------------------------------------- | ---------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="ttl"></a> `ttl`                | `readonly` | [`TtlInput`](#ttlinput)   | -                                                                                                                                                                                             | [types/async-validation.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L18) |
| <a id="storage"></a> `storage?`       | `readonly` | `"memory"` \| `"session"` | Default `"memory"`. `"session"` is accepted for API compatibility but is **memory-only** — async validation outcomes are never written to `sessionStorage` (cleartext sensitive-data policy). | [types/async-validation.ts:24](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L24) |
| <a id="maxentries"></a> `maxEntries?` | `readonly` | `number`                  | Default 256.                                                                                                                                                                                  | [types/async-validation.ts:26](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L26) |

---

### AsyncValidatorOptions\<TValues\>

Defined in: [types/async-validation.ts:29](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L29)

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                            | Modifier   | Type                                                                                                                                                                                                                       | Defined in                                                                                                                                                                     |
| --------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="validate-3"></a> `validate`                  | `readonly` | (`value`: `unknown`, `context`: [`ValidationContext`](#validationcontext)\<`TValues`\> & \{ `signal`: `AbortSignal`; \}) => \| [`ValidatorResult`](#validatorresult) \| `Promise`\<[`ValidatorResult`](#validatorresult)\> | [types/async-validation.ts:32](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L32) |
| <a id="debounce"></a> `debounce?`                   | `readonly` | `number`                                                                                                                                                                                                                   | [types/async-validation.ts:37](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L37) |
| <a id="retry"></a> `retry?`                         | `readonly` | `number` \| [`AsyncRetryPolicy`](#asyncretrypolicy)                                                                                                                                                                        | [types/async-validation.ts:38](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L38) |
| <a id="timeout"></a> `timeout?`                     | `readonly` | `number`                                                                                                                                                                                                                   | [types/async-validation.ts:39](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L39) |
| <a id="cache"></a> `cache?`                         | `readonly` | `false` \| [`TtlInput`](#ttlinput) \| [`AsyncCachePolicy`](#asynccachepolicy)                                                                                                                                              | [types/async-validation.ts:40](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L40) |
| <a id="abortprevious"></a> `abortPrevious?`         | `readonly` | `boolean`                                                                                                                                                                                                                  | [types/async-validation.ts:41](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L41) |
| <a id="preventduplicates"></a> `preventDuplicates?` | `readonly` | `boolean`                                                                                                                                                                                                                  | [types/async-validation.ts:42](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L42) |
| <a id="cachekey"></a> `cacheKey?`                   | `readonly` | (`value`: `unknown`, `context`: [`ValidationContext`](#validationcontext)\<`TValues`\>) => `string`                                                                                                                        | [types/async-validation.ts:43](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L43) |
| <a id="sharedcache"></a> `sharedCache?`             | `readonly` | `string` \| `boolean`                                                                                                                                                                                                      | [types/async-validation.ts:44](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L44) |
| <a id="offline"></a> `offline?`                     | `readonly` | `"skip"` \| `"fail"` \| `"queue"`                                                                                                                                                                                          | [types/async-validation.ts:45](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L45) |

---

### AsyncJob

Defined in: [types/async-validation.ts:48](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L48)

#### Properties

| Property                             | Modifier   | Type                                                                                    | Defined in                                                                                                                                                                     |
| ------------------------------------ | ---------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="id-3"></a> `id`               | `readonly` | `string`                                                                                | [types/async-validation.ts:49](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L49) |
| <a id="path-3"></a> `path`           | `readonly` | `string`                                                                                | [types/async-validation.ts:50](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L50) |
| <a id="generation"></a> `generation` | `readonly` | `number`                                                                                | [types/async-validation.ts:51](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L51) |
| <a id="cachekey-1"></a> `cacheKey`   | `readonly` | `string`                                                                                | [types/async-validation.ts:52](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L52) |
| <a id="signal-3"></a> `signal`       | `readonly` | `AbortSignal`                                                                           | [types/async-validation.ts:53](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L53) |
| <a id="startedat"></a> `startedAt`   | `readonly` | `number`                                                                                | [types/async-validation.ts:54](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L54) |
| <a id="status-1"></a> `status`       | `readonly` | `"scheduled"` \| `"running"` \| `"settled"` \| `"aborted"` \| `"timeout"` \| `"queued"` | [types/async-validation.ts:55](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L55) |

---

### FieldMetaState

Defined in: [types/index.ts:3](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L3)

#### Properties

| Property                                 | Modifier   | Type      | Defined in                                                                                                                                             |
| ---------------------------------------- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="isvalidating"></a> `isValidating` | `readonly` | `boolean` | [types/index.ts:4](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L4) |
| <a id="label-1"></a> `label?`            | `readonly` | `string`  | [types/index.ts:5](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L5) |
| <a id="description"></a> `description?`  | `readonly` | `string`  | [types/index.ts:6](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L6) |
| <a id="hidden"></a> `hidden?`            | `readonly` | `boolean` | [types/index.ts:7](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L7) |

---

### ValidationFormAccessor\<TValues\>

Defined in: [types/index.ts:69](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L69)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Methods

##### get()

```ts
get(path: string): unknown;
```

Defined in: [types/index.ts:70](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L70)

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

Defined in: [types/index.ts:71](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L71)

###### Returns

`TValues`

---

### ValidationContext\<TValues\>

Defined in: [types/index.ts:74](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L74)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                        | Modifier   | Type                                                             | Description                                                           | Defined in                                                                                                                                               |
| ------------------------------- | ---------- | ---------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="values-5"></a> `values`  | `readonly` | `TValues`                                                        | -                                                                     | [types/index.ts:75](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L75) |
| <a id="path-4"></a> `path`      | `readonly` | `string`                                                         | -                                                                     | [types/index.ts:76](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L76) |
| <a id="form-3"></a> `form`      | `readonly` | [`ValidationFormAccessor`](#validationformaccessor)\<`TValues`\> | -                                                                     | [types/index.ts:77](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L77) |
| <a id="signal-4"></a> `signal?` | `readonly` | `AbortSignal`                                                    | Present when validation is tied to an in-flight async job (Phase 4A). | [types/index.ts:79](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L79) |

---

### CustomFieldValidatorContext\<TValues\>

Defined in: [types/index.ts:110](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L110)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                     | Modifier   | Type                                                             | Defined in                                                                                                                                                 |
| ---------------------------- | ---------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="value-1"></a> `value` | `readonly` | `unknown`                                                        | [types/index.ts:111](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L111) |
| <a id="path-5"></a> `path`   | `readonly` | `string`                                                         | [types/index.ts:112](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L112) |
| <a id="form-4"></a> `form`   | `readonly` | [`ValidationFormAccessor`](#validationformaccessor)\<`TValues`\> | [types/index.ts:113](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L113) |

---

### FieldSchemaConfig

Defined in: [types/index.ts:120](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L120)

#### Properties

| Property                              | Modifier   | Type                                                                                                             | Defined in                                                                                                                                                 |
| ------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="type"></a> `type?`             | `readonly` | [`BuiltInFieldType`](#builtinfieldtype)                                                                          | [types/index.ts:121](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L121) |
| <a id="required-2"></a> `required?`   | `readonly` | `boolean`                                                                                                        | [types/index.ts:122](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L122) |
| <a id="email"></a> `email?`           | `readonly` | `boolean`                                                                                                        | [types/index.ts:123](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L123) |
| <a id="password"></a> `password?`     | `readonly` | `boolean`                                                                                                        | [types/index.ts:124](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L124) |
| <a id="url"></a> `url?`               | `readonly` | `boolean`                                                                                                        | [types/index.ts:125](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L125) |
| <a id="minlength"></a> `minLength?`   | `readonly` | `number`                                                                                                         | [types/index.ts:126](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L126) |
| <a id="validate-4"></a> `validate?`   | `readonly` | `FieldValidateRules`                                                                                             | [types/index.ts:127](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L127) |
| <a id="validators"></a> `validators?` | `readonly` | readonly [`CustomFieldValidator`](#customfieldvalidator)\<`Record`\<`string`, `unknown`\>\>[]                    | [types/index.ts:128](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L128) |
| <a id="format"></a> `format?`         | `readonly` | \| [`Formatter`](#formatter) \| `"phone"` \| `"currency"` \| `"slug"` \| `"philippine-phone"` \| `"credit-card"` | [types/index.ts:129](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L129) |

---

### FieldOptions\<TValues\>

Defined in: [types/index.ts:141](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L141)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                        | Modifier   | Type                                                                                                                | Description                                                                                                                                                 | Defined in                                                                                                                                                 |
| ----------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="defaultvalue"></a> `defaultValue?`       | `readonly` | `unknown`                                                                                                           | -                                                                                                                                                           | [types/index.ts:142](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L142) |
| <a id="validators-1"></a> `validators?`         | `readonly` | readonly [`Validator`](#validator)\<`TValues`\>[]                                                                   | -                                                                                                                                                           | [types/index.ts:143](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L143) |
| <a id="validateon"></a> `validateOn?`           | `readonly` | [`ValidationMode`](#validationmode)                                                                                 | -                                                                                                                                                           | [types/index.ts:144](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L144) |
| <a id="dependson"></a> `dependsOn?`             | `readonly` | readonly `string`[]                                                                                                 | -                                                                                                                                                           | [types/index.ts:145](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L145) |
| <a id="format-1"></a> `format?`                 | `readonly` | [`Formatter`](#formatter)                                                                                           | -                                                                                                                                                           | [types/index.ts:146](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L146) |
| <a id="parse-1"></a> `parse?`                   | `readonly` | [`Parser`](#parser)                                                                                                 | -                                                                                                                                                           | [types/index.ts:147](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L147) |
| <a id="formatondisplay"></a> `formatOnDisplay?` | `readonly` | `boolean`                                                                                                           | -                                                                                                                                                           | [types/index.ts:148](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L148) |
| <a id="parseoninput"></a> `parseOnInput?`       | `readonly` | `boolean`                                                                                                           | -                                                                                                                                                           | [types/index.ts:149](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L149) |
| <a id="transform"></a> `transform?`             | `readonly` | \| [`TransformPipelineOptions`](#transformpipelineoptions) \| readonly [`TransformFn`](#transformfn)\<`TValues`\>[] | Canonical inbound transforms (trim/normalize/sanitize/parse/stages). Distinct from display `format`/`parse` — see `/transform` and TRANSFORM_INBOUND_ORDER. | [types/index.ts:154](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L154) |
| <a id="label-2"></a> `label?`                   | `readonly` | `string`                                                                                                            | -                                                                                                                                                           | [types/index.ts:157](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L157) |
| <a id="description-1"></a> `description?`       | `readonly` | `string`                                                                                                            | -                                                                                                                                                           | [types/index.ts:158](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L158) |
| <a id="hidden-1"></a> `hidden?`                 | `readonly` | `boolean`                                                                                                           | -                                                                                                                                                           | [types/index.ts:159](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L159) |
| <a id="metadata"></a> `metadata?`               | `readonly` | `Readonly`\<`Record`\<`string`, `unknown`\>\>                                                                       | -                                                                                                                                                           | [types/index.ts:160](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L160) |

---

### FieldHandle\<_TValues\>

Defined in: [types/index.ts:163](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L163)

#### Type Parameters

| Type Parameter                                       |
| ---------------------------------------------------- |
| `_TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                       | Modifier   | Type                                                              | Description                                                                                                                   | Defined in                                                                                                                                                 |
| ------------------------------ | ---------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="path-6"></a> `path`     | `readonly` | `string`                                                          | -                                                                                                                             | [types/index.ts:164](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L164) |
| <a id="value-2"></a> `value`   | `readonly` | `unknown`                                                         | -                                                                                                                             | [types/index.ts:165](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L165) |
| <a id="error-2"></a> `error`   | `readonly` | `undefined` \| `string`                                           | -                                                                                                                             | [types/index.ts:166](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L166) |
| <a id="touched"></a> `touched` | `readonly` | `boolean`                                                         | -                                                                                                                             | [types/index.ts:167](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L167) |
| <a id="dirty"></a> `dirty`     | `readonly` | `boolean`                                                         | -                                                                                                                             | [types/index.ts:168](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L168) |
| <a id="visited"></a> `visited` | `readonly` | `boolean`                                                         | -                                                                                                                             | [types/index.ts:169](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L169) |
| <a id="ui"></a> `ui`           | `readonly` | `FieldUiView`                                                     | Full presentation maps (same sources as `state.fieldUi` / `formUi` / `fieldOptions`).                                         | [types/index.ts:171](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L171) |
| <a id="meta-1"></a> `meta`     | `readonly` | [`FieldState`](#fieldstate) & [`FieldMetaState`](#fieldmetastate) | Field state + meta (controller surface).                                                                                      | [types/index.ts:173](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L173) |
| <a id="aria-1"></a> `aria`     | `readonly` | [`FieldAriaResult`](#fieldariaresult)                             | Accessibility snapshot + spread attributes. Register element ids via `setAriaIds` so `aria-describedby` can link errors/help. | [types/index.ts:178](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L178) |

#### Methods

##### setValue()

```ts
setValue(value: unknown): void;
```

Defined in: [types/index.ts:179](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L179)

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

Defined in: [types/index.ts:180](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L180)

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

Defined in: [types/index.ts:181](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L181)

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

Defined in: [types/index.ts:183](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L183)

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

Defined in: [types/index.ts:184](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L184)

###### Returns

`void`

##### onFocus()

```ts
onFocus(): void;
```

Defined in: [types/index.ts:185](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L185)

###### Returns

`void`

##### validate()

```ts
validate(): Promise<boolean>;
```

Defined in: [types/index.ts:186](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L186)

###### Returns

`Promise`\<`boolean`\>

##### bind()

```ts
bind(): FieldBinding;
```

Defined in: [types/index.ts:187](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L187)

###### Returns

[`FieldBinding`](#fieldbinding)

---

### FieldBinding

Defined in: [types/index.ts:190](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L190)

#### Properties

| Property                         | Modifier   | Type                           | Defined in                                                                                                                                                 |
| -------------------------------- | ---------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="name-6"></a> `name`       | `readonly` | `string`                       | [types/index.ts:191](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L191) |
| <a id="value-3"></a> `value`     | `readonly` | `unknown`                      | [types/index.ts:192](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L192) |
| <a id="onchange"></a> `onChange` | `readonly` | (`value`: `unknown`) => `void` | [types/index.ts:193](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L193) |
| <a id="onblur-2"></a> `onBlur`   | `readonly` | () => `void`                   | [types/index.ts:194](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L194) |
| <a id="onfocus-2"></a> `onFocus` | `readonly` | () => `void`                   | [types/index.ts:195](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L195) |

---

### AutosaveConfig

Defined in: [types/index.ts:202](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L202)

#### Properties

| Property                              | Modifier   | Type                                                                         | Defined in                                                                                                                                                 |
| ------------------------------------- | ---------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="enabled"></a> `enabled?`       | `readonly` | `boolean`                                                                    | [types/index.ts:203](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L203) |
| <a id="debouncems"></a> `debounceMs?` | `readonly` | `number`                                                                     | [types/index.ts:204](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L204) |
| <a id="onsave"></a> `onSave`          | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `void` \| `Promise`\<`void`\> | [types/index.ts:205](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L205) |

---

### DraftConfig

Defined in: [types/index.ts:208](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L208)

#### Properties

| Property                                        | Modifier   | Type                                                     | Description                                                            | Defined in                                                                                                                                                 |
| ----------------------------------------------- | ---------- | -------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="enabled-1"></a> `enabled?`               | `readonly` | `boolean`                                                | -                                                                      | [types/index.ts:209](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L209) |
| <a id="storagekey"></a> `storageKey?`           | `readonly` | `string`                                                 | -                                                                      | [types/index.ts:210](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L210) |
| <a id="storage-1"></a> `storage?`               | `readonly` | `DraftStorageKind`                                       | -                                                                      | [types/index.ts:211](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L211) |
| <a id="adapter"></a> `adapter?`                 | `readonly` | `DraftStorageAdapter`                                    | -                                                                      | [types/index.ts:212](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L212) |
| <a id="onrestore"></a> `onRestore?`             | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `void`    | -                                                                      | [types/index.ts:213](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L213) |
| <a id="promptonrestore"></a> `promptOnRestore?` | `readonly` | `boolean`                                                | -                                                                      | [types/index.ts:214](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L214) |
| <a id="onrestoreprompt"></a> `onRestorePrompt?` | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `boolean` | -                                                                      | [types/index.ts:215](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L215) |
| <a id="versioning"></a> `versioning?`           | `readonly` | `boolean`                                                | Persist versioned envelopes (`DraftEnvelopeV1`) instead of raw values. | [types/index.ts:217](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L217) |
| <a id="schemaversion"></a> `schemaVersion?`     | `readonly` | `string`                                                 | App schema id compared / migrated when envelopes are enabled.          | [types/index.ts:219](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L219) |
| <a id="migratedraft"></a> `migrateDraft?`       | `readonly` | (`envelope`: `DraftEnvelopeV1`) => `DraftEnvelopeV1`     | Migrate an envelope before restore; throw to reject restore.           | [types/index.ts:221](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L221) |

---

### RestoreDraftOptions

Defined in: [types/index.ts:226](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L226)

#### Properties

| Property                      | Modifier   | Type                       | Description                                                                      | Defined in                                                                                                                                                 |
| ----------------------------- | ---------- | -------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="force"></a> `force?`   | `readonly` | `boolean`                  | Default false — if the form is dirty, no-op unless force (D-RESTORE-RACE).       | [types/index.ts:228](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L228) |
| <a id="prompt"></a> `prompt?` | `readonly` | `boolean`                  | Default false — if true, call `DraftConfig.onRestorePrompt` when set.            | [types/index.ts:230](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L230) |
| <a id="merge"></a> `merge?`   | `readonly` | `"overlay"` \| `"replace"` | Default `overlay` — `{ ...defaults, ...draft }`. `replace` uses draft keys only. | [types/index.ts:232](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L232) |

---

### AnalyticsConfig

Defined in: [types/index.ts:235](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L235)

#### Properties

| Property                                  | Modifier   | Type                                                                      | Description                                                                                                                   | Defined in                                                                                                                                                 |
| ----------------------------------------- | ---------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="enabled-2"></a> `enabled?`         | `readonly` | `boolean`                                                                 | -                                                                                                                             | [types/index.ts:236](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L236) |
| <a id="includepaths"></a> `includePaths?` | `readonly` | readonly `string`[]                                                       | When set, only these paths appear in path-keyed metrics (deny-by-default for others). Values are never captured — paths only. | [types/index.ts:241](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L241) |
| <a id="excludepaths"></a> `excludePaths?` | `readonly` | readonly `string`[]                                                       | Paths omitted from path-keyed metrics.                                                                                        | [types/index.ts:243](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L243) |
| <a id="onsnapshot"></a> `onSnapshot?`     | `readonly` | (`snapshot`: [`FormAnalyticsSnapshot`](#formanalyticssnapshot)) => `void` | Invoked whenever a snapshot is produced via `getAnalytics()`.                                                                 | [types/index.ts:245](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L245) |

---

### FormAnalyticsSnapshot

Defined in: [types/index.ts:248](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L248)

#### Properties

| Property                                             | Modifier   | Type                                                          | Defined in                                                                                                                                                 |
| ---------------------------------------------------- | ---------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="startedat-1"></a> `startedAt`                 | `readonly` | `number`                                                      | [types/index.ts:249](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L249) |
| <a id="completedat"></a> `completedAt`               | `readonly` | `null` \| `number`                                            | [types/index.ts:250](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L250) |
| <a id="errorcount"></a> `errorCount`                 | `readonly` | `number`                                                      | [types/index.ts:251](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L251) |
| <a id="errorsbyfield"></a> `errorsByField`           | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `number`\>\> | [types/index.ts:252](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L252) |
| <a id="abandonedat"></a> `abandonedAt`               | `readonly` | `null` \| `number`                                            | [types/index.ts:253](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L253) |
| <a id="currentstep"></a> `currentStep`               | `readonly` | `number`                                                      | [types/index.ts:254](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L254) |
| <a id="fieldviews"></a> `fieldViews`                 | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `number`\>\> | [types/index.ts:255](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L255) |
| <a id="dropofffield"></a> `dropOffField`             | `readonly` | `null` \| `string`                                            | [types/index.ts:256](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L256) |
| <a id="timetocompletems"></a> `timeToCompleteMs`     | `readonly` | `null` \| `number`                                            | [types/index.ts:257](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L257) |
| <a id="timetofirsterrorms"></a> `timeToFirstErrorMs` | `readonly` | `null` \| `number`                                            | [types/index.ts:258](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L258) |

---

### OfflineQueueConfig

Defined in: [types/index.ts:261](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L261)

#### Properties

| Property                                      | Modifier   | Type                                                                                                                                                                       | Description                                                                                                                                                                   | Defined in                                                                                                                                                 |
| --------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="enabled-3"></a> `enabled?`             | `readonly` | `boolean`                                                                                                                                                                  | -                                                                                                                                                                             | [types/index.ts:262](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L262) |
| <a id="storagekey-1"></a> `storageKey?`       | `readonly` | `string`                                                                                                                                                                   | -                                                                                                                                                                             | [types/index.ts:263](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L263) |
| <a id="maxitems"></a> `maxItems?`             | `readonly` | `number`                                                                                                                                                                   | Soft cap on queued items.                                                                                                                                                     | [types/index.ts:265](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L265) |
| <a id="overflow"></a> `overflow?`             | `readonly` | `OfflineOverflowPolicy`                                                                                                                                                    | Behavior when `maxItems` is exceeded. Default: `drop-oldest`.                                                                                                                 | [types/index.ts:270](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L270) |
| <a id="idempotencykey"></a> `idempotencyKey?` | `readonly` | (`values`: `Record`\<`string`, `unknown`\>) => `string`                                                                                                                    | Deduplicate pending items with the same key (skip enqueue).                                                                                                                   | [types/index.ts:272](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L272) |
| <a id="onconflict"></a> `onConflict?`         | `readonly` | (`local`: `QueuedSubmission`\<`Record`\<`string`, `unknown`\>\>, `error`: `unknown`) => \| `void` \| `OfflineConflictAction` \| `Promise`\<void \| OfflineConflictAction\> | Called when a queued item fails during flush. - `keep` (default) — leave at head, stop flush - `drop` — discard and continue - `retry` — keep at head and continue attempting | [types/index.ts:279](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L279) |
| <a id="onoverflow"></a> `onOverflow?`         | `readonly` | (`dropped`: `QueuedSubmission`\<`Record`\<`string`, `unknown`\>\>, `policy`: `OfflineOverflowPolicy`) => `void`                                                            | -                                                                                                                                                                             | [types/index.ts:286](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L286) |

---

### KeyboardShortcutConfig

Defined in: [types/index.ts:292](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L292)

#### Properties

| Property                     | Modifier   | Type                                                | Defined in                                                                                                                                                 |
| ---------------------------- | ---------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="combo"></a> `combo`   | `readonly` | `string`                                            | [types/index.ts:293](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L293) |
| <a id="action"></a> `action` | `readonly` | `"submit"` \| `"saveDraft"` \| `"undo"` \| `"redo"` | [types/index.ts:294](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L294) |

---

### WorkflowConfig

Defined in: [types/index.ts:297](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L297)

#### Properties

| Property                                  | Modifier   | Type                                                           | Defined in                                                                                                                                                 |
| ----------------------------------------- | ---------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="autosave"></a> `autosave?`         | `readonly` | [`AutosaveConfig`](#autosaveconfig)                            | [types/index.ts:298](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L298) |
| <a id="draft"></a> `draft?`               | `readonly` | [`DraftConfig`](#draftconfig)                                  | [types/index.ts:299](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L299) |
| <a id="wizard"></a> `wizard?`             | `readonly` | [`WizardConfig`](#wizardconfig)                                | [types/index.ts:300](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L300) |
| <a id="analytics"></a> `analytics?`       | `readonly` | [`AnalyticsConfig`](#analyticsconfig)                          | [types/index.ts:301](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L301) |
| <a id="offlinequeue"></a> `offlineQueue?` | `readonly` | [`OfflineQueueConfig`](#offlinequeueconfig)                    | [types/index.ts:302](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L302) |
| <a id="keyboard"></a> `keyboard?`         | `readonly` | readonly [`KeyboardShortcutConfig`](#keyboardshortcutconfig)[] | [types/index.ts:303](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L303) |

---

### SubmissionQueueState

Defined in: [types/index.ts:306](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L306)

#### Properties

| Property                         | Modifier   | Type      | Defined in                                                                                                                                                 |
| -------------------------------- | ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="pending"></a> `pending`   | `readonly` | `number`  | [types/index.ts:307](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L307) |
| <a id="flushing"></a> `flushing` | `readonly` | `boolean` | [types/index.ts:308](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L308) |

---

### SetValueOptions

Defined in: [types/index.ts:311](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L311)

#### Properties

| Property                                    | Modifier   | Type      | Defined in                                                                                                                                                 |
| ------------------------------------------- | ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="recordhistory"></a> `recordHistory?` | `readonly` | `boolean` | [types/index.ts:312](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L312) |
| <a id="markdirty-4"></a> `markDirty?`       | `readonly` | `boolean` | [types/index.ts:313](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L313) |

---

### SubmitOptions

Defined in: [types/index.ts:316](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L316)

#### Properties

| Property                                                | Modifier   | Type                      | Defined in                                                                                                                                                 |
| ------------------------------------------------------- | ---------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="preventdoublesubmit"></a> `preventDoubleSubmit?` | `readonly` | `boolean`                 | [types/index.ts:317](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L317) |
| <a id="includediff"></a> `includeDiff?`                 | `readonly` | `boolean`                 | [types/index.ts:318](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L318) |
| <a id="retry-2"></a> `retry?`                           | `readonly` | `number` \| `RetryPolicy` | [types/index.ts:319](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L319) |

---

### FormChangeRecord

Defined in: [types/index.ts:327](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L327)

#### Properties

| Property                          | Modifier   | Type             | Description                                   | Defined in                                                                                                                                                 |
| --------------------------------- | ---------- | ---------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="path-7"></a> `path`        | `readonly` | `string`         | -                                             | [types/index.ts:328](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L328) |
| <a id="type-1"></a> `type`        | `readonly` | `FormChangeType` | -                                             | [types/index.ts:329](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L329) |
| <a id="previous"></a> `previous?` | `readonly` | `unknown`        | -                                             | [types/index.ts:330](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L330) |
| <a id="current"></a> `current?`   | `readonly` | `unknown`        | -                                             | [types/index.ts:331](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L331) |
| <a id="from-4"></a> `from?`       | `readonly` | `string`         | Present when `type` is `moved` (source path). | [types/index.ts:333](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L333) |

---

### FormDiffMetadata

Defined in: [types/index.ts:336](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L336)

#### Properties

| Property                                     | Modifier   | Type     | Defined in                                                                                                                                                 |
| -------------------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="durationms"></a> `durationMs`         | `readonly` | `number` | [types/index.ts:337](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L337) |
| <a id="changecount"></a> `changeCount`       | `readonly` | `number` | [types/index.ts:338](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L338) |
| <a id="addedcount"></a> `addedCount`         | `readonly` | `number` | [types/index.ts:339](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L339) |
| <a id="removedcount"></a> `removedCount`     | `readonly` | `number` | [types/index.ts:340](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L340) |
| <a id="changedcount"></a> `changedCount`     | `readonly` | `number` | [types/index.ts:341](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L341) |
| <a id="unchangedcount"></a> `unchangedCount` | `readonly` | `number` | [types/index.ts:342](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L342) |
| <a id="movedcount"></a> `movedCount`         | `readonly` | `number` | [types/index.ts:343](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L343) |

---

### FormDiffResult

Defined in: [types/index.ts:346](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L346)

#### Properties

| Property                             | Modifier   | Type                                               | Defined in                                                                                                                                                 |
| ------------------------------------ | ---------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="changes-1"></a> `changes`     | `readonly` | readonly [`FormChangeRecord`](#formchangerecord)[] | [types/index.ts:347](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L347) |
| <a id="haschanges"></a> `hasChanges` | `readonly` | `boolean`                                          | [types/index.ts:348](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L348) |
| <a id="metadata-1"></a> `metadata`   | `readonly` | [`FormDiffMetadata`](#formdiffmetadata)            | [types/index.ts:349](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L349) |

---

### FormDiffOptions

Defined in: [types/index.ts:352](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L352)

#### Properties

| Property                                                        | Modifier   | Type      | Defined in                                                                                                                                                 |
| --------------------------------------------------------------- | ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="maxdepth"></a> `maxDepth?`                               | `readonly` | `number`  | [types/index.ts:353](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L353) |
| <a id="includeunchanged"></a> `includeUnchanged?`               | `readonly` | `boolean` | [types/index.ts:354](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L354) |
| <a id="treatundefinedasmissing"></a> `treatUndefinedAsMissing?` | `readonly` | `boolean` | [types/index.ts:355](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L355) |

---

### SubmitSecurityCaptcha

Defined in: [types/index.ts:359](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L359)

CAPTCHA token under the submission security namespace (ADR-CAP-001).

#### Properties

| Property                            | Modifier   | Type     | Defined in                                                                                                                                                 |
| ----------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="provider"></a> `provider`    | `readonly` | `string` | [types/index.ts:360](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L360) |
| <a id="token"></a> `token`          | `readonly` | `string` | [types/index.ts:361](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L361) |
| <a id="expiresat"></a> `expiresAt?` | `readonly` | `number` | [types/index.ts:362](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L362) |

---

### SubmitSecurityMeta

Defined in: [types/index.ts:369](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L369)

Security namespace on submit meta.
Stable path: `meta.security.captcha` (future: CSRF, OTP, …).

#### Properties

| Property                        | Modifier   | Type                                              | Defined in                                                                                                                                                 |
| ------------------------------- | ---------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="captcha"></a> `captcha?` | `readonly` | [`SubmitSecurityCaptcha`](#submitsecuritycaptcha) | [types/index.ts:370](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L370) |

---

### SubmitMeta

Defined in: [types/index.ts:373](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L373)

#### Properties

| Property                                    | Modifier   | Type                                        | Description                                            | Defined in                                                                                                                                                 |
| ------------------------------------------- | ---------- | ------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="changedfields"></a> `changedFields?` | `readonly` | readonly `string`[]                         | -                                                      | [types/index.ts:374](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L374) |
| <a id="diff"></a> `diff?`                   | `readonly` | [`FormDiffResult`](#formdiffresult)         | -                                                      | [types/index.ts:375](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L375) |
| <a id="signal-5"></a> `signal?`             | `readonly` | `AbortSignal`                               | -                                                      | [types/index.ts:376](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L376) |
| <a id="security"></a> `security?`           | `readonly` | [`SubmitSecurityMeta`](#submitsecuritymeta) | Populated by the Security Stage (e.g. CAPTCHA plugin). | [types/index.ts:378](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L378) |

---

### ValidateOptions

Defined in: [types/index.ts:381](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L381)

#### Properties

| Property                    | Modifier   | Type                                | Defined in                                                                                                                                                 |
| --------------------------- | ---------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="paths"></a> `paths?` | `readonly` | readonly `string`[]                 | [types/index.ts:382](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L382) |
| <a id="mode"></a> `mode?`   | `readonly` | [`ValidationMode`](#validationmode) | [types/index.ts:383](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L383) |

---

### ResetOptions\<TValues\>

Defined in: [types/index.ts:386](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L386)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                            | Modifier   | Type                   | Defined in                                                                                                                                                 |
| ----------------------------------- | ---------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="values-6"></a> `values?`     | `readonly` | `Partial`\<`TValues`\> | [types/index.ts:387](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L387) |
| <a id="keepdirty"></a> `keepDirty?` | `readonly` | `boolean`              | [types/index.ts:388](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L388) |

---

### FormConfig\<TValues\>

Defined in: [types/index.ts:399](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L399)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                                  | Modifier   | Type                                                                                                                                                            | Description                                                                                                                                                                                                                                                                                                                                 | Defined in                                                                                                                                                 |
| --------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="initialvalues"></a> `initialValues?`               | `readonly` | `TValues`                                                                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:400](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L400) |
| <a id="target"></a> `target?`                             | `readonly` | `string` \| `HTMLElement`                                                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:401](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L401) |
| <a id="form-5"></a> `form?`                               | `readonly` | `string` \| `HTMLElement`                                                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:402](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L402) |
| <a id="schema"></a> `schema?`                             | `readonly` | \| [`SchemaAdapter`](#schemaadapter)\<`Record`\<`string`, `unknown`\>\> \| `Partial`\<`Record`\<`string`, [`FieldSchemaDefinition`](#fieldschemadefinition)\>\> | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:403](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L403) |
| <a id="onsubmit"></a> `onSubmit?`                         | `readonly` | (`values`: `TValues`, `meta?`: [`SubmitMeta`](#submitmeta)) => `void` \| `Promise`\<`void`\>                                                                    | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:404](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L404) |
| <a id="onsubmiterror"></a> `onSubmitError?`               | `readonly` | (`error`: `unknown`) => `void`                                                                                                                                  | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:405](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L405) |
| <a id="onpluginerror"></a> `onPluginError?`               | `readonly` | [`PluginErrorHandler`](#pluginerrorhandler)                                                                                                                     | Receives isolated plugin/hook failures (setup, hooks, destroy). Does not rethrow — form continues per Phase 15 isolation policy.                                                                                                                                                                                                            | [types/index.ts:410](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L410) |
| <a id="validateon-1"></a> `validateOn?`                   | `readonly` | [`ValidationMode`](#validationmode)                                                                                                                             | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:411](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L411) |
| <a id="validators-2"></a> `validators?`                   | `readonly` | `Partial`\<`Record`\<`string`, \| [`Validator`](#validator)\<`TValues`\> \| readonly [`Validator`](#validator)\<`TValues`\>[]\>\>                               | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:412](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L412) |
| <a id="crossfieldvalidators"></a> `crossFieldValidators?` | `readonly` | readonly `CrossFieldRule`\<`TValues`\>[]                                                                                                                        | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:415](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L415) |
| <a id="formvalidators"></a> `formValidators?`             | `readonly` | readonly `CrossFieldValidator`\<`TValues`\>[]                                                                                                                   | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:416](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L416) |
| <a id="workflow"></a> `workflow?`                         | `readonly` | [`WorkflowConfig`](#workflowconfig)                                                                                                                             | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:417](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L417) |
| <a id="autosave-1"></a> `autoSave?`                       | `readonly` | [`AutosaveConfig`](#autosaveconfig) & \{ `every?`: `string`; \}                                                                                                 | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:418](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L418) |
| <a id="wizard-1"></a> `wizard?`                           | `readonly` | `boolean` \| [`WizardConfig`](#wizardconfig)                                                                                                                    | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:419](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L419) |
| <a id="rules"></a> `rules?`                               | `readonly` | readonly [`FormRuleInput`](#formruleinput)\<`TValues`\>[]                                                                                                       | -                                                                                                                                                                                                                                                                                                                                           | [types/index.ts:420](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L420) |
| <a id="plugins"></a> `plugins?`                           | `readonly` | readonly [`FormPlugin`](#formplugin)\<`TValues`\>[]                                                                                                             | Plugins registered at create time (same as calling `form.use(plugin)` for each entry, in order). Prefer this for declarative setup; use `form.use()` later for conditional or late registration.                                                                                                                                            | [types/index.ts:425](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L425) |
| <a id="subscribe-2"></a> `subscribe?`                     | `readonly` | \| [`FormSubscribeListener`](#formsubscribelistener)\<`TValues`\> \| readonly [`FormSubscribeListener`](#formsubscribelistener)\<`TValues`\>[]                  | State listeners registered at create time (same store as `form.subscribe()`). Pass one listener or an array. Each receives the form instance, is invoked once after create (so UI can sync immediately), then on every state notify. Lives until `form.destroy()`. Prefer framework adapters for React/Vue; use this for vanilla / host UI. | [types/index.ts:432](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L432) |
| <a id="dependencies-3"></a> `dependencies?`               | `readonly` | `Readonly`\<`Record`\<`string`, `string` \| readonly `string`[]\>\>                                                                                             | Explicit dependency map: child → parent(s). Cycles throw `ConfigurationError` at registration (ADR-007).                                                                                                                                                                                                                                    | [types/index.ts:437](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L437) |
| <a id="dependencyactions"></a> `dependencyActions?`       | `readonly` | `Partial`\<`Record`\<`string`, readonly [`DependencyAction`](#dependencyaction)[]\>\>                                                                           | Per-child action overrides for `dependencies` (default `["clear","revalidate"]`).                                                                                                                                                                                                                                                           | [types/index.ts:439](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L439) |

---

### FieldState

Defined in: [types/index.ts:444](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L444)

#### Properties

| Property                         | Modifier   | Type      | Defined in                                                                                                                                                 |
| -------------------------------- | ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="touched-1"></a> `touched` | `readonly` | `boolean` | [types/index.ts:445](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L445) |
| <a id="dirty-1"></a> `dirty`     | `readonly` | `boolean` | [types/index.ts:446](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L446) |
| <a id="visited-1"></a> `visited` | `readonly` | `boolean` | [types/index.ts:447](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L447) |
| <a id="changed"></a> `changed`   | `readonly` | `boolean` | [types/index.ts:448](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L448) |

---

### FormState\<TValues\>

Defined in: [types/index.ts:451](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L451)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                                       | Modifier   | Type                                                                                          | Description                            | Defined in                                                                                                                                                 |
| ---------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="values-7"></a> `values`                 | `readonly` | `TValues`                                                                                     | -                                      | [types/index.ts:452](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L452) |
| <a id="errors"></a> `errors`                   | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `string`\>\>                                 | -                                      | [types/index.ts:453](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L453) |
| <a id="touched-2"></a> `touched`               | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      | [types/index.ts:454](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L454) |
| <a id="dirty-2"></a> `dirty`                   | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      | [types/index.ts:455](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L455) |
| <a id="visited-2"></a> `visited`               | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      | [types/index.ts:456](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L456) |
| <a id="changed-1"></a> `changed`               | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `boolean`\>\>                                | -                                      | [types/index.ts:457](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L457) |
| <a id="issubmitting"></a> `isSubmitting`       | `readonly` | `boolean`                                                                                     | -                                      | [types/index.ts:458](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L458) |
| <a id="isvalidating-1"></a> `isValidating`     | `readonly` | `boolean`                                                                                     | -                                      | [types/index.ts:459](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L459) |
| <a id="isvalid"></a> `isValid`                 | `readonly` | `boolean`                                                                                     | -                                      | [types/index.ts:460](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L460) |
| <a id="isdirty"></a> `isDirty`                 | `readonly` | `boolean`                                                                                     | -                                      | [types/index.ts:461](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L461) |
| <a id="ischanged"></a> `isChanged`             | `readonly` | `boolean`                                                                                     | -                                      | [types/index.ts:462](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L462) |
| <a id="submitcount"></a> `submitCount`         | `readonly` | `number`                                                                                      | -                                      | [types/index.ts:463](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L463) |
| <a id="submitphase-1"></a> `submitPhase`       | `readonly` | [`SubmitPhase`](#submitphase)                                                                 | Last / current submit lifecycle phase. | [types/index.ts:465](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L465) |
| <a id="workflow-1"></a> `workflow`             | `readonly` | [`WorkflowState`](#workflowstate)                                                             | -                                      | [types/index.ts:466](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L466) |
| <a id="fieldui-1"></a> `fieldUi`               | `readonly` | [`FieldUiMap`](#fielduimap)                                                                   | -                                      | [types/index.ts:467](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L467) |
| <a id="formui-1"></a> `formUi`                 | `readonly` | [`FormUiState`](#formuistate)                                                                 | -                                      | [types/index.ts:468](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L468) |
| <a id="fieldmeta"></a> `fieldMeta`             | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), [`FieldMetaState`](#fieldmetastate)\>\>      | -                                      | [types/index.ts:469](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L469) |
| <a id="fieldoptions-2"></a> `fieldOptions`     | `readonly` | `Readonly`\<`Record`\<[`FieldPath`](#fieldpath), readonly [`FieldOption`](#fieldoption)[]\>\> | -                                      | [types/index.ts:470](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L470) |
| <a id="submissionqueue"></a> `submissionQueue` | `readonly` | [`SubmissionQueueState`](#submissionqueuestate)                                               | -                                      | [types/index.ts:471](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L471) |

---

### WorkflowState

Defined in: [types/index.ts:474](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L474)

#### Properties

| Property                                     | Modifier   | Type               | Defined in                                                                                                                                                 |
| -------------------------------------------- | ---------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="currentstep-1"></a> `currentStep`     | `readonly` | `number`           | [types/index.ts:475](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L475) |
| <a id="totalsteps"></a> `totalSteps`         | `readonly` | `number`           | [types/index.ts:476](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L476) |
| <a id="cangonext"></a> `canGoNext`           | `readonly` | `boolean`          | [types/index.ts:477](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L477) |
| <a id="cangoprev"></a> `canGoPrev`           | `readonly` | `boolean`          | [types/index.ts:478](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L478) |
| <a id="progress"></a> `progress`             | `readonly` | `number`           | [types/index.ts:479](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L479) |
| <a id="isautosaving"></a> `isAutosaving`     | `readonly` | `boolean`          | [types/index.ts:480](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L480) |
| <a id="lastautosaveat"></a> `lastAutosaveAt` | `readonly` | `null` \| `number` | [types/index.ts:481](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L481) |

---

### FormCheckpoint\<TValues\>

Defined in: [types/index.ts:489](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L489)

Durable form checkpoint — distinct from `getSnapshot()` (external-store identity).

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                             | Modifier   | Type                                                                | Defined in                                                                                                                                                 |
| ------------------------------------ | ---------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="version"></a> `version`       | `readonly` | `1`                                                                 | [types/index.ts:490](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L490) |
| <a id="kind"></a> `kind`             | `readonly` | `"checkpoint"`                                                      | [types/index.ts:491](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L491) |
| <a id="capturedat"></a> `capturedAt` | `readonly` | `number`                                                            | [types/index.ts:492](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L492) |
| <a id="values-8"></a> `values`       | `readonly` | `TValues`                                                           | [types/index.ts:493](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L493) |
| <a id="errors-1"></a> `errors?`      | `readonly` | `Readonly`\<`Record`\<`string`, `string`\>\>                        | [types/index.ts:494](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L494) |
| <a id="touched-3"></a> `touched?`    | `readonly` | `Readonly`\<`Record`\<`string`, `boolean`\>\>                       | [types/index.ts:495](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L495) |
| <a id="dirty-3"></a> `dirty?`        | `readonly` | `Readonly`\<`Record`\<`string`, `boolean`\>\>                       | [types/index.ts:496](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L496) |
| <a id="visited-3"></a> `visited?`    | `readonly` | `Readonly`\<`Record`\<`string`, `boolean`\>\>                       | [types/index.ts:497](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L497) |
| <a id="fieldui-2"></a> `fieldUi?`    | `readonly` | `Readonly`\<`Record`\<`string`, [`FieldUiState`](#fielduistate)\>\> | [types/index.ts:498](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L498) |
| <a id="workflow-2"></a> `workflow?`  | `readonly` | \{ `currentStep`: `number`; \}                                      | [types/index.ts:499](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L499) |
| `workflow.currentStep`               | `readonly` | `number`                                                            | [types/index.ts:499](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L499) |

---

### CreateCheckpointOptions

Defined in: [types/index.ts:502](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L502)

#### Properties

| Property                        | Modifier   | Type                                                                                                                | Defined in                                                                                                                                                 |
| ------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="include"></a> `include?` | `readonly` | readonly ( \| `"values"` \| `"workflow"` \| `"touched"` \| `"errors"` \| `"dirty"` \| `"visited"` \| `"fieldUi"`)[] | [types/index.ts:503](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L503) |

---

### RestoreCheckpointOptions

Defined in: [types/index.ts:508](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L508)

#### Properties

| Property                                      | Modifier   | Type      | Defined in                                                                                                                                                 |
| --------------------------------------------- | ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="recordhistory-1"></a> `recordHistory?` | `readonly` | `boolean` | [types/index.ts:509](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L509) |
| <a id="restoremeta"></a> `restoreMeta?`       | `readonly` | `boolean` | [types/index.ts:510](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L510) |

---

### FormInstance\<TValues\>

Defined in: [types/index.ts:513](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L513)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> |

#### Properties

| Property                           | Modifier   | Type                                                                                                                                                                              | Description                                                                                                                  | Defined in                                                                                                                                                 |
| ---------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="id-4"></a> `id`             | `readonly` | `string`                                                                                                                                                                          | -                                                                                                                            | [types/index.ts:514](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L514) |
| <a id="ref"></a> `ref`             | `readonly` | [`FormRef`](#formref)                                                                                                                                                             | -                                                                                                                            | [types/index.ts:515](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L515) |
| <a id="ui-1"></a> `ui`             | `readonly` | `FormUiProjection`\<`TValues`\>                                                                                                                                                   | Derived UI projection (`@jayoncode/form-intelligence/ui`). Uses registered policies from `ui()` plugin, or package defaults. | [types/index.ts:528](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L528) |
| <a id="state-1"></a> `state`       | `readonly` | [`FormState`](#formstate)\<`TValues`\>                                                                                                                                            | Current form snapshot — same as `getFormState()`.                                                                            | [types/index.ts:555](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L555) |
| <a id="workflow-3"></a> `workflow` | `public`   | \{ `next`: `Promise`\<`boolean`\>; `prev`: `void`; `goTo`: `Promise`\<`boolean`\>; `getStepGraph`: [`WizardStepGraph`](#wizardstepgraph); `visibleSteps`: readonly `string`[]; \} | -                                                                                                                            | [types/index.ts:626](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L626) |
| `workflow.next`                    | `public`   | `Promise`\<`boolean`\>                                                                                                                                                            | -                                                                                                                            | [types/index.ts:627](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L627) |
| `workflow.prev`                    | `public`   | `void`                                                                                                                                                                            | -                                                                                                                            | [types/index.ts:628](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L628) |
| `workflow.goTo`                    | `public`   | `Promise`\<`boolean`\>                                                                                                                                                            | -                                                                                                                            | [types/index.ts:629](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L629) |
| `workflow.getStepGraph`            | `public`   | [`WizardStepGraph`](#wizardstepgraph)                                                                                                                                             | -                                                                                                                            | [types/index.ts:633](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L633) |
| `workflow.visibleSteps`            | `public`   | readonly `string`[]                                                                                                                                                               | -                                                                                                                            | [types/index.ts:634](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L634) |

#### Methods

##### field()

```ts
field(path: string, options?: FieldOptions<TValues>): FieldHandle<TValues>;
```

Defined in: [types/index.ts:516](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L516)

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

Defined in: [types/index.ts:518](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L518)

First path with a non-empty error (stable key order).

###### Returns

`undefined` \| `string`

##### focusFirstInvalid()

```ts
focusFirstInvalid(): undefined | string;
```

Defined in: [types/index.ts:523](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L523)

Focus first invalid control when `document` exists; SSR-safe no-op.
Returns the focused path or `undefined`.

###### Returns

`undefined` \| `string`

##### registeredFieldPaths()

```ts
registeredFieldPaths(): readonly string[];
```

Defined in: [types/index.ts:530](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L530)

Paths registered via `field()` in registration order.

###### Returns

readonly `string`[]

##### pushField()

```ts
pushField(arrayPath: string, item?: unknown): string;
```

Defined in: [types/index.ts:531](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L531)

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

Defined in: [types/index.ts:532](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L532)

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

Defined in: [types/index.ts:533](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L533)

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

Defined in: [types/index.ts:534](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L534)

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

Defined in: [types/index.ts:535](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L535)

###### Returns

`void`

##### useMiddleware()

```ts
useMiddleware(middleware: MiddlewareInput<TValues>): () => void;
```

Defined in: [types/index.ts:540](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L540)

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

Defined in: [types/index.ts:543](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L543)

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

Defined in: [types/index.ts:544](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L544)

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

Defined in: [types/index.ts:545](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L545)

###### Returns

`TValues`

###### Call Signature

```ts
values(path: string): unknown;
```

Defined in: [types/index.ts:546](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L546)

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

Defined in: [types/index.ts:547](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L547)

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

Defined in: [types/index.ts:548](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L548)

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

Defined in: [types/index.ts:549](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L549)

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

Defined in: [types/index.ts:550](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L550)

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

Defined in: [types/index.ts:551](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L551)

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

Defined in: [types/index.ts:552](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L552)

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

Defined in: [types/index.ts:553](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L553)

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

Defined in: [types/index.ts:556](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L556)

###### Returns

[`FormState`](#formstate)\<`TValues`\>

##### getSnapshot()

```ts
getSnapshot(): FormState<TValues>;
```

Defined in: [types/index.ts:558](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L558)

For `useSyncExternalStore(form.subscribe, form.getSnapshot)`. Not a durable checkpoint.

###### Returns

[`FormState`](#formstate)\<`TValues`\>

##### getPresentation()

###### Call Signature

```ts
getPresentation(path: string): PresentationState;
```

Defined in: [types/index.ts:560](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L560)

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

Defined in: [types/index.ts:562](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L562)

Full presentation maps (same sources as `state.fieldUi` / `formUi` / `fieldOptions`).

###### Returns

[`PresentationSnapshot`](#presentationsnapshot)

##### createCheckpoint()

```ts
createCheckpoint(options?: CreateCheckpointOptions): FormCheckpoint<TValues>;
```

Defined in: [types/index.ts:564](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L564)

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

Defined in: [types/index.ts:565](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L565)

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

Defined in: [types/index.ts:566](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L566)

###### Returns

`TValues`

##### getErrors()

```ts
getErrors(): Readonly<Record<FieldPath, string>>;
```

Defined in: [types/index.ts:567](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L567)

###### Returns

`Readonly`\<`Record`\<[`FieldPath`](#fieldpath), `string`\>\>

##### isValid()

```ts
isValid(): boolean;
```

Defined in: [types/index.ts:568](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L568)

###### Returns

`boolean`

##### isSubmitting()

```ts
isSubmitting(): boolean;
```

Defined in: [types/index.ts:569](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L569)

###### Returns

`boolean`

##### submissionGuard()

```ts
submissionGuard(options?: Pick<SubmitOptions, "preventDoubleSubmit">): SubmissionGuardResult;
```

Defined in: [types/index.ts:574](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L574)

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

Defined in: [types/index.ts:577](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L577)

###### Returns

`boolean`

##### changedFields()

```ts
changedFields(): readonly string[];
```

Defined in: [types/index.ts:578](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L578)

###### Returns

readonly `string`[]

##### changedSinceSubmitFields()

```ts
changedSinceSubmitFields(): readonly string[];
```

Defined in: [types/index.ts:579](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L579)

###### Returns

readonly `string`[]

##### diffFromDefaults()

```ts
diffFromDefaults(options?: FormDiffOptions): Promise<FormDiffResult>;
```

Defined in: [types/index.ts:580](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L580)

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

Defined in: [types/index.ts:581](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L581)

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

Defined in: [types/index.ts:582](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L582)

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

Defined in: [types/index.ts:584](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L584)

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

Defined in: [types/index.ts:586](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L586)

Fluent dependency registrar + `inspect()`.

###### Returns

[`DependencyRegistrar`](#dependencyregistrar)\<`TValues`\>

##### calculate()

###### Call Signature

```ts
calculate(path: string): CalculationBuilder<TValues>;
```

Defined in: [types/index.ts:588](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L588)

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

Defined in: [types/index.ts:589](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L589)

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

Defined in: [types/index.ts:594](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L594)

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

Defined in: [types/index.ts:595](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L595)

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

Defined in: [types/index.ts:599](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L599)

###### Returns

`void`

##### restoreDraft()

```ts
restoreDraft(options?: RestoreDraftOptions): Promise<boolean>;
```

Defined in: [types/index.ts:605](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L605)

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

Defined in: [types/index.ts:606](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L606)

###### Returns

`boolean`

##### redo()

```ts
redo(): boolean;
```

Defined in: [types/index.ts:607](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L607)

###### Returns

`boolean`

##### getAnalytics()

```ts
getAnalytics(): FormAnalyticsSnapshot;
```

Defined in: [types/index.ts:608](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L608)

###### Returns

[`FormAnalyticsSnapshot`](#formanalyticssnapshot)

##### flushOfflineQueue()

```ts
flushOfflineQueue(): Promise<{
  flushed: number;
  failed: number;
}>;
```

Defined in: [types/index.ts:609](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L609)

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

Defined in: [types/index.ts:610](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L610)

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

Defined in: [types/index.ts:611](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L611)

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

Defined in: [types/index.ts:613](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L613)

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

Defined in: [types/index.ts:622](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L622)

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

Defined in: [types/index.ts:623](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L623)

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

Defined in: [types/index.ts:624](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L624)

###### Returns

`void`

##### registerPlugin()

```ts
registerPlugin(plugin: FormPlugin<TValues>): void;
```

Defined in: [types/index.ts:625](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L625)

###### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `plugin`  | [`FormPlugin`](#formplugin)\<`TValues`\> |

###### Returns

`void`

---

### FormPluginSetupResult

Defined in: [types/index.ts:638](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L638)

#### Properties

| Property                            | Modifier   | Type         | Defined in                                                                                                                                                 |
| ----------------------------------- | ---------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="ondestroy"></a> `onDestroy?` | `readonly` | () => `void` | [types/index.ts:639](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L639) |

---

### FormPlugin\<TValues\>

Defined in: [types/index.ts:642](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L642)

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Properties

| Property                          | Modifier   | Type     | Description                                                                                                       | Defined in                                                                                                                                                 |
| --------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="name-7"></a> `name`        | `readonly` | `string` | -                                                                                                                 | [types/index.ts:643](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L643) |
| <a id="version-1"></a> `version?` | `readonly` | `string` | Plugin package/semver label (metadata only).                                                                      | [types/index.ts:645](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L645) |
| <a id="engines"></a> `engines?`   | `readonly` | `string` | Semver range against `@jayoncode/form-intelligence` (`>=3.1.0`, `^3.1.0`, or exact). Checked at `register`/`use`. | [types/index.ts:650](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L650) |
| <a id="order-2"></a> `order?`     | `readonly` | `number` | -                                                                                                                 | [types/index.ts:651](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L651) |

#### Methods

##### setup()

```ts
setup(form: FormInstance<TValues>, api: FormPluginApi<TValues>): void | FormPluginSetupResult | () => void;
```

Defined in: [types/index.ts:652](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L652)

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

Defined in: [adapters/controllers.ts:14](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L14)

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

Defined in: [engines/dependency/types.ts:3](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L3)

---

### DependencyMap

```ts
type DependencyMap = Readonly<Record<FieldPath, FieldPath | readonly FieldPath[]>>;
```

Defined in: [engines/dependency/types.ts:12](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/types.ts#L12)

Map sugar: child path → parent path(s).

---

### TransformFn()\<TValues\>

```ts
type TransformFn<TValues> = (value: unknown, ctx: TransformContext<TValues>) => unknown;
```

Defined in: [engines/transform/types.ts:36](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L36)

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

Defined in: [engines/workflow/types.ts:74](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L74)

---

### WizardNavigateValidation

```ts
type WizardNavigateValidation = "step" | "all" | "none";
```

Defined in: [engines/workflow/types.ts:98](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/types.ts#L98)

Validation scope for `workflow.goTo`. Default `"all"` preserves SHIPPED behavior.

---

### FormatPreset

```ts
type FormatPreset = "philippine-phone" | "credit-card" | "phone" | "currency" | "slug";
```

Defined in: [format/presets.ts:12](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/format/presets.ts#L12)

---

### Formatter()

```ts
type Formatter = (value: unknown) => unknown;
```

Defined in: [format/types.ts:1](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/format/types.ts#L1)

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

Defined in: [format/types.ts:2](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/format/types.ts#L2)

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

Defined in: [plugins/compat.ts:17](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/compat.ts#L17)

---

### PluginErrorHandler()

```ts
type PluginErrorHandler = (report: PluginErrorReport) => void;
```

Defined in: [plugins/compat.ts:26](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/compat.ts#L26)

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

Defined in: [plugins/middleware.ts:4](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L4)

Phases that onion middleware and plugin hooks can observe.

---

### MiddlewareNext()

```ts
type MiddlewareNext = () => Promise<void>;
```

Defined in: [plugins/middleware.ts:13](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L13)

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

Defined in: [plugins/middleware.ts:25](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L25)

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

Defined in: [plugins/middleware.ts:36](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L36)

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

---

### TtlInput

```ts
type TtlInput = number | `${number}ms` | `${number}s` | `${number}m` | `${number}h`;
```

Defined in: [types/async-validation.ts:7](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L7)

---

### FieldPath

```ts
type FieldPath = string;
```

Defined in: [types/index.ts:1](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L1)

---

### FormRuleInput\<TValues\>

```ts
type FormRuleInput<TValues> =
  FormRuleDefinition<TValues> | WhenRuleBuilder<TValues> | WhenRuleBuilder;
```

Defined in: [types/index.ts:48](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L48)

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

Defined in: [types/index.ts:54](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L54)

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

Defined in: [types/index.ts:56](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L56)

---

### ValidatorResult

```ts
type ValidatorResult = true | false | string | undefined;
```

Defined in: [types/index.ts:67](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L67)

---

### BuiltInFieldType

```ts
type BuiltInFieldType = "text" | "email" | "password" | "url";
```

Defined in: [types/index.ts:99](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L99)

---

### CustomFieldValidator()\<TValues\>

```ts
type CustomFieldValidator<TValues> = (
  context: CustomFieldValidatorContext<TValues>,
) => ValidatorResult | Promise<ValidatorResult>;
```

Defined in: [types/index.ts:116](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L116)

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

Defined in: [types/index.ts:132](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L132)

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

Defined in: [types/index.ts:134](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L134)

---

### Validator()\<TValues\>

```ts
type Validator<TValues> = (
  value: unknown,
  context: ValidationContext<TValues>,
) => ValidatorResult | Promise<ValidatorResult>;
```

Defined in: [types/index.ts:136](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L136)

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

Defined in: [types/index.ts:323](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L323)

Submit lifecycle phase (Phase 10). `isSubmitting` remains the boolean loading flag.

---

### FormSubscribeListener()\<TValues\>

```ts
type FormSubscribeListener<TValues> = (form: FormInstance<TValues>) => void;
```

Defined in: [types/index.ts:395](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L395)

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

Defined in: [types/index.ts:484](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/index.ts#L484)

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

Defined in: [validation/validators/custom.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/custom.ts#L18)

#### Type declaration

| Name      | Type   | Defined in                                                                                                                                                                                 |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `__async` | `true` | [validation/validators/custom.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/custom.ts#L19) |

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

Defined in: [validation/validators/custom.ts:21](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/custom.ts#L21)

#### Type declaration

| Name             | Type                                                           | Defined in                                                                                                                                                                                 |
| ---------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `__asyncOptions` | [`AsyncValidatorOptions`](#asyncvalidatoroptions)\<`TValues`\> | [validation/validators/custom.ts:24](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/custom.ts#L24) |

#### Type Parameters

| Type Parameter                                      | Default type                    |
| --------------------------------------------------- | ------------------------------- |
| `TValues` _extends_ `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

## Variables

### DEFAULT\_FIELD\_UI

```ts
const DEFAULT_FIELD_UI: FieldUiState;
```

Defined in: [engines/presentation/resolve.ts:10](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L10)

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

Defined in: [engines/presentation/resolve.ts:70](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L70)

Ownership note (Phase 9 / ADR-018): Workflow rules and schema/static
`required` baseline produce UI intents; Presentation exposes them.
Validation must not write `visible`/`hidden`/`required` on validate ticks.
DOM enhancer and adapters consume `getPresentation` / `field.ui` only.

#### Type declaration

| Name                                 | Type                                                                                  | Defined in                                                                                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="producers"></a> `producers`   | readonly \[`"workflow.rules"`, `"dependency.populate"`, `"schema.requiredBaseline"`\] | [engines/presentation/resolve.ts:71](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L71) |
| <a id="consumers"></a> `consumers`   | readonly \[`"dom.enhancer"`, `"framework.adapters"`, `"a11y"`\]                       | [engines/presentation/resolve.ts:72](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L72) |
| <a id="nonwriters"></a> `nonWriters` | readonly \[`"validation"`, `"transform"`, `"format"`\]                                | [engines/presentation/resolve.ts:73](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L73) |

---

### TRANSFORM\_INBOUND\_ORDER

```ts
const TRANSFORM_INBOUND_ORDER: readonly ["trim", "normalize", "sanitize", "custom", "parse"];
```

Defined in: [engines/transform/types.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/types.ts#L18)

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

Defined in: [plugins/compat.ts:7](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/compat.ts#L7)

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

Defined in: [plugins/middleware.ts:45](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L45)

Maps plugin hook names → middleware phases (Phase 10 / D-MW-VS-PLUGIN).
Plugin `api.on(hook)` and `form.useMiddleware` share one interceptor stack per phase.
Documented pipeline stages: see `PLUGIN_PIPELINE_STAGES`.

#### Type declaration

| Name                                         | Type               | Default value      | Defined in                                                                                                                                                             |
| -------------------------------------------- | ------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="beforevalidate"></a> `beforeValidate` | `"beforeValidate"` | `"beforeValidate"` | [plugins/middleware.ts:46](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L46) |
| <a id="aftervalidate"></a> `afterValidate`   | `"afterValidate"`  | `"afterValidate"`  | [plugins/middleware.ts:47](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L47) |
| <a id="beforesubmit"></a> `beforeSubmit`     | `"beforeSubmit"`   | `"beforeSubmit"`   | [plugins/middleware.ts:48](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L48) |
| <a id="aftersubmit"></a> `afterSubmit`       | `"afterSubmit"`    | `"afterSubmit"`    | [plugins/middleware.ts:49](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L49) |

---

### MIDDLEWARE\_ONLY\_PHASES

```ts
const MIDDLEWARE_ONLY_PHASES: readonly ["submitError", "beforeSetValue", "afterSetValue"];
```

Defined in: [plugins/middleware.ts:53](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L53)

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

Defined in: [types/async-validation.ts:59](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L59)

Defaults when the options-object overload is used (API_SIGNATURE_FREEZE §1).

#### Type declaration

| Name                                                 | Type        | Default value | Defined in                                                                                                                                                                     |
| ---------------------------------------------------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="debounce-1"></a> `debounce`                   | `300`       | `300`         | [types/async-validation.ts:60](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L60) |
| <a id="retry-1"></a> `retry`                         | `0`         | `0`           | [types/async-validation.ts:61](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L61) |
| <a id="timeout-1"></a> `timeout`                     | `undefined` | `undefined`   | [types/async-validation.ts:62](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L62) |
| <a id="cache-1"></a> `cache`                         | `false`     | `false`       | [types/async-validation.ts:63](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L63) |
| <a id="abortprevious-1"></a> `abortPrevious`         | `true`      | `true`        | [types/async-validation.ts:64](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L64) |
| <a id="preventduplicates-1"></a> `preventDuplicates` | `true`      | `true`        | [types/async-validation.ts:65](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L65) |
| <a id="sharedcache-1"></a> `sharedCache`             | `false`     | `false`       | [types/async-validation.ts:66](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L66) |
| <a id="offline-1"></a> `offline`                     | `"skip"`    | `"skip"`      | [types/async-validation.ts:67](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/types/async-validation.ts#L67) |

---

### email

```ts
const email: Validator;
```

Defined in: [validation/validators/email.ts:36](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/email.ts#L36)

---

### required

```ts
const required: Validator;
```

Defined in: [validation/validators/required.ts:3](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/required.ts#L3)

---

### url

```ts
const url: Validator;
```

Defined in: [validation/validators/url.ts:3](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/url.ts#L3)

---

### FORM\_INTELLIGENT\_VERSION

```ts
const FORM_INTELLIGENT_VERSION: "3.1.0" = "3.1.0";
```

Defined in: [version.ts:2](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/version.ts#L2)

Package version used for plugin `engines` compatibility checks.

## Functions

### createFormController()

```ts
function createFormController<TValues>(form: FormInstance<TValues>): FormController<TValues>;
```

Defined in: [adapters/controllers.ts:37](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/controllers.ts#L37)

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

Defined in: [adapters/framework-adapter.ts:18](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/framework-adapter.ts#L18)

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

Defined in: [adapters/persistence-adapter.ts:27](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/persistence-adapter.ts#L27)

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

Defined in: [adapters/schema-adapter.ts:13](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/schema-adapter.ts#L13)

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

Defined in: [adapters/submit-transport-adapter.ts:15](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/adapters/submit-transport-adapter.ts#L15)

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

Defined in: [core/create-form.ts:2019](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/create-form.ts#L2019)

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

Defined in: [core/form-module-host.ts:11](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/core/form-module-host.ts#L11)

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

Defined in: [engines/accessibility/compute-aria.ts:6](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/accessibility/compute-aria.ts#L6)

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

Defined in: [engines/calculation/calculation-builder.ts:81](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/calculation/calculation-builder.ts#L81)

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

Defined in: [engines/dependency/dependency-engine.ts:38](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/dependency/dependency-engine.ts#L38)

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

Defined in: [engines/presentation/resolve.ts:35](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/presentation/resolve.ts#L35)

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

Defined in: [engines/transform/transform-pipeline.ts:19](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/transform-pipeline.ts#L19)

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

Defined in: [engines/transform/transform-pipeline.ts:40](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/transform/transform-pipeline.ts#L40)

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

Defined in: [engines/workflow/when.ts:138](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/engines/workflow/when.ts#L138)

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

Defined in: [plugins/compat.ts:32](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/compat.ts#L32)

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

Defined in: [plugins/middleware.ts:60](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L60)

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

Defined in: [plugins/middleware.ts:80](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/plugins/middleware.ts#L80)

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

Defined in: [validation/async/memory-cache.ts:104](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/async/memory-cache.ts#L104)

Test helper — clears shared namespaces.

#### Returns

`void`

---

### parseTtl()

```ts
function parseTtl(input: TtlInput): number;
```

Defined in: [validation/async/parse-ttl.ts:9](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/async/parse-ttl.ts#L9)

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

Defined in: [validation/cross-field.ts:17](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/cross-field.ts#L17)

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

Defined in: [validation/cross-field.ts:27](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/cross-field.ts#L27)

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

Defined in: [validation/pipeline.ts:22](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/pipeline.ts#L22)

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

Defined in: [validation/validators/currency.ts:9](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/currency.ts#L9)

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

Defined in: [validation/validators/custom.ts:12](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/custom.ts#L12)

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

Defined in: [validation/validators/custom.ts:27](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/custom.ts#L27)

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

Defined in: [validation/validators/custom.ts:30](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/custom.ts#L30)

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

Defined in: [validation/validators/custom.ts:58](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/custom.ts#L58)

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

Defined in: [validation/validators/custom.ts:64](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/custom.ts#L64)

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

Defined in: [validation/validators/date.ts:29](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/date.ts#L29)

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

Defined in: [validation/validators/max-length.ts:4](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/max-length.ts#L4)

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

Defined in: [validation/validators/min-length.ts:4](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/min-length.ts#L4)

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

Defined in: [validation/validators/number.ts:22](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/number.ts#L22)

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

Defined in: [validation/validators/number.ts:50](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/number.ts#L50)

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

Defined in: [validation/validators/number.ts:69](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/number.ts#L69)

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

Defined in: [validation/validators/password.ts:11](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/password.ts#L11)

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

Defined in: [validation/validators/phone.ts:5](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/phone.ts#L5)

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

Defined in: [validation/validators/regex.ts:4](https://github.com/itsjayoncode/joc/blob/222bc1e85fe34941a50e9bc44ab28cebc013fe3f/packages/form-intelligence/src/validation/validators/regex.ts#L4)

#### Parameters

| Parameter | Type     | Default value       |
| --------- | -------- | ------------------- |
| `pattern` | `RegExp` | `undefined`         |
| `message` | `string` | `"Invalid format."` |

#### Returns

[`Validator`](#validator)
