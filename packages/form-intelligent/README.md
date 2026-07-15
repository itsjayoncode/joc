# @jayoncode/form-intelligent

**A headless form workflow engine.**

`@jayoncode/form-intelligent` orchestrates validation, submission, state, formatting, and multi-step workflows without rendering UI. Use it with native HTML or any framework.

## Install

```bash
npm install @jayoncode/form-intelligent
```

## Quick start

```ts
import { createForm, email, required } from "@jayoncode/form-intelligent";

const form = createForm({
  initialValues: { email: "" },
  validators: { email: [required, email] },
  onSubmit: async (values) => {
    console.log("submit", values);
  },
});

const field = form.field("email");
field.bind(); // { name, value, onChange, onBlur, onFocus }
await form.submit();
```

## Philosophy

- **Headless** — no UI components
- **Workflow-first** — autosave, drafts, wizards, retry
- **Framework-agnostic** — optional React/Vue adapters ship separately

## Docs

https://itsjayoncode.github.io/joc/packages/form-intelligent/

**Learning path:** Overview → [Tutorial](https://itsjayoncode.github.io/joc/packages/form-intelligent/modules/getting-started) → Validation → Submission → Workflow

## Playground

https://itsjayoncode.github.io/joc/playground/form-intelligent/
