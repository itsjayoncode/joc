# Form Intelligent

Headless form workflow engine — validation, submission, state, and multi-step orchestration without UI coupling.

## Example: validated signup with async submit

Typical integration: define values and validators, bind inputs, subscribe to state, submit when valid.

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

form.subscribe(() => {
  const { values, errors, isSubmitting, isValid } = form.getFormState();
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
| Framework form libs own too much UI or too little workflow                      | Headless `bind()` + `subscribe()` — any input implementation, shared orchestration   |

## Overview

`createForm()` returns a **form instance**: a single orchestration boundary for field state, validation timing, submission, and optional workflow (autosave, drafts, wizards).

| Layer      | Responsibility                                        |
| ---------- | ----------------------------------------------------- |
| Field API  | Path-based accessors, `bind()` for headless wiring    |
| Validation | Sync/async validators, per-field or form-level timing |
| Submission | `onSubmit`, in-flight guard, error surfacing          |
| Workflow   | Autosave debounce, draft persistence, wizard steps    |
| Extension  | Plugins and adapter interfaces for framework bridges  |

Form Intelligent complements field-registration libraries (React Hook Form, etc.): it focuses on **workflow orchestration**, not component libraries.

## Documentation path

Work through in order. Each guide links to a playground route for inspection.

### Foundation

| #   | Guide                                                          | Topics                                  | Playground                                  |
| --- | -------------------------------------------------------------- | --------------------------------------- | ------------------------------------------- |
| 1   | [Tutorial](/packages/form-intelligent/modules/getting-started) | Install, `createForm`, `bind`, `submit` | [Dashboard](/playground/form-intelligent/)  |
| 2   | [Core concepts](/packages/form-intelligent/modules/concepts)   | Instance model, flags, architecture     | [State](/playground/form-intelligent/state) |

### Core APIs

| #   | Guide                                                       | Topics                         | Playground                                            |
| --- | ----------------------------------------------------------- | ------------------------------ | ----------------------------------------------------- |
| 3   | [Validation](/packages/form-intelligent/modules/validation) | Built-in rules, timing, async  | [Validation](/playground/form-intelligent/validation) |
| 4   | [Submission](/packages/form-intelligent/modules/submission) | Loading state, retries, guards | [Submission](/playground/form-intelligent/submission) |

### Workflow and extension

| #   | Guide                                                       | Topics                   | Playground                                            |
| --- | ----------------------------------------------------------- | ------------------------ | ----------------------------------------------------- |
| 5   | [Workflow](/packages/form-intelligent/modules/workflow)     | Autosave, drafts, wizard | [Workflow](/playground/form-intelligent/workflow)     |
| 6   | [Formatters](/packages/form-intelligent/modules/formatters) | Parse/format pipelines   | [Formatters](/playground/form-intelligent/formatters) |
| 7   | [Plugins](/packages/form-intelligent/modules/plugins)       | Lifecycle hooks          | [Plugins](/playground/form-intelligent/plugins)       |
| 8   | [Adapters](/packages/form-intelligent/modules/adapters)     | Framework integration    | [Adapters](/playground/form-intelligent/adapters)     |

## Install

```bash
npm install @jayoncode/form-intelligent
```

## Package fit

| Requirement                               | Approach                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| Debounced autosave / draft restore        | `workflow.autosave`, `workflow.draft`                                      |
| Multi-step flows with per-step validation | `workflow.wizard`                                                          |
| Safe async submit with in-flight guard    | `submit()` + `isSubmitting`                                                |
| Framework-agnostic or custom UI           | `field().bind()`                                                           |
| Declarative field lists only              | Consider an adapter or a field-registration library alongside this package |

## Reference

- [API (TypeDoc)](/packages/form-intelligent/api/)
- [Playground guide](/packages/form-intelligent/playground/playground)
- [Examples](/playground/form-intelligent/examples)
