# Object Diff — Folder Architecture

`@jayoncode/object-diff` uses a modular engine layout:

- `src/core/` — options normalization and orchestration
- `src/compare/traversal/` — recursive walkers
- `src/compare/comparison/` — value equality
- `src/compare/difference/` — change records
- `src/patch/` — patch generation and application
- `src/serialize/` — output formatting
- `src/types/` — public and internal types
- `src/errors/` — typed error hierarchy
- `src/utils/` — shared helpers

Dependency direction: `utils` → `types/errors` → `compare` → `patch` → `serialize` → `index`.
