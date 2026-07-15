# JOC ENGINEERING TASK
# Phase 4.1.4 — Package Architecture
# Package: @jayoncode/object-diff

==================================================
ROLE
==================================================

You are acting as a Principal Software Architect, TypeScript Library Architect, Clean Architecture Engineer, and Open Source Maintainer.

You are NOT implementing @jayoncode/object-diff.

You are designing the permanent internal architecture.

Think like the maintainers of:

- Vite
- TanStack
- Zod
- Immer

Assume this package will be maintained for 10+ years.

==================================================
DEPENDENCIES
==================================================

Requires

✓ Phase 4.1.1 — Product Vision & Problem Research

✓ Phase 4.1.3 — Competitive Analysis

==================================================
OBJECTIVE
==================================================

Design the complete internal architecture for @jayoncode/object-diff.

Define every engine, its responsibility, and dependency direction.

Do NOT generate implementation code.

Do NOT create placeholder source files.

Produce engineering documentation only.

==================================================
OUTPUT
==================================================

packages/

object-diff/

engineering/

003-architecture.md

==================================================
ARCHITECTURE OVERVIEW
==================================================

Design a modular engine architecture.

Core engines

Comparison Engine

Traversal Engine

Difference Engine

Patch Engine

Serializer

Utilities

Document how they interact.

Example flow

diff(a, b)
↓
Traversal Engine (walk both values)
↓
Comparison Engine (evaluate nodes)
↓
Difference Engine (build change records)
↓
Diff Tree + Metadata

patch(diff)
↓
Patch Engine (generate operations)
↓
Serializer (optional export formats)

==================================================
COMPARISON ENGINE
==================================================

Responsibilities

- Primitive comparison
- Type discrimination
- Delegation to type-specific comparators
- Custom comparator hook
- Equality short-circuit

Must NOT

- Build diff trees directly
- Serialize output
- Apply patches

Document inputs, outputs, and extension points.

==================================================
TRAVERSAL ENGINE
==================================================

Responsibilities

- Object walker
- Array walker
- Map walker
- Set walker
- Recursive traversal
- Circular reference detection
- Depth limiting
- Path accumulation

Document traversal order.

Document how traversal cooperates with comparison.

==================================================
DIFFERENCE ENGINE
==================================================

This is the heart of the package.

Responsibilities

- Added detection
- Removed detection
- Changed detection
- Moved detection (arrays)
- Unchanged tracking (optional)
- Nested change aggregation
- Path tracking
- Diff tree construction
- Diff metadata (timestamps, counts, options used)

Example output shape

diff(a, b)
↓
[
  {
    path: "user.name",
    type: "changed",
    previous: "John",
    current: "Jane"
  }
]

Document change record types.

Document diff tree vs flat diff list.

==================================================
PATCH ENGINE
==================================================

Responsibilities

Generate

- JSON Patch (RFC 6902)
- Minimal patch
- Merge Patch (RFC 7396)
- Custom JOC patch format

Support

- applyPatch()
- revertPatch()
- merge()
- rollback()

Document relationship between diff tree and patch operations.

Document idempotency and ordering rules.

==================================================
SERIALIZER
==================================================

Responsibilities

Export diffs and patches as

- JSON
- Pretty JSON
- Compact
- Tree view
- Table
- Markdown
- HTML

Serializer must be optional / tree-shakeable.

Core diff logic must not depend on serializers.

==================================================
UTILITIES
==================================================

Responsibilities

- Path parsing and formatting
- Type guards
- Normalization helpers
- Clone helpers (if needed for safe comparison)
- Feature detection

Keep utilities internal unless explicitly public.

==================================================
TYPES LAYER
==================================================

Design the type system.

Core types

- DiffRecord
- DiffType (added | removed | changed | moved | unchanged)
- Path (string | array segments)
- DiffTree
- DiffOptions
- CompareOptions
- Patch
- PatchOperation
- SerializerFormat

Strong typing for paths is a goal — document strategy.

==================================================
ERRORS LAYER
==================================================

Design typed errors.

Examples

- CircularReferenceError
- MaxDepthExceededError
- InvalidPatchError
- PatchApplyError
- UnsupportedTypeError

Document error recovery behavior.

==================================================
CONFIGURATION
==================================================

Design global and per-call options.

Examples

- maxDepth
- includeUnchanged
- detectMoves
- customComparator
- treatUndefinedAsMissing
- dateComparison
- cache toggles

Document defaults and rationale.

==================================================
DEPENDENCY RULES
==================================================

Define strict dependency direction.

Traversal → Comparison → Difference → Patch → Serializer

Rules

- No circular dependencies between engines
- Serializer depends on Difference/Patch, not vice versa
- Public API is a thin facade over engines
- Utilities are leaf dependencies

Include a dependency diagram.

==================================================
ENVIRONMENT SUPPORT
==================================================

Design for

- Browser (modern)
- Node.js 20+
- SSR-safe (no DOM)

No window or document access in core engines.

==================================================
TREE-SHAKING
==================================================

Design entry points.

Examples

@jayoncode/object-diff
@jayoncode/object-diff/compare
@jayoncode/object-diff/patch
@jayoncode/object-diff/serialize

Document what each entry exports.

==================================================
INTEGRATION WITH JOC
==================================================

Document how other packages will consume object-diff.

Browser Lifecycle State Explorer

Configuration Playground

Future state package

Future devtools

Define stable internal contracts for JOC integration.

==================================================
VERSION 1 BOUNDARIES
==================================================

Explicitly document what architecture supports in v1.

Explicitly defer to Phase 4.4

- Semantic comparison
- Schema comparison
- Graph comparison
- AST comparison
- CRDT / OT

==================================================
DOCUMENT QUALITY
==================================================

✓ Dependency diagrams

✓ Data flow diagrams

✓ Engine responsibility tables

✓ Clear boundaries

✓ No implementation code

==================================================
OUTPUT FORMAT
==================================================

Work incrementally.

1. Explain architectural goals.

2. Generate the document.

3. Review for coupling and leaks.

4. Suggest improvements.

Do not generate TypeScript source files.
