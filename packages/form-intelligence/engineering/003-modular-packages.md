# Form Intelligence — Modular Package Architecture

## Goal

One published npm package (`@jayoncode/form-intelligence`) organized by **domain engines**, with optional engines exposed as **subpath exports**. Heavy engines load only when imported or enabled via config / `form.use(module())`.

Framework adapters and third-party integrations stay in **separate packages**.

This mirrors **Browser Lifecycle**: thin session core → module registry → opt-in modules → framework adapters. Form Intelligence applies the same pattern inside a single published package instead of fragmenting into many npm installs.

## Architecture decision (2026-07)

**Adopt:** domain engines + subpath exports inside one package.

**Retire:** Phase B plan to publish separate `@jayoncode/form-intelligent-*` feature packages. The four satellites extracted during Phase B (`formatter`, `offline`, `analytics`, `workflow`) will be **folded back into core** as source folders. See [004 — Engine consolidation plan](./004-engine-consolidation.md).

**Rationale:**

- Simpler DX: one install, modular imports
- Core stays lightweight: no `dependencies` on optional engines
- Tree-shaking via subpath exports (Node `exports` field)
- Separate npm packages reserved for true boundaries (React, Zod, browser-lifecycle)

---

## Published packages

| Package                                | Responsibility                               | Status                 |
| -------------------------------------- | -------------------------------------------- | ---------------------- |
| `@jayoncode/form-intelligence`         | All engines (core + optional subpaths)       | **Target**             |
| `@jayoncode/form-intelligence-react`   | `useForm()`, React bindings                  | **Shipped**            |
| `@jayoncode/form-intelligence-zod`     | Zod schema adapter                           | **Shipped**            |
| `@jayoncode/form-intelligence-yup`     | Yup schema adapter                           | **Shipped**            |
| `@jayoncode/form-intelligence-valibot` | Valibot schema adapter                       | **Shipped**            |
| `@jayoncode/browser-lifecycle`         | Visibility, reconnect, session (integration) | **Shipped** (external) |

### Deprecated / to remove after consolidation

| Package                                 | Fate                                                                             |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| `@jayoncode/form-intelligent-formatter` | Merge → `form-intelligent/src/engines/formatter/`                                |
| `@jayoncode/form-intelligent-offline`   | Merge → `form-intelligent/src/engines/offline/`                                  |
| `@jayoncode/form-intelligent-analytics` | Merge → `form-intelligent/src/engines/analytics/`                                |
| `@jayoncode/form-intelligent-workflow`  | Merge → `form-intelligent/src/engines/workflow/` (+ split draft/wizard subpaths) |

---

## Domain engines

Engines are the mental model and folder layout. Optional engines map to subpath exports.

### Core (always available from main entry)

| Engine         | Responsibility                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| **Core**       | `createForm()`, config, lifecycle, events, form registry, destroy, reset                               |
| **State**      | values, errors, dirty, touched, visited, changed, previous values, snapshots                           |
| **Field**      | registration, auto-discovery, nested/array fields, labels, metadata, disabled, readonly, visibility UI |
| **Validation** | built-in validators, async validation, cross-field, business rules                                     |
| **Submission** | submit, loading, success/failure, retry, cancel, `AbortController`, double-submit guard, timeout       |
| **Plugin**     | `form.use()`, hooks, lifecycle, middleware, plugin events                                              |

### Optional (subpath exports — tree-shakeable)

| Engine        | Subpath               | Responsibility                                                                                    |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| **Workflow**  | `/workflow`, `/rules` | `when()`, show/hide, enable/disable, require/optional, calculations, dependencies, branching      |
| **Formatter** | `/format`             | phone, currency, credit card, date, trim, slug, custom formatters/parsers                         |
| **Draft**     | `/draft`              | autosave, restore, localStorage/sessionStorage, manual save                                       |
| **Wizard**    | `/wizard`             | multi-step, next/previous/jump, per-step validation, progress, skip logic                         |
| **Offline**   | `/offline`            | submit queue, retry, sync on reconnect                                                            |
| **Analytics** | `/analytics`          | completion time, validation errors, drop-off, journey metrics                                     |
| **History**   | `/history`            | undo, redo, value history stack                                                                   |
| **DevTools**  | `/devtools`           | `createDevToolsPlugin()`, `getFormDevTools()` — form inspector, validation log, workflow timeline |

### Integrations (plugins or separate packages — not core engines)

