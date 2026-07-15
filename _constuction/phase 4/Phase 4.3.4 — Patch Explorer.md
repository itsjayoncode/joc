# JOC ENGINEERING TASK
# Phase 4.3.4 — Patch Explorer
# Application: Object Diff Playground

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Engineer, TypeScript Engineer, and API Tooling Designer.

You are implementing the Patch Explorer for the Object Diff Playground.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.3.3 — Diff Explorer

✓ Phase 4.2.5 — Patch Engine

===============================================================================
OBJECTIVE
===============================================================================

Visualize generated patches.

Apply, revert, and replay patches interactively.

===============================================================================
OUTPUT
===============================================================================

Implement

src/pages/PatchPage.tsx

src/features/patch-explorer/

===============================================================================
IMPLEMENTATION
===============================================================================

----------------------------------
1. Generated Patch View
----------------------------------

Display patch from current diff.

Support JSON Patch and JOC patch formats.

Syntax-highlighted JSON.

----------------------------------
2. Apply
----------------------------------

Apply patch to Object A or a copy.

Show resulting object.

Highlight applied changes.

----------------------------------
3. Revert
----------------------------------

Revert applied patch.

Verify restoration via compare().

----------------------------------
4. Replay
----------------------------------

Step through patch operations one at a time.

Useful for debugging and education.

----------------------------------
5. Error Handling
----------------------------------

Display InvalidPatchError / PatchApplyError clearly.

===============================================================================
INTEGRATION
===============================================================================

Uses

patch()

applyPatch()

revertPatch()

from @jayoncode/object-diff.

===============================================================================
DOCUMENTATION
===============================================================================

docs/patch-explorer.md

engineering/017-patch-explorer.md

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Patch generation from diff works

✓ Apply and revert work in UI

✓ Replay mode works

✓ Error states handled

===============================================================================
STOP CONDITION
===============================================================================

STOP after Patch Explorer.
