# JOC ENGINEERING TASK
# Phase 4.2.6 — Serializer
# Package: @jayoncode/object-diff

===============================================================================
ROLE
===============================================================================

You are acting as a Principal TypeScript Engineer, Developer Experience Engineer, and Technical Writer.

You are implementing the Serializer for @jayoncode/object-diff.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.2.4 — Difference Engine

✓ Phase 4.2.5 — Patch Engine (optional formats)

===============================================================================
OBJECTIVE
===============================================================================

Export diffs and patches in human-readable and machine-readable formats.

Serializers must be tree-shakeable.

===============================================================================
OUTPUT
===============================================================================

Implement

packages/object-diff/src/serialize/

Optional subpath export

@jayoncode/object-diff/serialize

===============================================================================
IMPLEMENTATION
===============================================================================

Implement serializers for

JSON

Pretty JSON

Compact

Tree

Table

Markdown

HTML

Each format is a separate module for tree-shaking.

----------------------------------
API Design
----------------------------------

serialize(diff, format, options?)

or format-specific functions

toJson(diff)

toMarkdown(diff)

toHtml(diff)

Document chosen API in engineering doc.

===============================================================================
FORMAT REQUIREMENTS
===============================================================================

JSON — machine interchange

Pretty JSON — devtools clipboard export

Compact — minimal whitespace

Tree — indented hierarchy for console

Table — columnar for terminal/UI tables

Markdown — documentation and PR comments

HTML — playground and docs embedding

===============================================================================
ARCHITECTURE RULES
===============================================================================

serialize/ depends on types from compare/ and patch/.

compare/ and patch/ must NOT depend on serialize/.

HTML serializer must escape user content (XSS-safe).

===============================================================================
TESTING
===============================================================================

✓ Snapshot tests per format

✓ Empty diff

✓ Large nested diff

✓ HTML escaping

✓ Markdown special characters

===============================================================================
DOCUMENTATION
===============================================================================

packages/object-diff/docs/serialize.md

packages/object-diff/engineering/012-serializer.md

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ All formats implemented

✓ Tree-shakeable exports

✓ Tests pass

✓ XSS-safe HTML

===============================================================================
STOP CONDITION
===============================================================================

STOP after Serializer.

Do NOT begin performance optimization milestone yet.
