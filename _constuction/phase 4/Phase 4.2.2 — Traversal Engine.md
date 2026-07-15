# JOC ENGINEERING TASK
# Phase 4.2.2 — Traversal Engine
# Package: @jayoncode/object-diff

===============================================================================
ROLE
===============================================================================

You are acting as a Principal TypeScript Engineer, Algorithms Engineer, Software Architect, and Test-Driven Development Expert.

You are implementing the Traversal Engine for @jayoncode/object-diff.

This is a production implementation task.

Engineering documentation from Phase 4.1 is the source of truth.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.2.1 — Foundation

===============================================================================
OBJECTIVE
===============================================================================

Implement the Traversal Engine.

Walk structured values recursively.

Detect circular references.

Enforce depth limits.

Accumulate paths for downstream engines.

Do NOT implement final diff output yet.

===============================================================================
OUTPUT
===============================================================================

Implement

packages/object-diff/src/compare/traversal/

===============================================================================
IMPLEMENTATION
===============================================================================

----------------------------------
1. Object Walker
----------------------------------

Traverse plain objects.

Respect own-property enumeration policy.

Handle null prototype objects.

----------------------------------
2. Array Walker
----------------------------------

Traverse arrays and array-like values.

Document sparse array behavior.

----------------------------------
3. Map Walker
----------------------------------

Traverse Map entries.

Define key ordering semantics.

----------------------------------
4. Set Walker
----------------------------------

Traverse Set values.

Define ordering semantics.

----------------------------------
5. Recursive Traversal
----------------------------------

Unified traversal coordinator.

Dispatch by value type.

Support visiting two values in parallel (for diff).

----------------------------------
6. Circular Reference Detection
----------------------------------

Track seen objects.

Throw CircularReferenceError or record circular paths per options.

----------------------------------
7. Depth Limiting
----------------------------------

Enforce maxDepth.

Throw MaxDepthExceededError when exceeded.

----------------------------------
8. Path Tracking
----------------------------------

Accumulate path segments.

Support string and segment paths.

Expose traversal context to comparison engine.

===============================================================================
TRAVERSAL API (INTERNAL)
===============================================================================

Design internal-only APIs.

Examples

walk(value, visitor, context)

walkPair(a, b, visitor, context)

Do NOT expose traversal in public API unless approved.

===============================================================================
ARCHITECTURE RULES
===============================================================================

Traversal depends on foundation only.

Traversal must NOT build diff records.

Traversal must NOT serialize.

Comparison engine will consume traversal output.

===============================================================================
TESTING
===============================================================================

✓ Flat objects

✓ Deep nesting

✓ Arrays

✓ Map and Set

✓ Circular references

✓ Depth limit enforcement

✓ Path accumulation

✓ Mixed type graphs

Coverage target: 100%

===============================================================================
DOCUMENTATION
===============================================================================

packages/object-diff/engineering/008-traversal-engine.md

Document traversal order and edge case decisions.

===============================================================================
QUALITY REQUIREMENTS
===============================================================================

✓ Strict TypeScript

✓ No any

✓ Zero runtime dependencies

✓ SSR-safe

✓ Performance-conscious (avoid unnecessary allocations)

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ All walkers implemented

✓ Circular detection works

✓ Depth limiting works

✓ Path tracking works

✓ Tests pass

✓ No diff/comparison results produced yet

===============================================================================
STOP CONDITION
===============================================================================

STOP after Traversal Engine.

Do NOT implement Comparison Engine (4.2.3).
