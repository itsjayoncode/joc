# State

One snapshot for values, errors, field flags, workflow progress, and UI rules — plus undo/redo and diffs.

**Previous:** [Submission](/packages/form-intelligence/modules/submission) · **Next:** [Workflow](/packages/form-intelligence/modules/workflow)

::: tip Playground
[State explorer →](/playground/form-intelligence/state) · [DevTools →](/playground/form-intelligence/devtools)
:::

## Import path

Use `form.state` / `form.subscribe()` from the main package. Store primitives: `@jayoncode/form-intelligence/state`. History: prefer `form.undo()` / `form.redo()` over `/history` unless you need low-level stacks. [Entrypoints](/packages/form-intelligence/modules/entrypoints).

```ts
import { createForm } from "@jayoncode/form-intelligence";
```

## Problem → solution

| Problem                        | Solution                                                 |
| ------------------------------ | -------------------------------------------------------- |
| UI and store drift apart       | `form.state` / `getSnapshot()` as single source of truth |
| Need unsaved / touched UX      | Field meta maps (`dirty`, `touched`, `visited`)          |
| Undo edits or compare versions | History helpers and object-diff integration              |

## Form snapshot

```ts
const state = form.state; // same as form.getFormState() / form.getSnapshot()

state.values;
state.errors;
state.isValid;
state.isDirty;
state.isSubmitting;
state.isValidating;
state.submitCount;
```

Subscribe when you own rendering:

```ts
form.subscribe(() => {
  render(form.state);
});
```

Or declare listeners at create time (same store; lives until `destroy()`; fires once immediately):

```ts
createForm({
  initialValues: { email: "" },
  subscribe: (form) => {
    render(form.state);
  },
  // or multiple: subscribe: [(form) => { … }, (form) => { … }],
});
```

Framework adapters subscribe for you — prefer `useForm()` / `useFormState()` in React.

---

## Field flags

| Map               | Meaning                              |
| ----------------- | ------------------------------------ |
| `touched`         | Blurred after focus                  |
| `dirty`           | Value ≠ initial                      |
| `visited`         | Focused at least once                |
| `changed`         | Changed since last successful submit |
| `fieldMeta[path]` | Per-field meta (`isValidating`, …)   |

```ts
form.state.touched.email;
form.state.dirty.email;
form.state.fieldMeta.username?.isValidating;
form.getFieldState("email");
form.getFieldMeta("email");
```

Typical UX: show errors only when `touched` or after submit.

---

## Conditional UI maps

From [Rules](/packages/form-intelligence/modules/rules):

```ts
form.state.fieldUi; // per-field visible / disabled / required / options
form.state.fieldOptions; // select options from populate()
form.state.ui; // { submitDisabled }
```

---

## Workflow slice

```ts
const w = form.state.workflow;
w.currentStep;
w.totalSteps;
w.progress; // 0–100
w.canGoNext;
w.canGoPrev;
w.isAutosaving;
w.lastAutosaveAt;
```

---

## Dirty tracking and leave guards

```ts
if (form.isDirty()) {
  // prompt before navigation
}

form.changedFields(); // vs initial values
form.changedSinceSubmitFields(); // vs last successful submit
```

---

## Undo / redo

Value history is recorded on `setValue` (opt out with `{ recordHistory: false }`).

```ts
form.setValue("email", "a@b.com"); // records history, marks dirty
form.setValue("email", "a@b.com", { recordHistory: false, markDirty: false });

form.undo();
form.redo();

form.reset(); // back to initial values
form.reset({ values: { email: "" }, keepDirty: true });
```

| API / option                    | Effect                                                   |
| ------------------------------- | -------------------------------------------------------- |
| `setValue(path, value)`         | Updates value; records history; marks dirty by default   |
| `SetValueOptions.recordHistory` | Default `true` — set `false` for silent patches          |
| `SetValueOptions.markDirty`     | Default `true` — set `false` to keep dirty map unchanged |
| `ResetOptions.values`           | Partial override used as the new baseline                |
| `ResetOptions.keepDirty`        | When `true`, do not clear dirty flags after reset        |

Wire shortcuts via [Integrations](/packages/form-intelligence/modules/integrations) (`workflow.keyboard` or `createKeyboardPlugin`).

---

## Checkpoints

Durable snapshots for “save progress / restore later” — **not** the same as `getSnapshot()` (external-store identity for React/`useSyncExternalStore`).

```ts
const checkpoint = form.createCheckpoint({
  include: ["values", "errors", "touched", "dirty", "visited", "fieldUi", "workflow"],
});

form.restoreCheckpoint(checkpoint, {
  restoreMeta: true, // restore touched/dirty/visited/errors/fieldUi/workflow when present
  recordHistory: true, // push restore onto undo stack
});
```

| API                                      | Notes                                                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `createCheckpoint(options?)`             | Returns `{ version: 1, kind: "checkpoint", capturedAt, values, … }`                                                       |
| `include`                                | Default **`["values"]` only** — add `"errors"`, `"touched"`, `"dirty"`, `"visited"`, `"fieldUi"`, `"workflow"` explicitly |
| `restoreCheckpoint(cp, opts?)`           | Applies values; `restoreMeta` defaults **true** when slices were captured                                                 |
| `RestoreCheckpointOptions.recordHistory` | Push restore onto undo stack when `true`                                                                                  |
| `getSnapshot()` / `form.state`           | Live store view — identity may change; not durable serialization                                                          |

Prefer checkpoints for explicit save/restore UX. Prefer `getSnapshot()` for subscriptions and DevTools.

---

## Object diffs

Optional peer `@jayoncode/object-diff`:

```ts
const fromDefaults = await form.diffFromDefaults({
  maxDepth: 8,
  treatUndefinedAsMissing: true,
});
const vsBaseline = await form.diffFrom(savedSnapshot);

// Or include a diff in submit meta:
await form.submit({ includeDiff: true });
```

| `FormDiffOptions`         | Meaning                                    |
| ------------------------- | ------------------------------------------ |
| `maxDepth`                | Cap recursion depth                        |
| `includeUnchanged`        | Include `unchanged` records                |
| `treatUndefinedAsMissing` | Passed through to `@jayoncode/object-diff` |

For submit-time audit callbacks, see [`createObjectDiffPlugin`](/packages/form-intelligence/modules/integrations#object-diff-plugin) in Integrations.

---

## Export / inspect

```ts
JSON.stringify(form.getFormState(), null, 2);
```

The playground [DevTools](/playground/form-intelligence/devtools) page exports/imports this snapshot shape for local debugging.

---

## Element structure

Wire chrome around the form to `form.state` flags:

### React JSX

```tsx
<header>
  {form.state.isDirty ? <span>Unsaved changes</span> : <span>Saved</span>}
  <button type="button" onClick={() => form.undo()}>Undo</button>
  <button type="button" onClick={() => form.redo()}>Redo</button>
</header>

<form {...form.form()}>
  <label>
    Email
    <input {...form.field("email")} />
    {form.state.touched.email && form.state.errors.email ? (
      <span role="alert">{form.state.errors.email}</span>
    ) : null}
  </label>
</form>
```

### Native HTML

```html
<p id="dirty-flag" hidden>Unsaved changes</p>
<form id="profile">
  <input name="email" />
</form>
```

```ts
form.subscribe(() => {
  document.querySelector("#dirty-flag").hidden = !form.state.isDirty;
});
```

**Next:** [Workflow](/packages/form-intelligence/modules/workflow) — autosave, drafts, and wizards.
