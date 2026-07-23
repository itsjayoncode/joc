---
title: Migration
description: Form Intelligence documentation for Migration.
---

# Migration

Move from DIY form orchestration (or older Form Intelligence APIs) onto the current headless workflow engine.

**Previous:** [Patterns](/packages/form-intelligence/modules/patterns) · **Back to:** [Overview](/packages/form-intelligence/overview)

---

## Package rename (`form-intelligent` → `form-intelligence`)

Canonical packages are **`@jayoncode/form-intelligence*`**. The old `@jayoncode/form-intelligent*` compatibility packages are **EOL** — removed from this monorepo and no longer published. Last published versions on npm stay installable but will not receive updates; migrate ASAP.

| Before (EOL)                          | After                                  |
| ------------------------------------- | -------------------------------------- |
| `@jayoncode/form-intelligent`         | `@jayoncode/form-intelligence`         |
| `@jayoncode/form-intelligent-react`   | `@jayoncode/form-intelligence-react`   |
| `@jayoncode/form-intelligent-vue`     | `@jayoncode/form-intelligence-vue`     |
| `@jayoncode/form-intelligent-angular` | `@jayoncode/form-intelligence-angular` |
| `@jayoncode/form-intelligent-zod`     | `@jayoncode/form-intelligence-zod`     |
| `@jayoncode/form-intelligent-yup`     | `@jayoncode/form-intelligence-yup`     |
| `@jayoncode/form-intelligent-valibot` | `@jayoncode/form-intelligence-valibot` |
| `@jayoncode/form-intelligent-ajv`     | `@jayoncode/form-intelligence-ajv`     |

```bash
npm uninstall @jayoncode/form-intelligent @jayoncode/form-intelligent-react
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-react
```

```ts
// before
import { createForm } from "@jayoncode/form-intelligent";
import { useForm } from "@jayoncode/form-intelligent-react";

// after
import { createForm } from "@jayoncode/form-intelligence";
import { useForm } from "@jayoncode/form-intelligence-react";
```

---

## Breaking changes (v3.1 phases 15–18)

### DevTools capture defaults

| Option                         | Previous / naive default | Current                                                  |
| ------------------------------ | ------------------------ | -------------------------------------------------------- |
| `captureStateOnWorkflowEvents` | Often treated as on      | **`false`** — metadata-only unless opted in              |
| `redactValues`                 | Often off                | **`true`** when capture is enabled — values become `***` |

```ts
import { enableFormDevTools } from "@jayoncode/form-intelligence/devtools";

enableFormDevTools(form, {
  captureStateOnWorkflowEvents: true, // opt-in
  redactValues: true, // default when capturing
});
```

### Browser lifecycle import path

`createBrowserLifecyclePlugin` is **not** re-exported from `@jayoncode/form-intelligence/workflow`.

```ts
// ✅
import { createBrowserLifecyclePlugin } from "@jayoncode/form-intelligence/plugins";

// ❌ removed — do not import from /workflow
```

### Bundle budget (`core-login`)

Entry-chunk gzip budget is **27 KB** (ADR-013). Measure with `pnpm --filter @jayoncode/form-intelligence check:size` after `tsc -b`. See [Performance](/packages/form-intelligence/modules/performance).

### Controllers / accessibility

Prefer `createFormController(form)` and `field.aria` / `setAriaIds` (Phase 16). There is no separate `form.controller()` method — the freeze row `D-CTRL-VS-HANDLE` is satisfied by the façade + enhanced `FieldHandle`.

Accessibility helpers live at `@jayoncode/form-intelligence/accessibility` (not `/a11y`). Checkpoints are instance APIs (`createCheckpoint` / `restoreCheckpoint`); there is no `/checkpoint` subpath.

### Format helpers (`/format`) — renamed exports

Formatter function names on `@jayoncode/form-intelligence/format` now use a `format*` prefix so they do not collide with main-entry validators:

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
import { formatPhone, formatCurrency } from "@jayoncode/form-intelligence/format";

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

| Concern        | DIY                    | Form Intelligence                                |
| -------------- | ---------------------- | ------------------------------------------------ |
| Debounce       | Manual timer           | `debounceMs`                                     |
| Persist        | `localStorage` by hand | `draft` + optional custom `PersistenceAdapter`   |
| Restore        | Mount `useEffect`      | Automatic on `createForm` + `restoreDraft()`     |
| Submit guard   | Ad hoc flag            | `submit()` + `preventDoubleSubmit`               |
| Tab hide flush | Missing                | `createBrowserLifecyclePlugin` / draft on hidden |

---

## React adapter

```tsx
import { useForm } from "@jayoncode/form-intelligence-react";

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

**Back to:** [Overview](/packages/form-intelligence/) · [Changelog](/packages/form-intelligence/changelog) · [Performance](/packages/form-intelligence/modules/performance)
