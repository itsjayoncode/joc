# Form Intelligent Yup — Folder Architecture

`@jayoncode/form-intelligent-yup` bridges Yup schemas into `@jayoncode/form-intelligent`.

Part of the Form Intelligent ecosystem — see `../form-intelligent/engineering/001-ecosystem-architecture.md`.

- `src/yup-adapter.ts` — `yupAdapter()` implementation

Dependency direction: `@jayoncode/form-intelligent` → adapter → `index.ts`.
