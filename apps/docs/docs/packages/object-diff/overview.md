---
title: Object Diff overview
description: "Documentation overview for @jayoncode/object-diff."
---

# Package overview

Typed deep comparison, change records, and JSON Patch generation for structured snapshots.

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

[Inspect changes interactively →](/playground/object-diff/diff)

## Problem → approach

| Typical pain                                                                    | Object Diff                                                                |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `JSON.stringify(a) !== JSON.stringify(b)` — no paths, no types, order-sensitive | `diff()` returns typed change records with paths (`user.name`, `items[2]`) |
| Hand-rolled deep equality and patch logic for optimistic UI                     | `patch()` / `applyPatch()` emit and apply RFC 6902 operations              |
| Explaining what changed in PRs or logs requires custom formatting               | `serialize()` exports JSON, Markdown, or table views from the same diff    |

## Overview

Object Diff compares plain objects and arrays, emits structured **change records**, and can serialize results or produce [RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902)-style patch operations.

| API                       | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `diff(a, b)`              | Full change list with paths and types      |
| `hasChanges(a, b)`        | Boolean dirty check without full diff cost |
| `patch(diffResult)`       | Generate patch operations                  |
| `applyPatch(target, ops)` | Immutable apply                            |
| `serialize(diff, format)` | JSON, Markdown, or table export            |

## Documentation path

### Foundation

| #   | Guide                                                     | Topics                      | Playground                            |
| --- | --------------------------------------------------------- | --------------------------- | ------------------------------------- |
| 1   | [Tutorial](/packages/object-diff/modules/getting-started) | Install, first diff         | [Dashboard](/playground/object-diff/) |
| 2   | [Core concepts](/packages/object-diff/modules/concepts)   | Snapshots, changes, patches | [Diff](/playground/object-diff/diff)  |

### Core APIs

| #   | Guide                                           | Topics                      | Playground                             |
| --- | ----------------------------------------------- | --------------------------- | -------------------------------------- |
| 3   | [Diffing](/packages/object-diff/modules/diff)   | Options, filtering, helpers | [Diff](/playground/object-diff/diff)   |
| 4   | [Patching](/packages/object-diff/modules/patch) | Apply, revert, edge cases   | [Patch](/playground/object-diff/patch) |

### Output and performance

| #   | Guide                                                    | Topics                  | Playground                                        |
| --- | -------------------------------------------------------- | ----------------------- | ------------------------------------------------- |
| 5   | [Serialization](/packages/object-diff/modules/serialize) | Export formats          | [JSON](/playground/object-diff/json)              |
| 6   | Performance                                              | Large-object benchmarks | [Benchmarks](/playground/object-diff/performance) |

## Package fit

| Requirement                  | API                          |
| ---------------------------- | ---------------------------- |
| Form/state dirty detection   | `hasChanges(a, b)`           |
| Structured audit log         | `diff()` change records      |
| Partial sync between clients | `patch()` + `applyPatch()`   |
| Human-readable changelogs    | `serialize(..., "markdown")` |

## Reference

- [API (TypeDoc)](/packages/object-diff/api/)
- [Playground guide](/packages/object-diff/playground/playground)
- [Examples](/playground/object-diff/examples)
