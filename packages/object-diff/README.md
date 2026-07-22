# Object Diff

**Stop guessing what changed. Get paths, patches, and review-ready output.**

[`@jayoncode/object-diff`](https://www.npmjs.com/package/@jayoncode/object-diff) — typed, framework-agnostic deep comparison for structured data.

[![npm version](https://img.shields.io/npm/v/@jayoncode/object-diff.svg)](https://www.npmjs.com/package/@jayoncode/object-diff)
[![license](https://img.shields.io/npm/l/@jayoncode/object-diff.svg)](https://github.com/itsjayoncode/joc/blob/master/packages/object-diff/package.json)
[![docs](https://img.shields.io/badge/docs-jayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/packages/object-diff/)
[![Become a Sponsor](https://img.shields.io/badge/Become%20a%20Sponsor-%23ea4aaa?style=flat&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/jayoncoding)

Path-aware change records, fast dirty checks, RFC 6902-style patches, and DiffView — built for audit trails, optimistic UI, and snapshot sync between clients.

> **`DiffResult` is plain data. DiffView is DX. Engines are opt-in.**  
> Not a CRDT / live collaboration runtime.

## Compare → Review → Patch → Merge

```text
diff / hasChanges
    ↓
DiffView (explain · serialize · stats)
    ↓
patch / applyPatch · merge (optional)
```

| Pillar      | What you get                                            |
| ----------- | ------------------------------------------------------- |
| **Compare** | Typed deep diff, moves, identity keys, ignore / include |
| **Review**  | DiffView `explain()`, serialize, statistics             |
| **Patch**   | RFC 6902 generate / validate / apply / inverse          |
| **Merge**   | Snapshot two-/three-way merge with structured conflicts |

### Five capabilities

| Card                 | What it is                                                    |
| -------------------- | ------------------------------------------------------------- |
| **Typed deep diff**  | Path-aware records; Dates / Maps / Sets; ignore / include     |
| **Intuitive moves**  | Reorders and key reshapes as `moved` when `detectMoves` is on |
| **Dirty checks**     | Fast `hasChanges` without allocating a full change list       |
| **RFC 6902 patches** | Generate, validate, apply, inverse                            |
| **DiffView toolbox** | `explain`, serialize, patch, statistics on `/view`            |

## Install

```bash
npm install @jayoncode/object-diff
```

```bash
pnpm add @jayoncode/object-diff
```

## The problem it solves

`JSON.stringify(a) !== JSON.stringify(b)` tells you something changed — not **what**, **where**, or **how to propagate it**.

```ts
// brittle equality / no paths / no patch
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
  const next = applyPatch(saved, patch(changes));
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

### Propagate updates with patch operations

```ts
import { diff, patch, applyPatch } from "@jayoncode/object-diff";

const operations = patch(diff(clientA, clientB));
const next = applyPatch(clientA, operations);
```

## API

| Function                                   | Description                                             |
| ------------------------------------------ | ------------------------------------------------------- |
| `diff(a, b, options?)`                     | Structured change list with metadata                    |
| `compare(a, b, options?)`                  | Deep equality                                           |
| `hasChanges(a, b, options?)`               | Fast boolean dirty check                                |
| `added`, `removed`, `updated`, `unchanged` | Filtered change views                                   |
| `patch(diff, options?)`                    | Generate patch operations                               |
| `applyPatch(target, patch, options?)`      | Apply patch immutably                                   |
| `revertPatch(target, patch, options?)`     | Reverse patch operations                                |
| `serialize(diff, format, options?)`        | Export as json/pretty/markdown/table/html/console/human |

### Optional engines (subpaths)

| Import                             | API                                                         |
| ---------------------------------- | ----------------------------------------------------------- |
| `@jayoncode/object-diff/core`      | Slim `diff` / `compare` / `hasChanges` (no patch/serialize) |
| `@jayoncode/object-diff/patch`     | `patch` / `applyPatch` / validate / optimize                |
| `@jayoncode/object-diff/merge`     | `merge`                                                     |
| `@jayoncode/object-diff/query`     | `find` / `filter` / `query`                                 |
| `@jayoncode/object-diff/stats`     | `statistics`                                                |
| `@jayoncode/object-diff/formatter` | `serialize` / `createSerializer`                            |
| `@jayoncode/object-diff/plugins`   | `createEngine`                                              |
| `@jayoncode/object-diff/view`      | `createDiffView` + `explain()` (fluent toolbox)             |

```ts
import { diff } from "@jayoncode/object-diff";
import { createDiffView } from "@jayoncode/object-diff/view";

const view = createDiffView(diff(a, b, { detectMoves: true, identityKey: "id" }));
view.explain({ format: "human", identityKey: "id" });
view.serialize("markdown");
```

## Documentation

- [Official docs](https://itsjayoncode.github.io/joc/packages/object-diff/)
- [Interactive playground](https://itsjayoncode.github.io/joc/playground/object-diff/)

## Repository

**https://github.com/itsjayoncode/joc** · Package path: `packages/object-diff`

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
