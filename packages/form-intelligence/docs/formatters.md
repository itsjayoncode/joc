# Formatters

Mask and clean values as the user types — phone numbers, currency, slugs — without hand-rolling `onChange` parsers.

**Previous:** [Calculations](/packages/form-intelligence/modules/calculations) · **Next:** [Integrations](/packages/form-intelligence/modules/integrations)

::: tip Playground
[Formatters explorer →](/playground/form-intelligence/formatters) — compare display value vs stored value.
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
} from "@jayoncode/form-intelligence/format";
```

::: tip Naming
Formatters use a `format*` prefix (`formatPhone`, `formatCurrency`, …) so they never clash with main-entry **validators** like `phone()` / `currency()`.  
`trim` stays `trim` (shared cleanup helper).
:::

| Job      | Package entry                         | What you get                       | Typical use                                   |
| -------- | ------------------------------------- | ---------------------------------- | --------------------------------------------- |
| Validate | `@jayoncode/form-intelligence`        | `phone()`, `currency(opts?)`       | `validators: { mobile: [required, phone()] }` |
| Mask     | `@jayoncode/form-intelligence/format` | `formatPhone`, `formatCurrency`, … | `field("mobile", { format: formatPhone })`    |

```ts
// ❌ Wrong for masking — these are validators from the main entry
import { phone, currency } from "@jayoncode/form-intelligence";

// ✅ Formatters (this page)
import { formatPhone, formatCurrency } from "@jayoncode/form-intelligence/format";

// ✅ Validators (validation guide)
import { phone } from "@jayoncode/form-intelligence";
validators: {
  mobile: [phone()];
}
```

Full validator docs: [Validation → built-ins](/packages/form-intelligence/modules/validation#basics--built-in-validators).

---

## Format vs transform (do not mix these up)

|                     | **Format** (`format` / `parse`)          | **Transform** (`transform`)                               |
| ------------------- | ---------------------------------------- | --------------------------------------------------------- |
| Purpose             | Display ↔ store **masking**              | Clean value **before validation**                         |
| Typical use         | `(555) 123-4567`, `42.50`, `hello-world` | Trim spaces, sanitize, normalize                          |
| Import helpers from | `@jayoncode/form-intelligence/format`    | Field config / `@jayoncode/form-intelligence/transform`   |
| Pipeline            | Per-field `parse` then `format`          | Fixed order: trim → normalize → sanitize → custom → parse |

**Format example** (masking):

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { formatPhone } from "@jayoncode/form-intelligence/format";

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

### Transform options

Inbound stages always run in fixed order (`TRANSFORM_INBOUND_ORDER`):

`trim` → `normalize` → `sanitize` → `custom` (`stages`) → `parse`

| Option      | Type                                          | Notes                                       |
| ----------- | --------------------------------------------- | ------------------------------------------- |
| `trim`      | `boolean` \| `"start"` \| `"end"` \| `"both"` | `true` ≡ `"both"`                           |
| `normalize` | `boolean` \| `"nfc"` \| `"nfd"`               | Unicode normalization; `true` ≡ `"nfc"`     |
| `sanitize`  | `boolean` \| `SanitizeOptions`                | `true` enables defaults below               |
| `parse`     | `Parser`                                      | Final inbound parse before validation       |
| `stages`    | `TransformFn[]`                               | Custom functions between sanitize and parse |

`SanitizeOptions`:

| Option              | Default when `sanitize: true` | Notes                                |
| ------------------- | ----------------------------- | ------------------------------------ |
| `stripHtml`         | `true`                        | Strip simple HTML tags               |
| `stripControlChars` | `true`                        | Strip C0 controls except tab/newline |

```ts
form.field("bio", {
  transform: {
    trim: "both",
    normalize: "nfc",
    sanitize: { stripHtml: true, stripControlChars: true },
    stages: [(value) => String(value).replace(/\s+/g, " ")],
  },
});
```

Low-level helpers live on `@jayoncode/form-intelligence/transform` — `field({ transform })` already builds and runs the pipeline for you; reach for these when testing transform behavior without a form:

```ts
import {
  createTransformPipeline,
  runTransformInbound,
  TRANSFORM_INBOUND_ORDER,
} from "@jayoncode/form-intelligence/transform";

const pipeline = createTransformPipeline({ trim: true, sanitize: true });
pipeline.inbound(rawValue, { path: "bio", values }); // same stages field({ transform }) runs

// Or run the stages directly against a `transform` option object / custom stage array:
runTransformInbound(rawValue, { trim: true, normalize: "nfc" }, { path: "bio", values });

TRANSFORM_INBOUND_ORDER; // ["trim", "normalize", "sanitize", "custom", "parse"]
```

Outbound **format** is separate and is not part of `TRANSFORM_INBOUND_ORDER`.

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
} from "@jayoncode/form-intelligence/format";

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
import { composeFormatters, trim, formatUppercase } from "@jayoncode/form-intelligence/format";

form.field("code", { format: composeFormatters(trim, formatUppercase) });
```

### Advanced format helpers

`field()` already wires `parse` / `format` for you via `formatFieldValue`. These lower-level pieces are exported on `/format` for building your own field-binding layer or testing a formatter in isolation:

| Export              | Role                                                             |
| ------------------- | ---------------------------------------------------------------- |
| `formatForDisplay`  | Apply `format` only, honoring `formatOnDisplay: false`           |
| `parseFromInput`    | Apply `parse` only, honoring `parseOnInput: false`               |
| `roundTripFormat`   | `{ parsed, formatted }` — run both in one call, useful for tests |
| `composeParsers`    | Compose parsers right-to-left (mirrors `composeFormatters`)      |
| `FormatterRegistry` | Class behind `schema: { format: "phone" }` preset resolution     |

```ts
import { roundTripFormat, formatPhone, phoneParser } from "@jayoncode/form-intelligence/format";

roundTripFormat("(555) 123-4567", { format: formatPhone, parse: phoneParser });
// { parsed: "5551234567", formatted: "(555) 123-4567" }
```

---

## Custom formatter

```ts
import { formatCustom } from "@jayoncode/form-intelligence/format";

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

::: warning Schema preset `"phone"` is Philippine
`schema: { format: "phone" }` and `"philippine-phone"` both resolve to **`formatPhilippinePhone`** / `philippinePhoneParser` (local PH grouping), **not** the North American-style `formatPhone` helper.

| Schema preset        | Resolves to                    |
| -------------------- | ------------------------------ |
| `"phone"`            | `formatPhilippinePhone`        |
| `"philippine-phone"` | `formatPhilippinePhone` (same) |
| `"credit-card"`      | `formatCreditCard` + parser    |
| `"currency"`         | built-in currency formatter    |
| `"slug"`             | `formatSlug`                   |

For US-style `(555) 123-4567` masking, pass the function explicitly:

```ts
import { formatPhone } from "@jayoncode/form-intelligence/format";

form.field("mobile", { format: formatPhone });
```

:::

---

## React

Register format once (create options or first `field()` call), then bind:

```tsx
import { formatPhone } from "@jayoncode/form-intelligence/format";

form.field("phone", { format: formatPhone });

<input {...form.field("phone").bind()} inputMode="tel" />;
```

**Next:** [Integrations](/packages/form-intelligence/modules/integrations) — session, keyboard, analytics.
