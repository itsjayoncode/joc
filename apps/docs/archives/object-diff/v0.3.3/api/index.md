**@jayoncode/object-diff API**

---

# @jayoncode/object-diff API

## Classes

### ObjectDiffError

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
   options?: ObjectDiffErrorOptions): ObjectDiffError;
```

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

| Property                       | Modifier   | Type                                       |
| ------------------------------ | ---------- | ------------------------------------------ |
| <a id="code"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      |
| <a id="details"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` |

---

### CircularReferenceError

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new CircularReferenceError(message: string, options?: ObjectDiffErrorOptions): CircularReferenceError;
```

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

| Property                         | Modifier   | Type                                       | Inherited from                                              |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- |
| <a id="code-1"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       |
| <a id="details-1"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`ObjectDiffError`](#objectdifferror).[`details`](#details) |

---

### MaxDepthExceededError

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new MaxDepthExceededError(message: string, options?: ObjectDiffErrorOptions): MaxDepthExceededError;
```

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

| Property                         | Modifier   | Type                                       | Inherited from                                              |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- |
| <a id="code-2"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       |
| <a id="details-2"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`ObjectDiffError`](#objectdifferror).[`details`](#details) |

---

### InvalidPatchError

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new InvalidPatchError(message: string, options?: ObjectDiffErrorOptions): InvalidPatchError;
```

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

| Property                         | Modifier   | Type                                       | Inherited from                                              |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- |
| <a id="code-3"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       |
| <a id="details-3"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`ObjectDiffError`](#objectdifferror).[`details`](#details) |

---

### PatchApplyError

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new PatchApplyError(message: string, options?: ObjectDiffErrorOptions): PatchApplyError;
```

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

| Property                         | Modifier   | Type                                       | Inherited from                                              |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- |
| <a id="code-4"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       |
| <a id="details-4"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`ObjectDiffError`](#objectdifferror).[`details`](#details) |

---

### UnsupportedTypeError

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new UnsupportedTypeError(message: string, options?: ObjectDiffErrorOptions): UnsupportedTypeError;
```

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

| Property                         | Modifier   | Type                                       | Inherited from                                              |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- |
| <a id="code-5"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       |
| <a id="details-5"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`ObjectDiffError`](#objectdifferror).[`details`](#details) |

---

### NotImplementedError

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new NotImplementedError(message: string, options?: ObjectDiffErrorOptions): NotImplementedError;
```

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

| Property                         | Modifier   | Type                                       | Inherited from                                              |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- |
| <a id="code-6"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       |
| <a id="details-6"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`ObjectDiffError`](#objectdifferror).[`details`](#details) |

---

### InvalidOptionsError

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new InvalidOptionsError(message: string, options?: ObjectDiffErrorOptions): InvalidOptionsError;
```

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

| Property                         | Modifier   | Type                                       | Inherited from                                              |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- |
| <a id="code-7"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       |
| <a id="details-7"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`ObjectDiffError`](#objectdifferror).[`details`](#details) |

---

### PluginError

#### Extends

- [`ObjectDiffError`](#objectdifferror)

#### Constructors

##### Constructor

```ts
new PluginError(message: string, options?: ObjectDiffErrorOptions): PluginError;
```

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

| Property                         | Modifier   | Type                                       | Inherited from                                              |
| -------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- |
| <a id="code-8"></a> `code`       | `readonly` | `ObjectDiffErrorCode`                      | [`ObjectDiffError`](#objectdifferror).[`code`](#code)       |
| <a id="details-8"></a> `details` | `readonly` | `Readonly`\<`PlainObject`\> \| `undefined` | [`ObjectDiffError`](#objectdifferror).[`details`](#details) |

## Interfaces

### DiffRecord

A single recorded change between two values.

#### Properties

| Property                          | Modifier   | Type                    | Description                                 |
| --------------------------------- | ---------- | ----------------------- | ------------------------------------------- |
| <a id="path-1"></a> `path`        | `readonly` | `string`                | -                                           |
| <a id="type"></a> `type`          | `readonly` | [`DiffType`](#difftype) | -                                           |
| <a id="previous"></a> `previous?` | `readonly` | `unknown`               | -                                           |
| <a id="current"></a> `current?`   | `readonly` | `unknown`               | -                                           |
| <a id="from"></a> `from?`         | `readonly` | `string`                | Source display path when `type` is `moved`. |

---

### DiffMetadata

Metadata collected during a diff operation.

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

### DiffResult

Result of a diff operation.

#### Properties

| Property                         | Modifier   | Type                                   |
| -------------------------------- | ---------- | -------------------------------------- |
| <a id="changes"></a> `changes`   | `readonly` | readonly [`DiffRecord`](#diffrecord)[] |
| <a id="metadata"></a> `metadata` | `readonly` | [`DiffMetadata`](#diffmetadata)        |

---

### DiffOptions

Options for diff and filtered diff helpers.

#### Properties

| Property                                                        | Modifier   | Type                                                      | Description                                                                                  |
| --------------------------------------------------------------- | ---------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| <a id="maxdepth"></a> `maxDepth?`                               | `readonly` | `number`                                                  | -                                                                                            |
| <a id="includeunchanged"></a> `includeUnchanged?`               | `readonly` | `boolean`                                                 | -                                                                                            |
| <a id="detectmoves"></a> `detectMoves?`                         | `readonly` | `boolean`                                                 | When true, pair equal removed+added values into `moved` records (and JSON Patch `move` ops). |
| <a id="circular"></a> `circular?`                               | `readonly` | [`CircularReferenceStrategy`](#circularreferencestrategy) | -                                                                                            |
| <a id="customcomparator-1"></a> `customComparator?`             | `readonly` | [`CustomComparator`](#customcomparator)                   | -                                                                                            |
| <a id="treatundefinedasmissing"></a> `treatUndefinedAsMissing?` | `readonly` | `boolean`                                                 | -                                                                                            |
| <a id="identitykey-1"></a> `identityKey?`                       | `readonly` | [`IdentityKey`](#identitykey)                             | Match array elements by identity instead of index.                                           |
| <a id="ignore"></a> `ignore?`                                   | `readonly` | readonly `string`[]                                       | Skip paths matching these patterns (`*`, `**` supported).                                    |
| <a id="include"></a> `include?`                                 | `readonly` | readonly `string`[]                                       | Only emit/visit paths matching these patterns (ancestors still visited).                     |

---

### CompareOptions

Options for deep equality comparison.

#### Properties

| Property                                            | Modifier   | Type                                                      |
| --------------------------------------------------- | ---------- | --------------------------------------------------------- |
| <a id="maxdepth-1"></a> `maxDepth?`                 | `readonly` | `number`                                                  |
| <a id="circular-1"></a> `circular?`                 | `readonly` | [`CircularReferenceStrategy`](#circularreferencestrategy) |
| <a id="customcomparator-2"></a> `customComparator?` | `readonly` | [`CustomComparator`](#customcomparator)                   |

---

### ResolvedDiffOptions

Normalized diff options used internally.

#### Properties

| Property                                                         | Modifier   | Type                                                      |
| ---------------------------------------------------------------- | ---------- | --------------------------------------------------------- |
| <a id="maxdepth-2"></a> `maxDepth`                               | `readonly` | `number`                                                  |
| <a id="includeunchanged-1"></a> `includeUnchanged`               | `readonly` | `boolean`                                                 |
| <a id="detectmoves-1"></a> `detectMoves`                         | `readonly` | `boolean`                                                 |
| <a id="circular-2"></a> `circular`                               | `readonly` | [`CircularReferenceStrategy`](#circularreferencestrategy) |
| <a id="customcomparator-3"></a> `customComparator`               | `readonly` | [`CustomComparator`](#customcomparator) \| `undefined`    |
| <a id="treatundefinedasmissing-1"></a> `treatUndefinedAsMissing` | `readonly` | `boolean`                                                 |
| <a id="identitykey-2"></a> `identityKey`                         | `readonly` | [`IdentityKey`](#identitykey) \| `undefined`              |
| <a id="ignore-1"></a> `ignore`                                   | `readonly` | readonly `string`[] \| `undefined`                        |
| <a id="include-1"></a> `include`                                 | `readonly` | readonly `string`[] \| `undefined`                        |

---

### ResolvedCompareOptions

Normalized compare options used internally.

#### Properties

| Property                                           | Modifier   | Type                                                      |
| -------------------------------------------------- | ---------- | --------------------------------------------------------- |
| <a id="maxdepth-3"></a> `maxDepth`                 | `readonly` | `number`                                                  |
| <a id="circular-3"></a> `circular`                 | `readonly` | [`CircularReferenceStrategy`](#circularreferencestrategy) |
| <a id="customcomparator-4"></a> `customComparator` | `readonly` | [`CustomComparator`](#customcomparator) \| `undefined`    |

---

### PatchOperation

A single JSON Patch style operation.

#### Properties

| Property                    | Modifier   | Type                                        |
| --------------------------- | ---------- | ------------------------------------------- |
| <a id="op"></a> `op`        | `readonly` | [`PatchOperationType`](#patchoperationtype) |
| <a id="path-2"></a> `path`  | `readonly` | `string`                                    |
| <a id="from-1"></a> `from?` | `readonly` | `string`                                    |
| <a id="value"></a> `value?` | `readonly` | `unknown`                                   |

---

### PatchOptions

Options for patch generation.

#### Properties

| Property                          | Modifier   | Type                          | Description                                                                |
| --------------------------------- | ---------- | ----------------------------- | -------------------------------------------------------------------------- |
| <a id="format"></a> `format?`     | `readonly` | [`PatchFormat`](#patchformat) | -                                                                          |
| <a id="optimize"></a> `optimize?` | `readonly` | `boolean`                     | Coalesce sequential replaces and drop no-op-friendly noise. Default false. |

---

### ApplyPatchOptions

Options for applying patches.

#### Properties

| Property                          | Modifier   | Type      | Description                                     |
| --------------------------------- | ---------- | --------- | ----------------------------------------------- |
| <a id="mutable"></a> `mutable?`   | `readonly` | `boolean` | -                                               |
| <a id="validate"></a> `validate?` | `readonly` | `boolean` | Validate operations before apply. Default true. |

---

### ApplyPatchWithInverseResult

Result of applying a patch while recording a faithful inverse.

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Properties

| Property                       | Modifier   | Type                |
| ------------------------------ | ---------- | ------------------- |
| <a id="value-1"></a> `value`   | `readonly` | `T`                 |
| <a id="inverse"></a> `inverse` | `readonly` | [`Patch`](#patch-3) |

---

### SerializeOptions

Options for serialization.

#### Properties

| Property                    | Modifier   | Type      | Description                                                   |
| --------------------------- | ---------- | --------- | ------------------------------------------------------------- |
| <a id="title"></a> `title?` | `readonly` | `string`  | -                                                             |
| <a id="color"></a> `color?` | `readonly` | `boolean` | When false, `console` format omits ANSI colors. Default true. |

---

### FormatterPlugin

Optional custom formatter registered via `createSerializer` (no import side effects).

#### Properties

| Property                 | Modifier   | Type     |
| ------------------------ | ---------- | -------- |
| <a id="name"></a> `name` | `readonly` | `string` |

#### Methods

##### format()

```ts
format(result: DiffResult, options?: SerializeOptions): string;
```

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

Supported change kinds emitted by the difference engine.

---

### PathSegment

```ts
type PathSegment = string | number;
```

Path segment used for nested value addressing.

---

### Path

```ts
type Path = readonly PathSegment[];
```

Canonical path representation for a nested value.

---

### CircularReferenceStrategy

```ts
type CircularReferenceStrategy = "error" | "skip";
```

How circular references are handled during traversal.

---

### CustomComparator

```ts
type CustomComparator = (a: unknown, b: unknown, path: Path) => boolean | undefined;
```

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
type IdentityKey = string | ((item: unknown, path: Path) => string | number | undefined);
```

Identity key for array element matching (Phase 2).
String form reads a property; function form returns an id or undefined (positional leftover).

---

### PatchOperationType

```ts
type PatchOperationType = "add" | "remove" | "replace" | "move" | "copy" | "test";
```

JSON Patch operation kinds (RFC 6902).

---

### Patch

```ts
type Patch = readonly PatchOperation[];
```

A patch is an ordered list of operations.

---

### PatchFormat

```ts
type PatchFormat = "json-patch" | "merge";
```

Patch generation format.

---

### SerializeFormat

```ts
type SerializeFormat = "json" | "pretty" | "markdown" | "table" | "html" | "console" | "human";
```

Supported serializer output formats.

---

### ValueKind

```ts
type ValueKind =
  "primitive" | "array" | "object" | "date" | "regexp" | "map" | "set" | "typed-array" | "function";
```

Internal value kind for traversal dispatch.

---

### ComparisonOutcome

```ts
type ComparisonOutcome = "equal" | "unequal" | "type-mismatch";
```

Result of comparing two values at a path.

## Functions

### compare()

```ts
function compare(a: unknown, b: unknown, options?: CompareOptions): boolean;
```

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

Fast boolean check for whether two values differ.
Early-exits on the first allowed change; does not allocate a DiffResult.

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
