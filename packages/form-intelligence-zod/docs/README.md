# Form Intelligence — Zod

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligence-zod.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligence-zod)

Bridge [Zod](https://zod.dev) schemas into [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence).

## The problem

Your API already speaks Zod, but the form keeps a **second copy** of the rules (`required`, `email()`, custom checks). Schemas drift; the UI rejects what the server accepts (or the opposite).

## The solution

`zodAdapter(schema)` plugs a Zod object into `createForm({ schema })`. One schema for types, parse, and field errors — while Form Intelligence still runs rules, drafts, wizards, and submit.

## What you get

| Capability              | Detail                                                                       |
| ----------------------- | ---------------------------------------------------------------------------- |
| **Drop-in schema**      | `schema: zodAdapter(z.object({ ... }))`                                      |
| **Path mapping**        | Zod issue paths → form paths (`address.city`); form-level → `_form`          |
| **Nested objects**      | Works with object / array-shaped issues                                      |
| **With core workflows** | Combine with `rules`, `workflow.autosave`, `validateOn`, `onSubmit`, plugins |
| **Typed values**        | Keep inferring types from your Zod schema in app code                        |

Does not replace Form Intelligence — it feeds the validation pipeline so you don’t re-encode constraints.

## Install

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-zod zod
```

## Usage

```ts
import { createForm, when } from "@jayoncode/form-intelligence";
import { zodAdapter } from "@jayoncode/form-intelligence-zod";
import { z } from "zod";

const checkoutSchema = z.object({
  plan: z.enum(["starter", "enterprise"]),
  email: z.string().email(),
  seatCount: z.number().int().positive().optional(),
});

const form = createForm({
  initialValues: { plan: "starter", email: "", seatCount: undefined },
  schema: zodAdapter(checkoutSchema),
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

## Docs

https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/adapters

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
