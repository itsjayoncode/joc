# UI projection

Shared interpretation of engine state for apps, DOM enhancer, adapters, and tooling.

**Previous:** [Entrypoints](/packages/form-intelligence/modules/entrypoints) · **Next:** [Validation](/packages/form-intelligence/modules/validation)

::: tip Import
`@jayoncode/form-intelligence/ui`
:::

## Problem → solution

| Problem                                           | Solution                                     |
| ------------------------------------------------- | -------------------------------------------- |
| Every adapter reimplements “when to show errors”  | `errorDisplay` policy + `field.ui.showError` |
| Submit disable logic forked across React / DOM    | `form.ui.canSubmit` + `explain("submit")`    |
| “Why is this field locked?” scattered in app code | `explain("disabled")` / `disabledReasons`    |
| CSS / a11y need one status token                  | `field.ui.status` (exactly one)              |

## Quick start

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { ui } from "@jayoncode/form-intelligence/ui";

const form = createForm({
  initialValues: { email: "" },
  plugins: [
    ui({
      errorDisplay: "touched",
      disableSubmitWhen: ["submitting", "validating", "ruleDisabled"],
    }),
  ],
});

form.field("email").ui.showError;
form.field("email").ui.status; // "idle" | "validating" | "error" | "success"
form.ui.canSubmit;
form.ui.explain("submit");
```

Registering `ui()` opts the **DOM enhancer** into the same helpers. Without the plugin, DOM keeps legacy `error && touched` / submit behavior. `form.ui` / `field.ui` derived keys are still available with default policies.

## Policies

| Policy              | Default                                      | Role                                                                              |
| ------------------- | -------------------------------------------- | --------------------------------------------------------------------------------- |
| `errorDisplay`      | `"touched"`                                  | When `showError` is true (`touched` \| `submit` \| `always` \| `touchedOrSubmit`) |
| `disableSubmitWhen` | `["submitting","validating","ruleDisabled"]` | Tokens that block `canSubmit` (`invalid` is opt-in)                               |

Hard rule: `formUi.submitDisabled` always blocks submit, even if `"ruleDisabled"` is omitted from the array.

## Field derived API

| Key               | Meaning                                                       |
| ----------------- | ------------------------------------------------------------- |
| `hasError`        | **Validation state** — raw error present                      |
| `showError`       | **UI state** — whether to display the error under policy      |
| `errorMessage`    | Thin projection of the error string                           |
| `status`          | Exactly one of `validating` \| `error` \| `success` \| `idle` |
| `disabledReasons` | Alias of `explain("disabled").reasons`                        |
| `explain(topic)`  | Primary explanation API                                       |

Presentation keys (`visible`, `disabled`, `required`, `readOnly`, `busy`) stay owned by Presentation — `/ui` never overwrites them.

### Status priority (exactly one)

| Priority | Status       | When                                        |
| -------- | ------------ | ------------------------------------------- |
| 1        | `validating` | Field `isValidating` or presentation `busy` |
| 2        | `error`      | `showError === true`                        |
| 3        | `success`    | Touched and no raw error                    |
| 4        | `idle`       | Default                                     |

`validating` and `error` never appear together.

## Form derived API

| Key                                                                       | Meaning                              |
| ------------------------------------------------------------------------- | ------------------------------------ |
| `canSubmit`                                                               | Composed submit gate                 |
| `submitBlockedReasons`                                                    | Alias of `explain("submit").reasons` |
| `phase`                                                                   | Thin projection of `submitPhase`     |
| `invalidFields` / `visibleFields` / `requiredFields` / `validatingFields` | Registration-order snapshots         |

## Vanilla (DOM)

```ts
createForm({
  target: "#signup",
  plugins: [ui()],
  schema: { email: "email" },
  async onSubmit(values) {
    await api.signup(values);
  },
});
```

With `ui()` registered, the enhancer sets `aria-invalid` from `showError` and `data-fi-status` from `field.ui.status`.

## React

```tsx
import { useForm } from "@jayoncode/form-intelligence-react";
import { ui } from "@jayoncode/form-intelligence/ui";

const form = useForm({
  plugins: [ui()],
  schema: { email: "email" },
  async onSubmit(values) {
    await api.login(values);
  },
});

return (
  <form {...form.form()}>
    <input {...form.field("email")} />
    {/* data-fi-status + aria-invalid from projection */}
    <button {...form.submit()}>Login</button>
    {/* disabled via form.ui.canSubmit */}
  </form>
);
```

Prefer `form.fieldController("email").ui` / `form.instance.ui` for explain and collections.

## Ownership

`/ui` only **projects**, **composes**, or **explains** existing engine state. It does not own validation, presentation intents, or submission.

## Hard guards vs UX policy

`form.ui.canSubmit` is **presentation only**. Enforcement lives on Submission:

```ts
form.submissionGuard(); // { allowed, reasons } — hard eligibility
await form.submit(); // refuses when !submissionGuard().allowed
```

| Concern                             | Owner                     | Effect                                                         |
| ----------------------------------- | ------------------------- | -------------------------------------------------------------- |
| `alreadySubmitting`, `ruleDisabled` | Submission guards         | Blocks `submit()` **and** forces `form.ui.canSubmit === false` |
| `validating`, optional `invalid`    | `/ui` `disableSubmitWhen` | Button UX only — does **not** change engine behavior           |

See construction ADR-SUB-001 (Submission Guards).

## DevTools

```ts
import { enableFormDevTools, getFormDevTools } from "@jayoncode/form-intelligence/devtools";

enableFormDevTools(form);
getFormDevTools().getUiProjection(form.id);
// → canSubmit, submitExplain, per-field status / showError / disabledReasons
```

## Related

- [Entrypoints](/packages/form-intelligence/modules/entrypoints) — `/ui` subpath
- [Adapters](/packages/form-intelligence/modules/adapters) — React / DOM wiring
- [Rules](/packages/form-intelligence/modules/rules) — `formUi` / `fieldUi` intents
- [API (TypeDoc)](/packages/form-intelligence/api/)
