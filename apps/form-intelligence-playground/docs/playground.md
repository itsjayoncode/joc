# Form Intelligence Playground

Interactive **developer sandbox** for `@jayoncode/form-intelligence` — configure forms, inspect state, stream events, and copy generated code. Focused explorers remain available for deep dives.

[Open playground →](/playground/form-intelligence/)

## Match docs to playground

Follow the [learning path](/packages/form-intelligence/) in docs, then try each topic live:

| Docs guide                                                         | Playground route                                                    | What to try                    |
| ------------------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------ |
| [Tutorial](/packages/form-intelligence/modules/getting-started)    | [/](/playground/form-intelligence/)                                 | Sandbox lab — full workspace   |
| [Concepts](/packages/form-intelligence/modules/concepts)           | [/state](/playground/form-intelligence/state)                       | Edit fields, watch JSON state  |
| [Validation](/packages/form-intelligence/modules/validation)       | [/validation](/playground/form-intelligence/validation)             | Toggle timing, async username  |
| HTML constraints (DOM-backed)                                      | [/html-constraints](/playground/form-intelligence/html-constraints) | `form.ref` + HTML attributes   |
| [Submission](/packages/form-intelligence/modules/submission)       | [/submission](/playground/form-intelligence/submission)             | Guards + form.ui.canSubmit     |
| [UI projection](/packages/form-intelligence/modules/ui-projection) | [/ui](/playground/form-intelligence/ui)                             | Policies + explain / status    |
| [Workflow](/packages/form-intelligence/modules/workflow)           | [/workflow](/playground/form-intelligence/workflow)                 | Reload page → draft restored   |
| [Formatters](/packages/form-intelligence/modules/formatters)       | [/formatters](/playground/form-intelligence/formatters)             | Phone, currency, slug          |
| [Plugins](/packages/form-intelligence/modules/plugins)             | [/plugins](/playground/form-intelligence/plugins)                   | Event log                      |
| [Rules](/packages/form-intelligence/modules/rules)                 | [/rules](/playground/form-intelligence/rules)                       | when() show/require            |
| [Calculations](/packages/form-intelligence/modules/calculations)   | [/calculations](/playground/form-intelligence/calculations)         | Derived totals                 |
| [State](/packages/form-intelligence/modules/state)                 | [/state](/playground/form-intelligence/state)                       | Snapshots & diffs              |
| [Integrations](/packages/form-intelligence/modules/integrations)   | [/integrations](/playground/form-intelligence/integrations)         | Keyboard + draft on hide       |
| DevTools                                                           | [/devtools](/playground/form-intelligence/devtools)                 | Explain panels + export/import |
| Performance benches                                                | [/performance](/playground/form-intelligence/performance)           | Validate / autosave / submit   |
| [Adapters](/packages/form-intelligence/modules/adapters)           | [/adapters](/playground/form-intelligence/adapters)                 | HTML + React integration map   |
| Overview                                                           | [/dashboard](/playground/form-intelligence/dashboard)               | Versions & explorer map        |

## How the sandbox works

1. **Configure** the experiment in the left panel (template, validateOn, plugins, rules)
2. **Interact** with the live form in the center canvas
3. **Inspect** field/form state, events, performance, and generated code on the right
4. **Read** the bottom console for engine activity

Focused explorers under `/validation`, `/workflow`, etc. remain for single-topic deep dives.

## Run locally

```bash
pnpm form-intelligence-playground:dev
```

Open [http://127.0.0.1:4277](http://127.0.0.1:4277).

If the shell shows a blank page or version env vars are missing, stop any stale process on port `4277` and restart the dev command. The playground reads package versions from `vite.config.ts` at startup.

**Version bumps:** playground feature/UX changes must bump `apps/form-intelligence-playground/package.json` in the same change set (see the app [README](https://github.com/itsjayoncode/joc/blob/master/apps/form-intelligence-playground/README.md#version-control-when-changing-the-playground)). Library versions on the dashboard follow package `package.json` / changesets.

## All routes

| Route               | Focus                                       |
| ------------------- | ------------------------------------------- |
| `/`                 | Interactive developer sandbox               |
| `/dashboard`        | Overview & quick links                      |
| `/validation`       | Validators & timing                         |
| `/html-constraints` | DOM-backed HTML → validators (Phase 1)      |
| `/submission`       | Submit flow, hard guards, UI canSubmit      |
| `/captcha`          | Security Stage CAPTCHA (loading / pending)  |
| `/ui`               | UI policies, showError, status, explain     |
| `/workflow`         | Autosave, drafts, wizard                    |
| `/state`            | State explorer & diffs                      |
| `/formatters`       | Input formatting                            |
| `/plugins`          | Plugin hooks                                |
| `/devtools`         | Explain panels, config JSON, export/import  |
| `/performance`      | Validation / submit / UI projection benches |
| `/adapters`         | Framework integrations                      |
| `/examples`         | Copy-paste snippets                         |

## Foundation architecture

The playground separates shell UI from Form Intelligence runtime state.

| Folder                           | Responsibility                                                                            |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/app`                        | Bootstrap and provider composition                                                        |
| `src/layouts`                    | App shell structure                                                                       |
| `src/sandbox`                    | Multi-panel developer sandbox (primary home)                                              |
| `src/pages`                      | Route-level explorers                                                                     |
| `src/components`                 | Reusable UI (ExplainPanel, EventLog, inspectors)                                          |
| `src/hooks`                      | `useFormSnapshot`, `useEventLog`                                                          |
| `src/lib`                        | **Package integration boundary** — only place that imports `@jayoncode/form-intelligence` |
| `src/config`                     | `app-metadata.ts` — versions and environment labels                                       |
| `src/providers` / `src/contexts` | Theme and shell UI state                                                                  |

### Integration boundary

Route pages import from `src/lib/form-intelligence.ts`, not directly from npm packages:

```ts
import { createForm, createSampleForm } from "../lib/form-intelligence.js";
```

Sandbox capabilities register in `src/sandbox/capabilities.ts` so future plugins can appear in the config panel, inspector, console, and generated code without redesigning the workspace.
