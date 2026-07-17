# Migration

Move from DIY form orchestration (or older Form Intelligent APIs) onto the current headless workflow engine.

**Previous:** [Patterns](/packages/form-intelligent/modules/patterns) · **Back to:** [Overview](/packages/form-intelligent/overview)

---

## Breaking changes (v3.1 phases 15–18)

### DevTools capture defaults

| Option                         | Previous / naive default | Current                                                  |
| ------------------------------ | ------------------------ | -------------------------------------------------------- |
| `captureStateOnWorkflowEvents` | Often treated as on      | **`false`** — metadata-only unless opted in              |
| `redactValues`                 | Often off                | **`true`** when capture is enabled — values become `***` |

```ts
import { enableFormDevTools } from "@jayoncode/form-intelligent/devtools";

enableFormDevTools(form, {
  captureStateOnWorkflowEvents: true, // opt-in
  redactValues: true, // default when capturing
});
```

### Browser lifecycle import path

`createBrowserLifecyclePlugin` is **not** re-exported from `@jayoncode/form-intelligent/workflow`.

```ts
// ✅
import { createBrowserLifecyclePlugin } from "@jayoncode/form-intelligent/plugins";

// ❌ removed — do not import from /workflow
```

### Bundle budget (`core-login`)

Entry-chunk gzip budget is **24 KB** (ADR-013). Measure with `pnpm --filter @jayoncode/form-intelligent check:size` after `tsc -b`. See [Performance](/packages/form-intelligent/modules/performance).

### Controllers / accessibility

Prefer `createFormController(form)` and `field.aria` / `setAriaIds` (Phase 16). There is no separate `form.controller()` method — the freeze row `D-CTRL-VS-HANDLE` is satisfied by the façade + enhanced `FieldHandle`.

Accessibility helpers live at `@jayoncode/form-intelligent/accessibility` (not `/a11y`). Checkpoints are instance APIs (`createCheckpoint` / `restoreCheckpoint`); there is no `/checkpoint` subpath.

### Format helpers (`/format`) — renamed exports

Formatter function names on `@jayoncode/form-intelligent/format` now use a `format*` prefix so they do not collide with main-entry validators:

| Before                    | After                                 |
| ------------------------- | ------------------------------------- |
| `phone`                   | `formatPhone`                         |
| `currency`                | `formatCurrency`                      |
| `slug`                    | `formatSlug`                          |
| `uppercase` / `lowercase` | `formatUppercase` / `formatLowercase` |
| `creditCard`              | `formatCreditCard`                    |
| `philippinePhone`         | `formatPhilippinePhone`               |
| `custom`                  | `formatCustom`                        |
| `trim`                    | **unchanged** (`trim`)                |

Preset **strings** (`format: "phone"`, `"currency"`, …) are unchanged. Main validators (`phone()`, `currency()`, …) are unchanged.

```ts
import { formatPhone, formatCurrency } from "@jayoncode/form-intelligent/format";

form.field("mobile", { format: formatPhone });
```

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
import { createForm } from "@jayoncode/form-intelligent";

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

| Concern        | DIY                    | Form Intelligent                                 |
| -------------- | ---------------------- | ------------------------------------------------ |
| Debounce       | Manual timer           | `debounceMs`                                     |
| Persist        | `localStorage` by hand | `draft` + optional custom `PersistenceAdapter`   |
| Restore        | Mount `useEffect`      | Automatic on `createForm` + `restoreDraft()`     |
| Submit guard   | Ad hoc flag            | `submit()` + `preventDoubleSubmit`               |
| Tab hide flush | Missing                | `createBrowserLifecyclePlugin` / draft on hidden |

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
import { createBrowserLifecyclePlugin } from "@jayoncode/form-intelligent/plugins";

form.use(createBrowserLifecyclePlugin({ saveDraftOnHidden: true }));
```

**Back to:** [Overview](/packages/form-intelligent/) · [Changelog](/packages/form-intelligent/changelog) · [Performance](/packages/form-intelligent/modules/performance)
