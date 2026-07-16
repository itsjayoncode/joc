# State

One snapshot for values, errors, field flags, workflow progress, and UI rules — plus undo/redo and diffs.

**Previous:** [Submission](/packages/form-intelligent/modules/submission) · **Next:** [Workflow](/packages/form-intelligent/modules/workflow)

::: tip Playground
[State explorer →](/playground/form-intelligent/state) · [DevTools →](/playground/form-intelligent/devtools)
:::

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

From [Rules](/packages/form-intelligent/modules/rules):

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
form.undo();
form.redo();
```

Wire shortcuts via [Integrations](/packages/form-intelligent/modules/integrations) (`workflow.keyboard` or `createKeyboardPlugin`).

---

## Object diffs

Optional peer `@jayoncode/object-diff`:

```ts
const fromDefaults = await form.diffFromDefaults();
const vsBaseline = await form.diffFrom(savedSnapshot);

// Or include a diff in submit meta:
await form.submit({ includeDiff: true });
```

---

## Export / inspect

```ts
JSON.stringify(form.getFormState(), null, 2);
```

The playground [DevTools](/playground/form-intelligent/devtools) page exports/imports this snapshot shape for local debugging.

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

**Next:** [Workflow](/packages/form-intelligent/modules/workflow) — autosave, drafts, and wizards.
