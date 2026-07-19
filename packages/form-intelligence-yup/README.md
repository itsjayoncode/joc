# Form Intelligence — Yup

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligence-yup.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligence-yup)

Bridge [Yup](https://github.com/jquense/yup) schemas into [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence).

## The problem

Legacy apps already validate with Yup across APIs and admin UIs. Rewriting those schemas into another validator is a migration tax; keeping two rulebooks means mismatched messages on the same fields.

## The solution

`yupAdapter(schema)` runs your existing Yup object through Form Intelligence. Keep trusted schemas; add drafts, `when()` rules, and submit workflows on top.

## What you get

| Capability              | Detail                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------- |
| **Drop-in schema**      | `schema: yupAdapter(yup.object({ ... }))`                                          |
| **Path mapping**        | Yup paths → form paths; `friends[0].name` → `friends.0.name`; form-level → `_form` |
| **Nested objects**      | Nested Yup shapes map to nested field errors                                       |
| **With core workflows** | Works with `rules`, `workflow`, `validateOn`, plugins, async submit                |
| **Gradual migration**   | Reuse Yup today; adopt Zod/Valibot later without rewriting the form shell          |

## Install

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-yup yup
```

## Usage

```ts
import { createForm, when } from "@jayoncode/form-intelligence";
import { yupAdapter } from "@jayoncode/form-intelligence-yup";
import * as yup from "yup";

const checkoutSchema = yup.object({
  plan: yup.string().oneOf(["starter", "enterprise"]).required(),
  email: yup.string().email().required(),
  seatCount: yup
    .number()
    .positive()
    .when("plan", {
      is: "enterprise",
      then: (s) => s.required(),
      otherwise: (s) => s.strip(),
    }),
});

const form = createForm({
  initialValues: { plan: "starter", email: "", seatCount: undefined },
  schema: yupAdapter(checkoutSchema),
  validateOn: "onBlur",
  rules: [when("plan").equals("enterprise").show("seatCount")],
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
