# @jayoncode/form-intelligent-valibot

Bridge [Valibot](https://valibot.dev) schemas into the `@jayoncode/form-intelligent` validation pipeline.

## Install

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligent-valibot valibot
```

## Usage

```ts
import { createForm } from "@jayoncode/form-intelligent";
import { valibotAdapter } from "@jayoncode/form-intelligent-valibot";
import * as v from "valibot";

const signupSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: valibotAdapter(signupSchema),
  async onSubmit(values) {
    await api.signup(values);
  },
});
```

Valibot issue paths map to form field paths via `getDotPath()`. Form-level issues use `_form`.
