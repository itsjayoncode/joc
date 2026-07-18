---
title: Getting Started
description: Form Intelligent documentation for Getting Started.
---

# Tutorial — integrate your first form

Wire a field, observe state, and submit in a few minutes.

**Previous:** [Overview](/packages/form-intelligence/overview) · **Next:** [Core concepts](/packages/form-intelligence/modules/concepts)

::: info Playground
Use the [Validation explorer](/playground/form-intelligence/validation) to mirror these steps without a local install.
:::

**Prerequisites:** Node 20+, TypeScript or JavaScript ESM project. Copy-paste install commands live on the [Overview](/packages/form-intelligence/#install).

---

## Choose your integration path

| Path            | Best for                                              | Key API                                                        |
| --------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| **Native HTML** | Existing forms, static pages, progressive enhancement | `createForm({ target, schema, onSubmit })`                     |
| **Headless**    | Custom UI, non-React frameworks                       | `createForm({ initialValues, validators })` + `field().bind()` |
| **React**       | React apps                                            | `useForm()` from `@jayoncode/form-intelligence-react`          |

The steps below follow the **headless** path, then show the matching **HTML / JSX structure** so you can see how elements map to the API. For more adapter variants, see [Adapters](/packages/form-intelligence/modules/adapters).

---

## Step 1 — Install

```bash
npm install @jayoncode/form-intelligent
```

For `pnpm` / `yarn` and the React adapter, see [Overview → Install](/packages/form-intelligence/#install).

**Outcome:** `@jayoncode/form-intelligent` is available to import.

---

## Step 2 — Create a form instance

Define `initialValues` and optional `validators`:

```ts
import { createForm, email, required } from "@jayoncode/form-intelligent";

const form = createForm({
  initialValues: {
    email: "",
    name: "",
  },
  validators: {
    email: [required, email],
    name: [required],
  },
});
```

**Outcome:** `form.state.values` reflects `initialValues`. Validation runs according to `validateOn` (default field behavior applies on blur/submit).

---

## Step 3 — Bind a field (and the markup)

`bind()` returns a headless contract for any input:

```ts
const email = form.field("email").bind();
// { name, value, onChange, onBlur, onFocus }
```

### Native HTML (progressive enhancement)

Prefer `target` + `name` attributes — no manual wiring:

```ts
createForm({
  target: "#signup",
  schema: {
    email: "email",
    name: { required: true, minLength: 2 },
  },
  onSubmit: async (values) => api.signup(values),
});
```

```html
<form id="signup">
  <label>
    Email
    <input name="email" type="email" autocomplete="email" />
  </label>
  <label>
    Name
    <input name="name" autocomplete="name" />
  </label>
  <button type="submit">Sign up</button>
</form>
```

The engine discovers inputs by `name`, syncs values, and surfaces errors with `aria-invalid` / live regions.

### Headless DOM (manual `bind()`)

```html
<form id="signup">
  <label>
    Email
    <input id="email" type="email" />
    <span id="email-error" role="alert"></span>
  </label>
  <button type="submit">Sign up</button>
</form>
```

```ts
const input = document.querySelector("#email");
const error = document.querySelector("#email-error");
const email = form.field("email").bind();

input.name = email.name;
input.value = String(email.value ?? "");
input.addEventListener("input", (event) => {
  email.onChange(event.target.value);
});
input.addEventListener("blur", () => email.onBlur());
input.addEventListener("focus", () => email.onFocus());

form.subscribe(() => {
  const message = form.state.errors.email;
  error.textContent = message ?? "";
  input.setAttribute("aria-invalid", message ? "true" : "false");
});
```

### React JSX

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligence-react
```

```tsx
import { useForm } from "@jayoncode/form-intelligence-react";

export function SignupForm() {
  const form = useForm({
    initialValues: { email: "", name: "" },
    validators: {
      email: [required, email],
      name: [required],
    },
    onSubmit: async (values) => api.signup(values),
  });

  return (
    <form {...form.form()}>
      <label>
        Email
        <input {...form.field("email")} type="email" />
        {form.state.errors.email ? <span role="alert">{form.state.errors.email}</span> : null}
      </label>

      <label>
        Name
        <input {...form.field("name")} />
        {form.state.errors.name ? <span role="alert">{form.state.errors.name}</span> : null}
      </label>

      <button {...form.submit()} disabled={form.state.isSubmitting}>
        {form.state.isSubmitting ? "Saving…" : "Sign up"}
      </button>
    </form>
  );
}
```

**Outcome:** User input updates `form.state.values` and triggers validation per configured timing.

---

## Step 4 — Read state (no subscription required)

Inspect the form at any time:

```ts
form.state.values;
form.state.errors;
form.state.isValid;
form.isSubmitting();

form.getValues();
form.getErrors();
```

For **vanilla JS** UIs that re-render on every change, use `subscribe()`:

```ts
form.subscribe(() => {
  render(form.state);
});
```

React developers should use `useForm()` instead — the adapter subscribes internally via `useSyncExternalStore`.

---

## Step 5 — Submit

```ts
const form = createForm({
  initialValues: { email: "", name: "" },
  validators: { email: [required, email], name: [required] },
  onSubmit: async (values) => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error(String(res.status));
  },
});

const success = await form.submit();
// success === true  → onSubmit completed
// success === false → validation failed or submit already in flight
```

While `onSubmit` runs, `form.isSubmitting()` is `true`.

**Outcome:** Valid forms invoke `onSubmit` once per user action; invalid forms return `false` without calling the handler.

---

## Recap

| Step | API                          | Result                                   |
| ---- | ---------------------------- | ---------------------------------------- |
| 1    | `npm install`                | Package on disk                          |
| 2    | `createForm({ … })`          | Instance with values + validators        |
| 3    | `field().bind()`             | Headless input wiring                    |
| 4    | `form.state` / `subscribe()` | Read state; subscribe only for manual UI |
| 5    | `submit()`                   | Validated async submission               |

## Continue

| Topic                          | Guide                                                            | Playground                                                 |
| ------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| Terminology and architecture   | [Core concepts](/packages/form-intelligence/modules/concepts)    | [State](/playground/form-intelligence/state)               |
| Validation timing, async rules | [Validation](/packages/form-intelligence/modules/validation)     | [Validation](/playground/form-intelligence/validation)     |
| Submit, cancel, offline queue  | [Submission](/packages/form-intelligence/modules/submission)     | [Submission](/playground/form-intelligence/submission)     |
| Autosave, drafts, wizard       | [Workflow](/packages/form-intelligence/modules/workflow)         | [Workflow](/playground/form-intelligence/workflow)         |
| Conditional `when()` rules     | [Rules](/packages/form-intelligence/modules/rules)               | [Rules](/playground/form-intelligence/rules)               |
| Derived fields                 | [Calculations](/packages/form-intelligence/modules/calculations) | [Calculations](/playground/form-intelligence/calculations) |
| Snapshots, undo/redo           | [State](/packages/form-intelligence/modules/state)               | [State](/playground/form-intelligence/state)               |

Additional snippets: [Examples](/playground/form-intelligence/examples) · Integrations: [Integrations](/packages/form-intelligence/modules/integrations)
