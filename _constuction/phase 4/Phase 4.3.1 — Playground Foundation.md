# JOC ENGINEERING TASK
# Phase 4.3.1 — Playground Foundation
# Package: @jayoncode/object-diff

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Architect, Developer Experience Engineer, React Engineer, UI System Designer, and Documentation Engineer.

You are building the official Object Diff Playground.

This application will become

• Development Environment

• Integration Test Environment

• Interactive Documentation

• Product Showcase

• Manual QA Environment

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 4.2.4 — Difference Engine (minimum)

Prefer

✓ Phase 4.2 core engine complete

===============================================================================
OBJECTIVE
===============================================================================

Implement ONLY the Playground Foundation.

Do NOT implement Diff Explorer yet.

Do NOT implement Patch Explorer yet.

Only build playground infrastructure.

===============================================================================
OUTPUT
===============================================================================

Create

apps/

object-diff-playground/

Or extend an existing JOC playground app if architecture decision favors a unified playground — document the decision.

Recommended: standalone app mirroring browser-session-playground patterns.

===============================================================================
IMPLEMENTATION
===============================================================================

----------------------------------
1. Product Vision
----------------------------------

Engineering tool for comparing objects interactively.

Fast, modular, extensible, production quality.

----------------------------------
2. Architecture
----------------------------------

Separate

Application / UI / Playground Logic / object-diff Integration / Routing / Services

----------------------------------
3. Folder Structure
----------------------------------

src/app, pages, layouts, components, hooks, services, providers, routes, styles, lib, constants

Document every folder.

----------------------------------
4. Technology Stack
----------------------------------

React, TypeScript, Vite, React Router, CSS Modules or Tailwind, Vitest, ESLint, Prettier, pnpm workspace.

Match browser-session-playground conventions where sensible.

----------------------------------
5. Routing
----------------------------------

Initial pages

/ Dashboard

/about

/settings

/not-found

Future routes

/diff

/patch

/json

/performance

/examples

----------------------------------
6. State Management
----------------------------------

Playground UI state only (theme, sidebar, preferences).

NOT object-diff internal state.

----------------------------------
7. Theme System
----------------------------------

Light / Dark / System

ThemeProvider, tokens, persistent preference.

----------------------------------
8. Layout
----------------------------------

AppShell, Header, Sidebar, Content, Footer, StatusBar.

----------------------------------
9. Component Standards
----------------------------------

Reusable, accessible, composable, strongly typed.

----------------------------------
10. object-diff Integration
----------------------------------

Wire package dependency @jayoncode/object-diff.

Verify workspace import works.

No feature pages yet — only prove integration point.

===============================================================================
DOCUMENTATION
===============================================================================

README.md

docs/playground.md

engineering/000-playground-foundation.md

===============================================================================
QUALITY REQUIREMENTS
===============================================================================

✓ Strict TypeScript

✓ ESLint / Prettier clean

✓ Responsive

✓ Accessible

✓ GitHub Pages base path support (learn from browser-session-playground)

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Vite app created

✓ Routing and layout complete

✓ Theme system complete

✓ object-diff workspace dependency wired

✓ Documentation written

✓ Ready for Diff Explorer (4.3.3)

===============================================================================
STOP CONDITION
===============================================================================

STOP after Playground Foundation.

Do NOT build Diff Explorer.
