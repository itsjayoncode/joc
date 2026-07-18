# Form Intelligence AJV — Folder Architecture

`@jayoncode/form-intelligence-ajv` bridges AJV schemas into `@jayoncode/form-intelligence`.

Part of the Form Intelligence ecosystem — see `../form-intelligence/engineering/001-ecosystem-architecture.md`.

- `src/ajv-adapter.ts` — `ajvAdapter()` implementation

Dependency direction: `@jayoncode/form-intelligence` → adapter → `index.ts`.
