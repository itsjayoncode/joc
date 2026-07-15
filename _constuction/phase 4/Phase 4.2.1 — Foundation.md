# JOC ENGINEERING TASK
# Phase 4.2.1 — Foundation
# Package: @jayoncode/object-diff

===============================================================================
ROLE
===============================================================================

You are acting as a Principal TypeScript Engineer, Software Architect, Open Source Maintainer, Library Infrastructure Engineer, and Test-Driven Development Expert.

You are implementing the @jayoncode/object-diff package foundation.

This is NOT a design task.

This is a production implementation task.

The engineering documentation created during Phase 4.1 is frozen and is the source of truth.

Do NOT redesign the architecture.

Do NOT invent new public APIs.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.1.1 — Product Vision

✓ Phase 4.1.4 — Architecture

✓ Phase 4.1.5 — Public API Design

✓ Phase 4.1.6 — Folder Architecture

Review all engineering documents before implementation.

===============================================================================
OBJECTIVE
===============================================================================

Implement the package foundation.

No comparison logic yet.

No traversal logic yet.

Only the infrastructure every engine will depend on.

===============================================================================
OUTPUT
===============================================================================

Implement

packages/object-diff/src/

core/

types/

errors/

utils/

===============================================================================
IMPLEMENTATION
===============================================================================

----------------------------------
1. Configuration
----------------------------------

Implement options normalization.

DiffOptions

CompareOptions

PatchOptions

Defaults documented in engineering docs.

Validate invalid option combinations.

----------------------------------
2. Types
----------------------------------

Implement foundational types.

DiffType

Path

DiffRecord (skeleton)

DiffResult (skeleton)

Patch (skeleton)

Internal traversal context types

----------------------------------
3. Utilities
----------------------------------

Implement internal helpers.

Type guards (isPlainObject, isMap, isSet, etc.)

Path join/split

normalizeValue (if needed)

Feature detection helpers

----------------------------------
4. Errors
----------------------------------

Implement typed error hierarchy.

CircularReferenceError

MaxDepthExceededError

InvalidPatchError

PatchApplyError

UnsupportedTypeError

Each error includes useful diagnostic properties.

----------------------------------
5. Feature Detection
----------------------------------

Detect environment capabilities.

Map / Set / TypedArray availability

Safe structured clone availability (if used)

No DOM access.

----------------------------------
6. Internal Helpers
----------------------------------

Shared constants.

Dev-only assertions (stripped in production if applicable).

Option merging utilities.

===============================================================================
ARCHITECTURE RULES
===============================================================================

Foundation must have zero dependencies on compare/, patch/, or serialize/.

utils/ must not import from compare/.

types/ and errors/ are dependency leaves.

===============================================================================
PUBLIC API
===============================================================================

Export only what Phase 4.1.5 approved for foundation.

Likely minimal at this stage — types and errors may be exported.

Do NOT export traversal or diff functions yet.

===============================================================================
TESTING
===============================================================================

Create unit tests.

✓ Options normalization

✓ Type guards

✓ Path utilities

✓ Error construction

✓ Feature detection

Coverage target: 100% for foundation modules.

===============================================================================
DOCUMENTATION
===============================================================================

Update

packages/object-diff/README.md (bootstrap section)

packages/object-diff/engineering/007-foundation.md

===============================================================================
QUALITY REQUIREMENTS
===============================================================================

✓ Strict TypeScript

✓ No any

✓ ESLint clean

✓ Prettier clean

✓ Tree-shakeable

✓ Side-effect free

✓ TSDoc on public exports

✓ Zero runtime dependencies

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Folder structure matches 4.1.6

✓ Types defined

✓ Errors implemented

✓ Utilities implemented

✓ Options system implemented

✓ Tests pass

✓ Documentation updated

✓ No comparison or diff logic exists yet

===============================================================================
STOP CONDITION
===============================================================================

When foundation is complete, STOP.

Do NOT implement Traversal Engine (4.2.2).
