# Tutorial — integrate your first form

Install the package, wire a field, observe state, and submit.

**Previous:** [Core concepts](/packages/form-intelligent/modules/concepts) · **Next:** [Validation](/packages/form-intelligent/modules/validation)

::: info Playground
Use the [Validation explorer](/playground/form-intelligent/validation) to mirror these steps without a local install.
:::

**Prerequisites:** Node 20+, TypeScript or JavaScript ESM project.

---

## Step 1 — Install

```bash
npm install @jayoncode/form-intelligent
```

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

**Outcome:** `form.getFormState().values` reflects `initialValues`. Validation runs according to `validateOn` (default field behavior applies on blur/submit).

---

## Step 3 — Bind a field

`bind()` returns a headless contract for any input:

```ts
const email = form.field("email").bind();

// Example DOM wiring:
// input.name = email.name
// input.value = email.value
// input.oninput = (e) => email.onChange(e.target.value)
// input.onblur = email.onBlur
```

**Outcome:** User input updates `form.getFormState().values.email` and triggers validation per configured timing.

---

## Step 4 — Subscribe to state

```ts
form.subscribe(() => {
  const state = form.getFormState();
  render({
    values: state.values,
    errors: state.errors,
    isValid: state.isValid,
  });
});
```

Key fields:

```ts
const { values, errors, isValid, isSubmitting } = form.getFormState();
```

**Outcome:** UI stays synchronized with form state without framework-specific hooks.

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

While `onSubmit` runs, `getFormState().isSubmitting` is `true`.

**Outcome:** Valid forms invoke `onSubmit` once per user action; invalid forms return `false` without calling the handler.

---

## Recap

| Step | API                              | Result                            |
| ---- | -------------------------------- | --------------------------------- |
| 1    | `npm install`                    | Package on disk                   |
| 2    | `createForm({ … })`              | Instance with values + validators |
| 3    | `field().bind()`                 | Headless input wiring             |
| 4    | `subscribe()` / `getFormState()` | Reactive state access             |
| 5    | `submit()`                       | Validated async submission        |

## Continue

| Topic                          | Guide                                                       | Playground                                            |
| ------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------- |
| Validation timing, async rules | [Validation](/packages/form-intelligent/modules/validation) | [Validation](/playground/form-intelligent/validation) |
| Submit guards, error handling  | [Submission](/packages/form-intelligent/modules/submission) | [Submission](/playground/form-intelligent/submission) |
| Autosave, drafts, wizard       | [Workflow](/packages/form-intelligent/modules/workflow)     | [Workflow](/playground/form-intelligent/workflow)     |

Additional snippets: [Examples](/playground/form-intelligent/examples) · Live state: [State explorer](/playground/form-intelligent/state)
