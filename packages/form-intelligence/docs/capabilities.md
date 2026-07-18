# Form OS — Capabilities

`@jayoncode/form-intelligence` is a **headless form workflow engine** — an operating system for forms. You pick the features you need; the engine centralizes validation, formatting, conditional logic, business rules, autosave, drafts, submission, and integrations while you keep full control of UI.

**Previous:** [Core concepts](/packages/form-intelligence/modules/concepts) · **Next:** [Validation](/packages/form-intelligence/modules/validation)

::: tip One sentence
**Form Intelligence manages everything that happens before, during, and after form submission** — not just validation.
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
const form = createForm({
  initialValues: { email: "" },
  // Optional: declarative listeners (same store as form.subscribe; until destroy)
  subscribe: (form) => {
    syncUi(form.state);
  },
});

form.state.values;
form.state.errors;
form.state.isSubmitting;
form.state.isDirty;
```

[State explorer →](/playground/form-intelligence/state)

### 2. Validation engine — **SHIPPED**

Declarative schema — no manual `if (!email.includes("@"))`.

```ts
createForm({
  schema: { email: { required: true, type: "email" } },
});
```

[Validation guide →](/packages/form-intelligence/modules/validation)

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

[Validation playground →](/playground/form-intelligence/validation)

---

## Input transformation

### 5. Formatting engine — **SHIPPED**

Presets: `philippine-phone`, `credit-card`, plus custom `format` / `parse` hooks.

[Formatters →](/packages/form-intelligence/modules/formatters)

### 5b. Transform pipeline — **SHIPPED**

Inbound stages before validation (trim / normalize / sanitize / parse):

```ts
form.field("name", { transform: { trim: true, normalize: true } });
form.transform("code").pipe((v) => String(v).toUpperCase());
```

Import helpers from `@jayoncode/form-intelligence/transform`.

---

## Conditional logic and rules

### 6. Conditional logic — **SHIPPED**

Show, hide, require, and enable fields based on other values — no scattered `useEffect`.

```ts
import { createForm, when } from "@jayoncode/form-intelligence";

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

Read presentation without digging into snapshots:

```ts
form.getPresentation("companyName").field.visible;
form.field("companyName").ui.visible;
form.getPresentation().formUi.submitDisabled;
```

Import helpers from `@jayoncode/form-intelligence/presentation` when needed.

[Rules guide →](/packages/form-intelligence/modules/rules)

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

// Structural cascade (clear children on parent change)
createForm({
  dependencies: { province: ["country"], city: ["province"] },
});
```

[Dependencies playground →](/playground/form-intelligence/dependencies) · [Rules guide →](/packages/form-intelligence/modules/rules)

### 10. Calculations — **SHIPPED**

```ts
form.calculate("total", ({ values }) => values.price * values.quantity);

form
  .calculate("total")
  .from("price", "quantity")
  .compute(({ get }) => Number(get("price")) * Number(get("quantity")));
```

[Calculations guide →](/packages/form-intelligence/modules/calculations) · [Playground →](/playground/form-intelligence/calculations)

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

[Rules playground →](/playground/form-intelligence/rules)

---

## Workflow

### 11. Wizard — **SHIPPED**

Multi-step forms with per-step validation, branching (`when` / `next` / `canLeave` / `canEnter`), `goTo` modes, and optional `persistStepInDraft`.

[Workflow guide →](/packages/form-intelligence/modules/workflow)

### 12. Progress — **SHIPPED**

`form.state.workflow.progress` — percentage and step navigation built in.

### 13. Autosave — **SHIPPED**

```ts
workflow: { autosave: { enabled: true, debounceMs: 5000, onSave } }
```

### 14. Draft recovery — **SHIPPED**

`form.saveDraft()`, `form.restoreDraft({ force?, prompt?, merge? })`, restore on reload, optional `promptOnRestore` + envelopes/`migrateDraft`.

### 15. Offline queue — **SHIPPED**

`workflow.offlineQueue` — `maxItems` / overflow, `idempotencyKey`, `onConflict`, `form.flushOfflineQueue()` on reconnect.

[Submission playground →](/playground/form-intelligence/submission)

---

## Submission and change tracking

### 16. Submission engine — **SHIPPED**

Validate → loading → disable button → API → success/error → re-enable. `submitPhase` machine + `form.useMiddleware` onion (same stack as plugin hooks).

[Submission guide →](/packages/form-intelligence/modules/submission)

### 17. Dirty tracking — **SHIPPED**

`form.isDirty()` for leave-page guards.

### 18. Undo / redo — **SHIPPED**

`form.undo()` / `form.redo()` with value history stack.

### 19. Changed fields — **SHIPPED**

`form.changedFields()` returns paths that differ from initial values.

[State guide →](/packages/form-intelligence/modules/state)

---

## Integrations

### 20. Browser session — **SHIPPED**

```ts
import { createBrowserLifecyclePlugin } from "@jayoncode/form-intelligence/plugins";

