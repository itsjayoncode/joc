# Form Intelligent

**A headless form workflow engine** — validate fields, submit safely, autosave drafts, and run wizards without locking into a UI framework.

::: info What is "headless"?
You bring the inputs (HTML, React, Vue, anything). Form Intelligent owns the **logic**: values, errors, submit flow, and workflows. No bundled `<Input>` components.
:::

## Start here — 5-minute picture

Most apps need the same four things:

```mermaid
flowchart LR
  A[Create form] --> B[Validate fields]
  B --> C[Submit safely]
  C --> D[Optional workflows]
  D --> E[Autosave / Wizard / Drafts]
```

| Step | What you get                 | Time               |
| ---- | ---------------------------- | ------------------ |
| 1    | A form instance with values  | ~2 min             |
| 2    | Errors when input is wrong   | ~5 min             |
| 3    | Async submit + loading state | ~5 min             |
| 4    | Autosave, drafts, or wizards | when you need them |

**New to the package?** Follow the [step-by-step tutorial](/packages/form-intelligent/modules/getting-started) — no prior knowledge required.

**Want the big picture first?** Read [core concepts](/packages/form-intelligent/modules/concepts) (3-minute read).

## Learning path

Work through these in order. Each guide links to a live playground demo.

### Beginner — your first working form

| #   | Guide                                                          | You will learn                               | Try it live                                            |
| --- | -------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| 1   | [Tutorial](/packages/form-intelligent/modules/getting-started) | Install, create a form, bind a field, submit | [Playground →](/playground/form-intelligent/)          |
| 2   | [Core concepts](/packages/form-intelligent/modules/concepts)   | Form instance, fields, state flags           | [State explorer →](/playground/form-intelligent/state) |

### Intermediate — production-ready forms

| #   | Guide                                                       | You will learn                       | Try it live                                             |
| --- | ----------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------- |
| 3   | [Validation](/packages/form-intelligent/modules/validation) | Built-in rules, timing, async checks | [Validation →](/playground/form-intelligent/validation) |
| 4   | [Submission](/packages/form-intelligent/modules/submission) | Loading, errors, double-submit guard | [Submission →](/playground/form-intelligent/submission) |

### Advanced — workflows & extension

| #   | Guide                                                       | You will learn                       | Try it live                                             |
| --- | ----------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------- |
| 5   | [Workflow](/packages/form-intelligent/modules/workflow)     | Autosave, drafts, multi-step wizards | [Workflow →](/playground/form-intelligent/workflow)     |
| 6   | [Formatters](/packages/form-intelligent/modules/formatters) | Phone, currency, slug formatting     | [Formatters →](/playground/form-intelligent/formatters) |
| 7   | [Plugins](/packages/form-intelligent/modules/plugins)       | Lifecycle hooks & cleanup            | [Plugins →](/playground/form-intelligent/plugins)       |
| 8   | [Adapters](/packages/form-intelligent/modules/adapters)     | React, Zod, and framework bridges    | [Adapters →](/playground/form-intelligent/adapters)     |

## Install

```bash
npm install @jayoncode/form-intelligent
```

Copy-paste starter:

```ts
import { createForm, email, required } from "@jayoncode/form-intelligent";

const form = createForm({
  initialValues: { email: "" },
  validators: { email: [required, email] },
  onSubmit: async (values) => console.log("submitted", values),
});

// Wire any input — see tutorial for details
form.field("email").bind();
await form.submit();
```

## Is this the right package for you?

| You need…                   | Form Intelligent helps                                                  |
| --------------------------- | ----------------------------------------------------------------------- |
| Debounced autosave          | `workflow.autosave` — no manual `useEffect`                             |
| Multi-step signup           | `workflow.wizard` with per-step validation                              |
| Safe async submit           | `isSubmitting` + duplicate-submit guard                                 |
| Plain HTML or any UI        | `field().bind()` — adapters optional                                    |
| Field registration like RHF | Use an **adapter** — Form Intelligent handles workflow, not field lists |

::: tip Not sure yet?
Open the [interactive playground](/playground/form-intelligent/) and click through Validation → Submission → Workflow. Each page explains what you are looking at.
:::

## Reference

- [API Reference](/packages/form-intelligent/api/) — generated TypeDoc
- [Playground guide](/packages/form-intelligent/playground/playground) — local setup & route map
- [Examples in playground](/playground/form-intelligent/examples) — copy-paste snippets
