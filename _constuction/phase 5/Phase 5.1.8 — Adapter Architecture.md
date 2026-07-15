# JOC ENGINEERING TASK
# Phase 5.1.8 — Adapter Architecture
# Package: @jayoncode/form-intelligent

===============================================================================
ROLE
===============================================================================

You are acting as an Integration Architect designing optional adapter packages.

All adapters are **optional separate packages** — never required by core.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 5.1.4 — Architecture

✓ Phase 5.1.5 — Public API Design

===============================================================================
OBJECTIVE
===============================================================================

Produce `packages/form-intelligent/engineering/007-adapter-architecture.md`.

===============================================================================
OUTPUT
===============================================================================

packages/form-intelligent/engineering/007-adapter-architecture.md

===============================================================================
ADAPTER CATEGORIES
===============================================================================

--------------------------------------------------
Framework UI Adapters (separate packages)
--------------------------------------------------

| Package | Purpose |
|---------|---------|
| @jayoncode/form-intelligent-react | `useForm`, `FormProvider`, field bindings |
| @jayoncode/form-intelligent-vue | `useForm`, composables |
| @jayoncode/form-intelligent-angular | signals/services integration |
| @jayoncode/form-intelligent-svelte | stores / runes |
| @jayoncode/form-intelligent-solid | SolidJS primitives |
| @jayoncode/form-intelligent-html | Native HTML `data-*` binding helpers |

--------------------------------------------------
Third-party Form Library Bridges
--------------------------------------------------

| Package | Purpose |
|---------|---------|
| @jayoncode/form-intelligent-rhf | Orchestrate RHF + @jayoncode/form-intelligent workflow |
| @jayoncode/form-intelligent-formik | Formik bridge |
| @jayoncode/form-intelligent-tanstack | TanStack Form bridge |

Bridges own **workflow/submit/autosave** — not field registration.

--------------------------------------------------
Schema Adapters
--------------------------------------------------

| Package | Purpose |
|---------|---------|
| @jayoncode/form-intelligent-zod | Zod schema → validation pipeline |
| @jayoncode/form-intelligent-yup | Yup schema |
| @jayoncode/form-intelligent-valibot | Valibot schema |

===============================================================================
CORE ADAPTER INTERFACES
===============================================================================

Define TypeScript interfaces in core (types only):

- `FrameworkAdapter`
- `SchemaAdapter<TSchema>`
- `PersistenceAdapter` (drafts/autosave)
- `SubmitTransportAdapter` (fetch, custom API)

===============================================================================
REACT ADAPTER EXAMPLE
===============================================================================

Document intended DX:

```ts
const form = useForm({
  initialValues: { email: "" },
  workflow: { autosave: { debounceMs: 500 } },
  onSubmit: async (values) => { ... },
});
```

===============================================================================
VERSIONING
===============================================================================

Adapters version independently but declare peer dependency on `@jayoncode/form-intelligent`.

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Core remains adapter-free

✓ Every adapter package listed with scope

✓ Bridge strategy for RHF/Formik/TanStack documented

===============================================================================
STOP CONDITION
===============================================================================

STOP after Adapter Architecture.

Proceed to Phase 5.1.9 — Folder Architecture.
