# JOC ENGINEERING TASK
# Phase 5.1.9 — Folder Architecture
# Package: @jayoncode/form-intelligent

===============================================================================
ROLE
===============================================================================

You are acting as a Monorepo Package Structure Architect.

Define the permanent folder layout for `@jayoncode/form-intelligent`.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 5.1.4 — Architecture

===============================================================================
OBJECTIVE
===============================================================================

Produce `packages/form-intelligent/engineering/008-folder-architecture.md`.

===============================================================================
OUTPUT
===============================================================================

packages/form-intelligent/engineering/008-folder-architecture.md

Plus scaffold plan (no implementation yet):

```
packages/form-intelligent/
├── package.json
├── tsconfig.json
├── typedoc.json
├── CHANGELOG.md
├── README.md
├── engineering/
├── docs/
├── examples/
├── tests/
└── src/
    ├── index.ts              # public facade
    ├── core/
    ├── validation/
    ├── submission/
    ├── workflow/
    ├── fields/
    ├── state/
    ├── format/
    ├── plugins/
    ├── adapters/             # interfaces only in core
    ├── types/
    ├── errors/
    └── utils/
```

===============================================================================
MODULE RULES
===============================================================================

- `src/index.ts` is the only public entry (v1)
- No deep imports from consumers
- `adapters/` in core = interfaces + no-op defaults only
- Framework adapters live in `packages/form-intelligent-react`, etc.
- Playground lives in `apps/form-intelligent-playground` (Phase 5.3)

===============================================================================
FILE NAMING
===============================================================================

- kebab-case files
- `*-engine.ts` for engine facades
- `types.ts` per module
- Colocate tests: `tests/unit/validation/`

===============================================================================
EXPORT MAP
===============================================================================

Document `package.json` exports field:

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js"
  }
}
```

Future subpath exports (post-1.0) — document but defer.

===============================================================================
MONOREPO WIRING
===============================================================================

- Root `tsconfig.json` project reference
- `eslint.config.js` package override
- Changesets: publishable when ready
- Replace or supersede stub `packages/forms` — document migration note

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Folder tree matches architecture engines

✓ Adapter separation is physical (separate packages)

✓ Test and docs layout defined

===============================================================================
STOP CONDITION
===============================================================================

STOP after Folder Architecture.

Proceed to Phase 5.1.10 — Development Roadmap.
