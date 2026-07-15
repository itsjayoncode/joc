# JOC ENGINEERING TASK
# Phase 4.3.7 — Framework Examples
# Application: Object Diff Playground + Examples

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Engineer, Technical Writer, and Framework Integration Specialist.

You are creating framework integration examples for @jayoncode/object-diff.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.2.4 — Difference Engine

✓ Phase 4.3.3 — Diff Explorer (reference implementation)

===============================================================================
OBJECTIVE
===============================================================================

Demonstrate object-diff usage across frameworks and environments.

Examples must compile and serve as integration references.

===============================================================================
OUTPUT
===============================================================================

Create examples in

packages/object-diff/examples/

apps/object-diff-playground/src/examples/ (if inline demos)

Document in

docs/examples/

engineering/020-framework-examples.md

===============================================================================
EXAMPLES TO CREATE
===============================================================================

Vanilla TypeScript

React (useMemo dirty check, useEffect on config change)

Vue (computed diff, watch)

Angular (service-based diff)

Svelte (reactive store comparison)

Next.js (server + client considerations)

Node.js (CLI script, config migration)

Express (request body audit middleware pattern)

Each example should show a realistic use case, not hello-world.

===============================================================================
PATTERNS TO DEMONSTRATE
===============================================================================

Form dirty detection

Config change logging

Undo/redo with patches

State sync between components

API response comparison in tests

===============================================================================
QUALITY
===============================================================================

✓ Examples compile in CI

✓ Minimal dependencies per example

✓ README per example folder

✓ Link from playground Examples page

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ At least vanilla, React, Vue, Node examples complete

✓ Examples documented on docs site

✓ Playground links to examples

===============================================================================
STOP CONDITION
===============================================================================

STOP after Framework Examples.

Do NOT begin full documentation integration (4.3.8).
