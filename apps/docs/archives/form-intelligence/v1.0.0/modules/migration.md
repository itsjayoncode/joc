---
title: Migration
description: Form Intelligence documentation for Migration.
---

# Migration — replace ad-hoc autosave

Move from scattered `useEffect` draft logic to Form Intelligent workflow.

**Previous:** [Patterns](/packages/form-intelligence/modules/patterns) · **Back to:** [Overview](/packages/form-intelligence/)

---

## Before — DIY autosave

A common React pattern:

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem("draft", JSON.stringify(values));
  }, 500);
  return () => clearTimeout(timer);
}, [values]);

useEffect(() => {
  const raw = localStorage.getItem("draft");
  if (raw) setValues(JSON.parse(raw));
}, []);
```

Problems: debounce races, no cancel on unmount, restore fights controlled inputs, submit still hand-rolled.

---

## After — workflow.autosave + draft

```ts
import { createForm } from "@jayoncode/form-intelligence";

const form = createForm({
  initialValues: { notes: "" },
  workflow: {
    autosave: {
      enabled: true,
      debounceMs: 500,
      onSave: async (values) => {
        await api.saveDraft(values);
      },
    },
    draft: {
      enabled: true,
      storageKey: "app:notes-draft",
    },
  },
  onSubmit: async (values) => {
    await api.publish(values);
  },
});
```

| Concern        | DIY                    | Form Intelligent                               |
| -------------- | ---------------------- | ---------------------------------------------- |
| Debounce       | Manual timer           | `debounceMs`                                   |
| Persist        | `localStorage` by hand | `draft` + optional custom `PersistenceAdapter` |
| Restore        | Mount `useEffect`      | Automatic on `createForm`                      |
| Submit guard   | Ad hoc flag            | `submit()` + `preventDoubleSubmit`             |
| Tab hide flush | Missing                | `browserLifecyclePlugin` / draft on hidden     |

---

## React adapter

```tsx
import { useForm } from "@jayoncode/form-intelligent-react";

const form = useForm({
  schema: { notes: { required: true } },
  workflow: {
    autosave: { enabled: true, debounceMs: 500, onSave },
    draft: { enabled: true, storageKey: "app:notes-draft" },
  },
  onSubmit,
});
```

No `useEffect` for drafts — the adapter owns lifecycle; the engine owns workflow.

---

## Optional: flush on page hide

```ts
import { createBrowserLifecyclePlugin } from "@jayoncode/form-intelligence/plugins";

form.use(createBrowserLifecyclePlugin({ saveDraftOnHidden: true }));
```

**Back to:** [Overview](/packages/form-intelligence/) · [Changelog](/packages/form-intelligence/changelog)
