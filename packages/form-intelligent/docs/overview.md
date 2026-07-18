# Package overview

Headless form workflow engine — validation, submission, state, and multi-step orchestration without UI coupling.

## The problem

Real products do not ship “email + password” forever. They ship checkouts, applications, and onboarding flows where:

| What breaks in DIY forms                         | What users feel                          |
| ------------------------------------------------ | ---------------------------------------- |
| Conditional fields via `useEffect` / change glue | Wrong fields shown; submit still enabled |
| Autosave + draft restore hand-rolled             | Refresh kills a 10-minute form           |
| `isSubmitting` / double-click races              | Duplicate charges or blank error states  |
| Wizard step validation scattered                 | Users skip steps or get stuck            |

Form Intelligent makes those workflows **declarative** on one `createForm()` instance — keep your markup or bind into any UI.

## When to use

- Multi-field forms with validation, async submit, and submit guards
- Conditional fields (`when()`), drafts/autosave, wizards, or offline queue
- Headless or multi-framework UI (native HTML, React, Vue, …)

## When not to use

- A single uncontrolled input with no validation workflow
- You only need a UI component library (pick a design system; pair this for orchestration)
- You need a full CMS / form builder product — this is an **engine**, not a builder UI

## Features

- Sync + async validation (including multiple async checks per field)
- Declarative `when()` rules (show / require / populate / gate submit)
- Autosave, draft restore, wizard steps, offline submit queue
- Headless `bind()` + optional framework/schema adapters
- Plugins, middleware, DevTools (opt-in subpaths)

## Install

```bash
npm install @jayoncode/form-intelligent
```

```bash
pnpm add @jayoncode/form-intelligent
```

```bash
yarn add @jayoncode/form-intelligent
```

React apps also need the adapter:

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligent-react
```

## Best example: SaaS checkout (rules + draft + submit)

Enterprise plan reveals seats and company, drafts survive refresh, submit is async-safe — no effect spaghetti:

```ts
import { createForm, when } from "@jayoncode/form-intelligent";

