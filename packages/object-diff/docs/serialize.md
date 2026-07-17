# Serialization

Export diff results for humans, logs, or downstream tools.

**Previous:** [Patching](/packages/object-diff/modules/patch) · **Next:** [Engines & entrypoints](/packages/object-diff/modules/engines)

::: tip Playground
[Open JSON viewer →](/playground/object-diff/json) — inspect serialized output formats.
:::

Prefer `@jayoncode/object-diff/formatter` for formatting-focused apps (root still re-exports `serialize`).

## Problem → approach

| Typical pain | `serialize()` |
| ------------ | ------------- |
| `console.log(diffResult)` is noisy and not PR-ready | `serialize(result, "markdown")` for changelogs |
| APIs need JSON; humans need tables or prose | Same `diff()` output, many formats |
| Custom formatters duplicated across tools | Built-ins + `createSerializer` plugins |

## Formats

```ts
import { diff, serialize } from "@jayoncode/object-diff";
// or: import { serialize, createSerializer } from "@jayoncode/object-diff/formatter";

const result = diff(before, after);

serialize(result, "json");
serialize(result, "pretty");
serialize(result, "markdown", { title: "Form changes" });
serialize(result, "table");
serialize(result, "html", { title: "Audit" }); // HTML-escaped
serialize(result, "console"); // ANSI colors; { color: false } to disable
serialize(result, "human"); // short prose + bullets
```

| Format | Best for |
| ------ | -------- |
| `json` / `pretty` | APIs, structured logs |
| `markdown` | PRs, docs, changelogs |
| `table` | CLI / quick scans |
| `html` | Email / docs tables (escaped) |
| `console` | Terminal output |
| `human` | Short summaries |

## Custom formatters

```ts
import { createSerializer } from "@jayoncode/object-diff/formatter";

const serializeWith = createSerializer([
  {
    name: "csv",
    format: (result) =>
      result.changes.map((c) => `${c.type},${c.path}`).join("\n"),
  },
]);

serializeWith(result, "csv");
serializeWith(result, "human"); // built-ins still work
```

No import side effects — pass plugins explicitly. Plugin names must not collide with built-ins.

**Next:** [Engines](/packages/object-diff/modules/engines) — merge, query, stats, plugins, view, and slim `/core`.
