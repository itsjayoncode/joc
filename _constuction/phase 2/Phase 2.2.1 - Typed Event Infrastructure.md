# JOC ENGINEERING TASK
# Phase 2.2.1 — Typed Event Infrastructure
# Package: @jayoncode/browser-session

===============================================================================
ROLE
===============================================================================

You are acting as a Principal TypeScript Engineer,
Software Architect,
Open Source Maintainer,
Library Infrastructure Engineer,
and Test-Driven Development Expert.

You are implementing the Browser Session Event Infrastructure.

This is NOT a design task.

This is a production implementation task.

All engineering documents created during Phase 2.1 are now considered frozen and
are the source of truth.

Do NOT redesign the architecture.

Do NOT invent new APIs.

Do NOT modify the engineering documents unless a genuine implementation issue is
discovered.

===============================================================================
DEPENDENCIES
===============================================================================

Before implementing, review and follow:

000-product-vision.md

001-problem-research.md

002-browser-platform-research.md

003-system-architecture.md

004-public-api-design.md

005-event-specification.md

006-configuration-design.md

007-runtime-compatibility.md

008-folder-architecture.md

009-implementation-roadmap.md

010-core-infrastructure.md

Everything implemented must conform to these documents.

===============================================================================
OBJECTIVE
===============================================================================

Implement the complete Typed Event Infrastructure.

The event infrastructure must be generic.

It must have ZERO browser-specific logic.

It must have ZERO framework-specific logic.

It must be reusable by every Browser Session module.

No runtime dependencies.

Strict TypeScript only.

===============================================================================
OUTPUT
===============================================================================

Implement the complete event infrastructure inside

src/events/

following the architecture defined in the engineering documents.

===============================================================================
IMPLEMENTATION
===============================================================================

Implement the following components.

----------------------------------
1. Typed EventEmitter
----------------------------------

Responsibilities

• Register listeners

• Remove listeners

• Register one-time listeners

• Emit events

• Remove all listeners

• Destroy emitter

Requirements

• Fully typed

• Generic EventMap

• No any

• No runtime dependencies

• Synchronous dispatch

• Listener execution order must match registration order.

----------------------------------
2. Event Registry
----------------------------------

Implement a registry responsible for

• Event definitions

• Listener collections

• Event metadata

• Listener lookup

• Event statistics

The registry should be internal.

No browser logic.

----------------------------------
3. Subscription Manager
----------------------------------

Implement

on()

off()

once()

unsubscribe()

Subscription cleanup

Duplicate listener handling

Memory-safe cleanup

No leaks.

----------------------------------
4. Event Dispatcher
----------------------------------

Implement

emit()

Dispatch pipeline

Metadata creation

Timestamp generation

Listener invocation

Error isolation

Dispatch ordering

Event propagation

Dispatcher must become the only component allowed to dispatch events.

----------------------------------
5. Listener Management
----------------------------------

Implement

Listener storage

Listener removal

Listener counting

Listener existence checks

removeAll()

destroy()

Memory cleanup

----------------------------------
6. Event Types
----------------------------------

Implement

Typed EventMap

EventName

EventPayload

EventMetadata

Listener

Subscription

Internal event types

Public event types

Maintain complete type safety.

===============================================================================
ARCHITECTURE RULES
===============================================================================

Event flow must always be

Module

↓

Event Dispatcher

↓

Event Registry

↓

Listener Collection

↓

Developer Callback

Modules must never invoke listeners directly.

All events must pass through the dispatcher.

===============================================================================
EVENT DESIGN
===============================================================================

Every dispatched event should internally contain metadata such as

• Event name

• Timestamp

• Payload

• Source

• Internal metadata

The metadata structure should support future debugging and diagnostics without
requiring breaking API changes.

===============================================================================
PUBLIC API
===============================================================================

The public EventEmitter should expose only

on()

off()

once()

emit()

listeners()

listenerCount()

hasListeners()

removeAll()

destroy()

Do not add wildcard events.

Do not add middleware.

Do not add asynchronous dispatch.

Do not add priorities.

Keep Version 1 intentionally minimal.

Listener invocation must be synchronous and preserve registration order for
predictable behavior. This mirrors the well-established semantics of Node.js
EventEmitter.  [oai_citation:0‡Node.js](https://nodejs.org/api/events.html?utm_source=chatgpt.com)

===============================================================================
TYPE SAFETY
===============================================================================

The entire infrastructure must be strongly typed.

Examples

Correct

emitter.on("page:hidden", ...)

emitter.emit("page:hidden", payload)

Incorrect payloads should fail at compile time.

Never use

any

Prefer

Generics

Mapped Types

Conditional Types

Inference

The EventMap should drive payload typing throughout the API.

===============================================================================
SSR
===============================================================================

The event infrastructure must be completely SSR-safe.

It must not reference

window

document

navigator

location

history

or any browser API.

===============================================================================
TESTING
===============================================================================

Create comprehensive unit tests.

Test

✓ on()

✓ off()

✓ once()

✓ emit()

✓ listener ordering

✓ duplicate listeners

✓ removeAll()

✓ destroy()

✓ listenerCount()

✓ hasListeners()

✓ registry

✓ metadata generation

✓ subscription cleanup

✓ error isolation

✓ memory cleanup

Coverage target

100%

===============================================================================
DOCUMENTATION
===============================================================================

Update

README.md

docs/events.md

engineering/011-event-infrastructure.md

Document

Architecture

Public API

Internal flow

Examples

Design decisions

===============================================================================
EXAMPLES
===============================================================================

Create examples demonstrating

Basic subscription

One-time listeners

Removing listeners

Multiple listeners

Typed payloads

Emitter destruction

Examples should compile and serve as documentation.

===============================================================================
QUALITY REQUIREMENTS
===============================================================================

Every file must satisfy

✓ Strict TypeScript

✓ No any

✓ ESLint clean

✓ Prettier clean

✓ Tree Shakeable

✓ Side-effect free

✓ Fully documented with TSDoc

✓ No circular dependencies

✓ Zero runtime dependencies

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

This milestone is complete only when

✓ Typed EventEmitter is implemented.

✓ Event Registry is implemented.

✓ Subscription Manager is implemented.

✓ Event Dispatcher is implemented.

✓ Listener Management is implemented.

✓ Event Types are implemented.

✓ Tests pass.

✓ Documentation updated.

✓ Examples added.

✓ Public API reviewed.

✓ No browser-specific code exists.

===============================================================================
STOP CONDITION
===============================================================================

When all acceptance criteria are complete

STOP.

Do NOT begin Session Core.

Do NOT implement browser modules.

Do NOT implement Visibility.

Do NOT implement Focus.

Do NOT implement Connectivity.

Do NOT implement Idle.

Do NOT implement Lifecycle.

Do NOT implement Cross Tab.

Do NOT implement Plugins.

End the task after the Typed Event Infrastructure is fully complete.

===============================================================================
FINAL REVIEW
===============================================================================

Before finishing

Review

Architecture

Dependency graph

Naming

Type safety

Memory management

Listener lifecycle

Performance

Maintainability

Identify improvements before marking the milestone complete.