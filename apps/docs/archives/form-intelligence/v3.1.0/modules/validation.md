---
title: Validation
description: Form Intelligent documentation for Validation.
---

# Validation

Check user input before submit — with built-in rules, custom logic, or async API calls.

**Previous:** [Capabilities](/packages/form-intelligence/modules/capabilities) · **Next:** [Submission](/packages/form-intelligence/modules/submission)

::: tip Playground
[Validation explorer →](/playground/form-intelligence/validation) — timing modes, async validators, field inspector.
:::

## Problem → solution

| Problem                                         | Solution                                               |
| ----------------------------------------------- | ------------------------------------------------------ |
| Ad-hoc `if` checks scattered in submit handlers | Declarative `validators` / `schema` on `createForm`    |
| Errors appear too early or too late             | `validateOn` timing (`onBlur`, `onChange`, `onSubmit`) |
| Need server uniqueness checks                   | Async validators that return a string error            |

## Overview

Validators run per field (or form) and return `true` when valid or a `string` error message. Multiple validators on one field run in order; the first failure wins.

```ts
validators: {
  email: [required, email],
}
```

---

## Basics — built-in validators

Good for most forms. Import what you need:

```ts
import { required, email, url, minLength, regex } from "@jayoncode/form-intelligent";

createForm({
  initialValues: { email: "", site: "", code: "" },
  validators: {
    email: [required, email],
    site: [url], // optional field — empty is OK
    code: [minLength(6), regex(/^[A-Z0-9]+$/, "Use uppercase letters and numbers.")],
  },
});
```

| Validator             | Use when                |
| --------------------- | ----------------------- |
| `required`            | Field cannot be empty   |
| `email`               | Must look like an email |
| `url`                 | Must be a valid URL     |
| `minLength(n)`        | String too short        |
| `regex(pattern, msg)` | Custom format           |

---

## Validation timing

Control **timing** with `validateOn`:

| Mode       | Runs when                  | Best for                      |
| ---------- | -------------------------- | ----------------------------- |
| `onChange` | Every keystroke            | Instant feedback              |
| `onBlur`   | User leaves field          | Less noisy (default-friendly) |
| `onSubmit` | `submit()` or `validate()` | Simple forms                  |

```ts
createForm({
  initialValues: { name: "" },
  validateOn: "onBlur",
  validators: { name: [required] },
});
```

Override per field:

```ts
form.field("username", { validateOn: "onChange", validators: [required] });
```

---

## Custom and cross-field rules

Compare fields using `context.values`:

```ts
validators: {
  confirmPassword: [
    required,
    (value, context) =>
      value === context.values.password ? true : "Passwords must match.",
  ],
},
```

---

## Async validation

Return a `Promise` for server checks (username taken, etc.):

```ts
const uniqueUsername: Validator = async (value) => {
  if (!value) return true;
  const taken = await api.isUsernameTaken(String(value));
  return taken ? "Username already taken." : true;
};
```

::: warning Tip
Async validators feel slow without UI feedback — disable the submit button or show a spinner on the field while waiting.
:::

---

## Element structure

Show the error next to the control — same shape for HTML and React.

### Native HTML

```html
<label>
  Username
  <input name="username" autocomplete="username" />
</label>
<!-- Engine may inject / update:
     data-form-intelligent-error="username"
     aria-invalid="true"
     aria-describedby="…"
-->
```

### React JSX

```tsx
<label>
  Username
  <input {...form.field("username")} autoComplete="username" />
  {form.state.fieldMeta.username?.isValidating ? <span>Checking…</span> : null}
  {form.state.errors.username ? <span role="alert">{form.state.errors.username}</span> : null}
</label>
```

---

## Cheat sheet

```ts
await form.validate(); // validate all (or current wizard step)
await form.validate({ paths: ["email"] }); // one field
form.setError("email", "Custom message"); // manual error
form.clearErrors("email"); // clear one field
```

**Next:** [Submission](/packages/form-intelligence/modules/submission) — what happens after validation passes.
