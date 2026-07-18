# @jayoncode/form-intelligence-zod

Bridge [Zod](https://zod.dev) schemas into the `@jayoncode/form-intelligence` validation pipeline.

## Install

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-zod zod
```

## Usage

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { zodAdapter } from "@jayoncode/form-intelligence-zod";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: zodAdapter(signupSchema),
  async onSubmit(values) {
    await api.signup(values);
  },
});
```

Zod issue paths map to form field paths (`address.city` for nested objects). Form-level issues use `_form`.
