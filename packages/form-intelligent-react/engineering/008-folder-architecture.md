# Form Intelligence React — Folder Architecture

`@jayoncode/form-intelligent-react` is a thin React adapter over `@jayoncode/form-intelligent`.

Part of the Form Intelligent ecosystem — see `../form-intelligent/engineering/001-ecosystem-architecture.md`.

- `src/useForm.ts` — stable instance + binding helpers
- `src/useFormState.ts` — selector-based subscriptions
- `src/types.ts` — public adapter types

Dependency direction: `@jayoncode/form-intelligent` → adapter → `index.ts`.
