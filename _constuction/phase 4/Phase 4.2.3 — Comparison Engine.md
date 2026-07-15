# JOC ENGINEERING TASK
# Phase 4.2.3 — Comparison Engine
# Package: @jayoncode/object-diff

===============================================================================
ROLE
===============================================================================

You are acting as a Principal TypeScript Engineer, Algorithms Engineer, Software Architect, and Test-Driven Development Expert.

You are implementing the Comparison Engine for @jayoncode/object-diff.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.2.1 — Foundation

✓ Phase 4.2.2 — Traversal Engine

===============================================================================
OBJECTIVE
===============================================================================

Implement type-specific comparators.

Determine whether two values at a path are equal, unequal, or incomparable.

Feed results to the Difference Engine.

Do NOT build final diff trees yet (that is 4.2.4).

===============================================================================
OUTPUT
===============================================================================

Implement

packages/object-diff/src/compare/comparison/

===============================================================================
IMPLEMENTATION
===============================================================================

----------------------------------
1. Primitive Comparison
----------------------------------

string, number, boolean, bigint, symbol, null, undefined

Handle NaN semantics explicitly.

----------------------------------
2. Object Comparison
----------------------------------

Plain objects.

Key presence comparison.

Prototype considerations.

----------------------------------
3. Array Comparison
----------------------------------

Index-by-index comparison.

Length changes detected.

----------------------------------
4. Map Comparison
----------------------------------

Entry comparison.

Key equality semantics.

----------------------------------
5. Set Comparison
----------------------------------

Membership comparison.

Ordering-independent equality.

----------------------------------
6. Date Comparison
----------------------------------

Time value comparison.

Invalid date handling.

----------------------------------
7. RegExp Comparison
----------------------------------

source, flags comparison.

----------------------------------
8. Function Comparison
----------------------------------

Reference equality (document policy).

----------------------------------
9. TypedArray Comparison
----------------------------------

Byte-level or element-wise comparison.

ArrayBuffer / DataView handling.

----------------------------------
10. Custom Comparator
----------------------------------

Hook via options.

Document invocation contract.

Return values: equal | not-equal | skip-default

===============================================================================
COMPARE API (INTERNAL)
===============================================================================

compareValues(a, b, context): ComparisonResult

compare() public API may delegate here later.

===============================================================================
ARCHITECTURE RULES
===============================================================================

Comparison uses traversal for structure.

Comparison does NOT format output.

Comparison does NOT apply patches.

===============================================================================
TESTING
===============================================================================

✓ Every supported type

✓ Cross-type inequality

✓ Custom comparator

✓ Edge cases per type

✓ NaN, +0/-0 if applicable

Coverage target: 100%

===============================================================================
DOCUMENTATION
===============================================================================

packages/object-diff/engineering/009-comparison-engine.md

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ All comparators implemented

✓ Custom comparator supported

✓ Tests pass

✓ No diff tree assembly yet

===============================================================================
STOP CONDITION
===============================================================================

STOP after Comparison Engine.

Do NOT implement Difference Engine (4.2.4).
