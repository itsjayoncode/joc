# JOC ENGINEERING TASK
# Phase 4.3.5 — JSON Viewer
# Application: Object Diff Playground

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Engineer, UI Component Designer, and Developer Experience Engineer.

You are implementing a reusable JSON Viewer for the Object Diff Playground.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.3.1 — Playground Foundation

===============================================================================
OBJECTIVE
===============================================================================

Build a high-quality JSON/object tree viewer used by Diff Explorer, Patch Explorer, and Dashboard.

===============================================================================
OUTPUT
===============================================================================

Implement

src/components/json-viewer/

src/features/json-viewer/

===============================================================================
IMPLEMENTATION
===============================================================================

Tree view

Expand / collapse nodes

Search within tree

Syntax highlighting (keys, strings, numbers, booleans, null)

Copy path to clipboard

Copy value to clipboard

Line numbers (optional)

Handle large trees with virtualization if needed

Invalid JSON error display

Read-only and editable modes (editable for Diff Explorer inputs)

===============================================================================
REUSABILITY
===============================================================================

This component becomes shared infrastructure across playground pages.

Document component API.

===============================================================================
ACCESSIBILITY
===============================================================================

Keyboard navigation

ARIA roles for tree

Sufficient color contrast in light/dark themes

===============================================================================
DOCUMENTATION
===============================================================================

docs/json-viewer.md

engineering/018-json-viewer.md

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Tree viewer works for nested objects

✓ Search works

✓ Copy path works

✓ Integrated into Diff Explorer panels

✓ Accessible and themed

===============================================================================
STOP CONDITION
===============================================================================

STOP after JSON Viewer.
