# Form Intelligence Zod — Folder Architecture

`@jayoncode/form-intelligence-zod` bridges Zod schemas into `@jayoncode/form-intelligence`.

Part of the Form Intelligence ecosystem — see `../form-intelligence/engineering/001-ecosystem-architecture.md`.

- `src/zod-adapter.ts` — `zodAdapter()` implementation

Dependency direction: `@jayoncode/form-intelligence` → adapter → `index.ts`.