| Integration                                       | Package / location                                                                                       |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Browser session (hidden → draft, offline → queue) | `@jayoncode/browser-lifecycle` via `createBrowserSessionModule()`                                        |
| Keyboard shortcuts                                | core integration plugin                                                                                  |
| Object diff (changed-fields audit)                | `@jayoncode/object-diff` via `diffFromDefaults()`, `submit({ includeDiff })`, `createObjectDiffPlugin()` |
| Zod / Yup / Valibot / AJV                         | `form-intelligent-zod`, `form-intelligent-yup`, `form-intelligent-valibot`, `form-intelligent-ajv`       |
| Stripe, reCAPTCHA, Google Places                  | future integration plugins                                                                               |

---

## Subpath exports (target)

```
@jayoncode/form-intelligence              → core barrel (engines: core, state, field, validation, submission, plugin)
@jayoncode/form-intelligence/validation
@jayoncode/form-intelligence/format
@jayoncode/form-intelligence/rules        → alias of workflow rules surface
@jayoncode/form-intelligence/workflow
@jayoncode/form-intelligence/draft        → NEW (split from workflow)
@jayoncode/form-intelligence/wizard       → NEW (split from workflow)
@jayoncode/form-intelligence/submission
@jayoncode/form-intelligence/plugins
@jayoncode/form-intelligence/analytics
@jayoncode/form-intelligence/offline
@jayoncode/form-intelligence/history
@jayoncode/form-intelligence/devtools       → inspector plugin + global registry (opt-in)
```

Main barrel is **core-only** (`createForm`, validators, types, module host). Import optional engines via subpaths (`/rules`, `/draft`, `/format`, `/plugins`, etc.) for smaller bundles.

---

## Module host (runtime opt-in)

Optional engines also register as lazy `FormModule` instances when config enables them.

| Module id         | Enabled when                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `history`         | First `setValue` with history recording, or `undo`/`redo`            |
| `offline`         | `workflow.offlineQueue.enabled` or `form.use(createOfflineModule())` |
| `analytics`       | `workflow.analytics.enabled` or `form.use(createAnalyticsModule())`  |
| `rules`           | Config `rules`, `form.when()`, or calculations                       |
| `draft`           | `workflow.draft.enabled` or `workflow.autosave.enabled`              |
| `wizard`          | `workflow.wizard` config                                             |
| `keyboard`        | `workflow.keyboard` shortcuts                                        |
| `browser-session` | `workflow.draft.enabled` + browser-lifecycle integration             |

### Module contract

```ts
interface FormModule<TValues> {
  readonly id: string;
  readonly order?: number;
  initialize?(ctx: FormModuleContext<TValues>): void;
  start?(ctx: FormModuleContext<TValues>): void;
  stop?(ctx: FormModuleContext<TValues>): void;
  destroy?(ctx: FormModuleContext<TValues>): void;
}
```

`FormPlugin` remains supported — plugins adapt to modules via `pluginAsModule()`.

---

## Usage

### Login (core only)

```ts
import { createForm } from "@jayoncode/form-intelligence";

createForm({
  target: "#login",
  schema: { email: "email", password: "password" },
  onSubmit,
});
```

### Loan app (explicit subpath imports)

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { when } from "@jayoncode/form-intelligence/workflow";
import { createOfflineModule } from "@jayoncode/form-intelligence/offline";
import { createAnalyticsModule } from "@jayoncode/form-intelligence/analytics";

const form = createForm({
  initialValues,
  rules: [when("loanAmount").greaterThan(500_000).disableSubmit()],
  onSubmit,
});

form.use(createOfflineModule({ storageKey: "loan-queue" }));
form.use(createAnalyticsModule());
```

### Config-based registration (backward compatible)

```ts
createForm({
  workflow: {
    analytics: { enabled: true },
    offlineQueue: { enabled: true },
    draft: { enabled: true },
    wizard: { steps: [/* … */] },
  },
});
```

### Browser session integration

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { createBrowserSessionModule } from "@jayoncode/form-intelligence/plugins";

const form = createForm({/* … */});
form.use(createBrowserSessionModule()); // uses @jayoncode/browser-lifecycle internally
```

---

## Target folder layout

```
packages/form-intelligence/src/
  engines/
    core/           createForm, config, lifecycle, events
    state/          snapshots, undo integration points
    field/          registry, discovery, bindings, DOM
    validation/     validators, pipeline, async
    submission/     submit orchestration
    formatter/      formatters, presets, parsers
    workflow/       when(), evaluate, calculations, dependencies
    draft/          loadDraft, saveDraft, autosave hooks
    wizard/         resolveWizardState, step navigation
    offline/        queue, OfflineService, module
    analytics/      tracker, module
    history/        ValueHistoryStack, module
    plugins/        registry, pluginAsModule
  modules/          FormModule wrappers (register-configured, integrations)
  dom/              enhance-form, field-value
  integrations/     keyboard, browser-lifecycle bridge
  types/
  errors/
  utils/
  index.ts          core barrel
  validation/index.ts   subpath re-export
  format/index.ts
  workflow/index.ts
  draft/index.ts      NEW
  wizard/index.ts     NEW
  …
```

