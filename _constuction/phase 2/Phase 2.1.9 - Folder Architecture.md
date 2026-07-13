# JOC ENGINEERING TASK
# Phase 2.1.9 — Package Folder Architecture
# Package: @jayoncode/browser-session

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Software Architect,
TypeScript Library Architect,
Open Source Maintainer,
Clean Architecture Engineer,
and Technical Writer.

Your responsibility is NOT to implement Browser Session.

Your responsibility is to design the internal package architecture.

This architecture becomes the permanent blueprint for every future contributor.

Assume this package will be maintained for the next 10+ years.

Every folder should have one clear responsibility.

Every module should follow the Single Responsibility Principle.

Think like the maintainers of

- Vite
- TanStack
- VueUse
- Floating UI
- Zod

The goal is long-term maintainability.

===============================================================================
OBJECTIVE
===============================================================================

Design the complete folder architecture for Browser Session.

Do NOT generate implementation code.

Do NOT create placeholder files.

Produce engineering documentation only.

The resulting document should explain

- Every folder
- Every responsibility
- Every dependency direction
- Every architectural rule

===============================================================================
OUTPUT
===============================================================================

Create

packages/

browser-session/

engineering/

008-folder-architecture.md

===============================================================================
SECTION 1
ARCHITECTURE PHILOSOPHY
===============================================================================

Explain

Why Browser Session is modular.

Why responsibilities are separated.

Why internal modules should remain isolated.

Why composition is preferred over coupling.

Define architectural goals.

===============================================================================
SECTION 2
PACKAGE STRUCTURE
===============================================================================

Design the complete folder tree.

Example

src/

browser/

modules/

events/

plugins/

types/

utils/

constants/

errors/

core/

Explain every folder.

Explain why it exists.

Explain what belongs there.

Explain what must never be placed there.

===============================================================================
SECTION 3
CORE
===============================================================================

Design

src/core/

Document

Responsibilities

Ownership

Initialization

Lifecycle

Session Core

State Machine

Module Coordinator

Allowed dependencies

Forbidden dependencies

===============================================================================
SECTION 4
BROWSER
===============================================================================

Design

src/browser/

Document

Browser wrappers

Browser feature detection

Browser abstractions

Native browser APIs

No business logic

Explain why Browser APIs should remain isolated.

===============================================================================
SECTION 5
MODULES
===============================================================================

Design

src/modules/

Each browser capability should become a module.

Examples

visibility/

focus/

connectivity/

idle/

lifecycle/

cross-tab/

Document

Responsibilities

Public interface

Internal interface

Dependencies

Communication rules

===============================================================================
SECTION 6
EVENTS
===============================================================================

Design

src/events/

Document

EventEmitter

Registry

Event definitions

Event metadata

Internal event pipeline

Event dispatch

Subscription

Ownership

===============================================================================
SECTION 7
PLUGINS
===============================================================================

Design

src/plugins/

Document

Plugin Manager

Plugin Context

Plugin Registration

Lifecycle Hooks

Plugin Communication

Isolation

Extension Points

===============================================================================
SECTION 8
TYPES
===============================================================================

Design

src/types/

Document

Shared types

Public types

Internal types

Naming conventions

Export rules

===============================================================================
SECTION 9
UTILITIES
===============================================================================

Design

src/utils/

Document

Helper functions

Pure utilities

Validation

Assertions

Formatting

Rules

Utilities must remain stateless.

Utilities must never depend on Browser Session.

===============================================================================
SECTION 10
CONSTANTS
===============================================================================

Design

src/constants/

Document

Event names

Configuration defaults

Internal constants

Feature flags

Rules

No business logic.

===============================================================================
SECTION 11
ERRORS
===============================================================================

Design

src/errors/

Document

BrowserSessionError

ConfigurationError

PluginError

UnsupportedFeatureError

Rules

Centralized errors only.

===============================================================================
SECTION 12
DEPENDENCY RULES
===============================================================================

Design dependency direction.

Example

Browser

↓

Modules

↓

Session Core

↓

Events

↓

Public API

Document

Allowed imports

Forbidden imports

Circular dependency prevention

Layering rules

===============================================================================
SECTION 13
PUBLIC EXPORTS
===============================================================================

Design

index.ts

Subpath exports

Barrel files

Internal modules

Public modules

Rules

Only documented APIs may be exported.

===============================================================================
SECTION 14
FILE NAMING
===============================================================================

Define

Folder names

File names

Type names

Class names

Function names

Constant names

Test files

Example files

Documentation files

Naming consistency rules.

===============================================================================
SECTION 15
IMPORT STRATEGY
===============================================================================

Define

Absolute imports

Relative imports

Barrel imports

Cross-module imports

Internal imports

Export strategy

Dependency direction

===============================================================================
SECTION 16
SCALABILITY
===============================================================================

Document how Browser Session should evolve.

How new modules are added.

How plugins are added.

How experimental features are isolated.

How deprecated modules are removed.

How Version 2 should extend the architecture.

===============================================================================
SECTION 17
ARCHITECTURE DECISIONS
===============================================================================

Record Architecture Decision Records.

For every important architectural decision include

Decision

Reason

Alternatives

Tradeoffs

Future Impact

Rejected Alternatives

===============================================================================
SECTION 18
ARCHITECTURE CHECKLIST
===============================================================================

Every folder must satisfy

✓ Single Responsibility

✓ Low Coupling

✓ High Cohesion

✓ Testability

✓ Clear Ownership

✓ Stable Dependencies

✓ Easy Discoverability

If a folder fails these principles

recommend redesign.

===============================================================================
OUTPUT REQUIREMENTS
===============================================================================

Produce one comprehensive engineering document.

Use

Markdown

Folder trees

Architecture diagrams

Dependency diagrams

Decision tables

Examples

Flow diagrams

Do NOT generate implementation code.

Do NOT generate TypeScript.

Only design the package architecture.

===============================================================================
FINAL REVIEW
===============================================================================

Review the architecture critically.

Answer

Can a new contributor understand the project within 15 minutes?

Are responsibilities clearly separated?

Could circular dependencies occur?

Is the architecture scalable?

Would this structure still work after adding

20 modules

50 plugins

100 events?

Recommend improvements before implementation begins.