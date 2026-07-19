# Form Intelligence — AJV

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligence-ajv.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligence-ajv)

Bridge [AJV](https://ajv.js.org/) JSON Schema validation into [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence).

## The problem

Your contract is already JSON Schema (OpenAPI, shared `schemas/`, server-side AJV). The UI then reimplements the same constraints in TypeScript. Every `minLength` change becomes two edits — or users hit errors the API never would.

## The solution

`ajvAdapter(schema | validateFn)` feeds JSON Schema (or a compiled AJV function) into Form Intelligence. Same contract on client and server; drafts, rules, and submit sit on top.

## What you get

| Capability              | Detail                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| **Schema object**       | Pass a JSON Schema literal: `ajvAdapter({ type: "object", ... })`                             |
| **Compiled validator**  | Pass `ValidateFunction` / async compile for reuse and `$async` keywords                       |
| **Path mapping**        | `instancePath` + `required`/`additionalProperties` params → field paths; form-level → `_form` |
| **allErrors-friendly**  | Works with AJV configured for multiple field errors                                           |
| **Formats**             | Use `ajv-formats` on your Ajv instance for `email`, `uri`, etc.                               |
| **With core workflows** | Combine with `when()` rules, autosave, wizard, plugins, `validateOn`                          |

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

## Docs

https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/adapters

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
