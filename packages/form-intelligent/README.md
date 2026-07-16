# Form Intelligent

A headless form workflow engine for validation, submission, state, and multi-step orchestration.

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligent.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligent)
[![license](https://img.shields.io/npm/l/@jayoncode/form-intelligent.svg)](https://github.com/itsjayoncode/joc/blob/master/packages/form-intelligent/package.json)
[![docs](https://img.shields.io/badge/docs-jayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/packages/form-intelligent/)

Published as [`@jayoncode/form-intelligent`](https://www.npmjs.com/package/@jayoncode/form-intelligent) on npm.

`@jayoncode/form-intelligent` orchestrates validation, submission, state, formatting, and multi-step workflows without rendering UI. Use it with native HTML or any framework.

## Install

```bash
npm install @jayoncode/form-intelligent
```

## Quick start

### Native HTML

Enhance existing markup — no manual change handlers:

```ts
import { createForm } from "@jayoncode/form-intelligent";

createForm({
  target: "#signup",
  schema: { email: "email", name: { required: true, minLength: 2 } },
  async onSubmit(values) {
    await api.signup(values);
  },
});
```

```html
<form id="signup">
  <input name="email" />
  <input name="name" />
  <button type="submit">Sign up</button>
</form>
```

### Headless / programmatic

```ts
import { createForm, email, required } from "@jayoncode/form-intelligent";

const form = createForm({
  initialValues: { email: "" },
  validators: { email: [required, email] },
  onSubmit: async (values) => {
    console.log("submit", values);
  },
});

form.field("email").bind(); // { name, value, onChange, onBlur, onFocus }
await form.submit();
```

### React

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligent-react
```

```tsx
import { useForm } from "@jayoncode/form-intelligent-react";

const form = useForm({
  schema: { email: "email" },
  onSubmit: async (values) => console.log(values),
});

return (
  <form {...form.form()}>
    <input {...form.field("email")} />
    <button {...form.submit()}>Submit</button>
  </form>
);
```

## Philosophy

- **Headless** — no UI components
- **Workflow-first** — autosave, drafts, wizards, retry
- **Framework-agnostic** — optional React/Vue adapters ship separately

## Docs

https://itsjayoncode.github.io/joc/packages/form-intelligent/

**Learning path:** Overview → [Tutorial](https://itsjayoncode.github.io/joc/packages/form-intelligent/modules/getting-started) → Validation → Submission → State → Workflow → [Rules](https://itsjayoncode.github.io/joc/packages/form-intelligent/modules/rules) → [Calculations](https://itsjayoncode.github.io/joc/packages/form-intelligent/modules/calculations) → [Migration](https://itsjayoncode.github.io/joc/packages/form-intelligent/modules/migration) → [Patterns](https://itsjayoncode.github.io/joc/packages/form-intelligent/modules/patterns)

## Playground

https://itsjayoncode.github.io/joc/playground/form-intelligent/
