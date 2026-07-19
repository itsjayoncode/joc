# Plugins

Opt-in plugin host for custom matchers, formatters, merge strategies, and lifecycle hooks — without mutating global state.

**Previous:** [Statistics](/packages/object-diff/modules/stats) · **Next:** [Integrations](/packages/object-diff/modules/integrations)

## Import path

```ts
import { createEngine } from "@jayoncode/object-diff/plugins";
```

**Not** on the root entry — [Engines](/packages/object-diff/modules/engines). Importing `/plugins` registers nothing by itself; you must call `createEngine({ plugins })` explicitly.

## Problem → approach

| Typical pain                                                 | `createEngine`                                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Custom equality rules scattered across call sites            | Matcher plugins compose into one `customComparator`                       |
| One-off formatters copy-pasted per app                       | Formatter plugins register additional `serialize()` output names          |
| App-specific merge policies bolted onto `merge()` call sites | Named merge strategy plugins, selected by string                          |
| Cross-cutting audit/logging around diff/apply                | `hooks.beforeDiff` / `afterDiff` / `beforeApplyPatch` / `afterApplyPatch` |

## Quick example

```ts
import { createEngine } from "@jayoncode/object-diff/plugins";

const engine = createEngine({
  plugins: [
    {
      name: "case-insensitive-string",
      matchers: [
        (a, b) =>
          typeof a === "string" && typeof b === "string"
            ? a.toLowerCase() === b.toLowerCase()
            : undefined,
      ],
    },
  ],
});

engine.compare("Ada", "ada"); // true
engine.diff({ name: "Ada" }, { name: "ADA" }); // no changes
```

`createEngine()` with no plugins is a valid, fully-functional engine — it just forwards to the core free functions.

## `ObjectDiffPlugin` shape

```ts
interface ObjectDiffPlugin {
  readonly name: string; // required, unique across all plugins passed to createEngine
  readonly matchers?: readonly CustomMatcher[];
  readonly formatters?: readonly FormatterPlugin[];
  readonly mergeStrategies?: readonly MergeStrategyPlugin[];
  readonly hooks?: ObjectDiffPluginHooks;
}
```

Every field besides `name` is optional — a plugin can contribute just one capability (e.g. only a formatter) or several.

### Matchers

```ts
type CustomMatcher = (a: unknown, b: unknown, path: Path) => boolean | undefined;
```

Same contract as `customComparator`: return `true`/`false` to decide equality at that path, or `undefined` to defer. Matchers from all plugins run **before** the caller's own `customComparator` (passed via `compare()`/`diff()` options), in plugin registration order — the first matcher (or the user's comparator) to return a defined value wins.

### Formatters

```ts
interface FormatterPlugin {
  readonly name: string; // must not collide with built-in formats (json, pretty, markdown, table, html, console, human)
  format(result: DiffResult, options?: SerializeOptions): string;
}
```

Registered formatters become valid `format` arguments to `engine.serialize(result, name)`, alongside the built-ins. Two plugins cannot register the same formatter name, and a formatter name cannot shadow a built-in — both raise `InvalidOptionsError` when passed to `createSerializer`/`createEngine`.

### Merge strategies

```ts
interface MergeStrategyPlugin {
  readonly name: string; // cannot be "latest-wins" / "manual" / "custom", or duplicated
  resolve(conflict: MergeConflict): unknown;
}
```

Registered strategies are selected by name via `engine.merge(left, right, { strategy: "your-strategy-name" })` — internally the engine wires your `resolve` into the built-in `custom` strategy. Passing an unknown strategy name throws `InvalidOptionsError`.

```ts
const engine = createEngine({
  plugins: [
    {
      name: "prefer-left",
      mergeStrategies: [{ name: "prefer-left", resolve: (conflict) => conflict.left }],
    },
  ],
});

engine.merge({ x: 1 }, { x: 2 }, { strategy: "prefer-left" }); // → { value: { x: 1 }, conflicts: [...] }
```

