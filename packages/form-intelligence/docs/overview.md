# Package overview

**Declare the workflow. Keep the markup. Submit with confidence.**

Headless form workflow engine — validation, `when()` rules, drafts, wizards, and safe submit without UI coupling.

## The problem

Real products do not ship “email + password” forever. They ship checkouts, applications, and onboarding flows where:

| What breaks in DIY forms                         | What users feel                          |
| ------------------------------------------------ | ---------------------------------------- |
| Conditional fields via `useEffect` / change glue | Wrong fields shown; submit still enabled |
| Autosave + draft restore hand-rolled             | Refresh kills a 10-minute form           |
| `isSubmitting` / double-click races              | Duplicate charges or blank error states  |
| Wizard step validation scattered                 | Users skip steps or get stuck            |

Form Intelligence makes those workflows **declarative** on one `createForm()` instance — keep your markup or bind into any UI.

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
- **HTML constraints** on DOM-backed forms (`required`, `minlength`, `type="email"`, … → validators on attach)
- Declarative `when()` rules (show / require / populate / gate submit)
- Autosave, draft restore, wizard steps, offline submit queue
- Headless `bind()` + optional framework/schema adapters
- Plugins, middleware, DevTools (opt-in subpaths)

## Install

```bash
npm install @jayoncode/form-intelligence
```

```bash
pnpm add @jayoncode/form-intelligence
```

```bash
yarn add @jayoncode/form-intelligence
```

