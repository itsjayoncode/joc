# JOC ENGINEERING TASK
# Phase 4.3.3 — Diff Explorer
# Application: Object Diff Playground

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Engineer, TypeScript Engineer, Developer Experience Engineer, and Visual Diff Designer.

You are implementing the Diff Explorer — the flagship page of the Object Diff Playground.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.3.1 — Playground Foundation

✓ Phase 4.3.2 — Dashboard

✓ Phase 4.2.4 — Difference Engine

✓ Phase 4.2.6 — Serializer (for export formats)

===============================================================================
OBJECTIVE
===============================================================================

Implement an interactive comparison workspace.

Object A → Compare → Object B → Explore changes

Everything displayed must come from @jayoncode/object-diff.

Do not mock diff output.

===============================================================================
OUTPUT
===============================================================================

Implement

src/pages/DiffPage.tsx

src/features/diff-explorer/

===============================================================================
IMPLEMENTATION
===============================================================================

----------------------------------
1. Comparison Workspace
----------------------------------

Two editable JSON/object panels

Object A input

Object B input

Compare button

Live parse error handling

----------------------------------
2. Tree View ⭐
----------------------------------

Hierarchical diff tree

Expand/collapse nodes

Color-coded change types (added, removed, changed)

----------------------------------
3. Table View
----------------------------------

Flat change list

Columns: path, type, previous, current

Sortable and filterable

----------------------------------
4. Timeline View
----------------------------------

Optional chronological change list if metadata supports it.

----------------------------------
5. Grouped Changes
----------------------------------

Group by type (added / removed / changed)

Group by top-level key

----------------------------------
6. Search
----------------------------------

Filter changes by path or value.

----------------------------------
7. Filters
----------------------------------

Show/hide change types

Include/exclude unchanged (if supported)

----------------------------------
8. Export
----------------------------------

Copy as JSON, Markdown, HTML using serializer.

===============================================================================
UX REQUIREMENTS
===============================================================================

Keyboard accessible

Responsive split-pane layout

Clear error states for invalid JSON

Sample presets (user object, config, array)

===============================================================================
DOCUMENTATION
===============================================================================

docs/diff-explorer.md

engineering/016-diff-explorer.md

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Interactive compare works end-to-end

✓ Tree and table views implemented

✓ Search and filters work

✓ Export works

✓ Uses real object-diff APIs only

===============================================================================
STOP CONDITION
===============================================================================

STOP after Diff Explorer.

Do NOT build Patch Explorer (4.3.4).
