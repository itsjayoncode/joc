# JOC ENGINEERING TASK
# Phase 4.1.6 — Package Folder Architecture
# Package: @jayoncode/object-diff

==================================================
ROLE
==================================================

You are acting as a Principal Software Architect, TypeScript Library Architect, Clean Architecture Engineer, and Technical Writer.

You are NOT implementing @jayoncode/object-diff.

You are designing the internal package folder architecture.

This blueprint will guide every future contributor.

Think like the maintainers of:

- Vite
- TanStack
- Zod
- Floating UI

==================================================
DEPENDENCIES
==================================================

Requires

✓ Phase 4.1.4 — Architecture

✓ Phase 4.1.5 — Public API Design

==================================================
OBJECTIVE
==================================================

Design the complete folder architecture for @jayoncode/object-diff.

Explain every folder, responsibility, dependency direction, and architectural rule.

Do NOT generate implementation code.

Do NOT create placeholder source files.

==================================================
OUTPUT
==================================================

packages/

object-diff/

engineering/

005-folder-architecture.md

==================================================
TARGET STRUCTURE
==================================================

Design and document

packages/object-diff/

src/
  core/
  compare/
  patch/
  serialize/
  utils/
  types/
  errors/
  index.ts

tests/

examples/

docs/

engineering/

==================================================
src/core/
==================================================

Purpose

Shared orchestration and configuration.

Likely contents

- diff orchestrator
- options normalization
- feature detection
- internal helpers

Rules

- May import from compare, utils, types, errors
- Must NOT import from serialize (optional dependency direction)

==================================================
src/compare/
==================================================

Purpose

Comparison and difference engines.

Likely contents

- traversal/
  - object-walker
  - array-walker
  - map-walker
  - set-walker
  - circular-detection
- comparison/
  - primitive
  - object
  - array
  - map
  - set
  - date
  - regexp
  - function
  - typed-array
  - custom-comparator
- difference/
  - added
  - removed
  - changed
  - moved
  - unchanged
  - path-tracker
  - diff-tree

Rules

- compare/ must not depend on serialize/
- compare/ may depend on utils/ and types/

==================================================
src/patch/
==================================================

Purpose

Patch generation and application.

Likely contents

- generate-json-patch
- generate-merge-patch
- generate-minimal-patch
- apply-patch
- revert-patch
- merge
- rollback

Rules

- patch/ depends on compare/ output types
- patch/ must not depend on serialize/

==================================================
src/serialize/
==================================================

Purpose

Output formatting for devtools and documentation.

Likely contents

- json
- pretty-json
- compact
- tree
- table
- markdown
- html

Rules

- serialize/ is a leaf consumer of diff and patch types
- Must be tree-shakeable per format

==================================================
src/utils/
==================================================

Purpose

Shared low-level helpers.

Likely contents

- path utils
- type guards
- normalization
- fast-path helpers

Rules

- utils/ must not import from compare/ or patch/
- utils/ is the lowest internal layer

==================================================
src/types/
==================================================

Purpose

Public and internal type definitions.

Organize

- public types (re-exported)
- internal types (not exported)

==================================================
src/errors/
==================================================

Purpose

Typed error hierarchy.

==================================================
src/index.ts
==================================================

Purpose

Public API facade.

Rules

- Thin re-exports only
- No business logic in index

==================================================
tests/
==================================================

Mirror src/ structure.

tests/unit/

tests/integration/

tests/benchmarks/

tests/fixtures/

Document naming conventions.

==================================================
examples/
==================================================

Purpose

Runnable examples for docs and CI.

examples/vanilla/

examples/node/

Document that framework examples live in playground phase.

==================================================
docs/
==================================================

Package-level documentation source.

Synced to apps/docs via documentation pipeline.

==================================================
engineering/
==================================================

Permanent engineering documents from Phase 4.1.

==================================================
PACKAGE METADATA
==================================================

Document package.json exports map.

Document build outputs (ESM, CJS if applicable).

Document types entry.

==================================================
DEPENDENCY GRAPH
==================================================

Create a diagram

utils → types → errors
↓
compare → patch
↓
serialize
↓
index (public API)

==================================================
FILE NAMING CONVENTIONS
==================================================

Define conventions

- kebab-case files
- one export per file vs barrel files
- test file naming (*.test.ts)
- colocated types policy

==================================================
IMPORT RULES
==================================================

Define eslint-boundary rules conceptually.

No circular imports.

No deep imports from outside package.

Public consumers use package entry only.

==================================================
SCALABILITY
==================================================

Explain how folders accommodate Phase 4.4 features later.

semantic/

schema/

merge/

Without restructuring core engines.

==================================================
DOCUMENT QUALITY
==================================================

✓ Every folder documented

✓ Dependency rules explicit

✓ Diagrams included

✓ No placeholder files created

==================================================
OUTPUT FORMAT
==================================================

Work incrementally.

1. Explain structure goals.

2. Generate document.

3. Review dependency direction.

4. Suggest improvements.

Do not create source files.
