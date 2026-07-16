# Rules

Declarative conditional logic — show, hide, require, enable, populate, and gate submit — without `useEffect` spaghetti.

**Previous:** [Workflow](/packages/form-intelligent/modules/workflow) · **Next:** [Calculations](/packages/form-intelligent/modules/calculations)

::: tip Playground
[Rules explorer →](/playground/form-intelligent/rules) · [Dependencies →](/playground/form-intelligent/dependencies)
:::

## Problem → solution

| Problem                                      | Solution                                        |
| -------------------------------------------- | ----------------------------------------------- |
| Show/hide and require fields via `useEffect` | `when()` rules on `createForm` / `form.when()`  |
| Submit allowed when UI should block          | `disableSubmit` / `form.state.ui`               |
| Hard to test condition trees                 | Declarative chain: `.equals().show().require()` |

## Overview

Import `when` from the core package (or `@jayoncode/form-intelligent/rules`):

```ts
import { createForm, when } from "@jayoncode/form-intelligent";

createForm({
  initialValues: {
    customerType: "Personal",
    companyName: "",
    taxNumber: "",
  },
  rules: [when("customerType").equals("Business").show("companyName").require("taxNumber")],
});
```

Rules evaluate when watched values change. Results land in `form.state.fieldUi` and `form.state.ui` (submit disabled flag).

---

## Which import should I use?

| Import                                                           | When to use it                                                                                                                                                 |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `import { createForm, when } from "@jayoncode/form-intelligent"` | **Default.** Same module as your form; readable app code.                                                                                                      |
| `import { when } from "@jayoncode/form-intelligent/rules"`       | Prefer when you want an **explicit rules dependency**, separate entry sizing, or to keep rule helpers next to other `/rules` APIs (`evaluateFormRules`, etc.). |

Both export the same `when` builder. Modern bundlers tree-shake unused named exports from the core entry, so importing only `createForm` does not pull `when` into your app.

`when()` itself is a small fluent builder. The heavier rule **evaluator** still loads lazily with the workflow engine when the form runs rules — not when you import the builder.

```ts
// Default — fine for almost every app
import { createForm, when } from "@jayoncode/form-intelligent";

// Explicit subpath — optional
import { when } from "@jayoncode/form-intelligent/rules";
```

---

## Conditions

Chain one condition on the watched field:

| Method              | Meaning                   |
| ------------------- | ------------------------- |
| `.equals(value)`    | Watched value `=== value` |
| `.notEquals(value)` | Not equal                 |
| `.greaterThan(n)`   | Numeric comparison        |
| `.lessThan(n)`      | Numeric comparison        |

```ts
when("loanAmount").greaterThan(500_000);
when("country").notEquals("");
```

---

## Actions

| Method                            | Effect                             |
| --------------------------------- | ---------------------------------- |
| `.show(...paths)`                 | Mark fields visible                |
| `.hide(...paths)`                 | Mark fields hidden                 |
| `.require(...paths)`              | Dynamically required               |
| `.optional(...paths)`             | Clear dynamic required             |
| `.enable(...paths)`               | Enable inputs                      |
| `.disable(...paths)`              | Disable inputs                     |
| `.disableSubmit()`                | Block submit while condition holds |
| `.changes(loader).populate(path)` | Load options and fill a select     |
| `.then(ctx => { … })`             | Imperative multi-action handler    |

```ts
when("customerType").equals("Business").show("companyName").require("taxNumber");

when("loanAmount")
  .greaterThan(500_000)
  .show("managerApproval")
  .require("managerApproval")
  .disableSubmit();
```

---

## Reading UI state

```ts
form.state.fieldUi.companyName?.visible;
form.state.fieldUi.taxNumber?.required;
form.state.fieldUi.province?.disabled;
form.state.fieldUi.province?.options;
form.state.ui.submitDisabled;
```

Headless UIs should honor `fieldUi`. With DOM enhancement, wrap fields:

```html
<div data-form-intelligent-field="companyName">
  <label>Company</label>
  <input name="companyName" />
</div>
```

The enhancer applies `hidden`, `disabled`, and `required` from `fieldUi`.

### React JSX structure

```tsx
const ui = form.state.fieldUi;

return (
  <form {...form.form()}>
    <select {...form.field("customerType")}>
      <option value="Personal">Personal</option>
      <option value="Business">Business</option>
    </select>

    {ui.companyName?.visible !== false ? (
      <label>
        Company
        <input {...form.field("companyName")} />
      </label>
    ) : null}

    <label>
      Tax number{ui.taxNumber?.required ? " *" : ""}
      <input
        {...form.field("taxNumber")}
        required={ui.taxNumber?.required === true}
        disabled={ui.taxNumber?.disabled === true}
      />
    </label>

    <label>
      Province
      <select {...form.field("province")} disabled={ui.province?.disabled === true}>
        {(ui.province?.options ?? []).map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>

    <button {...form.submit()} disabled={form.state.ui.submitDisabled}>
      Continue
    </button>
  </form>
);
```

---

## Field dependencies (populate)

```ts
async function loadProvinces(country: unknown) {
  const list = await api.provinces(String(country));
  return list.map((name) => ({ label: name, value: name }));
}

createForm({
  initialValues: { country: "", province: "" },
  rules: [when("country").changes(loadProvinces).populate("province")],
});
```

When `country` changes, the loader runs and options appear on `form.state.fieldUi.province.options` / `form.state.fieldOptions.province`.

[Dependencies playground →](/playground/form-intelligent/dependencies)

---

## Runtime registration

```ts
form.when("plan").equals("enterprise").show("seatCount").require("seatCount");
```

---

## Business rules with `.then()`

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

---

## Cheat sheet

```ts
// Prefer this in app code
import { createForm, when } from "@jayoncode/form-intelligent";

// Optional explicit subpath
// import { when } from "@jayoncode/form-intelligent/rules";

rules: [
  when("type").equals("B2B").show("vat").require("vat"),
  when("country").changes(loadRegions).populate("region"),
];

form.state.fieldUi;
form.state.ui.submitDisabled;
```

**Next:** [Calculations](/packages/form-intelligent/modules/calculations) — derived totals without manual events.
