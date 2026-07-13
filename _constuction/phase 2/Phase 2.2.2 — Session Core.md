# JOC ENGINEERING TASK
# Phase 2.2.2 — Session Core
# Package: @jayoncode/browser-session

===============================================================================
ROLE
===============================================================================

You are acting as a Principal TypeScript Engineer,
Software Architect,
Open Source Maintainer,
Library Infrastructure Engineer,
and Test-Driven Development Expert.

You are implementing the Browser Session Core.

This is NOT a design task.

This is a production implementation task.

The engineering documentation created during Phase 2.1 is now frozen and is the
source of truth.

Do NOT redesign the architecture.

Do NOT invent new public APIs.

Do NOT modify engineering documents unless a genuine implementation issue is
identified.

===============================================================================
DEPENDENCIES
===============================================================================

This milestone depends on

✓ Core Infrastructure (2.2.0)

✓ Typed Event Infrastructure (2.2.1)

Review and follow all engineering documentation before implementation.

===============================================================================
OBJECTIVE
===============================================================================

Implement the Browser Session Core.

The Session Core becomes the central coordinator of the entire package.

It does NOT implement browser features.

It only coordinates them.

The Session Core owns

• Lifecycle

• Configuration

• State

• Module registration

• Event infrastructure

Future modules must register with the Session Core instead of communicating with
each other directly.

===============================================================================
OUTPUT
===============================================================================

Implement

src/core/session/

following the approved architecture.

===============================================================================
IMPLEMENTATION
===============================================================================

Implement the following components.

----------------------------------
1. BrowserSession
----------------------------------

Implement the BrowserSession class.

Responsibilities

• Own application lifecycle

• Own configuration

• Own event infrastructure

• Manage registered modules

• Maintain internal session state

• Expose the public API

BrowserSession should become the only public runtime object.

Do not implement browser-specific behavior.

----------------------------------
2. Session Lifecycle
----------------------------------

Implement lifecycle management.

Examples

Created

Initialized

Running

Paused

Stopped

Destroyed

Document valid transitions.

Prevent invalid transitions.

Lifecycle transitions must emit internal events.

----------------------------------
3. Session State
----------------------------------

Implement internal state management.

Responsibilities

Current State

Previous State

Transition Validation

State Updates

Readonly Public State

Future browser modules will update this state.

Do not implement browser state detection.

----------------------------------
4. Module Registry
----------------------------------

Implement an internal module registry.

Responsibilities

Register Module

Unregister Module

Initialize Modules

Destroy Modules

Dependency Ordering

Duplicate Protection

Future modules such as Visibility, Focus, Idle, and Connectivity will register
through this registry.

Do not implement these modules yet.

----------------------------------
5. Session Context
----------------------------------

Implement an internal Session Context shared by modules.

Context should expose

Configuration

Event Dispatcher

Current State

Feature Detection

Logger (placeholder)

The context must remain internal.

===============================================================================
ARCHITECTURE RULES
===============================================================================

BrowserSession becomes the orchestrator.

Modules never communicate directly.

Required flow

Browser Module

↓

Session Core

↓

Event Infrastructure

↓

Developer

Modules must never emit events directly.

Only Session Core may dispatch public session events.

===============================================================================
PUBLIC API
===============================================================================

Implement only the approved public API.

Examples

createBrowserSession()

start()

stop()

destroy()

status()

state()

on()

off()

once()

Do not add additional public methods.

Do not expose internal registries.

Keep Version 1 intentionally minimal.

===============================================================================
SESSION STATE
===============================================================================

Implement a strongly typed session state model.

Example lifecycle

CREATED

↓

INITIALIZED

↓

RUNNING

↓

PAUSED

↓

STOPPED

↓

DESTROYED

Invalid transitions must be rejected with typed errors.

===============================================================================
MODULE CONTRACT
===============================================================================

Design an internal module interface.

Every future module must implement a consistent lifecycle.

Examples

initialize()

start()

stop()

destroy()

Modules should never know about each other.

All coordination happens through Session Core.

===============================================================================
SSR
===============================================================================

The Session Core must remain SSR-safe.

Construction must never access

window

document

navigator

history

location

Browser APIs may only be accessed later by browser-specific modules.

===============================================================================
TESTING
===============================================================================

Create comprehensive unit tests.

Test

✓ Session creation

✓ Lifecycle transitions

✓ Invalid transitions

✓ Configuration ownership

✓ Event integration

✓ Module registration

✓ Duplicate registration

✓ Module removal

✓ Destroy

✓ State updates

✓ SSR safety

Coverage target

100%

===============================================================================
DOCUMENTATION
===============================================================================

Update

README.md

docs/session-core.md

engineering/012-session-core.md

Document

Architecture

Responsibilities

Lifecycle

Public API

Module registration

State management

===============================================================================
EXAMPLES
===============================================================================

Create examples demonstrating

Creating a session

Starting a session

Stopping a session

Destroying a session

Listening for session events

Registering a mock module

Examples should compile and act as reference documentation.

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

✓ BrowserSession is implemented.

✓ Session lifecycle is implemented.

✓ Session state management is implemented.

✓ Module registry is implemented.

✓ Session context is implemented.

✓ Public API is implemented.

✓ Tests pass.

✓ Documentation updated.

✓ Examples added.

✓ No browser-specific logic exists.

===============================================================================
STOP CONDITION
===============================================================================

When all acceptance criteria are complete

STOP.

Do NOT implement

Visibility

Focus

Connectivity

Idle

Lifecycle module

Cross Tab

Plugin System

The Session Core must be complete before browser modules begin.

===============================================================================
FINAL REVIEW
===============================================================================

Before finishing

Review

Architecture

Dependency graph

Lifecycle correctness

State management

Module isolation

Public API

Memory management

SSR safety

Maintainability

Ensure the Session Core is capable of supporting future modules without
architectural changes.

Only then mark the milestone complete.