---
title: Dx
description: Object Diff documentation for Dx.
---

# Developer Experience

Fluent helpers, docs, and playground polish for shipped engines.

## Fluent API (ADR 0006)

```ts
import { diff } from "@jayoncode/object-diff";
import { createDiffView } from "@jayoncode/object-diff/view";

const view = createDiffView(diff(before, after)).exclude(["password"]).updated();

view.serialize("markdown");
view.patch();
view.statistics();
```

- Free functions remain canonical
- `createDiffView` is opt-in on `/view` (not on root — tree-shaking)
- Does not attach methods onto `diff()` return values

## Subpath map

| Import                   | Use                                     |
| ------------------------ | --------------------------------------- |
| `@jayoncode/object-diff` | Core compare/diff/patch/serialize       |
| `/formatter`             | serialize + createSerializer            |
| `/merge`                 | merge engine                            |
| `/query`                 | find/filter/exclude/summary + `query()` |
| `/stats`                 | statistics                              |
| `/plugins`               | createEngine                            |
| `/view`                  | createDiffView                          |

## Errors

Typed `ObjectDiffError` subclasses with `code`. Prefer messages that include path when available. See `ERROR_HANDLING.md`.

## Playground

Interactive explorers cover diff, patch, serialize, performance, and examples (including fluent/view snippets).
