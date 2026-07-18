# Form Intelligence Angular — Folder Architecture

`@jayoncode/form-intelligence-angular` is a thin Angular adapter over `@jayoncode/form-intelligence`.

Part of the Form Intelligence ecosystem — see `../form-intelligence/engineering/001-ecosystem-architecture.md`.

- src/form-intelligent.service.ts — injectable form service
- src/provide-form.ts — providers and inject helpers
- src/form-intelligent-form.directive.ts — form directive
- src/form-intelligent-field.directive.ts — field directive
- src/form-intelligent-handle.ts — handle wrapper
- src/select-form-state.ts — signal selectors
- src/tokens.ts — injection tokens
- src/types.ts — public adapter types

Dependency direction: `@jayoncode/form-intelligence` → adapter → `index.ts`.
