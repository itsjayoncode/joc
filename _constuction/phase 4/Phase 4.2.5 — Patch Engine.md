# JOC ENGINEERING TASK
# Phase 4.2.5 — Patch Engine
# Package: @jayoncode/object-diff

===============================================================================
ROLE
===============================================================================

You are acting as a Principal TypeScript Engineer, Algorithms Engineer, API Designer, and Test-Driven Development Expert.

You are implementing the Patch Engine for @jayoncode/object-diff.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.2.4 — Difference Engine

===============================================================================
OBJECTIVE
===============================================================================

Generate patches from diffs.

Apply, revert, merge, and rollback patches.

Support industry-standard and JOC-native patch formats.

===============================================================================
OUTPUT
===============================================================================

Implement

packages/object-diff/src/patch/

Public API

patch()

applyPatch()

revertPatch()

merge() (if approved)

rollback() (if approved)

===============================================================================
IMPLEMENTATION
===============================================================================

----------------------------------
1. Patch Generation
----------------------------------

Generate from diff tree or flat diff.

Formats

JSON Patch (RFC 6902)

Minimal patch (smallest operation set)

Merge Patch (RFC 7396)

Custom JOC patch format (document schema)

----------------------------------
2. applyPatch()
----------------------------------

Apply patch to a target object immutably or mutably per options.

Validate operations before apply.

Throw InvalidPatchError / PatchApplyError on failure.

----------------------------------
3. revertPatch()
----------------------------------

Reverse a previously applied patch.

Document requirements for reversible patches.

----------------------------------
4. merge()
----------------------------------

Merge patch into target per merge semantics.

----------------------------------
5. rollback()
----------------------------------

Restore previous state given patch history (if in scope).

===============================================================================
PATCH OPERATIONS
===============================================================================

Document supported operations.

add, remove, replace, move, copy, test (JSON Patch)

merge patch replace semantics

Ordering and atomicity rules.

===============================================================================
ARCHITECTURE RULES
===============================================================================

Patch Engine consumes diff output.

Patch Engine does NOT perform traversal for diffing (only for apply).

Serialize formats are NOT part of this milestone.

===============================================================================
TESTING
===============================================================================

✓ Generate patch from diff

✓ Apply patch round-trip

✓ Revert patch round-trip

✓ Invalid patch rejection

✓ Nested path operations

✓ Array operations

✓ JSON Patch compliance tests (fixture-based)

Coverage target: 100%

===============================================================================
EXAMPLES
===============================================================================

generate-and-apply.ts

revert-patch.ts

json-patch.ts

===============================================================================
DOCUMENTATION
===============================================================================

packages/object-diff/docs/patch.md

packages/object-diff/engineering/011-patch-engine.md

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ patch() implemented

✓ applyPatch() implemented

✓ revertPatch() implemented

✓ JSON Patch support documented and tested

✓ Tests pass

✓ Examples compile

===============================================================================
STOP CONDITION
===============================================================================

STOP after Patch Engine.

Do NOT implement Serializer (4.2.6).
