# Validation

Check user input before submit — with built-in rules, custom logic, or async API calls.

**Previous:** [Capabilities](/packages/form-intelligent/modules/capabilities) · **Next:** [Submission](/packages/form-intelligent/modules/submission)

::: tip Playground
[Validation explorer →](/playground/form-intelligent/validation) — timing modes, async validators, field inspector.
:::

## Import path

```ts
import { createForm, required, email, asyncValidator } from "@jayoncode/form-intelligent";
// Pipeline helpers (toNormalizedErrors, …):
import {} from /* … */ "@jayoncode/form-intelligent/validation";
```

Prefer the main entry for everyday validators. Full map: [Entrypoints](/packages/form-intelligent/modules/entrypoints).

## Problem → solution

| Problem                                         | Solution                                               |
| ----------------------------------------------- | ------------------------------------------------------ |
| Ad-hoc `if` checks scattered in submit handlers | Declarative `validators` / `schema` on `createForm`    |
| Errors appear too early or too late             | `validateOn` timing (`onBlur`, `onChange`, `onSubmit`) |
| Need server uniqueness checks                   | Async validators that return a string error            |
| Several server checks on one field              | Multiple `asyncValidator`s in one array (ordered)      |

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

| Validator                | Use when                                                |
| ------------------------ | ------------------------------------------------------- |
| `required`               | Field cannot be empty                                   |
| `email`                  | Must look like an email                                 |
| `url`                    | Must be a valid URL                                     |
| `minLength(n)`           | String too short                                        |
| `maxLength(n)`           | String too long                                         |
| `regex(pattern, msg)`    | Custom format                                           |
| `number` / `min` / `max` | Numeric bounds                                          |
| `date`                   | Parseable date                                          |
| `phone()`                | E.164-style phone check (optional fields: empty passes) |
| `currency(opts?)`        | Amount / precision                                      |
| `password(opts?)`        | Strength rules                                          |
| `matchesField(path)`     | Confirm-password style                                  |
| `requiredWhen(...)`      | Conditional required                                    |

::: warning `phone` / `currency` — validator vs formatter
On the **main** package, `phone` and `currency` are **validators** (factories). They answer: “is this value valid?”

```ts
import { createForm, required, phone, currency } from "@jayoncode/form-intelligent";

createForm({
  initialValues: { mobile: "", amount: "" },
  validators: {
    mobile: [required, phone()], // ✅ validation
    amount: [required, currency({ precision: 2 })],
  },
});
```

They do **not** mask input as the user types. Masking uses **`format*`** helpers on `/format`:

```ts
// ❌ Not a mask — this `phone` is the validator
import { phone } from "@jayoncode/form-intelligent";

// ✅ Display ↔ store masking
import { formatPhone, formatCurrency } from "@jayoncode/form-intelligent/format";
```

| Need                             | Import                               | API                             |
| -------------------------------- | ------------------------------------ | ------------------------------- |
| Validate phone / amount          | `@jayoncode/form-intelligent`        | `phone()`, `currency(opts?)`    |
| Mask phone / amount while typing | `@jayoncode/form-intelligent/format` | `formatPhone`, `formatCurrency` |

See [Formatters](/packages/form-intelligent/modules/formatters) and [Entrypoints](/packages/form-intelligent/modules/entrypoints).
:::

### Error shape (normalized)

Public field errors on the form are a **path → string** map (`form.errors()` / `form.state.errors`).

Helpers under `@jayoncode/form-intelligent/validation`:

```ts
toNormalizedErrors(errors) // → { path, message, code? }[]
fromNormalizedErrors(list) // → Record<path, string>
mergeValidationErrors(current, incoming, validatedPaths?)
```

`ValidatorResult` is `true | false | string | undefined`. Throwing validators are caught and converted to a string message (do not rely on throws for control flow).

Structured `{ code, severity }` errors remain **Open** (D-ENTERPRISE-ERR) — string messages are the SHIPPED contract.

---

## Validation timing

Control **timing** with `validateOn`:

| Mode        | Runs when                            | Best for                      |
| ----------- | ------------------------------------ | ----------------------------- |
| `onChange`  | Every keystroke (debounced)          | Instant feedback              |
| `onBlur`    | User leaves field                    | Less noisy (default-friendly) |
| `onSubmit`  | `submit()` or `validate()`           | Simple forms                  |
| `onTouched` | After field has been touched/visited | Progressive UX                |
| `all`       | Any trigger                          | Always validate               |

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

Prefer `asyncValidator` so the engine can debounce, abort, and (with options) cache/retry:

```ts
import { asyncValidator } from "@jayoncode/form-intelligent";

// Unary — mark as async (existing)
asyncValidator(async (value) => {
  /* … */
});

// Options object — cache, retry, timeout, debounce, …
asyncValidator({
  validate: async (value, { signal }) => {
    const res = await fetch(`/api/check?u=${value}`, { signal });
    return res.ok || "Unavailable";
  },
  debounce: 400,
  timeout: 5000,
  retry: { maxAttempts: 3, delayMs: (n) => 200 * n },
  cache: "10m",
  preventDuplicates: true,
});
```

### Multiple async validators on one field

Put several `asyncValidator`s in the same field array. Sync rules run first; then each async check runs **in order** — first failure wins (later calls are skipped).

Real signup case: reserved names, uniqueness, and a moderation API on `username`:

```ts
import {
  createForm,
  required,
  minLength,
  regex,
  asyncValidator,
} from "@jayoncode/form-intelligent";

createForm({
  initialValues: { username: "" },
  validateOn: "onBlur",
  validators: {
    username: [
      required,
      minLength(3),
      regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, or _."),

      // 1) cheap denylist (edge / CDN)
      asyncValidator({
        debounce: 300,
        cache: "5m",
        validate: async (value, { signal }) => {
          const res = await fetch(
            `/api/usernames/reserved?u=${encodeURIComponent(String(value))}`,
            {
              signal,
            },
          );
          const { reserved } = (await res.json()) as { reserved: boolean };
          return reserved ? "That username is reserved." : true;
        },
      }),

      // 2) uniqueness against your DB
      asyncValidator({
        debounce: 400,
        timeout: 5000,
        preventDuplicates: true,
        validate: async (value, { signal }) => {
          const res = await fetch(
            `/api/usernames/available?u=${encodeURIComponent(String(value))}`,
            {
              signal,
            },
          );
          const { available } = (await res.json()) as { available: boolean };
          return available ? true : "Username already taken.";
        },
      }),

      // 3) moderation / abuse score (slower — only runs if 1–2 passed)
      asyncValidator({
        debounce: 500,
        timeout: 8000,
        retry: { maxAttempts: 2, delayMs: (n) => 250 * n },
        validate: async (value, { signal }) => {
          const res = await fetch("/api/usernames/moderate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: value }),
            signal,
          });
          const { ok, reason } = (await res.json()) as { ok: boolean; reason?: string };
          return ok ? true : (reason ?? "Choose a different username.");
        },
      }),
    ],
  },
});
```

While any of those run, `form.state.fieldMeta.username?.isValidating` is `true` — show a spinner and keep submit disabled until the chain settles.

[Try async validation in the playground →](/playground/form-intelligent/validation)

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

**Next:** [Submission](/packages/form-intelligent/modules/submission) — what happens after validation passes.
