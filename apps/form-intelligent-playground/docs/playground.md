# Form Intelligent Playground

Learn the API by **doing** — every page has a live demo, plain-language explanations, and an inspector panel.

[Open playground →](/playground/form-intelligent/)

## Match docs to playground

Follow the [learning path](/packages/form-intelligent/) in docs, then try each topic live:

| Docs guide                                                     | Playground route                                       | What to try                   |
| -------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------- |
| [Tutorial](/packages/form-intelligent/modules/getting-started) | [/](/playground/form-intelligent/)                     | Dashboard + quick validate    |
| [Concepts](/packages/form-intelligent/modules/concepts)        | [/state](/playground/form-intelligent/state)           | Edit fields, watch JSON state |
| [Validation](/packages/form-intelligent/modules/validation)    | [/validation](/playground/form-intelligent/validation) | Toggle timing, async username |
| [Submission](/packages/form-intelligent/modules/submission)    | [/submission](/playground/form-intelligent/submission) | Flaky API, double-submit      |
| [Workflow](/packages/form-intelligent/modules/workflow)        | [/workflow](/playground/form-intelligent/workflow)     | Reload page → draft restored  |
| [Formatters](/packages/form-intelligent/modules/formatters)    | [/formatters](/playground/form-intelligent/formatters) | Phone, currency, slug         |
| [Plugins](/packages/form-intelligent/modules/plugins)          | [/plugins](/playground/form-intelligent/plugins)       | Event log                     |
| [Adapters](/packages/form-intelligent/modules/adapters)        | [/adapters](/playground/form-intelligent/adapters)     | Integration map               |

## How each page works

1. **Read** the explanation panel at the top
2. **Interact** with the demo (inputs, buttons, toggles)
3. **Inspect** field meta, JSON state, or event logs on the side

## Run locally

```bash
pnpm form-intelligent-playground:dev
```

Open [http://127.0.0.1:4277](http://127.0.0.1:4277).

## All routes

| Route         | Focus                    |
| ------------- | ------------------------ |
| `/`           | Dashboard & quick links  |
| `/validation` | Validators & timing      |
| `/submission` | Submit flow & guards     |
| `/workflow`   | Autosave, drafts, wizard |
| `/state`      | State explorer & diffs   |
| `/formatters` | Input formatting         |
| `/plugins`    | Plugin hooks             |
| `/adapters`   | Framework integrations   |
| `/examples`   | Copy-paste snippets      |

[Back to package overview →](/packages/form-intelligent/)
