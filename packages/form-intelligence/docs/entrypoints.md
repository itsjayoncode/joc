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
| Derived UI projection (`showError`, `canSubmit`, `status`, …)       | `@jayoncode/form-intelligence/ui`         |
| CAPTCHA Security Stage (`captcha`, providers)                       | `@jayoncode/form-intelligence/captcha`    |
| Opt-in multipart upload (`uploadTransport`)                         | `@jayoncode/form-intelligence/upload`     |
| Browser-lifecycle / keyboard plugins                                | `@jayoncode/form-intelligence/plugins`    |
| Error helpers (`toNormalizedErrors`, …)                             | `@jayoncode/form-intelligence/validation` |

Main-entry `phone` / `currency` are **validators** (`phone()`, `currency(opts?)` — “is this valid?”).  
Formatter masks use a `format*` prefix on `/format` only (`formatPhone`, `formatCurrency`, … — “mask while typing”).  
`trim` stays `trim`. See [Formatters](/packages/form-intelligence/modules/formatters) and [Validation](/packages/form-intelligence/modules/validation#basics--built-in-validators).

## Subpath map

| Import                         | Use for                                                                                                                                                                                                                      | Also on main?                                                                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@jayoncode/form-intelligence` | `createForm`, `when`, validators, `calculate`, `dependencies`, transform/presentation/middleware helpers, `createFormController`, `computeFieldAria`                                                                         | —                                                                                                                                                           |
| `…/validation`                 | Pipeline helpers, `mergeValidatorsByKind`, `matchesField`, `requiredWhen`, re-exported validators — [Validation](/packages/form-intelligence/modules/validation) (HTML constraints attach via core DOM, not a subpath)       | Validators yes; helpers prefer this path                                                                                                                    |
| `…/format`                     | Formatters / parsers (`formatPhone`, `formatSlug`, `formatCreditCard`, …), advanced (`formatForDisplay`, `FormatterRegistry`)                                                                                                | **No** (validators like `phone()` stay on main)                                                                                                             |
| `…/rules`                      | `when`, `evaluateFormRules`, `runDependencyRules`, `runCalculations`, rule types                                                                                                                                             | `when` also on main; prefer form `rules` for apps — [Rules → evaluateFormRules](/packages/form-intelligence/modules/rules#rules-helpers--evaluateformrules) |
| `…/workflow`                   | Low-level autosave/draft/wizard internals                                                                                                                                                                                    | Prefer `createForm({ workflow })`                                                                                                                           |
| `…/draft`                      | Draft storage primitives, `createIndexedDbDraftStorage` — [Workflow → IndexedDB drafts](/packages/form-intelligence/modules/workflow#indexeddb-drafts)                                                                       | Prefer `workflow.draft`                                                                                                                                     |
| `…/wizard`                     | Wizard graph helpers (`getStepGraph`, `listVisibleStepIds`, …) — [Workflow → wizard graph helpers](/packages/form-intelligence/modules/workflow#wizard-graph-helpers-wizard)                                                 | Prefer `workflow.wizard`                                                                                                                                    |
| `…/submission`                 | Submit orchestrator / offline queue classes, `evaluateSubmissionGuard`, Security Stage API — [Submission](/packages/form-intelligence/modules/submission#security-stage-api)                                                 | Prefer `form.submit()` + `workflow.offlineQueue`                                                                                                            |
| `…/offline`                    | Offline module service                                                                                                                                                                                                       | Prefer workflow config                                                                                                                                      |
| `…/history`                    | History stack primitives                                                                                                                                                                                                     | Prefer `form.undo()` / `form.redo()`                                                                                                                        |
| `…/state`                      | Store / selectors (`selectValues`, `selectFieldValue`, …) — [State → selectors](/packages/form-intelligence/modules/state#selectors-state)                                                                                   | Prefer `form.state`                                                                                                                                         |
| `…/fields`                     | Field registry / array helpers (`pushArrayItem`, `removeArrayItem`, …) — [State → array field helpers](/packages/form-intelligence/modules/state#array-field-helpers-fields)                                                 | Prefer `form.field()` / `form.pushField()`                                                                                                                  |
| `…/plugins`                    | `createBrowserLifecyclePlugin`, `createKeyboardPlugin`, `pluginAsModule`, …                                                                                                                                                  | **Plugins: this path**                                                                                                                                      |
| `…/devtools`                   | `enableFormDevTools`, `getFormDevTools`                                                                                                                                                                                      | **DevTools: this path only**                                                                                                                                |
| `…/ui`                         | Derived UI projection: `ui()`, `createUiProjection`, `showError`, `canSubmit`, `status`, `explain()` — [UI projection → free helpers](/packages/form-intelligence/modules/ui-projection#free-helpers--policy-store-advanced) | **Projection: this path**                                                                                                                                   |
| `…/captcha`                    | CAPTCHA Security Stage: `captcha()`, `turnstile()`, `recaptcha()`, `hcaptcha()`, `mockCaptcha()`                                                                                                                             | **CAPTCHA: this path only**                                                                                                                                 |
| `…/upload`                     | Opt-in multipart upload transport: `uploadTransport()` — [Upload transport](/packages/form-intelligence/modules/upload)                                                                                                      | **Upload: this path only**                                                                                                                                  |
| `…/analytics`                  | `FormAnalyticsTracker`, `createAnalyticsPlugin` — [Integrations → analytics module API](/packages/form-intelligence/modules/integrations#analytics-module-api)                                                               | Prefer `workflow.analytics`                                                                                                                                 |
| `…/adapters`                   | Adapter types, `createFormController`                                                                                                                                                                                        | Controller also on main                                                                                                                                     |
| `…/dependency`                 | Dependency engine, `detectDependencyCycles`                                                                                                                                                                                  | `dependencies` also on main                                                                                                                                 |
| `…/transform`                  | Inbound transform pipeline helpers (`createTransformPipeline`, `runTransformInbound`, `TRANSFORM_INBOUND_ORDER`)                                                                                                             | Also on main                                                                                                                                                |
| `…/presentation`               | Field UI / presentation helpers                                                                                                                                                                                              | Also on main                                                                                                                                                |
| `…/middleware`                 | Middleware pipeline / stages (`composeMiddleware`, `runMiddlewareChain`, `MiddlewarePipeline`)                                                                                                                               | Also on main / plugins                                                                                                                                      |
| `…/accessibility`              | `computeFieldAria`                                                                                                                                                                                                           | Also on main                                                                                                                                                |

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
