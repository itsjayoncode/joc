# Entrypoints & subpaths

Tree-shakeable imports for `@jayoncode/form-intelligence`. Prefer the **narrowest** entry that exports what you need.

**Previous:** [Capabilities](/packages/form-intelligence/modules/capabilities) · **Next:** [Validation](/packages/form-intelligence/modules/validation)

::: tip Playground
[Sandbox](/playground/form-intelligence/) — explore features live; import paths below apply in app code.
:::

## Quick rule

| Need                                                                | Import from                               |
| ------------------------------------------------------------------- | ----------------------------------------- |
| `createForm`, `when`, validators, most instance APIs                | `@jayoncode/form-intelligence` (main)     |
| Phone/currency **masks**, `formatSlug`, `trim`, `composeFormatters` | `@jayoncode/form-intelligence/format`     |
| DevTools inspector                                                  | `@jayoncode/form-intelligence/devtools`   |
| Browser-lifecycle / keyboard plugins                                | `@jayoncode/form-intelligence/plugins`    |
| Error helpers (`toNormalizedErrors`, …)                             | `@jayoncode/form-intelligence/validation` |

Main-entry `phone` / `currency` are **validators** (`phone()`, `currency(opts?)` — “is this valid?”).  
Formatter masks use a `format*` prefix on `/format` only (`formatPhone`, `formatCurrency`, … — “mask while typing”).  
`trim` stays `trim`. See [Formatters](/packages/form-intelligence/modules/formatters) and [Validation](/packages/form-intelligence/modules/validation#basics--built-in-validators).

## Subpath map

| Import                         | Use for                                                                                                                                              | Also on main?                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `@jayoncode/form-intelligence` | `createForm`, `when`, validators, `calculate`, `dependencies`, transform/presentation/middleware helpers, `createFormController`, `computeFieldAria` | —                                                |
| `…/validation`                 | Pipeline helpers (`toNormalizedErrors`, …), re-exported validators                                                                                   | Validators yes; helpers prefer this path         |
| `…/format`                     | Formatters / parsers (`formatPhone`, `formatSlug`, `formatCreditCard`, …)                                                                            | **No** (validators like `phone()` stay on main)  |
| `…/rules`                      | `when`, rule evaluation helpers                                                                                                                      | `when` also on main                              |
| `…/workflow`                   | Low-level autosave/draft/wizard internals                                                                                                            | Prefer `createForm({ workflow })`                |
| `…/draft`                      | Draft storage primitives                                                                                                                             | Prefer `workflow.draft`                          |
| `…/wizard`                     | Wizard graph helpers                                                                                                                                 | Prefer `workflow.wizard`                         |
| `…/submission`                 | Submit orchestrator / offline queue classes                                                                                                          | Prefer `form.submit()` + `workflow.offlineQueue` |
| `…/offline`                    | Offline module service                                                                                                                               | Prefer workflow config                           |
| `…/history`                    | History stack primitives                                                                                                                             | Prefer `form.undo()` / `form.redo()`             |
| `…/state`                      | Store / selectors                                                                                                                                    | Prefer `form.state`                              |
| `…/fields`                     | Field registry / array helpers                                                                                                                       | Prefer `form.field()`                            |
| `…/plugins`                    | `createBrowserLifecyclePlugin`, `createKeyboardPlugin`, …                                                                                            | **Plugins: this path**                           |
| `…/devtools`                   | `enableFormDevTools`, `getFormDevTools`                                                                                                              | **DevTools: this path only**                     |
| `…/analytics`                  | Analytics module                                                                                                                                     | Prefer integrations guide                        |
| `…/adapters`                   | Adapter types, `createFormController`                                                                                                                | Controller also on main                          |
| `…/dependency`                 | Dependency engine                                                                                                                                    | `dependencies` also on main                      |
| `…/transform`                  | Inbound transform pipeline helpers                                                                                                                   | Also on main                                     |
| `…/presentation`               | Field UI / presentation helpers                                                                                                                      | Also on main                                     |
| `…/middleware`                 | Middleware pipeline / stages                                                                                                                         | Also on main / plugins                           |
| `…/accessibility`              | `computeFieldAria`                                                                                                                                   | Also on main                                     |

## Instance API vs low-level import

Most apps only need:

```ts
import { createForm, when, required, email } from "@jayoncode/form-intelligence";
```

Use subpaths when you want an **explicit dependency**, a **slimmer entry**, or symbols that are **not** on main (formatters, DevTools, lifecycle plugins).

## Related

- [Formatters](/packages/form-intelligence/modules/formatters) — format vs transform
- [Integrations](/packages/form-intelligence/modules/integrations) — plugins + DevTools
- [Performance](/packages/form-intelligence/modules/performance) — budgets and tree-shaking
- [API (TypeDoc)](/packages/form-intelligence/api/)
