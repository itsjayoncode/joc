# Form Intelligent Zod — Folder Architecture

`@jayoncode/form-intelligent-zod` bridges Zod schemas into `@jayoncode/form-intelligent`.

Part of the Form Intelligent ecosystem — see `../form-intelligent/engineering/001-ecosystem-architecture.md`.

- `src/zod-adapter.ts` — `zodAdapter()` implementation

Dependency direction: `@jayoncode/form-intelligent` → adapter → `index.ts`.
