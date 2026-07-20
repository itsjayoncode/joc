# Validation

Check user input before submit — with built-in rules, custom logic, or async API calls.

**Previous:** [Capabilities](/packages/form-intelligence/modules/capabilities) · **Next:** [Submission](/packages/form-intelligence/modules/submission)

::: tip Playground
[Validation explorer →](/playground/form-intelligence/validation) — timing modes, async validators, field inspector.

[HTML constraints →](/playground/form-intelligence/html-constraints) — `form.ref` + attribute → validator lab (Field override toggle).
:::

## Import path

```ts
import { createForm, required, email, asyncValidator } from "@jayoncode/form-intelligence";
// Pipeline helpers (toNormalizedErrors, …):
import {} from /* … */ "@jayoncode/form-intelligence/validation";
```

Prefer the main entry for everyday validators. Full map: [Entrypoints](/packages/form-intelligence/modules/entrypoints).

## Problem → solution

| Problem                                          | Solution                                               |
| ------------------------------------------------ | ------------------------------------------------------ |
| Ad-hoc `if` checks scattered in submit handlers  | Declarative `validators` / `schema` on `createForm`    |
| Errors appear too early or too late              | `validateOn` timing (`onBlur`, `onChange`, `onSubmit`) |
| Need server uniqueness checks                    | Async validators that return a string error            |
| Several server checks on one field               | Multiple `asyncValidator`s in one array (ordered)      |
| DOM inputs already have `required` / `minlength` | HTML constraints imported on attach (DOM-backed forms) |

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
import { required, email, url, minLength, regex } from "@jayoncode/form-intelligence";

createForm({
  initialValues: { email: "", site: "", code: "" },
  validators: {
    email: [required, email],
    site: [url], // optional field — empty is OK
    code: [minLength(6), regex(/^[A-Z0-9]+$/, "Use uppercase letters and numbers.")],
  },
});
```

| Validator                       | Use when                                                               |
| ------------------------------- | ---------------------------------------------------------------------- |
| `required`                      | Field cannot be empty; also seeds Presentation `required` (ARIA / DOM) |
| `email`                         | Must look like an email                                                |
| `url`                           | Must be a valid URL                                                    |
| `minLength(n)`                  | String too short                                                       |
| `maxLength(n)`                  | String too long                                                        |
| `regex(pattern, msg)`           | Custom format                                                          |
| `number(opts?)` / `min` / `max` | Numeric bounds                                                         |
| `date(opts?)`                   | Parseable date with optional bounds                                    |
| `phone()`                       | E.164-style phone check (optional fields: empty passes)                |
| `currency(opts?)`               | Amount / precision                                                     |
| `password(opts?)`               | Strength rules                                                         |
| `matchesField(path)`            | Confirm-password style                                                 |
| `requiredWhen(...)`             | Conditional required (validation only — not UI baseline)               |

### Factory options

Empty / null / `""` still pass for optional fields (pair with `required` when needed).

**`password(opts?)`**

| Option             | Default | Notes                  |
| ------------------ | ------- | ---------------------- |
| `minLength`        | `8`     | Minimum string length  |
| `requireUppercase` | —       | Must include `[A-Z]`   |
| `requireLowercase` | —       | Must include `[a-z]`   |
| `requireNumber`    | —       | Must include a digit   |
| `requireSymbol`    | —       | Must include non-alnum |

**`currency(opts?)`**

| Option        | Default | Notes                      |
| ------------- | ------- | -------------------------- |
| `precision`   | `2`     | Max decimal places         |
| `min` / `max` | —       | Numeric bounds after parse |

**`number(opts?)`**

| Option        | Notes                            |
| ------------- | -------------------------------- |
| `min` / `max` | Numeric bounds                   |
| `integer`     | Require whole number when `true` |

**`date(opts?)`**

| Option        | Notes                             |
| ------------- | --------------------------------- |
| `min` / `max` | `Date` or parseable string bounds |

```ts
validators: {
  password: [required, password({ minLength: 10, requireUppercase: true, requireNumber: true })],
  amount: [required, currency({ precision: 2, min: 0 })],
  qty: [number({ integer: true, min: 1 })],
  start: [date({ min: "2024-01-01" })],
}
```

### `matchesField` / `requiredWhen`

```ts
import { matchesField, requiredWhen } from "@jayoncode/form-intelligence";

