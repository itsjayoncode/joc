# Form Intelligent Playground

Interactive **developer sandbox** for `@jayoncode/form-intelligent` — configure forms, inspect state, stream events, and copy generated code. Focused explorers remain available for deep dives.

[Open playground →](/playground/form-intelligent/)

## Match docs to playground

Follow the [learning path](/packages/form-intelligent/) in docs, then try each topic live:

| Docs guide                                                      | Playground route                                           | What to try                   |
| --------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------- |
| [Tutorial](/packages/form-intelligent/modules/getting-started)  | [/](/playground/form-intelligent/)                         | Sandbox lab — full workspace  |
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
| Overview                                                        | [/dashboard](/playground/form-intelligent/dashboard)       | Versions & explorer map       |

## How the sandbox works

1. **Configure** the experiment in the left panel (template, validateOn, plugins, rules)
2. **Interact** with the live form in the center canvas
3. **Inspect** field/form state, events, performance, and generated code on the right
4. **Read** the bottom console for engine activity

Focused explorers under `/validation`, `/workflow`, etc. remain for single-topic deep dives.

## Run locally

```bash
pnpm form-intelligent-playground:dev
```

Open [http://127.0.0.1:4277](http://127.0.0.1:4277).

If the shell shows a blank page or `__FORM_INTELLIGENT_VERSION__ is not defined`, stop any stale process on port `4277` and restart the dev command. The playground reads package versions from `vite.config.ts` at startup.

## All routes

| Route          | Focus                                          |
| -------------- | ---------------------------------------------- |
| `/`            | Interactive developer sandbox                  |
| `/dashboard`   | Overview & quick links                         |
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
| `src/sandbox`                    | Multi-panel developer sandbox (primary home)                                             |
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

Sandbox capabilities register in `src/sandbox/capabilities.ts` so future plugins can appear in the config panel, inspector, console, and generated code without redesigning the workspace.
