# Form OS — Capability Roadmap

`@jayoncode/form-intelligence` is a **headless form workflow engine** that manages everything that happens before, during, and after form submission.

Think of it as an operating system for forms: you do not use every feature in every project — you pick the ones you need.

## Status legend

| Badge       | Meaning                                         |
| ----------- | ----------------------------------------------- |
| **SHIPPED** | Available in the current public API             |
| **PARTIAL** | Foundation exists; UX or integration incomplete |
| **PLANNED** | Designed; not yet implemented                   |

---

## 1. Form State Management — **SHIPPED**

Stores values, errors, loading, dirty, touched, visited, and workflow flags in one instance.

```ts
const form = createForm({ initialValues: { email: "" } });

form.state.values;
form.state.errors;
form.state.isSubmitting;
form.state.isDirty;
```

No scattered `useState` per field.

---

## 2. Validation Engine — **SHIPPED**

Declarative schema with built-in rules (`email`, `password`, `required`, etc.).

```ts
createForm({
  schema: { email: { required: true, type: "email" } },
});
```

Engine owns timing (`validateOn`), error surfacing, and submit gating.

---

## 3. Custom Validation — **SHIPPED**

Business rules via `validate`, `validators`, or schema field config.

```ts
username: {
  validate(value) {
    return value !== "admin" || "Username already taken";
  },
}
```

---

## 4. Async Validation — **SHIPPED**

Async validators run in the pipeline. Per-field `form.state.fieldMeta[path].isValidating` supports "Checking…" UI. Debounced validation on `onChange` cancels stale requests.

```ts
username: {
  async validate(value) {
    const exists = await api.exists(value);
    return !exists || "Username already exists";
  },
}
```

---

## 5. Formatting Engine — **SHIPPED**

`format` / `parse` hooks, built-in formatters, and presets `philippine-phone`, `credit-card`.

```ts
phone: {
  format: "philippine-phone";
}
```

---

## 6. Conditional Logic — **SHIPPED**

Declarative `when()` rules change visibility, requirement, and disabled state.

```ts
when("customerType").equals("Business").show("companyName");
```

`form.state.fieldUi` exposes `{ visible, disabled, required }` per field. DOM enhancer applies `hidden`, `disabled`, and `required` attributes.

---

## 7. Enable / Disable — **SHIPPED**

```ts
when("country").equals("Philippines").enable("province");
```

---

## 8. Required / Optional — **SHIPPED**

```ts
when("customerType").equals("Business").require("taxNumber");
```

Non-matching rules reset dynamic requirement to optional.

---

## 9. Field Dependency — **SHIPPED**

```ts
when("country").changes(loadProvinces).populate("province");
```

`form.state.fieldOptions` exposes select options for headless and DOM rendering.

---

## 10. Calculations — **SHIPPED**

Derived fields without manual event wiring.

```ts
form.calculate("total", ({ values }) => values.price * values.quantity);
```

---

## 11. Wizard — **SHIPPED**

Multi-step flows with per-step validation.

```ts
workflow: {
  wizard: {
    steps: ["personal", "billing", "review"];
  }
}
```

---

## 12. Progress — **SHIPPED**

`form.state.workflow.progress` and step navigation (`canGoNext`, `canGoPrev`).

---

## 13. Autosave — **SHIPPED**

Debounced persistence on value change.

```ts
workflow: { autosave: { enabled: true, debounceMs: 5000, onSave } }
```

---

## 14. Draft Recovery — **SHIPPED**

`loadDraft` on init, `form.saveDraft()` anytime, optional `promptOnRestore` + `onRestorePrompt`.

Backends: `localStorage` (default), `sessionStorage` via `workflow.draft.storage`, custom sync adapters, and async `createIndexedDbDraftStorage()` for larger payloads.

---

## 15. Offline Queue — **SHIPPED**

Queue submit when offline; `form.flushOfflineQueue()` on reconnect.

---

## 16. Submission Engine — **SHIPPED**

`submit()` validates, sets `isSubmitting`, disables submit controls, calls `onSubmit`, handles errors, and re-enables.

---

## 17. Dirty Tracking — **SHIPPED**

```ts
form.isDirty();
form.state.dirty;
```

Use for "Unsaved changes — leave page?" guards.

---

## 18. Undo / Redo — **SHIPPED**

```ts
form.undo();
form.redo();
```

---

## 19. Changed Fields — **SHIPPED**

```ts
form.changedFields(); // ["email"]
form.diffFromDefaults(); // deep diff vs initial values (@jayoncode/object-diff)
form.submit({ includeDiff: true }); // onSubmit(values, { changedFields, diff })
form.use(createObjectDiffPlugin({ onSubmitDiff: audit }));
```

`changedFields()` uses dirty flags for fast path checks. `diffFromDefaults()` and submit diff metadata use `@jayoncode/object-diff` (optional peer dependency, lazy-loaded).

---

## 20. Browser Session Integration — **SHIPPED**

```ts
form.use(createBrowserLifecyclePlugin());
// saves draft when tab is hidden
```

---

## 21. Keyboard Integration — **SHIPPED**

```ts
workflow: {
  keyboard: [{ combo: "Ctrl+S", action: "saveDraft" }];
}
// or form.use(createKeyboardPlugin([...]))
```

---

## 22. Analytics — **SHIPPED**

`form.getAnalytics()` — completion time, errors by field, drop-off field.

---

## 23. Plugin System — **SHIPPED**

`form.use(plugin)` alias for `registerPlugin()`.

---

## 24. React Adapter — **SHIPPED**

```tsx
const form = useForm({ schema: { email: "email" } });
return (
  <form {...form.form()}>
    <input {...form.field("email")} />
    <button {...form.submitButton()}>Save</button>
  </form>
);
```

`useSyncExternalStore` hides subscription wiring.

---

## 25. Business Rule Engine — **SHIPPED**

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

`ctx.disableSubmit()` targets submit buttons in the DOM enhancer.

---

## 26. DevTools — **SHIPPED**

```ts
import {
  createDevToolsPlugin,
  enableFormDevTools,
  getFormDevTools,
} from "@jayoncode/form-intelligence/devtools";

enableFormDevTools(form);

const inspector = getFormDevTools();
inspector.getActiveForms();
inspector.getStateSnapshot(form.id);
inspector.getValidationLog(form.id);
inspector.getWorkflowTimeline(form.id);
```

Opt-in `/devtools` subpath — not in the core barrel. Use `connectFormDevToolsToGlobal()` for browser console debugging.

---

## Architecture flow

```
USER TYPES
     │
     ▼
Form State Updates
     │
     ├─ Validation
     ├─ Formatting
     └─ Workflow Rules (when)
     │
     ▼
Update Form State (fieldUi, errors, dirty)
     │
     ▼
Re-render UI (subscribe / useForm)
     │
     ▼
User Clicks Submit
     │
     ▼
Submission Engine
     │
     ▼
Validate → Format → Submit → Retry → Success
```

## One-sentence positioning

**`@jayoncode/form-intelligence` is a headless form workflow engine that manages everything that happens before, during, and after form submission** — not just validation, but the full lifecycle of complex forms while developers keep complete control over UI.
