# Tutorial — your first diff

Compare two objects in four steps.

**Previous:** [Core concepts](/packages/object-diff/modules/concepts) · **Next:** [Diffing](/packages/object-diff/modules/diff)

::: tip Learn by doing
Keep the [Diff playground](/playground/object-diff/diff) open — try the same steps with interactive JSON editors.
:::

---

## Step 1 — Install

```bash
npm install @jayoncode/object-diff
```

✅ **You now have** the package ready to import.

---

## Step 2 — Compare two objects

```ts
import { diff } from "@jayoncode/object-diff";

const before = { name: "John", tags: ["alpha"] };
const after = { name: "Jane", tags: ["alpha", "beta"] };

const result = diff(before, after);
console.log(result.changes);
```

Each item in `changes` describes one edit — path, type, and values.

✅ **You now have** a list of structured changes between snapshots.

---

## Step 3 — Quick dirty check

When you only need yes/no (not the full list):

```ts
import { hasChanges } from "@jayoncode/object-diff";

if (hasChanges(before, after)) {
  console.log("State is dirty — save or diff");
}
```

✅ **You now have** a fast guard for autosave and re-render logic.

---

## Step 4 — Generate a patch

Turn changes into JSON Patch operations:

```ts
import { diff, patch, applyPatch } from "@jayoncode/object-diff";

const result = diff(before, after);
const operations = patch(result);

const updated = applyPatch({ ...before }, operations);
// updated matches `after`
```

✅ **You now have** a round-trip: diff → patch → apply.

---

## Recap

| Step | API                        | Purpose             |
| ---- | -------------------------- | ------------------- |
| 1    | `npm install`              | Add package         |
| 2    | `diff(a, b)`               | Full change list    |
| 3    | `hasChanges(a, b)`         | Boolean dirty check |
| 4    | `patch()` + `applyPatch()` | Minimal update ops  |

## What to learn next

| Goal                      | Guide                                                    | Playground                             |
| ------------------------- | -------------------------------------------------------- | -------------------------------------- |
| Diff options & filtering  | [Diffing](/packages/object-diff/modules/diff)            | [Try →](/playground/object-diff/diff)  |
| Revert & patch edge cases | [Patching](/packages/object-diff/modules/patch)          | [Try →](/playground/object-diff/patch) |
| Export for humans         | [Serialization](/packages/object-diff/modules/serialize) | [Try →](/playground/object-diff/json)  |

::: info Stuck?
Browse [examples](/playground/object-diff/examples) or run [benchmarks](/playground/object-diff/performance) to see large-object behavior.
:::
