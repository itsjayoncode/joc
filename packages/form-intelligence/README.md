# Form Intelligence — Typed, framework-agnostic headless form workflows for modern web apps.

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligence.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligence)
[![license](https://img.shields.io/npm/l/@jayoncode/form-intelligence.svg)](https://github.com/itsjayoncode/joc/blob/master/packages/form-intelligence/package.json)
[![docs](https://img.shields.io/badge/docs-jayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/packages/form-intelligence/)

Published as [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence) on npm.

> **Renamed:** `@jayoncode/form-intelligent` remains available as a compatibility re-export. Prefer `@jayoncode/form-intelligence` for new installs.

Stop rebuilding form workflows in every app. Orchestrate validation, submission, drafts, autosave, multi-step wizards, and conditional `when()` rules through one headless TypeScript API — without owning your UI. Use it with native HTML or React, Vue, Angular, Svelte, Next.js, and vanilla JavaScript.

## Install

```bash
npm install @jayoncode/form-intelligence
```

```bash
pnpm add @jayoncode/form-intelligence
```

## The problem it solves

Conditional fields, draft saving, and submit guards usually turn into scattered `useEffect` / change-handler glue:

```ts
// show company fields? require seats? autosave? disable submit?
// → 4 effects, 2 state flags, and a race on every keystroke
```

`@jayoncode/form-intelligence` makes those workflows declarative.

## Quick start — conditional fields without `useEffect`

```ts
import { createForm, when } from "@jayoncode/form-intelligence";

createForm({
  target: "#checkout",
  schema: {
    plan: { required: true },
    companyName: { minLength: 2 },
  },
  rules: [
    when("plan")
      .equals("enterprise")
      .show("seatCount", "companyName")
      .require("seatCount", "companyName"),
  ],
  workflow: {
    autosave: {
      enabled: true,
      debounceMs: 800,
      onSave: (values) => api.saveDraft(values),
    },
  },
  async onSubmit(values) {
    await api.checkout(values);
  },
});
```

```html
<form id="checkout">
  <select name="plan">
    <option value="starter">Starter</option>
    <option value="enterprise">Enterprise</option>
  </select>
  <input name="seatCount" type="number" />
  <input name="companyName" />
  <button type="submit">Continue</button>
</form>
```

## More problem → solution snippets

### Enhance existing markup in one call

```ts
import { createForm } from "@jayoncode/form-intelligence";

createForm({
  target: "#signup",
  schema: { email: "email", name: { required: true, minLength: 2 } },
  validateOn: "onBlur",
  async onSubmit(values) {
    await api.signup(values);
  },
});
```

### Headless bind for your own UI

```ts
import { createForm, email, required } from "@jayoncode/form-intelligence";

const form = createForm({
  initialValues: { email: "" },
  validators: { email: [required, email] },
  onSubmit: async (values) => api.save(values),
});

const emailField = form.field("email").bind();
// { name, value, onChange, onBlur, onFocus }
await form.submit();
```

### React adapter

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-react
```

```tsx
import { useForm } from "@jayoncode/form-intelligence-react";

const form = useForm({
  schema: { email: "email" },
  onSubmit: async (values) => api.save(values),
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
- **Rules without effects** — `when().equals().show().require()`
- **Framework-agnostic** — optional React/Vue adapters ship separately

## Docs

https://itsjayoncode.github.io/joc/packages/form-intelligence/

**Learning path:** Overview → [Tutorial](https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/getting-started) → Validation → Submission → State → Workflow → [Rules](https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/rules) → [Patterns](https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/patterns)

## Playground

https://itsjayoncode.github.io/joc/playground/form-intelligence/

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
