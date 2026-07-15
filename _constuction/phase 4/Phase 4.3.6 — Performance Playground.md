# JOC ENGINEERING TASK
# Phase 4.3.6 — Performance Playground
# Application: Object Diff Playground

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Engineer, Performance Engineer, and Data Visualization Designer.

You are implementing the Performance Playground page.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.3.1 — Playground Foundation

✓ Phase 4.2.7 — Performance

===============================================================================
OBJECTIVE
===============================================================================

Expose object-diff performance metrics interactively.

Help developers understand comparison cost.

===============================================================================
OUTPUT
===============================================================================

Implement

src/pages/PerformancePage.tsx

src/features/performance/

===============================================================================
IMPLEMENTATION
===============================================================================

Display metrics

Comparison time

Memory usage (where measurable in browser)

Traversal count (if exposed via debug option or internal metrics hook)

Objects / nodes compared

Cache hits (if caching enabled)

Diff count

Benchmark presets

small-flat

deep-nested

large-array

circular

Run comparison on demand

Optional chart of repeated runs

Compare hasChanges() vs full diff() timing

===============================================================================
INTEGRATION
===============================================================================

Use real @jayoncode/object-diff.

Consider a debug/metrics option on DiffOptions if needed — document if public API extension is required.

===============================================================================
DOCUMENTATION
===============================================================================

docs/performance-playground.md

engineering/019-performance-playground.md

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Performance page implemented

✓ Benchmark presets runnable in browser

✓ Metrics displayed clearly

✓ No mocked timings

===============================================================================
STOP CONDITION
===============================================================================

STOP after Performance Playground.
