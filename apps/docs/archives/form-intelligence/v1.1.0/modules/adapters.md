---
title: Adapters
description: Form Intelligent documentation for Adapters.
---

# Adapters

Use Form Intelligent with your existing UI stack — native HTML, React, or headless bindings.

**Previous:** [Integrations](/packages/form-intelligence/modules/integrations) · **Next:** [Plugins](/packages/form-intelligence/modules/plugins)

::: tip Playground
[Adapters explorer →](/playground/form-intelligence/adapters) — current integrations and planned bridges.
:::

## Overview

Adapters connect `createForm()` to framework-specific lifecycle and field bindings. The core package (`@jayoncode/form-intelligent`) remains framework-agnostic; each adapter ships as its own npm package.

See [Ecosystem architecture](https://github.com/itsjayoncode/joc/blob/master/packages/form-intelligence/engineering/001-ecosystem-architecture.md) for the full package map.

---

## Native HTML (built-in)

No extra package. Use `target` / `form.ref` + `schema`:

```ts
createForm({
  target: "#register",
  schema: { email: "email", password: "password" },
  async onSubmit(values) {
    await api.register(values);
  },
});
```

```html
<form id="register">
  <input name="email" />
  <input name="password" type="password" />
  <button type="submit">Register</button>
</form>
```

---

## React — `@jayoncode/form-intelligence-react`

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligence-react
```

```tsx
import { useForm } from "@jayoncode/form-intelligence-react";

const form = useForm({
  schema: {
    email: "email",
    password: "password",
  },
  async onSubmit(values) {
    await api.login(values);
  },
});

return (
  <form {...form.form()}>
    <input {...form.field("email")} />
    <input {...form.field("password")} type="password" />
    <button {...form.submit()}>Login</button>
  </form>
);
```

`useForm` owns instance lifecycle (StrictMode-safe). The core engine owns validation, submit, and loading state. Read `form.state` in JSX — never `subscribe()` in application code.

Internally the adapter uses:

```ts
useSyncExternalStore(form.subscribe, () => form.state);
```

---

## Headless bindings (any framework)

```ts
const binding = form.field("email").bind();
// { name, value, onChange, onBlur, onFocus }
```

---

## Zod — `@jayoncode/form-intelligence-zod`

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligence-zod zod
```

```ts
import { createForm } from "@jayoncode/form-intelligent";
import { zodAdapter } from "@jayoncode/form-intelligence-zod";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: zodAdapter(signupSchema),
  onSubmit,
});
```

---

## Yup — `@jayoncode/form-intelligence-yup`

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligence-yup yup
```

```ts
import { createForm } from "@jayoncode/form-intelligent";
import { yupAdapter } from "@jayoncode/form-intelligence-yup";
import * as yup from "yup";

const signupSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: yupAdapter(signupSchema),
  onSubmit,
});
```

---

## Valibot — `@jayoncode/form-intelligence-valibot`

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligence-valibot valibot
```

```ts
import { createForm } from "@jayoncode/form-intelligent";
import { valibotAdapter } from "@jayoncode/form-intelligence-valibot";
import * as v from "valibot";

const signupSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: valibotAdapter(signupSchema),
  onSubmit,
});
```

---

## AJV — `@jayoncode/form-intelligence-ajv`

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligence-ajv ajv
```

```ts
import { createForm } from "@jayoncode/form-intelligent";
import { ajvAdapter } from "@jayoncode/form-intelligence-ajv";

const signupSchema = {
  type: "object",
  properties: {
    email: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 8 },
  },
  required: ["email", "password"],
} as const;

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: ajvAdapter(signupSchema),
  onSubmit,
});
```

Pass a pre-compiled `ValidateFunction` when reusing a configured `Ajv` instance or async keywords.

---

## Vue — `@jayoncode/form-intelligence-vue`

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligence-vue vue
```

```vue
<script setup lang="ts">
import { useForm } from "@jayoncode/form-intelligence-vue";

const form = useForm({
  schema: { email: "email", password: "password" },
  onSubmit,
});
</script>

<template>
  <form v-bind="form.form()">
    <input v-bind="form.field('email')" />
    <button v-bind="form.submit()">Login</button>
  </form>
</template>
```

Use `provideForm()` in a parent and `useField('path')` in children for deep trees.

---

## Angular — `@jayoncode/form-intelligence-angular`

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligence-angular
```

```typescript
import { Component } from "@angular/core";
import {
  FormIntelligentFieldDirective,
  FormIntelligentFormDirective,
  injectForm,
  provideFormIntelligent,
} from "@jayoncode/form-intelligence-angular";

@Component({
  standalone: true,
  imports: [FormIntelligentFormDirective, FormIntelligentFieldDirective],
  providers: [provideFormIntelligent({ schema: { email: "email" }, onSubmit })],
  template: `<form fiForm><input fiField="email" /><button type="submit">Login</button></form>`,
})
export class LoginComponent {
  readonly form = injectForm();
}
```

---

## Planned adapters

| Package                | What it adds                              |
| ---------------------- | ----------------------------------------- |
| RHF / TanStack bridges | Coexist with field registration libraries |

---

## Problem → approach

| Layer                           | Responsibility                                                  |
| ------------------------------- | --------------------------------------------------------------- |
| React Hook Form / TanStack Form | Field registration, controlled inputs                           |
| **Form Intelligent**            | Validation, submit lifecycle, DOM enhancement, autosave, wizard |
| Your components                 | Normal markup — `name` attributes or adapter spread props       |

---

## Schema adapter (advanced)

Bridge any validation library via `SchemaAdapter`:

```ts
import type { SchemaAdapter } from "@jayoncode/form-intelligent/adapters";

const adapter: SchemaAdapter = {
  name: "custom",
  validate: async (values) => {
    return {}; // { fieldPath: "error message" }
  },
};
```

Core also exports `PersistenceAdapter`, `FrameworkAdapter`, and `SubmitTransportAdapter` — see `@jayoncode/form-intelligent/adapters`.

**Next:** [Plugins](/packages/form-intelligence/modules/plugins) — lifecycle hooks · [Patterns](/packages/form-intelligence/modules/patterns)

**Done with the guides?** Browse the [API Reference](/packages/form-intelligence/api/) or explore [all playground routes](/playground/form-intelligence/).
