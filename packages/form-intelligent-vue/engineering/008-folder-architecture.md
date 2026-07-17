# Form Intelligent Vue — Folder Architecture

`@jayoncode/form-intelligent-vue` is a thin Vue adapter over `@jayoncode/form-intelligent`.

Part of the Form Intelligent ecosystem — see `../form-intelligent/engineering/001-ecosystem-architecture.md`.

- src/useForm.ts — composable form instance + bindings
- src/useFormState.ts — selector-based subscriptions
- src/useField.ts — field-level composable
- src/provideForm.ts — provide/inject helpers
- src/keys.ts — injection keys
- src/types.ts — public adapter types

Dependency direction: `@jayoncode/form-intelligent` → adapter → `index.ts`.
