---
title: Capabilities
description: Form Intelligent documentation for Capabilities.
---

# Form OS — Capabilities

`@jayoncode/form-intelligent` is a **headless form workflow engine** — an operating system for forms. You pick the features you need; the engine centralizes validation, formatting, conditional logic, business rules, autosave, drafts, submission, and integrations while you keep full control of UI.

**Previous:** [Core concepts](/packages/form-intelligent/modules/concepts) · **Next:** [Validation](/packages/form-intelligent/modules/validation)

::: tip One sentence
**Form Intelligent manages everything that happens before, during, and after form submission** — not just validation.
:::

## Status legend

| Badge       | Meaning                                           |
| ----------- | ------------------------------------------------- |
| **SHIPPED** | Available today                                   |
| **PARTIAL** | Foundation shipped; polish or integration pending |
| **PLANNED** | On the roadmap                                    |

---

## Core lifecycle

### 1. Form state management — **SHIPPED**

One instance owns values, errors, loading, dirty, and touched state.

```ts
const form = createForm({ initialValues: { email: "" } });

form.state.values;
form.state.errors;
form.state.isSubmitting;
form.state.isDirty;
```

[State explorer →](/playground/form-intelligent/state)

### 2. Validation engine — **SHIPPED**

Declarative schema — no manual `if (!email.includes("@"))`.

```ts
createForm({
  schema: { email: { required: true, type: "email" } },
});
```

[Validation guide →](/packages/form-intelligent/modules/validation)

### 3. Custom validation — **SHIPPED**

Encode business rules in the schema or validator list.

```ts
username: {
  validate(value) {
    return value !== "admin" || "Username already taken";
  },
}
```

### 4. Async validation — **SHIPPED**

Debounced onChange checks, per-field `form.state.fieldMeta[path].isValidating` for "Checking…" UI.

```ts
username: {
  async validate(value) {
    const exists = await api.exists(value);
    return !exists || "Username already exists";
  },
}
```

[Validation playground →](/playground/form-intelligent/validation)

---

## Input transformation

### 5. Formatting engine — **SHIPPED**

Presets: `philippine-phone`, `credit-card`, plus custom `format` / `parse` hooks.

[Formatters →](/packages/form-intelligent/modules/formatters)

---

## Conditional logic and rules

### 6. Conditional logic — **SHIPPED**

Show, hide, require, and enable fields based on other values — no scattered `useEffect`.

```ts
import { createForm, when } from "@jayoncode/form-intelligent";

createForm({
  initialValues: { customerType: "Personal", companyName: "" },
  rules: [when("customerType").equals("Business").show("companyName")],
});
```

Wrap fields for DOM hide/show:

```html
<div data-form-intelligent-field="companyName">
  <label>Company Name</label>
  <input name="companyName" />
</div>
```

[Rules guide →](/packages/form-intelligent/modules/rules)

### 7. Enable / disable — **SHIPPED**

```ts
when("country").equals("Philippines").enable("province");
```

### 8. Required / optional — **SHIPPED**

```ts
when("customerType").equals("Business").require("taxNumber");
```

### 9. Field dependency — **SHIPPED**

```ts
when("country").changes(loadProvinces).populate("province");
```

[Dependencies playground →](/playground/form-intelligent/dependencies)

### 10. Calculations — **SHIPPED**

```ts
form.calculate("total", ({ values }) => values.price * values.quantity);
```

[Calculations guide →](/packages/form-intelligent/modules/calculations) · [Playground →](/playground/form-intelligent/calculations)

### 25. Business rule engine — **SHIPPED**

```ts
form
  .when("loanAmount")
  .greaterThan(500_000)
  .then((ctx) => {
    ctx.show("managerApproval");
    ctx.require("managerApproval");
    ctx.disableSubmit();
  });
```

[Rules playground →](/playground/form-intelligent/rules)

---

## Workflow

### 11. Wizard — **SHIPPED**

Multi-step forms with per-step validation.

[Workflow guide →](/packages/form-intelligent/modules/workflow)

### 12. Progress — **SHIPPED**

`form.state.workflow.progress` — percentage and step navigation built in.

### 13. Autosave — **SHIPPED**

```ts
workflow: { autosave: { enabled: true, debounceMs: 5000, onSave } }
```

### 14. Draft recovery — **SHIPPED**

`form.saveDraft()`, restore on reload, optional `promptOnRestore` + `onRestorePrompt`.

### 15. Offline queue — **SHIPPED**

`workflow.offlineQueue` — queue while offline, `form.flushOfflineQueue()` on reconnect.

[Submission playground →](/playground/form-intelligent/submission)

---

## Submission and change tracking

### 16. Submission engine — **SHIPPED**

Validate → loading → disable button → API → success/error → re-enable.

[Submission guide →](/packages/form-intelligent/modules/submission)

### 17. Dirty tracking — **SHIPPED**

`form.isDirty()` for leave-page guards.

### 18. Undo / redo — **SHIPPED**

`form.undo()` / `form.redo()` with value history stack.

### 19. Changed fields — **SHIPPED**

`form.changedFields()` returns paths that differ from initial values.

[State guide →](/packages/form-intelligent/modules/state)

---

## Integrations

### 20. Browser session — **SHIPPED**

`form.use(createBrowserLifecyclePlugin())` — saves draft when tab is hidden.

### 21. Keyboard shortcuts — **SHIPPED**

`workflow.keyboard` or `createKeyboardPlugin()` — Ctrl+S save, Ctrl+Enter submit.

[Integrations guide →](/packages/form-intelligent/modules/integrations) · [Playground →](/playground/form-intelligent/integrations)

### 22. Analytics — **SHIPPED**

`form.getAnalytics()` — errors by field, field views, drop-off field.

### 23. Plugin system — **SHIPPED**

`form.use(plugin)` alias for `registerPlugin()`.

[Plugins guide →](/packages/form-intelligent/modules/plugins)

### 24. React adapter — **SHIPPED**

```tsx
import { useForm } from "@jayoncode/form-intelligent-react";

const form = useForm({ schema: { email: "email" } });
```

[Adapters guide →](/packages/form-intelligent/modules/adapters)

---

## How it fits together

```
USER TYPES → State Updates → Validation / Formatting / Rules
          → Update State → Re-render → Submit → Submission Engine
```

## Next steps

| Goal                | Guide                                                                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Get started         | [Tutorial](/packages/form-intelligent/modules/getting-started)                                                                                |
| Conditional fields  | [Rules](/packages/form-intelligent/modules/rules)                                                                                             |
| Derived values      | [Calculations](/packages/form-intelligent/modules/calculations)                                                                               |
| Snapshots / undo    | [State](/packages/form-intelligent/modules/state)                                                                                             |
| Session / keyboard  | [Integrations](/packages/form-intelligent/modules/integrations)                                                                               |
| Engineering roadmap | [002-form-os-capabilities](https://github.com/itsjayoncode/joc/blob/master/packages/form-intelligent/engineering/002-form-os-capabilities.md) |
