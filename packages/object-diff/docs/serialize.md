# Serialization

Export diff results for humans, logs, or downstream tools.

**Previous:** [Patching](/packages/object-diff/modules/patch) · **Back to:** [Overview](/packages/object-diff/)

::: tip Try it first
[Open JSON viewer →](/playground/object-diff/json) — inspect serialized output formats.
:::

## In plain English

After `diff()`, use `serialize()` to turn change records into readable JSON, Markdown tables, or other formats — useful for PR descriptions, audit logs, and debugging.

---

## Level 1 — JSON export

```ts
import { diff, serialize } from "@jayoncode/object-diff";

const result = diff(before, after);
const json = serialize(result, "json");
```

---

## Level 2 — Markdown for changelogs

```ts
const markdown = serialize(result, "markdown");
// paste into PR body or release notes
```

---

## Level 3 — Table format

```ts
const table = serialize(result, "table");
// compact tabular view for terminals or docs
```

---

## When to use each format

| Format     | Best for                |
| ---------- | ----------------------- |
| `json`     | APIs, structured logs   |
| `markdown` | PRs, docs, changelogs   |
| `table`    | CLI output, quick scans |

**Done with the guides?** Browse the [API Reference](/packages/object-diff/api/) or [playground examples](/playground/object-diff/examples).
