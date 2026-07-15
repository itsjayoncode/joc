# JOC ENGINEERING TASK
# Phase 4.3.8 — Documentation Integration
# Package: @jayoncode/object-diff

===============================================================================
ROLE
===============================================================================

You are acting as a Documentation Engineer, Technical Writer, and VitePress Platform Engineer.

You are integrating @jayoncode/object-diff documentation into the JOC docs site.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.2 core engine complete

✓ Phase 4.3 playground pages (minimum Diff Explorer)

===============================================================================
OBJECTIVE
===============================================================================

Publish complete package documentation on https://itsjayoncode.github.io/joc/

Mirror the browser-lifecycle documentation integration pattern.

===============================================================================
OUTPUT
===============================================================================

apps/docs/docs/packages/object-diff/

Sync from packages/object-diff/docs/

Sidebar entries in VitePress config

API reference generation (if TypeDoc pipeline exists)

Playground link in docs

===============================================================================
DOCUMENTATION SECTIONS
===============================================================================

index.md — package overview

getting-started.md — install and first diff

api/

diff.md

compare.md

patch.md

serialize.md

guides/

change-types.md

patch-formats.md

performance.md

patterns/

dirty-checking.md

config-sync.md

undo-redo.md

faq/

index.md

recipes/

migration/ (placeholder for future)

===============================================================================
SYNC PIPELINE
===============================================================================

Extend scripts/sync-documentation.mjs to include object-diff.

Follow docs:prepare workflow.

===============================================================================
PLAYGROUND LINK
===============================================================================

Document playground URL.

Bundle playground into docs dist (follow browser-session-playground pattern).

Target: /joc/playground/object-diff/

===============================================================================
BROWSER-LIFECYCLE INTEGRATION DOCS
===============================================================================

Document how browser-session-playground will use object-diff.

State Explorer integration guide.

Configuration Playground integration guide.

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Docs appear on JOC docs site

✓ Sidebar navigation works

✓ API docs accurate

✓ Playground linked

✓ sync-documentation includes object-diff

===============================================================================
STOP CONDITION
===============================================================================

STOP after Documentation Integration.

Proceed to Release (4.3.9).
