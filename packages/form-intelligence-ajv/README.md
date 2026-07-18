# @jayoncode/form-intelligence-ajv

Bridge [AJV](https://ajv.js.org/) JSON Schema validation into the `@jayoncode/form-intelligence` pipeline.

## Install

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-ajv ajv
```

For `format` keywords (email, uri, etc.), add [ajv-formats](https://github.com/ajv-validator/ajv-formats) and pass a configured `Ajv` instance.

## Usage

```ts
import Ajv from "ajv";
import { createForm } from "@jayoncode/form-intelligence";
import { ajvAdapter } from "@jayoncode/form-intelligence-ajv";

const signupSchema = {
  type: "object",
  properties: {
    email: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 8 },
  },
  required: ["email", "password"],
  additionalProperties: false,
} as const;

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: ajvAdapter(signupSchema),
  async onSubmit(values) {
    await api.signup(values);
  },
});
```

Pass a pre-compiled `ValidateFunction` when you reuse AJV or use async keywords:

```ts
const ajv = new Ajv({ allErrors: true });
const validate = await ajv.compileAsync(schema);

createForm({
  schema: ajvAdapter(validate),
  onSubmit,
});
```

AJV `instancePath` values map to form field paths (`/address/city` → `address.city`). Form-level issues use `_form`.
