# Package overview

**Stop guessing what changed. Get paths, patches, and review-ready output.**

Typed deep comparison, change records, JSON Patch, DiffView, and optional engines for merge, query, and stats.

`DiffResult` is plain data. DiffView is DX. Merge and other engines are opt-in subpaths — not a CRDT / live sync runtime.

## When to use

- Dirty checks, audit trails, optimistic UI sync, RFC 6902 patches between clients
- Collaborative drafts that need conflict-aware merge (`/merge`)
- Filtering or summarizing an existing `DiffResult` (`/query`, `/stats`)

## When not to use

- Shallow equality on primitives or a single known key (`===` / lodash `isEqual` may be enough)
- Full CRDT / OT collaboration runtimes — this is snapshot merge + patch, not a live sync protocol
- Binary blob / stream diffs — comparison walks structured values (objects, arrays, `Map`, `Set`, `Date`, `RegExp`, typed arrays), not arbitrary byte streams or file diffs

## Features

- `diff` / `hasChanges` / `compare` with typed change records and paths
- RFC 6902 `patch` / `applyPatch` (root or `/patch`)
- `serialize` to JSON, Markdown, table, HTML, console, human
- **DiffView** (`/view`): fluent filter → explain → serialize → patch → stats
- Opt-in engines: `/merge`, `/query`, `/stats`, `/view`, `/plugins`, `/formatter`

## Install

```bash
npm install @jayoncode/object-diff
```

```bash
pnpm add @jayoncode/object-diff
```

```bash
yarn add @jayoncode/object-diff
```

## Example: detect changes and apply a patch

```ts
import { diff, hasChanges, patch, applyPatch } from "@jayoncode/object-diff";

const before = { user: { name: "John", role: "viewer" }, active: true };
const after = { user: { name: "Jane", role: "admin" }, active: true };

if (hasChanges(before, after)) {
  const result = diff(before, after);
  const operations = patch(result);
  const synced = applyPatch(before, operations);
  // synced matches `after` for tracked paths
}
```

Use `diff()` for audit trails and inspectors; `hasChanges()` for dirty checks; `patch()` / `applyPatch()` to propagate updates between stores or clients.

### Review with DiffView

```ts
import { diff } from "@jayoncode/object-diff";
import { createDiffView } from "@jayoncode/object-diff/view";

const view = createDiffView(diff(before, after, { detectMoves: true }));
view.explain({ format: "human" }); // review text
view.serialize("markdown");
view.patch();
```

Slim entry: `@jayoncode/object-diff/core` (compare/diff only). Patch domain: `@jayoncode/object-diff/patch`. Fluent toolbox: `@jayoncode/object-diff/view`.

[Inspect changes interactively →](/playground/object-diff/)

## Problem → approach

| Typical pain                                                                    | Object Diff                                                                |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `JSON.stringify(a) !== JSON.stringify(b)` — no paths, no types, order-sensitive | `diff()` returns typed change records with paths (`user.name`, `items[2]`) |
| Hand-rolled deep equality and patch logic for optimistic UI                     | `patch()` / `applyPatch()` emit and apply RFC 6902 operations              |
| Explaining what changed in PRs or logs requires custom formatting               | `createDiffView(result).explain()` / `serialize()`                         |
| Collaborative drafts need conflict-aware combine                                | `@jayoncode/object-diff/merge`                                             |

## Overview

Object Diff compares structured values — plain objects, arrays, `Date`, `RegExp`, `Map`, `Set`, and typed arrays, not just JSON-safe primitives — emits structured **change records**, and can serialize results or produce [RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902)-style patch operations (`add` / `remove` / `replace` / `move` / `copy` / `test`).

| API                       | Purpose                                               |
| ------------------------- | ----------------------------------------------------- |
| `diff(a, b)`              | Full change list with paths and types                 |
| `hasChanges(a, b)`        | Boolean dirty check without full diff cost            |
| `createDiffView(result)`  | Fluent explain / filter / serialize / patch (`/view`) |
| `patch(diffResult)`       | Generate patch operations                             |
| `applyPatch(target, ops)` | Immutable apply                                       |
| `serialize(diff, format)` | JSON, Markdown, table, and more                       |

