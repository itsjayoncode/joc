# Form Intelligence — AJV

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligence-ajv.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligence-ajv)
[![Become a Sponsor](https://img.shields.io/badge/Become%20a%20Sponsor-%23ea4aaa?style=flat&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/jayoncoding)

Bridge [AJV](https://ajv.js.org/) JSON Schema validation into [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence).

## The problem

Your contract is already JSON Schema (OpenAPI, shared `schemas/`, server-side AJV). The UI then reimplements the same constraints in TypeScript. Every `minLength` change becomes two edits — or users hit errors the API never would.

## The solution

`ajvAdapter(schema | validateFn)` feeds JSON Schema (or a compiled AJV function) into Form Intelligence. Same contract on client and server; drafts, rules, and submit sit on top.

## What you get

| Capability               | Detail                                                                                                                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Schema object**        | Pass a JSON Schema literal: `ajvAdapter({ type: "object", ... })`                                                                                                                       |
| **Compiled validator**   | Pass `ValidateFunction` / async compile for reuse and `$async` keywords                                                                                                                 |
| **Path mapping**         | `instancePath` + `required`/`additionalProperties` params → field paths; form-level → `_form`                                                                                           |
| **allErrors-friendly**   | Works with AJV configured for multiple field errors                                                                                                                                     |
| **Formats**              | Use `ajv-formats` on your Ajv instance for `email`, `uri`, etc.                                                                                                                         |
| **With core workflows**  | Combine with `when()` rules, autosave, wizard, plugins, `validateOn`                                                                                                                    |
| **`AjvAdapterOptions`**  | Optional `{ ajv? }` — reuse a configured `Ajv` instance (`allErrors`, custom formats/keywords) when compiling a schema literal; ignored when you pass a pre-compiled `ValidateFunction` |
| **`formatAjvErrorPath`** | Exported helper mapping a single AJV `ErrorObject` to a Form Intelligence field path — reuse it if you post-process `validate.errors` yourself                                          |

### Behavior notes

- **First error per path wins.** When AJV reports multiple errors for the same field (e.g. with `allErrors: true`), only the first one encountered is kept.
- **Validate-only.** `ajvAdapter()` returns a `SchemaAdapter` — it validates `values` and returns `{ path: message }`. It does not infer a TypeScript type for `createForm`'s values from your JSON Schema; type your `initialValues` (or the `TValues` generic) separately.

## Install

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-ajv ajv
```

For `format` keywords, add [ajv-formats](https://github.com/ajv-validator/ajv-formats).

## Usage

```ts
import { createForm, when } from "@jayoncode/form-intelligence";
import { ajvAdapter } from "@jayoncode/form-intelligence-ajv";

const checkoutSchema = {
  type: "object",
  properties: {
    plan: { type: "string", enum: ["starter", "enterprise"] },
    email: { type: "string", minLength: 1 },
    seatCount: { type: "integer", minimum: 1 },
  },
  required: ["plan", "email"],
  additionalProperties: false,
} as const;

const form = createForm({
  initialValues: { plan: "starter", email: "", seatCount: 1 },
  schema: ajvAdapter(checkoutSchema),
  validateOn: "onBlur",
  rules: [when("plan").equals("enterprise").show("seatCount").require("seatCount")],
  workflow: {
    autosave: { enabled: true, debounceMs: 800, onSave: (v) => api.saveDraft(v) },
  },
  async onSubmit(values) {
    await api.checkout(values);
  },
});
```

### Pre-compiled / async AJV

```ts
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });
const validate = await ajv.compileAsync(schema);

createForm({
  schema: ajvAdapter(validate),
  onSubmit,
});
```

### Reusing a configured `Ajv` instance — `AjvAdapterOptions`

Pass `{ ajv }` when you want `ajvAdapter()` to compile the schema literal with an instance you already configured (e.g. with `ajv-formats`, custom keywords, or `allErrors`), instead of the adapter's internal default `new Ajv({ allErrors: true })`:

```ts
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { ajvAdapter } from "@jayoncode/form-intelligence-ajv";

const ajv = addFormats(new Ajv({ allErrors: true }));

const form = createForm({
  schema: ajvAdapter(checkoutSchema, { ajv }),
  onSubmit,
});
```

`options.ajv` only applies when `schemaOrValidate` is a schema literal — it is ignored when you pass an already-compiled `ValidateFunction`.

### `formatAjvErrorPath`

`formatAjvErrorPath(error: ErrorObject): string` is the same path-mapping logic `ajvAdapter()` uses internally, exported for reuse:

```ts
import { formatAjvErrorPath } from "@jayoncode/form-intelligence-ajv";

const path = formatAjvErrorPath(validate.errors![0]);
```

It maps `instancePath` to a dot path (`/address/city` → `address.city`), and for `required` / `additionalProperties` errors appends the offending property name from `error.params` (since AJV reports those on the _parent_ path). Root-level or unmapped errors fall back to `"_form"`.

## Docs

https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/adapters

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
