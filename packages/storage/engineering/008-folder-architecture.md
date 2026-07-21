# Storage — Folder Architecture

`@jayoncode/storage` layout:

- `src/adapters/` — memory + web Storage adapters
- `src/core/` — `createStorage`, envelopes, TTL helpers
- `src/types/` — public TypeScript contracts
- `src/errors/` — typed error hierarchy
- `src/index.ts` — public export surface

Dependency direction: `types` / `errors` → `adapters` / `core` → `index`.

No plugins or shared JOC runtime in v1.
