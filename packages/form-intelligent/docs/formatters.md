# Formatters

Mask and clean values as the user types — phone numbers, currency, slugs — without hand-rolling `onChange` parsers.

**Previous:** [Calculations](/packages/form-intelligent/modules/calculations) · **Next:** [Integrations](/packages/form-intelligent/modules/integrations)

::: tip Playground
[Formatters explorer →](/playground/form-intelligent/formatters) — compare display value vs stored value.
:::

## Import from `/format` (required)

Formatter helpers live on the **`/format` subpath**. They are **not** on the main package entry.

```ts
import {
  formatPhone,
  formatCurrency,
  formatSlug,
  formatCreditCard,
  creditCardParser,
  trim,
  formatUppercase,
  composeFormatters,
} from "@jayoncode/form-intelligent/format";
```

::: tip Naming
Formatters use a `format*` prefix (`formatPhone`, `formatCurrency`, …) so they never clash with main-entry **validators** like `phone()` / `currency()`.  
`trim` stays `trim` (shared cleanup helper).
:::

| Job      | Package entry                        | What you get                       | Typical use                                   |
| -------- | ------------------------------------ | ---------------------------------- | --------------------------------------------- |
| Validate | `@jayoncode/form-intelligent`        | `phone()`, `currency(opts?)`       | `validators: { mobile: [required, phone()] }` |
| Mask     | `@jayoncode/form-intelligent/format` | `formatPhone`, `formatCurrency`, … | `field("mobile", { format: formatPhone })`    |

```ts
// ❌ Wrong for masking — these are validators from the main entry
import { phone, currency } from "@jayoncode/form-intelligent";

// ✅ Formatters (this page)
import { formatPhone, formatCurrency } from "@jayoncode/form-intelligent/format";

// ✅ Validators (validation guide)
import { phone } from "@jayoncode/form-intelligent";
validators: {
  mobile: [phone()];
}
```

Full validator docs: [Validation → built-ins](/packages/form-intelligent/modules/validation#basics--built-in-validators).

---

## Format vs transform (do not mix these up)

|                     | **Format** (`format` / `parse`)          | **Transform** (`transform`)                               |
| ------------------- | ---------------------------------------- | --------------------------------------------------------- |
| Purpose             | Display ↔ store **masking**              | Clean value **before validation**                         |
| Typical use         | `(555) 123-4567`, `42.50`, `hello-world` | Trim spaces, sanitize, normalize                          |
| Import helpers from | `@jayoncode/form-intelligent/format`     | Field config / `@jayoncode/form-intelligent/transform`    |
| Pipeline            | Per-field `parse` then `format`          | Fixed order: trim → normalize → sanitize → custom → parse |

**Format example** (masking):

```ts
import { createForm } from "@jayoncode/form-intelligent";
import { formatPhone } from "@jayoncode/form-intelligent/format";

const form = createForm({ initialValues: { phone: "" } });

form.field("phone", { format: formatPhone }).setValue("5551234567");
// stored / displayed shape: "(555) 123-4567"
```

**Transform example** (canonical inbound — not a formatter):

```ts
form.field("email", {
  transform: { trim: true, sanitize: true },
});
```

Use **format** when the user should see a mask. Use **transform** when you need a clean value before validators run.

---

## Built-in formatters

| Formatter                                      | Example in → stored                        |
| ---------------------------------------------- | ------------------------------------------ |
| `formatPhone`                                  | `5551234567` → `(555) 123-4567`            |
| `formatCurrency`                               | `42.5` → `42.50`                           |
| `formatCreditCard`                             | `4111111111111111` → `4111 1111 1111 1111` |
| `formatSlug`                                   | `Hello World!` → `hello-world`             |
| `formatPhilippinePhone`                        | `09171234567` → `0917 123 4567`            |
| `trim` / `formatUppercase` / `formatLowercase` | String cleanup                             |

```ts
import {
  formatPhone,
  formatCurrency,
  formatSlug,
  formatCreditCard,
  creditCardParser,
} from "@jayoncode/form-intelligent/format";

form.field("phone", { format: formatPhone });
form.field("amount", { format: formatCurrency });
form.field("handle", { format: formatSlug });
form.field("card", { format: formatCreditCard, parse: creditCardParser });
```

### Format vs parse hooks

| Hook     | When                           | Use for                                  |
| -------- | ------------------------------ | ---------------------------------------- |
| `parse`  | On input (often before format) | Strip mask characters back to raw digits |
| `format` | On display / store             | Apply the mask                           |

Toggle with `parseOnInput` / `formatOnDisplay` on field options.

```ts
form.field("code", {
  parse: (v) => String(v).replace(/\s/g, ""),
  format: (v) => String(v).toUpperCase(),
});
```

Compose:

```ts
import { composeFormatters, trim, formatUppercase } from "@jayoncode/form-intelligent/format";

form.field("code", { format: composeFormatters(trim, formatUppercase) });
```

---

## Custom formatter

```ts
import { formatCustom } from "@jayoncode/form-intelligent/format";

const definition = formatCustom(
  (value) => String(value).toUpperCase(),
  (value) => String(value).trim(),
);

form.field("code", definition);
```

---

## Schema presets (no `/format` import needed)

String presets resolve built-ins inside the engine — useful with `target` / schema:

```ts
createForm({
  target: "#profile",
  schema: {
    phone: { format: "phone" }, // or "philippine-phone" | "credit-card" | "currency" | "slug"
    card: { format: "credit-card" },
  },
});
```

```html
<form id="profile">
  <input name="phone" inputmode="tel" autocomplete="tel" />
  <input name="card" inputmode="numeric" autocomplete="cc-number" />
</form>
```

When you pass **functions** (`format: formatPhone`), import them from `/format`. When you pass **preset strings** (`format: "phone"`), the main `createForm` path is enough.

---

## React

Register format once (create options or first `field()` call), then bind:

```tsx
import { formatPhone } from "@jayoncode/form-intelligent/format";

form.field("phone", { format: formatPhone });

<input {...form.field("phone").bind()} inputMode="tel" />;
```

**Next:** [Integrations](/packages/form-intelligent/modules/integrations) — session, keyboard, analytics.
