# Form Intelligent Angular — Folder Architecture

`@jayoncode/form-intelligent-angular` is a thin Angular adapter over `@jayoncode/form-intelligent`.

Part of the Form Intelligent ecosystem — see `../form-intelligent/engineering/001-ecosystem-architecture.md`.

- src/form-intelligent.service.ts — injectable form service
- src/provide-form.ts — providers and inject helpers
- src/form-intelligent-form.directive.ts — form directive
- src/form-intelligent-field.directive.ts — field directive
- src/form-intelligent-handle.ts — handle wrapper
- src/select-form-state.ts — signal selectors
- src/tokens.ts — injection tokens
- src/types.ts — public adapter types

Dependency direction: `@jayoncode/form-intelligent` → adapter → `index.ts`.
