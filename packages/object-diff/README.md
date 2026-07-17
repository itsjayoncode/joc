# Object Diff — Typed deep comparison and patch generation for structured data.

[![npm version](https://img.shields.io/npm/v/@jayoncode/object-diff.svg)](https://www.npmjs.com/package/@jayoncode/object-diff)
[![license](https://img.shields.io/npm/l/@jayoncode/object-diff.svg)](https://github.com/itsjayoncode/joc/blob/master/packages/object-diff/package.json)
[![docs](https://img.shields.io/badge/docs-itsjayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/packages/object-diff/)

Published as [`@jayoncode/object-diff`](https://www.npmjs.com/package/@jayoncode/object-diff) on npm.

Stop guessing what changed between two objects. Get path-aware change records, fast dirty checks, RFC 6902-style patches, and review-friendly serialization — built for audit trails, optimistic UI, and sync.

## Install

```bash
npm install @jayoncode/object-diff
```

```bash
pnpm add @jayoncode/object-diff
```

## The problem it solves

`JSON.stringify(a) !== JSON.stringify(b)` tells you something changed — not **what**, **where**, or **how to sync it**.

```ts
// ❌ brittle equality / no paths / no patch
JSON.stringify(saved) !== JSON.stringify(draft);
```

`@jayoncode/object-diff` gives you structured changes you can log, review, and apply.

## Quick start — know exactly what changed, then patch it

```ts
import { diff, hasChanges, patch, applyPatch, serialize } from "@jayoncode/object-diff";

const saved = {
  profile: { name: "Ada", role: "admin" },
  prefs: { theme: "dark" },
};
const draft = {
  profile: { name: "Ada Lovelace", role: "admin" },
  prefs: { theme: "dark" },
};

if (hasChanges(saved, draft)) {
  const changes = diff(saved, draft);
  await audit.log(serialize(changes, "markdown"));
  const synced = applyPatch(saved, patch(changes));
}
```

## More problem → solution snippets

### Dirty-check before an expensive save

```ts
import { hasChanges } from "@jayoncode/object-diff";

if (!hasChanges(serverState, localDraft)) {
  return; // nothing to persist
}

await api.save(localDraft);
```

### Build an audit-friendly change list

```ts
import { diff, serialize } from "@jayoncode/object-diff";

const changes = diff(before, after);
console.log(serialize(changes, "table"));
// path | type | before | after
```

### Sync clients with patch operations

```ts
import { diff, patch, applyPatch } from "@jayoncode/object-diff";

const operations = patch(diff(clientA, clientB));
const merged = applyPatch(clientA, operations);
```

## API

| Function                                   | Description                                        |
| ------------------------------------------ | -------------------------------------------------- |
| `diff(a, b, options?)`                     | Structured change list with metadata               |
| `compare(a, b, options?)`                  | Deep equality                                      |
| `hasChanges(a, b, options?)`               | Fast boolean dirty check                           |
| `added`, `removed`, `updated`, `unchanged` | Filtered change views                              |
| `patch(diff, options?)`                    | Generate patch operations                          |
| `applyPatch(target, patch, options?)`      | Apply patch immutably                              |
| `revertPatch(target, patch, options?)`     | Reverse patch operations                           |
| `serialize(diff, format, options?)`        | Export as `json`, `pretty`, `markdown`, or `table` |

## Documentation

- [Official docs](https://itsjayoncode.github.io/joc/packages/object-diff/)
- [Interactive playground](https://itsjayoncode.github.io/joc/playground/object-diff/)

## Repository

**https://github.com/itsjayoncode/joc** · Package path: `packages/object-diff`

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
