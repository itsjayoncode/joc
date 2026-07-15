# JOC ENGINEERING TASK
# Phase 4.3.9 — Playground Release
# Package: @jayoncode/object-diff

===============================================================================
ROLE
===============================================================================

You are acting as a Release Engineer, QA Lead, Accessibility Specialist, and DevOps Engineer.

You are preparing @jayoncode/object-diff and its playground for production release.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.2 — Core Engine complete

✓ Phase 4.3.1–4.3.8 complete

===============================================================================
OBJECTIVE
===============================================================================

Ship Version 1 of @jayoncode/object-diff with a production-ready playground.

===============================================================================
OUTPUT
===============================================================================

RELEASE_CHECKLIST.md

QA_CHECKLIST.md

KNOWN_ISSUES.md

REGRESSION_REPORT.md (template)

engineering/021-playground-release.md

Deployment configuration

===============================================================================
QA
===============================================================================

Manual QA all playground pages

Diff Explorer all views

Patch apply/revert

JSON Viewer edge cases

Performance presets

Mobile responsive check

Theme toggle

Routing with GitHub Pages base path

===============================================================================
PERFORMANCE
===============================================================================

Verify benchmarks documented in README

No regressions vs 4.2.7 targets

===============================================================================
ACCESSIBILITY
===============================================================================

Keyboard navigation audit

Screen reader spot check

Color contrast verification

Focus management in modals/panels

===============================================================================
BROWSER TESTING
===============================================================================

Chrome

Firefox

Safari

Edge

Document known browser-specific issues.

===============================================================================
DEPLOYMENT
===============================================================================

GitHub Pages bundle into docs site

VITE_PLAYGROUND_BASE=/joc/playground/object-diff/

CI workflow updates

Verify live URLs after deploy

===============================================================================
NPM RELEASE
===============================================================================

Changeset for 1.0.0 (or agreed version)

README npm keywords and description

package.json exports verified

pnpm package:integrity passes

===============================================================================
BROWSER-LIFECYCLE ADOPTION
===============================================================================

Optional but recommended for 1.0: integrate object-diff into browser-session-playground State Explorer.

Document migration from ad-hoc comparison if any existed.

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ QA checklist complete

✓ Playground deployed

✓ npm package published

✓ Docs live

✓ CI green

✓ RELEASE_NOTES.md written

===============================================================================
STOP CONDITION
===============================================================================

Phase 4.3 complete.

Package is production-ready.

Future work moves to Phase 4.4.