form.use(createBrowserLifecyclePlugin({ saveDraftOnHidden: true }));
```

Saves draft when the tab is hidden.

### 21. Keyboard shortcuts — **SHIPPED**

`workflow.keyboard` or `createKeyboardPlugin()` — Ctrl+S save, Ctrl+Enter submit.

[Integrations guide →](/packages/form-intelligence/modules/integrations) · [Playground →](/playground/form-intelligence/integrations)

### 22. Analytics — **SHIPPED**

`form.getAnalytics()` — errors by field, field views, drop-off, timings. Path allow/deny; never snapshots values. Not a product analytics SDK.

### 23. Plugin system — **SHIPPED**

`createForm({ plugins })` / `form.use(plugin)` / `registerPlugin()`, hook bus, error isolation (`onPluginError`), `version` / `engines` metadata, `PLUGIN_PIPELINE_STAGES`.

[Plugins guide →](/packages/form-intelligence/modules/plugins)

### 24. React adapter — **SHIPPED**

```tsx
import { useForm } from "@jayoncode/form-intelligence-react";

const form = useForm({ schema: { email: "email" } });
// form.controller · form.fieldController · aria on form.field()
```

Vue / Angular packages exist as **PARTIAL** (controller/`field.aria` parity pending).

[Adapters guide →](/packages/form-intelligence/modules/adapters)

### 26. Controllers + accessibility — **SHIPPED**

`createFormController(form)`, `field.aria` / `setAriaIds`, `focusFirstInvalid`, `@jayoncode/form-intelligence/accessibility`.

### 27. DevTools — **SHIPPED** (optional subpath)

```ts
import { enableFormDevTools, getFormDevTools } from "@jayoncode/form-intelligence/devtools";
```

Inspector: events, validation, workflow, plugins, performance marks. Not pulled into the core-login bundle.

[Integrations →](/packages/form-intelligence/modules/integrations) · [Playground →](/playground/form-intelligence/devtools)

---

## How it fits together

```
USER TYPES → State Updates → Validation / Formatting / Rules
          → Update State → Re-render → Submit → Submission Engine
```

## Next steps

| Goal                | Guide                                                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Get started         | [Tutorial](/packages/form-intelligence/modules/getting-started)                                                                                |
| Conditional fields  | [Rules](/packages/form-intelligence/modules/rules)                                                                                             |
| Derived values      | [Calculations](/packages/form-intelligence/modules/calculations)                                                                               |
| Snapshots / undo    | [State](/packages/form-intelligence/modules/state)                                                                                             |
| Session / keyboard  | [Integrations](/packages/form-intelligence/modules/integrations)                                                                               |
| Controllers / a11y  | [Adapters](/packages/form-intelligence/modules/adapters)                                                                                       |
| Bundle / timing     | [Performance](/packages/form-intelligence/modules/performance)                                                                                 |
| Engineering roadmap | [002-form-os-capabilities](https://github.com/itsjayoncode/joc/blob/master/packages/form-intelligence/engineering/002-form-os-capabilities.md) |
