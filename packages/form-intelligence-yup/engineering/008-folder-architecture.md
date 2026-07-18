# Form Intelligence Yup — Folder Architecture

`@jayoncode/form-intelligence-yup` bridges Yup schemas into `@jayoncode/form-intelligence`.

Part of the Form Intelligence ecosystem — see `../form-intelligence/engineering/001-ecosystem-architecture.md`.

- `src/yup-adapter.ts` — `yupAdapter()` implementation

Dependency direction: `@jayoncode/form-intelligence` → adapter → `index.ts`.
