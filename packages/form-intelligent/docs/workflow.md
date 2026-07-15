# Workflow

Go beyond basic forms — autosave drafts, restore on reload, and multi-step wizards.

**Previous:** [Submission](/packages/form-intelligent/modules/submission) · **Next:** [Formatters](/packages/form-intelligent/modules/formatters)

::: tip Try it first
[Open Workflow playground →](/playground/form-intelligent/workflow) — edit fields, reload the page, and step through a wizard.
:::

## In plain English

Workflow features answer: _what should happen to form data over time?_

| Feature      | Problem it solves                                           |
| ------------ | ----------------------------------------------------------- |
| **Autosave** | User types → debounced save without `useEffect` boilerplate |
| **Draft**    | User closes tab → data restored on return                   |
| **Wizard**   | Long form split into steps with validation between each     |

---

## Level 1 — Autosave

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

## Level 2 — Draft restore

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

## Level 3 — Multi-step wizard

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

## Level 4 — Conditional fields

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