React apps also need the adapter:

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-react
```

## Best example: SaaS checkout (rules + draft + submit)

Enterprise plan reveals seats and company, drafts survive refresh, submit is async-safe — no effect spaghetti:

```ts
import { createForm, when } from "@jayoncode/form-intelligence";

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
  // Same store as form.subscribe() — fires once after create, then on every notify
  subscribe: (form) => {
    syncCheckoutChrome(form.state); // draft badge, plan label, …
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

[Try rules in the playground →](/playground/form-intelligence/rules) · [Workflow / drafts →](/playground/form-intelligence/workflow)

## Example: native HTML signup

Enhance existing markup — no React, no manual `onChange`:

```ts
import { createForm } from "@jayoncode/form-intelligence";

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

[Try in the playground →](/playground/form-intelligence/validation)

## Example: headless signup with async submit

Programmatic wiring when you own the input layer:

```ts
import { createForm, email, required } from "@jayoncode/form-intelligence";

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

[Run this flow in the playground →](/playground/form-intelligence/validation)

## Example: multiple async checks on one field

Username signup often needs more than one server round-trip. Stack sync rules, then several `asyncValidator`s — they run in order; the first error stops the chain:

```ts
import { createForm, required, minLength, asyncValidator } from "@jayoncode/form-intelligence";

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

[Full async options →](/packages/form-intelligence/modules/validation#multiple-async-validators-on-one-field) · [Playground →](/playground/form-intelligence/validation)

## Problem → approach

| Typical pain                                                                    | Form Intelligence                                                                                |
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

Form Intelligence complements field-registration libraries (React Hook Form, etc.): it focuses on **workflow orchestration**, not component libraries.

## Entrypoints

Optional engines use tree-shakeable subpaths. Formatters and DevTools are **not** on the main entry.

See the full map: [Entrypoints & subpaths](/packages/form-intelligence/modules/entrypoints).

| Goal                     | Prefer                                  |
| ------------------------ | --------------------------------------- |
| Create a form            | `@jayoncode/form-intelligence`          |
| Mask phone / slug / card | `@jayoncode/form-intelligence/format`   |
| Enable DevTools          | `@jayoncode/form-intelligence/devtools` |
| Browser session plugin   | `@jayoncode/form-intelligence/plugins`  |

## Documentation path

Work through the journey groups below. Each guide links to a playground route.

### Getting Started

| Guide                                                           | Topics                         | Playground                                |
| --------------------------------------------------------------- | ------------------------------ | ----------------------------------------- |
| [Tutorial](/packages/form-intelligence/modules/getting-started) | `createForm`, `bind`, `submit` | [Sandbox](/playground/form-intelligence/) |

### Core Concepts

| Guide                                                              | Topics                                      | Playground                                   |
| ------------------------------------------------------------------ | ------------------------------------------- | -------------------------------------------- |
| [Core concepts](/packages/form-intelligence/modules/concepts)      | Instance model, flags, architecture         | [State](/playground/form-intelligence/state) |
| [Capabilities](/packages/form-intelligence/modules/capabilities)   | Feature map and status                      | [Sandbox](/playground/form-intelligence/)    |
| [Entrypoints](/packages/form-intelligence/modules/entrypoints)     | Main vs `/format`, `/devtools`, `/ui`, …    | [Sandbox](/playground/form-intelligence/)    |
| [UI projection](/packages/form-intelligence/modules/ui-projection) | `showError`, `canSubmit`, `status`, explain | [UI lab](/playground/form-intelligence/ui)   |

### Guides

| Guide                                                            | Topics                                              | Playground                                                                                                      |
| ---------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [Validation](/packages/form-intelligence/modules/validation)     | Built-in rules, schema, async, **HTML constraints** | [Validation](/playground/form-intelligence/validation) · [HTML](/playground/form-intelligence/html-constraints) |
| [Submission](/packages/form-intelligence/modules/submission)     | Loading, cancel, retries, offline                   | [Submission](/playground/form-intelligence/submission)                                                          |
| [State](/packages/form-intelligence/modules/state)               | Snapshots, meta, undo/redo, diffs                   | [State](/playground/form-intelligence/state)                                                                    |
| [Workflow](/packages/form-intelligence/modules/workflow)         | Autosave, drafts, wizard                            | [Workflow](/playground/form-intelligence/workflow)                                                              |
| [Rules](/packages/form-intelligence/modules/rules)               | `when()` show/require/populate                      | [Rules](/playground/form-intelligence/rules)                                                                    |
| [Calculations](/packages/form-intelligence/modules/calculations) | Derived fields                                      | [Calculations](/playground/form-intelligence/calculations)                                                      |
| [Formatters](/packages/form-intelligence/modules/formatters)     | Parse/format pipelines                              | [Formatters](/playground/form-intelligence/formatters)                                                          |

### Integrations

| Guide                                                            | Topics                                      | Playground                                                                                                  |
| ---------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [Integrations](/packages/form-intelligence/modules/integrations) | Session, keyboard, analytics                | [Integrations](/playground/form-intelligence/integrations)                                                  |
| [Adapters](/packages/form-intelligence/modules/adapters)         | Framework + schema bridges, DOM-backed HTML | [Adapters](/playground/form-intelligence/adapters) · [HTML](/playground/form-intelligence/html-constraints) |

### Advanced and Support

| Guide                                                          | Topics                                   | Playground                                               |
| -------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------- |
| [Plugins](/packages/form-intelligence/modules/plugins)         | Hooks, middleware, **author guide**      | [Plugins](/playground/form-intelligence/plugins)         |
| [Performance](/packages/form-intelligence/modules/performance) | Bundle + timing budgets                  | [Performance](/playground/form-intelligence/performance) |
| [Patterns](/packages/form-intelligence/modules/patterns)       | Wizard, offline, **composition recipes** | [Sandbox](/playground/form-intelligence/)                |
| [Migration](/packages/form-intelligence/modules/migration)     | DIY autosave + breaking notes            | [Workflow](/playground/form-intelligence/workflow)       |

## Package fit

| Requirement                               | Approach                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| Debounced autosave / draft restore        | `workflow.autosave`, `workflow.draft`                                                 |
| Multi-step flows with per-step validation | `workflow.wizard`                                                                     |
| Conditional show / require / populate     | `when()` rules — [Rules](/packages/form-intelligence/modules/rules)                   |
| Derived totals                            | `form.calculate()` — [Calculations](/packages/form-intelligence/modules/calculations) |
| Safe async submit with cancel / retry     | `submit()` + `cancelSubmit()` + `retry`                                               |
| Offline submit queue                      | `workflow.offlineQueue`                                                               |
| Framework-agnostic or custom UI           | `field().bind()`                                                                      |
| Declarative field lists only              | Consider an adapter or a field-registration library alongside this package            |

## Reference

- [API (TypeDoc)](/packages/form-intelligence/api/)
- [Playground guide](/packages/form-intelligence/playground/playground)
- [Examples](/playground/form-intelligence/examples)
