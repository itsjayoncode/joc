---
title: Playground
description: Form Intelligent playground documentation for Playground.
playground: /playground/form-intelligent/
---

# Form Intelligent Playground

Learn the API by **doing** — every page has a live demo, plain-language explanations, and an inspector panel.

[Open playground →](/playground/form-intelligent/)

## Match docs to playground

Follow the [learning path](/packages/form-intelligent/) in docs, then try each topic live:

| Docs guide                                                      | Playground route                                           | What to try                   |
| --------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------- |
| [Tutorial](/packages/form-intelligent/modules/getting-started)  | [/](/playground/form-intelligent/)                         | Dashboard + quick validate    |
| [Concepts](/packages/form-intelligent/modules/concepts)         | [/state](/playground/form-intelligent/state)               | Edit fields, watch JSON state |
| [Validation](/packages/form-intelligent/modules/validation)     | [/validation](/playground/form-intelligent/validation)     | Toggle timing, async username |
| [Submission](/packages/form-intelligent/modules/submission)     | [/submission](/playground/form-intelligent/submission)     | Flaky API, double-submit      |
| [Workflow](/packages/form-intelligent/modules/workflow)         | [/workflow](/playground/form-intelligent/workflow)         | Reload page → draft restored  |
| [Formatters](/packages/form-intelligent/modules/formatters)     | [/formatters](/playground/form-intelligent/formatters)     | Phone, currency, slug         |
| [Plugins](/packages/form-intelligent/modules/plugins)           | [/plugins](/playground/form-intelligent/plugins)           | Event log                     |
| [Rules](/packages/form-intelligent/modules/rules)               | [/rules](/playground/form-intelligent/rules)               | when() show/require           |
| [Calculations](/packages/form-intelligent/modules/calculations) | [/calculations](/playground/form-intelligent/calculations) | Derived totals                |
| [State](/packages/form-intelligent/modules/state)               | [/state](/playground/form-intelligent/state)               | Snapshots & diffs             |
| [Integrations](/packages/form-intelligent/modules/integrations) | [/integrations](/playground/form-intelligent/integrations) | Keyboard + draft on hide      |
| DevTools                                                        | [/devtools](/playground/form-intelligent/devtools)         | Config JSON, export/import    |
| Performance benches                                             | [/performance](/playground/form-intelligent/performance)   | Validate / autosave / submit  |
| [Adapters](/packages/form-intelligent/modules/adapters)         | [/adapters](/playground/form-intelligent/adapters)         | HTML + React integration map  |

## How each page works

1. **Read** the explanation panel at the top
2. **Interact** with the demo (inputs, buttons, toggles)
3. **Inspect** field meta, JSON state, or event logs on the side

## Run locally

```bash
pnpm form-intelligent-playground:dev
```

Open [http://127.0.0.1:4277](http://127.0.0.1:4277).

If the shell shows a blank page or `__FORM_INTELLIGENT_VERSION__ is not defined`, stop any stale process on port `4277` and restart the dev command. The playground reads package versions from `vite.config.ts` at startup.

## All routes

| Route          | Focus                                          |
| -------------- | ---------------------------------------------- |
| `/`            | Dashboard & quick links                        |
| `/validation`  | Validators & timing                            |
| `/submission`  | Submit flow & guards                           |
| `/workflow`    | Autosave, drafts, wizard                       |
| `/state`       | State explorer & diffs                         |
| `/formatters`  | Input formatting                               |
| `/plugins`     | Plugin hooks                                   |
| `/devtools`    | Config JSON, export/import, verbose validation |
| `/performance` | Validation / submit benches                    |
| `/adapters`    | Framework integrations                         |
| `/examples`    | Copy-paste snippets                            |

## Foundation architecture

The playground separates shell UI from Form Intelligent runtime state.

| Folder                           | Responsibility                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/app`                        | Bootstrap and provider composition                                                       |
| `src/layouts`                    | App shell structure                                                                      |
| `src/pages`                      | Route-level explorers                                                                    |
| `src/components`                 | Reusable UI (ExplainPanel, EventLog, inspectors)                                         |
| `src/hooks`                      | `useFormSnapshot`, `useEventLog`                                                         |
| `src/lib`                        | **Package integration boundary** — only place that imports `@jayoncode/form-intelligent` |
| `src/config`                     | `app-metadata.ts` — versions and environment labels                                      |
| `src/providers` / `src/contexts` | Theme and shell UI state                                                                 |

### Integration boundary

Route pages import from `src/lib/form-intelligent.ts`, not directly from npm packages:

```ts
import { createForm, createSampleForm } from "../lib/form-intelligent.js";
```

The lib re-exports core APIs, React hooks (`useForm`, `useFormState`), and playground helpers (`createSampleForm`, `getFormIntelligentIntegrationSummary`).

### Version metadata process

Displayed versions (dashboard cards, header eyebrow, footer) follow the same compile-time pattern as other JOC playgrounds:

```
packages/*/package.json
        ↓ read in vite.config.ts
Vite define constants (__FORM_INTELLIGENT_VERSION__, …)
        ↓
src/config/app-metadata.ts → getPlaygroundMetadata()
        ↓
Header, Dashboard, Footer
```

TypeScript globals are declared in `src/vite-env.d.ts`. Production builds statically replace the constants; dev relies on the same `define` map — restart the dev server after changing package names or monorepo layout.

## Adoption paths demonstrated here

| Path          | API                                                          | Playground route       |
| ------------- | ------------------------------------------------------------ | ---------------------- |
| Native HTML   | `createForm({ target, schema, onSubmit })`                   | Validation, Submission |
| Headless bind | `form.field("email").bind()`                                 | State, Examples        |
| React adapter | `useForm()` → `form.form()`, `form.field()`, `form.submit()` | Adapters               |

[Back to package overview →](/packages/form-intelligent/)
