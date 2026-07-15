# JOC ENGINEERING TASK
# Phase 4.2.8 — Testing
# Package: @jayoncode/object-diff

===============================================================================
ROLE
===============================================================================

You are acting as a Principal QA Engineer, TypeScript Engineer, and Test Architect.

You are hardening the test suite for @jayoncode/object-diff.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.2.1 through 4.2.7 complete

===============================================================================
OBJECTIVE
===============================================================================

Achieve comprehensive test coverage and confidence for Version 1 core engine.

Fill gaps. Add edge cases. Add integration and benchmark tests.

===============================================================================
OUTPUT
===============================================================================

Expand

packages/object-diff/tests/

engineering/014-testing.md

===============================================================================
TEST CATEGORIES
===============================================================================

----------------------------------
1. Unit Tests
----------------------------------

Every module, every public function.

----------------------------------
2. Edge Cases
----------------------------------

null, undefined, empty containers

prototype chains

sparse arrays

Date invalid

RegExp edge cases

functions as values

symbols as keys

----------------------------------
3. Circular References
----------------------------------

Self-reference

Mutual reference

Deep circular graphs

----------------------------------
4. Large Objects
----------------------------------

Smoke tests for 10k+ nodes (reasonable CI time).

----------------------------------
5. Performance Benchmarks
----------------------------------

From 4.2.7 — ensure CI runs them.

----------------------------------
6. Memory Tests
----------------------------------

Detect obvious leaks in repeated diff loops (where feasible).

----------------------------------
7. Coverage
----------------------------------

Target 95%+ lines for core engines.

100% for public API surface.

===============================================================================
INTEGRATION TESTS
===============================================================================

End-to-end scenarios

diff → patch → applyPatch → compare equal

diff → revertPatch → restore original

serialize all formats without throw

===============================================================================
FIXTURES
===============================================================================

Create reusable fixtures/

real-world-config.json

nested-user.json

circular.json

===============================================================================
CI INTEGRATION
===============================================================================

Ensure package tests run in root pnpm test.

Ensure tsconfig.tests.json includes object-diff tests.

===============================================================================
DOCUMENTATION
===============================================================================

Document testing philosophy in engineering/014-testing.md.

Document how to run benchmarks locally.

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Coverage targets met

✓ All edge case categories covered

✓ Integration tests pass

✓ CI green

✓ Core engine ready for playground integration

===============================================================================
STOP CONDITION
===============================================================================

STOP after testing milestone.

Core Engine (Phase 4.2) is complete.

Begin Developer Experience (Phase 4.3).
