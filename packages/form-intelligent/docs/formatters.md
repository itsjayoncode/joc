# Formatters

Clean up input as the user types — phone masks, currency decimals, URL slugs.

**Previous:** [Calculations](/packages/form-intelligent/modules/calculations) · **Next:** [Integrations](/packages/form-intelligent/modules/integrations)

::: tip Playground
[Formatters explorer →](/playground/form-intelligent/formatters) — compare display value vs stored value.
:::

## Problem → solution

| Problem                                 | Solution                                             |
| --------------------------------------- | ---------------------------------------------------- |
| Mask / normalize in every input handler | Field `format` / `parse` options                     |
| Display value ≠ stored value            | Built-in formatters (`phone`, `currency`, `slug`, …) |

## Overview

Formatters run on `setValue` and normalize stored values. They are separate from validators (validity checks).

```ts
import { phone, currency, slug } from "@jayoncode/form-intelligent";

form.field("phone", { format: phone }).setValue("5551234567");
// stored: "(555) 123-4567"
```

---

## Built-in formatters

| Formatter                          | Example in → stored                        |
| ---------------------------------- | ------------------------------------------ |
| `phone`                            | `5551234567` → `(555) 123-4567`            |
| `currency`                         | `42.5` → `42.50`                           |
| `creditCard`                       | `4111111111111111` → `4111 1111 1111 1111` |
| `slug`                             | `Hello World!` → `hello-world`             |
| `trim` / `uppercase` / `lowercase` | String cleanup                             |

```ts
import {
  phone,
  currency,
  slug,
  creditCard,
  creditCardParser,
} from "@jayoncode/form-intelligent/format";

form.field("amount", { format: currency }).setValue(rawInput);
form.field("handle", { format: slug }).setValue(title);
form.field("card", { format: creditCard, parse: creditCardParser }).setValue(input);
```

---

## Format vs parse

| Hook     | When                     | Use for               |
| -------- | ------------------------ | --------------------- |
| `parse`  | On input (before format) | Strip mask characters |
| `format` | On display / store       | Display normalization |

Toggle with `parseOnInput` / `formatOnDisplay` on field options.

```ts
form.field("code", {
  parse: (v) => String(v).replace(/\s/g, ""),
  format: (v) => String(v).toUpperCase(),
});
```

Compose chains:

```ts
import { composeFormatters, trim, uppercase } from "@jayoncode/form-intelligent/format";

form.field("code", { format: composeFormatters(trim, uppercase) });
```

---

## Custom formatter

```ts
import { custom } from "@jayoncode/form-intelligent/format";

const definition = custom(
  (value) => String(value).toUpperCase(),
  (value) => String(value).trim(),
);

form.field("code", definition);
```

Schema presets: `format: "philippine-phone" | "credit-card" | "phone" | "currency" | "slug"`.

---

## Element structure

### Native HTML

```html
<form id="profile">
  <label>
    Phone
    <input name="phone" inputmode="tel" autocomplete="tel" />
  </label>
  <label>
    Card
    <input name="card" inputmode="numeric" autocomplete="cc-number" />
  </label>
</form>
```

```ts
createForm({
  target: "#profile",
  schema: {
    phone: { format: "philippine-phone" },
    card: { format: "credit-card" },
  },
});
```

### React JSX

```tsx
<label>
  Phone
  <input
    {...form.field("phone")}
    onChange={(event) => {
      form.field("phone", { format: phone }).setValue(event.target.value);
    }}
    inputMode="tel"
  />
</label>
```

Or rely on schema presets / field options registered once at create time, then `{...form.field("phone")}` alone is enough.

**Next:** [Integrations](/packages/form-intelligent/modules/integrations) — session, keyboard, analytics.
