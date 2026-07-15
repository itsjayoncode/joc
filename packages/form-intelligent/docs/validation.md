# Validation

Check user input before submit — with built-in rules, custom logic, or async API calls.

**Previous:** [Tutorial](/packages/form-intelligent/modules/getting-started) · **Next:** [Submission](/packages/form-intelligent/modules/submission)

::: tip Try it first
[Open Validation playground →](/playground/form-intelligent/validation) — toggle timing, trigger async checks, and watch the field inspector.
:::

## In plain English

A **validator** answers one question: _is this value OK?_

- Returns `true` → valid
- Returns a `string` → show that message as the error

```ts
validators: {
  email: [required, email],  // run in order; first error wins
}
```

---

## Level 1 — Built-in validators

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

## Level 2 — When to validate

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

## Level 3 — Custom & cross-field rules

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

## Level 4 — Async validation

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

## Cheat sheet

```ts
await form.validate(); // validate all (or current wizard step)
await form.validate({ paths: ["email"] }); // one field
form.setError("email", "Custom message"); // manual error
form.clearErrors("email"); // clear one field
```

**Next:** [Submission](/packages/form-intelligent/modules/submission) — what happens after validation passes.
