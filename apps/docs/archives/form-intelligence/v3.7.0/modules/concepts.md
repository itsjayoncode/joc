---
title: Concepts
description: Form Intelligence documentation for Concepts.
---

# Core concepts

Terminology and architecture for `@jayoncode/form-intelligence`. Prefer this page for _what things mean_; feature how-tos live under Guides.

**Previous:** [Tutorial](/packages/form-intelligence/modules/getting-started) · **Next:** [Capabilities](/packages/form-intelligence/modules/capabilities)

## Glossary

| Term              | Meaning                                                                      |
| ----------------- | ---------------------------------------------------------------------------- |
| **Form instance** | Object returned by `createForm()` — owns values, errors, submit, workflow    |
| **`bind()`**      | Headless field contract (`value`, `onChange`, `onBlur`, …) for any UI        |
| **Validator**     | Sync/async check returning `true` or an error string                         |
| **`when()` rule** | Declarative show/hide/require/populate/disableSubmit from field values       |
| **Format**        | Display ↔ store masking (`format` / `parse`) — import helpers from `/format` |
| **Transform**     | Inbound canonicalize before validation (trim → normalize → sanitize → …)     |
| **Autosave**      | Debounced persist of current values (often to an API)                        |
| **Draft**         | Local (or custom) restore of in-progress values across refresh               |
| **Wizard**        | Multi-step flow with per-step fields and validation                          |

## Problem → approach

| Without a form orchestration layer                                             | With Form Intelligence                              |
| ------------------------------------------------------------------------------ | --------------------------------------------------- |
| Validation, submit guards, and autosave spread across `useEffect` and handlers | One `createForm()` instance owns the workflow       |
| Field state duplicated between UI and store                                    | `form.state` is the single source of truth          |
| Framework-specific hooks lock you to one renderer                              | `field().bind()` is headless; adapters are optional |
| Double-submit and in-flight race conditions handled ad hoc                     | `submit()` + `isSubmitting()` built in              |

## Form instance

`createForm(options)` returns one instance per logical form. Options accept either:

- **`target` + `schema`** — enhance existing DOM (`<form>` or container selector)
- **`initialValues` + `validators`** — headless/programmatic wiring

### Imperative API (no subscription)

Read and act on the form directly:

```ts
const form = createForm({ initialValues: { email: "" }, onSubmit });

await form.validate();
await form.submit();
form.reset();

form.state.values;
form.state.errors;
form.state.isValid;
form.isValid();
form.isSubmitting();
form.getValues();
form.getErrors();
```

No `subscribe()` required for one-off reads or imperative scripts.

### Reactive API (vanilla JS only)

When you render UI manually, subscribe to changes:

```ts
form.subscribe(() => {
  render(form.state);
});
```

Or pass `subscribe` on `createForm` (one listener or an array) — same store, invoked once after create, then on every notify, until `destroy()`:

```ts
createForm({
  initialValues: { email: "" },
  subscribe: (form) => render(form.state),
});
```

Framework adapters (React, Vue, Angular) call `subscribe()` internally — application code should not.

| State        | Access                                       |
| ------------ | -------------------------------------------- |
| Values       | `form.state.values`, `form.getValues()`      |
| Field errors | `form.state.errors`, `form.getErrors()`      |
| Meta flags   | `form.state.isValid`, `form.isSubmitting()`  |
| React UI     | `useForm()` → `form.state` (auto-subscribed) |

## DOM enhancement

When `target` or `form` is provided (or you attach later with `form.ref` / `form.form()`), the engine:

- discovers fields by `name`
- wires `input` / `change` / `blur` without manual handlers
- imports Phase 1 **HTML constraint attributes** into validators once on attach (see [Validation → HTML constraints](/packages/form-intelligence/modules/validation#html-constraints-dom-backed))
- surfaces validation errors with `aria-invalid` and live regions
- sets `novalidate` and disables submit buttons while `isSubmitting` (`aria-busy`)

This is the same philosophy as Browser Lifecycle: **enhance what you already have** instead of replacing your markup.

### Markup the engine expects

```html
<form id="signup">
  <label>
    Email
    <input name="email" type="email" />
  </label>

  <!-- Conditional fields: wrap so show/hide can target the group -->
  <div data-form-intelligent-field="companyName">
    <label>
      Company
      <input name="companyName" />
    </label>
  </div>

  <button type="submit">Continue</button>
</form>
```

At runtime the form may receive `data-form-intelligent="{id}"`, inputs `aria-invalid` / `data-form-intelligent-validating`, and error nodes `data-form-intelligent-error="{path}"`.

## API map

| Concept   | Responsibility           | API                          |
| --------- | ------------------------ | ---------------------------- |
| Field     | Path in the value tree   | `form.field("email")`        |
| Binding   | Headless input contract  | `field().bind()`             |
| Validator | `true` or error message  | `validators: { path: [fn] }` |
| Submit    | Async handler when valid | `onSubmit`                   |
| Workflow  | Autosave, draft, wizard  | `workflow: { … }`            |
| Rules     | Show/hide/require/enable | `when("field").equals(…)`    |

## Conditional rules

`when()` expresses show / hide / require / enable / populate without `useEffect`. Results land in `form.state.fieldUi` and `form.state.ui`.

```ts
rules: [when("customerType").equals("Business").show("companyName")],
```

How-to, import choices, and DOM wrappers: [Rules guide](/packages/form-intelligence/modules/rules). Capability map: [Capabilities](/packages/form-intelligence/modules/capabilities).

## Field meta flags

| Flag      | Set when         | Typical use          |
| --------- | ---------------- | -------------------- |
| `touched` | Blur after focus | Defer error display  |
| `dirty`   | Value ≠ initial  | Unsaved indicator    |
| `visited` | Focus received   | Analytics, help text |

## Next steps

| Goal                  | Guide                                                            |
| --------------------- | ---------------------------------------------------------------- |
| Feature map / roadmap | [Capabilities](/packages/form-intelligence/modules/capabilities) |
| Validation            | [Validation](/packages/form-intelligence/modules/validation)     |
| Submit lifecycle      | [Submission](/packages/form-intelligence/modules/submission)     |
| Conditional logic     | [Rules](/packages/form-intelligence/modules/rules)               |
| Snapshots / undo      | [State](/packages/form-intelligence/modules/state)               |
| Autosave / wizard     | [Workflow](/packages/form-intelligence/modules/workflow)         |

Inspect live state: [State explorer](/playground/form-intelligence/state)
