# @jayoncode/form-intelligence-yup

Bridge [Yup](https://github.com/jquense/yup) schemas into the `@jayoncode/form-intelligence` validation pipeline.

## Install

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-yup yup
```

## Usage

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { yupAdapter } from "@jayoncode/form-intelligence-yup";
import * as yup from "yup";

const signupSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: yupAdapter(signupSchema),
  async onSubmit(values) {
    await api.signup(values);
  },
});
```

Yup error paths map to form field paths (`address.city` for nested objects). Form-level issues use `_form`.
