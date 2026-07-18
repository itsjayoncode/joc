# Form Intelligence — Folder Architecture

`@jayoncode/form-intelligence` uses a **domain engine** layout inside one published package. Optional engines are exposed via subpath exports. Framework adapters (`-react`, `-vue`, `-angular`) ship as separate packages — see [Ecosystem architecture](./001-ecosystem-architecture.md) and [Modular packages](./003-modular-packages.md).

## Target layout (post-consolidation)

```
src/
  engines/
    core/           createForm, config normalization, lifecycle, events, module host
    state/          value snapshots, history integration points
    field/          field registry, discovery, bindings (or under dom/ until split)
    validation/     built-in validators, pipeline, async manager
    submission/     submit orchestration, double-submit guard
    formatter/      formatters, presets, parsers
    workflow/       when(), rule evaluation, calculations, dependencies
    draft/          loadDraft, saveDraft, autosave
    wizard/         multi-step navigation, resolveWizardState
    offline/        submit queue, OfflineService
    analytics/      FormAnalyticsTracker, AnalyticsService
    history/        ValueHistoryStack
    plugins/        plugin registry, pluginAsModule
  modules/          FormModule wrappers (history, integrations, register-configured)
  dom/              enhance-form, discover-fields, field-value
  integrations/     keyboard, browser-lifecycle bridge
  types/            public and internal types
  errors/           typed error hierarchy
  utils/            shared helpers

  index.ts              main barrel (core engines)
  validation/index.ts   subpath: /validation
  format/index.ts       subpath: /format
  workflow/index.ts     subpath: /workflow
  rules/index.ts        subpath: /rules (rules surface)
  draft/index.ts        subpath: /draft
  wizard/index.ts       subpath: /wizard
  submission/index.ts   subpath: /submission
  plugins/index.ts      subpath: /plugins
  analytics/index.ts    subpath: /analytics
  offline/index.ts      subpath: /offline
  history/index.ts      subpath: /history
```

## Current layout (post-consolidation)

Optional engine code lives under `src/engines/` and is re-exported through subpath shims:

- `src/engines/formatter/` → `src/format/index.ts` (`/format`)
- `src/engines/offline/` → `src/offline/index.ts` (`/offline`)
- `src/engines/analytics/` → `src/analytics/index.ts` (`/analytics`)
- `src/engines/workflow/` → `src/workflow/index.ts`, `src/rules/index.ts`
- `src/engines/draft/` → `src/draft/index.ts` (`/draft`)
- `src/engines/wizard/` → `src/wizard/index.ts` (`/wizard`)

Core folders already in place:

- `src/core/` — `createForm`, event bus, config normalization, module registry
- `src/validation/` — built-in validators and validation pipeline
- `src/submission/` — submit orchestration
- `src/history/` — value history stack
- `src/plugins/` — optional plugin registry
- `src/adapters/` — schema adapter contracts (Zod, Yup, etc.)
- `src/modules/` — lazy FormModule registration

## Dependency direction

```
utils → types/errors → engines (peer isolation, no upward imports) → core/create-form → subpath entrypoints → index
```

Engines must not import from `create-form.ts`. `create-form` orchestrates engines and modules.
