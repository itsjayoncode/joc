**@jayoncode/object-diff API**

---

# @jayoncode/object-diff API

## Classes

### ObjectDiffError

Defined in: errors/index.ts:18

#### Extends

- `Error`

#### Extended by

- [`CircularReferenceError`](#circularreferenceerror)
- [`InvalidOptionsError`](#invalidoptionserror)
- [`InvalidPatchError`](#invalidpatcherror)
- [`MaxDepthExceededError`](#maxdepthexceedederror)
- [`NotImplementedError`](#notimplementederror)
- [`PatchApplyError`](#patchapplyerror)
- [`PluginError`](#pluginerror)
- [`UnsupportedTypeError`](#unsupportedtypeerror)

#### Constructors

##### Constructor

```ts
new ObjectDiffError(
   message: string,
   code: ObjectDiffErrorCode,
   options: ObjectDiffErrorOptions): ObjectDiffError;
```

Defined in: errors/index.ts:22

###### Parameters

| Parameter | Type                     |
| --------- | ------------------------ |
| `message` | `string`                 |
| `code`    | `ObjectDiffErrorCode`    |
| `options` | `ObjectDiffErrorOptions` |

###### Returns

[`ObjectDiffError`](#objectdifferror)

###### Overrides

```ts
Error.constructor;
```

#### Properties

| Property                       | Modifier   | Type                                       | Defined in         |
| ------------------------------ | ---------- | ------------------------------------------ | ------------------ |
| <a id="code"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | errors/index.ts:19 |
| <a id="details"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | errors/index.ts:20 |

---

### CircularReferenceError

Defined in: errors/index.ts:34

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new CircularReferenceError(message: string, options: ObjectDiffErrorOptions): CircularReferenceError;
```

Defined in: errors/index.ts:35

###### Parameters

| Parameter | Type                     |
| --------- | ------------------------ |
| `message` | `string`                 |
| `options` | `ObjectDiffErrorOptions` |

###### Returns

[`CircularReferenceError`](#circularreferenceerror)

###### Overrides

[`ObjectDiffError`](#objectdifferror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                              | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- | ------------------ |
| <a id="code-1"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       | errors/index.ts:19 |
| <a id="details-1"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`ObjectDiffError`](#objectdifferror).[`details`](#details) | errors/index.ts:20 |

---

### MaxDepthExceededError

Defined in: errors/index.ts:41

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new MaxDepthExceededError(message: string, options: ObjectDiffErrorOptions): MaxDepthExceededError;
```

Defined in: errors/index.ts:42

###### Parameters

| Parameter | Type                     |
| --------- | ------------------------ |
| `message` | `string`                 |
| `options` | `ObjectDiffErrorOptions` |

###### Returns

[`MaxDepthExceededError`](#maxdepthexceedederror)

###### Overrides

[`ObjectDiffError`](#objectdifferror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                              | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- | ------------------ |
| <a id="code-2"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       | errors/index.ts:19 |
| <a id="details-2"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`ObjectDiffError`](#objectdifferror).[`details`](#details) | errors/index.ts:20 |

---

### InvalidPatchError

Defined in: errors/index.ts:48

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new InvalidPatchError(message: string, options: ObjectDiffErrorOptions): InvalidPatchError;
```

Defined in: errors/index.ts:49

###### Parameters

| Parameter | Type                     |
| --------- | ------------------------ |
| `message` | `string`                 |
| `options` | `ObjectDiffErrorOptions` |

###### Returns

[`InvalidPatchError`](#invalidpatcherror)

###### Overrides

[`ObjectDiffError`](#objectdifferror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                              | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- | ------------------ |
| <a id="code-3"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       | errors/index.ts:19 |
| <a id="details-3"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`ObjectDiffError`](#objectdifferror).[`details`](#details) | errors/index.ts:20 |

---

### PatchApplyError

Defined in: errors/index.ts:55

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new PatchApplyError(message: string, options: ObjectDiffErrorOptions): PatchApplyError;
```

Defined in: errors/index.ts:56

###### Parameters

| Parameter | Type                     |
| --------- | ------------------------ |
| `message` | `string`                 |
| `options` | `ObjectDiffErrorOptions` |

###### Returns

[`PatchApplyError`](#patchapplyerror)

###### Overrides

[`ObjectDiffError`](#objectdifferror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                              | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- | ------------------ |
| <a id="code-4"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       | errors/index.ts:19 |
| <a id="details-4"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`ObjectDiffError`](#objectdifferror).[`details`](#details) | errors/index.ts:20 |

---

### UnsupportedTypeError

Defined in: errors/index.ts:62

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new UnsupportedTypeError(message: string, options: ObjectDiffErrorOptions): UnsupportedTypeError;
```

Defined in: errors/index.ts:63

###### Parameters

| Parameter | Type                     |
| --------- | ------------------------ |
| `message` | `string`                 |
| `options` | `ObjectDiffErrorOptions` |

###### Returns

[`UnsupportedTypeError`](#unsupportedtypeerror)

###### Overrides

[`ObjectDiffError`](#objectdifferror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                              | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- | ------------------ |
| <a id="code-5"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       | errors/index.ts:19 |
| <a id="details-5"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`ObjectDiffError`](#objectdifferror).[`details`](#details) | errors/index.ts:20 |

---

### NotImplementedError

Defined in: errors/index.ts:69

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new NotImplementedError(message: string, options: ObjectDiffErrorOptions): NotImplementedError;
```

Defined in: errors/index.ts:70

###### Parameters

| Parameter | Type                     |
| --------- | ------------------------ |
| `message` | `string`                 |
| `options` | `ObjectDiffErrorOptions` |

###### Returns

[`NotImplementedError`](#notimplementederror)

###### Overrides

[`ObjectDiffError`](#objectdifferror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                              | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- | ------------------ |
| <a id="code-6"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       | errors/index.ts:19 |
| <a id="details-6"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`ObjectDiffError`](#objectdifferror).[`details`](#details) | errors/index.ts:20 |

---

### InvalidOptionsError

Defined in: errors/index.ts:76

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new InvalidOptionsError(message: string, options: ObjectDiffErrorOptions): InvalidOptionsError;
```

Defined in: errors/index.ts:77

###### Parameters

| Parameter | Type                     |
| --------- | ------------------------ |
| `message` | `string`                 |
| `options` | `ObjectDiffErrorOptions` |

###### Returns

[`InvalidOptionsError`](#invalidoptionserror)

###### Overrides

[`ObjectDiffError`](#objectdifferror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                              | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- | ------------------ |
| <a id="code-7"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       | errors/index.ts:19 |
| <a id="details-7"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`ObjectDiffError`](#objectdifferror).[`details`](#details) | errors/index.ts:20 |

---

### PluginError

Defined in: errors/index.ts:83

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new PluginError(message: string, options: ObjectDiffErrorOptions): PluginError;
```

Defined in: errors/index.ts:84

###### Parameters

| Parameter | Type                     |
| --------- | ------------------------ |
| `message` | `string`                 |
| `options` | `ObjectDiffErrorOptions` |

###### Returns

[`PluginError`](#pluginerror)

###### Overrides

[`ObjectDiffError`](#objectdifferror).[`constructor`](#constructor)

#### Properties

| Property                         | Modifier   | Type                                       | Inherited from                                              | Defined in         |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- | ------------------ |
| <a id="code-8"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       | errors/index.ts:19 |
| <a id="details-8"></a> `details` | `readonly` | `undefined` \| `Readonly`\<`PlainObject`\> | [`ObjectDiffError`](#objectdifferror).[`details`](#details) | errors/index.ts:20 |

## Interfaces

### DiffRecord

Defined in: types/index.ts:19

A single recorded change between two values.

#### Properties

| Property                          | Modifier   | Type                    | Description                                 | Defined in        |
| --------------------------------- | ---------- | ----------------------- | ------------------------------------------- | ----------------- |
| <a id="path-1"></a> `path`        | `readonly` | `string`                | -                                           | types/index.ts:20 |
| <a id="type"></a> `type`          | `readonly` | [`DiffType`](#difftype) | -                                           | types/index.ts:21 |
| <a id="previous"></a> `previous?` | `readonly` | `unknown`               | -                                           | types/index.ts:22 |
| <a id="current"></a> `current?`   | `readonly` | `unknown`               | -                                           | types/index.ts:23 |
| <a id="from"></a> `from?`         | `readonly` | `string`                | Source display path when `type` is `moved`. | types/index.ts:25 |

---

### DiffMetadata

Defined in: types/index.ts:31

Metadata collected during a diff operation.

#### Properties

| Property                                     | Modifier   | Type     | Defined in        |
| -------------------------------------------- | ---------- | -------- | ----------------- |
| <a id="durationms"></a> `durationMs`         | `readonly` | `number` | types/index.ts:32 |
| <a id="changecount"></a> `changeCount`       | `readonly` | `number` | types/index.ts:33 |
| <a id="addedcount"></a> `addedCount`         | `readonly` | `number` | types/index.ts:34 |
| <a id="removedcount"></a> `removedCount`     | `readonly` | `number` | types/index.ts:35 |
| <a id="changedcount"></a> `changedCount`     | `readonly` | `number` | types/index.ts:36 |
| <a id="unchangedcount"></a> `unchangedCount` | `readonly` | `number` | types/index.ts:37 |
| <a id="movedcount"></a> `movedCount`         | `readonly` | `number` | types/index.ts:38 |

---

### DiffResult

Defined in: types/index.ts:44

Result of a diff operation.

#### Properties

| Property                         | Modifier   | Type                                   | Defined in        |
| -------------------------------- | ---------- | -------------------------------------- | ----------------- |
| <a id="changes"></a> `changes`   | `readonly` | readonly [`DiffRecord`](#diffrecord)[] | types/index.ts:45 |
| <a id="metadata"></a> `metadata` | `readonly` | [`DiffMetadata`](#diffmetadata)        | types/index.ts:46 |

---

### DiffOptions

Defined in: types/index.ts:68

Options for diff and filtered diff helpers.

#### Properties

| Property                                                        | Modifier   | Type                                                      | Description                                                                                  | Defined in        |
| --------------------------------------------------------------- | ---------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------- |
| <a id="maxdepth"></a> `maxDepth?`                               | `readonly` | `number`                                                  | -                                                                                            | types/index.ts:69 |
| <a id="includeunchanged"></a> `includeUnchanged?`               | `readonly` | `boolean`                                                 | -                                                                                            | types/index.ts:70 |
| <a id="detectmoves"></a> `detectMoves?`                         | `readonly` | `boolean`                                                 | When true, pair equal removed+added values into `moved` records (and JSON Patch `move` ops). | types/index.ts:75 |
| <a id="circular"></a> `circular?`                               | `readonly` | [`CircularReferenceStrategy`](#circularreferencestrategy) | -                                                                                            | types/index.ts:76 |
| <a id="customcomparator-1"></a> `customComparator?`             | `readonly` | [`CustomComparator`](#customcomparator)                   | -                                                                                            | types/index.ts:77 |
| <a id="treatundefinedasmissing"></a> `treatUndefinedAsMissing?` | `readonly` | `boolean`                                                 | -                                                                                            | types/index.ts:78 |
| <a id="identitykey-1"></a> `identityKey?`                       | `readonly` | [`IdentityKey`](#identitykey)                             | Match array elements by identity instead of index.                                           | types/index.ts:80 |
| <a id="ignore"></a> `ignore?`                                   | `readonly` | readonly `string`[]                                       | Skip paths matching these patterns (`*`, `**` supported).                                    | types/index.ts:82 |
| <a id="include"></a> `include?`                                 | `readonly` | readonly `string`[]                                       | Only emit/visit paths matching these patterns (ancestors still visited).                     | types/index.ts:84 |

---

### CompareOptions

Defined in: types/index.ts:90

Options for deep equality comparison.

#### Properties

| Property                                            | Modifier   | Type                                                      | Defined in        |
| --------------------------------------------------- | ---------- | --------------------------------------------------------- | ----------------- |
| <a id="maxdepth-1"></a> `maxDepth?`                 | `readonly` | `number`                                                  | types/index.ts:91 |
| <a id="circular-1"></a> `circular?`                 | `readonly` | [`CircularReferenceStrategy`](#circularreferencestrategy) | types/index.ts:92 |
| <a id="customcomparator-2"></a> `customComparator?` | `readonly` | [`CustomComparator`](#customcomparator)                   | types/index.ts:93 |

---

### ResolvedDiffOptions

Defined in: types/index.ts:99

Normalized diff options used internally.

#### Properties

| Property                                                         | Modifier   | Type                                                      | Defined in         |
| ---------------------------------------------------------------- | ---------- | --------------------------------------------------------- | ------------------ |
| <a id="maxdepth-2"></a> `maxDepth`                               | `readonly` | `number`                                                  | types/index.ts:100 |
| <a id="includeunchanged-1"></a> `includeUnchanged`               | `readonly` | `boolean`                                                 | types/index.ts:101 |
| <a id="detectmoves-1"></a> `detectMoves`                         | `readonly` | `boolean`                                                 | types/index.ts:102 |
| <a id="circular-2"></a> `circular`                               | `readonly` | [`CircularReferenceStrategy`](#circularreferencestrategy) | types/index.ts:103 |
| <a id="customcomparator-3"></a> `customComparator`               | `readonly` | `undefined` \| [`CustomComparator`](#customcomparator)    | types/index.ts:104 |
| <a id="treatundefinedasmissing-1"></a> `treatUndefinedAsMissing` | `readonly` | `boolean`                                                 | types/index.ts:105 |
| <a id="identitykey-2"></a> `identityKey`                         | `readonly` | `undefined` \| [`IdentityKey`](#identitykey)              | types/index.ts:106 |
| <a id="ignore-1"></a> `ignore`                                   | `readonly` | `undefined` \| readonly `string`[]                        | types/index.ts:107 |
| <a id="include-1"></a> `include`                                 | `readonly` | `undefined` \| readonly `string`[]                        | types/index.ts:108 |

---

### ResolvedCompareOptions

Defined in: types/index.ts:114

Normalized compare options used internally.

#### Properties

| Property                                           | Modifier   | Type                                                      | Defined in         |
| -------------------------------------------------- | ---------- | --------------------------------------------------------- | ------------------ |
| <a id="maxdepth-3"></a> `maxDepth`                 | `readonly` | `number`                                                  | types/index.ts:115 |
| <a id="circular-3"></a> `circular`                 | `readonly` | [`CircularReferenceStrategy`](#circularreferencestrategy) | types/index.ts:116 |
| <a id="customcomparator-4"></a> `customComparator` | `readonly` | `undefined` \| [`CustomComparator`](#customcomparator)    | types/index.ts:117 |

---

### PatchOperation

Defined in: types/index.ts:128

A single JSON Patch style operation.

#### Properties

| Property                    | Modifier   | Type                                        | Defined in         |
| --------------------------- | ---------- | ------------------------------------------- | ------------------ |
| <a id="op"></a> `op`        | `readonly` | [`PatchOperationType`](#patchoperationtype) | types/index.ts:129 |
| <a id="path-2"></a> `path`  | `readonly` | `string`                                    | types/index.ts:130 |
| <a id="from-1"></a> `from?` | `readonly` | `string`                                    | types/index.ts:131 |
| <a id="value"></a> `value?` | `readonly` | `unknown`                                   | types/index.ts:132 |

---

### PatchOptions

Defined in: types/index.ts:148

Options for patch generation.

#### Properties

| Property                          | Modifier   | Type                          | Description                                                                | Defined in         |
| --------------------------------- | ---------- | ----------------------------- | -------------------------------------------------------------------------- | ------------------ |
| <a id="format"></a> `format?`     | `readonly` | [`PatchFormat`](#patchformat) | -                                                                          | types/index.ts:149 |
| <a id="optimize"></a> `optimize?` | `readonly` | `boolean`                     | Coalesce sequential replaces and drop no-op-friendly noise. Default false. | types/index.ts:151 |

---

### ApplyPatchOptions

Defined in: types/index.ts:157

Options for applying patches.

#### Properties

| Property                          | Modifier   | Type      | Description                                     | Defined in         |
| --------------------------------- | ---------- | --------- | ----------------------------------------------- | ------------------ |
| <a id="mutable"></a> `mutable?`   | `readonly` | `boolean` | -                                               | types/index.ts:158 |
| <a id="validate"></a> `validate?` | `readonly` | `boolean` | Validate operations before apply. Default true. | types/index.ts:160 |

---

### ApplyPatchWithInverseResult\<T\>

Defined in: types/index.ts:166

Result of applying a patch while recording a faithful inverse.

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Properties

| Property                       | Modifier   | Type                | Defined in         |
| ------------------------------ | ---------- | ------------------- | ------------------ |
| <a id="value-1"></a> `value`   | `readonly` | `T`                 | types/index.ts:167 |
| <a id="inverse"></a> `inverse` | `readonly` | [`Patch`](#patch-3) | types/index.ts:168 |

---

### SerializeOptions

Defined in: types/index.ts:180

Options for serialization.

#### Properties

| Property                    | Modifier   | Type      | Description                                                   | Defined in         |
| --------------------------- | ---------- | --------- | ------------------------------------------------------------- | ------------------ |
| <a id="title"></a> `title?` | `readonly` | `string`  | -                                                             | types/index.ts:181 |
| <a id="color"></a> `color?` | `readonly` | `boolean` | When false, `console` format omits ANSI colors. Default true. | types/index.ts:183 |

---

### FormatterPlugin

Defined in: types/index.ts:189

Optional custom formatter registered via `createSerializer` (no import side effects).

#### Properties

| Property                 | Modifier   | Type     | Defined in         |
| ------------------------ | ---------- | -------- | ------------------ |
| <a id="name"></a> `name` | `readonly` | `string` | types/index.ts:190 |

#### Methods

##### format()

```ts
format(result: DiffResult, options?: SerializeOptions): string;
```

Defined in: types/index.ts:191

###### Parameters

| Parameter  | Type                                    |
| ---------- | --------------------------------------- |
| `result`   | [`DiffResult`](#diffresult)             |
| `options?` | [`SerializeOptions`](#serializeoptions) |

###### Returns

`string`

## Type Aliases

### DiffType

```ts
type DiffType = "added" | "removed" | "changed" | "unchanged" | "moved";
```

Defined in: types/index.ts:4

Supported change kinds emitted by the difference engine.

---

### PathSegment

```ts
type PathSegment = string | number;
```

Defined in: types/index.ts:9

Path segment used for nested value addressing.

---

### Path

```ts
type Path = readonly PathSegment[];
```

Defined in: types/index.ts:14

Canonical path representation for a nested value.

---

### CircularReferenceStrategy

```ts
type CircularReferenceStrategy = "error" | "skip";
```

Defined in: types/index.ts:52

How circular references are handled during traversal.

---

### CustomComparator()

```ts
type CustomComparator = (a: unknown, b: unknown, path: Path) => boolean | undefined;
```

Defined in: types/index.ts:57

Custom comparator hook. Return true if equal, false if unequal, undefined to use default.

#### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `a`       | `unknown`       |
| `b`       | `unknown`       |
| `path`    | [`Path`](#path) |

#### Returns

`boolean` \| `undefined`

---

### IdentityKey

```ts
type IdentityKey =
  | string
  | (item: unknown, path: Path) => string | number | undefined;
```

Defined in: types/index.ts:63

Identity key for array element matching (Phase 2).
String form reads a property; function form returns an id or undefined (positional leftover).

---

### PatchOperationType

```ts
type PatchOperationType = "add" | "remove" | "replace" | "move" | "copy" | "test";
```

Defined in: types/index.ts:123

JSON Patch operation kinds (RFC 6902).

---

### Patch

```ts
type Patch = readonly PatchOperation[];
```

Defined in: types/index.ts:138

A patch is an ordered list of operations.

---

### PatchFormat

```ts
type PatchFormat = "json-patch" | "merge";
```

Defined in: types/index.ts:143

Patch generation format.

---

### SerializeFormat

```ts
type SerializeFormat = "json" | "pretty" | "markdown" | "table" | "html" | "console" | "human";
```

Defined in: types/index.ts:174

Supported serializer output formats.

---

### ValueKind

```ts
type ValueKind =
  "primitive" | "array" | "object" | "date" | "regexp" | "map" | "set" | "typed-array" | "function";
```

Defined in: types/index.ts:197

Internal value kind for traversal dispatch.

---

### ComparisonOutcome

```ts
type ComparisonOutcome = "equal" | "unequal" | "type-mismatch";
```

Defined in: types/index.ts:203

Result of comparing two values at a path.

## Functions

### compare()

```ts
function compare(a: unknown, b: unknown, options?: CompareOptions): boolean;
```

Defined in: compare/compare.ts:9

Deep equality comparison for structured values.

#### Parameters

| Parameter  | Type                                |
| ---------- | ----------------------------------- |
| `a`        | `unknown`                           |
| `b`        | `unknown`                           |
| `options?` | [`CompareOptions`](#compareoptions) |

#### Returns

`boolean`

---

### diff()

```ts
function diff(a: unknown, b: unknown, options?: DiffOptions): DiffResult;
```

Defined in: compare/difference/diff.ts:255

Compare two values and return structured change records.

#### Parameters

| Parameter  | Type                          |
| ---------- | ----------------------------- |
| `a`        | `unknown`                     |
| `b`        | `unknown`                     |
| `options?` | [`DiffOptions`](#diffoptions) |

#### Returns

[`DiffResult`](#diffresult)

---

### hasChanges()

```ts
function hasChanges(a: unknown, b: unknown, options?: DiffOptions): boolean;
```

Defined in: compare/difference/diff.ts:263

Fast boolean check for whether two values differ.
Avoids allocating a DiffResult unless `identityKey` requires full collection.

#### Parameters

| Parameter  | Type                          |
| ---------- | ----------------------------- |
| `a`        | `unknown`                     |
| `b`        | `unknown`                     |
| `options?` | [`DiffOptions`](#diffoptions) |

#### Returns

`boolean`

---

### added()

```ts
function added(a: unknown, b: unknown, options?: DiffOptions): DiffRecord[];
```

Defined in: compare/difference/diff.ts:324

#### Parameters

| Parameter  | Type                          |
| ---------- | ----------------------------- |
| `a`        | `unknown`                     |
| `b`        | `unknown`                     |
| `options?` | [`DiffOptions`](#diffoptions) |

#### Returns

[`DiffRecord`](#diffrecord)[]

---

### removed()

```ts
function removed(a: unknown, b: unknown, options?: DiffOptions): DiffRecord[];
```

Defined in: compare/difference/diff.ts:328

#### Parameters

| Parameter  | Type                          |
| ---------- | ----------------------------- |
| `a`        | `unknown`                     |
| `b`        | `unknown`                     |
| `options?` | [`DiffOptions`](#diffoptions) |

#### Returns

[`DiffRecord`](#diffrecord)[]

---

### updated()

```ts
function updated(a: unknown, b: unknown, options?: DiffOptions): DiffRecord[];
```

Defined in: compare/difference/diff.ts:332

#### Parameters

| Parameter  | Type                          |
| ---------- | ----------------------------- |
| `a`        | `unknown`                     |
| `b`        | `unknown`                     |
| `options?` | [`DiffOptions`](#diffoptions) |

#### Returns

[`DiffRecord`](#diffrecord)[]

---

### unchanged()

```ts
function unchanged(a: unknown, b: unknown, options?: DiffOptions): DiffRecord[];
```

Defined in: compare/difference/diff.ts:336

#### Parameters

| Parameter  | Type                          |
| ---------- | ----------------------------- |
| `a`        | `unknown`                     |
| `b`        | `unknown`                     |
| `options?` | [`DiffOptions`](#diffoptions) |

#### Returns

[`DiffRecord`](#diffrecord)[]

---

### patch()

```ts
function patch(diffResult: DiffResult, options?: PatchOptions): Patch;
```

Defined in: patch/index.ts:57

Generate a patch from a diff result.

#### Parameters

| Parameter    | Type                            |
| ------------ | ------------------------------- |
| `diffResult` | [`DiffResult`](#diffresult)     |
| `options?`   | [`PatchOptions`](#patchoptions) |

#### Returns

[`Patch`](#patch-3)

---

### applyPatch()

```ts
function applyPatch<T>(target: T, patchOperations: Patch, options?: ApplyPatchOptions): T;
```

Defined in: patch/index.ts:334

Apply a patch to a target value. Returns a new value by default.

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Parameters

| Parameter         | Type                                      |
| ----------------- | ----------------------------------------- |
| `target`          | `T`                                       |
| `patchOperations` | [`Patch`](#patch-3)                       |
| `options?`        | [`ApplyPatchOptions`](#applypatchoptions) |

#### Returns

`T`

---

### applyPatchWithInverse()

```ts
function applyPatchWithInverse<T>(
  target: T,
  patchOperations: Patch,
  options?: ApplyPatchOptions,
): ApplyPatchWithInverseResult<T>;
```

Defined in: patch/index.ts:353

Apply a patch and return a faithful inverse patch (previous values captured).

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Parameters

| Parameter         | Type                                      |
| ----------------- | ----------------------------------------- |
| `target`          | `T`                                       |
| `patchOperations` | [`Patch`](#patch-3)                       |
| `options?`        | [`ApplyPatchOptions`](#applypatchoptions) |

#### Returns

[`ApplyPatchWithInverseResult`](#applypatchwithinverseresult)\<`T`\>

---

### revertPatch()

```ts
function revertPatch<T>(target: T, patchOperations: Patch, options?: ApplyPatchOptions): T;
```

Defined in: patch/index.ts:391

Revert a previously applied patch.
Prefer `applyPatchWithInverse` when you need faithful undo of replaces/removes.
This helper inverts ops structurally; remove→add uses `undefined` unless values were journaled.

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Parameters

| Parameter         | Type                                      |
| ----------------- | ----------------------------------------- |
| `target`          | `T`                                       |
| `patchOperations` | [`Patch`](#patch-3)                       |
| `options?`        | [`ApplyPatchOptions`](#applypatchoptions) |

#### Returns

`T`

---

### optimizePatch()

```ts
function optimizePatch(patchOperations: Patch): Patch;
```

Defined in: patch/optimize.ts:7

Optimize a patch: coalesce sequential replaces on the same path (keep last).
Does not reorder independent operations.

#### Parameters

| Parameter         | Type                |
| ----------------- | ------------------- |
| `patchOperations` | [`Patch`](#patch-3) |

#### Returns

[`Patch`](#patch-3)

---

### validatePatch()

```ts
function validatePatch(patchOperations: unknown): asserts patchOperations is Patch;
```

Defined in: patch/validate.ts:44

Validate a patch document. Throws InvalidPatchError on failure.

#### Parameters

| Parameter         | Type      |
| ----------------- | --------- |
| `patchOperations` | `unknown` |

#### Returns

`asserts patchOperations is Patch`

---

### serialize()

```ts
function serialize(diff: DiffResult, format: SerializeFormat, options?: SerializeOptions): string;
```

Defined in: serialize/index.ts:256

Serialize a diff result to a supported built-in output format.
Works with zero plugins (no import side effects).

#### Parameters

| Parameter  | Type                                    |
| ---------- | --------------------------------------- |
| `diff`     | [`DiffResult`](#diffresult)             |
| `format`   | [`SerializeFormat`](#serializeformat)   |
| `options?` | [`SerializeOptions`](#serializeoptions) |

#### Returns

`string`
