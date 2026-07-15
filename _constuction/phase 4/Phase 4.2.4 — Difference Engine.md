# JOC ENGINEERING TASK
# Phase 4.2.4 — Difference Engine
# Package: @jayoncode/object-diff

===============================================================================
ROLE
===============================================================================

You are acting as a Principal TypeScript Engineer, Algorithms Engineer, API Designer, and Test-Driven Development Expert.

You are implementing the Difference Engine — the heart of @jayoncode/object-diff.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.2.1 — Foundation

✓ Phase 4.2.2 — Traversal Engine

✓ Phase 4.2.3 — Comparison Engine

===============================================================================
OBJECTIVE
===============================================================================

Implement the Difference Engine and primary public diff API.

Produce structured change records developers and JOC devtools can consume.

===============================================================================
OUTPUT
===============================================================================

Implement

packages/object-diff/src/compare/difference/

Public API

diff()

hasChanges()

added()

removed()

updated()

unchanged()

compare() if specified in 4.1.5

===============================================================================
IMPLEMENTATION
===============================================================================

----------------------------------
1. Change Detection
----------------------------------

Added — key/path exists in b but not a

Removed — exists in a but not b

Changed — same path, different value

Moved — array element index change (optional)

Unchanged — optional tracking per options

----------------------------------
2. Nested Changes
----------------------------------

Aggregate child changes under parent paths.

Support flat list vs tree modes.

----------------------------------
3. Path Tracking
----------------------------------

Dot notation and segment paths.

Consistent path format across outputs.

----------------------------------
4. Diff Tree
----------------------------------

Hierarchical representation for devtools.

----------------------------------
5. Diff Metadata
----------------------------------

Total changes count

Changes by type

Comparison duration (optional)

Options snapshot

----------------------------------
6. Example Output
----------------------------------

diff(a, b) produces

[
  {
    path: "user.name",
    type: "changed",
    previous: "John",
    current: "Jane"
  }
]

Document all change record fields.

===============================================================================
PUBLIC API
===============================================================================

Implement approved APIs from Phase 4.1.5.

diff(a, b, options?)

hasChanges(a, b, options?)

added(a, b, options?)

removed(a, b, options?)

updated(a, b, options?)

unchanged(a, b, options?)

Export from package index.

===============================================================================
ARCHITECTURE RULES
===============================================================================

Difference Engine orchestrates traversal + comparison.

Difference Engine does NOT apply patches.

Difference Engine does NOT serialize to markdown/HTML.

===============================================================================
TESTING
===============================================================================

✓ Added keys

✓ Removed keys

✓ Changed values

✓ Nested objects

✓ Arrays

✓ Map / Set

✓ Empty objects

✓ Identical objects (no changes)

✓ hasChanges fast path

✓ moved detection (if enabled)

Coverage target: 100%

===============================================================================
EXAMPLES
===============================================================================

packages/object-diff/examples/

basic-diff.ts

nested-diff.ts

array-changes.ts

===============================================================================
DOCUMENTATION
===============================================================================

packages/object-diff/docs/diff.md

packages/object-diff/engineering/010-difference-engine.md

Update README with diff() usage.

===============================================================================
QUALITY REQUIREMENTS
===============================================================================

✓ Strict TypeScript

✓ Deterministic output order

✓ Zero runtime dependencies

✓ TSDoc on all public functions

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ diff() works end-to-end

✓ Filtered helpers work

✓ Diff tree and flat modes work

✓ Tests pass

✓ Examples compile

✓ README updated

This is the first npm-publishable milestone.

===============================================================================
STOP CONDITION
===============================================================================

STOP after Difference Engine.

Do NOT implement Patch Engine (4.2.5).
