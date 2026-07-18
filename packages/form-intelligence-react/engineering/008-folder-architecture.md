# Form Intelligence React — Folder Architecture

`@jayoncode/form-intelligence-react` is a thin React adapter over `@jayoncode/form-intelligence`.

Part of the Form Intelligence ecosystem — see `../form-intelligence/engineering/001-ecosystem-architecture.md`.

- `src/useForm.ts` — stable instance + binding helpers
- `src/useFormState.ts` — selector-based subscriptions
- `src/types.ts` — public adapter types

Dependency direction: `@jayoncode/form-intelligence` → adapter → `index.ts`.
