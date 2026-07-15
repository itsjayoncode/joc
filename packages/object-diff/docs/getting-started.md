# Tutorial — your first diff

Install, compare snapshots, check dirty state, and apply a patch.

**Previous:** [Core concepts](/packages/object-diff/modules/concepts) · **Next:** [Diffing](/packages/object-diff/modules/diff)

::: info Playground
[Diff explorer](/playground/object-diff/diff) — same workflow with interactive JSON editors.
:::

**Prerequisites:** Node 20+, ESM or TypeScript project.

---

## Step 1 — Install

```bash
npm install @jayoncode/object-diff
```

**Outcome:** Package available for import.

---

## Step 2 — Compare two objects

```ts
import { diff } from "@jayoncode/object-diff";

const before = { name: "John", tags: ["alpha"] };
const after = { name: "Jane", tags: ["alpha", "beta"] };

const result = diff(before, after);
console.log(result.changes);
```

**Outcome:** Structured change list with path, type, and values per mutation.

---

## Step 3 — Dirty check

```ts
import { hasChanges } from "@jayoncode/object-diff";

if (hasChanges(before, after)) {
  // skip render, trigger autosave, etc.
}
```

**Outcome:** Boolean guard without building full change records.

---

## Step 4 — Patch round-trip

```ts
import { diff, patch, applyPatch } from "@jayoncode/object-diff";

const result = diff(before, after);
const operations = patch(result);
const updated = applyPatch({ ...before }, operations);
```

**Outcome:** `updated` reflects `after` for tracked paths.

---

## Recap

| Step | API                    | Result               |
| ---- | ---------------------- | -------------------- |
| 1    | `npm install`          | Dependency installed |
| 2    | `diff(a, b)`           | Change records       |
| 3    | `hasChanges(a, b)`     | Dirty flag           |
| 4    | `patch` + `applyPatch` | Minimal update ops   |

## Continue

| Topic               | Guide                                                    | Playground                             |
| ------------------- | -------------------------------------------------------- | -------------------------------------- |
| Options & filtering | [Diffing](/packages/object-diff/modules/diff)            | [Diff](/playground/object-diff/diff)   |
| Revert & edge cases | [Patching](/packages/object-diff/modules/patch)          | [Patch](/playground/object-diff/patch) |
| Export formats      | [Serialization](/packages/object-diff/modules/serialize) | [JSON](/playground/object-diff/json)   |

[Examples](/playground/object-diff/examples) · [Benchmarks](/playground/object-diff/performance)