createForm({
  target: "#checkout",
  schema: {
    plan: { required: true },
    seatCount: { required: true },
    companyName: { minLength: 2 },
    email: "email",
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
    draft: {
      enabled: true,
      storageKey: "checkout:draft",
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
  <input name="email" type="email" />
  <button type="submit">Continue</button>
</form>
```

[Try rules in the playground →](/playground/form-intelligent/rules) · [Workflow / drafts →](/playground/form-intelligent/workflow)

## Example: native HTML signup

Enhance existing markup — no React, no manual `onChange`:

```ts
import { createForm } from "@jayoncode/form-intelligent";

createForm({
  target: "#signup",
  schema: { email: "email", name: { required: true, minLength: 2 } },
  validateOn: "onBlur",
  async onSubmit(values) {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Signup failed");
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

[Try in the playground →](/playground/form-intelligent/validation)

## Example: headless signup with async submit

Programmatic wiring when you own the input layer:

```ts
import { createForm, email, required } from "@jayoncode/form-intelligent";

const form = createForm({
  initialValues: { email: "", name: "" },
  validators: {
    email: [required, email],
    name: [required],
  },
  validateOn: "onBlur",
  onSubmit: async (values) => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Signup failed");
  },
});

// Headless binding — pass to any input implementation
const emailField = form.field("email").bind();

// Imperative read — no subscription needed
console.log(form.state.values, form.isValid());

// Vanilla JS manual render — subscribe only when you own the UI layer
form.subscribe(() => {
  const { values, errors, isSubmitting, isValid } = form.state;
  renderForm({ values, errors, isSubmitting, canSubmit: isValid && !isSubmitting });
});

await form.submit();
```

You can also pass `subscribe` on `createForm` (one listener or an array) — same store, fires once after create, then on every notify, until `destroy()`.

The instance owns values, per-field errors, touched/dirty flags, and submit lifecycle (`isSubmitting`, duplicate-submit guard). UI layers read state and call `bind()` handlers — the package does not render components.

[Run this flow in the playground →](/playground/form-intelligent/validation)

## Example: multiple async checks on one field

Username signup often needs more than one server round-trip. Stack sync rules, then several `asyncValidator`s — they run in order; the first error stops the chain:

```ts
import { createForm, required, minLength, asyncValidator } from "@jayoncode/form-intelligent";

createForm({
  initialValues: { username: "" },
  validateOn: "onBlur",
  validators: {
    username: [
      required,
      minLength(3),
      asyncValidator({
        debounce: 300,
        validate: async (value, { signal }) => {
          const res = await fetch(`/api/usernames/reserved?u=${value}`, { signal });
          return (await res.json()).reserved ? "Reserved username." : true;
        },
      }),
      asyncValidator({
        debounce: 400,
        preventDuplicates: true,
        validate: async (value, { signal }) => {
          const res = await fetch(`/api/usernames/available?u=${value}`, { signal });
          return (await res.json()).available ? true : "Already taken.";
        },
      }),
      asyncValidator({
        debounce: 500,
        validate: async (value, { signal }) => {
          const res = await fetch("/api/usernames/moderate", {
            method: "POST",
            body: JSON.stringify({ username: value }),
            signal,
          });
          return (await res.json()).ok ? true : "Choose another username.";
        },
      }),
    ],
  },
});
```

[Full async options →](/packages/form-intelligent/modules/validation#multiple-async-validators-on-one-field) · [Playground →](/playground/form-intelligent/validation)

## Problem → approach

| Typical pain                                                                    | Form Intelligent                                                                                 |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Validation, touched state, and submit guards duplicated in every form component | One `createForm()` instance owns values, errors, dirty/touched, and submit lifecycle             |
| Conditional fields and require rules via `useEffect`                            | `when().equals().show().require()` — declarative, testable                                       |
| Draft/autosave races and lost input on refresh                                  | Built-in autosave debounce + draft storage                                                       |
| `onSubmit` handlers mix fetch, error mapping, and UI flags                      | `onSubmit` is async-first; `isSubmitting` and duplicate-submit guard are built in                |
| Framework form libs own too much UI or too little workflow                      | Headless `bind()` + `form.state`; `subscribe()` / `createForm({ subscribe })` only for manual UI |

## Overview

`createForm()` returns a **form instance**: a single orchestration boundary for field state, validation timing, submission, and optional workflow (autosave, drafts, wizards).

| Layer      | Responsibility                                        |
| ---------- | ----------------------------------------------------- |
| Field API  | Path-based accessors, `bind()` for headless wiring    |
| Validation | Sync/async validators, per-field or form-level timing |
| Submission | `onSubmit`, cancel, retry, offline queue              |
| State      | Snapshots, field meta, undo/redo, diffs               |
| Rules      | `when()` show/hide/require/populate/disableSubmit     |
| Workflow   | Autosave debounce, draft persistence, wizard steps    |
| Extension  | Plugins and adapter interfaces for framework bridges  |

Form Intelligent complements field-registration libraries (React Hook Form, etc.): it focuses on **workflow orchestration**, not component libraries.

## Entrypoints

Optional engines use tree-shakeable subpaths. Formatters and DevTools are **not** on the main entry.

See the full map: [Entrypoints & subpaths](/packages/form-intelligent/modules/entrypoints).

| Goal                     | Prefer                                 |
| ------------------------ | -------------------------------------- |
| Create a form            | `@jayoncode/form-intelligent`          |
| Mask phone / slug / card | `@jayoncode/form-intelligent/format`   |
| Enable DevTools          | `@jayoncode/form-intelligent/devtools` |
| Browser session plugin   | `@jayoncode/form-intelligent/plugins`  |

## Documentation path

Work through the journey groups below. Each guide links to a playground route.

### Getting Started

| Guide                                                          | Topics                         | Playground                               |
| -------------------------------------------------------------- | ------------------------------ | ---------------------------------------- |
| [Tutorial](/packages/form-intelligent/modules/getting-started) | `createForm`, `bind`, `submit` | [Sandbox](/playground/form-intelligent/) |

### Core Concepts

| Guide                                                           | Topics                              | Playground                                  |
| --------------------------------------------------------------- | ----------------------------------- | ------------------------------------------- |
| [Core concepts](/packages/form-intelligent/modules/concepts)    | Instance model, flags, architecture | [State](/playground/form-intelligent/state) |
| [Capabilities](/packages/form-intelligent/modules/capabilities) | Form OS feature map and status      | [Sandbox](/playground/form-intelligent/)    |
| [Entrypoints](/packages/form-intelligent/modules/entrypoints)   | Main vs `/format`, `/devtools`, …   | [Sandbox](/playground/form-intelligent/)    |

### Guides

| Guide                                                           | Topics                            | Playground                                                |
| --------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------- |
| [Validation](/packages/form-intelligent/modules/validation)     | Built-in rules, schema, async     | [Validation](/playground/form-intelligent/validation)     |
| [Submission](/packages/form-intelligent/modules/submission)     | Loading, cancel, retries, offline | [Submission](/playground/form-intelligent/submission)     |
| [State](/packages/form-intelligent/modules/state)               | Snapshots, meta, undo/redo, diffs | [State](/playground/form-intelligent/state)               |
| [Workflow](/packages/form-intelligent/modules/workflow)         | Autosave, drafts, wizard          | [Workflow](/playground/form-intelligent/workflow)         |
| [Rules](/packages/form-intelligent/modules/rules)               | `when()` show/require/populate    | [Rules](/playground/form-intelligent/rules)               |
| [Calculations](/packages/form-intelligent/modules/calculations) | Derived fields                    | [Calculations](/playground/form-intelligent/calculations) |
| [Formatters](/packages/form-intelligent/modules/formatters)     | Parse/format pipelines            | [Formatters](/playground/form-intelligent/formatters)     |

### Integrations

| Guide                                                           | Topics                       | Playground                                                |
| --------------------------------------------------------------- | ---------------------------- | --------------------------------------------------------- |
| [Integrations](/packages/form-intelligent/modules/integrations) | Session, keyboard, analytics | [Integrations](/playground/form-intelligent/integrations) |
| [Adapters](/packages/form-intelligent/modules/adapters)         | Framework + schema bridges   | [Adapters](/playground/form-intelligent/adapters)         |

### Advanced and Support

| Guide                                                         | Topics                        | Playground                                              |
| ------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------- |
| [Plugins](/packages/form-intelligent/modules/plugins)         | Lifecycle hooks + middleware  | [Plugins](/playground/form-intelligent/plugins)         |
| [Performance](/packages/form-intelligent/modules/performance) | Bundle + timing budgets       | [Performance](/playground/form-intelligent/performance) |
| [Patterns](/packages/form-intelligent/modules/patterns)       | Wizard, offline, recipes      | [Sandbox](/playground/form-intelligent/)                |
| [Migration](/packages/form-intelligent/modules/migration)     | DIY autosave + breaking notes | [Workflow](/playground/form-intelligent/workflow)       |

## Package fit

| Requirement                               | Approach                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------ |
| Debounced autosave / draft restore        | `workflow.autosave`, `workflow.draft`                                                |
| Multi-step flows with per-step validation | `workflow.wizard`                                                                    |
| Conditional show / require / populate     | `when()` rules — [Rules](/packages/form-intelligent/modules/rules)                   |
| Derived totals                            | `form.calculate()` — [Calculations](/packages/form-intelligent/modules/calculations) |
| Safe async submit with cancel / retry     | `submit()` + `cancelSubmit()` + `retry`                                              |
| Offline submit queue                      | `workflow.offlineQueue`                                                              |
| Framework-agnostic or custom UI           | `field().bind()`                                                                     |
| Declarative field lists only              | Consider an adapter or a field-registration library alongside this package           |

## Reference

- [API (TypeDoc)](/packages/form-intelligent/api/)
- [Playground guide](/packages/form-intelligent/playground/playground)
- [Examples](/playground/form-intelligent/examples)
