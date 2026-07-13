# JOC ENGINEERING TASK
# Phase 2.2.3 — Visibility Module
# Package: @jayoncode/browser-session

===============================================================================
ROLE
===============================================================================

You are acting as a Principal TypeScript Engineer,
Browser Platform Engineer,
Software Architect,
Open Source Maintainer,
and Test-Driven Development Expert.

You are implementing the Visibility Module.

This is NOT a design task.

This is a production implementation task.

All engineering documentation from Phase 2.1 is frozen and becomes the source
of truth.

Do NOT redesign the architecture.

Do NOT invent new APIs.

Implement only the Visibility Module.

===============================================================================
DEPENDENCIES
===============================================================================

This milestone depends on

✓ Core Infrastructure (2.2.0)

✓ Typed Event Infrastructure (2.2.1)

✓ Session Core (2.2.2)

Review all engineering documentation before implementation.

===============================================================================
OBJECTIVE
===============================================================================

Implement the Visibility Module.

The module is responsible ONLY for page visibility.

It must use the Page Visibility API.

It must integrate with Session Core.

It must emit Browser Session events.

It must never expose native browser APIs directly.

===============================================================================
OUTPUT
===============================================================================

Implement

src/modules/visibility/

following the approved architecture.

===============================================================================
IMPLEMENTATION
===============================================================================

Implement the following components.

----------------------------------
1. VisibilityModule
----------------------------------

Responsibilities

• Observe page visibility

• Listen for visibilitychange

• Determine current visibility state

• Notify Session Core

• Clean up listeners

The module owns visibility only.

----------------------------------
2. Visibility Adapter
----------------------------------

Create a browser adapter.

Responsibilities

Read

document.visibilityState

document.hidden

Register

visibilitychange

Remove listeners

No business logic.

Browser interaction only.

----------------------------------
3. Visibility State
----------------------------------

Implement strongly typed visibility state.

Supported values

visible

hidden

Unknown state handling

Initial state detection

Previous state tracking

State transitions

----------------------------------
4. Session Integration
----------------------------------

The module must communicate ONLY through Session Core.

Never dispatch events directly.

Required flow

Browser

↓

Visibility Module

↓

Session Core

↓

Event Infrastructure

↓

Developer

----------------------------------
5. Feature Detection
----------------------------------

Use the existing Feature Detection system.

If Page Visibility API is unavailable

Fail gracefully.

Do not throw.

Disable the module.

Report capability status internally.

===============================================================================
EVENTS
===============================================================================

Use the approved event specification.

Examples

page:visible

page:hidden

VisibilityChanged

Do not invent additional events.

Every emitted event must include metadata.

===============================================================================
SSR
===============================================================================

The module must be SSR-safe.

Construction must never access

window

document

navigator

Browser APIs may only be accessed during initialization.

Construction must always succeed in SSR.

===============================================================================
ERROR HANDLING
===============================================================================

Use the centralized Error System.

Never throw because

Page Visibility API is unavailable.

Gracefully disable functionality.

Unexpected internal failures should use typed errors.

===============================================================================
TESTING
===============================================================================

Create comprehensive unit tests.

Test

✓ Initial visibility detection

✓ Visible → Hidden

✓ Hidden → Visible

✓ Duplicate events

✓ Event ordering

✓ Session Core integration

✓ Feature unavailable

✓ Listener cleanup

✓ Destroy

✓ SSR

✓ Reinitialization

Coverage target

100%

===============================================================================
DOCUMENTATION
===============================================================================

Update

README.md

docs/visibility.md

engineering/013-visibility-module.md

Document

Architecture

Browser APIs

Integration

Limitations

Browser compatibility

Examples

===============================================================================
EXAMPLES
===============================================================================

Create examples demonstrating

Basic session

Visibility events

Pausing work when hidden

Resuming work when visible

Framework-agnostic examples

Examples must compile.

===============================================================================
QUALITY REQUIREMENTS
===============================================================================

Every file must satisfy

✓ Strict TypeScript

✓ No any

✓ ESLint clean

✓ Prettier clean

✓ Tree-shakeable

✓ Side-effect free

✓ Fully documented with TSDoc

✓ No circular dependencies

✓ Zero runtime dependencies

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

This milestone is complete only when

✓ Visibility Module implemented

✓ Browser adapter implemented

✓ Session Core integration complete

✓ Event integration complete

✓ SSR-safe

✓ Feature detection used

✓ Tests passing

✓ Documentation updated

✓ Examples added

✓ No browser logic outside the browser adapter

===============================================================================
STOP CONDITION
===============================================================================

When this milestone is complete

STOP.

Do NOT implement

Focus

Connectivity

Idle

Lifecycle

Cross Tab

Plugin System

Only complete the Visibility Module.

===============================================================================
FINAL REVIEW
===============================================================================

Before finishing

Review

Architecture

Browser API usage

SSR safety

Event ordering

Memory cleanup

Performance

Maintainability

Confirm

• No polling

• No timers

• No browser API leakage

• No circular dependencies

Mark the milestone complete only after all acceptance criteria pass.