validators: {
  confirmPassword: [matchesField("password", "Passwords must match")],
  companyName: [requiredWhen("type", (v) => v === "business", "Company required")],
}
```

`requiredWhen` is **validation only** — it does not set Presentation `required` (no `aria-required` / DOM `required`). Use `when(sourcePath).equals(...).require(path)` from [Rules](/packages/form-intelligence/modules/rules) when the UI also needs to reflect the requirement.

### HTML constraints (DOM-backed)

On `createForm({ target })` or `form.ref` / `form.form()`, Phase 1 constraint attributes on native inputs become FI validators **once at attach**. The browser does not validate (`novalidate`); attributes stay in the DOM for a11y / autofill.

| HTML                          | Validator                                                       |
| ----------------------------- | --------------------------------------------------------------- |
| `required`                    | `required` (also seeds Presentation required baseline)          |
| `minlength` / `maxlength`     | `minLength` / `maxLength`                                       |
| `pattern`                     | `regex` (invalid patterns skipped; not MutationObserver-synced) |
| `type="email"` / `type="url"` | `email` / `url`                                                 |

Same-kind conflicts resolve **Field > Schema > HTML**. Details and deferred attributes: [Adapters → Native HTML](/packages/form-intelligence/modules/adapters#native-html-built-in).

[Try it in the playground →](/playground/form-intelligence/html-constraints)

::: warning `phone` / `currency` — validator vs formatter
On the **main** package, `phone` and `currency` are **validators** (factories). They answer: “is this value valid?”

```ts
import { createForm, required, phone, currency } from "@jayoncode/form-intelligence";

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
import { phone } from "@jayoncode/form-intelligence";

// ✅ Display ↔ store masking
import { formatPhone, formatCurrency } from "@jayoncode/form-intelligence/format";
```

| Need                             | Import                                | API                             |
| -------------------------------- | ------------------------------------- | ------------------------------- |
| Validate phone / amount          | `@jayoncode/form-intelligence`        | `phone()`, `currency(opts?)`    |
| Mask phone / amount while typing | `@jayoncode/form-intelligence/format` | `formatPhone`, `formatCurrency` |

See [Formatters](/packages/form-intelligence/modules/formatters) and [Entrypoints](/packages/form-intelligence/modules/entrypoints).
:::

### Error shape (normalized)

Public field errors on the form are a **path → string** map (`form.errors()` / `form.state.errors`).

Helpers under `@jayoncode/form-intelligence/validation`:

```ts
toNormalizedErrors(errors) // → { path, message, code? }[]
fromNormalizedErrors(list) // → Record<path, string>
mergeValidationErrors(current, incoming, validatedPaths?)
```

`ValidatorResult` is `true | false | string | undefined`. Throwing validators are caught and converted to a string message (do not rely on throws for control flow).

Structured `{ code, severity }` errors remain **Open** (D-ENTERPRISE-ERR) — string messages are the SHIPPED contract.

### Pipeline helpers (`/validation`)

The engine behind `form.validate()` is also available headless — for unit tests or tooling that validates a values object without a live form:

```ts
import { runValidationPipeline } from "@jayoncode/form-intelligence/validation";

await runValidationPipeline({
  values,
  paths, // FieldPath[] to validate
  fieldValidators, // Map<FieldPath, Validator[]> registered via form.field()
  configValidators, // validators from createForm({ validators })
  crossFieldRules, // optional CrossFieldRule[]
  formValidators, // optional CrossFieldValidator[] (form-level, path "_form")
  signal, // optional AbortSignal
}); // → Record<FieldPath, string>
```

| Export                  | Role                                                                         |
| ----------------------- | ---------------------------------------------------------------------------- |
| `runValidationPipeline` | Full pipeline: field validators + cross-field + form validators              |
| `validatePaths`         | Same pipeline, field-level only (no `crossFieldRules` / `formValidators`)    |
| `toNormalizedErrors`    | `Record<path, string>` → `{ path, message, code? }[]`                        |
| `fromNormalizedErrors`  | Reverse of the above                                                         |
| `mergeValidationErrors` | Merge current + incoming errors, clearing stale entries for validated paths  |
| `listAllPaths`          | Recursively list every field path (including array items) in a values object |

Prefer `form.validate()` in app code — these helpers exist for tests/tooling that need the same logic without a form instance.

---

## Validation timing

Control **timing** with `validateOn`:

| Mode        | Runs when                                                   | Best for                      |
| ----------- | ----------------------------------------------------------- | ----------------------------- |
| `onChange`  | Value changes only (debounced; includes clear → empty)      | Instant feedback              |
| `onBlur`    | User leaves field (even with no edits); not on typing       | Less noisy (default-friendly) |
| `onSubmit`  | `submit()` or `validate()` only                             | Simple forms                  |
| `onTouched` | After touch/visit: blur and later value changes             | Progressive UX                |
| `all`       | Value changes and blur (and submit / explicit `validate()`) | Always validate               |

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
import { asyncValidator } from "@jayoncode/form-intelligence";

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
} from "@jayoncode/form-intelligence";

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

[Try async validation in the playground →](/playground/form-intelligence/validation)

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
