# Package Name — Folder Architecture

`@jayoncode/package-name` follows the standard JOC package layout from `templates/package-template/`.

- `src/core/` — main implementation units (add as the domain grows)
- `src/types/` — public and internal TypeScript types
- `src/utils/` — focused helpers
- `src/constants/` — stable literals
- `src/errors/` — package-specific errors
- `src/plugins/` — optional extension points
- `src/index.ts` — public export surface
- `src/package-name.ts` — primary module entry for the scaffold

Dependency direction should stay inward: utils/types/errors → core → index.

Update this note when the real domain modules land.