Dependency direction: `utils` → `types/errors` → engines (no upward deps) → `core/create-form` → subpath entrypoints.

---

## Migration phases

### Phase A — internal modularization ✅

- [x] `FormModuleRegistry` + `FormModuleHost`
- [x] Lazy `history`, `offline`, `analytics` services
- [x] Feature code under `src/modules/`
- [x] Subpath exports in `package.json`
- [x] Backward-compatible `workflow.*` config auto-registers modules

### Phase B — satellite extraction ⚠️ superseded

Extracted workspace packages for experimentation. **Do not publish further satellites.** Consolidate back per [004](./004-engine-consolidation.md).

- [x] `@jayoncode/form-intelligent-formatter`
- [x] `@jayoncode/form-intelligent-analytics`
- [x] `@jayoncode/form-intelligent-offline`
- [x] `@jayoncode/form-intelligent-workflow`

### Phase B′ — consolidation (current) ✅

- [x] Move satellite source into `src/engines/*`
- [x] Remove `dependencies` on satellite packages from core `package.json`
- [x] Update imports from `@jayoncode/form-intelligent-*` → relative paths
- [x] Add `/draft` and `/wizard` subpath exports
- [x] Delete satellite packages (or mark `private: true` during transition)
- [x] Update `tsconfig` project references
- [x] Run full test suite + bundle budget baseline

### Phase C — bundle budgets ✅

- [x] `scripts/check-entry-sizes.mjs` — raw + gzip per subpath entry
- [x] `scripts/bundle-budgets.mjs` — esbuild fixtures with gzip ceilings
- [x] CI hook via `pnpm --filter @jayoncode/form-intelligence check:size`

Fixtures:

| Fixture          | Import surface                      | Budget (gzip) |
| ---------------- | ----------------------------------- | ------------- |
| `core-login`     | `createForm` + validators from main | 27 KB         |
| `workflow-rules` | `when` from `/rules`                | 3 KB          |
| `format-only`    | formatters from `/format`           | 2 KB          |

Tune limits in `scripts/bundle-budgets.json` only after intentional size changes.

### Phase D — adapter packages

- [x] `@jayoncode/form-intelligence-zod` — `zodAdapter()` → `SchemaAdapter`
- [x] `@jayoncode/form-intelligence-yup` — `yupAdapter()` → `SchemaAdapter`
- [x] `@jayoncode/form-intelligence-valibot` — `valibotAdapter()` → `SchemaAdapter`
- [x] `@jayoncode/form-intelligence-ajv` — `ajvAdapter()` → `SchemaAdapter`
- [x] `@jayoncode/form-intelligence-vue` — `useForm`, `provideForm`, `useField`
- [x] `@jayoncode/form-intelligence-angular` — `FormService`, signals, `fiForm` / `fiField` directives

---

## Dependency rules

```
@jayoncode/form-intelligence          (single published package — all engines)
        ↑
        ├── @jayoncode/form-intelligence-react
        ├── @jayoncode/form-intelligence-vue
        ├── @jayoncode/form-intelligence-angular
        ├── @jayoncode/form-intelligence-zod
        ├── @jayoncode/form-intelligence-yup
        ├── @jayoncode/form-intelligence-valibot
        ├── @jayoncode/form-intelligence-ajv
        └── …

@jayoncode/browser-lifecycle         (peer-style integration, not a form engine package)
        ↑
        └── form-intelligent browser-session plugin
```

**Rules:**

- Core package has **zero dependencies** on optional engines (they are folders, not npm deps)
- Adapters depend on `@jayoncode/form-intelligence`
- Integrations depend on their external package (`browser-lifecycle`, `object-diff`)
- Never publish a separate `@jayoncode/form-intelligent-workflow` etc. again

---

## Related documents

- [004 — Engine consolidation plan](./004-engine-consolidation.md) — step-by-step merge checklist
- [008 — Folder architecture](./008-folder-architecture.md) — engine folder map (update after consolidation)
- [001 — Ecosystem architecture](./001-ecosystem-architecture.md) — adapters and integrations boundary
