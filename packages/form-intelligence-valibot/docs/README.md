# Form Intelligence — Valibot

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligence-valibot.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligence-valibot)

Bridge [Valibot](https://valibot.dev) schemas into [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence).

## The problem

You chose Valibot for small, composable pipelines — but the form layer still wants its own validators. Hand-mapping Valibot issues to fields means custom mappers and brittle paths.

## The solution

`valibotAdapter(schema)` connects a Valibot object schema to Form Intelligence. Field errors, submit gating, and workflows share one source of truth. Paths use `getDotPath()`.

## What you get

| Capability              | Detail                                                               |
| ----------------------- | -------------------------------------------------------------------- |
| **Drop-in schema**      | `schema: valibotAdapter(v.object({ ... }))`                          |
| **Path mapping**        | Valibot issues → form paths via `getDotPath()`; form-level → `_form` |
| **Composable pipes**    | Keep `v.pipe(v.string(), v.email(), …)` as your rule language        |
| **With core workflows** | Combine with `when()` rules, autosave, drafts, `validateOn`, plugins |
| **Bundle-friendly**     | Use modular Valibot schemas without rewriting the form shell         |

## Install

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-valibot valibot
```

## Usage

```ts
import { createForm, when } from "@jayoncode/form-intelligence";
import { valibotAdapter } from "@jayoncode/form-intelligence-valibot";
import * as v from "valibot";

const checkoutSchema = v.object({
  plan: v.picklist(["starter", "enterprise"]),
  email: v.pipe(v.string(), v.email()),
  seatCount: v.optional(v.pipe(v.number(), v.minValue(1))),
});

const form = createForm({
  initialValues: { plan: "starter", email: "", seatCount: undefined },
  schema: valibotAdapter(checkoutSchema),
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
