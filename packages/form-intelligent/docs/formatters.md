# Formatters

Clean up input as the user types — phone masks, currency decimals, URL slugs.

**Previous:** [Workflow](/packages/form-intelligent/modules/workflow) · **Next:** [Plugins](/packages/form-intelligent/modules/plugins)

::: tip Playground
[Formatters explorer →](/playground/form-intelligent/formatters) — compare display value vs stored value.
:::

## Overview

Formatters run on `setValue` and normalize stored values. They are separate from validators (validity checks).

```ts
import { phone, currency, slug } from "@jayoncode/form-intelligent";

form.field("phone", { format: phone }).setValue("5551234567");
// stored: "(555) 123-4567"
```

---

## Built-in formatters

| Formatter                          | Example in → stored             |
| ---------------------------------- | ------------------------------- |
| `phone`                            | `5551234567` → `(555) 123-4567` |
| `currency`                         | `42.5` → `42.50`                |
| `slug`                             | `Hello World!` → `hello-world`  |
| `trim` / `uppercase` / `lowercase` | String cleanup                  |

```ts
form.field("amount", { format: currency }).setValue(rawInput);
form.field("handle", { format: slug }).setValue(title);
```

---

## Format vs parse

| Hook     | When                  | Use for                       |
| -------- | --------------------- | ----------------------------- |
| `format` | On write (`setValue`) | Display normalization         |
| `parse`  | Before format         | Strip mask characters for API |

```ts
form.field("code", {
  parse: (v) => String(v).replace(/\s/g, ""),
  format: (v) => String(v).toUpperCase(),
});
```

---

## Custom formatter

```ts
const creditCard: Formatter = (value) => {
  if (typeof value !== "string") return value;
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

form.field("card", { format: creditCard }).setValue(input);
```

**Next:** [Plugins](/packages/form-intelligent/modules/plugins) — hook into form lifecycle events.
