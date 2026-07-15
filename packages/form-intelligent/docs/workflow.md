# Workflow

Go beyond basic forms — autosave drafts, restore on reload, and multi-step wizards.

**Previous:** [Submission](/packages/form-intelligent/modules/submission) · **Next:** [Formatters](/packages/form-intelligent/modules/formatters)

::: tip Playground
[Workflow explorer →](/playground/form-intelligent/workflow) — autosave debounce, draft restore, wizard steps.
:::

## Overview

Workflow options extend the form instance with time-based and multi-step behavior:

| Feature    | Use case                                  |
| ---------- | ----------------------------------------- |
| `autosave` | Debounced persistence on value change     |
| `draft`    | Restore values after navigation or reload |
| `wizard`   | Step index with per-step validation       |

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

Check status: `getFormState().workflow.isAutosaving`

---

## Draft restore

Persists to `localStorage` and merges on next visit:

```ts
workflow: {
  draft: {
    enabled: true,
    storageKey: "signup-draft-v1",
    onRestore: (values) => console.log("Welcome back!", values),
  },
},
```

::: info Try it
Fill fields in the [Workflow playground](/playground/form-intelligent/workflow), reload the page — your draft comes back.
:::

---

## Multi-step wizard

```ts
workflow: {
  wizard: {
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

Progress UI: `getFormState().workflow.progress` (0–100)

---

## Conditional fields

Show/hide fields in **your UI** based on `form.values()`. Skip validation when a field does not apply:

```ts
companyName: [
  (value, context) =>
    context.values.accountType === "company" ? required(value) : true,
],
```

---

## Cheat sheet

```ts
const w = form.getFormState().workflow;
w.currentStep; // 0-based index
w.totalSteps;
w.canGoNext; // false on last step
w.canGoPrev;
w.progress; // percentage for progress bar
```

**Next:** [Formatters](/packages/form-intelligent/modules/formatters) — normalize phone numbers, currency, slugs.
