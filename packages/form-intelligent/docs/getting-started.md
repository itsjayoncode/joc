# Tutorial — your first form

Build a working email + name form in five steps. Each step adds one idea.

**Previous:** [Core concepts](/packages/form-intelligent/modules/concepts) · **Next:** [Validation](/packages/form-intelligent/modules/validation)

::: tip Learn by doing
Keep the [playground Validation page](/playground/form-intelligent/validation) open in another tab — you can try the same ideas without installing anything.
:::

---

## Step 1 — Install

```bash
npm install @jayoncode/form-intelligent
```

✅ **You now have** the package ready to import.

---

## Step 2 — Create a form

A form needs starting values and optional rules.

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

✅ **You now have** a form instance. Values live in `form.getFormState().values`.

---

## Step 3 — Connect an input (headless)

No React required. `bind()` gives you everything a native `<input>` needs:

```ts
const email = form.field("email").bind();

// Pseudocode for any UI:
// <input
//   name={email.name}
//   value={email.value}
//   onChange={(e) => email.onChange(e.target.value)}
//   onBlur={email.onBlur}
// />
```

When the user types, call `email.onChange(value)`. On blur, `onBlur` runs validation (if `validateOn` is `"onBlur"`).

✅ **You now have** a field wired to form state.

---

## Step 4 — Read state & show errors

```ts
const state = form.getFormState();

console.log(state.values); // { email: "...", name: "..." }
console.log(state.errors); // { email: "Enter a valid email address." }
console.log(state.isValid); // false until all validators pass
```

Re-render your UI when state changes:

```ts
form.subscribe(() => {
  render(form.getFormState());
});
```

✅ **You now have** live errors and values for your UI.

---

## Step 5 — Submit

Add a handler, then call `submit()`:

```ts
const form = createForm({
  initialValues: { email: "", name: "" },
  validators: { email: [required, email], name: [required] },
  onSubmit: async (values) => {
    await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  },
});

const ok = await form.submit();
// ok === true  → handler finished
// ok === false → validation failed OR submit already in flight
```

While `onSubmit` runs, `getFormState().isSubmitting` is `true` — use it to disable your button.

✅ **You now have** a complete validate → submit flow.

---

## Recap

| Step | API                              | Purpose                   |
| ---- | -------------------------------- | ------------------------- |
| 1    | `npm install`                    | Add package               |
| 2    | `createForm({ … })`              | Own values + validators   |
| 3    | `field().bind()`                 | Wire inputs               |
| 4    | `getFormState()` / `subscribe()` | Read errors & values      |
| 5    | `submit()`                       | Validate + run `onSubmit` |

## What to learn next

| Goal                                      | Guide                                                       | Playground                                       |
| ----------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| More validation (async, confirm password) | [Validation](/packages/form-intelligent/modules/validation) | [Try →](/playground/form-intelligent/validation) |
| Loading, retries, double-submit           | [Submission](/packages/form-intelligent/modules/submission) | [Try →](/playground/form-intelligent/submission) |
| Autosave & multi-step forms               | [Workflow](/packages/form-intelligent/modules/workflow)     | [Try →](/playground/form-intelligent/workflow)   |

::: info Stuck?
Browse [examples in the playground](/playground/form-intelligent/examples) for copy-paste snippets, or inspect live state in the [State explorer](/playground/form-intelligent/state).
:::
