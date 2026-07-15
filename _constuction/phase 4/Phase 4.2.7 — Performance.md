# JOC ENGINEERING TASK
# Phase 4.2.7 — Performance
# Package: @jayoncode/object-diff

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Performance Engineer, TypeScript Engineer, and Software Architect.

You are optimizing @jayoncode/object-diff for production workloads.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.2.4 — Difference Engine

✓ Phase 4.2.5 — Patch Engine

✓ Phase 4.2.6 — Serializer

===============================================================================
OBJECTIVE
===============================================================================

Optimize comparison and diffing for real-world performance.

Establish benchmarks and regression gates.

Do NOT change public API semantics without documentation.

===============================================================================
OUTPUT
===============================================================================

Implement optimizations in

compare/

patch/

utils/

tests/benchmarks/

engineering/013-performance.md

===============================================================================
OPTIMIZATION TARGETS
===============================================================================

----------------------------------
1. Large Objects
----------------------------------

Efficient handling of wide objects (many keys).

----------------------------------
2. Deep Trees
----------------------------------

Avoid stack overflow.

Iterative traversal where beneficial.

----------------------------------
3. Circular References
----------------------------------

O(1) seen-set lookups.

WeakMap-based tracking.

----------------------------------
4. Caching
----------------------------------

Optional structural cache for repeated comparisons.

Document cache invalidation.

----------------------------------
5. Structural Sharing
----------------------------------

Reuse unchanged subtrees in diff output when possible.

----------------------------------
6. Fast Path
----------------------------------

Reference equality short-circuit.

Primitive quick exit.

hasChanges() early termination.

----------------------------------
7. Early Exit
----------------------------------

Stop traversal when only boolean result needed.

===============================================================================
BENCHMARKS
===============================================================================

Create benchmark suite.

Fixtures

small-flat (100 keys)

deep-nested (50 levels)

large-array (10k items)

mixed-types

circular

Compare against (local baseline, not CI network)

fast-deep-equal

microdiff (if applicable)

Document results in engineering/013-performance.md.

===============================================================================
MEMORY
===============================================================================

Profile allocation hotspots.

Reduce unnecessary object creation in hot paths.

===============================================================================
TESTING
===============================================================================

✓ Benchmarks run in CI (informational or gated)

✓ No correctness regressions

✓ Performance regression threshold documented

===============================================================================
DOCUMENTATION
===============================================================================

Document performance characteristics in README.

Document options that affect performance.

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Benchmarks exist

✓ Measurable improvements on target fixtures

✓ No API breaking changes

✓ All tests still pass

===============================================================================
STOP CONDITION
===============================================================================

STOP after performance milestone.

Proceed to Testing (4.2.8).
