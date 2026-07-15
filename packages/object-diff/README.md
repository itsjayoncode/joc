# Object Diff — Typed deep comparison and patch generation for structured data.

[![docs](https://img.shields.io/badge/docs-itsjayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/packages/object-diff/)

`@jayoncode/object-diff` is a framework-agnostic TypeScript library for comparing structured data, reporting detailed changes, and generating JSON Patch operations.

## Install

```bash
npm install @jayoncode/object-diff
```

## Quick start

```ts
import { diff, hasChanges, patch, applyPatch } from "@jayoncode/object-diff";

const before = { user: { name: "John" } };
const after = { user: { name: "Jane" } };

if (hasChanges(before, after)) {
  const result = diff(before, after);
  const operations = patch(result);
  const next = applyPatch(before, operations);
}
```

## API

| Function                                   | Description                                |
| ------------------------------------------ | ------------------------------------------ |
| `diff(a, b, options?)`                     | Structured change list with metadata       |
| `compare(a, b, options?)`                  | Deep equality                              |
| `hasChanges(a, b, options?)`               | Fast boolean check                         |
| `added`, `removed`, `updated`, `unchanged` | Filtered change views                      |
| `patch(diff, options?)`                    | Generate patch operations                  |
| `applyPatch(target, patch, options?)`      | Apply patch immutably                      |
| `revertPatch(target, patch, options?)`     | Reverse patch operations                   |
| `serialize(diff, format, options?)`        | Export as json, pretty, markdown, or table |

## Documentation

- [Official docs](https://itsjayoncode.github.io/joc/packages/object-diff/)
- [Interactive playground](https://itsjayoncode.github.io/joc/playground/object-diff/)

## License

MIT