### Hooks

```ts
interface ObjectDiffPluginHooks {
  beforeDiff?(context: { a: unknown; b: unknown; options: DiffOptions | undefined }): void;
  afterDiff?(result: DiffResult, context: DiffHookContext): DiffResult | undefined;
  beforeApplyPatch?(context: {
    target: unknown;
    patch: Patch;
    options: ApplyPatchOptions | undefined;
  }): void;
  afterApplyPatch?(value: unknown, context: ApplyPatchHookContext): void;
}
```

- `beforeDiff` / `beforeApplyPatch` run for side effects only (logging, metrics) — their return value is ignored.
- `afterDiff` can **transform** the result: return a new `DiffResult` to replace it, or `undefined` to keep the previous one. Hooks run in plugin registration order, each seeing the previous hook's output.
- `afterApplyPatch` runs after the patch has already been applied; it cannot change the returned value.

```ts
const engine = createEngine({
  plugins: [
    {
      name: "redact-secret",
      hooks: {
        afterDiff: (result) => ({
          ...result,
          changes: result.changes.filter((c) => c.path !== "secret"),
        }),
      },
    },
  ],
});
```

## Composition

Pass multiple plugins in one `createEngine({ plugins: [...] })` call — matchers compose into a single chained comparator, formatters/merge strategies are merged into one lookup table, and hooks of the same kind run in array order. Plugin `name`s must be unique across the whole list; a duplicate name throws `PluginError` at `createEngine()` time (before any diff/apply/merge call).

```ts
const engine = createEngine({
  plugins: [auditPlugin, csvFormatterPlugin, caseInsensitiveMatcherPlugin],
});

engine.plugins; // ["audit", "csv-formatter", "case-insensitive-matcher"] — registration order preserved
```

## Errors

| Error                 | Thrown when                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `PluginError`         | Duplicate/invalid plugin `name`, invalid matcher/merge-strategy shape, or a hook callback throws (the original error is wrapped as `cause`) |
| `InvalidOptionsError` | Unknown merge strategy name passed to `engine.merge()`, or a formatter name collision                                                       |

```ts
import { PluginError } from "@jayoncode/object-diff/plugins";

try {
  createEngine({ plugins: [{ name: "x" }, { name: "x" }] });
} catch (error) {
  if (error instanceof PluginError) {
    // duplicate plugin name "x"
  }
}
```

## `EngineApi`

`createEngine()` returns an object mirroring the core free functions, plus `plugins` (registered names) and a `merge` that understands plugin strategy names:

```ts
interface EngineApi {
  readonly plugins: readonly string[];
  compare(a: unknown, b: unknown, options?: CompareOptions): boolean;
  diff(a: unknown, b: unknown, options?: DiffOptions): DiffResult;
  hasChanges(a: unknown, b: unknown, options?: DiffOptions): boolean;
  patch(diffResult: DiffResult, options?: PatchOptions): Patch;
  applyPatch<T>(target: T, operations: Patch, options?: ApplyPatchOptions): T;
  serialize(diffResult: DiffResult, format: string, options?: SerializeOptions): string;
  merge(left: unknown, right: unknown, options?: EngineMergeOptions): MergeResult;
}
```

## Pitfalls

- `createEngine` performs **no** global registration — plugins only apply to calls made through the returned engine instance, never to the root `diff`/`compare`/`serialize` free functions.
- Matchers run before the caller's `customComparator`, not after — a matcher that returns a defined value short-circuits the user's own comparator for that path.
- Hook exceptions are always re-thrown as `PluginError` (never the raw error), so `catch`-by-type should target `PluginError` and inspect `.cause`.

## Related

- [Engines](/packages/object-diff/modules/engines) · [Merge](/packages/object-diff/modules/merge) · [Serialization](/packages/object-diff/modules/serialize)
- [Integrations](/packages/object-diff/modules/integrations) — "Optional plugin host" section
