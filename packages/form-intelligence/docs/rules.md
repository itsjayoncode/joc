# Rules

Declarative conditional logic — show, hide, require, enable, populate, and gate submit — without `useEffect` spaghetti.

**Previous:** [Workflow](/packages/form-intelligence/modules/workflow) · **Next:** [Calculations](/packages/form-intelligence/modules/calculations)

::: tip Playground
[Rules explorer →](/playground/form-intelligence/rules) · [Dependencies →](/playground/form-intelligence/dependencies)
:::

## Import path

`when` and `dependencies` are on the **main** entry; `/rules` and `/dependency` are optional explicit entries. [Entrypoints](/packages/form-intelligence/modules/entrypoints).

```ts
import { createForm, when, dependencies } from "@jayoncode/form-intelligence";
// or: import { when } from "@jayoncode/form-intelligence/rules";
```

## Problem → solution

| Problem                                      | Solution                                        |
| -------------------------------------------- | ----------------------------------------------- |
| Show/hide and require fields via `useEffect` | `when()` rules on `createForm` / `form.when()`  |
| Submit allowed when UI should block          | `disableSubmit` / `form.state.ui`               |
| Hard to test condition trees                 | Declarative chain: `.equals().show().require()` |

## Overview

Import `when` from the core package (or `@jayoncode/form-intelligence/rules`):

```ts
import { createForm, when } from "@jayoncode/form-intelligence";

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

**Evaluation order:** rules run in **registration order** (config `rules`, then `form.when(…)` commits). For the same UI key, **later rules win**.

`createForm({ rules })` accepts either a `when()` builder or a plain rule object. You do **not** need `.toRule()` / `.build()` for config rules — TypeScript accepts the builder, and the form materializes it at create time.

```ts
// Preferred — pass the builder directly
rules: [when("name").equals("blocked").disableSubmit()];

// Equivalent — only needed when you want a plain FormRuleDefinition yourself
rules: [when("name").equals("blocked").disableSubmit().toRule()];
```

---

## Which import should I use?

| Import                                                            | When to use it                                                                                                                                                 |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `import { createForm, when } from "@jayoncode/form-intelligence"` | **Default.** Same module as your form; readable app code.                                                                                                      |
| `import { when } from "@jayoncode/form-intelligence/rules"`       | Prefer when you want an **explicit rules dependency**, separate entry sizing, or to keep rule helpers next to other `/rules` APIs (`evaluateFormRules`, etc.). |

Both export the same `when` builder. Modern bundlers tree-shake unused named exports from the core entry, so importing only `createForm` does not pull `when` into your app.

`when()` itself is a small fluent builder. The heavier rule **evaluator** still loads lazily with the workflow engine when the form runs rules — not when you import the builder.

```ts
// Default — fine for almost every app
import { createForm, when } from "@jayoncode/form-intelligence";

// Explicit subpath — optional
import { when } from "@jayoncode/form-intelligence/rules";
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

Prefer the presentation accessors (Phase 9):

```ts
form.getPresentation("companyName").field.visible;
form.getPresentation("taxNumber").field.required;
form.getPresentation("province").field.disabled;
form.getPresentation("province").options;
form.getPresentation().formUi.submitDisabled;

// Per-field handle
form.field("companyName").ui.visible;
```

`form.state.fieldUi` / `form.state.formUi` remain available. Headless UIs should honor presentation flags. With DOM enhancement, wrap fields:

```html
<div data-form-intelligent-field="companyName">
  <label>Company</label>
  <input name="companyName" />
</div>
```

The enhancer applies `hidden`, `disabled`, `required`, and `readOnly` from `getPresentation`.

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

Populate respects rule predicates (`equals` / `notEquals` / …). Concurrent edits drop **stale** loader results so an older response cannot overwrite a newer field’s options. Thrown loaders surface as `WorkflowError`.

### Structural graph (`dependencies`)

For cascading clears (country → province → city), declare a dependency map:

```ts
import { createForm, dependencies } from "@jayoncode/form-intelligence";

createForm({
  initialValues: { country: "", province: "", city: "" },
  dependencies: dependencies({
    province: "country",
    city: ["province"],
  }),
});
```

Parent changes **clear** children and can **revalidate** them (default). Cycles in this map throw `ConfigurationError`. `field(..., { dependsOn })` still works for revalidate-only inferred edges.

[Dependencies playground →](/playground/form-intelligence/dependencies)

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
import { createForm, when } from "@jayoncode/form-intelligence";

// Optional explicit subpath
// import { when } from "@jayoncode/form-intelligence/rules";

rules: [
  when("type").equals("B2B").show("vat").require("vat"),
  when("country").changes(loadRegions).populate("region"),
];

form.state.fieldUi;
form.state.ui.submitDisabled;
```

**Next:** [Calculations](/packages/form-intelligence/modules/calculations) — derived totals without manual events.
