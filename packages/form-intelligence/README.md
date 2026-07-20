# Form Intelligence — Typed, framework-agnostic headless form engine for modern web apps.

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligence.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligence)
[![license](https://img.shields.io/npm/l/@jayoncode/form-intelligence.svg)](https://github.com/itsjayoncode/joc/blob/master/packages/form-intelligence/package.json)
[![docs](https://img.shields.io/badge/docs-jayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/packages/form-intelligence/)

Published as [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence).

> **Renamed from `form-intelligent`:** use `@jayoncode/form-intelligence` only. Old shim packages are EOL and no longer published from this repo.

## The problem

A checkout or onboarding form starts simple. Then product asks for:

- show company fields only on Enterprise
- require seats when those fields appear
- autosave drafts while the user types
- block double-submit and retry offline
- keep wizard steps in sync with validation

Without a form engine, that becomes **scattered, repeating glue**:

```ts
// FieldA.tsx
useEffect(() => {
  setShowCompany(plan === "enterprise");
}, [plan]);

// FieldB.tsx — same rule, copied
useEffect(() => {
  if (plan === "enterprise" && !company) setError("Required");
}, [plan, company]);

// FormRoot.tsx — third copy, plus races
useEffect(() => {
  const t = setTimeout(() => api.saveDraft(values), 800);
  return () => clearTimeout(t);
}, [values]);

// SubmitButton.tsx — fourth place that must stay in sync
const disabled = submitting || (plan === "enterprise" && !seats);
```

Every feature adds another effect, flag, or handler. Rules drift between screens. Autosave races submit. New teammates can’t tell which file owns “truth.”

## The solution

`@jayoncode/form-intelligence` is a **headless form workflow engine**. You declare validation, rules, drafts, wizards, and submit once. The engine owns timing and state. You keep full control of UI — native HTML or any framework.

```ts
import { createForm, when } from "@jayoncode/form-intelligence";

createForm({
  target: "#checkout",
  schema: {
    plan: { required: true },
    companyName: { minLength: 2 },
    seatCount: { required: true },
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
  // Same store as form.subscribe() — fires once after create, then on every notify
  subscribe: (form) => {
    syncCheckoutChrome(form.state); // draft badge, plan label, …
  },
  async onSubmit(values) {
    await api.checkout(values);
  },
});
```

One place for the business rules. No copy-pasted effects for show/require/autosave.

## What you get (capabilities)

| Area             | What you can do                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **State**        | Single `form.state` for values, errors, dirty/touched, submitting; `subscribe` / config `subscribe`                                      |
| **Validation**   | Schema shortcuts (`email`, `required`, …), custom + **async** validators, modes `onChange` / `onBlur` / `onSubmit` / `onTouched` / `all`; **HTML constraints** on DOM-backed forms (`required`, `minlength`, …) |
| **Rules**        | `when().equals().show().require().populate()` — conditional UI and requirements without effects                                          |
| **Calculations** | Derived fields from other values                                                                                                         |
| **Formatters**   | Display vs stored value (`phone`, `currency`, `slug`, custom pipelines via `/format`)                                                    |
| **Workflow**     | Autosave, drafts (local/custom storage), multi-step **wizard**                                                                           |
| **Submission**   | Loading phases, cancel, retries, offline queue hooks                                                                                     |
| **Plugins**      | Lifecycle hooks + browser lifecycle / keyboard integrations                                                                              |
| **DevTools**     | Inspector, event log, export/import state (`/devtools`)                                                                                  |
| **A11y**         | Field `aria` helpers and error wiring (`/accessibility`)                                                                                 |
| **Adapters**     | Optional React / Vue / Angular + Zod / Yup / Valibot / AJV packages                                                                      |

### Options you’ll use often

```ts
createForm({
  target: "#form",                 // or omit + form.ref / field().bind()
  initialValues: { ... },
  schema: { email: "email" },      // or validators: { email: [required, email] }
  validateOn: "onBlur",            // form-wide; override per field
  rules: [when("plan").equals("enterprise").show("seats")],
  workflow: {
    autosave: { enabled: true, debounceMs: 800, onSave },
    draft: { enabled: true, storage: "local", key: "checkout" },
    wizard: { steps: ["account", "billing", "review"] },
  },
  subscribe: (form) => syncUi(form.state),
  plugins: [/* browser lifecycle, keyboard, … */],
  async onSubmit(values) { ... },
});
```

Entry points: main barrel, plus `/validation`, `/format`, `/rules`, `/workflow`, `/submission`, `/plugins`, `/devtools`, `/draft`, `/wizard`, and more.

## Install

```bash
npm install @jayoncode/form-intelligence
```

```bash
pnpm add @jayoncode/form-intelligence
```

## Quick start

### Enhance existing markup

Constraint attributes on the DOM become validators on attach (schema optional):

```ts
import { createForm } from "@jayoncode/form-intelligence";

createForm({
  target: "#signup",
  // schema / validators optional — HTML required / type="email" / minlength also work
  schema: { email: "email", name: { required: true, minLength: 2 } },
  validateOn: "onBlur",
  async onSubmit(values) {
    await api.signup(values);
  },
});
```

Docs: [Adapters → Native HTML](https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/adapters) · Playground: [HTML constraints](https://itsjayoncode.github.io/joc/playground/form-intelligence/html-constraints)

### Headless bind (any UI)

```ts
import { createForm, email, required } from "@jayoncode/form-intelligence";

const form = createForm({
  initialValues: { email: "" },
  validators: { email: [required, email] },
  onSubmit: async (values) => api.save(values),
});

const emailField = form.field("email").bind();
// { name, value, onChange, onBlur, onFocus }
```

### React

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

- **Headless** — no UI kit to fight
- **Workflow-first** — autosave, drafts, wizards, retry live in the engine
- **Rules without effects** — `when().equals().show().require()`
- **Framework-agnostic** — React / Vue / Angular adapters are optional packages

## Docs & playground

- Docs: https://itsjayoncode.github.io/joc/packages/form-intelligence/
- Capabilities map: https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/capabilities
- Playground: https://itsjayoncode.github.io/joc/playground/form-intelligence/

**Learning path:** Overview → [Tutorial](https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/getting-started) → Validation → Submission → Workflow → [Rules](https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/rules)

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