Optional engines: `/merge`, `/query`, `/stats`, `/formatter`, `/plugins`, `/view` — see [Engines](/packages/object-diff/modules/engines).

Root import of merge/query/stats/plugins/view is **not** supported — use the subpath.

## Documentation path

### Foundation

| #   | Guide                                                     | Topics                      | Playground                                                             |
| --- | --------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------- |
| 1   | [Tutorial](/packages/object-diff/modules/getting-started) | Install, first diff         | [Lab](/playground/object-diff/)                                        |
| 2   | [Core concepts](/packages/object-diff/modules/concepts)   | Snapshots, changes, patches | [Lab](/playground/object-diff/) / [Diff](/playground/object-diff/diff) |

### Core APIs

| #   | Guide                                                    | Topics                       | Playground                                                               |
| --- | -------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------ |
| 3   | [Diffing](/packages/object-diff/modules/diff)            | Options, moves, filters      | Lab **Moves** tab / [Diff](/playground/object-diff/diff)                 |
| 4   | [Patching](/packages/object-diff/modules/patch)          | RFC ops, validate, optimize  | [Lab](/playground/object-diff/) / [Patch](/playground/object-diff/patch) |
| 5   | [Serialization](/packages/object-diff/modules/serialize) | Formats + custom serializers | [Lab](/playground/object-diff/) / [JSON](/playground/object-diff/json)   |

### Engines

| #   | Guide                                                      | Topics                      | Playground                                        |
| --- | ---------------------------------------------------------- | --------------------------- | ------------------------------------------------- |
| 6   | [DX / DiffView](/packages/object-diff/modules/dx)          | `explain`, fluent toolbox   | Lab **Explain** tab                               |
| 7   | [Engines](/packages/object-diff/modules/engines)           | Subpath map                 | —                                                 |
| 8   | [Merge](/packages/object-diff/modules/merge)               | Two-/three-way strategies   | Lab **Merge** tab                                 |
| 9   | [Query](/packages/object-diff/modules/query)               | Filter existing DiffResults | —                                                 |
| 10  | [Statistics](/packages/object-diff/modules/stats)          | Metrics, hot prefixes       | —                                                 |
| 11  | [Plugins](/packages/object-diff/modules/plugins)           | Matchers, formatters, hooks | —                                                 |
| 12  | [Integrations](/packages/object-diff/modules/integrations) | Forms, session, audit       | [Examples](/playground/object-diff/examples)      |
| 13  | [Performance](/packages/object-diff/modules/performance)   | Complexity, budgets         | [Benchmarks](/playground/object-diff/performance) |

## Mental model (compare → changes → patch)

| Need                   | Prefer                                             |
| ---------------------- | -------------------------------------------------- |
| Boolean dirty check    | `hasChanges(a, b)`                                 |
| Structured change list | `diff(a, b)` → `.changes`                          |
| Equality of two values | `compare(a, b)`                                    |
| RFC 6902 operations    | `patch(diffResult)` then `applyPatch(target, ops)` |

Form Intelligence can call these via plugins / `form.diffFrom*` without coupling cores — [FI composition recipe](/packages/form-intelligence/modules/patterns#composition-dirty-audit--patch-object-diff).

## Package fit

| Requirement                  | API                                           |
| ---------------------------- | --------------------------------------------- |
| Form/state dirty detection   | `hasChanges(a, b)`                            |
| Structured audit log         | `diff()` change records                       |
| Partial sync between clients | `patch()` + `applyPatch()`                    |
| Human-readable changelogs    | `createDiffView(...).explain()` / `serialize` |
| Collaborative merge          | `merge` from `/merge`                         |
| Slim compare-only bundle     | `@jayoncode/object-diff/core`                 |

## Reference

- [API (TypeDoc)](/packages/object-diff/api/)
- [Playground guide](/packages/object-diff/playground/playground)
- [Examples](/playground/object-diff/examples)
- [Draft Desk](https://jayoncode.com/draft-desk) — official reference app (review-before-submit with Object Diff)
