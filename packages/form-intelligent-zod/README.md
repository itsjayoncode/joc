# @jayoncode/form-intelligent-zod

Bridge [Zod](https://zod.dev) schemas into the `@jayoncode/form-intelligent` validation pipeline.

## Install

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligent-zod zod
```

## Usage

```ts
import { createForm } from "@jayoncode/form-intelligent";
import { zodAdapter } from "@jayoncode/form-intelligent-zod";
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
