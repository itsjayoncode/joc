**@jayoncode/browser-lifecycle API**

---

# @jayoncode/browser-lifecycle API

## Classes

### BrowserLifecycleError

Defined in: errors/index.ts:14

Base error for all public Browser Lifecycle infrastructure failures.

#### Extends

- `Error`

#### Extended by

- [`ConfigurationError`](#configurationerror)
- [`InitializationError`](#initializationerror)
- [`LifecycleError`](#lifecycleerror)
- [`ModuleRegistryError`](#moduleregistryerror)
- [`PluginError`](#pluginerror-1)
- [`UnsupportedFeatureError`](#unsupportedfeatureerror)

#### Constructors

##### Constructor

```ts
new BrowserLifecycleError(
   message: string,
   code: BrowserLifecycleErrorCode,
   options: BrowserLifecycleErrorOptions): BrowserLifecycleError;
```

Defined in: errors/index.ts:18

###### Parameters

| Parameter | Type                                                        |
| --------- | ----------------------------------------------------------- |
| `message` | `string`                                                    |
| `code`    | [`BrowserLifecycleErrorCode`](#browserlifecycleerrorcode-1) |
| `options` | `BrowserLifecycleErrorOptions`                              |

###### Returns

[`BrowserLifecycleError`](#browserlifecycleerror)

###### Overrides

```ts
Error.constructor;
```

#### Properties

| Property                       | Modifier   | Type                                                        | Defined in         |
| ------------------------------ | ---------- | ----------------------------------------------------------- | ------------------ |
| <a id="code"></a> `code`       | `readonly` | [`BrowserLifecycleErrorCode`](#browserlifecycleerrorcode-1) | errors/index.ts:15 |
| <a id="details"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\>                  | errors/index.ts:16 |

---

### ConfigurationError

Defined in: errors/index.ts:33

Error thrown when configuration input is invalid.

#### Extends

- [`BrowserLifecycleError`](#browserlifecycleerror)

#### Constructors

##### Constructor

```ts
new ConfigurationError(message: string, options: BrowserLifecycleErrorOptions): ConfigurationError;
```

Defined in: errors/index.ts:34

###### Parameters

| Parameter | Type                           |
| --------- | ------------------------------ |
| `message` | `string`                       |
| `options` | `BrowserLifecycleErrorOptions` |

###### Returns

[`ConfigurationError`](#configurationerror)

###### Overrides

[`BrowserLifecycleError`](#browserlifecycleerror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                                        | Inherited from                                                          | Defined in         |
| -------------------------------- | ---------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------ |
| <a id="code-1"></a> `code`       | `readonly` | [`BrowserLifecycleErrorCode`](#browserlifecycleerrorcode-1) | [`BrowserLifecycleError`](#browserlifecycleerror).[`code`](#code)       | errors/index.ts:15 |
| <a id="details-1"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\>                  | [`BrowserLifecycleError`](#browserlifecycleerror).[`details`](#details) | errors/index.ts:16 |

---

### UnsupportedFeatureError

Defined in: errors/index.ts:43

Error thrown when a required feature is unavailable.

#### Extends

- [`BrowserLifecycleError`](#browserlifecycleerror)

#### Constructors

##### Constructor

```ts
new UnsupportedFeatureError(message: string, options: BrowserLifecycleErrorOptions): UnsupportedFeatureError;
```

Defined in: errors/index.ts:44

###### Parameters

| Parameter | Type                           |
| --------- | ------------------------------ |
| `message` | `string`                       |
| `options` | `BrowserLifecycleErrorOptions` |

###### Returns

[`UnsupportedFeatureError`](#unsupportedfeatureerror)

###### Overrides

[`BrowserLifecycleError`](#browserlifecycleerror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                                        | Inherited from                                                          | Defined in         |
| -------------------------------- | ---------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------ |
| <a id="code-2"></a> `code`       | `readonly` | [`BrowserLifecycleErrorCode`](#browserlifecycleerrorcode-1) | [`BrowserLifecycleError`](#browserlifecycleerror).[`code`](#code)       | errors/index.ts:15 |
| <a id="details-2"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\>                  | [`BrowserLifecycleError`](#browserlifecycleerror).[`details`](#details) | errors/index.ts:16 |

---

### InitializationError

Defined in: errors/index.ts:53

Error thrown when the package cannot initialize correctly.

#### Extends

- [`BrowserLifecycleError`](#browserlifecycleerror)

#### Constructors

##### Constructor

```ts
new InitializationError(message: string, options: BrowserLifecycleErrorOptions): InitializationError;
```

Defined in: errors/index.ts:54

###### Parameters

| Parameter | Type                           |
| --------- | ------------------------------ |
| `message` | `string`                       |
| `options` | `BrowserLifecycleErrorOptions` |

###### Returns

[`InitializationError`](#initializationerror)

###### Overrides

[`BrowserLifecycleError`](#browserlifecycleerror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                                        | Inherited from                                                          | Defined in         |
| -------------------------------- | ---------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------ |
| <a id="code-3"></a> `code`       | `readonly` | [`BrowserLifecycleErrorCode`](#browserlifecycleerrorcode-1) | [`BrowserLifecycleError`](#browserlifecycleerror).[`code`](#code)       | errors/index.ts:15 |
| <a id="details-3"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\>                  | [`BrowserLifecycleError`](#browserlifecycleerror).[`details`](#details) | errors/index.ts:16 |

---

### LifecycleError

Defined in: errors/index.ts:63

Error thrown when a lifecycle transition is invalid.

#### Extends

- [`BrowserLifecycleError`](#browserlifecycleerror)

#### Constructors

##### Constructor

```ts
new LifecycleError(message: string, options: BrowserLifecycleErrorOptions): LifecycleError;
```

Defined in: errors/index.ts:64

###### Parameters

| Parameter | Type                           |
| --------- | ------------------------------ |
| `message` | `string`                       |
| `options` | `BrowserLifecycleErrorOptions` |

###### Returns

[`LifecycleError`](#lifecycleerror)

###### Overrides

[`BrowserLifecycleError`](#browserlifecycleerror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                                        | Inherited from                                                          | Defined in         |
| -------------------------------- | ---------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------ |
| <a id="code-4"></a> `code`       | `readonly` | [`BrowserLifecycleErrorCode`](#browserlifecycleerrorcode-1) | [`BrowserLifecycleError`](#browserlifecycleerror).[`code`](#code)       | errors/index.ts:15 |
| <a id="details-4"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\>                  | [`BrowserLifecycleError`](#browserlifecycleerror).[`details`](#details) | errors/index.ts:16 |

---

### ModuleRegistryError

Defined in: errors/index.ts:73

Error thrown when the module registry is used incorrectly.

#### Extends

- [`BrowserLifecycleError`](#browserlifecycleerror)

#### Constructors

##### Constructor

```ts
new ModuleRegistryError(message: string, options: BrowserLifecycleErrorOptions): ModuleRegistryError;
```

Defined in: errors/index.ts:74

###### Parameters

| Parameter | Type                           |
| --------- | ------------------------------ |
| `message` | `string`                       |
| `options` | `BrowserLifecycleErrorOptions` |

###### Returns

[`ModuleRegistryError`](#moduleregistryerror)

###### Overrides

[`BrowserLifecycleError`](#browserlifecycleerror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                                        | Inherited from                                                          | Defined in         |
| -------------------------------- | ---------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------ |
| <a id="code-5"></a> `code`       | `readonly` | [`BrowserLifecycleErrorCode`](#browserlifecycleerrorcode-1) | [`BrowserLifecycleError`](#browserlifecycleerror).[`code`](#code)       | errors/index.ts:15 |
| <a id="details-5"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\>                  | [`BrowserLifecycleError`](#browserlifecycleerror).[`details`](#details) | errors/index.ts:16 |

---

### PluginError

Defined in: errors/index.ts:83

Placeholder plugin error used before the plugin system is implemented.

#### Extends

- [`BrowserLifecycleError`](#browserlifecycleerror)

#### Constructors

##### Constructor

```ts
new PluginError(message: string, options: BrowserLifecycleErrorOptions): PluginError;
```

Defined in: errors/index.ts:84

###### Parameters

| Parameter | Type                           |
| --------- | ------------------------------ |
| `message` | `string`                       |
| `options` | `BrowserLifecycleErrorOptions` |

###### Returns

[`PluginError`](#pluginerror-1)

###### Overrides

[`BrowserLifecycleError`](#browserlifecycleerror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                                        | Inherited from                                                          | Defined in         |
| -------------------------------- | ---------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------ |
| <a id="code-6"></a> `code`       | `readonly` | [`BrowserLifecycleErrorCode`](#browserlifecycleerrorcode-1) | [`BrowserLifecycleError`](#browserlifecycleerror).[`code`](#code)       | errors/index.ts:15 |
| <a id="details-6"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\>                  | [`BrowserLifecycleError`](#browserlifecycleerror).[`details`](#details) | errors/index.ts:16 |

---

### TypedEventEmitter\<TEventMap\>

Defined in: events/typed-event-emitter.ts:24

Generic typed event emitter used by Browser Lifecycle Manager internals.

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| `TEventMap` _extends_ [`EventMap`](#eventmap) |

#### Constructors

##### Constructor

```ts
new TypedEventEmitter<TEventMap>(options: TypedEventEmitterOptions<TEventMap>): TypedEventEmitter<TEventMap>;
```

Defined in: events/typed-event-emitter.ts:30

###### Parameters

| Parameter | Type                                                                   |
| --------- | ---------------------------------------------------------------------- |
| `options` | [`TypedEventEmitterOptions`](#typedeventemitteroptions)\<`TEventMap`\> |

###### Returns

[`TypedEventEmitter`](#typedeventemitter)\<`TEventMap`\>

#### Methods

##### on()

```ts
on<TEventName>(event: TEventName, listener: EventListener<TEventMap, TEventName>): EventSubscription<TEventName>;
```

Defined in: events/typed-event-emitter.ts:43

Registers a persistent listener.

###### Type Parameters

| Type Parameter                  |
| ------------------------------- |
| `TEventName` _extends_ `string` |

###### Parameters

| Parameter  | Type                                                           |
| ---------- | -------------------------------------------------------------- |
| `event`    | `TEventName`                                                   |
| `listener` | [`EventListener`](#eventlistener)\<`TEventMap`, `TEventName`\> |

###### Returns

[`EventSubscription`](#eventsubscription)\<`TEventName`\>

##### off()

```ts
off<TEventName>(event: TEventName, listener: EventListener<TEventMap, TEventName>): void;
```

Defined in: events/typed-event-emitter.ts:54

Removes the first listener matching the provided function reference.

###### Type Parameters

| Type Parameter                  |
| ------------------------------- |
| `TEventName` _extends_ `string` |

###### Parameters

| Parameter  | Type                                                           |
| ---------- | -------------------------------------------------------------- |
| `event`    | `TEventName`                                                   |
| `listener` | [`EventListener`](#eventlistener)\<`TEventMap`, `TEventName`\> |

###### Returns

`void`

##### once()

```ts
once<TEventName>(event: TEventName, listener: EventListener<TEventMap, TEventName>): EventSubscription<TEventName>;
```

Defined in: events/typed-event-emitter.ts:68

Registers a one-time listener.

###### Type Parameters

| Type Parameter                  |
| ------------------------------- |
| `TEventName` _extends_ `string` |

###### Parameters

| Parameter  | Type                                                           |
| ---------- | -------------------------------------------------------------- |
| `event`    | `TEventName`                                                   |
| `listener` | [`EventListener`](#eventlistener)\<`TEventMap`, `TEventName`\> |

###### Returns

[`EventSubscription`](#eventsubscription)\<`TEventName`\>

##### emit()

```ts
emit<TEventName>(
   event: TEventName,
   payload: EventPayload<TEventMap, TEventName>,
options: EmitEventOptions): EventDispatchMetadata<TEventName>;
```

Defined in: events/typed-event-emitter.ts:79

Emits an event synchronously and returns dispatch metadata.

###### Type Parameters

| Type Parameter                  |
| ------------------------------- |
| `TEventName` _extends_ `string` |

###### Parameters

| Parameter | Type                                                         |
| --------- | ------------------------------------------------------------ |
| `event`   | `TEventName`                                                 |
| `payload` | [`EventPayload`](#eventpayload)\<`TEventMap`, `TEventName`\> |
| `options` | [`EmitEventOptions`](#emiteventoptions)                      |

###### Returns

[`EventDispatchMetadata`](#eventdispatchmetadata)\<`TEventName`\>

##### listeners()

```ts
listeners<TEventName>(event: TEventName): readonly EventListener<TEventMap, TEventName>[];
```

Defined in: events/typed-event-emitter.ts:91

Returns the active listeners for one event in registration order.

###### Type Parameters

| Type Parameter                  |
| ------------------------------- |
| `TEventName` _extends_ `string` |

###### Parameters

| Parameter | Type         |
| --------- | ------------ |
| `event`   | `TEventName` |

###### Returns

readonly [`EventListener`](#eventlistener)\<`TEventMap`, `TEventName`\>[]

##### listenerCount()

```ts
listenerCount(event?: EventName<TEventMap>): number;
```

Defined in: events/typed-event-emitter.ts:104

Returns the active listener count for one event or for the full emitter.

###### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `event?`  | [`EventName`](#eventname)\<`TEventMap`\> |

###### Returns

`number`

##### hasListeners()

```ts
hasListeners(event?: EventName<TEventMap>): boolean;
```

Defined in: events/typed-event-emitter.ts:115

Returns true when listeners exist for one event or for the entire emitter.

###### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `event?`  | [`EventName`](#eventname)\<`TEventMap`\> |

###### Returns

`boolean`

##### removeAll()

```ts
removeAll(event?: EventName<TEventMap>): void;
```

Defined in: events/typed-event-emitter.ts:126

Removes all listeners for one event or for the entire emitter.

###### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `event?`  | [`EventName`](#eventname)\<`TEventMap`\> |

###### Returns

`void`

##### destroy()

```ts
destroy(): void;
```

Defined in: events/typed-event-emitter.ts:137

Destroys the emitter and clears all listeners.

###### Returns

`void`

##### definitions()

```ts
definitions(): readonly EventDefinition<EventName<TEventMap>>[];
```

Defined in: events/typed-event-emitter.ts:149

Returns the registered definitions for diagnostics and tests.

###### Returns

readonly [`EventDefinition`](#eventdefinition)\<[`EventName`](#eventname)\<`TEventMap`\>\>[]

##### stats()

```ts
stats<TEventName>(event: TEventName): EventRegistryStats<TEventName>;
```

Defined in: events/typed-event-emitter.ts:156

Returns dispatch statistics for one event.

###### Type Parameters

| Type Parameter                  |
| ------------------------------- |
| `TEventName` _extends_ `string` |

###### Parameters

| Parameter | Type         |
| --------- | ------------ |
| `event`   | `TEventName` |

###### Returns

[`EventRegistryStats`](#eventregistrystats)\<`TEventName`\>

## Interfaces

### PageVisibleEventMetadata

Defined in: core/session/types.ts:68

Metadata carried by page:visible events.

#### Extends

- `PlainObject`

#### Extended by

- [`PageHiddenEventMetadata`](#pagehiddeneventmetadata)

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

| Property                     | Modifier   | Type                                | Defined in               |
| ---------------------------- | ---------- | ----------------------------------- | ------------------------ |
| <a id="reason"></a> `reason` | `readonly` | `"initial"` \| `"visibilitychange"` | core/session/types.ts:69 |

---

### PageHiddenEventMetadata

Defined in: core/session/types.ts:75

Metadata carried by page:hidden events.

#### Extends

- [`PageVisibleEventMetadata`](#pagevisibleeventmetadata)

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

| Property                                         | Modifier   | Type                                | Inherited from                                                              | Defined in               |
| ------------------------------------------------ | ---------- | ----------------------------------- | --------------------------------------------------------------------------- | ------------------------ |
| <a id="reason-1"></a> `reason`                   | `readonly` | `"initial"` \| `"visibilitychange"` | [`PageVisibleEventMetadata`](#pagevisibleeventmetadata).[`reason`](#reason) | core/session/types.ts:69 |
| <a id="likelylastsignal"></a> `likelyLastSignal` | `readonly` | `boolean`                           | -                                                                           | core/session/types.ts:76 |

---

### BrowserLifecycleTimestamps

Defined in: core/session/types.ts:82

Timestamp metadata exposed in snapshot reads.

#### Properties

| Property                                | Modifier   | Type     | Defined in               |
| --------------------------------------- | ---------- | -------- | ------------------------ |
| <a id="createdat"></a> `createdAt`      | `readonly` | `number` | core/session/types.ts:83 |
| <a id="disposedat"></a> `disposedAt?`   | `readonly` | `number` | core/session/types.ts:84 |
| <a id="lasteventat"></a> `lastEventAt?` | `readonly` | `number` | core/session/types.ts:85 |
| <a id="startedat"></a> `startedAt?`     | `readonly` | `number` | core/session/types.ts:86 |
| <a id="stoppedat"></a> `stoppedAt?`     | `readonly` | `number` | core/session/types.ts:87 |
| <a id="updatedat"></a> `updatedAt`      | `readonly` | `number` | core/session/types.ts:88 |

---

### BrowserLifecycleSnapshot

Defined in: core/session/types.ts:94

Public snapshot shape returned by the Session Core.

#### Properties

| Property                                 | Modifier   | Type                                                                      | Defined in                |
| ---------------------------------------- | ---------- | ------------------------------------------------------------------------- | ------------------------- |
| <a id="activity"></a> `activity`         | `readonly` | [`BrowserLifecycleActivityState`](#browserlifecycleactivitystate)         | core/session/types.ts:95  |
| <a id="attention"></a> `attention`       | `readonly` | [`BrowserLifecycleAttentionState`](#browserlifecycleattentionstate)       | core/session/types.ts:96  |
| <a id="capabilities"></a> `capabilities` | `readonly` | [`BrowserLifecycleCapabilities`](#browserlifecyclecapabilities)           | core/session/types.ts:97  |
| <a id="connectivity"></a> `connectivity` | `readonly` | [`BrowserLifecycleConnectivityState`](#browserlifecycleconnectivitystate) | core/session/types.ts:98  |
| <a id="lifecycle"></a> `lifecycle`       | `readonly` | [`BrowserLifecyclePageState`](#browserlifecyclepagestate)                 | core/session/types.ts:99  |
| <a id="phase"></a> `phase`               | `readonly` | [`BrowserLifecyclePhase`](#browserlifecyclephase)                         | core/session/types.ts:100 |
| <a id="tab"></a> `tab`                   | `readonly` | [`BrowserLifecycleTabState`](#browserlifecycletabstate)                   | core/session/types.ts:101 |
| <a id="timestamps"></a> `timestamps`     | `readonly` | [`BrowserLifecycleTimestamps`](#browserlifecycletimestamps)               | core/session/types.ts:102 |
| <a id="visibility"></a> `visibility`     | `readonly` | `BrowserLifecycleVisibilityState`                                         | core/session/types.ts:103 |

---

### BrowserLifecycleEvent\<TType, TCurrent, TPrevious, TMetadata\>

Defined in: core/session/types.ts:136

Shared event payload contract for normalized public events.

#### Type Parameters

| Type Parameter                                                              | Default type                 |
| --------------------------------------------------------------------------- | ---------------------------- |
| `TType` _extends_ [`BrowserLifecycleEventName`](#browserlifecycleeventname) | -                            |
| `TCurrent`                                                                  | -                            |
| `TPrevious`                                                                 | -                            |
| `TMetadata` _extends_ `PlainObject` \| `undefined`                          | `PlainObject` \| `undefined` |

#### Properties

| Property                           | Modifier   | Type                                                          | Defined in                |
| ---------------------------------- | ---------- | ------------------------------------------------------------- | ------------------------- |
| <a id="current"></a> `current`     | `readonly` | `TCurrent`                                                    | core/session/types.ts:142 |
| <a id="metadata"></a> `metadata`   | `readonly` | `TMetadata`                                                   | core/session/types.ts:143 |
| <a id="previous"></a> `previous`   | `readonly` | `TPrevious`                                                   | core/session/types.ts:144 |
| <a id="snapshot"></a> `snapshot`   | `readonly` | [`BrowserLifecycleSnapshot`](#browserlifecyclesnapshot)       | core/session/types.ts:145 |
| <a id="source"></a> `source`       | `readonly` | [`BrowserLifecycleEventSource`](#browserlifecycleeventsource) | core/session/types.ts:146 |
| <a id="timestamp"></a> `timestamp` | `readonly` | `number`                                                      | core/session/types.ts:147 |
| <a id="type"></a> `type`           | `readonly` | `TType`                                                       | core/session/types.ts:148 |

---

### BrowserLifecycleEventMap

Defined in: core/session/types.ts:154

Public event payload map used by the Session Core event API.

#### Properties

| Property                                                | Modifier   | Type                                                                                                                                                                                                                                                    | Defined in                |
| ------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| <a id="activitydetected"></a> `activity:detected`       | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"activity:detected"`, `"active"`, [`BrowserLifecycleActivityState`](#browserlifecycleactivitystate), \| `undefined` \| \{ `activitySource`: `string`; \}\>                                          | core/session/types.ts:155 |
| <a id="activityreset"></a> `activity:reset`             | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"activity:reset"`, `"active"`, [`BrowserLifecycleActivityState`](#browserlifecycleactivitystate), \| `undefined` \| \{ `activitySource`: `string`; \}\>                                             | core/session/types.ts:161 |
| <a id="connectionoffline"></a> `connection:offline`     | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"connection:offline"`, `"offline"`, [`BrowserLifecycleConnectivityState`](#browserlifecycleconnectivitystate), \| `undefined` \| \{ `advisory`: `true`; `reason?`: `"offline"` \| `"initial"`; \}\> | core/session/types.ts:167 |
| <a id="connectiononline"></a> `connection:online`       | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"connection:online"`, `"online"`, [`BrowserLifecycleConnectivityState`](#browserlifecycleconnectivitystate), \| `undefined` \| \{ `advisory`: `true`; `reason?`: `"online"` \| `"initial"`; \}\>    | core/session/types.ts:173 |
| <a id="connectionreconnect"></a> `connection:reconnect` | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"connection:reconnect"`, `"online"`, `"offline"`, \| `undefined` \| \{ `advisory`: `true`; `offlineDuration`: `number`; \}\>                                                                        | core/session/types.ts:179 |
| <a id="pagehidden"></a> `page:hidden`                   | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"page:hidden"`, `"hidden"`, `BrowserLifecycleVisibilityState`, [`PageHiddenEventMetadata`](#pagehiddeneventmetadata)\>                                                                              | core/session/types.ts:185 |
| <a id="pageresume"></a> `page:resume`                   | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"page:resume"`, `"active"`, [`BrowserLifecyclePageState`](#browserlifecyclepagestate)\>                                                                                                             | core/session/types.ts:191 |
| <a id="pagesuspend"></a> `page:suspend`                 | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"page:suspend"`, `"hidden"` \| `"frozen"` \| `"terminated"`, [`BrowserLifecyclePageState`](#browserlifecyclepagestate)\>                                                                            | core/session/types.ts:192 |
| <a id="pagevisible"></a> `page:visible`                 | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"page:visible"`, `"visible"`, `BrowserLifecycleVisibilityState`, [`PageVisibleEventMetadata`](#pagevisibleeventmetadata)\>                                                                          | core/session/types.ts:197 |
| <a id="pluginerror"></a> `plugin:error`                 | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"plugin:error"`, `"error"`, `undefined` \| `"registered"` \| `"ready"`, \| `undefined` \| \{ `hook?`: `string`; `pluginId`: `string`; \}\>                                                          | core/session/types.ts:203 |
| <a id="pluginregistered"></a> `plugin:registered`       | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"plugin:registered"`, `"registered"`, `undefined`, \| `undefined` \| \{ `pluginId`: `string`; \}\>                                                                                                  | core/session/types.ts:209 |
| <a id="pluginremoved"></a> `plugin:removed`             | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"plugin:removed"`, `"removed"`, `undefined` \| `"registered"`, \| `undefined` \| \{ `pluginId`: `string`; `reason?`: `string`; \}\>                                                                 | core/session/types.ts:215 |
| <a id="sessionactive"></a> `session:active`             | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"session:active"`, `"active"`, [`BrowserLifecycleActivityState`](#browserlifecycleactivitystate), \| `undefined` \| \{ `activitySource`: `string`; `idleDuration?`: `number`; \}\>                  | core/session/types.ts:221 |
| <a id="sessionidle"></a> `session:idle`                 | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"session:idle"`, `"idle"`, [`BrowserLifecycleActivityState`](#browserlifecycleactivitystate), \| `undefined` \| \{ `idleTimeout`: `number`; `lastActivityAt`: `number`; \}\>                        | core/session/types.ts:231 |
| <a id="sessionrestored"></a> `session:restored`         | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"session:restored"`, `"running"` \| `"stopped"`, [`BrowserLifecyclePhase`](#browserlifecyclephase)\>                                                                                                | core/session/types.ts:241 |
| <a id="sessionstarted"></a> `session:started`           | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"session:started"`, `"running"`, [`BrowserLifecyclePhase`](#browserlifecyclephase), \| `undefined` \| \{ `autoStart`: `boolean`; \}\>                                                               | core/session/types.ts:246 |
| <a id="sessionstopped"></a> `session:stopped`           | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"session:stopped"`, `"stopped"`, [`BrowserLifecyclePhase`](#browserlifecyclephase), \| `undefined` \| \{ `reason`: `"dispose"` \| `"manual-stop"`; \}\>                                             | core/session/types.ts:252 |
| <a id="tabprimary"></a> `tab:primary`                   | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"tab:primary"`, `"primary"`, [`BrowserLifecycleTabState`](#browserlifecycletabstate), \| `undefined` \| \{ `reason?`: `string`; `tabId?`: `string`; `transport?`: `string`; \}\>                    | core/session/types.ts:258 |
| <a id="tabsecondary"></a> `tab:secondary`               | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"tab:secondary"`, `"secondary"`, [`BrowserLifecycleTabState`](#browserlifecycletabstate), \| `undefined` \| \{ `reason?`: `string`; `tabId?`: `string`; `transport?`: `string`; \}\>                | core/session/types.ts:264 |
| <a id="tabmessage"></a> `tab:message`                   | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"tab:message"`, `"message"`, `undefined`, \| `undefined` \| \{ `messageType`: `string`; `senderId`: `string`; `value?`: `string`; \}\>                                                              | core/session/types.ts:270 |
| <a id="windowblur"></a> `window:blur`                   | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"window:blur"`, `"unfocused"`, [`BrowserLifecycleAttentionState`](#browserlifecycleattentionstate)\>                                                                                                | core/session/types.ts:281 |
| <a id="windowfocus"></a> `window:focus`                 | `readonly` | [`BrowserLifecycleEvent`](#browserlifecycleevent)\<`"window:focus"`, `"focused"`, [`BrowserLifecycleAttentionState`](#browserlifecycleattentionstate)\>                                                                                                 | core/session/types.ts:286 |

---

### BrowserLifecycle

Defined in: core/session/types.ts:311

Public BrowserLifecycle runtime contract.

#### Methods

##### dispose()

```ts
dispose(): void;
```

Defined in: core/session/types.ts:312

###### Returns

`void`

##### getCapabilities()

```ts
getCapabilities(): Readonly<BrowserLifecycleCapabilities>;
```

Defined in: core/session/types.ts:313

###### Returns

`Readonly`\<[`BrowserLifecycleCapabilities`](#browserlifecyclecapabilities)\>

##### getPluginHookLog()

```ts
getPluginHookLog(): readonly BrowserLifecyclePluginHookLogEntry[];
```

Defined in: core/session/types.ts:314

###### Returns

readonly [`BrowserLifecyclePluginHookLogEntry`](#browserlifecyclepluginhooklogentry)[]

##### getPlugins()

```ts
getPlugins(): readonly BrowserLifecyclePluginDiagnostic[];
```

Defined in: core/session/types.ts:315

###### Returns

readonly [`BrowserLifecyclePluginDiagnostic`](#browserlifecycleplugindiagnostic)[]

##### getRuntimeDiagnostics()

```ts
getRuntimeDiagnostics(): BrowserLifecycleRuntimeDiagnostics;
```

Defined in: core/session/types.ts:316

###### Returns

[`BrowserLifecycleRuntimeDiagnostics`](#browserlifecycleruntimediagnostics)

##### getSnapshot()

```ts
getSnapshot(): Readonly<BrowserLifecycleSnapshot>;
```

Defined in: core/session/types.ts:317

###### Returns

`Readonly`\<[`BrowserLifecycleSnapshot`](#browserlifecyclesnapshot)\>

##### isRunning()

```ts
isRunning(): boolean;
```

Defined in: core/session/types.ts:318

###### Returns

`boolean`

##### off()

```ts
off<TEventName>(event: TEventName, listener: BrowserLifecycleEventListener<TEventName>): void;
```

Defined in: core/session/types.ts:319

###### Type Parameters

| Type Parameter                                                                   |
| -------------------------------------------------------------------------------- |
| `TEventName` _extends_ [`BrowserLifecycleEventName`](#browserlifecycleeventname) |

###### Parameters

| Parameter  | Type                                                                              |
| ---------- | --------------------------------------------------------------------------------- |
| `event`    | `TEventName`                                                                      |
| `listener` | [`BrowserLifecycleEventListener`](#browserlifecycleeventlistener)\<`TEventName`\> |

###### Returns

`void`

##### on()

```ts
on<TEventName>(event: TEventName, listener: BrowserLifecycleEventListener<TEventName>): () => void;
```

Defined in: core/session/types.ts:323

###### Type Parameters

| Type Parameter                                                                   |
| -------------------------------------------------------------------------------- |
| `TEventName` _extends_ [`BrowserLifecycleEventName`](#browserlifecycleeventname) |

###### Parameters

| Parameter  | Type                                                                              |
| ---------- | --------------------------------------------------------------------------------- |
| `event`    | `TEventName`                                                                      |
| `listener` | [`BrowserLifecycleEventListener`](#browserlifecycleeventlistener)\<`TEventName`\> |

###### Returns

```ts
(): void;
```

###### Returns

`void`

##### once()

```ts
once<TEventName>(event: TEventName, listener: BrowserLifecycleEventListener<TEventName>): () => void;
```

Defined in: core/session/types.ts:327

###### Type Parameters

| Type Parameter                                                                   |
| -------------------------------------------------------------------------------- |
| `TEventName` _extends_ [`BrowserLifecycleEventName`](#browserlifecycleeventname) |

###### Parameters

| Parameter  | Type                                                                              |
| ---------- | --------------------------------------------------------------------------------- |
| `event`    | `TEventName`                                                                      |
| `listener` | [`BrowserLifecycleEventListener`](#browserlifecycleeventlistener)\<`TEventName`\> |

###### Returns

```ts
(): void;
```

###### Returns

`void`

##### setPluginEnabled()

```ts
setPluginEnabled(pluginId: string, enabled: boolean): void;
```

Defined in: core/session/types.ts:331

###### Parameters

| Parameter  | Type      |
| ---------- | --------- |
| `pluginId` | `string`  |
| `enabled`  | `boolean` |

###### Returns

`void`

##### start()

```ts
start(): void;
```

Defined in: core/session/types.ts:332

###### Returns

`void`

##### stop()

```ts
stop(): void;
```

Defined in: core/session/types.ts:333

###### Returns

`void`

##### subscribe()

```ts
subscribe(listener: BrowserLifecycleSubscriber): () => void;
```

Defined in: core/session/types.ts:334

###### Parameters

| Parameter  | Type                                                        |
| ---------- | ----------------------------------------------------------- |
| `listener` | [`BrowserLifecycleSubscriber`](#browserlifecyclesubscriber) |

###### Returns

```ts
(): void;
```

###### Returns

`void`

##### use()

```ts
use(plugin: BrowserLifecyclePlugin): void;
```

Defined in: core/session/types.ts:335

###### Parameters

| Parameter | Type                                                |
| --------- | --------------------------------------------------- |
| `plugin`  | [`BrowserLifecyclePlugin`](#browserlifecycleplugin) |

###### Returns

`void`

---

### BrowserLifecycleEventStat

Defined in: diagnostics/types.ts:7

Per-event dispatch statistics exposed for diagnostics tooling.

#### Properties

| Property                                          | Modifier   | Type                                                      | Defined in              |
| ------------------------------------------------- | ---------- | --------------------------------------------------------- | ----------------------- |
| <a id="emissioncount"></a> `emissionCount`        | `readonly` | `number`                                                  | diagnostics/types.ts:8  |
| <a id="errorcount"></a> `errorCount`              | `readonly` | `number`                                                  | diagnostics/types.ts:9  |
| <a id="event"></a> `event`                        | `readonly` | [`BrowserLifecycleEventName`](#browserlifecycleeventname) | diagnostics/types.ts:10 |
| <a id="lastdispatchedat"></a> `lastDispatchedAt?` | `readonly` | `number`                                                  | diagnostics/types.ts:11 |
| <a id="listenercount"></a> `listenerCount`        | `readonly` | `number`                                                  | diagnostics/types.ts:12 |

---

### BrowserLifecycleRuntimeDiagnostics

Defined in: diagnostics/types.ts:18

Runtime diagnostics snapshot for performance and developer tooling.

#### Properties

| Property                                             | Modifier   | Type                                                                          | Defined in              |
| ---------------------------------------------------- | ---------- | ----------------------------------------------------------------------------- | ----------------------- |
| <a id="capabilities-1"></a> `capabilities`           | `readonly` | `Readonly`\<[`BrowserLifecycleCapabilities`](#browserlifecyclecapabilities)\> | diagnostics/types.ts:19 |
| <a id="debug"></a> `debug`                           | `readonly` | `boolean`                                                                     | diagnostics/types.ts:20 |
| <a id="eventbuffersize"></a> `eventBufferSize`       | `readonly` | `number`                                                                      | diagnostics/types.ts:21 |
| <a id="eventstats"></a> `eventStats`                 | `readonly` | readonly [`BrowserLifecycleEventStat`](#browserlifecycleeventstat)[]          | diagnostics/types.ts:22 |
| <a id="isrunning-2"></a> `isRunning`                 | `readonly` | `boolean`                                                                     | diagnostics/types.ts:23 |
| <a id="modulecount"></a> `moduleCount`               | `readonly` | `number`                                                                      | diagnostics/types.ts:24 |
| <a id="phase-1"></a> `phase`                         | `readonly` | [`BrowserLifecyclePhase`](#browserlifecyclephase)                             | diagnostics/types.ts:25 |
| <a id="plugincount"></a> `pluginCount`               | `readonly` | `number`                                                                      | diagnostics/types.ts:26 |
| <a id="subscribercount"></a> `subscriberCount`       | `readonly` | `number`                                                                      | diagnostics/types.ts:27 |
| <a id="totalemissioncount"></a> `totalEmissionCount` | `readonly` | `number`                                                                      | diagnostics/types.ts:28 |
| <a id="totallistenercount"></a> `totalListenerCount` | `readonly` | `number`                                                                      | diagnostics/types.ts:29 |

---

### EventDefinition\<TEventName\>

Defined in: events/types.ts:28

Event definition metadata stored by the internal registry.

#### Type Parameters

| Type Parameter                  | Default type |
| ------------------------------- | ------------ |
| `TEventName` _extends_ `string` | `string`     |

#### Properties

| Property                                  | Modifier   | Type         | Defined in         |
| ----------------------------------------- | ---------- | ------------ | ------------------ |
| <a id="description"></a> `description?`   | `readonly` | `string`     | events/types.ts:29 |
| <a id="experimental"></a> `experimental?` | `readonly` | `boolean`    | events/types.ts:30 |
| <a id="internal"></a> `internal?`         | `readonly` | `boolean`    | events/types.ts:31 |
| <a id="name"></a> `name`                  | `readonly` | `TEventName` | events/types.ts:32 |
| <a id="public"></a> `public?`             | `readonly` | `boolean`    | events/types.ts:33 |

---

### EventDispatchMetadata\<TEventName\>

Defined in: events/types.ts:39

Dispatch metadata created for each emission.

#### Type Parameters

| Type Parameter                  | Default type |
| ------------------------------- | ------------ |
| `TEventName` _extends_ `string` | `string`     |

#### Properties

| Property                                     | Modifier   | Type                                                         | Defined in         |
| -------------------------------------------- | ---------- | ------------------------------------------------------------ | ------------------ |
| <a id="dispatchid"></a> `dispatchId`         | `readonly` | `number`                                                     | events/types.ts:40 |
| <a id="internal-1"></a> `internal`           | `readonly` | `undefined` \| `Readonly`\<`Record`\<`string`, `unknown`\>\> | events/types.ts:41 |
| <a id="listenercount-3"></a> `listenerCount` | `readonly` | `number`                                                     | events/types.ts:42 |
| <a id="source-1"></a> `source`               | `readonly` | `string`                                                     | events/types.ts:43 |
| <a id="timestamp-1"></a> `timestamp`         | `readonly` | `number`                                                     | events/types.ts:44 |
| <a id="type-1"></a> `type`                   | `readonly` | `TEventName`                                                 | events/types.ts:45 |

---

### EventSubscription\<TEventName\>

Defined in: events/types.ts:59

Cleanup handle returned by subscription methods.

#### Type Parameters

| Type Parameter                  | Default type |
| ------------------------------- | ------------ |
| `TEventName` _extends_ `string` | `string`     |

#### Properties

| Property                     | Modifier   | Type         | Defined in         |
| ---------------------------- | ---------- | ------------ | ------------------ |
| <a id="active"></a> `active` | `readonly` | `boolean`    | events/types.ts:60 |
| <a id="event-1"></a> `event` | `readonly` | `TEventName` | events/types.ts:61 |

#### Methods

##### unsubscribe()

```ts
unsubscribe(): void;
```

Defined in: events/types.ts:62

###### Returns

`void`

---

### EventDispatchContext\<TEventMap, TEventName\>

Defined in: events/types.ts:68

Internal dispatch context passed to error handlers.

#### Type Parameters

| Type Parameter                                                  |
| --------------------------------------------------------------- |
| `TEventMap` _extends_ [`EventMap`](#eventmap)                   |
| `TEventName` _extends_ [`EventName`](#eventname)\<`TEventMap`\> |

#### Properties

| Property                           | Modifier   | Type                                                              | Defined in         |
| ---------------------------------- | ---------- | ----------------------------------------------------------------- | ------------------ |
| <a id="metadata-1"></a> `metadata` | `readonly` | [`EventDispatchMetadata`](#eventdispatchmetadata)\<`TEventName`\> | events/types.ts:72 |
| <a id="payload"></a> `payload`     | `readonly` | [`EventPayload`](#eventpayload)\<`TEventMap`, `TEventName`\>      | events/types.ts:73 |

---

### EmitEventOptions

Defined in: events/types.ts:87

Public emit options for metadata creation.

#### Properties

| Property                            | Modifier   | Type                                          | Defined in         |
| ----------------------------------- | ---------- | --------------------------------------------- | ------------------ |
| <a id="internal-2"></a> `internal?` | `readonly` | `Readonly`\<`Record`\<`string`, `unknown`\>\> | events/types.ts:88 |
| <a id="source-2"></a> `source?`     | `readonly` | `string`                                      | events/types.ts:89 |

---

### EventRegistryStats\<TEventName\>

Defined in: events/types.ts:95

Statistics tracked by the internal event registry.

#### Type Parameters

| Type Parameter                  | Default type |
| ------------------------------- | ------------ |
| `TEventName` _extends_ `string` | `string`     |

#### Properties

| Property                                             | Modifier   | Type                                                                 | Defined in          |
| ---------------------------------------------------- | ---------- | -------------------------------------------------------------------- | ------------------- |
| <a id="definition"></a> `definition`                 | `readonly` | `undefined` \| [`EventDefinition`](#eventdefinition)\<`TEventName`\> | events/types.ts:96  |
| <a id="emissioncount-1"></a> `emissionCount`         | `readonly` | `number`                                                             | events/types.ts:97  |
| <a id="errorcount-1"></a> `errorCount`               | `readonly` | `number`                                                             | events/types.ts:98  |
| <a id="lastdispatchedat-1"></a> `lastDispatchedAt`   | `readonly` | `undefined` \| `number`                                              | events/types.ts:99  |
| <a id="lastdispatchsource"></a> `lastDispatchSource` | `readonly` | `undefined` \| `string`                                              | events/types.ts:100 |
| <a id="listenercount-4"></a> `listenerCount`         | `readonly` | `number`                                                             | events/types.ts:101 |

---

### TypedEventEmitterOptions\<TEventMap\>

Defined in: events/types.ts:107

Constructor options for the typed event emitter.

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| `TEventMap` _extends_ [`EventMap`](#eventmap) |

#### Properties

| Property                                        | Modifier   | Type                                                                                         | Defined in          |
| ----------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- | ------------------- |
| <a id="definitions-2"></a> `definitions?`       | `readonly` | readonly [`EventDefinition`](#eventdefinition)\<`Extract`\<keyof `TEventMap`, `string`\>\>[] | events/types.ts:108 |
| <a id="onlistenererror"></a> `onListenerError?` | `readonly` | [`EventListenerErrorHandler`](#eventlistenererrorhandler)\<`TEventMap`\>                     | events/types.ts:109 |
| <a id="timeprovider"></a> `timeProvider?`       | `readonly` | () => `number`                                                                               | events/types.ts:110 |

---

### BrowserLifecyclePluginLifecycleTransition

Defined in: plugins/types.ts:27

Recorded plugin lifecycle transition for diagnostics.

#### Properties

| Property                              | Modifier   | Type                                                                            | Defined in          |
| ------------------------------------- | ---------- | ------------------------------------------------------------------------------- | ------------------- |
| <a id="durationms"></a> `durationMs?` | `readonly` | `number`                                                                        | plugins/types.ts:28 |
| <a id="from"></a> `from`              | `readonly` | \| `undefined` \| [`BrowserLifecyclePluginPhase`](#browserlifecyclepluginphase) | plugins/types.ts:29 |
| <a id="timestamp-2"></a> `timestamp`  | `readonly` | `number`                                                                        | plugins/types.ts:30 |
| <a id="to"></a> `to`                  | `readonly` | [`BrowserLifecyclePluginPhase`](#browserlifecyclepluginphase)                   | plugins/types.ts:31 |

---

### BrowserLifecyclePluginDiagnostic

Defined in: plugins/types.ts:37

Diagnostic snapshot for one registered plugin.

#### Properties

| Property                                            | Modifier   | Type                                                                                                 | Defined in          |
| --------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------- | ------------------- |
| <a id="author"></a> `author?`                       | `readonly` | `string`                                                                                             | plugins/types.ts:38 |
| <a id="dependencies"></a> `dependencies`            | `readonly` | readonly `string`[]                                                                                  | plugins/types.ts:39 |
| <a id="description-1"></a> `description?`           | `readonly` | `string`                                                                                             | plugins/types.ts:40 |
| <a id="enabled"></a> `enabled`                      | `readonly` | `boolean`                                                                                            | plugins/types.ts:41 |
| <a id="hookcount"></a> `hookCount`                  | `readonly` | `number`                                                                                             | plugins/types.ts:42 |
| <a id="id"></a> `id`                                | `readonly` | `string`                                                                                             | plugins/types.ts:43 |
| <a id="lifecycle-1"></a> `lifecycle`                | `readonly` | [`BrowserLifecyclePluginPhase`](#browserlifecyclepluginphase)                                        | plugins/types.ts:44 |
| <a id="loadedat"></a> `loadedAt?`                   | `readonly` | `number`                                                                                             | plugins/types.ts:45 |
| <a id="name-1"></a> `name?`                         | `readonly` | `string`                                                                                             | plugins/types.ts:46 |
| <a id="previouslifecycle"></a> `previousLifecycle?` | `readonly` | [`BrowserLifecyclePluginPhase`](#browserlifecyclepluginphase)                                        | plugins/types.ts:47 |
| <a id="priority"></a> `priority`                    | `readonly` | `number`                                                                                             | plugins/types.ts:48 |
| <a id="registeredat"></a> `registeredAt`            | `readonly` | `number`                                                                                             | plugins/types.ts:49 |
| <a id="registrationorder"></a> `registrationOrder`  | `readonly` | `number`                                                                                             | plugins/types.ts:50 |
| <a id="transitioncount"></a> `transitionCount`      | `readonly` | `number`                                                                                             | plugins/types.ts:51 |
| <a id="transitions"></a> `transitions`              | `readonly` | readonly [`BrowserLifecyclePluginLifecycleTransition`](#browserlifecyclepluginlifecycletransition)[] | plugins/types.ts:52 |
| <a id="version"></a> `version?`                     | `readonly` | `string`                                                                                             | plugins/types.ts:53 |

---

### BrowserLifecyclePluginHookLogEntry

Defined in: plugins/types.ts:59

Recorded plugin hook execution for debugging and playground tooling.

#### Properties

| Property                               | Modifier   | Type                                                                | Defined in          |
| -------------------------------------- | ---------- | ------------------------------------------------------------------- | ------------------- |
| <a id="durationms-1"></a> `durationMs` | `readonly` | `number`                                                            | plugins/types.ts:60 |
| <a id="eventtype"></a> `eventType?`    | `readonly` | [`BrowserLifecycleEventName`](#browserlifecycleeventname)           | plugins/types.ts:61 |
| <a id="hook"></a> `hook`               | `readonly` | [`BrowserLifecyclePluginHookName`](#browserlifecyclepluginhookname) | plugins/types.ts:62 |
| <a id="id-1"></a> `id`                 | `readonly` | `string`                                                            | plugins/types.ts:63 |
| <a id="pluginid"></a> `pluginId`       | `readonly` | `string`                                                            | plugins/types.ts:64 |
| <a id="source-3"></a> `source`         | `readonly` | `"plugin-runtime"`                                                  | plugins/types.ts:65 |
| <a id="timestamp-3"></a> `timestamp`   | `readonly` | `number`                                                            | plugins/types.ts:66 |

---

### BrowserFeatureEnvironment

Defined in: types/index.ts:42

Minimal feature-detection environment used to keep capability checks SSR-safe and testable.

#### Properties

| Property                                                | Modifier   | Type                                                                                                                      | Defined in        |
| ------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| <a id="abortcontroller"></a> `AbortController?`         | `readonly` | `unknown`                                                                                                                 | types/index.ts:43 |
| <a id="broadcastchannel"></a> `BroadcastChannel?`       | `readonly` | `unknown`                                                                                                                 | types/index.ts:44 |
| <a id="document"></a> `document?`                       | `readonly` | `Record`\<`string`, `unknown`\> & \{ `hasFocus?`: () => `boolean`; `hidden?`: `boolean`; `visibilityState?`: `string`; \} | types/index.ts:45 |
| <a id="navigator"></a> `navigator?`                     | `readonly` | `Record`\<`string`, `unknown`\> & \{ `onLine?`: `boolean`; \}                                                             | types/index.ts:52 |
| <a id="requestidlecallback"></a> `requestIdleCallback?` | `readonly` | `unknown`                                                                                                                 | types/index.ts:57 |
| <a id="window"></a> `window?`                           | `readonly` | `Record`\<`string`, `unknown`\> & \{ `addEventListener?`: `void`; `removeEventListener?`: `void`; \}                      | types/index.ts:58 |

---

### BrowserLifecycleCapabilities

Defined in: types/index.ts:75

Public capability snapshot returned by infrastructure feature detection.

#### Properties

| Property                                                 | Modifier   | Type      | Defined in        |
| -------------------------------------------------------- | ---------- | --------- | ----------------- |
| <a id="abortcontroller-1"></a> `abortController`         | `readonly` | `boolean` | types/index.ts:76 |
| <a id="broadcastchannel-1"></a> `broadcastChannel`       | `readonly` | `boolean` | types/index.ts:77 |
| <a id="connectivity-1"></a> `connectivity`               | `readonly` | `boolean` | types/index.ts:78 |
| <a id="focus"></a> `focus`                               | `readonly` | `boolean` | types/index.ts:79 |
| <a id="idle"></a> `idle`                                 | `readonly` | `boolean` | types/index.ts:80 |
| <a id="pagelifecycle"></a> `pageLifecycle`               | `readonly` | `boolean` | types/index.ts:81 |
| <a id="requestidlecallback-1"></a> `requestIdleCallback` | `readonly` | `boolean` | types/index.ts:82 |
| <a id="visibility-1"></a> `visibility`                   | `readonly` | `boolean` | types/index.ts:83 |

---

### BrowserLifecyclePlugin

Defined in: types/index.ts:89

Plugin contract executed by the Session Core plugin runtime.

#### Properties

| Property                                    | Modifier   | Type                                                                                                   | Defined in         |
| ------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ | ------------------ |
| <a id="author-1"></a> `author?`             | `readonly` | `string`                                                                                               | types/index.ts:90  |
| <a id="dependencies-1"></a> `dependencies?` | `readonly` | readonly `string`[]                                                                                    | types/index.ts:91  |
| <a id="description-2"></a> `description?`   | `readonly` | `string`                                                                                               | types/index.ts:92  |
| <a id="enabled-1"></a> `enabled?`           | `readonly` | `boolean`                                                                                              | types/index.ts:93  |
| <a id="id-2"></a> `id`                      | `readonly` | `string`                                                                                               | types/index.ts:94  |
| <a id="name-2"></a> `name?`                 | `readonly` | `string`                                                                                               | types/index.ts:95  |
| <a id="ondestroy"></a> `onDestroy?`         | `readonly` | (`context`: [`BrowserLifecyclePluginRuntimeContext`](#browserlifecyclepluginruntimecontext)) => `void` | types/index.ts:96  |
| <a id="onevent"></a> `onEvent?`             | `readonly` | (`event`: [`BrowserLifecycleEventName`](#browserlifecycleeventname), `payload`: `unknown`) => `void`   | types/index.ts:97  |
| <a id="onregister"></a> `onRegister?`       | `readonly` | (`context`: [`BrowserLifecyclePluginRuntimeContext`](#browserlifecyclepluginruntimecontext)) => `void` | types/index.ts:102 |
| <a id="onstart"></a> `onStart?`             | `readonly` | (`context`: [`BrowserLifecyclePluginRuntimeContext`](#browserlifecyclepluginruntimecontext)) => `void` | types/index.ts:103 |
| <a id="onstop"></a> `onStop?`               | `readonly` | (`context`: [`BrowserLifecyclePluginRuntimeContext`](#browserlifecyclepluginruntimecontext)) => `void` | types/index.ts:104 |
| <a id="priority-1"></a> `priority?`         | `readonly` | `number`                                                                                               | types/index.ts:105 |
| <a id="version-1"></a> `version?`           | `readonly` | `string`                                                                                               | types/index.ts:106 |

---

### BrowserLifecyclePluginRuntimeContext

Defined in: types/index.ts:112

Read-only context passed to plugin lifecycle hooks.

#### Properties

| Property                                   | Modifier   | Type                                                                        | Defined in         |
| ------------------------------------------ | ---------- | --------------------------------------------------------------------------- | ------------------ |
| <a id="capabilities-2"></a> `capabilities` | `readonly` | [`BrowserLifecycleCapabilities`](#browserlifecyclecapabilities)             | types/index.ts:113 |
| <a id="configuration"></a> `configuration` | `readonly` | [`ResolvedBrowserLifecycleConfig`](#resolvedbrowserlifecycleconfig)         | types/index.ts:114 |
| <a id="getsnapshot-2"></a> `getSnapshot`   | `readonly` | () => `Readonly`\<[`BrowserLifecycleSnapshot`](#browserlifecyclesnapshot)\> | types/index.ts:116 |

---

### BrowserLifecycleCrossTabConfigInput

Defined in: types/index.ts:122

Optional cross-tab configuration overrides.

#### Properties

| Property                                            | Modifier   | Type     | Defined in         |
| --------------------------------------------------- | ---------- | -------- | ------------------ |
| <a id="channelname"></a> `channelName?`             | `readonly` | `string` | types/index.ts:123 |
| <a id="heartbeatinterval"></a> `heartbeatInterval?` | `readonly` | `number` | types/index.ts:124 |
| <a id="leadertimeout"></a> `leaderTimeout?`         | `readonly` | `number` | types/index.ts:125 |

---

### BrowserLifecycleCrossTabConfig

Defined in: types/index.ts:131

Resolved cross-tab configuration used internally after validation.

#### Properties

| Property                                             | Modifier   | Type      | Defined in         |
| ---------------------------------------------------- | ---------- | --------- | ------------------ |
| <a id="channelname-1"></a> `channelName`             | `readonly` | `string`  | types/index.ts:132 |
| <a id="enabled-2"></a> `enabled`                     | `readonly` | `boolean` | types/index.ts:133 |
| <a id="heartbeatinterval-1"></a> `heartbeatInterval` | `readonly` | `number`  | types/index.ts:134 |
| <a id="leadertimeout-1"></a> `leaderTimeout`         | `readonly` | `number`  | types/index.ts:135 |

---

### BrowserLifecycleConfig

Defined in: types/index.ts:141

Public configuration accepted by the package during the core infrastructure phase.

#### Properties

| Property                                          | Modifier   | Type                                                                                                   | Defined in         |
| ------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ | ------------------ |
| <a id="activitydebounce"></a> `activityDebounce?` | `readonly` | `number`                                                                                               | types/index.ts:142 |
| <a id="activityevents"></a> `activityEvents?`     | `readonly` | \| `"default"` \| readonly [`BrowserLifecycleActivityEventName`](#browserlifecycleactivityeventname)[] | types/index.ts:143 |
| <a id="autostart"></a> `autoStart?`               | `readonly` | `boolean`                                                                                              | types/index.ts:144 |
| <a id="crosstab"></a> `crossTab?`                 | `readonly` | \| `boolean` \| [`BrowserLifecycleCrossTabConfigInput`](#browserlifecyclecrosstabconfiginput)          | types/index.ts:145 |
| <a id="debug-1"></a> `debug?`                     | `readonly` | `boolean`                                                                                              | types/index.ts:146 |
| <a id="emitinitialstate"></a> `emitInitialState?` | `readonly` | `boolean`                                                                                              | types/index.ts:147 |
| <a id="eventbuffersize-1"></a> `eventBufferSize?` | `readonly` | `number`                                                                                               | types/index.ts:148 |
| <a id="idletimeout"></a> `idleTimeout?`           | `readonly` | `number` \| `false`                                                                                    | types/index.ts:149 |
| <a id="plugins"></a> `plugins?`                   | `readonly` | readonly [`BrowserLifecyclePlugin`](#browserlifecycleplugin)[]                                         | types/index.ts:150 |

---

### ResolvedBrowserLifecycleConfig

Defined in: types/index.ts:156

Immutable resolved configuration returned by the configuration system.

#### Properties

| Property                                           | Modifier   | Type                                                                                 | Defined in         |
| -------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------ | ------------------ |
| <a id="activitydebounce-1"></a> `activityDebounce` | `readonly` | `number`                                                                             | types/index.ts:157 |
| <a id="activityevents-1"></a> `activityEvents`     | `readonly` | readonly [`BrowserLifecycleActivityEventName`](#browserlifecycleactivityeventname)[] | types/index.ts:158 |
| <a id="autostart-1"></a> `autoStart`               | `readonly` | `boolean`                                                                            | types/index.ts:159 |
| <a id="crosstab-1"></a> `crossTab`                 | `readonly` | [`BrowserLifecycleCrossTabConfig`](#browserlifecyclecrosstabconfig)                  | types/index.ts:160 |
| <a id="debug-2"></a> `debug`                       | `readonly` | `boolean`                                                                            | types/index.ts:161 |
| <a id="emitinitialstate-1"></a> `emitInitialState` | `readonly` | `boolean`                                                                            | types/index.ts:162 |
| <a id="eventbuffersize-2"></a> `eventBufferSize`   | `readonly` | `number`                                                                             | types/index.ts:163 |
| <a id="idletimeout-1"></a> `idleTimeout`           | `readonly` | `number` \| `false`                                                                  | types/index.ts:164 |
| <a id="plugins-1"></a> `plugins`                   | `readonly` | readonly [`BrowserLifecyclePlugin`](#browserlifecycleplugin)[]                       | types/index.ts:165 |

---

### BrowserLifecycleValidationIssue

Defined in: types/index.ts:171

Internal validation issue shape used for detailed configuration errors.

#### Properties

| Property                       | Modifier   | Type     | Defined in         |
| ------------------------------ | ---------- | -------- | ------------------ |
| <a id="message"></a> `message` | `readonly` | `string` | types/index.ts:172 |
| <a id="path"></a> `path`       | `readonly` | `string` | types/index.ts:173 |

## Type Aliases

### BrowserLifecyclePhase

```ts
type BrowserLifecyclePhase = "created" | "disposed" | "running" | "stopped";
```

Defined in: core/session/types.ts:19

Public lifecycle phases exposed by the Session Core.

---

### BrowserLifecycleAttentionState

```ts
type BrowserLifecycleAttentionState = "focused" | "unknown" | "unfocused";
```

Defined in: core/session/types.ts:29

Normalized attention state placeholder for current and future modules.

---

### BrowserLifecycleActivityState

```ts
type BrowserLifecycleActivityState = "active" | "idle" | "unknown";
```

Defined in: core/session/types.ts:34

Normalized activity state placeholder for current and future modules.

---

### BrowserLifecycleConnectivityState

```ts
type BrowserLifecycleConnectivityState = "offline" | "online" | "unknown";
```

Defined in: core/session/types.ts:39

Normalized advisory connectivity state placeholder for current and future modules.

---

### BrowserLifecyclePageState

```ts
type BrowserLifecyclePageState =
  "active" | "discarded" | "frozen" | "hidden" | "passive" | "terminated" | "unknown";
```

Defined in: core/session/types.ts:44

Normalized lifecycle state placeholder for current and future modules.

---

### BrowserLifecycleTabState

```ts
type BrowserLifecycleTabState = "primary" | "secondary" | "single" | "unknown";
```

Defined in: core/session/types.ts:50

Normalized tab role placeholder for current and future modules.

---

### BrowserLifecycleEventSource

```ts
type BrowserLifecycleEventSource =
  | "activity"
  | "connectivity"
  | "focus"
  | "internal"
  | "lifecycle"
  | "plugin"
  | "transport"
  | "visibility";
```

Defined in: core/session/types.ts:55

Public event source categories.

---

### BrowserLifecycleEventName

```ts
type BrowserLifecycleEventName =
  | "activity:detected"
  | "activity:reset"
  | "connection:offline"
  | "connection:online"
  | "connection:reconnect"
  | "page:hidden"
  | "page:resume"
  | "page:suspend"
  | "page:visible"
  | "plugin:error"
  | "plugin:registered"
  | "plugin:removed"
  | "session:active"
  | "session:idle"
  | "session:restored"
  | "session:started"
  | "session:stopped"
  | "tab:primary"
  | "tab:secondary"
  | "tab:message"
  | "window:blur"
  | "window:focus";
```

Defined in: core/session/types.ts:109

Public event names reserved by Browser Lifecycle Manager.

---

### BrowserLifecycleEventListener()\<TEventName\>

```ts
type BrowserLifecycleEventListener<TEventName> = (
  event: DeepReadonly<BrowserLifecycleEventMap[TEventName]>,
) => void;
```

Defined in: core/session/types.ts:296

Named event listener used by the public BrowserLifecycle object.

#### Type Parameters

| Type Parameter                                                                   |
| -------------------------------------------------------------------------------- |
| `TEventName` _extends_ [`BrowserLifecycleEventName`](#browserlifecycleeventname) |

#### Parameters

| Parameter | Type                                                                                      |
| --------- | ----------------------------------------------------------------------------------------- |
| `event`   | `DeepReadonly`\<[`BrowserLifecycleEventMap`](#browserlifecycleeventmap)\[`TEventName`\]\> |

#### Returns

`void`

---

### BrowserLifecycleSubscriber()

```ts
type BrowserLifecycleSubscriber = (
  event: DeepReadonly<BrowserLifecycleEventMap[BrowserLifecycleEventName]>,
  snapshot: DeepReadonly<BrowserLifecycleSnapshot>,
) => void;
```

Defined in: core/session/types.ts:303

Full event feed subscriber used for logging and adapter layers.

#### Parameters

| Parameter  | Type                                                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `event`    | `DeepReadonly`\<[`BrowserLifecycleEventMap`](#browserlifecycleeventmap)\[[`BrowserLifecycleEventName`](#browserlifecycleeventname)\]\> |
| `snapshot` | `DeepReadonly`\<[`BrowserLifecycleSnapshot`](#browserlifecyclesnapshot)\>                                                              |

#### Returns

`void`

---

### EventMap

```ts
type EventMap = object;
```

Defined in: events/types.ts:5

Generic event map used by the typed event infrastructure.

---

### EventName\<TEventMap\>

```ts
type EventName<TEventMap> = Extract<keyof TEventMap, string>;
```

Defined in: events/types.ts:10

Valid event names for a given event map.

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| `TEventMap` _extends_ [`EventMap`](#eventmap) |

---

### EventPayload\<TEventMap, TEventName\>

```ts
type EventPayload<TEventMap, TEventName> = TEventMap[TEventName];
```

Defined in: events/types.ts:15

Payload type associated with an event name.

#### Type Parameters

| Type Parameter                                                  |
| --------------------------------------------------------------- |
| `TEventMap` _extends_ [`EventMap`](#eventmap)                   |
| `TEventName` _extends_ [`EventName`](#eventname)\<`TEventMap`\> |

---

### EventInternalMetadata

```ts
type EventInternalMetadata = Readonly<Record<string, unknown>>;
```

Defined in: events/types.ts:23

Internal metadata bag reserved for diagnostics and future instrumentation.

---

### EventListener()\<TEventMap, TEventName\>

```ts
type EventListener<TEventMap, TEventName> = (
  payload: EventPayload<TEventMap, TEventName>,
  metadata: EventDispatchMetadata<TEventName>,
) => void;
```

Defined in: events/types.ts:51

Listener signature used throughout the infrastructure.

#### Type Parameters

| Type Parameter                                                  |
| --------------------------------------------------------------- |
| `TEventMap` _extends_ [`EventMap`](#eventmap)                   |
| `TEventName` _extends_ [`EventName`](#eventname)\<`TEventMap`\> |

#### Parameters

| Parameter  | Type                                                              |
| ---------- | ----------------------------------------------------------------- |
| `payload`  | [`EventPayload`](#eventpayload)\<`TEventMap`, `TEventName`\>      |
| `metadata` | [`EventDispatchMetadata`](#eventdispatchmetadata)\<`TEventName`\> |

#### Returns

`void`

---

### EventListenerErrorHandler()\<TEventMap\>

```ts
type EventListenerErrorHandler<TEventMap> = (
  error: unknown,
  context: EventDispatchContext<TEventMap, EventName<TEventMap>>,
) => void;
```

Defined in: events/types.ts:79

Error handler used to isolate listener failures.

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| `TEventMap` _extends_ [`EventMap`](#eventmap) |

#### Parameters

| Parameter | Type                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------- |
| `error`   | `unknown`                                                                                                |
| `context` | [`EventDispatchContext`](#eventdispatchcontext)\<`TEventMap`, [`EventName`](#eventname)\<`TEventMap`\>\> |

#### Returns

`void`

---

### BrowserLifecyclePluginPhase

```ts
type BrowserLifecyclePluginPhase =
  "registered" | "initialized" | "started" | "running" | "stopped" | "destroyed";
```

Defined in: plugins/types.ts:10

Lifecycle phases tracked for each registered plugin.

---

### BrowserLifecyclePluginHookName

```ts
type BrowserLifecyclePluginHookName = "onDestroy" | "onEvent" | "onRegister" | "onStart" | "onStop";
```

Defined in: plugins/types.ts:16

Supported plugin hook names executed by the Session Core plugin runtime.

---

### BrowserLifecyclePluginContext

```ts
type BrowserLifecyclePluginContext = BrowserLifecyclePluginRuntimeContext;
```

Defined in: plugins/types.ts:22

Read-only context passed to plugin lifecycle hooks.

---

### BrowserLifecycleActivityEventName

```ts
type BrowserLifecycleActivityEventName =
  | "focus"
  | "keydown"
  | "mousedown"
  | "mousemove"
  | "pointerdown"
  | "pointermove"
  | "touchmove"
  | "touchstart"
  | "visibilitychange";
```

Defined in: types/index.ts:4

Valid activity events for idle detection inputs.

---

### BrowserLifecycleErrorCode

```ts
type BrowserLifecycleErrorCode =
  | "configuration_error"
  | "initialization_error"
  | "lifecycle_error"
  | "module_registry_error"
  | "plugin_error"
  | "unsupported_feature_error";
```

Defined in: types/index.ts:18

Supported error codes for the public infrastructure surface.

## Functions

### createBrowserLifecycle()

```ts
function createBrowserLifecycle(config: BrowserLifecycleConfig): BrowserLifecycle;
```

Defined in: browser-lifecycle.ts:10

Creates a BrowserLifecycle runtime instance.

#### Parameters

| Parameter | Type                                                |
| --------- | --------------------------------------------------- |
| `config`  | [`BrowserLifecycleConfig`](#browserlifecycleconfig) |

#### Returns

[`BrowserLifecycle`](#browserlifecycle)

---

### supportsVisibility()

```ts
function supportsVisibility(environment: BrowserFeatureEnvironment): boolean;
```

Defined in: browser/features/index.ts:6

Returns true when the environment supports the Page Visibility API.

#### Parameters

| Parameter     | Type                                                      |
| ------------- | --------------------------------------------------------- |
| `environment` | [`BrowserFeatureEnvironment`](#browserfeatureenvironment) |

#### Returns

`boolean`

---

### supportsBroadcastChannel()

```ts
function supportsBroadcastChannel(environment: BrowserFeatureEnvironment): boolean;
```

Defined in: browser/features/index.ts:21

Returns true when the environment supports BroadcastChannel.

#### Parameters

| Parameter     | Type                                                      |
| ------------- | --------------------------------------------------------- |
| `environment` | [`BrowserFeatureEnvironment`](#browserfeatureenvironment) |

#### Returns

`boolean`

---

### supportsPageLifecycle()

```ts
function supportsPageLifecycle(environment: BrowserFeatureEnvironment): boolean;
```

Defined in: browser/features/index.ts:30

Returns true when the environment supports the pagehide and pageshow lifecycle hooks.

#### Parameters

| Parameter     | Type                                                      |
| ------------- | --------------------------------------------------------- |
| `environment` | [`BrowserFeatureEnvironment`](#browserfeatureenvironment) |

#### Returns

`boolean`

---

### supportsRequestIdleCallback()

```ts
function supportsRequestIdleCallback(environment: BrowserFeatureEnvironment): boolean;
```

Defined in: browser/features/index.ts:45

Returns true when the environment supports requestIdleCallback.

#### Parameters

| Parameter     | Type                                                      |
| ------------- | --------------------------------------------------------- |
| `environment` | [`BrowserFeatureEnvironment`](#browserfeatureenvironment) |

#### Returns

`boolean`

---

### supportsIdle()

```ts
function supportsIdle(environment: BrowserFeatureEnvironment): boolean;
```

Defined in: browser/features/index.ts:54

Returns true when the environment supports idle activity observation.

#### Parameters

| Parameter     | Type                                                      |
| ------------- | --------------------------------------------------------- |
| `environment` | [`BrowserFeatureEnvironment`](#browserfeatureenvironment) |

#### Returns

`boolean`

---

### supportsConnectivity()

```ts
function supportsConnectivity(environment: BrowserFeatureEnvironment): boolean;
```

Defined in: browser/features/index.ts:74

Returns true when the environment supports advisory connectivity observation.

#### Parameters

| Parameter     | Type                                                      |
| ------------- | --------------------------------------------------------- |
| `environment` | [`BrowserFeatureEnvironment`](#browserfeatureenvironment) |

#### Returns

`boolean`

---

### supportsFocus()

```ts
function supportsFocus(environment: BrowserFeatureEnvironment): boolean;
```

Defined in: browser/features/index.ts:94

Returns true when the environment supports window focus observation.

#### Parameters

| Parameter     | Type                                                      |
| ------------- | --------------------------------------------------------- |
| `environment` | [`BrowserFeatureEnvironment`](#browserfeatureenvironment) |

#### Returns

`boolean`

---

### supportsAbortController()

```ts
function supportsAbortController(environment: BrowserFeatureEnvironment): boolean;
```

Defined in: browser/features/index.ts:114

Returns true when the environment supports AbortController.

#### Parameters

| Parameter     | Type                                                      |
| ------------- | --------------------------------------------------------- |
| `environment` | [`BrowserFeatureEnvironment`](#browserfeatureenvironment) |

#### Returns

`boolean`

---

### detectBrowserLifecycleCapabilities()

```ts
function detectBrowserLifecycleCapabilities(
  environment: BrowserFeatureEnvironment,
): BrowserLifecycleCapabilities;
```

Defined in: browser/features/index.ts:123

Detects the package capability surface without relying on browser sniffing.

#### Parameters

| Parameter     | Type                                                      |
| ------------- | --------------------------------------------------------- |
| `environment` | [`BrowserFeatureEnvironment`](#browserfeatureenvironment) |

#### Returns

[`BrowserLifecycleCapabilities`](#browserlifecyclecapabilities)

---

### getDefaultBrowserLifecycleConfig()

```ts
function getDefaultBrowserLifecycleConfig(): ResolvedBrowserLifecycleConfig;
```

Defined in: core/config/index.ts:40

Returns an immutable copy of the default configuration.

#### Returns

[`ResolvedBrowserLifecycleConfig`](#resolvedbrowserlifecycleconfig)

---

### validateBrowserLifecycleConfig()

```ts
function validateBrowserLifecycleConfig(input: unknown): asserts input is BrowserLifecycleConfig;
```

Defined in: core/config/index.ts:47

Validates a potential Browser Lifecycle configuration object.

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `input`   | `unknown` |

#### Returns

`asserts input is BrowserLifecycleConfig`

---

### createBrowserLifecycleConfig()

```ts
function createBrowserLifecycleConfig(
  input: BrowserLifecycleConfig,
): ResolvedBrowserLifecycleConfig;
```

Defined in: core/config/index.ts:64

Creates an immutable resolved configuration object.

#### Parameters

| Parameter | Type                                                |
| --------- | --------------------------------------------------- |
| `input`   | [`BrowserLifecycleConfig`](#browserlifecycleconfig) |

#### Returns

[`ResolvedBrowserLifecycleConfig`](#resolvedbrowserlifecycleconfig)

---

### mergeBrowserLifecycleConfig()

```ts
function mergeBrowserLifecycleConfig(
  base: BrowserLifecycleConfig,
  override: BrowserLifecycleConfig,
): ResolvedBrowserLifecycleConfig;
```

Defined in: core/config/index.ts:342

Creates an immutable configuration object by layering overrides on top of a base config.

#### Parameters

| Parameter  | Type                                                |
| ---------- | --------------------------------------------------- |
| `base`     | [`BrowserLifecycleConfig`](#browserlifecycleconfig) |
| `override` | [`BrowserLifecycleConfig`](#browserlifecycleconfig) |

#### Returns

[`ResolvedBrowserLifecycleConfig`](#resolvedbrowserlifecycleconfig)

---

### getPluginIds()

```ts
function getPluginIds(config: ResolvedBrowserLifecycleConfig): readonly string[];
```

Defined in: core/config/index.ts:360

Returns a readonly copy of plugin ids for diagnostics and tests.

#### Parameters

| Parameter | Type                                                                |
| --------- | ------------------------------------------------------------------- |
| `config`  | [`ResolvedBrowserLifecycleConfig`](#resolvedbrowserlifecycleconfig) |

#### Returns

readonly `string`[]

---

### assert()

```ts
function assert(condition: unknown, message: string): asserts condition;
```

Defined in: utils/index.ts:6

Asserts that a condition is truthy.

#### Parameters

| Parameter   | Type      |
| ----------- | --------- |
| `condition` | `unknown` |
| `message`   | `string`  |

#### Returns

`asserts condition`

---

### noop()

```ts
function noop(): void;
```

Defined in: utils/index.ts:15

No-op helper for optional callback defaults.

#### Returns

`void`

---

### isBrowser()

```ts
function isBrowser(): boolean;
```

Defined in: utils/index.ts:20

Returns true when the current runtime looks like a browser environment.

#### Returns

`boolean`

---

### isFunction()

```ts
function isFunction(value: unknown): value is (args: readonly unknown[]) => unknown;
```

Defined in: utils/index.ts:29

Returns true when a value is callable.

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`value is (args: readonly unknown[]) => unknown`

---

### isObject()

```ts
function isObject(value: unknown): value is PlainObject;
```

Defined in: utils/index.ts:36

Returns true when a value is a non-null object.

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`value is PlainObject`

---

### deepFreeze()

```ts
function deepFreeze<TValue>(value: TValue): DeepReadonly<TValue>;
```

Defined in: utils/index.ts:43

Deeply freezes an object tree and returns a readonly view.

#### Type Parameters

| Type Parameter |
| -------------- |
| `TValue`       |

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `value`   | `TValue` |

#### Returns

`DeepReadonly`\<`TValue`\>

---

### mergeObjects()

```ts
function mergeObjects<TBase, TOverride>(base: TBase, override: TOverride): TBase & TOverride;
```

Defined in: utils/index.ts:50

Merges two plain objects recursively while replacing arrays and scalar values.

#### Type Parameters

| Type Parameter                      |
| ----------------------------------- |
| `TBase` _extends_ `PlainObject`     |
| `TOverride` _extends_ `PlainObject` |

#### Parameters

| Parameter  | Type        |
| ---------- | ----------- |
| `base`     | `TBase`     |
| `override` | `TOverride` |

#### Returns

`TBase` & `TOverride`
