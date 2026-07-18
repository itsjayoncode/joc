# Calculations

Derived fields that update when dependencies change — no manual `onChange` wiring.

**Previous:** [Rules](/packages/form-intelligence/modules/rules) · **Next:** [Formatters](/packages/form-intelligence/modules/formatters)

::: tip Playground
[Calculations explorer →](/playground/form-intelligence/calculations)
:::

## Import path

```ts
import { createForm, calculate } from "@jayoncode/form-intelligence";
// or instance API: form.calculate(...)
```

Main entry only for typical use. [Entrypoints](/packages/form-intelligence/modules/entrypoints).

## Problem → solution

| Problem                               | Solution                            |
| ------------------------------------- | ----------------------------------- |
| Totals recomputed in every `onChange` | `form.calculate(path, compute)`     |
| Nested deps hard to track             | Explicit `deps` in the options form |

## Overview

```ts
const form = createForm({
  initialValues: { price: 100, quantity: 1, total: 0 },
});

form.calculate("total", ({ values }) => Number(values.price) * Number(values.quantity));

// Fluent (same registration)
form
  .calculate("total")
  .from("price", "quantity")
  .compute(({ values, get }) => Number(get("price")) * Number(values.quantity));
```

When `price` or `quantity` changes, `total` is recalculated. Circular derived fields throw `ConfigurationError`.

---

## Options form

```ts
form.calculate("total", {
  deps: ["price", "quantity"],
  compute: ({ values }) => Number(values.price) * Number(values.quantity),
});
```

Use `deps` when the compute function reads nested paths that are hard to infer, or to limit which changes trigger recalculation.

---

## Patterns

### Line item total

```ts
form.calculate("lineTotal", ({ values }) => Number(values.unitPrice) * Number(values.qty));
```

### Conditional derived value

```ts
form.calculate("discount", ({ values }) =>
  values.coupon === "SAVE10" ? Number(values.subtotal) * 0.1 : 0,
);
```

### Keep derived fields read-only in UI

Treat calculated paths as display-only — bind them for output, but avoid editable inputs (or `when().disable("total")`).

---

## Element structure

### React JSX

```tsx
<form {...form.form()}>
  <label>
    Price
    <input {...form.field("price")} type="number" />
  </label>
  <label>
    Quantity
    <input {...form.field("quantity")} type="number" />
  </label>
  <p>
    Total: <strong>{form.state.values.total}</strong>
  </p>
  {/* or a read-only input */}
  <input {...form.field("total")} readOnly aria-readonly="true" />
</form>
```

### Native HTML

```html
<form id="cart">
  <input name="price" type="number" />
  <input name="quantity" type="number" />
  <output name="total" for="price quantity"></output>
</form>
```

Keep `total` out of user edits — update the `<output>` (or a read-only input) from `form.state.values.total` in your render loop.

---

## Cheat sheet

```ts
form.calculate("path", ({ values }) => /* derived */);
form.calculate("path", { deps: ["a", "b"], compute: ({ values }) => … });
form.calculate("path").from("a", "b").markDirty().compute(({ get }) => …);
form.values("total");
```

**Next:** [Formatters](/packages/form-intelligence/modules/formatters) — phone, currency, slug, credit card.
