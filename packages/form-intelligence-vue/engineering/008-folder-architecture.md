# Form Intelligence Vue — Folder Architecture

`@jayoncode/form-intelligence-vue` is a thin Vue adapter over `@jayoncode/form-intelligence`.

Part of the Form Intelligence ecosystem — see `../form-intelligence/engineering/001-ecosystem-architecture.md`.

- src/useForm.ts — composable form instance + bindings
- src/useFormState.ts — selector-based subscriptions
- src/useField.ts — field-level composable
- src/provideForm.ts — provide/inject helpers
- src/keys.ts — injection keys
- src/types.ts — public adapter types

Dependency direction: `@jayoncode/form-intelligence` → adapter → `index.ts`.
