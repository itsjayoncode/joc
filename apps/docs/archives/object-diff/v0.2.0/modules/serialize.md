---
title: Serialize
description: Object Diff documentation for Serialize.
---

# Serialization

Export diff results for humans, logs, or downstream tools.

**Previous:** [Patching](/packages/object-diff/modules/patch) · **Back to:** [Overview](/packages/object-diff/overview)

::: tip Playground
[Open JSON viewer →](/playground/object-diff/json) — inspect serialized output formats.
:::

## Problem → approach

| Typical pain                                        | `serialize()`                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `console.log(diffResult)` is noisy and not PR-ready | `serialize(result, "markdown")` for changelogs and review comments |
| APIs need structured payloads; humans need tables   | Same `diff()` output, multiple export formats                      |
| Custom formatters duplicated across tools           | One serializer with `json`, `markdown`, and `table` targets        |

## JSON export

```ts
import { diff, serialize } from "@jayoncode/object-diff";

const result = diff(before, after);
const json = serialize(result, "json");
```

## Markdown for changelogs

```ts
const markdown = serialize(result, "markdown");
// paste into PR body or release notes
```

## Table format

```ts
const table = serialize(result, "table");
// compact tabular view for terminals or docs
```

## When to use each format

| Format     | Best for                |
| ---------- | ----------------------- |
| `json`     | APIs, structured logs   |
| `markdown` | PRs, docs, changelogs   |
| `table`    | CLI output, quick scans |

**Done with the guides?** Browse the [API Reference](/packages/object-diff/api/) or [playground examples](/playground/object-diff/examples).
