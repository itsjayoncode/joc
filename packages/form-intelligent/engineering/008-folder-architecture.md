# Form Intelligent — Folder Architecture

`@jayoncode/form-intelligent` uses a modular engine layout:

- `src/core/` — `createForm`, event bus, and config normalization
- `src/state/` — values, errors, touched, dirty, and visited tracking (via form instance)
- `src/validation/` — built-in validators and validation pipeline
- `src/submission/` — submit orchestration and double-submit guard
- `src/workflow/` — autosave, drafts, and wizard steps
- `src/format/` — field formatters and parsers
- `src/plugins/` — optional plugin registry
- `src/adapters/` — schema adapter contracts (Zod, Yup, etc.)
- `src/types/` — public and internal types
- `src/errors/` — typed error hierarchy
- `src/utils/` — shared helpers

Dependency direction: `utils` → `types/errors` → `validation/format` → `workflow/submission/plugins` → `core` → `index`.
