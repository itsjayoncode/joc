---
title: Workflow
description: Form Intelligent documentation for Workflow.
---

# Workflow

Autosave, drafts, wizards, progress, and related workflow config.

**Previous:** [State](/packages/form-intelligent/modules/state) · **Next:** [Rules](/packages/form-intelligent/modules/rules)

::: tip Playground
[Workflow explorer →](/playground/form-intelligent/workflow) — autosave debounce, draft restore, wizard steps.
:::

## Problem → solution

| Problem                                   | Solution            |
| ----------------------------------------- | ------------------- |
| Debounced draft save duplicated per form  | `workflow.autosave` |
| Lose progress on reload                   | `workflow.draft`    |
| Multi-step forms with per-step validation | `workflow.wizard`   |

## Overview

| Feature        | Use case                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------- |
| `autosave`     | Debounced persistence on value change                                                        |
| `draft`        | Restore values after navigation or reload                                                    |
| `wizard`       | Step index with per-step validation                                                          |
| `offlineQueue` | Queue submits while offline ([Submission](/packages/form-intelligent/modules/submission))    |
| `keyboard`     | Shortcut actions ([Integrations](/packages/form-intelligent/modules/integrations))           |
| `analytics`    | Drop-off / error snapshots ([Integrations](/packages/form-intelligent/modules/integrations)) |

Conditional show/hide lives in [Rules](/packages/form-intelligent/modules/rules) (`when()`), not in workflow config.

---

## Autosave

```ts
createForm({
  initialValues: { notes: "" },
  workflow: {
    autosave: {
      enabled: true,
      debounceMs: 500,
      onSave: async (values) => {
        await api.saveDraft(values);
      },
    },
  },
});
```

Status: `form.state.workflow.isAutosaving`, `form.state.workflow.lastAutosaveAt`.

Plugin hook: `api.on("onAutosave", …)` — see [Plugins](/packages/form-intelligent/modules/plugins).

---

## Draft restore

Persists to storage and merges on next visit:

```ts
workflow: {
  draft: {
    enabled: true,
    storageKey: "signup-draft-v1",
    onRestore: (values) => console.log("Welcome back!", values),
    // promptOnRestore: true,
    // onRestorePrompt: (values) => window.confirm("Restore draft?"),
  },
},
```

Manual: `form.saveDraft()`.

::: info Try it
Fill fields in the [Workflow playground](/playground/form-intelligent/workflow), reload — the draft comes back.
:::

---

## Multi-step wizard

Each step needs a string `id` and the fields to validate on `next()`:

```ts
workflow: {
  wizard: {
    initialStep: 0,
    steps: [
      { id: "profile", fields: ["name", "email"] },
      { id: "details", fields: ["bio"] },
    ],
  },
},
```

Navigate:

```ts
await form.workflow.next(); // validates current step first
form.workflow.prev();
await form.workflow.goTo(1);
```

Progress UI:

```ts
const w = form.state.workflow;
w.currentStep; // 0-based
w.totalSteps;
w.canGoNext;
w.canGoPrev;
w.progress; // 0–100
```

---

## Element structure (wizard)

Render one step panel at a time from `workflow.currentStep`.

### React JSX

```tsx
const step = form.state.workflow.currentStep;

return (
  <form {...form.form()}>
    <div className="progress" style={{ width: `${form.state.workflow.progress}%` }} />

    {step === 0 ? (
      <section>
        <input {...form.field("name")} placeholder="Name" />
        <input {...form.field("email")} placeholder="Email" />
      </section>
    ) : (
      <section>
        <textarea {...form.field("bio")} placeholder="Bio" />
      </section>
    )}

    <button
      type="button"
      disabled={!form.state.workflow.canGoPrev}
      onClick={() => form.workflow.prev()}
    >
      Back
    </button>
    <button
      type="button"
      disabled={!form.state.workflow.canGoNext}
      onClick={() => void form.workflow.next()}
    >
      Next
    </button>
    {step === form.state.workflow.totalSteps - 1 ? (
      <button {...form.submit()}>Finish</button>
    ) : null}
  </form>
);
```

### Native HTML

```html
<form id="wizard">
  <div data-step="0">
    <input name="name" />
    <input name="email" />
  </div>
  <div data-step="1" hidden>
    <textarea name="bio"></textarea>
  </div>
  <button type="button" data-action="prev">Back</button>
  <button type="button" data-action="next">Next</button>
  <button type="submit">Finish</button>
</form>
```

Toggle `[data-step]` visibility from `form.state.workflow.currentStep` in your `subscribe()` render loop (or framework adapter).

---

## Cheat sheet

```ts
form.saveDraft();
form.state.workflow.isAutosaving;
await form.workflow.next();
form.workflow.prev();
form.state.workflow.progress;
```

**Next:** [Rules](/packages/form-intelligent/modules/rules) — `when()` show/hide/require/populate.
