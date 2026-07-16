# Form Intelligent

Headless form workflow engine — validation, submission, state, and multi-step orchestration without UI coupling.

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

The instance owns values, per-field errors, touched/dirty flags, and submit lifecycle (`isSubmitting`, duplicate-submit guard). UI layers read state and call `bind()` handlers — the package does not render components.

[Run this flow in the playground →](/playground/form-intelligent/validation)

## Problem → approach

| Typical pain                                                                    | Form Intelligent                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Validation, touched state, and submit guards duplicated in every form component | One `createForm()` instance owns values, errors, dirty/touched, and submit lifecycle |
| `onSubmit` handlers mix fetch, error mapping, and UI flags                      | `onSubmit` is async-first; `isSubmitting` and duplicate-submit guard are built in    |
| Framework form libs own too much UI or too little workflow                      | Headless `bind()` + `form.state`; `subscribe()` only for manual UI                   |

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

## Documentation path

Work through the journey groups below. Each guide links to a playground route.

### Getting Started

| Guide                                                          | Topics                         | Playground                                 |
| -------------------------------------------------------------- | ------------------------------ | ------------------------------------------ |
| [Tutorial](/packages/form-intelligent/modules/getting-started) | `createForm`, `bind`, `submit` | [Dashboard](/playground/form-intelligent/) |

### Core Concepts

| Guide                                                           | Topics                              | Playground                                  |
| --------------------------------------------------------------- | ----------------------------------- | ------------------------------------------- |
| [Core concepts](/packages/form-intelligent/modules/concepts)    | Instance model, flags, architecture | [State](/playground/form-intelligent/state) |
| [Capabilities](/packages/form-intelligent/modules/capabilities) | Form OS feature map and status      | [Dashboard](/playground/form-intelligent/)  |

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

| Guide                                                     | Topics                   | Playground                                        |
| --------------------------------------------------------- | ------------------------ | ------------------------------------------------- |
| [Plugins](/packages/form-intelligent/modules/plugins)     | Lifecycle hooks          | [Plugins](/playground/form-intelligent/plugins)   |
| [Patterns](/packages/form-intelligent/modules/patterns)   | Wizard, offline, recipes | [Dashboard](/playground/form-intelligent/)        |
| [Migration](/packages/form-intelligent/modules/migration) | From DIY autosave        | [Workflow](/playground/form-intelligent/workflow) |

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
