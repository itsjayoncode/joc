# JOC ENGINEERING TASK
# Phase 4.1.5 — Public API Design
# Package: @jayoncode/object-diff

==================================================
ROLE
==================================================

You are acting as a Principal API Designer, TypeScript Library Architect, Product Designer, and Open Source Maintainer.

You are NOT implementing @jayoncode/object-diff.

You are designing the complete public API.

The API you design today becomes the permanent contract with users.

Assume this package will be maintained for 10+ years.

Think like the maintainers of:

- Zod
- TanStack
- Immer
- VueUse

Optimize for developers, not implementation convenience.

==================================================
DEPENDENCIES
==================================================

Requires

✓ Phase 4.1.1 — Product Vision & Problem Research

✓ Phase 4.1.3 — Competitive Analysis

✓ Phase 4.1.4 — Architecture

==================================================
OBJECTIVE
==================================================

Design the complete public API for @jayoncode/object-diff.

Do NOT implement anything.

Produce engineering documentation detailed enough that another engineer could implement without inventing public APIs.

==================================================
OUTPUT
==================================================

packages/

object-diff/

engineering/

004-public-api-design.md

==================================================
SECTION 1 — API PHILOSOPHY
==================================================

Define the API philosophy.

Answer

- Why one package vs many micro-packages?
- How do diff, compare, and patch relate?
- When should developers use each function?
- How do we balance simplicity vs power?

==================================================
SECTION 2 — CORE API
==================================================

Design and fully specify each public function.

--------------------------------------------------

diff(a, b, options?)

Primary API.

Returns structured change records or diff tree.

Document

- Parameters
- Return type
- Options
- Examples
- Edge cases

--------------------------------------------------

compare(a, b, options?)

Equality-oriented API.

Document relationship to diff().

When compare returns false, can diff() explain why?

--------------------------------------------------

hasChanges(a, b, options?)

Fast boolean check.

Document early-exit behavior.

--------------------------------------------------
SECTION 3 — FILTERED DIFF API
==================================================

Design focused helpers inspired by mature libraries.

added(a, b, options?)

removed(a, b, options?)

updated(a, b, options?)

unchanged(a, b, options?)

For each document

- Output shape
- Use cases
- Implementation notes (conceptual only)

==================================================
SECTION 4 — PATCH API
==================================================

Design patch generation and application.

patch(diff, options?)

applyPatch(target, patch, options?)

revertPatch(target, patch, options?)

Document

- Supported patch formats (JSON Patch, merge patch, JOC patch)
- Ordering guarantees
- Error behavior
- Partial application rules

==================================================
SECTION 5 — OPTIONS API
==================================================

Design DiffOptions and CompareOptions.

Include

- maxDepth
- includeUnchanged
- detectMoves
- customComparator
- treatUndefinedAsMissing
- keysFilter
- arrayMoveDetection
- circularReferenceStrategy

Document defaults with rationale.

==================================================
SECTION 6 — TYPES
==================================================

Specify all public types with TSDoc.

DiffRecord

DiffType

DiffResult

DiffTree

Path

Patch

PatchOperation

CompareResult

SerializerOptions

Export strategy — what is public vs internal.

==================================================
SECTION 7 — ERRORS
==================================================

Specify public error types.

Document

- When thrown
- Error properties
- Recovery guidance

==================================================
SECTION 8 — ENTRY POINTS
==================================================

Design package exports.

Main entry

@jayoncode/object-diff

Subpath exports (if any)

@jayoncode/object-diff/patch

@jayoncode/object-diff/serialize

Document tree-shaking implications.

==================================================
SECTION 9 — TYPESCRIPT EXPERIENCE
==================================================

Design for excellent DX.

Generic constraints for compared values

Path inference where feasible

Narrowed diff types by change kind

Document limitations honestly.

==================================================
SECTION 10 — EXAMPLES
==================================================

Provide API examples (documentation only).

Basic diff

Nested object diff

Array changes

Map and Set diff

Generate and apply patch

Revert patch

Custom comparator

==================================================
SECTION 11 — NON-GOALS
==================================================

APIs explicitly excluded from Version 1.

Semantic diff

Schema validation

Three-way merge

CRDT operations

==================================================
SECTION 12 — STABILITY POLICY
==================================================

Define what is stable in 0.x vs 1.0.

Deprecation approach.

Additive changes policy.

==================================================
DOCUMENT QUALITY
==================================================

✓ Complete signatures

✓ Return type examples

✓ Options tables

✓ Usage examples

✓ Comparison to competitor APIs

✓ No implementation code

==================================================
OUTPUT FORMAT
==================================================

Work incrementally.

1. Draft API surface.

2. Generate document.

3. Review for consistency with architecture.

4. Suggest improvements.

Do not write production TypeScript.
